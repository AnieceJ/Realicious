"use client";
import React, { useEffect, useState, useMemo } from "react";
import Container from "../../_components/container";
import Left from "../_components/left";
import OrderItem from "@/app/shop/orders/_components/OrderItem";
import { getOrders, type Order } from "@/lib/shop/orders";

const FILTERS = [
  { key: "all", label: "全部訂單" },
  { key: "1", label: "待付款" },
  { key: "2", label: "處理中" },
  { key: "3", label: "已完成" },
] as const;

export default function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    getOrders().then((res) => {
      if (res.success) setOrders(res.data);
    });
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => String(o.status) === activeFilter);
  }, [orders, activeFilter]);

  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left />
      <div className="w-[70%] h-[720px] p-4 overflow-y-auto no-scrollbar">
        <h2 className="text-3xl font-bold text-[#3D2419] mb-6">訂單紀錄</h2>

        {/* 篩選標籤 */}
        <div className="flex flex-row gap-3 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 font-bold text-sm border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] cursor-pointer transition-all ${
                activeFilter === f.key
                  ? "bg-[#89502E] text-white"
                  : "bg-[#FCF9F6] text-[#3D2419] hover:bg-[#FBDF58]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 訂單列表 */}
        {filteredOrders.length === 0 ? (
          <p className="text-center py-10 text-gray-500">尚無訂單</p>
        ) : (
          filteredOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))
        )}
      </div>
    </Container>
  );
}
