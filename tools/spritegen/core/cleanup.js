// Aufräumregeln auf dem Index-Bild. Jede Regel ist eine reine Funktion Bild -> Bild,
// liest nur das Eingabebild und schreibt in eine Kopie (Ergebnis hängt nicht von der Laufreihenfolge ab).
import { cloneIndexImage, TRANSPARENT, isBody } from './indexed.js';

const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const N8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, 1], [1, -1], [-1, -1]];

function at(img, x, y) {
  if (x < 0 || y < 0 || x >= img.w || y >= img.h) return TRANSPARENT;
  return img.px[y * img.w + x];
}

// Häufigster Wert unter den Kandidaten, gezählt in der 8er-Nachbarschaft. Gleichstand: dunkler (kleiner).
function pickByNeighbourhood(img, x, y, candidates) {
  let best = -1, bestCount = -1;
  const sorted = [...new Set(candidates)].sort((a, b) => a - b);
  for (const c of sorted) {
    let n = 0;
    for (const [dx, dy] of N8) if (at(img, x + dx, y + dy) === c) n++;
    if (n > bestCount) { best = c; bestCount = n; }
  }
  return best;
}

// Regel 1: Einzelpixel.
// a) Körperpixel mit höchstens einem Körper-Nachbarn (Sporn) -> transparent.
// b) Transparentes Pixel mit mindestens drei Körper-Nachbarn (Loch, Kerbe) -> füllen.
// c) Körperpixel, dessen Körper-Nachbarn (mindestens zwei) alle einen anderen Ton haben -> häufigster Nachbarton.
export function ruleOrphans(img) {
  const out = cloneIndexImage(img);
  for (let y = 0; y < img.h; y++) {
    for (let x = 0; x < img.w; x++) {
      const v = at(img, x, y);
      const nb = N4.map(([dx, dy]) => at(img, x + dx, y + dy)).filter(isBody);
      if (isBody(v)) {
        if (nb.length <= 1) out.px[y * img.w + x] = TRANSPARENT;
        else if (nb.every((n) => n !== v)) out.px[y * img.w + x] = pickByNeighbourhood(img, x, y, nb);
      } else if (v === TRANSPARENT && nb.length >= 3) {
        out.px[y * img.w + x] = pickByNeighbourhood(img, x, y, nb);
      }
    }
  }
  return out;
}

// Regel 2: Treppen glätten (Silhouette).
// Entlang einer Kante sollen die Stufenlängen gleichmäßig wachsen oder schrumpfen.
// Eine einzelne 1-Pixel-Stufe zwischen langen Stufen derselben Richtung (z. B. 4,1,4) ist ein Zacken.
// Abhilfe: Die längere Nachbarstufe gibt eine Zeile ab (4,1,4 -> 3,2,4). Ein Pixel Änderung pro Fund.
// Umgesetzt für "linke Kanten"; rechte, obere und untere Kanten über Spiegeln/Transponieren.
const ORIENTATIONS = [
  { name: 'links', dims: (w, h) => [w, h], map: (u, v, w, h) => [u, v] },
  { name: 'rechts', dims: (w, h) => [w, h], map: (u, v, w, h) => [w - 1 - u, v] },
  { name: 'oben', dims: (w, h) => [h, w], map: (u, v, w, h) => [v, u] },
  { name: 'unten', dims: (w, h) => [h, w], map: (u, v, w, h) => [v, h - 1 - u] },
];

function staircaseOneOrientation(img, o) {
  const [U, V] = o.dims(img.w, img.h);
  const get = (u, v) => {
    if (u < 0 || v < 0 || u >= U || v >= V) return TRANSPARENT;
    const [x, y] = o.map(u, v, img.w, img.h);
    return img.px[y * img.w + x];
  };
  const body = (u, v) => isBody(get(u, v));
  const edge = (u, v) => body(u, v) && !body(u - 1, v);

  // Kanten-Ketten bilden: Nachfolger in der nächsten Zeile bei u, u-1 oder u+1.
  const succ = new Map();
  const claimed = new Set();
  const key = (u, v) => v * U + u;
  for (let v = 0; v < V - 1; v++) {
    for (let u = 0; u < U; u++) {
      if (!edge(u, v)) continue;
      for (const du of [0, -1, 1]) {
        const k = key(u + du, v + 1);
        if (u + du >= 0 && u + du < U && edge(u + du, v + 1) && !claimed.has(k)) {
          succ.set(key(u, v), u + du);
          claimed.add(k);
          break;
        }
      }
    }
  }

  const edits = []; // {u, v, op:'add'|'remove'}
  for (let v = 0; v < V; v++) {
    for (let u = 0; u < U; u++) {
      if (!edge(u, v) || claimed.has(key(u, v))) continue;
      // Kette ablaufen.
      const chain = [];
      let cu = u, cv = v;
      for (;;) {
        chain.push(cu);
        const k = key(cu, cv);
        if (!succ.has(k)) break;
        cu = succ.get(k);
        cv++;
      }
      // Stufen (gleiches u in Folge).
      const runs = [];
      for (let i = 0; i < chain.length; i++) {
        if (runs.length && runs[runs.length - 1].u === chain[i]) runs[runs.length - 1].len++;
        else runs.push({ u: chain[i], len: 1, start: v + i });
      }
      for (let i = 1; i < runs.length - 1; i++) {
        const p = runs[i - 1], c = runs[i], n = runs[i + 1];
        const s = c.u - p.u;
        if (c.len !== 1 || s === 0 || n.u - c.u !== s) continue;
        if (Math.min(p.len, n.len) < 2 || Math.max(p.len, n.len) < 3) continue;
        if (p.len >= n.len) {
          const r = c.start - 1; // letzte Zeile der vorigen Stufe wandert zu p.u + s
          if (s > 0) edits.push({ u: p.u, v: r, op: 'remove' });
          else edits.push({ u: p.u - 1, v: r, op: 'add', from: [p.u, r] });
        } else {
          const r = n.start; // erste Zeile der nächsten Stufe wandert zu n.u - s
          if (s > 0) edits.push({ u: n.u - 1, v: r, op: 'add', from: [n.u, r] });
          else edits.push({ u: n.u, v: r, op: 'remove' });
        }
      }
    }
  }

  const out = cloneIndexImage(img);
  for (const e of edits) {
    const [x, y] = o.map(e.u, e.v, img.w, img.h);
    if (e.op === 'remove') {
      // Nicht ausdünnen: nur entfernen, wenn innen weiter Körper ist.
      if (body(e.u + 1, e.v)) out.px[y * img.w + x] = TRANSPARENT;
    } else if (get(e.u, e.v) === TRANSPARENT) {
      out.px[y * img.w + x] = get(e.from[0], e.from[1]);
    }
  }
  return out;
}

export function ruleStaircase(img) {
  let cur = img;
  for (const o of ORIENTATIONS) cur = staircaseOneOrientation(cur, o);
  return cur;
}

// Regel 3: Banding brechen.
// Ein 1 Pixel breiter Zwischenton zwischen einem dunkleren und einem helleren Ton
// (waagerecht oder senkrecht) wirkt wie Kantenglättung bzw. wie Höhenlinien entlang des Umrisses.
// Voraussetzung: Beide Nachbarbänder sind mindestens 2 Pixel breit.
// Er wird einem der beiden Nachbartöne zugeschlagen (häufiger in der 8er-Nachbarschaft, Gleichstand: dunkler).
export function ruleBanding(img) {
  const out = cloneIndexImage(img);
  for (let y = 0; y < img.h; y++) {
    for (let x = 0; x < img.w; x++) {
      const v = at(img, x, y);
      if (!isBody(v)) continue;
      const cands = [];
      for (const [[ax, ay], [bx, by]] of [[[-1, 0], [1, 0]], [[0, -1], [0, 1]]]) {
        const a = at(img, x + ax, y + ay), b = at(img, x + bx, y + by);
        if (!isBody(a) || !isBody(b)) continue;
        // Nur zwischen breiten Bändern; eine Folge lauter 1-Pixel-Stufen ist ein gewollter Verlauf.
        if (at(img, x + 2 * ax, y + 2 * ay) !== a || at(img, x + 2 * bx, y + 2 * by) !== b) continue;
        if ((a < v && v < b) || (a > v && v > b)) cands.push(a, b);
      }
      if (cands.length) out.px[y * img.w + x] = pickByNeighbourhood(img, x, y, cands);
    }
  }
  return out;
}

export const RULES = {
  orphans: ruleOrphans,
  staircase: ruleStaircase,
  banding: ruleBanding,
};

export const DEFAULT_ORDER = ['banding', 'staircase', 'orphans'];

export function cleanup(img, enabled = { orphans: true, staircase: true, banding: true }) {
  let cur = img;
  for (const name of DEFAULT_ORDER) if (enabled[name]) cur = RULES[name](cur);
  return cur;
}
