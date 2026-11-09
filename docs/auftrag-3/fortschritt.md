# Fortschritt Auftrag 3

Wird vom Agenten geführt. Neueste Einträge oben in jedem Abschnitt.

## Stand

| Meilenstein | Status | Notiz |
|---|---|---|
| M0 Einrichten und Basis | fertig | Branch `claude/project-thread-flvf7e` (von der Sitzung vorgegeben), Text-Basis, Schalter, Dev-Reiter TIEFE |
| M1 Welle 1: sieben Fixes | offen | |
| M2 Kampf-HUD, Stoff-Baum, Plakette, Aufstellung | offen | |
| M3 Peilkarte und Fahrt nach vorne | offen | |
| M4 Rucksack am Körper | offen | |
| M5 Die Tiefe biegt die Regeln | offen | |
| M6 Hören statt sehen | offen | |
| M7 Sehen und gesehen werden | offen | |
| M8 Die Farbe | offen | |
| M9 Begegnungen | offen | |
| M10 Metaebene | offen | |
| M11 Würze | offen | |
| M12 Balance und Abschluss | offen | |
| Zugabe | offen | |

## Basis (M0, unverändertes main)

Gemessen auf `main` `7e1497e` (Merge PR #15, enthält `80c4ea0` und nur den Auftrag-3-Plan), vor jeder Änderung. Ausgaben der Tests: [bilder/M0/basis-tests.txt](bilder/M0/basis-tests.txt).

| Messung | Wert |
|---|---|
| Tests | test-run, test-deckbau, test-ereignisse, test-vorschau (483 Karten, 0 Abweichungen), test-meta grün; sprites/pruefen 253 / 0 Verstöße; icons/pruefen 242 / 0 Verstöße |
| Generischer Autospieler (`balance.js 100`) | **48 %** Siege, Ø Tiefe 26,1, **Ø Züge je Kampf 4,3**, 0 Fehler |
| Niederlagen je Akt (generisch, 52) | I 4 (8 %) · II 9 (17 %) · III 10 (19 %) · IV 13 (25 %) · V 16 (31 %) |
| Niederlagen je Kampfart | normal 58 % · Finale 23 % · Wächter 13 % · Elite 6 % |
| Ø Knoten je vollem Run | 31 (test-run, 10 Runs mit viel Leben) |

Build-Bots (`build-bots.js 50`):

| Build | Siege | Niederlagen je Akt I/II/III/IV/V | Reaktionen/Zug |
|---|---|---|---|
| Glutnest | 46 % | 1/7/9/4/6 | 2,67 |
| Brackwasser | 30 % | 1/6/8/9/11 | 2,11 |
| Bollwerk | 58 % | 3/5/5/2/6 | 2,38 |
| Aderlass | 52 % | 4/4/10/5/1 | 2,34 |
| Kettenwerk | 44 % | 1/2/7/6/12 | 2,77 |
| Hagel | 34 % | 3/3/9/8/10 | 2,05 |
| Ballast | 44 % | 5/3/7/1/12 | 2,39 |
| Kollekte | 50 % | 3/5/4/6/7 | 2,32 |

Basis-Fotos 1440×900: [Kampf](bilder/M0/kampf-1440x900.png), [Wegwahl](bilder/M0/weg-1440x900.png), [Rucksackmodus](bilder/M0/rucksack-1440x900.png), [Belohnung](bilder/M0/belohnung-1440x900.png), [Wandbild](bilder/M0/wandbild-1440x900.png).

## Einträge je Meilenstein

*Je Meilenstein: Umsetzungsplan (vor dem Code), Arbeitsschritte, Abnahmeprotokoll ([09-pruefen.md](09-pruefen.md) Abschnitt 5), Agenten.*

### M0 Einrichten und Basis

**Plan.** Neu: `tools/texte-lib.js`, `tools/texte-basis.js`, `tools/texte-pruefen.js`, `tools/ui-fotos.js`, `docs/auftrag-3/texte-basis.json`. Geändert: `data/balance.json` (`auftrag3`), `js/core/state.js` (`a3(k)`), `js/dev/dev.js` (Reiter TIEFE), `js/main.js` (`?a3aus=`). Alles selbst, Bot-Läufe im Hintergrund (kein Sub-Agent: die Läufe sind ein Befehl, die Ausgabe lese ich selbst).

**Schritte.** Basis-Tests und Bots auf unverändertem `main`; Text-Basis (3653 Datentexte mit Datei und Pfad, Array-Einträge über ihre `id` adressiert, dazu 120 feste UI-Texte); Prüfer; Schalter; Dev-Reiter; Fotos; Mockups angesehen.

**Text-Prüfung, wie sie arbeitet.** Datentexte: an derselben Stelle gleich, oder (falls der Eintrag umgezogen ist) derselbe Text im selben Feld derselben Datei. UI-Texte: irgendwo in `prototype/js/` (die Oberfläche wird in M2 in Module geteilt). Alte Anzeigen, die der Auftrag ausdrücklich ersetzt (z. B. die Zeile „−x Leben“), stehen mit Grund in `texte-entfernt.json`. Neue Datentexte brauchen `"entwurf": true` am Datensatz oder einem Vorfahren.

#### Abnahme M0
- Draft-PR offen: ✓ (Link im PR-Abschnitt unten)
- Basis-Tabelle in `fortschritt.md`: ✓ (oben)
- `texte-basis.json` im Repo, `texte-pruefen.js` grün: ✓
- Basis-Fotos in `bilder/M0/`: ✓, selbst angesehen: ja
- Schalter `balance.json → auftrag3` (alle `true`), `a3(k)` im Kern, `?a3aus=` in der Adresse: ✓
- Dev-Reiter „Tiefe“ als Hülle mit den Schaltern: ✓
- Tests: siehe Basis-Tabelle; `node tools/texte-pruefen.js` → `Texte unverändert: 3653 aus Daten, 120 aus der Oberfläche. Neue Texte: 0, alle als Entwurf markiert.`
- Mockups `vorlagen/*.png` angesehen: HUD Variante 2, C1 gestaffelt, Peilkarte B, Rucksack B.
- Agenten: keine.
- Offen: nichts.

## Regelprüfung

*Je Mechanik eine Tabelle mit den sieben Prüffragen aus [01-regeln.md](01-regeln.md) Abschnitt 3: Ja/Nein und Halbsatz.*

## Noten

*Je neues Bild: Name, Note, Bildpfad, Kurzbegründung.*

## Neue Texte (Entwurf)

*Je neuer Text: Datei, ID, erste Worte. Für Philip und Mo.*

## Entscheidungen unterwegs

- **M0, Branch:** Die Sitzung gibt `claude/project-thread-flvf7e` vor, darum dieser Name statt `auftrag/run-3` (01-regeln.md Abschnitt 7 erlaubt das).
- **M0, Ausführung:** Mo hat den Auftrag am 2026-11-09 in einer Projekt-Sitzung gestartet („do it all in succession and in the cloud“).

## Rückgaben an Sub-Agenten

## Probleme

## Bericht
