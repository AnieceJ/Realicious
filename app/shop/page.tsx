"use client";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrumbs from "./_components/Breadcrumbs";
import Sort from "./_components/ProductSort";
import SidebarFilter from "./_components/Sidebar";
import Searchbar from "./_components/Searchbar";
import CategoryFilter from "./_components/CategoryFilter";
import FeaturedProductSection from "./_components/FeaturedProductSection";
import ProductCard from "./_components/ProductCard";
import { getProducts, type Product } from "@/lib/shop/product";

export default function ShopPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categoryId, setCategoryId] = useState("")
  const [keyword, setKeyword] = useState("")
  const [sortId, setSortId] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [filters, setFilters] = useState<Record<string, boolean>>({ onSale: false, inStock: false })

  const sortedProducts = useMemo(() => {
    let list = [...filteredProducts];

    // 價格過濾
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // 特價中
    if (filters.onSale) list = list.filter((p) => p.discount < 1);

    // 只顯示有貨
    if (filters.inStock) list = list.filter((p) => p.stock_qty > 0);

    // 排序
    if (sortId === "price_low") list.sort((a, b) => a.price - b.price);
    if (sortId === "price_high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [filteredProducts, sortId, minPrice, maxPrice, filters]);

// 初次載入全部商品
  useEffect(() => {
    getProducts().then((res) => {
      console.log("API 回傳:", res);
      console.log("第一筆:", res.data?.[0]);
      if (res.success) {
        setAllProducts(res.data);
        setFilteredProducts(res.data);
      }
    });
  }, []);

// 篩選時重新撈資料
  useEffect(()=>{
    getProducts({category_id: categoryId, keyword}).then((res)=>{
      if(res.success) setFilteredProducts(res.data)
    })
  }, [categoryId, keyword])

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
          </div>
        </div>
      </div>
    </div>
  );
}
