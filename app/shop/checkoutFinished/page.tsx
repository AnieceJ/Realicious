"use client";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FinishedPhoto from "./_components/FinishedPhoto";
import FinishedOrderList from "./_components/FinishedOrderList";
import FinishedAction from "./_components/FinishedAction";
import { clearCart, getCartItems, getLastOrder, saveLastOrder, type CartItem } from "@/lib/shop/cart";

export default function CheckoutFinishedPage() {
  const searchParams = useSearchParams();
  const itemsRef = useRef<CartItem[]>([]);
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<"loading" | "success" | "fail">("loading");

  useEffect(() => {
    const rtnCode = searchParams.get("RtnCode");
    const isCancelled = searchParams.get("cancel") === "1";
    const isSuccess = rtnCode === "1" || (searchParams.get("from") === "linepay" && !isCancelled);

    if (isSuccess) {
      const pendingId = localStorage.getItem("realicious-pending-order") || searchParams.get("orderId") || "";
      const cart = getCartItems().length > 0 ? getCartItems() : getLastOrder();
      itemsRef.current = cart;
      setOrderId(pendingId);
      saveLastOrder(cart);
      clearCart();
      localStorage.removeItem("realicious-pending-order");

      console.log("=== 完成頁除錯 ===");
      console.log("RtnCode:", rtnCode);
      console.log("pendingId:", pendingId);
      console.log("cart items:", cart);

      if (pendingId) {
        fetch(`http://localhost:3001/payment/confirm/${pendingId}`, { method: "PUT" }).catch(() => {});
      }

      setStatus("success");
    } else {
      localStorage.removeItem("realicious-pending-order");
      setStatus("fail");
    }
  }, [searchParams]);

  if (status === "loading") return null;

  if (status === "fail") {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-6xl mb-4">✕</div>
          <h2 className="text-3xl font-bold text-[#3D2419] mb-2">付款失敗</h2>
          <p className="text-gray-500 mb-6">交易未完成，購物車內容已保留</p>
          <Link href="/shop/checkout"
            className="px-6 py-3 bg-[#3D2419] text-white font-bold text-base border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_rgba(61,36,25,0.4)] hover:bg-[#5a3a2a] transition-all"
          >
            返回結帳
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto">
        <FinishedPhoto />
      </div>
      <div className="flex flex-col items-center justify-center mb-4">
        <h2 className="text-3xl text-center">
          感謝您的購買！
          <br /> Thank You for Your Order!
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-[60%]">
          <FinishedOrderList items={itemsRef.current} orderId={`ORD-${orderId}`} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="w-[70%]">
          <FinishedAction />
        </div>
      </div>
    </div>
  );
}
