// Sickern: eine Hand hängt nass nach unten, das Wasser rinnt von den Fingerspitzen in die Ritzen des Bodens.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, armGruppen } = A;
    const boden = [Pg([[0, 27], [48, 25], [48, 32], [0, 32]], null, { b: 1 })];
    const h = hand({ x: 22, y: 2, a: 1.5, s: 1.35, seite: 1, curl: [0.1, 0.05, 0.1, 0.15], spreiz: 0.1, daumen: 0.2, arm: 8 });
    return { gruppen: [{ p: boden, mat: 'stein', k: 0, tone: -0.1 }, ...armGruppen(h), { p: h.alle(), mat: 'haut', k: 1 }],
      details(P) { for (const [x, y] of h.spitzen) { P.tropfen(x, y + 3); P.tropfen(x + 0.5, y + 7, 'a1', 'a2'); } for (const x of [14, 22, 30]) P.line(x, 26, x + 2, 31, 'akzent1', true); P.line(14, 26, 34, 25, 'a2', true); } };
  },
};
