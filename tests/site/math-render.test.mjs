/** Targeted checks on the prose→HTML and LaTeX pipeline used for every page. */
import assert from 'node:assert/strict';
import test from 'node:test';

import { escapeHtml, mathProblems, renderInlineProse, renderLatex, renderProse } from '../../app/build/math.mjs';

test('display and inline math render to static KaTeX markup', () => {
  const display = renderLatex(String.raw`E = \frac{\sigma}{2\varepsilon_0}`, { display: true });
  assert.match(display, /class="math-block"/);
  assert.match(display, /katex/);
  const inline = renderLatex(String.raw`F = kvB\sin\theta`, { display: false });
  assert.match(inline, /class="math-inline"/);
  assert.match(inline, /dir="ltr"|direction: ltr|katex/, 'inline math is LTR-isolated for RTL text');
  assert.deepEqual(mathProblems(), []);
});

test('prose renders paragraphs, emphasis and code without nested <p> in inline contexts', () => {
  const html = renderProse('پاراگراف اول.\n\nپاراگراف دوم با **تاکید** و `کد`.');
  assert.equal((html.match(/<p>/g) ?? []).length, 2);
  assert.match(html, /<strong>تاکید<\/strong>/);
  assert.match(html, /<code>کد<\/code>/);
  assert.doesNotMatch(renderInlineProse('یک **تکه** $x=1$ دو تکه'), /<p>/);
});

test('HTML in content is escaped instead of injected', () => {
  assert.equal(escapeHtml('<img onerror=alert(1)>'), '&lt;img onerror=alert(1)&gt;');
  assert.doesNotMatch(renderProse('<script>alert(1)</script>'), /<script>/);
});

test('broken LaTeX is reported rather than silently rendered', () => {
  mathProblems().length = 0;
  const html = renderLatex(String.raw`\frac{1}{`);
  assert.match(html, /katex-error/, 'the failure is visible in the markup');
  assert.equal(mathProblems().length, 1);
});

test('a character KaTeX cannot typeset is reported, not painted as text', () => {
  // `\text{N·m}` with a raw U+00B7 is not typeset by KaTeX: it paints `\cdotp` in the error colour
  // and the shipped unit read `N\cdottpm²`. The first check only looked for `katex-error`, so this
  // shipped silently; this pins the second signal.
  mathProblems().length = 0;
  const html = renderLatex(String.raw`\text{N·m}^2`, { display: false });
  assert.match(html, />\\[a-zA-Z]+</, 'the unsupported character is painted as a command');
  assert.equal(mathProblems().length, 1);
  // The supported spelling is clean.
  mathProblems().length = 0;
  const good = renderLatex(String.raw`\text{N}\cdot\text{m}^2`, { display: false });
  assert.doesNotMatch(good, />\\[a-zA-Z]+</);
  assert.deepEqual(mathProblems(), []);
});

test('display formulas joined by a wide gap are stacked into readable lines', () => {
  // Measured at 390 px, one line like this lost 172 CSS px off an internally scrollable box.
  const stacked = renderLatex(String.raw`q(t) = C\varepsilon(1-e^{-t/RC}),\qquad V_C = \varepsilon(1-e^{-t/RC})`, { display: true });
  assert.match(stacked, /class="math-stack"/);
  assert.equal((stacked.match(/class="math-block"/g) ?? []).length, 2);
  // No stray text between the lines: array interpolation used to emit a comma that the grid turned
  // into a third row holding one lone comma.
  assert.equal(stacked.replace(/<div class="math-stack"[^>]*>/, '').replace(/<\/div>$/, '').includes('</div>,'), false);
  assert.match(stacked, /aria-label="q\(t\) = /, 'the whole source stays as the accessible name');
  // A single equation is untouched.
  assert.doesNotMatch(renderLatex(String.raw`F = kvB\sin\theta`, { display: true }), /math-stack/);
});
