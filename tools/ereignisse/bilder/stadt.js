// Ereignisbilder 160 × 90 · Die namenlose Stadt (data/events.json mit biom "stadt" und stadt_plus.json).
// Palette der Stadt (prototype/js/scenes/world/stadt.js): roter Stein in sehr breiten, flachen Quadern,
// Ocker und Sand, Randlicht rostrot. Licht: die Lampen der Expedition (warm), sonst tiefes Rotschwarz.
'use strict';

const STEIN = ['#070303', '#100707', '#1a0d0a', '#26130e', '#341b13', '#44241a', '#583022', '#6e3e2a', '#8a5034'];
const SAND = ['#2a160c', '#3e2214', '#5a3420', '#7a4a2a', '#9a6438', '#c08a50'];
const RAND = ['#a0402a', '#ffc0a0'];
const WARM = ['#a06a20', '#ffd27a'];
const DUNKEL = ['#000000', '#030101', '#060202', '#0a0404'];

// ---------- eigene Bausteine ----------
// Quader in unmenschlichen Proportionen: sehr breit und flach (Muster für K.form / Feld)
function quader(B, zh, bw, s) {
  return (x, y) => { const row = Math.floor(y / zh), xx = x + B.hash(row, 0, s || 1) * bw; return (y % zh === 0 ? -.6 : 0) + ((Math.floor(xx) % bw) === 0 ? -.5 : 0) + (B.hash(Math.floor(xx / bw), row, 5) - .5) * .4; };
}
// Wand aus breiten Quadern als Feld, mit Lichtfunktion lic(x,y) 0..1
function steinwand(K, x0, y0, x1, y1, lic, o) {
  o = o || {}; const { B } = K, q = quader(B, o.zh || 7, o.bw || 34, K.seed);
  K.feld(x0, y0, x1, y1, STEIN, (x, y) => (o.maske && !o.maske(x, y)) ? -1 : (o.basis === undefined ? .12 : o.basis) + lic(x, y) * .7 + q(x, y) * .12 + (B.fbm(x * .1, y * .1, K.seed, 2) - .5) * .06);
}
// Sandboden in Aufsicht mit Lichtfunktion
function sandboden(K, y0, y1, lic, o) {
  o = o || {}; const { B } = K;
  K.feld(o.x0 || 0, y0, o.x1 || 160, y1, SAND, (x, y) => (o.maske && !o.maske(x, y)) ? -1 : .02 + lic(x, y) * .85 + (B.fbm(x * .05, y * .3, K.seed + 3, 2) - .5) * .12 + (o.tf ? o.tf(x, y) : 0));
}
const lichtF = (lx, ly, r, ov, ex) => (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * (ov || 1)) / r), ex || 1.4);
// Kriechende Gestalt mit zu vielen Gelenken (Relief): auf allen vieren, Kopf tief vorn,
// jedes Glied mit einem Knick zu viel (Knie hoch über dem Rücken). Fuß bei yb, Länge etwa 1.4*h.
function kriecher(m, r, x, yb, h, dir, o) {
  o = o || {}; const s = h / 26, X = u => x + dir * u * s, Y = v => yb - v * s, d = Math.max(.9, 1.5 * s);
  const j = () => r.f(-1.2, 1.2) * s;
  m.kap(X(7), Y(14), X(25), Y(18 + (o.buckel || 0)), 3.6 * s, 2.8 * s);           // Rumpf
  m.ell(X(9), Y(15), 4.2 * s, 3.4 * s);                                            // Becken
  m.kap(X(26), Y(17), X(31), Y(13), 1.6 * s, 1.4 * s);                            // Hals, gesenkt
  m.ell(X(33), Y(12.5), 3.4 * s, 3 * s);                                           // Kopf
  // Hinterglieder: Hüfte -> Knie hoch -> zurück -> Fuß
  for (const k of [0, 1]) { const v = k * 4 + j(); m.pfad([[X(7), Y(14)], [X(3 + v), Y(24 - k * 2)], [X(-1 + v), Y(9)], [X(2 + v), Y(.5)]], d, d * .8); }
  // Vorderglieder: Schulter -> Ellbogen hoch -> vor -> Hand flach
  for (const k of [0, 1]) { const v = k * 5 + j(); m.pfad([[X(24), Y(16)], [X(27 + v * .5), Y(25 - k * 2)], [X(31 + v), Y(10)], [X(35 + v), Y(.5)]], d, d * .8); m.kap(X(35 + v), Y(.5), X(37.5 + v), Y(.5), d * .8, d * .6); }
  return m;
}

module.exports = {
  biom: 'stadt',
  bilder: {
    // Eine große, flache Trommel in einer Halle mit hüfthoher Decke, das Fell bebt, ringsum liegt der Sand in feinen Kreisen.
    stadt_trommel(K) {
      const { B } = K;
      const lx = 22, ly = 78;   // Laterne vorn links am Boden
      const L1 = lichtF(lx + 34, ly - 8, 120, 1.5);
      // Decke: eine einzige flache Platte, sehr niedrig, mit breiten Quadern
      steinwand(K, 0, 0, 160, 36, (x, y) => L1(x, y) * .55 + (y > 30 ? .12 : 0), { zh: 6, bw: 44 });
      const dk = K.maske(); dk.rect(0, 33, 160, 3); K.form(dk, 0, { k: STEIN.slice(1, 8), r: RAND, ton: 2.4, fase: 0, rand: 1, L: [0, 1], verlaufX: -1 });
      // Tiefe der Halle unter der Platte: Dunkel, gedrungene Pfeilerstümpfe
      // Boden: Sand, unter der Platte nach hinten ins Schwarze
      sandboden(K, 36, 90, (x, y) => L1(x, y) * Math.pow(Math.max(0, Math.min(1, (y - 36) / 46)), 1.3), { tf: (x, y) => y < 42 ? -.2 : 0 });
      // Ringe im Sand um die Trommel: fein, nur nahe der Trommel
      const tx = 90, ty = 66;
      for (let y = 46; y < 90; y++) for (let x = 0; x < 160; x++) {
        const d = Math.hypot((x - tx) / 4.8, y - ty); if (d < 8.5 || d > 22) continue;
        if (d % 2.6 < .6 && B.bay(x, y) < 1 - (d - 8) / 16) K.set(x, y, L1(x, y) > .3 ? SAND[4] : SAND[2]);
        else if (d % 2.6 > 1.3 && d % 2.6 < 1.9 && B.bay(x, y) < .5) K.set(x, y, SAND[0]);
      }
      // Die Trommel: flacher Zylinder, Zarge mit Schnürung, Fell oben
      const rx = 32, ry = 6.5, hz = 6;
      const zarge = K.maske(); zarge.ell(tx, ty, rx, ry); zarge.rect(tx - rx, ty - hz, 2 * rx + 1, hz); zarge.ell(tx, ty - hz, rx, ry);
      K.form(zarge, 0, { k: ['#0a0504', '#160a07', '#24120c', '#361c12', '#4c2a1a'], r: RAND, ton: 2, fase: 1, rand: 2, schatten: 2, lichtVon: [lx, ly - 10], verlaufX: -1.4, muster: (x, y) => ((Math.round(x - tx + (y - ty) * 1.5) % 6 + 6) % 6 === 0 ? 1 : 0) });
      const fell = K.maske(); fell.ell(tx, ty - hz, rx - 1.5, ry - 1.2);
      const FELL = ['#2a1a10', '#46301c', '#6a4c2e', '#8e6a44', '#b08a5c', '#d0aa78'];
      K.form(fell, 0, { k: FELL, r: [], ton: 3.2, fase: 0, rand: 0, verlaufX: -2.6, muster: (x, y) => { const d = Math.hypot((x - tx) / 4.8, (y - ty + hz)); return (d % 1.6 < .5 ? .45 : 0); } });
      // springende Sandkörner über dem bebenden Fell
      for (let i = 0; i < 14; i++) { const x = tx + K.r.f(-24, 18), y = ty - hz - K.r.f(1, 5); K.set(x, y, K.r() < .5 ? SAND[5] : SAND[4]); }
      K.laterne(lx, ly + 6, 1, { hof: 70, staerke: .8 });
      K.vignette(.65, { cx: 84, cy: 58 });
    },

    // Eine niedrige Grabkammer im Lampenlicht, ein langer, gewickelter Körper mit zu vielen Gelenken, daneben ein Notizbuch.
    stadt_grabkammer(K) {
      const { B } = K;
      const lx = 138, ly = 70;
      const L1 = lichtF(lx - 20, ly - 6, 130, 1.3);
      steinwand(K, 0, 0, 160, 56, (x, y) => L1(x, y) * .8, { zh: 8, bw: 46 });
      const dk = K.maske(); dk.rect(0, 0, 160, 12); K.form(dk, 0, { k: STEIN.slice(0, 6), r: RAND, ton: 1.4, fase: 0, rand: 0, L: [0, 1], muster: quader(B, 6, 50, 4) });
      sandboden(K, 56, 90, (x, y) => L1(x, y) * .9);
      // Steinbank, sehr breit und flach
      const bank = K.maske(); bank.rect(10, 52, 116, 4);
      const vorn = K.maske(); vorn.rect(12, 56, 112, 12);
      K.form(vorn, 0, { k: STEIN.slice(1, 8), r: RAND, ton: 2, fase: 1, rand: 1, schatten: 2, verlaufX: 1.6, muster: quader(B, 5, 40, 7) });
      K.form(bank, 0, { k: STEIN.slice(2, 9), r: RAND, ton: 2.6, fase: 0, rand: 1, verlaufX: 1.6 });
      // Der gewickelte Körper: lang, mit zu vielen Gelenken (Wülste und Einschnürungen), Binden schräg
      const k = K.maske(), x0 = 18, x1 = 118, n = 11;
      for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; k.ell(x, 47 - (i % 2) * .5, 4.2, 4.6); }
      k.kap(x0, 47, x1, 47, 3, 3);
      k.ell(x1 + 5, 46, 4.5, 4);     // Kopfende, falsch herum gewickelt
      const BINDE = ['#1e140c', '#3a2a1a', '#5e4630', '#86684a', '#a88a66', '#c8aa84'];
      K.form(k, 0, { k: BINDE, r: ['#c8aa84', '#ffe0b8'], ton: 2.2, fase: 1, rand: 2, schatten: 1, verlauf: .7, verlaufX: 1.4, lichtVon: [lx, ly - 20],
        muster: (x, y) => { const g = ((x - x0) / ((x1 - x0) / n)) % 1; return (g < .14 || g > .9 ? -1.1 : 0) + (((x + y * 1.4) % 5 + 5) % 5 < 1 ? -.45 : 0) + ((x - y * 1.4) % 7 === 0 && x > 104 ? -.6 : 0); } });
      // Notizbuch auf dem Boden vor der Lampe, aufgeschlagen
      const nb = K.maske(); nb.poly([[100, 80], [104, 74], [114, 73], [115, 75], [116, 73], [126, 74], [128, 80], [115, 80]]);
      K.form(nb, 0, { k: ['#2a1c14', '#5a4636', '#9a8268', '#d4bc98', '#f0dcc0'], r: ['#f0dcc0', '#fff0d8'], ton: 2.7, fase: 0, rand: 1, lichtVon: [lx, ly - 4], muster: (x, y) => (x === 115 ? -1.5 : 0) });
      for (let i = 0; i < 3; i++) { K.schrift(105, 75 + i * 2, 114, '#3a2a1e', { min: 1, max: 3 }); K.schrift(117, 75 + i * 2, 126, '#3a2a1e', { min: 1, max: 3 }); }
      K.linie(118, 82, 130, 84, '#3a2a1a'); K.set(130, 84, '#8a7a60');
      // Die Lampe der Expedition
      K.laterne(lx, ly + 12, 1.25, { hof: 64, staerke: .85 });
      K.vignette(.7, { cx: 90, cy: 52 });
    },

    // Eine riesige Halle, in der der Sand in langen Fahnen in einen Abgrund gezogen wird, davor eine kleine Gestalt mit flatterndem Mantel.
    stadt_wind(K) {
      const { B } = K;
      const fx = 42, fy = 74;   // Gestalt am Rand des Abgrunds, Laterne in der Hand
      const ax = 104, ay = 70, arx = 46, ary = 11;   // der Abgrund im Boden
      // Halle: Rotschwarz, riesige Pfeiler bis in die Dunkelheit
      K.fuell(['#020101', '#060202', '#0c0504', '#140806', '#1e0c08'], (x, y) => .12 + (y / 90) * .3 + (B.fbm(x * .03, y * .05, K.seed, 2) - .5) * .1);
      // fernes Rotglühen hinter den Pfeilern, damit sie als Silhouetten stehen
      K.licht(100, 30, 90, '#4a1c0c', 1, { oval: .7, exp: 1.2 });
      for (const [px, w] of [[22, 22], [72, 16], [130, 20], [160, 14]]) {
        const p = K.maske(); p.rect(px - w / 2, 0, w, 58); K.form(p, 0, { k: ['#040202', '#080303', '#0e0505', '#160807'], r: ['#4a1c10', '#6a2a18'], ton: 1.4, fase: 0, rand: 1, muster: quader(B, 7, 40, 3), L: [.2, -1] });
      }
      // Boden aus Sand, nach hinten dunkler, Laternenlicht um die Gestalt
      const LF = lichtF(fx + 6, fy - 4, 80, 1.6);
      sandboden(K, 56, 90, (x, y) => LF(x, y) * .85 + (y - 56) * .004);
      // Abgrund: schwarzes Oval, der hintere Rand als Kante
      const ab = K.maske(); ab.ell(ax, ay, arx, ary);
      K.feld(ax - arx - 1, ay - ary - 1, ax + arx + 2, ay + ary + 2, DUNKEL, (x, y) => ab.has(x, y) ? Math.max(0, .5 - Math.hypot((x - ax) / arx, (y - ay + 6) / ary) * .6) : -1);
      for (let x = ax - arx; x <= ax + arx; x++) { const q = (x - ax) / arx, y = Math.round(ay + Math.sqrt(Math.max(0, 1 - q * q)) * ary); K.set(x, y, LF(x, y) > .2 ? STEIN[7] : STEIN[4]); K.set(x, y + 1, STEIN[2]); }
      // Sandfahnen: in Spiralen über den Boden und hinab in den Abgrund
      for (let i = 0; i < 34; i++) {
        const a0 = K.r.f(0, 6.28), R0 = K.r.f(1.3, 2.6), lang = K.r.f(.6, 1);
        for (let t = 0; t < lang; t += .004) {
          const a = a0 + t * 2.2, R = B.lerp(R0, .55, t), x = ax + Math.cos(a) * arx * R, y = ay + Math.sin(a) * ary * R * (R > 1 ? 1.3 : 1) + (R < 1 ? (1 - R) * 18 : 0);
          if (y < 50 || x < -4 || x > 164) continue;
          if (B.bay(x, y) > .75 - t * .5) continue;
          const l = LF(x, y), innen = R < 1;
          K.set(x, y, innen ? (l > .2 ? SAND[2] : SAND[1]) : l > .45 ? SAND[5] : l > .2 ? SAND[4] : SAND[2]);
        }
      }
      // Die Gestalt: Mantel zum Abgrund hin gezogen, Hut, Laterne in der linken Hand
      const fig = K.figurMaske(fx, fy, 24, { kopf: 'hut', blick: 1, neig: -1.5, arme: [[fx - 6, fy - 11], [fx + 5, fy - 9]] });
      fig.poly([[fx + 2, fy - 19], [fx + 8, fy - 17], [fx + 20, fy - 15], [fx + 28, fy - 11], [fx + 19, fy - 10], [fx + 25, fy - 6], [fx + 13, fy - 6], [fx + 6, fy - 4]]);
      K.form(fig, 0, { ton: .8, rand: 1, lichtVon: [fx - 7, fy - 10] });
      K.laterne(fx - 7, fy - 5, .75, { hof: 46, staerke: .8, ohne: fig, buegel: false });
      K.kante(fig, fx - 7, fy - 9, 22, WARM);
      K.vignette(.6, { cx: 84, cy: 60 });
    },

    // Eine niedrige, viel zu breite Türöffnung im roten Stein, daran angelehnt eine geteilte Messlatte, deren obere Hälfte versetzt ist, als stünde sie im Wasser.
    stadt_messlatte(K) {
      const { B } = K;
      const lx = 146, ly = 74;
      const L1 = lichtF(lx - 40, ly - 10, 160, 1.2);
      steinwand(K, 0, 0, 160, 76, L1, { zh: 9, bw: 52 });
      sandboden(K, 76, 90, (x, y) => L1(x, y) * .9);
      // Die Türöffnung: niedrig und viel zu breit, schwarz; Sturz und Schwelle
      const tx0 = 26, tx1 = 130, ty0 = 46, ty1 = 76;
      const st = K.maske(); st.rect(tx0 - 6, ty0 - 7, tx1 - tx0 + 12, 7); st.rect(tx0 - 6, ty1, tx1 - tx0 + 12, 3);
      st.rect(tx0 - 6, ty0, 6, ty1 - ty0); st.rect(tx1, ty0, 6, ty1 - ty0);
      K.form(st, 0, { k: STEIN.slice(1, 9), r: RAND, ton: 2.4, fase: 1, rand: 2, schatten: 2, verlaufX: 1.2, muster: quader(B, 7, 60, 9) });
      K.feld(tx0, ty0, tx1, ty1, DUNKEL, (x, y) => Math.max(0, .45 - (y - ty0) * .03) + (x > tx1 - 22 ? (x - tx1 + 22) * .02 : 0));
      // Die Messlatte: rot und dunkel geteilt, Messingkappen; die obere Hälfte versetzt (wie im Wasser gebrochen)
      const fussX = 38, fussY = ty1 - 1, kopfX = 33, kopfY = 6, bruch = .5, vers = 4, seg = 10;
      const P = (t, dx) => [B.lerp(fussX, kopfX, t) + dx, B.lerp(fussY, kopfY, t)];
      const ROT = ['#3a0e08', '#6a1c10', '#a8341e', '#d0502c'], SCHW = ['#060303', '#0e0606', '#180a08', '#26120c'];
      for (let i = 0; i < seg; i++) {
        const t0 = i / seg, t1 = (i + 1) / seg, dx = t0 >= bruch ? vers : 0;
        const m = K.maske(), a = P(t0, dx), b = P(t1, dx); m.poly([[a[0] - 2, a[1]], [a[0] + 2, a[1]], [b[0] + 2, b[1]], [b[0] - 2, b[1]]]);
        K.form(m, 0, { k: i % 2 ? SCHW : ROT, r: RAND, ton: 2.6, fase: 0, rand: 1, lichtVon: [lx, ly] });
      }
      const kap = (t, dx, h) => { const m = K.maske(), p = P(t, dx); m.rect(p[0] - 2.5, p[1] - h / 2, 5, h); K.form(m, 0, { k: ['#3a2a10', '#6a5020', '#a8823e', '#e6c88a'], r: ['#e6c88a', '#fff0c0'], ton: 2.4, fase: 0, rand: 1, lichtVon: [lx, ly] }); };
      kap(0, 0, 2); kap(1, vers, 2);
      // Wasserlinie an der Bruchstelle: ein heller Strich quer, darunter ein dunkler
      const pb = P(bruch, 0); K.linie(pb[0] - 4, pb[1], pb[0] + vers + 5, pb[1], '#e0a080'); K.linie(pb[0] - 3, pb[1] + 1, pb[0] + vers + 4, pb[1] + 1, '#3a0e08');
      // Bleistift auf der Schwelle, frisch gespitzt
      K.linie(74, 77, 84, 76, '#a8823e'); K.set(85, 76, '#e6c88a'); K.set(86, 76, '#241010'); K.set(73, 77, '#5a2010');
      K.laterne(lx, ly + 12, 1.1, { hof: 60, staerke: .85 });
      K.vignette(.65, { cx: 76, cy: 50 });
    },

    // Ein langes Reliefband in rotem Stein mit kriechenden Gestalten, in der Mitte eine glatte, leere Fläche in Form eines Körpers, darunter Steinsplitter im Sand.
    stadt_leere_stelle(K) {
      const { B } = K;
      // Streiflicht von links unten (Lampe außerhalb des Bildes)
      const lx = -14, ly = 70;
      K.lichtquelle(lx, ly);
      const L1 = lichtF(30, 56, 170, 1.2, 1.1);
      steinwand(K, 0, 0, 160, 74, (x, y) => L1(x, y) * .6, { zh: 8, bw: 50 });
      sandboden(K, 72, 90, (x, y) => L1(x, y) * .8);
      // Reliefband mit Gesimsen
      const y0 = 18, y1 = 64;
      const grund = K.maske(); grund.rect(0, y0, 160, y1 - y0);
      K.form(grund, 0, { k: STEIN.slice(1, 8), ton: 2.4, fase: 0, rand: 0, verlaufX: -1.8, muster: (x, y) => (B.hash(x >> 1, y >> 1, 3) - .5) * .5 });
      const ges = K.maske(); ges.rect(0, y0 - 6, 160, 6); ges.rect(0, y1, 160, 6);
      K.form(ges, 0, { k: STEIN.slice(1, 9), r: RAND, ton: 3, fase: 1, rand: 2, schatten: 2, verlaufX: -2, muster: quader(B, 6, 60, 6), lichtVon: [lx, ly] });
      // Kriechende Gestalten, alle nach rechts, die Szene läuft weiter; in der Mitte fehlt einer
      const fig = K.maske(), r = B.rng(77);
      [[2, 0], [110, 3]].forEach(([x, i]) => kriecher(fig, r, x, y1 - 1, 31, 1, { buckel: i % 2 }));
      K.form(fig, 0, { k: STEIN.slice(2, 9), r: RAND, ton: 5, fase: 1, rand: 2, schatten: 2, sk: K.pk(STEIN[0]), verlaufX: -2.2, verlauf: .6, lichtVon: [lx, ly] });
      // Die leere Stelle: dieselbe Gestalt als glatte Vertiefung (Schatten innen links, Licht innen rechts), ohne Poren, warm
      const leer = K.maske(); kriecher(leer, B.rng(78), 56, y1 - 1, 31, 1, {});
      const breit = K.maske(); breit.fn(leer.x0 - 2, leer.y0 - 2, leer.x1 + 2, leer.y1 + 2, (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (leer.has(x + dx, y + dy)) return true; return false; });
      K.form(breit, 0, { k: ['#0e0605', '#2c1610', '#3e2016', '#4c281a'], r: ['#a85a3a', '#d88a64'], ton: 2.2, fase: 1, rand: 1, L: [1, .1] });
      K.licht(78, 46, 28, '#24100a', .6, { maske: (x, y) => breit.has(x, y) });
      // Splitter im Sand darunter
      const sp = K.maske();
      for (let i = 0; i < 16; i++) { const x = 58 + r.f(0, 40), y = 72 + r.f(0, 8), l = r.f(1.5, 3.5), a = r.f(0, 3.14); sp.poly([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * .5], [x + 1, y + 1.5]]); }
      K.form(sp, 0, { k: STEIN.slice(4, 9), r: ['#e0a080', '#ffd0b0'], ton: 2.8, fase: 0, rand: 1, lichtVon: [lx, ly] });
      K.vignette(.6, { cx: 76, cy: 48 });
    },
  },
};
