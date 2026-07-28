"use client";
import React, { useEffect, useState } from "react";
import type { CartItem } from "@/lib/shop/cart";

export default function CheckoutSummary({ items, onCheckout }: { items: CartItem[]; onCheckout: () => void }) {
  const [agreed, setAgreed] = useState(false);
  const [hint, setHint] = useState(false);
  const subtotal = (items || []).reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    if (hint) {
      const timer = setTimeout(() => setHint(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [hint]);

  const handleCheckout = () => {
    if (!agreed) { setHint(true); return; }
    onCheckout();
  };

  return (
    <div className="flex flex-col w-full px-4 py-2.5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
      <div className="flex items-center justify-center mt-6">
        <h3 className="text-2xl sm:text-3xl">訂單最後確認</h3>
      </div>
      <hr className="border-t-4 w-full mx-auto mt-5 border-gray-600" />
      <div className="flex flex-col gap-4 mt-6 w-full px-4 py-3">
        <div className="flex justify-between mb-4">
          <span>小計</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>營業稅 5%</span>
          <span>已內含</span>
        </div>
        <hr className="border-t-4 border-dashed border-gray-600 mt-6 mx-auto w-full" />
        <div className="flex justify-between mt-6">
          <h3 className="text-xl sm:text-2xl">總計</h3>
          <h3 className="text-xl sm:text-2xl">${subtotal.toLocaleString()}</h3>
        </div>
        <div
          className={`flex flex-row items-center gap-3 mt-6 cursor-pointer select-none transition-all duration-200 ${hint ? "animate-pulse" : ""}`}
          onClick={() => setAgreed(!agreed)}
        >
          <div className={`w-6 h-6 border-[3px] shrink-0 flex items-center justify-center shadow-[1px_1px_0px_0px_#3D2419] transition-colors ${hint ? "border-red-500 bg-red-100" : agreed ? "bg-[#A8E6CF] border-[#3D2419]" : "bg-white border-[#3D2419]"}`}>
            {agreed && <div className="w-2 h-2 bg-[#3D2419]" />}
          </div>
          <span className={`text-sm leading-tight transition-colors ${hint ? "text-red-500" : "text-[#3D2419]/80"}`}>我已經閱讀並同意電子票券使用及退款規範</span>
        </div>
        <div
          onClick={handleCheckout}
          className={`flex items-center justify-center w-full px-4 py-2.5 mt-8 bg-[#89502E] text-[#FFFFFF] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] transition-all ${agreed ? "cursor-pointer hover:bg-[#a06040] active:translate-x-[2px] active:translate-y-[2px]" : "opacity-50 cursor-not-allowed"}`}
        >
          <span className="text-2xl sm:text-3xl">確認結帳</span>
        </div>
        <div className={`flex justify-center transition-opacity ${agreed ? "opacity-100" : "opacity-40"}`}>
          <span>*點擊後將開始進行支付</span>
        </div>
      </div>
    </div>
  );
}
