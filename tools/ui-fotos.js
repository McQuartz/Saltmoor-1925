// Auftrag 3: Bildschirmfotos einer Ansicht in festen Auflösungen mit festem Seed.
// node tools/ui-fotos.js <ordner> <ansicht,…|alle> [--aufl=1280x720,1440x900,1920x1080] [--seed=3] [--job=fischer] [--url=zusatz]
// Ansichten: kampf, kampf2, kampf3, waechter, nachzug, weg, karte, biomwahl, rucksack, belohnung, wandbild, kraemer, werkstatt, rast
// Server muss laufen: cd prototype && python3 -m http.server 8000
const { chromium } = require('playwright');
const fs = require('fs');
const a = process.argv.slice(2); const opt = k => (a.find(x => x.startsWith('--' + k + '=')) || '').split('=').slice(1).join('=');
const out = a[0] || '.'; const ans = (a[1] || 'kampf').split(',');
const aufl = (opt('aufl') || '1280x720,1440x900,1920x1080').split(',').map(s => s.split('x').map(Number));
const seed = opt('seed') || '3', job = opt('job') || 'fischer', zusatz = opt('url') || '';
const BASIS = process.env.BASIS || 'http://localhost:8000/';
const ALLE = ['kampf', 'kampf2', 'kampf3', 'waechter', 'nachzug', 'weg', 'biomwahl', 'rucksack', 'belohnung', 'wandbild', 'kraemer', 'werkstatt', 'rast'];
// Wie man zu jeder Ansicht kommt: Adresse und danach ein Schritt im Spiel
const WEG = {
  kampf: { s: 'kampf', akt: 1, nach: `S.enemies=[mkEnemy(biom().gegner[0])];aufstellen(S.enemies);render();` },
  kampf2: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);render();` },
  kampf3: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,3).map(id=>mkEnemy(id));aufstellen(S.enemies);render();` },
  waechter: { s: 'waechter', akt: 1 },
  nachzug: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);render();endTurn();`, warte: 5000 },
  weg: { s: 'weg', akt: 1 },
  karte: { s: 'weg', akt: 1 },
  biomwahl: { s: null, nach: `S.akt=1;S.route[1]=null;enterAct();render();` },
  rucksack: { s: 'rast', akt: 1, nach: `if(typeof rucksackAuf==='function')rucksackAuf();` },
  belohnung: { s: 'kampf', akt: 1, nach: `S.enemies.forEach(e=>{e.hp=0;});checkVictory(10);`, warte: 2500 },
  wandbild: { s: 'wandbild', akt: 1 },
  kraemer: { s: 'kraemer', akt: 1 },
  werkstatt: { s: 'werkstatt', akt: 1 },
  rast: { s: 'rast', akt: 1 },
};
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const fehler = [];
  for (const v of (ans[0] === 'alle' ? ALLE : ans)) {
    const w = WEG[v]; if (!w) { console.log('unbekannte Ansicht ' + v); continue; }
    for (const [W, H] of aufl) {
      const p = await b.newPage({ viewport: { width: W, height: H } });
      p.on('console', m => { if (m.type() === 'error') fehler.push(v + ': ' + m.text()); }); p.on('pageerror', e => fehler.push(v + ': ' + e));
      await p.goto(`${BASIS}index.html?dev=0&job=${job}&seed=${seed}${w.s ? '&springe=' + w.s : ''}${w.akt != null ? '&akt=' + w.akt : ''}${zusatz}`);
      await p.waitForTimeout(1500);
      if (w.nach) { await p.evaluate(w.nach); await p.waitForTimeout(w.warte || 1200); }
      const f = `${out}/${v}-${W}x${H}.png`; await p.screenshot({ path: f }); console.log(f); await p.close();
    }
  }
  if (fehler.length) console.log('KONSOLENFEHLER:\n' + fehler.join('\n'));
  await b.close();
})();
