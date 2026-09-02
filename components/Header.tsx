"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { nav, site, announce, offer } from "@/content/viart";

/**
 * Fixed header overlaying the hero.
 *
 * Transparent over the hero, then it condenses: the announcement strip
 * rolls up and a tinted, blurred bar takes its place. That change is the
 * page's first piece of feedback that scrolling does something — and it
 * buys back 60px of viewport for the rest of the site.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setCondensed(window.scrollY > 80);
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

  // Close the mobile menu on navigation away from the current viewport width.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, [open]);

  /**
   * Anchor navigation, and the bug it exists to kill.
   *
   * Tapping «Услуги и цены» used to do this: the browser handled the
   * `href` itself and jumped the page instantly, while the menu was still
   * open and still covering the screen — so the section it had just
   * scrolled to was underneath the overlay. The menu then closed on the
   * next tap, revealing the section stranded somewhere mid-screen. Three
   * things were wrong at once, and all three are fixed here:
   *
   *   · The close is *synchronous with the tap*. `setOpen(false)` runs
   *     first, in the same handler, before anything scrolls.
   *   · The browser's own jump is cancelled and replaced with one smooth
   *     `scrollIntoView`, started on the next frame — after React has
   *     painted the collapsed overlay, so the scroll never races the
   *     close animation for the same pixels.
   *   · Where it lands is decided by `scroll-margin-top` on the section
   *     itself (see globals.css), not by arithmetic here, so every anchor
   *     on the site clears the fixed header by the same amount.
   *
   * The overlay never locked `body` scroll, and it still does not: a lock
   * released in the same tick as a smooth scroll is the other classic way
   * to make the landing position wrong.
   *
   * Anything that is not a same-page anchor — `/masters`, `/faq`, or
   * `/#prices` read from another page — is left entirely to the browser.
   */
  const goTo = useCallback((e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);

    const hash = href.startsWith("/#") ? href.slice(1) : href.startsWith("#") ? href : null;
    if (!hash) return;
    // `/#prices` from /faq is a real navigation, not a scroll.
    if (href.startsWith("/#") && window.location.pathname !== "/") return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;

    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      // The address bar follows, but without `location.hash =`, which
      // would perform a second, instant jump of its own.
      history.replaceState(null, "", hash);
    });
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[4]">
      <div
        className={`transition-all duration-500 ${
          condensed ? "border-b border-white/10 bg-ink/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-band items-center justify-between px-5 transition-all duration-500 ${
            condensed ? "py-3" : "py-5"
          }`}
        >
          <a href="/" className="text-h3 font-bold tracking-[-0.04em] text-white">
            {site.name}
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => goTo(e, item.href)}
                className="group relative text-body font-medium text-white/88 transition-colors hover:text-white"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-lav-soft transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.booking}
              target="_blank"
              rel="noopener noreferrer"
              className="btn hidden rounded-full bg-lav px-5 py-2.5 text-body font-medium text-ink [&::before]:bg-white sm:inline-flex"
            >
              Записаться
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Меню"
              className="hover-fade rounded-full border border-white/30 px-4 py-2 text-cap font-medium text-white lg:hidden"
            >
              {open ? "Закрыть" : "Меню"}
            </button>
          </div>
        </div>
      </div>

      {/*
        The offer, hung under the bar rather than stretched across the top
        of the window.

        It used to be a full-bleed strip above everything, which made it
        the first thing on the page and the widest. As a pill inset to the
        same column as the navigation it reads as part of the header — it
        belongs to it, sits under it, and rolls up with it on scroll.
      */}
      <div
        className={`overflow-hidden px-5 transition-[max-height,opacity] duration-500 ${
          condensed ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
        }`}
      >
        {/*
          Measured against the reference's own strip: ~745px wide and ~21px
          tall. Ours was 964 × 44, which is why the lavender read as a slab
          of colour across the top of the page rather than an accent.
        */}
        <div className="mx-auto flex max-w-[760px] flex-col items-center justify-center gap-x-2 rounded-full bg-lav px-6 py-1 text-[13px] leading-[1.5] text-ink sm:flex-row">
          <span>{announce.text}</span>
          <a
            href={announce.href}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-fade font-medium underline underline-offset-4"
          >
            {announce.cta}
          </a>
        </div>
      </div>

      {/*
        Mobile menu: rolls open, items staggering down.

        The roll is a `max-height` transition on a block inside the fixed
        header, so it takes no space in the document and opening or
        closing it never moves the page under it — which is what lets the
        anchor scroll in `goTo` be started while the overlay is still
        collapsing without the two fighting over the landing position.

        Closing is quick on purpose: 500ms out was long enough to still
        be covering the section when a smooth scroll arrived.
      */}
      <div
        className={`overflow-hidden bg-ink/95 backdrop-blur-md transition-[max-height] lg:hidden ${
          // Tall enough for four items *and* the offer plate under them —
          // at `max-h-96` the plate was clipped by the panel's own edge
          // and the hero showed through the bottom of it.
          open ? "max-h-[32rem] duration-500" : "max-h-0 duration-200"
        }`}
      >
        <nav className="mx-auto max-w-band px-5 py-3">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => goTo(e, item.href)}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: `${open ? i * 55 : 0}ms` }}
              className={`block py-3 text-body font-medium text-white transition-all duration-300 ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
            >
              {item.label}
            </a>
          ))}

          {/*
            The offer, restated where the decision is actually made.

            On a phone the announcement pill under the bar is gone the
            moment the header condenses, so someone who opens the menu
            three screens down has no idea there is a discount. One line,
            in the accent, at the foot of the menu.
          */}
          <p
            style={{ transitionDelay: `${open ? nav.length * 55 : 0}ms` }}
            className={`mt-2 rounded-2xl border border-lav/30 bg-lav/10 px-4 py-3 text-cap font-medium text-lav-soft transition-all duration-300 ${
              open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
            }`}
          >
            {offer}
          </p>
        </nav>
      </div>
    </header>
  );
}
