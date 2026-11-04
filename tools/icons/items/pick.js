// Spitzhacke: gebogener Kopf mit Spitze und Breitseite quer oben, Eschenstiel schräg nach links unten.
'use strict';
module.exports = {
  form(A) {
    const { achse, acap, apg, kurve } = A;
    const ax = achse(8, 44, -0.95);
    const stiel = [acap(ax, 0, 0, 36, 0, 1.9, 2.2)];
    const [hx, hy] = ax.P(34, 0);
    const kopf = [...kurve([[hx - 17, hy + 8], [hx - 8, hy - 4], [hx + 6, hy - 6], [hx + 15, hy + 3]], 1.2, 1.2, null, {}, 14)];
    // dicker in der Mitte, Spitze links, Breitseite rechts
    const mitte = [apg(achse(hx, hy, -0.95), [[-3, -3.2], [4.5, -3.4], [4.5, 3.4], [-3, 3.2]], null, { b: 1.2 })];
    const breit = [apg(achse(hx + 15, hy + 3, 0.95), [[-3, -1.6], [2.5, -2.6], [2.5, 2.6], [-3, 1.6]], null, { b: 0.8 })];
    const k2 = kurve([[hx - 17, hy + 8], [hx - 8, hy - 4], [hx + 6, hy - 6], [hx + 15, hy + 3]], 2.2, 2.2, null, {}, 14).slice(3, 11);
    return {
      gruppen: [{ p: stiel, mat: 'holzhell', k: 0 }, { p: [...kopf, ...k2, ...breit], mat: 'rost', k: 1.2 }, { p: mitte, mat: 'rost', k: 0 }],
      details(P) { const [x, y] = ax.P(30, 0); P.ritz(x - 1, y, x + 1, y - 2, -1); P.set(hx - 17, hy + 8, 'a2'); },
    };
  },
};
