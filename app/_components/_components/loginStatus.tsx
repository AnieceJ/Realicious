"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import UserSidebar from "./userSidebar";
import Chatroom from "./chatroom";
import { useUser } from "@/app/context/user";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Link from 'next/link'

export default function LoginStatus() {
  const token = Cookies.get("token");
  return (
    <>
      {token ? (
        <div className="flex gap-x-2 items-center justify-end">
          <UserSidebar />
          <Chatroom />
        </div>
      ) : (
        <div className="flex gap-x-2 items-center justify-end">
          <Link href='/user/login' className="p-2">
            <FontAwesomeIcon icon={faUser} className="text-xl" />
            登入
          </Link>
        </div>
      )}
    </>
  );
}
