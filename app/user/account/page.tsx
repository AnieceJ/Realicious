"use client";
import Container from "../_components/container";
import Left from "./_components/left";
import './account.css'

export default function Account() {
  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-180 p-4 overflow-y-auto no-scrollbar">
        <form action="">
          <div className="flex flex-col items-start mb-5">
            <label className="text-[20px] mb-2.5" htmlFor="email">
              姓氏
            </label>
            <input
              className="border w-90 h-10 text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex flex-col items-start mb-5">
            <label className="text-[20px] mb-2.5" htmlFor="email">
              姓名
            </label>
            <input
              className="border w-90 h-10 text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex flex-col items-start mb-5">
            <label className="text-[20px] mb-2.5" htmlFor="email">
              暱稱（會公開顯示）
            </label>
            <input
              className="border w-90 h-10 text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex flex-col items-start mb-5">
            <label className="text-[20px] mb-2.5" htmlFor="email">
              生日
            </label>
            <input
              className="border w-90 h-10 text-[16px] px-2"
              type="date"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex flex-col items-start mb-5">
            <label className="text-[20px] mb-2.5" htmlFor="email">
              電話
            </label>
            <input
              className="border w-90 h-10 text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          <div className="flex">
            <div className="flex flex-col items-start mb-5 mr-8">
              <label className="text-[20px] mb-2.5" htmlFor="email">
                縣市
              </label>
              <input
                className="border w-[150px] h-10 text-[16px] px-2"
                type="text"
                id=""
                placeholder=""
              />
            </div>
            <div className="flex flex-col items-start mb-5">
              <label className="text-[20px] mb-2.5" htmlFor="email">
                鄉鎮
              </label>
              <input
                className="border w-40px h-10 text-[16px] px-2"
                type="text"
                id=""
                placeholder=""
              />
            </div>
          </div>
          <div className="flex flex-col items-start mb-5">
            <label className="text-[20px] mb-2.5" htmlFor="email">
              詳細地址
            </label>
            <input
              className="border w-90 h-10 text-[16px] px-2"
              type="text"
              id=""
              placeholder=""
            />
          </div>
          
          <div className="flex w-full justify-start mt-8">
            <button className="border w-25 h-10 mr-8">修改</button>
            <button className="border w-25 h-10">送出</button>
          </div>
        </form>
      </div>
    </Container>
  );
}
