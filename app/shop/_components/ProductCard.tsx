import React from "react";
import type { Product } from "@/lib/shop/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="flex flex-col text-center w-70 h-80 px-4 py-2.5 bg-[#FFF9E6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      {/* 商品圖背景預覽(hover切換預覽圖) */}
      <div className="flex items-end justify-center flex-1 bg-amber-100">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <span>{product.name}</span>
      </div>
      {/* 購物車&收臧按鈕 */}
      <div>
        <div className="flex flex-col items-center justify-center w-full h-20 bg-purple-300">
          <span>hover出現加入購物車&收藏</span>
          <span>${product.price}</span>
        </div>
      </div>
    </div>
  );
}
