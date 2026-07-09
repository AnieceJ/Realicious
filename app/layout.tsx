import "./globals.css";
import Link from "next/link";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faInstagram,
	faXTwitter,
	faFacebook,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import UserSidebar from "./_components/_components/userSidebar";
import Chatroom from "./_components/_components/chatroom";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="zh-TW">
			<body className="w-full min-h-screen bg-white flex flex-col">
				{/* Header */}
				<header className="w-full h-15 bg-red-700 text-slate-100">
					<div className="max-w-7xl mx-auto h-full grid grid-cols-3 items-center">
						<div className="flex justify-start">
							<Link
								href="/"
								className="font-bold text-xl hover:underline decoration-white underline-offset-5"
							>
								Realicious
							</Link>
						</div>
						<nav className="flex gap-x-2 items-center justify-center">
							<Link
								href="/article"
								className="inline-block text-white px-4 py-3 font-medium hover:underline decoration-white underline-offset-5"
							>
								文章
							</Link>
							<Link
								href="/shop"
								className="inline-block text-white px-4 py-3 font-medium hover:underline decoration-white underline-offset-5"
							>
								商城
							</Link>
							<Link
								href="/accounting"
								className="inline-block text-white px-4 py-3 font-medium hover:underline decoration-white underline-offset-5"
							>
								記帳小雞
							</Link>
						</nav>
						<div className="flex gap-x-2 items-center justify-end">
							<UserSidebar/>
							<Chatroom/>
						</div>
					</div>
				</header>
				{/* Main */}
				<main className="grow w-full">
					<div className="max-w-7xl my-10 mx-auto m-h-150">{children}</div>
				</main>
				{/* Footer */}
				<footer className="w-full h-30 bg-black border-t text-center text-slate-300">
					<div className="max-w-7xl mx-auto h-full items-center">
						<div className=" grid grid-cols-2">
							<div className="py-4 text-sm">
								About Us Your ultimate street food companion. Discover authentic
								local reviews, unlock exclusive food vouchers, and manage your
								culinary budget effortlessly with our built-in tracker. Taste
								the streets, stress-free!
							</div>
							<div className="">
								<div className="py-4">follow us</div>
								<FontAwesomeIcon icon={faInstagram} className="px-4 text-xl" />
								<FontAwesomeIcon icon={faXTwitter} className="px-4 text-xl" />
								<FontAwesomeIcon icon={faFacebook} className="px-4 text-xl" />
								<FontAwesomeIcon icon={faYoutube} className="px-4 text-xl" />
							</div>
						</div>
						<span className="text-center text-sm text-slate-500">
							© 2026 Realicious. All rights reserved.
						</span>
					</div>
				</footer>
			</body>
		</html>
	);
}
