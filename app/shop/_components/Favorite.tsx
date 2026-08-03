"use client";
import React, { useState } from "react";
import { addFavorite, removeFavorite } from "@/lib/shop/favorites";
import { useUser } from "@/app/context/user";
import { useToast } from "./Toast";

export default function Favorite({ productId, initialFavorited = false }: { productId: number; initialFavorited?: boolean }) {
  const { user } = useUser();
  const [favorited, setFavorited] = useState(initialFavorited);
  const { toastComponent, showToast } = useToast();

  const toggle = async () => {
    if (!user?.id) {
      showToast("請先登入會員後再收藏商品");
      return;
    }
    const userId = Number(user.id);
    if (favorited) {
      await removeFavorite(userId, productId);
      setFavorited(false);
    } else {
      await addFavorite(userId, productId);
      setFavorited(true);
    }
  };

  return (
    <>
      {toastComponent}
      <button
        type="button"
        onClick={toggle}
        aria-label={favorited ? "取消收藏商品" : "收藏商品"}
        className="w-14 h-14 flex items-center justify-center bg-white border-[3px] border-[#3D2419] shadow-[3px_3px_0px_0px_#3D2419] hover:bg-red-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
      >
        <svg className="w-5 h-5 transition-all" viewBox="0 0 24 24"
          fill={favorited ? "#ef4444" : "none"}
          stroke={favorited ? "#ef4444" : "#3D2419"}
          strokeWidth="2"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </>
  );
}
