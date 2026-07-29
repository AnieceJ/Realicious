"use client";
import React, { useState, useCallback } from "react";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
};

function ConfirmModal({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "確定",
  cancelLabel = "取消",
}: ConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shop-confirm-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md border-[3px] border-[#1A1721] bg-[#FCF9F6] shadow-[8px_8px_0px_0px_#FFD45C]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b-[3px] border-[#1A1721] bg-[#1A1721] px-5 py-4 text-white">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-white bg-[#BB0015] text-xl font-black">
            !
          </span>
          <h2 id="shop-confirm-title" className="text-xl font-black tracking-wide">
            請確認操作
          </h2>
        </div>
        <div className="px-5 py-6 sm:px-7">
          <p className="whitespace-pre-line text-base font-bold leading-7 text-[#3D2419] sm:text-lg">
            {message}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t-2 border-dashed border-[#3D2419]/30 bg-[#FFF0B8] px-5 py-4 sm:flex sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="border-[3px] border-[#1A1721] bg-white px-5 py-2.5 font-black text-[#1A1721] shadow-[3px_3px_0px_0px_#1A1721] transition-all hover:bg-[#FCF9F6] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="border-[3px] border-[#1A1721] bg-[#BB0015] px-5 py-2.5 font-black text-white shadow-[3px_3px_0px_0px_#1A1721] transition-all hover:bg-[#8E0010] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{
    message: string;
    resolve: (val: boolean) => void;
    confirmLabel?: string;
    cancelLabel?: string;
  } | null>(null);

  const showConfirm = useCallback((message: string, options?: { confirmLabel?: string; cancelLabel?: string }): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ message, resolve, ...options });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    state?.resolve(true);
    setState(null);
  }, [state]);

  const handleCancel = useCallback(() => {
    state?.resolve(false);
    setState(null);
  }, [state]);

  const confirmComponent = state ? (
    <ConfirmModal
      message={state.message}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      confirmLabel={state.confirmLabel}
      cancelLabel={state.cancelLabel}
    />
  ) : null;

  return { confirmComponent, showConfirm };
}
