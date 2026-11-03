// Hilfsskript: Idle-Bild 0 mehrerer Sprites nebeneinander (×3) -> tools/sprites/vorschau/reihe.png
// node tools/sprites/vorschau_reihe.js id:variante ...
'use strict';
const path = require('path');
const L = require('./lib');
const sk = 3, items = process.argv.slice(2).map(a => a.split(':'));
const b = L.leinwand(items.length * (160 * sk + 6), 160 * sk, '#000');
items.forEach(([id, n], i) => {
  const def = require('./gegner/' + id); const v = def.varianten[n || Object.keys(def.varianten)[0]];
  const an = process.env.ANIM || 'idle', fr = +(process.env.BILD || 0);
  const x = L.bild(def, v, an, fr, (def.anim && def.anim[an] && def.anim[an].n) || L.ANIM_STANDARD[an].n);
  const ox = i * (160 * sk + 6) + (160 - def.w) * sk / 2, oy = (160 - def.h) * sk;
  L.nebel(b, ox, oy, def.w, def.h, v.zone || def.zone, sk); L.einsetzen(b, L.zuRGBA(x.buf, x.pal), def.w, def.h, ox, oy, sk);
});
L.pngSchreiben(path.join(__dirname, 'vorschau/reihe.png'), b.W, b.H, b.data);
