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
  },
  ref,
) {
  // ---- 拖曳狀態 ----
  // grabbed = 現在正被拎著嗎。這是「狀態切換」，用 state 沒問題（不是每幀）。
  const [grabbed, setGrabbed] = useState(false);
  // 小雞那顆 div 的參考，拖曳中直接改它的 transform，不走 React。
  const chickRef = useRef<HTMLDivElement | null>(null);
  // 記住按下去的位置和小雞原本的位置，算位移用。
  const dragOrigin = useRef({ px: 0, py: 0 });

  // 吃土不給拎；其他都可以。
  const canGrab = mood !== "junk";

  // 被拎起來時，顯示的狀態要換：
  //   幽靈 → surprised（OWO）
  //   其他 → held
  const shownMood: PetMood = grabbed
    ? mood === "dead"
      ? "surprised"
      : "held"
    : mood;

  const junk = shownMood === "junk";
  const dead = mood === "dead"; // 用「真實」mood 判斷是不是幽靈（地面顏色等）

  const scale = Math.max(1, Math.round(spriteSize / CELL));
  const sprite = CELL * scale;
  const footGap = FOOT_ROW_GAP * scale;
  const spriteBottom = groundHeight - footGap;

  const ground = dead ? "#3A3444" : mood === "junk" ? "#8B6F3E" : "#E0A92E";
  const groundShade = dead ? "#282331" : mood === "junk" ? "#6B5430" : "#C08D1C";

  const totalH = spriteBottom + sprite;

  // ---- 拖曳的三個處理函式 ----

  function onPointerDown(e: ReactPointerEvent) {
    if (!canGrab) return;
    e.preventDefault();
    // 讓這根手指/滑鼠之後的移動事件都送到這個元素，即使滑出去也不斷。
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragOrigin.current = { px: e.clientX, py: e.clientY };
    setGrabbed(true);
  }

  function onPointerMove(e: ReactPointerEvent) {
    if (!grabbed || !chickRef.current) return;
    // 直接改 transform，不 setState —— 這是流暢的關鍵。
    const dx = e.clientX - dragOrigin.current.px;
    const dy = e.clientY - dragOrigin.current.py;
    chickRef.current.style.transform = `translateX(-50%) translate(${dx}px, ${dy}px)`;
  }

  function onPointerUp() {
    if (!grabbed) return;
    setGrabbed(false);
    // 放開 → 掉回原位。加一個 transition 讓她「掉」下去，而不是瞬移。
    if (chickRef.current) {
      chickRef.current.style.transition = "transform 0.35s cubic-bezier(.5,0,.9,.6)";
      chickRef.current.style.transform = "translateX(-50%)";
      // 動畫跑完把 transition 拿掉，免得之後拖曳有延遲感。
      window.setTimeout(() => {
        if (chickRef.current) chickRef.current.style.transition = "";
      }, 360);
    }
  }

  // 保險：元件卸載時如果還抓著，清掉。
  useEffect(() => {
    return () => setGrabbed(false);
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
          cursor: !canGrab ? "default" : grabbed ? "grabbing" : "grab",
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

        {/* 只有「真的死掉且沒被拎」時加 ghost-float。
            被拎起來時(shownMood=surprised)不飄，讓拖曳的位移主導。 */}
        <div className={dead && !grabbed ? "ghost-float" : undefined}>
          <PetSprite mood={shownMood} streak={streak} size={sprite} />
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
