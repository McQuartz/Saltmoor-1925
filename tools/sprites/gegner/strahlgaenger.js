// Leuchtturmhof: Der aus dem Strahl. Ein Matrose der „Gesine“, die im Winter 1917 auf die Klippe lief,
// weil das Feuer nach innen schien. Er kommt nachts den Strahl entlang in den Hof, mit Korkring und
// Südwester, und tropft. Falsch ist, dass es ihn nur gibt, wo der Strahl ihn trifft: Eine gerade Kante
// schneidet ihn schräg durch, dahinter ist nichts als ein wenig Licht im Staub. Das Wasser tropft nach oben.
'use strict';
const LIB = require('../lib');
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
module.exports = {
  id: 'strahlgaenger', biom: 'leuchtturm', zone: 'leuchtturm', w: 96, h: 120, fuss: [44, 115], kopf: [40, 10], rimBis: 113,
  varianten: {
    // a: Schnitt steil, ein Riemen in der Hand
    strahlgaenger_a: { schnitt: [[37, 0], [70, 120]], waffe: 'riemen' },
    // b: Schnitt flacher (mehr fehlt oben), Tang über der Schulter, die Hand leer und lang
    strahlgaenger_b: { schnitt: [[31, 0], [78, 120]], waffe: null, tang: true },
  },
  // Probe ganz (nicht gebaut): als ganzer Mann mit Korkring las er sich wie der Helmtaucher des Hafens;
  // erst der Schnitt macht ihn zu einer eigenen Figur.
  proben: { probe_ganz: { schnitt: null, waffe: 'riemen' } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f, W = 96, H = 120;
    let lean = 0, atem = 0, fall = 0, arm = 0;
    if (p.idle) atem = 0;
    // arm: 0 hängt, 1 ausgeholt (hinter dem Kopf), 2 Schlag nach vorn unten
    if (p.angriff) { lean = [2, 4, -7, -3][f]; arm = [0.6, 1, 2, 1.5][f]; }
    if (p.treffer) lean = [3, 1][f];
    if (p.tod) { fall = r(p.q * 14); lean = r(p.q * 3); }
    const T = atem + fall, cx = 44 + lean;
    // Beine: Seestiefel, breitbeinig wie auf schwankendem Deck
    const huefte = [cx, 72 + T];
    const beine = [...glied([[cx - 5, huefte[1]], [cx - 9, 92 + T * 0.5], [cx - 11, 110]], 5.2, 4.2, null), ...glied([[cx + 6, huefte[1]], [cx + 9, 92 + T * 0.5], [cx + 11, 110]], 5, 4, 'dunkel'),
      E(cx - 13, 112, 6.5, 3, null), E(cx + 11, 112, 6, 3, 'dunkel')];
    // Rumpf: dicker Fischerpullover; Korkring um die Brust
    const rumpf = Pg([[cx - 13, 38 + T], [cx + 13, 37 + T], [cx + 15, 52 + T], [cx + 11, 76 + T], [cx - 11, 76 + T], [cx - 15, 52 + T]], null, { rd: 3 });
    const ring = [E(cx, 56 + T, 18, 10, null, { pf: 'bevel' })];
    const ringLoch = E(cx, 55 + T, 13, 3.2, null);
    // Kopf mit Südwester (Krempe hinten lang)
    const kopf = E(cx - 4, 28 + T, 7.5, 8, 'haut', { pf: 'bevel' });
    const hut = [Pg([[cx - 9, 24 + T], [cx - 6, 16 + T], [cx + 5, 15 + T], [cx + 8, 22 + T]], null, { rd: 1.5 }), Pg([[cx - 13, 24 + T], [cx + 8, 21 + T], [cx + 16, 28 + T], [cx + 10, 27 + T], [cx - 12, 27 + T]], 'dunkel', { rd: 0.6 })];
    // Arm vorn: hängt, holt aus, schlägt
    let hand, ell;
    const sch = [cx - 11, 42 + T];
    if (arm === 0) { ell = [cx - 16, 58 + T]; hand = [cx - 17, 74 + T]; }
    else if (arm < 1.5) { ell = [cx - 8 + arm * 6, 30 + T]; hand = [cx + 2 + arm * 6, 18 + T - arm * 4]; }
    else if (arm < 1.8) { ell = [cx - 20, 44 + T]; hand = [cx - 30, 56 + T]; }
    else { ell = [cx - 22, 42 + T]; hand = [cx - 34, 52 + T]; }
    const armV = [...glied([sch, ell, hand], 4.2, 3, null), E(hand[0], hand[1], 3, 2.6, 'haut')];
    const armH = glied([[cx + 11, 42 + T], [cx + 16, 58 + T], [cx + 15, 72 + T]], 3.8, 2.8, 'dunkel');
    // Riemen (Ruder): Stiel und Blatt; zeigt vom Griff in Richtung wa
    const waffe = [];
    if (v.waffe === 'riemen') {
      const wa = arm === 0 ? 1.75 : arm < 1.5 ? -0.9 - arm * 0.5 : arm < 1.8 ? 2.55 : 2.75, L = 40;
      const a0 = [hand[0] - Math.cos(wa) * 8, hand[1] - Math.sin(wa) * 8], e = [hand[0] + Math.cos(wa) * L, hand[1] + Math.sin(wa) * L];
      waffe.push(C(a0[0], a0[1], e[0], e[1], 1.2, 1.2, 'dunkel', { pf: 'flat' }));
      const nx = -Math.sin(wa), ny = Math.cos(wa), dx = Math.cos(wa), dy = Math.sin(wa);
      waffe.push(Pg([[e[0] - nx * 2, e[1] - ny * 2], [e[0] + nx * 2, e[1] + ny * 2], [e[0] + nx * 3.6 + dx * 13, e[1] + ny * 3.6 + dy * 13], [e[0] + dx * 15, e[1] + dy * 15], [e[0] - nx * 3.6 + dx * 13, e[1] - ny * 3.6 + dy * 13]], null, { rd: 0.5 }));
    }
    const tang = v.tang ? [...glied([[cx - 8, 38 + T], [cx - 12, 50 + T], [cx - 10, 64 + T], [cx - 14, 80 + T]], 1.6, 0.8, 'dunkel'), ...glied([[cx - 4, 38 + T], [cx - 2, 54 + T], [cx - 5, 70 + T]], 1.3, 0.6, 'dunkel')] : [];
    const hintenWz = arm > 0 && arm < 1.5;
    const gruppen = [
      { p: hintenWz ? waffe : [], k: 0 },
      { p: armH, k: 1, anker: [lean, T] },
      { p: beine, k: 1.5 },
      { p: [rumpf], k: 2, anker: [lean, T] },
      { p: [kopf], k: 0, kante: true, anker: [lean, T] },
      { p: hut, k: 0.5, kante: true, anker: [lean, T] },
      { p: ring, k: 0, kante: true, anker: [lean, T] },
      { p: tang, k: 0, noRim: true },
      { p: hintenWz ? [] : waffe, k: 0, kante: true },
      { p: armV, k: 1.2, kante: true, anker: [lean, T] },
    ];
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('leuchtturm'), { rimBis: 113 });
    // Schnittlinie: was rechts davon liegt, gibt es nicht (nur Staub im Licht)
    const S = v.schnitt;
    const seite = (x, y) => { if (!S) return -1; const [[x0, y0], [x1, y1]] = S; return (x - x0) * (y1 - y0) - (y - y0) * (x1 - x0) > 0 ? -1 : 1; };
    const augen = [];
    const details = P => {
      innenKanten(P, gid, gruppen, W, H, 'r1');
      const istG = (x, y, i) => gid[y * W + x] === i;
      // Pullover: Rippen waagerecht (dunkel/hell abwechselnd), Rollkragen
      for (let y = r(40 + T); y < 76 + T; y += 3) for (let x = cx - 14; x <= cx + 14; x++) if (istG(x, y, 3) && P.get(x, y) >= 1 && P.get(x, y) <= 4) P.set(x, y, (x + y) % 2 ? 'k1' : 'k3');
      P.line(cx - 7, 37 + T, cx + 5, 36 + T, 'k3', true);
      // Korkring: das Loch innen dunkel, vier rote Felder, Tauschlaufen
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!istG(x, y, 6)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const u = (x + 0.5 - cx) / 10, w2 = (y + 0.5 - 55 - T) / 4.6; if (u * u + w2 * w2 < 1) { P.set(x, y, y < 55 + T ? 'k0' : 'k1'); continue; }
        const a = Math.atan2((y + 0.5 - 56 - T) / 10, (x + 0.5 - cx) / 18); // -PI..PI
        const band = [-2.4, -0.75, 0.75, 2.4].some(b => Math.abs(a - b) < 0.13);
        const oben = !istG(x, y - 1, 6) || !istG(x + 1, y - 1, 6) || !istG(x + 1, y, 6);
        P.set(x, y, band ? 'rot' : oben ? (a < 0 ? 'r2' : 'r1') : (a < -0.3 && a > -2.8 ? 'r1' : 'k3'));
      }
      
      // Gesicht: aufgedunsen, Mund offen, Augen trüb hell
      if (!p.tod || f < 1) {
        const ex = r(cx - 10), ey = r(28 + T);
        P.glow(ex + 1.5, ey + 0.5, 4, 0.5);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut'); augen.push([ex, ey]);
        P.auf(ex + 1, ey + 5, 'k0'); P.auf(ex + 2, ey + 5, 'k0'); P.auf(ex + 1, ey + 6, 'k1');
      }
      // Stiefel: Schaftkante
      P.line(cx - 16, 106, cx - 7, 106, 'k3', true);
      // Wasser tropft nach oben: Tropfen über Hutkrempe, Hand und Ring
      if (!p.tod) { const o = p.idle ? f : 0; for (const [x, y0, l] of [[cx - 12, 22, 9], [cx - 17, 70, 12], [cx - 4, 50, 8], [cx + 2, 104, 10]]) { const y = r(y0 + T - ((o * 3 + l) % l)); P.set(x, y, 'glas'); if ((o + x) % 2) P.set(x, y + 2, 'k3'); } }
      // Der Schnitt: rechts der Linie nichts; an der Kante ein Saum Licht, dahinter ein wenig Staub im Strahl
      if (S) {
        const geist = [];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const c = P.get(x, y); if (!c) continue;
          if (seite(x, y) < 0) {
            const nah = seite(x - 1, y) > 0 || seite(x - 2, y) > 0;
            const rand = !P.get(x + 1, y) || !P.get(x, y - 1) || !P.get(x - 1, y) || !P.get(x, y + 1);
            geist.push([x, y, rand && !nah]);
          }
        }
        // was fehlt, bleibt als Umriss aus Staub im Strahl stehen (jedes zweite Pixel)
        for (const [x, y] of geist) P.loesch(x, y);
        if (!p.tod || f < 2) for (const [x, y, rd] of geist) if (rd && (x + y) % 2 === 0) P.set(x, y, 'glutDim');
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
          const c = P.get(x, y); if (!c || c >= 7) continue;
          if (seite(x + 1, y) < 0 || seite(x + 1, y - 1) < 0) P.set(x, y, p.tod ? 'r1' : 'r2');
          else if (seite(x + 2, y) < 0) P.set(x, y, 'glutDim');
        }
      }
      if (p.tod) for (let y = 115; y < H; y++) for (let x = 0; x < W; x++) P.loesch(x, y);
    };
    return { gruppen, details, augen };
  },
};
