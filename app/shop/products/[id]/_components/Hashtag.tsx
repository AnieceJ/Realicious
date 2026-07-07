import React from "react";

export default function Hashtag() {
  return (
    <div className="flex items-center grid-cols-3 gap-3">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>火鍋</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>餐券</button>
      </div>
    </div>
  );
}
