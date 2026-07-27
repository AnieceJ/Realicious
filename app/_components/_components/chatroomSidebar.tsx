"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { FaXmark } from "react-icons/fa6";

// 💡 建立一個檢查 Client 端的 Hook
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // Client 端回傳 true
    () => false  // Server 端 (SSR) 回傳 false
  );
}

export default function Chatroom() {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const isMounted = useIsClient(); // 💡 乾淨取代 useEffect + useState

  return (
    <>
      {/* 觸發按鈕：留在原本 Header 的位置 */}
      <button
        onClick={() => setIsOpening(!isOpening)}
        className="p-2 text-white hover:cursor-pointer"
      >
        <FontAwesomeIcon icon={faMessage} className="text-xl" />
      </button>

      {/* 💡 傳送門：當客戶端掛載完成後才渲染 Portal */}
      {isMounted &&
        createPortal(
          <>
            {/* 內容 */}
            <div
              className={`fixed z-50 top-0 right-0 w-90 bg-[#FCF9F6] h-full shadow-2xl ${
                isOpening ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 ease-in-out`}
            >
              <div className="pt-15 relative h-full flex flex-col">
                {/*「X」關閉按鈕 */}
                <button
                  onClick={() => setIsOpening(false)}
                  className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black hover:bg-gray-200/50 rounded-full cursor-pointer transition-colors"
                  aria-label="Close chatroom"
                >
                  <FaXmark className="text-2xl" />
                </button>

                <h2 className="text-[24px] m-4 font-bold text-black">聊天室</h2>
                <Link href={"/user/chatroom"} className="w-40 y-30 border bg-amber-300">測試用</Link>

                <div className="overflow-y-auto grow px-4">
                  <Link
                    href="/"
                    className="w-full h-15 border-b flex items-center mb-4 hover:bg-gray-100 rounded-lg text-black"
                  >
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

            {/* 遮罩 */}
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