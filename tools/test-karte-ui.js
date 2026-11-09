// Auftrag 3, M3: Prüfung der Peilkarten-Ansicht (05-oberflaeche.md Abschnitt 7) im Browser.
// Bei 1280×720, 1440×900 und 1920×1080: so viele Knoten gezeichnet wie bis zur Sicht, nichts außerhalb von #spiel (Karte und Biom-Wahl).
// Dazu: ein Klick auf einen erreichbaren Knoten wählt genau diesen (S.netz.pos = ziel), nach netzKlar() sind alle Ebenen sichtbar,
// ein dunkler Knoten zeigt kein Zeichen (auch nicht in den Pixeln), bis man davor steht, ein eingestürzter Gang hinter dem Nebel ist nicht zu sehen
// (nach netzKlar() schon), keine zwei Pfade kreuzen sich im Bild, kein „?“, „unbekannt“ oder „unentdeckt“ im Text der Karte, Taste M öffnet und schließt die Karte
// (im Kampf nur lesend), die Biom-Wahl zeigt zwei Ausschnitte und wählt über chooseBiom, keine Konsolenfehler.
// node tools/test-karte-ui.js        (startet selbst einen kleinen Server auf einem freien Port)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
let fehler = 0; const ok = (c, m) => { if (!c) { fehler++; console.log('FEHLER: ' + m); } };
(async () => {
  const wurzel = path.join(__dirname, '../prototype');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png', '.woff2': 'font/woff2', '.ogg': 'audio/ogg' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); }
    fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(); const konsole = [];
  const seite = async (W, H, q = 'springe=weg&akt=1&seed=3') => {
    const p = await b.newPage({ viewport: { width: W, height: H } });
    p.on('console', m => { if (m.type() === 'error') konsole.push(`${W}×${H}: ${m.text()}`); }); p.on('pageerror', e => konsole.push(`${W}×${H}: Seitenfehler ${e}`));
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    await p.goto(`${url}/index.html?dev=0&job=fischer&${q}`);
    await p.waitForFunction(() => typeof S !== 'undefined' && S.phase === 'weg' && document.querySelector('.peil .kn'), null, { timeout: 20000 }); await p.waitForTimeout(300); return p;
  };
  // Alle Boxen unter einer Wurzel liegen im Bild von #spiel (und #spiel im Fenster)
  const drinnen = (p, wurzelSel) => p.evaluate(sel => {
    const sp = document.getElementById('spiel').getBoundingClientRect(), t = 1.5; const aus = [];
    if (sp.left < -t || sp.top < -t || sp.right > innerWidth + t || sp.bottom > innerHeight + t) aus.push('#spiel ragt aus dem Fenster');
    document.querySelectorAll(sel + ', ' + sel + ' *').forEach(el => { const r = el.getBoundingClientRect(); if (!r.width && !r.height) return;
      if (r.left < sp.left - t || r.top < sp.top - t || r.right > sp.right + t || r.bottom > sp.bottom + t) aus.push(`${el.tagName}.${el.className}`); });
    return aus; }, wurzelSel);
  const modell = p => p.evaluate(() => { const N = S.netz, sicht = netzSicht(N); const soll = N.ebenen.slice(0, sicht + 1).reduce((a, l) => a + l.length, 0);
    return { dom: document.querySelectorAll('.peil .kn').length, modell: karteModell(N, { wahl: true }).nodes.length, soll, sicht, L: N.ebenen.length, wort: !!document.querySelector('.peil .kwort') }; });

  // 1. Drei Auflösungen: Knotenzahl, nichts außerhalb, Biom-Wahl
  for (const [W, H] of [[1280, 720], [1440, 900], [1920, 1080]]) {
    const p = await seite(W, H); const m = await modell(p);
    ok(m.dom === m.soll && m.modell === m.soll, `${W}×${H}: gezeichnete Knoten ${m.dom} (Modell ${m.modell}), bis zur Sicht ${m.sicht} sind es ${m.soll}`);
    ok(m.wort, `${W}×${H}: der Nebel trägt das Wort UNKARTIERT`);
    const aus = await drinnen(p, '.peil'); ok(!aus.length, `${W}×${H}: außerhalb von #spiel: ${aus.slice(0, 4).join(', ')}`);
    // Biom-Wahl
    await p.evaluate(() => { S.akt = 1; S.route[1] = null; enterAct(); render(); }); await p.waitForTimeout(300);
    const bw = await p.evaluate(() => ({ phase: S.phase, n: document.querySelectorAll('.kbiom').length, soll: (S.angebote[S.akt] || []).length, cv: document.querySelectorAll('.kbiom canvas').length, namen: (S.angebote[S.akt] || []).every((id, i) => document.querySelectorAll('.kbiom .wn')[i].textContent === BIOMES[id].n.toUpperCase()),
      text: [...document.querySelectorAll('.kbiom .kwort')].map(e => e.textContent).join(' ') }));
    ok(bw.phase === 'biomwahl' && bw.n === bw.soll && bw.n >= 2 && bw.cv === bw.n, `${W}×${H}: Biom-Wahl zeigt ${bw.n} Ausschnitte (Angebot ${bw.soll}, Zeichenflächen ${bw.cv})`);
    ok(bw.namen, `${W}×${H}: Namen der Biome stehen in den Ausschnitten`);
    ok(!/\?|unbekannt|unentdeckt/i.test(bw.text), `${W}×${H}: Biom-Wahl-Ausschnitt trägt Fragezeichen oder Hinweis: ${bw.text}`);
    const aus2 = await drinnen(p, '#panel'); ok(!aus2.length, `${W}×${H}: Biom-Wahl ragt aus #spiel: ${aus2.slice(0, 4).join(', ')}`);
    if (W === 1440) { const erste = await p.evaluate(() => S.angebote[S.akt][1]); await p.click('.kbiom[data-biom="1"]'); await p.waitForTimeout(200);
      const nach = await p.evaluate(() => ({ biom: S.route[S.akt], phase: S.phase })); ok(nach.biom === erste && nach.phase === 'uebergang', `Klick auf den zweiten Ausschnitt wählt ${erste} (gewählt ${nach.biom}, Phase ${nach.phase})`); }
    await p.close();
  }

  // 2. Klick wählt den richtigen Knoten (jeder erreichbare, je ein frischer Lauf)
  { const p0 = await seite(1440, 900); const n = await p0.evaluate(() => S.weg.length); await p0.close();
    for (let idx = 0; idx < n; idx++) {
      const p = await seite(1440, 900); const ziel = await p.evaluate(i => S.weg[i].ziel, idx);
      await p.click(`.peil .kn.wahl[data-weg="${idx}"]`); await p.waitForTimeout(300);
      const r = await p.evaluate(() => ({ pos: S.netz.pos, phase: S.phase, ebene: S.ebene, cur: S.cur && S.cur.ziel }));
      ok(JSON.stringify(r.pos) === JSON.stringify(ziel) && JSON.stringify(r.cur) === JSON.stringify(ziel) && r.phase !== 'weg', `Klick auf Knoten ${idx}: Ziel ${ziel}, Stelle danach ${r.pos}, Phase ${r.phase}`);
      await p.close(); }
    // Im Netz erreichbar heißt klickbar, sonst nicht: genau so viele klickbare Knoten wie S.weg
    const p = await seite(1440, 900); const c = await p.evaluate(() => ({ wahl: document.querySelectorAll('.peil .kn.wahl').length, weg: S.weg.length, start: !!document.querySelector('.peil .kstart') }));
    ok(c.wahl === c.weg && c.start, `klickbare Knoten ${c.wahl} = erreichbar ${c.weg}, Startpunkt ${c.start}`);
    // Zwei Schritte weiter: der aktuelle Knoten ist gerahmt (aktuell), gegangene Wege sind markiert, nur die Ausgänge sind klickbar
    await p.click('.peil .kn.wahl[data-weg="0"]'); await p.waitForTimeout(200);
    await p.evaluate(() => { S.phase = 'x'; finishNode(); }); await p.waitForTimeout(300);
    const z = await p.evaluate(() => ({ phase: S.phase, akt: document.querySelectorAll('.peil .kn.aktuell').length, geg: document.querySelectorAll('.peil .kn.gegangen').length, wahl: document.querySelectorAll('.peil .kn.wahl').length, ausg: S.netz.kanten.filter(k => k.a[0] === S.netz.pos[0] && k.a[1] === S.netz.pos[1] && !(k.bruch && k.bruch.weg)).length, edge: karteModell(S.netz, { wahl: true }).kanten.filter(k => k.z === 'gegangen').length }));
    ok(z.phase === 'weg' && z.akt === 1 && z.geg >= 1 && z.wahl === z.ausg, `Nach einem Schritt: Phase ${z.phase}, aktueller Knoten ${z.akt}, gegangen ${z.geg}, klickbar ${z.wahl} = Ausgänge ${z.ausg}`);
    // Tooltip: Drüberfahren sagt, was der Knoten ist
    const t = await p.evaluate(() => { const el = document.querySelector('.peil .kn.wahl'); const v = S.netz.ebenen[+el.dataset.e][+el.dataset.i]; return { tip: karteTip(el), n: RUN.knoten[v.art].n, hint: v.hint }; });
    ok(t.tip.includes(t.n) && t.tip.includes(t.hint.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')), `Tooltip nennt Knotenart und Hinweis (${t.n})`);
    const box = await (await p.$('.peil .kn.wahl')).boundingBox(); await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2); await p.waitForTimeout(200);
    ok(await p.evaluate(() => getComputedStyle(document.getElementById('tip')).display !== 'none' && document.getElementById('tip').textContent.length > 3), 'Maus über dem Knoten zeigt den Tooltip');
    await p.close(); }

  // 3. Nach netzKlar() sind alle Ebenen sichtbar; Text ohne Fragezeichen
  { const p = await seite(1440, 900); const vor = await modell(p);
    await p.evaluate(() => { netzKlar(); render(); }); await p.waitForTimeout(200);
    const nach = await p.evaluate(() => ({ dom: document.querySelectorAll('.peil .kn').length, alle: S.netz.ebenen.reduce((a, l) => a + l.length, 0), sicht: karteModell(S.netz, { wahl: true }).sicht, L: S.netz.ebenen.length, wort: !!document.querySelector('.peil .kwort'), nebel: karteModell(S.netz).nebel }));
    ok(vor.dom < nach.dom && nach.dom === nach.alle && nach.sicht === nach.L - 1 && !nach.wort && nach.nebel === null, `nach netzKlar(): ${nach.dom} von ${nach.alle} Knoten sichtbar, Sicht ${nach.sicht}/${nach.L - 1}, Nebelwort ${nach.wort}`);
    const aus = await drinnen(p, '.peil'); ok(!aus.length, `klare Karte ragt aus #spiel: ${aus.slice(0, 4).join(', ')}`);
    const text = await p.evaluate(() => document.querySelector('.peil').textContent + ' ' + [...document.querySelectorAll('.peil [data-tip],.peil [title],.peil [aria-label]')].map(e => (e.dataset.tip || '') + (e.title || '') + (e.getAttribute('aria-label') || '')).join(' '));
    ok(!/\?|unbekannt|unentdeckt/i.test(text), `Text der Karte enthält Fragezeichen oder Hinweis auf Verborgenes: ${text.slice(0, 120)}`);
    await p.close(); }

  // 4. Dunkler Stollen: leer und verschattet, bis man davor steht (auch in den Pixeln)
  { const p = await seite(1440, 900);
    const f = await p.evaluate(() => { for (let s = 1; s < 500; s++) { newRun('fischer', s, { dev: true }); S.route = RUN.akte.map(a => a.biome[0]); S.akt = 0; S.ebene = 0; S.netz = null; genWeg(); const N = S.netz; let z = null;
      N.ebenen.forEach((l, e) => l.forEach((v, i) => { if (v.dunkel) z = [e, i]; })); if (!z) continue; const vorne = N.kanten.find(k => k.b[0] === z[0] && k.b[1] === z[1]); N.pos = [z[0] - 2, 0]; N.gegangen = [N.pos]; genWeg(); return { s, z, vorne: vorne.a }; } return null; });
    ok(!!f, 'ein Seed mit Dunklem Stollen gefunden');
    if (f) {
      const pruefe = (z) => p.evaluate(z => { const N = S.netz, v = N.ebenen[z[0]][z[1]]; const m = karteModell(N, { wahl: true }); const n = m.nodes.find(n => n.e === z[0] && n.i === z[1]); const el = document.querySelector(`.peil .kn[data-e="${z[0]}"][data-i="${z[1]}"]`);
        const cv = document.querySelector('.peil .kartecv'), g = cv.getContext('2d'), c = (FXC[RUN.knoten[v.art].zeichen] || '#fff').replace('#', ''), rgb = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16));
        const d = g.getImageData(Math.round(n.x - n.r), Math.round(n.y - n.r), 2 * n.r + 1, 2 * n.r + 1).data; let treffer = 0; for (let i = 0; i < d.length; i += 4) if (d[i] === rgb[0] && d[i + 1] === rgb[1] && d[i + 2] === rgb[2]) treffer++;
        return { zeigt: n.zeigt, glyph: n.glyph, leer: el.classList.contains('leer'), art: el.dataset.art || null, aria: el.getAttribute('aria-label'), tip: karteTip(el), treffer, name: RUN.knoten[v.art].n }; }, z);
      const weit = await pruefe(f.z); ok(!weit.zeigt && weit.glyph === null && weit.leer && !weit.art && !weit.aria && weit.tip === '' && weit.treffer === 0, `Dunkler Knoten von weitem: zeigt ${weit.zeigt}, Zeichen ${weit.glyph}, Pixel des Zeichens ${weit.treffer}, Tooltip „${weit.tip}“`);
      ok(!/\?/.test(await p.evaluate(z => document.querySelector(`.peil .kn[data-e="${z[0]}"][data-i="${z[1]}"]`).outerHTML, f.z)), 'dunkler Knoten trägt kein Fragezeichen');
      await p.evaluate(a => { S.netz.pos = a; S.netz.gegangen = [a]; genWeg(); }, f.vorne); await p.waitForTimeout(200);
      const davor = await pruefe(f.z); ok(davor.zeigt && !!davor.glyph && !davor.leer && davor.art && davor.treffer > 0 && davor.tip.includes(davor.name), `Dunkler Knoten direkt davor: zeigt ${davor.zeigt}, Pixel des Zeichens ${davor.treffer}, Tooltip nennt ${davor.name}`);
    }
    await p.close(); }

  // 5. Eingestürzter Gang: hinter dem Nebel nichts zu sehen (nur das Rumpeln), nach netzKlar() eingestürzt gezeichnet; vor dem Nebel ein Riss
  { const p = await seite(1440, 900);
    const suche = (variante) => p.evaluate(v => { for (let s = 1; s < 700; s++) { newRun('fischer', s, { dev: true }); S.route = RUN.akte.map(a => a.biome[0]); S.akt = 0; S.ebene = 0; S.netz = null; genWeg(); const N = S.netz;
      const k = N.kanten.find(k => k.bruch); if (!k) continue; // M3: der Gang hängt an einem Ort mindestens drei Ebenen davor (k.bruch.ort)
      window.__rum = 0; if (!window.__rumH) { window.__rumH = true; Bus.on('rumpeln', () => window.__rum++); } N.pos = k.bruch.ort; N.gegangen = [k.bruch.ort]; netzTat(k.bruch.tat); N.pos = v === 'weit' ? [k.a[0] - 3, 0] : [k.a[0] - 2, 0]; N.gegangen = []; genWeg(); // weit: Gang ganz im Nebel; rand: Gang beginnt an der letzten sichtbaren Ebene
      const gleich = x => x.a && x.a[0] === k.a[0] && x.a[1] === k.a[1] && x.b[0] === k.b[0] && x.b[1] === k.b[1];
      const m = karteModell(N, { wahl: true }); const e = m.kanten.find(gleich);
      return { s, a: k.a, b: k.b, weg: k.bruch.weg, rum: window.__rum, sichtbar: !!e, z: e ? e.z : null, eingestuerzt: m.kanten.filter(x => x.z === 'eingestuerzt').length }; } return null; }, variante);
    for (const v of ['weit', 'rand']) { const r = await suche(v); ok(!!r, `Seed mit Brüchigem Gang (${v}) gefunden`); if (!r) continue;
      ok(r.weg && r.rum === 1, `${v}: Gang ist eingestürzt (${r.weg}) und es gibt genau ein Rumpeln (${r.rum})`);
      ok(r.eingestuerzt === 0 && (v === 'weit' ? !r.sichtbar : r.z === 'stumpf'), `${v}: hinter dem Nebel ist nichts vom Einsturz zu sehen (sichtbar ${r.sichtbar}, Zustand ${r.z}, eingestürzt gezeichnet ${r.eingestuerzt})`);
      await p.evaluate(() => { netzKlar(); render(); }); await p.waitForTimeout(150);
      const n = await p.evaluate(r => { const m = karteModell(S.netz, { wahl: true }); const e = m.kanten.find(x => x.a && x.a[0] === r.a[0] && x.a[1] === r.a[1] && x.b[0] === r.b[0] && x.b[1] === r.b[1]); return e ? e.z : null; }, r);
      ok(n === 'eingestuerzt', `${v}: nach netzKlar() ist der Gang eingestürzt gezeichnet (${n})`); }
    // vor dem Einsturz: Riss im Pfad, sobald im Sichtbereich
    const ri = await p.evaluate(() => { for (let s = 1; s < 700; s++) { newRun('fischer', s, { dev: true }); S.route = RUN.akte.map(a => a.biome[0]); S.akt = 0; S.ebene = 0; S.netz = null; genWeg(); const N = S.netz; const k = N.kanten.find(k => k.bruch); if (!k) continue;
      netzKlar(); render(); return karteModell(N).kanten.find(x => x.a && x.a[0] === k.a[0] && x.a[1] === k.a[1] && x.b[0] === k.b[0] && x.b[1] === k.b[1]).z; } return null; });
    ok(ri === 'riss', `ungebrochener Brüchiger Gang im Sichtbereich zeigt einen Riss (${ri})`);
    await p.close(); }

  // 6. Keine Kreuzung im Bild: alle Netze (150 Seeds × 5 Akte, klar und mitten im Akt), echte Pfadlinien der Zeichnung
  { const p = await seite(1440, 900);
    const k = await p.evaluate(() => { const ueber = (a, b, c, d) => { const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0; };
      let netze = 0, kreuz = 0, kanten = 0, ausser = 0; const bsp = [];
      for (let s = 1; s <= 150; s++) { newRun('fischer', s, { dev: true }); S.route = RUN.akte.map(a => a.biome[0]); if (!BIOMES[S.route[4]]) S.route[4] = 'pforte';
        for (let akt = 0; akt < 5; akt++) { S.akt = akt; S.ebene = 0; S.netz = null; genWeg(); const N = S.netz;
          for (const var_ of [0, 1]) { if (var_) { const e = Math.min(2, N.ebenen.length - 2); N.pos = [e, 0]; N.gegangen = [[0, 0], [1, 0], [2, 0]].slice(0, e + 1); } N.klar = true; const m = karteModell(N); netze++; kanten += m.kanten.length;
            m.nodes.forEach(n => { if (n.x - n.r < 0 || n.x + n.r > m.W || n.y - n.r < 0 || n.y + n.r > m.H) ausser++; });
            for (let i = 0; i < m.kanten.length; i++) for (let j = i + 1; j < m.kanten.length; j++) { const P = m.kanten[i].pfad, Q = m.kanten[j].pfad; let hit = false;
              for (let a = 0; a + 1 < P.length && !hit; a++) for (let c = 0; c + 1 < Q.length; c++) if (ueber(P[a], P[a + 1], Q[c], Q[c + 1])) { hit = true; break; }
              if (hit) { kreuz++; if (bsp.length < 3) bsp.push(`Seed ${s} Akt ${akt} ${JSON.stringify(m.kanten[i].a)}→${JSON.stringify(m.kanten[i].b)} x ${JSON.stringify(m.kanten[j].a)}→${JSON.stringify(m.kanten[j].b)}`); } }
            N.pos = null; N.gegangen = []; N.klar = false; } } }
      return { netze, kreuz, kanten, ausser, bsp }; });
    ok(k.kreuz === 0, `${k.kreuz} Kreuzungen im Bild bei ${k.netze} Karten (${k.bsp.join('; ')})`); ok(k.ausser === 0, `${k.ausser} Knoten außerhalb der Zeichenfläche`);
    if (!k.kreuz) console.log(`Geprüft: ${k.netze} Karten, ${k.kanten} Pfade, keine Kreuzung.`);
    await p.close(); }

  // 7. Taste M und Kartenknopf: öffnen und schließen; im Kampf nur lesend; in der Phase „weg“ ist die Karte ohnehin da
  { const p = await seite(1440, 900);
    await p.keyboard.press('m'); await p.waitForTimeout(150); ok(await p.evaluate(() => { const o = document.getElementById('kartenueber'); return !o || o.style.display === 'none'; }), 'Taste M in der Phase „weg“ legt keine zweite Karte darüber');
    ok(await p.evaluate(() => !document.querySelector('[data-act="karte"]')), 'in der Phase „weg“ gibt es keinen Kartenknopf (die Karte ist die Ansicht)');
    // einen Kampf betreten
    const idx = await p.evaluate(() => { const i = S.weg.findIndex(o => o.art === 'kampf'); return i; });
    if (idx >= 0) { await p.click(`.peil .kn.wahl[data-weg="${idx}"]`); await p.waitForFunction(() => S.phase === 'fight', null, { timeout: 8000 }); await p.waitForTimeout(500); }
    else { await p.evaluate(() => { S.phase = 'weg'; chooseWeg(0); }); await p.waitForTimeout(500); }
    const ph = await p.evaluate(() => S.phase);
    const auf = () => p.evaluate(() => { const o = document.getElementById('kartenueber'); return !!o && o.style.display !== 'none' && !!o.querySelector('.kn'); });
    ok(!(await auf()), `vor M ist keine Karte offen (Phase ${ph})`);
    ok(await p.evaluate(() => !!document.querySelector('[data-act="karte"]')), `außerhalb der Phase „weg“ gibt es den Kartenknopf in der Kopfleiste (Phase ${ph})`);
    await p.keyboard.press('m'); await p.waitForTimeout(250); ok(await auf(), `Taste M öffnet die Karte (Phase ${ph})`);
    const lesend = await p.evaluate(() => { const o = document.getElementById('kartenueber'); return { wahl: o.querySelectorAll('.kn.wahl,[data-weg]').length, knoten: o.querySelectorAll('.kn').length, aktuell: o.querySelectorAll('.kn.aktuell').length, pe: getComputedStyle(o).pointerEvents, text: o.textContent }; });
    ok(lesend.wahl === 0 && lesend.knoten > 0 && lesend.aktuell === 1, `Karte im Kampf nur lesend: klickbar ${lesend.wahl}, Knoten ${lesend.knoten}, aktueller Knoten ${lesend.aktuell}`);
    ok(!/\?|unbekannt|unentdeckt/i.test(lesend.text), `Karte im Kampf: Text ohne Fragezeichen (${lesend.text.slice(0, 80)})`);
    const aus = await drinnen(p, '#kartenueber'); ok(!aus.length, `Karte im Kampf ragt aus #spiel: ${aus.slice(0, 4).join(', ')}`);
    const posVor = await p.evaluate(() => JSON.stringify(S.netz.pos)); const el = await p.$('#kartenueber .kn'); const bx = await el.boundingBox(); await p.mouse.click(bx.x + bx.width / 2, bx.y + bx.height / 2); await p.waitForTimeout(150);
    ok(await p.evaluate(() => JSON.stringify(S.netz.pos)) === posVor && (await p.evaluate(() => S.phase)) === ph, 'ein Klick auf einen Knoten der gelesenen Karte ändert nichts');
    await p.keyboard.press('m'); await p.waitForTimeout(200); ok(!(await auf()), 'Taste M schließt die Karte');
    await p.click('[data-act="karte"]'); await p.waitForTimeout(200); ok(await auf(), 'der Kartenknopf öffnet die Karte');
    await p.click('[data-act="karte"]'); await p.waitForTimeout(200); ok(!(await auf()), 'der Kartenknopf schließt die Karte');
    await p.keyboard.press('m'); await p.waitForTimeout(150); await p.keyboard.press('Escape'); await p.waitForTimeout(150); ok(!(await auf()), 'Esc schließt die Karte');
    await p.close(); }

  // 8. Regelbiegung: ohne Biegung bleibt der Platz leer (kein Hinweis), mit Biegung stehen Zeichen und Name da
  { const p = await seite(1440, 900);
    const leer = await p.evaluate(() => { const e = document.querySelector('.peil .kbieg'); return { da: !!e, text: e ? e.textContent.trim() : null, biegung: BIOMES[S.netz.biom].biegung || null }; });
    ok(leer.da && (leer.biegung ? leer.text !== '' : leer.text === ''), `Platz für die Regelbiegung (Biegung ${leer.biegung}, Text „${leer.text}“)`);
    const mit = await p.evaluate(() => { const b = S.netz.biom; BIOMES[b].biegung = 'probe'; window.BIEGUNGEN = [{ id: 'probe', n: 'Probe', t: 'Regeltext', zeichen: 'buff' }]; render(); const e = document.querySelector('.peil .kbieg'); const r = { text: e.textContent.trim(), bild: !!e.querySelector('img') }; delete BIOMES[b].biegung; delete window.BIEGUNGEN; render(); return r; });
    ok(mit.text === 'Probe' && mit.bild, `mit Biegung stehen Zeichen und Name da (${mit.text})`);
    await p.close(); }

  ok(!konsole.length, 'Konsolenfehler: ' + konsole.slice(0, 5).join(' | '));
  await b.close(); srv.close();
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
