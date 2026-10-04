/**
 * Deterministic P0 content report.
 *
 * `npm run audit:numbers` prints the state of the course's numerical content. It is read-only and
 * exits non-zero when a learner-facing number contradicts itself or a declared oracle fails.
 *
 * Counts are printed so a claim of "content correct" can always be checked against a number, and so
 * `UNPROVEN` work stays visible instead of being quietly counted as a pass.
 */

import { registry } from '../content/index.mjs';
import { runAudit, STATUS } from '../content/qa/audit.mjs';

const LABEL = {
  [STATUS.PASS]: '✓ PASS',
  [STATUS.FAIL]: '✗ FAIL',
  [STATUS.UNPROVEN]: '? UNPROVEN',
  [STATUS.BLOCKED]: '⊘ BLOCKED',
  [STATUS.NOT_EXECUTED]: '– NOT EXECUTED',
};

const report = runAudit(registry);
const { counts } = report;

const lines = [];
lines.push('');
lines.push('  ┌─ بازبینی عددی محتوا (P0) ───────────────────────────────');
lines.push(`  │ قطعه‌های ریاضی بررسی‌شده:      ${String(counts.segments).padStart(5)}`);
lines.push(`  │ زنجیره‌های عددی تأییدشده:      ${String(counts.verifiedChains).padStart(5)}`);
lines.push(`  │ روابط نمادین (غیرقابل‌محاسبه): ${String(counts.symbolicChains).padStart(5)}`);
lines.push(`  │ ${LABEL[STATUS.UNPROVEN]} نیازمند بازبینی انسانی: ${String(counts.unparsedChains).padStart(5)}`);
lines.push(`  │ تناقض عددی:                    ${String(counts.contradictions).padStart(5)}`);
lines.push(`  │ اوراکل‌های ساختاریافته: ${counts.oraclePass}/${counts.oracles} ${LABEL[STATUS.PASS]}`);
lines.push(`  │ نتیجه‌ی کلی:                    ${LABEL[report.status]}`);
lines.push('  └────────────────────────────────────────────────────────────');

if (report.findings.length) {
  lines.push('');
  lines.push('  یافته‌ها:');
  for (const finding of report.findings) lines.push(`   ${LABEL[finding.status]} ${finding.where}: ${finding.detail}`);
}

lines.push('');
lines.push('  نقایص اصلاح‌شده:');
for (const defect of report.defects) {
  lines.push(`   · ${defect.id} — ${defect.where}`);
  lines.push(`       از «${defect.was}» به «${defect.now}» (${defect.class})`);
}

const unresolved = report.unparsed.filter((entry) => /\d/.test(String(entry.source)));
if (unresolved.length) {
  lines.push('');
  lines.push(`  ${LABEL[STATUS.UNPROVEN]} — ${unresolved.length} قطعه عددی که این دستور زبان نتوانست بخواند:`);
  for (const entry of unresolved.slice(0, 25)) {
    lines.push(`   · ${entry.where}: ${String(entry.source).replace(/\s+/g, ' ').slice(0, 88)}`);
  }
  if (unresolved.length > 25) lines.push(`   … و ${unresolved.length - 25} مورد دیگر`);
}

lines.push('');
console.log(lines.join('\n'));
process.exit(report.status === STATUS.FAIL ? 1 : 0);
