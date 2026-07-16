"use client";
import React, { useEffect, useState } from "react";

export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#3D2419] text-white px-6 py-3 shadow-lg text-base font-bold animate-pulse whitespace-nowrap">
      {message}
    </div>
  );
}

export function useToast() {
  const [msg, setMsg] = useState("");

  const showToast = (message: string) => setMsg(message);

  const toastComponent = msg ? <Toast message={msg} onClose={() => setMsg("")} /> : null;

  return { toastComponent, showToast };
}
