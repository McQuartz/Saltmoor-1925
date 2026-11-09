// Auftrag 3, M0: schreibt alle bestehenden Texte mit Fundstelle nach docs/auftrag-3/texte-basis.json.
// node tools/texte-basis.js
// Erfasst: jedes String-Feld aus prototype/data/*.json und prototype/data/biome/*.json, das Text ist (Buchstaben und
// mindestens ein Leerzeichen, oder ein Anzeige-Feld wie n/t/titel), außer Schlüsseln mit „_“ (Doku) und reinen Dateien
// ohne Spieltext (balance, builds, audio, ideas). Dazu die festen Texte aus prototype/js/ui/*.js (Textstücke in Vorlagen
// und Zeichenketten mit Leerzeichen). Prüfung: tools/texte-pruefen.js.
const fs = require('fs'), path = require('path');
const T = require('./texte-lib');
const daten = T.datenTexte();
const ui = T.uiTexte();
const aus = { erzeugt: new Date().toISOString().slice(0, 10), basis: 'main 7e1497e (vor Auftrag 3)', daten, ui };
const ziel = path.join(__dirname, '..', 'docs', 'auftrag-3', 'texte-basis.json');
fs.writeFileSync(ziel, JSON.stringify(aus, null, 0).replace(/\},\{/g, '},\n{').replace(/","/g, '",\n"'));
console.log(`Texte aus Daten: ${daten.length}, feste Texte aus js/ui: ${ui.length} → ${path.relative(process.cwd(), ziel)}`);
