import { store } from '../store.ts';
import { el, fa, q, qa } from '../dom.ts';

interface QuizQuestionOptions {
  id: string;
  text: string;
  /** Math already typeset at build time so the client needs no math runtime. */
  html?: string;
}

const escapeText = (value: string): string =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function renderMcq(item: HTMLElement, options: QuizQuestionOptions[]): HTMLFormElement {
  const form = el('form', { class: 'quiz-form', novalidate: 'novalidate' });
  options.forEach((option, index) => {
    const id = `opt-${item.dataset.questionId ?? Math.random().toString(36).slice(2)}-${index}`;
    const label = el('label', { class: 'quiz-option', for: id });
    const input = el('input', { type: 'radio', name: 'answer', id, value: option.id });
    label.append(
      input,
      el('span', { class: 'quiz-option-mark', 'aria-hidden': 'true', text: String.fromCharCode(0x627 + index) }),
      el('span', { class: 'quiz-option-text', html: option.html ?? escapeText(option.text) }),
    );
    form.append(label);
  });
  form.append(el('button', { class: 'primary-button quiz-submit', type: 'submit', text: 'بررسی پاسخ' }));
  return form;
}

function renderNumeric(item: HTMLElement): HTMLFormElement {
  const form = el('form', { class: 'quiz-form quiz-form-numeric', novalidate: 'novalidate' });
  const input = el('input', {
    class: 'quiz-input',
    type: 'text',
    inputmode: 'decimal',
    name: 'answer',
    'aria-label': `پاسخ عددی${item.dataset.unit ? ` به ${item.dataset.unit}` : ''}`,
    placeholder: 'عدد را بنویس',
  });
  const wrapper = el('div', { class: 'numeric-field' });
  wrapper.append(input);
  if (item.dataset.unit) wrapper.append(el('span', { class: 'numeric-unit', text: item.dataset.unit }));
  form.append(wrapper, el('button', { class: 'primary-button quiz-submit', type: 'submit', text: 'بررسی پاسخ' }));
  return form;
}

/** Accepts Persian/Latin digits, thousands separators and simple arithmetic like 2/3 or 2*10^7. */
function parseNumeric(raw: string): number | null {
  const normalised = raw
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))
    .replace(/[٬,\s]/g, '')
    .replace(/\^/g, '**')
    .replace(/×/g, '*')
    .trim();
  if (!normalised) return null;
  const direct = Number(normalised);
  if (Number.isFinite(direct)) return direct;
  if (/^[-+*/().0-9*eE\s**]+$/.test(normalised)) {
    try {
      // eslint-disable-next-line no-new-func
      const value = Function(`"use strict";return (${normalised})`)() as unknown;
      if (typeof value === 'number' && Number.isFinite(value)) return value;
    } catch {
      return null;
    }
  }
  return null;
}

function checkNumeric(answer: number, given: number, tolerance: number): boolean {
  if (tolerance > 0 && Math.abs(answer) > 0) {
    return Math.abs(given - answer) <= Math.abs(answer) * tolerance;
  }
  if (tolerance > 0) return Math.abs(given - answer) <= tolerance;
  return Math.abs(given - answer) < 1e-9;
}

export function initQuiz(data: { page: string; conceptId?: string; questionIds?: string[]; partId?: string }): void {
  const quiz = q<HTMLElement>('[data-quiz]');
  if (!quiz) return;
  const items = qa<HTMLElement>('[data-question]', quiz);
  const status = q<HTMLElement>('[data-quiz-status]');
  const scoreBox = q<HTMLElement>('[data-quiz-score]');
  const explained = new Set<HTMLElement>();

  const paintScore = () => {
    let correct = 0;
    let answered = 0;
    for (const item of items) {
      if (item.dataset.result === 'correct') correct++;
      if (item.dataset.result) answered++;
    }
    if (scoreBox) scoreBox.textContent = answered ? `${fa(correct)} از ${fa(answered)} درست` : '';
    if (status) {
      status.textContent =
        answered < items.length
          ? `${fa(answered)} پاسخ داده شده از ${fa(items.length)}`
          : correct === items.length
            ? 'عالی بود! همه‌ی پاسخ‌ها درست است.'
            : `${fa(items.length - correct)} پاسخ را دوباره ببین؛ توضیح هر کدام زیر همان سؤال است.`;
    }
  };

  for (const [index, item] of items.entries()) {
    item.dataset.questionId = `q${index + 1}`;
    const type = item.dataset.type;
    const formHost = q<HTMLElement>('.quiz-form', item);
    const answer = item.dataset.answer ?? '';
    let form: HTMLFormElement;

    if (type === 'mcq') {
      form = renderMcq(item, JSON.parse(item.dataset.options ?? '[]') as QuizQuestionOptions[]);
    } else {
      form = renderNumeric(item);
    }
    formHost?.replaceWith(form);

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const feedback = q<HTMLElement>('[data-feedback]', item);
      const explain = q<HTMLDetailsElement>('[data-explain]', item);
      let correct = false;

      if (type === 'mcq') {
        const chosen = new FormData(form).get('answer');
        correct = chosen === answer;
        for (const label of qa<HTMLLabelElement>('.quiz-option', form)) {
          const input = q<HTMLInputElement>('input', label)!;
          const isCorrectOption = input.value === answer;
          label.classList.toggle('is-correct', isCorrectOption && (correct || explained.has(item)));
          label.classList.toggle('is-wrong', !isCorrectOption && input.checked);
        }
      } else {
        const raw = new FormData(form).get('answer');
        const value = typeof raw === 'string' ? parseNumeric(raw) : null;
        const tolerance = Number(item.dataset.tolerance ?? 0);
        correct = value !== null && checkNumeric(Number(answer), value, tolerance);
        if (value === null) {
          if (feedback) {
            feedback.textContent = 'عدد را وارد کن. می‌توانی از ارقام فارسی یا لاتین و از ۲/۳ یا ۲×۱۰⁷ هم استفاده کنی.';
            feedback.hidden = false;
            feedback.dataset.result = 'invalid';
          }
          return;
        }
        if (form.querySelector('.numeric-echo')) form.querySelector('.numeric-echo')!.remove();
        form.querySelector('.numeric-field')?.append(
          el('span', { class: 'numeric-echo', text: `پاسخ تو: ${value}` }),
        );
      }

      item.dataset.result = correct ? 'correct' : 'wrong';
      explained.add(item);
      if (feedback) {
        feedback.hidden = false;
        feedback.dataset.result = correct ? 'correct' : 'wrong';
        feedback.textContent = correct
          ? 'درست است. دلیلش را هم پایین بخوان تا مطمئن شوی چرا.'
          : 'درست نیست. پاسخ درست و دلیلش پایین همین سؤال آمده؛ اول خودت دوباره تلاش کن.';
      }
      if (explain) explain.hidden = false;
      paintScore();
      const key = data.page === 'practice-topic' ? `topic:${document.body.dataset.route}` : `concept:${data.conceptId ?? 'practice'}`;
      let correctCount = qa<HTMLElement>('[data-question][data-result="correct"]', quiz).length;
      store.saveQuiz(key, correctCount, items.length, data.conceptId);
      paintScore();
    });
  }

  q<HTMLButtonElement>('[data-quiz-retry]', quiz)?.addEventListener('click', () => {
    for (const item of items) {
      item.dataset.result = '';
      const feedback = q<HTMLElement>('[data-feedback]', item);
      const explain = q<HTMLDetailsElement>('[data-explain]', item);
      if (feedback) feedback.hidden = true;
      if (explain) explain.hidden = true;
      const form = q<HTMLFormElement>('form', item);
      form?.reset();
      const formEl = form;
      if (formEl) for (const label of qa<HTMLLabelElement>('.quiz-option', formEl)) label.classList.remove('is-correct', 'is-wrong');
      form?.querySelector('.numeric-echo')?.remove();
    }
    explained.clear();
    paintScore();
  });

  paintScore();
}