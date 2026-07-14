import "./globals.css";

import Header from "./_components/Header";
import Footer from "./_components/Footer";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="zh-TW">
			<body className=" w-full min-h-screen bg-white flex flex-col">
				<Header />
				<main className="grow w-full">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
