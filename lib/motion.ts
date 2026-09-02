/**
 * The one piece of scheduling behind every reveal on the site.
 *
 * A single IntersectionObserver serves the whole page, so a section of
 * twelve cards costs one entry rather than twelve. Two things guard the
 * only failure that actually matters — content that never appears:
 *
 *   1. A scroll/resize fallback re-tests pending elements geometrically.
 *      Observers have been seen not to deliver for individual nodes; a
 *      bounding-rect test cannot miss in the same way.
 *   2. `motionReady()` tells the inline bootstrap script that hydration
 *      happened. If it never does, that script strips `data-motion` and
 *      the armed CSS stops applying — the page renders plainly instead of
 *      staying blank.
 */

const pending = new Set<HTMLElement>();
const callbacks = new WeakMap<HTMLElement, () => void>();

let io: IntersectionObserver | null = null;
let listening = false;
let frame = 0;

function fire(el: HTMLElement) {
  if (!pending.has(el)) return;
  pending.delete(el);
  io?.unobserve(el);
  callbacks.get(el)?.();
  callbacks.delete(el);
  if (pending.size === 0) stopListening();
}

function sweep() {
  frame = 0;
  const h = window.innerHeight;
  for (const el of Array.from(pending)) {
    const r = el.getBoundingClientRect();
    // Visible, or scrolled past — either way it has had its moment.
    if (r.top < h * 0.94 && r.bottom > 0) fire(el);
  }
}

function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(sweep);
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
}

function observer() {
  if (io) return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) fire(e.target as HTMLElement);
      }
    },
    // A hair of the element is enough. No negative bottom margin: an
    // element at the very end of the page has no scroll left to clear one.
    { threshold: 0.06 }
  );
  return io;
}

/** Run `cb` once, when `el` first comes into view. Returns a cleanup. */
export function watch(el: HTMLElement, cb: () => void): () => void {
  callbacks.set(el, cb);
  pending.add(el);
  observer().observe(el);
  startListening();
  // Elements already on screen at mount (the hero) should play at once
  // rather than wait for a scroll that may never come.
  requestAnimationFrame(sweep);

  return () => {
    if (pending.delete(el)) io?.unobserve(el);
    callbacks.delete(el);
    if (pending.size === 0) stopListening();
  };
}

/** Marks a block revealed. */
export function reveal(el: HTMLElement) {
  el.dataset.shown = "true";
}

declare global {
  interface Window {
    __viartMotionReady?: boolean;
  }
}

/** Tells the bootstrap script that React took over; cancels its failsafe. */
export function motionReady() {
  if (typeof window !== "undefined") window.__viartMotionReady = true;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Bootstrap, inlined into <head> so it runs before first paint.
 *
 * Arms the motion system only when motion is welcome, and disarms it
 * wholesale if hydration has not happened within a couple of seconds.
 */
export const MOTION_BOOTSTRAP = `
(function(){
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var d = document.documentElement;
    d.setAttribute('data-motion','on');
    setTimeout(function(){
      if (!window.__viartMotionReady) d.removeAttribute('data-motion');
    }, 2500);
  } catch (e) {}
})();
`.trim();
