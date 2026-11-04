// Boss Pforte: Das, was ruft. Drei Phasen, jede ein schlechterer Versuch, menschlich auszusehen.
// P1 König (Krone, Mantel, unter der Krone nur ein Auge), P2 Schlund (Mantel aufgerissen, Spalt mit Zähnen,
// Krone schwebt darüber), P3 Auge (keine Form mehr, Bögen aus Randlicht um ein Auge, Magenta-Akzente).
'use strict';
module.exports = {
  id: 'ruft', biom: 'pforte', zone: 'pforte', rang: 'boss', w: 160, h: 160, fuss: [80, 155], kopf: [80, 4], rimBis: 156,
  varianten: { ruft_p1: { phase: 1 }, ruft_p2: { phase: 2 }, ruft_p3: { phase: 3, fuss: [80, 150] } },
  anim: { idle: { n: 4, fps: 3, loop: true }, angriff: { n: 4, fps: 8 }, treffer: { n: 2, fps: 10 }, tod: { n: 6, fps: 6 } },
  todStart: 0.35,
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum, pose } = A;
    const P0 = pose(p, { lunge: 6, fall: 0 }), f = p.f, ph = v.phase, cx = 80;
    const lean = P0.lean, atem = P0.atem;
    const gruppen = []; const augen = [];
    const krone = (x, y, s = 1) => [Pg([[x - 14 * s, y + 6], [x - 16 * s, y - 8 * s], [x - 9 * s, y - 2], [x - 5 * s, y - 14 * s], [x, y - 4], [x + 5 * s, y - 14 * s], [x + 9 * s, y - 2], [x + 16 * s, y - 8 * s], [x + 14 * s, y + 6]], null, { rd: 0.6 })];
    const offen = p.angriff ? [1, 3, 6, 2][f] : p.idle ? [0, 1, 1, 0][f] : 0;
    let aug = null, spalt = null, kroneY = 0;
    if (ph === 1) {
      const top = 46 + atem;
      const mantel = Pg([[cx - 20 + lean, top], [cx + 20 + lean, top], [cx + 34 + lean / 2, top + 30], [cx + 44, 140], ...saum(cx + 44, cx - 44, 152, 9, 4, 3, p.idle ? [0, 1, 1, 0][f] : 0), [cx - 44, 140], [cx - 34 + lean / 2, top + 30]], null, { rd: 2 });
      const schultern = E(cx + lean, top + 6, 26, 9, null, { pf: 'dome' });
      const kopf = E(cx + lean, top - 14, 13, 15, 'haut', { pf: 'bevel' });
      const kragen = Pg([[cx - 24 + lean, top + 2], [cx - 18 + lean, top - 16], [cx - 10 + lean, top + 4], [cx + 10 + lean, top + 4], [cx + 18 + lean, top - 16], [cx + 24 + lean, top + 2]], 'dunkel', { rd: 1 });
      const zepter = [C(cx + 38 + lean, top + 20, cx + 46, 150, 1.4, 1.4, 'dunkel', { pf: 'flat' }), E(cx + 37 + lean, top + 16, 4, 4, null)];
      const armL = glied([[cx - 22 + lean, top + 10], [cx - 34 + lean + (p.angriff ? -8 * Math.min(f, 2) : 0), top + 44], [cx - 30 + lean + (p.angriff ? -16 * Math.min(f, 2) : 0), top + 70 - (p.angriff ? 12 * Math.min(f, 2) : 0)]], 4.5, 2.4, null);
      kroneY = top - 30;
      gruppen.push({ p: [mantel, schultern], k: 5 }, { p: [C(cx - 8 + lean, top + 12, cx - 12, 148, 1.5, 2.5, 'dunkel'), C(cx + 10 + lean, top + 12, cx + 14, 148, 1.5, 2.5, 'dunkel')], k: 0, noRim: true }, { p: [kopf], k: 0 }, { p: [kragen], k: 1 }, { p: krone(cx + lean, kroneY), k: 0, pf: 'flat' }, { p: zepter, k: 0 }, { p: armL, k: 1 });
      aug = [cx + lean, top - 14, 4 + offen * 0.5];
    } else if (ph === 2) {
      const top = 40 + atem;
      // zwei Mantelhälften, auseinandergerissen; dazwischen der Spalt
      const sp = 4 + offen;
      const links = Pg([[cx - sp - 4 + lean, top], [cx - 30 + lean, top + 8], [cx - 46, 120], [cx - 40, 152], [cx - 26, 146], [cx - 14, 154], [cx - sp, 140], [cx - sp - 2 + lean / 2, 70]], null, { rd: 3 });
      const rechts = Pg([[cx + sp + 4 + lean, top - 4], [cx + 32 + lean, top + 6], [cx + 46, 118], [cx + 42, 152], [cx + 28, 146], [cx + 16, 154], [cx + sp, 140], [cx + sp + 2 + lean / 2, 70]], null, { rd: 3 });
      const fetzen = [C(cx - 40, 120, cx - 52, 150, 2, 1, 'dunkel'), C(cx + 42, 118, cx + 54, 146, 2, 1, 'dunkel')];
      kroneY = top - 22 - (p.idle ? [0, 1, 2, 1][f] : 0);
      gruppen.push({ p: fetzen, k: 0 }, { p: [links], k: 0 }, { p: [rechts], k: 0 }, { p: krone(cx + lean, kroneY, 0.9), k: 0, pf: 'flat' });
      spalt = { x: cx + lean / 2, y0: top + 4, y1: 146, sp };
    } else {
      // formlos: Bögen aus Randlicht um ein Auge, schwebt
      const y0 = 78, dreh = (p.idle ? 0 : f * 0.3);
      const boegen = [];
      for (let i = 0; i < 6; i++) {
        const a = i * Math.PI / 3 + dreh, R = 34 + (i % 2) * 10 + (p.idle ? 0 : offen);
        const pts = []; for (let k = -3; k <= 3; k++) { const aa = a + k * 0.16; pts.push([cx + Math.cos(aa) * R + lean, y0 + Math.sin(aa) * R * 0.9]); }
        boegen.push(...glied(pts, 3.2, 1, null));
      }
      const faeden = []; for (let i = 0; i < 5; i++) faeden.push(...glied([[cx - 14 + i * 7 + lean, y0 + 18], [cx - 16 + i * 8 + Math.sin(i + (p.idle ? 0 : f) * 0.5) * 2, y0 + 44], [cx - 18 + i * 9, y0 + 66]], 1.4, 0.5, null));
      const kern = E(cx + lean, y0, 20, 18, null, { pf: 'dome' });
      gruppen.push({ p: faeden, k: 0, anker: [0, y0] }, { p: boegen, k: 0, anker: [0, y0] }, { p: [kern], k: 2, anker: [0, y0] });
      aug = [cx + lean, y0, 9 + (p.idle ? 0 : offen * 0.25)];
    }
    const details = P => {
      if (aug && !P0.aus) {
        const [x, y, R] = aug;
        P.glow(x, y, R * 3, 0.9, 'glutDim', 'k3');
        P.el(x, y, R * 1.3, R, 'k0', true);
        P.el(x, y, R, R * 0.75, ph === 3 ? 'glutDim' : 'glut', true); if (ph === 3) P.el(x, y, R * 0.7, R * 0.55, 'glut', true);
        P.el(x, y, R * 0.45, R * 0.6, ph === 3 ? 'magenta1' : 'k0', true);
        P.set(r(x - R * 0.3), r(y - R * 0.3), 'kern'); P.set(r(x - R * 0.3) + 1, r(y - R * 0.3), 'kern');
        augen.push([r(x), r(y)]);
        if (ph === 3) for (let a = (p.idle ? f * 0.15 : 0); a < 6.28; a += 0.45) P.auf(r(x + Math.cos(a) * (R * 1.35 + 2)), r(y + Math.sin(a) * (R * 1.1 + 2)), 'magenta1');
      }
      if (spalt) {
        const { x, y0, y1, sp } = spalt;
        for (let y = y0; y <= y1; y++) { const t = (y - y0) / (y1 - y0), w = Math.round(Math.sin(t * Math.PI) * (sp + 2)); for (let k = -w; k <= w; k++) P.set(x + k, y, (Math.abs(k) < w - 2 && (y + k) % 5 === 0) ? 'magenta1' : 'k0'); if (y % 3 === 0) { P.set(x - w - 1, y, 'r1'); P.set(x + w + 1, y, 'r1'); } }
        if (!P0.aus) for (let i = 0; i < 4; i++) { const y = y0 + 20 + i * 26, w = Math.round(Math.sin(((y - y0) / (y1 - y0)) * Math.PI) * (sp + 2)); P.set(x - w + 1, y, 'kern'); P.set(x + w - 1, y + 1, 'glut'); augen.push([x - w + 1, y]); }
      }
      if (kroneY) for (let i = -2; i <= 2; i++) P.auf(cx + lean + i * 6, kroneY + 2, i ? 'magenta2' : 'kern');
    };
    return { gruppen, details, augen };
  },
};
