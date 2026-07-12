import Link from 'next/link'
import UserSidebar from './_components/userSidebar';
import Chatroom from './_components/chatroom';

export default function Header (){
return (
  <header className="fixed w-full h-[94px] bg-[#BB0015] border-b border-amber-700  text-zinc-900">
					<div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
						<Link
							href="/"
							className="font-bold text-xl hover:text-amber-900 "
						>
							Realicious
						</Link>
						<nav className="flex gap-4 items-center">
							<Link
								href="/article"
								className="inline-block bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
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
								className="inline-block bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
							>
								記帳小雞
							</Link>
							<UserSidebar></UserSidebar>
							<Chatroom></Chatroom>
						</nav>
					</div>
				</header>
)
}