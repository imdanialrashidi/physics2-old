import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { assertCoverage, buildCoverage } from './coverage.mjs';
import { mathProblems } from './math.mjs';
import { parseAllNotes } from './notes.mjs';
import {
  conceptsPage,
  conceptPage,
  formulasPage,
  glossaryPage,
  homePage,
  mapPage,
  notFoundPage,
  partPage,
  practiceHubPage,
  practiceTopicPage,
  searchPage,
  simsPage,
} from './pages.mjs';
import { registry } from '../content/index.mjs';

export const DIST = path.resolve('dist');

/** Reads the Vite manifest so pages can point at hashed, cacheable assets. */
export function readAssets() {
  const manifestPath = path.join(DIST, '.vite', 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error('Vite manifest not found. Run `npm run build:assets` before building pages.');
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const entry = Object.values(manifest).find((item) => item.src?.endsWith('app/client/main.ts'));
  if (!entry) throw new Error('Client entry app/client/main.ts missing from the Vite manifest.');
  const cssFile = (entry.css ?? []).map((file) => file.split('/').pop()).join(',');
  if (!cssFile) throw new Error('Client entry has no stylesheet in the Vite manifest.');
  return { jsFile: entry.file.split('/').pop(), cssFile };
}

/**
 * Normalises the deployment base (`physics2`, `/physics2`, `/physics2/`) into the absolute prefix
 * `/physics2/` used by pages whose depth is not known at build time. Empty when not configured.
 */
export function normaliseSiteBase(value = process.env.SITE_BASE ?? '') {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '';
}

/** Asset URLs for a page at `depth` levels below the site root. */
export function assetUrls({ depth = 0, base = '', jsFile, cssFile } = {}) {
  const prefix = base || (depth === 0 ? '' : '../'.repeat(depth));
  return {
    js: jsFile ? `${prefix}assets/${jsFile}` : '',
    css: cssFile ? `${prefix}assets/${cssFile}` : '',
    favicon: `${prefix}assets/favicon.svg`,
  };
}

/**
 * Every route of the site. Directory-style routes keep direct navigation and refresh working on
 * GitHub Pages project sub-paths, and `prefix` keeps all asset links relative. The 404 page is the
 * one route whose depth is unknowable — GitHub Pages serves it at whatever URL was requested — so
 * it opts into the absolute deployment base instead of a relative prefix.
 */
export function buildRoutes(registryData = registry) {
  const routes = [
    { file: 'index.html', depth: 0, render: (ctx) => homePage(ctx) },
    ...registryData.parts.map((part) => ({
      file: `lessons/${part.id}/index.html`,
      depth: 2,
      render: (ctx) => partPage(ctx, part),
    })),
    ...registryData.concepts.map((concept) => ({
      file: `concept/${concept.id}/index.html`,
      depth: 2,
      render: (ctx) => conceptPage(ctx, concept),
    })),
    { file: 'concepts/index.html', depth: 1, render: (ctx) => conceptsPage(ctx) },
    { file: 'formulas/index.html', depth: 1, render: (ctx) => formulasPage(ctx) },
    { file: 'practice/index.html', depth: 1, render: (ctx) => practiceHubPage(ctx) },
    ...registryData.parts.map((part) => ({
      file: `practice/${part.id}/index.html`,
      depth: 2,
      render: (ctx) => practiceTopicPage(ctx, part.id),
    })),
    { file: 'practice/mixed/index.html', depth: 2, render: (ctx) => practiceTopicPage(ctx, 'mixed') },
    { file: 'sims/index.html', depth: 1, render: (ctx) => simsPage(ctx) },
    { file: 'map/index.html', depth: 1, render: (ctx) => mapPage(ctx) },
    { file: 'glossary/index.html', depth: 1, render: (ctx) => glossaryPage(ctx) },
    { file: 'search/index.html', depth: 1, render: (ctx) => searchPage(ctx) },
    { file: '404.html', depth: 0, absolute: true, render: (ctx) => notFoundPage(ctx) },
  ];
  return routes;
}

export function renderSite({ jsFile, cssFile, coverageOnly = false, allowGaps = false, siteBase = normaliseSiteBase() } = {}) {
  const notes = parseAllNotes();
  const coverage = buildCoverage(notes, registry);
  // `--allow-gaps` is for authoring sessions only; CI and `npm run build` stay strict.
  const report = allowGaps ? coverage : assertCoverage(coverage);
  if (allowGaps && coverage.problems.length) {
    process.stderr.write(`⚠ ${coverage.problems.length} مورد پوشش‌داده‌نشده (حالت --allow-gaps)\n`);
  }
  if (coverageOnly) return { report, pages: [] };
  if (!jsFile) throw new Error('jsFile is required unless coverageOnly is set');

  const pages = buildRoutes(registry).map((route) => {
    const absolute = route.absolute && siteBase ? siteBase : '';
    const prefix = absolute || (route.depth === 0 ? '' : '../'.repeat(route.depth));
    const assets = assetUrls({ depth: route.depth, base: absolute, jsFile, cssFile });
    const html = route.render({ registry, prefix, assets });
    return { file: route.file, html, title: /<title>([^<]*)<\/title>/.exec(html)?.[1] ?? '' };
  });
  return { report, pages };
}

/** Static search index: concepts, formulas and practice prompts for the client-side search. */
export function buildSearchIndex() {
  const entries = [];
  for (const concept of registry.concepts) {
    entries.push({
      type: 'concept',
      id: concept.id,
      part: concept.part,
      title: concept.title,
      en: concept.en,
      href: `concept/${concept.id}/`,
      text: `${concept.keywords.join(' ')} ${concept.intuition} ${concept.misconceptions.map((item) => `${item.wrong} ${item.right}`).join(' ')}`,
    });
  }
  for (const formula of registry.formulas) {
    entries.push({
      type: 'formula',
      id: formula.id,
      part: formula.part,
      title: formula.name,
      en: formula.en ?? '',
      href: 'formulas/',
      text: `${formula.latex} ${formula.interpretation} ${formula.whenToUse}`,
    });
  }
  for (const question of registry.questions) {
    entries.push({
      type: 'question',
      id: question.id,
      part: question.concepts?.length ? registry.conceptById.get(question.concepts[0])?.part : undefined,
      title: question.prompt.replace(/\$[^$]*\$/g, '').replace(/\*\*/g, '').slice(0, 80),
      en: '',
      href: question.concepts?.length ? `concept/${question.concepts[0]}/` : 'practice/',
      text: question.explain,
    });
  }
  return entries;
}

function writeSite({ pages, report }) {
  // `vite build` already empties dist; only the generated pages are written here.
  for (const page of pages) {
    const target = path.join(DIST, page.file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, page.html, 'utf8');
  }
  copyFileSync(path.resolve('app/static/favicon.svg'), path.join(DIST, 'assets', 'favicon.svg'));
  writeFileSync(path.join(DIST, 'search-index.json'), JSON.stringify(buildSearchIndex()), 'utf8');
  writeFileSync(path.join(DIST, 'coverage.json'), JSON.stringify(report, null, 2), 'utf8');
}

function printSummary(report, pages) {
  const missing = report.formulas.filter((formula) => !formula.present);
  const lines = [
    '',
    '  ┌─ پوشش جزوه ─────────────────────────────────────────────',
    `  │ فایل‌های جزوه: ${toFa(report.counts.notes)}   بخش‌ها: ${toFa(report.counts.sections)}   مفهوم: ${toFa(report.counts.concepts)}`,
    `  │ پرسش تمرینی: ${toFa(report.counts.questions)}   فرمول کلیدی جزوه: ${toFa(report.counts.boxedFormulas)}`,
    `  │ صفحه‌های تولیدشده: ${toFa(pages.length)}`,
    `  │ فرمول‌های کلیدی پیاده‌نشده: ${toFa(missing.length)}`,
    '  └──────────────────────────────────────────────────────────',
    '',
  ];
  process.stdout.write(`${lines.join('\n')}\n`);
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const toFa = (value) => String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)]);

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const coverageOnly = process.argv.includes('--coverage-only');
  try {
    const { jsFile, cssFile } = readAssets();
    const result = renderSite({
      jsFile,
      cssFile,
      coverageOnly,
      allowGaps: process.argv.includes('--allow-gaps'),
    });
    const mathErrors = mathProblems();
    if (mathErrors.length) throw new Error(`خطای رندر ریاضی:\n- ${mathErrors.join('\n- ')}`);
    if (!coverageOnly) {
      writeSite(result);
      printSummary(result.report, result.pages);
    } else {
      printSummary(result.report, []);
      process.stdout.write('  پوشش کامل است.\n\n');
    }
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}