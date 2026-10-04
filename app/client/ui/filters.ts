/** Live filters for the concept explorer, formula handbook, glossary and practice history. */
import { store } from '../store.ts';
import { fa, q, qa } from '../dom.ts';

const normalise = (value: string) =>
  value
    .toLowerCase()
    .replace(/[ً-ٰ]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\s+/g, ' ')
    .trim();

function setupFilterGroup(buttons: HTMLElement[], attribute: string, onChange: (value: string) => void) {
  for (const button of buttons) {
    button.addEventListener('click', () => {
      for (const other of buttons) other.classList.toggle('is-active', other === button);
      onChange(button.dataset[attribute] ?? 'all');
    });
  }
}

function initConceptsPage(): void {
  const grid = q<HTMLElement>('[data-concepts-grid]');
  if (!grid) return;
  const cards = qa<HTMLElement>('.concept-card', grid);
  const search = q<HTMLInputElement>('[data-concepts-search]');
  const status = q<HTMLElement>('[data-concepts-status]');
  const empty = q<HTMLElement>('[data-concepts-empty]');
  let part = 'all';
  let level = 'all';

  const apply = () => {
    const term = normalise(search?.value ?? '');
    let visible = 0;
    for (const card of cards) {
      const text = normalise(card.textContent ?? '');
      const cardPart = card.dataset.part ?? '';
      const cardLevel = card.dataset.level ?? '';
      const matches = (!term || text.includes(term)) && (part === 'all' || cardPart === part) && (level === 'all' || cardLevel === level);
      card.hidden = !matches;
      if (matches) visible++;
    }
    if (status) status.textContent = term || part !== 'all' || level !== 'all' ? `${fa(visible)} مفهوم نمایش داده می‌شود.` : `${fa(visible)} مفهوم در کل درس.`;
    if (empty) empty.hidden = visible > 0;
  };

  setupFilterGroup(qa<HTMLElement>('[data-concept-filter]'), 'conceptFilter', (value) => {
    part = value;
    apply();
  });
  setupFilterGroup(qa<HTMLElement>('[data-level-filter]'), 'levelFilter', (value) => {
    level = value;
    apply();
  });
  search?.addEventListener('input', apply);
  apply();
}

function initFormulasPage(): void {
  const sections = qa<HTMLElement>('[data-part-section]');
  if (!sections.length) return;
  const cards = qa<HTMLElement>('[data-formula]', sections.length ? sections[0]!.closest('.hub')! : document);
  const search = q<HTMLInputElement>('[data-formula-search]');
  const status = q<HTMLElement>('[data-formula-status]');
  const empty = q<HTMLElement>('[data-formulas-empty]');
  let part = 'all';

  const apply = () => {
    const term = normalise(search?.value ?? '');
    let visible = 0;
    for (const card of cards) {
      const section = card.closest<HTMLElement>('[data-part-section]');
      const text = normalise(`${card.dataset.latex ?? ''} ${card.textContent ?? ''}`);
      const matches = (!term || text.includes(term)) && (part === 'all' || section?.dataset.partSection === part);
      card.hidden = !matches;
      if (matches) visible++;
    }
    for (const section of sections) {
      const anyVisible = qa<HTMLElement>('[data-formula]', section).some((card) => !card.hidden);
      section.hidden = !anyVisible;
    }
    if (status) status.textContent = `${fa(visible)} فرمول نمایش داده می‌شود.`;
    if (empty) empty.hidden = visible > 0;
  };

  setupFilterGroup(qa<HTMLElement>('[data-formula-filter]'), 'formulaFilter', (value) => {
    part = value;
    apply();
  });
  search?.addEventListener('input', apply);
  apply();
}

function initGlossaryPage(): void {
  const list = q<HTMLElement>('[data-glossary]');
  if (!list) return;
  const entries = qa<HTMLElement>('.glossary-entry', list);
  const search = q<HTMLInputElement>('[data-glossary-search]');
  const status = q<HTMLElement>('[data-glossary-status]');
  const empty = q<HTMLElement>('[data-glossary-empty]');

  const apply = () => {
    const term = normalise(search?.value ?? '');
    let visible = 0;
    for (const entry of entries) {
      const matches = !term || normalise(entry.dataset.term ?? '').includes(term);
      entry.hidden = !matches;
      if (matches) visible++;
    }
    if (status) status.textContent = term ? `${fa(visible)} واژه پیدا شد.` : `${fa(entries.length)} واژه.`;
    if (empty) empty.hidden = visible > 0;
  };
  search?.addEventListener('input', apply);
  apply();
}

export function initFilters(_data: unknown): void {
  initConceptsPage();
  initFormulasPage();
  initGlossaryPage();
}

export function initPracticeHistory(): void {
  const section = q<HTMLElement>('[data-practice-history]');
  if (!section) return;
  const list = q<HTMLElement>('[data-history-list]', section)!;
  const state = store.get();
  const entries = Object.entries(state.quiz);
  if (!entries.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  for (const [key, value] of entries) {
    const percent = Math.round((value.correct / Math.max(value.total, 1)) * 100);
    list.append(
      Object.assign(document.createElement('li'), {
        innerHTML: `<span class="history-key">${key.replace('concept:', '').replace('topic:', '')}</span><span class="history-score">${fa(value.correct)}/${fa(value.total)} (${fa(percent)}٪)</span>`,
      }),
    );
  }
  q<HTMLButtonElement>('[data-clear-history]', section)?.addEventListener('click', () => {
    store.clearHistory();
    section.hidden = true;
  });
}