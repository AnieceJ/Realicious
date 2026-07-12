"use client";

import { forwardRef, useMemo, type CSSProperties } from "react";
import PetSprite, { type PetMood } from "./PixelSpriteSheet";

/* ============================================================
   寵物舞台 —— 最終版

   跟前一版的差別：
   ‧ 小雞改吃 sprite sheet（PixelSpriteSheet），不再是字串點陣圖
   ‧ 拿掉 pixel-bob / happy-hop / junk-slump —— sprite 自己會動了，
     外掛的 CSS 位移只會跟畫好的動作打架
   ‧ 只留 ghost-float：dead 的兩格只有 1px 起伏，而且下緣 y=57
     會陷進地面。CSS 把它整個抬起來飄著，比重畫省事
   ‧ dead 的天空改成夜色 —— 灰幽靈配灰天空對比只有 1.07:1，
     會整隻消失。夜色之後拉到 6~9:1
   ============================================================ */

type Props = {
  mood: PetMood;
  streak: number;
  hp: number;
  hpMax: number;
  reviveProgress?: number;
  reviveDays?: number;
};

const PetStage = forwardRef<HTMLDivElement, Props>(function PetStage(
  { mood, streak, hp, hpMax, reviveProgress = 0, reviveDays = 3 },
  ref,
) {
  const junk = mood === "junk";
  const dead = mood === "dead";

  // 天空跟著心情走。你一眼就知道今天過得好不好，不用讀數字。
  const sky = dead
    ? { top: "#2E2A3D", mid: "#4A4459", low: "#6E6578" } // 天黑了
    : junk
      ? { top: "#8E8878", mid: "#ABA492", low: "#C7C0AC" } // 灰撲撲
      : { top: "#FFE9A8", mid: "#FFF3D0", low: "#FFFBEF" };

  const ground = dead ? "#3A3444" : junk ? "#8B6F3E" : "#E0A92E";
  const groundShade = dead ? "#282331" : junk ? "#6B5430" : "#C08D1C";

  const clouds = useMemo(
    () => [
      { top: 14, dur: 46, delay: 0, scale: 1 },
      { top: 32, dur: 68, delay: -22, scale: 0.75 },
      { top: 8, dur: 92, delay: -55, scale: 0.55 },
    ],
    [],
  );

  return (
    <div
      ref={ref}
      className="pet-stage relative border-[3px] border-black h-[200px] overflow-hidden select-none"
      style={{ background: sky.low }}
    >
      {/* 天空：三條抖色帶。像素遊戲沒有漸層，只有棋盤格混色。 */}
      <div
        className="dither absolute inset-x-0 top-0 h-[34%]"
        style={{ "--dither-a": sky.top, "--dither-b": sky.mid } as CSSProperties}
      />
      <div
        className="dither dither-sparse absolute inset-x-0 top-[34%] h-[22%]"
        style={{ "--dither-a": sky.mid, "--dither-b": sky.low } as CSSProperties}
      />

      {/* 太陽 / 月亮 */}
      <div
        className="absolute right-4 top-4 w-6 h-6 border-[3px] border-black"
        style={{
          background: dead ? "#EDEDEF" : junk ? "#C7502A" : "#BB0015",
          boxShadow: dead
            ? "0 0 0 3px rgba(237,237,239,0.14)"
            : "0 0 0 3px rgba(187,0,21,0.12)",
        }}
        aria-hidden
      />

      {/* 雲：steps() 讓它一格一格漂 */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="pixel-cloud absolute"
          style={{
            top: c.top,
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            transform: `scale(${c.scale})`,
            opacity: dead ? 0.28 : 0.9,
          }}
          aria-hidden
        >
          <svg viewBox="0 0 12 5" width={72} height={30} shapeRendering="crispEdges">
            {[
              "..kkk.kk....",
              ".kwwwkwwk...",
              "kwwwwwwwwk..",
              "kwwwwwwwwwk.",
              ".kkkkkkkkkk.",
            ].map((row, y) =>
              row.split("").map((ch, x) =>
                ch === "." ? null : (
                  <rect
                    key={`${x}-${y}`}
                    x={x}
                    y={y}
                    width={1}
                    height={1}
                    fill={ch === "k" ? "#000" : dead ? "#9A93A6" : "#fff"}
                  />
                ),
              ),
            )}
          </svg>
        </div>
      ))}

      {/* 地面 */}
      <div
        className="dither absolute inset-x-0 bottom-0 h-[30px] border-t-[3px] border-black"
        style={{ "--dither-a": groundShade, "--dither-b": ground } as CSSProperties}
      />

      {/* 吃土：地上揚起的塵 */}
      {junk &&
        [0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="dust-mote absolute bottom-[26px] w-[4px] h-[4px] bg-[#6B5430]"
            style={{ left: `${16 + i * 17}%`, animationDelay: `${i * 0.55}s` }}
            aria-hidden
          />
        ))}

      {/* 小雞。腳底畫在 y=55（cell 64px、2 倍放大 → 底部空 16px），
          所以 bottom 用 -16px 讓她真的踩在地面線上。 */}
      <div className="absolute inset-x-0 bottom-[14px] flex justify-center">
        <div className="relative">
          {!dead && (
            <span
              className="absolute left-1/2 -translate-x-1/2 bottom-[16px] w-[60px] h-[6px] bg-black/25"
              aria-hidden
            />
          )}

          {/* dead 的兩格只有 1px 起伏、而且下緣會陷進地面 →
              用 ghost-float 把她抬起來飄。其他狀態一律不加 CSS 位移，
              免得跟畫好的動作打架。 */}
          <div className={dead ? "ghost-float" : undefined}>
            <PetSprite mood={mood} streak={streak} size={128} />
          </div>
        </div>
      </div>

      {/* HP 低：紅色警示掃描線 */}
      {!dead && hp / hpMax <= 0.34 && (
        <div className="danger-scan absolute inset-0 pointer-events-none" aria-hidden />
      )}

      {/* 角標 */}
      {junk && (
        <div className="absolute top-2 left-2 text-[10px] font-black px-2 py-1 bg-[#BB0015] text-white border-2 border-black">
          吃土中…
        </div>
      )}
      {dead && (
        <div className="absolute top-2 left-2 text-[10px] font-black px-2 py-1 bg-white text-black border-2 border-black">
          復活進度 {reviveProgress}/{reviveDays}
        </div>
      )}
    </div>
  );
});

export default PetStage;
