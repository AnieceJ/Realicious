"use client";
import React, { useEffect, useState } from "react";

export default function Toast({
	message,
	onClose,
}: {
	message: string;
	onClose: () => void;
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	useEffect(() => {
		// 下一個 render 再顯示，觸發淡入
		requestAnimationFrame(() => {
			setIsVisible(true);
		});

		const fadeTimer = setTimeout(() => {
			setIsClosing(true);
		}, 2500);

		const closeTimer = setTimeout(() => {
			onClose();
		}, 3000);

		return () => {
			clearTimeout(fadeTimer);
			clearTimeout(closeTimer);
		};
	}, [onClose]);
	return (
		<div
			className={`fixed top-20 left-1/2 -translate-x-1/2 z-50
  bg-[#3D2419]/85 text-white
  px-5 py-2 text-sm font-bold
  whitespace-nowrap border-2 border-white
  shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]
  transition-all duration-1000 ease-out
  ${
		isClosing
			? "opacity-0 -translate-y-2"
			: isVisible
				? "opacity-100 translate-y-0"
				: "opacity-0 -translate-y-2"
	}
`}
		>
			{message}
		</div>
	);
}

export function useToast() {
	const [msg, setMsg] = useState("");

	const showToast = (message: string) => setMsg(message);

	const toastComponent = msg ? (
		<Toast message={msg} onClose={() => setMsg("")} />
	) : null;

	return { toastComponent, showToast };
}
