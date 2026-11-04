# Saltmoor 1925

Ein Cosmic-Horror-Roguelike im Neuengland des Jahres 1925. Etwas unter Saltmoor ruft. Du steigst durch fünf feste Akte immer tiefer und in immer ältere Zeiten hinab, bis zur Pforte, und entscheidest dort, ob du bleibst oder umkehrst. Gekämpft wird rundenbasiert mit Karten, die aus deiner angelegten Ausrüstung kommen. Spielst du zwei Karten direkt nacheinander, reagieren ihre Stoffe miteinander. Verlierst du, spuckt dich die Tiefe aus, und du wachst am Strand auf; was du an den Wänden gelesen hast, bleibt.

## Prototyp starten

Die Daten werden per `fetch` geladen, deshalb braucht der Prototyp einen kleinen lokalen Server (Doppelklick auf die HTML-Datei geht nicht).

* macOS: `prototype/start.command` doppelklicken
* Windows: `prototype/start.bat` doppelklicken
* oder im Terminal:

```bash
cd prototype && python3 -m http.server 8000
```

Dann http://localhost:8000 öffnen (Chrome, Firefox, Safari; ab 1280 × 720).

**Tasten:** Karten ziehen oder anklicken (Zahlen 1–9), Gegner anklicken = Ziel, Leertaste oder E = Zug beenden, D = Dev-Modus, Esc = schließen.

**Testhilfen über die Adresse:**

* `?seed=N` fester Seed (gleicher Seed + gleiche Entscheidungen = gleicher Run)
* `?dev=1` Dev-Modus an (zeigt, was passiert und warum; Cheats, Autospieler)
* `?job=fischer&seed=3` direkt mit einer Figur starten
* `?job=pfarrerin&springe=waechter&akt=2` direkt zu einem Knoten (`kampf`, `kampf_schwer`, `waechter`, `finale`, `rast`, `werkstatt`, `kraemer`, `ereignis`, `wandbild`, `fundstelle`), als Dev-Run
* `?bot=50&seed=1` Autospieler: 50 Runs ab Seed 1, Tabelle am Ende

## Ordner

```
prototype/          Browser-Prototyp (reines HTML/CSS/JS, kein Build-Schritt)
  index.html        das Spiel
  artboard.html     der ganze Spielinhalt auf einer Seite
  gallery.html      alle Bausteine einzeln: UI, Stoffzeichen, Gegner mit Animationen, Biome, alte Grafik
  hintergrund.html  Hintergrund-Labor (Biom, Variante, Seed, fremdheit, Ebenen, PNG)
  effekte.html      Effekt-Labor (pixelfx)
  musik.html        Musik-Labor: dynamische Layer-Musik, alle sieben Biome
  klangliste.html   Audiodateien, die wir selbst aufnehmen oder bauen (data/audio.json)
  ideen.html        Ideenkiste
  lab.html          altes Sprite-Labor (prozedurale Teile, nur noch zum Nachsehen)
  data/             alle Spielwerte als JSON, Formate in data/README.md
  assets/gegner/    Gegner-Sprite-Sheets (PNG + JSON), gebaut mit tools/sprites/
  css/spiel.css     Aussehen des Spiels (Variante A)
  js/core/          Spielregeln ohne Grafik: rng (Seed), state, rules, combat, run, meta
  js/ui/            Oberfläche: Bildschirme, Eingabe, Spielgefühl (Effekte, Klang, Musik), Pixelzeichen, Einstellungen
  js/scenes/        Bühne (480 × 270), world/ (Hintergründe je Biom)
  js/fx/            Effekte über pixelfx (Brücke, eigene Effekte)
  js/vendor/pixelfx MIT, nur genutzte Teile (Quelle in data/README.md)
  js/audio/         Musik und Soundeffekte (WebAudio, ohne Dateien, keine KI-Sounds)
  js/dev/           Dev-Modus und Autospieler
  js/sprites/       Item-Sprites (12 × 12); foes.js = alte Gegner (nur Galerie)
tools/              Prüf- und Fotoskripte (Node, Playwright): Autospieler, Balance, Tests, Sprites
tools/spritegen/    prozeduraler Sprite-Generator, JS-Referenz (nach Godot portiert: game/addons)
game/               Godot-4-Projekt (folgt)
docs/auftrag/       Auftrag „spielbarer Prototyp-Run“, Stand in fortschritt.md, Konzepte (gegner.md, progression.md, Kompositionen)
docs/ui/            Kampf-UI: Ausgangslage Variante A und Ideenspeicher
docs/spritegen/     Ziel-Look der Figuren und (nachrangig) der prozedurale Sprite-Generator
```

## Wie die Teile zusammenhängen

1. `data/*.json` enthält alle Zahlen und Texte: Akte und Ebenen (`run.json`), Biome (`biomes.json`), Gegner, Items, Reaktionen, Ereignisse, Fragmente, Figuren. Effekte sind Listen (`{"op":"damage","to":"all","v":12}`), kein Code.
2. `js/core/` setzt die Regeln um, kennt keine Grafik und hängt allen Zufall an den Seed. Was passiert, meldet es über den Bus mit Grund: `Bus.emit('reaction', {r, why: 'Feuer folgte auf Eisen'})`. Der Kampf kann synchron laufen; so nutzen Autospieler und Schadens-Vorschau dieselbe Rechnung wie das Spiel.
3. `js/ui/feedback.js` hört zu und entscheidet, wie es aussieht und klingt (Effekte, Zahlen, Sounds, Musik).
4. `js/ui/oberflaeche.js` setzt die Bildschirme zusammen, `js/scenes/buehne.js` zeichnet die Szene.
5. `js/dev/dev.js` hört ebenfalls nur zu und erklärt.

## Prüfen

```bash
node tools/test-run.js
```

```bash
node tools/test-vorschau.js 300
```

```bash
node tools/balance.js 50 1
```

```bash
node tools/bot-browser.js 20 1
```

```bash
node tools/sprites/pruefen.js
```

(Die Browser-Skripte brauchen den laufenden Server auf Port 8000.)

## Entwerfen

* **Neuer Gegner:** Konzept in `docs/auftrag/gegner.md`, Sprite als Skript in `tools/sprites/gegner/<id>.js` (Weg in `docs/auftrag/sprites.md`), Werte in `data/foes.json`, Biom in `data/biomes.json`.
* **Neues Item:** `data/items.json`, Sprite in `js/sprites/items.js`, in einen Fundpool in `biomes.json`.
* **Neues Ereignis:** `data/events.json` mit `biom`.
* **Neuer Ort oder Variante:** `js/scenes/world/<biom>.js`, Komposition zuerst in `docs/auftrag/hintergruende-kompositionen.md`.

## Weg nach Godot

Die Trennung oben entspricht der geplanten Godot-Struktur: JSON-Daten werden direkt übernommen, `core/` wird zu reinen GDScript-Klassen, der Bus zu Signalen, Bildschirme zu Szenen. Siehe `game/README.md` und das Tech-Stack-Dokument: https://claude.ai/artifact/RsW8nWsDDJnErSyyFGWUus
