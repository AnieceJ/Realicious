"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUser } from "@/app/context/user";

import Link from "next/link";
import Image from "next/image";
import Cookies from "js-cookie";

import Container from "../_components/container";
import loginAd from "@/public/user/login.png";

const FAKE_USER = {
  id: 1,
  account: "test@example.com",
  role: "11",
  nick_name: "福利熊",
  avatar: "123",
};
const FAKE_TOKEN = "mock-jwt-token-xyz";

export default function Login() {
  console.log("Login Render");

  const router = useRouter();
  const { login } = useUser();

  const [loginError, setLoginError] = useState(false); // 登入錯誤處理

  const [shakeEmail, setShakeEmail] = useState(false); // Email 欄位錯誤特效
  const [shakePassword, setShakePassword] = useState(false); // Password 欄位錯誤特效
  const [submit, setSubmit] = useState(false); // 表單送出中的按鈕的效果

  // RHF有錯誤訊息時觸發晃動
  const onError = (errors: any) => {
    if (errors.email) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 400); // 0.4秒動畫跑完後，關掉開關
    }
    if (errors.password) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 400); // 0.4秒後關掉
    }
  };

  // 使用 RHF
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  // 表單送出
  const onSubmit = (data: any) => {
    if (submit) return; // 防止快速重複點擊
    setLoginError(false); // 登入中特效
    setSubmit(true);
    const account = data.email;
    const password = data.password;

    // 模擬登入
    setTimeout(async () => {
      const onLogin = await login(account, password);
      if (onLogin) {
        // alert(`登入成功`);
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
          <h1 className="text-[24px] my-10">登入</h1>

          <form
            // onSubmit={(e) => {
            //   alert("React Submit");
            //   e.preventDefault();
            // }}
            onSubmit={(e) => {
              console.log("React Submit");
              handleSubmit(onSubmit, onError)(e);
            }}
            className="flex flex-col items-center mb-5"
          >
            <div className="flex flex-col items-start mb-5">
              <label className="text-5 mb-2" htmlFor="email">
                電子郵件
              </label>
              <input
                {...register("email", { required: "這是必填欄位" })}
                className={`${errors.email ? "border-red-500" : ""} ${shakeEmail ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="email"
                placeholder="請輸入電子郵件"
              />
            </div>
            <div className="flex flex-col items-start mb-5">
              <label className="text-[20px] mb-2" htmlFor="password">
                密碼
              </label>
              <input
                {...register("password", { required: "必填" })}
                className={`${errors.password ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="password"
                id="password"
                placeholder="請輸入密碼"
              />
            </div>
            <div className="flex justify-between w-90 mb-5">
              <p
                className={`${loginError ? "animate-shake" : "invisible"} text-red-500`}
              >
                帳號或密碼錯誤
              </p>
              <Link
                className=" text-[16px] text-blue-600 hover:bg-blue-100 active:bg-blue-800 active:text-white"
                href={`/user/forgetPassword`}
              >
                忘記密碼
              </Link>
            </div>
            <button
              onClick={() => {
                console.log("button click")
              }}
              type="submit"
              disabled={submit}
              className={` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 ${submit ? `bg-gray-400 hover:bg-gray-400` : `bg-[#F02A2D] hover:bg-[#e50004]`}  text-white text-[26px] cursor-pointer  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              {submit ? `登入中...` : `確認送出`}
            </button>
          </form>

          <h2 className="text-[26px]">--OR--</h2>
          <div className="mt-5">
            <button className="w-40 h-12 mx-2 border">google</button>
            <button className="w-40 h-12 mx-2 border">其他</button>
          </div>
          <Link
            className=" text-[20px] text-blue-600 mt-10 hover:bg-blue-100 active:bg-blue-800 active:text-white"
            href={`/user/register`}
          >
            還沒有帳號嗎？按此註冊
          </Link>
        </div>
      </div>
    </Container>
  );
}
