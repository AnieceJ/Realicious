"use client";

import { FaUser, FaBook, FaShoppingCart } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { GiChicken } from "react-icons/gi";
import { MdOutlineLogout } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import { useState ,useEffect} from "react";
import { useUser } from "@/app/context/user";
import Link from "next/link";

export default function UserSidebar() {
  const [isOpening, setIsOpening] = useState<boolean>(false); // 控制側邊欄開關
  const { user,logout } = useUser();
  // 💡 步驟 1：建立一個標記，記錄「是否已經在瀏覽器掛載」
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 💡 步驟 2：useEffect 只會在瀏覽器（客戶端）執行
  useEffect(() => {
  // 透過 setTimeout 讓它變成非同步執行，
  // 告訴 React：「你先忙完這次渲染，下一刻再幫我更新這個狀態」
  const timer = setTimeout(() => {
    setIsMounted(true);
  }, 0);

  return () => clearTimeout(timer); // 良好的習慣：清除定時器
}, []);

  return (
    <>
      <button
        onClick={() => {
          setIsOpening(!isOpening);
        }}
        className="p-2 text-white hover: cursor-pointer"
      >
        <FontAwesomeIcon icon={faUser} className="text-xl" />
      </button>

      {/* 內容 */}
      <div
        className={`fixed z-50 top-15 right-0 w-90 bg-[#FCF9F6] h-full ${isOpening ? "transform transition-transform duration-300 ease-in-out" : "transform translate-x-full transition-transform duration-300 ease-in-out"} `}
      >
        <div className="flex items-center bg-gray-100 ">
          <div className="w-25 h-25 ml-6 mr-2 my-6 border"></div>
          <div>
            {/* 💡 步驟 3：在畫面上使用 isMounted 來確保前後端同步 */}
            {isMounted ? (
              <>
                <p>你好 {user?.nick_name || "訪客"}</p>
                <p>{user?.account || ""}</p>
              </>
            ) : (
              <>
                {/* 伺服器端渲染時，先顯示骨架或載入中狀態，跟伺服器保持一致 */}
                <p>載入中...</p>
                <p>&nbsp;</p>
              </>
            )}
          </div>
        </div>
        <div>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account`}
          >
            <FaUser />
            <span className="ml-4">個人資料</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/password`}
          >
            <AiFillSafetyCertificate />
            <span className="ml-4">帳號密碼</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/article`}
          >
            <FaBook />
            <span className="ml-4">我的文章</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/cart`}
          >
            <FaShoppingCart />
            <span className="ml-4">購買記錄</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/pet`}
          >
            <GiChicken />
            <span className="ml-4">我的小雞</span>
          </Link>
          <button
            onClick={() => {
              setIsOpening(!isOpening);
              logout();
            }}
            className="w-full h-12.5 text-red-600 border-gray-700 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
          >
            <MdOutlineLogout />
            <span className="ml-4">登出</span>
          </button>
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
