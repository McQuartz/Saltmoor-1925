// Kontaktbogen rendern: N aufeinanderfolgende Seeds ab Start-Seed, je Paar links ohne, rechts mit Aufräumregeln.
// Aufruf: node cli/sheet.js [startSeed=1] [count=16] [outFile] [scale=4]
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { makeGenome } from '../core/genome.js';
import { generate, loadPalette, toRGBA } from '../core/pipeline.js';
import { encodePNG } from '../core/png.js';

const start = Number(process.argv[2] ?? 1);
const count = Number(process.argv[3] ?? 16);
const out = resolve(process.argv[4] ?? `../../docs/spritegen/sheets/M1/biped_seed${start}-${start + count - 1}.png`);
const scale = Number(process.argv[5] ?? 4);

const COLS = 4;             // Paare pro Zeile
const GAP = 2;              // Abstand zwischen ohne/mit (in Sprite-Pixeln)
const PAD = 6;              // Abstand zwischen Paaren
const BG = [0xc9, 0xc3, 0xb6, 255];  // heller Grund, damit der Umriss sichtbar ist
const BG_PAIR = [0xb4, 0xad, 0x9e, 255];

const palette = loadPalette('tiefsee');
const W = 64, H = 80;
const pairW = W * 2 + GAP;
const rows = Math.ceil(count / COLS);
const sheetW = (COLS * pairW + (COLS + 1) * PAD) * scale;
const sheetH = (rows * H + (rows + 1) * PAD) * scale;
const sheet = new Uint8Array(sheetW * sheetH * 4);
for (let i = 0; i < sheetW * sheetH; i++) sheet.set(BG, i * 4);

function blit(rgba, ox, oy) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const s = (y * W + x) * 4;
      const c = rgba[s + 3] ? rgba.subarray(s, s + 4) : BG_PAIR;
      for (let j = 0; j < scale; j++) {
        for (let i = 0; i < scale; i++) {
          sheet.set(c, (((oy + y) * scale + j) * sheetW + (ox + x) * scale + i) * 4);
        }
      }
    }
  }
}

const t0 = process.hrtime.bigint();
const hash = createHash('sha256');
for (let k = 0; k < count; k++) {
  const seed = start + k;
  const genome = makeGenome(seed);
  const raw = generate(genome, { cleanup: false });
  const clean = generate(genome, { cleanup: true });
  hash.update(raw.image.px).update(clean.image.px);
  const col = k % COLS, row = Math.floor(k / COLS);
  const ox = PAD + col * (pairW + PAD), oy = PAD + row * (H + PAD);
  blit(toRGBA(raw.image, palette), ox, oy);
  blit(toRGBA(clean.image, palette), ox + W + GAP, oy);
}
const ms = Number(process.hrtime.bigint() - t0) / 1e6;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, encodePNG(sheetW, sheetH, sheet));
console.log(`${out}\n${count} Seeds ab ${start}, ${ms.toFixed(0)} ms (${(ms / count / 2).toFixed(1)} ms je Sprite), Index-Hash ${hash.digest('hex').slice(0, 16)}`);
