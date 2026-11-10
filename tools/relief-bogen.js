// Kontaktbogen der Wandbild-Reliefs: malt für jedes Fragment aus data/fragmente.json World.relief(biom, hashStr(id), motiv)
// und setzt sie mit Titel und Motiv ins PNG (Relief dreifach, ganzzahlig vergrößert, harte Pixel).
// Der Bogen wird auf Blätter zu je 25 Fragmenten verteilt: relief-bogen.png, relief-bogen-2.png, ...
// node tools/relief-bogen.js [ordner=docs/auftrag-3/bilder/M1] [--je=25] [--url=http://localhost:8000]
// Gemalt wird über World.B.relief mit Palette und Stil des Bioms (dasselbe wie World.relief), weil js/scenes/world/pforte.js
// World.relief umhüllt und den Parameter motiv nicht weiterreicht.
// Ohne --url bedient das Werkzeug prototype/ neben sich selbst über einen eigenen Server (freier Port), damit immer der
// Stand dieses Ordners gemalt wird. Alle Biom-Szenen aus js/scenes/world/ werden nachgeladen, damit jedes Biom seine Palette hat.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
(async () => {
  const a = process.argv.slice(2), pos = a.filter(x => !x.startsWith('--')), opt = k => (a.find(x => x.startsWith('--' + k + '=')) || '').split('=')[1];
  const out = path.resolve(pos[0] || path.join(__dirname, '../docs/auftrag-3/bilder/M1')), je = +(opt('je') || 25), K = 3;
  const wurzel = path.join(__dirname, '../prototype'); fs.mkdirSync(out, { recursive: true });
  let srv = null, url = opt('url');
  if (!url) {
    const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png' };
    srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
    await new Promise(r => srv.listen(0, r)); url = 'http://localhost:' + srv.address().port;
  }
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1600, height: 900 } }), fehler = [];
  p.on('pageerror', e => fehler.push('Seitenfehler: ' + e)); p.on('console', m => { if (m.type() === 'error') fehler.push('Konsole: ' + m.text()); });
  await p.goto(url + '/index.html'); await p.waitForFunction(() => typeof World !== 'undefined' && World.relief && typeof hashStr === 'function');
  const szenen = fs.readdirSync(path.join(wurzel, 'js/scenes/world')).filter(f => f.endsWith('.js') && f !== 'basis.js');
  for (const s of szenen) { const nm = s.replace('.js', ''); if (!(await p.evaluate(n => !!World._biome[n], nm))) await p.addScriptTag({ url: url + '/js/scenes/world/' + s }).catch(e => fehler.push('Szene ' + s + ': ' + e.message)); }
  const frag = await p.evaluate(async () => (await (await fetch('data/fragmente.json')).json()).map(f => ({ id: f.id, biom: f.biom, titel: f.titel, motiv: f.motiv || null })));
  const bilder = await p.evaluate(fr => fr.map(f => { try { const d = World._biome[f.biom] || World._biome.hafen; return World.B.relief(d.pal, hashStr(f.id) || 1, d.reliefStil || {}, f.motiv || undefined).toDataURL(); } catch (e) { return 'FEHLER ' + e.message; } }), frag);
  frag.forEach((f, i) => { if (bilder[i].startsWith('FEHLER')) fehler.push(f.id + ': ' + bilder[i]); });
  const fehlt = frag.filter(f => !f.motiv).length, motive = {}; frag.forEach(f => { const k = f.motiv || 'prozession (altes Fragment ohne Motiv)'; motive[k] = (motive[k] || 0) + 1; });
  const blaetter = Math.ceil(frag.length / je);
  for (let n = 0; n < blaetter; n++) {
    const teil = frag.slice(n * je, (n + 1) * je).map((f, i) => `<div class="k"><div class="t">${f.id} <small>${f.motiv || 'prozession (ohne Motiv)'}</small></div><div class="u">${f.titel}</div><img src="${bilder[n * je + i]}" width="${160 * K}" height="${100 * K}"></div>`).join('');
    const q = await b.newPage({ viewport: { width: 1600, height: 900 } });
    await q.setContent(`<html><body style="margin:0;background:#0b0c0e;color:#e8dcc0;font:13px monospace;padding:14px"><style>.g{display:grid;grid-template-columns:repeat(3,${160 * K + 14}px);gap:10px}.k{background:#15161a;border:1px solid #2a2a30;padding:6px}.t{font-size:13px;margin-bottom:2px}.t small{color:#c8a860}.u{font-size:11px;color:#8a8070;margin-bottom:4px;height:14px;overflow:hidden;white-space:nowrap}img{display:block;image-rendering:pixelated}h1{font-size:15px;margin:0 0 10px}</style><h1>Reliefs, Blatt ${n + 1} von ${blaetter} (Fragmente ${n * je + 1} bis ${Math.min(frag.length, (n + 1) * je)} von ${frag.length}), dreifach vergrößert</h1><div class="g">${teil}</div></body></html>`);
    const f = path.join(out, 'relief-bogen' + (n ? '-' + (n + 1) : '') + '.png'); await q.screenshot({ path: f, fullPage: true }); await q.close(); console.log('geschrieben: ' + path.relative(process.cwd(), f));
  }
  console.log(frag.length + ' Fragmente gemalt, Motive: ' + Object.entries(motive).map(([k, v]) => k + ' ' + v).join(', ') + (fehlt ? ' (' + fehlt + ' ohne Motiv)' : ''));
  console.log(fehler.length ? fehler.join('\n') : 'Keine Konsolenfehler.');
  await b.close(); if (srv) srv.close(); if (fehler.length) process.exitCode = 1;
})();
