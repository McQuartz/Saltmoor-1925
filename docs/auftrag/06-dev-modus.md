# Dev-Modus

Ace will einen kleinen Schalter wie im jetzigen Prototyp, mit dem man sieht, **was gerade passiert und warum**: welche Kombo offen ist, warum eine Reaktion ausgelöst hat, was die Musik macht usw. Der Dev-Modus ist zugleich das Prüfwerkzeug des Agenten (Autospieler, Sprünge, Cheats).

## Ein- und ausschalten

- Kleiner Knopf **„DEV“** in der Ecke (dezent, immer da), Taste **`D`**, oder Adresse `?dev=1`. Zustand merkt sich der Browser.
- Der Dev-Modus verändert das Spiel nicht, solange man keine Cheats benutzt. Cheats werden im Run markiert („Dev-Run“) und zählen nicht fürs Tagebuch.

## Aufbau

Ein Seitenpanel rechts (einklappbar, Breite ~360 px, verschiebt die Szene nicht), mit Reitern. Dazu Einblendungen direkt in der Szene.

### Reiter „Jetzt“ (das Wichtigste, Standard-Reiter)

- **Kette:** zuletzt gespielte Karte und ihr Stoff, die Kette dieses Zuges als Stoffzeichen (z. B. Eisen → Feuer → Salz), Hochreaktion dieses Zuges verfügbar oder schon benutzt.
- **Offene Kombos:** Für jede Karte auf der Hand: Würde sie jetzt reagieren? Mit welcher Reaktion (Name, auch wenn noch unentdeckt, dann markiert „unentdeckt“), welche Hochreaktion würde sie vollenden, was kostet sie, was würde sie anrichten (gleiche Rechnung wie die Schadens-Vorschau).
- **Letztes Ereignis mit Grund**, als Klartext-Satz, z. B.:
  - „Knistern ausgelöst: Feuer folgte auf Eisen (Paar EF aus reactions.json).“
  - „12 Schaden an Tiefling: Harpune 6 + Fischer-Bonus 3 (Wasser) = 9; keine Schwachstelle (Tiefling ist schwach gegen Salz); Reaktion +3 = 12; Block 0.“
  - „Musik kippt: Gefahr 0,62 > 0,55, angekündigter Schaden 19 bei 24 Leben.“

### Reiter „Kampf“

- Jeder Gegner: Muster (`pat`) mit Markierung des nächsten Zuges, Skalierung durch Tiefe (Leben, Angriff), Schwachstelle, Zustände, Stärke, Block.
- **Schadensrechnung aufgeschlüsselt** für die letzten 10 Treffer (Basis, Rollen-Bonus, Set-Bonus, Schwachstelle, Reaktion, Block, Ergebnis), in beide Richtungen.
- Aktive Set-Boni (welches Set, welche Teile fehlen noch).
- Stapel, Hand, Ablage als Liste.

### Reiter „Run“

- **Seed** (kopierbar), Figur, Akt, Biom, Ebene, Tiefe.
- **Weg:** die Abfolge der Biome dieses Runs (z. B. Moorwald → Kapelle → Namenlose Stadt → Eis → Pforte) und warum (Seed, Figur-Vorliebe). Die nächsten Weg-Wahlen schon sichtbar.
- Gold, Fundpool des Bioms, Beute-Chancen.
- Meta: gelesene Fragmente, Freischaltungen, Stand der Progression.

### Reiter „Musik“

- Wucht und Gefahr als zwei kleine Kurven über die letzten 60 s.
- Aktive Layer (0–4) mit Pegel, Tempo (BPM), Akkord jetzt, gekippt ja/nein, Takt und Schlag.
- Stimmen-Plätze: welcher Gegnertyp spielt, Duell ja/nein, letzter Abgesang.
- Stoff-Färbung des Mix (welcher Stoff dominiert).
- Knöpfe: Musik stumm, Layer einzeln solo, Biom-Musik wechseln.

### Reiter „Log“

- Alle Bus-Ereignisse mit Zeit, Name, Daten und Grund, filterbar (Kampf, Reaktion, Musik, Run, Meta, Effekte). Export als Text.

### Reiter „Cheats“

- Tiefe/Akt/Biom springen, Gabelung erzwingen, beliebigen Knoten starten (Kampf, Wächter, Finale, Rast, Werkstatt, Krämer, Ereignis, Wandbild).
- Gegner wählen und spawnen, Item geben, Karte auf die Hand, Leben voll, Energie +1.
- Alle Reaktionen entdecken, Meta zurücksetzen, alles freischalten.
- Stummfilm-Rauschen und Jumpscare auslösen (zum Ansehen).
- **Autospieler** (siehe unten).

## Einblendungen in der Szene (nur im Dev-Modus)

- Über jedem Gegner klein: Name-ID, nächster Zug aus dem Muster, Tiefenreihe (vorne/mitte/hinten).
- An jeder Handkarte unten ein kleiner Streifen: reagiert ja/nein, mit welchem Stoff.
- Oben in der Mitte eine Zeile mit dem letzten „Warum“-Satz (verschwindet nach 4 s).
- Optional: Ebenen-Grenzen des Hintergrunds und Bildrate.

## Autospieler

- Spielt einen Run selbstständig: wählt Figur, Wege, Belohnungen und Karten nach einer einfachen Regel (gierig: höchster erwarteter Schaden bzw. Block, wenn der angekündigte Schaden das Leben gefährdet; Reaktionen bevorzugen; in der Werkstatt verschmelzen, wenn möglich).
- Läuft sichtbar (mit Tempo-Regler) oder schnell ohne Darstellung (`?bot=50&seed=1` spielt 50 Runs ab Seed 1 und zeigt am Ende eine Tabelle).
- Ergebnis: Gewinnrate, durchschnittlich erreichte Tiefe, häufigste Todesursache (Gegner, Biom), Freischaltungen, Fehler. Dient dem Agenten zur Abnahme und zur groben Balance.
- Läuft auch headless über Playwright, damit der Agent ihn aus der Kommandozeile starten kann (Skript unter `tools/`).

## Technik

- Alles hängt am Bus: Der Dev-Modus hört nur zu und liest den Zustand, er rechnet nichts selbst nach. Darum muss jedes System seine Ereignisse mit Grund melden (`why`, siehe [01-regeln.md](01-regeln.md)).
- Code in `prototype/js/dev/`, Aussehen schlicht (Monospace, dunkel), damit es sich klar vom Spiel abhebt.
- Im Spiel ohne `?dev=1` und ohne Schalter wird kein Dev-Code ausgeführt außer dem Knopf.
