/** Magnetism figures: charge motion in a field, force on a wire, coil torque, field sources. */
import { MU_0 } from '../../physics/constants.ts';
import {
  coilTorque,
  cyclotronPeriod,
  cyclotronRadius,
  helixPitch,
  loopCentreField,
  lorentzForceMagnitude,
  solenoidField,
  wireField,
  wireForce,
} from '../../physics/magnetism.ts';
import { createLoop, fa, fmt, prefersReducedMotion } from '../dom.ts';
import { arrow, button, clear, createStage, grid, label, plotCurve, plotFrame, readoutList, segmented, slider } from './kit.ts';

const MAGENTA = '#d2266f';
const TEAL = '#0e8f80';

const controlHost = (stage: HTMLElement): HTMLElement => {
  const host = stage.closest('.sim-tile, .sim-figure, .sim') ?? stage;
  const panel = document.createElement('div');
  panel.className = 'sim-controls';
  host.append(panel);
  return panel;
};

/* -------------------------------------------------------- magnetic-motion */

export function mountMagneticMotion(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 460, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { q: 1.602e-19, mass: 9.109e-31, v: 1e6, theta: 45, field: 0.5, t: 0 };
  const trail: { x: number; y: number }[] = [];

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const { context, origin } = stage;
    // field band (into/out of the page shown as ⊗ markers)
    context.fillStyle = 'rgba(210,38,111,0.06)';
    context.fillRect(30, 40, stage.width - 60, stage.height - 80);
    context.strokeStyle = MAGENTA;
    context.lineWidth = 1.2;
    for (let x = 60; x < stage.width - 40; x += 54) {
      for (let y = 70; y < stage.height - 50; y += 54) {
        context.beginPath();
        context.arc(x, y, 6, 0, Math.PI * 2);
        context.moveTo(x - 4, y - 4);
        context.lineTo(x + 4, y + 4);
        context.stroke();
      }
    }
    label(stage, 'B ⊗ صفحه', stage.width - 90, 60, MAGENTA, 11);

    const theta = (state.theta * Math.PI) / 180;
    const radius = cyclotronRadius(state.mass, state.v * Math.sin(theta), state.q, state.field);
    const period = cyclotronPeriod(state.mass, state.q, state.field);
    const parallelSpeed = state.v * Math.cos(theta);
    const pitch = helixPitch(parallelSpeed, period);
    const centre = { x: origin.x - 60, y: origin.y + 60 };
    const radiusPx = Math.max(10, Math.min(160, radius * stage.scale));
    const pitchPx = Math.max(0, Math.min(150, pitch * stage.scale));
    const omega = (2 * Math.PI) / Math.max(period, 1e-12);

    // trail
    context.strokeStyle = 'rgba(33,38,86,0.55)';
    context.lineWidth = 2;
    context.beginPath();
    trail.forEach((point, index) => (index === 0 ? context.moveTo(point.x, point.y) : context.lineTo(point.x, point.y)));
    context.stroke();

    const phase = prefersReducedMotion() ? 0.6 : state.t;
    const head = {
      x: centre.x + radiusPx * Math.cos(phase * omega),
      y: centre.y - radiusPx * Math.sin(phase * omega) - (phase * pitchPx) / Math.max(1, period * 1e9) * 1e9 * 0,
    };
    void pitchPx;
    const particleY = centre.y + radiusPx * Math.sin(phase * omega);
    const particle = { x: centre.x + radiusPx * Math.cos(phase * omega), y: particleY - pitchPx };
    context.fillStyle = state.q > 0 ? '#e13b2b' : '#1e7be8';
    context.beginPath();
    context.arc(particle.x, particle.y, 6, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = 'rgba(25,26,46,0.3)';
    context.setLineDash([4, 4]);
    context.beginPath();
    context.arc(centre.x, centre.y, radiusPx, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);
    label(stage, 'مرکز دایره', centre.x, centre.y + 22, '#4a4e6a', 11);
    if (pitchPx > 0) label(stage, 'گام مارپیچ', centre.x - radiusPx - 46, centre.y, '#4a4e6a', 11);

    const force = lorentzForceMagnitude(state.q, state.v, state.field, theta);
    readout.set('نیروی مغناطیسی F', `${fmt(force)} N`);
    readout.set('شعاع مسیر r', `${fmt(radius * 100, 4)} cm`);
    readout.set('دوره T', `${fmt(period * 1e9, 4)} ns`);
    readout.set('فرکانس زاویه‌ای ω', `${fmt(omega, 4)} rad/s`);
    readout.set('گام مارپیچ', `${fmt(pitch * 100, 4)} cm`);
    readout.set('θ = ۹۰ درجه', state.theta === 90 ? 'مسیر دایره‌ای (بدون گام)' : 'مسیر مارپیچی');
    readout.set('θ = ۰ درجه', state.theta === 0 ? 'نیرو صفر؛ حرکت مستقیم' : `نیرو ${fmt(Math.sin(theta) * 100, 3)}٪ بیشینه`);
    void head;
  };

  const loop = createLoop((delta) => {
    state.t += delta;
    paint();
  });
  loop.start();

  button(panel, { label: 'بازنشانی مسیر', onClick: () => { state.t = 0; trail.length = 0; paint(); } });
  slider(panel, { label: 'اندازه‌ی بار |q|', min: 1, max: 5, step: 0.5, value: 1.602, unit: '×۱۰⁻¹⁹ C', onInput: (value) => { state.q = value * 1e-19; paint(); } });
  slider(panel, { label: 'جرم m', min: 0.5, max: 3, step: 0.1, value: 9.109, unit: '×۱۰⁻³¹ kg', format: (value) => `${fmt(value, 4)}×۱۰⁻³¹`, onInput: (value) => { state.mass = value * 1e-31; paint(); } });
  slider(panel, { label: 'سرعت v', min: 0.2, max: 4, step: 0.2, value: 1, unit: '×۱۰⁶ m/s', format: (value) => `${fmt(value, 3)}×۱۰⁶`, onInput: (value) => { state.v = value * 1e6; paint(); } });
  slider(panel, { label: 'زاویه‌ی θ با میدان', min: 0, max: 90, step: 1, value: 45, unit: '°', onInput: (value) => { state.theta = value; paint(); } });
  slider(panel, { label: 'میدان B', min: 0.05, max: 2, step: 0.05, value: state.field, unit: 'T', onInput: (value) => { state.field = value; paint(); } });
  paint();
}

/* ------------------------------------------------------------- wire-torque */

export function mountWireTorque(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 420, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { current: 4, length: 0.3, field: 0.6, theta: 30, turns: 50, area: 0.02, animate: true };
  let phase = 0;

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const { context, origin } = stage;
    context.fillStyle = 'rgba(210,38,111,0.05)';
    context.fillRect(30, 40, stage.width - 60, stage.height - 80);
    for (let x = 60; x < stage.width - 40; x += 52) {
      context.strokeStyle = MAGENTA;
      context.lineWidth = 1.2;
      context.beginPath();
      context.moveTo(x - 5, 50);
      context.lineTo(x + 5, 60);
      context.moveTo(x + 5, 50);
      context.lineTo(x - 5, 60);
      context.stroke();
    }
    label(stage, 'B ⊗', stage.width - 78, 60, MAGENTA, 11);

    // current-carrying wire
    context.strokeStyle = '#ea580c';
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(origin.x - 190, origin.y + 70);
    context.lineTo(origin.x + 190, origin.y + 70);
    context.stroke();
    arrow(stage, { x: origin.x - 150, y: origin.y + 96 }, { x: origin.x - 90, y: origin.y + 96 }, { color: '#ea580c', labelText: 'I' });
    label(stage, `L = ${fmt(state.length * 100, 3)} cm`, origin.x, origin.y + 108, '#4a4e6a', 11);

    // coil with torque
    const angle = ((state.theta + (state.animate && !prefersReducedMotion() ? phase * 24 : 0)) * Math.PI) / 180;
    const radiusPx = 58;
    const projected = radiusPx * Math.cos(angle);
    context.strokeStyle = '#0e8f80';
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(origin.x, origin.y - 20, Math.max(8, projected), radiusPx, 0, 0, Math.PI * 2);
    context.stroke();
    context.beginPath();
    context.moveTo(origin.x, origin.y - 20 - radiusPx);
    context.lineTo(origin.x, origin.y - 20 + radiusPx);
    context.stroke();
    arrow(stage, { x: origin.x, y: origin.y - 20 }, { x: origin.x, y: origin.y - 20 - 70 }, { color: TEAL, labelText: 'μ = NIA' });
    label(stage, 'μ', origin.x + 12, origin.y - 100, TEAL, 12);

    const force = wireForce(state.current, state.length, state.field, angle);
    const torque = coilTorque(state.turns, state.current, state.area, state.field, angle);
    readout.set('نیروی سیم F = ILB sinθ', `${fmt(force)} N`);
    readout.set('گشتاور τ = NIAB sinθ', `${fmt(torque * 1e3, 4)} mN·m`);
    readout.set('گشتاور مغناطیسی μ = NIA', `${fmt(state.turns * state.current * state.area, 4)  } A·m²`);
    readout.set('بیشینه‌ی نیرو', state.theta === 90 ? 'θ = ۹۰°: نیرو بیشینه ✔' : `θ = ۹۰° می‌شود تا نیرو بیشینه شود`);
    readout.set('بیشینه‌ی گشتاور', state.theta === 90 ? 'θ = ۹۰°: گشتاور بیشینه ✔' : 'میدان و صفحه‌ی حلقه عمود شوند');
  };

  segmented(panel, {
    label: 'حالت',
    value: 'live',
    options: [
      { id: 'live', label: 'چرخش زنده' },
      { id: 'fixed', label: 'زاویه‌ی ثابت' },
    ],
    onChange: (id) => {
      state.animate = id === 'live';
      paint();
    },
  });
  slider(panel, { label: 'جریان I', min: 0.5, max: 10, step: 0.5, value: state.current, unit: 'A', onInput: (value) => { state.current = value; paint(); } });
  slider(panel, { label: 'طول سیم L', min: 0.05, max: 0.6, step: 0.05, value: state.length, unit: 'm', onInput: (value) => { state.length = value; paint(); } });
  slider(panel, { label: 'میدان B', min: 0.1, max: 2, step: 0.1, value: state.field, unit: 'T', onInput: (value) => { state.field = value; paint(); } });
  slider(panel, { label: 'زاویه‌ی θ', min: 0, max: 90, step: 1, value: state.theta, unit: '°', onInput: (value) => { state.theta = value; paint(); } });
  slider(panel, { label: 'تعداد دور N', min: 5, max: 200, step: 5, value: state.turns, onInput: (value) => { state.turns = value; paint(); } });
  slider(panel, { label: 'مساحت حلقه A', min: 0.005, max: 0.05, step: 0.005, value: state.area, unit: 'm²', onInput: (value) => { state.area = value; paint(); } });
  createLoop((delta) => {
    phase += delta;
    paint();
  }).start();
  paint();
}

/* -------------------------------------------------------------- b-field-lab */

export function mountBFieldLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 460, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { source: 'wire' as 'wire' | 'loop' | 'solenoid', current: 4, radius: 0.08, distance: 0.12, turns: 200, length: 0.25 };

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const { context, origin } = stage;

    if (state.source === 'wire') {
      context.strokeStyle = '#ea580c';
      context.lineWidth = 7;
      context.beginPath();
      context.moveTo(origin.x, 40);
      context.lineTo(origin.x, stage.height - 40);
      context.stroke();
      arrow(stage, { x: origin.x - 90, y: 60 }, { x: origin.x - 90, y: 120 }, { color: '#ea580c', labelText: 'I' });
      const circles = [40, 70, 100, 130, 160];
      for (const radiusPx of circles) {
        context.strokeStyle = 'rgba(210,38,111,0.5)';
        context.lineWidth = 1.4;
        context.beginPath();
        context.arc(origin.x, origin.y, radiusPx, 0, Math.PI * 2);
        context.stroke();
        // direction markers
        for (let angle = 0; angle < 360; angle += 90) {
          const rad = (angle * Math.PI) / 180;
          const x = origin.x + radiusPx * Math.cos(rad);
          const y = origin.y + radiusPx * Math.sin(rad);
          context.fillStyle = MAGENTA;
          context.beginPath();
          context.arc(x, y, 3, 0, Math.PI * 2);
          context.fill();
        }
      }
      // Ampère loop
      const loopRadius = state.distance * stage.scale;
      context.setLineDash([6, 4]);
      context.strokeStyle = TEAL;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(origin.x, origin.y, loopRadius, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      label(stage, 'مسیر آمپری', origin.x + loopRadius + 6, origin.y + loopRadius + 18, TEAL, 11);
      const field = wireField(state.current, state.distance);
      readout.set('میدان در فاصله‌ی r', `${fmt(field * 1e6, 4)} µT`);
      readout.set('قانون', 'B = μ₀I/(۲πr) — افت با ۱/r');
      readout.set('مسیر آمپری', `∮B·dl = ${fmt(2 * Math.PI * state.distance * field, 6)} = μ₀·I = ${fmt(MU_0 * state.current, 6)} T·m`);
    }

    if (state.source === 'loop') {
      const radiusPx = state.radius * stage.scale;
      context.strokeStyle = '#ea580c';
      context.lineWidth = 6;
      context.beginPath();
      context.arc(origin.x, origin.y, radiusPx, 0, Math.PI * 2);
      context.stroke();
      for (const radius of [radiusPx + 26, radiusPx + 52, radiusPx + 78]) {
        context.strokeStyle = 'rgba(210,38,111,0.5)';
        context.lineWidth = 1.4;
        context.beginPath();
        context.arc(origin.x, origin.y, radius, 0, Math.PI * 2);
        context.stroke();
      }
      arrow(stage, { x: origin.x, y: origin.y - radiusPx }, { x: origin.x, y: origin.y - radiusPx - 40 }, { color: '#ea580c', labelText: 'I' });
      label(stage, `R = ${fmt(state.radius * 100, 3)} cm`, origin.x, origin.y + radiusPx + 22, '#4a4e6a', 11);
      const field = loopCentreField(state.current, state.radius);
      readout.set('میدان مرکز حلقه', `${fmt(field * 1e6, 4)} µT`);
      readout.set('قانون', 'B = μ₀I/(۲R) — برای N دور: μ₀NI/(۲R)');
      readout.set('رفتار با فاصله', 'مثل بار نقطه‌ای: افت با ۱/r²');
    }

    if (state.source === 'solenoid') {
      const width = state.length * stage.scale * 1.6;
      const height = 120;
      context.fillStyle = 'rgba(234,88,12,0.12)';
      context.fillRect(origin.x - width / 2, origin.y - height / 2, width, height);
      context.strokeStyle = '#ea580c';
      context.lineWidth = 3;
      context.strokeRect(origin.x - width / 2, origin.y - height / 2, width, height);
      const turns = 14;
      for (let index = 0; index < turns; index++) {
        const x = origin.x - width / 2 + ((index + 0.5) * width) / turns;
        context.beginPath();
        context.arc(x, origin.y, height / 2, Math.PI, 0, true);
        context.stroke();
      }
      // internal field arrows
      for (let index = 0; index < 6; index++) {
        const x = origin.x - width / 2 + 20 + index * ((width - 40) / 5);
        arrow(stage, { x, y: origin.y }, { x: x + 26, y: origin.y }, { color: TEAL });
      }
      label(stage, `N = ${fa(state.turns)} دور در L = ${fmt(state.length * 100, 3)} cm`, origin.x, origin.y + height / 2 + 22, '#4a4e6a', 11);
      const field = solenoidField(state.turns, state.length, state.current);
      readout.set('میدان داخل سلونوئید', `${fmt(field * 1e3, 4)} mT`);
      readout.set('چگالی دور n = N/L', `${fa(Math.round(state.turns / state.length))} دور بر متر`);
      readout.set('قانون', 'B = μ₀nI — داخل قوی، بیرون صفر');
    }

    // B(r) graph for the wire case
    if (state.source === 'wire') {
      const frame = plotFrame(stage, { origin: { x: 430, y: 70 }, size: { w: 200, h: 150 } });
      const xMax = 0.3;
      plotCurve(
        stage,
        Array.from({ length: 40 }, (_, index) => {
          const r = 0.02 + (index / 39) * (xMax - 0.02);
          return { x: r, y: wireField(state.current, r) * 1e6 };
        }),
        { origin: frame.origin, size: frame.size, xMax, yMax: wireField(state.current, 0.02) * 1e6, color: MAGENTA },
      );
      label(stage, 'B بر حسب r', frame.origin.x + frame.size.w / 2, frame.origin.y - 14, '#4a4e6a', 11);
      const markerX = frame.origin.x + (state.distance / xMax) * frame.size.w;
      context.fillStyle = MAGENTA;
      context.beginPath();
      context.arc(markerX, frame.origin.y + frame.size.h - (wireField(state.current, state.distance) * 1e6) / (wireField(state.current, 0.02) * 1e6) * frame.size.h, 4, 0, Math.PI * 2);
      context.fill();
    }
  };

  segmented(panel, {
    label: 'منبع میدان',
    value: 'wire',
    options: [
      { id: 'wire', label: 'سیم مستقیم' },
      { id: 'loop', label: 'حلقه' },
      { id: 'solenoid', label: 'سلونوئید' },
    ],
    onChange: (id) => {
      state.source = id as 'wire' | 'loop' | 'solenoid';
      paint();
    },
  });
  slider(panel, { label: 'جریان I', min: 0.5, max: 10, step: 0.5, value: state.current, unit: 'A', onInput: (value) => { state.current = value; paint(); } });
  slider(panel, { label: 'فاصله از سیم / نقطه', min: 0.02, max: 0.3, step: 0.01, value: state.distance, unit: 'm', onInput: (value) => { state.distance = value; paint(); } });
  slider(panel, { label: 'شعاع حلقه R', min: 0.03, max: 0.2, step: 0.01, value: state.radius, unit: 'm', onInput: (value) => { state.radius = value; paint(); } });
  slider(panel, { label: 'تعداد دور N', min: 20, max: 500, step: 20, value: state.turns, onInput: (value) => { state.turns = value; paint(); } });
  slider(panel, { label: 'طول سلونوئید L', min: 0.05, max: 0.6, step: 0.01, value: state.length, unit: 'm', onInput: (value) => { state.length = value; paint(); } });
  paint();
}