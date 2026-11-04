# Meilensteine M0 bis M9 (und Zugabe)

Der Reihe nach. Ein Meilenstein ist fertig, wenn seine Abnahme erfüllt und geprüft ist. **Mindestens** markiert den sauberen Stand, wenn die Zeit drängt.

**Budget:** Philip will die Rest-Credits vor allem für Gegner, Bosse und Biome. Darum M1 bis M4 knapp halten (zusammen etwa ein Drittel des Budgets) und den Großteil in M5 bis M7 stecken. Bleibt nach M9 etwas übrig, geht es mit der Zugabe weiter, bis das Budget aufgebraucht ist.

---

## M0 Einrichten und Bild-Pipeline

- Branch vom aktuellen `main` (siehe [01-regeln.md](01-regeln.md)), Draft-Pull-Request.
- Lesen: alles in `docs/auftrag-2/`, dann `docs/auftrag/fortschritt.md` (Stand von Auftrag 1).
- Die Bild-Pipeline aus [06-ki-bilder.md](06-ki-bilder.md) Abschnitt 3 einmal ganz durchziehen mit **einem** Testgegner (Vorschlag: die neue Windgestalt), mit jedem verfügbaren Weg (Skript, Bild-Generator, gemischt). Die Ergebnisse kommen nebeneinander neben die Favoriten, der bessere Weg wird mit Begründung in `fortschritt.md` notiert.

**Abnahme:** Draft-PR offen. Ein Gegner aus der Pipeline läuft im Spiel, Kontaktbogen neben den Favoriten liegt in `docs/auftrag-2/bilder/M0/`, Note ehrlich vergeben.

## M1 Gefühl und UI

Alles aus [07-ui-und-gefuehl.md](07-ui-und-gefuehl.md) außer dem Rucksackmodus und der Hover-Vorschau (die kommen in M3):

- Lebensbalken unten mittig, Gegner-Balken unter den Füßen.
- Meldungszeile mit höchstens 2 Meldungen, Mindestdauer, Warteschlange.
- Wucht: `balance.json → wucht`, eigene Treffer 25 % stärker, Mehrfachtreffer einzeln animiert, Gegner holen aus.
- Übergangstext zum Wegklicken.
- Beute-Sätze je Biom und Gegner.
- Endbildschirm mit Statistik.
- Musik: längerer Aufbau bei Wächter und Finale.

**Abnahme:** Bildschirmfotos von Kampf (mit Mehrfachtreffer in 3 Einzelbildern), Belohnung, Übergang und Endbildschirm. Autospieler 20 Seeds ohne Fehler. **Mindestens:** Lebensbalken, Meldungen, Übergang, Endbildschirm.

## M2 Längere Akte, mehr Biome je Akt

- `run.json`: Jeder Akt I bis IV bekommt **6 Ebenen plus Wächter** (Vorschlag: e1 Kampf/Ereignis, e2 gemischt, e3 Rast/Werkstatt/Krämer, e4 Kampf/schwerer Kampf/Ereignis, e5 gemischt, e6 Rast/Krämer, dann Wächter). Akt V: Vorraum, eine Rast, Finale.
- Biom-Wahl am Aktanfang zwischen 2 Biomen aus der Liste des Akts ([05-inhalte.md](05-inhalte.md) Abschnitt 2). Der Code muss mit beliebig vielen Biomen je Akt laufen. Neue Biome sind bis M6 noch nicht da, also Platzhalter im Dev-Modus.
- Gegnerskalierung und Gold auf die längere Strecke anpassen.

**Abnahme:** Autospieler 20 Seeds, durchschnittlich mindestens 26 Knoten pro Run, jeder Run endet. Dev-Reiter „Run“ zeigt die Biom-Wahl.

## M3 Deckbau-Kern

Nach [04-deckbau.md](04-deckbau.md) Abschnitte 2, 4, 5, 6 und 8:

- Kerben und Handgriffe (Daten: `data/handgriffe.json`, Kerben in `items.json`), Handgriffe nehmen die Stoffe ihres Items an, Grundkarten werden durch Start-Handgriffe ersetzt.
- Neue Schlagworte: Stärke, Verwundbar, Funke, Kette, Behalten, Opfer, X.
- Belohnungen nach Tabelle, Handgriff-Wahl mit Gewichtung zum Deck, Vorschau neuer Reaktionen.
- Schleifen, Kerbe dazu, Umritzen; Krämer mit Verkauf und Handgriffen.
- Rucksackmodus mit Deck-Vorschau, Hover-Vorschau am Cursor ([07-ui-und-gefuehl.md](07-ui-und-gefuehl.md) Abschnitt 2).
- Autospieler versteht Handgriffe (wählt den mit dem höchsten erwarteten Wert, legt ihn in das Item, das eine Reaktion ermöglicht).
- Dev-Modus: Reiter „Deck“ mit Items, Kerben, Handgriffen, Stoffen und Kostenkurve.

**Abnahme:** Ein Run des Autospielers endet mit mindestens 20 Karten im Deck. Bildschirmfotos: Handgriff-Wahl mit Vorschau, Rucksackmodus mit Grün/Rot-Änderung, Hover-Vorschau. Tests in `tools/test-run.js` für Kerben, Stoffübernahme und Schlagworte. **Mindestens:** Kerben, Handgriffe, Belohnung, Rucksackmodus.

## M4 Items, Handgriffe, Reliquien, Builds

- Items überarbeiten auf etwa 70 (Seltenheit, Eigenschaft, Kerben, Flavor-Text, Verkaufspreis). Langweilige Werte-Items umbauen oder streichen.
- Etwa 70 Handgriffe und etwa 18 Reliquien, verteilt auf die sechs Builds plus neutral. Kostenkurve nach Abschnitt 5.
- `docs/auftrag-2/builds.md`: die sechs Builds mit je einem Beispieldeck (Glutnest steht schon in [04-deckbau.md](04-deckbau.md) 7.7).
- Ein **Build-Bot** je Archetyp (bevorzugt dessen Handgriffe und Items).

**Abnahme:** Build-Bots je 20 Seeds, Tabelle in `fortschritt.md` mit Siegrate je Build. Erste Ausreißer schon angepasst (fein abgestimmt wird in M8). **Mindestens:** 50 Items, 40 Handgriffe, 10 Reliquien, 4 Builds spielbar.

## M5 Pipeline in Masse und alte Schwächen

- Pipeline aus M0 robust machen (Stapel-Lauf für ein ganzes Biom, Kontaktbogen automatisch).
- Neu: Erbauer-Mumie, Nachgeher, Ertrunkener, Netzflickerin-Rückseite, Windgestalt (falls in M0 nur Test), Torfstich heller.
- Item-Icons für alle Items und Bilder für die Handgriffe.
- Alte Gegner vergleichen: Ist ein Neubau deutlich besser, wird ersetzt (außer den drei Favoriten).

**Abnahme:** Kontaktbogen aller Gegner von Auftrag 1 neben ihren Neubauten, Note je Gegner. Icon-Bogen aller Items. **Mindestens:** die fünf schwachen Gegner und alle Icons.

## M6 Fünf neue Biome für Akt I und II

Fabrik, Kurhaus, Nachtzug, Kloster, Grotte nach [05-inhalte.md](05-inhalte.md), jedes als Paket nach Abschnitt 7 (Konzept, Bilder, Daten, Prüfung, Note). Je Biom: Hintergrund mit 3 Varianten plus Wächter-Szene, 4 Gegner, Wächter, Krämer, 5 Ereignisse, Items, Musik-Färbung, Übergang. Dazu je 1 bis 2 neue Gegner für Hafen, Moor, Kapelle.

**Abnahme je Biom:** Bildschirmfoto Kampf und Wächter in `docs/auftrag-2/bilder/M6/<biom>/`, Autospieler 10 Seeds nur in diesem Biom, alle Noten mindestens 4. **Mindestens:** 3 der 5 Biome vollständig.

## M7 Fünf neue Biome für Akt III bis V und die Pforte

Wald, Gezeitenwerk, Walkathedrale, Glasmeer, Ufer unten, dazu die Pforte neu und das Finale neu gezeichnet. Gleiches Paket wie in M6. Dazu je 1 bis 2 neue Gegner für Salz, Stadt, Eis.

**Abnahme:** wie M6, plus ein Bildschirmfoto jeder Finale-Phase. **Mindestens:** 3 der 5 Biome, Pforte neu.

## M8 Ereignisse und Balance

- Ereignisse auf mindestens 5 je Biom und 10 biomübergreifend auffüllen ([05-inhalte.md](05-inhalte.md) Abschnitt 6).
- Balance nach [04-deckbau.md](04-deckbau.md) Abschnitt 9 mit generischem Bot und Build-Bots, je 50 Seeds. Kein Akt über 35 % der Niederlagen.

**Abnahme:** Tabelle mit Siegrate je Build, Niederlagen je Akt und Biom, Deckgröße am Ende, Reaktionen pro Zug. Alle Zielwerte erreicht oder begründet, warum nicht.

## M9 Abschluss

- Autospieler 50 Seeds, ein Run von Hand (Playwright klickt wie ein Mensch) mit Bildschirmfotos jeder Station.
- Galerie und Artboard um die neuen Gegner, Items und Biome erweitern.
- Bericht nach [01-regeln.md](01-regeln.md).

**Abnahme:** Bericht im PR und in `fortschritt.md`.

## Zugabe: weiter pumpen, bis das Budget alle ist

Philip will „echt einfach tonnen davon“. Nach M9 geht es weiter, jedes Mal als vollständiges Paket nach [05-inhalte.md](05-inhalte.md) Abschnitt 7, mit Commit und PR-Aktualisierung nach jedem Paket:

1. Weitere Biome, je Akt eines mehr (eigene Ideen im selben Ton, Konzept zuerst in `biome-2.md`). Anregungen: der Leuchtturmhof (I), die Glockengießerei (II), die Ziegelbrenner-Gruben unter Rom (III), der Mond unter dem Eis (IV).
2. Varianten b für alle Gegner, die noch keine haben.
3. Mehr Ereignisse mit Bildern.
4. Mehr Reliquien, die neue Builds eröffnen.

Qualität vor Menge auch hier: Ein Biom mit Note 3 zählt nicht.
