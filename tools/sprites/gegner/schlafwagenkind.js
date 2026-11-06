// Nachtzug: Das Schlafwagenkind. Ein Kind im Nachthemd, das im Schlaf durch den Gang geht,
// die Arme vorgestreckt, das Hemd schleift lang hinter ihm her.
// Falsch: Sein Haar fällt nach oben, als hinge es kopfüber. Die Augen sind zu, und durch die Lider scheint Licht.
'use strict';
module.exports = {
  id: 'schlafwagenkind', biom: 'nachtzug', zone: 'nachtzug', w: 96, h: 120, fuss: [44, 116], kopf: [40, 30], rimBis: 113,
  varianten: {
    schlafwagenkind_a: { haar: 5, haarLen: 26, schleppe: 34, puppe: false, kopf: 9 },
    schlafwagenkind_b: { haar: 6, haarLen: 30, schleppe: 26, puppe: true, kopf: 8.5 },
  },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let atem = 0, lean = 0, armA = 0, wehen = 0, schrei = 0, fall = 0, licht = 1, schritt = 0;
    if (p.idle) { atem = [0, 0, 1, 1][f]; wehen = [0, 1, 1, 0][f]; schritt = 0; licht = [1, 0.9, 1, 0.85][f]; }
    if (p.angriff) { lean = [2, 3, -7, -2][f]; armA = [0.5, 0.9, -0.2, 0.2][f]; wehen = [2, 4, 6, 3][f]; schrei = [0, 1, 2, 1][f]; licht = [1, 1.3, 1.6, 1.1][f]; }
    if (p.treffer) { lean = [2, 1][f]; wehen = [3, 2][f]; licht = 0.6; }
    if (p.tod) { fall = r(p.q * 18); wehen = r(p.q * 8); licht = f < 1 ? 0.5 : 0; }
    const cx = 42, T = atem + fall;
    const sh = [cx + lean, 74 + T];
    // Nachthemd: schmal an den Schultern, weit unten, schleift nach rechts hinten lang aus
    const hemd = Pg([[sh[0] - 6, sh[1]], [sh[0] + 6, sh[1]], [cx + 9, 96], [cx + 14 + schritt, 108], [cx + v.schleppe, 112], [cx + v.schleppe + 4, 114], ...saum(cx + v.schleppe + 2, cx - 12, 115, 7, 1.5, 31, schritt), [cx - 12, 110], [cx - 8, 96]], null, { rd: 1.2, tone: 0.15 });
    const fussL = E(cx - 9 - schritt, 114, 3, 1.4, 'haut');
    // Kopf groß, leicht zur Seite geneigt
    const kx = sh[0] - 1, ky = sh[1] - 12 + (p.angriff ? -schrei : 0);
    const hals = C(sh[0], sh[1] + 1, kx, ky + 6, 2.2, 2, 'haut');
    const kopf = E(kx, ky, v.kopf, v.kopf + 1, 'haut', { pf: 'bevel', tone: 0.1 });
    // Haar: Strähnen, die nach oben fallen (Kopf steht richtig, das Haar hängt wie bei einem Kopfüber-Kind)
    const haar = [];
    for (let i = 0; i < v.haar; i++) {
      const q = i / (v.haar - 1), bx = kx - v.kopf + 2 + q * (v.kopf * 2 - 4), by = ky - v.kopf * 0.6 - Math.sin(q * Math.PI) * v.kopf * 0.4;
      const L = v.haarLen * (0.65 + 0.35 * Math.sin(q * Math.PI)) + (i % 3) * 2 + (p.idle ? 0 : wehen);
      const ws = p.idle ? 0 : wehen; const swing = Math.sin(i * 1.7 + ws * 0.6) * 3 + (q - 0.5) * 16;
      const wel = Math.sin(i * 2.3 + ws * 0.8) * 3 + (p.idle && i % 2 ? wehen : 0);
      haar.push(...glied([[bx, by], [bx + swing * 0.25 + wel, by - L * 0.35], [bx + swing * 0.6 - wel, by - L * 0.7], [bx + swing, by - L]], 3.2, 0.6, 'dunkel'));
    }
    // Arme vorgestreckt (Schlafwandeln); im Angriff erst hoch, dann greifen
    const a0 = Math.PI + 0.15 - armA;
    const ellb = (dy) => [sh[0] - 3 + Math.cos(a0) * 10, sh[1] + 3 + dy + Math.sin(a0) * 10];
    const hand = (dy) => { const e = ellb(dy); return [e[0] + Math.cos(a0 - 0.1) * 11, e[1] + Math.sin(a0 - 0.1) * 11]; };
    const armFern = glied([[sh[0] + 1, sh[1] + 2], ellb(-2), hand(-2)], 1.8, 1.2, 'haut');
    const armNah = glied([[sh[0] - 2, sh[1] + 3], ellb(2), hand(2)], 1.9, 1.2, 'haut');
    const finger = (h) => [-1, 0, 1].map(k => C(h[0], h[1], h[0] - 4, h[1] + k * 1.4 + (p.angriff && f === 2 ? k : 0), 0.6, 0.5, 'haut'));
    // Puppe (Variante b): hängt an einer Hand an einem Arm herab
    const ph = hand(2);
    const puppe = v.puppe ? [C(ph[0], ph[1], ph[0] + 1, ph[1] + 8, 0.7, 0.7, null), E(ph[0] + 1, ph[1] + 13, 3.2, 4.5, null), E(ph[0] + 1, ph[1] + 20 + (p.idle ? f % 2 : 0), 2.6, 2.6, 'haut')] : [];
    const gruppen = [
      { p: haar, k: 2.5, anker: [0, atem] },
      { p: armFern, k: 0.5 },
      { p: [hemd], k: 2, anker: [0, atem] },
      { p: [fussL], k: 0 },
      { p: [hals, kopf], k: 1.5, anker: [0, atem] },
      { p: puppe, k: 0.5 },
      { p: [...armNah, ...finger(hand(2)), ...finger(hand(-2))], k: 0.6 },
    ];
    const augen = [];
    const details = P => {
      // Falten im Hemd
      P.line(cx + 2 + lean, sh[1] + 6, cx + 4, 110, 'k1', true); P.line(cx + 8 + lean * 0.5, sh[1] + 10, cx + 16, 110, 'k1', true);
      // geschlossene Augen: Lidspalten, durch die Licht scheint
      const ey = r(ky + 1), R0 = v.kopf;
      for (let y = r(ky - R0); y <= r(ky + R0 + 1); y++) for (let x = r(kx - R0); x <= r(kx + R0); x++) { const q = ((x + 0.5 - kx) / R0) ** 2 + ((y + 0.5 - ky) / (R0 + 1)) ** 2; if (q > 0.8 || !P.get(x, y)) continue; const c = P.get(x, y); if (c >= 5) continue; P.set(x, y, A.bay(x, y) < 0.42 - q * 0.4 + (x - kx) * 0.03 ? 'r1' : 'k3'); }
      if (licht > 0) {
        P.glow(kx - 1, ey + 0.5, 4 * licht, 0.9);
        for (const ex of [r(kx - 5), r(kx + 1)]) { P.set(ex, ey, licht > 1.2 ? 'kern' : 'glut'); P.set(ex + 1, ey, 'kern'); P.set(ex + 2, ey, 'glut'); augen.push([ex + 1, ey]); }
      } else for (const ex of [r(kx - 5), r(kx + 1)]) P.line(ex, ey, ex + 2, ey, 'k0');
      // Mund: im Schlaf leicht offen, beim Rufen weit
      const mh = p.angriff ? schrei + 1 : 1;
      for (let k = 0; k < mh; k++) { P.set(r(kx - 2), ey + 4 + k, 'k0'); if (mh > 1) P.set(r(kx - 1), ey + 4 + k, 'k0'); }
      if (p.angriff && f === 2) P.set(r(kx - 2), ey + 5, 'glutDim');
    };
    return { gruppen, details, augen };
  },
};
