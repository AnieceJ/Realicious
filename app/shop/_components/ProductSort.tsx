import React, { useState } from "react";

type SortOption = {
  id: string;
  label: string;
  badge?: string;
};

type ProductSortProps = {
  onSort: (sortId: string) => void;
};

export default function SortDropdown({ onSort }: ProductSortProps) {
  // 控制下拉選單是否開啟
  const [isOpen, setIsOpen] = useState(false);
  // 記錄當前選擇的排序方式
  const [currentSort, setCurrentSort] = useState("排序方式");

  // 排序選項資料，方便未來擴充
  const sortOptions: SortOption[] = [
    { id: "popular", label: "銷量/熱門商品" },
    { id: "price_low", label: "價格：低 → 高" },
    { id: "price_high", label: "價格：高 → 低" },
  ];  

  const handleSelect = (option: SortOption) => {
    setCurrentSort(option.label);
    onSort(option.id);
    setIsOpen(false);
  };

  return (
    /* 排序按鈕與下拉選單容器 (需為 relative 方便定位) */
    <div className="relative inline-block text-left">
      {/* 排序主按鈕 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2.5 
                  bg-white text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419] 
                  hover:translate-x-[1px] hover:translate-y-[1px]hover:shadow-[3px_3px_0px_0px_#3D2419]
                  active:translate-x-[3px] active:translate-y-[3px]active:shadow-none
                  transition-all duration-100 ease-in-out cursor-pointer"
      >
        <span>{currentSort}</span>
        {/* 下拉小箭頭 Icon，當選單開啟時會旋轉 180 度 */}
        <svg
          className={`w-4 h-4 ml-2 fill-current transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M24 6h-24l12 12z" />
        </svg>
      </button>

      {/* 下拉選單本體：利用 isOpen 狀態控制顯示 */}
      {isOpen && (
        <div
          className="absolute right-0 mt-3 w-48 bg-white 
                    border-[3px] border-[#3D2419] rounded-xl 
                    shadow-[6px_6px_0px_0px_#3D2419] z-50 
                    overflow-hidden animate-fadeIn"
        >
          <div className="py-1 flex flex-col font-bold text-[#3D2419]">
            {sortOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                className="px-4 py-3 text-sm text-left hover:bg-[#FFD3B6] 
                          transition-colors border-b-2 border-[#3D2419]/10 
                          last:border-b-0 flex items-center justify-between cursor-pointer"
              >
                <span>{option.label}</span>
                {option.badge && (
                  <span className="text-xs bg-[#A8E6CF] px-1.5 py-0.5 rounded border border-[#3D2419]">
                    {option.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
