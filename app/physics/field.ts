import { K_COULOMB } from './constants.ts';
import type { Charge } from './coulomb.ts';
import { forceOn } from './coulomb.ts';
import { type Vec2, add, direction, magnitude, scale, sumVectors } from './vector.ts';

/** Electric field of one point charge at a point, in N/C (2D slice of the radial field). */
export function pointChargeField(source: Charge, at: Vec2): Vec2 {
  const r = magnitude({ x: at.x - source.position.x, y: at.y - source.position.y });
  const radial = direction(source.position, at);
  // Field points away from a positive charge and towards a negative charge.
  const sign = source.q >= 0 ? 1 : -1;
  const magnitudeE = r === 0 ? Number.POSITIVE_INFINITY : (K_COULOMB * source.q) / (r * r);
  return scale(radial, magnitudeE);
}

/** Superposition of point-charge fields. */
export function netField(charges: Charge[], at: Vec2): Vec2 {
  return sumVectors(charges.map((charge) => pointChargeField(charge, at)));
}

/** Force on a test charge q0 placed at `at` (E = F/q0 ⇒ F = q0 E). */
export function testChargeForce(charges: Charge[], at: Vec2, q0: number): Vec2 {
  return scale(netField(charges, at), q0);
}

/** Field of an electric dipole (charges ±q separated by `d`) on its axis, exact. */
export function dipoleAxialField(q: number, d: number, r: number): number {
  if (r <= d / 2) return Number.POSITIVE_INFINITY;
  const near = r - d / 2;
  const far = r + d / 2;
  return K_COULOMB * q * (1 / (near * near) - 1 / (far * far));
}

/** Far-field approximation E = p / (2π ε₀ r³) with p = qd. */
export function dipoleAxialFieldApprox(q: number, d: number, r: number): number {
  const p = q * d;
  return p / (2 * Math.PI * 8.85e-12 * r * r * r);
}

/** Field of an ideal dipole on the perpendicular bisector (approximation, d ≪ r). */
export function dipoleEquatorialFieldApprox(q: number, d: number, r: number): number {
  const p = q * d;
  return -p / (4 * Math.PI * 8.85e-12 * r * r * r);
}

/** Net field produced by four corner charges at the centre of a square (numeric, general). */
export function fieldAtSquareCentre(cornerCharges: number[], sideMetres: number): Vec2 {
  const a = sideMetres;
  const corners: Vec2[] = [
    { x: -a / 2, y: a / 2 },
    { x: a / 2, y: a / 2 },
    { x: a / 2, y: -a / 2 },
    { x: -a / 2, y: -a / 2 },
  ];
  const charges: Charge[] = cornerCharges.map((q, index) => ({ q, position: corners[index]! }));
  return charges.reduce<Vec2>((acc, charge) => add(acc, pointChargeField(charge, { x: 0, y: 0 })), { x: 0, y: 0 });
}

/** Force on a charge from another, re-exported so simulation code has one import site. */
export { forceOn };