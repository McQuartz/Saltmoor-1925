// Der Expeditionsleiter (Funkstation am Pol, Elite). Kapitän Brede führte die Expedition von 1912
// und gab den Befehl, dem Signal nach unten zu folgen. Er steht noch im Pelzparka, steifgefroren,
// die Fahne der Expedition an der Stange, der Wimpel zerrissen. Die Kapuze ist leer bis auf das,
// was er mitgebracht hat: zwei Senderöhren, die darin glühen wie Augen. Von der Kapuze hängen
// Eiszapfen und ein Antennendraht. Angriff: er stößt die Fahnenstange wie eine Lanze.
'use strict';
module.exports = {
  id: 'expeditionsleiter', biom: 'funkstation', zone: 'funkstation', w: 128, h: 160, fuss: [66, 155], kopf: [58, 14], rimBis: 152, rang: 'elite',
  varianten: { expeditionsleiter: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, stoss = 0, glut = 1, fall = 0, hem = 0, wehen = f;
    if (p.idle) { glut = [1, 0.9, 1.1, 0.95][f]; }
    if (p.angriff) { lean = [3, 4, -6, -2][f]; stoss = [0.35, 0.5, -0.75, -0.3][f]; glut = [1, 1.2, 1.6, 1.1][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [4, 2][f]; glut = 0.75; }
    if (p.tod) { fall = r(p.q * 40); lean = r(p.q * 4); glut = f < 2 ? 0.6 : 0; }
    const cx = 68, ox = lean, sy = 62 + fall;
    // Parka: schwer, unten weit, Pelzsaum
    const parka = Pg([[cx - 18 + ox, sy], [cx + 18 + ox, sy - 2], [cx + 24 + r(ox / 2), sy + 40 - fall / 2], [cx + 26, 136], ...saum(cx + 26, cx - 26, 141, 9, 3, 13, hem), [cx - 26, 136], [cx - 23 + r(ox / 2), sy + 40 - fall / 2]], null, { rd: 2 });
    const stiefel = [C(cx - 9, 136, cx - 10, 150, 5, 4.4, 'dunkel'), C(cx + 9, 136, cx + 10, 150, 5, 4.4, 'dunkel'), E(cx - 13, 152, 7, 2.6, null), E(cx + 8, 152, 7, 2.6, null)];
    // Kapuze: tief, mit Pelzrand; vorne leer
    const kx = cx - 4 + ox, ky = sy - 16;
    const kapuze = E(kx + 2, ky, 16, 17, null, { pf: 'dome' });
    const pelz = E(kx - 2, ky + 2, 12, 13, null, { pf: 'bevel' });
    const loch = E(kx - 4, ky + 3, 8, 10, 'dunkel', { noRim: true, pf: 'flat' });
    // Arme: vorne an der Fahnenstange
    const hx = cx - 22 + ox, hy = sy + 26;
    const armV = glied([[cx - 14 + ox, sy + 4], [cx - 24 + ox, sy + 14], [hx, hy]], 5, 4, null);
    const armH = glied([[cx + 14 + ox, sy + 4], [cx + 20 + ox, sy + 20], [cx + 14 + ox, sy + 32]], 5, 4, null);
    const a = -Math.PI / 2 - 0.15 + stoss * 1.6;
    const top = [hx + Math.cos(a) * 70, hy + Math.sin(a) * 70], unten = [hx - Math.cos(a) * 34, hy - Math.sin(a) * 34];
    const stange = C(unten[0], unten[1], top[0], top[1], 1.1, 1, 'dunkel', { pf: 'flat' });
    // Wimpel: zerrissen, hängt schlaff (hier unten geht kein Wind)
    const w0 = [top[0] + Math.cos(a) * -2, top[1] + Math.sin(a) * -2];
    const wimpel = Pg([[w0[0], w0[1]], [w0[0] + 18, w0[1] + 3 + (wehen % 2)], [w0[0] + 14, w0[1] + 8], [w0[0] + 19, w0[1] + 13], [w0[0] + 2, w0[1] + 14]], 'haut', { rd: 0.5, pf: 'flat' });
    const tot = p.tod && f >= 4;
    const gruppen = [
      { p: armH, k: 1 },
      { p: stiefel, k: 1 },
      { p: [parka], k: 3 },
      { p: [kapuze, pelz], k: 2 },
      { p: [loch], k: 0, noRim: true, pf: 'flat' },
      { p: tot ? [] : [stange], k: 0, pf: 'flat' },
      { p: tot ? [] : [wimpel], k: 0, pf: 'flat' },
      { p: armV, k: 1.5 },
    ];
    const augen = [];
    const details = P => {
      // Pelz: helle Strähnen am Kapuzenrand (Reif)
      for (let i = 0; i < 18; i++) { const t = i / 18 * Math.PI * 2; const x = r(kx - 2 + Math.cos(t) * 11.5), y = r(ky + 2 + Math.sin(t) * 12.5); if (A.bay(x, y) < 0.55) P.auf(x, y, i % 3 ? 'k3' : 'papier'); }
      // Eiszapfen an der Kapuze (unten), kurz
      for (let i = 0; i < 4; i++) { const x = r(kx - 9 + i * 4), y = r(ky + 14); P.set(x, y, 'k3'); P.set(x, y + 1, 'k3'); if (i % 2) P.set(x, y + 2, 'r1'); }
      // Röhren im Loch: zwei Glaskolben, Glühfaden
      if (glut > 0) {
        [[kx - 7, ky + 2], [kx - 1, ky + 3]].forEach(([x, y], i) => {
          const X = r(x), Y = r(y);
          P.el(X + 0.5, Y + 0.5, 2, 3, 'k3', true);
          P.set(X, Y, glut > 0.7 ? 'kern' : 'glut'); P.set(X, Y + 1, 'glut'); P.set(X, Y - 1, 'glutDim');
          P.set(X, Y + 3, 'kupfer');
          augen.push([X, Y]);
        });
        P.glow(kx - 4, ky + 3, 9 * glut, 0.7 * glut, 'glutDim', 'k3');
      }
      // Antennendraht von der Kapuze nach hinten
      P.line(r(kx + 12), r(ky - 10), r(kx + 26), r(ky - 26), 'kupfer');
      // Fahne: Kreuzstreifen in Kupferrot
      if (!tot) { P.line(r(w0[0] + 2), r(w0[1] + 7), r(w0[0] + 16), r(w0[1] + 8), 'kupfer', true); P.line(r(w0[0] + 7), r(w0[1] + 1), r(w0[0] + 7), r(w0[1] + 13), 'kupfer', true); P.set(r(top[0]), r(top[1]), 'kupfer'); }
      // Gurt mit Messingschnalle quer
      P.line(r(cx - 16 + ox), r(sy + 6), r(cx + 18 + ox), r(sy + 30), 'k0', true);
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
