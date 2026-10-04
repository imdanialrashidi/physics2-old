/**
 * Structured numerical oracles for educationally consequential content.
 *
 * Each record is a *semantic* claim, not a formatting assertion:
 *
 *   claimId    stable id, referenced by the test and the audit report
 *   sourceRef  the content id (`question:<id>` or `concept:<id>`) that owns the claim
 *   field      which field carries the learner-facing number
 *   expression a re-derivation of the quantity, in the restricted grammar of `numeric.mjs`
 *   value      the expected SI value
 *   unit       expected unit (empty string when the claim is dimensionless)
 *   tolerance  relative tolerance against `value`
 *   relation   the physical relationship the claim rests on, re-checked here
 *   display    optional extra exact rendering; when present it must also appear in the field
 *
 * Why `expression` *and* `relation`: a number alone only proves arithmetic. `relation` proves the
 * physics — that the answer is the one the law actually gives — which is the failure mode that
 * matters most in a teaching site.
 *
 * Records whose relationship cannot be expressed here are deliberately absent rather than faked:
 * the audit reports them as `UNPROVEN`.
 */

/** @typedef {{ name: string, lhs: number, rhs: number, tolerance?: number, note?: string }} Relation */

export const ORACLES = [
  {
    claimId: 'p1-field-1.force',
    sourceRef: 'question:p1-field-1',
    field: 'explain',
    title: 'نیروی وارد بر بار آزمایشی در میدان',
    expression: '3*10**(-6) * 2000',
    value: 6e-3,
    unit: 'N',
    tolerance: 1e-9,
    relation: {
      name: 'F = qE',
      note: 'میدان ۲۰۰۰ نیوتن بر کولوم و بار آزمایشی ۳ میکروکولوم ⇒ ۶ میلی‌نیوتن، نه ۶ نانو‌نیوتن.',
      lhs: 6e-3,
      rhs: 3e-6 * 2000,
    },
    // The exact defect this task opened: the answer once read `6\times10^{-9}`, a 10^6 error.
    display: '6\\times10^{-3}',
    mustNotContain: ['6\\times10^{-9}\\,N'],
  },
  {
    claimId: 'p1-field-1.answer-magnitude',
    sourceRef: 'question:p1-field-1',
    field: 'options[a]',
    title: 'گزینه‌ی درست باید همان مقدار ۶×۱۰⁻³ را داشته باشد',
    expression: '3*10**(-6) * 2000',
    value: 6e-3,
    unit: 'N',
    tolerance: 1e-9,
    relation: { name: 'F = qE', lhs: 6e-3, rhs: 3e-6 * 2000 },
  },
  {
    claimId: 'p1-coulomb-1.force',
    sourceRef: 'question:p1-coulomb-1',
    field: 'explain',
    title: 'نیروی کولن بین دو بار در فاصله‌ی ۳۰ سانتی',
    expression: '8.99e9 * 2e-6 * 3e-6 / 0.3 ** 2',
    value: 0.599,
    unit: 'N',
    tolerance: 0.02,
    relation: {
      name: 'F = k|q1q2|/r^2',
      lhs: 8.99e9 * 2e-6 * 3e-6 / 0.09,
      rhs: 0.599,
      tolerance: 0.02,
    },
  },
  {
    claimId: 'p1-coulomb-2.inverse-square',
    sourceRef: 'question:p1-coulomb-2',
    field: 'explain',
    title: 'سه برابر شدن فاصله ⇒ یک‌نهم شدن نیرو',
    expression: '1 / 3 ** 2',
    value: 1 / 9,
    unit: '',
    tolerance: 1e-9,
    relation: {
      name: 'F ∝ 1/r^2 ⇒ F(3r)/F(r) = 1/3^2',
      note: 'ضریب ۱/۹ باید در ۹ ضرب شود تا ۱ شود؛ اگر کسی ۹/۳ بنویسد این رابطه لو می‌رود.',
      lhs: (3 ** 2) * (1 / 9),
      rhs: 1,
    },
  },
  {
    claimId: 'p1-quantization-1.n',
    sourceRef: 'question:p1-quantization-1',
    field: 'explain',
    title: 'شمار نیم‌سکه‌ی بار',
    expression: '2.4e-19 / 1.602e-19',
    value: 1.5,
    unit: '',
    tolerance: 0.05,
    relation: { name: 'q = ne ⇒ n = q/e', lhs: 2.4e-19 / 1.602e-19, rhs: 1.5, tolerance: 0.05 },
  },
  {
    claimId: 'resistivity.hot-wire',
    sourceRef: 'concept:resistivity',
    field: 'examples[0].steps[2].body',
    title: 'مقاومت سیم مسی در ۱۲۰ درجه',
    expression: '0.43 * (1 + 0.0039 * 100)',
    value: 0.6,
    unit: 'Ω',
    tolerance: 0.01,
    relation: {
      name: 'R = R0(1 + αΔT)',
      note: '۰٫۴۳ × ۱٫۳۹ = ۰٫۵۹۷۷ که دو رقم معنادار ۰٫۶۰ می‌شود؛ ۰٫۵۹ گرد کردن رو به پایین بود.',
      lhs: 0.43 * 1.39,
      rhs: 0.6,
      tolerance: 0.01,
    },
  },
];

/** A second defect this audit caught: truncation reported as rounding. */
export const KNOWN_DEFECTS = [
  {
    id: 'D1',
    where: 'app/content/part-1a.mjs — question p1-field-1',
    was: '3×10⁻⁶ × 2000 = 6×10⁻⁹ N',
    now: '3×10⁻⁶ × 2000 = 6×10⁻³ N',
    class: 'power-of-ten error in a worked answer, its options and its explanation',
  },
  {
    id: 'D2',
    where: 'app/content/part-4.mjs — concept resistivity, worked example',
    was: '0.43 × 1.39 ≈ 0.59 Ω',
    now: '0.43 × 1.39 = 0.5977 ≈ 0.60 Ω',
    class: 'truncation presented as rounding',
  },
];
