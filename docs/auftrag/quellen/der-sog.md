# Saltmoor 1925: Der Sog

Kopie des Konzeptdokuments vom 2026-11-03 (Original: https://claude.ai/artifact/RkMUD7jLD2JqbFn7GGLMWP). Stand und Inhalt unverändert, nur eingebettete Grafiken sind als Hinweis ersetzt.

Etwas unter Saltmoor ruft, und du kannst nicht aufhören hinabzusteigen. Das ist die ganze Motivation. Es gibt keine Story, keinen Auftraggeber und kein Ziel, das man erklären müsste. Der Sog ist zugleich die Erklärung für das Roguelike: Du stirbst nicht, die Tiefe spuckt dich aus, du wachst am Strand auf und gehst wieder hinunter. Die Biome folgen einer einzigen Regel: Je tiefer du kommst, desto älter, fremder und weniger menschlich wird die Welt. Was dich ruft, ist am Ende vielleicht gar nicht fremd, sondern ein Teil von dir.

## Was ist lovecraftesk

Lovecraft geht es nicht um Monster, sondern um die Erkenntnis, dass der Mensch winzig und spät dran ist. Aus seinen Geschichten lassen sich sieben Prinzipien ziehen, und jedes davon hat ein Gegenstück im Spiel.

| Prinzip | Wo es bei Lovecraft steht | Was es für Saltmoor heißt |
| --- | --- | --- |
| **Tiefe ist Zeit.** Wer tiefer geht, geht zurück in die Vergangenheit. | The Rats in the Walls: unter dem Familiensitz liegen Schichten aus Tudorzeit, Römerzeit, Druidenzeit und Vorzeit. | Jedes Biom ist eine ältere Epoche als das darüber. |
| **Die Welt ist gleichgültig, nicht böse.** Das Uralte hasst dich nicht, du bist ihm egal. | At the Mountains of Madness, The Shadow Out of Time: Zivilisationen, die lange vor dem Menschen kamen und gingen. | Gegner in der Tiefe jagen dich nicht persönlich. Sie sind Wächter, Reste, Wetter. |
| **Wissen ist das Gift.** Neugier treibt dich an, Erkenntnis zerstört dich. | The Call of Cthulhu, erster Satz: Barmherzig ist, dass der Mensch nicht alles zusammenfügen kann, was er weiß. | Die Wahnsinn-Leiste steigt mit dem, was du siehst und findest. Stärke kostet Verstand. |
| **Die Wände erzählen.** Die Geschichte steht in Reliefs und Wandbildern, nie in Dialogen. | The Nameless City und Mountains of Madness: der Erzähler liest die Geschichte einer Rasse von den Wänden ab. | Keine Story, aber Wandbild-Fragmente als Sammelstücke zwischen den Runs. |
| **Andeuten statt zeigen.** Das Schlimmste bleibt halb gesehen und unbeschreiblich. | Fast überall, am klarsten bei The Colour Out of Space: eine Farbe, die es nicht gibt. | Die tiefsten Gegner werden nie ganz gezeigt, nur Silhouette, Augen und Randlicht. Das passt zum Ziel-Look. |
| **Das Blut ruft.** Das Fremde ist am Ende ein Teil von dir. | The Shadow over Innsmouth: der Erzähler entdeckt, dass er selbst von den Tiefen abstammt, und will zu ihnen hinaus. The Rats in the Walls: der Erbe wird selbst zum Tier. | Der Sog hat einen Grund, den man nie ausspricht: Du gehörst dort unten hin. |
| **Die Geometrie ist falsch.** Je näher am Ursprung, desto weniger stimmen Winkel und Wege. | The Call of Cthulhu (R'lyeh), The Dreams in the Witch House. | In den tiefsten Biomen verhalten sich Karten und Felder seltsam, Regeln biegen sich. |

Ein Satz aus The Nameless City passt fast als Motto über das ganze Spiel: »That is not dead which can eternal lie, and with strange aeons even death may die.«

## Der Sog als Spielregel

Der Sog erklärt die drei Dinge, die ein Roguelike sonst mühsam begründen muss: warum du weitergehst, warum du von vorne anfängst und warum du stärker zurückkommst.

- **Warum du weitergehst:** Ein Ruf, den nur du hörst. Im Spiel läuft er leise mit, als Glocke unter Wasser, als Gesang, als Salzgeschmack. Das kann direkt die Gefahr-Achse der Layer-Musik sein, die mit der Tiefe lauter wird.
- **Warum du von vorne anfängst:** Wie in The Nameless City jagt dich die Tiefe am Ende hinaus. Ein verlorener Run ist kein Tod, du wirst ausgespuckt und wachst mit Salz in der Lunge am Strand von Saltmoor auf. Dein Loadout ist weg, ein paar Erinnerungen bleiben.
- **Warum du stärker wirst:** Was du von den Wänden gelesen hast, bleibt. Wandbild-Fragmente schalten neue Items, Stoffe oder Charaktere frei. Das ist die Meta-Progression, und sie erzählt nebenbei die Welt, ohne eine Story zu sein.
- **Warum du nicht einfach aufhörst:** Optional als Mechanik: Wer zu lange rastet, Shops nutzt oder sich heilt, lässt den Sog wachsen. Der Sog könnte mit der geplanten Wahnsinn-Leiste zusammenfallen oder neben ihr stehen.

**Das Ende.** Ein gewonnener Run endet nicht mit einer Flucht, sondern mit einer Ankunft. Ganz unten erkennst du, was dich gerufen hat, und darfst wählen: bleiben oder umkehren. Das ist die Innsmouth-Wendung, aber ohne erklärende Zwischensequenz. Ein Bild, eine Wahl, vorbei.

## Die Biom-Abfolge

Die vier Zonen, die es im Prototyp schon gibt, passen genau in diese Logik. Hafenviertel, Moorwald und überflutete Kapelle sind die menschlichen Schichten, und »Der Grund« lässt sich in drei fremde Schichten aufteilen. Jede Schicht ist älter als die darüber, und bei den Gegnern gilt eine feste Regel: erst Menschen, dann Menschen, die sich verändern, dann Dinge, die Menschen nachahmen, und am Ende Dinge ohne menschliche Form.

| Tiefe | Biom | Epoche | Gegner | Vorbild |
| --- | --- | --- | --- | --- |
| 1 | **Hafenviertel** (gibt es) | 1925 | Menschen, die etwas wissen und schweigen: Schmuggler, Fischer mit zu großen Augen | The Shadow over Innsmouth |
| 2 | **Der Moorwald** (gibt es) | Volksglaube, Jahrhunderte alt | Moorleute, Opfersteine, Dinge zwischen Tier und Mensch | The Dunwich Horror, The Colour Out of Space |
| 3 | **Die überflutete Kapelle** (gibt es) | Ein Kult, der dem Ruf vor dir gefolgt ist | Halb verwandelte Gläubige, Priester mit Kiemen | The Shadow over Innsmouth (Esoteric Order of Dagon) |
| 4 | **Die Salzstollen** (neu) | Römerzeit und Vorzeit | Knochen, Grabwächter, blinde Tiere aus der Tiefe | The Rats in the Walls |
| 5 | **Die namenlose Stadt** (neu) | Vor dem Menschen | Mumien und Wächter der Erbauer, ein Wind, der dich hinausdrücken will | The Nameless City |
| 6 | **Das schwarze Eis** (neu, die Eiswelt) | Vor dem Leben an Land | Nachahmer, die mit menschlichen Stimmen rufen | At the Mountains of Madness |
| 7 | **Die Pforte** (neu, Ende) | Außerhalb der Zeit | Formlos, nur Augen und Randlicht, falsche Geometrie | The Call of Cthulhu, The Dream-Quest of Unknown Kadath |

Eine Brücke von der Küste ins Eis: Unter einem Salzmoor liegt Salz, also ein alter, ausgetrockneter Meeresboden. Wer durch das Salz hinabsteigt, steigt in ein Meer hinab, das längst verschwunden ist, und ganz unten ist es noch da, nur schwarz und gefroren. So hängen Küste und Eiswelt logisch zusammen.

## Tiefe muss nicht immer unten sein

Bei Lovecraft führt die Tiefe in fünf Richtungen, und alle enden am selben Ort. Das ist nützlich für den Grundsatz »kein Run beginnt gleich«: Die oberen Schichten können je nach Run oder Charakter wechseln, die tiefen Schichten sind für alle dieselben.

| Richtung | Vorbild | Wie es im Spiel aussehen könnte |
| --- | --- | --- |
| **Hinab** | The Nameless City, The Rats in the Walls | Brunnen, Keller, Salzstollen. Der klassische Weg. |
| **Hinaus** | Dagon, The Shadow over Innsmouth (Devil Reef) | Mit dem Boot zum Riff, dann unter Wasser. Ein Einstieg über das Meer statt über das Land. |
| **Hinein** | The Dream-Quest of Unknown Kadath: 70 Stufen des leichten Schlummers, dann 700 Stufen zur Pforte des tieferen Schlummers | Ein Run im Traum. Jeder Schlaf an der Rast führt eine Stufe tiefer. |
| **Zurück** | The Shadow Out of Time: der Geist wird in eine Vorzeit getauscht | Die Biome sind dieselben Orte zu früheren Zeiten. Hafen 1925, Hafen 1692, Hafen vor der Sintflut. |
| **Bleiben** | The Colour Out of Space: der Hof verrottet um die Familie herum | Ein Sonder-Run, in dem du dich nicht bewegst, sondern Saltmoor um dich herum zerfällt. |

Für den Anfang würde ich nur Hinab und Hinaus bauen. Beide führen in die Kapelle, und ab dort ist der Weg gemeinsam. Die anderen drei sind gute Ideen für spätere Sonder-Runs.

*(Grafik im Original: Der Abstieg · zwei Einstiege, ein gemeinsamer Weg nach unten)*

Oben wechselt der Einstieg, ab der Kapelle steigen alle durch dieselben Schichten, und rechts steht, welche Art Gegner dort wartet.

## Motivation pro Charakter

Der Sog bleibt für alle gleich, aber jeder Charakter hat eine eigene Ausrede dafür. Er glaubt, er gehe aus einem vernünftigen Grund hinunter, und das ist genau die Selbsttäuschung, die Lovecraft-Erzähler auszeichnet. So kommen auch die Ideen »Der Verschollene« und »Der Überlebende« unter, nur eben als Ausrede einzelner Charaktere und nicht als Rahmen für alle. Im Spiel wäre das nur eine Zeile beim Start eines Runs.

| Charakter | Was er sich einredet | Was wirklich ist |
| --- | --- | --- |
| **Fischer** | Sein Bruder ist mit dem Boot nicht zurückgekommen, er sucht ihn. (Der Verschollene) | Der Bruder ist nicht ertrunken, er ist hinabgeschwommen. |
| **Detektiv** | Er ermittelt in einer Reihe von Vermisstenfällen. | Er ist der nächste Fall. |
| **Pfarrerin** | Sie will ihre Gemeinde vor dem Kult in der Kapelle retten. | Ihre Glocke läutet auch unter Wasser weiter. |
| **Friedhofswärter** | Gräber sind leer, er will wissen, wohin die Toten gehen. | Sie gehen nach unten. |
| **Okkultist** | Er sucht das Wissen der Erbauer, ganz bewusst. | Der Einzige, der ehrlich ist, und dafür am schnellsten wahnsinnig. |
| **Kneipenschläger** | Er hat Schulden und hört, in der Tiefe liege Gold. | Das Gold ist alt, sehr alt. |

Ein weiterer Charakter könnte der Überlebende sein, etwa ein Geologe einer Expedition, die nie zurückkam. Er steigt mit einer alten Karte hinab, und das schwarze Eis hat er schon einmal gesehen.

## Offene Fragen

- [ ] Sind sieben Schichten zu viele? Alternativ bleiben es vier Zonen, und »Der Grund« bekommt drei Unterbereiche.
- [ ] Ist der Sog eine eigene Leiste, oder fällt er mit der Wahnsinn-Leiste aus der Ideenkiste zusammen?
- [ ] Wollen wir die Ankunft am Ende mit der Wahl zwischen Bleiben und Umkehren, oder bleibt ein Run reines Hinabsteigen ohne Ende?
- [ ] Sollen Wandbild-Fragmente die Meta-Progression sein, oder schalten wir lieber über Gold oder Erfolge frei?
- [ ] Bauen wir neben Hinab gleich auch den Einstieg Hinaus über das Riff?

## Quellen

Alle Inhaltsangaben stammen aus meiner Kenntnis der Texte, ich habe sie für dieses Dokument nicht neu nachgeschlagen. Die Originaltexte sind gemeinfrei (Lovecraft ist 1937 gestorben) und zum Beispiel bei [hplovecraft.com](https://www.hplovecraft.com/writings/texts/) nachzulesen.
