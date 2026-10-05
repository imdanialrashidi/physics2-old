import '../styles/main.css';
import { store } from './store.ts';
import { announce, el, fa, q, qa } from './dom.ts';

interface PageData {
  page: string;
  sims?: string[];
  conceptId?: string;
  partId?: string;
  questionIds?: string[];
  sim?: string | null;
  nextConceptId?: string | null;
  concepts?: { id: string; title: string; part: string; difficulty: number; keywords: string[] }[];
}

function readPageData(): PageData {
  const node = q<HTMLScriptElement>('#page-data');
  if (!node?.textContent) return { page: 'unknown' };
  try {
    return JSON.parse(node.textContent) as PageData;
  } catch {
    return { page: 'unknown' };
  }
}

const data = readPageData();

/** Total concept count, needed by the progress ribbon on every page. */
const registryConceptCount = Number(document.body.dataset.conceptCount ?? 48);

function announceProgress(): void {
  window.dispatchEvent(new CustomEvent('physics:progress'));
}

/** Progress ribbon: one row of charge dots plus a count (the product's progress signature). */
function renderProgressStrip(target: HTMLElement, done: number, total: number): void {
  target.textContent = '';
  const shown = Math.min(total, 12);
  const filled = Math.round((done / Math.max(total, 1)) * shown);
  for (let index = 0; index < shown; index++) {
    target.append(el('span', { class: `charge-dot ${index < filled ? 'is-on' : ''}`, 'aria-hidden': 'true' }));
  }
  target.setAttribute('aria-label', `${fa(done)} از ${fa(total)} مفهوم تمام شده`);
}

function paintProgressCounters(): void {
  const total = Number(document.body.dataset.conceptCount ?? 0);
  if (total > 0) document.querySelector<HTMLElement>('[data-progress-total]')!.textContent = fa(total);
  const done = store.get().completedConcepts.length;
  const counter = document.querySelector<HTMLElement>('[data-progress-done]');
  if (counter) counter.textContent = fa(done);
  const mini = document.querySelector<HTMLElement>('[data-progress-mini]');
  if (mini) renderProgressStrip(mini, done, total || registryConceptCount);
}

function initProgressPanel() {
  const panel = q<HTMLElement>('[data-progress-panel]');
  const toggle = q<HTMLButtonElement>('[data-progress-toggle]');
  if (!panel || !toggle) return;

  const paint = () => {
    const state = store.get();
    paintProgressCounters();
    panel.textContent = '';
    const rows: [string, string][] = [
      ['مفهوم تمام‌شده', fa(state.completedConcepts.length)],
      ['پارت تمام‌شده', fa(state.completedParts.length)],
      ['نشان‌شده', fa(state.bookmarks.length)],
      ['پرسش‌های پاسخ‌داده', fa(Object.values(state.quiz).reduce((sum: number, item) => sum + item.total, 0))],
      ['روزهای پیوسته', fa(state.streak.days)],
      ['محل ذخیره', store.storageAvailable() ? 'همین مرورگر' : 'فقط تا بستن صفحه'],
    ];
    const list = el('ul', { class: 'progress-list' });
    for (const [label, value] of rows) {
      list.append(el('li', {}, [el('span', { text: label }), el('strong', { text: value })]));
    }
    panel.append(
      el('h2', { class: 'progress-panel-title', text: 'پیشرفت من' }),
      list,
      store.storageAvailable()
        ? el('p', { class: 'progress-note', text: 'این داده‌ها فقط روی همین دستگاه ذخیره می‌شوند؛ بدون حساب کاربری.' })
        : el('p', { class: 'progress-note', text: 'ذخیره‌سازی مرورگر در دسترس نیست؛ پیشرفت تا بستن این صفحه نگه داشته می‌شود.' }),
    );
    panel.hidden = toggle.getAttribute('aria-expanded') !== 'true';
  };

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    paint();
  });
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    if (!panel.hidden && !panel.contains(target) && !toggle.contains(target)) {
      toggle.setAttribute('aria-expanded', 'false');
      paint();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      paint();
    }
  });
  paint();
  window.addEventListener('physics:progress', paint);
}

function initCompleteButtons() {
  const conceptButton = q<HTMLButtonElement>('[data-complete-concept]');
  if (conceptButton && data.conceptId) {
    const status = q<HTMLElement>('[data-concept-status]');
    const paint = () => {
      const done = store.get().completedConcepts.includes(data.conceptId!);
      conceptButton.textContent = done ? 'این مفهوم را تمام کرده‌ای ✓' : 'فهمیدم، این مفهوم تمام شد';
      conceptButton.classList.toggle('is-done', done);
      if (status) status.textContent = done ? 'در پیشرفت شما ثبت شد.' : '';
      paintProgressCounters();
      announceProgress();
    };
    conceptButton.addEventListener('click', () => {
      const added = store.completeConcept(data.conceptId!);
      paint();
      if (added) announce('مفهوم به‌عنوان تمام‌شده ثبت شد.');
    });
    paint();
  }

  const partButton = q<HTMLButtonElement>('[data-complete-part]');
  if (partButton && data.partId) {
    const status = q<HTMLElement>('[data-part-progress]');
    partButton.addEventListener('click', () => {
      store.completePart(data.partId!);
      announceProgress();
      partButton.textContent = 'ثبت شد ✓';
      partButton.classList.add('is-done');
      if (status) status.textContent = 'این پارت در پیشرفت شما ثبت شد. حالا سراغ پارت بعد برو یا تمرین بزن.';
      announce('پارت به‌عنوان تمام‌شده ثبت شد.');
    });
  }
}

function initBookmarks() {
  for (const button of qa<HTMLButtonElement>('[data-bookmark]')) {
    const id = button.dataset.bookmark!;
    const paint = () => {
      const marked = store.isBookmarked(id);
      button.setAttribute('aria-pressed', String(marked));
      button.classList.toggle('is-active', marked);
      button.textContent = marked ? 'نشان شده ★' : 'نشان کن';
    };
    button.addEventListener('click', () => {
      store.toggleBookmark(id);
      paint();
      announceProgress();
    });
    paint();
  }
}

function initSteps() {
  for (const container of qa<HTMLElement>('[data-steps]')) {
    const steps = qa<HTMLDetailsElement>('.step', container);
    q<HTMLButtonElement>('[data-steps-all]', container)?.addEventListener('click', () => steps.forEach((step) => (step.open = true)));
    q<HTMLButtonElement>('[data-steps-reset]', container)?.addEventListener('click', () => {
      steps.forEach((step, index) => (step.open = index === 0));
    });
  }
}

function initCopyButtons() {
  for (const button of qa<HTMLButtonElement>('[data-copy-formula]')) {
    button.addEventListener('click', async () => {
      const card = button.closest<HTMLElement>('[data-formula]');
      const latex = card?.dataset.latex ?? '';
      const original = button.textContent ?? 'کپی';
      try {
        await navigator.clipboard.writeText(latex);
        button.textContent = 'کپی شد ✓';
        // The state is carried by the glyph and the wording as well as the colour, so it survives a
        // greyscale rendering or a colour-vision difference.
        button.classList.add('is-copied');
        announce('فرمول کپی شد.');
      } catch {
        button.textContent = 'کپی ناموفق';
        button.classList.add('is-failed');
      }
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove('is-copied', 'is-failed');
      }, 1600);
    });
  }
}

function initRescue() {
  const panel = q<HTMLElement>('[data-rescue]');
  if (!panel) return;
  const concept = q<HTMLElement>('.concept-main');
  q<HTMLButtonElement>('[data-lost-open]')?.addEventListener('click', () => {
    panel.hidden = false;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    panel.querySelector<HTMLElement>('h3')?.focus?.();
  });
  q<HTMLButtonElement>('[data-rescue-close]')?.addEventListener('click', () => {
    panel.hidden = true;
    concept?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  q<HTMLButtonElement>('[data-rescue-back]')?.addEventListener('click', () => {
    panel.hidden = true;
    concept?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    q<HTMLButtonElement>('[data-lost-open]')?.focus();
  });
}

async function initHomeExtras() {
  const nextSlot = q<HTMLElement>('[data-next-concept]');
  if (!nextSlot) return;
  const { nextCard } = await import('./home-extra.ts');
  nextCard(nextSlot, data.nextConceptId ?? null);
}

/**
 * Mobile navigation.
 *
 * The nav ships expanded and fully usable; only once scripting is confirmed does it become a
 * collapsible panel. That ordering matters: a hamburger that cannot open because a chunk failed to
 * load would hide the entire navigation.
 */
function initNav(): void {
  const toggle = q<HTMLButtonElement>('[data-nav-toggle]');
  const panel = q<HTMLElement>('#site-nav-panel');
  if (!toggle || !panel) return;

  document.documentElement.classList.add('js');

  const desktop = window.matchMedia('(min-width: 881px)');
  const setOpen = (open: boolean): void => {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };

  // Collapsed by default on phones, always visible from 881 px up.
  const sync = (): void => {
    if (desktop.matches) {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'false');
      return;
    }
    setOpen(false);
  };
  sync();
  desktop.addEventListener('change', sync);

  toggle.addEventListener('click', () => setOpen(panel.hidden === true));

  // Close after navigating, and on Escape — focus returns to the trigger so keyboard users are not
  // dropped at the top of the document.
  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) {
      setOpen(false);
      toggle.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || panel.hidden || desktop.matches) return;
    setOpen(false);
    toggle.focus();
  });

  // Collapse the panel when focus leaves the header entirely, so tabbing past it does not leave an
  // invisible expanded region behind.
  document.addEventListener('focusout', (event) => {
    if (panel.hidden || desktop.matches) return;
    const next = (event as FocusEvent).relatedTarget as Node | null;
    if (next && panel.contains(next)) return;
    if (next && toggle.contains(next)) return;
    setOpen(false);
  });
}

function main(): void {
  document.documentElement.classList.add('js');
  initNav();
  initProgressPanel();
  initCompleteButtons();
  initBookmarks();
  initSteps();
  initCopyButtons();
  initRescue();

  if (data.conceptId) store.markRecent(data.conceptId);

  void (async () => {
    const { initQuiz } = await import('./ui/quiz.ts');
    initQuiz(data);
    const { initFilters } = await import('./ui/filters.ts');
    initFilters(data);
    const { initSearch } = await import('./ui/search.ts');
    initSearch(data);
    if (data.page === 'home') {
      const { initHero } = await import('./ui/hero.ts');
      initHero();
      await initHomeExtras();
    }
    const { mountSimulations } = await import('./sims/index.ts');
    if (data.page === 'sims') {
      for (const id of data.sims ?? []) await mountSimulations(id);
    } else {
      // A concept page may carry a primary figure plus compact extras; mount every one of them.
      const ids: string[] = data.sims?.length ? data.sims : data.sim ? [data.sim] : [];
      for (const id of ids) await mountSimulations(id);
    }
    const { initWeakAreas } = await import('./ui/weak.ts');
    initWeakAreas(data);
    // Signals that every enhancement is wired, so tests and keyboard users never race the chunks.
    document.body.dataset.appReady = 'true';
  })();
}

main();