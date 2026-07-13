import React from "react";

export default function FeaturedProductSection() {
  return (
    // ⭕ 這裡把 w-230 改成了 w-full
    <div className="flex text-center w-full gap-10 h-80 px-4 py-2.5 bg-[#FFF9E6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      {/* 左側區塊：用 flex-1 讓它自動平分寬度，或是指定 w-1/2 */}
      <div className="flex-1 flex flex-col">
        <div className="text-center mb-2">
          <span className="text-2xl">推薦商品與固定背景色</span>
        </div>
        {/* ⭕ 圖片寬度改為 w-full 撐滿左半邊 */}
        <div className="flex items-center justify-center bg-blue-300 w-full h-63">
          <span>商品圖片</span>
        </div>
      </div>
      
      {/* 右側區塊 */}
      {/* ⭕ 移除 w-100，改用 flex-1 讓它自動填滿右半邊 */}
      <div className="flex flex-col justify-between bg-blue-300 h-71 flex-1">
        <div>
          <div><span>說明欄</span></div>
        </div>
        <div>
          <div className="bg-amber-600 h-10">商品價格</div>
          <div className="flex items-center justify-between bg-purple-300 h-20">
            <div>加入購物車</div>
            <div>收藏</div>
          </div>
        </div>
      </div>
    </div>
  );
}