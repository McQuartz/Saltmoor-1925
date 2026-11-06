# Handgriffe, Sonderwirkungen, neue Eigenschaften (M4)

Daten: `prototype/data/handgriffe.json` (70 Handgriffe) und `prototype/data/items.json` (74 Items, davon 18 Reliquien). Plan: [04-deckbau.md](04-deckbau.md), Builds mit Beispieldecks: [builds.md](builds.md).

## 1. Felder der Handgriffe

Kartenfelder wie in `items.json` (`n`, `c`, `atk`, `h`, `all`, `blk`, `heal`, `poison`, `burn`, `weak`, `strip`, `draw`, `en`, `self`, `verbraucht`, `eroeffnung`) und die Schlagworte aus 04 Abschnitt 4 (`str`, `vuln`, `funke`, `kette`, `behalten`, `opfer`, `x`). Dazu:

| Feld | Bedeutung |
|---|---|
| `build` | `glutnest`, `brackwasser`, `bollwerk`, `aderlass`, `kettenwerk`, `hagel`, `neutral` |
| `rar` | `gewoehnlich` oder `selten` |
| `t` | ein Satz Flavor (Geste, Kniff) |
| `stoffe` | Stoffe, zu denen der Handgriff passt. **Nur Gewichtung** für die Handgriff-Wahl (2 von 3 passen zum Deck), er bekommt sie nicht. Neutrale haben keine. |
| `start` | Start-Handgriff (`stossen`, `ausweichen`, `durchatmen`, `abwarten`), nicht im Beutepool |
| `ziel` | `true`: braucht ein Ziel, wo die alte Ableitung (`atk` ohne `all`, `poison`, `burn`, `weak`, `strip`) nicht greift: alle mit `vuln` ohne `atk`, `Schüren`, `Ofentür`, `Faulen lassen`, `Kanzelschlag`, `Schulterstoß` |
| `unspielbar`, `nodrop` | nur `zittern` (Fluch, fest eingeritzt in Kultmaske und Laudanum) |
| `sonder` | Sonderwirkung, Abschnitt 2 |

**Annahmen zu den Schlagworten** (so sind die Werte gerechnet, passt zu deinem `combat.js`):

- **Kette n** erhöht `atk` um n je Reaktion dieses Zugs, hat die Karte kein `atk`, dann `blk`. Bei `all` gilt der Bonus für jedes Ziel.
- **X** (`x: true`, `c: 0` in den Daten): Die ganze Karte wirkt X-mal (X = Energie beim Ausspielen, danach 0). `self` zahlt man also X-mal (Rausch), und `Herz im Glas` gibt X-mal Stärke. Vorschlag: X-Karten mit `atk` zählen als Mehrfachangriff für den Patronengurt (X+1 Wiederholungen).
- **Opfer n**: immer `c: 0`. In der Kostenkurve als 0-Kosten gezählt (3 Karten: Bluteid, Aufschneiden, Handschnitt).
- **Funke auf 0-Kosten-Karten:** 04 Abschnitt 7 gibt `Funkenflug`, `Schwelle` und `Umschlagen` mit Kosten 0 **und** Funke. So stehen sie in den Daten, aber Funke wirkt dort nicht. **Vorschlag (deine Entscheidung):** diese drei auf `c: 1` setzen, dann ist Funke spürbar. Damit Funke trotzdem trägt, gibt es weitere Funke-Karten mit Kosten 1: Glimmen, Takt halten, Weiterreichen, Schwungrad, dazu die Stammkarten von Tarotkarten, Hexenflasche, Tiefling-Schuppe und Offenes Uhrwerk.
- **Zwei Stoffe:** `cardCost` schlägt heute für Karten mit zwei Stoffen `double_cost_extra` (1) auf. Gilt das auch für Handgriffe in seltenen Zwei-Stoff-Items, kostet z. B. Atemholen in der Teerfackel 1 und gibt 1 Energie (nutzlos). **Vorschlag:** Aufpreis nur für Stammkarten, Handgriffe nie. Die Reliquien haben darum nur einen Stoff.
- **`fest_hg`** belegt bei dir eine Kerbe (`hgVon` startet damit). Darum haben Kultmaske und Laudanum `kerben: 2`, also eine freie.
- **Startitems** sind gewöhnlich (1 Kerbe), drei Startitems = 3 Kerben, aber 4 Start-Handgriffe. Vorschlag: `durchatmen` steckt in der Kerbe des Talismans, der vierte wird über `jobs.json → hg` verteilt oder Startitems bekommen `kerbenPlus: 1` im Kleidungsstück. (Die Daten lassen das offen.)

## 2. Sonderwirkungen (`sonder.art`), 12 Arten

| `art` | Felder | Regel | Karten |
|---|---|---|---|
| `fx` | `fx` (Liste wie in `reactions.json`) | Führt die Effekte nach den übrigen Feldern mit `runFx` aus, `to: "target"` ist das gewählte Ziel. Wird **nicht** mit Verstärkt/Opfer multipliziert (wie eine Reaktion). Für Brand/Gift an allen und Schutz (`ward`). | Funkenflug, Flächenbrand, Hinabziehen, Schwelle, Kreidekreis, Kniefall |
| `brand_verdoppeln` | `alle` (optional) | Brand am Ziel × 2, mit `alle: true` an allen Gegnern. Läuft **nach** dem eigenen `burn` der Karte. | Schüren, Ofentür (`alle`) |
| `gift_verdoppeln` | | Gift am Ziel × 2 (nach dem eigenen `poison`). „Rein“ verhindert nichts, weil kein Gift dazukommt. | Faulen lassen |
| `schaden_gleich_block` | `anteil` (Standard 1) | Ein Treffer am Ziel mit Schaden = dein aktueller Block × anteil (abgerundet), Block bleibt. Die Karte hat **kein** `atk`; Stärke, Verwundbar, Schwachstelle, Verstärkt/Opfer wirken wie bei einem Angriff. Hinweis: `applyMain` greift heute nur bei `c.atk`, hier muss der Treffer auch ohne `atk` laufen. | Kanzelschlag, Schulterstoß (`anteil: 0.5`) |
| `block_verdoppeln` | | Dein Block × 2 (nach dem eigenen `blk`, falls vorhanden). Schutz (`ward`) zählt nicht. | Bannspruch |
| `gift_wandert` | | Markiert das Ziel bis Kampfende. Stirbt es mit Gift, geht sein ganzes Gift auf den lebenden Gegner mit dem wenigsten Gift über (gleich: der linke). Die Markierung wandert mit, also kann es mehrmals springen. | Ansteckung |
| `stoff_joker` | | Gegenlauf reagiert normal mit der Karte davor. Die **nächste** Karte in diesem Zug reagiert dann mit den Stoffen von Gegenlauf **und** zusätzlich mit allen Stoffen der Karte **vor** Gegenlauf, als lägen beide zusammen davor (Paare, Verstärkt und Hochreaktionen). Gilt nur für diese eine Karte. Für Funke zählt das mit. | Gegenlauf |
| `schaden_je_fehlleben` | `je` | `atk` + 1 je `je` fehlende Leben (max − aktuell, abgerundet), bei `all` an jedem Ziel. | Wunde Hand (`je: 5`), Letzter Tropfen (`je: 4`) |
| `zugende_hand` | `fx` | Liegt die Karte am Ende deines Zugs noch auf der Hand (sie hat `behalten`), werden die `fx` ausgeführt. Beim Ausspielen wirkt nur der Rest der Karte. | Sickern (Gift 1 an allen), Wache halten (Schutz 3) |
| `ueber_bord` | `max`, `je`, `draw` | Wirf bis zu `max` (ohne Angabe alle) unspielbare Karten von der Hand über Bord (verbraucht, zählt für `ballast_staerke`). `je`: so viel Schaden je geworfene Karte als Angriff (mit Stärke und Verwundbar); `draw`: so viele Karten ziehen, wenn mindestens eine ging. Zugabe 4. | Ausschaben (Radiermesser, `max 1`), Gewichte lösen (Bleigürtel, `max 1, draw 1`) |
| `x_plus` | `v` | Die X-Karte wirkt X + v-mal (auch bei X = 0 also v-mal). | Trommelfeuer (`v: 1`) |
| `lebensraub` | `anteil` | Du heilst `anteil` × den Schaden, der durch Block ging und Leben traf (abgerundet, mindestens 1, wenn Schaden ankam). | Durch die Zähne (`anteil: 0.5`) |
| `wiederholen` | | Die Karte, die du **direkt davor** in diesem Zug gespielt hast, wirkt noch einmal (ihre Felder und `sonder`, gleiches X, ohne Kosten, ohne erneute Reaktionen; ihr Ziel ist das aktuelle Ziel). Wiederholung selbst reagiert normal mit der Karte davor. Nichts davor gespielt oder davor wieder eine Wiederholung: wirkt nicht. | Wiederholung |

## 3. Eigenschaften der Items (`eigen.typ`)

Benutzt aus [paket-format.md](paket-format.md): `brand_haelt`, `energie_bleibt {v}`, `block_haelt_halb`, `reaktion_block {v}`, `hoch_zweimal`, `gift_doppelt`, `opfer_staerke`, `mehrfach_plus1`, `brand_springt`, `start_staerke {v}`, `start_block {v}`, `energie_plus {v, preis}`, `reaktion_heil {v}`, `verwundbar_start {v}`. `erste_karte_billiger` und `glueck` stehen bei Kompass und Hasenpfote weiter als `passiv` (nicht zusätzlich als `eigen`, sonst zählt `passive()` doppelt).

**Neu (wenig System, je eine Zeile Code):**

| `typ` | Felder | Regel | Items |
|---|---|---|---|
| `kampfstart_fx` | `fx` | Zu Kampfbeginn (nach dem Aufstellen der Gegner) `runFx(fx)`. | Zunderbüchse (Brand 3 an allen), Ehering (Gift 3 an allen) |
| `reaktion_schaden` | `v` | Jede ausgelöste Reaktion macht v Schaden an einem zufälligen lebenden Gegner (wie `reaktion_block`). | Hexenflasche (1), Offenes Uhrwerk (2) |
| `kette_start` | `v` | Jeder Zug beginnt mit `S.rxZug = v` (zählt nur für Kette, nicht für Statistik). | Die Knotenschnur (1) |
| `behalten_eine` | | Am Zugende darfst du eine Handkarte wählen, die liegen bleibt (Bot: die teuerste). | Kerbholz |
| `hand_plus` | `v` | +v Karten auf der Hand (wie das Set Detektiv, addiert). | Brille mit drei Gläsern |

`energie_plus` mit `preis: "hand"` (eine Karte weniger, hast du schon) bei der Uhr ohne Zeiger und `preis: "heil"` (keine Heilung nach dem Sieg, Vorschlag) beim Ewigen Licht. Mehr nicht im Pool.

## 4. Was sich an Items geändert hat

- **Gestrichen:** `plank` (Holzbrett, nur „6 Block“, nirgends referenziert). Sein Sprite nutzt jetzt das Kerbholz.
- **Neu:** `kohlenschaufel` (selten, `biom: "nachtzug"`, `brand_haelt`) und 18 Reliquien. Mit `biom` markiert: `ofen` (`fabrik`), `gezeitenrad` (`gezeitenwerk`), `kohlenschaufel` (`nachtzug`). **Die Biom-Pakete Fabrik, Gezeitenwerk und Nachtzug sollen diese IDs verwenden** (z. B. in `fundpool` oder `beute`) und sie nicht neu anlegen. Die Fabrik plant in `docs/auftrag-2/biome/fabrik.md` den Ofen mit „Glutkern: 1, Brand 4“, genau so steht er jetzt hier.
- **Gut und schlecht zugleich (2):** Kultmaske (Verstellen 0: 9 Block) und Laudanum (Tropfen 0: 12 Leben, verbraucht), beide mit `fest_hg: ["zittern"]` und `kerben: 2`.
- **Stammkarte umbenannt:** Gasmaske „Durchatmen“ heißt jetzt „Durch den Filter“ (Namensgleichheit mit dem Start-Handgriff).
- **Brackwasser-„Abwarten“** aus 04 7.2 (Block 3, Gift 1) heißt `lauern`, weil `abwarten` der Start-Handgriff ist (nur Block 3).
- Knochen (`bone`, Friedhofswärter bekommt nach jedem Sieg einen) hat `kerben: 0`, sonst wüchsen Kerben ohne Ende.
- Umgebaute Karten (Werte im alten Rahmen, aber mit Plan): siehe Tabelle in [builds.md](builds.md) Abschnitt 8.

## 5. Alle Handgriffe

| ID | Name | Kosten | Wirkung | Build | Seltenheit |
|---|---|---|---|---|---|
| `schueren` | Schüren | 1 | Brand am Ziel ×2 | glutnest | gewöhnlich |
| `funkenflug` | Funkenflug | 0 | Brand 1 an allen · Funke | glutnest | gewöhnlich |
| `nachlegen` | Nachlegen | 1 | Brand 3 · behalten | glutnest | gewöhnlich |
| `glimmen` | Glimmen | 1 | 2 Schaden, Brand 2 · Funke | glutnest | gewöhnlich |
| `zuendeln` | Zündeln | 0 | Brand 1, ziehe 1 | glutnest | gewöhnlich |
| `qualm` | Qualm | 0 | Brand 1, Geschwächt | glutnest | gewöhnlich |
| `brandmal` | Brandmal | 1 | Brand 2, Verwundbar 1 | glutnest | gewöhnlich |
| `glut_halten` | Glut in der Faust | 1 | 5 Block, Brand 1 | glutnest | gewöhnlich |
| `flaechenbrand` | Flächenbrand | 2 | 3 Schaden an allen, Brand 3 an allen | glutnest | selten |
| `ofentuer` | Ofentür | 3 | Brand an allen ×2 | glutnest | selten |
| `sickern` | Sickern | 1 | Gift 2, am Zugende auf der Hand: Gift 1 an allen · behalten | brackwasser | gewöhnlich |
| `ansteckung` | Ansteckung | 1 | Gift 4, stirbt das Ziel, wandert sein Gift | brackwasser | gewöhnlich |
| `lauern` | Lauern | 0 | 3 Block, Gift 1 | brackwasser | gewöhnlich |
| `spucken` | Spucken | 0 | Gift 2 | brackwasser | gewöhnlich |
| `umruehren` | Umrühren | 0 | Gift 1, ziehe 1 | brackwasser | gewöhnlich |
| `schlick` | Schlick werfen | 1 | Gift 2, Geschwächt | brackwasser | gewöhnlich |
| `bodensatz` | Bodensatz | 1 | Gift 3, ziehe 1 | brackwasser | gewöhnlich |
| `faulen_lassen` | Faulen lassen | 2 | Gift am Ziel ×2 | brackwasser | selten |
| `hinabziehen` | Hinabziehen | 2 | 2 Schaden an allen, Gift 3 an allen | brackwasser | selten |
| `kanzelschlag` | Kanzelschlag | 2 | Schaden = dein Block | bollwerk | selten |
| `standhalten` | Standhalten | 1 | 6 Block · behalten | bollwerk | gewöhnlich |
| `schwelle` | Schwelle | 0 | Schutz 3 · Funke | bollwerk | gewöhnlich |
| `gegenstemmen` | Gegenstemmen | 0 | 3 Block · behalten | bollwerk | gewöhnlich |
| `kreidekreis` | Kreidekreis | 0 | 2 Block, Schutz 2 | bollwerk | gewöhnlich |
| `kniefall` | Kniefall | 1 | 4 Block, Schutz 4 | bollwerk | gewöhnlich |
| `weihen` | Weihen | 1 | 4 Block, 3 Leben | bollwerk | gewöhnlich |
| `wache` | Wache halten | 1 | 4 Block, am Zugende auf der Hand: Schutz 3 · behalten | bollwerk | gewöhnlich |
| `schulterstoss` | Schulterstoß | 1 | Schaden = 50 % deines Blocks | bollwerk | gewöhnlich |
| `bannspruch` | Bannspruch | 2 | dein Block ×2 | bollwerk | selten |
| `bluteid` | Bluteid | 0 | Opfer 3, +2 Energie | aderlass | selten |
| `aufschneiden` | Aufschneiden | 0 | Opfer 2, ziehe 2 | aderlass | gewöhnlich |
| `handschnitt` | Handschnitt | 0 | Opfer 1, 4 Schaden | aderlass | gewöhnlich |
| `wunde_hand` | Wunde Hand | 1 | 4 Schaden, +1 Schaden je 5 fehlende Leben | aderlass | gewöhnlich |
| `durch_die_zaehne` | Durch die Zähne | 1 | 5 Schaden, heilt 50 % des Schadens | aderlass | gewöhnlich |
| `abbinden` | Abbinden | 1 | 3 Block, 4 Leben | aderlass | gewöhnlich |
| `blutzoll` | Blutzoll | 1 | Stärke 2, 2 Leben zahlen | aderlass | gewöhnlich |
| `letzter_tropfen` | Letzter Tropfen | 2 | 5 Schaden an allen, +1 Schaden je 4 fehlende Leben | aderlass | selten |
| `rausch` | Rausch | X | 5 Schaden, 1 Leben zahlen | aderlass | selten |
| `umschlagen` | Umschlagen | 0 | ziehe 1 · Funke | kettenwerk | gewöhnlich |
| `einrasten` | Einrasten | 0 | 2 Block, Kette 1 | kettenwerk | gewöhnlich |
| `antippen` | Antippen | 0 | 2 Schaden, Kette 1 | kettenwerk | gewöhnlich |
| `fortsetzen` | Fortsetzen | 1 | 3 Schaden, Kette 3 | kettenwerk | gewöhnlich |
| `takt_halten` | Takt halten | 1 | 3 Block, Kette 2 · Funke | kettenwerk | gewöhnlich |
| `weiterreichen` | Weiterreichen | 1 | ziehe 2 · Funke | kettenwerk | gewöhnlich |
| `schwungrad` | Schwungrad | 1 | +1 Energie · Funke | kettenwerk | gewöhnlich |
| `gegenlauf` | Gegenlauf | 1 | die nächste Karte reagiert auch mit der Karte davor | kettenwerk | selten |
| `wiederholung` | Wiederholung | 2 | die Karte davor wirkt noch einmal | kettenwerk | selten |
| `laeutwerk` | Läutwerk | 3 | 4 Schaden an allen, Kette 3 | kettenwerk | selten |
| `anschlagen` | Anschlagen | 0 | Verwundbar 1 | hagel | gewöhnlich |
| `durchladen` | Durchladen | 0 | Stärke 1 · verbraucht | hagel | gewöhnlich |
| `nachladen` | Nachladen | 1 | Stärke 2 · behalten | hagel | gewöhnlich |
| `zweimal` | Zweimal | 1 | 3 × 2 Schaden | hagel | gewöhnlich |
| `kurze_stoesse` | Kurze Stöße | 1 | 2 × 3 Schaden | hagel | gewöhnlich |
| `zielen` | Zielen | 1 | Verwundbar 2, ziehe 1 | hagel | gewöhnlich |
| `abrollen` | Abrollen | 1 | 5 Block, ziehe 1 | hagel | gewöhnlich |
| `salve` | Salve | 2 | 3 × 2 Schaden an allen | hagel | selten |
| `trommelfeuer` | Trommelfeuer | X | 3 Schaden, wirkt X+1-mal | hagel | selten |
| `stossen` | Stoßen | 1 | 5 Schaden · Start | neutral | gewöhnlich |
| `ausweichen` | Ausweichen | 1 | 5 Block · Start | neutral | gewöhnlich |
| `durchatmen` | Durchatmen | 0 | ziehe 1 · Start | neutral | gewöhnlich |
| `abwarten` | Abwarten | 0 | 3 Block · Start | neutral | gewöhnlich |
| `atemholen` | Atemholen | 0 | +1 Energie · verbraucht | neutral | selten |
| `kratzen` | Kratzen | 0 | 3 Schaden | neutral | gewöhnlich |
| `aufhebeln` | Aufhebeln | 1 | 4 Schaden, Block zerbricht | neutral | gewöhnlich |
| `nachsetzen` | Nachsetzen | 1 | 4 Schaden, ziehe 1 | neutral | gewöhnlich |
| `finte` | Finte | 1 | 3 Schaden, Geschwächt | neutral | gewöhnlich |
| `sich_sammeln` | Sich sammeln | 1 | 4 Block, 2 Leben | neutral | gewöhnlich |
| `umsehen` | Umsehen | 1 | ziehe 2 | neutral | gewöhnlich |
| `rundumschlag` | Rundumschlag | 2 | 6 Schaden an allen | neutral | selten |
| `zittern` | Zittern | 0 | unspielbar | neutral | gewöhnlich |
