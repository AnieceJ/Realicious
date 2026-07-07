import React from "react";

export default function SpecSelector() {
  return (
    <div>
      <div>
        <span>規格/方案</span>
      </div>
      <div className="flex items-center grid-cols-3 gap-3">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
        >單人套餐</div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
        >雙人套餐</div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
        >十人套餐</div>
      </div>
    </div>
  );
}
