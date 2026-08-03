import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { cookies } from "next/headers";

import { UserProvider } from "@/app/context/user";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { AlertProvider } from "@/app/user/context/alert";
import CartSync from "./shop/_components/CartSync";
import { Pixelify_Sans } from "next/font/google";
import { ToastProvider } from "@/app/context/toast";

config.autoAddCss = false;
const pixelify = Pixelify_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-pixel",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const token = (await cookies()).get("token");

	return (
		<html lang="zh-TW" className={pixelify.variable}>
			<body className="w-full min-h-screen bg-white flex flex-col">
				<ToastProvider>
					<UserProvider>
						<CartSync />
						<AlertProvider>
							<Header className="" token={!!token} />
							<main className=" grow w-full">{children}</main>
							<Footer />
						</AlertProvider>
					</UserProvider>
				</ToastProvider>
			</body>
		</html>
	);
}
