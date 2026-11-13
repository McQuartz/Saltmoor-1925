// Der Stationsvorsteher (Station, die nie eröffnet wurde, Elite). Er sollte am Eröffnungstag um
// zwölf die Kelle heben. Seither ist es fünf vor zwölf. Uniform mit Schulterstücken, steif wie
// ein Mast; wo der Kopf sein sollte, hängt die Bahnsteiguhr an ihrem Ausleger, ein weißes
// Emailleblatt, die Zeiger stehen kurz vor zwölf. Die Augen sitzen im Zifferblatt bei der Zwölf.
// In der Hand die Befehlskelle, grün. Angriff: er hebt die Kelle und schlägt sie herab.
'use strict';
module.exports = {
  id: 'vorsteher', biom: 'station', zone: 'station', w: 128, h: 160, fuss: [64, 155], kopf: [62, 6], rimBis: 152, rang: 'elite',
  varianten: { vorsteher: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    let lean = 0, kelle = 0, blick = 1, fall = 0, zeiger = 0, pendel = 0;
    if (p.idle) { pendel = [0, 1, 0, -1][f]; zeiger = [0, 0, 1, 1][f]; }
    if (p.angriff) { lean = [2, 2, -5, -2][f]; kelle = [0.9, 1.5, -0.6, -0.1][f]; blick = [1, 1.3, 1.6, 1.1][f]; zeiger = 2; }
    if (p.treffer) { lean = [4, 2][f]; blick = 0.5; pendel = 2; }
    if (p.tod) { fall = r(p.q * 44); lean = r(p.q * 4); blick = f < 2 ? 0.6 : 0; pendel = r(p.q * 4); }
    const cx = 64, ox = lean, sy = 58 + fall;
    // Uniformrock: gerade, steif, mit Schößen
    const rock = Pg([[cx - 16 + ox, sy], [cx + 16 + ox, sy], [cx + 18 + ox, sy + 46], [cx + 14, sy + 58], [cx + 4, sy + 52], [cx - 4, sy + 52], [cx - 14, sy + 58], [cx - 18 + ox, sy + 46]], null, { rd: 1.2 });
    const schulter = [E(cx - 15 + ox, sy + 2, 6, 3, 'dunkel'), E(cx + 15 + ox, sy + 2, 6, 3, 'dunkel')];
    const hosen = [C(cx - 7, sy + 50, cx - 8, 150, 4, 3.4, 'dunkel'), C(cx + 7, sy + 50, cx + 8, 150, 4, 3.4, 'dunkel'), E(cx - 11, 152, 5.5, 2.4, null), E(cx + 6, 152, 5.5, 2.4, null)];
    // Ausleger: ein Eisenarm aus dem Kragen, an dem die Uhr hängt
    const ux = cx - 4 + ox + pendel, uy = sy - 22;
    const ausleger = [C(cx + 4 + ox, sy + 2, cx + 4 + ox, uy - 18, 1.6, 1.4, 'dunkel', { pf: 'flat' }), C(cx + 4 + ox, uy - 18, ux, uy - 18, 1.4, 1.4, 'dunkel', { pf: 'flat' }), C(ux, uy - 18, ux, uy - 14, 0.8, 0.8, 'dunkel')];
    const uhr = E(ux, uy, 15, 15, null, { pf: 'bevel' });
    // Arme: links Kelle, rechts am Rücken
    const hx = cx - 26 + ox, hy = sy + 20 - kelle * 10;
    const armL = glied([[cx - 14 + ox, sy + 4], [cx - 22 + ox, sy + 14 - kelle * 4], [hx, hy]], 3, 2.4, null);
    const armR = glied([[cx + 14 + ox, sy + 4], [cx + 19 + ox, sy + 18], [cx + 14 + ox, sy + 30]], 3, 2.4, null);
    const ka = Math.PI / 2 + 0.2 - kelle * 1.3;
    const kx2 = hx + Math.cos(ka + Math.PI) * 14, ky2 = hy + Math.sin(ka + Math.PI) * 14;
    const stiel = C(hx, hy, kx2, ky2, 0.9, 0.9, 'dunkel', { pf: 'flat' });
    const scheibe = E(kx2 + Math.cos(ka + Math.PI) * 4, ky2 + Math.sin(ka + Math.PI) * 4, 5, 5, null, { pf: 'flat' });
    const tot = p.tod && f >= 4;
    const gruppen = [
      { p: armR, k: 1 },
      { p: hosen, k: 1 },
      { p: [rock], k: 2 },
      { p: schulter, k: 0 },
      { p: tot ? [] : ausleger, k: 0, pf: 'flat' },
      { p: tot ? [] : [uhr], k: 0 },
      { p: armL, k: 1 },
      { p: tot ? [] : [stiel, scheibe], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Knöpfe und Schulterstücke in Messing
      for (let i = 0; i < 6; i++) P.auf(r(cx + ox), r(sy + 6 + i * 7), 'messing');
      P.line(r(cx - 19 + ox), r(sy + 1), r(cx - 11 + ox), r(sy + 1), 'messing', true); P.line(r(cx + 11 + ox), r(sy + 1), r(cx + 19 + ox), r(sy + 1), 'messing', true);
      if (!tot) {
        // Zifferblatt: blasse Emaille, Rand dunkel, zwölf Striche
        P.el(ux + 0.5, uy + 0.5, 12, 12, 'k3', true); P.el(ux + 0.5, uy + 0.5, 9, 9, 'k2', true);
        for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2 - Math.PI / 2; P.auf(r(ux + Math.cos(a) * 10), r(uy + Math.sin(a) * 10), i % 3 ? 'k3' : 'blass'); }
        // Zeiger: fünf vor zwölf (der große zittert vor)
        const gross = -Math.PI / 2 - 0.52 + zeiger * 0.04, klein = -Math.PI / 2 - 0.05;
        P.line(r(ux), r(uy), r(ux + Math.cos(gross) * 9), r(uy + Math.sin(gross) * 9), 'blass', true);
        P.line(r(ux), r(uy), r(ux + Math.cos(klein) * 6), r(uy + Math.sin(klein) * 6), 'blass', true);
        // Augen bei der Zwölf
        if (blick > 0) {
          const ex = r(ux - 3), ey = r(uy - 6);
          P.set(ex, ey, 'kern'); P.set(ex + 5, ey, 'kern'); P.set(ex - 1, ey, 'glut'); P.set(ex + 6, ey, 'glut');
          P.glow(ex + 2.5, ey + 0.5, 6 * blick, 0.6, 'glutDim', 'k3');
          augen.push([ex, ey], [ex + 5, ey]);
        }
        // Kelle: grüne Scheibe mit weißem Rand
        const sx = r(kx2 + Math.cos(ka + Math.PI) * 4), sy2 = r(ky2 + Math.sin(ka + Math.PI) * 4);
        P.el(sx + 0.5, sy2 + 0.5, 3.4, 3.4, 'glutDim', true); P.set(sx, sy2, p.angriff && f === 2 ? 'kern' : 'glutDim');
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
