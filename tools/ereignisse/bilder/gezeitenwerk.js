// Ereignisbilder 160 × 90 · Das Gezeitenwerk (data/biome/gezeitenwerk.json).
// Palette des Gezeitenwerks (prototype/js/scenes/world/gezeitenwerk.js): Bronze mit Grünspan, nasses
// Schwarzgrün, Meerwasser voll Meeresleuchten (Phosphorgelbgrün), blank gegriffenes Messing.
// Licht: Meeresleuchten oder eine einzelne warme Lampe. Alles ist für Hände mit sieben Fingern gebaut.
'use strict';

const BRONZE = ['#040907', '#08120d', '#0d1b14', '#13261c', '#1a3225', '#223f2f', '#2c4e3a', '#3a6249'];
const NASS = ['#020403', '#040907', '#08100c', '#0c1712', '#111f18', '#182a20', '#21382b'];
const WASSER = ['#020707', '#041010', '#071a18', '#0b2622', '#10332d', '#174238', '#215446'];
const DUNST = ['#06100c', '#0a1812', '#0f2219', '#152d21', '#1d3b2b', '#274c37'];
const SPAN = ['#0c1a14', '#16302a', '#22463a', '#2e5c4a', '#3c745c', '#52907a'];
const BLANK = ['#2a2210', '#4a3a1a', '#7a6230', '#a8823e', '#e6c88a'];
const RAND = ['#3f8a6c', '#a8e6c4'];
const MESS = ['#a8823e', '#e6c88a'];
const PHOS = '#d4ff5a', PHOS_K = '#f4ffd0', PHOS_G = '#28400e', PHOS_M = '#7aa830';
const WARM = ['#a06a20', '#ffd27a'];
const TAU = Math.PI * 2;

// ---------- eigene Bausteine ----------
// Zahnrad von vorn (wie im Hintergrund): Kranz mit Zähnen, Speichen, Nabe. o: n, th, rot, sp, kranz, nabe, tiefe, voll
function zahnrad(K, cx, cy, R, o) {
  o = o || {}; const { B } = K;
  const n = o.n || 40, th = o.th || R * .08, rot = o.rot || 0, sp = o.sp || 7, kr = o.kranz || R * .16, nb = o.nabe || R * .18;
  const innen = (x, y) => {
    const u = x - cx, v = y - cy, rr = Math.hypot(u, v); if (rr > R + th) return false;
    const a = Math.atan2(v, u) + rot;
    if (rr > R) { const f = ((a / TAU * n) % 1 + 1) % 1; const z = f < .1 ? f / .1 : f < .45 ? 1 : f < .55 ? 1 - (f - .45) / .1 : 0; return rr < R + th * z; }
    if (rr > R - kr || rr < nb || o.voll) return true;
    const s = ((a / TAU * sp) % 1 + 1) % 1, d = Math.min(s, 1 - s) * TAU / sp * rr; return d < (o.speiche || R * .05) + (R - rr) * .03;
  };
  const m = K.maske(); m.fn(cx - R - th - 1, cy - R - th - 1, cx + R + th + 1, cy + R + th + 1, innen);
  K.form(m, o.tiefe || 0, { k: o.k || BRONZE.slice(1, 8), r: o.r || RAND, ton: o.ton || 2, fase: 1.5, rand: 2, schatten: 2, verlauf: .5, lichtVon: o.lichtVon,
    muster: (x, y) => { const rr = Math.hypot(x - cx, y - cy); return (Math.abs(rr - (R - kr)) < 1 || Math.abs(rr - nb) < 1 ? -1.1 : 0) + (B.fbm(x * .06, y * .06, 7, 2) - .5) * .9; } });
  return m;
}
// Handabdruck mit sieben Fingern: Ballen + sieben Finger (mittlere am längsten), leuchtend in Phosphoröl.
// st: Leuchtkraft 0..1; liefert Kuppenpunkte
function abdruck(K, x, y, s, winkel, st) {
  const { B } = K, ca = Math.cos(winkel || 0), sa = Math.sin(winkel || 0), T = (u, v) => [x + u * ca - v * sa, y + u * sa + v * ca];
  const m = K.maske(), kuppen = [];
  m.fn(x - 8 * s, y - 12 * s, x + 8 * s, y + 6 * s, (px, py) => { const dx = px - x, dy = py - y, u = dx * ca + dy * sa, v = -dx * sa + dy * ca; return (u / (3.6 * s)) ** 2 + (v / (2.8 * s)) ** 2 <= 1; });
  for (let i = 0; i < 7; i++) {
    const u0 = (-3.6 + i * 1.2) * s, l = [2.6, 3.8, 4.8, 5.4, 4.8, 3.8, 2.6][i] * s;
    const a = T(u0, -2 * s), b = T(u0 + (i - 3) * l * .07, -2 * s - l);
    m.kap(a[0], a[1], b[0], b[1], Math.max(.5, .36 * s), Math.max(.5, .32 * s)); kuppen.push(b);
  }
  const C = [B.mix('#000000', PHOS_G, .6 + st * .4), B.mix(PHOS_G, PHOS_M, st), B.mix(PHOS_G, PHOS, st)];
  for (let py = m.y0; py <= m.y1; py++) for (let px = m.x0; px <= m.x1; px++) if (m.has(px, py)) {
    const rand = !m.has(px - 1, py) || !m.has(px + 1, py) || !m.has(px, py - 1) || !m.has(px, py + 1);
    K.set(px, py, rand ? C[1] : (B.bay(px, py) < st * .5 ? C[1] : C[0]));
  }
  for (const [kx, ky] of kuppen) K.set(kx, ky, C[2]);
  if (st > .5) K.licht(x, y - 2 * s, 9 * s, PHOS_G, st * .8, { ohne: m });
  return m;
}
// Grünspan-Kruste: Feld mit Flecken
function gruenspan(K, x0, y0, x1, y1, lic, o) {
  o = o || {}; const { B } = K;
  K.feld(x0, y0, x1, y1, SPAN, (x, y) => (o.maske && !o.maske(x, y)) ? -1 : .08 + lic(x, y) * .7 + (B.fbm(x * .12, y * .2, K.seed + 2, 3) - .5) * .5 + (B.hash(x, y, 3) > .93 ? .2 : 0));
}
// Meeresleuchten im Wasser: einzelne Pixel, gedithert nach Dichte d(x,y)
function leuchten(K, x0, y0, x1, y1, d, o) {
  o = o || {}; const { B } = K;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const v = d(x, y); if (v <= 0) continue; const h = B.hash(x, y, K.seed + 11); if (h < v * .12) K.set(x, y, h < v * .03 ? PHOS_K : h < v * .07 ? PHOS : PHOS_M); }
}
// Ruhige Rampe: rastet auf Stufen ein, gedithert nur im schmalen Übergang (große Flächen fast flach)
function ruhig(t, n, b) {
  const f = Math.max(0, Math.min(.9999, t)) * n, k = Math.floor(f), fr = f - k, w = b === undefined ? .18 : b;
  return (k + (fr < .5 - w ? 0 : fr > .5 + w ? 1 : (fr - (.5 - w)) / (2 * w))) / n;
}
const lichtF = (lx, ly, r, ov, ex) => (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * (ov || 1)) / r), ex || 1.4);

module.exports = {
  biom: 'gezeitenwerk',
  bilder: {
    // Ein riesiger Bronzehebel vor dunkler Wand, darunter grün verkrustete Fläche voller leuchtender Handabdrücke mit sieben Fingern.
    gezeitenwerk_abdruecke(K) {
      const { B } = K;
      // Wand: ruhige Bronzeplatten, wenige Nieten
      K.fuell(BRONZE.slice(0, 4), (x, y) => ruhig(.25 + (x % 40 < 1 || y % 22 < 1 ? -.25 : 0), 3));
      for (let y = 4; y < 40; y += 22) for (let x = 6; x < 160; x += 10) { K.set(x, y, BRONZE[5]); K.set(x + 1, y + 1, BRONZE[0]); }
      // Kruste unten, ruhig gestuft, nach vorn heller
      K.feld(0, 42, 160, 90, SPAN, (x, y) => ruhig(.12 + (y - 42) / 48 * .35 + (B.fbm(x * .06, y * .1, K.seed + 2, 2) - .5) * .2, SPAN.length - 1, .1));
      const kante = K.maske(); kante.rect(0, 41, 160, 2); K.form(kante, 0, { k: BRONZE.slice(2, 8), r: RAND, ton: 2, fase: 0, rand: 1, L: [0, -1] });
      // Der Hebel: Drehlager links, Stange schräg nach oben rechts, Griff blank gegriffen
      const lager = K.maske(); lager.ell(20, 44, 11, 8); lager.rect(6, 44, 28, 6);
      K.form(lager, 0, { k: BRONZE.slice(1, 8), r: RAND, ton: 2.2, fase: 1, rand: 2, schatten: 2, L: [.6, -.8] });
      const hebel = K.maske(); hebel.kap(22, 42, 116, 4, 4.2, 3);
      K.form(hebel, 0, { k: BRONZE.slice(1, 8), r: RAND, ton: 2.4, fase: 1, rand: 2, schatten: 2, L: [.6, -.8] });
      const griff = K.maske(); griff.kap(104, 9, 128, 0, 3.6, 3.6);
      K.form(griff, 0, { k: BLANK, r: MESS, ton: 3, fase: 1, rand: 2, L: [.6, -.8], muster: (x, y) => ((x + y) % 4 === 0 ? -.6 : 0) });
      const nabe = K.maske(); nabe.ell(22, 42, 4, 4); K.form(nabe, 0, { k: BLANK, r: MESS, ton: 2, fase: 0, rand: 1 });
      // Wenige große Abdrücke, sieben Finger zählbar; der letzte vorn kleiner und hell leuchtend
      for (const [x, y, s, w, st] of [[28, 72, 3, .35, .4], [64, 58, 2.6, -.2, .3], [128, 60, 2.8, .25, .35], [142, 86, 3.2, -.3, .3]]) abdruck(K, x, y, s, w, st);
      abdruck(K, 96, 82, 2.1, -.1, 1);
      K.vignette(.5, { cx: 84, cy: 60 });
    },

    // Ein Mann von 1880 mit Backenbart an einem Messinstrument auf einer kleinen Eisenbühne, dahinter Zähne eines Rades, groß wie Häuser.
    gezeitenwerk_ingenieur(K) {
      const { B } = K;
      // Dunst und das riesige Rad dahinter (nur ein Ausschnitt des Kranzes mit Zähnen)
      K.fuell(DUNST, (x, y) => .2 + (1 - y / 90) * .3 + (B.fbm(x * .02, y * .04, K.seed, 2) - .5) * .15);
      zahnrad(K, 80, 250, 210, { n: 46, th: 34, kranz: 40, voll: true, tiefe: .35, ton: 1.6, lichtVon: [140, 0] });
      K.nebel(40, 90, .35, DUNST[3]);
      // Die Eisenbühne: Bodenplatte, Geländer, Streben zum Zahn
      const lx = 118, ly = 44;   // Laterne am Geländer
      const buehne = K.maske(); buehne.rect(52, 60, 82, 3);
      buehne.kap(60, 63, 76, 80, 1, 1); buehne.kap(126, 63, 110, 80, 1, 1);
      for (let x = 54; x <= 132; x += 13) buehne.kap(x, 60, x, 47, .6, .6);
      buehne.kap(53, 47, 133, 47, .7, .7); buehne.kap(53, 53, 133, 53, .4, .4);
      K.form(buehne, 0, { k: NASS.slice(0, 5), r: RAND, ton: 1.4, fase: 0, rand: 1, lichtVon: [lx, ly] });
      // Der Herr: Zylinder, Gehrock, Gamaschen, über das Okular gebeugt
      const fx = 86, fy = 60;
      const fig = K.figurMaske(fx, fy, 30, { kopf: 'hut', blick: 1, neig: 2.5, kopfDreh: 1.5, arme: [[fx + 9, fy - 19], [fx + 7, fy - 16]], ellbogen: [[fx + 6, fy - 15], [fx + 5, fy - 13]], weit: .85, spreiz: 2 });
      const kx = fig.kopf[0], ky = fig.kopf[1];
      fig.rect(kx - 2.3, ky - 9.5, 4.6, 5);                        // hoher Zylinder
      fig.poly([[fx - 3, fy - 12], [fx - 7, fy - 3], [fx - 2, fy - 5]]);   // Rockschoß hinten
      K.form(fig, 0, { k: NASS.slice(0, 4), ton: .9, rand: 1, r: RAND });
      K.kante(fig, lx, ly, 46, WARM, { nah: .5 });
      // Backenbart: zwei helle Pixel an der Wange im Lampenlicht
      K.set(kx + 1, ky + 1, '#8a7a5a'); K.set(kx + 1, ky + 2, '#6a5a40');
      // Theodolit auf dem Dreibein
      const tx = 100, th = K.maske(); th.kap(tx, 44, tx - 5, 60, .5, .5); th.kap(tx, 44, tx + 5, 60, .5, .5); th.kap(tx, 44, tx, 60, .5, .5);
      th.rect(tx - 2, 40, 4, 4); th.kap(tx - 4, 39, tx + 4, 38, 1.2, 1); th.ell(tx, 37, 1.6, 1);
      K.form(th, 0, { k: BLANK.slice(0, 4), r: MESS, ton: 2, fase: 0, rand: 1, lichtVon: [lx, ly] });
      K.set(tx - 4, 39, '#e6c88a');
      // Laterne am Geländer
      K.laterne(lx, ly + 2, .9, { hof: 54, staerke: .85 });
      K.vignette(.6, { cx: 92, cy: 52 });
    },

    // Ein Zahnrad, dessen Zähne höher sind als Häuser, ein bronzener Zeiger, eine winzige Gestalt in einer Zahnlücke voll Wasser.
    gezeitenwerk_hauptrad(K) {
      const { B } = K;
      // heller Dunst hinter dem Rad (Gischt vom Zulauf), damit das Rad als Silhouette steht
      const HELL = DUNST.concat(['#335f45', '#437556']);
      K.fuell(HELL, (x, y) => ruhig(.1 + Math.pow(Math.max(0, 1 - Math.hypot(x - 80, (y - 40) * 1.1) / 120), 1) * .95, HELL.length - 1, .08));
      // Das Rad: Kreis mit Zähnen am Rand, Speichen zur Nabe (unter dem Bildrand), Löcher dazwischen
      const cx = 80, cy = 150, R = 112, th = 16, n = 32, sp = 9, kr = 18;
      const lx = 80, gapC = .775;
      const rot = ((gapC * TAU / n) - Math.atan2(-1, 0)) % TAU;
      const fA = (x, y) => ((((Math.atan2(y - cy, x - cx) + rot) / TAU * n) % 1) + 1) % 1;
      const rad = K.maske(), wasser = K.maske();
      rad.fn(-2, 0, 162, 92, (x, y) => {
        const rr = Math.hypot(x - cx, y - cy); if (rr > R + th) return false;
        if (rr > R) { const f = fA(x, y), z = f < .1 ? f / .1 : f < .45 ? 1 : f < .55 ? 1 - (f - .45) / .1 : 0; return rr < R + th * z; }
        if (rr > R - kr) return true;
        const a = Math.atan2(y - cy, x - cx) + .17, s2 = ((a / TAU * sp) % 1 + 1) % 1, d = Math.min(s2, 1 - s2) * TAU / sp * rr; return d < 6 + (R - rr) * .04;
      });
      // Wasser in den Zahnlücken oben (die Lücken öffnen sich nach oben wie Becken): Fläche bis knapp unter die Zahnspitzen
      wasser.fn(-2, 0, 162, 70, (x, y) => { const rr = Math.hypot(x - cx, y - cy); return !rad.has(x, y) && rr > R - 1 && rr < R + th * .6 && Math.abs(x - cx) < 74; });
      const nah = x => Math.max(0, 1 - Math.abs(x - lx) / 12);
      K.feld(-2, 0, 162, 60, WASSER, (x, y) => wasser.has(x, y) ? ruhig(.25 + nah(x) * .75, WASSER.length - 1) : -1);
      for (let x = 0; x < 160; x++) for (let y = 0; y < 60; y++) if (wasser.has(x, y)) { K.set(x, y, nah(x) > .1 ? PHOS_K : WASSER[6]); break; }
      leuchten(K, 0, 0, 160, 60, (x, y) => wasser.has(x, y) ? nah(x) * 8 + .3 : 0);
      K.licht(lx, cy - R - 6, 40, PHOS_G, 1, { ohne: wasser });
      K.form(rad, 0, { k: BRONZE.slice(0, 5), r: RAND, ton: 1.2, fase: 1.5, rand: 2, schatten: 2, verlauf: 1, lichtVon: [lx, 10],
        muster: (x, y) => { const rr = Math.hypot(x - cx, y - cy); return (Math.abs(rr - (R - kr)) < 1 ? -1.2 : 0) + (rr > R ? .4 : 0); } });
      K.kante(rad, lx, cy - R - 6, 40, [PHOS_M, PHOS], { nah: .3 });
      // Der Zeiger aus Bronze: hängt von oben herab und zeigt auf die Lücke
      const z = K.maske(); z.poly([[lx - 4, -2], [lx + 4, -2], [lx + 1.6, 20], [lx, 26], [lx - 1.6, 20]]); z.ell(lx, 4, 5, 5);
      K.form(z, 0, { k: BRONZE.slice(0, 5), r: MESS, ton: 1.6, fase: 1, rand: 2, lichtVon: [lx + 30, 30] });
      const zn = K.maske(); zn.ell(lx, 4, 2, 2); K.form(zn, 0, { k: BLANK, r: MESS, ton: 2.4, fase: 0, rand: 1 });
      // Die winzige Gestalt steht bis zu den Knien im Wasser der Lücke
      const wy = cy - R - 2;
      const fig = K.figurMaske(lx + 1, wy, 12, { kopf: 'hut', blick: -1 });
      K.form(fig, 0, { k: ['#000000', '#020403', '#040907'], ton: .6, rand: 0 });
      K.kante(fig, lx, wy + 2, 14, [PHOS_M, PHOS]);
      K.vignette(.45, { cx: 82, cy: 40 });
    },

    // Ein schräger Kanal, in dem das Wasser nach oben fließt, ein Schleusentor aus Bronze mit großem Handrad, ein dunkler Leib im Wasser.
    gezeitenwerk_schleuse(K) {
      const { B } = K;
      const gx = 102, gy = 60;   // Leuchten am Fuß des Tors, wo das Wasser in die Kammer drückt (die helle Stelle)
      // Hintergrund: ruhiges, nasses Schwarzgrün
      K.fuell(NASS, (x, y) => ruhig(.15 + Math.max(0, 1 - Math.hypot(x - gx, y - gy) / 110) * .35, NASS.length - 1));
      // Kanal: von links unten schräg hinauf nach rechts zum Tor; obere Kanalmauer als Bronzeband
      const steig = .27, oben = x => 58 - x * steig, unten = x => 92 - x * steig * .3;
      const wand = K.maske(); wand.fn(0, 0, 104, 90, (x, y) => y < oben(x) && y >= oben(x) - 9);
      K.form(wand, 0, { k: BRONZE.slice(0, 6), r: RAND, ton: 2, fase: 1, rand: 1, L: [0, -1], lichtVon: [gx, gy], muster: (x, y) => ((x % 18) < 1 ? -.9 : 0) });
      const kan = K.maske(); kan.fn(0, 0, 104, 92, (x, y) => y >= oben(x) && y < unten(x));
      // Wasser: ruhig, zum Tor hin heller
      const LW = (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - gx, (y - gy) * 1.3) / 120), 1.2);
      K.feld(0, 0, 104, 92, WASSER, (x, y) => kan.has(x, y) ? ruhig(.12 + LW(x, y) * .75, WASSER.length - 1, .12) : -1);
      // Zwei, drei lange Leuchtschlieren laufen bergauf, zum Tor hin heller
      for (const [x0, dy, len] of [[4, 6, 92], [20, 20, 78], [0, 28, 60]]) {
        for (let x = x0; x < x0 + len && x < 103; x++) {
          const y = Math.round(oben(x) + dy + Math.sin(x * .12 + dy) * 1.2);
          if (!kan.has(x, y)) continue;
          const q = (x - x0) / len; if (B.bay(x, y) > .35 + q) continue;
          K.set(x, y, q > .85 ? PHOS_K : q > .5 ? PHOS : PHOS_M);
        }
      }
      // Der dunkle Leib: lang, regungslos, im Strom vor dem Tor; Rückenkamm bricht die Oberfläche
      const leib = K.maske();
      leib.pfad([[12, 80], [30, 74], [50, 68], [70, 62], [88, 57]], 7, 5); leib.ell(92, 56, 6, 4.6);
      leib.poly([[14, 80], [2, 72], [6, 82], [2, 90]]);   // Schwanzflosse
      for (let i = 0; i < 9; i++) { const x = 24 + i * 7.4, y = oben(x) + 15 - (x - 12) * .03; leib.poly([[x - 3, y + 3], [x + 1.5, y - 5 - (i % 2) * 2], [x + 4, y + 3]]); }
      K.form(leib, 0, { k: ['#000000', '#010202', '#030605', '#071009'], ton: 1.2, fase: 0, rand: 0, verlauf: -1.4 });
      K.kante(leib, gx + 4, gy - 30, 140, [PHOS_M, PHOS_K], { min: .1, nah: .45 });
      // Wasserlinie: heller Saum, wo der Leib die Oberfläche bricht
      for (let x = leib.x0; x <= leib.x1; x++) for (let y = leib.y1; y >= leib.y0; y--) if (leib.has(x, y) && !leib.has(x, y + 1) && kan.has(x, y + 1)) { if (B.bay(x, y) < .6) K.set(x, y + 1, PHOS_M); break; }
      // Das Schleusentor: große Bronzefläche mit Nietreihen, rechts im Bild
      const tx0 = 102;
      const tor = K.maske(); tor.rect(tx0, 4, 58, 82);
      K.form(tor, 0, { k: BRONZE.slice(1).concat(['#4c7a5c']), r: RAND, ton: 5, fase: 1, rand: 2, schatten: 2, lichtVon: [gx - 10, gy], verlauf: -.5, verlaufX: -1.2, muster: (x, y) => ((y - 4) % 20 < 1 ? -1 : 0) + ((x - tx0) % 29 < 1 ? -.8 : 0) });
      for (let y = 8; y < 86; y += 20) for (let x = tx0 + 4; x < 160; x += 6) { K.set(x, y, BRONZE[7]); K.set(x + 1, y + 1, BRONZE[0]); }
      K.licht(gx, gy, 60, PHOS_G, 1, { oval: .8, exp: 1.2 });
      // Das Handrad: groß vor dem Tor, sieben Speichen und sieben Fingermulden am Kranz
      const hx = 130, hy = 38, hr = 21;
      const achse = K.maske(); achse.ell(hx + 2, hy + 2, 5, 5); K.form(achse, 0, { k: BRONZE.slice(0, 4), r: [], ton: 1, fase: 0, rand: 0 });
      const hrad = K.maske(); hrad.ell(hx, hy, hr, hr); hrad.ell(hx, hy, hr - 3.4, hr - 3.4, 0);
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU - .3; hrad.kap(hx, hy, hx + Math.cos(a) * (hr - 2), hy + Math.sin(a) * (hr - 2), 1.6, 1.1); }
      hrad.ell(hx, hy, 4, 4);
      K.form(hrad, 0, { k: BLANK, r: MESS, ton: 2.2, fase: 1, rand: 2, schatten: 2, lichtVon: [gx - 10, gy] });
      K.kante(hrad, gx - 6, gy, 70, [PHOS_M, PHOS], { nah: .4 });
      for (let i = 0; i < 7; i++) { const a = (i + .5) / 7 * TAU - .3, m = K.maske(); m.ell(hx + Math.cos(a) * (hr - 1.7), hy + Math.sin(a) * (hr - 1.7), 1.4, 1.4); K.form(m, 0, { k: ['#0e0b05', '#2a2210'], r: [], ton: 1, fase: 0, rand: 0 }); }
      // Leuchten am Fuß des Tors, wo das Wasser hineindrückt
      const kern = K.maske(); kern.ell(gx - 2, gy + 6, 5, 2.2); K.form(kern, 0, { k: [PHOS_M, PHOS, PHOS_K], r: [], ton: 2, fase: 0, rand: 0 });
      K.vignette(.35, { cx: 96, cy: 50, innen: .65 });
    },

    // Ein Gewölbe mit Reihen großer Tonkrüge, deren Inhalt grünlich glimmt, lange Ölkannen an Haken an der Wand.
    gezeitenwerk_oelkammer(K) {
      const { B } = K;
      const vx = 70, vy = 40;
      // Gewölbe in Flucht: Bögen hintereinander, Wände dunkel
      K.fuell(NASS, (x, y) => .18 + Math.max(0, 1 - Math.hypot(x - vx, y - vy) / 90) * .2 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .15);
      for (let i = 0; i < 5; i++) {
        const s = Math.pow(.62, i), w = 90 * s, h = 70 * s, by = vy + 50 * s;
        const b = K.maske(); b.fn(vx - w - 6 * s, by - h - 8 * s, vx + w + 6 * s, by, (x, y) => { const q = Math.hypot((x - vx) / (w + 5 * s), (y - (by - h * .45)) / (h * .55 + 5 * s)); const qi = Math.hypot((x - vx) / w, (y - (by - h * .45)) / (h * .55)); return y < by - h * .45 ? q < 1 && qi >= 1 : Math.abs(x - vx) < w + 5 * s && Math.abs(x - vx) >= w; });
        K.form(b, Math.min(.8, i * .2), { k: BRONZE.slice(0, 6), r: RAND, ton: 1.6, fase: 1, rand: 1, L: [0, 1], muster: (x, y) => ((x + y) % 9 < 1 ? -.5 : 0) });
      }
      // Boden
      K.feld(0, 66, 160, 90, NASS, (x, y) => .2 + (y - 66) / 40 * .3 + (B.fbm(x * .1, y * .3, 3, 2) - .5) * .2);
      // Ausgüsse an Haken an der linken Wand: lang wie Speere, einer tropft
      for (let i = 0; i < 4; i++) {
        const x = 8 + i * 7, y = 14 + i * 1.5, m = K.maske();
        m.kap(x, y, x + 2, y + 44 - i * 6, .8, .6); m.ell(x + .5, y + 2, 1.8, 2.2); K.set(x - 1, y - 2, BRONZE[6]);
        K.form(m, i * .1, { k: BRONZE.slice(1), r: MESS, ton: 2, fase: 0, rand: 1, lichtVon: [120, 60] });
        if (i === 2) { K.set(x + 2, y + 44 - i * 6 + 2, PHOS_M); K.set(x + 2, y + 44 - i * 6 + 6, PHOS); }
      }
      // Krüge in Reihen: hinten klein, vorn groß; jeder glimmt aus der Öffnung
      const krug = (x, yb, s, glimm) => {
        const m = K.maske(); m.ell(x, yb - 9 * s, 7 * s, 8.5 * s); m.poly([[x - 4 * s, yb - 3 * s], [x + 4 * s, yb - 3 * s], [x + 2 * s, yb], [x - 2 * s, yb]]);
        m.rect(x - 3.2 * s, yb - 20 * s, 6.4 * s, 4 * s); m.ell(x, yb - 20 * s, 4 * s, 1.3 * s);
        const T = ['#0c0806', '#1a1008', '#2a1a0e', '#3e2816', '#563820'];
        K.form(m, 0, { k: T, r: [PHOS_G, PHOS_M], ton: 2 + glimm, fase: 1, rand: 1, L: [0, -1], verlauf: 1.2, schatten: 2 });
        const o = K.maske(); o.ell(x, yb - 20 * s, 3 * s, .9 * s + .3);
        K.form(o, 0, { k: ['#28400e', '#4a6a18', '#7aa830', '#d4ff5a'], r: [], ton: 1 + glimm * 2.5, fase: 0, rand: 0 });
        K.licht(x, yb - 22 * s, 16 * s, PHOS_G, .5 + glimm * .5);
      };
      const reihen = [[.32, 54, [52, 62, 78, 88]], [.5, 60, [40, 54, 86, 100]], [.75, 70, [24, 46, 98, 120]], [1.25, 90, [130]]];
      for (const [s, yb, xs] of reihen) for (const x of xs) krug(x, yb, s, s > 1 ? 1 : .25 + s * .3);
      K.set(130, 90 - 25 - 2, PHOS_K);
      K.vignette(.6, { cx: 90, cy: 50 });
    },

    // Ein Feldzelt aus Segeltuch unter Bronzezähnen, ein aufgeschlagenes Buch, dessen Seiten in einem Strom über den Boden fließen.
    gezeitenwerk_logbuch(K) {
      const { B } = K;
      K.fuell(DUNST, (x, y) => .12 + (1 - y / 90) * .25 + (B.fbm(x * .02, y * .04, K.seed, 2) - .5) * .12);
      // Zähne eines Rades hängen von oben ins Bild
      zahnrad(K, 80, -150, 190, { n: 44, th: 30, kranz: 40, voll: true, tiefe: .3, ton: 1.4 });
      K.nebel(30, 70, .3, DUNST[3]);
      // Boden aus nassen Bronzeplatten
      K.feld(0, 60, 160, 90, NASS, (x, y) => .2 + (y - 60) / 40 * .25 + ((x + (y - 60) * 1.2) % 22 < 1 ? -.15 : 0));
      // Das Zelt: Dreieck aus Segeltuch, vorn offen, innen die Lampe
      const zx = 58, zy = 66, zh = 38, zw = 30, lx = zx + 4, ly = zy - 10;
      const zelt = K.maske(); zelt.poly([[zx - zw, zy], [zx, zy - zh], [zx + zw, zy]]);
      const innen = K.maske(); innen.poly([[zx - 13, zy], [zx, zy - zh + 6], [zx + 15, zy]]);
      const TUCH = ['#1a1a10', '#2e2c1a', '#4a4428', '#6a603a', '#8e8050', '#b4a068'];
      K.form(zelt, 0, { k: TUCH, r: ['#8e8050', '#d8c890'], ton: 2.2, fase: 1, rand: 1, lichtVon: [lx, ly], verlauf: -.4, muster: (x, y) => (Math.abs(x - zx) < 1 ? .5 : 0) + (Math.sin((x - zx) * .8 + y * .1) > .8 ? -.4 : 0) });
      K.feld(zx - 15, zy - zh, zx + 16, zy + 1, ['#0e0a04', '#2a1a08', '#5a3a12', '#8a5a1c'], (x, y) => innen.has(x, y) ? .15 + Math.max(0, 1 - Math.hypot(x - lx, y - ly) / 18) * .9 : -1);
      // Tisch mit dem aufgeschlagenen Buch
      const tisch = K.maske(); tisch.rect(zx - 9, zy - 8, 20, 2); tisch.rect(zx - 8, zy - 6, 1.5, 6); tisch.rect(zx + 8, zy - 6, 1.5, 6);
      K.form(tisch, 0, { k: ['#0a0604', '#1a1008', '#2e1e10'], r: WARM, ton: 1.5, fase: 0, rand: 1, lichtVon: [lx, ly] });
      // Die Seiten: ein Strom aus Blättern vom Tisch über den Boden bis vor den Betrachter
      const PAP = ['#2a2a1e', '#5a5840', '#8e8a68', '#c8c298', '#ece6c4'];
      const strom = t => [B.lerp(zx + 2, 140, t) + Math.sin(t * 5) * 8 * t, B.lerp(zy - 9, 88, Math.pow(t, .8))];
      for (let i = 0; i < 46; i++) {
        const t = i / 46, [x, y] = strom(t), w = 2.5 + t * 6, h = 1 + t * 2.4, m = K.maske(), a = Math.sin(i * 1.7) * .5;
        m.poly([[x - w, y - h + a * w], [x + w, y - h - a * w], [x + w * .9, y + h - a * w], [x - w * .9, y + h + a * w]]);
        K.form(m, Math.max(0, .3 - t * .5), { k: PAP, r: ['#ece6c4', '#ffffff'], ton: 1.8 + (1 - t) * 1.6 - t * .4, fase: 0, rand: 1, lichtVon: [lx, ly] });
        if (w > 4) K.schrift(Math.round(x - w + 2), Math.round(y), Math.round(x + w - 2), '#2a2a1e', { min: 1, max: 3 });
      }
      // die Lampe im Zelt
      K.laterne(lx, ly + 1, .85, { hof: 60, staerke: .8 });
      K.vignette(.6, { cx: 76, cy: 54 });
    },

    // Ein gemauertes Staubecken, schwarzes Wasser bis an den Rand, ein eisernes Schütz in der Mauer mit Handrad auf einem Gerüst darüber, rechts ein Pegelstab aus Messing.
    gezeitenwerk_staubecken(K) {
      const { B } = K;
      const wy = 40;   // Wasserspiegel, genau an der Mauerkrone
      // Raum hinter dem Becken: ruhiges Nassgrün, das Phosphorlicht kommt vom Wasser
      K.fuell(NASS, (x, y) => ruhig(.1 + Math.max(0, 1 - Math.hypot(x - 80, (y - wy) * 1.4) / 120) * .5, NASS.length - 1));
      // Ferne Pfeiler
      for (const x of [14, 40, 106, 140]) { const p = K.maske(); p.rect(x, 0, 5, wy); K.form(p, .6, { k: BRONZE.slice(0, 5), r: RAND, ton: 1.2, fase: 0, rand: 1, L: [0, 1] }); }
      // Wasser: schwarz, glatt, gewölbt bis zur Krone; Phosphorfunken nur in der Tiefe
      const was = K.maske(); was.rect(0, wy - 5, 160, 6); was.ell(80, wy - 3, 90, 5);
      K.form(was, 0, { k: ['#000101', '#010404', '#020807', '#04100d'], r: [], ton: .8, fase: 0, rand: 0, verlauf: .4 });
      for (let x = 0; x < 160; x++) { const q = Math.abs(x - 80) / 80, y = Math.round(wy - 8 + q * q * 5); if (B.bay(x, y) < .75) K.set(x, y, x % 5 < 2 ? '#2a5a46' : '#10281f'); }
      leuchten(K, 0, wy - 8, 160, wy, (x, y) => .8 + Math.exp(-(((x - 80) / 50) ** 2)));
      // Mauer des Beckens: grünliche Bronzequader, unten im Dunkel
      K.mauer(0, wy, 160, 90, BRONZE, { hoehe: 7, breite: 18, ton: .36, tf: (x, y) => -(y - wy) * .004 - Math.abs(x - 80) * .0022 });
      const krone = K.maske(); krone.rect(0, wy, 160, 3);
      K.form(krone, 0, { k: BRONZE.slice(2, 8), r: RAND, ton: 1.8, fase: 1, rand: 1, L: [0, -1], schatten: 2 });
      // Das Schütz: schmaler Schlitz in der Mauer, darin eine eiserne Platte mit Nietreihen, links und rechts Führungsschienen
      K.feld(54, wy + 3, 90, 90, DUNST.slice(0, 3), () => 0);
      const sch = K.maske(); sch.rect(57, wy + 6, 30, 38);
      K.form(sch, 0, { k: ['#05090a', '#0c1410', '#16241d', '#26382c', '#3a5240'], r: RAND, ton: 2.6, fase: 1, rand: 1, L: [0, -1], schatten: 2, lichtVon: [72, wy], verlauf: -.4, muster: (x, y) => ((y - wy) % 12 < 1 ? -.9 : 0) });
      for (const x of [59, 84]) for (let y = wy + 9; y < wy + 44; y += 6) { K.set(x, y, '#5a8a6a'); K.set(x + 1, y + 1, '#050a08'); }
      for (const x of [55, 89]) { const s = K.maske(); s.rect(x, wy + 3, 3, 44); K.form(s, 0, { k: BRONZE.slice(1, 7), r: RAND, ton: 2, fase: 0, rand: 1, L: [0, -1] }); }
      // Wasser drückt: dünne Rinnsale am Schützrand, ein Tropfen mit Phosphor am Fuß
      for (const [x, l] of [[58, 14], [86, 9], [72, 20]]) for (let j = 0; j < l; j++) if (j % 3 !== 2) K.set(x, wy + 4 + j, j > l - 4 ? PHOS_M : '#0a1c16');
      K.set(86, wy + 14, PHOS); K.set(58, wy + 19, PHOS_K);
      // Gerüst über dem Schütz: zwei Pfosten, Querbalken, Spindel
      for (const x of [51, 89]) { const p = K.maske(); p.rect(x, 12, 4, wy - 10); K.form(p, 0, { k: BRONZE.slice(0, 6), r: RAND, ton: 2, fase: 1, rand: 1, L: [0, -1], schatten: 2 }); }
      const qb = K.maske(); qb.rect(48, 10, 48, 5); K.form(qb, 0, { k: BRONZE.slice(1, 8), r: RAND, ton: 2, fase: 1, rand: 1, L: [0, -1] });
      const sp = K.maske(); sp.kap(71, 15, 71, wy + 8, 1.3, 1.3); K.form(sp, 0, { k: BRONZE.slice(2, 8), r: MESS, ton: 1.6, fase: 0, rand: 1, L: [1, 0] });
      // Handrad: groß, von vorn, sechs Speichen, Messing; warm im Randlicht
      const hx = 71, hy = 27, hr = 12;
      const rad = K.maske(); rad.ell(hx, hy, hr, hr); rad.ell(hx, hy, hr - 2.6, hr - 2.6, 0);
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + .3; rad.kap(hx, hy, hx + Math.cos(a) * (hr - 1), hy + Math.sin(a) * (hr - 1), 1.1, .9); }
      rad.ell(hx, hy, 3, 3);
      K.form(rad, 0, { k: BLANK, r: MESS, ton: 2.2, fase: 1, rand: 1, schatten: 2, lichtVon: [80, wy] });
      K.kante(rad, hx + 6, hy + 14, 40, [WARM[0], WARM[1]], { min: .1, nah: .5 });
      K.set(hx, hy, '#ffd27a');
      // Pegelstab rechts: Messingstab mit Strichen, die große Marke genau am Wasserspiegel (Flut)
      const px = 124;
      const stab = K.maske(); stab.rect(px, 8, 4, 82);
      K.form(stab, 0, { k: ['#2a2210', '#4a3a1a', '#7a6230', '#a8823e', '#e6c88a'], r: MESS, ton: 2.4, fase: 0, rand: 1, L: [-1, 0] });
      for (let y = 12; y < 88; y += 4) { const lang = ((y - 12) % 16) === 0; K.linie(px - (lang ? 6 : 3), y, px - 1, y, y < wy ? '#e6c88a' : '#5a4a22'); }
      const pl = K.maske(); pl.poly([[px - 11, wy - 5], [px, wy - 5], [px, wy + 3], [px - 11, wy + 3], [px - 14, wy - 1]]);
      K.form(pl, 0, { k: ['#2a2210', '#4a3a1a', '#7a6230', '#a8823e', '#e6c88a'], r: MESS, ton: 2.8, fase: 1, rand: 1, L: [0, -1] });
      K.set(px - 11, wy - 1, '#1a1308'); K.set(px - 9, wy - 1, '#1a1308'); K.set(px - 7, wy - 1, '#1a1308'); K.set(px - 5, wy - 1, '#1a1308');
      K.licht(80, wy - 4, 100, PHOS_G, .8, { oval: 2.2 });
      K.lichtquelle(80, wy - 6);
      K.vignette(.5, { cx: 80, cy: 46 });
    },
  },
};
