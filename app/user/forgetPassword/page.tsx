"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import Container from "../_components/container";
import Link from "next/link";
import ReturnLogin from "../_components/returnLogin";
import VerifyButton from "../_components/verifyButton";

export default function ForgetPassword() {
  const router = useRouter();
  const fakeVerification = "123"; // 模擬驗證碼

  const [loginError, setLoginError] = useState(false); // 登入錯誤處理

  const [shakeEmail, setShakeEmail] = useState(false); // Email 欄位錯誤特效
  const [shakeVerification, setShakeVerification] = useState(false); // Password 欄位錯誤特效
  const [isVerification ,setIsVerification] = useState(false)
  const [submit, setSubmit] = useState(false); // 表單送出中的按鈕的效果

  // RHF有錯誤訊息時觸發晃動
  const onError = (errors: any) => {
    if (errors.email) {
      setShakeEmail(true);
      setTimeout(() => setShakeEmail(false), 400); // 0.4秒動畫跑完後，關掉開關
    }
    if (errors.verification) {
      setShakeVerification(true);
      setTimeout(() => setShakeVerification(false), 400); // 0.4秒後關掉
    }
  };

  const handleSendCode = async (): Promise<boolean> => {
    setIsVerification(false);
    const isvaild = await trigger("email");
    if (isvaild) {
      alert(`模擬發送驗證碼：123`)
      setIsVerification(true);
      return true;
    }
    return false;
  };
  // 使用 RHF
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", verification: "" },
  });

  // 表單送出
  const onSubmit = (data: any) => {

    if (submit) return; // 防止快速重複點擊
    setLoginError(false); // 登入中特效
    setSubmit(true);

    // 模擬延遲送出
    setTimeout(async () => {
      if (fakeVerification === data.verification) {
        alert("驗證成功")
        router.replace("/user/resetPassword");
      } else {
        setLoginError(true); // 登入失敗，回復原狀
        setSubmit(false);
      }
    }, 1000);
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-110 h-180 bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-10">忘記密碼</h1>

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
                  {...register("email", { required: "這是必填欄位" })}
                  className={`${errors.email ? "border-red-500" : ""} ${shakeEmail ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                  type="text"
                  placeholder="請輸入電子郵件"
                />
                <VerifyButton onClick={handleSendCode} child={`發送`} />
              </div>
            </div>
            <div className="w-full mb-2.5">
              <p className={`text-green-600 ${isVerification ? '' :'invisible'}`}>已發送驗證碼到您的信箱</p>
            </div>
            <div className="flex flex-col items-start mb-1.25">
              <label className="text-[20px] mb-2.5" htmlFor="verification">
                驗證碼
              </label>
              <input
                {...register("verification", { required: "這是必填欄位" })}
                className={`${errors.verification ? "border-red-500" : ""} ${shakeVerification ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                placeholder="如未收到驗證碼 請60秒後再試"
              />
            </div>
            <div className="w-full mb-2.5">
              <p className={`text-red-600 ${loginError ? '' :'invisible'}`}>驗證碼錯誤</p>
            </div>
            <button
              type="submit"
              disabled={submit}
              className={` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 ${submit ? `bg-gray-400 hover:bg-gray-400` : `bg-[#F02A2D] hover:bg-[#e50004]`}  text-white text-[26px] cursor-pointer  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              {submit ? `登入中...` : `確認送出`}
            </button>
          </form>

          <div>
            <ReturnLogin />
          </div>
        </div>
      </div>
    </Container>
  );
}
