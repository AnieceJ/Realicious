import React from "react";

export default function ProductPhoto() {
  return (
    // 左上商品圖片區塊含左右
    <div className="flex flex-row w-150 h-130">
      <div className="flex flex-col items-center w-30 gap-3">
        <div className="bg-purple-300 w-20 h-20 px-4 py-2.5 
                  text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"></div>
        <div className="bg-purple-300 w-20 h-20 px-4 py-2.5 
                  text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"></div>
        <div className="bg-purple-300 w-20 h-20 px-4 py-2.5 
                  text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"></div>
        <div className="bg-purple-300 w-20 h-20 px-4 py-2.5 
                  text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"></div>
        <div className="bg-purple-300 w-20 h-20 px-4 py-2.5 
                text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]"></div>
      </div>
      <div className="flex items-center justify-center w-full h-full px-4 py-2.5 
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]">
        <span>商品封面圖</span>
      </div>
    </div>
  );
}
