'use client'
import CustomAlert from "./_components/alert";
import React, { useState } from "react";
export default function User() {
  // 1. 控管 Alert 的狀態組合
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: "",
    message: "",
  });
  const handleLoginSuccess = () => {
    setAlertConfig({
      isOpen: true,
      title: "登入成功",
      message: "歡迎回來！系統正在導向至主控台...",
    });
  };

  // 關閉 Alert 的輔助函式
  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };
  return (
    <div>
      <h1>會員</h1>
      <div className="space-x-4">
        {/* 測試按鈕們 */}
        <button
          onClick={handleLoginSuccess}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          模擬登入成功
        </button>
      </div>
      {/* 🧾 萬用的自訂 Alert 元件呼叫 */}
      <CustomAlert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        title={alertConfig.title}
      >
        {alertConfig.message}
      </CustomAlert>
    </div>
  );
}
