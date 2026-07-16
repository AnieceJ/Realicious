"use client";
import React, { useSyncExternalStore, useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumbs from "../_components/Breadcrumbs";
import CheckoutContactInfo from "./_components/CheckoutContactInfo";
import CheckoutOrderList from "./_components/CheckoutOrderList";
import CheckoutSummary from "./_components/CheckoutSummary";
import { clearCart, getCartItems, type CartItem } from "@/lib/shop/cart";

const EMPTY: CartItem[] = [];
let cached = EMPTY;

function subscribe(cb: () => void) {
  window.addEventListener("cart-updated", cb);
  return () => window.removeEventListener("cart-updated", cb);
}

function getSnapshot() {
  const latest = getCartItems();
  if (latest.length === 0 && cached.length === 0) return cached;
  if (latest.length !== cached.length) { cached = latest; return cached; }
  for (let i = 0; i < latest.length; i++) {
    if (latest[i].id !== cached[i].id || latest[i].qty !== cached[i].qty) {
      cached = latest;
      return cached;
    }
  }
  return cached;
}

function getServerSnapshot() {
  return EMPTY;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showPayment, setShowPayment] = useState(false);

  const handlePayment = (method: string) => {
    setShowPayment(false);
    clearCart();
    alert(`選擇付款方式：${method}，前往訂單完成頁`);
    router.push("/shop/checkoutFinished");
  };

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
          </div>
          <div className="w-[30%] self-start sticky top-8">
            <CheckoutSummary items={items} onCheckout={() => setShowPayment(true)} />
          </div>
        </div>
      </div>

      {/* 支付方式燈箱 */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowPayment(false)}>
          <div className="bg-white border-[3px] border-[#3D2419] shadow-[6px_6px_0px_0px_#3D2419] px-8 py-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-[#3D2419] text-center mb-6">選擇支付方式</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => handlePayment("線上刷卡")}
                className="flex items-center justify-center gap-3 w-full py-5 bg-slate-200 text-slate-600 font-bold text-xl border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:bg-slate-300 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <svg className="w-7 h-7 shrink-0 fill-slate-600" viewBox="0 0 24 24">
                  <path d="M2 5h20v14H2V5zm2 2v2h16V7H4zm0 4v6h16v-6H4zm2 2h4v2H6v-2z" />
                </svg>
                線上刷卡
              </button>
              <button
                onClick={() => handlePayment("行動支付")}
                className="flex items-center justify-center gap-3 w-full py-5 bg-slate-200 text-slate-600 font-bold text-xl border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:bg-slate-300 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
              >
                <svg className="w-7 h-7 shrink-0 fill-slate-600" viewBox="0 0 24 24">
                  <path d="M6 2h12v20H6V2zm2 2v14h8V4H8zm3 15h2v2h-2v-2z" />
                </svg>
                行動支付
              </button>
            </div>
            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-4 py-3 text-sm font-bold text-[#3D2419] bg-white border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
