/** Current density: J = I/A. */
export function currentDensity(current: number, area: number): number {
  return area === 0 ? 0 : current / area;
}

/** Current through a conductor: I = n q A v_d. */
export function currentFromDrift(density: number, charge: number, area: number, driftSpeed: number): number {
  return density * charge * area * driftSpeed;
}

/** Drift speed implied by a measured current: v_d = I/(nqA). */
export function driftSpeed(current: number, density: number, charge: number, area: number): number {
  const denominator = density * charge * area;
  return denominator === 0 ? 0 : current / denominator;
}

/** Resistance from Ohm's law. */
export function resistance(voltage: number, current: number): number {
  return current === 0 ? Number.POSITIVE_INFINITY : voltage / current;
}

/** Resistance of a uniform wire: R = ρL/A. */
export function wireResistance(resistivity: number, length: number, area: number): number {
  return area === 0 ? Number.POSITIVE_INFINITY : (resistivity * length) / area;
}

/** Temperature dependence of resistance: R = R₀[1 + α(T − T₀)]. */
export function temperatureAdjustedResistance(r0: number, alpha: number, temperature: number, t0 = 20): number {
  return r0 * (1 + alpha * (temperature - t0));
}

/** Electrical power: P = VI = I²R = V²/R. */
export function powerFromVoltageCurrent(voltage: number, current: number): number {
  return voltage * current;
}

export function powerFromCurrentResistance(current: number, r: number): number {
  return current * current * r;
}

export function powerFromVoltageResistance(voltage: number, r: number): number {
  return r === 0 ? 0 : (voltage * voltage) / r;
}

/** Terminal voltage of a source with internal resistance: V = ε − Ir. */
export function terminalVoltage(emf: number, current: number, internalResistance: number): number {
  return emf - current * internalResistance;
}

/** Steady-state current of a single loop: I = ε/(R + r). */
export function loopCurrent(emf: number, externalResistance: number, internalResistance = 0): number {
  const total = externalResistance + internalResistance;
  return total === 0 ? Number.POSITIVE_INFINITY : emf / total;
}

export function seriesResistance(values: number[]): number {
  return values.reduce((sum, r) => sum + r, 0);
}

export function parallelResistance(values: number[]): number {
  const reciprocal = values.reduce((sum, r) => sum + (r === 0 ? Number.POSITIVE_INFINITY : 1 / r), 0);
  return reciprocal === 0 ? 0 : 1 / reciprocal;
}

/** RC charging: q(t) = Cε(1 − e^{−t/RC}). */
export function rcCharge(tau: number, capacitance: number, emf: number, t: number): number {
  return capacitance * emf * (1 - Math.exp(-t / tau));
}

/** RC charging voltage and current. */
export function rcCharging(tau: number, capacitance: number, emf: number, t: number): { q: number; v: number; i: number } {
  const q = rcCharge(tau, capacitance, emf, t);
  const v = emf * (1 - Math.exp(-t / tau));
  const i = (emf / tau) * Math.exp(-t / tau);
  return { q, v, i };
}

/** RC discharging: q(t) = Q₀e^{−t/RC}. */
export function rcDischarge(tau: number, initialCharge: number, t: number): { q: number; v: number; i: number } {
  const q = initialCharge * Math.exp(-t / tau);
  return { q, v: q, i: -(q / tau) };
}

/** Fraction of the final value reached after n time constants. */
export function fractionAfterTimeConstants(n: number): number {
  return 1 - Math.exp(-n);
}

/** Kirchhoff node law residual: Σ(incoming) − Σ(outgoing). */
export function kirchhoffNodeResidual(incoming: number[], outgoing: number[]): number {
  const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);
  return sum(incoming) - sum(outgoing);
}

/** Kirchhoff loop law: sum of potential changes around a closed loop (must be zero). */
export function kirchhoffLoopSum(changes: number[]): number {
  return changes.reduce((sum, value) => sum + value, 0);
}