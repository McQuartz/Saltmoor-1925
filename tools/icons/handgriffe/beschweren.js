// Beschweren: eine große Hand kommt von rechts und hält einen runden Feldstein unter der Handfläche, gleich
// legt sie ihn auf den kleinen Haufen anderer Steine darunter. Am Haufen klebt Salz.
// Steine in die Taschen, damit der Wind dich nicht mitnimmt.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, E, armGruppen } = A;
    const h = hand({ x: 47, y: 9, a: 3.05, s: 1.7, seite: 1, curl: [0.55, 0.6, 0.6, 0.65], spreiz: 0.06, daumen: 0.35, daumenWinkel: 1.1, arm: 3 });
    const stein = [E(31, 17, 6.2, 4.6, null, { pf: 'dome' })];
    const haufen = [E(8, 28.5, 6, 3.4, null, { pf: 'dome' }), E(18, 29, 5.5, 3, null, { pf: 'dome' }), E(12.5, 24.5, 5, 3, null, { pf: 'dome' })];
    return { gruppen: [{ p: haufen, mat: 'stein', k: 0, tone: 0.16 }, ...armGruppen(h, 'wolle'), { p: h.alle(), mat: 'haut', k: 1 }, { p: stein, mat: 'stein', k: 0, tone: 0.4 }],
      details(P) {
        for (const [x, y] of [[6, 26], [10, 27], [14, 22], [19, 27], [12, 23], [16, 26]]) P.set(x, y, (x + y) % 2 ? 'aH' : 'aG');
        for (const [x, y] of [[9, 30], [18, 30], [5, 29]]) P.stufe(x, y, -1);
      },
    };
  },
};
