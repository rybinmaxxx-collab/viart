"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Sandbox only. The thing the whole conversation is actually about: real
 * objects at three depths, travelling at three speeds as the page scrolls.
 *
 * The rule is one line — `offset = scroll × (1 − depth)`. Everything else
 * here is about paying for it honestly:
 *
 *  · one scroll listener for the whole set, not one per object;
 *  · the write is a `transform` on a promoted layer, nothing that forces
 *    layout;
 *  · `will-change` is set on the objects and only on the objects, so the
 *    compositor is not asked to hold the whole page;
 *  · nothing runs at all under `prefers-reduced-motion`, and the objects
 *    stay where the server put them.
 *
 * Objects are `<img>` with transparency. Squares with a photo in them do
 * not read as depth — a rectangle sliding over another rectangle reads as
 * a carousel. Cut-outs read as depth. That is the difference between this
 * looking like Firewatch and looking like a slideshow, and it is an art
 * problem, not a code one.
 */

export type Obj = {
  /** 0 = travels with the page, 1 = pinned at infinity. */
  depth: number;
  /** Where it sits, in viewport units. */
  top: string;
  left?: string;
  right?: string;
  width: string;
  src: string;
  /** Nearer things are lighter here, so the stack reads front-to-back. */
  opacity?: number;
  blur?: number;
  rotate?: number;
};

export function DepthLayer({ objects, children }: { objects: Obj[]; children?: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]"));
    let frame = 0;

    const paint = () => {
      frame = 0;
      const y = window.scrollY;
      for (const node of nodes) {
        const depth = Number(node.dataset.depth);
        const rotate = Number(node.dataset.rotate ?? 0);
        // The whole effect, in one expression.
        const dy = -y * (1 - depth);
        node.style.transform = `translate3d(0, ${dy.toFixed(1)}px, 0) rotate(${rotate}deg)`;
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [objects]);

  return (
    <div ref={host} aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {children}
      {objects.map((o, i) => (
        <img
          key={i}
          data-depth={o.depth}
          data-rotate={o.rotate ?? 0}
          src={o.src}
          alt=""
          style={{
            position: "absolute",
            top: o.top,
            left: o.left,
            right: o.right,
            width: o.width,
            opacity: o.opacity ?? 1,
            filter: o.blur ? `blur(${o.blur}px)` : undefined,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
