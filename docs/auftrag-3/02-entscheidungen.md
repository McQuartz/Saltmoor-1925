# Entscheidungen auf einen Blick

**Status:** *Philip* = von Philip so entschieden. *Plan* = von diesem Plan festgelegt, weil Philip die Frage offen gelassen hat oder weil die Umsetzung eine Festlegung braucht. Was *Plan* ist, darf der Agent mit Begründung anpassen, wenn das Spiel es zeigt. Was *Philip* ist, nicht.

## Grundsätze

| Thema | Entscheidung | Status |
|---|---|---|
| Basis | `main` ab Commit `80c4ea0` (Merge von PR #14, Auftrag 2 mit Zugabe: 25 Biome, 9 Figuren, 157 Ereignisse) | Philip |
| Texte | Bestehende Sprüche und Texte nicht ändern. Neue nur, wo der Auftrag sie verlangt, mit `entwurf: true` | Philip |
| Mechanik-Maßstab | Veränderung statt Debuff, Deck nie zerschießen, keine Fragezeichen-UI, sparsam überraschen, Einwilligung vor Kontrollverlust, nicht anstrengend, nie Herkunft | Philip |
| Nicht fluten | Pro Run höchstens: der Kern, zwei Begegnungen, eine Handvoll Würze. Feste Zahlen in [07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) Abschnitt 1 | Philip (Grenze), Plan (Zahlen) |
| Kein Sog-Wert, kein Wahnsinn-System | bleibt so aus Auftrag 1. Die Metaebene arbeitet ohne Leiste und ohne Zahl | Philip |
| Slay the Spire | nichts kopieren, eigene Optik | Philip |
| Ausführung | Opus Effort mittel dirigiert, Sonnet und Haiku als Sub-Agenten | Philip |
| Wer startet | offen, Mo oder Philip | Philip |

## Welle 1: Fixes

| # | Entscheidung | Status |
|---|---|---|
| 1 | Alle 18 Biome ohne Fragmente bekommen je 3 eigene (54 neue Texte) | Philip |
| 2 | Vorhandene `beute_saetze` (Biom) und `beute_satz` (Gegner) anschließen, kein neuer Text | Philip |
| 3 | Absicht nach dem Gegnerzug ausblenden, neue Absicht erst zum Zugbeginn | Philip |
| 4 | Nur den echten Schaden zeigen, nie den Originalwert durchgestrichen. Grund beim Drüberfahren | Philip |
| 5 | „−x Leben“ unter dem Balken weg. Verlust steht schraffiert im Balken | Philip |
| 6 | Reaktionen verstärken auch Ziehen, Stärke und Gold (gerundet, ×1,5 aus 2 = 3). Energie nicht | Philip |
| 7 | Boss allein: dicker Panzer statt unverwundbar. Unverwundbar nur, solange Diener leben | Philip |

## Welle 2: Oberfläche

| Thema | Entscheidung | Status |
|---|---|---|
| Kampf-HUD | Variante 2 aus A3 (erster Reiter, [vorlagen/hud-variante-2.png](vorlagen/hud-variante-2.png)). Footer als Tisch mit Messingkante, Balken links über dem Stoff-Baum mit gleichem Abstand nach links und zu den Karten, Block blau als Verlängerung des Balkens, Verlust schraffiert, Reaktions-Band unten an der Karte, Gold oben klein (so groß wie Buch und Deck), Gegner-Plakette mit Absicht oben und Leben darunter in Schrift und Rot des eigenen Balkens, Messingrand, Spitze zeigt auf den Gegner | Philip |
| Stoff-Baum | ersetzt das Stoffrad. Pfad der gespielten Stoffe, Äste für mögliche Reaktionen, helle Äste sind mit der Hand spielbar, „Sackgasse“ sichtbar, Hochreaktionen gold, rückt beim Spielen mit | Philip |
| Gegner-Aufstellung | gestaffelt wie bisher (C1), fest auf Bodenreihen, nie in einer Wand. Umzingelt nur mit Abstand zum Rand | Philip |
| Kamera im Kampf | raus, auch nicht als Einstellung | Philip |
| Fahrt nach vorne | Übergang nach der Wahl des nächsten Ziels, Richtung je Szene: geradeaus in den Gang, bei Wand Drehung und schräg links oder rechts weg | Philip |
| Karte | B „Peilkarte im Nebel“ aus Karte Runde 1. Links nach rechts, zwei Abschnitte voraus, Rest im Nebel, Wandbild hebt den Nebel bis zum Wächter. Folgen (Einsturz) bleiben hinter dem Nebel verborgen und zeigen sich erst beim Aufdecken. Pixel feiner als im Spiel, nicht gröber. Kein Strudel | Philip |
| Rucksack | B „Am Körper“. Figur als dunkle, einfarbige Silhouette im Nebel, nur Randlicht. Fächer mit eigener Form: Talismane Reihe am Hals, Kleidung 2×2-Block am Leib, Waffen Säule an der Hand. Rechts Item mit Karten und Deck mit Stoff-Balken und Grün/Rot. Unten Rucksack im Holz-Footer. Schloss auf gesperrten Plätzen, Kerben als Striche in Stofffarbe | Philip |
| Silhouette je Figur | alle 9 Figuren bekommen eine eigene Silhouette im Stil von [vorlagen/fischer-figur-silhouette.png](vorlagen/fischer-figur-silhouette.png) | Plan |
| Folgen auf der Karte | Abkürzung (spart eine Ebene, führt in schweren Kampf), Brüchiger Gang (Einsturz nach Werkstatt, verborgen bis aufgedeckt), Dunkler Stollen (zeigt seinen Inhalt erst davor oder nach Wandbild). Der Dunkle Stollen zeigt **kein** „?“, sondern ein leeres, verschattetes Feld | Plan (aus dem Mockup) |

## Lovecraft-Kern

| Thema | Entscheidung | Status |
|---|---|---|
| Was überhaupt kommt | Kern, Begegnungen, Meta und Würze aus V2. Zurückgestelltes aus V2 bleibt draußen | Philip (V2 gemocht, „was wahrscheinlich gut funktioniert“) |
| Als Auftrag oder Probe | als Auftrag, aber jedes System einzeln schaltbar, damit Philip testen kann | Plan |
| Vier Kern-Systeme zu viel? | alle vier bauen, in der Reihenfolge Regelbiegung, Hören statt sehen, Sehen und gesehen werden, Farbe. Die Farbe zuletzt, damit sie als Erstes wegfallen kann | Plan (Vorschlag aus V2) |
| Erste Probe | „Über Eck“ in der namenlosen Stadt zuerst, dann „Hören statt sehen“ an einem Gegner | Plan (aus V2) |
| Regelbiegung | alle 14 Biome der Akte III bis V bekommen genau eine. 4 aus V2, 10 von diesem Plan ([06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 3). Die Biegung des nächsten Bioms ist vorher auf der Biom-Wahl und auf der Peilkarte zu sehen | Philip (Idee), Plan (alle 14) |
| Falsche Winkel | Im Code sind Reaktionen schon richtungslos (`pairKey` sortiert). Die V2-Fassung „zählen in beide Richtungen“ wäre im Spiel unsichtbar. Neu: Jede Karte reagiert mit der **vorletzten** statt mit der letzten Karte | Plan |
| Alte Stoffe erinnern sich | Salz, Wasser und Blut haben heute keine Reaktion miteinander. In den Salzstollen bekommen sie drei uralte Reaktionen (SW, BS, BW), nur dort | Plan |
| Die Farbe | ein neunter Stoff, wandert, tauscht Stoffe, mit Salz bindbar, Werkstatt dreht Tausch zurück. Kommt höchstens einmal pro Run, ab Akt II über einen eigenen Fund | Philip (Idee), Plan (wann) |
| Hören statt sehen | nur Akt IV und V, genau ein stummer Gegnertyp je Akt-IV-Biom und einer im Vorraum von Akt V, nie Wächter, höchstens ein stummer Gegner pro Kampf. Barrierefreiheit (Klänge als kleine Zeichen) nur in den Einstellungen | Philip (Idee), Plan (wo) |
| Fremde Fassung | Barmherzige Trennung, Fehlzeit und Krämer brauchen „fremde“ Handgriffe. Das ist **keine** Handschrift-Stufe, sondern eine feste Markierung: Wirkung ×1,5 (gerundet), eigener Kartenrahmen, Name bleibt | Plan |

## Ausgeklammert (nicht bauen)

| Thema | Warum | Status |
|---|---|---|
| Deck-Progression „Handschrift“ (neu, eingespielt, fremd) | erst, wenn die Lovecraft-Kernsysteme getestet sind. Schleifen bleibt, wie es ist | Philip |
| Drei alte Götter als letzter Kampf, NG+ bis zum Göttermord, Figuren anders freischalten | nur notiert | Philip |
| Die Flöte des blinden Gottes | gehört zum Götter-Finale, kommt mit diesem | Plan |
| Kamera-Parallaxe im Kampf | raus | Philip |
| Strudel-Karte | nicht genommen | Philip |
| Aus V2 zurückgestellt: Wissen engt ein, Lesen in Raten, Tiefe ist Zeit pauschal, Farbe als Zerfall, Fehlzeit mitten im Run, Wenn die Sterne stehen, Neugier als einziger Fortschritt, Kühlung, Frische, Gehirn im Zylinder | Debuff, grätscht ins Deck oder unklar | Philip |
