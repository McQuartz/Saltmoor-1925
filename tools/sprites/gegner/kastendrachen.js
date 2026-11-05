// Die Funkstation am Pol, zweiter Wächter: Der Kastendrachen. Mit ihm hob die Station von 1912 ihre Antenne in
// den Himmel, ein Hargrave-Drachen aus Stoff und Bambus mit zwei Zellen, an einem Draht statt an einer Schnur.
// Er fliegt noch, obwohl hier unten kein Wind geht. Am Draht hängt im Gurt der Funker, der ihn halten sollte,
// die Hände um den Draht, die Füße eine Elle über dem Boden; der Kopfhörer sitzt ihm noch auf den Ohren. Der
// Draht führt nicht zur Winde, sondern in ein Loch im Eis. Der Schwanz des Drachens ist der Papierstreifen des
// Schreibempfängers, und auf den Ecken der Zellen sitzt Elmsfeuer: Wer den Draht anfasst, bekommt den Strom
// (Kniff dornen). Er schwingt am Draht hin und her (pendel).
// Randlicht kaltes Schneelicht wie die ganze Station (Zone funkstation); die Wächter-Szene ist warm, das Blau
// kommt dort nicht vor. Dazu Röhrenorange als Elmsfeuer.
'use strict';
const LIB = require('../lib');
const H0 = require('./astronom').hilfe;
const KA = require('./hilfe/kanten');

module.exports = {
  id: 'kastendrachen', biom: 'funkstation', zone: 'funkstation', rang: 'waechter', w: 160, h: 180, fuss: [106, 176], kopf: [80, 6], rimBis: 178,
  todStart: 0.2,
  varianten: { kastendrachen: {} },
  // Silhouetten-Proben (nicht gebaut): ein flacher Rautendrachen (las sich als Spielzeug, und mit Schwanz als
  // Fisch); der Drachen ohne den Mann am Draht (nichts, was einen trifft, nur ein Gerät in der Luft).
  // Genommen: Kastendrachen mit zwei Zellen, Draht schräg zum Loch, der Funker hängt daran.
  proben: {
    probe_raute: { raute: true },
    probe_ohne_mann: { ohneMann: true },
  },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 160, H = 180, FY = 176;
    // kdx/kdy: Drachen versetzt, rot: Neigung, schw: Mann schwingt am Draht, funke: Blitz am Draht
    let kdx = 0, kdy = 0, rot = 0, schw = 0, funke = 0, fall = 0, flatter = f % 2;
    let gdy = 0; if (p.idle) { gdy = [0, 0, -1, -1][f]; flatter = [0, 0, 1, 1][f]; }
    if (p.angriff) { kdx = [6, 9, -10, -5][f]; kdy = [-5, -8, 8, 4][f]; rot = [0.12, 0.2, -0.22, -0.1][f]; schw = [3, 5, -8, -4][f]; funke = [0, 0, 1, 0.5][f]; }
    if (p.treffer) { kdx = [4, 2][f]; kdy = [-2, -1][f]; rot = 0.06; schw = 2; }
    if (p.tod) { fall = r(p.q * 60); rot = -p.q * 0.6; kdx = -p.q * 10; }
    // Drachen: Achse leicht ansteigend nach rechts hinten; zwei Zellen, Stäbe dazwischen
    const kc = [76 + kdx, 44 + kdy + fall];
    const ang = -0.32 + rot, ca = Math.cos(ang), sa = Math.sin(ang);
    const K = ([u, w]) => [kc[0] + u * ca - w * sa, kc[1] + u * sa + w * ca];
    const tiefe = [9, -8];
    const KT = ([u, w]) => { const q = K([u, w]); return [q[0] + tiefe[0], q[1] + tiefe[1]]; };
    const zellen = [[-48, -24], [22, 46]], hh = 20;
    const stoffHinten = [], stoffVorn = [], staebe = [], oeffnungen = [], deck = [];
    if (v.raute) stoffVorn.push(Pg([K([-40, 0]), K([0, -26]), K([40, 0]), K([0, 26])], null, { rd: 1 }));
    else {
      for (const [u0, u1] of zellen) {
        // hintere Wand und das offene Ende (man sieht in die Zelle hinein), darüber die Deckfläche
        stoffHinten.push(Pg([KT([u0, -hh]), KT([u1, -hh]), KT([u1, hh]), KT([u0, hh])], 'dunkel', { rd: 0.5 }));
        oeffnungen.push([K([u1, -hh]), KT([u1, -hh]), KT([u1, hh]), K([u1, hh])]);
        deck.push(Pg([K([u0, -hh]), K([u1, -hh]), KT([u1, -hh]), KT([u0, -hh])], null, { rd: 0.4, pf: 'flat' }));
        const fetzen = u1 > 0 ? [K([u1, hh]), K([u1 - 4, hh + 7 + flatter]), K([u1 - 8, hh + 2]), K([u1 - 13, hh + 9 - flatter]), K([u1 - 17, hh])] : [K([u1, hh]), K([u1 - 6, hh + 5 + flatter]), K([u1 - 11, hh])];
        stoffVorn.push(Pg([K([u0, -hh]), K([u1, -hh]), ...fetzen, K([u0, hh])], null, { rd: 0.8 }));
      }
      // Längsstäbe an den vier Ecken, quer die Spreizen
      for (const w of [-hh, hh]) { staebe.push(C(...K([-48, w]), ...K([48, w]), 1.2, 1.2, null)); staebe.push(C(...KT([-48, w]), ...KT([48, w]), 1, 1, 'dunkel')); }
      for (const [ua, ub] of [[-24, 22], [22, -24]]) staebe.push(C(...K([ua, -hh]), ...K([ub, hh]), 0.8, 0.8, null));
    }
    // Waage (Zaumleine) und Draht: vom Drachen schräg hinab in das Loch im Eis
    const zaum = K([-10, hh + 10]);
    const loch = [118, FY - 1];
    const leine = [C(...K([-34, hh]), ...zaum, 0.6, 0.6, null, { pf: 'flat' }), C(...K([20, hh]), ...zaum, 0.6, 0.6, null, { pf: 'flat' })];
    // der Mann: Hände am Draht, darunter hängt er im Gurt
    const hq = 0.05; const hd = [zaum[0] + (loch[0] - zaum[0]) * hq + schw, zaum[1] + (loch[1] - zaum[1]) * hq];
    const draht = [C(...zaum, hd[0], hd[1], 0.8, 0.8, null, { pf: 'flat' }), C(hd[0], hd[1], ...loch, 0.8, 0.8, null, { pf: 'flat' })];
    const mann = [];
    let kopfM = null;
    if (!v.ohneMann && !v.raute) {
      const sw = schw * 0.6;
      const sh = [hd[0] + 3 + sw, hd[1] + 17], hip = [sh[0] + 2 + sw * 0.5, sh[1] + 27];
      kopfM = [sh[0] - 1, sh[1] - 6];
      mann.push(
        ...glied([[sh[0] - 4, sh[1] + 1], [hd[0] - 4, hd[1] + 6], [hd[0] - 1, hd[1] + 1]], 2.8, 2.2, null),
        ...glied([[sh[0] + 4, sh[1]], [hd[0] + 5, hd[1] + 5], [hd[0] + 2, hd[1] - 1]], 2.6, 2, 'dunkel'),
        E(hd[0], hd[1], 2.6, 2.4, 'haut'),
        Pg([[sh[0] - 7, sh[1] - 1], [sh[0] + 8, sh[1] - 2], [hip[0] + 8, hip[1] + 4], [hip[0] - 8, hip[1] + 4]], null, { rd: 2.5 }),
        E(kopfM[0], kopfM[1] + 2, 5.2, 5.6, 'haut'),
        ...glied([[hip[0] - 4, hip[1] + 2], [hip[0] - 6 - sw, hip[1] + 16], [hip[0] - 4 - sw * 1.4, hip[1] + 30]], 3.4, 2.4, null),
        ...glied([[hip[0] + 4, hip[1] + 2], [hip[0] + 4 - sw * 0.6, hip[1] + 16], [hip[0] + 7 - sw, hip[1] + 29]], 3.2, 2.3, 'dunkel'),
        E(hip[0] - 5 - sw * 1.4, hip[1] + 33, 2.4, 4, 'dunkel'), E(hip[0] + 6 - sw, hip[1] + 32, 2.2, 3.8, 'dunkel'),
      );
    }
    // Schwanz: der Papierstreifen, in Schlaufen vom hinteren Ende abwärts geweht (obwohl kein Wind geht)
    const schwanz = [];
    if (!v.raute) { let pt = K([48, 4]); for (let i = 0; i < 10; i++) { const nx = pt[0] + 2 + Math.sin(i * 1.1 + flatter * 0.8) * 4, ny = pt[1] + 8; schwanz.push(C(pt[0], pt[1], nx, ny, 1.4, 1.4, null, { pf: 'flat' })); if (i % 3 === 1) schwanz.push(Pg([[nx - 5, ny - 3], [nx, ny], [nx - 5, ny + 3]], null, { rd: 0.3, pf: 'flat' }), Pg([[nx + 5, ny - 3], [nx, ny], [nx + 5, ny + 3]], null, { rd: 0.3, pf: 'flat' })); pt = [nx, ny]; } }
    // Loch im Eis: Rand aus Schneewall
    const wall = [Pg([[96, FY + 3], [102, FY - 4], [116, FY - 6], [132, FY - 4], [140, FY + 3]], null, { rd: 1.2 })];
    const gruppen = [
      { p: stoffHinten, k: 0.3 },                              // 0 Stoff hinten
      { p: staebe.filter(s => s.m === 'dunkel'), k: 0.2 },     // 1 Stäbe hinten
      { p: schwanz, k: 0.3, kante: true },                     // 2 Schwanz
      { p: stoffVorn, k: 0.5, kante: true },                   // 3 Stoff vorn
      { p: deck, k: 0, kante: true },                          // 4 Deckfläche
      { p: staebe.filter(s => s.m !== 'dunkel'), k: 0.2, kante: true }, // 5 Stäbe vorn
      { p: [...leine, ...draht], k: 0 },                       // 6 Draht
      { p: wall, k: 1.5 },                                     // 7 Schneewall
      { p: mann, k: 1, kante: true },                          // 8 Funker
    ];
    gruppen.forEach((g, i) => { g.anker = i === 8 ? [r(schw * 0.6), 0] : i === 7 ? [0, 0] : [r(kdx), r(kdy + fall)]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('funkstation'), { rimBis: 178 });
    const augen = [];
    const aus = p.tod && f >= 1;
    const details = P => {
      const ist = (x, y, g) => x >= 0 && y >= 0 && x < W && y < H && gid[r(y) * W + r(x)] === g;
      // Stoff: gespannt, Nähte quer (Bahnen), unten dunkler; Flicken aus Ölzeug
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (!ist(x, y, 3)) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const ux = (x + 0.5 - kc[0]) * ca + (y + 0.5 - kc[1]) * sa, wy = -(x + 0.5 - kc[0]) * sa + (y + 0.5 - kc[1]) * ca;
        if (Math.abs(wy) < 0.6 || Math.abs(wy - 8.5) < 0.5 || Math.abs(wy + 8.5) < 0.5) P.set(x, y, 'k0');
        else if (wy > 9) P.set(x, y, LIB.bay(x, y) < 0.5 ? 'k1' : 'k0');
        else if (wy < -9 && LIB.bay(x, y) < 0.35) P.set(x, y, 'k3');
        if (Math.abs(ux + 30) < 4 && wy > -6 && wy < 4) P.set(x, y, (x + y) % 2 ? 'k2' : 'papier');
      }
      KA.licht(P, staebe.filter(s => s.m !== 'dunkel'), { c: 'r1', c2: null });
      // Deckfläche: vom Licht oben getroffen, gedithert hell; offenes Ende: dunkel, innen die Kanten der Zelle
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, 4) && P.get(x, y) <= 4) P.set(x, y, LIB.bay(x, y) < 0.55 ? 'k3' : 'k2');
      for (const q of oeffnungen) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (!ist(x, y, 0) && !ist(x, y, 3)) continue; if (KA.drin([Pg(q, null)], x, y)) P.set(x, y, KA.drin([Pg(q, null, { rd: -1.2 })], x, y) ? 'k0' : 'k1'); }
      // Papierstreifen: hell, mit Morsestrichen (kurz, lang)
      let k = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, 2) && P.get(x, y) <= 4) { k++; P.set(x, y, (k % 9 < 2 || k % 9 === 5) ? 'k1' : (x + y) % 3 ? 'papier' : 'r1'); }
      // Draht: Kupfer, im Angriff läuft ein Funke hinab
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, 6)) P.set(x, y, (x + y) % 4 ? 'kupfer' : 'k3');
      if (funke && !aus) { const pts = [zaum, hd, loch]; for (let s2 = 0; s2 < 2; s2++) { const [a, b2] = [pts[s2], pts[s2 + 1]]; const n = Math.ceil(Math.hypot(b2[0] - a[0], b2[1] - a[1]) / 3); for (let i = 0; i < n; i++) { const q = i / n; const x = r(a[0] + (b2[0] - a[0]) * q + ((i % 2) ? 2 : -2) * funke), y = r(a[1] + (b2[1] - a[1]) * q); if (i % 2 === 0) P.set(x, y, funke > 0.8 && i % 4 === 0 ? 'kern' : i % 3 ? 'glutDim' : 'glut'); } } }
      // Elmsfeuer auf den Ecken der vorderen Zelle (das innere Licht), flackert nacheinander
      if (!aus && !v.raute) [K([-49, -hh]), KT([-49, -hh]), KT([49, -hh]), K([49, -hh])].forEach((pt, i) => { const [x, y] = pt.map(r); const an = p.idle ? (i + f) % 4 !== 0 : true; if (an) { P.glow(x + 0.5, y + 0.5, 5, 0.9); P.set(x, y, 'glut'); P.set(x, y - 1, i === 0 ? 'kern' : 'glut'); P.set(x + 1, y - 2, 'glut'); P.set(x, y - 3, 'glutDim'); P.set(x - 1, y - 1, 'glutDim'); if (funke) { P.set(x - 1, y - 3, 'glut'); P.set(x + 1, y - 4, 'glutDim'); } } if (i === 0) augen.push([x, y - 1]); });
      // Funker: Ölzeug, Gurt (Kupferschnalle), Kopfhörer; das Gesicht hängt nach vorn, Augen glimmen orange
      if (kopfM) {
        const gm = 8;
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (ist(x, y, gm) && P.get(x, y) <= 4) { if (!ist(x, y + 1, gm)) P.set(x, y, 'k0'); }
        const [mx, my] = kopfM.map(r);
        P.el(mx + 0.5, my + 2.5, 5.2, 5.6, 'k1', true); P.el(mx - 0.5, my + 3.5, 3.4, 3.4, 'k2', true);
        // Kopfhörer: Bügel über den Kopf, Muschel am Ohr, Kabel hängt herab
        for (let a = -2.8; a <= -0.2; a += 0.25) P.set(r(mx + Math.cos(a) * 6), r(my + 2 + Math.sin(a) * 6), 'kupfer');
        P.el(mx + 4.5, my + 3, 1.6, 2.4, 'k0', true); P.set(mx + 5, my + 2, 'kupfer');
        for (let i = 0; i < 16; i++) P.set(mx + 6 + r(Math.sin(i * 0.5) * 1.5), my + 5 + i, i % 4 ? 'kupfer' : 'k1');
        if (!aus) { P.glow(mx - 2, my + 4, 4, 0.7); P.set(mx - 3, my + 4, 'kern'); P.set(mx, my + 4, 'glut'); P.set(mx - 3, my + 3, 'glutDim'); augen.push([mx - 3, my + 4]); }
        const gy = r(kopfM[1] + 24); for (let x = mx - 8; x <= mx + 9; x++) if (ist(x, gy, gm)) { P.set(x, gy, 'k0'); P.set(x, gy - 1, 'k2'); } P.auf(mx, gy, 'kupfer');
      }
      // Loch: schwarz, darin blinkt es (Morse von unten)
      for (let x = 104; x < 132; x++) for (let y = FY - 4; y < FY + 1; y++) if (ist(x, y, 7) && Math.abs(x - 118) / 13 + Math.abs(y - (FY - 1)) / 3 < 1) P.set(x, y, 'k0');
      if (!aus) { const morse = p.idle ? [1, 1, 0, 1][f] : 1; if (morse) { P.set(116, FY - 1, 'glut'); P.set(117, FY - 1, f % 2 ? 'glut' : 'glutDim'); P.set(120, FY - 1, 'glutDim'); } }
      for (let x = 96; x < 142; x++) for (let y = FY - 8; y < H; y++) if (ist(x, y, 7) && P.get(x, y) <= 4 && !ist(x, y - 1, 7)) P.set(x, y, (x % 3) ? 'r1' : 'k3');
      H0.innenKanten(P, gid, gruppen, W, H, 'r1');
    };
    return { gruppen, details, augen, dy: gdy };
  },
};
