# Der Dirigent: wie Opus Sonnet und Haiku einsetzt

Du (Opus, Effort mittel) bist der Dirigent. Philip will, dass du sinnvoll Sonnet- und Haiku-Agenten einsetzt, damit der Auftrag schneller und gründlicher wird, **ohne** dass dabei Abkürzungen entstehen. Sub-Agenten sind Hände, nicht Köpfe: Was sie liefern, gilt erst, wenn du es geprüft hast.

## 1. Wer macht was

| Rolle | Modell | Typische Arbeit in diesem Auftrag |
|---|---|---|
| **Dirigent** | Opus | Alles lesen, jeden Meilenstein planen, Kern-Logik selbst bauen (Biegungs-Modul, Reaktionen, Kampfablauf, Peilkarten-Netz, Speicherstand), Zuschnitte für Sub-Agenten schreiben, jedes Ergebnis prüfen und einbauen, jedes Bild selbst ansehen und benoten, jede Regelprüfung, jede Balance-Entscheidung, `fortschritt.md`, Commits, PR-Bericht |
| **Bauer** | Sonnet | Eine abgegrenzte Komponente nach Vorgabe bauen (z. B. Stoff-Baum-Ansicht, Gegner-Plakette, Rucksack-Ansicht, Peilkarten-Zeichnung, Musik-Einsätze), eine Figur oder ein Gegner durch die Bild-Pipeline, neue Texte als Entwurf (Fragmente, Tagebuch, Ausreden), Tests zu einer fertigen Funktion schreiben, einen Vorschlag eines Haiku-Agenten gegenprüfen |
| **Sammler** | Haiku | Mechanische Arbeit mit klarer Regel: Vorschläge für Datenfelder aus Bildern oder Steckbriefen (`weg_richtung`, `stell`, `art`, Kandidaten für `stumm` und `asche`), JSON prüfen, Test- und Bot-Läufe starten und die Ausgabe **wörtlich** zurückgeben, Bildschirmfoto-Serien aufnehmen, Code nach Mustern durchsuchen (Fragezeichen, `<s>`, alte Aufrufe), zählen |

**Nie abgeben:**

- das Lesen von `00-philip.md`, `01-regeln.md`, `02-entscheidungen.md` und der Konzepte (du liest sie selbst, keine Zusammenfassung von Sub-Agenten),
- die Regelprüfung je Mechanik ([01-regeln.md](01-regeln.md) Abschnitt 3),
- die Noten für Bilder (du siehst jedes Bild selbst an),
- Änderungen an den Kern-Dateien `js/core/combat.js`, `js/core/rules.js`, `js/core/run.js`, `js/core/state.js`, `js/core/biegung.js` (Sub-Agenten dürfen dort lesen und dir Vorschläge als Diff zurückgeben, du baust ein),
- die Freigabe eines Meilensteins.

## 2. Vor jedem Meilenstein: Plan vor Code

Schreib in `fortschritt.md` unter dem Meilenstein einen kurzen Umsetzungsplan, bevor du Code anfasst oder Agenten startest:

1. welche Dateien sich ändern und welche neu entstehen,
2. die Schritte in Reihenfolge, je Schritt: du selbst oder welcher Sub-Agent (Modell),
3. was parallel laufen kann (Abschnitt 4),
4. wie du die Abnahme prüfst (Tests, Fotos, Bots).

Mittlere Effort-Stufe heißt nicht flach denken: An den Stellen, an denen ein Fehler später teuer wird (Datenformat, Speicherstand, Biegungs-Einhakpunkte, Netz der Peilkarte), denkst du gründlich und schreibst die Entscheidung auf.

## 3. Die Auftragsvorlage für Sub-Agenten

Jeder Sub-Agent bekommt einen vollständigen Auftrag. Er startet ohne dein Wissen, also steht alles Nötige darin. Vorlage:

```
Projekt: Saltmoor 1925, Repo McQuartz/saltmoor-1925, Sprache Deutsch.
Rolle: <Bauer | Sammler>. Du arbeitest für den Dirigenten, nicht für den Nutzer.

ZIEL
<ein Satz, was am Ende da ist>

LIES ZUERST (vollständig, nicht überfliegen)
- <genaue Pfade, z. B. docs/auftrag-3/05-oberflaeche.md Abschnitt 2>
- <Code-Dateien mit Funktionsnamen>
- <Vorlage, z. B. docs/auftrag-3/vorlagen/hud-variante-2.png>

DU DARFST ÄNDERN
- <genaue Dateien>
DU DARFST NICHT ÄNDERN
- alles andere, insbesondere js/core/*, data/events.json, data/fragmente.json (außer wo oben erlaubt), bestehende Texte

FERTIG HEISST
- <prüfbare Kriterien, je eine Zeile>

PRÜFE SELBST MIT
- <genaue Befehle, z. B. node tools/test-welle1.js>
- <Bildschirmfoto: Befehl und Zielpfad>

GIB ZURÜCK
1. Liste der geänderten Dateien
2. die Ausgabe jedes Prüfbefehls wörtlich (nicht zusammengefasst)
3. Pfade der Bildschirmfotos
4. was nicht geklappt hat oder offen ist (ehrlich, auch wenn es viel ist)

VERBOTEN
<die Liste aus Abschnitt 6, wörtlich eingefügt>
```

Bei Texten zusätzlich: drei bis fünf vorhandene Texte derselben Art als Stilvorlage, der Steckbrief des Bioms, die Schreibregeln aus [01-regeln.md](01-regeln.md) Abschnitt 5 und der Hinweis, dass jeder neue Datensatz `"entwurf": true` bekommt.

Bei Bildern zusätzlich: Pipeline und Bewertungsbogen aus [docs/auftrag-2/06-ki-bilder.md](../auftrag-2/06-ki-bilder.md), die drei Favoriten (Chorknabe, Hirte, Netzflickerin) als Maßstab und der Hinweis, dass die Note von dir vergeben wird, nicht vom Sub-Agenten.

## 4. Parallel arbeiten

- Sub-Agenten, die Dateien ändern, laufen mit `isolation: "worktree"` in einem eigenen Arbeitsbaum. Du übernimmst ihre Änderungen nach der Prüfung selbst in den Branch.
- **Höchstens drei** Sub-Agenten gleichzeitig. Nie zwei auf derselben Datei.
- Sammler ohne Schreibzugriff (Suchen, Zählen, Läufe) dürfen jederzeit parallel laufen.
- `js/ui/oberflaeche.js` ist heute eine große Datei. Damit in M2 bis M4 parallel gearbeitet werden kann, teilst du sie in M2 als ersten Schritt **selbst** in Module auf (z. B. `ui/hud.js`, `ui/stoffbaum.js`, `ui/plakette.js`, `ui/karte.js`, `ui/rucksack.js`, `ui/bildschirme.js`), ohne Verhalten zu ändern. Beleg: alle Tests grün, Bildschirmfotos vorher und nachher pixelgleich.
- Folgeaufträge an denselben Agenten schickst du mit SendMessage an ihn, statt einen neuen zu starten. Er hat dann seinen Kontext noch.

## 5. Jedes Ergebnis prüfen

Bevor du ein Ergebnis übernimmst:

1. **Diff vollständig lesen.** Nicht nur die Zusammenfassung.
2. **Prüfbefehle selbst ausführen.** Gemeldete Ausgaben gelten nicht als Beleg.
3. **Bildschirmfotos selbst ansehen**, bei UI in allen drei Auflösungen.
4. **Verbotsliste prüfen:** `node tools/texte-pruefen.js` (bestehende Texte unverändert, siehe [09-pruefen.md](09-pruefen.md)), Suche nach `TODO`, `FIXME`, `console.log`, „?“ in Anzeigen, `<s>`, auskommentierten Tests, neuen Abhängigkeiten.
5. **Passt es zur Absicht?** Vergleich mit Vorlage und Konzept. Ein Ergebnis, das die Kriterien formal erfüllt, aber nicht nach dem Mockup aussieht oder sich nicht wie beschrieben spielt, ist nicht fertig.

Ist etwas nicht in Ordnung: Gib es mit genauer Begründung zurück. Nach **zwei** Rückgaben ohne Erfolg machst du es selbst. Schreib jede Rückgabe mit einem Satz in `fortschritt.md` (Abschnitt „Rückgaben“), damit sichtbar bleibt, wo Sub-Agenten Mühe hatten.

## 6. Verbotene Abkürzungen (für dich und alle Sub-Agenten)

Diese Liste wird in jeden Sub-Agenten-Auftrag wörtlich eingefügt.

1. Funktionen als leere Hülle, feste Rückgabewerte oder Sonderfälle bauen, nur damit ein Test grün wird.
2. Tests überspringen, abschwächen, auskommentieren oder Erwartungen an das Ergebnis anpassen.
3. Neue Systeme im Autospieler, im `FAST`-Modus oder in Bots umgehen (`if (FAST) return` und Ähnliches), außer bei reinen Animationen.
4. Ein System per Schalter ausschalten, damit Bots oder Tests bestehen.
5. Mengen kürzen (54 Fragmente, 9 Silhouetten, 14 Biegungen, 3 Gesehene, alle Szenen mit `weg_richtung` und `stell`), ohne dass es im Bericht unter „nicht geschafft“ steht.
6. Bilder durch Umfärben, Spiegeln oder Skalieren vorhandener Bilder erzeugen und als neu ausgeben.
7. Platzhalter im fertigen Stand (graue Kästen, „TODO“, Lorem ipsum, „Text folgt“).
8. Bestehende Texte ändern, kürzen, „verbessern“, auch nur Satzzeichen.
9. Regeln doppelt bauen (eine Kopie der Reaktionslogik für Anzeige, Bot oder Biegung).
10. Neue Abhängigkeiten, fremde Assets, KI-Klänge, Weichzeichner, globaler Zufall statt Seed.
11. Einen Meilenstein als fertig markieren ohne Abnahmeprotokoll.
12. Ergebnisse melden, die nicht ausgeführt wurden, oder Ausgaben zusammenfassen, wo die wörtliche Ausgabe verlangt ist.
13. Dateien außerhalb der erlaubten Liste ändern.
14. Fragezeichen, „unbekannt“ oder Hinweise auf Verborgenes in der Oberfläche.

## 7. Sparsam mit Agenten

- Keinen Sub-Agenten für eine Änderung, die du in wenigen Minuten selbst machst.
- Haiku für alles, was eine klare Regel hat. Sonnet nur, wo Urteil oder Gestaltung gefragt ist.
- Bot-Läufe dauern. Starte sie im Hintergrund und arbeite währenddessen weiter.
- Schreib am Ende jedes Meilensteins in `fortschritt.md`, welche Agenten mit welchem Modell was gemacht haben (eine Zeile je Agent).
