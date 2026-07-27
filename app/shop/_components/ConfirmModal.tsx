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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white border-[3px] border-[#3D2419] shadow-[6px_6px_0px_0px_#3D2419] px-8 py-6 max-w-sm w-full mx-4">
        <p className="text-[#3D2419] font-bold text-lg mb-6 whitespace-pre-line">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-white text-[#3D2419] font-bold border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-[#3D2419] text-white font-bold border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-[#5a3a2a] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
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
