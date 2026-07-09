import React from "react";

export default function CheckoutSummary() {
  return (
    <div
      className="flex flex-col w-full px-4 py-2.5
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
    >
      <div className="flex items-center justify-center mt-6">
        <h3 className="text-3xl">最後確認/CONFIRM</h3>
      </div>
      <hr className="border-t-4 w-full mx-auto mt-5 border-gray-600 " />
      <div className="flex flex-col gap-4 mt-6 w-full px-4 py-3">
        <div className="flex justify-between mb-4">
          <span>小計(Subtotal)</span>
          <span>$價格</span>
        </div>
        <div className="flex justify-between">
          <span>應稅額(Tax)</span>
          <span>$價格</span>
        </div>
        <hr className="border-t-4 border-dashed border-gray-600 mt-6 mx-auto w-full" />
        <div className="flex justify-between mt-6">
          <h3 className="text-2xl">總計 TOTAL:</h3>
          <h3 className="text-2xl">價格$</h3>
        </div>
        {/* 🟩 純樣式：像素風同意條款 Checkbox 區塊 */}
        <div className="flex flex-row items-center gap-3 mt-6">
          {/* 自製像素方框（目前預設為「未勾選」狀態的白底） */}
          <div className="w-6 h-6 border-[3px] border-[#3D2419] bg-white rounded-sm shrink-0 flex items-center justify-center shadow-[1px_1px_0px_0px_#3D2419]">
            {/* 這裡先留空，等以後寫邏輯時再讓勾勾 SVG 浮現 */}
          </div>
          {/* 條款文字 */}
          <span className="text-sm text-[#3D2419]/80 leading-tight">
            我已經閱讀並同意電子票券使用及退款規範
          </span>
        </div>
        <div
          className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#89502E] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
        >
          <button className="text-3xl">
            確認結帳 <br /> CHECKOUT
          </button>
        </div>
        <div className="flex justify-center">
          <span>*點擊後將開始進行支付</span>
        </div>
      </div>
    </div>
  );
}
