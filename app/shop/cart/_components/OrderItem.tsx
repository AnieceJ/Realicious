import React from "react";
import QuantityPicker from "../../_components/QuantityPicker";
import { removeFromCart, updateQty, type CartItem } from "@/lib/shop/cart";
import { useConfirm } from "../../_components/ConfirmModal";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
const FALLBACK_IMAGE = "/images/optimized/food-placeholder.webp";

function getImageUrl(imagePath: string) {
  return imagePath.startsWith("http") ? imagePath : `${API_BASE}${imagePath}`;
}

export default function OrderItem({ item, onUpdate }: { item: CartItem; onUpdate: () => void }) {
  const { confirmComponent, showConfirm } = useConfirm();

  const handleRemove = async () => {
    const confirmed = await showConfirm(`確定移除 ${item.name} 嗎？`);
    if (confirmed) {
      removeFromCart(item.id);
      onUpdate();
    }
  };

  return (
    <div className="mb-3">
      {confirmComponent}
      <div
        className="flex flex-col sm:flex-row gap-4 w-full px-4 py-4
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"
      >
        <div className="shrink-0">
          <div className="bg-[#FFF0B8] w-full h-48 sm:w-30 sm:h-30 flex items-center justify-center">
            <img
              src={item.main_img ? getImageUrl(item.main_img) : FALLBACK_IMAGE}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between min-w-0 py-1">
          <h3 className="text-lg leading-snug">{item.name}</h3>
          <span className="mt-3 text-lg text-[#8C5230]">${item.price}</span>
        </div>

        <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-4 sm:gap-5 sm:ml-auto">
          <div>
            <QuantityPicker
              value={item.qty}
              onChange={(qty) => { updateQty(item.id, qty); onUpdate(); }}
              onReachMin={handleRemove}
            />
          </div>
          <button
            onClick={handleRemove}
            className="flex items-center gap-1.5 px-2 py-1 text-sm text-[#BB0015] hover:bg-red-50 cursor-pointer active:translate-x-[1px] active:translate-y-[1px] transition-all duration-75"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M9 3h6v2H9V3zm-4 4h14v2H5V7zm2 4h10v10H7V11zm2 2v5h2v-5H9zm4 0v5h2v-5h-2z" />
            </svg>
            <span>移除</span>
          </button>
        </div>
      </div>
    </div>
  );
}
