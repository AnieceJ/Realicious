"use client";
import React, { useEffect, useState } from "react";
import Sort from "./_components/ProductSort";
import SidebarFilter from "./_components/Sidebar";
import Searchbar from "./_components/Searchbar";
import CategoryFilter from "./_components/CategoryFilter";
import FeaturedProductSection from "./_components/FeaturedProductSection";
import ProductCard from "./_components/ProductCard";
import { getProducts, type Product } from "@/lib/shop/product";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then((res) => {
      console.log("API 回傳:", res);
      console.log("第一筆:", res.data?.[0]);
      if (res.success) setProducts(res.data);
    });
  }, []);

  return (
    <div className="relative min-h-screen p-4">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto">
        
        {/* 頂層 2 欄：麵包屑與搜尋欄 */}
        <div className="flex gap-15 mb-4">
          <div className="flex w-64 flex-shrink-0 items-center justify-center">
            <p className="text-xl font-semibold text-black pt-2">
              首頁 / 商品列表
            </p>
          </div>
          <div className="flex-1 flex items-center gap-4">
            <div className="flex-1">
              <Searchbar />
            </div>
            <div className="flex-shrink-0">
              <Sort />
            </div>
          </div>
        </div>

        {/* 主內容 2 欄 */}
        <div className="flex gap-15">
          <div className="w-64 flex-shrink-0">
            <SidebarFilter />
          </div>

          {/* 右側主內容區 */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <CategoryFilter />
            </div>

            {/* 推薦商品區塊：外層強制撐滿寬度 */}
            <div className="w-full">
              {products.length > 0 && (
                <FeaturedProductSection products={products} />
              )}
            </div>

            {/* 商品網格 */}
            <div className="grid grid-cols-3 gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}