"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "./_components/Breadcrumbs";
import Sort from "./_components/ProductSort";
import SidebarFilter from "./_components/Sidebar";
import Searchbar from "./_components/Searchbar";
import CategoryFilter from "./_components/CategoryFilter";
import FeaturedProductSection from "./_components/FeaturedProductSection";
import ProductCard from "./_components/ProductCard";
import { getProducts, type Product } from "@/lib/shop/product";

const PAGE_LIMIT = 9;

const categoryNames: Record<string, string> = { "1": "電子雞服裝", "2": "電子票券", "3": "虛擬頭像框" };
const tagLabels: Record<string, string> = { "鍋": "火鍋", "麥丹勞": "速食", "饗食": "吃到飽", "炸雞": "炸物", "電子雞服裝": "電子雞服裝", "虛擬頭像框": "虛擬頭像框" };

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState("")
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")
  const [tagKeywords, setTagKeywords] = useState<string[]>([])
  const [sortId, setSortId] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [filters, setFilters] = useState<Record<string, boolean>>({ onSale: false, inStock: false })
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts].filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );
    if (categoryId) list = list.filter((p) => String(p.category_id) === categoryId);
    if (tagKeywords.length > 0) list = list.filter((p) => tagKeywords.some((kw) => p.name.includes(kw)));
    if (filters.onSale) list = list.filter((p) => p.discount < 1);
    if (filters.inStock) list = list.filter((p) => p.stock_qty > 0);
    if (sortId === "price_low") list.sort((a, b) => a.price - b.price);
    if (sortId === "price_high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredProducts, sortId, minPrice, maxPrice, filters, categoryId, tagKeywords]);

  // 初次載入全部商品（推薦區用）
  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) setAllProducts(res.data);
    });
  }, []);

  // 篩選/搜尋時 → 重設 page = 1，取代商品列表
  useEffect(() => {
    getProducts({ keyword, page: 1 }).then((res) => {
      if (res.success) {
        setPage(1);
        setHasMore(true);
        setFilteredProducts(res.data);
        if (res.pagination && 1 >= res.pagination.totalPages) setHasMore(false);
      }
    });
  }, [keyword]);

  // 載入更多（下一頁）
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    getProducts({ keyword, page: nextPage }).then((res) => {
      if (res.success) {
        setFilteredProducts((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        if (res.pagination && nextPage >= res.pagination.totalPages) setHasMore(false);
      }
      setLoadingMore(false);
    });
  }, [page, hasMore, loadingMore, keyword]);

  // IntersectionObserver：偵測到底部
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="relative min-h-screen p-4">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto">
        {/* 頂層 2 欄：麵包屑與搜尋欄 */}
        <div className="flex gap-15 mb-4">
          <div className="flex w-64 flex-shrink-0 items-center justify-center">
            <Breadcrumbs
              items={[{ label: "首頁", href: "/" }, { label: "商品列表" }]}
            />
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1">
              <Searchbar onSearch={(keyword) => setKeyword(keyword)} />
            </div>
            <div className="flex-shrink-0">
              <Sort onSort={(id) => {
                setSortId(id);
                if (id === "") { setKeyword(""); setTagKeywords([]); }
              }} />
            </div>
          </div>
        </div>

        {/* 主內容 2 欄 */}
        <div className="flex gap-15">
          <div className="w-64 flex-shrink-0">
            <SidebarFilter activeCategoryId={categoryId} onCategoryChange={(id) => {
              setCategoryId((prev) => prev === id ? "" : id);
            }} onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max) }} onFilterChange={(f) => setFilters(f)}/>
          </div>

          {/* 右側主內容區 */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <CategoryFilter activeKeywords={tagKeywords} onTagToggle={(kw) => {
                setTagKeywords((prev) => prev.includes(kw) ? prev.filter((k) => k !== kw) : [...prev, kw]);
              }} />
            </div>

            {/* 已選取的篩選條件標籤 */}
            {(keyword || tagKeywords.length > 0 || minPrice > 0 || maxPrice < 5000 || filters.onSale || filters.inStock) && (
              <div className="flex flex-wrap items-center gap-2">
                {keyword && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFD3B6] text-[#3D2419] text-sm font-bold border-2 border-[#3D2419]">
                    {keyword}
                    <button onClick={() => setKeyword("")} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                  </span>
                )}
                {tagKeywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFD3B6] text-[#3D2419] text-sm font-bold border-2 border-[#3D2419]">
                    {tagLabels[kw] || kw}
                    <button onClick={() => setTagKeywords((prev) => prev.filter((k) => k !== kw))} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                  </span>
                ))}
                {(minPrice > 0 || maxPrice < 5000) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFD3B6] text-[#3D2419] text-sm font-bold border-2 border-[#3D2419]">
                    ${minPrice}–${maxPrice}
                    <button onClick={() => { setMinPrice(0); setMaxPrice(5000); }} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                  </span>
                )}
                {filters.onSale && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFD3B6] text-[#3D2419] text-sm font-bold border-2 border-[#3D2419]">
                    特價中
                    <button onClick={() => setFilters((f) => ({ ...f, onSale: false }))} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFD3B6] text-[#3D2419] text-sm font-bold border-2 border-[#3D2419]">
                    只顯示有貨
                    <button onClick={() => setFilters((f) => ({ ...f, inStock: false }))} className="ml-1 hover:text-red-500 cursor-pointer">✕</button>
                  </span>
                )}
                <button
                  onClick={() => { setKeyword(""); setCategoryId(""); setTagKeywords([]); setMinPrice(0); setMaxPrice(5000); setFilters({ onSale: false, inStock: false }); }}
                  className="text-sm text-gray-500 hover:text-red-500 underline cursor-pointer"
                >
                  清除全部
                </button>
              </div>
            )}

            {/* 推薦商品區塊：外層強制撐滿寬度 */}
            <div className="w-full">
              {allProducts.length > 0 && (
                <FeaturedProductSection products={allProducts} />
              )}
            </div>

            {/* 商品網格 */}
            <div className="grid grid-cols-3 gap-8">
              {sortedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* 無限滾動哨兵 + 載入中 */}
            <div ref={sentinelRef} className="h-10" />
            {loadingMore && (
              <div className="text-center py-4 text-[#3D2419] font-bold">載入更多商品...</div>
            )}
            {!hasMore && filteredProducts.length > 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">已顯示全部商品</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
