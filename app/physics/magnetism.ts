import { MU_0 } from './constants.ts';

/** Magnetic force on a moving charge: F = qvB sinθ. */
export function lorentzForceMagnitude(q: number, speed: number, field: number, thetaRad: number): number {
  return Math.abs(q) * speed * field * Math.sin(thetaRad);
}

/** Cyclotron radius for a velocity perpendicular to the field: r = mv/(qB). */
export function cyclotronRadius(mass: number, speed: number, q: number, field: number): number {
  return (mass * speed) / (Math.abs(q) * field);
}

/** Period of circular motion: T = 2πm/(qB). */
export function cyclotronPeriod(mass: number, q: number, field: number): number {
  return (2 * Math.PI * mass) / (Math.abs(q) * field);
}

/** Cyclotron (angular) frequency: ω = qB/m. */
export function cyclotronFrequency(mass: number, q: number, field: number): number {
  return (Math.abs(q) * field) / mass;
}

/** Pitch of a helical path = parallel velocity component × period. */
export function helixPitch(parallelSpeed: number, period: number): number {
  return parallelSpeed * period;
}

/** Force on a current-carrying wire: F = I L B sinθ. */
export function wireForce(current: number, length: number, field: number, thetaRad: number): number {
  return current * length * field * Math.sin(thetaRad);
}

/** Magnetic torque on a coil: τ = N I A B sinθ. */
export function coilTorque(turns: number, current: number, area: number, field: number, thetaRad: number): number {
  return turns * current * area * field * Math.sin(thetaRad);
}

/** Magnetic dipole moment μ = N I A. */
export function magneticMoment(turns: number, current: number, area: number): number {
  return turns * current * area;
}

/** Biot–Savart contribution magnitude of a current element (|I dl × r̂|/r²). */
export function biotSavartMagnitude(current: number, length: number, r: number): number {
  return (MU_0 / (4 * Math.PI)) * ((current * length) / (r * r));
}

/** Field of an infinitely long straight wire: B = μ₀I/(2πr). */
export function wireField(current: number, r: number): number {
  return (MU_0 * current) / (2 * Math.PI * r);
}

/** Field at the centre of a circular loop: B = μ₀I/(2R). */
export function loopCentreField(current: number, radius: number, turns = 1): number {
  return (MU_0 * turns * current) / (2 * radius);
}

/** Field inside a long solenoid: B = μ₀nI with n = N/L. */
export function solenoidField(turns: number, length: number, current: number): number {
  return MU_0 * (turns / length) * current;
}

/** Ampère's law: ∮B·dl = μ₀ I_enc. */
export function ampereLoopIntegral(loopLength: number, field: number): number {
  return loopLength * field;
}

export function ampereEnclosedCurrent(loopLength: number, field: number): number {
  return (loopLength * field) / MU_0;
}

/** Charge-to-mass ratio measured from a cyclotron measurement: q/m = 2π/(TB). */
export function chargeToMassFromCyclotron(period: number, field: number): number {
  return (2 * Math.PI) / (period * field);
}