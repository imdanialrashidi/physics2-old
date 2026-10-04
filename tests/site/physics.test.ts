/**
 * Physics-core tests. The expected numbers are the oracles published in the course
 * notes (`Lecture notes/`), so a regression here means the site would teach a wrong answer.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  Coulomb,
  Circuits,
  Constants,
  Field,
  Gauss,
  Magnetism,
  Potential,
  Vector,
} from '../../app/physics/index.ts';

const close = (actual: number, expected: number, tolerance: number, message?: string) => {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `${message ?? 'value'} — expected ${expected} ± ${tolerance}, got ${actual}`,
  );
};

const DEG = Math.PI / 180;

/** Relative comparison for quantities whose scale is far from 1. */
const closeRel = (actual: number, expected: number, relativeTolerance: number, message?: string) => {
  close(actual, expected, Math.abs(expected) * relativeTolerance, message);
};

test('notes §4.1: three charges on an equilateral triangle (side 10 cm)', () => {
  const { coulombForceMicroCoulombCentimetre } = Coulomb;
  const f12 = coulombForceMicroCoulombCentimetre(1, -2, 10);
  const f32 = coulombForceMicroCoulombCentimetre(-2, -2, 10);
  close(f12, 1.8, 0.01, 'F12');
  close(f32, 3.6, 0.01, 'F32');

  // q2 sits at the origin, q1 at 60° above it, q3 on the +x axis.
  const q1 = { q: 1e-6, position: { x: 0.05, y: 0.05 * Math.tan(60 * DEG) } };
  const q2 = { q: -2e-6, position: { x: 0, y: 0 } };
  const q3 = { q: -2e-6, position: { x: 0.1, y: 0 } };
  const net = Coulomb.netForce([q1, q2, q3], 1);
  close(net.x, -2.7, 0.01, 'Fx');
  close(net.y, 1.8 * Math.sqrt(3) / 2, 0.01, 'Fy');
  close(Vector.magnitude(net), 3.12, 0.02, 'F');
  const referenceAngle = Math.atan2(Math.abs(net.y), Math.abs(net.x)) / DEG;
  close(referenceAngle, 30.0, 0.2, 'reference angle');
  // The notes quote 30.5° because they round F_y to 1.6 N before taking the tangent.
  close(Math.atan2(1.6, 2.7) / DEG, 30.6, 0.2, 'reference angle from the notes’ rounded values');
  assert.ok(net.x < 0 && net.y > 0, 'net force points into the second quadrant');
});

test('notes §4.2: four charges on a square — zero net force on q1 gives q/Q = √2/2', () => {
  const k = Constants.K_COULOMB;
  const a = 1; // side, arbitrary units
  // q1 top-right, q2 top-left, q3 bottom-right, q4 bottom-left = −2Q on the diagonal.
  const q1 = { q: 1, position: { x: a / 2, y: a / 2 } };
  const q4 = { q: -2, position: { x: -a / 2, y: -a / 2 } };
  const ratio = Math.SQRT2 / 2;
  const q2 = { q: ratio, position: { x: -a / 2, y: a / 2 } };
  const q3 = { q: ratio, position: { x: a / 2, y: -a / 2 } };
  const net = Coulomb.netForce([q1, q2, q3, q4], 0);
  close(net.x, 0, 1e-3, 'Fx');
  close(net.y, 0, 1e-3, 'Fy');
  // Sanity: the published derivation relation F₄₁cos45° = F₂₁.
  const diagonal = Math.SQRT2 * a;
  closeRel(k * 1 * 2 / (diagonal * diagonal) * Math.SQRT2 / 2, k * 1 * ratio / (a * a), 1e-12, 'F₄₁cos45° = F₂₁');
});

test('notes §4.3: charges on the coordinate axes — Q ≈ −82.86 µC (+x) and +55.2 µC (+y)', () => {
  const { K_COULOMB: k } = Constants;
  const q1 = { q: 40e-6, position: { x: -0.02, y: 0 } };
  const q3 = { q: 20e-6, position: { x: 0, y: 0.02 } };
  const trial = (Q: number) => Coulomb.netForce([q1, { q: Q, position: { x: 0.03, y: 0 } }, q3], 2);

  const plusX = trial(-82.86e-6);
  close(plusX.y, 0, 5, 'Fy ≈ 0 for the +x case');
  assert.ok(plusX.x > 0, 'net force along +x');

  const plusY = trial(55.2e-6);
  close(plusY.x, 0, 5, 'Fx ≈ 0 for the +y case');
  assert.ok(plusY.y > 0, 'net force along +y');

  // Analytic values from the notes' geometry.
  const f13 = (k * 40e-6 * 20e-6) / (2 * Math.SQRT2 * 0.01) ** 2;
  const r23 = Math.sqrt(13) * 0.01;
  // Q must be negative so the attraction pulls the y-components into each other.
  const qForPlusX = -(f13 * Math.SQRT2 / 2) / ((k * 20e-6 / (r23 * r23)) * (2 / Math.sqrt(13)));
  const qForPlusY = (f13 * Math.SQRT2 / 2) / ((k * 20e-6 / (r23 * r23)) * (3 / Math.sqrt(13)));
  close(f13, 8.99e3, 5, 'F13');
  close(qForPlusX * 1e6, -82.86, 0.05, 'Q for the +x case (µC)');
  close(qForPlusY * 1e6, 55.2, 0.05, 'Q for the +y case (µC)');
});

test('notes §5–6: field of a point charge, superposition, and the square-centre example', () => {
  const q = 2e-6;
  const at = { x: 0.3, y: 0 };
  const e = Field.pointChargeField({ q, position: { x: 0, y: 0 } }, at);
  close(e.x, Constants.K_COULOMB * q / 0.09, 1e-6, 'Ex');
  close(e.y, 0, 1e-12, 'Ey');

  // A positive test charge feels a force along the field.
  const f = Field.testChargeForce([{ q, position: { x: 0, y: 0 } }], at, 1e-9);
  close(f.x, e.x * 1e-9, 1e-18, 'F = q0 E');

  // §6.1: q1=1µC, q2=2µC, q3=4µC, q4=−2µC on a square of side 4 cm, field at the centre.
  // q2 and q4 sit on the same diagonal with opposite signs, so both fields point at the q4
  // corner: E24 = E2 + E4 = 9/2 ×10⁷, while E13 = E3 − E1 = 27/8 ×10⁷.
  const net = Field.fieldAtSquareCentre([1e-6, 2e-6, 4e-6, -2e-6], 0.04);
  const kOver9 = Constants.K_COULOMB / 9e9;
  const e13 = ((27 / 8) * 1e7) * kOver9;
  const e24 = ((9 / 2) * 1e7) * kOver9;
  close(Vector.magnitude(net), Math.hypot(e13, e24), 1, '|E| at the square centre');
  close(net.x, -(e13 + e24) / Math.SQRT2, 1, 'Ex');
  close(net.y, (e13 - e24) / Math.SQRT2, 1, 'Ey');
  const angleFromNegativeX = Math.atan2(Math.abs(net.y), Math.abs(net.x)) / DEG;
  close(angleFromNegativeX, 8.13, 0.1, 'field direction below the −x axis');
});

test('notes §7: dipole moment and the axial field p/(2πε₀r³)', () => {
  const q = 3e-6, d = 0.02, r = 0.3;
  const p = q * d;
  const exact = Field.dipoleAxialField(q, d, r);
  const approx = Field.dipoleAxialFieldApprox(q, d, r);
  close(approx, p / (2 * Math.PI * Constants.EPSILON_0 * r ** 3), 1e-9);
  close(exact, approx, 0.005 * approx, 'd ≪ r approximation');
  close(-Field.dipoleEquatorialFieldApprox(q, d, r), approx / 2, 1e-6, 'equatorial field is half the axial field');
});

test('notes part 2 §2: charge densities', () => {
  close(20e-6 / 0.5, 4e-5, 1e-12, 'λ');
  close(20e-6 / 0.25, 8e-5, 1e-12, 'σ');
  close(20e-6 / 0.001, 2e-2, 1e-9, 'ρ');
});

test('notes part 2 §4–5, §8–11: Gauss results', () => {
  const sphere = Gauss.sphereField({ totalCharge: 3e-6, radius: 0.1, r: 0.2, density: 3e-6 / ((4 / 3) * Math.PI * 0.001) });
  close(sphere.E, Constants.K_COULOMB * 3e-6 / 0.04, 1e-9, 'outside sphere = point charge field');
  const inside = Gauss.sphereField({ totalCharge: 3e-6, radius: 0.1, r: 0.05, density: 3e-6 / ((4 / 3) * Math.PI * 0.001) });
  close(inside.E, Constants.K_COULOMB * 3e-6 * 0.05 / 0.001, 3e3, 'inside: E = kQr/R³ (ε₀ rounding in ρ)');
  closeRel(Gauss.enclosedCharge(sphere.E, 4 * Math.PI * 0.04), 3e-6, 1e-3, 'enclosed charge (ε₀ rounding)');

  const lambda = 2e-6;
  close(Gauss.fieldOfWire(lambda, 0.05), lambda / (2 * Math.PI * Constants.EPSILON_0 * 0.05), 1e-12);
  close(Gauss.fieldOfPlane(1e-6), 1e-6 / (2 * Constants.EPSILON_0), 1e-12);
  close(Gauss.fieldOnRingAxis(2e-6, 0.2, 0.2), Constants.K_COULOMB * 2e-6 * 0.2 / (0.04 + 0.04) ** 1.5, 1e-9);
});

test('notes part 3: potential, energy and capacitors', () => {
  close(Potential.pointPotential(2e-6, 0.2), Constants.K_COULOMB * 2e-6 / 0.2, 1e-9);
  close(Potential.pairEnergy(2e-6, -3e-6, 0.1), -Constants.K_COULOMB * 6e-12 / 0.1, 1e-12);
  const capacitance = Potential.parallelPlateCapacitance(0.02, 0.001);
  close(capacitance, Constants.EPSILON_0 * 0.02 / 0.001, 1e-15);
  close(Potential.parallelPlateCapacitance(0.02, 0.001, 3.9), capacitance * 3.9, 1e-15, 'dielectric multiplies C by κ');
  close(Potential.energyStored(1e-3, 12), 0.5 * 1e-3 * 144, 1e-12);
  close(Potential.seriesCapacitance([2, 3, 6]), 1, 1e-12);
  close(Potential.parallelCapacitance([2, 3, 6]), 11, 1e-12);
  const q = Potential.seriesCharge([2, 3, 6], 12);
  close(q, 12, 1e-12);
  const voltages = Potential.seriesVoltages([2, 3, 6], q);
  close(voltages.reduce((sum, v) => sum + v, 0), 12, 1e-12, 'series voltages add up');
});

test('notes part 4: current, Ohm, power, RC', () => {
  close(Circuits.currentFromDrift(8.5e28, 1.602e-19, 2e-6, 1e-4), 8.5e28 * 1.602e-19 * 2e-6 * 1e-4, 1e-30);
  close(Circuits.wireResistance(1.7e-8, 20, 4e-6), 1.7e-8 * 20 / 4e-6, 1e-12);
  close(Circuits.powerFromCurrentResistance(2, 5), 20, 1e-12);
  close(Circuits.powerFromVoltageResistance(10, 5), 20, 1e-12);
  close(Circuits.temperatureAdjustedResistance(20, 0.0039, 120), 20 * (1 + 0.0039 * 100), 1e-12);
  close(Circuits.loopCurrent(12, 4, 0.5), 12 / 4.5, 1e-12);

  const R = 1000, C = 10e-6;
  const tau = R * C;
  const atTau = Circuits.rcCharging(tau, C, 12, tau);
  close(atTau.v, 12 * (1 - Math.exp(-1)), 1e-12);
  close(atTau.i, 12 / tau * Math.exp(-1), 1e-12);
  close(Circuits.fractionAfterTimeConstants(1), 0.632, 0.001);
  const discharged = Circuits.rcDischarge(tau, C * 12, tau);
  close(discharged.q, C * 12 * Math.exp(-1), 1e-15);
  assert.ok(discharged.i < 0, 'discharging current is negative by the passive sign convention');
  close(Circuits.parallelResistance([6, 3]), 2, 1e-12);
  close(Circuits.seriesResistance([6, 3]), 9, 1e-12);
});

test('notes part 5: magnetism', () => {
  close(Magnetism.lorentzForceMagnitude(2e-6, 1000, 0.5, 90 * DEG), 2e-6 * 1000 * 0.5, 1e-12);
  close(Magnetism.lorentzForceMagnitude(2e-6, 1000, 0.5, 0), 0, 1e-12);
  close(Magnetism.cyclotronRadius(Constants.ELECTRON_MASS, 1e6, 1.602e-19, 0.5), 1.137e-5, 1e-7);
  close(Magnetism.cyclotronPeriod(Constants.ELECTRON_MASS, 1.602e-19, 0.5), 7.145e-11, 5e-14);
  close(
    Magnetism.cyclotronFrequency(Constants.ELECTRON_MASS, 1.602e-19, 0.5),
    2 * Math.PI / Magnetism.cyclotronPeriod(Constants.ELECTRON_MASS, 1.602e-19, 0.5),
    1e-6,
  );
  close(Magnetism.wireForce(3, 0.4, 0.2, 90 * DEG), 0.24, 1e-12);
  close(Magnetism.coilTorque(50, 0.8, 0.02, 0.4, 30 * DEG), 50 * 0.8 * 0.02 * 0.4 * 0.5, 1e-12);
  close(Magnetism.wireField(5, 0.01), Constants.MU_0 * 5 / (2 * Math.PI * 0.01), 1e-15);
  close(Magnetism.loopCentreField(3, 0.05, 4), Constants.MU_0 * 12 / 0.1, 1e-12);
  close(Magnetism.solenoidField(1000, 0.25, 2), Constants.MU_0 * 4000 * 2, 1e-9);
  close(Magnetism.ampereEnclosedCurrent(2 * Math.PI * 0.01, Magnetism.wireField(5, 0.01)), 5, 1e-9);
});