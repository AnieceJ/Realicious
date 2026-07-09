import React from "react";

export default function CheckoutPaymentMethod() {
  return (
    <div className="w-full h-[30%]">
      <div
        className="flex flex-col w-full  px-4 py-2.5
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <div className="mb-3">
          <h3 className="text-2xl">支付方式</h3>
        </div>
        <div className="flex flex-row items-center justify-around mb-3 ">
          <div>
            <button
              className="flex flex-row items-center justify-center w-full px-15 py-8
                  bg-[#89502E] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
            >
              <span className="flex items-center gap-2 text-2xl whitespace-nowrap">
                {/* 💳 像素信用卡 SVG */}
                <svg
                  className="w-8 h-8 shrink-0 fill-[#FFFFFF]
                "
                  viewBox="0 0 24 24"
                >
                  {/* 信用卡主體與磁條、晶片槽 */}
                  <path d="M2 5h20v14H2V5zm2 2v2h16V7H4zm0 4v6h16v-6H4zm2 2h4v2H6v-2z" />
                </svg>
                線上刷卡
              </span>
            </button>
          </div>
          <div>
            <button
              className="flex items-center justify-center w-full px-15 py-8
                  bg-[#89502E] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
            >
              <span className="flex items-center gap-2 text-2xl whitespace-nowrap">
                {/* 📱 像素手機 SVG */}
                <svg
                  className="w-8 h-8 shrink-0 fill-[#FFFFFF]"
                  viewBox="0 0 24 24"
                >
                  {/* 手機外殼、螢幕範圍與 Home 鍵、上方聽筒 */}
                  <path d="M6 2h12v20H6V2zm2 2v14h8V4H8zm3 15h2v2h-2v-2z" />
                </svg>
                行動支付
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
