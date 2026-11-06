# Hafenviertel (`hafen`) · Zweiter Wächter: Die Galionsfigur (`galionsfigur`)

Zugabe zu Auftrag 2. Daten im Ergänzungspaket `prototype/data/biome/hafen_plus.json` (`waechter_dazu`, Gegner unter `foes`), Sprite `tools/sprites/gegner/galionsfigur.js` (Varianten `galionsfigur` und `galionsfigur_p2`), Zone `tools/sprites/zonen/hafen_galion.json`. Der Seed wählt je Run zwischen dem Lotsen und der Galionsfigur; die Wächter-Szene am Fuß des Leuchtturms bleibt dieselbe. Alles per Skript gezeichnet (`quelle: skript`).

## Idee

- **Wer:** die Frau vom Bug der „Gesine“, die im Winter 1917 an der Klippe unter dem Leuchtturm gesunken ist (dieselbe Nacht wie im Leuchtturmhof). Sie ist ohne ihr Schiff an Land gekommen, nur mit dem Stück Bug, an das sie genagelt ist: Vorsteven, Planken, der Bugspriet mit dem Toplicht.
- **Das falsche Detail:** Das Stück Bug macht noch Fahrt. Am Steven teilt sich Wasser, das es nicht gibt, und läuft als Bugwelle an ihr hoch. Sie ist geschnitzt, nur ein Auge ist offen und nass.
- **Silhouette:** ein schräger Keil aus Planken, oben der lange Bugspriet mit der Laterne, davor die Frau weit nach vorn gelehnt, die Arme nach hinten an den Steven genagelt; zwischen ihrem Rücken und dem Holz bleibt ein Dreieck Luft.
- **Proben:** die Figur aufrecht ohne Bug (schwarz eine stehende Frau im Kleid, zu nah an Fensterzählerin und Heimleiterin). Genommen: mit Bug in der Diagonale.
- **Anders als der Lotse:** Der Lotse ist eine hohe, senkrechte Säule mit Laternenkopf, er blockt und **ruft** Tieflinge, man kämpft gegen viele. Die Galionsfigur ist eine Diagonale aus Holz und **rammt**: Kniff `brecher` (dein Block zerbricht, wenn sie angreift), Besonderheit `phasen` bei 50 %: Das Holz springt auf, längs durch Brust und Gesicht, darunter ist es hell (`galionsfigur_p2`, auch der Bugspriet ist gebrochen), das Muster wird härter. Gegen sie hilft kein Bollwerk, nur Schaden und Leben.

## Kampf

- **Werte:** 76 Leben, Schwachstelle **Feuer** (Teer und Firnis brennen, auch nass). Muster 13, Block 10, 2 × 7, Stärke +3, 18; Phase 2: 16, 3 × 6, Block 12, 22.
- **Stimme:** `ertrunkener`. **Beute:** Heuerbeutel eines Ertrunkenen.
- **Licht:** eigene Zone `hafen_galion`: die Körperstufen des Hafens, Randlicht **grün** (das Steuerbordlicht eines Schiffs von hinten; die Szene hat nur Blauweiß und das Gelb der Laterne). Inneres Licht: das Toplicht am Spriet, das nasse Auge, in Phase 2 der Riss.
- **biom-test (20 Seeds):** Lotse 19/20 (95 %), Galionsfigur 14/20 (70 %).

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Die Galionsfigur (`galionsfigur`) | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Bug, Spriet mit Toplicht und die vorgelehnte Figur lesen sich schwarz als Schiffsbug mit Galionsfigur, eine Form, die es im Spiel nicht gibt. Schwächen: Die abgebrochene Plankenkante ist noch etwas treppig und der Rumpf eine große dunkle Fläche; das Gesicht ist für 160 × 180 klein. |
| Die Galionsfigur, Phase 2 (`galionsfigur_p2`) | 4 | 4 | 4 | 5 | 4 | 4 | **4** | Der leuchtende Riss längs durch Gesicht und Leib zeigt den Phasenwechsel sofort und ist das stärkste Bild; der gebrochene Spriet ändert die Silhouette nur wenig. |
| Im Spiel (Wächter-Szene) | | | | | | 4 | **4** | Steht links vom Leuchtturm vor dem blauen Himmel, das grüne Randlicht trennt sie klar von Turm und Kai. |

Bilder: [Spiel](../bilder/Zugabe/waechter2/hafen-galionsfigur.png), [Kontaktbogen](../bilder/Zugabe/waechter2/bogen-a1.png).
