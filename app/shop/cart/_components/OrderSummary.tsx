import React from "react";

export default function OrderSummary() {
  return (
    <div
      className="flex flex-col w-full h-130 px-4 py-2.5
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
    >
      <div className="flex items-center justify-center mt-6">
        <h3 className="text-3xl">訂單摘要/ORDER SUMMARY</h3>
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
          <h3 className="text-3xl">總計 TOTAL：</h3>
          <h3 className="text-3xl">價格$</h3>
        </div>
        <div
          className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#89502E] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
        >
          <button className="text-3xl">
            前往結帳 <br /> CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
}
