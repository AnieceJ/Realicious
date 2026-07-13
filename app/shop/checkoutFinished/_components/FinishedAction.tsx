import React from "react";

export default function FinishedAction() {
  return (
    <div className="flex flex-row gap-4 w-full">
      <div
        className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#964590] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <button className="text-3xl">
          票券中心 <br /> TICKET CENTER
        </button>
      </div>
      <div
        className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#898d3b] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <button className="text-3xl">
          回到商品列表 <br /> MARKETPLACE
        </button>
      </div>
      <div
        className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#893f4a] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <button className="text-3xl">
          訂單總表 <br /> ORDER DETAILS
        </button>
      </div>
    </div>
  );
}
