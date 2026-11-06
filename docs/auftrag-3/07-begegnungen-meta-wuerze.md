# Begegnungen, Metaebene und Würze

Quelle: „Lovecraft als Mechanik-Quelle V2“. Philip: „es darf jetzt auch nicht geflutet werden, das Spiel mit Mechaniken“ und „Soll jetzt nicht irgendwie jedes Mal, also viel von sowas … verstreut irgendwie mit reinnehmen. Dass jetzt nicht die ganze Zeit das wiederkehrende Elemente sind“. Darum steht die Dosierung zuerst.

## 1. Dosierung pro Run (verbindlich)

| Ebene | Was | Obergrenze pro Run |
|---|---|---|
| Kern | Regelbiegung je tiefem Biom, Blick (wenn getragen), Hören statt sehen (Akt IV/V), die Farbe | wie in [06-lovecraft-kern.md](06-lovecraft-kern.md) |
| Begegnungen | Die Diener erheben sich, Asche, Spuren, Die Tiefe erkennt dich | **höchstens 2** verschiedene |
| Würze | Zanns Takt, Grabbeigabe, Licht im Turm, Barmherzige Trennung, Lügender Kartentext, Der falsche Brief, Zeitungsausschnitte, (Zugabe: Krämer mit tausend Masken) | **höchstens 3** verschiedene, jedes Stück höchstens einmal |
| Meta | Spiel zählt mit, Ausrede bröckelt, Bleiben ist der Sog, Tagebuch des Vorgängers, Erbe, Fehlzeit, Pause bemerkt | leise, Häufigkeit je Element unten |

**Umsetzung (Plan):** Beim Start eines Runs würfelt der Seed einen **Run-Zettel**: welche zwei Begegnungen in diesem Run *möglich* sind und welche bis zu drei Würze-Stücke. Was nicht auf dem Zettel steht, kann in diesem Run nicht auftreten, auch wenn die Bedingung erfüllt wäre. Jedes Würze-Stück hat zusätzlich eine eigene Wahrscheinlichkeit in `wuerze.json → chance`, damit nicht jeder Zettel voll ist (Ziel: im Mittel 1,5 Würze-Stücke pro Run). Ein Stück, das in den letzten zwei Runs vorkam, kommt nicht auf den Zettel (`Meta.wuerzeZuletzt`). Der Zettel ist im Dev-Reiter „Tiefe“ sichtbar und änderbar, im Spiel unsichtbar.

**Prüfung:** 100 Seeds, Häufigkeit je Element im Bericht. Kein Run über den Obergrenzen.

---

## 2. Begegnungen

### Die Diener erheben sich

*At the Mountains of Madness: Diener, die sich gegen die Herren wenden. Philip: „dass halt auch so Progression über den Run so irgendwie zurückkommt und sich einem dann in den Weg stellt mit dieser Karte.“*

- Bedingung: Eine Karte wurde in diesem Run mindestens 8-mal gespielt. Gezählt wird je Karte (Handgriff oder feste Item-Karte).
- Beim **nächsten Wächter** bekommt dessen Muster einen zusätzlichen Schritt: **deine Karte**, mit deinen Stoffen, gegen dich. Schaden trifft dich, Block geht an ihn, Gift und Brand an dich, Ziehen und Energie verfallen. Die Plakette zeigt als Absicht ein kleines Abbild deiner Karte.
- Du verlierst die Karte nicht und kannst sie im Kampf normal spielen.
- **Wer den Wächter schlägt, bekommt sie geschliffen zurück** (wie Schleifen in der Werkstatt: −1 Kosten; kostet sie schon 0, bekommt sie die fremde Fassung, Abschnitt 5).
- Höchstens einmal pro Run, nur bei Wächtern, nie beim Finale.

### Asche

*Charles Dexter Ward (essentielle Salze, die Formel rückwärts), Herbert West. Philip: „Essentielle Salze, ja, klingt ganz cool.“*

- Gegner mit `asche: true` (Plan: je ein Gegnertyp in den Biomen der Akte II bis IV, aus den Gestalten, die einmal Menschen waren) hinterlassen beim Tod **Asche** im Rucksack: ein Gegenstand ohne Platz und ohne Karten, mit dem Namen des Gegners.
- **Rufen:** In einem späteren Kampf spielst du eine Karte mit **Salz** und direkt danach eine mit **Feuer**: Die Asche wird gerufen und kämpft **für diesen Kampf** an deiner Seite (eigener Platz links in der Szene, eigene Plakette, handelt nach deinem Zug mit den Angriffen seines Musters gegen die Gegner, wird von Gegnern nicht angegriffen).
- **Preis, verzögert und verdient:** Wer gerufen wurde, kommt **zwei Biome später als Gegner** wieder, in einem Kampf dieses Bioms, gekennzeichnet durch dieselbe Asche-Spur an der Plakette.
- **Auflösen:** Feuer und direkt danach Salz löst die Asche stattdessen auf. Dann kommt nichts zurück.
- Die Reihenfolge der Stoffe zählt hier, obwohl normale Reaktionen richtungslos sind. Das ist eine eigene Prüfung, keine Reaktion. Der Stoff-Baum zeigt die Asche als eigenen Ast, wenn sie im Rucksack liegt.
- Höchstens ein Verbündeter auf einmal, höchstens drei Aschen im Rucksack.

### Spuren

*The Dunwich Horror: Das Ding wächst, während die Stadt wegsieht.*

- Ein Knoten pro Akt (Akte I bis IV) trägt auf der Peilkarte **Spuren**. Jeder Knoten, den du woanders hingehst, lässt die Spuren größer werden (vier Stufen, nur im Bild, keine Zahl).
- **Früh hingehen:** leichter Kampf, kleine Beute. **Spät:** schwerer Kampf, dafür eine Reliquie. Der Gegner ist ein schwerer Gegner des Bioms, der mit den Spuren wächst (Leben und Angriff je Stufe in `balance.json → spuren`, dazu sichtbar größer im Bild).
- **Nichts greift dich unsichtbar an.** Wird der Knoten unerreichbar, bleiben die Spuren auf der Karte stehen und führen ins Leere. Beim Wächter ist das Ding nicht dabei.

### Die Tiefe erkennt dich

*Innsmouth, umgedeutet: Die Tiefe erkennt dich, weil du ihr gefolgt bist, nicht wegen deiner Herkunft. Nie Abstammung, nie Blut, nie Aussehen von Menschen.*

- Bestimmte Entscheidungen in Ereignissen tragen das neue Datenfeld `tiefe: 1` (Plan: der Agent wählt 8 bis 12 vorhandene Ereignis-Wahlen aus, bei denen man der Tiefe nachgibt, etwa etwas opfert, ins Wasser geht, einem Ruf folgt; **der Text der Ereignisse bleibt unverändert**, nur das Feld kommt dazu). Nach zwei solchen Entscheidungen in einem Run liegt eine Karte im Deck, die man nie gewählt hat: **„Das Zeichen“** (neu, 0 Kosten, `entwurf: true`).
- **Nie erzwungen:** Solange man sie nicht spielt, passiert nichts. Man kann sie beim Krämer entfernen wie jede Karte.
- **Spielt man sie:** Seitenwechsel für den Rest des Runs.
  - Kämpfe, in denen **alle** Gegner `art: tiefe` oder `art: nachahmer` sind, werden zu **Begegnungen**: Die Wesen stehen da, greifen nicht an, man geht weiter und bekommt die halbe Beute.
  - Kämpfe mit `art: mensch` oder `art: veraendert` werden härter: ein Gegner mehr aus dem Menschen-Pool des Bioms.
  - Der **Krämer verweigert dich** (alle Krämer-Arten). Eine Zeile beim Krämer, sonst nichts.
  - Wächter und Finale bleiben Kämpfe, sonst bricht der Run.
- Dafür braucht jeder Gegner das Feld `art` nach der Gegner-Regel aus Auftrag 1 („erst Menschen, dann Menschen, die sich verändern, dann Dinge, die Menschen nachahmen, am Ende Dinge ohne menschliche Form“). Ein Haiku-Agent schlägt die Einordnung aller Gegner vor, ein Sonnet-Agent prüft sie gegen die Steckbriefe, du gibst sie frei.

---

## 3. Metaebene über Runs

*Der Sog ist der Spieler. Das Spiel sagt es nie, aber es merkt sich, dass du wiederkommst. Alles hier ist leise, fast nur Text und Bild, und nichts davon darf billig wirken. Jeder Satz wird von Hand für eine bestimmte Lage geschrieben, nicht als Vorlage mit Zahl.*

Alles wird in `Meta` gespeichert (`js/core/meta.js`, mit Migration) und in `data/meta.json` beschrieben. Schalter `auftrag3.meta`.

| Element | So läuft es | Wie oft |
|---|---|---|
| **Das Spiel zählt mit** | Der Strand, an dem du aufwachst (`strandHtml`), verändert sich mit der Zahl der Runs: ab dem 2. eine Fußspur, ab dem 5. mehrere, ab dem 15. viele, ab dem 40. ein ausgetretener Pfad. Keine Zahl, nur das Bild, gemalt in der Szenen-Technik des Strands | immer, kaum sichtbar |
| **Die Ausrede bröckelt** | Die Startzeile jeder Figur (`ausrede` in `jobs.json`, **unverändert** als Stufe 0) wird über viele Runs mit dieser Figur ehrlicher: Stufe 1 ab dem 3., Stufe 2 ab dem 8. Run mit der Figur, Stufe 3 ab dem 15.: nur noch »Ich gehe hinunter.« Stufe 1 und 2 sind neue Texte je Figur (18 Zeilen, `entwurf: true`) | wenige Stufen pro Figur |
| **Bleiben ist der Sog** | Bleiben gibt weiter den Fortschritt, wie heute. Wer **zum ersten Mal überhaupt** Umkehren wählt, liest den Schlusstext (unverändert) und wacht beim nächsten Start trotzdem am Strand auf, mit einer eigenen Ankunftszeile (neuer Text). Danach nie wieder | nur beim ersten Mal |
| **Das Tagebuch des Vorgängers** | Nach einem verlorenen Run findet die nächste Figur mit Wahrscheinlichkeit 1/3 an der ersten Rast Notizen aus dem letzten Run: ein bis drei Sätze über Biome und Wächter, die der Vorgänger gesehen hat. Meistens stimmen sie. Je tiefer der Vorgänger kam, desto öfter nicht (Anteil falscher Notizen: Tiefe des Todes / 40, höchstens 60 %). Jeder Satz ist von Hand für seine Lage geschrieben: je Wächter eine wahre und eine falsche Notiz, je Biom eine wahre und eine falsche (neue Texte, `entwurf: true`). Das bestehende Tagebuch (`tagebuchHtml`) bekommt die Notizen als eigene Seite | etwa jeder dritte Run |
| **Das Erbe** | Am Start (nach der Figurenwahl) bietet das Spiel den Handgriff an, den du im letzten Run am häufigsten gespielt hast, mit seinen Stoffen von damals und in einem abgegriffenen Kartenrahmen („alte Handschrift“, nur Optik). Nimmst du ihn, liegt er zusätzlich lose im Deck. Ablehnen geht immer | optional, jeder Run |
| **Fehlzeit** | Endet ein Run in Akt V (Sieg oder Tod), bietet die Pforte etwas an, und das Spiel sagt ungefähr, was es bedeutet: »Jemand anderes wird an deiner Stelle gehen.« Nimmt man an, beginnt der **nächste** Run erst bei der Kapelle (Akt II). Das Stück dazwischen fehlt: Der Autospieler spielt Akt I mit deiner Figur und dem Seed im Hintergrund durch. Du bekommst sein Deck, seine Items und sein Gold, seine Handgriffe in der **fremden Fassung** (Abschnitt 5) und Tagebucheinträge, die du nicht geschrieben hast (aus dem, was er tatsächlich erlebt hat, mit den handgeschriebenen Sätzen des Tagebuchs). Stirbt er in Akt I, beginnst du bei der Kapelle mit dem Startdeck und einem fremden Handgriff | nur nach eigener Wahl, gilt für einen Run |
| **Die Pause wird bemerkt** | Lag die letzte Sitzung mehr als 14 Tage zurück, steht beim nächsten Start eine einzige Zeile, die zur Lage passt: wo du zuletzt warst oder wer dich zuletzt gesehen hat (je Biom eine Zeile, neue Texte). Höchstens einmal in 30 Tagen | sehr selten |

**Einwilligung:** Fehlzeit ist der einzige Kontrollverlust, und er geschieht nur nach eigener Wahl und am Runstart, nie mitten im Run.

---

## 4. Würze: seltene Einzelstücke

Kein System, sondern ein Vorrat. Jedes Stück steckt an genau **einem** Ort und taucht nur auf, wenn es auf dem Run-Zettel steht. Daten in `data/wuerze.json` (`id`, `ort`, `chance`, `bedingung`). Schalter `auftrag3.wuerze`.

| Stück | Ort (Plan) | So läuft es |
|---|---|---|
| **Zanns Takt** | ein Wächter mit Takt-Kniff (Vorschlag: Die Ungetaufte, Glockengießerei, Akt II) und ein neuer Talisman **„Zanns Geige“** im Fundpool desselben Bioms | Trägst du die Geige im Kampf gegen diesen Wächter: Solange du **jeden Zug** eine Karte der Geige spielst, bleibt das Fenster zu. Setzt du einen Zug aus, öffnet es sich und der Wächter bekommt für den nächsten Zug seinen stärksten Schritt. Die **Geigenebene der Musik bricht mit ab**, wenn du aussetzt, und setzt wieder ein, wenn du weiterspielst. Ohne Geige ist der Wächter wie immer |
| **Die Grabbeigabe** | ein Ereignis (Vorschlag: in der überfluteten Kapelle, Akt II) | Ein starkes Item aus einem Grab (Reliquien-Stärke). Danach wird im Rucksack ein **Bellen** lauter, Biom für Biom (Klang aus Rauschen und Formanten gebaut, keine KI-Klänge, nicht aufdringlich). Beim vierten Biom kommt der Hund als zusätzlicher Gegner in den nächsten Kampf. Das Bellen bleibt über das Runende leise in der Musik des Hafens, bis man in einem späteren Run am Fundort die Wahl „Zurücklegen“ nimmt. Dann ist Ruhe |
| **Licht im Turm** | ein Verfolger im Leuchtturmhof (Akt I) | In den Kämpfen dieses Bioms steht im Hintergrund ein Verfolger. Spielst du in einem Zug keine Karte mit Licht, kommt er einen Schritt näher (im Bild, keine Zahl). Beim dritten Schritt tritt er in den Kampf. Licht-Karten halten ihn fern. Ein Gewitter-Ereignis im selben Biom löscht das Licht für die ersten drei Züge des nächsten Kampfes |
| **Barmherzige Trennung** | ein Reliquien-Satz aus drei Teilen: **Relief**, **Zeitungsausschnitt**, **Aussage eines Matrosen**, verteilt auf Fundstellen eines Runs | Jedes Teil ist allein eine gute 0-Kosten-Karte. Spielst du **zwei davon direkt nacheinander**, verstehst du den Zusammenhang: **Ein Handgriff deiner Wahl** verwandelt sich dauerhaft in seine fremde Fassung (Abschnitt 5). Das lässt sich nie zurückdrehen. Man kann warten, bis man weiß, welche Karte man opfern will. Einmal pro Run |
| **Lügender Kartentext** | ein Gegnertyp in einem Biom (Vorschlag: Akt III), `luegt: true` | Solange er lebt, zeigt **eine** Karte auf deiner Hand einen falschen Stoff. Am Zugende wird es aufgedeckt (die Karte flackert in den echten Stoff zurück). Nie mehr als eine Karte. Der Stoff-Baum zeigt, was du siehst |
| **Der falsche Brief** | ein Ereignis in Akt I oder II | Ein Brief verspricht Hilfe in einem bestimmten späteren Biom. Die Handschrift ist leicht anders (eigene Schrift im Brief-Bild). Wählst du dieses Biom, steht auf der Peilkarte ein Knoten mit einem Brief. Dort triffst du den Absender: den Vorgänger aus deinem letzten verlorenen Run (Technik von „Der, der vor dir kam“), der dir eines seiner Items anbietet. Hattest du keinen verlorenen Run, ist der Knoten leer und der Brief bleibt im Tagebuch |
| **Zeitungsausschnitte** | zwischen zwei Akten, im Übergang | Ein Ausschnitt aus der Oberwelt von 1925 (Saltmoor und Umgebung), etwa zwölf verschiedene (neue Texte, Motive aus [quellen/r4-mythos-1925.md](quellen/r4-mythos-1925.md)). Ab dem 10. Run kann irgendwann **deine Vermisstenanzeige** darin stehen, mit dem Namen deiner Figur. Nicht in jedem Übergang |
| **Der Krämer mit tausend Masken** | Zugabe, als Probe | Ein Krämer mit wechselndem Gesicht, aber immer demselben Ring. Gibt Kredit. Kassiert später nicht in Gold, sondern in einem Handgriff deiner Wahl. In V2 als „noch unscharf“ markiert, darum erst in der Zugabe |

**Kein eigenes Stück, sondern Schreibregeln für neue Ereignisse:** „Der Geruch zuerst“ (erst Geruch und Klang, dann das Bild, nur bei manchen) und „Fundstücke aus dem Notizbuch“ ([quellen/r3-notizbuch.md](quellen/r3-notizbuch.md)) als Motiv-Vorrat.

**Nicht in diesem Auftrag:** Die Flöte des blinden Gottes (gehört zum Götter-Finale).

---

## 5. Die fremde Fassung (Plan)

Barmherzige Trennung, Fehlzeit und Die Diener (bei 0 Kosten) brauchen „fremde“ Handgriffe. Die Deck-Progression „Handschrift“ ist ausgeklammert, darum gibt es **kein Stufensystem**, sondern nur diese eine Markierung:

- Wirkung ×1,5, gerundet wie bei Reaktionen (betrifft alle Zahlen der Karte außer Kosten und Energie).
- Eigener Kartenrahmen (dunkler, die Schrift leicht anders geneigt), Name bleibt.
- Stoffe bleiben die des Items wie bei jedem Handgriff.
- Feld `fremd: true` an der Karte im Run-Zustand.
