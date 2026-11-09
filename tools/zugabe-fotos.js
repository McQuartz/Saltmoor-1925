// Auftrag 3 Zugabe: Fotos des Krämers mit tausend Masken (Angebot, angeschrieben, der Ring kassiert) und der neuen Ereignisse.
// node tools/zugabe-fotos.js [ziel=docs/auftrag-3/bilder/Zugabe]   (startet selbst einen Server aus prototype/)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), fs = require('fs'), { spawn } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800), URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/Zugabe'; fs.mkdirSync(out, { recursive: true });
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  const foto = async (n, w = 800) => { await p.evaluate(() => { if (KOE) rucksackZu(); BU.key = ''; render(); }); await p.waitForTimeout(w); await p.screenshot({ path: `${out}/${n}.png` }); };
  await p.goto(`${URL}?dev=0`); await p.waitForTimeout(800);
  // Krämer mit tausend Masken
  await p.evaluate(() => { newRun('kneipenschlaeger', 7, { dev: true }); S.zettel.wuerze = ['masken']; S.akt = 1; S.depth = 9; S.route[1] = S.route[1] || RUN.akte[1].biome.find(b => BIOMES[b]); S.phase = 'weg'; enterNode({ art: 'kraemer' }); });
  await foto('masken-1-angebot');
  await p.evaluate(() => { const i = S.shop.items.findIndex(o => !o.sold && !o.tausch); Wuerze.anschreiben(i); });
  await foto('masken-2-angeschrieben');
  await p.evaluate(() => { leaveNode(); S.akt = 2; S.depth = 15; S.route[2] = S.route[2] || RUN.akte[2].biome.find(b => BIOMES[b]); enterAct(); });
  await foto('masken-3-der-ring-kassiert', 1000);
  // die 14 neuen Ereignisse zu den Regelbiegungen (Zugabe 3)
  const ids = ['salz_probe','stadt_waescheleine','wald_stumpf','gezeitenwerk_staubecken','ziegelgruben_ringgang','station_abfahrt','eis_peilung','walkathedrale_dritter_schlag','glasmeer_vorrat','mond_zweiter_schatten','funkstation_dreimal','pforte_nebentueren','ufer_brandung','waage_restposten'];
  for (const id of ids) {
    await p.evaluate(id => { const ev = EVENTS.find(e => e.id === id); newRun('fischer', 3, { dev: true }); const akt = RUN.akte.findIndex(a => a.biome.includes(ev.biom)); S.akt = Math.max(0, akt); S.route[S.akt] = ev.biom; S.depth = 3 + S.akt * 7; S.event = id; S.phase = 'event'; S.node = { art: 'ereignis' }; }, id);
    await foto('ereignis-' + id, 900);
  }
  console.log(`${ids.length} Ereignisse fotografiert`); console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
})();
