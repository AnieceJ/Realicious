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
  
  // 新增：未讀訊息數量狀態
  const [unreadCount, setUnreadCount] = useState(0);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const isNearBottomRef = useRef<boolean>(true);
  const prevMessagesLengthRef = useRef<number>(messages.length);

  // 手動滾動到底部的函式
  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
    
    // 滾到底部後清空未讀數
    setUnreadCount(0);
    isNearBottomRef.current = true;
  };

  // 監聽使用者滾動行為
  const handleScroll = () => {
    const container = chatContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    
    const isAtBottom = distanceFromBottom < 80;
    isNearBottomRef.current = isAtBottom;

    // 如果使用者手動滾到底部，自動清空未讀提示
    if (isAtBottom && unreadCount > 0) {
      setUnreadCount(0);
    }
  };

  // 訊息更新時的智慧滾動與未讀邏輯
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    // 檢查是否有新訊息增加（避免初始化或切換房間時誤判）
    const hasNewMessage = messages.length > prevMessagesLengthRef.current;
    prevMessagesLengthRef.current = messages.length;

    if (!hasNewMessage) return;

    const lastMessage = messages[messages.length - 1];
    const isMyMessage = lastMessage?.senderId === currentUserId;

    if (isMyMessage || isNearBottomRef.current) {
      // 如果是我發的，或是本來就在底部 -> 自動捲動並歸零
      scrollToBottom();
    } else {
      // 正在往上翻看歷史訊息，且來了別人的新訊息 -> 增加未讀計數
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages, currentUserId]);

  // 切換房間時重置狀態
  useEffect(() => {
    setUnreadCount(0);
    isNearBottomRef.current = true;
    prevMessagesLengthRef.current = messages.length;
  }, [currentRoom?.id]);

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
    <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm h-full relative">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 bg-slate-50/50 flex-shrink-0">
        <div>
          <h3 className="font-bold text-sm text-slate-800">{currentRoom.name}</h3>
          <p className="text-[11px] text-slate-400">線上：{currentRoom._count?.members || 0} 人</p>
        </div>
        <button onClick={onLeaveRoom} className="px-2 py-0.5 text-xs border rounded hover:bg-slate-100">
          離開 🚪
        </button>
      </div>

      {/* Messages 容器：設定 relative 讓提示按鈕定位 */}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 space-y-2.5"
        >
          {messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id || idx} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && <span className="text-[10px] text-slate-400">{msg.sender?.account}</span>}
                <div className={`px-3 py-1.5 text-xs rounded-xl max-w-[80%] break-words ${isMe ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"}`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>

        {/* 🌟 新訊息懸浮按鈕 (當 unreadCount > 0 時顯示) */}
        {unreadCount > 0 && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-3 right-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1 transition-all animate-bounce cursor-pointer z-10"
          >
            <span>↓ 有 {unreadCount} 則新訊息</span>
          </button>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-2 flex gap-2 flex-shrink-0 bg-white">
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