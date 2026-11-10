// Regel-Prüfung der gebauten Icons und Handgriff-Bilder.
//   node tools/icons/pruefen.js            alles
//   node tools/icons/pruefen.js harpoon …  nur diese
// Prüft je Bild:
//  1. Größe: Items 48 × 48, Handgriffe 48 × 32.
//  2. Alpha nur 0 oder 255.
//  3. Nicht leer und nicht randvoll: Fläche 8–75 % (Items) bzw. 10–90 % (Handgriffe); das Motiv füllt mindestens 60 % der Breite oder Höhe.
//  4. Kein schwarzer Umriss: höchstens 45 % der Außenkante sind fast schwarz (Luminanz < 0,03).
//  5. Randlicht oben rechts: von den Kantenpixeln, die nach oben oder rechts frei liegen, sind mindestens 45 % deutlich heller
//     als das Innere (Luminanz ≥ 2 × Median der Innenpixel und ≥ 0,12). Unten links frei liegende Kanten dürfen es nicht sein
//     (dort höchstens halb so oft wie oben rechts), sonst wäre es Vorderlicht oder ein heller Umriss.
//  6. Farbanzahl ≤ 48 (harte Pixel aus festen Rampen, keine Zwischentöne durch Skalierung).
//  7. index.json listet genau die vorhandenen PNGs.
// Exitcode 1 bei Verstoß.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const lum = (d, i) => (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;

function pruefe(datei, art) {
  const b = L.S.pngLesen(datei); const { W, H, data: d } = b; const fehler = []; const werte = {};
  const soll = art !== 'handgriffe' ? [48, 48] : [48, 32];
  if (W !== soll[0] || H !== soll[1]) fehler.push(`Größe ${W}×${H} statt ${soll.join('×')}`);
  let voll = 0, x0 = W, y0 = H, x1 = 0, y1 = 0; const farben = new Set();
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = (y * W + x) * 4; const a = d[i + 3]; if (a !== 0 && a !== 255) { fehler.push(`Alpha ${a} bei ${x},${y}`); break; } if (a) { voll++; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); farben.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]); } }
  const anteil = voll / (W * H); werte.flaeche = Math.round(anteil * 100);
  const [amin, amax] = art !== 'handgriffe' ? [0.08, 0.75] : [0.1, 0.9];
  if (anteil < amin || anteil > amax) fehler.push(`Fläche ${werte.flaeche} %`);
  if (Math.max((x1 - x0 + 1) / W, (y1 - y0 + 1) / H) < 0.6) fehler.push('Motiv zu klein');
  werte.farben = farben.size; if (farben.size > 48) fehler.push(`${farben.size} Farben`);
  const op = (x, y) => x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 0;
  const innen = [], kante = [], obenRechts = [], untenLinks = [];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (!op(x, y)) continue; const i = (y * W + x) * 4;
    const frei = { o: !op(x, y - 1), r: !op(x + 1, y), u: !op(x, y + 1), l: !op(x - 1, y), or: !op(x + 1, y - 1) };
    const istKante = frei.o || frei.r || frei.u || frei.l;
    if (!istKante) { innen.push(lum(d, i)); continue; }
    kante.push(lum(d, i));
    if (frei.o || frei.r) obenRechts.push(lum(d, i)); else if (frei.u || frei.l) untenLinks.push(lum(d, i));
  }
  innen.sort((a, b) => a - b); const med = innen.length ? innen[innen.length >> 1] : 0.05; const schwelle = Math.max(0.12, med * 2);
  const schwarz = kante.filter(v => v < 0.03).length / (kante.length || 1); werte.umriss = Math.round(schwarz * 100);
  if (schwarz > 0.45) fehler.push(`Umriss: ${werte.umriss} % der Kante fast schwarz`);
  const rimOR = obenRechts.filter(v => v >= schwelle).length / (obenRechts.length || 1), rimUL = untenLinks.filter(v => v >= schwelle).length / (untenLinks.length || 1);
  werte.randlicht = Math.round(rimOR * 100); werte.unten = Math.round(rimUL * 100);
  if (rimOR < 0.45) fehler.push(`Randlicht oben rechts nur ${werte.randlicht} %`);
  if (rimUL > rimOR * 0.5 + 0.05) fehler.push(`zu viel Licht unten links (${werte.unten} % gegen ${werte.randlicht} %)`);
  return { fehler, werte };
}

if (require.main === module) {
  const namen = process.argv.slice(2);
  let verstoesse = 0, n = 0; const zeilen = [];
  for (const art of ['items', 'handgriffe', 'karten']) {
    const dir = path.join(L.WURZEL, 'prototype/assets', art); if (!fs.existsSync(dir)) continue;
    const pngs = fs.readdirSync(dir).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).sort();
    if (art !== 'karten') try { const idx = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8'))[art] || []; const a = pngs.join(','), b = [...idx].sort().join(','); if (a !== b) { verstoesse++; console.log(`${art}/index.json passt nicht zu den PNGs`); } } catch (e) { verstoesse++; console.log(`${art}/index.json fehlt oder ist kaputt`); }
    for (const id of pngs) {
      if (namen.length && !namen.includes(id)) continue; n++;
      const r = pruefe(path.join(dir, id + '.png'), art);
      if (r.fehler.length) { verstoesse++; console.log(`✗ ${art}/${id}: ${r.fehler.join('; ')}`); }
      zeilen.push(`${art}/${id} ${JSON.stringify(r.werte)}`);
    }
  }
  if (process.argv.includes('--werte')) console.log(zeilen.join('\n'));
  console.log(`${n} Bilder geprüft, ${verstoesse} Verstöße.`);
  if (verstoesse) process.exitCode = 1;
}
module.exports = { pruefe };
