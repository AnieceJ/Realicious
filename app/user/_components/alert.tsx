"use client";

import React from "react";
import { ConfirmModal } from "@/app/_components/ConfirmModal";

// 定義彈窗支援的狀態型別
export type ModalType = "loading" | "success" | "error" | "confirm";

interface CustomModalProps {
  isOpen: boolean;
  type: ModalType;
  title: string;
  message?: string;
  onClose: () => void;      // 關閉、取消或失敗重試時的動作
  onConfirm?: () => void;    // 只有 confirm 狀態下，「確定」按鈕的動作
}

export default function CustomModal({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
}: CustomModalProps) {
  if (!isOpen) return null;

  if (type === "confirm") {
    return (
      <ConfirmModal
        title={title}
        message={message}
        onCancel={onClose}
        onConfirm={() => {
          if (onConfirm) onConfirm();
          onClose();
        }}
      />
    );
  }

  // 點擊灰色背景時的處理：如果是 loading 狀態，不允許透過點擊背景關閉
  const handleOverlayClick = () => {
    if (type !== "loading") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      {/* 阻止點擊內容區域時觸發關閉 */}
      <div
        className="w-full max-w-sm bg-white p-6 transition-all m-4 border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 狀態圖示與顏色控制 */}
        <div className="flex flex-col items-center text-center">
          {type === "loading" && (
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          )}
          {type === "success" && (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-500 text-2xl">
              ✓
            </div>
          )}
          {type === "error" && (
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500 text-2xl">
              ✕
            </div>
          )}
          {/* 標題與內文 */}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
        </div>

        {/* 按鈕區域：根據不同狀態顯示不同按鈕 */}
        <div className="mt-6 flex justify-center gap-3">
          {type === "error" ? (
            <button
              onClick={onClose}
              className="w-full bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              確認
            </button>
          ) : type === "success" ? (
            <button
              onClick={onClose}
              className="w-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
            >
              知道了
            </button>
          ) : (
            // loading 狀態不顯示任何按鈕
            null
          )}
        </div>
      </div>
    </div>
  );
}
