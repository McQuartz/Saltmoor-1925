// Umriss: Außenumriss (transparente Pixel neben dem Körper werden Umriss)
// und Innenkanten (wo ein Körperteil deutlich vor einem anderen liegt, wird der hintere Pixel dunkelste Stufe).
import { cloneIndexImage, TRANSPARENT, OUTLINE, RAMP0, isBody } from './indexed.js';

const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];

export function outerOutline(img) {
  const out = cloneIndexImage(img);
  const { w, h, px } = img;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[y * w + x] !== TRANSPARENT) continue;
      for (const [dx, dy] of N4) {
        const X = x + dx, Y = y + dy;
        if (X >= 0 && Y >= 0 && X < w && Y < h && isBody(px[Y * w + X])) {
          out.px[y * w + x] = OUTLINE;
          break;
        }
      }
    }
  }
  return out;
}

export const INNER_EDGE_DEPTH = 2.5; // Pixel Tiefensprung

export function innerEdges(img, buf) {
  const out = cloneIndexImage(img);
  const { w, h, px } = img;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!isBody(px[i])) continue;
      for (const [dx, dy] of N4) {
        const X = x + dx, Y = y + dy;
        if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
        const j = Y * w + X;
        if (!isBody(px[j]) || buf.group[j] === buf.group[i]) continue;
        if (buf.depth[j] - buf.depth[i] > INNER_EDGE_DEPTH) {
          out.px[i] = RAMP0;
          break;
        }
      }
    }
  }
  return out;
}
