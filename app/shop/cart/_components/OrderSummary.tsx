import React from "react";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/lib/shop/cart";
import { useConfirm } from "../../_components/ConfirmModal";
import { useUser } from "@/app/context/user";

export default function OrderSummary({ items }: { items: CartItem[] }) {
  const router = useRouter();
  const { user } = useUser();
  const { confirmComponent, showConfirm } = useConfirm();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleCheckout = async () => {
    if (!user?.id) {
      const confirmed = await showConfirm(
        "電子票券、訂單紀錄與待付款續付都會綁定會員帳號。\n\n請先登入會員後再結帳。",
        { confirmLabel: "前往登入" },
      );
      if (confirmed) router.push("/user/login?next=/shop/checkout");
      return;
    }

    const count = items.reduce((sum, item) => sum + item.qty, 0);
    const confirmed = await showConfirm(
      `確認結帳？\n\n共 ${count} 件商品\n總計 $${subtotal.toLocaleString()}\n\n確定前往結帳頁面？`
    );
    if (confirmed) router.push("/shop/checkout");
  };

  return (
    <>
      {confirmComponent}
      <div
      className="flex flex-col w-full px-4 py-2.5
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"
    >
      <div className="flex items-center justify-center mt-6">
        <h3 className="text-3xl">訂單摘要</h3>
      </div>
      <hr className="border-t-4 w-full mx-auto mt-5 border-gray-600" />
      <div className="flex flex-col gap-4 mt-6 w-full px-4 py-3">
        <div className="flex justify-between mb-4">
          <span>小計</span>
          <span>${subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>營業稅 5%</span>
          <span>已內含</span>
        </div>
        <hr className="border-t-4 border-dashed border-gray-600 mt-6 mx-auto w-full" />
        <div className="flex justify-between mt-6">
          <h3 className="text-3xl">總計</h3>
          <h3 className="text-3xl">${subtotal.toLocaleString()}</h3>
        </div>
        <div
          onClick={handleCheckout}
          className="flex items-center justify-center w-full px-4 py-2.5 mt-8 cursor-pointer
                     bg-[#89502E] text-[#FFFFFF] font-bold text-base
                     border-[3px] border-[#3D2419]
                     shadow-[4px_4px_0px_0px_#3D2419]
                     hover:bg-[#a06040] active:translate-x-[2px] active:translate-y-[2px] transition-all"
        >
          <span className="text-3xl">前往結帳</span>
        </div>
      </div>
    </div>
    </>
  );
}
