"use client";
import React from "react";
import Sort from "./_components/ProductSort";
import CartIcon from "./_components/CartIcon";
import SidebarFilter from "./_components/Sidebar";
import Searchbar from "./_components/Searchbar";
import CategoryFilter from "./_components/CategoryFilter";

export default function ShopPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FCE384]" />
      <div className="max-w-7xl">
      {/* 上層麵包屑, 搜尋, 排序, 購物車 */}
      <div className="flex flex-row gap-50 mb-10">
        <p className="font-semibold text-center flex items-center w-120 ml-10">
          <span>首頁 / 商品列表</span>
        </p>
        <Searchbar />
        <Sort />
        <CartIcon />
      </div>
      <div className="flex flex-row gap-10">
        <div>
        {/* 左側 - 側邊欄 */}
        <SidebarFilter />
        </div>
        {/* 標籤篩選 */}
        <CategoryFilter />
      </div>
      </div>
    </div>
  );
}
