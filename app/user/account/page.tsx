"use client";

import "./account.css";
import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import Cookies from "js-cookie";

import Container from "../_components/container";
import Left from "./_components/left";
import AvatarUploader from "./_components/avatarUploader";
import {button_revise,button_cancel, button_submit} from '../_components/button'
import { useAlert } from "../context/alert";
import { useRouter } from "next/navigation";

interface FullProfile {
  avatar: string;
  first_name: string;
  last_name: string;
  nick_name: string;
  city: string;
  district: string;
  address: string;
  phone: string | undefined;
  birthday: string;
}

const defaultValues: FullProfile = {
  avatar: "",
  first_name: "",
  last_name: "",
  nick_name: "",
  city: "",
  district: "",
  address: "",
  phone: undefined,
  birthday: "",
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";

export default function ProfileForm() {
  const { user, setUser } = useUser();
  const { showAlert, closeAlert } = useAlert();
  const router = useRouter()
  // 控制是否為編輯模式
  const [isEditing, setIsEditing] = useState(false);
  // 畫面上正在輸入的資料
  const [formData, setFormData] = useState<FullProfile>(defaultValues);
  // 備份後端抓回來的原始資料，取消時使用
  const [originalData, setOriginalData] = useState<FullProfile>(defaultValues);
  // 載入狀態
  const [loading, setLoading] = useState(true);

  // 進入頁面時，Fetch 會員資料
  useEffect(() => {
    const fetchFullProfile = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`${API_URL}/profile/full`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (res.ok && result.success) {
          // 同步寫入兩組狀態
          setFormData(result.data);
          setOriginalData(result.data);
        }
      } catch (error) {
        showAlert("error",'伺服器異常')
        console.error("抓取詳細資料失敗:", error);
        setTimeout(()=>{
          router.push('/')
        },2000)
      } finally {
        setLoading(false);
      }
    };

    fetchFullProfile();
  }, []);

  // 3. 處理 Input 改變的共用函式
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. 取消鍵：抓回原本的資料，並關閉編輯模式
  const handleCancel = () => {
    setFormData(originalData); // 還原成備份的原始資料
    setIsEditing(false); // 關閉編輯模式
  };

  // 5. 送出鍵：發送一個新的更新 API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");

    try {
      const res = await fetch(`${API_URL}/profile/full`, {
        method: "PUT", // 或是 POST，看你後端定義
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showAlert("success", "資料更新成功！");
        // 更新成功後，把當前資料變成「新的原始資料」
        setOriginalData(formData);
        setIsEditing(false);
        setTimeout(()=>{
          closeAlert()
        },2000)
      } else {
      showAlert("error", "更新失敗！",result.message);
      }
    } catch (error) {
      console.error("發送更新 API 失敗:", error);
      showAlert("error", "系統發生錯誤，請稍後再試");
    }
  };

  if (loading) return <div className="p-6">詳細資料載入中...</div>;

  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left></Left>
      <div className="w-[70%] h-180 p-4 overflow-y-auto no-scrollbar">
        {/* 放入大頭貼組件 */}
        <AvatarUploader
          currentAvatar={formData.avatar}
          onUploadSuccess={(newUrl) => {
            // 當大頭貼上傳成功，同步把新網址寫進整張表單的狀態裡
            setFormData((prev) => ({ ...prev, avatar: newUrl }));
            setOriginalData((prev) => ({ ...prev, avatar: newUrl }));
            // 2. 🌟 關鍵：同步更新全域 Context！這樣一來，Header 就會立刻收到通知並換圖
          setUser(prev => ({ ...prev, avatar: newUrl }));
          
          // 3. 順便把新的 user 狀態更新進本地 Cookie，保證下次重新整理也是對的
          const updatedUser = { ...user, avatar: newUrl };
          Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
          }}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 姓氏欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              姓氏
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 姓名欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              姓名
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 暱稱欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              暱稱
            </label>
            <input
              type="text"
              name="nick_name"
              value={formData.nick_name}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 縣市欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              縣市
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 鄉鎮欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              鄉鎮
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 詳細地址欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              詳細地址
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 電話欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              電話
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 生日欄位 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              生日
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 disabled:bg-gray-100"
            />
          </div>

          {/* 下方的按鈕切換邏輯 */}
          <div className="flex justify-start space-x-2 pt-4">
            {!isEditing ? (
              // 模式 A：唯讀狀態，只顯示「修改」按鈕
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={`${button_revise}`}
              >
                修改資料
              </button>
            ) : (
              // 模式 B：編輯狀態，顯示「送出」與「取消」
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                className={`${button_cancel} mr-8 `}

                >
                  取消
                </button>
                <button
                  type="submit"
                className={`${button_submit}`}

                >
                  送出變更
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </Container>
  );
}
