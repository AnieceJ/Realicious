"use client";
import Container from "../../_components/container";
import Left from "../_components/left";
import {
  button_revise,
  button_cancel,
  button_submit,
} from "../../_components/button";

import { useState, useEffect } from "react";
import { useAlert } from "../../context/alert";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

interface AccountInfo {
  email: string;
  isGoogleLinked: boolean;
  hasPassword: boolean; // 新增：用來判斷是「修改密碼」還是「設定密碼」
}

export default function Password() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";
  const { showAlert, closeAlert } = useAlert();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    email: "",
    isGoogleLinked: false,
    hasPassword: true,
  });
  const [loading, setLoading] = useState(true);

  // 控制修改密碼彈窗
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. 處理 Google 授權重導向回來的網址參數 (?success=... 或 ?error=...)
  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "google_linked") {
      showAlert("success", "已成功綁定 Google 帳號！");
      router.replace(window.location.pathname); // 清除網址上的 query 參數
    } else if (error) {
      const errorMap: Record<string, string> = {
        google_already_linked: "此 Google 帳號已被其他使用者綁定！",
        invalid_token: "驗證逾時，請重新登入後再試",
        oauth_failed: "Google 授權失敗",
        missing_token: "登入憑證無效",
      };
      showAlert("error", errorMap[error] || "操作失敗");
      router.replace(window.location.pathname);
    }
  }, [router, searchParams, showAlert]);

  // 2. 載入帳號基本安全資料
  useEffect(() => {
    const fetchAccountData = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`${API_URL}/account-info`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();

        if (res.ok && result.success) {
          setAccountInfo({
            email: result.data.email,
            isGoogleLinked: result.data.isGoogleLinked,
            hasPassword: result.data.hasPassword ?? true,
          });
        } else {
          showAlert("error", result.message || "取得資料失敗");
        }
      } catch (error) {
        showAlert("error", "伺服器異常");
        console.error("抓取帳號資料失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  // 3. 處理修改 / 設定密碼送出
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      showAlert("error", "新密碼與確認密碼不一致！");
      return;
    }

    const token = Cookies.get("token");
    try {
      const res = await fetch(`${API_URL}/resetpassword/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          // 若原本沒有密碼，舊密碼可帶空字串或不帶
          oldPassword: accountInfo.hasPassword ? passwords.oldPassword : "",
          newPassword: passwords.newPassword,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        showAlert(
          "success",
          accountInfo.hasPassword
            ? "密碼修改成功！請重新登入"
            : "密碼設定成功！請重新登入",
        );
        setIsPasswordModalOpen(false);

        // 清除 JWT Token 並跳轉至登入頁
        Cookies.remove("token");
        setTimeout(() => {
          closeAlert();
          router.push("/user/login");
        }, 2000);
      } else {
        showAlert("error", result.message || "密碼設定失敗");
      }
    } catch (error) {
      showAlert("error", "伺服器異常");
    }
  };

  // 4. 處理 Google 綁定 / 解除綁定
  const handleToggleGoogleLink = async () => {
    const token = Cookies.get("token");
    const action = accountInfo.isGoogleLinked ? "unbind" : "bind";

    try {
      if (action === "bind") {
        // 引導去後端的 Google 綁定路由，並帶上 Token
        window.location.href = `${API_URL}/auth/google/bind?token=${token}`;
      } else {
        const unbind =async()=>{
          // 解除綁定 API
          const res = await fetch(`${API_URL}/auth/google/unbind`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          });
          const result = await res.json();
          
          if (res.ok && result.success) {
            showAlert("success", "已成功解除 Google 綁定");
            setAccountInfo((prev) => ({ ...prev, isGoogleLinked: false }));
          } else {
            showAlert("error", result.message || "解除綁定失敗");
          }
        }
        showAlert('confirm','溫馨提示',"你確定要解除綁定嗎？",()=>{unbind()})
      }
    } catch (error) {
      showAlert("error", "操作失敗，請稍後再試");
    }
  };

  if (loading) return <div className="p-6">帳號資料載入中...</div>;

  return (
    <Container className="bg-white flex-col sm:flex-row overflow-hidden">
      <Left />

      {/* 主要內容區塊 */}
      <div className="w-[70%] h-180 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          帳號與安全設定
        </h2>

        <div className="space-y-6 max-w-lg">
          {/* 1. 電子郵件顯示 */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">電子郵件</p>
              <p className="text-base font-medium text-gray-800">
                {accountInfo.email}
              </p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              不可修改
            </span>
          </div>

          {/* 2. 修改 / 設定密碼按鈕 */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">登入密碼</p>
              <p className="text-base font-medium text-gray-800">
                {accountInfo.hasPassword ? "••••••••" : "尚未設定密碼"}
              </p>
            </div>
            <button
              onClick={() => setIsPasswordModalOpen(true)}
              className={`${button_revise}`}
              // className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {accountInfo.hasPassword ? "修改密碼" : "設定密碼"}
            </button>
          </div>

          {/* 3. Google 帳號綁定 / 解除綁定 */}
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-sm text-gray-500">第三方帳號綁定</p>
              <p className="text-base font-medium text-gray-800 flex items-center gap-2">
                Google 帳號
                {accountInfo.isGoogleLinked ? (
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    已綁定
                  </span>
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded border">
                    未綁定
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handleToggleGoogleLink}
              // className={`px-4 py-2 text-sm rounded-md transition ${
              //   accountInfo.isGoogleLinked
              //     ? "border border-red-500 text-red-500 hover:bg-red-50"
              //     : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              // }`}
              className={`${
                accountInfo.isGoogleLinked ? button_cancel : button_submit
              }`}
            >
              {accountInfo.isGoogleLinked ? "解除綁定" : "綁定 Google"}
            </button>
          </div>
        </div>

        {/* 密碼 Modal 彈窗 */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-bold mb-4">
                {accountInfo.hasPassword ? "修改密碼" : "設定初始密碼"}
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* 僅在已有密碼時顯示舊密碼欄位 */}
                {accountInfo.hasPassword && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      舊密碼
                    </label>
                    <input
                      type="password"
                      required
                      value={passwords.oldPassword}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          oldPassword: e.target.value,
                        })
                      }
                      className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {accountInfo.hasPassword ? "新密碼" : "設定密碼"}
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    確認密碼
                  </label>
                  <input
                    type="password"
                    required
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    確認儲存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}
