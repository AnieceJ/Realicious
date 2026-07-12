import React from "react";
import QuantityPicker from "../../_components/QuantityPicker";

export default function OrderItem() {
  return (
    <div className="m-9">
      <div
        className="flex w-full px-4 py-2.5 
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <div >
          <div className="bg-pink-300 w-30 h-30">
            <span>商品照片</span>
          </div>
        </div>
        <div className="flex flex-col ml-3">
          <div className="mb-9 mt-3">
            <h3>商品名稱</h3> 
          </div>
          <div>
            <span>$價格</span>
          </div>
        </div>
        <div className=" flex flex-col items-center ml-auto">
          <div className="mt-6 mb-5 ml-5">
            <QuantityPicker />
          </div>
          <div className="ml-15 mt-3">
            <button className="flex flex-row w-fit items-center justify-between">
              <svg
                className="w-6 h-6 fill-[#3D2419] transition-colors hover:fill-red-500 mb-1"
                viewBox="0 0 24 24"
              >
                <path d="M9 3h6v2H9V3zm-4 4h14v2H5V7zm2 4h10v10H7V11zm2 2v5h2v-5H9zm4 0v5h2v-5h-2z" />
              </svg>
              <span>移除商品</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
