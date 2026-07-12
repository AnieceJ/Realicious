import { Press_Start_2P, Noto_Sans_TC } from "next/font/google";
import AccountingApp from "./AccountingApp";
import "./pixel/fx.css";

// 像素字型（只給短標籤與數字用）
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// 中文內文字型
const notoSansTC = Noto_Sans_TC({
  weight: ["500", "700", "900"],
  preload: false,
  display: "swap",
});

export default function Page() {
  return (
    <div
      className={`${notoSansTC.className} min-h-screen bg-white text-black p-4 md:p-8 font-bold selection:bg-[#BB0015] selection:text-white`}
    >
      <AccountingApp pixel={pressStart.className} />
    </div>
  );
}
