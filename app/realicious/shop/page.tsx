"use client";
import React from "react";
import Sort from "./_components/Sort";
import CartIcon from "./_components/CartIcon";
import SidebarFilter from "./_components/Sidebar";
import Searchbar from "./_components/Searchbar";

export default function ShopPage() {
  return (
    <div className="relative min-h-screen">
      {/* 上層麵包屑, 搜尋, 排序, 購物車圖案 */}
      <div className="fixed inset-0 -z-10 bg-[#FCE384]" />
      <div className="flex flex-row gap-50">
        <p className="font-semibold text-center flex items-center w-120">
          <span>首頁 / 商品列表</span>
        </p>
        <Searchbar/>
        <Sort />
        <CartIcon />
      </div>
      {/* 左側 - 側邊欄 */}
      <SidebarFilter />
    </div>
  );
}
