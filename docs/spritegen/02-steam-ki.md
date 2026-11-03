# Steam und KI-Kennzeichnung

Stand der Recherche: 2026-11-02. Keine Rechtsberatung.

Seit Januar 2026 fragt Valve zwei Dinge ab: ob KI Inhalte für das Spiel erzeugt hat (im Spiel, auf der Shopseite, im Marketing) und ob das Spiel während des Spielens KI-Inhalte erzeugt. KI-Werkzeuge für die Arbeitsweise, ausdrücklich auch Code-Helfer, müssen nicht angegeben werden.

Quellen: [Game Developer, 16.01.2026](https://gamedeveloper.com/business/valve-tweaks-and-clarifies-ai-disclosure-rules-for-steam), [VGC, 17.01.2026](https://www.videogameschronicle.com/news/valve-has-significantly-rewritten-steams-rules-for-how-developers-much-disclose-ai-use). Valves eigener Wortlaut (Steamworks) wurde nicht gelesen.

| Fall | Kennzeichnen? | Warum |
|---|---|---|
| Claude schreibt den Generator, der Generator malt | voraussichtlich nein | Code ist Werkzeug, Sprites aus festem Algorithmus |
| WFC/Markov lernt aus **eigenen** Sprites | nein | Statistik aus eigenem Material |
| KI-Bild durch den Generator gejagt | **ja** | bleibt von KI-Inhalt abgeleitet |
| KI-Bild nur als Inspiration | Grauzone, eher nein | nichts davon landet im Spiel |
| Handkorrekturen am Generator-Ergebnis | nein | eigene Arbeit |

**Regel für das Projekt:** Keine KI-generierten Bilder als Eingabe, Vorlage oder Trainingsmaterial für den Generator. Vor Release das aktuelle Steamworks-Formular prüfen.
