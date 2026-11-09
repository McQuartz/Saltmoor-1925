// Auftrag 3 M8: Bildschirmfotos der Farbe (Schimmern, Karte, Stoff-Baum, Spur, Bindung, Ereignis Brunnen).
// node tools/farbe-fotos.js [ziel=docs/auftrag-3/bilder/M8]   (startet selbst einen Server aus prototype/)
const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');
// Eigener Server aus dem Ordner prototype/ dieses Arbeitsbaums (ein schon laufender auf 8000 könnte einen anderen Stand zeigen)
const PORT = 8000 + 100 + Math.floor(Math.random() * 800);
const URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/M8';
  require('fs').mkdirSync(out, { recursive: true });
  let srv = null;
  {
    srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
    for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  }
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 3 }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  const foto = async (n, warte = 500, clip) => { await p.waitForTimeout(warte); await p.screenshot({ path: `${out}/${n}.png`, scale: clip ? 'device' : 'css', ...(clip ? { clip } : {}) }); };
  const neu = async () => { await p.goto(`${URL}?dev=0&job=fischer&seed=8&springe=weg&akt=1`); await p.waitForTimeout(700); };
  // Aufbau: drei angelegte Items mit Stoff (Waffe, Kleidung, Talisman), Farbe auf dem ersten
  const aufbau = (opt = {}) => p.evaluate(opt => {
    BAL.auftrag3.farbe = true; newRun('fischer', 8, { dev: true }); S.route = ['hafen', 'kloster']; S.akt = 1; S.depth = 8;
    const ids = opt.ids || ['knife', 'holywater', 'lantern'].filter(id => ITEMS[id]);
    ids.forEach(id => { const a = ITEMS[id].a; S.slots[a] = Math.max(S.slots[a], 1); const k = S.areas[a].findIndex((x, i) => i < S.slots[a] && !x); S.areas[a][k < 0 ? 0 : k] = mk(id); });
    const l = allActive(); S.farbe = { uid: l[0].uid, letzte: null, gebunden: !!opt.gebunden, ab: 8 }; return l.map(it => it.id);
  }, opt);
  const rucksack = async (n, uid, spur) => {
    await p.evaluate(([uid]) => { Dev.springe('weg'); rucksackAuf({ uid }); }, [uid]);
    await foto(n, 900);
  };

  // 1 Farbe auf einem Item (Rucksack, Fach mit schimmerndem Item-Bild, daneben das Item rechts)
  await neu(); const ids = await aufbau();
  await p.evaluate(() => { Dev.springe('weg'); rucksackAuf({ uid: S.farbe.uid }); });
  await foto('01-farbe-auf-item-rucksack', 900);
  await foto('01b-farbe-auf-item-zoom', 300, { x: 195, y: 195, width: 110, height: 100 });

  // 2 Spur: die Farbe ist weitergewandert, das verlassene Item trägt einen getauschten Stoff und die Linie
  await p.evaluate(() => { S.stats.kaempfe = 1; Farbe.wandern(); Dev.springe('weg'); const sp = Farbe.mitSpur()[0]; rucksackAuf({ uid: sp ? sp.uid : S.farbe.letzte }); });
  await foto('02-spur-rucksack', 900);
  await foto('02b-spur-zoom', 300, { x: 195, y: 195, width: 110, height: 100 });
  await foto('02c-farbe-talisman-zoom', 300, { x: 560, y: 90, width: 230, height: 90 });

  // 3 Gebunden: starr und kristallin
  await neu(); await aufbau({ gebunden: true });
  await p.evaluate(() => { Dev.springe('weg'); rucksackAuf({ uid: S.farbe.uid }); });
  await foto('03-gebunden-rucksack', 900);
  await foto('03b-gebunden-zoom', 300, { x: 195, y: 195, width: 110, height: 100 });

  // 4 Kampf: Karte des Farbe-Items nimmt den Stoff der Karte davor an (Hand und Stoff-Baum)
  await neu(); await aufbau({ ids: ['knife', 'holywater', 'lantern'] });
  const ablauf = await p.evaluate(() => {
    const feind = BIOMES.kloster.gegner[0]; S.hp = maxHp(); startFight([feind], 'kampf');
    // Karten des Farbe-Items in die Hand holen, eine fremde Karte davor
    const eigene = c => c.uid === S.farbe.uid;
    const alle = [...S.hand, ...S.draw]; S.draw = S.draw.filter(c => !alle.includes(c) || false);
    const fremd = alle.filter(c => !eigene(c) && !c.unspielbar && c.st && c.st.length).slice(0, 2); const farbig = alle.filter(c => eigene(c) && !c.unspielbar).slice(0, 3);
    S.hand = [...fremd, ...farbig]; S.draw = alle.filter(c => !S.hand.includes(c)); S.energy = 9; Farbe.hand(); render();
    return { fremd: fremd.map(c => c.n + ':' + c.st), farbig: farbig.map(c => c.n + ':' + c.st) };
  });
  console.log('Kampfaufbau', JSON.stringify(ablauf));
  await foto('04a-karte-vor-dem-spielen', 700);
  await p.evaluate(() => { playCard(0, 0); render(); }); await p.waitForTimeout(900);
  await p.evaluate(() => { const i = S.hand.findIndex(c => Farbe.karte(c)); playCard(i, 0); render(); });
  await foto('04b-karte-nimmt-stoff-an-kampf', 1200);
  await foto('04c-hand-zoom', 200, { x: 500, y: 490, width: 390, height: 200 });
  await foto('04d-baum-zoom', 200, { x: 170, y: 600, width: 260, height: 90 });

  // 5 Ereignis Brunnen
  await neu(); await aufbau();
  await p.evaluate(() => { Dev.springe('weg'); S.event = 'farbe_brunnen'; S.phase = 'event'; BU.key = ''; render(); });
  await foto('05-ereignis-brunnen', 1000);

  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.');
  await b.close(); if (srv) srv.kill();
})();
