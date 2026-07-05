"use client";
import React from "react";
import Sort from './_components/Sort'
import CartIcon from "./_components/CartIcon";

export default function ShopPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FCE384]" />
      <div className="flex flex-row gap-50">
        <p className="font-semibold text-center flex items-center w-120"><span>首頁 / 商品列表</span></p>
        <div className="flex items-center border pl-3 gap-2 bg-white border-gray-500/30 h-[46px] overflow-hidden max-w-md w-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 30 30"
            fill="#6B7280"
          >
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
          </svg>
          <input
            type="text"
            placeholder="Search for products"
            className="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-sm"
          />
        </div>
        <Sort />
        <CartIcon />
      </div>
    </div>
  );
}
