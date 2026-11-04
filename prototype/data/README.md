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

### Neue Kartenfelder (M9)

| Feld | Bedeutung |
|---|---|
| `eroeffnung` | Bonus, wenn die Karte als **erste im Zug** gespielt wird. Enthält normale Kartenfelder, Zahlen werden addiert, z. B. `{"atk": 5}`, `{"draw": 1}`, `{"en": 1}`, `{"heal": 3}` |
| `verbraucht` | `true`: Die Karte ist nach dem Ausspielen für den Rest des Kampfes weg (Ablage „verbraucht“). Das Item bleibt angelegt. Für Dynamit, Rum, Laudanum, Riechsalz, Spieluhr |
| `weak` | Ziel geschwächt: sein nächster Angriff halbiert |
| `strip` | Block des Ziels fällt auf 0 |

`poison`, `burn`, `weak` und `strip` wirken auf das aktuelle Ziel, auch wenn die Karte mit `all` alle Gegner trifft.

### Passive Talismane (`passiv`)

Talismane ohne Karte: `"cards": []` und `"passiv": {"typ": …}`. Sie belegen einen Slot, geben aber keine Karte ins Deck.

| typ | Felder | Wirkung |
|---|---|---|
| `gold_bonus` | `v` | mehr Gold nach jedem Sieg |
| `start_block` | `v` | Block zu Beginn jedes Kampfes |
| `heil_nach_sieg` | `v` | Heilung nach jedem Sieg |
| `erste_karte_billiger` | | die erste Karte im Kampf kostet 0 (Kompass) |
| `glueck` | | ein Fund hat ein Item mehr zur Auswahl (Hasenpfote) |

## foes.json

Schlüssel = Gegner-ID (auch Schlüssel der Gegnerstimme in music.js). Konzepte: `docs/auftrag/gegner.md`.

| Feld | Bedeutung |
|---|---|
| `n`, `hp`, `weak` | Name, Leben auf Tiefe 1 (normale Gegner skalieren mit der Tiefe, Wächter und Boss nicht), Schwachstelle (Stoff, 1,5-facher Schaden) |
| `pat` | Muster der Züge der Reihe nach: `{t:"atk", v, h}` Angriff, `{t:"blk", v}` Schutz, `{t:"buff", v}` Stärke |
| `biom`, `rang` | Biom; `normal`, `waechter` oder `boss` |
| `sprite`, `varianten` | Sheet-Namen in `assets/gegner/` (Format siehe `docs/auftrag/sprites.md`); pro Kampf wird eine Variante per Seed gewählt |
| `konzept`, `stimme` | Kurzfassung des Konzepts; Stimme in music.js |
| `beute` | Item-ID, die nach dem Sieg mit kleiner Chance in der Auswahl liegt |
| `besonders` | Wächter/Boss: `{art:"ruft", gegner, alle}` (ruft alle n Züge Verstärkung), `{art:"schwach_wechsel", stoffe}` (wechselt die Schwachstelle jeden Zug), `{art:"phasen", bei:[0.66,0.33], muster:[…], sprites:[…], schwach:[…], ruft:{gegner, alle, anzahl}}` (Boss) |

Sprites erzeugen und prüfen: `node tools/sprites/bauen.js`, `node tools/sprites/pruefen.js`.

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

### Weitere Effekte für Ereignisse (M9)

| op | Felder | Wirkung |
|---|---|---|
| `heal` | `v` | Leben heilen (auch außerhalb des Kampfes) |
| `gold` | `v` | Gold dazu; negativ = Preis (nie unter 0) |
| `give_rare` | | zufälliges seltenes Item |
| `max_hp` | `v` | darf negativ sein (Preis) |
| `strike` | | der Spieler wählt eine Karte, die gestrichen wird; ihr Item bleibt angelegt und zählt für Sets und Leben, gibt aber keine Karte mehr |
| `transform` | | ein zufälliges angelegtes Item verwandelt sich in ein anderes desselben Bereichs |
| `fight` | `foes` (optional) | startet nach dem Ereignis einen Kampf mit diesen Gegnern des Bioms (IDs aus foes.json); ohne `foes` zufällige Gegner des Bioms |
| `discover` | | eine zufällige, noch unentdeckte Reaktion wird entdeckt |

## events.json

Ereignisse zwischen den Kämpfen. `t` Titel, `d` Text, `o` Optionen: `l` Beschriftung, `fx` Effekte (siehe oben), optional `if` Bedingung (`slot_below_max: <bereich>`).

Seit M9 ist die Datei eine Liste mit diesen Feldern je Ereignis:

| Feld | Bedeutung |
|---|---|
| `id` | eindeutige ID, auf die `biomes.json` → `ereignisse` verweist (Präfix = Biom, z. B. `hafen_netze`) |
| `biom` | `hafen`, `moor`, `kapelle`, `salz`, `stadt`, `eis` oder `alle` (kann überall kommen) |
| `t`, `d` | Titel und Text (2–4 Sätze, keine Erklärungen) |
| `bild` | ein Satz, was die Szene zeigt (Vorlage für das Ereignisbild) |
| `stummfilm` | optional `true`: löst beim Öffnen das Stummfilm-Rauschen aus. Nur für wenige, besonders starke Momente (höchstens drei im Spiel) |
| `o` | zwei bis drei Optionen: `l` Beschriftung mit Preis und Folge, `fx` Effekte, optional `if` |

Bedingungen in `if`: `{"slot_below_max": "<bereich>"}` (Bereich hat noch Platz), `{"gold_min": 20}` (mindestens so viel Gold), `{"hp_min": 10}` (mindestens so viel Leben). Ist die Bedingung nicht erfüllt, ist die Option gesperrt.

## fragmente.json

Die 21 Wandbild-Fragmente (drei je Biom), Grundlage der runübergreifenden Progression. Lesefassung: `docs/auftrag/fragmente.md`.

| Feld | Bedeutung |
|---|---|
| `id` | `<biom>_<1–3>` |
| `biom` | `hafen`, `moor`, `kapelle`, `salz`, `stadt`, `eis`, `pforte` |
| `titel` | Überschrift auf dem Zettel |
| `text` | 2–4 Sätze, Bruchstück der Geschichte der Tiefe |
| `relief` | ein Satz, was das Relief zeigt (Vorlage für das prozedurale Bild) |
| `schaltet` | was das Lesen freischaltet: `{"art": "item", "id": "<item-id>"}` (Item kommt in den Fundpool), `{"art": "figur", "id": "<job-id>"}` (erzählerischer Hinweis; die Figur selbst schaltet über die Zahl gelesener Fragmente frei, siehe `jobs.json` → `frei_ab`) oder `{"art": "satz"}` (nur ein Satz im Tagebuch) |

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

Die sechs Startfiguren. `id` (Schlüssel, auch für die Musik), `n` Name, `d` Kurztext, `set` Name des Sets in roles.json, `ausrede` (Startzeile), `wahrheit` (Schlusszeile bei der Ankunft), `vorliebe` (`hafen` oder `moor`: Einstieg mit 70 %), `instrument`, `musik` (Rollen-Schlüssel in music.js), `frei_ab` (Zahl gelesener Fragmente, ab der die Figur wählbar ist), Start-Items je Bereich (`w`, `k`, `t`) und im Rucksack (`bag`).

## run.json

Aufbau eines Runs (`js/core/run.js`).

| Feld | Bedeutung |
|---|---|
| `akte` | Die fünf festen Akte. `n`, `titel`, `biome` (eins oder zwei zur Wahl), `wahl` (`figur`: Vorliebe der Figur mit Wahrscheinlichkeit `vorliebe`; `seed`: 50/50), `ebenen` (Schlüssel in `ebenen`) |
| `ebenen.<k>` | Regel für die Weg-Wahl einer Ebene: `pool` (Knotenarten, aus denen gezogen wird), `wege` [min, max], `mindestens` {art: n}, `verschiedene` (Mindestzahl verschiedener Arten), `einer_von` (mindestens eine dieser Arten), `fest` (genau dieser Knoten), `fest_wahl` (genau diese Wege) |
| `kaempfe.zahl` | Gegnerzahl je Akt (Zeile) und Ebene (Spalte); `schwer_extra` Gegner mehr beim schweren Kampf |
| `knoten.<art>` | Anzeigename `n` und Pixelzeichen `zeichen` je Knotenart: `kampf`, `kampf_schwer`, `ereignis`, `wandbild`, `kraemer`, `werkstatt`, `rast`, `fundstelle`, `waechter`, `finale` |
| `rast.heil_anteil` | Heilung beim Schlafen (Anteil vom maximalen Leben) |
| `fundstelle` | `gold` [min, max], `haken_chance`, `haken_schaden` |
| `strand`, `ankunft` | Texte nach Niederlage und nach dem Finale (Bleiben/Umkehren) |
| `startvarianten` | Runübergreifend freischaltbar (`ab_akt`: beim ersten Erreichen dieses Akts, 0 = Akt I), `fx` wie bei Ereignissen |
| `stufen` | Schwierigkeitsstufen nach dem ersten Sieg: `hp_je_stufe`, `atk_alle_n_stufen`, `max` |

## biomes.json

Die sieben Biome (Schlüssel `hafen`, `moor`, `kapelle`, `salz`, `stadt`, `eis`, `pforte`).

| Feld | Bedeutung |
|---|---|
| `n`, `kurz`, `zeit` | Name, Kurzname, Zeitschicht |
| `koerper`, `rand`, `augen`, `nebel` | Palette: 4 dunkle Körperstufen, 2 Randlicht-Stufen, Augenfarbe, Nebel fern/nah |
| `musik` | Biom-Schlüssel in music.js |
| `szene_alt` | alte Zone aus `js/scenes/zones.js` (nur noch Galerie) |
| `gegner`, `waechter` | IDs aus foes.json |
| `fundpool` | Item-IDs, aus denen Funde, Krämer und Ereignisse ziehen (Items aus Fragmenten kommen nach dem Lesen dazu) |
| `ereignisse` | ungenutzt, Ereignisse hängen über `biom` in events.json am Biom |
| `kraemer` | `n` Name, `ort`, `zeile` (Charakter) |
| `uebergang` | Satz beim Abstieg aus diesem Biom in den nächsten Akt |
| `weg_hinweise.<art>` | Hinweistexte auf der Weg-Wahl je Knotenart |

## balance.json

Zahlen für den ganzen Run: `start_hp`, `energy_per_turn`, `hand_size`, `start_slots`, `max_slots`, `bag_size`, `victory_heal_pct`, Gold (`gold_per_victory`, `waechter_belohnung`), Gegnerskalierung (`enemy_scaling`: nur normale Gegner, Wächter und Boss sind je Akt ausgelegt), Funde (`rewards`), Krämer (`shop`, inklusive `streichen_preis`), Verschmelzen (`forge`), `card_copies` (wie oft jede Karte eines Items ins Deck kommt), `stummfilm` (Dauer, Mindestabstand, Stärke der Viragierung, Körnung, Kratzer, Flackern) und `jumpscare` (höchstens einmal pro Run, nicht vor Minute n, Zeitfenster).

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
| `status` | optional: `übernommen` (ist im Spiel, Werte können abweichen, siehe items.json) oder `gestrichen (Sog)` (hing an der gestrichenen Sog-Mechanik) |

Wird eine Idee umgesetzt, wandert sie nach items.json (bzw. reactions.json, foes.json …) und fliegt hier raus.

## audio.json

Die Klangliste (`klangliste.html`): alle Audiodateien, die wir für Musik und Effekte selbst aufnehmen oder bauen müssen.

| Feld | Bedeutung |
|---|---|
| `regeln` | Vorgaben für alle Dateien (Format, Tempo, Länge, Pegel, Namen, keine KI) |
| `biome` | Musik je Biom: `key` Tonart, `chords` Akkordfolge, `dark` gekippte Folge, `vibe`, `labor` = gibt es schon im Musik-Labor |
| `proBiom` | Spuren, die jedes Biom braucht (Layer 0–4, Stinger): `takte` oder `sek`, `var` Varianten, `vv` Beschreibung je Variante, `prio`, `probe` = was „Anhören“ in `music.js` abspielt |
| `assets` | einzelne Instrumente und Effekte: `gruppe` (`rolle`, `gegner`, `instrument`, `sfx`), `fuer`, `art` (`Sampler`, `One-Shot`), `noten` (Sampler-Bereich), `sek`, `anz` Varianten, `prio`, `probe` |
