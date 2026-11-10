// Ereignisbilder 160 × 90 · Die Pforte (data/events.json mit biom "pforte").
// Palette der Pforte (prototype/js/scenes/world/pforte.js): Schwarzblaugrün, Randlicht in kaltem Türkis,
// Stein in dunklem Teal. Warmes Licht nur von der Lampe der Expedition; unter jeder Tür leuchtet die Farbe ihres Bioms.
// Eine Funktion je Ereignis; K = Kontext aus tools/ereignisse/lib.js.
'use strict';

const WAND = ['#020606', '#040c0c', '#071414', '#0b1e1e', '#102a2a', '#163836', '#204a46', '#2e625c'];
const STEIN = ['#030606', '#060d0d', '#0a1515', '#101f1f', '#172b2a', '#20393a', '#2c4c4a', '#3e6862'];
const RAND = ['#2a8a7a', '#a0fff0'];
const SALZP = ['#1c1816', '#322a27', '#5e524c', '#94877f', '#d0c6bd', '#ece4dc'];
const SCHNEE = ['#101c2a', '#243a54', '#4a6c94', '#8aaed4', '#c8e0f4', '#f0f8ff'];
const ZIEGEL = ['#140806', '#26100a', '#441c10', '#6c2e18', '#94421f', '#b65c31'];
const HOLZ = ['#050403', '#0d0a08', '#18120d', '#261b13', '#372719'];
const WARM = ['#a06a20', '#ffd27a'];

module.exports = {
  biom: 'pforte',
  bilder: {
    // Ein dunkler Vorraum mit vier verschiedenen Türen in einer Reihe (Salzkruste, Schnee, Ziegel, Glas), unter jeder ein Streifen Licht in der Farbe ihres Ortes; auf dem Boden ein Plan mit Pfeilen, vorn eine Lampe.
    pforte_nebentueren(K) {
      const { B } = K;
      const lx = 142, ly = 80;
      // Rückwand und Boden
      K.mauer(0, 0, 160, 72, WAND, { hoehe: 8, breite: 18, ton: .3, tf: (x, y) => -Math.abs(x - 80) * .0012 - y * .0015 });
      K.pflaster(72, 90, STEIN, { vx: 80, ton: .3 });
      for (let x = 0; x < 160; x++) K.set(x, 72, B.bay(x, 0) < .6 ? STEIN[6] : STEIN[4]);
      const xs = [26, 62, 98, 134], tw = 28, ty0 = 20, ty1 = 72;
      // Türrahmen aus Stein (stark), dahinter je eine Tür; Rand zur Lampe hin heller
      for (const x of xs) {
        const rahmen = K.maske(); rahmen.rect(x - tw / 2 - 3, ty0 - 4, tw + 6, ty1 - ty0 + 4); rahmen.rect(x - tw / 2, ty0, tw, ty1 - ty0, 0);
        K.form(rahmen, 0, { k: STEIN.slice(1, 8), r: RAND, ton: 2.2, fase: 1, rand: 1, lichtVon: [lx, ly], schatten: 2 });
      }
      const tuer = (x) => { const m = K.maske(); m.rect(x - tw / 2, ty0, tw, ty1 - ty0); return m; };
      const gKante = (m, x) => K.kante(m, lx, ly - 20, 150, RAND, { min: .5 });
      // 1 · Salz: dunkles Holz, von unten nach oben von einer weißen Salzkruste überzogen
      { const x = xs[0], m = tuer(x);
        K.form(m, 0, { k: HOLZ, r: RAND, ton: 1.6, fase: 0, rand: 1, lichtVon: [lx, ly], muster: (px, py) => ((px - x + 14) % 7 === 0 ? -.7 : 0) });
        K.feld(x - tw / 2, ty0, x + tw / 2, ty1, SALZP, (px, py) => {
          const q = (py - ty0) / (ty1 - ty0), kr = B.fbm(px * .22, py * .26, K.seed + 3, 3) + q * .55 - .38;
          return kr > .3 ? .2 + kr * .75 + (B.hash(px, py, 3) > .8 ? .08 : 0) : -1;
        });
        K.set(x + 8, 46, '#d2b46e'); K.set(x + 9, 46, '#6a4f20'); }
      // 2 · Schnee: Holz in Blau, oben ein Haufen Schnee auf dem Sturz, unten verwehte Haufen, Flocken
      { const x = xs[1], m = tuer(x);
        K.form(m, 0, { k: ['#050a10', '#0c1622', '#16263a', '#243a56'], r: RAND, ton: 1.6, fase: 0, rand: 1, lichtVon: [lx, ly], muster: (px, py) => ((px - x + 14) % 7 === 0 ? -.7 : 0) });
        const wehe = K.maske(); wehe.poly([[x - 15, ty1], [x - 14, ty1 - 14], [x - 8, ty1 - 20], [x + 2, ty1 - 13], [x + 10, ty1 - 17], [x + 15, ty1 - 8], [x + 15, ty1]]);
        wehe.poly([[x - 16, ty0 - 4], [x - 12, ty0 - 9], [x - 2, ty0 - 10], [x + 8, ty0 - 8], [x + 16, ty0 - 4]]);
        K.form(wehe, 0, { k: SCHNEE, r: ['#c8e0f4', '#ffffff'], ton: 2.4, fase: 1.5, rand: 1, lichtVon: [lx, ly], muster: (px, py) => (B.hash(px, py, 4) > .86 ? .35 : 0) });
        for (let i = 0; i < 18; i++) K.set(x - 13 + (B.hash(i, 3, 5) * 26 | 0), ty0 + 6 + (B.hash(i, 7, 5) * 30 | 0), i % 3 ? '#8aaed4' : '#f0f8ff');
        K.set(x + 8, 46, '#b0b8c0'); K.set(x + 9, 46, '#e8f0f8'); }
      // 3 · Ziegel: gemauerter Rundbogen, in der Laibung eine schmale Holztür
      { const x = xs[2];
        const bogen = K.maske(); bogen.ell(x, ty0 + 12, 14, 12); bogen.rect(x - 14, ty0 + 12, 28, ty1 - ty0 - 12);
        K.mauer(x - 15, ty0 - 2, x + 15, ty1, ZIEGEL, { hoehe: 4, breite: 9, ton: .45, maske: (px, py) => bogen.has(px, py) });
        K.form(bogen, 0, { k: ZIEGEL.slice(0, 2), r: ['#b65c31', '#ffdcae'], ton: .1, fase: 0, rand: 1, lichtVon: [lx, ly], schatten: 0, muster: () => -3 });
        K.mauer(x - 15, ty0 - 2, x + 15, ty1, ZIEGEL, { hoehe: 4, breite: 9, ton: .45, maske: (px, py) => bogen.has(px, py) && !(Math.abs(px - x) < 8 && py > ty0 + 10) });
        const t = K.maske(); t.rect(x - 8, ty0 + 10, 16, ty1 - ty0 - 10);
        K.form(t, 0, { k: HOLZ, r: RAND, ton: 1.8, fase: 0, rand: 1, lichtVon: [lx, ly], muster: (px) => ((px - x + 8) % 4 === 0 ? -.7 : 0) });
        K.set(x + 5, 48, '#d2b46e'); K.set(x + 6, 48, '#6a4f20'); }
      // 4 · Glas: schwarzer Eisenrahmen, drei Scheiben übereinander, grünlich, mit Spiegelstreifen
      { const x = xs[3], m = tuer(x);
        K.form(m, 0, { k: ['#020403', '#050807', '#0a1210', '#142420'], r: RAND, ton: 1.4, fase: 0, rand: 1, lichtVon: [lx, ly] });
        for (let i = 0; i < 3; i++) {
          const y0 = ty0 + 3 + i * 16, y1 = y0 + 14;
          K.feld(x - 11, y0, x + 11, y1, ['#041410', '#0a2a22', '#14463a', '#26705a', '#4aa88a'], (px, py) => .2 + (py - y0) / 14 * .2 + (((px - x) * .6 + (py - y0)) % 12 < 2 ? .3 : 0) + (B.fbm(px * .1, py * .2, 6, 2) - .5) * .15);
          K.linie(x - 11, y0, x + 11, y0, '#7ad0b0', .8);
        }
        K.set(x - 9, 46, '#d2b46e'); K.set(x - 8, 46, '#6a4f20'); }
      // Licht unter den Türen: der Geruch des nächsten Ortes, jeder in seiner Farbe
      for (const [x, c, g] of [[xs[0], '#c8b8a0', '#4a3a2a'], [xs[1], '#8ab4e8', '#1e3250'], [xs[2], '#ff8a3a', '#5a2208'], [xs[3], '#4fd27a', '#0e4a28']]) {
        K.rect(x - tw / 2 + 1, ty1, tw - 2, 1, c);
        K.licht(x, ty1 + 3, 22, g, .85, { oval: 2.4, maske: (px, py) => py >= ty1 });
      }
      // Der Plan auf dem Boden: Papier in der Aufsicht, mit vier Kästchen und Pfeilen, die in verschiedene Richtungen zeigen
      const plan = K.maske(); plan.poly([[48, 78], [100, 76], [110, 88], [40, 89]]);
      K.form(plan, 0, { k: ['#1a1c18', '#3a3c34', '#6a6c5c', '#9c9c86', '#c4c4ac'], r: ['#9c9c86', '#e0e0c8'], ton: 2, fase: 0, rand: 1, lichtVon: [lx, ly] });
      const T = '#1a1c18';
      for (let i = 0; i < 4; i++) { const x = 54 + i * 13, y = 82 + (i % 2) * 2; K.rect(x, y, 5, 3, T); }
      for (const [a, b, c, d] of [[58, 83, 66, 81], [70, 84, 76, 84], [82, 83, 88, 85], [94, 84, 98, 81]]) { K.linie(a, b, c, d, T); K.set(c, d, T); K.set(c - 1, d - 1, T); K.set(c - 1, d + 1, T); }
      K.linie(52, 87, 104, 85, T, .6);
      // Lampe der Expedition vorn rechts, auf dem Boden
      K.laterne(lx, 88, 1.25, { hof: 62, staerke: .9 });
      K.lichtquelle(lx, 80);
      K.vignette(.5, { cx: 82, cy: 46 });
    },
  },
};
