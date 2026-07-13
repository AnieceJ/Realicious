"use client";
import React, { useEffect, useState } from "react";
import Sort from "./_components/ProductSort";
import CartIcon from "./_components/CartIcon";
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
      if (res.success) setProducts(res.data);
    });
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl">
        {/* 上層麵包屑, 搜尋, 排序, 購物車 */}
        <div className="flex flex-row gap-4 mb-10 items-center">
          <p className="font-semibold text-center flex items-center w-120 ml-10 text-black">
            <span>首頁 / 商品列表</span>
          </p>
          <Searchbar />
          <Sort />
          <CartIcon />
        </div>
        <div className="flex flex-row gap-10">
          <div>
            {/* 左側 - 側邊欄 */}
            <SidebarFilter />
          </div>
          {/* 右側 - 商品列 */}
          <div className="flex-1">
            {/* 標籤篩選 */}
            <div className="mb-5">
              <CategoryFilter />
            </div>
            {/* 推薦商品 */}
            <div className="mb-4">
              <FeaturedProductSection />
            </div>
            {/* 商品卡片 */}
            <div className="grid grid-cols-3 gap-4">
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
