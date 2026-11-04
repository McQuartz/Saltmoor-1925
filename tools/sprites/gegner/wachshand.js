// Die Wachshände (Grotte der Gaben). Ein zerflossener Hügel aus Votivwachs, aus dem Hände
// verschieden hoch nach oben greifen. Im Wachs stecken Votivaugen, die dich ansehen.
// Das Wachs ist warm: es glimmt von innen (glutDim), obwohl keine Kerze in der Nähe ist.
'use strict';
// Hände: [Basis x, Basis y, Winkel (−π/2 = hoch), Länge, Größe, Krümmung, hinten?]
const P2 = -Math.PI / 2;
module.exports = {
  id: 'wachshand', biom: 'grotte', zone: 'grotte', w: 96, h: 120, fuss: [48, 114], kopf: [46, 22], rimBis: 112,
  varianten: {
    wachshand_a: {
      haende: [[50, 90, -1.62, 20, 0.8, 0.5, 1], [44, 92, -1.5, 38, 1.1, 0.1], [34, 94, -1.85, 30, 1.0, 0.2], [60, 92, -1.25, 32, 1.0, 0.25], [26, 100, -2.2, 18, 0.85, 0.4], [70, 98, -1.0, 20, 0.85, 0.6]],
      huegel: 1.35, augen: [[40, 100], [58, 102]],
    },
    wachshand_b: {
      haende: [[56, 92, P2 + 0.16, 15, 0.72, 0.5, 1], [46, 94, P2 - 0.06, 34, 1.12, 0.1], [30, 98, P2 - 0.62, 20, 0.9, 0.3], [66, 94, P2 + 0.48, 25, 0.98, 0.2], [21, 106, -Math.PI + 0.35, 11, 0.72, 0.6], [77, 102, -0.75, 9, 0.7, 1.3]],
      huegel: 1, augen: [[38, 104], [55, 101]], kerzen: [[62, 95], [72, 101]],
    },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, pose } = A;
    const f = p.f, P0 = pose(p, { fall: 18 });
    // Haltung der Hände je Animation: Neigung (+ = nach rechts), Krümmung, Versatz
    let neig = 0, kr = 0, ox = 0, laenge = 1, offen = 0;
    if (p.angriff) { neig = [0.18, 0.3, -0.42, -0.12][f]; kr = [-0.25, -0.3, 1.3, 0.5][f]; ox = [2, 4, -7, -3][f]; laenge = [1, 1.04, 1.1, 1][f]; }
    if (p.treffer) { neig = [0.25, 0.12][f]; kr = -0.35; ox = [2, 1][f]; offen = 1; }
    if (p.tod) { laenge = 1 - p.q * 0.55; kr = p.q * 1.6; neig = p.q * 0.3; }
    const H = v.huegel, T = 0;
    const hy = 114 - 22 * H;
    // Hügel: zerflossen, mit Laschen, die über den Boden laufen
    const huegel = Pg([[14, 115], [17, 109], [22, 104], [28, hy + 8], [36, hy + 3], [45, hy + T], [53, hy + 2 + T], [60, hy + 6], [68, hy + 9], [74, 104], [80, 109], [84, 115]], null, { rd: 2 });
    // Laschen: das Wachs ist über den Boden gelaufen, ungleich weit
    const laschen = [E(16, 113, 9, 2.5, null), E(83, 113, 10, 2.5, null), E(46, 113, 22, 3, null), E(70, 111, 9, 4, null), E(24, 110, 7, 4.5, null)];
    const knoten = [E(34, hy + 9, 9, 8 * H, null), E(51, hy + 6 + T, 11, 9 * H, null), E(66, hy + 11, 8, 6, null)];
    const gruppen = [];
    const hinten = [], vorne = [];
    const fingerSpitzen = [];
    v.haende.forEach(([bx, by, a0, len, s, c0, hi], i) => {
      const ph = p.idle ? [0, 0.12, 0.22, 0.1][(f + i) % 4] : 0;
      const ang = a0 + neig * (0.6 + 0.4 * (len / 40)) ;
      const L = len * laenge, curl = c0 + kr + ph;
      const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx;
      const sx = ox * (len / 40);
      const wx = bx + dx * L + sx, wy = by + dy * L + T + P0.fall * 0.3;
      const ex = bx + dx * L * 0.55 + sx * 0.5 + nx * (i % 2 ? 1 : -1) * 0.8, ey = by + dy * L * 0.55 + T;
      const teile = [C(bx, by + 2, ex, ey, 3.8 * s, 2.6 * s, 'haut'), C(ex, ey, wx, wy, 2.6 * s, 1.9 * s, 'haut')];
      // Handfläche: flach, etwas breiter als das Gelenk
      const px = wx + dx * 4 * s, py = wy + dy * 4 * s;
      teile.push(Pg([[wx + nx * 2.4 * s, wy + ny * 2.4 * s], [px + nx * 3.4 * s, py + ny * 3.4 * s], [px + dx * 2 * s + nx * 3.2 * s, py + dy * 2 * s + ny * 3.2 * s], [px + dx * 2 * s - nx * 3.2 * s, py + dy * 2 * s - ny * 3.2 * s], [px - nx * 3.4 * s, py - ny * 3.4 * s], [wx - nx * 2.4 * s, wy - ny * 2.4 * s]], 'haut', { rd: 0.6 }));
      // vier Finger, zwei Glieder, Krümmung zur Handfläche hin
      for (let k = 0; k < 4; k++) {
        const o = (k - 1.5) * 1.75 * s, fa = ang + (k - 1.5) * (0.16 + (offen ? 0.12 : 0)) * (1 - Math.min(1, Math.max(0, curl)) * 0.5);
        const lang = (k === 1 || k === 2 ? 5.2 : 4.3) * s;
        const b0 = [px + dx * 2 * s + nx * o, py + dy * 2 * s + ny * o];
        const k1 = [b0[0] + Math.cos(fa) * lang, b0[1] + Math.sin(fa) * lang];
        const a2 = fa + curl * 1.1 * (k < 2 ? -1 : 1) * 0.25 + curl * 0.9;
        const k2 = [k1[0] + Math.cos(a2) * lang * 0.85, k1[1] + Math.sin(a2) * lang * 0.85];
        teile.push(C(b0[0], b0[1], k1[0], k1[1], 1.25 * s, 1.05 * s, 'haut'), C(k1[0], k1[1], k2[0], k2[1], 1.05 * s, 0.75 * s, 'haut'));
        fingerSpitzen.push(k2);
      }
      // Daumen zur Seite
      const ta = ang - 1.05 + curl * 0.3, t0 = [wx + dx * 2 * s - nx * 2.6 * s, wy + dy * 2 * s - ny * 2.6 * s];
      teile.push(C(t0[0], t0[1], t0[0] + Math.cos(ta) * 4.5 * s, t0[1] + Math.sin(ta) * 4.5 * s, 1.3 * s, 0.9 * s, 'haut'));
      (hi ? hinten : vorne).push({ p: teile, k: 1.2, anker: [r(sx), T] });
    });
    // Kerzenstümpfe im Wachs (nur b): rot, eine brennt noch
    const kerzen = (v.kerzen || []).map(([x, y]) => C(x, y, x, y - 7, 1.6, 1.5, null, { pf: 'flat' }));
    gruppen.push(...hinten, { p: [huegel, ...laschen, ...knoten], k: 3, anker: [0, 0] }, { p: kerzen, k: 0 }, ...vorne);
    const augen = [];
    const details = P => {
      // Wärme im Wachs: von innen, gedithert
      P.glow(47, hy + 14, 30, 0.95, 'glutDim', 'k3'); P.glow(36, hy + 10, 12, 0.7, 'glutDim', 'k3');
      // Wachstropfen, die am Hügel herunterlaufen (hell gegen den Schiefer)
      for (const [x, y, l] of [[24, hy + 10, 4], [40, hy + 4, 3], [67, hy + 6, 5], [80, 106, 3]]) for (let k = 0; k < l; k++) P.auf(x, y + k, k === l - 1 ? 'wachs' : 'k3');
      (v.kerzen || []).forEach(([x, y], i) => {
        for (let k = 1; k < 7; k++) P.auf(x, y - k, k % 3 === 0 ? 'k3' : 'kerzenrot');
        if (i === 0 && !P0.aus) { P.set(x, y - 8, 'flamme'); P.set(x, y - 9, 'kern'); P.glow(x + 0.5, y - 7, 5, 0.8, 'glutDim', 'k3'); }
      });
      // Votivaugen: mandelförmige Wachsplatte, darin das Auge
      v.augen.forEach(([x, y], i) => {
        const yy = y + T;
        for (let k = -3; k <= 2; k++) P.auf(x + k, yy - 2 + (k === -3 || k === 2 ? 1 : 0), 'k3');
        for (let k = -2; k <= 1; k++) P.auf(x + k, yy + 2, 'k0');
        P.auf(x - 4, yy, 'k0'); P.auf(x + 3, yy, 'k0'); P.auf(x - 3, yy + 1, 'k1'); P.auf(x + 2, yy + 1, 'k1');
        if (P0.aus || (p.idle && f === (i + 1) % 4)) { P.auf(x - 1, yy, 'k1'); P.auf(x, yy, 'k1'); return; }
        P.auge(x - 1, yy, 2); P.set(x - 2, yy, 'glutDim'); P.set(x - 1, yy + 1, 'glutDim'); P.set(x, yy + 1, 'glutDim'); augen.push([x - 1, yy]);
      });
    };
    return { gruppen, details, augen };
  },
};
