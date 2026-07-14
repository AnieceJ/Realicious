"use client";
import React, { useState } from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import OrderItem from "./_components/OrderItem";
import OrderSummary from "./_components/OrderSummary";
import EmptyCart from "./_components/EmptyCart";
import { clearCart, getCartItems, type CartItem } from "@/lib/shop/cart";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(() => getCartItems());

  const refresh = () => setItems([...getCartItems()]);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 pt-4">
          <Breadcrumbs items={[
            { label: "首頁", href: "/" },
            { label: "商品列表", href: "/shop" },
            { label: "購物車" }
          ]} />
        </div>
        <div className="flex flex-row gap-8">
          <div className="w-[60%]">
            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                {items.map((item) => (
                  <OrderItem key={item.id} item={item} onUpdate={refresh} />
                ))}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => {
                      if (window.confirm("確定清空購物車嗎？")) {
                        clearCart();
                        refresh();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-[#3D2419] font-bold text-sm
                              border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419]
                              hover:bg-red-50 active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75 cursor-pointer"
                  >
                    <svg className="w-5 h-5 fill-[#3D2419]" viewBox="0 0 24 24">
                      <path d="M9 3h6v2H9V3zm-4 4h14v2H5V7zm2 4h10v10H7V11zm2 2v5h2v-5H9zm4 0v5h2v-5h-2z" />
                    </svg>
                    清空購物車
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="w-[40%]">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
