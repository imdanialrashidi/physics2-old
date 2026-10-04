# Product Design Contract

Visual and interaction source of truth for the Physics II learning site. Owner-stated direction and
agent-proposed values are kept apart; the CSS custom properties in `app/styles/main.css` own the
resolved values.

## Owner direction

From the owner's brief (own words, condensed):

- Style: playful, colorful, energetic, friendly; "cute without looking childish"; academically credible.
- Purpose: help a student who is weak in physics understand and practise Physics II; the finished site
  must be substantially more useful for learning than the raw notes.
- Not generic: no SaaS dashboard look, no repeated identical cards, no blind gradients/glassmorphism,
  no "AI landing page" aesthetics.
- Language: primarily Persian, RTL, proper mathematical typesetting.
- Delivery: fully static, GitHub Pages compatible, fast, offline-safe, accessible, responsive.
- Header (2026-10-04, own words): «دکمه همبرگر منو در هدر رو از سمت راست بیار سمت چپ و بهترش بکن» — the
  menu button belongs at the **left**, i.e. the inline end in RTL, and it should be *better* than the
  plain hamburger pill it replaced. The placement is the owner's call and is implemented as asked;
  what "better" became — glyph, wording, sheet, tablet behaviour — is mine, below.
- Attribution: footer must show `ساخته شده توسط دانیال رشیدی` and `imdanialrashidi.github.io`.

Colors, exact radii, type scale, motion tokens and the two signature elements below are
**agent-proposed**, not owner-approved. They are recorded so later changes stay coherent.

## Experience brief

- Surface: a personal, single-subject learning site (course + tutor + practice lab).
- Primary audience: one undergraduate student who finds physics intimidating and forgets formulas.
- Single job: turn "I don't understand this" into "I can solve this".
- Feeling before → after: from "این اصلاً به من ربطی ندارد" to "می‌فهمم چرا این فرمول اینجاست".
- Success signal: the learner completes a concept, sees the physics change in a figure they control,
  and scores on the practice items for that concept.

## Direction

- Visual thesis: **دفتر آزمایشگاه روی میز** — a warm lab notebook where physics is drawn, not a
  dashboard that reports on physics. Paper, grid, ink and hand-placed vector arrows.
- Signature elements (two, deliberately):
  1. **خط‌کش میدان (field ruler)** — the 28 px graph-paper grid plus faint coordinate axes used behind
     the hero, cards and figures, so every screen belongs to the same notebook.
  2. **نوار بار (charge ribbon)** — progress shown as a row of small charge dots plus `۳/۴۷`, never a
     generic percentage bar; it also decorates the concept header as faint field-line circles.
- Restraint: one accent per lecture part, flat paper surfaces, shadows used only to lift paper off
  paper; no gradients except the two motivated ones (hero wash, concept-header field wash).
- Never generic: no stock hero image, no glassmorphism, no three-identical-card rows without a
  reason, no lorem-style "Features" grid.

## Semantic tokens (agent-proposed values)

Canonical code tokens: `app/styles/main.css` (`:root`). Contrast pairs measured from those tokens.

| Role | Token | Value | Pair | Contrast |
|---|---|---|---|---|
| canvas / surface | `--paper`, `--paper-2` | `#f7f2e7`, `#fffdf6` | body text on canvas | ≈ 14.5:1 |
| text / muted | `--ink`, `--ink-2`, `--ink-3` | `#191a2e`, `#454964`, `#656a86` | ink-3 on paper-2 | ≈ 5.0:1 |
| action / on-action | `--primary`, `--on-primary` | `#4c35d6`, `#ffffff` | button label | ≈ 8.2:1 |
| positive charge | `--pos`, `--pos-ink` | `#e13b2b`, `#b3271c` | pos-ink on paper-2 | ≈ 5.8:1 |
| negative charge | `--neg`, `--neg-ink` | `#1e7be8`, `#11529c` | neg-ink on paper-2 | ≈ 6.8:1 |
| accent (teal, Gauss) | `--teal`, `--teal-ink` | `#0e8f80`, `#0a6b5f` | teal-ink on paper-2 | ≈ 5.6:1 |
| accent (magenta, magnetism) | `--magenta`, `--magenta-ink` | `#d2266f`, `#a81857` | magenta-ink on paper-2 | ≈ 6.1:1 |
| focus | `--primary` | `#4c35d6` | 3 px outline, 2 px offset | ≥ 3:1 non-text |
| success / warning / danger | `--success-ink`, `--warning`, `--danger` | `#0a6b52`, `#a4610a`, `#c0281c` | on paper-2 | ≥ 5:1 |

Lecture-part accents (also agent-proposed), used as `--part-hue` with a `--part-tint` companion:

| Part | Hue | Tint | Glyph |
|---|---|---|---|
| ۱ بار و میدان | `#1e7be8` | `#e8f1fd` | field arrows |
| ۲ گاوس | `#0e8f80` | `#e2f5f2` | sphere |
| ۳ پتانسیل و خازن | `#b45309` | `#fbf0e0` | plates |
| ۴ جریان و مدار | `#ea580c` | `#fdeee1` | circuit |
| ۵ مغناطیس | `#d2266f` | `#fce8f1` | magnet |

Saturation rules: `--pos`/`--neg`/`--teal`/`--magenta` are graphic colours (dots, arrows, borders);
the matching `-ink` variants are the only ones allowed for small text.

## Typography

| Role | Family | Scale / weight | Purpose |
|---|---|---|---|
| display | Vazirmatn Variable | 800–900, `clamp(1.9rem → 3rem)` | page and section titles |
| body | Vazirmatn Variable | 420, 17 px / 1.85, measure 68ch | Persian teaching prose |
| utility | Vazirmatn Variable | 600–700, 0.78–0.9rem | pills, meta, controls |
| math | KaTeX | 1.08em, `.math-block` LTR-isolated | every formula |

Font source: `@fontsource-variable/vazirmatn@5.3.0` (OFL), bundled locally — no runtime font CDN.
Fallback stack: `Vazirmatn, IRANSans, Segoe UI, Tahoma, system-ui`. Math is always KaTeX and always
rendered at build time, so formulas never reflow after paint and read correctly with JS disabled.

## Geometry and depth

- Spacing scale: 4/8/12/18/28/44/68 px (`--space-1…7`); section rhythm uses 28–44 px, page padding 18 px.
- Radius: 8 px controls, 14 px cards, 22 px feature surfaces; pills are fully round.
- Depth: `--shadow-1/2/3` are paper lifts (1–3 px hard edge + long soft falloff), never glows.
- Borders: 1.5 px `--line`; one part-coloured 5–7 px edge marks the part of the current section.
- Icons: hand-authored inline SVG glyph set (`app/build/render.mjs`), 1.4–2 px strokes, no icon font.

## Media and art direction

- Figures are drawn with canvas 2D from the physics core; no raster images anywhere on the site.
- Every figure ships a text fallback (`visual.fallback`) that states the same idea in prose, so the
  learning never depends on seeing pixels.
- Illustrations are schematic: grid background, two-tone charges, labelled arrows — never decorative
  or stock.
- Asset licensing: Vazirmatn (OFL), KaTeX fonts (MIT), own SVG/canvas art.

## Composition and responsiveness

- Desktop: 1180 px shell; concept pages are content + 288 px sticky sidebar (TOC, prerequisites,
  formula index); hub pages use auto-fill grids.
- 1080 px: sidebar drops below the article as a three-column support row (article stays first).
- 880 px: hero stacks with the figure first; the header becomes one compact row and the nav moves
  into a panel that opens beneath it (see the decision log). The panel is only collapsible when
  `html.js` is set — without scripting the list simply wraps in place.
- 1024 px: touch-target floor applies (40 px minimum for map nodes, TOC, breadcrumbs, footer links,
  inline links and simulation controls). This is deliberately wider than the header breakpoint,
  because tablets are touched even though the header layout does not change there.
- 560 px: single column, tighter spacing, one-column simulation gallery, quiz options wrap, the
  nav toggle drops its label and becomes an icon.
- Long formulas scroll inside `.math-block` / `.math-inline` instead of pushing the page wide.
- RTL: `dir="rtl"` on `<html>`, logical properties throughout, Latin runs (`imdanialrashidi.github.io`,
  math, units) isolated with `direction: ltr; unicode-bidi: isolate`.

## Components and states

| Component | Variants | Required states | Note |
|---|---|---|---|
| concept card | part hue, difficulty dots | hover lift, filtered hidden | filters use the `hidden` attribute |
| formula card | compact (side index) / full | copy → "کپی شد ✓" → back | clipboard failure shows "کپی ناموفق" |
| step (example) | closed / open / all-open | `details` + reveal-all + reset | works with JS disabled |
| quiz item | mcq / numeric | unanswered, correct, wrong, invalid | explanation opens after any answer |
| simulation | canvas figure | loading, interactive, fallback text | failure keeps the prose fallback |
| callout | tip, supplement, lost, source | collapsed/expanded | "lost" is always reachable |
| search dialog | open / empty result / no index | keyboard `/`, Esc, focus return | focus trap while open |
| menu trigger | labelled (≤880 px) / icon-only (≤560 px) | closed, open, focus, no-JS (absent) | the icon-only form keeps the visible word in `aria-label` |
| empty state | explorer, formulas, glossary, search | message + recovery hint | never a blank grid |
| progress panel | stored / storage unavailable | lists both states | says "فقط تا بستن صفحه" when storage fails |

Journey states: loading (figure placeholder text), empty (search + filters), error (simulation
fallback, clipboard), success (copy, quiz score, "این مفهوم تمام شد"), offline (no storage needed).

## Motion and feedback

- Orchestrated moment: the home hero canvas animates the two-charge field; simulations animate only
  while they teach (drift, RC, magnetic path) and always offer play/pause/reset.
- State transitions: 120–160 ms colour/transform; no layout animation.
- Reduced motion: `prefers-reduced-motion` stops the hero loop, disables transitions, and figures
  still render a correct static frame (proved by a browser test).

## Content voice

- Vocabulary: Persian term + English scientific term on first use (`میدان الکتریکی (Electric Field)`),
  then Persian only. Terminology matches the notes.
- Tone: plain, direct, encouraging; never babyish, never robotic. Explain before naming.
- Action labels: verb-first Persian ("بررسی پاسخ", "فهمیدم، این مفهوم تمام شد").
- Error/empty copy always offers the next step instead of apologising.

## Quality budgets

- Accessibility: WCAG 2.2 AA; keyboard path for search, quiz, steps, dialogs; 3 px focus ring.
- Contrast: text ≥ 4.5:1, non-text ≥ 3:1 (values above are measured from the shipped tokens).
- Performance: first-party JS ≤ 15 kB gzip per page entry plus lazily loaded chunks; CSS ≈ 16 kB gzip;
  fonts only for glyphs actually used; no third-party runtime requests at all.
- Target: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 on a mid-range phone over 4G (design budget, measured
  locally only — see the report).
- Browsers: current Chrome/Edge/Firefox/Safari desktop and mobile; RTL text tested at 360 px.

## Screen acceptance

| Flow / screen | Critical states | Viewports | Proof |
|---|---|---|---|
| home | hero, ladder, next-concept, weak areas | 1360, 390 | `tests/browser/site.spec.mts` + screenshots |
| part page | concept list, part completion | 1360 | browser test |
| concept page | five layers, rescue, steps, quiz | 1360, 390 | browser test + screenshot |
| simulation gallery | 14 figures, controls, fallback | 1360, 390 | browser test + screenshot |
| formulas / concepts / glossary | filter, empty state | 1360 | browser test |
| practice | wrong answer, retry, persistence | 1360, 390 | browser test |
| map | prerequisite chain | 1360 | browser test |
| 404 | unknown deep link | 1360 | browser test |

## Decisions intentionally deferred

- Dark theme (tokens exist structurally; not requested and unverified for contrast).
- Offline service worker (no third-party runtime dependency is required today; caching is deferred).
- Print/PDF export of a part.

## Decision log

| Date | Decision | Evidence / rationale | Revisit when |
|---|---|---|---|
| 2026-10-03 | Vite + vanilla TypeScript + build-time KaTeX, no UI framework | owner asked for lightweight/static; bundle stays ≈ 4 kB gzip per chunk | if interactive complexity outgrows hand-written modules |
| 2026-10-03 | Content authored as `.mjs` data, not Markdown-at-runtime | build-time coverage check is the real integrity guarantee | never |
| 2026-10-03 | Field-ruler grid + charge ribbon as the two signatures | owner asked for "distinctive, not generic"; both are physics-derived, not decorative | if a third motif is introduced, retire one |
| 2026-10-03 | §6.1 arithmetic slip in the notes shown as a marked correction | re-derived value 5.63×10⁷ N/C; the note's own line is inconsistent | if the owner prefers silent alignment with the note |

### Agent-proposed refinements (2026-10-24) — new, not owner-approved

These keep the two signatures and the notebook thesis intact; they change *proportion and
interaction*, not the visual idea.

| Area | Refinement | Why | Revisit when |
|---|---|---|---|
| Composition → 880 px | **Phone header as one row plus a disclosure panel** (`nav-toggle` + `#site-nav-panel`) instead of a second horizontally scrolling nav row | measured: the old header cost 112 px = 14 % of a 760 px viewport on *every* page, and its nav `scrollWidth` exceeded `clientWidth` by 101 px at 360 px, hiding «واژه‌نامه» with no affordance. Now 60 px (7 %) and nothing clipped | if a bottom-navigation pattern is ever adopted |
| Header | The trigger only appears once `html.js` is set by the client | a hamburger that cannot open because a chunk failed would hide the whole navigation; without scripting the list stays expanded and reachable | never |
| States | Current section marked with a 3 px inset edge **and** `aria-current`, not colour alone | DESIGN.md already forbids colour-only state; the panel made it necessary to be explicit | never |
| Touch targets ≤ 1024 px | Map nodes, TOC, breadcrumbs, footer links, inline links and simulation controls get a 40 px minimum | they measured 22–28 px; on the study map a near-miss silently follows the wrong prerequisite chain | if the map gets its own mobile treatment |
| Motion | A single interaction block: 1 px `:active` press, 0.12 s colour/transform, `paper-reveal` on open disclosures | the site previously had **no** press feedback and no disabled styling at all | never |
| Reduced motion | Effects are *removed*, not shortened, under `prefers-reduced-motion` | a 1 ms transform is still a 1 px jump | never |
| Copy button | `.is-copied` / `.is-failed` states carried by glyph + wording as well as colour | the previous confirmation was text-only with no visual state | never |
| Simulations | One authoritative `resetControl` per figure (shared, DOM-driven) | 12 of 14 figures had no way back to their starting state | never |

### Agent-proposed refinements (2026-10-04, phone menu trigger) — new, not owner-approved

Raised by the owner's «بهترش بکن» on the menu button. Placement is the owner's; everything else here is
mine and can be reverted independently. Measured numbers come from the built site in Chromium.

| Area | Refinement | Why | Revisit when |
|---|---|---|---|
| Header → placement (**owner**) | The trigger is the last child of `.header-inner`, and `.header-actions` takes `margin-inline-start: auto`, so the trigger sits on the row's inline-end edge — the left in RTL — with the search and progress pills grouped beside it | asked for. Measured before: the trigger was the first child, i.e. the right edge. Being *last* is not enough: with the free space left over, it floated in front of dead paper. Now `toggle.left == row content edge` at 360, 390, 560, 700, 820 and 880 px | if the site ever ships an LTR mirror |
| Glyph | Field lines with a double-headed axis between them — the part-badge field motif at menu scale — swapping to a `×` when open | arrowheads on all three lines were rendered and rejected on inspection: at 20 px they collapsed into a blob. One axis stays a legible three-line menu and is this product's own motif | if a third menu-shaped control appears |
| Open/closed wording | The label swaps «فهرست» ↔ «بستن», and `aria-label` always equals the visible word | below 560 px the label is hidden, so the state would otherwise live in a shape and a colour alone; DESIGN already forbids colour-only state | never |
| Open state surface | `--paper-3` fill with a `--primary-ink` border and ink, 140 ms cross-fade on the glyph | matches the paper language of the sheet it opens; measured 10.79:1 for the open label | never |
| Panel | The open nav is a lifted sheet — `--paper-2`, 1.5 px `--line`, `--radius`, `--shadow-2`, internal scroll, `paper-reveal` — not six pills on the bar's own colour | the old panel was visually indistinguishable from the header background, the generic look DESIGN's anti-template rule forbids | if the panel ever becomes a full-screen drawer |
| Composition → 561–880 px | The sheet leaves the flow and hangs from the trigger, anchored to its inline-end edge, max 320 px wide | measured: the push-down sheet cost a tablet 377 px of header — 42 % of a 900 px viewport — to list six words. The header now stays 60 px. Below 561 px it still pushes, which is the thumb-reachable pattern DESIGN accepted for phones | if a tablet-specific nav is designed |
| Current-section marker | A 3 px bar element on the row's reading-start edge plus the `--paper-3` fill, never colour alone | as an inset shadow the marker was clipped by the pill's 999 px radius into a crescent floating beside the row instead of an edge on it | never |
| Tap outside | A `pointerdown` outside the header closes the sheet and leaves focus where the learner put it | on a tablet the sheet floats over content, so a stray tap would otherwise leave a sheet hanging over the page | never |
