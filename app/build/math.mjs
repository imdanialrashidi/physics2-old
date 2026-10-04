import katex from 'katex';

/** Every KaTeX failure is collected so the build can fail instead of shipping broken math. */
const problems = [];

export function mathProblems() {
  return problems;
}

const OPTIONS = {
  throwOnError: false,
  errorColor: '#c0392b',
  strict: false,
  output: 'html',
  trust: false,
  macros: { '\\RR': '\\mathbb{R}', '\\SI': '\\mathrm{}' },
};

/**
 * Renders one LaTeX expression to static HTML (no runtime math JS needed).
 * KaTeX logs missing-glyph metrics for Persian text inside `\text{}`; those are harmless in HTML
 * output mode, so they are captured instead of flooding the build log.
 */
export function renderLatex(latex, { display = false, copy = false } = {}) {
  const source = latex.trim();
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const html = katex.renderToString(source, { ...OPTIONS, displayMode: display });
    if (/katex-error/.test(html)) {
      problems.push(`خطای ریاضی [${process.env.DEBUG_WHERE ?? '?'}]: ${source}`);
      if (process.env.DEBUG_STACK) problems.push(new Error().stack.split('\n').slice(1, 5).join(' | '));
    }
    const wrapped = display
      ? `<div class="math-block" role="math" aria-label="${escapeAttribute(source)}">${html}</div>`
      : `<span class="math-inline" role="math" aria-label="${escapeAttribute(source)}">${html}</span>`;
    return copy ? `<span class="math-copy" data-latex="${escapeAttribute(source)}">${wrapped}</span>` : wrapped;
  } catch (error) {
    problems.push(`استثنای رندر ریاضی برای «${source}»: ${error.message}`);
    return `<span class="math-error">${escapeHtml(source)}</span>`;
  } finally {
    console.warn = originalWarn;
  }
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

const INLINE_MATH = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;

/**
 * Converts authored Persian prose into HTML: paragraphs, **bold**, *italic*, `code`,
 * `$inline math$` and `$$display math$$`.
 */
export function renderProse(text) {
  if (!text) return '';
  const blocks = String(text).split(/\n{2,}/).filter((block) => block.trim());
  return blocks.map((block) => `<p>${renderInline(block.trim())}</p>`).join('');
}

/**
 * Renders a short string without a wrapping <p>, for places that already provide the block element
 * (quiz prompts, table cells, list items). Nested <p> inside <p> is invalid and breaks layout.
 */
export function renderInlineProse(text) {
  if (!text) return '';
  return String(text).split(/\n{2,}/).filter((block) => block.trim()).map((block) => renderInline(block.trim())).join(' ');
}

function renderInline(text) {
  let html = '';
  let cursor = 0;
  const pattern = new RegExp(INLINE_MATH.source, 'g');
  let match;
  while ((match = pattern.exec(text)) !== null) {
    html += renderMarks(text.slice(cursor, match.index));
    if (match[1] !== undefined) html += renderLatex(match[1], { display: true });
    else html += renderLatex(match[2] ?? '', { display: false });
    cursor = match.index + match[0].length;
  }
  html += renderMarks(text.slice(cursor));
  return html;
}

function renderMarks(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(«*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}