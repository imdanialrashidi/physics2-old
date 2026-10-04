# Physics II site upgrade — P0 correctness, P3 simulations, P4 polish, mobile-first

Status: active
Updated: 2026-10-24

## 1. Goal and non-goals

**Goal.** Make the existing static Persian RTL Physics II site more scientifically trustworthy,
genuinely more interactive, visibly more polished, and substantially better on a phone — by
correcting and mechanically guarding numerical content, deepening the existing simulations, and
redesigning the global header/nav mobile-first. Preserve the lab-notebook visual identity,
content model, coverage gate, GitHub Pages `/physics2/` compatibility and no-JS readability.

**Non-goals (hard scope boundary).** Mastery systems, adaptive learning/recommendations, mistake
notebook, diagnostic test, spaced repetition, guided tutor, formula decision engine, exam mode, new
learning-progress algorithms, IA replacement, backend, auth, database, server API, AI chatbot, 3D
engine. Also out of scope: rewriting content that is already correct, replacing the build pipeline,
or introducing a UI framework. Desirable out-of-scope ideas are recorded as future suggestions in
the final report only.

## 2. Acceptance contract

| # | Criterion | Proof required |
|---|---|---|
| A1 | The `3×10⁻⁶ × 2000` Electric Field defect is corrected to `6×10⁻³ N` in **all three** places (option `a`, option `d`, explanation), the option set has **exactly one** correct answer, and the fix is live in the build | grep `10^{-9}` returns nothing in that question; new/repaired node test asserting the numeric relationship fails when reverted |
| A2 | A reusable deterministic content-QA oracle exists and is run: every declared numerical claim is re-derived from its expression **and** asserted against the actual content string | `npm test` runs it; it fails when a displayed number is changed; report lists audited / passed / failed-before / repaired / unverified with `PASS`/`FAIL`/`UNPROVEN`/`BLOCKED`/`NOT EXECUTED` |
| A3 | Internal consistency is proven, not assumed: header progress total equals the real concept count **with JS disabled**; every displayed aggregate is derived from the registry; no broken concept/route reference | node assertion + rendered-HTML assertion on the no-JS build output |
| A4 | Every P3 simulation responds to its controls, resets, and is usable at 360–430px; the two genuinely new trainers exist; the six upgraded sims expose the relationships named in the request | browser test per sim: initial state + ≥2 changed states + reset + numeric read-out change; inspected screenshot at 360/390/430 |
| A5 | Header/nav is redesigned mobile-first: compact, no horizontal nav clipping, reachable search + progress, current section obvious, ≥32px touch targets, no hover-only interaction | inspected screenshots at 360/390/430 plus browser tests for open/close, nav, search; **no horizontal overflow** at all six widths |
| A6 | P4 polish preserves the two design signatures (field-ruler grid, charge ribbon) and the `docs/DESIGN.md` thesis; micro-interactions are fast, interruptible and disabled under `prefers-reduced-motion` | `frontend-design` product + studio pass against `docs/DESIGN.md`; reduced-motion browser test green; no hard-gate failure |
| A7 | The site stays static and `dist/` is correct under `/physics2/`; console is clean; no new runtime dependency | `SITE_BASE=/physics2 npm run build` + `check-subpath-build.mjs` PASS; console/network check; dependency diff empty |

Out-of-scope items implemented ⇒ immediate `FAIL`.

## 3. Confirmed facts, constraints, assumptions, unknowns

**Baseline verified today (`PASS`).** `npm run ci` green: typecheck 0 errors, 21 node tests pass,
build 67 pages (5 notes / 73 sections / 47 concepts / 49 questions / 0 coverage gaps / 67-of-67 key
formulas). `SITE_BASE=/physics2 npm run build` + `node scripts/check-subpath-build.mjs` PASS.
Live site `https://imdanialrashidi.github.io/physics2/` returns 200.

**Constraints (from `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/GIT_POLICY.md`).**
Static, no backend/API/secrets/DB; relative assets; depth-relative routing with `SITE_BASE` only for
the 404 page; KaTeX at build time with `trust:false`; content gaps fail the build; figures must
compute through `app/physics/*` and ship a text fallback; `app/build/coverage.mjs` and the physics
oracles may never be weakened to obtain green. Single writer in the `ai-changes` lane.

### Defects confirmed by evidence

- **D1 — the known arithmetic defect is real and live.** `app/content/part-1a.mjs:96-102`
  (question `p1-field-1`, answer key `a`). Asserts `3×10^{-6}×2000 = 6×10^{-9}` in option `a`, in
  option `d`, and in the explanation `aria-label`. True value `6×10^{-3} N`. Present in
  `dist/concept/electric-field/index.html` and `dist/concept/point-charge-field/index.html`.
  The option set is also degenerate: `a`/`d` share a magnitude and differ only by direction, and
  `c` already carries the correct magnitude with the wrong direction.
- **D2 — QA gap that let D1 ship.** `tests/site/physics.test.ts` oracles cover only pure functions in
  `app/physics/*.ts`. Content-embedded arithmetic (worked-example steps, quiz explanations, numeric
  answers, inline `a = b` chains) has **no** oracle. 21/21 tests pass with the defect present.
- **D3 — count inconsistency + progressive-enhancement violation.** `app/build/render.mjs:128`
  hardcodes `۴۸`; `app/client/main.ts:29` falls back to `48`. The registry has **47** concepts. With
  JS on, the client corrects it to `۴۷` (confirmed live). With JS off, shipped HTML shows `۰/۴۸` —
  wrong, and it breaks the ARCHITECTURE.md "readable with JavaScript disabled" invariant.
  `docs/DESIGN.md` also specifies the ribbon as `۳/۴۷`.

### Premise corrections (verified — do not "fix" these)

- **Aggregates are already sound.** `app/build/pages.mjs:44-46` and every per-part count, formula
  count, question count and effort total are derived from `registry` at build time. The "47 vs 48"
  problem is only the hardcoded header default (D3). Do not edit displayed numbers.
- **"به‌جای تصویر" is not a missing interaction.** All **47/47** concepts carry `visual.sim` and
  resolve against `app/client/sims/index.ts`. The `به‌جای تصویر:` prefix occurs in all 47
  `visual.fallback` strings — which `docs/DESIGN.md` and `docs/QUALITY.md` *require* as the
  accessible text equivalent (no-JS / screen reader). Real P3 gaps are: `square-balance` is
  gallery-only (not embedded in any concept), `vector-trainer` and `right-hand-rule` do not exist,
  and six existing sims are shallower than the P3 specification.

### P3 sizing evidence (de-risks the build)

`app/physics/*` already exposes every primitive the request needs: `coulombForceMagnitude`,
`vectorComponents`/`magnitude`/`angle`, `cyclotronRadius`/`Period`/`Frequency`/`helixPitch`,
`seriesResistance`/`parallelResistance`, `rcCharging`/`rcDischarge`/`fractionAfterTimeConstants`,
`sphereField`/`fieldOfWire`/`fieldOfPlane`, `parallelPlateCapacitance`/`capacitorField`/
`chargeOfCapacitor`. **P3 is mostly wiring plus richer read-outs, not new physics.** Only
`vector-trainer` and `right-hand-rule` are genuinely new builds. 14 sims registered; 13 embedded.

### Mobile evidence (measured on the live site at 360px, concept page)

- Header is **112.5px tall = 14% of a 780px viewport**, permanently, on every page.
- `.site-nav` `scrollWidth` **437px** vs `clientWidth` **336px** → nav is horizontally scrolled and
  clipped; `واژه‌نامه` sits off-screen with no affordance.
- 12 interactive targets under 32px in a single viewport; nav links are 25–32×27px.
- Simulation canvas: `style.width` 320px, laid out **302×211px**; in-canvas labels are effectively
  unreadable at that size.
- **No horizontal overflow at 360 or 390** — this currently passes and must not regress.

### Material unknowns

- **U1** Extent of numerical defects beyond D1 — unknown until A2's oracle exists and is run.
  Do not estimate or claim a number beforehand.
- **U2** Formula-rendering defects (numerator/denominator order, exponents, directionality) —
  `tests/site/math-render.test.mjs` checks typesetting/escaping/failure reporting, **not** semantic
  agreement between the source string and what the learner sees. **MUST be executed** with real
  browser-rendered inspection (see §8); never reported `PASS` from source inspection alone.
- **U3** Whether the digest/size budget (`QUALITY.md`: entry JS ≤ 15 kB gzip, CSS ≈ 16 kB gzip)
  survives the header redesign and two new sims.

### Assumptions (labelled, reversible)

- A1 is treated as the **only** known arithmetic defect; others are discovered, not assumed.
- Where the lecture note itself is wrong, source truth is preserved and the site shows the source
  value labelled `مطابق جزوه` beside a re-derived value labelled `بازبینی محاسبات` — the pattern
  already used for Part 1 §6.1 in `docs/DESIGN.md`'s decision log. Never silently rewrite the note.
- The existing content registry is large enough that no new concept page is needed for P3/P4.

## 4. Existing patterns, components and contracts to reuse

- **Content**: `app/content/*.mjs` node-importable data; `validateConcept`/`validateQuestion` at
  import; `String.raw` for LaTeX.
- **Build gates**: `app/build/coverage.mjs` (source coverage + formula presence, fails the build),
  `app/build/math.mjs` (KaTeX, `trust:false`), `scripts/check-subpath-build.mjs` (sub-path/404).
- **Physics core**: DOM-free `app/physics/*.ts`, unit-tested against the notes' own answers.
- **Figure kit**: `app/client/sims/kit.ts` — `createStage`, `grid`, `chargeDot`, `arrow`, `plate`,
  `controlPanel`, `slider`, `segmented`, `toggle`, `button`, `readoutList`, `plotFrame`,
  `plotCurve`. Every existing sim is built from these; **do not** add a second figure framework.
- **Sim registry**: `app/client/sims/index.ts` maps id → lazy chunk. New sims register here and
  become their own chunk; unknown ids degrade to the text fallback.
- **Design tokens**: `app/styles/main.css` `:root` custom properties, one stylesheet, no framework.
- **Delivery**: `docs/GIT_POLICY.md` — `node scripts/ai-pr.mjs prepare` before editing, then
  `deliver` with explicit `--file` paths and `.artifacts/ai-pr.md` evidence.

## 5. Smallest viable design and relevant data/control flow

**P0 QA (A2) — structured, formatting-tolerant oracles.** Each claim is a *structured record*:

```
{ claimId, kind, sourceRef, field,          // provenance: which content field is audited
  expression, value, tolerance, unit,       // the semantic expectation
  relation: { formula, lhs, rhs },          // the physical relationship being checked
  display?: string }                        // optional exact rendering, checked separately
```

A test asserts, per record:
1. **Re-derivation** — evaluate `expression` with a deterministic evaluator over a restricted
   grammar (SI prefixes, `×10^n`, powers, sqrt, small function whitelist) and assert it equals
   `value` within `tolerance`.
2. **Relationship** — assert `relation` holds (e.g. `F = qE`, `F ∝ 1/r²`, `τ = RC`). This is the
   oracle; the number alone is not.
3. **Semantic display agreement** — assert the content field *renders a number numerically equal to*
   `value` in `unit`, **not** a literal string match. `6×10⁻³ N` and `0.006 N` and `6 mN` all pass;
   `6×10⁻⁹ N` fails. `display` is an additional exact check only when explicitly declared.

This keeps the three-way provenance idea (re-derive → relationship → learner-facing claim) while
removing formatting fragility. Failures must be about the learner-facing number being *wrong*, never
about how it is typeset. Records outside the grammar are listed `UNPROVEN`, never silently skipped.
Seed with `p1-field-1` and the notes' own published worked answers, then grow until the auditor
reports diminishing returns; report coverage, not a claim of completeness.

**P0 header count (A3).** Inject the real total into the static markup at build time and remove the
`48` fallback, so the no-JS render is correct by construction. Add a node assertion that the rendered
`data-progress-total` equals `registry.concepts.length`.

**P3 sims (A4).** Two shapes only, both on `kit.ts`:
- *Compute-and-read-out* (`coulomb-lab`, `vector-trainer`, `rc-lab`, `circuit-lab`,
  `capacitor-lab`, `gauss-lab`, `magnetic-motion`): sliders/segments mutate state → pure
  `app/physics/*` call → `readoutList` + `plotCurve` + canvas repaint. A derived cue (e.g. the
  inverse-square hint) must be **computed from current state**, never a static string.
- *Direction trainer* (`right-hand-rule`): the learner picks the missing direction among labelled
  axes; feedback is drawn on the canvas (arrow, correct/incorrect/retry), never a bare letter answer.

Shared rule: state → pure physics → render, in one direction. No sim computes physics in the UI
layer. Each new sim ships a `visual.fallback` string and is embedded into the matching concept page
via `visual.sim`; `/sims/` stays the hub.

**Header (A5).** Keep one `<header>`; at ≤880px replace the horizontally-scrolled nav row with a
compact single-row header plus a disclosure drawer/bottom pattern carrying nav + search + progress.
Requirements: collapsed height target ≤ 64px at 360px; no nav item clipped; current section visible
without opening anything; every target ≥32px (≥44px for primary); drawer traps focus, closes on
Esc/backdrop/selection, and returns focus to its trigger; works with JS off (the trigger becomes an
ordinary link list fallback); honours `prefers-reduced-motion`. Reuse existing tokens and the
`search-trigger`/`progress-toggle` contracts rather than inventing new ones.

**P4 (A6).** Typography/hierarchy and state polish reusing current tokens; restrained micro-
interactions (120–160ms, transform/opacity only, never layout-animated) behind
`prefers-reduced-motion`; states distinguished by icon/text as well as colour.

## 6. Risks (only the ones that apply)

- **Correctness / trust (highest).** Publishing an unrepaired numeric defect is worse than any visual
  defect. Mitigation: A1/A2 run before any visual work; nothing ships green while D1 is open.
- **Scope creep.** The request is large and the exclusions are explicit. Mitigation: exclusions are
  restated in the report; out-of-scope ideas go to "future suggestions" only.
- **Regression to the coverage gate.** Adding sims/concepts can silently break
  `app/build/coverage.mjs`. Mitigation: run the build after every content change; never relax the gate.
- **Performance (U3).** Two new sims + header redesign could exceed the JS/CSS budgets. Mitigation:
  lazy chunks via the existing registry, no new dependencies, measure gzip before/after.
- **No-JS regression.** A JS-only header would break the ARCHITECTURE invariant. Mitigation: markup
  is server-rendered; drawer is an enhancement.
- **Delivery lane (see §10).** The `ai-changes` branch carries a local commit that is not a
  descendant of `origin/main`; delivery may be refused. Implementation is not blocked by this.
- **Rollback.** Each of P0/P3/P4/responsive is a separable commit; revert the offending commit.

## 7. Ordered vertical work with stop/verification points

0. **Preflight (delivery lane).** Run `node scripts/ai-pr.mjs prepare`. If it refuses because local
   history diverged from `origin/main`, **stop and report**; do not reset, force, or rewrite.
   *Result (2026-10-24):* **delivery BLOCKED** — this session runs `PI_GIT_MUTATION=deny`, so the
   helper is refused by the launcher. `PI_GIT_MUTATION=allow` is an owner-authorised override and is
   **not** self-toggled. Local implementation continues unaffected; delivery is reported at the gate.
   Worktree verified clean apart from this plan file; the user-owned `d238b28` README commit is
   preserved untouched.
1. **P0 — fix D1.** Repair option `a`, option `d` and the explanation; restructure so exactly one
   option is correct; keep terminology. *Verify:* targeted node test (reverted copy fails) + build.
2. **P0 — build the QA oracle (A2).** Oracle table + three-way test; seed with D1 and the notes'
   published answers. *Verify:* deliberately corrupt a displayed number → test fails; restore → passes.
3. **P0 — run the audit (A2, U1, U2).** Extend the oracle across all five parts; inspect rendered
   formulas in the browser; produce the P0 report with PASS/FAIL/UNPROVEN/BLOCKED/NOT EXECUTED.
   *Stop:* if U1 is still large after the mechanical sweep, report honestly rather than claiming
   "content correct".
4. **P0 — internal consistency (A3).** Fix D3 at the build layer; assert no-JS correctness.
   *Verify:* build output + node assertion.
5. **P3 — new trainers.** `vector-trainer`, `right-hand-rule` on `kit.ts`; register; embed in the
   matching concepts. *Verify:* browser test per sim + 360/390/430 screenshot inspection.
6. **P3 — upgrade existing sims.** `coulomb-lab`, `magnetic-motion`, `circuit-lab`, `rc-lab`,
   `gauss-lab`, `capacitor-lab` per §5; embed `square-balance` into its concept.
   *Verify:* per-sim browser test (initial + 2 changed states + reset + read-out change).
7. **Responsive header + mobile pass (A5).** Per §5; extend the browser suite to 360/390/430/768/
   1024/1360 including header open/close, mobile nav, search, formula copy, quiz, overflow.
   *Verify:* tests green; no overflow at any width; inspected screenshots.
8. **P4 — polish (A6).** Hierarchy, physics visual language, micro-interactions, states, Persian
   typography/long-text measure, consistency sweep. *Verify:* `frontend-design` product + studio pass.
9. **Repair round (max 2).** Evidence-driven fixes only, per `docs/HARNESS.md`.
10. **Final gate.** `bash scripts/verify.sh`, full Playwright suite, production build, console/network
    check, contrast + reduced-motion re-check; then final report + PR delivery.

Steps 1–4 (P0) must be complete and green before step 5 begins.

## 8. Verification and evaluator strategy

- **Cheapest faithful lanes**, per `verification-routing`: `npm run typecheck` and the single
  affected node test while iterating content; `SITE_BASE=/physics2 npm run build` after any content
  or markup change; the affected Playwright spec per sim; `bash scripts/verify.sh` once at the gate.
  Do not run the full Playwright suite after every edit.
- **Node lane**: oracle test (A2), content-integrity, math-render, physics — extend rather than duplicate.
- **Browser lane**: extend `tests/browser/site.spec.mts` to the six widths; add header open/close,
  mobile nav, per-sim state-change, and per-sim reset tests; keep the existing no-overflow and
  keyboard/focus assertions.
- **Rendered evidence is mandatory.** Viewport assertions alone are explicitly insufficient:
  capture and *inspect* screenshots at 360/390/430 and 768/1024/1360 for home, a representative
  concept, lesson, formulas, practice, map, sims and deep 404. Appearance claims without inspectable
  pixels stay `UNPROVEN`.
- **Semantic formula-rendering (U2) — executed, not asserted.** In a real browser, sample formulas
  covering fractions, exponents, negative exponents, subscripts, vectors, Greek letters and
  mixed Persian/LTR text. For each, read both the learner-visible rendering (glyph order, fraction
  bar placement, super/subscript position, LTR isolation) and the DOM/accessible representation
  (`aria-label` / MathML-equivalent text), and assert the two **agree semantically**. Source-string
  inspection alone is not acceptable evidence for U2.
- **P4 gate**: `frontend-design` product pass (journey, states, a11y, responsiveness) then studio
  pass against `docs/DESIGN.md` + anti-template review. Any hard-gate failure ⇒ `NOT READY`.
- **Console/network**: capture on every route exercised; zero uncaught errors and zero failed
  critical requests.
- **Design contract**: new design values are labelled *new agent-proposed refinement* and appended to
  the existing `docs/DESIGN.md` decision log. No second design-memory file; owner decisions untouched.

## 9. Decisions intentionally deferred

- Dark theme (tokens exist structurally; contrast unverified; not requested).
- Offline service worker; print/PDF export.
- General-purpose circuit simulator (P3.5 stays series/parallel + battery/resistor).
- 3D/WebGL rendering (SVG/canvas/lightweight TS only).
- Any excluded roadmap item, recorded as a future suggestion in the final report instead.
- Per-concept MCQ rewrite beyond what the audit proves defective.

## 10. Handoff-ready current state and smallest first action

**Status 2026-10-24: all four work streams implemented; `bash scripts/project-verify.sh` and
`npx playwright test` both green (48 browser tests).** Delivery is `BLOCKED` — see below.

- **P0 `PASS`** — gate green end to end: typecheck → 31 node tests → numerical audit → coverage →
  static build → sub-path check → browser formula-rendering check. D1, D2, D3 repaired.
- **P3 `PASS`** — two genuinely new trainers (`vector-trainer`, `hand-rule-trainer`) built on the
  existing `kit.ts`; all 16 figures now have a real reset; stale read-out rows cleared; three figures
  whose slider default did not match their own state repaired; both trainers embedded in their
  lessons and listed on `/sims/`.
- **Responsive `PASS`** — header 112 px → 60 px at 360 px, nav clipping 101 px → 0, small touch
  targets 12 → 0 per page, verified at 360/390/430/768/1024/1360 with zero horizontal overflow.
- **P4 `PASS`** — one interaction block (press feedback, disabled states, reveal, copy confirmation)
  plus new design decisions recorded in `docs/DESIGN.md` as *agent-proposed refinements*.

### Defects found and repaired beyond the known one

1. `part-4.mjs`: `0.43 × 1.39 ≈ 0.59 Ω` → `0.60 Ω` (truncation sold as rounding).
2. `render.mjs`: hardcoded `۴۸` against a 47-concept registry, visible without JavaScript.
3. `field-lab`: the probe-charge slider mounted at 1 µC while the figure started at 10 nC — the
   first drag jumped two orders of magnitude.
4. `drift-lab` / `gauss-lab`: slider `step` values (1 and 0.02) could not represent their own default
   (8.5 and 0.35), so the browser silently snapped the figure to a different starting state.
5. `segmented` controls stopped notifying the figure after a refactor, so the direction trainer
   accepted clicks without recording an answer.
6. Reset replayed only the sliders that had moved, so button-driven state («snap to the answer»)
   survived a reset.
7. Segmented groups were restored by CSS class only, leaving the physics showing the last choice.
8. Switching Gauss symmetry / capacitor connection left the previous case's read-out rows on screen.
9. `simBlock` mounted one figure per concept and the client read a single `data.sim`, so a second
   figure on a lesson would never have appeared.
10. Breadcrumbs emitted bare `<a>` children directly inside `<ol>` (invalid markup).

### Two lessons worth keeping

- The U2 check caught a bug in **the check itself**: KaTeX places superscripts *and* subscripts with
  a negative inline `top:`, so the sign does not identify the script — the lowered row is marked
  `vlist-t2`. Reading `q_0` as `q^0` would have silently corrupted numeric readings. Only executing
  the comparison surfaced this.
- Adding the reset assertions to the existing figure test immediately produced six real product
  defects. Tests that assert intent return noise; tests that assert *measured state* return work.

### Delivery — `BLOCKED`

`node scripts/ai-pr.mjs prepare` is refused: this session runs `PI_GIT_MUTATION=deny`, so the
reviewed helper cannot run. `PI_GIT_MUTATION=allow` is an owner-authorised override and was **not**
self-toggled. Everything is implemented, verified and committed-ready locally; publishing to the
`ai-changes` lane needs one owner command:

```
node scripts/ai-pr.mjs prepare
```

The local `ai-changes` HEAD `d238b28` is **not** a descendant of `origin/main` (`c875d1b`, PR #1
merged) and has no open PR; its only diff from main is a `README.md` reduction. Preserve it.

### Preserved / not weakened

- Unrelated user work: the `d238b28` commit. Untouched.
- `app/build/coverage.mjs`, the physics oracles, `docs/QUALITY.md` hard gates and every browser
  assertion are intact; the browser suite grew from 36 to 48 tests.

**Remaining risks.** CSS is 16.7 kB gzip against a ≈16 kB budget — at budget, worth trimming if it
grows further. 293 math segments remain `UNPROVEN` (symbolic relations and notation outside the
grammar); they are reported every run, never counted as passes. Perf targets are local
measurements, not field data.
