# Prüfen

Was in Auftrag 1 und 2 an Prüfungen gebaut wurde, läuft weiter (`node tools/test-run.js`, `test-deckbau.js`, `test-ereignisse.js`, `test-vorschau.js`, `test-meta.js`, `balance.js`, `build-bots.js`, `biom-test.js`, `sprites/pruefen.js`, `icons/pruefen.js`, `musik-pruefen.js`, `selbst-spielen.js`). Alle müssen nach jedem Meilenstein grün sein. Dazu kommt das Folgende.

## 1. Basis-Messung in M0

Bevor du etwas änderst, auf dem unveränderten `main`:

- alle Tests laufen lassen, Ausgabe nach `docs/auftrag-3/bilder/M0/basis-tests.txt`,
- `balance.js 100` und `build-bots.js 50`, Ergebnisse als Tabelle in `fortschritt.md` („Basis“),
- Bildschirmfotos von Kampf, Wegwahl, Rucksackmodus, Belohnung, Wandbild in 1440×900 nach `bilder/M0/`,
- **Text-Basis:** `tools/texte-basis.js` schreibt alle bestehenden Texte (jedes String-Feld, das im Spiel angezeigt wird, aus allen `data/*.json` und `data/biome/*.json`, dazu die festen Texte in `js/ui/*`) mit Fundstelle nach `docs/auftrag-3/texte-basis.json`.

## 2. Neue Werkzeuge

| Werkzeug | Prüft | ab |
|---|---|---|
| `tools/texte-pruefen.js` | Jeder Text aus `texte-basis.json` ist noch da und Wort für Wort gleich. Neue Texte haben `entwurf: true`. Bricht mit Liste der Abweichungen ab | M0 |
| `tools/test-welle1.js` | die sieben Fixes ([04-welle-1.md](04-welle-1.md)) | M1 |
| `tools/ui-fotos.js <ansicht>` | Bildschirmfotos einer Ansicht in 1280×720, 1440×900, 1920×1080, mit festem Seed | M2 |
| `tools/test-oberflaeche.js` | DOM-Prüfungen: kein Fragezeichen für Unbekanntes, keine Überlappung von Balken, Karten und Plaketten (Bounding-Boxen), Stoff-Baum zeigt dieselben Reaktionen wie `reactionsFor`, keine Kamera im Kampf, Peilkarte: zwei Ebenen sichtbar, Rest Nebel, Einsturz verborgen | M2 |
| `tools/test-karte.js` | Netz jedes Akts für 200 Seeds: alle Pfade führen zum Wächter, keine Kreuzung, Regeln aus `run.json` eingehalten, Folgen höchstens zwei je Akt, Speicherstand mit Netz lädt | M3 |
| `tools/test-biegungen.js` | je Biegung ein fester Zug mit erwartetem Ergebnis, Schalter aus = Verhalten wie `main` | M5 |
| `tools/test-kern.js` | Hören statt sehen, Blick, Farbe (siehe [06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 8) | M6 |
| `tools/kern-vergleich.js` | Bots mit allen Kern-Systemen aus, einzeln an, alle an; Tabelle | M5 |
| `tools/test-begegnungen.js`, Erweiterung von `test-meta.js` | Begegnungen, Meta, Würze, Run-Zettel und Obergrenzen über 100 Seeds | M9 |
| `tools/test-speicher.js` | ein Speicherstand und ein Meta-Stand von `main` (vor Auftrag 3) laden ohne Fehler, alle neuen Zustände überleben Speichern und Laden | M3, dann jeder Meilenstein |

## 3. Die Bots müssen die neuen Systeme benutzen

Ein Bot, der eine Mechanik ignoriert, misst nur, wie sehr sie stört. Darum:

- Der Autospieler und die Build-Bots bekommen in M5 bis M11 je eine einfache, ehrliche Strategie für jedes neue System (Biegung beim Ordnen der Hand berücksichtigen, Blick nach Leben entscheiden, Farbe binden, wenn Salz auf der Hand ist, Asche rufen, wenn Salz und Feuer da sind, Erbe annehmen, Fehlzeit nie annehmen außer im eigenen Testlauf).
- Stumme Gegner liest der Bot über dieselbe Schnittstelle, aus der die Musik ihre Einsätze nimmt, nicht direkt aus dem Muster.
- Die Peilkarte wählt der Bot über das Netz, nicht über die alte Wegwahl.
- `FAST` überspringt nur Wartezeiten und Animationen, nie Logik.

## 4. Bilder

Neue Bilder in diesem Auftrag: 9 Figuren-Silhouetten, 3 Gesehene, 3 Blick-Items und Zanns Geige als Icons, das Zeichen der Farbe, die 14 Biegungs-Zeichen, die Strand-Stufen, die Reliefs der 54 neuen Fragmente, die Peilkarten-Optik je Akt. Für alle gilt der Bewertungsbogen aus [docs/auftrag-2/06-ki-bilder.md](../auftrag-2/06-ki-bilder.md) Abschnitt 5: Note mindestens 4, du siehst jedes Bild selbst an, Kontaktbogen neben den drei Favoriten, Noten-Tabelle in `fortschritt.md`.

## 5. Abnahmeprotokoll je Meilenstein

In `fortschritt.md` unter dem Meilenstein, vollständig ausgefüllt, bevor der Status „fertig“ wird:

```
#### Abnahme M<n>
- Abnahmekriterien aus 03-meilensteine.md: je Kriterium ✓/✗ mit Beleg (Testname, Bildpfad, Zahl)
- Tests: <Befehl> → <letzte Zeile der Ausgabe wörtlich>, für jeden Test
- texte-pruefen: <Ausgabe>
- Bots: Siegrate generisch / je Build, Vergleich mit Basis
- Bilder: <Pfade>, selbst angesehen: ja
- Regelprüfung: <Mechanik>: 7/7 bestanden (Tabelle in „Regelprüfung“)
- Abweichungen von Vorlage oder Konzept: <Liste mit Grund>
- Agenten: <Modell: Aufgabe> je Zeile
- Offen: <ehrlich>
```

## 6. Geklickter Run am Ende (M12)

Wie in Auftrag 2 M9: ein ganzer Run, im Browser geklickt (Playwright), jede Station ein Bild, mit allen Systemen an und einem Seed, auf dem mindestens drei Biegungen, ein stummer Gegner, der Blick, die Farbe, zwei Begegnungen und zwei Würze-Stücke vorkommen (Seed suchen oder per Dev-Zettel setzen und das im Bericht sagen). Übersicht als Kontaktbogen nach `bilder/M12/run-uebersicht.png`.
