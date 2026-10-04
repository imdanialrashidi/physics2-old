/** Weak-area widgets: concepts the learner keeps missing, plus the practice history panel. */
import { loadCourseIndex } from '../course-index.ts';
import { el, fa, q } from '../dom.ts';
import { store } from '../store.ts';
import { initPracticeHistory } from './filters.ts';

export async function initWeakAreas(_data: unknown): Promise<void> {
  initPracticeHistory();
  const section = q<HTMLElement>('[data-weak-list]');
  if (!section) return;
  const weak = store.weakConcepts();
  if (!weak.length) {
    section.hidden = true;
    return;
  }
  const entries = await loadCourseIndex();
  const titles = new Map((entries ?? []).filter((entry) => entry.type === 'concept').map((entry) => [entry.id, entry.title]));
  const list = q<HTMLElement>('ul', section)!;
  const prefix = document.body.dataset.prefix ?? '';
  section.hidden = false;
  section.querySelector('h2')!.textContent = 'مفاهیمی که کمتر بلدی';
  for (const id of weak) {
    list.append(
      el(
        'li',
        {},
        [el('a', { class: 'inline-link', href: `${prefix}concept/${id}/`, text: titles.get(id) ?? id })],
      ),
    );
  }
  if (list.childElementCount === 0) section.hidden = true;
}