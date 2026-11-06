// Schnelle Arbeitsansicht ohne Browser: Icons nebeneinander ×s auf dem Spielfeld-Ton, darunter ×1 und
// schwarz gefüllt. node tools/icons/blick.js [--hg] [--s=4] id … -> tools/icons/vorschau/blick.png
'use strict';
const fs = require('fs'); const path = require('path'); const L = require('./lib');
const args = process.argv.slice(2); const hg = args.includes('--hg');
const s = +((args.find(a => a.startsWith('--s=')) || '--s=4').slice(4));
let ids = args.filter(a => !a.startsWith('--'));
const dir = path.join(L.WURZEL, 'prototype/assets', hg ? 'handgriffe' : 'items');
if (!ids.length) ids = fs.readdirSync(dir).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4));
const bilder = ids.map(id => L.S.pngLesen(path.join(dir, id + '.png')));
const w = bilder[0].W, h = bilder[0].H, pro = Math.min(ids.length, Math.floor(1400 / (w * s + 6)));
const zeilen = Math.ceil(ids.length / pro);
const zh = h * s + 6 + h + 4 + h + 8;
const bild = L.S.leinwand(pro * (w * s + 6) + 6, zeilen * zh + 6, '#0a0806');
bilder.forEach((b, i) => { const cx = 6 + (i % pro) * (w * s + 6), cy = 6 + Math.floor(i / pro) * zh;
  L.S.einsetzen(bild, b.data, b.W, b.H, cx, cy, s);
  L.S.einsetzen(bild, b.data, b.W, b.H, cx, cy + h * s + 4, 1);
  const hell = L.S.leinwand(w, h, '#d8d4cc'); L.S.einsetzen(bild, hell.data, w, h, cx + w + 4, cy + h * s + 4, 1);
  L.S.einsetzen(bild, b.data, b.W, b.H, cx + w + 4, cy + h * s + 4, 1, true);
  // 32er Verkleinerung (nächster Nachbar)
  const k = 32 / w; const kl = new Uint8Array(32 * Math.round(h * k) * 4); const kh = Math.round(h * k);
  for (let y = 0; y < kh; y++) for (let x = 0; x < 32; x++) { const sx = Math.floor(x / k), sy = Math.floor(y / k); kl.set(b.data.subarray((sy * w + sx) * 4, (sy * w + sx) * 4 + 4), (y * 32 + x) * 4); }
  L.S.einsetzen(bild, kl, 32, kh, cx + 2 * w + 8, cy + h * s + 4, 1);
});
const out = path.join(__dirname, 'vorschau', 'blick.png'); fs.mkdirSync(path.dirname(out), { recursive: true });
L.S.pngSchreiben(out, bild.W, bild.H, bild.data); console.log(out);
