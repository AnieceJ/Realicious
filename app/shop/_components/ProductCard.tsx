import React from "react";
import type { Product } from "@/lib/shop/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    // ⭕ 這裡把 w-70 改成了 w-full，讓它完全填滿 grid 分配給它的格子
    <div className="flex flex-col text-center w-full h-80 px-4 py-2.5 bg-[#FFF9E6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      
      {/* 商品圖背景預覽(hover切換預覽圖) */}
      {/* 加上 relative 方便你未來做 hover 蓋板效果 */}
      <div className="relative flex items-end justify-center flex-1 bg-amber-100 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        {/* 名字用絕對定位或維持原樣，這裡先幫你補上相對好整體的排版 */}
        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/80 px-2 py-0.5 rounded text-sm">
          {product.name}
        </span>
      </div>

      {/* 購物車&收藏按鈕 */}
      <div className="mt-2">
        <div className="flex flex-col items-center justify-center w-full h-20 bg-purple-300">
          <span>hover出現加入購物車&收藏</span>
          <span>${product.price}</span>
        </div>
      </div>

    </div>
  );
}