import Link from "next/link";

import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import { config } from "@fortawesome/fontawesome-svg-core";
import { ShoppingBasket } from "lucide-react";

import HeaderLoginBtn from "./_components/headerLoginBtn";

interface HeaderProps{
	token:boolean
}

export default function Header ({token}:HeaderProps){
return (
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

              <div className="flex items-center justify-end">
                <ShoppingBasket className="h-6.25 w-7 mr-3" />
                <HeaderLoginBtn token={token}></HeaderLoginBtn>
              </div>
            </div>
          </header>
)
}