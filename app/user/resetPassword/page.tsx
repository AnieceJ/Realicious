'use client'

import Container from "../_components/container";
import { useForm } from "react-hook-form";
import { useState } from "react";
import {useRouter} from 'next/navigation'

export default function ForgetPassword() {
  
  const router = useRouter()
  const [error, setError] = useState(false);

  // 1. 為每個 Input 準備一個「晃動開關」狀態

  const [shakePassword, setShakePassword] = useState(false);
  const [shakeCheck, setShakeCheck] = useState(false);
  const [submit, setSubmit] = useState(false);

  const onError = (errors: any) => {
    // 如果 密碼 有錯誤，觸發晃動
    if (errors.password) {
      setShakePassword(true);
      setTimeout(() => setShakePassword(false), 400); // 0.4秒後關掉
    }
    // 如果 Email 有錯誤，觸發晃動
    if (errors.check) {
      setShakeCheck(true);
      setTimeout(() => setShakeCheck(false), 400); // 0.4秒動畫跑完後，關掉開關
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", check: "" },
  });

  const onSubmit = (data: any) => {
    setError(false);
    setSubmit(true);

    setTimeout(() => {
    if(data.password === data.check) {
        alert(`修改成功`);
      router.replace('/user/login')
      } else {
        setError(true);
        setSubmit(false);
      }
    }, 1000);
  };

  return (
    <Container>
      <div className="flex justify-center items-center sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="w-108 h-180 bg-white border flex flex-col items-center">
          <h1 className="text-[24px] my-10">重置密碼</h1>
          <form onSubmit={handleSubmit(onSubmit, onError)} className="flex flex-col items-center mb-5">
            <div className="flex flex-col items-start mb-5">
              <label className="text-[20px] mb-2]" htmlFor="password">
                密碼
              </label>
              <input
                {...register("password", { required: "這是必填欄位" })}
                className={`${errors.password ? "border-red-500" : ""} ${shakePassword ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="password"
                placeholder="請輸入密碼"
              />
            </div>
            <div className="flex flex-col items-start mb-1">
              <label className="text-[20px] mb-2" htmlFor="password">
                密碼確認
              </label>
              <input
              {...register("check", { required: "這是必填欄位" })}
                className={`${errors.check ? "border-red-500" : ""} ${shakeCheck ? "animate-shake" : ""} border w-90 h-12 text-[16px] px-2 `}
                type="text"
                id="check"
                placeholder="請再次輸入密碼"
              />
            </div>
            <div className="flex justify-between w-90 mb-5">
              <p 
                className={`${error ? "animate-shake" : "invisible"} text-red-500`}
              >密碼不相同</p>
            </div>
            <button
              type="submit"
              disabled={submit}
              className={` border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-55 h-15 ${submit?`bg-gray-400 hover:bg-gray-400`:`bg-[#F02A2D] hover:bg-[#e50004]`}  text-white text-[26px] cursor-pointer  hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
            >
              {submit?`loading`:`確認送出`}
            </button>
          </form>
        </div>
      </div>
    </Container>
  );
}
