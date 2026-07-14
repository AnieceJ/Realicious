export default function ProductSection() {
	return (
		<section className="">
			<div className="max-w-7xl mx-auto">
				<div className="mb-12">
					<p className="text-[#BB0015] font-bold">OUR PICKS</p>

					<h2 className="text-4xl font-bold mt-2">精選商品</h2>
				</div>

				<div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
					{[1, 2, 3, 4].map((item) => (
						<div
							key={item}
							className="shadow hover:shadow-xl transition bg-white hover:-translate-y-2 overflow-hidden"
						>
							<div className="aspect-16/10 bg-gray-200" />

							<div className="p-5 space-y-3">
								<h3 className="font-bold text-lg">Burger Combo</h3>

								<p className="text-slate-500">限時優惠套餐</p>

								<span className="text-[#BB0015] text-2xl font-black">$299</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
