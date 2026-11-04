// Eigene Effekte für Saltmoor im pixelfx-Format (meta + draw(p, t, o) oder create(o)), gebaut auf dem Kern aus
// js/vendor/pixelfx/src/core. Ruhig und dunkel: Farben kommen nur aus o.palette (dunkel → hell, 7 Stufen,
// die letzte ist der eine helle Akzent). Kein Weiß, keine Sterne, kein Konfetti.
// Effekte am Körper lesen o.actor ({ mask, pixels, x, y, w, h } mit den Füßen bei 0,0, wie in pixelfx);
// ohne actor nehmen sie eine einfache Ellipse in der Größe o.groesse.

import { fit, hex, mix, rand, rng, clamp, smooth, ease, TAU, noise2, band, stream } from "../vendor/pixelfx/src/core/index.js";
import { shape, tongue, smoke, ember, haze } from "../vendor/pixelfx/src/fx/status/_lib.js";

const BAY = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bay = (x, y) => BAY[((y & 3) << 2) | (x & 3)];
const ramp = (o, n = 7) => fit(o.palette, n);
/** Hüllkurve: weich an, halten, weich aus. */
const huelle = (t, an, aus, D) => smooth(0, an, t) * (1 - smooth(D - aus, D, t));

// Ersatzkörper, wenn kein Bild des Gegners mitkommt: eine stehende Ellipse, Füße bei (0, 0).
const ERSATZ = new Map();
export function ersatzKoerper(groesse = 48) {
  const h = Math.max(8, Math.round(groesse)), w = Math.max(6, Math.round(groesse * 0.55));
  const key = w + "x" + h;
  if (ERSATZ.has(key)) return ERSATZ.get(key);
  const data = new Uint8Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const dx = (x + 0.5 - w / 2) / (w / 2), dy = (y + 0.5 - h * 0.55) / (h * 0.55);
      if (dx * dx + dy * dy <= 1) data[y * w + x] = 1;
    }
  const a = { mask: { w, h, data }, pixels: null, x: -Math.floor(w / 2), y: -h, w, h, k: 1 };
  ERSATZ.set(key, a);
  return a;
}
const koerper = (o) => (o.actor && o.actor.mask && !o.actor.stock ? o.actor : ersatzKoerper(o.groesse));

// Ein paar Stellen am oberen Umriss, gleichmäßig über die Breite verteilt (für Flammen, Blasen).
const STELLEN = new WeakMap();
function stellen(a, n, seed) {
  let m = STELLEN.get(a.mask);
  if (!m) STELLEN.set(a.mask, (m = new Map()));
  const key = n + ":" + seed;
  if (m.has(key)) return m.get(key);
  const S = shape(a), R = rng(seed, 77), out = [];
  for (let i = 0; i < n; i++) {
    const x0 = (S.w * i) / n, x1 = (S.w * (i + 1)) / n;
    const cand = S.up.filter(([x]) => x >= x0 && x < x1);
    if (!cand.length) continue;
    // eher oben am Körper, aber nicht nur der Scheitel
    cand.sort((p, q) => p[1] - q[1]);
    const [x, y] = cand[Math.floor(Math.pow(R.next(), 1.6) * cand.length)];
    out.push({ x: a.x + x + 0.5, y: a.y + y + 0.5, n: i * 13 + seed });
  }
  m.set(key, out);
  return out;
}

// ---------------------------------------------------------------- Brand: kurze Flammen am Körper
export const brand = {
  meta: {
    name: "Brand", desc: "Kleine Flammenzungen an den oberen Kanten des Körpers, Funken und dünner Rauch, kurz.",
    size: [120, 150], origin: [60, 130], duration: 1.6, loop: false, fps: 30,
    options: { palette: ["#120806", "#2a120a", "#4a1f10", "#74331a", "#9a5428", "#c07a3a", "#e0a868"], groesse: 48, seed: 3 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), F = fit(o.palette, 9).reverse().map(hex), a = koerper(o), D = 1.6;
    const env = huelle(t, 0.12, 0.6, D), k = clamp(a.h / 48, 0.8, 1.7);
    const sp = stellen(a, clamp(Math.round(a.w / 9), 3, 7), o.seed);
    // ganz kalte Flammen: ohne weißen Kern
    const LAG = [[1, 1, 7], [0.72, 0.8, 5], [0.45, 0.58, 3]];
    sp.forEach((s, i) => {
      const fl = 0.75 + 0.35 * noise2(t * 6, i * 3.1, o.seed);
      const h = (3 + 3 * rand(i, o.seed)) * k * fl * env;
      tongue(p, s.x, s.y, h, 1 + 0.4 * k, -1.2 * h / 5, F, t, D, s.n, LAG);
      p.glow(s.x, s.y - h * 0.4, 5 + 3 * k, C[4], 0.14 * env);
    });
    // Funken steigen auf und kühlen ab
    stream(t, 0.05, D - 0.5, 16 * k, o.seed + 1, (r) => r.range(0.45, 0.9), (age, life, r, i) => {
      const s = sp[i % sp.length], x = s.x + r.range(-2, 2) - age * r.range(4, 12), y = s.y - 2 - age * r.range(18, 34);
      ember(p, x, y, age / life, [C[6], C[4], C[2]], age + i, 0.6);
    });
    // dünner Rauch
    stream(t, 0.1, D - 0.3, 7, o.seed + 2, (r) => r.range(0.7, 1.1), (age, life, r, i) => {
      const s = sp[(i * 3) % sp.length];
      smoke(p, s.x - age * 6 + Math.sin(age * 4 + i), s.y - 5 - age * 16, r.range(1, 1.8) * k, age / life, C[1], 0.7);
    });
  },
};

// ---------------------------------------------------------------- Gift: sickert, tropft, Blasen
export const gift = {
  meta: {
    name: "Gift", desc: "Dunkle Flecken sickern über den Körper, Tropfen fallen, kleine Blasen steigen und platzen, Dunst am Boden.",
    size: [120, 150], origin: [60, 130], duration: 1.8, loop: false, fps: 30,
    options: { palette: ["#060a05", "#0e1609", "#1a2810", "#2c4219", "#466428", "#6a8a3a", "#a8c870"], groesse: 48, seed: 5 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), a = koerper(o), S = shape(a), D = 1.8, env = huelle(t, 0.2, 0.7, D);
    // Flecken über dem Körper (gedithert, wandern langsam nach unten)
    for (const [mx, my] of S.body) {
      const n = noise2(mx * 0.18, my * 0.18 - t * 1.2, o.seed);
      const k = clamp((n - 0.15) * 2.2) * env;
      if (k > 0.05) p.dot(a.x + mx, a.y + my, n > 0.55 ? C[3] : C[2], k * 0.7);
    }
    // Tropfen von den Seitenkanten
    const seiten = S.side;
    stream(t, 0.15, D - 0.5, 10, o.seed + 1, (r) => r.range(0.4, 0.75), (age, life, r, i) => {
      const [mx, my] = seiten[Math.floor(r.next() * seiten.length)];
      const x = a.x + mx + 0.5, y0 = a.y + my + 0.5, y = Math.min(-1, y0 + 4 * age + 160 * age * age);
      const c = age / life < 0.6 ? C[4] : C[3];
      p.px(x, y, c);
      if (y < -1.5) p.dot(x, y - 1, C[3], 0.7);
      else p.dot(x + (i % 2 ? 1 : -1), -1, C[3], 1 - age / life);
    });
    // Blasen: steigen vom oberen Umriss, platzen
    const sp = stellen(a, 5, o.seed);
    stream(t, 0.1, D - 0.6, 6, o.seed + 2, (r) => r.range(0.5, 0.9), (age, life, r, i) => {
      const s = sp[i % sp.length], u = age / life, x = s.x + r.range(-3, 3) + Math.sin(age * 7 + i) * 0.8, y = s.y - age * r.range(8, 16);
      if (u < 0.85) {
        const rr = u < 0.3 ? 0.6 : 1.4;
        p.circle(x, y, rr, C[5], 0.9);
        p.px(x - 0.5, y - 0.6, C[6]);
      } else for (const [dx, dy] of [[-2, 0], [2, 0], [0, -2], [-1, 1], [1, 1]]) p.px(x + dx, y + dy, C[4]);
    });
    // Dunst am Boden
    haze(p, 0, -1, a.w * 0.7, 3, C[3], 0.35 * env);
    p.glow(0, a.y * 0.4, a.h * 0.45, C[3], 0.08 * env);
  },
};

// ---------------------------------------------------------------- Geschwächt: Dunkel sinkt durch den Körper
export const geschwaecht = {
  meta: {
    name: "Geschwächt", desc: "Ein dunkles Band sinkt vom Kopf zu den Füßen, matte Flocken fallen ab, am Boden zieht sich ein Ring zusammen.",
    size: [120, 150], origin: [60, 130], duration: 1.6, loop: false, fps: 30,
    options: { palette: ["#050407", "#0c0a10", "#16131c", "#26212e", "#3c3446", "#5c5068", "#8a7c96"], groesse: 48, seed: 7 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), a = koerper(o), S = shape(a), D = 1.6, env = huelle(t, 0.1, 0.5, D);
    const front = ease.inOutSine(clamp(t / 1.0));
    for (const [mx, my] of S.body) {
      const u = my / S.h, d = front - u;
      // hinter der Front bleibt ein leichter Schleier, an der Front ist es am dunkelsten
      const k = d < 0 ? 0 : d < 0.12 ? 0.75 : 0.3;
      if (k * env > 0) p.dot(a.x + mx, a.y + my, d < 0.12 ? C[0] : C[1], k * env);
      if (d >= 0 && d < 0.03 && (S.rows[my][0] === mx || S.rows[my][1] === mx)) p.dot(a.x + mx, a.y + my, C[4], env);
    }
    // matte Flocken lösen sich an der Front von den Seiten und sinken
    stream(t, 0.05, 1.1, 22, o.seed + 1, (r) => r.range(0.6, 1.1), (age, life, r, i) => {
      const geboren = 0.05 + i / 22, my = Math.floor(ease.inOutSine(clamp(geboren / 1.0)) * (S.h - 1));
      const row = S.rows[Math.min(S.h - 1, Math.max(0, my))];
      if (!row || row[0] < 0) return;
      const side = r.chance(0.5) ? -1 : 1, mx = side < 0 ? row[0] - 1 : row[1] + 1;
      const x = a.x + mx + side * age * r.range(2, 6) + Math.sin(age * 5 + i), y = Math.min(-1, a.y + my + age * r.range(14, 26));
      p.dot(x, y, age / life < 0.5 ? C[5] : C[4], 1 - age / life);
    });
    // am Boden zieht sich ein matter Ring zusammen
    const q = clamp((t - 0.6) / 0.9);
    if (q > 0 && q < 1) band(p, 0, 0, a.w * (0.9 - 0.5 * ease.outCubic(q)), 0.22, 1.2, (1 - q) * 0.9, [C[2], C[3], C[4], C[5]]);
  },
};

// ---------------------------------------------------------------- Block baut sich auf
export const blockAuf = {
  meta: {
    name: "Block auf", desc: "Ein Schild aus Rautengitter wächst von unten nach oben, der Rand fängt Licht, dann wird es still und blass.",
    size: [100, 110], origin: [50, 100], duration: 1.2, loop: false, fps: 30,
    options: { palette: ["#07090c", "#10161c", "#1c2630", "#2e3c4a", "#4a5e70", "#7890a4", "#b4c8d8"], groesse: 48, seed: 11 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), D = 1.2, G = o.groesse, rx = G * 0.42, ry = G * 0.62, cy = -ry;
    const auf = ease.outCubic(clamp(t / 0.38)), aus = 1 - smooth(0.55, D, t);
    const front = ry - 2 * ry * auf; // y relativ zur Mitte, wandert von unten nach oben
    const g = Math.max(4, Math.round(G / 9));
    for (let y = Math.floor(-ry); y <= Math.ceil(ry); y++)
      for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++) {
        const d = (x / rx) ** 2 + (y / ry) ** 2;
        if (d > 1 || y < front) continue;
        const rand_ = d > 0.86, gitter = ((x + y + 400) % g === 0) || ((x - y + 400) % g === 0);
        if (!rand_ && !gitter) continue;
        const naheFront = y - front < 2.5 && auf < 1;
        const c = naheFront ? C[6] : rand_ ? (x > 0 && y < 0 ? C[5] : C[4]) : C[3];
        const a = naheFront ? 1 : (rand_ ? 1 : 0.8) * (0.35 + 0.65 * aus) * aus;
        p.dot(x, cy + y, c, a);
      }
    if (auf < 1) p.glowLine(-rx * 0.8, cy + front, rx * 0.8, cy + front, 5, C[5], 0.25);
    p.glow(0, cy, G * 0.6, C[4], 0.12 * aus * (0.5 + 0.5 * auf));
  },
};

// ---------------------------------------------------------------- Heilen: Lichtteilchen steigen auf
export const heilen = {
  meta: {
    name: "Heilen", desc: "Ein Ring am Boden öffnet sich, ruhige Lichtteilchen steigen in einer Säule auf, ein leiser Schein.",
    size: [100, 140], origin: [50, 124], duration: 1.8, loop: false, fps: 30,
    options: { palette: ["#0a0a06", "#18170c", "#2c2a16", "#4a4626", "#706a3e", "#a29a62", "#d8d0a0"], groesse: 48, seed: 13 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), D = 1.8, G = o.groesse, env = huelle(t, 0.25, 0.7, D), W = G * 0.45;
    const q = clamp(t / 0.9);
    if (q < 1) band(p, 0, 0, 4 + W * ease.outCubic(q), 0.24, 1.5, (1 - q) * 1.1, [C[3], C[4], C[5], C[6]]);
    stream(t, 0.05, D - 0.6, 26, o.seed, (r) => r.range(0.7, 1.2), (age, life, r, i) => {
      const u = age / life, x0 = r.range(-W, W) * 0.8, x = x0 + Math.sin(age * 3 + i) * 1.5, y = -1 - age * r.range(30, 60);
      const c = u < 0.25 ? C[6] : u < 0.6 ? C[5] : C[4];
      p.dot(x, y, c, 1 - u * u);
      if (r.chance(0.35)) p.dot(x, y + 1, C[3], (1 - u) * 0.8);
    });
    p.glowLine(0, -2, 0, -G * 1.2, W * 0.9, C[4], 0.12 * env);
    p.glow(0, -2, W * 1.1, C[5], 0.16 * env);
  },
};

// ---------------------------------------------------------------- Hochreaktion: Licht flammt ruhig auf
export const hochreaktion = {
  meta: {
    name: "Hochreaktion", desc: "Ein weiter Schein schwillt an und ab, zwei Ringe laufen langsam auseinander, Teilchen steigen. Groß, aber ruhig.",
    size: [240, 180], origin: [120, 110], duration: 2.6, loop: false, fps: 30,
    options: { palette: ["#0a0806", "#1a140c", "#2e2414", "#4a3a20", "#7a6034", "#b08c50", "#e8cc90"], groesse: 90, seed: 17 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), D = 2.6, G = o.groesse;
    const atem = smooth(0, 0.7, t) * (1 - smooth(1.0, D, t));
    // Licht: anschwellen wie ein Atemzug
    p.glow(0, 0, G * (0.6 + 0.4 * atem), C[5], 0.42 * atem);
    p.glow(0, 0, G * 0.25, C[6], 0.3 * atem * atem);
    p.glowLine(0, -G * 0.9, 0, G * 0.4, G * 0.18, C[5], 0.16 * atem);
    // zwei Ringe, flach, laufen langsam auseinander
    for (const [t0, s] of [[0.15, 1], [0.55, 0.8]]) {
      const q = clamp((t - t0) / 1.8);
      if (q > 0 && q < 1) band(p, 0, G * 0.35, 6 + G * s * ease.outCubic(q), 0.3, 1.6, (1 - q) * 1.1, [C[3], C[4], C[5], C[6]]);
    }
    // ein heller Kern, der ruhig pulsiert
    const kern = atem * (0.85 + 0.15 * Math.sin(t * 9));
    if (kern > 0.05) {
      p.circle(0, 0, 1.5 + 2.5 * kern, C[5], kern);
      p.circle(0, 0, 0.8 + 1.2 * kern, C[6], kern);
    }
    // Teilchen steigen aus der Fläche
    stream(t, 0.2, D - 0.7, 30, o.seed, (r) => r.range(0.9, 1.5), (age, life, r, i) => {
      const u = age / life, x = r.range(-G, G) * 0.9, y = G * 0.35 - r.range(0, G * 0.2) - age * r.range(20, 45);
      p.dot(x + Math.sin(age * 2 + i) * 2, y, u < 0.3 ? C[6] : C[5], (1 - u) * 0.9);
    });
  },
};

// ---------------------------------------------------------------- Übergang zwischen Akten (ganze Szene)
// Dunkel kriecht von den Rändern herein (gedithert, mit Nebelkante in der Zonenfarbe), schließt sich ganz
// (Mitte: Szene wechseln), öffnet sich wieder. Ursprung oben links, o.w × o.h Pixel.
export const uebergang = {
  meta: {
    name: "Übergang", desc: "Dunkel kriecht von den Rändern herein, schließt die Szene, öffnet sie wieder.",
    size: [480, 270], origin: [0, 0], duration: 2.4, loop: false, fps: 30,
    options: { palette: ["#030406", "#07090d", "#0e1320", "#1a2436", "#2a3a52", "#4a6a8a", "#8aa8c8"], w: 480, h: 270, seed: 19 },
  },
  create(o) {
    const W = o.w, H = o.h, C = ramp(o).map(hex), schwelle = new Float32Array(W * H);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const dx = (x + 0.5 - W / 2) / (W / 2), dy = (y + 0.5 - H / 2) / (H / 2);
        const v = 1 - Math.min(1, Math.sqrt(dx * dx * 0.8 + dy * dy * 1.1) / 1.25);
        const n = noise2(x * 0.035, y * 0.05, o.seed) * 0.5 + noise2(x * 0.11, y * 0.13, o.seed + 1) * 0.2;
        schwelle[y * W + x] = clamp(v * 0.8 + n * 0.25 + 0.06);
      }
    let t = 0;
    return {
      update(dt) { t += dt; },
      draw(p) {
        const D = 2.4, h = D / 2;
        const q = t < h ? ease.inOutSine(clamp(t / (h * 0.85))) : 1 - ease.inOutSine(clamp((t - h - h * 0.15) / (h * 0.85)));
        const g = q * 1.12;
        for (let y = 0; y < H; y++)
          for (let x = 0; x < W; x++) {
            const s = schwelle[y * W + x], d = g - s;
            if (d < -0.05) continue;
            let c;
            if (d > 0.02) c = C[0];
            else if (d > -0.01) c = C[2];
            else c = C[3];
            // Kante fein gedithert, damit sie nicht wie eine Linie wirkt
            if (d <= 0.02 && bay(x, y) > 0.55 + d * 8) continue;
            p.put(x, y, c, 1);
          }
      },
    };
  },
};

// ---------------------------------------------------------------- Reaktion: Ring/Welle in Stofffarbe
export const reaktion = {
  meta: {
    name: "Reaktion", desc: "Punkte ziehen sich zusammen, ein kurzer Kern, dann laufen zwei Ringe in der Stofffarbe auseinander.",
    size: [140, 110], origin: [70, 55], duration: 1.3, loop: false, fps: 30,
    options: { palette: ["#06080c", "#0c121c", "#16202e", "#223246", "#344a64", "#4c6888", "#9ab8d8"], groesse: 40, seed: 23 },
  },
  draw(p, t, o) {
    const C = ramp(o).map(hex), G = o.groesse, T0 = 0.24;
    // Anlauf: Punkte ziehen sich auf die Mitte zusammen
    if (t < T0 + 0.04)
      for (let i = 0; i < 14; i++) {
        const an = (i / 14) * TAU + rand(i, o.seed) * 0.4, q = ease.inCubic(clamp(t / T0)), r = G * 0.8 * (1 - q) + 2;
        p.px(Math.cos(an) * r, Math.sin(an) * r * 0.6, q > 0.7 ? C[5] : C[4]);
        if (q > 0.3) p.px(Math.cos(an) * (r + 1.5), Math.sin(an) * (r + 1.5) * 0.6, C[3]);
      }
    // Kern
    const k = clamp(1 - Math.abs(t - T0) / 0.18);
    if (k > 0) {
      p.circle(0, 0, 1 + 3 * k, C[4], k);
      p.circle(0, 0, 0.6 + 1.5 * k, C[6], k);
      p.glow(0, 0, G * 0.6, C[5], 0.35 * k);
    }
    // zwei Ringe, leicht schräg, laufen aus
    for (const [t0, s, sy] of [[T0, 1, 0.6], [T0 + 0.14, 0.7, 0.45]]) {
      const q = clamp((t - t0) / 0.95);
      if (q <= 0 || q >= 1) continue;
      const r = 3 + G * s * ease.outCubic(q);
      band(p, 0, 0, r, sy, Math.max(1, 2.4 * (1 - q)), 1.15 - q, [C[2], C[3], C[5], C[6]]);
    }
    // Splitter in der Stofffarbe treiben nach außen
    stream(t, T0, T0 + 0.05, 200, o.seed, (r) => r.range(0.5, 0.9), (age, life, r, i) => {
      const an = r.range(0, TAU), v = r.range(20, 45) * (G / 40), u = age / life;
      const x = Math.cos(an) * v * age * (1 - 0.4 * age), y = Math.sin(an) * v * age * 0.6 * (1 - 0.4 * age);
      p.dot(x, y, u < 0.4 ? C[5] : C[4], 1 - u);
    });
  },
};
