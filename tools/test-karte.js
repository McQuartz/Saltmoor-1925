// Auftrag 3, M3: Peilkarte (05-oberflaeche.md Abschnitt 7). Prüft das Netz je Akt über viele Seeds:
// Ebenen nach run.json, jeder Knoten hat einen Ausgang und (ab Ebene 2) einen Eingang, keine Kreuzung, alles führt zum Wächter,
// höchstens zwei Folgen je Akt, gleicher Seed = gleiches Netz, Brüchiger Gang stürzt nur nach der Tat ein und lässt einen Ausgang,
// Wandbild hebt den Nebel bis zum Wächter, Dunkler Stollen zeigt sein Zeichen erst direkt davor, Speicherstand trägt das Netz.
// node tools/test-karte.js [seeds=150]
const { ladeKern } = require('./kern');
let fehler = 0; const ok = (c, m) => { if (!c) { fehler++; if (fehler < 30) console.log('FEHLER: ' + m); } };
(async () => {
  const K = ladeKern(); await K.init(); const run = K.run; const n = +(process.argv[2] || 150);
  const RUN = K.get('RUN'), BIOMES = K.get('BIOMES');
  const folgen = { bruch: 0, kurz: 0, dunkel: 0 }; let netze = 0, knoten = 0;
  for (let s = 1; s <= n; s++) {
    run(`newRun('fischer',${s},{dev:true});for(let i=0;i<5;i++)S.route[i]=RUN.akte[i].biome[${s}%RUN.akte[i].biome.length];if(!BIOMES[S.route[4]])S.route[4]='pforte';`);
    for (let akt = 0; akt < 5; akt++) {
      const N = JSON.parse(run(`S.akt=${akt};S.ebene=0;S.netz=null;genWeg();JSON.stringify(S.netz)`)); netze++;
      const eb = RUN.akte[akt].ebenen;
      ok(N.ebenen.length === eb.length, `Seed ${s} Akt ${akt}: ${N.ebenen.length} Ebenen statt ${eb.length}`);
      N.ebenen.forEach((l, e) => { const E = RUN.ebenen[eb[e]]; knoten += l.length;
        if (E.fest) ok(l.length === 1 && l[0].art === E.fest, `Seed ${s} Akt ${akt} Ebene ${e}: fest ${E.fest}`);
        else if (!E.fest_wahl) ok(l.length >= E.wege[0] && l.length <= E.wege[1], `Seed ${s} Akt ${akt} Ebene ${e}: ${l.length} Knoten`);
        l.forEach((v, i) => { ok(v.i === i, `Seed ${s}: Knoten-Index`);
          if (e < N.ebenen.length - 1) ok(N.kanten.some(k => k.a[0] === e && k.a[1] === i), `Seed ${s} Akt ${akt}: Knoten ${e}/${i} ohne Ausgang`);
          if (e > 0) ok(N.kanten.some(k => k.b[0] === e && k.b[1] === i), `Seed ${s} Akt ${akt}: Knoten ${e}/${i} ohne Eingang`); }); });
      const norm = N.kanten.filter(k => !k.kurz);
      ok(norm.every(k => k.b[0] === k.a[0] + 1), `Seed ${s} Akt ${akt}: Pfad überspringt eine Ebene ohne Abkürzung`);
      let kreuz = 0; for (const k of norm) for (const l of norm) if (k.a[0] === l.a[0] && k.a[1] < l.a[1] && k.b[1] > l.b[1]) kreuz++;
      ok(!kreuz, `Seed ${s} Akt ${akt}: ${kreuz} Kreuzungen`);
      N.kanten.filter(k => k.kurz).forEach(k => { ok(k.b[0] === k.a[0] + 2 && N.ebenen[k.b[0]][k.b[1]].art === 'kampf_schwer', `Seed ${s}: Abkürzung falsch`); });
      // alle Wege führen zum Wächter / Finale: von jedem Knoten aus ist die letzte Ebene erreichbar
      const L = N.ebenen.length - 1; const erreicht = new Set([L + ':0']);
      for (let e = L - 1; e >= 0; e--) N.ebenen[e].forEach((_, i) => { if (N.kanten.some(k => k.a[0] === e && k.a[1] === i && erreicht.has(k.b[0] + ':' + k.b[1]))) erreicht.add(e + ':' + i); });
      ok(N.ebenen.every((l, e) => l.every((_, i) => erreicht.has(e + ':' + i))), `Seed ${s} Akt ${akt}: ein Knoten führt nicht zum Wächter`);
      ok(N.folgen.length <= 2 && new Set(N.folgen).size === N.folgen.length, `Seed ${s} Akt ${akt}: Folgen ${N.folgen}`);
      N.folgen.forEach(f => folgen[f]++);
      // Brüchiger Gang: der Knoten davor hat noch einen anderen Ausgang
      N.kanten.filter(k => k.bruch).forEach(k => ok(N.kanten.filter(l => l !== k && l.a[0] === k.a[0] && l.a[1] === k.a[1]).length >= 1, `Seed ${s}: brüchiger Gang ist der einzige Ausgang`));
    }
  }
  console.log(`Netze: ${netze}, Knoten: ${knoten}, Folgen: ${JSON.stringify(folgen)}`);
  ok(folgen.bruch > 0 && folgen.kurz > 0 && folgen.dunkel > 0, 'jede Folge kommt vor');
  // Gleicher Seed → gleiches Netz
  const netzVon = s => run(`newRun('pfarrerin',${s},{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=1;S.ebene=0;S.netz=null;genWeg();JSON.stringify(S.netz)`);
  ok(netzVon(42) === netzVon(42), 'gleicher Seed ergibt anderes Netz'); ok(netzVon(42) !== netzVon(43), 'anderer Seed ergibt dasselbe Netz');
  // Weg gehen: S.weg = Ausgänge der Stelle, chooseWeg setzt die Stelle
  const g = JSON.parse(run(`(()=>{newRun('fischer',7,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=0;S.ebene=0;S.netz=null;genWeg();const w0=S.weg.length,e0=S.netz.ebenen[0].length;
    chooseWeg(0);const pos=S.netz.pos;const o={w0,e0,pos,ebene:S.ebene};S.phase='x';finishNode();o.weg=S.weg.map(x=>x.ziel);o.soll=S.netz.kanten.filter(k=>k.a[0]===pos[0]&&k.a[1]===pos[1]).map(k=>k.b);return JSON.stringify(o);})()`));
  ok(g.w0 === g.e0, `Aktanfang: alle Knoten der ersten Ebene wählbar (${g.w0}/${g.e0})`);
  ok(g.pos[0] === 0 && g.ebene === 0, `nach der Wahl steht man auf Ebene 0 (${g.pos})`);
  ok(JSON.stringify(g.weg) === JSON.stringify(g.soll), `danach: nur die Ausgänge des Knotens (${JSON.stringify(g.weg)} / ${JSON.stringify(g.soll)})`);
  // Brüchiger Gang: vor der Tat begehbar, danach weg, Rumpeln
  const b = JSON.parse(run(`(()=>{for(let s=1;s<400;s++){newRun('fischer',s,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=0;S.ebene=0;S.netz=null;genWeg();const k=S.netz.kanten.find(k=>k.bruch);if(!k)continue;
    S.netz.pos=k.bruch.ort;const imNebel=k.a[0]>netzSicht(S.netz);const vor=netzAusgaenge(S.netz,k.a).includes(k);let rum=0;Bus.on('rumpeln',()=>rum++);netzTat('falsch');const nachFalsch=netzAusgaenge(S.netz,k.a).includes(k);
    S.netz.pos=k.a;netzTat(k.bruch.tat);const amGang=netzAusgaenge(S.netz,k.a).includes(k);S.netz.pos=k.bruch.ort;netzTat(k.bruch.tat);
    const nach=netzAusgaenge(S.netz,k.a).includes(k);return JSON.stringify({s,vor,nachFalsch,amGang,nach,rum,imNebel,rest:netzAusgaenge(S.netz,k.a).length});}return '{}';})()`));
  ok(b.vor && b.nachFalsch && b.amGang && !b.nach && b.rum === 1 && b.rest >= 1 && b.imNebel, `Brüchiger Gang (Seed ${b.s}): vorher ${b.vor}, nach anderer Tat ${b.nachFalsch}, nach der Tat am Gang selbst ${b.amGang}, nach der Tat am Ort ${b.nach}, Rumpeln ${b.rum}, Ausgänge übrig ${b.rest}, Gang beim Einsturz im Nebel ${b.imNebel}`);
  // Jeder brüchige Gang liegt beim Einsturz im Nebel (mindestens drei Ebenen hinter dem Ort)
  { let n = 0, sicht = 0; for (let s = 1; s <= 150; s++) { const r = JSON.parse(run(`(()=>{newRun('fischer',${s},{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);const o=[];for(let a=0;a<4;a++){S.akt=a;S.ebene=0;S.netz=null;genWeg();const k=S.netz.kanten.find(k=>k.bruch);if(k){S.netz.pos=k.bruch.ort;o.push(k.a[0]>netzSicht(S.netz));}}return JSON.stringify(o)})()`)); r.forEach(x => { n++; if (!x) sicht++; }); }
    ok(n > 0 && sicht === 0, `Brüchige Gänge: ${n}, davon beim Einsturz sichtbar ${sicht} (soll 0)`); }
  // Nebel und Wandbild
  const w = JSON.parse(run(`(()=>{newRun('fischer',11,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=0;S.ebene=0;S.netz=null;genWeg();const a=netzSicht(S.netz);netzKlar();return JSON.stringify({a,b:netzSicht(S.netz),L:S.netz.ebenen.length-1});})()`));
  ok(w.a === 1 && w.b === w.L, `Nebel: am Aktanfang sichtbar bis Ebene ${w.a} (soll 1), nach dem Wandbild bis ${w.b} (soll ${w.L})`);
  const d = JSON.parse(run(`(()=>{for(let s=1;s<400;s++){newRun('fischer',s,{dev:true});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=0;S.ebene=0;S.netz=null;genWeg();const N=S.netz;let ziel=null;N.ebenen.forEach((l,e)=>l.forEach((v,i)=>{if(v.dunkel)ziel=[e,i];}));if(!ziel)continue;
    const vorne=N.kanten.find(k=>k.b[0]===ziel[0]&&k.b[1]===ziel[1]);N.pos=[ziel[0]-2,0];const weit=netzZeigt(N,ziel[0],ziel[1]);N.pos=vorne.a;const davor=netzZeigt(N,ziel[0],ziel[1]);N.pos=[0,0];N.klar=true;const klar=netzZeigt(N,ziel[0],ziel[1]);return JSON.stringify({s,weit,davor,klar});}return '{}';})()`));
  ok(d.weit === false && d.davor === true && d.klar === true, `Dunkler Stollen (Seed ${d.s}): von weiter weg ${d.weit}, direkt davor ${d.davor}, nach dem Wandbild ${d.klar}`);
  // Speicherstand
  const sp = JSON.parse(run(`(()=>{newRun('fischer',5,{dev:false});S.route=RUN.akte.map(a=>a.biome[0]);S.akt=0;S.ebene=0;S.netz=null;genWeg();chooseWeg(0);const vor=JSON.stringify(S.netz);save(true);S.netz=null;loadRun();return JSON.stringify({gleich:JSON.stringify(S.netz)===vor});})()`));
  ok(sp.gleich, 'Speicherstand trägt das Netz (gleich nach Laden)');
  console.log(fehler ? `${fehler} FEHLER` : 'Alles gut.'); process.exit(fehler ? 1 : 0);
})();
