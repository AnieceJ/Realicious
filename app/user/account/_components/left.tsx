import React from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { FaUser, FaBook, FaShoppingCart } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { GiChicken } from "react-icons/gi";

export default function Left() {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const pathname = usePathname();

  const getLink = (path: string) => {
    console.log(pathname);
    return `${pathname === path ? "bg-[#FBDF58]" : ""}`;
  };

  return (
    <div className="w-95 h-180 bg-[#FCF9F6] border flex flex-col items-center">
      <h2 className="text-[24px] my-4">個人中心</h2>
      <div className="w-full">
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center ${getLink(`/user/account`)}`}
          href={`/user/account`}
        >
          <FaUser />
          <span className="ml-4">個人資料</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center ${getLink(`/user/account/password`)}`}
          href={`/user/account/password`}
        >
          <AiFillSafetyCertificate />
          <span className="ml-4">帳號密碼</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center ${getLink(`/user/account/article`)}`}
          href={`/user/account/article`}
        >
          <FaBook />
          <span className="ml-4">我的文章</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center ${getLink(`/user/account/cart`)}`}
          href={`/user/account/cart`}
        >
          <FaShoppingCart />
          <span className="ml-4">購買記錄</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer hover:bg-[#FBDF58] flex items-center ${getLink(`/user/account/pet`)}`}
          href={`/user/account/pet`}
        >
          <GiChicken />
          <span className="ml-4">我的小雞</span>
        </Link>
      </div>
    </div>
  );
}
