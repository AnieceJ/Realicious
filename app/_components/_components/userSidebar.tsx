"use client";

import { FaUser, FaBook, FaShoppingCart } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { GiChicken } from "react-icons/gi";
import { MdOutlineLogout } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import defaultAvatar from "@/public/user/Avatar.svg";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useUser } from "@/app/context/user";
import Link from "next/link";
import Image from "next/image";
import { useAlert } from "@/app/user/context/alert";


export default function UserSidebar() {
  const { showAlert, closeAlert } = useAlert();

  const [isOpening, setIsOpening] = useState<boolean>(false);
  const { user, logout } = useUser();
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const headerAvatar = user?.avatar ? `${user.avatar}` : defaultAvatar;

  useEffect(() => {
    setIsMounted(true); // 💡 這裡直接設 true 即可，確保客戶端已掛載
  }, []);

  return (
    <>
      {/* 觸發按鈕：留在 Header 內保持原本位置 */}
      <button
        onClick={() => setIsOpening(!isOpening)}
        className="p-2 text-white hover:cursor-pointer"
      >
        <FontAwesomeIcon icon={faUser} className="text-xl" />
      </button>

      {/* 💡 步驟 2：使用 createPortal 將側邊欄和遮罩「傳送」到 body */}
      {isMounted &&
        createPortal(
          <>
            {/* 側邊欄內容：既然已經移到最外層，建議 top 改成 0，讓它真正填滿右側 */}
            <div
              className={`fixed z-50 top-0 right-0 w-90 bg-[#FCF9F6] h-full shadow-2xl ${
                isOpening ? "translate-x-0" : "translate-x-full"
              } transition-transform duration-300 ease-in-out`}
            >
              <div className="">
                <div className="flex items-center bg-gray-100">
                  {/* ❌ 這裡就是新加入的「X」關閉按鈕 */}
                  <button
                    onClick={() => setIsOpening(false)}
                    className="absolute top-4 right-4 p-2 text-gray-500 hover:text-black hover:bg-gray-200/50 rounded-full cursor-pointer transition-colors"
                    aria-label="Close sidebar"
                  >
                    {/* 這裡你可以換成專案裡既有的圖示，例如 FontAwesomeIcon 或 react-icons */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="w-25 h-25 ml-6 mr-2 my-6 rounded-full">
                    <Image
                      src={headerAvatar}
                      alt="avatar"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p>你好 {user?.nick_name || "訪客"}</p>
                    <p>{user?.account || ""}</p>
                  </div>
                </div>

                <div className="bg-[#FCF9F6]">
                  <Link
                    onClick={() => setIsOpening(false)}
                    className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
                    href={`/user/account`}
                  >
                    <FaUser />
                    <span className="ml-4">個人資料</span>
                  </Link>
                  <Link
                    onClick={() => setIsOpening(false)}
                    className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
                    href={`/user/account/password`}
                  >
                    <AiFillSafetyCertificate />
                    <span className="ml-4">帳號密碼</span>
                  </Link>
                  <Link
                    onClick={() => setIsOpening(false)}
                    className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
                    href={`/user/account/article`}
                  >
                    <FaBook />
                    <span className="ml-4">我的文章</span>
                  </Link>
                  <Link
                    onClick={() => setIsOpening(false)}
                    className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
                    href={`/user/account/cart`}
                  >
                    <FaShoppingCart />
                    <span className="ml-4">購買記錄</span>
                  </Link>
                  <Link
                    onClick={() => setIsOpening(false)}
                    className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
                    href={`/user/account/pet`}
                  >
                    <GiChicken />
                    <span className="ml-4">我的小雞</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpening(false);
                      showAlert("confirm","確定要登出嗎？",'',()=>{logout()})
                    }}
                    className="w-full h-12.5 text-red-600 border-gray-700 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
                  >
                    <MdOutlineLogout />
                    <span className="ml-4">登出</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 遮罩：這時候的 fixed inset-0 就能真正完美覆蓋全螢幕了！ */}
            <div
              onClick={() => setIsOpening(false)}
              className={`fixed inset-0 bg-black/40 z-40 ${isOpening ? "" : "hidden"}`}
            ></div>
          </>,
          document.body, // 💡 傳送到 body 節點下
        )}
    </>
  );
}
