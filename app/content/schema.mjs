/**
 * Content model for the Physics II learning site.
 *
 * Content lives in plain `.mjs` modules so the Node build can render HTML directly and the
 * browser can import the same registry for search/explorer pages.
 *
 * Prose convention: inline math uses `$...$`, display math uses `$$...$$` (KaTeX syntax inside).
 */

export const PARTS = [
  {
    id: 'part-1',
    number: 1,
    title: 'بار الکتریکی و میدان الکتریکی',
    en: 'Charge and Electric Field',
    note: 'Lecture notes/Physics2_Part1_Charge_and_Electric_Field_FA.md',
    tagline: 'از «یعنی چه» تا نیروی کولن و میدان الکتریکی',
  },
  {
    id: 'part-2',
    number: 2,
    title: 'میدان الکتریکی و قانون گاوس',
    en: 'Electric Field and Gauss’s Law',
    note: 'Lecture notes/Physics2_Part2_Electric_Field_Gauss.md',
    tagline: 'چگالی بار، سطح گاوسی و میدان‌های متقارنی',
  },
  {
    id: 'part-3',
    number: 3,
    title: 'پتانسیل الکتریکی و خازن‌ها',
    en: 'Electric Potential and Capacitors',
    note: 'Lecture notes/Physics2_Part3_Potential_Capacitors.md',
    tagline: 'کار میدان، انرژی پتانسیل و ذخیره‌سازی انرژی',
  },
  {
    id: 'part-4',
    number: 4,
    title: 'جریان الکتریکی و مدارها',
    en: 'Current and Circuits',
    note: 'Lecture notes/Physics2_Part4_Current_Circuits_RC.md',
    tagline: 'جریان، مقاومت، قانون اهم و مدار RC',
  },
  {
    id: 'part-5',
    number: 5,
    title: 'میدان مغناطیسی و قانون آمپر',
    en: 'Magnetism and Ampère’s Law',
    note: 'Lecture notes/Physics2_Part5_Magnetism_Ampere.md',
    tagline: 'نیروی مغناطیسی، مارپیچ، بیو-ساوار و آمپر',
  },
];

/** @typedef {{ id: string, sym: string, meaning: string, unit?: string, en?: string }} FormulaSymbol */
/** @typedef {{ id?: string, name: string, en?: string, latex: string, symbols: FormulaSymbol[], interpretation: string, whenToUse: string, whenNotToUse: string, rearrangements?: { latex: string, note: string }[], notes?: string[] }} Formula */
/** @typedef {{ label: string, body: string }} ExampleStep */
/** @typedef {{ title: string, problem: string, steps: ExampleStep[], answer: { latex?: string, body: string }, tip?: string }} WorkedExample */
/** @typedef {{ wrong: string, right: string }} Misconception */
/** @typedef {{ id: string, prompt: string, options?: { id: string, text: string }[], answer: string | number, tolerance?: number, unit?: string, explain: string, concepts?: string[] }} Question */
/** @typedef {{ prereq: string, simpler: string, visual: string, tiny: { title: string, body: string } }} Rescue */
/** @typedef {{ id: string, why: string }} Related */

/**
 * @typedef {Object} Concept
 * @property {string} id
 * @property {string} title
 * @property {string} en
 * @property {string} part
 * @property {string[]} sourceRefs note anchors covered, e.g. `['part1#3']`
 * @property {'course' | 'supplement' | 'mixed'} origin
 * @property {1 | 2 | 3} difficulty
 * @property {number} effort minutes
 * @property {string[]} prereqs concept ids
 * @property {string[]} keywords
 * @property {string} intuition Layer A
 * @property {{ sim?: string, caption: string, fallback: string, controls?: string[] }} visual Layer B
 * @property {Formula[]} formulas Layer C
 * @property {string} [mathNote]
 * @property {WorkedExample[]} examples Layer D
 * @property {Misconception[]} misconceptions
 * @property {string[]} practice question ids
 * @property {Rescue} rescue
 * @property {Related[]} related
 * @property {{ title: string, body: string }[]} [supplements] clearly-marked enrichment
 * @property {string[]} [examTips]
 */

/** Throws on missing required fields; used by the build and the integrity test. */
export function validateConcept(concept, partId) {
  const errors = [];
  const require_ = (value, message) => {
    if (value === undefined || value === null || value === '') errors.push(message);
  };
  require_(concept.id, 'concept.id');
  require_(concept.title, `${concept.id}: title`);
  require_(concept.en, `${concept.id}: en`);
  if (concept.part !== partId) errors.push(`${concept.id}: part ${concept.part} does not match ${partId}`);
  if (!Array.isArray(concept.sourceRefs) || concept.sourceRefs.length === 0) errors.push(`${concept.id}: sourceRefs`);
  if (![1, 2, 3].includes(concept.difficulty)) errors.push(`${concept.id}: difficulty 1..3`);
  if (typeof concept.effort !== 'number' || concept.effort <= 0) errors.push(`${concept.id}: effort`);
  for (const field of ['intuition', 'prereqs', 'keywords', 'formulas', 'examples', 'misconceptions', 'practice', 'related']) {
    if (!Array.isArray(concept[field]) && typeof concept[field] !== 'string') errors.push(`${concept.id}: ${field}`);
  }
  if (!Array.isArray(concept.prereqs)) errors.push(`${concept.id}: prereqs (array; may be empty for root concepts)`);
  if (!Array.isArray(concept.formulas) || (concept.formulas.length === 0 && !concept.mathNote)) {
    errors.push(`${concept.id}: formulas (or a mathNote explaining why the concept has none)`);
  }
  if (!Array.isArray(concept.examples) || concept.examples.length === 0) errors.push(`${concept.id}: examples`);
  if (!Array.isArray(concept.practice) || concept.practice.length === 0) errors.push(`${concept.id}: practice`);
  if (!concept.visual?.caption || !concept.visual?.fallback) errors.push(`${concept.id}: visual.caption/fallback`);
  if (!concept.rescue?.prereq || !concept.rescue?.simpler || !concept.rescue?.tiny?.body) errors.push(`${concept.id}: rescue`);
  for (const [index, example] of (concept.examples ?? []).entries()) {
    if (!example.title || !example.problem || !Array.isArray(example.steps) || example.steps.length === 0 || !example.answer?.body) {
      errors.push(`${concept.id}: example ${index} incomplete`);
    }
  }
  for (const [index, formula] of (concept.formulas ?? []).entries()) {
    if (!formula.latex || !formula.name || !formula.interpretation || !formula.whenToUse || !formula.whenNotToUse) {
      errors.push(`${concept.id}: formula ${index} incomplete`);
    }
    if (!Array.isArray(formula.symbols) || formula.symbols.length === 0) errors.push(`${concept.id}: formula ${index} symbols`);
  }
  if (errors.length) throw new Error(`Invalid concept data:\n- ${errors.join('\n- ')}`);
  return concept;
}

export function validateQuestion(question) {
  const errors = [];
  if (!question.id) errors.push('question.id');
  if (!['mcq', 'numeric'].includes(question.type)) errors.push(`${question.id}: type`);
  if (!question.prompt) errors.push(`${question.id}: prompt`);
  if (!question.explain) errors.push(`${question.id}: explain`);
  if (question.type === 'mcq') {
    if (!Array.isArray(question.options) || question.options.length < 2) errors.push(`${question.id}: options`);
    if (!question.options?.some((option) => option.id === question.answer)) errors.push(`${question.id}: answer not among options`);
  }
  if (question.type === 'numeric' && typeof question.answer !== 'number') errors.push(`${question.id}: numeric answer`);
  if (errors.length) throw new Error(`Invalid question data:\n- ${errors.join('\n- ')}`);
  return question;
}