/** Simulation registry: each figure is a separate chunk, loaded only where it appears. */
type Mount = (host: HTMLElement) => void;

const REGISTRY: Record<string, () => Promise<Mount>> = {
  'charge-lab': async () => (await import('./electrostatics.ts')).mountChargeLab,
  'coulomb-lab': async () => (await import('./electrostatics.ts')).mountCoulombLab,
  'triangle-forces': async () => (await import('./electrostatics.ts')).mountTriangleForces,
  'square-balance': async () => (await import('./electrostatics.ts')).mountSquareBalance,
  'field-lab': async () => (await import('./electrostatics.ts')).mountFieldLab,
  'dipole-lab': async () => (await import('./electrostatics.ts')).mountDipoleLab,
  'gauss-lab': async () => (await import('./gauss.ts')).mountGaussLab,
  'drift-lab': async () => (await import('./circuits.ts')).mountDriftLab,
  'circuit-lab': async () => (await import('./circuits.ts')).mountCircuitLab,
  'rc-lab': async () => (await import('./circuits.ts')).mountRcLab,
  'capacitor-lab': async () => (await import('./circuits.ts')).mountCapacitorLab,
  'magnetic-motion': async () => (await import('./magnetism.ts')).mountMagneticMotion,
  'wire-torque': async () => (await import('./magnetism.ts')).mountWireTorque,
  'b-field-lab': async () => (await import('./magnetism.ts')).mountBFieldLab,
  'vector-trainer': async () => (await import('./vector-trainer.ts')).mountVectorTrainer,
  'hand-rule-trainer': async () => (await import('./right-hand-rule.ts')).mountRightHandRule,
};

export async function mountSimulations(simId: string | null): Promise<void> {
  if (!simId) return;
  const stages = document.querySelectorAll<HTMLElement>(`[data-sim="${CSS.escape(simId)}"] [data-sim-stage]`);
  if (!stages.length) return;
  const loader = REGISTRY[simId];
  if (!loader) {
    for (const stage of stages) {
      stage.textContent = '';
      const note = document.createElement('p');
      note.className = 'sim-fallback';
      note.textContent = 'این شکل در نسخه‌ی فعلی در دسترس نیست؛ توضیح متنی زیر تصویر همان ایده را کامل می‌کند.';
      stage.append(note);
    }
    return;
  }
  try {
    const mount = await loader();
    for (const stage of stages) {
      try {
        mount(stage);
        // Keep the drawing crisp when the tile resizes (window resize, grid reflow).
        let lastWidth = stage.clientWidth;
        const observer = new ResizeObserver(() => {
          if (Math.abs(stage.clientWidth - lastWidth) < 40) return;
          lastWidth = stage.clientWidth;
          mount(stage);
        });
        observer.observe(stage);
      } catch (error) {
        stage.textContent = '';
        const note = document.createElement('p');
        note.className = 'sim-fallback';
        note.textContent = `بارگذاری شکل ممکن نشد (${error instanceof Error ? error.message : 'خطای ناشناخته'}). توضیح متنی زیر تصویر باقی است.`;
        stage.append(note);
      }
    }
  } catch (error) {
    for (const stage of stages) {
      stage.textContent = '';
      const note = document.createElement('p');
      note.className = 'sim-fallback';
      note.textContent = `ماژول شبیه‌سازی بارگذاری نشد (${error instanceof Error ? error.message : 'خطای ناشناخته'}). متن زیر تصویر در دسترس است.`;
      stage.append(note);
    }
  }
}