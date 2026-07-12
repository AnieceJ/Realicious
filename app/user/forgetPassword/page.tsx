'use client'

import { useState, useEffect } from "react";
import Container from "../_components/container";
import Link from "next/link"
import ReturnLogin from '../_components/returnLogin'
import VerifyButton from "../_components/verifyButton";

export default function ForgetPassword() {

const handleSendCode = async (): Promise<boolean> => {

    const isvaild = true
    if (isvaild) {
      console.log(`驗證碼發送`);
      return true;
    }
    return false;
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-110 h-180 bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-10">忘記密碼</h1>
          <form className="flex flex-col items-center mb-5">
            <div className="flex flex-col items-start mb-1.25 w-90">
              <label className="text-[20px] mb-2.5" htmlFor="email">
                電子郵件
              </label>
              <div className="w-90 flex justify-between">
                <input
                  className="border w-72.5 h-12.5 text-[16px] px-2"
                  type="text"
                  id="email"
                  placeholder="請輸入電子郵件"
                />
                <VerifyButton onClick={(handleSendCode)} child={`發送`}/>
              </div>
            </div>
            <div className="w-full mb-2.5">
              <p className="text-green-600">已發送驗證碼到您的信箱</p>
            </div>
            <div className="flex flex-col items-start mb-1.25">
              <label className="text-[20px] mb-2.5" htmlFor="verification">
                驗證碼
              </label>
              <input
                className="border w-90 h-12.5 text-[16px] px-2"
                type="text"
                id="Verification"
                placeholder="如未收到驗證碼 請60秒後再試"
              />
            </div>
            <div className="w-full mb-2.5">
              <p className="text-red-500">驗證碼錯誤</p>
            </div>

            <button className="mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 bg-[#F02A2D] text-white text-[26px] cursor-pointer hover:bg-[#e50004] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
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
