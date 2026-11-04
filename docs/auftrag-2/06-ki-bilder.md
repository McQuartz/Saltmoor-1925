# Bilder: Gegner, Bosse, Icons, Hintergründe

Philip, 2026-11-04: „scheiß erstmal auf die Steamregel, das soll erstmal von KI gemacht werden, damit man da geilere Ergebnisse bekommt und damit man auch einfach besser sich was vorstellen kann … alle auf einem Level wie bisher oder besser und das soll der auch kontrollieren, … der soll da nicht Shortcuts nehmen.“

Für diesen Auftrag gilt also: Die Steam-Frage ist zurückgestellt. **Klänge und Musik bleiben ohne KI.**

## 1. Wie die Bilder entstehen: die beste Methode, ohne Einschränkung

Philip, 2026-11-04: „Der Agent soll auf jeden Fall beste Möglichkeit nutzen, da nicht einschränken, um irgendwie Steam-konforme Grafiken zu generieren. Das ist jetzt gerade egal. Soll beste Methoden nutzen, um die geilsten Sprites generieren zu können.“

Zur Einordnung: Die bisherigen Figuren (auch die Favoriten Chorknabe, Hirte, Netzflickerin) hat Claude per Skript gezeichnet, also Formen und Pixel im Code, mit der Zielbild-Lichtkette. Das ist der Weg, der nachweislich funktioniert.

**Regel: Der Agent nimmt, was die besten Sprites ergibt.** Es gibt keine Einschränkung aus Steam-Gründen.

- **Weg A, selbst pixeln per Skript** wie in Auftrag 1 (`tools/sprites/`). Er ist immer verfügbar.
- **Weg B, Bild-Generator:** wenn die Sitzung ein Bild-Werkzeug hat oder Mo einen API-Schlüssel als Umgebungsvariable hinterlegt hat (z. B. `OPENAI_API_KEY`, `GEMINI_API_KEY`, `REPLICATE_API_TOKEN`, `PIXELLAB_API_KEY`). Das Ergebnis wird danach gepixelt (auf 96 × 120, Palette des Bioms, Bayer-Dither, kein Umriss, Randlicht mit der Lichtkette nachziehen) und von Hand im Skript nachgearbeitet. Schlüssel nie ins Repo oder in Logs.
- **Mischformen** sind erlaubt und oft am besten, z. B. ein Generator-Entwurf als Vorlage für Silhouette und Idee, sauber selbst gepixelt.

In M0 probiert der Agent mit dem Testgegner jeden verfügbaren Weg, legt die Ergebnisse nebeneinander neben die Favoriten und nimmt den besseren. Danach entscheidet er je Figur neu, was das beste Ergebnis bringt, und schreibt den Weg ins JSON (`"quelle": "skript"`, `"ki:<dienst>"` oder `"mix"`).

Was gleich bleibt, egal welcher Weg: **mehr Aufwand pro Figur und strenge Kontrolle** (Bewertungsbogen, Kontaktbogen neben den Favoriten, alles unter Note 4 neu). Die Schwächen aus Mos Bericht (Mumie, Nachgeher, Ertrunkener) zeigen, wo es bisher nicht gereicht hat.

## 2. Der Stil bleibt der bestätigte

Maßstab sind die Favoriten **Chorknabe, Hirte, Netzflickerin** und [docs/spritegen/zielbild.md](../spritegen/zielbild.md): dunkle Körper in Zonenfarben, Gegenlicht von hinten oben rechts, 1–2 px Randlicht, Fase statt Kuppeln, organische Formen, Bayer-Dither, **kein schwarzer Umriss**, leuchtende Augen als einzige helle Akzente, 96 × 120 px, harte Pixel.

Lovecraft als Quelle für Motive, keine Namen aus dem Mythos, keine Klischees (Liste in [docs/auftrag/05-hintergruende.md](../auftrag/05-hintergruende.md) Abschnitt 3).

## 3. Die Pipeline für Gegner und Bosse

Aufbauend auf `tools/sprites/` aus Auftrag 1 (bauen.js, lib.js, pruefen.js, kontakt.js). Jeder Schritt einzeln lauffähig.

Beschrieben für Weg A. Bei Weg B ersetzt der Generator die Schritte 2 und 3 als Vorlage, die Prüfung bleibt gleich.

1. **Entwurf in Worten:** Konzept aus `gegner-2.md`, dazu Silhouette in einem Satz und eine grobe Skizze der Hauptformen (Körper, Kopf, Glieder, das falsche Detail, Lage der Augen).
2. **Silhouette zuerst:** die Figur nur als schwarze Fläche bauen und als Bild ansehen. Erst wenn sie gefüllt sofort lesbar ist und sich von allen anderen Gegnern unterscheidet, geht es weiter. Mindestens zwei Silhouetten-Varianten probieren, die bessere nehmen.
3. **Formen, Licht, Pixel:** Zonenpalette des Bioms, Gegenlicht und Randlicht mit der Lichtkette, Fase, Bayer-Dither, Augen. Dann von Hand im Skript nacharbeiten (einzelne Pixel, Kanten, Details), bis es neben den Favoriten besteht.
4. **Animieren:** Gleiche Sheets wie bisher (idle 4, angriff 4, treffer 2, tod 6, siehe `assets/gegner/*.json`). Angriff mit echter Ausholbewegung, Gewicht, Tod mit pixelfx (Zerfall in der Stofffarbe).
5. **Prüfen:** `tools/sprites/pruefen.js` (Größe, Palette, kein Umriss, keine Zwischentöne, Augen die hellsten Pixel, Füße am Ankerpunkt). Kontaktbogen des Bioms **neben den drei Favoriten**, Bildschirmfoto in der Kampfszene, Note nach Abschnitt 5.
6. **Eintragen:** Sheet und JSON nach `prototype/assets/gegner/`.

Bosse gleich, nur größer erlaubt (bis 160 × 180 für Wächter, bis 240 × 220 für das Finale) und mit Phasen-Sheets.

## 4. Icons und Hintergründe

- **Item-Icons** (Philip: „icons zu standard und pixelig“): neu für alle etwa 70 Items, selbst gezeichnet wie die Gegner, 48 × 48, gleiche Lichtregeln, das Item schräg im Gegenlicht, die Stofffarbe als Glanz. Jede Silhouette muss sich bei 32 px noch unterscheiden. Dazu die Handgriff-Bilder (kleine Szenen aus Händen, Werkzeug, Geste), 48 × 32.
- **Hintergründe:** Code bleibt das Gerüst (Ebenen, Parallax, Boden mit Fluchtlinien, Nebel, Licht, Partikel), denn so entsteht die Tiefe. Neu: Wahrzeichen und große Requisiten dürfen als eigene, von Hand gepixelte Sprites entstehen (wie die Gegner) und vom Code in die Komposition gesetzt werden, wenn das besser aussieht als reine Formen-Funktionen.
- **Weg- und Ereignisbilder:** Jedes Ereignis darf ein kleines Bild bekommen (160 × 90, selbst gepixelt). Das hilft dem Ton.

## 5. Bewertungsbogen (jedes Bild, ehrlich)

Je Punkt 1 bis 5, Gesamtnote = schwächster Punkt. Unter 4 wird neu gemacht.

1. **Silhouette:** in Schwarz gefüllt sofort lesbar und von allen anderen Gegnern unterscheidbar.
2. **Licht:** Gegenlicht und Randlicht wie bei den Favoriten, keine Vorderbeleuchtung.
3. **Pixel:** harte Pixel, keine Matsch-Flächen, kein Umriss, Dither statt Verlauf.
4. **Konzept:** Man sieht, was er war und was an ihm falsch ist.
5. **Passt ins Biom:** Palette, Zeitschicht, neben den anderen Gegnern des Bioms stimmig.
6. **Im Spiel:** im Kampf-Bildschirmfoto groß genug, lesbar vor dem Hintergrund.

## 6. Verbotene Abkürzungen

- Ein Bild aus einem Generator ungepixelt oder nur verkleinert einbauen.
- Ein Bild für zwei Gegner, Umfärben als neuer Gegner.
- Weniger Animationsbilder als die bisherigen Sheets.
- Kontaktbogen oder Bildschirmfoto auslassen, Noten schönen.
- Fremder Stil (Anime, Chibi, Comic, glänzendes 3D), Text oder Signaturen im Bild.
- Bilder aus dem Netz oder von Asset-Seiten, Bilder mit erkennbaren Figuren aus anderen Spielen oder Filmen.
- Die Favoriten Chorknabe, Hirte, Netzflickerin ersetzen. Sie bleiben, sie sind der Maßstab (nur die Rückseite der Netzflickerin wird verbessert).
