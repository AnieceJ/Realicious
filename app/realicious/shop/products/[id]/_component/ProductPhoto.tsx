import React from "react";

export default function ProductPhoto() {
  return (
    // 左上商品圖片區塊含左右
    <div className="flex flex-row w-150 h-130 bg-blue-200">
      <div className="flex flex-col items-center w-30 gap-3 bg-red-300">
        <div className="bg-purple-300 w-20 h-20"></div>
        <div className="bg-purple-300 w-20 h-20"></div>
        <div className="bg-purple-300 w-20 h-20"></div>
        <div className="bg-purple-300 w-20 h-20"></div>
        <div className="bg-purple-300 w-20 h-20"></div>
      </div>
      <div className="flex items-center justify-center w-full h-full bg-amber-300">
        <span>商品封面圖</span>
      </div>
    </div>
  );
}
