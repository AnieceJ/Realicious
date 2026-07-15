"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUser } from "@/app/context/user";

import Link from "next/link";
import Image from "next/image";

import Container from "../_components/container";
import loginAd from "@/public/user/login.png";
import google from "@/public/user/google-logo.svg"
import {button_shadow} from '../_components/button'

import { loginSchema ,LoginInput} from "@/validations/validate";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const router = useRouter();
  const { login } = useUser();

  const [loginError, setLoginError] = useState(false); // 登入錯誤處理

  const [shakeAccount, setShakeAccount] = useState(false); // Email 欄位錯誤特效
  const [shakePassword, setShakePassword] = useState(false); // Password 欄位錯誤特效
  const [submit, setSubmit] = useState(false); // 表單送出中的按鈕的效果

  // RHF有錯誤訊息時觸發晃動
  const onError = (errors: LoginInput) => {
    if (errors.account) {
      setShakeAccount(true);
      setTimeout(() => setShakeAccount(false), 400); // 0.4秒動畫跑完後，關掉開關
    }
    if (errors.password) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 400); // 0.4秒後關掉
    }
  }

  // 使用 RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { account: "", password: "" },
  });

  // 表單送出
  const onSubmit = (data: LoginInput) => {
    console.log(123)
    if (submit) return; // 防止快速重複點擊
    setLoginError(false); // 登入中特效
    setSubmit(true);
    const account = data.account;
    const password = data.password;

    // 模擬延遲登入
    setTimeout(async () => {
      const onLogin = await login(account, password);
      if (onLogin.success) {
        alert(onLogin.message);
        router.replace("/");
      } else {
        setLoginError(true); // 登入失敗，回復原狀
        setSubmit(false);
      }
    }, 1000);
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        {/* 廣告 */}
        <div className="w-0 h-0 sm:w-150 sm:h-180">
          <Image
            className=" object-contain object-bottom h-180"
            src={loginAd}
            alt="廣告"
            width={600}
            height={720}
            priority
          />
        </div>

        <div className="w-110 h-180 bg-white flex flex-col items-center">
          <h1 className="text-[24px] my-5">登入</h1>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col items-center mb-4"
          >
            <div className="flex flex-col items-start mb-5">
              <label className="text-5 mb-2" htmlFor="email">
                電子郵件
              </label>
              <input
                {...register("account")}
                className={`${errors.account ? "border-red-500" : ""} ${shakeAccount ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="email"
                placeholder="請輸入電子郵件"
              />
              <div className="w-auto h-4">
              {errors.account && (
                <p className={`text-red-500 text-sm mt-1 w-90 text-left`}>
                  {String(errors.account.message)}
                </p>
              )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="password">
                密碼
              </label>
              <input
                {...register("password")}
                className={`${errors.password ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="password"
                id="password"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 w-90 text-left">
                  {String(errors.password.message)}
                </p>
              )}
              </div>
            </div>
            <div className="w-full h-10 flex justify-between">
              <div className="">
              {loginError && (
                <span className={`text-red-500 text-sm `}>
                  帳號或密碼錯誤
                </span>
              )}
              </div>
                <Link
                className=" text-[16px] w-20 text-blue-600 hover:bg-blue-100 active:bg-blue-800 active:text-white"
                href={`/user/forgetPassword`}
              >
                忘記密碼
              </Link>
            </div>
            
            <button
              onClick={() => {}}
              type="submit"
              disabled={submit}
              className={` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 ${submit ? `bg-gray-400 hover:bg-gray-400` : `bg-[#F02A2D] hover:bg-[#e50004]`}  text-white text-[26px] cursor-pointer  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              {submit ? `登入中...` : `確認送出`}
            </button>
          </form>

          <h2 className="text-[20px] mb-4">--OR--</h2>
          <div className="flex justify-center items-center">
            <Link href={'http://localhost:3001/user/api/auth/google'} className={`${button_shadow} w-40 h-15 mx-2 flex justify-center items-center border `}>
            <Image
            className=" object-contain object-bottom w-10 mr-4"
            src={google}
            alt="廣告"
            width={30}
            height={30}
            priority
          />
            <span>google 登入</span></Link>
          
          <Link
            className={`${button_shadow} w-40 h-15 mx-2 flex justify-center items-center border `}
            href={`/user/register`}
          >
            按此註冊
          </Link>
          </div>
            
        </div>
      </div>
    </Container>
  );
}
