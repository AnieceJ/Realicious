"use client";
import React from "react";
import ProductPhoto from "./_component/ProductPhoto";
import Hashtag from "./_component/Hashtag";
import SpecSelector from "./_component/SpecSelector";
import ProductAddOns from "./_component/ProductAddOns";
import QuantityPicker from "../../_components/QuantityPicker";
import CartButtons from "../../_components/CartButtons";
import Favorite from "../../_components/Favorite";
import PurchaseButton from "./_component/PurchaseButton";
import ProductDescription from "./_component/ProductDescription";

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
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center w-full h-20">
              <span className="text-2xl">
                川媽臭臭鍋 - 臭到要他命套裝餐券(待確認風格)
              </span>
            </div>
            <div className="w-[80%]">
              {/* 熱門標籤 */}
              <div className="ml-4 mb-4 mt-4">
                <Hashtag />
              </div>
              <div className="ml-4 mb-4 mt-6">
                <span className="text-3xl">＄價格</span>
              </div>
              {/* 規格 */}
              <div className="ml-4 mb-4 mt-6">
                <SpecSelector />
              </div>
              {/* 加購區 */}
              <div className="ml-4 mb-4 mt-6">
                <ProductAddOns />
              </div>
              {/* 數量按鈕 */}
              <div className="flex items-center ml-4 mb-4 mt-6 gap-3">
                <QuantityPicker />
                <span>可購買數量: 99+</span>
              </div>
              {/* 加入購物車與收藏 */}
              <div className="flex ml-4 mb-4 mt-6 gap-3">
                <CartButtons />
                <div className="w-fit">
                <Favorite />
                </div>
              </div>
              {/* 立即購買按鈕 */}
              <div className="flex ml-4 mb-4 mt-6 gap-3">
                <PurchaseButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 下方商品說明區塊 */}
      <div>
        <ProductDescription/>
      </div>
    </div>
  );
}
