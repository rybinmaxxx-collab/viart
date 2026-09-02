import type { CSSProperties } from "react";
import { MediaFrame } from "@/components/MediaFrame";
import { Reveal } from "@/components/motion";
import { M, SplitWords, wordCount } from "@/components/m";
import { Button } from "@/components/ui";
import { HeroScatter } from "@/components/HeroScatter";
import { hero, heroBackdrop } from "@/content/viart";

/**
 * The collage, measured off the reference hero at 1440.
 *
 * Taken from `reference/aescape/RAW/screenshots/original-1440.png` by
 * connected components over a local-contrast mask, and cross-checked
 * against the media inventory in `RAW/deep/deep-1440.json`, which lists
 * the six squares as 2×220 (the videos), 2×180 and 2×140.
 *
 * The composition does not mirror, it turns through 180°: small on top and
 * large at the bottom down the left, large on top and small at the bottom
 * down the right. The two videos take the corners of that diagonal.
 *
 * ── The correction ────────────────────────────────────────────────────
 *
 * The measured page coordinates were rebased per rail by hand, and the
 * left rail came out 7px wider than the right with its own slots rounded
 * independently. The visible cost was all in one place: the left video sat
 * 30 units clear of the text column where the right video sat 9, so the
 * left half read as drifting away from the heading while the right half
 * held on to it. The eye reads that gap long before it reads the sizes.
 *
 * So the left rail is no longer measured separately. It is *derived* — the
 * exact 180° point-reflection of the right rail through the centre of the
 * box, which is what the arrangement was always supposed to be. Both rails
 * are now the same width, each square's clearance from the text column
 * matches its opposite number's exactly, and the vertical offsets fall out
 * of the same reflection rather than being nudged by hand.
 */
const RAIL = { width: 359, height: 521 } as const;

/** The right rail, as measured. `x` runs from the rail's text-side edge. */
const RIGHT = {
  "right-1": { size: 220, x: 9, y: 0 },
  "right-2": { size: 180, x: 179, y: 273 },
  "right-3": { size: 140, x: 0, y: 372 },
} as const;

/** Reflect a slot through the centre of the box: (x, y) → (W−x−s, H−y−s). */
const mirror = ({ size, x, y }: { size: number; x: number; y: number }) => ({
  size,
  x: RAIL.width - x - size,
  y: RAIL.height - y - size,
});

const SLOT = {
  // Top to bottom down the left: 140 → 180 → 220, the reverse of the right.
  "left-1": mirror(RIGHT["right-3"]),
  "left-2": mirror(RIGHT["right-2"]),
  "left-3": mirror(RIGHT["right-1"]),
  ...RIGHT,
} as const;

/**
 * Where each square goes when the first screen is scrolled away.
 *
 * Outwards from the text and away from the middle of the rail — the top
 * ones up, the bottom ones down — so the collage opens rather than simply
 * fading. Values are the full travel at `--t: 1`; the driver eases `--t`
 * from 0 to 1 across the first 120vh.
 */
const SCATTER = {
  "left-1": { sx: -140, sy: -120, rot: -6 },
  "left-2": { sx: -210, sy: -60, rot: 4 },
  "left-3": { sx: -165, sy: 150, rot: -5 },
  "right-1": { sx: 140, sy: -130, rot: 6 },
  "right-2": { sx: 210, sy: 95, rot: -4 },
  "right-3": { sx: 150, sy: 160, rot: 5 },
} as const;

/**
 * The collage is measured in `--u`, so it holds its size and only shrinks
 * below the width where the pair of rails stops fitting beside the column.
 */
const UNITS = {
  "--u": "clamp(0.72px, 0.0725vw, 1px)",
} as CSSProperties & Record<`--${string}`, string>;

const u = (n: number) => `calc(${n} * var(--u))`;

/**
 * The first screen.
 *
 * A server component: the squares are placed and still while this is the
 * screen you are on, and the only thing moving is the footage inside the
 * two video tiles. The one piece of client work is the scatter, which is
 * its own component and touches nothing but a single custom property.
 */
export function HeroStage() {
  const leadWords = wordCount(hero.titleLead);

  return (
    <section
      data-hero
      style={UNITS}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-header lg:pt-header-lg"
    >
      <HeroScatter />

      {/*
        The phone gets a photograph instead of the collage.

        Six circles laid out as two strips under the heading is a desktop
        composition folded up small: it costs two screens of scrolling
        before the page has said anything, and at strip size the pictures
        are too small to read. One photograph behind the type says the same
        thing in the space the heading already occupies — the studio's own
        shot of the TURBO G8 handpiece, whose lit spheres are where the
        violet in the rest of the palette comes from.

        The scrim is doing real work: two layers, a flat one to knock the
        whole picture back and a vertical gradient to bury the bottom edge
        into the page, so white text at 38px sits on something close to
        solid rather than on a photograph.
      */}
      <div aria-hidden className="absolute inset-0 -z-10 lg:hidden">
        {/*
          The one image on the site that is never lazy.

          It is the largest thing on a phone's first screen and the type
          sits directly on it, so deferring it means the heading arrives
          over an empty brown rectangle and then jumps into contrast.
          `eager` plus a high fetch priority puts it in the first wave of
          requests with the font; everything else on the page stays lazy.
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

      {/*
        One text column between two rails.

        Each rail is a box of the measured size with its circles placed
        absolutely inside it, and the two are reflections of each other
        through the centre. The column takes what is left, capped so the
        two halves stay a fixed 40px apart at every desktop width.

        Below desktop there are no rails at all: the photograph above is
        the composition, and the column is the whole screen.
      */}
      <div className="relative mx-auto w-full max-w-[1480px]">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-center lg:gap-[calc(40*var(--u))]">
          {/*
            `hidden lg:contents` on a wrapper rather than on the rail
            itself: the rail's own class list already carries `flex` for
            the small-screen strip, and `hidden` beside it is a coin toss
            on which display utility Tailwind emits last. A wrapper that
            disappears below `lg` and becomes transparent to the flex row
            above it has no such argument to lose.
          */}
          <div className="hidden lg:contents">
            <Rail slots={["left-1", "left-2", "left-3"]} side="left" />
          </div>
          <div className="min-w-0 lg:max-w-[560px] lg:flex-1">
            <HeroText leadWords={leadWords} />
          </div>
          <div className="hidden lg:contents">
            <Rail slots={["right-1", "right-2", "right-3"]} side="right" />
          </div>
        </div>
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

/**
 * One side of the collage. Desktop only — a phone gets the photograph
 * behind the type instead, so there is no small-screen layout to carry.
 *
 * A box of the measured size with each circle placed absolutely at its
 * measured offset inside it.
 */
function Rail({
  slots,
  side,
  className = "",
}: {
  slots: readonly (keyof typeof SLOT)[];
  side: "left" | "right";
  className?: string;
}) {
  const dir = side === "left" ? -1 : 1;

  return (
    <Reveal
      variant="none"
      delay={420}
      step={140}
      style={
        { "--rail-w": u(RAIL.width), "--rail-h": u(RAIL.height) } as CSSProperties &
          Record<`--${string}`, string>
      }
      className={`relative block h-[var(--rail-h)] w-[var(--rail-w)] shrink-0 ${className}`}
    >
      {slots.map((slot, i) => {
        const tile = hero.tiles.find((t) => t.slot === slot);
        if (!tile) return null;
        const place = SLOT[slot];
        const fly = SCATTER[slot];

        // Offsets go through `style`, not classes: they are data, and a
        // Tailwind class cannot be built out of data.
        const style = {
          "--w-lg": u(place.size),
          top: u(place.y),
          left: u(place.x),
        } as CSSProperties & Record<`--${string}`, string>;

        // Three nested elements, three separate jobs, because they write
        // the same property and would otherwise overwrite one another:
        // the outer one is *placed*, the middle one *scatters* on scroll,
        // and the inner one carries the arrival reveal.
        return (
          <div key={slot} className="absolute w-[var(--w-lg)]" style={style}>
            <div
              className="scatter"
              style={
                {
                  "--sx": `${fly.sx}px`,
                  "--sy": `${fly.sy}px`,
                  "--rot": `${fly.rot}deg`,
                } as CSSProperties & Record<`--${string}`, string>
              }
            >
              <M
                variant="focus"
                i={i}
                duration={1100}
                style={{ "--fx": `${dir * 70}px` } as CSSProperties & Record<`--${string}`, string>}
              >
                <Tile tile={tile} />
              </M>
            </div>
          </div>
        );
      })}
    </Reveal>
  );
}

/**
 * A circle.
 *
 * Every one of them, at every size. They were rounded squares, and the
 * geometry above is unchanged by this — same centres, same diameters, same
 * measured offsets — but a circle has no corner to disagree with its
 * neighbour's, so the six read as one constellation rather than six
 * rectangles that happen to be near each other. The 1:1 frame the squares
 * already used is what makes it a circle rather than an ellipse.
 */
function Tile({ tile }: { tile: (typeof hero.tiles)[number] }) {
  return (
    <div className="tile-zoom overflow-hidden rounded-full border border-white/15 shadow-[0_34px_70px_-30px_rgba(0,0,0,0.9)] transition-shadow duration-500 hover:shadow-[0_38px_80px_-28px_rgb(var(--c-accent)/0.5)]">
      <MediaFrame
        kind={tile.kind}
        ratio={1}
        src={tile.src}
        poster={"poster" in tile ? tile.poster : undefined}
        objectPosition={"focus" in tile ? tile.focus : undefined}
        tone="ink"
        label={tile.label}
        autoPlay={tile.kind === "video"}
        rounded={false}
      />
    </div>
  );
}

function HeroText({ leadWords }: { leadWords: number }) {
  return (
    <div className="relative z-10 mx-auto max-w-2xl text-center lg:max-w-none">
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
