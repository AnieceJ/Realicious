import Hero from "./_components/HeroSection";
import ProductSection from "./_components/ProductSection";
import AccountingSection from "./_components/AccountingSection";
import ArticleSection from "./_components/ArticleSection";

export default function HomePage() {
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
