// Die Waage am Grund: Die Warteschlange. Die Ertrunkenen stehen vor dem Schalter an, in Mänteln, mit Hut und
// Kopftuch, jeder die Hand auf der Schulter des Vorderen, und jeder hält seine Wartemarke. Sie stehen so lange
// an, dass sie an den Schultern zusammengewachsen sind: ein Leib aus Rücken, der nach vorn hin immer tiefer
// gebeugt ist. Falsch ist die Nummer: Der Vorderste hält die Eins, und er ist noch nicht dran.
'use strict';
const K = require('./hilfe/kanten');

module.exports = {
  id: 'schlange', biom: 'waage', zone: 'waage', w: 96, h: 120, fuss: [44, 115], kopf: [24, 30], rimBis: 113,
  varianten: {
    // a: vier Erwachsene: Hut, Kopftuch, Schirmmütze, Hut; der Hinterste steht aufrecht
    schlange_a: { leute: [{ kopf: 'hut', h: 0 }, { kopf: 'tuch', h: 1 }, { kopf: 'muetze', h: 2 }, { kopf: 'hut', h: 3 }] },
    // b: drei Erwachsene und ein Kind in der Mitte (die Reihe knickt dort ein), Regenschirm hinten
    schlange_b: { leute: [{ kopf: 'tuch', h: 0 }, { kopf: 'kind', h: 0.6 }, { kopf: 'hut', h: 2 }, { kopf: 'muetze', h: 3, schirm: true }] },
  },
  // Silhouetten-Proben (nicht gebaut): alle gleich hoch nebeneinander (las sich wie ein Zaun, eine Reihe Pfähle);
  // ein einzelner Wartender auf der Bank (wie der Liegende im Kurhaus). Genommen: schräge Reihe, nach vorn gebeugt.
  proben: { probe_gerade: { leute: [{ kopf: 'hut', h: 2 }, { kopf: 'tuch', h: 2 }, { kopf: 'muetze', h: 2 }, { kopf: 'hut', h: 2 }], gerade: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, saum, r } = A;
    const f = p.f;
    let lean = 0, atem = [0, 0, 0, 0], fall = 0, vor = 0;
    if (p.idle) atem = [[0, 0, 0, 0], [1, 0, 0, 0], [1, 1, 0, 0], [0, 1, 1, 0]][f].map((a, i) => (i === 3 ? [0, 0, 1, 1][f] : a));
    if (p.angriff) { lean = [3, 5, -5, -2][f]; vor = [0, 0, 1, 0.3][f]; }
    if (p.treffer) { lean = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 18); lean = r(p.q * 3); }
    const n = v.leute.length, gruppen = [], koepfe = [], marken = [], leiber = [];
    // von hinten (rechts) nach vorn (links) zeichnen
    for (let k = n - 1; k >= 0; k--) {
      const P0 = v.leute[k], hh = v.gerade ? 2 : P0.h, kind = P0.kopf === 'kind';
      const bx = 30 + k * 16 + lean * (1 - k / n) - (k === 0 ? vor * 2 : 0);  // Mitte des Leibs
      const neig = v.gerade ? 4 : 14 - hh * 3.5;          // wie weit nach vorn gebeugt
      const groesse = kind ? 0.72 : 1;
      const sy = 114 - (44 + hh * 8) * groesse + fall * (0.6 + k * 0.1);   // Schulterhöhe
      const kx = bx - neig - 4, ky = sy - 4 + neig * 0.5 + atem[k];
      // Mantel: von der Schulter bis zur Wade, hinten gerundet (Buckel)
      const hem = 104 + (kind ? 2 : 0);
      const leib = Pg([[bx - neig * 0.6 - 7, sy + 2], [bx - 1, sy - 4 - neig * 0.15], [bx + 7, sy + 2], [bx + 10, sy + 20], [bx + 11, hem], ...saum(bx + 11, bx - 10, hem, 4, 2, k * 3 + 1, 0).slice(1), [bx - 10, hem - 2], [bx - 9 - neig * 0.3, sy + 18]], null, { rd: 2.2 });
      const beine = [...glied([[bx - 4, hem - 4], [bx - 5, 109], [bx - 6, 113]], 2.4, 2, null), ...glied([[bx + 5, hem - 4], [bx + 5, 109], [bx + 6, 113]], 2.4, 2, null), E(bx - 8, 113.5, 3.4, 1.8, 'dunkel'), E(bx + 5, 113.5, 3.2, 1.8, 'dunkel')];
      const kopfF = [E(kx, ky, 4.6 * groesse + 0.6, 5.4 * groesse + 0.6, 'haut'), C(bx - neig * 0.5 - 2, sy + 1, kx + 1, ky + 2, 3, 2.4, 'haut')];
      let hut = [];
      if (P0.kopf === 'hut') hut = [Pg([[kx - 5, ky - 4], [kx + 4, ky - 6], [kx + 5, ky - 11], [kx - 4, ky - 10]], null, { rd: 1 }), Pg([[kx - 9, ky - 4], [kx + 8, ky - 6], [kx + 8, ky - 4], [kx - 8, ky - 2]], 'dunkel', { rd: 0.6 })];
      if (P0.kopf === 'muetze') hut = [Pg([[kx - 4, ky - 4], [kx + 5, ky - 7], [kx + 6, ky - 3], [kx - 3, ky - 1]], null, { rd: 1.2 }), Pg([[kx - 9, ky - 2], [kx - 2, ky - 3], [kx - 2, ky - 1], [kx - 8, ky]], 'dunkel', { rd: 0.4 })];
      if (P0.kopf === 'tuch') hut = [Pg([[kx - 5, ky - 3], [kx + 1, ky - 7], [kx + 6, ky - 4], [kx + 8, ky + 4], [kx + 4, ky + 8], [kx + 1, ky + 2]], null, { rd: 1.6 })];
      if (P0.kopf === 'kind') hut = [E(kx + 1, ky - 3, 4, 2.4, null)];
      // Arm: Hand auf der Schulter des Vorderen (der Vorderste hält die Marke vor sich)
      const vorne = k > 0 ? v.leute[k - 1] : null;
      let hand;
      if (vorne) { const vh = v.gerade ? 2 : vorne.h, vb = 30 + (k - 1) * 16 + lean * (1 - (k - 1) / n), vsy = 114 - (44 + vh * 8) * (vorne.kopf === 'kind' ? 0.72 : 1); hand = [vb + 4, vsy + 1]; }
      else hand = [bx - neig - 8 - vor * 8, sy + 14 - vor * 6];
      const arm = [...glied([[bx - 3, sy + 3], [bx - 8 + (vorne ? 0 : -2), sy + 14], hand], 2.4, 1.8, null), E(hand[0], hand[1], 2, 1.7, 'haut')];
      const schirm = P0.schirm ? [C(bx + 12, sy - 2, bx + 16, 112, 0.8, 0.8, null), Pg([[bx + 9, sy + 4], [bx + 15, sy - 4], [bx + 19, sy + 4], [bx + 16, sy + 26], [bx + 13, sy + 26]], null, { rd: 0.8 })] : [];
      const gi0 = gruppen.length;
      gruppen.push({ p: schirm, k: 0.4, kante: true });
      gruppen.push({ p: beine, k: 0.8, kante: true });
      gruppen.push({ p: [leib], k: 1.6, kante: true });
      gruppen.push({ p: kopfF, k: 1, kante: true });
      gruppen.push({ p: hut, k: 0.6, kante: true });
      gruppen.push({ p: arm, k: 0.8, kante: true });
      leiber.push({ leib, bx, sy, hem, gi: gi0 + 2 });
      koepfe.push({ kx, ky, k, kind, kopf: P0.kopf });
      marken.push({ x: hand[0], y: hand[1], k, vorne: !vorne });
    }
    // Verwachsen: zwischen den Schultern Nachbarn ein Steg aus Mantelstoff
    const stege = [];
    for (let i = 0; i + 1 < leiber.length; i++) { const a = leiber[i], b = leiber[i + 1]; stege.push(C(a.bx - 2, a.sy + 4, b.bx + 4, b.sy + 5, 4, 4, null)); }
    gruppen.splice(1, 0, { p: stege, k: 1.5, kante: true });
    const LIB = require('../lib');
    const { gid } = LIB.render(96, 120, gruppen, LIB.palette('waage'), { rimBis: 113 });
    const augen = [];
    const details = P => {
      const g = (x, y) => (x < 0 || y < 0 || x >= 96 || y >= 120 ? -1 : gid[y * 96 + x]);
      const ziel = [];
      for (let y = 1; y < 119; y++) for (let x = 0; x < 95; x++) { const gi = g(x, y); if (gi < 0 || !gruppen[gi].kante) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue; const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1); const h = q => q >= 0 && q < gi; if (h(a) || (h(b) && h(d))) ziel.push([x, y]); }
      ziel.forEach(([x, y]) => P.set(x, y, 'r1'));
      // Mäntel: Rückennaht, Falten, Gürtel; Buckel fängt Wasserlicht von oben
      for (const L0 of leiber) {
        const X = r(L0.bx), Y = r(L0.sy);
        P.line(X + 2, Y + 2, X + 6, L0.hem - 2, 'k0', true); P.line(X + 3, Y + 2, X + 7, L0.hem - 3, 'k3', true);
        P.line(X - 4, Y + 10, X - 6, L0.hem - 2, 'k0', true); P.line(X - 3, Y + 10, X - 5, L0.hem - 3, 'r1', true);
        P.line(X - 8, Y + 24, X + 9, Y + 24, 'k0', true); P.line(X - 7, Y + 23, X + 9, Y + 23, 'k3', true);
        P.auf(X - 7, Y + 6, 'k3'); P.auf(X - 7, Y + 12, 'messing');
      }
      // Augen: rot, je weiter vorn, desto heller; der Vorderste mit Kern
      if (!p.tod || f < 1) for (const k of koepfe) {
        const ex = r(k.kx - 3), ey = r(k.ky - (k.kopf === 'hut' ? 0 : 1));
        if (k.k === 0) { P.glow(ex + 0.5, ey + 0.5, 5, 0.8); P.set(ex, ey, 'kern'); P.set(ex + 2, ey, 'glut'); augen.push([ex, ey]); }
        else { P.set(ex, ey, 'glut'); P.set(ex + 2, ey, k.k > 2 ? 'glutDim' : 'glut'); }
      }
      // Wartemarken: kleine Kärtchen, Papier im Wasserlicht; die Eins des Vordersten mit rotem Rand
      for (const m of marken) {
        if (!m.vorne) continue;
        const X = r(m.x) - 1, Y = r(m.y) - 4;
        for (let y = Y; y < Y + 4; y++) for (let x = X; x < X + 3; x++) P.set(x, y, y === Y || x === X + 2 ? 'siegel' : 'papier');
        P.set(X + 1, Y + 1, 'k1'); P.set(X + 1, Y + 2, 'k1');
      }
      for (const m of marken) if (!m.vorne) P.auf(r(m.x) - 2, r(m.y) + 2, 'papier');
    };
    return { gruppen, details, augen };
  },
};
