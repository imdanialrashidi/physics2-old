# Homepage clarity, maker signature, mobile-first polish

Status: complete (one pre-existing defect found and left out of scope)
Updated: 2026-10-24

## Goal

Make a new learner's first screen unambiguous (what this is, where to start, what to do next), make the
creator identity a deliberate product signature, and make every major page genuinely usable at 360–430 px
while keeping the lab-notebook identity (field ruler, charge ribbon, paper surfaces).

## Non-goals

- No new features, content, mastery logic, accounts, backend or runtime services.
- No architecture change: same Vite + build-time KaTeX + vanilla TS pipeline, same tokens.
- No redesign of the concept page's five layers or the simulation set.

## Acceptance contract

- [x] A1 — Home has exactly one primary CTA, named `شروع یادگیری`, linking to the first lesson; at
      390×844 the kicker, title, lede and that CTA are all inside the first screen, with no figure above
      the title. Proof: `tests/browser/site.spec.mts` "the home page offers one primary action, above the
      phone fold" (passes on mobile + desktop) + inspected 390/430/768 first screens.
- [x] A2 — Every page carries a maker band with `ساخته شده توسط دانیال رشیدی`, `imdanialrashidi.github.io`
      and an `@imdanialrashidi` link whose href is exactly `https://t.me/imdanialrashidi`. Proof: the
      browser test above on `/`, `/concept/coulomb/`, `/formulas/` + inspected maker-band crops at 390 and
      1360 + 19/19 contrast roles green (including both identity links).
- [x] A3 — At 360/390/430/768/1024/1360 over 9 routes: zero horizontal overflow, no laid-out control
      below 32 px at ≤ 1024, nothing clipped. Proof: 54-capture geometry sweep, 0 problem rows, before and
      after; plus the browser widths spec (now also visiting `/lessons/part-1/` and `summary`).
- [x] A4 — Intentional phone composition: hero copy before the figure, the plate capped, the ladder a
      vertical numbered sequence, filter bars give the search field its own row, four identical card rows
      gone. Proof: inspected 360/390/430/768 screenshots + the hero-order assertion in the new test.
- [x] A5 — Identity and quality preserved: field ruler and charge ribbon still present, contrast spec
      green, reduced motion honoured (browser test + `.artifacts/shots/nojs/home-reduced-390.png`), no new
      colour literal outside documented tokens, 0 console errors and 0 failed requests across 54+ captures.
- [x] A6 — No functional regression: 27 unit tests, 4 consistency tests, 67-page build with 0 coverage
      gaps, typecheck clean, 50/54 browser tests passing (the 4 failures are pre-existing, below).

## Confirmed current state

- Baseline home at 390 px measured: header 61 px, hero figure ~296 px tall **above** the h1, first CTA
  top edge at y≈795 px. At 768×1024 the full-width canvas took 594 px and the CTA sat at y≈995 px.
- Baseline home: four consecutive equal-weight card rows (ladder 5 / start 4 / entry 4 / why 4) plus a
  4-number stat block — the "dashboard" reading the owner asked to remove.
- `@imdanialrashidi` / t.me appeared nowhere in the build.
- Defects the width sweep found and this slice fixed: 28 px disclosure summaries, 27 px concept links on
  the lesson page (the sweep had never visited it), a segmented option clipped by `.sim`'s `overflow:
  hidden` at 768 px, and a trailing `←` wrapped onto its own line inside flex `.inline-link`s.

## Decisions

- Single hero CTA `شروع یادگیری` → `lessons/part-1/`; the two former pills become one quiet text link
  and one spec line.
- Hero copy leads on every stacked width (≤ 880 px) and the plate is capped at 520 px (80 % on a phone) —
  supersedes the 880 px "figure first" rule; the desktop two-column layout is untouched.
- `[data-next-concept]` ships the first-concept card as its no-JS fallback and is replaced in place by the
  script, so the section shows one card instead of two with different weights (verified without JS).
- Homepage quick access became a notebook index (6 hairline rows) and "why" a numbered margin list; both
  keep their copy.
- Maker band = a colophon at the foot of every page on `--paper-3` with the field-ruler grid, reusing
  `.footer-made` / `.footer-domain`; Telegram uses the existing `--neg` blue and a new `send` glyph.
- Touch floor: `.primary/secondary/ghost/tool-button`, `.chip`, `summary`, `.concept-row-body h3 a` and
  `.hero-maker a` now reach 40–44 px at ≤ 1024 px.

## Evidence

- `node .artifacts/capture.mjs base|first|crops|regions|states|widths|tablet` — screenshots + geometry.
- `npx playwright test` → 50 passed, 4 failed (all pre-existing, see below).
- `npm run ci` → typecheck, 27 unit tests, build (67 pages, 0 gaps), 4 consistency tests: pass.
- CSS 16.97 kB → 18.07 kB gzip for the whole slice; entry JS unchanged at 4.69 kB gzip; budgets updated
  in `docs/PRODUCT.md`, `docs/DESIGN.md`, `docs/QUALITY.md` to match reality.

## Follow-up (2026-10-05) — phone defects found in a screenshot of `/concept/charge-atom/`

The owner sent a phone screenshot of «اشتباهات رایج» and asked what else looked wrong on a phone. Four
defect classes were found, fixed and covered:

| Defect | Cause | Fix | Guard |
|---|---|---|---|
| The ✕/✓ mark rendered alone on its own 24 px row, with the sentence on the next and an empty paragraph after it | the block prose renderer was injected inside a `<p>` (`<p class="wrong"><span class="mark">✕</span><p>…</p></p>`), which is invalid nesting the parser repairs by closing the outer paragraph | inline prose inside the mark row; the other seven `<p>${renderProse(…)}</p>` sites unwrapped too | `tests/site/internal-consistency.test.mjs`: no built page nests a `<p>` in a `<p>` (fails on the pre-fix build, passes now) + a misconception row must carry text |
| A unit read `N\cdottpm²/C²` — raw LaTeX, then a red `\cdotp` | `symbol.unit` was `escapeHtml`d instead of rendered; the raw `·` (U+00B7) is not typesettable by KaTeX in `\text{}` | render the unit as prose/math; 15 content occurrences of `·` became `\cdot` outside `\text{}` | `tests/site/math-render.test.mjs`: an unsupported character is reported, and the build fails on it |
| Half of a long formula was invisible at 360–430 px (202 CSS px cut at 390) | two equations joined by `\qquad` on one display line inside a scrolling box | split on `\qquad` / `\Rightarrow` / `,\quad`, stack the parts in `.math-stack` | `tests/site/math-render.test.mjs`: stacked output has no separator text between the lines |
| A stray comma rendered on its own line between two formulas | array interpolation joined the rendered lines with `,`, and a bare text node in a grid becomes an anonymous row | `.join('')` | same test |

Measured after the fix: no formula clipped at 360/390/430 except a 3 px hair on one inline `\vec l` that
scrolls inside its own box; the 54-capture width sweep still reports 0 overflow / 0 small targets /
0 clipped elements; `npm run ci` green (29 unit + 6 consistency); Playwright 50 passed with the same 4
pre-existing `/does-not-exist/` failures.

## Out of scope, found while verifying

- **Pre-existing:** `dist/404.html` references its assets relatively, so a GitHub Pages deep link such as
  `/physics2/concept/does-not-exist/` renders unstyled. Proven pre-existing: `git archive HEAD` + build →
  `node scripts/check-subpath-build.mjs` reports the same three failures, and the two affected browser
  tests fail against that HEAD build with this change's spec. It breaks "header stays compact" (its route
  list ends in `/does-not-exist/`) and "404 page keeps its stylesheet at depth". Not caused by, and not
  fixed in, this slice; it needs a `vite.config` base/absolute-asset decision.

## Next actions

1. None for this slice.
2. Owner decision if desired: fix the 404 sub-path asset base as its own change.
