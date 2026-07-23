import React, { useEffect, useState, useRef } from "react";

type CategoryFilterProps = {
  activeKeyword: string;
  minPrice: number;
  maxPrice: number;
  priceMax: number;
  onTagChange: (keyword: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onReset: () => void;
};

export default function CategoryFilter({
  activeKeyword, minPrice, maxPrice, priceMax,
  onTagChange, onPriceChange, onReset,
}: CategoryFilterProps) {
  const clampedMax = Math.min(maxPrice, priceMax);
  const [slideMin, setSlideMin] = useState(Math.min(minPrice, priceMax));
  const [slideMax, setSlideMax] = useState(clampedMax);
  const [minStr, setMinStr] = useState(String(minPrice));
  const [maxStr, setMaxStr] = useState(String(maxPrice));
  const committing = useRef(false);
  const raf = useRef(0);

  const commitPrice = (min: number, max: number) => {
    committing.current = true;
    onPriceChange(min, max);
    setTimeout(() => { committing.current = false; }, 0);
  };

  const handleSlider = (type: "min" | "max", v: number) => {
    if (type === "min" && v > slideMax) return;
    if (type === "max" && v < slideMin) return;
    type === "min" ? setSlideMin(v) : setSlideMax(v);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      commitPrice(type === "min" ? v : slideMin, type === "max" ? v : slideMax);
    });
  };

  useEffect(() => {
    if (!committing.current) { setSlideMin(minPrice); setSlideMax(maxPrice); setMinStr(String(minPrice)); setMaxStr(String(maxPrice)); }
  }, [minPrice, maxPrice]);

  const applyInput = () => {
    const min = Math.max(0, parseInt(minStr) || 0);
    const max = Math.min(priceMax, parseInt(maxStr) || priceMax);
    const clampedMin = Math.min(min, max);
    const clampedMax = Math.max(min, max);
    setMinStr(String(clampedMin));
    setMaxStr(String(clampedMax));
    setSlideMin(clampedMin);
    setSlideMax(clampedMax);
    onPriceChange(clampedMin, clampedMax);
  };

  const tags = [
    { label: "火鍋", keyword: "鍋" },
    { label: "速食", keyword: "麥丹勞" },
    { label: "吃到飽", keyword: "饗食" },
    { label: "炸物", keyword: "炸雞" },
  ];

  return (
    <div className="flex items-center flex-wrap gap-x-3 gap-y-2 w-full px-4 py-2.5 bg-white text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      {/* 全部商品（重置） */}
      <button
        onClick={onReset}
        className="px-3 py-1 text-sm border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer transition-colors bg-[#ffffff] text-[#3D2419] hover:bg-[#ffbe94]"
      >
        全部商品
      </button>

      <span className="w-px h-5 bg-[#3D2419]/20 shrink-0" />

      {/* 熱門標籤 */}
      <span className="text-sm font-bold text-[#3D2419]/60 shrink-0">熱門：</span>
      {tags.map((tag) => (
        <button key={tag.label}
          className={`px-3 py-1 text-sm border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer transition-colors
            ${activeKeyword === tag.keyword ? "bg-[#3D2419] text-white" : "bg-[#FFD3B6] text-[#3D2419] hover:bg-[#ffbe94]"}`}
          onClick={() => onTagChange(activeKeyword === tag.keyword ? "" : tag.keyword)}
        >
          {tag.label}
        </button>
      ))}

      <span className="w-px h-5 bg-[#3D2419]/20 shrink-0" />

      {/* 價格 */}
      <span className="text-sm font-bold text-[#3D2419]/60 shrink-0">價格：</span>

      {/* 桌面版拉桿 */}
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-xs text-[#3D2419]/80 w-10 text-right">${slideMin}</span>
        <div className="relative w-28 h-6">
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 bg-[#3D2419]/20" />
          <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-[#3D2419]"
            style={{ left: `${(slideMin / priceMax) * 100}%`, width: `${((slideMax - slideMin) / priceMax) * 100}%` }} />
          <input type="range" min={0} max={priceMax} step={1} value={slideMin}
            onChange={(e) => handleSlider("min", Number(e.target.value))}
            className="absolute top-0 w-full h-full appearance-none bg-transparent pointer-events-none
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#FF6B6B] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#3D2419]
              [&::-webkit-slider-thumb]:shadow-[1px_1px_0px_0px_#3D2419] [&::-webkit-slider-thumb]:cursor-pointer" />
          <input type="range" min={0} max={priceMax} step={1} value={slideMax}
            onChange={(e) => handleSlider("max", Number(e.target.value))}
            className="absolute top-0 w-full h-full appearance-none bg-transparent pointer-events-none
              [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
              [&::-webkit-slider-thumb]:bg-[#FF6B6B] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#3D2419]
              [&::-webkit-slider-thumb]:shadow-[1px_1px_0px_0px_#3D2419] [&::-webkit-slider-thumb]:cursor-pointer" />
        </div>
        <span className="text-xs text-[#3D2419]/80 w-10">${slideMax}</span>
      </div>

      {/* 手機版輸入框 */}
      <div className="flex lg:hidden items-center gap-1">
        <input type="text" inputMode="numeric" placeholder="最低"
          value={minStr} onChange={(e) => setMinStr(e.target.value)}
          onBlur={applyInput} onKeyDown={(e) => e.key === "Enter" && applyInput()}
          className="w-16 h-7 text-xs text-center bg-white border-[2px] border-[#3D2419] outline-none placeholder-[#3D2419]/40" />
        <span className="text-xs text-[#3D2419]/60">—</span>
        <input type="text" inputMode="numeric" placeholder="最高"
          value={maxStr} onChange={(e) => setMaxStr(e.target.value)}
          onBlur={applyInput} onKeyDown={(e) => e.key === "Enter" && applyInput()}
          className="w-16 h-7 text-xs text-center bg-white border-[2px] border-[#3D2419] outline-none placeholder-[#3D2419]/40" />
      </div>
    </div>
  );
}
