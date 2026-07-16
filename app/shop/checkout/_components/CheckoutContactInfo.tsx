import React from "react";

const mockUser = {
  email: "user@example.com",
  phone: "0912-345-678"
}

export default function CheckoutContactInfo() {
  return (
    <div className="w-full">
      <div className="flex flex-col w-full px-4 py-2.5 bg-[#FCF9F6] text-[#3D2419] font-bold text-base border-[3px] border-[#3D2419] shadow-[4px_4px_0px_0px_#3D2419]">
        <h2 className="text-xl mb-4">聯絡資訊</h2>
        <div className="flex flex-col gap-3">
          <label>
            <span className="text-sm">姓名</span>
            <input type="text" placeholder="請輸入姓名" defaultValue="" className="w-full px-3 py-2 border-2 border-[#3D2419] bg-white text-sm font-normal placeholder-gray-400" />
          </label>
          <label>
            <span className="text-sm">電子郵件</span>
            <input type="email" value={mockUser.email} readOnly className="w-full px-3 py-2 border-2 border-[#3D2419] bg-gray-100 text-sm font-normal cursor-not-allowed" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">手機號碼</span>
            <input type="tel" value={mockUser.phone} readOnly className="w-full px-3 py-2 border-2 border-[#3D2419] bg-gray-100 text-sm font-normal cursor-not-allowed" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm">地址</span>
            <input type="text" placeholder="請輸入地址" defaultValue="" className="w-full px-3 py-2 border-2 border-[#3D2419] bg-white text-sm font-normal placeholder-gray-400" />
          </label>
        </div>
      </div>
    </div>
  );
}
