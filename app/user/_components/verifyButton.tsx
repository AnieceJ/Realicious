"use client";
import { useState, useEffect } from "react";

interface VerifyButtonProps {
  onClick: () => Promise<boolean>;
  child: React.ReactNode;
}

export default function VerifyButton({ onClick, child }: VerifyButtonProps) {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleSend = async () => {
    if (seconds > 0) return;
    const isExternalVaild = await onClick();
    if (isExternalVaild) {
      setSeconds(58);
    }
  };
  const isCounting = seconds > 0;

  return (
    <button
      className={`w-12.5 h-12.5 border-2  border-black   ${isCounting ? "bg-[#FCF9F6] cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FCF9F6]"}`}
      onClick={(e) => {
        e.preventDefault();
        handleSend();
      }}
      type="button"
    >
      {isCounting ? `${seconds}秒` : `${child}`}
    </button>
  );
}
