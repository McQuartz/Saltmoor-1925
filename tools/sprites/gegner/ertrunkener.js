// Ertrunkener (Kapelle). Schwere, nasse Kutte, gesenkter Kopf, Kiemenschlitze.
// Still, nicht eklig: aus dem Mund läuft Wasser ohne Ende.
'use strict';
module.exports = {
  id: 'ertrunkener', biom: 'kapelle', zone: 'kapelle', w: 96, h: 120, fuss: [48, 115], kopf: [46, 26],
  varianten: {
    ertrunkener_a: { breit: 17, kopfY: 44, haende: true },
    ertrunkener_b: { breit: 15, kopfY: 40, haende: false, schief: 3 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 4, fall: 30 }), f = p.f, S = v.schief || 0;
    const lean = P0.lean, T = P0.atem + P0.fall, B = v.breit;
    const kx = 44 + lean - S, ky = v.kopfY + T + 3;
    const kutte = Pg([[38 + lean, 46 + T], [56 + lean, 44 + T], [48 + B + lean / 2, 70 + T / 2], [48 + B + 2, 106], ...saum(48 + B + 2, 48 - B - 2, 111, 6, 2, 13, p.idle ? [0, 1, 1, 0][f] : 0), [48 - B - 2, 106], [48 - B + 1 + lean / 2, 70 + T / 2]], null, { rd: 2 });
    const kapuze = Pg([[kx - 9, ky + 2], [kx - 7, ky - 9], [kx + 4, ky - 12], [kx + 11, ky - 4], [kx + 10, ky + 8]], null, { rd: 2 });
    const gesicht = E(kx - 2, ky + 1, 5, 6, 'haut', { pf: 'bevel' });
    const greif = p.angriff ? [0, -6, -14, -6][f] : 0;
    const haende = v.haende || p.angriff ? [...glied([[40 + lean, 60 + T], [36 + lean + greif / 2, 74 + T], [44 + greif, 78 + T]], 2.6, 1.8, null), ...glied([[56 + lean, 58 + T], [60 + lean, 72 + T], [48 + greif * 0.7, 80 + T]], 2.6, 1.8, null)] : [];
    const falten = [C(42 + lean, 56 + T, 38, 106, 0.8, 1.6, 'dunkel'), C(54 + lean, 56 + T, 58, 104, 0.8, 1.6, 'dunkel')];
    const gruppen = [
      { p: [kutte], k: 2 },
      { p: falten, k: 0, noRim: true },
      { p: [kapuze], k: 2 },
      { p: [gesicht], k: 0 },
      { p: haende, k: 1 },
    ];
    const augen = [];
    const details = P => {
      // Kiemenschlitze an der Wange
      for (let i = 0; i < 3; i++) P.auf(r(kx + 1), r(ky + 1 + i * 2), 'k0'), P.auf(r(kx + 2), r(ky + 1 + i * 2), 'r1');
      // halb geschlossene Augen
      if (!P0.aus) { P.set(r(kx - 5), r(ky - 1), 'glut'); P.set(r(kx - 1), r(ky - 1), 'glut'); P.glow(kx - 3, ky - 1, 5, 0.6); augen.push([r(kx - 5), r(ky - 1)], [r(kx - 1), r(ky - 1)]); }
      // Wasser aus dem Mund: ein dünner Strahl, Tropfen wandern nach unten
      const mx = r(kx - 3), my = r(ky + 5);
      P.set(mx, my, 'k0'); P.set(mx + 1, my, 'k0');
      if (!p.tod || f < 3) {
        const dick = p.angriff ? 2 : 1;
        for (let y = my + 1; y < 112; y++) { const x = mx + (y > my + 10 ? -1 : 0); const ph = (y + f * 3) % 6; P.set(x, y, ph === 0 ? 'r2' : ph < 3 ? 'r1' : 'k3'); if (dick > 1) P.set(x + 1, y, 'r1'); }
        for (let x = mx - 4; x <= mx + 3; x++) if ((x + f) % 2) P.set(x, 113, 'r1'); // Lache am Boden
      }
    };
    return { gruppen, details, augen };
  },
};
