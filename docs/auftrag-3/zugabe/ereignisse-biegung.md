# Ereignisse zur Regelbiegung (Entwurf)

Je tiefem Biom ein neues Ereignis, das mit der Regelbiegung seines Bioms spielt. Alle Texte sind Entwurf (`"entwurf": true`). Nur vorhandene `fx`-Ops und `if`-Bedingungen. Kein Text ist abgenommen.

Ablage: salz, stadt, eis, pforte in `prototype/data/events.json`, die übrigen im Biom-Paket. Pforte hat im Akt V keinen eigenen Ereignis-Knoten; ihr Ereignis wird über die Ebene `rast_v` (Rast oder Ereignis des Akt-V-Bioms) gezogen.

Notizbuch-Motive sind lose angelehnt (Nummern aus `quellen/r3-notizbuch.md`, Teil 1), keine Übernahme.

| ID | Biom | Biegung | Wie es mit ihr spielt | Geruch zuerst | Notizbuch-Motiv |
|---|---|---|---|---|---|
| salz_probe | salz | Alte Stoffe erinnern sich | Drei Gläser mit Salz, Wasser, Blut; die drei Wahlen sind die drei Paarungen (Sole, Pökeln, Gezeitenblut) | ja | Nr. 171, Anleitung, die vor dem Mischen warnt |
| stadt_waescheleine | stadt | Über Eck | Zwei Hemden an einer Leine, deren Ärmel sich über die Gassenlücke fast berühren; Tausch mit der anderen Seite | ja | Nr. 17, Dinge, die sich ohne Ursache bewegen |
| wald_stumpf | wald | Rückwärts gewachsen | Ein Stumpf, der rückwärts wächst; die Axt als das, was zurückkommt | ja | Nr. 91, Zeit, die sich anders verhält |
| gezeitenwerk_staubecken | gezeitenwerk | Ebbe und Flut | Wasser, das zurückgehalten oder losgelassen wird; Handrad, das nur beim Loslassen dreht | nein (Klang zuerst) | Nr. 12, die Zeit zwischen zwei Signalen |
| ziegelgruben_ringgang | ziegelgruben | Der Ringofen | Ein Ofengang ohne Anfang, der Stempel der letzten Kammer in der ersten | ja | Nr. 161, Vergangenes, das in die Gegenwart reicht |
| station_abfahrt | station | Keiner fährt ab | Tafel mit Abfahrt jetzt, Zug mit offenen Türen, Gepäckwagen, der im Kreis oben wieder ankommt | nein (Klang zuerst) | Nr. 91, verlorene Zeit |
| eis_peilung | eis | Falsche Winkel | Man peilt die letzte Stange und sieht die vorletzte; jeder Winkel falsch, die Summe stimmt | ja | Nr. 157, Geometrie, die nicht ist, was sie scheint |
| walkathedrale_dritter_schlag | walkathedrale | Der Schlag | Zwei leise Schläge, der dritte trägt beide in sich | ja | Nr. 12, Geräusch und Schlag |
| glasmeer_vorrat | glasmeer | Das Spiegelbild ist voraus | Der Rucksack unter dem Glas zeigt, was als Nächstes gebraucht wird; Tausch mit dem Spiegelbild | ja | Nr. 42, Spiegel, die eine veränderte Szene zeigen |
| mond_zweiter_schatten | mond | Die Rückseite | Jeder Stein wirft zwei Schatten, der zweite gehört dem Kommenden | nein (Klang zuerst) | Nr. 161, Vergangenheit und Gegenwart in einem Bild |
| funkstation_dreimal | funkstation | Funkspruch | Dreimal kurz, das dritte Mal lauter, auch ohne Strom | nein (Klang zuerst) | Nr. 53, ein Gerät schreibt ohne Hand weiter |
| pforte_nebentueren | pforte | Außerhalb der Zeit | Jede Tür riecht nach einem anderen Biom, die nächste schon vor dem Zufallen der jetzigen | ja | Nr. 17, Türen, die sich verändern |
| ufer_brandung | ufer | Die Wellen kommen von oben | Wellen von oben, was sie legen, schiebt die nächste darunter, nichts wird gemischt | ja | Nr. 106, ein Ding, das am Morgen fort ist |
| waage_restposten | waage | Aufgewogen | Eine Lade mit Resten, die nicht verfallen, sondern verrechnet werden | ja | Nr. 8, eine Verpflichtung, die bleibt |

Geruch zuerst bei 10 von 14; bei Gezeitenwerk, Station, Mond und Funkstation steht der Klang zuerst. Optional `"tiefe": 1`: glasmeer_vorrat, mond_zweiter_schatten, pforte_nebentueren, waage_restposten (vier von 14).
