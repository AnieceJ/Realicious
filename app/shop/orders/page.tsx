import React from "react";
import OrderSidebar from "./_components/OrderSidebar";

export default function OrderPage() {
  return (
    //
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      {/* 上面區塊+左邊區塊+右邊區塊 */}
      <div className="max-w-7xl>">
        {/* 上面區塊 */}
        <div className="flex flex-row justify-between">
          <h2 className="text-4xl">我的訂單 / MY ORDERS</h2>
          <div className="bg-purple-300 w-50 h-20">
          {/* <img src="" alt="" /> */}
          電子雞
          </div>
        </div>
        {/* 左邊區塊 */}
        <div className="w-[30%]">
          <OrderSidebar/>
        </div>
        {/* 右邊區塊 */}
        <div></div>
      </div>
    </div>
  );
}
