'use client'
import Hero from "./_components/HeroSection";
import ProductSection from "./_components/ProductSection";
import AccountingSection from "./_components/AccountingSection";
import ArticleSection from "./_components/ArticleSection";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  // 清除google登入後網址上的 query 參數
  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      router.replace(pathname);
    }
  }, [searchParams, router, pathname]);

  return (
    <>
      <Hero />

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <ProductSection />
        </div>
      </section>

      <AccountingSection />

      <section className="py-24  bg-white">
        <div className="max-w-7xl mx-auto px-5">
          <ArticleSection />
        </div>
      </section>
    </>
  );
}
