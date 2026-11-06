// Schlüsselbund der Nachtschwester: ein schwerer Eisenring, daran viele Schlüssel nach unten hängend, dunkel
// vom Wasser; einer ist neu, aus blankem Messing, und hängt als letzter.
'use strict';
module.exports = {
  form(A) {
    const { E, C, Pg } = A;
    const cx = 24, cy = 18, R = 13;
    const ring = [A.ring(cx, cy, R, R * 0.92, 1.7, null, {}, 20)];
    const keys = [], neu = [];
    const winkel = [0.2, 0.75, 1.3, 1.85, 2.4, 2.95, -0.35, -2.7];
    winkel.forEach((a, i) => {
      const x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.92, l = 11 + (i % 3) * 2, ex = x + (i % 2 ? 1 : -1), ey = Math.min(46, y + l);
      const part = [C(x, y + 1, ex, ey, 0.9, 0.9, null), E(x, y + 1, 1.8, 1.8, null), Pg([[ex, ey - 3.5], [ex + 3.4, ey - 3.5], [ex + 3.4, ey - 1.6], [ex + 2, ey - 1.6], [ex + 2, ey + 0.8], [ex, ey + 0.8]], null, { b: 0.8 })];
      (i === 3 ? neu : keys).push(...part);
    });
    return {
      gruppen: [{ p: keys, mat: 'eisen', k: 0 }, { p: ring, mat: 'eisen', k: 0.5, tone: 0.1 }, { p: neu, mat: 'messing', k: 0, tone: 0.2 }],
      details(P) {
        for (const [x, y] of [[13, 30], [33, 40], [21, 44]]) { P.set(x, y, 'a2'); P.set(x, y + 2, 'a1'); }
        P.stufe(cx + R - 2, cy - 7, +1); P.stufe(cx + R - 1, cy - 5, +1);
      },
    };
  },
};
