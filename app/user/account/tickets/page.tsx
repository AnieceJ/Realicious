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
  { key: "usable", label: "未使用" },
  { key: "expired", label: "已過期" },
  { key: "2", label: "已使用" },
] as const;

function isPromotionExpired(ticket: Ticket, now: number) {
  return ticket.status === 1 && Boolean(
    ticket.expires_at && new Date(ticket.expires_at).getTime() < now,
  );
}

export default function AccountTickets() {
  const { user } = useUser();
  const userId = user?.id;
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [now] = useState(() => Date.now());

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
    if (activeFilter === "usable") return tickets.filter((ticket) => ticket.status === 1 && !isPromotionExpired(ticket, now));
    if (activeFilter === "expired") return tickets.filter((ticket) => isPromotionExpired(ticket, now) || ticket.status === 3);
    return tickets.filter((t) => String(t.status) === activeFilter);
  }, [tickets, activeFilter, now]);

  return (
    <Container className="shop-theme min-h-[calc(100dvh-5rem)] flex-col items-stretch overflow-visible bg-white md:flex-row md:overflow-hidden">
      <Left />
      <div className="no-scrollbar w-full min-w-0 px-4 pb-28 pt-4 md:h-[720px] md:flex-1 md:overflow-y-auto md:pb-4">
        <PageHeader icon={<TicketIcon className="h-5 w-5" />} title="我的票券" />

        {/* 篩選標籤 */}
        <div className="mb-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`min-w-0 px-2 py-2 text-xs font-bold border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] cursor-pointer transition-all sm:px-5 sm:text-sm ${
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
