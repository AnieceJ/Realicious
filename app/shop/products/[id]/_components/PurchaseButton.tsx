import React from "react";

type PurchaseButtonProps = {
  productName?: string;
  qty?: number;
  price?: number;
};

export default function PurchaseButton({ productName = "商品", qty = 1, price = 0 }: PurchaseButtonProps) {
  const handleClick = () => {
    const total = qty * price;
    const confirmed = window.confirm(
      `確認購買以下商品？\n\n商品：${productName}\n數量：${qty}\n單價：$${price}\n總計：$${total}\n\n確定要前往結帳嗎？`
    );
    if (confirmed) {
      alert(`已導向結帳頁面（總計 $${total}）`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-center px-4 py-3 h-14 w-full
                  bg-[#FF6B6B] text-white font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[3px_3px_0px_0px_#3D2419]
                  active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                  transition-all duration-75 cursor-pointer select-none"
    >
      立即購買
    </div>
  );
}
