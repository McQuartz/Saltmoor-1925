// Deterministischer RNG (splitmix32). Nur 32-Bit-Ganzzahl-Arithmetik,
// damit der Godot-Port bitgleich rechnen kann (dort mit & 0xFFFFFFFF maskieren).
// Nie Math.random(), nie Zeit.

const MASK = 0xffffffff;

// FNV-1a über einen String, 32 Bit.
export function hashString(s) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export function mix32(z) {
  z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
  z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
  return (z ^ (z >>> 16)) >>> 0;
}

export class Rng {
  constructor(seed) {
    this.state = (seed & MASK) >>> 0;
  }
  // Eigener Strom pro Name: neue Parameter verschieben die alten nicht.
  fork(name) {
    return new Rng(mix32((this.state ^ hashString(name)) >>> 0));
  }
  nextU32() {
    this.state = (this.state + 0x9e3779b9) >>> 0;
    return mix32(this.state);
  }
  // [0, 1), Auflösung 2^-32, exakt als double darstellbar.
  float() {
    return this.nextU32() / 4294967296;
  }
  range(a, b) {
    return a + (b - a) * this.float();
  }
}
