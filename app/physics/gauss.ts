import { EPSILON_0, K_COULOMB } from './constants.ts';

/** Electric flux through a closed surface: Φ = ∮E·dA (for uniform E on area A, Φ = E·A). */
export function flux(field: number, area: number): number {
  return field * area;
}

/** Gauss's law: Φ = q_net / ε₀. */
export function gaussLawCharge(fluxValue: number): number {
  return fluxValue * EPSILON_0;
}

/** Charge implied by a uniform field on a closed surface of the given area. */
export function enclosedCharge(field: number, area: number): number {
  return field * area * EPSILON_0;
}

export interface GaussSphereInput {
  /** Total charge of the sphere. */
  totalCharge: number;
  /** Sphere radius. */
  radius: number;
  /** Distance from centre. */
  r: number;
  /** Charge density inside a solid sphere, C/m³. */
  density: number;
}

/** Field of a uniformly charged spherical shell (identical to a point charge outside). */
export function fieldOutsideSphere(totalCharge: number, r: number): number {
  return (K_COULOMB * totalCharge) / (r * r);
}

/** Field of a uniformly charged solid sphere, piecewise (0 at the centre). */
export function fieldInsideSphere(density: number, r: number): number {
  return density * r / (3 * EPSILON_0);
}

export function sphereField(input: GaussSphereInput): { E: number; region: 'inside' | 'outside'; qEnclosed: number } {
  const { totalCharge, radius, r, density } = input;
  if (r <= radius) {
    const qEnclosed = density * (4 / 3) * Math.PI * r ** 3;
    return { E: fieldInsideSphere(density, r), region: 'inside', qEnclosed };
  }
  return { E: fieldOutsideSphere(totalCharge, r), region: 'outside', qEnclosed: totalCharge };
}

/** Field of an infinitely long straight charged wire at distance r: E = λ/(2π ε₀ r). */
export function fieldOfWire(linearDensity: number, r: number): number {
  return linearDensity / (2 * Math.PI * EPSILON_0 * r);
}

/** Lateral area of the Gaussian cylinder used for a wire: 2πrL. */
export function cylinderLateralArea(r: number, length: number): number {
  return 2 * Math.PI * r * length;
}

/** Field of an infinite charged plane: E = σ/(2ε₀). */
export function fieldOfPlane(surfaceDensity: number): number {
  return surfaceDensity / (2 * EPSILON_0);
}

/** Field on the axis of a uniformly charged ring: E = kQx/(R²+x²)^{3/2}. */
export function fieldOnRingAxis(totalCharge: number, ringRadius: number, x: number): number {
  return (K_COULOMB * totalCharge * x) / Math.pow(ringRadius ** 2 + x ** 2, 1.5);
}

/** Position of the ring-axis field maximum: x = R/√2. */
export function ringAxisMaximumPosition(ringRadius: number): number {
  return ringRadius / Math.SQRT2;
}