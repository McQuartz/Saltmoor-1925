# Das schwarze Eis · Zweiter Wächter: Die Welle, die weiterkam (`welle`)

Zugabe (zweite Wächter je Biom). Daten im Ergänzungspaket `prototype/data/biome/eis_plus.json` (`waechter_dazu`, Eintrag unter `foes`), Sprite `tools/sprites/gegner/welle.js` (Sheets `welle`, `welle_p2`), Zonenpalette `tools/sprites/zonen/eis_welle.json` (Körper wie `eis`, nur das Randlicht anders). Bilder: [bilder/Zugabe/waechter2/](../bilder/Zugabe/waechter2/). Weg A, `quelle: skript`. Grundlage: Steckbrief Akt 4 in [docs/auftrag/04-welt-und-run.md](../../auftrag/04-welt-und-run.md) (gefrorene Wellen, „manchmal ist eine Welle ein Stück weiter als vorher“), Hintergrund-Konzept V0 (die helle Narbe vor der Welle) und das Wandbild `eis_1` (die Ersten, die zum Land schwammen und sich umgedreht haben).

## Zweiter Wächter

- **Wer/was:** Ein Brecher aus schwarzem Eis, so hoch wie ein Haus, mitten im Überschlagen gefroren. In seiner durchscheinenden Wand stecken die Ersten, die zum Land hin schwammen: halb umgedreht, die Augen rot, sie sehen an dir vorbei auf etwas hinter dir.
- **Das falsche Detail:** Hinter seinem Fuß liegt im Eis eine helle Narbe. Dort stand er vorhin. Jedes Mal, wenn man wegsieht, ist er ein Stück weiter (Idle: er rückt einen Pixel vor; im Kampf die Ansage).
- **Silhouette in einem Satz:** ein hoher, überkippender Brecher mit hohler Röhre, an der Lippe Krallen aus gefrorener Gischt, auf dem Kamm Schaumballen.
- **Warum anders als der Chor:** Der Chor ist ein runder Klumpen mit Stacheln, der ruft (Rufer alle 3 Züge) und atmet. Die Welle ist ein Haken mit Hohlraum, sie ruft niemanden und schlägt hart mit Ansage: Kniff `ansage` (1 Zug laden, dann 30), man muss Block planen. Besonderheit `phasen` bei 50 %: Sie bricht (`welle_p2`, die Lippe ist ab, die Ersten lehnen sich mit den Armen heraus), danach Gischt (5 × 4), Laden, Brecher (30), Nachlauf (6 × 3); die Schwachstelle wechselt von Eisen (Pickel und Meißel brechen Eis) zu Glaube (wer betet, dem drehen sich die Ersten wieder zu).
- **Randlicht:** Flieder (`#7a6a9c`/`#e0d2f0`). Die Wächter-Szene „Der Riss“ ist ganz in Blau, der Flieder kommt dort nicht vor, die Welle steht klar vor den blauen Brechern dahinter. Inneres Licht: das Leuchten des Umrisses von unten, das durch die Wand der Röhre scheint (gedithert), und die roten Augen der Ersten.
- **Animation:** Leerlauf: rückt einen Pixel vor, die Ersten blinzeln nacheinander, eine Kralle tropft. Angriff: Die Welle lehnt sich zurück, die Lippe hebt sich (Ausholen über zwei Bilder), dann schlägt die Lippe nach vorn unten, die ganze Welle rückt 10 px vor. Tod: Sie sackt ein und zerfällt von oben.
- **Kampf (96 Leben):** Ansage 30 (ein Zug Laden), ab 50 % Phase 2 wie oben. Stimme `ertrunkener`. Beute: keine eigene, `beute_satz`: „Die Welle ist zu Ende gebrochen …“.
- **Proben (Silhouette):** stehende Wand ohne Überschlag (Fels oder Eisberg, zu nah am Chor); flache, breite Welle (bei Kampfgröße nur ein Hügel). Genommen: hoher Brecher mit Röhre. Gegen alle Sprites in `assets/gegner/` geprüft: Der Wurm (Stadt) ist ein Bogen ohne Fuß und Lippe, sonst nichts Ähnliches.
- **Abstimmung** (`biom-test eis 20`, gleiche Seeds, gleicher Stand): Chor 17/18 Akte, im Wächterkampf Ø 0 Schaden, 4,3 Züge; Welle 16/18, Ø 7 Schaden, 4,6 Züge. Die Niederlagen im Akt kommen aus den normalen Kämpfen; die Welle ist spürbar gefährlicher als der Chor, entscheidet aber bei diesem Deckstand noch keinen Run.

### Note (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Die Welle (`welle`, `welle_p2`) | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Der überkippende Brecher mit hohler Röhre ist schwarz gefüllt sofort eine Welle und neben keinem anderen Gegner verwechselbar; das Fliederlicht trennt sie im Spiel klar vom blauen Eis. Die Ersten in der Wand lesen sich bei Kampfgröße als Reihe dunkler Gestalten mit roten Augen, der Schwimmzug (Arm vor dem Kopf) erst bei ×3. Phase 2 (abgebrochene Lippe, Arme heraus) ist deutlich, aber kein neuer Umriss. |
