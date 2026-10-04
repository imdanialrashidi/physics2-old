# Product Contract

Short durable source of truth for what the Physics II learning site must do.

## Users and problem

- Primary users: a Physics II undergraduate who finds electrostatics/magnetism hard, forgets the
  formulas, and needs the *why* before the *how* (the owner is the first, intended user).
- Context: Persian speaker, RTL reading, desktop or phone, slow connection likely, no account.
- Problem: the course notes are dense, terse and equation-first; they do not show why a formula holds,
  do not visualise a field, and give no feedback when an answer is wrong.
- Current alternative: re-reading the notes, watching unrelated videos, solving from answer keys.
- Why now: the five notes are finished and digitised, so the content pipeline is the only blocker.

## MVP outcome

- Measurable outcome: every teaching section of the five notes is reachable as a layered concept page
  with an interactive figure, a worked example with hidden steps, and practice with explanations.
- Riskiest product assumption: that "intuition → visual → maths → example → practice" helps this
  learner more than a longer textbook chapter.
- Smallest experiment that tests it: the concept pages themselves — one concept, both ways compared
  with the notes.
- Hard constraints: fully static, GitHub Pages, offline-safe, no backend/auth/API keys, Persian RTL,
  WCAG 2.2 AA target.

## Must-have user flows

1. Land on the home dashboard → see the five-part ladder, current progress, and one clear next step.
2. Open a concept → read intuition, manipulate the figure, read the formula with "when to use / when
   not", reveal a worked example step by step, then answer practice questions.
3. Get stuck anywhere → press «این قسمت رو نمی‌فهمم» and follow a five-step rescue path back to the
   prerequisite, a simpler explanation, a visual, a tiny example, and the current concept.
4. Practise deliberately → mixed quiz, per-part quiz, or only the concepts scored as weak; see the
   explanation for wrong answers; progress survives reloads.

## Non-goals

- No accounts, server, database, or user data leaving the browser.
- No AI tutor/chat, no external API calls at runtime.
- No replacement of the notes' meaning, ordering or terminology.
- No feature count inflation: every widget must support one of the four flows above.

## Acceptance criteria

- [x] All five notes are parsed at build time and every numbered section maps to a rendered concept
      page or an explicitly declared non-teaching section (`app/build/coverage.mjs` fails the build).
- [x] Every boxed/key formula of the notes is implemented somewhere on the site (checked mechanically).
- [x] Each concept has intuition, a figure with a text fallback, formulae, a worked example with
      progressive steps, misconceptions, practice with explanations, and a rescue path.
- [x] Simulations compute real physics from `app/physics/*.ts` and react to controls (browser test
      drives all 14 figures).
- [x] Static output works from a GitHub Pages sub-path with deep links and a 404 page
      (`scripts/check-subpath-build.mjs`).
- [x] Desktop and 360 px are usable with keyboard, visible focus and RTL/LTR math
      (`tests/browser/site.spec.mts`).
- [x] No console errors, no horizontal overflow, usable without `localStorage`.

## Security, privacy, and compliance constraints

- Data classification: none; the only stored data is the learner's own progress in `localStorage`.
- Critical access rules: none (no server).
- External providers: none at runtime.
- Retention: progress stays in the browser; a visible control clears quiz history.

## Performance and UX budgets

- Page budget: CSS ≈ 16 kB gzip, entry JS ≤ 15 kB gzip, figures lazily imported per page.
- Network baseline: works after first load on any connection; no third-party requests.
- Accessibility target: WCAG 2.2 AA.
- Brand character: playful and colourful, not childish; academically credible, not corporate.
- Visual ambition: flagship learning product, executed as one coherent notebook-like system
  (`docs/DESIGN.md`).
- Locales: Persian (fa) RTL only; Latin preserved for symbols and the attribution domain.
- Visual contract: `docs/DESIGN.md`.

## Measurement and operations

- Activation: a learner answers one practice question correctly on a concept page.
- Guardrail metrics: coverage report stays at zero gaps; browser suite stays green.
- Product telemetry: none, by design; learning progress stays local and is inspectable by the learner.
- Support/recovery: the 404 page, per-page text fallbacks, and a "storage unavailable" state.

## Open product decisions

- Whether to add a dark theme (tokens allow it; unverified for contrast).
- Whether to add printable handouts for a part (print styles exist; no dedicated layout yet).