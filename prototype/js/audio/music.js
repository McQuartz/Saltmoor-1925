// ===================== MUSIK =====================
// Dynamische Layer-Musik, ganz prozedural mit WebAudio. Keine Audiodateien, keine KI.
// Konzept: docs/auftrag/quellen/layer-musik.md
//
// Zwei Achsen:
//   Wucht  (wie viel passiert)    -> welche Layer laufen, wie dicht der Rhythmus ist
//   Gefahr (wie schlimm es steht) -> Tempo, Harmonie, Klangfarbe, Flirren
// Gegnerzahl bestimmt NICHT die Dichte. Gegnertypen belegen 2 Stimmen-Plätze (Frage/Antwort),
// der letzte Gegner wird zum Duell, erst der Sieg macht die Musik leer.
//
// Das Spiel meldet nur Zustände und Ereignisse (Music.scene, Music.hp, Music.foeSpawn, Music.reaction ...).
// Alles ändert sich auf Takt- oder Schlaggrenzen, damit es nie zusammengestückelt klingt.
// Jede Entscheidung des Dirigenten landet mit Grund im Log (Music.state().log) und geht an Music.onEvent(fn).
// In Godot entspricht das AudioStreamSynchronized (Layer) plus einem kleinen Dirigenten-Skript.
//
// Hörregeln (Ace): kein Clipping (gemeinsamer Limiter, Pegelmessung am Ausgang), nichts offkey
// (alle tonalen Töne aus Akkord bzw. Tonleiter), Tempo nur 80 bis 88 BPM und höchstens 1 BPM pro Takt,
// kein harter Komplett-Schnitt vor der Hochreaktion.

let VOL=1,AUFBAU=6; // AUFBAU: Takte für den Aufbau bei Wächter und Finale (Daten: balance.json → musik.boss_aufbau_takte)
const Music=(()=>{
// ---------- Daten: Biome ----------
// Akkorde als Halbtöne über dem Grundton; deg = Stufe in der Tonleiter (für Motive, damit alles in der Tonart bleibt).
// Alle sieben Biome teilen den Bauplan i – VI – iv – V. Gefahr kippt die Harmonie: VI wird zu ♭II
// (Halbton über dem Grundton), V bekommt die kleine None. So gelten für alle Biome dieselben Regeln.
const PROG=[[0,3,7],[-4,0,3],[5,8,12],[7,11,14]],PBASS=[0,-4,5,7],PDEG=[0,5,3,4];
const DARK=[[0,3,7],[1,5,8],[5,8,12],[7,11,20]],DBASS=[0,1,5,7],DDEG=[0,1,3,4];
const biom=(n,root,key,names,darkNames,o)=>Object.assign({n,root,key,prog:PROG,bass:PBASS,deg:PDEG,names,dark:DARK,darkBass:DBASS,darkDeg:DDEG,darkNames},o);
const BIOME={
 // amb = Ortsklang-Betten (Pegel), rhy = Rhythmus-Instrument in Layer 2, ort/rhyN = Beschreibung fürs Labor
 hafen:biom('Hafen',50,'d-Moll',['Dm','B','Gm','A'],['Dm','Es','Gm','A♭9'],
  {amb:{meer:.11},rhy:'ketten',ort:'Meer, ferne Glocke',rhyN:'Ketten, Pauke'}),
 moor:biom('Moorwald',48,'c-Moll',['Cm','As','Fm','G'],['Cm','Des','Fm','G♭9'],
  {amb:{sumpf:.08,insekten:.03},rhy:'holz',ort:'Insekten, Holz knackt, Wasser gurgelt',rhyN:'Holz und Knochen, Pauke'}),
 kapelle:biom('Kapelle',52,'e-Moll',['Em','C','Am','H'],['Em','F','Am','H♭9'],
  {amb:{wind:.09},rhy:'glocken',ort:'Zugluft, verstimmte Orgel',rhyN:'kleine Glocken, Pauke'}),
 salz:biom('Salzstollen',53,'f-Moll',['Fm','Des','B♭m','C'],['Fm','Ges','B♭m','C♭9'],
  {amb:{stollen:.08},rhy:'hacke',ort:'Tropfen, Holz knarrt, ferne Hacke, Salz knistert',rhyN:'Hacke auf Stein, Pauke'}),
 stadt:biom('Namenlose Stadt',46,'b-Moll',['B♭m','G♭','E♭m','F'],['B♭m','C♭','E♭m','F♭9'],
  {amb:{gaenge:.1,sand:.022},rhy:'trommel',ort:'Wind in Gängen, Sand rieselt',rhyN:'Trommel ohne Spieler, Pauke'}),
 eis:biom('Schwarzes Eis',54,'fis-Moll',['F♯m','D','Bm','C♯'],['F♯m','G','Bm','C♯♭9'],
  {amb:{eisgrund:.07,wind:.025},rhy:'eis',ort:'Eis knackt, tiefes Dröhnen, ferne Stimme',rhyN:'Eisknacken, Pauke'}),
 // Pforte: Harmonie dauerhaft halb gekippt (♭II statt VI, phrygische Leiter), bei Gefahr ganz gekippt
 pforte:biom('Pforte',51,'es-Moll',['E♭m','F♭','A♭m','B♭'],['E♭m','F♭','A♭m','B♭♭9'],
  {prog:[[0,3,7],[1,5,8],[5,8,12],[7,11,14]],bass:[0,1,5,7],deg:[0,1,3,4],phryg:true,
   amb:{schimmer:.035,eisgrund:.05},rhy:'atem',ort:'Raum ohne Wände: Schimmern, Sog',rhyN:'Atem rückwärts, Pauke'})
};
const MINOR=[0,2,3,5,7,8,10],PHRYG=[0,1,3,5,7,8,10];

// ---------- Gegnerstimmen ----------
// Motive: [Schritt im Takt (16tel), Tonleiterstufe über dem Akkordgrundton, Länge in 16teln].
// oct = Lage bei Grundton D (50), wird mit dem Biom mitgeschoben. stack = zusätzliche Stufen (mehrstimmig).
// Wächter: base = Stimme ihres Bioms, eine Oktave tiefer und gedoppelt.
const FOES={
 // Hafen
 netzflickerin:{n:'Netzflickerin',biom:'hafen',k:'gezupfte, verstimmte Saite',oct:62,motif:[[0,0,2],[2,2,2],[4,4,3],[10,3,2],[12,2,4]]},
 tiefling:  {n:'Tiefling',biom:'hafen',k:'tiefes, nasses Blech',oct:38, motif:[[0,0,3],[4,0,1],[6,2,2],[8,1,6]]},
 schmuggler:{n:'Schmuggler',biom:'hafen',k:'gepfiffenes Motiv',oct:74,motif:[[0,4,3],[3,3,1],[4,2,6],[12,0,4]]},
 // Moorwald
 hirte:     {n:'Hirte',biom:'moor',k:'hohle Holzflöte',oct:62,motif:[[0,4,6],[6,2,2],[8,0,8]]},
 torfstecherin:{n:'Torfstecherin',biom:'moor',k:'Summen, sehr tief',oct:38,motif:[[0,0,8],[8,2,4],[12,0,4]]},
 nest:      {n:'Das Nest',biom:'moor',k:'schnarrendes Zirpen auf Tonhöhe',oct:86,motif:[[0,4,1],[1,4,1],[2,4,2],[8,2,1],[9,2,1],[10,2,2]]},
 // Kapelle
 chorknabe: {n:'Chorknabe',biom:'kapelle',k:'hoher Knabenchor auf »oh«',oct:74,stack:[0,2],motif:[[0,0,6],[6,2,2],[8,0,8]]},
 kultist:   {n:'Kultist',biom:'kapelle',k:'gedämpfter Männerchor',oct:62, motif:[[0,4,6],[6,5,2],[8,4,8]]},
 ertrunkener:{n:'Ertrunkener',biom:'kapelle',k:'gurgelnde Stimme',oct:62,motif:[[2,6,2],[4,5,2],[8,4,4],[12,3,4]]},
 // Salzstollen
 schlundtraeger:{n:'Schlundträger',biom:'salz',k:'Kehlgesang',oct:38,motif:[[0,0,12],[12,4,4]]},
 salzlaeufer:{n:'Salzläufer',biom:'salz',k:'Klicken auf Tonhöhe',oct:74,motif:[[0,0,1],[2,2,1],[4,4,1],[5,2,1],[8,0,1],[10,-3,1]]},
 grabwaechter:{n:'Grabwächter',biom:'salz',k:'Horn aus Knochen',oct:50,motif:[[0,0,6],[8,4,8]]},
 // Namenlose Stadt
 bote:      {n:'Bote',biom:'stadt',k:'Röhren mit Echo',oct:50,motif:[[0,0,6],[8,2,3],[12,0,4]]},
 schatten:  {n:'Schatten',biom:'stadt',k:'Flüstern',oct:74, motif:[[0,7,4],[6,8,2],[10,7,6]]},
 mumie:     {n:'Erbauer-Mumie',biom:'stadt',k:'tiefe Rahmentrommel auf Tonhöhe',oct:38,motif:[[0,0,2],[3,0,1],[6,4,2],[8,0,2],[11,3,1],[14,4,2]]},
 // Schwarzes Eis
 rufer:     {n:'Der Rufer',biom:'eis',k:'menschliche Formanten »a«, mittel',oct:62,motif:[[0,4,4],[4,2,8]]},
 eisgesicht:{n:'Das Eisgesicht',biom:'eis',k:'menschliche Formanten »u«, hoch, unter Eis',oct:74,motif:[[0,2,8],[8,0,8]]},
 nachgeher: {n:'Der Nachgeher',biom:'eis',k:'menschliche Formanten »o«, tief',oct:50,motif:[[2,0,3],[6,0,2],[10,2,4]]},
 // Pforte
 augen:     {n:'Augen im Rand',biom:'pforte',k:'kleine hohe Glasklänge',oct:86,motif:[[0,7,1],[3,9,1],[6,11,1],[11,7,2]]},
 ruft:      {n:'Das, was ruft',biom:'pforte',rang:'boss',k:'Nebelhorn',oct:38,motif:[[0,0,8],[8,-1,8]]},
 // Wächter: Stimme des Bioms, eine Oktave tiefer und gedoppelt
 lotse:     {n:'Der Lotse',biom:'hafen',rang:'waechter',base:'netzflickerin'},
 opfernde:  {n:'Der Opfernde',biom:'moor',rang:'waechter',base:'hirte'},
 glockenmutter:{n:'Die Glockenmutter',biom:'kapelle',rang:'waechter',base:'chorknabe'},
 wurm:      {n:'Der Wurm im Salz',biom:'salz',rang:'waechter',base:'schlundtraeger'},
 windgestalt:{n:'Der Wind, der Gestalt hat',biom:'stadt',rang:'waechter',base:'bote'},
 chor:      {n:'Der Chor im Eis',biom:'eis',rang:'waechter',base:'rufer'}
};
Object.values(FOES).forEach(f=>{f.rang=f.rang||'normal';if(f.base)f.k=FOES[f.base].k+', Oktave tiefer, gedoppelt';});
// Alte Gegner-IDs aus foes.json, damit das Spiel sie direkt melden kann
const ALIAS={cultist:'kultist',fishman:'tiefling',drowned:'ertrunkener',shade:'schatten',boss:'ruft'};
const foeId=t=>FOES[t]?t:ALIAS[t];

const ROLES={
 friedhofswaerter:{n:'Friedhofswärter',k:'Spieluhr'},
 fischer:{n:'Fischer',k:'Ziehharmonika'},
 pfarrerin:{n:'Pfarrerin',k:'Orgel'},
 detektiv:{n:'Detektiv',k:'Gedämpfte Trompete'},
 okkultist:{n:'Okkultist',k:'Glasharfe'},
 kneipenschlaeger:{n:'Kneipenschläger',k:'Verstimmtes Klavier'}
};
// Stoff-Färbung des Mix (dominanter Stoff im Loadout): Tiefpass, Hall, Verzerrung, Resonanz (pk), Höhen (hs)
const STOFFE={
 keiner:{n:'keiner',lp:16000,wet:.18,drive:0},
 E:{n:'Eisen',lp:11000,wet:.16,drive:.3,pk:[2300,7,4]},       // metallischer Beiklang
 F:{n:'Feuer',lp:9000,wet:.12,drive:2.5},
 W:{n:'Wasser',lp:1300,wet:.5,drive:0},
 S:{n:'Salz',lp:14000,wet:.07,drive:0,hs:2},                 // trocken, hell, kristallin
 B:{n:'Blut',lp:5000,wet:.2,drive:.8,heart:1.7},
 G:{n:'Glaube',lp:7000,wet:.62,drive:0,oct:true},
 L:{n:'Licht',lp:16000,wet:.32,drive:0,hs:4,glanz:true},     // Glanz oben, Antworttöne eine Oktave höher
 V:{n:'Fäulnis',lp:4200,wet:.25,drive:.4,rot:true}
};
// Schwellen der Layer (an bei >=, aus erst unter Schwelle-HYST)
const TH=[0,.15,.4,.62,.88],HYST=.07,TH_DRIVE=.6;
const BASE={menu:0,karte:.22,kampf:.45,waechter:.52,boss:.6,ende:0,niederlage:0};
const PUBLIC_SCENES=['menu','karte','kampf','waechter','boss'];
const AKT_GEFAHR=.03; // Grundgefahr je Akt: der Ruf wird mit der Tiefe hörbar

// ---------- Zustand ----------
const S={scene:'menu',biome:'hafen',hp:40,hpMax:40,foes:[],role:'fischer',stoff:'keiner',akt:0,
 wucht:0,gefahr:0,momentum:0,spike:0,telegraph:false,bpm:80,
 gate:[true,false,false,false,false],drive:false,chord:0,bar:0,slot:null,duel:false,
 chain:0,lastReact:-99,dark:false,nextBiome:null,anschlag:false,pendingAns:[],dropStep:-1,hitStep:-1,bellStep:-1,victory:false,abgesang:[],
 lastAbgesang:null,fin:null,finPending:null,peak:0,log:[]};

let ctx=null,NBUF=null,timer=null,running=false,step=0,nextT=0,lastUpd=0;
let dropF,drones=[],dissO,flirrO=[],tuned=[],master,duckG,dropG,shaper,driveG,toneF,pkF,hsF,dryG,wetG,hall,comp,L=[],voiceBus,flirrG,dissG,droneG;
let beds={},farIn,echoIn,echoD,peakA,peakBuf;
const listeners=[];
// Layer-Pegel selbst mitrechnen: Chrome rechnet die Automation stummer Knoten nicht weiter, gain.value bleibt dann stehen
const LV={0:{v0:1,tgt:1,t0:0,tc:1},1:{v0:0,tgt:0,t0:0,tc:1},2:{v0:0,tgt:0,t0:0,tc:1},3:{v0:0,tgt:0,t0:0,tc:1},4:{v0:0,tgt:0,t0:0,tc:1},v:{v0:0,tgt:0,t0:0,tc:1}};
function lvAt(k,t){const e=LV[k];return t<=e.t0?e.v0:e.tgt+(e.v0-e.tgt)*Math.exp(-(t-e.t0)/e.tc);}
function lv(k,tgt,t,tc){LV[k]={v0:lvAt(k,t),tgt,t0:t,tc};(k==='v'?voiceBus:L[k]).gain.setTargetAtTime(tgt,t,tc);}
const mtof=m=>440*Math.pow(2,(m-69)/12);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const spb=()=>60/S.bpm/4; // Sekunden pro 16tel
const z=v=>v.toFixed(2).replace('.',','); // Zahl für Gründe im Log

// Entscheidung protokollieren und an Zuhörer (Dev-Modus) melden
function note(was,why,extra){
 const e=Object.assign({t:ctx?+ctx.currentTime.toFixed(2):0,bar:S.bar,was,why},extra||{});
 S.log.push(e);if(S.log.length>20)S.log.shift();
 listeners.forEach(fn=>{try{fn(e);}catch(err){}});
}

function getCtx(){
 if(typeof au==='function'){au();if(typeof AC!=='undefined'&&AC)return AC;} // gemeinsam mit sfx.js
 return new(window.AudioContext||window.webkitAudioContext)();
}
function curve(k){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=k?Math.tanh(x*(1+k))/Math.tanh(1+k):x;}return c;}
function impulse(sec,pw=2.6){const r=ctx.sampleRate,len=r*sec,b=ctx.createBuffer(2,len,r);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,pw);}return b;}

function build(){
 ctx=getCtx();
 NBUF=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);{const d=NBUF.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
 // Kette: Layer -> dropG -> dropF -> duckG -> shaper -> toneF -> pkF -> hsF -> (dry + hall) -> comp -> master -> Ausgang
 master=ctx.createGain();master.gain.value=.75*VOL;
 comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.attack.value=.01;comp.release.value=.25;
 dropG=ctx.createGain();duckG=ctx.createGain();
 dropF=ctx.createBiquadFilter();dropF.type='lowpass';dropF.frequency.value=18000;dropF.Q.value=.9; // Atemholen vor der Hochreaktion, Niederlage
 shaper=ctx.createWaveShaper();shaper.curve=curve(0);driveG=ctx.createGain(); // gleicht die Lautstärke nach der Verzerrung aus
 toneF=ctx.createBiquadFilter();toneF.type='lowpass';toneF.frequency.value=16000;
 pkF=ctx.createBiquadFilter();pkF.type='peaking';pkF.frequency.value=2300;pkF.Q.value=7;pkF.gain.value=0; // Stoff Eisen
 hsF=ctx.createBiquadFilter();hsF.type='highshelf';hsF.frequency.value=5000;hsF.gain.value=0;             // Stoffe Salz, Licht
 dryG=ctx.createGain();wetG=ctx.createGain();wetG.gain.value=.18;
 hall=ctx.createConvolver();hall.buffer=impulse(2.8);
 dropG.connect(dropF).connect(duckG).connect(shaper).connect(driveG).connect(toneF).connect(pkF).connect(hsF);
 hsF.connect(dryG).connect(comp);hsF.connect(hall).connect(wetG).connect(comp);
 // Gemeinsamer Ausgang mit Limiter (sfx.js). Fehlt er, bekommt die Musik einen eigenen Limiter.
 let out;
 if(typeof OUT!=='undefined'&&OUT&&OUT.context===ctx)out=OUT;
 else{out=ctx.createDynamicsCompressor();out.threshold.value=-4;out.knee.value=2;out.ratio.value=20;out.attack.value=.001;out.release.value=.12;out.connect(ctx.destination);}
 comp.connect(master).connect(out);
 // Pegelmessung am gemeinsamen Ausgang (Musik + SFX, vor dem Limiter)
 peakA=ctx.createAnalyser();peakA.fftSize=2048;peakBuf=new Float32Array(peakA.fftSize);out.connect(peakA);
 for(let i=0;i<5;i++){const g=ctx.createGain();g.gain.value=i===0?1:0;g.connect(dropG);L.push(g);}
 voiceBus=ctx.createGain();voiceBus.gain.value=0;voiceBus.connect(dropG);
 // Echo für den Boten (punktierte Achtel, folgt dem Tempo)
 echoIn=ctx.createGain();echoD=ctx.createDelay(2);echoD.delayTime.value=spb()*3;const eFb=ctx.createGain();eFb.gain.value=.38;
 const eF=ctx.createBiquadFilter();eF.type='lowpass';eF.frequency.value=1800;const eOut=ctx.createGain();eOut.gain.value=.6;
 echoIn.connect(echoD).connect(eF).connect(eFb).connect(echoD);eF.connect(eOut).connect(voiceBus);
 // Ferne: langer, dunkler Hall für Ortsklänge in der Entfernung und den Übergangs-Glockenschlag
 farIn=ctx.createGain();const farF=ctx.createBiquadFilter();farF.type='lowpass';farF.frequency.value=2400;
 const farC=ctx.createConvolver();farC.buffer=impulse(4.2,2);const farG=ctx.createGain();farG.gain.value=.55;
 farIn.connect(farF).connect(farC).connect(farG).connect(dropG);

 // Layer 0: Ortsklang-Betten (Rauschen mit langsamer Bewegung), alle laufen, nur das Biom regelt die Pegel
 const amb=(name,type,f,q,rate,depth,o={})=>{const src=ctx.createBufferSource();src.buffer=NBUF;src.loop=true;
  const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;
  const mod=ctx.createGain();mod.gain.value=1;const lf=ctx.createOscillator();lf.frequency.value=rate;const lg=ctx.createGain();lg.gain.value=depth;lf.connect(lg).connect(mod.gain);
  if(o.sweep){const sl=ctx.createOscillator();sl.frequency.value=o.sweep[0];const sg=ctx.createGain();sg.gain.value=o.sweep[1];sl.connect(sg).connect(fl.frequency);sl.start();}
  const g=ctx.createGain();g.gain.value=0;src.connect(fl).connect(mod).connect(g).connect(L[0]);src.start(0,Math.random()*1.5);lf.start();beds[name]=g;};
 amb('meer','lowpass',480,.7,.07,.6);
 amb('wind','bandpass',900,.8,.11,.6);
 amb('sumpf','lowpass',320,.9,.05,.5);                       // Moor: nasser, tiefer Grund
 amb('insekten','bandpass',5200,6,23,.9,{sweep:[.13,600]});  // Moor: Zirpen im Schilf
 amb('stollen','lowpass',150,.8,.04,.4);                     // Salz: Grollen im Berg
 amb('gaenge','bandpass',520,5,.16,.75,{sweep:[.07,260]});   // Stadt: Wind in Gängen, atmet
 amb('sand','highpass',5500,.7,.3,.6);                       // Stadt: Sand rieselt
 // Oszillator-Betten (folgen dem Grundton): Eis-Dröhnen, Pforten-Schimmern
 const oscBed=(name,parts)=>{const g=ctx.createGain();g.gain.value=0;g.connect(L[0]);
  parts.forEach(([iv,type,det,v,lp])=>{const o=ctx.createOscillator();o.type=type;o.frequency.value=mtof(50+iv);o.detune.value=det;const og=ctx.createGain();og.gain.value=v;
   if(lp){const fl=ctx.createBiquadFilter();fl.type='lowpass';fl.frequency.value=lp;o.connect(fl).connect(og);}else o.connect(og);og.connect(g);o.start();tuned.push([o,iv]);});
  beds[name]=g;return g;};
 oscBed('eisgrund',[[-24,'sine',0,.9],[-17,'sine',5,.45],[-24,'sawtooth',-4,.5,110]]);
 const sch=oscBed('schimmer',[[36,'sine',-3,.5],[36,'sine',3,.5],[43,'sine',2,.35]]);
 {const tl=ctx.createOscillator();tl.frequency.value=.23;const tg=ctx.createGain();tg.gain.value=.4;const m=ctx.createGain();m.gain.value=.6;
  sch.disconnect();sch.connect(m).connect(L[0]);tl.connect(tg).connect(m.gain);tl.start();}
 // Drone auf Grundton und Quinte
 const dF=ctx.createBiquadFilter();dF.type='lowpass';dF.frequency.value=260;droneG=ctx.createGain();droneG.gain.value=.05;dF.connect(droneG).connect(L[0]);
 drones=[[-12,-6],[-12,7],[-5,3]].map(([iv,det])=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=mtof(50+iv);o.detune.value=det;o.connect(dF);o.start();return [o,iv];});
 // Dissonanz-Drone (kleine Sekunde über dem Grundton) wächst mit der Gefahr
 const eo=ctx.createOscillator();eo.type='sawtooth';eo.frequency.value=mtof(39);dissO=eo;const xF=ctx.createBiquadFilter();xF.type='lowpass';xF.frequency.value=300;
 dissG=ctx.createGain();dissG.gain.value=0;eo.connect(xF).connect(dissG).connect(L[0]);eo.start();
 // Flirren: kleine Sekunde hoch oben mit Tremolo, Stärke folgt der Gefahr
 flirrG=ctx.createGain();flirrG.gain.value=0;const trem=ctx.createGain();trem.gain.value=.5;
 const tl=ctx.createOscillator();tl.frequency.value=7;const tlG=ctx.createGain();tlG.gain.value=.5;tl.connect(tlG).connect(trem.gain);tl.start();
 flirrO=[36,37].map(iv=>{const o=ctx.createOscillator();o.frequency.value=mtof(50+iv);o.connect(flirrG);o.start();return [o,iv];});
 flirrG.connect(trem).connect(L[0]); // hängt am Grund, damit es auch bei wenig Wucht unheimlich wird
 retune(ctx.currentTime,true);bedLevels(ctx.currentTime);
}

// ---------- Klangbausteine ----------
// o: type, v, a (Anschlag), pad (Halten statt Abklingen), r (Ausklang), det, glide (Zielfaktor am Ende),
//    from/fromT (Einschwingen von f*from nach f), vib [Hz, Tiefe], lp/lpEnd/ft/q (Filter), rot:false (keine Fäulnis-Verstimmung)
function tone(dest,t,f,dur,o={}){
 const os=ctx.createOscillator();os.type=o.type||'sine';
 if(o.from){os.frequency.setValueAtTime(f*o.from,t);os.frequency.exponentialRampToValueAtTime(f,t+(o.fromT||.05));}else os.frequency.setValueAtTime(f,t);
 if(o.glide)os.frequency.exponentialRampToValueAtTime(f*o.glide,t+dur);
 os.detune.value=(o.det||0)+(S.stoff==='V'&&o.rot!==false?(Math.random()*40-20):0);
 if(o.vib){const v=ctx.createOscillator();v.frequency.value=o.vib[0];const vg=ctx.createGain();vg.gain.value=f*o.vib[1];v.connect(vg).connect(os.frequency);v.start(t);v.stop(t+dur+.1);}
 const g=ctx.createGain(),v=o.v??.2,a=o.a??.004;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);
 if(o.pad){g.gain.setValueAtTime(v,t+Math.max(a,dur-(o.r??.3)));g.gain.linearRampToValueAtTime(0,t+Math.max(a+.01,dur));}
 else g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(dur,a+.01));
 let n=os;
 if(o.lp){const fl=ctx.createBiquadFilter();fl.type=o.ft||'lowpass';fl.frequency.setValueAtTime(o.lp,t);if(o.lpEnd)fl.frequency.exponentialRampToValueAtTime(o.lpEnd,t+dur);fl.Q.value=o.q??.7;os.connect(fl);n=fl;}
 n.connect(g).connect(dest);os.start(t);os.stop(t+dur+.05);
}
function noise(dest,t,dur,o={}){
 const s=ctx.createBufferSource();s.buffer=NBUF;const fl=ctx.createBiquadFilter();fl.type=o.type||'bandpass';
 fl.frequency.setValueAtTime(o.f||1000,t);if(o.fEnd)fl.frequency.exponentialRampToValueAtTime(o.fEnd,t+dur);fl.Q.value=o.q??1;
 const g=ctx.createGain(),v=o.v??.2,a=o.a??.003;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);
 if(o.cut){g.gain.setValueAtTime(v,t+dur);g.gain.linearRampToValueAtTime(0,t+dur+.012);} // abrupt (rückwärts-Klang)
 else g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(dur,a+.01));
 s.connect(fl).connect(g).connect(dest);s.start(t,Math.random()*1.5);s.stop(t+dur+.05);
}
// Hüllkurve (Anschwellen, Halten, Ausklingen) als Ziel-Knoten für mehrteilige Stimmen
function env(dest,t,dur,v,a=.05,r=.2){const g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);
 g.gain.setValueAtTime(v,t+Math.max(a,dur-r));g.gain.linearRampToValueAtTime(0,t+Math.max(a+.01,dur));g.connect(dest);return g;}
// Gezupfte Saite (Karplus-Strong), je MIDI-Ton einmal berechnet
const KS={};
function ksBuf(m){if(KS[m])return KS[m];const sr=ctx.sampleRate,f=mtof(m),N=Math.max(2,Math.round(sr/f-.5)),len=Math.floor(sr*1.4),b=ctx.createBuffer(1,len,sr),d=b.getChannelData(0);
 let mean=0;for(let i=0;i<N;i++){d[i]=Math.random()*2-1;if(i)d[i]=d[i]*.55+d[i-1]*.45;mean+=d[i];}mean/=N;for(let i=0;i<N;i++)d[i]-=mean;
 for(let i=N;i<len;i++)d[i]=.4975*(d[i-N]+(i-N-1>=0?d[i-N-1]:0));
 return KS[m]={b,rate:f*(N+.5)/sr};}
function ksPluck(dest,t,m,v,det){const k=ksBuf(m),s=ctx.createBufferSource();s.buffer=k.b;s.playbackRate.value=k.rate;
 s.detune.setValueAtTime(det+28,t);s.detune.linearRampToValueAtTime(det,t+.07); // verstimmt: Anschlag zu hoch, sackt ab
 const g=ctx.createGain();g.gain.value=v;s.connect(g).connect(dest);s.start(t);s.stop(t+1.4);}
// Menschliche Formanten ohne Worte: Stimme (Sägezahn) und Atem (Rauschen) durch drei Formantfilter
const VOW={a:[[800,1,9],[1150,.55,10],[2900,.22,14]],o:[[450,1,8],[800,.5,10],[2830,.14,14]],u:[[325,1,7],[700,.3,9],[2700,.08,14]],oh:[[520,1,8],[880,.55,9],[3000,.2,14]]};
function formant(dest,t,f,dur,vow,o={}){
 const g=env(dest,t,dur,o.v??.1,o.a??.12,o.r??.25);let tail=g;
 if(o.lp){const fl=ctx.createBiquadFilter();fl.type='lowpass';fl.frequency.value=o.lp;g.disconnect();g.connect(fl).connect(dest);}
 const src=ctx.createGain(),n=o.voices||1,br=o.breath||0;
 VOW[vow].forEach(([F,amp,q])=>{const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=F*(o.fs||1);bp.Q.value=q;const ag=ctx.createGain();ag.gain.value=amp;src.connect(bp).connect(ag).connect(tail);});
 for(let i=0;i<n;i++){const os=ctx.createOscillator();os.type='sawtooth';const fi=f;
  if(o.from){os.frequency.setValueAtTime(fi*o.from,t);os.frequency.exponentialRampToValueAtTime(fi,t+.12);}else os.frequency.setValueAtTime(fi,t);
  if(o.glide)os.frequency.exponentialRampToValueAtTime(fi*o.glide,t+dur);
  os.detune.value=(i-(n-1)/2)*8;
  if(o.vib){const vo=ctx.createOscillator();vo.frequency.value=o.vib[0]*(1+i*.07);const vg=ctx.createGain();vg.gain.value=fi*o.vib[1];vo.connect(vg).connect(os.frequency);vo.start(t);vo.stop(t+dur+.1);}
  const og=ctx.createGain();og.gain.value=(1-br)/n;os.connect(og).connect(src);os.start(t);os.stop(t+dur+.05);}
 if(br){const s=ctx.createBufferSource();s.buffer=NBUF;const bg=ctx.createGain();bg.gain.value=br*2.2;s.connect(bg).connect(src);s.start(t,Math.random()*1.5);s.stop(t+dur+.05);}
}

const heart=(t,v)=>{const k=(STOFFE[S.stoff].heart||1);tone(L[1],t,88,.32,{glide:.45,v:v*k});noise(L[1],t,.03,{f:180,q:.8,v:v*.25*k});};
const bassNote=(t,m,dur)=>{tone(L[1],t,mtof(m),dur,{type:'triangle',v:.13,a:.03,pad:true,r:.35,rot:false});tone(L[1],t,mtof(m),dur,{type:'sawtooth',v:.035,a:.03,pad:true,r:.35,lp:280,rot:false});};
// Rhythmus-Instrument des Bioms (Layer 2), auf 2 und 4 bzw. als Achtel in der treibenden Fassung
function rhy(t,v){const b=BIOME[S.biome],r=b.root,d=L[2];
 switch(b.rhy){
  case 'glocken':tone(d,t,mtof(r+48),.12,{v:v*.35,rot:false});tone(d,t,mtof(r+48)*1.5,.07,{v:v*.15,rot:false});noise(d,t,.02,{f:7000,q:2,v:v*.3});return;
  case 'holz':{ // Holzblock auf Grundton/Quinte, dazwischen Knochen-Klappern
   const hi=Math.random()<.5;tone(d,t,mtof(r+(hi?31:36)),.07,{type:'triangle',v:v*.9,lp:2400,rot:false});noise(d,t,.012,{f:1800,q:3,v:v*.5});
   if(Math.random()<.45){noise(d,t+.03,.01,{f:2600,q:5,v:v*.6});noise(d,t+.055,.01,{f:2300,q:5,v:v*.45});}return;}
  case 'hacke':{ // Hacke auf Stein: Knack, kurzer Metallklang (Grundton, Duodezime), Steinschlag
   noise(d,t,.006,{f:5000,type:'highpass',q:.7,v:v*1.1});tone(d,t,mtof(r+48),.09,{v:v*.3,lp:4000,rot:false});tone(d,t,mtof(r+48)*3,.04,{v:v*.08,rot:false});
   noise(d,t,.06,{f:420,type:'lowpass',q:.8,v:v*.8});return;}
  case 'trommel':{ // Trommel ohne Spieler: dumpf, manchmal fehlt ein Schlag, nie ganz im Raster
   if(Math.random()<.22)return;const tt=t+Math.random()*.018;
   tone(d,tt,mtof(r-5),.22,{glide:.88,v:v*1.6,lp:500,rot:false});noise(d,tt,.05,{f:700,q:1,v:v*.5});return;}
  case 'eis':{ // Eisknacken: kurzer dispersiver Zirp nach unten plus Klick
   tone(d,t,2600+Math.random()*900,.045,{glide:.12,v:v*.5,rot:false});noise(d,t,.008,{f:4000,type:'highpass',q:.7,v:v*.7});return;}
  case 'atem':{ // Pforte: Atem rückwärts, schwillt an und bricht ab
   const len=S.drive?spb()*.9:spb()*3;noise(d,t,len,{f:600,fEnd:2400,q:1.4,v:v*.9,a:len*.95,cut:true});return;}
  default: noise(d,t,.05,{f:4200,q:1.6,v});noise(d,t+.018,.04,{f:5600,q:2,v:v*.6}); // Ketten
 }
}
// Pauke gestimmt: Grundton oder Quinte, mit leichtem Absacken wie ein echtes Fell
const pauke=(dest,t,v,fifth)=>{const f=mtof(BIOME[S.biome].root-12+(fifth?7:0));tone(dest,t,f*1.04,.6,{glide:.96,v,rot:false});tone(dest,t,f*2.01,.25,{v:v*.2,rot:false});noise(dest,t,.07,{f:280,q:.9,v:v*.35});};
function pad(t,chord,dur){
 const lp=1500-950*S.gefahr;
 chord.forEach(iv=>{const f=mtof(BIOME[S.biome].root+iv);[-9,9].forEach(det=>tone(L[3],t,f,dur,{type:'sawtooth',v:.028,a:.5,pad:true,r:.6,det,lp}));});
}
// Melodie: Klangfarbe kommt von der Rolle
function melNote(t,m,dur){
 if(STOFFE[S.stoff].oct)m+=12;const f=mtof(m),d=L[3];
 switch(S.role){
  case 'friedhofswaerter': // Spieluhr: Zinke mit hohen Teiltönen und kleinem Mechanik-Tick
   tone(d,t,f,1.3,{v:.07});tone(d,t,f*3,.45,{v:.018});tone(d,t,f*5.4,.2,{v:.008});noise(d,t,.004,{f:6500,type:'highpass',v:.025});break;
  case 'fischer': // Ziehharmonika: zwei schwebende Zungen, Balg-Luft
   tone(d,t,f,dur,{type:'square',v:.03,a:.04,pad:true,r:.12,lp:1800,vib:[5.5,.004]});tone(d,t,f*1.005,dur,{type:'sawtooth',v:.02,a:.04,pad:true,r:.12,lp:1500});
   noise(d,t,Math.min(dur,.25),{f:1200,q:.8,v:.012,a:.05});break;
  case 'pfarrerin': // Orgel: Flötenregister aus Teiltönen, kleiner Anblas-Chiff
   [1,2,3,4].forEach((h,i)=>tone(d,t,f*h,dur,{v:[.045,.025,.015,.01][i],a:.06,pad:true,r:.2}));noise(d,t,.05,{f:f*4,q:4,v:.015});break;
  case 'detektiv': // gedämpfte Trompete: näselnder Dämpfer, Filter öffnet beim Anblasen
   tone(d,t,f,dur,{type:'sawtooth',v:.05,a:.05,pad:true,r:.15,ft:'bandpass',lp:800,lpEnd:1400,q:2.5,vib:[4.5,.006],from:.985,fromT:.06});
   tone(d,t,f,dur,{type:'sawtooth',v:.012,a:.06,pad:true,r:.15,ft:'bandpass',lp:1900,q:6});break;
  case 'okkultist': // Glasharfe: langsam einschwingend, rein
   tone(d,t,f,dur*1.6,{v:.06,a:.12,pad:true,r:.6,vib:[3,.003]});tone(d,t,f*2.01,dur*1.6,{type:'triangle',v:.015,a:.15,pad:true,r:.6});break;
  case 'kneipenschlaeger': // verstimmtes Klavier: zwei Saiten pro Ton, Hammer
   [-14,12].forEach(det=>tone(d,t,f,.9,{type:'triangle',v:.05,det}));tone(d,t,f*2,.3,{v:.015});noise(d,t,.015,{f:f*4,q:1.5,v:.03});break;
 }
}
// Gegnerstimmen. Alle Tonhöhen kommen als MIDI-Ton aus degSemi(), also aus der aktuellen Tonleiter.
function foeNote(type,t,m,dur,v){
 const f=mtof(m),d=voiceBus;
 switch(type){
  case 'kultist':[-7,7].forEach(det=>{tone(d,t,f,dur,{type:'sawtooth',v:.05*v,a:.18,pad:true,r:.3,det,ft:'bandpass',lp:760,q:5});tone(d,t,f,dur,{type:'sawtooth',v:.03*v,a:.18,pad:true,r:.3,det,ft:'bandpass',lp:1150,q:6});});break;
  case 'tiefling':tone(d,t,f,dur,{type:'sawtooth',v:.11*v,a:.03,pad:true,r:.12,lp:380,lpEnd:900,q:3});tone(d,t,f/2,dur,{v:.08*v,a:.03,pad:true,r:.12});break;
  case 'ertrunkener':tone(d,t,f,dur,{v:.08*v,a:.05,pad:true,r:.2,vib:[9,.03]});tone(d,t,f*.5,dur,{type:'triangle',v:.03*v,a:.05,pad:true,r:.2,vib:[9,.03]});break;
  case 'schatten':noise(d,t,dur,{f,q:28,v:.9*v,a:dur*.4});noise(d,t,dur,{f:f*1.06,q:28,v:.5*v,a:dur*.6});break;
  case 'ruft':tone(d,t,f,dur,{type:'sawtooth',v:.09*v,a:.25,pad:true,r:.5,lp:340,q:1.5});tone(d,t,f/2,dur,{v:.1*v,a:.25,pad:true,r:.5});break;
  case 'netzflickerin': // zwei Saiten, gegeneinander verstimmt, die zweite einen Hauch später
   ksPluck(d,t,m,.2*v,-16);ksPluck(d,t+.012,m,.14*v,14);break;
  case 'schmuggler': // Pfiff: Sinus mit Ansatz von unten, Vibrato, etwas Luft
   tone(d,t,f,dur,{v:.05*v,a:.03,pad:true,r:.08,from:.94,fromT:.06,vib:[5.5,.007]});noise(d,t,dur,{f,q:30,v:.18*v,a:.03});break;
  case 'hirte': // hohle Holzflöte: Dreieck gefiltert, Anblas-Chiff, Atem
   tone(d,t,f,dur,{type:'triangle',v:.075*v,a:.07,pad:true,r:.2,lp:f*2.5,vib:[4.5,.005]});noise(d,t,.07,{f:f*2,q:3,v:.06*v});noise(d,t,dur,{f:f,q:12,v:.1*v,a:.1});break;
  case 'torfstecherin': // Summen mit geschlossenem Mund, sehr tief
   tone(d,t,f,dur,{type:'sawtooth',v:.11*v,a:.25,pad:true,r:.4,lp:300,q:1.2,vib:[4.8,.004]});tone(d,t,f,dur,{v:.07*v,a:.25,pad:true,r:.4});break;
  case 'nest':{ // schnarrendes Zirpen: Sägezahn, im Takt eines Insektenflügels zerhackt
   const g=env(d,t,dur,.06*v,.004,.03),am=ctx.createGain();am.gain.value=.5;const lf=ctx.createOscillator();lf.type='square';lf.frequency.value=36;const lg=ctx.createGain();lg.gain.value=.5;
   lf.connect(lg).connect(am.gain);const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=f*.8;
   o.connect(hp).connect(am).connect(g);o.start(t);lf.start(t);o.stop(t+dur+.05);lf.stop(t+dur+.05);break;}
  case 'chorknabe': // Knabenchor auf »oh«: drei Stimmen, helles Formant-Register
   formant(d,t,f,dur,'oh',{v:.5*v,voices:3,a:.15,r:.3,vib:[5.2,.005],breath:.12,fs:1.12});break;
  case 'schlundtraeger':{ // Kehlgesang: tiefer Grundton, ein enges Filter wandert über die Obertöne (nur Oktaven und Quinten)
   const g=env(d,t,dur,.11*v,.2,.35),o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;
   const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=f*2.2;const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=22;
   const hs=[4,6,8,6,4,3];bp.frequency.setValueAtTime(f*hs[0],t);hs.forEach((h,i)=>bp.frequency.linearRampToValueAtTime(f*h,t+dur*(i+1)/hs.length));
   const bg=ctx.createGain();bg.gain.value=4;o.connect(lp).connect(g);o.connect(bp).connect(bg).connect(g);o.start(t);o.stop(t+dur+.05);break;}
  case 'salzlaeufer': // Klicken auf Tonhöhe: drei sehr kurze Anschläge
   for(let k=0;k<3;k++){tone(d,t+k*.032,f,.04,{type:'triangle',v:.2*v*(1-k*.2),a:.001});noise(d,t+k*.032,.006,{f:f*3,q:4,v:.16*v});}break;
  case 'grabwaechter': // Horn aus Knochen: Lippen-Ansatz von unten, Filter öffnet, hohl und luftig
   tone(d,t,f,dur,{type:'sawtooth',v:.07*v,a:.12,pad:true,r:.3,lp:f*1.5,lpEnd:f*4,q:1.5,from:.96,fromT:.1});noise(d,t,dur,{f:f*3,q:6,v:.08*v,a:.15});break;
  case 'bote':{ // Röhren mit Echo: rauer, schwankender Ruf, läuft ins Echo
   const e=ctx.createGain();e.connect(d);e.connect(echoIn);
   tone(e,t,f,dur,{type:'sawtooth',v:.09*v,a:.08,pad:true,r:.25,lp:f*3,q:4,from:.88,fromT:.15,vib:[6.5,.018]});noise(e,t,dur,{f:f*2,q:3,v:.12*v,a:.1});break;}
  case 'mumie': // tiefe Rahmentrommel auf Tonhöhe
   tone(d,t,f*1.03,.45,{glide:.94,v:.23*v});tone(d,t,f*2,.12,{type:'triangle',v:.05*v});noise(d,t,.04,{f:900,type:'lowpass',q:.7,v:.13*v});break;
  case 'rufer':formant(d,t,f,dur,'a',{v:.45*v,a:.08,r:.3,breath:.3,vib:[5,.01],glide:.97});break;
  case 'eisgesicht':formant(d,t,f,dur,'u',{v:.62*v,a:.2,r:.4,breath:.55,vib:[4,.006],lp:1400});break;
  case 'nachgeher':formant(d,t,f,dur,'o',{v:.62*v,a:.06,r:.2,breath:.35,vib:[3.3,.012]});break;
  case 'augen': // kleine Glasklänge: Grundton, Oktave, Duodezime
   tone(d,t,f,.9,{v:.07*v,a:.002});tone(d,t,f*2,.4,{v:.025*v,a:.002});tone(d,t,f*3,.2,{v:.01*v,a:.002});break;
 }
}
function tutti(t,chord){
 const r=BIOME[S.biome].root;
 tone(L[4],t,mtof(r-24),1.3,{glide:.7,v:.42,rot:false});noise(L[4],t,.9,{f:650,q:.5,v:.18,type:'lowpass'});
 chord.forEach(iv=>tone(L[4],t,mtof(r+12+iv),1.5,{type:'sawtooth',v:.035,lp:2200,lpEnd:900}));
 tone(L[4],t,mtof(r+24+chord[0]),2.2,{v:.06});tone(L[4],t,mtof(r+24+chord[0])*2.76,.8,{v:.012});
}
function bell(t,m,v=.05){if(STOFFE[S.stoff].glanz)m+=12;tone(dropG,t,mtof(m),1.4,{v,rot:false});tone(dropG,t,mtof(m)*3,.4,{v:v*.25,rot:false});}
// Tiefer Glockenschlag für den Akt-Wechsel: Glocken-Teiltöne (Hum, Prim, kleine Terz, Quinte, Oktave) mit langem Hall
function bigBell(t){const r=BIOME[S.biome].root,b=ctx.createGain();b.gain.value=1;b.connect(dropG);b.connect(farIn);
 [[-24,.11,7],[-12,.08,5.5],[-9,.035,4],[-5,.03,3.2],[0,.026,2.6],[7,.01,1.8]].forEach(([iv,v,d])=>tone(b,t,mtof(r+iv),d,{v,a:.003,rot:false}));
 noise(b,t,.09,{f:1600,q:.8,v:.09});}

// Ortsklang-Ereignisse (Layer 0): selten, zufällig (reine Kosmetik), tonale Klänge aus dem aktuellen Akkord
function ambEvent(t,s,bar,ch){
 const b=BIOME[S.biome],r=b.root,k=lvAt(0,t);if(k<.05)return;const R=Math.random,dry=L[0];
 const ct=()=>ch.c[Math.floor(R()*3)];
 switch(b.detail||S.biome){ // neue Biome aus Paketen leihen sich die Ortsklang-Details eines alten Bioms (detail)
  case 'hafen':if(bar%4===2&&s===8&&R()<.8){tone(farIn,t,mtof(r+12),3,{v:.07,rot:false});tone(farIn,t,mtof(r+12)*2.378,1.2,{v:.012,rot:false});}break; // ferne Glocke (Teilton 2,378 = kleine Dezime, in der Tonart)
  case 'moor':
   if(s%4===0&&R()<.14){const n=2+Math.floor(R()*3);for(let i=0;i<n;i++)noise(dry,t+i*(.015+R()*.03),.005,{f:2600,type:'highpass',q:.8,v:.08});} // Holz knackt
   if(s%4===2&&R()<.08){for(let i=0;i<3+Math.floor(R()*3);i++)tone(dry,t+i*.07,mtof(r+24+ct()),.05,{glide:1.6,v:.02,lp:1400});} // Wasser gurgelt
   break;
  case 'kapelle':
   if(bar%8===4&&s===0)ch.c.forEach(iv=>tone(farIn,t,mtof(r+12+iv),spb()*28,{type:'square',v:.012,a:.6,pad:true,r:1.5,det:(R()*24-12),lp:1100,rot:false})); // verstimmte Orgel
   if(s%4===0&&R()<.08)tone(farIn,t,mtof(r+36+ct()),.9,{v:.025,rot:false});break;
  case 'salz':
   if(s%4===0&&R()<.28){const m=r+36+ct();tone(dry,t,mtof(m),.09,{glide:1.25,v:.03,rot:false});tone(farIn,t,mtof(m),.09,{glide:1.25,v:.03,rot:false});} // Tropfen
   if(s%4===2&&R()<.05){let x=t;for(let i=0;i<12;i++){x+=.012+i*.004;noise(dry,x,.004,{f:900,q:3,v:.05});}} // Holz knarrt
   if(bar%2===1&&s===8&&R()<.6){tone(farIn,t,mtof(r+48),.15,{v:.05,rot:false});tone(farIn,t,mtof(r+48)*3,.06,{v:.012,rot:false});noise(farIn,t,.05,{f:500,type:'lowpass',v:.08});} // ferne Hacke
   if(R()<.12)noise(dry,t+R()*spb(),.003,{f:7500,type:'highpass',q:.7,v:.025}); // Salz knistert
   break;
  case 'stadt':
   if(bar%2===0&&s===12&&R()<.5){const x=t+R()*.03;tone(farIn,x,mtof(r-12),.3,{glide:.9,v:.14,lp:400,rot:false});tone(farIn,x+spb()*2+R()*.03,mtof(r-5),.3,{glide:.9,v:.1,lp:400,rot:false});} // ferne Trommel ohne Spieler
   if(s%4===0&&R()<.05)noise(dry,t,1.4,{f:6000,type:'highpass',q:.7,v:.03,a:.5}); // Sand rieselt
   break;
  case 'eis':
   if(s%4===0&&R()<.07){tone(dry,t,3200,.09,{glide:.06,v:.05,rot:false});noise(dry,t,.01,{f:3000,type:'highpass',v:.06});tone(farIn,t,3200,.09,{glide:.06,v:.04,rot:false});} // Eis knackt
   if(bar%8===5&&s===0){ // ferne Stimme: zwei Silben, gefiltertes Rauschen mit Formanten, keine Sprache
    const m1=r+12+degSemi(ch,2),m2=r+12+degSemi(ch,0);
    formant(farIn,t,mtof(m1),spb()*5,'a',{v:.22,a:.15,r:.25,breath:.85,lp:1500});formant(farIn,t+spb()*6,mtof(m2),spb()*9,'o',{v:.22,a:.1,r:.6,breath:.85,lp:1500,glide:.98});}
   break;
  case 'pforte':
   if(bar%2===1&&s===8)noise(farIn,t,spb()*8,{f:300,fEnd:2600,q:1.2,v:.08,a:spb()*7.9,cut:true}); // Sog rückwärts in die Eins
   if(s%4===0&&R()<.18)tone(farIn,t,mtof(r+48+ct()),.6,{v:.012,rot:false});break;
 }
}

// Melodie über 8 Takte: [Schritt, Akkordton (0-2, 3-5 = Oktave höher), Länge]
const MEL=[
 [[0,2,6],[6,1,2],[8,0,8]],
 [[0,1,4],[4,2,4],[12,3,4]],
 [[0,2,6],[6,1,2],[8,0,4],[12,1,4]],
 [[0,3,8],[8,2,8]],
 [[0,4,4],[4,3,4],[8,5,4],[12,4,4]],
 [[0,5,6],[6,4,2],[8,3,8]],
 [[0,2,4],[4,1,4],[8,2,4],[12,1,4]],
 [[0,0,12]]
];
// ---------- Dirigent ----------
const combat=()=>S.scene==='kampf'||S.scene==='waechter'||S.scene==='boss';
function targets(){
 const solo=combat()&&S.foes.length===1;
 let w=BASE[S.scene]+(combat()?S.momentum:S.momentum*.3)+(solo?.18:0); // Duell-Bonus: der letzte Gegner ist ein Höhepunkt
 w=Math.max(clamp(w),S.spike);
 let g=clamp((.75-S.hp/S.hpMax)/.6)+(S.telegraph?.25:0);
 if(!combat())g*=.35;
 g+=S.akt*AKT_GEFAHR; // Grundgefahr steigt mit dem Akt (ohne Sog-Wert)
 if(S.scene==='menu'||S.fin)g=0;
 return [clamp(w),clamp(g)];
}
function update(){
 const now=ctx.currentTime,dt=Math.min(.2,now-lastUpd);lastUpd=now;
 S.momentum*=Math.exp(-dt/10);
 let [tw,tg]=targets();if(S.solo){tw=S.solo.drive?.7:.5;tg=S.solo.dark?.7:0;}
 const ease=(c,t)=>c+(t-c)*(1-Math.exp(-dt/(t>c?.5:7))); // schnell hoch, langsam runter
 S.wucht=ease(S.wucht,tw);S.gefahr=ease(S.gefahr,tg);
 if(!S.fin){dissG.gain.setTargetAtTime(S.gefahr*.045,now,.5);flirrG.gain.setTargetAtTime(S.gefahr>.55?(S.gefahr-.55)*.03:0,now,.5);}
 // Spitzenpegel am Ausgang
 peakA.getFloatTimeDomainData(peakBuf);let m=0;for(let i=0;i<peakBuf.length;i++){const a=Math.abs(peakBuf[i]);if(a>m)m=a;}if(m>S.peak)S.peak=m;
}
function bedLevels(t){const b=BIOME[S.biome],menu=S.scene==='menu',nl=S.fin==='niederlage';
 Object.entries(beds).forEach(([k,g])=>{let v=nl?(k==='meer'?.15:0):(b.amb[k]||0)*(menu?.75:1);g.gain.setTargetAtTime(v,t,1.2);});}
function barStart(t,bar){
 S.bar=bar;S.chord=bar%4;
 // Tempo: kleine Spanne (80 bis 88), höchstens 1 BPM pro Takt, damit man es spürt statt hört
 const bt=S.solo?80:Math.round(80+8*S.gefahr);S.bpm=clamp(S.bpm+Math.sign(bt-S.bpm),80,88);
 echoD.delayTime.setTargetAtTime(spb()*3,t,.3);
 // Harmonie kippt nur auf Taktgrenzen, mit Hysterese
 if(S.finPending){S.fin=S.finPending;S.finPending=null;finish(t,S.fin);}
 const was=S.dark;
 if(S.fin==='umkehren')S.dark=true;else if(S.fin)S.dark=false;
 else if(S.solo)S.dark=!!S.solo.dark;
 else S.dark=S.dark?S.gefahr>.42:S.gefahr>.5;
 if(S.dark!==was&&!S.solo)note(S.dark?'kippt':'löst sich',S.fin?'Ende: '+S.fin:(S.dark?`Gefahr ${z(S.gefahr)} > 0,50`:`Gefahr ${z(S.gefahr)} < 0,42`));
 if(S.nextBiome&&S.nextBiome!==S.biome){const alt=S.biome;S.biome=S.nextBiome;retune(t);note('biom',`${BIOME[alt].n} → ${BIOME[S.biome].n}, Überblendung auf der Taktgrenze`);}
 S.nextBiome=null;
 bedLevels(t);
 S.spike=Math.max(0,S.spike-.25);
 if(S.fin){S.chord=S.fin==='umkehren'?1:0;S.slot=null;S.duel=false;return;} // Schlussakkord bleibt stehen (auch für tonale SFX)
 // Layer schalten (mit Hysterese), nur auf Taktgrenzen
 if(S.solo){soloGates(t);}else{
 // Aufbau bei Wächter und Finale: Layer kommen nacheinander über AUFBAU Takte (Bass/Puls, dann Stimme, zuletzt volle Wucht)
 const cap=S.aufbau!=null?Math.min(4,1+Math.floor(Math.max(0,bar-S.aufbau)*4/AUFBAU)):4;if(cap>=4&&S.aufbau!=null){S.aufbau=null;note('aufbau','Aufbau fertig, alle Layer frei');}
 for(let i=1;i<4;i++){const on=(S.gate[i]?S.wucht>=TH[i]-HYST:S.wucht>=TH[i])&&i<=cap;setGate(i,on,t,i>cap?`Aufbau: Layer ${i} erst in Takt ${S.aufbau+Math.ceil((i-1)*AUFBAU/4)}`:`Wucht ${z(S.wucht)} ${on?'≥':'<'} ${z(on?TH[i]:TH[i]-HYST)}`);}
 // Tutti bleibt etwas Besonderes: nur nach einer Hochreaktion oder im Boss bei voller Wucht
 setGate(4,cap>=4&&(S.spike>0||(S.scene==='boss'&&S.wucht>=TH[4])),t,S.spike>0?'Hochreaktion klingt nach':(S.scene==='boss'&&S.wucht>=TH[4]?`Boss, Wucht ${z(S.wucht)} ≥ 0,88`:'Spitze abgeklungen'));
 const dr=S.drive;S.drive=S.drive?S.wucht>=TH_DRIVE-HYST:S.wucht>=TH_DRIVE;
 if(dr!==S.drive)note(S.drive?'treibend':'ruhig',`Rhythmus: Wucht ${z(S.wucht)}`);
 lv('v',combat()&&S.foes.length&&cap>=2?1:0,t,combat()?.2:.8);
 lv(0,S.scene==='menu'?.7:1,t,1);}
 // Stimmen-Plätze: Typen in Auftrittsreihenfolge, höchstens 2, im Wechsel
 const types=[...new Set(S.foes.map(f=>f.type))].slice(0,2);
 const duel=combat()&&S.foes.length===1&&!S.solo;
 if(duel!==S.duel)note(duel?'duell':'duell endet',duel?`nur noch ${FOES[S.foes[0].type].n}`:(S.foes.length?'wieder mehrere Gegner':'kein Gegner mehr'));
 S.duel=duel;
 S.slot=types.length?types[bar%types.length]:null;
 if(S.victory){S.victory=false;victoryCadence(t);}
}
function retune(t,now){const r=BIOME[S.biome].root,tc=now?.01:.8,set=(o,m)=>o.frequency.setTargetAtTime(mtof(m),t,tc);
 drones.forEach(([o,iv])=>set(o,r+iv));set(dissO,r-11);flirrO.forEach(([o,iv])=>set(o,r+iv));tuned.forEach(([o,iv])=>set(o,r+iv));}
// Vorhören einzelner Spuren (Klangliste): nur ein Layer oder nur die Gegnerstimme, festes Tempo
function soloGates(t){const o=S.solo;S.drive=!!o.drive;
 for(let i=1;i<5;i++)setGate(i,o.layer===i,t);
 lv(0,o.layer===0?1:0,t,.2);lv('v',o.layer==='voice'?1:0,t,.2);}
function setGate(i,on,t,why,still){if(S.gate[i]===on)return;S.gate[i]=on;lv(i,on?1:0,t,on?.15:.9);
 if(!S.solo&&!still)note(i===4?(on?'tutti':'tutti aus'):`layer ${i} ${on?'an':'aus'}`,why||'');}
function chordNow(){const b=BIOME[S.biome],dark=S.dark;return {c:(dark?b.dark:b.prog)[S.chord],bass:(dark?b.darkBass:b.bass)[S.chord],deg:(dark?b.darkDeg:b.deg)[S.chord],name:(dark?b.darkNames:b.names)[S.chord],scale:dark||b.phryg?PHRYG:MINOR};}
// Tonleiterstufe d über dem Akkord -> Halbtöne über dem Grundton. Auf der V wird die kleine Septime zum Leitton
// (harmonisch Moll) und die Quinte der V bleibt rein, auch in der phrygischen Leiter.
function degSemi(ch,d){const a=ch.deg+d,i=((a%7)+7)%7;let st=ch.scale[i]+12*Math.floor(a/7);if(ch.deg===4&&i===6)st+=1;if(ch.deg===4&&i===1&&ch.scale[1]===1)st+=1;return st;}

// Ende des Runs: Bleiben (löst sich in den Grundton auf, dann still), Umkehren (endet auf dem gekippten Akkord), Niederlage
function finish(t,art){
 const r=BIOME[S.biome].root,long=spb()*16*4;
 for(let i=1;i<5;i++){S.gate[i]=false;lv(i,0,t,1.2);}
 lv('v',0,t,.8);flirrG.gain.setTargetAtTime(0,t,1);
 if(art==='bleiben'){
  [-24,-12,0,12].forEach((iv,i)=>tone(dropG,t,mtof(r+iv),long,{type:i<2?'sine':'triangle',v:[.12,.07,.03,.015][i],a:1.2,pad:true,r:long*.6,rot:false}));
  [-8,8].forEach(det=>tone(dropG,t,mtof(r+7),long*.7,{type:'sawtooth',v:.012,a:1,pad:true,r:long*.5,det,lp:900,rot:false}));
  bell(t+spb()*4,r+24,.05);
  dissG.gain.setTargetAtTime(0,t,1);droneG.gain.setTargetAtTime(0,t+2,2.5);lv(0,0,t+long*.4,2.2);
 }else if(art==='umkehren'){
  const c=BIOME[S.biome].dark[1];// ♭II
  c.forEach(iv=>[-9,9].forEach(det=>tone(dropG,t,mtof(r+iv),long,{type:'sawtooth',v:.026,a:.8,pad:true,r:long*.55,det,lp:1100,lpEnd:500,rot:false})));
  tone(dropG,t,mtof(r+c[0]-12),long,{v:.1,a:.6,pad:true,r:long*.55,rot:false});
  // Aber du hörst es noch: Dissonanz und Flirren bleiben ganz leise
  dissG.gain.setTargetAtTime(.02,t,1.5);flirrG.gain.setTargetAtTime(.004,t+long*.5,2);lv(0,.35,t+long*.4,2.5);
 }else{ // Niederlage: dunkel ausblenden, Wasser-Rauschen bleibt
  dropF.frequency.cancelScheduledValues(t);dropF.frequency.setValueAtTime(dropF.frequency.value,t);dropF.frequency.exponentialRampToValueAtTime(260,t+3.5);
  dissG.gain.setTargetAtTime(0,t,1);droneG.gain.setTargetAtTime(0,t,2);tone(dropG,t,mtof(r-24),5,{v:.12,a:.05,glide:.8,rot:false});
 }
}
function clearFin(){if(!S.fin&&!S.finPending)return;const n=ctx?ctx.currentTime:0;S.fin=null;S.finPending=null;
 if(!ctx)return;dropF.frequency.cancelScheduledValues(n);dropF.frequency.setTargetAtTime(18000,n,.4);dropG.gain.cancelScheduledValues(n);dropG.gain.setTargetAtTime(1,n,.3);
 droneG.gain.cancelScheduledValues(n);droneG.gain.setTargetAtTime(.05,n,1);L[0].gain.cancelScheduledValues(n);lv(0,1,n,1);flirrG.gain.cancelScheduledValues(n);bedLevels(n);}

function schedule(st,t){
 const s=st%16,bar=Math.floor(st/16),root=BIOME[S.biome].root;
 if(s===0)barStart(t,bar);
 if(st===S.bellStep){bigBell(t);S.bellStep=-1;}
 if(S.fin){S.dropStep=S.hitStep=-1;if(S.fin==='umkehren'&&s===0)ambEvent(t,s,bar,chordNow());return;}
 const ch=chordNow(),barLen=spb()*16;
 // Atemholen vor der Hochreaktion: ein Schlag halb leise und dumpf mit Sog nach oben, dann alles (kein Komplett-Schnitt)
 const beat=spb()*4;
 if(st===S.dropStep){dropG.gain.cancelScheduledValues(t);dropG.gain.setTargetAtTime(.45,t,.07);dropF.frequency.cancelScheduledValues(t);dropF.frequency.setValueAtTime(18000,t);dropF.frequency.exponentialRampToValueAtTime(420,t+beat*.9);
  noise(duckG,t,beat,{f:300,fEnd:4000,q:1.8,v:.09,a:beat*.95});note('atemholen','Hochreaktion: ein Schlag halb leise und dumpf');}
 if(st===S.hitStep){dropG.gain.cancelScheduledValues(t);dropG.gain.setValueAtTime(.45,t);dropG.gain.linearRampToValueAtTime(1,t+.05);dropF.frequency.cancelScheduledValues(t);dropF.frequency.setValueAtTime(420,t);dropF.frequency.exponentialRampToValueAtTime(18000,t+.2);
  S.spike=1;S.wucht=1;for(let i=1;i<5;i++){const vor=S.gate[i];S.gate[i]=false;setGate(i,true,t,'Hochreaktion',vor);}S.drive=true;tutti(t,ch.c);}
 // Layer 0: Ortsklang-Ereignisse
 if(!S.solo||S.solo.layer===0)ambEvent(t,s,bar,ch);
 // Layer 1: Herzschlag (lub-dub), bei Wucht doppelt; Bass auf der Eins
 if(s===0)heart(t,.5);if(s===3)heart(t,.3);
 if(S.wucht>.55&&s===8)heart(t,.42);if(S.wucht>.55&&s===11)heart(t,.26);
 if(s===0)bassNote(t,root-12+ch.bass,barLen*.95);
 // Layer 2: Rhythmus-Instrument des Bioms und Pauke, ruhige oder treibende Fassung
 const fill=bar%4===3;
 if(S.drive){if(s%2===1||s===14||s===15)rhy(t,s%4===3?.16:.09);if([0,6,10,14].includes(s))pauke(L[2],t,.3,s===6||s===14);if(fill&&(s===13||s===15))pauke(L[2],t,.22,true);}
 else{if(s===4||s===12)rhy(t,.14);if(s===0||s===10)pauke(L[2],t,.24,s===10);if(fill&&s===14)rhy(t,.1);}
 // Layer 3: Akkordfläche + Melodie in der Klangfarbe der Rolle
 if(s===0)pad(t,ch.c,barLen);
 // 8-taktige Melodie: A, A', B (höher), Schluss auf dem Grundton. Töne sind Akkordtöne (3-5 = eine Oktave höher)
 MEL[bar%8].forEach(([ps,ci,len])=>{if(ps===s){const iv=ch.c[ci%3]+12*Math.floor(ci/3);melNote(t,root+12+iv,len*spb());}});
 // Layer 4: Paukenwirbel in den letzten Schlag und Akzent auf der Eins
 if(S.gate[4]){if(s===0&&st!==S.hitStep)tutti(t,ch.c);if(s>=12)pauke(L[4],t,.1+(s-12)*.06);}
 // Gegnerstimmen: Frage/Antwort, Duell = jeden Takt, oktaviert, lauter. Wächter: Stimme des Bioms, Oktave tiefer, gedoppelt
 if(S.slot&&combat())voice(S.slot,s,t,ch,root,S.duel?1.25:1);
 // Abgesang eines verstorbenen Typs: fallende Figur auf der nächsten Zählzeit
 if(s%4===0&&S.abgesang.length){const type=S.abgesang.shift(),fo=FOES[type],vb=fo.base||type,o=FOES[vb].oct-(fo.base?12:0);
  [4,3,2,0,-7].forEach((dg,i)=>foeNote(vb,t+i*spb()*2,o+(root-50)+degSemi(ch,dg),spb()*(i===4?8:2),.9));}
 // Antworttöne auf kleine Reaktionen: auf die nächste Achtel, Ketten steigen die Leiter hoch
 if(s%2===0&&S.pendingAns.length){const k=S.pendingAns.shift();bell(t,root+24+ch.c[k%3]+12*Math.floor(k/3),.05);}
 // Kampfauftakt: Schlag mit Akkord auf der nächsten Zählzeit
 if(S.anschlag&&s%4===0){S.anschlag=false;tone(dropG,t,mtof(root-24),1,{glide:.7,v:.35,rot:false});noise(dropG,t,.5,{f:400,q:.6,v:.15,type:'lowpass'});
  ch.c.forEach(iv=>[-8,8].forEach(det=>tone(dropG,t,mtof(root+iv),barLen*.6,{type:'sawtooth',v:.025,det,lp:1800,lpEnd:500,rot:false})));}
 // Angekündigter Angriff: Anschwellen über einen Takt
 if(s===0&&S.telegraph&&!S.telegraphRiser){S.telegraphRiser=true;noise(dropG,t,barLen,{f:250,fEnd:3200,q:2.5,v:.1,a:barLen*.92});}
}
function voice(type,s,t,ch,root,v){
 const fo=FOES[type],vb=fo.base||type,vf=FOES[vb],w=!!fo.base;
 vf.motif.forEach(([ms,dg,len])=>{if(ms!==s)return;const d=len*spb();
  (vf.stack||[0]).forEach((sd,k)=>{const m=vf.oct+(root-50)+degSemi(ch,dg+sd)-(w?12:0),kv=k?.5:1;
   foeNote(vb,t,m,d,v*kv);
   if(w)foeNote(vb,t,m+12,d,.45*kv);else if(S.duel)foeNote(vb,t,m+12,d,.55*kv);});});
}
function victoryCadence(t){
 const r=BIOME[S.biome].root;S.dark=false;
 [0,4,7,12].forEach(iv=>[-8,8].forEach(det=>tone(dropG,t,mtof(r+iv),spb()*30,{type:'sawtooth',v:.022,a:.3,pad:true,r:1.5,det,lp:1600,rot:false})));
 bell(t,r+24,.07);bell(t+spb()*4,r+28,.05);bell(t+spb()*8,r+31,.05);
}
function tick(){
 update();
 while(nextT<ctx.currentTime+.12){schedule(step,nextT);nextT+=spb();step++;}
}
// nächste Zählzeit (Viertel) im Planungsraster
const nextBeat=()=>Math.ceil((step+1)/4)*4;

// ---------- Schnittstelle fürs Spiel ----------
return {
 BIOME,FOES,ROLES,STOFFE,
 // Neues Biom aus einem Daten-Paket (data/biome/<id>.json → musik): {n, root, key, names, darkNames, amb, rhy, detail, phryg}
 aufbauTakte(n){AUFBAU=Math.max(1,n|0);},
 addBiome(k,o){if(!o||BIOME[k])return;const d=biom(o.n||k,o.root||50,o.key||'',o.names||['i','VI','iv','V'],o.darkNames||['i','♭II','iv','V♭9'],{amb:o.amb||{wind:.06},rhy:o.rhy||'holz',detail:o.detail||null,ort:o.ort||'',rhyN:o.rhyN||''});if(o.phryg){d.prog=[[0,3,7],[1,5,8],[5,8,12],[7,11,14]];d.bass=[0,1,5,7];d.deg=[0,1,3,4];d.phryg=true;}BIOME[k]=d;},
 // Lautstärke aus den Einstellungen (0..1, Standard 0,55 → etwas leiser als die Effekte)
 volume(v){VOL=Math.max(0,Math.min(1,v))/.55;if(ctx&&running)master.gain.setTargetAtTime(.75*VOL,ctx.currentTime,.15);},
 start(){if(!ctx)build();if(ctx.state==='suspended')ctx.resume();if(running)return;running=true;master.gain.setTargetAtTime(.75*VOL,ctx.currentTime,.3);nextT=ctx.currentTime+.08;lastUpd=ctx.currentTime;timer=setInterval(tick,25);},
 // Stop blendet nur aus: der AudioContext wird mit sfx.js geteilt und bleibt an
 stop(){if(!running)return;running=false;clearInterval(timer);master.gain.setTargetAtTime(0,ctx.currentTime,.3);},
 get running(){return running;},
 // Szenen: menu, karte, kampf, waechter (zwischen Kampf und Boss), boss
 scene(s){if(!PUBLIC_SCENES.includes(s))return;clearFin();const was=S.scene;
  if(!combat()&&(s==='kampf'||s==='waechter'||s==='boss')){S.momentum=0;S.anschlag=true;}if((s==='waechter'||s==='boss')&&was!==s){S.aufbau=S.bar+1;note('aufbau',`${s}: Layer bauen sich über ${AUFBAU} Takte auf`);}else if(!(s==='waechter'||s==='boss'))S.aufbau=null;S.scene=s;if(!combat())S.foes=[];
  if(was!==s)note('szene',`${was} → ${s}`);},
 hp(v,max){S.hp=clamp(v,0,max||S.hpMax);if(max)S.hpMax=max;},
 foeSpawn(type){const k=foeId(type);if(k)S.foes.push({type:k});},
 foeDie(type){const k=foeId(type),i=S.foes.findIndex(f=>f.type===k);if(i<0)return;S.foes.splice(i,1);S.momentum=Math.min(.35,S.momentum+.04);
  if(!S.foes.some(f=>f.type===k)){S.abgesang.push(k);S.lastAbgesang=k;note('abgesang',`letzter ${FOES[k].n} besiegt`);}},
 hit(dmg){S.hp=clamp(S.hp-dmg,0,S.hpMax);S.momentum=Math.min(.35,S.momentum+.06);S.telegraph=false;S.telegraphRiser=false;
  if(ctx){const n=ctx.currentTime;duckG.gain.cancelScheduledValues(n);duckG.gain.setValueAtTime(duckG.gain.value,n);duckG.gain.linearRampToValueAtTime(.4,n+.015);duckG.gain.setTargetAtTime(1,n+.08,.25);}},
 heal(v){S.hp=clamp(S.hp+v,0,S.hpMax);},
 strike(){S.momentum=Math.min(.35,S.momentum+.03);}, // eigener Angriff
 block(){S.momentum=Math.min(.35,S.momentum+.02);},
 reaction(hoch){
  if(hoch){S.dropStep=nextBeat();S.hitStep=S.dropStep+4;S.momentum=Math.min(.35,S.momentum+.15);return;}
  const bar=Math.floor(step/16);S.chain=bar-S.lastReact<=2?S.chain+1:0;S.lastReact=bar;
  S.pendingAns.push(Math.min(9,S.chain));S.momentum=Math.min(.35,S.momentum+.1);
 },
 telegraph(){S.telegraph=true;S.telegraphRiser=false;},
 victory(){if(!combat())return;S.foes=[];S.abgesang=[];S.victory=true;S.momentum=0;S.spike=0;S.telegraph=false;S.scene='karte';note('sieg','Kampf gewonnen: Schlusskadenz, dann leer');},
 role(r){if(ROLES[r]&&r!==S.role){S.role=r;note('rolle',ROLES[r].k);}},
 // Grundgefahr je Akt (0..4): der Ruf wird mit der Tiefe hörbar, ohne Sog-Wert
 akt(n){const a=clamp(Math.round(+n||0),0,4);if(a===S.akt)return;S.akt=a;note('akt',`Akt ${a+1}: Grundgefahr +${z(a*AKT_GEFAHR)}`);},
 // Ende nach dem Finale: 'bleiben' (löst sich in den Grundton auf, dann still) oder 'umkehren' (endet auf dem gekippten Akkord)
 ende(art){art=art==='umkehren'?'umkehren':'bleiben';S.finPending=art;S.scene='ende';S.foes=[];S.abgesang=[];S.momentum=0;S.spike=0;S.telegraph=false;S.dropStep=S.hitStep=-1;
  note('ende',art==='bleiben'?'Bleiben: Auflösung in den Grundton':'Umkehren: Schluss auf dem gekippten Akkord');},
 // Niederlage: dunkel ausblenden, nur das Wasser bleibt
 niederlage(){S.scene='niederlage';S.foes=[];S.abgesang=[];S.momentum=0;S.spike=0;S.telegraph=false;S.dropStep=S.hitStep=-1;S.finPending='niederlage';
  note('niederlage','Die Tiefe spuckt dich aus: dunkel ausblenden');},
 // Akt-Wechsel: tiefer Glockenschlag mit Hall auf der nächsten Zählzeit
 uebergang(){if(!ctx)return;if(running)S.bellStep=nextBeat();else bigBell(ctx.currentTime+.02);note('uebergang','Akt-Wechsel: Glockenschlag');},
 // Vorhören: {layer:0-4|'voice', biome, dark, drive, role, foe}. Ohne Argument zurück zum normalen Dirigenten.
 solo(o){if(!o){S.solo=null;S.foes=[];S.scene='menu';S.momentum=0;S.spike=0;return;}
  clearFin();S.solo=o;if(o.biome&&BIOME[o.biome]){S.nextBiome=o.biome;}if(o.role&&ROLES[o.role])S.role=o.role;
  S.hp=S.hpMax;S.telegraph=false;S.momentum=0;S.spike=0;S.pendingAns=[];S.abgesang=[];
  const fk=foeId(o.foe);if(o.layer==='voice'&&fk){S.scene=FOES[fk].rang==='normal'?'kampf':(FOES[fk].rang==='boss'?'boss':'waechter');S.foes=[{type:fk}];}else{S.scene='karte';S.foes=[];}},
 biome(k){if(BIOME[k]&&k!==S.biome)S.nextBiome=k;else if(k===S.biome)S.nextBiome=null;}, // wechselt auf der nächsten Taktgrenze
 // Für tonale SFX: Grundton und aktueller Akkord, damit Effekte in der Tonart klingen
 harmony(){const c=chordNow();return {root:BIOME[S.biome].root,chord:c.c,scale:c.scale};},
 stoff(k){if(!STOFFE[k])return;if(k!==S.stoff)note('stoff',STOFFE[k].n);S.stoff=k;if(!ctx)return;const st=STOFFE[k],n=ctx.currentTime;
  toneF.frequency.setTargetAtTime(st.lp,n,.4);wetG.gain.setTargetAtTime(st.wet,n,.4);shaper.curve=curve(st.drive);driveG.gain.setTargetAtTime(1/(1+st.drive*.45),n,.2);
  if(st.pk){pkF.frequency.setValueAtTime(st.pk[0],n);pkF.Q.setValueAtTime(st.pk[1],n);}pkF.gain.setTargetAtTime(st.pk?st.pk[2]:0,n,.4);hsF.gain.setTargetAtTime(st.hs||0,n,.4);},
 // Spitzenpegel zurücksetzen (Messung seit dem letzten Aufruf)
 resetPeak(){S.peak=0;},
 // Zuhörer für Entscheidungen des Dirigenten (Dev-Modus). Gibt eine Abmelde-Funktion zurück.
 onEvent(fn){if(typeof fn!=='function')return ()=>{};listeners.push(fn);return ()=>{const i=listeners.indexOf(fn);if(i>=0)listeners.splice(i,1);};},
 state(){const c=ctx&&running?chordNow():{name:'–'},cur=Math.max(0,step-1);
  return {scene:S.scene,wucht:S.wucht,gefahr:S.gefahr,bpm:S.bpm,gate:[...S.gate],drive:S.drive,
  chord:c.name,biome:S.biome,dark:S.dark,slot:S.slot,duel:S.duel,foes:S.foes.map(f=>f.type),hp:S.hp,hpMax:S.hpMax,chain:S.chain,telegraph:S.telegraph,momentum:S.momentum,
  bar:Math.floor(cur/16),beat:Math.floor((cur%16)/4)+1,akt:S.akt,role:S.role,stoff:S.stoff,abgesang:S.lastAbgesang,ende:S.fin,
  layerLevels:[0,1,2,3,4].map(i=>+clamp(lvAt(i,ctx?ctx.currentTime:0)).toFixed(3)),voiceLevel:+clamp(lvAt('v',ctx?ctx.currentTime:0)).toFixed(3),
  peak:S.peak>0?+(20*Math.log10(S.peak)).toFixed(2):-120,log:S.log.slice()};}
};
})();
