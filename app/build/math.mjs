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
/**
 * Separators between whole equations inside one display line.
 *
 * A line that joins two equations with `\qquad`, a `\Rightarrow` step or a comma-gap is unreadable on
 * a phone: measured at 390 px, the RC charging pair lost 172 CSS px and the permittivity pair 107 px
 * off the right edge of an internally scrollable box, so half the formula was invisible with no
 * affordance. Those gaps always separate whole equations or derivation steps, so each part gets its
 * own line. This lives at module scope on purpose: the identical literal written inline in the call
 * silently stopped matching, which is exactly the kind of thing a constant makes testable.
 */
const DISPLAY_SPLIT = /\\qquad\s*|\\quad\s*\\Rightarrow\s*(?:\\quad\s*)?|,\s*\\quad\s*/;

export function renderLatex(latex, { display = false, copy = false } = {}) {
  const source = latex.trim();
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const lines = display
      ? source
          .split(DISPLAY_SPLIT)
          // A comma in front of the gap belongs to the separator, not to the equation it followed.
          .map((line) => line.trim().replace(/,$/, '').trim())
          .filter(Boolean)
      : [];
    // `.join('')` is load-bearing: array interpolation would insert commas between the lines, and a
    // bare text node inside the grid became an anonymous row holding one stray comma.
    const body = lines.length > 1 ? lines.map((line) => renderMath(line, display)).join('') : renderMath(source, display);
    const stacked = lines.length > 1 ? `<div class="math-stack" role="math" aria-label="${escapeAttribute(source)}">${body}</div>` : body;
    return copy ? `<span class="math-copy" data-latex="${escapeAttribute(source)}">${stacked}</span>` : stacked;
  } catch (error) {
    problems.push(`استثنای رندر ریاضی برای «${source}»: ${error.message}`);
    return `<span class="math-error">${escapeHtml(source)}</span>`;
  } finally {
    console.warn = originalWarn;
  }
}

/** One KaTeX run in the requested mode, wrapped in the site's LTR-isolated container. */
function renderMath(source, display) {
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const html = katex.renderToString(source, { ...OPTIONS, displayMode: display });
    // Two ways KaTeX says "this is not valid": a ParseError node (`katex-error`), and a character it
    // cannot typeset, which it paints in the error colour with the command it wanted (`\cdotp` for a
    // raw `·`). The second one shipped silently for a while: a unit read `N\cdottpm²` instead of
    // `N·m²`, and no check looked for it. A command painted as visible text never happens in valid
    // output, so the backslash is the signal — not the colour, which KaTeX takes from our options.
    if (/katex-error/.test(html)) {
      problems.push(`خطای ریاضی [${process.env.DEBUG_WHERE ?? '?'}]: ${source}`);
      if (process.env.DEBUG_STACK) problems.push(new Error().stack.split('\n').slice(1, 5).join(' | '));
    }
    const paintedCommand = html.match(/>\\[a-zA-Z]+</);
    if (paintedCommand) {
      problems.push(`نویسه‌ی پشتیبانی‌نشده در ریاضی [${process.env.DEBUG_WHERE ?? '?'}]: ${source} → ${paintedCommand[0]}`);
    }
    return display
      ? `<div class="math-block" role="math" aria-label="${escapeAttribute(source)}">${html}</div>`
      : `<span class="math-inline" role="math" aria-label="${escapeAttribute(source)}">${html}</span>`;
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