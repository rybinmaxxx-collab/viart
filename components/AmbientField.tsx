"use client";

import { useEffect, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

/**
 * The one background the whole site sits on.
 *
 * Every band above this is translucent, so this layer is not decoration
 * for a section — it is the room all of them are in.
 *
 * ── What this replaced, and why three times ────────────────────────────
 *
 * First six glass spheres, then six edgeless pools of light, then three
 * full-bleed sheets of CSS haze. The third one was the closest, and it
 * still failed, but not for the reason the previous notes here assumed.
 *
 * It was measured before it was replaced: hiding the three sheets and
 * diffing the screenshot moved the mean channel by 7.8 of 255 — less than
 * the static grain tile above them, which moved 15.4. The most complicated
 * thing in the codebase contributed less to the picture than one line of
 * `background-image`. Raising the alphas would only have produced brighter
 * fog: three wide gradients overlapping on a dark ground have no edge
 * anywhere for the eye to resolve, and a background with no structure
 * reads as a smudge however bright it is.
 *
 * ── What is here now ──────────────────────────────────────────────────
 *
 * A real mesh gradient, on the GPU: colour spots travelling along their
 * own trajectories through an organic distortion field, which is the thing
 * the three sheets were imitating and could not reach. Roughly 30 lines of
 * configuration instead of 190 of hand-written parallax, and the scroll
 * listener, the pointer easing and the sine-of-scroll trick are all gone
 * with it — the motion is inside the shader now.
 *
 * ── The two levers, and why both ──────────────────────────────────────
 *
 * Brightness is set twice, and the halves are not interchangeable.
 *
 * `colors` decides what the gradient is made of. Drop the light stops and
 * everything sits lower — but the gold stops being gold and turns brown,
 * which is the exact failure the espresso palette is prone to, so there is
 * a floor to how far this lever goes.
 *
 * The scrim decides how much of it reaches the eye. It keeps the hue and
 * takes the level, and it is the only one of the two that defends the
 * type, because it darkens uniformly rather than wherever the shader
 * happens to be pale this second. That matters more here than it did with
 * the sheets: a shader is animated, so without it the contrast under a
 * line of small text would be a function of *time*, and the reader does
 * not control time.
 *
 * So: palette down to its floor, scrim for the remainder. All palette and
 * bright patches drift under small type; all scrim and the result is grey.
 */

/**
 * Per preset, because a shader takes colours as uniforms and cannot read
 * `--c-*` the way every other component does. This is the one place in the
 * site that names a hex, and it is the price of the effect — so it is one
 * map, next to the component, rather than hexes scattered through it.
 */
const PALETTES = {
  base: {
    colors: ["#100905", "#1c1109", "#3d2a12", "#9a7c34"],
    /** Where the shader cannot run. Mirrors the palette above. */
    still:
      "radial-gradient(58% 44% at 22% 18%, #3d2a12 0%, transparent 68%)," +
      "radial-gradient(52% 40% at 82% 32%, #9a7c34 0%, transparent 72%)," +
      "radial-gradient(70% 50% at 50% 88%, #1c1109 0%, transparent 74%)," +
      "#100905",
  },
  rose: {
    colors: ["#141113", "#1d1719", "#3a2a2c", "#9b686a"],
    still:
      "radial-gradient(58% 44% at 22% 18%, #3a2a2c 0%, transparent 68%)," +
      "radial-gradient(52% 40% at 82% 32%, #9b686a 0%, transparent 72%)," +
      "radial-gradient(70% 50% at 50% 88%, #1d1719 0%, transparent 74%)," +
      "#141113",
  },
} as const;

/**
 * 0.42 was the value chosen by eye. It shipped at 4.20:1 under the small
 * gold line above the price list — gold ink is the palette's dimmest, and
 * the shader had lifted the ground under it from near-black to L≈0.108.
 * 0.50 puts that worst case back over 4.5:1 and is indistinguishable from
 * 0.42 anywhere else, which is the whole argument for tuning the scrim
 * rather than the palette: it is the lever that does not cost any colour.
 */
const SCRIM = 0.5;

const FILL = { position: "fixed", inset: 0, zIndex: 0 } as const;

/**
 * Is there a GPU path at all?
 *
 * Asked once, on a throwaway canvas, because the alternative is finding
 * out by rendering nothing: a `<canvas>` that fails to get a context
 * paints transparent, and transparent over `body` is a flat brown page
 * with no warning that anything went wrong. Old Android, a blocklisted
 * driver and a browser with hardware acceleration switched off all land
 * here, and all of them get the still image instead.
 */
function hasWebGL() {
  try {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl2") || probe.getContext("webgl"));
  } catch {
    return false;
  }
}

export function AmbientField() {
  // Server-rendered as the still image, always. It is the honest first
  // frame — correct on its own, and what remains if script never arrives.
  const [live, setLive] = useState(false);
  const [preset, setPreset] = useState<keyof typeof PALETTES>("base");

  useEffect(() => {
    const root = document.documentElement;

    const readPreset = () =>
      setPreset(root.getAttribute("data-theme") === "rose" ? "rose" : "base");
    readPreset();

    // The preset is written by the bootstrap in <head> before first paint,
    // so this normally reads the final value on the first pass. The
    // observer is for the case it does not — a preset applied later must
    // not leave the background in the other palette.
    const watch = new MutationObserver(readPreset);
    watch.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    /*
     * Touch gets the still image, and this is the expensive decision in
     * the file, so here is the measurement behind it.
     *
     * Scrolling a 390×844 viewport for four seconds, frames actually
     * delivered:
     *
     *              with shader      still image
     *   unthrottled   29 fps           60 fps
     *   CPU ×4        16 fps           60 fps
     *   CPU ×6        16 fps           57 fps
     *
     * The worst single frame with the shader running was 317 ms.
     *
     * That was measured on a software rasteriser with no GPU, so a real
     * phone will do better — possibly much better, and the honest position
     * is that the true number is unknown. But the direction is not in
     * doubt, the audience for a studio in Kommunarka is overwhelmingly on
     * a phone, and the thing being bought with that frame budget is a
     * gradient nobody is looking at. The still image is the same palette;
     * what is lost on touch is the drift, not the picture.
     *
     * The same media query already governs every other expensive effect on
     * this site — see the touch block in `globals.css`.
     */
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)");
    const decide = () => setLive(!reduced.matches && !coarse.matches && hasWebGL());
    decide();
    reduced.addEventListener("change", decide);
    coarse.addEventListener("change", decide);

    return () => {
      watch.disconnect();
      reduced.removeEventListener("change", decide);
      coarse.removeEventListener("change", decide);
    };
  }, []);

  const palette = PALETTES[preset];

  return (
    <div aria-hidden className="field">
      {live ? (
        <MeshGradient
          style={FILL}
          colors={[...palette.colors]}
          distortion={0.85}
          swirl={0.55}
          grainMixer={0.3}
          grainOverlay={0.12}
          speed={0.25}
        />
      ) : (
        <div style={{ ...FILL, background: palette.still }} />
      )}

      {/*
        The scrim. Darker at the edges than in the middle, so the corners —
        where small type is least defended and where the eye is worst at
        reading — get the most of it. This is also what the old vignette
        did, so the two are one layer now rather than two stacked.
      */}
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(120% 90% at 50% 34%,` +
            ` rgb(var(--c-base) / ${SCRIM * 0.55}) 0%,` +
            ` rgb(var(--c-base) / ${SCRIM}) 62%,` +
            ` rgb(var(--c-black) / ${Math.min(SCRIM + 0.22, 0.9)}) 100%)`,
        }}
      />

      {/* Grain, once, for the whole page. It used to be applied per band,
          which meant it restarted at every band edge and drew a seam
          across the page wherever two of them met. Over the gradient it
          does a second job: it breaks up the banding a wide wash on a dark
          ground would otherwise show. */}
      <div className="grain" />
    </div>
  );
}
