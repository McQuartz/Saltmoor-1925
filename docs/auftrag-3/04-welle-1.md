# Welle 1: sieben Fixes

Alles hier ist klein und die Ursache ist im Code gefunden (Stand `main` `80c4ea0`). Zeilen- und Funktionsnamen sind Fundstellen zum Einstieg, keine Garantie: Prüfe selbst, ob es noch weitere Stellen gibt, und behebe **alle**. Zu jedem Fix gehört ein automatischer Test in `tools/` (neue Datei `tools/test-welle1.js` oder in den passenden bestehenden Test), der vor dem Fix rot und danach grün ist. Beides kommt ins Abnahmeprotokoll.

## 1. Fragmentwände in 18 Biomen leer

**Befund:** `data/fragmente.json` hat 21 Fragmente für 7 Biome (je 3). In den übrigen 18 Biomen zeigt das Wandbild „Eine leere Wand“ (`js/ui/oberflaeche.js`, `wandbildHtml`). Figuren schalten bei 3, 6, 9 … 18 gelesenen Fragmenten frei (`js/core/meta.js`, `figurFrei`), wer die neuen Biome spielt, kommt kaum voran.

**Umsetzung:**

- Für jedes der 18 Biome ohne Fragmente drei neue Fragmente, **54 neue Texte**, im Format der vorhandenen: `id` (`<biom>_1` bis `_3`), `biom`, `titel`, `text`, `relief` (die Beschreibung des Reliefs, aus der das Wandbild gemalt wird), optional `schaltet` (Item-Freischaltung). Dazu `"entwurf": true`.
- Inhalt: Jedes Fragment ist ein **Zeugnis** (Inschrift, Notiz, Aussage, Gegenstand), erzählt etwas über das Biom, das man im Bild nicht sieht, und nimmt das „falsche Detail“ aus dem Steckbrief des Bioms auf ([docs/auftrag-2/05-inhalte.md](../auftrag-2/05-inhalte.md), [docs/auftrag-2/biome-2.md](../auftrag-2/biome-2.md), `docs/auftrag-2/biome/<biom>.md`). Die drei Fragmente eines Bioms bauen aufeinander auf. Länge wie die vorhandenen (2 bis 4 Sätze).
- `schaltet`: Verteile Item-Freischaltungen so, dass jedes neue Biom höchstens eine hat und nur Items freigeschaltet werden, die heute schon im Pool sind, aber noch keine Freischaltung haben. Liste im Bericht.
- Reliefs: Das Wandbild malt das Relief aus `relief` (`reliefMalen`). Prüfe für jedes neue Fragment mit einem Bildschirmfoto, dass das gemalte Relief zum Text passt und lesbar ist. Reicht der vorhandene Relief-Maler für ein Motiv nicht, erweitere ihn, statt das Motiv zu vereinfachen.
- Die Figuren-Schwellen (`frei_ab`) bleiben. Mit 75 Fragmenten sind alle 9 Figuren erreichbar.

**Test:** Jedes Biom in `run.json → akte[].biome` hat genau 3 Fragmente. Kein Wandbild zeigt „Eine leere Wand“ (Autospieler 50 Seeds, alle Wandbild-Knoten prüfen). Freischaltung bei 3 gelesenen Fragmenten aus neuen Biomen funktioniert.

**Arbeitsteilung:** Texte schreibt ein Sonnet-Agent nach der Auftragsvorlage in [08-dirigent.md](08-dirigent.md) (je Akt ein Auftrag, mit Steckbrief, vorhandenen Fragmenten als Stilvorlage und den Quellen). Du liest jeden Text selbst und gibst ihn frei oder zurück.

## 2. Beute-Satz immer gleich

**Befund:** Auf dem Belohnungsbildschirm steht immer „Unter dem, was übrig ist, liegt etwas.“ (`js/ui/oberflaeche.js`, `rewardHtml`, um Zeile 145). Biome haben `beute_saetze`, Gegner `beute_satz`, beides wird nie angezeigt. Der Satz ist der Ersatztext.

**Umsetzung:** Reihenfolge: hat der zuletzt besiegte Gegner (bei mehreren: der stärkste) einen `beute_satz`, dann der; sonst ein Satz aus `beute_saetze` des Bioms, über den Seed gewählt, nie zweimal hintereinander derselbe; sonst der Ersatztext. **Kein Text wird neu geschrieben oder geändert.**

**Test:** 50 Seeds, alle Belohnungsbildschirme: Anteil Ersatztext unter 5 %, kein Satz zweimal hintereinander.

## 3. Eingehender Schaden bleibt nach dem Treffer stehen

**Befund:** Die Absicht der Gegner bleibt nach dem Gegnerzug sichtbar, bis der nächste Spielerzug beginnt.

**Umsetzung:** Nach dem Gegnerzug wird die Absicht ausgeblendet (Plakette zeigt nur Leben). Die neue Absicht erscheint zum Zugbeginn, mit derselben kurzen Einblendung wie heute. Die Schadensvorschau im eigenen Balken (Schraffur) verschwindet im selben Moment.

**Test:** Zustand nach `endTurn` bis `startTurn`: keine Absicht im DOM sichtbar, Vorschau 0.

## 4. Verringerter Schaden mit durchgestrichenem Original

**Befund:** `absicht()` in `js/ui/oberflaeche.js` baut bei Schwäche `<s>${v}</s>${n}`.

**Umsetzung:** Nur den echten Wert zeigen. Der Grund („Geschwächt: halber Schaden“) steht im Tooltip der Plakette beim Drüberfahren. Suche nach allen weiteren `<s>`, `<del>` und `line-through` in Kampfanzeigen und behandle sie genauso.

**Test:** Kein `<s>`/`<del>`/`line-through` in Absicht, Karte oder Balken (DOM-Prüfung in einem Kampf mit geschwächtem Gegner).

## 5. „−x Leben“ unter der Lebensleiste

**Umsetzung:** Die Zeile kommt weg. Der drohende Verlust steht im Balken: Zuerst bricht das Blau (Block), der rote Rest ist schraffiert (wie in [vorlagen/hud-variante-2.png](vorlagen/hud-variante-2.png)). Hängt mit M2 zusammen: In M1 die Zeile entfernen und die Schraffur im bestehenden Balken einbauen, in M2 zieht sie in den neuen Balken um.

**Test:** Kein Text „Leben“ mit Minuszahl unter dem Balken. Schraffur-Breite = `max(0, eingehend − Block)` relativ zu max. Leben.

## 6. Reaktionen verstärken Ziehen, Stärke und Gold

**Befund:** Der Faktor der Reaktion (z. B. „Verstärkt“ ×1,5, Opfer doppelt) wirkt in `applyMain` (`js/core/combat.js`) auf Schaden, Block, Heilung, Gift und Brand, aber nicht auf Ziehen, Energie, Gold, Stärke, Schwäche.

**Umsetzung:** Der Faktor wirkt zusätzlich auf **Ziehen, Stärke und Gold**, gerundet nach der Regel der übrigen Werte (×1,5 aus 2 ergibt 3, aus 1 ergibt 2). **Energie bleibt unverstärkt.** Schwäche bleibt, wie sie ist. Die Kartenvorschau (`previewCard`) und der Tooltip zeigen den verstärkten Wert.

**Test:** Karte „ziehe 2“ mit Verstärkt zieht 3. Karte „+1 Energie“ mit Verstärkt gibt 1. Gold und Stärke entsprechend. Build-Bots danach laufen lassen, Siegraten mit vorher vergleichen, Abweichung über 8 Prozentpunkte bei einem Build begründen oder in `balance.json` ausgleichen.

## 7. Boss allein unverwundbar

**Befund:** Sechs Wächter und Bosse haben einen Musterschritt mit `unverw` (Pakete `funkstation`, `kurhaus`, `waisenhaus`, `mond`, `ziegelgruben`, `station`). Ist sonst kein Gegner da, kann man nur Zug beenden.

**Umsetzung:**

- `unverw` gilt nur, **solange mindestens ein Diener lebt** (gerufener oder mitgebrachter Gegner).
- Ist der Boss allein, wird derselbe Musterschritt zu **Panzer**: ein dicker Block, der nur direkten Schaden abfängt. Gift und Brand wirken weiter, Block lohnt sich, Angreifen auch. Höhe in `balance.json → panzer` (Vorschlag: 40 % des max. Lebens des Bosses, gerundet auf 5; per Bot prüfen, dass ein Panzer-Zug den Kampf um höchstens einen Zug verlängert).
- Anzeige: Die Plakette zeigt im Unverwundbar-Zug, dass der Schutz an den Dienern hängt (eine dünne Linie von der Plakette zu jedem Diener). Im Panzer-Zug zeigt sie den Panzer als eigenen Block-Wert. Kein neuer Text außer dem Tooltip-Satz für Panzer (`entwurf: true`).

**Test:** Boss mit `unverw` allein: nimmt Gift-Schaden, Panzer fängt direkten Schaden ab. Mit Diener: unverwundbar. Diener stirbt im selben Zug: Schutz fällt sofort.

## Abnahme Welle 1

Alle sieben Tests grün, vorher rot (Beleg im Protokoll). Autospieler 50 Seeds ohne Fehler. Bildschirmfotos: Wandbild aus drei neuen Biomen, Belohnung mit Biom-Satz, Kampf nach Gegnerzug (keine Absicht), geschwächter Gegner, Balken mit Schraffur, Verstärkt + Ziehen, Boss mit Panzer.
