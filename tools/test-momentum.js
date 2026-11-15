// Auftrag 4, Momentum Stufe 1: drei Hebel (BAL.momentum), jeder einzeln abschaltbar.
// a) Reliquien wirken aus dem Rucksack. b) Vorschlag beim Ritzen (Klick bestätigt, Ziehen ändert). c) Wächter gibt einen Slot nach Wahl (bis 4).
// node tools/test-momentum.js   (eigener Server, Ton aus; Bilder nach docs/auftrag-4/bilder/momentum)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path'), http = require('http');
let fehler = 0; const ok = (b, t) => { console.log((b ? 'ok    ' : 'FEHLER ') + t); if (!b) fehler++; };
(async () => {
  const wurzel = path.join(__dirname, '../prototype'), bilder = path.join(__dirname, '../docs/auftrag-4/bilder/momentum');
  const typ = { '.js': 'text/javascript', '.json': 'application/json', '.html': 'text/html', '.css': 'text/css', '.png': 'image/png' };
  const srv = http.createServer((q, s) => { let f = path.join(wurzel, decodeURIComponent(q.url.split('?')[0])); if (f.endsWith(path.sep)) f += 'index.html'; if (!f.startsWith(wurzel)) { s.writeHead(403); return s.end(); } fs.readFile(f, (e, d) => { if (e) { s.writeHead(404); return s.end(); } s.writeHead(200, { 'Content-Type': typ[path.extname(f)] || 'application/octet-stream' }); s.end(d); }); });
  await new Promise(r => srv.listen(0, r)); const url = 'http://localhost:' + srv.address().port;
  const b = await chromium.launch(); const konsole = [];
  const p = await b.newPage({ viewport: { width: 1280, height: 720 } }); p.on('pageerror', e => konsole.push(String(e)));
  await p.goto(`${url}/index.html?dev=0&job=fischer&seed=3&springe=kampf&akt=1`); await p.waitForTimeout(1300);
  await p.evaluate(() => { try { audioOn = false; Einst.set('musik', 0); Einst.set('ton', 0); } catch (e) { } });
  // a) Reliquie mit passiver Eigenschaft in den Rucksack
  const a = await p.evaluate(() => { const id = Object.keys(ITEMS).find(k => rarOf(ITEMS[k]) === 'reliquie' && (ITEMS[k].passiv || ITEMS[k].eigen)); if (!id) return null; const t = (ITEMS[id].passiv || ITEMS[id].eigen).typ;
    const vor = passive(t).length; const i = S.bag.indexOf(null); S.bag[i] = mk(id); const mit = passive(t).length; BAL.momentum.reliquien_rucksack = false; const aus = passive(t).length; BAL.momentum.reliquien_rucksack = true; S.bag[i] = null;
    const gew = Object.keys(ITEMS).find(k => rarOf(ITEMS[k]) !== 'reliquie' && (ITEMS[k].passiv || ITEMS[k].eigen)); let g = null; if (gew) { const tt = (ITEMS[gew].passiv || ITEMS[gew].eigen).typ; const v0 = passive(tt).length; S.bag[i] = mk(gew); g = passive(tt).length - v0; S.bag[i] = null; }
    return { id: ITEMS[id].n, t, vor, mit, aus, g }; });
  ok(a && a.mit === a.vor + 1 && a.aus === a.vor && a.g === 0, `Reliquie im Rucksack wirkt: ${a && a.id} (${a && a.t}) ${a && a.vor} → ${a && a.mit}, Schalter aus ${a && a.aus}, gewöhnliches Item im Rucksack +${a && a.g}`);
  // b) Vorschlag beim Ritzen
  const setz = () => p.evaluate(() => { S.phase = 'reward'; S.slotWahl = false; S.reward = []; S.picked = true; S.rewardHg = []; S.hgPicked = false; S.ueberschreiben = null;
    const id = Object.keys(HANDGRIFFE).find(k => !HANDGRIFFE[k].unspielbar && !besitz().some(b => hgVon(b.it).includes(k))); S.hgPending = id; render(); return id; });
  // Startdeck: jede Kerbe ist belegt, die Schiebermütze im Rucksack hat die einzige freie. Erst sie, dann mit einer Kerbe mehr an allem.
  const erst = await p.evaluate(() => { S.hgPending = Object.keys(HANDGRIFFE)[0]; const v = ritzVorschlag(); S.hgPending = null; return v; });
  ok(erst && /^Im Rucksack/.test(erst.grund) && /einzige freie Kerbe/.test(erst.grund), `Nur eine freie Kerbe: Vorschlag „${erst && erst.grund}“`);
  await p.evaluate(() => besitz().forEach(b => b.it.kerbenPlus = 1));
  const hg = await setz(); await p.waitForTimeout(300);
  const v = await p.evaluate(() => { const v = ritzVorschlag(); const el = document.querySelector('.rzk.vorschlag'); const it = itemByUid(v.uid); const an = besitz().find(b => b.it === it).an;
    return { v, an, frei: hgVon(it).length < kerbenVon(it), el: !!el, kachel: el && +el.closest('[data-rzz]').dataset.rzz, text: (document.querySelector('.rzvor') || {}).innerText || '', n: def(it).n }; });
  ok(v.el && v.kachel === v.v.uid && v.an && v.frei && /VORSCHLAG/.test(v.text), `Vorschlag liegt im besten freien Item (${v.n}, angelegt): „${v.text.replace(/\s+/g, ' ').trim()}“`);
  await p.screenshot({ path: path.join(bilder, 'ritzen-vorschlag.png') });
  await p.click('.rzk.vorschlag'); await p.waitForTimeout(150);
  ok(await p.evaluate(([uid, id]) => hgVon(itemByUid(uid)).includes(id) && S.hgPicked && !S.hgPending, [v.v.uid, hg]), 'Ein Klick bestätigt den Vorschlag');
  // Ziehen ändert: auf ein anderes Item mit freier Kerbe
  const hg2 = await setz(); await p.waitForTimeout(200);
  const ziel = await p.evaluate(() => { const v = ritzVorschlag(); const b = besitz().find(b => b.it.uid !== v.uid && hgVon(b.it).length < kerbenVon(b.it)); return b ? b.it.uid : null; });
  if (ziel != null) { await p.dragAndDrop('.rzneu', `.rzz[data-rzz="${ziel}"]`); await p.waitForTimeout(150);
    ok(await p.evaluate(([uid, id]) => hgVon(itemByUid(uid)).includes(id), [ziel, hg2]), 'Ziehen auf ein anderes Item ritzt dort'); }
  else ok(false, 'kein zweites Item mit freier Kerbe für den Zieh-Test');
  // Schalter aus: kein Vorschlag
  await setz(); const ohne = await p.evaluate(() => { BAL.momentum.ritz_vorschlag = false; render(); const n = document.querySelectorAll('.rzk.vorschlag,.rzvor').length; BAL.momentum.ritz_vorschlag = true; S.hgPending = null; S.hgPicked = true; return n; });
  ok(ohne === 0, 'Schalter aus: kein Vorschlag');
  // c) Wächter: Slot nach Wahl
  const w = await p.evaluate(() => { AREAS.forEach(a => S.slots[a] = 2); S.kampfArt = 'waechter'; S.enemies.forEach(e => e.hp = 0); fightWon(); render(); return { wahl: S.slotWahl, n: AREAS.length, knoepfe: document.querySelectorAll('.slotwahl [data-slotwahl]').length, szene: !!document.querySelector('.box.szene.slotwahl') }; });
  ok(w.wahl && w.knoepfe === w.n && w.szene, `Nach dem Wächter: eigener Moment mit ${w.knoepfe} Bereichen (Szene ${w.szene})`);
  await p.waitForTimeout(500); await p.screenshot({ path: path.join(bilder, 'waechter-slot.png') });
  const vorS = await p.evaluate(() => S.slots.kleidung); await p.click('[data-slotwahl="kleidung"]'); await p.waitForTimeout(150);
  const nach = await p.evaluate(() => ({ s: S.slots.kleidung, wahl: S.slotWahl, beute: !!document.querySelector('.box.reward:not(.slotwahl), .rz') }));
  ok(nach.s === vorS + 1 && !nach.wahl && nach.beute, `Wahl Kleidung: ${vorS} → ${nach.s} Slots, danach die Beute`);
  const voll = await p.evaluate(() => { AREAS.forEach(a => S.slots[a] = BAL.max_slots); S.phase = 'fight'; S.kampfArt = 'waechter'; fightWon(); return S.slotWahl; });
  ok(!voll, 'Alle Bereiche bei 4: keine Wahl');
  ok(!konsole.length, `Browser ohne Fehler${konsole.length ? ': ' + konsole[0] : ''}`);
  await p.close(); await b.close(); srv.close();
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
