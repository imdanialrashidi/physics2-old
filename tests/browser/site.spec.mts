import { expect, test } from '@playwright/test';

/** End-to-end behaviour of the learning site, on the real static build. */

const consoleErrors: string[] = [];

/** Navigates and waits until every client enhancement has been wired. */
async function open(page: import('@playwright/test').Page, route: string): Promise<void> {
  await page.goto(route.replace(/^\//, ''));
  await page.locator('body[data-app-ready="true"]').waitFor({ state: 'attached', timeout: 10_000 });
}

test.beforeEach(async ({ page }) => {
  consoleErrors.length = 0;
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${error.message}`));
});

test('home renders the learning map and links into part 1', async ({ page }) => {
  await open(page, '/');
  await expect(page).toHaveTitle(/فیزیک ۲/);
  await expect(page.getByRole('heading', { name: /فهمیدنی/ })).toBeVisible();
  await expect(page.locator('.ladder-step')).toHaveCount(5);
  await expect(page.locator('.footer-made')).toHaveText('ساخته شده توسط دانیال رشیدی');
  await expect(page.locator('.footer-domain')).toHaveText('imdanialrashidi.github.io');

  await page.getByRole('link', { name: 'شروع از پارت اول' }).click();
  await expect(page).toHaveURL(/lessons\/part-1\//);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('بار الکتریکی و میدان الکتریکی');
  expect(consoleErrors).toEqual([]);
});

test('concept page teaches in layers and keeps a readable formula', async ({ page }) => {
  await open(page, '/concept/coulomb/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('قانون کولن');
  for (const layer of ['intuition', 'visual', 'math', 'example', 'practice', 'related']) {
    await expect(page.locator(`#${layer}`)).toBeVisible();
  }
  const formula = page.locator('.formula-display .katex').first();
  await expect(formula).toBeVisible();
  await expect(formula).toContainText('q');
  await expect(page.locator('.rescue')).toBeHidden();

  // progressive reveal: later steps start closed and open on demand
  const steps = page.locator('.step');
  await expect(steps.first()).toHaveAttribute('open', '');
  await expect(steps.nth(2)).not.toHaveAttribute('open', '');
  await steps.nth(2).locator('summary').click();
  await expect(steps.nth(2)).toHaveAttribute('open', '');

  // rescue path opens and closes
  await page.getByRole('button', { name: 'این قسمت رو نمی‌فهمم' }).click();
  await expect(page.locator('.rescue')).toBeVisible();
  await expect(page.locator('.rescue-steps li')).toHaveCount(4);
  await page.getByRole('button', { name: 'بستن و برگشت به درس' }).click();
  await expect(page.locator('.rescue')).toBeHidden();
  expect(consoleErrors).toEqual([]);
});

test('the Coulomb simulation reacts to its controls and resets numerically', async ({ page }) => {
  await open(page, '/concept/coulomb/');
  const canvas = page.locator('.sim-canvas');
  await expect(canvas).toBeVisible();
  const readValue = async () => {
    const text = (await page.locator('.sim-readout').filter({ hasText: 'اندازه‌ی نیرو' }).locator('.sim-readout-value').textContent()) ?? '';
    // read-outs are Persian-digit formatted; parse them back to a number
    const normalised = text.replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))).replace(/[^\d.]/g, '');
    return Number(normalised);
  };
  const before = await readValue();
  expect(before).toBeGreaterThan(0);

  // moving the charges apart must drop the force by the 1/r² law, not just redraw
  const distanceSlider = page.locator('.sim-control', { hasText: 'فاصله' }).locator('input[type=range]');
  await distanceSlider.fill('2.4');
  await distanceSlider.dispatchEvent('input');
  const after = await readValue();
  expect(after).toBeGreaterThan(0);
  expect(after).toBeLessThan(before * 0.35);
  // and the read-out must state the consequence instead of only showing a number
  await expect(page.locator('.sim-readout').filter({ hasText: 'اگر r دو برابر شود' })).toBeVisible();

  // charge sign changes the reported direction
  await expect(page.locator('.sim-readout').filter({ hasText: 'جاذبه' })).toBeVisible();
  await page.locator('.sim-control', { hasText: 'بار دوم' }).locator('input[type=range]').fill('3');
  await page.locator('.sim-control', { hasText: 'بار دوم' }).locator('input[type=range]').dispatchEvent('input');
  await expect(page.locator('.sim-readout').filter({ hasText: 'دفعی' })).toBeVisible();
});

test('search finds concepts, formulas and questions, and handles an empty result', async ({ page }) => {
  await open(page, '/');
  await page.getByRole('button', { name: /جست‌وجو/ }).click();
  const dialog = page.locator('.search-dialog');
  await expect(dialog).toBeVisible();
  await dialog.locator('[data-search-input]').fill('گاوس');
  await expect(dialog.locator('.search-result').first()).toBeVisible();

  await dialog.locator('[data-search-input]').fill('قانون کولن');
  await expect(dialog.locator('.search-result-title').first()).toContainText('کولن');

  await dialog.locator('[data-search-input]').fill('زیبیکیبیکیبی');
  await expect(dialog.locator('.search-empty')).toBeVisible();
  await expect(dialog.locator('.search-footer a')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('quiz explains wrong answers and persists progress', async ({ page }) => {
  await open(page, '/concept/coulomb/');
  // the first question is numeric: a wrong number must still explain itself
  const numericItem = page.locator('.quiz-item').first();
  await expect(numericItem).toHaveAttribute('data-type', 'numeric');
  await numericItem.locator('.quiz-input').fill('123');
  await numericItem.getByRole('button', { name: 'بررسی پاسخ' }).click();
  await expect(numericItem.locator('.quiz-feedback')).toBeVisible();
  await expect(numericItem.locator('.quiz-explain')).toBeVisible();
  await expect(numericItem.locator('.quiz-feedback')).toContainText('درست نیست');

  // a multiple-choice question marks the wrong option and opens its explanation
  const mcqItem = page.locator('.quiz-item').nth(1);
  await mcqItem.locator('.quiz-option').nth(0).click();
  await mcqItem.getByRole('button', { name: 'بررسی پاسخ' }).click();
  await expect(mcqItem.locator('.quiz-explain')).toBeVisible();
  await expect(mcqItem.locator('.quiz-explain')).toContainText('مربع');
  await expect(page.locator('.quiz-score')).toContainText('۱');

  await page.getByRole('button', { name: /فهمیدم/ }).click();
  await expect(page.locator('.concept-complete p')).toContainText('ثبت شد');

  await page.reload();
  await expect(page.locator('.concept-complete p')).toContainText('ثبت شد');
  const panel = page.locator('[data-progress-toggle]');
  await panel.click();
  await expect(page.locator('.progress-list')).toContainText('مفهوم تمام‌شده');
  await expect(page.locator('.progress-list')).toContainText('۱');
});

test('formula handbook filters and copies', async ({ page }) => {
  await open(page, '/formulas/');
  await expect(page.locator('.formula-card').first()).toBeVisible();
  const status = page.locator('[data-formula-status]');
  await expect(status).toContainText('فرمول');

  // searching inside the handbook narrows the result set
  const total = await page.locator('.formula-card').count();
  await page.locator('[data-formula-search]').fill('واحد');
  const narrowed = await page.locator('.formula-card:visible').count();
  expect(narrowed).toBeLessThan(total);

  // a part filter must not leak formulas from other parts
  await page.locator('[data-formula-search]').fill('');
  await page.getByRole('button', { name: 'پارت ۱' }).click();
  const shownSections = await page.locator('[data-part-section]:visible').evaluateAll((nodes) =>
    nodes.map((node) => node.getAttribute('data-part-section')),
  );
  expect(shownSections.length).toBeGreaterThan(0);
  for (const id of shownSections) expect(id).toBe('part-1');

  await page.locator('[data-formula-search]').fill('زیبیکیبیکیبی');
  await expect(page.locator('[data-formulas-empty]')).toBeVisible();
});

test('concept explorer filters by part, level and search text', async ({ page }) => {
  await open(page, '/concepts/');
  const cards = page.locator('.concept-card:visible');
  const total = await cards.count();
  expect(total).toBeGreaterThan(10);
  await page.locator('[data-concepts-search]').fill('دوقطبی');
  await expect(cards).toHaveCount(1);
  await page.locator('[data-concepts-search]').fill('');
  await page.getByRole('button', { name: 'چالش‌برانگیز' }).click();
  await expect(page.locator('.concept-card:visible').first()).toBeVisible();
  await page.locator('[data-concepts-search]').fill('ناموجودببب');
  await expect(page.locator('[data-concepts-empty]')).toBeVisible();
});

test('study map shows the prerequisite chain', async ({ page }) => {
  await open(page, '/map/');
  await expect(page.locator('.map-part')).toHaveCount(5);
  await expect(page.locator('.map-node').first()).toBeVisible();
  await expect(page.locator('.chain-prereq').first()).toBeVisible();
  await page.locator('.map-node-head a').first().click();
  await expect(page).toHaveURL(/concept\//);
});

test('no horizontal overflow at narrow width and math stays readable', async ({ page }) => {
  await open(page, '/concept/coulomb/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  const direction = await page.evaluate(() => getComputedStyle(document.documentElement).direction);
  expect(direction).toBe('rtl');
  const mathDir = await page.locator('.math-block').first().evaluate((node) => getComputedStyle(node).direction);
  expect(mathDir).toBe('ltr');
});

test('deep link reload works and unknown paths show the 404 page', async ({ page }) => {
  await open(page, '/concept/field-superposition/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('چند بار نقطه‌ای');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('چند بار نقطه‌ای');
  const response = await page.goto('concept/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('پیدا نشد');

  // GitHub Pages serves 404.html at whatever URL was requested, so the page must still be styled
  // and its escape routes must resolve from that arbitrary depth. A bare 404 status is not enough.
  const painted = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    return { background: body.backgroundColor, font: body.fontFamily };
  });
  expect(painted.background, '404 page lost its stylesheet at depth').not.toBe('rgba(0, 0, 0, 0)');
  expect(painted.font, '404 page lost its typography at depth').toContain('Vazirmatn');
  const home = page.getByRole('link', { name: /صفحه‌ی اصلی/ });
  await expect(home).toBeVisible();
  await home.click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('فیزیک را فهمیدنی');
});

test('site keeps working when localStorage is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new DOMException('denied', 'SecurityError');
      },
    });
  });
  await open(page, '/concept/coulomb/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('قانون کولن');
  await page.getByRole('button', { name: /فهمیدم/ }).click();
  await expect(page.locator('.concept-complete p')).toContainText('ثبت شد');
  await page.locator('[data-progress-toggle]').click();
  await expect(page.locator('.progress-list')).toContainText('فقط تا بستن صفحه');
});

test('reduced motion disables the animated hero but keeps the picture', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/');
  await expect(page.locator('.hero-canvas')).toBeVisible();
  const animated = await page.locator('.hero-canvas').evaluate((node) => {
    const ctx = (node as HTMLCanvasElement).getContext('2d');
    if (!ctx) return false;
    const { data } = ctx.getImageData(0, 0, 40, 40);
    return Array.from(data).some((value) => value !== 0);
  });
  expect(animated).toBe(true);
});
test('every simulation mounts, reacts to its controls and offers a text fallback', async ({ page }) => {
  await open(page, '/sims/');
  const tiles = page.locator('.sim-tile');
  await expect(tiles).toHaveCount(14);

  const failures: string[] = [];
  for (let index = 0; index < 14; index++) {
    const tile = tiles.nth(index);
    const id = await tile.getAttribute('data-sim');
    await expect(tile.locator('.sim-canvas'), `${id} mounts a figure`).toBeVisible();
    await expect(tile.locator('.sim-text summary'), `${id} keeps a text fallback`).toBeVisible();

    const sliders = tile.locator('.sim-control input[type=range]');
    const buttons = tile.locator('.sim-controls button');
    const sliderCount = await sliders.count();
    const buttonCount = await buttons.count();
    if (sliderCount === 0 && buttonCount === 0) {
      failures.push(`${id}: no control to exercise`);
      continue;
    }

    const readAll = async () => (await tile.locator('.sim-readout-value').allInnerTexts()).join('|');
    const before = await readAll();

    // Move/press every control of this figure and require the physics read-outs to react.
    let changed = false;
    for (let s = 0; s < sliderCount; s++) {
      const slider = sliders.nth(s);
      const value = Number(await slider.inputValue());
      const min = Number(await slider.getAttribute('min'));
      const max = Number(await slider.getAttribute('max'));
      const step = Number(await slider.getAttribute('step'));
      const next = value + step > max ? min + step : value + step;
      await slider.fill(String(next));
      await slider.dispatchEvent('input');
      if ((await readAll()) !== before) changed = true;
    }
    for (let b = 0; b < buttonCount; b++) {
      const button = buttons.nth(b);
      const label = (await button.textContent())?.trim() ?? '';
      if (label.includes('بازنشانی')) continue; // a reset is expected to restore the initial read-out
      await button.click();
      if ((await readAll()) !== before) changed = true;
    }
    if (!changed) failures.push(`${id}: controls moved but no read-out changed (read-out: ${before})`);
  }
  expect(failures, failures.join('\n')).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test('mixed practice page answers, scores and reports weak areas', async ({ page }) => {
  await open(page, '/practice/mixed/');
  const items = page.locator('.quiz-item');
  const count = await items.count();
  expect(count).toBeGreaterThan(5);

  // Answer the first question incorrectly and check the explanation opens.
  const numeric = items.filter({ has: page.locator('.quiz-input') }).first();
  if ((await numeric.count()) > 0) {
    await numeric.locator('.quiz-input').fill('-999');
    await numeric.getByRole('button', { name: 'بررسی پاسخ' }).click();
    await expect(numeric.locator('.quiz-explain')).toBeVisible();
  }
  const mcq = items.filter({ has: page.locator('.quiz-option') }).first();
  await mcq.locator('.quiz-option').first().click();
  await mcq.getByRole('button', { name: 'بررسی پاسخ' }).click();
  await expect(mcq.locator('.quiz-feedback')).toBeVisible();

  // Retry clears every answer state.
  await page.getByRole('button', { name: 'تلاش دوباره' }).click();
  await expect(mcq.locator('.quiz-feedback')).toBeHidden();
  await expect(mcq.locator('.quiz-explain')).toBeHidden();

  // The answer survives a reload because results are stored locally.
  await page.reload();
  await page.locator('[data-progress-toggle]').click();
  await expect(page.locator('.progress-list')).toContainText('پرسش‌های پاسخ‌داده');
});

test('glossary search narrows entries and shows an empty state', async ({ page }) => {
  await open(page, '/glossary/');
  const entries = page.locator('.glossary-entry');
  const total = await entries.count();
  expect(total).toBeGreaterThan(10);
  await page.locator('[data-glossary-search]').fill('گاوس');
  const visible = await page.locator('.glossary-entry:not([hidden])').count();
  expect(visible).toBeGreaterThan(0);
  expect(visible).toBeLessThan(total);
  await page.locator('[data-glossary-search]').fill('بنی‌بنی‌بنی');
  await expect(page.locator('[data-glossary-empty]')).toBeVisible();
});

test('bookmarks persist and appear in the progress panel', async ({ page }) => {
  await open(page, '/concept/coulomb/');
  const button = page.locator('[data-bookmark="coulomb"]');
  await expect(button).toHaveAttribute('aria-pressed', 'false');
  await button.click();
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  await open(page, '/concepts/');
  await page.locator('[data-progress-toggle]').click();
  await expect(page.locator('.progress-list')).toContainText('۱');
  await open(page, '/concept/coulomb/');
  await expect(page.locator('[data-bookmark="coulomb"]')).toHaveAttribute('aria-pressed', 'true');
});

test('keyboard users can reach the search dialog and close it again', async ({ page }) => {
  await open(page, '/');
  await page.keyboard.press('/');
  await expect(page.locator('.search-panel')).toBeVisible();
  await page.keyboard.type('خازن');
  await expect(page.locator('.search-result').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('.search-dialog')).toBeHidden();
  // focus returns to the trigger instead of being stranded on the hidden input
  await expect(page.locator('[data-search-open]')).toBeFocused();
});

test('recently studied concepts come back on the dashboard', async ({ page }) => {
  await open(page, '/concept/coulomb/');
  await open(page, '/concept/electric-field/');
  await open(page, '/');
  const trail = page.locator('[data-recent-list]');
  await expect(trail).toBeVisible();
  const links = trail.locator('.recent-list a');
  await expect(links).toHaveCount(2);
  await expect(links.first()).toContainText('میدان الکتریکی');
  await links.last().click();
  await expect(page).toHaveURL(/concept\/coulomb\//);
});
