import { escapeAttribute, escapeHtml, renderInlineProse, renderLatex, renderProse } from './math.mjs';

export { escapeAttribute, escapeHtml, renderInlineProse, renderLatex, renderProse };

export const SITE = {
  title: 'فیزیک ۲ — از شهود تا حل مسئله',
  tagline: 'یک کتاب تعاملی فارسی برای یادگیری عمیق فیزیک ۲',
  author: 'ساخته شده توسط دانیال رشیدی',
  authorUrl: 'imdanialrashidi.github.io',
  telegram: '@imdanialrashidi',
  telegramUrl: 'https://t.me/imdanialrashidi',
  origin: 'https://imdanialrashidi.github.io/physics2/',
};

export const NAV = [
  { href: 'lessons/part-1/', label: 'درس‌ها', match: 'lessons' },
  { href: 'concepts/', label: 'مفاهیم', match: 'concepts' },
  { href: 'formulas/', label: 'فرمول‌ها', match: 'formulas' },
  { href: 'practice/', label: 'تمرین', match: 'practice' },
  { href: 'map/', label: 'نقشه‌ی یادگیری', match: 'map' },
  { href: 'sims/', label: 'آزمایشگاه', match: 'sims' },
];

// `ink` variants are the only part colours allowed for small text (>= 4.5:1 on their tint).
const PART_META = {
  'part-1': { hue: '#1e7be8', ink: '#11529c', tint: '#e8f1fd', glyph: 'field' },
  'part-2': { hue: '#0e8f80', ink: '#0a6b5f', tint: '#e2f5f2', glyph: 'sphere' },
  'part-3': { hue: '#b45309', ink: '#8a3f06', tint: '#fbf0e0', glyph: 'plates' },
  'part-4': { hue: '#ea580c', ink: '#9a3412', tint: '#fdeee1', glyph: 'circuit' },
  'part-5': { hue: '#d2266f', ink: '#a81857', tint: '#fce8f1', glyph: 'magnet' },
};

/** Tiny inline SVG motifs: the product's visual language instead of stock icons. */
export function glyph(name, size = 20) {
  const paths = {
    field: '<circle cx="8" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/><path d="M2 14.5h12M3.6 12.6 2 14.5l1.6 1.9M12.4 12.6 14 14.5l-1.6 1.9" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
    sphere: '<circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-width="1.5"/><ellipse cx="8" cy="8" rx="6" ry="2.4" fill="none" stroke="currentColor" stroke-width="1.1" opacity=".7"/><path d="M8 2v12" stroke="currentColor" stroke-width="1.1" opacity=".7"/>',
    plates: '<path d="M2 4h12M2 12h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M5.5 7.5h5M4 8.6 5.5 7.5 4 6.4M12 8.6 10.5 7.5 12 6.4" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/>',
    circuit: '<path d="M2 5.5h3.2v5h5.6v-5H14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="4.4" cy="3.6" r="1.3" fill="currentColor"/><circle cx="12.6" cy="3.6" r="1.3" fill="currentColor"/><circle cx="9.6" cy="12.4" r="1.6" fill="none" stroke="currentColor" stroke-width="1.4"/>',
    magnet: '<path d="M4.2 12.5V7.2a3.8 3.8 0 0 1 7.6 0v5.3" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M4.2 12.5h2.6M9.2 12.5h2.6" stroke="currentColor" stroke-width="1.2" opacity=".6"/>',
    bolt: '<path d="M9 1.5 3.5 9h3.6l-.9 5.5L12.5 7H8.8z" fill="currentColor"/>',
    clock: '<circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 4.4V8l2.6 1.8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
    ladder: '<path d="M5 2.5h6M5 13.5h6M6.5 2.5v11M9.5 2.5v11" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/>',
    warn: '<path d="M8 1.8 15 14H1z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M8 6v4M8 11.6v.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    spark: '<path d="M8 1.5 9.4 6 14 7.4 9.4 8.8 8 13.3 6.6 8.8 2 7.4 6.6 6z" fill="currentColor"/>',
    life: '<circle cx="8" cy="4" r="1.9" fill="currentColor"/><path d="M3 14.2c0-3 2.2-5 5-5s5 2 5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    book: '<path d="M2.5 2.6h4a2 2 0 0 1 2 2v9a1.6 1.6 0 0 0-1.6-1.6H2.5zM13.5 2.6h-4a2 2 0 0 0-2 2v9a1.6 1.6 0 0 1 1.6-1.6h4.4z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/>',
    play: '<path d="M4.5 2.6 13 8l-8.5 5.4z" fill="currentColor"/>',
    pause: '<path d="M5 3h2v10H5zM9 3h2v10H9z" fill="currentColor"/>',
    reset: '<path d="M13 8a5 5 0 1 1-1.6-3.7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M13 1.6V4.6H10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
    // The maker band's Telegram mark: a paper plane in the site's own icon language, painted in the
    // existing `--neg` blue so the identity link adds no new hue to the palette.
    send: '<path d="M15.2 1 1.2 6.9l4.7 1.9 1.8 5.2 2.6-3.3 3.5 2.6z" fill="currentColor"/><path d="m5.9 8.8 8-6.4-6.5 7.2" fill="none" stroke="var(--paper-2)" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  return `<svg class="glyph" viewBox="0 0 16 16" width="${size}" height="${size}" aria-hidden="true" focusable="false">${paths[name] ?? paths.field}</svg>`;
}

function logoMark() {
  return `<svg class="logo-mark" viewBox="0 0 48 48" width="40" height="40" aria-hidden="true" focusable="false">
    <circle cx="24" cy="24" r="7" fill="var(--pos)"/>
    <circle cx="24" cy="24" r="2.6" fill="var(--paper)"/>
    <ellipse cx="24" cy="24" rx="20" ry="8.4" fill="none" stroke="var(--ink)" stroke-width="1.6" opacity=".75"/>
    <ellipse cx="24" cy="24" rx="8.4" ry="20" fill="none" stroke="var(--ink)" stroke-width="1.6" opacity=".75" transform="rotate(38 24 24)"/>
    <circle cx="41.4" cy="21" r="3.1" fill="var(--neg)"/>
  </svg>`;
}

const DIFFICULTY_LABEL = { 1: 'مقدماتی', 2: 'متوسط', 3: 'چالش‌برانگیز' };

export function partMeta(partId) {
  return PART_META[partId] ?? PART_META['part-1'];
}

export function badgePart(part) {
  return `<span class="pill pill-part" style="--part-hue:${partMeta(part.id).hue};--part-ink:${partMeta(part.id).ink};--part-tint:${partMeta(part.id).tint}">${glyph(partMeta(part.id).glyph, 14)}<span>پارت ${toPersian(part.number)}</span></span>`;
}

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export function toPersian(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

export function originBadge(origin) {
  if (origin === 'course') return `<span class="pill pill-origin" title="محتوای مستقیم جزوه‌ی درسی">از جزوه</span>`;
  if (origin === 'supplement') return `<span class="pill pill-origin pill-origin-supp" title="افزوده‌ی آموزشی، خارج از متن جزوه">تکمیلی</span>`;
  return `<span class="pill pill-origin pill-origin-mix">جزوه + تکمیلی</span>`;
}

export function difficultyDots(level) {
  const dots = [1, 2, 3]
    .map((index) => `<span class="dot ${index <= level ? 'dot-on' : ''}" aria-hidden="true"></span>`)
    .join('');
  return `<span class="difficulty" title="سطح: ${DIFFICULTY_LABEL[level]}">${dots}<span class="sr-only">سطح ${DIFFICULTY_LABEL[level]}</span></span>`;
}

/* ------------------------------------------------------------------ layout */

export function layout({ title, description, route, prefix, assets, body, pageData, activeNav, bodyClass = '', conceptCount = 0 }) {
  const nav = NAV.map(
    (item) =>
      `<a class="nav-link ${activeNav === item.match ? 'is-active' : ''}" href="${prefix}${item.href}"${activeNav === item.match ? ' aria-current="page"' : ''}>${item.label}</a>`,
  ).join('');
  // The progress total is written into the static markup so the ribbon is correct with JavaScript
  // disabled; a hardcoded default used to ship `۴۸` against a 47-concept registry.
  const progressTotal = toPersian(conceptCount);
  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeAttribute(description)}">
<meta name="theme-color" content="#f7f2e7">
<meta property="og:title" content="${escapeAttribute(title)}">
<meta property="og:description" content="${escapeAttribute(description)}">
<meta property="og:type" content="website">
<link rel="icon" href="${assets.favicon}" type="image/svg+xml">
${assets.css ? `<link rel="stylesheet" href="${assets.css}">` : ''}
</head>
<body class="${bodyClass}" data-page="${escapeAttribute(route.kind)}" data-route="${escapeAttribute(route.id)}" data-prefix="${prefix}" data-concept-count="${conceptCount}">
<a class="skip-link" href="#main">پرش به محتوای اصلی</a>
<header class="site-header">
  <div class="header-inner">
    <button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav-panel">
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M3 5.5h14M3 10h14M3 14.5h14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>
      <span class="nav-toggle-label">فهرست</span>
      <span class="sr-only">باز و بسته کردن فهرست</span>
    </button>
    <a class="brand" href="${prefix}index.html">
      ${logoMark()}
      <span class="brand-text"><strong>فیزیک ۲</strong><span>یادگیری تعاملی</span></span>
    </a>
    <nav class="site-nav" id="site-nav-panel" aria-label="ناوبری اصلی">${nav}</nav>
    <div class="header-actions">
      <button class="search-trigger" type="button" data-search-open aria-label="جست‌وجو در درس‌ها">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m12.8 12.8 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span>جست‌وجو</span><kbd>/</kbd>
      </button>
      <button class="progress-trigger" type="button" data-progress-toggle aria-expanded="false" aria-controls="progress-panel">
        <span class="progress-mini" data-progress-mini aria-hidden="true"></span>
        <span class="progress-count"><span data-progress-done>۰</span><span class="progress-count-sep">/</span><span data-progress-total>${progressTotal}</span></span>
        <span class="sr-only">پیشرفت من</span>
      </button>
      <div class="progress-panel" id="progress-panel" data-progress-panel hidden></div>
    </div>
    ${navToggle()}
    <nav class="site-nav" id="site-nav-panel" aria-label="ناوبری اصلی">${nav}</nav>
  </div>
</header>
<main id="main">${body}</main>
${footer()}
<div class="search-dialog" data-search-dialog hidden></div>
<script type="application/json" id="page-data">${pageData}</script>
<script type="module" src="${assets.js}"></script>
</body>
</html>`;
}

/**
 * Phone menu trigger.
 *
 * The owner asked for it at the inline end — the left in RTL. It is the last item of the header row
 * visually, and sits in the DOM straight before the panel it discloses, so keyboard order follows the
 * reading order: logo → search → progress → menu → the links the menu reveals. Visual order is set
 * with `order`, which keeps that true on the desktop row as well.
 *
 * The glyph is this site's own rather than a stock hamburger: two field lines with a double-headed
 * axis between them, the field motif of the part badges and the concept header at menu scale. Three
 * lines still read as a menu at 20 px; arrowheads on every line turned to noise when they were
 * tried. `aria-label` always mirrors the visible word, because below 560 px the label is visually
 * hidden and the open/closed state would otherwise live in a shape and a colour alone.
 */
function navToggle() {
  return `<button class="nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="site-nav-panel" aria-label="فهرست">
      <svg class="nav-toggle-glyph" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">
        <g class="nav-glyph-list" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 5.4h14M3 14.6h14M4.4 10h11.2"/>
          <path d="M4.2 8.5 2 10l2.2 1.5M15.8 8.5 18 10l-2.2 1.5" stroke-width="1.5"/>
        </g>
        <g class="nav-glyph-close" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
          <path d="M5.6 5.6 14.4 14.4M14.4 5.6 5.6 14.4"/>
        </g>
      </svg>
      <span class="nav-toggle-label" data-nav-label>فهرست</span>
    </button>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand">
      ${logoMark()}
      <div>
        <p class="footer-title">فیزیک ۲، یادگیری تعاملی</p>
        <p class="footer-note">محتوا از روی پنج جزوه‌ی درسی ساخته شده و هر بخشِ افزوده با برچسب «تکمیلی» مشخص شده است.</p>
      </div>
    </div>
    <nav class="footer-links" aria-label="پیوندهای پایین صفحه">
      <a href="concepts/">نمایه‌ی مفاهیم</a>
      <a href="formulas/">دفترچه‌ی فرمول‌ها</a>
      <a href="practice/">تمرین‌ها</a>
      <a href="map/">نقشه‌ی یادگیری</a>
      <a href="glossary/">واژه‌نامه</a>
    </nav>
  </div>
  ${makerBand()}
</footer>`;
}

/**
 * The maker's mark.
 *
 * A colophon, not a legal line: the creator is named as a heading, and both identity links are real
 * links a learner can act on. It closes every page with the same intent, which is what makes it a
 * product signature rather than a footer notice.
 */
function makerBand() {
  return `<div class="maker-band">
    <div class="maker-inner">
      <span class="maker-mark" aria-hidden="true">${logoMark()}</span>
      <div class="maker-text">
        <p class="footer-made">${SITE.author}</p>
        <p class="maker-note">این کتاب تعاملی از روی پنج جزوه‌ی درسی نوشته شده و در مرورگر خودت باز می‌شود؛ اگر جایی گیر کردی یا پیشنهادی داشتی، از تلگرام بنویس.</p>
      </div>
      <div class="maker-links">
        <a class="maker-link maker-link-domain footer-domain" href="https://${SITE.authorUrl}" rel="noopener">${glyph('sphere', 16)}<span>${SITE.authorUrl}</span></a>
        <a class="maker-link maker-link-telegram" href="${SITE.telegramUrl}" rel="noopener">${glyph('send', 16)}<span>${SITE.telegram}</span></a>
      </div>
    </div>
  </div>`;
}

/* ------------------------------------------------------------- components */

export function breadcrumbs(items) {
  // Each crumb is its own `li`: an `<ol>` may only contain list items, and the bare anchors this
  // used to emit were invalid markup that the browser had to recover from.
  const parts = items
    .map((item) =>
      `<li>${
        item.href
          ? `<a href="${item.href}">${escapeHtml(item.label)}</a>`
          : `<span aria-current="page">${escapeHtml(item.label)}</span>`
      }</li>`,
    )
    .join('<li class="crumb-sep" aria-hidden="true">‹</li>');
  return `<nav class="breadcrumbs" aria-label="مسیر صفحه"><ol>${parts}</ol></nav>`;
}

export function conceptCard(concept, prefix, { compact = false } = {}) {
  const meta = partMeta(concept.part);
  return `<article class="concept-card" data-part="${escapeAttribute(concept.part)}" data-level="${escapeAttribute(String(concept.difficulty))}" data-title="${escapeAttribute(concept.title)}" style="--part-hue:${meta.hue};--part-ink:${meta.ink};--part-tint:${meta.tint}">
  <a class="concept-card-link" href="${prefix}concept/${concept.id}/">
    <div class="concept-card-top">
      ${badgePartNumbered(concept.part)}
      ${difficultyDots(concept.difficulty)}
    </div>
    <h3>${escapeHtml(concept.title)}</h3>
    <p class="concept-en">${escapeHtml(concept.en)}</p>
    ${compact ? '' : `<p class="concept-summary">${renderInlineProse(concept.intuition.split('\n\n')[0])}</p>`}
    <div class="concept-card-meta">
      <span>${glyph('clock', 14)}${toPersian(concept.effort)} دقیقه</span>
      <span>${glyph('ladder', 14)}${toPersian(concept.prereqs.length)} پیش‌نیاز</span>
      ${concept.formulas.length ? `<span>${glyph('bolt', 14)}${toPersian(concept.formulas.length)} فرمول</span>` : ''}
    </div>
  </a>
</article>`;
}

function badgePartNumbered(partId) {
  const number = Number(partId.split('-')[1]);
  return `<span class="pill pill-part" style="--part-hue:${partMeta(partId).hue};--part-ink:${partMeta(partId).ink};--part-tint:${partMeta(partId).tint}">${glyph(partMeta(partId).glyph, 14)}<span>پارت ${toPersian(number)}</span></span>`;
}

export function formulaCard(formula, { compact = false } = {}) {
  const symbols = (formula.symbols ?? [])
    .map(
      (symbol) =>
        `<div class="symbol-row"><span class="symbol-sym">${renderLatex(symbol.sym, { display: false })}</span><span class="symbol-meaning">${renderInlineProse(symbol.meaning)}</span>${symbol.unit ? `<span class="symbol-unit">${renderInlineProse(symbol.unit)}</span>` : ''}</div>`,
    )
    .join('');
  const rearrangements = (formula.rearrangements ?? [])
    .map((item) => `<li>${renderLatex(item.latex, { display: false })} <span class="hint">— ${escapeHtml(item.note)}</span></li>`)
    .join('');
  const notes = (formula.notes ?? []).map((note) => `<li>${renderInlineProse(note)}</li>`).join('');
  return `<div class="formula-card" data-formula data-latex="${escapeAttribute(formula.latex)}">
  <div class="formula-head">
    <div>
      <h4 class="formula-name">${escapeHtml(formula.name)}</h4>
      ${formula.en ? `<p class="formula-en">${escapeHtml(formula.en)}</p>` : ''}
    </div>
    <button class="copy-button" type="button" data-copy-formula aria-label="کپی فرمول">کپی</button>
  </div>
  <div class="formula-display">${renderLatex(formula.latex, { display: true })}</div>
  <div class="formula-interpretation">${renderProse(formula.interpretation)}</div>
  ${compact ? '' : `<dl class="symbol-list">${symbols}</dl>`}
  ${compact ? '' : `<div class="formula-usage">
    <div class="usage-when"><h5>${glyph('bolt', 14)} کِی استفاده کنم؟</h5>${renderProse(formula.whenToUse)}</div>
    <div class="usage-avoid"><h5>${glyph('warn', 14)} کِی استفاده نکنم؟</h5>${renderProse(formula.whenNotToUse)}</div>
  </div>`}
  ${rearrangements ? `<div class="formula-rearrangements"><h5>بازنویسی‌های مفید</h5><ul>${rearrangements}</ul></div>` : ''}
  ${notes ? `<div class="formula-notes"><h5>نکته‌ها</h5><ul>${notes}</ul></div>` : ''}
</div>`;
}

export function callout(kind, title, html, { details = false } = {}) {
  const icons = { tip: 'bolt', warn: 'warn', supplement: 'spark', lost: 'life', source: 'book' };
  const body = details ? `<details class="callout-details"><summary>${escapeHtml(title)}</summary><div class="callout-body">${html}</div></details>` : `<div class="callout-body"><h4 class="callout-title">${escapeHtml(title)}</h4>${html}</div>`;
  return `<aside class="callout callout-${kind}"><p class="callout-icon">${glyph(icons[kind] ?? 'bolt', 16)}</p>${body}</aside>`;
}

export function stepsBlock(example) {
  const steps = example.steps
    .map(
      (step, index) => `<details class="step"${index === 0 ? ' open' : ''}>
  <summary><span class="step-index">${toPersian(index + 1)}</span><span class="step-label">${escapeHtml(step.label)}</span></summary>
  <div class="step-body">${renderProse(step.body)}</div>
</details>`,
    )
    .join('');
  const answerLatex = example.answer.latex ? renderLatex(example.answer.latex, { display: true }) : '';
  return `<div class="example" data-example>
  <h4 class="example-title">${escapeHtml(example.title)}</h4>
  <div class="example-problem"><span class="example-label">صورت مسئله</span>${renderProse(example.problem)}</div>
  <div class="example-steps" data-steps>
    ${steps}
    <div class="steps-controls">
      <button type="button" class="ghost-button" data-steps-all>نمایش همه‌ی گام‌ها</button>
      <button type="button" class="ghost-button" data-steps-reset>بستن همه</button>
    </div>
  </div>
  <details class="example-answer">
    <summary>جواب نهایی را ببین</summary>
    <div class="example-answer-body">${answerLatex}${renderProse(example.answer.body)}${example.tip ? `<p class="example-tip"><strong>نکته:</strong> ${renderInlineProse(example.tip)}</p>` : ''}</div>
  </details>
</div>`;
}

export function misconceptionsBlock(items) {
  if (!items.length) return '';
  // A misconception is one sentence, so it renders inline and stays on the row with its mark.
  // Wrapping the block renderer in `<p>` used to emit
  // `<p class="wrong"><span class="mark">✕</span><p>…</p></p>`, which the HTML parser repaired by
  // closing the outer paragraph first: the mark rendered alone on its own 24 px row, the sentence on
  // the next one, plus an empty paragraph per block.
  const rows = items
    .map(
      (item) => `<li class="misconception">
    <p class="wrong"><span class="mark mark-wrong" aria-hidden="true">✕</span><span class="misconception-text">${renderInlineProse(item.wrong)}</span></p>
    <p class="right"><span class="mark mark-right" aria-hidden="true">✓</span><span class="misconception-text">${renderInlineProse(item.right)}</span></p>
  </li>`,
    )
    .join('');
  return `<ul class="misconceptions">${rows}</ul>`;
}

/** One interactive figure plus its always-available text equivalent. */
function oneSim(simId, caption, fallback, conceptId) {
  return `<div class="sim" data-sim="${escapeAttribute(simId)}" data-concept="${escapeAttribute(conceptId)}">
  <div class="sim-stage" data-sim-stage>
    <p class="sim-loading">در حال آماده‌سازی شبیه‌سازی…</p>
  </div>
  <details class="sim-text">
    <summary>توضیح متنی همین تصویر (بدون نیاز به اجرا)</summary>
    <div>${renderProse(fallback)}</div>
  </details>
</div>`;
}

/**
 * A concept's layer-B figures.
 *
 * `visual.sim` is the primary figure; `visual.extra` carries further compact figures for the same
 * concept, so a lesson can host a second lab without the learner having to leave for `/sims/`. Each
 * extra still ships its own text equivalent, and every figure resolves through the same lazy chunk
 * registry, so nothing here duplicates simulation code.
 */
export function simBlock(visual, conceptId) {
  const parts = [];
  const primary = visual?.sim;
  if (primary) {
    parts.push(oneSim(primary, visual.caption, visual.fallback, conceptId));
  }
  for (const extra of visual?.extra ?? []) {
    if (!extra?.sim) continue;
    parts.push(
      `<p class="sim-extra-caption">${escapeHtml(extra.caption)}</p>` +
        oneSim(extra.sim, extra.caption, extra.fallback ?? visual.fallback, conceptId),
    );
  }
  return parts.join('\n');
}

export function quizBlock(questions, { title = 'بیا امتحان کنیم', partId = 'part-1' } = {}) {
  const items = questions
    .map(
      (question, index) => `<li class="quiz-item" data-question data-type="${escapeAttribute(question.type)}" data-answer="${escapeAttribute(String(question.answer))}" data-tolerance="${question.tolerance ?? ''}" data-unit="${escapeAttribute(question.unit ?? '')}"${question.type === 'mcq' ? ` data-options="${escapeAttribute(JSON.stringify(question.options.map((option) => ({ id: option.id, text: option.text, html: renderInlineProse(option.text) }))))}"` : ''}>
    <p class="quiz-prompt"><span class="quiz-number">${toPersian(index + 1)}</span><span class="quiz-prompt-text">${renderInlineProse(question.prompt)}</span></p>
    <form class="quiz-form" novalidate></form>
    <p class="quiz-feedback" data-feedback hidden></p>
    <details class="quiz-explain" data-explain hidden><summary>چرا؟</summary><div>${renderProse(question.explain)}</div></details>
  </li>`,
    )
    .join('');
  return `<section class="quiz" data-quiz data-part="${escapeAttribute(partId)}" style="--part-hue:${partMeta(partId).hue};--part-ink:${partMeta(partId).ink};--part-tint:${partMeta(partId).tint}">
  <header class="quiz-head">
    <h3>${escapeHtml(title)}</h3>
    <div class="quiz-score" data-quiz-score aria-live="polite"></div>
  </header>
  <ol class="quiz-list">${items}</ol>
  <div class="quiz-actions">
    <button type="button" class="ghost-button" data-quiz-retry>تلاش دوباره</button>
    <span class="quiz-status" data-quiz-status role="status"></span>
  </div>
</section>`;
}

export function rescueBlock(rescue, concept, prefix) {
  const prereq = concept.prereqs.length ? rescue.prereq : null;
  return `<section class="rescue" id="lost" data-rescue hidden>
  <header class="rescue-head">
    <h3>${glyph('life', 18)} مسیر نجات: «این قسمت رو نمی‌فهمم»</h3>
    <button type="button" class="ghost-button" data-rescue-close>بستن و برگشت به درس</button>
  </header>
  <ol class="rescue-steps">
    <li><h4>۱) اول این پیش‌نیاز را ببین</h4>${prereq ? `<p><a class="inline-link" href="${prefix}concept/${prereq}/">${escapeHtml(rescue.prereqTitle ?? 'مفهوم پیش‌نیاز')}</a></p>` : '<p>این مفهوم، نقطه‌ی شروع است و پیش‌نیازی ندارد.</p>'}</li>
    <li><h4>۲) توضیح ساده‌تر</h4>${renderProse(rescue.simpler)}</li>
    <li><h4>۳) به تصویر نگاه کن</h4>${renderProse(rescue.visual)}</li>
    <li><h4>۴) یک مثال خیلی کوچک</h4><p><strong>${escapeHtml(rescue.tiny.title)}:</strong> ${renderInlineProse(rescue.tiny.body)}</p></li>
  </ol>
  <button type="button" class="primary-button" data-rescue-back>برگشت به همین مفهوم ↑</button>
</section>`;
}

export function tocBlock(items) {
  const list = items.map((item) => `<li><a href="#${item.id}">${escapeHtml(item.label)}</a></li>`).join('');
  return `<nav class="toc" aria-label="فهرست این درس"><h2 class="toc-title">در این درس</h2><ol>${list}</ol></nav>`;
}