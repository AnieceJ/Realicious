'use client'

import { useState, useEffect } from "react";
import Container from "../_components/container";
import Link from "next/link"
import ReturnLogin from '../_components/returnLogin'

export default function ForgetPassword() {
  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    if (seconds === 0) return;
    console.log(seconds);
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const handleSend = () => {
    if (seconds > 0) return;
    console.log(`發送驗證`);
    setSeconds(10);
  };
  const isCounting = seconds > 0;
  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-[430px] h-[720px] bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-[40px]">忘記密碼</h1>
          <form className="flex flex-col items-center mb-[20px]">
            <div className="flex flex-col items-start mb-[5px] w-[350px]">
              <label className="text-[20px] mb-[10px]" htmlFor="email">
                電子郵件
              </label>
              <div className="w-[350px] flex justify-between">
                <input
                  className="border w-[290px] h-[50px] text-[16px] px-2"
                  type="text"
                  id="email"
                  placeholder="請輸入電子郵件"
                />
                <button
                  className={`w-[50px] h-[50px] border ${isCounting ? "cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                >
                  {isCounting ? `${seconds}秒` : `發送`}
                </button>
              </div>
            </div>
            <div className="w-full mb-[10px]">
              <p className="text-green-600">已發送驗證碼到您的信箱</p>
            </div>
            <div className="flex flex-col items-start mb-[5px]">
              <label className="text-[20px] mb-[10px]" htmlFor="verification">
                驗證碼
              </label>
              <input
                className="border w-[350px] h-[50px] text-[16px] px-2"
                type="text"
                id="Verification"
                placeholder="如未收到驗證碼 請60秒後再試"
              />
            </div>
            <div className="w-full mb-[10px]">
              <p className="text-red-500">驗證碼錯誤</p>
            </div>

            <button className="mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[220px] h-[60px] bg-[#F02A2D] text-white text-[26px] cursor-pointer hover:bg-[#e50004] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Link href={'/user/resetPassword'}>確認送出</Link>
            </button>
            <div>
              <ReturnLogin />
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}
