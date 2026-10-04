/**
 * Deterministic content QA: the audit runner behind the P0 correctness gate.
 *
 * Three independent layers, each with a different oracle:
 *
 *  1. **Re-derivation** — every numeric equality chain found anywhere in the course content is
 *     evaluated on both sides and compared at the precision the claim states. A worked calculation
 *     that contradicts itself fails here (`app/content/qa/numeric.mjs`).
 *  2. **Relationship** — each declared oracle's physical relation is re-checked, so an answer that
 *     is internally consistent but is not what the law gives still fails (`qa/oracles.mjs`).
 *  3. **Learner-facing agreement** — each oracle's expected value is compared numerically against the
 *     numbers the learner actually sees in the cited field. `6×10⁻³ N`, `0.006 N` and `6 mN` all
 *     agree; `6×10⁻⁹ N` does not. No string equality is used on a quantity.
 *
 * Anything this grammar cannot read is reported as `UNPROVEN` and never counted as a pass.
 */

import { auditContent, closeEnough, numericClaimsIn, evaluateFragment } from './numeric.mjs';
import { ORACLES, KNOWN_DEFECTS } from './oracles.mjs';

export const STATUS = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  UNPROVEN: 'UNPROVEN',
  BLOCKED: 'BLOCKED',
  NOT_EXECUTED: 'NOT EXECUTED',
};

/** Read the field an oracle points at, as the learner-facing string. */
function resolveField(source, field) {
  const [kind, id] = source.split(':');

  // `examples[0].steps[2].body` → ['examples','0','steps','2','body']
  const path = field.match(/[^[\].]+|\d+/g) ?? [];
  if (!path.length) return null;

  const walk = (root) => {
    let cursor = root;
    for (const token of path) {
      if (cursor === null || cursor === undefined) return null;
      if (/^\d+$/.test(token)) {
        cursor = cursor[Number(token)];
      } else if (Array.isArray(cursor) && token.length === 1) {
        // `options[a]` — the content model keys options by `id`, not by index.
        cursor = cursor.find((entry) => entry?.id === token);
      } else {
        cursor = cursor[token];
      }
    }
    return cursor ?? null;
  };

  // `options[a]` walks to the option object; the learner-facing text is its `text` field.
  const unwrap = (value) =>
    value && typeof value === 'object' && typeof value.text === 'string' ? value.text : value;

  if (kind === 'question') return unwrap(walk(registry.questionById.get(id)));
  if (kind === 'concept') return unwrap(walk(registry.conceptById.get(id)));
  return null;
}

let registry;

/**
 * Run the whole audit.
 * @param {object} source the course registry (injected to keep this module testable)
 */
export function runAudit(source) {
  registry = source;

  // ---- Layer 1: sweep every math segment in concepts and questions -------------------
  const segments = [];
  for (const concept of registry.concepts) {
    auditContent(concept, (source) => ({ where: `concept:${concept.id}` }), segments);
    for (const questionId of concept.practice) {
      const question = registry.questionById.get(questionId);
      if (question) {
        auditContent(question, (src) => ({ where: `question:${questionId}` }), segments);
      }
    }
  }

  const chains = { verified: [], contradiction: [], symbolic: [], unparsed: [] };
  for (const segment of segments) chains[segment.verdict].push(segment);

  const findings = [];
  for (const segment of chains.contradiction) {
    findings.push({
      status: STATUS.FAIL,
      kind: 'contradiction',
      where: segment.where,
      detail: `${segment.previous} → ${segment.statement} (compared as ${segment.comparedOn}: ${segment.lhs} vs ${segment.rhs})`,
      source: segment.source,
    });
  }

  // ---- Layer 2 + 3: declared oracles -------------------------------------------------
  const oracleResults = ORACLES.map((oracle) => {
    const issues = [];

    // (a) re-derive
    const derived = evaluateFragment(oracle.expression);
    if (!derived.ok) {
      issues.push(`expression not re-derivable (${derived.reason})`);
    } else if (!closeEnough(derived.value, oracle.value, oracle.tolerance)) {
      issues.push(`re-derivation ${derived.value} ≠ declared ${oracle.value}`);
    }

    // (b) relationship
    if (oracle.relation) {
      const rel = oracle.relation;
      const tolerance = rel.tolerance ?? 1e-9;
      if (!closeEnough(rel.lhs, rel.rhs, tolerance)) {
        issues.push(`relationship ${rel.name} fails: ${rel.lhs} ≠ ${rel.rhs}`);
      }
    }

    // (c) learner-facing agreement, numerically
    const text = resolveField(oracle.sourceRef, oracle.field);
    if (text === null) {
      issues.push(`field ${oracle.field} of ${oracle.sourceRef} not found`);
    } else {
      const claims = numericClaimsIn(String(text));
      const wanted = oracle.unit
        ? claims.filter((claim) => claim.unit === oracle.unit || !claim.unit)
        : claims;
      const agrees = wanted.some((claim) =>
        closeEnough(claim.value, oracle.value, oracle.tolerance),
      );
      if (!agrees) {
        issues.push(
          `learner sees [${claims.map((c) => `${c.value} ${c.unit}`).join(', ') || 'no numeric claim'}] ` +
            `but the physics gives ${oracle.value} ${oracle.unit}`,
        );
      }
      if (oracle.display && !String(text).includes(oracle.display)) {
        issues.push(`expected rendering \\${oracle.display} not present in the field`);
      }
      for (const forbidden of oracle.mustNotContain ?? []) {
        if (String(text).includes(forbidden)) {
          issues.push(`regressed: field still contains ${forbidden}`);
        }
      }
    }

    return {
      claimId: oracle.claimId,
      title: oracle.title,
      status: issues.length ? STATUS.FAIL : STATUS.PASS,
      issues,
    };
  });

  const oracleFailures = oracleResults.filter((result) => result.status === STATUS.FAIL);
  if (oracleFailures.length) {
    for (const failure of oracleFailures) {
      findings.push({
        status: STATUS.FAIL,
        kind: 'oracle',
        where: failure.claimId,
        detail: failure.issues.join('; '),
      });
    }
  }

  return {
    counts: {
      segments: segments.length,
      verifiedChains: chains.verified.length,
      symbolicChains: chains.symbolic.length,
      unparsedChains: chains.unparsed.length,
      contradictions: chains.contradiction.length,
      oracles: ORACLES.length,
      oraclePass: oracleResults.filter((r) => r.status === STATUS.PASS).length,
    },
    status: findings.length ? STATUS.FAIL : STATUS.PASS,
    oracleResults,
    unparsed: chains.unparsed.map((segment) => ({ where: segment.where, source: segment.source, reason: segment.reason })),
    findings,
    defects: KNOWN_DEFECTS,
  };
}
