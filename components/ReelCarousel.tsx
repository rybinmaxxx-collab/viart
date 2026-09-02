"use client";

import { useEffect, useRef, useState } from "react";
import { M } from "@/components/m";
import { VideoTile } from "@/components/VideoTile";

/**
 * The three studio reels: a gallery on a phone, a row on everything else.
 *
 * ── Why a phone gets one clip at a time ────────────────────────────────
 *
 * The row started as three columns, which is 117px a frame on a 390px
 * screen — too small to see what is in the clip and too small to hit the
 * sound button. That was answered with a swipe strip at 62vw, and it was
 * better, but 62vw is still a row: three thin verticals side by side,
 * none of them the one you are looking at, and no sign of where you are
 * in them.
 *
 * So below `md` this is a gallery. One clip fills four-fifths of the
 * screen and sits on the centre snap point, its neighbours show a finger's
 * width at either edge — which is the only thing that says there is more
 * to swipe to — and a row of dots under it says which of the three you are
 * on and moves you to any other. From `md` up the scroller is a plain grid
 * of three again and the dots are gone; nothing about the desktop row
 * changes.
 *
 * The clips are rendered exactly once, at every width. Rendering a phone
 * gallery and a desktop row separately and hiding one would mean six
 * `<video>` elements on the page, three of them decoding for nobody.
 *
 * One thing this deliberately is not: an endless loop. Swiping past the
 * last clip does not wrap round to the first — a scroller that jumps back
 * to the start under your finger loses the visitor's place, and with three
 * items a dot is one tap away from any of them anyway.
 */
export function ReelCarousel({
  clips,
}: {
  clips: readonly { src: string; poster?: string; label: string; caption?: string }[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /**
   * Which slide is on the centre line.
   *
   * Read off the scroll position rather than from a snap event:
   * `scrollsnapchange` is not everywhere yet, and a dot that lags behind
   * the clip it points at is worse than no dot. Coalesced into one frame,
   * so a fast swipe costs one measurement per paint and not one per event.
   */
  useEffect(() => {
    const el = track.current;
    if (!el) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = el.scrollLeft + el.clientWidth / 2;
      let nearest = 0;
      let best = Infinity;
      Array.from(el.children).forEach((node, i) => {
        const slide = node as HTMLElement;
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
        if (distance < best) {
          best = distance;
          nearest = i;
        }
      });
      setActive(nearest);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const go = (i: number) => {
    const el = track.current;
    const slide = el?.children[i] as HTMLElement | undefined;
    if (!el || !slide) return;
    // Centred, not left-aligned: the slides are narrower than the track and
    // the snap points they sit on are centre points.
    el.scrollTo({
      left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {/*
        `relative` is load-bearing: the offsets above are read through
        `offsetLeft`, which is measured from the nearest positioned
        ancestor. Without it they would be measured from somewhere further
        up the page and every scroll target would be wrong.

        The padding at either end is half of what a slide leaves over
        (100vw − 80vw), so the first and the last clip can reach the centre
        of the screen like the middle one does.
      */}
      <div
        ref={track}
        className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-[10vw] px-[10vw] pb-2 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 md:pb-0"
      >
        {clips.map((clip, i) => (
          <M
            key={clip.label}
            variant="rise"
            i={i}
            duration={950}
            className="w-[80vw] shrink-0 snap-center md:w-auto"
          >
            <VideoTile src={clip.src} poster={clip.poster} label={clip.label} caption={clip.caption} />
          </M>
        ))}
      </div>

      {/* Where you are, and a way to anywhere else. Phone only — above
          `md` all three clips are on screen at once and a dot would be
          pointing at something already in front of you. */}
      <div className="mt-5 flex items-center justify-center gap-2 md:hidden">
        {clips.map((clip, i) => (
          <button
            key={clip.label}
            type="button"
            onClick={() => go(i)}
            aria-label={`Показать ролик: ${clip.caption ?? clip.label}`}
            aria-current={i === active}
            // The dot is 6px tall and the button is 24: a mark small
            // enough to be a mark still has to be big enough to hit.
            className="flex h-6 items-center px-1"
          >
            <span
              aria-hidden
              className={`block h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-lav" : "w-1.5 bg-white/25"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
