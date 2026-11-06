// Die Zollplombe: ein Bleisiegel, rund und flachgedrückt, auf einem verdrillten Draht, der zur Schlaufe gebogen ist.
// Im Blei ist ein Auge geprägt; die Prägung fängt das Licht in der Farbe des Stoffs.
'use strict';
module.exports = {
  form(A) {
    const { E, C, kurve } = A;
    const draht = [...kurve([[24, 30], [14, 22], [12, 10], [20, 4], [30, 6], [34, 16], [28, 26]], 1.1, 1.1, null, {}, 14), C(26, 32, 22, 44, 1, 0.8), C(29, 32, 33, 45, 1, 0.8)];
    const blei = [E(27, 31, 10, 9, null, { pf: 'bevel', hz: 0.4 })];
    return {
      gruppen: [{ p: draht, mat: 'stahl', k: 0, tone: -0.05 }, { p: blei, mat: 'stein', k: 0, tone: 0.05 }],
      details(P) {
        // Drall des Drahts: helle und dunkle Punkte im Wechsel
        for (let i = 0; i < 14; i++) { const t = i / 14 * Math.PI * 1.7 + 0.6; P.auf(23 + Math.cos(t) * 10, 15 + Math.sin(t) * 10, i % 2 ? 'stahl0' : 'stahl3'); }
        // Prägung: Auge mit Lid, Pupille im Stoff-Ton
        P.el(27, 31, 5.4, 2.6, 'stein0', true); P.el(27, 31, 2.2, 2, 'a1', true); P.set(27, 31, 'a5'); P.set(28, 31, 'a4'); P.set(26, 30, 'a3');
        P.line(22, 28.5, 32, 28.5, 'stein3', true); P.line(22, 33.5, 32, 33.5, 'stein1', true);
        // Zangenbiss am Rand
        for (const [x, y] of [[18, 29], [18, 32], [36, 29], [36, 32]]) P.stufe(x, y, -1);
      },
    };
  },
};
