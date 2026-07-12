"use client";

import { FaUser, FaBook, FaShoppingCart } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { GiChicken } from "react-icons/gi";
import { MdOutlineLogout } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import { useState } from "react";
import { useUser } from "@/app/context/user";
import Link from "next/link";

export default function UserSidebar() {
  const [isOpening, setIsOpening] = useState<boolean>(false); // 控制側邊欄開關
  const { user,logout } = useUser();

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
            <p>你好 {user?.nick_name}</p>
            <p>{user?.account}</p>
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
