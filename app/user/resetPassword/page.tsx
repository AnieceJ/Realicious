"use client";

import Container from "../_components/container";
import { useForm } from "react-hook-form";
import { useState } from "react";
// 1. 引入 useSearchParams
import { useRouter, useSearchParams } from "next/navigation"; 
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  ResetPasswordInput,
} from "@/validations/validate";

export default function ForgetPassword() {
  const router = useRouter();
  // 2. 初始化 searchParams 語法
  const searchParams = useSearchParams(); 
  
  // 3. 從網址取出 token 和 email (對應前一頁傳過來的參數名)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";
  const [submit, setSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", check: "" },
  });

  // 表單送出
  const onSubmit = async (data: ResetPasswordInput) => {
    if (submit) return; // 防止快速重複點擊
    
    if (!token || !email) {
      alert("驗證憑證已失效或網址不正確，請重新申請驗證碼。");
      router.replace("/user/forgetPassword"); // 丟回輸入驗證碼那一頁
      return;
    }

    setSubmit(true);
    try {
      // 4. 將路由改為我們寫好的後端驗證節點
      const res = await fetch(`${API_URL}/resetpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          resetToken: token,
          newPassword: data.password, 
        }),
      });
      const result = await res.json();

      if (res.ok && result.success) {
        alert(`重置成功`);
        router.replace("/user/login");
      } else {
        alert(result.message || "修改失敗");
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
        <div className="w-108 h-180 bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-10">重置密碼</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center mb-5"
          >
            <div className="flex flex-col items-start mb-5">
              <label className="text-[20px] mb-2" htmlFor="password">
                密碼
              </label>
              <input
                {...register("password", { required: "這是必填欄位" })}
                className={`${errors.password ? "border-red-500" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="password"
                id="password"
                placeholder="請輸入密碼"
              />
            </div>
            <div className="flex flex-col items-start mb-1">
              <label className="text-[20px] mb-2" htmlFor="check">
                密碼確認
              </label>
              <input
                {...register("check", { required: "這是必填欄位" })}
                className={`${errors.check ? "border-red-500" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="password"
                id="check"
                placeholder="請再次輸入密碼"
              />
            </div>
            <div className="w-auto h-4">
              {errors.check && (
                <p className="text-red-500 text-sm mt-1 w-90 text-left">
                  {String(errors.check.message)}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={submit}
              className={` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 ${submit ? `bg-gray-400 hover:bg-gray-400` : `bg-[#F02A2D] hover:bg-[#e50004]`}  text-white text-[26px] cursor-pointer  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              {submit ? `loading` : `確認送出`}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}