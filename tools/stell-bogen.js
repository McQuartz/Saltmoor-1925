// Auftrag 3, M2: Kontaktbogen der Stellplätze im Spiel. Je Biom die vier Kampfszenen (kampf 0/1/2, waechter) mit 1, 2 und 3 Gegnern
// (in der Wächter-Szene: Wächter allein, mit 1 und mit 2 Dienern), so wie das Spiel sie zeichnet, samt Plaketten.
// node tools/stell-bogen.js [ordner=docs/auftrag-3/bilder/M2/stell-spiel] [biom,…]   (Server auf BASIS, Standard http://localhost:8000/)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
(async () => {
  const pos = process.argv.slice(2).filter(x => !x.startsWith('--'));
  const out = path.resolve(pos[0] || path.join(__dirname, '../docs/auftrag-3/bilder/M2/stell-spiel')); fs.mkdirSync(out, { recursive: true });
  const BASIS = process.env.BASIS || 'http://localhost:8000/';
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 960, height: 600 } }), fehler = [];
  p.on('pageerror', e => fehler.push(String(e)));
  await p.goto(BASIS + 'index.html?dev=0&job=fischer&seed=3&springe=kampf&akt=0'); await p.waitForTimeout(1500);
  const biome = pos[1] ? pos[1].split(',') : await p.evaluate(() => Object.keys(BIOMES));
  for (const bi of biome) {
    const bilder = [];
    for (const [art, v] of [['kampf', 0], ['kampf', 1], ['kampf', 2], ['waechter', 0]]) for (const n of [1, 2, 3]) {
      await p.evaluate(([bi, art, v, n]) => {
        const ai = RUN.akte.findIndex(a => a.biome.includes(bi)); S.akt = ai; S.route[ai] = bi; S.devSzene = { variante: v, art }; BU.key = '';
        const B = BIOMES[bi]; const g = (B.gegner || []).filter(id => FOES[id]);
        const ids = art === 'waechter' ? [B.waechter, ...g.slice(0, n - 1)] : g.slice(0, n).concat(g).slice(0, n);
        S.kampfArt = art === 'waechter' ? 'waechter' : 'kampf'; S.enemies = ids.filter(id => FOES[id]).map(id => mkEnemy(id)); aufstellen(S.enemies); S.phase = 'fight'; render();
      }, [bi, art, v, n]);
      await p.waitForTimeout(500);
      const el = await p.$('#szene'); bilder.push({ t: `${art}:${v} · ${n}`, d: (await el.screenshot()).toString('base64') });
    }
    const q = await b.newPage({ viewport: { width: 1500, height: 900 } });
    await q.setContent(`<html><body style="margin:0;background:#0b0c0e;color:#e8dcc0;font:12px monospace;padding:8px"><div>${bi}: Stellplätze im Spiel (Zeile = Szene, Spalte = 1, 2, 3 Gegner)</div><div style="display:grid;grid-template-columns:repeat(3,480px);gap:6px">${bilder.map(x => `<div><div>${x.t}</div><img src="data:image/png;base64,${x.d}" width="480"></div>`).join('')}</div></body></html>`);
    const f = path.join(out, bi + '.png'); await q.screenshot({ path: f, fullPage: true }); await q.close(); console.log(path.relative(process.cwd(), f));
  }
  console.log(fehler.length ? fehler.join('\n') : 'Keine Seitenfehler.'); await b.close();
})();
