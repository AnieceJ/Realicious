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

  // 如果目前還沒有抓到商品資料，先渲染骨架或空畫面
  if (featuredList.length === 0) {
    return <div className="h-80 w-full bg-[#FFF9E6] border-[3px] border-[#3D2419] animate-pulse" />;
  }

  // 取得目前輪播到的商品
  const currentProduct = featuredList[currentIndex];

  // 2. 左右切換邏輯
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
      {/* 最外層 */}
    <div className="relative group w-full h-80 bg-[#FFF9E6] border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] overflow-hidden select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >

      {/* 【左側切換箭頭】 */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-30 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
        <span className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl rounded-sm
                        border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419]
                        hover:bg-[#ffbe94] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          ◀
        </span>
      </div>

      {/* 【右側切換箭頭】 */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-20 flex items-center justify-center cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
        <span className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl rounded-sm
                        border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419]
                        hover:bg-[#ffbe94] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          ▶
        </span>
      </div>

      {/* 【圖片可點擊 — 導向詳細頁（滑動輪播）】 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-400 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredList.map((p) => (
            <Link
              key={p.id}
              href={`/shop/products/${p.id}`}
              className="relative w-full h-full flex-shrink-0 cursor-pointer block"
            >
              <img
                src={`http://localhost:3001${p.main_img}`}
                alt={p.name}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
              />
              {/* Hover 遮罩 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-4 py-2 rounded-md">
                  查看商品詳情 →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 浮動半透明說明欄 — 不導航 */}
      <div className="absolute bottom-4 left-20 right-20 z-10
                      flex flex-col sm:flex-row items-center justify-between gap-4
                      bg-white/75 backdrop-blur-sm p-4 text-left rounded-md
                      border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-sm border border-[#3D2419]">今日主打</span>
            <h3 className="text-xl font-black text-[#3D2419]">{currentProduct.name}</h3>
          </div>
          <p className="text-sm font-medium text-amber-950 line-clamp-2">
            限時特惠主打商品！【{currentProduct.name}】現正熱賣中。
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <div className="text-xl font-black text-amber-700 bg-amber-100/80 px-3 py-1 border-2 border-[#3D2419] rounded-sm">
            ${currentProduct.price}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); addToCart(currentProduct, 1); showToast(`已將 ${currentProduct.name} 加入購物車`); }}
            className="px-4 py-2 bg-purple-400 hover:bg-purple-500 active:translate-x-[1px] active:translate-y-[1px] text-[#3D2419] font-bold border-2 border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] rounded-sm cursor-pointer"
          >
            加入購物車
          </button>
        </div>
      </div>

      {/* 底部輪播小點點 — 不導航 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/60 px-2 py-1 rounded-full border border-[#3D2419]">
        {featuredList.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full border border-[#3D2419] transition-all ${index === currentIndex ? 'bg-[#3D2419] w-4' : 'bg-white'}`}
          />
        ))}
      </div>

    </div>
    </>
  );
}