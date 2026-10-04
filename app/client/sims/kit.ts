/** Shared building blocks for the interactive figures: canvas stage, controls and read-outs. */
import { el, fa, fmt, prefersReducedMotion } from '../dom.ts';

export interface Stage {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
  origin: { x: number; y: number };
}

const DPR_CAP = 2;

export interface StageOptions {
  width?: number;
  height?: number;
  scale?: number;
  /** Largest CSS width the figure may use; keeps small figures readable on wide screens. */
  maxWidth?: number;
}

export function createStage(host: HTMLElement, { width = 640, height = 420, scale = 260, maxWidth = 720 }: StageOptions = {}): Stage | null {
  host.textContent = '';
  const canvas = el('canvas', { class: 'sim-canvas', role: 'img' });
  // Size to the real container so the figure stays crisp instead of being upscaled by CSS.
  const available = host.clientWidth || width;
  const cssWidth = Math.round(Math.max(320, Math.min(maxWidth, available)));
  const cssHeight = Math.round((height / width) * cssWidth);
  canvas.width = cssWidth * DPR_CAP;
  canvas.height = cssHeight * DPR_CAP;
  canvas.style.width = `${cssWidth}px`;
  canvas.style.maxWidth = '100%';
  canvas.tabIndex = 0;
  canvas.setAttribute(
    'aria-label',
    canvas.dataset.label ?? 'شبیه‌سازی؛ نتیجه‌ی عددی دقیق در متن زیر تصویر آمده است.',
  );
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.scale(DPR_CAP, DPR_CAP);
  host.append(canvas);
  return {
    canvas,
    context,
    width: cssWidth,
    height: cssHeight,
    scale: (scale * cssWidth) / width,
    origin: { x: cssWidth / 2, y: cssHeight / 2 },
  };
}

export function clear(stage: Stage, background = '#fffdf6'): void {
  stage.context.fillStyle = background;
  stage.context.fillRect(0, 0, stage.width, stage.height);
}

/** Graph-paper background: the site's signature texture, drawn behind every figure. */
export function grid(stage: Stage, spacing = 24, strong = true): void {
  const { context, width, height } = stage;
  context.save();
  context.lineWidth = 1;
  context.strokeStyle = 'rgba(25, 26, 46, 0.06)';
  for (let x = spacing / 2; x < width; x += spacing) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  for (let y = spacing / 2; y < height; y += spacing) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
  if (strong) {
    context.strokeStyle = 'rgba(25, 26, 46, 0.18)';
    context.beginPath();
    context.moveTo(stage.origin.x, 0);
    context.lineTo(stage.origin.x, height);
    context.moveTo(0, stage.origin.y);
    context.lineTo(width, stage.origin.y);
    context.stroke();
  }
  context.restore();
}

export function label(stage: Stage, text: string, x: number, y: number, color = '#4a4e6a', size = 12): void {
  const { context } = stage;
  context.save();
  context.fillStyle = color;
  context.font = `600 ${size}px Vazirmatn Variable, system-ui, sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, x, y);
  context.restore();
}

export function chargeDot(
  stage: Stage,
  point: { x: number; y: number },
  value: number,
  { radius = 13, labelText }: { radius?: number; labelText?: string } = {},
): void {
  const { context } = stage;
  const x = stage.origin.x + point.x * stage.scale;
  const y = stage.origin.y - point.y * stage.scale;
  const positive = value >= 0;
  context.save();
  const glow = context.createRadialGradient(x, y, 2, x, y, radius * 2.6);
  const rgb = positive ? '225, 59, 43' : '30, 123, 232';
  glow.addColorStop(0, `rgba(${rgb}, 0.32)`);
  glow.addColorStop(1, `rgba(${rgb}, 0)`);
  context.fillStyle = glow;
  context.beginPath();
  context.arc(x, y, radius * 2.6, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = positive ? '#e13b2b' : '#1e7be8';
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#fffdf6';
  context.font = '600 15px Vazirmatn Variable, system-ui, sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(labelText ?? (positive ? '+' : '−'), x, y + 1);
  context.restore();
}

export function arrow(
  stage: Stage,
  from: { x: number; y: number },
  to: { x: number; y: number },
  { color = '#4c35d6', width = 2.2, head = 8, dashed = false, labelText }: { color?: string; width?: number; head?: number; dashed?: boolean; labelText?: string } = {},
): void {
  const { context } = stage;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy);
  if (length < 1) return;
  const ux = dx / length;
  const uy = dy / length;
  context.save();
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = width;
  if (dashed) context.setLineDash([5, 4]);
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x - ux * head * 0.6, to.y - uy * head * 0.6);
  context.stroke();
  context.setLineDash([]);
  context.beginPath();
  context.moveTo(to.x, to.y);
  context.lineTo(to.x - ux * head - uy * head * 0.5, to.y - uy * head + ux * head * 0.5);
  context.lineTo(to.x - ux * head + uy * head * 0.5, to.y - uy * head - ux * head * 0.5);
  context.closePath();
  context.fill();
  context.restore();
  if (labelText) label(stage, labelText, (from.x + to.x) / 2 + 12, (from.y + to.y) / 2 - 12, color, 12);
}

export function plate(
  stage: Stage,
  x1: number,
  x2: number,
  { fill = 'rgba(76, 53, 214, 0.08)', stroke = '#4c35d6', labelText }: { fill?: string; stroke?: string; labelText?: string } = {},
): void {
  const { context } = stage;
  context.save();
  context.fillStyle = fill;
  context.strokeStyle = stroke;
  context.lineWidth = 2;
  context.beginPath();
  context.rect(Math.min(x1, x2), 34, Math.abs(x2 - x1), stage.height - 68);
  context.fill();
  context.stroke();
  context.restore();
  if (labelText) label(stage, labelText, (x1 + x2) / 2, 24, stroke, 12);
}

/* -------------------------------------------------------------- controls */

export interface Control {
  root: HTMLElement;
  refresh?: () => void;
}

/** Panels live next to the figure, not inside the drawing area. */
function panelHost(stage: HTMLElement): HTMLElement {
  return stage.closest('.sim-tile, .sim-figure, .sim') ?? stage;
}

export function controlPanel(stage: HTMLElement): HTMLElement {
  const host = panelHost(stage);
  let panel = host.querySelector<HTMLElement>(':scope > .sim-controls');
  if (!panel) {
    panel = el('div', { class: 'sim-controls' });
    host.append(panel);
  }
  return panel;
}

export function readouts(stage: HTMLElement): HTMLElement {
  const host = panelHost(stage);
  let box = host.querySelector<HTMLElement>(':scope > .sim-readouts');
  if (!box) {
    box = el('div', { class: 'sim-readouts' });
    host.append(box);
  }
  return box;
}

export interface SliderOptions {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit?: string;
  format?: (value: number) => string;
  onInput: (value: number) => void;
}

export function slider(panel: HTMLElement, options: SliderOptions): Control {
  const id = `sim-${Math.random().toString(36).slice(2, 8)}`;
  const wrapper = el('div', { class: 'sim-control' });
  const labelNode = el('label', { for: id, class: 'sim-control-label' });
  const valueNode = el('span', { class: 'sim-control-value' });
  labelNode.append(document.createTextNode(options.label), valueNode);
  const input = el('input', { type: 'range', id, min: String(options.min), max: String(options.max), step: String(options.step), value: String(options.value) });
  const paint = () => {
    valueNode.textContent = options.format ? options.format(Number(input.value)) : `${fmt(Number(input.value), 3)}${options.unit ? ` ${options.unit}` : ''}`;
  };
  input.addEventListener('input', () => {
    paint();
    options.onInput(Number(input.value));
  });
  paint();
  wrapper.append(labelNode, input);
  panel.append(wrapper);
  return {
    root: wrapper,
    refresh: () => {
      input.value = String(options.value);
      paint();
    },
  };
}

export function segmented(
  panel: HTMLElement,
  { label, options, value, onChange }: { label: string; options: { id: string; label: string }[]; value: string; onChange: (id: string) => void },
): Control {
  const wrapper = el('div', { class: 'sim-control' });
  const group = el('div', { class: 'segmented', role: 'group', 'aria-label': label });
  const buttons: HTMLButtonElement[] = [];
  for (const option of options) {
    const button = el('button', { type: 'button', class: `segment ${option.id === value ? 'is-active' : ''}`, text: option.label });
    button.addEventListener('click', () => {
      for (const other of buttons) other.classList.toggle('is-active', other === button);
      onChange(option.id);
    });
    buttons.push(button);
    group.append(button);
  }
  wrapper.append(el('span', { class: 'sim-control-label', text: label }), group);
  panel.append(wrapper);
  return { root: wrapper };
}

export function toggle(
  panel: HTMLElement,
  { label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void },
): Control {
  const wrapper = el('div', { class: 'sim-control sim-control-inline' });
  const input = el('input', { type: 'checkbox', id: `sim-toggle-${Math.random().toString(36).slice(2, 6)}` });
  input.checked = value;
  input.addEventListener('change', () => onChange(input.checked));
  const labelNode = el('label', { for: input.id, text: label });
  wrapper.append(input, labelNode);
  panel.append(wrapper);
  return { root: wrapper };
}

export function button(panel: HTMLElement, { label, onClick }: { label: string; onClick: () => void }): Control {
  const node = el('button', { type: 'button', class: 'ghost-button', text: label });
  node.addEventListener('click', onClick);
  panel.append(node);
  return { root: node };
}

export interface Readout {
  set: (label: string, value: string, tone?: 'ok' | 'warn' | 'muted') => void;
}

export function readoutList(host: HTMLElement): Readout {
  const box = readouts(host);
  box.textContent = '';
  return {
    set(label, value, tone = 'muted') {
      let row = box.querySelector<HTMLElement>(`[data-readout="${CSS.escape(label)}"]`);
      if (!row) {
        row = el('div', { class: 'sim-readout', 'data-readout': label });
        row.append(el('span', { class: 'sim-readout-label', text: label }), el('strong', { class: 'sim-readout-value' }));
        box.append(row);
      }
      row.dataset.tone = tone;
      row.querySelector('strong')!.textContent = value;
    },
  };
}

/** Simple 2D plot frame shared by the graph-based figures. */
export function plotFrame(
  stage: Stage,
  { origin = { x: 60, y: 40 }, size = { w: 250, h: 180 } } = {},
): { origin: { x: number; y: number }; size: { w: number; h: number } } {
  const { context } = stage;
  context.save();
  context.strokeStyle = 'rgba(25, 26, 46, 0.35)';
  context.lineWidth = 1.4;
  context.strokeRect(origin.x, origin.y, size.w, size.h);
  context.restore();
  label(stage, 't', origin.x + size.w - 6, origin.y + size.h + 12, '#4a4e6a', 11);
  label(stage, 'y', origin.x - 16, origin.y + 8, '#4a4e6a', 11);
  return { origin, size };
}

export function plotCurve(
  stage: Stage,
  points: { x: number; y: number }[],
  { origin, size, xMax, yMax, color = '#4c35d6', width = 2.4, dashed = false }: { origin: { x: number; y: number }; size: { w: number; h: number }; xMax: number; yMax: number; color?: string; width?: number; dashed?: boolean },
): void {
  const { context } = stage;
  context.save();
  context.strokeStyle = color;
  context.lineWidth = width;
  if (dashed) context.setLineDash([6, 4]);
  context.beginPath();
  points.forEach((point, index) => {
    const px = origin.x + (point.x / xMax) * size.w;
    const py = origin.y + size.h - (point.y / yMax) * size.h;
    if (index === 0) context.moveTo(px, py);
    else context.lineTo(px, py);
  });
  context.stroke();
  context.restore();
}

export const motionOK = () => !prefersReducedMotion();

export const faNum = fa;