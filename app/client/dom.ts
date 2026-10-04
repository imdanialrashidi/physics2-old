/** Small DOM helpers shared by the client modules. */

export const q = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T | null =>
  root.querySelector<T>(selector);

export const qa = <T extends Element = HTMLElement>(selector: string, root: ParentNode = document): T[] =>
  Array.from(root.querySelectorAll<T>(selector));

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attributes: Record<string, string> = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attributes)) {
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key === 'html') node.innerHTML = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
}

/** Persian digits for numbers shown in the interface. */
const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
export const fa = (value: number | string): string => String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)] ?? digit);

/** Formats a number for physics read-outs (keeps significant digits, no locale surprises). */
export function fmt(value: number, digits = 3): string {
  if (!Number.isFinite(value)) return '—';
  const magnitude = Math.abs(value);
  if (magnitude !== 0 && (magnitude < 1e-3 || magnitude >= 1e5)) {
    const exponent = Math.floor(Math.log10(magnitude));
    const mantissa = value / 10 ** exponent;
    return `${fa(mantissa.toFixed(2))}×۱۰${superscript(exponent)}`;
  }
  return fa(Number(value.toPrecision(digits)));
}

const SUPERSCRIPT_DIGITS = '۰۱۲۳۴۵۶۷۸۹⁻⁺';
export function superscript(value: number): string {
  const sign = value < 0 ? '⁻' : '';
  return sign + String(Math.abs(value)).replace(/\d/g, (digit) => SUPERSCRIPT_DIGITS[Number(digit)] ?? digit);
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Shared animation loop that pauses when the tab is hidden or reduced motion is requested. */
export function createLoop(step: (deltaSeconds: number) => void) {
  let raf = 0;
  let last = performance.now();
  let running = true;
  const frame = (now: number) => {
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    step(delta);
    if (running) raf = requestAnimationFrame(frame);
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  return { start, stop, get running() { return running; } };
}

/** Normalises Persian/Arabic text for tolerant client-side search matching. */
export function normaliseSearch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ً-ٰٟ]/g, '')
    .replace(/[يى]/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit) < 0 ? digit : String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit))))
    .replace(/\s+/g, ' ')
    .trim();
}

export function announce(message: string): void {
  let region = q<HTMLElement>('#live-region');
  if (!region) {
    region = el('div', { id: 'live-region', class: 'sr-only', 'aria-live': 'polite' });
    document.body.append(region);
  }
  region.textContent = message;
}