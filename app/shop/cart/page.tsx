"use client";
import React from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import OrderItem from "./_components/OrderItem";
import OrderSummary from "./_components/OrderSummary";
import EmptyCart from "./_components/EmptyCart";
import { ShoppingBasket } from "lucide-react";

export default function page() {
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
        {/* 左側+右側區塊 */}
        <div className="flex flex-row gap-8 mt-6">
          {/* 左側訂單區塊 */}
          <div className="w-[60%]">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBasket className="w-9 h-9" />
              <h3 className="text-4xl font-bold">購物車</h3>
            </div>
          <div>
            <OrderItem />
          </div>
          <div>
            <OrderItem />
          </div>
          <div>
            <OrderItem />
          </div>
          <div className="w-fit">
            <EmptyCart />
          </div>
        </div>

        {/* 右側結帳區塊 */}
        <div className="w-[40%] mt-17">
          <div>
            <OrderSummary />
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
