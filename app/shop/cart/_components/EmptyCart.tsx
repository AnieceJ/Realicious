import React from "react";

export default function EmptyCart() {
  return (
    <div className="ml-9">
      <div
        className="flex w-full px-4 py-2.5 
                  bg-[#FCF9F6] text-[#3D2419] font-bold text-base
                  border-[3px] border-[#3D2419]
                  shadow-[4px_4px_0px_0px_#3D2419]
                  "
      >
        <button className="flex flex-row w-fit items-center justify-between">
          <svg
            className="w-6 h-6 fill-[#3D2419] transition-colors hover:fill-red-500 mb-1"
            viewBox="0 0 24 24"
          >
            <path d="M9 3h6v2H9V3zm-4 4h14v2H5V7zm2 4h10v10H7V11zm2 2v5h2v-5H9zm4 0v5h2v-5h-2z" />
          </svg>
          清空購物車/EMPTY CART
        </button>
      </div>
    </div>
  );
}
