import React from "react";
import { addToCart } from "@/lib/shop/cart";
import { useToast } from "./Toast";

type CartButtonsProps = {
  product: { id: number; name: string; price: number; main_img?: string };
  qty: number;
};

export default function CartButtons({ product, qty }: CartButtonsProps) {
  const { toastComponent, showToast } = useToast();

  return (
    <>
      {toastComponent}
      <div
        onClick={() => {
          addToCart(product, qty);
          showToast(`已將 ${product.name} x${qty} 加入購物車`);
        }}
        className="flex items-center justify-center w-full h-14 px-4
                    bg-[#3D2419] text-white font-black text-lg tracking-wide
                    border-[3px] border-[#3D2419]
                    shadow-[3px_3px_0px_0px_rgba(61,36,25,0.4)]
                    hover:bg-[#523324]
                    active:translate-x-[2px] active:translate-y-[2px] active:shadow-none
                    transition-all duration-100 cursor-pointer select-none text-center"
      >
        加入購物車
      </div>
    </>
  );
}