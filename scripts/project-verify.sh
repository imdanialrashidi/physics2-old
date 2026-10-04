#!/usr/bin/env bash
# Canonical verification for the Physics II learning site. Used by scripts/verify.sh and CI.
set -Eeuo pipefail

ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "→ typecheck"
npx tsc --noEmit

echo "→ unit and content-integrity tests"
node --test tests/site/physics.test.ts tests/site/content-integrity.test.mjs tests/site/math-render.test.mjs

echo "→ note coverage report"
node app/build/build.mjs --coverage-only

echo "→ static build"
# Mirrors the Pages workflow: the 404 page is served at arbitrary URLs, so it is built against the
# absolute deployment base. Everything else stays depth-relative.
SITE_BASE=/physics2 npm run build

echo "→ GitHub Pages sub-path check"
node scripts/check-subpath-build.mjs

echo "✔ project verification passed"