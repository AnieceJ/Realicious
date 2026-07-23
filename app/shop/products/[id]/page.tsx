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
import { getFavorites } from "@/lib/shop/favorites";
import { useUser } from "@/app/context/user";

export default function ProductsPage() {
  const { user } = useUser();
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    getProductById(id).then((res) => {
      if (res.success) setProduct(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (!user?.id) return;
    getFavorites(Number(user.id)).then((res) => {
      if (res.success) setIsFavorited(res.data.some((f: { product_id: number }) => f.product_id === Number(id)));
    });
  }, [user?.id, id]);

  if (!product) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-white">
        <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
        {/* 載入中狀態提示框 */}
        <div className="p-8 bg-[#FCF9F6] border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419] text-xl font-black text-[#3D2419] tracking-wider select-none">
          🎒 正在翻找背包中...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pb-16">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl mx-auto px-6">
        {/* 麵包屑導覽 */}
        <div className="py-6">
          <Breadcrumbs items={[
            { label: "首頁", href: "/" },
            { label: "商品列表", href: "/shop" },
            { label: product.name }
          ]} />
        </div>

        {/* 商品主區塊：左右並排 */}
        <div className="flex flex-row gap-8 items-start">
          {/* 左側：商品大圖區區塊 */}
          <div className="shrink-0">
            <ProductPhoto />
          </div>

          {/* 右側：購買決策區塊 */}
          <div className="flex-1 flex flex-col items-start text-left w-full select-none">
            
            {/* 實心對話框文字字卡（全面直角） */}
            <div className="w-full bg-[#FCF9F6] border-[3px] border-[#3D2419] p-5 shadow-[4px_4px_0px_0px_#3D2419] mb-6">
              {/* 標籤列 */}
              <div className="mb-3">
                <Hashtag productName={product.name} />
              </div>
              
              {/* 商品名稱 */}
              <h2 className="text-3xl font-black text-[#3D2419] tracking-wide leading-tight">
                {product.name}
              </h2>
              
              {/* 像素風分割虛線 */}
              <hr className="border-t-[2px] border-dashed border-[#3D2419]/20 my-3" />
              
              {/* 價格 */}
              <div className="text-3xl font-black text-[#8C5230] tracking-wider">
                ${product.price}
              </div>
            </div>

            {/* 下方選項控制區：寬度對齊大卡片 */}
            <div className="w-full flex flex-col gap-6 pl-1">
              {/* 規格選取器 */}
              <div>
                <SpecSelector />
              </div>

              {/* 數量選擇器 */}
              <div className="flex items-center gap-4 text-base font-bold text-[#3D2419]">
                <QuantityPicker value={qty} onChange={setQty} max={product.stock_qty} />
                <span className="text-sm text-[#3D2419]/60 bg-gray-100 px-2.5 py-1 border border-gray-300">
                  可購買數量: {product.stock_qty}
                </span>
              </div>

              {/* 加入購物車 + 收藏 按鈕列 */}
              <div className="flex flex-row items-center gap-3 w-full">
                {/* 讓加入購物車按鈕完全延伸填滿左側 */}
                <div className="flex-1">
                  <CartButtons product={product} qty={qty} />
                </div>
                {/* 愛心按鈕保持方形緊貼在旁 */}
                <div className="shrink-0">
                  <Favorite productId={product.id} initialFavorited={isFavorited} />
                </div>
              </div>

              {/* 立即購買大按鈕 */}
              <div className="w-full">
                <PurchaseButton product={{ id: product.id, name: product.name, price: product.price, main_img: product.main_img }} qty={qty} />
              </div>
            </div>

          </div>
        </div>

        {/* 商品大描述區塊 */}
        <div className="mt-16 border-t-[3px] border-[#3D2419] pt-12">
          <ProductDescription />
        </div>
      </div>
    </div>
  );
}