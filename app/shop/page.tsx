"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumbs from "./_components/Breadcrumbs";
import Sort from "./_components/ProductSort";
import Searchbar from "./_components/Searchbar";
import CategoryFilter from "./_components/CategoryFilter";
import FeaturedProductSection from "./_components/FeaturedProductSection";
import ProductCard from "./_components/ProductCard";
import { getProducts, type Product } from "@/lib/shop/product";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState("")
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "")
  const [tagKeyword, setTagKeyword] = useState("")
  const [sortId, setSortId] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const priceMax = useMemo(() => {
    const matched = allProducts.filter((p) => {
      if (categoryId && String(p.category_id) !== categoryId) return false;
      if (tagKeyword && !p.name.includes(tagKeyword)) return false;
      return true;
    });
    const max = Math.max(...matched.map((p) => p.price));
    return max > 0 ? max : 5000;
  }, [allProducts, categoryId, tagKeyword])

  useEffect(() => {
    setMaxPrice(priceMax);
  }, [priceMax]);
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null);

  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts].filter(
      (p) => p.price >= minPrice && p.price <= maxPrice
    );
    if (categoryId) list = list.filter((p) => String(p.category_id) === categoryId);
    if (tagKeyword) list = list.filter((p) => p.name.includes(tagKeyword));
    if (sortId === "price_low") list.sort((a, b) => a.price - b.price);
    if (sortId === "price_high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredProducts, sortId, minPrice, maxPrice, categoryId, tagKeyword]);

  useEffect(() => {
    getProducts().then((res) => {
      if (res.success) setAllProducts(res.data);
    });
  }, []);

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
        {/* 頂層：麵包屑 + 搜尋 + 排序 + 篩選 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Breadcrumbs items={[{ label: "首頁", href: "/" }, { label: "商品列表" }]} />
          <div className="flex-1 min-w-[200px]">
            <Searchbar value={keyword} onSearch={(kw) => setKeyword(kw)} />
          </div>
          <Sort onSort={(id) => { setSortId(id); if (id === "") { setKeyword(""); setTagKeyword(""); } }} />
        </div>

        {/* 標籤 + 價格列 */}
        <div className="mb-4">
          <CategoryFilter
            activeKeyword={tagKeyword}
            minPrice={minPrice}
            maxPrice={maxPrice}
            priceMax={priceMax}
            onTagChange={(kw) => setTagKeyword(kw)}
            onPriceChange={(min, max) => { setMinPrice(min); setMaxPrice(max); }}
            onReset={() => { setTagKeyword(""); setKeyword(""); setSortId(""); setMinPrice(0); setMaxPrice(priceMax); }}
          />
        </div>

        {/* 推薦商品區塊 */}
        <div className="w-full mb-4">
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
  );
}
