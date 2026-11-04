# Runübergreifende Progression

Stand 2026-11-03 (M5). Grundlage: Briefing Abschnitt 8, Wandbild-Fragmente und Tagebuch. Keine Sog-Mechanik.

## Ziel

Fast jeder Abstieg soll etwas Neues zeigen, auch ein verlorener. Was bleibt, soll die Welt erzählen (wer war vor uns hier, was ruft) und den nächsten Abstieg anders machen, ohne dass der erste Run sich wie ein Pflichtprogramm anfühlt.

## Drei Varianten im Vergleich

| | A: Nur Fragmente | B: Fragmente + Schwellen + Stufen | C: Währung zwischen Runs |
|---|---|---|---|
| Was bleibt | gelesene Fragmente | Fragmente, tiefster erreichter Akt, Siege | Salzkristalle, die man am Strand ausgibt |
| Freischaltungen | Figuren (3/6/9 Fragmente), Items im Fundpool | wie A, dazu Startvarianten beim ersten Erreichen von Akt II, III, IV und Schwierigkeitsstufen nach dem ersten Sieg | Figuren, Items, Boni im Laden kaufen |
| Takt | hängt davon ab, ob man Wandbilder wählt; ein Run ohne Wandbild bringt nichts | Wandbild-Runs bringen Fragmente, frühe Runs bringen Schwellen, nach dem Sieg bringen Stufen neues Ziel | gleichmäßig, aber immer gleich |
| Neues System | keins | klein: drei Startvarianten, ein Multiplikator | groß: Währung, Laden, Preise |
| Motivation | Neugier auf die Geschichte | Neugier + spürbar weiter kommen + Herausforderung danach | Sammeln, eher Fleiß als Neugier |

## Entscheidung: Variante B

Nach der Regel „spielbarer und lesbarer, weniger neue Systeme“: B braucht kaum mehr als A, schließt aber die Lücke, dass ein Run ohne Wandbild nichts bringt. C würde eine Währung einführen, die mit dem Gold im Run konkurriert und die Fragmente zur Nebensache macht.

## So funktioniert es

- **Fragmente** (21, drei je Biom, `data/fragmente.json`): Ein Wandbild-Knoten zeigt das nächste ungelesene Fragment seines Bioms. Gelesen bleibt gelesen. 12 Fragmente nehmen ein Item in den Fundpool auf (z. B. Bootshaken, Sense, Grubenlampe), die anderen erzählen nur.
- **Figuren**: Fischer, Friedhofswärter, Pfarrerin von Anfang an. Detektiv ab 3, Okkultist ab 6, Kneipenschläger ab 9 gelesenen Fragmenten.
- **Startvarianten**: Beim ersten Erreichen von Akt II wird „Ersparnisse“ frei (+25 Gold), von Akt III „Ein Erbstück“ (ein seltenes Item im Rucksack), von Akt IV „Zähe Natur“ (+6 max. Leben). Bei der Figurwahl wählt man höchstens eine.
- **Schwierigkeitsstufen**: Nach dem ersten Sieg wird Stufe II frei, nach jedem Sieg auf der höchsten Stufe die nächste (bis VI). Jede Stufe gibt Gegnern +12 % Leben, ab Stufe III zusätzlich +1 Angriff je zwei Stufen.
- **Tagebuch** im Titel: Abstiege, Ankünfte (Bleiben/Umkehren), größte Tiefe, erreichte Orte, alle Fragmente (ungelesene als „…“).
- **Strand und Ende** zeigen, was in diesem Abstieg neu frei wurde.

## Takt (Ziel)

| Run | typisch neu |
|---|---|
| 1 | 1–2 Fragmente, Startvariante „Ersparnisse“ (Akt II erreicht) |
| 2–3 | Fragmente, Detektiv (3), ein Item im Fundpool |
| 4–6 | „Ein Erbstück“ (Akt III), Okkultist (6), weitere Items |
| 7–12 | Kneipenschläger (9), „Zähe Natur“, erste Ankunft → Stufe II |
| danach | restliche Fragmente, Stufen III–VI |

Gemessen mit dem Autospieler (20 Runs, gemeinsamer Meta-Speicher): siehe `fortschritt.md`, Abschnitt M5.

## Speicher

`localStorage` `saltmoor.meta.v1` (`js/core/meta.js`). Dev-Modus → Cheats: „Meta zurücksetzen“, „Alles freischalten“. Dev-Runs (mit Cheats) zählen nicht.
