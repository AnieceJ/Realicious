"use client";
import React from "react";
import type { CartItem } from "@/lib/shop/cart";

export default function CheckoutOrderList({ items }: { items: CartItem[] }) {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full px-4 py-2.5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
        {(items || []).map((item, i) => (
          <div key={item.id} className="flex flex-row items-center justify-between border-[#3D2419] border-b-2 border-dashed last:border-b-0 mt-3 pb-1 pt-1">
            <div className="flex flex-row items-center">
              <div className="bg-pink-300 w-20 h-20 flex items-center justify-center text-sm shrink-0">
                {item.main_img ? (
                  <img src={`http://localhost:3001${item.main_img}`} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span>商品照片</span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="ml-6">
                  <span className="font-bold text-xl">{item.name}</span>
                  <span className="text-gray-500 ml-2">x{item.qty}</span>
                </div>
              </div>
            </div>
            <span className="text-xl">${item.price * item.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
