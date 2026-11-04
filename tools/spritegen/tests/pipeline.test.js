import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeGenome } from '../core/genome.js';
import { generate, loadPalette, toRGBA } from '../core/pipeline.js';
import { encodePNG } from '../core/png.js';
import { Rng } from '../core/rng.js';

const GOLDEN_SEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 100, 4711];

test('RNG: feste Folge (Port-Referenz für Godot)', () => {
  const r = new Rng(1);
  assert.deepEqual([r.nextU32(), r.nextU32(), r.nextU32()], [2527132011, 314344336, 2535364964]);
});

test('Genom: gleicher Seed = gleiches Genom, JSON-Rundreise verlustfrei', () => {
  const a = makeGenome(42), b = makeGenome(42);
  assert.deepEqual(a, b);
  assert.deepEqual(JSON.parse(JSON.stringify(a)), a);
  assert.equal(a.v, 1);
  assert.notDeepEqual(makeGenome(43).params, a.params);
});

test('Determinismus: zweimal erzeugen = bitgleich', () => {
  for (const seed of [1, 9, 4711]) {
    const a = generate(makeGenome(seed)), b = generate(makeGenome(seed));
    assert.deepEqual(a.image.px, b.image.px);
  }
});

test('Füße stehen unten, Figur bleibt im Bild mit Rand', () => {
  for (let seed = 1; seed <= 32; seed++) {
    const { image } = generate(makeGenome(seed));
    const { w, h, px } = image;
    let bottom = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (px[y * w + x]) bottom = Math.max(bottom, y);
    assert.ok(bottom >= 78 && bottom <= 79, `Seed ${seed}: unterste Zeile ${bottom}`);
    for (let y = 0; y < h; y++) {
      assert.equal(px[y * w], 0, `Seed ${seed}: linker Rand belegt`);
      assert.equal(px[y * w + w - 1], 0, `Seed ${seed}: rechter Rand belegt`);
    }
    for (let x = 0; x < w; x++) assert.equal(px[x], 0, `Seed ${seed}: oberer Rand belegt`);
  }
});

test('Golden-Tests: bitgleich zu golden/*.png', () => {
  const palette = loadPalette('tiefsee');
  for (const seed of GOLDEN_SEEDS) {
    for (const clean of [false, true]) {
      const name = `biped_${seed}_${clean ? 'clean' : 'raw'}.png`;
      const expected = readFileSync(new URL(`../golden/${name}`, import.meta.url));
      const r = generate(makeGenome(seed), { cleanup: clean });
      const actual = encodePNG(64, 80, toRGBA(r.image, palette));
      assert.ok(actual.equals(expected), `${name} weicht ab`);
    }
  }
});
