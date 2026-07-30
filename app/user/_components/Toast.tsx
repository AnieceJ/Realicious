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

  useEffect(() => {
    // 1. 組件掛載後觸發進場動畫（浮出 + 漸顯）
    requestAnimationFrame(() => setIsVisible(true));

    // 2. 倒數準備離場（1500ms 後開始漸隱退場）
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    // 3. 等退場動畫執行完畢（約 300ms）再真正呼叫 onClose 移除元件
    const removeTimer = setTimeout(() => {
      onClose();
    }, 1800);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`
        fixed top-15 left-1/2 -translate-x-1/2 z-50
        bg-gray-800/90 backdrop-blur-md text-white 
        px-5 py-2.5 text-sm font-medium whitespace-nowrap
        border border-white/20
        shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)]
        transition-all duration-300 ease-out
        ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100" // 出現狀態：完全透明度、原位、正常大小
            : "opacity-0 -translate-y-4 scale-95 pointer-events-none" // 消失狀態：透明、往上浮動、稍微縮小
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