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

**Auftrag 3 (M4):** `koerper` = Anschlusspunkte der Fächer im Rucksack „Am Körper“ in Pixeln der Silhouette (`assets/figuren/<id>.png`, 110 × 172): `hals` (Talismane), `leib` (Kleidung), `hand` (Waffen und Schilde). Die Silhouetten baut `node tools/sprites/figuren.js` aus `tools/sprites/figuren/<id>.js`, das Werkzeug schreibt dieselben Punkte nach `assets/figuren/<id>.json`; `tools/test-rucksack.js` prüft, dass sie auf der Figur liegen.

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

Zusatz (M4): `waechterStimmen` listet die Wächter-Stimmen. Sie haben keine eigene Aufnahme, sondern spielen die Stimme ihres Bioms eine Oktave tiefer und gedoppelt.


Die Klangliste (`klangliste.html`): alle Audiodateien, die wir für Musik und Effekte selbst aufnehmen oder bauen müssen.

| Feld | Bedeutung |
|---|---|
| `regeln` | Vorgaben für alle Dateien (Format, Tempo, Länge, Pegel, Namen, keine KI) |
| `biome` | Musik je Biom: `key` Tonart, `chords` Akkordfolge, `dark` gekippte Folge, `vibe`, `labor` = gibt es schon im Musik-Labor |
| `proBiom` | Spuren, die jedes Biom braucht (Layer 0–4, Stinger): `takte` oder `sek`, `var` Varianten, `vv` Beschreibung je Variante, `prio`, `probe` = was „Anhören“ in `music.js` abspielt |
| `assets` | einzelne Instrumente und Effekte: `gruppe` (`rolle`, `gegner`, `instrument`, `sfx`), `fuer`, `art` (`Sampler`, `One-Shot`), `noten` (Sampler-Bereich), `sek`, `anz` Varianten, `prio`, `probe` |

## Fremdcode: pixelfx

Pixel-Effekte (Treffer, Block-Splitter, Grundlage für Tod/Zerfall) kommen teilweise aus **pixelfx**, als kopierter Code ohne npm und ohne Build-Schritt (Briefing Abschnitt 9).

- Quelle: https://github.com/patch-gg/pixelfx, Stand Commit `a84159688af3ca37a4be05a0d422b94451b2e24e` (31.10.2026), Version 0.3.0. Übernommen am 04.11.2026.
- Lizenz: MIT, Copyright (c) 2026 Patch und Copyright (c) 2026 Hugo Duprez; Teile nach Sprite Fusion (Hugo Duprez, MIT) und Hollow Crown (rehan-remade, MIT). `LICENSE` und `NOTICE.md` liegen unverändert in `js/vendor/pixelfx/`.
- Kopiert nach `prototype/js/vendor/pixelfx/` (gleiche Struktur wie im Repo, unverändert): `src/core/*.js` (ganzer Kern), `src/fx/impacts/_lib.js`, `src/fx/impacts/hit-spark.js` (`treffer`), `src/fx/impacts/blunt-hit.js` (`treffer_gross`), `src/fx/impacts/shield-block.js` (`block_splitter`), `src/fx/spawn/_lib.js` und `src/fx/status/_lib.js` (Hilfsfunktionen für die eigenen Effekte).
- **Nicht** übernommen: die Schrift aus `gallery/fonts` (nicht MIT), alle übrigen Effekte, Werkzeuge, Galerie.
- Eigene Effekte im pixelfx-Format liegen in `js/fx/eigene.js` (brand, gift, geschwaecht, block_auf, heilen, reaktion, hochreaktion, uebergang) und `js/fx/zerfall.js` (`tod`, angepasst aus pixelfx `spawn/disintegrate`, MIT-Hinweis im Kopf der Datei). `js/fx/bruecke.js` lädt alles als ES-Modul und setzt `window.PixelFX`; `js/fx/effekte.js` ist die Schnittstelle `PFX` fürs Spiel. Test und Kontaktbogen: `effekte.html`, `node tools/effekte-kontakt.js`.


## Auftrag 2: Deckbau und Biom-Pakete

### Biom-Pakete (`data/biome/index.json`, `data/biome/<id>.json`)

Neue Biome kommen als Pakete: `index.json → pakete` listet die IDs, jede `<id>.json` enthält `id`, `akt` (0–4), `biom` (Felder wie in biomes.json), `musik` (Harmonie und Ortsklang für `Music.addBiome`), `foes`, `events`, `items`, optional `handgriffe`, `skripte` (Hintergrund-Skripte, die `main.js` nachlädt). `data.js` führt alles beim Start zusammen. Vollständiges Format und Arbeitsweise: `docs/auftrag-2/paket-format.md`.

### biomes.json (neue Felder)

`akt` (in welchem Akt das Biom vorkommt), `anreise` (Satz für die Biom-Wahl), `beute_saetze` (Sätze unter dem Gold nach einem Sieg, nie zweimal hintereinander derselbe).

### run.json (Auftrag 2)

`akte[].biome` sind jetzt Listen; am Aktanfang bietet das Spiel zwei davon zur Wahl (Akt I: Vorliebe der Figur + eins per Seed). Akte I–IV haben 6 Ebenen plus Wächter (`e1`–`e6`, `waechter`), Akt V `vorraum`, `rast`, `finale`. `kaempfe.zahl` hat je Akt 6 Einträge.

### handgriffe.json

Handgriffe sind Karten **ohne eigenen Stoff**: Sie stecken in einer Kerbe eines Items und nehmen dessen Stoffe an. `n`, `c`, Kartenfelder wie bei items.json, dazu die Schlagworte:

| Feld | Wirkung |
|---|---|
| `str` | Stärke n für dich bis Kampfende (+n Schaden je Treffer) |
| `vuln` | Ziel verwundbar n Züge (+50 % Schaden) |
| `funke` | kostet 0, wenn die Karte eine Reaktion auslöst |
| `kette` | +n Wirkung (Schaden, sonst Block) je Reaktion, die in diesem Zug schon ausgelöst wurde |
| `behalten` | bleibt am Zugende auf der Hand |
| `opfer` | zahle n Leben statt Energie |
| `zoll` | zahle n Gold statt Energie, solange das Gold reicht (sonst die Energiekosten `c`); Kollekte |
| `gold` | +n Gold, auch mitten im Kampf; Kollekte |
| `x` | verbraucht alle Energie, wirkt X-mal |
| `unspielbar` | kann nicht gespielt werden (z. B. „Zittern“, „Abschrift“, „Ballast“); mit einer Eigenschaft `ballast_werfen` geht sie für 0 über Bord |
| `sonder` | Sonderwirkung, Liste in `docs/auftrag-2/handgriffe.md` |

Dazu `build` (Archetyp), `rar`, `t` (Flavor), `start` (Start-Handgriff, kommt nicht als Belohnung).

### items.json (neue Felder)

`rar` (`gewoehnlich`/`selten`/`reliquie`), `kerben` (Plätze für Handgriffe; ohne Angabe 1 bzw. 2), `eigen` (Eigenschaft, `{typ, v}`), `flavor`, `preis` (Verkauf 40 %), optional `fest_hg` (fest eingeritzte Handgriffe). Eigenschaften (`eigen.typ`): `brand_haelt`, `energie_bleibt`, `block_haelt_halb`, `reaktion_block`, `reaktion_heil`, `hoch_zweimal`, `gift_doppelt`, `opfer_staerke`, `mehrfach_plus1`, `brand_springt`, `start_staerke`, `start_block`, `verwundbar_start`, `gold_bonus`, `heil_nach_sieg`, `erste_karte_billiger`, `glueck`, `energie_plus {v, preis: hand|heil}`, Ballast: `ballast_werfen {fx}`, `ballast_ziehen {v, blk}`, `ballast_staerke {v}`, `ballast_block {v}` (alle mit optional `ballast_start`, `ballast_karte`), Kollekte: `gold_schaden {je, max}`, `gold_block {je, max}`, `gold_je_tod {v}`, `gold_energie {ab, v}`, `faehrgeld {kosten, leben}` (Regeln in `docs/auftrag-2/paket-format.md`). Optional `eigen.t`: Satz, den Spiel und Artboard als Eigenschaft zeigen. Umsetzung: `passive(typ)` in `js/core/state.js`, Wirkung in `combat.js`.

### jobs.json (neu)

Jede Figur startet mit drei angelegten Items (Waffe, Kleidung, Talisman), der Rest liegt im Rucksack. `hg` legt die Start-Handgriffe in die Kerben: `{"<item-id>": ["stossen"]}`.

### foes.json (neu)

`kniff` (genau einer, mit `why`): `dornen`, `loeschen`, `rein`, `brecher`, `abschrift`, `waechst`, `schuetzer`, `ruf`, `wechsel`, `ansage`, `nachlass`, `verborgen`, `heiler`, `einfrieren`, `verstopfen` (Felder in `docs/auftrag-2/paket-format.md`). `beute_satz`: Satz nach dem Sieg, wenn dieser Gegner dabei war. `quelle`: wie das Sprite entstand (`skript`, `ki:<dienst>`, `mix`).

### balance.json (neu)

`wucht` (Gefühl der Treffer, eigene ×1,25), `belohnung` (Item-Chance nach normalem Kampf, Gold fürs Überspringen), `meldungen` (Meldungszeile), `musik.boss_aufbau_takte`, `shop` (neu: `verkauf_anteil`, `hg_preis`, `hg_preis_selten`, `hg_entfernen`, `reliquie_chance`, `reliquie_preis`). Regeln: Brand halbiert sich nach dem Ticken (mit `brand_haelt` nur −1), Gift sinkt um 1.

### builds.json

Profile der sechs Build-Bots (`tools/build-bots.js`): je Build bevorzugte `items`, `handgriffe`, `stoffe`, optional `figuren`. Herkunft: `docs/auftrag-2/builds.md`.

## Auftrag 3: Die Tiefe verändert das Spiel

Neue Systeme, jedes mit eigenem Schalter in `balance.json → auftrag3` (siehe unten). Alle neuen Namen, Sätze und Zahlen sind Entwürfe und tragen `"entwurf": true` (am Datensatz oder an einem Vorfahren); `node tools/texte-pruefen.js` verlangt das für jeden Text, der nicht schon im alten Spiel stand. `data.js → loadData` liest alle neuen Dateien beim Start; fehlt eine, läuft das Spiel ohne sie weiter (`opt`).

### Neue Dateien

| Datei | Inhalt | Geladen in |
|---|---|---|
| `biegungen.json` | die 14 Regelbiegungen | `data.js → loadData` → `BIEGUNGEN` |
| `stell.json` | Stellplätze der Gegner | `data.js → loadData` → `STELL` |
| `fahrt.json` | Richtung und Zielpunkt der Fahrt | `data.js → loadData` → `FAHRT` |
| `meta.json` | Texte der Metaebene | `data.js → loadData` → `META` |
| `wuerze.json` | Daten und Texte der Würze | `data.js → loadData` → `WUERZE` |

`fragmente.json` gibt es schon (siehe oben), hat aber jetzt 75 statt 21 Einträge (Abschnitt weiter unten).

### biegungen.json

Genau eine Regelbiegung je Biom in Akt III bis V, sie gilt in allen Kämpfen des Bioms. Eine Liste unter `biegungen` (14 Einträge). `loadData` hängt jede Biegung als `BIOMES[<biom>].biegung = <id>` ans Biom; in `biomes.json` und in den Biom-Paketen steht dafür nichts.

| Feld | Bedeutung |
|---|---|
| `id`, `biom` | ID und Biom, in dem sie gilt |
| `n`, `t` | Name und Regeltext. Beides zeigen Kopfleiste, Tooltip, Peilkarte und Biom-Wahl (`js/ui/oberflaeche.js → biegKopfHtml`, `js/ui/karte.js`) |
| `zeichen` | Name des Pixelzeichens in `js/ui/zeichen-biegung.js` (`gi(zeichen, …)`) |
| `art` | Einhakpunkt in `js/core/biegung.js`: `extra_reaktionen`, `zug_ende`, `ziehen`, `quelle`, `ablage`, `absichten`, `wechsel`. Der Code verzweigt nach `id`; allein `wechsel` (Außerhalb der Zeit) wird als `art` abgefragt (`Bieg.aktiv`, `Bieg.wechselListe`, `Bieg.kopf`) |
| `reaktionen` | nur Alte Stoffe erinnern sich: zusätzliche Paare `k`, `n`, `t`, `fx` wie in `reactions.json`. `rules.js → rxPaare` hängt sie an `REACT`, solange die Biegung gilt (`Bieg.extraReaktionen`) |
| `reaktion` | nur Funkspruch: die eine Sonderreaktion mit `n`, `t`, `pre` (`Bieg.funkspruch`) |

Die 14 (Biom → Biegung): Salz → Alte Stoffe erinnern sich, Stadt → Über Eck, Wald → Rückwärts gewachsen, Gezeitenwerk → Ebbe und Flut, Ziegelgruben → Der Ringofen, Station → Keiner fährt ab, Eis → Falsche Winkel, Walkathedrale → Der Schlag, Glasmeer → Das Spiegelbild ist voraus, Mond → Die Rückseite, Funkstation → Funkspruch, Pforte → Außerhalb der Zeit, Ufer → Die Wellen kommen von oben, Waage → Aufgewogen.

In den `fx` der Reaktionen kommt der Effekt `draw` mit `v` (Karten ziehen, nur im Kampf) dazu (`rules.js → runFx`; Sole nutzt ihn). Gezeitenblut nutzt `status` mit `vuln`.

### stell.json

Stellplätze der Gegner je Kampfszene (`szenen`, 100 Einträge: 25 Biome, je Kampf 0 bis 2 und Wächter 0). Schlüssel `biom:art:variante` (`art` = `kampf` oder `waechter`) oder `biom:art` für alle Varianten. Jeder Eintrag ist eine Liste von Plätzen `{x, y, s}`: `x`, `y` Bodenlinie in der Szene (480 × 270), `s` Maßstab. Die Reihenfolge ist „vorn Mitte zuerst“. Gelesen von `js/scenes/buehne.js → stellListe`, `stellPlatz`, `enemyBox0`; ohne Eintrag gelten die alten Reihen der Szene.

### fahrt.json

Die Fahrt nach vorne nach jeder Wahl auf der Peilkarte (`szenen`, 75 Einträge). Schlüssel `biom:kulisse`, `kulisse` = Hintergrund 0, 1 oder 2 des Bioms (so meldet es `World.build` als `sz.kulisse`).

| Feld | Bedeutung |
|---|---|
| `r` | Richtung: `vor`, `links`, `rechts`, `ab`, `auf` (Dauer je Richtung in `js/scenes/fahrt.js → DAUER`) |
| `ziel` | `[x, y]` in der Szene (480 × 270), auf den die Fahrt zuläuft |
| `grund` | Arbeitsnotiz, im Spiel nicht sichtbar |
| `sicher` | `true`: Bildfolge der Fahrt angesehen und geprüft (alle 75) |

Gelesen von `js/scenes/fahrt.js → eintrag`. Fehlt ein Eintrag oder ist `r` ungültig, fährt die Szene `vor` auf den Fluchtpunkt zu.

### meta.json

Texte der Metaebene; gelesen von `js/core/metaebene.js` (`Metaebene.T()`) und von `bildschirme.js` / `ueberlagerungen.js` (`META.erbe`, `META.ui`).

| Feld | Bedeutung |
|---|---|
| `ausrede.<job-id>` | Liste mit zwei Stufen je Figur (`t`): Stufe 1 ab dem 3., Stufe 2 ab dem 8. Run mit der Figur. Stufe 0 ist `jobs.json → ausrede` (`Metaebene.ausredeStufe`, `ausrede`) |
| `ausrede_ende` | Stufe 3 ab dem 15. Run mit der Figur, für alle gleich: „Ich gehe hinunter.“ |
| `ankunft_nach_umkehren` | einmalige Zeile auf der Figurwahl nach dem ersten Umkehren überhaupt (`Metaebene.ankunftZeile`) |
| `pause.<biom>` | je Biom eine Zeile für die Rückkehr nach mehr als 14 Tagen; welche, bestimmt das Biom, in dem der letzte Run endete (`Metaebene.sitzung`) |
| `erbe` | `t` Satz, `nehmen`, `lassen` Beschriftungen des Erbe-Angebots (`bildschirme.js → erbeHtml`) |
| `fehlzeit` | `t` Angebot, `ja`, `nein` Knöpfe, `start` und `tot` Zwischentitel-Sätze (`Metaebene.übergangSatz`) |
| `notizen.waechter.<id>`, `notizen.biome.<id>` | je Wächter (45) und je Biom (25) eine `wahr` und eine `falsch` formulierte Notiz des Vorgängers (`Metaebene.notizenAnRast`) |
| `ui` | Überschriften: `erbe_titel`, `notizen_titel`, `notizen_rast`, `seite_vorgaenger`, `seite_fehlzeit` |

### wuerze.json

Seltene Einzelstücke; gelesen von `js/core/wuerze.js` (`Wuerze.D()`, `Wuerze.T()`).

| Feld | Bedeutung |
|---|---|
| `stuecke` | Liste `{id, ort, chance, an}`. `chance` je Run, `an: false` = Stück ist aus (`Wuerze.stuecke`, `wuerfeln`). An sind `zeitung`, `brief`, `trennung`, `zann`; aus sind `grabbeigabe`, `licht`, `luegt` |
| `zeitung_chance` | Chance je Akt-Übergang für einen Ausschnitt (`Wuerze.uebergang`) |
| `zann_biom`, `zann_waechter` | Biom und Wächter von Zanns Takt (`Wuerze.fundpool`, `zannAktiv`) |
| `brief_bild` | Bild des Brief-Ereignisses (`Wuerze.ereignis`) |
| `karten` | Wirkung der drei Teile der Barmherzigen Trennung `relief`, `ausschnitt`, `aussage` (Kartenfelder, `img`); Name und Text stehen in `texte.trennung` (`Wuerze.karte`) |
| `items` | Zanns Geige (Item-Format wie `items.json`, dazu `wuerze: "zann"`). `data.js` mischt sie in `ITEMS`; `dropPool` und `Wuerze.imPool` lassen sie nur im Fundpool der Glockengießerei zu, wenn `zann` auf dem Run-Zettel steht |
| `texte.zeitung` | `ausschnitte` (12, je `id`, `kopf`, `t`), `vermisst` (eine Anzeige je Figur), `vermisst_kopf` |
| `texte.brief` | `ereignis` (`t`, `d`, `bild`, `ja`, `nein`), `briefe` (ein Satz je Biom), `knoten` (`bildschirme.js → briefHtml`), `tagebuch` (`Wuerze.briefKnoten`) |
| `texte.trennung` | je Teil `n`, `t`; `zusammenhang` („Zwei Teile, ein Seil“), `fund` |
| `texte.zann` | `geige`, `offen`, `zu` (Meldungen) |

### balance.json (Auftrag 3)

| Feld | Bedeutung |
|---|---|
| `auftrag3` | Ein Schalter je System: `regelbiegung`, `blick`, `farbe`, `hoeren`, `begegnungen`, `meta`, `fehlzeit`, `pause`, `wuerze`. `false` = das Spiel läuft genau wie ohne das System. Lesen mit `state.js → a3(k)`; umschaltbar im Dev-Reiter TIEFE oder mit `?a3aus=farbe,blick` (`?a3aus=alle`) in der Adresse (`js/main.js`) |
| `auftrag3.biegung_nur` | nur für Vergleichsläufe, nicht in der Datei: eine Biegungs-ID, dann gilt nur diese (`Bieg.vomBiom`; Dev-Reiter) |
| `auftrag3.falsche_winkel_beide` | nur für Vergleichsläufe, nicht in der Datei: Falsche Winkel nimmt letzte und vorletzte Karte (`Bieg.quelleReaktion`) |
| `panzer` | `anteil` (Panzer = Anteil × maximales Leben, auf 5 gerundet, mindestens 5), `t` Tooltip-Satz. Ein Wächter oder Boss im unverwundbaren Schritt ohne Diener trägt Panzer statt Unverwundbarkeit (`combat.js → panzerZugbeginn`, Anzeige `kampf.js`) |
| `spuren` | je Spuren-Stufe 0 bis 3: `hp` Faktor, `atk` Zuschlag, `gross` Bildgröße, `beute` (`kampf`, `kampf`, `schwer`, `reliquie`) (`begegnungen.js → Spuren.W`, `buehne.js → enemyBox`) |

### stoffe.json (Auftrag 3)

`stoffe.X` ist der neunte Stoff „Die Farbe“: `n`, `s` (`FA`), `c` (`#c800ff`) und `schimmer`, fünf Stufen, in denen das Bild wandert (`js/ui/farbe.js`). X steht auf keinem Item in `items.json`: Karten des Farbe-Items nehmen die Stoffe der Karte davor an (`core/farbe.js → Farbe.stoffeJetzt`, `hand`). `Farbe.spur` tauscht nie gegen X.

### items.json (Auftrag 3)

* `eigen.typ: "blick"` (Linse, Resonator, Lampe aus dem Grab; je `rare`, `kerben: 2`, eine Karte). Wer eines angelegt hat, wählt zu Kampfbeginn Hinsehen oder nicht (`js/core/blick.js → Blick.traegt`, `kampfStart`; `state.js → passive`).
* Die drei stehen in den Fundpools `biomes.json → fundpool` (Linse Akt II, Resonator Akt III, Lampe Akt IV) und in den Paketen. Weil sie `rare` sind, kämen sie sonst beim Krämer schon früher vor: `state.js → blickAb(id)` liefert den Akt, ab dem ein Blick-Item vorkommen darf (frühester Akt, in dessen Fundpool es steht; `rarePool` prüft es).
* `wuerze` (nur Zanns Geige in `wuerze.json → items`): `"zann"`; kommt nur über die Würze in einen Pool (`state.js → dropPool`).

### foes.json und Biom-Pakete (Auftrag 3)

Neue Felder an Gegnern (in `foes.json` und im Block `foes` der Pakete `biome/<id>.json`):

| Feld | Bedeutung |
|---|---|
| `art` | alle 143 Gegner: `mensch` (17), `veraendert` (68), `nachahmer` (14), `tiefe` (44). Ordnet nach Körper und Form, nie nach Herkunft. Gelesen von `begegnungen.js → Tiefe.artVon`, `Tiefe.kampf` (Seitenwechsel: nur `tiefe`/`nachahmer` = Begegnung statt Kampf; `mensch`/`veraendert` = ein Gegner mehr). Fehlt `art`, gilt `tiefe` |
| `asche` | `true` an 15 Gegnern (je Biom der Akte II bis IV einer, nicht im Gezeitenwerk): beim Tod bleibt Asche im Rucksack (`Asche.tod`, `kampfIds`, `rufen`) |
| `stumm` | `true` an 6 Gegnern (Rufer, Echo, Splitterchor, Astronom, Rauschen, Tarierte): zeigt keine Absicht, man hört sie. Gilt nur bei normalen Gegnern in Akt IV und V, höchstens einer je Kampf (`combat.js → mkEnemy`, `hoeren.js → Hoeren.istStumm`, `begrenzen`) |
| `gesehen` | an allen 44 Wächtern ein Musterschritt (`{t, v, h}` wie in `pat`): kommt beim Hinsehen direkt nach dem aktuellen Schritt ins Muster, `v` wird wie die übrigen Angriffe skaliert (`blick.js → Blick.waechterZusatz`). Ohne Eintrag: der stärkste Schritt noch einmal |
| `gesehener` | `true` an den drei Gesehenen (`gesehener_tief`, `gesehener_grund`, `gesehener_letzt`). Sie stehen in keinem Biom-Pool; nur `Blick.gesehenerDazu` stellt den des Akts auf (Akt I bis III Tief, IV Grund, V Letzt, `Blick.gesehenerId`). Bühne: halb durchsichtig und schwebend (`buehne.js`) |
| `ohne_tiefe` | `true`: Leben und Angriff wachsen nicht mit der Tiefe (`combat.js → mkEnemy`). Die drei Gesehenen und `augen` |

`stimme: "schatten"` der Gesehenen ist die Gegnerstimme, die für sie gespielt wird. Der Panzer ist kein Feld am Gegner, sondern kommt aus `balance.json → panzer`.

### events.json (Auftrag 3)

* `tiefe: 1` an einer Option: gibt der Spieler dieser Option nach, zählt die Tiefe mit (`begegnungen.js → Tiefe.wahl`, aufgerufen aus `run.js → chooseEvent`). 11 Optionen tragen es. Nach zwei liegt „Das Zeichen“ lose im Deck. Der Text der Option bleibt unverändert.
* `farbe_brunnen` (`biom: "farbe"`): der Brunnen im Hof. Das Biom `farbe` gibt es nicht, darum zieht ihn keine normale Ereigniswahl; `Farbe.ereignisHier` setzt ihn einmal je Run ein, in Akt II oder III, wenn `Farbe.planen` ihn zu Runbeginn vorgesehen hat (`run.js`, Knoten `ereignis`). Option 1 hat den neuen Effekt `farbe_annehmen` (`rules.js → runFx` → `Farbe.annehmen`).
* Der falsche Brief (`wuerze.json`) ist ein Ereignis, das `Wuerze.ereignis` zur Laufzeit baut; er steht nicht in `events.json`.

### run.json (Auftrag 3)

| Feld | Bedeutung |
|---|---|
| `karten.zeichen` | die lose Karte „Das Zeichen“: `n`, `c` Kosten (0), `t` Text, `img` (`begegnungen.js → Tiefe.ZEICHEN`). Wird sie gespielt, gilt der Seitenwechsel |
| `begegnungen` | Zeilen der Begegnungen: `begegnung.t` (Begegnung statt Kampf), `weiter.t` (Knopf), `kraemer_zu.t` (Krämer ist zu) (`kampf.js → begegnungHtml`, `bildschirme.js`) |

### fragmente.json (Auftrag 3)

75 Fragmente, drei je Biom in 25 Biomen (statt 21 in sieben). Die 54 neuen haben zusätzlich:

| Feld | Bedeutung |
|---|---|
| `motiv` | eines von `rad`, `turm`, `tuer`, `welle`, `prozession`, `auge`, `kette`, `schiff`, `hand`, `treppe`, `waage`, `glocke`, `baum`: bestimmt die Komposition des Reliefs (`ueberlagerungen.js` → `World.relief(biom, seed, motiv)`). Fehlt es, gilt `prozession` |
| `entwurf` | `true` |

`schaltet` kennt wie bisher `item`, `figur` und `satz`; jetzt 18 Items, 3 Figuren, 6 Sätze, die übrigen 48 schalten nichts.

### jobs.json (Auftrag 3)

`koerper` (Anschlusspunkte `hals`, `leib`, `hand` je Figur, 9 Figuren) steht schon oben bei `jobs.json`. Gelesen von `js/ui/rucksack.js → koeLinien`.

### Was nicht in den Daten steht

Nicht aus Dateien, sondern aus Code und Seed: die Reihenfolge der Biegung in der Pforte (`Bieg.wechselZug`), die Auswahl der Begegnungen und der Würze auf dem Run-Zettel (`Zettel.wuerfeln`, `Wuerze.wuerfeln`), die Farbe (`Farbe.planen`), alle Zähler der Metaebene (`js/core/meta.js`, Fassung `v: 2` im Speicherstand `saltmoor.meta.v1`, Feldliste im Kopf von `meta.js → leer`).
