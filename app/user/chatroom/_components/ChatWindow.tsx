import { useState, useRef, useEffect } from "react";
import { Room, Message } from "../hooks/useChatroom";

interface ChatWindowProps {
  currentRoom: Room | null;
  messages: Message[];
  currentUserId: number;
  onSendMessage: (content: string) => void;
  onLeaveRoom: () => void;
}

export default function ChatWindow({
  currentRoom,
  messages,
  currentUserId,
  onSendMessage,
  onLeaveRoom,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentRoom) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center text-slate-300 p-4 text-center border rounded-xl">
        <span className="text-2xl md:text-3xl mb-1">💬</span>
        <p className="text-[11px] md:text-xs">點擊左側房間卡片進入</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50/50">
        <div>
          <h3 className="font-bold text-sm text-slate-800">{currentRoom.name}</h3>
          <p className="text-[11px] text-slate-400">線上：{currentRoom._count?.members || 0} 人</p>
        </div>
        <button onClick={onLeaveRoom} className="px-2 py-0.5 text-xs border rounded hover:bg-slate-100">
          離開 🚪
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {messages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              {!isMe && <span className="text-[10px] text-slate-400">{msg.sender?.account}</span>}
              <div className={`px-3 py-1.5 text-xs rounded-xl ${isMe ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="輸入訊息..."
          className="flex-1 border rounded px-2 py-1 text-xs focus:outline-none"
        />
        <button type="submit" className="bg-indigo-600 text-white text-xs px-3 py-1 rounded">
          發送
        </button>
      </form>
    </div>
  );
}