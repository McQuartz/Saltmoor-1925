// Legt Referenzbilder aus docs/spritegen/zielbild/ neben die eigenen Sprites (Idle-Bild 0 auf Nebel), ×4.
// node tools/sprites/vergleich.js [ausgabe.png]
// Paare: 1-chorknabe <-> chorknabe_a/_b, 2-hirte <-> hirte_a/_b, 3-netzflickerin <-> netzflickerin_a/_b
'use strict';
const path = require('path');
const L = require('./lib');
const WURZEL = path.resolve(__dirname, '../..');
const paare = [['1-chorknabe', 'chorknabe'], ['2-hirte', 'hirte'], ['3-netzflickerin', 'netzflickerin']];
const sk = 4, pad = 8, W = 96, H = 120;
const out = process.argv[2] || path.join(__dirname, 'vorschau/vergleich.png');
const bild = L.leinwand(pad + 3 * (W * sk + pad), pad + paare.length * (H * sk + pad), '#0a0b0d');
paare.forEach(([ref, id], r) => {
  const oy = pad + r * (H * sk + pad);
  const R = L.pngLesen(path.join(WURZEL, 'docs/spritegen/zielbild', ref + '.png'));
  L.einsetzen(bild, R.data, R.W, R.H, pad, oy, sk);
  const def = require('./gegner/' + id);
  Object.keys(def.varianten).slice(0, 2).forEach((name, i) => {
    const v = def.varianten[name]; const b = L.bild(def, v, 'idle', 0, (def.anim && def.anim.idle && def.anim.idle.n) || 4);
    const ox = pad + (i + 1) * (W * sk + pad);
    L.nebel(bild, ox, oy, def.w, def.h, v.zone || def.zone, sk);
    L.einsetzen(bild, L.zuRGBA(b.buf, b.pal), def.w, def.h, ox, oy, sk);
  });
});
L.pngSchreiben(out, bild.W, bild.H, bild.data);
console.log('geschrieben:', out);
