"use client";
import React, { useEffect, useState, useMemo } from "react";
import TicketItem from "./_components/TicketItem";
import { getTickets, type Ticket } from "@/lib/shop/tickets";
import { useUser } from "@/app/context/user";

const FILTERS = [
  { key: "all", label: "全部票券" },
  { key: "1", label: "未使用" },
  { key: "2", label: "已使用" },
  { key: "3", label: "已過期" },
] as const;

export default function TicketPage() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!user?.id) return;
    getTickets(Number(user.id)).then((res) => {
      if (res.success) setTickets(res.data);
    });
  }, [user?.id]);

  const filteredTickets = useMemo(() => {
    if (activeFilter === "all") return tickets;
    return tickets.filter((t) => String(t.status) === activeFilter);
  }, [tickets, activeFilter]);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-row justify-between mt-8 mb-8">
          <h2 className="text-4xl">票券中心</h2>
        </div>

        {/* 篩選標籤 */}
        <div className="flex flex-row gap-4 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-6 py-2 font-bold text-base border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] cursor-pointer transition-all ${
                activeFilter === f.key
                  ? "bg-[#89502E] text-white"
                  : "bg-[#FCF9F6] text-[#3D2419] hover:bg-[#FBDF58]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 票券列表 */}
        <div className="w-full">
          {filteredTickets.length === 0 ? (
            <p className="text-center py-10 text-gray-500">暫無票券</p>
          ) : (
            filteredTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
