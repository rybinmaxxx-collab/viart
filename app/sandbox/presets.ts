import type { Sheet } from "@/components/FieldLab";

/**
 * Four candidate backgrounds, sandbox only.
 *
 * All four are gradients in theme tokens, so any of them repaints for
 * `/rose` without learning about it, and none uses `filter: blur()`.
 * They differ in one thing only: what kind of structure they give the eye.
 *
 *   a — shafts:  direction. Light arriving from somewhere.
 *   b — horizon: a lit floor. Depth from below, not from haze.
 *   c — arch:    one architectural shape, drawn from the studio's own
 *                backlit mirror arches.
 *   d — ridges:  the honest Firewatch diorama, for comparison.
 */

/** a · «Свет из-за плеча» — broad angled shafts, three depths. */
export const shafts: Sheet[] = [
  {
    depth: 0.3,
    swim: 80,
    ax: 0.02,
    ay: 0.04,
    px: 2600,
    py: 2000,
    phase: 0,
    paint: `
      linear-gradient(102deg,
        transparent 4%,
        rgb(var(--c-accent) / 0.13) 20%,
        rgb(var(--c-accent) / 0.03) 33%,
        transparent 42%),
      linear-gradient(102deg,
        transparent 58%,
        rgb(var(--c-clay) / 0.1) 72%,
        transparent 88%)
    `,
  },
  {
    depth: 0.62,
    swim: 62,
    ax: 0.04,
    ay: 0.07,
    px: 1700,
    py: 1300,
    phase: 1.1,
    paint: `
      linear-gradient(98deg,
        transparent 26%,
        rgb(var(--c-accent-soft) / 0.11) 40%,
        transparent 55%)
    `,
  },
  {
    depth: 1,
    swim: 48,
    ax: 0.06,
    ay: 0.12,
    px: 1100,
    py: 820,
    phase: 2.3,
    paint: `
      linear-gradient(96deg,
        transparent 6%,
        rgb(var(--c-pearl) / 0.09) 15%,
        rgb(var(--c-pearl) / 0.01) 24%,
        transparent 30%),
      radial-gradient(24% 18% at 74% 18%, rgb(var(--c-accent) / 0.12), transparent 72%)
    `,
  },
];

/** b · «Горизонт» — the room is lit from the floor, not from fog. */
export const horizon: Sheet[] = [
  {
    depth: 0.24,
    swim: 90,
    ax: 0.01,
    ay: 0.03,
    px: 3000,
    py: 2400,
    phase: 0,
    paint: `
      linear-gradient(180deg, rgb(var(--c-black) / 0.55) 0%, transparent 46%),
      radial-gradient(130% 58% at 50% 104%, rgb(var(--c-accent) / 0.2), transparent 68%)
    `,
  },
  {
    depth: 0.58,
    swim: 66,
    ax: 0.03,
    ay: 0.06,
    px: 1900,
    py: 1400,
    phase: 1.4,
    paint: `
      radial-gradient(76% 34% at 34% 98%, rgb(var(--c-accent-soft) / 0.15), transparent 70%),
      radial-gradient(60% 28% at 82% 100%, rgb(var(--c-clay) / 0.12), transparent 72%)
    `,
  },
  {
    depth: 1,
    swim: 50,
    ax: 0.05,
    ay: 0.1,
    px: 1200,
    py: 900,
    phase: 2.6,
    paint: `
      linear-gradient(188deg, rgb(var(--c-pearl) / 0.06) 0%, transparent 34%)
    `,
  },
];

/** c · «Арка» — one shape, taken from the studio's own lit mirror arches. */
export const arch: Sheet[] = [
  {
    depth: 0.2,
    swim: 96,
    ax: 0.01,
    ay: 0.02,
    px: 3200,
    py: 2600,
    phase: 0,
    paint: `
      linear-gradient(180deg, rgb(var(--c-black) / 0.5) 0%, transparent 40%),
      radial-gradient(120% 60% at 50% 106%, rgb(var(--c-accent) / 0.14), transparent 70%)
    `,
  },
  {
    depth: 0.55,
    swim: 70,
    ax: 0.02,
    ay: 0.04,
    px: 2200,
    py: 1600,
    phase: 1.2,
    // The arch itself: a ring drawn by two close stops, so it has an edge
    // the eye can find without the shape ever closing into an object.
    paint: `
      radial-gradient(38% 54% at 50% 74%,
        transparent 58%,
        rgb(var(--c-accent) / 0.2) 62%,
        rgb(var(--c-accent) / 0.06) 70%,
        transparent 80%),
      radial-gradient(34% 48% at 50% 74%, rgb(var(--c-accent) / 0.07), transparent 76%)
    `,
  },
  {
    depth: 1,
    swim: 54,
    ax: 0.04,
    ay: 0.09,
    px: 1300,
    py: 950,
    phase: 2.4,
    paint: `
      radial-gradient(22% 16% at 28% 22%, rgb(var(--c-pearl) / 0.08), transparent 74%),
      radial-gradient(26% 18% at 76% 82%, rgb(var(--c-accent-soft) / 0.08), transparent 74%)
    `,
  },
];

/** d · «Гряды» — the Firewatch diorama, drawn in this palette. */
export const ridges: Sheet[] = [
  {
    depth: 0.16,
    swim: 110,
    ax: 0.008,
    ay: 0.02,
    px: 3400,
    py: 2800,
    phase: 0,
    paint: `
      radial-gradient(84% 30% at 60% 86%, rgb(var(--c-accent-deep) / 0.3) 72%, transparent 73%),
      linear-gradient(180deg, rgb(var(--c-black) / 0.4) 0%, transparent 52%)
    `,
  },
  {
    depth: 0.5,
    swim: 78,
    ax: 0.025,
    ay: 0.05,
    px: 2000,
    py: 1500,
    phase: 1.3,
    paint: `
      radial-gradient(72% 30% at 20% 94%, rgb(var(--c-clay) / 0.38) 74%, transparent 75%)
    `,
  },
  {
    depth: 1,
    swim: 56,
    ax: 0.05,
    ay: 0.11,
    px: 1200,
    py: 880,
    phase: 2.5,
    paint: `
      radial-gradient(90% 28% at 76% 102%, rgb(var(--c-ink) / 0.92) 76%, transparent 77%),
      radial-gradient(20% 15% at 24% 16%, rgb(var(--c-accent-soft) / 0.1), transparent 74%)
    `,
  },
];

export const PRESETS = { a: shafts, b: horizon, c: arch, d: ridges } as const;
