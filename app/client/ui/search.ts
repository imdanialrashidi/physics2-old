/** Header search dialog (⌘/Ctrl-K or `/`) backed by a lazily fetched static index. */
import { loadCourseIndex, searchIndex, type IndexEntry as SearchEntry } from '../course-index.ts';
import { el, fa, normaliseSearch, q, qa } from '../dom.ts';

const TYPE_LABEL: Record<SearchEntry['type'], string> = {
  concept: 'مفهوم',
  formula: 'فرمول',
  question: 'پرسش',
};

const search = (query: string, entries: SearchEntry[], limit = 8) => searchIndex(entries, query, limit);

function renderResults(container: HTMLElement, results: { entry: SearchEntry; score: number }[], prefix: string): void {
  container.textContent = '';
  if (!results.length) {
    container.append(
      el('li', { class: 'search-empty' }, [
        el('p', { text: 'چیزی پیدا نشد.' }),
        el('p', { class: 'hint', text: 'شاید املای فارسی متفاوت باشد؛ مثلاً «گاوس» یا «خازن» را امتحان کن.' }),
      ]),
    );
    return;
  }
  for (const { entry } of results) {
    const item = el('li', {});
    const link = el('a', { class: 'search-result', href: `${prefix}${entry.href}` });
    link.append(
      el('span', { class: 'search-result-type', text: TYPE_LABEL[entry.type] }),
      el('span', { class: 'search-result-title', html: entry.title }),
      el('span', { class: 'search-result-hint', text: normaliseSearch(entry.text).slice(0, 70) }),
    );
    item.append(link);
    container.append(item);
  }
}

export function initSearch(data: { page: string }): void {
  const dialog = q<HTMLElement>('[data-search-dialog]');
  if (dialog) setupDialog(dialog);

  const pageInput = q<HTMLInputElement>('[data-search-page-input]');
  if (pageInput && data.page === 'search') {
    const results = q<HTMLElement>('[data-search-page-results]')!;
    const status = q<HTMLElement>('[data-search-page-status]');
    const prefix = document.body.dataset.prefix ?? '';
    const raw = q<HTMLScriptElement>('#page-data')?.textContent ?? '{}';
    const { entries = [], formulas = [], questions = [] } = JSON.parse(raw) as {
      entries?: SearchEntry[];
      formulas?: SearchEntry[];
      questions?: SearchEntry[];
    };
    const all = [...(entries ?? []), ...(formulas ?? []), ...(questions ?? [])];
    const run = () => {
      const found = search(pageInput.value, all, 30);
      renderResults(results, found, prefix);
      if (status) status.textContent = pageInput.value.trim().length >= 2 ? `${fa(found.length)} نتیجه` : '';
    };
    pageInput.addEventListener('input', run);
    pageInput.focus();
    run();
  }
}

function setupDialog(dialog: HTMLElement): void {
  const prefix = document.body.dataset.prefix ?? '';
  dialog.innerHTML = `
<div class="search-panel" role="dialog" aria-modal="true" aria-label="جست‌وجو در درس">
  <div class="search-head">
    <input class="search-input" type="search" data-search-input placeholder="مثلاً: قانون گاوس یا خازن…" aria-label="عبارت جست‌وجو" autocomplete="off">
    <button class="ghost-button" type="button" data-search-close>بستن</button>
  </div>
  <ol class="search-results" data-search-results></ol>
  <p class="search-footer"><span class="hint">برای جست‌وجوی کامل، صفحه‌ی <a href="${prefix}search/">جست‌وجو</a> را باز کن.</span></p>
</div>`;
  const input = q<HTMLInputElement>('[data-search-input]', dialog)!;
  const results = q<HTMLElement>('[data-search-results]', dialog)!;
  const status = document.createElement('p');
  status.className = 'search-status';
  status.setAttribute('role', 'status');

  const trigger = q<HTMLButtonElement>('[data-search-open]');
  const open = () => {
    dialog.hidden = false;
    void loadCourseIndex().then((entries) => {
      if (!entries) {
        results.textContent = '';
        const li = el('li', { class: 'search-empty' });
        li.append(
          el('p', { text: 'جست‌وجوی سریع در این حالت در دسترس نیست.' }),
          el('p', { class: 'hint' }, [
            document.createTextNode('به صفحه‌ی '),
            el('a', { href: `${prefix}search/`, text: 'جست‌وجوی کامل' }),
            document.createTextNode(' برو؛ همان نتایج را آنجا می‌بینی.'),
          ]),
        );
        results.append(li);
        return;
      }
      const run = () => {
        const found = search(input.value, entries);
        renderResults(results, found, prefix);
        status.textContent = input.value.trim().length >= 2 ? `${fa(found.length)} نتیجه` : '';
      };
      input.addEventListener('input', run);
      run();
    });
    input.focus();
  };
  const close = () => {
    dialog.hidden = true;
    // Focus must not be left on a hidden input: return it to the trigger that opened it.
    trigger?.focus();
  };

  q<HTMLButtonElement>('[data-search-open]')?.addEventListener('click', open);
  q<HTMLButtonElement>('[data-search-close]', dialog)?.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  document.addEventListener('keydown', (event) => {
    const target = event.target as HTMLElement | null;
    const typing = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
    if (event.key === '/' && !typing) {
      event.preventDefault();
      open();
    }
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open();
    }
    if (event.key === 'Escape' && !dialog.hidden) close();
    if (event.key === 'Tab' && !dialog.hidden) {
      // Simple focus trap: keep Tab inside the dialog while it is open.
      const focusables = qa<HTMLElement>('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', dialog);
      if (!focusables.length) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}