# Spieldaten

Alle Werte des Spiels liegen hier als JSON. Der Browser-Prototyp liest sie beim Start ein, und die Godot-Version soll dieselben Dateien einlesen. Wer Balance ändern will, ändert nur diese Dateien, nicht den Code.

Kurze Feldnamen sind Absicht (aus dem Prototyp übernommen). Die Tabelle unten erklärt sie.

## stoffe.json

| Feld | Bedeutung |
|---|---|
| `stoffe.<K>` | Ein Stoff mit Kürzel K (E, F, W, S, B, G, L, V): `n` Name, `s` Zwei-Buchstaben-Etikett, `c` Farbe |
| `suffix.<K>` | Namensendung beim Verschmelzen, z. B. "Harpune" + Feuer = "Harpune der Glut" |
| `areas` | Die drei Ausrüstungsbereiche: `waffe`, `kleidung`, `talisman` |
| `area_names` | Anzeigenamen der Bereiche |

## items.json

Schlüssel = Item-ID.

| Feld | Bedeutung |
|---|---|
| `n` | Name |
| `a` | Bereich (`waffe`, `kleidung`, `talisman`) |
| `st` | Stoffe. Normal genau einer, seltene Items zwei |
| `spr` | Sprite-Name in `js/sprites/items.js` |
| `cards` | Karten, die das Item im Kampf ins Deck gibt (siehe unten) |
| `hp` | optional: mehr maximales Leben, solange angelegt |
| `rare` | optional: seltenes Premium-Item (gold umrandet, ab Tiefe 4) |
| `nodrop` | optional: kommt nie als Fund (z. B. Knochen vom Friedhofswärter) |

Karte: `n` Name, `c` Energiekosten, `atk` Schaden, `h` Anzahl Treffer, `all` trifft alle Gegner, `blk` Block, `heal` Heilung, `poison` Gift, `burn` Brand, `draw` Karten ziehen, `en` Energie zurück, `self` kostet so viel eigenes Leben. Karten von Items mit zwei Stoffen kosten automatisch `balance.forge.double_cost_extra` mehr.

## foes.json

Schlüssel = Gegner-ID. `n` Name, `hp` Leben auf Tiefe 1, `weak` Schwachstelle (Stoff, 1,5-facher Schaden), `spr` Zeichner in `js/sprites/foes.js`, `pat` Muster der Züge der Reihe nach: `{t:"atk", v, h}` Angriff, `{t:"blk", v}` Schutz, `{t:"buff", v}` Stärke. Beim Boss legt `variant` fest, welcher Entwurf gezeichnet wird (`eye`, `maw`, `king`).

## reactions.json

* `pairs`: zwei Stoffe, `k` = beide Kürzel alphabetisch (z. B. "EF"). Sie reagieren, wenn zwei Karten direkt nacheinander gespielt werden oder beide Stoffe in einer Karte stecken.
* `same`: gleicher Stoff zweimal hintereinander.
* `triples`: Hochreaktionen, `s` = drei Kürzel. Höchstens einmal pro Zug.

Jede Reaktion hat `n` Name, `t` Text für Spieler, `fx` Effektliste und optional `pre` (wirkt auf die Karte selbst: `mult` Multiplikator, `repeat` Karte mehrfach, `self_damage` eigener Schaden).

### Effekte (`fx`)

| op | Felder | Wirkung |
|---|---|---|
| `damage` | `to`, `v` | Schaden |
| `status` | `to`, `status`, `v` | `burn`, `poison` erhöhen; `weak` halbiert den nächsten Angriff |
| `block` | `v` | Block jetzt |
| `ward` | `v` | Block zu Beginn des nächsten Zugs |
| `heal` | `v` | Heilung |
| `energy` | `v` | Energie |
| `break_block` | `to` | Block des Ziels auf 0 |
| `poison_burst` | `to`, `mult` | Gift sofort als Schaden (× mult), Gift weg |
| `poison_mult` | `to`, `mult` | Gift vervielfachen |
| `give_random` | | zufälliges Item in den Rucksack |
| `give_item` | `item` | bestimmtes Item |
| `add_slot` | `area` | ein Slot mehr in dem Bereich |
| `max_hp` | `v` | maximales Leben dauerhaft |
| `lose_hp` | `v` | Leben verlieren (nie unter 1) |
| `full_heal` | | voll heilen |

`to` ist `target` (aktuelles Ziel) oder `all` (alle Gegner). Der Interpreter steht in `js/core/rules.js` → `runFx`.

## events.json

Ereignisse zwischen den Kämpfen. `t` Titel, `d` Text, `o` Optionen: `l` Beschriftung, `fx` Effekte (siehe oben), optional `if` Bedingung (`slot_below_max: <bereich>`).

## roles.json

Rollen-Sets: `n` Name, `i` die drei Item-IDs, `t` Text, `bonus` Wirkung, wenn alle drei angelegt sind:

| type | Felder | Wirkung |
|---|---|---|
| `after_victory_item` | `item` | Item nach jedem Sieg |
| `stoff_flat` | `stoff`, `amount` | Karten mit dem Stoff: + amount Schaden/Block |
| `stoff_block` | `stoff`, `amount` | Karten mit dem Stoff geben zusätzlich Block |
| `hand_size` | `amount` | mehr Handkarten |
| `stoff_free` | `stoff` | Karten mit dem Stoff kosten 0 |
| `every_nth_mult` | `n`, `mult` | jede n-te Karte im Zug wirkt mult-fach |

## jobs.json

Startfiguren: `n`, `d`, Start-Items je Bereich (`w`, `k`, `t`) und im Rucksack (`bag`).

## balance.json

Zahlen für den ganzen Run: Startwerte, Gold, Gegnerskalierung, Begegnungen pro Tiefe, Funde, Werkstatt/Krämer/Ereignis-Rhythmus (`every`, `offset`: erscheint nach Tiefe d, wenn d mod every = offset), Verschmelzen (`forge`), Zonen und Jumpscare-Zeitfenster in Minuten.

## ideas.json

Entwürfe, die noch nicht im Spiel sind. Nur `artboard.html` liest diese Datei (Abschnitt „Ideen“), das Spiel nicht. Eine Liste von Einträgen:

| Feld | Bedeutung |
|---|---|
| `n` | Name |
| `kind` | optional: `item`, `reaktion`, `gegner`, `mechanik` … (wird als Etikett gezeigt) |
| `d` | Beschreibung, was die Idee tut |
| `st` | optional: Stoffe wie bei items.json |
| `a` | optional: Bereich (`waffe`, `kleidung`, `talisman`) |
| `spr` | optional: vorhandenes Sprite aus `js/sprites/items.js` als Platzhalter |
| `px` | optional: eigenes 12×12-Raster mit den Buchstaben aus `PAL` (wie in `SPR`), geht vor `spr` |
| `cards` | optional: Karten im selben Format wie bei items.json |
| `notes` | optional: offene Fragen, Balance-Gedanken |

Wird eine Idee umgesetzt, wandert sie nach items.json (bzw. reactions.json, foes.json …) und fliegt hier raus.
