# Aescape — Geometry & Motion Spec

Measured directly from the rendered page at 1440 / 768 / 390 px. This is the
build spec the ViART site is implemented against.

Raw data: `RAW/deep/deep-{1440,768,390}.json`.

---

## 1. Motion — the headline correction

**There are no scroll-reveal animations on this page.** No entrance
animations, no parallax, no scroll-linked transforms.

Verified four independent ways:

| Check | Result |
|---|---|
| `[data-framer-appear-id]` elements | **0** — Framer's appear-animation feature is unused |
| `@keyframes` declared page-wide | **1** (`pulse`), applied to 1 element |
| Elements with a live transition | **7** total; 6 are `opacity 0.3s ease` |
| Peak elements moving during 4s after load | **1** |
| Elements changing during a slow scroll past a mid-page band | **0 of 97 tracked** |

The entire motion budget of the page is:

- `opacity 0.3s ease` on ~6 interactive elements (hover feedback)
- one `pulse` keyframe animation
- a testimonial carousel that swaps slides (~15ms, no transition)
- video playback

**This supersedes `MOTION_MAP.md`,** which claimed scroll-triggered reveals
fire progressively down the page. That was wrong — it was inferred from
`interaction-probe` reporting `changed=true` on scroll, which those probes
report for unrelated reasons (sticky header state, lazy image loading).
Direct measurement shows nothing animates.

The page's richness comes from **video and layout**, not motion. Matching it
means *removing* reveal animations, not adding them.

## 2. Header

`position: fixed`, `top: 0`, `z-index: 1`, transparent background, no
backdrop-filter. It overlays the hero rather than displacing it.

Height: **158px** at 1440, **146px** at 768 and 390.

## 3. Content column

- `max-width: 1120px`
- `padding-inline: 20px`

Yields measured inner widths of 1120 / 728 / 350. The footer runs slightly
wider (1200 at desktop).

Vertical band padding: **100px** at 1440, **60px** at 768 and 390.

## 4. Bands

Heights in px, desktop / tablet / mobile.

| # | Role | Background | 1440 | 768 | 390 | Row structure (1440 → 768 → 390) |
|---|---|---|---|---|---|---|
| 0 | Hero | transparent over dark | 720 | 780 | 760 | flex 3col, gap 40 → 24 → 16 |
| 1 | Feature tiles | `#fff` | 794 | 691 | 726 | 4 × 1:1 images |
| 2 | Full-bleed media | — | 810 | 432 | 219 | single 16:9 video |
| 3 | Process tiles | `#000` | 794 | 691 | 726 | 4 × 1:1 images |
| 4 | Steps | `#ede9e0` | 598 | 912 | 908 | flex 3col gap 20 → stacked |
| 5 | Routine + packages | `#fff` | 1471 | 3857 | 2644 | flex 3col gap 40 → 2col |
| 6 | Logo strip | `#000` | 586 | 491 | 522 | 9 logos, mixed ratios |
| 7 | Testimonials | `#fff` | 1162 | 2171 | 1641 | flex 2col gap 24; 2 portrait videos |
| 8 | Closing CTA | `#000` | 580 | 975 | 252+688 | single 1.21:1 image + 2 badges |
| 9 | Footer | — | 661 | 894 | 1257 | grid 3col → 2col → 2col, gap 40 |

Mobile splits band 8 into two, giving 11 bands at 390px.

**Two distinct darks:** the hero sits on `#141414`; bands 3, 6 and 8 are pure
`#000`. Earlier notes treated the dark surface as a single tone — it is not.

## 5. Media inventory

Where video is, and where it is not. This is what the frames are sized for.

| Band | Kind | Ratio | Desktop size | Video attributes |
|---|---|---|---|---|
| 0 | **video** ×2 (×1 below 1440) | 1:1 | 220×220 | `autoplay` **on**, loop, muted, playsinline, poster, `object-fit: cover` |
| 0 | image ×4 | 1:1 | 180×180, 140×140 | — |
| 1 | image ×4 | 1:1 | 250×250 (all breakpoints) | — |
| 2 | **video** ×1 | 16:9 | 1440×810 full-bleed | `autoplay` **off**, loop, muted, playsinline, poster, `cover` |
| 3 | image ×4 | 1:1 | 250×250 (all breakpoints) | — |
| 4 | image ×3 | 1:1 | 50×50 icons | — |
| 5 | image ×1 + ×3 | 1.53:1 + 1:1 | 548×358 + 3×347 | — |
| 6 | image ×9 | mixed (1.13–11.18) | logo strip | — |
| 7 | **video** ×2 | 9:16 portrait | 357×636 | `autoplay` **off**, loop, muted, playsinline, poster, `object-fit: fill` |
| 8 | image ×1 + ×2 | 1.21:1 + 3.09:1 | 704×580 + badges | — |

**5 videos total** at desktop, 4 below. Only the hero video autoplays; the
other three are poster-first and start on interaction.

Note the 250×250 tiles hold that exact pixel size at every breakpoint — they
do not scale with the viewport.

## 6. What this means for the rebuild

1. Strip reveal animations; keep `opacity .3s ease` hover only.
2. Header fixed and transparent, overlaying the hero.
3. `max-width: 1120px`, `padding-inline: 20px`, vertical `100px` / `60px`.
4. Two darks, not one.
5. Media frames at the measured ratios, with video where video actually is —
   and the hero video the only autoplaying one.
