"use client";

import Image from "next/image";
import registerAd from "@/public/user/register.png";
import Container from "../_components/container";
import ReturnLogin from "../_components/returnLogin";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import VerifyButton from "../_components/verifyButton";

export default function Register() {
  const [isVerify, setIsVerify] = useState(false);
  const [submit, setSubmit] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", verification: "", password: "", check: "" },
  });
  // 處理email是否重複，是就發送驗證碼
  const handleSendCode = async (): Promise<boolean> => {
    setIsVerify(false);
    const isvaild = await trigger("email");
    if (isvaild) {
      console.log(`驗證碼發送`);
      setIsVerify(true);
      return true;
    }
    return false;
  };
  const onError = (errors: any) => {
    // 如果 Email 有錯誤，觸發晃動
  };
  // 表單送出
  const onSubmit = (data: any) => {
    setSubmit(true);

    setTimeout(() => {
      if (data.verification === `123`) {
        if (data.check === data.password) {
          console.log(data);
          alert(`註冊成功`);
          router.replace("/user/personal");
        } else {
          setSubmit(false);
        }
      } else {
        setSubmit(false);
        return alert(`驗證碼錯誤`);
      }
    }, 1000);
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-107.5 h-180 bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-6.25">註冊</h1>
          <form
            onSubmit={handleSubmit(onSubmit, onError)}
            className="flex flex-col items-center mb-5"
          >
            <div className="flex flex-col items-start mb-1.25 w-90">
              <label className="text-[20px] mb-2.5" htmlFor="email">
                電子郵件
              </label>
              <div className="w-90 flex justify-between">
                <input
                  {...register("email", {
                    required: "必填",
                    validate: (value) => {
                      const fakeAccount = "123";
                      if (value === fakeAccount) {
                        return "該帳號已存在";
                      }
                      return true;
                    },
                  })}
                  className={`border w-72.5 h-12.5 text-[16px] px-2 ${isVerify ? "bg-amber-100" : ""}`}
                  type="text"
                  id="email"
                  placeholder="請輸入電子郵件"
                  disabled={isVerify}
                />
                <VerifyButton onClick={handleSendCode} child={`驗證`} />
              </div>
            </div>
            <div className="w-full">
              <p
                className={` ${errors.email ? "text-red-600 " : isVerify ? "text-green-600" : "invisible"}`}
              >
                {errors.email
                  ? errors.email.message
                  : isVerify
                    ? "已發送驗證碼"
                    : "佔位"}
              </p>
            </div>
            <div className="flex flex-col items-start mb-1.25">
              <label className="text-[20px] mb-2.5" htmlFor="verification">
                驗證碼
              </label>
              <input
                {...register("verification", {
                  required: "這是必填欄位",
                })}
                className="border w-90 h-12.5 text-[16px] px-2 mb-2.5"
                type="text"
                id="Verification"
                placeholder="如未收到驗證碼 請60秒後再試"
              />
            </div>

            <div className="flex flex-col items-start mb-5">
              <label className="text-[20px] mb-2.5" htmlFor="password">
                密碼
              </label>
              <input
                {...register("password", {
                  required: "這是必填欄位",
                })}
                className="border w-90 h-12.5 text-[16px] px-2"
                type="text"
                id="password"
                placeholder="請輸入密碼"
              />
            </div>
            <div className="flex flex-col items-start mb-1.25">
              <label className="text-[20px] mb-2.5" htmlFor="password">
                密碼確認
              </label>
              <input
                {...register("check", {
                  required: "這是必填欄位",
                  validate: (value) => {
                    if (value !== getValues("password")) {
                      return `密碼不相同`;
                    }
                    return true;
                  },
                })}
                className="border w-90 h-12.5 text-[16px] px-2"
                type="text"
                id="password"
                placeholder="請再次輸入密碼"
              />
            </div>
            <div className="flex justify-between w-90 mb-5">
              <p className={`text-red-500 ${errors.check ? "" : "invisible"}`}>
                {errors.check ? errors.check?.message : "123"}
              </p>
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
          <Image className="h-auto w-149.5" src={registerAd} alt="廣告" width={600} height={720} priority/>
        </div>
      </div>
    </Container>
  );
}
