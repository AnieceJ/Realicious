import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faInstagram,
	faXTwitter,
	faFacebook,
	faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
	return (
		<footer className="w-full bg-black border-t text-slate-300">
			<div className="max-w-7xl mx-auto px-5 py-5">
				<div className="flex flex-col md:flex-row md:justify-between gap-8">
					<div className="max-w-xs">
						<h3 className="text-white font-bold text-lg font-pixel">
							About Us
						</h3>
						<p className="mt-2 text-xs leading-5">
							Real & Delicious
							<br />
							探索美食，聰明消費，享受每一刻。
						</p>
					</div>

					{/* Contact */}
					<div>
						<h3 className="text-white font-bold text-lg font-pixel">
							Contact Us
						</h3>
						<div className="mt-2 space-y-1 text-xs">
							<p>Email：contact@realicious.com</p>
							<p>電話：(02) 6631-6588</p>
							<p>地址：台北市復興南路一段390號2樓</p>
						</div>
					</div>

					{/* Social */}
					<div>
						<h3 className="text-white font-bold text-lg font-pixel">
							Follow Us
						</h3>
						<div className="flex gap-5 mt-2">
							<a
								href="https://zh.wikipedia.org/zh-tw/%E5%87%B1%E6%96%87%C2%B7%E6%96%AF%E7%89%B9%E7%BE%85%E5%A7%86"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Instagram"
							>
								<FontAwesomeIcon
									icon={faInstagram}
									className="text-xl hover:text-white transition cursor-pointer"
								/>
							</a>
							<a
								href="https://zh.wikipedia.org/zh-tw/%E6%9D%B0%E5%85%8B%C2%B7%E5%A4%9A%E8%A5%BF"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="X"
							>
								<FontAwesomeIcon
									icon={faXTwitter}
									className="text-xl hover:text-white transition cursor-pointer"
								/>
							</a>
							<a
								href="https://zh.wikipedia.org/zh-hant/%E9%A9%AC%E5%85%8B%C2%B7%E6%89%8E%E5%85%8B%E4%BC%AF%E6%A0%BC"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Facebook"
							>
								<FontAwesomeIcon
									icon={faFacebook}
									className="text-xl hover:text-white transition cursor-pointer"
								/>
							</a>
							<a
								href="https://youtu.be/_dUp68-pPeU?si=yzZVHRfUJuLSqhsz"
								target="_blank"
								rel="noopener noreferrer"
								aria-label="Youtube"
							>
								<FontAwesomeIcon
									icon={faYoutube}
									className="text-xl hover:text-white transition cursor-pointer"
								/>
							</a>
						</div>
					</div>
				</div>
				<div className="border-t border-slate-800 mt-4 pt-3 text-xs text-center text-slate-500">
					© 2026 Realicious. All rights reserved.
				</div>
			</div>
		</footer>
	);
}
