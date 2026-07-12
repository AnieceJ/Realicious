import React from "react";

export default function CartButtons() {
  return (
    <div className="w-full">
      <div
        className="flex items-center gap-1.5 px-3 py-1 h-12 justify-center
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none"
      >
        <button className="whitespace-nowrap">加入購物車</button>
      </div>
    </div>
  );
}
