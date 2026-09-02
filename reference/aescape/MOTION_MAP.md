# Aescape — Motion & Interaction Map

> **SUPERSEDED — this file's central claim is wrong.**
>
> Direct measurement (see `GEOMETRY_SPEC.md` §1) shows the page has **no
> scroll-reveal animations at all**: 0 elements carry Framer appear markers,
> 1 `@keyframes` rule exists page-wide, and 0 of 97 tracked elements changed
> opacity or transform during a slow scroll past a mid-page band.
>
> The section below titled "Observed: scroll" concluded that reveals fire
> progressively down the page. That inference came from `interaction-probe`
> reporting `changed=true` after scrolling — a signal that also fires for
> sticky-header state and lazy image loading. It was not evidence of reveals.
>
> The hover and click observations below still hold. Use `GEOMETRY_SPEC.md`
> for anything motion-related.

Derived from `interaction-probe` (22 actions, 61 interactive candidates) and framework detection in `recon-site`.

---

## Read this before using anything below

**No motion timings, easings, or scroll choreography could be measured.** This is the honest limit of the capture, and it is worth stating plainly because the brief asked for scroll choreography and reveal/transition patterns.

Framer drives animation from its own runtime. Durations, easings, stagger offsets, and scroll-trigger thresholds live in that runtime's internal state — they are not in the DOM, not in computed styles, and not in the single stylesheet. A headless probe can observe **that** state changed, never **how** it changed.

Anything in this file phrased as a duration or curve would be invention. There is none, deliberately. What follows is what was actually observed.

## What was ruled out

| Library | Detected |
|---|---|
| GSAP | no |
| Lenis (smooth scroll) | no |
| Three.js / WebGL | no |
| Canvas elements | 0 at all three widths |

Scrolling is **native**. There is no smooth-scroll hijack, no scroll-driven canvas, no WebGL layer. Whatever richness the page has comes from Framer's built-in transitions over ordinary DOM.

This is good news for a reconstruction: the motion vocabulary is DOM transitions and scroll-triggered reveals, which any standard motion library can express. You are not reverse-engineering a shader.

---

## Observed: scroll

| Action | Position | DOM/state changed |
|---|---|---|
| scroll | 50% | **yes** |
| scroll | 100% | **yes** |

Both scroll positions produced observable change, consistent with scroll-triggered reveals firing down the page. The probe records change, not what animated. No sticky or pinned section could be confirmed — the probe has no measurement for pin state, so **treat "sticky/pinned sections" as unverified**, neither confirmed nor ruled out.

## Observed: hover (8 targets)

| Target | Changed |
|---|---|
| Packages & gifts (nav) | **yes** |
| Open cart | **yes** |
| Sessions (nav) | no |
| Locations (nav) | no |
| FAQ (nav) | no |
| For business (nav) | no |
| For home (nav) | no |
| Hero container div | no |

Only 2 of 8 hover targets produced a detectable state change. Both are the items with attached surfaces — a dropdown/flyout and a cart panel. The plain nav links did not register a change, which most likely means their hover treatment is a pure CSS colour/opacity transition too subtle for the probe's diff, rather than an absence of hover feedback. Confirm visually before concluding nav links have no hover state.

## Observed: click (12 targets)

11 of 12 produced change. Navigation items, both primary CTAs, the secondary CTA, and the cart trigger all responded. The only non-responding target was a non-interactive container div, which is expected.

**Aggregate: 15 of 22 actions changed DOM, URL, scroll, or overlay count.**

---

## What to carry into a reconstruction

1. **Native scroll.** Do not add a smooth-scroll library to match this site; it does not use one.
2. **Scroll-triggered reveals exist** and fire progressively down the page. The pattern is real; the parameters are yours to choose.
3. **Overlay surfaces**: at least two — a nav flyout under "Packages & gifts" and a cart panel. Both are click- and hover-reachable.
4. **No canvas/WebGL work is required** to reach visual parity.
5. **Motion parameters must be authored.** Pick durations and easings deliberately. There is no measured baseline to match, and matching a competitor's timing curve was never the part that mattered.

## Health note

52 console errors during the probe, including a `RangeError: Invalid language tag: en-US@posix` that crashes a code component mid-render, and a 403 on one resource. Parts of the live page are erroring. Do not treat this implementation as a correctness reference.
