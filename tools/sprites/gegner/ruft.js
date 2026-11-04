// Finale Pforte: Das, was ruft (Auftrag 2, M7, neu gezeichnet). Konzept: docs/auftrag-2/biome/pforte-neu.md
// Eine Öffnung, die Formen annimmt, um verstanden zu werden. Jede Phase ist ein schlechterer Versuch,
// wie etwas auszusehen, das du aus dem Hafen kennst.
// P1 König: Glocke aus Mantel mit Pelerine und Fächerkragen, Zackenkrone, Bootshaken als Zepter;
//    unter der Krone kein Gesicht, nur ein senkrechter Spalt mit einem Auge. Bullaugen im Saum.
// P2 Schlund: Der Mantel klappt wie zwei Türflügel auf, dazwischen ein hoher Schlund mit Zähnen aus
//    Pollern und Planken, darin hängt eine Laterne, die schwarz brennt. Die Krone schwebt schief darüber.
// P3 Auge: nur noch das Auge zwischen zwei Lidern, die Kronenzacken sind sein Wimpernkranz,
//    darunter hängen Ankerketten bis zum Boden. Die Krone liegt am Boden.
// Gegenlicht kommt im Finale zweimal: wie immer von oben rechts, dazu aus dem Spalt in der Wasserwand
// hinter ihm; darum hat er auch links oben eine dünnere Randlichtkante (hilfe/kanten.js).
'use strict';
const K = require('./hilfe/kanten');

const W = 240, H = 220, BODEN = 214;
// Punkte auf einer Ellipse von a0 bis a1 (Bogenmaß)
const bogen = (cx, cy, rx, ry, a0, a1, n) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]; });
// Verlauf: hellt Körperpixel gedithert um eine Stufe auf, wo amt(x,y) über der Bayer-Schwelle liegt
// (Licht, das von oben auf Stoff fällt; macht große dunkle Flächen lesbar, ohne Verlauf im Bild)
function verlauf(P, bay, x0, y0, x1, y1, amt) {
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const c = P.get(x, y); if (c < 1 || c > 3) continue; const a = amt(x, y); if (a > bay(x, y)) P.set(x, y, c + 1); }
}
// Spitze (Dreieck mit leichter Biegung) von (x,y) in Richtung ang, Länge l, Basisbreite b
function spitze(Pg, x, y, ang, l, b, knick = 0, m = null) {
  const dx = Math.cos(ang), dy = Math.sin(ang), nx = -dy, ny = dx, a2 = ang + knick;
  const mx = x + dx * l * 0.55, my = y + dy * l * 0.55;
  return Pg([[x + nx * b / 2, y + ny * b / 2], [mx + nx * b * 0.22, my + ny * b * 0.22], [mx + Math.cos(a2) * l * 0.45, my + Math.sin(a2) * l * 0.45], [mx - nx * b * 0.22, my - ny * b * 0.22], [x - nx * b / 2, y - ny * b / 2]], m, { rd: 0.3 });
}

module.exports = {
  id: 'ruft', biom: 'pforte', zone: 'pforte', rang: 'boss', w: W, h: H, fuss: [118, BODEN], kopf: [118, 6], rimBis: BODEN - 2,
  varianten: {
    ruft_p1: { phase: 1, kopf: [118, 10] },
    ruft_p2: { phase: 2, kopf: [120, 22] },
    ruft_p3: { phase: 3, kopf: [120, 26] },
  },
  // Silhouetten-Skizzen (je Phase eine zweite Variante, verworfen; siehe pforte-neu.md)
  skizzen: {
    p1_ohne_kragen: { phase: 1, ohneKragen: true, haken: 'gerade' },
    p2_geschlossen: { phase: 2, fluegelZu: true },
    p3_strahlen: { phase: 3, strahlen: true },
  },
  anim: { idle: { n: 4, fps: 3, loop: true }, angriff: { n: 4, fps: 8 }, treffer: { n: 2, fps: 10 }, tod: { n: 6, fps: 6 } },
  todStart: 0.3,
  bild(p, v, A) {
    const ph = v.phase;
    if (ph === 1) return koenig(p, v, A);
    if (ph === 2) return schlund(p, v, A);
    return auge(p, v, A);
  },
};

// ---------------------------------------------------------------------------
// P1: Der König
function koenig(p, v, A) {
  const { E, C, Pg, r, glied, saum, pose } = A;
  const f = p.f, P0 = pose(p, { lunge: 8, fall: 34 });
  let lean = P0.lean, T = P0.atem + P0.fall;
  const hem = p.idle ? [0, 1, 1, 0][f] : 0;
  const cx = 116;
  // Bootshaken: Winkel der Stange (nach oben = -PI/2), Hand
  let ang = -Math.PI / 2 - 0.06, hand = [cx + 46, 120];
  if (p.angriff) {
    ang = [-1.18, -2.05, -3.36, -2.6][f];
    hand = [[cx + 44, 104], [cx + 34, 84], [cx + 6, 112], [cx + 26, 104]][f];
    lean = [2, 1, -9, -4][f];
  }
  if (p.treffer) { ang += 0.12; }
  if (p.tod) { ang = -Math.PI / 2 + Math.min(1.2, p.q * 1.6); hand = [cx + 46, 120 + P0.fall]; }
  const hx = hand[0] + (p.angriff ? 0 : lean), hy = hand[1] + (p.angriff ? 0 : T);
  const top = 76 + T;
  // Mantel: Glocke bis zum Boden, der Saum zerfetzt
  const mantel = Pg([[cx - 24 + lean, top], [cx + 22 + lean, top - 2], [cx + 38 + lean * 0.6, top + 36], [cx + 56 + lean * 0.3, 168], [cx + 68, 204],
    ...saum(cx + 68, cx - 64, 212, 11, 5, 3, hem), [cx - 64, 204], [cx - 52 + lean * 0.3, 162], [cx - 38 + lean * 0.6, top + 34]], null, { rd: 2 });
  // Faltenbahnen auf dem Mantel (je eine eigene Fläche: Kontaktschatten = Faltenkante)
  const bahnen = [
    [[-30, 118, -10], [-60, 208, -36]], [[-6, 120, 8], [-24, 210, 2]], [[12, 118, 26], [14, 210, 40]], [[30, 116, 38], [46, 206, 62]],
  ].map(([[a0, y0, a1], [b0, y1, b1]]) => Pg([[cx + a0 + lean * 0.5, y0 + T], [cx + a1 + lean * 0.5, y0 + T], [cx + b1, y1], [cx + (b0 + b1) / 2, y1 + 3], [cx + b0, y1]], null, { rd: 1 }));
  // Pelerine: Schulterumhang mit gezacktem Saum, zweite Lage über dem Mantel
  const pel = Pg([[cx - 20 + lean, top - 3], [cx + 18 + lean, top - 5], [cx + 31 + lean, top - 1], [cx + 39 + lean, top + 8], [cx + 43 + lean, top + 20], [cx + 45 + lean, top + 34],
    ...saum(cx + 45 + lean, cx - 45 + lean, top + 40, 7, 7, 9, hem * 0.5), [cx - 45 + lean, top + 32], [cx - 42 + lean, top + 16], [cx - 35 + lean, top + 5]], null, { rd: 3 });
  // Fächerkragen hinter dem Kopf: Rippen wie Spanten, gewellter Rand
  const kpts = [];
  if (!v.ohneKragen) { const n = 12; for (let i = 0; i <= n; i++) { const a = Math.PI * (1.06 + 0.88 * i / n), R = i % 2 ? 26 : 33; kpts.push([cx + lean + Math.cos(a) * R * 1.1, top - 8 + Math.sin(a) * R * 0.9]); } }
  const kragen = kpts.length ? [Pg([[cx - 10 + lean, top + 2], ...kpts, [cx + 10 + lean, top + 2]], 'dunkel', { rd: 1 })] : [];
  // Kopf: hoch und schmal, ohne Gesicht
  const kx = cx + lean, ky = top - 18;
  const kopf = E(kx, ky, 10, 15, 'haut', { pf: 'bevel', tone: 0.35 });
  const hals = C(kx, ky + 10, kx, top + 4, 6, 8, null);
  // Krone: Reif und sieben ungleiche Zacken (Spanten eines Bootes)
  const kr = ky - 14, zack = [[-11, 15, -0.25], [-7, 23, -0.12], [-3, 12, -0.05], [1, 29, 0.02], [5, 13, 0.06], [9, 21, 0.14], [12, 16, 0.26]];
  const krone = [Pg([[kx - 14, kr + 6], [kx + 14, kr + 5], [kx + 13, kr - 1], [kx - 13, kr]], null, { rd: 0.6 }),
    ...zack.map(([dx, l, a]) => spitze(Pg, kx + dx, kr, -Math.PI / 2 + a, l, 4.2, a * 0.8))];
  const spitzen = zack.map(([dx, l, a]) => [kx + dx + Math.cos(-Math.PI / 2 + a * 1.8) * (l - 1), kr + Math.sin(-Math.PI / 2 + a * 1.8) * (l - 1)]);
  // Bootshaken: Stange, Spitze und Haken
  const dx = Math.cos(ang), dy = Math.sin(ang), L1 = 94, L2 = p.angriff ? 26 : BODEN - hy;
  const sx = hx + dx * L1, sy = hy + dy * L1, ex = hx - dx * L2, ey = hy - dy * L2;
  const stange = [C(ex, ey, sx, sy, 2.2, 1.8, 'dunkel', { pf: 'flat' })];
  const nx = -dy, ny = dx; // Haken zeigt zur Seite (nach links, wenn die Stange senkrecht steht)
  const haken = v.haken === 'gerade' ? [C(sx, sy, sx + dx * 10, sy + dy * 10, 1.6, 0.6, null)] :
    [...glied([[sx, sy], [sx + dx * 16, sy + dy * 16]], 2.6, 0.8, null),
      ...glied([[sx - dx * 3, sy - dy * 3], [sx + nx * 9 + dx * 1, sy + ny * 9 + dy * 1], [sx + nx * 13 + dx * 8, sy + ny * 13 + dy * 8], [sx + nx * 9 + dx * 14, sy + ny * 9 + dy * 14]], 2.6, 0.9, null),
      E(sx - dx * 4, sy - dy * 4, 3.6, 3.6, null), C(sx - dx * 12, sy - dy * 12, sx - dx * 6, sy - dy * 6, 3, 3, null)];
  // Arme: hinten der Arm zum Haken (weiter Ärmel), vorn ein langer Arm mit zu langen Fingern
  const schR = [cx + 24 + lean, top + 8], schL = [cx - 26 + lean, top + 10];
  const armR = glied([schR, [cx + 42 + lean * 0.5, (schR[1] + hy) / 2 + 6], [hx + 2, hy + 2]], 7, 4, null);
  const handR = [E(hx, hy, 4.2, 4.6, 'haut'), C(hx - 3, hy - 2, hx - 6, hy + 4, 1.2, 1, 'haut')];
  const elL = [cx - 58 + lean * 0.4, top + 50], haL = [cx - 66 + lean * 0.3, top + 84 + (p.idle ? [0, 0, 1, 1][f] : 0)];
  const armL = [...glied([[schL[0] - 8, schL[1] + 14], elL, haL], 6, 3.2, null), E(haL[0], haL[1] + 1, 3.6, 4, 'haut')];
  const finger = [-2.5, -0.8, 0.9, 2.6].map((o, i) => C(haL[0] + o, haL[1] + 3, haL[0] + o * 1.8 - 2, haL[1] + 24 + (i === 1 || i === 2 ? 7 : 0) + (p.angriff && f === 2 ? -6 : 0), 1.3, 0.6, 'haut'));
  const hinten = p.angriff && f < 2; // beim Ausholen ist der Haken hinter dem Kopf
  const gruppen = [
    { p: hinten ? [...stange, ...haken] : [], k: 0 },
    { p: armR, k: 2, anker: [lean, T] },
    { p: [mantel], k: 3, anker: [lean, T], tone: 0.12 },
    ...bahnen.map((b, i) => ({ p: [b], k: 1, anker: [lean, T], tone: [0.04, 0.16, 0.08, 0.2][i] })),
    { p: kragen, k: 1, anker: [lean, T] },
    { p: [pel], k: 2, anker: [lean, T], tone: 0.05 },
    { p: [hals], k: 2, anker: [lean, T] },
    { p: [kopf], k: 0, anker: [lean, T] },
    { p: krone, k: 0.8, anker: [lean, T], tone: 0.12 },
    { p: [...armL, ...finger], k: 1.5, anker: [lean, T] },
    { p: hinten ? [] : [...stange, ...haken], k: 0 },
    { p: handR, k: 1, anker: [lean, T] },
  ];
  const augen = [];
  const details = P => {
    // Binnenlicht: Falten- und Lagenkanten fangen das Gegenlicht oben rechts
    // Licht fällt von oben auf den Stoff: oben heller, zum Saum hin dunkel; rechts (Lichtseite) mehr
    verlauf(P, A.bay, 0, 0, W - 1, BODEN, (x, y) => 0.75 - (y - top) / 150 + (x - cx) / 260);
    verlauf(P, A.bay, 0, 0, W - 1, top + 40, (x, y) => 0.35 - (y - top) / 90);
    bahnen.forEach(b => K.licht(P, [b], { c: 'k3', c2: null }));
    bahnen.forEach(b => K.licht(P, [b], { c: 'r1', c2: null, nur: (x, y) => y < 190 && y % 4 === 0 }));
    K.licht(P, [pel], { c: 'r1', c2: 'k3', nur: (x, y) => y < top + 44 });
    K.schatten(P, [pel], { d: [0, 2] });
    if (kragen.length) {
      K.licht(P, kragen, { c: 'r1', c2: null });
      // Spanten im Kragen
      for (let i = 1; i < kpts.length - 1; i += 2) P.line(kx + (kpts[i][0] - kx) * 0.35, top - 6 + (kpts[i][1] - top + 6) * 0.35, kpts[i][0] - (kpts[i][0] - kx) * 0.1, kpts[i][1] - (kpts[i][1] - top + 8) * 0.1, 'k3', true);
    }
    K.licht(P, krone, { c: 'r2', c2: 'r1' });
    K.licht(P, [kopf], { c: 'r1', c2: 'k3' }); K.schatten(P, [kopf], { d: [-1, 1] });
    K.licht(P, [...armL], { c: 'r1', c2: null });
    // zweites Gegenlicht von links oben (aus dem Spalt hinter ihm): dünn, gestrichelt
    K.licht(P, [mantel, pel, ...kragen, kopf], { d: [-1, -1], c: 'r1', c2: null, nur: (x, y) => y < 200 && (x + y) % 3 !== 0 });
    // Saum: dunkle Kante, wo der Mantel den Boden berührt
    for (let x = cx - 66; x <= cx + 70; x++) P.auf(x, BODEN - 1, 'k0');
    if (!P0.aus) {
      // Gesicht: ein senkrechter Spalt, darin das Auge
      const zu = p.idle && f === 3 ? 1 : 0, ax = r(kx), ay = r(ky + 1);
      P.glow(ax + 0.5, ay + 0.5, 9, 0.8, 'glutDim', 'k3');
      for (let y = ay - 10; y <= ay + 10; y++) { const w = Math.round(Math.sin((y - ay + 10) / 20 * Math.PI) * (2.4 - zu)); for (let k = -w; k <= w; k++) P.set(ax + k, y, 'k0'); }
      if (!zu) { P.set(ax, ay - 2, 'glut'); P.set(ax, ay + 2, 'glut'); P.set(ax - 1, ay, 'glut'); P.set(ax + 1, ay, 'glut'); P.set(ax - 1, ay - 1, 'magenta2'); P.set(ax + 1, ay + 1, 'magenta1'); }
      P.set(ax, ay - 1, 'kern'); P.set(ax, ay, zu ? 'glut' : 'kern'); P.set(ax, ay + 1, 'glut');
      augen.push([ax, ay]);
      // Lichter an den Kronenspitzen (blinken nacheinander)
      spitzen.forEach(([x, y], i) => { if (i % 2 === 0 || (p.idle && i === 2 * f + 1)) { P.auf(r(x), r(y) + 1, i === 3 ? 'kern' : 'magenta2'); if (i === 3) augen.push([r(x), r(y) + 1]); } });
      // Bullaugen im Saum: dahinter sieht etwas heraus
      [-44, -18, 10, 38].forEach((o, i) => {
        const bx = r(cx + o + (i - 1.5) * 2), by = 192 - Math.abs(o) * 0.12 | 0;
        P.el(bx + 0.5, by + 0.5, 4.6, 4.6, 'k3', true); P.el(bx + 0.5, by + 0.5, 3.6, 3.6, 'k0', true); P.el(bx + 0.5, by + 0.5, 2.4, 2.4, 'magenta1', true);
        const offen = !(p.idle && (f + i) % 4 === 3);
        if (offen) { P.auf(bx, by, 'glut'); P.auf(bx + 1, by, 'glut'); P.auf(bx, by - 1, 'kern'); } else P.line(bx - 1, by, bx + 2, by, 'k0', true);
        for (const [ox, oy] of [[3, -3], [4, -2], [4, -1], [2, -4], [1, -4]]) P.auf(bx + ox, by + oy, 'r1');
      });
    }
  };
  return { gruppen, details, augen };
}

// ---------------------------------------------------------------------------
// P2: Der Schlund
function schlund(p, v, A) {
  return koenig(p, { phase: 1 }, A);
}
// P3: Das Auge
function auge(p, v, A) {
  return koenig(p, { phase: 1 }, A);
}
