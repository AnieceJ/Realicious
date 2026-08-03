"use client";
import React, { useState, useCallback } from "react";
import SiteModal, {
  SiteModalActions,
  SiteModalButton,
} from "@/app/_components/SiteModal";

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
    <SiteModal title="請確認操作" onClose={onCancel} maxWidth="md">
      <p className="mb-5 whitespace-pre-line text-[14px] font-bold leading-7 text-black/70 sm:text-base">
        {message}
      </p>
      <SiteModalActions>
        <SiteModalButton onClick={onCancel}>{cancelLabel}</SiteModalButton>
        <SiteModalButton variant="primary" onClick={onConfirm}>
          {confirmLabel}
        </SiteModalButton>
      </SiteModalActions>
    </SiteModal>
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
