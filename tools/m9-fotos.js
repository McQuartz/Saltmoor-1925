// Auftrag 3 M9: Bildschirmfotos der Begegnungen (Wächter mit deiner Karte, Asche und Verbündeter, Spuren in vier Stufen, Seitenwechsel).
// node tools/m9-fotos.js [ziel=docs/auftrag-3/bilder/M9]   (startet selbst einen Server aus prototype/)
const { chromium } = require('playwright');
const http = require('http'), path = require('path'), { spawn } = require('child_process');
const PORT = 8100 + Math.floor(Math.random() * 800);
const URL = `http://localhost:${PORT}/index.html`;
const hoch = () => new Promise(r => http.get(URL, x => { x.resume(); r(true); }).on('error', () => r(false)));
(async () => {
  const out = process.argv[2] || 'docs/auftrag-3/bilder/M9'; require('fs').mkdirSync(out, { recursive: true });
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: path.join(__dirname, '..', 'prototype'), stdio: 'ignore' });
  for (let i = 0; i < 40 && !(await hoch()); i++) await new Promise(r => setTimeout(r, 150));
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); const f = [];
  p.on('pageerror', e => f.push(String(e))); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) f.push(m.text()); });
  const foto = async (n, warte = 600) => { await p.waitForTimeout(warte); await p.screenshot({ path: `${out}/${n}.png` }); };
  const laden = async () => { await p.goto(`${URL}?dev=0&job=fischer&seed=8&springe=weg&akt=1`); await p.waitForTimeout(800); };
  // Run in Akt a im Biom b, Zettel fest
  const run = (a, b, zettel) => p.evaluate(([a, b, zettel]) => { newRun('fischer', 8, { dev: true }); S.route = []; for (let i = 0; i < a; i++) S.route[i] = RUN.akte[i].biome[0]; S.route[a] = b; S.akt = a; S.depth = 3 + a * 6; S.zettel.begegnungen = zettel; S.hp = maxHp(); }, [a, b, zettel]);

  // 1 Die Diener erheben sich: Wächter spielt deine Karte (nächste Absicht = Bild deiner Karte)
  await laden(); await run(1, 'kloster', ['diener', 'asche']);
  await p.evaluate(() => { const c = deckListe().find(x => x.atk && !x.hg); for (let i = 0; i < 9; i++) Diener.gespielt(c); startFight([BIOMES.kloster.waechter], 'waechter'); const w = S.enemies[0]; w.pi = w.pat.findIndex(x => x.t === 'karte'); BU.key = ''; render(); });
  await foto('01-waechter-deine-karte', 1000);
  // 2 Asche: Asche im Rucksack, Baum zeigt den Ast nach einer Salzkarte; 3 gerufen, Verbündeter links mit eigener Plakette; 4 nach seinem Angriff
  await laden(); await run(1, 'kloster', ['asche', 'diener']);
  await p.evaluate(() => { const id = Object.keys(FOES).find(k => FOES[k].asche && BIOMES.kloster.gegner.includes(k)); S.asche = [{ id, n: FOES[id].n, akt: 1 }];
    const g = BIOMES.kloster.gegner.filter(k => !FOES[k].asche && (FOES[k].rang || 'normal') === 'normal').slice(0, 2); startFight(g, 'kampf');
    S.hand.unshift({ n: 'Salz streuen', c: 0, blk: 3, st: ['S'], src: 'Probe', img: itemBild('salzsack') || '', cid: 'probe:s' }, { n: 'Fackel', c: 1, atk: 4, st: ['F'], src: 'Probe', img: itemBild('fackel') || '', cid: 'probe:f' }); S.energy = 3; render(); });
  await p.evaluate(() => { playCard(0, 0); render(); });
  await foto('02-asche-ast-im-baum', 900);
  await p.evaluate(() => { const i = S.hand.findIndex(c => c.cid === 'probe:f'); playCard(i, 0); render(); });
  await foto('03-asche-gerufen-verbuendeter', 1200);
  // 5 zwei Biome später: er kommt als Gegner wieder, mit Asche-Spur an der Plakette
  await p.evaluate(() => { const r = S.ascheRueck[0]; const b = RUN.akte[3].biome.find(x => BIOMES[x]); S.akt = 3; S.route[3] = b; S.depth = 21; startFight([BIOMES[b].gegner[0]], 'kampf'); BU.key = ''; render(); });
  await foto('04-asche-kehrt-wieder', 1200);
  // 6–9 Spuren in vier Stufen auf der Peilkarte; 10 der Kampf auf Stufe 4 (größer)
  for (let s = 0; s < 4; s++) {
    await laden(); await run(1, 'kloster', ['spuren', 'diener']);
    await p.evaluate(s => { S.netz = null; S.phase = 'weg'; genWeg(); const v = Spuren.knoten(); v.spuren = s; S.netz.klar = true; BU.key = ''; render(); }, s);
    await foto(`0${5 + s}-spuren-stufe-${s + 1}`, 900);
  }
  await p.evaluate(() => { const v = Spuren.knoten(); v.spuren = 3; const N = S.netz; let z; N.ebenen.forEach((l, e) => { const i = l.indexOf(v); if (i >= 0) z = [e, i]; }); Spuren.starten({ ziel: z }); BU.key = ''; render(); });
  await foto('09-spuren-kampf-stufe-4', 1200);
  await p.evaluate(() => { const v = Spuren.knoten(); v.spuren = 0; const N = S.netz; let z; N.ebenen.forEach((l, e) => { const i = l.indexOf(v); if (i >= 0) z = [e, i]; }); Spuren.starten({ ziel: z }); BU.key = ''; render(); });
  await foto('10-spuren-kampf-stufe-1', 1200);
  // 11 Das Zeichen in der Hand; 12 Begegnung statt Kampf; 13 Krämer verweigert; 14 ein Gegner mehr
  await laden(); await run(2, 'salz', ['tiefe', 'diener']);
  await p.evaluate(() => { S.lose = ['zeichen']; S.zeichenGegeben = true; const g = BIOMES.salz.gegner.filter(k => ['mensch', 'veraendert'].includes(FOES[k].art))[0]; startFight([g], 'kampf'); const i = S.hand.findIndex(c => c.zeichen); if (i < 0) S.hand.push(Tiefe.karte('zeichen')); render(); });
  await foto('11-das-zeichen-in-der-hand', 900);
  await p.evaluate(() => { S.tiefeSeite = true; S.lose = []; const nrm = k => (FOES[k].rang || 'normal') === 'normal'; const t = BIOMES.salz.gegner.filter(k => nrm(k) && ['tiefe', 'nachahmer'].includes(FOES[k].art)).slice(0, 2); startFight(t, 'kampf'); BU.key = ''; render(); });
  await foto('12-begegnung-statt-kampf', 1200);
  await p.evaluate(() => { S.depth++; enterNode({ art: 'kraemer' }); render(); });
  await foto('13-kraemer-verweigert', 900);
  await p.evaluate(() => { const g = BIOMES.salz.gegner.filter(k => (FOES[k].rang || 'normal') === 'normal' && ['mensch', 'veraendert'].includes(FOES[k].art))[0]; startFight([g], 'kampf'); BU.key = ''; render(); });
  await foto('14-seitenwechsel-ein-gegner-mehr', 1200);
  console.log(f.length ? f.join('\n') : 'Keine Konsolenfehler.'); await b.close(); srv.kill();
})();
