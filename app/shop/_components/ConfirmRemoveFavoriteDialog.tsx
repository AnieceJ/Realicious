"use client";

import React from "react";

export default function ConfirmRemoveFavoriteDialog({
  productName,
  onCancel,
  onConfirm,
}: {
  productName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" role="dialog" aria-modal="true" aria-labelledby="remove-favorite-title">
      <div className="w-full max-w-sm bg-[#FCF9F6] border-[3px] border-[#3D2419] shadow-[6px_6px_0px_0px_#3D2419] p-6">
        <h2 id="remove-favorite-title" className="text-xl font-black text-[#3D2419]">移除收藏？</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#3D2419]/80">
          確定要將「{productName}」從我的收藏移除嗎？
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold bg-white border-2 border-[#3D2419] hover:bg-[#FFF2DE] cursor-pointer"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-bold text-white bg-[#D94B4B] border-2 border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-[#BE3939] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none cursor-pointer"
          >
            確認移除
          </button>
        </div>
      </div>
    </div>
  );
}
