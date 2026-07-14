import Link from "next/link";

export default function AccountingSection() {
	return (
		<section className="bg-black w-full">
			<div className="max-w-7xl mx-auto py-24 px-5 flex items-center justify-between">
				<div>
					<div className="text-7xl">🐥</div>
				</div>

				<div className="text-center text-black">
					<h2 className="text-5xl font-black">今天花了多少？</h2>

					<p className="mt-4 text-xl opacity-90">
						用記帳小雞紀錄每一筆美食開銷
					</p>
				</div>

				<Link
					href="/accounting"
					className="bg-red-700 text-white font-bold px-8 py-4 hover:scale-105 transition"
				>
					開始記帳
				</Link>
			</div>
		</section>
	);
}
