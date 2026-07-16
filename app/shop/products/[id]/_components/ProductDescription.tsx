import React from "react";

export default function ProductDescription() {
  return (
    <div className="mt-12 max-w-7xl mx-auto p-8 bg-[#FCF9F6] border-[3px] border-[#3D241] shadow-[4px_4px_0px_0px_#3D2419]">
      <h3 className="text-2xl font-black text-[#3D2419] text-center mb-8 tracking-wider">
        ✨ 商品詳細描述 ✨
      </h3>
      {/* 內容區域：未來這整個 div 會被 dangerouslySetInnerHTML 取代 */}
      <div className="flex flex-col items-center text-center gap-6 text-[#3D2419] font-bold">
        {/* 假文字 1 */}
        <p className="text-xl text-[#FF4141] font-black tracking-wide">
          【火熱爆款】川媽招牌私房研發，臭到靈魂出竅的極致體驗！
        </p>

        {/* 假文字 2 */}
        <p className="text-base text-[#3D2419]/80 max-w-xl leading-relaxed">
          本批次電子票券全台限量供應，兌換期限自購買日起算 90 天內有效。
          內含經典臭臭鍋底一份、特製像素肥腸、以及鮮嫩豆腐，冒險者回補飽食度的最佳首選！
        </p>

        {/* 假圖片預留位置 (Mockup Image) */}
        <div className="w-full max-w-2xl aspect-video bg-[#EEE] border-[3px] border-[#3D2419] flex items-center justify-center text-gray-400 shadow-[3px_3px_0px_0px_#3D2419] overflow-hidden my-4">
          <span className="text-sm">
            商品介紹大圖 / 或是廣告 Banner 預留位置
          </span>
        </div>

        <p className="text-sm text-gray-500">
          * 溫馨提醒：本券一經核銷即無法退核，請至實體門店出示 QR Code 兌換。
        </p>
      </div>
    </div>
  );
}
