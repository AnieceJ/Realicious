"use client";
import Container from "../../_components/container";
import Left from "../_components/left";
import { useState, ChangeEvent, FormEvent, MouseEvent } from "react";
import {button_revise} from '../../_components/button'

// 1. 定義會員資料的型別介面
interface UserProfile {
  email: string;
  password?: string;        // 選填，因為初始可能為空
  confirmPassword?: string; // 選填
}

export default function Account() {
  // 模擬頁面載入取得的會員假資料
  const initialData: UserProfile = {
    email: "user@example.com",
    password: "",
    confirmPassword: ""
  };

  // 2. 狀態管理（透過泛型指定型別）
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [profile, setProfile] = useState<UserProfile>(initialData);
  // 備份可以是完整的資料，或是空物件 {}，所以這裡允許 Partial 局部轉型
  const [backupProfile, setBackupProfile] = useState<Partial<UserProfile>>({});

  // 3. 處理輸入框改變：明確指定為 HTMLInputElement 的 ChangeEvent
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id]: value, // TypeScript 會根據 id 動態對應 profile 的 key
    }));
  };

  // 4. 點擊「修改」或「取消」：指定為 HTMLButtonElement 的 MouseEvent
  const handleEditToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!isEdit) {
      // 備份當前資料
      setBackupProfile({ ...profile });
    } else {
      // 還原成備份資料（如果備份是空的則用 initialData 頂替）
      setProfile({
        email: backupProfile.email ?? initialData.email,
        password: backupProfile.password ?? "",
        confirmPassword: backupProfile.confirmPassword ?? ""
      });
    }

    setIsEdit(!isEdit);
  };

  // 5. 點擊「送出」：表單送出事件指定為 FormEvent
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (profile.password !== profile.confirmPassword) {
      alert("密碼與確認密碼不一致！");
      return;
    }

    console.log("成功送出最新資料：", profile);
    setIsEdit(false);
  };

  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left />
      <div className="w-[70%] h-[720px] p-4 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          
          {/* 電子郵件 */}
          <div className="flex flex-col items-start mb-[20px]">
            <label className="text-[20px] mb-[10px]" htmlFor="email">
              電子郵件
            </label>
            <input
              id="email"
              type="text"
              disabled={!isEdit}
              value={profile.email}
              onChange={handleChange}
              className="border w-[350px] h-[40px] text-[16px] px-2 disabled:bg-gray-100"
            />
          </div>

          {/* 密碼 */}
          <div className="flex flex-col items-start mb-[20px]">
            <label className="text-[20px] mb-[10px]" htmlFor="password">
              密碼
            </label>
            <input
              id="password"
              type="password"
              disabled={!isEdit}
              value={profile.password}
              onChange={handleChange}
              className="border w-[350px] h-[40px] text-[16px] px-2 disabled:bg-gray-100"
            />
          </div>

          {/* 確認密碼 */}
          <div className="flex flex-col items-start mb-[20px]">
            <label className="text-[20px] mb-[10px]" htmlFor="confirmPassword">
              確認密碼
            </label>
            <input
              id="confirmPassword"
              type="password"
              disabled={!isEdit}
              value={profile.confirmPassword}
              onChange={handleChange}
              className="border w-[350px] h-[40px] text-[16px] px-2 disabled:bg-gray-100"
            />
          </div>

          {/* 按鈕區 */}
          <div className="flex w-full justify-start mt-8">
            <button
              type="button"
              onClick={handleEditToggle}
                className={`${button_revise}`}
            >
              {isEdit ? "取消" : "修改"}
            </button>

            <button
              type="submit"
              disabled={!isEdit}
              className={`w-[100px] h-[40px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mr-8 ${
                isEdit
                  ? "bg-[#F02A2D] hover:bg-[#e50004] cursor-pointer hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-gray-400 cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              送出
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}