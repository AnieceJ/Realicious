"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import PetSprite, { type PetMood } from "./PixelSpriteSheet";

/* ============================================================
   地面條 —— 小雞住的地方，而且可以被拎起來

   ★ 這裡「沒有」天空。頁面本身就是天空。
   AmbientBackground 已經是滿版、會跟著心情變的舞台。這裡只有「地」。

   ---- 拖曳互動（這次新加的）----

   按住小雞 → 她被拎起來，跟著滑鼠跑，放開掉回地面。

   規則（跟你討論定的）：
     ‧ 健康（idle/happy/hungry）被拎 → 切 held（認命的垂眼）
     ‧ 吃土（junk）           → 不給拎（來不及做，之後補）
     ‧ 幽靈（dead）被拎       → 切 surprised（OWO 嚇一跳）

   技術重點：拖曳「不用 React state 存每一幀的座標」。
   一秒 60 次 setState 會讓整個頁面重新 render，卡死。
   跟金幣一樣，拖曳中直接改 DOM 的 transform（ref），
   只有「開始拖 / 放開」這種「狀態切換」才用 setState。
   ============================================================ */

const CELL = 64;
const FOOT_ROW_GAP = 8;

type Props = {
  mood: PetMood;
  streak: number;
  hp: number;
  hpMax: number;
  reviveProgress?: number;
  reviveDays?: number;
  spriteSize?: number;
  groundHeight?: number;
  /** 小雞站在哪（視窗寬度的百分比）。之後畫了走路循環，改這個值她就會走。 */
  x?: number;
  equippedHead?: "bow" | "cap" | "crown" | null;
  equippedNeck?: "scarf" | null;
};

const ChickGround = forwardRef<HTMLDivElement, Props>(function ChickGround(
  {
    mood,
    streak,
    hp,
    hpMax,
    reviveProgress = 0,
    reviveDays = 3,
    spriteSize = 128,
    groundHeight = 44,
    x = 12,
    equippedHead = null,
    equippedNeck = null,
  },
  ref,
) {
  // ---- 拖曳狀態 ----
  // grabbed = 現在正被拎著嗎。這是「狀態切換」，用 state 沒問題（不是每幀）。
  const [grabbed, setGrabbed] = useState(false);
  // ghostBlip = 幽靈被點了、正在播一次驚訝。播完自動回 dead。
  const [ghostBlip, setGhostBlip] = useState(false);
  const chickRef = useRef<HTMLDivElement | null>(null);
  const dragOrigin = useRef({ px: 0, py: 0 });
  // 開始拖曳那一刻，小雞在視窗裡的位置與大小。clamp 邊界要用。
  const startRect = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const blipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dead = mood === "dead"; // 用「真實」mood 判斷是不是幽靈

  // ★ 幽靈抓不住（虛體），吃土也不給拎。只有健康時能拖。
  const canGrab = mood !== "junk" && !dead;

  // 顯示的狀態：
  //   被拎（健康）→ held
  //   幽靈被點     → surprised 播一次
  //   其他         → 原本的 mood
  const shownMood: PetMood = grabbed
    ? "held"
    : ghostBlip
      ? "surprised"
      : mood;

  const junk = shownMood === "junk";

  const scale = Math.max(1, Math.round(spriteSize / CELL));
  const sprite = CELL * scale;
  const footGap = FOOT_ROW_GAP * scale;
  const spriteBottom = groundHeight - footGap;

  const ground = dead ? "#3A3444" : mood === "junk" ? "#8B6F3E" : "#E0A92E";
  const groundShade = dead ? "#282331" : mood === "junk" ? "#6B5430" : "#C08D1C";

  const totalH = spriteBottom + sprite;

  // ---- 互動處理 ----

  function onPointerDown(e: ReactPointerEvent) {
    // 幽靈：抓不住，但點一下驚訝一次（虛體被戳到會嚇一跳）
    if (dead) {
      if (ghostBlip) return; // 正在驚訝中，不重複觸發
      setGhostBlip(true);
      if (blipTimer.current) clearTimeout(blipTimer.current);
      // surprised 一輪 = DURATION.surprised(0.7s) × 一次。播完回 dead。
      blipTimer.current = setTimeout(() => setGhostBlip(false), 700);
      return;
    }

    if (!canGrab) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragOrigin.current = { px: e.clientX, py: e.clientY };
    // 記下這一刻小雞的位置（尚未位移），clamp 用。
    const r = chickRef.current?.getBoundingClientRect();
    if (r) startRect.current = { left: r.left, top: r.top, width: r.width, height: r.height };
    setGrabbed(true);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!grabbed || !chickRef.current) return;

    const dx = e.clientX - dragOrigin.current.px;
    const dy = e.clientY - dragOrigin.current.py;

    // ★ 把小雞夾在視窗內。startRect 是開始拖曳那一刻小雞的位置，
    //   加上位移後不能讓她的邊界超出視窗。
    const { left, top, width, height } = startRect.current;
    const m = 8; // 邊界留白
    const clampedDx = Math.max(m - left, Math.min(window.innerWidth - m - width - left, dx));
    const clampedDy = Math.max(m - top, Math.min(window.innerHeight - m - height - top, dy));

    chickRef.current.style.transform = `translateX(-50%) translate(${clampedDx}px, ${clampedDy}px)`;
  }

  function onPointerUp() {
    if (!grabbed) return;
    setGrabbed(false);
    if (chickRef.current) {
      chickRef.current.style.transition = "transform 0.35s cubic-bezier(.5,0,.9,.6)";
      chickRef.current.style.transform = "translateX(-50%)";
      window.setTimeout(() => {
        if (chickRef.current) chickRef.current.style.transition = "";
      }, 360);
    }
  }

  // 保險：元件卸載時清掉狀態和計時器。
  useEffect(() => {
    return () => {
      setGrabbed(false);
      if (blipTimer.current) clearTimeout(blipTimer.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 pointer-events-none"
      style={{ height: totalH }}
    >
      {/* 地面 */}
      <div
        className="dither absolute inset-x-0 bottom-0 border-t-[3px] border-black"
        style={
          {
            height: groundHeight,
            "--dither-a": groundShade,
            "--dither-b": ground,
          } as CSSProperties
        }
      />

      {/* 吃土：地上揚起的塵 */}
      {mood === "junk" &&
        [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <span
            key={i}
            className="dust-mote absolute w-[4px] h-[4px] bg-[#6B5430]"
            style={{
              bottom: groundHeight - 4,
              left: `${6 + i * 12}%`,
              animationDelay: `${i * 0.38}s`,
            }}
          />
        ))}

      {/* 小雞本人。pointer-events-auto 讓她可以被點（外層是 none）。
          canGrab 時游標變成「可抓」的手。 */}
      <div
        ref={(node) => {
          chickRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className="absolute pointer-events-auto touch-none"
        style={{
          bottom: spriteBottom,
          left: `${x}%`,
          transform: "translateX(-50%)",
          // 幽靈：一般游標（抓不住，只能戳）。健康：可抓的手。
          cursor: dead ? "pointer" : !canGrab ? "default" : grabbed ? "grabbing" : "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* 像素影子：被拎起來時淡掉（她離開地面了） */}
        {!dead && (
          <span
            className="absolute left-1/2 -translate-x-1/2 bg-black/25 transition-opacity"
            style={{
              bottom: footGap - 4,
              width: sprite * 0.48,
              height: 6,
              opacity: grabbed ? 0.1 : 1,
            }}
          />
        )}

        {/* 幽靈一律加 ghost-float（飄浮），包含被戳出驚訝時 —— 虛體感要一直在。
            健康被拎(held)時不飄，讓拖曳的位移主導。 */}
        <div className={dead ? "ghost-float" : undefined}>
          <PetSprite
            mood={shownMood}
            streak={streak}
            equippedHead={equippedHead}
            equippedNeck={equippedNeck}
            size={sprite}
          />
        </div>

        {/* 狀態氣泡：被拎起來時不顯示（她正忙著被玩） */}
        {!grabbed && (dead || mood === "junk") && (
          <div
            className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-black px-2.5 py-1 border-2 border-black ${
              dead ? "bg-white text-black" : "bg-[#BB0015] text-white"
            }`}
            style={{ bottom: sprite - footGap + 8 }}
          >
            {dead ? `復活進度 ${reviveProgress}/${reviveDays}` : "吃土中…"}
          </div>
        )}
      </div>

      {/* HP 低：地面泛紅警示 */}
      {!dead && hp / hpMax <= 0.34 && (
        <div
          className="danger-scan absolute inset-x-0 bottom-0"
          style={{ height: groundHeight }}
        />
      )}
    </div>
  );
});

export default ChickGround;

/** 內容區要留的 padding-bottom（把地面條和小雞的高度讓出來） */
export function groundClearance(spriteSize = 128, groundHeight = 44) {
  const scale = Math.max(1, Math.round(spriteSize / CELL));
  return groundHeight - FOOT_ROW_GAP * scale + CELL * scale + 16;
}