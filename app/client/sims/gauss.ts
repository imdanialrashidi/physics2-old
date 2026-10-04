/** Gauss's law figure: symmetry presets, Gaussian surface, flux and enclosed charge. */
import { EPSILON_0 } from '../../physics/constants.ts';
import { fieldOfPlane, fieldOfWire, sphereField } from '../../physics/gauss.ts';
import { fmt } from '../dom.ts';
import { arrow, chargeDot, clear, createStage, grid, label, readoutList, resetControl, segmented, slider } from './kit.ts';

type Preset = 'sphere' | 'wire' | 'plane' | 'ring';

export function mountGaussLab(host: HTMLElement): void {
  const stage = createStage(host, { width: 680, height: 470, scale: 190 })!;
  const readout = readoutList(host);
  const panel = document.createElement('div');
  panel.className = 'sim-controls';
  host.append(panel);
  const state = { preset: 'sphere' as Preset, radius: 0.25, totalCharge: 1, surfaceRadius: 0.35 };

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);
    const { context, origin } = stage;

    if (state.preset === 'sphere') {
      const px = state.radius * stage.scale;
      context.fillStyle = 'rgba(76,53,214,0.08)';
      context.strokeStyle = '#4c35d6';
      context.lineWidth = 2;
      context.beginPath();
      context.arc(origin.x, origin.y, px, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      label(stage, 'کره‌ی باردار (یکنواخت)', origin.x, origin.y + px + 22, '#191a2e', 12);

      const gx = state.surfaceRadius * stage.scale;
      context.setLineDash([6, 4]);
      context.strokeStyle = '#0e8f80';
      context.lineWidth = 1.8;
      context.beginPath();
      context.arc(origin.x, origin.y, gx, 0, Math.PI * 2);
      context.stroke();
      context.setLineDash([]);
      label(stage, 'سطح گاوسی', origin.x + gx * 0.7, origin.y - gx * 0.7, '#0e8f80', 12);

      // field arrows along a radial line
      const density = state.totalCharge / ((4 / 3) * Math.PI * state.radius ** 3);
      for (let index = 1; index <= 6; index++) {
        const r = (index / 6) * state.surfaceRadius * 0.92;
        const field = sphereField({ totalCharge: state.totalCharge * 1e-6, radius: state.radius, r, density: density * 1e-6 }).E;
        const length = Math.min(26, 4 + 1.6 * Math.log10(1 + Math.abs(field) * 1e6));
        arrow(stage, { x: origin.x + r * stage.scale, y: origin.y }, { x: origin.x + (r + length / stage.scale) * stage.scale, y: origin.y }, { color: '#4c35d6' });
      }
      chargeDot(stage, { x: 0, y: 0 }, 1, { radius: 10, labelText: '+' });

      const inside = state.surfaceRadius <= state.radius;
      const densityValue = (state.totalCharge * 1e-6) / ((4 / 3) * Math.PI * state.radius ** 3);
      const result = sphereField({
        totalCharge: state.totalCharge * 1e-6,
        radius: state.radius,
        r: state.surfaceRadius,
        density: densityValue,
      });
      const area = 4 * Math.PI * state.surfaceRadius ** 2;
      readout.set('بار محصور', `${fmt(result.qEnclosed * 1e6, 4)} µC`);
      readout.set('مساحت سطح', `${fmt(area * 1e4, 3)} cm²`);
      readout.set('میدان روی سطح', `${fmt(result.E)} N/C`);
      readout.set('شار Φ = E·A', `${fmt(result.E * area)} N·m²/C`);
      readout.set('q/ε₀', `${fmt(result.E * area * EPSILON_0 * 1e6, 4)} µC`);
      readout.set('ناحیه', inside ? 'داخل کره (فقط بخشی از بار)' : 'بیرون کره (همه‌ی بار)');
    }

    if (state.preset === 'wire') {
      const distance = Math.max(0.05, state.surfaceRadius);
      const px = distance * stage.scale;
      context.strokeStyle = '#4c35d6';
      context.lineWidth = 8;
      context.beginPath();
      context.moveTo(origin.x, 30);
      context.lineTo(origin.x, stage.height - 30);
      context.stroke();
      label(stage, 'سیم بلند', origin.x + 14, 44, '#191a2e', 12);

      context.fillStyle = 'rgba(14,143,128,0.10)';
      context.strokeStyle = '#0e8f80';
      context.lineWidth = 2;
      context.beginPath();
      context.roundRect(origin.x + 28, 30, px, stage.height - 60, 8);
      context.fill();
      context.stroke();
      label(stage, 'استوانه‌ی گاوسی', origin.x + 28 + px / 2, 22, '#0e8f80', 12);

      const lambda = (state.totalCharge * 1e-6) / 0.5;
      const field = fieldOfWire(lambda, distance);
      for (const sign of [1, -1]) {
        arrow(stage, { x: origin.x + sign * (28 + px), y: origin.y }, { x: origin.x + sign * (28 + px + 26), y: origin.y }, { color: '#4c35d6' });
      }
      readout.set('چگالی خطی λ', `${fmt(lambda * 1e6, 4)} µC/m`);
      readout.set('میدان در فاصله‌ی r', `${fmt(field)} N/C`);
      readout.set('سطح جانبی ۲πrL', `${fmt(2 * Math.PI * distance * 0.5, 4)} m²`);
      readout.set('Φ = E·A', `${fmt(field * 2 * Math.PI * distance * 0.5)} N·m²/C`);
      readout.set('بررسی q/ε₀', `${fmt(field * 2 * Math.PI * distance * 0.5 * EPSILON_0 * 1e6, 4)} µC`);
      readout.set('رفتار با فاصله', 'میدان با ۱/r کم می‌شود، نه با ۱/r²');
    }

    if (state.preset === 'plane') {
      context.strokeStyle = '#4c35d6';
      context.lineWidth = 10;
      context.beginPath();
      context.moveTo(30, origin.y);
      context.lineTo(stage.width - 30, origin.y);
      context.stroke();
      label(stage, 'صفحه‌ی باردار', 70, origin.y - 22, '#191a2e', 12);
      const gap = state.surfaceRadius * stage.scale;
      context.strokeStyle = '#0e8f80';
      context.setLineDash([6, 4]);
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(30, origin.y - gap);
      context.lineTo(stage.width - 30, origin.y - gap);
      context.stroke();
      context.setLineDash([]);
      label(stage, 'سطح گاوسی (جعبه‌ی نازک)', stage.width - 150, origin.y - gap - 16, '#0e8f80', 11);
      const sigma = state.totalCharge * 1e-6 / 0.04;
      const field = fieldOfPlane(sigma);
      for (let x = 80; x < stage.width - 60; x += 90) {
        arrow(stage, { x, y: origin.y - gap }, { x, y: origin.y - gap - 26 }, { color: '#4c35d6' });
        arrow(stage, { x, y: origin.y + gap }, { x, y: origin.y + gap + 26 }, { color: '#4c35d6' });
      }
      readout.set('چگالی سطحی σ', `${fmt(sigma * 1e6, 4)} µC/m²`);
      readout.set('میدان دو طرف صفحه', `${fmt(field)} N/C`);
      readout.set('نکته', 'میدان در دو طرف صفحه برابر و رو به بیرون است.');
      readout.set('مقایسه', 'اینجا وابستگی به فاصله ندارد، برخلاف سیم.');
    }

    if (state.preset === 'ring') {
      const radiusPx = state.surfaceRadius * stage.scale;
      context.strokeStyle = '#4c35d6';
      context.lineWidth = 7;
      context.beginPath();
      context.arc(origin.x, origin.y, radiusPx, 0, Math.PI * 2);
      context.stroke();
      const x = state.radius * stage.scale;
      context.setLineDash([6, 4]);
      context.strokeStyle = '#0e8f80';
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(origin.x, origin.y);
      context.lineTo(origin.x + x, origin.y);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = '#ffd166';
      context.beginPath();
      context.arc(origin.x + x, origin.y, 6, 0, Math.PI * 2);
      context.fill();
      label(stage, 'حلقه‌ی باردار', origin.x, origin.y - radiusPx - 20, '#191a2e', 12);
      label(stage, 'نقطه روی محور', origin.x + x, origin.y - 22, '#0e8f80', 11);
      const lambda = (state.totalCharge * 1e-6) / (2 * Math.PI * state.surfaceRadius);
      const field = (lambda * state.radius) / (2 * EPSILON_0 * (state.surfaceRadius ** 2 + state.radius ** 2));
      readout.set('چگالی خطی λ', `${fmt(lambda * 1e6, 4)} µC/m`);
      readout.set('میدان روی محور', `${fmt(field)} N/C`);
      readout.set('بیشینه‌ی میدان', 'در x = R/√۲ ≈ ۰٫۷۱R');
      readout.set('روش', 'انتگرال‌گیری لازم است؛ تقارن کافی برای گاوس نیست.');
    }
  };

  segmented(panel, {
    label: 'تقارن',
    value: 'sphere',
    options: [
      { id: 'sphere', label: 'کروی' },
      { id: 'wire', label: 'استوانه‌ای' },
      { id: 'plane', label: 'صفحه‌ای' },
      { id: 'ring', label: 'حلقه (انتگرال)' },
    ],
    onChange: (id) => {
      state.preset = id as Preset;
      paint();
    },
  });
  slider(panel, { label: 'بار کل', min: 0.5, max: 8, step: 0.5, value: state.totalCharge, unit: 'µC', onInput: (value) => { state.totalCharge = value; paint(); } });
  // step 0.05 keeps the mounted 0.35 representable; with step 0.02 the browser snapped it to a
  // different radius, so the figure started from a state its own control did not describe.
  slider(panel, { label: 'شعاع کره / فاصله‌ی سطح گاوسی', min: 0.1, max: 1, step: 0.05, value: state.surfaceRadius, unit: 'm', onInput: (value) => { state.surfaceRadius = value; paint(); } });
  slider(panel, { label: 'فاصله‌ی نقطه (حلقه)', min: 0, max: 1, step: 0.05, value: state.radius, unit: 'm', onInput: (value) => { state.radius = value; paint(); } });
  resetControl(panel, paint);
  paint();
}
