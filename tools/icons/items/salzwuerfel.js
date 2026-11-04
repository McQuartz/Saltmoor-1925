// Der Würfel aus dem Berg: ein Salzkristall als fast vollkommener Würfel, über Eck gestellt, mit stufigen
// Wachstumskanten; auf der vorderen Fläche ein dunkler Strich wie ein Lid, das sich gerade schließt.
'use strict';
module.exports = {
  form(A) {
    const { Pg } = A;
    const oben = [Pg([[24, 5], [42, 13], [24, 21], [6, 13]], null, { b: 1.4 })];
    const links = [Pg([[6, 13], [24, 21], [24, 44], [6, 35]], null, { b: 1.4 })];
    const rechts = [Pg([[24, 21], [42, 13], [42, 35], [24, 44]], null, { b: 1.4 })];
    return {
      gruppen: [{ p: links, mat: 'papier', k: 0, tone: -0.15 }, { p: rechts, mat: 'papier', k: 0, tone: 0.02 }, { p: oben, mat: 'papier', k: 0, tone: 0.18 }],
      details(P) {
        for (const k of [3, 6]) { P.ritz(24, 5 + k, 42 - k * 1.2, 13, -1); P.ritz(9 + k, 15 + k * 0.5, 9 + k, 34 - k * 0.2, -1); }
        P.line(27, 31, 38, 26, 'kohle0', true); P.line(28, 30, 37, 26, 'kohle1', true); P.set(32, 29, 'a3');
        P.set(39, 15, 'a4'); P.set(23, 7, 'a4');
      },
    };
  },
};
