// Baut Item-Icons und Handgriff-Bilder.
//   node tools/icons/bauen.js                 alle Items und Handgriffe
//   node tools/icons/bauen.js harpoon revolver  nur diese (Items oder Handgriffe, je nachdem wo das Skript liegt)
//   node tools/icons/bauen.js --items | --handgriffe
// Schreibt prototype/assets/items/<id>.png, prototype/assets/handgriffe/<id>.png und jeweils index.json
// (Liste aller vorhandenen PNGs), dazu Vorschauen ×4 nach tools/icons/vorschau/ (Arbeitsablage).
'use strict';
const fs = require('fs');
const path = require('path');
const L = require('./lib');

const W = L.WURZEL;
const ZIEL = { items: path.join(W, 'prototype/assets/items'), handgriffe: path.join(W, 'prototype/assets/handgriffe'), karten: path.join(W, 'prototype/assets/karten') };
const VORSCHAU = path.join(__dirname, 'vorschau');

// Item-Daten: items.json und alle Biom-Pakete (Stoffe und Seltenheit kommen von dort)
function itemDaten() {
  const out = {};
  const lies = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
  Object.assign(out, lies(path.join(W, 'prototype/data/items.json')) || {});
  const bd = path.join(W, 'prototype/data/biome');
  for (const f of fs.existsSync(bd) ? fs.readdirSync(bd) : []) { if (f === 'index.json' || !f.endsWith('.json')) continue; const p = lies(path.join(bd, f)); if (p && p.items) for (const [k, v] of Object.entries(p.items)) if (!out[k]) out[k] = v; }
  return out;
}
function hgDaten() {
  const out = {}; const lies = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { return null; } };
  const h = lies(path.join(W, 'prototype/data/handgriffe.json')); Object.assign(out, (h && h.handgriffe) || {});
  const bd = path.join(W, 'prototype/data/biome');
  for (const f of fs.existsSync(bd) ? fs.readdirSync(bd) : []) { if (f === 'index.json' || !f.endsWith('.json')) continue; const p = lies(path.join(bd, f)); if (p && p.handgriffe) for (const [k, v] of Object.entries(p.handgriffe)) if (!out[k]) out[k] = v; }
  return out;
}
const skripte = art => { const d = path.join(__dirname, art); return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.js')).map(f => f.slice(0, -3)) : []; };

function vorschau(datei, b, s = 4) {
  const bild = L.S.leinwand(b.W * s + 8, b.H * s + 8, '#0a0806');
  L.S.einsetzen(bild, b.rgba, b.W, b.H, 4, 4, s);
  L.S.pngSchreiben(datei, bild.W, bild.H, bild.data);
}

function eins(art, id, daten) {
  const f = path.join(__dirname, art, id + '.js');
  delete require.cache[require.resolve(f)];
  const def = require(f);
  const d = daten[id] || {};
  // Handgriffe haben keinen eigenen Stoff: der Akzent kommt aus 'stoffe' (Gewichtung) oder dem Skript
  const st = art !== 'handgriffe' ? (d.st || def.st || []) : (def.st || L.FAMILIE_ST[d.build] || d.stoffe || []);
  const rar = art !== 'handgriffe' ? (d.rar || def.rar || 'gewoehnlich') : 'gewoehnlich';
  const b = L.bauen(def, { st, rar });
  if (b.W !== 48 || b.H !== (art === 'handgriffe' ? 32 : 48)) throw new Error(`${id}: falsche Größe ${b.W}×${b.H}`);
  L.S.pngSchreiben(path.join(ZIEL[art], id + '.png'), b.W, b.H, b.rgba);
  vorschau(path.join(VORSCHAU, art + '-' + id + '.png'), b);
  return b;
}

function index(art) {
  const ids = fs.readdirSync(ZIEL[art]).filter(f => f.endsWith('.png')).map(f => f.slice(0, -4)).sort();
  const doc = art === 'items'
    ? 'Item-Icons 48×48 (tools/icons/bauen.js). Datei: assets/items/<id>.png. Liste aller vorhandenen IDs.'
    : 'Handgriff-Bilder 48×32 (tools/icons/bauen.js). Datei: assets/handgriffe/<id>.png. Liste aller vorhandenen IDs.';
  fs.writeFileSync(path.join(ZIEL[art], 'index.json'), JSON.stringify({ _doc: doc, [art]: ids }, null, 1) + '\n');
  return ids;
}

if (require.main === module) {
  const args = process.argv.slice(2);
  for (const d of [...Object.values(ZIEL), VORSCHAU]) fs.mkdirSync(d, { recursive: true });
  const it = itemDaten(), hg = hgDaten();
  const sI = skripte('items'), sH = skripte('handgriffe'), sK = skripte('karten');
  let wahlI = sI, wahlH = sH, wahlK = sK;
  const namen = args.filter(a => !a.startsWith('--'));
  if (args.includes('--items')) { wahlH = []; wahlK = []; } if (args.includes('--handgriffe')) { wahlI = []; wahlK = []; }
  if (namen.length) { wahlI = sI.filter(i => namen.includes(i)); wahlH = sH.filter(i => namen.includes(i)); wahlK = sK.filter(i => namen.includes(i)); const fehlt = namen.filter(n => !sI.includes(n) && !sH.includes(n) && !sK.includes(n)); if (fehlt.length) console.log('Kein Skript für:', fehlt.join(' ')); }
  let fehler = 0;
  for (const id of wahlI) { try { eins('items', id, it); } catch (e) { fehler++; console.log('FEHLER item', id, e.stack.split('\n').slice(0, 3).join(' | ')); } }
  for (const id of wahlH) { try { eins('handgriffe', id, hg); } catch (e) { fehler++; console.log('FEHLER handgriff', id, e.stack.split('\n').slice(0, 3).join(' | ')); } }
  for (const id of wahlK) { try { eins('karten', id, {}); } catch (e) { fehler++; console.log('FEHLER karte', id, e.stack.split('\n').slice(0, 3).join(' | ')); } }
  const ii = index('items'), hi = index('handgriffe');
  // Abdeckung: welche Items/Handgriffe aus den Daten haben noch kein Bild?
  const ohneI = Object.keys(it).filter(k => !/^m\d/.test(k) && !ii.includes(k));
  const ohneH = Object.keys(hg).filter(k => !hi.includes(k));
  console.log(`gebaut: ${wahlI.length} Items, ${wahlH.length} Handgriffe; vorhanden: ${ii.length} Items, ${hi.length} Handgriffe; Fehler: ${fehler}`);
  if (ohneI.length) console.log('Items ohne Icon:', ohneI.join(' '));
  if (ohneH.length) console.log('Handgriffe ohne Bild:', ohneH.join(' '));
  if (fehler) process.exitCode = 1;
}
module.exports = { itemDaten, hgDaten, skripte, eins, index, ZIEL };
