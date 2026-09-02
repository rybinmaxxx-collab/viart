"use client";

import { useEffect } from "react";

/**
 * Breaks the hero collage apart as the first screen is scrolled away.
 *
 * The six squares are placed and still while the hero is the screen you
 * are on. From the first pixel of scroll they separate — outwards along
 * their own vector, turning a few degrees, growing and fading — so that by
 * the time the band underneath is being read, the composition has left the
 * page entirely rather than showing through the text.
 *
 * It writes exactly one custom property, on one element: `--t` on the hero
 * section, from 0 at the top of the page to 1 at 120vh. The six transforms
 * are expressions in CSS that inherit it, so a frame costs one style write
 * and no layout, and the tiles themselves are still server-rendered markup
 * that needs nothing from the client to appear.
 *
 * Off on touch and at narrow widths, where the rails are a swipeable strip
 * under the text rather than two columns beside it — scattering a strip
 * you are trying to swipe would be actively hostile. The stylesheet
 * neutralises the transform for those cases too (see `.scatter` under the
 * coarse-pointer query), so nothing depends on this script alone.
 */
export function HeroScatter() {
  useEffect(() => {
    if (document.documentElement.getAttribute("data-motion") !== "on") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;

    const wide = window.matchMedia("(min-width: 1024px)");
    let frame = 0;
    let last = -1;

    const paint = () => {
      frame = 0;
      if (!wide.matches) {
        if (last !== 0) {
          hero.style.setProperty("--t", "0");
          last = 0;
        }
        return;
      }

      // 0 → 1 across 120vh, as specified. Squared so the squares hold
      // formation through the first flick of the wheel and then commit —
      // a linear ramp starts pulling them apart before the visitor has
      // decided they are leaving.
      const raw = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 1.2)));
      const t = Number((raw * raw).toFixed(3));
      if (t === last) return;
      hero.style.setProperty("--t", String(t));
      last = t;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
      hero.style.removeProperty("--t");
    };
  }, []);

  return null;
}
