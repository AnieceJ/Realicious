"use client";
import React from "react";
import ProductPhoto from "./_component/ProductPhoto";

export default function page() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl">
        {/* 商品圖片區塊 */}
        <div>
        <ProductPhoto/>
        </div>
      </div>
    </div>
  );
}
