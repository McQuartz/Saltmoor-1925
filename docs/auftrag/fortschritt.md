# Fortschritt

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt. Eine neue Sitzung liest diese Datei und macht beim ersten nicht fertigen Meilenstein weiter.

## Stand

| Meilenstein | Stand | Kurz |
|---|---|---|
| M0 Einlesen und Aufräumen | fertig | Bestandsaufnahme, Plan, Draft-PR |
| M1 Run-Gerüst | offen | |
| M2 Kampf-UI Variante A | offen | |
| M3 Dev-Modus und Autospieler | offen | |
| M4 Musik im Spiel | offen | |
| M5 Meta und Progression | offen | |
| M6 Sprite-Pipeline (KI-Sprites) | offen | |
| M7 Gegner-Besetzung | offen | |
| M8 Hintergründe | offen | |
| M9 Inhalte und Balance | offen | |
| M10 Politur | offen | |
| M11 Abschluss | offen | |

Stand-Werte: `offen`, `läuft`, `fertig`, `Mindeststand`, `fehlt`.

## Plan der Sitzung

Sitzung 1 (2026-11-03), eine einzige Sitzung, keine Folgesitzung geplant.

- Reihenfolge M0 → M11 wie vorgegeben. Schwerpunkt: Bis M5 ein vollständiger, spielbarer Run mit Motivation, danach so viel Schönheit wie möglich.
- Der Spielkern wird neu geordnet statt geflickt: Seed-Zufall (`js/core/rng.js`), neuer Run-Ablauf (`js/core/run.js`), Meta (`js/core/meta.js`), Daten in `run.json`, `biomes.json`, `fragmente.json`.
- Kampfregeln (Reaktionen, Werkbank, Schaden) bleiben inhaltlich, nur der Zufall läuft über den Seed.
- Oberfläche wird nach Variante A neu gebaut (480 × 270-Szene, Art-déco-Karten, Stoffzeichen).
- Sprites: kein Bild-Generator verfügbar → Ersatzweg aus M6 (selbst gezeichnet per Skript mit der Licht-/Randlicht-/Dither-Kette aus `zielbild/referenz/render.js`).
- Was wahrscheinlich nicht fertig wird: alle sieben Hintergründe in voller Tiefe mit je drei Varianten, Zusatzfiguren (M10).

## Bestandsaufnahme (M0)

Was der Prototyp heute kann (Stand `main`, 92b3cad), Bildschirmfotos in `bilder/M0/`:

- **Kampf** (`js/core/combat.js`): Karten aus angelegten Items, Energie 3, Hand 5, Gegnermuster (`atk`, `blk`, `buff`), Schwachstelle ×1,5, Brand, Gift, Geschwächt, Block, Ward. **Bleibt**, Zufall wird auf Seed umgestellt.
- **Reaktionen** (`js/core/rules.js`, `data/reactions.json`): 12 Paare, Verstärkt, 3 Hochreaktionen, Buch der Reaktionen, Entdecken. **Bleibt unverändert.**
- **Rollen/Sets** (`data/roles.json`): sechs Sets mit Bonus. **Bleibt**, die Figuren werden darauf umgestellt.
- **Run** (`js/core/run.js`): lineare Tiefe 1–12, nach jedem Sieg Rast mit Fund, alle 5 Tiefen Werkstatt/Krämer/Ereignis, Boss auf Tiefe 12. **Wird ersetzt** durch fünf Akte mit Weg-Wahl.
- **Werkstatt** (Verschmelzen) und **Krämer**: funktionieren. Werkstatt-Logik **bleibt**, Krämer wird zum eigenen Knoten mit Figur je Biom.
- **Ereignisse** (`data/events.json`): 4 allgemeine Ereignisse mit Effekten. **Werden erweitert** (je Biom, mit Folgen).
- **Zonen** (`js/scenes/zones.js`): Hafen, Wald, Kapelle, Grund als 320 × 180-Szenen. **Bleiben bis M8 als Rückfall**, dann nur noch in der Galerie.
- **Gegner** (`js/sprites/foes.js`): Kultist, Tiefling, Ertrunkener, Schatten, Boss mit drei Entwürfen, alles 64 × 80 per Hand-Zeichenfunktion. **Fliegen in M6/M7 raus.**
- **Jumpscare** (`js/ui/jumpscare.js`): zweimal pro Run in Zeitfenstern. **Wird auf einmal pro Run, nicht in den ersten 5 Minuten** umgestellt.
- **Musik** (`js/audio/music.js`): nur im Labor (`musik.html`), Hafen und Kapelle. **Kommt in M4 ins Spiel.** `sfx.js` ist im Spiel und bleibt.
- **Galerie, Artboard, Ideenkiste, Klangliste, Sprite-Labor**: Nebenseiten, werden später ergänzt.
- **Kein Seed, kein Speichern, keine Figuren-Motivation, kein Dev-Modus** im Spiel.
- Bild-Generator in dieser Sitzung: **nicht verfügbar** (kein Werkzeug dafür). M6 nimmt den Ersatzweg.

## Einträge je Meilenstein

(Je Meilenstein: was gebaut wurde, Prüfergebnis der Abnahme, ehrliche Einschätzung in 2–4 Sätzen, Bildschirmfotos.)

## Entscheidungen unterwegs

| Datum | Meilenstein | Entscheidung | Warum |
|---|---|---|---|
| 2026-11-03 | M0 | Branch heißt `claude/jolly-mendel-ia28ci` statt `auftrag/prototyp-run`. | Die Sitzungsumgebung erlaubt nur Pushes auf diesen vorgegebenen Branch. Ziel (Draft-PR gegen `main`, nie selbst mergen) bleibt gleich. |
| 2026-11-03 | M0 | Kein Bild-Generator verfügbar, M6 nimmt den Ersatzweg (Sprites per Skript selbst gezeichnet). | In der Sitzung gibt es kein Werkzeug zur Bilderzeugung. |

## Autospieler-Ergebnisse

| Datum | Stand | Seeds | Gewinnrate | Ø Tiefe | häufigste Niederlage | Fehler |
|---|---|---|---|---|---|---|

## Probleme und Ersatzwege

## Bericht

(Am Ende, nach 01-regeln.md Abschnitt 9.)
