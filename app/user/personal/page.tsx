"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/app/context/user";
import { useRouter } from "next/navigation"; // 引入 useRouter 用於跳轉頁面
import Cookies from "js-cookie";

import Container from "../_components/container";
import AvatarUploader from "../account/_components/avatarUploader";

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

export default function OnboardingForm() {
  const { user, setUser } = useUser();
  const router = useRouter();
  
  // 🌟 控制目前步驟：1 代表第一頁（歡迎/基本資料），2 代表第二頁（聯絡與其他資料）
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FullProfile>(defaultValues);
  const [loading, setLoading] = useState(true);

  // 進入頁面時，先撈取目前的資料（可能已經有信箱等基本預設值）
  useEffect(() => {
    router.refresh();
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
          setFormData(result.data);
        }
      } catch (error) {
        console.error("抓取詳細資料失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFullProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🌟 統一處理後端 API 送出的邏輯
  const saveProfileData = async () => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${API_URL}/profile/full`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await res.json();
      return { success: res.ok && result.success, message: result.message ,user: result.user};
    } catch (error) {
      console.error("發送更新 API 失敗:", error);
      return { success: false, message: "系統發生錯誤" };
    }
  };

  // 第一步送出：儲存並進到第二步
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveProfileData();
    if (result.success) {
      // 🌟 修正點：保留舊有 user 資訊（如 id, email），並融入後端回傳的新資料
      setUser((prev) => {
        const updatedUser = { ...prev, ...result.user };
        // 🌟 順便同步把新狀態寫進本地 Cookie，防止重新整理或換頁時掉狀態
        Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
        return updatedUser;
      });
      
      setStep(2); // 進到第二頁
    } else {
      alert(result.message || "儲存失敗");
    }
  };

  // 第二步送出：儲存並回到首頁
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveProfileData();
    if (result.success) {
      // 🌟 修正點：同上，保留舊有資訊並融入新資料、同步 Cookie
      setUser((prev) => {
        const updatedUser = { ...prev, ...result.user };
        Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
        return updatedUser;
      });

      alert("恭喜完成會員設定！");
      // router.push("/"); 
      window.location.href = "/";
    } else {
      alert(result.message || "儲存失敗");
    }
  };


  if (loading) return <div className="p-6 text-center">正在準備您的專屬迎新頁面...</div>;

  return (
    // 移除 Left 組件，改用乾淨的置中卡片設計，專注於引導填寫
    <Container className="bg-white justify-center items-center py-10">
      <div className="w-full max-w-lg p-6 border border-gray-100 rounded-xl shadow-md">
        
        {/* 🌟 步驟進度條提示 */}
        <div className="flex justify-between items-center mb-6 text-xs text-gray-400">
          <span className={`${step === 1 ? "text-blue-600 font-bold" : ""}`}>1. 基本頭像</span>
          <div className="flex-1 h-[2px] bg-gray-200 mx-4">
            <div className={`h-full bg-blue-600 transition-all duration-300 ${step === 2 ? "w-full" : "w-0"}`}></div>
          </div>
          <span className={`${step === 2 ? "text-blue-600 font-bold" : ""}`}>2. 聯絡資訊</span>
        </div>

        {/* ==================== 第一頁：歡迎與基本檔案 ==================== */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">歡迎加入！✨</h2>
              <p className="text-sm text-gray-500 mt-1">讓我們簡單認識一下你，設定個漂亮的檔案吧！</p>
            </div>

            {/* 大頭貼 */}
            <div className="flex justify-center mb-6">
              <AvatarUploader
                currentAvatar={formData.avatar}
                onUploadSuccess={(newUrl) => {
                  setFormData((prev) => ({ ...prev, avatar: newUrl }));
                  setUser(prev => ({ ...prev, avatar: newUrl }));
                  const updatedUser = { ...user, avatar: newUrl };
                  Cookies.set("user", JSON.stringify(updatedUser), { expires: 1 });
                }}
              />
            </div>

            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓氏</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="例如：陳"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="例如：小明"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">暱稱</label>
                <input
                  type="text"
                  name="nick_name"
                  value={formData.nick_name}
                  onChange={handleInputChange}
                  placeholder="想被怎麼稱呼呢？"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* 按鈕區 */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={() => handleSkip("step2")}
                  className="text-sm text-gray-400 hover:text-gray-600 transition"
                >
                  跳過，填下一步
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  下一步
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ==================== 第二頁：詳細聯絡資訊 ==================== */}
        {step === 2 && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">完善聯絡資料</h2>
              <p className="text-sm text-gray-500 mt-1">填寫完成後即可享受網站的所有完整功能。</p>
            </div>

            <form onSubmit={handleStep2Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">縣市</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="台北市"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">鄉鎮</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    placeholder="信義區"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">詳細地址</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="信義路五段 X 號"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">電話</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                  placeholder="0912345678"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">生日</label>
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white"
                />
              </div>

              {/* 按鈕區 */}
              <div className="flex justify-between items-center pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)} // 允許走回上一步，體驗更好
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  返回上一步
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleSkip("home")}
                    className="text-sm text-gray-400 hover:text-gray-600 transition"
                  >
                    跳過，進入首頁
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition shadow-sm"
                  >
                    開啟體驗
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>
    </Container>
  );
}