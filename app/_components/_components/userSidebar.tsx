"use client";

import {  FaUser, FaBook, FaShoppingCart } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { GiChicken } from "react-icons/gi";
import { MdOutlineLogout } from "react-icons/md";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";

import { useState } from "react";
import Link from "next/link";

export default function UserSidebar() {
  const [isOpening, setIsOpening] = useState<boolean>(false);

  return (
    <>
      <button  onClick={() => {
          setIsOpening(!isOpening);
        }} className="p-2">
        <FontAwesomeIcon icon={faUser} className="text-xl" />
      </button>

      <div
        className={`fixed z-50 top-[94px] right-0 w-[360px] bg-[#FCF9F6] h-full border ${isOpening ? "transform transition-transform duration-300 ease-in-out" : "transform translate-x-full transition-transform duration-300 ease-in-out"} `}
      >
        <div className="flex items-center bg-gray-100 ">
          <div className="w-[100px] h-[100px] ml-6 mr-2 my-6 border"></div>
          <div>
            <p>你好 ＸＸＸ</p>
            <p>123123121@gmail.com</p>
          </div>
        </div>
        <div>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-[50px] text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account`}
          >
            <FaUser />
            <span className="ml-4">個人資料</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-[50px] text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/password`}
          >
            <AiFillSafetyCertificate />
            <span className="ml-4">帳號密碼</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-[50px] text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/article`}
          >
            <FaBook />
            <span className="ml-4">我的文章</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-[50px] text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/cart`}
          >
            <FaShoppingCart />
            <span className="ml-4">購買記錄</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-[50px] text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/account/pet`}
          >
            <GiChicken />
            <span className="ml-4">我的小雞</span>
          </Link>
          <Link
            onClick={() => {
              setIsOpening(!isOpening);
            }}
            className="w-full h-[50px] text-red-600 border-b-1 border-gray-700 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center"
            href={`/user/login`}
          >
            <MdOutlineLogout />
            <span className="ml-4">登出</span>
          </Link>
        </div>
      </div>

      <div
        onClick={() => {
          setIsOpening(!isOpening);
        }}
        className={`fixed inset-0 bg-black/20 z-30 ${isOpening ? "" : "hidden"}`}
      ></div>
    </>
  );
}
