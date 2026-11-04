# Sechs Builds mit Beispieldecks (M4)

Konzept: [04-deckbau.md](04-deckbau.md) Abschnitt 7. Daten: `prototype/data/items.json`, `prototype/data/handgriffe.json`, Sonderwirkungen und neue Eigenschaften: [handgriffe.md](handgriffe.md). Reaktionen: `prototype/data/reactions.json`.

**Rechnung der Decks:** Jedes Item mit Stammkarte gibt 2 Kopien (`card_copies`), jeder Handgriff in einer Kerbe 1 Kopie. Gewöhnliche Items haben 1 Kerbe, seltene und Reliquien 2, die Werkstatt gibt +1 (höchstens 3). Ein Handgriff hat die Stoffe seines Items. Die Züge unten rechnen mit 3 Energie und **ohne** Aufpreis für zwei Stoffe bei Handgriffen (Vorschlag aus handgriffe.md). Stammkarten aus Zwei-Stoff-Items kosten +1.

Stoffe: E Eisen, F Feuer, W Wasser, S Salz, B Blut, G Glaube, L Licht, V Fäulnis.

---

## 1. Glutnest (Feuer, mit Eisen oder Salz)

- **Kern:** Brand stapeln und verdoppeln. Glühend (EF) und Knistern (FS) legen nach, Fanal (FL) bezahlt es.
- **Stütze:** Kohlenschaufel des Heizers (`brand_haelt`: Brand fällt nur um 1), Zunderbüchse (Brand 3 an allen zu Kampfbeginn), Schüren und Nachlegen (behalten).
- **Höhepunkt:** Der Ofen unter der Fabrik (`brand_springt`) plus Ofentür (3: Brand an allen verdoppeln). Ein Gegner stirbt mit 16 Brand, alle anderen fangen ihn auf.
- **Schwäche:** Löschen (Kurhaus, Ertrunkene), Gegner aus Wasser, sehr kurze Kämpfe.

**Beispieldeck, Ende Akt IV (24 Karten, 7 mit Kosten 0):**

| Item (Stoff) | Stammkarte ×2 | Handgriffe in den Kerben | Stoff der Handgriffe |
|---|---|---|---|
| Teerfackel (F+L, selten) | Teer und Flamme | Schüren, Funkenflug | Feuer + Licht (Fanal in jeder Karte) |
| Salzbeutel (S) | Salz streuen | Nachlegen | Salz → Knistern nach Feuer |
| Kohlenschaufel des Heizers (F, selten) | Schaufeln | Glimmen, Standhalten | Feuer |
| Schürhaken (E) | Zuschlagen | Brandmal | Eisen → Glühend nach Feuer |
| Ölmantel (W) | Abperlen | Ausweichen | Wasser → Dampf nach Feuer |
| Der Ofen unter der Fabrik (F, Reliquie) | Glutkern | Ofentür, Zündeln | Feuer |
| Schwarze Kerze (F) | Entzünden | Atemholen | Feuer |

**Ein typischer Zug** (3 Energie, Ziel ohne Brand):

1. *Salz streuen* (Salz, 0): 3 Block.
2. *Funkenflug* (Teerfackel, F+L, 0): Brand 1 an allen. **Knistern** (S→F): 3 Schaden und Brand 1 an allen. **Fanal** (F+L in der Karte): +1 Energie (4). Ziel: Brand 2.
3. *Zuschlagen* (Schürhaken, E, 1): 5 Schaden, Verwundbar 1. **Glühend** (F→E): 4 Schaden, Brand 2. Ziel: Brand 4. Energie 3.
4. *Schüren* (Teerfackel, F+L, 1): Brand ×2 = 8. **Glühend** (E→F): 4 Schaden, Brand 2 = 10. **Fanal**: +1 Energie. Energie 3.
5. *Glutkern* (Ofen, F, 1): Brand 4, **Verstärkt** (F→F) ×1,5 = 6. **Fanal** (L→F): +1 Energie. Ziel: Brand 16. Energie 3.
6. *Glimmen* (Kohlenschaufel, F, Funke → 0, Verstärkt): 3 Schaden, Brand 3. *Nachlegen* bleibt auf der Hand (behalten) für den nächsten Zug.

Acht Reaktionen. Zu Beginn des Gegnerzugs nimmt das Ziel 19 Schaden (Kohlenschaufel: danach Brand 18 statt 9). Stirbt es, springt der Brand auf alle (Ofen).

---

## 2. Brackwasser (Fäulnis und Wasser)

- **Kern:** Gift. Brackwasser (VW) und Seuche (BV) legen nach, Ertrinken (BVW, Hochreaktion) verdreifacht, Läuterung (LV) entlädt alles auf einmal.
- **Stütze:** Ansteckung (Gift wandert beim Tod), Sickern (am Zugende Gift an allen), Ehering (Gift 3 an allen zu Kampfbeginn).
- **Höhepunkt:** Glas mit Moorwasser (`gift_doppelt`) und Ertrinken auf ein Ziel mit 13 Gift: 39 Gift, das am Zugende doppelt zählt.
- **Schwäche:** Gegner ohne Fleisch (`rein`: Salzwesen, Eis, Bronze), kurze Kämpfe, Gegner, die sich heilen.

**Beispieldeck, Ende Akt IV (22 Karten, 7 mit Kosten 0):**

| Item (Stoff) | Stammkarte ×2 | Handgriffe | Stoff der Handgriffe |
|---|---|---|---|
| Ritualdolch der Fäulnis (Dolch + Muschel in der Werkstatt verschmolzen, B+V) | Aderlass | Ansteckung, Bodensatz | Blut + Fäulnis (Seuche in jeder Karte) |
| Sense (V, +1 Kerbe aus der Werkstatt) | Mähen | Hinabziehen, Spucken | Fäulnis |
| Gasmaske (V) | Durch den Filter | Lauern | Fäulnis |
| Gummistiefel (W) | Waten | Umrühren | Wasser → Brackwasser nach Fäulnis |
| Glas mit Moorwasser (V, Reliquie, keine Stammkarte) | – | Faulen lassen, Sickern | Fäulnis |
| Sturmlaterne (L) | Blenden | Schlick werfen | Licht → Läuterung nach Fäulnis |
| Ölmantel (W) | Abperlen | Ausweichen | Wasser |

**Ein typischer Zug** (3 Energie, Ziel hat Gift 6 vom letzten Zug):

1. *Spucken* (Sense, V, 0): Gift 2 → 8.
2. *Waten* (Stiefel, W, 0): 2 Block, ziehe 1. **Brackwasser** (V→W): Gift 3 → 11.
3. *Aderlass* (Dolch, B+V, Opfer 2 Leben statt Energie): 6 Schaden. **Brackwasser** (W→V): Gift 3 → 14. **Seuche** (B+V in der Karte): Gift 2 an allen → 16. **Ertrinken** (W davor, B+V jetzt): Gift aller Gegner ×3 → 48.
4. *Hinabziehen* (Sense, V, 2): 2 Schaden und Gift 3 an allen. **Verstärkt** (V→V), **Seuche** (B→V): Gift 2 an allen → 53. Energie 1.
5. *Sickern* (Moorglas, V, 1): Gift 2, wird nicht gespielt, sondern bleibt auf der Hand; am Zugende Gift 1 an allen → 54.

Sechs Reaktionen, eine Hochreaktion. Am Zugbeginn des Ziels: 54 Gift ×2 (Moorglas). Wenn das in M8 zu stark ist: Ertrinken ×2 statt ×3.

---

## 3. Bollwerk (Glaube und Salz)

- **Kern:** Block und Schutz über Züge tragen. Bannkreis (GS) gibt jedes Mal 8 Block und 4 Schutz.
- **Stütze:** Standhalten, Gegenstemmen und Wache halten (behalten), Weihwasser (`reaktion_block`), Taucherhelm (Block zu Kampfbeginn).
- **Höhepunkt:** Taufstein-Splitter (`block_haelt_halb`) plus Bannspruch (Block ×2), dann Kanzelschlag mit 40 und mehr Block.
- **Schwäche:** Brecher (zerbrechen Block), Gift, Gegner, die nicht angreifen und nur wachsen.

**Beispieldeck, Ende Akt IV (23 Karten, 7 mit Kosten 0):**

| Item (Stoff) | Stammkarte ×2 | Handgriffe | Stoff der Handgriffe |
|---|---|---|---|
| Familienbibel (G) | Psalm | Kanzelschlag | Glaube |
| Weihwasser (S+G, selten) | Besprengen | Standhalten, Schwelle | Salz + Glaube (Bannkreis in jeder Karte) |
| Priesterkragen (G) | Segnen | Kreidekreis | Glaube |
| Salzbeutel (S) | Salz streuen | Gegenstemmen | Salz |
| Taufstein-Splitter (G, Reliquie) | Taufe | Bannspruch, Wache halten | Glaube |
| Silberkreuz (G) | Kreuz zeigen | Schulterstoß | Glaube |
| Robbenfell (W) | Fettschicht | Kniefall | Wasser |

**Ein typischer Zug** (3 Energie; vom letzten Zug 14 Block durch den Taufstein und 4 Schutz, also 18 Block):

1. *Salz streuen* (Salz, 0): 3 Block → 21.
2. *Segnen* (Kragen, G, 0): 4 Block → 25. **Bannkreis** (S→G): +8 Block, +4 Schutz nächster Zug, Weihwasser +1 → 34.
3. *Gegenstemmen* (Salzbeutel, S, 0): 3 Block → 37. **Bannkreis** (G→S) +8, +1 → 46.
4. *Kanzelschlag* (Bibel, G, 2): **46 Schaden**. **Bannkreis** (S→G) +8, +1 → 55 Block. Energie 1.
5. *Standhalten* (Weihwasser, S+G, 1): 6 Block, **Verstärkt** (G→G) ×1,5 = 9, **Bannkreis** +8, +2 → 74. Am Zugende bleiben 37 (Taufstein).

Fünf Reaktionen. Mit *Bannspruch* statt Gegenstemmen (2 Energie) werden aus 34 Block 68, der Kanzelschlag kommt dann im nächsten Zug.

---

## 4. Aderlass (Blut, mit Glaube oder Eisen)

- **Kern:** Leben als Treibstoff. Opfer-Karten kosten Leben statt Energie, Opfer (BG) verdoppelt eine Karte, Klinge (BE) heilt zurück.
- **Stütze:** Bluteid (+2 Energie), Blutrosenkranz (`reaktion_heil`), Glas mit Blutegeln, Durch die Zähne (Lebensraub), Abbinden.
- **Höhepunkt:** Herz im Glas (`opfer_staerke`): Jedes gezahlte Leben gibt Stärke. Bei 14 Leben ein Zug mit 6 Karten, zwei Opfer-Verdopplungen und Wunde Hand für 34.
- **Schwäche:** Kleinvieh (viele kleine Treffer), Ereignisse, die Leben kosten, Dornen.

**Beispieldeck, Ende Akt IV (23 Karten, 9 mit Kosten 0, alle davon Opfer, dazu Rausch mit X):**

| Item (Stoff) | Stammkarte ×2 | Handgriffe | Stoff der Handgriffe |
|---|---|---|---|
| Ritualdolch (B) | Aderlass | Handschnitt | Blut |
| Kultistenrobe (B) | Blutzeichen | Bluteid | Blut |
| Blutrosenkranz (B+G, selten) | Blutgebet | Wunde Hand, Letzter Tropfen | Blut + Glaube (Opfer in jeder Karte) |
| Herz im Glas (B, Reliquie) | Herzschlag | Aufschneiden, Rausch | Blut |
| Enterbeil (E) | Entern | Durch die Zähne | Eisen → Klinge nach Blut |
| Trauerschleier (G) | Trauern | Abbinden | Glaube |
| Offiziersmantel (E) | Kommando | Blutzoll | Eisen |

**Ein typischer Zug** (14 von 56 Leben, 3 Energie, Stärke 0):

1. *Aufschneiden* (Herz, B, Opfer 2): ziehe 2. Leben 12, Stärke 1.
2. *Bluteid* (Robe, B, Opfer 3): +2 Energie (5). Leben 9, Stärke 2. **Verstärkt** (B→B).
3. *Blutgebet* (Rosenkranz, B+G, 2): **Verstärkt** (B→B) ×1,5 und **Opfer** (B+G in der Karte): 4 Leben (Leben 5, Stärke 3), die Karte wirkt doppelt: zusammen etwa 21 Schaden und 12 Leben. Rosenkranz: +1 Leben je Reaktion. Leben etwa 19, Energie 3.
4. *Wunde Hand* (Rosenkranz, B+G, 1): **Opfer** wieder (Leben 15, Stärke 4), je 4 + 8 (41 fehlende Leben) + 4 Stärke, ×1,5 Verstärkt, doppelt: etwa 48 Schaden. Energie 2.
5. *Entern* (Enterbeil, E, 1): 2 × (4 + 4) = 16. **Klinge** (G/B→E): +4 Leben. Energie 1.
6. *Durch die Zähne* (Enterbeil, E, 1): **Verstärkt** (E→E): 13 Schaden, heilt 6.

Sechs Karten, etwa 100 Schaden, und das Leben endet bei etwa 30, also höher als am Anfang. Fehlt die Heilung (Klinge, Rosenkranz), ist derselbe Zug tödlich: Das ist der Reiz.

---

## 5. Kettenwerk (viele Stoffe im Wechsel)

- **Kern:** viele Reaktionen pro Zug. Funke macht Karten umsonst, Kette zahlt die Länge aus, Gegenlauf reicht Stoffe weiter.
- **Stütze:** Tarotkarten und Hexenflasche (Funke), Kompass (erste Karte 0), Die Knotenschnur (Kette startet bei 1), Offenes Uhrwerk (`reaktion_schaden`).
- **Höhepunkt:** Das Gezeitenrad (`hoch_zweimal`): zwei Hochreaktionen in einem Zug, dazu Läutwerk mit Kette 3 an allen.
- **Schwäche:** Abschrift und Verstopfen (Kloster), Einfrieren, Gegner mit wechselnder Schwachstelle stören wenig, aber Gegner mit viel Block.

**Beispieldeck, Ende Akt IV (22 Karten, 7 mit Kosten 0, 9 mit Funke):**

| Item (Stoff) | Stammkarte ×2 | Handgriffe | Stoff der Handgriffe |
|---|---|---|---|
| Tarotkarten (L) | Legen (Funke) | Umschlagen | Licht |
| Hexenflasche (S+B, selten) | Versiegeln (Funke) | Fortsetzen, Takt halten | Salz + Blut |
| Teerfackel (F+L, selten) | Teer und Flamme | Schwungrad, Antippen | Feuer + Licht (Fanal in jeder Karte) |
| Salzflinte (S+F, selten) | Salzladung | Einrasten, Umschlagen | Salz + Feuer (Knistern in jeder Karte) |
| Kompass, der nach unten zeigt (stofflos, selten) | – | Gegenlauf, Weiterreichen | stofflos: reicht nur weiter |
| Das Gezeitenrad (W, Reliquie) | – | Läutwerk, Wiederholung | Wasser |
| Priesterkragen (G) | Segnen | Durchatmen | Glaube |

**Ein typischer Zug** (3 Energie, Hand: 2 × Segnen, 2 × Salzladung, Legen):

1. *Segnen* (Kragen, G, 0): 4 Block, Eröffnung 3 Leben.
2. *Salzladung* (Salzflinte, S+F, 2): 4 an allen. **Reinigendes Feuer** (G davor, S+F jetzt): 12 an allen. **Bannkreis** (G→S): 8 Block. **Knistern** (S+F in der Karte): 3 an allen, Brand 1. Reaktionen 3, Energie 1.
3. *Legen* (Tarot, L, Funke → 0): ziehe 2 (*Schwungrad*, *Gegenlauf*), Geschwächt. **Fanal** (F→L): +1 Energie. Reaktionen 4, Energie 2.
4. *Schwungrad* (Teerfackel, F+L, Funke → 0): +1 Energie. **Verstärkt** (L→L), **Fanal**: +1 Energie. Reaktionen 6, Energie 4.
5. *Segnen* (Kragen, G, 0): 4 Block. **Segen** (L→G): +5 Leben. Reaktionen 7.
6. *Gegenlauf* (Kompass, stofflos, 1): reagiert selbst nicht, reicht aber Glaube an die nächste Karte weiter. Energie 3.
7. *Salzladung* (Salzflinte, S+F, 2): 4 an allen. **Reinigendes Feuer** zum **zweiten Mal** (Gezeitenrad), **Bannkreis**, **Knistern**. Reaktionen 10, Energie 1.

Sieben Karten, zehn Reaktionen, zwei Hochreaktionen: etwa 38 Schaden an **allen** Gegnern, 24 Block. Mit der letzten Energie: *Fortsetzen* träfe für 3 + 3 × 10 = 33, ×1,5 durch Verstärkt (S→S).

---

## 6. Hagel (Eisen, Mehrfachtreffer)

- **Kern:** Stärke und Verwundbar vorbereiten, dann Karten mit vielen Treffern. Gleicher Stoff hintereinander (Verstärkt ×1,5) ist hier die Hauptreaktion.
- **Stütze:** Nachladen (behalten), Anschlagen und Zielen (Verwundbar), Ankerkette (`start_staerke`), Ring aus Sargnägeln, Scherenfernrohr (alle verwundbar zu Kampfbeginn).
- **Höhepunkt:** Patronengurt des Lotsen (`mehrfach_plus1`): Ankerkette mit Stärke 6 auf ein verwundbares Ziel trifft viermal für je 22.
- **Schwäche:** Dornen (Schaden je Treffer zurück), viel Block pro Treffer (Schützer), Gegner, die Stärke klauen.

**Beispieldeck, Ende Akt IV (23 Karten, 6 mit Kosten 0):**

| Item (Stoff) | Stammkarte ×2 | Handgriffe | Stoff der Handgriffe |
|---|---|---|---|
| Revolver (F) | Schuss | Zweimal | Feuer → Glühend vor Eisen |
| Ankerkette (E+W, selten) | Kette schwingen | Kurze Stöße, Salve | Eisen + Wasser |
| Enterbeil (E) | Entern | Anschlagen | Eisen |
| Patronengurt des Lotsen (E, Reliquie) | Gurt leeren | Nachladen, Trommelfeuer | Eisen |
| Fischmesser (E) | Stechen | Durchladen | Eisen |
| Arbeitshandschuhe (E) | Faust | Zielen | Eisen |
| Offiziersmantel (E) | Kommando | Abrollen | Eisen |

**Ein typischer Zug** (3 Energie, Stärke 2 aus *Nachladen* im letzten Zug):

1. *Entern* (Enterbeil, E, 1, Eröffnung: Verwundbar 2): 3 Treffer (Gurt) zu (4 + 2) × 1,5 = je 9, zusammen 27.
2. *Stechen* (Messer, E, 0): **Verstärkt** (E→E): 3 Treffer zu (2 + 2) × 1,5 × 1,5 = je 9, zusammen 27.
3. *Kette schwingen* (Ankerkette, E+W, 2): **Verstärkt**: 4 Treffer zu (4 + 2) × 1,5 × 1,5 = je 13, zusammen 54.

Drei Karten, gut 100 Schaden auf ein Ziel. Ein Gegner mit Dornen 2 gibt dafür 10 Schaden zurück.

---

## 7. Was der Build-Bot daraus lernt

- Er wählt Handgriffe seines Builds (Liste unten, vorne zuerst) und ritzt sie in ein Item mit einem der Build-Stoffe, bevorzugt so, dass eine Reaktion aus `stoffe` neu möglich wird.
- Er nimmt Items aus seiner Liste vor allem anderen, Reliquien seines Builds immer.
- Neutrale Reliquien (Energie, Hand, Kerbholz) nimmt jeder Bot, wenn keine Build-Reliquie im Angebot ist.

## 8. Umgebaute Stammkarten (alt → neu)

| Item | alt | neu | wozu |
|---|---|---|---|
| Schürhaken | 1: 6 Schaden | 1: 5 Schaden, Verwundbar 1 | Hagel, Glühend nach Feuer |
| Fischmesser | 0: 3 Schaden | 0: 2 × 2 Schaden | Mehrfachtreffer für Stärke |
| Harpune | 2: 12 Schaden | 2: 9 Schaden, Verwundbar 2 | vorbereiten statt nur Zahl |
| Bratpfanne | 1: 7 Block | 1: 6 Block, Geschwächt | |
| Familienbibel | 1: 5 Block, 1 Leben | 1: 6 Block, behalten | Bollwerk |
| Spitzhacke | 2: 13 Schaden | 2: 10 Schaden, Block zerbricht | gegen Schützer |
| Schaufel | 1: 4 Schaden, 3 Block | 1: 4 Schaden, 4 Block | |
| Ritualdolch | 1: 8 Schaden, 2 Leben | Opfer 2: 6 Schaden | Aderlass, Herz im Glas |
| Fackel | 1: 4 Schaden, Brand 1 | 1: 3 Schaden, Brand 2 | Glutnest |
| Flasche | 1: 6 Schaden | 1: 5 Schaden, Geschwächt | |
| Wollmantel | 1: 5 Block | 1: 4 Block, ziehe 1 | |
| Ölmantel | 1: 6 Block | 1: 5 Block, Eröffnung +4 Block | |
| Gummistiefel | 0: 3 Block | 0: 2 Block, ziehe 1 | Stoff Wasser im Umlauf |
| Schiebermütze | 1: 5 Schaden | 1: 5 Schaden, Eröffnung Geschwächt | |
| Arbeitshandschuhe | 0: 3 Schaden | 0: 3 Schaden, Eröffnung Stärke 1 | Hagel |
| Trauerschleier | 1: 4 Block, 2 Leben | 1: 4 Block, 3 Leben | |
| Kultistenrobe | 0: +1 Energie, 3 Leben | Opfer 2: +1 Energie | Aderlass |
| Trenchcoat | 0: ziehe 1 | 0: ziehe 1, Verwundbar 1 | |
| Rosenkranz | 1: 5 Leben | 1: 4 Leben, 3 Block | |
| Seltsame Muschel | 1: Gift 3 | 1: Gift 3, ziehe 1 | |
| Taschenuhr | 0: ziehe 2 | 0: ziehe 1, Eröffnung ziehe 1; jetzt selten mit `energie_bleibt` | |
| Schwarze Kerze | 1: Brand 3 | 0: Brand 2 | Glutnest-Starter |
| Silberkreuz | 1: 6 Schaden | 1: 5 Schaden, 3 Block | |
| Salzklinge | 1: 8 Schaden | 1: 6 Schaden, Verwundbar 1 | |
| Salzflinte | 2: 6 an allen (mit Aufpreis 3) | 1: 4 an allen (mit Aufpreis 2) | Knistern an allen |
| Enterbeil | 1: 7, Eröffnung +5 | 1: 2 × 4, Eröffnung Verwundbar 2 | Hagel |
| Sense | 2: 5 an allen, Gift 2 | 2: 4 an allen, Gift 3 | |
| Tarotkarten | 1: ziehe 2, Geschwächt | dazu Funke | Kettenwerk |
| Hexenflasche | 1: 6 Block, Geschwächt | dazu Funke, Eigenschaft `reaktion_schaden 1` | Kettenwerk |
| Spieluhr | 2: 8 Block, Geschwächt, verbraucht | 1: 7 Block, Geschwächt, verbraucht | |
| Kultmaske | 1: 8 Block | 0: 9 Block, **Zittern fest eingeritzt** | gut und schlecht |
| Gasmaske | „Durchatmen“ 1: 5 Block, ziehe 1 | „Durch den Filter“, gleiche Werte | Name frei für den Start-Handgriff |
| Laudanum | 1: 12 Leben, verbraucht | 0: 12 Leben, verbraucht, **Zittern fest eingeritzt** | gut und schlecht |
| Riechsalz | 0: ziehe 2, verbraucht | 0: ziehe 2, +1 Energie, verbraucht | |
| Tiefling-Schuppe | 0: 4 Block | 1, Funke: 5 Block | Kettenwerk |
| Taucherhelm | 1: 12 Block | 1: 10 Block, behalten; `start_block 6` | |

Unverändert (nur Seltenheit, Kerben, Preis, Flavor, teils Eigenschaft): Revolver, Sturmlaterne, Salzbeutel, Weihwasser, Teerfackel, Blutrosenkranz, Knochen, Bootshaken, Robbenfell, Hasenpfote, Priesterkragen, Stockdegen, Ankerkette, Leuchtpistole, Offiziersmantel, Kompass, Dynamit, Rum, Grubenlampe.

## 9. Bevorzugte IDs für den Build-Bot

Reihenfolge = Vorrang. `neutral` gilt für alle Bots als zweite Wahl.

```json
{
 "builds": {
  "glutnest": {
   "items": ["ofen", "zunderbuechse", "kohlenschaufel", "tartorch", "torch", "candle", "salt", "poker", "saltgun", "flaregun", "oilcoat"],
   "handgriffe": ["schueren", "ofentuer", "nachlegen", "funkenflug", "flaechenbrand", "glimmen", "zuendeln", "brandmal", "glut_halten", "qualm", "atemholen", "standhalten"],
   "stoffe": ["F", "S", "E", "L"]
  },
  "brackwasser": {
   "items": ["moorglas", "ehering", "scythe", "shell", "gasmask", "dagger", "boots", "oilcoat", "lantern", "harpoon", "sealskin", "deepscale"],
   "handgriffe": ["ansteckung", "faulen_lassen", "hinabziehen", "sickern", "bodensatz", "spucken", "lauern", "umruehren", "schlick", "aufschneiden", "ausweichen"],
   "stoffe": ["V", "W", "B", "L"]
  },
  "bollwerk": {
   "items": ["taufstein", "kloeppel", "holywater", "bible", "collar", "salt", "cross", "divinghelm", "sealskin", "veil", "rosary", "witchbottle"],
   "handgriffe": ["kanzelschlag", "bannspruch", "standhalten", "schwelle", "wache", "kreidekreis", "gegenstemmen", "kniefall", "schulterstoss", "weihen", "abwarten"],
   "stoffe": ["G", "S", "W"]
  },
  "aderlass": {
   "items": ["herzglas", "egelglas", "bloodrosary", "dagger", "robe", "boardaxe", "veil", "officercoat", "cultmask", "rosary", "silverknife"],
   "handgriffe": ["bluteid", "wunde_hand", "aufschneiden", "rausch", "letzter_tropfen", "handschnitt", "durch_die_zaehne", "blutzoll", "abbinden", "atemholen"],
   "stoffe": ["B", "G", "E"]
  },
  "kettenwerk": {
   "items": ["gezeitenrad", "uhrwerk", "knotenschnur", "witchbottle", "tarot", "compass", "tartorch", "saltgun", "flaregun", "collar", "salt", "deepscale", "watch"],
   "handgriffe": ["gegenlauf", "fortsetzen", "laeutwerk", "wiederholung", "umschlagen", "schwungrad", "weiterreichen", "takt_halten", "einrasten", "antippen", "durchatmen"],
   "stoffe": ["L", "S", "B", "F", "G", "W"]
  },
  "hagel": {
   "items": ["patronengurt", "sargnagelring", "scherenfernrohr", "anchorchain", "revolver", "boardaxe", "knife", "gloves", "officercoat", "silverknife", "poker", "harpoon"],
   "handgriffe": ["trommelfeuer", "nachladen", "salve", "anschlagen", "kurze_stoesse", "zweimal", "zielen", "durchladen", "abrollen", "rundumschlag"],
   "stoffe": ["E", "F"]
  },
  "neutral": {
   "items": ["uhr_ohne_zeiger", "ewiges_licht", "dreiglas", "kerbholz", "watch", "compass", "harefoot", "smellingsalts", "rum"],
   "handgriffe": ["atemholen", "umsehen", "nachsetzen", "aufhebeln", "rundumschlag", "finte", "sich_sammeln", "durchatmen", "kratzen"],
   "stoffe": []
  }
 }
}
```
