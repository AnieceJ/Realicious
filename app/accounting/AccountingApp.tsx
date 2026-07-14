"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import BudgetCalendar from "./BudgetCalendar";
import ChickGround, { groundClearance } from "./pixel/ChickGround";
import AmbientBackground from "./pixel/AmbientBackground";
import CoinBurst, { useCountUp } from "./pixel/CoinBurst";
import type { PetMood } from "./pixel/PixelSpriteSheet";
import {
  type Tx,
  fetchTxs,
  fetchBudget,
  fetchPet,
  createTx,
  updateTx,
  deleteTx,
  saveBudget,
  savePet,
} from "./api";

/* ============================================================
   設計 TOKEN（來自 Component 規範）
   白 #FFFFFF ｜ 卡片/次要 #FCF9F6 ｜ 輸入框 #E3E3E3
   主紅 #BB0015 ｜ 主黃 #FFD45C ｜ 純黑 #000 純白 #FFF
   按鈕陰影：Y軸 4px、純黑、不羽化 → shadow-[0_4px_0_#000]
   ============================================================ */
const CARD = "bg-[#FCF9F6] border-[3px] border-black shadow-[0_4px_0_#000]";
const BTN =
  "btn-chunky border-[3px] border-black shadow-[0_4px_0_#000] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD45C]";
const FIELD =
  "w-full bg-[#E3E3E3] border-[3px] border-black px-3 py-2.5 text-[14px] rounded-none placeholder:text-black/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD45C]";

/* ---------- 遊戲規則（想調就改這裡） ---------- */
const HP_MAX = 100;
const HP_GAIN = 20; // 有記帳 +20
const HP_LOSS = 34; // 斷一天 -34（3 天歸零）
const REVIVE_DAYS = 3; // 死後連續記帳 3 天復活
const OUTFIT_MILESTONES = [3, 7, 14, 30]; // 連續簽到服裝獎勵
const OUTFIT_NAMES = ["蝴蝶結", "圍巾", "鴨舌帽", "王冠"]; // 對應 sprite 裡的配件圖層

// 小雞的尺寸。SPRITE 必須是 64 的整數倍（128 = 2x, 192 = 3x）。
// 非整數倍會讓瀏覽器把你的硬邊補成半透明鬼影。
const SPRITE = 128;
const GROUND_H = 44;

const CATS: Record<string, { emoji: string; type: "income" | "expense" }> = {
  餐飲: { emoji: "🍔", type: "expense" },
  飲品: { emoji: "☕", type: "expense" },
  交通: { emoji: "🚇", type: "expense" },
  學習: { emoji: "📚", type: "expense" },
  娛樂: { emoji: "🎮", type: "expense" },
  服飾: { emoji: "👕", type: "expense" },
  薪資: { emoji: "💰", type: "income" },
  其他收入: { emoji: "🧧", type: "income" },
};
const WEEK = ["日", "一", "二", "三", "四", "五", "六"];

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
const keyToDate = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const fmtDay = (d: Date) =>
  `${d.getMonth() + 1} 月 ${d.getDate()} 日（週${WEEK[d.getDay()]}）`;
const daysBetween = (a: Date, b: Date) =>
  Math.round((b.getTime() - a.getTime()) / 86400000);

/* ---------- 小雞狀態計算 ----------
   從「有記帳的日子」推算 HP、連續天數、生死、復活進度         */
function calcPet(txs: Tx[]) {
  const logged = [...new Set(txs.map((t) => t.date))].sort(); // 有記帳的日期（小到大）
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (logged.length === 0) {
    return { hp: HP_MAX, streak: 0, alive: true, reviveProgress: 0, loggedToday: false };
  }

let hp = HP_MAX;
  let dead = false;   // 現在是不是死的
  let run = 0;        // 死後連續記帳幾天（復活進度）
  let prev: Date | null = null;

  for (const k of logged) {
    const d = keyToDate(k);

    if (prev) {
      const gap = daysBetween(prev, d) - 1; // 中間斷了幾天
      if (gap > 0) {
        hp = Math.max(0, hp - gap * HP_LOSS);
        run = 0;                   // 斷了 → 復活進度歸零
        if (hp === 0) dead = true;
      }
    }

    if (dead) {
      // 死掉的時候 HP 卡在 0，要連續記帳 REVIVE_DAYS 天才復活
      run++;
      if (run >= REVIVE_DAYS) {
        dead = false;
        hp = HP_GAIN * REVIVE_DAYS; // 復活，HP 回到 60
        run = 0;
      }
    } else {
      hp = Math.min(HP_MAX, hp + HP_GAIN);
    }

    prev = d;
  }

  // 從最後一次記帳到今天，中間斷掉的天數也要扣
  const last = keyToDate(logged[logged.length - 1]);
  const gapToToday = daysBetween(last, today);
  if (gapToToday > 0) {
    hp = Math.max(0, hp - gapToToday * HP_LOSS);
    if (gapToToday >= 2) run = 0; // 昨天也沒記 → 復活進度歸零（今天還沒過完，不算）
    if (hp === 0) dead = true;
  }

  // 連續天數（從今天或昨天往回數）
  let streak = 0;
  const set = new Set(logged);
  const cur = new Date(today);
  if (!set.has(toKey(cur))) cur.setDate(cur.getDate() - 1);
  while (set.has(toKey(cur))) {
    streak++;
    cur.setDate(cur.getDate() - 1);
  }

  const alive = !dead;
  return {
    hp,
    streak,
    alive,
    reviveProgress: dead ? Math.min(run, REVIVE_DAYS) : 0,
    loggedToday: set.has(toKey(today)),
  };
}

export default function AccountingApp({ pixel }: { pixel: string }) {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [budget, setBudget] = useState(500);
  const [petName, setPetName] = useState("米粒");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("米粒");
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Date>(new Date());

  const stageRef = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState(0); // 每 +1 噴一次金幣
  const [justFed, setJustFed] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showBudget, setShowBudget] = useState(false);
  const [junkMode, setJunkMode] = useState(false);
  const [junkDismissed, setJunkDismissed] = useState(false);

  // 表單
  const [fType, setFType] = useState<"expense" | "income">("expense");
  const [fCat, setFCat] = useState("餐飲");
  const [fAmt, setFAmt] = useState("");
  const [fNote, setFNote] = useState("");
  const [budgetInput, setBudgetInput] = useState("500");

  useEffect(() => {
    (async () => {
      try {
        const [t, b, p] = await Promise.all([fetchTxs(), fetchBudget(), fetchPet()]);
        setTxs(t);
        setBudget(b.budget);
        setBudgetInput(String(b.budget));
        setJunkMode(b.junkMode);
        setPetName(p.petName);
        setNameInput(p.petName);
      } catch (e) {
        console.error("[lia] 載入失敗", e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);


const saveName = async () => {
    const n = nameInput.trim().slice(0, 8);
    if (!n) {
      setNameInput(petName);
      setEditingName(false);
      return;
    }
    setPetName(n);          // 先改畫面
    setEditingName(false);
    try {
      await savePet(n);
    } catch (e) {
      console.error("[lia] 改名失敗", e);
      setPetName(petName);  // 失敗就回復
      setNameInput(petName);
    }
  };

  const pet = useMemo(() => calcPet(txs), [txs]);

  const mood: PetMood = !pet.alive
    ? "dead"
    : junkMode
      ? "junk"
      : justFed
        ? "happy"
        : pet.loggedToday
          ? "idle"
          : "hungry";

  const selKey = toKey(selected);
  const dayTxs = txs.filter((t) => t.date === selKey);
  const spent = dayTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const earned = dayTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0;
  const over = spent > budget;
  const spentAnim = useCountUp(spent); // 金額用「數」的，不要用「跳」的

  const spendDays = useMemo(
    () => [...new Set(txs.filter((t) => t.type === "expense").map((t) => t.date))].map(keyToDate),
    [txs],
  );
  const incomeDays = useMemo(
    () => [...new Set(txs.filter((t) => t.type === "income").map((t) => t.date))].map(keyToDate),
    [txs],
  );

  const catsOfType = Object.keys(CATS).filter((k) => CATS[k].type === fType);

const addTx = async () => {
    const amt = Number(fAmt);
    if (!amt || amt <= 0) return;

    const payload = {
      date: selKey,
      category: fCat,
      name: fNote.trim() || fCat,
      amount: amt,
      type: fType,
    };

    try {
      if (editingId) {
        const updated = await updateTx(editingId, payload);
        setTxs((p) => p.map((t) => (t.id === editingId ? updated : t)));
      } else {
        const created = await createTx(payload);
        setTxs((p) => [created, ...p]);
      }
    } catch (e) {
      console.error("[lia] 儲存失敗", e);
      alert("儲存失敗");
      return;
    }

    setFAmt("");
    setFNote("");
    setShowAdd(false);
    setEditingId(null);
    setJunkDismissed(false);

    if (!editingId) {
      setBurst((n) => n + 1);
      setJustFed(true);
      setTimeout(() => setJustFed(false), 1300);
    }
  };

  const delTx = async (id: string) => {
    const backup = txs;
    setTxs((p) => p.filter((t) => t.id !== id)); // 先在畫面上拿掉，不要等
    try {
      await deleteTx(id);
    } catch (e) {
      console.error("[lia] 刪除失敗", e);
      setTxs(backup); // 失敗就放回去
      alert("刪除失敗");
    }
  };

  const openEdit = (tx: Tx) => {
    setEditingId(tx.id);
    setFType(tx.type);
    setFCat(tx.category);
    setFAmt(String(tx.amount));
    setFNote(tx.name);
    setSelected(keyToDate(tx.date));
    setShowAdd(true);
  };

  return (
    <div
      className="max-w-[1100px] mx-auto flex flex-col gap-5"
      style={{ paddingBottom: groundClearance(SPRITE, GROUND_H) }}
    >
      {/* ============ 背景氛圍層（會跟著小雞的狀態變） ============ */}
      <AmbientBackground
        mood={!pet.alive ? "dead" : junkMode ? "junk" : "normal"}
        intensity={Math.min(1, pet.streak / 30)}
        danger={1 - pet.hp / HP_MAX}
      />
      <CoinBurst fire={burst} originRef={stageRef} />

      {/* ============ 狀態卡（橫的、薄的）============
           小雞本人不在這裡 —— 她住在畫面底部的地面上。
           這張卡只放「數字」：HP、連續天數、今天記了沒。 */}
      <section className={`${CARD} p-4 md:p-5`} aria-label="小雞狀態">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-[3px] bg-black" />
            {editingName ? (
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onBlur={saveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") {
                    setNameInput(petName);
                    setEditingName(false);
                  }
                }}
                autoFocus
                maxLength={8}
                aria-label="小雞名字"
                className="w-[110px] bg-[#E3E3E3] border-2 border-black px-2 py-1 text-[14px] font-black text-center rounded-none focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FFD45C]"
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                title="點一下改名字"
                className="group flex items-center gap-1.5 px-1"
              >
                <span className="text-[15px] font-black">{petName}</span>
                <span className="text-[11px] opacity-30 group-hover:opacity-100">✎</span>
              </button>
            )}
            <div className="flex-1 h-[3px] bg-black" />
          </div>

          {/* HP 與 STREAK 並排，不再上下堆疊 —— 省一半高度 */}
          <div className="grid md:grid-cols-2 gap-3 mb-3">
            <Bar label="HP" val={`${pet.hp}/${HP_MAX}`} pct={pet.hp} color="bg-[#BB0015]" pixel={pixel} />
            <Bar
              label="STREAK"
              val={`${pet.streak} 天`}
              pct={Math.min(100, (pet.streak / 30) * 100)}
              color="bg-[#FFD45C]"
              pixel={pixel}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 今日打卡狀態 */}
            <div
              className={`flex-1 min-w-[220px] border-[3px] border-black px-3 py-2 text-[12px] font-bold text-center ${
                pet.loggedToday ? "bg-[#FFD45C]" : "bg-white"
              }`}
            >
              {!pet.alive
                ? `${petName}變成幽靈了！連續記帳 ${REVIVE_DAYS} 天可復活`
                : junkMode
                  ? `預算超支，${petName}正陪你一起吃土…`
                  : pet.loggedToday
                    ? `✓ 今天已記帳，${petName}很滿足`
                    : `今天還沒記帳，${petName}餓了…`}
            </div>

            {/* 服裝里程碑 */}
            {OUTFIT_MILESTONES.map((m, i) => {
              const got = pet.streak >= m;
              return (
                <span
                  key={m}
                  className={`text-[10px] font-bold px-2 py-1.5 border-2 border-black ${
                    got ? "bg-[#FFD45C]" : "bg-[#E3E3E3] text-black/40"
                  }`}
                  title={got ? `已解鎖：${OUTFIT_NAMES[i]}` : `連續 ${m} 天解鎖`}
                >
                  {m}天 · {OUTFIT_NAMES[i]}
                </span>
              );
            })}
          </div>
      </section>

      {/* ============ 日曆 + 明細，左右並排，一眼看完 ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 日曆 */}
        <section className={`lg:col-span-5 ${CARD} p-5`} aria-label="消費日曆">
          <BudgetCalendar
            selected={selected}
            onSelect={(d) => d && setSelected(d)}
            spendDays={spendDays}
            incomeDays={incomeDays}
          />
          <div className="flex gap-3 mt-3 pt-3 border-t-2 border-dashed border-black/20 text-[11px] font-bold text-black/60">
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 bg-[#BB0015] border border-black" />有支出
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 bg-black" />有收入
            </span>
            <span className="flex items-center gap-1.5">
              <i className="w-2.5 h-2.5 bg-[#FFD45C] border border-black" />已選取
            </span>
          </div>
        </section>

        {/* 明細。拿掉 min-h-[calc(100dvh-4rem)] ——
            那一行把卡片強制撐成整個螢幕高，不管裡面有幾筆。
            大部分時候只有一兩列，所以撐出來的全是空白。 */}
        <aside
          className={`lg:col-span-7 ${CARD} p-5 flex flex-col`}
          aria-label="記帳明細"
        >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${pixel} text-[15px]`}>記帳明細</h2>
          <button
              onClick={() => {
              setEditingId(null);
              setFAmt("");
              setFNote("");
              setShowAdd(true);
            }}
            aria-label="新增一筆記錄"
            className={`${BTN} w-10 h-10 bg-[#FFD45C] grid place-items-center text-[22px] font-black leading-none`}
          >
            ＋
          </button>
        </div>

        {/* 本日預算 */}
        <div
          className={`border-[3px] border-black bg-white p-3.5 mb-4 ${over ? "shake-once" : ""}`}
          key={over ? "over" : "ok"}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] font-bold">
              本日預算{" "}
              <span className={over ? "text-[#BB0015]" : ""}>
                ${spentAnim.toLocaleString()}
              </span>{" "}
              / ${budget.toLocaleString()}
            </span>
            <button
              onClick={() => setShowBudget(true)}
              className="text-[12px] font-bold text-[#BB0015] underline underline-offset-2"
            >
              ✎ 設定
            </button>
          </div>
          <div className="h-3.5 bg-[#E3E3E3] border-2 border-black">
            <div
              className={`h-full bar-fill ${over ? "bg-[#BB0015]" : "bg-[#FFD45C]"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {junkMode && (
            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[11px] font-black px-2.5 py-1 bg-[#BB0015] text-white border-2 border-black">
                吃土模式中 · 超支 ${(spent - budget).toLocaleString()}
              </span>
              <button
                onClick={() => {
                  setJunkMode(false);
                  saveBudget({ junkMode: false }).catch((e) =>
                    console.error("[lia] 吃土模式儲存失敗", e),
                  );
                  setJunkDismissed(true);
                }}
                className="text-[11px] font-bold underline underline-offset-2 text-black/50"
              >
                關閉
              </button>
            </div>
          )}
        </div>

        {/* 選到的日期 */}
        <div className="flex justify-between items-center mb-3 text-[13px] font-bold">
          <span>📅 {fmtDay(selected)}</span>
          <span>
            支出 <span className="text-[#BB0015]">${spent.toLocaleString()}</span>
            {earned > 0 && <span className="ml-2">收入 ${earned.toLocaleString()}</span>}
          </span>
        </div>

        {/* 明細。內部捲動 —— 頁面本身不捲，所以小雞永遠不會蓋到你的內容。
            記帳一天頂多幾筆，超過就在這個框裡捲。 */}
        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {dayTxs.length === 0 ? (
            <div className="border-[3px] border-dashed border-black/25 p-10 text-center text-[13px] font-bold text-black/40">
              這天還沒有記錄，按右上角 ＋ 記一筆
            </div>
          ) : (
            dayTxs.map((tx, i) => (
              <div
                key={tx.id}
                className="row-in flex items-center gap-3 border-[3px] border-black bg-white px-3.5 py-3"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="w-9 h-9 shrink-0 border-2 border-black grid place-items-center text-[18px] bg-[#FCF9F6]">
                  {CATS[tx.category]?.emoji ?? "❓"}
                </div>
                <div className="flex-1 min-w-0 text-[14px] font-bold truncate">{tx.name}</div>
                <span className="text-[11px] font-bold px-2 py-1 bg-[#E3E3E3] border-2 border-black shrink-0">
                  {tx.category}
                </span>
                <span
                  className={`${pixel} text-[12px] w-[86px] text-right shrink-0 ${
                    tx.type === "income" ? "text-black" : "text-[#BB0015]"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                </span>
                
                <button
                  onClick={() => openEdit(tx)}
                  aria-label="編輯"
                  className="shrink-0 w-6 h-6 grid place-items-center text-black/40 hover:text-black text-[14px]"
                >
                  ✎
                </button>
                <button
                  onClick={() => delTx(tx.id)}
                  aria-label="刪除"
                  className="shrink-0 w-6 h-6 grid place-items-center text-black/40 hover:text-[#BB0015] text-[16px]"
                >
                  ✕
                </button>
              </div>
            ))
          )}
          </div>
        </aside>
      </div>

      {/* ============ 新增記帳 Modal ============ */}
      {showAdd && (
        <div
          className="fixed inset-0 z-50 bg-black/55 grid place-items-center p-4"
          onClick={() => setShowAdd(false)}
        >
          <div
            className="bg-[#FCF9F6] border-[3px] border-black shadow-[0_4px_0_#000] p-6 w-full max-w-[360px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-black mb-4">
              {editingId ? "編輯這筆記錄" : "新增一筆記錄"}
            </h3>

            <div className="flex gap-2 mb-4">
              {(["expense", "income"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setFType(t);
                    setFCat(Object.keys(CATS).filter((k) => CATS[k].type === t)[0]);
                  }}
                  className={`flex-1 border-[3px] border-black py-2 text-[14px] font-black ${
                    fType === t ? "bg-[#BB0015] text-white" : "bg-white"
                  }`}
                >
                  {t === "expense" ? "支出" : "收入"}
                </button>
              ))}
            </div>

            <label className="block text-[12px] font-bold mb-1.5">分類</label>
            <select
              value={fCat}
              onChange={(e) => setFCat(e.target.value)}
              className={`${FIELD} mb-4`}
            >
              {catsOfType.map((k) => (
                <option key={k} value={k}>
                  {CATS[k].emoji} {k}
                </option>
              ))}
            </select>

            <label className="block text-[12px] font-bold mb-1.5">金額 ($)</label>
            <input
              type="number"
              value={fAmt}
              onChange={(e) => setFAmt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTx()}
              placeholder="0"
              autoFocus
              className={`${FIELD} ${pixel} mb-4`}
            />

            <label className="block text-[12px] font-bold mb-1.5">備註（選填）</label>
            <input
              type="text"
              value={fNote}
              onChange={(e) => setFNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTx()}
              placeholder="早餐、捷運…"
              className={`${FIELD} mb-5`}
            />

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                setShowAdd(false);
                setEditingId(null);
              }}
                className={`${BTN} flex-1 bg-white py-2.5 text-[14px] font-bold`}
              >
                取消
              </button>
              <button
                onClick={addTx}
                className={`${BTN} flex-1 bg-[#BB0015] text-white py-2.5 text-[14px] font-black`}
              >
                {editingId ? "儲存" : "記帳 & 餵食"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ 預算設定 Modal ============ */}
      {showBudget && (
        <div
          className="fixed inset-0 z-50 bg-black/55 grid place-items-center p-4"
          onClick={() => setShowBudget(false)}
        >
          <div
            className="bg-[#FCF9F6] border-[3px] border-black shadow-[0_4px_0_#000] p-6 w-full max-w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[16px] font-black mb-4">設定每日預算</h3>
            <label className="block text-[12px] font-bold mb-1.5">金額 ($)</label>
            <input
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              autoFocus
              className={`${FIELD} ${pixel} mb-5`}
            />
            <div className="flex gap-2.5">
              <button
                onClick={() => setShowBudget(false)}
                className={`${BTN} flex-1 bg-white py-2.5 text-[14px] font-bold`}
              >
                取消
              </button>
              <button
                onClick={() => {
              const n = Number(budgetInput);
                if (n > 0) {
                  setBudget(n);
                  saveBudget({ budget: n }).catch((e) =>
                    console.error("[lia] 預算儲存失敗", e),
                  );
                }
                  setShowBudget(false);
                  setJunkDismissed(false);
                }}
                className={`${BTN} flex-1 bg-[#BB0015] text-white py-2.5 text-[14px] font-black`}
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ 吃土模式提示 ============ */}
      {over && !junkMode && !junkDismissed && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FCF9F6] border-[3px] border-black shadow-[0_4px_0_#000] p-4 w-[280px]">
          <div className="text-[14px] font-black mb-1.5">今日已超出預算</div>
          <p className="text-[12px] font-bold text-black/60 mb-3.5 leading-relaxed">
            超出 ${(spent - budget).toLocaleString()}。要開啟「吃土模式」，讓 {petName} 陪你一起共體時艱嗎？
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setJunkDismissed(true)}
              className="flex-1 border-2 border-black bg-white py-2 text-[12px] font-bold"
            >
              先不用
            </button>
            <button
              onClick={() => {
                setJunkMode(true);
                saveBudget({ junkMode: true }).catch((e) =>
                  console.error("[lia] 吃土模式儲存失敗", e),
                );
              }}
              className="flex-1 border-2 border-black bg-[#BB0015] text-white py-2 text-[12px] font-black"
            >
              開啟
            </button>
          </div>
        </div>
      )}

      {/* ============ 小雞住在這裡 ============
           滿版地面，釘在視窗底部。沒有邊框、沒有自己的天空 ——
           頁面就是天空，她從地上站起來，身體伸進你的內容區。
           x 是她站的位置（視窗寬度的 %）。之後畫了走路循環，
           把 x 接上動畫，她就會走。 */}
      <ChickGround
        ref={stageRef}
        mood={mood}
        streak={pet.streak}
        hp={pet.hp}
        hpMax={HP_MAX}
        reviveProgress={pet.reviveProgress}
        reviveDays={REVIVE_DAYS}
        spriteSize={SPRITE}
        groundHeight={GROUND_H}
        x={12}
      />
    </div>
  );
}

function Bar({
  label,
  val,
  pct,
  color,
  pixel,
}: {
  label: string;
  val: string;
  pct: number;
  color: string;
  pixel: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1 text-[11px] font-bold">
        <span>{label}</span>
        <span className={`${pixel} text-[10px]`}>{val}</span>
      </div>
      <div className="h-3.5 bg-[#E3E3E3] border-2 border-black">
        <div className={`h-full bar-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}