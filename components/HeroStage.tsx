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
        <div className="absolute inset-0 bg-base/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-base via-base/25 to-base" />
      </div>

      {/* The ambient field carries the light for this screen as it does for
          every other; all this band adds is a floor, so the hero meets the
          band under it rather than butting against it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-56 bg-gradient-to-b from-transparent to-base"
      />

      <div className="relative mx-auto w-full max-w-[1480px]">
        <HeroText leadWords={leadWords} />
      </div>

      {/* Scroll hint. */}
      <Reveal
        variant="fade"
        delay={1500}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <span className="flex flex-col items-center gap-2 text-cap uppercase tracking-[0.2em] text-white/48">
          листайте
          <span className="h-8 w-px overflow-hidden bg-white/15">
            <span className="block h-3 w-px animate-[scroll-dot_2.6s_ease-in-out_infinite] bg-lav-soft" />
          </span>
        </span>
      </Reveal>
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
