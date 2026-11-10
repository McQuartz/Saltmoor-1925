// Der Zeitungsjunge (Station, die nie eröffnet wurde). Er sollte am Eröffnungstag die Extraausgabe
// verkaufen. Ein Junge mit Schiebermütze unter einem Packen Zeitungen, der höher ist als er; alle
// tragen dieselbe Schlagzeile, und keiner kann sie lesen. Er hält dir eine hin, und du musst sie
// nehmen, das kostet. Angriff: er schlägt mit der gerollten Zeitung.
'use strict';
module.exports = {
  id: 'zeitungsjunge', biom: 'station', zone: 'station', w: 96, h: 120, fuss: [48, 115], kopf: [42, 44], rimBis: 112,
  varianten: {
    zeitungsjunge_a: { packen: 1, tasche: 1 },
    zeitungsjunge_b: { packen: 1.3, tasche: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, schlag = 0, fall = 0, glanz = 1, wipp = 0;
    if (p.idle) { wipp = [0, 0, 1, 1][f]; glanz = [1, 1.05, 1, 0.95][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; schlag = [6, 12, -8, -2][f]; glanz = [1, 1.2, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [3, 1][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 26); lean = r(p.q * 3); glanz = f < 2 ? 0.6 : 0; }
    const cx = 50, ox = lean, sy = 62 + fall;
    const jacke = Pg([[cx - 9 + ox, sy], [cx + 9 + ox, sy - 1], [cx + 11, sy + 26], [cx - 11, sy + 26]], null, { rd: 1.4 });
    const hose = [C(cx - 5, sy + 24, cx - 6, 112, 3, 2.4, 'dunkel'), C(cx + 5, sy + 24, cx + 6, 112, 3, 2.4, 'dunkel')];
    const schuhe = [E(cx - 9, 113, 4, 2, 'dunkel'), E(cx + 7, 113, 4, 2, 'dunkel')];
    const kx = cx - 3 + ox, ky = sy - 8 + wipp;
    const kopf = E(kx, ky, 6, 6.5, null);
    const muetze = Pg([[kx - 12, ky - 2], [kx - 6, ky - 9], [kx + 6, ky - 9], [kx + 8, ky - 3], [kx - 2, ky - 2]], null, { rd: 1.4, pf: 'bevel' });
    // Packen auf dem Rücken: gestapelte Zeitungen, verschnürt
    const pz = v.packen, px = cx + 16 + ox, py0 = sy + 20;
    const lagen = [];
    for (let i = 0; i < 8 * pz; i++) { const y = py0 - i * 6, x = px + ((i * 7) % 5) - 2; lagen.push(Pg([[x - 10, y - 6], [x + 10, y - 6.5], [x + 10, y], [x - 10, y + 0.5]], null, { rd: 0.4, pf: 'flat', tone: i % 2 ? 0.18 : 0.1 })); }
    const schnur = C(px, py0, px - 1, py0 - 6 * 8 * pz + 4, 0.6, 0.6, 'dunkel', { noRim: true });
    const armH = glied([[cx + 7 + ox, sy + 3], [cx + 12 + ox, sy + 12], [px - 8, py0 - 6]], 2.2, 1.8, null);
    const hx = cx - 16 + ox + r(schlag / 3), hy = sy + 14 - schlag;
    const armV = glied([[cx - 7 + ox, sy + 3], [cx - 12 + ox, sy + 10], [hx, hy]], 2.2, 1.8, null);
    const rolle = C(hx, hy, hx - 6, hy - 14 + r(schlag / 2), 2, 2, null, { pf: 'bevel', tone: 0.15 });
    const tasche = v.tasche ? [Pg([[cx - 12 + ox, sy + 14], [cx - 2 + ox, sy + 14], [cx - 2 + ox, sy + 24], [cx - 12 + ox, sy + 24]], 'dunkel', { rd: 0.6, pf: 'bevel' })] : [];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: tot ? [] : lagen, k: 0, pf: 'flat' },
      { p: [schnur], k: 0, noRim: true },
      { p: armH, k: 1 },
      { p: [...hose], k: 1 },
      { p: schuhe, k: 0 },
      { p: [jacke], k: 2 },
      { p: tasche, k: 0, pf: 'bevel' },
      { p: [kopf, muetze], k: 1 },
      { p: armV, k: 1 },
      { p: tot ? [] : [rolle], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // dieselbe Schlagzeile auf jeder Lage: ein dunkler Balken, darunter Spalten
      if (!tot) lagen.forEach(l => { const [x0, y0] = l.v[0]; P.line(r(x0 + 3), r(y0 + 2), r(x0 + 15), r(y0 + 2), 'k0', true); });
      if (!tot) { P.auf(r(hx - 3), r(hy - 7), 'k0'); P.auf(r(hx - 4), r(hy - 9), 'k0'); }
      P.auf(r(cx + ox), sy + 6, 'messing');
      if (glanz > 0) {
        const ex = r(kx - 4), ey = r(ky);
        P.set(ex, ey, 'kern'); P.set(ex + 1, ey, 'glut'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey + 0.5, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
