# Start-Prompt (Auftrag 4)

Alles zwischen den Linien komplett kopieren. Sitzung mit **Opus, Effort mittel** starten.

---

Du arbeitest allein und ohne Rückfragen am Spiel „Saltmoor 1925“ im Repo `McQuartz/saltmoor-1925`. Projektsprache ist Deutsch (Code-Kommentare, Doku, Commits, Bericht).

**Deine Rolle:** Du bist der Dirigent. Du liest, planst, verteilst Arbeit an Sub-Agenten (Sonnet und Haiku), prüfst jedes Ergebnis selbst und baust es zusammen. Du bist für jede Zeile verantwortlich, die in den Branch kommt. Wie du Sub-Agenten einsetzt, steht verbindlich in `docs/auftrag-3/08-dirigent.md`.

**Dein Auftrag:** Das Spiel unter `prototype/` (Stand `main`) soll nicht mehr nach Prototyp aussehen, ohne Stilbruch: Tiefe im Kampfbild, die neue Kampfoberfläche mit Fußleiste und Schultern, Bewegung beim Spielen, die anderen Bildschirme als Szenen. Getrennt davon der Block „Momentum im Build-Flow“. Der vollständige Auftrag liegt in `docs/auftrag-4/`, der Plan in `docs/auftrag-4/plan.md`. **Philips Worte in `docs/auftrag-4/00-philip.md` sind die Absicht hinter allem.** Die Mockups in `docs/auftrag-4/vorlagen/` sind abgenommen: Das Spiel soll am Ende so aussehen wie `look-runde-7` (Kampfoberfläche) und `look-runde-2` mit „Alles“ ohne Vordergrund (Tiefe).

**So gehst du vor:**

1. Lies selbst, in dieser Reihenfolge: `CLAUDE.md`, `docs/auftrag-4/README.md`, `00-philip.md`, `plan.md`, `verlauf-look-runden.md` und `fortschritt.md` (alle in `docs/auftrag-4/`). Danach `docs/auftrag-3/01-regeln.md`, `08-dirigent.md`, `09-pruefen.md`, `05-oberflaeche.md`, `docs/auftrag-3/fortschritt.md` (Abschnitt „Bericht“), `prototype/data/README.md` und `docs/spritegen/zielbild.md`. Lies diese Dateien selbst und lass sie dir nicht von einem Sub-Agenten zusammenfassen.
2. Starte im Ordner `docs/auftrag-4/vorlagen/` einen lokalen Server und öffne alle sieben Mockups mit Playwright. Sieh dir die Bildschirmfotos selbst an, schalte in Runde 7 durch Kartenzahl, Schulterform und Bildgröße und in Runde 2 durch die Lichtpult-Schalter. Lies den Code von Runde 7: `slice9()`, `fussBild()`, `passen()`, die Überlappungsprüfung und die Verdeckungsmessung sollst du übernehmen statt neu zu erfinden. Maße stehen im Plan und im Mockup, bei Widerspruch gilt der Plan.
3. Steht in `docs/auftrag-4/fortschritt.md` schon ein Stand, machst du dort weiter. Sonst misst du zuerst die Basis (Tests, Bilder vom Kampf in Kapelle und Salzstollen) und beginnst mit Phase 0.
4. Arbeite die Phasen 0 bis 4 **der Reihe nach** ab. Phase 1 und 2 dürfen nach Phase 0 parallel laufen (Szene und Oberfläche berühren verschiedene Dateien). Den Block „Momentum im Build-Flow“ Stufe 1 baust du nach Phase 2 oder am Ende, als eigene Commits, damit Philip den Flow getrennt vom Look testen kann; Stufe 2 (Westentasche) nicht. Eine Phase ist erst fertig, wenn ihre Abnahme aus `plan.md` erfüllt **und von dir selbst geprüft** ist (Abnahmeprotokoll nach `docs/auftrag-3/09-pruefen.md`).
5. **Konflikte:** Der Abschnitt „Konflikte“ in `plan.md` sagt, welche Stelle aus Auftrag 3 abgelöst wird. Die alte Stelle wird entfernt, nicht überdeckt. Was der Plan nicht ablöst, bleibt wie in Auftrag 3.
6. **Offene Punkte:** Nimm die Standards aus `plan.md`: Schultern eckig (geschwungen als Schalter in den Einstellungen anlegen), Ziehstapel und Ablage außen auf den Schultern, Reaktions-Band über der Unterkante des Bildfensters, Bildraum 560 × 315 (nur wenn die Glättung sichtbar stört: 640 × 360, mit Begründung und Vergleichsbildern). Trag jede Wahl in `fortschritt.md` unter „Fragen an Philip“ ein.
7. **Stelle keine Fragen.** Entscheide nach `docs/auftrag-3/01-regeln.md` Abschnitt 2, trag die Entscheidung mit einem Satz Begründung in `fortschritt.md` ein und arbeite weiter. Es antwortet niemand.
8. **Nicht ändern:** Texte und Sprüche im Spiel bleiben wörtlich, wie sie sind. Nicht dabei sind: Vordergrund-Formen vor den Gegnern, eine Hand, die abtaucht oder nur halb zu sehen ist, kleinere Karten, die Kreativ-Entwürfe Laterne, Séance und Film. Gegner werden nicht mehr skaliert.
9. **Keine Abkürzungen.** Was in `docs/auftrag-3/01-regeln.md` Abschnitt 4 und `08-dirigent.md` Abschnitt 6 verboten ist, ist verboten. Szenenränder, die der Generator nicht erzeugen kann, werden gemalt und nicht gespiegelt (die Spiegelung im Mockup zeigt nur die Fläche).
10. Prüfe alles selbst: Tests, Autospieler, Bildschirmfotos mit Playwright/Chromium bei 1920 × 1080, 1280 × 720 und einer schmalen Fenstergröße. Sieh dir jedes Bild selbst an. Im Browser sofort den Ton stummschalten (`audioOn=false`) und Test-Tabs danach schließen.
11. Committe nach jedem funktionierenden Schritt, pushe nach jeder Phase auf deinen Arbeits-Branch, halte einen **Draft-Pull-Request** gegen `main` aktuell. Merge nicht selbst und pushe nie auf `main`.
12. Wenn das Budget knapp wird: die laufende Phase auf einen sauberen, spielbaren Stand bringen, committen, `fortschritt.md` und den PR-Bericht aktualisieren.
13. Am Ende: Bericht nach `docs/auftrag-3/01-regeln.md` Abschnitt 9 in den Pull Request und als Abschluss in `fortschritt.md`, mit Vorher-nachher-Bildern vom Kampf und jedem umgebauten Bildschirm.

Fang jetzt mit Schritt 1 an.

---
