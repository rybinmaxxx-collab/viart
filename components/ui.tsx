import type { CSSProperties, ReactNode } from "react";
import { Reveal } from "@/components/motion";
import { MediaFrame } from "@/components/MediaFrame";
import { M, SplitWords } from "@/components/m";

/**
 * A band of the page.
 *
 * ── No seams ───────────────────────────────────────────────────────────
 *
 * A band paints nothing. Not a fill, not a rim, not a grain of its own —
 * it is spacing and a content column, and that is all. Everything you can
 * see behind it is the ambient field in `components/AmbientField`, one
 * continuous surface running the whole length of the site.
 *
 * This is the second time this has been rebuilt and the reason is worth
 * keeping. Bands began as opaque stripes in alternating colours, which put
 * a hard horizontal line at every junction; they then became translucent
 * panes, which was better but still drew a visible edge wherever two
 * different opacities met, and the per-band grain restarted at every one
 * of those edges. There is no fill to have an edge now. Depth comes from
 * `glow`, which is a blurred colour field with no boundary at all.
 *
 * Column: max-width 1120px, padding-inline 20px.
 * Vertical rhythm: 60px, rising to 100px at desktop.
 * See reference/aescape/GEOMETRY_SPEC.md §3.
 */
export function Band({
  children,
  className = "",
  id,
  glow,
  flush = false,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  /**
   * A pool of light behind this band, for the places that have to feel
   * like the front of the room rather than another paragraph of it. Use it
   * sparingly: if every band glows, none of them does.
   */
  glow?: "lav" | "aqua" | "gold" | "clay";
  /** Drop the vertical padding — for full-bleed media bands. */
  flush?: boolean;
  /** Footer runs slightly wider than the standard column. */
  wide?: boolean;
}) {
  const glows = {
    lav: "bg-lav/[0.18]",
    aqua: "bg-aqua/[0.08]",
    gold: "bg-gold/[0.08]",
    clay: "bg-clay/[0.1]",
  };

  return (
    <section
      id={id}
      className={`relative isolate text-white px-5 ${
        flush ? "py-0" : "py-band lg:py-band-lg"
      } ${className}`}
    >
      {glow && (
        // No `overflow: hidden` on the section — clipping the pool would
        // give it the straight edge the whole rebuild is about removing.
        // The blur runs past the band and blends into its neighbours.
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className={`bloom left-1/4 top-0 h-[34rem] w-[44rem] ${glows[glow]}`} />
          <div className="bloom -bottom-24 right-0 h-80 w-96 bg-lav/[0.12]" />
        </div>
      )}
      <div className={`relative mx-auto ${wide ? "max-w-footer" : "max-w-band"}`}>{children}</div>
    </section>
  );
}

/**
 * An emphasised phrase inside a heading.
 *
 * It used to be a bold italic serif — a second typeface, in a second
 * style, inside the same sentence. Read back on the deploy that was the
 * loudest thing on the page and the least meaningful: two voices arguing
 * inside one heading. Emphasis now comes from colour alone, in the same
 * face and the same weight as the words either side of it.
 */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="text-lav-soft">{children}</span>;
}

/** Small uppercase label above a band heading. */
export function Kicker({ children }: { children: ReactNode }) {
  return <p className="text-cap uppercase tracking-[0.12em] text-lav-soft">{children}</p>;
}

/**
 * The standard opening of a section: a short accent bar that draws itself
 * out, then the heading rising word by word.
 *
 * One heading style, and only one. There is no italic accent phrase and no
 * second typeface — a heading is a single bold sentence, centred, and the
 * violet bar above it is all the furniture it needs.
 */
export function SectionHead({
  title,
  lead,
  size = "h1",
  align = "center",
  className = "",
}: {
  title: string;
  lead?: string;
  /**
   * One step down, for a head that is a whole sentence rather than a
   * phrase. The offer above the price list is the case this exists for.
   */
  size?: "h1" | "h2";
  /**
   * Centred everywhere, and that is the default rather than a per-call
   * decision. Leaving it to each call site is how half the page ended up
   * ranged left and the other half centred.
   */
  align?: "left" | "center";
  className?: string;
}) {
  const centred = align === "center";

  return (
    <Reveal
      variant="none"
      step={90}
      className={`relative ${centred ? "text-center" : ""} ${className}`}
    >
      <M
        variant="draw"
        i={0}
        duration={900}
        className={`h-1 w-14 rounded-full bg-lav shadow-[0_0_24px_rgb(var(--c-accent)/0.55)] ${
          centred ? "mx-auto" : ""
        }`}
      />

      {/*
        `text-balance` and a wide measure, together.

        The measure is what stops a heading breaking at all — «Уважение к
        вашему времени и телу» needs about 760px at this size and used to
        be given 896, then broken anyway because the last word would not
        fit. `text-balance` handles the ones that genuinely need two lines:
        it splits them evenly instead of filling line one and leaving a
        single word stranded on line two.
      */}
      <h2
        className={`relative mt-6 text-balance font-bold text-white ${
          size === "h2" ? "text-h2" : "text-h1"
        } ${centred ? "mx-auto max-w-5xl" : "max-w-4xl"}`}
      >
        <SplitWords text={title} className="mr-[0.22em]" />
      </h2>

      {lead && (
        <M
          variant="rise"
          i={6}
          as="p"
          className={`mt-5 text-lead text-white/76 ${centred ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {lead}
        </M>
      )}
    </Reveal>
  );
}

/**
 * The opening band of an inner page — the same head as every other, one
 * size larger, with room under a fixed header.
 */
export function PageHeader({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  /** Buttons or anything else below the lead. */
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden px-5 pb-band pt-[168px] text-white lg:pb-band-lg lg:pt-[200px]">
      <Reveal variant="none" step={90} className="relative mx-auto max-w-band text-center">
        <M
          variant="draw"
          i={0}
          duration={900}
          className="mx-auto h-1 w-14 rounded-full bg-lav shadow-[0_0_24px_rgb(var(--c-accent)/0.55)]"
        />

        <h1 className="relative mx-auto mt-6 max-w-4xl text-balance text-display font-bold">
          <SplitWords text={title} className="mr-[0.22em]" />
        </h1>

        {lead && (
          <M variant="rise" i={6} as="p" className="mx-auto mt-6 max-w-2xl text-lead text-white/76">
            {lead}
          </M>
        )}

        {children && (
          <M variant="rise" i={7} className="mt-9 flex flex-wrap justify-center gap-3">
            {children}
          </M>
        )}
      </Reveal>
    </section>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "light" | "ghost";
  className?: string;
}) {
  // Each variant sets its own wipe colour via the ::before fill. On a dark
  // ground every fill wipes to white and the label turns dark with it —
  // the hover has to *add* light, because there is no light to take away.
  const variants = {
    solid:
      "bg-lav text-ink shadow-[0_16px_44px_-20px_rgb(var(--c-accent)/0.75)] [&::before]:bg-white",
    outline: "border border-white/25 text-white hover:text-ink [&::before]:bg-white",
    light: "border border-white/45 bg-white/[0.06] text-white hover:text-ink [&::before]:bg-white",
    ghost: "border border-white/12 bg-white/[0.04] text-white hover:text-ink [&::before]:bg-lav-soft",
  };

  const external = href.startsWith("http") || href.startsWith("tel:");

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`btn inline-flex items-center justify-center rounded-full px-7 py-3.5 text-body font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </a>
  );
}

/**
 * Section heading.
 *
 * `triad` carries the one measured responsive type behaviour worth keeping:
 * 29px/500 at desktop dropping to 23px/700 below, so the label trades size
 * for weight instead of going quiet.
 */
export function Heading({
  children,
  level = 2,
  size = "h1",
  className = "",
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  size?: "display" | "h1" | "h2" | "h3" | "triad";
  className?: string;
}) {
  const Tag = (["h1", "h2", "h3"] as const)[level - 1];

  // 600 at the top of the scale, not 700 and certainly not 900. At 54px a
  // bold grotesk stops reading as emphasis and starts reading as shouting;
  // the size is already carrying the emphasis on its own.
  const sizes = {
    display: "text-display font-semibold",
    h1: "text-h1 font-bold",
    h2: "text-h2 font-semibold",
    h3: "text-h3 font-semibold",
    triad: "text-h3 font-semibold md:text-h2",
  };

  return <Tag className={`${sizes[size]} ${className}`}>{children}</Tag>;
}

/*
 * There was a `Ribbon` here — a full-width lavender strip of scrolling
 * keywords between bands. It is gone, along with every other travelling
 * text strip on the site. It was doing the opposite of what the page
 * needs: a hard-edged band of solid colour is the most conspicuous seam
 * you can put between two sections, and a line of words moving on its own
 * pulls the eye off whatever it was reading. The only thing left that
 * travels is the photo rail, which is a gallery and stops when touched.
 */

/**
 * A square picture with a caption under it.
 *
 * The site's one repeated unit. There is no box: a 1:1 image, a violet
 * title, and a line or two of body — the caption block exactly the width
 * of the square above it, never wider.
 *
 * Anything extra a band needs (a price, a link) goes in `children`, below
 * the body and still inside the square's width.
 */
export function MediaTile({
  src,
  alt,
  focus,
  title,
  body,
  titleLines = 2,
  bodyLines,
  children,
}: {
  src: string;
  alt: string;
  /** Crop position, e.g. `center 62%`. */
  focus?: string;
  title: string;
  body?: string;
  /**
   * Lines reserved for the title.
   *
   * A row of tiles only reads as a row while its paragraphs start on the
   * same line, so the title holds height whether it needs it or not. Set
   * this to 1 where every title in the row is a single line — reserving a
   * second one there opens a gap under the picture instead of closing one.
   */
  titleLines?: 1 | 2;
  /**
   * Lines the body is clamped to.
   *
   * Set it where something below the body — a price, an action — has to
   * land on the same line across the row. Left unset the body runs to its
   * natural length.
   */
  bodyLines?: 2 | 3;
  children?: ReactNode;
}) {
  const titleHeight = titleLines === 1 ? "min-h-[1.25em]" : "min-h-[2.5em]";
  const bodyClamp =
    bodyLines === 2 ? "line-clamp-2 min-h-[3.2em]" : bodyLines === 3 ? "line-clamp-3 min-h-[4.8em]" : "";

  return (
    <figure>
      <div className="tile-zoom overflow-hidden rounded-2xl ring-1 ring-white/10">
        <MediaFrame ratio={1} src={src} label={alt} rounded={false} objectPosition={focus} />
      </div>
      <figcaption className="mt-4">
        <h3 className={`flex items-start text-h3 font-semibold text-lav-soft ${titleHeight}`}>
          {title}
        </h3>
        {body && <p className={`text-body text-white/76 ${bodyClamp}`}>{body}</p>}
        {children}
      </figcaption>
    </figure>
  );
}

/**
 * A card of frosted glass.
 *
 * On a dark ground a card cannot be told from its band by fill alone —
 * there is not enough range left between them. What separates it is the
 * rim and the blur: a hairline that catches the field behind it, and just
 * enough backdrop blur that the violet passing underneath goes soft
 * inside the card and stays sharp outside it.
 */
export function Card({
  children,
  className = "",
  tone = "glass",
  style,
}: {
  children: ReactNode;
  className?: string;
  tone?: "glass" | "featured";
  style?: CSSProperties;
}) {
  const tones = {
    glass: "border border-white/10 bg-white/[0.045]",
    featured:
      "border border-lav/50 bg-lav/[0.09] shadow-[0_28px_70px_-40px_rgb(var(--c-accent)/0.75)]",
  };

  return (
    <div
      style={style}
      className={`card-lift relative overflow-hidden rounded-2xl backdrop-blur-md ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
