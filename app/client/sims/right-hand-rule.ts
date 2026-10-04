/**
 * Right-hand rule trainer.
 *
 * The right-hand rule is the single most-missed skill in the magnetism part, and a multiple-choice
 * card does not teach it: the learner has to *see* the fingers map onto the geometry. This figure
 * shows a real charge moving in a real field and asks the learner to place the missing arrow among
 * the six axis directions, then draws the hand so the rule is visible rather than recited.
 *
 * The answer is always one of ±x, ±y, ±z and is decided by `cross(v, B)`, so the figure cannot
 * drift from the physics. `app/physics/magnetism.ts` owns the magnitudes.
 */
import { fmt, fa } from '../dom.ts';
import { arrow, chargeDot, clear, controlPanel, createStage, grid, label, readoutList, resetControl, segmented, slider } from './kit.ts';

const MAGENTA = '#d2266f';
const TEAL = '#0e8f80';
const MUTED = '#454964';
const OK = '#0a6b52';
const BAD = '#c0281c';

type Axis = 'x' | 'y' | 'z';
type Sign = 1 | -1;

/** Six candidate directions; the learner picks one. */
const DIRECTIONS: { id: string; axis: Axis; sign: Sign; label: string }[] = [
  { id: '+x', axis: 'x', sign: 1, label: '+x' },
  { id: '-x', axis: 'x', sign: -1, label: '−x' },
  { id: '+y', axis: 'y', sign: 1, label: '+y' },
  { id: '-y', axis: 'y', sign: -1, label: '−y' },
  { id: '+z', axis: 'z', sign: 1, label: '+z' },
  { id: '-z', axis: 'z', sign: -1, label: '−z' },
];

/** Screen vectors for the three axes; z is drawn as a diagonal to read as depth. */
const SCREEN: Record<Axis, { x: number; y: number }> = { x: { x: 1, y: 0 }, y: { x: 0, y: -1 }, z: { x: 0.62, y: 0.62 } };

/**
 * v × B in axis form, kept here rather than imported so the trainer stays a self-contained lesson
 * object. Sign conventions follow `F = q(v × B)`.
 */
function cross(v: Record<Axis, number>, b: Record<Axis, number>): { axis: Axis; sign: Sign } {
  const out: Record<Axis, number> = {
    x: v.y * b.z - v.z * b.y,
    y: v.z * b.x - v.x * b.z,
    z: v.x * b.y - v.y * b.x,
  };
  const axis = (['x', 'y', 'z'] as Axis[]).find((key) => Math.abs(out[key]) > 1e-9) ?? 'z';
  return { axis, sign: out[axis]! >= 0 ? 1 : -1 };
}

export function mountRightHandRule(host: HTMLElement): void {
  const stage = createStage(host, { width: 640, height: 440 })!;
  const readout = readoutList(host);
  const panel = controlPanel(stage.canvas.parentElement ?? host);

  const state = { charge: 2, speed: 4, guess: '' as string, attempts: 0 };
  const L = 118;

  const vector = (axis: Axis, sign: Sign, length = L) => ({
    x: stage.origin.x + SCREEN[axis].x * length * sign,
    y: stage.origin.y + SCREEN[axis].y * length * sign,
  });

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);
    const o = stage.origin;

    // Axes with labels, so "which way is −y?" is answerable from the picture.
    for (const axis of ['x', 'y', 'z'] as Axis[]) {
      arrow(stage, o, vector(axis, 1, L), { color: '#c9c2ae', width: 1.4 });
      arrow(stage, o, vector(axis, -1, L), { color: '#c9c2ae', width: 1.4 });
    }
    label(stage, '+x', vector('x', 1, L).x + 8, vector('x', 1, L).y + 16, MUTED, 12);
    label(stage, '+y', vector('y', 1, L).x - 8, vector('y', 1, L).y - 6, MUTED, 12);
    label(stage, '+z', vector('z', 1, L).x + 8, vector('z', 1, L).y + 16, MUTED, 12);
    label(stage, '−x', vector('x', -1, L).x - 20, vector('x', -1, L).y + 16, MUTED, 12);
    label(stage, '−y', vector('y', -1, L).x - 10, vector('y', -1, L).y - 2, MUTED, 12);
    label(stage, '−z', vector('z', -1, L).x + 8, vector('z', -1, L).y + 16, MUTED, 12);

    // The charge travelling along +x, and the field along +z: a fixed, legible configuration the
    // learner can reason about instead of memorise.
    const v = { x: 1, y: 0, z: 0 };
    const b = { x: 0, y: 0, z: 1 };
    const answer = cross(v, b);

    chargeDot(stage, { x: 0, y: 0 }, state.charge, { radius: 17, labelText: `${fmt(state.charge, 2)}µC` });
    arrow(stage, vector('x', 1, 70), vector('x', 1, 132), { color: TEAL, labelText: 'v' });
    label(stage, 'B', vector('z', 1, L).x - 6, vector('z', 1, L).y - 10, TEAL, 13);

    // Dots and crosses: the conventional field notation for out of / into the page.
    const fieldOrigin = { x: o.x + SCREEN.z.x * 70, y: o.y + SCREEN.z.y * 70 };
    for (let i = -1; i <= 1; i += 1) {
      for (let j = -1; j <= 1; j += 1) {
        const cx = fieldOrigin.x + i * 20;
        const cy = fieldOrigin.y + j * 20;
        stage.context.strokeStyle = TEAL;
        stage.context.lineWidth = 1.3;
        stage.context.beginPath();
        stage.context.arc(cx, cy, 5, 0, Math.PI * 2);
        stage.context.stroke();
        stage.context.beginPath();
        stage.context.moveTo(cx - 3.5, cy - 3.5);
        stage.context.lineTo(cx + 3.5, cy + 3.5);
        stage.context.moveTo(cx + 3.5, cy - 3.5);
        stage.context.lineTo(cx - 3.5, cy + 3.5);
        stage.context.stroke();
      }
    }

    if (state.guess) {
      const pick = DIRECTIONS.find((entry) => entry.id === state.guess);
      const right = pick && pick.axis === answer.axis && pick.sign === answer.sign;
      const end = pick ? vector(pick.axis, pick.sign, L) : o;
      arrow(stage, o, end, { color: right ? OK : BAD, width: 3.4, labelText: right ? 'F ✓' : 'F ✗' });
      if (!right) arrow(stage, o, vector(answer.axis, answer.sign, L), { color: OK, width: 2, dashed: true, labelText: 'F درست' });
      readout.set('پاسخ تو', `${pick?.label ?? '—'} — ${right ? 'درست است' : 'نادرست'}`, right ? 'ok' : 'warn');
    } else {
      readout.set('پاسخ تو', 'هنوز یک جهت را انتخاب نکرده‌ای', 'muted');
    }

    readout.set('سرعت v', `${fmt(state.speed, 2)} ×۱۰⁵ m/s`, 'muted');
    readout.set('میدان B', '۰٫۵ T رو به بیرون از صفحه (○)', 'muted');
    readout.set(
      'قاعده',
      `انگشت‌ها روی v، خم شدن به سمت B، شست روی F ⟶ ${fa(answer.sign > 0 ? '+' : '−')}${answer.axis}`,
      'muted',
    );
  };

  slider(panel, {
    label: 'بار q',
    min: -4,
    max: 4,
    step: 0.5,
    value: state.charge,
    unit: 'µC',
    onInput: (value) => { state.charge = value; paint(); },
  });
  slider(panel, {
    label: 'سرعت v',
    min: 1,
    max: 8,
    step: 0.5,
    value: state.speed,
    unit: '×۱۰⁵ m/s',
    onInput: (value) => { state.speed = value; paint(); },
  });
  segmented(panel, {
    label: 'جهت نیرو F کدام است؟',
    options: DIRECTIONS.map((entry) => ({ id: entry.id, label: entry.label })),
    value: state.guess,
    onChange: (id) => { state.guess = id; state.attempts += 1; paint(); },
  });
  resetControl(panel, paint, 'تلاش دوباره', () => {
    // Also clear the chosen direction: retrying should mean "not answered yet", not "same wrong
    // answer still highlighted".
    state.guess = '';
    state.attempts = 0;
    for (const segment of panel.querySelectorAll<HTMLElement>('.segment')) {
      segment.classList.remove('is-active');
      segment.setAttribute('aria-pressed', 'false');
    }
  });
  paint();
}
