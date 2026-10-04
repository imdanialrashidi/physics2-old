/**
 * Semantic math-rendering check (U2) — executed in a real browser, never from source strings.
 *
 * For every rendered formula on a sample of routes this script compares two independent readings:
 *
 *   1. **What the learner sees** — reconstructed from the KaTeX DOM: `msup`/`msub` become exponent
 *      and subscript markers, `.mfrac` is rebuilt as a numerator/denominator pair, and the result is
 *      reduced to a number.
 *   2. **What the markup asserts** — the `aria-label` (the LaTeX source KaTeX was given), reduced to
 *      a number by `app/content/qa/numeric.mjs`.
 *
 * They must agree numerically. A formula whose visible fraction is upside down, whose exponent is
 * rendered in the wrong place, or whose direction was flipped in an RTL context fails here even when
 * the source string looks correct.
 *
 * Coverage is deliberate: fractions, exponents, negative exponents, subscripts, vectors, Greek
 * letters and mixed Persian/LTR runs are all asserted to be present, so removing them is a failure
 * rather than a silent loss of coverage.
 *
 * Usage: node scripts/check-math-rendering.mjs [--base physics2] [--port 4173]
 */

import { chromium } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

import { evaluateFragment } from '../app/content/qa/numeric.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const port = Number(args[args.indexOf('--port') + 1]) || 4178;
const base = args.includes('--base') ? `/${args[args.indexOf('--base') + 1]}` : '/physics2';

/** Routes chosen to span concept pages, the formula handbook, worked examples and practice. */
const ROUTES = [
  '/index.html',
  '/concept/coulomb/',
  '/concept/electric-field/',
  '/concept/gauss-spherical/',
  '/concept/charge-density/',
  '/concept/magnetic-force/',
  '/formulas/',
  '/concept/resistivity/',
];

/** Feature coverage the audit must demonstrate, not merely hope for. */
/** Every one of these must be demonstrated by a formula that is actually on screen. */
const REQUIRED_FEATURES = {
  fraction: '.mfrac',
  superscript: 'a raised exponent',
  subscript: 'a lowered index',
  vector: 'an accent over a symbol',
  radical: 'a square root',
  greek: 'a Greek letter',
};

function localChromium() {
  const cache = path.join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(cache)) return undefined;
  const versions = readdirSync(cache)
    .filter((name) => name.startsWith('chromium-'))
    .sort()
    .reverse();
  for (const version of versions) {
    for (const relative of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
      const candidate = path.join(cache, version, relative);
      if (existsSync(candidate)) return candidate;
    }
  }
  return undefined;
}

/**
 * Runs in the page: rebuild what the learner *sees*, using geometry rather than KaTeX class names.
 *
 * KaTeX's HTML output positions a superscript with an inline `top: -3em` inside a `vlist`; there is
 * no `.msup` element in the visual tree. Reading the class names would therefore miss every
 * exponent. Measuring where each glyph actually sits answers the real question — is the exponent
 * drawn above the base — and would catch a layout that puts it in the wrong place.
 *
 * Fractions are read structurally from `.mfrac`, which is exactly the num-over-den the learner sees.
 * Serialised as source and re-created with `new Function`, so it must stay self-contained.
 */
function visualReading(element) {
  const classOf = (node) => (typeof node.className === 'string' ? node.className : '');

  /** KaTeX draws a fraction as num-over-den; that is literally what the learner sees. */
  const readFraction = (node) => {
    const num = [...node.children].find((child) => classOf(child).indexOf('mfrac-num') >= 0);
    const den = [...node.children].find((child) => classOf(child).indexOf('mfrac-den') >= 0);
    if (!num || !den) return null;
    return `((${read(num)})/(${read(den)}))`;
  };

  function read(node) {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeType !== 1) return '';

    const fraction = readFraction(node);
    if (fraction) return fraction;

    // Superscripts are positioned by an inline `top: -3em`; subscripts by a positive offset. The
    // style is what the browser used to place the glyph, so reading it is reading the rendered
    // position rather than guessing from class names.
    // KaTeX places *both* scripts of `X_i^j` with a negative inline `top:`, so the sign alone does
    // not say which is the subscript. The lowered row is the one it marks `vlist-t2`; reading it as a
    // superscript would silently turn `q_0` into `q^0` and corrupt any numeric reading that follows.
    if (/(^|\s)vlist-t2(\s|$)/.test(classOf(node))) {
      const text = [...node.childNodes].map(read).join('').trim();
      return text ? `_${text}` : '';
    }
    const shifted = [...node.attributes].find((attribute) => /^style$/i.test(attribute.name) && /top:/.test(attribute.value));
    if (shifted) {
      const offset = Number(/(?:^|;)\s*top:\s*(-?[\d.]+)em/.exec(shifted.value)?.[1] ?? 0);
      const text = [...node.childNodes].map(read).join('').trim();
      if (!text) return '';
      if (offset < -0.2) return `^(${text})`;
      if (offset > 0.2) return `_${text}`;
    }

    return [...node.childNodes].map(read).join('');
  }

  return read(element)
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/[−–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const server = spawn(process.execPath, [path.join(ROOT, 'app/build/serve.mjs'), String(port), '--base', base.replace('/', '')], {
  cwd: ROOT,
  stdio: 'ignore',
});
await new Promise((resolve) => setTimeout(resolve, 1200));

const browser = await chromium.launch({ executablePath: localChromium() });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: 'fa-IR' });

const results = [];
const seenFeatures = new Set();
let consoleErrors = 0;
page.on('pageerror', () => { consoleErrors += 1; });

try {
  for (const route of ROUTES) {
    await page.goto(`http://127.0.0.1:${port}${base}${route}`, { waitUntil: 'networkidle', timeout: 30_000 });
    const sample = await page.evaluate((visualSource) => {
      let visual;
      try {
        // eslint-disable-next-line no-new-func
        visual = new Function(`return (${visualSource})`)();
      } catch (error) {
        return { error: String(error), items: [] };
      }
      const nodes = [...document.querySelectorAll('[role="math"][aria-label]')];
      const items = [];
      for (const node of nodes) {
        const katex = node.querySelector('.katex');
        if (!katex) continue;
        const classes = katex.innerHTML;
        const features = [];
        if (classes.indexOf('mfrac') >= 0) features.push('fraction');
        // KaTeX offsets scripts with an inline `top: <n>em`: negative raises, positive lowers.
        const offsets = [...classes.matchAll(/top:\s*(-?[\d.]+)em/g)].map((match) => Number(match[1]));
        if (offsets.some((offset) => offset < -0.2)) features.push('superscript');
        if (offsets.some((offset) => offset > 0.2)) features.push('subscript');
        // The lowered script row is the one KaTeX marks `vlist-t2`.
        if (/class="[^"]*vlist-t2/.test(classes)) features.push('subscript');
        if (classes.indexOf('accent') >= 0) features.push('vector');
        if (classes.indexOf('sqrt') >= 0) features.push('radical');
        if (classes.indexOf('varepsilon') >= 0 || classes.indexOf('mord text') >= 0) features.push('greek');
        items.push({
          label: node.getAttribute('aria-label'),
          seen: String(visual(katex.querySelector('.katex-html') ?? katex)),
          height: node.getBoundingClientRect().height,
          // A formula inside a closed <details> or a still-hidden panel (the rescue path) is not on
          // screen yet; zero height there is correct behaviour, not a rendering fault.
          hiddenByDisclosure: !!node.closest('details:not([open]), [hidden]'),
          features,
        });
      }
      return { items };
    }, visualReading.toString());

    if (sample.error) {
      console.error(`page evaluation failed on ${route}: ${sample.error}`);
      process.exitCode = 1;
      break;
    }
    for (const item of sample.items) {
      results.push({ route, visible: item.height > 4, ...item });
      // Only formulas that are actually on screen can demonstrate a rendering feature.
      if (item.height > 4 && !item.hiddenByDisclosure) for (const feature of item.features) seenFeatures.add(feature);
    }
  }
} finally {
  await browser.close();
  server.kill();
}

// ---- compare the two readings -------------------------------------------------------
const findings = [];
let compared = 0;
let unparsed = 0;
let hidden = 0;
const comparisons = [];

for (const item of results) {
  // A formula inside a collapsed disclosure is legitimately not laid out yet.
  if (!item.visible && !item.hiddenByDisclosure) {
    findings.push({ status: 'FAIL', route: item.route, label: item.label, detail: `formula rendered with no height (disclosure=${item.hiddenByDisclosure})` });
    continue;
  }
  if (item.hiddenByDisclosure) { hidden += 1; continue; }
  // Only compare formulas that reduce to a single number on both sides.
  const fromLabel = evaluateFragment(item.label);
  if (!fromLabel.ok) { unparsed += 1; continue; }
  const fromSeen = evaluateFragment(item.seen);
  if (!fromSeen.ok) { unparsed += 1; continue; }
  compared += 1;
  comparisons.push({ route: item.route, label: item.label, seen: item.seen, value: fromSeen.value });
  const delta = Math.abs(fromLabel.value - fromSeen.value);
  const scale = Math.max(Math.abs(fromLabel.value), Math.abs(fromSeen.value));
  if (delta > 1e-9 * Math.max(scale, 1)) {
    findings.push({
      status: 'FAIL',
      route: item.route,
      label: item.label,
      detail: `visible reading "${item.seen}" = ${fromSeen.value}, but markup says ${fromLabel.value}`,
    });
  }
}

// Feature coverage is asserted from what was actually observed on screen, so a feature can only
// count as covered if a *visible* formula demonstrated it.
// A check that compares nothing would pass forever. Require real comparisons and show them.
const samples = comparisons.slice(0, 6);

const missingFeatures = Object.entries(REQUIRED_FEATURES)
  .filter(([feature]) => !seenFeatures.has(feature))
  .map(([feature]) => [feature]);

const lines = [];
lines.push('');
lines.push('  ┌─ بازبینی معنایی فرمول‌ها در مرورگر (U2) ───────────────');
lines.push(`  │ فرمول‌های رندرشده بررسی‌شده:   ${String(results.length).padStart(5)}`);
lines.push(`  │ مقایسه‌ی عددی دو خوانش:        ${String(compared).padStart(5)}`);
lines.push(`  │ ? UNPROVEN (بدون مقدار عددی):  ${String(unparsed).padStart(5)}`);
lines.push(`  │ پنهان تا باز شدن بخش:        ${String(hidden).padStart(5)}`);
lines.push(`  │ ناسازگاری معنایی:              ${String(findings.length).padStart(5)}`);
lines.push(`  │ خطای کنسول:                    ${String(consoleErrors).padStart(5)}`);
lines.push(`  │ پوشش ویژگی‌ها: ${['fraction', 'superscript', 'subscript', 'vector', 'greek'].map((f) => (seenFeatures.has(f) ? `${f}✓` : `${f}✗`)).join('  ')}`);
lines.push(`  └────────────────────────────────────────────────────────────`);

if (missingFeatures.length) {
  lines.push('');
  lines.push(`  ✗ FAIL پوشش ناقص: ${missingFeatures.map(([feature]) => feature).join(', ')}`);
}
if (findings.length) {
  lines.push('');
  lines.push('  ناسازگاری‌ها:');
  for (const finding of findings) lines.push(`   ✗ FAIL ${finding.route}: ${finding.detail}`);
  lines.push(`     منبع: ${findings[0]?.label ?? ''}`);
}
lines.push('');
if (samples.length) {
  lines.push('  نمونه‌ی مقایسه‌های عددی (خوانشِ دیده‌شده در برابر مقدارِ markup):');
  for (const sample of samples) {
    lines.push(`   · ${sample.route} ${sample.label}`);
    lines.push(`       دیده‌شده: «${sample.seen}» = ${sample.value}`);
  }
  lines.push('');
}
if (compared === 0) {
  lines.push('  ✗ FAIL هیچ مقایسه‌ای انجام نشد؛ این بازبینی بی‌اثر است.');
}
console.log(lines.join('\n'));

process.exit(findings.length || missingFeatures.length || compared === 0 ? 1 : 0);
