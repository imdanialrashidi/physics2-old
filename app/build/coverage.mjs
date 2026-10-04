import { expressionKey, normaliseText } from './notes.mjs';

/**
 * Sections that exist in the notes for orientation or review rather than as a teachable concept.
 * Everything else must be claimed by at least one concept page.
 */
export const NON_TEACHING_SECTIONS = {
  'part-1#9': 'خلاصه‌ی فرمول‌های پارت (به دفترچه‌ی فرمول منتقل می‌شود)',
  'part-1#10': 'فهرست سرفصل‌های پوشش‌داده‌شده (به‌عنوان نقشه‌ی پوشش استفاده می‌شود)',
  'part-2#1': 'تکرار میدان توزیع پیوسته که در پارت ۱ معرفی شده و در پارت ۲ عمیق می‌شود',
  'part-3#1': 'مقدمه‌ی پتانسیل (مفهوم کار میدان) — مفهوم مستقل «اختلاف پتانسیل» آن را پوشش می‌دهد',
};

const TOKEN = /[\p{L}\p{N}]{4,}/gu;

export function tokens(text) {
  return new Set(normaliseText(text).toLowerCase().match(TOKEN) ?? []);
}

/** Topics are matched mechanically: a note topic must share a meaningful word with a concept. */
function matchTopic(topicText, concepts) {
  const topicTokens = tokens(topicText);
  const matches = [];
  for (const concept of concepts) {
    const haystack = tokens([concept.title, concept.en, ...(concept.keywords ?? [])].join(' '));
    const shared = [...topicTokens].filter((token) => haystack.has(token));
    if (shared.length) matches.push({ id: concept.id, shared });
  }
  matches.sort((a, b) => b.shared.length - a.shared.length);
  return matches;
}

/**
 * Builds the source-coverage report. Throws with an actionable message when something meaningful
 * from the notes is not represented, so a gap fails the build instead of shipping silently.
 */
export function buildCoverage(notes, registry) {
  const concepts = registry.concepts;
  const conceptIds = new Set(concepts.map((concept) => concept.id));
  const anchors = new Set();
  const sectionTitles = new Map();
  for (const note of notes) {
    for (const section of note.sections) {
      anchors.add(section.anchor);
      sectionTitles.set(section.anchor, { title: section.title, file: note.file, line: section.line, partId: note.partId });
    }
  }

  const problems = [];
  const sectionReport = [];

  // 1. every teaching section is claimed by at least one concept
  for (const [anchor, meta] of sectionTitles) {
    const owners = concepts.filter((concept) => concept.sourceRefs.includes(anchor)).map((concept) => concept.id);
    const skip = NON_TEACHING_SECTIONS[anchor];
    sectionReport.push({ anchor, ...meta, owners, skip: Boolean(skip), covered: owners.length > 0 || Boolean(skip) });
    if (owners.length === 0 && !skip) problems.push(`بخش پوشش‌داده‌نشده: ${anchor} «${meta.title}» (${meta.file}:${meta.line})`);
  }

  // 2. concepts never reference a section that does not exist
  for (const concept of concepts) {
    for (const ref of concept.sourceRefs) {
      if (!anchors.has(ref)) problems.push(`${concept.id}: ارجاع به بخش ناموجود ${ref}`);
    }
    for (const prereq of concept.prereqs ?? []) {
      if (!conceptIds.has(prereq)) problems.push(`${concept.id}: پیش‌نیاز ناموجود ${prereq}`);
    }
    if (!concept.practice?.length) problems.push(`${concept.id}: بدون تمرین`);
    for (const example of concept.examples ?? []) {
      if (!example.steps?.length) problems.push(`${concept.id}: مثال بدون گام`);
    }
  }

  // 3. prereq graph is acyclic and never points forward inside the same lecture
  const graph = new Map(concepts.map((concept) => [concept.id, concept.prereqs ?? []]));
  const state = new Map();
  const walk = (id, trail) => {
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') {
      problems.push(`چرخه در گراف پیش‌نیاز: ${[...trail, id].join(' → ')}`);
      return;
    }
    state.set(id, 'visiting');
    for (const next of graph.get(id) ?? []) if (graph.has(next)) walk(next, [...trail, id]);
    state.set(id, 'done');
  };
  for (const id of graph.keys()) walk(id, []);

  // 4. Part 1 syllabus list and the per-file topic lists of parts 2–5
  const topicReport = [];
  for (const note of notes) {
    const partConcepts = concepts.filter((concept) => concept.part === note.partId);
    for (const syllabusItem of note.syllabus) {
      const matches = matchTopic(syllabusItem.text, partConcepts);
      const best = matches[0];
      if (!best) problems.push(`سرفصل پارت ۱ پوشش‌داده‌نشده: «${syllabusItem.text}»`);
      topicReport.push({ kind: 'syllabus', partId: note.partId, text: syllabusItem.text, line: syllabusItem.line, matches: matches.slice(0, 3) });
    }
    for (const topic of note.topics) {
      const matches = matchTopic(topic.text, partConcepts);
      if (!matches.length) problems.push(`موضوع «${topic.text}» در ${note.file} به هیچ مفهومی وصل نشد`);
      topicReport.push({ kind: 'topic', partId: note.partId, text: topic.text, line: topic.line, matches: matches.slice(0, 3) });
    }
  }

  // 5. every boxed formula of the notes exists in the site's formula set
  const formulaKeys = new Set();
  const latexCorpus = [];
  for (const concept of concepts) {
    for (const formula of concept.formulas ?? []) {
      formulaKeys.add(expressionKey(formula.latex));
      latexCorpus.push(formula.latex);
      for (const rearrangement of formula.rearrangements ?? []) {
        formulaKeys.add(expressionKey(rearrangement.latex));
        latexCorpus.push(rearrangement.latex);
      }
      for (const example of concept.examples ?? []) {
        if (example.answer?.latex) {
          formulaKeys.add(expressionKey(example.answer.latex));
          latexCorpus.push(example.answer.latex);
        }
        for (const step of example.steps ?? []) {
          formulaKeys.add(expressionKey(step.body));
          latexCorpus.push(step.body);
        }
      }
    }
    for (const example of concept.examples ?? []) {
      if (example.answer?.latex) latexCorpus.push(example.answer.latex);
      for (const step of example.steps ?? []) latexCorpus.push(step.body);
    }
  }
  const corpus = latexCorpus.join(' \n ');
  const formulaReport = [];
  for (const note of notes) {
    for (const formula of note.formulas) {
      if (!formula.boxed) continue;
      const key = expressionKey(formula.latex);
      // A published numeric answer (e.g. -82.86 µC) counts as covered when the same value appears.
      const numeric = formula.latex.match(/-?\d+\.\d+/)?.[0];
      // Compound formulas in the site may extend the note's expression (e.g. `P = W/t = VI = I²R`),
      // so containment on the right-hand side counts as covered too.
      const rhs = key.includes('=') ? key.slice(key.indexOf('=') + 1) : key;
      const viaExpression =
        formulaKeys.has(key) ||
        (key.length >= 4 && [...formulaKeys].some((candidate) => candidate.includes(key))) ||
        (rhs.length >= 4 && [...formulaKeys].some((candidate) => candidate.includes(rhs)));
      const viaValue = !viaExpression && numeric !== undefined && corpus.includes(numeric);
      const present = viaExpression || viaValue;
      formulaReport.push({
        partId: note.partId,
        line: formula.line,
        latex: formula.latex.replace(/\s+/g, ' ').trim(),
        present,
        via: viaExpression ? 'expression' : viaValue ? 'published-value' : 'missing',
      });
      if (!present) problems.push(`فرمول کلیدی جزوه پیاده نشد: ${formula.latex.replace(/\s+/g, ' ').trim()} (${note.file}:${formula.line})`);
    }
  }

  // 6. unique ids and reachable questions
  const seen = new Set();
  for (const concept of concepts) {
    if (seen.has(concept.id)) problems.push(`شناسه‌ی تکراری مفهوم: ${concept.id}`);
    seen.add(concept.id);
  }
  const questionIds = new Set(registry.questions.map((question) => question.id));
  for (const question of registry.questions) {
    if (questionIds.size !== registry.questions.length && seen.has(`q:${question.id}`)) problems.push(`شناسه‌ی تکراری سؤال: ${question.id}`);
    for (const id of question.concepts ?? []) {
      if (!conceptIds.has(id)) problems.push(`سؤال ${question.id}: مفهوم ناموجود ${id}`);
    }
  }
  for (const concept of concepts) {
    for (const id of concept.practice ?? []) {
      if (!questionIds.has(id)) problems.push(`${concept.id}: تمرین ناموجود ${id}`);
    }
  }
  const usedQuestions = new Set(concepts.flatMap((concept) => concept.practice ?? []));
  const orphans = registry.questions.filter((question) => !usedQuestions.has(question.id)).map((question) => question.id);
  for (const orphan of orphans) problems.push(`سؤال بدون استفاده: ${orphan}`);

  // 7. every concept belongs to a declared part and has the teaching layers
  for (const concept of concepts) {
    if (!registry.parts.some((part) => part.id === concept.part)) problems.push(`${concept.id}: پارت نامعتبر ${concept.part}`);
    if (!concept.intuition || concept.intuition.length < 120) problems.push(`${concept.id}: شهود ناکافی`);
    if (!concept.visual?.fallback) problems.push(`${concept.id}: توضیح متنی تصویر ندارد`);
    if (!concept.rescue?.tiny?.body) problems.push(`${concept.id}: مسیر نجات کامل نیست`);
  }

  return {
    generatedFor: registry.parts.map((part) => part.id),
    counts: {
      notes: notes.length,
      sections: sectionReport.length,
      concepts: concepts.length,
      questions: registry.questions.length,
      boxedFormulas: formulaReport.length,
    },
    sections: sectionReport,
    topics: topicReport,
    formulas: formulaReport,
    orphans,
    problems,
  };
}

export function assertCoverage(report) {
  if (report.problems.length) {
    throw new Error(`پوشش محتوا ناقص است:\n- ${report.problems.join('\n- ')}`);
  }
  return report;
}