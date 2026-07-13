import React from "react";

export default function OrderItem() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      {/* 大外層卡片 */}
      <div
        className="flex flex-col w-full p-5
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419] select-none"
      >
        {/* =================【手風琴上半部：常駐摘要欄】================= */}
        <div className="flex flex-row items-center justify-between w-full">
          
          {/* 左側：ID + 日期 + 狀態 */}
          <div className="flex flex-col items-start gap-1.5 shrink-0 w-48 text-left">
            <div className="text-sm font-black tracking-wide">
              ORDER ID: <span className="text-[#8C5230]">#PB-2024001</span>
            </div>
            <div className="text-xs text-[#3D2419]/50 font-medium">2026-07-09</div>
            <div className="flex items-center justify-center px-3 py-1 mt-2 bg-[#466f44] text-[#FFFFFF] font-black text-sm border-[3px] border-[#3D2419] rounded-sm shadow-[2px_2px_0px_0px_#3D2419]">
              <span>處理中</span>
            </div>
          </div>

          {/* 右側：摘要商品名稱 + 總金額 + 展開按鈕 */}
          <div className="flex-1 flex flex-row items-center justify-end gap-6 text-right pl-6">
            <div className="flex flex-col items-end">
              {/* 💡 核心巧思：只顯示第一筆商品，並加上「等 3 項商品」，預防卡片爆開 */}
              <h4 className="text-lg font-black text-[#3D2419]">
                川媽臭臭鍋餐券 <span className="text-sm text-red-500 font-black">等 3 項商品...</span>
              </h4>
              <div className="text-lg font-black text-[#8C5230] mt-1">
                總計金額：$590
              </div>
            </div>

            {/* 🔽 手風琴開關按鈕 (純樣式，自帶 Hover 沉下動效) */}
            <button className="px-4 py-2.5 bg-white border-[3px] border-[#3D2419] rounded-xl shadow-[3px_3px_0px_0px_#3D2419] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer text-sm font-black flex items-center gap-2">
              <span>檢視明細</span>
              {/* 像素向下箭頭 */}
              <span className="text-xs">▼</span>
            </button>
          </div>
        </div>

        {/* =================【手風琴下半部：點擊後展開的明細清單】================= */}
        {/* 💡 刻版註解：現在我們直接讓它呈現，等以後寫邏輯時，可以用一個條件式來切換它的顯示 */}
        <div className="mt-5 pt-5 border-t-4 border-dashed border-[#3D2419]/20 flex flex-col gap-3">
          
          {/* 明細標題 */}
          <div className="text-xs text-[#3D2419]/60 text-left tracking-wider mb-1">
            📜 冒險者背包訂單明細 / ITEM DETAILS
          </div>

          {/* 商品項目 1 */}
          <div className="flex flex-row justify-between items-center bg-white border-[2px] border-[#3D2419] rounded-md px-4 py-3 shadow-[2px_2px_0px_0px_#3D2419]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#8C5230] text-sm">🎒</span>
              <span className="text-base text-[#3D2419]">川媽臭臭鍋餐券 (單人套餐)</span>
            </div>
            <div className="text-base text-[#3D2419]/80">
              數量: <span className="font-black text-[#3D2419]">x1</span> │ <span className="text-[#8C5230] font-black">$320</span>
            </div>
          </div>

          {/* 商品項目 2 */}
          <div className="flex flex-row justify-between items-center bg-white border-[2px] border-[#3D2419] rounded-md px-4 py-3 shadow-[2px_2px_0px_0px_#3D2419]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#8C5230] text-sm">🎒</span>
              <span className="text-base text-[#3D2419]">波霸奶茶組合 (去冰/半糖)</span>
            </div>
            <div className="text-base text-[#3D2419]/80">
              數量: <span className="font-black text-[#3D2419]">x2</span> │ <span className="text-[#8C5230] font-black">$150</span>
            </div>
          </div>

          {/* 商品項目 3 */}
          <div className="flex flex-row justify-between items-center bg-white border-[2px] border-[#3D2419] rounded-md px-4 py-3 shadow-[2px_2px_0px_0px_#3D2419]">
            <div className="flex items-center gap-2.5">
              <span className="text-[#8C5230] text-sm">🎒</span>
              <span className="text-base text-[#3D2419]">大雞排冒險餐包</span>
            </div>
            <div className="text-base text-[#3D2419]/80">
              數量: <span className="font-black text-[#3D2419]">x1</span> │ <span className="text-[#8C5230] font-black">$120</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}