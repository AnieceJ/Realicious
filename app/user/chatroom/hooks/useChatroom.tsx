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
  const socketRef = useRef<Socket | null>(null);

  // 1. Fetch Rooms API
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

  // 2. Socket 初始化與事件監聽
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

  // 3. 封裝給 UI 呼叫的 Actions
  const createRoom = async (name: string, type: "PUBLIC_GROUP" | "PRIVATE_GROUP", password?: string) => {
    const token = Cookies.get("token");
    const res = await fetch("http://localhost:3001/user/api/chatrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, type, password }),
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

  return {
    rooms,
    currentRoom,
    messages,
    passwordModalRoom,
    setPasswordModalRoom,
    createRoom,
    joinRoom,
    sendMessage,
    leaveRoom,
    deleteRoom,
  };
}