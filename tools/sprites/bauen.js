// Baut alle Gegner-Sheets: node tools/sprites/bauen.js [id ...]
// Schreibt prototype/assets/gegner/<sprite>.png + .json
// und Vorschauen nach tools/sprites/vorschau/ (je Sprite alle Animationen auf Nebel, ×3;
// alle.png = Kontaktbogen aller Sprites, silhouetten.png = schwarz gefüllt).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const WURZEL = path.resolve(__dirname, '../..');
const ZIEL = path.join(WURZEL, 'prototype/assets/gegner');
const VORSCHAU = process.env.VORSCHAU || path.join(__dirname, 'vorschau');
fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(VORSCHAU, { recursive: true });

const nur = process.argv.slice(2);
const dateien = fs.readdirSync(path.join(__dirname, 'gegner')).filter(d => d.endsWith('.js')).sort();
const gebaut = [];
for (const d of dateien) {
  const id = d.replace(/\.js$/, '');
  if (nur.length && !nur.includes(id)) continue;
  delete require.cache[require.resolve('./gegner/' + d)];
  const def = require('./gegner/' + d);
  for (const [name, v] of Object.entries(def.varianten)) {
    const t0 = Date.now();
    const s = L.sheet(def, v);
    L.pngSchreiben(path.join(ZIEL, name + '.png'), s.SW, s.SH, s.rgba);
    fs.writeFileSync(path.join(ZIEL, name + '.json'), JSON.stringify({ id: def.id, rang: def.rang || 'normal', ...s.meta }, null, 1) + '\n');
    // Vorschau: jede Zeile eine Animation, auf Nebel, ×3
    const sk = 3, cols = s.SW / def.w, rows = 4;
    const bild = L.leinwand(s.SW * sk + (cols - 1) * 4, s.SH * sk + 12, '#0a0b0d');
    for (let rI = 0; rI < rows; rI++) for (let c = 0; c < cols; c++) {
      const ox = c * (def.w * sk + 4), oy = rI * def.h * sk + rI * 4;
      const fr = s.frames[L.REIHENFOLGE[rI]][c];
      if (!fr) continue;
      L.nebel(bild, ox, oy, def.w, def.h, s.meta.zone, sk);
      L.einsetzen(bild, L.zuRGBA(fr, s.pal), def.w, def.h, ox, oy, sk);
    }
    L.pngSchreiben(path.join(VORSCHAU, name + '.png'), bild.W, bild.H, bild.data);
    gebaut.push({ name, def, s });
    console.log(`${name.padEnd(22)} ${s.SW}x${s.SH}  ${Date.now() - t0} ms`);
  }
}

// Kontaktbögen (nur beim Gesamtbau): Idle-Bild 0 aller Sprites, farbig und als Silhouette
if (!nur.length || process.env.KONTAKT) {
  const sk = 2, pad = 6, proReihe = 8;
  const zellW = 160 * sk + pad, zellH = 160 * sk + pad;
  const reihen = Math.ceil(gebaut.length / proReihe);
  for (const art of ['alle', 'silhouetten']) {
    const bild = L.leinwand(proReihe * zellW + pad, reihen * zellH + pad, art === 'alle' ? '#0a0b0d' : '#d8d4cc');
    gebaut.forEach((g, i) => {
      const ox = pad + (i % proReihe) * zellW + (160 - g.def.w) * sk / 2, oy = pad + Math.floor(i / proReihe) * zellH + (160 - g.def.h) * sk;
      if (art === 'alle') L.nebel(bild, ox, oy, g.def.w, g.def.h, g.s.meta.zone, sk);
      L.einsetzen(bild, L.zuRGBA(g.s.frames.idle[0], g.s.pal), g.def.w, g.def.h, ox, oy, sk, art === 'silhouetten');
    });
    L.pngSchreiben(path.join(VORSCHAU, art + '.png'), bild.W, bild.H, bild.data);
  }
}
