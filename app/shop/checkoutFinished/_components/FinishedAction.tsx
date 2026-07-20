import React from "react";
import Link from "next/link";

export default function FinishedAction() {
  return (
    <div className="flex flex-row gap-4 w-full">
      <Link href="/shop/tickets"
        className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#964590] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <span className="text-3xl text-center">
          票券中心<br />TICKET CENTER
        </span>
      </Link>
      <Link href="/shop"
        className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#898d3b] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <span className="text-3xl text-center">
          回到商品列表<br />MARKETPLACE
        </span>
      </Link>
      <Link href="/shop/orders"
        className="flex items-center justify-center w-full px-4 py-2.5 mt-8
                  bg-[#893f4a] text-[#FFFFFF] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  hover:opacity-90 active:translate-x-[2px] active:translate-y-[2px] transition-all"
      >
        <span className="text-3xl text-center">
          訂單總表<br />ORDER DETAILS
        </span>
      </Link>
    </div>
  );
}
