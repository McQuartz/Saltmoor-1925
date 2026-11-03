# Recherche: echte prozedurale Sprite-Generierung

Stand: 2026-11-02. Ausführliche Fassung als Claude-Doc: https://claude.ai/artifact/9nxJnyUANU8YhgKCESvFPc

## Kurzantwort

Pixel-für-Pixel-Generierung ohne KI-Modell ist machbar. Die Grenze ist nicht die Technik, sondern die **Lesbarkeit**: Reiner Zufall auf Pixelebene ergibt Rauschen. Jeder gute Generator steckt Wissen über Form, Licht und Anatomie in Regeln. Diese Regeln sind die eigentliche Arbeit.

Empfohlener Weg: Gegner als **Skelett + Volumen** beschreiben, pro Bild rastern, automatisch schattieren, auf eine Palette bringen, mit Pixel-Art-Regeln aufräumen. Animation entsteht über das Skelett.

## Warum das Sprite-Labor nicht reicht

`prototype/lab.html` kombiniert von Hand entworfene Bauteile (Kapuze, Fischkopf, Häuserzeile). Der Zufall wählt nur aus und verschiebt Zahlen, darum ähnelt sich nach wenigen Würfen alles. So arbeiten auch Starbound und No Man's Sky bei Kreaturen.

| Ebene | Was der Zufall entscheidet | Ergebnis |
|---|---|---|
| Teile-Kombination (Labor) | welche Kapuze, welcher Kopf | lesbar, wiederholt sich |
| Form-Generierung | Skelett, Knochendicke, Rundungen, Proportionen | jede Silhouette neu, bleibt lesbar |
| Pixel-Generierung | jeder Pixel nach lokalen Regeln | maximal individuell, schwer lesbar |

Hauptweg ist Form-Generierung. Pixel-Regeln nur für Oberfläche, Licht und Aufräumen. **Kein einziges Körperteil wird vorgezeichnet.**

## Techniken

| Technik | Wie | Einsatz bei Saltmoor | Grenze |
|---|---|---|---|
| Masken mit Wahrscheinlichkeiten (Bollinger) | Raster mit „immer/nie/vielleicht“, Spiegelung, Umriss ([pixel-sprite-generator](https://github.com/zfedoran/pixel-sprite-generator)) | kleine Kreaturen, Items | ab ~24 px Rauschen |
| Skelett + Volumen (Metaballs, Signed Distance Fields) | Knochen mit Radius werden zu weichen Formen verschmolzen und gerastert | **Hauptweg für Gegner** | Anatomie-Regeln nötig, sonst „Kartoffeln“ |
| Automatische Schattierung | aus der Form pro Pixel Normale → Licht, Randlicht, Schatten auf fester Farbrampe | gemalter Look statt flach | braucht Aufräumregeln |
| Pixel-Art-Aufräumregeln | Einzelpixel weg, Treppen glätten, Banding brechen, selektiver Umriss | macht aus „gerendert“ „gepixelt“ | jede Regel einzeln testen, **schwerster Teil** |
| Rauschen (Perlin, Simplex, Worley) + Domain Warping | verzerrte Rauschfelder auf Paletten | Haut, Schleim, Fels, Nebel, Wasser, Himmel | keine Form |
| Zellautomaten | Zellen leben/sterben nach Nachbarn | Höhlen, Wucherungen, Fäulnis, Korallen | schwer steuerbar |
| L-Systeme, Space Colonization | Wachstumsregeln | Tentakel, Bäume, Adern, Rohre | nur Verzweigtes |
| Wave Function Collapse | lernt Nachbarschaftsmuster aus kleinem Beispielbild ([WFC](https://github.com/mxgmn/WaveFunctionCollapse), [Godot-Addon](https://godotengine.org/asset-library/asset/edit/9689)) | Hintergründe, Kacheln, Städte, Mauern | für Kreaturen zu ungeordnet |
| Markov-Ketten auf Pixeln | Statistik aus eigenen Sprites | eigenen Stil übernehmen | braucht eigenes Material |
| Evolution mit Auswahl (wie Picbreeder) | Kinder erzeugen, Menschen wählen, Parameter vererben | gute Parameterbereiche finden | Klickzeit |
| 3D-Modell → Pixel (wie [Dead Cells](https://80.lv/articles/case-study-dead-cells-character-art-pipeline/)) | prozedurales 3D, ohne Antialiasing, Stufenlicht | flüssige Animation, Drehungen | eigene 3D-Pipeline, zu aufwendig für uns |

**Gegner:** Skelett + Volumen, automatische Schattierung, Rauschen/Zellautomaten für Oberfläche, Aufräumregeln. Evolution als Werkzeug.
**Hintergründe:** WFC für Bauwerke und Boden, Rauschen für Himmel/Wasser/Nebel, L-Systeme für Bäume.

WFC und Markov sind Statistik aus Beispielen, kein generatives KI-Modell. Beispiele kommen von uns.

## Animation

- Zyklen (Atmen, Wiegen, Gehen, Schweben) als Sinus auf Gelenkwinkeln, ganzzahlige Frequenzen → nahtlose Loops.
- Nachziehen (Tentakel, Umhänge) als Verlet-Punktketten mit Federn.
- Inverse Kinematik: Füße bleiben am Boden.
- Angriffe als 3–4 Schlüsselposen je Körperbau, als Regeln formuliert.
- **Hauptproblem Pixel-Stabilität:** Neu gerasterte Bilder flackern an Rändern und Glanzlichtern. Gegenmittel: Texturen im Körperraum verankern, Bewegungen auf ganze Pixel runden, Aufräumregeln über mehrere Bilder prüfen.
- Rain World ist die bekannteste Referenz für prozedurale Kreatur-Animation.

## Editor und Eingriffe

Kein eigenes Malprogramm. Man bearbeitet die Absicht, der Generator malt:

| Eingriff | Umsetzung |
|---|---|
| Skelett und Proportionen | Gelenke ziehen, Dicke per Regler, sofort animiert |
| Malen mit Absicht | grob markieren „hier Augen / Wucherung / Rost“, hängt an der Körperstelle, wandert mit der Animation |
| Paletten | Farbrampen pro Zone |
| Mini-Pixelmodus | Stift, Radierer, Pipette, nur Palettenfarben, Zwiebelhaut. Korrektur hängt standardmäßig am Knochen, optional „nur dieses Bild“ |
| Größere Pixelarbeit | extern in [Pixelorama](https://github.com/Orama-Interactive/Pixelorama) (kostenlos, Godot) oder [Aseprite](https://www.aseprite.org/), nur für festgelegte Gegner wie Bosse |

## Was von Hand bleibt

Bosse und wenige Schlüsselgegner. Der Generator kann Rohentwürfe liefern.

## Quellen

- [Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse)
- [WFC-Addon Godot](https://godotengine.org/asset-library/asset/edit/9689)
- [pixel-sprite-generator](https://github.com/zfedoran/pixel-sprite-generator)
- [80 Level: Dead Cells Character Art Pipeline](https://80.lv/articles/case-study-dead-cells-character-art-pipeline/)
- Rain World, Starbound, No Man's Sky, Picbreeder: aus dem Gedächtnis genannt, nicht nachgeprüft.
