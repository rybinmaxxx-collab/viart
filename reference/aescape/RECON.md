# Aescape — Technical Recon

**Target:** https://www.aescape.com/
**Captured:** 2026-08-27
**Tool:** `web-clone` v1.6.0 — `recon-site`, `route-crawl`, `interaction-probe`, `network-capture`, `dna-scaffold`
**Scope:** measurement only. No images, copy, fonts, or media were downloaded into this repository.

---

## Headline finding: the site is Framer-generated

This is the single most important fact for anyone planning to reconstruct it, and it changes what this recon is worth.

- 8396 `framer` markers in the served HTML.
- Asset host is `framerusercontent.com` (52 of 75 requests); runtime from `app.framerstatic.com`.
- Framework probes for React, Next, Vue, Nuxt, Svelte, Astro all return **false** — Framer ships its own bundle, so no recognisable app framework is exposed.
- `three`, `gsap`, `lenis` all **false**. There is no third-party animation or smooth-scroll library to mirror.

Consequences:

| What you might expect to extract | What actually exists |
|---|---|
| Semantic section structure | `counts.sections = 1`. The page is a div tree; that one `<section>` is a carousel style block. |
| Named CSS custom properties | Opaque UUID tokens: `--token-8953aa2a-d438-4f93-8c11-70f64544e1cf: #9692ce` |
| A spacing scale | None. Framer emits per-element absolute values. Nothing to recover. |
| Component architecture | Hashed class names over generated markup. Not portable. |
| Motion timings/easings | Held in the Framer runtime, not in computed styles. Not introspectable. |

**What this recon can legitimately give you:** the colour palette, the type scale, the route map, the media proportions, breakpoint *behaviour*, and evidence of which interactions change state.

**What it cannot give you:** a spacing system, a component model, or motion curves. Those are not hiding somewhere harder to reach — they do not exist as recoverable data. Anyone reconstructing this has to author them.

---

## Capture environment

Chromium in this sandbox has no direct network egress (`ERR_CONNECTION_RESET` to every host, proxied or not), while Node and curl do. Two fixes were needed before any script could run:

1. **Transport** — a local Node forward proxy (`CONNECT` tunnel + plain HTTP) so Chromium's traffic is relayed by a process that has egress.
2. **Trust** — the sandbox intercepts TLS with its own CA. Chromium reads NSS, not the system store, so the six Anthropic interception CAs from `/root/.ccr/ca-bundle.crt` were installed into `~/.pki/nssdb` via `certutil`. TLS verification stays **on**; it was not bypassed.

A portability fix was also made to the skill itself: `scripts/lib/playwright-loader.mjs` now honours `HTTPS_PROXY`/`NO_PROXY`, so all six browser-driving scripts work unmodified.

Both fixes are environmental. Neither alters what was measured.

---

## What was captured

| Artefact | Path |
|---|---|
| Multi-width recon (1440/768/390) | `RAW/original-recon.json`, `RAW/original-summary.md` |
| Screenshots | `RAW/screenshots/original-{1440,768,390}.png` |
| Route map, 16 routes | `RAW/routes/original-route-map.json` |
| Interaction probe, 22 actions | `RAW/interactions/original-interactions.json` |
| Network capture, 75 requests | `RAW/network/original-network.json` |
| Served homepage HTML | `RAW/home.html` |

Derived documents: `DESIGN_DNA.json`, `SECTION_MAP.md`, `MOTION_MAP.md`, `ROUTES.md`.

---

## Page metrics

| | 1440px | 768px | 390px |
|---|---|---|---|
| Page height | 8417px | 12262px | 10541px |
| Images | 37 | 35 | 35 |
| Video elements | 5 | 4 | 4 |
| Buttons | 21 | 21 | 18 |
| Canvas | 0 | 0 | 0 |

Body text is only ~3128 characters against 8417px of page height — this is an image- and video-led layout, not a text-led one. Note 768px is *taller* than 390px: the tablet width stacks content that the phone width instead drops or collapses.

## Network profile

75 requests: 32 script, 26 image, 5 font, 5 fetch, 3 media, 2 document, 1 stylesheet, 1 ping.

A single stylesheet against 32 scripts is characteristic of Framer — styling is largely injected at runtime, which is a second reason static CSS extraction yields little.

Third parties observed: Google Analytics, Google Tag Manager, Google Fonts, a Shopify storefront (`tqbtkd-1n.myshopify.com`), and a Cloudflare Worker backend (`frameship-backend.account-ba7.workers.dev`). Commerce is Shopify-backed, not native.

## Console health

52 console errors during the interaction probe, including a repeated `RangeError: Invalid language tag: en-US@posix` that crashes a code component during render, plus a 403 on one resource. Worth knowing if you benchmark against this site: some of what you would be reproducing is broken.

---

## Fonts — do not reuse

Detected: **ABC Repro** (Screen / Regular / Medium / Bold / Bold Italic) and **Nyght Serif Medium Italic**, both commercially licensed, plus **Inter** and Framer defaults (Bricolage Grotesque, DM Sans) that appear to come from embedded widgets.

No font files were downloaded. Web font licences essentially always forbid rehosting. Substitute at reconstruction time.

---

## Caveats

- Values are computed output at three widths, not authored source. Framer's own breakpoints were not enumerated.
- The type scale was read at 1440px. Per-breakpoint overrides exist and were not captured.
- Motion figures anywhere in this package are **observations of state change**, never measured durations or easings.
- Screenshots in `RAW/screenshots/` are renders of Aescape's copyrighted pages. They are internal reference only — do not ship them, publish them, or commit them to a public repository.
