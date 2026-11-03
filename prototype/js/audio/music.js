// ===================== MUSIK =====================
// Dynamische Layer-Musik, ganz prozedural mit WebAudio. Keine Audiodateien, keine KI.
// Konzept: https://claude.ai/artifact/JXujgRxwk5MbRHoNQESCQ4
//
// Zwei Achsen:
//   Wucht  (wie viel passiert)    -> welche Layer laufen, wie dicht der Rhythmus ist
//   Gefahr (wie schlimm es steht) -> Tempo, Harmonie, Klangfarbe, Flirren
// Gegnerzahl bestimmt NICHT die Dichte. Gegnertypen belegen 2 Stimmen-Plätze (Frage/Antwort),
// der letzte Gegner wird zum Duell, erst der Sieg macht die Musik leer.
//
// Das Spiel meldet nur Zustände und Ereignisse (Music.scene, Music.hp, Music.foeSpawn, Music.reaction ...).
// Alles ändert sich auf Takt- oder Schlaggrenzen, damit es nie zusammengestückelt klingt.
// In Godot entspricht das AudioStreamSynchronized (Layer) plus einem kleinen Dirigenten-Skript.

const Music=(()=>{
// ---------- Daten: Biom, Gegnerstimmen, Rollen, Stoffe ----------
const BIOME={
 // Akkorde als Halbtöne über dem Grundton; deg = Stufe in der Tonleiter (für Motive, damit alles in der Tonart bleibt)
 // Gefahr kippt die Harmonie: VI wird zu ♭II (Halbton über dem Grundton), V bekommt die kleine None
 hafen:{n:'Hafen',root:50,amb:'meer',rhy:'ketten', // D3, d-Moll
  prog:[[0,3,7],[-4,0,3],[5,8,12],[7,11,14]], bass:[0,-4,5,7], deg:[0,5,3,4], names:['Dm','B','Gm','A'],
  dark:[[0,3,7],[1,5,8],[5,8,12],[7,11,20]], darkBass:[0,1,5,7], darkDeg:[0,1,3,4], darkNames:['Dm','Es','Gm','A♭9']},
 kapelle:{n:'Kapelle',root:52,amb:'wind',rhy:'glocken', // E3, e-Moll
  prog:[[0,3,7],[-4,0,3],[5,8,12],[7,11,14]], bass:[0,-4,5,7], deg:[0,5,3,4], names:['Em','C','Am','H'],
  dark:[[0,3,7],[1,5,8],[5,8,12],[7,11,20]], darkBass:[0,1,5,7], darkDeg:[0,1,3,4], darkNames:['Em','F','Am','H♭9']}
};
const MINOR=[0,2,3,5,7,8,10],PHRYG=[0,1,3,5,7,8,10];
// Motive: [Schritt im Takt (16tel), Tonleiterstufen über dem Akkordgrundton, Länge in 16teln]
const FOES={
 kultist:   {n:'Kultist',   oct:62, motif:[[0,4,6],[6,5,2],[8,4,8]]},
 tiefling:  {n:'Tiefling',  oct:38, motif:[[0,0,3],[4,0,1],[6,2,2],[8,1,6]]},
 ertrunkener:{n:'Ertrunkener',oct:62,motif:[[2,6,2],[4,5,2],[8,4,4],[12,3,4]]},
 schatten:  {n:'Schatten',  oct:74, motif:[[0,7,4],[6,8,2],[10,7,6]]},
 ruft:      {n:'Das, was ruft',oct:38,motif:[[0,0,8],[8,-1,8]]}
};
const ROLES={
 friedhofswaerter:{n:'Friedhofswärter',k:'Spieluhr'},
 fischer:{n:'Fischer',k:'Ziehharmonika'},
 pfarrerin:{n:'Pfarrerin',k:'Orgel'},
 detektiv:{n:'Detektiv',k:'Gedämpfte Trompete'},
 okkultist:{n:'Okkultist',k:'Glasharfe'},
 kneipenschlaeger:{n:'Kneipenschläger',k:'Verstimmtes Klavier'}
};
const STOFFE={
 keiner:{n:'keiner',lp:16000,wet:.18,drive:0},
 W:{n:'Wasser',lp:1300,wet:.5,drive:0},
 F:{n:'Feuer',lp:9000,wet:.12,drive:2.5},
 G:{n:'Glaube',lp:7000,wet:.62,drive:0,oct:true},
 B:{n:'Blut',lp:5000,wet:.2,drive:.8,heart:1.7},
 V:{n:'Fäulnis',lp:4200,wet:.25,drive:.4,rot:true}
};
// Schwellen der Layer (an bei >=, aus erst unter Schwelle-HYST)
const TH=[0,.15,.4,.62,.88],HYST=.07,TH_DRIVE=.6;
const BASE={menu:0,karte:.22,kampf:.45,boss:.6};

// ---------- Zustand ----------
const S={scene:'menu',biome:'hafen',hp:40,hpMax:40,foes:[],role:'fischer',stoff:'keiner',
 wucht:0,gefahr:0,momentum:0,spike:0,telegraph:false,bpm:80,
 gate:[true,false,false,false,false],drive:false,chord:0,bar:0,slot:null,duel:false,
 chain:0,lastReact:-99,dark:false,nextBiome:null,anschlag:false,pendingAns:[],dropStep:-1,hitStep:-1,victory:false,abgesang:[]};

let ctx=null,NBUF=null,timer=null,running=false,step=0,nextT=0,lastUpd=0;
let dropF,windG,drones=[],dissO,flirrO=[],master,duckG,dropG,shaper,driveG,toneF,dryG,wetG,hall,comp,L=[],voiceBus,flirrG,dissG,seaG;
const mtof=m=>440*Math.pow(2,(m-69)/12);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const spb=()=>60/S.bpm/4; // Sekunden pro 16tel

function getCtx(){
 if(typeof au==='function'){au();if(typeof AC!=='undefined'&&AC)return AC;} // gemeinsam mit sfx.js
 return new(window.AudioContext||window.webkitAudioContext)();
}
function curve(k){const n=1024,c=new Float32Array(n);for(let i=0;i<n;i++){const x=i/(n-1)*2-1;c[i]=k?Math.tanh(x*(1+k))/Math.tanh(1+k):x;}return c;}
function impulse(sec){const r=ctx.sampleRate,len=r*sec,b=ctx.createBuffer(2,len,r);for(let ch=0;ch<2;ch++){const d=b.getChannelData(ch);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}return b;}

function build(){
 ctx=getCtx();
 NBUF=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);{const d=NBUF.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;}
 // Kette: Layer -> dropG -> duckG -> shaper -> toneF -> (dry + hall) -> comp -> master -> Ausgang
 master=ctx.createGain();master.gain.value=.75;
 comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.ratio.value=4;comp.attack.value=.01;comp.release.value=.25;
 dropG=ctx.createGain();duckG=ctx.createGain();
 dropF=ctx.createBiquadFilter();dropF.type='lowpass';dropF.frequency.value=18000;dropF.Q.value=.9; // für das Atemholen vor der Hochreaktion
 shaper=ctx.createWaveShaper();shaper.curve=curve(0);driveG=ctx.createGain(); // gleicht die Lautstärke nach der Verzerrung aus
 toneF=ctx.createBiquadFilter();toneF.type='lowpass';toneF.frequency.value=16000;
 dryG=ctx.createGain();wetG=ctx.createGain();wetG.gain.value=.18;
 hall=ctx.createConvolver();hall.buffer=impulse(2.8);
 dropG.connect(dropF).connect(duckG).connect(shaper).connect(driveG).connect(toneF);
 toneF.connect(dryG).connect(comp);toneF.connect(hall).connect(wetG).connect(comp);
 comp.connect(master).connect(typeof OUT!=='undefined'&&OUT&&OUT.context===ctx?OUT:ctx.destination); // gemeinsamer Ausgang mit Limiter (sfx.js)
 for(let i=0;i<5;i++){const g=ctx.createGain();g.gain.value=i===0?1:0;g.connect(dropG);L.push(g);}
 voiceBus=ctx.createGain();voiceBus.gain.value=0;voiceBus.connect(dropG);
 // Layer 0: Ort-Geräusch (Hafen: Meer, Kapelle: Wind) + Drone auf Grundton und Quinte
 const amb=(type,f,q,v,rate)=>{const src=ctx.createBufferSource();src.buffer=NBUF;src.loop=true;
  const fl=ctx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=ctx.createGain();g.gain.value=0;
  const lf=ctx.createOscillator();lf.frequency.value=rate;const lg=ctx.createGain();lg.gain.value=v*.6;lf.connect(lg).connect(g.gain);
  src.connect(fl).connect(g).connect(L[0]);src.start();lf.start();return g;};
 seaG=amb('lowpass',480,.7,.11,.07);windG=amb('bandpass',900,.8,.09,.11);
 const dF=ctx.createBiquadFilter();dF.type='lowpass';dF.frequency.value=260;const dG=ctx.createGain();dG.gain.value=.05;dF.connect(dG).connect(L[0]);
 drones=[[-12,-6],[-12,7],[-5,3]].map(([iv,det])=>{const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=mtof(50+iv);o.detune.value=det;o.connect(dF);o.start();return [o,iv];});
 // Dissonanz-Drone (kleine Sekunde über dem Grundton) wächst mit der Gefahr
 const eo=ctx.createOscillator();eo.type='sawtooth';eo.frequency.value=mtof(39);dissO=eo;const eF=ctx.createBiquadFilter();eF.type='lowpass';eF.frequency.value=300;
 dissG=ctx.createGain();dissG.gain.value=0;eo.connect(eF).connect(dissG).connect(L[0]);eo.start();
 // Flirren: kleine Sekunde hoch oben mit Tremolo, Stärke folgt der Gefahr
 flirrG=ctx.createGain();flirrG.gain.value=0;const trem=ctx.createGain();trem.gain.value=.5;
 const tl=ctx.createOscillator();tl.frequency.value=7;const tlG=ctx.createGain();tlG.gain.value=.5;tl.connect(tlG).connect(trem.gain);tl.start();
 flirrO=[36,37].map(iv=>{const o=ctx.createOscillator();o.frequency.value=mtof(50+iv);o.connect(flirrG);o.start();return [o,iv];});
 flirrG.connect(trem).connect(L[0]); // hängt am Grund, damit es auch bei wenig Wucht unheimlich wird
}

// ---------- Klangbausteine ----------
function tone(dest,t,f,dur,o={}){
 const os=ctx.createOscillator();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t);
 if(o.glide)os.frequency.exponentialRampToValueAtTime(f*o.glide,t+dur);
 os.detune.value=(o.det||0)+(S.stoff==='V'&&o.rot!==false?(Math.random()*40-20):0);
 if(o.vib){const v=ctx.createOscillator();v.frequency.value=o.vib[0];const vg=ctx.createGain();vg.gain.value=f*o.vib[1];v.connect(vg).connect(os.frequency);v.start(t);v.stop(t+dur+.1);}
 const g=ctx.createGain(),v=o.v??.2,a=o.a??.004;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);
 if(o.pad){g.gain.setValueAtTime(v,t+Math.max(a,dur-(o.r??.3)));g.gain.linearRampToValueAtTime(0,t+dur);}
 else g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(dur,a+.01));
 let n=os;
 if(o.lp){const fl=ctx.createBiquadFilter();fl.type=o.ft||'lowpass';fl.frequency.setValueAtTime(o.lp,t);if(o.lpEnd)fl.frequency.exponentialRampToValueAtTime(o.lpEnd,t+dur);fl.Q.value=o.q??.7;os.connect(fl);n=fl;}
 n.connect(g).connect(dest);os.start(t);os.stop(t+dur+.05);
}
function noise(dest,t,dur,o={}){
 const s=ctx.createBufferSource();s.buffer=NBUF;const fl=ctx.createBiquadFilter();fl.type=o.type||'bandpass';
 fl.frequency.setValueAtTime(o.f||1000,t);if(o.fEnd)fl.frequency.exponentialRampToValueAtTime(o.fEnd,t+dur);fl.Q.value=o.q??1;
 const g=ctx.createGain(),v=o.v??.2,a=o.a??.003;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+Math.max(dur,a+.01));
 s.connect(fl).connect(g).connect(dest);s.start(t,Math.random()*1.5);s.stop(t+dur+.05);
}
const heart=(t,v)=>{const k=(STOFFE[S.stoff].heart||1);tone(L[1],t,88,.32,{glide:.45,v:v*k});noise(L[1],t,.03,{f:180,q:.8,v:v*.25*k});};
const bassNote=(t,m,dur)=>{tone(L[1],t,mtof(m),dur,{type:'triangle',v:.13,a:.03,pad:true,r:.35,rot:false});tone(L[1],t,mtof(m),dur,{type:'sawtooth',v:.035,a:.03,pad:true,r:.35,lp:280,rot:false});};
const rattle=(t,v)=>{if(BIOME[S.biome].rhy==='glocken'){tone(L[2],t,2637,.12,{v:v*.35,rot:false});tone(L[2],t,2637*1.5,.07,{v:v*.15,rot:false});noise(L[2],t,.02,{f:7000,q:2,v:v*.3});return;}
 noise(L[2],t,.05,{f:4200,q:1.6,v});noise(L[2],t+.018,.04,{f:5600,q:2,v:v*.6});};
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
  case 'friedhofswaerter':tone(d,t,f,1.3,{v:.07});tone(d,t,f*3,.45,{v:.018});tone(d,t,f*5.4,.2,{v:.008});break;
  case 'fischer':tone(d,t,f,dur,{type:'square',v:.03,a:.04,pad:true,r:.12,lp:1800,vib:[5.5,.004]});tone(d,t,f*1.005,dur,{type:'sawtooth',v:.02,a:.04,pad:true,r:.12,lp:1500});break;
  case 'pfarrerin':[1,2,3,4].forEach((h,i)=>tone(d,t,f*h,dur,{v:[.045,.025,.015,.01][i],a:.06,pad:true,r:.2}));break;
  case 'detektiv':tone(d,t,f,dur,{type:'sawtooth',v:.05,a:.05,pad:true,r:.15,ft:'bandpass',lp:1100,q:2.5,vib:[4.5,.006]});break;
  case 'okkultist':tone(d,t,f,dur*1.6,{v:.06,a:.12,pad:true,r:.6,vib:[3,.003]});tone(d,t,f*2.01,dur*1.6,{type:'triangle',v:.015,a:.15,pad:true,r:.6});break;
  case 'kneipenschlaeger':[-14,12].forEach(det=>tone(d,t,f,.9,{type:'triangle',v:.05,det}));tone(d,t,f*2,.3,{v:.015});break;
 }
}
// Gegnerstimmen
function foeNote(type,t,m,dur,v){
 const f=mtof(m),d=voiceBus;
 switch(type){
  case 'kultist':[-7,7].forEach(det=>{tone(d,t,f,dur,{type:'sawtooth',v:.05*v,a:.18,pad:true,r:.3,det,ft:'bandpass',lp:760,q:5});tone(d,t,f,dur,{type:'sawtooth',v:.03*v,a:.18,pad:true,r:.3,det,ft:'bandpass',lp:1150,q:6});});break;
  case 'tiefling':tone(d,t,f,dur,{type:'sawtooth',v:.11*v,a:.03,pad:true,r:.12,lp:380,lpEnd:900,q:3});tone(d,t,f/2,dur,{v:.08*v,a:.03,pad:true,r:.12});break;
  case 'ertrunkener':tone(d,t,f,dur,{v:.08*v,a:.05,pad:true,r:.2,vib:[9,.03]});tone(d,t,f*.5,dur,{type:'triangle',v:.03*v,a:.05,pad:true,r:.2,vib:[9,.03]});break;
  case 'schatten':noise(d,t,dur,{f,q:28,v:.9*v,a:dur*.4});noise(d,t,dur,{f:f*1.06,q:28,v:.5*v,a:dur*.6});break;
  case 'ruft':tone(d,t,f,dur,{type:'sawtooth',v:.09*v,a:.25,pad:true,r:.5,lp:340,q:1.5});tone(d,t,f/2,dur,{v:.1*v,a:.25,pad:true,r:.5});break;
 }
}
function tutti(t,chord){
 const r=BIOME[S.biome].root;
 tone(L[4],t,mtof(r-24),1.3,{glide:.7,v:.42,rot:false});noise(L[4],t,.9,{f:650,q:.5,v:.18,type:'lowpass'});
 chord.forEach(iv=>tone(L[4],t,mtof(r+12+iv),1.5,{type:'sawtooth',v:.035,lp:2200,lpEnd:900}));
 tone(L[4],t,mtof(r+24+chord[0]),2.2,{v:.06});tone(L[4],t,mtof(r+24+chord[0])*2.76,.8,{v:.012});
}
function bell(t,m,v=.05){tone(dropG,t,mtof(m),1.4,{v,rot:false});tone(dropG,t,mtof(m)*3,.4,{v:v*.25,rot:false});}

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
const combat=()=>S.scene==='kampf'||S.scene==='boss';
function targets(){
 const solo=combat()&&S.foes.length===1;
 let w=BASE[S.scene]+(combat()?S.momentum:S.momentum*.3)+(solo?.18:0); // Duell-Bonus: der letzte Gegner ist ein Höhepunkt
 w=Math.max(clamp(w),S.spike);
 let g=clamp((.75-S.hp/S.hpMax)/.6)+(S.telegraph?.25:0);
 if(!combat())g*=.35;if(S.scene==='menu')g=0;
 return [clamp(w),clamp(g)];
}
function update(){
 const now=ctx.currentTime,dt=Math.min(.2,now-lastUpd);lastUpd=now;
 S.momentum*=Math.exp(-dt/10);
 let [tw,tg]=targets();if(S.solo){tw=S.solo.drive?.7:.5;tg=S.solo.dark?.7:0;}
 const ease=(c,t)=>c+(t-c)*(1-Math.exp(-dt/(t>c?.5:7))); // schnell hoch, langsam runter
 S.wucht=ease(S.wucht,tw);S.gefahr=ease(S.gefahr,tg);
 dissG.gain.setTargetAtTime(S.gefahr*.045,now,.5);
 flirrG.gain.setTargetAtTime(S.gefahr>.55?(S.gefahr-.55)*.03:0,now,.5);
}
function barStart(t,bar){
 S.bar=bar;S.chord=bar%4;
 // Tempo: kleine Spanne (80 bis 88), höchstens 1 BPM pro Takt, damit man es spürt statt hört
 const bt=Math.round(80+8*S.gefahr);S.bpm+=Math.sign(bt-S.bpm);
 S.dark=S.dark?S.gefahr>.42:S.gefahr>.5; // Harmonie kippt nur auf Taktgrenzen, mit Hysterese
 if(S.nextBiome&&S.nextBiome!==S.biome){S.biome=S.nextBiome;retune(t);}
 seaG.gain.setTargetAtTime(BIOME[S.biome].amb==='meer'?(S.scene==='menu'?.08:.11):0,t,1.2);
 windG.gain.setTargetAtTime(BIOME[S.biome].amb==='wind'?(S.scene==='menu'?.06:.09):0,t,1.2);
 S.spike=Math.max(0,S.spike-.25);
 // Layer schalten (mit Hysterese), nur auf Taktgrenzen
 if(S.solo){soloGates(t);}else{
 for(let i=1;i<4;i++){const on=S.gate[i]?S.wucht>=TH[i]-HYST:S.wucht>=TH[i];setGate(i,on,t);}
 // Tutti bleibt etwas Besonderes: nur nach einer Hochreaktion oder im Boss bei voller Wucht
 setGate(4,S.spike>0||(S.scene==='boss'&&S.wucht>=TH[4]),t);
 S.drive=S.drive?S.wucht>=TH_DRIVE-HYST:S.wucht>=TH_DRIVE;
 voiceBus.gain.setTargetAtTime(combat()&&S.foes.length?1:0,t,combat()?.2:.8);
 L[0].gain.setTargetAtTime(S.scene==='menu'?.7:1,t,1);}
 // Stimmen-Plätze: Typen in Auftrittsreihenfolge, höchstens 2, im Wechsel
 const types=[...new Set(S.foes.map(f=>f.type))].slice(0,2);
 S.duel=combat()&&S.foes.length===1;
 S.slot=types.length?types[bar%types.length]:null;
 if(S.victory){S.victory=false;victoryCadence(t);}
}
function retune(t){const r=BIOME[S.biome].root;drones.forEach(([o,iv])=>o.frequency.setTargetAtTime(mtof(r+iv),t,.8));
 dissO.frequency.setTargetAtTime(mtof(r-11),t,.8);flirrO.forEach(([o,iv])=>o.frequency.setTargetAtTime(mtof(r+iv),t,.8));}
// Vorhören einzelner Spuren (Klangliste): nur ein Layer oder nur die Gegnerstimme, festes Tempo
function soloGates(t){const o=S.solo;S.bpm=80;S.dark=!!o.dark;S.drive=!!o.drive;
 for(let i=1;i<5;i++)setGate(i,o.layer===i,t);
 L[0].gain.setTargetAtTime(o.layer===0?1:0,t,.2);voiceBus.gain.setTargetAtTime(o.layer==='voice'?1:0,t,.2);}
function setGate(i,on,t){if(S.gate[i]===on)return;S.gate[i]=on;L[i].gain.setTargetAtTime(on?1:0,t,on?.15:.9);}
function chordNow(){const b=BIOME[S.biome],dark=S.dark;return {c:(dark?b.dark:b.prog)[S.chord],bass:(dark?b.darkBass:b.bass)[S.chord],deg:(dark?b.darkDeg:b.deg)[S.chord],name:(dark?b.darkNames:b.names)[S.chord],scale:dark?PHRYG:MINOR};}
// Tonleiterstufe d über dem Akkord -> Halbtöne über dem Grundton. Auf der V wird die kleine Septime zum Leitton (harmonisch Moll).
function degSemi(ch,d){const a=ch.deg+d,i=((a%7)+7)%7;let st=ch.scale[i]+12*Math.floor(a/7);if(ch.deg===4&&i===6)st+=1;return st;}

function schedule(st,t){
 const s=st%16,bar=Math.floor(st/16),root=BIOME[S.biome].root;
 if(s===0)barStart(t,bar);
 const ch=chordNow(),barLen=spb()*16;
 // Atemholen vor der Hochreaktion: ein Schlag leiser und dumpf mit Sog nach oben, dann alles
 const beat=spb()*4;
 if(st===S.dropStep){dropG.gain.cancelScheduledValues(t);dropG.gain.setTargetAtTime(.45,t,.07);dropF.frequency.cancelScheduledValues(t);dropF.frequency.setValueAtTime(18000,t);dropF.frequency.exponentialRampToValueAtTime(420,t+beat*.9);
  noise(duckG,t,beat,{f:300,fEnd:4000,q:1.8,v:.09,a:beat*.95});}
 if(st===S.hitStep){dropG.gain.cancelScheduledValues(t);dropG.gain.setValueAtTime(.45,t);dropG.gain.linearRampToValueAtTime(1,t+.05);dropF.frequency.cancelScheduledValues(t);dropF.frequency.setValueAtTime(420,t);dropF.frequency.exponentialRampToValueAtTime(18000,t+.2);S.spike=1;S.wucht=1;for(let i=1;i<5;i++){S.gate[i]=false;setGate(i,true,t);}S.drive=true;tutti(t,ch.c);}
 // Layer 1: Herzschlag (lub-dub), bei Wucht doppelt; Bass auf der Eins
 if(s===0)heart(t,.5);if(s===3)heart(t,.3);
 if(S.wucht>.55&&s===8)heart(t,.42);if(S.wucht>.55&&s===11)heart(t,.26);
 if(s===0)bassNote(t,root-12+ch.bass,barLen*.95);
 // Layer 2: Ketten und Pauke, ruhige oder treibende Fassung
 const fill=bar%4===3;
 if(S.drive){if(s%2===1||s===14||s===15)rattle(t,s%4===3?.16:.09);if([0,6,10,14].includes(s))pauke(L[2],t,.3,s===6||s===14);if(fill&&(s===13||s===15))pauke(L[2],t,.22,true);}
 else{if(s===4||s===12)rattle(t,.14);if(s===0||s===10)pauke(L[2],t,.24,s===10);if(fill&&s===14)rattle(t,.1);}
 // Layer 3: Akkordfläche + Melodie in der Klangfarbe der Rolle
 if(s===0)pad(t,ch.c,barLen);
 // 8-taktige Melodie: A, A', B (höher), Schluss auf dem Grundton. Töne sind Akkordtöne (3-5 = eine Oktave höher)
 MEL[bar%8].forEach(([ps,ci,len])=>{if(ps===s){const iv=ch.c[ci%3]+12*Math.floor(ci/3);melNote(t,root+12+iv,len*spb());}});
 // Layer 4: Paukenwirbel in den letzten Schlag und Akzent auf der Eins
 if(S.gate[4]){if(s===0&&st!==S.hitStep)tutti(t,ch.c);if(s>=12)pauke(L[4],t,.1+(s-12)*.06);}
 // Gegnerstimmen: Frage/Antwort, Duell = jeden Takt, oktaviert, lauter
 if(S.slot&&combat()){
  const fo=FOES[S.slot];fo.motif.forEach(([ms,dg,len])=>{if(ms===s){const m=fo.oct+(root-50)+degSemi(ch,dg),d=len*spb();
   foeNote(S.slot,t,m,d,S.duel?1.25:1);if(S.duel)foeNote(S.slot,t,m+12,d,.55);}});
 }
 // Abgesang eines verstorbenen Typs: fallende Figur auf der nächsten Zählzeit
 if(s%4===0&&S.abgesang.length){const type=S.abgesang.shift(),fo=FOES[type];
  [4,3,2,0,-7].forEach((dg,i)=>foeNote(type,t+i*spb()*2,fo.oct+(root-50)+degSemi(ch,dg),spb()*(i===4?8:2),.9));}
 // Antworttöne auf kleine Reaktionen: auf die nächste Achtel, Ketten steigen die Leiter hoch
 if(s%2===0&&S.pendingAns.length){const k=S.pendingAns.shift();bell(t,root+24+ch.c[k%3]+12*Math.floor(k/3),.05);}
 // Kampfauftakt: Schlag mit Akkord auf der nächsten Zählzeit
 if(S.anschlag&&s%4===0){S.anschlag=false;tone(dropG,t,mtof(root-24),1,{glide:.7,v:.35,rot:false});noise(dropG,t,.5,{f:400,q:.6,v:.15,type:'lowpass'});
  ch.c.forEach(iv=>[-8,8].forEach(det=>tone(dropG,t,mtof(root+iv),barLen*.6,{type:'sawtooth',v:.025,det,lp:1800,lpEnd:500,rot:false})));}
 // Angekündigter Angriff: Anschwellen über einen Takt
 if(s===0&&S.telegraph&&!S.telegraphRiser){S.telegraphRiser=true;noise(dropG,t,barLen,{f:250,fEnd:3200,q:2.5,v:.1,a:barLen*.92});}
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
 start(){if(!ctx)build();if(ctx.state==='suspended')ctx.resume();if(running)return;running=true;master.gain.setTargetAtTime(.75,ctx.currentTime,.3);nextT=ctx.currentTime+.08;lastUpd=ctx.currentTime;timer=setInterval(tick,25);},
 // Stop blendet nur aus: der AudioContext wird mit sfx.js geteilt und bleibt an
 stop(){if(!running)return;running=false;clearInterval(timer);master.gain.setTargetAtTime(0,ctx.currentTime,.3);},
 get running(){return running;},
 scene(s){if(!(s in BASE))return;if(!combat()&&(s==='kampf'||s==='boss')){S.momentum=0;S.anschlag=true;}S.scene=s;if(!(s==='kampf'||s==='boss'))S.foes=[];},
 hp(v,max){S.hp=clamp(v,0,max||S.hpMax);if(max)S.hpMax=max;},
 foeSpawn(type){if(FOES[type])S.foes.push({type});},
 foeDie(type){const i=S.foes.findIndex(f=>f.type===type);if(i<0)return;S.foes.splice(i,1);S.momentum=Math.min(.35,S.momentum+.04);
  if(!S.foes.some(f=>f.type===type))S.abgesang.push(type);},
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
 victory(){if(!combat())return;S.foes=[];S.abgesang=[];S.victory=true;S.momentum=0;S.spike=0;S.telegraph=false;S.scene='karte';},
 role(r){if(ROLES[r])S.role=r;},
 // Vorhören: {layer:0-4|'voice', biome, dark, drive, role, foe}. Ohne Argument zurück zum normalen Dirigenten.
 solo(o){if(!o){S.solo=null;S.foes=[];S.scene='menu';S.momentum=0;S.spike=0;return;}
  S.solo=o;if(o.biome&&BIOME[o.biome]){S.nextBiome=o.biome;}if(o.role&&ROLES[o.role])S.role=o.role;
  S.hp=S.hpMax;S.telegraph=false;S.momentum=0;S.spike=0;S.pendingAns=[];S.abgesang=[];
  if(o.layer==='voice'&&FOES[o.foe]){S.scene='kampf';S.foes=[{type:o.foe}];}else{S.scene='karte';S.foes=[];}},
 biome(k){if(BIOME[k])S.nextBiome=k;}, // wechselt auf der nächsten Taktgrenze
 // Für tonale SFX: Grundton und aktueller Akkord, damit Effekte in der Tonart klingen
 harmony(){const c=chordNow();return {root:BIOME[S.biome].root,chord:c.c,scale:c.scale};},
 stoff(k){if(!STOFFE[k])return;S.stoff=k;if(!ctx)return;const st=STOFFE[k],n=ctx.currentTime;
  toneF.frequency.setTargetAtTime(st.lp,n,.4);wetG.gain.setTargetAtTime(st.wet,n,.4);shaper.curve=curve(st.drive);driveG.gain.setTargetAtTime(1/(1+st.drive*.45),n,.2);},
 state(){const c=ctx&&running?chordNow():{name:'–'};return {scene:S.scene,wucht:S.wucht,gefahr:S.gefahr,bpm:S.bpm,gate:[...S.gate],drive:S.drive,
  chord:c.name,biome:S.biome,dark:S.dark,slot:S.slot,duel:S.duel,foes:S.foes.map(f=>f.type),hp:S.hp,hpMax:S.hpMax,chain:S.chain,telegraph:S.telegraph,momentum:S.momentum};}
};
})();
