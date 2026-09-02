"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * The one background the whole site sits on.
 *
 * Every band above this is translucent, so this layer is not decoration
 * for a section — it is the room all of them are in.
 *
 * ── There are no objects in it any more ────────────────────────────────
 *
 * It used to hold six discrete things: glass spheres, then — when a
 * rimmed disc turned out to be unsalvageable on espresso — six edgeless
 * pools of light. Both were the same mistake at different strengths. A
 * background made of *countable things* asks to be counted: you see six
 * of them, you watch them travel, and while you are doing that you are
 * not reading the page. Softening a shape does not stop it being a
 * shape.
 *
 * What replaced them is atmosphere: three full-bleed sheets of haze,
 * each a stack of very wide gradients in a different part of the warm
 * range — champagne, gold, caramel, pearl — overlapping so no one hue
 * is anywhere on its own. That overlap is the whole idea. A single warm
 * wash on a brown ground is brown; three of them at different densities,
 * sliding across each other at different rates, disperse into something
 * that has depth and no edges to find.
 *
 * ── What moves, and what it costs ──────────────────────────────────────
 *
 * Three elements. Not eleven, and not one blur filter between them:
 *
 *   · Scroll drives a *sine* of the scroll position rather than a
 *     translation of it. A layer that is simply pushed upwards leaves
 *     the screen and has to be wrapped back, and a wrap in something
 *     this large is a visible jump. A sine is bounded, continuous, never
 *     repeats a seam, and still has the sheets passing each other at
 *     their own rates the whole way down the page.
 *   · The pointer drifts them, scaled by `--depth`, which is what makes
 *     the three read as distance rather than as one gradient sliding.
 *   · Inside each sheet a second element breathes on a slow keyframe, so
 *     the room is alive when nothing is being scrolled or hovered.
 *
 * Softness comes from the gradient stops reaching transparency, never
 * from `filter: blur()`. A blur on a moving element is re-rasterised
 * every frame; these are three composited transforms and nothing else.
 */

/**
 * The three sheets, far to near.
 *
 * `paint` is a stack of gradients written in theme tokens — a preset
 * swaps the tokens in `app/globals.css` and this file never learns about
 * it. `depth` is how far the sheet follows the pointer. `ax`/`ay` are the
 * scroll travel as a fraction of the viewport, and `px`/`py` the scroll
 * distance in pixels that completes one cycle of it: the near sheet moves
 * furthest and turns over soonest, which is the whole of the parallax.
 * `phase` keeps the three from ever arriving at the same place at the
 * same time.
 */
const HAZE = [
  {
    // Far: the broad wash that decides the page's overall temperature.
    depth: 0.34,
    swim: 74,
    ax: 0.03,
    ay: 0.05,
    px: 2600,
    py: 1900,
    phase: 0,
    paint: `
      radial-gradient(48% 36% at 16% 12%, rgb(var(--c-accent-soft) / 0.11), transparent 70%),
      radial-gradient(42% 34% at 84% 24%, rgb(var(--c-accent) / 0.1), transparent 72%),
      radial-gradient(60% 42% at 52% 78%, rgb(var(--c-clay) / 0.08), transparent 74%)
    `,
  },
  {
    // Middle: where most of the gold lives.
    depth: 0.62,
    swim: 58,
    ax: 0.05,
    ay: 0.09,
    px: 1700,
    py: 1200,
    phase: 1.1,
    paint: `
      radial-gradient(40% 30% at 70% 56%, rgb(var(--c-accent) / 0.1), transparent 72%),
      radial-gradient(34% 26% at 22% 46%, rgb(var(--c-accent-soft) / 0.09), transparent 74%),
      radial-gradient(52% 34% at 46% 4%, rgb(var(--c-accent) / 0.07), transparent 70%)
    `,
  },
  {
    // Near: a soft shaft across the top corner and two tight highlights.
    // The linear gradient is the one directional thing in the field, and
    // it is what stops the haze reading as fog rather than as light.
    depth: 1,
    swim: 46,
    ax: 0.07,
    ay: 0.14,
    px: 1100,
    py: 760,
    phase: 2.3,
    paint: `
      linear-gradient(196deg, rgb(var(--c-pearl) / 0.055) 0%, transparent 44%),
      radial-gradient(26% 20% at 30% 26%, rgb(var(--c-pearl) / 0.07), transparent 72%),
      radial-gradient(30% 22% at 78% 84%, rgb(var(--c-accent-soft) / 0.08), transparent 74%)
    `,
  },
];

export function AmbientField() {
  const field = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = field.current;
    if (!el) return;
    if (document.documentElement.getAttribute("data-motion") !== "on") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sheets = Array.from(el.querySelectorAll<HTMLElement>("[data-haze]"));

    // Pointer drift is a desktop affordance only — and the media query is
    // the right test rather than the viewport width, because it asks the
    // question that actually matters: is there a pointer to follow.
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");

    // Where the pointer is (target) and where the field has got to
    // (current). Easing the second towards the first each frame is what
    // gives the layers weight; snapping them would read as a jitter.
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let scrolled = window.scrollY;
    let frame = 0;
    let settled = false;

    const paint = () => {
      frame = 0;

      if (fine.matches) {
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
      } else {
        cx = 0;
        cy = 0;
      }

      el.style.setProperty("--fx", `${cx.toFixed(1)}px`);
      el.style.setProperty("--fy", `${cy.toFixed(1)}px`);

      /*
       * Scroll drift, as a sine rather than a translation.
       *
       * The sheets are `inset: -30%`, so travel of up to 14% of the
       * viewport never brings an edge into view — and because the
       * position is a periodic function of the scroll rather than a
       * multiple of it, there is nothing to wrap and therefore no jump.
       * The three periods are coprime enough that the arrangement does
       * not visibly repeat within the length of the page.
       */
      const width = window.innerWidth;
      const height = window.innerHeight;

      for (const sheet of sheets) {
        const d = sheet.dataset;
        const phase = Number(d.phase ?? 0);
        const hx = Math.cos(scrolled / Number(d.px) + phase) * width * Number(d.ax);
        const hy = Math.sin(scrolled / Number(d.py) + phase) * height * Number(d.ay);
        sheet.style.setProperty("--hx", `${hx.toFixed(1)}px`);
        sheet.style.setProperty("--hy", `${hy.toFixed(1)}px`);
      }

      // Keep the loop alive only while the pointer easing still has
      // somewhere to go. Scroll and pointer events wake it again.
      settled = Math.abs(tx - cx) < 0.4 && Math.abs(ty - cy) < 0.4;
      if (!settled) frame = requestAnimationFrame(paint);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const onPointer = (e: PointerEvent) => {
      if (!fine.matches) return;
      // ±1 across the viewport, scaled to a travel of about 40px at the
      // nearest layer. Enough to notice, not enough to chase.
      tx = ((e.clientX / window.innerWidth) * 2 - 1) * 40;
      ty = ((e.clientY / window.innerHeight) * 2 - 1) * 40;
      settled = false;
      schedule();
    };

    const onScroll = () => {
      scrolled = window.scrollY;
      settled = false;
      schedule();
    };

    /*
     * The pointer listener is only ever attached on a device that has a
     * pointer.
     *
     * It used to be bound unconditionally and then bail out on the first
     * line of the handler — which still means every `pointermove` a
     * finger generates crosses into script during a scroll, on the one
     * class of device that can least afford it. Binding it behind the
     * media query means a phone never dispatches to it at all, and the
     * query is watched so a tablet with a mouse plugged in mid-session
     * still gets the drift.
     */
    let bound = false;
    const bindPointer = () => {
      if (fine.matches === bound) return;
      bound = fine.matches;
      if (bound) {
        window.addEventListener("pointermove", onPointer, { passive: true });
      } else {
        window.removeEventListener("pointermove", onPointer);
        tx = 0;
        ty = 0;
        settled = false;
        schedule();
      }
    };

    paint();
    bindPointer();
    fine.addEventListener("change", bindPointer);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      fine.removeEventListener("change", bindPointer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={field} aria-hidden className="field">
      {HAZE.map((h, i) => (
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
          {/*
            The paint is on an inner element because the outer one is
            already carrying a transform written from script. Two writers
            of one property is one too many, and the breathing keyframe
            below needs a transform of its own — so the sheet moves, and
            what is painted on it moves inside it.
          */}
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

      {/* Vignette. Over the haze, so the corners stay held down and the
          middle of any screenful is the brightest part of it. */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_38%,rgba(0,0,0,0.62)_100%)]" />

      {/* Grain, once, for the whole page. It used to be applied per band,
          which meant it restarted at every band edge and drew a seam
          across the page wherever two of them met. On top of the haze it
          does a second job: it breaks up the gradient banding that three
          overlapping washes on a dark ground would otherwise show. */}
      <div className="grain" />
    </div>
  );
}
