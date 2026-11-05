# Moorwald (`moor`) · Zweiter Wächter: Das Moorpferd (`moorpferd`)

Zugabe zu Auftrag 2. Daten im Ergänzungspaket `prototype/data/biome/moor_plus.json` (`waechter_dazu`, Gegner unter `foes`), Sprite `tools/sprites/gegner/moorpferd.js`, Zone `tools/sprites/zonen/moor_pferd.json`. Der Seed wählt je Run zwischen dem Opfernden und dem Moorpferd; die Wächter-Szene im Steinkreis bleibt dieselbe. Alles per Skript gezeichnet (`quelle: skript`).

## Idee

- **Wer:** der Kaltblüter der Torfstecher, der 1881 mit dem vollen Torfwagen am Steinkreis eingebrochen ist.
- **Das falsche Detail:** Er steht wieder, bis über die Hufe im Moor, auf Beinen doppelt so lang wie die eines Pferdes. Die Zugstränge und die Leine laufen vom Kummet straff schräg nach unten ins Moor: Unten hält sie jemand und fährt. Der Kopf ist blank bis auf den Knochen, am Kummet hängt noch die Laterne der Torfstecher.
- **Silhouette:** ein schwerer Pferdeleib hoch auf vier Stelzenbeinen, der Kopf hängt vorn tief am langen Hals, das Kummet als Ring, der Schweif bis fast zum Boden, zwei straffe Linien nach hinten unten.
- **Proben:** ein Pferd mit gewöhnlichen Beinen und erhobenem Kopf (schwarz ein Reiterdenkmal ohne Reiter, nichts Falsches daran). Genommen: Stelzen und der hängende Kopf. Gegen alle Sprites geprüft: Steinhirsch (Wald) steht ähnlich auf vier Beinen, hat aber den Kopf oben und das Geweih.
- **Anders als der Opfernde:** Der Opfernde ist ein Steinhaufen mit einem Arm, er blockt und **ruft** Nester. Das Moorpferd ist ein Tier, schlägt hart und **hält fest**: Kniff `einfrieren` (das Moor hält jeden Zug eine deiner Karten fest), Besonderheit `schwach_wechsel` zwischen **Feuer** (Torf brennt) und **Blut** (an der Luft wird es wieder Pferd). Man muss jeden Zug den richtigen Stoff haben, mit einer Karte weniger.

## Kampf

- **Werte:** 104 Leben, Schwachstelle wechselt Feuer ↔ Blut. Muster 17, 3 × 7, Block 12, Stärke +4, 26. Die Leben liegen über der Spanne 45–80 aus dem Paket-Format: Der Moorwald ist im Autospieler der leichteste Akt-I-Ort (mit dem Opfernden 20 von 20), und erst so fällt der Wächter ins Ziel.
- **Stimme:** `torfstecherin`. **Beute:** Glas mit Moorwasser.
- **Licht:** eigene Zone `moor_pferd`: die violetten Körperstufen des Moorwalds, Randlicht **warmes Torfgold** (die Szene hat nur Flieder und Moorgrün). Inneres Licht: das grüne Irrlicht in der Laterne und in der Augenhöhle; die Laterne spiegelt sich in der Lache.
- **biom-test (20 Seeds):** Opfernder 20/20 (100 %), Moorpferd 15/20 (75 %).

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Das Moorpferd (`moorpferd`) | 5 | 4 | 4 | 5 | 4 | 4 | **4** | Das Stelzenpferd mit dem tief hängenden Schädel ist schwarz sofort lesbar und unheimlich, die straffen Stränge ins Moor erzählen das falsche Detail ohne Text. Schwächen: Die vielen dünnen Beine tragen viel Randlicht und wirken wie Stäbe; der Rumpf ist eine ruhige dunkle Fläche mit nur angedeuteten Rippen. |
| Im Spiel (Wächter-Szene) | | | | | | 4 | **4** | Steht mitten im Steinkreis vor dem Sternhimmel, das goldene Randlicht trennt Leib und Beine von den fliederfarbenen Steinen. Schwäche: Der tief hängende Kopf liegt vor dem dunklen Altarstein und ist dort nur über Auge und Laterne zu lesen. |

Bilder: [Spiel](../bilder/Zugabe/waechter2/moor-moorpferd.png), [Kontaktbogen](../bilder/Zugabe/waechter2/bogen-a1.png).
