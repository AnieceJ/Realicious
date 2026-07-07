import React from "react";

export default function QuantityPicker() {
  return (
    <div className="flex gap-2">
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
      >
        <button>-</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
      >
        <button>1</button>
      </div>
      <div
        className="inline-flex items-center gap-1.5 px-3 py-1 
                      bg-[#FCF9F6] text-[#3D2419] font-bold text-sm
                      border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                  "
      >
        <button>+</button>
      </div>
    </div>
  );
}
