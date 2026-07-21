"use client";

import { useState, useEffect } from "react"; // 💡 引入 useEffect 來處理掛載
import { createPortal } from "react-dom"; // 💡 引入 createPortal 傳送門
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

export default function Chatroom() {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false); // 💡 用來確保前後端掛載同步

  // 💡 只在客戶端（瀏覽器）掛載後才啟用 Portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      {/* 觸發按鈕：留在原本 Header 的位置 */}
      <button 
        onClick={() => setIsOpening(!isOpening)} 
        className="p-2 text-white hover:cursor-pointer"
      >
        <FontAwesomeIcon icon={faMessage} className="text-xl" />
      </button>

      {/* 💡 傳送門：當元件掛載完成後，把側邊欄與遮罩塞到 body 節點下 */}
      {isMounted && createPortal(
        <>
          {/* 內容 */}
          <div
            className={`fixed z-50 top-0 right-0 w-90 bg-[#FCF9F6] h-full shadow-2xl ${
              isOpening ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out`}
          >
            {/* 💡 加上 relative 與 pt-15，方便安插 X 按鈕並避開頂部 */}
            <div className="pt-15 relative h-full flex flex-col">
              
              {/* ❌ 「X」關閉按鈕 */}
              <button
                onClick={() => setIsOpening(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black hover:bg-gray-200/50 rounded-full cursor-pointer transition-colors"
                aria-label="Close chatroom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-[24px] m-4 font-bold text-black">聊天室</h2>
              
              <div className="overflow-y-auto grow px-4">
                <Link href="/" className="w-full h-15 border-b flex items-center mb-4 hover:bg-gray-100 rounded-lg text-black">
                  <div className="w-10 h-10 border mx-4 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">XXX</p>
                    <p className="text-sm text-gray-500">今天天氣真好</p>
                  </div>
                </Link>
                
                <div className="w-full h-15 border-b flex items-center mb-4 hover:bg-gray-100 rounded-lg text-black cursor-pointer">
                  <div className="w-10 h-10 border mx-4 bg-gray-200 rounded-full"></div>
                  <div>
                    <p className="font-semibold">XXX</p>
                    <p className="text-sm text-gray-500">今天天氣真好</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 遮罩：調高到 z-40，確保緊貼在側邊欄下方，並遮住 main */}
          <div
            onClick={() => setIsOpening(false)}
            className={`fixed inset-0 bg-black/40 z-40 ${isOpening ? "" : "hidden"}`}
          ></div>
        </>,
        document.body
      )}
    </>
  );
}