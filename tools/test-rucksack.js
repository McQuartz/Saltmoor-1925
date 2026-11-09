// Auftrag 3, M4: Rucksack „Am Körper“. node tools/test-rucksack.js [--ohne-fotos]
// Startet selbst einen Server aus prototype/. Prüft je Figur: Silhouette geladen, Anschlusspunkte aus jobs.json auf der Figur,
// Fächer mit eigener Form (Reihe, 2×2, Säule), gesperrte Plätze mit Schloss, Kerben je Item, keine Überlappung von Figur-Fächern und rechter Spalte,
// kein „?“; dann Bedienung: Klick wählt, passende Ziele leuchten, Klick tauscht, Deck zeigt Grün/Rot, Ziehen mit der Maus, Verkaufen beim Krämer,
// Werkbank in der Werkstatt, nach einem Fund öffnet er sich selbst, im Kampf nur lesend, alte Itemleiste und alter Rucksackmodus sind weg.
// Fotos nach docs/auftrag-3/bilder/M4/.
const path = require('path'), fs = require('fs'), http = require('http'), net = require('net');
const { spawn } = require('child_process');
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
const fotos = !process.argv.includes('--ohne-fotos');
const AUS = path.join(__dirname, '..', 'docs', 'auftrag-3', 'bilder', 'M4');
const freierPort = () => new Promise(r => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const warten = (url, n = 40) => new Promise((res, rej) => { const t = i => http.get(url, x => { x.resume(); res(); }).on('error', () => i > n ? rej(new Error('Server startet nicht')) : setTimeout(() => t(i + 1), 150)); t(0); });
const JOBS = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'prototype', 'data', 'jobs.json'), 'utf8'));
const AUFL = [[1280, 720], [1440, 900], [1920, 1080]];
const MESSEN = () => {
  const k = document.getElementById('koerper'), kr = k.getBoundingClientRect(), u = kr.width / 480;
  const box = el => { const r = el.getBoundingClientRect(); return { l: (r.left - kr.left) / u, r: (r.right - kr.left) / u, t: (r.top - kr.top) / u, b: (r.bottom - kr.top) / u }; };
  const fach = [...k.querySelectorAll('.fach')].map(f => ({ a: f.dataset.fach, art: f.className.replace('fach', '').trim(), ...box(f), n: f.querySelectorAll('.kslot').length, zu: f.querySelectorAll('.kslot.zu').length, schloss: f.querySelectorAll('.kslot.zu .schloss').length,
    spalten: new Set([...f.querySelectorAll('.kslot')].map(s => Math.round(box(s).l))).size, zeilen: new Set([...f.querySelectorAll('.kslot')].map(s => Math.round(box(s).t))).size }));
  const rechts = box(k.querySelector('.krechts')), name = box(k.querySelector('.kname')), fuss = box(k.querySelector('.rkfuss'));
  const img = k.querySelector('.kfigur');
  return { an: k.classList.contains('an'), fach, rechts, name, fuss, figurOk: img && img.complete && img.naturalWidth === 110, figurSrc: img && img.getAttribute('src'), text: k.innerText,
    kerben: [...k.querySelectorAll('.kslot:not(.zu) .kkb')].map(x => x.children.length), lesen: k.classList.contains('lesen'), dataLoc: k.querySelectorAll('[data-loc]').length,
    leiste: document.getElementById('leiste').className, alteLeiste: !!document.querySelector('#leiste .areas'), amk: !!document.querySelector('#kopf [data-act="rucksack"]'), punkte: k.querySelectorAll('.klinien .pkt').length };
};
const lap = (a, b) => a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b;
(async () => {
  const port = await freierPort();
  const srv = spawn('python3', ['-m', 'http.server', String(port)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  try {
    await warten(`http://localhost:${port}/index.html`);
    const { chromium } = require('playwright'); const b = await chromium.launch();
    const konsole = [];
    const seite = async (W, H, s, job = 'fischer', zusatz = '') => {
      const p = await b.newPage({ viewport: { width: W, height: H } }); p.on('pageerror', e => konsole.push(String(e))); p.on('console', m => { if (m.type() === 'error') konsole.push(m.text()); });
      await p.goto(`http://localhost:${port}/index.html?dev=0&job=${job}&seed=3&springe=${s}&akt=1${zusatz}`); await p.waitForTimeout(1300); return p;
    };
    if (fotos) fs.mkdirSync(AUS, { recursive: true });
    // 1. Daten: jede Figur hat eine Silhouette und Anschlusspunkte auf dem Körper (nicht durchsichtig)
    const L = require('./sprites/lib');
    for (const j of JOBS) {
      const f = path.join(__dirname, '..', 'prototype', 'assets', 'figuren', j.id + '.png');
      ok(fs.existsSync(f), `${j.id}: Silhouette vorhanden`); if (!fs.existsSync(f)) continue;
      const png = L.pngLesen(f);
      ok(png.W === 110 && png.H === 172, `${j.id}: 110 × 172`);
      ok(j.koerper && ['hals', 'leib', 'hand'].every(k => Array.isArray(j.koerper[k])), `${j.id}: jobs.json → koerper mit hals, leib, hand`);
      for (const k of ['hals', 'leib', 'hand']) { const [x, y] = j.koerper[k]; let auf = false; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (png.data[((y + dy) * png.W + x + dx) * 4 + 3]) auf = true; ok(auf, `${j.id}: ${k} liegt auf der Figur`); }
    }
    // 2. Jede Figur im Rucksack, alle drei Auflösungen
    for (const j of JOBS) for (const [W, H] of AUFL) {
      const p = await seite(W, H, 'rast', j.id);
      await p.evaluate(() => rucksackAuf()); await p.waitForTimeout(300);
      const m = await p.evaluate(MESSEN); const tag = `${j.id} ${W}×${H}`;
      ok(m.an && m.figurOk && m.figurSrc.includes(j.id), `${tag}: Silhouette der Figur geladen`);
      const F = Object.fromEntries(m.fach.map(f => [f.a, f]));
      ok(F.talisman && F.talisman.zeilen === 1 && F.talisman.spalten === 4, `${tag}: Talismane als Reihe`);
      ok(F.kleidung && F.kleidung.zeilen === 2 && F.kleidung.spalten === 2, `${tag}: Kleidung als 2×2-Block`);
      ok(F.waffe && F.waffe.spalten === 1 && F.waffe.zeilen === 4, `${tag}: Waffen als Säule`);
      ok(m.fach.every(f => f.zu === f.schloss), `${tag}: jeder gesperrte Platz hat ein Schloss`);
      const flaechen = [...m.fach, m.rechts, m.name];
      let ueber = 0; for (let i = 0; i < flaechen.length; i++) for (let k = i + 1; k < flaechen.length; k++) if (lap(flaechen[i], flaechen[k])) ueber++;
      ok(ueber === 0, `${tag}: Fächer, Name und rechte Spalte überlappen nicht`);
      ok(m.fach.every(f => f.b <= m.fuss.t + .5) && m.rechts.b <= m.fuss.t + .5, `${tag}: nichts ragt in den Holz-Footer`);
      ok(!/\?/.test(m.text), `${tag}: kein Fragezeichen`);
      ok(m.punkte === 6, `${tag}: drei gepunktete Linien mit Endpunkten`);
      ok(m.leiste === '' && !m.alteLeiste && m.amk, `${tag}: alte Itemleiste ist weg, unten kein leerer Platz, „Am Körper“ in der Kopfleiste`);
      ok(m.kerben.every(n => n >= 1), `${tag}: jedes Item zeigt seine Kerben`);
      if (fotos && (W === 1440 || j.id === 'fischer')) await p.screenshot({ path: path.join(AUS, `rucksack-${j.id}-${W}x${H}.png`) });
      await p.close();
    }
    // 3. Bedienung: Klick wählt aus, Ziehen tauscht, Grün/Rot
    {
      const p = await seite(1440, 900, 'rast');
      await p.keyboard.press('r'); await p.waitForTimeout(300);
      ok(await p.evaluate(() => !!KOE && !KOE.lesen), 'Taste R öffnet den Rucksack an der Rast');
      const bi = await p.evaluate(() => S.bag.findIndex(it => it && def(it).a === 'waffe'));
      await p.click(`#koerper [data-loc="bag:${bi}"]`); await p.waitForTimeout(150);
      ok(await p.evaluate(() => document.querySelectorAll('#koerper .kslot.ziel').length === 0), 'Klick wählt nur aus, es leuchten keine Ziele (Tauschen nur per Ziehen, Spieltest 2026-11-09)');
      ok(await p.evaluate(() => document.querySelectorAll('#koerper .krechts .karte.mini').length > 0), 'rechts stehen die Karten des gewählten Items');
      if (fotos) await p.screenshot({ path: path.join(AUS, 'rucksack-gewaehlt-1440x900.png') });
      const vorKlick = await p.evaluate(() => JSON.stringify([S.areas, S.bag.map(x => x && x.uid)]));
      await p.click('#koerper [data-loc="waffe:0"]'); await p.waitForTimeout(150);
      ok(await p.evaluate(v => JSON.stringify([S.areas, S.bag.map(x => x && x.uid)]) === v, vorKlick), 'Klick auf einen zweiten Platz tauscht nicht');
      await p.keyboard.press('Escape'); await p.keyboard.press('r'); await p.waitForTimeout(200);
      { const q = await (await p.$(`#koerper [data-loc="bag:${bi}"]`)).boundingBox(), z = await (await p.$('#koerper [data-loc="waffe:0"]')).boundingBox();
        await p.mouse.move(q.x + 10, q.y + 10); await p.mouse.down(); await p.mouse.move(q.x + 40, q.y + 40, { steps: 5 }); await p.mouse.move(z.x + 10, z.y + 10, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(200); }
      const d = await p.evaluate(() => ({ gr: document.querySelectorAll('#koerper .kdiff .gr').length, rt: document.querySelectorAll('#koerper .kdiff .rt').length, w0: def(S.areas.waffe[0]).a }));
      ok(d.gr > 0 && d.rt > 0 && d.w0 === 'waffe', `Tausch per Ziehen: Deck zeigt rein grün (${d.gr}) und raus rot (${d.rt})`);
      if (fotos) await p.screenshot({ path: path.join(AUS, 'rucksack-tausch-1440x900.png') });
      // Gesperrter Platz nimmt nichts
      const vor = await p.evaluate(() => JSON.stringify(S.areas)); await p.click('#koerper [data-loc="waffe:0"]'); await p.click('#koerper .kslot.zu'); await p.waitForTimeout(100);
      ok(await p.evaluate(v => JSON.stringify(S.areas) === v, vor), 'ein gesperrter Platz nimmt kein Item');
      await p.keyboard.press('Escape');
      // Ziehen mit der Maus: Talisman in den Rucksack
      await p.keyboard.press('r'); await p.waitForTimeout(200);
      const leer = await p.evaluate(() => S.bag.findIndex(x => !x));
      const a = await (await p.$('#koerper [data-loc="talisman:0"]')).boundingBox(), z = await (await p.$(`#koerper [data-loc="bag:${leer}"]`)).boundingBox();
      await p.mouse.move(a.x + 10, a.y + 10); await p.mouse.down(); await p.mouse.move(a.x + 40, a.y + 40, { steps: 5 }); await p.mouse.move(z.x + 10, z.y + 10, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(200);
      ok(await p.evaluate(i => !!S.bag[i] && def(S.bag[i]).a === 'talisman' && !S.areas.talisman[0], leer), 'Ziehen mit der Maus legt den Talisman in den Rucksack');
      await p.click('#koerper [data-act="rucksackZu"]'); await p.waitForTimeout(200);
      ok(await p.evaluate(() => KOE === null && !document.getElementById('koerper').classList.contains('an')), 'WEITER schließt den Rucksack');
      ok(await p.evaluate(() => typeof rsKlick === 'undefined' && typeof gearHtml === 'undefined'), 'alter Rucksackmodus und alte Itemleiste sind entfernt');
      await p.close();
    }
    // 4. Krämer: verkaufen aus dem Rucksack
    {
      const p = await seite(1440, 900, 'kraemer');
      await p.evaluate(() => { S.shop.art = 'gold'; rucksackAuf(); }); await p.waitForTimeout(200);
      const g0 = await p.evaluate(() => S.gold); await p.click('#koerper [data-loc="bag:0"]'); await p.waitForTimeout(100);
      const knopf = await p.$('#koerper [data-act="verkaufen"]'); ok(!!knopf, 'beim Krämer steht der Verkaufen-Knopf am gewählten Item');
      if (fotos) await p.screenshot({ path: path.join(AUS, 'rucksack-kraemer-1440x900.png') });
      if (knopf) { await knopf.click(); await p.waitForTimeout(150); }
      ok(await p.evaluate(g => S.gold > g && !S.bag[0], g0), 'Verkaufen bringt Gold und leert den Platz');
      await p.close();
    }
    // 5. Werkstatt: Werkbank im Footer
    {
      const p = await seite(1440, 900, 'werkstatt');
      await p.evaluate(() => rucksackAuf()); await p.waitForTimeout(200);
      ok(await p.$$eval('#koerper [data-loc^="bench:"]', e => e.length) === 2, 'in der Werkstatt hat der Rucksack zwei Werkbank-Plätze');
      await p.click('#koerper [data-loc="bag:0"]'); await p.click('#koerper [data-loc="bench:0"]'); await p.click('#koerper [data-loc="bag:1"]'); await p.click('#koerper [data-loc="bench:1"]'); await p.waitForTimeout(150);
      ok(await p.evaluate(() => !!S.bench[0] && !!S.bench[1]), 'zwei Items liegen auf der Werkbank');
      if (fotos) await p.screenshot({ path: path.join(AUS, 'rucksack-werkbank-1440x900.png') });
      await p.click('#koerper [data-act="rucksackZu"]'); await p.waitForTimeout(150);
      ok(await p.evaluate(() => !!document.querySelector('#panel [data-act="forge"]') && !!forgePreview()), 'die Werkstatt sieht die Werkbank und kann verschmelzen');
      await p.close();
    }
    // 6. Nach einem Fund öffnet er sich selbst und zeigt das neue Item
    {
      const p = await seite(1440, 900, 'kampf');
      await p.evaluate(() => { S.enemies.forEach(e => { e.hp = 0; }); checkVictory(10); }); await p.waitForTimeout(2600);
      const id = await p.evaluate(() => S.reward[0]); await p.click(`[data-take="${id}"]`); await p.waitForTimeout(400);
      const m = await p.evaluate(() => ({ an: !!KOE, zeig: KOE && KOE.zeig, item: KOE && KOE.zeig != null && koeItemByUid(KOE.zeig).it.id }));
      ok(m.an && m.item === id, `nach dem Fund öffnet sich der Rucksack mit dem neuen Item (${id})`);
      if (fotos) await p.screenshot({ path: path.join(AUS, 'rucksack-fund-1440x900.png') });
      await p.close();
    }
    // 7. Im Kampf nur lesend
    {
      const p = await seite(1440, 900, 'kampf');
      await p.keyboard.press('r'); await p.waitForTimeout(300);
      const m = await p.evaluate(MESSEN);
      ok(m.an && m.lesen && m.dataLoc === 0, 'im Kampf öffnet R den Rucksack nur lesend (keine verschiebbaren Plätze)');
      await p.click('#koerper [data-kzeig]'); await p.waitForTimeout(100);
      ok(await p.evaluate(() => document.querySelectorAll('#koerper .krechts .karte.mini').length > 0), 'im Kampf lassen sich Items ansehen');
      if (fotos) await p.screenshot({ path: path.join(AUS, 'rucksack-kampf-lesend-1440x900.png') });
      await p.keyboard.press('r'); await p.waitForTimeout(200);
      ok(await p.evaluate(() => KOE === null && S.phase === 'fight'), 'R schließt ihn wieder, der Kampf läuft weiter');
      await p.close();
    }
    ok(konsole.length === 0, 'keine Konsolenfehler' + (konsole.length ? ': ' + konsole.slice(0, 3).join(' | ') : ''));
    await b.close();
  } finally { srv.kill(); }
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
