"use client";

import { useState, useRef } from "react";
import { useUser } from "@/app/context/user"; // 🌟 引入全域的 useUser
import AvatarEditor from "react-avatar-editor";
import Cookies from "js-cookie";
import Image from 'next/image'
import defaultAvatar from "@/public/user/Avatar.svg";

interface AvatarUploaderProps {
  currentAvatar: string;       // 從父組件（profile/full）傳進來的目前頭像網址
  onUploadSuccess: (newUrl: string) => void; // 上傳成功後，通知父組件更新狀態
}

// 預設大頭貼圖片（可以使用公用的線上圖片或你本地的圖片）
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/user/api";

export default function AvatarUploader({ currentAvatar, onUploadSuccess }: AvatarUploaderProps) {
  
  const editorRef = useRef<AvatarEditor>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // 使用者選取的原始檔案
  const [scale, setScale] = useState<number>(1); // 縮放比例 (1 ~ 3)
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // 1. 當使用者選擇檔案
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 2. 放棄裁剪，清除選擇的檔案
  const handleCancel = () => {
    setSelectedFile(null);
    setScale(1);
  };

  // 3. 確認裁剪並發送給後端
  const handleSaveAndUpload = async () => {
    if (!editorRef.current || !selectedFile) return;

    setIsUploading(true);
    const token = Cookies.get("token");

    // 🌟 關鍵：利用套件的 getImageScaledToCanvas() 拿到裁剪後的 HTMLCanvasElement
    const canvas = editorRef.current.getImageScaledToCanvas();

    // 將 Canvas 轉換成 Blob (二進位大型物件)，再打包成 File
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsUploading(false);
        return;
      }

      // 將裁剪後的結果包裝成標準的 File 物件
      const croppedFile = new File([blob], selectedFile.name, {
        type: selectedFile.type,
      });

      // 建立 FormData，格式要跟後端 multer.single("avatar") 對上
      const formData = new FormData();
      formData.append("avatar", croppedFile);

      try {
        const res = await fetch(`${API_URL}/profile/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // 注意：傳 FormData 時，千萬不要手動加 "Content-Type" header，瀏覽器會自動幫你加並附上 boundary
          },
          body: formData,
        });

        const result = await res.json();

        if (res.ok && result.success) {
          alert("大頭貼更新成功！");
          onUploadSuccess(result.avatar); // 呼叫父組件函式，把最新的圖片網址傳回去更新畫面
          handleCancel(); // 關閉編輯視窗
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

  // 計算目前要顯示的圖片路徑 (如果有原本的就用原本的，否則用預設圖)
  // 如果你的後端網址跟前端不同，記得在 currentAvatar 前面加上後端主機域名，例如 `${process.env.NEXT_PUBLIC_BACKEND_URL}${currentAvatar}`
  const displayAvatar = currentAvatar ? `http://localhost:3001/${currentAvatar}` : defaultAvatar;

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border-b">
      <h3 className="text-sm font-medium text-gray-700">個人頭像</h3>

      {/* 模式 A：平常沒選檔案時，只顯示目前的頭像與「更換頭像」按鈕 */}
      {!selectedFile ? (
        <div className="flex flex-col items-center space-y-3">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 shadow-inner">
            <Image
              src={displayAvatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              width={50}
              height={50}
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
        /* 模式 B：選取檔案後，跳出裁剪編輯器 */
        <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <AvatarEditor
            ref={editorRef}
            image={selectedFile}
            width={160}
            height={160}
            border={40} // 畫布邊框大小
            borderRadius={100} // 🌟 關鍵：設成 100 或是高於寬度，就會變成圓形裁剪框
            color={[255, 255, 255, 0.6]} // 遮罩顏色 (半透明白)
            scale={scale}
            rotate={0}
          />

          {/* 縮放拉條 (Slider) */}
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

          {/* 操作按鈕 */}
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