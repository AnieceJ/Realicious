import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/shop/product";
import { addToCart } from "@/lib/shop/cart";
import { addFavorite, removeFavorite } from "@/lib/shop/favorites";
import { useUser } from "@/app/context/user";
import { useToast } from "./Toast";

interface FeaturedProductSectionProps {
  products: Product[];
  favoritedProductIds: number[];
  onFavoriteChange: (productId: number, isFavorited: boolean) => void;
}

export default function FeaturedProductSection({
  products,
  favoritedProductIds,
  onFavoriteChange,
}: FeaturedProductSectionProps) {
  const { user } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { toastComponent, showToast } = useToast();

  const featuredList = products.slice(0, 3);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, featuredList.length]);

  if (featuredList.length === 0) {
    return <div className="h-72 w-full bg-[#FFF9E6] border-[.1875rem] border-[#3D2419] animate-pulse" />;
  }

  const currentProduct = featuredList[currentIndex];
  const favorited = favoritedProductIds.includes(currentProduct.id);

  const toggleFavorite = async () => {
    if (!user?.id) {
      showToast("請先登入會員後再收藏商品");
      return;
    }
    const userId = Number(user.id);
    if (favorited) {
      const result = await removeFavorite(userId, currentProduct.id);
      if (result.success) onFavoriteChange(currentProduct.id, false);
    } else {
      const result = await addFavorite(userId, currentProduct.id);
      if (result.success) onFavoriteChange(currentProduct.id, true);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? featuredList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === featuredList.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {toastComponent}
      <div className="flex flex-row w-full h-72 bg-black border-[.1875rem] border-[#3D2419] shadow-[.25rem_.25rem_0rem_0rem_#3D2419] select-none overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* 左側：圖片輪播 */}
        <div className="relative h-full w-1/2 overflow-hidden border-[5px] border-black group">
          {/* 圖層容器 */}
          <div className="flex h-full transition-transform duration-400 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredList.map((p) => (
              <Link key={p.id} href={`/shop/products/${p.id}`}
                className="relative w-full h-full flex-shrink-0 block"
              >
                <img
                  src={`http://localhost:3001${p.main_img}`}
                  alt={p.name}
                  className="w-full h-full object-cover object-center"
                />
              </Link>
            ))}
          </div>

          {/* 左右箭頭 */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl border-[.125rem] border-[#3D2419] shadow-[.125rem_.125rem_0rem_0rem_#3D2419] hover:bg-[#ffbe94] active:translate-x-[.125rem] active:translate-y-[.125rem] active:shadow-none transition-all cursor-pointer"
            >◀</button>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-16 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="w-10 h-10 flex items-center justify-center bg-[#FFD3B6] text-[#3D2419] font-black text-xl border-[.125rem] border-[#3D2419] shadow-[.125rem_.125rem_0rem_0rem_#3D2419] hover:bg-[#ffbe94] active:translate-x-[.125rem] active:translate-y-[.125rem] active:shadow-none transition-all cursor-pointer"
            >▶</button>
          </div>

          {/* 小點點 */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-white/60 px-2 py-1 border border-[#3D2419]">
            {featuredList.map((_, index) => (
              <div key={index}
                className={`w-2 h-2 border border-[#3D2419] transition-all ${index === currentIndex ? 'bg-[#3D2419] w-4' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>

        {/* 右側：商品資訊 */}
        <div className="flex w-1/2 flex-col justify-center bg-black px-6 py-4">
          <span className="mb-3 inline-block w-fit border border-white bg-[#BB0015] px-2 py-0.5 text-xs text-white">
            今日主打
          </span>
          <h3 className="mb-2 text-xl font-black text-white">
            {currentProduct.name}
          </h3>
          <p className="mb-4 line-clamp-2 text-sm font-medium text-white/75">
            限時特惠主打商品！【{currentProduct.name}】現正熱賣中。
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <span className="inline-flex h-9 items-center bg-[#FFF0B8] px-3 text-base font-black text-[#BB0015]">
              ${currentProduct.price}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const result = addToCart(currentProduct, 1);
                showToast(result.addedQty > 0
                  ? `已將 ${currentProduct.name} 加入購物車`
                  : `已達可購買上限 ${result.stockLimit} 件`);
              }}
              className="inline-flex h-9 cursor-pointer items-center whitespace-nowrap bg-[#BB0015] px-4 text-sm font-bold text-white shadow-[4px_4px_0px_0px_#000] hover:bg-[#8E0010] active:translate-x-[.0625rem] active:translate-y-[.0625rem]"
            >
              加入購物車
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(); }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center bg-white shadow-[4px_4px_0px_0px_#000] transition-colors hover:bg-red-50"
            >
              <svg className="w-4 h-4 transition-all" viewBox="0 0 24 24"
                fill={favorited ? "#ef4444" : "none"}
                stroke={favorited ? "#ef4444" : "#3D2419"}
                strokeWidth="2"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
