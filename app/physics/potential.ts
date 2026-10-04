import { K_COULOMB, EPSILON_0 } from './constants.ts';

/** Potential of a point charge: V = kq/r (scalar, reference V(∞) = 0). */
export function pointPotential(q: number, r: number): number {
  if (r === 0) return q > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
  return (K_COULOMB * q) / r;
}

/** Superposition of potentials (scalar sum, no vectors). */
export function totalPotential(charges: { q: number; r: number }[]): number {
  return charges.reduce((sum, { q, r }) => sum + pointPotential(q, r), 0);
}

/** Potential energy of a test charge q in a potential field. */
export function potentialEnergy(q: number, potential: number): number {
  return q * potential;
}

/** Interaction energy of two point charges. */
export function pairEnergy(q1: number, q2: number, r: number): number {
  return (K_COULOMB * q1 * q2) / r;
}

/** Work by the field moving a charge from A to B: W = q∫E·ds = −qΔV. */
export function workByField(q: number, deltaV: number): number {
  return -q * deltaV;
}

/** E = −∇V: field component along one axis from a potential gradient. */
export function fieldFromPotentialGradient(dVdAxis: number): number {
  return -dVdAxis;
}

/** Field of a capacitor with the geometry C = κε₀A/d (Q known) between the plates. */
export function capacitorField(charge: number, plateArea: number, kappa = 1): number {
  if (plateArea === 0) return 0;
  return charge / (kappa * EPSILON_0 * plateArea);
}

/** Capacitance of a parallel-plate capacitor: C = κε₀A/d. */
export function parallelPlateCapacitance(plateArea: number, separation: number, kappa = 1): number {
  if (separation === 0) return Number.POSITIVE_INFINITY;
  return (kappa * EPSILON_0 * plateArea) / separation;
}

export function energyStored(capacitance: number, voltage: number): number {
  return 0.5 * capacitance * voltage * voltage;
}

export function energyFromCharge(capacitance: number, charge: number): number {
  return (charge * charge) / (2 * capacitance);
}

export function chargeOfCapacitor(capacitance: number, voltage: number): number {
  return capacitance * voltage;
}

/** Equivalent capacitance for capacitors in parallel. */
export function parallelCapacitance(values: number[]): number {
  return values.reduce((sum, c) => sum + c, 0);
}

/** Equivalent capacitance for capacitors in series (1/C = Σ1/Ci). */
export function seriesCapacitance(values: number[]): number {
  const reciprocal = values.reduce((sum, c) => sum + (c === 0 ? Number.POSITIVE_INFINITY : 1 / c), 0);
  return reciprocal === 0 ? 0 : 1 / reciprocal;
}

/** Charge on each capacitor of a series combination when a voltage is applied. */
export function seriesCharge(capacitances: number[], appliedVoltage: number): number {
  return seriesCapacitance(capacitances) * appliedVoltage;
}

/** Voltage on each series capacitor given the common charge. */
export function seriesVoltages(capacitances: number[], charge: number): number[] {
  return capacitances.map((c) => (c === 0 ? 0 : charge / c));
}