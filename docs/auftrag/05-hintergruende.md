# Hintergründe: Orte mit Tiefe

Aces Urteil über die heutigen Hintergründe: zu neblig, zu dezent, Kapelle, Grund und Wald sehen sich ähnlich, die Wechsel sind kaum zu sehen. Gewünscht: **umfangreich neu**, im **Artstyle der Figuren**, mit **echter Tiefe**, so dass man das Gefühl hat, **wirklich an einem Ort zu sein**. Lovecraftartig, **intriguing**, nicht Standard-Horror.

**Nachtrag aus dem [Briefing](00-briefing.md):** Hier ist deutlich mehr Aufwand vorgesehen. Details werden nicht nach starren, wiederkehrenden Regeln platziert. Jede Umgebung bekommt eine eigene Komposition und wirkt nicht nach Schema F. Die Ebenen unten sind das technische Gerüst, nicht der Bildaufbau. Vor dem Bauen wird jede Komposition in `hintergruende-kompositionen.md` in Worten skizziert (M8).

Die Steckbriefe der sieben Orte (Wahrzeichen, falsches Detail, Palette) stehen in [04-welt-und-run.md](04-welt-und-run.md), Abschnitt 8. Diese Datei sagt, **wie** sie gebaut werden.

## 1. Gleicher Stil wie die Figuren

Die Hintergründe nutzen dieselbe Bildsprache wie die Gegner aus [zielbild.md](../spritegen/zielbild.md):

- **Dunkle Flächen in Zonenfarbe**, 4 Stufen nahe Schwarz, plus hellere Stufen für die Ferne und den Himmel.
- **Gegenlicht und Randlicht:** Formen bekommen an der lichtzugewandten Kante eine 1–2 px Randlicht-Linie. Das ist das Wichtigste, damit Bögen, Masten, Bäume und Säulen **Form** haben und nicht als flache Scherenschnitte im Nebel verschwinden.
- **Flächen mit Fase:** Größere Formen (Mauern, Felsen, Salzkristalle) haben eine abgeschrägte Kante mit einer Stufe heller, wie die Körper der Figuren.
- **Geordneter Dither** (Bayer 4×4) für Übergänge, keine Verläufe, kein Weichzeichner.
- **Lichtquellen** (Laternen, Kerzen, Leuchtturm, Fenster, Glühen unter dem Eis) sind wie die Augen der Figuren die hellsten Punkte, mit gedithertem Glühen und einer Lichtspur auf nahen Flächen.
- Ziel-Bildgröße der Szene: **480 × 270** logische Pixel, ganzzahlig skaliert (siehe M2). Gegner 96 × 120 stehen darin.

Die Licht-, Randlicht- und Dither-Logik aus [zielbild/referenz/render.js](../spritegen/zielbild/referenz/render.js) und Mos `game/addons/spritegen/core/rim.gd`, `shade.gd` dürfen übernommen werden.

## 2. Tiefe: sieben Ebenen

Jede Szene besteht aus Ebenen, von hinten nach vorne. Jede Ebene hat einen eigenen Helligkeitsbereich (hinten heller und flacher, vorne dunkel und mit dem meisten Randlicht), eine eigene Detaildichte und einen eigenen Parallax-Faktor für eine leichte Kamerabewegung (Atmen der Szene, Maus-Parallax von wenigen Pixeln, Ruck bei Treffern).

| Ebene | Inhalt | Helligkeit | Parallax |
|---|---|---|---|
| 0 Himmel / Decke | Himmel, Höhlendecke, Sterne, Lichtschein | am hellsten, wenig Kontrast | 0 |
| 1 Ferne | **Wahrzeichen**-Silhouette (Leuchtturm, Steinkreis, Rundfenster, Salzkathedrale, Reliefhalle, Umriss unter dem Eis, Pforte) | hell, flach, kaum Randlicht | 0,05 |
| 2 Hinterer Mittelgrund | Architektur oder Landschaft in Maßstab: Lagerhäuser, Bäume, Säulen, Stollenverbau | mittel, Randlicht schwach | 0,15 |
| 3 Vorderer Mittelgrund | große Formen mit voller Fase und Randlicht, Lichtquellen | dunkel, Randlicht voll | 0,3 |
| 4 Spielebene | Boden, auf dem die Gegner stehen, mit **Fluchtlinien** (Planken, Fliesen, Bohlen, Schienen, Eisrisse), drei Tiefenreihen für die versetzte Aufstellung | dunkel, Bodenlicht unter den Figuren, Kontaktschatten | 0,5 |
| 5 Vordergrund | dunkle Rahmung, teilweise angeschnitten: Pfähle, Äste, Bankkanten, Salzzacken, Eisschollen. Bricht den Rand auf, gibt Maßstab | fast schwarz, nur Randlicht | 0,8 |
| 6 Luft | Partikel und Bewegung: Gischt, Sporen, Kerzenrauch, Salzstaub, Sand nach oben, Schneekristalle, Lichtfunken | einzelne helle Pixel | 1,0 |

Regeln für Tiefe:

- **Maßstab zeigen:** Es gibt in jeder Szene etwas, dessen Größe man kennt (Tür, Laterne, Bank, Lore, Treppenstufe), und etwas, das dagegen riesig ist. So wirkt der Raum groß, ohne dass man es erklären muss.
- **Fluchtlinien auf dem Boden** führen den Blick zur Ferne, die Gegner stehen darauf. Hinten stehende Gegner stehen auf der höheren Reihe und sind etwas kleiner (90 %) und etwas heller (Luftperspektive).
- **Nebel nur als Tiefenhinweis:** Er hellt hinter den Figuren auf, damit ihre Silhouetten stehen, und wird in der Ferne dichter. Er darf nie mehr als etwa ein Drittel der Szene verdecken. Bodennebel nur als schmales Band.
- **Licht trennt Ebenen:** Zwischen Ebenen soll ein Helligkeitssprung sein, keine gleichmäßige graue Suppe. Gegenlicht aus der Ferne, Randlicht vorne.
- Jede Ebene darf leicht animiert sein (Wasser, Kerzen, Lichtkegel, Partikel), aber **ruhig**, keine hektischen Loops.

## 3. Ort statt Kulisse: Lovecraft statt Klischee

Der Ort soll sich echt anfühlen und neugierig machen. Was ihn unheimlich macht, ist **ein Detail, das nicht stimmt**, nicht eine Horror-Requisite.

**So ja:**

- **Ein Ort zuerst.** Ein Kai ist ein Kai, eine Kapelle eine Kapelle: Man soll den Ort verstehen. Das Fremde kommt durch Verschiebung dazu.
- **Das falsche Detail** aus dem Steckbrief, deutlich sichtbar, aber nie erklärt (der Lichtkegel, der landeinwärts sucht; das schräg stehende Wasser; die Fossilien, die alle nach unten blicken).
- **Maßstab, der nicht stimmt:** zu hohe Säulen, zu niedrige Decken, Treppen für andere Körper.
- **Geometrie, die mit der Tiefe kippt:** Im Hafen ist alles gerade, in der Kapelle steht das Wasser schief, in der Stadt stimmen Proportionen nicht, im Eis bewegt sich Gefrorenes, in der Pforte ist der Raum gespiegelt.
- **Spuren von Zeit:** Jede Schicht ist älter. Man soll in den Hintergründen sehen, dass man in die Vergangenheit steigt (1925: Laternen, Kräne; Kapelle: Gotik; Stollen: römische Zeichen; Stadt: vor dem Menschen; Eis: vor dem Leben).
- **Relief und Zeichen** statt Text: Wandbilder, Ritzungen, Muster, die sich wiederholen.

**So nein (Klischee-Liste):**

- Grabsteine mit Kreuzen und „RIP“, Kürbisse, Fledermäuse, Vollmond hinter Wolkenfetzen, Spinnweben, Kerzenleuchter mit Totenköpfen, Blut an Wänden, Ketten mit Haken, Gitterkäfige.
- Krake im Mantel, große Tentakel aus dem Meer, Pentagramme, „uralte Runen“ als Deko.
- Nebel, der alles gleich macht. Gleiche Bäume in jedem Biom.

## 4. Varianten und Abwechslung

- Jedes Biom hat **mindestens drei Szenen-Varianten** (z. B. Hafen: Kai, Lagerhaus-Gasse, Bootssteg), seeded, mit demselben Wahrzeichen in der Ferne an anderer Stelle.
- Innerhalb eines Akts wird es **von Ebene zu Ebene etwas dunkler und fremder** (Parameter `fremdheit` 0–1 je Szene: mehr falsche Details, weniger Lichtquellen der Menschen, mehr Leuchten aus der Tiefe).
- Der **Wächter-Kampf** hat eine eigene Szene je Biom, mit dem Wahrzeichen nah und groß.
- Die Szenen für Weg-Wahl, Rast, Werkstatt, Krämer, Ereignis und Wandbild nutzen denselben Ort mit anderem Ausschnitt (z. B. Rast: kleines Feuer im Vordergrund, Ferne dunkel).
- Das **Übergangsbild** zwischen Akten zeigt den Abstieg: die Treppe hinter dem Altar, der Stolleneingang, der Spalt im Salz, das Loch im Eis.

## 5. Technik

- Neues Modul `prototype/js/scenes/world/` (Name frei): eine Datei je Biom mit Parametern und Formen-Funktionen, plus gemeinsame Bausteine (Licht, Randlicht, Fase, Dither, Ebenen, Partikel, Boden mit Fluchtlinien).
- Formen entstehen aus **parametrisierten Funktionen im Code** (Bogen, Säule, Mast, Kran, Baum aus Ästen per Regel, Fels per Rauschen, Kristall, Welle, Relief-Band), gesteuert vom Seed. **Keine Bilder, keine Pixel-Koordinatenlisten.** Ideen aus Mos `game/addons/spritegen/core/backdrop/` (WFC aus eigenen Beispielkacheln, Rauschen) sind ausdrücklich erlaubt.
- Jede Ebene wird **einmal pro Szene** in ein eigenes Canvas gerendert und dann pro Bild nur verschoben und überlagert (Leistung: 60 fps auf einem normalen Laptop). Animierte Teile (Wasser, Licht, Partikel) getrennt.
- Ein **Hintergrund-Labor** in der Galerie oder `lab.html`: Biom, Variante, Seed und `fremdheit` wählen, Ebenen einzeln ein- und ausschalten, PNG speichern.
- Für den Bericht je Biom ein Bildschirmfoto mit Gegnern nach `docs/auftrag/bilder/M7/`.
