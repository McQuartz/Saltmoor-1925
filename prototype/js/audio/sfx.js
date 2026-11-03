// ===================== AUDIO =====================
// Soundeffekte, prozedural mit WebAudio. Alles läuft über einen gemeinsamen Ausgang (OUT) mit kleinem Hall
// und einem Limiter am Ende, damit Musik + SFX zusammen nie clippen. music.js hängt sich an denselben Ausgang.
// Tonale SFX (Heilen, Reaktion, Hochreaktion, Sieg) fragen die Musik nach Tonart und Akkord, damit sie
// immer passen. Läuft keine Musik, gilt d-Moll.
let AC=null,NB=null,OUT=null,SFXB=null;
function au(){if(AC)return;try{AC=new(window.AudioContext||window.webkitAudioContext)();
 NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 // Ausgang: OUT -> Limiter -> Lautsprecher
 OUT=AC.createGain();const lim=AC.createDynamicsCompressor();lim.threshold.value=-4;lim.knee.value=2;lim.ratio.value=20;lim.attack.value=.001;lim.release.value=.12;
 OUT.connect(lim).connect(AC.destination);
 // SFX-Bus: trocken + etwas Hall
 SFXB=AC.createGain();SFXB.gain.value=.9;const rv=AC.createConvolver(),len=AC.sampleRate*1.4,ib=AC.createBuffer(2,len,AC.sampleRate);
 for(let c=0;c<2;c++){const x=ib.getChannelData(c);for(let i=0;i<len;i++)x[i]=(Math.random()*2-1)*Math.pow(1-i/len,3);}
 rv.buffer=ib;const wet=AC.createGain();wet.gain.value=.16;SFXB.connect(OUT);SFXB.connect(rv).connect(wet).connect(OUT);
}catch(e){}}
// Grundbausteine (werden auch von jumpscare.js benutzt)
function nz(f,dur,v,q=3,o={}){if(!AC)return;const s=AC.createBufferSource();s.buffer=NB;const fl=AC.createBiquadFilter();fl.type=o.type||'bandpass';
 const n=AC.currentTime+(o.delay||0);fl.frequency.setValueAtTime(f,n);if(o.fEnd)fl.frequency.exponentialRampToValueAtTime(o.fEnd,n+dur);fl.Q.value=q;
 const g=AC.createGain();g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+(o.a||.002));g.gain.exponentialRampToValueAtTime(.001,n+Math.max(dur,(o.a||.002)+.01));
 let last=g;if(o.pan){const p=AC.createStereoPanner();p.pan.value=o.pan;g.connect(p);last=p;}
 s.connect(fl).connect(g);last.connect(SFXB);s.start(n,Math.random()*.5);s.stop(n+dur+.02);}
function tn(f,dur,type='triangle',v=.2,sl=0,delay=0,o={}){if(!AC)return;const os=AC.createOscillator();os.type=type;const g=AC.createGain(),n=AC.currentTime+delay;
 os.frequency.setValueAtTime(f,n);if(sl)os.frequency.exponentialRampToValueAtTime(Math.max(20,f*sl),n+dur);if(o.det)os.detune.value=o.det;
 const a=o.a||.003;g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+a);g.gain.exponentialRampToValueAtTime(.001,n+Math.max(dur,a+.01));
 let src=os;if(o.lp){const fl=AC.createBiquadFilter();fl.type=o.ft||'lowpass';fl.frequency.setValueAtTime(o.lp,n);if(o.lpEnd)fl.frequency.exponentialRampToValueAtTime(o.lpEnd,n+dur);fl.Q.value=o.q||.8;os.connect(fl);src=fl;}
 let last=g;if(o.pan){const p=AC.createStereoPanner();p.pan.value=o.pan;g.connect(p);last=p;}
 src.connect(g);last.connect(SFXB);os.start(n);os.stop(n+dur+.02);}
// Weiche Sättigung für Körper und Knirschen (statt harter Verzerrung)
let SAT=null;function sat(){if(SAT)return SAT;SAT=AC.createWaveShaper();const c=new Float32Array(512);for(let i=0;i<512;i++){const x=i/255.5-1;c[i]=Math.tanh(x*1.8)/Math.tanh(1.8);}SAT.curve=c;SAT.connect(SFXB);return SAT;}
// Rauschen mit eigener Hüllkurve und Filterfahrt, optional durch die Sättigung
function nzx(o){if(!AC)return;const n=AC.currentTime+(o.delay||0),s=AC.createBufferSource();s.buffer=NB;
 const fl=AC.createBiquadFilter();fl.type=o.type||'bandpass';fl.frequency.setValueAtTime(o.f,n);if(o.fEnd)fl.frequency.exponentialRampToValueAtTime(o.fEnd,n+o.dur);fl.Q.value=o.q??1;
 const g=AC.createGain();g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(o.v,n+(o.a||.001));g.gain.exponentialRampToValueAtTime(.001,n+o.dur);
 let last=g;if(o.pan){const p=AC.createStereoPanner();p.pan.value=o.pan;g.connect(p);last=p;}
 s.connect(fl).connect(g);last.connect(o.sat?sat():SFXB);s.start(n,Math.random()*.5);s.stop(n+o.dur+.02);}
// Schlagkörper: Sinus mit schneller Tonhöhenfahrt (wie eine Bassdrum), optional gesättigt
function thump(f0,f1,dur,v,delay=0,satur=false){if(!AC)return;const n=AC.currentTime+delay,o=AC.createOscillator(),g=AC.createGain();
 o.frequency.setValueAtTime(f0,n);o.frequency.exponentialRampToValueAtTime(f1,n+dur*.6);
 g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+.002);g.gain.exponentialRampToValueAtTime(.001,n+dur);
 o.connect(g).connect(satur?sat():SFXB);o.start(n);o.stop(n+dur+.02);}
// Metall-Klang: Teiltöne einer Platte, leicht verstimmt, hohe klingen kürzer
function ring(f,v,delay=0,dur=.6){[[1,1],[1.594,.6],[2.136,.45],[2.653,.3],[3.156,.2],[4.06,.12]].forEach(([r,a],i)=>{
 tn(f*r*(1+(Math.random()-.5)*.004),dur/(1+i*.45),'sine',v*a,0,delay,{pan:(i%2?.18:-.18)});});}
const mf=m=>440*Math.pow(2,(m-69)/12);
// Tonart von der Musik (oder d-Moll): {root, chord:[Halbtöne über root]}
function harm(){try{if(typeof Music!=='undefined'&&Music.running)return Music.harmony();}catch(e){}return {root:50,chord:[0,3,7],scale:[0,2,3,5,7,8,10]};}
// Glockiger Zupfton: Grundton + leicht unharmonische Obertöne
function pluck(m,v,delay=0,pan=0){const f=mf(m);tn(f,.7,'triangle',v,0,delay,{lp:f*6,lpEnd:f*1.5,pan});tn(f*2,.35,'sine',v*.35,0,delay,{pan});tn(f*3.01,.18,'sine',v*.12,0,delay,{pan});}
const sfx={
 // Schaden austeilen: kurzer Luftzug, dann Einschlag aus Knack, Körper und Klatschen. Ab k=3 schwerer.
 hit:k=>{const s=Math.min(k||0,6),d=.055,pan=(Math.random()-.5)*.3;
  nzx({f:900,fEnd:3400,q:.9,v:.05+s*.01,a:.04,dur:.08,pan:-pan});
  nzx({f:4500,type:'highpass',q:.7,v:.26,dur:.012,delay:d,pan});
  thump(170+s*8,62,.16,.42,d,true);
  nzx({f:1400,fEnd:600,q:.8,v:.2,dur:.07,delay:d,sat:true,pan});
  if(s>=3){thump(92,40,.3,.3,d);nzx({f:420,type:'lowpass',v:.14,dur:.26,delay:d});}},
 card:()=>{nz(5200,.05,.12,1.2,{fEnd:2500});nz(1800,.04,.05,2,{delay:.02});},
 // Blocken: Holz-Klopfen und dumpfer Schlag, darüber eine kurz nachklingende Metallplatte
 block:()=>{nzx({f:3500,type:'highpass',q:.7,v:.2,dur:.01});nzx({f:520,q:3,v:.3,dur:.07});thump(140,70,.12,.28);
  ring(430,.05,.004,.7);nzx({f:2800,fEnd:1800,q:2,v:.04,dur:.15,delay:.01});},
 // Getroffen werden: schwerer Schlag, Knirschen, dumpfes Nachgrollen, leiser Halbton-Stich in der Tonart
 hurt:()=>{const r=harm().root;nzx({f:3000,type:'highpass',q:.7,v:.22,dur:.015});thump(120,38,.38,.55,0,true);
  nzx({f:900,fEnd:300,q:.9,v:.25,dur:.16,sat:true});nzx({f:220,type:'lowpass',v:.18,dur:.5,a:.01});
  tn(mf(r-12),.35,'sawtooth',.04,.85,0,{lp:700,lpEnd:150});tn(mf(r-11),.35,'sawtooth',.03,.85,0,{lp:700,lpEnd:150});},
 // Heilen: weiche Akkordtöne nach oben, Atemhauch, im Takt der Musik-Tonart
 heal:()=>{const h=harm(),ch=h.chord;[ch[0],ch[1],ch[2],ch[0]+12].forEach((iv,i)=>{const f=mf(h.root+24+iv);
  tn(f,.9,'sine',.09,0,i*.07,{a:.05,pan:(i-1.5)*.15});tn(f*1.004,.9,'sine',.05,0,i*.07,{a:.05});});
  nz(1800,.6,.06,1.5,{fEnd:5200,a:.2});},
 die:()=>{tn(260,.6,'sawtooth',.1,.25,0,{lp:1400,lpEnd:200});nzx({f:500,fEnd:200,q:.8,v:.2,dur:.35,sat:true});nz(200,.5,.3,1);tn(55,.5,'sine',.3,.6);},
 // Reaktion: Akkord-Arpeggio in der Tonart, mit k höher und dichter
 react:k=>{const h=harm(),ch=h.chord,lift=Math.min(k||0,4)*2;
  const notes=[ch[0],ch[1],ch[2],ch[0]+12].map(iv=>h.root+24+iv+(lift>=6?12:0));
  notes.slice(0,3+(k>=2?1:0)).forEach((m,i)=>pluck(m,.11,i*.045,(i-1)*.3));nz(6000,.25,.05,.8,{type:'highpass'});},
 disc:()=>{const h=harm(),ch=h.chord;[0,1,2,3,4,5].forEach(i=>{const iv=ch[i%3]+12*Math.floor(i/3);pluck(h.root+24+iv,.08,i*.08);});nz(3000,.8,.04,.5);},
 // Hochreaktion: Tiefschlag, großer Akkord der sich öffnet, Glockenkranz, Rauschwelle
 hoch:()=>{const h=harm(),ch=h.chord,r=h.root;
  tn(55,1.2,'sine',.55,.5);thump(110,40,.5,.3,0,true);nz(500,1.1,.25,.5,{type:'lowpass',fEnd:4000,a:.02});
  [ch[0],ch[1],ch[2],ch[0]+12,ch[2]+12].forEach((iv,i)=>[-10,10].forEach(det=>tn(mf(r+12+iv),1.3,'sawtooth',.03,0,0,{det,lp:600,lpEnd:4500,a:.02})));
  [0,1,2,3,4].forEach(i=>pluck(r+36+ch[i%3]+12*Math.floor(i/3),.07,.12+i*.06,(i-2)*.25));},
 click:()=>tn(900,.04,'square',.04,0,0,{lp:3000}),
 pick:()=>{tn(600,.05,'square',.05,0,0,{lp:2500});tn(900,.06,'square',.04,0,.04,{lp:3000});},
 bad:()=>{tn(140,.25,'square',.1,.8,0,{lp:800});tn(148,.25,'square',.07,.8,0,{lp:800});},
 forge:()=>{nz(2500,.15,.4,2);tn(150,.4,'square',.12,.5,0,{lp:1200});[0,5,9,12].forEach((k,i)=>tn(440*Math.pow(2,k/12),.3,'triangle',.1,0,.2+i*.08));},
 // Sieg: Dur-Arpeggio auf dem Grundton der Tonart
 win:()=>{const r=harm().root;[0,4,7,12].forEach((iv,i)=>pluck(r+24+iv,.12,i*.1,(i-1.5)*.2));tn(mf(r+12),1.2,'sine',.08,0,.3,{a:.1});}
};
