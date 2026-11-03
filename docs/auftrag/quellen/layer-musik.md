# Saltmoor 1925: Dynamische Layer-Musik

Kopie des Konzeptdokuments vom 2026-11-03 (Original: https://claude.ai/artifact/JXujgRxwk5MbRHoNQESCQ4). Stand und Inhalt unverändert, nur eingebettete Grafiken sind als Hinweis ersetzt.

## Kurzurteil

Ja, das ist sinnvoll, und es sprengt den Rahmen nicht, solange wir es klein schneiden: **ein** Intensitätswert, **4 Layer pro Biom**, **ein** Färbungs-Slot. Die Technik ist der kleine Teil (ein Musik-Dirigent von etwa 200 Zeilen, der am vorhandenen Ereignis-Bus hängt). Der große Teil ist die Musik selbst, und da hilft uns, dass dunkles Ambient (Drones, Puls, Geräusche, verstimmte Töne) das Genre ist, das man am leichtesten ohne Musiker hinbekommt.

Was es teuer macht, ist nicht das Layering, sondern Wildwuchs: wenn jedes Item, jede Rolle und jedes Biom eigene Spuren will. Das vermeiden wir mit festen Regeln (unten).

Empfehlung: erst einen prozeduralen Prototyp für den Hafen bauen (ein Abend Arbeit), anhören, und dann entscheiden, ob es bei Synthese bleibt oder Ace echte Stems aufnimmt.

## Was Tanks! so gut macht

Der Trick bei Wii Play Tanks: Jeder Panzertyp bringt sein eigenes Instrument mit. Die Musik ist eine Liste dessen, was gerade lebt. Schießt man einen Typ ab, verstummt seine Stimme, und am Ende spielt nur noch der Grundtakt. Man hört, wer noch da ist, ohne hinzusehen. (Das Video selbst konnte ich nicht ansehen, das ist der bekannte Kern davon.)

Drei Dinge davon übernehmen wir:

- **Musik erzählt Spielzustand.** Nicht nur „mehr Stress = lauter“, sondern jeder Layer hat eine Bedeutung, die man lernen kann.
- **Alles läuft immer synchron.** Alle Spuren laufen gleichzeitig im selben Takt, nur die Lautstärke wechselt. Darum klingt es nie zusammengestückelt.
- **Weniger wird hörbar.** Der Moment, wenn eine Stimme wegfällt, ist genauso befriedigend wie wenn eine dazukommt.

Unsere Saltmoor-Version davon: **Gegnertypen haben Stimmen** (Kultisten murmeln als Chor, Tieflinge als tiefes Blech, Schatten als Rauschen), und **Stoff-Reaktionen** lösen einen kurzen Tutti-Moment aus. Das ist näher an Tanks als „Musik wird bei wenig Leben schneller“ und passt zu unserem Satisfying-Ziel. Wichtig: Bei uns wird es beim letzten Gegner nicht leerer, sondern es wird ein Duell (siehe „Mehr Tiefe“).

## Das System

Ein einziger Wert **Intensität (0 bis 1)** steuert, welche Layer hörbar sind. Er wird aus dem Spielgeschehen berechnet, geglättet und ändert die Layer nur auf Taktgrenzen, mit 1 bis 2 Sekunden Überblendung. SFX bleiben, wie sie sind.

*(Grafik im Original: Intensität · 4 Eingänge, 5 Layer)*

Je höher die Intensität, desto mehr Layer sind zu hören. Unten bleibt immer etwas, oben kommt nur kurz alles.

**Woraus die Intensität entsteht**

- Ort als Grundwert: Menü 0, Karte und Ereignisse 0,2, Kampf 0,45, Boss 0,6.
- Eigenes Leben: je weniger, desto höher (bis +0,35).
- Gegnerdruck: angekündigter Schaden gegenüber eigenem Leben.
- Hochreaktion: springt kurz auf 1 und klingt über etwa 4 Takte ab.
- Später Wahnsinn (falls die Idee kommt): verstimmt und verzerrt statt lauter.

**Layer pro Biom** (Beispiel Hafen, alle gleiche Länge, gleiches Tempo, gleiche Tonart)

| Layer | ab Intensität | Inhalt Hafen | Bedeutung |
| --- | --- | --- | --- |
| 0 Grund | immer | Meer, Wind, tiefer Drone | Ort. Im Menü nur das, leise |
| 1 Puls | 0,2 | langsamer Herzschlag-Bass | Man ist unterwegs |
| 2 Rhythmus | 0,45 | Kettenrasseln, dumpfe Pauke | Kampf läuft |
| 3 Bedrohung | 0,7 | dissonante Orgel- oder Streicher-Cluster | Es wird eng |
| 4 Tutti | 1,0 | alles plus Akzent auf dem nächsten Schlag | Hochreaktion, Bossphase |

**Gegnerstimmen (der Tanks-Teil):** Jeder Gegnertyp hat ein kurzes Motiv, das läuft, solange einer lebt. Stirbt der letzte, verstummt es am Taktende. 4 bis 6 Typen reichen.

**Färbung durch Rolle und Items, bewusst billig:**

- Die **Rolle** wählt die Klangfarbe der Melodie in Layer 3 (Taucher: Spieluhr, Kriegsveteran: Marschtrommel, Wahrsagerin: Glasharfe). Eine Spur pro Rolle, nicht pro Rolle und Biom.
- **Stoffe** bekommen keine eigenen Dateien, sondern Effekte auf den Mix: Wasser = Tiefpass und Hall, Feuer = leichte Verzerrung, Glaube = Oktave darüber und Kirchenhall. Der dominante Stoff im Loadout bestimmt den Effekt. Kostet null Musik-Arbeit.
- Einzelne Items beeinflussen die Musik nicht. Sonst explodiert die Zahl der Kombinationen.

## Mehr Tiefe: zwei Achsen und der letzte Gegner

Ein einzelner Regler reicht nicht. Damit man unterbewusst merkt, dass gerade etwas Heftiges passiert, muss sich der **Charakter** der Musik ändern und nicht nur die Menge. Darum bekommt die Musik zwei Achsen.

- **Wucht** (wie viel passiert): steuert Layer und Dichte. Sie kommt von der Kampfphase und vom Momentum, also eigenen Aktionen, Reaktionen und Treffern.
- **Gefahr** (wie schlimm es steht): eigenes Leben gegen angekündigten Schaden. Sie ändert keine Menge, sondern die Farbe: Herzschlag-Tempo steigt langsam von 80 auf 88 BPM (höchstens 1 BPM pro Takt), die Harmonie kippt (statt Dur-Akkord ein düsterer Halbton darüber), der Klang wird dumpfer, oben kommt ein dissonantes Flirren dazu.

*(Grafik im Original: Wucht × Gefahr · vier Stimmungen)*

Dieselbe Menge Layer klingt je nach Gefahr heldenhaft oder panisch. Das macht den Unterschied, den man spürt, ohne ihn zu hören.

**Die Gegnerzahl bestimmt nicht die Dichte.** Die Dichte kommt vom Kampf, nicht von der Kopfzahl. Sonst klingt der letzte Gegner leer, obwohl er der Höhepunkt ist.

1. Es gibt 2 feste Stimmen-Plätze. Gegnertypen belegen sie und spielen im Wechsel wie Frage und Antwort.
2. Stirbt der letzte eines Typs, spielt sein Motiv einmal einen fallenden **Abgesang**. Dann übernimmt ein verbliebener Typ den Platz.
3. Ist nur noch ein Gegner übrig, beginnt das **Duell**: Sein Motiv spielt jeden Takt, eine Oktave gedoppelt, und die Wucht bekommt einen Bonus.
4. Erst beim **Sieg** wird es leer: Schlussakkord, dann gleitet die Musik über 2 Takte zurück in die Erkundung. Diese Leere fühlt sich dann wie Erlösung an und nicht wie Leerlauf.

**Unterbewusste Tricks**, die man nicht als „lauter“ wahrnimmt:

- Steigt schnell, fällt langsam: Anstieg in etwa einem Takt, Abfall über 6 bis 8 Takte. So pumpt nichts.
- Vor der Hochreaktion einen Schlag Atem holen: leiser, dumpf, mit Sog nach oben, dann alles. Der Kontrast macht es heftig, ohne harten Schnitt.
- Kündigt ein Gegner einen großen Angriff an, schwillt vorher etwas an.
- Kleine Reaktionen setzen einen leisen Ton aus der aktuellen Tonleiter auf den nächsten Schlag, Ketten steigen die Leiter hoch. Die SFX bleiben, das ist nur ein Ton zusätzlich im Mix.
- Treffer drücken die Musik kurz weg, damit der Treffer schwer wirkt.
- Der Rhythmus hat eine ruhige und eine treibende Fassung. So wird es nicht nur lauter, sondern anders.

**Wird das zu komplex?** Für Spieler nicht, die merken nur die Wirkung. Für uns kostet es prozedural fast nichts, weil Tempo und Harmonie nur Zahlen sind. Bei aufgenommenen Spuren wären Tempo- und Harmoniewechsel teuer. Darum bleibt die Mischung sinnvoll: Puls, Harmonie und Motive prozedural, Atmosphäre und Klangfarben als Aufnahme.

## Woher der Sound kommt

Empfehlung: **Mischung.** Grund, Puls und Rhythmus prozedural plus CC0-Geräuschaufnahmen, die Melodie- und Bedrohungs-Layer spielt Ace selbst mit freien Sample-Instrumenten ein. Alles ohne KI.

| Weg | Stärken | Schwächen | Gut für |
| --- | --- | --- | --- |
| Prozedural (WebAudio, wie sfx.js) | keine Dateien, sofort testbar, beliebig variierbar, passt zum Sprite-Generator-Gedanken | klingt schnell nach Synthesizer, gute Melodien sind schwer | Drone, Herzschlag, Rauschen, Pauke, Prototyp |
| Selbst komponierte Stems | beste Qualität, eigener Charakter; Ace macht schon Sound | größter Aufwand, braucht Disziplin bei Tempo, Tonart, Länge | Melodie, Bedrohung, Rollen-Klangfarben |
| Freie Lizenzen (CC0) | echte Aufnahmen gratis: Meer, Wind, Glocken, Ketten, Orgeltöne | fertige Musik gibt es fast nur als Stereo-Mix, nicht in Layern; Lizenzen prüfen | Layer 0, Samples für eigene Spuren |

Zu den Lizenzen: CC0 bevorzugen, CC-BY geht mit Credits, alles mit „NC“ (nicht kommerziell) meiden, weil Steam geplant ist. Quellen für Geräusche sind z. B. Freesound (nach CC0 filtern), für Instrumente freie Sample-Bibliotheken wie VSCO 2 Community Edition (Lizenz beim Download prüfen). Kostenlose DAWs zum Komponieren: LMMS oder Waveform Free.

Praktische Brücke: Prozedurale Layer lassen sich im Browser offline als WAV-Loop rendern. Was im Prototyp gut klingt, wird so direkt zu einer Datei für Godot.

## Technik

**Web-Prototyp:** Der Prototyp hat schon einen Ereignis-Bus (`js/core/bus.js`), an dem die SFX hängen (`player_hurt`, `reaction`, `enemy_die`, `victory` …). Ein neues Modul `js/audio/music.js` hört am selben Bus mit, rechnet die Intensität aus und regelt pro Layer einen Lautstärkeregler. Alle Layer starten gleichzeitig auf demselben Takt und laufen in Schleife, auch wenn sie stumm sind. Die Spielregeln müssen dafür nicht angefasst werden.

**Godot 4:** Seit Version 4.3 bringt Godot genau das mit. `AudioStreamSynchronized` spielt mehrere Spuren synchron und regelt jede einzeln (das ist vertikales Layering), `AudioStreamInteractive` wechselt zwischen Stücken auf Taktgrenzen (Biomwechsel, Boss). Der Bus wird dort zu Signalen. Der Übertrag ist also klein, wenn wir im Web dieselbe Struktur nutzen: eine Datei pro Layer, gleiche Länge, Intensität als eine Zahl. Quellen: [Godot PR „Add interactive music support“](https://github.com/godotengine/godot/pull/64488), [Anleitung zu AudioStreamInteractive](https://uhiyama-lab.com/en/notes/godot/adaptive-music-system/).

## Aufwand und Fallen

Der Code ist klein, die Musik ist die eigentliche Arbeit. Grobe Schätzung:

| Baustein | Wer | Aufwand (Schätzung) |
| --- | --- | --- |
| Musik-Dirigent im Web (Intensität, Layer, Bus) | Claude | 1 Sitzung |
| Musik-Labor-Seite mit Reglern zum Testen | Claude | 1 Sitzung |
| Prozedurale Layer für 1 Biom | Claude | 1 Sitzung, danach Feinschliff nach Gehör |
| Echte Stems für 1 Biom (5 Layer) | Ace | etwa ein Wochenende |
| Alle 4 Biome plus Menü | Ace | 4 bis 5 Wochenenden, verteilt |
| Gegnerstimmen (4 bis 6 Motive) | Ace oder prozedural | 1 bis 2 Abende |
| Übertrag nach Godot | später | klein, eingebaute Bausteine |

**Fallen, die wir vermeiden:**

- **Zu viele Kombinationen.** Nur Biom × Layer plus eine Rollen-Spur. Stoffe nur als Effekt, Items gar nicht.
- **Hektisches Umschalten.** Intensität glätten und nur auf Taktgrenzen wechseln, sonst flackert die Musik bei jedem Treffer.
- **Matsch.** Jeder Layer bekommt einen eigenen Frequenzbereich (Drone tief, Puls tief-mittel, Rhythmus mittel, Melodie hoch), sonst wird Layer 4 Brei.
- **Dauerstress.** Bei Intensität 1 muss es nach ein paar Takten wieder runtergehen, sonst nutzt sich der Höhepunkt ab.
- **Verwechslung mit SFX.** Musik leiser mischen und kurz absenken, wenn ein großer Effekt (Hochreaktion) spielt.

## Kleiner erster Schritt

Eine Seite `prototype/musik.html` („Musik-Labor“), nur für den Hafen, ganz prozedural:

1. Fünf Layer aus der Tabelle oben, synthetisiert mit WebAudio, alle im selben Takt.
2. Ein Regler für die Intensität und Knöpfe für „Menü“, „Kampf“, „Treffer“, „Hochreaktion“ und „Gegner stirbt“, damit man die Übergänge hört.
3. Anzeige, welcher Layer gerade an ist.

Damit kann man an einem Abend hören, ob das cool wird. Klingt es gut, hängen wir den Dirigenten an den Bus im Spiel. Will Ace lieber eigene Spuren, lädt dieselbe Seite statt Synthese einfach WAV-Dateien.

**Offene Fragen an Ace:**

- Soll das Labor zuerst gebaut werden, oder erst Ace eine Probe-Spur für den Hafen aufnehmen?
- Welche DAW nutzt Ace, und gibt es schon eigene Sounds?
