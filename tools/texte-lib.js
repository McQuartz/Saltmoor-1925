// Gemeinsame Text-Erfassung für tools/texte-basis.js und tools/texte-pruefen.js (Auftrag 3, 01-regeln.md Abschnitt 5).
const fs = require('fs'), path = require('path');
const P = path.join(__dirname, '..', 'prototype');
// Dateien ohne Spieltext (Zahlen, Profile, Klangdaten, Ideen-Sammlung)
const OHNE = new Set(['balance.json', 'builds.json', 'audio.json', 'ideas.json', 'biome/index.json']);
// Felder, die im Spiel angezeigt werden, auch wenn sie kein Leerzeichen haben (Namen, Titel)
const ANZEIGE = new Set(['n', 't', 'd', 'l', 'titel', 'text', 'relief', 'zeile', 'ort', 'ausrede', 'wahrheit', 'uebergang', 'flavor', 'hint',
  'beute_satz', 'kurz', 'zeit', 'anreise', 'ankunft_bild', 'knopf', 'karte', 'bild', 'faehigkeit_t', 'set', 'why']);
function datenDateien() {
  const o = fs.readdirSync(path.join(P, 'data')).filter(f => f.endsWith('.json')).map(f => f);
  for (const f of fs.readdirSync(path.join(P, 'data', 'biome')).filter(f => f.endsWith('.json'))) o.push('biome/' + f);
  return o.filter(f => !OHNE.has(f)).sort();
}
const istText = (s, key) => typeof s === 'string' && /[A-Za-zÄÖÜäöüß]/.test(s) && (/\s/.test(s) || ANZEIGE.has(key)) && !/^(assets|js|data)\//.test(s);
// Läuft durch ein JSON und ruft f(pfad, schluessel, wert, vorfahren) für jeden Text auf
function lauf(o, pfad, key, vorf, f) {
  if (typeof o === 'string') { if (istText(o, key)) f(pfad, key, o, vorf); return; }
  if (!o || typeof o !== 'object') return;
  const v2 = [...vorf, o];
  if (Array.isArray(o)) { o.forEach((x, i) => lauf(x, pfad + '[' + i + ']', key, v2, f)); return; }
  for (const k of Object.keys(o)) { if (k.startsWith('_')) continue; lauf(o[k], pfad + '.' + k, k, v2, f); }
}
// Stabiler Pfad: Array-Elemente mit id werden über die id adressiert, damit neue Einträge nichts verschieben
function lauf2(o, pfad, key, vorf, f) {
  if (typeof o === 'string') { if (istText(o, key)) f(pfad, key, o, vorf); return; }
  if (!o || typeof o !== 'object') return;
  const v2 = [...vorf, o];
  if (Array.isArray(o)) { o.forEach((x, i) => lauf2(x, pfad + (x && typeof x === 'object' && x.id ? '[#' + x.id + ']' : '[' + i + ']'), key, v2, f)); return; }
  for (const k of Object.keys(o)) { if (k.startsWith('_')) continue; lauf2(o[k], pfad + '.' + k, k, v2, f); }
}
function datenTexte() {
  const out = [];
  for (const f of datenDateien()) {
    const j = JSON.parse(fs.readFileSync(path.join(P, 'data', f), 'utf8'));
    lauf2(j, '', null, [], (p, k, s) => out.push({ f, p, s }));
  }
  return out;
}
// Feste Texte in js/ui: Textstücke zwischen Tags in Vorlagen und Zeichenketten mit Buchstaben und Leerzeichen
function uiDateien() { const d = path.join(P, 'js', 'ui'); return fs.readdirSync(d).filter(f => f.endsWith('.js')).map(f => 'js/ui/' + f); }
function uiStuecke(code) {
  const o = new Set();
  // Zeichenketten in '…' und "…"
  for (const m of code.matchAll(/'((?:[^'\\\n]|\\.){4,})'|"((?:[^"\\\n]|\\.){4,})"/g)) { const s = m[1] || m[2]; if (/[a-zäöüß]{3,}/i.test(s) && /\s/.test(s) && !/[{}();=<>]/.test(s)) o.add(s.trim()); }
  // Text zwischen Tags in Vorlagen: >Text<
  for (const m of code.matchAll(/>([^<>`$]{4,}?)</g)) { const s = m[1].trim(); if (/[A-Za-zÄÖÜäöüß]{3,}/.test(s) && /\s/.test(s) && !/[{}();=]/.test(s)) o.add(s); }
  return [...o];
}
// keine Spieltexte: CSS-Selektoren, Klassenlisten, Schriftangaben
const keinText = s => /^[#.]/.test(s) || /\d+px/.test(s) || /^[a-z0-9_-]+( [a-z0-9_-]+){0,3}$/.test(s);
function uiTexte() {
  const out = [];
  for (const f of uiDateien()) { const c = fs.readFileSync(path.join(P, f), 'utf8'); for (const s of uiStuecke(c)) if (!keinText(s)) out.push({ f, s }); }
  return out;
}
module.exports = { P, datenDateien, datenTexte, uiTexte, uiDateien, lauf2, istText };
