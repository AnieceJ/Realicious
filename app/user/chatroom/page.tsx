"use client";
import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Cookies from 'js-cookie'

interface Sender {
  id: number;
  account: string;
}

interface Message {
  id?: number;
  senderId: number;
  content: string;
  sender?: Sender;
}

export default function Chatroom() {
  const [roomId, setRoomId] = useState("1"); // 預設測試房間
  const [joined, setJoined] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    // 初始化 Socket，並透過 auth 攜帶 token
    socketRef.current = io("http://localhost:3001", {
      autoConnect: false,
      auth: {
        token: token,
      },
    });

    const socket = socketRef.current;

    // 監聽接收訊息
    socket.on("receive_message", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    // 監聽歷史訊息
    socket.on("load_history", (historyMessages: Message[]) => {
      setMessages(historyMessages);
    });

    // 監聽 Socket 連線錯誤（例如 Token 過期或未登入）
    socket.on("connect_error", (err) => {
      console.error("Socket 連線失敗:", err.message);
      alert("連線驗證失敗，請重新登入！");
    });

    return () => {
      socket.off("receive_message");
      socket.off("load_history");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  // 點擊「進入房間」時連線並發送 join_room
  const handleJoinRoom = () => {
    if (!roomId.trim() || !socketRef.current) return;

    socketRef.current.connect();
    socketRef.current.emit("join_room", roomId);
    setJoined(true);
  };

  // 發送訊息
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current) return;

    // 發送給後端時只需要帶 roomId 與 content
    socketRef.current.emit("send_message", {
      roomId: Number(roomId),
      content: messageInput,
    });

    setMessageInput("");
  };

  if (!joined) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Step 1: 輸入欲加入的房間 ID</h2>
        <input
          type="text"
          placeholder="房間 ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleJoinRoom}>進入房間</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>房間：{roomId}</h2>

      {/* 訊息展示區 */}
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div key={msg.id || index} style={{ marginBottom: "8px" }}>
            <strong>{msg.sender?.account || `User ${msg.senderId}`}: </strong>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      {/* 發送訊息區 */}
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="輸入訊息..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{ width: "70%", padding: "5px" }}
        />
        <button
          type="submit"
          style={{ width: "25%", padding: "5px", marginLeft: "5px" }}
        >
          發送
        </button>
      </form>
    </div>
  );
}
