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
// Ruhige Rampe: t (0..1) rastet auf Rampenstufen ein, gedithert wird nur in einem schmalen Übergang.
// So bleiben große Flächen fast flach und das Motiv steht vorn.
function ruhig(t, n, b) {
  const f = Math.max(0, Math.min(.9999, t)) * n, k = Math.floor(f), fr = f - k, w = b === undefined ? .18 : b;
  return (k + (fr < .5 - w ? 0 : fr > .5 + w ? 1 : (fr - (.5 - w)) / (2 * w))) / n;
}
// Wand aus breiten Quadern als Feld, mit Lichtfunktion lic(x,y) 0..1 (ruhig gestuft, Fugen als Linien)
function steinwand(K, x0, y0, x1, y1, lic, o) {
  o = o || {}; const { B } = K, zh = o.zh || 7, bw = o.bw || 34;
  K.feld(x0, y0, x1, y1, STEIN, (x, y) => {
    if (o.maske && !o.maske(x, y)) return -1;
    const row = Math.floor(y / zh), xx = x + B.hash(row, 0, K.seed) * bw, fuge = y % zh === 0 || Math.floor(xx) % bw === 0;
    const t = ruhig((o.basis === undefined ? .12 : o.basis) + lic(x, y) * .7 + (B.hash(Math.floor(xx / bw), row, 5) - .5) * .05, STEIN.length - 1);
    return fuge ? t - .5 / (STEIN.length - 1) : t;
  });
}
// Sandboden in Aufsicht mit Lichtfunktion (ruhig gestuft)
function sandboden(K, y0, y1, lic, o) {
  o = o || {}; const { B } = K;
  K.feld(o.x0 || 0, y0, o.x1 || 160, y1, SAND, (x, y) => (o.maske && !o.maske(x, y)) ? -1 : ruhig(.02 + lic(x, y) * .85 + (o.tf ? o.tf(x, y) : 0), SAND.length - 1) + (B.hash(x, y, 7) > .97 ? .12 : 0));
}
// Kerze (Expedition): Stummel, Flamme, Lichthof; die eine helle Stelle. Fuß (x, yb)
function kerze(K, x, yb, o) {
  o = o || {}; const m = K.maske(); m.rect(x - 1.5, yb - 5, 3, 5); m.ell(x, yb, 3, 1);
  K.flamme(x, yb - 5, { gross: 2, hof: o.hof || 60, hofFarbe: '#5a2a0c', staerke: o.staerke || .95, ohne: o.ohne });
  K.form(m, 0, { k: ['#4a3a2a', '#8a7a60', '#c8b890', '#e8dcc0'], r: [], ton: 2.4, fase: 0, rand: 0, verlaufX: -1.6 });
  K.lichtquelle(x, yb - 7);
  return [x, yb - 7];
}
// Handlaterne: runder Glaskolben, dunkle Kappe, Bügel (kein Kasten). Fuß (x, yb), Größe s
function handlampe(K, x, yb, s, o) {
  o = o || {}; const m = K.maske();
  m.rect(x - 2.6 * s, yb - 1.4 * s, 5.2 * s, 1.4 * s); m.poly([[x - 2.2 * s, yb - 7.4 * s], [x + 2.2 * s, yb - 7.4 * s], [x, yb - 9.4 * s]]);
  m.kap(x - 2 * s, yb - 9 * s, x, yb - 12 * s, .5, .5); m.kap(x, yb - 12 * s, x + 2 * s, yb - 9 * s, .5, .5);
  const gx = x, gy = yb - 4.4 * s;
  K.licht(gx, gy, o.hof || 50 * s, '#5a2a0c', o.staerke || .9, { ohne: o.ohne });
  K.licht(gx, gy, 7 * s, '#3a1806', 1);
  K.form(m, 0, { k: ['#060302', '#120806', '#241410'], r: WARM, ton: 1.2, fase: 0, rand: 1, L: [0, 1] });
  const g = K.maske(); g.ell(gx, gy, 2.3 * s, 3 * s);
  K.feld(g.x0, g.y0, g.x1 + 1, g.y1 + 1, ['#a06a20', '#ffd27a', '#fff0c0'], (px, py) => g.has(px, py) ? 1 - Math.hypot(px - gx, (py - gy) * .8) / (2.6 * s) : -1);
  K.lichtquelle(gx, gy);
  return [gx, gy];
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
      const tx = 90, ty = 66;
      // Ringe im Sand um die Trommel: feine Rillen (Kamm hell zur Laterne, Tal dunkel), nach außen schwächer
      for (let y = 46; y < 90; y++) for (let x = 0; x < 160; x++) {
        const d = Math.hypot((x - tx) / 4.8, y - ty); if (d < 8.5 || d > 30) continue;
        const f = d % 3.2, st = 1 - (d - 8) / 24;
        if (f < .7 && B.bay(x, y) < st) K.set(x, y, L1(x, y) > .35 ? SAND[5] : L1(x, y) > .15 ? SAND[3] : SAND[2]);
        else if (f > 1 && f < 1.7 && B.bay(x, y) < st * .9) K.set(x, y, SAND[0]);
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
      handlampe(K, lx, ly + 6, 1.3, { hof: 80 });
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
      handlampe(K, lx, ly + 12, 1.4, { hof: 80 });
      K.vignette(.7, { cx: 90, cy: 52 });
    },

    // Eine riesige Halle, in der der Sand in langen Fahnen in einen Abgrund gezogen wird, davor eine kleine Gestalt mit flatterndem Mantel.
    stadt_wind(K) {
      const { B } = K;
      const fx = 46, fy = 82;   // Gestalt vorn links, Laterne in der linken Hand
      const ax = 110, ay = 64, arx = 44, ary = 10;   // der Abgrund im Boden
      // Halle: ruhiges Rotschwarz, hinten ein fernes Glühen, davor riesige Pfeiler als Silhouetten
      K.fuell(['#020101', '#060202', '#0c0504', '#160806'], (x, y) => ruhig(.1 + Math.max(0, 1 - Math.hypot(x - 104, (y - 30) * 1.3) / 80) * .55, 3));
      for (const [px, w] of [[24, 20], [80, 14], [136, 18]]) { const p = K.maske(); p.rect(px - w / 2, 0, w, 56); K.form(p, 0, { k: ['#030101', '#070303', '#0c0505'], r: ['#3a140c', '#5a2014'], ton: 1, fase: 0, rand: 1, L: [.3, -1] }); }
      // Boden aus Sand, Licht um die Gestalt
      const LF = lichtF(fx - 6, fy - 8, 70, 1.5, 1.2);
      sandboden(K, 54, 90, (x, y) => LF(x, y) * .8 + .06);
      // Abgrund: schwarzes Oval mit hellem Vorderrand
      const ab = K.maske(); ab.ell(ax, ay, arx, ary);
      K.feld(ax - arx - 1, ay - ary - 1, ax + arx + 2, ay + ary + 2, DUNKEL, (x, y) => ab.has(x, y) ? 0 : -1);
      for (let x = ax - arx; x <= ax + arx; x++) { const q = (x - ax) / arx, y = Math.round(ay + Math.sqrt(Math.max(0, 1 - q * q)) * ary); K.set(x, y, STEIN[6]); K.set(x, y + 1, STEIN[3]); }
      // Sandfahnen: wenige lange, helle Bögen von hinter der Gestalt hinab in den Abgrund
      const fahnen = [[-4, 70, 70, 40, .9], [4, 86, 80, 60, 1], [20, 62, 74, 46, .7], [30, 90, 96, 76, .85], [-6, 80, 60, 56, .8], [60, 88, 120, 84, .6]];
      for (const [sx, sy, cx, cy, h] of fahnen) {
        let px = null, py = null;
        for (let t = 0; t <= 1; t += .004) {
          const ex = ax + (sx - fx) * .12, ey = ay + 1;
          const x = (1 - t) * (1 - t) * sx + 2 * t * (1 - t) * cx + t * t * ex, y = (1 - t) * (1 - t) * sy + 2 * t * (1 - t) * cy + t * t * ey;
          const rx = Math.round(x), ry = Math.round(y); if (rx === px && ry === py) continue; px = rx; py = ry;
          const l = LF(x, y), c = t > .9 ? SAND[2] : l > .35 ? SAND[5] : l > .12 ? SAND[4] : SAND[3];
          if (t > .8 && B.bay(x, y) > (1 - t) * 5) continue;
          K.set(rx, ry, c); if (h > .8 && t < .6) K.set(rx, ry + 1, SAND[2]);
        }
      }
      // Die Gestalt: größer, Hut, Mantel mit drei klaren Zipfeln zum Abgrund hin
      const fig = K.figurMaske(fx, fy, 36, { kopf: 'hut', blick: 1, neig: -1.5, arme: [[fx - 10, fy - 15], [fx + 8, fy - 14]] });
      fig.poly([[fx + 4, fy - 27], [fx + 24, fy - 26], [fx + 14, fy - 22]]);
      fig.poly([[fx + 6, fy - 21], [fx + 30, fy - 18], [fx + 16, fy - 14]]);
      fig.poly([[fx + 6, fy - 13], [fx + 26, fy - 9], [fx + 8, fy - 6]]);
      fig.kap(fx + 1, fy - 31, fx + 14, fy - 34, 1, .6);   // Schal
      K.form(fig, 0, { k: ['#030101', '#080303', '#100606'], ton: .8, rand: 0, r: [] });
      const lp = handlampe(K, fx - 10, fy - 12, 1, { hof: 60, ohne: fig });
      K.kante(fig, lp[0], lp[1], 46, WARM, { nah: .35 });
      K.vignette(.5, { cx: 84, cy: 60 });
    },

    // Eine niedrige, viel zu breite Türöffnung im roten Stein, daran angelehnt eine geteilte Messlatte, deren obere Hälfte versetzt ist, als stünde sie im Wasser.
    stadt_messlatte(K) {
      const { B } = K;
      const kx = 58, ky = 79;   // Kerze auf der Schwelle
      const L1 = lichtF(kx - 6, ky - 20, 110, 1.1, 1.3);
      steinwand(K, 0, 0, 160, 80, L1, { zh: 10, bw: 60, basis: .06 });
      sandboden(K, 80, 90, (x, y) => L1(x, y) * .8);
      // Die Türöffnung: niedrig und viel zu breit, schwarz; Laibung und Sturz mit Kantenlicht zur Kerze
      const tx0 = 44, tx1 = 158, ty0 = 42, ty1 = 80;
      const st = K.maske(); st.rect(tx0 - 8, ty0 - 8, tx1 - tx0 + 16, 8); st.rect(tx0 - 8, ty0, 8, ty1 - ty0);
      K.form(st, 0, { k: STEIN.slice(1, 9), r: RAND, ton: 2.2, fase: 1, rand: 2, schatten: 2, lichtVon: [kx, ky - 6], muster: (x, y) => (y === ty0 - 4 ? -.8 : 0) });
      K.feld(tx0, ty0, tx1 + 8, ty1, DUNKEL, (x, y) => 0);
      K.kante(st, kx, ky - 6, 90, RAND, { nah: .4 });
      // Die Messlatte: groß, an der Laibung, rot und dunkel geteilt mit Skalenstrichen und Messingkappen;
      // die obere Hälfte ist versetzt, wie im Wasser gebrochen, an der Bruchstelle eine Wasserlinie
      const lx0 = 30, lyB = ty1, lyT = 6, bw = 7, bruch = 44, vers = 5;
      const ROT = ['#3a0e08', '#6a1c10', '#a8341e', '#d0502c', '#e8805c'], SCHW = ['#060303', '#0e0606', '#1a0c08', '#2a140e'];
      const n = 12, seg = (lyB - lyT) / n;
      for (let i = 0; i < n; i++) {
        const y1 = lyB - i * seg, y0 = y1 - seg, dx = y1 <= bruch ? vers : 0, m = K.maske();
        m.rect(lx0 + dx, Math.ceil(y0), bw, Math.ceil(y1) - Math.ceil(y0));
        K.form(m, 0, { k: i % 2 ? SCHW : ROT, r: RAND, ton: i % 2 ? 2 : 3, fase: 0, rand: 1, lichtVon: [kx, ky - 6], verlaufX: 1 });
        // Skalenstriche: an der rechten Kante, jeder halbe Abschnitt ein kurzer, jeder ganze ein langer
        for (let k = 1; k < 4; k++) { const yy = Math.round(y1 - seg * k / 4); K.linie(lx0 + dx + bw - (k === 2 ? 4 : 2), yy, lx0 + dx + bw - 1, yy, i % 2 ? '#a8341e' : '#060303'); }
      }
      const kap = (y, dx) => { const m = K.maske(); m.rect(lx0 + dx - 1, y - 1.5, bw + 2, 3); K.form(m, 0, { k: ['#3a2a10', '#6a5020', '#a8823e', '#e6c88a'], r: ['#e6c88a', '#fff0c0'], ton: 2.6, fase: 0, rand: 1, lichtVon: [kx, ky - 6] }); };
      kap(lyB - 1, 0); kap(lyT + 1, vers);
      K.linie(lx0 - 4, bruch, lx0 + bw + vers + 4, bruch, '#e0a080'); K.linie(lx0 - 3, bruch + 1, lx0 + bw + vers + 3, bruch + 1, '#3a0e08');
      // Bleistift auf der Schwelle neben der Kerze, frisch gespitzt
      K.linie(66, 80, 78, 79, '#a8823e'); K.linie(66, 81, 78, 80, '#5a4020'); K.set(79, 79, '#e6c88a'); K.set(80, 79, '#241010');
      kerze(K, kx, ky + 1, { hof: 70 });
      K.vignette(.5, { cx: 60, cy: 50 });
    },

    // Ein langes Reliefband in rotem Stein mit kriechenden Gestalten, in der Mitte eine glatte, leere Fläche in Form eines Körpers, darunter Steinsplitter im Sand.
    stadt_leere_stelle(K) {
      const { B } = K;
      const kx = 80, ky = 82;   // Kerze im Sand unter der leeren Stelle
      const L1 = lichtF(kx, ky - 14, 120, 1.1, 1.3);
      steinwand(K, 0, 0, 160, 74, (x, y) => L1(x, y) * .5, { zh: 9, bw: 60, basis: .04 });
      sandboden(K, 72, 90, (x, y) => L1(x, y) * .8);
      // Reliefband: ruhiger Grund, Gesimse oben und unten
      const y0 = 16, y1 = 66;
      const grund = K.maske(); grund.rect(0, y0, 160, y1 - y0);
      K.feld(0, y0, 160, y1, STEIN, (x, y) => ruhig(.14 + L1(x, y) * .45, STEIN.length - 1));
      const ges = K.maske(); ges.rect(0, y0 - 6, 160, 6); ges.rect(0, y1, 160, 6);
      K.form(ges, 0, { k: STEIN.slice(1, 9), r: RAND, ton: 2.6, fase: 1, rand: 2, schatten: 2, lichtVon: [kx, ky], muster: (x, y) => ((x + (y > 40 ? 30 : 0)) % 60 === 0 ? -1 : 0) });
      // Zwei große kriechende Gestalten links und rechts, nach rechts gewandt; die Kante zum Licht hin
      const fig = K.maske(), r = B.rng(77);
      kriecher(fig, r, -2, y1 - 1, 34, 1, {}); kriecher(fig, r, 116, y1 - 1, 34, 1, { buckel: 1 });
      K.form(fig, 0, { k: STEIN.slice(2, 8), r: [], ton: 2.4, fase: 1, rand: 0, schatten: 2, sk: K.pk(STEIN[0]), verlauf: .5 });
      K.kante(fig, kx, ky - 10, 100, RAND, { nah: .35 });
      // Die leere Stelle: dieselbe Körperform, glatt geschliffen, deutlich heller und warm, ohne jede Pore
      const leer = K.maske(); kriecher(leer, B.rng(78), 55, y1 - 1, 34, 1, {});
      const breit = K.maske(); breit.fn(leer.x0 - 2, leer.y0 - 2, leer.x1 + 2, leer.y1 + 2, (x, y) => { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (leer.has(x + dx, y + dy)) return true; return false; });
      K.feld(breit.x0, breit.y0, breit.x1 + 1, breit.y1 + 1, ['#6e3a26', '#9a5a3a', '#c0805a', '#e0a880', '#f4c8a0'], (x, y) => breit.has(x, y) ? ruhig(.35 + L1(x, y) * .7, 4, .3) : -1);
      // feiner Meißelrand: oben dunkel (Schatten der Vertiefung), unten hell
      for (let y = breit.y0 - 1; y <= breit.y1 + 1; y++) for (let x = breit.x0 - 1; x <= breit.x1 + 1; x++) if (!breit.has(x, y)) { if (breit.has(x, y + 1)) K.set(x, y, STEIN[0]); else if (breit.has(x, y - 1)) K.set(x, y, '#f4c8a0'); else if (breit.has(x + 1, y) || breit.has(x - 1, y)) K.set(x, y, STEIN[1]); }
      // Splitter im Sand darunter, um die Kerze
      const sp = K.maske();
      for (let i = 0; i < 10; i++) { const x = 60 + r.f(0, 42), y = 75 + r.f(0, 9), l = r.f(2, 4), a = r.f(0, 3.14); if (Math.abs(x - kx) < 4) continue; sp.poly([[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l * .5], [x + 1.5, y + 2]]); }
      K.form(sp, 0, { k: ['#6e3a26', '#9a5a3a', '#c0805a', '#e0a880'], r: ['#f4c8a0', '#fff0d8'], ton: 2.4, fase: 0, rand: 1, schatten: 1, lichtVon: [kx, ky - 6] });
      kerze(K, kx, ky, { hof: 60 });
      K.vignette(.5, { cx: 80, cy: 48 });
    },
  },
};
