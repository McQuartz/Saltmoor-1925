# Gegner: Konzepte (M7)

Stand 2026-11-03. Grundlage: [00-briefing.md](00-briefing.md) Abschnitt 6, Steckbriefe in [04-welt-und-run.md](04-welt-und-run.md) Abschnitt 8, [zielbild.md](../spritegen/zielbild.md). Daten: `prototype/data/foes_m7.json`, Sprites: `prototype/assets/gegner/`, Weg: [sprites.md](sprites.md).

**Leitidee.** Je tiefer, desto weniger Mensch. Der Hafen und der Moorwald zeigen Menschen, die etwas wissen und schweigen. In der Kapelle sind sie verwandelt. Im Salz und in der Stadt warten Dinge, die älter sind als der Mensch und ihn nur nachahmen. Im Eis bleiben nur noch Nachahmer mit menschlichen Stimmen, und an der Pforte gibt es keine Form mehr. Jeder Gegner ist **fast menschlich und an genau einer Stelle falsch**. Diese Stelle trägt das Sprite, das Muster und die Schwachstelle.

**Gekürzt (Briefing: lieber wenige starke):**

- **Kultist** ist gestrichen und geht im **Ertrunkenen** auf. Es ist dieselbe Gemeinde, einen Schritt weiter. Eine Kutte mit Kiemen hätte nur einen schwächeren Ertrunkenen ergeben.
- **Schatten** ist gestrichen und geht in der **Windgestalt** auf. Beide wären „Schwebender im Wind“ gewesen, darum trägt der Wächter das Motiv allein.
- **Eisgesicht** ist gestrichen und geht im **Chor im Eis** auf. „Gesichter unter dem Eis“ ist genau der Wächter, ein zweites Mal davon würde ihn schwächen.

So bleiben Hafen, Moor und Salz mit drei Typen, Kapelle, Stadt und Eis mit zwei Typen, dazu je ein Wächter und an der Pforte der Boss mit seinen Augen.

**Schwachstellen über alle acht Stoffe:** Eisen 3 (Netzflickerin, Glockenmutter, Grabwächter), Feuer 3 (Nest, Bote, Rufer), Wasser 3 (Lotse, Salzläufer, Wurm), Salz 2 (Ertrunkener, Chor), Blut 3 (Schmuggler, Opfernde, Schlundträger), Glaube 2 (Chorknabe, Nachgeher), Licht 4 (Tiefling, Hirte, Windgestalt, Augen), Fäulnis 2 (Torfstecherin, Mumie). Wurm, Windgestalt und der Boss wechseln ihre Schwachstelle.

---

## Akt 1a · Hafenviertel (menschlich): Menschen, die etwas wissen und schweigen

### Netzflickerin (`netzflickerin`) · Favorit
- **Motiv:** das Ererbte. Ihre Mutter hat schon dieses Netz geflickt, und deren Mutter auch.
- **Wer sie war:** eine Fischersfrau, die jeden Abend am Kai das Netz flickt. Sie hat aufgehört, aufzustehen.
- **Was falsch ist:** Arme und Beine sind ein Glied zu lang. Darum knicken Ellbogen und Knie hart nach außen. Der Kopf hängt tiefer als die Schultern und sieht dich von unten an. Das Netz wird nie fertig.
- **Silhouette:** ein Buckel mit einem hängenden Kopf und zwei Spinnenarmen, die ein Netz halten.
- **Kampf (3 Züge):** Haken (2 × 3), Flicken (Block 5), Netz werfen (8). Sie arbeitet, verteidigt das Netz, dann wirft sie es.
- **Schwachstelle Eisen:** Eine Schere oder ein Messer zerschneidet das Netz, an dem sie hängt. Im Volksglauben ist Eisen ohnehin die Antwort auf das, was nicht ganz Mensch ist.
- **Stimme:** eine gezupfte, verstimmte Saite, die ein Netzmuster aus Pausen spielt.

### Tiefling (`tiefling`)
- **Motiv:** das Hybride, das Erbe aus dem Meer.
- **Wer er war:** ein junger Fischer aus einer alten Hafenfamilie. Der Großvater hatte dieselben Augen.
- **Was falsch ist:** Die Augen sind zu groß und stehen zu weit seitlich. Am Hals sitzen Kiemenfalten, die sich beim Atmen öffnen. Er steht etwas zu aufrecht, wie jemand, der das Stehen erst lernt.
- **Silhouette:** ein schmaler Fischer mit Mütze und zu breitem Kopf, die Hände bis zu den Knien.
- **Kampf (3 Züge):** Doppelstoß (2 × 4), Luft holen (Stärke +2), Biss (7).
- **Schwachstelle Licht:** Die Augen sind für die Tiefe gemacht, und eine Laterne blendet ihn.
- **Stimme:** tiefes, nasses Blech (gibt es schon).

### Schmuggler (`schmuggler`)
- **Motiv:** Wissen, das man nicht teilt.
- **Wer er war:** Er bringt nachts Kisten vom Wasser in die zugemauerten Lagerhäuser. Er weiß, was drin ist.
- **Was falsch ist:** Unter dem Mantel hat er einen Arm zu viel. Das Gesicht bleibt im Schatten der Hutkrempe, auch wenn seine Laterne direkt darunter hängt.
- **Silhouette:** ein Mann mit Hut und langem Mantel, eine Laterne in der ausgestreckten Hand, der Mantel ausgebeult.
- **Kampf (3 Züge):** Schlag (6), dritter Arm (3 × 3), Deckung (Block 6).
- **Schwachstelle Blut:** Er ist der menschlichste Gegner im Spiel. Wer blutet, merkt, dass er sterblich ist.
- **Stimme:** ein gepfiffenes Motiv, das immer an derselben Stelle abbricht.

### Wächter: Der Lotse (`lotse`)
- **Motiv:** das Meer als etwas Älteres. Der Lotse bringt nichts mehr in den Hafen, er holt etwas heraus.
- **Wer er war:** der Hafenlotse, der jedes Schiff sicher hereinbrachte. Sein Leuchtturm streicht heute landeinwärts.
- **Was falsch ist:** Er ist viel zu hoch. Auf den Schultern sitzt statt eines Kopfes ein Laternengehäuse, und darin atmet etwas.
- **Silhouette:** ein sehr hoher Mann im Ölzeug mit einer Laterne als Kopf, ein Stab mit Haken.
- **Kampf (5 Züge):** Ölzeug (Block 10), Haken (9), Kette (3 × 4), das Licht wird heller (Stärke +3), Stoß (14). **Besonderheit:** Alle 3 Züge ruft er einen Tiefling herbei, so wie er früher Boote hereinwinkte.
- **Schwachstelle Wasser:** Wasser im Laternengehäuse erstickt, was darin atmet.
- **Stimme:** Blech eine Oktave tiefer und gedoppelt, dazu eine ferne Glocke.

## Akt 1b · Moorwald (menschlich): Volksglaube, Jahrhunderte alt

### Hirte (`hirte`) · Favorit
- **Motiv:** unermessliche Zeit. Er hütet die Sterne über dem Steinkreis, seit es den Steinkreis gibt.
- **Wer er war:** ein Schäfer, der in einer Nacht zu lange in den Himmel sah.
- **Was falsch ist:** Sein Gesicht ist ein Sternbild aus Lichtpunkten, und es ist eines, das es nicht gibt. Aus dem Kopf wächst ein Geweih mit leuchtenden Knoten. Seine Finger sind so lang wie ein Hirtenstab.
- **Silhouette:** ein hoher, zerfetzter Mantel, ein spitzer Kopf mit Geweih und lange Finger, die bis zu den Knien hängen.
- **Kampf (3 Züge):** Sterne ordnen (Stärke +2), Fingerstreich (2 × 5), Treiben (9).
- **Schwachstelle Licht:** Unter echtem Licht verblassen falsche Sterne.
- **Stimme:** eine hohle Holzflöte, die Quinten über dem Grundton spielt.

### Torfstecherin (`torfstecherin`)
- **Motiv:** das Ererbte und die Zeit. Das Moor bewahrt, was hineinfällt.
- **Wer sie war:** eine Frau, die Torf sticht und dabei immer tiefer gräbt, bis sie sich selbst findet.
- **Was falsch ist:** Wo sie den Boden berührt hat, ist ihre Haut zu Rinde geworden: an Händen, Knien und dem halben Gesicht. Der Spaten ist mit der Hand verwachsen.
- **Silhouette:** eine gebückte Frau mit Kopftuch und einem langen Spaten, der aus dem Arm wächst.
- **Kampf (3 Züge):** Stich (7), Rinde (Block 8), tiefer Stich (10).
- **Schwachstelle Fäulnis:** Das Moor hat sie konserviert, und Fäulnis holt nach, was die Zeit versäumt hat.
- **Stimme:** sehr tiefes Summen.

### Das Nest (`nest`)
- **Motiv:** falsche Geometrie. Ein Hügel ist kein Tier, bis er aufsteht.
- **Was es war:** ein Erdhügel am Bohlenweg, um den man im Dorf einen Bogen macht.
- **Was falsch ist:** Es liest sich als Hügel mit Gras und Wurzeln. Dann stehen acht kantige Insektenbeine auf, und vorne öffnet sich eine Reihe **menschlicher** Zähne. Die Augen blinzeln nacheinander, nie gleichzeitig.
- **Silhouette:** ein runder Buckel auf vielen dünnen, geknickten Beinen.
- **Kampf (3 Züge):** stillliegen (Block 6), Beine (3 × 3), Biss (8).
- **Schwachstelle Feuer:** Ein Nest brennt.
- **Stimme:** schnarrendes Insektenzirpen auf Tonhöhe.

### Wächter: Der Opfernde (`opfernde`)
- **Motiv:** Wissen, das den Verstand kostet. Der Altar weiß, was man ihm gibt.
- **Was er war:** ein Opferstein aus dem Steinkreis. Man hat ihm so lange gegeben, dass ihm ein Arm gewachsen ist.
- **Was falsch ist:** Ein Haufen kantiger Steine mit einer Kerbe, aus der ein langer, menschlicher Arm wächst. Der Arm ist zu lang und zu sauber für einen Stein.
- **Silhouette:** ein Steinhaufen mit einem einzelnen, langen Arm, der nach vorne greift.
- **Kampf (4 Züge):** Stein (Block 12), Greifen (2 × 6), Opfer annehmen (Stärke +3), Zerschmettern (15). **Besonderheit:** Alle 4 Züge kriecht ein Nest aus der Kerbe.
- **Schwachstelle Blut:** Er ist ein Altar. Blut gibt ihm, was er will, und was satt ist, greift nicht mehr.
- **Stimme:** Summen der Torfstecherin eine Oktave tiefer, gedoppelt, dazu Holz auf Stein.

## Akt 2 · Überflutete Kapelle (verwandelt): ein Kult, der dem Ruf vor dir gefolgt ist

### Chorknabe (`chorknabe`) · Favorit
- **Motiv:** das Hybride, aus drei mach eins.
- **Wer sie waren:** drei Knaben aus dem Kirchenchor. Sie haben das neue Lied zu oft gesungen.
- **Was falsch ist:** Drei Köpfe sitzen übereinander auf einem Hals und in einer Robe. Sie singen nacheinander, nie gleichzeitig. Die Kerzen am Saum brennen auch unter Wasser.
- **Silhouette:** ein Kegel aus Stoff mit drei gestapelten Kugeln, unten ein Kranz aus Kerzen.
- **Kampf (3 Züge):** Anstimmen (Stärke +2), Dreiklang (2 × 4), Choral (8).
- **Schwachstelle Glaube:** Sie singen ein Kirchenlied mit falschem Text. Echter Glaube singt dagegen, und drei Stimmen, die eins sein müssen, fallen auseinander.
- **Stimme:** hoher Knabenchor auf „oh“.

### Ertrunkener (`ertrunkener`)
- **Motiv:** das Meer als etwas Älteres. Er ist nicht ertrunken, er hat umgelernt.
- **Wer er war:** ein Gemeindemitglied, das in der Kutte in das Wasser der Kapelle stieg und nicht wieder auftauchte, bis jetzt.
- **Was falsch ist:** Er ist still, nicht eklig. Wasser läuft ihm ohne Ende aus dem Mund, mehr als in einen Menschen passt. An Hals und Wangen hat er Kiemenschlitze.
- **Silhouette:** eine schwere, hängende Kutte mit gesenktem Kopf und einem dünnen Strahl unter dem Kinn.
- **Kampf (4 Züge):** Wasser steigt (Stärke +2), Umklammern (5), Kutte (Block 6), Hinabziehen (7).
- **Schwachstelle Salz:** Salz zieht das Wasser aus ihm.
- **Stimme:** gurgelnde Stimme (gibt es), dazu ein gedämpfter Männerchor (vom Kultisten übernommen).

### Wächter: Die Glockenmutter (`glockenmutter`)
- **Motiv:** Wissen, das den Verstand kostet. Wer die Glocke hört, versteht etwas.
- **Wer sie war:** die Küsterin, die die Glocke läutete, bis die Glocke sie läutete.
- **Was falsch ist:** Auf zwei langen Beinen sitzt ein Körper, dessen Kopf eine Glocke ist. Wenn sie angreift, läutet die Glocke, aber ein Klöppel ist nicht zu sehen.
- **Silhouette:** eine schmale Gestalt im Kleid mit einer großen Glocke als Kopf und dünnen Armen.
- **Kampf (5 Züge):** Schlag (8), Kleid (Block 10), Läuten (4 × 3), Nachhall (Stärke +3), Glockenschlag (13). **Besonderheit:** Alle 3 Züge ruft das Läuten einen Chorknaben herbei.
- **Schwachstelle Eisen:** Gib ihr einen Klöppel aus Eisen, und die Glocke zerspringt.
- **Stimme:** Knabenchor eine Oktave tiefer und gedoppelt, dazu eine Glocke ohne Anschlag (nur Nachhall).

## Akt 3a · Salzstollen (Nachahmer und Fremdes): Römerzeit und Vorzeit

### Schlundträger (`schlundtraeger`)
- **Motiv:** das Hybride. Was als Mensch begann, hat einen Mund bekommen, der nicht ihm gehört.
- **Wer er war:** ein Bergmann, der in einer Salzblase etwas Weiches fand.
- **Was falsch ist:** Der Kopf ist senkrecht aufgeplatzt, und aus dem Spalt hängen Tentakel bis zum Boden. An den Rändern sitzen Zahnreihen, auf jeder Hälfte zwei kleine Augen.
- **Silhouette:** eine gebeugte Gestalt mit zwei Kopfhälften und einem Vorhang aus Fäden darunter.
- **Kampf (3 Züge):** Peitschen (6), Spalt öffnet sich (Stärke +3), Fassen (3 × 4).
- **Schwachstelle Blut:** Blut lockt den Spalt auf, und offen ist er verwundbar.
- **Stimme:** Kehlgesang.

### Salzläufer (`salzlaeufer`)
- **Motiv:** unermessliche Zeit. Seine Art hat nie Licht gesehen.
- **Was er ist:** ein blindes Tier aus der Tiefe, weiß verkrustet, so alt wie die Schicht, in der es lebt.
- **Was falsch ist:** Es hat keine Augen, nur zu viele Fühler, die tasten. Die Kruste auf dem Rücken hat die Form eines Gesichts.
- **Silhouette:** ein flacher Panzer auf vielen Beinen mit einem Fächer langer Fühler nach vorne.
- **Kampf (3 Züge):** Tasten (2 × 3), Kruste (Block 5), Hetzen (3 × 3).
- **Schwachstelle Wasser:** Wasser löst die Kruste.
- **Stimme:** Klicken auf Tonhöhe.

### Grabwächter (`grabwaechter`)
- **Motiv:** unermessliche Zeit. Er bewacht ein Grab, dessen Toter längst gegangen ist.
- **Wer er war:** ein römischer Legionär, den man im Salz begraben hat, damit er Wache hält. Er tut es noch.
- **Was falsch ist:** Der Helm ist mit dem Schädel verwachsen. Sein Gesicht ist das Gesicht des Helms, und darin stecken zwei glühende Punkte.
- **Silhouette:** ein steifer Soldat mit Helmkamm, Schild und Speer, die Schultern salzverkrustet.
- **Kampf (3 Züge):** Schild (Block 10), Speer (9), Stoß (6).
- **Schwachstelle Eisen:** Eisen auf Eisen hallt bis in den verwachsenen Schädel.
- **Stimme:** Horn aus Knochen.

### Wächter: Der Wurm im Salz (`wurm`)
- **Motiv:** falsche Geometrie und Zeit. Der Wurm ist länger als der Stollen.
- **Was er ist:** Er hat die Stollen gegraben, lange bevor jemand Salz brauchte.
- **Was falsch ist:** Man sieht nur ein Stück von ihm. Er kommt aus der Wand und geht in den Boden, und beide Enden sind nie gleichzeitig zu sehen. Sein Maul ist ein Kranz aus Salzzähnen.
- **Silhouette:** ein dicker, gekrümmter Bogen aus Ringen mit einem runden Maul.
- **Kampf (5 Züge):** Rammen (10), Eingraben (Block 12), Mahlen (3 × 5), Häuten (Stärke +3), Verschlingen (16). **Besonderheit:** Die Schwachstelle wechselt jeden Zug zwischen Wasser, Feuer und Fäulnis, je nachdem, aus welcher Schicht er gerade kommt.
- **Schwachstelle Wasser (Start):** Wo er gerade herkommt, ist er weich.
- **Stimme:** Kehlgesang eine Oktave tiefer und gedoppelt, dazu Salz, das knistert.

## Akt 3b · Namenlose Stadt (Nachahmer und Fremdes): vor dem Menschen

### Bote (`bote`)
- **Motiv:** Wissen, das den Verstand kostet. Er bringt die Nachricht, und die Nachricht ist er.
- **Wer er war:** ein Postbote aus Saltmoor, der Briefe nach unten trug. Unten hat man ihm geantwortet.
- **Was falsch ist:** Quer durch die Brust läuft ein senkrechter Mund, der sich langsam öffnet. Den Hut trägt er auf einem Hals, den es nicht gibt, denn statt des Halses sitzt dort eine Reihe von Augen.
- **Silhouette:** ein Hut auf einer dünnen Säule über einem offenen Mantel mit einer Posttasche.
- **Kampf (3 Züge):** Zustellen (7), der Mund öffnet sich (Stärke +2), Briefe (3 × 4).
- **Schwachstelle Feuer:** Briefe brennen, und die Nachricht, die ihn zusammenhält, mit ihnen.
- **Stimme:** Röhren mit Echo.

### Erbauer-Mumie (`mumie`)
- **Motiv:** falsche Geometrie. Die Erbauer gingen nicht aufrecht.
- **Was sie war:** einer der Erbauer der Stadt, in Binden gelegt in einer Zeit, als es noch keine Menschen gab.
- **Was falsch ist:** Sie kriecht auf zu vielen Gelenken, flach wie die Gänge der Stadt. Ihr Gesicht ist kein Gesicht, sondern ein Relief, und es zeigt dich.
- **Silhouette:** ein lang gestreckter, flacher Körper auf vielen spitzen Gliedern mit einem schildförmigen Kopf.
- **Kampf (3 Züge):** Glieder (3 × 3), Binden (Block 7), Zustoßen (10).
- **Schwachstelle Fäulnis:** Die Binden sind seit Äonen trocken. Fäulnis frisst, was die Zeit nicht geschafft hat.
- **Stimme:** tiefe Rahmentrommel auf Tonhöhe.

### Wächter: Der Wind, der Gestalt hat (`windgestalt`)
- **Motiv:** das Meer als etwas Älteres, hier als Atem aus dem Abgrund. Der Wind weht nach oben.
- **Was er ist:** Sand, Stofffetzen und der Atem von etwas tief unten, zu einer Säule gedreht.
- **Was falsch ist:** Ein Augenpaar wandert durch die Säule und ist nie an derselben Stelle. Der Sand fällt nach oben.
- **Silhouette:** eine nach oben breiter werdende, gedrehte Säule mit flatternden Fetzen.
- **Kampf (4 Züge):** Sandsturm (3 × 4), Verwehen (Block 10), Böe (11), Atem holen (Stärke +3). **Besonderheit:** Die Schwachstelle wandert mit den Augen und wechselt jeden Zug zwischen Licht, Wasser und Salz.
- **Schwachstelle Licht (Start):** Wo die Augen gerade sind, ist er verletzlich.
- **Stimme:** Flüstern (vom Schatten übernommen) mit Röhren-Echo, tiefer und gedoppelt.

## Akt 4 · Schwarzes Eis (Nachahmer): vor dem Leben an Land

### Rufer (`rufer`)
- **Motiv:** das Hybride als Nachahmung. Es hat gelernt, wie ein Mensch zu klingen.
- **Was er ist:** etwas aus dem Eis, das Menschen nachahmt, die hier unten erfroren sind.
- **Was falsch ist:** Er sieht fast aus wie ein Mensch, aber der Hals ist zu lang und der Kopf zu klein. Der Mund steht immer offen, auch wenn er nicht ruft.
- **Silhouette:** ein dünner Mensch mit überlangem Hals und einem winzigen Kopf mit offenem Mund.
- **Kampf (3 Züge):** Rufen (Stärke +3, er ruft deinen Namen), Schlag (6), Zuschnappen (9).
- **Schwachstelle Feuer:** Er ahmt Wärme nur nach, und echte Wärme lässt seine Stimme reißen.
- **Stimme:** menschliche Formanten ohne Worte, hoch.

### Nachgeher (`nachgeher`)
- **Motiv:** Nachahmung. Er geht hinter dir her und macht deine Bewegungen nach, nur falsch.
- **Was er ist:** Er hat einen Menschen beobachtet, sehr lange.
- **Was falsch ist:** Er bewegt sich in den Posen eines Menschen, aber auf allen vieren. Die Knie zeigen nach hinten, und der Kopf ist um 180 Grad gedreht.
- **Silhouette:** eine Brücke aus Gliedern, rückwärts gebogen, mit einem hängenden Kopf.
- **Kampf (3 Züge):** Nachäffen (2 × 5), Erstarren (Block 6), Anspringen (8).
- **Schwachstelle Glaube:** Wer betet, zwingt ihn mitzubeten, und das hält er nicht aus.
- **Stimme:** menschliche Formanten ohne Worte, tief.

### Wächter: Der Chor im Eis (`chor`)
- **Motiv:** Wissen, das den Verstand kostet. Sie haben die Antwort gehört.
- **Was er ist:** viele Köpfe von Menschen, die bis hierher gekommen sind, eingefroren in einem Klumpen Eis. Sie atmen gemeinsam.
- **Was falsch ist:** Sie leben. Die Münder öffnen sich gleichzeitig. Zwischen ihnen ist Eis, das sich beim Atmen hebt und senkt.
- **Silhouette:** ein schiefer Eisklumpen voller runder Köpfe mit Zacken obenauf.
- **Kampf (5 Züge):** Einatmen (Stärke +3), Klagen (2 × 7), Eis (Block 14), Durcheinander (3 × 6), Ausatmen (18). **Besonderheit:** Alle 3 Züge löst sich ein Rufer aus dem Chor.
- **Schwachstelle Salz:** Salz taut das Eis um die Köpfe, und der Chor fällt auseinander.
- **Stimme:** alle Formanten des Bioms gleichzeitig, eine Oktave tiefer.

## Akt 5 · Die Pforte (formlos): außerhalb der Zeit

### Boss: Das, was ruft (`ruft`, Phasen `ruft_p1`, `ruft_p2`, `ruft_p3`)
- **Motiv:** alles zusammen, und das Meer als etwas Älteres. Es ist der Ruf, dem alle gefolgt sind.
- **Was es ist:** keine Figur, sondern eine Öffnung, die gelernt hat, Formen anzunehmen, um verstanden zu werden. Jede Phase ist ein schlechterer Versuch, menschlich auszusehen.
- **Was falsch ist:**
  - **Phase 1:** Es trägt die Gestalt eines **Königs**, hoch, mit Krone und Mantel. Unter der Krone ist kein Gesicht, nur ein Auge.
  - **Phase 2:** Der Mantel reißt auf. Die Gestalt ist ein **Schlund**, ein Spalt von oben bis unten mit Zahnreihen, und die Krone schwebt darüber.
  - **Phase 3:** Ohne Form ist nur noch ein **Auge** übrig, umringt von Randlicht-Bögen, das zwischen Türkis und Magenta wandert.
- **Silhouette:** P1 ein hoher König, P2 ein senkrechter Spalt mit Krone, P3 ein Ring aus Bögen um ein Auge.
- **Kampf:** Phasen bei 66 % und 33 % Leben, jede mit eigenem Muster (siehe `foes_m7.json`). **Besonderheit:** Alle 3 Züge ruft es zwei Augen im Rand.
- **Schwachstelle:** P1 Salz (der Strand, das Ufer), P2 Glaube, P3 Fäulnis (es ist zeitlos, und Fäulnis ist Zeit).
- **Stimme:** Nebelhorn (gibt es), ab Phase 3 mit Duell-Regel.

### Augen im Rand (`augen`)
- **Motiv:** Wissen, das den Verstand kostet. Du wirst gesehen.
- **Was sie sind:** Augen ohne Körper, mit einem Lid aus Randlicht und dünnen Fäden darunter.
- **Silhouette:** ein schwebendes Auge mit drei hängenden Fäden.
- **Kampf (2 Züge):** Blick (3), Zwinkern (2 × 2).
- **Schwachstelle Licht:** Licht blendet.
- **Stimme:** ein hohes Glas-Sirren über dem Nebelhorn.
