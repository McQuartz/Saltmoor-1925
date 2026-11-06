// Regel-Prüfung der Gegner-Sheets: node tools/sprites/pruefen.js [sprite ...]
// Liest prototype/assets/gegner/<sprite>.png + .json und prüft die harten Regeln aus zielbild.md / M6.
// Exitcode 1, sobald ein Sprite eine Regel verletzt.
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const ORDNER = path.resolve(__dirname, '../../prototype/assets/gegner');
const GROESSE = { normal: [96, 120], elite: [128, 160], waechter: [160, 180], boss: [240, 220] }; // Auftrag 2: Wächter bis 160 × 180, Finale bis 240 × 220 (06-ki-bilder.md)
const nur = process.argv.slice(2);
const namen = fs.readdirSync(ORDNER).filter(d => d.endsWith('.json')).map(d => d.replace(/\.json$/, '')).filter(n => !nur.length || nur.includes(n)).sort();
let fehlerGesamt = 0;

for (const name of namen) {
  const meta = JSON.parse(fs.readFileSync(path.join(ORDNER, name + '.json'), 'utf8'));
  const img = L.pngLesen(path.join(ORDNER, name + '.png'));
  const fehler = [], info = [];
  const pal = L.palette(meta.zone);
  const farbIdx = new Map(); pal.farben.forEach((c, i) => { if (c) farbIdx.set(c, i); });
  const hex = (o) => '#' + [0, 1, 2].map(k => img.data[o + k].toString(16).padStart(2, '0')).join('');
  // 1. Format und Größe
  for (const k of ['w', 'h', 'zone', 'anim', 'fuss', 'kopf', 'augen', 'augenfarbe']) if (meta[k] === undefined) fehler.push('JSON ohne Feld ' + k);
  const [mw, mh] = GROESSE[meta.rang || 'normal'] || GROESSE.normal;
  if (meta.rang === 'normal' || !meta.rang) { if (meta.w !== mw || meta.h !== mh) fehler.push(`Größe ${meta.w}x${meta.h}, verlangt ${mw}x${mh}`); }
  else if (meta.w > mw || meta.h > mh) fehler.push(`Größe ${meta.w}x${meta.h} über ${mw}x${mh}`);
  const reihen = ['idle', 'angriff', 'treffer', 'tod'];
  reihen.forEach((a, i) => { if (!meta.anim[a] || meta.anim[a].zeile !== i) fehler.push('Animation ' + a + ' fehlt oder falsche Zeile'); });
  if (img.H !== meta.h * 4) fehler.push(`Sheet-Höhe ${img.H} statt ${meta.h * 4}`);
  const cols = Math.max(...reihen.map(a => meta.anim[a].n));
  if (img.W !== meta.w * cols) fehler.push(`Sheet-Breite ${img.W} statt ${meta.w * cols}`);
  if (meta.anim.idle.n < 2 || meta.anim.idle.n > 4) fehler.push('Idle braucht 2–4 Bilder');
  if (meta.anim.tod.n < 4 || meta.anim.tod.n > 6) fehler.push('Tod braucht 4–6 Bilder');
  // 2./3. Alpha und Palette (ganzes Sheet)
  let halb = 0, fremd = new Map();
  for (let i = 0; i < img.W * img.H; i++) { const a = img.data[i * 4 + 3]; if (a !== 0 && a !== 255) halb++; if (a === 255) { const c = hex(i * 4); if (!farbIdx.has(c)) fremd.set(c, (fremd.get(c) || 0) + 1); } }
  if (halb) fehler.push(`${halb} halbtransparente Pixel`);
  if (fremd.size) fehler.push(`${fremd.size} Farben außerhalb der Palette ${meta.zone}: ${[...fremd.keys()].slice(0, 4).join(' ')}`);
  // Bilder einzeln: Index-Puffer
  const bildIdx = (row, col) => { const W = meta.w, H = meta.h, b = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = (((row * H + y) * img.W) + col * W + x) * 4; if (img.data[o + 3] === 255) b[y * W + x] = farbIdx.get(hex(o)) || 0; } return b; };
  const lumIdx = pal.farben.map(c => (c ? L.lum(c) : 0));
  const LICHT = new Set([7, 8, 9, ...pal.namen.map((n, i) => (i >= 10 ? i : -1)).filter(i => i > 0)]);
  const pruefBild = (row, col, tag) => {
    const W = meta.w, H = meta.h, b = bildIdx(row, col); let n = 0, rand = 0, randSchwarz = 0, licht = 0, r2 = 0, obenRechts = 0, obenRechtsRim = 0, maxL = -1, maxI = 0;
    const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !b[y * W + x];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const c = b[y * W + x]; if (!c) continue; n++;
      if (LICHT.has(c) && c !== 7) licht++; if (c === 6) r2++;
      if (lumIdx[c] > maxL) { maxL = lumIdx[c]; maxI = c; }
      if (leer(x - 1, y) || leer(x + 1, y) || leer(x, y - 1) || leer(x, y + 1)) { rand++; if (c === 1) randSchwarz++; }
      if ((leer(x + 1, y) || leer(x + 2, y - 1)) && leer(x, y - 1) && y < H - 8) { obenRechts++; if (c === 5 || c === 6 || LICHT.has(c)) obenRechtsRim++; }
    }
    return { n, rand, randSchwarz, licht, r2, obenRechts, obenRechtsRim, maxI, b };
  };
  // Idle, Angriff, Treffer: volle Regeln. „Oben rechts“ = Außenkante, die zur Lichtrichtung rimDir (0.9, -0.5) zeigt und nach oben frei ist.
  let idlePrev = null, flacker = 0;
  for (const a of ['idle', 'angriff', 'treffer']) for (let c = 0; c < meta.anim[a].n; c++) {
    const s = pruefBild(meta.anim[a].zeile, c, a + c);
    if (!s.n) { fehler.push(`${a} ${c}: leeres Bild`); continue; }
    if (s.randSchwarz / s.rand > 0.6) fehler.push(`${a} ${c}: Außenkante zu ${Math.round(100 * s.randSchwarz / s.rand)} % schwarz (Umriss)`);
    if (s.obenRechts && s.obenRechtsRim / s.obenRechts < 0.5) fehler.push(`${a} ${c}: Randlicht oben rechts nur ${Math.round(100 * s.obenRechtsRim / s.obenRechts)} %`);
    if (!LICHT.has(s.maxI)) fehler.push(`${a} ${c}: hellstes Pixel ist ${pal.namen[s.maxI]}, nicht Auge/Licht`);
    if (s.licht / s.n > 0.06) fehler.push(`${a} ${c}: helle Lichtfarben (Kern/Glut) auf ${Math.round(100 * s.licht / s.n)} % der Fläche (nur Akzente erlaubt)`);
    if (s.r2 / s.n > 0.15) fehler.push(`${a} ${c}: helles Randlicht auf ${Math.round(100 * s.r2 / s.n)} % der Fläche`);
    if (a === 'idle') {
      if (idlePrev) { // Unterschied zum Vorbild, beste ganzzahlige Verschiebung um ±1 px abgezogen (Bewegung ist kein Flackern)
        const W = meta.w, H = meta.h; let best = 1e9;
        for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) { let d = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const sx = x - ox, sy = y - oy; const pv = sx >= 0 && sy >= 0 && sx < W && sy < H ? idlePrev[sy * W + sx] : 0; if (s.b[y * W + x] !== pv) d++; } best = Math.min(best, d); }
        flacker = Math.max(flacker, best / s.n); }
      idlePrev = s.b;
      if (c === 0 && !s.licht) fehler.push('idle 0: keine Augen/Lichter');
    }
  }
  if (flacker > 0.2) fehler.push(`Idle unruhig: ${Math.round(flacker * 100)} % der Pixel wechseln zwischen Bildern`);
  // Tod: letztes Bild leer oder fast leer
  const tl = pruefBild(meta.anim.tod.zeile, meta.anim.tod.n - 1, 'tod');
  const t0 = pruefBild(meta.anim.idle.zeile, 0, 'idle');
  if (tl.n > t0.n * 0.1) fehler.push('Tod: letztes Bild nicht zerfallen');
  info.push(`${meta.w}x${meta.h}`, meta.zone, `Rand oben rechts ${Math.round(100 * t0.obenRechtsRim / Math.max(1, t0.obenRechts))} %`, `Umriss schwarz ${Math.round(100 * t0.randSchwarz / Math.max(1, t0.rand))} %`, `Idle-Wechsel ${Math.round(flacker * 100)} %`);
  fehlerGesamt += fehler.length;
  console.log(`${fehler.length ? 'FEHLER' : 'ok    '} ${name.padEnd(20)} ${info.join(' · ')}`);
  fehler.forEach(f => console.log('         - ' + f));
}
console.log(`\n${namen.length} Sprites geprüft, ${fehlerGesamt} Verstöße.`);
process.exit(fehlerGesamt ? 1 : 0);
