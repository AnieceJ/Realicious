"use client";
import React from "react";
import CheckoutContactInfo from "./_components/CheckoutContactInfo";
import CheckoutOrderList from "./_components/CheckoutOrderList";

export default function CheckoutPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      {/* 左側+右側 */}
      <div className="max-w-7xl">
        {/* 左側 */}
        <div className="w-[60%]">
          <div className="mb-6">
            <CheckoutContactInfo />
          </div>
          <div>
            <CheckoutOrderList/>
          </div>
        </div>
      </div>
    </div>
  );
}
