"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { motionReady, reveal, watch } from "@/lib/motion";
import type { Variant } from "@/components/m";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * A block that reveals itself when it scrolls into view.
 *
 * One of these per meaningful group — a heading, a row of cards, a panel —
 * never one per element. Children stagger off it with `<M i={n}>`.
 */
export function Reveal({
  variant = "rise",
  delay = 0,
  step,
  duration,
  className = "",
  children,
  as: Tag = "div",
  style,
  id,
}: {
  variant?: Variant | "slab";
  /** Milliseconds before this block starts. */
  delay?: number;
  /** Milliseconds between staggered children. */
  step?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
  as?: "div" | "section" | "article" | "ul" | "dl" | "header" | "footer" | "figure";
  style?: CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    motionReady();
    const el = ref.current;
    if (!el) return;
    return watch(el, () => reveal(el));
  }, []);

  const vars: Vars = { ...(style as Vars) };
  if (delay) vars["--delay"] = `${delay}ms`;
  if (step) vars["--step"] = `${step}ms`;
  // Set directly, not through a variable: custom properties inherit, and a
  // block's duration must not silently become every descendant's duration.
  if (duration) vars.transitionDuration = `${duration}ms`;

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      id={id}
      data-m={variant}
      className={className}
      style={vars}
    >
      {children}
    </Tag>
  );
}

/**
 * A figure that counts up to its value when it comes into view.
 *
 * The server renders the finished number, so the fact is present with or
 * without script; the layout effect resets it to zero before the browser
 * paints, which is what keeps the count from flashing its own answer.
 */
export function CountUp({
  to,
  decimals = 0,
  duration = 1500,
  className = "",
  suffix = "",
}: {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (v: number) => v.toFixed(decimals).replace(".", ",");

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.getAttribute("data-motion") !== "on") return;

    el.textContent = format(0) + suffix;

    return watch(el, () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // Same deceleration as the reveals, so figures land with the block.
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = format(to * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, decimals, duration, suffix]);

  return (
    <span ref={ref} className={`tnum ${className}`}>
      {format(to)}
      {suffix}
    </span>
  );
}

/**
 * Scroll-linked vertical drift.
 *
 * Writes a CSS variable rather than restyling on every frame, and only
 * while the element is anywhere near the viewport.
 */
export function Parallax({
  amount = 60,
  className = "",
  children,
}: {
  /** Total travel across a full pass through the viewport, in px. */
  amount?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.getAttribute("data-motion") !== "on") return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const h = window.innerHeight;
      if (r.bottom < -200 || r.top > h + 200) return;
      // -1 below the fold, +1 above it.
      const p = 1 - (r.top + r.height / 2) / (h / 2 + r.height / 2);
      el.style.setProperty("--py", `${(p * amount).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [amount]);

  return (
    // The travel is mirrored into an attribute so the rendered markup says
    // what it does — handy when reading the DOM, and what the static
    // preview reads to reproduce the effect without React.
    <div ref={ref} data-amount={amount} className={`parallax ${className}`}>
      {children}
    </div>
  );
}

/**
 * Accordion.
 *
 * Built on buttons rather than `<details>` so it can animate in both
 * directions — a `<details>` drops its content the instant `open` is
 * removed, which makes closing a jump cut. The answer stays in the DOM
 * either way (collapsed to zero rows, not unmounted), so it is still
 * indexable and still reachable by search-in-page.
 */
export function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: { q: string; a: string }[];
  /** Index open on arrival, or -1 for none. */
  defaultOpen?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-6 py-5 text-left"
              >
                <span
                  className={`text-h3 font-semibold transition-colors duration-300 ${
                    isOpen ? "text-lav-soft" : "text-white"
                  }`}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={`relative mt-1.5 h-4 w-4 shrink-0 transition-transform duration-500 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                >
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-lav-soft" />
                  <span
                    className={`absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-lav-soft transition-opacity duration-300 ${
                      isOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`max-w-2xl pb-6 pr-10 text-body text-white/84 transition-opacity duration-300 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * The page's spine: a hairline rail down the left edge that fills with
 * scroll progress. It is the one element that ties the bands together
 * visually, which is most of what stops them reading as a stack.
 */
export function ScrollRail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.body.scrollHeight - window.innerHeight;
      el.style.setProperty("--progress", max > 0 ? String(Math.min(1, window.scrollY / max)) : "0");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-3 top-1/2 z-[2] hidden h-[42vh] w-px -translate-y-1/2 bg-white/15 xl:block"
    >
      <div ref={ref} className="rail-fill h-full w-full bg-lav" />
    </div>
  );
}

/**
 * Booking pill that arrives once the hero is behind you.
 *
 * The header CTA scrolls away; on a page this long the offer should not
 * have to be scrolled back to.
 */
export function StickyCta({ href, label }: { href: string; label: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      // Out of the way of the footer's own call to action.
      setShown(y > window.innerHeight * 0.9 && y < max - 400);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={!shown}
      tabIndex={shown ? 0 : -1}
      className={`fixed bottom-5 right-5 z-[3] inline-flex items-center gap-2 rounded-full bg-lav px-6 py-3.5 text-body font-medium text-ink shadow-[0_16px_40px_-12px_rgb(var(--c-accent)/0.6)] transition-all duration-500 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      {/* The pulse is espresso on gold, not cream: the pill is a light
          surface now, and a cream dot on it is invisible. */}
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
      </span>
      {label}
    </a>
  );
}
