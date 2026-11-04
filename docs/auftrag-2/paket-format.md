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
  "kraemer": {"n": "Die Vorarbeiterin", "ort": "…", "zeile": "…"},
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

- Werte: normale Gegner `hp` 12–32 (auf Tiefe 1; die Tiefe skaliert), Angriffe 3–10; Wächter `hp` 45–80 (skaliert nicht), Muster 4–5 Züge.
- `stimme`: ein vorhandener Gegnerstimmen-Schlüssel aus `music.js` (`netzflickerin, tiefling, schmuggler, hirte, torfstecherin, nest, chorknabe, kultist, ertrunkener, schlundtraeger, salzlaeufer, grabwaechter, bote, schatten, mumie, rufer, eisgesicht, nachgeher, augen, ruft`) oder ein Wächter-Schlüssel. Passend zum Konzept wählen.
- `kniff` (genau einer, mit `why` für den Dev-Modus): `dornen {v}`, `loeschen`, `rein`, `brecher`, `kleinvieh` (nur über das Muster), `abschrift {n}` (n unspielbare Karten in dein Deck), `waechst {v}` (jeden Zug +v Stärke), `schuetzer {v}` (gibt Verbündeten v Block), `ruf {gegner, alle}`, `wechsel {stoffe:[…]}`, `ansage {zuege, v}` (lädt, dann großer Schlag), `nachlass {was: "explodiert"|"teilt"|"item", v, gegner}`, `verborgen` (Absicht nur halb sichtbar), `heiler {v}` (heilt Verbündete), `einfrieren` (eine Handkarte pro Zug wird für den Zug unspielbar), `verstopfen {n}` (wie abschrift, aber auf die Hand). Wächter haben dazu wie bisher `besonders` (`ruft`, `schwach_wechsel`, `phasen`).
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
- `eigen.typ` (eins davon): `brand_haelt` (Brand verfällt nur um 1), `energie_bleibt {v}`, `block_haelt_halb`, `reaktion_block {v}`, `hoch_zweimal`, `gift_doppelt`, `opfer_staerke`, `mehrfach_plus1`, `brand_springt`, `start_staerke {v}`, `start_block {v}`, `gold_bonus {v}`, `heil_nach_sieg {v}`, `erste_karte_billiger`, `glueck`, `energie_plus {v, preis: "hand"|"heil"}`, `reaktion_heil {v}`, `verwundbar_start {v}`. Neue nur, wenn sie wenig System brauchen (dann im Konzept erklären).
- `spr`: vorhandenes 12×12-Sprite als Platzhalter (Liste in `js/sprites/items.js`), Icons kommen in M5.
- Neue Kartenfelder (M3): `str` (Stärke n für dich), `vuln` (Verwundbar n am Ziel), `funke` (kostet 0, wenn die Karte eine Reaktion auslöst), `kette` (+n Wirkung je Reaktion in diesem Zug), `behalten`, `opfer` (zahle n Leben statt Energie), `x` (verbraucht alle Energie, wirkt X-mal).

### Ereignisse (`events`)

Format wie `data/events.json` (`id` mit Präfix `<biom>_`, `t`, `d`, `bild`, `o`, optional `stummfilm`, höchstens eins je Akt). Zusätzliche `fx`-ops (M3): `handgriff {id}` oder `handgriff {zufall: true}` (Handgriff lernen), `schleifen` (eine Karte kostet dauerhaft 1 weniger), `kerbe` (+1 Kerbe an einem Item), `umritzen`, `item_tausch`, `reliquie` (zufällige Reliquie), `energie_dauer {v}` (sehr selten). Bedingungen `if` wie bisher plus `{"item": "<id>"}` (Item im Besitz), `{"job": "<figur>"}`, `{"event_gesehen": "<id>"}` (für Ereignisse, die sich auf Früheres beziehen; mindestens eins je Biom).

## Prüfen und benoten

1. `node tools/sprites/pruefen.js <sprites…>`: 0 Verstöße.
2. Kontaktbogen des Bioms **neben Chorknabe, Hirte, Netzflickerin** (`tools/sprites/vergleich.js` oder eigenes Skript) und Silhouetten-Bogen.
3. Hintergrund: Varianten 0–2 und Wächter-Szene über `prototype/hintergrund.html` bzw. Playwright.
4. Im Spiel: `index.html?dev=0&job=fischer&seed=3&springe=kampf_schwer&akt=<akt>` mit erzwungenem Biom (Dev → Cheats → Biom erzwingen, oder per `page.evaluate`: `newRun('fischer',3,{dev:true,route:[…]})`), Bildschirmfoto Kampf und Wächter.
5. `node tools/biom-test.js <id> 10`: 0 Fehler, der Akt soll schaffbar, aber nicht leicht sein (etwa 6–9 von 10).
6. Noten nach [06-ki-bilder.md](06-ki-bilder.md) Abschnitt 5 ehrlich in `docs/auftrag-2/biome/<id>.md`; alles unter 4 neu, bevor das Paket fertig ist.
