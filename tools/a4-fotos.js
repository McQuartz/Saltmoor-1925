// Auftrag 4: Bildschirmfotos von Kampf und Bildschirmen in festen Biomen und Auflösungen (Ton aus).
// node tools/a4-fotos.js <ordner> <ansicht,…> [--biom=kapelle,salz] [--aufl=1920x1080,1280x720,900x700] [--seed=3] [--job=fischer] [--n=3] [--hover]
// Ansichten: kampf, kampf5, kampf7, kampf10, waechter, rast, kraemer, werkstatt, fund, ereignis, weg, belohnung, titel
// Server muss laufen: cd prototype && python3 -m http.server 8000
const { chromium } = require('playwright');
const fs = require('fs');
const a = process.argv.slice(2); const opt = k => (a.find(x => x.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const out = a[0] || '.'; const ans = (a[1] || 'kampf').split(',');
const aufl = (opt('aufl') || '1920x1080,1280x720,900x700').split(',').map(s => s.split('x').map(Number));
const biome = (opt('biom') || 'kapelle,salz').split(',');
const seed = opt('seed') || '3', job = opt('job') || 'fischer', n = +(opt('n') || 3);
const BASIS = process.env.BASIS || 'http://localhost:8000/';
const KAMPF = k => ({ s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,${n}).map(id=>mkEnemy(id));aufstellen(S.enemies);${k ? `(()=>{const pool=[...S.hand,...S.draw,...S.discard];while(pool.length<${k})pool.push(...pool.slice(0,${k}-pool.length));S.hand=pool.slice(0,${k});})();` : ''}render();` });
const WEG = {
  kampf: KAMPF(0), kampf5: KAMPF(5), kampf7: KAMPF(7), kampf10: KAMPF(10),
  waechter: { s: 'waechter', akt: 1 },
  rast: { s: 'rast', akt: 1 }, kraemer: { s: 'kraemer', akt: 1 }, werkstatt: { s: 'werkstatt', akt: 1 },
  fund: { s: 'fund', akt: 1 }, ereignis: { s: 'ereignis', akt: 1 }, weg: { s: 'weg', akt: 1 },
  belohnung: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);S.enemies.forEach(e=>{e.hp=0;});checkVictory(10);`, warte: 2500 },
  titel: { titel: true },
};
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const fehler = [];
  for (const v of ans) {
    const w = WEG[v]; if (!w) { console.log('unbekannte Ansicht ' + v); continue; }
    for (const bi of (w.titel ? ['-'] : biome)) for (const [W, H] of aufl) {
      const p = await b.newPage({ viewport: { width: W, height: H } });
      p.on('console', m => { if (m.type() === 'error') fehler.push(v + ': ' + m.text()); }); p.on('pageerror', e => fehler.push(v + ': ' + e));
      await p.goto(w.titel ? `${BASIS}index.html?dev=0` : `${BASIS}index.html?dev=0&job=${job}&seed=${seed}&springe=${w.s}&akt=${w.akt}`);
      await p.waitForTimeout(1200);
      await p.evaluate(() => { try { audioOn = false; } catch (e) { } try { if (typeof Einst !== 'undefined' && Einst.set) { Einst.set('musik', 0); Einst.set('ton', 0); } } catch (e) { } });
      if (!w.titel) { await p.evaluate(`S.route[S.akt]='${bi}';BU.key='';Dev.springe('${w.s}',${w.akt});`); await p.waitForTimeout(600); }
      if (w.nach) { await p.evaluate(w.nach); await p.waitForTimeout(w.warte || 1200); }
      if (a.includes('--hover')) { const k = await p.$$('[data-card]'); if (k[1]) { await k[1].hover(); await p.waitForTimeout(300); } }
      const f = `${out}/${v}${w.titel ? '' : '-' + bi}-${W}x${H}.png`; await p.screenshot({ path: f }); console.log(f); await p.close();
    }
  }
  if (fehler.length) console.log('KONSOLENFEHLER:\n' + [...new Set(fehler)].join('\n'));
  await b.close();
})();
