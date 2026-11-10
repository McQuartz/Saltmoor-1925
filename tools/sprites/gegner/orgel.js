// Die Orgel (Kapelle, Elite). Die Pfeifen sind gewachsen, seit der Organist nicht mehr kommt.
// Jetzt steht sie auf eigenen Beinen, ein Gehäuse mit Pfeifen wie Zähne, und wenn sie den
// tiefsten Ton hält, friert dir die Hand an der Karte fest. Wo der Spieltisch war, sitzt noch
// der Organist, eingewachsen bis zur Brust. Angriff: die Pfeifen blasen.
'use strict';
module.exports = {
  id: 'orgel', biom: 'kapelle', zone: 'kapelle', w: 128, h: 160, fuss: [64, 155], kopf: [50, 96], rimBis: 152, rang: 'elite',
  varianten: { orgel: {} },
  bild(p, v, A) {
    const { E, C, Pg, r, glied } = A;
    const f = p.f;
    let lean = 0, blas = 0, fall = 0, glanz = 1, nick = 0;
    if (p.idle) { nick = [0, 0, 1, 1][f]; glanz = [1, 1.05, 0.9, 1.05][f]; }
    if (p.angriff) { blas = [1, 2, 4, 2][f]; lean = [2, 3, -6, -2][f]; glanz = [1, 1.3, 1.8, 1.2][f]; }
    if (p.treffer) { lean = [4, 2][f]; glanz = 0.5; }
    if (p.tod) { fall = r(p.q * 36); lean = r(p.q * 5); glanz = f < 2 ? 0.6 : 0; }
    const cx = 64, ox = lean, sy = 56 + fall;
    const gehaeuse = Pg([[cx - 30 + ox, sy + 4], [cx - 24 + ox, sy - 8], [cx + 24 + ox, sy - 8], [cx + 32 + ox, sy + 4], [cx + 30, sy + 70], [cx - 28, sy + 70]], null, { rd: 1.6 });
    const beine = [[-22, -1], [-8, 0], [10, 0], [24, 1]].map(([dx, s]) => glied([[cx + dx, sy + 66], [cx + dx + s * 6, sy + 80], [cx + dx + s * 8, 152]], 3, 2.4, 'dunkel'));
    const pfeifen = [];
    const hs = [26, 36, 46, 52, 46, 36, 26];
    for (let i = 0; i < 7; i++) { const x = cx - 21 + i * 7 + ox, h = hs[i] + (i === 3 ? blas : 0); pfeifen.push(Pg([[x - 2.6, sy - 6], [x - 2.6, sy - 6 - h], [x, sy - 9 - h], [x + 2.6, sy - 6 - h], [x + 2.6, sy - 6]], null, { rd: 0.6 })); }
    // Organist: Oberkörper vorn am Spieltisch
    const ox2 = cx - 14 + ox, oy = sy + 34 + nick;
    const org = Pg([[ox2 - 10, oy + 20], [ox2 - 10, oy + 2], [ox2 - 4, oy - 4], [ox2 + 6, oy - 2], [ox2 + 8, oy + 20]], null, { rd: 1.6 });
    const okopf = E(ox2 - 2, oy - 10 + nick, 6, 6.5, null, { rd: 1.3 });
    const tisch = Pg([[cx - 30 + ox, sy + 54], [cx + 4 + ox, sy + 54], [cx + 2 + ox, sy + 60], [cx - 32 + ox, sy + 60]], 'dunkel', { rd: 0.6, pf: 'flat' });
    const arme = [glied([[ox2 - 6, oy + 2], [ox2 - 12, oy + 10], [ox2 - 10, sy + 54]], 2.4, 2, null), glied([[ox2 + 5, oy + 2], [ox2 + 2, oy + 12], [ox2 + 4, sy + 54]], 2.4, 2, null)];
    const tot = p.tod && f >= 3;
    const gruppen = [
      { p: beine.flat(), k: 1 },
      { p: tot ? pfeifen.slice(0, 3) : pfeifen, k: 1.5 },
      { p: [gehaeuse], k: 3 },
      { p: [org], k: 1 },
      { p: [okopf], k: 2 },
      { p: arme.flat(), k: 1 },
      { p: [tisch], k: 0, pf: 'flat' },
    ];
    const augen = [];
    const details = P => {
      // Pfeifenmünder (Labien) glimmen, Schnitzwerk am Gehäuse, Kerzen
      for (let i = 0; i < 7; i++) { const x = r(cx - 21 + i * 7 + ox), y = r(sy - 14); P.set(x, y, glanz > 0 ? 'glutDim' : 'k0'); if (glanz > 1.3) P.set(x, y - 1, 'glut'); }
      for (let i = 0; i < 6; i++) P.line(r(cx - 17.5 + i * 7 + ox), r(sy - 8), r(cx - 17.5 + i * 7 + ox), r(sy - 8 - Math.min(hs[i], hs[i + 1]) + 2), 'k0', true);
      for (let x = cx - 24; x <= cx + 24; x += 4) P.auf(r(x + ox), r(sy - 7), 'r1');
      for (let y = sy + 10; y < sy + 66; y += 8) { P.set(r(cx + 26 + ox), y, 'k3'); }
      P.line(r(cx - 30 + ox), r(sy + 54), r(cx + 4 + ox), r(sy + 54), 'r1');
      if (glanz > 0) {
        P.set(r(cx + 20 + ox), r(sy + 30), 'flamme'); P.glow(cx + 20 + ox, sy + 30, 5, 0.5, 'glutDim', 'k3');
        const ex = r(ox2 - 5), ey = r(oy - 10 + nick);
        P.set(ex, ey, 'kern'); P.set(ex + 4, ey, 'glut');
        P.glow(ex + 2, ey, 5 * glanz, 0.8 * glanz, 'glutDim', 'k3');
        augen.push([ex, ey], [ex + 4, ey]);
      }
    };
    return { gruppen, details, augen, sinken: 0 };
  },
};
