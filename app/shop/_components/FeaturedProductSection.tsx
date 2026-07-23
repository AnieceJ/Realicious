import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/shop/product";
import { addToCart } from "@/lib/shop/cart";
import { useToast } from "./Toast";

interface FeaturedProductSectionProps {
  products: Product[];
}

export default function FeaturedProductSection({ products }: FeaturedProductSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const featuredList = products.slice(0, 3);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, featuredList.length]);

  if (featuredList.length === 0) {
    return <div className="h-72 w-full bg-[#FFF9E6] border-[3px] border-[#3D2419] animate-pulse" />;
  }

  const currentProduct = featuredList[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
  };

  const { toastComponent, showToast } = useToast();

  return (
    <>
      {toastComponent}
      <div className="flex flex-row w-full h-72 bg-[#FFF9E6] border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] select-none overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 左側：圖片輪播 */}
        <div className="relative w-1/2 h-full overflow-hidden group">
          {/* 圖層容器 */}
          <div className="flex h-full transition-transform duration-400 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredList.map((p) => (
              <Link key={p.id} href={`/shop/products/${p.id}`}
                className="relative w-full h-full flex-shrink-0 block"
              >
                <img
                  src={`http://localhost:3001${p.main_img}`}
                  alt={p.name}
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            ))}
          </div>

          {/* 左右箭頭 */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-[#ffbe94] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >◀</button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-[#ffbe94] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
            >▶</button>
          </div>

          {/* 小點點 */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/60 px-2 py-1 border border-[#3D2419]">
            {featuredList.map((_, index) => (
              <div key={index}
                className={`w-2 h-2 border border-[#3D2419] transition-all ${index === currentIndex ? 'bg-[#3D2419] w-4' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* 右側：商品資訊 */}
        <div className="w-1/2 flex flex-col justify-center px-6 py-4">
          <span className="inline-block bg-amber-500 text-white text-xs px-2 py-0.5 border border-[#3D2419] w-fit mb-3">
            今日主打
          </span>
          <h3 className="text-xl font-black text-[#3D2419] mb-2">
            {currentProduct.name}
          </h3>
          <p className="text-sm font-medium text-amber-950 mb-4 line-clamp-2">
            限時特惠主打商品！【{currentProduct.name}】現正熱賣中。
          </p>
          <div className="flex items-center gap-3 mt-auto">
            <span className="text-xl font-black text-amber-700 bg-amber-100/80 px-3 py-1 border-2 border-[#3D2419]">
              ${currentProduct.price}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); addToCart(currentProduct, 1); showToast(`已將 ${currentProduct.name} 加入購物車`); }}
              className="px-4 py-2 bg-purple-400 hover:bg-purple-500 active:translate-x-[1px] active:translate-y-[1px] text-[#3D2419] font-bold border-2 border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer whitespace-nowrap"
            >
              加入購物車
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
