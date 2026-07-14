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
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
					<div className="max-w-md text-xs leading-5">
						<h3 className="text-white font-bold text-sm">About Us</h3>
						<p className="mt-1">
							Your ultimate street food companion. Discover authentic local reviews,
							unlock exclusive food vouchers, and manage your culinary budget effortlessly.
						</p>
					</div>
					<div className="md:text-left">
						<h3 className="text-white font-bold text-sm">Follow Us</h3>
						<div className="flex md:justify-end gap-x-5 mt-2">
							<FontAwesomeIcon icon={faInstagram} className="text-xl hover:text-white transition" />
							<FontAwesomeIcon icon={faXTwitter} className="text-xl hover:text-white transition" />
							<FontAwesomeIcon icon={faFacebook} className="text-xl hover:text-white transition" />
							<FontAwesomeIcon icon={faYoutube} className="text-xl hover:text-white transition" />
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
