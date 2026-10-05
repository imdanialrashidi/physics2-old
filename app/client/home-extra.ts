/** Home dashboard extras: recommended next concept and the learner's recent trail. */
import { loadCourseIndex } from './course-index.ts';
import { el, fa, q } from './dom.ts';
import { store } from './store.ts';

export async function nextCard(slot: HTMLElement, fallbackId: string | null): Promise<void> {
  const state = store.get();
  const entries = await loadCourseIndex();
  const concepts = (entries ?? []).filter((entry) => entry.type === 'concept');
  const byId = new Map(concepts.map((entry) => [entry.id ?? '', entry]));

  // 1. Resume the last concept the learner opened.
  const recent = state.recent.map((item) => byId.get(item.id)).find(Boolean);
  const prefix = document.body.dataset.prefix ?? '';

  const nextConcept =
    concepts.find((entry) => !state.completedConcepts.includes(entry.id ?? '')) ??
    (fallbackId ? byId.get(fallbackId) : undefined);

  slot.hidden = false;
  slot.replaceChildren();
  // The slot ships the first-concept card as its no-JS fallback, so with scripting on it now holds
  // one card of the same chrome instead of a second, differently weighted panel beside it.
  const card = el('article', { class: 'start-card start-card-next' });
  slot.append(card);
  if (nextConcept) {
    card.append(
      el('h3', { text: 'بعدی برای تو' }),
      el('p', { class: 'start-title', text: nextConcept.title }),
      el('p', {
        class: 'hint',
        text: state.completedConcepts.length
          ? `${fa(state.completedConcepts.length)} مفهوم را تمام کرده‌ای؛ از همین‌جا ادامه بده.`
          : 'اولین مفهوم را شروع کن؛ لازم نیست از اول تا آخر جزوه را بخوانی.',
      }),
      el('a', { class: 'inline-link', href: `${prefix}${nextConcept.href}`, text: 'رفتن به درس ←' }),
    );
  } else {
    card.append(el('h3', { text: 'ادامه‌ی مسیر' }), el('p', { text: 'همه‌ی مفاهیم تمام شده‌اند — به آزمون ترکیبی سر بزن.' }));
  }

  // 2. Recently studied concepts, so a long session can be picked up again.
  const trailSlot = q<HTMLElement>('[data-recent-list]');
  if (!trailSlot) return;
  const seen = state.recent.map((item) => byId.get(item.id)).filter(Boolean).slice(0, 5);
  trailSlot.replaceChildren();
  if (!seen.length) {
    // Nothing studied yet: the empty-state hint stays, but it is not given a card of its own so the
    // section keeps one clear next action instead of two competing panels.
    trailSlot.append(
      el('p', { class: 'start-note', text: 'هنوز چیزی باز نکرده‌ای. هر مفهومی که باز کنی، اینجا می‌ماند تا بعداً راحت برگردی.' }),
      el('a', { class: 'inline-link', href: `${prefix}concepts/`, text: 'دیدن نمایه‌ی مفاهیم ←' }),
    );
    return;
  }
  const list = el('ul', { class: 'recent-list' });
  for (const entry of seen) {
    list.append(
      el(
        'li',
        {},
        [el('a', { class: 'inline-link', href: `${prefix}${entry!.href}`, text: entry!.title })],
      ),
    );
  }
  trailSlot.append(el('h3', { class: 'start-note-title', text: 'آخرین‌هایی که دیدی' }), list);
}