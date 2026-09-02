"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MediaFrame } from "@/components/MediaFrame";
import { stories } from "@/content/viart";

/**
 * The vertical photo rail.
 *
 * One piece of markup, two behaviours, decided by the input device rather
 * than by the viewport width:
 *
 *   pointer  the track drifts, doubled so the loop has no seam, and pauses
 *            under the cursor or on keyboard focus.
 *   touch    the animation is off and the same track is a native swipe
 *            with `scroll-snap`, which is the gesture a phone user already
 *            expects from a row of 9:16 frames.
 *
 * Both edges are faded rather than cut (see `.rail-mask`), so photos
 * travel past the end of the band instead of appearing out of a hard
 * vertical line.
 *
 * Clicking any frame stops the rail dead and opens that photo full size
 * over a dimmed page — uncropped, at its own proportions, rather than the
 * 9:16 slice the rail shows. Closing it starts the rail again. A marquee
 * you cannot stop and cannot look into is the usual failure of this
 * pattern; this one does both.
 */
export function StoriesRail() {
  const [open, setOpen] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Where the pointer went down, so a swipe that ends on a photo does not
  // count as a click on it. Touch scrolling would otherwise open the
  // lightbox every time someone flicks the rail along.
  const down = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(null), []);

  // Escape closes, and the page underneath must not scroll away behind it.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const shot = open === null ? null : stories.items[open];

  /**
   * One pass of the eight photos.
   *
   * Rendered twice — the second copy is what makes the loop seamless — so
   * `aria-hidden` is set on the duplicate and only the first pass is
   * announced. `i` is the index into the real list either way, so both
   * copies of a photo open the same one.
   */
  const track = (duplicate = false) => (
    <div className="flex shrink-0 gap-4 pr-4" {...(duplicate ? { "aria-hidden": true } : {})}>
      {stories.items.map((item, i) => (
        <button
          key={`${item.src}-${duplicate ? "b" : "a"}`}
          type="button"
          tabIndex={duplicate ? -1 : 0}
          aria-label={`Открыть фото: ${item.alt}`}
          onPointerDown={(e) => {
            down.current = { x: e.clientX, y: e.clientY };
          }}
          onClick={(e) => {
            // A drag of more than a few pixels was a swipe, not a tap.
            const start = down.current;
            down.current = null;
            if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 10) return;
            setOpen(i);
          }}
          className="group w-[70vw] shrink-0 cursor-zoom-in snap-center sm:w-[46vw] md:w-[300px]"
        >
          <div className="tile-zoom overflow-hidden rounded-[20px] border border-white/12 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)] transition-shadow duration-500 group-hover:shadow-[0_30px_70px_-30px_rgb(var(--c-accent)/0.5)]">
            <MediaFrame
              ratio={9 / 16}
              src={item.src}
              label={item.alt}
              objectPosition={item.focus}
              tone="ink"
              rounded={false}
            />
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div
        // `overflow-x: auto` is the touch behaviour and the safe default;
        // a pointer device switches it to clipped so the drift has
        // something to run inside. Either way nothing escapes the band.
        className="rail-mask -mx-5 overflow-x-auto px-5 [scrollbar-width:none] [@media(hover:hover)]:overflow-hidden [&::-webkit-scrollbar]:hidden"
      >
        <div className="stories snap-x snap-mandatory" data-paused={open === null ? "0" : "1"}>
          {track()}
          {track(true)}
        </div>
      </div>

      {shot &&
        mounted &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={shot.alt}
            onClick={close}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
          >
            {/* The photo at its own proportions, not the rail's 9:16 crop —
                the point of opening it is to see the part the rail cut. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shot.src}
              alt={shot.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88svh] max-w-full cursor-zoom-out rounded-[20px] object-contain shadow-[0_60px_140px_-60px_rgb(var(--c-accent)/0.7)]"
            />

            <button
              type="button"
              onClick={close}
              aria-label="Закрыть"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/12 text-white backdrop-blur-sm transition-colors hover:bg-white/25 sm:right-6 sm:top-6"
            >
              <svg viewBox="0 0 16 16" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="m3.5 3.5 9 9M12.5 3.5l-9 9" strokeLinecap="round" />
              </svg>
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
