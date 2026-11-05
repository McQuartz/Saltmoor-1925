# Die Grotte der Gaben (`grotte`), Akt II

Paket nach [paket-format.md](../paket-format.md). Daten: `prototype/data/biome/grotte.json`, Hintergrund: `prototype/js/scenes/world/grotte.js`, Palette: `tools/sprites/zonen/grotte.json`, Sprites: `tools/sprites/gegner/{wachshand,geheilter,quellwaerter,bittsteller,erhoerte}.js`, Bilder: [bilder/M6/grotte/](../bilder/M6/grotte/).

## Der Ort

Eine Wallfahrtsgrotte in der Steilküste unter Saltmoor. Seit dem Mittelalter kamen Pilger auf Knien, tranken aus der Quelle und ließen zurück, wovon sie geheilt waren: Krücken an der Wand, Gaben aus Wachs in der Form des geheilten Körperteils (Hände, Beine, Herzen, Augenpaare), dazu Kerzen, so viele, dass sie auf den Felsstufen eine Wand aus Licht bilden. Zeitschicht: Glaube und Volksfrömmigkeit, die Menschen hier sind **verwandelt**.

- **Wahrzeichen:** die Madonna aus Tropfstein. Sie ist gewachsen, nicht gehauen, mit Schleier und einem dünnen Ring aus Tropfstein als Heiligenschein. Sie steht mit dem Gesicht zur Wand. Man sieht sie in jeder Szene nur von hinten oder im Halbprofil.
- **Falsches Detail:** Die Wachsgaben sind warm, und es werden mehr, obwohl keiner mehr kommt. Im Bild: Wachshaufen auf dem Boden, aus denen Hände ragen und die von innen glimmen (gedithertes Glühen, eine langsame Atmung im Leuchten). Mit `fremdheit` werden es mehr Haufen und weniger brennende Kerzen.
- **Unterschied zur Kapelle:** Die Kapelle ist bernstein, Gotik, Wasser und Altar. Die Grotte ist kalter, nasser Schiefer (blaugrau, fast schwarz), Licht kommt aus der **Masse** der Kerzen (Wachsgelb, einzelne rote Votivkerzen), nicht aus einem Altar. Es gibt keine Architektur, nur Fels, Tropfstein, Holz der Krücken und Wachs.
- **Palette:** Körper `#050608 #0b0e12 #151a20 #212831` (Schiefer), Randlicht `#a48a4c #f4e2a6` (Wachslicht), Augen `#ff6a3c` (Kerzenrot), Glühen `#583018`, dazu `wachs`, `flamme`, `kerzenrot`.
- **Licht:** Das Gegenlicht von hinten oben rechts kommt aus der Masse der Kerzen (warm) und in V0 zusätzlich aus einem Spalt im Fels oben rechts, durch den kaltes Nachtlicht von der Küste fällt. In V2 ist es der Grottenmund zur See.
- **Musik:** h-Moll (Grundton 47, frei im Akt), Ortsklang Stollen leise und Meer sehr leise, Rhythmus Holz (Krücken auf Stein), Ortsklang-Details der Salzstollen (Tropfen, Holz).
- **Krämer:** Die Kerzenfrau, an der Kerzenwand. Nimmt kein Geld, wiegt Gabe gegen Gabe. Im Spiel ist sie ein normaler Krämer (Stand aus Holz mit hängenden Kerzenbündeln). Das Tauschen gibt es als Ereignis „Gabe gegen Gabe“ (`item_tausch`), solange der Kern keinen Tausch-Krämer kennt.

## Hintergrund: Komposition in Worten

Gemeinsam: 480 × 270, Gegner auf drei Reihen y 166–216, UI-Ecke oben links bleibt ohne Wahrzeichen. Hinter den Figuren liegt eine Höhlenwand in warmem Schiefer (`WAND`-Rampe), die heller ist als die Körper der Gegner, damit die Silhouetten stehen. Nebel nur als schmales Band über dem Boden. Luft: Kerzenrauch steigt, Tropfen fallen von der Decke.

### Variante 0: Vor der Kerzenwand
**Grundform: Aufstieg nach rechts.** Horizont y 150. Links die hohe Felswand, vorn angeschnitten, an ihr zwei Reihen Krücken (gekreuzt, die Achselstücke oben) und darüber an einer Schnur die Wachsgaben. Aus dieser Wand tritt unten die Quelle in ein Becken (links, außerhalb der Gegnerplätze). In der Mitte steigen Felsstufen nach rechts hinten auf, auf jeder eine dichte Reihe Kerzen, das Wachs läuft die Stufen herab: das ist die Kerzenwand, das warme Zentrum des Bildes. Ganz oben auf dem Felsen steht klein die Madonna, mit dem Gesicht zur rechten Wand, die dort, wo sie hinsieht, glatt gerieben ist. Oben rechts ein Spalt mit kaltem Nachtlicht. Tropfsteine an der Decke. Auf dem Boden aus nassem Schiefer liegen Wachshaufen zwischen den Gegnern; Pfützen spiegeln die Kerzen in schmalen senkrechten Strichen. Vorn unten Felskanten und ein paar Kerzenstümpfe. **Maßstab:** Krücken und Kerzen gegen die Felsstufen.

### Variante 1: Der Gang der Gaben
**Grundform: Zentralperspektive als Röhre.** Fluchtpunkt (236, 134). Felsringe hintereinander, jeder mit einer unregelmäßigen Öffnung (kein Kasten, keine Architektur), am Ende eine kleine Kammer im Kerzenlicht mit der Madonna, abgewandt. Am Boden laufen zwei Reihen Kerzen an den Wänden entlang zum Fluchtpunkt, sie sind die Fluchtlinien. Am nahen Ring hängen links Krücken, rechts Wachsgaben (Hand, Herz, Augen, Bein). Der Boden ist nur zwischen den Wänden, die Wachshaufen fließen aus den Wänden.

### Variante 2: Am Grottenmund
**Grundform: dunkler Rahmen, kaltes Fenster.** Horizont der See bei y 128. Der Fels rahmt alles, rechts öffnet sich der Grottenmund zur Nacht über dem Meer (einzige kalte Fläche, Sterne, ziehende Gischt). Im Mund steht die Madonna groß auf einem Felsen, Rücken zur See, das Gesicht zur Felswand hinein, zu ihren Füßen Kerzen. Links tritt die Quelle als Faden aus dem Schiefer und fällt in einen flachen Teich, in dem sich die Kerzen spiegeln; am Ufer Kerzen und angelehnte Krücken. **Maßstab:** die Madonna gegen die Öffnung.

### Wächter: Vor der Madonna
**Grundform: Untersicht, das Wahrzeichen nah.** Horizont y 190. Rechts der Mitte die Madonna riesig (150 px), im Halbprofil zur rechten Wand, Heiligenschein oben angeschnitten. Zu ihren Füßen ein Berg aus Wachs, auf dem Hunderte Kerzen brennen, und Wachshände, die zu ihr hinaufgreifen. Links ein Haufen weggeworfener Krücken. Die Erhörte steht links davor, ihre Flamme genau unter der Decke. Tropfsteine über die ganze Breite.

### Übergang
Dieselbe Szene, aber in der Wand, auf die die Madonna blickt, ist ein Spalt: Stufen führen hinab, Wasser rinnt daneben. Der Übergangssatz: „Dort, wohin die Madonna blickt, ist ein Spalt im Schiefer. Stufen führen hinab, ausgetreten von Knien.“

### Andere Arten
- **weg, werkstatt, ereignis, wandbild, fund:** die Variante des Seeds (Ereignis und Wandbild immer der Gang); Ereignis und Fund mit einem großen Wachshaufen als Blickpunkt, Werkstatt mit der Werkbank aus `basis.js`.
- **rast:** Grottenmund, statt Lagerfeuer ein Kreis aus Kerzen auf einem Stein, in der Mitte ein kleiner Wachshaufen.
- **kraemer:** Grottenmund, der Stand der Kerzenfrau: Tisch mit Kerzen, Gaben darauf, an einer Stange hängende Kerzenbündel.

## Gegner

Alle fünf Figuren sind Verwandelte der Wallfahrt: fast menschlich, an einer Stelle falsch, aus oder mit Wachs. Silhouetten vorab je zweimal als schwarze Fläche verglichen (Kontaktbogen `silhouetten.png`, Grotte zuletzt mit gelbem Rahmen).

### Die Wachshände (`wachshand`)
- **Motiv:** die Gabe, die nicht aufhört.
- **Wer sie waren:** die Wachshände, die Geheilte an die Wand gehängt haben. Sie sind heruntergefallen und zu einem Hügel zusammengeflossen.
- **Was falsch ist:** Sie greifen weiter. Im Wachs stecken Votivaugen, die dich ansehen, und der Hügel ist warm.
- **Silhouette:** ein niedriger zerflossener Hügel, aus dem sechs Hände verschieden hoch nach oben greifen, wie ein Strauch aus Fingern. Probiert: (1) Strahlenkranz, die Hände rundum wie ein Seeigel, (2) Strauß, die Hände steiler und dichter, der Hügel höher. Der Strauß liest sich eher als „Haufen Gaben“ und wurde Variante a, der Strahlenkranz mit Kerzenstümpfen Variante b.
- **Kniff:** `kleinvieh` (viele kleine Treffer). 18 LP, Muster: 3 × 2, Block 4, 4 × 2.
- **Schwachstelle Feuer:** Wachs schmilzt.
- **Stimme:** `netzflickerin` (gezupfte Saite, Finger).
- **Animation:** Leerlauf: die Finger krümmen sich nacheinander, ein Votivauge blinzelt. Angriff: die Hände biegen sich nach rechts zurück und öffnen sich (Ausholen), dann fahren sie nach links und schließen sich zur Faust. Tod: die Hände werden kürzer und krümmen sich ein, der Hügel zerfällt.

### Der Geheilte (`geheilter`)
- **Motiv:** das Wunder, das zu weit ging.
- **Wer er war:** ein Gelähmter, der an zwei Krücken kam und ohne ging. Die Krücken hängen an der Wand.
- **Was falsch ist:** Er geht seitdem auf allen vieren: die Arme zu lang und gerade wie Stelzen, die Hände flach auf dem Stein, die Knie nach hinten geknickt. Der Kopf liegt im Nacken, der Mund offen vor Dank. Um den Hals das Wachsbein, das er geopfert hat; es glimmt. (Variante b: ein Rest Krücke ist ihm in den Rücken gewachsen.)
- **Silhouette:** ein ausgemergelter Mensch auf vier Stelzen, vorn höher als hinten, mit einer Reihe Wirbel auf dem Rücken und dem Kopf nach oben. Probiert: (1) hoher Buckel, (2) flacher Rücken mit herausstehenden Wirbeln. Der flache Rücken liest sich menschlicher, der Buckel wirkte wie ein Kamel.
- **Kniff:** `waechst` 1 (er wird mit jedem Zug stärker). 20 LP, Muster: 5, 2 × 3, 7.
- **Schwachstelle Glaube:** Ein Segen erinnert die Beine daran, dass sie nicht laufen konnten.
- **Stimme:** `salzlaeufer` (Klicken auf Tonhöhe, wie Krücken auf Stein).
- **Animation:** Angriff: er steigt vorn hoch, die Arme lösen sich vom Boden (Ausholen), dann schlägt er mit beiden Armen nach vorn nieder.

### Der Quellwärter (`quellwaerter`)
- **Motiv:** der Dienst an der Quelle.
- **Wer er war:** der Mann, der den Pilgern mit der Kelle aus der Quelle geschöpft hat.
- **Was falsch ist:** Er steht bis zur Hüfte in einer Brunnenschale, die eine Handbreit tief ist. Der rechte Arm greift ins Wasser, tiefer, als die Schale ist. Wasser läuft in Fäden über den Rand. (Variante b: Muschelschale und Becher statt Kelle.)
- **Silhouette:** eine flache, breite Schale auf einem Fuß, darüber ein hagerer Oberkörper mit nassem Tuch über dem Kopf und einer langen Kelle nach links. Probiert: runde Schale gegen Muschelschale; beide lesen sich, darum beide als Varianten.
- **Kniff:** `schuetzer` 3: Er gießt den anderen Quellwasser über, was nass ist, hält. Ursprünglich `heiler` 5 („heilt aus der Quelle“). Der Kern heilt mit `heiler` aber auch sich selbst; allein gegen ein schwaches Deck (Pfarrerin, Seed 9) entstand so ein Kampf ohne Ende, und der Autospieler hing. Darum `schuetzer`. Wenn der Kern `heiler` auf Verbündete beschränkt, passt `heiler` 5 besser zum Konzept.
- **Muster:** 24 LP; 6, Block 5, 2 × 3.
- **Schwachstelle Fäulnis:** Faules Wasser heilt nicht mehr.
- **Stimme:** `ertrunkener` (gurgelnd).
- **Animation:** Angriff: die Kelle geht hoch über den Kopf (Ausholen), dann schlägt sie nach vorn waagerecht aus.

### Der Bittsteller (`bittsteller`)
- **Motiv:** die Bitte, die keiner hört.
- **Wer er war:** ein Pilger, der seit der letzten Wallfahrt auf Knien rutscht, wie man es früher tat.
- **Was falsch ist:** Auf dem Rücken trägt er ein Bündel Wallfahrtskerzen, länger als er selbst, eine brennt. Das Wachs an den Kerzen läuft nach oben. In den Händen hält er dir ein Wachsherz hin, das warm ist.
- **Silhouette:** eine kniende, vorgebeugte Kapuzengestalt, aus deren Rücken ein Fächer langer Kerzen ragt. Probiert: (1) acht dünne Kerzen dicht, (2) sechs, länger und ungleich. Die zweite Fassung liest sich klarer (weniger „Igel“).
- **Kniff:** `nachlass` (`was: item`): Was er bringen wollte, bleibt liegen, wenn er fällt.
- **Muster:** 20 LP; Block 4, 5, 8.
- **Schwachstelle Wasser:** Ein Guss löscht die Kerze, und mit ihr, was ihn hält.
- **Stimme:** `kultist` (gedämpfter Männerchor, Gebet).
- **Animation:** Angriff: er richtet sich auf den Knien auf, das Bündel kippt nach hinten (Ausholen), dann schlägt es nach vorn über ihn.

### Wächter: Die Erhörte (`erhoerte`, 128 × 160)
- **Motiv:** das Gebet, das ganz und gar erhört wurde.
- **Wer sie war:** eine Pilgerin. Worum sie gebetet hat, steht nirgends.
- **Was falsch ist:** Sie ist aus Wachs. Die Hände über dem Kopf zur Spitze gefaltet, aus den Fingerspitzen brennt ein Docht. Der Rock ist zu einem Sockel zerflossen, in Schultern und Rock stecken Votivkerzen, unter den Armen hängen Wachszapfen, an der Brust ein Wachsherz. Das Gesicht ist nach oben gewandt, der Mund offen.
- **Silhouette:** eine Betende mit gehobenen Armen, deren gefaltete Hände eine Spitze mit Flamme bilden, über einem weit zerflossenen Sockel. Einmalig unter allen Gegnern (Glockenmutter: Glocke als Kopf; Chorknabe: Kegel mit Köpfen).
- **Kniff:** `waechst` 1 (sie schmilzt im eigenen Licht und wird dabei schneller).
- **Besonderheit:** `ruft` Wachshände alle 3 Züge: Die Gaben werden mehr, obwohl keiner kommt.
- **Muster (5):** 60 LP; 7, Stärke +2, 4 × 3, Block 10, 12.
- **Schwachstelle Salz:** Salz ist das, was das Meer gibt und nicht der Himmel. Es verkrustet das Wachs, bis es reißt.
- **Stimme:** `glockenmutter` (Wächter-Schlüssel: Knabenchor eine Oktave tiefer, gedoppelt).
- **Animation:** Angriff: die gefalteten Hände gehen höher und nach hinten (Ausholen), dann fahren sie nach vorn herab, die Flamme zieht eine Spur. Tod: sie schmilzt zusammen, alles sackt zum Boden und wird breiter, die Flammen gehen aus.
- **Beute:** Reliquie „Docht der Erhörten“.

## Items

| Item | Bereich, Stoff | Seltenheit | Eigenschaft | Karte | Flavor |
|---|---|---|---|---|---|
| Votivherz | Talisman, Glaube | selten, 2 Kerben, 44 | `reaktion_heil` 1 (Bollwerk/Kettenwerk) | Ein Herz hinlegen: 1, Block 5, Heilung 2 | Ein Herz aus Wachs, so groß wie eine Faust. Es ist warm, und es wird nicht kälter. |
| Pilgerstab | Waffe, Eisen | gewöhnlich, 1 Kerbe, 22 | keine | Pilgerschritt: 1, 5 Schaden, Block 3 | Im Griff sind Kerben, eine für jede Wallfahrt. Es sind mehr, als ein Leben Jahre hat. |
| Quellwasser | Talisman, Wasser | gewöhnlich, 1 Kerbe, 24 | `heil_nach_sieg` 2 | Benetzen: 1, Heilung 4, ziehe 1 | In einer Flasche mit einem Korken aus Wachs. Wer daraus trinkt, wird gesund und vergisst, wovon. |
| Wachsauge | Talisman, Licht | selten, 2 Kerben, 40 | `verwundbar_start` 1 (Hagel) | Angesehen werden: 0, Verwundbar 2, Funke | Man opfert es für ein geheiltes Auge. Es sieht in die Richtung, in die du gleich gehen wirst. |
| Docht der Erhörten | Talisman, Feuer + Glaube | Reliquie (Wächter), 2 Kerben, 90 | `brand_haelt` (Glutnest) | Erhört werden: 1, Brand 4, Heilung 2 | Ein Docht, der aus keiner Kerze mehr ragt. Er brennt, wenn du betest, und manchmal, wenn du es nicht tust. |

Fundpool: die vier eigenen (ohne Reliquie) und Schwarze Kerze, Weihwasser, Rosenkranz, Trauerschleier, Stockdegen (Krücke mit Klinge), Silberkreuz.

## Ereignisse (7)

| id | Szene | Bezug auf Früheres |
|---|---|---|
| `grotte_kruecken` | Die Krückenwand: eine Krücke mit deinem Namen, der Tag leer. Pilgerstab, Kerbe oder Karte streichen. | |
| `grotte_quelle` | Die Quelle, auf dem Grund Brillen, ein Hörrohr, ein Glasauge, das sich dreht. Heilen, abfüllen, Weihwasser hineingießen (Schleifen). | `if item: holywater` |
| `grotte_wachszieher` | Eine frisch gegossene Hand mit deiner Narbe. Handgriff lernen, Schleifen, heilen. | |
| `grotte_abgewandt` | Die Madonna hat kein Gesicht, nur eine glatt geriebene Fläche, und hinter dir ist das, was sie ansieht. Reliquie gegen max. Leben. Stummfilm (der einzige im Biom). | |
| `grotte_mehr` | Dreiundvierzig Wachshände, auf dem Rückweg vierundvierzig. Kampf, Kerbe, weitergehen. | |
| `grotte_stimme` | Aus dem Becken spricht die Stimme aus dem Brunnen in Saltmoor. | `if event_gesehen: alle_brunnen`, `if job: pfarrerin` |
| `grotte_tausch` | Die Kerzenfrau wiegt Gabe gegen Gabe. Item tauschen. | `if item: votivherz` |

## Prüfung

- `node tools/sprites/pruefen.js wachshand_a wachshand_b geheilter_a geheilter_b quellwaerter_a quellwaerter_b bittsteller_a bittsteller_b erhoerte`: 9 Sprites, 0 Verstöße. Der Wächter ist 128 × 160, weil `pruefen.js` heute höchstens 128 × 160 für Wächter erlaubt (das Paket-Format nennt bis 160 × 180).
- `node tools/biom-test.js grotte 10`: 6/10 Akte überstanden, 0 Fehler; Seeds 11–20: 7/10. Zum Vergleich zur selben Zeit Kapelle 8/10. Werte einmal gesenkt (vorher 4/10, nachdem der Kern die Balance geändert hatte).
- Bilder: `kontakt.png` (neben Chorknabe, Hirte, Netzflickerin), `animation.png`, `silhouetten.png`, `varianten.png` (V0, V1, V2, Wächter mit den echten Sprites), `varianten-leer.png`, `arten.png`, `fremdheit.png`, `im-spiel-kampf.png`, `im-spiel-waechter.png`, dazu Krämer, Ereignis, Rast im Spiel.

## Noten (Bewertungsbogen 06-ki-bilder.md Abschnitt 5)

Je Punkt 1–5: Silhouette / Licht / Pixel / Konzept / Biom / Im Spiel. Gesamt = schwächster Punkt.

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Wachshände | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Ein Strauch aus Händen ist sofort lesbar und einmalig; das Glimmen im Wachs ist zurückhaltend, die Votivaugen sind klein. |
| Der Geheilte | 4 | 4 | 4 | 4 | 4 | 4 | **4** | Mensch auf vier Stelzen mit Wirbelreihe liest sich klar; dass er geheilt wurde, erzählt vor allem das kleine Wachsbein und der Ort, nicht die Figur allein. |
| Der Quellwärter | 5 | 4 | 4 | 5 | 4 | 4 | **4** | Brunnenfigur mit Kelle, das falsche Detail (bis zur Hüfte in einer flachen Schale) sieht man sofort; Wasserfäden sind nur gelbes Randlicht. |
| Der Bittsteller | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Der Kerzenfächer trägt die Silhouette; der kniende Körper ist eher Masse mit Kapuze, Hände und Herz sind klein. |
| Die Erhörte (Wächter) | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Die Betende mit der Flammenspitze ist das stärkste Bild des Bioms; der Wachskörper ist dunkel wie Schiefer und wirkt nur über Kerzen, Zapfen und Herz wie Wachs. |
| Hintergrund V0 Kerzenwand | – | 4 | 4 | 4 | 4 | 4 | **4** | Kerzenwand, Krücken und Madonna stimmen, der Ort ist ohne Text klar; die Felsstufen lesen sich etwas wie ein Block, die Decke ist ruhig. |
| Hintergrund V1 Gang | – | 4 | 4 | 4 | 4 | 4 | **4** | Röhre aus Felsringen mit Kerzenreihen als Fluchtlinien trägt; die Wände sind dunkel, Gaben nur am nahen Ring. |
| Hintergrund V2 Grottenmund | – | 4 | 4 | 4 | 4 | 4 | **4** | Kaltes Meer gegen warme Höhle, Madonna im Mund ist ein starkes Bild; die untere Hälfte (Teich, Boden) ist leer. |
| Wächter-Szene | – | 4 | 4 | 5 | 4 | 4 | **4** | Riesige abgewandte Madonna über dem Kerzenberg, die Erhörte davor; die Madonna ist flächig, ihre Rillen sieht man kaum. |

Gesamturteil: Das Biom erreicht überall 4, nicht 5. Es ist dunkler als Kapelle und Salz, weil Schiefer dunkel ist. Die Figuren stehen durch die warme Höhlenwand dahinter. Am stärksten sind die Erhörte, der Quellwärter und die Kerzenwand.

## Offene Punkte für den Kern

- `heiler` heilt im Kern auch den Heiler selbst; laut Paket-Format heilt er Verbündete. Mit Selbstheilung kann ein einzelner Heiler gegen schwache Decks unendlich werden (Bot hing). Darum hier `schuetzer`.
- `nachlass` (Bittsteller) ist im Kern noch nicht umgesetzt; der Bittsteller kämpft bis dahin ohne Kniff.
- Ein Tausch-Krämer („Gabe gegen Gabe“) fehlt im Kern; bis dahin gibt es das Ereignis `grotte_tausch`.
- `pruefen.js` erlaubt Wächter nur bis 128 × 160, das Paket-Format bis 160 × 180.

## Zweiter Wächter: Der Ungeheilte (`ungeheilter`), 160 × 180

- **Idee:** Einer, der kam und nicht geheilt wurde. Er hat keine Beine mehr, nur zwei umwickelte Stümpfe, und er hat sich alle Krücken genommen, die die Geheilten an die Wand gehängt haben. **Das falsche Detail:** Für jede Krücke ist ihm ein Arm gewachsen, und um den Hals trägt er das Wachsherz, das er geopfert hat; es wurde nie angenommen und ist noch warm. **Silhouette:** ein hängender, gebeugter Rumpf mit tief hängendem Kopf zwischen sechs gespreizten Krücken wie eine Spinne auf Stelzen; in Phase 2 nur noch drei heile Krücken, er hängt tiefer und schief. **Unterschied zur Erhörten:** Sie ist eine aufrechte Betende mit Flamme über dem Kopf, er ein breites Gestell auf vielen dünnen Beinen; sie wächst und ruft Wachshände, er ruft niemanden, wandert zwischen den Reihen (`pendel`) und verteuert deine Karten.
- **Kniff:** `teurer 1` („Er nimmt dir die Stütze weg. Was du tun willst, wiegt einen Schritt mehr.“), dazu `pendel: true` (er schwingt jeden Zug zwischen links hinten und rechts vorn).
- **Besonderheit:** `phasen` bei 50 %: Krücken brechen (Sprite `ungeheilter_p2`), Schwachstelle wechselt von Feuer (die Krücken sind trockenes Holz) zu Glaube (jetzt, wo er fällt, betet er), Muster 9 × 3, 23, Stärke +2, 31.
- **Werte:** 138 Leben; Muster 16, 6 × 3, Block 20, 25. Stimme `salzlaeufer` (Klicken wie Krücken auf Stein). Beute `pilgerstab`. Zone `grotte_w2` (Körper Schiefer wie die Grotte, **Randlicht kalt** `#4e6a82`/`#b4cee2` wie das Nachtlicht aus dem Spalt, Augen Kerzenrot): Die Wächter-Szene ist ganz Kerzengold.
- **Sprite:** `tools/sprites/gegner/ungeheilter.js`, Varianten `ungeheilter`, `ungeheilter_p2`. Silhouetten-Probe `probe_vier` (vier Krücken, er hängt dazwischen) verworfen: in Schwarz ein Gestell mit Puppe, zu nah an den Stelzen des Geheilten; acht Krücken (erster Entwurf) waren ein Gitter, genommen sind sechs. Rumpf mit Wirbeln und Rippen, Stümpfe in Binden, unten Kerzenschein; inneres Licht: das Wachsherz. Angriff: Er hebt die vordere Krücke hoch über sich (2 Bilder) und schlägt sie nach links unten.
- **biom-test** (40 Seeds): Erhörte 20/20, **Ungeheilter 31/40 (78 %)**.

Bilder: im Spiel [grotte-ungeheilter.png](../bilder/Zugabe/waechter2/grotte-ungeheilter.png), Kontaktbogen aller zweiten Wächter von Akt II (Idle, Angriff ×2, Silhouetten) [bogen-a2.png](../bilder/Zugabe/waechter2/bogen-a2.png), Silhouetten gegen alle Sprites (eigene rot) [silhouetten-gegen-alle-a2.png](../bilder/Zugabe/waechter2/silhouetten-gegen-alle-a2.png). Phase 2 im Spiel: [grotte-ungeheilter-phase2.png](../bilder/Zugabe/waechter2/grotte-ungeheilter-phase2.png).

**Note** (Bewertungsbogen 06-ki-bilder.md Abschnitt 5; Silhouette, Licht, Pixel, Konzept, Biom, im Spiel):

| Bild | S | L | P | K | B | Sp | Gesamt | Begründung |
|---|---|---|---|---|---|---|---|---|
| Der Ungeheilte | 5 | 4 | 4 | 4 | 4 | 4 | **4** | Die Spinne aus Krücken ist die eigenständigste Silhouette des Bioms, das kalte Randlicht steht hart vor dem Kerzenberg, die gebrochenen Krücken in Phase 2 sind sofort zu sehen. Der Rumpf bleibt eine große dunkle Fläche, und dass es ein Mensch ohne Beine ist, liest man erst am hängenden Kopf und den Binden. |
