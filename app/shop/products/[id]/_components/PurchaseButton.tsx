import React from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/shop/cart";

type PurchaseButtonProps = {
  product: { id: number; name: string; price: number; main_img?: string };
  qty: number;
};

export default function PurchaseButton({ product, qty }: PurchaseButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    const total = qty * product.price;
    const confirmed = window.confirm(
      `確認購買以下商品？\n\n商品：${product.name}\n數量：${qty}\n單價：$${product.price}\n總計：$${total}\n\n確定要前往結帳嗎？`
    );
    if (confirmed) {
      addToCart(product, qty);
      router.push("/shop/checkout");
    }
  };

  return (
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
  );
}