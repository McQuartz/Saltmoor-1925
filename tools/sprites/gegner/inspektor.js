// Der Feuerinspektor (Leuchtturmhof, Elite). Der Inspektor vom Wasserbauamt kam im März 1918, um
// nachzusehen, warum das Feuer nach innen leuchtet. Er hat den Turm abgenommen. Hoher Dienstmantel
// mit zwei Knopfreihen, steifer Kragen, darauf statt des Kopfes ein Lampenzylinder aus Glas, in dem
// die Flamme steht; zwei helle Punkte darin sehen dich an. Links das offene Prüfbuch, rechts ein
// Peilstab mit Messingspitze. Angriff: der Stab fährt herunter wie ein Schlagbaum.
'use strict';
module.exports = {
  id: 'inspektor', biom: 'leuchtturm', zone: 'leuchtturm', w: 128, h: 160, fuss: [64, 155], kopf: [62, 8], rimBis: 152, rang: 'elite',
  varianten: { inspektor: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stab = 0, flamme = 1, atem = 0, fall = 0, hem = 0, buch = 0;
    if (p.idle) { flamme = [1, 1.15, 0.95, 1.1][f]; atem = [0, 0, 1, 1][f]; buch = [0, 0, 0, 1][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; stab = [0.4, 0.7, -1.5, -0.8][f]; flamme = [1, 1.3, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; stab = -0.2; flamme = 0.55; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 5); flamme = f < 2 ? 0.6 : 0; stab = p.q * 0.6; }
    const cx = 64, ox = lean;
    const sy = 56 + atem + fall; // Schulterhöhe
    // Mantel: lang, steif, unten weit, gerader Saum mit wenigen Zacken
    const mantel = Pg([[cx - 17 + ox, sy], [cx + 17 + ox, sy], [cx + 21 + ox, sy + 10], [cx + 22 + r(ox / 2), sy + 52 - fall / 2], [cx + 26, 146], ...saum(cx + 26, cx - 26, 152, 6, 3, 4, hem), [cx - 26, 146], [cx - 21 + r(ox / 2), sy + 48 - fall / 2], [cx - 21 + ox, sy + 10]], null, { rd: 1.2 });
    const schultern = E(cx + ox, sy + 4, 21, 7, null, { pf: 'bevel' });
    const schlitz = C(cx + 2, sy + 60, cx + 3, 150, 0.8, 1.2, 'dunkel', { noRim: true });
    const guertel = C(cx - 20 + ox, sy + 34, cx + 21 + ox, sy + 34, 1.3, 1.3, 'dunkel', { noRim: true });
    // Kragen und Zylinder (Glas: hell gefasst, innen dunkel), Messingbrenner unten
    const kx = cx - 2 + ox, ky = sy - 4;
    const kragen = Pg([[kx - 9, ky + 6], [kx + 9, ky + 6], [kx + 7, ky - 2], [kx - 7, ky - 2]], null, { rd: 1 });
    const brenner = E(kx, ky - 4, 8, 3, null, { pf: 'bevel' });
    const glas = Pg([[kx - 6, ky - 6], [kx + 6, ky - 6], [kx + 8, ky - 16], [kx + 4, ky - 24], [kx + 3, ky - 40], [kx - 3, ky - 40], [kx - 4, ky - 24], [kx - 8, ky - 16]], 'haut', { rd: 0.8, pf: 'flat' });
    // Linker Arm (vorne, im Bild links): hält das Prüfbuch offen
    const bx = cx - 30 + ox, byy = sy + 30 + buch;
    const armL = glied([[cx - 15 + ox, sy + 4], [cx - 24 + ox, sy + 18], [bx + 4, byy]], 3.4, 2.6, null);
    const buchF = [Pg([[bx - 10, byy - 4], [bx, byy - 1], [bx + 10, byy - 4], [bx + 10, byy + 4], [bx, byy + 7], [bx - 10, byy + 4]], 'haut', { rd: 0.6, pf: 'flat' })];
    // Rechter Arm mit Peilstab: Drehpunkt in der Hand
    const hx = cx + 26 + ox, hy = sy + 24;
    const armR = glied([[cx + 16 + ox, sy + 4], [cx + 24 + ox, sy + 14], [hx, hy]], 3.4, 2.6, null);
    const a = -Math.PI / 2 + stab, sl = 62;
    const sx1 = hx + Math.cos(a) * sl * 0.75, sy1 = hy + Math.sin(a) * sl * 0.75, sx2 = hx - Math.cos(a) * sl * 0.35, sy2 = hy - Math.sin(a) * sl * 0.35;
    const stabF = [C(sx2, sy2, sx1, sy1, 1.3, 1.1, 'dunkel', { pf: 'flat' })];
    const tot = p.tod && f >= 3, vorne = p.angriff && f >= 2;
    const gruppen = [
      { p: tot || vorne ? [] : stabF, k: 0 },
      { p: vorne ? [] : armR, k: 1 },
      { p: [mantel, schultern], k: 3 },
      { p: [schlitz, guertel], k: 0, noRim: true },
      { p: [kragen, brenner], k: 1 },
      { p: tot ? [] : [glas], k: 0, pf: 'flat' },
      { p: armL, k: 1 },
      { p: tot ? [] : buchF, k: 0, pf: 'flat' },
      { p: vorne ? armR : [], k: 1 },
      { p: vorne ? stabF : [], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Knöpfe: zwei Reihen Messing
      for (let i = 0; i < 5; i++) { P.auf(cx - 6 + ox, sy + 10 + i * 6, 'messing'); P.auf(cx + 6 + ox, sy + 10 + i * 6, 'messing'); }
      P.auf(cx + ox - 6, sy + 34, 'messing'); P.auf(cx + ox - 5, sy + 34, 'messing');
      // Brenner: Messingring
      P.line(kx - 7, ky - 4, kx + 7, ky - 4, 'messing', true);
      // Glas: innen leer und dunkel, Flamme steht darin
      if (!tot) {
        for (let y = r(ky - 38); y <= r(ky - 8); y++) for (let x = r(kx - 3); x <= r(kx + 3); x++) { const w = y > ky - 22 ? 5 : 2; if (Math.abs(x - kx) <= w - 1) P.auf(x, y, 'k0'); }
        if (flamme > 0) {
          const fh = 14 * flamme, fy0 = ky - 9;
          for (let k = 0; k < fh; k++) { const w = Math.max(0, 3.2 * Math.sin((k / fh) * Math.PI) * (1 - k / fh * 0.4)); for (let x = -w; x <= w; x++) { const X = r(kx + x + Math.sin(k * 0.6 + f) * 0.6), Y = r(fy0 - k); P.auf(X, Y, Math.abs(x) < w * 0.45 && k > 2 ? 'glut' : 'glutDim'); } }
          // die Augen in der Flamme
          const ey = r(fy0 - fh * 0.55);
          P.set(r(kx - 1), ey, 'kern'); P.set(r(kx + 2), ey, 'kern');
          augen.push([r(kx - 1), ey], [r(kx + 2), ey]);
          P.glow(kx, fy0 + 6, 14 * flamme, 0.5 * flamme, 'glutDim', 'k3');
        }
        // Glaskanten: das Licht der Flamme fängt sich im Zylinder
        for (let y = r(ky - 38); y <= r(ky - 8); y += 1) { const w = y > ky - 22 ? 5 : 2; if (A.bay(0, y) < 0.6) P.auf(r(kx - w), y, 'glutDim'); }
        P.line(r(kx + 4), r(ky - 22), r(kx + 3), r(ky - 36), 'r1', true);
      }
      // Prüfbuch: Linien, eine Spalte mit roter Tinte
      if (!tot) { for (let i = 0; i < 3; i++) { P.line(bx - 8, byy - 2 + i * 2, bx - 2, byy - 1 + i * 2, 'k2', true); P.line(bx + 2, byy - 1 + i * 2, bx + 8, byy - 2 + i * 2, i === 1 ? 'rot' : 'k2', true); } }
      // Messingspitze am Stab
      if (!tot) { P.set(r(sx1), r(sy1), 'messing'); P.set(r(sx1 + Math.cos(a)), r(sy1 + Math.sin(a)), 'messing'); }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
