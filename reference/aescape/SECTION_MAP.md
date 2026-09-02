# Aescape — Section Map

Band order and responsive behaviour, derived from heading structure and rendered geometry at 1440 / 768 / 390 px.

Sections are described **functionally**. Aescape's marketing copy is not reproduced here — see the screenshots in `RAW/` if you need to read the actual wording.

---

## Structural caveat

There is no semantic sectioning to map. `counts.sections = 1` at every width, and that single `<section>` is a carousel container at y≈6186. Everything else is a nested div tree with hashed class names.

So "sections" below means **visual bands inferred from heading hierarchy**, not DOM landmarks. A rebuild should author real `<section>` elements; there is nothing here to copy.

---

## Band order (1440px)

| # | Band | Heading level | Notes |
|---|---|---|---|
| 0 | Top inquiry / announcement strip | h3 | B2B inquiry prompt above the hero |
| 1 | Hero | h1 | Primary positioning statement + CTA |
| 2 | Personalisation | h1 | How a session adapts to the individual |
| 3 | On-demand availability | h1 | Booking/availability proposition |
| 4 | Cadence | h1 | Weekly-use proposition |
| 4a | Benefit triad | 3 × `<strong>` | Three parallel benefit columns — present at **all** widths |
| 5 | Routine builder | h1 | Package selector |
| 5a | Package cards | 3 × (h3 + h3) | Three tiers, each pairing a name with a duration |
| 6 | Locations / footprint | h1 | Where the service is available |
| 7 | Social proof | h1 | Volume + satisfaction statistics |
| 8 | Home / business inquiry | h3 | Second B2B/B2C inquiry prompt |
| 9 | Footer CTA | h1 | Closing conversion band |

Heading hierarchy is **not** semantically valid: nine separate `h1` elements on one page, and `h3` used for the top strip before any `h1` appears. This is visual-builder output. Do not mirror it — it is an accessibility defect, not a design decision.

---

## Breakpoint behaviour

| Signal | 1440px | 768px | 390px |
|---|---|---|---|
| Page height | 8417px | 12262px | 10541px |
| Headings matched by extractor | 19 | 16 | 16 |
| Benefit triad (band 4a) | present | present | present |
| Benefit triad type | 29px / w500 | 23px / w700 | 23px / w700 |
| Footer CTA heading level | h1 | h2 | h2 |
| Images / video reported | 37 / 5 | 35 / 4 | 35 / 4 |
| Buttons | 21 | 21 | 18 |

Three behaviours worth carrying into any reconstruction:

1. **Responsive typography inverts weight as it shrinks.** The benefit triad goes 29px/weight-500 at desktop to 23px/weight-700 at both smaller widths. Aescape compensates for lost size with added weight rather than letting the label go quiet. That trade is the most directly reusable typographic decision found in this capture.
2. **768px is the tallest layout**, 46% taller than desktop and 16% taller than mobile. The tablet width stacks what desktop places side by side, while mobile collapses more aggressively. If you test only desktop and phone you will miss the worst case.
3. **Button count drops by 3 at 390px** while staying flat from 1440→768 — mobile consolidates actions rather than stacking them.

### Correction — read if you are acting on an earlier draft

An earlier version of this file claimed the benefit triad was desktop-only and that content was dropped below 1440px. **That was wrong.** It came from trusting the heading-extractor deltas without checking the rendered page. Direct DOM inspection at all three widths shows the triad present everywhere; it is `<strong>`, never `<h3>`, so the extractor simply matched it at one width and not the others.

Two consequences for how you read the rest of this package:

- The **heading counts** (19/16/16) measure extractor matches, not content. They are not evidence of content being removed.
- The **image and video deltas** (37→35, 5→4) are reported counts at capture time and were **not** verified the same way. Lazy-loading is at least as likely an explanation as a breakpoint content rule. Treat them as unconfirmed.

No content has been confirmed as dropped at any breakpoint.

---

## Media proportions

- Images served from `framerusercontent.com` with query-string resizing (`?width=400&height=400`).
- The dominant observed ratio is **1:1 at 400×400**, used for tile/avatar grids.
- 5 video elements at desktop, 4 below — video is part of the layout, not decoration.
- Zero canvas elements at any width. Despite the visual richness there is no custom canvas or WebGL rendering anywhere on the page.

No media was downloaded. Dimensions only.
