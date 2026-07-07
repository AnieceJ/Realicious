"use client";
import React from "react";
import OrderItem from "./_components/OrderItem";

export default function page() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      {/* 左側+右側區塊 */}
      <div className="max-w-7xl flex flex-row">
        {/* 左側訂單區塊 */}
        <div className="w-[60%]  mt-12">
          <div className="w-fit  mt-8 ml-6">
            <h3 className="text-4xl">我的訂單/Order</h3>
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
        </div>
        {/* 右側結帳區塊 */}
        <div className="w-[40%] bg-blue-200 mt-12"></div>
      </div>
    </div>
  );
}
