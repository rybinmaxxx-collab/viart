"use client";

import { useEffect } from "react";

/**
 * Takes the ambient footage off a phone entirely.
 *
 * The hero collage carries two looping mp4s. They belong to the two rails
 * beside the heading, and those rails only exist from `lg` up — below that
 * the first screen is a single photograph and the rails are `display:
 * none`. But `display: none` is a painting instruction, not a networking
 * one: the elements are still in the document, still carry `autoplay`,
 * and a mobile browser will still open connections for them. Two clips
 * fetched, decoded and looped for a composition that is not on the screen
 * is the most expensive thing this page could do to a phone, and the
 * visitor gets nothing at all for it.
 *
 * So on a narrow viewport every `video[data-ambient]` has its source taken
 * away and its buffer dropped. The poster attribute stays, so anything
 * that *is* visible keeps its still frame; the source is remembered on the
 * element and put back if the window is widened to desktop, which covers a
 * tablet turned on its side as well as a resized desktop window.
 *
 * Why a script rather than markup: the alternative is rendering the rails
 * conditionally on the client, which costs the six squares their
 * server-rendered markup and gives the first screen a hydration flash. The
 * markup stays exactly as it was; only the bytes change.
 */
export function AmbientVideoGuard() {
  useEffect(() => {
    // The breakpoint the rails themselves use. Everything below it is a
    // viewport where the footage is not rendered at all.
    const wide = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      const clips = document.querySelectorAll<HTMLVideoElement>("video[data-ambient]");

      for (const clip of clips) {
        // Remember the source the server rendered, once.
        const remembered = clip.dataset.src ?? clip.getAttribute("src") ?? "";
        if (!remembered) continue;
        if (!clip.dataset.src) clip.dataset.src = remembered;

        const loaded = clip.getAttribute("src") === remembered;

        if (wide.matches) {
          if (loaded) continue;
          clip.setAttribute("src", remembered);
          clip.load();
          // Muted, looping scenery: a refusal here means the browser is
          // saving power, which is a perfectly good outcome.
          void clip.play().catch(() => {});
          continue;
        }

        if (!loaded) continue;
        clip.pause();
        clip.removeAttribute("autoplay");
        clip.preload = "none";
        clip.removeAttribute("src");
        // `load()` is what actually abandons the buffer; without it the
        // element keeps whatever it has already fetched.
        clip.load();
      }
    };

    apply();
    wide.addEventListener("change", apply);
    return () => wide.removeEventListener("change", apply);
  }, []);

  return null;
}
