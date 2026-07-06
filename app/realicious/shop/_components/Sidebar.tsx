import React, { useState } from "react";

export default function SidebarFilter() {
  // 記錄當前選中的商品分類
  const [activeCategory, setActiveCategory] = useState("電子票券");

  // 價格區間狀態（可依需求改為數字）
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // 複選框狀態
  const [filters, setFilters] = useState<Record<string, boolean>>({
    onSale: false,
    inStock: false,
    isFavorite: false,
  });

  // 這時候 key 只要寫成普通的 string，TypeScript 就不會報錯了
  const toggleFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const categories = [
    {
      name: "電子票券",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M2 4h20v16H2V4zm2 2v4a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 0 0-4V6H4zm4 4h8v2H8v-2z" />
        </svg>
      ),
    },
    {
      name: "電子雞服裝",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2a5 5 0 0 0-5 5v3H5v12h14V10h-2V7a5 5 0 0 0-5-5zm3 8H9V7a3 3 0 0 1 6 0v3zm-3 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
      ),
    },
    {
      name: "虛擬頭像框",
      icon: (
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 4a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm0 12a8 8 0 0 1-6.66-3.57 7.93 7.93 0 0 1 13.32 0A8 8 0 0 1 12 18z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-72 bg-[#FCE384] border-[3px] border-[#3D2419] rounded-xl p-5 shadow-[4px_4px_0px_0px_#3D2419] font-bold text-[#3D2419] select-none">
      {/* 區塊一：商品分類 */}
      <div className="text-center text-xl tracking-wide mb-4">商品分類</div>
      <hr className="border-t-2 border-[#3D2419]/20 mb-5" />

      <div className="flex flex-col gap-3 mb-8">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-4 w-full px-4 py-3 text-lg border-[3px] rounded-xl transition-all duration-100 cursor-pointer
                ${
                  isActive
                    ? "bg-[#FFD3B6] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419]"
                    : "bg-transparent border-transparent hover:bg-[#3D2419]/5"
                }`}
            >
              <span
                className={isActive ? "text-[#3D2419]" : "text-[#3D2419]/80"}
              >
                {cat.icon}
              </span>
              <span className="tracking-wide">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* 區塊二：價格範圍 */}
      <div className="text-center text-xl tracking-wide mb-4">價格範圍</div>
      <hr className="border-t-2 border-[#3D2419]/20 mb-5" />

      {/* 模擬滑桿與刻度 */}
      <div className="px-2 mb-4">
        <div className="flex justify-between text-xs text-[#3D2419]/70 mb-1">
          <span>$0</span>
          <span>$500+</span>
        </div>
        <div className="relative w-full h-2 bg-[#3D2419]/20 rounded-full">
          <div className="absolute left-0 w-1/2 h-full bg-[#3D2419] rounded-full"></div>
          <div className="absolute left-1/2 -top-1 w-4 h-4 bg-[#FF6B6B] border-2 border-[#3D2419] rounded-full shadow-[1px_1px_0px_0px_#3D2419] cursor-pointer"></div>
        </div>
      </div>

      {/* 價格輸入框 */}
      <div className="flex items-center justify-between gap-3 mb-8">
        <input
          type="number"
          placeholder="最低"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full h-12 text-center bg-white border-[3px] border-[#3D2419] rounded-xl shadow-[3px_3px_0px_0px_#3D2419] focus:outline-none placeholder-[#3D2419]/40"
        />
        <span className="text-lg text-[#3D2419]">至</span>
        <input
          type="number"
          placeholder="最高"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full h-12 text-center bg-white border-[3px] border-[#3D2419] rounded-xl shadow-[3px_3px_0px_0px_#3D2419] focus:outline-none placeholder-[#3D2419]/40"
        />
      </div>

      {/* 區塊三：條件篩選 (特價中、只顯示有貨、只顯示收藏) */}
      <div className="flex flex-col gap-4 pl-2">
        {/* 特價中 */}
        <label className="flex items-center gap-4 text-lg cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.onSale}
            onChange={() => toggleFilter("onSale")}
            className="sr-only" // 隱藏原生網頁樣式
          />
          <div
            className={`w-6 h-6 border-[3px] border-[#3D2419] rounded-md transition-all flex items-center justify-center shadow-[2px_2px_0px_0px_#3D2419]
            ${filters.onSale ? "bg-[#A8E6CF]" : "bg-white"}`}
          >
            {filters.onSale && (
              <div className="w-2 h-2 bg-[#3D2419] rounded-sm" />
            )}
          </div>
          <span className="group-hover:text-[#3D2419]/80">特價中</span>
        </label>

        {/* 只顯示有貨 */}
        <label className="flex items-center gap-4 text-lg cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={() => toggleFilter("inStock")}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 border-[3px] border-[#3D2419] rounded-md transition-all flex items-center justify-center shadow-[2px_2px_0px_0px_#3D2419]
            ${filters.inStock ? "bg-[#A8E6CF]" : "bg-white"}`}
          >
            {filters.inStock && (
              <div className="w-2 h-2 bg-[#3D2419] rounded-sm" />
            )}
          </div>
          <span className="group-hover:text-[#3D2419]/80">只顯示有貨</span>
        </label>

        {/* 只顯示收藏 */}
        <label className="flex items-center gap-4 text-lg cursor-pointer group">
          <input
            type="checkbox"
            checked={filters.isFavorite}
            onChange={() => toggleFilter("isFavorite")}
            className="sr-only"
          />
          <div
            className={`w-6 h-6 border-[3px] border-[#3D2419] rounded-md transition-all flex items-center justify-center shadow-[2px_2px_0px_0px_#3D2419]
            ${filters.isFavorite ? "bg-[#A8E6CF]" : "bg-white"}`}
          >
            {filters.isFavorite && (
              <div className="w-2 h-2 bg-[#3D2419] rounded-sm" />
            )}
          </div>
          <span className="group-hover:text-[#3D2419]/80">只顯示收藏</span>
        </label>
      </div>
    </div>
  );
}
