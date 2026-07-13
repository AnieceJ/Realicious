import React from "react";
import type { Product } from "@/lib/shop/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="relative w-full h-80 overflow-hidden border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] group">
      {/* 商品圖片 */}
      <img
        src={`http://localhost:3001${product.main_img}`}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* 飄浮字卡：使用 bg-white/90 (90%不透明白)，既能隱約看到後方圖片，又能給文字極佳的閱讀背景 */}
      <div className="flex flex-row items-center justify-center gap-3 absolute bottom-3 left-3 right-3 bg-white/85 border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] p-3 text-left rounded-sm ">
        {/* 商品名稱 */}
        <p className="text-[#3D2419] font-black text-base truncate tracking-wide">
          {product.name}
        </p>
        {/* 價格 */}
        <p className="text-[#8C5230] font-black text-lg tracking-wider">
          ${product.price}
        </p>
      </div>
    </div>
  );
}