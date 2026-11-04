# UI und Spielgefühl: die klaren Punkte

Alles hier hat Philip so gesagt und am 2026-11-04 bestätigt. Es wird ohne weitere Abstimmung umgesetzt (M1, Teile in M3). In Klammern steht Philips Satz.

## 1. Kampf-Bildschirm

- **Lebensbalken** („muss mittig oder nach unten, schlecht zu sehen“): Dein Lebensbalken sitzt unten in der Mitte, direkt über der Hand, breit, mit Block als Schild links daneben und angekündigtem Schaden als roter Schatten im Balken. Die Lebensbalken der Gegner sitzen unter ihren Füßen statt darüber.
- **Infoboxen** („faden zu schnell, sollen sich aber auch nicht stapeln nach unten“): eine feste Meldungszeile oben in der Mitte. Höchstens **2** Meldungen gleichzeitig, nebeneinander oder überblendet, **nie** nach unten gestapelt. Jede bleibt mindestens 4 s (wichtige wie Hochreaktion, neue Reaktion entdeckt 6 s). Kommen mehr, rückt die Warteschlange nach, gleiche Meldungen werden zusammengefasst („Brand ×3“). Klick auf die Zeile öffnet die letzten 20 Meldungen.
- **Wucht der Angriffe** („mehr impact, sowohl von einem selbst als auch von gegnern, aber die eigenen so 25 prozent wuchtiger“): Treffer bekommen Anlauf, Einfrieren beim Treffer (Hitstop), Rückstoß des Ziels, Kamera-Ruck, Trefferblitz in der Stofffarbe, Splitter mit pixelfx, Zahl mit Gewicht. Alle Werte stehen in `balance.json → wucht` mit `eigen: 1.25` und `gegner: 1.0` als Faktor auf Hitstop, Ruck, Rückstoß und Zahlengröße. Gegner holen sichtbar aus (Angriffs-Sheet), bevor ihr Schaden kommt.
- **Mehrfachangriffe** („attacks 2x3 zb auch 3 mal animiert“): Jeder Treffer wird einzeln gespielt, mit eigenem Klang, eigener Zahl und kurzem Abstand (etwa 120 ms, beim letzten Treffer etwas mehr Wucht). Gilt in beide Richtungen.

## 2. Belohnung, Auswahl, Rucksack

- **Beute-Satz** („+x gold, unter dem was übrig ist liegt etwas, da steht immer der gleiche satz“): Pro Biom mindestens 6 Sätze, pro Gegner mit Beute einer eigener, im Ton der Welt („Im Netz der Flickerin hängt etwas, das kein Fisch ist.“). Nie zweimal derselbe Satz hintereinander. Daten in `biomes.json → beute_saetze` und `foes.json → beute_satz`.
- **Hover-Vorschau am Cursor** („bei itemanzeige beim auswählen das was ins deck kommt beim hovern zeigen neben cursor“): Fährt man in Belohnung, Krämer, Fundstelle oder Ereignis über ein Item oder einen Handgriff, erscheint neben dem Cursor eine kleine Karten-Reihe: welche Karten ins Deck kämen (mit Stoffzeichen, Kosten, Wirkung) und welche neuen Reaktionen dadurch möglich würden. Sie folgt dem Cursor und verdeckt nie das Item selbst.
- **Rucksackmodus** („wenn man items wechseln will dann da rein, und dann direkt auch anzeigen: was ist im deck, welche karten kommen mit welchen items rein, welche raus“): eine eigene Ansicht, aufrufbar mit Taste **R** und einem Knopf außerhalb des Kampfes. Links die Ausrüstung (Plätze je Bereich, Items mit ihren Kerben und Handgriffen), Mitte der Rucksack, rechts das **Deck als Liste**, gruppiert nach Item. Zieht oder klickt man ein Item, zeigt die Deckliste die Änderung: **grün = kommt rein, rot durchgestrichen = geht raus**, mit der Deckgröße vorher und nachher. Erst „Übernehmen“ macht es fest.
- **Items verkaufen** (bestätigt): beim Krämer für 40 % des Preises, im Rucksackmodus mit Knopf „Verkaufen“, wenn man beim Krämer ist.
- **Belohnungen, die sich wie Belohnungen anfühlen**: siehe [04-deckbau.md](04-deckbau.md) Abschnitt 6 (Aufdecken, Rahmen nach Seltenheit, Glocke bei Reliquie, Hinweis auf neue Reaktion).
- **Boss-Beute** („boss rewards geilere items“): Wächter geben eine Reliquie aus 3 ([04-deckbau.md](04-deckbau.md)).

## 3. Übergänge und Ende

- **Text nach dem Boss** („zu schnell weg, das soll man wegklicken müssen“): Der Übergangstext zwischen den Akten bleibt stehen, bis man klickt oder eine Taste drückt. Der Hinweis „weiter“ erscheint nach 1,5 s dezent. Der Zeitautomat in `feedback.js` fällt weg (der Autospieler klickt selbst).
- **Endbildschirm** („screen am ende mit stats und zeit usw.“): nach Sieg, Strand und Umkehren. Inhalt: Figur, Seed, Dauer (echte Spielzeit), Weg durch die Biome als Reihe kleiner Bilder, erreichte Tiefe, Kämpfe, Gold verdient und ausgegeben, Schaden ausgeteilt und genommen, höchster Treffer, längste Kette in einem Zug, entdeckte Reaktionen, das Deck am Ende (Bild der Karten nach Item), der Build-Archetyp, den das Deck am ehesten hat, Todesursache, neue Freischaltungen. Knöpfe: neuer Run, gleicher Seed, Bild speichern.

## 4. Musik

- **Aufbau beim Boss** („setzt bei bossen gefühlt komplett ein mit allen layern, das könnt minimal länger aufbauen“): Beim Wächter und beim Finale kommen die Layer nacheinander, über 4 bis 8 Takte statt auf einmal. Zuerst Bass und Puls, dann die Stimme des Wächters, zum Schluss die volle Wucht. Wert `musik.boss_aufbau_takte` in den Daten.
- Sonst bleibt die Musik, wie sie ist (Philip: „eig geil“).

## 5. Was bleibt, wie es ist

Vibe, Texte, Sprüche und der Lovecraft-Ton sind Philips Lieblingsteil. Nichts davon wird geglättet oder gekürzt. Neue Texte (Ereignisse, Krämer, Beute-Sätze, Items) halten denselben Ton: kurz, konkret, ein falsches Detail, nie erklärt.
