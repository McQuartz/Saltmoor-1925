// Ereignisbild 160 × 90 · Biom „farbe“ (Auftrag 3 M8): der Brunnen im Hof, Ereignis farbe_brunnen (prototype/data/events.json).
// Ein Ziehbrunnen im leeren Hof, das Seil gerissen, unten im Schacht der Schimmer in den fünf Stufen von X (data/stoffe.json).
// Regel: Die fünf X-Stufen kommen nur im Schacht vor. Auf Brunnenrand und Pflaster liegt höchstens ein Widerschein aus
// abgedunkelten Mischfarben (nicht die Stufen selbst). Sonst neutraler Schiefer, Mondlicht von oben rechts.
'use strict';

const X = ['#8c00b3', '#aa00d9', '#c800ff', '#d026ff', '#d84dff'];   // ST.X.schimmer
const WIDERSCHEIN = ['#2e0a3c', '#450a5c'];                          // X-Stufe 1 stark abgedunkelt
const HIMMEL = ['#07080c', '#0b0d13', '#10131b', '#161a24', '#1e2330', '#272d3c'];
const STEIN = ['#14171d', '#1e232b', '#2a303a', '#39414d', '#4a5463', '#5e6a7b'];
const BODEN = ['#0d0e12', '#15171d', '#1d2028', '#272b35', '#333946', '#414959'];

module.exports = {
  biom: 'farbe',
  bilder: {
    farbe_brunnen(K) {
      const { B } = K;
      const cx = 80, cy = 66, rx = 27, ry = 9.5;           // Brunnenring
      const lrx = rx - 4.5, lry = ry - 3;                  // Öffnung
      K.himmel(14, HIMMEL, { gx: 128, gb: 40, steil: .4 });
      K.sterne(10, 9);
      K.mond(128, 5, 3, { hof: 4 });
      K.lichtquelle(128, 5);

      // Hofmauer hinten: Fenster, ein Torbogen, den niemand mehr benutzt
      const fenster = [[18, 24], [46, 24], [114, 24], [142, 24], [18, 40], [142, 40]];
      const imFenster = (x, y) => fenster.some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 10);
      const imTor = (x, y) => Math.abs(x - 80) < 11 && (y > 40 || Math.hypot((x - 80) / 11, (y - 40) / 11) < 1);
      K.mauer(0, 12, 160, 56, STEIN.slice(0, 5), { maske: (x, y) => !imFenster(x, y) && !imTor(x, y), hoehe: 6, breite: 12, ton: .27 });
      K.feld(0, 12, 160, 56, ['#030304', '#07080a', '#0c0e12'], (x, y) => (imFenster(x, y) || imTor(x, y)) ? .1 + Math.max(0, 1 - Math.hypot(x - 80, y - 60) / 40) * .25 : -1);
      // Mondlicht von oben rechts auf der Mauer: Schein, helle Oberkante, Kanten an Sims und Bogen
      K.licht(132, 12, 70, '#222c3c', 1, { oval: 1.5, maske: (x, y) => y >= 12 && y < 56 && !imFenster(x, y) && !imTor(x, y) });
      K.rect(0, 11, 160, 1, '#8794a8');
      fenster.forEach(([fx, fy]) => { K.rect(fx - 1, fy + 10, 9, 1, '#6a7688'); K.rect(fx + 7, fy, 1, 10, '#56627a'); });
      for (let y = 20; y < 56; y++) for (let x = 81; x < 92; x++) if (imTor(x, y) && !imTor(x + 1, y)) K.set(x, y, '#7886a0');
      for (let x = 70; x < 92; x++) for (let y = 28; y < 42; y++) if (imTor(x, y) && !imTor(x, y - 1) && x > 78) K.set(x, y, '#7886a0');
      // Läden: zwei Fenster hängen schief
      K.linie(46, 24, 53, 28, '#56627a'); K.linie(142, 40, 149, 43, '#56627a');

      // Hofpflaster
      K.pflaster(55, 90, BODEN, { vx: 80, ton: .2 });
      for (let i = 0; i < 26; i++) { const x = K.r.i(4, 155), y = K.r.i(60, 88); if (Math.hypot(x - cx, (y - cy) * 2.2) < rx + 4) continue; K.set(x, y, '#1f2a1c'); K.set(x, y - 1, '#34452e'); }

      // Brunnenwand: Zylinder aus Quadern mit Fugen, nach unten dunkler (Unterseite im Schatten)
      const zyl = K.maske();
      zyl.fn(cx - rx, cy, cx + rx + 1, cy + 22, (x, y) => Math.abs(x - cx) <= rx && y <= cy + 16 + Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) * ry * .9);
      K.form(zyl, 0, { r: ['#3a4250', '#8a94a2'], k: STEIN.slice(1, 6), ton: 1.5, verlauf: -.9, vx: .85,
        muster: (x, y) => { const row = Math.floor((y - cy) / 5), c = Math.floor((x + row * 4) / 8); return ((y - cy) % 5 === 0 || (x + row * 4) % 8 === 0 ? -1.1 : 0) + (B.hash(c, row, 5) - .5) * .6; } });
      // Schatten unter dem Ring und dunkle Sohle
      for (let x = cx - rx; x <= cx + rx; x++) {
        const t = (x - cx) / rx, yb = Math.round(cy + ry * Math.sqrt(Math.max(0, 1 - t * t)) + 1);
        K.set(x, yb + 1, '#08090c'); if (B.bay(x, yb) > .4) K.set(x, yb + 2, '#0c0e12');
      }
      for (let x = cx - rx; x <= cx + rx; x++) { const t = (x - cx) / rx, yb = Math.round(cy + 16 + Math.sqrt(Math.max(0, 1 - t * t)) * ry * .9); K.set(x, yb, '#06070a'); K.set(x, yb - 1, '#0b0d11'); }
      // Ring oben: helle Oberkante (Mondlicht rechts oben), Fugen, dunkle Innenkante
      const ring = K.maske(); ring.ell(cx, cy, rx + 1, ry + 1);
      K.form(ring, 0, { r: ['#4a5463', '#a4b0c2'], k: STEIN.slice(2, 6), ton: 1.8, muster: (x, y) => { const a = Math.atan2((y - cy) / ry, (x - cx) / rx); return (Math.floor(a * 6) % 2 ? .35 : -.2) + ((a * 6) % 1 < .14 ? -1.1 : 0); } });
      for (let a = -Math.PI; a <= Math.PI; a += .02) {   // Oberkante: rechte obere Hälfte hell, linke Seite blasser
        const x = Math.round(cx + Math.cos(a) * (rx + 1)), y = Math.round(cy + Math.sin(a) * (ry + 1));
        if (Math.sin(a) < .15 && Math.cos(a) > -.3) K.set(x, y, Math.cos(a) > .3 ? '#c4cedc' : '#8b97aa');
      }

      // Der Schacht: Blick hinab. Öffnung oben, die Innenwand verengt sich nach unten zu einem kleineren Grund.
      const loch = K.maske(); loch.ell(cx, cy, lrx, lry);
      const gy = cy + lry * .42, grx = lrx * .52, gry = lry * .55;      // Schachtgrund (kleinere Ellipse, tiefer)
      const kern = [cx + 1, cy + lry * .45];
      for (let y = loch.y0; y <= loch.y1; y++) for (let x = loch.x0; x <= loch.x1; x++) {
        if (!loch.has(x, y)) continue;
        const v = (y - (cy - lry)) / (2 * lry), dx = (x + .5 - cx) / lrx;
        // Innenwand: oben blass im Mondlicht, nach unten schwarz; Fugen als waagerechte Reihen
        let wand = v < .18 ? '#242a34' : v < .4 ? '#171b22' : v < .65 ? '#0e1117' : '#07080b';
        if (Math.floor((y - cy + lry) / 2.5) % 2 === 0 && B.hash(x >> 2, y >> 1, 9) < .4) wand = v < .4 ? '#0f1217' : '#050608';
        K.set(x, y, wand);
        // Schimmer: oben fast nichts, nach unten dichter und heller, die hellste Stufe nur im kleinen Kern
        const tief = Math.pow(Math.max(0, v - .3) / .7, 1.9);
        const mitte = Math.max(0, 1 - Math.abs(dx) * .8);
        const k = Math.max(0, 1 - Math.hypot((x + .5 - kern[0]) / 8, (y + .5 - kern[1]) / 2.6));
        const wel = Math.sin(x * .6 + y * .8) * .06;
        const s = tief * mitte * .72 + k * .55 + wel * tief;
        if (s < .02) continue;
        const lv = Math.floor(s * 5 + B.bay(x, y) - .3);
        if (lv >= 0 && s * 1.15 > B.bay(x, y) * .9) K.set(x, y, X[Math.min(4, lv)]);
      }
      // Einzelne dunkelste Pixel an der Innenwand oben (Bayer, sehr dünn)
      for (let y = loch.y0 + 1; y <= loch.y0 + 5; y++) for (let x = loch.x0; x <= loch.x1; x++)
        if (loch.has(x, y) && Math.abs(x - cx) > lrx * .25 && B.hash(x, y, 4) < .07) K.set(x, y, X[0]);
      // Perspektive: zwei Linien von den Öffnungsrändern nach unten enger, dazu die Kante des Grundes
      const kl = [[cx - lrx + 1, cy + 1, cx - grx, gy + gry * .5], [cx + lrx - 1, cy + 1, cx + grx, gy + gry * .5]];
      kl.forEach(([x0, y0, x1, y1], i) => { for (let t = 0; t <= 1; t += .02) { const x = Math.round(x0 + (x1 - x0) * t), y = Math.round(y0 + (y1 - y0) * t); if (loch.has(x, y) && B.bay(x, y) > .25) K.set(x, y, i ? '#2c3340' : '#06070a'); } });
      for (let a = 0; a < Math.PI; a += .03) { const x = Math.round(cx + Math.cos(a) * grx), y = Math.round(gy + Math.sin(a) * gry); if (loch.has(x, y) && B.bay(x, y) > .55) K.set(x, y, '#06070a'); }
      for (let x = loch.x0; x <= loch.x1; x++) if (loch.has(x, loch.y0)) K.set(x, loch.y0, '#030304');

      // Widerschein der Farbe: wenige gedithert Pixel einer stark abgedunkelten X-Stufe auf der Innenkante des Rings und auf dem Pflaster
      const wdr = (x, y, p) => { if ((K.get(x, y) >>> 24) && !loch.has(x, y) && p > B.bay(x, y) * 1.05 && B.hash(x, y, 77) < .85) K.set(x, y, WIDERSCHEIN[B.hash(x, y, 3) < .4 ? 1 : 0]); };
      for (let y = Math.floor(cy - ry - 2); y <= cy + ry + 2; y++) for (let x = cx - rx - 2; x <= cx + rx + 2; x++) {
        const d = Math.hypot((x - cx) / (lrx + 3), (y - cy) / (lry + 3)); if (d > 1.18 && d < 1.45) wdr(x, y, .5 - (d - 1.18) * 1.2);
      }
      for (let y = cy + 18; y < 90; y++) for (let x = cx - rx - 16; x <= cx + rx + 16; x++) {
        const d = Math.hypot((x - cx) / (rx + 14), (y - (cy + 20)) / 14); if (d < 1 && K.get(x, y) !== undefined && !zyl.has(x, y)) wdr(x, y, (1 - d) * .55);
      }

      // Pfosten, Querbalken und Winde, Mondkante rechts
      const holz = K.maske();
      holz.kap(cx - rx + 4, cy + 5, cx - rx + 4, 24, 1.8, 1.6); holz.kap(cx + rx - 4, cy + 5, cx + rx - 4, 24, 1.8, 1.6);
      holz.kap(cx - rx + 2, 25, cx + rx - 2, 25, 1.6, 1.6); holz.rect(cx - 7, 22, 14, 7);
      holz.kap(cx - rx + 4, 33, cx - rx + 10, 25, .8, .8); holz.kap(cx + rx - 4, 33, cx + rx - 10, 25, .8, .8);
      K.form(holz, .03, { r: ['#566070', '#aab4c4'], k: K.rampe('#8a7050', .6), ton: 1.4, L: [.7, -.7] });
      for (let x = cx - 6; x <= cx + 6; x += 2) K.set(x, 26, '#30261b');     // Windenwicklung
      // Seil: hängt lang von der Winde, endet ausgefranst in der Luft über dem Schacht
      const SE = ['#8a7850', '#5a4c32'];
      for (let y = 29; y < 52; y++) { const x = cx + 1 - (y > 38 ? 1 : 0) + (y > 47 ? 1 : 0); K.set(x, y, SE[(y >> 1) & 1]); K.set(x + 1, y, y % 3 ? '#3a3020' : SE[1]); }
      [[cx - 1, 52, '#6a5a3a'], [cx + 1, 52, '#4a3e28'], [cx + 3, 52, '#6a5a3a'], [cx - 2, 53, '#4a3e28'], [cx + 1, 53, '#8a7850'], [cx + 4, 53, '#3a3020'],
   [cx - 3, 54, '#3a3020'], [cx, 54, '#6a5a3a'], [cx + 2, 55, '#4a3e28'], [cx + 5, 54, '#4a3e28'], [cx - 1, 55, '#2a2418'], [cx + 3, 56, '#3a3020']].forEach(([x, y, c]) => K.set(x, y, c));
      // Der Eimer liegt umgestürzt auf dem Pflaster
      const eimer = K.maske(); eimer.poly([[cx + 33, 82], [cx + 47, 80], [cx + 45, 88], [cx + 35, 89]]); eimer.kap(cx + 46, 80, cx + 51, 84, .5, .5);
      K.form(eimer, 0, { r: ['#3a4250', '#8a94a2'], k: K.rampe('#8a7a60', .6), ton: 1.4, L: [.6, -.7] });
      K.linie(cx + 36, 83, cx + 45, 82, '#050506');
      K.vignette(.85, { cy: 60, innen: .5 });
    },
  },
};
