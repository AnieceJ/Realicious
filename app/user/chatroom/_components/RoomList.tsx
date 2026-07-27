import { useState } from "react";
import { Room } from "../hooks/useChatroom";

interface RoomListProps {
  rooms: Room[];
  currentRoomId?: number;
  currentUserId: number;
  onJoinRoom: (room: Room) => void;
  onDeleteRoom: (roomId: number, e: React.MouseEvent) => void;
}

export default function RoomList({
  rooms,
  currentRoomId,
  currentUserId,
  onJoinRoom,
  onDeleteRoom,
}: RoomListProps) {
  // 頁籤過濾 State
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");

  // 若未來需實現喜愛功能，可在這裡進行過濾邏輯（目前預留 filter 結構）
  const displayedRooms = rooms.filter((room) => {
    if (activeTab === "favorites") {
      // 範例：若有喜愛清單資料可在此篩選，目前先展示全部
      return true;
    }
    return true;
  });

  return (
    <div className="flex flex-[1.4] flex-col rounded-xl md:rounded-2xl border border-slate-200 bg-slate-50/50 p-2.5 md:p-5 shadow-sm">
      {/* 大廳 Header */}
      <div className="mb-2 md:mb-4 flex items-center justify-between gap-1">
        <div>
          <h2 className="text-base md:text-xl font-bold text-slate-800">
            聊天大廳
          </h2>
          <p className="text-[10px] md:text-xs text-slate-500 hidden sm:block">
            探索感興趣的房間，即時加入對話
          </p>
        </div>

        {/* 頁籤 */}
        <div className="flex rounded-lg bg-slate-200/70 p-0.5 md:p-1 text-[11px] md:text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-md px-2 md:px-3 py-1 font-medium transition-all ${
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
            className={`rounded-md px-2 md:px-3 py-1 font-medium transition-all ${
              activeTab === "favorites"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            喜愛 ❤️
          </button>
        </div>
      </div>

      {/* 房間卡片列表 */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          {displayedRooms.map((room) => {
            const isSelected = currentRoomId === room.id;
            const isOwner = currentUserId === room.createdBy;

            return (
              <div
                key={room.id}
                onClick={() => onJoinRoom(room)}
                className={`group relative flex flex-col overflow-hidden rounded-lg md:rounded-xl border bg-white cursor-pointer transition-all hover:shadow-md ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/20 shadow-md"
                    : "border-slate-200 hover:border-indigo-300"
                }`}
              >
                {/* 房間圖片區 */}
                <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                  <img
                    src={
                      room.imageUrl ||
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"
                    }
                    alt={room.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {room.type === "PRIVATE_GROUP" && (
                    <span className="absolute top-1 left-1 md:top-2 md:left-2 rounded bg-black/60 backdrop-blur-md px-1 py-0.5 text-[9px] md:text-[10px] text-white">
                      🔒
                    </span>
                  )}
                  <span className="absolute bottom-1 right-1 md:bottom-2 md:right-2 rounded bg-white/90 backdrop-blur-md px-1.5 py-0.5 text-[9px] md:text-[10px] font-semibold text-slate-700 shadow-sm">
                    🟢 {room._count?.members || 0} 人
                  </span>
                </div>

                {/* 卡片內容 */}
                <div className="flex flex-1 items-center justify-between p-2 md:p-3">
                  <h3 className="font-bold text-xs md:text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {room.name}
                  </h3>

                  {isOwner && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡，避免點刪除時觸發進入房間
                        if (confirm("確定要刪除這個房間嗎？此動作無法復原！")) {
                          onDeleteRoom(room.id, e);
                        }
                      }}
                      className="rounded px-1 text-[10px] md:text-xs font-medium text-red-500 hover:bg-red-50 shrink-0 ml-1"
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
    </div>
  );
}