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
    const u0 = (-3.3 + i * 1.1) * s, l = [2.6, 3.8, 4.8, 5.4, 4.8, 3.8, 2.6][i] * s;
    const a = T(u0, -2 * s), b = T(u0 + (i - 3) * l * .07, -2 * s - l);
    m.kap(a[0], a[1], b[0], b[1], Math.max(.5, .5 * s), Math.max(.5, .45 * s)); kuppen.push(b);
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
const lichtF = (lx, ly, r, ov, ex) => (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * (ov || 1)) / r), ex || 1.4);

module.exports = {
  biom: 'gezeitenwerk',
  bilder: {
    // Ein riesiger Bronzehebel vor dunkler Wand, darunter grün verkrustete Fläche voller leuchtender Handabdrücke mit sieben Fingern.
    gezeitenwerk_abdruecke(K) {
      const { B } = K;
      // Wand: Bronzeplatten mit Nieten, dunkel
      K.fuell(BRONZE.slice(0, 6), (x, y) => .12 + (y / 90) * .15 + (x % 32 < 1 || y % 24 < 1 ? -.12 : 0) + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .12);
      for (let y = 4; y < 46; y += 24) for (let x = 4; x < 160; x += 8) if (B.hash(x, y, 2) > .2) { K.set(x, y, BRONZE[6]); K.set(x + 1, y + 1, BRONZE[0]); }
      // Kruste unten, schräg in Aufsicht
      gruenspan(K, 0, 44, 160, 90, (x, y) => (y - 44) / 70 * .4);
      const kante = K.maske(); kante.rect(0, 43, 160, 2); K.form(kante, 0, { k: BRONZE.slice(2, 8), r: RAND, ton: 2, fase: 0, rand: 1, L: [0, -1] });
      // Der Hebel: Drehlager links, Stange schräg nach oben rechts, Griff blank gegriffen
      const lager = K.maske(); lager.ell(24, 46, 11, 8); lager.rect(10, 46, 28, 7);
      K.form(lager, 0, { k: BRONZE.slice(1, 8), r: RAND, ton: 2.2, fase: 1, rand: 2, schatten: 2, L: [.6, -.8] });
      const hebel = K.maske(); hebel.kap(26, 44, 120, 4, 4.2, 3);
      K.form(hebel, 0, { k: BRONZE.slice(1, 8), r: RAND, ton: 2.4, fase: 1, rand: 2, schatten: 2, L: [.6, -.8], muster: (x, y) => (B.fbm(x * .1, y * .1, 3, 2) - .5) * .8 });
      const griff = K.maske(); griff.kap(108, 9, 130, 0, 3.6, 3.6);
      K.form(griff, 0, { k: BLANK, r: MESS, ton: 3, fase: 1, rand: 2, L: [.6, -.8], muster: (x, y) => ((x + y) % 4 === 0 ? -.6 : 0) });
      const nabe = K.maske(); nabe.ell(26, 44, 4, 4); K.form(nabe, 0, { k: BLANK, r: MESS, ton: 2, fase: 0, rand: 1 });
      // Abdrücke: groß, deutlich sieben Finger, in alle Richtungen gedrückt; der letzte vorn kleiner und hell
      const plaetze = [[16, 70, 1.5, .5, .35], [44, 60, 1.25, -.3, .3], [70, 74, 1.7, .2, .4], [100, 58, 1.2, .6, .3], [126, 70, 1.6, -.5, .35], [150, 56, 1.1, .1, .25], [56, 86, 1.8, -.1, .3], [138, 88, 1.7, .3, .3], [84, 52, .95, -.7, .22]];
      for (const [x, y, s, w, st] of plaetze) abdruck(K, x, y, s, w, st);
      abdruck(K, 102, 84, 1.05, -.12, 1);
      K.vignette(.6, { cx: 84, cy: 56 });
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
      // heller Dunst hinter dem Rad (Gischt vom Zulauf), damit Zähne und Gestalt als Silhouetten stehen
      K.fuell(DUNST.concat(['#335f45', '#437556']), (x, y) => .2 + Math.max(0, 1 - Math.hypot(x - 84, (y - 40) * 1.3) / 100) * .65 + (B.fbm(x * .02, y * .04, K.seed, 2) - .5) * .15);
      // Kranz des Hauptrads als Bogen unten, wenige riesige Zähne ragen hoch auf
      const cx = 80, cy = 300, R = 236, n = 64, th = 44, lx = 80;
      const rot = -(Math.atan2(-1, 0)) - (.29 / n) * TAU;   // eine Lücke genau unter dem Zeiger
      const winkelF = (x, y) => ((((Math.atan2(y - cy, x - cx) + rot) / TAU * n) % 1) + 1) % 1;
      const rad = K.maske(), luecken = K.maske();
      rad.fn(-2, 10, 162, 90, (x, y) => {
        const rr = Math.hypot(x - cx, y - cy); if (rr > R + th) return false; if (rr <= R) return true;
        const f = winkelF(x, y), z = f < .06 ? f / .06 : f < .5 ? 1 : f < .56 ? 1 - (f - .5) / .06 : 0; return rr < R + th * z;
      });
      luecken.fn(-2, 10, 162, 90, (x, y) => { const rr = Math.hypot(x - cx, y - cy); return rr > R && rr < R + th * .5 && !rad.has(x, y); });
      // Wasser in den Lücken, dunkel; in der Lücke unter dem Zeiger leuchtet es
      const nah = (x, y) => Math.max(0, 1 - Math.abs(x - lx) / 16);
      K.feld(-2, 10, 162, 90, WASSER, (x, y) => luecken.has(x, y) ? .2 + nah(x, y) * .75 + (Math.sin(x * .8 + y * 2) > .8 ? .1 : 0) : -1);
      leuchten(K, 0, 10, 160, 90, (x, y) => luecken.has(x, y) ? .4 + nah(x, y) * 7 : 0);
      for (let x = 0; x < 160; x++) for (let y = 10; y < 90; y++) if (luecken.has(x, y) && !luecken.has(x, y - 1)) { K.set(x, y, nah(x, y) > .2 ? PHOS_K : WASSER[6]); break; }
      K.licht(lx, 58, 40, PHOS_G, 1, { oval: .9 });
      K.form(rad, 0, { k: BRONZE.slice(0, 6), r: RAND, ton: 1.6, fase: 1.5, rand: 2, schatten: 2, verlauf: .9, lichtVon: [lx, 30], muster: (x, y) => (B.fbm(x * .06, y * .06, 7, 2) - .5) * .9 + (Math.abs(Math.hypot(x - cx, y - cy) - (R - 7)) < 1 ? -1 : 0) });
      // Der Zeiger aus Bronze: hängt von oben herab und zeigt auf die Lücke
      const z = K.maske(); z.poly([[lx - 4, -2], [lx + 4, -2], [lx + 1.6, 32], [lx, 40], [lx - 1.6, 32]]); z.ell(lx, 6, 5, 5);
      K.form(z, 0, { k: BRONZE.slice(0, 5), r: MESS, ton: 1.4, fase: 1, rand: 2, lichtVon: [lx + 20, 60] });
      const zn = K.maske(); zn.ell(lx, 6, 2, 2); K.form(zn, 0, { k: BLANK, r: MESS, ton: 2.4, fase: 0, rand: 1 });
      // Die winzige Gestalt am Rand der Lücke, gegen das Leuchten
      const wy = Math.round(cy - Math.sqrt((R + th * .5) ** 2 - (lx - cx) ** 2));
      const fig = K.figurMaske(lx - 2, wy + 3, 12, { kopf: 'hut', blick: 1 });
      K.form(fig, 0, { k: ['#000000', '#020403', '#040907'], ton: .6, rand: 0 });
      K.kante(fig, lx + 2, wy + 2, 12, [PHOS_M, PHOS]);
      K.vignette(.55, { cx: 82, cy: 54 });
    },

    // Ein schräger Kanal, in dem das Wasser nach oben fließt, ein Schleusentor aus Bronze mit großem Handrad, ein dunkler Leib im Wasser.
    gezeitenwerk_schleuse(K) {
      const { B } = K;
      K.fuell(NASS, (x, y) => .2 + (B.fbm(x * .04, y * .04, K.seed, 2) - .5) * .2 + (x % 28 < 1 ? -.1 : 0));
      // Kanal: von links unten schräg hinauf nach rechts zum Tor; Mauern links/rechts
      const kan = K.maske(); kan.poly([[0, 90], [0, 74], [110, 34], [124, 40], [124, 52], [44, 90]]);
      const tor = { x: 112, y0: 14, y1: 58 };
      // Seitenwände des Kanals
      const wand = K.maske(); wand.poly([[0, 66], [108, 26], [112, 34], [0, 76]]);
      K.form(wand, 0, { k: BRONZE.slice(0, 6), r: RAND, ton: 1.8, fase: 1, rand: 1, L: [0, -1], muster: (x, y) => ((x + Math.round(y * 2.7)) % 14 < 1 ? -.8 : 0) });
      // Wasser im Kanal: leuchtende Schlieren laufen bergauf (zum Tor hin heller)
      const LW = (x, y) => Math.max(0, x / 124);
      K.feld(0, 30, 130, 90, WASSER, (x, y) => kan.has(x, y) ? .15 + LW(x, y) * .55 + (Math.sin((x * .9 + y * 2.4) * .35 + Math.sin(y * .7) * 2) > .7 ? .2 : 0) : -1);
      for (let i = 0; i < 40; i++) {
        let x = K.r.f(4, 110), y = 0; const y0 = 74 - x * .37 + K.r.f(2, 14);
        const len = K.r.f(4, 10);
        for (let k = 0; k < len; k++) { const px = x + k * 1.6, py = y0 - k * .6; if (!kan.has(px, py)) break; K.set(px, py, k > len - 2 ? PHOS : PHOS_M); }
      }
      // Der dunkle Leib im Wasser: lang, regungslos, schräg im Strom vor dem Tor
      const leib = K.maske(); leib.pfad([[54, 66], [70, 58], [86, 52], [100, 47]], 3.2, 2); leib.ell(102, 46, 3, 2.4);
      K.form(leib, 0, { k: ['#000000', '#010202', '#030505'], ton: .8, fase: 0, rand: 0 });
      K.kante(leib, 116, 44, 70, [PHOS_M, PHOS], { min: -.3 });
      // Das Schleusentor: Bronzeplatte, Nieten, das Handrad mit sieben Speichen und Fingermulden
      const t = K.maske(); t.rect(tor.x, tor.y0, 48, tor.y1 - tor.y0); t.rect(tor.x - 4, tor.y0 - 4, 52, 5);
      K.form(t, 0, { k: BRONZE, r: RAND, ton: 2.4, fase: 1, rand: 2, schatten: 2, L: [-.8, -.6], muster: (x, y) => ((y - tor.y0) % 11 < 1 ? -.8 : 0) + (B.fbm(x * .1, y * .1, 4, 2) - .5) * .8 });
      const hx = 136, hy = 32, hr = 12;
      const hrad = K.maske(); hrad.ell(hx, hy, hr, hr); hrad.ell(hx, hy, hr - 2.2, hr - 2.2, 0);
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU - .3; hrad.kap(hx, hy, hx + Math.cos(a) * (hr - 1), hy + Math.sin(a) * (hr - 1), 1, .8); }
      hrad.ell(hx, hy, 2.6, 2.6);
      K.form(hrad, 0, { k: BRONZE.slice(1), r: MESS, ton: 3, fase: 1, rand: 2, schatten: 2, L: [-.8, -.6] });
      for (let i = 0; i < 7; i++) { const a = (i + .5) / 7 * TAU - .3; K.set(hx + Math.cos(a) * (hr - 1), hy + Math.sin(a) * (hr - 1), BLANK[3]); }
      // Leuchten vor dem Tor, wo das Wasser in die Kammer drückt
      K.licht(112, 44, 40, PHOS_G, .9);
      leuchten(K, 96, 34, 124, 54, (x, y) => kan.has(x, y) ? 3 : 0);
      K.vignette(.6, { cx: 90, cy: 46 });
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
  },
};
