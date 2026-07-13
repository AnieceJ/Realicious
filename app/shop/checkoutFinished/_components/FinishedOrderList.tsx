import React from "react";

export default function FinishedOrderList() {
  return (
    <div>
      <div
        className="flex flex-col w-full px-4 py-2.5
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <div className="flex flex-row justify-between">
          <span className="text-2xl">訂單明細</span>
          <span className="text-2xl">[訂單編號]</span>
        </div>
        <hr className="mt-3 border-b-2 border-gray-500" />
        <div className="flex flex-col mt-4">
          <div className="flex flex-row justify-between mb-2">
            <span>[item.name]x[item.qty]</span>
            <span>[item.price]</span>
          </div>
          <div className="flex flex-row justify-between mb-2">
            <span>[item.name]x[item.qty]</span>
            <span>[item.price]</span>
          </div>
          <div className="flex flex-row justify-between mb-2">
            <span>[item.name]x[item.qty]</span>
            <span>[item.price]</span>
          </div>
        </div>
        <hr className="border-t-4 border-dashed border-gray-500 mt-2 mx-auto w-full" />
        <div className="flex flex-row items-center justify-between mt-4">
          <div className="flex flex-col text-2xl">
            <p>訂單總金額</p>
            <p>Total Loot</p>
          </div>
          <div>
            <span className="text-2xl">[TotalPrice]</span>
          </div>
        </div>
      </div>
    </div>
  );
}
