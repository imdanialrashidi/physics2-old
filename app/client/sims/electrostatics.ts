/** Electrostatics figures: charge bookkeeping, Coulomb's law, force superposition, field, dipole. */
import { type Charge, coulombForceMagnitude, netForce } from '../../physics/coulomb.ts';
import { dipoleAxialFieldApprox, dipoleEquatorialFieldApprox, netField, pointChargeField, testChargeForce } from '../../physics/field.ts';
import { EPSILON_0 } from '../../physics/constants.ts';
import { type Vec2, magnitude, unit } from '../../physics/vector.ts';
import { fmt } from '../dom.ts';
import { arrow, button, chargeDot, clear, createStage, grid, label, plotCurve, plotFrame, readoutList, segmented, slider } from './kit.ts';

const POS = '#e13b2b';
const NEG = '#1e7be8';
const VIOLET = '#4c35d6';
const TEAL = '#0e8f80';

function controlHost(stage: HTMLElement): HTMLElement {
  const host = stage.closest('.sim-tile, .sim-figure, .sim') ?? stage;
  const panel = document.createElement('div');
  panel.className = 'sim-controls';
  host.append(panel);
  return panel;
}

/* --------------------------------------------------------------- charge-lab */

export function mountChargeLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 640, height: 340, scale: 200, maxWidth: 620 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { protons: 7, electrons: 7 };

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const net = state.protons - state.electrons;
    const unit = Math.min(1.1, stage.width / 560);

    // The body itself: one large charge whose sign and magnitude are the point.
    const bodyX = -0.28 * (stage.width / 200);
    chargeDot(stage, { x: bodyX, y: 0 }, net || 1e-9, {
      radius: 22 * unit,
      labelText: net > 0 ? '+' : net < 0 ? '\u2212' : '',
    });
    label(stage, 'جسم', stage.origin.x + bodyX * stage.scale, stage.origin.y - 48 * unit, '#191a2e', 12 * unit);

    // Proton and electron rows, laid out from the right so Persian labels stay readable.
    const rowX = stage.width - 70;
    const rows: [string, number, string][] = [
      ['پروتون (+)', state.protons, POS],
      ['الکترون (\u2212)', state.electrons, NEG],
    ];
    rows.forEach(([text, value, colour], rowIndex) => {
      const y = 76 + rowIndex * 44 * unit;
      label(stage, text, rowX, y, colour === POS ? '#b3271c' : '#11529c', 12 * unit);
      const spacing = 26 * unit;
      const room = Math.max(1, Math.floor((stage.width - 260) / spacing));
      for (let index = 0; index < Math.min(value, room); index++) {
        stage.context.fillStyle = colour;
        stage.context.beginPath();
        stage.context.arc(rowX - 165 * unit - index * spacing, y, 7 * unit, 0, Math.PI * 2);
        stage.context.fill();
      }
    });

    // Charge bar in units of the elementary charge, centred on the origin.
    const barY = stage.height - 52 * unit;
    const barWidth = Math.min(420 * unit, stage.width - 140);
    const barX = stage.origin.x - barWidth / 2;
    stage.context.fillStyle = 'rgba(25,26,46,0.08)';
    stage.context.fillRect(barX, barY, barWidth, 14 * unit);
    const fraction = Math.max(-1, Math.min(1, net / 10));
    const midX = barX + barWidth / 2;
    stage.context.fillStyle = net >= 0 ? POS : NEG;
    stage.context.fillRect(
      fraction >= 0 ? midX : midX + (fraction * barWidth) / 2,
      barY,
      (Math.abs(fraction) * barWidth) / 2,
      14 * unit,
    );
    stage.context.strokeStyle = 'rgba(25,26,46,0.25)';
    stage.context.lineWidth = 1;
    stage.context.beginPath();
    stage.context.moveTo(midX, barY - 6);
    stage.context.lineTo(midX, barY + 20 * unit);
    stage.context.stroke();
    label(stage, 'q = n\u00b7e', midX, barY + 36 * unit, '#191a2e', 12 * unit);

    readout.set('بار خالص', `${fmt(net)} \u00d7 e  (${fmt(net * 1.602e-19, 3)} C)`);
    readout.set(
      'وضعیت',
      net === 0 ? 'خنثی' : net > 0 ? 'بار مثبت (الکترون کم شده)' : 'بار منفی (الکترون اضافه شده)',
    );
    readout.set('n در رابطه‌ی q = ne', fmt(net));
  };

  segmented(panel, {
    label: 'کار با الکترون',
    value: 'give',
    options: [
      { id: 'give', label: 'الکترون بده' },
      { id: 'take', label: 'الکترون بگیر' },
    ],
    onChange: (id) => {
      if (id === 'give') state.electrons++;
      else state.electrons = Math.max(0, state.electrons - 1);
      paint();
    },
  });
  button(panel, {
    label: 'برگرد به حالت خنثی',
    onClick: () => {
      state.electrons = state.protons;
      paint();
    },
  });
  paint();
}

/* ------------------------------------------------------------- coulomb-lab */

export function mountCoulombLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 640, height: 420, scale: 150 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { q1: 2, q2: -3, r: 1.2 };

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const left: Vec2 = { x: -state.r / 2, y: 0 };
    const right: Vec2 = { x: state.r / 2, y: 0 };
    const force = coulombForceMagnitude(state.q1 * 1e-6, state.q2 * 1e-6, state.r);
    chargeDot(stage, left, state.q1, { radius: 16, labelText: `${fmt(state.q1, 2)}µC` });
    chargeDot(stage, right, state.q2, { radius: 16, labelText: `${fmt(state.q2, 2)}µC` });

    const arrowLength = Math.min(110, 20 + Math.log10(force + 1) * 38);
    const leftX = stage.origin.x + left.x * stage.scale;
    const rightX = stage.origin.x + right.x * stage.scale;
    arrow(stage, { x: leftX + 24, y: stage.origin.y - 64 }, { x: leftX + 24 + arrowLength * Math.sign(state.q2), y: stage.origin.y - 64 }, { color: VIOLET, labelText: 'F' });
    arrow(stage, { x: rightX - 24, y: stage.origin.y - 64 }, { x: rightX - 24 - arrowLength * Math.sign(state.q1), y: stage.origin.y - 64 }, { color: VIOLET, labelText: 'F' });
    label(stage, `r = ${fmt(state.r)} m`, stage.origin.x, stage.origin.y + 34, '#191a2e', 12);

    const frame = plotFrame(stage, { origin: { x: 404, y: 60 }, size: { w: 196, h: 150 } });
    const maxForce = coulombForceMagnitude(state.q1 * 1e-6, state.q2 * 1e-6, 0.4);
    const xMax = 3;
    plotCurve(
      stage,
      Array.from({ length: 40 }, (_, index) => {
        const r = 0.4 + (index / 39) * (xMax - 0.4);
        return { x: r, y: coulombForceMagnitude(state.q1 * 1e-6, state.q2 * 1e-6, r) };
      }),
      { origin: frame.origin, size: frame.size, xMax, yMax: maxForce, color: VIOLET },
    );
    label(stage, 'F بر حسب r', frame.origin.x + frame.size.w / 2, frame.origin.y - 14, '#4a4e6a', 12);
    label(stage, 'افت با ۱/r²', frame.origin.x + frame.size.w / 2, frame.origin.y + frame.size.h + 26, '#4a4e6a', 11);

    readout.set('اندازه‌ی نیرو', `${fmt(force)} N`);
    readout.set('جهت', state.q1 * state.q2 > 0 ? 'دفعی (هم‌علامت)' : 'جاذبه (غیرهم‌علامت)');
    readout.set('اگر r دو برابر شود', `${fmt(force / 4)} N`);
  };

  slider(panel, { label: 'بار اول', min: -6, max: 6, step: 1, value: state.q1, unit: 'µC', onInput: (value) => { state.q1 = value; paint(); } });
  slider(panel, { label: 'بار دوم', min: -6, max: 6, step: 1, value: state.q2, unit: 'µC', onInput: (value) => { state.q2 = value; paint(); } });
  slider(panel, { label: 'فاصله', min: 0.4, max: 3, step: 0.1, value: state.r, unit: 'm', onInput: (value) => { state.r = value; paint(); } });
  paint();
}

/* -------------------------------------------------------- triangle-forces */

export function mountTriangleForces(host: HTMLElement): void {
  const stage = createStage(host, { width: 660, height: 440, scale: 190 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const side = 0.5;
  const state = { q1: 1, q2: -2, q3: -2 };

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const charges: Charge[] = [
      { q: state.q1 * 1e-6, position: { x: 0, y: side } },
      { q: state.q2 * 1e-6, position: { x: -side / 2, y: 0 } },
      { q: state.q3 * 1e-6, position: { x: side / 2, y: 0 } },
    ];
    const screen = (point: Vec2) => ({ x: stage.origin.x + point.x * stage.scale, y: stage.origin.y - point.y * stage.scale });

    stage.context.strokeStyle = 'rgba(25,26,46,0.25)';
    stage.context.setLineDash([4, 4]);
    stage.context.beginPath();
    charges.forEach((charge, index) => {
      const point = screen(charge.position);
      if (index === 0) stage.context.moveTo(point.x, point.y);
      else stage.context.lineTo(point.x, point.y);
    });
    stage.context.closePath();
    stage.context.stroke();
    stage.context.setLineDash([]);

    const f12 = netForce([charges[0]!, charges[1]!], 1);
    const f32 = netForce([charges[2]!, charges[1]!], 1);
    const net = netForce(charges, 1);
    const start = screen(charges[1]!.position);
    const draw = (vector: Vec2, colour: string, text: string) =>
      arrow(stage, start, { x: start.x + vector.x * 150, y: start.y - vector.y * 150 }, { color: colour, labelText: text });
    draw(f12, '#8a7bff', 'F₁₂');
    draw(f32, '#ea580c', 'F₃₂');
    draw(net, VIOLET, 'F خالص');

    charges.forEach((charge) => chargeDot(stage, charge.position, charge.q, { radius: 14, labelText: `${fmt(charge.q * 1e6, 3)}µC` }));
    label(stage, 'نیرو روی ذره‌ی ۲', stage.origin.x, stage.height - 24, '#191a2e', 13);

    readout.set('F₁₂', `${fmt(magnitude(f12))} N`);
    readout.set('F₃₂', `${fmt(magnitude(f32))} N`);
    readout.set('F خالص', `${fmt(magnitude(net))} N`);
    readout.set('مؤلفه‌ی x', `${fmt(net.x)} N`);
    readout.set('مؤلفه‌ی y', `${fmt(net.y)} N`);
    const angle = (Math.atan2(net.y, net.x) * 180) / Math.PI;
    readout.set('زاویه', `${fmt(angle, 4)}°`);
    readout.set('ربع', net.x < 0 && net.y >= 0 ? 'ربع دوم' : net.x >= 0 && net.y >= 0 ? 'ربع اول' : net.x < 0 ? 'ربع سوم' : 'ربع چهارم');
  };

  slider(panel, { label: 'q₁ (بالا)', min: -4, max: 4, step: 1, value: state.q1, unit: 'µC', onInput: (value) => { state.q1 = value; paint(); } });
  slider(panel, { label: 'q₂ (هدف، چپ)', min: -4, max: 4, step: 1, value: state.q2, unit: 'µC', onInput: (value) => { state.q2 = value; paint(); } });
  slider(panel, { label: 'q₃ (راست)', min: -4, max: 4, step: 1, value: state.q3, unit: 'µC', onInput: (value) => { state.q3 = value; paint(); } });
  paint();
}

/* ---------------------------------------------------------- square-balance */

export function mountSquareBalance(host: HTMLElement): void {
  const stage = createStage(host, { width: 660, height: 440, scale: 200 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { ratio: Math.SQRT2 / 2, Q: 1 };

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const a = 0.32;
    const corners: Vec2[] = [
      { x: -a, y: a },
      { x: a, y: a },
      { x: a, y: -a },
      { x: -a, y: -a },
    ];
    stage.context.strokeStyle = 'rgba(25,26,46,0.25)';
    stage.context.setLineDash([4, 4]);
    stage.context.strokeRect(stage.origin.x - a * stage.scale, stage.origin.y - a * stage.scale, 2 * a * stage.scale, 2 * a * stage.scale);
    stage.context.setLineDash([]);

    const values = [state.Q, state.ratio * state.Q, state.ratio * state.Q, -2 * state.Q];
    const charges: Charge[] = corners.map((position, index) => ({ q: values[index]! * 1e-6, position }));
    charges.forEach((charge, index) => chargeDot(stage, charge.position, charge.q, { radius: 15, labelText: `${fmt(values[index]!, 3)}Q` }));

    const net = netForce(charges, 0);
    const start = { x: stage.origin.x + corners[0]!.x * stage.scale, y: stage.origin.y - corners[0]!.y * stage.scale };
    arrow(stage, start, { x: start.x + net.x * 260, y: start.y - net.y * 260 }, { color: VIOLET, labelText: 'F خالص روی q₁' });
    label(stage, 'a', stage.origin.x + a * stage.scale, stage.origin.y + a * stage.scale + 22, '#4a4e6a', 12);

    const ideal = Math.SQRT2 / 2;
    readout.set('نسبت فعلی q/Q', `${fmt(state.ratio, 4)}`);
    readout.set('نسبتی که F خالص را صفر می‌کند', `${fmt(ideal, 4)} = √۲ ÷ ۲`);
    readout.set('نیروی خالص روی q₁', `${fmt(magnitude(net) * 1e6, 3)} µN`);
    readout.set('وضعیت', Math.abs(state.ratio - ideal) < 0.01 ? 'نیروی خالص صفر است ✔' : 'هنوز نیروی خالص صفر نشده');
  };

  slider(panel, { label: 'q / Q', min: 0, max: 2, step: 0.001, value: state.ratio, onInput: (value) => { state.ratio = value; paint(); } });
  slider(panel, { label: 'Q', min: 1, max: 8, step: 1, value: state.Q, unit: 'µC', onInput: (value) => { state.Q = value; paint(); } });
  button(panel, { label: 'برسان به جواب √۲ ÷ ۲', onClick: () => { state.ratio = Math.SQRT2 / 2; paint(); } });
  paint();
}

/* --------------------------------------------------------------- field-lab */

export function mountFieldLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 660, height: 460, scale: 150 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const charges = [
    { q: 2e-6, x: -0.9, y: 0.5 },
    { q: -2e-6, x: 0.9, y: -0.5 },
  ];
  const probe = { q0: 1e-8, x: 0, y: 0.9 };
  const showArrows = { value: true };
  let dragging = -99;

  const physics = (): Charge[] => charges.map((charge) => ({ q: charge.q, position: { x: charge.x, y: charge.y } }));
  const screenToWorld = (px: number, py: number) => ({ x: (px - stage.origin.x) / stage.scale, y: -(py - stage.origin.y) / stage.scale });

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const source = physics();
    if (showArrows.value) {
      const step = 34;
      for (let px = -stage.width / 2 + step / 2; px < stage.width / 2; px += step) {
        for (let py = -stage.height / 2 + step / 2; py < stage.height / 2; py += step) {
          const point = { x: px / stage.scale, y: -py / stage.scale };
          if (charges.some((charge) => Math.hypot(charge.x - point.x, charge.y - point.y) < 0.14)) continue;
          const field = netField(source, point);
          const strength = magnitude(field);
          if (!Number.isFinite(strength)) continue;
          const direction = unit(field);
          const length = Math.min(20, 3 + 2.2 * Math.log10(1 + strength * 1e6));
          const x = stage.origin.x + px;
          const y = stage.origin.y + py;
          stage.context.strokeStyle = strength > 3e5 ? 'rgba(30,123,232,0.5)' : 'rgba(76,53,214,0.3)';
          stage.context.lineWidth = 1.3;
          stage.context.beginPath();
          stage.context.moveTo(x, y);
          stage.context.lineTo(x + direction.x * length, y - direction.y * length);
          stage.context.stroke();
        }
      }
    }
    charges.forEach((charge) => chargeDot(stage, { x: charge.x, y: charge.y }, charge.q, { radius: 14, labelText: `${fmt(charge.q * 1e6, 3)}µC` }));

    const force = testChargeForce(source, { x: probe.x, y: probe.y }, probe.q0);
    const px = stage.origin.x + probe.x * stage.scale;
    const py = stage.origin.y - probe.y * stage.scale;
    stage.context.fillStyle = '#ffd166';
    stage.context.strokeStyle = '#191a2e';
    stage.context.lineWidth = 1.5;
    stage.context.beginPath();
    stage.context.arc(px, py, 7, 0, Math.PI * 2);
    stage.context.fill();
    stage.context.stroke();
    label(stage, 'بار آزمایشی q₀', px, py - 20, '#191a2e', 11);
    const direction = unit(force);
    arrow(stage, { x: px, y: py }, { x: px + direction.x * 36, y: py - direction.y * 36 }, { color: '#b45309', labelText: 'F = q₀E' });

    const total = magnitude(netField(source, { x: probe.x, y: probe.y }));
    readout.set('میدان کل در محل q₀', `${fmt(total)} N/C`);
    readout.set('سهم بار اول', `${fmt(magnitude(pointChargeField(source[0]!, { x: probe.x, y: probe.y })))} N/C`);
    readout.set('نیروی بار آزمایشی', `${fmt(magnitude(force))} N`);
    readout.set('راهنما', 'بارها را بکش؛ پیکان‌ها زنده به‌روز می‌شوند.');
  };

  const pointerPosition = (event: PointerEvent) => {
    const rect = stage.canvas.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * stage.width;
    const py = ((event.clientY - rect.top) / rect.height) * stage.height;
    return screenToWorld(px, py);
  };
  stage.canvas.addEventListener('pointerdown', (event) => {
    const world = pointerPosition(event);
    const hit = charges.findIndex((charge) => Math.hypot(charge.x - world.x, charge.y - world.y) < 0.2);
    if (hit >= 0) dragging = hit;
    else if (Math.hypot(world.x - probe.x, world.y - probe.y) < 0.22) dragging = -2;
    else return;
    stage.canvas.setPointerCapture(event.pointerId);
  });
  stage.canvas.addEventListener('pointermove', (event) => {
    if (dragging === -99) return;
    const world = pointerPosition(event);
    if (dragging >= 0) {
      charges[dragging]!.x = Math.max(-2.1, Math.min(2.1, world.x));
      charges[dragging]!.y = Math.max(-1.4, Math.min(1.4, world.y));
    } else {
      probe.x = Math.max(-2.1, Math.min(2.1, world.x));
      probe.y = Math.max(-1.4, Math.min(1.4, world.y));
    }
    paint();
  });
  const release = () => (dragging = -99);
  stage.canvas.addEventListener('pointerup', release);
  stage.canvas.addEventListener('pointercancel', release);

  slider(panel, { label: 'بار اول', min: -4, max: 4, step: 0.5, value: 2, unit: 'µC', onInput: (value) => { charges[0]!.q = value * 1e-6; paint(); } });
  slider(panel, { label: 'بار دوم', min: -4, max: 4, step: 0.5, value: -2, unit: 'µC', onInput: (value) => { charges[1]!.q = value * 1e-6; paint(); } });
  slider(panel, { label: 'بار آزمایشی q₀', min: -4, max: 4, step: 0.5, value: 1, unit: 'µC', onInput: (value) => { probe.q0 = value * 1e-6; paint(); } });
  paint();
}

/* -------------------------------------------------------------- dipole-lab */

export function mountDipoleLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 660, height: 440, scale: 150 })!;
  const readout = readoutList(host);
  const panel = controlHost(host);
  const state = { q: 3, d: 0.4, r: 1.2, point: 'axis' as 'axis' | 'equator' };

  const paint = () => {
    clear(stage);
    grid(stage, 24, true);
    const q = state.q * 1e-6;
    chargeDot(stage, { x: -state.d / 2, y: 0 }, -q, { radius: 15, labelText: '−q' });
    chargeDot(stage, { x: state.d / 2, y: 0 }, q, { radius: 15, labelText: '+q' });
    arrow(stage, { x: stage.origin.x - 40, y: stage.origin.y - 92 }, { x: stage.origin.x + 40, y: stage.origin.y - 92 }, { color: VIOLET, labelText: 'p' });

    const probeX = state.point === 'axis' ? state.r : 0;
    const probeY = state.point === 'axis' ? 0 : state.r;
    const px = stage.origin.x + probeX * stage.scale;
    const py = stage.origin.y - probeY * stage.scale;
    stage.context.strokeStyle = 'rgba(25,26,46,0.3)';
    stage.context.setLineDash([3, 3]);
    stage.context.beginPath();
    stage.context.moveTo(stage.origin.x, stage.origin.y);
    stage.context.lineTo(px, py);
    stage.context.stroke();
    stage.context.setLineDash([]);
    stage.context.fillStyle = '#ffd166';
    stage.context.strokeStyle = '#191a2e';
    stage.context.beginPath();
    stage.context.arc(px, py, 6, 0, Math.PI * 2);
    stage.context.fill();
    stage.context.stroke();
    label(stage, state.point === 'axis' ? 'روی محور' : 'روی عمودمنصف', px, py + 20, '#4a4e6a', 11);

    const charges: Charge[] = [
      { q, position: { x: state.d / 2, y: 0 } },
      { q: -q, position: { x: -state.d / 2, y: 0 } },
    ];
    const field = netField(charges, { x: probeX, y: probeY });
    const direction = unit(field);
    const length = Math.min(46, 12 + 3 * Math.log10(1 + magnitude(field) * 1e6));
    arrow(stage, { x: px, y: py }, { x: px + direction.x * length, y: py - direction.y * length }, { color: TEAL, labelText: 'E' });

    const p = q * state.d;
    const axial = dipoleAxialFieldApprox(q, state.d, state.r);
    const equatorial = dipoleEquatorialFieldApprox(q, state.d, state.r);
    const frame = plotFrame(stage, { origin: { x: 430, y: 60 }, size: { w: 190, h: 150 } });
    const xMax = 2.5;
    const curve = Array.from({ length: 30 }, (_, index) => {
      const r = state.d + index * 0.05;
      return { x: r, y: dipoleAxialFieldApprox(q, state.d, r) };
    });
    plotCurve(stage, curve, { origin: frame.origin, size: frame.size, xMax, yMax: axial, color: TEAL });
    plotCurve(
      stage,
      Array.from({ length: 30 }, (_, index) => {
        const r = state.d + index * 0.05;
        return { x: r, y: (p / (2 * Math.PI * EPSILON_0 * r ** 3)) };
      }),
      { origin: frame.origin, size: frame.size, xMax, yMax: axial, color: TEAL, dashed: true },
    );
    label(stage, 'افت میدان با ۱/r³', frame.origin.x + frame.size.w / 2, frame.origin.y - 14, TEAL, 11);

    readout.set('گشتاور دوقطبی p', `${fmt(p, 4)} C·m`);
    readout.set('میدان روی محور', `${fmt(axial)} N/C`);
    readout.set('میدان روی عمودمنصف', `${fmt(Math.abs(equatorial))} N/C (خلاف جهت p)`);
    readout.set('نسبت دو میدان', `${fmt(Math.abs(equatorial / axial), 3)} — نصف میدان محور`);
    readout.set('شرط تقریب', state.d < state.r * 0.5 ? 'd ≪ r برقرار است ✔' : 'd نسبت به r بزرگ است؛ فرمول تقریبی معتبر نیست');
  };

  segmented(panel, {
    label: 'محل نقطه‌ی محاسبه',
    value: 'axis',
    options: [
      { id: 'axis', label: 'روی محور' },
      { id: 'equator', label: 'روی عمودمنصف' },
    ],
    onChange: (id) => {
      state.point = id as 'axis' | 'equator';
      paint();
    },
  });
  slider(panel, { label: 'بار هر قطب', min: 0.5, max: 6, step: 0.5, value: state.q, unit: 'µC', onInput: (value) => { state.q = value; paint(); } });
  slider(panel, { label: 'فاصله‌ی دو قطب d', min: 0.1, max: 0.8, step: 0.05, value: state.d, unit: 'm', onInput: (value) => { state.d = value; paint(); } });
  slider(panel, { label: 'فاصله‌ی نقطه r', min: 0.4, max: 2.4, step: 0.1, value: state.r, unit: 'm', onInput: (value) => { state.r = value; paint(); } });
  paint();
}