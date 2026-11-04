// Augen im Rand (Pforte, Auftrag 2 M7, neu). Was das, was ruft, herbeiruft: eine Laterne vom Kai,
// die an ihrer Kette aus der See-Decke herabhängt. Statt einer Flamme sitzt im Glas ein Auge.
// augen_a: Sturmlaterne mit Bügel und Dach, kurze Kette; augen_b: Positionslaterne mit Rippenglas,
// lange Kette, zwei Fäden darunter. Silhouette: hängendes Gehäuse an einem senkrechten Strich.
// fuss = Schattenpunkt am Boden (die Laterne schwebt über ihm).
'use strict';
const K = require('./hilfe/kanten');
module.exports = {
  id: 'augen', biom: 'pforte', zone: 'pforte', w: 96, h: 120, fuss: [48, 114], kopf: [48, 30],
  varianten: {
    augen_a: { art: 'sturm', y: 58, kopf: [48, 34] },
    augen_b: { art: 'position', y: 70, kopf: [48, 50] },
  },
  skizzen: { augen_kugel: { art: 'kugel', y: 62 } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, pose } = A;
    const f = p.f, P0 = pose(p, { lunge: 9, fall: 40 });
    // Pendel: Aufhängung oben fest, die Laterne schwingt
    let sw = p.idle ? [0, 1, 1, 0][f] : 0, hoch = 0, weit = 1;
    if (p.angriff) { sw = [4, 7, -10, -4][f]; hoch = [-2, -4, 2, 0][f]; weit = [0.6, 0.5, 1.4, 1.1][f]; }
    if (p.treffer) { sw = [5, 3][f]; weit = 0.3; }
    const fall = P0.fall, riss = p.tod && f >= 1;
    const ax = 48, lx = ax + sw, ly = v.y + hoch + fall;
    const gross = v.art === 'sturm' ? 1 : 0.8;
    // Kette: Glieder von oben bis zur Laterne (beim Tod reißt sie)
    const glieder = [], ketteBis = riss ? Math.max(0, v.y - 22 - fall * 2) : ly - 20 * gross;
    const n = Math.max(1, Math.round(ketteBis / 4));
    for (let i = 0; i < n; i++) { const q = (i + 0.5) / n, x = ax + (lx - ax) * q * q * 0.9 + (riss ? 0 : 0), y = q * ketteBis; glieder.push(i & 1 ? E(x, y, 1.1, 2.2, null) : E(x, y, 2, 1.4, null)); }
    const T = [Math.round(sw), Math.round(ly)];
    let teile = [], glas = null, fad = [];
    if (v.art === 'sturm') {
      const bg = glied([[lx - 8, ly - 16], [lx - 7, ly - 24], [lx, ly - 27], [lx + 7, ly - 24], [lx + 8, ly - 16]], 1.3, 1.3, null);
      const dach = Pg([[lx - 11, ly - 13], [lx - 4, ly - 21], [lx + 4, ly - 21], [lx + 11, ly - 13], [lx + 10, ly - 11], [lx - 10, ly - 11]], 'dunkel', { rd: 1 });
      glas = Pg([[lx - 9, ly - 11], [lx + 9, ly - 11], [lx + 10, ly + 9], [lx - 10, ly + 9]], null, { rd: 1.5 });
      const stege = [C(lx - 10, ly - 11, lx - 11, ly + 10, 1.2, 1.2, null), C(lx + 10, ly - 11, lx + 11, ly + 10, 1.2, 1.2, null), C(lx, ly - 11, lx, ly - 7, 1, 1, null)];
      const fuss = [Pg([[lx - 12, ly + 9], [lx + 12, ly + 9], [lx + 9, ly + 15], [lx - 9, ly + 15]], null, { rd: 1 }), E(lx, ly + 16, 5, 2, 'dunkel')];
      teile = [{ p: bg, k: 0 }, { p: [glas], k: 0, tone: -0.6 }, { p: [dach], k: 0.6 }, { p: stege, k: 0 }, { p: fuss, k: 0.6 }];
      fad = glied([[lx - 2, ly + 17], [lx - 3 - sw * 0.3, ly + 28], [lx - 1 - sw * 0.6, ly + 40]], 1.2, 0.4, null);
    } else if (v.art === 'position') {
      const deckel = [Pg([[lx - 8, ly - 12], [lx - 5, ly - 18], [lx + 5, ly - 18], [lx + 8, ly - 12]], 'dunkel', { rd: 1 }), C(lx, ly - 21, lx, ly - 17, 1.6, 1.6, null)];
      glas = Pg([[lx - 8, ly - 12], [lx + 8, ly - 12], [lx + 9, ly - 2], [lx + 8, ly + 8], [lx - 8, ly + 8], [lx - 9, ly - 2]], null, { rd: 2 });
      const ringe = [C(lx - 9, ly - 6, lx + 9, ly - 6, 0.9, 0.9, null), C(lx - 9, ly + 3, lx + 9, ly + 3, 0.9, 0.9, null)];
      const boden = [Pg([[lx - 9, ly + 8], [lx + 9, ly + 8], [lx + 6, ly + 13], [lx - 6, ly + 13]], null, { rd: 1 })];
      teile = [{ p: [glas], k: 0, tone: -0.6 }, { p: deckel, k: 0.6 }, { p: ringe, k: 0, noRim: false }, { p: boden, k: 0.6 }];
      fad = [...glied([[lx - 3, ly + 13], [lx - 5 - sw * 0.4, ly + 26], [lx - 3 - sw * 0.8, ly + 40]], 1.2, 0.4, null), ...glied([[lx + 3, ly + 13], [lx + 4 - sw * 0.3, ly + 22], [lx + 3 - sw * 0.6, ly + 32]], 1.1, 0.4, null)];
    } else {
      glas = E(lx, ly, 10, 10, null, { pf: 'dome' });
      teile = [{ p: [glas], k: 0 }];
    }
    const gruppen = [{ p: glieder, k: 0 }, { p: fad, k: 0, anker: T }, ...teile.map(t => ({ ...t, anker: T }))];
    const augen = [];
    const details = P => {
      const alle = teile.flatMap(t => t.p);
      K.licht(P, alle, { d: [-1, -1], c: 'r1', c2: null });
      teile.slice(1).forEach(t => K.licht(P, t.p, { c: 'r1', c2: 'k3' }));
      if (P0.aus) { P.line(lx - 5, ly - 1, lx + 5, ly - 1, 'k0', true); return; }
      // Glas: innen dunkler Schein in Magenta, gedithert; das Auge sitzt dort, wo die Flamme wäre
      P.glow(lx + 0.5, ly, 9 * gross, 0.8, 'magenta1', 'k1');
      const ey = ly - 1, h = Math.max(1, Math.round(4 * gross * weit * (p.idle && f === 3 ? 0.4 : 1)));
      P.el(lx + 0.5, ey + 0.5, 6 * gross, h, 'glutDim', true);
      if (h > 1) { P.el(lx + 0.5, ey + 0.5, 3, Math.min(h, 3), 'glut', true); P.line(lx, ey - Math.min(h, 3) + 1, lx, ey + Math.min(h, 3) - 1, 'k0', true); }
      P.set(r(lx - 2), r(ey - (h > 1 ? 1 : 0)), 'kern');
      // Glanz auf dem Glas: zwei helle Striche rechts oben (Gegenlicht)
      P.auf(r(lx + 6 * gross), r(ly - 8), 'r2'); P.auf(r(lx + 6 * gross), r(ly - 7), 'r1');
      augen.push([r(lx - 2), r(ey)]);
    };
    return { gruppen, details, augen };
  },
};
