"use client";
import Container from "../../_components/container";
import Link from "next/link";
import Left from "../_components/left";

export default function Account() {
  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-[720px] p-4 overflow-y-auto">
        <form action="">
          <div className="flex flex-col items-start mb-[20px]">
            <label className="text-[20px] mb-[10px]" htmlFor="email">
              電子郵件
            </label>
            <input
              className="border w-[350px] h-[40px] text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex flex-col items-start mb-[20px]">
            <label className="text-[20px] mb-[10px]" htmlFor="email">
              密碼
            </label>
            <input
              className="border w-[350px] h-[40px] text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex flex-col items-start mb-[20px]">
            <label className="text-[20px] mb-[10px]" htmlFor="email">
              確認密碼
            </label>
            <input
              className="border w-[350px] h-[40px] text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex w-full justify-end mt-8">
            <button className="border w-[100px] h-[40px] mr-8">修改</button>
            <button className="border w-[100px] h-[40px]">送出</button>
          </div>
        </form>
      </div>
    </Container>
  );
}
