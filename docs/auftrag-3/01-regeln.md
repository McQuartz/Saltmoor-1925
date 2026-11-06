# Arbeitsregeln für Auftrag 3

Grundlage sind die Regeln von Auftrag 2 ([docs/auftrag-2/01-regeln.md](../auftrag-2/01-regeln.md)) und Auftrag 1 ([docs/auftrag/01-regeln.md](../auftrag/01-regeln.md)). Sie gelten weiter, **mit diesen Änderungen**. Wo sich etwas widerspricht, gilt diese Datei.

## 1. Keine Rückfragen

Du bist allein, du hältst nie an. Unklares entscheidest du selbst (Abschnitt 2), schreibst es mit einem Satz Begründung in [fortschritt.md](fortschritt.md) unter „Entscheidungen unterwegs“ und arbeitest weiter. Fragen an Philip und Mo sammelst du für den Bericht.

## 2. Wie du entscheidest

Reihenfolge, das Höhere gewinnt:

1. [00-philip.md](00-philip.md), Philips Worte, die Absicht hinter allem
2. die Saltmoor-Regeln in Abschnitt 3 dieser Datei
3. [02-entscheidungen.md](02-entscheidungen.md)
4. die Konzepte: [04-welle-1.md](04-welle-1.md), [05-oberflaeche.md](05-oberflaeche.md), [06-lovecraft-kern.md](06-lovecraft-kern.md), [07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md)
5. [03-meilensteine.md](03-meilensteine.md)
6. Auftrag 2, dann Auftrag 1
7. der bestehende Code und `prototype/data/*.json`

Wenn auch das nichts sagt: die Lösung, die den Run **reicher und lesbarer** macht und **weniger neue Systeme** braucht. Feedback nie als starre Regel lesen, sondern die Absicht suchen.

## 3. Die Saltmoor-Regeln (Prüffragen für jede Mechanik)

Jede neue oder geänderte Mechanik muss alle sieben Prüffragen bestehen. Du beantwortest sie **schriftlich** in `fortschritt.md`, Abschnitt „Regelprüfung“, je Mechanik eine Zeile pro Frage mit Ja/Nein und einem Halbsatz Begründung. Eine Mechanik mit einem „Nein“ wird umgebaut, bis sie besteht, oder bleibt aus (dann steht im Bericht, warum).

| Regel | Prüffrage |
|---|---|
| Verändern statt schwächen | Spielt sich der Zug danach anders, oder nur schlechter? |
| Das Deck bleibt deins | Kann ich meinen Run noch kontrolliert spielen? Lässt sich Fremdes spätestens in der Werkstatt lösen? |
| Selten ist stark | Wird es beim zehnten Mal noch überraschen? Hält es die Obergrenze aus [07-begegnungen-meta-wuerze.md](07-begegnungen-meta-wuerze.md) Abschnitt 1 ein? |
| Kein Fragezeichen | Steht irgendwo „?“, „unbekannt“, „???“ oder ein Hinweis, dass etwas verborgen ist? (Muss Nein sein.) |
| Einwilligung vor Kontrollverlust | Hat der Spieler Ja gesagt, bevor ihm etwas die Hand wegnimmt? |
| Unheimlich, nicht anstrengend | Macht es neugierig oder müde? Braucht es Buchhaltung? |
| Nie Herkunft als Bedrohung | Könnte man es als Aussage über Menschen oder Abstammung lesen? (Muss Nein sein.) |

Dazu Lovecrafts acht Prinzipien aus [06-lovecraft-kern.md](06-lovecraft-kern.md) Abschnitt 1 als Geschmacksprüfung: Mindestens eines muss eine Mechanik tragen, sonst gehört sie nicht in dieses Spiel.

## 4. Verbote und Abkürzungen

**Weiter verboten** (aus Auftrag 1 und 2): KI-Klänge und KI-Musik, fremde Assets (außer pixelfx), neue Abhängigkeiten im Spiel, Weichzeichner und geglättete Skalierung, globaler Zufall für Inhalte (immer über den Seed), Tests aufweichen, Menge durch Umfärben oder Wiederverwenden vortäuschen, Noten schönen, die Abkürzungen aus [docs/auftrag-2/06-ki-bilder.md](../auftrag-2/06-ki-bilder.md) Abschnitt 6.

**Neu verboten in Auftrag 3:**

- **Eine Mechanik nur „anschließen“, ohne dass sie im Spiel sichtbar, spielbar und erklärt ist.** Jede Mechanik braucht: Daten, Logik, Anzeige (wo vorgesehen), Klang (wo vorgesehen), Dev-Schalter zum Erzwingen, einen automatischen Test und ein Bildschirmfoto im Abnahmeprotokoll.
- **Platzhalter im fertigen Stand.** Kein „TODO“, kein grauer Kasten statt Figur, kein Lorem ipsum, kein `console.log` als Ersatz für eine Anzeige. Was nicht fertig wird, ist per Schalter aus und steht so im Bericht.
- **Den Stoff-Baum, die Peilkarte oder den Rucksack als zweite Ebene über die alte Oberfläche legen.** Die alte Oberfläche wird ersetzt, nicht überdeckt. Altes, das nicht mehr gebraucht wird, wird entfernt (Stoffrad, „1 aus 3“-Wegwahl, Kamerabewegung im Kampf, alte Itemleiste).
- **Bestehende Texte umschreiben, kürzen oder „verbessern“** (Abschnitt 5).
- **Werte absenken, um eine neue Mechanik auszugleichen,** wo eine Regeländerung gemeint ist. Balance geht über `balance.json` und wird im Bericht begründet.
- **Tests oder Bots so ändern, dass sie neue Mechaniken nicht sehen.** Die Bots müssen jede Kern-Mechanik **benutzen** können (siehe [09-pruefen.md](09-pruefen.md) Abschnitt 3).
- **Sub-Agenten-Ergebnisse ungeprüft übernehmen** (siehe [08-dirigent.md](08-dirigent.md)).

## 5. Texte

- **Bestehende Sprüche und Texte bleiben Wort für Wort**, auch Satzzeichen. Das gilt für `events.json`, `fragmente.json`, Biom-Pakete, Beute-Sätze, Ausreden, Wahrheiten, Kniff-Texte, Übergänge, Item-Flavor. Philip und Mo schleifen sie später selbst.
- **Neue Texte** schreibst du nur dort, wo dieser Auftrag sie ausdrücklich verlangt: Fragmente der 18 Biome ohne Fragmente, Regelbiegungen, neue Items, Ereignisse und Karten der Lovecraft-Stücke, Stufen der Ausrede, Tagebuch-Notizen, Zeitungsausschnitte, die Zeile nach langer Pause.
- Jeder neue Text bekommt im Datensatz das Feld `"entwurf": true`. Das ist das Zeichen für Philip und Mo, dass sie ihn noch nicht abgenommen haben. Im Spiel ist das Feld unsichtbar.
- Ton: wie die bestehenden Texte. Kurz, konkret, 1925, ein falsches Detail statt eines Adjektivs, nie erklären, was das Grauen ist. „Der Geruch zuerst“ (erst Geruch und Klang, dann das Bild) nur bei manchen neuen Ereignissen, nicht überall. Vorrat für Motive: [quellen/r3-notizbuch.md](quellen/r3-notizbuch.md), [quellen/r4-mythos-1925.md](quellen/r4-mythos-1925.md). Kein Satz wird als Vorlage mit eingesetzter Zahl gebaut, jeder ist für seine Lage geschrieben.
- Kein Rassismus, keine Herkunft als Bedrohung, keine Abstammungs-Motive (Innsmouth nur als „die Tiefe erkennt dich, weil du ihr gefolgt bist“).

## 6. Technik

Wie in Auftrag 1 und 2 (reines HTML/JS unter `prototype/`, Daten in `prototype/data/`, kein Build-Schritt, keine Abhängigkeiten). Dazu:

- **Schalter für jedes neue System** in `prototype/data/balance.json` unter `"auftrag3"`, z. B. `{"regelbiegung": true, "blick": true, "farbe": true, "hoeren": true, "begegnungen": true, "meta": true, "wuerze": true}`. Philip soll jedes Kernsystem einzeln aus- und einschalten können, um es zu testen. Aus heißt: das Spiel läuft genau wie ohne das System.
- **Dev-Modus** (Taste D) bekommt einen Reiter **„Tiefe“**: Regelbiegung erzwingen (jede der 14), Blick-Item geben, Farbe auf ein Item setzen, stummen Gegner erzwingen, Begegnung erzwingen, Würze-Stück erzwingen, Meta-Zähler setzen (Runs, Umkehren, letzte Pause). Dazu URL-Hilfen nach dem Muster der bestehenden (`?biegung=ueber_eck`, `?wuerze=zann`).
- **Neue Daten** (alle in `prototype/data/README.md` erklären):
  - `biegungen.json`: die 14 Regelbiegungen (Abschnitt 3 in [06-lovecraft-kern.md](06-lovecraft-kern.md)).
  - neue Felder in Biomen: `biegung` (ID), `weg_richtung` (für die Fahrt nach vorne), `fragmente` (vorhanden oder neu).
  - neue Felder in Gegnern: `art` (`mensch`, `veraendert`, `nachahmer`, `tiefe`), `stumm` (bool), `asche` (bool), `luegt` (bool).
  - `stoffe.json`: der neunte Stoff `X` (Die Farbe).
  - `wuerze.json`: der Vorrat mit Wahrscheinlichkeit, Ort und Obergrenze.
  - `meta.json`: Stufen für Strand, Ausrede, Tagebuch, Zeitungsausschnitte, Pausen-Zeilen.
- **Speicherstand:** `Meta` (`saltmoor.meta.v1`) wird um die neuen Zähler erweitert, alte Spielstände müssen weiter laden (Migration mit Standardwerten). Run-Speicher (`serialize`/`loadRun`) muss alle neuen Zustände enthalten. Ein Test lädt einen Speicherstand von vor Auftrag 3.
- **Musik:** Alles Neue läuft über `js/audio/music.js` und die vorhandenen Bausteine. Aces Hör-Regeln gelten weiter: kein Clipping, nichts offkey, Tempo nur 80–88 BPM, höchstens 1 BPM pro Takt ([docs/auftrag/02-entscheidungen.md](../auftrag/02-entscheidungen.md)). Prüfung mit `tools/musik-pruefen.js`.

## 7. Git

- Branch: `auftrag/run-3`, abgezweigt vom aktuellen `main`. Erzwingt die Sitzung einen anderen Namen, nimm den und schreib es auf.
- Draft-Pull-Request gegen `main` gleich nach M0. Nach jedem Meilenstein die Beschreibung aktualisieren. **Nie selbst mergen.** Philip will den Stand vor dem Merge sehen.
- Commit nach jedem funktionierenden Schritt. Präfix mit Meilenstein: `M5: Über Eck in der namenlosen Stadt`. Push nach jedem Meilenstein.
- Sub-Agenten committen nicht selbst auf den Branch. Sie arbeiten in eigenen Worktrees, du übernimmst ihre Änderungen nach der Prüfung ([08-dirigent.md](08-dirigent.md) Abschnitt 4).
- Bilder für den Bericht nach `docs/auftrag-3/bilder/<Meilenstein>/`.

## 8. Zeit und Budget

- Die Reihenfolge der Meilensteine ist die Priorität. Welle 1 und die Oberfläche (M1 bis M4) sind die Grundlage, die Kernsysteme (M5 bis M8) sind der Grund für diesen Auftrag. Begegnungen, Meta und Würze (M9 bis M11) kommen danach.
- Richtwert: M0 bis M4 zusammen etwa 40 % des Budgets, M5 bis M8 etwa 35 %, M9 bis M12 den Rest.
- Wenn ein Meilenstein ausufert: auf **Mindestens** bringen, aufschreiben, weiter. Nie einen Meilenstein überspringen, um einen späteren anzufangen.
- Wenn das Budget knapp wird: den laufenden Meilenstein auf Mindestens bringen, alles Unfertige per Schalter aus, committen, `fortschritt.md` und PR aktualisieren.

## 9. Bericht

Wie in Auftrag 2, Abschnitt 8, dazu:

- Je Kernsystem: was gebaut ist, wie man es erzwingt, die Regelprüfung (Abschnitt 3) in einer Zeile, ein Bild.
- Siegrate je Build und Niederlagen je Akt **mit allen Systemen an** und **mit allen Systemen aus**, nebeneinander.
- Wie oft pro Run (Mittel über 100 Seeds) jedes System, jede Begegnung und jedes Würze-Stück vorkam. Zeigt, dass die Obergrenzen halten.
- Liste aller neuen Texte (`entwurf: true`) mit Fundstelle, damit Philip und Mo sie finden.
- Die fünf Dinge, die Philip beim nächsten Spielen zuerst ausprobieren sollte, mit URL, die genau dorthin springt.
- Offene Fragen an Philip und Mo, höchstens zehn, nach Wichtigkeit.
