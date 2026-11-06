# Biom-Paket: Format und Arbeitsweise

Stand 2026-11-04 (Auftrag 2, M2). Jedes neue Biom ist ein **Paket**: eigene Dateien, die das Spiel beim Start zusammenführt. So können mehrere Biome gleichzeitig entstehen, ohne dass sich jemand in die Quere kommt. Was ein Biom inhaltlich braucht, steht in [05-inhalte.md](05-inhalte.md) (Steckbriefe Abschnitt 3, Kniffe Abschnitt 5, Ereignisse Abschnitt 6, Arbeitsweise Abschnitt 7) und [06-ki-bilder.md](06-ki-bilder.md) (Bilder, Bewertungsbogen, verbotene Abkürzungen).

## Dateien eines Pakets `<id>`

| Datei | Inhalt |
|---|---|
| `docs/auftrag-2/biome/<id>.md` | Konzept zuerst: Ort, Komposition des Hintergrunds in Worten (je Variante und Wächter-Szene), jeder Gegner mit Motiv, wer er war, was falsch ist, Silhouette in einem Satz, Kniff, Muster, Schwachstelle mit Grund, Stimme. Am Ende die **Noten** (Bewertungsbogen) je Gegner, Wächter, Hintergrund. |
| `prototype/data/biome/<id>.json` | alle Spieldaten des Bioms (unten) |
| `prototype/js/scenes/world/<id>.js` | Hintergrund (Muster: `salz.js`, `kapelle.js`; Bausteine in `basis.js`), registriert `World._biome.<id> = {pal, build, reliefStil}` |
| `tools/sprites/zonen/<id>.json` | Sprite-Palette der Zone: `{"body":[4 dunkel→hell],"rim":[innen,außen],"kern":"#…","glut":"#…","glutDim":"#…"?,"extra":{name:"#…"}}` (Format wie `ZONEN` in `tools/sprites/lib.js`) |
| `tools/sprites/gegner/<gegner>.js` | ein Skript je Gegner und Wächter (Muster: `hirte.js`, `lotse.js`), gebaut mit `node tools/sprites/bauen.js <gegner …>` |
| `prototype/assets/gegner/<sprite>.png/.json` | gebaut, nicht von Hand |
| `docs/auftrag-2/bilder/M6/<id>/` (Akt I/II) bzw. `M7/<id>/` (Akt III–V) | Kontaktbogen neben den Favoriten, Silhouetten, Kampf- und Wächter-Bildschirmfoto, Varianten des Hintergrunds |

Zum Testen im Spiel trägt das Paket seine `<id>` in `prototype/data/biome/index.json` → `pakete` ein (Datei vorher frisch lesen, nur die eigene ID anhängen).

## `prototype/data/biome/<id>.json`

```json
{
 "id": "fabrik",
 "akt": 0,
 "biom": {
  "n": "Die Konservenfabrik", "kurz": "Fabrik", "zeit": "1925, Nachtschicht",
  "anreise": "ein Satz für die Biom-Wahl am Aktanfang",
  "koerper": ["#…","#…","#…","#…"], "rand": ["#…","#…"], "augen": "#…", "nebel": ["#…","#…"],
  "musik": "fabrik",
  "gegner": ["ausnehmerin", "dosenkind", "kesselmann", "kuehlhausgast"], "waechter": "schicht",
  "fundpool": ["…item-ids, alte und eigene…"],
  "kraemer": {"n": "Die Vorarbeiterin", "ort": "…", "zeile": "…", "art": "optional: tausch | leihe | spiegel"},
  "uebergang": "Satz beim Abstieg aus diesem Biom in den nächsten Akt",
  "weg_hinweise": {"kampf": ["…","…","…"], "ereignis": ["…","…"], "wandbild": ["…"], "kraemer": ["…"], "werkstatt": ["…"], "rast": ["…"], "fundstelle": ["…"]},
  "beute_saetze": ["mindestens 6 Sätze, die nach einem Sieg unter dem Gold stehen"]
 },
 "musik": {"n": "Konservenfabrik", "root": 49, "key": "cis-Moll", "names": ["C♯m","A","F♯m","G♯"], "darkNames": ["C♯m","D","F♯m","G♯♭9"],
  "amb": {"wind": .05, "stollen": .04}, "rhy": "ketten", "detail": "salz", "ort": "…", "rhyN": "…"},
 "foes": { "<gegner-id>": { … wie unten … } },
 "events": [ … mindestens 5, Format wie data/events.json, ohne "biom" (wird gesetzt) … ],
 "items": { "<item-id>": { … wie unten … } },
 "handgriffe": { },
 "skripte": ["js/scenes/world/fabrik.js"]
}
```

- `kraemer.art` (optional): `tausch` (Items nur gegen ein eigenes Item, kein Gold), `leihe` (Items für 30 % des Preises, gehen am Anfang des nächsten Akts zurück), `spiegel` (die Waren des letzten Krämers mit vertauschten Stoffen: Feuer↔Wasser, Eisen↔Fäulnis, Salz↔Blut, Glaube↔Licht). Ohne `art` ein gewöhnlicher Krämer.
- `akt`: 0 = Akt I … 4 = Akt V (so wie in `data/run.json`, wo das Biom schon eingetragen ist).
- `musik`: Harmonie und Ortsklang aus den vorhandenen Bausteinen von `js/audio/music.js` (kein neuer Klangcode nötig). `root` = MIDI-Grundton (andere Tonart als die Nachbarbiome des Akts), `amb` aus `meer, sumpf, insekten, wind, stollen, gaenge, sand, eisgrund, schimmer` (Pegel 0,02–0,11), `rhy` aus `ketten, holz, glocken, hacke, trommel, eis, atem`, `detail` = Biom, dessen Einzelklänge (Glocke, Tropfen, Orgel …) mitlaufen: `hafen, moor, kapelle, salz, stadt, eis, pforte`. Optional `"phryg": true` (dauerhaft halb gekippt).

### Gegner (`foes`)

Wie `prototype/data/foes.json` (siehe `prototype/data/README.md`), dazu neu:

```json
"ausnehmerin": {
 "n": "Die Ausnehmerin", "biom": "fabrik", "rang": "normal", "hp": 22, "weak": "F",
 "pat": [{"t":"atk","v":5},{"t":"atk","v":3,"h":2},{"t":"buff","v":2}],
 "sprite": "ausnehmerin_a", "varianten": ["ausnehmerin_a","ausnehmerin_b"],
 "konzept": "ein Satz", "stimme": "kultist",
 "kniff": {"art": "waechst", "v": 2, "why": "Je länger die Schicht, desto schneller die Messer."},
 "beute": "item-id oder null", "beute_satz": "Satz, der unter dem Gold steht, wenn sie dabei war",
 "quelle": "skript"
}
```

- Werte: normale Gegner `hp` 12–32 (auf Tiefe 1; die Tiefe skaliert), Angriffe 3–10; Wächter `hp` 60–120 (skaliert nicht; neuere Wächter mit Phasen eher 90–120), Muster 4–5 Züge.
- `stimme`: ein vorhandener Gegnerstimmen-Schlüssel aus `music.js` (`netzflickerin, tiefling, schmuggler, hirte, torfstecherin, nest, chorknabe, kultist, ertrunkener, schlundtraeger, salzlaeufer, grabwaechter, bote, schatten, mumie, rufer, eisgesicht, nachgeher, augen, ruft`) oder ein Wächter-Schlüssel. Passend zum Konzept wählen.
- `kniff` (genau einer, mit `why` für den Dev-Modus): `dornen {v}`, `loeschen`, `rein` (Gift wirkt nur halb), `brecher`, `kleinvieh` (nur über das Muster), `abschrift {n, karte?, spr?}` (n unspielbare Karten in dein Deck; `karte` gibt ihnen einen Namen, `spr` ein Bild, siehe „Kern-Wünsche“ unten), `waechst {v}` (jeden Zug +v Stärke), `schuetzer {v}` (gibt Verbündeten v Block), `ruf {gegner, alle}` (`gegner` darf eine Liste sein, dann der Reihe nach), `wechsel {stoffe:[…]}`, `ansage {zuege, v}` (lädt, dann großer Schlag), `nachlass {was: "explodiert"|"teilt"|"item", v, gegner}`, `verborgen` (Absicht nur halb sichtbar), `heiler {v}` (heilt Verbündete), `einfrieren` (eine Handkarte pro Zug wird für den Zug unspielbar), `verstopfen {n}` (wie abschrift, aber auf die Hand), `teurer {v}` (eine Handkarte kostet diesen Zug v mehr), `kopie {n?}` (spielt deine zuletzt gespielte Karte gegen dich: Angriff trifft dich, Block schützt ihn; mit `n` mischt er zusätzlich n Abschriften in deinen Ablagestapel), `takt {v, klang?}` (abwechselnd: Schlag gibt allen Gegnern v Block, dazwischen ist er verwundbar; `klang: "glocke"` spielt statt des Herzschlags einen Glockenschlag), `voraus` (spielt deine nächste Karte vom Stapel vor dir und ist schwach gegen den Stoff, den du in diesem Kampf am wenigsten gespielt hast). Wächter haben dazu wie bisher `besonders` (`ruft`, `schwach_wechsel`, `phasen`). Zusätzlich möglich: `kniffe: [ … ]` (weitere Kniffe neben `kniff`, wirken bei Zugbeginn und nach dem Gegnerzug) und `pendel: true` (schwingt jeden Zug zwischen links hinten und rechts vorn). Ein Musterschritt mit `unverw: true` (und `why`) macht den Gegner in dem Zug, in dem dieser Schritt als Absicht angezeigt wird, unverwundbar; die Absicht zeigt „unverwundbar“.
- Sprites: 96 × 120 (normal, Varianten `_a`, `_b`), Wächter bis 160 × 180, Finale bis 240 × 220. Sheets wie bisher (idle 4, angriff 4, treffer 2, tod 6). `quelle`: `skript` (Weg A), `ki:<dienst>` oder `mix`.

### Items (`items`)

Format wie `prototype/data/items.json`, dazu neu (Auftrag 2):

```json
"stempelkarte": {
 "n": "Stempelkarte", "a": "talisman", "st": ["E"], "spr": "watch",
 "rar": "selten", "kerben": 2, "preis": 40,
 "eigen": {"typ": "energie_bleibt", "v": 1},
 "flavor": "Ein Satz im Ton der Welt.",
 "cards": [{"n": "Abstempeln", "c": 1, "blk": 5, "draw": 1}]
}
```

- `rar`: `gewoehnlich` (1 Kerbe), `selten` (2 Kerben, Eigenschaft stützt einen Plan), `reliquie` (2 Kerben, Eigenschaft definiert einen Build; nur Wächter/Boss/sehr seltene Ereignisse).
- `eigen.typ` (eins davon): `brand_haelt` (Brand verfällt nur um 1), `energie_bleibt {v}`, `block_haelt_halb`, `reaktion_block {v}`, `hoch_zweimal`, `gift_doppelt`, `opfer_staerke`, `mehrfach_plus1`, `brand_springt`, `start_staerke {v}`, `start_block {v}`, `gold_bonus {v}`, `heil_nach_sieg {v}`, `erste_karte_billiger`, `glueck`, `energie_plus {v, preis: "hand"|"heil"}`, `reaktion_heil {v}`, `verwundbar_start {v}`. Neue nur, wenn sie wenig System brauchen (dann im Konzept erklären). Optional `eigen.t`: ein Satz, den Belohnung, Rucksack und Artboard als Eigenschaft zeigen.
- **Zugabe 4, Ballast** (unspielbare Karten als Treibstoff; Code in `js/core/combat.js`, Abschnitt „Ballast und Kollekte“). „Unspielbar“ heißt: eigener Ballast, Abschriften und Störkarten der Gegner, Zittern. Jede dieser Eigenschaften kann `ballast_start: n` (zu Kampfbeginn n Ballast an zufälligen Stellen in den Ziehstapel, vor der ersten Hand) und `ballast_karte: "Name"` tragen.
  - `ballast_werfen {fx}`: unspielbare Karten (nicht eingefrorene) kosten 0 und gehen beim Spielen **über Bord** (verbraucht), dann `runFx(fx)` aufs Ziel. Kein Stoff, keine Reaktion, zählt nicht als gespielte Karte (Eröffnung, Kneipenschläger) und ändert den letzten Stoff nicht. Ballaststein (3 Schaden an allen), Korkweste (4 Block).
  - `ballast_ziehen {v, blk}`: ziehst du eine unspielbare Karte, ziehst du v nach und bekommst blk Block; höchstens 4-mal je Zug. Strandbuch.
  - `ballast_staerke {v}`: jede Karte, die über Bord geht (auch durch `ueber_bord`), gibt v Stärke bis Kampfende. Radiermesser.
  - `ballast_block {v}`: am Ende deines Zugs v Block je unspielbare Karte auf der Hand. Gesangbuch.
- **Zugabe 4, Kollekte** (Gold als Treibstoff): `gold_schaden {je, max}` (+1 Schaden je Treffer je `je` getragenes Gold, höchstens `max`; Pfennigstrumpf), `gold_block {je, max}` (zu Zugbeginn 1 Block je `je` Gold, höchstens `max`; Opferstock), `gold_je_tod {v}` (fällt ein Gegner, +v Gold; Heuerbeutel), `gold_energie {ab, v}` (+v Energie je Zug, solange du zu Zugbeginn mindestens `ab` Gold trägst; Pfandschein), `faehrgeld {kosten, leben}` (würdest du sterben, zahlst du `kosten` Gold und stehst mit `leben` Leben auf, einmal je Kampf; geprüft an beiden Todesstellen im Gegnerzug; Fährgeld).
- `spr`: vorhandenes 12×12-Sprite als Platzhalter (Liste in `js/sprites/items.js`), Icons kommen in M5.
- Neue Kartenfelder (M3): `str` (Stärke n für dich), `vuln` (Verwundbar n am Ziel), `funke` (kostet 0, wenn die Karte eine Reaktion auslöst), `kette` (+n Wirkung je Reaktion in diesem Zug), `behalten`, `opfer` (zahle n Leben statt Energie), `x` (verbraucht alle Energie, wirkt X-mal). Zugabe 4: `zoll` (zahle n Gold statt Energie, solange das Gold reicht, sonst kostet die Karte `c`), `gold` (+n Gold im Kampf), `sonder: {art: "ueber_bord", max?, je?, draw?}` (wirf bis zu `max` unspielbare Karten von der Hand über Bord; `je` = Schaden je geworfene Karte, `draw` = so viele ziehen, wenn etwas geworfen wurde) und der fx-op `ballast {n, wohin: stapel|hand|ablage, karte?}` (n unspielbare, stofflose, verbrauchte Karten „Ballast“ bzw. `karte`; nur im Kampf; z. B. als `sonder: {art: "fx", fx: [{op: "ballast", n: 1}]}`).

### Ereignisse (`events`)

Format wie `data/events.json` (`id` mit Präfix `<biom>_`, `t`, `d`, `bild`, `o`, optional `stummfilm`, höchstens eins je Akt). Zusätzliche `fx`-ops (M3): `handgriff {id}` oder `handgriff {zufall: true}` (Handgriff lernen), `schleifen` (eine Karte kostet dauerhaft 1 weniger), `kerbe` (+1 Kerbe an einem Item), `umritzen`, `item_tausch`, `reliquie` (zufällige Reliquie), `energie_dauer {v}` (sehr selten). Bedingungen `if` wie bisher plus `{"item": "<id>"}` (Item im Besitz), `{"job": "<figur>"}`, `{"event_gesehen": "<id>"}` (für Ereignisse, die sich auf Früheres beziehen; mindestens eins je Biom).

## Prüfen und benoten

1. `node tools/sprites/pruefen.js <sprites…>`: 0 Verstöße.
2. Kontaktbogen des Bioms **neben Chorknabe, Hirte, Netzflickerin** und Silhouetten-Bogen: automatisch mit `node tools/biom-bogen.js <id> <ordner>` (liest die Spieldaten samt Paketen und Ergänzungen; `--alle` für jedes Biom).
3. Hintergrund: Varianten 0–2 und Wächter-Szene über `prototype/hintergrund.html` bzw. Playwright.
4. Im Spiel: `index.html?dev=0&job=fischer&seed=3&springe=kampf_schwer&akt=<akt>` mit erzwungenem Biom (Dev → Cheats → Biom erzwingen, oder per `page.evaluate`: `newRun('fischer',3,{dev:true,route:[…]})`), Bildschirmfoto Kampf und Wächter.
5. `node tools/biom-test.js <id> 10`: 0 Fehler, der Akt soll schaffbar, aber nicht leicht sein (etwa 6–9 von 10).
6. Noten nach [06-ki-bilder.md](06-ki-bilder.md) Abschnitt 5 ehrlich in `docs/auftrag-2/biome/<id>.md`; alles unter 4 neu, bevor das Paket fertig ist.

## Ergänzung eines alten Bioms

Neue Gegner, Ereignisse und Items für ein Biom, das es schon gibt (Hafen, Moor, Kapelle, Salz, Stadt, Eis, Pforte), kommen als **Ergänzungspaket** `prototype/data/biome/<biom>_plus.json`, eingetragen in `index.json` wie jedes Paket. So bleibt `data/foes.json` unangetastet und mehrere Ergänzungen können gleichzeitig entstehen.

```json
{
 "id": "hafen_plus", "ergaenzt": "hafen",
 "gegner_dazu": ["kielholer"], "gegner_weg": [], "fundpool_dazu": ["…"],
 "foes": { "kielholer": { … wie oben, "biom": "hafen" … } },
 "events": [ … ], "items": { … }
}
```

- `gegner_dazu` hängt an die Gegnerliste des Bioms an, `gegner_weg` nimmt alte heraus (nur, wenn ein neuer sie ersetzt).
- Ereignisse bekommen automatisch `biom` = das ergänzte Biom.
- Kein `biom`-Block, keine Musik, keine Skripte; Hintergrund und Palette des alten Bioms bleiben. Sprites wie gewohnt mit der Zonenpalette des alten Bioms (`hafen`, `moor`, `kapelle`, `salz`, `stadt`, `eis`).

## Akt V: Elite im Vorraum, „Der, der vor dir kam“

- Ein Biom in Akt V kann im Block `biom` den Schlüssel `"vorraum_elite": "<gegner-id>"` setzen. Dann ist der Vorraum ein Pflichtkampf (Art `kampf_schwer`, Belohnung wie schwerer Kampf) gegen genau diesen Gegner; der Weg-Hinweis kommt aus `weg_hinweise.vorraum[0]`.
- Ein Gegner mit `"vorgaenger": true` wird beim Kampfbeginn aus deinem **letzten verlorenen Run** gebaut (gespeichert in `Meta` beim Tod: Figur und angelegte Items; ohne gespeicherten Run eine andere Figur per Seed): Name `<n> (<Figur>)`, Muster = seine drei stärksten Angriffskarten und seine beste Blockkarte, Werte × `atk_faktor` (Standard 1,6), Schwachstelle = ein Stoff, den keines seiner Items hat, Beute sicher eines seiner Items. `hp`, `pat` (Rückfall, falls er kaum Angriffe hat), `sprite`, `kniff` kommen aus dem Eintrag.
- Akt V: `biom.ankunft_bild` ersetzt den Satz über der Wahl Bleiben/Umkehren; `World._biome.<id>.ankunft(o)` (Funktion) ersetzt die Ankunft-Szene der Pforte. Elite-Sprites (`rang: elite`) dürfen bis 128 × 160 groß sein.

## Kern-Wünsche der Biom-Agenten (Zugabe)

Stand 2026-11-05. Kleine Erweiterungen im Kern, die jedes Paket nutzen kann. Jede meldet sich über den Bus mit `why` (Dev-Modus); Tests in `tools/test-deckbau.js` Abschnitt 12, Bilder in `docs/auftrag-2/bilder/Zugabe/kern/`.

- **Absicht „ruft“** (ohne neue Daten): Holt ein Gegner im kommenden Gegnerzug Verstärkung (Kniff `ruf`, auch in `kniffe`, Besonderheit `ruft` oder `phasen.ruft` ab Phase 2), zeigt seine Absicht zusätzlich das Zeichen „ruft“; der Tooltip nennt, wen. Rechnung: `rufAnsage(e)` in `js/core/combat.js`, dieselben Bedingungen wie beim echten Ruf (Platz für höchstens 4 Gegner). Bus: `ruf_ansage {e, gegner, why}` zu Zugbeginn.
- **`unverw` am Sprite**: Ist der angezeigte Musterschritt `unverw`, wird der Gegner auf der Bühne halb durchscheinend (Schachbrett-Raster), kühl getönt und mit einem wandernden kalten Rand gezeichnet (`nachbearbeiten` in `js/scenes/buehne.js`, kein Weichzeichner). Bus: `unverw_zug {e, why}` zu Zugbeginn.
- **Bild der Störkarten: `spr`** am Kniff (`abschrift`, `verstopfen`, `kopie` mit `n`; auch in `kniffe`). Der Bild-Schlüssel ist einer von dreien, in dieser Reihenfolge gesucht:
  1. eine **Item-ID mit Icon** (48er-Bild, steht in `prototype/assets/items/index.json`, Datei `assets/items/<id>.png`), z. B. `"gipsabdruck"`, `"leere_seiten"`, `"candle"`;
  2. eine **Handgriff-ID mit Icon** (`prototype/assets/handgriffe/index.json`, Datei `assets/handgriffe/<id>.png`), z. B. `"zittern"`;
  3. sonst ein **12×12-Sprite** aus `js/sprites/items.js` (`SPR`/`SWAP`, z. B. `"candle"`, `"bone"`, `"shell"`).
  Ohne `spr` gilt das `spr` des Hauptkniffs, sonst wie bisher der Knochen (`bone`). Normale Karten tragen dasselbe Paar: `spr` (12×12-Schlüssel) und `img` (Pfad zum 48er-Icon, falls vorhanden). Beispiel: Glockengießerei, Formerin, `"karte": "Abdruck", "spr": "gipsabdruck"`.
- **Wächter-Szene je Boss-Phase**: Fällt ein Wächter oder Boss mit `besonders.art = "phasen"` in eine neue Phase, baut die Bühne die Wächter-Szene neu und ruft `World.build(biom, {…, art: "waechter", phase: n})` mit `n` = 1, 2 … (Phase 0, der Anfang, hat kein Feld `phase`, die Szene bleibt also unverändert). Ein Biom liest `o.phase` (bzw. `K.o.phase`) in seinem `build` und verändert seine Wächter-Szene damit. Die alte Szene blendet in 0,8 s gestuft aus. Optional: `World._biome.<id>.phase(n, szene)` wird nach dem Neubau einmal aufgerufen (z. B. für zusätzliche Animationen in `szene.anim`). Bus: `szene_phase {biom, phase, why}`; Rechnung `szenenPhase()` in `combat.js`. Beispiel: `mond.js`, Rückseite: mit jeder Phase öffnen sich die Augen-Krater weiter, bei `phase` 1 gehen drei neue auf, bei `phase` 2 vier weitere.
- **`takt` mit `klang: "glocke"`**: Bus `herzschlag {e, klang, why}`; `feedback.js` spielt dann `sfx.glocke()` (Web Audio, Teiltöne einer Kirchenglocke in der Tonart der Musik, keine Dateien) statt des doppelten Herzschlags. Beispiel: Glockengießerei, Die Ungetaufte.
- **Kontaktbogen**: `tools/biom-bogen.js` zeigt auch die Vorraum-Elite (`biom.vorraum_elite`) mit dem Zusatz „Vorraum-Elite“.

## Ereignisbilder

Stand 2026-11-05 (Zugabe 3). Jedes Ereignis kann ein kleines Bild **160 × 90** bekommen, das oben im Ereignis-Zettel steht (`eventHtml()` in `prototype/js/ui/oberflaeche.js`, ganzzahlig über `--u` skaliert, `image-rendering: pixelated`). Es zeigt genau die Szene aus dem Feld `bild` des Ereignisses. Ein Ereignis ohne Bild zeigt den Zettel wie bisher.

**Weg:** Die Bilder werden vorab als PNG gebaut, mit denselben Bausteinen wie die Hintergründe (`prototype/js/scenes/world/basis.js`: Masken, `B.form` mit Fase und Randlicht, Bayer-Dither), die `tools/ereignisse/lib.js` in Node lädt. Die Palette ist die des Bioms (`World._biome.<biom>.pal` aus `js/scenes/world/<biom>.js`), für `biom: "alle"` eine neutrale Schieferpalette.

| Datei | Inhalt |
|---|---|
| `tools/ereignisse/bilder/<biom>.js` | **eine Datei je Biom**, darin eine Funktion je Ereignis: `module.exports = { biom: '<biom>', bilder: { <ereignis-id>(K, ev) { … } } }`. Muster: `hafen.js`, `alle.js`. |
| `tools/ereignisse/lib.js` | Kontext `K` und Bausteine (unten) |
| `tools/ereignisse/bauen.js` | baut die PNGs, schreibt `index.json`, meldet Abdeckung je Biom |
| `tools/ereignisse/kontakt.js` | Kontaktbogen ×3 mit Titel und Bildbeschreibung |
| `tools/ereignisse-fotos.js` | öffnet im Spiel jedes Ereignis mit Bild, prüft auf Seitenfehler, macht auf Wunsch Bildschirmfotos |
| `prototype/assets/ereignisse/<id>.png`, `index.json` | gebaut, nicht von Hand (`index.json` = Liste aller vorhandenen PNGs; das Spiel zeigt nur Bilder, die dort stehen) |

**Ein Biom-Agent ergänzt seine Bilder so** (ohne anderen in die Quere zu kommen, er fasst nur seine eigene Datei an):

1. `tools/ereignisse/bilder/<biom>.js` anlegen (Ergänzungspakete wie `hafen_plus` gehören in die Datei des alten Bioms, also `hafen.js`; die ID ist die Ereignis-ID).
2. `node tools/ereignisse/bauen.js <biom>` (oder einzelne IDs). Vorschauen ×3 liegen in `tools/ereignisse/vorschau/` (nicht im Repo). `index.json` entsteht jedes Mal neu aus dem Ordner; bei einem Konflikt einfach neu bauen.
3. `node tools/ereignisse/kontakt.js <charge> <biom>` → `docs/auftrag-2/bilder/Zugabe/ereignisse/kontakt-<charge>.png`; jedes Bild selbst ansehen und benoten (unter 4: überarbeiten).
4. `node tools/ereignisse-fotos.js` (Server auf Port 8000): 0 Fehler. Mit `--fotos=<id>:<biom>,…` Bildschirmfotos 1280×720.

**Bausteine in `K`** (Koordinaten 0..159 × 0..89): `K.himmel`, `K.wasser`, `K.mauer`, `K.pflaster`, `K.bretter`, `K.fuell`/`K.feld` (Rampe mit Dither), `K.sterne`, `K.mond`, `K.nebel`; `K.maske()` + `K.form(m, tiefe, {k, r, ton, verlauf, muster, L, rand})`; `K.figur`/`K.figurMaske(x, fuss, h, {kopf, buckel, neig, haltung: stehen|knien|sitzen, arme, ellbogen, wulst})`; Licht: `K.lichtquelle(x, y)` (Randlicht zeigt dorthin), `K.licht(x, y, r, farbe, stärke, {ohne: maske})` (gestuftes Licht auf Flächen), `K.kante(maske, lx, ly, r, [außen, nah])` (Kantenlicht für Silhouetten vor einer Lampe), `K.flamme`, `K.laterne`, `K.gaslaterne`; Requisiten `K.kiste`, `K.kutter`, `K.netz`, `K.schrift`; zum Schluss `K.vignette(stärke)`. Zufall nur über `K.r` (gesät aus der ID).

**Regeln für das Bild:** ein klares Motiv, das man in einer Sekunde liest; **eine** helle Stelle (Lampe, Kerze, Mond, Papier); viel ruhige dunkle Fläche; Figuren als dunkle Silhouette vor hellerem Grund oder mit `K.kante` gegen die Lampe abgesetzt; nie Splatter, leise unheimlich. Keine fremden Bilder, kein Weichzeichner, kein `Math.random()`.

## Zweite Wächter (Zugabe)

Ein Biom kann mehrere Wächter haben. Im eigenen Paket: `biom.waechter_alt: ["<id>", …]` neben `biom.waechter`; in einem Ergänzungspaket (`<biom>_plus.json` mit `ergaenzt`): `waechter_dazu: ["<id>", …]`. Der Seed wählt je Run und Akt einen davon (`waechterWahl(b)` in `core/run.js`), die Wächter-Szene des Bioms ist für alle gleich. Erzwingen zum Prüfen: `node tools/biom-test.js <biom> 20 --waechter=<id>`, im Spiel `S.devWaechter='<id>'` vor `Dev.springe('waechter',akt)`. `tools/biom-bogen.js` zeigt alle Wächter. Akt V (Finale) bleibt beim gemeinsamen Boss.

## Eliten (Zugabe)

Ein Biom kann Eliten haben: `biom.elite: ["<id>", …]` im eigenen Paket, `elite_dazu: ["<id>", …]` im Ergänzungspaket. Eine Elite hat `rang: "elite"`, Sprite bis 128 × 160, `hp` etwa 60–100 (Wächter-Faktor, keine Tiefen-Skalierung), ein Muster aus 3–5 Zügen, genau einen `kniff` und eine kleine Besonderheit (`besonders` oder ein zweiter Kniff in `kniffe`). Ein schwerer Kampf (`kampf_schwer`) bringt mit `BAL.elite.chance` (0,5) eine Elite; sie ersetzt `BAL.elite.ersetzt` (2) normale Gegner. Prüfen: `node tools/biom-test.js <biom> 20 --elite=<id>` (Elite in jedem schweren Kampf), im Spiel `S.devElite='<id>'` vor `Dev.springe('kampf_schwer',akt)`. Die Vorraum-Elite von Akt V (`vorraum_elite`) bleibt davon getrennt.
