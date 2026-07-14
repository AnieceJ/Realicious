import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

import UserSidebar from "./_components/userSidebar";
import Chatroom from "./_components/chatroom";

export default function Header() {
	return (
<<<<<<< Updated upstream
		<header className=" w-full h-15 bg-[#BB0015] text-white ">
=======
		<header className="w-full h-15 bg-page-red text-white">
>>>>>>> Stashed changes
			<div className="max-w-7xl mx-auto h-full px-5 flex items-center justify-between">
				{/* Logo */}

				<Link
					href="/"
					className="font-black text-xl hover:underline underline-offset-4"
				>
					Realicious
				</Link>

				{/* Navigation */}

				<nav className="hidden md:flex items-center gap-x-2">
					<Link
						href="/article"
						className="px-4 py-3 font-medium hover:underline underline-offset-4"
					>
						文章
					</Link>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
					<Link
						href="/shop"
						className="px-4 py-3 font-medium hover:underline underline-offset-4"
					>
						商城
					</Link>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
					<Link
						href="/accounting"
						className="px-4 py-3 font-medium hover:underline underline-offset-4"
					>
						記帳小雞
					</Link>
				</nav>

				{/* Right */}

				<div className="flex items-center gap-x-3">
					<ShoppingBasket className="h-6 w-6" />

					<UserSidebar />

					<Chatroom />
				</div>
			</div>
		</header>
	);
}
