"use client";

import registerAd from "@/public/user/register.png";
import Container from "../_components/container";
import ReturnLogin from "../_components/returnLogin";
import VerifyButton from "../_components/verifyButton";

import Image from "next/image";
import Cookies from "js-cookie";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { registerSchema, RegisterInput } from "@/validations/validate";
import { useUser } from "@/app/context/user";

export default function Register() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";

  const [isVerify, setIsVerify] = useState<boolean>(); // 發送驗證碼
  const [registered, setRegistered] = useState<boolean>(); // 已註冊
  const [isVerifyMessage, setIsVerifyMessage] = useState<string>(); // 發送成功訊息
  const [submit, setSubmit] = useState(false); // form 送出
  const { setUser } = useUser();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { account: "", password: "", verification: "", check: "" },
  });

  // 處理email是否重複，是就發送驗證碼

  const handleSendCode = async (): Promise<boolean> => {
    setIsVerify(false);
    setRegistered(false);
    const isvaild = await trigger("account"); // 驗證 email 欄位格式正確
    const scene = "register";
    if (isvaild) {
      const email = getValues("account");
      try {
        const res = await fetch(`${API_URL}/verification/send-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email, scene: scene }),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          setIsVerify(true);
          setIsVerifyMessage(data.message || "發送成功");
          return true;
        } else {
          setRegistered(true);
          setIsVerifyMessage(data.message || "此帳號已註冊過");
          return false;
        }
      } catch (error) {
        console.error("發送驗證碼連線失敗:", error);
        setIsVerify(true);
        setIsVerifyMessage("無法連接至伺服器");
        return false;
      }
    }
    return false;
  };

  // 表單送出
  const onSubmit = async (data: RegisterInput) => {
    if (submit) return; // 防止快速重複點擊
    setSubmit(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        Cookies.set("token", result.token, { expires: 1 });
        Cookies.set("user", JSON.stringify(result.user), { expires: 1 });
        setUser(result.user);
        alert(`註冊成功`);
        router.refresh();
        router.replace("/user/personal");
      } else {
        alert(result.message || "註冊失敗");
        setSubmit(false);
      }
    } catch (error) {
      console.error("發送驗證碼連線失敗:", error);
      alert("連線伺服器失敗，請稍後再試");
      setSubmit(false);
    }
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-107.5 h-180 bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-5">註冊</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center mb-5"
          >
            <div className="flex flex-col items-start mb-4 w-90">
              <label className="text-[20px] mb-2.5" htmlFor="email">
                電子郵件
              </label>
              <div className="w-90 flex justify-between">
                <input
                  {...register("account")}
                  className={`border w-72.5 h-12.5 text-[16px] px-2 ${isVerify ? "bg-yellow-100" : ""}`}
                  type="text"
                  id="email"
                  placeholder="請輸入電子郵件"
                  disabled={isVerify}
                />
                <VerifyButton onClick={handleSendCode} child={`驗證`} />
              </div>
              <div className="w-auto h-4">
                {errors.account && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.account.message)}
                  </p>
                )}
                {registered ? <p>{isVerifyMessage}</p> : ""}
                {isVerify ? <p>{isVerifyMessage}</p> : ""}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2.5" htmlFor="verification">
                驗證碼
              </label>
              <input
                {...register("verification")}
                className="border w-90 h-12.5 text-[16px] px-2"
                type="text"
                id="Verification"
                placeholder="如未收到驗證碼 請60秒後再試"
              />
              <div className="w-auto h-4">
                {errors.verification && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.verification.message)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2.5" htmlFor="password">
                密碼
              </label>
              <input
                {...register("password")}
                className="border w-90 h-12.5 text-[16px] px-2"
                type="text"
                id="password"
                placeholder="密碼６位元以上 需包含英文與數字"
              />
              <div className="w-auto h-4">
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.password.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2.5" htmlFor="password">
                密碼確認
              </label>
              <input
                {...register("check")}
                className="border w-90 h-12.5 text-[16px] px-2"
                type="text"
                id="password"
                placeholder="請再次輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.check && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.check.message)}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={submit}
              className={` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 ${submit ? `bg-gray-400 hover:bg-gray-400` : `bg-[#F02A2D] hover:bg-[#e50004]`}  text-white text-[26px] cursor-pointer  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              {submit ? `loading` : `確認送出`}
            </button>
            <div className="mt-4">
              <ReturnLogin />
            </div>
          </form>
        </div>
        <div className="w-0 h-0 sm:w-150 sm:h-180">
          <Image
            className="h-auto w-149.5"
            src={registerAd}
            alt="廣告"
            width={600}
            height={720}
            priority
          />
        </div>
      </div>
    </Container>
  );
}
