// Auftrag 3: prüft, dass kein bestehender Text verändert wurde und neue Texte als Entwurf markiert sind.
// node tools/texte-pruefen.js [--neu]   (--neu listet zusätzlich alle neuen Texte mit Fundstelle)
// 1. Jeder Text aus docs/auftrag-3/texte-basis.json ist noch da und Wort für Wort gleich:
//    Daten an derselben Stelle (Datei + Pfad, Array-Einträge über ihre id). Ist der Eintrag umgezogen, reicht derselbe Text
//    im selben Feld irgendwo in derselben Datei. Feste UI-Texte irgendwo in prototype/js/ (die Oberfläche wird in Module geteilt).
// 2. Jeder neue Text in den Daten (nicht in der Basis) hängt an einem Objekt mit "entwurf": true (oder einem Vorfahren davon).
// Bricht mit Exitcode 1 und der Liste der Abweichungen ab.
const fs = require('fs'), path = require('path');
const T = require('./texte-lib');
const B = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'auftrag-3', 'texte-basis.json'), 'utf8'));
const jetzt = T.datenTexte();
const anStelle = new Map(jetzt.map(x => [x.f + '|' + x.p, x.s]));
const feldDatei = new Set(jetzt.map(x => x.f + '|' + x.p.replace(/.*\./, '') + '|' + x.s));
const fehler = [];
for (const x of B.daten) {
  const s = anStelle.get(x.f + '|' + x.p);
  if (s === x.s) continue;
  if (feldDatei.has(x.f + '|' + x.p.replace(/.*\./, '') + '|' + x.s)) continue;
  fehler.push(`GEÄNDERT/FEHLT ${x.f} ${x.p}\n   war: ${x.s}\n   ist: ${s === undefined ? '(fehlt)' : s}`);
}
// UI-Texte: alle JS-Dateien des Spiels zusammen
function alleJs(d) { let o = ''; for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) { if (f.name !== 'vendor') o += alleJs(p); } else if (f.name.endsWith('.js')) o += fs.readFileSync(p, 'utf8') + '\n'; } return o; }
const js = alleJs(path.join(T.P, 'js'));
// Bewusst entfernte Oberflächen-Texte (alte Anzeigen, die der Auftrag ersetzt), mit Grund: docs/auftrag-3/texte-entfernt.json
const ENTF = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'auftrag-3', 'texte-entfernt.json'), 'utf8')).entfernt || []; } catch (e) { return []; } })();
const entfernt = new Set(ENTF.map(x => x.s ?? x.text));
for (const x of B.ui) if (!js.includes(x.s) && !entfernt.has(x.s)) fehler.push(`UI-TEXT FEHLT (war in ${x.f}): ${x.s}`);
// Neue Texte: Entwurf?
const basisSet = new Set(B.daten.map(x => x.f + '|' + x.s));
const neu = [];
for (const f of T.datenDateien()) {
  const j = JSON.parse(fs.readFileSync(path.join(T.P, 'data', f), 'utf8'));
  T.lauf2(j, '', null, [], (p, k, s, vorf) => {
    if (basisSet.has(f + '|' + s)) return;
    const ent = vorf.some(o => o && !Array.isArray(o) && o.entwurf === true);
    neu.push({ f, p, s, ent });
    if (!ent) fehler.push(`NEU OHNE ENTWURF ${f} ${p}: ${s.slice(0, 90)}`);
  });
}
if (process.argv.includes('--neu')) for (const x of neu) console.log(`neu ${x.f} ${x.p}: ${x.s.slice(0, 100)}`);
if (fehler.length) { console.log(fehler.join('\n')); console.log(`${fehler.length} Abweichungen (Basis: ${B.daten.length} Datentexte, ${B.ui.length} UI-Texte, neu: ${neu.length}).`); process.exit(1); }
console.log(`Texte unverändert: ${B.daten.length} aus Daten, ${B.ui.length} aus der Oberfläche. Neue Texte: ${neu.length}, alle als Entwurf markiert.`);
