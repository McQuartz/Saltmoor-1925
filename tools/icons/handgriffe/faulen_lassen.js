// Faulen lassen: eine Hand liegt reglos mit der Fläche nach oben im Moos, die Finger halb offen; aus dem Handgelenk
// wachsen zwei Pilze mit hellen Hüten, grüner Schimmel kriecht über den Ballen. Das Moor ist geduldiger als jede Wunde.
'use strict';
module.exports = {
  w: 48, h: 32,
  form(A) {
    const { hand, Pg, E, C } = A;
    const moos = [Pg([[0, 27], [48, 25], [48, 32], [0, 32]], null, { b: 1.2 })];
    const h = hand({ x: 12, y: 25, a: -0.08, s: 1.5, seite: 1, curl: [0.3, 0.35, 0.4, 0.5], spreiz: 0.06, daumen: 0.3, arm: 12 });
    const pilze = [C(8, 23, 7, 13, 1, 0.9), E(7, 12, 4.4, 2.2, null, { pf: 'bevel', hz: 0.5 }), C(13, 22, 15, 16, 0.9, 0.8), E(15.5, 15, 3.2, 1.7, null, { pf: 'bevel', hz: 0.5 })];
    return { gruppen: [{ p: moos, mat: 'gruenstoff', k: 0 }, { p: [...h.arm, ...h.alle()], mat: 'haut', k: 1, tone: -0.08 }, { p: pilze, mat: 'knochen', k: 0, tone: 0.1 }],
      details(P) { for (const [x, y] of [[16, 23], [18, 22], [20, 23], [17, 24], [22, 22], [27, 24]]) P.auf(x, y, 'akzent2'); P.set(6, 11, 'a3'); P.set(15, 14, 'a2'); } };
  },
};
