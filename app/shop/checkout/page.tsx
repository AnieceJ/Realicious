"use client";
import React from "react";
import CheckoutContactInfo from "./_components/CheckoutContactInfo";
import CheckoutOrderList from "./_components/CheckoutOrderList";
import CheckoutPaymentMethod from "./_components/CheckoutPaymentMethod";
import CheckoutSummary from "./_components/CheckoutSummary";

export default function CheckoutPage() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl mb-6">結帳/CHECKOUT</h2>
        <div className="flex flex-row gap-8">
        {/* 左側 */}
        <div className="w-[60%]">
          <div className="mb-6">
            <CheckoutContactInfo />
          </div>
          <div className="mb-6">
            <CheckoutOrderList />
          </div>
          <div>
            <CheckoutPaymentMethod />
          </div>
        </div>
        {/* 右側 */}
        <div className="w-[30%]">
          <CheckoutSummary/>
        </div>
      </div>
    </div>
    </div>
  );
}
