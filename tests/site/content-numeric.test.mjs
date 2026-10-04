/**
 * Content numerical QA gate.
 *
 * Fails when a learner-facing number in the course content is actually wrong. It does not compare
 * display strings: `6×10⁻³ N`, `0.006 N` and `6 mN` are the same claim and all pass, while
 * `6×10⁻⁹ N` fails. That semantic comparison is what makes this a real oracle rather than a
 * snapshot of today's formatting.
 *
 * See docs/exec-plans/active/physics2-upgrade-p0-p3-p4-mobile.md §5.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

import { registry } from '../../app/content/index.mjs';
import { runAudit, STATUS } from '../../app/content/qa/audit.mjs';
import {
  agreesAtStatedPrecision,
  auditSegment,
  closeEnough,
  evaluateFragment,
  numericClaimsIn,
  statedPrecision,
} from '../../app/content/qa/numeric.mjs';
import { ORACLES } from '../../app/content/qa/oracles.mjs';

const report = runAudit(registry);

test('no numeric chain in the course contradicts itself', () => {
  const detail = report.findings
    .filter((finding) => finding.kind === 'contradiction')
    .map((finding) => `${finding.where}: ${finding.detail}`)
    .join('\n');
  assert.equal(report.counts.contradictions, 0, `numeric contradictions found:\n${detail}`);
});

test('every declared oracle re-derives, satisfies its relation, and matches the learner', () => {
  const detail = report.findings
    .filter((finding) => finding.kind === 'oracle')
    .map((finding) => `${finding.where}: ${finding.detail}`)
    .join('\n');
  assert.deepEqual(report.findings.filter((f) => f.kind === 'oracle'), [], detail);
  assert.equal(report.counts.oraclePass, ORACLES.length);
  for (const result of report.oracleResults) assert.equal(result.status, STATUS.PASS, result.claimId);
});

test('the known Electric Field defect cannot come back', () => {
  const question = registry.questionById.get('p1-field-1');
  assert.ok(question, 'p1-field-1 exists');

  // 3 µC in 2000 N/C is 6 mN. Checked numerically, not by looking for a string.
  const correct = numericClaimsIn(question.explain).find((claim) => claim.unit === 'N');
  assert.ok(correct, 'the explanation states a force in newtons');
  assert.ok(closeEnough(correct.value, 6e-3, 1e-9), `force is ${correct.value} N, expected 6e-3 N`);

  // `a` and `c` deliberately state the same magnitude in opposite directions, so uniqueness must be
  // judged on value *and* direction: checking the number alone would wrongly call both correct.
  const direction = (text) => (/خلاف/.test(text) ? 'opposite' : 'along');
  const withForce = (option) =>
    numericClaimsIn(option.text).filter((claim) => claim.unit === 'N').some((claim) =>
      closeEnough(claim.value, 6e-3, 1e-9),
    );

  const matching = question.options.filter(withForce);
  assert.equal(matching.length, 2, 'the correct magnitude should appear once along, once against the field');
  assert.equal(matching.filter((option) => direction(option.text) === 'along').length, 1);
  assert.equal(matching.filter((option) => direction(option.text) === 'opposite').length, 1);

  const answerOption = question.options.find((option) => option.id === question.answer);
  assert.ok(answerOption, 'the answer key points at a real option');
  assert.ok(withForce(answerOption), `option ${question.answer} must state 6×10⁻³ N`);
  assert.equal(direction(answerOption.text), 'along', 'a positive test charge feels a force along E');

  // The marked-correct option and the explanation must carry the right value. Other options may
  // legitimately keep `6\times10^{-9}` — it is the exponent slip, and a useful distractor.
  assert.ok(!String(answerOption.text).includes('6\\times10^{-9}'));
  assert.ok(!String(question.explain).includes('6\\times10^{-9}'));
  assert.ok(
    question.options.some((option) => option.id !== question.answer && String(option.text).includes('6\\times10^{-9}')),
    'the exponent slip should remain available as a distractor',
  );
});

test('the numeric reader is semantic, not formatting-fragile', () => {
  // The same quantity written four different ways must read identically…
  for (const source of ['6\\times10^{-3}\\,N', '0.006\\,N', '6\\,mN', '6\\times10^{-3}\\,\\text{N}']) {
    const result = evaluateFragment(source);
    assert.ok(result.ok, `${source} should parse (${result.reason})`);
    assert.equal(result.unit, 'N', source);
    assert.ok(closeEnough(result.value, 6e-3, 1e-12), `${source} = ${result.value}`);
  }
  // …while the wrong exponent must not be mistaken for the right one.
  const wrong = evaluateFragment('6\\times10^{-9}\\,N');
  assert.ok(wrong.ok);
  assert.ok(!closeEnough(wrong.value, 6e-3, 1e-6), 'the 10⁻⁹ slip must not compare equal to 6 mN');

  // Rounding is compared at the precision the statement writes, not with a flat tolerance.
  assert.ok(agreesAtStatedPrecision(1.5588, 1.6, statedPrecision('1.6\\,N')));
  assert.ok(!agreesAtStatedPrecision(0.5977, 0.59, statedPrecision('0.59\\,\\Omega')));
  assert.equal(auditSegment('1/3^2 = 1/9').verdict, 'verified');
  assert.equal(auditSegment('3\\times10^{-6}\\times2000 = 6\\times10^{-9}\\,N').verdict, 'contradiction');
  assert.equal(auditSegment('3\\times10^{-6}\\times2000 = 6\\times10^{-3}\\,N').verdict, 'verified');
});

test('physics typography the notes rely on is read correctly', () => {
  const cases = [
    ['8.99\\times10^9', 8.99e9],            // bare exponent
    ['2\\times10^{-6}', 2e-6],              // braced negative exponent
    ['\\frac{9}{8}\\times10^7', 1.125e7],    // fraction × scientific
    ['\\frac{9\\times10^9\\times10^{-6}}{8\\times10^{-4}}', 1.125e7],
    ['1.8\\cos60^\\circ - 3.6', -2.7],       // implicit trig + degree marker
    ['\\sqrt{3^2+4^2}', 5],
    ['\\varepsilon_0', 8.85e-12],            // named constant
  ];
  for (const [source, expected] of cases) {
    const result = evaluateFragment(source);
    assert.ok(result.ok, `${source} should parse (${result.reason})`);
    assert.ok(closeEnough(result.value, expected, 1e-6), `${source} = ${result.value}, expected ${expected}`);
  }

  // A unit conversion is understood, so equivalent statements compare equal.
  const millimetres = evaluateFragment('0.18\\,mm/s');
  const metres = evaluateFragment('1.8\\times10^{-4}\\,\\text{m/s}');
  assert.ok(millimetres.ok && metres.ok);
  assert.ok(closeEnough(millimetres.value, metres.value, 1e-9));
});

test('unreadable content is reported, never silently treated as correct', () => {
  assert.ok(report.counts.unparsedChains > 0, 'the audit still has UNPROVEN residue to report');
  assert.equal(report.status, STATUS.PASS, 'UNPROVEN residue must not turn the audit red');
  // Symbolic relations are classified as symbolic, not as verified.
  assert.equal(auditSegment('F = k\\,\\frac{|q_1 q_2|}{r^2}').verdict, 'symbolic');
});
