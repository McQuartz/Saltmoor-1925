// Der Gesehene des fünften Akts (kein Biom): der Hohe am Rand.
// Etwas Hohes, Dünnes aus übereinanderstehenden Gliedern, zu groß für den Raum: eine geschlossene Säule, die nach oben
// schmaler wird, sich oben nach links beugt und in eine hängende, glatte Haube mündet; an deren Unterseite sitzen drei Augen.
// Unten läuft die Säule in drei Fäden aus und berührt den Boden nie. Vier lange, klar geschwungene Fühlfäden.
// Der Körper ist geschlossen: die Durchsichtigkeit und das Schweben macht die Bühne (buehne.js) zur Laufzeit.
// Zwei Silhouetten wurden gebaut: 'A' (Säule, die sich im Bogen über den Spieler beugt) und 'B' (steile S-Kurve ohne Bogen).
// A trägt "beugt sich langsam über einen" klarer; gebaut wird A.
'use strict';
const FORMEN = {
  A: { pts: [[60, 110], [60, 96], [59, 80], [57, 64], [54, 50], [49, 38], [42, 28], [34, 21], [28, 19]], haube: [-2, 10] },
  B: { pts: [[58, 110], [62, 96], [63, 80], [58, 64], [50, 50], [46, 36], [48, 22], [52, 12], [48, 8]], haube: [-8, 10] },
};
// Halbbreite der Säule entlang der Länge (0 unten .. 1 oben): Spindel, in der Mitte am dicksten
const PROFIL = [[0, 2], [0.12, 6.5], [0.28, 10], [0.5, 8.8], [0.75, 5.6], [1, 3.6]];
const prof = t => { for (let i = 1; i < PROFIL.length; i++) if (t <= PROFIL[i][0]) { const [a, ra] = PROFIL[i - 1], [b, rb] = PROFIL[i]; return ra + (rb - ra) * (t - a) / (b - a); } return PROFIL[PROFIL.length - 1][1]; };

module.exports = {
  id: 'gesehener_letzt', biom: null, zone: 'blick-letzt', w: 96, h: 120, fuss: [60, 115], kopf: [26, 29], rimBis: 112,
  varianten: {
    gesehener_letzt: { form: 'A' },
  },
  bild(p, v, A) {
    const { Pg, chain, r } = A;
    const F = FORMEN[v.form || 'A'], f = p.f;
    // bx/by: Verschiebung des Kopfendes (wirkt quadratisch nach unten), fa: Fühlerwinkel, K: Stauchung beim Tod
    let dyAll = 0, bx = 0, by = 0, fa = 0, wig = 0.2, ph = 0, K = 1, sink = 0, aus = [false, false, false];
    if (p.idle) { dyAll = [0, -1, -1, 0][f]; ph = f * Math.PI / 2; aus = [false, false, f === 2]; }
    if (p.angriff) { bx = [2, -4, -13, -5][f]; by = [-1, 3, 14, 5][f]; fa = [0, 0.25, 0.9, 0.4][f]; wig = [0.2, 0.3, 0.12, 0.3][f]; ph = f * 1.3; }
    if (p.treffer) { bx = [5, 2][f]; by = [-4, -1][f]; fa = [-0.35, -0.15][f]; wig = 0.5; ph = f * 2; }
    if (p.tod) { K = 1 - 0.6 * p.q; sink = r(p.q * 14); bx = r(p.q * 6); by = r(p.q * 6); wig = 0.2 * (1 - p.q); ph = f * 0.8; fa = -0.1 * p.q; aus = f >= 1 ? [true, true, true] : [false, false, true]; }
    // Mittellinie fein unterteilt (alle ~6 px), mit Bewegung
    const base = F.pts[0][1];
    const dicht = []; let len = 0; const seg = [];
    for (let i = 1; i < F.pts.length; i++) { const l = Math.hypot(F.pts[i][0] - F.pts[i - 1][0], F.pts[i][1] - F.pts[i - 1][1]); seg.push(l); len += l; }
    let acc = 0;
    for (let i = 1; i < F.pts.length; i++) {
      const n = Math.max(1, Math.round(seg[i - 1] / 6));
      for (let k = (i === 1 ? 0 : 1); k <= n; k++) { const q = k / n, a = F.pts[i - 1], b = F.pts[i]; dicht.push({ x: a[0] + (b[0] - a[0]) * q, y: a[1] + (b[1] - a[1]) * q, t: (acc + seg[i - 1] * q) / len }); }
      acc += seg[i - 1];
    }
    const N = dicht.length;
    const M = dicht.map(d => { const w = Math.pow(d.t, 2.2); let y = d.y + by * w; y = base + (y - base) * K + sink; return { x: d.x + bx * w, y, t: d.t }; });
    // Säule: Kapseln zwischen den Punkten; abwechselnd dickere und dünnere Glieder (Ringe), alles zusammenhängend
    const saeule = [];
    for (let i = 0; i < N - 1; i++) {
      const ring = i % 2 ? 1.1 : 0.86;
      const r0 = prof(M[i].t) * ring * (p.tod ? 1 - 0.15 * p.q : 1), r1 = prof(M[i + 1].t) * (i % 2 ? 0.86 : 1.1) * (p.tod ? 1 - 0.15 * p.q : 1);
      saeule.push(C(M[i].x, M[i].y, M[i + 1].x, M[i + 1].y, Math.max(1.5, r0), Math.max(1.5, r1), null, { pf: 'bevel' }));
    }
    function C(x1, y1, x2, y2, r1, r2, m, o) { return A.C(x1, y1, x2, y2, r1, r2, m, o); }
    // Haube: hängende, glatte Glocke am Bogenende; die Augen sitzen an der Unterseite
    const end = M[N - 1], hx = end.x + F.haube[0], hy = end.y + F.haube[1];
    const haube = Pg([[hx - 10, hy - 9], [hx + 4, hy - 13], [hx + 12, hy - 4], [hx + 12, hy + 6], [hx + 6, hy + 18], [hx - 6, hy + 19], [hx - 12, hy + 6]], 'haut', { rd: 5, pf: 'dome', tone: 0.35 });
    const hals = C(M[N - 2].x, M[N - 2].y, hx + 6, hy - 6, 4.5, 6, null);
    // Vier lange Fühlfäden: zwei aus der Haube (hängen nach links unten), zwei aus der Säule (schwingen nach rechts, dann nach unten)
    const faeden = [];
    const faden = (x, y, a0, n, len2, r0, r1, kurv, ph0) => {
      const c = chain(x, y, a0 + fa, n, len2, r0, r1, null, (q, i) => kurv + (p.idle ? (q > 0.7 ? Math.sin(ph + ph0) * 0.07 : 0) : Math.sin(ph + ph0 + i * 0.85) * wig * (0.4 + q)));
      faeden.push(...c);
    };
    faden(hx - 8, hy + 14, 1.95, 8, 5.2, 1.5, 0.7, -0.07, 0.4);
    faden(hx + 3, hy + 16, 1.45, 8, 5.4, 1.5, 0.7, 0.05, 2.0);
    const sA = M[Math.round(N * 0.45)], sB = M[Math.round(N * 0.3)];
    faden(sA.x + 9, sA.y, 0.15, 8, 5.2, 1.5, 0.7, 0.12, 1.1);
    faden(sB.x + 11, sB.y + 4, 0.35, 8, 5.4, 1.5, 0.7, 0.1, 3.1);
    // Fuß: die Säule läuft in drei Fäden aus, die über dem Boden enden
    const fuss = [];
    [[-3, 1.75, 0.2], [0, 1.57, 1.7], [3, 1.4, 3.3]].forEach(([dx, a, ph0]) => {
      fuss.push(...chain(M[0].x + dx, M[0].y + 1, a, 3, 3.3, 1.3, 0.6, null, () => 0));
    });
    const gruppen = [
      { p: faeden, k: 0, pf: 'flat' },
      { p: [...saeule, hals], k: 2.2 },
      { p: [haube], k: 0, pf: 'dome' },
      { p: fuss, k: 0, pf: 'flat' },
    ];
    const augen = [];
    const ax0 = r(hx), ay0 = r(hy);
    const details = P => {
      // Ringe: dunkle Rillen quer über die Säule, einmal je Glied (nur auf vorhandenem Körper)
      for (let i = 1; i < N - 2; i += 2) {
        const a = M[i - 1], b = M[i + 1]; let tx = b.x - a.x, ty = b.y - a.y; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        const rr = prof(M[i].t) * 1.0;
        for (let s = -rr; s <= rr; s++) P.auf(M[i].x + (-ty) * s, M[i].y + tx * s, 'k1');
      }
      const e = (x, y, g, an) => { if (an) { P.auge(x, y, g); augen.push([r(x), r(y)]); } else P.auf(x, y, 'k0'); };
      e(ax0 - 5, ay0 + 11, 3, !aus[0]);
      e(ax0 + 3, ay0 + 14, 3, !aus[1]);
      e(ax0 + 8, ay0 + 9, 2, !aus[2]);
    };
    return { gruppen, details, augen, dy: dyAll };
  },
};
