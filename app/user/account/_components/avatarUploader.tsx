"use client";

import { useState, useRef } from "react";
import AvatarEditor,{ AvatarEditorRef } from "react-avatar-editor";
import Cookies from "js-cookie";
import Image, { StaticImageData } from 'next/image'; // 🌟 1. 引入 StaticImageData 型別
import defaultAvatar from "@/public/user/Avatar.svg";

interface AvatarUploaderProps {
  currentAvatar: string | null | undefined; // 🌟 2. 修正型別：後端可能傳回來 null 或 undefined
  onUploadSuccess: (newUrl: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";

export default function AvatarUploader({ currentAvatar, onUploadSuccess }: AvatarUploaderProps) {
  
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
  };

  const handleSaveAndUpload = async () => {
    if (!editorRef.current || !selectedFile) return;

    setIsUploading(true);
    const token = Cookies.get("token");
    const canvas = editorRef.current.getImageScaledToCanvas();

    canvas.toBlob(async (blob:Blob | null) => {
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

  // 🌟 3. 防禦性邏輯：嚴格檢查 currentAvatar 是否為合法網址/路徑
  // 這樣能將 displayAvatar 的型別成功收窄成 string | StaticImageData，讓 TypeScript 不再抱怨
  let displayAvatar: string | StaticImageData = defaultAvatar;

  if (currentAvatar && typeof currentAvatar === "string" && currentAvatar.trim() !== "") {
    // 確保它不是空字串，且是合法的路徑或網址格式
    if (currentAvatar.startsWith("/") || currentAvatar.startsWith("http://") || currentAvatar.startsWith("https://")) {
      displayAvatar = currentAvatar;
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700">個人頭像</h3>

      {!selectedFile ? (
        <div className="flex flex-col items-center space-y-3">
          {/* 🌟 4. 這裡調整了容器的尺寸，與 Next.js Image 的尺寸匹配，並確保圓形 */}
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner relative">
            <Image
              src={displayAvatar}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full" // 🌟 加上 rounded-full 雙重保險
              width={128}   // 🌟 5. 放大解析度：原本設 50 在 32 (128px) 的容器裡會很模糊，配合 w-32 改成 128
              height={128}  // 🌟 必須同時提供 width 與 height
              priority      // 🌟 提升載入權重，避免換電腦時因為延遲加載閃爍
            />
          </div>
          <label className="cursor-pointer px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition">
            更換頭像
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      ) : (
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
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

          <div className="w-full flex items-center space-x-2 my-3">
            <span className="text-xs text-gray-500">縮小</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
            <span className="text-xs text-gray-500">放大</span>
          </div>

          <div className="flex space-x-2 w-full justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isUploading}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveAndUpload}
              disabled={isUploading}
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isUploading ? "上傳中..." : "確認裁剪並上傳"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}