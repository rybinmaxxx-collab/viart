"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Sandbox-only. A copy of `AmbientField`'s machinery with the paint pulled
 * out into a parameter, so several candidate backgrounds can be judged
 * side by side under the same content and the same motion.
 *
 * This exists to answer one question with pictures instead of adjectives:
 * the shipped field measures 7.8/255 mean channel contribution — less than
 * the static grain tile — and reads as brown fog. Raising its alpha would
 * give brighter fog. What is actually missing is *structure*: an edge or a
 * direction the eye can resolve. Each preset below tests one way of
 * supplying that.
 *
 * Delete this file and `app/sandbox` once a direction is chosen.
 */

export type Sheet = {
  depth: number;
  swim: number;
  ax: number;
  ay: number;
  px: number;
  py: number;
  phase: number;
  paint: string;
  /** Per-sheet override; the shipped field scales every sheet the same. */
  scale?: number;
};

export function FieldLab({ sheets, vignette = 0.62 }: { sheets: Sheet[]; vignette?: number }) {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const found = Array.from(el.querySelectorAll<HTMLElement>("[data-haze]"));
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let scrolled = window.scrollY;
    let frame = 0;

    const paint = () => {
      frame = 0;
      if (fine.matches) {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
      }
      el.style.setProperty("--fx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--fy", `${cy.toFixed(1)}px`);

      const width = window.innerWidth;
      const height = window.innerHeight;
      for (const sheet of found) {
        const d = sheet.dataset;
        const phase = Number(d.phase ?? 0);
        const hx = Math.cos(scrolled / Number(d.px) + phase) * width * Number(d.ax);
        const hy = Math.sin(scrolled / Number(d.py) + phase) * height * Number(d.ay);
        sheet.style.setProperty("--hx", `${hx.toFixed(1)}px`);
        sheet.style.setProperty("--hy", `${hy.toFixed(1)}px`);
      }

      if (!(Math.abs(tx - cx) < 0.4 && Math.abs(ty - cy) < 0.4)) {
        frame = requestAnimationFrame(paint);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onPointer = (e: PointerEvent) => {
      tx = ((e.clientX / window.innerWidth) * 2 - 1) * 40;
      ty = ((e.clientY / window.innerHeight) * 2 - 1) * 40;
      schedule();
    };
    const onScroll = () => {
      scrolled = window.scrollY;
      schedule();
    };

    paint();
    if (fine.matches) window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sheets]);

  return (
    <div ref={field} aria-hidden className="field">
      {sheets.map((h, i) => (
        <div
          key={i}
          data-haze
          data-ax={h.ax}
          data-ay={h.ay}
          data-px={h.px}
          data-py={h.py}
          data-phase={h.phase}
          className="haze"
          style={{ "--depth": h.depth } as Vars}
        >
          <div
            className="haze-body"
            style={{
              background: h.paint,
              animationDuration: `${h.swim}s`,
              animationDirection: i % 2 ? "alternate-reverse" : "alternate",
            }}
          />
        </div>
      ))}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 50% 30%, transparent 38%, rgba(0,0,0,${vignette}) 100%)`,
        }}
      />
      <div className="grain" />
    </div>
  );
}
