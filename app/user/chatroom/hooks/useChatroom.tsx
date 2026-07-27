import { useState, useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

export interface Room {
  id: number;
  name: string;
  type: string;
  createdBy: number;
  imageUrl?: string;
  _count?: { members: number };
  isFavorited?: boolean; 
}

export interface Message {
  id?: number;
  senderId: number;
  content: string;
  sender?: { id: number; account: string };
}

export function useChatroom() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [passwordModalRoom, setPasswordModalRoom] = useState<Room | null>(null);
  
  // 🌟 1. 新增：頁籤狀態 (all | favorites)
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  const socketRef = useRef<Socket | null>(null);

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
    const token = Cookies.get("token");
    if (!token) return;

    socketRef.current = io("http://localhost:3001", { auth: { token } });
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
      setRooms((prev) =>
        prev.map((r) => (r.id === roomId ? { ...r, _count: { members: memberCount } } : r))
      );
    });

    socket.on("join_success", ({ room }: { room: Room }) => {
      setCurrentRoom(room);
      setPasswordModalRoom(null);
    });

    socket.on("password_required", ({ roomId }: { roomId: number }) => {
      setRooms((latest) => {
        const target = latest.find((r) => r.id === roomId);
        if (target) setPasswordModalRoom(target);
        return latest;
      });
    });

    socket.on("error_message", (data: { message: string }) => alert(data.message));

    socket.on("room_deleted", ({ roomId }: { roomId: number }) => {
      setRooms((prev) => prev.filter((r) => r.id !== roomId));
      setCurrentRoom((prev) => (prev?.id === roomId ? null : prev));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchRooms();
    };
    loadInitialData();
  }, []);

  const createRoom = async (
  name: string,
  type: "PUBLIC_GROUP" | "PRIVATE_GROUP",
  imageUrl?: string, 
  password?: string
) => {
  const token = Cookies.get("token");
  const res = await fetch("http://localhost:3001/user/api/chatrooms", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, type, imageUrl, password }), // 
  });
  return res.json();
};

  const joinRoom = (roomId: number, password?: string) => {
    if (!socketRef.current) return;
    if (!socketRef.current.connected) socketRef.current.connect();
    setMessages([]);
    socketRef.current.emit("join_room", { roomId, password });
  };

  const sendMessage = (content: string) => {
    if (!currentRoom || !socketRef.current) return;
    socketRef.current.emit("send_message", { roomId: currentRoom.id, content });
  };

  const leaveRoom = () => {
    if (!currentRoom || !socketRef.current) return;
    socketRef.current.emit("leave_room", { roomId: currentRoom.id });
    setCurrentRoom(null);
    setMessages([]);
  };

  const deleteRoom = async (roomId: number) => {
    const token = Cookies.get("token");
    const res = await fetch(`http://localhost:3001/user/api/chatrooms/${roomId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
  };

  const toggleFavorite = async (roomId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    // 畫面先行更新 (Optimistic UI)
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === roomId ? { ...room, isFavorited: !room.isFavorited } : room
      )
    );

    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost:3001/user/api/chatrooms/${roomId}/favorite`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (!result.success) fetchRooms();
    } catch (err) {
      console.error("切換追蹤狀態失敗:", err);
      fetchRooms();
    }
  };

  // 🌟 2. 依據 activeTab 計算出過濾後的房間清單
  const filteredRooms = rooms.filter((room) => {
    if (activeTab === "favorites") return room.isFavorited;
    return true;
  });

  return {
    rooms,
    filteredRooms, // 👈 匯出過濾後的資料
    activeTab,     // 👈 匯出頁籤狀態
    setActiveTab,  // 👈 匯出切換頁籤函式
    currentRoom,
    messages,
    passwordModalRoom,
    setPasswordModalRoom,
    createRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
    deleteRoom,
    toggleFavorite,
  };
}