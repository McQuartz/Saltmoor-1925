// Index-Bild: bis kurz vor Schluss wird mit Rampen-Indizes gearbeitet, nicht mit RGB.
// 0 = transparent, 1 = Umriss, 2..(2+RAMP-1) = Rampe von dunkel nach hell.
export const TRANSPARENT = 0;
export const OUTLINE = 1;
export const RAMP0 = 2;
export const RAMP_SIZE = 4;

export const isBody = (v) => v >= RAMP0;

export function makeIndexImage(w, h) {
  return { w, h, px: new Uint8Array(w * h) };
}

export function cloneIndexImage(img) {
  return { w: img.w, h: img.h, px: new Uint8Array(img.px) };
}

// Aus Textzeilen für Regel-Tests: '.' = transparent, 'o' = Umriss, '0'..'3' = Rampe.
export function fromRows(rows) {
  const h = rows.length, w = rows[0].length;
  const img = makeIndexImage(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = rows[y][x];
      img.px[y * w + x] = c === '.' ? TRANSPARENT : c === 'o' ? OUTLINE : RAMP0 + Number(c);
    }
  }
  return img;
}

export function toRows(img) {
  const rows = [];
  for (let y = 0; y < img.h; y++) {
    let s = '';
    for (let x = 0; x < img.w; x++) {
      const v = img.px[y * img.w + x];
      s += v === TRANSPARENT ? '.' : v === OUTLINE ? 'o' : String(v - RAMP0);
    }
    rows.push(s);
  }
  return rows;
}
