# Welt und Run

Wie ein Run aufgebaut ist, welche Biome es gibt und wer darin wohnt. Grundlage ist [quellen/der-sog.md](quellen/der-sog.md). Alle Zahlen hier sind Startwerte, sie kommen in Daten (`data/run.json`, `data/sog.json`, `data/biomes.json`, `data/foes.json`) und dürfen nach dem Autospieler-Lauf angepasst werden (Änderung in `fortschritt.md` notieren).

## 1. Der Run in einem Satz

Du wachst am Strand von Saltmoor auf, hörst den Ruf, steigst durch **fünf Biome** immer tiefer und in immer ältere Zeiten, bis zur **Pforte**, und entscheidest dort, ob du bleibst oder umkehrst. Verlierst du, spuckt dich die Tiefe aus und du wachst wieder am Strand auf.

## 2. Abfolge: fünf Akte, vier mögliche Wege

```
                 Strand (Start, Figurwahl)
                      │
        ┌─────────────┴─────────────┐
   Akt 1: Hafenviertel         Akt 1: Moorwald          ← Einstieg wechselt
        └─────────────┬─────────────┘
              Akt 2: Die überflutete Kapelle            ← für alle gleich
        ┌─────────────┴─────────────┐
   Akt 3: Salzstollen         Akt 3: Namenlose Stadt   ← zweite Gabelung
        └─────────────┬─────────────┘
              Akt 4: Das schwarze Eis                   ← für alle gleich
                      │
              Akt 5: Die Pforte (Finale)
                      │
            Ankunft: Bleiben oder Umkehren
```

- **Welcher Einstieg:** per Seed. Jede Figur hat eine Vorliebe mit 70 % (Fischer, Kneipenschläger, Detektiv → Hafen; Friedhofswärter, Okkultist, Pfarrerin → Moorwald). Die Pfarrerin ist eine Ausnahme mit Sinn: Sie will zur Kapelle, der Moorwald ist der Weg über den alten Kirchpfad.
- **Welche Gabelung in Akt 3:** per Seed, 50/50. Ab Sog 6 beim Verlassen der Kapelle immer die Namenlose Stadt (der Ruf zieht dich dorthin). Im Dev-Modus wählbar.
- **Logik der Reihenfolge** (nicht willkürlich): Jede Schicht ist älter als die darüber (1925 → Volksglaube/Kult → Römerzeit und Vorzeit / vor dem Menschen → vor dem Leben an Land → außerhalb der Zeit). Die Brücke ins Eis: Unter dem Salzmoor liegt Salz, also ein alter Meeresboden. Wer durch das Salz hinabsteigt, steigt in ein Meer hinab, das längst verschwunden ist, und ganz unten ist es noch da, schwarz und gefroren.
- **Übergänge** zwischen Akten sind kurze Übergangsbilder (2–3 s, ein Satz, klickbar zum Überspringen): z. B. „Die Treppe hinter dem Altar führt nach unten. Sie ist nass, obwohl es nicht regnet.“

## 3. Aufbau eines Akts

Jeder Akt hat **vier Ebenen**. Nach jedem Knoten wählt man den nächsten aus **zwei oder drei Wegen** (Weg-Wahl). Jeder Weg zeigt ein Zeichen (Kampf, Ereignis, Wandbild, Rast, Werkstatt, Krämer, Wächter) und einen kurzen, atmosphärischen Hinweis („Spuren im Schlick, die zum Wasser führen“). Kein großer Kartenbaum, nur die Wahl des nächsten Schritts.

| Ebene | Mögliche Knoten | Regel |
|---|---|---|
| 1 | Kampf, Kampf, Ereignis | mindestens ein Kampf zur Wahl |
| 2 | Kampf, Ereignis, Wandbild, Krämer | mindestens zwei verschiedene Arten |
| 3 | Rast, Werkstatt, Krämer, Kampf (schwer) | Rast oder Werkstatt ist immer dabei |
| 4 | **Wächter** des Biomes | fest |

Die Pforte (Akt 5) hat nur zwei Ebenen: ein Vorraum (Rast oder Wandbild zur Wahl) und das Finale.

- **Tiefe** in der UI („TIEFE IX“) zählt die besuchten Ebenen über den ganzen Run: 1–16 bis zum Vorraum, 17 ist das Finale. Gegner skalieren mit der Tiefe (`balance.json` → `enemy_scaling`).
- **Kämpfe**: Ebene 1 ein Gegner (Akt 1) bzw. zwei, später zwei bis drei. „Kampf (schwer)“ hat einen Gegner mehr und eine bessere Belohnung (Auswahl mit einem seltenen Item).
- **Rast**: heilen (30 % Leben, **Sog +1**) oder ein Item verbessern (`forge.bump`) oder Sog −2 (nur Ruhe, keine Heilung). Rasten ist verlockend, aber der Sog wächst.
- **Werkstatt** und **Krämer**: wie heute (`run.js`), Fundpool nach Biom (Zonen-Beute).
- **Ereignis**: aus `data/events.json`, neu je Biom mindestens drei, im Ton der Sog-Quelle (Entscheidungen mit Preis, keine Erklärungen).
- **Wandbild**: ein Fragment lesen (siehe 6). Gibt Wissen und Sog +1.

## 4. Der Sog (Leiste 0–10)

Ein Wert, oben links unter dem Leben, als kleine Leiste mit dem Zeichen einer Spirale. Werte in `data/sog.json`.

**Steigt durch:**

- Akt-Wechsel: +1 (der Ruf wird lauter, je tiefer man ist)
- Rast mit Heilung: +1
- Wandbild lesen: +1
- verfluchte Items anlegen: +1 einmalig, manche Ereignisse
- Karten mit „+Sog“ (z. B. Auge im Glas, Rum)

**Sinkt durch:**

- Rast ohne Heilung: −2
- Karten mit „−Sog“ (Priesterkragen, Gasmaske, Laudanum)
- Glaube-Reaktionen: −1 (höchstens einmal pro Kampf)
- einzelne Ereignisse

**Stufen** (Stufenwechsel ist ein Anlass für das dezente Stummfilm-Rauschen):

| Sog | Stufe | Wirkung |
|---|---|---|
| 0–3 | Stille | keine |
| 4–6 | Flüstern | Zu Beginn jedes Kampfes kommt eine **Trugbild-Karte** in den Ziehstapel (kostet 1, tut nichts, verschwindet beim Spielen; Riechsalz entfernt sie). Musik: Gefahr +0,1. |
| 7–9 | Ruf | **Stärke kostet Verstand:** Jede Reaktion macht +2 Schaden, aber Gegner +1 Schaden pro Angriff. Musik: Gefahr +0,2, leises Flirren dauerhaft. |
| 10 | Ertrinken | Zusätzlich: Hochreaktionen dürfen zweimal pro Zug kommen, aber du verlierst zu Beginn jedes Zuges 2 Leben. Musik: Gefahr +0,3, Harmonie bleibt gekippt. |

## 5. Startfiguren

| Figur | Set (roles.json) | Start mit | Einstieg-Vorliebe | Ausrede (Startzeile) | Wahrheit (Schluss) | Rollen-Instrument | frei ab |
|---|---|---|---|---|---|---|---|
| Fischer | Harpune, Ölmantel, Stiefel | Harpune, Ölmantel + Messer, Mütze, Salz | Hafen | „Mein Bruder ist mit dem Boot nicht zurückgekommen.“ | „Er ist nicht ertrunken. Er ist hinabgeschwommen.“ | Ziehharmonika | Start |
| Friedhofswärter | Schaufel, Wollmantel, Stiefel | Schaufel, Wollmantel + Pfanne, Handschuhe, Laterne | Moorwald | „Die Gräber sind leer. Ich will wissen, wohin die Toten gehen.“ | „Sie gehen nach unten.“ | Spieluhr | Start |
| Pfarrerin | Bibel, Rosenkranz, Schleier | Bibel, Rosenkranz + Revolver, Wollmantel, Mütze | Moorwald | „Ich muss meine Gemeinde vor dem Kult in der Kapelle retten.“ | „Ihre Glocke läutet auch unter Wasser weiter.“ | Orgel | Start |
| Detektiv | Revolver, Mütze, Trenchcoat | Revolver, Trenchcoat + Messer, Laterne | Hafen | „Eine Reihe von Vermisstenfällen. Alle Spuren führen zum Wasser.“ | „Er ist der nächste Fall.“ | Gedämpfte Trompete | 3 Fragmente |
| Okkultist | Dolch, Kerze, Robe | Dolch, Robe + Salz, Handschuhe | Moorwald | „Ich suche das Wissen der Erbauer.“ | „Der Einzige, der ehrlich war. Und der Erste, der den Verstand verlor.“ | Glasharfe | 6 Fragmente |
| Kneipenschläger | Flasche, Handschuhe, Mütze | Flasche, Handschuhe + Ölmantel, Laterne | Hafen | „Ich habe Schulden. Man sagt, da unten liegt Gold.“ | „Das Gold ist alt. Sehr alt.“ | Verstimmtes Klavier | 9 Fragmente |

Regel: Jede Figur startet mit genau **zwei** Set-Teilen (das dritte findet man vielleicht), dazu 3–4 weiteren Teilen, sodass das Startdeck 8–10 Karten hat und die Figuren sich verschieden spielen. Die genaue Ausrüstung legt der Agent mit dem Autospieler fest; die Tabelle ist der Startpunkt.

Freischaltbar, wenn Zeit bleibt (M10): **Geologe** (der Überlebende einer Expedition, steigt mit einer alten Karte hinab, sieht die nächste Gabelung voraus), **Wahrsagerin** (Tarotkarten, Auge im Glas, Spieluhr; jeder Sog-Punkt +1 Schaden auf die erste Karte im Zug), **Kriegsveteran** (Leuchtpistole, Gasmaske, Offiziersmantel; die erste Karte im Zug wirkt doppelt, ohne Munition).

## 6. Wandbild-Fragmente (Meta-Fortschritt)

- Je Biom **drei** Fragmente (21 insgesamt). Ein Wandbild-Knoten zeigt ein Relief als Bild (prozedural, im Hintergrund-Stil: Ritzlinien, Randlicht) und einen kurzen Text (2–4 Sätze) auf einem abgerissenen Zettel (Idee „Sonderkarten als Zettel“).
- Texte: im Ton von Lovecraft, aber eigene Worte. Andeuten, nichts erklären. Jedes Fragment ist ein Bruchstück der Geschichte der Tiefe (wer vor den Menschen hier war, was das Salz ist, wer ruft). Keine Namen aus dem Mythos (kein Cthulhu, kein Dagon), keine Zitate.
- Jedes Fragment schaltet etwas frei: eine Figur (siehe Tabelle oben), ein Item in den Fundpool, oder nur einen Satz im Tagebuch.
- **Tagebuch** im Titelmenü: gelesene Fragmente, erreichte Biome, beste Tiefe, gewählte Enden, Zahl der Runs. Ungelesenes als „…“.
- Gespeichert in `localStorage` (`saltmoor.meta.v1`), im Dev-Modus zurücksetzbar und vollständig freischaltbar.

## 7. Verlieren und Ende

- **Verlieren:** Bildschirm wird dunkel, Wasser-Rauschen, Text „Die Tiefe spuckt dich aus.“ Dann der **Strand**: Morgenlicht, Möwen, Salz in der Lunge. Kurze Liste: erreichte Tiefe, gelesene Fragmente, was neu freigeschaltet ist. Knopf „Wieder hinab“.
- **Gewinnen:** Nach dem Finale die **Ankunft**: ein ruhiges Bild (die Pforte offen, keine erklärende Figur), die Wahrheit der Figur als Satz, zwei Knöpfe:
  - **Bleiben**: „Du bist zu Hause.“ Musik löst sich in den Grundton auf.
  - **Umkehren**: „Du steigst auf. Oben ist es still. Aber du hörst es noch.“ Musik endet auf dem gekippten Akkord.
  Beide zählen als Sieg und stehen im Tagebuch.

## 8. Die sieben Biome

Jedes Biom hat: einen Ort mit **Wahrzeichen**, das man sofort wiedererkennt, ein **falsches Detail**, das neugierig macht statt zu erschrecken, eine Zonenpalette, eine Musik-Fassung, drei Gegnertypen plus einen Wächter, einen Fundpool. Die Hintergrund-Regeln stehen in [05-hintergruende.md](05-hintergruende.md).

Paletten der vorhandenen Zonen stehen in [zielbild.md](../spritegen/zielbild.md). Neue Paletten sind Vorschläge, der Agent darf sie nach Bildschirmfotos anpassen (Körper bleiben 4 dunkle Stufen nahe Schwarz, 2 Randlicht-Stufen, Augen hell).

### Akt 1a: Das Hafenviertel (1925)

- **Ort:** Nasse Kais bei Nacht, Lagerhäuser, Netze zum Trocknen, Kräne, ein Leuchtturm, dessen Licht über das Wasser streicht.
- **Wahrzeichen:** der Leuchtturm in der Ferne, dessen Lichtkegel durch die Szene wandert (langsam, alle ~12 s).
- **Falsches Detail:** Der Lichtkegel streicht nicht übers Meer, sondern **landeinwärts**, als suche er etwas in der Stadt. Die Fenster der Lagerhäuser sind alle von innen zugemauert, bis auf eines, ganz oben, mit warmem Licht.
- **Palette:** Hafen (blau), Augen `#ffe9a0`.
- **Gegner (Menschen, die etwas wissen und schweigen):** **Netzflickerin** (Favorit: gebeugt, zu lange Glieder, die abknicken), **Tiefling** (`fishman`: Fischer mit zu großen Augen, Kiemenfalten am Hals), **Schmuggler** (Mensch mit Laterne, Gesicht im Schatten, einen Arm zu viel unter dem Mantel). **Wächter:** **Der Lotse** (sehr hoch, Ölzeug, statt eines Kopfes ein Laternengehäuse, in dem etwas atmet).
- **Musik:** d-Moll, `Dm – B – Gm – A`, gekippt `Dm – Es – Gm – A♭9`. Ortsklang Meer, Ketten, ferne Glocke. (gibt es im Labor)
- **Fundpool:** Harpune, Bootshaken, Enterbeil, Ölmantel, Robbenfell, Ankerkette, Salz, Messer.

### Akt 1b: Der Moorwald (Volksglaube, Jahrhunderte alt)

- **Ort:** Ein lichter, abgestorbener Wald auf Torf, Wasserlöcher, Bohlenwege, ein Steinkreis auf einer Anhöhe.
- **Wahrzeichen:** Der Steinkreis, darüber ein Himmel mit Sternen, die man zu kennen glaubt.
- **Falsches Detail:** Die Bäume wachsen alle **leicht zur Mitte des Steinkreises geneigt**, als hörten sie zu. In den Wasserlöchern spiegeln sich Sterne, die es am Himmel nicht gibt.
- **Palette:** Wald (violett), Varianten mit Moor (grün) für die Sumpfteile. Augen `#9affe0`.
- **Gegner (Moorleute, Dinge zwischen Tier und Mensch):** **Hirte** (Favorit: hohe Silhouette, zerfetzter Mantel, Geweih mit leuchtenden Knoten, Gesicht aus Lichtpunkten), **Torfstecherin** (Mensch, gebückt, die Haut wie Rinde, wo sie den Boden berührt hat), **Das Nest** (Buckel auf Insektenbeinen, Zahnreihe; laut Zielbild „etwas Standard“, darum fremder machen: liest sich als Hügel, bis es aufsteht). **Wächter:** **Der Opfernde** (Klumpen-Plan: ein Steinhaufen mit Kerbe, aus der ein langer, menschlicher Arm wächst).
- **Musik:** c-Moll, `Cm – As – Fm – G`, gekippt `Cm – Des – Fm – G♭9`. Ortsklang Insekten, knackendes Holz, gurgelndes Wasser. Rhythmus aus Holz und Knochen.
- **Fundpool:** Sense, Hasenpfote, Hexenflasche, Schaufel, Wollmantel, Laterne, Handschuhe.

### Akt 2: Die überflutete Kapelle (ein Kult, der dem Ruf vor dir gefolgt ist)

- **Ort:** Eine Kapelle, halb im Wasser, Bänke ragen heraus, Kerzen auf Treibholz, ein Altar, hinter dem eine Treppe nach unten führt.
- **Wahrzeichen:** Das große Rundfenster hinter dem Altar, durch das grünliches Licht fällt, **von unten**.
- **Falsches Detail:** Das Wasser in der Kapelle steht **schräg**, die Wasserlinie an den Säulen ist geneigt, als hielte etwas den Raum gekippt. Die Kerzen brennen unter Wasser weiter.
- **Palette:** Kapelle (Kerze, bernstein). Augen `#fff4d0`.
- **Gegner (halb verwandelte Gläubige, Priester mit Kiemen):** **Chorknabe** (Favorit: drei gestapelte Köpfe, die singen, Kerzenlicht), **Kultist** (`cultist`: Kutte, Kiemenschlitze), **Ertrunkener** (`drowned`: aufgedunsen, aber nicht eklig, sondern still, mit Wasser, das ihm aus dem Mund läuft). **Wächter:** **Die Glockenmutter** (Zweibeiner, statt Kopf eine Glocke, die beim Angriff läutet, ohne dass ein Klöppel zu sehen ist).
- **Musik:** e-Moll, `Em – C – Am – H`, gekippt `Em – F – Am – H♭9`. Ortsklang Zugluft, verstimmte Orgel, kleine Glocken. (gibt es im Labor)
- **Fundpool:** Bibel, Rosenkranz, Schleier, Kerze, Priesterkragen, Kultmaske, Spieluhr, Robe.

### Akt 3a: Die Salzstollen (Römerzeit und Vorzeit)

- **Ort:** Stollen im Salz, Holzverbau, Grubenlampen, später ältere Schichten: römische Steinmetzzeichen, dann Höhlenzeichnungen, dann nur noch Salzkristalle so groß wie Häuser.
- **Wahrzeichen:** Eine **Salzkathedrale**: eine riesige Halle aus weißem Salz, mit Säulen, die nicht gebaut, sondern gewachsen sind.
- **Falsches Detail:** In die Salzwände sind **Fossilien von Meerestieren** eingeschlossen, aber sie haben die Augen offen und blicken alle in dieselbe Richtung, nach unten. Der Grubenhund-Wagen auf den Schienen fährt bergab, ohne dass jemand schiebt.
- **Palette (neu, Vorschlag „salz“):** Körper `#070606 #100d0c #1c1716 #2c2421`, Randlicht `#9a8a80 #f4ece4`, Augen `#ff9a5a`. Hintergrund heller als in den anderen Biomen (Salz reflektiert), damit sich das Biom abhebt.
- **Gegner (Knochen, Grabwächter, blinde Tiere aus der Tiefe):** **Schlundträger** („cool“: Kopf senkrecht aufgeplatzt, Tentakel hängen heraus, Zahnreihen am Spalt), **Salzläufer** (Krabbler, blind, weiß verkrustet, tastet mit zu vielen Fühlern), **Grabwächter** (Zweibeiner, in Salz konserviert, römischer Helm verwachsen mit dem Schädel). **Wächter:** **Der Wurm im Salz** (Wurm-Plan, sehr lang, kommt aus der Wand, nur ein Teil ist sichtbar).
- **Musik (Vorschlag):** f-Moll, `Fm – Des – B♭m – C`, gekippt `Fm – Ges – B♭m – C♭9`. Ortsklang Tropfen, Holz knarrt, ferne Hacke, Salz knistert. Rhythmus: Hacke auf Stein.
- **Fundpool:** Salz, Riechsalz, Dynamit, Laterne, Schaufel, Taucherhelm (ohne Flut-Teil), Grubenlampe (neu oder als Laterne).

### Akt 3b: Die namenlose Stadt (vor dem Menschen)

- **Ort:** Eine Stadt aus niedrigen Gängen und Hallen, gebaut für Wesen, die **nicht aufrecht gingen** (Decken nur hüfthoch, dann plötzlich riesige Hallen), Reliefs überall, Sand und ein Wind, der aus der Tiefe nach oben weht.
- **Wahrzeichen:** Ein **Reliefband** an der Hallenwand, das die ganze Szene entlangläuft und eine Geschichte erzählt, die man nicht lesen kann (Figuren mit zu vielen Gelenken, die etwas Großes anbeten oder davor fliehen).
- **Falsches Detail:** Die Proportionen stimmen nicht: Türen sind breit und flach, Treppenstufen zu niedrig für Füße. Der Wind trägt Sand **nach oben** aus dem Abgrund, und manchmal klingt er wie Atem.
- **Palette:** Rost (rot/ocker). Augen `#ffe060`.
- **Gegner (Mumien und Wächter der Erbauer, Dinge, die Menschen nachahmen):** **Bote** (die Idee „senkrechter Mund quer durch die Brust“ behalten, Figur neu gestalten), **Schatten** (`shade`: Schwebender, halb im Wind, nur Augen und Randlicht), **Erbauer-Mumie** (Krabbler, kriechend, mit zu vielen Gelenken, in Binden, das Gesicht ein Relief). **Wächter:** **Der Wind, der Gestalt hat** (Schwebend-Plan, eine Säule aus Sand und Stoffresten mit einem Augenpaar, das wandert).
- **Musik (Vorschlag):** b-Moll, `B♭m – G♭ – E♭m – F`, gekippt `B♭m – C♭ – E♭m – F♭9`. Ortsklang Wind in Gängen, Sand rieselt, ferne Trommel ohne Spieler.
- **Fundpool:** Dolch, Tarotkarten, Auge im Glas (verflucht), Glimmender Götze (verflucht), Kompass der nach unten zeigt, Stockdegen.

### Akt 4: Das schwarze Eis (vor dem Leben an Land)

- **Ort:** Ein gefrorenes, schwarzes Urmeer unter der Erde. Eisflächen, durch die man tief hinabsehen kann, gefrorene Wellen, Höhlendecke wie ein Himmel ohne Sterne.
- **Wahrzeichen:** Unter dem Eis, ganz tief, ein **riesiger Umriss** (Stadt? Lebewesen? beides?), der nur durch ein schwaches Leuchten zu ahnen ist. Er bleibt in jeder Szene des Biomes an derselben Stelle.
- **Falsches Detail:** Die Wellen sind **mitten in der Bewegung gefroren**, aber manchmal ist eine Welle ein Stück weiter als vorher. In der Ferne ruft eine menschliche Stimme deinen Namen (als Klang, siehe Musik).
- **Palette (neu, Vorschlag „eis“):** Körper `#030508 #070c14 #0e1624 #18243a`, Randlicht `#5a8ab0 #e8f6ff`, Augen `#ff4a4a`.
- **Gegner (Nachahmer, die mit menschlichen Stimmen rufen):** **Der Rufer** (Zweibeiner, fast ein Mensch, aber der Hals zu lang und der Kopf zu klein, Mund immer offen), **Das Eisgesicht** (Schwebend: ein Gesicht, das unter einer Eisschicht treibt), **Der Nachgeher** (Krabbler, bewegt sich in den Posen eines Menschen, aber auf allen vieren). **Wächter:** **Der Chor im Eis** (Klumpen-Plan: viele Köpfe, eingefroren, die gemeinsam atmen).
- **Musik (Vorschlag):** fis-Moll, `F♯m – D – Bm – C♯`, gekippt `F♯m – G – Bm – C♭9`. Ortsklang: knackendes Eis, tiefes Dröhnen, eine ferne menschliche Stimme (gefiltertes Rauschen mit Formanten, keine Sprache).
- **Fundpool:** Gasmaske, Offiziersmantel, Leuchtpistole, Laudanum, Rum, Hexenflasche.

### Akt 5: Die Pforte (außerhalb der Zeit, Finale)

- **Ort:** Ein Raum ohne klare Wände. Geometrie, die nicht stimmt: Treppen, die zu sich selbst führen, ein Horizont, der sich zur Szene hin wölbt, eine Öffnung in der Mitte, die gleichzeitig nah und unendlich fern ist.
- **Wahrzeichen:** **Die Pforte**: ein Umriss aus Randlicht, dessen Farbe langsam zwischen zwei Farben wandert, die nicht zueinander passen (Magenta und Türkis): „eine Farbe, die es nicht gibt“.
- **Falsches Detail:** Die Szene ist **leicht gespiegelt** gegenüber dem, was man erwartet (Licht kommt von links statt rechts). Die Spielregeln biegen sich: Im Finale kosten zufällige Karten jede Runde 1 weniger oder 1 mehr (sichtbar markiert).
- **Palette:** Grund (türkis) mit Augen `#ff6ad8`, Randlicht wandert langsam zu Magenta und zurück.
- **Gegner:** **Das, was ruft** (`boss`, Handarbeit, mehrere Phasen; Entwürfe `eye`, `maw`, `king` aus `foes.js` als Ideen, neu im Ziel-Look), dazu **Augen im Rand** (kleine Schwebende, die der Boss ruft).
- **Musik (Vorschlag):** es-Moll, Harmonie dauerhaft halb gekippt, Gegnerstimme Nebelhorn (`foe_ruft`), Duell-Regel gilt im Finale ab der letzten Phase.

## 9. Gegner: Daten und Stimmen

`data/foes.json` bekommt pro Gegner zusätzlich: `biom`, `rang` (`normal`, `waechter`, `boss`), `generator` (Körperbauplan, Parameterbereiche, Seed-Bereich, Zone), `stimme` (Motiv und Klangfarbe für die Musik), `beute` (optionales eigenes Item, kleine Chance). Werte (`hp`, `pat`, `weak`) nach dem bestehenden Muster; jeder Gegner hat 2–4 Züge im Muster, Wächter 4–5 und eine Besonderheit (z. B. ruft Verstärkung, wechselt die Schwachstelle).

Schwachstellen über die Biome verteilen, damit alle acht Stoffe gebraucht werden.

| Gegner | Stimme (Vorschlag, prozedural) |
|---|---|
| Netzflickerin | gezupfte, verstimmte Saite |
| Tiefling | tiefes, nasses Blech (gibt es) |
| Schmuggler | gepfiffenes Motiv |
| Hirte | hohle Holzflöte |
| Torfstecherin | Summen, sehr tief |
| Nest | schnarrendes Insektenzirpen auf Tonhöhe |
| Chorknabe | hoher Knabenchor auf „oh“ |
| Kultist | gedämpfter Männerchor (gibt es) |
| Ertrunkener | gurgelnde Stimme (gibt es) |
| Schlundträger | Kehlgesang |
| Salzläufer | Klicken auf Tonhöhe |
| Grabwächter | Horn aus Knochen |
| Bote | Röhren mit Echo |
| Schatten | Flüstern (gibt es) |
| Erbauer-Mumie | tiefe Rahmentrommel auf Tonhöhe |
| Rufer, Eisgesicht, Nachgeher | menschliche Formanten ohne Worte, verschieden hoch |
| Wächter | Stimme ihres Bioms eine Oktave tiefer und gedoppelt |
| Das, was ruft | Nebelhorn (gibt es) |
