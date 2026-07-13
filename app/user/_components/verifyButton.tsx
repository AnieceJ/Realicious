"use client";
import { useState, useEffect } from "react";

interface VerifyButtonProps{
  onClick:()=> Promise<boolean>
  child:React.ReactNode
}

export default function VerifyButton({ onClick , child }: VerifyButtonProps) {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (seconds === 0) return;
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleSend = async() => {
    if (seconds > 0) return;
    const isExternalVaild = await onClick()
    if(isExternalVaild){
      console.log(`發送驗證`);
    setSeconds(10);
    }
  };
  const isCounting = seconds > 0;

  return (
    <button
      className={`w-12.5 h-12.5 border ${isCounting ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={(e) => {
        e.preventDefault();
        handleSend();
        // onClick();
      }}
      type="button"
    >
      {isCounting ? `${seconds}秒` : `${child}`}
    </button>
  );
}
