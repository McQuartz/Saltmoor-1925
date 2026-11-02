# Saltmoor 1925

Ein Cosmic-Horror-Roguelike im Neuengland des Jahres 1925. Du bist niemand Besonderes, nur jemand mit dem, was er tragen kann, auf einer Jagd, die immer tiefer führt. Gekämpft wird rundenbasiert mit Karten, die aus deiner angelegten Ausrüstung kommen. Spielst du zwei Karten direkt nacheinander, reagieren ihre Stoffe miteinander.

## Ordner

```
prototype/        Browser-Prototyp zum Ausprobieren und Entwerfen
  index.html      das Spiel
  gallery.html    alle Bausteine einzeln: Gegner, Boss-Entwürfe, Items, UI, Szenen
  data/           alle Spielwerte als JSON (Items, Gegner, Reaktionen, Balance ...), siehe data/README.md
  js/core/        Spielregeln ohne Grafik: Zustand, Kampf, Run-Ablauf, Reaktionen
  js/sprites/     Pixel-Sprites der Items und Zeichner der Gegner und Boss-Entwürfe
  js/scenes/      Hintergründe, Bühne, Partikel und Effekte
  js/ui/          Oberfläche: Bausteine, Bildschirme, Eingabe, Effekt-Zuordnung, Jumpscare
  js/audio/       Soundeffekte (WebAudio, ohne Dateien)
  style.css       Aussehen der Oberfläche
game/             Godot-4-Projekt (folgt)
```

## Prototyp starten

Die Daten werden per `fetch` geladen, deshalb braucht der Prototyp einen kleinen lokalen Server (direkt per Doppelklick auf die HTML-Datei geht es nicht).

* macOS: `prototype/start.command` doppelklicken
* Windows: `prototype/start.bat` doppelklicken
* oder im Terminal: `cd prototype && python3 -m http.server 8000`, dann http://localhost:8000 öffnen

Testhilfen über die Adresse:

* `index.html?depth=12&boss=maw` startet direkt beim Boss mit dem Entwurf „Der Schlund“ (`eye`, `maw`, `king`)
* `index.html?depth=6&job=2` startet auf Tiefe 6 mit der dritten Startfigur

## Wie die Teile zusammenhängen

1. `data/*.json` enthält alle Zahlen und Texte. Reaktionen und Ereignisse sind als Effektlisten beschrieben (`{"op":"damage","to":"all","v":12}`), nicht als Code.
2. `js/core/` setzt die Regeln um und kennt keine Grafik. Was passiert, meldet es über den Ereignis-Bus: `Bus.emit('enemy_hit', {e, d})`.
3. `js/ui/feedback.js` hört auf diese Ereignisse und entscheidet, wie sie aussehen und klingen: Zahlen, Partikel, Beben, Sounds.
4. `js/ui/components.js` enthält die einzelnen UI-Bausteine (Karte, Slot, Lebensbalken, Block-Anzeige, Absicht, Ketten-Panel). `js/ui/render.js` setzt daraus die Bildschirme zusammen.

## Entwerfen

* **Neuer Boss-Entwurf:** in `js/sprites/foes.js` eine Funktion in `BOSS_VARIANTS` eintragen und in `BOSS_INFO` beschreiben. Er erscheint sofort in der Galerie und ist mit `?boss=<name>&depth=12` spielbar.
* **Neuer Gegner:** Zeichner in `FOE_DRAW`, Werte in `data/foes.json`, ab welcher Tiefe er kommt in `data/balance.json` → `encounters.pool_from_depth`.
* **Neues Item:** Eintrag in `data/items.json`, Sprite in `js/sprites/items.js` (12×12 Zeichen, Farben aus `PAL`).
* **Neue Reaktion:** Eintrag in `data/reactions.json` mit Effektliste.
* **UI ändern:** Baustein in `js/ui/components.js`, Aussehen in `style.css`, prüfen in `gallery.html`.

## Weg nach Godot

Die Trennung oben entspricht der geplanten Godot-Struktur: JSON-Daten werden direkt übernommen, `core/` wird zu reinen GDScript-Klassen, der Bus zu Signalen, jeder UI-Baustein zu einer eigenen Szene. Siehe `game/README.md` und das Tech-Stack-Dokument: https://claude.ai/artifact/RsW8nWsDDJnErSyyFGWUus
