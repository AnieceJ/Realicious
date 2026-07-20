"use client";
import React, { useEffect, useState } from "react";
import type { Order } from "@/lib/shop/orders";
import { getOrderDetail } from "@/lib/shop/orders";

export default function OrderItem({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<{ product_name: string; quantity: number; unit_price: number }[]>([]);

  useEffect(() => {
    if (expanded && items.length === 0) {
      getOrderDetail(order.id).then((res) => {
        if (res.success) setItems(res.items);
      });
    }
  }, [expanded, order.id, items.length]);

  const date = new Date(order.created_at).toLocaleDateString("zh-TW");

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="flex flex-col w-full p-5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] select-none">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1.5 shrink-0 w-48 text-left">
            <div className="text-sm font-black tracking-wide">
              ORDER ID: <span className="text-[#8C5230]">#{order.id}</span>
            </div>
            <div className="text-xs text-[#3D2419]/50 font-medium">{date}</div>
            <div className="flex items-center justify-center px-3 py-1 mt-2 bg-[#466f44] text-[#FFFFFF] font-black text-sm border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419]">
              <span>處理中</span>
            </div>
          </div>

          <div className="flex-1 flex flex-row items-center justify-end gap-6 text-right pl-6">
            <div className="flex flex-col items-end">
              <h4 className="text-lg font-black text-[#3D2419]">
                訂單 #{order.id}
              </h4>
              <div className="text-lg font-black text-[#8C5230] mt-1">
                總計金額：${Number(order.total_price).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-2.5 bg-white border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer text-sm font-black flex items-center gap-2"
            >
              <span>{expanded ? "收合" : "檢視明細"}</span>
              <span className={`text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▼</span>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t-4 border-dashed border-[#3D2419]/20 flex flex-col gap-3">
            <div className="text-xs text-[#3D2419]/60 text-left tracking-wider mb-1">
              訂單明細 / ITEM DETAILS
            </div>
            {items.map((item, i) => (
              <div key={i} className="flex flex-row justify-between items-center bg-white border-[2px] border-[#3D2419] px-4 py-3 shadow-[2px_2px_0px_0px_#3D2419]">
                <div className="flex items-center gap-2.5">
                  <span className="text-base text-[#3D2419]">{item.product_name}</span>
                </div>
                <div className="text-base text-[#3D2419]/80">
                  數量: <span className="font-black text-[#3D2419]">x{item.quantity}</span> │ <span className="text-[#8C5230] font-black">${item.unit_price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}