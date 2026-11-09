// Die Pfarrerin. Aufrecht, schmale Schultern, langer Talar mit schwingendem Saum, natürlicher Kopf.
// Die Familienbibel ragt links aus dem Körper, der Rosenkranz hängt rechts von der Hand und steht ebenfalls frei.
// Varianten: a = Haar streng zurück mit Knoten über dem Nacken, aufgeschlagene Bibel;
//            b = Kopftuch mit Zipfel auf den Schultern, geschlossene Bibel schräg an die Brust gelegt.
'use strict';
module.exports = {
  id: 'pfarrerin', w: 110, h: 172, fuss: [56, 168], rimBis: 172,
  koerper: { hals: [56, 58], leib: [57, 96], hand: [26, 90] },
  v: { var: 'a' },
  bild(p, v, A) {
    const { E, C, Pg } = A;
    const b = v.var === 'b';
    const cx = 56;
    const kopf = Pg([[cx - 8, 34], [cx, 30], [cx + 8, 34], [cx + 9, 43], [cx + 6, 51], [cx, 55], [cx - 6, 51], [cx - 9, 43]], null, { rd: 2 });
    const haar = Pg([[cx - 10, 45], [cx - 10, 35], [cx - 5, 29], [cx + 3, 28], [cx + 9, 32], [cx + 11, 40], [cx + 9, 46], [cx + 7, 38], [cx - 7, 37]], null, { rd: 1 });
    const knoten = [E(cx + 11, 27, 5.5, 5, null), C(cx + 6, 31, cx + 11, 28, 2, 3, null)];
    const tuch = Pg([[cx - 11, 46], [cx - 11, 34], [cx - 6, 27], [cx + 4, 26], [cx + 11, 31], [cx + 14, 46], [cx + 16, 62], [cx + 10, 68], [cx, 62], [cx - 10, 68], [cx - 15, 60]], null, { rd: 1.5 });
    const hals = C(cx, 50, cx, 60, 4.5, 6.5, null);
    const talar = Pg([[cx - 8, 58], [cx + 8, 58], [cx + 17, 64], [cx + 19, 78], [cx + 15, 96], [cx + 18, 116], [cx + 27, 144], [cx + 35, 167], [cx + 20, 165], [cx + 7, 169], [cx - 8, 166], [cx - 22, 169], [cx - 33, 166], [cx - 25, 142], [cx - 18, 114], [cx - 15, 96], [cx - 19, 78], [cx - 17, 64]], null, { rd: 2 });
    const armL = b ? A.glied([[cx - 16, 66], [cx - 24, 82], [cx - 22, 94]], 4.5, 3.8, null) : A.glied([[cx - 16, 66], [cx - 25, 80], [cx - 30, 88]], 4.5, 3.8, null);
    const armR = A.glied([[cx + 16, 66], [cx + 22, 86], [cx + 26, 104]], 4.5, 3.8, null);
    const buch = b
      ? [Pg([[20, 86], [36, 76], [44, 92], [28, 102]], null, { rd: 0.8 })]
      : [Pg([[10, 74], [26, 80], [27, 99], [12, 93]], null, { rd: 0.8 }), Pg([[27, 80], [43, 73], [45, 91], [28, 99]], null, { rd: 0.8 })];
    const hand = E(b ? 30 : 27, b ? 98 : 96, 4.5, 3.5, null);
    // Rosenkranz: Schnur mit Perlen, Kreuz am Ende, frei neben dem Talar
    const perlen = [];
    for (let k = 0; k < 7; k++) perlen.push(E(cx + 27 + Math.sin(k * 0.6) * 2, 108 + k * 4, 1.8, 1.8, null));
    const kreuz = [C(cx + 28, 135, cx + 28, 147, 1.3, 1.3, null), C(cx + 24, 139, cx + 32, 139, 1.3, 1.3, null)];
    const schnur = C(cx + 26, 104, cx + 28, 134, 0.8, 0.8, null);
    const gruppen = [
      { p: [talar, hals], k: 4, pf: 'bevel', tone: -0.05 },
      { p: [armR], k: 2, tone: -0.05 },
      { p: [...perlen, ...kreuz, schnur], k: 0.5, pf: 'bevel' },
      b ? { p: [tuch], k: 1, pf: 'bevel' } : { p: [kopf], k: 2 },
      ...(b ? [{ p: [kopf], k: 2, noRim: true }] : [{ p: [haar, ...knoten], k: 1, pf: 'bevel' }]),
      { p: armL, k: 2 },
      { p: buch, k: 0.5, pf: 'bevel', tone: -0.1 },
      { p: [hand], k: 0 },
    ];
    const augen = [];
    const details = P => {
      // Buchrücken und Mittelfalz als dunkle Linie
      if (b) P.line(24, 90, 41, 82, 'k0', true); else P.line(27, 80, 28, 98, 'k0', true);
      P.set(cx - 4, 43, 'kern'); P.set(cx - 3, 43, 'glut'); P.set(cx + 3, 43, 'kern'); P.set(cx + 4, 43, 'glut');
      augen.push([cx - 4, 43], [cx + 3, 43]);
      P.line(cx, 62, cx, 120, 'k0', true);
    };
    return { gruppen, details, augen };
  },
};
