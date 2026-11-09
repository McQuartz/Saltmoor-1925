// Prüft die prozedurale Musik im Musik-Labor (prototype/musik.html) mit Playwright und Chromium.
// Aufruf (Server muss laufen: cd prototype && python3 -m http.server 8000):
//   node tools/musik-pruefen.js            alles (dauert gut 6 Minuten, Audio läuft in Echtzeit)
//   node tools/musik-pruefen.js --schnell  ohne Einzelmessung der Stimmen und Rollen
// Misst den Spitzenpegel hinter dem Limiter (echter Ausgang, über einen Abgriff vor dem Lautsprecher)
// und am gemeinsamen Ausgang vor dem Limiter (Music.state().peak), den BPM-Verlauf je Takt und Konsolenfehler.
// Ergebnis: Tabelle in der Konsole, Rückgabewert 1 bei Clipping, Tempo-Verstoß, Konsolenfehler oder Fehler bei den Hör-Einsätzen.
// Die ausführliche Messung der Hör-Einsätze (Spektrum, Tonart, Abstand zum Rest) steht in tools/hoeren-aufnahme.js.
const { chromium } = require('playwright');
const BASIS = process.env.BASIS || 'http://localhost:8000/';
const SCHNELL = process.argv.includes('--schnell');

// Wird vor allen Skripten der Seite geladen: hängt einen Analyser zwischen jeden Knoten und den Lautsprecher.
const ABGRIFF = () => {
  const orig = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (dest, ...rest) {
    if (typeof AudioDestinationNode !== 'undefined' && dest instanceof AudioDestinationNode) {
      const c = dest.context;
      if (!c.__tap) {
        const an = c.createAnalyser(); an.fftSize = 2048; orig.call(an, dest);
        c.__tap = an; c.__peak = 0; c.__ms = 0; c.__n = 0; c.__cent = 0; c.__cn = 0;
        const buf = new Float32Array(an.fftSize), fb = new Float32Array(an.frequencyBinCount);
        setInterval(() => {
          an.getFloatTimeDomainData(buf); let m = 0, q = 0;
          for (let i = 0; i < buf.length; i++) { const a = Math.abs(buf[i]); if (a > m) m = a; q += buf[i] * buf[i]; }
          if (m > c.__peak) c.__peak = m; c.__ms += q / buf.length; c.__n++;
          an.getFloatFrequencyData(fb); let num = 0, den = 0;
          for (let i = 1; i < fb.length; i++) { const p = Math.pow(10, fb[i] / 10); num += p * i; den += p; }
          if (den > 1e-9) { c.__cent += num / den * c.sampleRate / an.fftSize; c.__cn++; }
        }, 20);
        (window.__ctxs = window.__ctxs || []).push(c);
      }
      return orig.call(this, c.__tap, ...rest);
    }
    return orig.call(this, dest, ...rest);
  };
  window.__reset = () => (window.__ctxs || []).forEach(c => { c.__peak = 0; c.__ms = 0; c.__n = 0; c.__cent = 0; c.__cn = 0; });
  window.__mess = () => {
    let peak = 0, ms = 0, n = 0, cent = 0, cn = 0;
    (window.__ctxs || []).forEach(c => { peak = Math.max(peak, c.__peak); ms += c.__ms; n += c.__n; cent += c.__cent; cn += c.__cn; });
    const db = v => v > 0 ? 20 * Math.log10(v) : -120;
    return { peak: db(peak), rms: db(Math.sqrt(n ? ms / n : 0)), zentroid: cn ? cent / cn : 0 };
  };
};

const dB = v => (v <= -120 ? '  -∞' : v.toFixed(1).padStart(6));
(async () => {
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const fehler = [];
  page.on('console', m => { if (m.type() === 'error') fehler.push(m.text()); });
  page.on('pageerror', e => fehler.push(String(e)));
  await page.addInitScript(ABGRIFF);
  await page.goto(BASIS + 'musik.html');
  await page.click('#bStart'); // Nutzer-Geste für den Audio-Start
  await page.waitForTimeout(600);

  // BPM-Verlauf und Entscheidungen fortlaufend mitschreiben
  await page.evaluate(() => {
    window.__bpm = []; window.__ev = [];
    Music.onEvent(e => window.__ev.push(e));
    setInterval(() => { const s = Music.state(); window.__bpm.push([s.bar, s.bpm]); }, 150);
  });
  const warte = ms => page.waitForTimeout(ms);
  const ev = (fn, arg) => page.evaluate(fn, arg);
  const bisBiom = async k => { for (let i = 0; i < 60; i++) { if (await ev(k => Music.state().biome === k, k)) return; await warte(100); } };

  const biome = await ev(() => Object.keys(Music.BIOME));
  const foes = await ev(() => Object.fromEntries(Object.entries(Music.FOES).map(([k, f]) => [k, { biom: f.biom, rang: f.rang, n: f.n }])));
  const zeilen = [];
  for (const k of biome) {
    await ev(() => { Music.solo(null); Music.scene('karte'); Music.hp(40, 40); Music.stoff('keiner'); });
    await ev(k => Music.biome(k), k); await bisBiom(k);
    await ev(() => { Music.resetPeak(); window.__reset(); });
    const zwei = Object.keys(foes).filter(f => foes[f].biom === k && foes[f].rang === 'normal').slice(0, 2);
    const waechter = Object.keys(foes).find(f => foes[f].biom === k && foes[f].rang !== 'normal');
    // Kampf mit zwei Gegnerstimmen
    await ev(z => { Music.scene('kampf'); z.forEach(f => { Music.foeSpawn(f); Music.foeSpawn(f); }); }, zwei);
    await warte(4500);
    await ev(() => { Music.strike(); sfx.hit(3); Music.reaction(false); sfx.react(0); });
    await warte(700);
    await ev(() => { Music.hit(18); sfx.hurt(); Music.telegraph(); });
    await warte(2200);
    // Hochreaktion: Atemholen, dann Tutti
    await ev(() => { Music.reaction(true); sfx.hoch(); });
    await warte(3500);
    await ev(z => { Music.foeDie(z[0]); Music.foeDie(z[0]); sfx.die(); }, zwei); // Abgesang
    await warte(2000);
    await ev(z => { Music.foeDie(z[1]); sfx.die(); }, zwei);                  // Duell
    await warte(2000);
    await ev(z => { Music.foeDie(z[1]); sfx.die(); Music.victory(); sfx.win(); }, zwei);
    await warte(2500);
    // Wächter bzw. Boss des Bioms kurz anspielen
    if (waechter) {
      await ev(w => { Music.scene(w.rang === 'boss' ? 'boss' : 'waechter'); Music.foeSpawn(w.k); if (w.rang === 'boss') Music.foeSpawn('augen'); },
        { k: waechter, rang: foes[waechter].rang });
      await warte(3500);
      await ev(() => { Music.foeDie(Music.state().foes[0]); Music.victory(); sfx.win(); });
      await warte(1200);
    }
    const r = await ev(() => ({ m: window.__mess(), peakIntern: Music.state().peak }));
    zeilen.push({ biom: k, stimmen: zwei.join('+') + (waechter ? ' / ' + waechter : ''), ...r });
  }

  // Härtetest: Boss, kaum Leben, Feuer (Verzerrung), Hochreaktion und viele Effekte gleichzeitig
  await ev(() => { Music.biome('pforte'); Music.scene('boss'); Music.foeSpawn('ruft'); Music.foeSpawn('augen'); Music.hp(4, 40); Music.stoff('F'); Music.akt(4); Music.telegraph(); });
  await bisBiom('pforte');
  await ev(() => { Music.resetPeak(); window.__reset(); });
  for (let i = 0; i < 3; i++) {
    await ev(() => { Music.reaction(true); sfx.hoch(); sfx.hit(6); sfx.hit(6); sfx.hurt(); Music.reaction(false); sfx.react(4); sfx.heal(); });
    await warte(2600);
  }
  const hart = await ev(() => ({ m: window.__mess(), peakIntern: Music.state().peak }));
  await ev(() => { Music.victory(); Music.stoff('keiner'); Music.akt(0); Music.hp(40, 40); });

  // Hören statt sehen (M6): alle drei Einsätze zugleich über Boss mit voller Wucht, Hochreaktion, Feuer, wenig Leben und Effekten.
  // Prüft außerdem Schnittstelle (state().hoeren), Log (note 'hoeren') und dass die Layer nach den Einsätzen wieder normal laufen.
  const hoerErg = {};
  for (const k of ['pforte', 'ufer', 'glasmeer']) {
    await ev(k => { Music.biome(k); Music.scene('boss'); Music.foeSpawn('ruft'); Music.foeSpawn('augen'); Music.hp(4, 40); Music.stoff('F'); Music.akt(4); Music.telegraph();
      Music.hoeren([{ art: 'angriff', stufe: 3, uid: 1 }, { art: 'schutz', uid: 2 }, { art: 'zauber', uid: 3 }]); }, k);
    await bisBiom(k); await warte(5000);
    await ev(() => { Music.resetPeak(); window.__reset(); });
    for (let i = 0; i < 2; i++) { await ev(() => { Music.reaction(true); sfx.hoch(); sfx.hit(6); sfx.hurt(); Music.reaction(false); sfx.react(4); sfx.heal(); }); await warte(3000); }
    const h = await ev(() => ({ m: window.__mess(), peakIntern: Music.state().peak, h: Music.state().hoeren, l: Music.state().layerLevels, vl: Music.state().voiceLevel }));
    await ev(() => { Music.hoeren([]); Music.victory(); Music.stoff('keiner'); Music.akt(0); Music.hp(40, 40); });
    await warte(7000);
    const danach = await ev(() => ({ h: Music.state().hoeren, log: Music.state().log.filter(e => e.was === 'hoeren').map(e => e.why) }));
    hoerErg[k] = { ...h, danach };
  }

  // Nur Musik (ohne SFX): Kapelle, Wächter, wenig Leben, Hochreaktion. Zeigt den Spielraum vor dem Limiter.
  await ev(() => { Music.biome('kapelle'); Music.scene('waechter'); Music.foeSpawn('glockenmutter'); Music.foeSpawn('chorknabe'); Music.hp(8, 40); Music.telegraph(); });
  await bisBiom('kapelle');
  await ev(() => { Music.resetPeak(); window.__reset(); });
  await warte(3000); await ev(() => Music.reaction(true)); await warte(5000);
  const nurMusik = await ev(() => ({ m: window.__mess(), peakIntern: Music.state().peak }));
  await ev(() => { Music.victory(); Music.hp(40, 40); });

  // Stoffe der Reihe nach (Färbung), Enden, Niederlage, Übergang
  await ev(() => { Music.resetPeak(); window.__reset(); Music.biome('hafen'); Music.scene('kampf'); Music.foeSpawn('tiefling'); });
  for (const st of ['E', 'F', 'W', 'S', 'B', 'G', 'L', 'V', 'keiner']) { await ev(st => Music.stoff(st), st); await warte(700); }
  await ev(() => { Music.victory(); Music.uebergang(); }); await warte(4000);
  await ev(() => Music.ende('bleiben')); await warte(9000);
  const nachBleiben = await ev(() => Music.state().layerLevels);
  await ev(() => Music.scene('menu')); await warte(1500);
  await ev(() => Music.ende('umkehren')); await warte(7000);
  const nachUmkehren = await ev(() => ({ l: Music.state().layerLevels, dark: Music.state().dark, chord: Music.state().chord }));
  await ev(() => Music.scene('karte')); await warte(1000);
  await ev(() => Music.niederlage()); await warte(5000);
  const rest = await ev(() => ({ m: window.__mess(), peakIntern: Music.state().peak }));
  await ev(() => Music.scene('menu'));

  // Einzelmessung: jede Gegnerstimme und jedes Rollen-Instrument allein (Lautheit und Klangfarbe)
  const stimmen = [], rollen = [];
  if (!SCHNELL) {
    for (const f of Object.keys(foes)) {
      await ev(f => { Music.solo({ layer: 'voice', foe: f, biome: Music.FOES[f].biom }); }, f);
      await warte(3200); // Biom-Wechsel und Stimme auf der nächsten Taktgrenze
      await ev(() => window.__reset()); await warte(3000);
      stimmen.push({ f, ...(await ev(() => window.__mess())) });
    }
    for (const r of Object.keys(await ev(() => Music.ROLES))) {
      await ev(r => Music.solo({ layer: 3, role: r, biome: 'hafen' }), r);
      await warte(1500); await ev(() => window.__reset()); await warte(3000);
      rollen.push({ r, ...(await ev(() => window.__mess())) });
    }
    await ev(() => Music.solo(null));
  }

  const bpm = await ev(() => window.__bpm);
  const evs = await ev(() => window.__ev);
  await browser.close();

  // ---------- Auswertung ----------
  const jeTakt = new Map(); bpm.forEach(([bar, b]) => jeTakt.set(bar, b));
  const takte = [...jeTakt.entries()].sort((a, b) => a[0] - b[0]);
  let tempoFehler = 0, maxSprung = 0, min = 999, max = 0;
  takte.forEach(([bar, b], i) => {
    min = Math.min(min, b); max = Math.max(max, b);
    if (b < 80 || b > 88) tempoFehler++;
    if (i && takte[i - 1][0] === bar - 1) { const d = Math.abs(b - takte[i - 1][1]); maxSprung = Math.max(maxSprung, d); if (d > 1) tempoFehler++; }
  });
  const verlauf = takte.map(t => t[1]).join(' ');

  console.log('\nSPITZENPEGEL JE BIOM (Kampf mit zwei Stimmen, Treffer, Hochreaktion, Abgesang, Duell, Sieg, Wächter)');
  console.log('Biom      Stimmen                                  Ausgang  vor Limiter  RMS');
  zeilen.forEach(z => console.log(`${z.biom.padEnd(9)} ${z.stimmen.padEnd(40)} ${dB(z.m.peak)}   ${dB(z.peakIntern)}     ${dB(z.m.rms)}`));
  console.log(`Härtetest (Boss, 4 Leben, Feuer, 3× Hochreaktion + SFX): Ausgang ${dB(hart.m.peak)} dBFS, vor Limiter ${dB(hart.peakIntern)} dBFS`);
  let hoerFehler = 0;
  Object.entries(hoerErg).forEach(([k, h]) => {
    const ok = h.h.angriff === 3 && h.h.schutz && h.h.zauber && Math.abs(h.h.duck - .75) < 1e-6 && h.danach.h.duck === 1 && !h.danach.h.angriff && !h.danach.h.schutz && !h.danach.h.zauber && h.danach.log.length >= 2 && h.m.peak < 0;
    if (!ok) hoerFehler++;
    console.log(`Hören (${k}): alle drei Einsätze + Boss + Hochreaktion + Feuer: Ausgang ${dB(h.m.peak)} dBFS, vor Limiter ${dB(h.peakIntern)} dBFS, Einsatz-Pegel ${h.h.pegel} dBFS, Layer 2/3 ×${h.h.duck}, danach Layer wieder normal ×${h.danach.h.duck} ${ok ? 'OK' : 'FEHLER'}`);
  });
  console.log(`Nur Musik (Wächter Kapelle, Hochreaktion, ohne SFX):   Ausgang ${dB(nurMusik.m.peak)} dBFS, vor Limiter ${dB(nurMusik.peakIntern)} dBFS, RMS ${dB(nurMusik.m.rms)}`);
  console.log(`Stoffe, Übergang, Enden, Niederlage:                     Ausgang ${dB(rest.m.peak)} dBFS, vor Limiter ${dB(rest.peakIntern)} dBFS`);
  console.log(`Ende »bleiben« nach 9 s, Layer-Pegel: ${JSON.stringify(nachBleiben)}`);
  console.log(`Ende »umkehren« nach 7 s: ${JSON.stringify(nachUmkehren)}`);
  if (stimmen.length) {
    console.log('\nGEGNERSTIMMEN EINZELN (Duell-Fassung, mit Grund-Layer aus)   RMS dBFS   Spitze   Zentroid Hz');
    stimmen.forEach(s => console.log(`  ${s.f.padEnd(16)} ${dB(s.rms)}   ${dB(s.peak)}   ${Math.round(s.zentroid)}`));
    console.log('ROLLEN-INSTRUMENTE (Layer 3 allein, Hafen)                    RMS dBFS   Spitze   Zentroid Hz');
    rollen.forEach(s => console.log(`  ${s.r.padEnd(16)} ${dB(s.rms)}   ${dB(s.peak)}   ${Math.round(s.zentroid)}`));
  }
  console.log(`\nTEMPO: ${takte.length} Takte, ${min} bis ${max} BPM, größter Sprung ${maxSprung} BPM pro Takt, Verstöße ${tempoFehler}`);
  console.log('Verlauf: ' + verlauf);
  const arten = {}; evs.forEach(e => arten[e.was] = (arten[e.was] || 0) + 1);
  console.log('\nENTSCHEIDUNGEN (onEvent): ' + Object.entries(arten).map(([k, v]) => `${k} ${v}`).join(', '));
  console.log('Beispiele: ' + evs.slice(0, 6).map(e => `${e.was} (${e.why})`).join(' | '));
  const alle = [...zeilen.map(z => z.m.peak), ...Object.values(hoerErg).map(h => h.m.peak), hart.m.peak, nurMusik.m.peak, rest.m.peak, ...stimmen.map(s => s.peak), ...rollen.map(s => s.peak)];
  const spitze = Math.max(...alle);
  console.log(`\nGRÖSSTE SPITZE AM AUSGANG: ${spitze.toFixed(2)} dBFS ${spitze < 0 ? '(kein Clipping)' : '(CLIPPING!)'}`);
  console.log(fehler.length ? 'KONSOLENFEHLER:\n' + fehler.join('\n') : 'Keine Konsolenfehler.');
  process.exit(spitze >= 0 || tempoFehler || fehler.length || hoerFehler ? 1 : 0);
})();
