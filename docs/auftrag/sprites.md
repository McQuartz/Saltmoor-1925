# Gegner-Sprites: Weg und Werkzeug (M6)

Stand 2026-11-03. In der Sitzung gab es keinen Bild-Generator. Darum gilt der **Ersatzweg aus M6**: Jedes Sprite ist in einem eigenen Skript als Formen gezeichnet und wird mit der Licht-, Randlicht- und Dither-Kette aus [zielbild/referenz/render.js](../spritegen/zielbild/referenz/render.js) gerendert. Die Konzepte stehen in [gegner.md](gegner.md), die Werte in `prototype/data/foes_m7.json`.

## Kurz

```sh
node tools/sprites/bauen.js            # alle Sheets -> prototype/assets/gegner/ (+ Vorschauen in tools/sprites/vorschau/)
node tools/sprites/bauen.js hirte      # nur ein Gegner (alle Varianten)
node tools/sprites/pruefen.js          # Regel-Prüfung aller Sheets, Exitcode 1 bei Verstoß
node tools/sprites/kontakt.js          # beschriftete Kontaktbögen -> docs/auftrag/bilder/M6, M7 (Playwright)
node tools/sprites/vergleich.js        # Favoriten neben Zielbild, ×4 -> tools/sprites/vorschau/vergleich.png
node tools/sprites/vorschau_reihe.js hirte:hirte_b wurm   # schnelle Reihe Idle-Bild 0 -> vorschau/reihe.png
```

Nur Node-Bordmittel (zlib, eigener PNG-Schreiber und -Leser). Für `kontakt.js` braucht es Playwright/Chromium. `tools/sprites/vorschau/` ist Arbeitsablage und steht in `.gitignore`.

## Dateien

| Datei | Zweck |
|---|---|
| `tools/sprites/lib.js` | Paletten je Zone, Formen (Ellipse `E`, Kapsel `C`, Polygon `Pg`, Kette `chain`, Glied mit Knick `glied`, zerfetzter Saum `saum`), Renderer, Pinsel für Details (Augen, Glühen, Linien), Treffer-Aufhellen, Zerfall, PNG, Sheet-Bau, gemeinsame Pose `pose()` |
| `tools/sprites/gegner/<id>.js` | ein Gegner: Formen als Funktion von Animation und Bild, Varianten |
| `tools/sprites/bauen.js` | baut alle Sheets und JSON, dazu Vorschauen und Gesamt-Kontaktbogen (`vorschau/alle.png`, `vorschau/silhouetten.png`) |
| `tools/sprites/pruefen.js` | Regel-Prüfung (siehe unten) |
| `tools/sprites/kontakt.js` | beschriftete Bögen für die Doku |

## Sheet-Format (verbindlich für den Lader)

PNG: Zeilen sind die Animationen in der Reihenfolge **idle, angriff, treffer, tod**, Spalten sind die Bilder. Alle Bilder haben dieselbe Größe w × h. Leere Zellen bleiben transparent. Dazu gehört eine JSON-Datei:

```json
{"id":"hirte","rang":"normal","w":96,"h":120,"zone":"moor",
 "anim":{"idle":{"zeile":0,"n":4,"fps":4,"loop":true},"angriff":{"zeile":1,"n":4,"fps":10},
         "treffer":{"zeile":2,"n":2,"fps":12},"tod":{"zeile":3,"n":6,"fps":8}},
 "fuss":[48,116],"kopf":[48,4],"augen":[[47,30],[30,9]],"augenfarbe":"#9affe0"}
```

- `fuss` ist der Punkt, auf dem die Figur steht. Bei Schwebenden (Augen, Boss Phase 3) ist es der Schattenpunkt.
- `kopf` ist der Punkt über dem Kopf für die Absichtsanzeige.
- `augen` sind die Lichtpunkte im Idle-Bild 0 (Augen, Knoten, Laterne) für das Glühen im Spiel.
- `augenfarbe` ist die Glutfarbe der Zone.
- Größen: normal 96 × 120, Wächter 128 × 160, Boss 160 × 160. Der Boss hat ein Sheet je Phase (`ruft_p1`, `ruft_p2`, `ruft_p3`).
- Das letzte Tod-Bild ist leer (zerfallen). Der Lader kann den Gegner danach entfernen.

## Paletten (`ZONEN` in lib.js)

Je Zone gibt es 4 dunkle Körperstufen, 2 Randlicht-Stufen (innen, außen), `glutDim` (gedithertes Glühen), `glut` (Augenfarbe), `kern` (hellstes Pixel, Augenmitte, Flamme) und wenige erlaubte Zusatzfarben. Die Werte stammen aus [zielbild.md](../spritegen/zielbild.md) und [04-welt-und-run.md](04-welt-und-run.md). Bewusst geändert habe ich:

- **kern** ist neu: ein heller Augenkern je Zone, damit das hellste Pixel immer im Auge liegt (Regel „hellste Pixel nur in Augen“). Die Augenfarben aus den Steckbriefen sind jetzt `glut`.
- **salz:** Das Randlicht außen ist `#d8cec4` statt `#f4ece4`. Das alte war heller als die Augen (`#ff9a5a`), die Augen bekommen den Kern `#ffe6cc`.
- **eis:** Das Randlicht außen ist `#c8e2f6` statt `#e8f6ff`. Die roten Augen `#ff4a4a` bekommen den Kern `#ffe2dc`.
- **pforte (= Grund türkis):** Das Randlicht außen ist `#8af0e0` statt `#a0fff0`. Dazu kommen die Zusatzfarben `magenta1`/`magenta2` für die „Farbe, die es nicht gibt“ am Boss.
- **kapelle:** Zusatzfarbe `flamme` `#e8902e` und ein bernsteinfarbenes `glutDim` `#6e4418` für den Kerzenschein.
- **moor** ist die Wald-Palette (violett), **moor_gruen** die Moor-Palette (grün) als Variante (Nest a, Torfstecherin b). **stadt** ist Rost.

## Ein neues Sprite anlegen

1. **Konzept zuerst** in `gegner.md`: Motiv, wer er war, was falsch ist, Silhouette in einem Satz, Muster, Schwachstelle mit Grund, Stimme. Danach der Eintrag in `foes_m7.json`.
2. `tools/sprites/gegner/<id>.js` anlegen, am besten eine ähnliche Datei kopieren. Gerüst:

```js
module.exports = {
  id: 'beispiel', biom: 'hafen', zone: 'hafen', w: 96, h: 120, fuss: [48, 115], kopf: [48, 20],
  varianten: { beispiel_a: { breit: 14 }, beispiel_b: { breit: 12, zone: 'moor_gruen' } },
  // optional: rang:'waechter', anim:{idle:{n:4,fps:4,loop:true}}, rimBis, todStart
  bild(p, v, A) {            // p: {anim,f,n,q,idle,angriff,treffer,tod}, v: Variante, A: Formen und Hilfen
    const { E, C, Pg, glied, saum, pose, r } = A;
    const P0 = pose(p, { lunge: 5, fall: 20 });   // atem, lean, fall, aus
    const T = P0.atem + P0.fall;
    const gruppen = [                            // hinten -> vorne; k = Glättung zwischen Formen der Gruppe
      { p: [Pg([[40, 50 + T], [56, 50 + T], [60, 112], [36, 112]], null, { rd: 2 })], k: 2 },
      { p: [E(48 + P0.lean, 40 + T, 6, 7, 'haut')], k: 0, anker: [0, T] },
    ];
    const augen = [];
    const details = P => { if (!P0.aus) { P.auge(46 + P0.lean, 40 + T, 2); augen.push([46, 40]); } };
    return { gruppen, details, augen };
  },
};
```

3. Bauen, ansehen, verbessern: `node tools/sprites/bauen.js beispiel`, dann `tools/sprites/vorschau/beispiel_a.png` ansehen (alle Animationen auf Nebel, ×3).
4. Prüfen: `node tools/sprites/pruefen.js beispiel_a beispiel_b`.
5. Kontaktbögen neu erzeugen: `node tools/sprites/kontakt.js`.

### Was die Bibliothek für dich tut

- **Licht:** Diffuses Licht von vorn oben links, Gegenlicht von hinten oben rechts (`rimDir` 0.9/−0.5). Die Außenkante zum Licht bekommt Randlicht (außen R2, innen R1). Dünne Teile bekommen nur R1. Wo eine spätere Gruppe vor einer früheren liegt, entsteht Kontaktschatten statt Randlicht. Es gibt keinen Umriss.
- **Höhe:** `pf: 'bevel'` (Standard, Fase), `'dome'` (gewölbt, sparsam für Köpfe), `'flat'`.
- **Material:** `'haut'` ist eine Stufe heller (Gesichter), `'dunkel'` eine dunkler (Falten, Hutkrempen). `noRim: true` unterdrückt Randlicht (Falten, Stäbe).
- **Dither:** Bayer 4 × 4 auf die 4 Körperstufen. `anker: [dx, dy]` an einer Gruppe lässt das Muster mit einem ganzzahlig bewegten Teil mitwandern. Ohne Anker „kriecht“ der Dither, wenn sich ein großer Körper bewegt.
- **Treffer:** Bild 0 wird automatisch eine Stufe heller. Den Rückstoß gibt `pose()` vor (+2 px, dann +1 px nach rechts).
- **Tod:** Ab Bild 1 gehen die Augen aus. Ab `todStart` (Standard 25 %) zerfällt die Figur von oben nach unten im geordneten Dither, das letzte Bild ist leer. Absinken und Zusammensacken kommen aus der Pose (`fall`).
- **Bewegung** nur in ganzen Pixeln (`r()`), im Leerlauf höchstens 1 bis 2 px.
- **Blickrichtung:** Die Figuren schauen nach links (zum Spieler). Angriffe gehen nach links (`lean` negativ).

## Regel-Prüfung (`pruefen.js`)

Je Sprite und je Bild aus Idle, Angriff und Treffer:

1. **Format:** JSON-Felder vollständig, Zeilenreihenfolge, Sheet-Maße passen zu w × h × Bildzahl, Idle 2 bis 4 Bilder, Tod 4 bis 6.
2. **Größe:** normal genau 96 × 120, Wächter bis 128 × 160, Boss bis 160 × 160.
3. **Alpha** nur 0 oder 255 (keine halbtransparenten Kantenpixel).
4. **Palette:** jedes Pixel ist eine Farbe der Zonenpalette (Körper, Randlicht, Glühen, Glut, Kern, erlaubte Zusatzfarben).
5. **Kein schwarzer Umriss:** höchstens 60 % der Außenkante in der dunkelsten Stufe.
6. **Randlicht an der Lichtseite:** Von den Außenkanten, die zur Lichtrichtung zeigen (nach rechts beziehungsweise rechts oben frei, nach oben frei), tragen mindestens 50 % Randlicht.
7. **Hellstes Pixel** ist Kern, Glut oder eine Lichtfarbe, nie Randlicht oder Körper. Kern, Glut und Licht-Zusatzfarben zusammen nehmen höchstens 6 % der Fläche ein (Akzente), helles Randlicht höchstens 15 %.
8. **Idle 0 hat Augen oder Lichter.**
9. **Kein Flackern:** Zwischen zwei Idle-Bildern wechseln höchstens 20 % der Pixel, nachdem die beste Verschiebung um ±1 px abgezogen ist (ganzzahlige Bewegung ist kein Flackern, kriechender Dither schon).
10. **Tod:** Das letzte Bild ist zerfallen (unter 10 % der Idle-Fläche).

Stand dieser Sitzung: **41 Sheets, 0 Verstöße.**

## Bekannte Grenzen

- Der Dither im gedithertem Glühen (`P.glow`) hängt an festen Bildkoordinaten. Schwebende Figuren bewegen sich darum im Leerlauf kaum.
- Glühen außerhalb des Körpers (Lichtstaub in der Luft wie beim Zielbild-Chorknaben) ist nicht Teil des Sprites. Das soll der Lader über `augen` und `augenfarbe` im Spiel machen (gedithert, nicht weichgezeichnet).
- Die Formen sind von Hand gesetzt (Briefing Abschnitt 5 erlaubt das jetzt). Mit dem Generator in `docs/spritegen/` hat das nichts zu tun.
