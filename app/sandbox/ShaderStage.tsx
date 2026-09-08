"use client";

import { MeshGradient, GodRays, GrainGradient, Warp } from "@paper-design/shaders-react";

/**
 * Sandbox only. Candidate backgrounds built on real WebGL shaders
 * (`@paper-design/shaders-react` — zero dependencies, no three.js).
 *
 * Palette is hard-coded here rather than read from `--c-*` because a
 * shader takes colours as uniforms, not as CSS. If one of these ships,
 * the values move into a small map keyed off the theme so `/rose`
 * repaints with the rest of the site — see the note in the answer.
 */

const ESPRESSO = "#100905";
const GOLD = "#c9a84c";
const GOLD_SOFT = "#e4cc89";
const GOLD_DEEP = "#9a7c34";
const CLAY = "#a86a44";
const PEARL = "#f5ebe0";

const fill = { position: "fixed" as const, inset: 0, zIndex: 0 };

/**
 * Three ways down in brightness, and they are not interchangeable.
 *
 * `colors` decides what the gradient is made of — drop the light stops and
 * the whole thing sits lower, but the gold also stops being gold. A scrim
 * over the canvas decides how much of it reaches the eye — it keeps the
 * hue and takes the level, and it is the only one of the two that also
 * protects the type, because it darkens uniformly rather than wherever the
 * shader happens to be pale this second.
 *
 * So: palette first, to a point, then scrim for the rest. Doing it all
 * with the palette leaves bright patches drifting under small text; doing
 * it all with the scrim leaves grey mud.
 */
const MESH_STEPS = {
  // Gold still leads, one light stop gone.
  1: { colors: [ESPRESSO, "#2a1a0e", GOLD_DEEP, GOLD], scrim: 0.28 },
  // Deep gold only, no bright stop at all.
  2: { colors: [ESPRESSO, "#1c1109", "#3d2a12", GOLD_DEEP], scrim: 0.42 },
  // Espresso with a glint in it — the ground is dark and gold is an event.
  3: { colors: [ESPRESSO, "#150d07", "#241608", "#4a3316"], scrim: 0.5 },
} as const;

export function ShaderField({
  kind,
  step,
}: {
  kind: "mesh" | "rays" | "grain" | "warp";
  /** Mesh only: 1 dimmer → 3 darkest. Omit for the original bright take. */
  step?: 1 | 2 | 3;
}) {
  if (kind === "mesh") {
    const s = step ? MESH_STEPS[step] : null;
    return (
      <>
        <MeshGradient
          style={fill}
          colors={s ? [...s.colors] : [ESPRESSO, "#2e1d10", GOLD_DEEP, GOLD, GOLD_SOFT]}
          distortion={0.85}
          swirl={0.55}
          grainMixer={0.3}
          grainOverlay={0.12}
          speed={0.25}
        />
        {s && (
          <div
            aria-hidden
            style={{
              ...fill,
              // Darker at the edges than in the middle, so the corners —
              // where small type is least defended — get the most of it.
              background: `radial-gradient(120% 90% at 50% 34%, rgb(var(--c-base) / ${s.scrim * 0.55}) 0%, rgb(var(--c-base) / ${s.scrim}) 62%, rgb(var(--c-black) / ${Math.min(s.scrim + 0.22, 0.9)}) 100%)`,
            }}
          />
        )}
      </>
    );
  }

  if (kind === "rays") {
    return (
      <GodRays
        style={fill}
        colorBack={ESPRESSO}
        colorBloom={GOLD_SOFT}
        colors={[GOLD, GOLD_SOFT, CLAY]}
        intensity={0.28}
        density={0.45}
        spotty={0.25}
        midSize={0.7}
        midIntensity={0.35}
        bloom={0.45}
        speed={0.18}
        offsetY={-0.55}
      />
    );
  }

  if (kind === "grain") {
    return (
      <GrainGradient
        style={fill}
        colorBack={ESPRESSO}
        colors={[GOLD_DEEP, GOLD, CLAY, PEARL]}
        softness={0.85}
        intensity={0.32}
        noise={0.4}
        shape="wave"
        speed={0.35}
      />
    );
  }

  return (
    <Warp
      style={fill}
      colors={[ESPRESSO, GOLD_DEEP, GOLD, "#1c1109"]}
      proportion={0.42}
      softness={1}
      shape="stripes"
      shapeScale={0.12}
      distortion={0.3}
      swirl={0.75}
      swirlIterations={8}
      rotation={16}
      speed={0.3}
    />
  );
}
