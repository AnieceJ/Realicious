import React from "react";

type CategoryFilterProps = {
  activeKeywords: string[];
  onTagToggle: (keyword: string) => void;
};

export default function CategoryFilter({ activeKeywords, onTagToggle }: CategoryFilterProps) {
  const tags = [
    { label: "火鍋", keyword: "鍋" },
    { label: "速食", keyword: "麥丹勞" },
    { label: "吃到飽", keyword: "饗食" },
    { label: "炸物", keyword: "炸雞" },
    { label: "電子雞服裝", keyword: "電子雞服裝" },
    { label: "虛擬頭像框", keyword: "虛擬頭像框" },
  ];

  return (
    <div className="flex items-center gap-4 w-full h-17 px-4 py-2.5 bg-white text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      <span className="font-bold text-[#3D2419]/80 shrink-0">熱門標籤：</span>
      {tags.map((tag) => {
        const isActive = activeKeywords.includes(tag.keyword);
        return (
        <div key={tag.label}
          className={`inline-flex items-center gap-1.5 px-3 py-1
                      text-sm border-[3px] border-[#3D2419]
                      shadow-[2px_2px_0px_0px_#3D2419] select-none
                      transition-colors cursor-pointer
                      ${isActive ? "bg-[#3D2419] text-white" : "bg-[#FFD3B6] text-[#3D2419] hover:bg-[#ffbe94]"}`}
          onClick={() => onTagToggle(tag.keyword)}
        >
          {tag.label}
        </div>
      )})}
    </div>
  );
}