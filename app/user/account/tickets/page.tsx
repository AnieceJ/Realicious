"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Ticket as TicketIcon } from "lucide-react";
import Container from "../../_components/container";
import Left from "../_components/left";
import TicketItem from "@/app/shop/tickets/_components/TicketItem";
import { getTickets, type Ticket } from "@/lib/shop/tickets";
import { useUser } from "@/app/context/user";
import PageHeader from "@/app/_components/PageHeader";
import "@/app/shop/shop-theme.css";

const FILTERS = [
  { key: "all", label: "全部票券" },
  { key: "1", label: "未使用" },
  { key: "2", label: "已使用" },
  { key: "3", label: "已過期" },
] as const;

export default function AccountTickets() {
  const { user } = useUser();
  const userId = user?.id;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchTickets = useCallback(() => {
    if (!userId) return;
    getTickets(Number(userId)).then((res) => {
      if (res.success) setTickets(res.data);
    });
  }, [userId]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = useMemo(() => {
    if (activeFilter === "all") return tickets;
    return tickets.filter((t) => String(t.status) === activeFilter);
  }, [tickets, activeFilter]);

  return (
    <Container className="shop-theme bg-white flex-col sm:flex-row overflow-hidden">
      <Left />
      <div className="w-[70%] h-[720px] p-4 overflow-y-auto no-scrollbar">
        <PageHeader icon={<TicketIcon className="h-5 w-5" />} title="我的票券" />

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

        {/* 票券列表 */}
        {filteredTickets.length === 0 ? (
          <p className="text-center py-10 text-gray-500">暫無票券</p>
        ) : (
          filteredTickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} onRefresh={fetchTickets} />
          ))
        )}
      </div>
    </Container>
  );
}
