import React from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { FaUser, FaBook, FaClipboardList, FaTicketAlt, FaHeart } from "react-icons/fa";
import { AiFillSafetyCertificate } from "react-icons/ai";

export default function Left() {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const pathname = usePathname();

  const getLink = (path: string) => {
    return `${pathname === path ? "bg-[#FBDF58] hover:bg-[#FBDF58]" : "hover:bg-[#faea99]"}`;
  };

  return (
    <div className="w-95 h-170 bg-[#FCF9F6] border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
      <h2 className="text-[24px] my-4">會員中心</h2>
      <div className="w-full">
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 flex items-center ${getLink(`/user/account`)}`}
          href={`/user/account`}
        >
          <FaUser />
          <span className="ml-4">個人資料</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 flex items-center ${getLink(`/user/account/password`)}`}
          href={`/user/account/password`}
        >
          <AiFillSafetyCertificate />
          <span className="ml-4">帳戶安全</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 flex items-center ${getLink(`/user/account/article`)}`}
          href={`/user/account/article`}
        >
          <FaBook />
          <span className="ml-4">我的文章</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer flex items-center ${getLink(`/user/account/orders`)}`}
          href={`/user/account/orders`}
        >
          <FaClipboardList />
          <span className="ml-4">訂單紀錄</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer flex items-center ${getLink(`/user/account/tickets`)}`}
          href={`/user/account/tickets`}
        >
          <FaTicketAlt />
          <span className="ml-4">我的票券</span>
        </Link>
        <Link
          onClick={() => {
            setIsOpening(!isOpening);
          }}
          className={` w-full h-12.5 text-left pl-8 cursor-pointer flex items-center ${getLink(`/user/account/favorites`)}`}
          href={`/user/account/favorites`}
        >
          <FaHeart />
          <span className="ml-4">我的收藏</span>
        </Link>
      </div>
    </div>
  );
}
