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
    augen_a: { art: 'sturm', y: 60, kopf: [48, 26] },
    augen_b: { art: 'position', y: 68, kopf: [48, 38] },
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
    const S = v.art === 'sturm' ? 1.6 : 1.45, gross = S * (v.art === 'sturm' ? 1 : 0.8);
    // Kette: Glieder von oben bis zur Laterne (beim Tod reißt sie)
    const glieder = [], ketteBis = riss ? Math.max(0, v.y - 34 - fall * 2) : ly - (v.art === 'sturm' ? 42 : 30);
    const n = Math.max(1, Math.round(ketteBis / 4));
    for (let i = 0; i < n; i++) { const q = (i + 0.5) / n, x = ax + (lx - ax) * q * q * 0.9 + (riss ? 0 : 0), y = q * ketteBis; glieder.push(i & 1 ? E(x, y, 1.3, 2.4, null) : E(x, y, 2.2, 1.6, null)); }
    const T = [Math.round(sw), Math.round(ly)];
    let teile = [], glas = null, fad = [];
    if (v.art === 'sturm') {
      const bg = glied([[lx - 8 * S, ly - 16 * S], [lx - 7 * S, ly - 24 * S], [lx, ly - 27 * S], [lx + 7 * S, ly - 24 * S], [lx + 8 * S, ly - 16 * S]], 1.3, 1.3, null);
      const dach = Pg([[lx - 11 * S, ly - 13 * S], [lx - 4 * S, ly - 21 * S], [lx + 4 * S, ly - 21 * S], [lx + 11 * S, ly - 13 * S], [lx + 10 * S, ly - 11 * S], [lx - 10 * S, ly - 11 * S]], 'dunkel', { rd: 1 });
      glas = Pg([[lx - 9 * S, ly - 11 * S], [lx + 9 * S, ly - 11 * S], [lx + 10 * S, ly + 9 * S], [lx - 10 * S, ly + 9 * S]], null, { rd: 1.5 });
      const stege = [C(lx - 10 * S, ly - 11 * S, lx - 11 * S, ly + 10 * S, 1.2, 1.2, null), C(lx + 10 * S, ly - 11 * S, lx + 11 * S, ly + 10 * S, 1.2, 1.2, null), C(lx, ly - 11 * S, lx, ly - 7 * S, 1, 1, null)];
      const fuss = [Pg([[lx - 12 * S, ly + 9 * S], [lx + 12 * S, ly + 9 * S], [lx + 9 * S, ly + 15 * S], [lx - 9 * S, ly + 15 * S]], null, { rd: 1 }), E(lx, ly + 16 * S, 5, 2, 'dunkel')];
      teile = [{ p: bg, k: 0 }, { p: [glas], k: 0, tone: -0.6 }, { p: [dach], k: 0.6 }, { p: stege, k: 0 }, { p: fuss, k: 0.6 }];
      fad = glied([[lx - 2 * S, ly + 17 * S], [lx - 3 * S - sw * 0.3, ly + 28 * S], [lx - 1 * S - sw * 0.6, ly + 40 * S]], 1.2, 0.4, null);
    } else if (v.art === 'position') {
      const deckel = [Pg([[lx - 8 * S, ly - 12 * S], [lx - 5 * S, ly - 18 * S], [lx + 5 * S, ly - 18 * S], [lx + 8 * S, ly - 12 * S]], 'dunkel', { rd: 1 }), C(lx, ly - 21 * S, lx, ly - 17 * S, 1.6, 1.6, null)];
      glas = Pg([[lx - 8 * S, ly - 12 * S], [lx + 8 * S, ly - 12 * S], [lx + 9 * S, ly - 2 * S], [lx + 8 * S, ly + 8 * S], [lx - 8 * S, ly + 8 * S], [lx - 9 * S, ly - 2 * S]], null, { rd: 2 });
      const ringe = [C(lx - 9 * S, ly - 6 * S, lx + 9 * S, ly - 6 * S, 0.9, 0.9, null), C(lx - 9 * S, ly + 3 * S, lx + 9 * S, ly + 3 * S, 0.9, 0.9, null)];
      const boden = [Pg([[lx - 9 * S, ly + 8 * S], [lx + 9 * S, ly + 8 * S], [lx + 6 * S, ly + 13 * S], [lx - 6 * S, ly + 13 * S]], null, { rd: 1 })];
      teile = [{ p: [glas], k: 0, tone: -0.6 }, { p: deckel, k: 0.6 }, { p: ringe, k: 0, noRim: false }, { p: boden, k: 0.6 }];
      fad = [...glied([[lx - 3 * S, ly + 13 * S], [lx - 5 * S - sw * 0.4, ly + 26 * S], [lx - 3 * S - sw * 0.8, ly + 40 * S]], 1.2, 0.4, null), ...glied([[lx + 3 * S, ly + 13 * S], [lx + 4 * S - sw * 0.3, ly + 22 * S], [lx + 3 * S - sw * 0.6, ly + 32 * S]], 1.1, 0.4, null)];
    } else {
      glas = E(lx, ly, 10, 10, null, { pf: 'dome' });
      teile = [{ p: [glas], k: 0 }];
    }
    // Tang und Seepocken: die Laterne hing lange im Wasser
    const tang = v.art === 'kugel' ? [] : [[-0.5, 13, 1], [0.35, 18, -1], [0.6, 9, 1]].map(([o, l, d]) => glied([[lx + o * 16, ly + (v.art === 'sturm' ? 24 : 20)], [lx + o * 16 + d * 2 - sw * 0.3, ly + 22 + l * 0.6], [lx + o * 16 + d * 3 - sw * 0.6, ly + 22 + l]], 1.6, 0.5, null)).flat();
    const gruppen = [{ p: glieder, k: 0 }, { p: [...fad, ...tang], k: 0, anker: T }, ...teile.map(t => ({ ...t, anker: T }))];
    const augen = [];
    const details = P => {
      const alle = teile.flatMap(t => t.p);
      K.licht(P, alle, { d: [-1, -1], c: 'r1', c2: null });
      teile.slice(1).forEach(t => K.licht(P, t.p, { c: 'r1', c2: 'k3' }));
      if (P0.aus) { P.line(lx - 5, ly - 1, lx + 5, ly - 1, 'k0', true); return; }
      // Glas: innen dunkler Schein in Magenta, gedithert; das Auge sitzt dort, wo die Flamme wäre
      P.glow(lx + 0.5, ly, 10 * gross, 0.85, 'magenta1', 'k1');
      // Seepocken am Dach und Fuß
      for (const [ox, oy] of [[-8, -15], [6, -16], [-10, 12], [9, 13], [2, 14]]) { const x = r(lx + ox * S * 0.9), y = r(ly + oy * S * 0.9); if (P.get(x, y) && P.get(x, y) < 5) { P.set(x, y, 'k3'); P.auf(x + 1, y - 1, 'r1'); } }
      const ey = ly - 1, h = Math.max(1, Math.round(4 * gross * weit * (p.idle && f === 3 ? 0.4 : 1)));
      P.el(lx + 0.5, ey + 0.5, 6 * gross, h, 'glutDim', true);
      if (h > 1) { P.el(lx + 0.5, ey + 0.5, 3, Math.min(h, 3), 'glut', true); P.line(lx, ey - Math.min(h, 3) + 1, lx, ey + Math.min(h, 3) - 1, 'k0', true); }
      P.set(r(lx - 2), r(ey - (h > 1 ? 1 : 0)), 'kern');
      // Glanz auf dem Glas: zwei helle Striche rechts oben (Gegenlicht)
      for (let k = 0; k < 4; k++) P.auf(r(lx + 6.5 * S) - (k >> 1), r(ly - 9 * S) + k, k < 2 ? 'r2' : 'r1');
      augen.push([r(lx - 2), r(ey)]);
    };
    return { gruppen, details, augen };
  },
};
