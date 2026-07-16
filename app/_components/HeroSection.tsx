import Link from "next/link";
import Image from "next/image";

export default function Hero() {
	return (
		<section className="w-full bg-page-red">
			<div className="max-w-[1920px] mx-auto">
				<div className="grid lg:grid-cols-2 min-h-175">
					{/* 左邊 */}
					<div className="flex items-center justify-center px-16">
						<div className="space-y-8">
							<span className="text-page-red font-bold tracking-widest">
								REALICIOUS
							</span>

							<h1 className="text-6xl font-black leading-tight text-white">
								Taste More.
								<br />
								Spend Less.
							</h1>
							<p className="text-white text-lg leading-8 max-w-lg">
								探索真實食記、收藏優惠商品，
								<br />
								用記帳小雞管理你的每一餐。
							</p>
							<Link
								href="/article"
								className="inline-flex bg-page-red border-2 border-white text-white px-8 py-4 font-bold hover:bg-[#991012] transition shadow-[4px_4px_0px_0px_#FFFFFF]"
							>
								開始探索 →
							</Link>
						</div>
					</div>

					{/* 右邊 */}
					<div className="grid grid-cols-2 gap-5 p-10">
						<div className="bg-gray-200 h-64">
							<Image
								src="/article/braised-pork.jpg"
								alt="你好"
								sizes="(max-width: 800px) 100vw, 80vw"
								width={1000}
								height={300}
							/>
						</div>
						<div className="bg-gray-300 h-80 mt-12">
							<Image
								src="/article/braised-pork.jpg"
								alt="你好"
								sizes="(max-width: 800px) 100vw, 80vw"
								width={1000}
								height={300}
							/>
						</div>
						<div className="bg-gray-300 h-80">
							<Image
								src="/article/braised-pork.jpg"
								alt="你好"
								sizes="(max-width: 800px) 100vw, 80vw"
								width={1000}
								height={300}
							/>
						</div>
						<div className="bg-gray-200 h-64 -mt-12">
							<Image
								src="/article/braised-pork.jpg"
								alt="你好"
								sizes="(max-width: 800px) 100vw, 80vw"
								width={1000}
								height={300}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
