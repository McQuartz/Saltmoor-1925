# M5 Animations-Sheets

Je Datei: Zeile 1 Idle (8 Bilder, Loop), 2 Angriff (8), 3 Treffer (6), 4 Tod (8). 2-fach vergrößert, Nebelhintergrund nur zur Beurteilung.

## Flacker-Maß (Stand 2026-11-03, Startwerte)

Anteil der Randpixel, die zwischen zwei aufeinanderfolgenden Bildern ihren Wert ändern (Vereinigung der Ränder beider Bilder).
„still“ = Idle mit Amplitude 0,15: fast keine Bewegung, also reines Raster-/Dither-Flackern. **Muss künftig sinken.**

| Gegner | idle | attack | hit | death | idle still |
|---|---|---|---|---|---|
| biped hafen 1 | 0,513 | 0,795 | 0,799 | 0,803 | 0,201 |
| blob kapelle 5 | 0,474 | 0,785 | 0,648 | 0,774 | 0,103 |
| floater hafen 4 | 0,755 | 0,880 | 0,849 | 0,866 | 0,252 |
| crawler wald 3 | 0,433 | 0,558 | 0,535 | 0,664 | 0,094 |
| worm grund 6 | 0,457 | 0,676 | 0,619 | 0,652 | 0,127 |

Einordnung: Die hohen Werte bei attack/hit/death sind echte Bewegung (große Posenwechsel bei 6–8 Bildern). Aussagekräftig ist „still“:
10–25 % der Randpixel ändern sich schon bei minimaler Bewegung, vor allem durch Dither und Randlicht am Rand. Hebel für später:
Dither-Schwellen im Körperraum statt in Bildkoordinaten verankern, Randlicht-Suche mit Hysterese, Bewegungen auf ganze Pixel runden.
