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
          className="hero-photo h-full w-full object-cover object-center"
        />
        {/*
          A photograph, graded, with a light veil on it. Nothing else.

          The picture is the point of this screen, so the ink is as thin as
          the words allow: a flat 45% and a vertical gradient that paints
          nothing between 22% and 74% of the height and only closes the top
          and bottom edges into the page. Most of the work that ink used to
          do is done by the grade instead — `contrast(.75) brightness(.8)
          saturate(1.15)` on `.hero-photo`. Ink flattens a photograph
          evenly and takes the room with it; lowering contrast takes the
          range out of the highlights, which is where the trouble is. The
          saturate is for the gloves: 45% of espresso over a pink turns it
          brown, and a step of colour back is cheaper than less ink.

          Three earlier versions of this screen are worth not repeating.
          Three layers with an ellipse of ink under the text column and
          brightness(2.4) under that — every piece measured, and the result
          read as blotches, because a shaped scrim is visible as a shape.
          One honest even veil at 65% — defensible, and too dark to see the
          room through. And the same grade over a shot of the handpiece on
          skin, where the metal's speculars set the worst pixel under the
          type at 2,5:1 on a phone.

          This frame has no speculars, and that is why it is set the
          lightest of the three. Broad bounced light makes large even
          highlights — a wall, an arm, the white housing — and even tones
          take a grade calmly. Measured on the composited backdrop with the
          type hidden: the worst single pixel under the text column is
          5,9:1 against the cream on 1440 and 5,3:1 on 390, the 95th
          percentile 6,7:1 and 6,3:1, the median near 11:1. That is the
          best contrast this screen has measured *and* the brightest
          picture — 0,073 and 0,044 at the 90th percentile away from the
          text, against 0,016 and 0,019 on the first version.

          The crop is dead centre, which is unusual here and is the frame's
          doing: the gel, the spatula and the machine's screen all sit in
          the middle band of a 853×1280 portrait, so the third of it a
          1440×900 hole shows is the third that says what is happening.

          Every opacity here is a multiple of five, and that is not taste.
          The flat layer once read `bg-base/60` — off Tailwind's 0–100-in-
          fives scale — and had never painted a single pixel: an off-scale
          modifier is not an error, the class is simply never generated and
          the element keeps a transparent background. Keep new values on
          the scale, or write them as `bg-base/[0.62]`.

          Darkening the picture rather than lightening the type is the
          right way round. `text-white` in this palette is warm cream at a
          fixed value — the brightest ink the site has, and the hero's lead
          is set in it flat, with no opacity under it. There is nothing
          left to lift on the type side; the photograph is the only side
          with a knob on it.
        */}
        <div className="absolute inset-0 bg-base/45" />
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
          <p className="mx-auto mt-7 max-w-xl text-lead leading-relaxed text-white">
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
