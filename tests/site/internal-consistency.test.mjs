/**
 * Internal consistency gate.
 *
 * The counts a learner reads must be derived from the registry, not typed by hand. A hardcoded
 * default once shipped `۴۸` against a 47-concept registry, and JavaScript silently corrected it —
 * so the page was only right when scripts ran, breaking the "readable without JavaScript" invariant.
 *
 * These assertions read the *built HTML*, because that is what the learner receives with scripting
 * disabled. Check the data model alone would have missed the defect.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { registry } from '../../app/content/index.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const dist = path.join(root, 'dist');

const BUILT = existsSync(path.join(dist, 'index.html'));
const read = (relative) => readFileSync(path.join(dist, relative), 'utf8');
const skip = BUILT ? false : 'run `npm run build` first';

const conceptCount = registry.concepts.length;
const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

test('every concept page exists and no page points at a concept that does not', { skip }, () => {
  const slugs = new Set(registry.concepts.map((concept) => concept.id));
  assert.ok(conceptCount > 0);

  for (const concept of registry.concepts) {
    assert.ok(existsSync(path.join(dist, 'concept', concept.id, 'index.html')), `missing page for ${concept.id}`);
    for (const prereq of concept.prereqs) {
      assert.ok(slugs.has(prereq), `${concept.id} lists unknown prerequisite ${prereq}`);
    }
    for (const related of concept.related) {
      assert.ok(slugs.has(related.id), `${concept.id} links to unknown concept ${related.id}`);
    }
    for (const questionId of concept.practice) {
      assert.ok(registry.questionById.has(questionId), `${concept.id} practices unknown question ${questionId}`);
    }
  }
});

test('practice references and answers are complete', { skip }, () => {
  const referenced = new Set(registry.concepts.flatMap((concept) => concept.practice));
  for (const question of registry.questions) {
    assert.ok(referenced.has(question.id), `${question.id} is never practised by any concept`);
    if (question.type === 'mcq') {
      const ids = question.options.map((option) => option.id);
      assert.equal(new Set(ids).size, ids.length, `${question.id} has duplicate option ids`);
      assert.ok(ids.includes(question.answer), `${question.id} answer is not one of its options`);
      assert.equal(
        new Set(question.options.map((option) => option.text)).size,
        ids.length,
        `${question.id} has two identical options, so only one can be right`,
      );
    }
  }
});

test('the shipped progress total equals the registry, with or without JavaScript', { skip }, () => {
  for (const page of ['index.html', 'concept/electric-field/index.html', 'formulas/index.html', 'sims/index.html']) {
    const html = read(page);
    const total = html.match(/data-progress-total>([^<]*)</)?.[1];
    assert.equal(total, fa(conceptCount), `${page} ships a progress total of ${total}, registry has ${conceptCount}`);
    const attribute = html.match(/data-concept-count="(\d+)"/)?.[1];
    assert.equal(attribute, String(conceptCount), `${page} ships data-concept-count=${attribute}`);
  }
});

test('no built page nests a paragraph inside a paragraph', { skip }, () => {
  // Defect class: the block prose renderer was injected inside a `<p>`, so the shipped markup was
  // `<p class="wrong"><span class="mark">✕</span><p>…</p></p>`. That is invalid nesting, and the
  // parser repairs it by closing the outer paragraph first: on the misconception cards the ✕/✓ mark
  // rendered alone on its own 24 px row, the sentence on the next, plus an empty paragraph per block —
  // on every concept page and the formula pages, worst on a phone. Reading the *built* HTML is the
  // point: the invalid nesting is what shipped, and the browser hides it.
  const nested = /<p(?: [^>]*)?>(?:(?!<\/p>)[\s\S])*?<p[\s>]/;
  const pages = [
    'index.html',
    'formulas/index.html',
    'lessons/part-1/index.html',
    'lessons/part-5/index.html',
    'map/index.html',
    ...registry.concepts.map((concept) => `concept/${concept.id}/index.html`),
  ];
  const offenders = [];
  for (const page of pages) {
    if (nested.test(read(page))) offenders.push(page);
  }
  assert.deepEqual(offenders, [], `a <p> opens inside another <p> on: ${offenders.join(', ')}`);
});

test('a misconception keeps its mark and its sentence on one row', { skip }, () => {
  // Defect class: the block prose renderer was injected inside a `<p>`, so the shipped markup was
  // `<p class="wrong"><span class="mark">✕</span><p>…</p></p>`. The parser closed the outer paragraph
  // first, which rendered the ✕ alone on its own 24 px row, the sentence on the next, and an extra
  // empty paragraph per block — on every concept page, worst on a phone. This reads the built HTML,
  // because that invalid nesting is what shipped.
  let checked = 0;
  for (const concept of registry.concepts) {
    const html = read(`concept/${concept.id}/index.html`);
    const rows = [...html.matchAll(/<p class="(?:wrong|right)">([^<]*)<span class="mark[^>]*>[^<]*<\/span>([\s\S]*?)<\/p>/g)];
    for (const [, , rest] of rows) {
      const text = rest.replace(/<[^>]*>/g, '').trim();
      assert.ok(text.length > 0, `${concept.id}: a misconception row renders its mark with no sentence`);
      checked += 1;
    }
    const orphan = html.match(/<p class="(?:wrong|right)">\s*<span class="mark[^>]*>[^<]*<\/span>\s*<\/p>/);
    assert.equal(orphan, null, `${concept.id}: a misconception row is an orphaned mark — ${orphan?.[0]}`);
  }
  assert.ok(checked > 20, `only ${checked} misconception rows were inspected; the page set looks wrong`);
});

test('displayed aggregates are derived, not typed', { skip }, () => {
  const home = read('index.html');
  const formulas = home.match(/data-stat="formulas"[^>]*>([^<]*)</)?.[1];
  const questions = home.match(/data-stat="questions"[^>]*>([^<]*)</)?.[1];
  assert.equal(formulas, fa(registry.formulas.length), 'home formula count drifted from the registry');
  assert.equal(questions, fa(registry.questions.length), 'home question count drifted from the registry');

  const totalMinutes = registry.concepts.reduce((sum, concept) => sum + concept.effort, 0);
  assert.equal(Math.round(totalMinutes / 60), 10, 'the stated total study time changed; check the ladder');
});
