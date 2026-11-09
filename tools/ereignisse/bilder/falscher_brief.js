// Ereignisbild 160 × 90 · „Der falsche Brief“ (Auftrag 3 M11, Würze): ein Brief auf nassem Holz, Kerzenlicht von oben rechts.
// Das Blatt ist etwa halb so breit wie das Bild, leicht gedreht, glattes helles Papier mit einem Knick in der Mitte.
// Die Schrift steht in sieben getrennten Zeilen, die nach rechts ansteigen (nach links fallen); die Buchstaben lehnen
// sich zurück. Am unteren Rand liegt ein gesprungener Siegelrest. Unter dem Blatt spiegelt eine Pfütze das Papier.
// Biom „alle“ (neutrale Palette), das Ereignis steht noch nicht in den Daten.
'use strict';

const NASS = ['#07060a', '#0e0b09', '#17120d', '#221a12', '#30251a', '#413224'];
const PAPIER = ['#4a463c', '#7c7666', '#aca48e', '#d2c9b0', '#ece4cc'];
const WACHS = ['#1a0808', '#2e0f0e', '#4a1815', '#6e2822'];
const MESSING = ['#1c140a', '#3a2a12', '#6a4c1e', '#a07a30'];
const KERZE = ['#3a352c', '#6a6252', '#a89e86', '#d8ceb4'];

module.exports = {
  biom: 'alle',
  bilder: {
    falscher_brief(K) {
      const { B } = K;
      K.bretter(0, 0, 160, 90, NASS, { breite: 13, ton: .3 });
      K.feld(0, 0, 160, 90, NASS, (x, y) => (Math.sin(x * .09 + y * .5 + B.rausch2(x * .04, y * .2, K.seed) * 5) > .86 ? .1 : -1));
      K.lichtquelle(138, 12);

      // Blatt: 80 × 52, leicht gedreht
      const a = -.08, c = Math.cos(a), s = Math.sin(a), ox = 24, oy = 15, w = 80, h = 52;
      const P = (u, v) => [ox + u * c - v * s, oy + u * s + v * c];
      const lokal = (x, y) => { const dx = x + .5 - ox, dy = y + .5 - oy; return [dx * c + dy * s, -dx * s + dy * c]; };

      // Pfütze unter dem Blatt: dunkles Wasser, darin die Spiegelung des Papiers als gedithertes helles Band
      const pf = K.maske(); pf.ell(66, 80, 46, 8);
      K.form(pf, 0, { k: ['#05070a', '#090c11', '#10151c', '#1a212b'], r: ['#2a3442', '#7e8ea4'], ton: 1.1, fase: 0, rand: 1, L: [.7, -.6] });
      for (let y = 72; y < 89; y++) for (let x = 20; x < 112; x++) {
        if (!pf.has(x, y)) continue;
        const q = (y - 72) / 16, ein = Math.max(0, 1 - Math.abs(x - 64) / 44);
        if (ein * (1 - q) * 1.1 > B.bay(x, y) + .1 && Math.sin(y * 2.2 + x * .12) > -.3) K.set(x, y, q < .5 ? '#5a6272' : '#2c3442');
      }

      // Blatt zeichnen: glatt, hell, Rand rechts oben mit Licht
      const blatt = K.maske();
      blatt.poly([P(0, 0), P(w - 7, 0), P(w, 7), P(w, h), P(0, h)]);
      K.form(blatt, 0, { k: PAPIER.slice(0, 4), r: [PAPIER[3], PAPIER[4]], ton: 1.0, verlauf: 0, L: [.65, -.75], fase: 1,
        muster: (x, y) => { const [u, v] = lokal(x, y); return Math.abs(u - w / 2) < .5 ? -.7 : Math.abs(u - w / 2 - 1) < .5 ? .3 : 0; } });

      // Schrift: zusammenhängende Schnörkel, zurückgelehnt, Zeilen steigen nach rechts an
      const tinte = ['#10141f', '#1e2536'];
      const r = B.rng(11);
      const zeile = (u0, v0, u1, hoch) => {
        const steig = -.22; let u = u0, px = null, py = null;
        while (u < u1) {
          const hh = hoch * (r() < .3 ? 1.7 : r() < .5 ? 1 : .7);
          const vb = v0 + (u - u0) * steig;
          const [xa, ya] = P(u - hh * .6, vb - hh), [xb, yb] = P(u + .9, vb);
          if (px !== null) K.linie(px, py, xa, ya, tinte[1]);
          K.linie(xa, ya, xb, yb, tinte[0]);
          px = xb; py = yb; u += 1.6;
          if (r() < .1) { u += 3.5; px = null; }   // Wortlücke: Feder abgesetzt
        }
      };
      const zeilen = [[11, 14, 66, 2.2], [9, 21, 70, 2.2], [9, 28, 72, 2.2], [9, 35, 71, 2.2], [9, 42, 68, 2.2], [9, 49, 54, 2.2]];
      zeilen.forEach(([u0, v0, u1, hh]) => zeile(u0, v0 + 6, u1, hh));
      zeile(8, 11, 30, 3);   // Anrede, größer
      // Unterschrift: ein ausgeschwungener Zug nach links unten
      { const [ax, ay] = P(64, 44), [bx, by] = P(42, 48); K.linie(ax, ay, bx, by, tinte[0]); K.linie(ax, ay + 1, bx, by + 1, tinte[1]); }

      // Siegelrest am unteren Rand des Blatts: zwei Wachsstücke, gesprungen
      const [sx, sy] = P(w * .5 + 2, h - 3);
      const wa = K.maske(); wa.ell(sx - 4, sy, 6, 5); wa.poly([[sx - 10, sy - 3], [sx - 6, sy - 6], [sx - 2, sy - 1], [sx - 7, sy + 5]]);
      const wb = K.maske(); wb.poly([[sx + 1, sy - 5], [sx + 7, sy - 3], [sx + 8, sy + 4], [sx + 3, sy + 6], [sx + 1, sy + 1]]);
      for (const m of [wa, wb]) K.form(m, 0, { k: WACHS, r: ['#6e2822', '#d88878'], ton: 1.6, fase: 1, L: [.65, -.75] });
      K.linie(sx - 1, sy - 5, sx + 1, sy + 6, '#0a0303');
      const sp = K.maske(); sp.poly([[sx + 12, sy + 8], [sx + 16, sy + 7], [sx + 15, sy + 10]]);
      K.form(sp, 0, { k: WACHS, r: ['#6e2822', '#d88878'], ton: 1.4, fase: 0, L: [.65, -.75] });

      // Kerze rechts oben im Messingschälchen
      const sh = K.maske(); sh.ell(138, 29, 11, 3.2); sh.rect(128, 26, 20, 3);
      K.form(sh, 0, { k: MESSING, r: ['#a07a30', '#f0d898'], ton: 1.4, fase: 0, L: [0, -1] });
      const ke = K.maske(); ke.rect(135, 14, 7, 13);
      K.form(ke, 0, { k: KERZE, r: ['#a89e86', '#f4ecd4'], ton: 1.5, fase: 0, L: [0, -1], muster: (x, y) => (x === 141 ? .5 : x === 135 ? -.5 : 0) });
      K.set(136, 20, '#d8ceb4'); K.set(136, 21, '#d8ceb4'); K.set(141, 24, '#a89e86');
      K.flamme(138.5, 14, { gross: 2, hof: 44, staerke: 1 });
      K.licht(138, 20, 58, '#4a3010', 1, { oval: 1.2 });
      K.licht(138, 20, 30, '#7a4c18', .7, { oval: 1.1, maske: (x, y) => blatt.has(x, y) });
      // Wassertropfen auf dem Holz
      for (const [x, y] of [[8, 80], [126, 86], [152, 74], [118, 66], [10, 40], [8, 18], [150, 50]]) { K.set(x, y, '#0a0d12'); K.set(x + 1, y, '#1a232e'); K.set(x + 1, y - 1, '#8a9ab0'); }
      K.vignette(.5, { cx: 90, cy: 40, innen: .8 });
    },
  },
};
