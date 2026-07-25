"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
	return (
		<section className="relative overflow-hidden bg-page-red">
			{/* Hero 容器：满版宽度，flex 布局 */}
			<div className="relative w-full h-190 flex items-center">
				{/* 内层容器：限制文字内容在 1280px，左侧对齐 */}
				<div className="mx-auto max-w-7xl w-full px-5 h-full flex items-center z-20">
					{/* 左側文字內容區域 - 占據約 40-50% 寬度 */}
					<div className="w-full md:w-1/2 lg:w-5/12 shrink-0">
						<p className="mb-5 tracking-0.45em font-bold text-yellow-300 text-sm md:text-base">
							REALICIOUS
						</p>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white">
							Taste More.
							<br />
							Spend Less.
						</h1>

						<p className="mt-8 text-base md:text-lg lg:text-xl leading-9 text-white/90">
							探索真實食記、收藏優惠商品，
							<br />
							用記帳小雞管理你的每一餐。
						</p>

						<div className="mt-12 flex gap-3 md:gap-5 flex-wrap">
							<Link
								href="/article"
								className="bg-white px-6 md:px-8 py-3 md:py-4 font-bold border-2 border-black text-page-red shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all text-sm md:text-base"
							>
								開始探索
							</Link>

							<Link
								href="/shop"
								className="bg-yellow-300 px-6 md:px-8 py-3 md:py-4 font-bold border-2 border-black text-black shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] transition-all text-sm md:text-base"
							>
								前往商城
							</Link>
						</div>
					</div>
				</div>

				{/* Orbit 照片轉動區域 - 絕對定位，超出 hero 被裁切 */}
				<div className="absolute inset-0 pointer-events-none overflow-hidden">
					<div className="orbit">
						<div className="orbit-inner">
							<div className="plate plate-1">
								<div className="plate-content">
									<Image
										src="/article/salad.jpg"
										alt=""
										fill
										priority
										className="object-cover"
										sizes="(max-width: 1024px) 320px, 600px"
									/>
								</div>
							</div>

							<div className="plate plate-2">
								<div className="plate-content">
									<Image
										src="/article/PorkRice.png"
										alt=""
										fill
										priority
										className="object-cover"
										sizes="(max-width: 1024px) 320px, 600px"
									/>
								</div>
							</div>

							<div className="plate plate-3">
								<div className="plate-content">
									<Image
										src="/article/pizza.jpg"
										alt=""
										fill
										priority
										className="object-cover"
										sizes="(max-width: 1024px) 320px, 600px"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
