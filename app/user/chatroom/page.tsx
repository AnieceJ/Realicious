"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

import Container from "@/app/user/_components/container"

interface Room {
  id: number;
  name: string;
  type: string; // "PUBLIC_GROUP" | "PRIVATE_GROUP"
  createdBy: number;
  _count?: { members: number };
}

interface Message {
  id?: number;
  senderId: number;
  content: string;
  sender?: { id: number; account: string };
}

export default function Chatroom() {
  const { user, loading } = useUser();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  // 1. 建立房間表單 State
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<
    "PUBLIC_GROUP" | "PRIVATE_GROUP"
  >("PUBLIC_GROUP");
  const [newRoomPassword, setNewRoomPassword] = useState("");

  // 2. 私密房密碼彈窗 State
  const [passwordModalRoom, setPasswordModalRoom] = useState<Room | null>(null);
  const [inputPassword, setInputPassword] = useState("");

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // 🌟 修復 1：直接從 user 導出 currentUserId，不要用 useState 避免同步延遲與 NaN
  const currentUserId = user?.id ? Number(user.id) : null;

  const socketRef = useRef<Socket | null>(null);

  // 1. 初始化 Socket 連線（🌟 修復 2：依賴陣列設為 []，建立穩定連線，不因 rooms 改變而一直重連）
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    socketRef.current = io("http://localhost:3001", {
      auth: { token },
    });

    const socket = socketRef.current;

    socket.on("receive_message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("load_history", (historyMessages: Message[]) => {
      setMessages(historyMessages);
    });

    socket.on("room_created", (newRoom: Room) => {
      setRooms((prev) => [newRoom, ...prev]);
    });

    socket.on(
      "room_member_updated",
      ({ roomId, memberCount }: { roomId: number; memberCount: number }) => {
        setRooms((prevRooms) =>
          prevRooms.map((room) => {
            if (room.id === roomId) {
              return {
                ...room,
                _count: { members: memberCount },
              };
            }
            return room;
          }),
        );
      },
    );

    // 後端確認可以進入房間
    socket.on("join_success", ({ room }: { room: Room }) => {
      setCurrentRoom(room);
      setPasswordModalRoom(null); // 關閉密碼彈窗
      setInputPassword("");
    });

    // 後端要求輸入密碼
    socket.on("password_required", ({ roomId }: { roomId: number }) => {
      // 🌟 使用 setRooms 的 callback 或搜尋即時狀態，避免抓不到最新的 rooms
      setRooms((latestRooms) => {
        const target = latestRooms.find((r) => r.id === roomId);
        if (target) {
          setPasswordModalRoom(target);
        }
        return latestRooms;
      });
    });

    socket.on("error_message", (data: { message: string }) => {
      alert(data.message);
    });

    // 監聽「房間刪除」廣播
    socket.on("room_deleted", ({ roomId }: { roomId: number }) => {
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));

      setCurrentRoom((prevCurrent) => {
        if (prevCurrent && prevCurrent.id === roomId) {
          alert("該房間已被建立者刪除！");
          return null;
        }
        return prevCurrent;
      });
    });

    return () => {
      socket.off("receive_message");
      socket.off("load_history");
      socket.off("room_created");
      socket.off("room_member_updated");
      socket.off("join_success");
      socket.off("error_message");
      socket.off("password_required");
      socket.off("room_deleted");
      socket.disconnect();
    };
  }, []); // 🌟 保持空陣列，確保 Socket 只有在 Mount 時連線一次

  // 2. 進入頁面時向 API 撈取房間清單
  const fetchRooms = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost:3001/user/api/chatrooms", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setRooms(result.data);
    } catch (err) {
      console.error("獲取房間清單失敗:", err);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchRooms();
    };
    loadInitialData();
  }, []);

  // 3. 處理「建立房間」
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    if (newRoomType === "PRIVATE_GROUP" && !newRoomPassword.trim()) {
      alert("建立私密房間時請設定密碼！");
      return;
    }

    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost:3001/user/api/chatrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newRoomName,
          type: newRoomType,
          password: newRoomPassword,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setNewRoomName("");
        setNewRoomPassword("");
        setNewRoomType("PUBLIC_GROUP");
      } else {
        alert(result.message || "建立房間失敗");
      }
    } catch (err) {
      console.error("建立房間失敗:", err);
    }
  };

  // 點擊「進入房間」
  const handleJoinRoom = (room: Room) => {
    if (!socketRef.current) return;

    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }

    setMessages([]); // 先清空舊訊息
    socketRef.current.emit("join_room", { roomId: room.id });
  };

  // 彈窗提交密碼
  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalRoom || !socketRef.current || !inputPassword.trim())
      return;

    socketRef.current.emit("join_room", {
      roomId: passwordModalRoom.id,
      password: inputPassword,
    });
  };

  // 發送訊息
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current || !currentRoom) return;

    socketRef.current.emit("send_message", {
      roomId: currentRoom.id,
      content: messageInput,
    });

    setMessageInput("");
  };

  // 處理「刪除房間」點擊事件
  const handleDeleteRoom = async (roomId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止觸發 handleJoinRoom

    if (!confirm("確定要刪除這個房間嗎？此動作無法復原！")) return;

    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost:3001/user/api/chatrooms/${roomId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await res.json();
      if (!result.success) {
        alert(result.message);
      }
    } catch (err) {
      console.error("刪除房間失敗:", err);
    }
  };

  // 處理「離開房間」
  const handleLeaveRoom = () => {
    if (!currentRoom || !socketRef.current) return;

    // 發送 Socket 事件通知後端
    socketRef.current.emit("leave_room", { roomId: currentRoom.id });

    // 重置前端當前房間狀態
    setCurrentRoom(null);
    setMessages([]);
  };

  if (loading) {
    return <div>載入使用者資料中...</div>;
  }
  if (!user) {
    return <div>請先登入以使用聊天室</div>;
  }

  return (
    <Container className="flex flex-col">
       <div className="border w-full h-20">
        <form
          onSubmit={handleCreateRoom}
        >
          <input
            type="text"
            placeholder="房間名稱..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />

          <div>
            <label>
              <input
                type="radio"
                value="PUBLIC_GROUP"
                checked={newRoomType === "PUBLIC_GROUP"}
                onChange={() => setNewRoomType("PUBLIC_GROUP")}
              />
              公開
            </label>
            <label>
              <input
                type="radio"
                value="PRIVATE_GROUP"
                checked={newRoomType === "PRIVATE_GROUP"}
                onChange={() => setNewRoomType("PRIVATE_GROUP")}
              />
              私密 🔒
            </label>
          </div>

          {newRoomType === "PRIVATE_GROUP" && (
            <input
              type="password"
              placeholder="設定密碼..."
              value={newRoomPassword}
              onChange={(e) => setNewRoomPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
          >
            建立房間
          </button>
        </form>
       </div>
       <div className="flex w-full">
 {/* 左邊：房間大廳列表 */}
      <div className="w-[30%] border">

        <ul>
          {rooms.map((room) => (
            <li
              key={room.id}
              style={{
                padding: "10px",
                margin: "5px 0",
                background: currentRoom?.id === room.id ? "#e0e0e0" : "#f5f5f5",
                cursor: "pointer",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => handleJoinRoom(room)}
            >
              <span>
                {room.type === "PRIVATE_GROUP" ? "🔒 " : "💬 "}
                {room.name}
              </span>
              <small>({room._count?.members || 0}人)</small>
              {/* 🌟 房主比對：精準比對建立者 ID */}
              {currentUserId === room.createdBy && (
                <button
                  onClick={(e) => handleDeleteRoom(room.id, e)}
                  style={{
                    background: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 8px",
                    cursor: "pointer",
                  }}
                >
                  刪除
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* 右邊：當前聊天室內容 */}
      <div className={`w-[70%] border`}>
        {currentRoom ? (
          <div>
            <h2>
              房間：{currentRoom.name}{" "}
              {currentRoom.type === "PRIVATE_GROUP" && "🔒"}
            </h2>
            {/* 🌟 離開房間按鈕 */}
            <button
              onClick={handleLeaveRoom}
              style={{
                padding: "6px 12px",
                background: "#8c8c8c",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              離開房間 🚪
            </button>
            <div
              style={{
                border: "1px solid #ccc",
                height: "350px",
                overflowY: "scroll",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {messages.map((msg, index) => (
                <div key={msg.id || index} style={{ marginBottom: "8px" }}>
                  <strong>
                    {msg.sender?.account || `User ${msg.senderId}`}:{" "}
                  </strong>
                  <span>{msg.content}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="輸入訊息..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{ width: "80%", padding: "5px" }}
              />
              <button type="submit" style={{ width: "18%", padding: "5px" }}>
                發送
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h3>👈 請從左側選擇或建立一個房間開始聊天</h3>
          </div>
        )}
      </div>

       </div>
     

      {/* 私密房密碼輸入 Modal 彈窗 */}
      {passwordModalRoom && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "320px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ marginTop: 0 }}>
              輸入密碼以進入【{passwordModalRoom.name}】
            </h4>
            <form onSubmit={handleSubmitPassword}>
              <input
                type="password"
                placeholder="請輸入房間密碼"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "15px",
                  boxSizing: "border-box",
                }}
                autoFocus
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalRoom(null);
                    setInputPassword("");
                  }}
                  style={{ padding: "6px 12px" }}
                >
                  取消
                </button>
                <button type="submit" style={{ padding: "6px 12px" }}>
                  進入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
  
    </Container>
   
  );
}
