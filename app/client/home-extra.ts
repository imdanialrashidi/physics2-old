/** Home dashboard extras: recommended next concept and the learner's recent trail. */
import { loadCourseIndex } from './course-index.ts';
import { el, fa, q } from './dom.ts';
import { store } from './store.ts';

function tile(heading: string, note: string, link?: { href: string; label: string }): HTMLElement {
  const card = el('article', { class: 'start-card' });
  card.append(el('h3', { text: heading }), el('p', { text: note }));
  if (link) card.append(el('a', { class: 'inline-link', href: link.href, text: link.label }));
  return card;
}

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
  if (nextConcept) {
    slot.append(
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
    slot.append(el('h3', { text: 'ادامه‌ی مسیر' }), el('p', { text: 'همه‌ی مفاهیم تمام شده‌اند — به آزمون ترکیبی سر بزن.' }));
  }

  // 2. Recently studied concepts, so a long session can be picked up again.
  const trailSlot = q<HTMLElement>('[data-recent-list]');
  if (!trailSlot) return;
  const seen = state.recent.map((item) => byId.get(item.id)).filter(Boolean).slice(0, 5);
  trailSlot.replaceChildren();
  if (!seen.length) {
    trailSlot.append(
      tile('هنوز چیزی باز نکرده‌ای', 'هر مفهومی که باز کنی، اینجا می‌ماند تا بعداً راحت برگردی.', {
        href: `${prefix}concepts/`,
        label: 'دیدن نمایه‌ی مفاهیم ←',
      }),
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
  trailSlot.append(
    el('article', { class: 'start-card' }, [el('h3', { text: 'آخرین‌هایی که دیدی' }), list]),
  );
}