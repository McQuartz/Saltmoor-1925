// Goldens neu erzeugen. Nur bewusst aufrufen und in docs/spritegen/entscheidungen.md begründen!
// Aufruf: node cli/golden.js
import { writeFileSync, mkdirSync } from 'node:fs';
import { makeGenome } from '../core/genome.js';
import { generate, loadPalette, toRGBA } from '../core/pipeline.js';
import { encodePNG } from '../core/png.js';

export const GOLDEN_SEEDS = [1, 2, 3, 4, 5, 6, 7, 8, 100, 4711];
const dir = new URL('../golden/', import.meta.url);
mkdirSync(dir, { recursive: true });
const palette = loadPalette('tiefsee');
for (const seed of GOLDEN_SEEDS) {
  for (const clean of [false, true]) {
    const r = generate(makeGenome(seed), { cleanup: clean });
    const name = `biped_${seed}_${clean ? 'clean' : 'raw'}.png`;
    writeFileSync(new URL(name, dir), encodePNG(64, 80, toRGBA(r.image, palette)));
    console.log(name);
  }
}
