"use client";
import React from "react";
import ProductPhoto from "./_component/ProductPhoto";
import Hashtag from "./_component/Hashtag";
import SpecSelector from "./_component/SpecSelector";
import ProductAddOns from "./_component/ProductAddOns";
import QuantityPicker from "../../_components/QuantityPicker";

export default function page() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl">
        {/* 上邊左+右區塊 */}
        <div className="flex flex-row gap-6">
          {/* 左上商品圖片區塊 */}
          <div>
            <ProductPhoto />
          </div>
          {/* 右上購買區塊 */}
          <div className="w-full bg-blue-300">
            <div className="flex items-center justify-center w-full h-20 bg-purple-300">
              <span className="text-2xl">
                川媽臭臭鍋 - 臭到要他命套裝餐券(待確認風格)
              </span>
            </div>
            <div className="ml-4 mb-4 mt-4">
              <Hashtag/>
            </div>
            <div className="ml-4 mb-4 mt-6">
              <span className="text-3xl">＄價格</span>
            </div>
            <div className="ml-4 mb-4 mt-6">
              <SpecSelector/>
            </div>
            <div className="ml-4 mb-4 mt-6">
              <ProductAddOns/>
            </div>
            <div className="flex items-center ml-4 mb-4 mt-6 gap-3">
              <QuantityPicker/>
              <span>可購買數量:</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
