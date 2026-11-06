# Die Waage am Grund (`waage`) · Akt V · Zugabe

Biom-Paket nach [paket-format.md](../paket-format.md), Zugabe aus [03-meilensteine.md](../03-meilensteine.md). Zeitschicht Akt V: **außerhalb der Zeit**, aber in der Form eines Ortes, den man kennt (Zollamt um 1925). Bilder: [bilder/Zugabe/waage/](../bilder/Zugabe/waage/). Alles per Skript gezeichnet (Weg A, `quelle: skript`), kein Bild-Generator in der Sitzung.

| Teil | Datei |
|---|---|
| Daten | `prototype/data/biome/waage.json` |
| Hintergrund | `prototype/js/scenes/world/waage.js` |
| Zonenpalette | `tools/sprites/zonen/waage.json` |
| Gegner | `tools/sprites/gegner/schlagbaum.js`, `schreiber.js`, `tarierte.js`, `schlange.js`, Elite `oberzoellner.js` |
| Ereignisbilder | `tools/ereignisse/bilder/waage.js` |
| Item-Icons | `tools/icons/items/zollplombe.js`, `wartemarke.js`, `eichgewicht.js`, `zuenglein.js` |

**Akt V ist anders gebaut:** Ebenen nur `vorraum`, `rast`, `finale`. Das Biom liefert darum die Vorraum-Elite **Der Oberzöllner** (`biom.vorraum_elite`), `biom.waechter: "ruft"` (das gemeinsame Finale) und eine **eigene Finale-Szene**, dazu die Ankunft danach (`World._biome.waage.ankunft`) und `ankunft_bild`. Die vier normalen Gegner kommen im echten Lauf über den Kniff des Oberzöllners in den Kampf (er ruft seine Beamten), dazu über Ereignisse und Dev-Sprünge.

## Der Ort

Am Grund vor der Pforte steht ein Zollhaus. Eine gekachelte Abfertigungshalle wie am Hafen von 1925: Schachbrettboden, Schalter mit Messinggittern, Wartebänke, Absperrpfosten mit roter Kordel, die Registratur mit Schubladen bis unter die Decke. Nur gibt es keine Decke: Die Wände hören abgebrochen auf, darüber steht das Meer, und das Licht fällt in schrägen Bahnen hindurch. Die Ertrunkenen warten mit Nummern in der Hand. Wer hier ankommt, wird gegen seine Habe gewogen.

- **Wahrzeichen:** eine Balkenwaage, groß wie ein Schiff. Die Säule steht wie ein Mast in der Halle, der Balken ist ein Fachwerk aus Messing, an seinen Enden hängen Schalen so groß wie Ruderboote. In der rechten liegt, was die Ertrunkenen hergeben mussten: Mäntel, Koffer, Ringe, Briefe mit Siegel.
- **Falsches Detail:** Die Waage neigt sich immer zu dir. Die leere Schale hängt auf deiner Seite (links, wo die Figur steht) tiefer als die volle. In jeder Szene, nie erklärt. Mit `fremdheit` neigt sie sich weiter. Erst nach dem Finale (Ankunft) steht sie gerade, beide Schalen leer.
- **Palette:** Messing, Siegellackrot, Aktenpapier im Wasserlicht. Sprite-Zone: Körper warm-oliv nahe Schwarz (`#060504 … #2d2516`), Randlicht Messing/Papier (`#8a7434`/`#e6dcbc`), Augen Siegellackrot (`#ec4a34`, Kern `#fff2e4`), Zusatzfarben Messing, Siegel, Papier. Szenen: Kacheln in Papiertönen (`KACHEL`, 12 Stufen), Holz, Messing (9 Stufen), das Meer als dunkles Oliv mit blassem Lichtnetz.
- **Abgrenzung im Akt:** Die Pforte ist ein gespiegelter Hafen, türkis mit Magenta, Laternen, die schwarz brennen, Wasser als Wand. Das Ufer unten ist ein Strand, Sand und Seegrün, das Meer als Decke aus Wellen. Die Waage ist **ein Innenraum**: rechte Winkel, Fluchtlinien, Kachelraster, Messing und Rot, warmes Lampenlicht hinter Schaltergittern, das Meer nur als Deckel. Der Boss (türkis) steht im Finale vor dem papierhellen Skalenbogen und hebt sich farblich ab.
- **Licht:** Gegenlicht oben rechts ist das Wasserlicht, das durch das Meer in Bahnen fällt (blasses Gelbgrün). Dazu warme Lampen hinter den Schaltern und über den Asservaten, Kanonenofen bei der Rast.
- **Krämer:** Der Asservatenverwalter (`art: tausch`), hinter dem Gitter der Asservatenkammer zwischen Koffern mit Zollvermerk. „Hier zahlt man nicht, sagt er, hier wird gewogen.“ Er legt dein Stück in die eine Schale und seins in die andere; seine ist immer leichter. Der Tausch passt, weil hier niemand Geld nimmt, nur Habe. (Akt V hat keinen Krämer-Knoten; die Daten sind vollständig für den Dev-Sprung und spätere Ebenen.)

## Hintergrund: Kompositionen

Grundform **die Halle**: Fluchtlinien eines Kachelbodens im Schachbrett, abgebrochene Kachelwände, darüber das Meer. Nebel praktisch keiner (nur das Meer als dunkle Decke, unter einem Drittel der Fläche hinter den Figuren). Aufbau je Szene 250–720 ms in headless Chromium.

### Variante 0: Die Halle
- **Horizont** y 142. Abfertigungshalle, Kachelwände links und rechts in Flucht, hinten die Rückwand mit drei beleuchteten Schaltern. Die Wände hören in einer gebrochenen Kante auf, darüber das Meer mit Lichtnetz.
- **Wahrzeichen:** die Waage links der Mitte, der Fachwerkbalken spannt über die halbe Breite. Links die leere Schale tief über dem Boden, rechts oben die volle mit Mänteln, Koffern, einem Brief mit Siegel. Die Säule steht absichtlich nicht in der Mitte, damit die Elite davor frei steht.
- **Maßstab:** Wartebänke mit Ertrunkenen (Hut, Kopftuch, eine helle Wartemarke in der Hand), Absperrpfosten mit roter Kordel vorn als Rahmen, eine Hängelampe.
- **Hinter den Gegnern:** Rückwand und Fliesen in mittleren Papiertönen, die dunklen Figuren stehen davor.

### Variante 1: Die Schalter
- **Horizont** y 146. Rechts läuft die Schalterreihe in die Tiefe, sechs Schalter mit Messinggittern und Lampenlicht dahinter (mit `fremdheit` gehen einige aus). Links steigt die Registratur bis ins Wasser, Schubladen in hellen Aktenfarben (damit die Warteschlange davor nicht verschwindet), eine Leiter, aus einer Schublade steigen Papierbahnen. Hinten am Ende der Halle die Waage, klein, geneigt.

### Variante 2: Unter der Schale
- **Horizont** y 140. Die leere Schale hängt riesig über dir: ihre genietete Unterseite füllt den Himmel links, drei Ketten laufen ins Wasser. Aus ihr tropft es, obwohl sie leer ist. Rechts der Fuß der Säule auf dem Messingsockel mit Ritzband, daneben die Asservaten (Koffer in Lagen, Mantelballen). Links eine Wartebank.

### Finale-Szene (Wächter-Art, Das, was ruft): Die Zunge
- **Horizont** y 150. Die Mitte der Waage. **Ruhige Zone hinter dem Boss:** der Skalenbogen, ein Halbkreis aus Aktenpapier im Wasserlicht mit Teilstrichen und Messingrahmen, genau hinter der Mitte. Der türkise Boss (alle drei Phasen) steht dunkel und farbfremd davor. Die rote Null-Marke oben; die Zunge zeigt schräg nach links, zu dir.
- Darüber spannt der Balken über die ganze Breite, links die leere Schale tief, rechts hoch die volle. Absperrpfosten rahmen vorn.
- **Ankunft danach** (`World._biome.waage.ankunft`): dieselbe Szene, die Waage gerade, beide Schalen leer, die Zunge senkrecht.

### Die anderen Arten
- **weg:** Variante nach Seed. **rast:** die Halle, ein Kanonenofen mit glühendem Türchen und Rohr nach oben. **werkstatt:** die Schalter, Werkbank (Eichtisch). **kraemer:** unter der Schale, die Asservaten hinter einem Gitter mit Hängelampe. **ereignis / fund:** Variante nach Seed, Fundkiste. **wandbild:** Variante nach Seed, Relief im Biomstil (fünf Figuren zu einem Großen, Kacheltöne). **uebergang:** die Halle, eine breite Amtstreppe führt links von oben herab.

## Gegner

Arbeitsweise: je Gegner zwei Silhouetten-Proben als schwarze Fläche (die verworfenen stehen als `proben` in den Skripten und in [silhouetten-proben.png](../bilder/Zugabe/waage/silhouetten-proben.png)), gegen alle 201 vorhandenen Sprites geprüft ([silhouetten-gegen-alle.png](../bilder/Zugabe/waage/silhouetten-gegen-alle.png), meine rot), dann Licht, Randlicht, Innenkanten-Randlicht, Fase, Dither, Binnenform (Falten mit Tal und Grat, Knöpfe, Riemen, Nähte), mindestens ein inneres Licht je Figur, dann Pixel nachgearbeitet. Hilfen aus `tools/sprites/gegner/hilfe/kanten.js` (Lichtkante je Teil; nur auf Pixel des Teils, damit nichts über davorliegende Teile malt).

### Der Schlagbaum (`schlagbaum`)
- **Motiv:** Die Grenze, die keinen Weg mehr hat.
- **Wer er war:** ein Grenzaufseher vom Zollamt, Pelerine und Schirmmütze (b: Mantel mit Koppel und Kreuzriemen, Tschako).
- **Was falsch ist:** Er hat keinen rechten Arm mehr; aus der Schulter wächst der Schlagbaum, rot und dunkel geringelt, mit Signalscheibe und roter Laterne. Seine Augen sind mit Siegellack verschlossen, darunter glimmt es.
- **Silhouette:** ein Mann in Pelerine, aus dessen Schulter eine lange Stange schräg nach oben steht, vorn eine runde Scheibe.
- **Proben:** Baum senkrecht (las sich als Fahnenträger aus dem Eis); Baum waagerecht in Hüfthöhe (Lanze, die Figur verschwand). Genommen: schräg erhoben.
- **Animation:** Leerlauf: Laterne pendelt, Atem. Angriff: Er hebt den Baum steil hinter sich und schlägt ihn waagerecht herunter. Tod: Der Baum sinkt, die Laterne erlischt.
- **Kniff:** `takt 5`: Fällt die Schranke, steht jeder dahinter sicher (alle Gegner +5 Block); geht sie hoch, steht er offen (verwundbar). Fordert Zielwahl im Takt.
- **Muster:** Schranke (8), Zweimal (2 × 4), Block 6. **Schwachstelle Blut:** Für Verwundete wird der Baum gehoben, so war es Vorschrift. **Stimme:** `grabwaechter`.

### Der Schreiber (`schreiber`)
- **Motiv:** Inventur: Jemand schreibt auf, was du bei dir trägst.
- **Wer er war:** ein Zollschreiber auf dem hohen Kontorbock, Ärmelschoner, Augenschirm, Feder hinter dem Ohr.
- **Was falsch ist:** Er schreibt mit dem Finger, die Tinte ist rot. Die Liste wird nicht kürzer: Sie wächst aus dem Buch und steigt im Wasser nach oben, Bahn um Bahn, wie Tang.
- **Silhouette:** ein Buckel auf einem Stelzenbock über einem Stehpult, davor steigende Papierbahnen.
- **Proben:** stehend am Pult ohne Bock (wie der Leser im Kloster); Papier fällt nach unten (Bart oder Schleier). Genommen: Bock, Papier steigt.
- **Varianten:** a Lampe auf dem Pult, drei Bahnen; b Hängelampe, vier schmalere Bahnen, Aktenstapel unter dem Bock.
- **Animation:** Leerlauf: Kopf nickt, Papier weht. Angriff: Er richtet sich auf, holt mit dem Arm aus und sticht mit dem Finger über das Pult.
- **Kniff:** `abschrift 1` „Aufstellung“: Was er aufschreibt, landet als unspielbare Karte in deinem Stapel. (Erst `verstopfen`; geändert, weil die Funkstation in Akt IV schon `verstopfen` hat.)
- **Muster:** Notieren (6), 2 × 3, Block 6. **Schwachstelle Feuer:** Papier. **Stimme:** `kultist`. **Beute:** Zollplombe.

### Die Tarierte (`tarierte`)
- **Motiv:** Sich selbst abwiegen, bis nichts übrig ist.
- **Wer sie war:** eine Frau im Sonntagskleid aus der Wartehalle.
- **Was falsch ist:** Sie ist mit der Personenwaage verwachsen (zehn Pfennig, Zifferblatt in Kopfhöhe): Sie steht auf der Platte, die Säule wächst ihr aus dem Rücken, und wo ihr Kopf war, sitzt das Zifferblatt. Das Haar hängt noch vom Rand. Der Zeiger steht unter Null.
- **Silhouette:** ein schlankes Kleid auf einer flachen Platte, oben eine runde Scheibe statt des Kopfes.
- **Proben:** sitzend in einer hängenden Waagschale (wie die Gezogene, etwas hängt von oben); mit Kopf, Waage daneben (Frau mit Möbel). Genommen: Zifferblatt statt Kopf.
- **Varianten:** a Haar hängt über den Rücken, Gewichtsstück in der Hand; b größeres Blatt, Haar steigt im Wasser, Schürze, Münzkasten.
- **Animation:** Leerlauf: Zeiger zittert, Blatt nickt. Angriff: Sie beugt das Blatt vor wie einen Kopfstoß, der Zeiger schlägt aus.
- **Kniff:** `heiler 6`: Sie tariert: Wer zu leicht geworden ist, dem legt sie zu. Fordert Reihenfolge (sie zuerst). (Überschneidung: Das Rauschen der Funkstation ist ebenfalls Heiler; nichts anderes passt so genau.)
- **Muster:** 7, Block 7, 3 × 3. **Schwachstelle Salz:** Ein Körnchen, und sie ist nicht mehr bei Null. **Stimme:** `netzflickerin`. **Beute:** Wartemarke.

### Die Warteschlange (`schlange`)
- **Motiv:** Anstehen, bis man zusammenwächst.
- **Wer sie waren:** Ertrunkene vor dem Schalter, in Mänteln, mit Hut, Kopftuch, Schirmmütze; in b ein Kind in der Mitte, hinten ein Schirm.
- **Was falsch ist:** Jeder hat die Hand auf der Schulter des Vorderen, und an den Schultern sind sie zusammengewachsen. Der Vorderste hält die Eins und ist noch nicht dran.
- **Silhouette:** eine schräge Reihe gebeugter Rücken, vorn am tiefsten, hinten aufrecht, wie eine Treppe aus Menschen.
- **Proben:** alle gleich hoch (ein Zaun aus Pfählen); ein einzelner Wartender (wie der Liegende im Kurhaus). Genommen: schräge Reihe.
- **Animation:** Leerlauf: Die Köpfe nicken nacheinander. Angriff: Die Reihe staucht sich, dann stößt der Vorderste vor.
- **Kniff:** `kleinvieh` (über das Muster): Jeder in der Reihe stößt einmal. Fordert Block gegen viele kleine Treffer.
- **Muster:** 4 × 2, 3 × 3, Block 8. **Schwachstelle Licht:** Wenn über dem Schalter das Licht angeht, drehen sich alle um. **Stimme:** `ertrunkener`.

### Elite im Vorraum: Der Oberzöllner (`oberzoellner`, 128 × 160)
- **Motiv:** Gewogen werden.
- **Wer er war:** der Vorsteher des Zollhauses, Uniformmantel mit zwei Reihen Messingknöpfen, Schulterstücke, hohe Dienstmütze, das Zollbuch unter dem Arm.
- **Was falsch ist:** Auf seinem Kopf sitzt die Waage, die Zunge steigt ihm aus dem Scheitel, an jedem Ende des Balkens eine Schale an drei Ketten. Rechts liegt die Habe (Ringe, ein Brief mit Siegel, ein Mantelärmel über dem Rand), links ist die Schale leer, auf deiner Seite, und sie hängt tiefer. Wo die Augen wären, sitzt ein Siegel aus rotem Lack, darunter glimmt es.
- **Silhouette:** ein breiter Mantel, darüber ein großes T aus Balken und zwei hängenden Schalen.
- **Proben:** Schalen an den ausgestreckten Armen ohne Balken (`probe_arme`, Krämer mit zwei Eimern); erste gebaute Fassung mit dem Balken als Joch über den Schultern (im Silhouetten-Vergleich zu nah an einer vorhandenen Figur mit Tragjoch und zwei Eimern). Genommen: Waage auf dem Kopf.
- **Animation:** Leerlauf: Schalen pendeln. Angriff: Er kippt die Waage erst weg von dir, dann schlägt die leere Schale zu dir herunter. Tod: Die Waage kippt, er zerfällt.
- **Kampf (104 Leben, ×1,35):** Kniff `teurer 1` (Zoll: Was du in der Hand hältst, wird gewogen; eine Handkarte kostet diesen Zug 1 mehr). **Besonderheit:** `kniffe: ruf` mit Liste: Alle drei Züge ruft er einen seiner Beamten an den Schalter, der Reihe nach Schreiber, Schlagbaum, Tarierte, Warteschlange. So treten die normalen Gegner im Lauf auf. Muster: Zuschlag (12), Block 12, Strafgebühr (3 × 5), Urteil (15).
- **Schwachstelle Eisen:** Gegen ein geeichtes Gewicht kann er nicht lügen. **Stimme:** `schlundtraeger`. **Beute:** Reliquie *Das Zünglein*.

## Items

| ID | Name | Bereich, Stoff | Seltenheit | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|---|
| `zollplombe` | Die Zollplombe | Talisman, Eisen | gewöhnlich, 1 Kerbe, 22 | – | Verplomben (1: Block 6, Geschwächt) | Ein Klümpchen Blei an einem Draht, mit der Zange zugekniffen. Was so verschlossen ist, wird erst drüben geöffnet. Das Prägebild ist ein Auge. |
| `wartemarke` | Wartemarke Nr. 1 | Talisman, Glaube | gewöhnlich, 1 Kerbe, 20 | – | Aufgerufen (0: ziehe 2, verbraucht) | Graue Pappe, die Eins mit der Hand nachgezogen. Sie ist seit 1925 nicht aufgerufen worden. Man wird es tun, sobald du sie abgibst. |
| `eichgewicht` | Das Eichgewicht | Waffe, Eisen | selten, 2 Kerben, 50 | `ballast_werfen` (5 Schaden am Ziel), 1 „Gewicht“ zu Kampfbeginn | Nachwiegen (1: 7 Schaden, mische 1 „Gewicht“ ein) | Fünf Kilogramm, geeicht 1925. Auf der Waage am Grund wiegt es nichts. Überall sonst mehr, als es soll. |
| `zuenglein` | Das Zünglein | Talisman, Licht | **Reliquie** (Elite), 150 | `kampfstart_fx`: alle Gegner 2 Züge verwundbar, 2 „Gewicht“ (Ballast) im Stapel | Ausschlagen (1: 2 × 4, eine unspielbare Karte über Bord, ziehe 1) | Die Zunge der großen Waage, eine Spanne lang. Sie zeigt auf dich, gleich wie man sie hält. |

Das Zünglein öffnet den Ballast-Build von der Licht-Seite (Verwundbar zu Beginn, Ballast als Treibstoff, Karte wirft ihn über Bord). Fundpool: die drei gewöhnlichen/seltenen plus Kompass, Taschenuhr, Sturmlaterne, Tarotkarten, Laudanum, Riechsalz, Offiziersmantel, Bibel, Taucherhelm. Icons: eigene Skripte (48 × 48), `node tools/icons/pruefen.js` 0 Verstöße.

## Ereignisse (6, alle aus diesem Ort)

| ID | Szene | Folgen | Bezug auf Früheres |
|---|---|---|---|
| `waage_wartemarke` | Der Automat gibt dir die Eins, die anderen warten mit höheren Nummern | Wartemarke; Heilung gegen Gold; Handgriff gegen Leben | – |
| `waage_schale` | Die leere Schale liegt auf den Fliesen, es muss etwas hinein | Item tauschen; Schleifen gegen Gold; Kerbe gegen Leben | – |
| `waage_registratur` | Eine Schublade mit deinem Namen, die Karteikarte nennt etwas, das du noch nicht hast | seltenes Item gegen Leben; Karte streichen; Handgriff + Kerbe | `event_gesehen: kloster_abschriften` (Akt II) |
| `waage_asservaten` | Was die Ertrunkenen hergeben mussten, nach Größe sortiert | max. Leben + Kampf (Warteschlange); Gold + Kampf (Schreiber, Tarierte); seltenes Item + Heilung | `event_gesehen: nachtzug_koffer` (Akt I) |
| `waage_briefe` | Hunderte versiegelte Briefe, einer an dich, das Siegel noch weich | seltener Handgriff; Kerbe; Reliquie gegen max. Leben | `job: wahrsagerin` |
| `waage_schalter` | Durch den Schlitz passt genau ein Arm; zu verzollen ist „alles“ | Schleifen gegen Leben; Kerbe + Heilung gegen Gold; **Energie auf Dauer** gegen −14 max. Leben | `event_gesehen: fabrik_stempeluhr` (Akt I) |

Kein Stummfilm (den hat Akt V schon im Ufer). Ereignisbilder: [kontakt-zugabe2-waage.png](../bilder/Zugabe/ereignisse/kontakt-zugabe2-waage.png). Hinweis: Akt V hat keinen Ereignis-Knoten; die Ereignisse erscheinen nur über den Dev-Sprung, bis der Kern das ändert (Vorschlag 1).

## Musik

f-Moll, Grundton 41 (Pforte 51, Ufer 44). Ort: eine große, gekachelte Halle unter Wasser (`gaenge`, leise `meer`, `stollen`); Rhythmus `holz` (Stempel auf Holz, im Takt der Abfertigung), Einzelklänge aus `kapelle` (die Glocke am Schalter).

## Prüfung

- `node tools/sprites/pruefen.js schlagbaum_a schlagbaum_b schreiber_a schreiber_b tarierte_a tarierte_b schlange_a schlange_b oberzoellner`: **9 Sprites, 0 Verstöße**.
- `node tools/icons/pruefen.js`: 238 Bilder, 0 Verstöße.
- Kontaktbogen neben den Favoriten und Silhouetten: [waage-bogen.png](../bilder/Zugabe/waage/waage-bogen.png) (zeigt als Wächter das gemeinsame Finale `ruft`; die Elite steht in [animationen-elite.png](../bilder/Zugabe/waage/animationen-elite.png)); alle Animationen: [animationen-1.png](../bilder/Zugabe/waage/animationen-1.png), [animationen-2.png](../bilder/Zugabe/waage/animationen-2.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/Zugabe/waage/hintergrund-varianten.png) (V0, V1, V2 mit Gegnern, V0 mit Elite, Finale mit Boss), [hintergrund-arten.png](../bilder/Zugabe/waage/hintergrund-arten.png), [hintergrund-fremdheit.png](../bilder/Zugabe/waage/hintergrund-fremdheit.png).
- Im Spiel (`newRun('fischer',3,{dev:true,route:['hafen','kapelle','salz','eis','waage']})`, `Dev.springe(…,4)`): [im-spiel-kampf.png](../bilder/Zugabe/waage/im-spiel-kampf.png), [im-spiel-kampf-2.png](../bilder/Zugabe/waage/im-spiel-kampf-2.png), [im-spiel-kampf-3.png](../bilder/Zugabe/waage/im-spiel-kampf-3.png), [im-spiel-elite.png](../bilder/Zugabe/waage/im-spiel-elite.png), [im-spiel-elite-ruft.png](../bilder/Zugabe/waage/im-spiel-elite-ruft.png), [im-spiel-finale.png](../bilder/Zugabe/waage/im-spiel-finale.png), [im-spiel-finale-phase3.png](../bilder/Zugabe/waage/im-spiel-finale-phase3.png), [im-spiel-weg-vorraum.png](../bilder/Zugabe/waage/im-spiel-weg-vorraum.png), [im-spiel-rast.png](../bilder/Zugabe/waage/im-spiel-rast.png). **Keine Konsolenfehler.**
- `node tools/ereignisse/bauen.js waage`: 6 Bilder, 0 Fehler; `node tools/ereignisse-fotos.js`: 151 von 151 ohne Fehler.
- `node tools/test-ereignisse.js` und `node tools/test-run.js`: „Alles gut.“

### Abstimmung (`node tools/biom-test.js waage 20`, spielt die Akte davor wirklich)
Erste Werte (Ruf alle 4 Züge, Schreiber `verstopfen`): 15/19 und 14/20 (74 %). Mit Ruf alle 3 Züge und Schreiber `abschrift`: **Seeds 1–20: 15/19 (79 %), Seeds 21–40: 12/20 (60 %), zusammen 27/39 = 69 %**, 0 Fehler. Zum Vergleich mit denselben Seeds: Ufer 14/19, Pforte 16/19. Die Niederlagen kommen aus dem Finale nach einem teuren Elitekampf; der Oberzöllner ruft in den meisten Kämpfen einen bis zwei Beamte (meist Schreiber, Schlagbaum).

## Vorschläge an den Kern

1. **Ereignis im Vorraum von Akt V:** Akt V hat keine Ereignis-, Krämer- oder Werkstatt-Knoten; die Ereignisse und der Krämer der Akt-V-Biome erscheinen nur im Dev-Sprung. Vorschlag: Ebene `rast` in Akt V als `fest_wahl: ["rast", "ereignis"]`.
2. **`teurer` sichtbar an der Karte:** Der Zoll des Oberzöllners zeigt nur eine Meldung; ein kleines Siegel auf der verteuerten Karte würde den Kniff lesbar machen.
3. **Elite im Kontaktbogen:** `tools/biom-bogen.js` zeigt `biom.vorraum_elite` nicht; für Akt-V-Biome sollte die Elite neben dem gemeinsamen Boss stehen.
4. **Szene hört auf `boss_phase`:** Im Finale könnte sich die Waage mit jeder Phase weiter neigen (die Szene wird heute nur einmal je Knoten gebaut).

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt. Jedes Bild selbst angesehen (Vorschauen ×2–×4, Kontaktbogen, Szenen ×1–×2, Bildschirmfotos).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Schlagbaum | 5 | 4 | 4 | 4 | 5 | 4 | **4** | Die schräge rot-geringelte Stange mit Scheibe und roter Laterne gibt es sonst nirgends; die versiegelten Augen sieht man nur von nah. Zweilagige Pelerine mit Saumschatten und Graten, b mit Kreuzriemen. Der Rock bleibt eine große dunkle Fläche, die Faltenlinien sind etwas gerade. |
| Schreiber | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Buckel auf dem Stelzenbock, Pult, steigendes Papier: liest sich sofort als Schreibstube, das Papier ist die hellste Fläche und zieht den Blick. Die Bahnen erinnern im Schwarz ein wenig an Finger; der Rücken ist dunkel und hat nur wenige Nähte. Erst als kastenförmiger Rücken mit dünnen Ästen (verworfen), dann neu. |
| Tarierte | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Zifferblatt statt Kopf auf Kleid und Plattform ist eindeutig, der Zeiger unter Null ist das Auge; Falten laufen von der Taille auseinander. Variante a war zuerst unter dem Haar verdeckt (Haar jetzt hinter dem Blatt). Der Angriff ist eher ein Nicken als ein Schlag. |
| Warteschlange | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Die Treppe aus gebeugten Rücken ist eine neue Silhouette; Hüte, Kopftuch, die helle Eins vorn. Die Mäntel verschmelzen in der Mitte zu einer dunklen Masse; im Spiel vor der hellen Registratur (V1) und den Fliesen (V0) gut lesbar, vorher vor dunklen Regalen verschwunden (Regale umgefärbt). |
| Der Oberzöllner (Elite) | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Die Waage auf dem Kopf mit der tieferen leeren Schale trägt das falsche Detail des Bioms in die Figur; Siegel als Auge, Knopfreihen, Falten, Taschen, Zollbuch. Der Mantel ist trotz Binnenform die größte dunkle Fläche des Bioms. Vorher Joch auf den Schultern (zu nah an einem vorhandenen Träger), dann umgebaut. |
| Elite im Spiel-Foto | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Steht vor Rückwand und Fliesen, die Säule der großen Waage wurde nach links versetzt, damit sie nicht hinter ihm steht. Zwei Waagen im Bild (seine und die große) sind gewollt, verlangen aber einen Blick. |
| Hintergrund V0 Die Halle | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Waage mit tiefer leerer Schale, Bänke, Pfosten, Schalter: man versteht den Ort. Die linke Schale wird am Bildrand angeschnitten, der Boden vorn ist weit und gleichförmig (dort liegt die UI). |
| Hintergrund V1 Die Schalter | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Leuchtende Schalterreihe in Flucht und die helle Registratur geben Tiefe und Kontrast; die Waage ist hier nur klein am Ende. |
| Hintergrund V2 Unter der Schale | 5 | 4 | 4 | 5 | 5 | 4 | **4** | Die riesige Unterseite der Schale über dir ist das stärkste Bild des Bioms; die Asservaten rechts sind noch blockig. |
| Finale-Szene (mit Boss) | 5 | 5 | 4 | 5 | 5 | 5 | **4** | Der papierhelle Skalenbogen ist eine ruhige Zone genau hinter dem türkisen Boss, alle drei Phasen stehen klar davor; Balken und Schalen rahmen, die leere hängt tief. Der Boden zeigt in der Ferne noch leichtes Flimmern des Schachbretts. |
| **Hintergrund gesamt** | | | | | | | **4** | |
| Ereignisbilder (6) | 4 | 4 | 4 | 4 | 5 | – | **4** | Schale, Briefe, Schalter, Wartemarke klar mit einer hellen Stelle; Registratur ist ein dichtes Raster, Asservaten erst nach zweitem Licht lesbar. |
| Item-Icons (4) | 4 | 4 | 4 | 4 | 4 | – | **4** | Wartemarke und Eichgewicht eindeutig; die Plombe liest sich auch als Vorhängeschloss, das Zünglein erst mit der Skala als Zeiger (vorher wie ein Dolch, neu gemacht). |

Nichts unter 4. Überarbeitet unterwegs: Schlagbaum (Baum zu dünn, kurzes Ende vor der Brust; Signalscheibe und Schulterkragen dazu), Schreiber (Kastenrücken, Papier als dünne Äste, Leerlauf zu unruhig), Tarierte (Haar verdeckte das Blatt, Blatt zu dunkel), Warteschlange (Vorderster aus dem Bild), Oberzöllner (Joch → Waage auf dem Kopf, Lichtkante malte über die Mütze), V0 (Rückwand zu fern, Bank mitten im Raum, Wände), V1 (Schalter unsichtbar, Regale schluckten die Schlange), Finale (Schalen hinter dem Boss → an die Ränder), Ereignisbilder Wartemarke (Figuren) und Asservaten (zu dunkel), Icons Eichgewicht und Zünglein.

## Offene Schwächen

- Die großen Mäntel (Oberzöllner, Schlagbaum b, Warteschlange) bleiben trotz Falten die dunkelsten Flächen.
- Ereignisse und Krämer erscheinen im echten Lauf nicht (Vorschlag 1).
- Die Rast-Szene ist die Halle mit Ofen, ohne eigene Komposition.
