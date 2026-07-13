import { config } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import {
  faInstagram,
  faXTwitter,
  faFacebook,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer (){
  return(
    <footer className="w-full h-30 bg-black border-t text-center text-slate-300">
            <div className="max-w-7xl mx-auto h-full items-center">
              <div className=" grid grid-cols-2">
                <div className="py-4 text-sm">
                  About Us Your ultimate street food companion. Discover
                  authentic local reviews, unlock exclusive food vouchers, and
                  manage your culinary budget effortlessly with our built-in
                  tracker. Taste the streets, stress-free!
                </div>
                <div className="">
                  <div className="py-4">follow us</div>
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="px-4 text-xl"
                  />
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
  )
}