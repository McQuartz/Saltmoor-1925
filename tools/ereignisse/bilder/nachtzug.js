// Ereignisbilder 160 × 90 · Nachtzug (prototype/data/biome/nachtzug.json).
// Palette des Nachtzugs (prototype/js/scenes/world/nachtzug.js): rotbraunes Holz, grüne Polster,
// Messing, die Lampen bernsteinwarm, draußen hinter den Fenstern das kalte Nachtblau.
'use strict';

const HOLZ = ['#060303', '#0e0606', '#170a09', '#22100d', '#2f1712', '#3e1f17', '#52291d', '#6a3624'];
const POLSTER = ['#040805', '#08100a', '#0e1a10', '#152618', '#1e3422', '#28442c', '#345a38'];
const MESSING = ['#1a1208', '#33240e', '#574018', '#7f6024', '#a88436', '#d0ac58', '#f4dc98'];
const LAEUFER = ['#070304', '#0f0506', '#180809', '#230c0c', '#301211', '#3e1916', '#4e221c'];
const DECKE = ['#070505', '#0e0b0a', '#171210', '#211a17', '#2e241f', '#3c3029'];
const BLAU = ['#020409', '#050a14', '#0a1424', '#112038', '#1a2e4e', '#284468', '#3c5f88', '#5c84ae', '#8cb0d4', '#c6e0f6'];
const TUCH = ['#1e1a1a', '#423c38', '#70665e', '#a89a8e', '#d8ccc0', '#f0e6dc'];
const LEDER = ['#120806', '#24120a', '#3a1e10', '#563018', '#764424', '#9a5e34'];
const SACK = ['#0c0a08', '#1a1612', '#2a241c', '#3c3428', '#504636'];
const LAMPE = '#ffc870', LAMPE_K = '#fff4dc', LAMPG = '#4a2c12', LAMPG2 = '#6a4418';
const RIM = ['#58789a', '#cfe2f6'], RIM_D = ['#283a52', '#58789a'];
const RIM_W = ['#a8742e', '#ffd890'];
const MESSKANTE = ['#d0ac58', '#f4dc98'];

// Fensterbild „die Kurve“: Hang, Gleis im Bogen, ein erleuchtetes Haus. u, v in 0..1, gibt Farbe zurück.
function kurve(K, u, v, x, y, o) {
  o = o || {}; const { B } = K;
  const hug = .5 + .1 * Math.sin(u * 3.1 + .6) - .06 * Math.cos(u * 7.3);
  const hx = .63, hy = hug + .05;
  if (Math.abs(u - hx) < .06 && Math.abs(v - hy) < .07) {                 // Haus mit Fenster
    if (Math.abs(u - hx) < .025 && Math.abs(v - hy) < .03) return o.winkt && Math.abs(u - hx) < .012 && v > hy - .01 ? '#2a1a0a' : LAMPE;
    if (v < hy - .045) return Math.abs(u - hx) < .06 - (hy - .045 - v) * 2 ? BLAU[1] : null;
    return BLAU[1];
  }
  if (v < hug) { const st = B.hash(Math.floor(u * 61), Math.floor(v * 37), 5) > .975; if (st) return BLAU[6]; const t = .45 - v * .45; return BLAU[Math.max(1, Math.min(4, Math.floor(t * 8 + B.bay(x, y))))]; }
  const gu = .12 + Math.pow((1 - v) / (1 - hug), 1.6) * .75, dist = Math.abs(u - gu), br = .012 + (v - hug) * .1;
  if (dist < br && dist > br * .45) return BLAU[6];
  if (dist < br * 1.8) return BLAU[2];
  if (Math.abs(u - .3) < .012 && v > hug - .2 && v < hug + .2) return BLAU[0];
  return B.hash(Math.floor(u * 40), Math.floor(v * 24), 9) > .85 ? BLAU[2] : BLAU[1];
}
// Ein Fenster (Rechteck) mit dem Kurvenbild füllen
function fensterKurve(K, x0, y0, w, h, o) {
  for (let y = Math.floor(y0); y < y0 + h; y++) for (let x = Math.floor(x0); x < x0 + w; x++) { const c = kurve(K, (x - x0 + .5) / w, (y - y0 + .5) / h, x, y, o); if (c) K.set(x, y, c); }
}
// Wandlampe aus Messing mit Schirm: Mitte (x, y)
function wandlampe(K, x, y, o) {
  o = o || {}; const m = K.maske();
  m.kap(x, y + 4, x, y + 8, .7, .9); m.poly([[x - 3, y + 1], [x - 2, y - 3], [x + 2, y - 3], [x + 3, y + 1]]);
  if (o.hof !== 0) K.licht(x, y, o.hof || 40, LAMPG, o.staerke || .9, { ohne: o.ohne });
  K.licht(x, y, 7, LAMPG2, 1);
  K.form(m, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 2.2, rand: 1, fase: 0, L: [0, -1] });
  K.rect(x - 2, y - 2, 5, 3, LAMPE); K.set(x, y - 1, LAMPE_K); K.set(x - 1, y - 1, LAMPE_K);
  K.lichtquelle(x, y);
}
// Tischlampe mit Schirm (Speisewagen, Abteil): Fuß (x, yb)
function tischlampe(K, x, yb, s, o) {
  o = o || {}; s = s || 1; const m = K.maske();
  m.ell(x, yb, 3 * s, 1 * s); m.kap(x, yb, x, yb - 8 * s, .6 * s, .6 * s);
  const schirm = K.maske(); schirm.poly([[x - 5 * s, yb - 7 * s], [x - 2.5 * s, yb - 13 * s], [x + 2.5 * s, yb - 13 * s], [x + 5 * s, yb - 7 * s]]);
  if (o.hof !== 0) K.licht(x, yb - 7 * s, o.hof || 60, LAMPG, o.staerke || .95, { ohne: o.ohne });
  K.licht(x, yb - 8 * s, 10 * s, LAMPG2, 1);
  K.form(m, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 2.2, rand: 1, fase: 0 });
  K.form(schirm, 0, { k: ['#6a3a14', '#a8642a', '#e0a050', '#ffc870', '#ffe0a8'], r: ['#ffe0a8', '#fff4dc'], ton: 2.6, rand: 1, fase: 0, L: [0, 1], verlauf: -1.2 });
  K.rect(x - 4 * s, yb - 7 * s, 8 * s, 1, LAMPE_K);
  K.lichtquelle(x, yb - 8 * s);
}

module.exports = {
  biom: 'nachtzug',
  bilder: {
    // Eine Fahrkarte auf dem Läufer im Gang, das Lochmuster leuchtet im Lampenlicht, dahinter die Fenster mit derselben Kurve.
    nachtzug_fahrkarte(K) {
      const { B } = K;
      const vx = 104, vy = 34;
      // Gang in Flucht: links Fensterwand, rechts Abteiltüren, Decke, Boden mit Läufer
      K.feld(0, 0, 160, 90, HOLZ, (x, y) => {
        const dx = x - vx, dy = y - vy;
        if (dy < 0 && Math.abs(dy) > Math.abs(dx) * .45) return .25 + (Math.round(80 / Math.max(1, -dy)) % 2 ? .05 : 0);  // Decke
        if (dy > 0 && dy > Math.abs(dx) * .55) return .2;                                                                // Boden
        return .45 - Math.abs(dx) / 500 + (dx > 0 && (Math.round(400 / Math.max(1, dx)) % 5 === 0) ? -.25 : 0);           // Wände
      });
      // Läufer: rot, mit Borte, zur Flucht hin schmaler
      K.feld(0, vy, 160, 90, LAEUFER, (x, y) => { const dy = y - vy; if (dy <= 1) return -1; const t = (x - vx) / dy; if (Math.abs(t + .1) > .62) return -1; return .45 + (Math.abs(Math.abs(t + .1) - .52) < .04 ? .35 : 0) + (B.hash(Math.round(t * 20), Math.round(300 / dy), 2) - .5) * .1; });
      // Fenster links: jedes zeigt dieselbe Kurve
      for (let i = 0; i < 4; i++) {
        const z0 = 1 + i * 1.7, z1 = z0 + 1.1, x0 = vx - 104 / z0, x1 = vx - 104 / z1, yt0 = vy - 26 / z0, yb0 = vy + 14 / z0, yt1 = vy - 26 / z1, yb1 = vy + 14 / z1;
        if (x1 < 0) continue;
        for (let x = Math.max(0, Math.floor(x0)); x < x1; x++) { const q = (x - x0) / (x1 - x0), yt = B.lerp(yt0, yt1, q), yb = B.lerp(yb0, yb1, q); for (let y = Math.floor(yt); y < yb; y++) { const c = kurve(K, q, (y - yt) / (yb - yt), x, y); if (c) K.set(x, y, c); } }
        const rahmen = K.maske(); rahmen.poly([[x0 - 1, yt0 - 1], [x1 + 1, yt1 - 1], [x1 + 1, yt1 + 1], [x0 - 1, yt0 + 2]]); rahmen.poly([[x0 - 1, yb0 - 1], [x1 + 1, yb1 - 1], [x1 + 1, yb1 + 1], [x0 - 1, yb0 + 2]]);
        K.form(rahmen, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 2, rand: 1, fase: 0 });
      }
      // Abteiltüren rechts: dunkle Felder mit Messinggriff
      for (let i = 0; i < 4; i++) { const z = 1.2 + i * 1.6, x = vx + 70 / z, h0 = vy - 24 / z, h1 = vy + 40 / z; if (x > 160) continue; K.linie(x, h0, x, h1, HOLZ[0]); K.set(x - 2 / z * 2, vy + 4 / z, MESSING[5]); }
      // Deckenlampen
      wandlampe(K, vx - 10, 12, { hof: 34 });
      wandlampe(K, vx - 2, 24, { hof: 18 });
      // Die Fahrkarte vorn auf dem Läufer, schräg, das Lochmuster leuchtet
      const kx = 60, ky = 75, a = -.18, c = Math.cos(a), s = Math.sin(a), w = 32, h = 16;
      const P = (u, v) => [kx + u * c - v * s, ky + u * s + v * c];
      const karte = K.maske(); karte.poly([P(-w / 2, -h / 2), P(w / 2, -h / 2), P(w / 2, h / 2), P(-w / 2, h / 2)]);
      K.licht(kx, ky, 30, LAMPG, .9, { oval: 1.6 });
      K.form(karte, 0, { k: ['#4a3a24', '#8a7450', '#c4ac7c', '#e8d8b0'], r: ['#e8d8b0', '#fff4dc'], ton: 2.4, rand: 1, fase: 0, L: [0, -1], schatten: 1 });
      // Aufdruck und Löcher (Lochmuster einer Kurve)
      for (let i = 0; i < 5; i++) { const [x, y] = P(-13 + i * 3, -4); K.set(x, y, '#5a3a1a'); K.set(x + 1, y, '#5a3a1a'); }
      for (let i = 0; i < 9; i++) { const u = -6 + i * 2.2, v = 3.5 - Math.sin(i / 8 * Math.PI) * 5; const [x, y] = P(u, v); K.set(x, y, LAMPE_K); K.licht(x, y, 3, LAMPG2, .8); }
      K.vignette(.7, { cx: 84 });
    },

    // Ein Tisch mit weißem Tuch und Tischlampe, zwei Teller, einer davon benutzt, der Stuhl gegenüber leer und zurückgeschoben.
    nachtzug_gedeck(K) {
      const { B } = K;
      // Speisewagen: Holzwand, Fenster mit Nacht, Vorhänge
      K.bretter(0, 0, 160, 90, HOLZ.slice(0, 6), { senkrecht: true, breite: 12, ton: .45 });
      const fx0 = 40, fx1 = 120, fy0 = 8, fy1 = 46;
      fensterKurve(K, fx0, fy0, fx1 - fx0, fy1 - fy0);
      const rahmen = K.maske(); rahmen.rect(fx0 - 3, fy0 - 3, fx1 - fx0 + 6, fy1 - fy0 + 6); rahmen.rect(fx0, fy0, fx1 - fx0, fy1 - fy0, 0);
      K.form(rahmen, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 1.8, rand: 1, fase: 0 });
      for (const [x0, x1] of [[28, 44], [116, 132]]) { const v = K.maske(); v.rect(x0, 2, x1 - x0, 50); K.form(v, 0, { k: LAEUFER, r: RIM_W, ton: 2.6, rand: 1, muster: (x) => (Math.sin(x * 1.3) > .5 ? -1 : 0) }); }
      // Der leere Stuhl gegenüber, zurückgeschoben (schräg, nach rechts versetzt)
      const st = K.maske(); st.poly([[96, 34], [118, 32], [120, 62], [98, 64]]); st.ell(107, 33, 11, 3);
      K.form(st, 0, { k: POLSTER, r: RIM_W, ton: 2, rand: 1, L: [-.6, -.8], muster: (x, y) => ((x - 96) % 5 === 0 ? -.6 : 0) });
      // Tisch mit Tuch: in Aufsicht, vorn die Kante mit Falten
      const tisch = K.maske(); tisch.poly([[22, 60], [138, 60], [154, 90], [6, 90]]);
      K.form(tisch, 0, { k: TUCH, r: ['#a89a8e', '#d8ccc0'], ton: 1.3, rand: 1, L: [0, -1], verlauf: .8, muster: (x, y) => (Math.abs(y - 74) < .6 ? -.4 : 0) });
      // Zwei Teller: der vordere benutzt (Suppe, Löffel quer), der hintere unberührt
      const teller = (x, y, r) => { const m = K.maske(); m.ell(x, y, r, r * .42); K.form(m, 0, { k: TUCH.slice(1), r: ['#f0e6dc', '#fff8f0'], ton: 2.6, rand: 1, fase: 0, L: [0, -1] }); const i = K.maske(); i.ell(x, y, r * .6, r * .25); K.form(i, 0, { k: TUCH.slice(1), ton: 2.4, rand: 0, fase: 0 }); };
      teller(52, 80, 15); teller(108, 64, 10);
      K.feld(40, 76, 64, 86, ['#2a1808', '#4a2e12', '#7a4e20', '#a06a2a'], (x, y) => Math.hypot((x - 52) / 8.5, (y - 80) / 3.4) < 1 ? .5 + (y < 79 ? .2 : 0) : -1);
      K.linie(58, 77, 72, 74, '#c8c0b0'); K.linie(72, 74, 75, 73, '#e8e0d0');
      for (const [x, y] of [[48, 74], [50, 71], [52, 73], [54, 69], [55, 72]]) if (B.bay(x, y) < .8) K.set(x, y, '#5a5048');
      // Besteck beim hinteren Teller, richtig herum
      K.linie(96, 62, 96, 68, '#a89a8e'); K.linie(120, 62, 120, 68, '#a89a8e');
      // Tischlampe in der Mitte: die helle Stelle
      tischlampe(K, 80, 66, 1.4, { hof: 84, staerke: 1 });
      K.vignette(.65, { cy: 56 });
    },

    // Eine Reihe Zugfenster, in jedem dieselbe nächtliche Landschaft; im hintersten ein kleines Licht, davor eine winkende Gestalt.
    nachtzug_kurve(K) {
      const { B } = K;
      // Wand des Wagens, frontal, Holzpaneele
      K.bretter(0, 0, 160, 90, HOLZ.slice(0, 7), { senkrecht: true, breite: 8, ton: .42 });
      const leiste = K.maske(); leiste.rect(0, 58, 160, 3); leiste.rect(0, 8, 160, 2);
      K.form(leiste, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 1.8, rand: 1, fase: 0 });
      // Vier Fenster, von nah (links, groß) nach fern (rechts, klein) in Flucht
      const F = [[6, 14, 40, 40], [54, 17, 32, 34], [96, 20, 25, 28], [130, 23, 20, 22]];
      F.forEach(([x, y, w, h], i) => {
        fensterKurve(K, x, y, w, h, { winkt: i === 3 });
        const r = K.maske(); r.rect(x - 2, y - 2, w + 4, h + 4); r.rect(x, y, w, h, 0);
        K.form(r, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 1.8, rand: 1, fase: 0 });
        if (i < 3) K.licht(x + w * .63, y + h * .62, 8, '#2a1a08', .6, { maske: (px, py) => px >= x && px < x + w && py >= y && py < y + h });
      });
      // Im letzten Fenster: das Licht heller, und darin jemand, der winkt
      const [x3, y3, w3, h3] = F[3], hx = x3 + w3 * .63, hy = y3 + h3 * (.5 + .1 * Math.sin(.63 * 3.1 + .6) - .06 * Math.cos(.63 * 7.3) + .05);
      K.licht(hx, hy, 10, LAMPG2, 1, { maske: (px, py) => px >= x3 && px < x3 + w3 && py >= y3 && py < y3 + h3 });
      for (let y = Math.round(hy - 2); y <= hy + 2; y++) for (let x = Math.round(hx - 2); x <= hx + 2; x++) K.set(x, y, LAMPE);
      K.set(hx, hy - 1, '#1a0e06'); K.set(hx, hy, '#1a0e06'); K.set(hx, hy + 1, '#1a0e06'); K.set(hx - 1, hy, '#1a0e06'); K.set(hx + 1, hy - 2, '#1a0e06'); K.set(hx + 1, hy - 3, '#1a0e06');
      // Wandlampe zwischen den Fenstern
      wandlampe(K, 92, 10, { hof: 30, staerke: .6 });
      K.vignette(.6);
      void B;
    },

    // Ein Abteil im Lampenlicht, ein gebeugter Mann mit Lupe, auf dem Klapptisch Feilen und ein offenes Uhrwerk.
    nachtzug_lupe(K) {
      const { B } = K;
      K.bretter(0, 0, 160, 90, HOLZ.slice(0, 6), { senkrecht: true, breite: 11, ton: .4 });
      // Fenster rechts: Nacht
      fensterKurve(K, 104, 8, 50, 40);
      const rahmen = K.maske(); rahmen.rect(101, 5, 56, 46); rahmen.rect(104, 8, 50, 40, 0); K.form(rahmen, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 1.8, rand: 1, fase: 0 });
      // Polsterbank links
      const bank = K.maske(); bank.rect(0, 26, 56, 40); bank.rect(0, 60, 62, 12); bank.rect(0, 72, 58, 18);
      K.form(bank, 0, { k: POLSTER, r: RIM_W, ton: 2, rand: 1, muster: (x, y) => (y < 60 && (x % 9 === 0 || (y - 26) % 9 === 0) ? -.6 : 0) + (y > 59 && y < 62 ? .6 : 0) });
      // Klapptisch am Fenster
      const tisch = K.maske(); tisch.rect(66, 58, 94, 4); tisch.kap(100, 62, 108, 82, .9, .9);
      K.form(tisch, 0, { k: HOLZ.slice(1), r: RIM_W, ton: 2.6, rand: 1, L: [0, -1] });
      // Der Mann: sitzend auf der Bank, tief über den Tisch gebeugt
      const mann = K.maske();
      mann.ell(38, 60, 9, 6);                                   // Gesäß auf der Bank
      mann.kap(38, 58, 52, 40, 7.5, 6.5); mann.ell(48, 42, 8, 6.5);  // Rücken, rund nach vorn
      mann.kap(54, 39, 60, 41, 3, 2.6); mann.ell(63, 41, 4.8, 5); // Nacken und Kopf, tief über dem Tisch
      mann.kap(40, 62, 60, 62, 4.5, 4); mann.kap(60, 62, 62, 84, 3.2, 2.6); mann.kap(62, 84, 68, 85, 1.6, 1.6);  // Oberschenkel, Unterschenkel, Schuh
      mann.kap(50, 46, 58, 56, 3, 2.6); mann.kap(58, 56, 80, 56, 2.2, 1.8); mann.kap(48, 48, 54, 57, 2.8, 2.4); mann.kap(54, 57, 84, 55, 2.2, 1.8);  // Arme, Ellbogen auf dem Tisch
      mann.kopf = [63, 41];
      K.form(mann, 0, { k: ['#040202', '#080404', '#0e0808', '#140c0b'], ton: .8, rand: 0 });
      // Uhrwerk auf dem Tisch: Zahnräder aus Messing, offen
      const rad = (x, y, r, z) => { const m = K.maske(); m.ell(x, y, r, r * .5); for (let i = 0; i < z; i++) { const a = i / z * Math.PI * 2; m.ell(x + Math.cos(a) * r, y + Math.sin(a) * r * .5, .8, .6); } m.ell(x, y, r * .35, r * .18, 0); K.form(m, 0, { k: MESSING, r: MESSKANTE, ton: 4, rand: 1, fase: 0, L: [0, -1] }); };
      const geh = K.maske(); geh.ell(90, 56, 9, 3.6); K.form(geh, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 2, rand: 1, fase: 0 });
      rad(88, 55, 4.5, 10); rad(94, 54, 3, 8); rad(91, 57, 2, 6);
      // Feilen
      K.linie(110, 57, 126, 55, '#6a6e72'); K.linie(112, 58, 128, 58, '#8a8e92'); K.linie(126, 55, 130, 54, '#3e1f17'); K.linie(128, 58, 132, 58, '#3e1f17');
      // Lampe über dem Tisch, die Lupe glänzt im Auge
      wandlampe(K, 82, 20, { hof: 68, ohne: mann });
      K.kante(mann, 82, 20, 60, RIM_W, { nah: .45 });
      const [kx, ky] = mann.kopf;
      const lupe = K.maske(); lupe.kap(kx + 4, ky + 1, kx + 7, ky + 2, 2, 2); K.form(lupe, 0, { k: MESSING.slice(2), r: MESSKANTE, ton: 2, rand: 1, fase: 0 }); K.set(kx + 7, ky + 1, LAMPE_K); K.set(kx + 8, ky + 2, MESSING[6]);
      K.vignette(.7, { cx: 80 });
      void B;
    },

    // Ein abgestoßener Lederkoffer zwischen Postsäcken, ein schiefer Reiseaufkleber, der Riemen offen.
    nachtzug_koffer(K) {
      const { B } = K;
      // Gepäckwagen: Lattenwand, Dielenboden
      K.bretter(0, 0, 160, 64, DECKE, { breite: 6, ton: .45 });
      for (let x = 20; x < 160; x += 40) { const s = K.maske(); s.rect(x, 0, 3, 64); K.form(s, 0, { k: HOLZ.slice(0, 5), r: RIM_D, ton: 1.6, rand: 1 }); }
      K.pflaster(64, 90, DECKE, { vx: 80, ton: .35, dichte: 1.8 });
      // Postsäcke: prall, gebunden, mit Schablonenschrift
      const sack = (x, yb, w, h, lean) => {
        const m = K.maske(); m.ell(x, yb - h * .45, w / 2, h * .48); m.poly([[x - w * .2 + lean, yb - h * .9], [x + w * .2 + lean, yb - h * .9], [x + w * .1 + lean, yb - h * 1.1], [x - w * .1 + lean, yb - h * 1.1]]); m.ell(x + lean, yb - h * 1.12, w * .14, h * .06);
        K.form(m, 0, { k: SACK, r: RIM_D, ton: 2, rand: 1, verlauf: .4, schatten: 2, muster: (px, py) => (B.rausch2(px * .3, py * .3, 4) - .5) * .7 + (Math.abs(py - (yb - h * .5)) < 2 && Math.abs(px - x) < w * .25 && (px % 2) ? -1 : 0) });
      };
      sack(22, 86, 34, 30, 2); sack(140, 86, 36, 34, -2); sack(118, 74, 26, 22, -1); sack(40, 72, 24, 20, 1);
      // Hängelampe
      wandlampe(K, 80, 6, { hof: 76 });
      // Der Koffer: Leder, abgestoßene Ecken, Riemen offen, schiefer Aufkleber
      const kf = K.maske(); kf.rect(56, 52, 48, 32); kf.kap(74, 52, 74, 47, .9, .9); kf.kap(86, 52, 86, 47, .9, .9); kf.kap(74, 47, 86, 47, .9, .9);
      K.form(kf, 0, { k: LEDER, r: RIM_W, ton: 2.6, rand: 1, schatten: 2, L: [0, -1], muster: (x, y) => (y === 58 ? -1.2 : 0) + ((x < 59 || x > 100) && (y < 55 || y > 80) ? .9 : 0) + (B.hash(x, y, 6) < .06 ? .8 : 0) + (B.rausch2(x * .2, y * .2, 3) - .5) * .4 });
      // Riemen: einer geschlossen, einer offen und hängend
      K.feld(64, 52, 68, 84, LEDER.slice(0, 3), () => .5);
      const rm = K.maske(); rm.kap(92, 52, 92, 64, 1.6, 1.6); rm.kap(92, 64, 97, 86, 1.6, 1.6); K.form(rm, 0, { k: LEDER.slice(0, 4), r: RIM_W, ton: 1.8, rand: 1, fase: 0 });
      K.rect(91, 54, 3, 2, MESSING[5]);
      // Aufkleber, schief: rot-cremefarbenes Oval mit Schrift
      const auf = K.maske(); const a = -.35;
      auf.fn(66, 60, 92, 80, (x, y) => { const dx = x - 79, dy = y - 70, u = dx * Math.cos(a) + dy * Math.sin(a), v = -dx * Math.sin(a) + dy * Math.cos(a); return (u / 10) ** 2 + (v / 6) ** 2 <= 1; });
      K.form(auf, 0, { k: ['#4a1a10', '#8a2e1c', '#c8b088', '#e8d8b8'], r: ['#e8d8b8', '#fff4dc'], ton: 2.6, rand: 1, fase: 0, muster: (x, y) => { const dx = x - 79, dy = y - 70, u = dx * Math.cos(a) + dy * Math.sin(a), v = -dx * Math.sin(a) + dy * Math.cos(a); return Math.abs(v) > 3 ? -1.4 : 0 + (Math.abs(v) < 1 && Math.abs(u) < 6 && (Math.round(u) % 2) ? -2 : 0); } });
      K.vignette(.7, { cy: 60 });
    },

    // Eine Schaffnerin in der Tür, die Hand weit ins Abteil gestreckt, das Gesicht gelocht, dahinter Licht.
    nachtzug_kontrolle(K) {
      const { B } = K;
      // Abteil innen, dunkel; die Tür in der Mitte offen zum hellen Gang
      K.bretter(0, 0, 160, 90, HOLZ.slice(0, 5), { senkrecht: true, breite: 11, ton: .35 });
      const tx0 = 52, tx1 = 94, ty0 = 6, ty1 = 86;
      K.feld(tx0, ty0, tx1, ty1, ['#3a2410', '#6a4418', '#a06a2a', '#c8903c', '#f0c070', '#ffe0a8'], (x, y) => .6 + (1 - Math.abs(y - 26) / 70) * .35 - Math.abs(x - 73) / 120);
      const zarge = K.maske(); zarge.rect(tx0 - 4, ty0 - 4, tx1 - tx0 + 8, ty1 - ty0 + 8); zarge.rect(tx0, ty0, tx1 - tx0, ty1 - ty0 + 4, 0);
      K.form(zarge, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 1.8, rand: 1, fase: 0, L: [0, 0] });
      // Polsterbank vorn links und rechts, angeschnitten
      for (const [x0, x1] of [[0, 34], [128, 160]]) { const b = K.maske(); b.rect(x0, 40, x1 - x0, 50); K.form(b, 0, { k: POLSTER, r: RIM_W, ton: 1.6, rand: 1, L: [x0 ? -1 : 1, 0], muster: (x, y) => ((x % 8 === 0 || (y - 40) % 8 === 0) ? -.5 : 0) }); }
      // Die Schaffnerin im Türrahmen: Mütze, Uniform, ein Arm ganz lang ins Abteil auf dich zu
      const fr = K.figurMaske(70, 86, 70, { kopf: 'muetze', blick: 1, arme: [[64, 58], [136, 74]], ellbogen: [null, [96, 50]], weit: 1.15 });
      fr.kap(96, 50, 136, 74, 2.6, 3); fr.ell(139, 75, 4.5, 3.4); fr.kap(140, 72, 146, 70, 1, .9); fr.kap(141, 74, 148, 74, 1, .9); fr.kap(141, 76, 147, 78, 1, .9);
      K.form(fr, 0, { k: ['#030202', '#070404', '#0c0707', '#120b0a'], ton: .8, rand: 0 });
      K.kante(fr, 73, 30, 46, RIM_W, { nah: .4 });
      // Das Gesicht gelocht: durch die Löcher scheint der Gang
      const [kx, ky] = fr.kopf;
      for (const [dx, dy] of [[-2, -1], [1, -1], [-1, 2], [2, 1], [0, 0], [-3, 1]]) K.set(kx + dx, ky + dy, '#ffe0a8');
      K.set(kx + 1, ky - 1, '#fff4dc'); K.set(kx - 2, ky - 1, '#fff4dc');
      // Die Hand im Licht vom Fenster, kalt
      K.kante(fr, 150, 50, 30, RIM, { nah: .3 });
      K.vignette(.65, { cx: 80 });
      void B;
    },

    // Ein Gepäcknetz über einer Polsterbank, darin ein Kind im Nachthemd, das Haar hängt nach oben durch die Maschen.
    nachtzug_netz(K) {
      const { B } = K;
      K.bretter(0, 0, 160, 90, HOLZ.slice(0, 6), { senkrecht: true, breite: 12, ton: .4 });
      // Polsterbank unten
      const bank = K.maske(); bank.rect(0, 52, 160, 22); bank.rect(0, 74, 160, 16);
      K.form(bank, 0, { k: POLSTER, r: RIM_W, ton: 2, rand: 1, L: [0, -1], muster: (x, y) => (y < 74 && (x % 10 === 0 || (y - 52) % 10 === 0) ? -.6 : 0) + (y >= 74 && y < 76 ? .5 : 0) });
      // Gepäcknetz: zwei Messingstangen, das Netz hängt dazwischen durch
      const oben = 14, unten = x => 44 + Math.sin((x - 12) / 136 * Math.PI) * 4;
      K.netz([[12, oben], [148, oben], [148, unten(148)], [110, unten(110)], [80, unten(80)], [50, unten(50)], [12, unten(12)]], 0, { weite: 5, mat: { k: MESSING.slice(0, 3), r: ['#574018', '#7f6024'], ton: 1.2, rand: 1 } });
      // Das Kind, eingerollt wie ein Mantel, Gesicht zu dir, die Augen zu
      const kind = K.maske();
      kind.ell(80, 38, 26, 6.5); kind.ell(62, 36, 10, 7.5); kind.ell(98, 36, 10, 6);
      const kopf = K.maske(); kopf.ell(113, 34, 6, 6.2);
      const fuss = K.maske(); fuss.ell(50, 41, 3, 1.8); fuss.ell(54, 42, 2.6, 1.6);
      // Haar: vom Kopf nach oben, durch die Maschen, über die Stange hinaus
      const haar = K.maske(); const hr = B.rng(21);
      haar.ell(113, 30, 6.2, 3);
      for (let i = 0; i < 18; i++) { const x = 107.5 + i * .65 + hr.j(.4), l = 18 + hr.f(0, 14); haar.pfad([[x, 30], [x + hr.j(1.2), 30 - l * .5], [x + hr.j(2.2), 30 - l]], .5, .4); }
      wandlampe(K, 136, 8, { hof: 74 });
      K.form(kind, 0, { k: TUCH, r: ['#d8ccc0', '#f0e6dc'], ton: 2.5, rand: 1, L: [.8, -.6], verlauf: .5, muster: (x, y) => (Math.sin(x * .45 + y * .9) > .78 ? -.9 : 0) });
      K.form(fuss, 0, { k: ['#2a1e18', '#5a4436', '#8a6c56', '#b89880'], ton: 2.2, rand: 0, fase: 0 });
      K.form(haar, 0, { k: ['#1a0e08', '#3a2010', '#5a3418', '#7a4a24'], r: RIM_W, ton: 1.8, rand: 1, fase: 0, L: [.8, -.6] });
      K.form(kopf, 0, { k: ['#2a1e18', '#5a4436', '#8a6c56', '#b89880', '#d8b8a0'], ton: 2.8, rand: 0, fase: 1, L: [.8, -.6] });
      K.linie(110, 35, 111, 35, '#2a1e18'); K.linie(115, 35, 116, 35, '#2a1e18'); K.set(113, 38, '#5a4436');
      // vorderes Netz: lockere Maschen über dem Kind
      const vn = K.maske(); vn.fn(12, oben, 148, 50, (x, y) => y < unten(x) && ((Math.floor(x) + Math.floor(y)) % 9 === 0 || (Math.floor(x) - Math.floor(y) + 900) % 9 === 0) && !kopf.has(x, y));
      K.form(vn, 0, { k: MESSING.slice(0, 3), ton: 1.4, rand: 0, fase: 0 });
      const stange = K.maske(); stange.kap(10, oben, 150, oben, 1.3, 1.3); for (const x of [12, 148]) stange.kap(x, 6, x, unten(x), 1, 1);
      K.form(stange, 0, { k: MESSING.slice(0, 5), r: MESSKANTE, ton: 2.2, rand: 1, fase: 0, L: [.8, -.6] });
      K.vignette(.65, { cx: 80, cy: 40 });
    },
  },
};
