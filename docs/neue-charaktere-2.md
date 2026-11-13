# Neue Charaktere, Runde 2: eine Elite für jedes Biom

Stand 2026-11-10. Auf Philips Wunsch eine zweite Runde neue Charaktere, aufbauend auf [neue-charaktere.md](neue-charaktere.md) (PR #18).

**Was gefehlt hat:** Nach Runde 1 hatten zehn Biome eine Elite, zwölf Biome in Akt I bis IV noch keine. Dort war ein schwerer Kampf immer nur „zwei normale Gegner mehr“. Jetzt hat **jedes Biom in Akt I bis IV eine Elite**, und jede bringt ein eigenes Beute-Item mit. Akt V bleibt, wie er ist (Vorraum-Eliten in Ufer und Waage, gemeinsamer Endgegner).

Jeder Charakter ist ein Ergänzungspaket `prototype/data/biome/<biom>_neu.json` (Format wie in Runde 1: `ergaenzt`, `elite_dazu`, `fundpool_dazu`) mit eigenem Sprite-Skript `tools/sprites/gegner/<id>.js`. Bestehende Texte, Gegner und Werte sind unverändert. Alle neuen Texte tragen `"entwurf": true`.

## Übersicht

| Akt | Biom | Charakter | Leben | Schwäche | Kniff + zweiter | Beute (neu) |
|---|---|---|---|---|---|---|
| I | Hafenviertel | Der Hafenmeister | 76 | Salz | ansage (3 Züge, 16) + ruf (tiefling, schmuggler) | Pegellatte |
| I | Moorwald | Die Irrlichtträgerin | 88 | Wasser | verborgen + waechst 1 | Irrlicht im Glas |
| II | Kapelle | Der Täufer | 90 | Blut | takt 4 (Glocke) + ruf (gepruefte, ertrunkener) | Taufschale |
| II | Grotte | Der Reliquienträger | 82 | Eisen | waechst 1 + ruf (wachshand) | Reliquiar |
| II | Glockengießerei | Der Glockenstimmer | 78 | Blut | einfrieren + schuetzer 3 | Stimmgabel |
| III | Salzstollen | Der Obersteiger | 80 | Feuer | brecher + ruf (salzlaeufer) | Kanarienkäfig |
| III | Namenlose Stadt | Die Abklatscherin | 90 | Feuer | kopie + schuetzer 3 | Klopfbürste |
| III | Gezeitenwerk | Der Schleusenwärter | 94 | Wasser | wechsel (W/S/E) + heiler 4 | Schleusenschlüssel |
| III | Ziegelgruben | Die Lehmmutter | 88 | Wasser | nachlass teilt (2 Lehmhunde) + schuetzer 3 | Streichform |
| IV | Schwarzes Eis | Das Gespann | 88 | Feuer | loeschen + waechst 1 | Hundegeschirr |
| IV | Walkathedrale | Der Trankocher | 96 | Wasser | ansage (2 Züge, 22) + heiler 4 | Tranlampe |
| IV | Mond | Die Mondsüchtige | 86 | Licht | voraus + teurer 1 | Nachthaube |

Konzept, Stimme, Beute-Satz und die Begründung jedes Kniffs (`why`, im Dev-Modus sichtbar) stehen im Paket, das Bild beschreibt der Kopfkommentar des Sprite-Skripts.

**Kurz zu den Ideen:** Der Hafenmeister liest den Pegel ab und kündigt die Flut an. Die Irrlichtträgerin trägt ihre Augen in Einmachgläsern (ihre Absicht ist verborgen). Der Täufer steht bis zum Gürtel im Taufstein und schlägt im Glockentakt. Der Reliquienträger schließt die Läden, solange seine Wachshände leben (unverwundbar nur mit Diener, wie bei Fix 7). Der Glockenstimmer hat eine Stimmgabel als Kopf, der Ton friert eine Handkarte ein. Der Obersteiger hat die Karbidlampe als einziges Auge und schlägt deinen Block weg. Die Abklatscherin ist mit Papierabdrücken der Reliefs behängt und schreibt deine letzte Karte ab. Der Schleusenwärter hat ein Handrad als Kopf und wechselt die Schwäche. Die Lehmmutter lässt beim Tod zwei Lehmhunde frei. Das Gespann ist ein dreiköpfiges Hundegespann mit erfrorenem Führer, das jeden Brand löscht. Der Trankocher ist selbst der Trankessel und kocht über. Die Mondsüchtige schwebt schlafwandelnd und spielt deine nächste Karte vor dir.

## Mechanik-Maßstäbe

Nur vorhandene Kniffe, kein neues System. Keine Störkarten ins Deck (Deck nie zerschießen): `kopie` ohne `n`, kein `abschrift`, kein `verstopfen`. Jede Elite hat 3 bis 4 Züge im Muster, einen Kniff und einen zweiten in `kniffe`, wie im Paketformat.

## Bilder

- [kontakt-a.png](neue-charaktere-2/kontakt-a.png) und [kontakt-b.png](neue-charaktere-2/kontakt-b.png): je Elite Idle, Angriff und Silhouette auf dem Nebel des Bioms (×3).
- [neben-favoriten.png](neue-charaktere-2/neben-favoriten.png): alle zwölf in Spielgröße neben Chorknabe, Hirte und Netzflickerin.
- `kampf-<id>.png`: Bildschirmfoto im Spiel, je Elite ein schwerer Kampf im eigenen Biom (1280 × 720, keine Seitenfehler).

## Prüfung

- `node tools/sprites/pruefen.js`: 280 Sprites, 0 Verstöße. Jedes neue Sheet habe ich selbst angesehen (Idle und Angriff) und mehrfach nachgebessert.
- `node tools/biom-test.js <biom> 20` ohne die neuen Pakete (vorher), mit ihnen (nachher, Elite mit `BAL.elite.chance` 0,5) und mit `--elite=<id>` (Elite in jedem schweren Kampf). 0 Fehler überall. Zu harte Eliten habe ich entschärft (Hafenmeister, Glockenstimmer, Obersteiger), zu leichte etwas angehoben (Irrlichtträgerin, Täufer, Schleusenwärter, Trankocher).

| Biom | vorher | nachher | Elite in jedem schweren Kampf |
|---|---|---|---|
| Hafenviertel | 17/20 | 17/20 | 14/20 |
| Moorwald | 20/20 | 16/20 | 15/20 |
| Kapelle | 20/20 | 19/20 | 20/20 |
| Grotte | 20/20 | 17/20 | 15/19 |
| Glockengießerei | 17/20 | 18/20 | 18/19 |
| Salzstollen | 20/20 | 15/20 | 17/20 |
| Namenlose Stadt | 19/20 | 20/20 | 18/20 |
| Gezeitenwerk | 20/20 | 20/20 | 19/19 |
| Ziegelgruben | 18/20 | 20/20 | 17/20 |
| Schwarzes Eis | 18/20 | 18/19 | 16/19 |
| Walkathedrale | 20/20 | 18/19 | 19/19 |
| Mond | 17/20 | 17/19 | 15/20 |

Kapelle, Gezeitenwerk und Walkathedrale bleiben für den Bot leicht. Das liegt an den Biomen selbst (vorher schon 20 von 20), eine Elite kommt dort nur in einem Kampf je Akt vor. Ich habe sie nicht weiter hochgedreht, damit sie im echten Spiel nicht zur Wand werden; das sollte Philip beim Spielen beurteilen.

- Gesamttests (`sh tools/alle-tests.sh`): alles gut außer `test-karte` (48 Fehler, auf der Basis genauso). `texte-pruefen` ist grün.

## Noten (eigene Einschätzung, Bewertungsbogen 1–5)

| Sprite | Note | Anmerkung |
|---|---|---|
| Hafenmeister | 4 | Pegellatte und gebeugter Mantel lesen sich gut, der nasse Saum mit Tang auch |
| Irrlichtträgerin | 4 | die Gläser an der Stange tragen das Bild; der Körper ist noch ein Klumpen |
| Täufer | 4 | Taufstein und segnende Hand sofort lesbar |
| Reliquienträger | 4 | stärkste Silhouette der Runde; der Mann darunter geht etwas unter |
| Glockenstimmer | 4 | Gabel als Kopf eindeutig; der Leib ist recht gerade |
| Obersteiger | 4 | Lampe als Auge, Salzkruste an einer Seite, Beil schwingt sauber |
| Abklatscherin | 3,5 | die Bögen mit Gesichtern sind da, aber in Spielgröße könnten sie für Ziegel gehalten werden |
| Schleusenwärter | 4 | Handrad als Kopf, Schütz mit Wasserstrahl |
| Lehmmutter | 3,5 | die Hunde im Schoß lesen sich erst auf den zweiten Blick |
| Gespann | 4 | drei Köpfe, viele Beine, der Führer ist eher eine Säule |
| Trankocher | 4 | Kessel mit Beinen und Kopf, Tran läuft über |
| Mondsüchtige | 4 | schwebendes Haar und Saum, geschlossene glühende Lider |

Offen: Die Item-Bilder sind Platzhalter aus `js/sprites/items.js`, wie in Runde 1. Abklatscherin und Lehmmutter würde ich bei Bedarf noch einmal überarbeiten.
