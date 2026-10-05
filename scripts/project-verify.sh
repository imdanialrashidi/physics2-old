#!/usr/bin/env bash
# Canonical verification for the Physics II learning site. Used by scripts/verify.sh and CI.
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "→ typecheck"
npx tsc --noEmit

echo "→ unit and content-integrity tests"
node --test tests/site/physics.test.ts tests/site/content-integrity.test.mjs tests/site/math-render.test.mjs tests/site/content-numeric.test.mjs

echo "→ numerical content audit (P0 correctness gate)"
node app/build/numeric-audit.mjs

echo "→ static build"
# Mirrors the Pages workflow: the 404 page is served at arbitrary URLs, so it is built against the
# absolute deployment base. Everything else stays depth-relative.
SITE_BASE=/physics2 npm run build

echo "→ note coverage report"
# After the build, not before it: `build.mjs` reads the Vite manifest on every run, so on a clean
# checkout a coverage-first order died with "Vite manifest not found" before anything was built.
node app/build/build.mjs --coverage-only

echo "→ GitHub Pages sub-path check"
node scripts/check-subpath-build.mjs

echo "→ internal consistency (shipped counts match the registry, JS disabled)"
node --test tests/site/internal-consistency.test.mjs

echo "→ semantic formula rendering in a real browser (P0/U2)"
node scripts/check-math-rendering.mjs

echo "✔ project verification passed"