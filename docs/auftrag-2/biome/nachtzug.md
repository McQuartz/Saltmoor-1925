# Der Nachtzug (`nachtzug`), Akt I

Stand 2026-11-04. Biom-Paket nach [paket-format.md](../paket-format.md). Daten: `prototype/data/biome/nachtzug.json`, Hintergrund: `prototype/js/scenes/world/nachtzug.js`, Sprites: `tools/sprites/gegner/{mitreisender,gepaeck,kontrolleurin,schlafwagenkind,uhrmacher}.js`, Zonenpalette: `tools/sprites/zonen/nachtzug.json`. Bilder: [bilder/M6/nachtzug/](../bilder/M6/nachtzug/). Alle Bilder per Skript gezeichnet (Weg A, `quelle: skript`).

## Ort

Ein Zug, der in Saltmoor hält, obwohl Saltmoor keinen Bahnhof hat. Er steht am Ende der Uferstraße mit offenen Türen. Innen ist er ein gewöhnlicher Schnellzug von 1925: Seitengang mit Abteilen, Speisewagen, Gepäckwagen, Mahagoni, grüner Samt, Messing, Lampen mit warmem Licht. Draußen ist nur Schwarz.

- **Wahrzeichen:** die Lok. Ihre Lampe leuchtet nach innen. Man sieht sie in jedem Kampf ganz hinten am Ende des Gangs, Tür um Tür, und sie ist die Quelle des Gegenlichts. Im Speisewagen (Wächter) steht die Tür nach vorn offen, und dahinter ist nicht der Tender, sondern die Stirn der Lok, falsch herum, mit der Lampe zu uns.
- **Falsches Detail:** Die Fenster zeigen Landschaft, aber immer dieselbe Kurve: derselbe Hang, dasselbe Gleis im selben Bogen, derselbe Telegrafenmast, dasselbe erleuchtete Haus. Technisch wird für jedes Fenster dasselbe Bild auf die Fensterfläche gerechnet, darum steht es in jedem Fenster gleich, egal wie weit hinten es ist. Das Haus und das Gleis blinken in allen Fenstern gleichzeitig.
- **Zeitschicht 1925:** Menschen, die sich verändern. Alle Gegner sind Fahrgäste oder Personal, und an jedem ist genau eine Sache falsch.
- **Palette:** Mahagoni (Wände, Körper), Polstergrün (Bänke, Vorhänge, Läuferkante), Messing (Rahmen, Haltestange, Knöpfe, Uhren), Lampenlicht warm, Fenster kalt blau. Die Figuren haben einen Mahagoni-Körper und **kaltes** Randlicht (das Licht der Fenster), ihre Augen leuchten im warmen Lampenlicht. So stehen sie vor dem warmen Holz.

## Hintergrund: Bildaufbau

Ein Zug ist eng. Die Tiefe entsteht über die **Länge** des Wagens, nicht über Landschaft. Darum rechnet `nachtzug.js` den Innenraum je Pixel als Kasten (Boden, Decke, linke und rechte Wand, Stirnwand mit Tür), mit Fluchtpunkt und echten Weltkoordinaten. Darauf liegen die Formen (Fensterrahmen, Vorhänge, Türen, Bänke, Tische, Lampen, Gepäck) mit Fase, Randlicht und Kontaktschatten aus `basis.js`. Licht: Hängelampen und Tischlampen geben warme Lichtinseln (Abfall mit dem Abstand im Raum), die Lok gibt von hinten ein kaltweißes Band über den Läufer und das Gegenlicht. Nebel nur als schmales Dunstband um den Fluchtpunkt.

Ein Zugeständnis an das Spiel: Die Gegner stehen in drei Reihen über fast die ganze Bildbreite. Der Wagen ist darum etwas breiter als ein echter (die Wände laufen vorne bis an den Bildrand). Die Reihen liegen tiefer im Bild als in den alten Biomen (y 180/198/216), damit alle Gegner auf dem Boden des Wagens stehen.

| Szene | Grundform | Horizont | Blickpunkt | Blickführung |
|---|---|---|---|---|
| V0 Seitengang | Flucht, Fluchtpunkt rechts der Mitte | y 104 | stehend im Gang | Läufer, Haltestange und Lampenreihe zum Ende des Gangs, dort Tür um Tür die Lampe der Lok |
| V1 Speisewagen | Flucht, Fluchtpunkt **links** | y 108 | im Gang neben dem Büfett | die Tischreihe rechts mit den Tischlampen läuft zur Lok, links das Büfett mit Gläsern |
| V2 Gepäckwagen | **Querblick**, frontal auf die Seitenwand | y 112 | quer im Wagen | die offene Schiebetür in der Mitte als schwarzes Rechteck, Gepäck links und rechts, Laterne |
| Wächter | Flucht, symmetrisch, nah | y 112 | im Speisewagen vorne | die offene Tür nach vorn, darin die Stirn der Lok mit der Lampe, groß, hinter dem Uhrmacher |

### V0: Seitengang im Schlafwagen

- Links die Abteilwand: Schiebetüren aus Mahagoni, im Glas warmes Licht hinter gefältelten Vorhängen, eine Tür dunkel. Hinter einem Vorhang sitzt der Schatten eines Menschen, aufrecht, und rührt sich nicht. Messinggriffe und Nummernschilder. Das Licht der Abteile fällt schräg auf den Gangboden.
- Rechts die Fensterwand: große Fenster mit Messingrahmen und gebundenen grünen Vorhängen, darunter die Messing-Haltestange über die ganze Länge. In jedem Fenster dieselbe Kurve. Kaltes Fensterlicht liegt in Flecken auf dem Boden an der Fensterseite.
- Decke mit Mittelstreifen und Spanten, Hängelampen in einer Reihe (Maßstab: Lampe und Türgriff gegen die Länge des Wagens).
- Am Ende: Tür, durch die man in den nächsten Wagen sieht, und noch einen, ganz hinten die Lampe der Lok. Strahlen fallen aus ihr in den Gang zurück.
- Vordergrund: links die angeschnittene, offene Tür eines Abteils mit Messinggriff, rechts die Kante eines Vorhangs.
- `fremdheit`: Hinten gehen die Lampen aus, bei 1 brennt nur noch die nächste; die Abteile werden dunkel; die Lok leuchtet stärker.

### V1: Speisewagen

- Fluchtpunkt links, damit sich der Bildaufbau vom Gang unterscheidet: Die Fensterseite rechts ist lang und offen. Dort stehen die Tische zwischen hohen grünen Sitzbänken, weiße Tücher, gedeckte Teller, Gläser, jede Tischlampe mit Faltenschirm brennt. Gedeckt für Gäste, die nicht kommen.
- Links das Büfett, eine Anrichte mit Gläserschrank (Glanzpunkte kalt und warm).
- Auch hier: dieselbe Kurve in jedem Fenster, am Ende die Lok.
- Vordergrund: die angeschnittene Lehne einer Sitzbank rechts unten.

### V2: Gepäckwagen (Querblick)

- Wir stehen quer im Wagen. Gegenüber die Bretterwand, mittig die **Schiebetür offen**: draußen ist nichts, kein Stern, kein Boden, schwarzes Schwarz. Rechts daneben die aufgeschobene Tür.
- Links Überseekoffer und Kisten gestapelt, Postsäcke; rechts Milchkannen, ein Fahrrad an der Wand, eine hohe Kiste.
- Eine Laterne hängt am Deckenbalken (das einzige warme Licht), ihr Lichtfleck liegt auf den Dielen.
- Links in der Stirnwand (Richtung Lok): Licht durch die Ritzen der Tür und das Schlüsselloch, als Strahlen über den Boden. Die Lok ist auch hier da, nur nicht zu sehen.
- Vordergrund: Postsäcke links unten, die Kante eines Überseekoffers rechts unten.

### Wächter: Im Speisewagen, vorne

- Der Speisewagen ist der letzte Wagen vor der Lok. Symmetrisch, nah, Tische an beiden Seiten. Die Tür nach vorn steht offen, und darin steht die Stirn der Lok, mit Rauchkammertür, Nieten und Messingring, und der großen Lampe, die nach innen leuchtet. Der Uhrmacher steht davor im Gegenlicht.
- Über der Tür links die Bahnhofsuhr. Die Zeiger stehen, der rote Sekundenzeiger läuft rückwärts (animiert).

### Andere Arten

- **weg:** Variante nach Seed.
- **rast:** ein Abteil, Blick von der Tür auf das Fenster: zwei grüne Polsterbänke einander gegenüber, Spitzendeckchen, Gepäcknetze mit Koffern, Reiseplaid auf der linken Bank, Klapptisch, die Leselampe brennt. Im großen Fenster die Kurve.
- **werkstatt:** Gepäckwagen mit Werkbank (Baustein aus `basis.js`).
- **kraemer:** Gepäckwagen, der Schaffner hat einen Klapptisch mit Fundsachen aufgebaut: Schirme an der Wand, eine Melone, Pakete, eine Laterne.
- **ereignis / fund:** Seitengang, mitten auf dem Läufer ein Koffer, dessen Schloss glimmt.
- **wandbild:** Seitengang (das Relief kommt von `World.relief` mit eigenem Mahagoni-Stil).
- **uebergang:** Seitengang, kurz; die Tür am Ende steht offen, Stufen führen ins schwarze Wasser, dahinter eine Kirchenmauer mit grünem Rundfenster (Übergang zur Kapelle).

## Gegner

### Der Mitreisende (`mitreisender`)
- **Motiv:** der Fremde im selben Abteil, den man nicht ansieht.
- **Wer er war:** ein Herr mit Melone, der jeden Abend denselben Zug nimmt und Zeitung liest.
- **Was falsch ist:** Seine Beine sind viel zu lang. Er hat sie zusammengelegt wie einen Zollstock, die Knie stehen höher als sein Hut. Über dem Zeitungsrand zwei Augen, die nicht blinzeln. Wenn er angreift, klappt er ein Bein auf und tritt quer durch den Gang.
- **Silhouette:** ein spitzes A aus zwei Beinen neben einem sitzenden Mann mit Melone hinter einer Zeitung, auf einem Koffer.
- **Kniff:** `ansage` (2 Züge, dann 15): Er liest zwei Seiten zu Ende, dann klappt er sich auf. Fordert Block-Planung.
- **Muster:** durch die Ansage ersetzt: Laden, Laden, großer Tritt.
- **Schwachstelle Feuer:** Die Zeitung brennt, und dahinter ist nichts, das ihn hält.
- **Stimme:** `schmuggler` (gepfiffenes Motiv, das abbricht: ein Herr, der hinter der Zeitung pfeift).
- **Varianten:** a mit Melone; b mit Zylinder, längeren Beinen und einem Schirm über dem Knie.

### Das Gepäckstück (`gepaeck`)
- **Motiv:** Dinge, die mitreisen, weil jemand sie nicht abgeholt hat.
- **Was es war:** Überseekoffer, Handkoffer und Hutschachtel eines Fahrgasts, der nie angekommen ist.
- **Was falsch ist:** Das Gepäck läuft auf zwei menschlichen Armen, die Ellbogen hoch wie bei einer Krabbe. Aus dem Spalt des Handkoffers hängt ein Mantelärmel mit einer blassen Hand. Durch Schlüsselloch und Deckelspalt fällt warmes Licht, als wäre innen ein Abteil. Im Angriff klappt der Deckel auf, innen ein Lichtschlitz mit Schlössern wie Zähne.
- **Silhouette:** ein Stapel kantiger Kästen zwischen zwei hoch geknickten Armen.
- **Kniff:** `einfrieren`: Es nimmt jeden Zug eine deiner Karten an sich, wie man Gepäck aufgibt. Fordert eine breite Hand.
- **Muster:** Rammen (8), Riemen (2 × 4), Deckel zu (Block 7).
- **Schwachstelle Wasser:** Leder und Pappe weichen auf, die Riemen rutschen, und der Stapel fällt auseinander.
- **Stimme:** `mumie` (tiefe Rahmentrommel: ein Koffer, der auf den Boden schlägt).
- **Varianten:** a drei Stücke mit Hutschachtel; b ein hoher Schrankkoffer mit Handkoffer und einer dritten Hand darunter.

### Die Kontrolleurin (`kontrolleurin`)
- **Motiv:** die Ordnung, die nicht mehr weiß, wofür sie da ist.
- **Wer sie war:** die Schaffnerin des Schlafwagens, die jede Nacht die Fahrkarten prüft.
- **Was falsch ist:** Sie hält dir die offene Hand hin, viel zu weit: Der Arm hat ein Gelenk zu viel und reicht durch den halben Wagen. Ihr Gesicht ist gelocht wie eine Fahrkarte, und durch die Löcher scheint Licht von hinten.
- **Silhouette:** eine schmale Säule im Uniformmantel mit Schirmmütze und einem waagerechten, überlangen Arm mit offener Hand.
- **Kniff:** `abschrift` (1): Sie stellt dir einen Nachlöseschein aus, eine unspielbare Karte im Ablagestapel. Fordert Kettenwerk und dünne Decks.
- **Muster:** Zange (2 × 5), Hand (9), Mantel zu (Block 6).
- **Schwachstelle Glaube:** Ein Gebet ist auch eine Fahrkarte, nur für eine andere Strecke, und die kann sie nicht lochen.
- **Stimme:** `rufer` (menschliche Formanten ohne Worte, hoch: „Die Fahrkarten, bitte“ ohne Wörter).
- **Varianten:** a Arm mit zwei Gliedern, drei Löcher; b Arm mit drei Gliedern, vier Löcher, Geldtasche am Riemen.

### Das Schlafwagenkind (`schlafwagenkind`)
- **Motiv:** das Kind, das im Schlaf durch den Zug läuft und nicht geweckt werden darf.
- **Wer es war:** ein Kind aus dem Schlafwagen, unterwegs zu Verwandten, die es nie abgeholt haben.
- **Was falsch ist:** Sein Haar fällt nach oben, als hinge es kopfüber. Die Augen sind zu, und durch die Lider scheint Licht. Das Nachthemd schleift lang hinter ihm her.
- **Silhouette:** eine kleine Gestalt mit vorgestreckten Armen, einer nach oben wehenden Haarflamme und einer langen Schleppe.
- **Kniff:** `ruf` (Mitreisender, alle 3 Züge): Es ruft im Schlaf nach jemandem, und jemand steigt zu. Fordert Flächenschaden oder schnelles Töten.
- **Muster:** Zusammenrollen (Block 5), Greifen (2 × 4), Schreien (6).
- **Schwachstelle Licht:** Licht weckt es, und wach ist es nur ein Kind.
- **Stimme:** `chorknabe` (hohe Kinderstimme auf „oh“).
- **Varianten:** a kürzeres Haar, lange Schleppe; b längeres Haar, eine Puppe hängt an einem Arm aus der Hand.

### Wächter: Der Uhrmacher im Speisewagen (`uhrmacher`)
- **Motiv:** Zeit, die jemand anders aufzieht.
- **Wer er war:** ein Reisender, Uhrmacher von Beruf, der im Speisewagen sitzen blieb, als alle ausstiegen.
- **Was falsch ist:** Er ist lang und gebeugt, eine Uhrmacherlupe glüht vor seinem Auge. Mit beiden Händen dreht er einen Aufzugsschlüssel, der im Boden des Wagens steckt: Er zieht den Zug auf. Im offenen Mantelfutter hängen Taschenuhren an Ketten, und alle gehen rückwärts (die Zeiger springen in der Animation Bild für Bild zurück). Im Angriff reißt er den Schlüssel heraus und stößt mit dem Bart zu.
- **Silhouette:** ein hoher, gebeugter Mann mit Buckel im langen Mantel, eine Röhre vor dem Auge, vor ihm ein T-förmiger Schlüssel bis zum Boden.
- **Kniff:** `brecher`: Er dreht die Zeit zurück bis vor deinen Schutz (zerbricht deinen Block beim Angriff). Fordert Bollwerk.
- **Besonderheit:** `ruft` (alle 3 Züge steigt ein Mitreisender zu, dessen Ansage man mitplanen muss).
- **Muster:** Schlüssel (9), Aufziehen (Block 12), Zeiger (3 × 4), die Uhren schlagen (Stärke +2), Bart (16).
- **Schwachstelle Eisen:** Ein Stück Eisen im Uhrwerk, und die Zeit des Zugs bleibt stehen.
- **Stimme:** `glockenmutter` (Glocke ohne Anschlag, nur Nachhall, wie ein Stundenschlag).
- **Beute:** Aufzugsschlüssel (Reliquie).
- **Ideen aus dem Steckbrief, die das Paket nicht selbst umsetzt** (brauchen Kern-Code, darum nicht erfunden): „macht deine Karten teurer“ und „Absichten in falscher Reihenfolge“. Wenn der Kern dafür später Bausteine hat (z. B. `kniff: verborgen` als zweiten Kniff oder ein `besonders: teurer`), passen beide zum Uhrmacher.
- **Größe:** 128 × 160 (die Regel-Prüfung erlaubt für Wächter derzeit höchstens 128 × 160).

## Items

| ID | Name | Rar | Kerben | Eigenschaft | Karte | Woher |
|---|---|---|---|---|---|---|
| `fahrkartenzange` | Fahrkartenzange | gewöhnlich | 1 | – | Lochen (0): 3 Schaden, Verwundbar 1 | Fundpool, Beute Kontrolleurin |
| `schaffneruhr` | Taschenuhr des Schaffners | selten | 2 | `energie_bleibt 1` | Fahrplan (0): ziehe 1, Behalten | Fundpool, Krämer |
| `reiseplaid` | Reiseplaid | selten | 2 | `start_block 5` | Einhüllen (1): Block 6, Behalten | Fundpool, Beute Mitreisender |
| `kohlenschaufel` | Kohlenschaufel des Heizers | selten | 2 | `brand_haelt` | Nachschaufeln (1): 4 Schaden, Brand 2 | Fundpool, Beute Gepäckstück (aus 04-deckbau.md, Glutnest) |
| `aufzugsschluessel` | Aufzugsschlüssel | Reliquie | 2 | `energie_plus 1`, Preis: eine Karte weniger auf der Hand | Aufziehen (0): +1 Energie, ziehe 1, Verbraucht | nur Wächter |

Der Gepäckriemen aus dem Steckbrief ist weggelassen: Er hätte nur Werte getragen, die Kohlenschaufel stützt dagegen einen Build (Glutnest) und steht in 04-deckbau.md als Nachtzug-Item. Fundpool dazu passend aus dem alten Bestand: Trenchcoat, Stockdegen, Sturmlaterne, Laudanum, Riechsalz, Offiziersmantel.

## Ereignisse

| ID | Titel | Bezug auf Früheres |
|---|---|---|
| `nachtzug_fahrkarte` | Die Fahrkarte (Kerbe, Gold oder Karte streichen) | |
| `nachtzug_gedeck` | Gedeckt für zwei (Heilen, Handgriff lernen, Kampf) | |
| `nachtzug_kurve` | Die Kurve (Stummfilm; Reaktion entdecken, seltenes Item, Heilen) | |
| `nachtzug_lupe` | Ein Herr mit Lupe (Schleifen, zwei Wahlen nur mit Taschenuhr bzw. Uhr des Schaffners) | `if: {item}` |
| `nachtzug_koffer` | Dein Koffer (Item, seltenes Item mit Kampf, Gold) | |
| `nachtzug_kontrolle` | Die Kontrolle (Handgriff nur mit der Fahrkarte von vorher, Nachlösen, Kampf) | `if: {event_gesehen: nachtzug_fahrkarte}` |
| `nachtzug_netz` | Das schlafende Kind (Segen nur für die Pfarrerin, Heilen, Kampf mit seltenem Item) | `if: {job: pfarrerin}` |

## Musik

h-Moll (Grundton 47, die Nachbarn im Akt I liegen auf d und c), `rhy: holz` als Schienenstöße, Ortsklang `wind` und `gaenge` (Fahrtwind im Gang), Einzelklänge des Hafens (ferne Glocke).

## Prüfung

- `node tools/sprites/pruefen.js mitreisender_a mitreisender_b gepaeck_a gepaeck_b kontrolleurin_a kontrolleurin_b schlafwagenkind_a schlafwagenkind_b uhrmacher`: **9 Sprites, 0 Verstöße.**
- Kontaktbogen neben Chorknabe, Hirte, Netzflickerin: [kontaktbogen.png](../bilder/M6/nachtzug/kontaktbogen.png). Silhouetten (gewählt, verworfen, alle vorhandenen Gegner): [silhouetten.png](../bilder/M6/nachtzug/silhouetten.png).
- Hintergrund: [hintergrund-varianten.png](../bilder/M6/nachtzug/hintergrund-varianten.png) (V0, V1, V2, Wächter mit Platzhaltern), [hintergrund-waechter.png](../bilder/M6/nachtzug/hintergrund-waechter.png), [hintergrund-arten.png](../bilder/M6/nachtzug/hintergrund-arten.png) (weg, rast, werkstatt, krämer, ereignis, wandbild, fund, übergang), [hintergrund-fremdheit.png](../bilder/M6/nachtzug/hintergrund-fremdheit.png) (0 / 0,5 / 1).
- Im Spiel (`newRun('fischer',…,{dev:true,route:['nachtzug',…]})`, `Dev.springe`): [im-spiel-kampf-gang.png](../bilder/M6/nachtzug/im-spiel-kampf-gang.png), [im-spiel-kampf-gepaeckwagen.png](../bilder/M6/nachtzug/im-spiel-kampf-gepaeckwagen.png), [im-spiel-waechter.png](../bilder/M6/nachtzug/im-spiel-waechter.png). Keine Konsolenfehler aus dem Paket (die zwei 404 auf `assets/items/index.json` und `assets/handgriffe/index.json` kommen aus dem Kern).
- `node tools/biom-test.js nachtzug 10`: **8/10 Akte überstanden, 0 Fehler** (über 30 Seeds 21/30). Zum Vergleich Hafen 10/10.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5, Gesamt = schwächster Punkt)

| Bild | Silh. | Licht | Pixel | Konzept | Biom | Im Spiel | **Gesamt** | Begründung |
|---|---|---|---|---|---|---|---|---|
| Mitreisender | 5 | 4 | 4 | 5 | 4 | 4 | **4** | Das A aus Zollstock-Beinen über dem Hut ist sofort lesbar und einmalig; der Mantel ist innen etwas flach, mehr Faltenlicht wäre schöner. |
| Gepäckstück | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Kästen auf Krabbenarmen lesen sich klar und anders als alles bisher; Ärmel und Aufkleber sind im Spiel klein und fast nur als Fleck zu sehen. |
| Kontrolleurin | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Der waagerechte Überlang-Arm und das gelochte, durchleuchtete Gesicht tragen das Konzept; als Mantelsäule mit Mütze steht sie dem Schmuggler noch etwas nah. |
| Schlafwagenkind | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Klein, Arme vor, Haar nach oben und Schleppe sind gut lesbar; das Haar kann auf den ersten Blick auch als Flamme gelesen werden. |
| Uhrmacher (Wächter) | 4 | 5 | 4 | 5 | 5 | 4 | **4** | Gebeugte Gestalt mit Lupe und Aufzugsschlüssel, die rückwärts laufenden Uhren im Futter sind das stärkste Detail des Bioms; der Kopf ist für 128 × 160 eher klein. |
| Hintergrund V0 Seitengang | 4 | 4 | 4 | 5 | 5 | 4 | **4** | Liest sich sofort als Zug, Tiefe über die Länge des Gangs, die Kurve in jedem Fenster ist sichtbar; die Decke ist eine große ruhige Fläche. |
| Hintergrund V1 Speisewagen | 4 | 4 | 4 | 4 | 5 | 4 | **4** | Tische, Bänke, Tischlampen und Fenster mit der Kurve; die Tischtücher sind etwas flach. |
| Hintergrund V2 Gepäckwagen | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Querblick mit der schwarzen Tür ist der eigenständigste Bildaufbau; es bleibt viel leerer Dielenboden, und das Gepäck ist dunkel. |
| Wächter-Szene | 5 | 5 | 4 | 5 | 5 | 4 | **4** | Die Lok mit der Lampe in der offenen Tür hinter dem Uhrmacher ist das stärkste Bild; die Lokstirn um die Lampe ist im Spiel nur zu ahnen. |
| Arten (rast, krämer, übergang …) | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Abteil, Fundsachen, Koffer und offene Tür ins Wasser sind eigene Ausschnitte desselben Ortes; das Abteil ist noch schwer und grün, der Krämerstand klein. |

Offene Schwächen (unter dem Maßstab der Favoriten, aber nicht unter 4): Die Figuren haben weniger inneres Licht als Chorknabe und Hirte; die Decken der Wagen sind große, ruhige Flächen; im Gepäckwagen wirkt der Boden leer, wenn wenige Gegner stehen.

## Zweiter Wächter: Der Oberkellner (`oberkellner`), 160 × 180 (Zugabe)

Der Seed wählt je Run zwischen Uhrmacher und Oberkellner (`biom.waechter_alt`); die Wächter-Szene im Speisewagen bleibt dieselbe.

- **Wer:** der Oberkellner des Speisewagens. Er bedient, seit der Zug fährt, und hat nie aufgehört, die Rechnung zu bringen.
- **Das falsche Detail:** Wo der Kopf sein müsste, steht auf dem Kragen ein Teller unter einer silbernen Speiseglocke, und unter ihrem Rand kommt warmes Licht heraus wie aus einer Küche. Die Rechnung ist für alle Gänge, auch die, die noch kommen. In Phase 2 hebt er die Glocke: Auf dem Teller liegt sein Gesicht und sieht zu dir herauf.
- **Silhouette:** schmaler Mann im Frack mit langen Schößen, oben die breite Kuppel der Glocke auf dem Tellerrand, vorn der Arm mit der Rechnung, die Serviette darunter. Probe mit Kopf und Glocke auf der Hand: schwarz ein gewöhnlicher Kellner, neben der Kontrolleurin wieder eine Säule mit Arm; genommen: Glocke statt Kopf.
- **Anders als der Uhrmacher:** Der Uhrmacher ist gebeugt und breit, zerbricht deinen Block, verteuert Karten und ruft Mitreisende. Der Oberkellner ist aufrecht und schmal und **verstopft die Hand**: Kniff `verstopfen` mit `karte: "Die Rechnung"` (jeden Zug eine unspielbare Rechnung auf die Hand, Bild der Wartemarke). Besonderheit `phasen` bei 50 %: Glocke hoch (`oberkellner_p2`), härteres Muster. Man spielt gegen eine immer vollere Hand, nicht gegen den Block.
- **Werte:** 94 Leben (über der Spanne 45–80 aus dem Paket-Format; mit 70–80 Leben lag der Akt im Autospieler bei 85–90 %), Schwachstelle **Wasser** (ein umgestoßenes Glas, und er muss abräumen). Muster 13, Block 10, 3 × 6, Stärke +3, 21; Phase 2: 2 × 9, 23, Block 12, 4 × 6. Stimme `bote`. Beute: Pfandschein Nr. 1925.
- **Licht:** eigene Zone `nachtzug_kellner`: Mahagoni im Körper, Randlicht **flieder** (ein Morgen, der nicht kommt; die Szene hat warmes Lampenlicht und kaltes Fensterblau). Inneres Licht: der Spalt unter der Glocke, in Phase 2 die Augen auf dem Teller und das Licht aus der leeren Glocke.
- **biom-test (20 Seeds):** Uhrmacher 15/20 (75 %), Oberkellner 15/20 (75 %).

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Der Oberkellner (`oberkellner`) | 4 | 4 | 4 | 5 | 4 | 4 | **4** | Glocke statt Kopf mit dem Lichtspalt ist das stärkste Detail, der Frack mit Schößen liest sich. Schwächen: Schwarz kann die Glocke auch ein Helm sein; der Leib ist eine dunkle Fläche mit wenig Faltenlicht. |
| Der Oberkellner, Phase 2 (`oberkellner_p2`) | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Die erhobene Glocke ändert die Silhouette deutlich, das Gesicht auf dem Teller mit zwei Augen liest sich aus der Nähe; klein im Spiel. |
| Im Spiel (Wächter-Szene) | | | | | | 4 | **4** | Steht vor der Loklampe, die Glocke vor dem hellen Kreis; Körper und Gang sind beide warm-dunkel, das Fliederlicht trennt sie. |

Bilder: [Spiel](../bilder/Zugabe/waechter2/nachtzug-oberkellner.png), [Kontaktbogen](../bilder/Zugabe/waechter2/bogen-a1.png).
