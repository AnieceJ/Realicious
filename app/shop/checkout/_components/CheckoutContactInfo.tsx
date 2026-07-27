"use client";

import React, { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Check, Pencil } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState(false);
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl">聯絡資訊</h2>
          <button
            type="button"
            onClick={() => setIsEditing((value) => !value)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-white border-2 border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-[#FBDF58] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all cursor-pointer"
            aria-label={isEditing ? "完成修改聯絡資訊" : "修改聯絡資訊"}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            <span>{isEditing ? "完成" : "修改"}</span>
          </button>
        </div>

        {isEditing ? (
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
        ) : (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <dt className="text-[#3D2419]/60 mb-1">姓名</dt>
              <dd className="min-h-5 break-words">{contact.name || "尚未填寫"}</dd>
            </div>
            <div>
              <dt className="text-[#3D2419]/60 mb-1">電子郵件</dt>
              <dd className="min-h-5 break-all">{contact.email || "尚未填寫"}</dd>
            </div>
            <div>
              <dt className="text-[#3D2419]/60 mb-1">手機號碼</dt>
              <dd className="min-h-5 break-words">{contact.phone || "尚未填寫"}</dd>
            </div>
            <div>
              <dt className="text-[#3D2419]/60 mb-1">地址</dt>
              <dd className="min-h-5 break-words">{contact.address || "尚未填寫"}</dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
}
