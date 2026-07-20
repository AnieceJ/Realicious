"use client";

import { useState, useRef, MouseEvent } from "react";
import AvatarEditor, { AvatarEditorRef } from "react-avatar-editor";
import Cookies from "js-cookie";
import Image, { StaticImageData } from "next/image";
import defaultAvatar from "@/public/user/Avatar.svg";
import { IoMdPhotos } from "react-icons/io";

interface AvatarUploaderProps {
  currentAvatar: string | null | undefined;
  onUploadSuccess: (newUrl: string) => void;
}

// 取得後端 API 基礎網址
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";

export default function AvatarUploader({
  currentAvatar,
  onUploadSuccess,
}: AvatarUploaderProps) {
  const editorRef = useRef<AvatarEditorRef>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setScale(1);
    const fileInput = document.getElementById("avatar-input") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  // 處理點擊背景遮罩取消
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleSaveAndUpload = async () => {
    if (!editorRef.current || !selectedFile) return;

    setIsUploading(true);
    const token = Cookies.get("token");
    const canvas = editorRef.current.getImageScaledToCanvas();

    canvas.toBlob(async (blob: Blob | null) => {
      if (!blob) {
        setIsUploading(false);
        return;
      }

      const croppedFile = new File([blob], selectedFile.name, {
        type: selectedFile.type,
      });

      const formData = new FormData();
      formData.append("avatar", croppedFile);

      try {
        const res = await fetch(`${API_URL}/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        const result = await res.json();

        if (res.ok && result.success) {
          alert("大頭貼更新成功！");
          onUploadSuccess(result.avatar);
          handleCancel();
        } else {
          alert(result.message || "上傳失敗");
        }
      } catch (error) {
        console.error("上傳大頭貼 API 失敗:", error);
        alert("連線伺服器失敗");
      } finally {
        setIsUploading(false);
      }
    }, selectedFile.type);
  };

   //  修改後的防禦性邏輯
let displayAvatar: string | StaticImageData = defaultAvatar;

if (currentAvatar && typeof currentAvatar === "string" && currentAvatar.trim() !== "") {
  if (currentAvatar.startsWith("http://") || currentAvatar.startsWith("https://")) {
    // 1. 如果後端給的就是完整網址，直接用
    displayAvatar = currentAvatar;
  } else {
    // 2. 如果是相對路徑（例如 user/avatars/...），手動幫它加上 3001 的後端網域！
    // 先把 API_URL 的 /user/api 尾巴去掉，只留下 http://localhost:3001
    const backendBase = API_URL.replace("/user/api", ""); 
    
    // 確保斜線拼接正確（避免出現 // 的情況）
    const cleanPath = currentAvatar.startsWith("/") ? currentAvatar : `/${currentAvatar}`;
    
    displayAvatar = `${backendBase}${cleanPath}`;
  }
}

  return (
    <div className="flex flex-col items-center p-4">
      {/* 大頭貼與右下角圖示按鈕 */}
      <div className="relative w-32 h-32">
        {/* 大頭貼本體 */}
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
          <Image
            src={displayAvatar}
            alt="Avatar"
            className="w-full h-full object-cover rounded-full"
            width={128}
            height={128}
            priority
          />
        </div>

        {/* 🌟 修正：將 negative-translate-x-1 改為正確的 Tailwind 語法 -translate-x-1 */}
        <label className="absolute bottom-0 right-0 cursor-pointer p-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition transform -translate-x-1 translate-y-1 flex items-center justify-center border border-white z-10">
          <IoMdPhotos size={18} />
          <input
            id="avatar-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* 調整大小的彈出視窗 (Modal) */}
      {selectedFile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in cursor-pointer"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4 cursor-default animate-pop-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-medium text-gray-700 mb-4">
              調整大頭貼大小
            </h3>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <AvatarEditor
                ref={editorRef}
                image={selectedFile}
                width={160}
                height={160}
                border={40}
                borderRadius={100}
                color={[255, 255, 255, 0.6]}
                scale={scale}
                rotate={0}
              />
            </div>

            {/* 縮放拉條 */}
            <div className="w-full flex items-center space-x-2 my-4">
              <span className="text-xs text-gray-400">縮小</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.01"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-xs text-gray-400">放大</span>
            </div>

            {/* 操作按鈕 */}
            <div className="flex space-x-3 w-full justify-end">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUploading}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md text-xs font-medium hover:bg-gray-200 transition"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAndUpload}
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {isUploading ? "上傳中..." : "確認並上傳"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}