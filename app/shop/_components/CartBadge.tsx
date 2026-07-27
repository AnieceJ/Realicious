"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBasket } from "lucide-react";
import { getCartItems } from "@/lib/shop/cart";

export default function CartBadge() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		setCount(getCartItems().reduce((sum, item) => sum + item.qty, 0));
		const refresh = () =>
			setCount(getCartItems().reduce((sum, item) => sum + item.qty, 0));
		window.addEventListener("cart-updated", refresh);
		return () => window.removeEventListener("cart-updated", refresh);
	}, []);

	return (
		<Link href="/shop/cart" title="購物車" className="relative m-3">
			<ShoppingBasket className="h-6.25 w-7 cursor-pointer" />
			{count > 0 && (
				<span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center">
					{count > 99 ? "99+" : count}
				</span>
			)}
		</Link>
	);
}
