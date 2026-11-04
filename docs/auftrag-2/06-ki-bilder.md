# KI-Bilder: Gegner, Bosse, Icons, Hintergründe

Philip, 2026-11-04: „scheiß erstmal auf die Steamregel, das soll erstmal von KI gemacht werden, damit man da geilere Ergebnisse bekommt und damit man auch einfach besser sich was vorstellen kann … alle auf einem Level wie bisher oder besser und das soll der auch kontrollieren, … der soll da nicht Shortcuts nehmen.“

Für diesen Auftrag gilt also: **Gegner, Bosse, Item-Icons und Teile der Hintergründe dürfen und sollen mit einem Bild-Generator entstehen.** Die Steam-Frage („keine KI-Assets“) ist zurückgestellt. Jedes KI-Bild wird markiert, damit man es später ersetzen kann. **Klänge und Musik bleiben ohne KI.**

## 1. Zugang zum Bild-Generator

Der Agent prüft in M0, welcher Weg geht, und schreibt das Ergebnis in `fortschritt.md`.

1. **Werkzeug in der Sitzung:** Hat die Sitzung ein Bild-Werkzeug (MCP o. Ä.), wird es benutzt.
2. **API mit Schlüssel:** Mo legt vor dem Start einen Schlüssel als Umgebungsvariable an. Der Agent schreibt einen kleinen Adapter unter `tools/ki-bild/` (Node-Bordmittel, `fetch`), der einen dieser Dienste anspricht, je nachdem, welche Variable gesetzt ist:
   - `OPENAI_API_KEY` (Bild-Modell von OpenAI)
   - `GEMINI_API_KEY` (Bild-Modell von Google)
   - `REPLICATE_API_TOKEN` (Pixel-Art-Modelle auf Replicate)
   - `PIXELLAB_API_KEY` (auf Pixel-Art spezialisiert)
   Der Schlüssel landet nie im Repo, nie in Logs, nie in Commits. Die Netzwerkfreigabe für den Dienst muss in Mos Umgebung erlaubt sein.
3. **Ersatzweg:** Geht nichts davon, zeichnet der Agent wie bisher per Skript mit der Zielbild-Lichtkette (`tools/sprites/`). Das schreibt er **oben** in den Pull Request, damit Philip und Mo es sofort sehen, und er hält dieselbe Qualitätsprüfung ein.

Budget: höchstens `BILD_BUDGET` Bilder (Umgebungsvariable, Standard 800). Der Agent zählt mit und schreibt den Stand in `fortschritt.md`.

## 2. Der Stil bleibt der bestätigte

Maßstab sind die Favoriten **Chorknabe, Hirte, Netzflickerin** und [docs/spritegen/zielbild.md](../spritegen/zielbild.md): dunkle Körper in Zonenfarben, Gegenlicht von hinten oben rechts, 1–2 px Randlicht, Fase statt Kuppeln, organische Formen, Bayer-Dither, **kein schwarzer Umriss**, leuchtende Augen als einzige helle Akzente, 96 × 120 px, harte Pixel.

Lovecraft als Quelle für Motive, keine Namen aus dem Mythos, keine Klischees (Liste in [docs/auftrag/05-hintergruende.md](../auftrag/05-hintergruende.md) Abschnitt 3).

## 3. Die Pipeline für Gegner und Bosse

Alles unter `tools/ki-bild/`, jeder Schritt ein Skript, das man einzeln laufen lassen kann.

1. **Prompt bauen** (`prompt.js`): aus dem Konzept in `gegner-2.md` plus einem festen Stil-Block (Licht, Palette des Bioms als Hex-Werte, Silhouette, „single creature, full body, side-three-quarter view facing left, flat chroma background #ff00ff, no outline, no text“). Wenn der Dienst Bild-Eingaben kann: die drei Favoriten als Stil-Referenz mitschicken (8-fach vergrößert, nächster Nachbar). Prompt und Antwort-Metadaten (ohne Schlüssel) nach `prototype/assets/gegner/_ki/<id>.json`.
2. **Erzeugen** (`erzeugen.js`): 4 Kandidaten je Gegner. Der Agent sieht sie sich an und wählt nach dem Bewertungsbogen (Abschnitt 5). Kein Kandidat gut genug → Prompt ändern, neu erzeugen, nicht den schwächsten nehmen.
3. **Pixeln** (`pixeln.js`): Hintergrund freistellen, auf 96 × 120 bringen (Füße auf `fuss`, Kopf oben frei), auf die Palette des Bioms abbilden (4 Körperstufen, 2 Randlicht, Augenfarbe, höchstens 2 Zusatzfarben), Übergänge mit Bayer 4×4, Kantenglättung und Umriss entfernen. Danach das Randlicht mit der vorhandenen Lichtkette (`tools/sprites/lib.js`, Mos `rim.gd`) nachziehen, damit alle Gegner gleich beleuchtet sind.
4. **Animieren** (`animieren.js`): Gleiche Sheets wie bisher (idle 4, angriff 4, treffer 2, tod 6, siehe `assets/gegner/*.json`). Die Grundpose kommt aus dem Bild. Für den Angriff eine zweite KI-Pose mit Referenz auf die erste (gleicher Gegner), Zwischenbilder per Code (Verformung in Teilen, Gewicht, Atmen). Treffer per Code, Tod mit pixelfx (Zerfall in der Stofffarbe).
5. **Prüfen** (`tools/sprites/pruefen.js`, erweitern): Größe, Palette, kein Umriss, keine Zwischentöne, Augen die hellsten Pixel, Füße am Ankerpunkt. Kontaktbogen des Bioms **neben den drei Favoriten** (`kontakt.js`), Bildschirmfoto in der Kampfszene.
6. **Eintragen**: Sheet und JSON nach `prototype/assets/gegner/`, Feld `"quelle": "ki:<dienst>"` im JSON.

Bosse gleich, nur größer erlaubt (bis 160 × 180 für Wächter, bis 240 × 220 für das Finale) und mit Phasen-Sheets.

## 4. Icons und Hintergründe

- **Item-Icons** (Philip: „icons zu standard und pixelig“): neu für alle etwa 70 Items, 48 × 48, gleiche Lichtregeln, das Item schräg im Gegenlicht, die Stofffarbe als Glanz. Jede Silhouette muss sich bei 32 px noch unterscheiden. Dazu die Handgriff-Bilder (kleine Szenen aus Händen, Werkzeug, Geste), 48 × 32.
- **Hintergründe:** Code bleibt das Gerüst (Ebenen, Parallax, Boden mit Fluchtlinien, Nebel, Licht, Partikel), denn so entsteht die Tiefe. Neu dürfen **Requisiten und Ferne per KI** entstehen: das Wahrzeichen, große Formen im Mittelgrund, Vordergrund-Rahmung, jeweils freigestellt und gepixelt wie die Gegner, und vom Code in die Komposition gesetzt. Der Agent baut pro Biom die Code-Fassung und die gemischte Fassung, vergleicht beide als Bildschirmfoto nebeneinander und nimmt die bessere. Die Wahl kommt mit Begründung in `fortschritt.md`.
- **Weg- und Ereignisbilder:** Jedes Ereignis darf ein kleines Bild bekommen (160 × 90, KI, gepixelt). Das hilft dem Ton.

## 5. Bewertungsbogen (jedes Bild, ehrlich)

Je Punkt 1 bis 5, Gesamtnote = schwächster Punkt. Unter 4 wird neu gemacht.

1. **Silhouette:** in Schwarz gefüllt sofort lesbar und von allen anderen Gegnern unterscheidbar.
2. **Licht:** Gegenlicht und Randlicht wie bei den Favoriten, keine Vorderbeleuchtung.
3. **Pixel:** harte Pixel, keine Matsch-Flächen, kein Umriss, Dither statt Verlauf.
4. **Konzept:** Man sieht, was er war und was an ihm falsch ist.
5. **Passt ins Biom:** Palette, Zeitschicht, neben den anderen Gegnern des Bioms stimmig.
6. **Im Spiel:** im Kampf-Bildschirmfoto groß genug, lesbar vor dem Hintergrund.

## 6. Verbotene Abkürzungen

- KI-Bild ungepixelt oder nur verkleinert einbauen.
- Ein Bild für zwei Gegner, Umfärben als neuer Gegner.
- Weniger Animationsbilder als die bisherigen Sheets.
- Kontaktbogen oder Bildschirmfoto auslassen, Noten schönen.
- Fremder Stil (Anime, Chibi, Comic, glänzendes 3D), Text oder Signaturen im Bild.
- Bilder aus dem Netz oder von Asset-Seiten, Bilder mit erkennbaren Figuren aus anderen Spielen oder Filmen.
- Die Favoriten Chorknabe, Hirte, Netzflickerin durch KI ersetzen. Sie bleiben, sie sind der Maßstab (nur die Rückseite der Netzflickerin wird verbessert).
