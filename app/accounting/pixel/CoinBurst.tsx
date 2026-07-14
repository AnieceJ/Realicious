"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/* ============================================================
   「記帳 & 餵食」按下去之後的酬賞。

   目前你的 app 按下去只是關掉 modal、多一列 —— 沒有酬賞就沒有回訪。
   這裡從小雞身上迸出一串像素金幣，飛出去、掉下來、消失。

   兩層 span 是故意的：
   外層跑拋物線（平滑），內層跑翻面（steps，一格一格）。
   一個 transform 沒辦法同時做兩件事。
   ============================================================ */

export default function CoinBurst({
  fire,
  originRef,
  count = 14,
}: {
  fire: number; // 每次 +1 就噴一次
  originRef: RefObject<HTMLElement | null>;
  count?: number;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (fire === 0) return;
    const layer = layerRef.current;
    const origin = originRef.current;
    if (!layer || !origin) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const r = origin.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.55;

    for (let i = 0; i < count; i++) {
      const outer = document.createElement("span");
      const inner = document.createElement("span");

      outer.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:10px;height:10px;margin:-5px 0 0 -5px;pointer-events:none;will-change:transform,opacity;`;
      inner.style.cssText = `display:block;width:10px;height:10px;background:#FFD45C;border:2px solid #000;box-sizing:border-box;`;
      outer.appendChild(inner);
      layer.appendChild(outer);

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.0; // 往上為主的扇形
      const power = 70 + Math.random() * 120;
      const dx = Math.cos(angle) * power;
      const peak = Math.sin(angle) * power;
      const drop = 140 + Math.random() * 120;
      const dur = 700 + Math.random() * 400;

      const a = outer.animate(
        [
          { transform: "translate(0,0)", opacity: 1, offset: 0 },
          {
            transform: `translate(${dx * 0.6}px, ${peak}px)`,
            opacity: 1,
            offset: 0.42,
            easing: "cubic-bezier(.15,.7,.4,1)",
          },
          {
            transform: `translate(${dx}px, ${peak + drop}px)`,
            opacity: 0,
            offset: 1,
            easing: "cubic-bezier(.5,0,.9,.5)",
          },
        ],
        { duration: dur, fill: "forwards" },
      );

      // 金幣翻面：離散 4 格，不做平滑縮放
      inner.animate(
        [
          { transform: "scaleX(1)" },
          { transform: "scaleX(0.45)" },
          { transform: "scaleX(0.1)" },
          { transform: "scaleX(0.45)" },
          { transform: "scaleX(1)" },
        ],
        {
          duration: 320,
          iterations: Math.ceil(dur / 320),
          easing: "steps(1, end)",
        },
      );

      a.onfinish = () => outer.remove();
    }
  }, [fire, originRef, count]);

  return (
    <div
      ref={layerRef}
      className="fixed inset-0 z-[60] pointer-events-none"
      aria-hidden
    />
  );
}

/* ---------- 數字滾動：金額不要用「跳」的，用「數」的 ---------- */

export function useCountUp(value: number, duration = 450) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }
    const from = fromRef.current;
    const delta = value - from;
    if (delta === 0) return;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + delta * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}
