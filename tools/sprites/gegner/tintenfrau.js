// Die Tintenfrau (Kloster der Abschrift). Trägt die Tinte in zwei Eimern am Joch über den Watt-Weg.
// Unter der Haube ist kein Gesicht, nur die stille Oberfläche von Tinte; darin spiegeln sich zwei Kerzen,
// die nicht im Raum stehen. Die Tinte in den Eimern bleibt waagerecht, wie schief die Eimer auch hängen.
'use strict';
const rotP = (cx, cy, a) => ([x, y]) => [cx + (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a), cy + (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a)];
module.exports = {
  id: 'tintenfrau', biom: 'kloster', zone: 'kloster', w: 96, h: 120, fuss: [48, 115], kopf: [48, 18], rimBis: 113,
  varianten: {
    // seil: Länge der Eimerseile, joch: halbe Jochbreite, buck: Beuge des Rückens, eimer: [Breite oben, Höhe]
    tintenfrau_a: { seil: 18, joch: 33, buck: 2, eimer: [13, 14], haube: 1 },
    tintenfrau_b: { seil: 30, joch: 30, buck: 5, eimer: [15, 12], haube: 0 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let phi = 0, psiL = 0, psiR = 0, lean = 0, atem = 0, fall = 0, augenAn = true, spritz = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; psiL = [0, 0.04, 0.06, 0.03][f]; psiR = [0, -0.03, -0.05, -0.02][f]; }
    if (p.angriff) { phi = [0.1, 0.22, -0.3, -0.08][f]; psiL = [0.3, 0.75, -0.55, -0.2][f]; psiR = [0.1, 0.25, -0.2, -0.1][f]; lean = [1, 2, -5, -2][f]; spritz = f === 2 ? 1 : f === 3 ? 0.5 : 0; }
    if (p.treffer) { phi = [-0.08, -0.04][f]; psiL = [-0.3, -0.15][f]; psiR = [-0.25, -0.1][f]; lean = [2, 1][f]; }
    if (p.tod) { fall = r(p.q * 22); phi = p.q * 0.5; psiL = p.q * 0.4; psiR = -p.q * 0.2; augenAn = f < 1; lean = r(p.q * 2); }
    if (p.angriff) psiL *= Math.pow(18 / v.seil, 0.9);
    const T = atem + fall, bk = v.buck;
    const cx = 48;
    // Körper: schmaler Rock, Mieder, Schultern unter dem Joch
    const sy = 50 + T + bk; // Schulterhöhe
    const rock = Pg([[cx - 7 + lean, sy + 4], [cx + 7 + lean, sy + 3], [cx + 9 + r(lean / 2), sy + 26], [cx + 13, 104], ...saum(cx + 13, cx - 12, 113, 6, 2, 17, p.idle ? [0, 1, 1, 0][f] : 0), [cx - 12, 104], [cx - 9 + r(lean / 2), sy + 26]], null, { rd: 1.2 });
    const schurz = Pg([[cx - 6 + lean, sy + 14], [cx + 4 + lean, sy + 14], [cx + 6, 106], [cx - 9, 106]], 'dunkel', { rd: 0.8 });
    const schultern = E(cx + lean, sy + 3, 9, 4, null);
    // Kopf mit Haube: runde Haube, Schleier fällt nach hinten auf den Rücken; Gesicht flach (Tinte)
    const hx = cx - 3 + lean + Math.min(0, lean), hy = sy - 13 - bk;
    const haube = Pg([[hx - 7, hy - 2], [hx - 4, hy - 8], [hx + 4, hy - 9], [hx + 8, hy - 3], [hx + 10 + v.haube * 2, hy + 8], [hx + 11, sy + 8], [hx + 3, sy + 2], [hx - 6, hy + 7]], null, { rd: 1.5 });
    const gesicht = E(hx - 2, hy + 1, 4.5, 5.5, 'dunkel', { pf: 'flat', noRim: true });
    // Joch: gebogener Balken über den Schultern, dreht sich um den Nacken
    const jx = cx + lean, jy = sy - 1, J = v.joch, R = rotP(jx, jy, phi);
    const jl = R([jx - J, jy + 3]), jr = R([jx + J, jy + 3]), jm1 = R([jx - J / 2, jy - 1]), jm2 = R([jx + J / 2, jy - 1]);
    const joch = glied([jl, jm1, R([jx, jy - 2]), jm2, jr], 2.2, 2.2, null);
    const jochEnden = [E(jl[0], jl[1], 2.4, 2.4, null), E(jr[0], jr[1], 2.4, 2.4, null)];
    // Arme (schwarz bis zur Schulter): halten das Joch nahe den Schultern
    const armL = glied([[cx - 6 + lean, sy + 3], [cx - 13 + lean, sy + 12], R([jx - 13, jy + 1])], 2.0, 1.4, 'dunkel');
    const armR = glied([[cx + 6 + lean, sy + 3], [cx + 13 + lean, sy + 13], R([jx + 13, jy + 1])], 2.0, 1.4, 'dunkel');
    // Eimer hängen an Seilen, pendeln (psi), Inhalt bleibt waagerecht
    const [ew, eh] = v.eimer, L = v.seil;
    const eimer = (top, psi) => {
      const ex = top[0] + Math.sin(psi) * L, ey = top[1] + Math.cos(psi) * L; // Henkelpunkt
      const Q = rotP(ex, ey, -psi);
      const ecken = [[ex - ew / 2, ey + 2], [ex + ew / 2, ey + 2], [ex + ew / 2 - 2, ey + 2 + eh], [ex - ew / 2 + 2, ey + 2 + eh]].map(Q);
      return { ex, ey, ecken, Q, psi, top };
    };
    const eL = eimer(jl, psiL), eR = eimer(jr, psiR);
    const eimerFormen = e => [Pg(e.ecken, null, { rd: 0.8 })];
    const gruppen = [
      { p: eimerFormen(eR), k: 0, anker: [r(eR.ex), r(eR.ey)] },
      { p: [armR].flat(), k: 1 },
      { p: [rock, schultern], k: 3, anker: [lean, T] },
      { p: [schurz], k: 0, noRim: true, anker: [lean, T] },
      { p: [haube], k: 1, anker: [lean, T] },
      { p: [gesicht], k: 0 },
      { p: [...joch, ...jochEnden], k: 1 },
      { p: [armL].flat(), k: 1 },
      { p: eimerFormen(eL), k: 0, anker: [r(eL.ex), r(eL.ey)] },
    ];
    const augen = [];
    const details = P => {
      // Seile: vom Jochende zum Henkel, Henkelbogen
      for (const e of [eR, eL]) {
        P.line(r(e.top[0]), r(e.top[1]) + 2, r(e.ex), r(e.ey), 'r1');
        const [a1, b1] = e.Q([e.ex - ew / 2 + 1, e.ey + 2]), [a2, b2] = e.Q([e.ex + ew / 2 - 1, e.ey + 2]);
        P.line(r(a1), r(b1), r(e.ex), r(e.ey) - 1, 'k3'); P.line(r(e.ex), r(e.ey) - 1, r(a2), r(b2), 'k3');
        // Reifen um den Eimer
        for (const q of [0.35, 0.75]) { const [u1, w1] = e.Q([e.ex - ew / 2 + q * 2, e.ey + 2 + eh * q]), [u2, w2] = e.Q([e.ex + ew / 2 - q * 2, e.ey + 2 + eh * q]); P.line(r(u1), r(w1), r(u2), r(w2), 'k0', true); }
        // Tinte: waagerechter Spiegel im Eimer, auch wenn er schief hängt (falsches Detail)
        const [o1, p1] = e.Q([e.ex - ew / 2 + 1, e.ey + 2]), [o2, p2] = e.Q([e.ex + ew / 2 - 1, e.ey + 2]);
        const yl = r(Math.max(p1, p2)) + 1;
        for (let x = r(Math.min(o1, o2)) + 1; x <= r(Math.max(o1, o2)) - 1; x++) { P.auf(x, yl, 'tinte'); P.auf(x, yl + 1, 'k0'); }
        P.auf(r(Math.max(o1, o2)) - 2, yl, 'r1');
      }
      // Spritzer beim Ausgießen: Tropfen in einem Bogen nach links
      if (spritz) {
        const [sx0, sy0] = eL.Q([eL.ex - ew / 2, eL.ey + 2]);
        for (let k = 0; k < 9; k++) { const x = sx0 - 3 - k * 2.4 * spritz, y = sy0 - 4 + k * k * 0.32 - 3; if (x < 1) break; P.set(r(x), r(y), k % 3 ? 'k0' : 'tinte'); if (k % 2) P.set(r(x), r(y) - 1, 'r1'); }
      }
      // Gesicht aus Tinte: dunkle Fläche, eine Glanzlinie, darin zwei gespiegelte Kerzenflammen als Augen
      const gx = r(hx - 2), gy = r(hy + 1);
      for (let y = gy - 4; y <= gy + 4; y++) for (let x = gx - 3; x <= gx + 3; x++) if (((x - gx) / 3.6) ** 2 + ((y - gy) / 4.6) ** 2 <= 1) P.auf(x, y, 'k0');
      P.auf(gx - 2, gy - 3, 'tinte'); P.auf(gx - 1, gy - 4, 'tinte'); P.auf(gx + 2, gy + 3, 'tinte');
      if (augenAn) {
        for (const ax of [gx - 2, gx + 1]) { P.glow(ax + 0.5, gy, 4, 0.8, 'glutDim', 'k1'); P.set(ax, gy - 1, 'glut'); P.set(ax, gy, 'kern'); P.set(ax, gy + 1, 'flamme'); }
        augen.push([gx - 2, gy], [gx + 1, gy]);
      }
      // Tinte läuft die Arme hinauf: einzelne glänzende Tropfen auf dem Arm
      if (!p.tod) for (const [ax, ay] of [[cx - 12 + lean, sy + 10], [cx - 10 + lean, sy + 6], [cx + 12 + lean, sy + 11]]) P.auf(r(ax), r(ay) - (p.idle ? [0, 1, 1, 0][f] : 0), 'tinte');
    };
    return { gruppen, details, augen };
  },
};
