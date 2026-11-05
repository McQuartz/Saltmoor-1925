// Das aschgraue Licht (Reliquie): eine dunkle Mondscheibe, nur eine haarfeine Sichel ist hell, in der Farbe des
// Stoffs. Der Rest liegt im aschgrauen Licht, gerade noch zu sehen, und darin ist ein Krater offen wie ein Auge.
'use strict';
module.exports = {
  form(A) {
    const { E, ring } = A;
    const scheibe = [E(24, 24, 18, 18, null, { pf: 'bevel', hz: 0.35 })];
    const sichel = ring(24, 24, 17.2, 17.2, 1.6, null, {}, 18, -1.25, 1.15);
    return {
      gruppen: [{ p: scheibe, mat: 'stein', k: 0, tone: -0.35 }, { p: sichel, mat: 'akzent', k: 0 }],
      details(P) {
        for (const [x, y, r] of [[16, 20, 2.4], [24, 33, 2], [29, 14, 1.4], [13, 30, 1.3]]) { P.el(x, y, r, r, 'stein0', true); P.auf(x - r * 0.7, y + r * 0.7, 'stein2'); }
        // das offene Auge
        P.el(21, 25, 4.2, 2.2, 'stein0', true); P.el(20.5, 25, 1.8, 1.6, 'a1', true); P.set(20, 25, 'a5'); P.set(21, 25, 'a4'); P.set(20, 24, 'a3'); P.set(19, 25, 'a3'); P.glow(20.5, 25, 7, 0.7);
        P.line(17, 23, 25, 22.5, 'stein2', true); P.line(17, 27.5, 25, 27.5, 'stein2', true);
        // Erdschein: der linke Rand glimmt grau
        for (let i = 0; i < 24; i++) { const a = Math.PI * 0.6 + i / 24 * Math.PI * 0.8; P.auf(24 + Math.cos(a) * 17, 24 + Math.sin(a) * 17, i % 3 ? 'stein2' : 'stein3'); }
      },
    };
  },
};
