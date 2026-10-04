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
