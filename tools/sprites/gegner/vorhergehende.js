// Der Vorhergehende (Glasmeer). Der Kundschafter der Expedition von 1925, der mit der Eisstange vorausging
// und den Boden abklopfte. Hager, zu lang, im Pelzanorak mit großer Kapuzenkrause, Schneebrille aus Holz
// mit zwei Sehschlitzen. Unter seinen Füßen steht im schwarzen Glas sein Spiegelbild, und es ist ihm voraus:
// Wenn er ruhig steht, holt es schon aus; wenn er zuschlägt, steht es schon wieder still; wenn er fällt,
// ist es schon fort.
'use strict';
const { glas } = require('./glasschwimmer');
let L = null; // tools/sprites/lib.js, erst beim Zeichnen geladen (zyklisch über bauen.js)
const FY = 84; // Fußlinie = Spiegelfläche
module.exports = {
  id: 'vorhergehende', biom: 'glasmeer', zone: 'glasmeer', w: 96, h: 120, fuss: [46, FY], kopf: [44, 4], rimBis: FY - 1,
  varianten: {
    vorhergehende_a: { lang: 0, krause: 10, stange: 'lot' },
    vorhergehende_b: { lang: 4, krause: 8.5, stange: 'haken', gebeugt: 3 },
  },
  skizzen: { skizze_ohne_spiegel: { lang: 0, krause: 10, stange: 'lot', ohneSpiegel: true } },
  bild(p, v, A) {
    const { E, C, Pg, r, glied, saum } = A;
    const f = p.f;
    // Pose der Figur: st = Stangenstellung (0 senkrecht, 1 gehoben, 2 Stoß nach vorn unten), lean, fall
    const poseVon = (anim, k) => {
      const o = { st: 0, lean: 0, fall: 0, nick: 0, hem: 0, licht: 1 };
      if (anim === 'idle') { o.hem = [0, 1, 1, 0][k]; o.nick = [0, 0, 1, 0][k]; }
      if (anim === 'angriff') { o.st = [0.6, 1, 2, 1.5][k]; o.lean = [1, 3, -5, -2][k]; o.hem = [0, 1, 2, 1][k]; o.licht = [1, 1.2, 1.5, 1.1][k]; }
      if (anim === 'treffer') { o.lean = [3, 1][k]; o.st = 0.3; o.licht = 0.6; }
      if (anim === 'tod') { o.fall = Math.round(k / 5 * 30); o.lean = Math.round(k / 5 * 4); o.licht = Math.max(0, 1 - k / 3); o.st = 0.5; }
      return o;
    };
    const figur = (o) => {
      const Lg = v.lang, gb = v.gebeugt || 0, lx = o.lean, F = o.fall;
      const cx = 46, top = 28 - Lg + F, hy = 16 - Lg + F * 1.1 + o.nick + gb;
      const S = 8; // Schulterhalbbreite
      // Anorak: bis zur Hüfte, unten ausgestellt, Saum zottig (Pelz); darunter lange dünne Beine
      const HS = 56 - Lg / 2 + F;
      const anorak = Pg([[cx - S + 2 + lx - gb, top], [cx + S - 1 + lx - gb, top - 1], [cx + S + 2 + r(lx / 2), top + 10], [cx + S + 6, HS - 4], ...saum(cx + S + 7, cx - S - 7, HS, 6, 4, 5, o.hem), [cx - S - 5, HS - 4], [cx - S + r(lx / 2), top + 12]], null, { rd: 1 });
      const knie = F ? 0 : 1;
      const beine = [...glied([[cx - 4, HS - 2], [cx - 7, HS + 14 + knie], [cx - 7, FY - 3]], 2.8, 2.1, null), ...glied([[cx + 4, HS - 2], [cx + 6, HS + 13], [cx + 5, FY - 3]], 2.8, 2.1, null)];
      const stiefel = [E(cx - 9, FY - 2, 4.6, 2.6, 'dunkel'), E(cx + 4, FY - 2, 4.6, 2.6, 'dunkel'), C(cx - 7, FY - 9, cx - 7, FY - 3, 3, 3.2, null), C(cx + 5, FY - 9, cx + 5, FY - 3, 3, 3.2, null)];
      // Kapuze mit Pelzkrause: großer zottiger Ring, darin das dunkle Gesicht
      const hx = cx - 2 + lx - gb * 1.5, K = v.krause, kr = [];
      for (let i = 0; i < 18; i++) { const a = i / 18 * Math.PI * 2, rr = K + (i % 2 ? 1.6 : -0.4); kr.push([hx + Math.cos(a) * rr, hy + Math.sin(a) * rr * 1.05]); }
      const krause = Pg(kr, null, { rd: 0.6 });
      const gesicht = E(hx - 0.5, hy + 0.5, K * 0.48, K * 0.58, 'dunkel', { pf: 'flat' });
      // Arme: vorn hält die Stange, hinten hängt
      const sV = [cx - S + 3 + lx - gb, top + 3];
      let hand, ell, wa;
      if (o.st < 0.5) { hand = [cx - 15 + lx, top + 16]; ell = [cx - 14 + lx, top + 9]; wa = -Math.PI / 2 - 0.04; }
      else if (o.st < 1.5) { const q = (o.st - 0.5); hand = [cx - 10 + lx, top - 2 - q * 6]; ell = [cx - 15 + lx, top + 4]; wa = -Math.PI / 2 + 0.55 + q * 0.4; }
      else { hand = [cx - 22 + lx, top + 14]; ell = [cx - 17 + lx, top + 6]; wa = 2.55 - (o.st - 2) * 0.6; }
      const armV = [...glied([sV, ell, hand], 3.6, 2.8, null), E(hand[0], hand[1], 3.2, 3, null)];
      const armH = glied([[cx + S - 2 + lx - gb, top + 3], [cx + S + 2, top + 16], [cx + S + 1, top + 28]], 3.4, 2.6, null);
      const handH = [E(cx + S + 1, top + 30, 3, 3, null)];
      // Stange: lang, durch die Hand; oben Lot (Gewicht) oder Haken
      const SL = 62, back = v.stange === 'haken' ? 18 : 14;
      const a0 = [hand[0] - Math.cos(wa) * back, hand[1] - Math.sin(wa) * back], e = [hand[0] + Math.cos(wa) * (SL - back), hand[1] + Math.sin(wa) * (SL - back)];
      const stange = [C(a0[0], a0[1], e[0], e[1], 1.1, 1.1, null, { pf: 'flat' })];
      if (v.stange === 'haken') stange.push(...glied([e, [e[0] + Math.cos(wa) * 3, e[1] + Math.sin(wa) * 3], [e[0] + Math.cos(wa + 1.8) * 5, e[1] + Math.sin(wa + 1.8) * 5]], 1.3, 0.9, null));
      else stange.push(E(e[0] + Math.cos(wa) * 1.5, e[1] + Math.sin(wa) * 1.5, 2.2, 2.2, null));
      const grp = [
        { p: armH, k: 1 }, { p: handH, k: 0 },
        { p: beine, k: 1 }, { p: stiefel, k: 0 },
        { p: [anorak], k: 2, anker: [lx, F] },
        { p: [krause], k: 0.8 }, { p: [gesicht], k: 0 },
        { p: stange, k: 0 },
        { p: armV, k: 1.2 },
      ];
      return { grp, hx, hy, K, top, cx, e, wa, hand, S, lx };
    };
    const o = poseVon(p.anim, f);
    const F = figur(o);
    // Spiegelbild: einen Schritt voraus (Idle -> schon im Schlag, Angriff -> schon zurück, Tod -> schon fort)
    let sp = null;
    if (!v.ohneSpiegel) {
      if (p.idle) sp = poseVon('angriff', 2);
      else if (p.angriff) sp = poseVon('angriff', Math.min(3, f + 1)) , (f >= 2) && (sp = poseVon('idle', 0));
      else if (p.treffer) sp = poseVon('idle', f);
      else if (p.tod && f === 0) sp = poseVon('tod', 3);
    }
    const augen = [];
    const details = P => {
      // Krause: Reif auf den Pelzspitzen, innen dunkler Rand
      for (let y = r(F.hy - F.K - 3); y <= F.hy + F.K + 3; y++) for (let x = r(F.hx - F.K - 3); x <= F.hx + F.K + 3; x++) { const c = P.get(x, y); if (!c || c > 4) continue; const d = Math.hypot(x + 0.5 - F.hx, (y + 0.5 - F.hy) / 1.05) / F.K; if (d > 0.62 && d < 1.25) { const zot = glas.hsh(r(Math.atan2(y - F.hy, x - F.hx) * 9), 2); P.set(x, y, d > 0.92 - zot * 0.25 ? (A.bay(x, y) < 0.25 + zot * 0.3 ? 'r1' : 4) : (A.bay(x, y) < 0.5 ? 4 : 3)); } }
      for (let i = 0; i < 18; i += 2) { const a = i / 18 * Math.PI * 2; const x = F.hx + Math.cos(a) * (F.K + 1.4), y = F.hy + Math.sin(a) * (F.K + 1.4); if (Math.cos(a) * 0.9 - Math.sin(a) * 0.5 > 0.2) P.auf(x, y, 'r2'); }
      // Schneebrille: Holzsteg quer, zwei Sehschlitze leuchten grün (Licht von unten im Glas)
      const gx = r(F.hx - 1), gy = r(F.hy);
      P.line(gx - 4, gy, gx + 3, gy, 'k2', true);
      if (o.licht > 0 && !(p.tod && f >= 1)) { P.set(gx - 3, gy, 'kern'); P.set(gx - 2, gy, 'glut'); P.set(gx + 1, gy, 'glut'); P.set(gx + 2, gy, 'kern'); P.glow(gx, gy + 0.5, 5 * o.licht, 0.45); augen.push([gx - 3, gy], [gx + 2, gy]); }
      // Besatzband am Saum (Anorak), Naht in der Mitte, Gürtel
      const HS = 56 - v.lang / 2 + o.fall; for (let x = F.cx - 16; x <= F.cx + 16; x++) { P.auf(x, HS - 6 + (x % 2), 'k3'); P.auf(x, HS - 4, 'k0'); }
      P.line(F.cx - 1 + F.lx, F.top + 4, F.cx + 1, HS - 7, 'k0', true);
      
      // Falten im Anorak (Fase: hell rechts, dunkel links), Pelzmanschette an der Hand, Seilrolle an der Hüfte
      for (const [dx, h0] of [[-4, 8], [3, 10], [7, 14]]) { for (let y = F.top + h0; y < HS - 6; y++) { const x = r(F.cx + dx + F.lx * (1 - (y - F.top) / 30) + (y - F.top) * 0.12); P.auf(x, y, 'k0'); P.auf(x + 1, y, (y % 3) ? 'k3' : 2); } }
      P.el(F.hand[0] + 2.5, F.hand[1] - 2.5, 3.2, 2.2, 'k3', true); P.auf(r(F.hand[0] + 3), r(F.hand[1] - 4), 'r1');
      { const sx2 = r(F.cx + F.S - 1), sy2 = r(HS - 12); for (let a = 0; a < 6.28; a += 0.35) { P.auf(sx2 + Math.cos(a) * 3.5, sy2 + Math.sin(a) * 3, a < 1.6 || a > 5.2 ? 'r1' : 'k3'); } P.auf(sx2, sy2, 'k0'); }
      // Kerben auf der Stange (Tiefenmaß)
      for (let k = 1; k < 7; k++) { const x = F.hand[0] + Math.cos(F.wa) * (k * 7 - 14), y = F.hand[1] + Math.sin(F.wa) * (k * 7 - 14); P.auf(x, y, k % 2 ? 'k3' : 'r1'); }
      // Licht von unten: Glas wirft Polarlicht an den Saum
      glas.unterlicht(P, FY - 2, 34, o.licht * 0.9);
      // Spiegelfläche: dünne Glanzlinie unter den Füßen
      for (let x = F.cx - 16; x <= F.cx + 16; x++) { const t = 1 - Math.abs(x - F.cx) / 17; if (t > glas.hsh(x, 5) * 0.8 && !P.get(x, FY)) P.set(x, FY, t > 0.6 ? 'r1' : 'k3'); }
      // Spiegelbild darunter: andere Haltung, gespiegelt, dunkler, nach unten ausdünnend
      if (sp) {
        if (!L) L = require('../lib');
        const pal = L.palette('glasmeer'), G = figur(sp);
        const { buf } = L.render(96, 120, G.grp, pal, { rimBis: FY - 1 });
        const gx2 = r(G.hx - 1), gy2 = r(G.hy);
        // verkürzt (flacher Blickwinkel auf die Glasfläche): 1 Zeile Spiegel = 1/0,45 Zeilen Figur
        const KZ = 0.72, zu = y => FY + 1 + (FY - 1 - y) * KZ;
        for (let ty = FY + 1; ty < 120; ty++) for (let x = 0; x < 96; x++) {
          const y = Math.round(FY - 1 - (ty - FY - 1) / KZ); if (y < 0) continue; const c = buf[y * 96 + x]; if (!c) continue;
          const tief = (ty - FY) / (120 - FY);
          if (P.get(x, ty)) continue;
          P.set(x, ty, c >= 5 ? (tief < 0.4 ? (c === 6 ? 5 : 3) : 2) : Math.max(1, c - 1 - (tief > 0.5 && A.bay(x, ty) < tief - 0.3 ? 1 : 0)));
        }
        // die Stange des Spiegelbilds: hell, damit man sieht, dass es schon zuschlägt
        { const KZ2 = 0.72, m = y => FY + 1 + (FY - 1 - y) * KZ2; const a0 = [G.hand[0] - Math.cos(G.wa) * 14, G.hand[1] - Math.sin(G.wa) * 14], e0 = G.e;
          const n = 40; for (let k = 0; k <= n; k++) { const x = a0[0] + (e0[0] - a0[0]) * k / n, y = a0[1] + (e0[1] - a0[1]) * k / n; if (y > FY) continue; const ty = r(m(y)); if (ty < 120 && ty > FY) P.set(r(x), ty, k % 5 ? 'r1' : 'k3'); } }
        // Augen des Spiegelbilds: es sieht dich zuerst
        { const ty = r(FY + 1 + (FY - 1 - gy2) * 0.72); if (ty < 119) { P.set(gx2 - 3, ty, 'glut'); P.set(gx2 + 2, ty, 'glut'); P.glow(gx2, ty + 0.5, 4, 0.4); } }
        // Randlicht für die Kanten des Spiegelbilds (die Eisdecke spiegelt sich auch im Spiegelbild)
        for (let y = FY + 1; y < 120; y++) for (let x = 0; x < 96; x++) { const c = P.get(x, y); if (!c || c > 4) continue; if (!P.get(x + 1, y) || !P.get(x, y - 1)) P.set(x, y, y < FY + 18 ? 'r1' : 3); }
      }
    };
    return { gruppen: F.grp, details, augen };
  },
};
