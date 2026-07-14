"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Breadcrumbs from "../../_components/Breadcrumbs";
import ProductPhoto from "./_components/ProductPhoto";
import Hashtag from "./_components/Hashtag";
import SpecSelector from "./_components/SpecSelector";
import ProductAddOns from "./_components/ProductAddOns";
import QuantityPicker from "../../_components/QuantityPicker";
import CartButtons from "../../_components/CartButtons";
import Favorite from "../../_components/Favorite";
import PurchaseButton from "./_components/PurchaseButton";
import ProductDescription from "./_components/ProductDescription";
import { getProductById, type Product } from "@/lib/shop/product";

export default function ProductsPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProductById(id).then((res) => {
      if (res.success) setProduct(res.data);
    });
  }, [id]);

  if (!product) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
        <div className="max-w-7xl mx-auto py-8 text-center text-gray-500">載入中...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto">
        <div className="mb-4">
          <Breadcrumbs items={[
            { label: "首頁", href: "/" },
            { label: "商品列表", href: "/shop" },
            { label: product.name }
          ]} />
        </div>
        <div className="flex flex-row gap-6">
          <div>
            <ProductPhoto />
          </div>
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center justify-center w-fit">
              <span className="text-2xl">{product.name}</span>
            </div>
            <div className="w-[80%]">
              <div className="ml-4 mb-4 mt-4">
                <Hashtag />
              </div>
              <div className="ml-4 mb-4 mt-6">
                <span className="text-3xl">${product.price}</span>
              </div>
              <div className="ml-4 mb-4 mt-6">
                <SpecSelector />
              </div>
              <div className="flex items-center ml-4 mb-4 mt-6 gap-3">
                <QuantityPicker />
                <span>可購買數量: {product.stock_qty}</span>
              </div>
              <div className="flex ml-4 mb-4 mt-6 gap-3">
                <CartButtons />
                <div className="w-fit">
                <Favorite />
                </div>
              </div>
              <div className="flex ml-4 mb-4 mt-6 gap-3">
                <PurchaseButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <ProductDescription />
      </div>
    </div>
  );
}
