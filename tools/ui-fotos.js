// Auftrag 3: Bildschirmfotos einer Ansicht in festen Auflösungen mit festem Seed.
// node tools/ui-fotos.js <ordner> <ansicht,…|alle> [--aufl=1280x720,1440x900,1920x1080] [--seed=3] [--job=fischer] [--url=zusatz] [--dom]  (--dom schreibt zusätzlich das HTML von #spiel, für den Vergleich vor/nach einem Umbau)
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
  belohnung: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);S.enemies.forEach(e=>{e.hp=0;});checkVictory(10);`, warte: 2500 },
  wandbild: { s: 'wandbild', akt: 1 },
  kraemer: { s: 'kraemer', akt: 1 },
  werkstatt: { s: 'werkstatt', akt: 1 },
  rast: { s: 'rast', akt: 1 },
  // M1 (Welle 1)
  wandbild_fabrik: { s: 'wandbild', akt: 1, nach: `S.frag='fabrik_2';render();if(typeof reliefMalen==='function')reliefMalen();` },
  wandbild_waage: { s: 'wandbild', akt: 1, nach: `S.frag='waage_3';render();if(typeof reliefMalen==='function')reliefMalen();` },
  wandbild_leuchtturm: { s: 'wandbild', akt: 1, nach: `S.frag='leuchtturm_1';render();if(typeof reliefMalen==='function')reliefMalen();` },
  gegnerzug: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);render();Bus.on('gegnerzug_ende',()=>{FAST=false;window.__halt=1;});window.wait=(ms,f)=>{if(window.__halt)return;setTimeout(f,ms);};S.hand=[];endTurn();`, warte: 6000 },
  geschwaecht: { s: 'kampf', akt: 1, nach: `const e=S.enemies[0];e.pi=Math.max(0,e.pat.findIndex(x=>x.t==='atk'));e.weak2=1;S.block=0;render();` },
  schraffur: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);S.enemies.forEach(e=>{e.pi=Math.max(0,e.pat.findIndex(x=>x.t==='atk'));});S.block=4;render();` },
  verstaerkt: { s: 'kampf', akt: 1, nach: `S.last=['W'];S.disc.add('Verstärkt');S.hand.unshift({n:'Tiefe Lotung',c:1,st:['W'],draw:2,spr:'rope'});render();` },
  panzer: { s: 'waechter', akt: 1, nach: `S.enemies=[mkEnemy('heimleiterin')];aufstellen(S.enemies);const b=S.enemies[0];b.pi=b.pat.findIndex(p=>p.unverw);panzerZugbeginn();render();` },
  // M2 (HUD)
  sackgasse: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);S.last=['F'];S.chainLog=[{turn:S.turn,st:['F'],prev:[],rx:[]}];S.energy=0;S.hand=S.hand.filter(c=>cardCost(c)>0);render();` },
  hochreaktion: { s: 'kampf', akt: 1, nach: `S.enemies=biom().gegner.slice(0,2).map(id=>mkEnemy(id));aufstellen(S.enemies);S.last=['F','G'];S.chainLog=[{turn:S.turn,st:['F','G'],prev:[],rx:[]}];const c=[...S.hand,...S.draw,...S.discard].find(c=>c.st.includes('S'));if(c&&!S.hand.includes(c))S.hand.unshift(c);S.energy=3;render();` },
  schutz: { s: 'waechter', akt: 1, nach: `S.enemies=[mkEnemy('heimleiterin'),mkEnemy('zwillinge')];aufstellen(S.enemies);const b=S.enemies[0];b.pi=b.pat.findIndex(p=>p.unverw);panzerZugbeginn();render();` },
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
      const f = `${out}/${v}-${W}x${H}.png`; await p.screenshot({ path: f });
      if (a.includes('--dom')) fs.writeFileSync(f.replace(/\.png$/, '.html'), await p.evaluate(() => document.getElementById('spiel').innerHTML.replace(/ style="[^"]*animation-delay[^"]*"/g, ''))); console.log(f); await p.close();
    }
  }
  if (fehler.length) console.log('KONSOLENFEHLER:\n' + fehler.join('\n'));
  await b.close();
})();
