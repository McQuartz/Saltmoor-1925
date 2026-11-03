# Entscheidungen: alles Festgelegte auf einen Blick

Stand 2026-11-03. **Abgenickt** heißt: Ace hat es ausdrücklich bestätigt. **Festgelegt** heißt: offene Frage, für diesen Auftrag beantwortet, damit der Agent ohne Rückfrage durcharbeiten kann. Beides ist verbindlich. Wer später etwas ändern will, ändert es hier.

## Grundsätze

| Thema | Entscheidung | Status |
|---|---|---|
| Plattform | Der Run wird im **Browser-Prototyp** `prototype/` gebaut, nicht in Godot. Godot kommt später; die Trennung Daten / Regeln / Darstellung bleibt, damit der Umzug leicht wird. | festgelegt |
| KI-Inhalte | Keine KI-Bilder, keine KI-Sounds, nirgends. | abgenickt |
| Fremde Assets | Keine. Grafik und Klang entstehen aus eigenem Code. | abgenickt |
| Sprache | Deutsch in Spiel, Code-Kommentaren und Doku. | abgenickt |
| Run-Gefühl | Kein Run gleich. Biome nicht willkürlich aneinandergereiht, sondern auf ein Finale hin. Das Einstiegsbiom wechselt. | abgenickt |
| Ton | Lovecraft: andeuten statt zeigen, Verfremdung statt Splatter, intriguing statt Klischee-Horror. | abgenickt |

## Motivation: Der Sog

Quelle: [quellen/der-sog.md](quellen/der-sog.md). Ace: „top Grundregeln“.

| Frage aus dem Konzept | Entscheidung | Status |
|---|---|---|
| Rahmen | Etwas unter Saltmoor ruft, du kannst nicht aufhören hinabzusteigen. Keine Story, keine Zwischensequenzen. Je tiefer, desto älter, fremder, weniger menschlich. | abgenickt |
| Was passiert beim Verlieren | Kein Tod: Die Tiefe spuckt dich aus, du wachst am Strand auf. Loadout weg, Erinnerungen (Wandbild-Fragmente) bleiben. | abgenickt |
| Sieben Schichten zu viel? | **Sieben Biome bleiben**, aber ein Run besucht nur **fünf** davon: Einstieg (1 von 2), Kapelle, Tiefe (1 von 2), Schwarzes Eis, Pforte. Siehe [04-welt-und-run.md](04-welt-und-run.md). | festgelegt |
| Einstieg | Zwei Einstiege: **Hafenviertel** oder **Moorwald**, pro Run per Seed, mit Vorliebe je Figur. „Hinaus über das Riff“ kommt später. | festgelegt |
| Zweite Gabelung | Nach der Kapelle: **Salzstollen** oder **Namenlose Stadt** (per Seed, im Dev-Modus wählbar). Damit gibt es vier Wege durch die Welt, alle enden in derselben Pforte. | festgelegt |
| Sog und Wahnsinn | **Eine Leiste „Sog“ (0–10)**, die Wahnsinn-Idee aus der Ideenkiste geht darin auf. Regeln in [04-welt-und-run.md](04-welt-und-run.md), Werte in `data/sog.json`. | festgelegt |
| Ende | **Ankunft mit Wahl**: Nach dem Finale-Kampf ein Bild, ein Satz, zwei Knöpfe: „Bleiben“ oder „Umkehren“. Beide beenden den Run als Sieg, mit eigenem Schlusstext, beide werden im Tagebuch vermerkt. | festgelegt |
| Meta-Fortschritt | **Wandbild-Fragmente**: In jedem Biom gibt es Wandbilder (Ereignis-Knoten). Gelesene Fragmente bleiben über Runs, schalten Figuren und Items frei und erzählen nebenbei die Welt. Speicher: `localStorage`, im Dev-Modus zurücksetzbar. | festgelegt |
| Motivation je Figur | Jede Startfigur hat eine Ausrede (eine Zeile beim Start) und eine Wahrheit (eine Zeile im Schlusstext). Tabelle in der Sog-Quelle. | abgenickt (als Idee), festgelegt (Umsetzung) |
| Sog als Ruf | Der Ruf ist hörbar: Er treibt die Gefahr-Achse der Musik mit (siehe Musik). | festgelegt |

## Figuren (Startfiguren und Sets)

| Thema | Entscheidung | Status |
|---|---|---|
| Startfiguren | Die sechs Figuren aus der Sog-Tabelle sind die **Startfiguren**: Fischer, Friedhofswärter, Pfarrerin (von Anfang an), Detektiv, Okkultist, Kneipenschläger (über Fragmente freizuschalten). `data/jobs.json` wird entsprechend umgebaut; die alten drei (Hafenarbeiter, Totengräber, Pfarrerswitwe) gehen in Fischer, Friedhofswärter, Pfarrerin auf. | festgelegt |
| Startausrüstung | Jede Figur startet mit **zwei der drei Teile ihres Sets** aus `data/roles.json` plus passender Kleidung. Das dritte Teil kann man finden, dann greift der Set-Bonus. | festgelegt |
| Zusätzliche Figuren | Freischaltbar später: **Geologe** („der Überlebende“, aus der Sog-Quelle), **Wahrsagerin**, **Kriegsveteran** (aus der Ideenkiste, ohne Munition-Mechanik). Nur wenn Zeit bleibt (M10). | festgelegt |
| Spielerfigur in der Szene | Nein. Variante A zeigt keine Spielerfigur (das war Variante C). | festgelegt |

## Gegner und Ziel-Look

Quelle: [docs/spritegen/zielbild.md](../spritegen/zielbild.md), abgestimmt über vier Runden.

| Thema | Entscheidung | Status |
|---|---|---|
| Look | Dunkle Körper in Zonenfarben, Gegenlicht von hinten oben rechts, Randlicht 1–2 px an der Außenkante, flache Flächen mit Fase statt Kuppeln, organisch fließende Formen (nicht überall rund, nicht überall eckig), Bayer-Dither, kein schwarzer Umriss, leuchtende Augen als einzige helle Akzente, 96 × 120 px. | abgenickt |
| Favoriten | **Chorknabe**, **Hirte**, **Netzflickerin** sind „top“, Schlundträger „cool“. Bote und Nest haben Spielraum. | abgenickt |
| Tiefe der Figuren | Die Figuren wirken nicht flach: Fase, Kontaktschatten, Randlicht. In der Szene stehen Gegner **versetzt in der Tiefe** (hinten höher, kleiner, leicht im Nebel; gezeichnet von hinten nach vorne, mit etwas Zufall). Ace hat geprüft: „ist schon versetzt“, so soll es bleiben. | abgenickt |
| Herkunft der Sprites | Aus dem **prozeduralen Generator** (Mos Branch, M1–M6), vorab gerendert als PNG-Sheets. Keine Handzeichnung von Körperteilen. | festgelegt |
| Neue Figuren | Für die neuen Biome entstehen neue Gegner **nach denselben Regeln**: Archetypen als Generator-Vorgaben (Körperbauplan + Parameterbereiche + Zone), nicht als gezeichnete Vorlagen. Die Favoriten dienen als Richtung, nicht als Schablone. | abgenickt (Regel), festgelegt (Weg) |
| Gegner-Regel nach Tiefe | Erst Menschen, dann Menschen, die sich verändern, dann Dinge, die Menschen nachahmen, am Ende Dinge ohne menschliche Form. | abgenickt (Sog) |
| Horror | Fast menschlich und an einer Stelle falsch. Auch echte Monster (Tentakel aus Spalten, Zahnreihen, Insektenbeine). Nicht Cthulhu-typisch, nicht generisch. | abgenickt |
| Bosse | **Ein Finale-Boss** („Das, was ruft“) als Handarbeit mit derselben Render-Kette (Formen im Code erlaubt, weil Bosse laut Generator-Entscheidung Handarbeit bleiben). Am Ende jedes Biomes ein **Wächter**: ein großer Generator-Gegner (Elite), kein Handarbeits-Boss. | festgelegt |

## Kampf-UI

Quelle: [docs/ui/kampf-ui.md](../ui/kampf-ui.md). **Variante A ist Ausgangslage**, abgenickt.

| Thema | Entscheidung | Status |
|---|---|---|
| Alles aus der Tabelle „Ausgangslage: Variante A“ | wird umgesetzt, so wie dort beschrieben | abgenickt |
| Stummfilm-Rauschen | **Sehr dezent und selten.** Kein fester Takt (nicht alle 9–18 s, wie im Entwurf). Es kommt nur bei Anlässen: Hochreaktion, Wächter oder Boss erscheint, Sog springt auf eine neue Stufe. Höchstens einmal pro Kampf, dazu frühestens alle 3 Minuten, Dauer ca. 1,2 s, schwächer als im Entwurf (Körnung und Kratzer leicht, Viragierung höchstens 50 %). Werte in `data/balance.json` → `stummfilm`. Abschaltbar in den Einstellungen. | abgenickt (dezent), festgelegt (Werte) |
| Schadens-Vorschau (offener Punkt) | **Ja.** Beim Anheben oder Ziehen einer Karte zeigt jeder betroffene Gegnerbalken schraffiert, wie viel abgeht, inklusive Reaktion und Schwachstelle. | festgelegt |
| Reaktions-Zwischentitel (offener Punkt) | **Nur bei Hochreaktionen**, kurz (0,6 s), im Art-déco-Stil. Normale Reaktionen bekommen das bestehende Toast. | festgelegt |
| Handy-Layout (offener Punkt) | Nein, nicht in diesem Auftrag. | festgelegt |
| Andere Bildschirme | Titel, Figurwahl, Weg-Wahl, Belohnung, Werkstatt, Krämer, Ereignis, Wandbild, Strand, Ende bekommen **dieselbe Formensprache** wie Variante A (schwarz, Messinglinien, Cinzel/IM Fell English/Limelight, Pixelzeichen der Stoffe). | festgelegt |

## Musik und Klang

Quellen: [quellen/layer-musik.md](quellen/layer-musik.md), `prototype/musik.html`, Klangliste `prototype/klangliste.html`. Konzept und Vibe abgenickt.

| Thema | Entscheidung | Status |
|---|---|---|
| System | Zwei Achsen **Wucht** (Layer 0–4, Dichte) und **Gefahr** (Tempo, Harmonie kippt nach ♭II, dumpfer, Flirren). Gegnertypen haben Stimmen in 2 Plätzen im Wechsel, letzter Gegner = Duell, Abgesang beim Tod eines Typs, erst der Sieg macht leer. Tutti nur nach Hochreaktion oder beim Boss. | abgenickt |
| Aces Hör-Feedback | Kein Clipping, nichts offkey, Tempo nur **80–88 BPM**, höchstens 1 BPM pro Takt. Kein harter Komplett-Cut vor der Hochreaktion (halb leise, dumpf, Sog nach oben). Hochwertige Kampfsounds. | abgenickt |
| Quelle der Musik | **Prozedural mit WebAudio** (`music.js`), wie im Labor. Aufnahmen von Ace kommen später und ersetzen Layer einzeln (Klangliste). | festgelegt |
| Einbau | `music.js` hängt am Bus (über `feedback.js`). Szene (Menü, Karte, Kampf, Boss), Gegnertypen, Leben, angekündigter Schaden, Reaktionen und Hochreaktionen speisen die Achsen. | festgelegt |
| Neue Biome | Jedes der sieben Biome bekommt eine Musik-Fassung (Tonart, Akkorde, Ortsklang). Vorschläge in [04-welt-und-run.md](04-welt-und-run.md). Gleiche Regeln für alle. | festgelegt |
| Sog in der Musik | Der Sog-Wert erhöht die Grundgefahr (bis +0,3), damit der Ruf mit der Tiefe hörbar wird. | festgelegt |
| Stoffe in der Musik | Der dominante Stoff im Loadout färbt den Mix (Wasser Tiefpass + Hall, Feuer leichte Verzerrung, Glaube Oktave + Kirchenhall). Items beeinflussen die Musik nicht. | abgenickt (Konzept) |
| Lautstärke | Regler für Musik und Effekte im Menü, Musik standardmäßig etwas leiser als Effekte. | festgelegt |

## Hintergründe

Quelle: Aces Wunsch und [05-hintergruende.md](05-hintergruende.md).

| Thema | Entscheidung | Status |
|---|---|---|
| Problem heute | Zu neblig, zu dezent, die Orte sehen sich ähnlich. | abgenickt |
| Ziel | **Umfangreich neu**, im Artstyle der Figuren (gleiche Licht-, Randlicht- und Dither-Logik), mit echter Tiefe (Ebenen, Parallax, Maßstab, Licht), Ortsgefühl, lovecraftartig intriguing, kein Klischee. | abgenickt |
| Technik | Laufzeit-Rendering im Prototyp aus Ebenen (seeded), Formen aus parametrisierten Funktionen im Code (Bögen, Säulen, Masten, Felsen, Wellen), keine Bilder, keine Pixel-Koordinatenlisten. Ideen aus Mos M6 (WFC, Rauschen) dürfen genutzt werden. | festgelegt |
| Nebel | Nebel nur noch als **Tiefen-Hinweis** (hinter den Figuren aufhellend, in der Ferne dichter), nicht als Decke über allem. | festgelegt |

## Inhalte aus der Ideenkiste

Die Ideenkiste (`prototype/data/ideas.json`, 53 Einträge) ist noch nicht bewertet. Für diesen Auftrag gilt:

| Übernehmen | Warum |
|---|---|
| Wahnsinn → geht in der Sog-Leiste auf | Teil der Motivation |
| Tagebuch und Freischalten → als Wandbild-Fragmente | Teil der Motivation |
| Zonen-Beute (jedes Biom hat einen Fundpool) | macht Biome unterscheidbar |
| Gegner-Beute (kleine Chance auf ein eigenes Stück) | billig, macht Gegner greifbar |
| Karten-Takt, nur „Eröffnung“ | braucht einige Ideenkiste-Items, klein |
| Verfluchte Items (2 Stück: Auge im Glas, Glimmender Götze) | passen zum Sog |
| Items ohne neue Mechanik und solche, die nur Sog/Eröffnung brauchen (z. B. Bootshaken, Enterbeil, Robbenfell, Sense, Tarotkarten, Hasenpfote, Priesterkragen, Stockdegen, Hexenflasche, Spieluhr, Ankerkette, Kultmaske, Leuchtpistole, Gasmaske, Offiziersmantel, Kompass der nach unten zeigt, Dynamit, Rum, Laudanum, Riechsalz) | mehr Auswahl im Run; Werte aus der Ideenkiste, beim Autospieler-Lauf grob prüfen |
| Sonderkarten als Zettel | Optik für Wandbild-Fragmente und Ereignisse |

| Nicht in diesem Auftrag | Warum |
|---|---|
| Neuer Stoff Strom und seine Reaktionen, Elektriker | neues System, sprengt den Rahmen |
| Munition, Maschinenpistole | neues System |
| Gezeiten, Gezeitentafel, Tiefling-Schuppe (Flut-Teil), Taucher | neues System; Tiefling-Schuppe ohne Flut-Teil ist erlaubt |
| Proviant als vierter Bereich | neue Ausrüstungsfläche; Verbrauchs-Items (Dynamit, Rum …) laufen stattdessen als „verbraucht“-Karten im Rucksack |
| Erbstücke als eigener Typ | Hasenpfote und Kompass laufen als passive Talismane ohne Karte |

## Sonstiges

| Thema | Entscheidung | Status |
|---|---|---|
| Jumpscare | Bleibt, aber **höchstens einmal pro Run**, nicht in den ersten 5 Minuten, abschaltbar in den Einstellungen. | festgelegt |
| Dev-Modus | Schalter wie im aktuellen Prototyp, zeigt was gerade passiert und **warum**. Details: [06-dev-modus.md](06-dev-modus.md). | abgenickt |
| Speichern | Ein laufender Run wird nach jedem Knoten in `localStorage` gesichert und kann fortgesetzt werden. | festgelegt |
| Galerie und Artboard | Werden mit den neuen Gegnern, Biomen und Hintergründen aktualisiert. | festgelegt |
| Mos Sprite-Branch | Wird als erstes in den Auftrags-Branch gemergt (M0). Die Abnahme von M1–M6 durch Ace/Philipp steht noch aus; der Agent nutzt den Stand und verbessert, wo der Look nicht reicht. | festgelegt |
