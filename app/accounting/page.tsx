import React from 'react';

export default function AccountingPage() {
  return (
    /* 引入 Google 像素字體 (通常會在 layout 引入，這裡先加在 inline 確保效果) */
    <div className="min-h-screen bg-[#EDEDED] text-[#1A1A1A] p-4 md:p-8 selection:bg-[#C81E2E] selection:text-white">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Noto+Sans+TC:wght@700;900&display=swap" rel="stylesheet" />

      {/* 🧱 頂部帥氣 Event Banner */}
      <div className="max-w-[1300px] mx-auto mb-8 bg-[#3FA2F6] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#000_25%,transparent_25%,transparent_50%,#000_50%,#000_75%,transparent_75%,transparent)] bg-[length:40px_40px]"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="inline-block bg-[#C81E2E] text-white text-[10px] px-2 py-1 border-2 border-[#1A1A1A] font-black uppercase tracking-wider mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              S/S EVENT
            </span>
            <h2 className="text-2xl md:text-3xl font-[900] tracking-wide text-white drop-shadow-[2px_2px_0px_#1A1A1A]">
              LEVEL UP DAD: 8/8 EVENT
            </h2>
            <p className="text-xs text-[#1A1A1A] font-bold mt-1 tracking-wider">
              TURN YOUR EXPENSES INTO XP! LOG YOUR DAD'S FAVORITE MEALS.
            </p>
          </div>
          <button className="bg-[#FFDE4D] border-4 border-[#1A1A1A] px-5 py-3 font-black text-xs shadow-[4px_4px_0px_#1A1A1A] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            START QUEST
          </button>
        </div>
      </div>

      {/* 📊 三欄式 RWD 主要版面 */}
      <div className="max-w-[1300px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ==================== 左欄：日曆與記帳表單 ==================== */}
        <aside className="lg:col-span-3 space-y-8">
          
          {/* 📅 潮流日曆卡片 */}
          <div className="bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-5">
            <div className="flex justify-between items-center mb-6 font-[900] border-b-4 border-[#1A1A1A] pb-3 text-sm">
              <button className="hover:text-[#C81E2E] transition-colors text-lg">&lt;</button>
              <span className="tracking-widest">2026 / 07</span>
              <button className="hover:text-[#C81E2E] transition-colors text-lg">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center text-xs font-bold">
              <div className="text-[#C81E2E]">SU</div><div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div className="text-[#3FA2F6]">SA</div>
              <div className="text-gray-300">28</div><div className="text-gray-300">29</div><div className="text-gray-300">30</div>
              <div className="py-1">1</div><div className="py-1">2</div><div className="py-1">3</div>
              <div className="bg-[#FFDE4D] border-2 border-[#1A1A1A] py-1 shadow-[2px_2px_0px_#1A1A1A] font-black">4</div>
              <div className="py-1">5</div><div className="py-1">6</div><div className="py-1">7</div>
              <div className="py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-[#C81E2E] after:rounded-full">8</div>
              <div className="py-1">9</div><div className="py-1">10</div><div className="py-1">11</div>
            </div>
          </div>

          {/* 🍔 FEED 記帳表單 */}
          <div className="bg-[#FFDE4D] border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-5 relative">
            <h3 className="text-sm font-black mb-5 tracking-widest uppercase border-b-2 border-[#1A1A1A] pb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              FEED & LOG
            </h3>
            <form className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 tracking-wider text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>CATEGORY</label>
                <select className="w-full bg-white border-3 border-[#1A1A1A] p-2.5 focus:outline-none text-sm shadow-[3px_3px_0px_#1A1A1A] font-bold rounded-none">
                  <option>🍔 餐飲 (餵食漢堡)</option>
                  <option>🎮 娛樂 (餵食電玩)</option>
                  <option>👕 服飾 (餵食衣服)</option>
                  <option>💼 收入 (打工賺錢)</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 tracking-wider text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>PRICE ($)</label>
                <input type="number" placeholder="0.00" className="w-full bg-white border-3 border-[#1A1A1A] p-2.5 focus:outline-none text-sm shadow-[3px_3px_0px_#1A1A1A] rounded-none" />
              </div>
              <div>
                <label className="block mb-1 tracking-wider text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>DATE</label>
                <input type="date" className="w-full bg-white border-3 border-[#1A1A1A] p-2.5 focus:outline-none text-sm shadow-[3px_3px_0px_#1A1A1A] rounded-none" />
              </div>
              <button type="submit" className="w-full bg-[#C81E2E] text-white border-4 border-[#1A1A1A] py-3.5 font-black uppercase tracking-wider text-xs shadow-[4px_4px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#1A1A1A] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all mt-2 cursor-pointer" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                LOG & FEED!
              </button>
            </form>
          </div>
        </aside>

        {/* ==================== 中欄：小雞主舞台 ==================== */}
        <main className="lg:col-span-5 bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-6 flex flex-col justify-between min-h-[600px]">
          <div className="flex justify-between items-center border-b-4 border-[#1A1A1A] pb-4">
            <div>
              <h2 className="text-2xl font-[900] tracking-widest text-[#1A1A1A]">米粒 (MILI)</h2>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5 uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>TAMAGOTCHI V1.0</p>
            </div>
            <span className="bg-[#96EFFF] border-3 border-[#1A1A1A] px-3 py-1.5 text-[9px] font-black uppercase shadow-[3px_3px_0px_#1A1A1A]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              HEALTHY
            </span>
          </div>

          {/* 🎮 像素復古遊戲機視窗 */}
          <div className="my-6 bg-[#F7EFDA] border-4 border-[#1A1A1A] p-8 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
            <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[length:16px_16px]"></div>
            
            {/* 小雞 */}
            <div className="w-24 h-24 bg-[#FFDE4D] border-4 border-[#1A1A1A] flex flex-col items-center justify-center shadow-[6px_6px_0px_#1A1A1A] relative z-10 animate-bounce" style={{ animationDuration: '2s' }}>
              <div className="flex space-x-5 mt-1">
                <div className="w-2.5 h-2.5 bg-[#1A1A1A]"></div>
                <div className="w-2.5 h-2.5 bg-[#1A1A1A]"></div>
              </div>
              <div className="w-5 h-2.5 bg-[#C81E2E] border-2 border-[#1A1A1A] mt-3"></div>
            </div>

            {/* 地平線 */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#E8B23D] border-t-4 border-[#1A1A1A]">
              <div className="h-2 bg-[#BA8E2F] opacity-40"></div>
            </div>
          </div>

          {/* 📊 像素風血條 */}
          <div className="space-y-4 font-bold text-xs">
            <div>
              <div className="flex justify-between mb-1.5"><span className="tracking-wider text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>HP (飽食度)</span><span style={{ fontFamily: "'Press Start 2P', monospace" }}>80%</span></div>
              <div className="w-full bg-[#EDEDED] border-3 border-[#1A1A1A] h-6 p-0.5 shadow-[2px_2px_0px_#1A1A1A]">
                <div className="bg-[#C81E2E] h-full w-[80%] border-r-4 border-[#1A1A1A] bg-[linear-gradient(90deg,transparent_90%,#1A1A1A_90%)] bg-[length:20px_100%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5"><span className="tracking-wider text-[10px]" style={{ fontFamily: "'Press Start 2P', monospace" }}>HAPPY (快樂度)</span><span style={{ fontFamily: "'Press Start 2P', monospace" }}>50%</span></div>
              <div className="w-full bg-[#EDEDED] border-3 border-[#1A1A1A] h-6 p-0.5 shadow-[2px_2px_0px_#1A1A1A]">
                <div className="bg-[#E8B23D] h-full w-[50%] border-r-4 border-[#1A1A1A] bg-[linear-gradient(90deg,transparent_90%,#1A1A1A_90%)] bg-[length:20px_100%]"></div>
              </div>
            </div>
          </div>
        </main>

        {/* ==================== 右欄：動態消費明細與吃土卡片 ==================== */}
        <aside className="lg:col-span-4 bg-white border-4 border-[#1A1A1A] shadow-[8px_8px_0px_#1A1A1A] p-5">
          <h3 className="text-sm font-black mb-5 pb-3 border-b-4 border-[#1A1A1A] tracking-wider" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            RECENT FEEDS
          </h3>
          
          <div className="divide-y-2 divide-dashed divide-gray-200 font-bold text-xs">
            {/* 項目 1 */}
            <div className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition-colors group">
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">🍔</span>
                <div>
                  <p className="font-[900] text-sm text-[#1A1A1A]">午餐 - 美式餐廳</p>
                  <p className="text-gray-400 text-[10px] mt-0.5 font-medium">12:30 · 飲食健康度 100%</p>
                </div>
              </div>
              <span className="text-[#C81E2E] font-black text-sm tracking-tighter">-$780</span>
            </div>

            {/* 項目 2 */}
            <div className="py-4 flex justify-between items-center hover:bg-gray-50 px-2 transition-colors group">
              <div className="flex items-center space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform">📚</span>
                <div>
                  <p className="font-[900] text-sm text-[#1A1A1A]">書籍 - 介面設計精要</p>
                  <p className="text-gray-400 text-[10px] mt-0.5 font-medium">14:20 · 自我提升</p>
                </div>
              </div>
              <span className="text-[#C81E2E] font-black text-sm tracking-tighter">-$850</span>
            </div>
          </div>

          {/* 🚨 【動態吃土模式警告卡片】 */}
          <div className="mt-6 bg-[#C81E2E] border-4 border-[#1A1A1A] p-4 shadow-[5px_5px_0px_#1A1A1A] text-white">
            <h4 className="text-[10px] font-black tracking-widest uppercase animate-pulse mb-2 text-[#FFDE4D]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              🚨 EMERGENCY: 吃土拯救者
            </h4>
            <p className="text-[11px] font-bold text-white mb-4 leading-relaxed">
              本月預算告急！小雞正與您一起共體時艱。以下為百元防禦型美食推薦：
            </p>
            <ul className="space-y-2 text-xs font-bold text-[#1A1A1A]">
              <li className="bg-white border-2 border-[#1A1A1A] p-2.5 flex justify-between items-center shadow-[3px_3px_0px_#1A1A1A] hover:bg-[#FFFBEB] transition-colors cursor-pointer">
                <span className="font-black">📍 阿明黑豬肉排骨便當</span>
                <span className="bg-[#FFDE4D] px-1.5 py-0.5 border border-[#1A1A1A] text-[10px]">$95</span>
              </li>
              <li className="bg-white border-2 border-[#1A1A1A] p-2.5 flex justify-between items-center shadow-[3px_3px_0px_#1A1A1A] hover:bg-[#FFFBEB] transition-colors cursor-pointer">
                <span className="font-black">📍 巷口手擀麻醬麵大王</span>
                <span className="bg-[#FFDE4D] px-1.5 py-0.5 border border-[#1A1A1A] text-[10px]">$60</span>
              </li>
            </ul>
          </div>
        </aside>

      </div>
    </div>
  );
}