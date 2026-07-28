"use client";
import Hero from "./_components/HeroSection";
import ProductSection from "./_components/ProductSection";
import AccountingSection from "./_components/AccountingSection";
import ArticleSection from "./_components/ArticleSection";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect } from "react";
import PopularChatroomsSection from "./_components/PopularChatroomsSection";
import AmbientBackground from "@/components/AmbientBackground";

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
			<div className="font-pixel">
				<Hero />

				<section className="relative py-24 overflow-hidden">
					<AmbientBackground />
					<div className="relative z-10 max-w-7xl mx-auto px-5">
						<ProductSection />
					</div>
				</section>

				<AccountingSection />

				<section className="relative py-24 overflow-hidden">
					<AmbientBackground />
					<div className="relative z-10 max-w-7xl mx-auto px-5">
						<ArticleSection />
					</div>
					<div className="mx-auto mt-30 bg-gray-200">
						<PopularChatroomsSection />
					</div>
				</section>
			</div>
		</>
	);
}
