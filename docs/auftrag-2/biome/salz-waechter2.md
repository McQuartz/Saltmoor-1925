# Salzstollen (`salz`) · Zweiter Wächter: Die Eingesalzene (`eingesalzene`)

Zugabe zu Auftrag 2. Daten im Ergänzungspaket `prototype/data/biome/salz_plus.json` (`waechter_dazu`, Gegner unter `foes`), Sprite `tools/sprites/gegner/eingesalzene.js` (Varianten `eingesalzene` und `eingesalzene_p2`, Hilfen in `tools/sprites/gegner/hilfe/w2a3.js`), Zone `tools/sprites/zonen/salz_sole.json`. Der Seed wählt je Run zwischen dem Wurm im Salz und der Eingesalzenen; die Wächter-Szene bleibt dieselbe. Alles per Skript gezeichnet (`quelle: skript`).

## Idee

- **Wer:** eine Salzsiederin aus der Zeit, bevor die Römer kamen. Sie hat sich in die Siedepfanne gesetzt, damit sie bleibt, und sie ist geblieben.
- **Das falsche Detail:** Das Salz ist an ihr in Würfeln gewachsen, alle gleich glatt und gleich rechtwinklig, als Treppe hinter ihr bis unter die Decke. Unter der Pfanne brennt das Siedefeuer bis heute, und aus ihrer offenen Hand rieselt Salz, das nie weniger wird.
- **Silhouette:** eine kniende Frau in einer flachen Pfanne, der Arm weit nach vorn, hinter ihr eine Treppe aus Würfeln, die nach rechts hinauf bis an den oberen Rand steigt; auf dem Kopf ein gekippter Würfel als Kapuze.
- **Proben:** sie als Salzsäule, die Würfel nur senkrecht über ihr (schwarz eine Säule mit Buckeln, nah an Gewicht und Kreuzgangwächter und am bekannten Bild). Genommen: die Treppe.
- **Anders als der Wurm:** Der Wurm ist ein Bogen, der aus dem Boden kommt, schlägt einfach hart und wechselt jeden Zug die Schwachstelle. Die Eingesalzene **stört die Hand**: Kniff `einfrieren` (jeden Zug ist eine Karte eingesalzen und unspielbar), Besonderheit `phasen` bei 50 %: Die Kruste springt, die Fugen zwischen den Würfeln glühen, abgeplatzte Würfel liegen in der Pfanne (`eingesalzene_p2`), die Schwachstelle wechselt von Wasser auf Blut und das Muster wird härter. Erst Geduld mit Blockrunden, dann ein Wettlauf.

## Kampf

- **Werte:** 96 Leben, Schwachstelle **Wasser** (Salz löst sich), in Phase 2 **Blut** (darunter ist sie noch warm). Muster Block 14, 13, 3 × 5, Block 12, 18; Phase 2: 14, 3 × 6, Stärke +3, 20.
- **Stimme:** `opfernde`. **Beute:** Der Würfel aus dem Berg (`salzwuerfel`).
- **Licht:** eigene Zone `salz_sole`: die Körperstufen der Salzstollen, Randlicht **kalt türkis** (Sole, ein Ton, den die sepiafarbene Szene nicht hat). Die Deckflächen der Würfel fangen das Gegenlicht von oben in derselben Stufe. Innere Lichter: die Augen hinter dem Salz und das Siedefeuer zwischen den Steinen, in Phase 2 die glühenden Fugen.
- **biom-test (20 Seeds):** Wurm 17/20 (85 %), Eingesalzene 16/20 (80 %). Im Mittel nimmt sie dem Autospieler 12 Leben je Kampf (Wurm 3), einmal gewinnt sie.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Die Eingesalzene (`eingesalzene`) | 5 | 4 | 4 | 4 | 5 | 5 | **4** | Die Würfeltreppe ist eine Form, die es im Spiel nicht gibt, und liest sich als Kristall, nicht als Mauer (jeder Würfel mit Deckfläche, Licht- und Schattenseite). Schwächen: Das Dither der Deckflächen ist im Großen etwas unruhig, das Gesicht unter dem Würfel ist klein und dunkel. |
| Phase 2 (`eingesalzene_p2`) | 4 | 4 | 4 | 5 | 5 | 5 | **4** | Die glühenden Fugen zeigen sofort, dass die Kruste gesprungen ist; die Treppe ist niedriger, Würfel liegen in der Pfanne. Die Silhouette ändert sich nur oben. |
| Im Spiel (Wächter-Szene) | | | | | | 5 | **4** | Dunkel vor der hellen Salzhalle, das türkise Randlicht trennt sie von den weißen Säulen; die Siedeglut unten ist der wärmste Punkt der Szene. |

Bilder: [Spiel](../bilder/Zugabe/waechter2/salz-eingesalzene.png), [Spiel Phase 2](../bilder/Zugabe/waechter2/salz-eingesalzene-phase2.png), [Kontaktbogen](../bilder/Zugabe/waechter2/bogen-a3.png), [Silhouetten gegen alle](../bilder/Zugabe/waechter2/silhouetten-gegen-alle-a3.png).
