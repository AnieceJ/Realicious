"use client";

import { forwardRef, type CSSProperties } from "react";
import PetSprite, { type PetMood } from "./PixelSpriteSheet";

/* ============================================================
   地面條 —— 小雞住的地方

   ★ 這裡「沒有」天空。頁面本身就是天空。

   原本的 PetStage 是一個有邊框、有自己天空的盒子，
   但 AmbientBackground 已經是一個滿版、會跟著心情變的舞台了。
   兩個舞台在打架，而小雞被關在小的那個裡面。

   所以這裡只有「地」：一條釘在視窗底部的地面，小雞站上去，
   身體自由地伸進你的內容區。沒有 overflow:hidden，沒有第二片天空。

   地面對位的算法（跟 PetStage 一樣，不要憑感覺調）：
     ‧ 小雞的腳底畫在 cell 的 y=55，下面還有 8px 空白（y=56~63）
     ‧ 放大 scale 倍之後那段空白是 8 × scale px
     ‧ 所以 sprite 的 bottom = 地面高度 − 那段空白，腳才會踩在地面線上
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
  const junk = mood === "junk";
  const dead = mood === "dead";

  // 倍率鎖成整數。2.34 倍會讓瀏覽器幫你的硬邊補上半透明鬼影 ——
  // 你花一整晚清掉的那 9 個像素會全部回來，只是這次不是 CSP 加的。
  const scale = Math.max(1, Math.round(spriteSize / CELL));
  const sprite = CELL * scale;
  const footGap = FOOT_ROW_GAP * scale;
  const spriteBottom = groundHeight - footGap;

  const ground = dead ? "#3A3444" : junk ? "#8B6F3E" : "#E0A92E";
  const groundShade = dead ? "#282331" : junk ? "#6B5430" : "#C08D1C";

  // 這條的總高度 = 小雞頭頂到地面底部。內容區要留這麼多 padding-bottom。
  const totalH = spriteBottom + sprite;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 pointer-events-none"
      style={{ height: totalH }}
      aria-hidden={false}
    >
      {/* 地面。不透明，所以內容捲到底下會被蓋住 —— 這是刻意的。 */}
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
      {junk &&
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

      {/* 小雞本人。left 用 x%，之後要她走路只要動這個值。 */}
      <div
        ref={ref}
        className="absolute"
        style={{
          bottom: spriteBottom,
          left: `${x}%`,
          transform: "translateX(-50%)",
        }}
      >
        {/* 像素影子：一個方塊，不是模糊橢圓 */}
        {!dead && (
          <span
            className="absolute left-1/2 -translate-x-1/2 bg-black/25"
            style={{ bottom: footGap - 4, width: sprite * 0.48, height: 6 }}
          />
        )}

        {/* 只有 dead 加 CSS 位移：那兩格只有 1px 起伏，下緣還會陷進地面。
            其他狀態你都畫好動作了，外掛的位移只會跟畫好的打架。 */}
        <div className={dead ? "ghost-float" : undefined}>
          <PetSprite mood={mood} streak={streak} size={sprite} />
        </div>

        {/* 狀態氣泡：只在她「有話要說」的時候出現，平常不吵你 */}
        {(dead || junk) && (
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