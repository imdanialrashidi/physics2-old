/** Circuit and capacitor figures: drift velocity, resistor networks, RC response, capacitor lab. */
import {
  driftSpeed,
  loopCurrent,
  parallelResistance,
  powerFromVoltageResistance,
  rcCharging,
  rcDischarge,
  seriesResistance,
  temperatureAdjustedResistance,
  terminalVoltage,
  wireResistance,
} from '../../physics/circuits.ts';
import {
  energyStored,
  parallelCapacitance,
  parallelPlateCapacitance,
  seriesCapacitance,
  seriesVoltages,
} from '../../physics/potential.ts';
import { EPSILON_0 } from '../../physics/constants.ts';
import { createLoop, fa, fmt, prefersReducedMotion } from '../dom.ts';
import { arrow, button, clear, createStage, grid, label, plotCurve, plotFrame, readoutList, resetControl, segmented, slider } from './kit.ts';

const controlHost = (stage: HTMLElement): HTMLElement => {
  const host = stage.closest('.sim-tile, .sim-figure, .sim') ?? stage;
  const panel = document.createElement('div');
  panel.className = 'sim-controls';
  host.append(panel);
  return panel;
};

/* --------------------------------------------------------------- drift-lab */

export function mountDriftLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 660, height: 360, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { n: 8.5e28, area: 2e-6, voltage: 0.02, rho: 1.7e-8, length: 2 };
  let phase = 0;

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);
    const { context } = stage;
    // conductor body
    context.fillStyle = 'rgba(25,26,46,0.05)';
    context.fillRect(40, 120, stage.width - 80, 90);
    context.strokeStyle = 'rgba(25,26,46,0.35)';
    context.lineWidth = 2;
    context.strokeRect(40, 120, stage.width - 80, 90);
    label(stage, 'مقطع A', 60, 106, '#4a4e6a', 11);
    label(stage, 'L', stage.width - 60, 106, '#4a4e6a', 11);

    const current = loopCurrent(state.voltage, state.rho * state.length / state.area);
    const vDrift = driftSpeed(current, state.n, 1.602e-19, state.area);

    const electronCount = 16;
    for (let index = 0; index < electronCount; index++) {
      const base = 70 + index * ((stage.width - 140) / electronCount);
      const offset = prefersReducedMotion() ? 0 : ((phase * vDrift * 40) % ((stage.width - 140) / electronCount));
      const x = base + offset - ((stage.width - 140) / electronCount) / 2;
      if (x < 44 || x > stage.width - 44) continue;
      context.fillStyle = NEG;
      context.beginPath();
      context.arc(x, 165, 5, 0, Math.PI * 2);
      context.fill();
    }
    arrow(stage, { x: stage.width / 2, y: 236 }, { x: stage.width / 2 + 46, y: 236 }, { color: '#b45309', labelText: 'سرعت رانشی v_d' });
    arrow(stage, { x: 70, y: 236 }, { x: 70 + 40, y: 236 }, { color: VIOLET, labelText: 'جریان I' });
    label(stage, 'الکترون‌ها خیلی کند راه می‌روند؛ جهت جریان قراردادی خلاف حرکت آن‌هاست.', stage.width / 2, 290, '#4a4e6a', 11);

    const j = current / state.area;
    readout.set('جریان I', `${fmt(current, 4)} A`);
    readout.set('چگالی جریان J', `${fmt(j / 1e6, 3)} ×۱۰⁶ A/m²`);
    readout.set('سرعت رانشی v_d', `${fmt(vDrift * 1e6, 3)} µm/s`);
    readout.set('زمان عبور از سیم', `${fmt(state.length / vDrift, 3)} s`);
    readout.set('مقاومت سیم', `${fmt(wireResistance(state.rho, state.length, state.area), 4)} Ω`);
    readout.set('J = nqv_d', `${fmt(state.n / 1e28, 3)}×۱۰²۸ · q · ${fmt(vDrift * 1e6, 3)}×۱۰⁻⁶ = ${fmt(j / 1e6, 3)}×۱۰⁶`);
  };

  // step 0.5 so 8.5 is actually representable: with step 1 the browser snaps the default to 9 and
  // the figure silently starts from a different carrier density than its state declares.
  slider(panel, { label: 'چگالی حامل‌ها n', min: 1, max: 30, step: 0.5, value: 8.5, unit: '×۱۰²⁸ m⁻³', onInput: (value) => { state.n = value * 1e28; paint(); } });
  slider(panel, { label: 'سطح مقطع A', min: 0.5, max: 6, step: 0.5, value: 2, unit: 'mm²', onInput: (value) => { state.area = value * 1e-6; paint(); } });
  slider(panel, { label: 'ولتاژ دو سر سیم', min: 0.001, max: 0.2, step: 0.001, value: state.voltage, unit: 'V', format: (value) => `${fa(value)} V`, onInput: (value) => { state.voltage = value; paint(); } });
  slider(panel, { label: 'مقاومت ویژه ρ', min: 1e-8, max: 5e-8, step: 1e-9, value: state.rho, unit: 'Ω·m', format: (value) => `${fmt(value * 1e8, 3)}×۱۰⁻⁸`, onInput: (value) => { state.rho = value; paint(); } });
  const loop = createLoop((delta) => {
    phase += delta;
    paint();
  });
  loop.start();
  resetControl(panel, paint);
  paint();
}

/* ------------------------------------------------------------ circuit-lab */

export function mountCircuitLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 420, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { r1: 100, r2: 200, r3: 300, mode: 'series' as 'series' | 'parallel', emf: 12, r: 0.5, temperature: 20 };
  let phase = 0;

  const adjusted = (r: number) => temperatureAdjustedResistance(r, 0.0039, state.temperature);

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);
    const { context } = stage;
    const values = [adjusted(state.r1), adjusted(state.r2), adjusted(state.r3)];
    const equivalent = state.mode === 'series' ? seriesResistance(values) : parallelResistance(values);

    // loop frame
    context.strokeStyle = '#191a2e';
    context.lineWidth = 3;
    context.strokeRect(70, 90, stage.width - 140, 230);
    // battery symbol
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(70, 200);
    context.lineTo(100, 200);
    context.stroke();
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(100, 182);
    context.lineTo(100, 218);
    context.moveTo(110, 190);
    context.lineTo(110, 210);
    context.stroke();
    label(stage, `ε = ${fa(state.emf)} V`, 128, 178, '#191a2e', 11);

    const branchY = 200;
    const resistorWidth = 54;
    const positions = [240, 380, 520].slice(0, state.mode === 'series' ? 3 : 2);
    for (const x of positions) {
      context.fillStyle = '#ffd9a8';
      context.strokeStyle = '#191a2e';
      context.lineWidth = 2;
      context.fillRect(x, branchY - 16, resistorWidth, 32);
      context.strokeRect(x, branchY - 16, resistorWidth, 32);
      const rValue = values[positions.indexOf(x)]!;
      label(stage, `${fmt(rValue, 3)} Ω`, x + resistorWidth / 2, branchY, '#7a4a12', 11);
    }
    if (state.mode === 'parallel') {
      context.beginPath();
      context.moveTo(stage.width - 70, branchY);
      context.lineTo(stage.width - 70, branchY - 70);
      context.lineTo(200, branchY - 70);
      context.lineTo(200, branchY);
      context.stroke();
    }

    const current = loopCurrent(state.emf, equivalent, state.r);
    const vTerminal = terminalVoltage(state.emf, current, state.r);
    // charge dots moving along the loop
    if (!prefersReducedMotion()) {
      const speed = Math.min(46, 6 + current * 6);
      for (let index = 0; index < 10; index++) {
        const t = ((phase * speed) / (stage.width - 140) + index / 10) % 1;
        const x = 70 + t * (stage.width - 140);
        const y = t < 0.5 ? branchY : branchY;
        context.fillStyle = VIOLET;
        context.beginPath();
        context.arc(x, y, 4, 0, Math.PI * 2);
        context.fill();
      }
    }
    arrow(stage, { x: 180, y: 70 }, { x: 180 + 60, y: 70 }, { color: '#b45309', labelText: 'I' });

    const count = state.mode === 'series' ? 3 : 2;
    readout.set('مقاومت معادل', `${fmt(equivalent, 4)} Ω`);
    readout.set('جریان کل', `${fmt(current, 4)} A`);
    readout.set('ولتاژ ترمینال', `${fmt(vTerminal, 4)} V`);
    readout.set('افت روی مقاومت داخلی', `${fmt(current * state.r, 4)} V`);
    readout.set('توان کل', `${fmt(vTerminal * current, 4)} W`);
    for (let index = 0; index < count; index++) {
      const share = state.mode === 'series' ? current : vTerminal / values[index]!;
      readout.set(`مقاومت ${fa(index + 1)}: ولتاژ و توان`, `${fmt(values[index]! * share, 3)} V · ${fmt(powerFromVoltageResistance(values[index]! * share, values[index]!), 3)} W`);
    }
    readout.set('روابط', state.mode === 'series' ? 'سری: I ثابت، ولتاژ تقسیم می‌شود' : 'موازی: V ثابت، جریان تقسیم می‌شود');
  };

  segmented(panel, {
    label: 'نوع اتصال',
    value: 'series',
    options: [
      { id: 'series', label: 'سری' },
      { id: 'parallel', label: 'موازی' },
    ],
    onChange: (id) => {
      state.mode = id as 'series' | 'parallel';
      paint();
    },
  });
  slider(panel, { label: 'R₁', min: 10, max: 500, step: 10, value: state.r1, unit: 'Ω', onInput: (value) => { state.r1 = value; paint(); } });
  slider(panel, { label: 'R₂', min: 10, max: 500, step: 10, value: state.r2, unit: 'Ω', onInput: (value) => { state.r2 = value; paint(); } });
  slider(panel, { label: 'R₃', min: 10, max: 500, step: 10, value: state.r3, unit: 'Ω', onInput: (value) => { state.r3 = value; paint(); } });
  slider(panel, { label: 'نیروی محرکه ε', min: 1.5, max: 24, step: 0.5, value: state.emf, unit: 'V', onInput: (value) => { state.emf = value; paint(); } });
  slider(panel, { label: 'دمای سیم', min: 0, max: 200, step: 5, value: state.temperature, unit: '°C', onInput: (value) => { state.temperature = value; paint(); } });
  createLoop((delta) => {
    phase += delta;
    paint();
  }).start();
  resetControl(panel, paint);
  paint();
}

/* ----------------------------------------------------------------- rc-lab */

export function mountRcLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 460, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { r: 1000, c: 10, emf: 12, mode: 'charge' as 'charge' | 'discharge', t: 0, playing: true };
  let accumulator = 0;

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);
    const tau = state.r * state.c * 1e-3;
    const charging = rcCharging(tau, state.c * 1e-6, state.emf, state.t);
    const discharging = rcDischarge(tau, state.c * 1e-6 * state.emf, state.t);
    const q = state.mode === 'charge' ? charging.q : discharging.q;
    const v = state.mode === 'charge' ? charging.v : Math.abs(discharging.v);
    const i = Math.abs(state.mode === 'charge' ? charging.i : discharging.i);

    // capacitor plates
    const { context } = stage;
    const x0 = 150;
    const gap = 90;
    context.fillStyle = '#c9b8ff';
    context.fillRect(x0, 110, 16, 180);
    context.fillRect(x0 + gap, 110, 16, 180);
    label(stage, 'C', x0 + gap / 2, 90, '#4c35d6', 13);
    label(stage, 'R', x0 + gap / 2, 320, '#ea580c', 13);
    // resistor zigzag
    context.strokeStyle = '#ea580c';
    context.lineWidth = 3;
    context.beginPath();
    for (let index = 0; index <= 6; index++) {
      const x = x0 + gap + 40 + index * 18;
      const y = 200 + (index % 2 === 0 ? -18 : 18);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
    context.beginPath();
    context.moveTo(150, 200);
    context.lineTo(x0, 200);
    context.moveTo(x0 + 16, 200);
    context.lineTo(x0 + gap - 8, 200);
    context.stroke();
    // charge bars on plates
    const fraction = Math.max(0, Math.min(1, v / state.emf));
    context.fillStyle = VIOLET;
    context.fillRect(x0, 290 - fraction * 180, 16, fraction * 180);
    context.fillStyle = '#ffd166';
    context.fillRect(x0 + gap, 290 - (1 - fraction) * 180, 16, (1 - fraction) * 180);

    // curves
    const frame = plotFrame(stage, { origin: { x: 400, y: 70 }, size: { w: 240, h: 150 } });
    const tMax = 5 * tau;
    const voltageCurve = Array.from({ length: 60 }, (_, index) => {
      const t = (index / 59) * tMax;
      return { x: t, y: state.mode === 'charge' ? rcCharging(tau, state.c * 1e-6, state.emf, t).v : Math.abs(rcDischarge(tau, state.c * 1e-6 * state.emf, t).v) };
    });
    plotCurve(stage, voltageCurve, { origin: frame.origin, size: frame.size, xMax: tMax, yMax: state.emf, color: VIOLET });
    const currentCurve = Array.from({ length: 60 }, (_, index) => {
      const t = (index / 59) * tMax;
      return { x: t, y: Math.abs(state.mode === 'charge' ? rcCharging(tau, state.c * 1e-6, state.emf, t).i : rcDischarge(tau, state.c * 1e-6 * state.emf, t).i) };
    });
    plotCurve(stage, currentCurve, { origin: frame.origin, size: frame.size, xMax: tMax, yMax: state.emf / state.r, color: '#ea580c', dashed: true });
    label(stage, 'ولتاژ خازن', frame.origin.x + 60, frame.origin.y - 14, VIOLET, 11);
    label(stage, 'جریان', frame.origin.x + frame.size.w - 40, frame.origin.y - 14, '#ea580c', 11);

    // marker at current time and τ line
    const markerX = frame.origin.x + (state.t / tMax) * frame.size.w;
    context.strokeStyle = '#191a2e';
    context.lineWidth = 1.5;
    context.beginPath();
    context.moveTo(markerX, frame.origin.y);
    context.lineTo(markerX, frame.origin.y + frame.size.h);
    context.stroke();
    const tauX = frame.origin.x + (tau / tMax) * frame.size.w;
    context.setLineDash([4, 4]);
    context.strokeStyle = '#0e8f80';
    context.beginPath();
    context.moveTo(tauX, frame.origin.y);
    context.lineTo(tauX, frame.origin.y + frame.size.h);
    context.stroke();
    context.setLineDash([]);
    label(stage, 'τ', tauX, frame.origin.y + frame.size.h + 14, '#0e8f80', 11);

    readout.set('ثابت زمانی τ = RC', `${fmt(tau * 1000, 4)} ms`);
    readout.set('زمان', `${fmt(state.t * 1000, 3)} ms`);
    readout.set('بار q', `${fmt(q * 1e6, 4)} µC`);
    readout.set('ولتاژ خازن', `${fmt(v, 4)} V`);
    readout.set('جریان', `${fmt(i, 5)} A`);
    readout.set('در t = τ', state.mode === 'charge' ? '۶۳٪ شارژ انجام شده' : '۳۷٪ باقی مانده');
  };

  const step = (delta: number) => {
    if (!state.playing) return;
    accumulator += delta;
    const tau = state.r * state.c * 1e-3;
    while (accumulator > 0.01) {
      state.t += 0.01;
      accumulator -= 0.01;
    }
    if (state.t > 5 * tau) {
      state.t = 0;
      state.mode = state.mode === 'charge' ? 'discharge' : 'charge';
    }
    paint();
  };
  const loop = createLoop(step);
  loop.start();

  segmented(panel, {
    label: 'حالت',
    value: 'charge',
    options: [
      { id: 'charge', label: 'شارژ' },
      { id: 'discharge', label: 'تخلیه' },
    ],
    onChange: (id) => {
      state.mode = id as 'charge' | 'discharge';
      state.t = 0;
      paint();
    },
  });
  slider(panel, { label: 'مقاومت R', min: 100, max: 5000, step: 100, value: state.r, unit: 'Ω', onInput: (value) => { state.r = value; paint(); } });
  slider(panel, { label: 'خازن C', min: 1, max: 100, step: 1, value: state.c, unit: 'µF', onInput: (value) => { state.c = value; paint(); } });
  slider(panel, { label: 'ولتاژ باتری ε', min: 3, max: 24, step: 1, value: state.emf, unit: 'V', onInput: (value) => { state.emf = value; paint(); } });
  button(panel, { label: 'نمایش/توقف', onClick: () => { state.playing = !state.playing; if (state.playing) loop.start(); else loop.stop(); } });
  // One reset, not two: it restores R, C and ε and rewinds the clock, so the learner has a single
  // unambiguous way back to the start of the experiment.
  resetControl(panel, paint, 'بازنشانی', () => {
    state.t = 0;
    paint();
  });
  paint();
}

/* ----------------------------------------------------------- capacitor-lab */

export function mountCapacitorLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 440, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { area: 0.02, separation: 0.005, kappa: 1, voltage: 12, c1: 2, c2: 3, c3: 4, mode: 'parallel' as 'parallel' | 'series' };

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);
    const { context, origin } = stage;
    const gap = Math.max(26, Math.min(150, (state.separation / 0.02) * 150));
    const plateHeight = Math.max(90, Math.min(200, (state.area / 0.05) * 200));

    context.fillStyle = VIOLET;
    context.fillRect(origin.x - gap / 2 - 8, origin.y - plateHeight / 2, 16, plateHeight);
    context.fillStyle = '#ffd166';
    context.fillRect(origin.x + gap / 2 - 8, origin.y - plateHeight / 2, 16, plateHeight);
    label(stage, '+', origin.x - gap / 2, origin.y, '#191a2e', 14);
    label(stage, '−', origin.x + gap / 2, origin.y, '#191a2e', 14);
    if (state.kappa > 1) {
      context.fillStyle = 'rgba(14,143,128,0.18)';
      context.fillRect(origin.x - gap / 2, origin.y - plateHeight / 2, gap, plateHeight);
      label(stage, `دی‌الکتریک κ = ${fa(state.kappa)}`, origin.x, origin.y + plateHeight / 2 + 22, '#0e8f80', 11);
    }
    label(stage, `d = ${fmt(state.separation * 100, 3)} cm`, origin.x, origin.y - plateHeight / 2 - 18, '#4a4e6a', 12);
    label(stage, `A = ${fmt(state.area * 1e4, 3)} cm²`, origin.x, origin.y + plateHeight / 2 + 40, '#4a4e6a', 12);

    const single = parallelPlateCapacitance(state.area, state.separation, state.kappa);
    const field = state.voltage / state.separation;
    const energy = energyStored(single, state.voltage);
    readout.set('ظرفیت C = κε₀A/d', `${fmt(single * 1e12, 4)} pF`);
    readout.set('بار Q = CV', `${fmt(single * state.voltage * 1e9, 4)} nC`);
    readout.set('انرژی U = ½CV²', `${fmt(energy * 1e6, 4)} µJ`);
    readout.set('میدان بین صفحات E = V/d', `${fmt(field, 4)} N/C`);
    readout.set('اثر دی‌الکتریک', `ظرفیت × ${fa(state.kappa)} نسبت به خلأ`);

    // series / parallel network diagram with values
    const values = [state.c1, state.c2, state.c3].map((value) => value * 1e-6);
    const equivalent = state.mode === 'parallel' ? parallelCapacitance(values) : seriesCapacitance(values);
    const startX = 420;
    values.forEach((value, index) => {
      const y = 120 + index * 62;
      context.strokeStyle = '#191a2e';
      context.lineWidth = 2;
      context.strokeRect(startX, y - 18, 16, 36);
      context.beginPath();
      context.moveTo(startX - 40, y);
      context.lineTo(startX, y);
      context.moveTo(startX + 16, y);
      context.lineTo(startX + 70, y);
      context.stroke();
      label(stage, `${fmt(value * 1e6, 3)} µF`, startX + 96, y, '#4a4e6a', 12);
    });
    label(stage, state.mode === 'parallel' ? 'موازی: C = ΣCᵢ' : 'سری: 1/C = Σ1/Cᵢ', startX + 40, 320, '#4a4e6a', 11);
    readout.set('ظرفیت معادل شبکه', `${fmt(equivalent * 1e6, 4)} µF`);
    if (state.mode === 'series') {
      const charge = equivalent * state.voltage;
      readout.set('بار هر خازن', `${fmt(charge * 1e9, 4)} nC`);
      readout.set('ولتاژ هر خازن', seriesVoltages(values, charge).map((value) => `${fmt(value, 3)} V`).join(' · '));
    } else {
      readout.set('ولتاژ هر خازن', `${fmt(state.voltage, 3)} V`);
      readout.set('بار کل', `${fmt(equivalent * state.voltage * 1e9, 4)} nC`);
    }
    readout.set('ثابت گذردهی', `${fmt(EPSILON_0, 4)} C²/(N·m²)`);
  };

  segmented(panel, {
    label: 'اتصال خازن‌ها',
    value: 'parallel',
    options: [
      { id: 'parallel', label: 'موازی' },
      { id: 'series', label: 'سری' },
    ],
    onChange: (id) => {
      state.mode = id as 'parallel' | 'series';
      paint();
    },
  });
  slider(panel, { label: 'مساحت صفحه A', min: 0.005, max: 0.05, step: 0.005, value: state.area, unit: 'm²', format: (value) => `${fmt(value * 1e4, 3)} cm²`, onInput: (value) => { state.area = value; paint(); } });
  slider(panel, { label: 'فاصله d', min: 0.001, max: 0.02, step: 0.001, value: state.separation, unit: 'm', format: (value) => `${fmt(value * 100, 3)} cm`, onInput: (value) => { state.separation = value; paint(); } });
  slider(panel, { label: 'ضریب دی‌الکتریک κ', min: 1, max: 8, step: 0.1, value: state.kappa, onInput: (value) => { state.kappa = value; paint(); } });
  slider(panel, { label: 'ولتاژ', min: 1, max: 24, step: 1, value: state.voltage, unit: 'V', onInput: (value) => { state.voltage = value; paint(); } });
  slider(panel, { label: 'C₁', min: 0.5, max: 10, step: 0.5, value: state.c1, unit: 'µF', onInput: (value) => { state.c1 = value; paint(); } });
  slider(panel, { label: 'C₂', min: 0.5, max: 10, step: 0.5, value: state.c2, unit: 'µF', onInput: (value) => { state.c2 = value; paint(); } });
  slider(panel, { label: 'C₃', min: 0.5, max: 10, step: 0.5, value: state.c3, unit: 'µF', onInput: (value) => { state.c3 = value; paint(); } });
  resetControl(panel, paint);
  paint();
}

const VIOLET = '#4c35d6';
const NEG = '#1e7be8';
