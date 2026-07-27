"use client";
import React, { useSyncExternalStore, useState } from "react";
import Breadcrumbs from "../_components/Breadcrumbs";
import CheckoutContactInfo from "./_components/CheckoutContactInfo";
import CheckoutOrderList from "./_components/CheckoutOrderList";
import CheckoutSummary from "./_components/CheckoutSummary";
import { getCartItems, type CartItem } from "@/lib/shop/cart";
import { createOrder, type OrderContact } from "@/lib/shop/orders";
import { useUser } from "@/app/context/user";
import PaymentMethodDialog from "../_components/PaymentMethodDialog";

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
  const { user } = useUser();
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showPayment, setShowPayment] = useState(false);
  const [contact, setContact] = useState<OrderContact>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const createPendingOrder = async (): Promise<number | null> => {
    console.log("當前 user:", user);
    const order = await createOrder(items, contact, Number(user?.id) || undefined);
    if (!order.success) { alert("訂單建立失敗"); return null; }

    return order.orderId;
  };

  return (
    <div className="relative min-h-screen scroll-smooth">
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
              <CheckoutContactInfo
                defaultEmail={user?.account}
                onContactChange={setContact}
              />
            </div>
            <div className="mb-6">
              <CheckoutOrderList items={items} />
            </div>
          </div>
          <div className="w-[30%] self-start sticky top-8 transition-all duration-300">
            <CheckoutSummary items={items} onCheckout={() => setShowPayment(true)} />
          </div>
        </div>
      </div>

      {showPayment && <PaymentMethodDialog createOrder={createPendingOrder} onClose={() => setShowPayment(false)} />}
    </div>
  );
}
