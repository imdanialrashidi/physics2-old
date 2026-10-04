import { K_COULOMB } from './constants.ts';
import { type Vec2, add, direction, magnitude, scale, sumVectors } from './vector.ts';

export interface Charge {
  /** Charge in coulomb. Negative values are negative charges. */
  q: number;
  /** Position in metres. */
  position: Vec2;
}

/**
 * Coulomb's law: magnitude of the electric force between two point charges.
 * `F = k|q1 q2| / r²`
 */
export function coulombForceMagnitude(q1: number, q2: number, rMetres: number): number {
  if (rMetres === 0) return Number.POSITIVE_INFINITY;
  return (K_COULOMB * Math.abs(q1 * q2)) / (rMetres * rMetres);
}

/**
 * Force exerted by `source` on `target` as a 2D vector.
 * Equal signs repel, opposite signs attract.
 */
export function forceOn(source: Charge, target: Charge): Vec2 {
  const r = magnitude({ x: target.position.x - source.position.x, y: target.position.y - source.position.y });
  const magnitudeF = coulombForceMagnitude(source.q, target.q, r);
  const away = direction(source.position, target.position);
  // Same sign pushes the target away from the source; opposite sign pulls it closer.
  const sign = source.q * target.q >= 0 ? 1 : -1;
  return scale(away, magnitudeF * sign);
}

/** Net force on `target` from every other charge in the list (superposition principle). */
export function netForce(charges: Charge[], targetIndex: number): Vec2 {
  const target = charges[targetIndex];
  if (!target) return { x: 0, y: 0 };
  return sumVectors(
    charges.filter((_, index) => index !== targetIndex).map((source) => forceOn(source, target)),
  );
}

/** Coulomb force in newtons for charges given in microcoulombs and distance in centimetres. */
export function coulombForceMicroCoulombCentimetre(q1MicroC: number, q2MicroC: number, rCentimetre: number): number {
  return coulombForceMagnitude(q1MicroC * 1e-6, q2MicroC * 1e-6, rCentimetre * 1e-2);
}

export function addVec(a: Vec2, b: Vec2): Vec2 {
  return add(a, b);
}

/** Fills an SVG/canvas-friendly polyline description for a vector arrow. */
export function vectorComponents(v: Vec2): { x: number; y: number; magnitude: number } {
  return { x: v.x, y: v.y, magnitude: magnitude(v) };
}