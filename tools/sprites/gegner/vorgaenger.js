// Der, der vor dir kam (Ufer unten, Elite im Vorraum). Eine Gestalt in deinen Kleidern, von hinten,
// den Kopf halb über die linke Schulter gedreht, so dass nur ein Auge zu sehen ist. Der Mantel ist
// durchnässt und klebt an ihm, die Hosenbeine sind bis über die Knie voller Sand, die Füße stecken
// im Sand. Keine Mütze, kein Werkzeug, nichts, woran man eine Figur erkennt: Er passt zu jedem Run.
// Falsches Detail: Das Wasser tropft von ihm nach oben. In der rechten Faust glimmt etwas, das er
// mitgenommen hat.
'use strict';
module.exports = {
  id: 'vorgaenger', biom: 'ufer', zone: 'ufer', w: 128, h: 160, fuss: [64, 155], kopf: [60, 14], rimBis: 150,
  // Elite: bis 128 × 160. pruefen.js kennt die Größe „elite“ noch nicht, darum läuft das Sheet unter
  // der Größenregel der Wächter (bis 160 × 180); im Spiel zählt nur der Rang aus foes (elite).
  rang: 'waechter',
  varianten: {
    vorgaenger: { kragen: 1, faust: true },
  },
  // verworfene Silhouette: frontal, gesenkter Kopf, beide Arme hängen (las sich als Ertrunkener)
  skizzen: { skizze_frontal: { kragen: 0, faust: false, frontal: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, saum, glied } = A;
    const f = p.f;
    // dreh: wie weit das Gesicht über die Schulter kommt (0 Rücken, 1 Profil), arm: linker Arm holt aus
    let nick = 0, lean = 0, atem = 0, dreh = 0.45, hem = 0, armL = 0, fall = 0, tropf = 0, glimm = 1, sink = 0;
    if (p.idle) { atem = 0; nick = [0, 0, 1, 1][f]; dreh = 0.45; hem = [0, 0, 1, 1][f]; tropf = f; glimm = [1, 0.8, 1.15, 0.9][f]; }
    if (p.angriff) { lean = [2, 3, -6, -2][f]; dreh = [0.6, 0.85, 1, 0.7][f]; armL = [0.4, 1, 2, 1.2][f]; hem = [1, 2, -2, 0][f]; tropf = f + 4; glimm = [1.2, 1.4, 1.7, 1.2][f]; }
    if (p.treffer) { lean = [3, 2][f]; dreh = [0.25, 0.3][f]; atem = 1; tropf = f + 2; glimm = 0.6; }
    if (p.tod) { sink = r(p.q * 22); dreh = Math.max(0, 0.45 - p.q); lean = r(p.q * 2); glimm = Math.max(0, 1 - p.q * 2); fall = r(p.q * 4); }
    const cx = 64, T = atem + fall;
    const ox = lean; // Oberkörper neigt sich, Füße bleiben im Sand
    const sy = 44 + T; // Schulterhöhe
    // --- Beine: Hose, nass, unten voller Sand; die Füße stecken im Sand
    const kn = [cx - 8 + r(ox * 0.3), 126], kn2 = [cx + 9 + r(ox * 0.3), 126];
    const beinL = glied([[cx - 7 + r(ox * 0.6), 104 + T], kn, [cx - 9, 150]], 6, 4.6, null);
    const beinR = glied([[cx + 8 + r(ox * 0.6), 104 + T], kn2, [cx + 10, 150]], 6, 4.6, null);
    const ferse = [E(cx - 9, 151, 4.5, 3, 'haut'), E(cx + 10, 151, 4.5, 3, 'haut')];
    const huegel = [E(cx - 10, 155, 10 - sink * 0.1, 3.4 + sink * 0.12, null, { pf: 'flat' }), E(cx + 11, 155, 10, 3.4 + sink * 0.12, null, { pf: 'flat' })];
    // --- Mantel: lang, schwer vom Wasser, klebt an den Schultern, Saum zerfasert und tropft
    const hy = 128 + T * 0.3; // Saum
    const mantel = Pg([
      [cx - 9 + ox, sy - 7], [cx + 10 + ox, sy - 7], [cx + 17 + ox, sy - 3], [cx + 19 + ox, sy + 4], [cx + 17 + r(ox * 0.7), sy + 30],
      [cx + 17 + r(ox * 0.5), 92 + T], [cx + 23 + r(hem * 0.5), hy - 4],
      ...saum(cx + 24 + r(hem * 0.5), cx - 22 + r(hem * 0.3), hy, 7, 4, 5, hem),
      [cx - 16 + r(ox * 0.5), 92 + T], [cx - 16 + r(ox * 0.7), sy + 30], [cx - 18 + ox, sy + 4], [cx - 16 + ox, sy - 3],
    ], null, { rd: 1.2 });
    const schultern = E(cx + ox, sy + 1, 18, 6, null, { pf: 'bevel' });
    // Kragen hochgeschlagen, Rückengurt mit zwei Knöpfen, Rückenschlitz unten
    const kragen = v.kragen ? Pg([[cx - 11 + ox, sy - 5], [cx - 8 + ox, sy - 10], [cx + 9 + ox, sy - 10], [cx + 12 + ox, sy - 5], [cx + 4 + ox, sy - 2], [cx - 4 + ox, sy - 2]], null, { rd: 0.8 }) : null;
    const gurt = C(cx - 11 + r(ox * 0.6), 88 + T, cx + 12 + r(ox * 0.6), 88 + T, 2, 2, null, { pf: 'bevel' });
    // Falten: von den Schulterblättern schräg zur Taille, unter dem Gurt fächern sie zum Saum
    const falten = [
      [-11, sy + 8, -5, 84], [11, sy + 8, 6, 84],
      [-16, 96, -19, hy - 3], [0, 100, 1, hy - 1], [16, 96, 20, hy - 3],
    ].map(([x1, y1, x2, y2], i) => C(cx + x1 + r(ox * (i < 2 ? 0.9 : 0.5)), y1 + (i < 2 ? 0 : T), cx + x2 + r(ox * (i < 2 ? 0.6 : 0.3)), y2, 0.7, i < 2 ? 1.2 : 1.4, 'dunkel'));
    // der nasse Stoff klebt an den Beinen: zwei Grate, wo die Beine ihn durchdrücken
    const grate = [[-8, 96, -9, hy - 2], [9, 96, 10, hy - 2]].map(([x1, y1, x2, y2]) => C(cx + x1 + r(ox * 0.5), y1 + T, cx + x2 + r(ox * 0.3), y2, 3, 3.6, null, { tone: 0.3 }));
    const schlitz = C(cx + 1 + r(ox * 0.4), 104 + T, cx + 1 + r(hem * 0.3), hy, 0.6, 0.9, 'dunkel');
    // --- Kopf: von hinten, nasses Haar klebt; das Gesicht dreht sich über die linke Schulter
    const kx = cx - 1 + ox - r(dreh * 2), ky = 23 + T + nick + r(sink * 0.2);
    const hals = C(cx + ox, sy - 6, kx + 1, ky + 8, 4.6, 4, 'haut');
    const kopf = E(kx, ky - 2, 8.2, 9.2, 'dunkel', { pf: 'bevel', tone: 0.15 });
    const nacken = E(kx + 1, ky + 8, 5, 3.4, 'haut', { tone: 0.1 });
    const ohr = E(kx + 8 - r(dreh * 3), ky + 2, 1.8, 3, 'haut');
    const wange = E(kx - 6 - dreh * 2, ky + 3, 2.4 + dreh * 1.6, 5.5, 'haut', { pf: 'bevel' });
    const nase = dreh > 0.55 ? [Pg([[kx - 8 - dreh * 3, ky + 1], [kx - 10.5 - dreh * 3, ky + 5], [kx - 7.5 - dreh * 3, ky + 6]], 'haut', { rd: 0.3 })] : [];
    // --- Arme: Ärmel schwer und nass, Hände hängen; die linke holt im Angriff aus und schlägt nach hinten
    const shL = [cx - 17 + ox, sy + 3], shR = [cx + 17 + ox, sy + 3];
    let elL, haL;
    if (armL === 0) { elL = [cx - 24 + ox, sy + 27]; haL = [cx - 25 + r(ox * 0.6), sy + 50]; }
    else if (armL < 1.5) { elL = [cx - 28 + ox - armL * 2, sy + 22 - armL * 8]; haL = [cx - 30 + ox - armL * 2, sy + 4 - armL * 14]; }
    else { elL = [cx - 32 + ox, sy + 16]; haL = [cx - 44 + ox, sy + 34]; }
    const aermelL = glied([shL, elL, haL], 5.4, 4.2, null);
    const handL = [E(haL[0], haL[1] + 3, 3, 4, 'haut'), ...glied([[haL[0] - 1, haL[1] + 5], [haL[0] - 2, haL[1] + 9]], 1, 0.8, 'haut'), ...glied([[haL[0] + 1, haL[1] + 6], [haL[0] + 1, haL[1] + 10]], 1, 0.8, 'haut')];
    const elR = [cx + 24 + r(ox * 0.8), sy + 27], haR = [cx + 25 + r(ox * 0.5), sy + 50];
    const aermelR = glied([shR, elR, haR], 5.4, 4.2, null);
    const faust = E(haR[0], haR[1] + 4, 3.6, 4, 'haut', { pf: 'bevel' });
    // Seetang über der rechten Schulter, hängt den Rücken hinunter
    const tang = glied([[cx + 6 + ox, sy - 5], [cx + 10 + ox, sy + 4], [cx + 9 + r(ox * 0.8), sy + 16], [cx + 12 + r(ox * 0.7), sy + 27]], 1.2, 0.7, 'dunkel');
    const armVorne = armL >= 1.5; // beim Schlag liegt der Arm vor dem Mantel
    const gruppen = [
      { p: [...huegel], k: 0, noRim: true },
      { p: beinL, k: 1 }, { p: beinR, k: 1 },
      { p: ferse, k: 0, noRim: true },
      { p: [mantel, schultern], k: 3, anker: [ox, T] },
      { p: falten, k: 0, noRim: true },
      { p: grate, k: 0.5, noRim: true },
      { p: [schlitz], k: 0, noRim: true },
      { p: [gurt], k: 0 },
      { p: tang, k: 0.5 },
      { p: [hals], k: 1 },
      { p: kragen ? [kragen] : [], k: 1, anker: [ox, T] },
      { p: [nacken], k: 0, anker: [ox, T] },
      { p: [kopf, wange, ...nase], k: 1.6, anker: [ox, T] },
      { p: [ohr], k: 0 },
      { p: [...aermelL], k: 1.5, anker: [ox, T] },
      { p: [...aermelR], k: 1.5, anker: [ox, T] },
      { p: [...handL], k: 0.5 },
      { p: [faust], k: 0 },
    ];
    const augen = [];
    const H = (x, y, s) => { const q = Math.sin(x * 12.9898 + y * 78.233 + s * 37.719) * 43758.5453; return q - Math.floor(q); };
    const details = P => {
      // Nasses Haar: Strähnen kleben schräg nach unten, Glanz oben (Licht von oben aus dem Wasser)
      for (let i = -5; i <= 5; i += 3) { P.line(kx + i, ky - 5 + Math.abs(i) * 0.3, kx + i * 0.8 - 1, ky + 3, 'k2', true); P.line(kx + i + 1, ky - 4, kx + i * 0.8, ky + 4, 'k0', true); }
      for (let i = -5; i <= 6; i += 2) P.auf(kx + i, ky - 10 + Math.abs(i) * 0.3, i > 0 ? 'r1' : 'k3');
      P.auf(kx + 3, ky - 10, 'r2'); P.auf(kx + 4, ky - 10, 'r2');
      // nasse Haarspitzen kleben im Nacken
      for (let i = -3; i <= 4; i += 2) { P.auf(kx + i, ky + 6, 'k0'); P.auf(kx + i + 1, ky + 7, 'k1'); }
      P.auf(kx + 7 - r(dreh * 3), ky, 'r1'); P.auf(kx + 7 - r(dreh * 3), ky + 1, 'k3');
      // Oberlicht: Schultern und Rücken oben heller (das Licht kommt durchs Wasser von oben), gedithert
      for (let y = r(sy - 8); y < sy + 34; y++) for (let x = cx - 30; x <= cx + 30; x++) { const c = P.get(x, y); if (c < 1 || c > 3) continue; const a = 0.75 * (1 - (y - sy + 8) / 42) * (1 - Math.abs(x - cx - ox) / 40); if (a > A.bay(x - r(ox), y - T)) P.set(x, y, c + 1); }
      // Kragen und Schultern: Wasserglanz auf den Kanten, auch links (das Licht kommt von oben)
      for (let x = r(cx - 18 + ox); x <= cx - 6 + ox; x++) if (P.get(x, r(sy - 3)) && (x & 1)) P.auf(x, r(sy - 3 + (x < cx - 13 + ox ? 1 : 0)), 'r1');
      for (let x = r(cx + 6 + ox); x <= cx + 18 + ox; x++) P.auf(x, r(sy - 3 + (x > cx + 13 + ox ? 1 : 0)), x % 3 ? 'r1' : 'r2');
      // nasser Stoff glänzt entlang der Faltengrate (kurze Lichtstriche)
      [[-8, -9], [9, 10]].forEach(([a, b], i) => { for (let y = 98 + T; y < hy - 3; y += 2) { const q = (y - 96 - T) / (hy - 98 - T), x = cx + a + (b - a) * q + r(ox * 0.4); if (H(i, y, 3) > 0.35) P.auf(x + 2, y, H(i, y, 4) > 0.8 ? 'r2' : 'r1'); P.auf(x - 2, y, 'k1'); } });
      // Ärmel: Glanz auf der Oberseite des Unterarms, Falten in der Armbeuge
      [[shL, elL, haL], [shR, elR, haR]].forEach(([s0, e0, h0], i) => { for (let k = 2; k < 9; k++) { const q = k / 10, x = e0[0] + (h0[0] - e0[0]) * q, y = e0[1] + (h0[1] - e0[1]) * q; if (k % 2) P.auf(x + (i ? 2 : 2), y, 'r1'); } P.auf(e0[0] - 1, e0[1], 'k0'); P.auf(e0[0], e0[1] + 1, 'k0'); P.auf(e0[0] + 1, e0[1] - 1, 'k0'); });
      for (let y = sy + 12; y < 84 + T; y += 4) { P.auf(cx - 9 + ox + (y % 8 ? 0 : 1), y, 'k3'); P.auf(cx + 11 + ox, y + 2, 'r1'); }
      // zweites, kühles Licht von links unten (der nasse Sand wirft es zurück): 1 px an den linken Kanten, gedithert
      for (let y = r(sy - 4); y < 150; y++) for (let x = 1; x < 127; x++) { const c = P.get(x, y); if (!c || c > 4 || P.get(x - 1, y)) continue; if ((x + y + T) % 2 === 0 || y > hy) P.set(x, y, y > 128 ? 'k3' : 'r1'); }
      // Rückennaht vom Kragen zum Gurt, Schulternähte
      for (let y = r(sy - 1); y < 86 + T; y++) { P.auf(cx + 1 + r(ox * 0.8), y, 'k0'); if (y % 3 === 0) P.auf(cx + 2 + r(ox * 0.8), y, 'k3'); }
      for (const sgn of [-1, 1]) for (let k = 0; k < 5; k++) P.auf(cx + sgn * (12 + k) + ox, sy - 1 + k, 'k1');
      for (let x = r(cx - 10 + ox * 0.6); x <= cx + 11 + ox * 0.6; x++) P.auf(x, r(86 + T), x % 2 ? 'k3' : 'r1');
      // Gurt: zwei Knöpfe aus Horn, einer fängt Licht
      const gx = r(cx + r(ox * 0.6)), gy = r(88 + T);
      P.auf(gx - 7, gy, 'k0'); P.auf(gx - 7, gy - 1, 'r1'); P.auf(gx + 8, gy, 'k0'); P.auf(gx + 8, gy - 1, 'r2');
      // Sand an den Beinen: von unten dicht bis über die Knie, Körner einzeln
      for (let y = 112; y < 156; y++) for (let x = cx - 18; x <= cx + 20; x++) {
        const c = P.get(x, y); if (!c || c > 4) { if (c === 5 && y > 128 && H(x, y, 9) > 0.55) P.set(x, y, 'sand'); continue; }
        const d = (y - 112) / 44, h = H(x, y, 1);
        if (y > 132 && h < d * 0.55) P.set(x, y, h < d * 0.16 ? 'sand' : 'k3');
        else if (h < d * 0.18) P.set(x, y, 'k2');
      }
      // Sandhügel um die Füße: hell oben, gekörnt
      for (let y = 150; y < 160; y++) for (let x = cx - 22; x <= cx + 22; x++) { const c = P.get(x, y); if (!c) continue; if (y > 151 + sink * 0.12 && (c <= 4)) P.set(x, y, H(x, y, 4) < 0.2 ? 'sand' : H(x, y, 5) < 0.6 ? 'k3' : 'k2'); }
      // Gesicht: ein Auge über der Schulter, Lid schwer; im Angriff ein zweites, halb
      if (dreh > 0.2 && (!p.tod || f < 1)) {
        const ex = r(kx - 5 - dreh * 3), ey = r(ky + 1);
        P.set(ex, ey, 'kern'); P.auf(ex + 1, ey, 'glutDim'); P.glow(ex + 0.5, ey + 0.5, 4, 0.6); P.auf(ex, ey - 1, 'k0'); P.auf(ex + 1, ey - 1, 'k0');
        augen.push([ex, ey]);
        P.auf(ex - 1, ey + 4, 'k1'); P.auf(ex, ey + 5, 'k1'); // Mundwinkel
        if (dreh > 0.9) { P.set(ex + 4, ey, 'glutDim'); P.set(ex + 5, ey, 'glut'); augen.push([ex + 5, ey]); }
      }
      // Faust: zwischen den Fingern glimmt, was er mitgenommen hat
      if (glimm > 0.05 && (!p.tod || f < 3)) {
        const fx = r(haR[0]), fy = r(haR[1] + 5);
        P.glow(fx + 0.5, fy + 0.5, 5 * glimm + 1, 0.8);
        P.set(fx, fy, glimm > 1.1 ? 'kern' : 'glut'); P.auf(fx - 1, fy + 1, 'glutDim'); P.auf(fx + 1, fy - 1, 'glutDim');
        P.auf(fx - 1, fy - 2, 'k0'); P.auf(fx + 1, fy + 2, 'k0'); P.auf(fx - 2, fy, 'k1');
        augen.push([fx, fy]);
      }
      // Das Wasser tropft nach oben: von Saum, Fingern und Ärmeln steigen Tropfen auf
      const quellen = [[kx - 2, ky - 10], [kx + 3, ky - 10], [cx - 21, hy + 2], [cx - 10, hy + 4], [cx + 3, hy + 3], [cx + 16, hy + 4], [cx + 25, hy], [haL[0] - 2, haL[1] + 10], [haR[0] + 2, haR[1] + 8], [cx - 26 + ox, sy + 30], [cx + 26 + ox, sy + 36]];
      if (!p.tod || f < 2) quellen.forEach(([x, y], i) => {
        for (let k = 0; k < 2; k++) {
          const lang = i < 2 ? 26 : 18, ph = (tropf * 3 + i * 5 + k * 9) % lang, yy = y - 2 - ph, xx = x + (i % 2 ? 1 : -1) * (ph > 9 ? 1 : 0);
          if (P.get(r(xx), r(yy))) continue;
          P.set(xx, yy, ph < 6 ? 'see' : ph < lang - 6 ? 'r1' : 'k3');
          if (ph < 4) P.set(xx, yy + 1, 'r1');
        }
      });
    };
    return { gruppen, details, augen, sinken: sink };
  },
};
