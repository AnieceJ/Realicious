"use client";
import React from "react";
import type { CartItem } from "@/lib/shop/cart";

export default function CheckoutSummary({ items, onCheckout }: { items: CartItem[]; onCheckout: () => void }) {
  const subtotal = (items || []).reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="flex flex-col w-full px-4 py-2.5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      <div className="flex items-center justify-center mt-6">
        <h3 className="text-3xl">最後確認/CONFIRM</h3>
      </div>
      <hr className="border-t-4 w-full mx-auto mt-5 border-gray-600" />
      <div className="flex flex-col gap-4 mt-6 w-full px-4 py-3">
        <div className="flex justify-between mb-4">
          <span>小計(Subtotal)</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>營業稅 5%</span>
          <span>已內含</span>
        </div>
        <hr className="border-t-4 border-dashed border-gray-600 mt-6 mx-auto w-full" />
        <div className="flex justify-between mt-6">
          <h3 className="text-2xl">總計 TOTAL:</h3>
          <h3 className="text-2xl">${subtotal.toLocaleString()}</h3>
        </div>
        <div className="flex flex-row items-center gap-3 mt-6">
          <div className="w-6 h-6 border-[3px] border-[#3D2419] bg-white shrink-0 flex items-center justify-center shadow-[1px_1px_0px_0px_#3D2419]"></div>
          <span className="text-sm text-[#3D2419]/80 leading-tight">我已經閱讀並同意電子票券使用及退款規範</span>
        </div>
        <div
          onClick={onCheckout}
          className="flex items-center justify-center w-full px-4 py-2.5 mt-8 bg-[#89502E] text-[#FFFFFF] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] cursor-pointer hover:bg-[#a06040] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <span className="text-3xl">確認結帳<br />CHECKOUT</span>
        </div>
        <div className="flex justify-center">
          <span>*點擊後將開始進行支付</span>
        </div>
      </div>
    </div>
  );
}
