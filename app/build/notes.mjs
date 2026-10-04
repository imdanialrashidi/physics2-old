import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export const NOTES_DIR = 'Lecture notes';

/** Arabic/Persian character normalisation so text comparisons are mechanical, not visual. */
export function normaliseText(input) {
  return input
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/‌/g, ' ')
    .replace(/[()«»"'“”]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normaliseLatex(latex) {
  return latex
    .replace(/\\left|\\right/g, '')
    .replace(/\\[,;!]/g, '')
    .replace(/\\ /g, '')
    .replace(/\s+/g, '')
    .replace(/\\varepsilon/g, '\\epsilon')
    .replace(/\\dfrac|\\tfrac/g, '\\frac')
    .toLowerCase();
}

const SECTION_NUMBER = /^\s*(\d+(?:\.\d+)*)\)?[\.\)]?\s+/;
const LIST_ITEM = /^\s*(?:\d+\.|[-*])\s+(.*)$/;

function slugify(title) {
  return normaliseText(title).replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 40);
}

/**
 * Reduces a LaTeX expression to a comparable skeleton so that `k\frac{|q_1q_2|}{r^2}` and
 * `k|q_1q_2|/r^2` are recognised as the same published formula.
 */
export function expressionKey(latex) {
  let text = latex
    .replace(/\\boxed\s*/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\(quad|qquad|,|;|:|!)/g, '')
    .replace(/\\displaystyle/g, '')
    .replace(/\\times/g, '*')
    .replace(/\\simeq|\\approx|\\sim/g, '=')
    .replace(/\\varepsilon/g, '\\epsilon')
    .replace(/\\cdots|\\ldots/g, '...')
    .replace(/\\cdot(?!s)/g, '*')
    .replace(/\\mu\s*c\b/g, '\\mu c');
  // \frac{a}{b} and the short \frac12 form must be expanded before backslashes are stripped.
  text = text.replace(/\\frac\s*(\d)(\d)/g, '(1)/($2)');
  text = text.replace(/\\frac\s*(\d)\s*\{([^{}]*)\}/g, '($1)/($2)');
  for (let guard = 0; guard < 8; guard++) {
    const next = text.replace(/\\frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)');
    if (next === text) break;
    text = next;
  }
  return text
    .replace(/\\/g, '')
    .replace(/\$/g, '')
    .toLowerCase()
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '')
    .replace(/\*+/g, '*');
}

/** Extracts every boxed expression (or the whole block when nothing is boxed) from a math block. */
function extractFormulas(block, line) {
  const text = block.replace(/^\$\$\s*|\s*\$\$$/g, '').replace(/^\\\[\s*|\\\]$/g, '');
  const results = [];
  let cursor = 0;
  for (;;) {
    const start = text.indexOf('\\boxed{', cursor);
    if (start === -1) break;
    let depth = 1; // the brace opened by \boxed{
    let end = start + '\\boxed{'.length;
    for (; end < text.length; end++) {
      if (text[end] === '{') depth++;
      else if (text[end] === '}') {
        depth--;
        if (depth === 0) break;
      }
    }
    const latex = text.slice(start + '\\boxed{'.length, end);
    if (latex.trim()) results.push({ latex: latex.trim(), line, boxed: true });
    cursor = end + 1;
  }
  if (results.length === 0) {
    const plain = text
      .replace(/\\begin\{[^}]*\}|\\end\{[^}]*\}/g, '')
      .split(/\n{2,}/)
      .map((part) => part.replace(/\s+/g, ' ').trim())
      .filter((part) => part.includes('=') && /[A-Za-z\\]/.test(part) && part.length < 200);
    for (const part of plain) results.push({ latex: part, line, boxed: false });
  }
  return results;
}

/**
 * Parses one lecture-note file into sections, the formula-summary block, the topic bullets and
 * the syllabus list of Part 1. Line numbers are kept so coverage reports point at the source.
 */
export function parseNoteFile(file, partId) {
  const absolute = path.resolve(file);
  const lines = readFileSync(absolute, 'utf8').split(/\r?\n/);
  const headings = [];
  const formulas = [];
  const topics = [];
  const syllabus = [];
  let summaryDepth = 0;
  let topicDepth = 0;
  let syllabusDepth = 0;
  let inDisplayMath = false;
  let displayBuffer = [];

  headings.forEach; // keep linters from removing the const above as unused

  lines.forEach((raw, index) => {
    const lineNumber = index + 1;

    // Display math can be written as $$…$$, \[…\] or \begin{…}\end{…} and may span lines.
    if (inDisplayMath) {
      displayBuffer.push(raw);
      const closed = raw.includes('\\end{') || raw.includes('$$') || (raw.includes('\\]') && raw.trim().endsWith('\\]'));
      if (closed) {
        formulas.push(...extractFormulas(displayBuffer.join('\n'), lineNumber));
        inDisplayMath = false;
        displayBuffer = [];
      }
      return;
    }
    if (raw.includes('\\[') || raw.includes('\\]')) {
      const closed = raw.includes('\\[') && raw.includes('\\]');
      if (closed) {
        formulas.push(...extractFormulas(raw.slice(raw.indexOf('\\['), raw.indexOf('\\]') + 2), lineNumber));
        return;
      }
      inDisplayMath = true;
      displayBuffer = [raw];
      return;
    }
    const dollarCount = (raw.match(/\$\$/g) ?? []).length;
    if (dollarCount % 2 === 1 || raw.includes('\\begin{')) {
      inDisplayMath = true;
      displayBuffer = [raw];
      if (dollarCount % 2 === 0 && raw.includes('\\end{')) {
        formulas.push(...extractFormulas(displayBuffer.join('\n'), lineNumber));
        inDisplayMath = false;
        displayBuffer = [];
      }
      return;
    }

    const heading = raw.match(/^(#{1,4})\s+(.*\S)\s*$/);
    if (heading) {
      const level = heading[1].length;
      const title = heading[2].trim();
      const numbered = title.match(SECTION_NUMBER);
      const isDocTitle = /^فیزیک\s*۲\s*—\s*پارت/.test(title) || /^فایل\s*\d+/.test(title);
      const anchor = numbered ? `${partId}#${numbered[1]}` : `${partId}#slug:${slugify(title)}`;
      const record = { anchor, level, title, numbered: Boolean(numbered), line: lineNumber, isDocTitle };
      headings.push(record);
      summaryDepth = /خلاصه.*فرمول|فرمول‌های مهم|خلاصه‌ی فرمول/.test(title) ? level : 0;
      topicDepth = /مباحث این فایل/.test(title) ? level : 0;
      syllabusDepth = /سرفصل‌های پوشش‌داده‌شده/.test(title) ? level : 0;
      return;
    }

    if (summaryDepth && raw.includes('\\boxed')) {
      formulas.push(...extractFormulas(raw, lineNumber));
    }

    const item = raw.match(LIST_ITEM);
    if (item && syllabusDepth) {
      syllabus.push({ index: syllabus.length + 1, text: item[1].trim(), line: lineNumber });
      return;
    }
    if (item && topicDepth && raw.trim().startsWith('-')) {
      topics.push({ text: item[1].trim(), line: lineNumber });
    }
  });

  const sections = headings.filter((h) => !h.isDocTitle && h.numbered);
  return {
    file,
    partId,
    sections,
    headings,
    formulas,
    topics,
    syllabus,
  };
}

export function parseAllNotes(notesDir = NOTES_DIR) {
  const files = readdirSync(notesDir)
    .filter((name) => name.toLowerCase().endsWith('.md'))
    .sort();
  if (files.length !== 5) {
    throw new Error(`Expected the five lecture notes in ${notesDir}, found ${files.length}: ${files.join(', ')}`);
  }
  const partIds = ['part-1', 'part-2', 'part-3', 'part-4', 'part-5'];
  return files.map((name, index) => parseNoteFile(path.join(notesDir, name), partIds[index]));
}