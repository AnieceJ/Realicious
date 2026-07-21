"use client";
import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Ticket } from "@/lib/shop/tickets";

const TYPE_LABEL: Record<string, string> = {
  product: "商品兌換",
  discount: "折扣",
  cash: "現金折價",
};

export default function TicketItem({ ticket }: { ticket: Ticket }) {
  const [showQR, setShowQR] = useState(false);
  const date = new Date(ticket.created_at).toLocaleDateString("zh-TW");
  const expiresAt = ticket.expires_at
    ? new Date(ticket.expires_at).toLocaleDateString("zh-TW")
    : null;
  const isUsable = ticket.status === 1;

  return (
    <>
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
                onClick={() => setShowQR(true)}
                disabled={!isUsable}
                className={`px-4 py-2.5 font-black text-sm flex items-center gap-2 transition-all ${
                  isUsable
                    ? "bg-white border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#3D2419] cursor-pointer text-[#3D2419]"
                    : "bg-gray-200 border-[3px] border-gray-400 text-gray-400 cursor-not-allowed"
                }`}
              >
                出示核銷碼
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code 燈箱 */}
      {showQR && ticket.redeem_code && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowQR(false)}>
          <div className="bg-white border-[3px] border-[#3D2419] shadow-[6px_6px_0px_0px_#3D2419] px-8 py-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-[#3D2419] text-center mb-2">
              {ticket.product_name || ticket.name}
            </h3>
            <p className="text-xs text-gray-500 text-center mb-4">
              {TYPE_LABEL[ticket.type]} · #{ticket.id}
            </p>
            <div className="flex justify-center mb-4">
              <div className="border-[3px] border-[#3D2419] p-3">
                <QRCodeSVG value={ticket.redeem_code} size={200} />
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center break-all mb-3 select-all">
              {ticket.redeem_code}
            </p>
            <p className="text-xs text-gray-500 text-center">
              請出示此 QR Code 給店家掃碼核銷
            </p>
            {expiresAt && (
              <p className="text-xs text-red-500 text-center mt-1">
                有效期限：{expiresAt}
              </p>
            )}
            <button
              onClick={() => setShowQR(false)}
              className="w-full mt-4 py-2.5 font-bold text-sm text-[#3D2419] bg-white border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
            >
              關閉
            </button>
          </div>
        </div>
      )}
    </>
  );
}
