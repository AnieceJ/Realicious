import React from "react";

export default function CategoryFilter() {
  return (
    <div className="flex items-center grid-cols-3 gap-6 w-230 h-17 px-4 py-2.5 bg-white text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419] rounded-xl
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>火鍋</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419] rounded-xl
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>速食</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419] rounded-xl
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>吃到飽</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419] rounded-xl
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>炸物</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419] rounded-xl
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>電子雞服裝</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FFD3B6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419] rounded-xl
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button>虛擬頭像框</button>
      </div>
    </div>
  );
}
