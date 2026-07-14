import "./globals.css";

import Header from "./_components/Header";
import Footer from "./_components/Footer";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

<<<<<<< Updated upstream
export default function RootLayout({
=======
export default async function RootLayout({
>>>>>>> Stashed changes
	children,
}: {
	children: React.ReactNode;
}) {
<<<<<<< Updated upstream
=======
	const token = (await cookies()).get("token");

>>>>>>> Stashed changes
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
