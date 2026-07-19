"use client";

import Cookies from "js-cookie";

import UserSidebar from "./userSidebar";
import ChatroomSidebar from "./chatroomSidebar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

interface HeaderLoginBtnProps {
	token: boolean;
	className?: string;
}

export default function HeaderLoginBtn({
	className,
	token,
}: HeaderLoginBtnProps) {
	// 用有沒有token來判斷是否登入，接後端後是需求或安全性可能需要更改判斷條件
	// const token = (Cookies.get("token") ? true :false)

	return (
		<div className={`text-black ${className}`}>
			{token ? (
				<div className="flex gap-x-2 items-center justify-end">
					<UserSidebar />
					<ChatroomSidebar />
				</div>
			) : (
				<div className="flex gap-x-2 items-center justify-end text-white font-medium ">
					<Link
						href={"/user/login"}
						className="flex justify-center items-center hover:cursor-pointer hover:underline decoration-white underline-offset-5"
					>
						<FontAwesomeIcon icon={faUser} className="text-xl mr-2" />
						<span>登入</span>
					</Link>
				</div>
			)}
		</div>
	);
}
