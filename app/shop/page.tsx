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

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState("")
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")
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
    if (filters.onSale) list = list.filter((p) => p.discount < 1);
    if (filters.inStock) list = list.filter((p) => p.stock_qty > 0);
    if (sortId === "price_low") list.sort((a, b) => a.price - b.price);
    if (sortId === "price_high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredProducts, sortId, minPrice, maxPrice, filters]);

  // 初次載入全部商品（推薦區用）
  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) setAllProducts(res.data);
    });
  }, []);

  // 篩選/搜尋時 → 重設 page = 1，取代商品列表
  useEffect(() => {
    getProducts({ category_id: categoryId, keyword, page: 1 }).then((res) => {
      if (res.success) {
        setPage(1);
        setHasMore(true);
        setFilteredProducts(res.data);
        if (res.pagination && 1 >= res.pagination.totalPages) setHasMore(false);
      }
    });
  }, [categoryId, keyword]);

  // 載入更多（下一頁）
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = page + 1;
    getProducts({ category_id: categoryId, keyword, page: nextPage }).then((res) => {
      if (res.success) {
        setFilteredProducts((prev) => [...prev, ...res.data]);
        setPage(nextPage);
        if (res.pagination && nextPage >= res.pagination.totalPages) setHasMore(false);
      }
      setLoadingMore(false);
    });
  }, [page, hasMore, loadingMore, categoryId, keyword]);

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
                if (id === "") setKeyword("");
              }} />
            </div>
          </div>
        </div>

        {/* 主內容 2 欄 */}
        <div className="flex gap-15">
          <div className="w-64 flex-shrink-0">
            <SidebarFilter activeCategory={categoryId} onCategoryChange={(id)=>{ setCategoryId(id)}} onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max) }} onFilterChange={(f) => setFilters(f)}/>
          </div>

          {/* 右側主內容區 */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <CategoryFilter activeKeyword={keyword} onTagClick={(kw) => setKeyword(kw)} />
            </div>

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
