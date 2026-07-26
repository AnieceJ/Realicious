"use client";
import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

interface Room {
  id: number;
  name: string;
  type: string;
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
  const [newRoomName, setNewRoomName] = useState("");
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
    // 監聽新房間廣播，收到時才非同步更新 State
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

    return () => {
      socket.off("receive_message");
      socket.off("load_history");
      socket.off("room_created");
      socket.off("room_member_updated");
      socket.disconnect();
    };
  }, []);

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

    const token = Cookies.get("token");
    try {
      const res = await fetch("http://localhost:3001/user/api/chatrooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoomName }),
      });
      const result = await res.json();
      if (result.success) {
        setNewRoomName("");
        fetchRooms(); // 重新撈取房間列表
      }
    } catch (err) {
      console.error("建立房間失敗:", err);
    }
  };

  // 4. 點擊「進入房間」
  const handleJoinRoom = (room: Room) => {
    if (!socketRef.current) return;

    // 若原本就在別的房間，可以先連線
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }

    setCurrentRoom(room);
    setMessages([]); // 先清空前一個房間的訊息
    socketRef.current.emit("join_room", room.id);
  };

  // 5. 發送訊息
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
        <form onSubmit={handleCreateRoom} style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="房間名稱..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            style={{ width: "70%", padding: "5px" }}
          />
          <button type="submit" style={{ padding: "5px 10px" }}>
            新增
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
              }}
              onClick={() => handleJoinRoom(room)}
            >
              <span>{room.name}</span>
              <small>({room._count?.members || 0}人)</small>
            </li>
          ))}
        </ul>
      </div>

      {/* 右邊：當前聊天室內容 */}
      <div style={{ width: "70%" }}>
        {currentRoom ? (
          <div>
            <h2>房間：{currentRoom.name}</h2>
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
  );
}
