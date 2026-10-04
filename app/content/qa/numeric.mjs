/**
 * Deterministic numeric reading of the site's educational content.
 *
 * Purpose: verify educationally consequential numbers (worked examples, quiz explanations,
 * answer values, formula-derived results) against re-derived values, instead of trusting the
 * strings that happen to be in the content files.
 *
 * Design constraints (see docs/exec-plans/active/physics2-upgrade-p0-p3-p4-mobile.md §5):
 *
 * - **Semantic, not formatting.** `6×10⁻³ N`, `0.006 N` and `6 mN` are the same claim and all
 *   compare equal; `6×10⁻⁹ N` does not. Nothing here does literal string equality on a number.
 * - **Conservative.** Anything the grammar does not fully understand is reported as unparsed and
 *   surfaced as `UNPROVEN`. It is never silently treated as a pass. There is no attempt at
 *   symbolic physics: a segment with free symbols is classified `symbolic`, not verified.
 * - **Provenance.** Every extracted claim carries the content id and field path it came from, so a
 *   finding always points at something a maintainer can open and repair.
 *
 * Pure and dependency-free: node-importable by both the test lane and the audit report.
 */

/** Segments are split into statements on these. `≈` is an approximate equality. */
const RELATIONS = { '=': 'equals', '≈': 'approximates', '~': 'approximates' };

/** Known physical constants that may appear bare in a numeric expression. */
const CONSTANTS = new Map([
  ['pi', Math.PI],
  ['π', Math.PI],
  ['\\varepsilon_0', 8.85e-12],
  ['\\epsilon_0', 8.85e-12],
  ['\\varepsilon_{0}', 8.85e-12],
  ['\\epsilon_{0}', 8.85e-12],
  ['eps0', 8.85e-12],
  ['ε0', 8.85e-12],
  ['\\mu_0', 4 * Math.PI * 1e-7],
  ['\\mu_{0}', 4 * Math.PI * 1e-7],
  ['μ0', 4 * Math.PI * 1e-7],
  ['k', 8.99e9],
]);

/** Trigonometry the notes use with degrees (`30^\circ`). */
const TRIG = new Map([
  ['cos', (x) => Math.cos((x * Math.PI) / 180)],
  ['sin', (x) => Math.sin((x * Math.PI) / 180)],
  ['tan', (x) => Math.tan((x * Math.PI) / 180)],
  ['cot', (x) => 1 / Math.tan((x * Math.PI) / 180)],
  ['sec', (x) => 1 / Math.cos((x * Math.PI) / 180)],
  ['csc', (x) => 1 / Math.sin((x * Math.PI) / 180)],
]);

/**
 * Unit prefixes. Persian notes mix these freely (`\mu C`, `mC`, `\times10^{-6}\,\text{C}`), so
 * prefix handling is what makes `6\,\text{mN}` and `0.006\,N` compare equal.
 */
const PREFIXES = new Map([
  ['y', 1e-24], ['z', 1e-21], ['a', 1e-18], ['f', 1e-15], ['p', 1e-12], ['\\mu', 1e-6],
  ['\\micro', 1e-6], ['\\u03bc', 1e-6], ['n', 1e-9], ['u', 1e-6], ['\\mue', 1e-6],
  ['m', 1e-3], ['c', 1e-2], ['d', 1e-1], ['k', 1e3], ['M', 1e6], ['G', 1e9], ['T', 1e12],
]);

/** Base units recognised as a trailing unit group. `m2` / `m^2` / `m^2` all normalise to `m^2`. */
const BASE_UNITS = new Set([
  'N', 'C', 'F', 'J', 'W', 'V', 'A', 'T', 'H', 'S', 'Wb', 'm', 's', 'g', 'kg', 'mol', 'K',
  'Hz', 'Pa', 'lm', 'lx', 'Ω', '\\Omega', 'ohm', 'Ohm', 'B', 'eV', 'L', 'l',
]);

/**
 * Unit expressions that are already a ratio/compound and must not be prefix-split.
 * Longest first: `N\,m^2/C^2` before `N`.
 */
const COMPOUND_UNITS = [
  { raw: 'N\\,m^2/C^2', canon: 'N*m^2/C^2', dim: '(N*m^2)/(C^2)', factor: 1 },
  { raw: 'N\\,m^2/C^2', canon: 'N*m^2/C^2', dim: '(N*m^2)/(C^2)', factor: 1 },
  { raw: 'N/C', canon: 'N/C', dim: 'N/C', factor: 1 },
  { raw: 'm/s^2', canon: 'm/s^2', dim: 'm/s^2', factor: 1 },
  { raw: 'm/s', canon: 'm/s', dim: 'm/s', factor: 1 },
  { raw: 'm^2', canon: 'm^2', dim: 'm^2', factor: 1 },
  { raw: 'C/m^2', canon: 'C/m^2', dim: 'C/m^2', factor: 1 },
  { raw: 'C/m', canon: 'C/m', dim: 'C/m', factor: 1 },
  { raw: 'J/C', canon: 'J/C', dim: 'J/C', factor: 1 },
  { raw: 'N/C', canon: 'N/C', dim: 'N/C', factor: 1 },
  { raw: 'N*s', canon: 'N*s', dim: 'N*s', factor: 1 },
];

/** Split text on `$...$` (inline) and `$$...$$` (display), keeping the raw math source. */
export function splitMathSegments(text) {
  if (typeof text !== 'string') return [];
  const out = [];
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const source = (match[1] ?? match[2] ?? '').trim();
    if (source) out.push(source);
  }
  return out;
}

/** Walk a brace group starting at `open` (index of `{`), returning [inner, indexAfterClose]. */
function readGroup(src, open) {
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === '{') depth += 1;
    else if (src[i] === '}') {
      depth -= 1;
      if (depth === 0) return [src.slice(open + 1, i), i + 1];
    }
  }
  return [src.slice(open + 1), src.length];
}

/** Read a single-character or braced argument of a LaTeX command, e.g. `\sqrt{x}` or `\frac ab`. */
function readArgument(src, start) {
  let i = start;
  while (i < src.length && /\s/.test(src[i])) i += 1;
  if (src[i] === '{') {
    const [inner, next] = readGroup(src, i);
    return [inner, next];
  }
  return [src[i] ?? '', i + 1];
}

/**
 * Normalise whitespace and unify LaTeX spellings that carry no arithmetic meaning.
 *
 * Explicit unit separators (`\,` `\ ` `\;` `\quad`) become US (unit separator, ) rather than a
 * plain space. That distinction matters: a unit must be *explicitly separated* to be read as one, so
 * `2.4\times10^{-19}` keeps its digits and `6\,N` loses its `N`, while `qE` never loses its `E`.
 */
const UNIT_SEP = '';

function normalise(src) {
  return src
    .replace(/\\left|\\right/g, '')
    .replace(/\\!|\\,|\\;|\\:|\\quad|\\qquad|\\ /g, UNIT_SEP)
    .replace(/\\dfrac|\\tfrac/g, '\\frac')
    .replace(/\\mathrm|\\text|\\textbf|\\mathit|\\operatorname/g, '');
}

/**
 * Rewrite structural LaTeX into plain arithmetic:
 * `\frac{a}{b}` → `((a)/(b))`, `\sqrt{a}` → `sqrt(a)`, `\times` → `*`, `^{2}` → `^2`.
 * `_` subscripts are dropped from identifiers so that `q_0` becomes the free symbol `q`.
 */
export function deLatex(src) {
  let s = ` ${src} `;
  let guard = 0;
  while (guard < 24) {
    const before = s;
    s = s.replace(/\\frac\s*([^{}\s])\s*([^{}\s])/g, '(($1)/($2))');
    const frac = s.match(/\\frac/);
    if (frac) {
      const at = frac.index;
      const [num, afterNum] = readArgument(s, at + '\\frac'.length);
      const [den, afterDen] = readArgument(s, afterNum);
      s = `${s.slice(0, at)}((${num})/(${den}))${s.slice(afterDen)}`;
    }
    const sqrtAt = s.indexOf('\\sqrt');
    if (sqrtAt >= 0) {
      const [arg, after] = readArgument(s, sqrtAt + '\\sqrt'.length);
      s = `${s.slice(0, sqrtAt)}sqrt(${arg})${s.slice(after)}`;
    }
    if (s === before) break;
    guard += 1;
  }
  return s
    .replace(/\\times/g, '*')
    .replace(/\\cdot/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\pi/g, 'π')
    .replace(/\\varepsilon_\{?0\}?/g, 'ε0')
    .replace(/\\epsilon_\{?0\}?/g, 'ε0')
    .replace(/\\mu_\{?0\}?/g, 'μ0')
    .replace(/\\(?:approx|simeq|sim)/g, '≈')
    .replace(/\\propto/g, '∝')
    // `60^\circ` is a degree marker, not an exponent: consume the `^` with it, otherwise removing
    // `\circ` alone would leave `60^- 3.6`.
    .replace(/\^\s*\{?\s*\\circ\s*\}?/g, '')
    .replace(/\\circ/g, '')
    .replace(/\\cos/g, 'cos')
    .replace(/\\sin/g, 'sin')
    .replace(/\\tan/g, 'tan')
    .replace(/\\cot/g, 'cot')
    .replace(/\\sec/g, 'sec')
    .replace(/\\csc/g, 'csc')
    .replace(/\^\s*\{([^{}]*)\}/g, '^($1)')
    .replace(/\^\s*(\d)/g, '^$1')
    .replace(/_[A-Za-z0-9{}\\()]+/g, '');
}

/**
 * Bind `X×10^e` into one operand.
 *
 * Physics typography writes a quotient of scientific quantities as `a×10^b/c×10^d`, meaning
 * `(a×10^b)/(c×10^d)` — not `((a×10^b)/c)×10^d`. Evaluating that with ordinary operator
 * precedence is wrong and produced false contradictions, so each scientific literal is wrapped in
 * parentheses before evaluation. Numbers outside the scientific notation are untouched.
 */
function bindScientificLiterals(s) {
  let out = '';
  let i = 0;
  // `10^{-6}` and bare `10^-6` both appear in the notes.
  const sci = /^\s*\*\s*10\s*\^\s*(\(-?\d+\)|-?\d+)/;
  while (i < s.length) {
    const num = s.slice(i).match(/^\s*(\d+(?:\.\d+)?)/);
    if (num) {
      const mantissa = num[1];
      const rest = s.slice(i + num[0].length);
      const literal = rest.match(sci);
      if (literal) {
        const exponent = literal[1].replace(/[()]/g, '');
        out += `(${mantissa}*10**(${exponent}))`;
        i += num[0].length + literal[0].length;
        continue;
      }
      out += mantissa;
      i += num[0].length;
      continue;
    }
    out += s[i];
    i += 1;
  }
  return out;
}

/** Parse a unit group (the tail of a math segment) into { canon, factor }. */
export function parseUnit(raw) {
  let s = normalise(String(raw ?? '')).trim();
  if (!s) return { canon: '', factor: 1 };
  s = s.replace(/\s+/g, '');
  if (!s) return { canon: '', factor: 1 };

  for (const entry of COMPOUND_UNITS) {
    if (s === entry.raw) return { canon: entry.canon, factor: entry.factor };
  }

  // Single token, possibly prefixed: `\mu C`, `mC`, `k\Omega`, `F`.
  const single = s.match(/^([a-zA-Z\\]+)([A-Za-zΩ]+)$/);
  if (single) {
    const [, prefix, base] = single;
    if (PREFIXES.has(prefix) && BASE_UNITS.has(base)) {
      return { canon: base, factor: PREFIXES.get(prefix) };
    }
    if (BASE_UNITS.has(base)) return { canon: base, factor: 1 };
  }
  if (BASE_UNITS.has(s)) return { canon: s, factor: 1 };

  // Prefixed compound: `mm/s`, `kN`, `\mu F`. Resolving these is what lets `0.18\,mm/s` be
  // compared with `1.8\times10^{-4}\,m/s` instead of being reported as a contradiction.
  for (const [prefix, factor] of PREFIXES) {
    if (!s.startsWith(prefix) || prefix.length >= s.length) continue;
    const rest = s.slice(prefix.length);
    if (BASE_UNITS.has(rest)) return { canon: rest, factor };
    const compound = COMPOUND_UNITS.find((entry) => entry.raw === rest);
    if (compound) return { canon: compound.canon, factor: factor * compound.factor };
  }

  // `s^-1`, `m^2` style base+exponent.
  const powered = s.match(/^([A-Za-zΩ\\]+)\^(\(?[-+0-9]+\)?)$/);
  if (powered && BASE_UNITS.has(powered[1])) {
    return { canon: `${powered[1]}^${powered[2].replace(/[()]/g, '')}`, factor: 1 };
  }
  return { canon: s, factor: 1, unknown: true };
}

/**
 * Turn one math segment into a chain of statements: `a = b ≈ c` → [{src:'a'},{src:'b'}...].
 * Only top-level separators count, so `(a=b)` never splits.
 */
export function splitStatements(deLaTeXed) {
  const parts = [];
  let depth = 0;
  let current = '';
  let relation = 'equals';
  for (const ch of deLaTeXed) {
    if (ch === '(' || ch === '[') depth += 1;
    if (ch === ')' || ch === ']') depth -= 1;
    if (depth === 0 && RELATIONS[ch]) {
      parts.push({ src: current.trim(), relation });
      current = '';
      relation = RELATIONS[ch];
      continue;
    }
    current += ch;
  }
  parts.push({ src: current.trim(), relation });
  return parts;
}

/** A free symbol: an identifier that is not a unit, constant or number. */
function collectSymbols(deLaTeXed) {
  const symbols = new Set();
  const stripped = deLaTeXed
    .replace(/cos|sin|tan|cot|sec|csc|sqrt/g, ' ')
    .replace(new RegExp(`[${UNIT_SEP}]`, 'g'), ' ')
    .replace(/π|ε0|μ0/g, ' ')
    .replace(/[0-9.]+/g, ' ')
    .replace(/[()+\-*/^=≈∝,]/g, ' ');
  for (const token of stripped.split(/\s+/)) {
    if (!token) continue;
    if (CONSTANTS.has(token)) continue;
    if (BASE_UNITS.has(token)) continue;
    if (/^[A-ZΩ]/.test(token) && token.length <= 3) continue; // single unit-ish capital
    symbols.add(token);
  }
  return [...symbols];
}

/**
 * Insert the multiplication signs that the notes leave implicit.
 *
 * `(8.99×10⁹)(2×10⁻⁶)(3×10⁻⁶)` and `2(x+1)` are ordinary physics notation but are a syntax error in
 * JavaScript, so they evaluated to nothing. Only `)` is followed — `sqrt(...)` is a call, not a
 * product, and must not be touched.
 */
function insertImplicitMultiplication(s) {
  let out = '';
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    out += ch;
    if (ch !== ')') continue;
    let j = i + 1;
    while (j < s.length && /[\s]/.test(s[j])) j += 1;
    if (j >= s.length) continue;
    const next = s[j];
    if (next === '(' || /[0-9.]/.test(next)) out += '*';
  }
  return out
    .replace(/(\d)\s*\(/g, '$1*(')
    // `1.8cos60` — a coefficient applied directly to a trig function.
    .replace(/(?<=[0-9)])(cos|sin|tan|cot|sec|csc)(?![A-Za-z])/g, '*$1')
    // `cos60` — make the implicit argument an explicit call so it parses as one.
    .replace(/(?<![A-Za-z])(cos|sin|tan|cot|sec|csc)\s*(\d+(?:\.\d+)?)/g, '$1($2)');
}

/**
 * Expand `1.602e-19` into `(1.602*10**(-19))`.
 *
 * Only applied once the fragment is known to be free of symbols, so a remaining `e` cannot be a
 * variable name.
 */
function expandExponentNotation(s) {
  return s.replace(/(\d(?:\.\d+)?|\))e([+-]?\d+)/g, '($1*10**($2))');
}

/**
 * Evaluate one arithmetic fragment. Returns
 * `{ ok: true, value, coefficient, unit, symbols }` or `{ ok: false, reason, symbols }`.
 * `ok:false` means "not understood" — never "wrong".
 */
export function evaluateFragment(fragment) {
  const cleaned = normalise(String(fragment ?? '')).trim();
  if (!cleaned) return { ok: false, reason: 'empty', symbols: [] };

  // Structural LaTeX must be resolved *before* symbol detection, otherwise `\frac{...}`, `\times`
  // and braces are mistaken for free symbols and almost everything reads as unparsed.
  const de = deLatex(cleaned).trim();

  // Trailing unit, only when explicitly separated: `6\,N`, `0.3\,\text{m}`, `5 \mu C`, `0.8\,A\cdot m^2`.
  // An unrecognised unit is still split off (and reported as unknown) so that `N\cdot m^2` does not
  // turn an otherwise checkable calculation into `unparsable`.
  let unit = { canon: '', factor: 1 };
  let body = de;
  const unitAt = de.match(
    /^([-+0-9πεμ()./*^ \t]*(?:sqrt\([^()]*\))?)\u001f\s*\{?([A-Za-zΩ\\][A-Za-z0-9Ω\\^()./*·-]*)\}?$/,
  );
  if (unitAt) {
    const candidate = parseUnit(unitAt[2].replace(/·/g, '*'));
    unit = { canon: candidate.canon, factor: candidate.factor, unknown: Boolean(candidate.unknown) };
    body = unitAt[1].trim();
  }

  // Expand `1.602e-19` before the symbol check: otherwise the exponent letter reads as the free
  // symbol `e` and the fragment is rejected as symbolic instead of being evaluated.
  body = expandExponentNotation(body);

  const symbols = collectSymbols(body);
  if (symbols.length) return { ok: false, reason: 'free-symbol', symbols };
  if (!/\d/.test(body)) return { ok: false, reason: 'no-number', symbols };

  let bound = insertImplicitMultiplication(bindScientificLiterals(body));

  // Validate the grammar-restricted form *before* constants are substituted: substituting produces
  // scientific notation whose exponent `e` would otherwise look like a stray identifier.
  if (/[A-Za-z\\]/.test(bound.replace(/sqrt|cos|sin|tan|cot|sec|csc/g, ''))) {
    return { ok: false, reason: 'unparsable', symbols };
  }

  // Substitute known constants, then evaluate. TRIG must be injected as source: `JSON.stringify`
  // drops function values.
  for (const [name, value] of CONSTANTS) {
    if (!/[A-Za-z\\πεμ]/.test(name)) continue;
    bound = bound.split(name).join(`(${value})`);
  }
  bound = bound.replace(/π/g, '(Math.PI)');

  const js = bound
    .replace(/\^/g, '**')
    .replace(/sqrt/g, 'Math.sqrt');

  let value;
  try {
    // TRIG must be injected as source: `JSON.stringify` drops function values.
    // eslint-disable-next-line no-new-func
    value = Function(
      `"use strict";
       const cos=(x)=>Math.cos(x*Math.PI/180), sin=(x)=>Math.sin(x*Math.PI/180);
       const tan=(x)=>Math.tan(x*Math.PI/180), cot=(x)=>1/Math.tan(x*Math.PI/180);
       const sec=(x)=>1/Math.cos(x*Math.PI/180), csc=(x)=>1/Math.sin(x*Math.PI/180);
       return (${js.replace(/TRIG\./g, '')});`,
    )();
  } catch {
    return { ok: false, reason: 'eval-failed', symbols };
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return { ok: false, reason: 'not-finite', symbols };
  }
  return {
    ok: true,
    value: value * unit.factor,
    // The number as written, before any SI prefix is applied. A worked chain computes on these
    // coefficients: `a/\sqrt2 = 6/1.414 \approx 4.24\,cm` compares 4.243 with 4.24, not with
    // 0.0424 m. Comparing coefficients when the stated units differ avoids a false contradiction;
    // a genuine slip such as `3\times10^{-6}\times2000 = 6\times10^{-9}` still disagrees.
    coefficient: value,
    unit: unit.canon,
    symbols,
  };
}

/** Relative closeness with an absolute floor, so 0 and tiny values behave. */
export function closeEnough(a, b, relativeTolerance = 1e-6, absolute = 1e-15) {
  const diff = Math.abs(a - b);
  if (diff <= absolute) return true;
  const scale = Math.max(Math.abs(a), Math.abs(b));
  return diff / scale <= relativeTolerance;
}

/**
 * Significant digits of the number a fragment *states*.
 *
 * `1.6` is 2, `2.0\times10^{5}` is 2, `0.599` is 3. Used to compare a re-derived value against a
 * rounded claim at the precision the claim actually carries.
 */
export function statedPrecision(fragment) {
  const literal = deLatex(normalise(String(fragment ?? ''))).match(/(\d+\.?\d*)/);
  if (!literal) return 0;
  const digits = literal[1].replace(/\./g, '').replace(/^0+/, '');
  return digits.length || 1;
}

/**
 * Does a re-derived value agree with a stated one at the precision the statement writes?
 *
 * Notes legitimately round: `1.8\times\frac{\sqrt3}{2} \approx 1.6\,N` is correct, because 1.5588
 * rounds to 1.6 at the two significant figures shown. A flat percentage tolerance flagged that as an
 * error; a genuine exponent slip such as `6\times10^{-9}` still fails, because rounding 0.006 to any
 * precision never yields 6e-9.
 */
export function agreesAtStatedPrecision(derived, stated, precision) {
  if (closeEnough(derived, stated, 1e-9)) return true;
  if (!precision || precision < 1) return false;
  const magnitude = Math.abs(stated);
  if (magnitude === 0) return false;
  const scale = 10 ** (precision - 1 - Math.floor(Math.log10(magnitude)));
  return closeEnough(Math.round(derived * scale) / scale, stated, 1e-9);
}

/**
 * Audit one math segment. Returns
 * `{ verdict: 'verified'|'contradiction'|'symbolic'|'unparsed', ... }`.
 *
 * `verified`     — every adjacent numeric statement pair in an equality chain agrees.
 * `contradiction`— two numeric statements on an `=`/≈` chain disagree (a real defect).
 * `symbolic`     — a physics relation with free symbols: real content, not numerically checkable
 *                   by this grammar. Reported, never counted as verified.
 * `unparsed`     — the grammar itself did not understand the segment: honestly `UNPROVEN`.
 */
export function auditSegment(source) {
  const de = deLatex(normalise(String(source ?? ''))).trim();
  if (de.includes('∝')) {
    return { verdict: 'symbolic', reason: 'proportionality', source, value: null };
  }
  const statements = splitStatements(de);
  if (statements.length < 2) {
    const single = evaluateFragment(statements[0]?.src ?? '');
    if (single.ok) return { verdict: 'verified', source, value: single.value, unit: single.unit, single: true };
    // A bare identifier (`A`, `F_{12}`, `Q`) or a symbol-only relation is real content, not a
    // gap in this grammar.
    if (single.reason === 'free-symbol' || single.reason === 'no-number') {
      return { verdict: 'symbolic', reason: single.reason, source, value: null };
    }
    return { verdict: 'unparsed', reason: single.reason, source, value: null };
  }

  const evaluated = statements.map((statement) => ({
    ...statement,
    result: evaluateFragment(statement.src),
  }));

  const numeric = evaluated.filter((statement) => statement.result.ok);
  if (numeric.length < 2) {
    const reasons = evaluated.map((s) => s.result.reason);
    if (reasons.every((reason) => reason === 'free-symbol' || reason === 'no-number')) {
      return { verdict: 'symbolic', reason: 'free-symbol', source, value: null, statements: evaluated };
    }
    return {
      verdict: 'unparsed',
      reason: [...new Set(reasons)].join(',') || 'insufficient-numeric',
      source,
      value: null,
      statements: evaluated,
    };
  }

  for (let i = 1; i < numeric.length; i += 1) {
    const previous = numeric[i - 1].result;
    const current = numeric[i].result;
    const sameUnit = previous.unit === current.unit;
    const lhs = sameUnit ? previous.value : previous.coefficient;
    const rhs = sameUnit ? current.value : current.coefficient;
    if (!agreesAtStatedPrecision(lhs, rhs, statedPrecision(numeric[i].src))) {
      return {
        verdict: 'contradiction',
        reason: 'chain-mismatch',
        source,
        value: rhs,
        lhs,
        rhs,
        lhsUnit: previous.unit,
        rhsUnit: current.unit,
        comparedOn: sameUnit ? 'si' : 'coefficient',
        statement: numeric[i].src,
        previous: numeric[i - 1].src,
      };
    }
  }
  return {
    verdict: 'verified',
    source,
    value: numeric[numeric.length - 1].result.value,
    unit: numeric[numeric.length - 1].result.unit,
    statements: evaluated,
  };
}

/**
 * Every standalone numeric value with an SI-resolvable unit that appears inside `$...$` in a
 * piece of prose, with provenance.
 *
 * This is the learner-facing claim surface: an answer option reading `$6\times10^{-3}\,N$` yields
 * `{ value: 0.006, unit: 'N' }`, and one reading `$6\times10^{-9}\,N$` yields `6e-9`. Comparing
 * those numbers — not the strings — is what makes the oracle formatting-tolerant.
 */
export function numericClaimsIn(text, provenance = {}) {
  const claims = [];
  for (const source of splitMathSegments(text)) {
    const de = deLatex(normalise(source)).trim();
    if (!/\d/.test(de)) continue;
    // A chain (`a = b`) carries its own audit; here we only want single stated values.
    for (const statement of splitStatements(de)) {
      if (statement.relation !== 'equals' && statement.relation !== 'approximates') continue;
      const result = evaluateFragment(statement.src);
      if (!result.ok) continue;
      claims.push({ ...provenance, source, fragment: statement.src, value: result.value, unit: result.unit });
    }
  }
  return claims;
}

/**
 * Walk any content node and collect every audited math segment with its provenance.
 * `visit` is called for each leaf string so callers can label the field path.
 */
export function auditContent(root, visit, out = []) {
  if (typeof root === 'string') {
    for (const source of splitMathSegments(root)) {
      out.push({ ...auditSegment(source), ...visit(source) });
    }
    return out;
  }
  if (Array.isArray(root)) {
    root.forEach((item, index) => auditContent(item, (source) => visit(source, index), out));
    return out;
  }
  if (root && typeof root === 'object') {
    for (const [key, value] of Object.entries(root)) {
      auditContent(value, (source, index) => visit(source, index, key), out);
    }
  }
  return out;
}
