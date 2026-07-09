import { Press_Start_2P, Noto_Sans_TC } from "next/font/google";
import BudgetCalendar from "./BudgetCalendar";

// 像素字型（只給短標籤與數字用）
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

// 中文內文字型：CJK 大檔，preload 關閉
const notoSansTC = Noto_Sans_TC({
  weight: ["500", "700", "900"],
  preload: false,
  display: "swap",
});

const pixel = pressStart.className;

// 共用樣式
const card =
  "bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-5";
const press =
  "transition-transform hover:-translate-x-px hover:-translate-y-px active:translate-x-1 active:translate-y-1 active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3FA2F6]";

export default function Page() {
  return (
    <div
      className={`${notoSansTC.className} min-h-screen bg-[#EDEDED] text-[#1A1A1A] p-4 md:p-8 font-bold selection:bg-[#C81E2E] selection:text-white`}
    >
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* ==================== 左欄：寵物 + 日曆 ==================== */}
        <div className="lg:col-span-5 flex flex-col gap-7">
          {/* 🐤 寵物卡 */}
          <section className={card} aria-label="寵物狀態">
            {/* 遊戲畫面 */}
            <div className="relative overflow-hidden bg-[#F7EFDA] border-4 border-[#1A1A1A] min-h-[220px] grid place-items-center">
              <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[length:16px_16px]" />
              <svg
                width="96"
                height="96"
                viewBox="0 0 16 16"
                shapeRendering="crispEdges"
                role="img"
                aria-label="像素小雞 米粒"
                className="relative z-[1] animate-bounce motion-reduce:animate-none"
                style={{ animationDuration: "2s" }}
              >
                <rect x="4" y="2" width="8" height="2" fill="#1A1A1A" />
                <rect x="3" y="4" width="1" height="7" fill="#1A1A1A" />
                <rect x="12" y="4" width="1" height="7" fill="#1A1A1A" />
                <rect x="4" y="3" width="8" height="1" fill="#FFDE4D" />
                <rect x="4" y="4" width="8" height="7" fill="#FFDE4D" />
                <rect x="4" y="11" width="8" height="1" fill="#1A1A1A" />
                <rect x="6" y="6" width="1" height="2" fill="#1A1A1A" />
                <rect x="9" y="6" width="1" height="2" fill="#1A1A1A" />
                <rect x="7" y="8" width="2" height="1" fill="#C81E2E" />
                <rect x="6" y="12" width="1" height="2" fill="#E8B23D" />
                <rect x="9" y="12" width="1" height="2" fill="#E8B23D" />
                <rect x="5" y="14" width="3" height="1" fill="#E8B23D" />
                <rect x="8" y="14" width="3" height="1" fill="#E8B23D" />
              </svg>
              <div className="absolute inset-x-0 bottom-0 h-[26px] bg-[#E8B23D] border-t-4 border-[#1A1A1A]" />
            </div>

            {/* 狀態列 */}
            <div className="flex flex-col gap-3 my-5">
              {[
                { label: "HP 飽食度", val: "80%", w: "80%", color: "bg-[#C81E2E]" },
                { label: "HAPPY 心情", val: "50%", w: "50%", color: "bg-[#E8B23D]" },
                { label: "LV.7", val: "320 / 500 XP", w: "64%", color: "bg-[#3FA2F6]" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className={pixel}>{b.label}</span>
                    <span className={pixel}>{b.val}</span>
                  </div>
                  <div className="h-[22px] bg-[#EDEDED] border-[3px] border-[#1A1A1A] p-0.5 shadow-[2px_2px_0px_#1A1A1A]">
                    <div
                      className={`h-full ${b.color} bg-[linear-gradient(90deg,transparent_90%,rgba(0,0,0,0.25)_90%)] bg-[length:16px_100%]`}
                      style={{ width: b.w }}
                    />
                  </div>
                </div>
              ))}
            </div>

          </section>

          {/* 📅 日曆卡（改用 react-day-picker） */}
          <section className={card} aria-label="消費日曆">
            <BudgetCalendar />

            <div className="flex gap-4 mt-4 pt-3.5 border-t-2 border-dashed border-gray-300 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 bg-[#C81E2E]" />有支出
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 bg-[#16A34A]" />有收入
              </span>
              <span className="flex items-center gap-1.5">
                <i className="w-2.5 h-2.5 bg-[#FFDE4D] border-2 border-[#1A1A1A]" />今天
              </span>
            </div>
          </section>
        </div>

        {/* ==================== 右欄：記帳面板（至少滿頁） ==================== */}
        <aside
          className={`lg:col-span-7 ${card} flex flex-col min-h-[calc(100dvh-4rem)]`}
          aria-label="記帳明細"
        >
          <div className="flex justify-between items-center mb-[18px]">
            <h2 className={`${pixel} text-[14px]`}>RECENT FEEDS</h2>
            <button
              aria-label="新增一筆記帳"
              className={`${press} w-11 h-11 bg-[#FFDE4D] border-[3px] border-[#1A1A1A] grid place-items-center shadow-[4px_4px_0px_#1A1A1A]`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="3" className="w-[22px] h-[22px]">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          {/* 日期 + 當日結餘 */}
          <div className="flex justify-between items-center bg-[#EDEDED] border-[3px] border-[#1A1A1A] px-3.5 py-3 mb-[18px]">
            <span className="flex items-center gap-2 text-[14px]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="4" width="18" height="17" rx="1" />
                <path d="M3 9h18M8 2v4M16 2v4" />
              </svg>
              2025 / 05 / 15（四）
            </span>
            <span className="text-[15px] text-[#16A34A] text-right leading-none">
              +$3,190
              <small className="block text-[10px] text-gray-500 mt-1">當日結餘</small>
            </span>
          </div>

          {/* 明細列表 */}
          <div className="space-y-3">
            <FeedItem
              type="income"
              tag="收入"
              tagCls="bg-[#16A34A] text-white"
              icoBg="bg-[#96EFFF]"
              name="薪資收入"
              note="09:00 · 小雞今天精神奕奕"
              amount="+$5,000"
              icon={<path d="M12 1v22M17 5H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7" />}
            />
            <FeedItem
              type="expense"
              tag="餐飲"
              tagCls="bg-[#FFDE4D]"
              icoBg="bg-[#FFDE4D]"
              name="午餐 · 美式餐廳"
              note="12:30 · 飽食度 +100%"
              amount="−$780"
              icon={<path d="M4 3v18M4 3c3 0 3 5 0 5M20 3v18M17 3v7a3 3 0 0 0 3 3" />}
            />
            <FeedItem
              type="expense"
              tag="學習"
              tagCls="bg-[#96EFFF]"
              icoBg="bg-[#FFDE4D]"
              name="書籍 · 介面設計精要"
              note="14:20 · 心情 +15%"
              amount="−$850"
              icon={
                <>
                  <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
                  <path d="M4 19h15" />
                </>
              }
            />
            <FeedItem
              type="expense"
              tag="飲品"
              tagCls="bg-[#F0C4B3]"
              icoBg="bg-[#FFDE4D]"
              name="咖啡 · 拿鐵"
              note="16:05 · 心情 +5%"
              amount="−$180"
              icon={
                <>
                  <path d="M4 8h13v4a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z" />
                  <path d="M17 9h2a2 2 0 0 1 0 5h-2M6 2v2M10 2v2M14 2v2" />
                </>
              }
            />
          </div>

          {/* 載入更多（釘在底部） */}
          <button
            className={`${press} w-full mt-auto bg-white border-[3px] border-[#1A1A1A] py-3.5 text-[12px] flex items-center justify-center gap-2 shadow-[4px_4px_0px_#1A1A1A] hover:bg-[#FFDE4D]`}
          >
            載入更多記錄
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </aside>
      </div>
    </div>
  );
}

// 單筆明細元件
function FeedItem({
  type,
  tag,
  tagCls,
  icoBg,
  name,
  note,
  amount,
  icon,
}: {
  type: "income" | "expense";
  tag: string;
  tagCls: string;
  icoBg: string;
  name: string;
  note: string;
  amount: string;
  icon: React.ReactNode;
}) {
  const isIncome = type === "income";
  return (
    <div
      className={`flex items-center gap-3.5 bg-white border-[3px] border-l-8 border-[#1A1A1A] px-3.5 py-3 shadow-[4px_4px_0px_#1A1A1A] ${
        isIncome ? "border-l-[#16A34A]" : "border-l-[#C81E2E]"
      }`}
    >
      <div className={`w-[42px] h-[42px] shrink-0 border-[3px] border-[#1A1A1A] grid place-items-center ${icoBg}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.5" className="w-[22px] h-[22px]">
          {icon}
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-black flex items-center gap-2 flex-wrap">
          {name}
          <span className={`text-[10px] font-bold px-2 py-0.5 border-2 border-[#1A1A1A] ${tagCls}`}>
            {tag}
          </span>
        </div>
        <div className="text-[11px] text-gray-500 mt-0.5 font-medium">{note}</div>
      </div>
      <div
        className={`text-[16px] font-black whitespace-nowrap tracking-tight ${
          isIncome ? "text-[#16A34A]" : "text-[#C81E2E]"
        }`}
      >
        {amount}
      </div>
    </div>
  );
}