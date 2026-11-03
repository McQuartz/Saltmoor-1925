# Referenz-Renderer der Ziel-Look-Entwürfe

`render.js` ist der kleine Renderer, mit dem die Bilder in `../` entstanden sind: Distanzfelder (Ellipse, Kapsel, Polygon mit Rundung), glattes Minimum je Gruppe, Höhenprofile `dome`, `bevel`, `flat`, Normalen aus Höhendifferenzen, Lambert-Licht, Randlicht an der Außenkante gegen `rimDir`, Kontaktschatten, Rampen-Abbildung mit Bayer-4×4-Dither.

Die Schattierung der Entwürfe (Farbwahl je Pixel) sah so aus:

```js
// Licht von hinten oben rechts, Randlicht nach rechts oben, kein Umriss
style = { light: [-.6, -.7, .6], rimDir: [.9, -.5], rimOuter: 3, outline: null,
  shade(m, df, rim, x, y, o) {
    // Randlicht-Linie an der Außenkante: außen hell (R2), innen dunkler (R1); dünne Teile nur R1
    if (o.outer && !o.front && y < 100) {
      if (o.rimK === 1) return o.thin ? R1 : R2;
      if (o.rimK === 2 && !o.thin) return R1;
    }
    if (rim > .36) return R2;
    if (rim > .18) return R1;
    let v = .02 + df * .75 + (o.tone || 0) + (m === 'pale' ? .25 : 0) - (m === 'dark' ? .25 : 0);
    if (o.front) v = 0;             // Kontaktschatten
    return rampMitDither(BODY, v, x, y);  // 4 dunkle Stufen der Zonenfarbe
  } };
```

**Erlaubt:** Ideen und Formeln für Licht, Randlicht, Dither übernehmen.
**Nicht erlaubt:** die Formen der Entwürfe nachbauen. Die lagen als Koordinatenlisten vor und sind deshalb absichtlich nicht im Repo (siehe AGENTS.md, verbotene Abkürzungen).
