"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { paymentMethods, type PaymentMethod } from "@/lib/shop/payment";

type PaymentMethodDialogProps = {
  orderId?: number;
  createOrder?: () => Promise<number | null>;
  onClose: () => void;
};

export default function PaymentMethodDialog({ orderId, createOrder, onClose }: PaymentMethodDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = async (methodId: PaymentMethod) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const targetOrderId = orderId ?? await createOrder?.();
      if (!targetOrderId) {
        setIsSubmitting(false);
        return;
      }

      localStorage.setItem("realicious-pending-order", String(targetOrderId));
      await paymentMethods[methodId].checkout(targetOrderId);

      // 模擬付款不會離開目前頁面，需手動前往結果頁。
      if (methodId === "mock") {
        router.push(`/shop/checkoutFinished?RtnCode=1&orderId=${targetOrderId}`);
      }
    } catch {
      localStorage.removeItem("realicious-pending-order");
      alert("付款導向失敗，請稍後再試");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
    >
      <div className="bg-white border-[3px] border-[#3D2419] shadow-[6px_6px_0px_0px_#3D2419] px-8 py-6 max-w-md w-full mx-4" onClick={(event) => event.stopPropagation()}>
        <h3 className="text-2xl font-bold text-[#3D2419] text-center mb-2">選擇支付方式</h3>
        {orderId && <p className="text-center text-sm text-[#3D2419]/60 mb-6">訂單 #{orderId}</p>}
        <div className="flex flex-col gap-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePayment("ecpay")}
            className="flex items-center justify-center gap-3 w-full py-5 bg-slate-200 text-slate-600 font-bold text-xl border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:bg-slate-300 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            線上刷卡
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePayment("linepay")}
            className="flex items-center justify-center gap-3 w-full py-5 bg-slate-200 text-slate-600 font-bold text-xl border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:bg-slate-300 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            行動支付
          </button>
          <hr className="border-t-2 border-[#3D2419]/20 my-3" />
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handlePayment("mock")}
            className="flex items-center justify-center gap-3 w-full py-3 bg-gray-100 text-gray-500 font-bold text-base border-[2px] border-gray-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.15)] hover:bg-gray-200 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
          >
            模擬付款（測試用，跳過金流）
          </button>
        </div>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onClose}
          className="w-full mt-4 py-3 text-sm font-bold text-[#3D2419] bg-white border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          取消
        </button>
      </div>
    </div>
  );
}
