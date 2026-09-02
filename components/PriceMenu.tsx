"use client";

import { useState } from "react";
import { offer, pricing } from "@/content/viart";

/**
 * The price list, as its own band in the middle of the page.
 *
 * It started life squeezed under the hero, which was the wrong place for
 * it twice over: it pushed the opening composition off the screen, and a
 * hundred-and-something prices behind a 112px scroller is not a price
 * list, it is a peephole.
 *
 * Here it is a single narrow column — about 720px, roughly half the width
 * it was — with the rows scrolling inside a fixed box. A narrow column is
 * what makes a price row readable: name on the left, figure on the right,
 * and no lane of empty space between them. The tabs and the two calls to
 * action sit outside the scroller, so they never scroll away.
 *
 * Two axes, as segmented controls: who it is for, and what kind of thing
 * you are buying. Four zone groups × two audiences, four named courses ×
 * two audiences, and one massage list shared by both — the same ranging
 * the studio uses elsewhere.
 *
 * Note on hiding: panels are switched by *not rendering* the inactive
 * ones. The earlier version used the `hidden` attribute, which is a UA
 * `display: none` — any author `display` wins over it, so a `hidden`
 * element carrying `grid` stayed on screen and the second tab appeared
 * dead. Anything hidden here must never also carry a display utility.
 */
export function PriceMenu() {
  const [audience, setAudience] = useState<"women" | "men">("women");
  const [view, setView] = useState("zones");

  const groups = pricing.zones[audience];
  const courses = pricing.complexes[audience];

  return (
    <div className="relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] border border-white/12 bg-white/[0.045] p-5 backdrop-blur-xl sm:p-7">
      {/*
        The offer, at the head of the panel.

        This is the plate the brief asks for in the services header: one
        line, in the accent, directly above the controls, so the discount
        is on screen at the moment a figure is being read rather than only
        in the band heading someone has already scrolled past.
      */}
      <p className="mx-auto mb-5 w-fit rounded-full border border-lav/30 bg-lav/10 px-4 py-1.5 text-center text-cap font-medium text-lav-soft">
        {offer}
      </p>

      {/*
        Controls, centred.

        Both rows sit on the container's horizontal centre — the two
        questions in the order a visitor asks them, stacked and centred
        rather than ranged left. On a phone the second row is wider than
        the panel, so it becomes a sideways strip that starts at the left
        edge (`justify-start`) and re-centres itself the moment it fits
        (`sm:justify-center`); a centred row that overflows is a row whose
        first tab is cut off, which is worse than one that scrolls.
      */}
      <div className="flex flex-col items-center gap-3 border-b border-white/10 pb-5">
        <Segmented
          label="Кому"
          options={pricing.audiences}
          value={audience}
          onChange={(id) => setAudience(id as "women" | "men")}
        />
        <Segmented label="Что смотреть" options={pricing.views} value={view} onChange={setView} subtle />
      </div>

      {/* One box, scrolled inside itself: the band's height no longer
          depends on which tab is open, and the longest list (women's
          zones, twenty-one rows) costs the same as the shortest.
          Capped against the viewport as well as in pixels — 420px of
          list inside a 640px phone screen leaves the panel's own two
          buttons off the bottom of it. */}
      <div className="mt-5 h-[min(58vh,420px)] scroll-smooth overflow-y-auto overscroll-contain pr-2 [scrollbar-color:rgb(var(--c-cream)/0.3)_transparent] [scrollbar-width:thin]">
        {view === "zones" && (
          <div className="space-y-8">
            {groups.map((group) => (
              <section key={group.title}>
                {/* Centred, like every other head on the site. The rows
                    under it stay name-left / figure-right — that is what
                    makes a price row readable — but the group's own name
                    is a heading and sits on the column's centre. */}
                <h3 className="text-center text-h3 font-semibold text-lav-soft">{group.title}</h3>
                <dl className="mt-4">
                  {group.items.map(([name, price]) => (
                    <PriceRow key={name} name={name} price={price} />
                  ))}
                </dl>
              </section>
            ))}
          </div>
        )}

        {view === "complexes" && (
          <div className="space-y-4">
            {courses.map((course, i) => (
              <article
                key={course.name}
                className="card-lift flex flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-cap tabular-nums text-lav-soft/85">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-h3 font-semibold text-white">{course.name}</h3>
                </div>
                <p className="mt-2 flex-1 text-body text-white/76">{course.detail}</p>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-cap text-white/54">Обычная цена</p>
                    <s className="text-body text-white/58 decoration-white/40">{course.price}</s>
                  </div>
                  <div className="text-right">
                    <p className="text-cap text-lav-soft">Первое посещение</p>
                    <p className="text-h3 font-semibold tabular-nums text-white">
                      {course.firstVisitPrice}
                    </p>
                  </div>
                </div>
                <a
                  href={pricing.primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn mt-5 inline-flex items-center justify-center rounded-full bg-lav px-5 py-2.5 text-body font-medium text-ink [&::before]:bg-white"
                >
                  {pricing.bookLabel}
                </a>
              </article>
            ))}
          </div>
        )}

        {view === "massage" && (
          <dl>
            {pricing.massage.map(([name, price]) => (
              <PriceRow key={name} name={name} price={price} />
            ))}
          </dl>
        )}
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-6">
        <a
          href={pricing.primary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn inline-flex items-center justify-center rounded-full bg-lav px-7 py-3.5 text-body font-medium text-ink [&::before]:bg-white"
        >
          {pricing.primary.label}
        </a>
        <a
          href={pricing.secondary.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn inline-flex items-center justify-center rounded-full border border-white/40 px-7 py-3.5 text-body font-medium text-white hover:text-ink [&::before]:bg-white"
        >
          {pricing.secondary.label}
        </a>
        <p className="w-full text-center text-cap text-white/58">{pricing.note}</p>
      </div>
    </div>
  );
}

/**
 * One priced line, with its own way to book.
 *
 * Every row carries the action, not just the four course cards. A price
 * list that answers "what does this cost" and then makes you scroll back
 * to a single button at the bottom is asking the visitor to hold the
 * answer in their head while they go looking; the link belongs beside the
 * figure they just read.
 *
 * The link is quiet by design — it is repeated twenty-one times on the
 * longest tab, and twenty-one filled buttons would be a wall.
 */
function PriceRow({ name, price }: { name: string; price: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-white/10 py-3">
      {/*
        The name may shrink, but not below a readable column, and that
        floor is what makes the row work on a phone.

        Almost every figure here is four characters wide, and against
        those a name that shrinks to fit is the right behaviour. One is
        not: «первое посещение 1 500 ₽, далее 2 500 ₽» on the massage tab
        is a whole sentence in the price column, and it is wider than a
        390px phone leaves inside this panel. With the name free to
        shrink to nothing, the row honoured the figure and crushed
        «Вибромассаж TURBO G8 «Коррекция фигуры»» into a stack of single
        letters — and still ran off the right-hand edge.

        A 9rem floor under the name means that row can no longer be
        satisfied on one line, so it wraps at the flex level instead: the
        name keeps its column, the sentence drops underneath it and ranges
        right, and both are read whole. Every other row is unchanged —
        they fit, so they never reach the floor.
      */}
      <dt className="min-w-[9rem] flex-1 text-body text-white/84">{name}</dt>
      <dd className="ml-auto max-w-full shrink-0 text-right text-body font-semibold tabular-nums text-white">
        {price}
      </dd>
      <a
        href={pricing.primary.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${pricing.bookLabel}: ${name}`}
        // Hidden on the narrowest phones: below ~400px the name, the figure
        // and a button do not fit on one line, and the panel's own two
        // calls to action are a thumb's reach away regardless.
        className="hover-fade hidden shrink-0 rounded-full border border-white/25 px-3 py-1 text-cap text-white/80 transition-colors hover:border-lav hover:text-white sm:inline-flex"
      >
        {pricing.bookLabel}
      </a>
    </div>
  );
}

/**
 * A pill-shaped segmented control. The selected pill carries the fill.
 *
 * The whole of this component is about one thing: on a phone, all three
 * tabs have to be on screen. «Лазерная эпиляция · Комплексы эпиляции ·
 * Аппаратный массаж» is about 460px of pill against the roughly 300px a
 * 390px phone leaves inside the panel, and the third tab was the one that
 * paid for it — first by wrapping out of the row, then by sitting off the
 * right-hand end of a sideways strip. Either way the massage prices had no
 * visible way in, and a tab nobody can see is a tab nobody presses.
 *
 * Two things fix it. Each option carries a `short` label that the phone
 * shows in place of the full one (`content/viart.ts`), and the tabs divide
 * the row into equal columns instead of each taking its own width — so
 * three tabs come out as three tabs, all of them on screen, however long
 * the words are. From `sm` up the control hugs its content in the middle of
 * the panel again, with the labels written out in full.
 *
 * The two layers behind that each have one job. The inner one is the pill:
 * full width, but never narrower than its own content (`min-w-fit`), so on
 * a screen too narrow even for the short labels it keeps them legible
 * rather than crushing them. The outer one is the scroll track that catches
 * that case — it hides its scrollbar and stays ranged left below `sm`,
 * because a centred row that overflows hides its *first* tab off the left
 * edge, where nothing suggests it exists.
 */
function Segmented({
  label,
  options,
  value,
  onChange,
  subtle = false,
}: {
  label: string;
  options: readonly { id: string; label: string; short?: string }[];
  value: string;
  onChange: (id: string) => void;
  subtle?: boolean;
}) {
  return (
    <div className="no-scrollbar -mx-1 flex w-full justify-start overflow-x-auto px-1 sm:justify-center">
      <div
        role="tablist"
        aria-label={label}
        className={`flex w-full min-w-fit flex-nowrap rounded-full p-1 sm:w-auto ${
          subtle ? "bg-white/[0.06]" : "bg-white/10 ring-1 ring-white/10"
        }`}
      >
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(o.id)}
              // `px-1.5` below `sm` is not cosmetic: it is what keeps the
              // pill's own min-content width inside the track on a 320px
              // screen, where the three short labels and 4px more padding
              // each come to a couple of pixels over and clip the last tab.
              // Above `sm` the tabs are laid out by `flex-1` anyway, so the
              // narrower padding costs nothing there.
              className={`flex-1 whitespace-nowrap rounded-full px-1.5 py-2 text-cap font-medium transition-all duration-300 sm:flex-none sm:px-4 ${
                active
                  ? "bg-lav text-ink shadow-[0_8px_20px_-10px_rgb(var(--c-accent)/0.7)]"
                  : "text-white/68 hover:text-white"
              }`}
            >
              {/* Same button, two lengths of label: the phone gets the
                  short one, `sm` and up gets the written-out one. */}
              <span className="sm:hidden">{o.short ?? o.label}</span>
              <span className="hidden sm:inline">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
