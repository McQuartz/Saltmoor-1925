# Lovecraft-Kern: vier Systeme, die das Spiel verändern

Quelle: „Lovecraft als Mechanik-Quelle V2“ (Philip hat V1 bewertet, V2 ist danach entstanden, Feedback wörtlich in [00-philip.md](00-philip.md)). Was hier über V2 hinausgeht, ist eine Festlegung dieses Plans und als **(Plan)** markiert.

Die Kern-Systeme sind die einzigen neuen Mechaniken, die in **jedem** Run auftauchen können. Jede verändert das Spielen, keine zieht Werte ab. Reihenfolge der Umsetzung: Regelbiegung (M5), Hören statt sehen (M6), Sehen und gesehen werden (M7), Die Farbe (M8). Die Farbe kommt zuletzt, damit sie als Erstes wegfallen kann, falls vier zu viel sind.

## 1. Designregeln

**Lovecrafts Prinzipien** (Geschmack, jede Mechanik muss mindestens eines tragen):

1. Das Grauen ändert Regeln, nicht Werte.
2. Wissen ist irreversibel. Was einmal gesehen ist, bleibt gesehen.
3. Der Preis ist verzögert und verdient.
4. Du bist Teil des Problems.
5. Das Ding ist gleichgültig.
6. Substanz verfällt oder wird ersetzt.
7. Andeuten statt zeigen.
8. Alles kommt aus Zeugnissen.

**Saltmoor-Regeln** (Pflicht, Prüffragen in [01-regeln.md](01-regeln.md) Abschnitt 3): Verändern statt schwächen. Das Deck bleibt deins. Selten ist stark. Kein Fragezeichen. Einwilligung vor Kontrollverlust. Unheimlich, nicht anstrengend. Nie Herkunft als Bedrohung.

---

## 2. Die Tiefe biegt die Regeln: Grundsätze

*Aus: Tiefe ist Zeit, Über Eck, Falsche Winkel.*

- Die Biome der Akte I und II spielen sich normal. **Jedes Biom der Akte III bis V hat genau eine Regelbiegung** (14 Biome). Damit trifft jeder Run drei Biegungen, eine je tiefem Akt. **(Plan:** V2 nannte vier Biome, „weitere können eigene bekommen, höchstens eine pro Biom“. Damit jeder Run den Kern spürt, bekommen alle 14 eine.)
- Kein Stoff wird unbrauchbar, kein Wert sinkt. Jede Biegung ist eine Regel, auf die man das Deck ausrichten kann.
- Die Biegung ist **vorher sichtbar**: auf der Biom-Wahl am Aktanfang und auf der Peilkarte, im Kampf in der Kopfleiste (Zeichen und Name, Tooltip mit dem Regeltext). Sie gilt in **allen Kämpfen des Bioms**, auch beim Wächter.
- Der Stoff-Baum zeigt, was die Biegung ändert ([05-oberflaeche.md](05-oberflaeche.md) Abschnitt 2).
- Technik: `data/biegungen.json` mit `id`, `n` (Name), `t` (Regeltext, `entwurf: true`), `zeichen` und `art`. Im Code **ein** Biegungs-Modul (`js/core/biegung.js`) mit festen Einhakpunkten, die Kampf, Vorschau, Stoff-Baum und Bots gemeinsam benutzen:
  - `quelleReaktion(zustand)`: welche Stoffe als „Karte davor“ gelten,
  - `extraReaktionen()`: zusätzliche Paare, die nur hier gelten,
  - `zugEnde(zustand)`: was am Zugende geschieht,
  - `ziehen(zustand)`, `ablage(karte, zustand)`: woher gezogen wird, wohin gespielte Karten gehen,
  - `absichtenSichtbar(gegner)`: wie viele Absichten gezeigt werden.
  Keine Biegung wird mit einer eigenen Kopie der Reaktionsregeln gebaut.
- Schalter: `balance.json → auftrag3.regelbiegung`. Aus = alle Biome spielen sich wie heute.

## 3. Die 14 Regelbiegungen

Die ersten vier stammen aus V2, die übrigen zehn sind **(Plan)**, aus dem Steckbrief und dem falschen Detail des Bioms abgeleitet. Namen und Regeltexte sind Entwürfe. Wenn der Build-Bot-Vergleich (Abschnitt 8) zeigt, dass eine Biegung sich nur schlechter spielt, baust du sie nach der Prüffrage „anders oder nur schlechter?“ um und schreibst es auf.

### Akt III

| Biom | Biegung | Regel | Hinweis zur Umsetzung |
|---|---|---|---|
| Salzstollen (`salz`) | **Alte Stoffe erinnern sich** | Salz, Wasser und Blut bekommen hier drei uralte Reaktionen miteinander (SW, BS, BW). Junge Stoffe bleiben, wie sie sind. | Heute gibt es keine Reaktion zwischen diesen dreien (`reactions.json`). Die drei neuen Paare nur in diesem Biom, mit Wirkungen, die zum Salz passen (Vorschlag: SW mehr Block und eine Karte ziehen, BS Schaden und halbe Heilung, BW alle Gegner verwundbar). Werte im Bereich der vorhandenen Paare. |
| Namenlose Stadt (`stadt`) | **Über Eck** | Die erste und die letzte Karte eines Zuges reagieren miteinander. Der Zug schließt sich zum Kreis. | Wird beim Drücken von „Zug beenden“ ausgewertet, nur wenn mindestens drei Karten gespielt wurden. Ziel ist das zuletzt gewählte. Hochreaktionen zählen mit, wenn noch nicht verbraucht. **Erste Probe des ganzen Kerns.** |
| Wald, der nach unten wächst (`wald`) | **Rückwärts gewachsen** | Am Zugbeginn kommt eine Karte aus der Ablage zurück auf die Hand: die zuletzt gespielte. Die übrigen Karten zieht man wie immer. | Ersetzt einen der normalen Züge vom Stapel. Ist die Ablage leer, normal ziehen. (Die Jahresringe zählen rückwärts.) |
| Gezeitenwerk (`gezeitenwerk`) | **Ebbe und Flut** | Jeder zweite Zug ist Flut: Die Hand wird am Zugende nicht abgeworfen, man zieht nur bis zur Handgröße auf. | Die Kopfleiste zeigt, ob der nächste Zug Ebbe oder Flut ist. Passt zum Wächter „Regulator“. |
| Ziegelgruben (`ziegelgruben`) | **Der Ringofen** | Die Kette reißt am Zugende nicht ab: Die erste Karte eines Zuges reagiert mit der letzten des vorigen. | Der Stoff-Baum beginnt den Zug mit dem letzten Glied des Vorzugs. (Die Kammern laufen um eine Kurve, die sich nie schließt.) |
| Station, die nie eröffnet wurde (`station`) | **Keiner fährt ab** | Eine Karte, die eine Reaktion auslöst, legt sich oben auf den Stapel statt auf die Ablage. Höchstens zwei Karten je Zug. | Man zieht sie im nächsten Zug wieder. Der Stapel zeigt die oberste Karte, wenn sie so zurückkam. |

### Akt IV

| Biom | Biegung | Regel | Hinweis zur Umsetzung |
|---|---|---|---|
| Schwarzes Eis (`eis`) | **Falsche Winkel** | Jede Karte reagiert mit der **vorletzten** Karte statt mit der letzten. | **(Plan, Abweichung von V2.)** V2 schrieb „Reaktionen zählen in beide Richtungen“. Im Code sind Paare schon richtungslos (`pairKey` in `js/core/rules.js` sortiert), die V2-Fassung wäre im Spiel unsichtbar. Zeigt der Bot-Vergleich mehr als 10 Prozentpunkte Verlust in Akt IV, gilt stattdessen: mit der letzten **und** der vorletzten. Beides im Bericht. |
| Walkathedrale (`walkathedrale`) | **Der Schlag** | Die dritte Karte eines Zuges reagiert mit allen Karten, die in diesem Zug davor lagen, nicht nur mit der letzten. | Fällt mit dem Herzschlag der Musik zusammen (vorhandener Takt-Kniff), der Schlag ist bei der dritten Karte hörbar. |
| Glasmeer (`glasmeer`) | **Das Spiegelbild ist voraus** | Die oberste Karte des Stapels liegt offen. Einmal je Zug darfst du eine Handkarte gegen sie tauschen. | Klick auf den Stapel, dann auf die Handkarte. (Dein Spiegelbild ist einen Schritt voraus.) |
| Mond unter dem Eis (`mond`) | **Die Rückseite** | Jeder Gegner zeigt zwei Absichten: diesen Zug und den nächsten. | Die Plakette bekommt eine zweite, kleinere Zeile. Stumme Gegner zeigen weiter nichts. (Die Rückseite schaut dich an.) |
| Funkstation am Pol (`funkstation`) | **Funkspruch** | Drei Karten mit gleichen Kosten direkt nacheinander: Die dritte ist verstärkt, egal welcher Stoff. | Zusätzlich zu normalen Reaktionen, einmal je Zug. Der Stoff-Baum blinkt kurz-kurz-lang. |

### Akt V

| Biom | Biegung | Regel | Hinweis zur Umsetzung |
|---|---|---|---|
| Pforte (`pforte`) | **Außerhalb der Zeit** | Jeden Zug gilt die Biegung eines anderen Bioms. | Aus den 13 übrigen, über den Seed, nie zweimal hintereinander. Die Kopfleiste zeigt die Biegung dieses Zuges und klein die des nächsten, damit man planen kann. |
| Ufer unten (`ufer`) | **Die Wellen kommen von oben** | Gespielte und abgeworfene Karten gehen unter den Stapel statt auf die Ablage. Es wird nie gemischt. | Die Reihenfolge des Decks wird planbar. Der Stapel zeigt keine Ablage mehr, sondern seine Länge. |
| Waage am Grund (`waage`) | **Aufgewogen** | Energie, die am Zugende übrig ist, verfällt nicht, sondern liegt als Block in der Schale: 3 Block je Energie. | Gilt vor dem Gegnerzug. (Die Waage neigt sich immer zu dir.) |

## 4. Hören statt sehen

*Aus: The Music of Erich Zann, The Rats in the Walls. Philip: „da steht kein Fragezeichen, da steht gar nichts, aber die Musik ändert sich. Das ist ja, das ist geil.“*

- **Wo (Plan):** nur in Akt IV und V. Genau **ein** Gegnertyp je Akt-IV-Biom (5) und **einer** im Vorraum-Pool von Akt V bekommen `stumm: true`. Nie Wächter, nie das Finale. Höchstens **ein** stummer Gegner pro Kampf. Wähle Gegner, deren Muster mindestens zwei Absicht-Arten hat (sonst gibt es nichts zu hören).
- **Was man sieht:** Die Plakette zeigt nur das Leben. Kein leerer Kasten, kein Strich, kein „?“, kein Tooltip „unbekannt“. Die Schadensvorschau im eigenen Balken zählt den stummen Gegner nicht mit.
- **Was man hört:** Jede Absicht-Art hat einen eigenen Einsatz in der Layer-Musik, der zum Zugbeginn mit der neuen Absicht einsetzt und den Spielerzug über läuft:
  - **Angriff:** ein tiefer, gezupfter Puls (Kontrabass oder Kesselpauke aus den vorhandenen Bausteinen). Wie viele Schläge pro Takt, zeigt die Stärke in drei Stufen.
  - **Block, Schutz, Heilung:** eine einzelne Glocke auf der Eins.
  - **Zauber, Status, Ruf:** ein Harmonium- oder Formant-Ton, der langsam aufschwillt.
  Die Einsätze sind tonal passend zur Biom-Tonart, im Tempo des Stücks und deutlich genug, dass man sie heraushört. Die übrigen Layer treten dafür leicht zurück. Aces Hör-Regeln gelten (kein Clipping, nichts offkey, 80–88 BPM).
- **Keine Erklärung.** Kein Tutorial, kein Hinweistext. Man soll sich kurz fragen, ob etwas kaputt ist, und dann darauf kommen.
- **Barrierefreiheit:** In den Einstellungen „Klänge als Zeichen“ (aus als Standard). An: Neben der Plakette erscheint im Takt ein kleines Notenzeichen in der Farbe der Absicht-Art. Das ist nur eine Einstellung, nicht das normale Spiel.
- **Musik-Labor:** `prototype/musik.html` bekommt einen Abschnitt, in dem man die drei Einsätze in jeder Biom-Fassung einzeln anhören kann.
- **Mit Blick** (Abschnitt 5) wird auch die Absicht stummer Gegner sichtbar.
- Schalter: `auftrag3.hoeren`.

## 5. Sehen und gesehen werden

*Aus: From Beyond, Bloodborne. Philip: „finde ich zum Beispiel geil, weil das einfach Gameplay ändert.“*

- **Drei Blick-Items** (neu, Talisman, selten): **Linse**, **Resonator**, **Lampe aus dem Grab**. Jedes bringt wie andere Items eigene Karten und Stoffe (Vorschlag: Linse Licht, Resonator Eisen, Lampe Fäulnis), dazu die Eigenschaft `blick`. Fundorte **(Plan):** Linse im Fundpool von Akt II, Resonator in Akt III, Lampe in Akt IV, jeweils auch beim Krämer. Icons in der Item-Pipeline aus Auftrag 2, Note mindestens 4.
- **Die Wahl:** Trägt man ein Blick-Item, liegt zu Kampfbeginn vor dem ersten Zug auf dem Tisch eine Wahl mit zwei Knöpfen: **Hinsehen** oder **Nicht hinsehen**. Standard ist Nicht hinsehen. Die Wahl gilt für den ganzen Kampf.
- **Hinsehen zeigt alles:** alle Absichten, auch die stummer Gegner und verborgener Kniffe, die vollständigen Werte der Kniffe und **Dinge, die vorher nicht da waren**.
- **Die Dinge sehen dich auch:**
  - In normalen und schweren Kämpfen kommt ein **Gesehener** dazu. **(Plan:** drei neue Gegner, je einer für Akt II bis III, Akt IV und Akt V, Wesen aus „From Beyond“: halb durchsichtige, schwebende Formen, die nur mit Blick zu sehen sind. Ganz neu gezeichnet in der Pipeline aus Auftrag 2, kein Umfärben vorhandener Gegner.)
  - Beim Wächter kommt stattdessen ein **stärkerer Zug** in sein Muster (ein zusätzlicher Musterschritt, der zu seinem Kniff passt, in den Paketdaten je Wächter als `gesehen`).
- **Dafür bessere Beute:** nach einem Sieg mit Hinsehen 1 aus 4 Karten statt 1 aus 3 und das Item-Angebot sicher statt mit 25 %.
- **Andeuten statt zeigen:** Ohne Blick ist vom Gesehenen nichts zu sehen. Höchstens einmal pro Akt, wenn man ein Blick-Item trägt und nicht hinsieht, flackert für einen Augenblick ein Schatten in der Szene. Kein Text.
- Der Autospieler und die Build-Bots entscheiden das Hinsehen nach einer einfachen Regel (z. B. hinsehen, wenn Leben über 60 %).
- Schalter: `auftrag3.blick`.

## 6. Die Farbe

*Neu gedacht: dynamisch statt zerstörend. Philip: „ein neunter Stoff ohne Farbe, finde ich gut, das dann irgendwie ein bisschen dynamischer ist“.*

- **Der neunte Stoff** `X`, „Die Farbe“, in `stoffe.json`. Ihr Farbton kommt **in keiner Zonenpalette vor**: Prüfe alle Paletten per Skript und wähle einen Ton, der weit von allen entfernt ist. Sie schimmert über Paletten-Wechsel in Pixeln, ohne Weichzeichner.
- **Wann sie kommt (Plan):** höchstens einmal pro Run, in etwa der Hälfte der Runs, über ein eigenes Ereignis in Akt II oder III („ein Brunnen auf einem Hof, in dem etwas liegt“, neuer Text, `entwurf: true`). Man kann sie annehmen oder liegen lassen. So hat man zugestimmt.
- **Wie sie wirkt:** Sie setzt sich auf eines deiner angelegten Items (das Item schimmert). Solange sie dort ist, **nimmt jede Karte dieses Items den Stoff der Karte an, die du davor gespielt hast**, und reagiert damit fast immer (Verstärkt). Die erste Karte eines Zuges behält ihre eigenen Stoffe.
- **Sie wandert:** Nach jedem Kampf springt sie auf ein anderes angelegtes Item (über den Seed, nie zurück auf das letzte). Ist nur eines angelegt, bleibt sie.
- **Sie hinterlässt eine Spur:** Auf dem Item, das sie verlässt, ist **ein Stoff gegen einen anderen getauscht** (nie gegen `X`, nie so, dass das Item zweimal denselben Stoff hat). Das Item wird nicht schlechter, nur anders. Die Spur ist am Item als feine Linie in der Farbe der Farbe zu sehen.
- **Die Werkstatt** bekommt die Option **„Spur tilgen“**: dreht einen Tausch zurück, kostet eine Werkstatt-Aktion wie die anderen Optionen.
- **Binden mit Salz:** Spielst du direkt nach einer Karte des Farbe-Items eine Karte mit Salz, ist die Farbe **gebunden**: Sie bleibt für den Rest des Runs auf diesem Item, wandert nicht mehr und hinterlässt keine Spuren mehr. Das Schimmern erstarrt zu etwas Kristallinem.
- Der Stoff-Baum zeigt das Farbe-Glied in der Farbe des Stoffs, den es gerade annimmt. Der Rucksack zeigt Farbe, Spuren und Bindung.
- Schalter: `auftrag3.farbe`.

## 7. Was die Kern-Systeme zusammen nicht dürfen

- In einem Kampf gelten höchstens: die Biegung des Bioms, ein stummer Gegner, der Blick (wenn gewählt) und die Farbe auf einem Item. Mehr Kern gibt es nicht.
- Kein Kern-System entfernt eine Karte aus dem Deck oder macht ein Item unbrauchbar.
- Kein Kern-System verlangt Buchhaltung: Alles, was man wissen muss, steht im Stoff-Baum, auf der Plakette, in der Kopfleiste oder ist zu hören.

## 8. Prüfung der Kern-Systeme

- **Bot-Vergleich:** Build-Bots (alle Builds, je 50 Seeds) und generischer Autospieler (100 Seeds) einmal mit allen Kern-Systemen aus, einmal mit jedem einzeln an, einmal mit allen an. Tabelle im Bericht. Zielbereich wie in Auftrag 2 (Builds 40 bis 65 %, kein Akt über 35 % der Niederlagen). Weicht ein System mehr als 10 Prozentpunkte nach unten ab, ist es vermutlich ein Debuff und wird umgebaut.
- **Die Bots müssen die Systeme nutzen:** Der Bot kennt die Biegung und spielt auf sie hin (z. B. ordnet die Hand für Über Eck), hört stumme Gegner über dieselbe Schnittstelle, aus der die Musik ihre Einsätze nimmt, entscheidet beim Blick und bindet die Farbe, wenn er kann. Ein Bot, der die Systeme ignoriert, misst nichts.
- **Tests:** je Biegung ein Test, der die Regel an einem festen Zug prüft; Stoff-Baum und Kampf zeigen dieselben Reaktionen (Vergleichstest); stumme Plakette ohne Absicht im DOM; Musik-Einsatz je Absicht-Art; Blick-Wahl, Gesehener, Beute; Farbe springt, Spur, Tilgen, Binden; Speicherstand mit allen Zuständen.
