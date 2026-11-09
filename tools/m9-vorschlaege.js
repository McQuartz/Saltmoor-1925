#!/usr/bin/env node
'use strict';
// Prüft die drei M9-Vorschlagslisten in docs/auftrag-3/m9-vorschlaege/ gegen die Spieldaten.
// Ändert nichts. Aufruf: node tools/m9-vorschlaege.js
// Exit 1 bei mindestens einem Fehler.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA = path.join(ROOT, 'prototype', 'data');
const VORSCHLAG = path.join(ROOT, 'docs', 'auftrag-3', 'm9-vorschlaege');
const ART = ['mensch', 'veraendert', 'nachahmer', 'tiefe'];
const MENSCH_ART = ['mensch', 'veraendert'];
// Akt-Feld in den Daten ist 0-basiert (0 = Akt I). Akt II-IV = Daten-Feld 1-3.
const AKT_DATEN_ZIEL = [1, 2, 3];

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
let fehler = 0;
const fehl = (msg) => { fehler++; console.log('FEHLER: ' + msg); };

// ---------- Gegner-Universum: foes.json + alle biome/*.json (Feld foes) ----------
const foes = {};
const quelleVon = {};
for (const [id, f] of Object.entries(readJson(path.join(DATA, 'foes.json')))) {
  foes[id] = f;
  quelleVon[id] = 'foes.json';
}
const biomDir = path.join(DATA, 'biome');
const biomDateien = fs.readdirSync(biomDir).filter((n) => n.endsWith('.json') && n !== 'index.json').sort();
for (const n of biomDateien) {
  const d = readJson(path.join(biomDir, n));
  for (const [id, f] of Object.entries(d.foes || {})) {
    if (foes[id]) fehl(`Gegner-ID ${id} kommt doppelt vor (${quelleVon[id]} und biome/${n})`);
    foes[id] = f;
    quelleVon[id] = 'biome/' + n;
  }
}
const alleIds = Object.keys(foes);

// ---------- Biome mit Akt und effektiver Gegnerliste ----------
// Basis: biomes.json (7 alte Biome). Neue Biome: biome/<id>.json mit Feld akt und biom.gegner.
// Ergänzungspakete (*_plus.json, Feld ergaenzt) werden auf das Basisbiom angewendet.
const bioms = {};
const bj = readJson(path.join(DATA, 'biomes.json'));
for (const [id, b] of Object.entries(bj)) {
  if (id === '_doc') continue;
  bioms[id] = { akt: b.akt, gegner: [...(b.gegner || [])], quelle: 'biomes.json' };
}
for (const n of biomDateien) {
  const d = readJson(path.join(biomDir, n));
  if (d.ergaenzt) continue;
  if (!d.biom || typeof d.biom !== 'object') continue;
  bioms[d.id] = { akt: d.akt, gegner: [...(d.biom.gegner || [])], quelle: 'biome/' + n };
}
for (const n of biomDateien) {
  const d = readJson(path.join(biomDir, n));
  if (!d.ergaenzt) continue;
  const ziel = bioms[d.ergaenzt];
  if (!ziel) { fehl(`Ergänzungspaket ${n} verweist auf unbekanntes Biom ${d.ergaenzt}`); continue; }
  for (const id of d.gegner_weg || []) ziel.gegner = ziel.gegner.filter((g) => g !== id);
  for (const id of d.gegner_dazu || []) ziel.gegner.push(id);
}
for (const [bid, b] of Object.entries(bioms)) {
  for (const g of b.gegner) if (!foes[g]) fehl(`Biom ${bid} listet Gegner ${g}, der nicht definiert ist`);
}

// ---------- 1. art.json ----------
console.log('=== 1. art.json ===');
const art = readJson(path.join(VORSCHLAG, 'art.json'));
const fehlendeArt = alleIds.filter((id) => !art[id]);
const zuvielArt = Object.keys(art).filter((id) => !foes[id]);
for (const id of fehlendeArt) fehl(`art.json: Gegner ${id} fehlt`);
for (const id of zuvielArt) fehl(`art.json: ${id} ist kein Gegner in den Daten`);
for (const [id, e] of Object.entries(art)) {
  if (!ART.includes(e.art)) fehl(`art.json: ${id} hat ungültige art "${e.art}"`);
  if (!e.grund || typeof e.grund !== 'string') fehl(`art.json: ${id} ohne grund`);
}
const verteilung = {};
for (const a of ART) verteilung[a] = 0;
for (const id of alleIds) if (art[id] && ART.includes(art[id].art)) verteilung[art[id].art]++;
console.log(`Gegner gesamt (Daten): ${alleIds.length}`);
console.log(`Einträge in art.json: ${Object.keys(art).length}`);
console.log(`fehlend: ${fehlendeArt.length}, überzählig: ${zuvielArt.length}`);
console.log('Verteilung art: ' + ART.map((a) => `${a}=${verteilung[a]}`).join(' '));
if (Object.keys(art).length !== alleIds.length) fehl('art.json: Anzahl der Einträge stimmt nicht mit Gegner gesamt überein');

// ---------- 2. asche.json ----------
console.log('');
console.log('=== 2. asche.json (Akt II, III, IV) ===');
const asche = readJson(path.join(VORSCHLAG, 'asche.json'));
const zielBioms = Object.entries(bioms).filter(([, b]) => AKT_DATEN_ZIEL.includes(b.akt));
const erwarteteBioms = zielBioms.map(([id]) => id).sort();
const kandListe = {};
const kandidatenLeer = (bid) => !(kandListe[bid] || []).length;
for (const [bid, b] of zielBioms) {
  const kandidaten = b.gegner.filter((g) => foes[g] && foes[g].rang === 'normal' && art[g] && MENSCH_ART.includes(art[g].art));
  kandListe[bid] = kandidaten;
  console.log(`Biom ${bid} (Akt ${b.akt + 1}): Kandidaten [${kandidaten.join(', ')}]`);
}
const proBiom = {};
for (const e of asche) {
  proBiom[e.biom] = (proBiom[e.biom] || 0) + 1;
  const b = bioms[e.biom];
  if (!b) { fehl(`asche.json: Biom ${e.biom} unbekannt`); continue; }
  if (!AKT_DATEN_ZIEL.includes(b.akt)) fehl(`asche.json: Biom ${e.biom} liegt nicht in Akt II-IV`);
  if (e.akt !== b.akt + 1) fehl(`asche.json: ${e.gegner} in ${e.biom} hat akt ${e.akt}, Biom liegt in Akt ${b.akt + 1}`);
  if (!b.gegner.includes(e.gegner)) fehl(`asche.json: ${e.gegner} gehört nicht zur Gegnerliste von ${e.biom}`);
  if (!foes[e.gegner] || foes[e.gegner].rang !== 'normal') fehl(`asche.json: ${e.gegner} ist nicht rang "normal"`);
  if (!art[e.gegner] || !MENSCH_ART.includes(art[e.gegner].art)) fehl(`asche.json: ${e.gegner} hat art ${art[e.gegner] && art[e.gegner].art}, verlangt mensch oder veraendert`);
  if (!e.grund) fehl(`asche.json: ${e.gegner} ohne grund`);
}
for (const bid of erwarteteBioms) {
  const n = proBiom[bid] || 0;
  if (n !== 1 && !(n === 0 && kandidatenLeer(bid))) fehl(`asche.json: Biom ${bid} hat ${n} Einträge, verlangt genau 1 (0 nur ohne Kandidaten)`);
}
for (const bid of Object.keys(proBiom)) if (!erwarteteBioms.includes(bid)) fehl(`asche.json: Biom ${bid} gehört nicht zu Akt II-IV`);
console.log(`Einträge: ${asche.length}, Biome Akt II-IV: ${erwarteteBioms.length}`);
console.log('Je Biom: ' + erwarteteBioms.map((bid) => `${bid}=${proBiom[bid] || 0}`).join(' '));

// ---------- 3. tiefe.json ----------
console.log('');
console.log('=== 3. tiefe.json ===');
const tiefe = readJson(path.join(VORSCHLAG, 'tiefe.json'));
if (tiefe.length < 8 || tiefe.length > 12) fehl(`tiefe.json: ${tiefe.length} Wahlen, verlangt 8 bis 12`);
const schluessel = new Set();
for (const t of tiefe) {
  const k = `${t.datei}|${t.ereignis}|${t.wahl}`;
  if (schluessel.has(k)) fehl(`tiefe.json: Wahl ${k} doppelt`);
  schluessel.add(k);
  const datei = path.join(DATA, t.datei);
  if (!fs.existsSync(datei)) { fehl(`tiefe.json: Datei ${t.datei} fehlt`); continue; }
  const raw = readJson(datei);
  const liste = Array.isArray(raw) ? raw : (raw.events || []);
  const ev = liste.find((e) => e.id === t.ereignis);
  if (!ev) { fehl(`tiefe.json: Ereignis ${t.ereignis} steht nicht in ${t.datei}`); continue; }
  const w = (ev.o || [])[t.wahl];
  if (!w) { fehl(`tiefe.json: ${t.ereignis} hat keine Wahl mit Index ${t.wahl}`); continue; }
  if (w.l !== t.l) fehl(`tiefe.json: ${t.ereignis} Wahl ${t.wahl}: Text weicht ab. Daten: "${w.l}"`);
  if (!t.grund) fehl(`tiefe.json: ${t.ereignis} ohne grund`);
  console.log(`${t.ereignis} [${t.datei} #${t.wahl}] ${w.l === t.l ? 'Text gleich' : 'Text ANDERS'}`);
}
console.log(`Wahlen: ${tiefe.length}`);

// ---------- Ergebnis ----------
console.log('');
if (fehler === 0) {
  console.log('ERGEBNIS: alle drei Kriterien erfüllt (0 Fehler)');
} else {
  console.log(`ERGEBNIS: ${fehler} Fehler`);
  process.exitCode = 1;
}
