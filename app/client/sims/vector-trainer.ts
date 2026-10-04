/**
 * Vector trainer: the bridge between "a force has a size" and "a force has components".
 *
 * Physics II force and field problems are unreadable until the learner can move between the
 * magnitude/angle picture and the x/y picture. This figure lets them set either one and watches the
 * other follow, so `F = (Fₓ, F_y)` stops being an algebraic instruction and becomes something you
 * can see change.
 *
 * Everything drawn here comes from `app/physics/vector.ts`; no component is computed in the view.
 */
import { magnitude } from '../../physics/vector.ts';
import { fmt } from '../dom.ts';
import {
  arrow,
  clear,
  controlPanel,
  createStage,
  grid,
  label,
  readoutList,
  resetControl,
  segmented,
  slider,
} from './kit.ts';

const MUTED = '#4a4e6a';
const VIOLET = '#4c35d6';
const TEAL = '#0e8f80';
const MAGENTA = '#d2266f';

type Mode = 'components' | 'magnitude';

export function mountVectorTrainer(host: HTMLElement): void {
  const stage = createStage(host, { width: 640, height: 440, scale: 130 })!;
  const readout = readoutList(host);
  const panel = controlPanel(stage.canvas.parentElement ?? host);

  // Two directions in, one vector out. Editing either representation updates the other.
  const state = { mode: 'components' as Mode, fx: 3, fy: 4, magnitude: 5, theta: 53.13 };
  const AXIS = 92;

  const paint = () => {
    clear(stage);
    readout.clear();
    grid(stage, 24, true);

    const ox = stage.origin.x;
    const oy = stage.origin.y;

    if (state.mode === 'components') {
      state.magnitude = Math.hypot(state.fx, state.fy);
      state.theta = (Math.atan2(state.fy, state.fx) * 180) / Math.PI;
    } else {
      const radians = (state.theta * Math.PI) / 180;
      state.fx = state.magnitude * Math.cos(radians);
      state.fy = state.magnitude * Math.sin(radians);
    }

    // Axes.
    label(stage, 'x', ox + AXIS + 12, oy + 16, MUTED, 12);
    label(stage, 'y', ox - 14, oy - AXIS - 8, MUTED, 12);
    for (let t = -AXIS; t <= AXIS; t += 23) {
      if (t === 0) continue;
      arrow(stage, { x: ox + t, y: oy }, { x: ox + t + (t > 0 ? 5 : -5), y: oy }, { color: '#c9c2ae', width: 1 });
      arrow(stage, { x: ox, y: oy + t }, { x: ox, y: oy + t + (t > 0 ? 5 : -5) }, { color: '#c9c2ae', width: 1 });
    }

    const tipX = ox + state.fx * 23;
    const tipY = oy - state.fy * 23;

    // Dashed projection box makes the components visible as lengths, not just numbers.
    const cornerX = ox + state.fx * 23;
    const cornerY = oy - state.fy * 23;
    arrow(stage, { x: ox, y: oy }, { x: cornerX, y: oy }, { color: TEAL, dashed: true, labelText: `Fₓ = ${fmt(state.fx, 2)}` });
    arrow(stage, { x: cornerX, y: oy }, { x: tipX, y: tipY }, { color: TEAL, dashed: true, labelText: `F_y = ${fmt(state.fy, 2)}` });

    // The vector itself, drawn last so it sits on top.
    arrow(stage, { x: ox, y: oy }, { x: tipX, y: tipY }, { color: VIOLET, labelText: 'F', width: 3 });

    // θ is measured from the +x axis; label it where the arc sits so the reference is unambiguous.
    if (state.magnitude > 0.01) {
      label(stage, `θ = ${fmt(state.theta, 1)}°`, ox + 60, oy - 16, MAGENTA, 12);
    }

    readout.set('اندازه', `${fmt(magnitude({ x: state.fx, y: state.fy }), 3)} N`);
    readout.set('مؤلفه‌ی x', `${fmt(state.fx, 3)} N`);
    readout.set('مؤلفه‌ی y', `${fmt(state.fy, 3)} N`);
    readout.set('زاویه با محور x', `${fmt(state.theta, 1)}°`);
    readout.set(
      'رابطه',
      `√(${fmt(state.fx, 2)}² + ${fmt(state.fy, 2)}²) = ${fmt(magnitude({ x: state.fx, y: state.fy }), 3)}`,
      'muted',
    );
    if (Math.abs(state.fy) < 0.05) readout.set('نکته', 'روی محور x: مؤلفه‌ی y صفر است.', 'ok');
    else if (Math.abs(state.fx) < 0.05) readout.set('نکته', 'روی محور y: مؤلفه‌ی x صفر است.', 'ok');
    else if (Math.abs(state.fx - state.fy) < 0.05) readout.set('نکته', 'دو مؤلفه برابر ⇒ زاویه ۴۵ درجه.', 'ok');
    else readout.set('نکته', 'بردار در ربعی که هر دو مؤلفه هم‌علامت‌اند نیم‌رخ می‌شود.', 'muted');
  };

  segmented(panel, {
    label: 'ورودی را از کدام طرف تغییر می‌دهی؟',
    options: [
      { id: 'components', label: 'مؤلفه‌های x و y' },
      { id: 'magnitude', label: 'اندازه و زاویه' },
    ],
    value: state.mode,
    onChange: (id) => {
      state.mode = id as Mode;
      paint();
    },
  });
  slider(panel, {
    label: 'مؤلفه‌ی x  (Fₓ)',
    min: -6,
    max: 6,
    step: 0.5,
    value: state.fx,
    unit: 'N',
    onInput: (value) => { state.fx = value; state.mode = 'components'; paint(); },
  });
  slider(panel, {
    label: 'مؤلفه‌ی y  (F_y)',
    min: -6,
    max: 6,
    step: 0.5,
    value: state.fy,
    unit: 'N',
    onInput: (value) => { state.fy = value; state.mode = 'components'; paint(); },
  });
  slider(panel, {
    label: 'اندازه  (F)',
    min: 0,
    max: 9,
    step: 0.1,
    value: state.magnitude,
    unit: 'N',
    onInput: (value) => { state.magnitude = value; state.mode = 'magnitude'; paint(); },
  });
  slider(panel, {
    label: 'زاویه  (θ)',
    min: -180,
    max: 180,
    step: 1,
    value: state.theta,
    unit: '°',
    onInput: (value) => { state.theta = value; state.mode = 'magnitude'; paint(); },
  });
  resetControl(panel, paint, 'بازنشانی', () => {
    // Reset replays each slider's input path, and the magnitude/angle pair re-derives the
    // components on the way through. Re-assert the mounted mode and re-read Fₓ, F_y from the
    // sliders so the figure returns to exactly the state it started in.
    const ranges = panel.querySelectorAll<HTMLInputElement>('input[type="range"]');
    state.mode = 'components';
    state.fx = Number(ranges[0]?.value ?? state.fx);
    state.fy = Number(ranges[1]?.value ?? state.fy);
  });
  paint();
}
