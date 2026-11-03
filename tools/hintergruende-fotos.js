// Bildschirmfotos der Hintergründe (M8).
// Aufruf (Server läuft auf :8000 mit Wurzel prototype/):
//   node tools/hintergruende-fotos.js            alle Biome, Übersicht, Bildrate
//   node tools/hintergruende-fotos.js hafen moor nur diese Biome
//   node tools/hintergruende-fotos.js --arten    zusätzlich alle Arten je Biom und die Sonderszenen
//   node tools/hintergruende-fotos.js --fremd    zusätzlich fremdheit 0 / 0,5 / 1 je Biom
// Ausgabe: docs/auftrag/bilder/M8/
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const AUS = path.join(__dirname, '..', 'docs', 'auftrag', 'bilder', 'M8');
const BIOME = ['hafen', 'moor', 'kapelle', 'salz', 'stadt', 'eis', 'pforte'];
const args = process.argv.slice(2);
const nur = args.filter(a => !a.startsWith('--'));
const biome = nur.length ? nur : BIOME;
fs.mkdirSync(AUS, { recursive: true });

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1600, height: 900 } });
  const fehler = [];
  p.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  p.on('pageerror', e => fehler.push(String(e)));
  await p.goto('http://localhost:8000/hintergrund.html?gegner=0&wackeln=0');
  await p.waitForFunction(() => window.labBereit);
  // Hilfsfunktion in der Seite: Szene(n) in ein Raster zeichnen, PNG als dataURL zurück
  await p.evaluate(() => {
    const B = World.B;
    const XS = [[240], [128, 352], [300]];
    function platz(pal, nr, nebel) {
      const c = B.platzhalter(pal, nr); if (!nebel) return c;
      const x = c.getContext('2d'), id = x.getImageData(0, 0, 96, 120), d = id.data, f = B.col(pal.nebel[1]);
      for (let i = 0; i < d.length; i += 4) { if (!d[i + 3]) continue; const q = i / 4, X = q % 96, Y = (q / 96) | 0; if (nebel * .8 > B.bay(X, Y)) { d[i] = (d[i] + f[0]) >> 1; d[i + 1] = (d[i + 1] + f[1]) >> 1; d[i + 2] = (d[i + 2] + f[2]) >> 1; } }
      x.putImageData(id, 0, 0); return c;
    }
    window.fotoRaster = function (zellen, spalten, skala, t) {
      const zeilen = Math.ceil(zellen.length / spalten), gap = 4;
      const out = document.createElement('canvas'); out.width = spalten * (480 * skala + gap) - gap; out.height = zeilen * (270 * skala + gap) - gap;
      const o = out.getContext('2d'); o.imageSmoothingEnabled = false; o.fillStyle = '#000'; o.fillRect(0, 0, out.width, out.height);
      zellen.forEach((z, i) => {
        const S = World.build(z.biom, z.opt), c = document.createElement('canvas'); c.width = 480; c.height = 270;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
        const pal = World.palette(z.biom), ph = S.reihen.map((r, k) => platz(pal, k + 1, r.nebel));
        S.zeichne(x, t || 3.2, { x: 0, y: 0 }, z.gegner ? (cx, reihen) => reihen.forEach((r, k) => XS[k].forEach(px => { const w = Math.round(96 * r.skala), h = Math.round(120 * r.skala); cx.drawImage(ph[k], Math.round(px - w / 2), r.y - h + 2, w, h); })) : null);
        o.drawImage(c, (i % spalten) * (480 * skala + gap), Math.floor(i / spalten) * (270 * skala + gap), 480 * skala, 270 * skala);
      });
      return out.toDataURL('image/png');
    };
    window.fotoBildrate = function (biom, n) {
      const S = World.build(biom, { variante: 0, seed: 1, art: 'kampf' }), c = document.createElement('canvas'); c.width = 480; c.height = 270;
      const x = c.getContext('2d'), pal = World.palette(biom), ph = S.reihen.map((r, k) => platz(pal, k + 1, r.nebel));
      const g = (cx, reihen) => reihen.forEach((r, k) => XS[k].forEach(px => cx.drawImage(ph[k], px - 48, r.y - 118)));
      const t0 = performance.now();
      for (let i = 0; i < n; i++) { const t = i / 60; S.zeichne(x, t, { x: Math.sin(t) * 4, y: Math.cos(t * .7) * 2 }, g); }
      x.getImageData(0, 0, 1, 1);
      return (performance.now() - t0) / n;
    };
    window.fotoAufbau = function (biom) { const t0 = performance.now(); World.build(biom, { variante: 0, seed: 1 }); return performance.now() - t0; };
  });
  const speichern = async (name, zellen, spalten, skala, t) => {
    const url = await p.evaluate(([z, s, k, tt]) => window.fotoRaster(z, s, k, tt), [zellen, spalten, skala, t]);
    fs.writeFileSync(path.join(AUS, name), Buffer.from(url.split(',')[1], 'base64'));
    console.log('geschrieben', name);
  };
  for (const bi of biome) {
    await speichern(`${bi}-kampf-v0.png`, [{ biom: bi, opt: { variante: 0, seed: 1, art: 'kampf' }, gegner: true }], 1, 2);
    await speichern(`${bi}-varianten.png`, [0, 1, 2].map(v => ({ biom: bi, opt: { variante: v, seed: 1, art: 'kampf' } })).concat([{ biom: bi, opt: { variante: 0, seed: 1, art: 'waechter' } }]), 2, 1);
    if (args.includes('--fremd')) await speichern(`${bi}-fremdheit.png`, [0, .5, 1].map(f => ({ biom: bi, opt: { variante: 0, seed: 1, fremdheit: f, art: 'kampf' } })), 3, 1);
    if (args.includes('--arten')) await speichern(`${bi}-arten.png`, ['weg', 'rast', 'werkstatt', 'kraemer', 'ereignis', 'wandbild', 'fund', 'uebergang'].map(a => ({ biom: bi, opt: { variante: 0, seed: 2, art: a } })), 4, 1);
  }
  if (!nur.length) {
    await speichern('uebersicht.png', BIOME.map(bi => ({ biom: bi, opt: { variante: 0, seed: 1, art: 'kampf' }, gegner: true })).concat([{ biom: 'hafen', opt: { art: 'titel', seed: 1 } }]), 4, 1);
    if (args.includes('--arten')) await speichern('sonderszenen.png', ['strand', 'ankunft', 'titel'].map(a => ({ biom: 'hafen', opt: { art: a, seed: 1 } })), 3, 1);
    // Bildrate: 300 Bilder je Biom (Ebenen + Animation + 4 Platzhalter + Vordergrund und Luft)
    const zeilen = [];
    for (const bi of BIOME) {
      const ms = await p.evaluate(bb => window.fotoBildrate(bb, 300), bi);
      const auf = await p.evaluate(bb => window.fotoAufbau(bb), bi);
      zeilen.push(`${bi}: ${ms.toFixed(2)} ms/Bild, Aufbau ${auf.toFixed(0)} ms`);
    }
    console.log('Bildrate (headless Chromium, 300 Bilder):\n' + zeilen.join('\n'));
    fs.writeFileSync(path.join(AUS, 'bildrate.txt'), zeilen.join('\n') + '\n');
  }
  if (fehler.length) console.log('KONSOLENFEHLER:\n' + fehler.join('\n'));
  await b.close();
})();
