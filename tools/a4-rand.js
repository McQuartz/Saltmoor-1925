// Auftrag 4, Phase 0: Deckt jede Szene den Bildraum 560 × 315 ab? (x −40 bis 520, y 3 bis 318 in Szenenkoordinaten)
// Baut jede Szene jedes Bioms, legt alle Ebenen (0 bis 5) übereinander und zählt Bildpunkte ohne Farbe (dort wäre im Spiel Schwarz).
// node tools/a4-rand.js [ordner=docs/auftrag-4/bilder/rand] [biom,…] [--szenen=kampf:0,…] [--bogen]   (--bogen: Kontaktbogen mit Lücken in Magenta)
// Bedient prototype/ selbst über einen eigenen Server (freier Port).
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
(async () => {
  const a = process.argv.slice(2), pos = a.filter(x => !x.startsWith('--'));
  const out = path.resolve(pos[0] || path.join(__dirname, '../docs/auftrag-4/bilder/rand')); fs.mkdirSync(out, { recursive: true });
  const wurzel = path.join(__dirname, '../prototype');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1200, height: 800 } }), fehler = [];
  p.on('pageerror', e => fehler.push('Seitenfehler: ' + e));
  await p.goto(url + '/index.html'); await p.waitForFunction(() => typeof World !== 'undefined' && typeof BIOMES !== 'undefined' && Object.keys(BIOMES).length > 20, null, { timeout: 20000 });
  await p.evaluate(() => { try { audioOn = false; } catch (e) { } });
  for (const s of fs.readdirSync(path.join(wurzel, 'js/scenes/world')).filter(f => f.endsWith('.js') && f !== 'basis.js')) { const nm = s.replace('.js', ''); if (!(await p.evaluate(n => !!World._biome[n], nm))) await p.addScriptTag({ url: url + '/js/scenes/world/' + s }).catch(e => fehler.push(s + ': ' + e.message)); }
  const biome = pos[1] ? pos[1].split(',') : await p.evaluate(() => Object.keys(BIOMES));
  const szenen = ((a.find(x => x.startsWith('--szenen=')) || '').split('=')[1] || 'kampf:0,kampf:1,kampf:2,waechter:0,rast:0,kraemer:0,werkstatt:0,fund:0,ereignis:0,weg:0,wandbild:0').split(',');
  const bogen = a.includes('--bogen'), alle = a.includes('--alle');
  const zeilen = []; let summe = 0, n = 0, ms = 0;
  for (const bi of biome) {
    const r = await p.evaluate(([bi, szenen, bogen, alle]) => szenen.map(k => {
      const [art, v] = k.split(':'); let sz; const t0 = performance.now();
      try { sz = World.build(bi, { art, variante: +v, seed: 7 }); } catch (e) { return { k, f: String(e) }; }
      const dauer = performance.now() - t0;
      const c = document.createElement('canvas'); c.width = 560; c.height = 315; const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.setTransform(1, 0, 0, 1, 40, -3);
      try { if (sz.zeichneHintergrund) sz.zeichneHintergrund(g, 0, { x: 0, y: 0 }); else sz.ebenen.forEach(L => g.drawImage(L.canvas, L.x || 0, L.y || 0)); if (sz.zeichneVordergrund) sz.zeichneVordergrund(g, 0, { x: 0, y: 0 }); } catch (e) { }
      g.setTransform(1, 0, 0, 1, 0, 0);
      const id = g.getImageData(0, 0, 560, 315), d = id.data; let leer = 0, li = 0, re = 0, un = 0;
      for (let y = 0; y < 315; y++) for (let x = 0; x < 560; x++) { const o = (y * 560 + x) * 4; if (d[o + 3] < 255) { leer++; if (x < 40) li++; else if (x >= 520) re++; else un++; d[o] = 255; d[o + 1] = 0; d[o + 2] = 255; d[o + 3] = 255; } }
      let bild = null; if (bogen && (leer || alle)) { g.putImageData(id, 0, 0); g.strokeStyle = '#ff0'; g.strokeRect(40.5, -2.5, 480, 270); bild = c.toDataURL(); }
      return { k, leer: leer / (560 * 315), li, re, un, dauer, bild };
    }), [bi, szenen, bogen, alle]);
    for (const x of r) {
      if (x.f) { zeilen.push(`${bi} ${x.k}: FEHLER ${x.f}`); continue; }
      summe += x.leer; n++; ms += x.dauer;
      zeilen.push(`${bi.padEnd(18)} ${x.k.padEnd(12)} leer ${(x.leer * 100).toFixed(2).padStart(6)} %  (links ${x.li}, rechts ${x.re}, unten/innen ${x.un})  Bau ${x.dauer.toFixed(0)} ms`);
      if (x.bild) fs.writeFileSync(path.join(out, `${bi}-${x.k.replace(':', '-')}.png`), Buffer.from(x.bild.split(',')[1], 'base64'));
    }
  }
  console.log(zeilen.join('\n'));
  const mitLuecke = zeilen.filter(z => /leer\s+(\d+\.\d+)/.test(z) && +z.match(/leer\s+(\d+\.\d+)/)[1] > 0).length;
  console.log(`\n${n} Szenen, mittlere Lücke ${(summe / Math.max(1, n) * 100).toFixed(3)} %, Szenen mit Lücke: ${mitLuecke}, Bau im Mittel ${(ms / Math.max(1, n)).toFixed(0)} ms`);
  if (fehler.length) console.log(fehler.join('\n'));
  await b.close(); srv.close();
})();
