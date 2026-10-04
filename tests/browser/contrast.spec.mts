import { expect, test } from '@playwright/test';

/**
 * WCAG 2.2 AA contrast regression. Every text role is measured in the rendered page from computed
 * styles and the real painted background, instead of being asserted from the token table.
 */
const TARGETS: Record<string, { selector: string; page: string }> = {
  'body paragraph': { selector: 'article p', page: '/concept/coulomb/' },
  'h1 title': { selector: '.concept-head h1', page: '/concept/coulomb/' },
  'h2 section heading': { selector: '.layer > h2', page: '/concept/coulomb/' },
  'meta / hint text': { selector: '.concept-effort', page: '/concept/coulomb/' },
  'part pill': { selector: '.pill-part', page: '/concept/coulomb/' },
  'origin pill': { selector: '.pill-origin', page: '/concept/coulomb/' },
  'breadcrumb link': { selector: '.breadcrumbs a', page: '/concept/coulomb/' },
  'primary button label': { selector: '.primary-button', page: '/concept/coulomb/' },
  'rescue button label': { selector: '.tool-button-alert', page: '/concept/coulomb/' },
  'symbol description': { selector: '.symbol-meaning', page: '/concept/coulomb/' },
  'figure read-out label': { selector: '.sim-readout-label', page: '/concept/coulomb/' },
  'footer note': { selector: '.footer-note', page: '/concept/coulomb/' },
  'table-of-contents link': { selector: '.toc a', page: '/concept/coulomb/' },
  'ladder step title': { selector: '.ladder-body strong', page: '/' },
  'hero stat value': { selector: '.hero-stats dd', page: '/' },
};

const measure = (selector: string) => {
  const el = document.querySelector(selector);
  if (!el) return null;
  const luminance = (rgb: number[]) => {
    const [r, g, b] = rgb.map((value) => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (value: string) => {
    const numbers = (value.match(/[\d.]+/g) ?? []).map(Number);
    if (value.startsWith('color(')) return numbers.slice(0, 3).map((n) => n * 255);
    return numbers.slice(0, 3);
  };
  const background = (() => {
    let node: Element | null = el;
    while (node) {
      const value = getComputedStyle(node).backgroundColor;
      if (value && !/rgba\(0, 0, 0, 0\)|transparent/.test(value)) return parse(value);
      node = node.parentElement;
    }
    return [255, 255, 255];
  })();
  const styles = getComputedStyle(el);
  const size = parseFloat(styles.fontSize);
  const weight = Number(styles.fontWeight) || 400;
  const large = size >= 24 || (size >= 18.66 && weight >= 700);
  const l1 = luminance(parse(styles.color));
  const l2 = luminance(background);
  return {
    ratio: Number(((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2)),
    size,
    required: large ? 3 : 4.5,
  };
};

test('every text role meets WCAG 2.2 AA contrast', async ({ page }) => {
  const failures: string[] = [];
  let current = '';
  for (const [name, target] of Object.entries(TARGETS)) {
    if (current !== target.page) {
      current = target.page;
      await page.goto(target.page.replace(/^\//, ''));
      await page.locator('body[data-app-ready="true"]').waitFor();
    }
    const measured = await page.evaluate(measure, target.selector);
    if (!measured) {
      failures.push(`${name}: selector ${target.selector} not found on ${target.page}`);
      continue;
    }
    if (measured.ratio < measured.required) {
      failures.push(`${name}: ${measured.ratio}:1 is below the required ${measured.required}:1 at ${measured.size}px`);
    }
  }
  expect(failures, failures.join('\n')).toEqual([]);
});

/**
 * The phone menu trigger is the one header control that repaints itself when its state changes: open,
 * it swaps to a tinted fill with darker ink, and the sheet below it adds a marked row for the current
 * section. Those pairs only exist in the phone layout, so they are measured there and in both states.
 */
test('the phone menu trigger and its sheet meet contrast in both states', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 780 });
  await page.goto('formulas/');
  await page.locator('body[data-app-ready="true"]').waitFor();

  const failures: string[] = [];
  const check = async (name: string, selector: string) => {
    const measured = await page.evaluate(measure, selector);
    if (!measured) {
      failures.push(`${name}: ${selector} was not painted`);
      return;
    }
    if (measured.ratio < measured.required) {
      failures.push(`${name}: ${measured.ratio}:1 is below the required ${measured.required}:1 at ${measured.size}px`);
    }
  };

  await check('closed menu trigger', '[data-nav-toggle]');
  await page.locator('[data-nav-toggle]').click();
  // The open state swaps background colour over 120 ms; measuring mid-transition would read an
  // interpolated colour, so the measurement waits for the transition that is actually running.
  await page.evaluate(async () => {
    const toggle = document.querySelector('[data-nav-toggle]')!;
    await Promise.all(toggle.getAnimations().map((animation) => animation.finished.catch(() => {})));
  });
  await check('open menu trigger', '[data-nav-toggle]');
  await check('current section in the sheet', '#site-nav-panel .nav-link.is-active');

  expect(failures, failures.join('\n')).toEqual([]);
});
