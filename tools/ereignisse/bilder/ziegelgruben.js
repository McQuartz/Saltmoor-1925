// Ereignisbilder 160 × 90 · Die Ziegelgruben (data/biome/ziegelgruben.json).
// Palette der Ziegelgruben (prototype/js/scenes/world/ziegelgruben.js): Ziegelrot gegen Aschegrau und Ruß,
// das Licht weißglühend aus den Ofentüren. Falsches Detail: in jedem Ziegel derselbe Fingerabdruck
// (Ringlinien, eine Narbe quer darüber).
'use strict';

const ZIEGEL = ['#0e0605', '#180a07', '#24100a', '#33170d', '#441f11', '#572815', '#6c331a', '#843f21', '#9c4c28', '#b65c31', '#cc6d3b'];
const ASCHE = ['#121110', '#1c1a19', '#282523', '#36322f', '#45403c', '#55504b', '#67605a', '#7a726b', '#8e857d', '#a39990'];
const RUSS = ['#050404', '#0a0807', '#110e0d', '#191514', '#221c1a'];
const LEHM = ['#17130f', '#211b16', '#2d251e', '#3a3027', '#483c31', '#57493c', '#685847', '#7b6a56'];
const GLUT = ['#3a0e06', '#6a1c0a', '#a0300e', '#d24c16', '#ff7a2a', '#ffa848', '#ffd27a', '#fff1c0', '#ffffff'];
const KALT = ['#0c1218', '#14202a', '#1e3040', '#2c4660', '#46688a', '#7aa0c4'];
const RAND_Z = ['#c4582c', '#ffdcae'], RAND_A = ['#8e7a6a', '#e0cfbe'];
const LAMPE = ['#a06a20', '#ffd27a'];

// ---------- eigene Bausteine ----------
const fr = t => t - Math.floor(t);
// Ziegelverband (u längs, v hoch, in Pixeln): Helligkeitsbeitrag mit Fugen
function verband(B, u, v, ch, bl, sd) {
  const lage = Math.floor(v / ch), fv = fr(v / ch), uu = u / bl + (lage % 2) * .5, nr = Math.floor(uu), fu = fr(uu);
  let t = (B.hash(nr, lage, sd) - .5) * .14;
  if (ch >= 2.2) { if (fv < 1 / ch) t -= .3; else if (fv > 1 - 1.2 / ch) t += .08; }
  if (bl >= 3 && fu < 1 / bl) t -= .24;
  return { t, nr, lage, fu, fv };
}
// Fingerabdruck als Rillenmuster: (dx, dy) relativ zur Mitte, s = Größe; 1 = Rille, 0 = Steg, -1 = außen
function rillen(dx, dy, s, o) {
  o = o || {}; const rr = Math.hypot(dx, dy * 1.3) / s; if (rr > 1) return -1;
  const narbe = Math.abs(dy - dx * (o.neig === undefined ? .45 : o.neig) - (o.nv || 0) * s) < (o.nb || .07) * s;
  if (narbe) return 2;
  const w = Math.atan2(dy, dx), ring = rr * (o.n || 5) + Math.sin(w * 1.5) * .12;
  return fr(ring) < .45 ? 1 : 0;
}
// Ofentür mit Rundbogen: weiße Glut, darin Ziegel in Reihen gesetzt (dunkle Gitter-Silhouetten)
function ofentuer(K, x, yb, w, h, st, o) {
  o = o || {}; const { B } = K, m = K.maske(), r = w / 2;
  m.ell(x, yb - h + r, r, r); m.rect(x - r, yb - h + r, w, h - r);
  K.licht(x, yb - h * .45, (o.hof || w * 3.2), '#5a1c08', st, { ohne: m, oval: .9 });
  K.licht(x, yb - h * .45, w * 1.2, '#3a0e06', st);
  K.feld(x - r - 1, yb - h - 1, x + r + 2, yb + 1, GLUT, (px, py) => m.has(px, py) ? (.35 + st * .65) * (1 - Math.abs(px - x) / (r * 2.6)) + (py - (yb - h)) / h * .1 : -1);
  if (o.setzung !== false) {
    // gesetzte Rohlinge: waagerechte Lagen mit Lücken, dunkel gegen die Glut
    const ch = Math.max(2, Math.round(h / 9));
    for (let py = Math.round(yb - h * .72); py < yb; py++) for (let px = Math.floor(x - r); px <= x + r; px++) {
      if (!m.has(px, py)) continue; const lage = Math.floor((py - yb) / ch), f = ((py - yb) % ch + ch) % ch;
      const spalt = ((px + (lage & 1) * 3) % 6 + 6) % 6;
      if (f > 0 && spalt > 1) K.set(px, py, st > .6 ? GLUT[3] : GLUT[1]);
    }
  }
  K.lichtquelle(x, yb - h * .5);
  return m;
}
// Gewölbter Gang in Flucht (Strahl durch einen Zylinder, Boden flach). Liefert je Pixel Fläche und Weltlage.
// o: vx, vy (Fluchtpunkt), f (Brennweite), boden (Höhe des Bodens unter Auge, 0..1), ende (Z der Stirnwand)
function gang(K, o) {
  const f = o.f || 60, bh = o.boden || .62, res = [];
  for (let y = 0; y < 90; y++) for (let x = 0; x < 160; x++) {
    const dx = (x + .5 - o.vx) / f, dy = (y + .5 - o.vy) / f, rr = Math.hypot(dx, dy) || 1e-4;
    let t = 1 / rr, art = 'wand', X = dx * t, Y = dy * t;
    if (Y > bh) { t = bh / dy; art = 'boden'; X = dx * t; Y = bh; }
    if (o.ende && t > o.ende) { t = o.ende; art = 'stirn'; X = dx * t; Y = dy * t; }
    res.push({ x, y, art, Z: t, X, Y, w: Math.atan2(dy, dx) });
  }
  return res;
}
const lichtF = (lx, ly, r, ov, ex) => (x, y) => Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * (ov || 1)) / r), ex || 1.4);

module.exports = {
  biom: 'ziegelgruben',
  bilder: {
    // Eine gemauerte Rundbogentür in einer langen, gekrümmten Ziegelwand, darin weiße Glut; darüber ein Rußfächer und eine lange Reihe eingeritzter Striche.
    ziegelgruben_kammer(K) {
      const { B } = K;
      const tx = 88, tyb = 76, tw = 26, th = 38;
      // Die Wand krümmt sich nach links weg: Ziegel werden nach links schmaler und dunkler
      const LT = lichtF(tx, tyb - 16, 120, 1.1, 1.2);
      K.feld(0, 0, 160, 78, ZIEGEL, (x, y) => {
        const k = .35 + .65 * Math.pow(Math.min(1, (x + 20) / 140), 1.3), u = (x - 160) * k, v = (y - 40) * (.7 + .3 * k) + 40;
        return .08 + LT(x, y) * .6 + verband(B, u, v, 4 * (.6 + .4 * k), 10 * k, 3).t * 1.4 - (1 - k) * .1;
      });
      // Boden, dem Bogen der Wand folgend
      K.feld(0, 76, 160, 90, ASCHE, (x, y) => .05 + LT(x, y - 8) * .55 + (B.fbm(x * .1, y * .4, 2, 2) - .5) * .12);
      const sockel = K.maske(); sockel.fn(0, 72, 160, 80, (x, y) => y >= 76 - (160 - x) * .02 && y < 78 - (160 - x) * .02);
      K.form(sockel, 0, { k: ZIEGEL.slice(1, 8), r: RAND_Z, ton: 2.4, fase: 0, rand: 1, L: [0, -1] });
      // Rußfächer über der Tür
      K.dith(tx - 40, 0, tx + 40, tyb - th + 4, RUSS[1], (x, y) => { const dx = x - tx, dy = (tyb - th + 4) - y; const a = Math.abs(Math.atan2(dx, dy)); return dy > 0 && a < .8 ? Math.max(0, 1 - dy / 40) * 1.2 * (1 - a / .8) + (Math.sin(a * 22) > .3 ? .15 : 0) : 0; });
      // Eingeritzte Striche: eine lange Reihe über dem Ruß, in Fünfergruppen, nach links kleiner
      for (let i = 0; i < 46; i++) {
        const x = 152 - i * 3.1 + Math.floor(i / 5) * -1.2; if (x < 4) break;
        const k = .35 + .65 * Math.pow(Math.min(1, (x + 20) / 140), 1.3), h = Math.round(5 * k + 1), y = 10;
        if (i % 5 === 4) K.linie(x + 1, y + h, x + 12 * k, y, '#d8b898', .8);
        else K.linie(x, y, x, y + h, i % 3 ? '#c49070' : '#e0c0a0', .9);
        K.linie(x + 1, y, x + 1, y + h, RUSS[2], .5);
      }
      // Rahmen der Tür: Bogen aus hochkant gestellten Ziegeln
      const rah = K.maske(), r = tw / 2;
      rah.ell(tx, tyb - th + r, r + 4, r + 4); rah.rect(tx - r - 4, tyb - th + r, tw + 8, th - r);
      rah.ell(tx, tyb - th + r, r, r, 0); rah.rect(tx - r, tyb - th + r, tw, th - r, 0);
      K.form(rah, 0, { k: ZIEGEL.slice(2), r: RAND_Z, ton: 4, fase: 1, rand: 2, schatten: 2, lichtVon: [tx, tyb - 16], muster: (x, y) => { const a = Math.atan2(y - (tyb - th + r), x - tx); return (y < tyb - th + r ? (fr(a * 6) < .14 ? -1.2 : 0) : ((y % 3) === 0 ? -1.2 : 0)); } });
      ofentuer(K, tx, tyb, tw, th, 1, { hof: 70 });
      // weiter links, kleiner und schwächer: die nächste Kammer (die Wand krümmt sich weg)
      ofentuer(K, 28, 72, 9, 14, .35, { hof: 16, setzung: false });
      K.lichtquelle(tx, tyb - 16);
      K.vignette(.6, { cx: 88, cy: 50 });
    },

    // Ein grauer, ungebrannter Ziegel auf gestampftem Lehm, in seiner Mitte ein tiefer Fingerabdruck mit einer Narbe quer darüber; daneben die Spitzen zweier echter Finger.
    ziegelgruben_abdruck(K) {
      const { B } = K;
      const lx = 18, ly = 6;   // Ofentür oben links, außerhalb der Ziegelfläche
      // Hinten die Wand mit einer glühenden Tür, vorn der Trockenboden aus Lehm
      K.feld(0, 0, 160, 22, ZIEGEL.slice(0, 6), (x, y) => .1 + lichtF(lx, ly, 70)(x, y) * .7 + verband(B, x, y, 4, 11, 5).t);
      ofentuer(K, lx, 20, 12, 18, 1, { hof: 60 });
      const LB = lichtF(lx + 10, 10, 190, 1.2, 1.1);
      K.feld(0, 20, 160, 90, LEHM, (x, y) => .06 + LB(x, y) * .75 + (B.fbm(x * .12, y * .25, 3, 2) - .5) * .18 + (B.hash(x, y, 8) > .95 ? .15 : 0));
      // Der Rohling in Aufsicht, schräg: Oberseite und eine Seitenwange
      const P = [[30, 38], [118, 30], [134, 64], [42, 76]];
      const oben = K.maske(); oben.poly(P);
      const wange = K.maske(); wange.poly([[42, 76], [134, 64], [134, 70], [42, 82]]);
      const ROH = ASCHE.slice(1, 9);
      K.form(wange, 0, { k: ASCHE.slice(0, 5), r: RAND_A, ton: 1.6, fase: 0, rand: 1, schatten: 2, lichtVon: [lx, ly] });
      K.form(oben, 0, { k: ROH, r: RAND_A, ton: 3.6, fase: 1, rand: 2, lichtVon: [lx, ly], verlaufX: -1, muster: (x, y) => (B.fbm(x * .2, y * .2, 4, 2) - .5) * .6 });
      // Abdruck: tiefe Rillen (Licht von oben links: Rillenwand oben dunkel, unten hell), Narbe quer
      const ax = 82, ay = 53, as = 17;
      for (let y = ay - as; y <= ay + as; y++) for (let x = ax - as * 1.2; x <= ax + as * 1.2; x++) {
        const dx = x - ax, dy = y - ay, rd = rillen(dx * .85, dy * 1.15, as, { n: 6, nb: .08, neig: .5, nv: -.05 }); if (rd < 0) continue;
        const ob = rillen(dx * .85, (dy - 1) * 1.15, as, { n: 6, nb: .08, neig: .5, nv: -.05 });
        // Mulde: zur Mitte tiefer
        const q = Math.hypot(dx / (as * 1.15), dy / (as * .85));
        if (rd === 2) K.set(x, y, ASCHE[8]);
        else if (rd === 1) K.set(x, y, ob === 0 ? ASCHE[1] : (q < .9 && B.bay(x, y) < .6 ? ASCHE[3] : ASCHE[2]));
        else K.set(x, y, ob === 1 ? ASCHE[7] : (q < .5 ? ASCHE[5] : ASCHE[6]));
      }
      // Zwei echte Fingerspitzen von rechts unten: dunkel, Kante im Glutlicht
      const fi = K.maske();
      fi.kap(176, 92, 136, 74, 7, 5.6); fi.ell(135, 74, 5.6, 5);
      fi.kap(178, 80, 144, 60, 6.6, 5.2); fi.ell(143, 60, 5.2, 4.6);
      const HAUT = ['#160a07', '#2a140c', '#3e2014', '#58301e', '#74442a', '#8e5a38'];
      K.form(fi, 0, { k: HAUT, r: RAND_Z, ton: 2.6, fase: 1, rand: 2, schatten: 2, lichtVon: [lx, ly], verlauf: .8, verlaufX: -1.4, muster: (x, y) => ((x - 2 * y) % 9 === 0 && x > 146 ? -.6 : 0) });
      K.kante(fi, lx, ly, 200, RAND_Z, { nah: .2 });
      // Nägel
      for (const [x, y, w] of [[132, 72, 3], [140, 58, 3]]) { const n = K.maske(); n.ell(x + 1, y, w, 2.2); K.form(n, 0, { k: ['#4a2a1c', '#7a5242', '#a07a66', '#c8a090'], r: ['#e0c0b0', '#fff0e0'], ton: 2.2, fase: 0, rand: 1, lichtVon: [lx, ly] }); }
      K.vignette(.6, { cx: 84, cy: 54 });
    },

    // Ein langer Tisch aus Ziegeln mit Dutzenden rechteckiger und halbmondförmiger Stempel in Reihen, in der Mitte eine Lücke im Staub in Form einer Hand.
    ziegelgruben_stempeltisch(K) {
      const { B } = K;
      const lx = 120, ly = 22;
      // Rückwand mit Ofentür, gedämpft
      K.feld(0, 0, 160, 40, ZIEGEL.slice(0, 7), (x, y) => .1 + lichtF(lx, ly, 90)(x, y) * .6 + verband(B, x, y, 4, 11, 7).t);
      ofentuer(K, lx, 38, 14, 26, 1, { hof: 70 });
      K.feld(0, 38, 160, 90, ASCHE.slice(0, 6), (x, y) => .1 + lichtF(lx, 40, 100)(x, y) * .5);
      // Tischplatte in Aufsicht (Trapez), Vorderkante aus Ziegeln
      const yh = 44, yv = 76, X = (t, y) => B.lerp(B.lerp(22, 2, (y - yh) / (yv - yh)), B.lerp(138, 158, (y - yh) / (yv - yh)), t);
      const platte = K.maske(); platte.poly([[22, yh], [138, yh], [158, yv], [2, yv]]);
      const LT = lichtF(lx, ly + 10, 140, 1.2, 1.2);
      // Staub auf der Platte (hell), Ziegelfugen schimmern durch
      K.feld(0, yh, 160, yv, ASCHE, (x, y) => platte.has(x, y) ? .18 + LT(x, y) * .7 + verband(B, x, (y - yh) * 2.2, 5, 14, 9).t * .4 + (B.hash(x, y, 4) - .5) * .1 : -1);
      const vorn = K.maske(); vorn.rect(2, yv, 156, 10);
      K.feld(2, yv, 158, yv + 10, ZIEGEL, (x, y) => .1 + LT(x, y) * .5 + verband(B, x, y - yv, 4, 12, 2).t * 1.4);
      const kante = K.maske(); kante.rect(2, yv - 1, 156, 2); K.form(kante, 0, { k: ASCHE.slice(2, 8), r: RAND_A, ton: 2.4, fase: 0, rand: 1, L: [0, -1] });
      // Stempel in Reihen: Rechtecke und Halbmonde mit Griff, hinten klein; die Lücke in Handform in Reihe 2
      const reihen = [[48, .5], [54, .62], [62, .78], [71, .95]];
      const hand = K.maske();
      reihen.forEach(([y, s], ri) => {
        const n = 9;
        for (let i = 0; i < n; i++) {
          const t = (i + .5) / n, x = X(t, y);
          if (ri === 3 && (i === 4)) {
            // Hand im Staub: Handfläche und fünf Finger, sauberer Ziegel darunter
            const hx = x, hy = y - 2, hs = s * 1.5;
            hand.ell(hx, hy, 4.2 * hs, 2.6 * hs);
            for (const [dx, l] of [[-3.6, 3.2], [-1.8, 4.6], [0, 5], [1.8, 4.4], [3.4, 3]]) hand.kap(hx + dx * hs, hy - 1.5 * hs, hx + dx * hs * 1.25, hy - (1.5 + l * .55) * hs, .7 * hs, .6 * hs);
            hand.kap(hx + 4 * hs, hy, hx + 7 * hs, hy - 1 * hs, .8 * hs, .6 * hs);
            continue;
          }
          const m = K.maske(), w = 5.2 * s, h = 2.4 * s, halb = (i + ri) % 3 === 1;
          if (halb) m.fn(x - w, y - h * 1.4, x + w, y + 1, (px, py) => py <= y && ((px - x) / w) ** 2 + ((py - y) / (h * 1.4)) ** 2 <= 1);
          else m.rect(x - w * .8, y - h, w * 1.6, h + 1);
          m.kap(x, y - h, x, y - h - 3.4 * s, 1 * s, .8 * s); m.ell(x, y - h - 3.6 * s, 1.4 * s, 1 * s);
          const holz = (i * 7 + ri) % 4 === 0;
          K.form(m, (1 - s) * .5, { k: holz ? ['#140c08', '#24160c', '#3a2414', '#523420'] : ['#0e0c08', '#2a2010', '#5a4420', '#a8823e'], r: holz ? RAND_Z : ['#c8a060', '#fff0c0'], ton: 2, fase: 0, rand: 1, schatten: 1, lichtVon: [lx, ly] });
        }
      });
      K.feld(0, yh, 160, yv, ZIEGEL, (x, y) => hand.has(x, y) ? .3 + LT(x, y) * .45 + verband(B, x, (y - yh) * 2.2, 5, 14, 9).t : -1);
      // Rand der Hand: Staubkante (hell oben links, dunkel unten rechts)
      for (let y = hand.y0 - 1; y <= hand.y1 + 1; y++) for (let x = hand.x0 - 1; x <= hand.x1 + 1; x++) if (!hand.has(x, y)) { if (hand.has(x + 1, y + 1)) K.set(x, y, ASCHE[8]); else if (hand.has(x - 1, y - 1)) K.set(x, y, ASCHE[2]); }
      K.vignette(.6, { cx: 82, cy: 54 });
    },

    // Eine frisch gemauerte Ziegelwand quer durch einen Gang, auf jedem Ziegel ein heller Fingerabdruck; davor eine Kelle im Mörtel.
    ziegelgruben_vermauert(K) {
      const { B } = K;
      const lx = 120, ly = 82;   // Grubenlampe vorn rechts am Boden
      const vx = 80, vy = 40, ende = 2.4;
      const px = gang(K, { vx, vy, f: 64, boden: .62, ende });
      const L = (x, y, Z) => Math.pow(Math.max(0, 1 - Math.hypot(x - lx, (y - ly) * .9) / 150), 1.3) * (1.6 / (Z + .6));
      const out = [];
      for (const p of px) {
        let t;
        if (p.art === 'wand') { const u = p.Z * 14, v = (p.w + Math.PI) * 9, vb = verband(B, u * 1.3, v * 1.3, 4.5, 12, 3); t = .06 + L(p.x, p.y, p.Z) * .55 + vb.t * Math.min(1, 1.6 / p.Z); }
        else if (p.art === 'boden') { t = .04 + L(p.x, p.y, p.Z) * .6 + (B.fbm(p.X * 3, p.Z * 3, 4, 2) - .5) * .2; out.push([p.x, p.y, 'b', t]); continue; }
        else { // Stirnwand: frische Ziegel, auf jedem ein heller Abdruck
          const u = (p.X + 2) * 24, v = (p.Y + 2) * 24, vb = verband(B, u, v, 5, 12, 6);
          t = .3 + L(p.x, p.y, p.Z) * .5 + vb.t * 1.2;
          const dx = (vb.fu - .5) * 12, dy = (vb.fv - .5) * 5, rd = rillen(dx, dy * 1.4, 2.6, { n: 2, nb: .14 });
          if (vb.fv > .2 && vb.fu > .1 && rd >= 0) { out.push([p.x, p.y, 'a', rd === 1 ? 0 : 1]); continue; }
        }
        out.push([p.x, p.y, 'z', t]);
      }
      const PZ = ZIEGEL.map(K.pk), PA = LEHM.map(K.pk), P = (pal, t, x, y) => { t = Math.max(0, Math.min(.9999, t)) * (pal.length - 1); const k = Math.floor(t); return pal[Math.min(pal.length - 1, (t - k) > B.bay(x, y) ? k + 1 : k)]; };
      for (const [x, y, a, t] of out) K.e.set(x, y, a === 'b' ? P(PA, t, x, y) : a === 'a' ? K.pk(t ? '#e8c8a8' : '#b08868') : P(PZ, t, x, y));
      // Mörtelfugen der frischen Wand glänzen feucht: einzelne helle Punkte
      // Mörtelhaufen vorn und die Kelle darin
      const mh = K.maske(); mh.ell(64, 82, 18, 5); mh.ell(58, 79, 9, 4);
      K.form(mh, 0, { k: ASCHE.slice(2, 9), r: RAND_A, ton: 3, fase: 1, rand: 2, schatten: 2, lichtVon: [lx, ly - 10], muster: (x, y) => (B.fbm(x * .3, y * .3, 3, 2) - .5) * .9 });
      const kelle = K.maske(); kelle.poly([[60, 78], [74, 70], [79, 74], [66, 81]]);
      K.form(kelle, 0, { k: ['#0e0c0a', '#22201c', '#3a3630', '#5a5650'], r: ['#a8a090', '#f0e8d8'], ton: 2.4, fase: 0, rand: 2, lichtVon: [lx, ly - 10] });
      const stiel = K.maske(); stiel.kap(77, 72, 86, 62, 1, 1.3); K.form(stiel, 0, { k: ['#140c08', '#2a180c', '#462814', '#663c1c'], r: RAND_Z, ton: 2.2, fase: 0, rand: 1, lichtVon: [lx, ly - 10] });
      K.laterne(lx, ly + 6, 1, { hof: 40, staerke: .7 });
      K.vignette(.6, { cx: 80, cy: 46 });
    },

    // Eine Wachstafel an einer Ziegelwand, lange Kolonnen ausgekratzter Zeilen, nur die unterste Zeile unberührt; darunter auf dem Boden Wachsspäne.
    ziegelgruben_appell(K) {
      const { B } = K;
      const lx = 112, ly = 84;   // kleine Öllampe am Boden rechts unter der Tafel
      // Kalte Kammer: Ziegelwand, kühl überzogen, nur unten im Lampenkreis rot
      const LT = lichtF(lx, ly - 10, 120, 1, 1.3);
      K.feld(0, 0, 160, 80, KALT.slice(0, 5), (x, y) => .12 + (1 - LT(x, y)) * .25 * (1 - y / 120) + verband(B, x, y, 4, 12, 4).t * .9 + (B.fbm(x * .06, y * .06, 2, 2) - .5) * .1);
      K.licht(lx, ly - 6, 90, '#5a2a10', .9, { exp: 1.3 });
      K.feld(0, 78, 160, 90, ASCHE.slice(0, 6), (x, y) => .08 + LT(x, y) * .7);
      // Die Tafel: Holzrahmen, darin dunkles Wachs; Kolonnen ausgekratzter Zeilen, die unterste unberührt
      const x0 = 34, y0 = 12, x1 = 126, y1 = 68;
      const rahmen = K.maske(); rahmen.rect(x0 - 4, y0 - 4, x1 - x0 + 8, y1 - y0 + 8); rahmen.rect(x0, y0, x1 - x0, y1 - y0, 0);
      K.form(rahmen, 0, { k: ['#0e0806', '#1c100a', '#2e1c10', '#442a18', '#5c3a22'], r: RAND_Z, ton: 2.4, fase: 1, rand: 2, schatten: 2, lichtVon: [lx, ly], muster: (x, y) => (B.rausch2(x * .5, y * .05, 3) - .5) * .8 });
      const WACHS = ['#0a0604', '#140a06', '#1e100a', '#2a160c', '#3a1e10'];
      K.feld(x0, y0, x1, y1, WACHS, (x, y) => .2 + LT(x, y) * .7 + (B.fbm(x * .2, y * .2, 5, 2) - .5) * .15);
      // Kolonnen: drei Spalten, Zeilen ausgekratzt (Kratzer quer und schräg, Wachs aufgeworfen)
      for (let c = 0; c < 3; c++) for (let z = 0; z < 15; z++) {
        const zx0 = x0 + 4 + c * 30, zy = y0 + 4 + z * 3.3; if (zy > y1 - 9) continue;
        const r = B.rng(c * 50 + z);
        const ze = zx0 + 24 - r.i(0, 6);
        K.schrift(zx0, Math.round(zy), ze, '#3a1e10', { min: 1, max: 3 });
        // ausgekratzt: eine Zickzacklinie quer durch die Zeile, das Wachs daneben aufgeworfen
        for (let x = zx0; x < ze; x++) { const yy = Math.round(zy + ((x - zx0) % 4 < 2 ? 0 : -1)); K.set(x, yy, '#6a3c22'); K.set(x, yy + 1, '#080403'); }
      }
      // die unterste Zeile: unberührt, deutlich, im Lampenlicht
      const uy = y1 - 6;
      K.linie(x0 + 4, uy - 2, x1 - 4, uy - 2, '#1e100a', .5);
      K.schrift(x0 + 30, uy, x0 + 64, '#d8a070', { min: 2, max: 4, wackel: 0 });
      K.schrift(x0 + 30, uy + 1, x0 + 64, '#6a3a1e', { min: 2, max: 4, wackel: 0, dicht: true });
      // Wachsspäne am Boden: kleine Locken
      const sp = K.maske(), r = B.rng(9);
      for (let i = 0; i < 16; i++) { const x = r.f(46, 104), y = r.f(80, 87), a = r.f(0, 3); sp.kap(x, y, x + Math.cos(a) * 2, y + Math.sin(a) * .8, .7, .5); sp.ell(x + Math.cos(a) * 2, y + Math.sin(a), .9, .7); }
      K.form(sp, 0, { k: WACHS, r: ['#8a4a26', '#e0a070'], ton: 2.6, fase: 0, rand: 1, lichtVon: [lx, ly] });
      // die kleine Öllampe
      const lm = K.maske(); lm.ell(lx, ly + 2, 5, 2); lm.kap(lx + 3, ly + 1.5, lx + 7, ly + 1, 1.2, 1);
      K.form(lm, 0, { k: ['#1a0e08', '#2e1a0e', '#4a2c16'], r: RAND_Z, ton: 1.4, fase: 0, rand: 1, lichtVon: [lx + 7, ly - 3] });
      K.set(lx + 7, ly, '#ffd27a'); K.set(lx + 7, ly - 1, '#fff1c0'); K.set(lx + 7, ly - 2, '#ffa848'); K.set(lx + 8, ly - 1, '#ffa848');
      K.vignette(.6, { cx: 82, cy: 44 });
    },

    // Ein gewölbter Ziegelgang, aus dem Scheitel fällt Asche in einer Säule auf eine einzelne Gestalt; am Boden um ihre Füße ein Fingerabdruck aus Asche.
    ziegelgruben_ascheregen(K) {
      const { B } = K;
      const vx = 80, vy = 34, f = 58;
      const px = gang(K, { vx, vy, f, boden: .78 });
      const fx = 80, fy = 78;   // Füße der Gestalt
      // Licht von oben: durch eine Öffnung im Scheitel über der Gestalt (Z ~ 1.6)
      const Zl = 1.6;
      const PZ = ZIEGEL.map(K.pk), PA = ASCHE.map(K.pk), P = (pal, t, x, y) => { t = Math.max(0, Math.min(.9999, t)) * (pal.length - 1); const k = Math.floor(t); return pal[Math.min(pal.length - 1, (t - k) > B.bay(x, y) ? k + 1 : k)]; };
      for (const p of px) {
        const dz = p.Z - Zl, near = Math.max(0, 1 - Math.hypot(dz * 1.4, p.X * 1.1) / 1.6), fern = Math.min(1, 1.2 / (p.Z + .2));
        if (p.art === 'wand') {
          const vb = verband(B, p.Z * 15, (p.w + Math.PI) * 10, 4.5, 12, 3);
          const loch = p.Y < -.86 && Math.abs(dz) < .28;
          if (loch) { K.e.set(p.x, p.y, P(PA, .75 + near * .3, p.x, p.y)); continue; }
          K.e.set(p.x, p.y, P(PZ, .05 + near * .55 * (p.Y < 0 ? 1 : .7) + vb.t * fern * 1.2 - (1 - fern) * .05, p.x, p.y));
        } else {
          // Boden: Asche, um die Füße der Abdruck (Ringlinien mit Narbe)
          const dx = p.X * 40, dy = dz * 26, rd = rillen(dx, dy, 22, { n: 6, nb: .05, neig: .4 });
          let t = .05 + near * .55 + (B.fbm(p.X * 4, p.Z * 4, 4, 2) - .5) * .12 * fern;
          if (rd === 1) t -= .14 * Math.min(1, near * 2); else if (rd === 2) t += .1; else if (rd === 0) t += .06 * near;
          K.e.set(p.x, p.y, P(PA, t, p.x, p.y));
        }
      }
      // Die Säule aus Asche: große graue Flocken, von der Öffnung herab auf die Gestalt
      const top = 4, r = B.rng(5);
      for (let i = 0; i < 140; i++) {
        const y = top + Math.pow(r(), .9) * (fy - top), w = 7 + (y - top) * .1, x = fx + r.j(w) + Math.sin(y * .2 + i) * 1.2;
        const c = r() < .3 ? ASCHE[9] : r() < .6 ? ASCHE[7] : ASCHE[5];
        K.set(x, y, c); if (r() < .4) K.set(x + 1, y, ASCHE[4]);
      }
      K.dith(fx - 10, top, fx + 10, fy, ASCHE[5], (x, y) => Math.max(0, 1 - Math.abs(x - fx) / (7 + (y - top) * .1)) * .25);
      // die Gestalt: steht still, die Asche liegt auf Schultern und Hut
      const fig = K.figurMaske(fx, fy, 26, { kopf: 'hut', blick: -1 });
      K.form(fig, 0, { k: RUSS.slice(0, 4), ton: .8, rand: 1, r: RAND_A, L: [0, -1] });
      K.kante(fig, fx, top, 60, RAND_A, { min: .5 });
      K.lichtquelle(fx, top);
      K.vignette(.55, { cx: 80, cy: 48 });
    },
  },
};
