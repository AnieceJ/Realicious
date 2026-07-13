"use client";

import { forwardRef, useMemo, type CSSProperties } from "react";
import PetSprite, { type PetMood } from "./PixelSpriteSheet";

/* ============================================================
   寵物舞台 —— hero 版

   新增 height / spriteSize 兩個 prop。

   ★ spriteSize 必須是 64 的整數倍（128 / 192 / 256）。
     3.5 倍會讓每兩個像素就有一個被拉成 1.5px，邊緣長出半透明鬼影，
     你花了一整晚清掉的那 9 個半透明像素會全部回來 —— 只是這次是
     瀏覽器幫你加的。

   地面對位的算法（不要憑感覺調）：
     ‧ 小雞的腳底畫在 cell 的 y=55，下面還有 8px 空白（y=56~63）
     ‧ 放大 scale 倍之後，那段空白是 8 × scale px
     ‧ 所以 sprite 容器的 bottom 要設成「地面高度 − 那段空白」
       腳才會剛好踩在地面線上
   ============================================================ */

const CELL = 64;
const FOOT_ROW_GAP = 8; // 腳底(y=55)到 cell 底部(y=63)的空白列數

type Props = {
  mood: PetMood;
  streak: number;
  hp: number;
  hpMax: number;
  reviveProgress?: number;
  reviveDays?: number;
  height?: number;
  spriteSize?: number;
};

const PetStage = forwardRef<HTMLDivElement, Props>(function PetStage(
  {
    mood,
    streak,
    hp,
    hpMax,
    reviveProgress = 0,
    reviveDays = 3,
    height = 200,
    spriteSize = 128,
  },
  ref,
) {
  const junk = mood === "junk";
  const dead = mood === "dead";

  // 倍率鎖成整數。傳 150 進來會被吃成 128，不會讓像素糊掉。
  const scale = Math.max(1, Math.round(spriteSize / CELL));
  const sprite = CELL * scale;

  const groundH = Math.max(30, Math.round(height * 0.13));
  const footGap = FOOT_ROW_GAP * scale; // sprite 容器底部到腳底的空白
  const spriteBottom = groundH - footGap; // 讓腳踩在地面線上

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
      { top: 0.09, dur: 46, delay: 0, scale: 1 },
      { top: 0.22, dur: 68, delay: -22, scale: 0.72 },
      { top: 0.05, dur: 92, delay: -55, scale: 0.52 },
    ],
    [],
  );

  return (
    <div
      ref={ref}
      className="pet-stage relative border-[3px] border-black overflow-hidden select-none"
      style={{ height, background: sky.low }}
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
        className="absolute border-[3px] border-black"
        style={{
          right: 24,
          top: 24,
          width: 12 * scale,
          height: 12 * scale,
          background: dead ? "#EDEDEF" : junk ? "#C7502A" : "#BB0015",
          boxShadow: dead
            ? "0 0 0 4px rgba(237,237,239,0.14)"
            : "0 0 0 4px rgba(187,0,21,0.12)",
        }}
        aria-hidden
      />

      {/* 雲：steps() 讓它一格一格漂 */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="pixel-cloud absolute"
          style={{
            top: Math.round(height * c.top),
            animationDuration: `${c.dur}s`,
            animationDelay: `${c.delay}s`,
            transform: `scale(${c.scale})`,
            opacity: dead ? 0.28 : 0.9,
          }}
          aria-hidden
        >
          <svg
            viewBox="0 0 12 5"
            width={12 * scale * 2}
            height={5 * scale * 2}
            shapeRendering="crispEdges"
          >
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
        className="dither absolute inset-x-0 bottom-0 border-t-[3px] border-black"
        style={
          {
            height: groundH,
            "--dither-a": groundShade,
            "--dither-b": ground,
          } as CSSProperties
        }
      />

      {/* 吃土：地上揚起的塵 */}
      {junk &&
        [0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            className="dust-mote absolute w-[4px] h-[4px] bg-[#6B5430]"
            style={{
              bottom: groundH - 4,
              left: `${12 + i * 12}%`,
              animationDelay: `${i * 0.42}s`,
            }}
            aria-hidden
          />
        ))}

      {/* 小雞。bottom 是算出來的，不是喬出來的 —— 見檔頭。 */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{ bottom: spriteBottom }}
      >
        <div className="relative">
          {!dead && (
            <span
              className="absolute left-1/2 -translate-x-1/2 bg-black/25"
              style={{ bottom: footGap - 4, width: sprite * 0.48, height: 6 }}
              aria-hidden
            />
          )}

          {/* 只有 dead 加 CSS 位移：那兩格只有 1px 起伏，而且下緣會陷進地面。
              其他狀態你都畫好動作了，外掛的位移只會跟畫好的打架。 */}
          <div className={dead ? "ghost-float" : undefined}>
            <PetSprite mood={mood} streak={streak} size={sprite} />
          </div>
        </div>
      </div>

      {/* HP 低：紅色警示掃描線 */}
      {!dead && hp / hpMax <= 0.34 && (
        <div className="danger-scan absolute inset-0 pointer-events-none" aria-hidden />
      )}

      {/* 角標 */}
      {junk && (
        <div className="absolute top-3 left-3 text-[11px] font-black px-2.5 py-1 bg-[#BB0015] text-white border-2 border-black">
          吃土中…
        </div>
      )}
      {dead && (
        <div className="absolute top-3 left-3 text-[11px] font-black px-2.5 py-1 bg-white text-black border-2 border-black">
          復活進度 {reviveProgress}/{reviveDays}
        </div>
      )}
    </div>
  );
});

export default PetStage;