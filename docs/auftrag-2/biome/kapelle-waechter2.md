# Die überflutete Kapelle: zweiter Wächter (Zugabe)

Ergänzung zu [alte-biome-1.md](alte-biome-1.md). Daten im Ergänzungspaket `prototype/data/biome/kapelle_plus.json` (`waechter_dazu: ["prediger"]`, Eintrag unter `foes`); der Seed wählt je Run zwischen der Glockenmutter und dem Prediger, die Wächter-Szene (Rundfenster, schräges Wasser) bleibt dieselbe. Format: [paket-format.md](../paket-format.md), Abschnitt „Zweite Wächter“.

## Zweiter Wächter: Der Prediger (`prediger`), 160 × 180

- **Idee:** Der Prediger von 1634 steht noch in der Kanzel, die schief im schrägen Wasser steht, unter dem Schalldeckel, an dem keine Wand mehr ist. Er ist mit jeder Predigt länger geworden, Rumpf und Hals, bis sein Kopf an den Deckel stieß; die Arme liegen ausgebreitet über der Brüstung, die Hände hängen außen herab bis unter den Korb. **Das falsche Detail:** An der Brüstung die Kanzelsanduhr (im 17. Jahrhundert maß sie die Predigt), und der Sand läuft nach oben; unten im Wasser brennt eine Kerze weiter. **Silhouette:** oben die breite Platte des Schalldeckels mit Behang und Bekrönung, darunter ein überlanger Mann, dessen Arme wie Spinnenbeine über den Kelch des Korbs greifen, der Korb auf einer gedrehten Säule, links die Treppe als Diagonale. **Unterschied zur Glockenmutter:** Sie ist eine schmale, aufrechte Gestalt mit Glocke als Kopf, er ein breites Möbel mit Mensch; sie schlägt gemischt und ruft Chorknaben, er ruft niemanden, kündigt jeden zweiten Zug einen sehr großen Schlag an und wechselt jeden Zug die Schwachstelle: Man muss im ruhigen Zug mit dem richtigen Stoff alles hineinwerfen und im lauten Zug decken.
- **Kniff:** `ansage` (1 Zug laden, dann 40): „Die Sanduhr läuft nach oben. Wenn sie voll ist, ist die Predigt zu Ende, und dann spricht er das Urteil.“
- **Besonderheit:** `schwach_wechsel` Wasser → Feuer → Glaube: Jede Woche predigt er gegen eine andere Sünde, und genau die trifft ihn.
- **Werte:** 165 Leben (er greift nur jeden zweiten Zug an, darum viel Leben); Muster aus der Ansage: laden, 40. Stimme `kultist` (gedämpfter Männerchor). Beute `bible`. Zone `kapelle_w2` (Körper Bernstein-Schwarz wie die Kapelle, **Randlicht kalt** `#58788e`/`#c4dcea`, das Licht vom Wasserspiegel): Die Wächter-Szene ist ganz Bernstein und Grün, ein kaltes Silberblau kommt dort nicht vor.
- **Sprite:** `tools/sprites/gegner/prediger.js`. Silhouetten-Probe `probe_aufrecht` (der Prediger aufrecht, Arme am Leib) verworfen: in Schwarz eine Lampe mit Schirm oder ein Pilz, Korb und Deckel ohne Mensch dazwischen. Der erste Deckel (flache Scheibe mit Zacken) las sich als fliegende Untertasse; jetzt Gesims, zweistufige Bekrönung mit Voluten und ein Behang aus Bögen. Korb mit Feldern und Rundbögen, Gesims mit Zahnschnitt, Talar mit Falten und Knopfreihe, helles Beffchen; inneres Licht: der Sand in der Sanduhr, die Augen unter dem Deckel, die Kerze unter Wasser. Angriff: Er reißt die Arme hoch bis an den Deckel (2 Bilder), dann schlägt er sich über die Brüstung nach links unten, die linke Hand fegt fast bis zum Boden. Tod: Er sinkt in den Korb, der Deckel kippt und fällt.
- **biom-test** (40 Seeds, 1–20 und 21–40): Glockenmutter 20/20, **Prediger 32/40 (80 %)**.

Bilder: im Spiel [kapelle-prediger.png](../bilder/Zugabe/waechter2/kapelle-prediger.png), Kontaktbogen aller zweiten Wächter von Akt II [bogen-a2.png](../bilder/Zugabe/waechter2/bogen-a2.png), Silhouetten gegen alle Sprites [silhouetten-gegen-alle-a2.png](../bilder/Zugabe/waechter2/silhouetten-gegen-alle-a2.png).

## Note (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Der Prediger | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Kanzel mit Deckel, Treppe und dem Mann mit den Spinnenarmen ist im Spiel einmalig und steht mit dem kalten Rand klar vor dem grünen Rundfenster; die Sanduhr ist das warme Licht daneben. Ärmel und Schultern wirken kastig, der Korb ist eine große dunkle Fläche, und dass der Sand nach oben läuft, sieht man nur in der Nähe. |

## Vorschlag an den Kern

- Die ersten Wächter des Akts liegen im biom-test inzwischen bei 85–100 % (Kapelle 20/20, Kloster 19/19, Grotte 20/20, Gießerei 17/20, Waisenhaus 17/19), weil die Decks aus Auftrag 2 im zweiten Akt rund 40–50 Schaden je Zug machen. Damit die zweiten Wächter bei 60–80 % liegen, haben sie 95–165 Leben; Prediger (165, greift nur jeden zweiten Zug an) und Ungeheilter (138) liegen über der Spanne 60–120 aus [paket-format.md](../paket-format.md). Besser wäre ein gemeinsamer Wächter-Faktor in `balance.json` (heute `waechter_faktor` 1,35), der für Akt II höher liegt, damit beide Wächter eines Bioms mit Werten im Rahmen ähnlich schwer sind.
