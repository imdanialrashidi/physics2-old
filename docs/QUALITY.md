# Quality Contract

What "done" means for this project, and which check proves what. Test design rules live in the
`test-design` skill; this file records the product-specific decisions.

## Verification lanes

| Lane | Command | Proves |
|---|---|---|
| Physics unit tests | `node --test tests/site/physics.test.ts` | the numbers the site teaches match the notes' own worked answers (1.8 N, √2/2, −82.86 µC, 55.2 µC, 63 % …) |
| Content integrity | `node --test tests/site/content-integrity.test.mjs` | five notes parsed, zero coverage gaps, every concept layered, no broken LaTeX, every generated page exists |
| Math rendering | `node --test tests/site/math-render.test.mjs` | build-time typesetting, escaping, and failure reporting |
| Coverage report | `node app/build/build.mjs --coverage-only` | section/formula/topic coverage per note, printed in Persian |
| Static build | `npm run build` | hashed assets + 67 static pages, no placeholders |
| Sub-path check | `node scripts/check-subpath-build.mjs` | GitHub Pages project-site behaviour (relative assets, deep links, 404) |
| Browser journeys | `npx playwright test` (desktop + 360 px) | navigation, search, quiz explanations, persistence, figures, focus, overflow, storage failure, reduced motion |
| Full gate | `bash scripts/verify.sh` | harness doctor + everything above |

## Rules

- Every physics claim the site teaches has an oracle: the notes' own numbers or a re-derived value.
- Content gaps fail the build; they never ship quietly.
- Simulations must change read-outs, not just pixels: the browser suite moves real controls.
- Failure paths are part of the product: empty search, wrong answer, retry, missing storage,
  broken/optional asset, reduced motion, unknown URL.
- Visual review uses real screenshots of the served build (desktop + narrow mobile), not source reading.

## Test-value decisions

- Added: physics unit tests (note answers as oracles), content integrity, browser journeys. Each
  covers a defect class that actually occurred during this build: wrong sign in a worked example,
  missing note coverage, LaTeX corrupted by JS escapes, canvas figures not reacting, focus stranded
  in a hidden dialog.
- Not added: unit tests for DOM helpers or CSS (no defect class, high maintenance), snapshot tests
  (would freeze layout instead of behaviour), performance budgets as CI gates (no stable baseline).

## Product quality bar for changes

- New concept ⇒ must be added to the registry with all layers, source refs, practice and rescue, or
  the build fails.
- New figure ⇒ must compute through `app/physics/*`, expose text fallbacks, and be listed in the
  gallery; the browser suite will pick it up.
- Visual change ⇒ re-screenshot desktop and mobile before claiming the criterion.
- Never weaken `app/build/coverage.mjs`, the physics oracles, or the browser assertions to make a
  change green.
## Visual excellence

Applies to every user-facing change here; the detailed rubric lives in
`.pi/skills/frontend-design/references/visual-quality-rubric.md`.

Hard gates (any failure ⇒ `NOT READY`, craft score is irrelevant):

1. The learning journey works; no accepted control is decorative — every slider/button changes a real number.
2. No overflow, clipping or unreadable overlap in the required states (1360 px and 390 px).
3. Keyboard order, visible 3 px focus, accessible names and semantic controls.
4. Colour is never the only carrier of meaning; contrast is measured, not assumed (`tests/browser/contrast.spec.mts`).
5. `prefers-reduced-motion` is honoured without removing information.
6. Loading, empty, error, success and storage-unavailable states are coherent.
7. No uncaught console error or failed critical request.
8. Budget: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 as the production target; until field data exists, a
   repeatable lab baseline is required (entry JS 4.7 kB gzip, CSS 18.1 kB gzip measured 2026-10-24,
   no third-party requests).

Anti-template review (run before calling a visual change done):

- Would a generic SaaS dashboard, a gradient-blob landing page, or an identical three-card row fit this
  screen unchanged? If yes, the screen is not product-specific yet.
- Does the page still show the two signatures (field-ruler grid, charge ribbon) or has drift crept in?
- Is every section shape doing a job the design contract names, or is it decoration?

Craft score: 0 absent/broken · 1 generic/weak · 2 competent · 3 strong · 4 distinctive.
Threshold to ship a visual change: no unresolved hard-gate failure **and** an average of at least
3.25/4 across the rubric dimensions, judged from inspected desktop and mobile screenshots.
