# Regeln für Claude-Sitzungen am Sprite-Generator

Diese Datei gilt für **jede** Sitzung, die am Generator arbeitet. Sie geht kürzeren Anweisungen im Start-Prompt vor, außer ein Mensch sagt ausdrücklich etwas anderes.

## 1. Zuerst lesen (in dieser Reihenfolge)

1. `docs/spritegen/README.md`
2. diese Datei
3. `docs/spritegen/03-architektur.md`
4. den Abschnitt deiner Etappe in `docs/spritegen/04-fahrplan.md`
5. `docs/spritegen/zielbild.md` (wie es am Ende aussehen soll, mit Beispielbildern)
6. `docs/spritegen/entscheidungen.md` und `docs/spritegen/budget-log.md`
7. bei Bedarf `docs/spritegen/01-recherche.md`

Danach: in 5–10 Zeilen aufschreiben, was du in dieser Sitzung machst und was nicht. Dieser Plan kommt in den Pull Request.

## 2. Verbotene Abkürzungen

Wer eine davon nimmt, hat die Etappe nicht erfüllt, auch wenn die Bilder gut aussehen.

- **Keine vorgezeichneten Körperteile.** Keine PNG-Teile, keine Pixel-Schablonen für Köpfe, Augen, Arme o. Ä., keine handgezeichneten Formen als Koordinatenlisten. Formen entstehen aus Skelett, Volumen und Regeln. Erlaubt: Paletten, Test-Referenzbilder, winzige Testbilder für Regel-Tests.
- **Keine KI-Bilder.** Weder als Eingabe, Vorlage, Referenz im Repo noch als Trainingsmaterial. Kein Aufruf von Bildgenerierungs-Diensten.
- **Nicht das Sprite-Labor portieren.** Die Zeichenfunktionen aus `prototype/js/procgen/creature.js` und `prototype/js/sprites/foes.js` sind Teile-Kombination und nicht der Weg. Übernehmen darf man Ideen für Paletten und nahtlose Loops.
- **Keine fremden Assets** aus anderen Spielen oder Asset-Packs.
- **Kein Schummeln bei Nachweisen.** Kontaktbögen zeigen immer aufeinanderfolgende Seeds ab einem genannten Start-Seed. Keine Auswahl der schönsten.
- **Tests nicht aufweichen.** Golden-Tests nicht löschen, abschalten oder Toleranzen einführen, damit sie grün werden. Goldens nur bewusst neu erzeugen, mit Eintrag in `entscheidungen.md`.
- **Keine Ersatz-Effekte.** Unschärfe, Downscaling mit Glättung oder Rauschen über alles ersetzen keine Aufräumregeln.
- **Kein globaler Zufall**, keine Zeit, keine Dictionary-Reihenfolge als Zufallsquelle.
- **Keine neue Abhängigkeit** (Addon, Bibliothek, Dienst) ohne Eintrag in `entscheidungen.md` mit Begründung. Keine kostenpflichtigen Dienste.
- **Nicht still den Weg wechseln.** Wenn die Architektur nicht trägt: stoppen und berichten, nicht heimlich etwas anderes bauen (z. B. JavaScript statt Godot).

## 3. Budget

Du siehst deinen Verbrauch nicht. Darum:

- Der Start-Prompt nennt ein Sitzungsbudget. Plane so, dass eine Etappe (oder ein klar benannter Teil davon) hineinpasst.
- Arbeite in kleinen Schritten und committe nach jeder funktionierenden Stufe. So ist bei einem Abbruch nichts verloren.
- Spare Kontext: große Dateien nur in Ausschnitten lesen, keine Subagenten ohne Auftrag, keine Bilder unnötig oft neu ansehen.
- **Stoppe und berichte**, wenn
  - du schätzt, dass die Etappe mehr als das 1,5-fache des Budgets braucht,
  - du zweimal am selben Problem gescheitert bist,
  - die Abnahmekriterien so nicht erreichbar scheinen,
  - Godot headless nicht läuft.
- Ein ehrlicher Zwischenstand ist besser als ein geschöntes „fertig“.

## 4. Technik

- Godot 4, GDScript, Code unter `game/addons/spritegen/` (siehe Architektur).
- Godot headless verwenden, um Bilder zu rendern und Tests laufen zu lassen. Fehlt Godot in der Umgebung: die offizielle Linux-Version laden (Version in `entscheidungen.md` notieren). Klappt das nicht, stoppen.
- Bilder, die du erzeugst, **selbst ansehen** und ehrlich beschreiben, was gut und was schlecht aussieht.
- Determinismus prüfen: denselben Kontaktbogen zweimal rendern und Dateien vergleichen.

## 5. Ziel-Look

- Der Look aus [zielbild.md](zielbild.md) ist das Ziel für alle Etappen ab M2: dunkle Körper in Zonenfarben, Gegenlicht mit Randlicht an der Außenkante, flache Flächen mit Fase statt Kuppeln, organische Silhouetten, geordneter Dither, leuchtende Augen als einzige helle Akzente.
- Die Beispielbilder sind von Hand gesetzte Formen. **Nicht nachbauen, nicht abpausen, keine Koordinaten daraus übernehmen.** Der Generator muss den Look aus Skelett, Volumen und Regeln erreichen.
- Feedback von Ace und Philipp **nicht wörtlich als starre Regel** umsetzen („organisch“ heißt nicht „rund hier, eckig dort“). Im Zweifel die Absicht hinter dem Feedback suchen und im Bericht sagen, wie du es gelesen hast.
- Jeder Kontaktbogen-Bericht sagt kurz, wie nah das Ergebnis am Zielbild ist und was noch fehlt.

## 6. Fertig heißt

- Code und Tests im Repo, Tests headless grün.
- Kontaktbogen als PNG in `docs/spritegen/sheets/<Etappe>/` mit Start-Seed im Dateinamen.
- `entscheidungen.md` ergänzt, `budget-log.md` mit Datum, Etappe und Ergebnis (Kosten trägt ein Mensch nach).
- Status in `docs/spritegen/README.md` aktualisiert.
- Branch `spritegen/<etappe>-<stichwort>`, Pull Request gegen `main`. Nie direkt auf `main` pushen.

## 7. Bericht am Ende (im Pull Request und im Chat)

1. Was gebaut wurde (3–6 Punkte)
2. Kontaktbogen-Link und ehrliche Einschätzung des Looks, gemessen am Zielbild
3. Was nicht geschafft wurde und warum
4. Offene Fragen an Ace/Philipp
5. Vorschlag für die nächste Sitzung
