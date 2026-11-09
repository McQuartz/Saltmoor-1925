// Auftrag 3 M6: Prüfskript „Klänge als Zeichen“. Server auf http://localhost:8000 (Seite prototype/index.html). Fotos nach docs/auftrag-3/bilder/M6/.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const AUS = path.join(__dirname, '..', 'docs', 'auftrag-3', 'bilder', 'M6'); fs.mkdirSync(AUS, { recursive: true });
let fehler = 0; const ok = (c, m) => { console.log((c ? 'ok    ' : 'FEHLER ') + m); if (!c) fehler++; };
const STELLE = () => {
  localStorage.removeItem('saltmoor.einst.v1');
  newRun('fischer', 5, { dev: true }); S.route[3] = 'mond'; S.akt = 3; S.depth = 20;
  for (let i = 0; i < 3; i++) S.route[i] = RUN.akte[i].biome[0];
  startFight(['astronom', 'kraterbewohner'], 'kampf'); render();
};
const MESS = () => [...document.querySelectorAll('#gegner .feind')].map(f => ({ n: f.querySelector('.pl-nm').innerText.trim(), abs: f.querySelectorAll('.abs').length, klang: [...f.querySelectorAll('.klang')].map(k => ({ cls: k.className, kf: getComputedStyle(k).getPropertyValue('--kf').trim(), dauer: k.style.getPropertyValue('--kt') })) }));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const fe = []; p.on('pageerror', e => fe.push(String(e)));
  await p.goto('http://localhost:8000/index.html?dev=0'); await p.waitForTimeout(1300);
  await p.evaluate(STELLE); await p.waitForTimeout(500);
  const stumm = await p.evaluate(() => S.enemies.map(e => e.stumm));
  ok(stumm[0] === true && !stumm[1], `Astronom stumm, Kraterbewohner nicht (${stumm})`);
  let m = await p.evaluate(MESS);
  ok(m[0].abs === 0 && m[0].klang.length === 0, 'ohne Einstellung: Astronom ohne Absicht und ohne Notenzeichen');
  ok(m[1].abs >= 1 && m[1].klang.length === 0, 'ohne Einstellung: anderer Gegner mit Absicht, ohne Notenzeichen');
  await p.screenshot({ path: path.join(AUS, 'plakette-stumm.png') });
  ok(await p.evaluate(() => Einst.STD.klangzeichen === false && Einst.get('klangzeichen') === false), 'Standard der Einstellung: aus');
  await p.evaluate(() => { Einst.set('klangzeichen', true); render(); }); await p.waitForTimeout(500);
  m = await p.evaluate(MESS);
  const h = await p.evaluate(() => hoerbareAbsicht(S.enemies[0]));
  const FARBE = { angriff: '#ff8a7a', schutz: '#9fc4ff', zauber: '#d0a8ff' };
  ok(m[0].klang.length === 1 && m[0].abs === 0, `mit Einstellung: genau ein Notenzeichen am Astronomen, keine Absicht (${JSON.stringify(m[0].klang)})`);
  ok(h && m[0].klang[0] && m[0].klang[0].kf.toLowerCase() === FARBE[h.art], `Farbe passt zur Art „${h && h.art}“`);
  ok(m[1].klang.length === 0 && m[1].abs >= 1, 'anderer Gegner weiter ohne Notenzeichen');
  ok(m[0].klang[0] && /s$/.test(m[0].klang[0].dauer) && parseFloat(m[0].klang[0].dauer) > 0.2, `Dauer gesetzt (${m[0].klang[0] && m[0].klang[0].dauer})`);
  // Einstellungs-Dialog hat das Kästchen
  const kk = await p.evaluate(() => { zeigeOverlay(einstHtml()); const c = document.querySelector('#overlay [data-einst=klangzeichen]'); const t = c && c.parentElement.innerText.trim(); closeOv(); return t; });
  ok(kk === 'Klänge als Zeichen', `Kästchen im Dialog („${kk}“)`);
  await p.screenshot({ path: path.join(AUS, 'plakette-klangzeichen.png') });
  // Schalter aus: Astronom zeigt Absicht normal, kein Notenzeichen
  await p.evaluate(() => { BAL.auftrag3.hoeren = false; render(); }); await p.waitForTimeout(300);
  m = await p.evaluate(MESS);
  ok(m[0].abs >= 1 && m[0].klang.length === 0, 'auftrag3.hoeren=false: Astronom zeigt Absicht, kein Notenzeichen');
  ok(!fe.length, 'keine Seitenfehler ' + fe.join('|'));
  await b.close(); console.log(fehler ? `${fehler} Fehler.` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
