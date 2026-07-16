"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useUser } from "@/app/context/user";

import Link from "next/link";
import Image from "next/image";

import Container from "../_components/container";
import { button_shadow } from "../_components/button";

import { personalSchema, PersonalInput } from "@/validations/validate";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";
  const router = useRouter();
  const { login } = useUser();

  const [loginError, setLoginError] = useState(false); // 登入錯誤處理

  const [shakeAccount, setShakeAccount] = useState(false); // Email 欄位錯誤特效
  const [shakePassword, setShakePassword] = useState(false); // Password 欄位錯誤特效
  const [submit, setSubmit] = useState(false); // 表單送出中的按鈕的效果

  // RHF有錯誤訊息時觸發晃動
  const onError = (errors: any) => {
    if (errors.account) {
      setShakeAccount(true);
      setTimeout(() => setShakeAccount(false), 400); // 0.4秒動畫跑完後，關掉開關
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
    resolver: zodResolver(personalSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      nick_name: "",
      city: "",
      district: "",
      address: "",
      phone: "",
      birthday: "",
    },
  });

  // 表單送出

  const onSubmit = async (data: PersonalInput) => {
    if (submit) return; // 防止快速重複點擊
    setLoginError(false); // 登入中特效
    setSubmit(true);
    try {
      const res = await fetch(`${API_URL}/register/personal`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert(`修改成功`);
        router.replace("/");
      } else {
        alert(result.message || "修改失敗");
        setLoginError(true);
        setSubmit(false);
      }
    } catch (error) {
      console.error("發送驗證碼連線失敗:", error);
      alert("連線伺服器失敗，請稍後再試");
      setLoginError(true);
      setSubmit(false);
    }
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-110 bg-white flex flex-col items-center">
          <h1 className="text-[24px] my-5">填寫個人資料</h1>

          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col items-center mb-4"
          >
            <div className="flex flex-col items-start mb-5">
              <label className="text-5 mb-2" htmlFor="first_name">
                姓氏
              </label>
              <input
                {...register("first_name")}
                className={`${errors.first_name ? "border-red-500" : ""} ${shakeAccount ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="first_name"
                placeholder="請輸入電子郵件"
              />
              <div className="w-auto h-4">
                {errors.first_name && (
                  <p className={`text-red-500 text-sm mt-1 w-90 text-left`}>
                    {String(errors.first_name.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="last_name">
                姓名
              </label>
              <input
                {...register("last_name")}
                className={`${errors.last_name ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="last_name"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.last_name && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.last_name.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="nick_name">
                暱稱
              </label>
              <input
                {...register("nick_name")}
                className={`${errors.nick_name ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="nick_name"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.nick_name && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.nick_name.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="city">
                縣市
              </label>
              <input
                {...register("city")}
                className={`${errors.city ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="city"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.city.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="district">
                鄉鎮
              </label>
              <input
                {...register("district")}
                className={`${errors.district ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="district"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.district && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.district.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="address">
                詳細地址
              </label>
              <input
                {...register("address")}
                className={`${errors.address ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="address"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.address.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="phone">
                電話
              </label>
              <input
                {...register("phone")}
                className={`${errors.phone ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="number"
                id="phone"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.phone.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start mb-4">
              <label className="text-[20px] mb-2" htmlFor="birthday">
                生日
              </label>
              <input
                {...register("birthday")}
                className={`${errors.birthday ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="date"
                id="birthday"
                placeholder="請輸入密碼"
              />
              <div className="w-auto h-4">
                {errors.birthday && (
                  <p className="text-red-500 text-sm mt-1 w-90 text-left">
                    {String(errors.birthday.message)}
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
        </div>
      </div>
    </Container>
  );
}
