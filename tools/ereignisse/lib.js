// Saltmoor 1925 · Ereignisbilder 160 × 90 (Zugabe 3).
// Gezeichnet wird mit denselben Bausteinen wie die Hintergründe (prototype/js/scenes/world/basis.js:
// Masken, B.form mit Fase und Randlicht, Bayer-Dither, gedithertes Glühen), hier in Node per vm geladen.
// Ein Bild ist eine kleine, ruhige Szene: ein Motiv, eine helle Stelle, viel dunkle Fläche.
// Zufall nur über K.r (gesät aus der Ereignis-ID), nie Math.random().
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const S = require('../sprites/lib.js');

const WURZEL = path.resolve(__dirname, '../..');
const BW = 160, BH = 90;

// ---------- basis.js (und Biom-Paletten) in einer Sandkiste laden ----------
const sand = { console };
sand.window = sand;
vm.createContext(sand);
function ladeSkript(rel) { vm.runInContext(fs.readFileSync(path.join(WURZEL, 'prototype', rel), 'utf8'), sand, { filename: rel }); }
ladeSkript('js/scenes/world/basis.js');
const World = sand.World, B = World.B, M = B.M, EW = B.EW;

// Neutrale Palette für biomübergreifende Ereignisse (biom "alle"): Schiefer, kaltes Randlicht, warmes Licht.
const NEUTRAL = { koerper: ['#08090b', '#12141a', '#1d2129', '#2c323d'], rand: ['#66727f', '#d4dae2'], augen: '#ffd27a', nebel: ['#11141a', '#2c323d'] };
const geladen = {};
function biomPal(biom) {
  if (!biom || biom === 'alle') return NEUTRAL;
  if (!geladen[biom]) {
    geladen[biom] = true;
    try { ladeSkript('js/scenes/world/' + biom + '.js'); } catch (e) { console.log('Hinweis: Palette für ' + biom + ' nicht geladen (' + e.message + '), nehme die neutrale.'); }
  }
  const d = World._biome[biom];
  return d && d.pal ? d.pal : NEUTRAL;
}

// Lichtfarben (wie hafen.js / basis.js)
const LICHT = {
  warm: '#ffd27a', warmK: '#fff0c0', warmG: '#6a4416', warmA: '#a06a20', glut: '#3a2208',
  kalt: '#cfe6ff', kaltG: '#1e3044', silber: '#e8f0f8', mond: '#e6ecf0', mondG: '#1a2230',
};

function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

// Rampe aus einer Akzentfarbe: 4 Stufen dunkel -> hell, zum dunkelsten Körperton gezogen
function rampe(pal, c, hell) {
  const k0 = pal.koerper[0], h = hell === undefined ? .8 : hell;
  return [B.mix(k0, c, h * .14), B.mix(k0, c, h * .3), B.mix(k0, c, h * .52), B.mix(k0, c, h * .8)];
}

// ---------- Kontext eines Bildes ----------
function kontext(id, biom) {
  const pal = biomPal(biom);
  const e = new B.Ebene();
  const seed = hashStr(id);
  const K = { id, biom, B, W: BW, H: BH, pal, e, r: B.rng(seed), seed: seed & 0xffff, LICHT, lq: null };
  K.fern = pal.fern || B.mix(pal.nebel[1], pal.rand[0], .35);
  K.pk = B.pk; K.mix = B.mix; K.maske = () => B.maske();
  K.rampe = (c, hell) => rampe(pal, c, hell);

  // Hauptlicht der Szene (Lampe, Mond): Randlicht zeigt dorthin. Ohne Angabe: oben rechts wie überall.
  K.lichtquelle = (x, y) => { K.lq = [x, y]; };
  K.L = (x, y) => {
    if (!K.lq) return B.L;
    const dx = K.lq[0] - x, dy = K.lq[1] - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l];
  };
  // Material wie K.mat der Hintergründe: tiefe 0 vorne, 1 ganz im Nebel
  K.mat = (tiefe, x) => {
    x = x || {}; const nf = x.nebelFarbe || K.fern, tf = tiefe || 0;
    const kc = (x.k || pal.koerper).map(c => B.pk(B.mix(c, nf, tf)));
    const rc = (x.r || pal.rand).map(c => B.pk(B.mix(c, nf, Math.min(1, tf * 1.15))));
    return Object.assign({ ton: 1, fase: 1, rand: tf > .55 ? 1 : 2 }, x, { k: kc, r: x.ohneRand || tf > .85 ? [] : rc });
  };
  // Form rendern; x.L zeigt das Randlicht, x.lichtVon: [x,y] = Licht von diesem Punkt
  K.form = (m, tiefe, x) => {
    x = Object.assign({}, x || {});
    if (!x.L && !m.leer()) x.L = x.lichtVon ? (() => { const cx = (m.x0 + m.x1) / 2, cy = (m.y0 + m.y1) / 2, dx = x.lichtVon[0] - cx, dy = x.lichtVon[1] - cy, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; })() : K.L((m.x0 + m.x1) / 2, (m.y0 + m.y1) / 2);
    B.form(e, m, K.mat(tiefe, x));
  };

  // ---------- Flächen ----------
  K.feld = (x0, y0, x1, y1, cols, tf) => B.feld(e, x0, y0, x1, y1, cols, tf);
  K.fuell = (cols, tf) => B.feld(e, 0, 0, BW, BH, cols, tf);
  K.dith = (x0, y0, x1, y1, c, af) => B.dith(e, x0, y0, x1, y1, c, af);
  K.linie = (x0, y0, x1, y1, c, a) => B.linie(e, x0, y0, x1, y1, B.pk(c), a);
  K.set = (x, y, c) => e.set(x, y, B.pk(c));
  K.get = (x, y) => e.get(x, y);
  K.rect = (x, y, w, h, c) => e.rect(x, y, w, h, B.pk(c));
  K.gluehen = (x, y, r, col, a, luft) => B.gluehen(e, x, y, r, col, a, luft);
  // Licht auf Flächen: hellt deckende Pixel in Stufen auf (Bayer, 3 Stufen), additiv in der Lichtfarbe.
  // o.oval: >1 drückt den Schein senkrecht zusammen, o.exp: Abfall, o.maske(x,y): nur dort
  K.licht = (x, y, r, col, st, o) => {
    o = o || {}; const C = B.col(col), n = o.stufen || 3, ex = o.exp || 1.6, ov = o.oval || 1;
    for (let j = Math.floor(y - r / ov); j <= y + r / ov; j++) for (let i = Math.floor(x - r); i <= x + r; i++) {
      if (o.maske && !o.maske(i, j)) continue;
      if (o.ohne && o.ohne.has(i, j)) continue;
      const q = Math.hypot(i + .5 - x, (j + .5 - y) * ov) / r; if (q >= 1) continue;
      const lv = Math.floor((st === undefined ? 1 : st) * Math.pow(1 - q, ex) * n + B.bay(i, j)) / n; if (lv > 0) e.add(i, j, C, Math.min(1, lv));
    }
  };
  // Kantenlicht: Randpixel einer Maske, die zum Licht (lx, ly) zeigen und näher als r sind, in Lichtfarben
  // (cols[0] außen im Abstand, cols[1] nah am Licht). Für Figuren, die eine Lampe vor sich halten.
  K.kante = (m, lx, ly, r, cols, o) => {
    o = o || {}; const P = cols.map(c => B.pk(c)), breit = o.breit || 1;
    for (let y = m.y0; y <= m.y1; y++) for (let x = m.x0; x <= m.x1; x++) {
      if (!m.has(x, y)) continue;
      const d = Math.hypot(x + .5 - lx, y + .5 - ly); if (d > r) continue;
      let nx = 0, ny = 0; for (let dy = -breit; dy <= breit; dy++) for (let dx = -breit; dx <= breit; dx++) if ((dx || dy) && !m.has(x + dx, y + dy)) { nx += dx; ny += dy; }
      if (!nx && !ny) continue;
      const f = (nx * (lx - x) + ny * (ly - y)) / (Math.hypot(nx, ny) * (d || 1)); if (f < (o.min === undefined ? .15 : o.min)) continue;
      const nah = d < r * (o.nah || .45) && f > .5;
      if (!nah && d > r * .7 && B.bay(x, y) > .5) continue;
      e.set(x, y, P[nah && P.length > 1 ? 1 : 0]);
    }
  };
  K.kegel = (x, y, win, breite, laenge, col, a) => B.kegel(e, x, y, win, breite, laenge, col, a);
  K.nebel = (y0, y1, dichte, col, o) => B.nebel(e, Object.assign({ y0, y1, dichte, col: col || pal.nebel[1], x0: 0, x1: BW, seed: K.seed }, o || {}));
  K.sterne = (n, y1, cols) => B.sterne(e, K.r, n, 0, 0, BW, y1, cols || [pal.nebel[1], pal.rand[0]], (x, y) => !!(e.get(x, y) >>> 24));

  // Himmel: senkrechte Rampe mit ruhigen Wolkenbänken; hell = Schein am Horizont (0..1)
  K.himmel = (y1, cols, o) => {
    o = o || {}; const s = K.seed;
    B.feld(e, 0, 0, BW, y1, cols, (x, y) => {
      const v = (y + 2) / (y1 + 2), g = o.gx === undefined ? 0 : Math.exp(-(((x - o.gx) / (o.gb || 60)) ** 2)) * .25 * v;
      return (o.basis === undefined ? .1 : o.basis) + v * (o.steil || .55) + g + (B.fbm(x * .03, y * .11, s, 2) - .5) * (o.wolken || .18);
    });
  };
  // Mond: Scheibe mit Randschatten und gedithertem Hof
  K.mond = (x, y, r, o) => {
    o = o || {};
    K.licht(x, y, r * (o.hof || 5), o.hofFarbe || '#141a24', .9);
    const m = B.maske(); m.ell(x, y, r, r);
    B.form(e, m, { k: [B.pk(B.mix(LICHT.mond, '#000000', .55)), B.pk(B.mix(LICHT.mond, '#000000', .35)), B.pk(B.mix(LICHT.mond, '#000000', .16)), B.pk(LICHT.mond)], r: [], ton: 2.8, fase: 1, rand: 0, L: [-.7, -.7], muster: (px, py) => (px - x) + (py - y) > r * .8 ? -.9 : 0 });
    K.lichtquelle(x, y);
  };
  // Wasser: dunkle Rampe mit waagerechten Wellenkämmen
  K.wasser = (y0, y1, cols, o) => {
    o = o || {}; const s = K.seed;
    B.feld(e, o.x0 || 0, y0, o.x1 || BW, y1, cols, (x, y) => {
      if (o.maske && !o.maske(x, y)) return -1;
      const q = (y - y0) / Math.max(1, y1 - y0), wel = Math.sin(y * 1.9 + B.rausch2(x * .05, y * .3, s) * 6);
      return (o.basis === undefined ? .18 : o.basis) + Math.pow(1 - q, 4) * (o.horizont === undefined ? .4 : o.horizont) + (wel > .8 ? .22 : 0) + (o.glanz ? o.glanz(x, y) : 0);
    });
  };
  // Spiegelung eines Lichts im Wasser: senkrechte, unterbrochene Spur
  K.spiegel = (x, y0, y1, col, breite, maske) => {
    const p = B.pk(col);
    for (let y = Math.floor(y0); y < y1; y++) {
      const q = (y - y0) / Math.max(1, y1 - y0), w = breite * (1 + q * 1.4), v = (1 - q) * .85;
      for (let px = Math.floor(x - w); px <= x + w; px++) { if (maske && !maske(px, y)) continue; if (Math.sin(y * 2.3 + px * .3) > .15 && B.hash(px, y, 2) < v * (1 - Math.abs(px - x) / (w + 1))) e.set(px, y, p); }
    }
  };
  // Mauer aus Quadern (Steinrampe + Fugen), maske(x,y) optional
  K.mauer = (x0, y0, x1, y1, cols, o) => {
    o = o || {}; const bh = o.hoehe || 6, bb = o.breite || 11, s = K.seed;
    B.feld(e, x0, y0, x1, y1, cols, (x, y) => {
      if (o.maske && !o.maske(x, y)) return -1;
      const row = Math.floor((y - y0) / bh), off = (row & 1) * bb / 2, col = Math.floor((x - x0 + off) / bb);
      const fy = (y - y0) % bh, fx = (x - x0 + off) % bb;
      let t = (o.ton === undefined ? .35 : o.ton) + (B.hash(col, row, s) - .5) * .18 + (o.tf ? o.tf(x, y) : 0);
      if (fy === 0 || fx < 1) t -= .25; else if (fy === 1) t += .08;
      return t;
    });
  };

  // ---------- Licht ----------
  // Statische Flamme (Kerze, Docht): y = Fuß der Flamme. gross 1 oder 2.
  K.flamme = (x, y, o) => {
    o = o || {}; const g = o.gross || 1; x = Math.round(x); y = Math.round(y);
    if (o.hof !== 0) K.licht(x, y - 2, o.hof || 26 * g, o.hofFarbe || LICHT.warmG, o.staerke || .9, { ohne: o.ohne });
    K.licht(x, y - 2, 6 * g + 3, LICHT.glut, 1);
    const h = g > 1 ? 5 : 3;
    for (let j = 0; j < h; j++) K.set(x, y - 1 - j, LICHT.warmA);
    if (g > 1) { for (let j = 1; j < h - 1; j++) { K.set(x - 1, y - 1 - j, LICHT.warmA); K.set(x + 1, y - 1 - j, LICHT.warmA); } for (let j = 0; j < h - 1; j++) K.set(x, y - 1 - j, LICHT.warm); K.set(x, y - 1, LICHT.warmK); K.set(x, y - 2, LICHT.warmK); }
    else { K.set(x, y - 2, LICHT.warm); K.set(x, y - 1, LICHT.warmK); }
    K.lichtquelle(x, y - 2);
  };
  // Sturmlaterne (Hand): Fuß bei (x, yb), Höhe etwa 10*s
  K.laterne = (x, yb, s, o) => {
    o = o || {}; s = s || 1; const m = B.maske(), h = 10 * s, w = 3.2 * s;
    m.rect(x - w - .5, yb - 1.5 * s, 2 * w + 1, 1.5 * s);              // Fuß
    m.rect(x - w - .5, yb - h + 1.5 * s, 2 * w + 1, 1.2 * s);           // Deckel
    m.poly([[x - w + .5, yb - h + 1.5 * s], [x, yb - h - .5 * s], [x + w + .5, yb - h + 1.5 * s]]); // Haube
    m.kap(x - w, yb - 1.5 * s, x - w, yb - h + 2 * s, .55, .55); m.kap(x + w, yb - 1.5 * s, x + w, yb - h + 2 * s, .55, .55); // Gestell
    if (o.buegel !== false) { m.kap(x - w * .9, yb - h + .5 * s, x, yb - h - 3.5 * s, .5, .5); m.kap(x, yb - h - 3.5 * s, x + w * .9, yb - h + .5 * s, .5, .5); }
    if (o.an !== false) {
      if (o.hof !== 0) K.licht(x, yb - h * .5, o.hof || 34 * s, LICHT.warmG, o.staerke || .9, { ohne: o.ohne });
      K.licht(x, yb - h * .5, 8 * s, LICHT.glut, 1);
    }
    K.form(m, 0, { k: o.k || pal.koerper, ton: 1.2, fase: 0, rand: 1, L: [0, 0] });
    if (o.an !== false) {
      B.dith(e, x - w + 1, yb - h + 2.7 * s, x + w, yb - 1.5 * s, LICHT.warm, () => .55);
      B.dith(e, x - w * .4, yb - h * .62, x + w * .4 + 1, yb - 2 * s, LICHT.warm, () => 1);
      K.set(x, yb - h * .38, LICHT.warmK); if (s > 1.4) { K.set(x, yb - h * .38 - 1, LICHT.warmK); K.set(x, yb - h * .38 + 1, LICHT.warm); }
      K.lichtquelle(x, yb - h * .45);
    }
  };
  // Gaslaterne auf Pfahl: Fuß (x, yb), Gesamthöhe hoch
  K.gaslaterne = (x, yb, hoch, o) => {
    o = o || {}; const m = B.maske(), k = hoch / 60;
    m.kap(x, yb, x, yb - hoch + 8 * k, 1.4 * k + .5, 1 * k + .4);
    m.kap(x - 3 * k, yb - 1, x + 3 * k, yb - 1, 1.2 * k + .3, 1.2 * k + .3);
    m.poly([[x - 4 * k, yb - hoch + 8 * k], [x - 3 * k, yb - hoch], [x + 3 * k, yb - hoch], [x + 4 * k, yb - hoch + 8 * k]]);
    m.poly([[x - 5 * k, yb - hoch], [x, yb - hoch - 4 * k], [x + 5 * k, yb - hoch]]);
    const gy = yb - hoch + 4 * k;
    if (o.an !== false) { K.licht(x, gy, o.hof || 70 * k, LICHT.warmG, o.staerke || .9, { ohne: o.ohne }); K.licht(x, gy, 10 * k + 2, LICHT.glut, 1); }
    K.form(m, o.tiefe || 0, { ton: 1.2, fase: 1, L: [0, -1] });
    if (o.an !== false) {
      B.dith(e, x - 2.6 * k, yb - hoch + 1, x + 2.6 * k, yb - hoch + 8 * k - 1, LICHT.warm, () => .9);
      K.set(x, gy + 1, LICHT.warmK); K.set(x, gy, LICHT.warmK);
      K.lichtquelle(x, gy);
    }
    return [x, gy];
  };

  // ---------- Figur ----------
  // Menschliche Gestalt, Fuß bei (x, yb), Höhe h. o:
  //   neig: Versatz des Oberkörpers (px, + = nach rechts gebeugt), buckel: Rundrücken (0..1)
  //   kopf: 'hut' | 'muetze' | 'tuch' | 'kahl', kopfDreh: Versatz des Kopfes (px)
  //   arme: [[hx,hy], …] Handpositionen absolut (Standard: hängend), ellbogen: [[ex,ey], …] optional
  //   haltung: 'stehen' | 'knien' (seitlich, Knie nach blick) | 'sitzen'; blick: +1 rechts / -1 links
  //   weit: Saumbreite des Mantels (1 = normal), wulst: [x,y,r] zusätzliche Wölbung am Mantel
  K.figurMaske = (x, yb, h, o) => {
    o = o || {}; const s = h / 40, m = B.maske(), nb = o.neig || 0, blick = o.blick || 1;
    const haltung = o.haltung || 'stehen';
    let schY = yb - 31 * s, saumY = yb - 7 * s;
    if (haltung === 'knien') { schY = yb - 23 * s; saumY = yb - 3 * s; }
    if (haltung === 'sitzen') { schY = yb - 21 * s; saumY = yb - 2 * s; }
    const sx = x + nb, kx = sx + (o.kopfDreh || 0) + nb * .25, ky = schY - 4.2 * s + (o.buckel || 0) * 2.5 * s;
    const weit = o.weit || 1;
    // Rumpf und Mantel
    const bu = (o.buckel || 0) * 4 * s * -blick;
    m.poly([[sx - 5.5 * s + bu * .5, schY], [sx + 5.5 * s + bu * .5, schY], [sx + 6.5 * s + bu, schY + 3 * s], [x + 7.5 * s * weit, saumY], [x - 7.5 * s * weit, saumY], [sx - 6.5 * s + bu, schY + 3 * s]]);
    m.ell(sx + bu * .6, schY + 2 * s, 6.3 * s, 3.2 * s);
    if (o.buckel) m.ell(sx + bu * 1.1, schY + 1.5 * s, 5 * s, 4 * s * (1 + o.buckel * .5));
    if (o.wulst) m.ell(o.wulst[0], o.wulst[1], o.wulst[2], o.wulst[3] || o.wulst[2]);
    // Hals und Kopf
    m.kap(sx + bu * .4, schY, kx, ky + 2 * s, 1.5 * s, 1.4 * s);
    m.ell(kx, ky, 2.9 * s, 3.3 * s);
    const kopf = o.kopf || 'hut';
    if (kopf === 'hut') { m.kap(kx - 5 * s, ky - 2.2 * s, kx + 5 * s, ky - 2.2 * s, .75 * s + .2, .75 * s + .2); m.rect(kx - 3.1 * s, ky - 6.2 * s, 6.2 * s, 4.2 * s); }
    else if (kopf === 'muetze') { m.ell(kx + blick * .8 * s, ky - 2.6 * s, 3.8 * s, 2 * s); m.kap(kx, ky - 1.8 * s, kx + blick * 4.5 * s, ky - 1.4 * s, .6 * s, .4 * s); }
    else if (kopf === 'tuch') { m.ell(kx, ky - .5 * s, 3.8 * s, 4.2 * s); m.poly([[kx - 3.8 * s, ky], [kx + 3.8 * s, ky], [sx + 7 * s, schY + 5 * s], [sx - 7 * s, schY + 5 * s]]); }
    // Beine
    if (haltung === 'stehen') {
      const sp = o.spreiz || 2.6;
      m.kap(x - sp * s, saumY - 1, x - sp * s - .3 * s, yb - .5, 1.6 * s, 1.4 * s); m.kap(x + sp * s, saumY - 1, x + sp * s + .3 * s, yb - .5, 1.6 * s, 1.4 * s);
      m.kap(x - sp * s - 1.5 * s, yb - .7 * s, x - sp * s + .8 * s * blick, yb - .7 * s, .9 * s, .9 * s); m.kap(x + sp * s - .4 * s, yb - .7 * s, x + sp * s + 1.8 * s * blick, yb - .7 * s, .9 * s, .9 * s);
    } else if (haltung === 'knien') {
      // Unterschenkel liegt nach hinten am Boden, Knie vorn
      m.kap(x + blick * 3 * s, saumY, x + blick * 5 * s, yb - 1.4 * s, 2.2 * s, 1.8 * s);
      m.kap(x + blick * 5 * s, yb - 1.4 * s, x - blick * 8 * s, yb - 1.2 * s, 1.7 * s, 1.4 * s);
      m.kap(x - blick * 8 * s, yb - 1.2 * s, x - blick * 10.5 * s, yb - .8 * s, 1.1 * s, .9 * s);
    } else if (haltung === 'sitzen') {
      m.kap(x, saumY, x + blick * 9 * s, saumY - 1 * s, 2.4 * s, 2 * s);
      m.kap(x + blick * 9 * s, saumY - 1 * s, x + blick * 10 * s, yb - .6 * s, 1.8 * s, 1.5 * s);
      m.kap(x + blick * 10 * s, yb - .8 * s, x + blick * 12.5 * s, yb - .8 * s, 1.1 * s, 1 * s);
    }
    // Arme
    const arme = o.arme || [[x - 7.5 * s + nb, yb - 17 * s], [x + 7.5 * s + nb, yb - 17 * s]];
    arme.forEach((hnd, i) => {
      if (!hnd) return;
      const seite = arme.length === 1 ? (hnd[0] >= sx ? 1 : -1) : (i === 0 ? -1 : 1);
      const ax = sx + seite * 5.3 * s + bu * .5, ay = schY + 1.6 * s;
      const el = o.ellbogen && o.ellbogen[i];
      if (el) { m.kap(ax, ay, el[0], el[1], 1.9 * s, 1.6 * s); m.kap(el[0], el[1], hnd[0], hnd[1], 1.6 * s, 1.2 * s); }
      else m.kap(ax, ay, hnd[0], hnd[1], 1.9 * s, 1.3 * s);
      m.ell(hnd[0], hnd[1], 1.4 * s, 1.4 * s);
    });
    m.kopf = [kx, ky]; m.schulter = [sx, schY];
    return m;
  };
  K.figur = (x, yb, h, o, mat) => { const m = K.figurMaske(x, yb, h, o); K.form(m, (mat && mat.tiefe) || 0, Object.assign({ ton: 1.15, verlauf: .25, fase: 1 }, mat || {})); return m; };

  // ---------- Kleinkram ----------
  // Schriftzeilen: kurze Striche wie Tinte (für Bücher, Briefe)
  K.schrift = (x0, y, x1, col, o) => {
    o = o || {}; let x = x0; const r = B.rng(K.seed + Math.round(y * 31 + x0));
    while (x < x1) { const l = Math.min(x1 - x, r.i(o.min || 2, o.max || 6)); for (let i = 0; i < l; i++) if (!o.dicht || r() > .15) K.set(x + i, y + (r() < (o.wackel || .15) ? -1 : 0), col); x += l + (o.luecke || 1) + (r() < .25 ? 1 : 0); }
  };
  // Holzbretter in einem Rechteck, waagerecht (o.senkrecht für Wände)
  K.bretter = (x0, y0, x1, y1, cols, o) => {
    o = o || {}; const b = o.breite || 5, s = K.seed;
    B.feld(e, x0, y0, x1, y1, cols, (x, y) => {
      if (o.maske && !o.maske(x, y)) return -1;
      const u = o.senkrecht ? x - x0 : y - y0, v = o.senkrecht ? y : x, n = Math.floor(u / b), f = u - n * b;
      let t = (o.ton === undefined ? .4 : o.ton) + (B.hash(n, 7, s) - .5) * .2 + (B.rausch2(v * .08, n * 3.1, s) - .5) * .2 + (o.tf ? o.tf(x, y) : 0);
      if (f < 1) t -= .3; else if (f === 1 && o.kante !== false) t += .1;
      return t;
    });
  };
  // Pflaster/Boden in Aufsicht: Reihen werden nach unten höher (Perspektive), o.vx = Fluchtpunkt-x
  K.pflaster = (y0, y1, cols, o) => {
    o = o || {}; const s = K.seed, vx = o.vx === undefined ? BW / 2 : o.vx;
    B.feld(e, o.x0 || 0, y0, o.x1 || BW, y1, cols, (x, y) => {
      if (o.maske && !o.maske(x, y)) return -1;
      const d = y - y0 + 2, rr = Math.sqrt(d) * (o.dichte || 2.6), row = Math.floor(rr), fr = rr - row;
      const cw = 3 + d * .5, cc = (x - vx) / cw + row * .5, col = Math.floor(cc), fc = cc - col;
      let t = (o.ton === undefined ? .3 : o.ton) + (B.hash(col, row, s) - .5) * .2 - (y1 - y) / (y1 - y0) * .1 + (o.tf ? o.tf(x, y) : 0);
      if (fr < .18 || fc < .08) t -= .22; else if (fr < .32) t += .08;
      return t;
    });
  };

  // ---------- Requisiten der Küste ----------
  // Kiste: Fußmitte (cx, yb), gekippt um winkel (Bogenmaß, + = nach rechts, Drehpunkt die untere Ecke)
  K.kiste = (cx, yb, w, h, winkel, tiefe, o) => {
    o = o || {}; winkel = winkel || 0; const m = B.maske(), c = Math.cos(winkel), s = Math.sin(winkel);
    const pv = winkel >= 0 ? [cx + w / 2, yb] : [cx - w / 2, yb], u0 = winkel >= 0 ? -w : 0;
    const P = (u, v) => [pv[0] + (u0 + u) * c - v * s, pv[1] + (u0 + u) * s + v * c];
    m.poly([P(0, 0), P(w, 0), P(w, -h), P(0, -h)]);
    const lokal = (x, y) => { const dx = x - pv[0], dy = y - pv[1]; return [dx * c + dy * s - u0, -dx * s + dy * c]; };
    const n = o.bretter || 3;
    K.form(m, tiefe || 0, Object.assign({ ton: 1.5, schatten: 2, fase: 1, muster: (x, y) => { const [u, v] = lokal(x + .5, y + .5); const fv = ((-v) / h * n) % 1; return (fv < 1 / h * n * .9 ? -.8 : 0) + ((u < 2 || u > w - 2) ? .35 : 0); } }, o.mat || {}));
    return m;
  };
  // Kutter von der Seite: Bug rechts (richtung -1: links), Wasserlinie yw, Länge 60*s
  K.kutter = (x, yw, s, tiefe, o) => {
    o = o || {}; const d = o.richtung || 1, m = B.maske(), L = 60 * s, hh = 9 * s;
    const X = u => x + d * u;   // u: -L/2 Heck .. +L/2 Bug
    m.poly([[X(-L / 2), yw - hh * .95], [X(-L * .2), yw - hh * .78], [X(L * .25), yw - hh * .85], [X(L / 2 + 3 * s), yw - hh * 1.25], [X(L / 2 - 2 * s), yw - hh * .3], [X(L * .3), yw + 1], [X(-L * .42), yw + 1], [X(-L / 2 - 1 * s), yw - hh * .5]]);
    // Steuerhaus achtern, Mast vorn mit Baum, Wanten
    m.rect(Math.min(X(-L * .36), X(-L * .14)), yw - hh * .8 - 11 * s, 13 * s, 11 * s);
    m.poly([[X(-L * .38), yw - hh * .8 - 11 * s], [X(-L * .25), yw - hh * .8 - 13 * s], [X(-L * .12), yw - hh * .8 - 11 * s]]);
    const mx = X(L * .12), mt = yw - hh - (o.mast || 40) * s;
    m.kap(mx, yw - hh * .8, mx, mt, 1.1 * s + .3, .6 * s + .3);
    m.kap(mx, yw - hh - 9 * s, X(-L * .3), yw - hh - 5 * s, .5 * s + .3, .4 * s + .3);
    m.kap(mx, mt + 2, X(L / 2 + 2 * s), yw - hh * 1.2, .35, .35); m.kap(mx, mt + 2, X(-L / 2 + 2 * s), yw - hh * .95, .35, .35);
    if (o.luke) m.rect(Math.min(X(o.luke[0]), X(o.luke[0] + o.luke[1] * d)), yw - hh * .82 - 2 * s, o.luke[1], 2 * s, 0);
    K.form(m, tiefe || 0, Object.assign({ ton: 1.1, verlauf: .35, fase: 1, muster: (px, py) => (py === Math.round(yw - hh * .55) ? -.6 : 0) }, o.mat || {}));
    return { mast: [mx, mt], deck: yw - hh * .82, heck: X(-L / 2), bug: X(L / 2), steuerhaus: [X(-L * .25), yw - hh * .8 - 6 * s] };
  };
  // Netzfläche: Polygon, als Rautenmaschen gerendert (Maschenweite 4 px, oder o.weite)
  K.netz = (pts, tiefe, o) => {
    o = o || {}; const n = B.maske(), w = o.weite || 4; n.poly(pts);
    n.fn(n.x0, n.y0, n.x1, n.y1, (x, y) => { const xi = Math.floor(x), yi = Math.floor(y); return (((xi + yi) % w + w) % w) !== 0 && (((xi - yi) % w + w) % w) !== 0; }, 0);
    K.form(n, tiefe || 0, Object.assign({ ton: 2, fase: 0, rand: 1 }, o.mat || {}));
    return n;
  };

  // Vignette: Ränder gedithert in den dunkelsten Ton (ruhige Fläche um das Motiv)
  K.vignette = (st, o) => {
    o = o || {}; const p = B.pk(o.farbe || pal.koerper[0]), cx = o.cx === undefined ? BW / 2 : o.cx, cy = o.cy === undefined ? BH / 2 : o.cy;
    for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
      const dx = (x + .5 - cx) / (BW * .62), dy = (y + .5 - cy) / (BH * .62), d = Math.hypot(dx, dy);
      const a = Math.max(0, (d - (o.innen || .55)) / .45) * st; if (!(a > B.bay(x, y))) continue;
      // Lichter bleiben stehen (Mond, Lampen am Rand)
      const q = e.get(x, y); if (q >>> 24 && ((q & 255) * .2126 + (q >>> 8 & 255) * .7152 + (q >>> 16 & 255) * .0722) > 120) continue;
      e.set(x, y, p);
    }
  };
  return K;
}

// ---------- Ausgabe: Ausschnitt 160 × 90 als RGBA, leere Pixel im dunkelsten Ton ----------
function fertig(K) {
  const out = new Uint8Array(BW * BH * 4), leer = B.col(K.pal.koerper[0]), d = K.e.d;
  for (let y = 0; y < BH; y++) for (let x = 0; x < BW; x++) {
    const p = d[(y + M) * EW + x + M], o = (y * BW + x) * 4;
    if (p >>> 24) { out[o] = p & 255; out[o + 1] = p >>> 8 & 255; out[o + 2] = p >>> 16 & 255; } else { out[o] = leer[0]; out[o + 1] = leer[1]; out[o + 2] = leer[2]; }
    out[o + 3] = 255;
  }
  return out;
}
function farbenZaehlen(rgba) { const s = new Set(); for (let i = 0; i < rgba.length; i += 4) s.add(rgba[i] << 16 | rgba[i + 1] << 8 | rgba[i + 2]); return s.size; }
// Helligkeit: Anteil heller Pixel (für die Regel „eine helle Stelle, viel dunkle Fläche“)
function helligkeit(rgba) {
  let hell = 0, dunkel = 0, n = rgba.length / 4;
  for (let i = 0; i < rgba.length; i += 4) { const l = (.2126 * rgba[i] + .7152 * rgba[i + 1] + .0722 * rgba[i + 2]) / 255; if (l > .55) hell++; if (l < .12) dunkel++; }
  return { hell: hell / n, dunkel: dunkel / n };
}

module.exports = { WURZEL, BW, BH, B, World, S, NEUTRAL, LICHT, biomPal, kontext, fertig, farbenZaehlen, helligkeit, rampe, hashStr };
