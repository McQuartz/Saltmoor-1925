// Der Glockenstimmer (Glockengießerei, Elite). Er hat 1641 jede Glocke abgedreht, bis sie den Ton
// traf, und am Ende sich selbst. Ein hagerer Mann im Lederschurz; wo der Kopf war, steht eine
// Stimmgabel aus Bronze, so lang wie sein Oberkörper, die Zinken leicht auseinander. Zwischen den
// Zinken, am Grund der Gabel, sitzen die Augen. In der Hand ein kleiner Hammer, mit dem er gegen
// die Gabel schlägt; der Ton fährt dir in die Hand. Angriff: der Schlag, die Zinken schwingen auf.
'use strict';
module.exports = {
  id: 'stimmer', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 128, h: 160, fuss: [64, 155], kopf: [62, 40], rimBis: 152, rang: 'elite',
  varianten: { stimmer: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, spreiz = 0, hammer = 0, fall = 0, glanz = 1, atem = 0;
    if (p.idle) { spreiz = [0, 1, 0, 1][f]; glanz = [1, 1.1, 1, 1.1][f]; }
    if (p.angriff) { lean = [1, 2, -6, -2][f]; spreiz = [0, -1, 5, 3][f]; hammer = [8, 14, -2, 2][f]; glanz = [1, 1.2, 1.7, 1.3][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; spreiz = 2; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 4); glanz = f < 2 ? 0.6 : 0; spreiz = r(p.q * 4); }
    const cx = 64, ox = lean, sy = 68 + atem + fall;
    // Leib: hager, Schultern spitz, Schurz bis unter die Knie
    const rumpf = Pg([[cx - 15 + ox, sy + 5], [cx - 3 + ox, sy - 2], [cx + 15 + ox, sy + 3], [cx + 8 + r(ox / 2), sy + 28], [cx + 10, sy + 48], [cx - 9, sy + 48], [cx - 7 + r(ox / 2), sy + 26]], null, { rd: 1.5 });
    const schurz = Pg([[cx - 8 + ox, sy + 16], [cx + 8 + ox, sy + 16], [cx + 18, 130], ...saum(cx + 18, cx - 18, 135, 4, 3, 3), [cx - 18, 130]], 'dunkel', { rd: 1, pf: 'bevel' });
    const beine = glied([[cx - 4, sy + 42], [cx - 6, 140], [cx - 9, 153]], 3.4, 2.6, null).concat(glied([[cx + 5, sy + 42], [cx + 7, 140], [cx + 9, 153]], 3.4, 2.6, null));
    const schuhe = [E(cx - 12, 153, 5, 2.5, 'dunkel'), E(cx + 11, 153, 4, 2.5, 'dunkel')];
    // Stimmgabel: Stiel aus dem Hals, Bügel, zwei Zinken
    const gx = cx + ox * 1.3, gy = sy - 2;
    const tilt = -0.18 + spreiz * 0.01; // leicht nach vorn geneigt
    const rot = (dx, dy) => [gx + dx * Math.cos(tilt) - dy * Math.sin(tilt), gy + dx * Math.sin(tilt) + dy * Math.cos(tilt)];
    const stiel = C(...rot(0, 4), ...rot(0, -10), 3, 3, null, { pf: 'flat' });
    // Bügel: ein U aus Kapseln
    const bogen = [];
    for (let i = 0; i < 6; i++) { const a0 = Math.PI * i / 6, a1 = Math.PI * (i + 1) / 6; bogen.push(C(...rot(-10 * Math.cos(a0), -12 - 9 * Math.sin(a0) * -1 + 0 - 9), ...rot(-10 * Math.cos(a1), -12 - 9 * Math.sin(a1) * -1 - 9), 3, 3, null, { pf: 'bevel' })); }
    const zl = [C(...rot(-10, -21), ...rot(-10 - spreiz, -52), 3, 2.6, null, { pf: 'bevel' })];
    const zr = [C(...rot(10, -21), ...rot(10 + spreiz, -52), 3, 2.6, null, { pf: 'bevel' })];
    const buegel = bogen[0];
    // Arme: vorn der Hammer, hinten hält er eine Handglocke
    const hx = cx - 26 + ox + r(hammer * 0.6), hy = sy + 22 - hammer * 2;
    const armV = glied([[cx - 10 + ox, sy + 3], [cx - 20 + ox, sy + 18], [hx, hy]], 3.2, 2.4, null);
    const stielH = C(hx, hy, hx - 8 + r(hammer / 3), hy - 10, 1, 1, 'dunkel', { pf: 'flat' });
    const kopfH = Pg([[hx - 12 + r(hammer / 3), hy - 13], [hx - 4 + r(hammer / 3), hy - 13], [hx - 4 + r(hammer / 3), hy - 8], [hx - 12 + r(hammer / 3), hy - 8]], null, { rd: 0.6, pf: 'bevel' });
    const bx = cx + 22 + ox, by = sy + 34;
    const armH = glied([[cx + 10 + ox, sy + 3], [cx + 18 + ox, sy + 18], [bx, by - 6]], 3.2, 2.4, null);
    const glocke = Pg([[bx - 3, by - 6], [bx + 3, by - 6], [bx + 6, by + 4], [bx - 6, by + 4]], null, { rd: 1.5, pf: 'bevel' });
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: armH, k: 1 },
      { p: [glocke], k: 0, pf: 'bevel' },
      { p: beine, k: 1 },
      { p: schuhe, k: 0 },
      { p: [rumpf], k: 2 },
      { p: [schurz], k: 1 },
      { p: tot ? [] : [stiel, ...bogen, ...zl, ...zr], k: 1.5, pf: 'bevel' },
      { p: armV, k: 1 },
      { p: [stielH, kopfH], k: 0, pf: 'bevel' },
    ];
    const augen = [];
    const details = P => {
      // Bronze: Glanzlinie innen an den Zinken, Hammerkopf und Glocke
      if (!tot) {
        { const [a, b] = rot(-9, -24), [c, d] = rot(-9 - spreiz, -48); P.line(r(a), r(b), r(c), r(d), 'bronze', true); }
        { const [a, b] = rot(11, -24), [c, d] = rot(11 + spreiz, -48); P.line(r(a), r(b), r(c), r(d), 'bronze', true); }
        // Schwingen: zwei, drei Pixel neben den Spitzen, wenn sie klingt
        if (spreiz >= 3 || (p.idle && f % 2)) { [rot(-15 - spreiz, -48), rot(15 + spreiz, -48), rot(-16 - spreiz, -38), rot(16 + spreiz, -38)].forEach(([x, y]) => P.set(r(x), r(y), 'glutDim')); }
      }
      P.line(r(hx - 11 + hammer / 3), r(hy - 11), r(hx - 5 + hammer / 3), r(hy - 11), 'bronze', true);
      P.auf(r(bx - 2), r(by - 2), 'bronze'); P.auf(r(bx + 2), r(by + 1), 'bronze');
      // Schurz: Brandflecken vom Guss
      P.auf(r(cx - 4), r(sy + 30), 'lehm'); P.auf(r(cx + 3), r(sy + 46), 'lehm'); P.auf(r(cx - 7), r(sy + 52), 'lehm');
      // Augen am Grund der Gabel, zwischen den Zinken
      if (glanz > 0 && !tot) {
        const [ea, eb] = rot(-2, -19), ex = r(ea), ey = r(eb);
        P.set(ex, ey, 'kern'); P.set(ex + 3, ey, 'kern'); P.set(ex, ey + 1, 'glut'); P.set(ex + 3, ey + 1, 'glut');
        P.glow(ex + 2, ey + 0.5, 6 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 3, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
