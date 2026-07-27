"use client";

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import type { OrderContact } from "@/lib/shop/orders";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";

interface FullProfile {
  first_name?: string;
  last_name?: string;
  nick_name?: string;
  account?: string;
  email?: string;
  city?: string | null;
  district?: string | null;
  address?: string;
  phone?: string;
}

export default function CheckoutContactInfo({
  defaultEmail = "",
  onContactChange,
}: {
  defaultEmail?: string;
  onContactChange?: (contact: OrderContact) => void;
}) {
  const [contact, setContact] = useState<OrderContact>({
    name: "",
    email: defaultEmail,
    phone: "",
    address: "",
  });
  const isEdited = useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/profile/full`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok || !result.success || isEdited.current) return;

        const profile = result.data as FullProfile;
        const profileName = `${profile.last_name || ""}${profile.first_name || ""}`.trim()
          || profile.nick_name
          || "";
        const profileAddress = [profile.city, profile.district, profile.address]
          .filter(Boolean)
          .join("");

        const nextContact = {
          name: profileName,
          email: profile.email || profile.account || defaultEmail,
          phone: profile.phone || "",
          address: profileAddress,
        };
        setContact(nextContact);
        onContactChange?.(nextContact);
      } catch (error) {
        console.error("讀取結帳聯絡資料失敗:", error);
      }
    };

    fetchProfile();
  }, [defaultEmail, onContactChange]);

  const handleChange = (field: keyof OrderContact, value: string) => {
    isEdited.current = true;
    const nextContact = { ...contact, [field]: value };
    setContact(nextContact);
    onContactChange?.(nextContact);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col w-full px-4 py-2.5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
        <h2 className="text-xl mb-4">聯絡資訊</h2>
        <div className="flex flex-col gap-3">
          <label>
            <span className="text-sm">姓名</span>
            <input type="text" placeholder="請輸入姓名" value={contact.name} onChange={(e) => handleChange("name", e.target.value)} className="w-full px-3 py-2 border-2 border-[#3D2419] bg-white text-sm font-normal placeholder-gray-400" />
          </label>
          <label>
            <span className="text-sm">電子郵件</span>
            <input type="email" placeholder="請輸入電子郵件" value={contact.email} onChange={(e) => handleChange("email", e.target.value)} className="w-full px-3 py-2 border-2 border-[#3D2419] bg-white text-sm font-normal placeholder-gray-400" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">手機號碼</span>
            <input type="tel" placeholder="請輸入手機號碼" value={contact.phone} onChange={(e) => handleChange("phone", e.target.value)} className="w-full px-3 py-2 border-2 border-[#3D2419] bg-white text-sm font-normal placeholder-gray-400" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">地址</span>
            <input type="text" placeholder="請輸入地址" value={contact.address} onChange={(e) => handleChange("address", e.target.value)} className="w-full px-3 py-2 border-2 border-[#3D2419] bg-white text-sm font-normal placeholder-gray-400" />
          </label>
        </div>
      </div>
    </div>
  );
}
