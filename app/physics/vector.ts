/** Minimal 2D vector helpers shared by the physics core (no DOM, no allocations beyond results). */
export interface Vec2 {
  x: number;
  y: number;
}

export const vec = (x: number, y: number): Vec2 => ({ x, y });

export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });

export const scale = (a: Vec2, k: number): Vec2 => ({ x: a.x * k, y: a.y * k });

export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });

export const magnitude = (a: Vec2): number => Math.hypot(a.x, a.y);

export const unit = (a: Vec2): Vec2 => {
  const m = magnitude(a);
  return m === 0 ? { x: 0, y: 0 } : { x: a.x / m, y: a.y / m };
};

export const sumVectors = (vectors: Vec2[]): Vec2 =>
  vectors.reduce<Vec2>((acc, v) => add(acc, v), { x: 0, y: 0 });

/** Angle of a vector measured counter-clockwise from +x axis, in radians (-π, π]. */
export const angle = (a: Vec2): number => Math.atan2(a.y, a.x);

/** Unit vector pointing from `a` to `b`. */
export const direction = (from: Vec2, to: Vec2): Vec2 => unit(sub(to, from));

export const distance = (a: Vec2, b: Vec2): number => magnitude(sub(a, b));

export const midpoint = (a: Vec2, b: Vec2): Vec2 => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });