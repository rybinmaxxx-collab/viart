import type { Config } from "tailwindcss";

/**
 * Design tokens.
 *
 * The site is one continuous dark room. A band paints no background at
 * all: everything visible behind the content is the single espresso ground
 * and the gold field drifting over it — see `components/AmbientField`. The
 * surface colours below are for cards and controls, which is why they sit
 * so close together; they are meant to read as depth in one space rather
 * than as different sections.
 *
 * Geometry is still measured from the reference layout at 1440/768/390 —
 * see reference/aescape/GEOMETRY_SPEC.md.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./content/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "Segoe UI", "Arial", "sans-serif"],
      },
      /**
       * Not one hex value in here.
       *
       * Every entry resolves to a channel triplet declared in
       * `app/globals.css` — see the THEME TOKENS block at the top of that
       * file, which is the single source of truth for colour and carries
       * both presets. `<alpha-value>` is Tailwind's slot for the opacity
       * in a utility, so `bg-lav/20` and `border-white/12` keep working
       * exactly as they did while the hue behind them is one variable.
       *
       * ── One trap in the opacity modifier ────────────────────────────
       *
       * Tailwind's opacity scale runs in fives, and a modifier that is
       * not on it emits *nothing at all*. `bg-lav/20` and `text-white/80`
       * are rules; `text-white/72`, `bg-base/62` and `via-base/48` are
       * silently no classes — the element inherits its parent's colour,
       * or the layer is simply not painted. There is no warning: the
       * class is in the markup and nothing stands behind it.
       *
       * So the ink ladder in the header of `app/globals.css` — 92, 88,
       * 84, 76, 72, 68, 62, 58, 54, 48 — is written all over the site and
       * is, apart from 80, not in the stylesheet at all: those lines
       * render at the inherited cream rather than at their intended
       * weight. Nothing here changes that, because turning the ladder on
       * would take the contrast down on every page at once — that is a
       * decision about how the site looks, not a build fix, and it is the
       * studio's to make. Until it is made, any value off the scale that
       * genuinely has to apply is written in brackets, as an arbitrary
       * value: `bg-base/[0.62]`.
       *
       * The names are unchanged on purpose: `lav` is the accent wherever
       * it appears in the markup, and renaming it across four hundred
       * class lists would have been a refactor pretending to be a
       * restyle. What it *is* is now decided in one place.
       */
      colors: {
        /** The page ground. Everything else is a pane over this. */
        base: "rgb(var(--c-base) / <alpha-value>)",
        /** A band lifted off the ground. */
        panel: "rgb(var(--c-panel) / <alpha-value>)",
        /** A card lifted off a band. */
        veil: "rgb(var(--c-veil) / <alpha-value>)",
        /**
         * Dark ink for text on the few light surfaces left — the buttons
         * whose fill wipes to cream, and the announcement pill.
         */
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        black: "rgb(var(--c-black) / <alpha-value>)",
        /**
         * `white` is warm cream, and that redefinition is the single
         * highest-leverage line in the theme: the site sets type, rims,
         * card fills and divider rules in `white` at a dozen opacities,
         * and pure white against espresso reads as a cold hole in the
         * page. Everything comes up in #f4ecd8 instead.
         */
        white: "rgb(var(--c-cream) / <alpha-value>)",
        /**
         * The accent — warm matte gold, the bronze of the reference.
         *
         * `DEFAULT` is the interactive colour (buttons, bars, rules),
         * `deep` the one that only ever appears blurred behind something,
         * and `soft` the champagne bright enough to set text in.
         */
        lav: {
          DEFAULT: "rgb(var(--c-accent) / <alpha-value>)",
          deep: "rgb(var(--c-accent-deep) / <alpha-value>)",
          soft: "rgb(var(--c-accent-soft) / <alpha-value>)",
        },
        /**
         * The second accent. It was aquamarine, for the laser's sapphire
         * cooling; a cold teal has no place in this palette, so it is
         * toasted almond — a step off the gold, still warm.
         */
        aqua: {
          DEFAULT: "rgb(var(--c-second) / <alpha-value>)",
          soft: "rgb(var(--c-second-soft) / <alpha-value>)",
        },
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        clay: "rgb(var(--c-clay) / <alpha-value>)",
        /** Pearl beige — the glass spheres of the ambient field. */
        pearl: "rgb(var(--c-pearl) / <alpha-value>)",
      },
      /**
       * Type scale.
       *
       * Sized against the actual headings rather than against a ratio. The
       * previous scale topped out at 56px for a band head and 78px for a
       * page title, and at those sizes ViART's own sentences did not fit:
       * «Уважение к вашему времени и телу» broke after «и» and dropped one
       * word onto a line of its own, which is the single ugliest thing a
       * heading can do. Every step below is set so the longest heading on
       * the site holds one line, or breaks to two even ones.
       *
       * Body copy stays at 17px so paragraphs read as substance rather than
       * fine print — the shrinking is all in the display sizes, where the
       * weight was.
       */
      fontSize: {
        cap: ["14px", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        body: ["17px", { lineHeight: "1.6", letterSpacing: "-0.01em" }],
        lead: ["clamp(17px, 1.25vw, 19px)", { lineHeight: "1.6", letterSpacing: "-0.012em" }],
        h3: ["clamp(19px, 1.6vw, 23px)", { lineHeight: "1.3", letterSpacing: "-0.025em" }],
        h2: ["clamp(24px, 2.4vw, 32px)", { lineHeight: "1.15", letterSpacing: "-0.03em" }],
        h1: ["clamp(28px, 3.4vw, 44px)", { lineHeight: "1.1", letterSpacing: "-0.035em" }],
        display: ["clamp(32px, 4.2vw, 54px)", { lineHeight: "1.04", letterSpacing: "-0.04em" }],
        // Hero heading only, and sized by measurement rather than taste.
        // Manrope Bold runs at about 0.52em a character here, so
        // «Лазерная эпиляция и массаж» — 26 characters — needs 13.5px of
        // width per point of type. The desktop column between the two
        // rails is 560px and cannot widen without moving the collage,
        // which caps the top of the range at 38px; a 360px phone leaves a
        // 320px column, which sets the bottom at 23px. Between them the
        // line holds, and «в Коммунарке» gets the second line to itself.
        hero: ["clamp(23px, 2.7vw, 38px)", { lineHeight: "1.12", letterSpacing: "-0.03em" }],
        // A quotation is not a heading. It gets its own size so it can be
        // large enough to carry the page without arriving at heading weight.
        quote: ["clamp(21px, 2vw, 28px)", { lineHeight: "1.35", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        // Measured content column.
        band: "1120px",
        footer: "1200px",
      },
      spacing: {
        /**
         * Vertical band rhythm.
         *
         * Down from 60/100. Bands used to paint alternating fills, so each
         * one's padding read as belonging to its own coloured block and the
         * junction was a line. With no fills the paddings simply add — two
         * hundred pixels of nothing between one band's last line and the
         * next band's first — and on a page with no seams that gap is the
         * only thing separating them, so it wants to be a pause rather
         * than a hole.
         */
        band: "52px",
        "band-lg": "84px",
        // Fixed header height.
        header: "146px",
        "header-lg": "158px",
      },
    },
  },
  plugins: [],
};

export default config;
