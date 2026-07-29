"use client";
import React, { useEffect, useState } from "react";

export default function Toast({
	message,
	onClose,
}: {
	message: string;
	onClose: () => void;
}) {
	useEffect(() => {
		const timer = setTimeout(onClose, 1500);
		return () => clearTimeout(timer);
	}, [onClose]);

	return (
		<div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#3D2419] text-white px-6 py-3 text-base font-bold whitespace-nowrap border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
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
