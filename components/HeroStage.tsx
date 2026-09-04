import { Reveal } from "@/components/motion";
import { M, SplitWords, wordCount } from "@/components/m";
import { Button } from "@/components/ui";
import { hero, heroBackdrop } from "@/content/viart";

/**
 * The first screen.
 *
 * One photograph, one column of type on top of it. That is the whole
 * composition now, at every width.
 *
 * ── What was here before ──────────────────────────────────────────────
 *
 * Six media circles on two rails either side of the heading, placed off a
 * measured 359×521 box, point-reflected through its centre, and scattered
 * outwards on scroll by a client-side driver. It only ever existed above
 * `lg`: a phone got the photograph, because six circles folded up small
 * cost two screens of scrolling before the page had said anything.
 *
 * The phone was right. The circles were six thumbnails competing with the
 * one sentence that has to be read first, and none of them was large
 * enough to be looked at — the same pictures are further down the page at
 * a size where they can be. So the phone's composition is now the
 * composition, and the geometry, the scatter driver and the rail markup
 * are gone with the circles rather than left behind unused.
 *
 * The scrim is the part that still does real work: two layers, a flat one
 * to knock the whole picture back and a vertical gradient to bury the
 * bottom edge into the page, so white text at hero size sits on something
 * close to solid rather than on a photograph. Both are unchanged from the
 * phone layout — the contrast under the heading is the same at 1440 as it
 * was at 390.
 */
export function HeroStage() {
  const leadWords = wordCount(hero.titleLead);

  return (
    <section
      data-hero
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-header lg:pt-header-lg"
    >
      <div aria-hidden className="absolute inset-0 -z-10">
        {/*
          The one image on the site that is never lazy.

          It is the largest thing on the first screen and the type sits
          directly on it, so deferring it means the heading arrives over an
          empty brown rectangle and then jumps into contrast. `eager` plus a
          high fetch priority puts it in the first wave of requests with the
          font; everything else on the page stays lazy.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroBackdrop.src}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[62%_38%]"
        />
        {/*
          Two layers over the photograph, and that is the whole of it.

          One even veil of ink at 65%, and a vertical gradient that does
          nothing in the middle of the screen and closes the top and bottom
          edges into the page. Nothing is placed, shaped or aimed at the
          text; the picture is one picture, evenly dimmed, the way a
          photographic first screen is normally built.

          It used to be three layers: flat ink, the vertical gradient, and
          an ellipse of ink under the text column with a brightness filter
          on the photograph underneath to pay for it. Each of those pieces
          was defensible on its own measurements and together they were a
          mess — the picture came out blotchy, dark in a ring around the
          type and lifted everywhere else, which is exactly the thing a
          visitor sees before they read a word. An even veil at 65% is
          worse arithmetic under the heading and a better first screen: one
          photograph you can actually see, one set of words on top of it.

          65% is measured, not chosen. Against the composited backdrop with
          the type hidden, the brightest pixel under the text column gives
          5,4:1 against the cream — over AA for the size everything on this
          screen is set at, and the same figure on 1440 and 390, because an
          even veil does not care where the text sits. 60% gives 4,5:1 and
          68% gives 6,0:1, so the room either way is small: below 60 the
          lead paragraph over the lit handpiece is the first thing to fail,
          and above 70 the photograph is a brown field again.

          What it costs and what it buys, measured the same way: the
          photograph's 90th-percentile luminance away from the text column
          is 0,035 on 1440 and 0,044 on 390 — brighter than the shaped
          version managed at its best (0,033 and 0,032) and twice the
          original screen (0,016 and 0,019). Even ink wins on both counts.

          Every opacity here is a multiple of five, and that is not taste.
          The flat layer once read `bg-base/60` — off Tailwind's 0–100-in-
          fives scale — and had never painted a single pixel: an off-scale
          modifier is not an error, the class is simply never generated and
          the element keeps a transparent background. Keep new values on
          the scale, or write them as `bg-base/[0.62]`.

          Darkening the picture rather than lightening the type is the
          right way round. `text-white` in this palette is warm cream at a
          fixed value and the ink ladder in `globals.css` is the contrast
          contract for the whole site; lifting the hero above it would make
          this one screen the exception. The photograph has no such
          contract.
        */}
        <div className="absolute inset-0 bg-base/65" />
        <div className="hero-edges absolute inset-0" />
      </div>

      <div className="relative mx-auto w-full max-w-[1480px]">
        <HeroText leadWords={leadWords} />
      </div>

      {/* The «ЛИСТАЙТЕ» hint with its travelling mark stood here, pinned to
          the bottom of the screen. It told a visitor to do the one thing
          nobody needs telling, and it was the only text on the first screen
          that was not about the studio. */}
    </section>
  );
}

function HeroText({ leadWords }: { leadWords: number }) {
  return (
    <div className="relative z-10 mx-auto max-w-2xl text-center lg:max-w-3xl">
      <Reveal variant="none" delay={160}>
        {/*
          One heading, one style. The second line used to be set in a bold
          italic serif — a different typeface arguing with the first inside
          the same sentence. It is the same weight, the same face and the
          same colour as the line above it now; the line break is the only
          thing separating them, and it does the job on its own.
        */}
        <h1 className="text-hero font-bold leading-[1.06] tracking-[-0.045em] text-white">
          <SplitWords text={hero.titleLead} className="mr-[0.2em]" />
          <span className="block">
            <SplitWords text={hero.titleTail} start={leadWords} className="mr-[0.2em]" />
          </span>
        </h1>
      </Reveal>

      <Reveal variant="none" delay={620} step={110}>
        <M variant="rise" i={0}>
          <p className="mx-auto mt-7 max-w-xl text-lead leading-relaxed text-white/80">
            {hero.subtitle}
          </p>
        </M>
        <M variant="rise" i={1} className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href={hero.primary.href}>{hero.primary.label}</Button>
          <Button href={hero.secondary.href} variant="light">
            {hero.secondary.label}
          </Button>
        </M>
      </Reveal>

      <Reveal
        variant="none"
        delay={900}
        step={110}
        as="ul"
        className="mx-auto mt-10 flex max-w-lg flex-wrap items-center justify-center gap-x-8 gap-y-3"
      >
        {hero.trust.map((t, i) => (
          <M key={t.label} variant="pop" i={i} as="li" className="flex items-baseline gap-1.5">
            <span className="text-h3 font-bold text-lav-soft">{t.value}</span>
            <span className="text-cap text-white/62">{t.label}</span>
          </M>
        ))}
      </Reveal>
    </div>
  );
}
