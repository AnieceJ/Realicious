import "./globals.css";
import Link from "next/link";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="zh-TW">
			<body className="w-full min-h-screen bg-white flex flex-col">
				<header className="w-full bg-red-700  text-slate-100">
					<div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
						<Link
							href="/"
							className="font-bold text-xl hover:underline decoration-white underline-offset-5"
						>
							Realicious
						</Link>
						<nav className="flex gap-4 items-center">
							<Link
								href="/article"
								className="inline-block text-white px-4 py-3 rounded-lg font-medium hover:underline decoration-white underline-offset-5"
							>
								文章
							</Link>
							<Link
								href="/shop"
								className="inline-block bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
							>
								商城
							</Link>
							<Link
								href="/accounting"
								className="inline-block text-white px-4 py-3 rounded-lg font-medium hover:underline decoration-white underline-offset-5"
							>
								記帳小雞
							</Link>
						</nav>
					</div>
				</header>
				<main className="grow w-full">
					<div className="max-w-7xl mx-auto py-8">{children}</div>
				</main>
				<footer className="w-full bg-slate-100 border-t border-slate-500">
					<div className="max-w-7xl mx-auto py-4 text-center text-sm text-slate-500">
						© 2026 Realicious. All rights reserved.
					</div>
				</footer>
			</body>
		</html>
	);
}
