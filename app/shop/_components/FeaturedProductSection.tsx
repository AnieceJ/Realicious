import React, { useState } from "react";
import type { Product } from "@/lib/shop/product";

interface FeaturedProductSectionProps {
  products: Product[]; // 傳入所有商品的陣列
}

export default function FeaturedProductSection({ products }: FeaturedProductSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredList = products.slice(0, 3);

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

  return (
    // 最外層：相對定位 (relative)，方便箭頭和說明欄做絕對定位
    <div className="relative group w-full h-80 bg-[#FFF9E6] border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] overflow-hidden select-none">
      
      {/* 【背景滿版商品圖】 */}
      <div className="w-full h-full bg-amber-50">
        <img 
          src={`http://localhost:3001${currentProduct.main_img}`}
          alt={currentProduct.name}
          className="w-full h-full object-cover object-center transition-all duration-500"
        />
      </div>

      {/* 【左側切換箭頭 — 整塊左邊都可點】 */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center cursor-pointer" onClick={handlePrev}>
        <span className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl rounded-sm
                        border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419]
                        hover:bg-[#ffbe94] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          ◀
        </span>
      </div>

      {/* 【右側切換箭頭 — 整塊右邊都可點】 */}
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 flex items-center justify-center cursor-pointer" onClick={handleNext}>
        <span className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl rounded-sm
                        border-[2px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419]
                        hover:bg-[#ffbe94] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
          ▶
        </span>
      </div>

      {/* 【浮動半透明說明欄】(參考你的想法調整後的 HUD 面板樣式) */}
      <div className="absolute bottom-4 left-16 right-16 z-10
                      flex flex-col sm:flex-row items-center justify-between gap-4
                      bg-white/75 backdrop-blur-sm p-4 text-left rounded-md
                      border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
        
        {/* 說明欄左側：標題與內文 */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-sm border border-[#3D2419]">今日主打</span>
            <h3 className="text-xl font-black text-[#3D2419]">{currentProduct.name}</h3>
          </div>
          <p className="text-sm font-medium text-amber-950 line-clamp-2">
            限時特惠主打商品！【{currentProduct.name}】現正熱賣中。極具收藏價值的經典像素風好物，小組強烈推薦，錯過只能等明年！
          </p>
        </div>

        {/* 說明欄右側：價格與功能按鈕 */}
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <div className="text-xl font-black text-amber-700 bg-amber-100/80 px-3 py-1 border-2 border-[#3D2419] rounded-sm">
            ${currentProduct.price}
          </div>
          <button 
            onClick={() => alert(`已將 ${currentProduct.name} 加入購物車`)}
            className="px-4 py-2 bg-purple-400 hover:bg-purple-500 active:translate-x-[1px] active:translate-y-[1px] text-[#3D2419] font-bold border-2 border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] rounded-sm"
          >
            加入購物車
          </button>
        </div>

      </div>

      {/* 【小彩蛋：底部輪播小點點】 */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/60 px-2 py-1 rounded-full border border-[#3D2419]">
        {featuredList.map((_, index) => (
          <div 
            key={index} 
            className={`w-2 h-2 rounded-full border border-[#3D2419] transition-all ${index === currentIndex ? 'bg-[#3D2419] w-4' : 'bg-white'}`}
          />
        ))}
      </div>

    </div>
  );
}