"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/app/context/user";
import { Socket, io } from "socket.io-client";
import Cookies from "js-cookie";

import Container from "@/app/user/_components/container";

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

  // 頁籤過濾：所有房間 vs 喜愛房間 (預留 state)
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

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

  const currentUserId = user?.id ? Number(user.id) : null;
  const socketRef = useRef<Socket | null>(null);

  // 🌟 自動置底用的 Ref
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // 訊息更新時自動滾動到底部
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      // 載入歷史訊息時快速滾動到底部
      setTimeout(() => scrollToBottom("auto"), 50);
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
          })
        );
      }
    );

    socket.on("join_success", ({ room }: { room: Room }) => {
      setCurrentRoom(room);
      setPasswordModalRoom(null);
      setInputPassword("");
    });

    socket.on("password_required", ({ roomId }: { roomId: number }) => {
      setRooms((latestRooms) => {
        const target = latestRooms.find((r) => r.id === roomId);
        if (target) {
          setPasswordModalRoom(target);
        }
        return latestRooms;
      });
    });

    socket.on("error_message", (data: { message: string }) => {
      // TODO: 可替換為你自訂的 Toast UI
      alert(data.message);
    });

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
  }, []);

  // 2. 撈取房間清單
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
    fetchRooms();
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

  const handleJoinRoom = (room: Room) => {
    if (!socketRef.current) return;
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
    setMessages([]);
    socketRef.current.emit("join_room", { roomId: room.id });
  };

  const handleSubmitPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordModalRoom || !socketRef.current || !inputPassword.trim())
      return;

    socketRef.current.emit("join_room", {
      roomId: passwordModalRoom.id,
      password: inputPassword,
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !socketRef.current || !currentRoom) return;

    socketRef.current.emit("send_message", {
      roomId: currentRoom.id,
      content: messageInput,
    });

    setMessageInput("");
  };

  const handleDeleteRoom = async (roomId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("確定要刪除這個房間嗎？此動作無法復原！")) return;

    const token = Cookies.get("token");
    try {
      const res = await fetch(
        `http://localhost:3001/user/api/chatrooms/${roomId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (!result.success) {
        alert(result.message);
      }
    } catch (err) {
      console.error("刪除房間失敗:", err);
    }
  };

  const handleLeaveRoom = () => {
    if (!currentRoom || !socketRef.current) return;
    socketRef.current.emit("leave_room", { roomId: currentRoom.id });
    setCurrentRoom(null);
    setMessages([]);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        載入使用者資料中...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        請先登入以使用聊天室
      </div>
    );
  }

  return (
    <Container className="py-6 flex flex-col">
      {/* 頂部建立房間區塊 */}
      <div className="w-full mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">建立新房間</h3>
        <form
          onSubmit={handleCreateRoom}
          className="flex flex-wrap items-center gap-3"
        >
          <input
            type="text"
            placeholder="房間名稱..."
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value="PUBLIC_GROUP"
                checked={newRoomType === "PUBLIC_GROUP"}
                onChange={() => setNewRoomType("PUBLIC_GROUP")}
                className="accent-indigo-600"
              />
              公開
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                value="PRIVATE_GROUP"
                checked={newRoomType === "PRIVATE_GROUP"}
                onChange={() => setNewRoomType("PRIVATE_GROUP")}
                className="accent-indigo-600"
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
              className="w-40 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          )}

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            建立房間
          </button>
        </form>
      </div>

      {/* 聊天室主體分欄 Layout */}
      <div className="flex w-full h-[600px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        
        {/* 👈 左側 - 房間列表區 */}
        <div className="flex w-80 flex-col border-r border-slate-200 bg-slate-50">
          {/* 大標題 & 切換頁籤 */}
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-lg font-bold text-slate-800">聊天大廳</h2>
            <div className="mt-3 flex rounded-lg bg-slate-200/60 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`flex-1 rounded-md py-1.5 font-medium transition-all ${
                  activeTab === "all"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                所有房間
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("favorites")}
                className={`flex-1 rounded-md py-1.5 font-medium transition-all ${
                  activeTab === "favorites"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                喜愛清單 ❤️
              </button>
            </div>
          </div>

          {/* 房間列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {rooms.map((room) => {
              const isSelected = currentRoom?.id === room.id;
              const isOwner = currentUserId === room.createdBy;

              return (
                <div
                  key={room.id}
                  onClick={() => handleJoinRoom(room)}
                  className={`group relative flex cursor-pointer items-center justify-between rounded-lg p-3 transition-all ${
                    isSelected
                      ? "bg-indigo-50 border-indigo-200 text-indigo-900 border shadow-sm"
                      : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base">
                      {room.type === "PRIVATE_GROUP" ? "🔒" : "💬"}
                    </span>
                    <span className="font-medium text-sm truncate">
                      {room.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {room._count?.members || 0} 人
                    </span>

                    {isOwner && (
                      <button
                        onClick={(e) => handleDeleteRoom(room.id, e)}
                        className="opacity-0 group-hover:opacity-100 rounded px-1.5 py-0.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-opacity"
                        title="刪除房間"
                      >
                        刪除
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 👉 右側 - 聊天視窗區 */}
        <div className="flex flex-1 flex-col bg-white">
          {currentRoom ? (
            <>
              {/* 右側上 - 聊天室頭部 */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <div>
                  <h3 className="flex items-center gap-2 font-bold text-slate-800">
                    {currentRoom.name}
                    {currentRoom.type === "PRIVATE_GROUP" && (
                      <span className="text-sm">🔒</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500">
                    目前線上人數：{currentRoom._count?.members || 0} 人
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLeaveRoom}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
                >
                  離開房間 🚪
                </button>
              </div>

              {/* 右側中 - 訊息顯示區 */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUserId;

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      }`}
                    >
                      {/* 對方訊息顯示帳號名稱 */}
                      {!isMe && (
                        <span className="mb-1 text-xs text-slate-400 pl-1">
                          {msg.sender?.account || `User ${msg.senderId}`}
                        </span>
                      )}

                      {/* 對話氣泡 */}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                          isMe
                            ? "bg-indigo-600 text-white rounded-br-none"
                            : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })}
                {/* 用於自動置底滾動的錨點 */}
                <div ref={messagesEndRef} />
              </div>

              {/* 右側下 - 訊息輸入區 */}
              <div className="border-t border-slate-200 p-4 bg-white">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="輸入訊息..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                  >
                    發送
                  </button>
                </form>
              </div>
            </>
          ) : (
            /* 未選擇房間時的 Empty State */
            <div className="flex flex-1 flex-col items-center justify-center text-slate-400">
              <span className="text-4xl mb-2">💬</span>
              <p className="text-sm">請從左側選擇或建立一個房間開始聊天</p>
            </div>
          )}
        </div>
      </div>

      {/* 🔒 私密房密碼輸入 Modal 彈窗 */}
      {passwordModalRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h4 className="text-base font-bold text-slate-800">
              輸入密碼進入【{passwordModalRoom.name}】
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              此聊天室受密碼保護，請輸入密碼以解鎖通行證。
            </p>

            <form onSubmit={handleSubmitPassword} className="mt-4">
              <input
                type="password"
                placeholder="請輸入房間密碼"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                autoFocus
              />
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalRoom(null);
                    setInputPassword("");
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                >
                  進入房間
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}