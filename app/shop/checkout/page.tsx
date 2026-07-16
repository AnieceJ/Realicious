"use client";
import React, { useEffect, useState } from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import CheckoutContactInfo from "./_components/CheckoutContactInfo";
import CheckoutOrderList from "./_components/CheckoutOrderList";
import CheckoutPaymentMethod from "./_components/CheckoutPaymentMethod";
import CheckoutSummary from "./_components/CheckoutSummary";
import { getCartItems, type CartItem } from "@/lib/shop/cart";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(getCartItems());
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6 pt-4">
          <Breadcrumbs items={[
            { label: "首頁", href: "/" },
            { label: "商品列表", href: "/shop" },
            { label: "購物車", href: "/shop/cart" },
            { label: "結帳" }
          ]} />
        </div>
        <div className="flex flex-row gap-8">
          <div className="w-[60%]">
            <div className="mb-6">
              <CheckoutContactInfo />
            </div>
            <div className="mb-6">
              <CheckoutOrderList items={items} />
            </div>
            <div>
              <CheckoutPaymentMethod />
            </div>
          </div>
          <div className="w-[30%] self-start sticky top-8">
            <CheckoutSummary items={items} />
          </div>
        </div>
      </div>
    </div>
  );
}
