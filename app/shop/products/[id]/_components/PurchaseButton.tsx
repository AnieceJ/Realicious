import React from "react";
import { useToast } from "../../../_components/Toast";

type PurchaseButtonProps = {
  productName?: string;
  qty?: number;
  price?: number;
};

export default function PurchaseButton({ productName = "商品", qty = 1, price = 0 }: PurchaseButtonProps) {
  const { toastComponent, showToast } = useToast();

  const handleClick = () => {
    const total = qty * price;
    const confirmed = window.confirm(
      `確認購買以下商品？\n\n商品：${productName}\n數量：${qty}\n單價：$${price}\n總計：$${total}\n\n確定要前往結帳嗎？`
    );
    if (confirmed) {
      showToast(`已導向結帳頁面（總計 $${total}）`);
    }
  };

  return (
    <>
      {toastComponent}
    <div
      onClick={handleClick}
      className="flex items-center justify-center w-full h-14 px-4
                  bg-[#FF6B6B] text-white font-black text-xl tracking-wider
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  hover:bg-[#ff8585]
                  active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                  transition-all duration-100 cursor-pointer select-none text-center"
    >
      立即購買
    </div>
    </>
  );
}