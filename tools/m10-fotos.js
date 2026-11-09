// Auftrag 3 M10: Bildschirmfotos der Metaebene (Ausrede-Stufen für zwei Figuren, Ankunftszeile, Pausen-Zeile, Erbe, Notizen an der Rast und im Tagebuch, Fehlzeit).
// node tools/m10-fotos.js [ziel=docs/auftrag-3/bilder/M10]   (startet selbst einen Server aus prototype/). Die Strand-Stufen macht tools/strand-fotos.js.
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), { spawn } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800);
const URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/M10'; require('fs').mkdirSync(out, { recursive: true });
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  const foto = async (n, warte = 700) => { await p.waitForTimeout(warte); await p.screenshot({ path: `${out}/${n}.png` }); };
  const laden = async () => { await p.goto(`${URL}?dev=0`); await p.waitForTimeout(900); await p.evaluate(() => { Meta.reset(); Meta.allesFrei(); }); };
  // 1–8 Ausrede in allen Stufen, Fischer und Pfarrerin (Zwischentitel Akt I)
  await laden();
  for (const job of ['fischer', 'pfarrerin']) for (const [s, r] of [[0, 0], [1, 2], [2, 7], [3, 14]]) {
    await p.evaluate(([job, r]) => { Meta.get().runsJob = { [job]: r }; Meta.get().erbe = null; newRun(job, 8, { route: ['hafen'] }); BU.key = ''; render(); }, [job, r]);
    await foto(`ausrede-${job}-${s}`);
  }
  // 9 Figurwahl mit Ausrede-Stufen gemischt und Ankunftszeile nach dem ersten Umkehren
  await p.evaluate(() => { Meta.get().runsJob = { fischer: 14, friedhofswaerter: 7, pfarrerin: 2 }; Meta.get().ankunftOffen = true; Meta.get().runs = 6; S = { phase: 'figur' }; BU.key = ''; render(); });
  await foto('figurwahl-ankunftzeile');
  // 10 Pausen-Zeile auf dem Titel
  await p.evaluate(() => { const M = Meta.get(); M.ankunftOffen = false; M.runs = 6; M.letzterOrt = 'kapelle'; M.zuletzt = Date.now() - 20 * 864e5; M.pauseGezeigt = 0; Metaebene.sitzung(); S = { phase: 'titel' }; BU.key = ''; render(); });
  await foto('pause-titel');
  // 11 Erbe-Angebot; 12 Erbe-Karte in der Hand
  await p.evaluate(() => { const M = Meta.get(); M.runsJob = {}; M.erbe = { hg: 'rausch', st: ['W'], src: 'Sichtglas des Helmtauchers', n: 13 }; newRun('fischer', 8, { route: ['hafen'] }); BU.key = ''; render(); });
  await foto('erbe-angebot');
  await p.evaluate(() => { Metaebene.erbeWahl(true); leaveUebergang(); const g = BIOMES.hafen.gegner.filter(k => (FOES[k].rang || 'normal') === 'normal').slice(0, 2); startFight(g, 'kampf'); const i = S.draw.findIndex(c => c.erbe); if (i >= 0) S.hand.unshift(...S.draw.splice(i, 1)); S.hand = S.hand.slice(0, 5); BU.key = ''; render(); });
  await foto('erbe-in-der-hand', 1100);
  // 13 Notizen des Vorgängers an der Rast; 14 Tagebuch mit Notizen
  await p.evaluate(() => { const M = Meta.get(); M.erbe = null; M.letzter = { verloren: true, job: 'veteran', tiefe: 22, biome: ['hafen', 'kapelle', 'salz'], waechter: ['lotse', 'glockenmutter'] };
    for (let s = 1; s < 200; s++) { Meta.get().seiten = []; newRun('fischer', s, { route: ['hafen'] }); leaveUebergang(); S.phase = 'weg'; enterNode({ art: 'rast' }); if (S.notizen && S.notizen.length >= 2) break; } BU.key = ''; render(); });
  await foto('notizen-rast');
  await p.evaluate(() => { zeigeOverlay(tagebuchHtml()); const o = document.querySelector('#overlay .box'); if (o) o.scrollTop = o.scrollHeight; });
  await foto('tagebuch-notizen');
  await p.evaluate(() => closeOv());
  // 15 Fehlzeit-Angebot nach dem Tod in Akt V
  await p.evaluate(() => { const M = Meta.get(); M.letzter = null; newRun('veteran', 21, {}); S.route = RUN.akte.map(a => a.biome.find(x => BIOMES[x])); S.akt = 4; S.depth = 28; runLost(); BU.key = ''; render(); });
  await foto('fehlzeit-angebot');
  // 16 Start bei der Kapelle (Akt II) nach der Fehlzeit; 17 seine Handgriffe in fremder Fassung
  await p.evaluate(() => { Metaebene.fehlzeitWahl(true); newRun('veteran', 21, {}); if (S.phase === 'erbe') Metaebene.erbeWahl(false); if (S.phase === 'biomwahl') { const i = S.angebote[1].indexOf('kapelle'); chooseBiom(i >= 0 ? i : 0); } BU.key = ''; render(); });
  await foto('fehlzeit-start-akt2', 1000);
  await p.evaluate(() => { leaveUebergang(); const b = BIOMES[biomId()]; const g = b.gegner.filter(k => (FOES[k].rang || 'normal') === 'normal').slice(0, 2); startFight(g, 'kampf');
    const fr = [...S.draw, ...S.discard].filter(c => c.fremd); S.hand = [...fr.slice(0, 3), ...S.hand].slice(0, 5); BU.key = ''; render(); });
  await foto('fehlzeit-fremde-handgriffe', 1100);
  await p.evaluate(() => { zeigeOverlay(tagebuchHtml()); const o = document.querySelector('#overlay .box'); if (o) o.scrollTop = o.scrollHeight; });
  await foto('fehlzeit-tagebuch');
  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
})();
