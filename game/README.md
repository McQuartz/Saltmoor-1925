# Godot-Projekt (kommt als Nächstes)

Hier entsteht die richtige Version in Godot 4 mit GDScript. Geplante Aufteilung, passend zum Prototyp:

| Prototyp | Godot |
|---|---|
| `prototype/data/*.json` | dieselben Dateien, eingelesen von einem `DataLoader`-Autoload |
| `js/core/` (Regeln, ohne Grafik) | `scripts/core/` als reine GDScript-Klassen, mit GUT getestet |
| `Bus.emit(...)` | Signale eines `GameEvents`-Autoloads |
| `js/sprites/`, `js/scenes/` | Aseprite-Sprites und Szenen (`.tscn`), 480×270 intern |
| `js/ui/components.js` | je Baustein eine UI-Szene: Karte, Slot, HP-Balken, Block-Anzeige, Absicht, Ketten-Panel |
| `js/ui/feedback.js` | `FeedbackPlayer`: Partikel, Screenshake, Hitstop, Sounds |

Details stehen im Tech-Stack-Dokument (Link in der Haupt-README).
