# M7: Wächter, gesehen

Jeder Wächter (Gegner mit `rang: "waechter"`) hat das Feld `gesehen`: ein zusätzlicher, stärkerer Musterschritt, der zu seinem Kniff passt. Er kommt ins Muster, wenn der Spieler mit einem Blick-Item hinsieht (06-lovecraft-kern.md, Abschnitt 5). Form wie ein vorhandener Musterschritt (`atk` mit `v` und optional `h`, `blk`, `buff`), ohne Text, ohne `unverw`. Eingeschoben wird er von `Blick.waechterZusatz()` (js/core/blick.js) direkt nach dem aktuellen Musterschritt; Angriffswerte skalieren wie im Muster.

Maß: Gesamtwert (v×h bei Schlägen) etwa das 1,3- bis 1,6-Fache des stärksten vorhandenen Schritts derselben Art, nie mehr als das Doppelte. Bei Wächtern mit Phasen gilt der Schritt für das Grundmuster. Die Spalte „Kniff / Besonderheit“ nennt die Kniffarten und die Art der Besonderheit.

Verteilung: 44 Wächter (6 in `data/foes.json`, 38 in den Biom-Paketen), davon 10 reine Einzelschläge, 15 Mehrfachschläge, 14 Blöcke, 5 Stärke-Schritte.

| Wächter | Biom | Kniff / Besonderheit | Stärkster vorhandener Schritt (gleiche Art) | Neuer gesehen-Schritt | Begründung |
|---|---|---|---|---|---|
| Der Lotse | hafen | ruft | Block 10 | **Block 15** | Er ruft Diener; gesehen deckt er sich mit großem Block. |
| Der Opfernde | moor | ruft | Stärke 2 | **Stärke 3** | Sie ruft Nester; hingesehen wächst ihre Stärke um eine Stufe mehr. |
| Die Glockenmutter | kapelle | ruft | Block 10 | **Block 15** | Sie ruft Chorknaben; der Läutende deckt sich mit einem großen Block. |
| Der Wurm im Salz | salz | schwach_wechsel | Schlag 16 | **Schlag 6×4** | Wechselnde Schwachstelle, viele Gänge: ein Mehrfachschlag aus allen Richtungen. |
| Der Wind, der Gestalt hat | stadt | keiner | Schlag 18 | **Schlag 5×5** | Ohne Kniff, nur Wucht in vielen Hieben: ein langer Mehrfachschlag. |
| Der Chor im Eis | eis | ruft | Block 14 | **Block 20** | Er ruft Rufer; der Chor schließt sich zu einem großen Block. |
| Die Welle, die weiterkam | eis | ansage, phasen | Schlag 22 | **Schlag 32** | Ansage mit Ladezug; gesehen kommt der Brecher ohne Vorwarnung als schwerer Einzelschlag. |
| Die Schicht | fabrik | waechst, ruft | Schlag 5×4 | **Schlag 7×4** | Die Schicht zieht an (waechst) und ruft; gesehen schlägt sie vier Mal mit der angewachsenen Stärke. |
| Der Fang | fabrik | abschrift, phasen | Block 12 | **Block 18** | Abschrift mischt Störkarten; gesehen deckt er sich mit großem Block, während er schreibt. |
| Der Sender | funkstation | verborgen, phasen | Schlag 5×3 | **Schlag 5×4** | Das Verborgene wird sichtbar; der Sender strahlt in vier schnellen Zeichen. |
| Der Kastendrachen | funkstation | dornen, schwach_wechsel | Block 10 | **Block 15** | Dornen auf dem Draht: gesehen verstärkt er den Block, an dem man sich verletzt. |
| Der Regulator | gezeitenwerk | waechst, schwach_wechsel | Schlag 15 | **Schlag 5×4** | Das Rad wächst mit jedem Schlag; gesehen schwingt es vier Mal aus. |
| Der Griff | gezeitenwerk | kopie, phasen | Schlag 14 | **Schlag 20** | Kopiert deine Karten; gesehen greift er mit einem schweren Einzelschlag zu. |
| Der Voraus | glasmeer | voraus | Schlag 16 | **Schlag 6×4** | Er spielt voraus; gesehen setzt er gleich vier Schläge hintereinander. |
| Die Lichtqualle | glasmeer | einfrieren, ruft | Block 10 | **Block 15** | Einfrieren und Rufen; gesehen hüllt sich die Qualle in einen großen Lichtmantel (Block). |
| Das Tretrad | glockengiesserei | waechst, schwach_wechsel | Schlag 19 | **Schlag 7×4** | Das Rad wächst und beschleunigt; gesehen tritt er vier Mal zu. |
| Die Ungetaufte | glockengiesserei | takt, ruft | Block 12 | **Block 18** | Takt und Ruf; gesehen ein langer Glockenton als großer Block. |
| Der Ungeheilte | grotte | teurer, phasen | Schlag 15 | **Schlag 22** | Teurer machen zieht den Zug in die Länge; gesehen trifft ein schwerer Einzelschlag. |
| Die Erhörte | grotte | waechst, ruft | Block 10 | **Block 15** | Sie schmilzt und ruft Wachshände; gesehen hüllt sie sich in dickeren Block. |
| Die Galionsfigur | hafen | brecher, phasen | Schlag 17 | **Schlag 25** | Brecher durchschlägt Schutz; gesehen ein schwerer Einzelschlag. |
| Der Prediger | kapelle | ansage, schwach_wechsel | Schlag 16 | **Schlag 24** | Ansage mit großem Schlag; gesehen wird der Schlag noch schwerer. |
| Der Adler vom Lesepult | kloster | dornen, phasen | Block 14 | **Block 21** | Dornen verlangen einen Schutz; gesehen kommt ein sehr großer Block. |
| Der Abschreiber | kloster | kopie, ruft | Block 10 | **Block 15** | Er ruft Novizen und kopiert; gesehen schreibt er sich mit großem Block ab. |
| Die Oberschwester | kurhaus | abschrift, phasen | Block 12 | **Block 18** | Sie pflegt und ruft; gesehen deckt sie sich mit großem Block. |
| Der Badekarren | kurhaus | verborgen, ruft | Schlag 20 | **Schlag 7×4** | Hinter dem Vorhang schlägt es zu; gesehen kommt ein Vierfachschlag. |
| Die Linse | leuchtturm | takt, phasen | Schlag 5×3 | **Schlag 22** | Takt und Licht; gesehen ein gebündelter, schwerer Strahl als Einzelschlag. |
| Das Nebelhorn | leuchtturm | ansage, ruft | Schlag 19 | **Schlag 28** | Ansage nach zwei Ladezügen; gesehen ein noch schwererer Einzelschlag. |
| Die Rückseite | mond | teurer, phasen | Schlag 13 | **Schlag 5×4** | Teurer machen; gesehen fallen vier Schläge in dichter Folge. |
| Der Mann im Mond | mond | abschrift, phasen | Schlag 15 | **Schlag 5×4** | Abschrift; gesehen schlägt der Mondmann vier Mal zu. |
| Das Moorpferd | moor | einfrieren, schwach_wechsel | Schlag 19 | **Schlag 7×4** | Das Moor hält fest; gesehen tritt es vier Mal zu, wenn man steckt. |
| Der Uhrmacher im Speisewagen | nachtzug | brecher, teurer, ruft | Schlag 16 | **Schlag 24** | Brecher dreht die Zeit zurück; gesehen ein schwerer Einzelschlag. |
| Der Oberkellner | nachtzug | verstopfen, phasen | Stärke 3 | **Stärke 4** | Er verstopft die Hand und ruft Mitreisende; gesehen wächst seine Stärke um eine Stufe mehr. |
| Die Eingesalzene | salz | einfrieren, phasen | Block 14 | **Block 21** | Einfrieren; gesehen kommt ein sehr großer Salzblock dazu. |
| Der Getragene | stadt | schuetzer, ruft | Block 10 | **Block 15** | Schützer deckt Nachbarn; gesehen deckt er mit größerem Block. |
| Der Zug, der einfährt | station | ansage, phasen | Schlag 14 | **Schlag 20** | Ansage der Türen; gesehen ein schwerer Einzelschlag. |
| Die Menge | station | teurer, schwach_wechsel | Schlag 3×6 | **Schlag 4×6** | Gedränge mit vielen Händen; gesehen sechs Schläge aus der Menge. |
| Der Fotograf von 1913 | waisenhaus | einfrieren, phasen | Schlag 20 | **Schlag 6×5** | Einfrieren wie ein Bild; gesehen fünf schnelle Blitze. |
| Die Heimleiterin | waisenhaus | ruf, abschrift | Stärke 2 | **Stärke 3** | Ruft Nummern auf und schreibt ab; gesehen steigt ihre Strenge (Stärke) mehr. |
| Der Wurzelstock | wald | waechst, phasen | Stärke 2 | **Stärke 3** | Wächst; gesehen wächst er einen Schritt weiter (Stärke). |
| Der Kronengänger | wald | verstopfen, schwach_wechsel | Schlag 3×6 | **Schlag 5×5** | Verstopft mit Harz; gesehen fünf Schläge aus der Krone. |
| Das Herz | walkathedrale | takt, ruft | Stärke 2 | **Stärke 3** | Takt und Ruf; gesehen schlägt das Herz stärker (Stärke). |
| Das Kalb | walkathedrale | waechst, phasen | Schlag 14 | **Schlag 5×4** | Wächst; gesehen schlägt es vier Mal aus. |
| Der Brennofen | ziegelgruben | loeschen, phasen | Schlag 16 | **Schlag 24** | Löscht und glüht; gesehen ein schwerer Glutschlag. |
| Die Neununddreißigste | ziegelgruben | dornen, ruft | Block 14 | **Block 20** | Dornen und Ruf; gesehen ein großer Schildblock. |
