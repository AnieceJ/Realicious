"use client";
import React, { useEffect, useState } from "react";
import OrderSidebar from "./_components/OrderSidebar";
import OrderItem from "./_components/OrderItem";
import { getOrders, type Order } from "@/lib/shop/orders";

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders().then((res) => {
      if (res.success) setOrders(res.data);
    });
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-row justify-between mt-8 mb-8">
          <h2 className="text-4xl">我的訂單 / MY ORDERS</h2>
          <div className="bg-purple-300 w-50 h-20">電子雞</div>
        </div>
        <div className="flex flex-row gap-6">
          <div className="w-[30%]">
            <OrderSidebar />
          </div>
          <div className="w-[70%]">
            {orders.length === 0 ? (
              <p className="text-center py-10 text-gray-500">尚無訂單</p>
            ) : (
              orders.map((order) => (
                <OrderItem key={order.id} order={order} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
