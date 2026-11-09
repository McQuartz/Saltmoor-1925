// Misst die drei Hör-Einsätze (Auftrag 3, M6 „Hören statt sehen“) in jeder Akt-IV/V-Biom-Fassung.
// Aufruf (Server muss laufen: cd prototype && python3 -m http.server 8000):
//   node tools/hoeren-aufnahme.js              alle acht Biome, je Einsatz ein paar Takte (gut 4 Minuten, Audio läuft in Echtzeit)
//   node tools/hoeren-aufnahme.js --schnell    nur Eis und Pforte
// Je Biom und Einsatz (Angriff 1/2/3, Schutz, Zauber) läuft das Kampf-Stück des Bioms mit genau diesem Einsatz.
// Gemessen wird am Einsatz-Bus (Music.hoerenMessung) und an der Summe vor der Kette:
//   Spitze und RMS des Einsatzes, RMS des Rests (Summe minus Einsatz), Abstand, Spektrum (stärkste Frequenz, Schwerpunkt),
//   Grundfrequenz des Einsatzes samt Prüfung, ob sie auf einem Ton der Biom-Leiter liegt, und der Spitzenpegel am echten Ausgang.
// Dazu ein Härtetest: alle drei Einsätze gleichzeitig mit vollen Layern, Hochreaktion, Feuer und Effekten.
// Ausgabe: Konsole und docs/auftrag-3/bilder/M6/hoeren-messung.txt. Rückgabewert 1 bei Clipping, falschem Ton oder Tempo-Verstoß.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const BASIS = process.env.BASIS || 'http://localhost:8000/';
const SCHNELL = process.argv.includes('--schnell');
const AUSGABE = path.join(__dirname, '..', 'docs', 'auftrag-3', 'bilder', 'M6', 'hoeren-messung.txt');
const BIOME = SCHNELL ? ['eis', 'pforte'] : ['eis', 'glasmeer', 'walkathedrale', 'mond', 'funkstation', 'pforte', 'ufer', 'waage'];
const EINSAETZE = [['angriff', 1], ['angriff', 2], ['angriff', 3], ['schutz', 0], ['zauber', 0]];
const MINOR = [0, 2, 3, 5, 7, 8, 10], PHRYG = [0, 1, 3, 5, 7, 8, 10];
const NOTEN = ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B', 'H'];
const NAME = (m) => NOTEN[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
const PARALLEL = 4;

// Abgriff am Lautsprecher (wie in musik-pruefen.js) und Sampler für Einsatz-Bus und Summe
const ABGRIFF = () => {
  const orig = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dest, ...rest) {
    if (typeof AudioDestinationNode !== 'undefined' && dest instanceof AudioDestinationNode) {
      const c = dest.context;
      if (!c.__tap) {
        const an = c.createAnalyser(); an.fftSize = 2048; orig.call(an, dest);
        c.__tap = an; c.__peak = 0;
        const buf = new Float32Array(an.fftSize);
        setInterval(() => { an.getFloatTimeDomainData(buf); let m = 0; for (let i = 0; i < buf.length; i++) { const a = Math.abs(buf[i]); if (a > m) m = a; } if (m > c.__peak) c.__peak = m; }, 20);
        window.__c = c;
      }
      return orig.call(this, c.__tap, ...rest);
    }
    return orig.call(this, dest, ...rest);
  };
  // Sampler: alle 20 ms Zeitbereich (letzte 2048 Samples), alle 150 ms Spektrum beider Messknoten
  window.__m = null;
  window.__start = () => {
    const mm = Music.hoerenMessung(), N = 2048;
    const E = mm.einsatz, S = mm.summe, tb = new Float32Array(E.fftSize), tb2 = new Float32Array(S.fftSize);
    const fE = new Float32Array(E.frequencyBinCount), fS = new Float32Array(S.frequencyBinCount);
    window.__reset = () => { window.__m = { n: 0, pe: 0, ps: 0, pkE: 0, kurz: 0, ns: 0, spE: new Float64Array(fE.length), spS: new Float64Array(fS.length), f0: [], bpm: [] }; if (window.__c) window.__c.__peak = 0; Music.resetPeak(); };
    window.__reset();
    setInterval(() => {
      const m = window.__m; if (!m) return;
      E.getFloatTimeDomainData(tb); S.getFloatTimeDomainData(tb2);
      let qe = 0, qs = 0, pk = 0;
      for (let i = tb.length - N; i < tb.length; i++) { qe += tb[i] * tb[i]; const a = Math.abs(tb[i]); if (a > pk) pk = a; }
      for (let i = tb2.length - N; i < tb2.length; i++) qs += tb2[i] * tb2[i];
      qe /= N; qs /= N; m.n++; m.pe += qe; m.ps += qs; if (pk > m.pkE) m.pkE = pk; if (qe > m.kurz) m.kurz = qe;
      m.bpm.push([Music.state().bar, Music.state().bpm]);
    }, 20);
    setInterval(() => {
      const m = window.__m; if (!m) return;
      E.getFloatFrequencyData(fE); S.getFloatFrequencyData(fS);
      let mx = -999; for (let i = 0; i < fE.length; i++) if (fE[i] > mx) mx = fE[i];
      if (mx < -85) { for (let i = 0; i < fE.length; i++) { m.spE[i] += 0; } return; }
      for (let i = 0; i < fE.length; i++) { m.spE[i] += Math.pow(10, fE[i] / 10); m.spS[i] += Math.pow(10, fS[i] / 10); }
      m.ns++;
      // Grundfrequenz dieses Fensters: tiefstes deutliches Maximum (höchstens 22 dB unter dem stärksten), 35 bis 1500 Hz
      const hz = E.context.sampleRate / E.fftSize, lo = Math.ceil(35 / hz), hi = Math.floor(1500 / hz);
      for (let i = lo; i < hi; i++) {
        if (fE[i] > mx - 22 && fE[i] >= fE[i - 1] && fE[i] > fE[i + 1] && fE[i] >= fE[i - 2] && fE[i] > fE[i + 2]) {
          const a = fE[i - 1], b = fE[i], c = fE[i + 1], d = (a - c) / (2 * (a - 2 * b + c) || 1);
          m.f0.push((i + d) * hz); break;
        }
      }
    }, 150);
  };
  window.__ergebnis = () => { const m = window.__m, c = window.__c; return { n: m.n, ns: m.ns, pe: m.pe / m.n, ps: m.ps / m.n, pkE: m.pkE, kurz: m.kurz, f0: m.f0, spE: Array.from(m.spE), spS: Array.from(m.spS), hz: Music.hoerenMessung().einsatz.context.sampleRate / 32768, ausgang: c.__peak, intern: Music.state().peak, bpm: m.bpm, st: Music.state() }; };
};

const dB = (p) => (p > 1e-14 ? 10 * Math.log10(p) : -140);
const f = (v, n = 1) => (v <= -139 ? '  -∞' : v.toFixed(n).padStart(6));

// Auswertung einer Messung
function auswerten(r, biomInfo) {
  const hz = r.hz, sp = r.spE, sS = r.spS;
  let imax = 0; for (let i = 1; i < sp.length; i++) if (sp[i] > sp[imax]) imax = i;
  let num = 0, den = 0; for (let i = 1; i < sp.length; i++) { num += sp[i] * i * hz; den += sp[i]; }
  const zentroid = den > 0 ? num / den : 0;
  // Grundfrequenzen: nach Halbton gruppieren, nur Gruppen mit mindestens 12 % der Fenster zählen
  const gruppen = new Map();
  r.f0.forEach((fr) => { const m = 69 + 12 * Math.log2(fr / 440), k = Math.round(m); const g = gruppen.get(k) || { k, n: 0, cents: [] }; g.n++; g.cents.push((m - k) * 100); gruppen.set(k, g); });
  const erlaubt = new Set([...(biomInfo.phryg ? PHRYG : MINOR), ...PHRYG, 11]);
  const fl = [];
  [...gruppen.values()].filter((g) => g.n >= Math.max(2, 0.12 * r.f0.length)).sort((a, b) => a.k - b.k).forEach((g) => {
    const cent = g.cents.reduce((s, x) => s + x, 0) / g.n, pc = (((g.k - biomInfo.root) % 12) + 12) % 12;
    fl.push({ name: NAME(g.k), cent, ok: erlaubt.has(pc) && Math.abs(cent) <= 35 });
  });
  // Band um den Einsatz: eine Oktave um die tiefste Grundfrequenz, Einsatz gegen Rest (Summe minus Einsatz)
  const f0 = fl.length ? 440 * Math.pow(2, (gruppen.size ? [...gruppen.values()].sort((a, b) => b.n - a.n)[0].k - 69 : 0) / 12) : zentroid || 100;
  const a = Math.floor((f0 / Math.SQRT2) / hz), b = Math.ceil((f0 * 2) / hz);
  let be = 0, bs = 0; for (let i = a; i <= b && i < sp.length; i++) { be += sp[i]; bs += sS[i]; }
  const rest = Math.max(bs - be, bs * 1e-3, 1e-30);
  return {
    rmsE: dB(r.pe), spitzeE: 20 * Math.log10(r.pkE || 1e-7), kurzE: dB(r.kurz), rmsR: dB(Math.max(r.ps - r.pe, 1e-12)),
    abstand: dB(r.pe) - dB(Math.max(r.ps - r.pe, 1e-12)), abstandKurz: dB(r.kurz) - dB(Math.max(r.ps - r.pe, 1e-12)),
    bandAbstand: dB(be) - dB(rest), dom: imax * hz, zentroid, fl, ausgang: 20 * Math.log10(r.ausgang || 1e-7), intern: r.intern,
  };
}

async function neueSeite(browser, fehler) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  page.on('console', (m) => { if (m.type() === 'error') fehler.push(m.text()); });
  page.on('pageerror', (e) => fehler.push(String(e)));
  await page.addInitScript(ABGRIFF);
  await page.goto(BASIS + 'musik.html');
  await page.click('#bStart');
  await page.waitForFunction((n) => n.every((k) => Music.BIOME[k]), BIOME, { timeout: 10000 });
  await page.evaluate(() => window.__start());
  return page;
}
const warte = (p, ms) => p.waitForTimeout(ms);
async function bisZustand(page, fn, arg, max = 8000) { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await page.evaluate(fn, arg)) return true; await warte(page, 100); } return false; }

async function messeBiom(browser, k, fehler) {
  const page = await neueSeite(browser, fehler);
  const info = await page.evaluate((k) => { const b = Music.BIOME[k]; return { root: b.root, phryg: !!b.phryg, n: b.n, key: b.key }; }, k);
  await page.evaluate((k) => {
    Music.solo(null); Music.stoff('keiner'); Music.hp(40, 40); Music.biome(k); Music.scene('kampf');
    const nach = (b) => Object.keys(Music.FOES).find((f) => Music.FOES[f].biom === b && Music.FOES[f].rang === 'normal');
    Music.foeSpawn(nach(k) || nach(Music.BIOME[k].detail) || 'rufer'); Music.hoeren([]);
  }, k);
  await bisZustand(page, (k) => Music.state().biome === k, k);
  await warte(page, 7000); // Layer bauen sich auf
  const res = { biom: k, info, zeilen: [] };
  // Grundlinie ohne Einsatz
  await page.evaluate(() => window.__reset()); await warte(page, 7000);
  res.basis = await page.evaluate(() => window.__ergebnis());
  for (const [art, st] of EINSAETZE) {
    await page.evaluate(([a, s]) => Music.hoeren([{ art: a, stufe: s || 1, uid: 1 }]), [art, st]);
    await bisZustand(page, ([a, s]) => { const h = Music.state().hoeren; return a === 'angriff' ? h.angriff === s : !!h[a]; }, [art, st]);
    await warte(page, 2600); // Ausklang des vorigen Einsatzes (Glocke) abwarten
    await page.evaluate(() => window.__reset()); await warte(page, 9500);
    const r = await page.evaluate(() => window.__ergebnis());
    const mess = auswerten(r, info);
    // Schläge pro Takt aus dem Einsatz-Pegel sind nicht direkt messbar; die Planung steht im Log: hier nur Zustand und Duck
    mess.duck = r.st.hoeren.duck; mess.art = art === 'angriff' ? `angriff ${st}` : art; mess.bpm = r.bpm;
    mess.layer = r.st.layerLevels; res.zeilen.push(mess);
  }
  await page.evaluate(() => Music.hoeren([])); await warte(page, 3500);
  res.logHoeren = (await page.evaluate(() => Music.state().log)).filter((e) => e.was === 'hoeren').map((e) => e.why);
  res.endDuck = await page.evaluate(() => Music.state().hoeren.duck);
  await page.close();
  return res;
}

// Härtetest: alle drei Einsätze, Boss mit voller Wucht, Hochreaktion, Feuer, wenig Leben, SFX
async function haertetest(browser, fehler) {
  const page = await neueSeite(browser, fehler);
  const out = {};
  for (const k of BIOME) {
    await page.evaluate((k) => { Music.biome(k); Music.scene('boss'); Music.foeSpawn('ruft'); Music.foeSpawn('augen'); Music.hp(4, 40); Music.stoff('F'); Music.akt(4); Music.telegraph(); Music.hoeren([{ art: 'angriff', stufe: 3 }, { art: 'schutz' }, { art: 'zauber' }]); }, k);
    await bisZustand(page, (k) => Music.state().biome === k, k);
    await warte(page, 4500);
    await page.evaluate(() => window.__reset());
    for (let i = 0; i < 2; i++) { await page.evaluate(() => { Music.reaction(true); sfx.hoch(); sfx.hit(6); sfx.hurt(); Music.reaction(false); sfx.react(4); sfx.heal(); }); await warte(page, 3200); }
    const r = await page.evaluate(() => window.__ergebnis());
    out[k] = { ausgang: 20 * Math.log10(r.ausgang || 1e-7), intern: r.intern, gates: r.st.gate.join(','), drive: r.st.drive, hoeren: r.st.hoeren, bpm: r.bpm };
    await page.evaluate(() => { Music.hoeren([]); Music.victory(); Music.stoff('keiner'); Music.akt(0); Music.hp(40, 40); });
    await warte(page, 800);
  }
  await page.close();
  return out;
}

(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const fehler = [];
  const ergebnisse = [];
  const todo = [...BIOME];
  await Promise.all(Array.from({ length: Math.min(PARALLEL, todo.length) }, async () => { while (todo.length) { const k = todo.shift(); ergebnisse.push(await messeBiom(browser, k, fehler)); process.stderr.write(`fertig: ${k}\n`); } }));
  const hart = await haertetest(browser, fehler);
  await browser.close();
  ergebnisse.sort((a, b) => BIOME.indexOf(a.biom) - BIOME.indexOf(b.biom));

  const z = [];
  z.push('MESSUNG HÖREN STATT SEHEN (Auftrag 3, M6), erzeugt von tools/hoeren-aufnahme.js, ' + new Date().toISOString().slice(0, 10));
  z.push('Kampf-Stück des Bioms mit einem Gegner (Duell, Layer 1 bis 3 und Gegnerstimme an), dazu genau ein Einsatz. Messung über etwa drei Takte.');
  z.push('RMS E / Spitze E: Pegel des Einsatz-Busses vor der Kette (dBFS). Kurz E: lauteste 46-ms-Stelle. RMS Rest: Summe aller übrigen Layer vor der Kette, Mittel. Abstand = RMS E minus RMS Rest.');
  z.push('Abstand kurz = Kurz E minus RMS Rest. Band = Einsatz gegen Rest in einer Oktave um die Grundfrequenz. Grundton: gemessene Grundfrequenz(en) mit Abweichung in Cent; ✓ = auf einem Ton der Biom-Leiter (Moll bzw. phrygisch, Leitton), höchstens 35 Cent daneben.');
  z.push('Zentroid und stärkste Frequenz aus dem über die Messung gemittelten Spektrum des Einsatz-Busses. Ausgang = Spitzenpegel am Lautsprecher (hinter dem Limiter).');
  z.push('Hörbar: ja, wenn Abstand kurz ≥ -6 dB oder Band-Abstand ≥ 0 dB (der Einsatz sticht an seiner Stelle aus dem Rest heraus).');
  z.push('');
  let falsch = 0, maxAus = -999;
  const kopf = 'Biom           Einsatz     RMS E  Spitze E  Kurz E  RMS Rest  Abst.  Abst.kurz  Band   stärkste Hz  Zentroid Hz  Grundton (Cent)           Ausgang  Hörbar';
  z.push(kopf, '-'.repeat(kopf.length));
  const urteil = {};
  ergebnisse.forEach((r) => {
    r.zeilen.forEach((m) => {
      const ton = m.fl.length ? m.fl.map((x) => `${x.name} ${x.cent >= 0 ? '+' : ''}${x.cent.toFixed(0)}${x.ok ? '✓' : '✗'}`).join(' ') : 'kein Ton erkannt';
      if (!m.fl.length || m.fl.some((x) => !x.ok)) falsch++;
      maxAus = Math.max(maxAus, m.ausgang);
      const hoerbar = m.abstandKurz >= -6 || m.bandAbstand >= 0;
      (urteil[r.biom] = urteil[r.biom] || []).push({ art: m.art, hoerbar, abstand: m.abstand, kurz: m.abstandKurz, band: m.bandAbstand });
      z.push(`${(r.biom).padEnd(14)} ${m.art.padEnd(10)} ${f(m.rmsE)}  ${f(m.spitzeE)}  ${f(m.kurzE)}  ${f(m.rmsR)}  ${f(m.abstand)}  ${f(m.abstandKurz)}     ${f(m.bandAbstand)}  ${String(Math.round(m.dom)).padStart(8)}     ${String(Math.round(m.zentroid)).padStart(8)}     ${ton.padEnd(26)}${f(m.ausgang)}   ${hoerbar ? 'ja' : 'NEIN'}`);
    });
    const b = r.basis; z.push(`${r.biom.padEnd(14)} (ohne)                                       ${f(dB(b.ps))}                                                                                          ${f(20 * Math.log10(b.ausgang || 1e-7))}`);
  });
  z.push('', 'RMS Rest in der Zeile (ohne) = Summe ohne Einsatz (Grundlinie), zum Vergleich mit dem abgesenkten Rest oben (Layer 2, 3, Stimmen um 25 % = rund -2,5 dB).');
  z.push('', 'HÄRTETEST: alle drei Einsätze (Angriff 3, Schutz, Zauber) zugleich, Boss (volle Layer, Tutti), 4 Leben, Stoff Feuer, 2 Hochreaktionen mit Effekten (sfx)');
  z.push('Biom           Ausgang dBFS   vor Limiter dBFS   Layer-Tore       Duck');
  let maxHart = -999, maxIntern = -999;
  Object.entries(hart).forEach(([k, h]) => { maxHart = Math.max(maxHart, h.ausgang); maxIntern = Math.max(maxIntern, h.intern); z.push(`${k.padEnd(14)} ${f(h.ausgang)}        ${f(h.intern)}         ${h.gates.padEnd(24)} ${h.hoeren.duck}`); });
  // Tempo
  const takte = new Map(); let tempoFehler = 0;
  const bpmAlle = [...ergebnisse.flatMap((r) => r.zeilen.map((m) => m.bpm)), ...Object.values(hart).map((h) => h.bpm)];
  let bmin = 999, bmax = 0, sprung = 0;
  bpmAlle.forEach((liste) => { const je = new Map(); liste.forEach(([bar, b]) => je.set(bar, b)); const t = [...je.entries()].sort((a, b) => a[0] - b[0]); t.forEach(([bar, b], i) => { bmin = Math.min(bmin, b); bmax = Math.max(bmax, b); if (b < 80 || b > 88) tempoFehler++; if (i && t[i - 1][0] === bar - 1) { const d = Math.abs(b - t[i - 1][1]); sprung = Math.max(sprung, d); if (d > 1) tempoFehler++; } }); });
  z.push('', `TEMPO: ${bmin} bis ${bmax} BPM, größter Sprung ${sprung} BPM pro Takt, Verstöße ${tempoFehler}`);
  z.push(`GRÖSSTE SPITZE AM AUSGANG: Einzelmessungen ${maxAus.toFixed(1)} dBFS, Härtetest ${maxHart.toFixed(1)} dBFS (vor dem Limiter ${maxIntern.toFixed(1)} dBFS)  ${Math.max(maxAus, maxHart) < 0 ? '(kein Clipping)' : '(CLIPPING!)'}`);
  z.push(`TONART: ${falsch === 0 ? 'alle Grundfrequenzen auf Tönen der Biom-Leiter' : falsch + ' Einsätze mit Ton außerhalb der Leiter'}`);
  z.push('Log je Biom (note \'hoeren\'), Beispiel: ' + (ergebnisse[0].logHoeren[0] || '–'));
  z.push('Layer-Duck nach Ende der Einsätze: ' + ergebnisse.map((r) => `${r.biom} ×${r.endDuck}`).join(', '));
  z.push('', 'URTEIL JE BIOM (hört man den Einsatz heraus?)');
  Object.entries(urteil).forEach(([k, l]) => z.push(`${k}: ` + l.map((u) => `${u.art} ${u.hoerbar ? 'ja' : 'NEIN'} (${u.abstand.toFixed(1)} / kurz ${u.kurz.toFixed(1)} / Band ${u.band.toFixed(1)} dB)`).join('; ')));
  z.push(fehler.length ? 'KONSOLENFEHLER: ' + fehler.join(' | ') : 'Keine Konsolenfehler.');
  const text = z.join('\n') + '\n';
  console.log(text);
  fs.mkdirSync(path.dirname(AUSGABE), { recursive: true }); fs.writeFileSync(AUSGABE, text);
  process.exit(Math.max(maxAus, maxHart) >= 0 || falsch || tempoFehler || fehler.length ? 1 : 0);
})();
