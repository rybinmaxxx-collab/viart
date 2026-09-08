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

export function ShaderField({ kind }: { kind: "mesh" | "rays" | "grain" | "warp" }) {
  if (kind === "mesh") {
    return (
      <MeshGradient
        style={fill}
        colors={[ESPRESSO, "#2e1d10", GOLD_DEEP, GOLD, GOLD_SOFT]}
        distortion={0.85}
        swirl={0.55}
        grainMixer={0.3}
        grainOverlay={0.12}
        speed={0.25}
      />
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
