# Physics II interactive learning site (Persian RTL)

Status: complete — implemented and verified
Updated: 2026-10-03

## Goal

Turn the five Persian Physics II lecture notes in `Lecture notes/` into a static, GitHub Pages-ready
interactive learning site: layered concept pages, real simulations, a formula handbook, a practice
engine, search, progress and a study map.

## Non-goals

No backend, database, auth, server API, runtime AI call or secret. No silent change of the notes'
meaning, ordering or terminology.

## Acceptance contract — final state

- [x] **A1 source coverage** — all five notes parsed at build time; 73 numbered sections mapped to
      47 concepts or explicitly declared non-teaching; Part 1's 15 syllabus bullets and all Part
      2–5 topic bullets matched mechanically; 0 gaps. `node app/build/build.mjs --coverage-only`
- [x] **A2 every key formula** — all 67 boxed/key formulas of the notes exist on the site
      (expression-level comparison, `expressionKey`), verified by the build and by
      `tests/site/content-integrity.test.mjs`.
- [x] **A3 layered teaching** — intuition → figure (+ text fallback) → maths (symbol legend,
      units, when to use / when not) → worked example with revealable steps → misconceptions →
      practice with explanations → «این قسمت رو نمی‌فهمم» rescue → related concepts.
- [x] **A4 real interactivity** — 14 figures compute through `app/physics/*.ts`; the browser suite
      drives every control of every figure and requires the read-outs to change.
- [x] **A5 static + GitHub Pages** — 67 static pages, relative assets, deep links, 404 page;
      proved under a `/physics2` sub-path by `scripts/check-subpath-build.mjs`.
- [x] **A6 responsive + accessible** — 1360 px and 390 px browser suites green; 15 measured text
      roles pass WCAG 2.2 AA contrast; keyboard search/focus-return verified; no horizontal
      overflow; RTL document with LTR-isolated math.
- [x] **A7 offline-safe** — no third-party runtime request; works with `localStorage` disabled;
      reduced motion keeps a correct static figure.

## Confirmed current state

- `npm run build` → 67 pages, 4.3 kB gzip entry JS, 15.7 kB gzip CSS, lazily loaded figure chunks.
- `bash scripts/verify.sh` (harness gate) runs typecheck → 21 node tests → coverage → build →
  sub-path check, all green.
- `npx playwright test` → 36 browser tests (18 desktop + 18 at 390 px) green.
- Content: 47 concepts, 49 practice questions, 71 formulas, 52 glossary entries.

## Defects found and fixed during verification

1. `<p>` nested inside `<p>` in quiz prompts broke the DOM and created 6.4 kB page overflow.
2. The stylesheet was never linked (Vite manifest lookup by entry key); the whole site rendered
   unstyled and pages scrolled sideways.
3. Inline math in single-quoted JS strings lost backslashes (`\f` → formfeed, `\v` → VT), breaking
   formulas; a control-character test and `String.raw` content now prevent regressions.
4. `expressionKey` stripped backslashes before expanding `\frac`, so coverage matching produced
   false gaps.
5. Part 1 §6.1 of the notes: `E₂₄ = E₂ + E₄ = 9/4×10⁷` is internally inconsistent — both fields point
   at the negative corner, so `E₂₄ = 9/2×10⁷` and `E ≈ 5.63×10⁷ N/C`. Shown as a marked correction.
6. Focus was stranded on the hidden search input after Escape; a focus trap and focus return were added.
7. Part accent colours failed 4.5:1 as text; `ink` variants introduced and measured.

## Decisions

1. Content is node-importable `.mjs` data, not runtime Markdown: enables the coverage gate.
2. KaTeX renders at build time: zero runtime math JS, no reflow, works with JS disabled.
3. Directory-style static URLs + relative assets: GitHub Pages sub-path safe with no base config.
4. Physics core is DOM-free TypeScript, unit-tested against the notes' own published answers.

## Verification evidence

- `npm run ci` / `bash scripts/verify.sh` — PASS
- `node --test tests/site/*.test.*` — 21 pass
- `npx playwright test` — 36 pass (desktop + 390 px)
- `node app/build/build.mjs --coverage-only` — 5 notes, 73 sections, 0 gaps, 67/67 key formulas
- `node scripts/check-subpath-build.mjs` — PASS
- Screenshots inspected: home, part, concept, simulation gallery, formulas, practice, map, 404,
  desktop + mobile.

## Remaining risks

- The palette, type scale and motion tokens are agent-proposed (recorded in `docs/DESIGN.md`).
- Perf budgets are design targets measured locally, not RUM/field data.
- CI runs the node lanes and the build; the Playwright suite runs locally because the workflow
  image has no browser cache.
- Delivery: `ai-pr.mjs prepare` requires a clean worktree and the owner's untracked
  `Lecture notes/` blocks it — reported rather than worked around.