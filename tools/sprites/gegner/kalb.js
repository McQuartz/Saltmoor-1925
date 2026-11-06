// Die Walkathedrale, zweiter Wächter: Das Kalb. Der Wal ist nicht allein gestorben. In der Herzkammer hängt an
// seiner Schnur das Kalb, das nie geboren wurde, eingerollt, den Kopf nach unten, so groß wie ein Fischkutter.
// Es ist nicht fertig: Die Haut endet am Bauch, darunter liegen die Rippen offen, und sie wachsen nach innen,
// zur Mitte, wo das Mark glimmt. Das Falsche sind die Flossen. Es sind Hände, mit fünf langen Fingern und
// Nägeln, und sie greifen nach vorn, nach dir. Jeden Zug wächst ein Knochen nach (Kniff waechst).
// Phase 2 (kalb_p2, „Wach“): Das Auge geht auf, der Kiefer klappt herunter, die Rippen spreizen sich wie Finger.
// Randlicht Korallenrosa (Zone walkathedrale_kalb): Es hängt vor dem pulsierenden Glimmen der Herzkammer; das
// Knochenweiß der Szene trägt es nicht, damit es sich von den Dornen und Bögen dahinter löst.
'use strict';
const LIB = require('../lib');
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'kalb', biom: 'walkathedrale', zone: 'walkathedrale_kalb', rang: 'waechter', w: 160, h: 180, fuss: [84, 176], kopf: [104, 8], rimBis: 178,
  todStart: 0.2,
  varianten: {
    kalb: { wach: false },
    kalb_p2: { wach: true },
  },
  // Silhouetten-Proben (nicht gebaut): in einer Fruchtblase (ein Oval im Ring, zu nah an der Rückseite des Mondes
  // und ohne die Hände nur ein Ei); ausgestreckt liegend (ein Fisch, kein Ungeborenes). Genommen: eingerollt am
  // Strang, Kopf unten, die Hände nach vorn.
  proben: {
    probe_blase: { wach: false, blase: true },
    probe_liegend: { wach: false, liegend: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180;
    // sw: Schaukeln am Strang (Grad), greif: Hände nach vorn (0..1), kiefer: Unterkiefer offen
    let sw = 0, greif = 0, kiefer = v.wach ? 0.5 : 0.1, dy = 0, fall = 0, dxg = 0;
    if (p.idle) { dy = [0, 0, 1, 1][f]; greif = [0, 0.1, 0.15, 0.05][f]; }
    if (p.angriff) { sw = [0.06, 0.12, -0.12, -0.05][f]; greif = [-0.4, -0.7, 1, 0.6][f]; kiefer = [0.3, 0.7, 1, 0.6][f]; dxg = [2, 4, -6, -3][f]; }
    if (p.treffer) { sw = [0.05, 0.02][f]; greif = -0.2; dxg = [3, 1][f]; }
    if (p.tod) { fall = r(p.q * 26); sw = -p.q * 0.08; greif = -0.3; kiefer = 0.6; }
    // Drehung um den Aufhängepunkt oben (Schaukeln), dann Verschiebung
    const ax0 = 104, ay0 = 0;
    const T = ([x, y]) => { const ux = x - ax0, uy = y - ay0, c = Math.cos(sw), s = Math.sin(sw); return [ax0 + ux * c - uy * s + dxg, ay0 + ux * s + uy * c + dy + fall]; };
    const Tp = pts => pts.map(T);
    // Rückgrat: vom Hinterkopf rechts hinauf, oben herum, die Fluke links oben (eingerollt wie ein C)
    const ruecken = v.liegend
      ? [[78, 130], [100, 128], [122, 126], [140, 122], [152, 116]]
      : [[80, 120], [100, 108], [114, 88], [118, 66], [112, 46], [98, 34], [80, 30], [66, 34]];
    const radien = v.liegend ? [20, 18, 14, 9, 5] : [21, 20, 18, 15, 12, 9, 6, 4];
    const leib = [];
    for (let i = 0; i < ruecken.length - 1; i++) { const a = T(ruecken[i]), b = T(ruecken[i + 1]); leib.push(C(a[0], a[1], b[0], b[1], radien[i], radien[i + 1], null)); }
    // Fluke: zwei Lappen quer am Schwanzende
    const fe = T(ruecken[ruecken.length - 1]);
    const fluke = v.liegend ? [] : [Pg(Tp([[66, 34], [56, 26], [44, 22], [48, 30], [60, 37], [52, 44], [42, 50], [56, 48], [68, 40]]), null, { rd: 1 })];
    // Kopf: großer Schädel, Schnauze nach links unten; Unterkiefer als eigene Knochenspange
    const kopfY = v.liegend ? 10 : 0;
    const schaedel = Pg(Tp([[86, 104], [80, 98], [66, 98], [50, 106], [34, 118], [22, 130], [20, 135], [34, 134], [52, 132], [70, 138], [86, 140], [92, 126]].map(([x, y]) => [x, y + kopfY])), null, { rd: 3 });
    const kw = kiefer * 0.35;
    const kp = ([x, y]) => { const px = 82, py = 138 + kopfY, ux = x - px, uy = y - py; return [px + ux * Math.cos(-kw) - uy * Math.sin(-kw), py + ux * Math.sin(-kw) + uy * Math.cos(-kw)]; };
    const unterkiefer = Pg(Tp([[84, 136], [64, 140], [42, 140], [26, 138], [24, 141], [44, 146], [66, 146], [86, 144]].map(([x, y]) => kp([x, y + kopfY]))), null, { rd: 1.5 });
    // Rippen: aus dem Rückgrat nach innen, zur Mitte des C gekrümmt, offen (nicht fertig)
    const mitte = [92, 74];
    const rippen = [];
    if (!v.liegend) [[104, 104], [112, 92], [117, 80], [118, 68], [115, 56], [108, 46]].forEach(([x, y], i) => {
      const sp = v.wach ? 1.15 : 1;
      const tx = mitte[0] + (x - mitte[0]) * (0.2 - i * 0.01) * (v.wach ? 0.5 : 1), ty = mitte[1] + (y - mitte[1]) * 0.45;
      const mx = (x + tx) / 2 + (y - mitte[1]) * 0.18 * sp, my = (y + ty) / 2 - (x - mitte[0]) * 0.12 * sp;
      rippen.push(glied(Tp([[x - 6, y + 2], [mx, my], [tx, ty]]), 2.6, 0.9, null));
    });
    // Strang: von oben verdreht herab in den Bauch
    const strang = [];
    { let last = null; for (let i = 0; i <= 12; i++) { const q = i / 12; const pt = T([ax0 + Math.sin(q * 5) * 3 - q * 10, q * 64]); if (last) strang.push(C(last[0], last[1], pt[0], pt[1], 2.8, 2.8, null)); last = pt; } }
    // Hände: Oberarm kurz aus der Schulter, dann die lange Hand mit fünf Fingern, nach vorn (links) greifend
    const g = greif;
    const hand = (sx, sy, hx, hy, spr, dunkel) => {
      const out = [C(...T([sx, sy]), ...T([hx, hy]), 4.2, 3.2, dunkel ? 'dunkel' : null)];
      const fingers = [];
      for (let k = 0; k < 5; k++) {
        const a = Math.PI * (0.78 + spr * (k - 2) * 0.09) - g * 0.25;
        const l1 = 10 + (k === 2 ? 3 : k === 0 ? -3 : 0), l2 = 9 + (k === 2 ? 2 : 0);
        const p1 = [hx + Math.cos(a) * l1, hy + Math.sin(a) * l1], p2 = [p1[0] + Math.cos(a - 0.35 - g * 0.3) * l2, p1[1] + Math.sin(a - 0.35 - g * 0.3) * l2];
        fingers.push(glied(Tp([[hx, hy], p1, p2]), 1.9, 0.8, dunkel ? 'dunkel' : null));
      }
      return { arm: out, fingers };
    };
    const hv = hand(84, 126, 50 - g * 12, 152 + g * 2, 1.15, false);
    const hh = hand(96, 120, 70 - g * 8, 158 - g * 2, 0.9, true);
    // offene Bauchhöhle innen im C: dunkles Fleisch hinter den Rippen, darauf das Mark
    const hoehle = v.liegend ? [] : [Pg(Tp([[100, 104], [92, 96], [86, 90], [80, 80], [80, 66], [86, 54], [96, 46], [106, 50], [112, 62], [112, 84], [108, 98]]), 'dunkel', { rd: 3 })];
    const blase = v.blase ? [Pg(Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2; return T([84 + Math.cos(a) * 66, 96 + Math.sin(a) * 78]); }), null, { rd: 1 })] : [];
    const gruppen = [
      { p: blase, k: 1 },                                         // 0 Probe: Blase
      { p: [...hh.arm, ...hh.fingers.flat()], k: 0.6, kante: true }, // 1 hintere Hand
      { p: strang, k: 1, kante: true },                           // 2 Strang
      { p: [...leib, ...fluke, ...hoehle], k: 3 },                // 3 Leib, Fluke, Bauchhöhle
      { p: rippen.flat(), k: 0.5, kante: true },                  // 4 Rippen
      { p: [schaedel], k: 1, kante: true },                       // 5 Schädel
      { p: [unterkiefer], k: 0.5, kante: true },                  // 6 Unterkiefer
      { p: [...hv.arm, ...hv.fingers.flat()], k: 0.6, kante: true }, // 7 vordere Hand
    ];
    gruppen.forEach(gr => { gr.anker = [dxg, dy + fall]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('walkathedrale_kalb'), { rimBis: 178 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      const ist = (x, y, gg) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === gg;
      const b = (x, y) => LIB.bay(x - dxg, y - dy - fall);
      // Leib: Haut nur oben (Rücken); zum Bauch hin hört sie auf, dort liegt das Innere offen und dunkel
      const M = T(mitte);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 3)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const d = Math.hypot(x - M[0], y - M[1]);
        if (!v.liegend && d < 30) { P.set(x, y, d < 22 ? 'k0' : (b(x, y) < 0.4 ? 'k1' : 'k0')); continue; }
        if (!v.liegend && d < 34 && b(x, y) < 0.5) { P.set(x, y, 'k1'); continue; }
        // Hautfalten quer zum Rücken (Bauchfurchen wie beim Wal)
        if ((Math.round(d) % 6) === 0 && d < 52) P.set(x, y, 'k1');
      }
      // Mark: in der offenen Mitte glimmt es (das innere Licht), gedithert
      if (!aus && !v.liegend) { P.glow(M[0] + 0.5, M[1] + 2, 22, 0.95, 'mark', 'k2'); P.glow(M[0] + 0.5, M[1] + 2, 8, 0.9, 'glutDim', 'mark'); P.set(r(M[0]), r(M[1] + 2), 'glut'); P.set(r(M[0]) + 1, r(M[1] + 2), 'kern'); augen.push([r(M[0]) + 1, r(M[1] + 2)]); }
      // Rippen: junges Bein, glatt, die Spitzen heller
      for (const rp of rippen) KA.licht(P, rp, { c: 'r1', c2: 'k3' });
      // Schädel: Knochenplatten, Nasenloch oben, Augenhöhle; Mund mit Bartenansatz
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 5)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        if (!ist(x, y + 1, 5) && !ist(x, y + 1, 6)) P.set(x, y, 'k0');
        else if (!ist(x, y + 2, 5) && ist(x, y + 2, 0) === false && b(x, y) < 0.5) P.set(x, y, 'bein');
      }
      const S = p => T([p[0], p[1] + kopfY]);
      // Barten: kurze helle Striche am Oberkiefer
      for (let k = 0; k < 9; k++) { const q = S([30 + k * 6, 133 - (k < 2 ? 1 : 0)]); P.auf(r(q[0]), r(q[1]), 'bein'); P.auf(r(q[0]), r(q[1]) + 1, k % 2 ? 'k3' : 'bein'); }
      // Naht zwischen den Schädelplatten
      { const a = S([70, 100]), c2 = S([62, 128]); P.line(r(a[0]), r(a[1]), r(c2[0]), r(c2[1]), 'k1', true); }
      // Auge: geschlossen (ein Spalt, darin Licht) oder in Phase 2 offen, milchig
      const e = S([70, 116]);
      P.el(e[0] + 0.5, e[1] + 0.5, 6.5, 5.5, 'k0', true);
      P.el(e[0] + 1.5, e[1] - 0.5, 4.5, 3.6, 'k1', true);
      if (!aus) {
        if (v.wach) { P.glow(e[0] + 0.5, e[1] + 0.5, 7, 0.9, 'glutDim', 'k3'); P.el(e[0] + 0.5, e[1] + 0.5, 3.2, 2.8, 'glut', true); P.set(r(e[0]) - 1, r(e[1]), 'kern'); P.set(r(e[0]), r(e[1]), 'k0'); P.set(r(e[0]) + 1, r(e[1]), 'k0'); augen.push([r(e[0]) - 1, r(e[1])]); }
        else { const offen = p.idle && f === 2 ? 0 : 1; for (let k = -3; k <= 2; k++) P.set(r(e[0]) + k, r(e[1]), offen ? (k === -1 ? 'kern' : 'glut') : 'k3'); P.glow(e[0], e[1] + 0.5, 6, 0.6, 'glutDim', 'k3'); augen.push([r(e[0]) - 1, r(e[1])]); }
      }
      // Hände: Knöchel und Nägel; die Fingerspitzen tragen bleiche Nägel
      for (const hd of [hv, hh]) for (const fi of hd.fingers) { const last = fi[fi.length - 1]; P.auf(r(last.x2), r(last.y2), hd === hv ? 'bein' : 'k3'); const mid = fi[0]; P.auf(r(mid.x2), r(mid.y2), 'k0'); }
      KA.licht(P, [...hv.arm, ...hv.fingers.flat()], { c: 'r1', c2: null });
      // Strang: verdreht, Windungen dunkel
      for (let y = 0; y < 72; y++) for (let x = 80; x < 130; x++) if (ist(x, y, 2) && P.get(x, y) <= 4 && (y + Math.round(x * 0.6)) % 5 === 0) P.set(x, y, 'k0');
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
    };
    return { gruppen, details, augen };
  },
};
