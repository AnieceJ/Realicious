"use client";
import React from "react";
import OrderItem from "./_components/OrderItem";
import OrderSummary from "./_components/OrderSummary";
import EmptyCart from "./_components/EmptyCart";

export default function page() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      {/* 左側+右側區塊 */}
      <div className="max-w-7xl flex flex-row mt-30">
        {/* 左側訂單區塊 */}
        <div className="w-[60%]">
          <div className="w-fit">
            <h3 className="text-4xl">我的訂單/ORDER</h3>
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
  );
}
