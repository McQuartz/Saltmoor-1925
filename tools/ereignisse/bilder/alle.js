// Ereignisbilder 160 × 90 · biomübergreifende Ereignisse (biom "alle", prototype/data/events.json).
// Neutrale Palette aus lib.js (Schiefer, kaltes Randlicht), warmes Licht als einzige helle Stelle.
// Eine Funktion je Ereignis; K = Kontext aus tools/ereignisse/lib.js.
'use strict';

const HIMMEL = ['#07080c', '#0b0d13', '#10131b', '#161a24', '#1e2330', '#272d3c', '#323a4c'];
const WASSER = ['#050608', '#090b0f', '#0e1116', '#14181f', '#1c222b', '#283039'];
const STEIN = ['#08090b', '#0e1014', '#14171c', '#1b1f26', '#242930', '#2e343d'];
const BODEN = ['#070708', '#0c0c0f', '#121216', '#19191e', '#212127'];
const WAND = ['#08080a', '#0d0d10', '#131317', '#1a1a1f', '#222228'];
const PAPIER = ['#2c2a26', '#57534a', '#8f897a', '#c8c0aa', '#e8e0c8'];
const HOLZ = ['#0f0c09', '#1e1812', '#30261b', '#4a3a2a'];
const WARMKANTE = ['#8a5a20', '#ffd27a'];
const GLAS = ['#1a1e24', '#343b44', '#58616c', '#8a949e', '#c4ccd2'];

module.exports = {
  biom: 'alle',
  bilder: {
    // Ein Kutter am Kai, Kisten im Laternenlicht, und eine davon steht schief.
    alle_kistenjob(K) {
      K.himmel(46, HIMMEL, { gx: 30, gb: 50 });
      K.sterne(16, 30);
      K.wasser(46, 64, WASSER, { horizont: .3 });
      K.kutter(36, 61, .72, .3, { mast: 44 });
      K.pflaster(63, 90, STEIN, { vx: 70, ton: .32 });
      K.rect(0, 63, 160, 1, STEIN[4]);
      // Laternenpfahl rechts mit Ausleger
      const m = K.maske(); m.kap(142, 80, 142, 14, 1.6, 1.2); m.kap(142, 18, 124, 18, .9, .9); m.kap(142, 26, 134, 18, .6, .6); m.kap(124, 18, 124, 22, .4, .4);
      K.lichtquelle(124, 29);
      K.form(m, 0, { ton: 1.1 });
      // Kistenstapel: hinten gerade, vorne eine gekippt, Spalt darunter
      const holz = { k: HOLZ, ton: 1.9 };
      K.kiste(108, 70, 22, 15, 0, .05, { mat: holz });
      K.kiste(110, 55, 16, 12, 0, .05, { mat: holz });
      K.kiste(134, 77, 16, 12, 0, 0, { mat: holz });
      K.rect(70, 80, 26, 1, '#030304');
      K.kiste(86, 81, 22, 18, .24, 0, { mat: holz });
      // Der Deckel steht einen Spalt offen, darunter nur Schwarz
      K.linie(81, 61, 100, 65.6, '#000000');
      K.laterne(124, 33, 1.15, { hof: 60 });
      K.vignette(.9);
    },

    // Ein Hinterzimmer voller verhängter Dinge, ein alter Mann mit Kerze, der einen Vorhang anhebt.
    alle_pfandleihe(K) {
      const { B } = K;
      K.fuell(WAND, (x, y) => .32 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .15 + (x % 9 === 0 ? -.15 : 0));
      K.pflaster(76, 90, BODEN, { vx: 70, ton: .25 });
      // Hinter dem Vorhang: nur Schwarz
      K.rect(0, 0, 52, 78, '#010101');
      // Verhängte Dinge rechts: Tücher über Standuhr, Sessel, Spiegel
      const tuch = K.rampe('#9a9488', .75);
      const t1 = K.maske(); t1.poly([[94, 76], [96, 30], [100, 22], [110, 20], [116, 26], [118, 76]]); for (let i = 0; i < 5; i++) t1.ell(96 + i * 5.5, 76, 3, 2);
      K.form(t1, .1, { k: tuch, ton: 1.4, verlauf: .5, muster: (x, y) => Math.sin(x * .9 + y * .05) > .6 ? -.6 : 0 });
      const t2 = K.maske(); t2.poly([[120, 78], [122, 54], [130, 46], [144, 46], [150, 56], [152, 78]]); for (let i = 0; i < 6; i++) t2.ell(121 + i * 6, 78, 3.2, 2);
      K.form(t2, .05, { k: tuch, ton: 1.5, verlauf: .4, muster: (x, y) => Math.sin(x * .7 - y * .2) > .55 ? -.6 : 0 });
      const t3 = K.maske(); t3.poly([[146, 40], [150, 8], [160, 6], [160, 44]]);
      K.form(t3, .25, { k: tuch, ton: 1.2, verlauf: .3, muster: (x, y) => Math.sin(x * 1.1) > .6 ? -.6 : 0 });
      // Der Vorhang, rechts unten zur Hand des Mannes hochgezogen
      const v = K.maske(); v.poly([[0, 0], [52, 0], [55, 18], [60, 36], [52, 46], [36, 62], [16, 78], [0, 78]]);
      K.form(v, 0, { k: K.rampe('#6a3a34', .7), ton: 1.3, verlauf: .3, muster: (x, y) => Math.sin(x * .55 + y * .08 * (x / 40)) > .5 ? -.7 : (Math.sin(x * .55 + y * .08 * (x / 40)) < -.7 ? .4 : 0) });
      // Der alte Mann: gebeugt, kahl, Blick nach links zum Vorhang; die Kerze vor ihm, er selbst bleibt Silhouette
      const mann = K.figurMaske(76, 84, 44, { kopf: 'kahl', buckel: .7, neig: -3, blick: -1, kopfDreh: -1.5, arme: [[60, 37], [80, 50]], ellbogen: [[64, 46], [82, 58]] });
      K.form(mann, 0, { ton: .8, rand: 0, fase: 0 });
      K.flamme(80, 47, { hof: 72, ohne: mann });
      K.kante(mann, 80, 45, 22, WARMKANTE);
      K.rect(79, 47, 3, 4, '#5a5040'); K.set(79, 47, '#a89878');
      K.vignette(.8, { cx: 80 });
    },

    // Ein gemauerter Brunnenrand bei Nacht, darin kein Spiegelbild, nur Dunkel.
    alle_brunnen(K) {
      const { B } = K;
      K.himmel(54, HIMMEL, { gx: 136, gb: 40, steil: .35 });
      K.sterne(22, 40);
      K.mond(136, 14, 4.5, { hof: 5 });
      K.feld(0, 52, 160, 90, BODEN, (x, y) => .2 + (y - 52) / 60 + (B.hash(x, y, 3) < .12 ? .25 : 0) - .15);
      // Hügelkante
      K.feld(0, 46, 160, 56, BODEN, (x, y) => y > 50 + Math.sin(x * .04) * 3 ? .1 : -1);
      // Pfosten und Winde
      const p = K.maske(); p.kap(53, 66, 53, 20, 1.6, 1.4); p.kap(107, 66, 107, 20, 1.6, 1.4); p.kap(48, 21, 112, 21, 1.4, 1.4); p.rect(74, 18, 12, 6); p.kap(80, 24, 80, 57, .4, .4);
      K.form(p, .05, { k: K.rampe('#8a7050', .55), ton: 1.4 });
      // Brunnen: Zylinder aus Steinen, oben ein Ring
      const cx = 80, cy = 58, rx = 30, ry = 8.5;
      const zyl = K.maske(); zyl.fn(cx - rx, cy, cx + rx, cy + 20, (x, y) => Math.abs(x - cx) <= rx && y <= cy + 18 + Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2)) * 3);
      K.form(zyl, 0, { k: STEIN.slice(1, 5), ton: 1.6, verlauf: -.6, vx: .8, muster: (x, y) => { const row = Math.floor((y - cy) / 4.5), cw = 7, c = Math.floor((x + row * 3.5) / cw); return ((y - cy) % 4.5 < 1 || (x + row * 3.5) % cw < 1) ? -1 : (B.hash(c, row, 9) - .5) * .5; }, schatten: 0 });
      const ring = K.maske(); ring.ell(cx, cy, rx + 1, ry + 1);
      K.form(ring, 0, { k: STEIN.slice(2, 6), ton: 1.8, muster: (x, y) => { const a = Math.atan2((y - cy) / ry, (x - cx) / rx); return (Math.floor(a * 6) % 2 ? .3 : -.2) + ((a * 6) % 1 < .12 ? -1 : 0); } });
      const loch = K.maske(); loch.ell(cx, cy, rx - 4, ry - 2.6);
      for (let y = loch.y0; y <= loch.y1; y++) for (let x = loch.x0; x <= loch.x1; x++) if (loch.has(x, y)) K.set(x, y, '#000000');
      // Seil endet im Dunkel
      K.linie(80, 24, 80, 56, '#2a2620');
      K.vignette(.7, { cy: 52 });
    },

    // Ein Mann in einem Torbogen, der dir Laterne, Kreuz und Revolver hinhält, ohne dich anzusehen.
    alle_nachtwaechter(K) {
      const { B } = K;
      const bx = 80, bw = 32, by = 34; // Bogenmitte, halbe Breite, Kämpferhöhe
      const imBogen = (x, y) => Math.abs(x - bx) < bw && (y > by || Math.hypot((x - bx) / bw, (y - by) / bw) < 1);
      K.mauer(0, 0, 160, 90, STEIN.slice(0, 5), { maske: (x, y) => !imBogen(x, y), hoehe: 7, breite: 13, ton: .3 });
      // Durchgang: dunkel, hinten ein schwacher Schein der Gasse
      const NEBEL = ['#0b0d11', '#12151b', '#1a1e26', '#242a34', '#303845', '#3e4756'];
      K.feld(0, 0, 160, 90, NEBEL, (x, y) => imBogen(x, y) ? .05 + Math.max(0, 1 - Math.hypot((x - bx) * .9, (y - 56) * 1.2) / 34) * .85 : -1);
      // Bogensteine
      const kl = K.maske(); kl.fn(bx - bw - 6, 0, bx + bw + 6, 90, (x, y) => { const d = Math.hypot((x - bx), (y - by)); return y <= by + .5 ? d >= bw && d < bw + 6 : (Math.abs(x - bx) >= bw && Math.abs(x - bx) < bw + 5); });
      K.form(kl, 0, { k: STEIN.slice(1, 5), ton: 1.5, muster: (x, y) => { const a = Math.atan2(y - by, x - bx); return y <= by ? ((a * 7) % 1 < .14 ? -1 : 0) : ((y % 8) < 1 ? -1 : 0); } });
      // Pflaster im Durchgang
      K.pflaster(80, 90, STEIN, { x0: bx - bw, x1: bx + bw, vx: bx, ton: .25 });
      // Der Wächter, Kopf zur Seite gedreht: Silhouette vor dem Schein der Gasse
      const mann = K.figurMaske(bx, 88, 60, { kopf: 'hut', kopfDreh: 4, arme: [[67, 52], [94, 54]], ellbogen: [[66, 44], [96, 45]], weit: 1.1 });
      K.form(mann, 0, { ton: .7, rand: 1, L: [0, -1], r: ['#3e4756', '#3e4756'] });
      // Kreuz (silbern, an der Kette) und Revolver in der rechten Hand
      K.linie(93, 55, 93, 58, '#8a929a'); K.rect(92, 58, 1, 6, '#c8d0d8'); K.rect(90, 60, 5, 1, '#c8d0d8'); K.set(92, 58, '#eef2f6');
      const rv = K.maske(); rv.rect(95, 51, 9, 2.2); rv.poly([[95, 52], [98, 52], [97, 58], [94.5, 58]]); rv.ell(99, 53, 2, 1.6);
      K.form(rv, 0, { k: ['#050506', '#0c0d10', '#181a20', '#2a2e36'], r: ['#6a7480', '#d8e0e8'], ton: 1.6, fase: 0, L: [0, -1] });
      // Laterne hängt in der linken Hand und leuchtet an ihm vorbei
      K.linie(67, 53, 67, 56, '#1a1a1e');
      K.laterne(67, 67, 1.25, { hof: 50, ohne: mann });
      K.kante(mann, 67, 61, 26, WARMKANTE);
      K.vignette(.8);
    },

    // Ein Stativ mit schwarzem Tuch, daneben drei Glasplatten an einen Stein gelehnt; auf allen dreien stehst du, jedes Mal ein Stück weiter unten.
    alle_photograph(K) {
      const { B } = K;
      K.himmel(50, HIMMEL, { steil: .45, gx: 120, gb: 50 });
      K.feld(0, 50, 160, 90, BODEN, (x, y) => .3 + (y - 50) / 70 + (B.hash(x, y, 5) < .08 ? .2 : 0));
      K.lichtquelle(150, 6);
      // Stativ, Balgenkamera, schwarzes Tuch hinten
      const bein = K.maske(); bein.kap(30, 46, 16, 86, .9, .8); bein.kap(32, 46, 33, 88, .9, .8); bein.kap(34, 46, 46, 84, .9, .8);
      K.form(bein, 0, { k: HOLZ, ton: 1.8 });
      const kam = K.maske(); kam.rect(26, 34, 12, 12); kam.poly([[38, 36], [46, 34], [46, 46], [38, 44]]);
      K.form(kam, 0, { k: HOLZ, ton: 2, muster: (x, y) => (x > 38 && (x & 1)) ? -.7 : 0 });
      const obj = K.maske(); obj.rect(46, 37, 4, 6); K.form(obj, 0, { k: ['#120d06', '#2a1f0c', '#4a3816', '#7a5e24'], r: ['#b08a4a', '#f0d898'], ton: 2.2, fase: 0 });
      K.set(50, 39, '#f0d898');
      const tuch = K.maske(); tuch.poly([[29, 32], [36, 30], [38, 33], [36, 40], [33, 58], [29, 54], [26, 60], [22, 55], [18, 58], [20, 44], [24, 35]]);
      K.form(tuch, 0, { k: ['#040405', '#08080a', '#0e0e12', '#16161b'], ton: 1.4, muster: (x, y) => Math.sin(x * 1.2) > .6 ? -.8 : 0 });
      // Stein und drei Platten: auf jeder stehst du, jedes Mal tiefer im Grund
      const s = K.maske(); s.poly([[80, 84], [86, 52], [106, 42], [134, 44], [152, 58], [158, 84]]);
      K.form(s, .05, { k: STEIN.slice(1, 5), ton: 1.5, verlauf: .4, muster: (x, y) => B.hash(x >> 2, y >> 2, 3) * .4 - .2 });
      const platte = (x, y, w, h, tief) => {
        const g = K.maske(); g.poly([[x, y + h], [x + 3, y], [x + w + 3, y], [x + w, y + h]]);
        K.form(g, 0, { k: ['#0a0c0e', '#14171b', '#20242a', '#2e343c'], ton: 2.4, fase: 0, rand: 1 });
        const hz = y + Math.round(h * .58);
        for (let yy = y + 2; yy < y + h - 1; yy++) {
          const ox = Math.round((y + h - yy) * 3 / h);
          for (let xx = x + 2; xx < x + w; xx++) {
            const t = yy < hz ? .85 - (yy - y) / h * .35 : .38 - (yy - hz) / h * .3;
            K.set(xx + ox, yy, GLAS[Math.max(0, Math.min(4, Math.floor(t * 5 + B.bay(xx, yy) - .5)))]);
          }
        }
        K.linie(x + 3, hz, x + w + 1, hz, GLAS[1]);
        // die Gestalt: Kopf, Mantel, Beine; tief = wie weit sie im Boden steckt
        const fx = Math.round(x + w / 2 + 2), fyb = hz + 3 + tief, g2 = K.maske();
        g2.ell(fx, fyb - 13, 1.6, 1.8); g2.poly([[fx - 2.5, fyb - 11], [fx + 2.5, fyb - 11], [fx + 3, fyb - 4], [fx - 3, fyb - 4]]); g2.rect(fx - 2, fyb - 4, 1.5, 4); g2.rect(fx + 1, fyb - 4, 1.5, 4);
        for (let yy = g2.y0; yy <= g2.y1; yy++) for (let xx = g2.x0; xx <= g2.x1; xx++) if (g2.has(xx, yy) && yy < hz + 2 && yy < y + h - 1) K.set(xx, yy, '#08090b');
      };
      platte(82, 48, 20, 32, 0);
      platte(105, 47, 20, 32, 6);
      platte(128, 49, 20, 32, 11);
      K.vignette(.75, { cx: 100 });
    },

    // Ein Schleifkarren mit Tretrad, der Stein nass und rot, Funken, die nach oben fallen.
    alle_schleifstein(K) {
      const { B } = K;
      K.fuell(WAND, (x, y) => .25 + (B.fbm(x * .04, y * .04, K.seed, 2) - .5) * .2);
      K.pflaster(70, 90, STEIN, { vx: 80, ton: .28 });
      const holz = K.rampe('#8a6a48', .6);
      // Karren: Gestell, Tretrad, Griffe
      const g = K.maske();
      g.kap(40, 70, 120, 66, 2, 2); g.kap(46, 70, 46, 84, 1.3, 1.3); g.kap(118, 66, 126, 82, 1.2, 1.2);
      g.kap(120, 66, 148, 58, 1, 1);
      g.kap(96, 66, 96, 50, 1.2, 1.2); g.kap(88, 66, 96, 54, .9, .9);
      g.rect(78, 60, 30, 4);
      g.rect(80, 64, 26, 12); g.kap(84, 76, 84, 86, 1.2, 1.2); g.kap(102, 76, 102, 86, 1.2, 1.2);   // Kasten mit Wassertrog
      g.kap(60, 70, 70, 82, 1, 1); g.rect(66, 82, 9, 2);                                              // Tritt am Rad
      K.lichtquelle(96, 38);
      K.form(g, 0, { k: holz, ton: 1.3 });
      // Tretrad mit Speichen
      const r = K.maske(), rx = 60, ry = 70, rr = 14;
      r.ell(rx, ry, rr, rr); r.ell(rx, ry, rr - 2, rr - 2, 0);
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI; r.kap(rx + Math.cos(a) * (rr - 1), ry + Math.sin(a) * (rr - 1), rx - Math.cos(a) * (rr - 1), ry - Math.sin(a) * (rr - 1), .6, .6); }
      r.ell(rx, ry, 2, 2);
      K.form(r, 0, { k: holz, ton: 1.4 });
      // Der Schleifstein: nass, rot
      const s = K.maske(); s.ell(96, 50, 10, 10);
      const rot = ['#160605', '#2e0c09', '#561812', '#8a2a1e'];
      K.form(s, 0, { k: rot, r: ['#b84a36', '#ffb0a0'], ton: 1.6, muster: (x, y) => (Math.hypot(x - 96, y - 50) % 3 < .7 ? -.5 : 0) });
      K.rect(93, 59, 7, 1, '#3a0e0a');
      // nass: Tropfen vom Stein in den Trog
      for (const [x, y] of [[90, 58], [91, 61], [103, 57], [102, 62]]) { K.set(x, y, '#b84a36'); K.set(x, y + 1, '#561812'); }
      K.rect(82, 64, 22, 1, '#561812');
      // Funken: vom Stein nach oben, oben dichter werdend und kleiner
      const fr = B.rng(77);
      K.licht(96, 40, 26, '#5a2a08', .9);
      for (let i = 0; i < 70; i++) {
        const a = -Math.PI / 2 + fr.j(.55), l = 4 + Math.pow(fr(), .7) * 40, x0 = 96 + fr.j(3), y0 = 40;
        const x = x0 + Math.cos(a) * l, y = y0 + Math.sin(a) * l;
        if (y < 1) continue;
        const c = l < 12 ? '#fff0c0' : l < 26 ? '#ffb040' : '#d0601a';
        K.set(x, y, c); if (fr() < .5 && l > 6) K.set(x, y + 1, '#7a2a08');
      }
      K.set(96, 40, '#ffffff'); K.set(95, 40, '#fff0c0'); K.set(97, 40, '#fff0c0');
      K.vignette(.75, { cx: 90 });
    },

    // Ein Umschlag, halb im Boden, die Marke zeigt einen Leuchtturm mit dem Licht nach unten.
    alle_brief(K) {
      const { B } = K;
      const SAND = ['#08080a', '#0e0d0e', '#151413', '#1e1c1a', '#292622'];
      K.fuell(SAND, (x, y) => .3 + Math.sin(y * .7 + Math.sin(x * .08) * 2.5) * .12 + (B.hash(x, y, 1) - .5) * .15 + y / 400);
      K.lichtquelle(150, 0);
      // Umschlag, schräg, untere Hälfte im Sand
      const a = -.2, c = Math.cos(a), s = Math.sin(a), ox = 40, oy = 26, w = 82, h = 50;
      const P = (u, v) => [ox + u * c - v * s, oy + u * s + v * c];
      const lokal = (x, y) => { const dx = x + .5 - ox, dy = y + .5 - oy; return [dx * c + dy * s, -dx * s + dy * c]; };
      const sandLinie = x => 58 + Math.sin(x * .2) * 1.5 + (x - 80) * .06;
      const u = K.maske(); u.poly([P(0, 0), P(w, 0), P(w, h), P(0, h)]);
      u.fn(0, 0, 160, 90, (x, y) => y > sandLinie(x), 0);
      K.form(u, 0, { k: PAPIER.slice(0, 4), r: [PAPIER[3], PAPIER[4]], ton: 2.3, verlauf: .6, muster: (x, y) => { const [uu, vv] = lokal(x, y); return Math.abs(vv - uu * h / w * .6) < .7 || Math.abs(vv - (w - uu) * h / w * .6) < .7 ? -.9 : 0; } });
      // Auf dem Papier zeichnen: f(u,v) -> Farbe oder null, in lokalen Koordinaten
      const aufPapier = (u0, v0, uw, vh, f) => {
        for (let y = 0; y < 90; y++) for (let x = 0; x < 160; x++) {
          if (!u.has(x, y)) continue; const [uu, vv] = lokal(x, y), i = Math.floor(uu - u0), j = Math.floor(vv - v0);
          if (i < 0 || j < 0 || i >= uw || j >= vh) continue; const col = f(i, j); if (col) K.set(x, y, col);
        }
      };
      // Adresse in deiner Handschrift (braune Tinte)
      const zr = B.rng(5);
      const zeilen = [[14, 26, 34], [14, 31, 30], [14, 36, 22]];
      const tinte = new Set(); for (const [u0, v0, l] of zeilen) { let i = 0; while (i < l) { const n = zr.i(2, 5); for (let k = 0; k < n && i + k < l; k++) tinte.add((u0 + i + k) + ',' + (v0 + (zr() < .2 ? -1 : 0))); i += n + 1 + (zr() < .3 ? 1 : 0); } }
      aufPapier(0, 0, w, h, (i, j) => tinte.has(i + ',' + j) ? '#3a2a1a' : null);
      // Briefmarke: gezähnter Rand, Leuchtturm auf dem Fels, sein Licht fällt schräg nach unten ins Meer
      aufPapier(w - 22, 4, 18, 22, (i, j) => {
        const rand = i === 0 || j === 0 || i === 17 || j === 21;
        if (rand) return ((i + j) & 1) ? null : PAPIER[4];
        if (i === 1 || j === 1 || i === 16 || j === 20) return PAPIER[3];
        const turm = j >= 8 && j <= 16 && Math.abs(i - 7.5) <= 1 + (j - 8) * .12;
        if (j >= 6 && j <= 7 && i >= 6 && i <= 9) return '#ffe9a0';
        if (j === 5 && i >= 6 && i <= 9) return '#2a3040';
        if (j === 4 && i >= 7 && i <= 8) return '#2a3040';
        if (turm) return (j === 11 || j === 14) ? '#8a3a2a' : '#d8d0bc';
        if (j >= 16 && i <= 11 - (20 - j)) return '#0e141c';
        // Strahl: vom Laternenhaus schräg nach unten rechts
        const dx = i - 8.5, dy = j - 7; if (dy > 0 && dx > 0) { const ang = Math.atan2(dy, dx); if (ang > .55 && ang < 1.05) return (dy + dx > 9) ? '#a89040' : '#e8d080'; }
        if (j >= 16) return '#14243a';
        return '#1c2a40';
      });
      // Sand über der Unterkante, ein paar Körner auf dem Papier
      K.feld(0, 50, 160, 90, SAND, (x, y) => Math.abs(y - sandLinie(x)) < 1.2 ? .8 : -1);
      for (let i = 0; i < 30; i++) { const x = K.r.f(42, 120), y = K.r.f(40, 58); if (u.has(x, y)) K.set(x, y, PAPIER[1]); }
      K.vignette(.85, { cx: 84, cy: 40 });
    },

    // Vier Glasplatten; auf der vierten ist der Ort leer, nur ein Fleck, wo du hättest stehen sollen.
    alle_wiederkehr(K) {
      const { B } = K;
      K.fuell(WAND, (x, y) => .22 + (B.fbm(x * .05, y * .05, K.seed, 2) - .5) * .12);
      // Sims
      const sims = K.maske(); sims.rect(0, 72, 160, 5); sims.rect(0, 77, 160, 13);
      K.form(sims, 0, { k: K.rampe('#7a6a58', .5), ton: 1.4, verlauf: -.6, L: [0, -1] });
      K.lichtquelle(160, 30);
      const platte = (x, y, w, h, tief, hell, leer) => {
        const g = K.maske(); g.rect(x - 1, y - 1, w + 2, h + 2);
        K.form(g, 0, { k: ['#08090b', '#121417', '#1e2125', '#2c3036'], ton: 2.2, fase: 0, rand: 1, L: [1, -.3] });
        const hz = y + Math.round(h * .58);
        for (let yy = y + 1; yy < y + h - 1; yy++) for (let xx = x + 1; xx < x + w - 1; xx++) {
          let t = yy < hz ? .82 - (yy - y) / h * .45 : .3 - (yy - hz) / h * .35;
          t = t * hell + (xx - x) / w * .08;
          const i = Math.max(0, Math.min(4, Math.floor(t * 5 + B.bay(xx, yy) - .5)));
          K.set(xx, yy, GLAS[i]);
        }
        K.linie(x + 1, hz, x + w - 2, hz, GLAS[1]);
        const fx = x + Math.round(w / 2), fyb = hz + 2 + tief;
        if (leer) {
          // nur ein Fleck, wo die Gestalt stand
          for (let yy = hz - 12; yy <= hz + 2; yy++) for (let xx = fx - 4; xx <= fx + 4; xx++) { const q = Math.hypot((xx - fx) / 4, (yy - hz + 4) / 7.5); if (q >= 1) continue; const col = (1 - q) * 1.6 > B.bay(xx, yy) + .45 ? GLAS[0] : (1 - q) * 1.6 > B.bay(xx, yy) ? GLAS[1] : null; if (col) K.set(xx, yy, col); }
          for (let xx = fx - 3; xx <= fx + 3; xx++) K.set(xx, hz + 2, GLAS[0]);
          return;
        }
        for (let j = 0; j < 13; j++) { const yy = fyb - j; if (yy > hz && j < tief) continue; if (yy >= y + h - 1) continue; const bw = j > 10 ? 1 : j > 8 ? 0 : 1; for (let i = -bw; i <= bw; i++) K.set(fx + i, yy, '#08090b'); }
        K.set(fx - 2, fyb - 9, '#08090b'); K.set(fx + 2, fyb - 9, '#08090b');
      };
      platte(12, 30, 26, 38, 0, .55, false);
      platte(48, 31, 26, 38, 4, .62, false);
      platte(84, 30, 26, 38, 8, .7, false);
      platte(120, 29, 28, 40, 0, 1.08, true);
      K.licht(134, 48, 30, '#2a3038', .8);
      K.vignette(.7, { cx: 100 });
    },

    // Ein Kupferhelm mit beschlagenem Fenster, ein Schlauch, der in den Boden führt statt nach oben.
    alle_taucher(K) {
      const { B } = K;
      K.fuell(WAND, (x, y) => .22 + (B.fbm(x * .04, y * .05, K.seed, 2) - .5) * .15);
      K.feld(0, 70, 160, 90, BODEN, (x, y) => .32 + (y - 70) / 40 + (B.hash(x, y, 2) < .1 ? .2 : 0));
      K.rect(0, 70, 160, 1, BODEN[3]);
      const kupfer = ['#1e0f08', '#45230f', '#7a4320', '#b8763c'], kRand = ['#d88a50', '#ffc89a'];
      const segel = ['#0e0d0b', '#1d1b17', '#2f2c26', '#47433a'];
      // Loch im Boden, in das der Schlauch führt
      const loch = K.maske(); loch.ell(124, 80, 9, 2.6);
      K.form(loch, 0, { k: ['#000000', '#000000', '#000000', '#000000'], ton: 0, fase: 0, rand: 0 });
      K.rect(115, 82, 19, 1, BODEN[4]);
      const sch = K.maske(); sch.pfad([[76, 30], [92, 22], [108, 26], [118, 42], [122, 62], [124, 79]], 2.3, 2.1);
      K.form(sch, 0, { k: ['#0c0b0a', '#1a1815', '#2c2924', '#433e36'], ton: 1.8, muster: (x, y) => ((x + y) % 3 === 0 ? -.5 : 0) });
      // Anzug: sitzend, Knie nach links, Arme auf den Knien
      const a = K.maske();
      a.poly([[57, 44], [79, 44], [82, 72], [58, 75]]);
      a.kap(64, 72, 42, 68, 5.5, 4.8); a.kap(42, 68, 40, 82, 4.4, 3.8);
      a.kap(70, 74, 50, 74, 5, 4.4); a.kap(50, 74, 49, 84, 4, 3.6);
      a.kap(62, 48, 54, 60, 3.4, 3); a.kap(54, 60, 43, 63, 3, 2.6);
      K.form(a, 0, { k: segel, ton: 1.6, verlauf: .3, muster: (x, y) => (B.hash(x, y >> 1, 4) < .1 ? -.6 : 0) });
      const st = K.maske(); st.rect(31, 81, 13, 5); st.rect(41, 83, 13, 4); st.ell(41, 63, 3, 2.6);
      K.form(st, 0, { ton: 1.3, schatten: 1 });
      // Schulterstück und Helm
      const sh = K.maske(); sh.poly([[52, 50], [56, 42], [80, 42], [84, 50], [76, 53], [60, 53]]);
      K.form(sh, 0, { k: kupfer, r: kRand, ton: 1.9, muster: (x, y) => (y === 51 && x % 4 === 1 ? 1.4 : 0) });
      const hm = K.maske(); hm.ell(68, 31, 12, 12.5);
      K.form(hm, 0, { k: kupfer, r: kRand, ton: 1.9, verlauf: .5, muster: (x, y) => (Math.abs(x - 72) < .6 ? -.8 : 0) });
      const ring = K.maske(); ring.ell(58, 32, 6.4, 6.6); ring.ell(73, 29, 3.4, 3.4);
      K.form(ring, 0, { k: kupfer, r: kRand, ton: 2.8, fase: 1.4 });
      // beschlagenes Fenster: helles, gedithertes Grau, innen ein warmer Schein
      for (let y = 27; y <= 37; y++) for (let x = 53; x <= 63; x++) { const q = Math.hypot((x - 58) / 4.6, (y - 32) / 4.8); if (q >= 1) continue; const v = 1 - q * .55; K.set(x, y, v - .3 > B.bay(x, y) ? '#d8d2c2' : v > B.bay(x, y) ? '#9a9282' : '#5a5448'); }
      for (let y = 27; y <= 31; y++) for (let x = 71; x <= 75; x++) if (Math.hypot(x - 73, y - 29) < 2.2) K.set(x, y, '#2a2620');
      K.licht(58, 32, 16, '#3a2a12', .9);
      K.set(57, 31, '#fff4dc'); K.set(58, 32, '#f0e6cc'); K.set(56, 30, '#e8e0cc');
      K.vignette(.8, { cx: 76 });
    },

    // Eine Wand voller Kreidestriche, unten ein Kreidestummel, noch warm.
    alle_kreide(K) {
      const { B } = K;
      K.mauer(0, 0, 160, 78, ['#0a0a0c', '#111114', '#18181c', '#202025', '#29292f'], { hoehe: 13, breite: 26, ton: .45, tf: (x, y) => (B.fbm(x * .06, y * .06, K.seed, 3) - .5) * .3 });
      K.feld(0, 78, 160, 90, BODEN, (x, y) => .55 - (y - 78) / 20);
      K.rect(0, 78, 160, 1, BODEN[4]);
      // Striche in Fünferbündeln, Reihe um Reihe; oben die alten, verblasst; unten die letzte Reihe, daneben Platz
      const zeilen = 6, proZeile = 9, fr = B.rng(31);
      for (let z = 0; z < zeilen; z++) {
        const y = 6 + z * 11;
        for (let b = 0; b < proZeile; b++) {
          const x = 8 + b * 16 + fr.i(-1, 1);
          if (z === zeilen - 1 && b > 4) break;
          const letzte = z === zeilen - 1 && b === 4;
          const alter = 1 - z / (zeilen - 1);
          const col = alter > .75 ? '#3a3e44' : alter > .5 ? '#555b62' : alter > .25 ? '#7c848a' : '#c4cacc';
          const striche = letzte ? 3 : 4;
          for (let s = 0; s < striche; s++) K.linie(x + s * 2.6, y + fr.j(.6), x + s * 2.6 + fr.j(.8), y + 8, col, alter > .75 ? .7 : .95);
          if (!letzte) K.linie(x - 1, y + 7, x + 9, y + 1, col, alter > .75 ? .7 : .95);
        }
      }
      // Kreidestummel am Boden, noch warm
      K.licht(98, 81, 20, '#4a2a10', .9);
      const k = K.maske(); k.kap(93, 82, 100, 80, 1.4, 1.4);
      K.form(k, 0, { k: ['#4a4c50', '#7a7e84', '#b8bcc0', '#e0e4e6'], r: ['#ffe0b0', '#fff4d8'], ton: 2.4, fase: 0, L: [.4, -1] });
      K.set(100, 80, '#ffd8a0'); K.set(101, 80, '#c07030'); K.set(101, 81, '#7a3a14');
      K.vignette(.8, { cx: 90, cy: 62, innen: .5 });
    },

    // Ein Fischernetz zwischen zwei Felsen, darin ein Fang aus Händen.
    alle_fischer_netz(K) {
      const { B } = K;
      K.himmel(50, HIMMEL, { gx: 120, gb: 50 });
      K.mond(128, 12, 3.5, { hof: 6 });
      K.wasser(50, 90, WASSER, { horizont: .3 });
      K.lichtquelle(128, 12);
      const fels = (pts) => { const m = K.maske(); m.poly(pts); K.form(m, 0, { k: STEIN.slice(1, 5), ton: 1.5, verlauf: .6, muster: (x, y) => (B.hash(x >> 2, y >> 1, 3) - .5) * .6 }); };
      fels([[0, 90], [0, 20], [8, 12], [20, 14], [28, 30], [33, 58], [42, 90]]);
      fels([[118, 90], [124, 52], [131, 30], [142, 22], [152, 24], [160, 32], [160, 90]]);
      // Netz hängt durch
      const oben = [], unten = [];
      for (let i = 0; i <= 20; i++) { const q = i / 20, x = 27 + q * 105, y = 27 + q * 2 + Math.sin(q * Math.PI) * 12; oben.push([x, y]); unten.push([x, 29 + q * 2 + Math.sin(q * Math.PI) * 46 - Math.abs(q - .5) * 4]); }
      K.netz(oben.concat(unten.slice().reverse()), 0, { weite: 5, mat: { k: ['#14130f', '#2a2720', '#433e33', '#5e574a'], ton: 1.8 } });
      const tau = K.maske(); tau.pfad(oben, .8, .8); K.form(tau, 0, { k: HOLZ, ton: 2, fase: 0 });
      // Hände im Netz: bleich, Finger gespreizt, durch die Maschen
      const haut = ['#2e2824', '#544a40', '#8a7a6a', '#c0ae98'], hr = ['#d0c0a8', '#f4ead8'];
      const hand = (x, y, a, s) => {
        const m = K.maske();
        m.ell(x, y, 3.4 * s, 3 * s);
        for (let f = 0; f < 4; f++) { const fa = a + (f - 1.5) * .34, l = (6 - Math.abs(f - 1.5) * .9) * s; m.kap(x + Math.cos(fa) * 2.4 * s, y + Math.sin(fa) * 2.4 * s, x + Math.cos(fa) * (2.4 * s + l), y + Math.sin(fa) * (2.4 * s + l), .8 * s, .65 * s); }
        m.kap(x + Math.cos(a + 1.45) * 2.4 * s, y + Math.sin(a + 1.45) * 2.4 * s, x + Math.cos(a + 1.1) * 6 * s, y + Math.sin(a + 1.1) * 6 * s, .9 * s, .7 * s);
        m.kap(x - Math.cos(a) * 2.6 * s, y - Math.sin(a) * 2.6 * s, x - Math.cos(a) * 8 * s, y - Math.sin(a) * 8 * s, 1.9 * s, 1.8 * s);
        K.form(m, 0, { k: haut, r: hr, ton: 2.1, fase: 1 });
      };
      hand(66, 60, -1.95, 1.3); hand(94, 60, -1.15, 1.3); hand(80, 64, -1.55, 1.35);
      // Maschen über den Händen
      K.netz(oben.concat(unten.slice().reverse()).map(p => [p[0], p[1]]), 0, { weite: 9, mat: { k: ['#100f0c', '#1c1a15', '#2a2720', '#38342b'], ton: 1.4, rand: 0 } });
      K.vignette(.7);
    },

    // Eine Sturmlaterne auf einem Stein, ihr Licht fällt in eine Richtung, die es nicht gibt.
    alle_laterne_spricht(K) {
      const { B } = K;
      K.fuell(['#030304', '#060608', '#0a0b0d', '#0f1013'], (x, y) => .3 + (B.fbm(x * .03, y * .05, K.seed, 2) - .5) * .3 + (y > 76 ? .3 : 0));
      // Stein
      const s = K.maske(); s.poly([[98, 86], [102, 72], [114, 68], [128, 70], [134, 86]]);
      K.form(s, 0, { k: STEIN.slice(0, 4), ton: 1.5, verlauf: .5, L: [-1, -.4] });
      // Lichtstrahl nach links, schmal, und mitten in der Luft ein Lichtfleck auf einer Wand, die es nicht gibt
      const ly = 60, lx = 110, fx = 26;
      for (let x = fx + 2; x < lx - 4; x++) {
        const q = (lx - x) / (lx - fx), half = 1.5 + q * 10;
        for (let y = Math.floor(ly - half); y <= ly + half; y++) { const v = .4 * (1 - Math.abs(y - ly) / (half + 1)) * (.55 + .45 * q); if (v > B.bay(x, y)) K.set(x, y, '#3a2c14'); }
      }
      for (let y = ly - 16; y <= ly + 16; y++) for (let x = fx - 7; x <= fx + 3; x++) {
        const q = Math.hypot((x - fx + 1) / 6, (y - ly) / 15); if (q >= 1) continue;
        const v = 1 - q; K.set(x, y, v > .55 ? '#ffe6a8' : v > .3 ? '#d8a050' : v - .1 > B.bay(x, y) * .3 ? '#7a5020' : '#3a2810');
      }
      K.laterne(lx, 70, 1.4, { hof: 0 });
      K.vignette(.6);
    },

    // Ein Folioband, die Tinte braun, eine Zeile frisch und schwarz.
    alle_kirchenbuch(K) {
      const { B } = K;
      K.fuell(WAND, (x, y) => .2 + (B.fbm(x * .04, y * .04, K.seed, 2) - .5) * .15);
      // Steinblock
      const st = K.maske(); st.poly([[14, 90], [20, 62], [140, 62], [148, 90]]);
      K.form(st, 0, { k: STEIN.slice(0, 4), ton: 1.4, verlauf: .4, L: [0, -1] });
      // Buch: Deckel, zwei Seiten, Falz
      const deckel = K.maske(); deckel.poly([[22, 66], [30, 22], [80, 26], [130, 22], [140, 66], [80, 70]]);
      K.form(deckel, 0, { k: K.rampe('#5a2a1c', .6), ton: 1.3, fase: 1 });
      const seiteL = K.maske(); seiteL.poly([[26, 63], [33, 24], [56, 25], [78, 29], [79, 66], [56, 62]]);
      const seiteR = K.maske(); seiteR.poly([[81, 66], [82, 29], [104, 25], [127, 24], [136, 63], [104, 62]]);
      K.lichtquelle(80, 0);
      const pm = (x, y) => (B.hash(x, y, 8) - .5) * .25;
      K.form(seiteL, 0, { k: PAPIER.slice(0, 4), r: [PAPIER[3], PAPIER[4]], ton: 2.6, vx: .5, muster: (x, y) => pm(x, y) - (x > 74 ? (x - 74) * .25 : 0), rand: 1 });
      K.form(seiteR, 0, { k: PAPIER.slice(0, 4), r: [PAPIER[3], PAPIER[4]], ton: 2.9, vx: -.4, muster: (x, y) => pm(x, y) - (x < 86 ? (86 - x) * .25 : 0), rand: 1 });
      // Zeilen: braune Tinte, eine schwarz und frisch
      for (let i = 0; i < 11; i++) {
        const y = 31 + i * 3; const yl = y - 1 + Math.round(i * .1);
        K.schrift(35 + Math.round(i * .5), yl, 74, '#6a4a2a', { min: 1, max: 4, wackel: .1 });
        if (i === 6) { K.schrift(88, y, 128 - Math.round(i * .3), '#050403', { min: 2, max: 6, wackel: .05 }); K.schrift(88, y + 1, 124, '#050403', { min: 3, max: 6, wackel: 0 }); }
        else K.schrift(88, y, 128 - Math.round(i * .3), '#6a4a2a', { min: 1, max: 4, wackel: .1 });
      }
      K.vignette(.8, { cy: 44 });
    },

    // Ein Kniender vor einer Wand, die Hände gefaltet um einen Gegenstand, den man nicht sieht.
    alle_pfarrerin_beichte(K) {
      const { B } = K;
      K.fuell(WAND, (x, y) => .16 + (B.fbm(x * .04, y * .05, K.seed, 2) - .5) * .12);
      K.mauer(100, 0, 160, 84, ['#0b0b0d', '#121215', '#19191d', '#212126', '#2a2a30'], { hoehe: 8, breite: 14, ton: .45 });
      K.rect(100, 0, 1, 84, '#060607');
      K.feld(0, 84, 160, 90, BODEN, () => .35);
      K.rect(0, 84, 160, 1, BODEN[3]);
      // Kniender im Profil, nach rechts zur Wand, Kopf gesenkt, Hände vor dem Gesicht gefaltet
      const m = K.maske();
      m.kap(52, 82, 76, 82, 3.4, 3.4);                 // Unterschenkel am Boden
      m.ell(52, 80, 5, 4.5);                           // Fersen, Gesäß darauf
      m.poly([[56, 62], [72, 60], [80, 84], [52, 84], [50, 72]]);   // Mantel über Hüfte und Oberschenkel
      m.poly([[60, 38], [72, 38], [76, 46], [74, 62], [56, 64], [56, 46]]); // Rumpf, leicht vorgebeugt
      m.ell(66, 40, 7, 4.5);                           // Schultern
      m.kap(70, 38, 75, 34, 2.6, 2.2); m.ell(78, 32, 4.4, 5);   // Hals, Kopf gesenkt
      m.kap(72, 42, 82, 54, 3, 2.6); m.kap(82, 54, 88, 42, 2.6, 2.2); // Arm: Ellbogen unten, Unterarm hoch
      m.ell(89, 40, 3, 3.6);                           // gefaltete Hände
      K.form(m, 0, { ton: .75, rand: 1, L: [0, -1] });
      // Licht aus den Händen: auf die Wand, auf Gesicht und Brust
      K.licht(90, 40, 40, '#4a3010', .9, { ohne: m });
      K.licht(90, 40, 14, '#6a4416', 1, { ohne: m });
      K.kante(m, 90, 40, 18, ['#6a4416', '#ffc870']);
      K.set(91, 39, '#fff0c0'); K.set(91, 41, '#ffd27a'); K.set(90, 43, '#ffd27a'); K.set(92, 37, '#d8a050');
      K.vignette(.85, { cx: 84 });
    },

    // Fenster an Fenster im Dunkel, Gesichter wie aus Papier, ein leerer letzter Wagen.
    alle_stummfilm_zug(K) {
      const { B } = K;
      K.himmel(64, HIMMEL, { steil: .3, basis: .05 });
      K.feld(0, 64, 160, 90, BODEN, (x, y) => .3 + (y - 64) / 50 + (B.hash(x, y >> 1, 3) < .15 ? .2 : 0));
      // Heide, keine Gleise: Grasbüschel unter den Rädern
      for (let i = 0; i < 46; i++) { const x = K.r.f(0, 160), y = K.r.f(70, 89); K.linie(x, y, x + K.r.j(1.5), y - 2 - K.r() * 2, BODEN[4]); }
      const wagen = (x0, x1, letzter) => {
        const m = K.maske();
        m.rect(x0, 22, x1 - x0, 38);
        m.fn(x0, 14, x1, 23, (x, y) => y > 22 - 7 * Math.sqrt(Math.max(0, 1 - ((x - (x0 + x1) / 2) / ((x1 - x0) / 2 + 2)) ** 2)));
        m.rect(x0 + 3, 60, x1 - x0 - 6, 3);
        K.form(m, 0, { ton: 1.3, verlauf: .25, muster: (x, y) => (y === 22 ? .9 : 0) + (y === 52 || y === 53 ? -.7 : 0) + (y > 53 && (x - x0) % 8 === 0 ? -.6 : 0) });
        const r = K.maske();
        for (const bx of [x0 + 12, x1 - 12]) { r.ell(bx - 6, 67, 4.6, 4.6); r.ell(bx + 6, 67, 4.6, 4.6); r.rect(bx - 10, 62, 20, 3); }
        r.fn(r.x0, r.y0, r.x1, r.y1, (x, y) => { for (const bx of [x0 + 12, x1 - 12]) for (const dx of [-6, 6]) { const d = Math.hypot(x - bx - dx, y - 67); if (d < 3.2 && d > 1 && Math.abs(Math.sin(Math.atan2(y - 67, x - bx - dx) * 3)) > .5) return true; } return false; }, 0);
        K.form(r, 0, { ton: 1.5 });
        const n = Math.floor((x1 - x0 - 6) / 15);
        for (let i = 0; i < n; i++) {
          const fx = x0 + 6 + i * 15, fy = 27, fw = 11, fh = 17;
          for (let y = fy; y < fy + fh; y++) for (let x = fx; x < fx + fw; x++) K.set(x, y, letzter ? (y > fy + 12 ? '#4a3a1c' : '#8a7040') : (y > fy + 12 ? '#241f15' : '#40382a'));
          K.rect(fx - 1, fy - 1, fw + 2, 1, '#05060a'); K.rect(fx - 1, fy + fh, fw + 2, 1, '#2c323d');
          if (!letzter) {
            // Papiergesicht: flach, ohne Schatten, zwei Punktaugen, ein Strich als Mund; jede zweite Hand winkt
            const gx = fx + 3, gy = fy + 3;
            for (let y = 0; y < 8; y++) for (let x = 0; x < 5; x++) if (!((y === 0 || y === 7) && (x === 0 || x === 4))) K.set(gx + x, gy + y, '#e4e0d2');
            K.set(gx + 1, gy + 3, '#141416'); K.set(gx + 3, gy + 3, '#141416'); K.set(gx + 1, gy + 6, '#7a766a'); K.set(gx + 2, gy + 6, '#7a766a'); K.set(gx + 3, gy + 6, '#7a766a');
            K.rect(gx - 1, gy + 8, 7, fh - 11, '#14120e');
            if (i % 2 === 0) { for (const [hx, hy] of [[8, 3], [8, 2], [9, 1], [8, 1], [8, 4], [7, 5]]) K.set(fx + hx, fy + hy, '#cfcabc'); }
          } else if (i === 1) {
            // dein Mantel auf der Bank, sonst niemand
            const mm = K.maske(); mm.poly([[fx + 1, fy + 17], [fx + 2, fy + 7], [fx + 4, fy + 4], [fx + 7, fy + 4], [fx + 9, fy + 7], [fx + 10, fy + 17]]); mm.rect(fx + 4, fy + 2, 3, 2);
            K.form(mm, 0, { k: ['#0a0806', '#16110a', '#241c10', '#342816'], r: ['#6a5028', '#c8a060'], ton: 1.6, fase: 0, L: [0, -1] });
          }
        }
        if (letzter) K.licht((x0 + x1) / 2, 36, 40, '#4a3a18', .8);
      };
      wagen(-36, 50, false); wagen(56, 114, false); wagen(120, 196, true);
      K.rect(50, 50, 6, 3, '#0a0b0e'); K.rect(114, 50, 6, 3, '#0a0b0e');
      K.vignette(.7, { cx: 130 });
    },
  },
};
