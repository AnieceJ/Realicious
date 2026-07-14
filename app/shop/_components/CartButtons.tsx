import React from "react";

export default function CartButtons({ productName = "商品" }: { productName?: string }) {
  return (
    <div
      onClick={() => alert(`已將 ${productName} 加入購物車`)}
      className="flex items-center justify-center px-4 py-3 h-12 w-full
                  bg-[#3D2419] text-white font-bold text-sm
                  border-[3px] border-[#3D2419]
                  shadow-[3px_3px_0px_0px_#3D2419]
                  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                  transition-all duration-75 cursor-pointer select-none"
    >
      加入購物車
    </div>
  );
}
