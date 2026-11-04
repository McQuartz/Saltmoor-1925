// Saltmoor 1925 · Hintergründe: Akt V, Das Ufer unten (Biom-Paket ufer).
// Komposition: docs/auftrag-2/biome/ufer.md. Ein Strand unter der Erde, mit dem Sand vom Anfang.
// Wahrzeichen: Das Meer ist die Decke. Die Wellen rollen von oben heran und brechen nach unten;
// an einer Stelle hängt das Wasser als Säule bis auf den Sand. Falsches Detail: deine Fußspuren
// führen ins Wasser und kommen nicht zurück. Gegenlicht: Morgenlicht, das hinten rechts durch das
// Wasser über dir fällt (dort ist die Decke am hellsten).
(function () {
'use strict';
const B = World.B, W = B.W, H = B.H, M = B.M;
const pal = { koerper: ['#040607', '#0b1214', '#162024', '#25333a'], rand: ['#5a7678', '#e4dcc4'], augen: '#ffd89a', nebel: ['#0c1416', '#2e3e3e'] };
// Wasser der Decke, dunkel → durchscheinend; Schaum; der Sand vom Anfang (Strand-Bildschirm), unten eine Stufe dunkler
const WASSER = ['#04070a', '#081016', '#0d1920', '#13242c', '#1c3238', '#284440', '#365846', '#4c6e56', '#6e8c6c', '#a0b48e'];
const SCHAUM = ['#c8ccb4', '#eee8d2'];
const SAND = ['#0d0c0a', '#1a1814', '#2a2620', '#3e382e', '#544c3e', '#6e6452', '#8a806a', '#a89c84'];
const FELS = ['#030404', '#080a0b', '#0f1314', '#181e1f', '#232b2b', '#30393a'];
const KORB = ['#0c0a07', '#17130d', '#241e14', '#342b1c', '#463a26'];
const SEE = '#7ab4aa', MORGEN = '#e4dcc4', MORGEN_G = '#2a2a1e', MORGEN_G2 = '#3e3a28';
const VORNE = ['#020303', '#050707', '#0a0e0f', '#121819'];
const frac = v => v - Math.floor(v);

// ---------- Die Decke: Meer von unten ----------
// Höhenfeld w(X,Z) (wie weit das Wasser unter die Deckenhöhe Yc herabhängt), gerendert spaltenweise von nah nach fern
// (Voxel-Verfahren, umgekehrt): Was näher ist und tiefer hängt, verdeckt das Dahinter. Jede Welle hat eine steile,
// dir zugewandte Front (dunkel, an der Lippe durchscheinend) und einen flachen Rücken (zum Licht hin, hell).
function deckeBauen(K, P, o) {
  const Yc = o.Yc, sd = (K.o.seed | 0) % 97, fr = K.fr, e = K.e[0];
  const amp = (X, Z) => ((.32 + .55 * B.clamp(1 - Z / 11, 0, 1)) * (1 + fr * .45) + (o.extra ? o.extra(X, Z) : 0)) * B.clamp(1.6 - Z / 22, 0, 1);
  const phase = (X, Z) => Z * (o.dichte || .95) + .3 * Math.sin(X * .45 + Z * .12) + (B.fbm(X * .22 + 9, Z * .22, sd + 3, 2) - .5) * 1.4;
  const prof = u => u < .14 ? Math.sin(u / .14 * Math.PI / 2) : Math.pow(1 - (u - .14) / .86, 1.6);
  const w = (X, Z) => { const u = frac(phase(X, Z)); let v = amp(X, Z) * prof(u); if (o.trichter) v += o.trichter(X, Z); return v; };
  const glanzPx = [], schaumPx = [];
  const PW = WASSER.map(B.pk), PS = SCHAUM.map(B.pk), n = WASSER.length - 1;
  for (let x = -M; x < W + M; x++) {
    let yTop = -M - 1;
    const Z0 = Math.max(.6, P.h * (Yc - 2.4) / (P.vy + M) * .9);
    for (let Z = Z0; Z < 90; Z += .004 + Z * .007) {
      const X = (x + .5 - P.vx) * Z / P.h, ww = w(X, Z), ys = P.vy - P.h * (Yc - 1 - ww) / Z;
      if (ys <= yTop) continue;
      const u = frac(phase(X, Z)), dZ = (w(X, Z + .02) - w(X, Z - .02)) / .04;
      const fern = B.clamp(1 - 5 / Z, 0, 1), licht = Math.exp(-(((x - (o.lichtX || 380)) / 150) ** 2));
      const A0 = B.clamp(amp(X, Z) * 1.3, 0, 1);
      let t = .2 + .4 * fern + .18 * licht * fern;
      // steile Front (dir zugewandt): das Licht scheint durch, je dünner zur Lippe hin, desto heller
      if (u < .14) t += (-.08 + .42 * Math.pow(u / .14, 1.6)) * A0;
      // flacher Rücken: zum Licht hin, matt; tiefer im Tal dunkler
      else t += (.12 - .3 * Math.pow((u - .14) / .86, .7)) * A0 + Math.min(.15, Math.max(0, -dZ) * .05);
      t += (B.fbm(X * .9, Z * .6, sd + 11, 2) - .5) * .14;
      const fl = B.fbm(X * 1.3 + 4, Z * .9, sd + 21, 2);
      const schaum = u > .12 && u < .16 + (fl - .5) * .06 && ww > .25 && Z < 30 && fl > .42;
      const y0 = Math.max(-M, Math.ceil(yTop)), y1 = Math.min(P.vy, Math.floor(ys));
      for (let y = y0; y <= y1; y++) {
        let c;
        if (schaum) { const d = B.clamp((ww - .2) * 1.4, 0, 1) * B.clamp((fl - .42) * 5, 0, 1) * (y > y1 - 2 ? 1 : .5); c = d > B.bay(x, y) ? PS[d > .8 + B.bay(x, y) * .2 ? 1 : 0] : PW[Math.min(n, 6)]; if (d > .5 && y === y1) schaumPx.push(x, y); }
        else { const tt = B.clamp(t + (y1 - y) * -.004, 0, .9999) * n, k = Math.floor(tt); c = PW[Math.min(n, (tt - k) > B.bay(x, y) ? k + 1 : k)]; }
        e.set(x, y, c);
      }
      if (!schaum && dZ < -1.2 && fern < .8 && B.hash(x, Math.round(ys), 5) > .965) glanzPx.push(x, Math.round(ys));
      yTop = ys; if (yTop >= P.vy) break;
    }
    // bis zum Horizont: der helle, flache Streifen, wo Meer und Sand sich hinten treffen
    for (let y = Math.max(-M, Math.ceil(yTop)); y <= P.vy; y++) { const tt = B.clamp(.75 + .2 * Math.exp(-(((x - (o.lichtX || 380)) / 140) ** 2)), 0, .9999) * n, k = Math.floor(tt); e.set(x, y, PW[Math.min(n, (tt - k) > B.bay(x, y) ? k + 1 : k)]); }
  }
  // Morgenlicht hinter dem Wasser, hinten rechts: gedithertes Glühen auf der Decke
  B.gluehen(e, o.lichtX || 380, P.vy - 10, 120, MORGEN_G2, .8);
  K.licht(o.lichtX || 380, P.vy - 6, MORGEN, 160, .9);
  // Bewegung: Schaumkronen glitzern, Glanz auf den Wellenrücken
  if (!o.ruhig) {
    const cs = [B.css(SCHAUM[1]), B.css(WASSER[9])];
    K.anim.push({ p: 0, f(ctx, t) { for (let i = 0; i < schaumPx.length; i += 2) { const x = schaumPx[i], y = schaumPx[i + 1]; const v = Math.sin(t * 1.3 + x * .21 + y * .7); if (v > .55) { ctx.fillStyle = cs[v > .85 ? 0 : 1]; ctx.fillRect(x, y + 1, 1, 1); } } } });
    K.anim.push({ p: 0, f(ctx, t) { ctx.fillStyle = cs[1]; for (let i = 0; i < glanzPx.length; i += 2) { const x = glanzPx[i], y = glanzPx[i + 1]; if (Math.sin(t * .9 + x * 1.7 + y) > .4) ctx.fillRect(x - 1, y, 3, 1); } } });
  }
  return { w, schaumPx };
}
// Gischt fällt: von den tief hängenden Lippen regnet Schaum auf den Sand (statisch als feine Fäden, dazu Partikel)
function gischt(K, P, xs, yBis, o) {
  o = o || {};
  for (const [x, , dichte] of xs) { const eb = K.eb(yBis); for (let i = -6; i <= 6; i++) for (let j = -1; j <= 1; j++) if (dichte * (1 - Math.abs(i) / 7) > B.bay(x + i, yBis + j) + .15) K.e[eb].set(x + i, yBis + j, B.pk(j < 0 ? SAND[2] : SAND[6])); }
  if (o.ruhig) return;
  const P2 = xs.map(([x, yA]) => ({ x, yA }));
  const cs = [B.css(SCHAUM[1]), B.css(SCHAUM[0]), B.css(WASSER[8])];
  K.luft.push({ p: .6, f(ctx, t, ox, oy) { P2.forEach((q, i) => { for (let k = 0; k < 3; k++) { const ph = frac(t * .45 + i * .37 + k / 3), y = q.yA + ph * (yBis - q.yA); ctx.fillStyle = cs[k]; ctx.fillRect(q.x + ox + (k - 1), Math.round(y) + oy, 1, 2); } }); } });
}

// ---------- Die Säule: hier hängt das Meer bis auf den Sand ----------
function saeule(K, P, Xc, Zc, rc, Yc, o) {
  o = o || {};
  const h = P.h, k = h / Zc, m = B.maske(), L = [], R = [];
  for (let Y = 0; Y <= Yc + .3; Y += .04) {
    const top = Math.max(0, (Y - Yc * .5) / (Yc * .5)), fuss = Math.max(0, (.5 - Y) / .5);
    const r = rc * (1 + 3.2 * top * top + .9 * fuss * fuss) + Math.sin(Y * 3.1) * rc * .06;
    const [cx, cy] = P.q(Xc, Y, Zc); L.push([cx - r * k, cy]); R.push([cx + r * k, cy]);
  }
  m.poly([...L, ...R.reverse()]);
  const yF = P.q(Xc, 0, Zc)[1], yT = P.q(Xc, Yc, Zc)[1], cx0 = P.q(Xc, 0, Zc)[0], eb = o.ebene || K.eb(yF - 1);
  // Wasser fällt: senkrechte Bahnen, innen durchscheinend (das Licht kommt von oben durchs Wasser)
  B.form(K.e[eb], m, K.mat(o.tiefe || 0, { k: WASSER.slice(2, 8), r: [WASSER[8], SCHAUM[1]], ton: 2.4, fase: 2, rand: 2, verlauf: -1.2,
    muster: (x, y) => { const s = B.rausch1((x - cx0) * .45, 41); return (s > .62 ? .9 : s < .3 ? -.8 : 0) + Math.max(0, 1 - Math.abs(x - cx0) / (rc * k * 1.6)) * .8; } }));
  // Fuß: Schaumring und nasser, dunkler Sand
  const ring = B.maske(); ring.ell(cx0, yF, rc * k * 2.2, Math.max(2, rc * k * .32)); ring.ell(cx0, yF - 1, rc * k * 1.2, Math.max(1.5, rc * k * .18), 0);
  B.form(K.e[eb], ring, K.mat(0, { k: [WASSER[6], WASSER[8], SCHAUM[0], SCHAUM[1]], r: [SCHAUM[1]], ton: 1.6, fase: 0, rand: 1 }));
  K.glut(cx0, (yF + yT) / 2, rc * k * 5, '#16241e', .8, [1, 2, 3]);
  K.licht(cx0, yF - rc * k, SEE, rc * k * 6, .6);
  // Bewegung: Bahnen gleiten nach unten
  const pts = []; for (let y = Math.max(-M, Math.floor(yT)); y < yF; y++) for (let x = Math.floor(m.x0); x <= m.x1; x++) if (m.has(x, y) && B.hash(x, 0, 7) > .55) pts.push(x, y);
  const cs = [B.css(SCHAUM[1]), B.css(WASSER[9])];
  if (!o.ruhig) K.anim.push({ p: B.PAR[eb], f(ctx, t, ox, oy) { for (let i = 0; i < pts.length; i += 2) { const x = pts[i], y = pts[i + 1], v = frac(y * .07 - t * .9 + B.hash(x, 1, 3)); if (v > .9) { ctx.fillStyle = cs[v > .97 ? 0 : 1]; ctx.fillRect(x + ox, y + oy, 1, 1); } } } });
  return { x: cx0, y: yF, r: rc * k };
}

// ---------- Sand vom Anfang ----------
function sandBoden(K, P, o) {
  o = o || {}; const sd = (K.o.seed | 0) % 89, lx = o.lichtX || 380, nass = o.nass || [];
  K.boden(P.vy, H + M, SAND, (x, y) => {
    const Z = P.z(y + .5), X = (x + .5 - P.vx) * Z / P.h, k = P.k(Z);
    let t = .42 + .3 * B.clamp(1 - 3 / Z, 0, 1) - .2 * B.clamp(1 - Z / 1.9, 0, 1) + (B.fbm(X * .7, Z * .7, sd, 3) - .5) * .16;
    t += .12 * Math.exp(-(((x - lx) / 130) ** 2)) * B.clamp(1 - 3 / Z, 0, 1);
    // Rippelmarken quer zum Blick (wie am Strand vom Anfang), nur wo sie groß genug sind
    const rp = Math.sin(Z * 7 + Math.sin(X * 1.1 + sd) * 1.4 + B.fbm(X * .4, Z * .4, sd + 5, 2) * 3);
    if (k > 14 && rp > .72) t += .1; else if (k > 14 && rp < -.85) t -= .07;
    // nasse Stellen (unter der Säule, unter der Gischt): dunkler, Rand mit Flutlinie
    for (const [nx, nz, nr] of nass) { const d = Math.hypot(X - nx, (Z - nz) * .8) / nr; if (d < 1) t -= .22 * (1 - d * d); else if (d < 1.12) t += .1; }
    return t;
  });
}
// Fußspuren: deine. Sie führen von vorne in die Säule (oder unter die Welle) und kommen nicht zurück.
// pfad: Liste [X, Z] in Weltkoordinaten; ende: ab welchem Anteil sie nass sind
function spuren(K, P, pfad, o) {
  o = o || {}; const schritt = o.schritt || .42, gesamt = [];
  for (let i = 0; i + 1 < pfad.length; i++) { const [x0, z0] = pfad[i], [x1, z1] = pfad[i + 1], d = Math.hypot(x1 - x0, z1 - z0); for (let s = 0; s < d; s += .02) gesamt.push([x0 + (x1 - x0) * s / d, z0 + (z1 - z0) * s / d]); }
  const L = gesamt.length; let n = 0;
  for (let i = 0, acc = 0; i + 1 < L; i++) {
    acc += .02; if (acc < schritt) continue; acc = 0; n++;
    const [X, Z] = gesamt[i], [X2, Z2] = gesamt[i + 1], dx = X2 - X, dz = Z2 - Z, dl = Math.hypot(dx, dz) || 1, seite = n % 2 ? 1 : -1;
    const fx = X - dz / dl * .07 * seite, fz = Z + dx / dl * .07 * seite;
    if (fz < 1.05) continue;
    const [sx, sy] = P.q(fx, 0, fz), k = P.k(fz), rx = Math.max(.7, k * .05), ry = Math.max(.6, k * .17 / fz), eb = K.eb(sy), e = K.e[eb];
    const nassQ = i / L > (o.nassAb || .8);
    // Fuß: Ballen (fern) und Ferse (nah), dazwischen schmal
    const m = B.maske(); m.ell(sx + dx / dl * rx * .3, sy - ry * .35, rx, ry * .62); m.ell(sx, sy + ry * .45, rx * .78, ry * .48);
    if (ry > 2) m.ell(sx + dx / dl * rx * .15 + (seite > 0 ? -1 : 1) * rx * .25, sy, rx * .55, ry * .4);
    for (let y = Math.floor(sy - ry - 1); y <= sy + ry + 1; y++) for (let x = Math.floor(sx - rx - 1); x <= sx + rx + 1; x++) {
      if (!m.has(x, y)) continue; const unten = !m.has(x, y + 1), oben = !m.has(x, y - 1);
      e.set(x, y, B.pk(unten ? SAND[6] : oben ? SAND[1] : nassQ ? WASSER[3 + ((x + y) & 1)] : SAND[(x + y) & 1 ? 2 : 3]));
    }
    if (nassQ && rx > 1) e.set(Math.round(sx), Math.round(sy - ry * .3), B.pk(SEE));
  }
}
function fels(K, eb, pts, tiefe, o) { const m = B.maske(); m.poly(pts); K.form(eb, m, tiefe, Object.assign({ k: FELS, ton: 1.4, fase: 2, rand: 2, schatten: 2, muster: (x, y) => (B.fbm(x * .08, y * .08, 7, 2) - .5) * 1.2 + (B.rausch2(x * .3, y * .9, 3) > .78 ? -.6 : 0) }, o || {})); return m; }
// Vordergrund: Felsrand der Höhle oben (angeschnitten), die Decke ist kein Himmel
function hoehlenRand(K, links, rechts) {
  const v = B.maske();
  if (links) v.poly([[-M, -M], [links[0], -M], [links[0] - 18, 14], [links[0] - 40, 22], [links[0] - 52, 46], [-M, links[1]]]);
  if (rechts) v.poly([[W + M, -M], [rechts[0], -M], [rechts[0] + 14, 10], [rechts[0] + 34, 16], [rechts[0] + 52, 34], [W + M, rechts[1]]]);
  // Tropfzapfen am Rand, nass glänzend
  for (const [x, y, l] of [[(links || [0])[0] - 30, 18, 14], [(links || [0])[0] - 46, 30, 9], [(rechts || [W])[0] + 22, 12, 12]]) v.kap(x, y, x + 1, y + l, 2.2, .6);
  K.form(5, v, 0, { k: VORNE, r: [WASSER[6], MORGEN], ton: 1, fase: 2, rand: 2, muster: (x, y) => (B.fbm(x * .07, y * .07, 3, 2) - .5) * .8 });
}
function treibholz(K, x, y, s) { const th = B.maske(); th.pfad([[x, y], [x + 30 * s, y - 4 * s], [x + 56 * s, y - 1 * s]], 3 * s, 2 * s); th.kap(x + 20 * s, y - 3 * s, x + 14 * s, y - 12 * s, 1.2 * s, .8 * s); K.form(4, th, 0, { k: SAND.slice(0, 4), r: [SAND[6], MORGEN], ton: 2, schatten: 2 }); }
// Strandkorb (1925, Ostsee- und Nordseebad), von hinten: Korbgeflecht, die Haube, er schaut aufs Wasser
function strandkorb(K, P, X, Z, o) {
  o = o || {}; const k = P.k(Z), [x, y] = P.q(X, 0, Z), w = .7 * k, hh = 1.0 * k, eb = K.eb(y - 1), m = B.maske();
  m.rect(x - w / 2, y - hh * .62, w, hh * .62 - k * .06);
  m.fn(x - w / 2 - k * .03, y - hh, x + w / 2 + k * .03, y - hh * .6, (px, py) => { const u = (px - x) / (w / 2 + k * .03), v = (py - (y - hh * .62)) / (hh * .4); return u * u + v * v * .9 <= 1 || (py > y - hh * .7 && Math.abs(u) <= 1); });
  m.rect(x - w / 2 + k * .04, y - k * .08, k * .08, k * .08); m.rect(x + w / 2 - k * .12, y - k * .08, k * .08, k * .08);
  K.form(eb, m, o.tiefe || 0, { k: KORB, r: [SAND[5], MORGEN], ton: 1.6, fase: 1.5, rand: 2, schatten: 2,
    muster: (px, py) => ((Math.floor(px + py * .6) & 3) === 0 ? -.55 : (Math.floor(px - py * .6) & 3) === 0 ? .3 : 0) + (Math.abs(py - (y - hh * .62)) < 1.2 ? -.8 : 0) });
  // Saum der Haube: gestreifter Stoff, der unten heraushängt (das einzige Bunte, ausgeblichen)
  for (let px = Math.round(x - w / 2); px <= x + w / 2; px++) { const c = (Math.floor((px - x) / Math.max(1, k * .06)) & 1) ? '#5a4a3a' : '#2a3436'; K.e[eb].set(px, Math.round(y - hh * .62) + 1, B.pk(c)); }
  return { x, y, w, hh };
}

// =====================================================================
// Variante 0: Die Flutlinie. Weiter Strand, flacher Horizont; die Wellenreihen der Decke rollen auf dich zu.
// Rechts der Mitte hängt die Säule auf den Sand, deine Spuren führen von links vorne hinein.
function flutlinie(K, o) {
  o = o || {}; const P = B.persp(240, 148), Yc = 4.2, fr = K.fr; K.split = [160, 176];
  const Xs = 1.15, Zs = 5.2;
  deckeBauen(K, P, { Yc, ruhig: o.ruhig, trichter: o.ohneSaeule ? null : (X, Z) => 1.1 * Math.exp(-(((X - Xs) / 1.1) ** 2) - (((Z - Zs) / 1.3) ** 2)) });
  sandBoden(K, P, { nass: o.ohneSaeule ? [[-2.4, 4.6, .7]] : [[Xs, Zs, .9], [-2.4, 4.6, .7]] });
  // ferne Felsen am Horizont links (die Höhle hat Wände), klein gegen die Weite
  fels(K, 1, [[-M, P.vy + 1], [-M, P.vy - 30], [20, P.vy - 34], [44, P.vy - 20], [70, P.vy - 14], [96, P.vy - 4], [110, P.vy + 1]], .55, { rand: 1 });
  fels(K, 2, [[350, P.vy + 2], [360, P.vy - 6], [372, P.vy - 9], [384, P.vy - 3], [392, P.vy + 2]], .35);
  let s = null;
  if (!o.ohneSaeule) s = saeule(K, P, Xs, Zs, .14, Yc, { ruhig: o.ruhig, tiefe: .05 });
  // deine Spuren: von links vorne quer über den Sand in die Säule
  const ziel = o.ohneSaeule ? [Xs - .3, Zs - .6] : [Xs - .05, Zs - .1];
  spuren(K, P, [[-1.6, 1.1], [-1.1, 1.9], [-.2, 3.0], [.6, 4.1], ziel], { nassAb: .82 });
  if (fr > .4 && !o.ohneSaeule) spuren(K, P, [[-3.2, 2.2], [-1.9, 3.2], [-.4, 4.4], [Xs - .15, Zs + .05]], { nassAb: .8, schritt: .4 });
  if (fr > .8 && !o.ohneSaeule) spuren(K, P, [[3.6, 1.6], [2.9, 2.8], [1.8, 4.2], [Xs + .1, Zs]], { nassAb: .8, schritt: .44 });
  // die tiefste Lippe vorne lässt Gischt fallen
  if (!o.ruhig) gischt(K, P, [[96, 18, .5], [131, 30, .35], [402, 12, .45], [438, 24, .3]], P.vy + 8);
  treibholz(K, 330, 238, 1);
  if (!o.ohneRand) hoehlenRand(K, [78, 70], [420, 60]);
  B.partikel(K, { n: 30, farben: [WASSER[8], SCHAUM[0]], vx: 0, vy: 14, wob: 2, wf: .6, y0: 0, y1: P.vy + 20, laenge: 2, p: .4 });
  K.reihen = [{ y: 170, skala: .9, nebel: .3 }, { y: 192, skala: 1, nebel: .12 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [236, 208], s };
}

// =====================================================================
// Variante 1: Der Brecher. Eine einzige große Welle hängt von links oben herab und bricht über dem Strand;
// ihre Lippe berührt hinten links den Sand. Die Spuren laufen unter sie.
function brecher(K) {
  const P = B.persp(290, 160), Yc = 4.6; K.split = [172, 186];
  const extra = (X, Z) => 2.6 * Math.exp(-(((Z - 3.6 - X * .18) / .9) ** 2)) * B.clamp((-.2 - X) / 2.2, 0, 1);
  deckeBauen(K, P, { Yc, extra, lichtX: 400, dichte: 1.1 });
  sandBoden(K, P, { nass: [[-3.6, 4.2, 1.4]], lichtX: 400 });
  // wo die Lippe auf dem Sand aufliegt: ein Schaumsaum
  const sm = B.maske(); for (let i = 0; i < 40; i++) { const X = -7 + i * .12, Z = 3.6 + X * .18 + .25; if (X > -1.4) break; const [x, y] = P.q(X, 0, Z); sm.ell(x, y, 4 + B.hash(i, 0, 2) * 4, 1.6); }
  B.form(K.e[K.eb(P.q(-3, 0, 3.4)[1])], sm, K.mat(0, { k: [WASSER[7], SCHAUM[0], SCHAUM[1], SCHAUM[1]], r: [SCHAUM[1]], ton: 1.5, fase: 0, rand: 1 }));
  gischt(K, P, [[40, 60, .6], [62, 70, .5], [84, 78, .45], [118, 92, .35], [150, 104, .3]], P.q(-2, 0, 3.4)[1]);
  spuren(K, P, [[.4, 1.1], [-.2, 2.0], [-1.2, 2.9], [-2.4, 3.5], [-3.3, 3.75]], { nassAb: .72 });
  fels(K, 2, [[430, P.vy + 2], [440, P.vy - 16], [460, P.vy - 24], [W + M, P.vy - 30], [W + M, P.vy + 2]], .25);
  strandkorb(K, P, 2.3, 7.5, { tiefe: .25 });
  treibholz(K, 60, 244, .8);
  hoehlenRand(K, null, [436, 80]);
  B.partikel(K, { n: 50, farben: [WASSER[8], SCHAUM[0], SCHAUM[1]], vx: 1, vy: 18, wob: 3, wf: .6, x0: 0, x1: 260, y0: 20, y1: 190, laenge: 2, p: .5 });
  K.reihen = [{ y: 180, skala: .9, nebel: .3 }, { y: 198, skala: 1, nebel: .12 }, { y: 215, skala: 1, nebel: 0 }];
  return { mitte: [250, 210] };
}

// =====================================================================
// Variante 2: Der Strandkorb. Rechts steigt die Felswand der Höhle in die Flucht, links der Strand.
// Ein Strandkorb steht mit dem Rücken zu dir und schaut aufs Wasser; hinten links hängt die Säule.
function strandkorbSzene(K, o) {
  o = o || {}; const P = B.persp(210, 146), Yc = 4.0; K.split = [158, 172];
  const Xs = -1.9, Zs = 7.5;
  deckeBauen(K, P, { Yc, lichtX: 330, ruhig: o.ruhig, trichter: (X, Z) => 1.2 * Math.exp(-(((X - Xs) / 1.2) ** 2) - (((Z - Zs) / 1.5) ** 2)) });
  sandBoden(K, P, { nass: [[Xs, Zs, 1]], lichtX: 330 });
  // Felswand rechts in Flucht: Schichten, nass, oben vom Wasser abgeschnitten
  const XW = 2.7, unten = [], oben = [];
  for (let Z = 1; Z <= 40; Z *= 1.06) { const xo = XW + Math.sin(Z * 1.7) * .12; unten.push(P.q(xo, 0, Z)); oben.push(P.q(xo, Yc - .5 - Math.sin(Z * 2.3) * .35, Z)); }
  const wm = B.maske(); wm.poly([...unten, ...oben.reverse(), [W + M + 400, -M - 400], [W + M + 400, H + M]]);
  K.form(2, wm, .05, { k: FELS, ton: 1.5, fase: 2, rand: 2, schatten: 2, verlauf: -.6, muster: (x, y) => { const Z = (XW * P.h) / Math.max(1, x - P.vx), Y = 1 - (y - P.vy) * Z / P.h; return (frac(Y * 3 + B.fbm(Z * .3, 0, 4, 2)) < .12 ? -.7 : 0) + (B.fbm(Z * .8, Y * 2, 5, 2) - .5) * .7; } });
  saeule(K, P, Xs, Zs, .12, Yc, { ruhig: o.ruhig, tiefe: .1 });
  const korb = strandkorb(K, P, -.7, 2.7);
  spuren(K, P, [[.9, 1.1], [.3, 2.2], [-.2, 3.0], [-.9, 4.4], [-1.5, 6.0], [Xs, Zs - .1]], { nassAb: .85 });
  // ein Handtuch über der Armlehne des Korbs, nass
  const ht = B.maske(); ht.poly([[korb.x + korb.w / 2 - 2, korb.y - korb.hh * .55], [korb.x + korb.w / 2 + 4, korb.y - korb.hh * .52], [korb.x + korb.w / 2 + 3, korb.y - korb.hh * .3], [korb.x + korb.w / 2 - 1, korb.y - korb.hh * .32]]);
  K.form(K.eb(korb.y - 1), ht, 0, { k: ['#1a1a16', '#2a2a24', '#3e3c34', '#56544a'], r: [SAND[6], MORGEN], ton: 1.6, fase: 1, rand: 2 });
  gischt(K, P, [[70, 20, .45], [104, 34, .35], [300, 10, .4]], P.vy + 10);
  fels(K, 4, [[-M, 238], [-M, 212], [14, 206], [34, 214], [52, 232], [60, H + M], [-M, H + M]], 0);
  hoehlenRand(K, [60, 50], null);
  B.partikel(K, { n: 30, farben: [WASSER[8], SCHAUM[0]], vx: 0, vy: 14, wob: 2, wf: .6, y0: 0, y1: P.vy + 20, laenge: 2, p: .4 });
  K.reihen = [{ y: 168, skala: .9, nebel: .3 }, { y: 190, skala: 1, nebel: .12 }, { y: 213, skala: 1, nebel: 0 }];
  return { mitte: [250, 208], korb };
}

// =====================================================================
// Finale: Wo es ruft. Die Säule ist nah und weit wie ein Trichter, die Wellen der Decke drehen sich in sie hinein.
// Von allen Seiten führen Spuren hinein, alle von denselben Füßen. Keine kommt zurück.
function finale(K) {
  const P = B.persp(240, 156), Yc = 4.4, Xs = 0, Zs = 4.6; K.split = [170, 184];
  const trichter = (X, Z) => { const d = Math.hypot(X - Xs, (Z - Zs) * .9); return 2.1 * Math.exp(-((d / 1.9) ** 2)); };
  // Spirale: die Phase dreht um die Säule
  deckeBauen(K, P, { Yc, trichter, lichtX: 240, dichte: .8, extra: (X, Z) => .25 * Math.sin(Math.atan2(Z - Zs, X - Xs) * 3 + Math.hypot(X - Xs, Z - Zs) * 2.2) * Math.exp(-((Math.hypot(X - Xs, Z - Zs) / 3) ** 2)) });
  sandBoden(K, P, { nass: [[Xs, Zs, 1.6]], lichtX: 240 });
  fels(K, 1, [[-M, P.vy + 1], [-M, P.vy - 40], [30, P.vy - 30], [70, P.vy - 12], [100, P.vy + 1]], .5, { rand: 1 });
  fels(K, 1, [[W + M, P.vy + 1], [W + M, P.vy - 46], [450, P.vy - 36], [416, P.vy - 16], [380, P.vy + 1]], .5, { rand: 1 });
  const s = saeule(K, P, Xs, Zs, .42, Yc, { tiefe: 0 });
  // Spuren von überall her, alle hinein
  [[[-3.8, 1.2], [-2.6, 2.4], [-1.1, 3.8], [-.3, 4.4]], [[3.4, 1.3], [2.2, 2.6], [.9, 3.9], [.3, 4.4]], [[-.6, 1.1], [-.4, 2.6], [-.1, 4.0]],
   [[-6, 4.2], [-3.5, 4.4], [-.5, 4.6]], [[6.4, 3.6], [3.8, 4.2], [.5, 4.6]], [[1.6, 1.1], [1.1, 2.4], [.4, 4.1]]].forEach((p, i) => spuren(K, P, p, { nassAb: .75, schritt: .4 + (i % 3) * .03 }));
  gischt(K, P, [[150, 30, .4], [178, 52, .35], [306, 48, .35], [334, 26, .4]], P.vy + 6);
  hoehlenRand(K, [70, 80], [416, 76]);
  B.partikel(K, { n: 60, farben: [WASSER[8], SCHAUM[0], SCHAUM[1]], vx: 0, vy: 16, wob: 3, wf: .6, x0: 60, x1: 420, y0: 0, y1: 180, laenge: 2, p: .5 });
  K.reihen = [{ y: 184, skala: .9, nebel: .25 }, { y: 200, skala: 1, nebel: .1 }, { y: 214, skala: 1, nebel: 0 }];
  return { mitte: [240, 210], s };
}

// ---------- Zusätze je Art ----------
// Übergang (Ankunft im Akt): eine hölzerne Strandtreppe kommt aus einem Spalt in der Felswand links herab
function strandtreppe(K, P) {
  const m = B.maske(), stufen = 9;
  for (let i = 0; i < stufen; i++) { const q = i / stufen, x = 30 + q * 150, y = 70 + q * 140; m.rect(x - 2, y, 30, 3); m.rect(x + 22, y + 3, 3, 8); }
  m.kap(26, 60, 176, 214, 1.5, 2.2); m.kap(56, 62, 206, 214, 1.5, 2.2); for (let i = 0; i < 5; i++) { const q = i / 4; m.kap(28 + q * 150, 66 + q * 140, 28 + q * 150, 46 + q * 140, 1, 1); }
  m.kap(28, 46, 178, 186, .8, .8);
  K.form(4, m, 0, { k: KORB, r: [SAND[6], MORGEN], ton: 1.5, fase: 1, rand: 2, schatten: 2 });
  const sp = B.maske(); sp.poly([[-M, -M], [70, -M], [64, 30], [44, 60], [10, 70], [-M, 80]]); sp.poly([[14, 40], [40, 36], [46, 56], [20, 64]], 0);
  K.form(5, sp, 0, { k: VORNE, r: [WASSER[6], MORGEN], ton: 1, fase: 2, rand: 2 });
  B.dith(K.e[5], 14, 36, 48, 66, '#2a2a1e', (x, y) => sp.has(x, y) ? 0 : .5); // Licht von oben im Spalt
  // Sand rieselt die Stufen hinab
  K.luft.push({ p: .8, f(ctx, t, ox, oy) { ctx.fillStyle = B.css(SAND[6]); for (let i = 0; i < 12; i++) { const q = frac(t * .2 + i / 12); ctx.fillRect(Math.round(34 + q * 150 + Math.sin(i) * 6) + ox, Math.round(66 + q * 142) + oy, 1, 1); } } });
  void P;
}
function bauen(o) {
  const K = B.kontext(pal, o), art = o.art; let v = o.variante, info;
  if (art !== 'kampf' && art !== 'waechter') v = art === 'rast' ? 2 : art === 'uebergang' ? 0 : (o.seed + v) % 3;
  if (art === 'waechter') info = finale(K);
  else if (art === 'ankunft') info = flutlinie(K, { ruhig: true, ohneSaeule: true });
  else info = [k => flutlinie(k, { ohneRand: art === 'uebergang' }), brecher, strandkorbSzene][v](K);
  if (art === 'uebergang') strandtreppe(K);
  else if (art === 'rast' && info.korb) { for (let i = 0; i < 3; i++) B.dith(K.e[i], -M, -M, W + M, H + M, pal.koerper[0], (px) => .22 + .1 * i - Math.abs(px - 330) / 1800); B.feuer(K, 330, 222); }
  else if (art !== 'ankunft') B.artZusatz(K, { x: info.mitte[0], y: info.mitte[1] });
  return K.fertig();
}
// Ankunft nach dem Finale: das Meer liegt still an der Decke, die Säule ist fort; deine Spuren enden mitten im Sand.
function ankunft(o) { return bauen(Object.assign({}, o, { art: 'ankunft' })); }
World._biome.ufer = { pal, build: bauen, ankunft, reliefStil: { figuren: 5, gelenke: 2, knick: .25, grossX: 118 } };
})();
