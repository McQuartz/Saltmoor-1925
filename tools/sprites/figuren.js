// Baut die Rucksack-Silhouetten der Figuren (Auftrag 3 M4, 05-oberflaeche.md Abschnitt 8):
// node tools/sprites/figuren.js [id ...]
// Je Figur ein Modul in tools/sprites/figuren/<id>.js (gleiches Format wie die Gegner: Formen mit E/C/Pg, Gruppen, details),
// gerendert mit der Lichtkette aus lib.js in der einfarbigen Zone „silhouette“: dunkler Körper, Randlicht von hinten, leuchtende Augen.
// Schreibt prototype/assets/figuren/<id>.png und <id>.json (Größe, Fußpunkt, Anschlusspunkte hals/leib/hand)
// und tools/sprites/vorschau/figuren.png (Kontaktbogen ×3 auf Nebel und als schwarze Fläche, daneben die Vorlage).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const WURZEL = path.resolve(__dirname, '../..');
const ZIEL = path.join(WURZEL, 'prototype/assets/figuren');
const VORSCHAU = process.env.VORSCHAU || path.join(__dirname, 'vorschau');
fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(VORSCHAU, { recursive: true });
const REIHE = ['fischer', 'friedhofswaerter', 'pfarrerin', 'detektiv', 'okkultist', 'kneipenschlaeger', 'geologe', 'wahrsagerin', 'veteran'];

const nur = process.argv.slice(2);
const da = fs.readdirSync(path.join(__dirname, 'figuren')).filter(d => d.endsWith('.js')).map(d => d.replace(/\.js$/, ''));
const ids = REIHE.filter(id => da.includes(id)).concat(da.filter(id => !REIHE.includes(id)));
const gebaut = [];
for (const id of ids) {
  delete require.cache[require.resolve('./figuren/' + id)];
  const def = require('./figuren/' + id);
  def.zone = 'silhouette';
  const b = L.bild(def, def.v || {}, 'idle', 0, 1);
  const rgba = L.zuRGBA(b.buf, b.pal);
  if (!nur.length || nur.includes(id)) {
    L.pngSchreiben(path.join(ZIEL, id + '.png'), def.w, def.h, rgba);
    fs.writeFileSync(path.join(ZIEL, id + '.json'), JSON.stringify({ id, w: def.w, h: def.h, fuss: def.fuss, koerper: def.koerper, augen: b.augen.map(([x, y]) => [Math.round(x), Math.round(y)]) }, null, 1) + '\n');
    console.log(`${id.padEnd(18)} ${def.w}x${def.h}`);
  }
  gebaut.push({ id, def, buf: b.buf, pal: b.pal, rgba });
}
// Kontaktbogen: obere Reihe auf Nebel, untere als schwarze Fläche auf hellem Grund, Vorlage ganz links
const sk = 3, pad = 8, cw = 120, ch = 180;
const vorlage = (() => { try { return L.pngLesen(path.join(WURZEL, 'docs/auftrag-3/vorlagen/fischer-figur-silhouette.png')); } catch (e) { return null; } })();
const n = gebaut.length + (vorlage ? 1 : 0);
const bild = L.leinwand(n * (cw * sk + pad) + pad, 2 * (ch * sk + pad) + pad, '#0a0b0d');
let i = 0;
const setze = (rgba, w, h, spalte) => {
  const ox = pad + spalte * (cw * sk + pad) + (cw - w) * sk / 2, oy = pad + (ch - h) * sk;
  L.nebel(bild, pad + spalte * (cw * sk + pad), pad, cw, ch, 'silhouette', sk);
  L.einsetzen(bild, rgba, w, h, ox, oy, sk);
  const oy2 = pad * 2 + ch * sk + (ch - h) * sk;
  for (let y = 0; y < ch * sk; y++) for (let x = 0; x < cw * sk; x++) { const t = ((pad * 2 + ch * sk + y) * bild.W + pad + spalte * (cw * sk + pad) + x) * 4; bild.data[t] = 216; bild.data[t + 1] = 212; bild.data[t + 2] = 204; }
  L.einsetzen(bild, rgba, w, h, ox, oy2, sk, true);
};
if (vorlage) setze(vorlage.rgba || vorlage.data, vorlage.W || vorlage.w, vorlage.H || vorlage.h, i++);
for (const g of gebaut) setze(g.rgba, g.def.w, g.def.h, i++);
L.pngSchreiben(path.join(VORSCHAU, 'figuren.png'), bild.W, bild.H, bild.data);
