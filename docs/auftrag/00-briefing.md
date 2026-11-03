# Briefing (Nachtrag 2026-11-03): gilt vor allem anderen

Stand 2026-11-03, abgestimmt zwischen Ace und Mo nach dem ersten Entwurf des Auftrags. **Diese Datei hat Vorrang vor allen anderen Dateien in `docs/auftrag/`.** Die übrigen Dateien sind bereits daran angepasst. Findest du trotzdem noch eine Stelle, die dem hier widerspricht, gilt diese Datei. Notiere die Stelle in `fortschritt.md` unter „Entscheidungen unterwegs“.

## 1. Struktur: fünf Akte, fest gesetzt

Das Spiel hat **fünf Akte**. Anzahl und Reihenfolge sind fest und werden nicht verändert, gekürzt oder erweitert: Einstieg, Kapelle, Tiefe, Schwarzes Eis, Pforte. Abwechslung entsteht **innerhalb** eines Aktes. Dazu gehören der wechselnde Einstieg (Hafenviertel oder Moorwald), die Wahl in Akt 3 (Salzstollen oder Namenlose Stadt), die Knoten, die Gegner und die Ereignisse. Siehe [04-welt-und-run.md](04-welt-und-run.md).

## 2. Keine Sog-Mechanik

**Wir haben uns gegen die Sog-Funktion entschieden.** Es gibt keine Sog-Leiste, keine `data/sog.json`, keine Trugbild-Karten, keine Stufen und keine Karten mit „+Sog/−Sog“. Die Musik bekommt keine Gefahr durch den Sog, und die Weg-Wahl folgt keiner Sog-Regel.

Was bleibt: „Der Sog“ als **Erzählrahmen**. Etwas unter Saltmoor ruft, du steigst hinab, je tiefer, desto älter und fremder. Dazu gehören die Ausrede und die Wahrheit je Figur, der Strand nach der Niederlage und die Ankunft mit Bleiben oder Umkehren. [quellen/der-sog.md](quellen/der-sog.md) gilt nur noch als Quelle für Ton, Welt und Figuren, nicht für Spielregeln.

Items aus der Ideenkiste, die nur wegen des Sogs drin waren (Wirkung „+Sog/−Sog“), bekommen eine andere, einfache Wirkung oder bleiben weg. Die verfluchten Items (Auge im Glas, Glimmender Götze) bleiben in diesem Auftrag weg.

## 3. Stummfilm-Rauschen: nur zu besonderen Anlässen

Der Effekt ist fest definiert (Werte in `data/balance.json` → `stummfilm`, Aussehen wie in [02-entscheidungen.md](02-entscheidungen.md)) und kommt **nur bei besonderen Anlässen**:

- wenn ein **Elite-Gegner** (Wächter eines Akts) oder der **Finale-Boss** erscheint,
- bei **besonderen Ereignissen**, die das in ihren Daten ausdrücklich anfordern (Feld `stummfilm: true` in `events.json`, nur bei wenigen, starken Momenten).

Er läuft nie dauerhaft und kommt nie in festem Takt. Hochreaktionen lösen ihn **nicht** mehr aus, dafür gibt es den Zwischentitel.

## 4. Hintergründe: deutlich mehr Aufwand, organisch statt Schema F

Hier ist deutlich mehr Aufwand vorgesehen als bisher. Details werden **nicht nach starren, wiederkehrenden Regeln** platziert, also nicht „alle n Pixel eine Säule“ und nicht „pro Ebene drei zufällige Requisiten“. Jede Umgebung bekommt **eine eigene Komposition**: eigene Horizonthöhe, eigener Blickpunkt, eigene Lichtführung und eine eigene Antwort auf die Frage, wo hier was steht und warum. Details sitzen dort, wo sie im Ort Sinn ergeben, zum Beispiel Netze dort, wo geflickt wird, Kerzen dort, wo jemand betet, und Lore an den Schienen.

Die Ebenen aus [05-hintergruende.md](05-hintergruende.md) sind das technische Gerüst und keine Vorlage für den Bildaufbau. Vor dem Bauen skizziert der Agent je Ort die Komposition in Worten in `docs/auftrag/hintergruende-kompositionen.md` (siehe M8). Varianten eines Ortes sind andere Ausschnitte oder Stellen desselben Ortes, nicht dieselben Teile neu gewürfelt.

## 5. Sprites: per KI erzeugt, Generator nachrangig

Der prozedurale **Sprite-Generator ist nachrangig**. Er wird in diesem Auftrag weder gebraucht noch weitergebaut. Die Gegner-Sprites werden **per KI erzeugt**, und zwar streng nach den **Pixel-Art-Regeln, die bei den bisherigen Charakteren bestätigt wurden** ([docs/spritegen/zielbild.md](../spritegen/zielbild.md)). Das heißt: dunkle Körper in Zonenfarben, Gegenlicht von hinten oben rechts, 1–2 px Randlicht, Fase statt Kuppeln, organische Formen, Bayer-Dither, kein schwarzer Umriss, leuchtende Augen als einzige helle Akzente, 96 × 120 px, harte Pixel ohne Kantenglättung.

Wie genau, steht in M6 von [03-meilensteine.md](03-meilensteine.md). Kurz gesagt: Steht in der Sitzung ein Bild-Generator zur Verfügung, darf er benutzt werden. Sonst zeichnet der Agent die Sprites selbst als Pixel-Art (Formen und Pixel in einem Skript, das PNG-Sheets schreibt). In beiden Fällen prüft ein Skript die harten Regeln (Größe, Palette, kein Umriss, keine Zwischentöne durch Glättung).

Die alte Regel „keine vorgezeichneten Körperteile, alles aus dem Generator“ gilt für diesen Auftrag **nicht mehr**. KI-Sounds bleiben verboten, und Hintergründe entstehen weiter aus Code.

## 6. Gegner: wenige, aber stark

- **Lovecraft ist Inspirationsquelle** für Motive, Themen und Atmosphäre, zum Beispiel das Ererbte, das Hybride, Wissen, das den Verstand kostet, unermessliche Zeit, Geometrie, die nicht stimmt, und das Meer als etwas Älteres. Keine Namen aus dem Mythos, kein Cthulhu-Klischee.
- Aus diesen Motiven werden **passende Gegnertypen und Charaktere abgeleitet**, und zwar je Akt aus dem Thema dieses Akts.
- **Die Anzahl ist zweitrangig.** Es braucht keine 20 bis 30 Gegner. Lieber zwei starke Typen je Akt plus Wächter als vier schwache.
- **Jeder neue Gegner braucht ein starkes Konzept und ein durchdachtes Design**, bevor er gezeichnet wird. Dazu gehören das Motiv, wer oder was er war, was an ihm falsch ist, die Silhouette in einem Satz, sein Kampfverhalten passend zum Konzept (Muster, Schwachstelle mit Grund) und seine Stimme in der Musik. Die Konzepte stehen in `docs/auftrag/gegner.md` (siehe M7).
- Die Steckbriefe in [04-welt-und-run.md](04-welt-und-run.md) Abschnitt 8 sind **Vorschläge**. Gegner dürfen gestrichen, zusammengelegt oder ersetzt werden, wenn das Konzept dadurch stärker wird. Die Favoriten Chorknabe, Hirte und Netzflickerin bleiben.

## 7. Zwischen den Kämpfen: Ereignisse, Krämer und mehr

Zwischen den Kämpfen werden **vollwertige Knoten** gebaut, nicht nur Platzhalter:

- **Ereignisse**: kleine Szenen mit Bild, Text und zwei bis drei Entscheidungen, jede mit Preis und Folge (Leben, Gold, Items, Karten entfernen oder verwandeln, ein Kampf). Mindestens drei je Biom, im Ton der Welt.
- **Krämer**: eine Figur mit Ort und Charakter je Biom, Sortiment aus dem Fundpool des Bioms, Preise, eine Karte entfernen gegen Gold.
- **Werkstatt**, **Rast** (heilen oder ein Item verbessern) und **Wandbild** (Fragment lesen).
- Gern auch einfache weitere Arten, wenn sie den Run reicher machen, etwa eine Fundstelle (Item oder Gold, manchmal mit Haken). Neue Arten nur, wenn sie wenig neues System brauchen.

Details stehen in M1, M5 und M9.

## 8. Runübergreifende Progression

Die runübergreifende Progression wird **schon jetzt angesehen und eingebaut**, nicht erst später. Grundlage sind die Wandbild-Fragmente und das Tagebuch. Dazu schreibt der Agent in M5 zuerst ein kurzes Konzept `docs/auftrag/progression.md`: was über Runs bleibt, was man freischaltet (Figuren, Items im Fundpool, Startvarianten, Schwierigkeitsstufen nach dem ersten Sieg), wie oft etwas Neues kommt und warum das motiviert. Er vergleicht zwei bis drei Varianten kurz, wählt eine nach den Regeln in [01-regeln.md](01-regeln.md) und baut sie in einer kleinen, spielbaren Fassung ein. Alles bleibt in `localStorage` und ist im Dev-Modus zurücksetzbar.
