// Auftrag 4, Phase 3: drei Karten lassen sich in unter zwei Sekunden hintereinander spielen, ohne dass eine Animation den Klick schluckt.
// Dazu: Austeilen setzt Startpunkte (--sx), Rauten erlöschen beim Bezahlen, Flüge räumen sich auf, Stempel bei Reaktionen.
// node tools/test-bewegung.js   (eigener Server, Ton aus)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
let fehler = 0; const ok = (b, t) => { console.log((b ? 'ok    ' : 'FEHLER ') + t); if (!b) fehler++; };
(async () => {
  const wurzel = path.join(__dirname, '../prototype');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(); const konsole = [];
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', e => konsole.push(String(e)));
  await p.goto(`${url}/index.html?dev=0&job=fischer&seed=3&springe=kampf&akt=1`); await p.waitForTimeout(1300);
  await p.evaluate(() => { try { audioOn = false; Einst.set('musik', 0); Einst.set('ton', 0); } catch (e) { } });
  // Austeilen: neuer Zug setzt dealAnim, die Karten tragen ihren Startpunkt am Ziehstapel
  const deal = await p.evaluate(() => { Bus.emit('deal'); render(); const k = [...document.querySelectorAll('#hand .karte')]; return { n: k.length, neu: k.filter(x => x.classList.contains('neu') && x.style.getPropertyValue('--sx')).length }; });
  ok(deal.n > 0 && deal.neu === deal.n, `Austeilen: ${deal.neu}/${deal.n} Karten starten am Ziehstapel (--sx, --sy)`);
  // drei billige Karten ohne Ziel, Energie reicht
  await p.evaluate(() => { S.hand = [0, 1, 2].map(i => ({ n: 'Probe ' + i, c: 0, st: ['S'], blk: 1 })); S.energy = 3; BW.en = null; render(); });
  await p.waitForTimeout(400);
  await p.evaluate(() => { window.__t = []; document.addEventListener('pointerup', () => window.__t.push(['up', performance.now()]), true); Bus.on('card_played', () => window.__t.push(['karte', performance.now()])); });
  const t0 = Date.now(); let gespielt = 0;
  for (let i = 0; i < 3; i++) {
    const box = await p.locator('#hand .karte').first().boundingBox(); await p.mouse.click(box.x + box.width / 2, box.y + box.height * .6); gespielt++;
    await p.waitForTimeout(120);
  }
  const r = await p.evaluate(() => { const T = window.__t, up = T.filter(x => x[0] === 'up').map(x => x[1]), k = T.filter(x => x[0] === 'karte').map(x => x[1]);
    return { hand: S.hand.length, block: S.block, flug: document.querySelectorAll('#flug .karte').length, latenz: k.map((t, i) => Math.round(t - up[i])), dauer: Math.round(k[k.length - 1] - up[0]) }; });
  // die Zeit des Testtreibers (Lage jeder Karte holen, Maus bewegen) ist nicht Teil des Spiels: gemessen wird im Browser vom ersten Loslassen bis zur dritten gespielten Karte
  ok(r.hand === 0 && r.dauer < 2000 && r.latenz.length === 3 && r.latenz.every(x => x >= 0 && x < 50), `drei Karten in ${r.dauer} ms gespielt, je Klick bis zur Wirkung ${r.latenz.join(', ')} ms (Hand danach ${r.hand}, Block ${r.block}, Treiber ${Date.now() - t0} ms)`);
  await p.waitForTimeout(700); ok(await p.evaluate(() => document.querySelectorAll('#flug .karte').length === 0), `Flüge räumen sich auf (während des Spielens ${r.flug})`);
  // Rauten: beim Bezahlen erlischt eine
  const er = await p.evaluate(() => { S.hand = [{ n: 'Teuer', c: 1, st: ['S'], blk: 1 }]; S.energy = 3; BW.en = null; render(); playCard(0); return document.querySelectorAll('#leiste .ener i.erlischt').length; });
  ok(er === 1, `Energie: beim Bezahlen erlischt eine Raute (${er})`);
  const zu = await p.evaluate(() => { S.energy = 0; render(); S.turnNo++; S.energy = 3; render(); return [...document.querySelectorAll('#leiste .ener i.zuend')].map(i => parseInt(i.style.animationDelay) || 0); });
  ok(zu.length === 3 && zu[2] > zu[1] && zu[1] > zu[0] - 1, `Zugbeginn: Rauten leuchten nacheinander auf (Verzögerung ${zu.join(', ')} ms)`);
  // Stempel bei einer Reaktion
  const st = await p.evaluate(() => { const r = REACT[0]; Bus.emit('reaction', { r, k: 0, keys: [...String(r.k || 'WS')].slice(0, 2), live: null }); const s = document.querySelector('#hud .stempel'); return s ? s.innerText.trim() : ''; });
  ok(!!st, `Reaktion schlägt als Stempel ein („${st}“)`);
  ok(!konsole.length, `Browser ohne Fehler${konsole.length ? ': ' + konsole[0] : ''}`);
  await p.close(); await b.close(); srv.close();
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
