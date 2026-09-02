# Aescape — Route Map

Captured by `route-crawl` (max-depth 2, max-pages 25, 1440px). **16 routes discovered, all returning 200.**

Raw data with per-route screenshots: `RAW/routes/original-route-map.json`.

Page titles are omitted below; routes are grouped by function. See the raw JSON if you need the exact titles.

---

## Consumer funnel

| Route | Function |
|---|---|
| `/` | Homepage — the deeply built page; all measurements in this package come from here |
| `/sessions` | Session offering / booking entry |
| `/packages` | Packages and gift purchase |
| `/faq-general` | Consumer FAQ — booking and session questions |

## Business / partner funnel

| Route | Function |
|---|---|
| `/business` | B2B proposition for operators |
| `/partner` | Partner programme |
| `/pricing` | Hardware investment and ROI calculator |
| `/faq-partner` | Operator-facing FAQ |

## Product

| Route | Function |
|---|---|
| `/aescape-one` | At-home product line |

## Company

| Route | Function |
|---|---|
| `/about` | Company positioning |
| `/careers` | Recruiting |
| `/contact` | Contact |

## Legal

| Route | Function |
|---|---|
| `/privacy-policy` | Privacy policy |
| `/terms-of-use` | Terms of use |
| `/store-terms` | Store terms |
| `/store-refund-policy` | Store refund policy |

---

## Observations

**Two parallel funnels.** The information architecture splits cleanly into consumer (sessions, packages, general FAQ) and business/partner (business, partner, pricing, partner FAQ), each with its own dedicated FAQ. Both are reachable from the homepage — the top strip and band 8 are both B2B inquiry prompts. This dual-audience structure is the most transferable architectural decision on the site.

**Commerce is Shopify.** `/packages` and the cart run against `tqbtkd-1n.myshopify.com`, not a native checkout. Anyone budgeting a rebuild should treat commerce as an integration, not a build.

**Two legal routes are mislabelled.** `/store-terms` and `/store-refund-policy` both serve a page titled as the privacy policy. Either a routing defect or placeholder content on the live site. Flagged for accuracy, not for copying.

**Crawl limits.** Depth 2 from the homepage, cap 25, single width. Location/booking pages behind interactive selectors, and any authenticated or parameterised routes, were not reached. 16 is the discoverable static surface, not necessarily the complete route set.
