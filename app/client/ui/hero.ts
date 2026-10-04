/**
 * Hero canvas: the electric field of two opposite charges, drawn from the same physics core the
 * lesson pages use. Purely decorative (aria-hidden) and paused for reduced motion.
 */
import { pointChargeField } from '../../physics/field.ts';
import { type Vec2, magnitude, unit } from '../../physics/vector.ts';
import { createLoop, prefersReducedMotion, q } from '../dom.ts';

const CHARGES: { q: number; position: Vec2; radius: number }[] = [
  { q: 1.6e-6, position: { x: -0.17, y: 0.1 }, radius: 13 },
  { q: -1.6e-6, position: { x: 0.17, y: -0.1 }, radius: 13 },
];

export function initHero(): void {
  const canvas = q<HTMLCanvasElement>('[data-hero-canvas]');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) return;

  const reduce = prefersReducedMotion();
  const phase = { value: 0 };
  const scaleFactor = 240;

  const draw = () => {
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = '#fffdf6';
    context.fillRect(0, 0, width, height);

    // graph-paper grid (the product's visual signature)
    context.strokeStyle = 'rgba(25, 26, 46, 0.07)';
    context.lineWidth = 1;
    for (let x = 0; x <= width; x += 24) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y <= height; y += 24) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    const centre = { x: width / 2, y: height / 2 };
    const toScreen = (point: Vec2): Vec2 => ({ x: centre.x + point.x * scaleFactor, y: centre.y - point.y * scaleFactor });

    // field arrows on a coarse lattice
    const step = 30;
    for (let px = -width / 2 + step / 2; px < width / 2; px += step) {
      for (let py = -height / 2 + step / 2; py < height / 2; py += step) {
        const world = { x: px / scaleFactor, y: -py / scaleFactor };
        if (CHARGES.some((charge) => magnitude({ x: world.x - charge.position.x, y: world.y - charge.position.y }) < 0.07)) continue;
        const field = CHARGES.reduce<Vec2>((sum, charge) => {
          const contribution = pointChargeField(charge, world);
          return { x: sum.x + contribution.x, y: sum.y + contribution.y };
        }, { x: 0, y: 0 });
        const strength = magnitude(field);
        const direction = unit(field);
        const screen = toScreen(world);
        const length = Math.min(22, 5 + 2.4 * Math.log10(1 + strength * 1e6));
        const drift = reduce ? 0 : Math.sin(phase.value + px * 0.02 + py * 0.03) * 1.6;
        context.strokeStyle = strength > 4e5 ? 'rgba(30, 123, 232, 0.55)' : 'rgba(76, 53, 214, 0.32)';
        context.lineWidth = 1.4;
        context.beginPath();
        context.moveTo(screen.x, screen.y);
        context.lineTo(screen.x + (direction.x * length + drift) * -1, screen.y + (direction.y * length + drift) * 1);
        context.stroke();
      }
    }

    // the charges themselves
    for (const charge of CHARGES) {
      const screen = toScreen(charge.position);
      const glow = context.createRadialGradient(screen.x, screen.y, 2, screen.x, screen.y, charge.radius * 2.4);
      const colour = charge.q > 0 ? '225, 59, 43' : '30, 123, 232';
      glow.addColorStop(0, `rgba(${colour}, 0.35)`);
      glow.addColorStop(1, `rgba(${colour}, 0)`);
      context.fillStyle = glow;
      context.beginPath();
      context.arc(screen.x, screen.y, charge.radius * 2.4, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = charge.q > 0 ? '#e13b2b' : '#1e7be8';
      context.beginPath();
      context.arc(screen.x, screen.y, charge.radius, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#fffdf6';
      context.font = '600 15px Vazirmatn Variable, system-ui, sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(charge.q > 0 ? '+' : '−', screen.x, screen.y + 1);
    }
  };

  draw();
  if (reduce) return;
  const loop = createLoop((delta) => {
    phase.value += delta;
    draw();
  });
  loop.start();
}
