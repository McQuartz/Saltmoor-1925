// Baut die Ereignisbilder (160 × 90) aus tools/ereignisse/bilder/<biom>.js.
//   node tools/ereignisse/bauen.js                    alle Skripte
//   node tools/ereignisse/bauen.js hafen alle          nur diese Biom-Dateien
//   node tools/ereignisse/bauen.js hafen_netze         nur dieses Ereignis
// Schreibt prototype/assets/ereignisse/<id>.png und index.json (Liste aller vorhandenen PNGs),
// dazu Vorschauen ×3 nach tools/ereignisse/vorschau/ (Arbeitsablage, nicht im Repo).
// Am Ende: Abdeckung je Biom (welche Ereignisse noch kein Bild haben).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const W = L.WURZEL;
const ZIEL = path.join(W, 'prototype/assets/ereignisse');
const VORSCHAU = path.join(__dirname, 'vorschau');
const BILDER = path.join(__dirname, 'bilder');

// Alle Ereignisse des Spiels: data/events.json und events der Biom-Pakete (biom wie im Spiel gesetzt)
function ereignisDaten() {
  const lies = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
  const out = {};
  for (const e of lies(path.join(W, 'prototype/data/events.json')) || []) if (e.id) out[e.id] = { biom: e.biom || 'alle', ...e };
  const bd = path.join(W, 'prototype/data/biome');
  for (const f of fs.readdirSync(bd)) {
    if (f === 'index.json' || !f.endsWith('.json')) continue;
    const p = lies(path.join(bd, f)); if (!p) continue;
    for (const e of p.events || []) if (e.id) out[e.id] = { biom: p.ergaenzt || p.id, ...e, paket: p.id };
  }
  return out;
}
// Skripte: bilder/<datei>.js exportiert { biom, bilder: { <ereignis-id>(K) { … } } }
function skripte() {
  if (!fs.existsSync(BILDER)) return [];
  return fs.readdirSync(BILDER).filter(f => f.endsWith('.js')).sort().map(f => {
    const p = path.join(BILDER, f); delete require.cache[require.resolve(p)];
    const def = require(p); return { datei: f, biom: def.biom || f.slice(0, -3), bilder: def.bilder || {} };
  });
}

function vorschau(datei, rgba, s = 3) {
  const bild = L.S.leinwand(L.BW * s + 8, L.BH * s + 8, '#0a0806');
  L.S.einsetzen(bild, rgba, L.BW, L.BH, 4, 4, s);
  L.S.pngSchreiben(datei, bild.W, bild.H, bild.data);
}

function eins(id, biom, fn, daten) {
  const d = daten[id];
  // Palette nach dem Biom, in dem das Ereignis wirklich spielt (Ergänzungspakete: das alte Biom)
  const K = L.kontext(id, (d && d.biom) || biom);
  fn(K, d || {});
  const rgba = L.fertig(K);
  L.S.pngSchreiben(path.join(ZIEL, id + '.png'), L.BW, L.BH, rgba);
  vorschau(path.join(VORSCHAU, id + '.png'), rgba);
  return { farben: L.farbenZaehlen(rgba), ...L.helligkeit(rgba) };
}

function index() {
  const ids = fs.readdirSync(ZIEL).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).sort();
  fs.writeFileSync(path.join(ZIEL, 'index.json'), JSON.stringify({ _doc: 'Ereignisbilder 160×90 (tools/ereignisse/bauen.js). Datei: assets/ereignisse/<id>.png. Liste aller vorhandenen IDs; ohne Eintrag zeigt der Ereignis-Zettel kein Bild.', ereignisse: ids }, null, 1) + '\n');
  return ids;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  for (const d of [ZIEL, VORSCHAU]) fs.mkdirSync(d, { recursive: true });
  const daten = ereignisDaten(), sk = skripte();
  const alle = []; for (const s of sk) for (const [id, fn] of Object.entries(s.bilder)) alle.push({ id, biom: s.biom, fn, datei: s.datei });
  let wahl = alle;
  if (args.length) {
    wahl = alle.filter(b => args.includes(b.id) || args.includes(b.biom) || args.includes(b.datei.slice(0, -3)));
    const fehlt = args.filter(a => !alle.some(b => b.id === a || b.biom === a || b.datei.slice(0, -3) === a)); if (fehlt.length) console.log('Kein Skript für:', fehlt.join(' '));
  }
  let fehler = 0;
  for (const b of wahl) {
    if (!daten[b.id]) console.log(`Warnung: ${b.id} (${b.datei}) ist kein Ereignis in den Daten.`);
    try { const s = eins(b.id, b.biom, b.fn, daten); console.log(`${b.id.padEnd(26)} ${String(s.farben).padStart(3)} Farben · hell ${(s.hell * 100).toFixed(1)} % · dunkel ${(s.dunkel * 100).toFixed(0)} %`); }
    catch (e) { fehler++; console.log('FEHLER', b.id, e.stack.split('\n').slice(0, 4).join(' | ')); }
  }
  const ids = index();
  // Abdeckung je Biom
  const jeBiom = {}; for (const [id, d] of Object.entries(daten)) { const k = d.biom || 'alle'; (jeBiom[k] = jeBiom[k] || { n: 0, mit: 0 }).n++; if (ids.includes(id)) jeBiom[k].mit++; }
  console.log(`gebaut: ${wahl.length}; vorhanden: ${ids.length} von ${Object.keys(daten).length} Ereignissen; Fehler: ${fehler}`);
  console.log('Abdeckung: ' + Object.entries(jeBiom).sort().map(([k, v]) => `${k} ${v.mit}/${v.n}`).join(' · '));
  if (fehler) process.exitCode = 1;
}
module.exports = { ereignisDaten, skripte, eins, index, ZIEL };
