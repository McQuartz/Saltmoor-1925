// Schattierung: Lambert-Licht aus der Normalen, in RAMP_SIZE Stufen quantisiert.
// Hintere Ebene (ferne Gliedmaßen) eine Spur dunkler, damit sie sich lösen.
import { makeIndexImage, RAMP0, RAMP_SIZE } from './indexed.js';

export const LIGHT = normalize([-0.55, -0.7, 0.55]); // von oben links vorne
export const AMBIENT = 0.12;
export const BACK_DARKEN = 0.16;
// Schwellen für die Stufen 1..3 (Stufe 0 darunter).
export const THRESHOLDS = [0.3, 0.55, 0.8];

function normalize(v) {
  const l = Math.hypot(v[0], v[1], v[2]);
  return [v[0] / l, v[1] / l, v[2] / l];
}

export function shade(buf) {
  const img = makeIndexImage(buf.w, buf.h);
  for (let i = 0; i < buf.w * buf.h; i++) {
    if (!buf.cover[i]) continue;
    const ndl = buf.nx[i] * LIGHT[0] + buf.ny[i] * LIGHT[1] + buf.nz[i] * LIGHT[2];
    let l = AMBIENT + (1 - AMBIENT) * Math.max(0, ndl);
    if (buf.layer[buf.bone[i]] === 'back') l -= BACK_DARKEN;
    let step = 0;
    while (step < RAMP_SIZE - 1 && l >= THRESHOLDS[step]) step++;
    img.px[i] = RAMP0 + step;
  }
  return img;
}
