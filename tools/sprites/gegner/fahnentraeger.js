// Der Fahnenträger (Schwarzes Eis, Ergänzung). Er gehörte zur Expedition von 1903 und sollte die
// Fahne dort einschlagen, wo es nicht mehr weiter nach unten geht. Er steht noch im Parka, die
// Stange in beiden Fäusten, die Fahne steif gefroren. Falsch ist, wo sein Gesicht ist: Die Kapuze
// ist leer, nur Reif am Pelzrand. Das Gesicht ist in der Fahne, durch den Stoff gedrückt wie von
// hinten, und es ruft.
'use strict';
// Inneres Randlicht an Kapseln (Arme, Stange): die Kante, die zum Gegenlicht (oben rechts) zeigt, aufhellen
function kapselLicht(P, caps, c = 'r1', nurKoerper = true) {
  for (const k of caps) {
    if (k.t !== 'c') continue; const dx = k.x2 - k.x1, dy = k.y2 - k.y1, l = Math.hypot(dx, dy) || 1; let nx = -dy / l, ny = dx / l;
    if (nx * 0.9 - ny * 0.5 < 0) { nx = -nx; ny = -ny; } if (nx * 0.9 - ny * 0.5 < 0.15) continue;
    for (let i = 0; i <= Math.ceil(l); i++) { const q = i / Math.ceil(l), rr = k.r1 + (k.r2 - k.r1) * q - 0.6; const x = Math.round(k.x1 + dx * q + nx * rr - 0.5), y = Math.round(k.y1 + dy * q + ny * rr - 0.5); const cur = P.get(x, y); if (cur && (!nurKoerper || cur <= 4)) P.set(x, y, c); }
  }
}
module.exports = {
  id: 'fahnentraeger', biom: 'eis', zone: 'eis', w: 96, h: 120, fuss: [42, 115], kopf: [40, 12], rimBis: 113,
  varianten: {
    // a: Fahne breit, gerade Stange, tief vorgebeugt
    fahnentraeger_a: { ang: 0.42, fl: 26, fh: 18, beug: 1, wellen: 3 },
    // b: Stange steiler, Fahne schmaler und länger, Pelzrand höher
    fahnentraeger_b: { ang: 0.28, fl: 20, fh: 24, beug: 0.6, wellen: 4, ruff: 1 },
  },
  skizzen: {
    sil_schraeg: { ang: 0.42, fl: 26, fh: 18, beug: 1, wellen: 3 },
    sil_steil: { ang: 0.12, fl: 22, fh: 22, beug: 0.4, wellen: 4, ruff: 1 },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r, bay, saum } = A;
    const f = p.f;
    let lean = 0, atem = 0, fall = 0, ruf = 1, da = 0, stoss = 0, hem = 0;
    // da: zusätzlicher Winkel der Stange (+ nach hinten), stoss: Stange wird nach vorn gestoßen
    if (p.idle) { atem = [0, 0, 1, 1][f]; ruf = [1, 0.9, 1.1, 0.8][f]; hem = [0, 1, 1, 0][f]; da = [0, 0, 0.02, 0.02][f]; }
    if (p.angriff) { lean = [3, 4, -6, -3][f]; da = [0.2, 0.38, -0.98, -0.62][f]; stoss = [0, 0, 6, 3][f]; ruf = [1.1, 1.3, 1.7, 1.2][f]; hem = [0, 1, 2, 1][f]; }
    if (p.treffer) { lean = [3, 2][f]; ruf = 0.5; da = 0.1; }
    if (p.tod) { fall = r(p.q * 20); lean = r(p.q * 6); ruf = Math.max(0, 1 - p.q * 3); da = p.q * 0.8; }
    const T = atem + fall, bx = 40 + lean, by = 50 + T; // Schulter Mitte
    const bg = v.beug;
    // Beine und Stiefel (Mukluks)
    const beinV = glied([[bx - 4, 86 + fall * 0.4], [bx - 8, 100], [bx - 9, 110]], 4, 3.4, null);
    const beinH = glied([[bx + 6, 86 + fall * 0.4], [bx + 9, 100], [bx + 8, 110]], 4, 3.4, null);
    const stiefel = [E(bx - 11, 112, 5.5, 3, null), E(bx + 7, 112, 5, 3, 'dunkel')];
    // Parka: glockenförmig, vorgebeugt, Pelzsaum unten
    const ox = -4 * bg; // Vorbeugung oben
    const parka = Pg([[bx - 8 + ox, by - 2], [bx + 8 + ox, by - 4], [bx + 14, by + 10], [bx + 17, by + 34], [bx + 19, 90], ...saum(bx + 19, bx - 17, 93, 7, 3, 5, hem), [bx - 16, 88], [bx - 13, by + 24], [bx - 12 + ox, by + 6]], null, { rd: 1.5 });
    const pelzsaum = Pg([[bx - 17, 86], [bx + 19, 86], [bx + 20, 92], [bx - 18, 92]], 'haut', { rd: 1 });
    // Kapuze mit großem Pelzrand, das Innere leer
    const kx = bx - 6 + ox - (p.angriff ? [0, 1, -2, -1][f] : 0), ky = by - 12 + (p.idle && f === 2 ? 1 : 0);
    const kapuze = E(kx + 3, ky, 10, 11, null, { pf: 'bevel' });
    const ruff = E(kx - 1, ky + 1, 8.5 + (v.ruff || 0), 9.5 + (v.ruff || 0), 'haut', { pf: 'bevel' });
    // Stange: Griff zwischen den Fäusten, Winkel von der Senkrechten (positiv = Spitze nach rechts)
    const ang = v.ang + da, G = [bx - 6 - stoss * 0.6, by + 18 - (p.angriff && f < 2 ? 4 : 0)];
    const up = [Math.sin(ang), -Math.cos(ang)], rt = [Math.cos(ang), Math.sin(ang)];
    const spitze = [G[0] + up[0] * 56, G[1] + up[1] * 56], schuh = [G[0] - up[0] * 34, G[1] - up[1] * 34];
    const stange = [C(schuh[0], schuh[1], spitze[0], spitze[1], 1.3, 1.1, 'dunkel', { pf: 'flat' }), C(schuh[0], schuh[1], schuh[0] - up[0] * 4, schuh[1] - up[1] * 4, 1.2, 0.4, null)];
    const knauf = E(spitze[0] + up[0] * 2, spitze[1] + up[1] * 2, 2, 2, null);
    // Fahne: starr, an der Stange oben, zur rechten Seite der Stange; gefrorene Wellen am Rand
    const L = (u, w) => [spitze[0] - up[0] * u + rt[0] * w, spitze[1] - up[1] * u + rt[1] * w];
    const fl = v.fl, fh = v.fh, rand = [];
    for (let i = 0; i <= 8; i++) { const u = fh * i / 8; rand.push(L(u + 1, fl + Math.sin(i / 8 * Math.PI * v.wellen) * 2.5)); }
    const fahne = Pg([L(1, 0), ...rand, L(fh + 1 + Math.sin(Math.PI * v.wellen) * 1.5, 0)], null, { rd: 0.5 });
    // Arme in Fäustlingen: beide an der Stange
    const g1 = [G[0] + up[0] * 4, G[1] + up[1] * 4], g2 = [G[0] - up[0] * 6, G[1] - up[1] * 6];
    const armV = [...glied([[bx - 8 + ox, by + 4], [bx - 14 + ox * 0.5, by + 12], g2], 4, 3.2, null), E(g2[0], g2[1], 3.4, 3, null)];
    const armH = [...glied([[bx + 8 + ox, by + 2], [bx + 6, by + 14], g1], 3.8, 3, null), E(g1[0], g1[1], 3.3, 3, null)];
    const manschette = [E(g2[0] + 3, g2[1] - 2, 2.6, 2.4, 'haut'), E(g1[0] + 2, g1[1] - 2, 2.4, 2.2, 'haut')];
    const gruppen = [
      { p: [fahne], k: 0 },
      { p: beinH.concat(stiefel[1]), k: 1 },
      { p: armH, k: 1.5, anker: [lean, T] },
      { p: beinV.concat(stiefel[0]), k: 1 },
      { p: [parka], k: 2, anker: [lean, T] },
      { p: [pelzsaum], k: 0, anker: [lean, T] },
      { p: [kapuze], k: 0, anker: [lean, T] },
      { p: [ruff], k: 0, anker: [lean, T] },
      { p: [...stange, knauf], k: 0 },
      { p: [armH[armH.length - 1]], k: 0 },
      { p: [manschette[1]], k: 0 },
      { p: armV, k: 1.5, anker: [lean, T] },
      { p: [manschette[0]], k: 0 },
    ];
    const augen = [];
    const details = P => {
      const B = (x, y) => { const c = P.get(x, y); return c >= 1 && c <= 4; };
      // Kapuze leer: dunkles Oval, Reif am Rand
      const ix = r(kx - 2), iy = r(ky + 1);
      P.el(ix + 0.5, iy + 0.5, 5, 6.5, 'k0', true);
      for (let a = 0; a < 6.28; a += 0.45) { const x = r(ix + Math.cos(a) * 6.5), y = r(iy + Math.sin(a) * 8); if (B(x, y)) P.set(x, y, (a * 7 | 0) % 2 ? 'r1' : 'k3'); }
      // Pelz: Zotteln am Kapuzenrand und am Saum
      for (let a = -2.6; a < 0.6; a += 0.38) P.auf(r(kx - 1 + Math.cos(a) * 9.5), r(ky + 1 + Math.sin(a) * 10.5), 'r1');
      for (let x = r(bx - 16); x <= bx + 18; x += 2) { P.auf(x, 87 + ((x * 3) % 2) + T * 0, 'k3'); P.auf(x + 1, 90, 'k1'); }
      // Parka: Nähte, Brusttasche, Faltenwurf mit Lichtkante, Reif auf den Schultern
      P.line(bx - 6 + ox, by + 4, bx - 9, 84, 'k0', true); P.line(bx - 5 + ox, by + 4, bx - 8, 84, 'k3', true);
      P.line(bx + 6, by + 10, bx + 10, 84, 'k0', true); P.line(bx + 7, by + 10, bx + 11, 84, 'k3', true);
      P.line(bx + 1, by + 20, bx + 9, by + 20, 'k3', true); P.line(bx + 1, by + 21, bx + 9, by + 21, 'k0', true);
      for (let x = r(bx + ox); x < bx + 12; x += 3) P.auf(x, r(by - 2 + (x - bx) * 0.25), 'r1');
      // Arme und Stange: Lichtkante oben rechts, auch dort, wo sie vor dem Parka liegen
      kapselLicht(P, armV, 'r1'); kapselLicht(P, armH, 'k3'); kapselLicht(P, stange.slice(0, 1), 'r1');
      // Fäustlinge: Daumen, Reif
      P.auf(r(g2[0]) - 2, r(g2[1]) - 1, 'k3'); P.auf(r(g1[0]) + 1, r(g1[1]) - 2, 'r1');
      // Fahne: Stoff mit Verlauf (oben im Gegenlicht heller), gefrorene Falten, Reif an der Kante
      const fx = [], fy = []; fahne.v.forEach(q => { fx.push(q[0]); fy.push(q[1]); });
      for (let y = Math.floor(Math.min(...fy)); y <= Math.max(...fy); y++) for (let x = Math.floor(Math.min(...fx)); x <= Math.max(...fx); x++) {
        if (!B(x, y)) continue; const u = (x - spitze[0]) * -up[0] + (y - spitze[1]) * -up[1], w = (x - spitze[0]) * rt[0] + (y - spitze[1]) * rt[1];
        if (w < 0 || w > fl + 3 || u < 0 || u > fh + 3) continue;
        const falte = Math.sin(w / fl * Math.PI * v.wellen) * 0.22;
        const t = 0.6 - u / fh * 0.35 + falte; const q = Math.max(0, Math.min(0.999, t)) * 3, k = Math.floor(q);
        P.set(x, y, ['k0', 'k1', 'k2', 'k3'][Math.min(3, (q - k) > bay(x, y) ? k + 1 : k)]);
      }
      // Gesicht im Stoff: Stirn und Wangen als helle Wölbung, Augenhöhlen, offener Mund
      const gm = L(fh * 0.5, fl * 0.5);
      P.el(gm[0] + 0.5, gm[1] + 0.5, 5.5, 6.5, 'k3', true);
      const Lg = (du, dw) => L(fh * 0.5 + du, fl * 0.5 + dw);
      for (const [du, dw] of [[-4, -4], [-4, -3], [-3, 4], [-4, 3], [-5, 0], [-6, 0], [-5, -1], [-5, 1]]) { const q = Lg(du, dw); P.auf(r(q[0]), r(q[1]), 'r1'); }
      const m0 = Lg(4, 0); P.el(m0[0] + 0.5, m0[1] + 0.5, 1.6, 1.4 + (p.angriff ? 1 : 0), 'k0', true);
      const n0 = Lg(1, 0); P.auf(r(n0[0]), r(n0[1]), 'k1');
      if (ruf > 0) {
        const a1 = Lg(-1, -2.5), a2 = Lg(-1, 2.5);
        P.glow(gm[0] + 0.5, gm[1] - 1, 6 * ruf, 0.8);
        P.el(a1[0] + 0.5, a1[1] + 0.5, 1.3, 1.1, 'k0', true); P.el(a2[0] + 0.5, a2[1] + 0.5, 1.3, 1.1, 'k0', true);
        P.set(r(a1[0]), r(a1[1]), 'kern'); P.set(r(a2[0]), r(a2[1]), ruf > 1.2 ? 'kern' : 'glut');
        if (ruf > 1.3) { P.set(r(a1[0]) - 1, r(a1[1]), 'glut'); P.set(r(a2[0]) + 1, r(a2[1]), 'glut'); }
        augen.push([r(a1[0]), r(a1[1])], [r(a2[0]), r(a2[1])]);
      }
      // Eiszapfen an der Unterkante der Fahne
      for (let i = 1; i < 4; i++) { const q = L(fh + 1, fl * i / 4); for (let k = 0; k < 2 + (i % 2); k++) P.set(r(q[0]), r(q[1]) + k, k ? 'r1' : 'k3'); }
    };
    return { gruppen, details, augen };
  },
};
