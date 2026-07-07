import React from "react";

export default function QuantityPicker() {
  return (
    <div className="bg-amber-400">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
      >
        <span>-</span>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
      >
        <span>1</span>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
      >
        <span>+</span>
      </div>
    </div>
  );
}
