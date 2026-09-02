import type { CSSProperties, ReactNode } from "react";

/**
 * Server-side half of the motion system: pure markup, no hooks.
 *
 * These render inside `Reveal` blocks and take their cue from the parent's
 * `data-shown`, so they cost nothing on the client — no component, no
 * listener, just an attribute the stylesheet already knows about.
 */

export type Variant =
  | "none"
  | "fade"
  | "rise"
  | "curtain"
  | "deal"
  | "aperture"
  | "wipe"
  | "zoom"
  | "pop"
  | "flip"
  | "settle"
  | "draw"
  | "drawCenter"
  | "drawY"
  | "focus"
  | "fromLeft"
  | "fromRight";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** A staggered child of a `Reveal`. `i` is its place in the queue. */
export function M({
  variant = "rise",
  i = 0,
  className = "",
  children,
  as: Tag = "div",
  style,
  rotate,
  duration,
}: {
  variant?: Variant;
  /** Stagger index — multiplied by the block's step. */
  i?: number;
  className?: string;
  children?: ReactNode;
  as?: "div" | "li" | "p" | "span" | "h2" | "h3" | "dt" | "dd" | "article";
  style?: CSSProperties;
  /** For `settle`: the angle it straightens out of. */
  rotate?: number;
  duration?: number;
}) {
  const vars: Vars = { ...(style as Vars), "--i": i };
  if (rotate !== undefined) vars["--rot"] = `${rotate}deg`;
  // Directly, not via a variable — see the note in `Reveal`.
  if (duration !== undefined) vars.transitionDuration = `${duration}ms`;

  return (
    <Tag data-mc={variant} className={className} style={vars}>
      {children}
    </Tag>
  );
}

/**
 * A heading split into words that ride up out of their own masks.
 *
 * The split happens here, on the server, from a plain string — so the
 * markup the client hydrates is the markup that was sent, and a heading
 * is never at risk of arriving as one unbroken line of hidden text.
 */
export function SplitWords({
  text,
  start = 0,
  className = "",
}: {
  text: string;
  /** Continue the stagger from an earlier run of words. */
  start?: number;
  className?: string;
}) {
  return (
    <>
      {text.split(/\s+/).map((word, i) => (
        <span key={`${word}-${i}`} className={`m-word ${className}`}>
          <span style={{ "--i": start + i } as Vars}>{word}</span>
        </span>
      ))}
    </>
  );
}

/** Word count, so a second `SplitWords` can carry on the stagger. */
export function wordCount(text: string) {
  return text.split(/\s+/).length;
}
