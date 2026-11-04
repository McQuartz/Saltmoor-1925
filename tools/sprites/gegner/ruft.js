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
function verlauf(P, bay, x0, y0, x1, y1, amt, an = [0, 0]) {
  const ax = Math.round(an[0]), ay = Math.round(an[1]);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { const c = P.get(x, y); if (c < 1 || c > 3) continue; const a = amt(x, y); if (a > bay(x - ax, y - ay)) P.set(x, y, c + 1); }
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
    ang = [-1.18, -2.3, -3.36, -2.6][f];
    hand = [[cx + 44, 104], [cx + 40, 96], [cx + 6, 112], [cx + 26, 104]][f];
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
    verlauf(P, A.bay, 0, 0, W - 1, BODEN, (x, y) => 0.75 - (y - top) / 150 + (x - cx) / 260, [lean, T]);
    verlauf(P, A.bay, 0, 0, W - 1, top + 40, (x, y) => 0.35 - (y - top) / 90, [lean, T]);
    bahnen.forEach(b => K.licht(P, [b], { c: 'k3', c2: null }));
    bahnen.forEach(b => K.licht(P, [b], { c: 'r1', c2: null, nur: (x, y) => y < 190 && (y - Math.round(T)) % 4 === 0 }));
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
    K.licht(P, [mantel, pel, ...kragen, kopf], { d: [-1, -1], c: 'r1', c2: null, nur: (x, y) => y < 200 && (x - Math.round(lean) + y - Math.round(T) + 300) % 3 !== 0 });
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
  const { E, C, Pg, r, glied, saum, pose } = A;
  const f = p.f, P0 = pose(p, { lunge: 10, fall: 30 });
  let lean = P0.lean; const T = P0.atem + P0.fall;
  const cx = 120, hem = p.idle ? [0, 1, 1, 0][f] : 0;
  // auf: wie weit die Flügel nach außen klappen; mw: halbe Breite des Schlunds
  let auf = 1, mw = 19 + (p.idle ? [0, 0, 1, 1][f] : 0);
  if (p.angriff) { auf = [0.8, 0.66, 1.2, 1.0][f]; mw = [14, 10, 34, 24][f]; lean = [3, 4, -14, -5][f]; }
  if (p.treffer) { auf = 0.9; mw = 11; }
  if (p.tod) { auf = 1 - p.q * 0.3; mw = Math.max(3, 15 - p.q * 14); }
  if (v.fluegelZu) auf = 0.45;
  const y0 = 70 + T, y1 = 208;
  const kante = (y, s) => cx + lean * (1 - (y - y0) / (y1 - y0)) + s * (Math.sin(Math.min(1, (y - y0) / (y1 - y0) * 1.15) * Math.PI) * mw + 4);
  // ein Flügel: s = -1 links, +1 rechts; außen klappt er hoch und weit auf
  const fluegel = s => {
    const g = s > 0 ? 1.08 : 1, o = x => cx + lean * 0.5 + s * (x * auf * g);
    const innen = []; for (let y = y0; y <= y1; y += 12) innen.push([kante(y, s), y]);
    const top = q => 78 + T - (q - 16) * 1.15 * (0.6 + 0.4 * auf);
    const aussen = [[o(16), top(16)], [o(26), top(26) + 4], [o(34), top(34) + 3], [o(42), top(42) + 6], [o(50), top(50) + 2], [o(58), top(58) + 3], [o(64), top(64)], [o(72), top(64) + 12], [o(70), 92], [o(62), 128], [o(66), 166], [o(62), 204]];
    const sm = saum(o(62), kante(y1, s), y1 + 2, 5, 6, s > 0 ? 7 : 4, hem); if (s < 0) sm.reverse();
    const pts = s < 0 ? [...innen, ...sm.reverse(), ...aussen.slice().reverse()] : [...innen, ...sm, ...aussen.slice().reverse()];
    return Pg(pts, null, { rd: 2 });
  };
  const fl = [fluegel(-1), fluegel(1)];
  // Fetzen: an den Außenkanten hängen Streifen herab, die sich im Takt bewegen
  const fetzen = [];
  for (const s of [-1, 1]) for (const [q, y, l] of [[71, 96, 30], [64, 132, 26], [68, 168, 22]]) {
    const g = s > 0 ? 1.08 : 1, x = cx + lean * 0.5 + s * q * auf * g, sw = (p.idle ? [0, 1, 1, 0][f] : p.angriff ? [1, 2, -2, 0][f] : 0) * s;
    fetzen.push(...glied([[x - s * 2, y], [x + s * 5 + sw, y + l * 0.5], [x + s * 4 + sw * 2, y + l]], 3.2, 0.8, null));
  }
  // Falten im Flügel: Bahnen, die sich zur Mitte oben verjüngen (wie ein Fächer, der aufgeht)
  const bahnen = [];
  for (const s of [-1, 1]) for (const [a, b, w] of [[28, 30, 6], [44, 44, 7], [58, 54, 5]]) {
    const g = s > 0 ? 1.08 : 1, X = q => cx + lean * 0.5 + s * q * auf * g, ty = 88 + T - (a - 16) * 1.15 * (0.6 + 0.4 * auf);
    bahnen.push(Pg([[X(a), ty], [X(a + w * 0.6), ty + 2], [X(b + w), 196], [X(b + w / 2), 202], [X(b), 196]], null, { rd: 1 }));
  }
  // Rachen hinter den Flügeln (dunkel), Zähne aus Pollern und Planken an den Kanten
  const rachen = [];
  for (let y = y0; y <= y1; y += 6) rachen.push(E((kante(y, -1) + kante(y, 1)) / 2, y, (kante(y, 1) - kante(y, -1)) / 2 + 3, 5, 'dunkel'));
  const zaehne = [];
  for (const s of [-1, 1]) for (let i = 0; i < 9; i++) {
    const y = y0 + 14 + i * 15 + (s > 0 ? 6 : 0); if (y > y1 - 10) continue;
    const x = kante(y, s), l = 5 + (i % 3) * 2 + mw * 0.12, ang = s < 0 ? -0.15 : Math.PI + 0.15;
    const gross = (i + (s > 0 ? 1 : 0)) % 3 === 0;
    zaehne.push(spitze(Pg, x + s * 1, y, ang + s * 0.25, l + (gross ? 6 : 3), gross ? 10 : 7, 0, 'haut'));
  }
  // Krone schwebt schief darüber, zwei Zacken abgebrochen
  const kx = cx + 8 + lean * 0.7, ky = 40 + T + (p.idle ? [0, 1, 2, 1][f] : 0) + (p.angriff ? [2, 4, -6, -2][f] : 0), kw = 0.32;
  const zack = [[-10, 12], [-6, 20], [-2, 6], [2, 24], [6, 7], [10, 16]];
  const rot = (dx, dy) => [kx + dx * Math.cos(kw) - dy * Math.sin(kw), ky + dx * Math.sin(kw) + dy * Math.cos(kw)];
  const krone = [Pg([rot(-13, 5), rot(13, 5), rot(12, -1), rot(-12, -1)], null, { rd: 0.6 }), ...zack.map(([dx, l]) => { const [x, y] = rot(dx, 0); return spitze(Pg, x, y, -Math.PI / 2 + kw + dx * 0.02, l, 4, 0.1); })];
  const spitzen = zack.map(([dx, l]) => { const [x, y] = rot(dx, 0); return [x + Math.cos(-Math.PI / 2 + kw) * (l - 1), y + Math.sin(-Math.PI / 2 + kw) * (l - 1)]; });
  // Arme: krallen links und rechts in den Boden
  const arm = s => { const g = s > 0 ? 1.08 : 1, X = q => cx + lean * 0.3 + s * q * auf * g; const kr = p.angriff && f === 2 ? -4 : 0;
    const hand = [X(98) + kr * s, BODEN - 4];
    return [...glied([[X(56), 128], [X(88), 158], hand], 6, 3.4, null), ...[-1, 0, 1, 2].map(k => C(hand[0], hand[1], hand[0] + s * (k * 4 + 2) - s * 6, BODEN, 1.4, 0.7, 'haut')), E(hand[0], hand[1], 4, 3.4, 'haut')]; };
  const arme = [...arm(-1), ...arm(1)];
  const gruppen = [
    { p: arme, k: 1.5, anker: [lean, T] },
    { p: fetzen, k: 1, anker: [lean, T] },
    { p: rachen, k: 3, anker: [lean, T], tone: -0.3 },
    { p: [fl[0]], k: 2, anker: [lean, T], tone: 0.1 },
    { p: [fl[1]], k: 2, anker: [lean, T], tone: 0.14 },
    ...bahnen.map((b, i) => ({ p: [b], k: 1, anker: [lean, T], tone: [0.02, 0.12, 0.2][i % 3] })),
    { p: zaehne, k: 0, tone: 0.2 },
    { p: krone, k: 0.8, tone: 0.12 },
  ];
  const augen = [];
  const details = P => {
    verlauf(P, A.bay, 0, 0, W - 1, BODEN, (x, y) => 0.7 - (y - y0) / 160 + Math.abs(x - cx) / 300, [lean, T]);
    bahnen.forEach(b => K.licht(P, [b], { c: 'k3', c2: null }));
    bahnen.forEach(b => K.licht(P, [b], { c: 'r1', c2: null, nur: (x, y) => y < 192 && (y - Math.round(T)) % 4 === 0 }));
    K.licht(P, [fl[1]], { d: [-1, 0], c: 'r1', c2: 'k3', nur: (x, y) => Math.abs(x - cx) < mw + 16 }); K.licht(P, [fl[0]], { d: [1, 0], c: 'k3', c2: null, nur: (x, y) => Math.abs(x - cx) < mw + 16 }); // Innenkanten zum Schlund
    K.licht(P, zaehne, { d: [0, -1], c: 'r1', c2: null }); K.schatten(P, zaehne, { d: [0, 1] });
    K.licht(P, krone, { c: 'r2', c2: 'r1' });
    K.licht(P, arme, { d: [-1, -1], c: 'r1', c2: null });
    K.licht(P, [...fl], { d: [-1, -1], c: 'r1', c2: null, nur: (x, y) => y < 200 && (x - Math.round(lean) + y - Math.round(T) + 300) % 3 !== 0 });
    // Schlund innen: Tiefe, gedithert, nach innen dunkel; ganz innen ein magenta Schein
    for (let y = y0 + 2; y < y1 - 2; y++) {
      const a = Math.round(kante(y, -1)) + 1, b = Math.round(kante(y, 1)) - 1, m = (a + b) / 2;
      for (let x = a; x <= b; x++) { const c = P.get(x, y); if (!c || c > 4 || K.drin(zaehne, x, y)) continue; const q = 1 - Math.abs(x - m) / Math.max(1, (b - a) / 2); P.set(x, y, q > 0.55 + A.bay(x, y) * 0.3 ? 'k0' : 'k1'); }
    }
    const sy = r(124 + T), sx = r((kante(124 + T, -1) + kante(124 + T, 1)) / 2);
    if (!P0.aus) {
      P.glow(sx + 0.5, sy + 10, Math.max(8, mw * 1.3), 0.7, 'magenta1', 'k1');
      // Laterne hängt im Schlund an ihrer Kette, sie brennt schwarz
      for (let y = y0 + 8; y < sy - 6; y++) P.auf(sx + ((y >> 1) & 1 ? 0 : 0), y, (y % 3) ? 'k3' : 'r1');
      for (let y = sy - 6; y <= sy + 8; y++) { const w = y < sy - 3 ? 2 : y > sy + 5 ? 2 : 4; for (let k = -w; k <= w; k++) P.auf(sx + k, y, Math.abs(k) === w ? 'r1' : 'k0'); }
      P.auf(sx, sy - 2, 'magenta2'); P.auf(sx - 1, sy, 'magenta2'); P.auf(sx + 1, sy - 1, 'magenta2'); P.auf(sx - 1, sy + 2, 'magenta2'); P.auf(sx + 1, sy + 1, 'magenta2'); P.auf(sx, sy + 3, 'magenta2'); P.auf(sx, sy, 'k0'); P.auf(sx, sy + 1, 'k0');
      augen.push([sx, sy]);
      // Augen tief im Schlund, versetzt, blinzeln nacheinander
      [[-1, 60], [1, 88], [-1, 150], [1, 176]].forEach(([s, yy], i) => { const y = r(yy + T), x = r((kante(y, -1) + kante(y, 1)) / 2 + s * Math.max(2, mw * 0.4)); if (p.idle && f === i) return; P.auf(x, y, 'kern'); P.auf(x + 1, y, 'glut'); augen.push([x, y]); });
      spitzen.forEach(([x, y], i) => { if (i !== 2 && i !== 4) P.auf(r(x), r(y) + 1, i === 3 ? 'kern' : 'magenta2'); });
      // Bullaugen auf den Flügeln, wie im Saum des Königs
      for (const [s, q, yy] of [[-1, 40, 176], [-1, 52, 120], [1, 42, 172], [1, 54, 116]]) {
        const bx = r(cx + lean * 0.5 + s * q * auf * (s > 0 ? 1.08 : 1)), by = yy;
        P.el(bx + 0.5, by + 0.5, 4.6, 4.6, 'k3', true); P.el(bx + 0.5, by + 0.5, 3.6, 3.6, 'k0', true); P.el(bx + 0.5, by + 0.5, 2.4, 2.4, 'magenta1', true);
        P.auf(bx, by, 'glut'); P.auf(bx, by - 1, 'kern');
        for (const [ox, oy] of [[3, -3], [4, -2], [2, -4]]) P.auf(bx + ox, by + oy, 'r1');
      }
    }
    for (let x = 0; x < W; x++) if (P.get(x, BODEN) && P.get(x, BODEN) < 5) P.auf(x, BODEN, 'k0');
  };
  return { gruppen, details, augen };
}

// ---------------------------------------------------------------------------
// P3: Das Auge
function auge(p, v, A) {
  const { E, C, Pg, r, glied, pose } = A;
  const f = p.f, P0 = pose(p, { lunge: 12, fall: 60 });
  let lean = P0.lean; const T = P0.fall + (p.idle ? [0, -1, -1, 0][f] : 0);
  const cx = 120;
  let cy = 90 + T, offen = 1, lang = 1;
  if (p.idle) offen = f === 3 ? 0.75 : 1;
  if (p.angriff) { offen = [0.55, 0.4, 1.3, 1.05][f]; lang = [0.8, 0.7, 1.35, 1.1][f]; lean = [3, 4, -14, -5][f]; cy += [-3, -6, 2, 0][f]; }
  if (p.treffer) offen = 0.35;
  if (p.tod) offen = Math.max(0.05, 1 - p.q * 1.6);
  const ex = cx + lean, RX = 44, RY = 22 * offen;
  // Lider: obere und untere Sichel; dazwischen der Augapfel
  const lid = (s) => {
    const aussen = bogen(ex, cy, RX + 8, 34, s < 0 ? Math.PI : 0, s < 0 ? 2 * Math.PI : Math.PI, 14);
    const innen = bogen(ex, cy, RX, Math.max(2, RY), s < 0 ? 2 * Math.PI : Math.PI, s < 0 ? Math.PI : 0, 14);
    if (s > 0) { aussen.forEach(q => { q[1] = cy + (q[1] - cy) * 0.72; }); }
    return Pg([...aussen, ...innen], null, { rd: 1.5 });
  };
  const oben = lid(-1), unten = lid(1);
  const ball = E(ex, cy, RX, Math.max(2, RY), 'haut', { pf: 'dome', tone: 0.15 });
  // Wimpernkranz aus Kronenzacken: oben lang, unten kurz, ungleich
  const zacken = [];
  const kr = v.strahlen ? Array.from({ length: 16 }, (_, i) => [i / 16 * 2 * Math.PI - Math.PI / 2, 22 + (i % 3) * 8]) :
    [[-2.9, 18], [-2.6, 26], [-2.3, 32], [-2.0, 22], [-1.75, 36], [-1.5, 28], [-1.25, 40], [-1.0, 24], [-0.75, 34], [-0.45, 22], [-0.2, 16], [0.35, 10], [0.9, 12], [2.3, 12], [2.75, 10]];
  for (const [a, l] of kr) {
    const sx = ex + Math.cos(a) * (RX + 5), sy = cy + Math.sin(a) * (a < 0 ? 30 : 24);
    const a2 = a + (p.angriff ? [0.15, 0.2, -0.25, -0.1][f] : 0) * Math.sign(Math.cos(a) || 1);
    zacken.push(spitze(Pg, sx, sy, a2, l * lang, 5, 0.18 * Math.sign(-Math.cos(a))));
  }
  // Ketten und Fäden hängen bis zum Boden; an der mittleren der Anker
  const ketten = [], glieder = [];
  const ky = cy + 22, sw = p.idle ? [0, 1, 1, 0][f] : p.angriff ? [1, 2, -3, -1][f] : 0;
  for (const [ox, len, anker] of [[-22, BODEN - ky - 10, false], [-4, BODEN - ky - 30, true], [16, BODEN - ky - 4, false]]) {
    const pts = []; for (let i = 0; i <= 8; i++) { const q = i / 8; pts.push([ex + ox + Math.sin(q * 2.4 + ox) * 2 + sw * q * q * 3 - lean * q * 0.6, ky + q * len]); }
    for (let i = 0; i < 8; i++) for (let k = 0; k < 3; k++) { const q = (i + k / 3) / 8, x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k / 3, y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k / 3; glieder.push(((i * 3 + k) & 1) ? E(x, y, 1.4, 2.8, null) : E(x, y, 2.6, 1.8, null)); void q; }
    if (anker) { const [ax, ay] = pts[8]; ketten.push(C(ax, ay, ax, ay + 18, 1.8, 1.6, null), C(ax - 7, ay + 4, ax + 7, ay + 4, 1.3, 1.3, null), ...glied([[ax - 12, ay + 10], [ax - 8, ay + 18], [ax, ay + 20], [ax + 8, ay + 18], [ax + 12, ay + 10]], 1.8, 1.8, null), spitze(Pg, ax - 12, ay + 12, -1.9, 7, 4), spitze(Pg, ax + 12, ay + 12, -1.24, 7, 4), E(ax, ay - 2, 3, 3, null)); }
  }
  const faeden = []; for (const [ox, l] of [[-34, 70], [-12, 92], [8, 60], [28, 84], [38, 50]]) faeden.push(...glied([[ex + ox, ky - 2], [ex + ox + Math.sin(ox + sw) * 3, ky + l * 0.5], [ex + ox + Math.sin(ox * 2 + sw) * 5 - lean * 0.4, ky + l]], 1.6, 0.5, null));
  // Krone liegt am Boden (links), umgekippt
  const kroneB = [Pg([[30, BODEN], [56, BODEN - 1], [55, BODEN - 6], [31, BODEN - 5]], null, { rd: 0.5 }), ...[[33, 9], [38, 14], [43, 6], [48, 12], [53, 8]].map(([x, l], i) => spitze(Pg, x, BODEN - 5, -Math.PI / 2 - 0.5 + i * 0.05, l, 3.6, -0.1))];
  const gruppen = [
    { p: faeden, k: 0, anker: [0, T] },
    { p: [...glieder, ...ketten], k: 0.6, anker: [0, T] },
    { p: zacken, k: 0.8, anker: [0, T], tone: 0.1 },
    { p: [ball], k: 0, anker: [0, T] },
    { p: [oben], k: 1, anker: [0, T], tone: 0.08 },
    { p: [unten], k: 1, anker: [0, T] },
    { p: kroneB, k: 0.8, tone: 0.15 },
  ];
  const augen = [];
  const details = P => {
    verlauf(P, A.bay, 0, 0, W - 1, BODEN, (x, y) => 0.55 - Math.abs(y - cy) / 90, [0, T]);
    K.licht(P, [oben], { c: 'r1', c2: 'k3' }); K.licht(P, [unten], { d: [1, -1], c: 'k3', c2: null });
    K.licht(P, zacken, { c: 'r2', c2: 'r1' }); K.licht(P, zacken, { d: [-1, -1], c: 'r1', c2: null });
    K.licht(P, [oben, unten, ...zacken], { d: [-1, -1], c: 'r1', c2: null, nur: (x, y) => (x + y - Math.round(T) + 300) % 3 !== 0 });
    K.schatten(P, [oben], { d: [0, 1] }); K.licht(P, kroneB, { c: 'r2', c2: 'r1' });
    // Glieder: kleines Loch in jedem liegenden Glied
    glieder.forEach(g => { if (g.rx > g.ry) P.auf(r(g.x), r(g.y), 'k0'); });
    if (!P0.aus && RY > 3) {
      // Iris: dunkles Magenta, ein Ring Glut, senkrechte Pupille, zwei Glanzlichter
      const ir = Math.min(15, RY * 0.95), ix = r(ex - 4), iy = r(cy);
      P.el(ix + 0.5, iy + 0.5, ir, Math.min(ir, RY), 'glutDim', true);
      P.el(ix + 0.5, iy + 0.5, ir * 0.66, Math.min(ir * 0.66, RY), 'glut', true);
      P.el(ix + 0.5, iy + 0.5, ir * 0.5, Math.min(ir * 0.5, RY), 'magenta1', true);
      for (let y = iy - Math.min(r(ir * 0.8), r(RY)); y <= iy + Math.min(r(ir * 0.8), r(RY)); y++) { const w = Math.abs(y - iy) < ir * 0.4 ? 1 : 0; for (let k = -w; k <= w; k++) P.auf(ix + k, y, 'k0'); }
      P.auf(ix - 4, iy - 4, 'kern'); P.auf(ix - 3, iy - 4, 'kern'); P.auf(ix - 4, iy - 3, 'kern'); P.auf(ix + 4, iy + 3, 'magenta2');
      augen.push([ix - 4, iy - 4], [ix, iy]);
      // Lichtpunkte an den längsten Zacken (blinken)
      zacken.forEach((z, i) => { if (i % 3 === (p.idle ? f % 3 : 0)) { const q = z.v[2]; P.auf(r(q[0]), r(q[1]), 'magenta2'); } });
    } else if (!P0.aus) { P.line(ex - RX + 4, cy, ex + RX - 4, cy, 'magenta1', true); P.auf(r(ex - 4), r(cy), 'kern'); augen.push([r(ex - 4), r(cy)]); }
  };
  return { gruppen, details, augen };
}
