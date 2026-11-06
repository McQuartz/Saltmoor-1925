# Philips Worte (wörtlich)

Philip (Ace, GitHub `McQuartz`) hat am 2026-11-06 den Stand von Auftrag 2 gespielt und in zwei Besprechungen entschieden, wie es weitergeht. Das hier ist die Absicht hinter allem in diesem Ordner. Gesprochen per Spracheingabe, darum klein geschrieben, mit Tippfehlern und Transkriptionsfehlern („Insmith“ = Innsmouth, „Zans Takt“ = Zanns Takt, „Gradbeigabe“ = Grabbeigabe, „Lieber Eck“ = Über Eck). Gemeint ist der Sinn, nie der Buchstabe.

Antworten der Agenten stehen nur dort, wo sie zum Verständnis nötig sind, und sind als solche markiert.

---

## Der Auftrag zu diesem Plan

> Okay, dann machen wir das so. Genau, merge das erstmal. Genau, dann die beiden Threads. So, dass da halt genau ein Plan daraus entsteht. In dem beide die Ergebnisse beider Threads umgesetzt werden zu einem geilen Spiel. Also zu einem geilen weiteren Prototypen. Und auch so formuliert, dass das irgendwie natürlich dann anhand des Plans sauber umgesetzt wird, ohne Shortcuts zu nehmen. Dass Opus auf Mittel dirigiert und dass der Sonnet und Haiku Agent spawnen kann, um das sinnvoll umzusetzen. […] Genau, und den Plan natürlich wie ich meinte strukturiert, sauber.

---

## Teil 1: Feedback zu Mos Stand (Auftrag 2)

### Das Feedback

> so aktuelle version hier meine gedanken:
>
> fragmentwände sind immer leer, ist das mechanik? keine neuen charaktere freischaltbar
> -> ist auch nicht der geilste weg um charaktere freizuschalten
> roadmap?
> sachen verdecken einander, zb lebensbalken mit karten und gegnern
> stoffrad unten links eig guter ansatz, aber nicht intuitiv lesbar
> eigener block nicht gut lesbar
> incoming damage aktualisiert bisschen zu spät, der wird nach schaden nehmen noch angezeigt bis nächste runde losgeht
> progression der rewards ist eig je weiter hinten desto stärker UND teurer sind die karten, ggf dem kartendesign geschuldet
> mechanics alle eig gut, aber werkbank zb immer karte 1 günstiger machen da way to go weil übel stark -> abwechslung im gameplay?
> item 1 slot mehr geben stark, dann karte rein, dann ggf später neues item wenn stärkeres oder besseres kommt, dann wieder karten rein -> abwechslung im gameplay?
> die sprüche und texte größtenteils geil, die sollen später manuell von mo und mir angepasst werden, notier das, da nichts dran ändern, die sind geil
> verringerter schaden muss links nicht durchgestrichen den originalschaden haben
> unter dem was übrig ist liegt etwas, den satz mit mehr variationen der steht da immer
> brainstormen wie kampf aussehen kann noch, wie jetzt, links rechts wär slay the spire, gibts da noch alternativen oder geile darstellungen
> kämpfe geben
> irgendwie vermisst man immer noch das gefühl dass sich ein deck aufbaut, man guckt eig nur welche starke karte kann ich auf welches starke item packen, der gameplay loop ist nicht so flowy
> bosse können unverwundbar werden, wenns aber kein anderen gegner gibt kann man einfach nur skippen, das fühlt sich nicht nach gutem kampf an, oder können statuseffekte applied werden? trotzdem net ideal
> unter lebensleiste x kommen -> -x leben muss da nicht hin bzw sollte aus dem spiel gelesen werden können
> itemleiste und rucksack fühlt sich noch nach prototyp an, da auch besprechen und gucken wie das aussehen könnte auf stimmig und ui
> kann man einbauen evtl, dass man leicht 3d simuliert, indem sich auf den die kamera ganz leicht mit abständen bewegt, also mal nach links, links vorne, zurück usw geht und sich die perpektive vom hintergrund dementsprechend bewegt
> am ende kampf gegen einen der alten götter, ohne chance, a la herz in slay the spire, vllt 3 verschiedene
> und dann als endgoal auf ng+5 oder 10 oder so kann man den vllt doch töten
> karten mit reaktion die karten ziehen oder so, alles was kein schaden macht, wird glaub net verstärkt, also net wie erwartet zb 2 karten ziehen
> man sieht sein gold net intuitiv, steht oben links bisschen versteckt. ist jetzt kein problem nur von dem gold, sondern generell von der ui
> also wenn man mehr slots freischaltet, dann ein item was in kombo passt bekommt und dann ne karte für das item bekommt fühlt sich das nach deck progression an, würde das jetzt nicht alleine als mechanik ausbauen für deck progression aber ist wichtig zu notieren
>
> lass einmal besprechen was wir als erstes umsetzen und was als zweites bzw was notiert wird für später, sowas wie 3 alte götter, das muss jetzt ja nicht sein

### Antworten auf die Rückfragen

*(Gefragt war: 1 neue Fragment-Texte für die neuen Biome oder Wand weglassen, 2 was „Roadmap“ heißt, 3 Bosse Panzer oder unverwundbar nur mit Dienern, 4 was „kämpfe geben …“ heißen sollte.)*

> 1 ne mach die rein wenns die gibt warum weglassen 2 so dass man weiß wo man hingeht, slay the spire macht das halt sehr gut aber man will natürlich net da eig sachen kopieren das ist so der größte big player in roguelike deck builder 3 gute frage erstmal beides, panzer wenn alleine unverwundbar wenn diener da 4 glaub sowas wie kämpfe geben nur gold aber war mir da nicht sicher, ging so um das gefühl ob sich kömpfe rewarding anfühlen im vergleich zu ereignissen, aber kann mich grad ehrlich gesagt garnicht erinnern ob die nur gold oder auuch items und so geben

### Kampf-HUD Runde A (A Klartext, B Stoffrad erklärt, C Kopfleiste und Schwelle)

> Okay, nehmen wir unten links das Stoffrad. Also das Rad ist eigentlich schon cool. Aber es ist halt, keine Ahnung, es sieht dann auch wieder ein bisschen überfordernd und unübersichtlich aus. Deswegen scheiß drauf. Was gut, readable ist, ist A. Aber es sieht nicht geil aus. So ein bisschen geiler finde ich C. Ich würde sagen, vielleicht kann man aus dieser Kette so ein Tree machen, dass man irgendwie dass das Ding sich so mit aktualisiert irgendwie, wenn man was spielt. Und dass man so aus diesem Tree sieht, welche Elemente kann man danach spielen. Und dass dieser Tree sich unten links in dem Bereich halt so je nachdem, was man spielt, dass das so mitrückt, so diesen Pfad, diesen Tree-Pfad lang. Und dann sieht man auch, wenn man in einer Sackgasse ist, von den Elementen, irgendwie Optionen hat, dies, das, vielleicht könnte man das nochmal ausprobieren. Ansonsten, was auf dem was auf allen Dingern hier passiert, ist, dass die Gegner auf dem Hintergrund nicht so richtig sinnvoll platziert sind, weil der eine so halb im Abgrund hängt, aber das liegt wahrscheinlich am Hintergrund, das ist jetzt nicht so wild. […] Richtig, auch wenn hier nicht sicher weiß, steht 18 Leben, minus 5 Block. Und man selber hat 5 Block. Ist irgendwie nicht so richtig lesbar. Also, dass man in seinem eigenen Balken auch einfach sieht, man hat jetzt Block und nicht nur links daneben. Dass man da auch irgendwie so blaue Ding hat. Blaue Lebensleiste. Ansonsten bei den Karten unten. Bei C ist am besten, dass Dampf unten an der Karte dann dran steht. […] Ich sehe jetzt gerade, man ist in einem Tunnel. Der Gegner hängt nicht über dem Abgrund, der steht im Tunnel. Also der ist so, der überlappt mit der Wand. […] Ansonsten der schwarze Hintergrund unten, den ich gerade meinte, der sieht auf jeden Fall ein bisschen langweilig aus. […] Und die Schrift, also die fünf mal zwei, acht Schaden, das fügt sich jetzt nicht mehr so geil ein, das, was über den Gegnern steht.

### Kampf-HUD Runde A2 (1 Kante, 2 Balken beim Baum, 3 ohne Band)

> variante 2 ist am stimmigsten, Das Spacing ist so ein bisschen off. Also der Header passt erstmal. Also 7, das Goldzeichen und die 37 ist vielleicht ein bisschen groß. […] Wenn wir jetzt in der Mitte ist das Spiel, das ist so die Mitte, und unten ist der Footer. […] Und der Lebensbalken ist relativ nah am Footer. Dann ist der Abstand nach links und nach rechts ungleichmäßig, also zum linken Rand und zu den Karten. Und darunter ist dann dieser Tree, der wird halt auch in seiner, also da wird die Fläche auch so halb genutzt. […] Aber an und für sich ist die Version erstmal cool. Genau, außer die Intention vom Gegner. Die sieht bei Variante 1 so ein bisschen besser aus. […] bei Variante 1 ist die Intention mit wie viel Schaden und Attacke ist besser lesbar, einfach weil das so ein Kasten ist, aber passt jetzt nicht mehr zum Lebensbalken und zu dem Leben, also zu den Zahlen vom Gegner. Dass das irgendwie auch nochmal stimmig in 1 gepackt wird.

### HUD A3 und Kampfdarstellung Runde C

> Hat überarbeitet, also eigentlich so wie die Gegner vorher, platziert waren, und C2 um umzingelt, obwohl die beiden vorne relativ nah sind. Ja, und dann, also die sind auf jeden Fall zu nah und zu weit am Rand. Ich weiß, das ist für das Umzingelt-Ding da, aber dann muss man halt auch so voll weit nach links und rechts den Cursor bewegen. Und bei Kamera ist jetzt halt permanent Bewegung drin. […]

### Kamera und Karte

> Nee, Kamera ist eigentlich nicht, was ich meine. Lass das erstmal wieder rausnehmen, muss auch nicht mehr eingeblendet werden können danach. Aber die Animation, also von Standard, wie es ist, und dann, dass man so nach vorne reingeht, kann man nehmen, wenn man ausgewählt hat, wo man hingehen möchte, dass man so auf den, man geht jetzt weiter. Muss natürlich zu den Hintergründen passen. Hier ist es halt mit Flucht nach vorne. Da will man nach vorne gehen. Wenn man jetzt auf eine Wand guckt, will man natürlich nicht auf den in die Wand reingehen. Das kommt komisch. Dann vielleicht so das angedeutet ist, die Kamera dreht sich und man geht so nach schräg links oder rechts weg. Auf den, ja. Aber bei den meisten, dass man immer so Richtung da geht, wo es halt eigentlich weitergehen würde in den Bildern. Und was vorhin noch war, alles, sind alle Gedanken, was ich hatte abgearbeitet mit Roadmap, meinte ich eine Karte, dass man weiß, wo lang man geht, weil man klickt immer nur eins von drei Dingern an. Das ist jetzt nicht schlecht, aber es fühlt sich nicht so geil an wie ein Slay the Spire zum Beispiel, die Map. Vielleicht hat man da ja noch Varianten. Ja, halt wirklich so Pfade mit Entscheidungen und Konsequenzen zu haben.

*(Karte Runde 1: A Grubenriss, B Peilkarte im Nebel, C Pinnwand.)*

> Machen wir vielleicht auf den Variante B ist am geilsten wegen dem Nebel, auch wie man aufdeckt. Und man sieht halt nicht durch den Nebel, auf den da ist eingestürzt. So, das wird dann erst danach offenbart. Und kriegt man das vielleicht ein bisschen mehr in der Optik vom Spiel hin? Jetzt nicht so pixelig wie, aber also schon Pixel-Optik, aber nicht so pixelig, wie das Spiel selbst […]

> nicht gröber

*(Strudel-Varianten gezeigt.)*

> Nee, okay, lass einfach aus der Variante davor nehmen, wie ich meinte.

### Itemleiste und Rucksack Runde B (A Der Tisch, B Am Körper, C Etuis)

> b aber die figur sieht net so geil aus

> Figur ist deutlich besser. Und der Rest, also auch so wie das hier aussieht, ist alles cool. Die Figur aber ein bisschen mehr als Silhouette irgendwie. Das hier ist jetzt so ein 3D-Ding. Ja, eher so ein bisschen Richtung Silhouette, vernebelt, schattig, bisschen mehr monochrom auf den. Und die Bereiche zum Ausrüsten der Items sind jetzt halt jeweils, also es sind so 3 Quadrate, gerade war es irgendwie ein bisschen abwechslungsreicher.

> geil das sieht heftig aus. dann noch einmal deck progression noch klären. […] Man muss jetzt halt nur aufpassen, dass man nicht irgendwie für Deck-Progression das eine baut und dann für Lovecraft-Vibe und so das andere baut und dass das dann viel zu viel wird. […] Vielleicht braucht man da auch gar nicht mehr. […] Aber bis hier, alles, was in dem Thread bis hier passiert ist, bitte so erstmal merken, weil das ist geil, dass wir das danach dann so in Auftrag geben können.

### Deck-Progression ausgeklammert

> Ja, nee, dann lass das erstmal ausklammern, weil das andere ist noch gar nicht getestet. […]

*(„Das andere“ sind die Lovecraft-Kernsysteme. Der Vorschlag „Handschrift“ ist darum NICHT Teil dieses Auftrags.)*

---

## Teil 2: Lovecraft als Mechanik-Quelle

### Der Anstoß

> nochmal hier besprechen oder in neuem thread, lovecraft sollte eigentlich Relativ gut irgendwie geile neue Angles für Mechaniken oder so geben. Hier vorher war ja mal das Ding mit dem Sog im Gespräch. Und was ich ganz geil finde, ist so dieses implizierte Ding, weil man immer tiefer geht und man weiß gar nicht warum. Also in dem Fall, weil man das Spiel zocken will. Und weil es auch so intriguing ist. Aber dass das irgendwie so eine Metaebene hat. […] Weil man bei Lovecraft-Spielen und so Thematiken ganz oft denkt, ah ja, ein Wahnsinnsmeter. Toll. Das ist halt irgendwie nicht so besonders kreativ. Und ich glaube, es gibt mehr her.

### Feedback zur ersten Fassung (daraus entstand V2)

> top analyse, Lovecrafts Prinzipien als Designregeln sind extrem geil. befürchtung ist, dass debuffs als (core)konzept nicht bocken, veränderunug kann ich mir aber gut vorstellen, klingt auch nach abwechslung im gameplay
>
> Ich gehe das einfach mal durch. Barmherzige Trennung. Kann ich mir nicht so richtig was drunter vorstellen. Klingt irgendwie ganz nett, weiß ich nicht genau. Wissen engt ein. Fühlt sich halt nach so einem Debuff an. Ich weiß nicht, wie viel Spaß das macht. Lesen in Raten. Ja, klingt so ein bisschen, als ob einem das in so sein Deck reingrätscht eher. Sehen und gesehen werden finde ich zum Beispiel geil, weil das einfach Gameplay ändert. Lügender Kartentext finde ich eigentlich auch geil. Da muss man halt aufpassen, dass das nicht... Es macht halt schwierig, einen Run kontrolliert zu spielen. Ich mag, dass man halt irgendwie so wahnsinnig wird, aber bei einem Deckbuilder mit permanenten Folgen für den Run ist das vielleicht, fühlt sich das nicht so geil an.
>
> Das Erbe kann ich mir eigentlich gut vorstellen, dass wenn man da jetzt nicht zu große Folgen draus hat im nächsten Run, dass man sowas mit rübernimmt, ist zum Beispiel ganz cool. Ja, auch hier Dreh- und Angelpunkt ist, dass einem halt nicht irgendwie das Deck zerschießt. Das Gesicht im Wasser finde ich eigentlich ganz geil. Das wachsende Ding kann ich mir auch nicht richtig was drunter vorstellen. Unsichtbarer Gegner, der einem Schaden macht, den man nicht angreifen kann, wäre natürlich nicht so geil, aber irgendwie so eine Mechanik auf den kann ich mir vorstellen.
>
> Insmith, Rassismus, das wollen wir natürlich nicht mit drin haben. Das muss anders übertragen werden. Die Farbe, finde ich gut. Wenn er dann halt irgendwie ein Item relativ schnell unbrauchbar macht, auch wieder nicht so geil, aber die Mechanik, ein neunter Stoff ohne Farbe, finde ich gut, das dann irgendwie ein bisschen dynamischer ist, also nicht einfach ein neuer Stoff dazu, sondern mit so einer gewissen Dynamik das Ganze. Essentielle Salze, ja, klingt ganz cool. Frische. Kann ich mir nicht genau vorstellen, was Reagenzholz sie zurückheißt, aber irgendwie so eine Mechanik, die halt Einfluss darauf nimmt, wem man wann begegnet. Cool. Kühlung klingt nicht scheiße, aber klingt jetzt auch nicht irgendwie so als ob es perfekt hier in Lovecraft reinpasst. Die Diener erheben sich. Finde ich, glaube ich, ganz cool, dass halt auch so, ja, so Progression über den Run so irgendwie zurückkommt und sich einem dann in den Weg stellt mit dieser Karte.
>
> Zans Takt, ein Item behält einen Boss, hält einen Boss-Effekt fern, bla bla bla. Klingt nicht verkehrt. Licht im Turm. Klingt auch nicht verkehrt, aber also ja, man muss gucken, dass da jetzt auch nicht viel zu viele Mechaniken reinkommen, weil naja, wir gucken gleich einfach. Die Gradbeigabe. Ja. Klingt gut. Einmal hier zwischendrin möchte ich anmerken, was mir gefallen hat aus der Analyse, ist auch dieses Wissen ist irreversibel. […]
>
> Fehlzeit klingt eigentlich ganz cool. Ich weiß nicht, ob ich das mitten in einem Run machen würde oder halt am Start von einem neuen Run. Nachdem dann im Run vorher irgendwie Bedingungen dafür erfüllt wurden, dass nicht mitten in einem Run irgendwie das Stack auf einmal zerschossen wird. Aber auch das Konzept, dass zwischen zwei Biomen ein Stück fehlt, finde ich cool. Das können wir gerne mit auf die Liste nehmen und gerne was daraus machen. Tiefe ist Zeit, finde ich geil eigentlich. Kann man jetzt, glaube ich, nicht pauschal umsetzen, weil dann sind einfach ein paar Stoffe unbrauchbar immer. Wenn die Sterne stehen, ja, aber also ist auch nicht schlecht, aber klingt halt auch danach, dass dann irgendwie, also dann wird ja der Run, der Pfad wird ja dann übel eingeschränkt, wenn es immer dadurch bestimmt wird. […]
>
> Lieber Eck, finde ich geil. Falsche Winkel, kann man bestimmt was mitmachen. Hören statt sehen finde ich geil. Da dann aber auch ohne Fragezeichen, dass so die UI und das ganze Spiel so ein bisschen immersiv, nicht, dass das Spiel dir sagt, hier, du weißt nicht, was der macht, sondern dass man sich wirklich fragt, warum sehe ich das nicht? Ist das kaputt? Aber dass man halt darauf kommen kann, die Musik ja, verrät das. Also auch, dass man, das generell kann man auch mit auf die Liste nehmen, dass man als User halt dieses, das ist so ein Meta-Ebenen-Ding, sowas wie, da steht kein Fragezeichen, da steht gar nichts, aber die Musik ändert sich. Das ist ja, das ist geil. Der Geruch zuerst, ja, safe, würde ich jetzt nicht pauschal überall mit reinnehmen, aber kann man machen. Das Tagebuch des Vorgängers finde ich richtig geil. Soll jetzt nicht irgendwie jedes Mal, also viel von sowas, von so solchen Mechaniken dann natürlich verstreut irgendwie mit reinnehmen. Dass jetzt nicht die ganze Zeit das wiederkehrende Elemente sind und das dann irgendwie so an Geilheit und Überraschung verliert. Der falsche Brief, ja, klingt cool. Zeitungsausschnitte, ja, kann man auch machen. Der Krämer mit 1000 Masken, kann ich mir so halb was drunter vorstellen, aber ja, dass du es mit reinnimmst. Das Gehirn im Zylinder klingt nett, aber ich verstehe es nicht so richtig. Die Flöte des blinden Gottes kann man irgendwie so irgendwie mit andenken.
>
> So, das Spiel zählt mit. Finde ich geil, auf jeden Fall. Die Ausrede bröckelt, finde ich auch geil. Umkehren ist keine Flucht, genau wie du auch mit Risiko eingeschätzt hast, aber finde ich cool. Da habe ich mich eh schon gefragt, das fühlt sich auch so ein bisschen nach diesem Meta-Ding an, weil als Spieler klickt man wahrscheinlich auch bleiben statt umkehren, weil das mehr danach klingt, das Spiel abzuschließen und halt auch In-Game-Progress zu machen. Und das ist halt so eine geile Meta-Übertragung darauf, warum geht man eigentlich runter, irgendwas ruft dich und so, also das schlägt in die gleiche Kerbe, finde ich cool. Die Pause wird bemerkt, genau wie du sagst. Sparsam kann man mitnehmen, aber ja, halt nicht wie bei Wirkung billig. Also wir wollen nicht, dass das billig wird. Ach so, zu dem Meta-Ding, Darkest Dungeon, wahrscheinlich so das beste Lovecraft-Spiel, weil dich das wirklich psychisch fertig macht, kriegt das auch hervorragend hin. Aber es soll jetzt kein anstrengendes Spiel werden, das nur am Rande. Jemand anders spielt, könnte nerven, vielleicht, wenn man aktiv so einwillig, dass das passiert, nicht einfach so. Also wenn man als Spieler schon weiß, ja, okay, das und das könnte sich hinter der Möglichkeit verstecken und dann wird es wahrscheinlich okay. Neugier als einziger Fortschritt fühlt sich irgendwie dann für den Spieler ein bisschen geforst an, dass man halt immer diese Wandbilder nehmen muss. […] Ja, jetzt ist die Frage, wie machen wir hier weiter? […] weil es darf jetzt auch nicht geflutet werden, das Spiel mit Mechaniken, aber dass man da so eine Übersicht hat, was wahrscheinlich gut funktioniert und wo man auch wirklich diesen Lovecraft-Vibe hat, wie abgeleitet Prinzipien als Designregeln.

---

## Was daraus für dich folgt (Kurzfassung, keine neue Regel)

- **Verändern, nicht schwächen.** Keine Debuffs als Kern. Jede neue Mechanik dreht, wie etwas funktioniert.
- **Das Deck bleibt deins.** Nichts zerschießt einen Build. Run-übergreifende Folgen nur klein.
- **Sparsam überraschen.** Nicht fluten. Was überrascht, kommt verstreut und selten.
- **Kein Fragezeichen.** Die UI sagt nie „du weißt es nicht“, sie zeigt dann einfach nichts.
- **Einwilligung vor Kontrollverlust.** Und lieber am Runstart als mitten im Run.
- **Unheimlich, nicht anstrengend. Nichts billig wirken lassen.**
- **Nie Herkunft als Bedrohung.**
- **Sprüche und Texte nicht ändern.** Neue Texte nur dort, wo dieser Auftrag sie verlangt (siehe [01-regeln.md](01-regeln.md) Abschnitt 5).
- **Keine Kopie von Slay the Spire.** Eigene Optik, eigene Lösungen.
