"use client";
import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);

  // 1. 建立房間表單 State
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomType, setNewRoomType] = useState<"PUBLIC_GROUP" | "PRIVATE_GROUP">("PUBLIC_GROUP");
  const [newRoomPassword, setNewRoomPassword] = useState("");

  // 2. 私密房密碼彈窗 State
  const [passwordModalRoom, setPasswordModalRoom] = useState<Room | null>(null);
  const [inputPassword, setInputPassword] = useState("");

  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = useRef<Socket | null>(null);

  // 1. 初始化 Socket 連線
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

    socket.on("room_member_updated", ({ roomId, memberCount }: { roomId: number; memberCount: number }) => {
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id === roomId) {
            return {
              ...room,
              _count: { members: memberCount },
            };
          }
          return room;
        })
      );
    });

    // 🌟 後端確認可以進入房間（公開房、建立者、或已是成員）
  socket.on("join_success", ({ room }: { room: Room }) => {
    setCurrentRoom(room);
    setPasswordModalRoom(null); // 關閉密碼彈窗
    setInputPassword("");
  });

   // 🌟 後端要求輸入密碼（未加入過的私密房）
  socket.on("password_required", ({ roomId }: { roomId: number }) => {
    const target = rooms.find((r) => r.id === roomId);
    if (target) {
      setPasswordModalRoom(target);
    }
  });

  socket.on("error_message", (data: { message: string }) => {
    alert(data.message);
  });

    return () => {
      socket.off("receive_message");
      socket.off("load_history");
      socket.off("room_created");
      socket.off("room_member_updated");
      socket.off("join_success");
      socket.off("error_message");
      socket.off("password_required");
      socket.disconnect();
    };
  }, [rooms]);

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
        // 如果後端已有發送 room_created 廣播，這裡也可以不需要重複 fetchRooms()
      } else {
        alert(result.message || "建立房間失敗");
      }
    } catch (err) {
      console.error("建立房間失敗:", err);
    }
  };

  // 2. 點擊「進入房間」簡化為直接發送 Socket 讓後端驗證
const handleJoinRoom = (room: Room) => {
  if (!socketRef.current) return;

  if (!socketRef.current.connected) {
    socketRef.current.connect();
  }

  setMessages([]); // 先清空舊訊息
  // 讓後端去判斷：是公開房？是建立者？還是舊成員？
  socketRef.current.emit("join_room", { roomId: room.id });
};

 // 3. 彈窗提交密碼（帶著密碼再次嘗試 join_room）
const handleSubmitPassword = (e: React.FormEvent) => {
  e.preventDefault();
  if (!passwordModalRoom || !socketRef.current || !inputPassword.trim()) return;

  socketRef.current.emit("join_room", {
    roomId: passwordModalRoom.id,
    password: inputPassword,
  });
};

  // 6. 發送訊息
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current || !currentRoom) return;

    socketRef.current.emit("send_message", {
      roomId: currentRoom.id,
      content: messageInput,
    });

    setMessageInput("");
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* 左邊：房間大廳列表 */}
      <div
        style={{
          width: "30%",
          borderRight: "1px solid #ccc",
          paddingRight: "15px",
        }}
      >
        <h3>建立新房間</h3>
        <form onSubmit={handleCreateRoom} style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            placeholder="房間名稱..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{ padding: "5px" }}
          />

          <div style={{ display: "flex", gap: "10px" }}>
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
              style={{ padding: "5px" }}
            />
          )}

          <button type="submit" style={{ padding: "5px 10px", marginTop: "5px" }}>
            建立房間
          </button>
        </form>

        <h3>聊天室列表</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
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
            </li>
          ))}
        </ul>
      </div>

      {/* 右邊：當前聊天室內容 */}
      <div style={{ width: "70%" }}>
        {currentRoom ? (
          <div>
            <h2>
              房間：{currentRoom.name}{" "}
              {currentRoom.type === "PRIVATE_GROUP" && "🔒"}
            </h2>
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

      {/* 🌟 私密房密碼輸入 Modal 彈窗 */}
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
            <h4 style={{ marginTop: 0 }}>輸入密碼以進入【{passwordModalRoom.name}】</h4>
            <form onSubmit={handleSubmitPassword}>
              <input
                type="password"
                placeholder="請輸入房間密碼"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "15px", boxSizing: "border-box" }}
                autoFocus
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
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
    </div>
  );
}