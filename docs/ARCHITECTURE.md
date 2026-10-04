# Architecture Decisions

Durable constraints for the Physics II learning site. Product code, not workflow policy.

## Current system

- Runtime/platform: static HTML/CSS/JS, served by GitHub Pages; no server runtime.
- Build: Vite 8 (client bundle) + a Node build renderer (`app/build/*`) that turns the content model
  into HTML and writes `dist/`.
- Main modules:
  - `app/content/*.mjs` — node-importable course data (47 concepts, 49 questions, formulas, glossary).
  - `app/build/notes.mjs` — parser for the five lecture notes.
  - `app/build/coverage.mjs` — source-coverage and formula-presence checks; fails the build.
  - `app/build/math.mjs` — KaTeX rendering + prose → HTML (build time only).
  - `app/build/pages.mjs` / `render.mjs` — page templates and components.
  - `app/physics/*.ts` — pure physics core (no DOM), shared by figures and unit tests.
  - `app/client/*` — progressive enhancements: store, search, quiz, filters, figures.
- Data stores: none server-side; `localStorage` key `physics2.learning.v1` (optional).
- External services: none at runtime.
- Deployment topology: `.github/workflows/pages.yml` → `dist/` artifact → GitHub Pages.

## Trust boundaries and critical data flows

1. Lecture notes (author-provided, untrusted prose) → parser → coverage report → content registry.
   LaTeX from content is rendered by KaTeX with `trust: false` and escaped before HTML output.
2. Browser state → `localStorage`: versioned, wrapped in try/catch, degrades to in-memory state.
3. Content → HTML: all prose is escaped; only build-generated markup is raw.

## Non-negotiable invariants

- A build fails when a note section, a note topic, a boxed note formula, or a cross-link is missing.
- No runtime dependency on any third-party host; no network call except same-origin
  `search-index.json`, which degrades to a message.
- Figures only draw values produced by `app/physics/*.ts`; no hard-coded "fake" outputs.
- Lesson content must remain readable with JavaScript disabled (progressive enhancement).
- Relative asset paths only, so any sub-path deployment works unchanged.

### The 404 page and `SITE_BASE`

Every route except one is written to a known directory depth, so its assets are depth-relative and
the same `dist/` works under any mount point. The 404 page is the exception: GitHub Pages serves
`404.html` at *whatever URL was requested*, so a depth-relative prefix resolves against a URL the
build never saw and the page renders unstyled with dead links.

`SITE_BASE` (default empty) is the single knob for that page. `npm run build` bakes it into the
404 page's stylesheet, script, favicon, `data-prefix` and internal links as absolute paths; every
other page ignores it. `.github/workflows/pages.yml` and `scripts/project-verify.sh` both build with
`SITE_BASE=/physics2`, and `scripts/check-subpath-build.mjs` fails the build when the deep-404 asset
URLs are not absolute under that base or when any of them 404s. Changing the deployment path means
changing `SITE_BASE` in those two files — nothing else.

The browser lane runs against that same shape: `playwright.config.mjs` starts
`node app/build/serve.mjs 4173 --base physics2` as its own `webServer`, so the durable evidence is
produced at the published sub-path rather than at the root.

## Chosen patterns

| Area | Decision | Why | Revisit when |
|---|---|---|---|
| Content model | structured `.mjs` data instead of Markdown at runtime | enables mechanical coverage, validation and cross-linking | never |
| Math | KaTeX at build time | zero runtime math JS, no FOUC, readable with JS off | never |
| Routing | static directory-style URLs + relative links | deep links and refresh work on GitHub Pages with no config | if a client router becomes necessary |
| Hydration | server-rendered HTML + small lazy client modules | content is never blocked by JS | never |
| State | single versioned `localStorage` wrapper with in-memory fallback | storage is an enhancement, never a requirement | if the learner wants sync |
| Styling | one hand-written CSS file with custom properties | small payload, full control of the RTL system | never |
| Figures | canvas 2D drawn from the physics core | real interactivity without image assets | never |
| Verification | node tests for physics/content + Playwright for journeys | defects are in rendering and interaction, not in algebra alone | — |

## Explicitly rejected complexity

- Client-side SPA router and state library (static pages already give deep links and back-button safety).
- Runtime Markdown or fetch-the-notes-from-disk (would make deployment and caching fragile).
- UI component framework (adds weight and generic look for no gain at this size).
- Any chatbot/API integration (contradicts the static, offline-safe constraint).

## Operational baseline

- Configuration/secrets: none required; `npm ci && npm run build` produces `dist/`.
- Migrations: content schema is validated by `validateConcept`/`validateQuestion` at import time.
- Logging: build prints a coverage summary; failures print actionable Persian messages.
- Rollback: revert the Pages deployment; content lives in versioned Markdown plus `.mjs` data.