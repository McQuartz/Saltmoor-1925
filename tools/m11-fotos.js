// Auftrag 3 M11: Bildschirmfotos der Würze (Zeitungsausschnitt, Vermisstenanzeige, falscher Brief mit Karte und Knoten, Barmherzige Trennung, Zanns Takt, Dev-Reiter).
// node tools/m11-fotos.js [ziel=docs/auftrag-3/bilder/M11]   (startet selbst einen Server aus prototype/)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), { spawn } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800);
const URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/M11'; require('fs').mkdirSync(out, { recursive: true });
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  const foto = async (n, warte = 700) => { await p.waitForTimeout(warte); await p.screenshot({ path: `${out}/${n}.png` }); };
  await p.goto(`${URL}?dev=0`); await p.waitForTimeout(900);
  const neu = (z, seed = 7, job = 'fischer') => p.evaluate(([z, seed, job]) => { Meta.reset(); Meta.allesFrei(); newRun(job, seed, { route: ['hafen'] }); if (S.phase === 'erbe') Metaebene.erbeWahl(false); S.zettel.wuerze = z; BU.key = ''; render(); }, [z, seed, job]);
  // 1 Zeitungsausschnitt im Übergang; 2 Vermisstenanzeige (ab dem 10. Run)
  await neu(['zeitung']); await p.evaluate(() => { WUERZE.zeitung_chance = 1; S.akt = 1; S.route[1] = 'kapelle'; enterAct(); BU.key = ''; render(); }); await foto('01-zeitung-uebergang', 1000);
  await neu(['zeitung'], 4, 'pfarrerin'); await p.evaluate(() => { Meta.get().runs = 12; for (let s = 1; s < 80; s++) { newRun('pfarrerin', s, { route: ['hafen', 'kapelle'] }); if (S.phase === 'erbe') Metaebene.erbeWahl(false); S.zettel.wuerze = ['zeitung']; S.akt = 1; enterAct(); if (S.zeitung && S.zeitung.vermisst) break; } BU.key = ''; render(); }); await foto('02-vermisstenanzeige', 1000);
  // 3 Der falsche Brief als Ereignis; 4 Biomwahl mit dem versprochenen Biom; 5 Brief auf der Peilkarte; 6 Knoten mit dem Vorgänger
  await neu(['brief'], 5); await p.evaluate(() => { leaveUebergang(); S.phase = 'weg'; enterNode({ art: 'ereignis' }); BU.key = ''; render(); }); await foto('03-brief-ereignis', 1000);
  await p.evaluate(() => { chooseEvent(0); const b = S.brief; S.akt = b.akt; S.route[b.akt] = null; for (let a = 1; a < b.akt; a++) S.route[a] = RUN.akte[a].biome.find(x => BIOMES[x]); enterAct(); BU.key = ''; render(); }); await foto('04-brief-biomwahl', 1000);
  await p.evaluate(() => { const b = S.brief; if (S.phase === 'biomwahl') chooseBiom(S.angebote[S.akt].indexOf(b.ziel)); leaveUebergang(); S.netz.klar = true; BU.key = ''; render(); }); await foto('05-brief-peilkarte', 1000);
  await p.evaluate(() => { Meta.get().vorgaenger = { job: 'veteran', items: ['rosary', 'lantern'], tiefe: 14, biom: 'salz', max: 40 }; let k; S.netz.ebenen.forEach((l, e) => l.forEach((v, i) => { if (v.brief) k = [e, i, v.art]; })); enterNode({ art: k[2], ziel: [k[0], k[1]] }); BU.key = ''; render(); }); await foto('06-brief-knoten-vorgaenger', 1000);
  // 7 Teil an der Fundstelle; 8 zwei Teile in der Hand; 9 Wahl nach dem Sieg; 10 der Handgriff in fremder Fassung
  await neu(['trennung'], 9); await p.evaluate(() => { leaveUebergang(); S.phase = 'weg'; enterNode({ art: 'fundstelle' }); BU.key = ''; render(); }); await foto('07-trennung-fundstelle', 900);
  await p.evaluate(() => { Wuerze.teilFinden(); Wuerze.teilFinden(); const g = biom().gegner.filter(k => (FOES[k].rang || 'normal') === 'normal').slice(0, 2); startFight(g, 'kampf'); S.blickWahl = null; const t = deckListe().filter(c => c.trennung); S.hand = [...t, ...S.hand.filter(c => !c.trennung)].slice(0, 5); BU.key = ''; render(); }); await foto('08-trennung-teile-in-der-hand', 1100);
  await p.evaluate(() => { playCard(0, 0); playCard(0, 0); S.enemies.forEach(e => e.hp = 0); fightWon(); BU.key = ''; render(); }); await foto('09-trennung-wahl', 1000);
  await p.evaluate(() => { const x = Wuerze.handgriffe()[0]; Wuerze.trennen(x.it.uid, x.k); leaveReward(); const g = biom().gegner.filter(k => (FOES[k].rang || 'normal') === 'normal').slice(0, 1); startFight(g, 'kampf'); S.blickWahl = null; const fr = deckListe().filter(c => c.fremd); S.hand = [...fr, ...S.hand.filter(c => !c.fremd)].slice(0, 5); BU.key = ''; render(); }); await foto('10-trennung-fremde-fassung', 1100);
  // 11 Geige im Fund; 12 Kampf gegen die Ungetaufte mit der Geige; 13 ausgesetzt: das Fenster offen, stärkster Schritt
  await neu(['zann'], 11); await p.evaluate(() => { S.akt = 1; S.route[1] = 'glockengiesserei'; enterAct(); leaveUebergang(); const g = biom().gegner.filter(k => (FOES[k].rang || 'normal') === 'normal').slice(0, 1); startFight(g, 'kampf'); S.blickWahl = null; S.enemies.forEach(e => e.hp = 0); fightWon(); BU.key = ''; render(); }); await foto('11-zann-geige-als-beute', 1000);
  await p.evaluate(() => { takeReward('zanns_geige'); const b = S.bag.findIndex(x => x && x.id === 'zanns_geige'); move('bag:' + b, 'talisman:0'); leaveReward(); if (KOE) rucksackZu(); startFight(['ungetaufte'], 'waechter'); S.blickWahl = null; const g = deckListe().filter(c => c.src === ITEMS.zanns_geige.n); S.hand = [...g, ...S.hand].slice(0, 5); BU.key = ''; render(); }); await foto('12-zann-kampf-mit-geige', 1200);
  await p.evaluate(() => { busy = false; FAST = true; endTurn(); FAST = false; BU.key = ''; render(); }); await p.waitForTimeout(1500); await p.evaluate(() => { busy = false; if (KOE) rucksackZu(); BU.key = ''; render(); }); await foto('13-zann-fenster-offen', 1200);
  // 14 Dev-Reiter mit dem Abschnitt Würze
  await p.evaluate(() => { if (KOE) rucksackZu(); Dev.an = false; Dev.tab = 'tiefe'; Dev.toggle(); }); await foto('14-dev-wuerze', 900);
  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
})();
