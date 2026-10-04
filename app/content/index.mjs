import { PARTS } from './schema.mjs';
import { concepts as part1a, questions as questions1a } from './part-1a.mjs';
import { concepts as part1b } from './part-1b.mjs';
import { concepts as part1c } from './part-1c.mjs';
import { concepts as part2, questions as questions2 } from './part-2.mjs';
import { concepts as part3, questions as questions3 } from './part-3.mjs';
import { concepts as part4, questions as questions4 } from './part-4.mjs';
import { concepts as part5, questions as questions5 } from './part-5.mjs';
import { GLOSSARY } from './glossary.mjs';

/**
 * The course registry: every page, the search index and the coverage check are derived from this
 * single object, so a concept can never exist in navigation without existing as a page.
 */
export function buildRegistry() {
  const concepts = [...part1a, ...part1b, ...part1c, ...part2, ...part3, ...part4, ...part5];
  const questions = [...questions1a, ...questions2, ...questions3, ...questions4, ...questions5];
  const order = new Map();
  for (const concept of concepts) {
    const key = concept.part;
    order.set(key, (order.get(key) ?? 0) + 1);
    concept.order = order.get(key);
  }
  const conceptById = new Map(concepts.map((concept) => [concept.id, concept]));
  const questionById = new Map(questions.map((question) => [question.id, question]));

  /** All formulas of the course, de-duplicated, with the concepts that own them. */
  const formulas = [];
  for (const concept of concepts) {
    for (const formula of concept.formulas ?? []) {
      formulas.push({ ...formula, id: formula.id ?? `${concept.id}:${formula.name}`, conceptId: concept.id, part: concept.part });
    }
  }

  return { parts: PARTS, concepts, questions, formulas, glossary: GLOSSARY, conceptById, questionById };
}

export const registry = buildRegistry();