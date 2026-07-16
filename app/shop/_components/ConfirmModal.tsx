"use client";
import React, { useState, useCallback } from "react";

type ConfirmModalProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white border-[3px] border-[#3D2419] shadow-[6px_6px_0px_0px_#3D2419] rounded-xl px-8 py-6 max-w-sm w-full mx-4">
        <p className="text-[#3D2419] font-bold text-lg mb-6 whitespace-pre-line">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-2 bg-white text-[#3D2419] font-bold border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-[#3D2419] text-white font-bold border-[3px] border-[#3D2419] shadow-[2px_2px_0px_0px_#3D2419] hover:bg-[#5a3a2a] active:translate-x-[1px] active:translate-y-[1px] transition-all cursor-pointer"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}

export function useConfirm() {
  const [state, setState] = useState<{ message: string; resolve: (val: boolean) => void } | null>(null);

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ message, resolve });
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
    <ConfirmModal message={state.message} onConfirm={handleConfirm} onCancel={handleCancel} />
  ) : null;

  return { confirmComponent, showConfirm };
}
