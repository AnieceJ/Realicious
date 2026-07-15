export default function ArticleSection() {
	return (
		<section className="">
			<div className="max-w-7xl mx-auto">
				<div className="mb-12">
					<p className="text-[#BB0015] font-bold">POPULAR</p>

					<h2 className="text-4xl font-bold mt-2">熱門文章</h2>
				</div>

				<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
					{[1, 2, 3].map((item) => (
						<article
							key={item}
							className="shadow hover:shadow-xl transition overflow-hidden bg-white hover:-translate-y-2"
						>
							<div className="aspect-video bg-gray-200" />

							<div className="p-6">
								<h3 className="font-bold text-xl line-clamp-2">
									台北最好吃的漢堡推薦
								</h3>

								<p className="mt-3 text-slate-500 line-clamp-2">
									分享近期吃過最值得推薦的美式漢堡店， 從價格到份量一次整理...
								</p>

								<div className="mt-5 flex justify-between text-sm text-slate-400">
									<span>福利熊</span>

									<span>2026/07/14</span>
								</div>
							</div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
