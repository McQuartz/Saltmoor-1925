// Ereignisbilder 160 × 90 · Moor (data/events.json mit biom "moor" und moor_plus.json).
// Palette des Moors (prototype/js/scenes/world/moor.js): Violett, Torf, kaltes Lila-Randlicht,
// dazu das fremde Mintgrün der Sterne im Wasser. Warmes Licht nur, wo eine Lampe brennt.
'use strict';

const HIMMEL = ['#040308', '#07060d', '#0c0a16', '#120e20', '#1a142c', '#231c3a', '#2e2648', '#3c3258', '#4e426c'];
const TORF = ['#040306', '#08060c', '#0e0b14', '#15111c', '#1e1828', '#2a2238', '#3a3050'];
const STICH = ['#07060a', '#0d0b13', '#15111d', '#1e1929', '#292236', '#362e46', '#463c5a', '#5a4e72'];
const HOLZ = ['#050408', '#0b0910', '#141019', '#1e1824', '#2a2232', '#3a3046'];
const STERNE = ['#3a3058', '#6a5a9a', '#b0a0d8', '#f0e8ff'];
const FREMD = ['#2a6a5a', '#5ac0a0', '#9affe0', '#e0fff4'];
const BIRKE = ['#141020', '#262038', '#3e3654', '#5a5274', '#7a7294'];
const GRUEN = ['#050704', '#0c100a', '#162012', '#22321c'];
const LILA_D = ['#2e2648', '#4e426c'];      // gedämpftes Randlicht (Nacht ohne Mond)
const LILA = ['#4e426c', '#8a7ab8'];        // Mondkante
const WARMKANTE = ['#8a5a20', '#ffd27a'];
const LEDER = ['#160c06', '#2e1a0c', '#4e2e16', '#704626', '#94603a'];
const SODE = ['#0a080c', '#141018', '#1e1822', '#2a2230', '#382e3e', '#4a3e4e'];

// Toter Baum (Birke oder Erle) aus Ästen, neigt sich auf Wunsch zu einem Ziel
function baum(K, x, yb, hoch, o) {
  o = o || {}; const { B } = K, m = K.maske(), r = B.rng(Math.round(x * 31 + yb * 7) + K.seed);
  const zug = o.ziel ? Math.atan2(o.ziel[1] - (yb - hoch * .5), o.ziel[0] - x) : undefined;
  B.baum(m, r, x, yb + 1, hoch * .42, -Math.PI / 2 + (o.schief || 0), Math.max(.6, hoch * (o.dick || .04)), o.tiefe || 4, { zug, zugStaerke: o.neig || 0, krumm: .16, spreiz: o.spreiz || .55, kuerz: .7, verj: .64, drei: .25, minLen: 2.5 });
  m.poly([[x - hoch * .05, yb + 1], [x - hoch * .012, yb - hoch * .06], [x + hoch * .014, yb - hoch * .06], [x + hoch * .05, yb + 1]]);
  K.form(m, o.tf || 0, Object.assign({ ton: 1.2, fase: 1, verlauf: .4, rand: 1, rimF: .42, r: LILA_D }, o.mat || {}));
  return m;
}
// Torfsode (Ziegel aus Torf): Form mit Fase, Fasern und Schnittkante
function sode(K, x, y, w, h, o) {
  const { B } = K, m = K.maske(); m.rect(x, y, w, h);
  K.form(m, 0, Object.assign({ k: SODE, r: LILA_D, ton: 2.4, fase: 1, rand: 1, schatten: 1, verlauf: .4, L: [.4, -.9], muster: (px, py) => (B.rausch2(px * .7, py * .3, 5) - .5) * .9 + (B.hash(px, py, 3) < .1 ? -.7 : 0) + (py === y + h - 1 ? -1 : 0) }, o || {}));
  return m;
}

// Tief gebückte Gestalt (Rücken fast waagerecht), Blick nach rechts: Fuß bei (x, yb), Größe s (1 = 40 px stehend)
function gebueckt(K, x, yb, s, o) {
  o = o || {}; const m = K.maske();
  const hx = x, hy = yb - 19 * s, sx = x + 15 * s, sy = yb - 22 * s;
  m.kap(hx - 1 * s, hy, x - 3 * s, yb - .5, 2 * s, 1.5 * s); m.kap(hx + 1.5 * s, hy, x + 3 * s, yb - .5, 2 * s, 1.5 * s);
  m.kap(x - 4.5 * s, yb - .8 * s, x - 1.5 * s, yb - .8 * s, 1 * s, 1 * s); m.kap(x + 2 * s, yb - .8 * s, x + 5 * s, yb - .8 * s, 1 * s, 1 * s);
  m.poly([[hx - 6 * s, hy - 1 * s], [hx + 6 * s, hy - 3 * s], [hx + 8 * s, yb - 7 * s], [hx - 8 * s, yb - 6 * s]]);   // Rock bis unters Knie
  m.ell(hx + 1 * s, hy - 1 * s, 6.5 * s, 4.5 * s);                                                        // Hüfte
  m.kap(hx + 1 * s, hy - 3 * s, sx, sy, 5.5 * s, 4.5 * s);                                                  // Rücken
  m.ell(hx + 8 * s, hy - 5 * s, 6 * s, 3.5 * s);                                                            // Buckel
  const kx = sx + 4 * s, ky = sy + 3.5 * s;
  m.ell(kx, ky, 3 * s, 3.2 * s); m.ell(kx - 1.2 * s, ky - .6 * s, 3.6 * s, 3.4 * s);                         // Kopf im Tuch
  m.poly([[kx - 4 * s, ky - 2 * s], [kx - 1 * s, ky - 3.5 * s], [sx - 4 * s, sy - 2 * s], [sx - 2 * s, sy + 3 * s]]);
  return { m, schulter: [sx, sy + 1 * s], kopf: [kx, ky] };
}

module.exports = {
  biom: 'moor',
  bilder: {
    // Ein schwarzes Wasserloch zwischen toten Birken, darin ein Sternbild, das oben am Himmel fehlt.
    moor_wasserloch(K) {
      const { B } = K;
      K.himmel(40, HIMMEL, { gx: 80, gb: 70, steil: .5 });
      // Sterne überall, nur oben in der Mitte eine leere Stelle, wo das Sternbild fehlt
      const r = B.rng(5);
      for (let i = 0; i < 60; i++) { const x = r.f(0, 160), y = Math.pow(r(), 1.3) * 34; if (Math.hypot((x - 84) / 26, (y - 13) / 11) < 1) continue; K.set(x, y, STERNE[Math.floor(Math.pow(r(), 2.4) * 3.2)]); }
      // Horizont: ferne Erlenkuppen, Torfebene
      K.feld(0, 30, 160, 42, TORF, (x, y) => y > 35 + Math.sin(x * .07) * 2 + B.fbm(x * .05, 1, 3, 2) * 4 ? .12 : -1);
      K.feld(0, 38, 160, 90, TORF, (x, y) => .2 + (y - 38) / 110 + (B.fbm(x * .06, y * .12, K.seed, 2) - .5) * .25);
      // Wasserloch in Aufsicht: große Ellipse, Rand aus Torf
      const cx = 80, cy = 64, rx = 50, ry = 17;
      const ufer = K.maske(); ufer.ell(cx, cy + 1.5, rx + 4, ry + 4);
      K.form(ufer, 0, { k: STICH.slice(1, 6), r: LILA_D, ton: 2, L: [0, -1], rand: 1, muster: (x, y) => (B.hash(x, y >> 1, 7) - .5) * .6 });
      const loch = K.maske(); loch.ell(cx, cy, rx, ry);
      K.feld(cx - rx, cy - ry, cx + rx + 1, cy + ry + 1, ['#000000', '#020204', '#05050a'], (x, y) => loch.has(x, y) ? .05 + (y < cy - ry * .6 ? .4 : 0) : -1);
      // Das fremde Sternbild im Wasser: Linien zart, Sterne als Kreuze
      const S = [[-30, -8, 2], [-17, -10, 1], [-6, -5, 3], [5, -2, 1], [16, -6, 2], [-22, 4, 1], [0, 6, 2], [26, 3, 2], [-9, 11, 1], [12, 11, 1]];
      K.licht(cx, cy + 1, 44, '#0e3028', .8, { maske: (x, y) => loch.has(x, y), oval: 2.4 });
      for (const [a, b] of [[0, 1], [1, 2], [2, 3], [3, 4], [4, 7], [2, 6], [5, 1], [6, 9], [6, 8]]) { const p = S[a], q = S[b]; B.linie(K.e, cx + p[0] + .5, cy + p[1] + .5, cx + q[0] + .5, cy + q[1] + .5, B.pk('#1a5246'), .5); }
      for (const [dx, dy, g] of S) {
        const x = cx + dx, y = cy + dy; K.set(x, y, FREMD[Math.min(3, g + 1)]);
        for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) K.set(x + ax, y + ay, FREMD[g - 1 < 0 ? 0 : g - 1]);
        if (g >= 2) for (const [ax, ay] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) K.set(x + ax, y + ay, FREMD[0]);
      }
      // der eine, der sich bewegt: unten am Ufer, auf dich zu, mit Spur
      const mx = cx + 4, my = cy + 14;
      for (let k = 1; k < 6; k++) if (k % 2) K.set(mx - k * .4, my - k, FREMD[0]);
      K.set(mx, my, FREMD[3]); for (const [ax, ay] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) K.set(mx + ax, my + ay, FREMD[2]);
      K.licht(mx, my, 8, '#1a5a4a', .8, { maske: (x, y) => loch.has(x, y) });
      // Tote Birken: blasse Stämme mit schwarzen Narben, mattes Randlicht
      K.lichtquelle(cx, cy);
      const bm = { k: BIRKE, ton: 2.4, verlauf: -.6, muster: (x, y) => (B.hash(x >> 1, y >> 1, 4) < .16 ? -2.2 : 0), r: ['#1a4a3e', '#3a8a74'] };
      baum(K, 22, 82, 86, { schief: .1, dick: .045, mat: bm });
      baum(K, 40, 54, 52, { schief: -.14, dick: .04, tiefe: 3, tf: .25, mat: bm });
      baum(K, 136, 84, 80, { schief: -.12, dick: .045, mat: bm });
      baum(K, 150, 52, 40, { schief: .2, tiefe: 3, tf: .35, mat: bm });
      // Binsen am Rand
      const bi = K.maske(); const br = B.rng(11);
      for (let i = 0; i < 34; i++) { const lk = br() < .5, x = lk ? br.f(30, 62) : br.f(98, 130), y = cy + ry * (br() < .45 ? -.92 : .96) + br.j(1.5); if (Math.abs(x - cx) > rx * .97) continue; const l = br.f(4, 10); bi.kap(x, y, x + br.j(2), y - l, .55, .4); }
      K.form(bi, 0, { k: GRUEN, r: ['#1a4a3e', '#2a6a5a'], ton: 1.6, fase: 0, rand: 1 });
      K.vignette(.7, { cy: 56 });
    },

    // Ein Steinkreis auf einer Anhöhe, in der Mitte ein kleines Licht und eine Schale, ringsum Bäume, die sich zur Mitte neigen.
    moor_steinkreis(K) {
      const { B } = K;
      K.himmel(70, HIMMEL, { steil: .75, basis: .2, wolken: .2, gx: 80, gb: 50 });
      K.sterne(26, 34, STERNE.slice(0, 3));
      // Anhöhe: breiter Buckel, Kuppe bei y 50
      const hx = 80, hy = 60;
      const kuppe = x => 46 + (1 - Math.exp(-(((x - hx) / 52) ** 2))) * 22 + B.fbm(x * .08, 2, 4, 2) * 2;
      const hug = K.maske(); hug.fn(0, 30, 160, 90, (x, y) => y > kuppe(x));
      K.form(hug, 0, { k: TORF.slice(1, 7), r: LILA_D, ton: 2.3, verlauf: .4, L: [0, -1], rand: 1, muster: (x, y) => (B.hash(x, y, 9) < .08 ? .6 : 0) - (y - 50) / 30 });
      // Bäume: Silhouetten gegen den helleren Himmel, alle zur Mitte gebeugt
      const ziel = [hx, hy - 6];
      for (const [x, yb, h, n] of [[8, 76, 66, .3], [26, 60, 40, .45], [136, 60, 40, .45], [152, 78, 68, .3]]) baum(K, x, yb, h, { ziel, neig: n, tiefe: 4, dick: .045, spreiz: .45, mat: { k: TORF.slice(0, 4), ton: .8, rand: 0 } });
      // Steine im Kreis: Ellipse auf der Kuppe, hinten kleiner
      const rx = 44, ry = 11;
      const steine = [];
      for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2 + .35; steine.push([hx + Math.cos(a) * rx, hy + Math.sin(a) * ry, Math.sin(a)]); }
      steine.sort((a, b) => a[2] - b[2]);
      const sm = K.maske();
      for (const [x, y, v] of steine) {
        const h = 17 + v * 5, w = 8 + v * 2, rr = B.rng(Math.round(x * 13));
        sm.poly([[x - w / 2, y + 1], [x - w * .45 + rr.j(1), y - h * .6], [x - w * .2, y - h], [x + w * .25, y - h + rr.f(0, 2)], [x + w * .5, y - h * .4], [x + w / 2, y + 1]]);
      }
      // Niedergetretenes Gras: ein Ring
      for (let a = 0; a < Math.PI * 2; a += .04) { const x = hx + Math.cos(a) * 24, y = hy + Math.sin(a) * 6; if (B.bay(x, y) < .55) K.set(x, y, '#2a2238'); }
      K.form(sm, 0, { k: STICH.slice(0, 5), ton: 1.2, verlauf: .4, rand: 0, schatten: 1, muster: (px, py) => (B.rausch2(px * .4, py * .2, 9) - .5) * .6 });
      // Schale mit Münzen und die Öllampe in der Mitte
      const sch = K.maske(); sch.ell(hx + 7, hy, 4.5, 2); sch.rect(hx + 2.5, hy - 2, 9, 2);
      K.form(sch, 0, { k: HOLZ.slice(1, 6), ton: 2, fase: 0, rand: 0 });
      const lampe = K.maske(); lampe.ell(hx - 3, hy, 3.6, 1.8); lampe.kap(hx + .5, hy - 1, hx + 2.5, hy - 2.5, .7, .5); lampe.rect(hx - 4, hy - 2, 2, 1);
      K.form(lampe, 0, { k: HOLZ.slice(1, 6), ton: 2, fase: 0, rand: 0 });
      K.flamme(hx - 3, hy - 2, { hof: 68, staerke: 1, gross: 2, ohne: sm });
      K.licht(hx - 3, hy - 3, 60, '#3a2408', .8, { maske: (x, y) => sm.has(x, y), oval: 1.2 });
      K.kante(sm, hx - 3, hy - 4, 56, WARMKANTE, { nah: .5 });
      K.set(hx + 5, hy - 2, '#e0b860'); K.set(hx + 7, hy - 2, '#ffd890'); K.set(hx + 9, hy - 2, '#a08040');
      K.vignette(.75, { cy: 54 });
    },

    // Eine gebückte Gestalt in einer Torfgrube, die Arme bis zu den Ellbogen dunkel und rissig, daneben sauber gestapelte Soden.
    moor_torf(K) {
      const { B } = K;
      K.himmel(16, HIMMEL, { steil: .6, basis: .3 });
      // Hintere Stichwand: Spatenschnitte in Bänken
      K.feld(0, 14, 160, 76, STICH, (x, y) => .5 - (y - 14) / 160 + ((x + (Math.floor((y - 14) / 8) & 1) * 7) % 14 < 1 ? -.18 : 0) + ((y - 14) % 8 === 0 ? -.2 : 0) + (B.rausch2(x * .3, y * .1, 3) - .5) * .2);
      const kante = K.maske(); kante.fn(0, 10, 160, 18, (x, y) => y > 13 + Math.sin(x * .09) * 1.2 && y < 16);
      K.form(kante, 0, { k: TORF.slice(2, 7), r: LILA_D, ton: 2, L: [0, -1], rand: 1 });
      // Sohle: nasser Torf
      K.feld(0, 74, 160, 90, ['#020203', '#05040a', '#0a0812', '#100c1a', '#181424'], (x, y) => .2 + (y - 74) / 40 + (Math.sin(y * 1.9 + x * .08) > .85 ? .25 : 0));
      // Gestapelte Soden rechts, im Verband
      const stapel = K.maske();
      for (let row = 0; row < 5; row++) {
        const n = row < 3 ? 3 : 2, w = 13, x0 = 108 + (row % 2 ? 7 : 0) + (row >= 3 ? 7 : 0);
        for (let i = 0; i < n; i++) stapel.rect(x0 + i * (w + 1), 70 - row * 6, w, 6);
        for (let i = 0; i < n; i++) sode(K, x0 + i * (w + 1), 70 - row * 6, w, 6);
      }
      // Die Torfstecherin: tief gebückt, Arme vorn im Torf
      const gb = gebueckt(K, 50, 80, 1.45), frau = gb.m;
      const [ax, ay] = gb.schulter;
      frau.kap(ax - 2, ay, ax + 1, ay + 8, 2.6, 2.4); frau.kap(ax + 2, ay + 1, ax + 5, ay + 9, 2.6, 2.4);   // Oberarme
      K.form(frau, 0, { ton: .4, rand: 0, k: ['#030204', '#06050a', '#0b0910', '#100d16'] });
      // Der angestochene Torf, in den sie greift
      const block = K.maske(); block.poly([[76, 74], [94, 72], [96, 80], [74, 81]]);
      K.form(block, 0, { k: SODE, ton: 2, rand: 0, fase: 1, muster: (x, y) => (B.rausch2(x * .7, y * .3, 5) - .5) * .9 });
      // Laterne auf der Sohle, zwischen ihr und dem Stapel
      K.laterne(98, 76, 1.25, { hof: 80, ohne: frau, staerke: 1 });
      K.kante(frau, 98, 68, 64, WARMKANTE, { nah: .45 });
      // Rinde: Unterarme bis zum Ellbogen, rissig mit hellen Borkenkanten im Lampenlicht
      const arm = K.maske(); arm.kap(ax + 1, ay + 7, ax + 6, ay + 19, 2.5, 2.2); arm.kap(ax + 5, ay + 8, ax + 11, ay + 20, 2.5, 2.2); arm.ell(ax + 6, ay + 19, 2.8, 2.2); arm.ell(ax + 11, ay + 20, 2.8, 2.2);
      K.form(arm, 0, { k: ['#0e0a08', '#22180e', '#3a2a18', '#5a4226'], r: ['#7a5a2a', '#c8a060'], ton: 1.8, rand: 2, L: [1, 0], muster: (x, y) => ((x * 2 + y) % 4 === 0 ? -1.4 : 0) + (B.hash(x, y, 5) < .2 ? .8 : 0) });
      K.vignette(.75, { cx: 84, cy: 54 });
    },

    // Ein Weidenflechtwerk auf schwarzem Torf, drei schräge Pfähle durch die Ruten, am Rand der Grube die liegengelassenen Torfspaten.
    moor_pfaehle(K) {
      const { B } = K;
      K.himmel(18, HIMMEL, { steil: .7, basis: .25, gx: 132, gb: 40 });
      K.mond(136, 8, 3.5, { hof: 5, hofFarbe: '#1a142c' });
      // Grubenrand hinten: Torffläche, dann die Stichwand
      K.feld(0, 15, 160, 30, TORF, (x, y) => y > 16 + B.fbm(x * .06, 0, 2, 2) * 2 ? .35 + (B.hash(x, y, 2) < .1 ? .2 : 0) : -1);
      const wand = K.maske(); wand.rect(0, 26, 160, 9);
      K.form(wand, 0, { k: STICH.slice(1, 7), r: LILA, ton: 2.2, L: [.3, -1], rand: 1, verlauf: .8, muster: (x, y) => (x % 9 === 0 ? -.9 : 0) + (y === 30 ? -.6 : 0) });
      // Grubensohle: schwarzer Torf, nach vorn kaum heller, glänzend nass
      K.feld(0, 35, 160, 90, ['#020103', '#05040a', '#0a0812', '#110d1a', '#1a1426'], (x, y) => .18 + (y - 35) / 200 + (B.rausch2(x * .12, y * .25, 6) - .5) * .25 + (Math.sin(x * .3 + y * 1.7) > .93 ? .4 : 0));
      // Flechtwerk in Aufsicht: Ruten über und unter Staken, perspektivisch
      const fx = 80, y0 = 44, y1 = 80, wo = 40, wu = 58;
      const xl = y => fx - B.lerp(wo, wu, (y - y0) / (y1 - y0)), xr = y => fx + B.lerp(wo, wu, (y - y0) / (y1 - y0));
      const n = 11, rowH = (y1 - y0) / n;
      // Staken (senkrecht, in Flucht)
      const nst = 9, staken = K.maske();
      for (let i = 0; i <= nst; i++) { const u = i / nst; staken.kap(B.lerp(xl(y0), xr(y0), u), y0 - 1, B.lerp(xl(y1), xr(y1), u), y1 + 1, .7, 1.1); }
      K.form(staken, 0, { k: ['#0a0806', '#1a140c', '#2e2416', '#463624'], ton: 1, rand: 0, fase: 0 });
      // Ruten: jede Reihe eine Kapselfolge, abwechselnd über und unter den Staken
      const rut = K.maske(), unter = K.maske();
      for (let j = 0; j < n; j++) {
        const y = y0 + (j + .5) * rowH, d = .9 + j * .06;
        for (let i = 0; i < nst; i++) {
          const ua = i / nst, ub = (i + 1) / nst, xa = B.lerp(xl(y), xr(y), ua) + .8, xb = B.lerp(xl(y), xr(y), ub) - .8;
          const ziel = ((i + j) & 1) ? rut : unter;
          ziel.kap(xa - .5, y + (i & 1 ? .3 : -.3), xb + .5, y + (i & 1 ? -.3 : .3), d, d);
        }
      }
      K.lichtquelle(136, 8);
      K.form(unter, 0, { k: ['#0c0a08', '#1e180f', '#30281a', '#463a26'], r: LILA_D, ton: 1.4, rand: 1, fase: 0 });
      K.form(rut, 0, { k: ['#120e0a', '#2a2216', '#463a26', '#625036', '#7e6a4a'], r: LILA, ton: 2.3, rand: 1, fase: 1, L: [.5, -.9] });
      // Atmen des Torfs: ein dunkler, gewölbter Saum rund um das Werk
      for (let y = y0 - 3; y <= y1 + 3; y++) for (const s of [-1, 1]) { const x = s < 0 ? xl(y) - 3 : xr(y) + 3; if (B.bay(x, y) < .7) K.set(x, y, '#000000'); }
      // Drei angespitzte Pfähle, schräg wie Zeltpflöcke, durch die Ruten
      const pf = K.maske(), P = [[62, 66, -10, -30], [84, 58, -3, -34], [106, 68, 9, -28]];
      for (const [x, y, dx, dy] of P) { const l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l; pf.kap(x, y, x + dx, y + dy, 2.2, 2.2); pf.poly([[x + dx - uy * 2.2, y + dy + ux * 2.2], [x + dx + ux * 4.5, y + dy + uy * 4.5], [x + dx + uy * 2.2, y + dy - ux * 2.2]]); }
      K.form(pf, 0, { k: HOLZ, r: LILA, ton: 1.8, rand: 2, fase: 1, muster: (x, y) => ((x + y * 2) % 5 === 0 ? -.5 : 0) });
      for (const [x, y] of P) for (let k = -2; k <= 2; k++) K.set(x + k, y + 2, '#000000');
      // Torfspaten, liegengelassen am Grubenrand
      const sp = K.maske();
      sp.kap(10, 22, 40, 19, .8, .8); sp.poly([[40, 16], [50, 16], [50, 23], [40, 22]]); sp.kap(9, 20, 9, 24, 1.4, 1.4);
      sp.kap(116, 21, 142, 24, .8, .8); sp.poly([[142, 21], [151, 21], [151, 27], [142, 27]]);
      K.form(sp, 0, { k: ['#0a0810', '#1e1824', '#2e2638', '#463c54', '#5e5270'], r: LILA, ton: 2.6, rand: 2, schatten: 1, L: [.5, -.9] });
      K.vignette(.7, { cy: 56 });
    },

    // Ein Stapel dunkler Torfziegel neben dem Bohlenweg, aus der mittleren Reihe ragt eine gegerbte Hand mit geschlossener Faust.
    moor_sode(K) {
      const { B } = K;
      K.himmel(24, HIMMEL, { steil: .55, gx: 30, gb: 60 });
      K.sterne(12, 18, STERNE.slice(0, 3));
      K.feld(0, 20, 160, 90, TORF, (x, y) => .25 + (y - 20) / 140 + (B.fbm(x * .05, y * .1, K.seed, 2) - .5) * .25);
      K.feld(0, 18, 160, 26, TORF, (x, y) => y > 21 + B.fbm(x * .06, 0, 2, 2) * 3 ? .3 : -1);
      // Bohlenweg: Querbohlen, läuft von vorn links nach hinten
      const weg = K.maske(); weg.poly([[0, 70], [0, 90], [58, 90], [70, 30], [58, 30]]);
      K.form(weg, 0, { k: HOLZ, r: LILA_D, ton: 2.2, L: [0, -1], rand: 1, muster: (x, y) => { const u = y + (70 - x) * .12, b = 2 + (y - 30) * .08; return (u % b < .9 ? -1.2 : 0) + (B.hash(Math.floor(u / b), 1, 3) - .5) * .5; } });
      // Stapel: vier Reihen großer Soden im Verband
      const sx = 72, sy = 72, w = 18, h = 9, stapel = K.maske();
      const platz = [];
      for (let row = 0; row < 4; row++) for (let i = 0; i < 4 - (row === 3 ? 1 : 0); i++) {
        const x = sx + i * (w + 1) + (row % 2 ? 9 : 0) + (row === 3 ? 0 : 0), y = sy - row * (h + 1) - h;
        if (x + w > 160) continue; platz.push([x, y, row, i]);
      }
      for (const [x, y, row, i] of platz) { if (row === 1 && i === 1) continue; stapel.rect(x, y, w, h); sode(K, x, y, w, h); }
      // Die Sode mit der Hand: aufgebrochen, ein dunkles Loch, aus dem der Arm kommt
      const [hx, hy] = platz.find(p => p[2] === 1 && p[3] === 1);
      sode(K, hx, hy, w, h, { k: SODE.slice(0, 5), ton: 1.8 });
      const loch = K.maske(); loch.ell(hx + 8, hy + 5, 4, 3); K.form(loch, 0, { k: ['#000000', '#030204', '#06050a'], ton: .6, rand: 0, fase: 1 });
      // Laterne vorn auf dem Bohlenweg
      const hd = K.maske(), fx = hx + 9, fy = hy - 10;
      hd.kap(fx + 1, hy + 5, fx, fy + 3, 2.6, 2.3);                     // Unterarm, senkrecht aus der Sode
      hd.ell(fx, fy, 4.6, 4); hd.rect(fx - 4.5, fy - 2, 9, 5);            // Faust
      for (let i = 0; i < 4; i++) hd.ell(fx - 3.2 + i * 2.15, fy - 3.6, 1.25, 1.2);   // Knöchel oben
      K.form(hd, 0, { k: LEDER, ton: 2.7, rand: 0, L: [-.9, -.2], muster: (x, y) => ((x === fx - 2 || x === fx || x === fx + 2) && y >= fy - 3 && y <= fy ? -1.3 : 0) + (B.hash(x, y, 8) < .1 ? -.5 : 0) + (y > hy - 1 ? -.6 : 0) });
      // Daumen quer vor den Fingern
      const dm = K.maske(); dm.kap(fx - 4, fy + 1.5, fx + 1.5, fy + .5, 1.2, 1.1);
      K.form(dm, 0, { k: LEDER.slice(1), ton: 3, rand: 0, fase: 0, L: [-.9, -.2] });
      K.laterne(60, 78, 1.3, { hof: 66, ohne: stapel });
      K.licht(60, 68, 70, "#2a1808", .8, { maske: (x, y) => stapel.has(x, y), oval: 1.3 });
      K.kante(hd, 60, 70, 64, WARMKANTE, { nah: .55 });
      // Fingernägel, sauber
      for (let i = 0; i < 4; i++) K.set(fx - 3.2 + i * 2.15, fy - 4.6, i < 2 ? '#e8c898' : '#b89870');
      K.vignette(.75, { cx: 84, cy: 54 });
    },
  },
};
