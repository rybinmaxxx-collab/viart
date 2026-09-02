"use client";

import { useEffect, useState } from "react";
import { ROSE_PREFIX } from "@/lib/theme";

/**
 * Everything the alternative preset needs at runtime, and nothing the
 * baseline one does.
 *
 * On the baseline this component renders nothing and listens to nothing:
 * the palette is selected in <head> before paint (see lib/theme.ts), so by
 * the time React runs there is no work left unless the rose preset is on.
 * That is the point — the deploy that exists stays exactly what it was,
 * down to the absence of a stray control in the corner.
 *
 * With the rose preset on it does two things:
 *
 *   1. Keeps you inside it. Every link on the site is a plain <a> to a
 *      root-relative path — `/masters`, `/faq`, `/` — so following one out
 *      of `/rose` would quietly drop you back onto the baseline mid-visit.
 *      A capture-phase click handler rewrites those on the way out. One
 *      listener on the document, rather than a prefix threaded through
 *      every component that happens to render a link, is what keeps the
 *      two versions one codebase.
 *   2. Offers the way back. A small mark in the corner opposite the
 *      booking pill, naming the preset you are looking at and linking to
 *      the other one.
 */
export function ThemePreset() {
  const [rose, setRose] = useState(false);

  // Read, don't decide: the attribute is already on <html>, written from
  // the URL before first paint. Reading it after mount also keeps the
  // server-rendered markup identical for both presets, so there is nothing
  // for hydration to disagree about.
  useEffect(() => {
    setRose(document.documentElement.dataset.theme === "rose");
  }, []);

  useEffect(() => {
    if (!rose) return;

    const onClick = (e: MouseEvent) => {
      // Leave alone the clicks that were never plain navigations: a
      // modified click opens a new context, and anything but the primary
      // button is not ours to interpret.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!anchor || !href) return;

      // Same-document and off-site links are already correct: an in-page
      // anchor, a tel:, the booking system, a link with a target of its own.
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (href === ROSE_PREFIX || href.startsWith(`${ROSE_PREFIX}/`)) return;
      // The one link whose whole purpose is to leave the preset.
      if (anchor.dataset.themeExit !== undefined) return;

      e.preventDefault();
      window.location.assign(`${ROSE_PREFIX}${href === "/" ? "" : href}`);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [rose]);

  if (!rose) return null;

  return (
    <div className="fixed bottom-5 left-5 z-[3] flex items-center gap-2 rounded-full border border-white/15 bg-ink/70 px-3 py-2 text-cap text-white/62 backdrop-blur-md">
      <span className="h-2 w-2 rounded-full bg-lav" />
      <span className="text-white/88">Пудра</span>
      <span className="text-white/48">·</span>
      <a
        href="/"
        data-theme-exit=""
        className="hover-fade underline decoration-white/48 underline-offset-4"
      >
        Шоколад
      </a>
    </div>
  );
}
