// Der Klöppel (Glockengießerei). Eine Glocke, mannshoch, geht auf zwei nackten Beinen. Er hängt darin,
// wo der Klöppel hängen müsste, und bei jedem Schritt schlägt er innen an. Unter dem Rand greift eine
// Hand hervor, die Finger über die Schärfe gehakt. Aus dem Mund glüht es, die Speise ist noch warm.
'use strict';
const LIB = require('../lib');
// Innere Randlicht-Stufe: wo ein Teil vor einem anderen liegt, fängt seine Lichtkante eine Linie Licht
function innenKanten(P, gid, gruppen, W, H, stufe = 'r1') {
  const g = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? -1 : gid[y * W + x]);
  const ziel = [];
  for (let y = 1; y < H - 1; y++) for (let x = 0; x < W - 1; x++) {
    const gi = g(x, y); if (gi < 0 || !gruppen[gi] || !gruppen[gi].kante) continue;
    const c = P.get(x, y); if (c < 1 || c > 4) continue;
    const a = g(x + 1, y - 1), b = g(x + 1, y), d = g(x, y - 1);
    const hinten = v => v >= 0 && v < gi;
    if (hinten(a) || (hinten(b) && hinten(d))) ziel.push([x, y]);
  }
  for (const [x, y] of ziel) P.set(x, y, stufe);
}
// Glockenprofil: halbe Breite (Anteil am Randradius) über der Höhe (0 oben, 1 Schärfe)
const PROFIL = {
  zucker: [[0, 0.40], [0.04, 0.5], [0.12, 0.54], [0.35, 0.55], [0.55, 0.6], [0.7, 0.68], [0.82, 0.8], [0.91, 0.93], [0.97, 1.0], [1, 0.99]],
  breit: [[0, 0.5], [0.05, 0.62], [0.15, 0.68], [0.4, 0.7], [0.6, 0.76], [0.75, 0.86], [0.88, 0.97], [0.96, 1.03], [1, 1.0]],
  haube: [[0, 0.45], [0.06, 0.6], [0.2, 0.66], [0.5, 0.72], [0.75, 0.84], [0.92, 0.98], [1, 1.0]],
};
module.exports = {
  id: 'kloeppelmann', biom: 'glockengiesserei', zone: 'glockengiesserei', w: 96, h: 120, fuss: [48, 115], kopf: [50, 8], rimBis: 113,
  varianten: {
    // a: schlanke, hohe Glocke (alte Zuckerhutform), die Hand links unter dem Rand
    kloeppelmann_a: { prof: 'zucker', R: 21, yt: 20, h: 68, cx: 50, krone: 3 },
    // b: breite, kurze Glocke mit Sprung im Rand und einem Seilrest an der Krone
    kloeppelmann_b: { prof: 'breit', R: 25, yt: 30, h: 58, cx: 50, krone: 2, sprung: true, seil: true },
  },
  // Silhouetten-Probe (verworfen): eine kleine Haube auf langen Beinen las sich als Lampenschirm mit Beinen;
  // erst die große Glocke, unter der nur noch Unterschenkel herausschauen, sagt „da hängt einer drin“.
  proben: { sil_haube: { prof: 'haube', R: 16, yt: 24, h: 40, cx: 50, krone: 1, beinLang: true } },
  bild(p, v, A) {
    const { E, C, Pg, glied, r } = A;
    const f = p.f, W = 96, H = 120;
    let a = 0, dx = 0, dy = 0, fall = 0, glueh = 0.6, schritt = 0, knick = 0, sway = 0;
    if (p.idle) { schritt = [0, 1, 0, -1][f]; glueh = [0.6, 0.68, 0.58, 0.64][f]; }
    if (p.angriff) { a = [0.1, 0.2, -0.3, -0.12][f]; dx = [2, 4, -9, -4][f]; dy = [0, -1, 1, 0][f]; glueh = [0.7, 0.8, 1.3, 0.9][f]; schritt = [0, 1, -2, -1][f]; }
    if (p.treffer) { a = [0.08, 0.04][f]; dx = [2, 1][f]; glueh = 0.3; }
    if (p.tod) { knick = Math.min(1, p.q * 1.6); fall = r(p.q * 22); a = p.q * 0.35; glueh = Math.max(0, 0.6 - p.q); }
    const R = v.R, h = v.h, yt = v.yt + dy + r(knick * 10), cx = v.cx + dx + sway;
    const yb = yt + h, py = yb - 4, pxx = cx; // Drehpunkt: innen über dem Mund (dort hängt er)
    const rot = (x, y) => [pxx + (x - pxx) * Math.cos(a) - (y - py) * Math.sin(a), py + (x - pxx) * Math.sin(a) + (y - py) * Math.cos(a)];
    const prof = PROFIL[v.prof];
    const rechts = prof.map(([q, w]) => [cx + w * R, yt + q * h]);
    const links = prof.slice().reverse().map(([q, w]) => [cx - w * R, yt + q * h]);
    // Schärfe: leicht nach oben gewölbt, man sieht in den Mund
    const mund = [[cx + R * 0.7, yb + 1.2], [cx, yb + 2], [cx - R * 0.7, yb + 1.2]];
    const glocke = [Pg([...rechts, ...mund, ...links].map(([x, y]) => rot(x, y)), null, { rd: 0.8, hz: 1.4 })];
    // Krone: Henkel oben, mittig; b mit Seilrest
    const krone = [];
    const kb = v.krone;
    for (let i = 0; i < kb; i++) {
      const u = kb === 1 ? 0 : (i / (kb - 1) - 0.5) * R * 0.5, hh = 7 - Math.abs(u) * 0.15;
      const p0 = rot(cx + u - 2.5, yt + 1), p1 = rot(cx + u - 2, yt - hh), p2 = rot(cx + u + 2, yt - hh), p3 = rot(cx + u + 2.5, yt + 1);
      krone.push(C(p0[0], p0[1], p1[0], p1[1], 1.6, 1.4, null), C(p1[0], p1[1], p2[0], p2[1], 1.4, 1.4, null), C(p2[0], p2[1], p3[0], p3[1], 1.4, 1.6, null));
    }
    const kp = rot(cx, yt - 1); krone.push(E(kp[0], kp[1], R * 0.32, 2.2, null));
    const seil = [];
    if (v.seil) { const s0 = rot(cx + 1, yt - 7); seil.push(...glied([s0, [s0[0] + 3, s0[1] - 4], [s0[0] + 9 + sway, s0[1] - 6], [s0[0] + 13 + sway, s0[1] - 3]], 1.2, 0.8, null)); }
    // Mund innen: dunkel, glüht
    const mi = rot(cx, yb + 0.5);
    const mundInnen = [E(mi[0], mi[1], R * 0.86, 2.6, 'dunkel', { pf: 'flat' })];
    // Beine: nackt, dünn, aus dem Mund; Knie leicht gebeugt, Füße zeigen nach links (zu dir)
    const hL = rot(cx - 5, yb - 2), hR = rot(cx + 5, yb - 2);
    const lang = v.beinLang ? 1 : 0;
    const fb = 114;
    const sL = schritt > 0 ? 1 : 0, sR = schritt < 0 ? 1 : 0;
    const kL = [hL[0] - 4 - knick * 6, (hL[1] + fb) / 2 + knick * 6], kR = [hR[0] + 3 - knick * 2, (hR[1] + fb) / 2 + knick * 7];
    const aL = [hL[0] - 2 - knick * 3, fb - 2 - sL], aR = [hR[0] + 2, fb - 2 - sR];
    const beinL = glied([hL, kL, aL], 2.6 + lang, 1.5, 'haut'), beinR = glied([hR, kR, aR], 2.6 + lang, 1.5, 'haut');
    const fussL = [C(aL[0], aL[1] + 1, aL[0] - 6, fb + 0.5 - sL, 1.6, 1.1, 'haut')];
    const fussR = [C(aR[0], aR[1] + 1, aR[0] - 6, fb + 0.5 - sR, 1.6, 1.1, 'haut')];
    // Hand: greift von innen über die Schärfe, links vorn
    const hand = [];
    if (!p.tod || f < 3) {
      const h0 = rot(cx - R * 0.6, yb + 1);
      for (let i = 0; i < 4; i++) { const x0 = h0[0] - 4.5 + i * 2.6; hand.push(C(x0 + 0.5, h0[1] - 2, x0 - 0.4, h0[1] + 4.5 + (i % 2) * 1.5 - (i === 3 ? 1 : 0), 1.15, 0.85, 'haut')); }
      hand.push(C(h0[0] - 4, h0[1] - 1.5, h0[0] + 4, h0[1] - 1.5, 1.6, 1.6, 'haut'));
    }
    const gruppen = [
      { p: seil, k: 0, kante: true },
      { p: beinR, k: 1, kante: true },
      { p: fussR, k: 0.6, kante: true },
      { p: krone, k: 0.6, kante: true },
      { p: glocke, k: 0, kante: true },
      { p: mundInnen, k: 0, noRim: true },
      { p: beinL, k: 1, kante: true },
      { p: fussL, k: 0.6, kante: true },
      { p: hand, k: 0.4, kante: true },
    ];
    const GL = 4, MUND = 5;
    gruppen.forEach(g => { g.anker = [r(cx - v.cx), r(yt - v.yt)]; });
    const { gid } = LIB.render(W, H, gruppen, LIB.palette('glockengiesserei'), { rimBis: 113 });
    const augen = [];
    const breiteBei = q => { for (let i = 1; i < prof.length; i++) if (q <= prof[i][0]) { const [q0, w0] = prof[i - 1], [q1, w1] = prof[i]; return w0 + (w1 - w0) * (q - q0) / (q1 - q0 || 1); } return prof[prof.length - 1][1]; };
    const inv = (x, y) => { const X = x - pxx, Y = y - py; return [pxx + X * Math.cos(-a) - Y * Math.sin(-a), py + X * Math.sin(-a) + Y * Math.cos(-a)]; };
    const details = P => {
      // Zierleisten (Rippen) und Schriftband: in Glockenkoordinaten, Rille dunkel, Grat darüber hell
      const leisten = v.prof === 'breit' ? [0.13, 0.17, 0.76, 0.8] : [0.11, 0.15, 0.8, 0.84];
      const band = v.prof === 'breit' ? [0.2, 0.3] : [0.18, 0.27];
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (gid[y * W + x] !== GL) continue; const c = P.get(x, y); if (c < 1 || c > 4) continue;
        const [u, w] = inv(x + 0.5, y + 0.5); const q = (w - yt) / h, s = (u - cx) / R;
        for (const l of leisten) { if (Math.abs(q - l) * h < 0.55) P.set(x, y, 'k0'); else if (Math.abs(q - l + 1.1 / h) * h < 0.55) P.set(x, y, s > 0.15 ? 'r1' : 'k3'); }
        // Schriftband: kleine erhabene Zeichen in Bronze, nur zur Lichtseite lesbar (nie Text)
        if (q > band[0] && q < band[1]) {
          const gx = Math.floor((s + 1) * 9), gy = Math.floor((q - band[0]) / (band[1] - band[0]) * 3);
          const hsh = Math.sin(gx * 12.9898 + gy * 78.233 + (v.prof === 'breit' ? 4 : 0)) * 43758.5453 % 1;
          if (gy === 1 && Math.abs(hsh) > 0.45 && s > -0.5 && s < 0.85 && ((x + y) & 1)) P.set(x, y, s > 0.2 ? 'bronze' : 'k3');
        }
        // Bronze ist blank: senkrechte Glanzbänder je nach Lage auf der Rundung (sn = Anteil der halben Breite)
        const sn = s / breiteBei(q), b = LIB.bay(x - r(cx - v.cx), y - r(yt - v.yt));
        if (q > 0.08 && q < 0.95) {
          if (sn > 0.22 && sn < 0.44) { if (b < 0.55) P.set(x, y, 'k3'); }
          else if (sn > 0.5 && sn < 0.6 && q > 0.25 && q < 0.86) { if ((y & 1) && b < 0.7) P.set(x, y, 'bronze'); else P.set(x, y, 'k3'); }
          else if (sn > -0.2 && sn < 0.22 && b < 0.18) P.set(x, y, 'k2');
          else if (sn < -0.45 && b < 0.5 && c > 1) P.set(x, y, 'k1');
        }
        // Licht von unten: Glut aus der Grube spiegelt sich am Schlagring links
        if (q > 0.78 && sn < -0.4 && b < (q - 0.78) * 2.2 * glueh) P.set(x, y, 'glutDim');
        // Schatten unter dem Schlagring
        if (q > 0.93 && sn > -0.3 && sn < 0.6 && b < 0.6) P.set(x, y, 'k0');
      }
      // Sprung (b): vom Rand rechts nach oben, glüht innen
      if (v.sprung) {
        let [sx, sy] = [cx + R * 0.38, yb + 0.5];
        for (let i = 0; i < 16; i++) { const [x, y] = rot(sx, sy); if (gid[r(y) * W + r(x)] === GL) P.set(x, y, i < 6 ? 'guss' : i < 11 ? 'glutDim' : 'k0'); sy -= 1; sx += (i % 3 === 0 ? 1 : i % 5 === 0 ? -1 : 0); }
      }
      innenKanten(P, gid, gruppen, W, H, 'r1');
      // kräftiges Randlicht an der Glockenflanke zur Lichtseite: außen hell, innen die dunklere Stufe
      { const leer = (x, y) => x < 0 || y < 0 || x >= W || y >= H || !P.get(x, y), z = [];
        for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { if (gid[y * W + x] !== GL) continue; const c = P.get(x, y); if (c < 1 || c > 5) continue; const [, w] = inv(x + 0.5, y + 0.5); if ((w - yt) / h > 0.97) continue;
          if (leer(x + 1, y) || leer(x + 1, y - 1)) z.push([x, y, 'r2']); else if (leer(x + 2, y) || leer(x + 2, y - 1) || leer(x, y - 1)) z.push([x, y, 'r1']); }
        for (const [x, y, c] of z) P.set(x, y, c); }
      // Mund: von innen glühend; hinter den Beinen, im Dunkel
      if (glueh > 0) {
        const [mx, my] = rot(cx, yb + 0.5);
        for (let y = r(my - 3); y <= r(my + 3); y++) for (let x = r(mx - R); x <= r(mx + R); x++) {
          if (gid[y * W + x] !== MUND) continue; const d = Math.abs(x + 0.5 - mx) / (R * 0.86), t = glueh * (1 - d * d) - (y > my + 0.5 ? 0.25 : 0);
          P.set(x, y, t > 0.95 ? 'glut' : t > 0.6 ? 'guss' : t > 0.3 + LIB.bay(x, y) * 0.3 ? 'glutDim' : 'k0');
        }
        P.glow(mx, my - 2, R * 0.9 * glueh + 4, 0.7 * Math.min(1, glueh), 'glutDim', 'k2');
        if (glueh > 0.9) { P.set(mx - 1, my, 'kern'); P.set(mx, my, 'kern'); }
        else P.set(mx, my, 'glut');
        augen.push([r(mx), r(my)]);
        // Glut fällt auf die Innenseite der Beine (Licht von unten innen)
        for (const k of [...beinL, ...beinR]) { if (k.t !== 'c') continue; for (let t = 0; t <= 1; t += 0.12) { const x = k.x1 + (k.x2 - k.x1) * t, y = k.y1 + (k.y2 - k.y1) * t; if (y < my + 9 && y > my) P.auf(x + (k.x1 < mx ? 1 : -1) * (k.r1 - 0.8), y, 'glutDim'); } }
      }
      // Fingernägel blass, Zehen gespreizt
      for (const fu of [...fussL, ...fussR]) P.auf(fu.x2 - 0.5, fu.y2 - 1, 'k3');
    };
    let out = { gruppen, details, augen };
    if (fall) out.sinken = 0;
    return out;
  },
};
