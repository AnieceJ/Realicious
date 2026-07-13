import React from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Left() {
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const pathname = usePathname();

  const getLink = (path: string) => {
    console.log(pathname);
    return `${pathname === path ? "bg-gray-300" : ""}`;
  };

  return (
    <div className="w-95 h-180 bg-[#FCF9F6] border flex flex-col items-center">
      <h2 className="text-[24px] my-4">聊天室</h2>
      <div className="w-full">
        <Link href="/" className={`w-[330px] h-[60px] border-b flex items-center mx-4 mb-4 hover:bg-gray-100 ${getLink(`/user/chatroom`)}`}>
          <div className="w-10 h-10 border mx-4"></div>
          <div>
            <p>XXX</p>
            <p>今天天氣真好</p>
          </div>
        </Link>
        <Link href="/" className={`w-82.5 h-15 border-b flex items-center mx-4 mb-4 hover:bg-gray-100 ${getLink(`/`)}`}>
          <div className="w-10 h-10 border mx-4"></div>
          <div>
            <p>XXX</p>
            <p>今天天氣真好</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
