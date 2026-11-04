// Die ganze Kette: Genom -> Skelett -> Volumen rastern -> Schattierung -> Aufräumregeln -> Umriss -> RGBA.
import { readFileSync } from 'node:fs';
import { buildSkeleton } from './skeleton.js';
import { rasterize } from './raster.js';
import { shade } from './shade.js';
import { cleanup } from './cleanup.js';
import { innerEdges, outerOutline } from './outline.js';
import { TRANSPARENT, OUTLINE, RAMP0 } from './indexed.js';

export const DEFAULT_SIZE = { w: 64, h: 80, footX: 32, footY: 78 };

export function generate(genome, opts = {}) {
  const size = opts.size || DEFAULT_SIZE;
  const rules = opts.cleanup === false ? {} : (opts.rules || { orphans: true, staircase: true, banding: true });
  const skeleton = buildSkeleton(genome, size);
  const buf = rasterize(skeleton);
  const shaded = shade(buf);
  const cleaned = cleanup(shaded, rules);
  const edged = opts.innerEdges === false ? cleaned : innerEdges(cleaned, buf);
  const final = outerOutline(edged);
  return { skeleton, buf, shaded, cleaned, image: final };
}

export function loadPalette(name) {
  const url = new URL(`../palettes/${name}.json`, import.meta.url);
  return JSON.parse(readFileSync(url, 'utf8'));
}

function hex(c) {
  return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
}

// Index-Bild -> RGBA (erst ganz am Ende).
export function toRGBA(img, palette) {
  const lut = [[0, 0, 0, 0], [...hex(palette.outline), 255], ...palette.ramp.map((c) => [...hex(c), 255])];
  const out = new Uint8Array(img.w * img.h * 4);
  for (let i = 0; i < img.w * img.h; i++) out.set(lut[img.px[i]], i * 4);
  return out;
}

export { TRANSPARENT, OUTLINE, RAMP0 };
