// CustomAlert.tsx
import React, { ReactNode, MouseEvent } from 'react';

interface CustomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function CustomAlert({
  isOpen,
  onClose,
  title,
  children,
}: CustomAlertProps) {
  // 如果 isOpen 為 false，就不渲染任何東西
  if (!isOpen) return null;

  // 處理點擊遮罩（灰色部分）就關閉的邏輯
  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    if (target.dataset.overlay === 'true') {
      onClose();
    }
  };

  return (
    <div
      data-overlay="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 transition-opacity duration-200"
    >
      {/* Alert 視窗本體 */}
      <div className="flex flex-col justify-center items-center w-[90%] max-w-md border-4 scale-100 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transition-transform duration-200 animate-in fade-in zoom-in-95">


        {/* 標題 */}
        {title && (
          <h3 className={`mb-2 text-xl font-bold `}>
            {title}
          </h3>
        )}

        {/* 內文內容 */}
        <div className="text-base leading-relaxed text-gray-600">
          {children}
        </div>

        {/* 關閉按鈕 */}
        <button
          onClick={onClose}
          className={`mt-5 w-full sm:w-auto rounded-lg px-6 py-2.5 text-base font-medium text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          我知道了
        </button>
        
      </div>
    </div>
  );
}