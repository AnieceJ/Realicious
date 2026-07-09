import React from "react";
import FinishedPhoto from "./_components/FinishedPhoto";
import FinishedOrderList from "./_components/FinishedOrderList";

export default function page() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-[#FFFFFF]" />
      <div className="max-w-7xl">
        <FinishedPhoto />
      </div>
      <div className="flex flex-col items-center justify-center mb-4">
        <h2 className="text-3xl text-center">
          感謝您的購買！
          <br /> Thank You for Your Order!
        </h2>
      </div>
      <div className="flex flex-col items-center justify-center ">
        <div className="w-[60%]">
          <FinishedOrderList />
        </div>
      </div>
    </div>
  );
}
