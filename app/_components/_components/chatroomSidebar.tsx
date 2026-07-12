"use client";

import { useState } from "react";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

export default function Chatroom() {
  const [isOpening, setIsOpening] = useState<boolean>(false);

  return (
    <>
    <button onClick={() => {
          setIsOpening(!isOpening);
        }} className="p-2 text-white hover: cursor-pointer">
								<FontAwesomeIcon icon={faMessage} className="text-xl" />
							</button>

      {/* 內容 */}
      <div
        className={`fixed z-50 top-15 right-0 w-90 bg-[#FCF9F6] h-full ${isOpening ? "transform transition-transform duration-300 ease-in-out" : "transform translate-x-full transition-transform duration-300 ease-in-out"} `}
      >
        <h2 className="text-[24px] m-4">聊天室</h2>
        <Link href="/" className="w-82.5 h-15 border-b flex items-center mx-4 mb-4 hover:bg-gray-100">
          <div className="w-10 h-10 border mx-4"></div>
          <div>
            <p>XXX</p>
            <p>今天天氣真好</p>
          </div>
        </Link>
        <div className="w-82.5 h-15 border-b flex items-center mx-4 mb-4 hover:bg-gray-100">
          <div className="w-10 h-10 border mx-4"></div>
          <div>
            <p>XXX</p>
            <p>今天天氣真好</p>
          </div>
        </div>
      </div>

      {/* 遮罩 */}
      <div
        onClick={() => {
          setIsOpening(!isOpening);
        }}
        className={`fixed inset-0 bg-black/20 z-30 ${isOpening ? "" : "hidden"}`}
      ></div>
    </>
  );
}
