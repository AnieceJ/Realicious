import React from "react";

export default function EmptyCart() {
  return (
    <div className="flex items-center justify-center w-full px-4 py-10 
                    bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                    border-[3px] border-[#3D2419]
                    shadow-[4px_4px_0px_0px_#3D2419]">
      <p className="text-xl">購物車裡沒有商品囉!</p>
    </div>
  );
}
