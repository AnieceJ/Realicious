"use client";
import React, { useState } from "react";
import type { Ticket } from "@/lib/shop/tickets";

const TYPE_LABEL: Record<string, string> = {
  product: "商品兌換",
  discount: "折扣",
  cash: "現金折價",
};

export default function TicketItem({ ticket }: { ticket: Ticket }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(ticket.created_at).toLocaleDateString("zh-TW");
  const expiresAt = ticket.expires_at
    ? new Date(ticket.expires_at).toLocaleDateString("zh-TW")
    : null;

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col w-full p-5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] select-none">
        <div className="flex flex-row items-center justify-between w-full">
          <div className="flex flex-col items-start gap-1.5 shrink-0 w-48 text-left">
            <div className="flex items-center gap-2">
              {ticket.product_img && (
                <img
                  src={ticket.product_img}
                  alt=""
                  className="w-10 h-10 object-cover border-2 border-[#3D2419]"
                />
              )}
              <div>
                <div className="text-sm font-black tracking-wide">
                  TICKET ID: <span className="text-[#8C5230]">#{ticket.id}</span>
                </div>
                <div className="text-xs text-[#3D2419]/50 font-medium">{date}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs bg-[#3D2419] text-white px-2 py-0.5">
                {TYPE_LABEL[ticket.type] || ticket.type}
              </span>
              <span className={`px-2 py-0.5 text-xs font-black border-[2px] border-[#3D2419] ${
                ticket.status === 1 ? "bg-green-400 text-white" :
                ticket.status === 2 ? "bg-gray-400 text-white" :
                "bg-red-300 text-white"
              }`}>
                {ticket.status === 1 ? "未使用" :
                 ticket.status === 2 ? "已使用" :
                 "已過期"}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-row items-center justify-end gap-6 text-right pl-6">
            <div className="flex flex-col items-end">
              <h4 className="text-lg font-black text-[#3D2419]">
                {ticket.product_name || ticket.name}
              </h4>
              {ticket.product_price && (
                <div className="text-base text-[#8C5230]">
                  原價 ${ticket.product_price.toLocaleString()}
                </div>
              )}
            </div>

            <button
              onClick={() => setExpanded(!expanded)}
              className="px-4 py-2.5 bg-white border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer text-sm font-black flex items-center gap-2"
            >
              <span>{expanded ? "收合" : "檢視詳細"}</span>
              <span className={`text-xs transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▼</span>
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t-4 border-dashed border-[#3D2419]/20 flex flex-col gap-2 text-sm text-[#3D2419]/80">
            <div className="flex justify-between">
              <span>票券類型</span>
              <span className="font-black text-[#3D2419]">{TYPE_LABEL[ticket.type] || ticket.type}</span>
            </div>
            {ticket.discount_value > 0 && (
              <div className="flex justify-between">
                <span>折扣金額</span>
                <span className="font-black text-[#3D2419]">
                  {ticket.type === "discount" ? `${ticket.discount_value}%` : `$${ticket.discount_value}`}
                </span>
              </div>
            )}
            {ticket.min_purchase > 0 && (
              <div className="flex justify-between">
                <span>最低消費</span>
                <span className="font-black text-[#3D2419]">${ticket.min_purchase.toLocaleString()}</span>
              </div>
            )}
            {expiresAt && (
              <div className="flex justify-between">
                <span>有效期限</span>
                <span className="font-black text-[#3D2419]">{expiresAt}</span>
              </div>
            )}
            {ticket.used_at && (
              <div className="flex justify-between">
                <span>使用時間</span>
                <span className="font-black text-[#3D2419]">
                  {new Date(ticket.used_at).toLocaleDateString("zh-TW")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
