// Aufnahme-Studio (studio.html): alle Soundeffekte aus MUND_KATALOG (js/audio/mund.js) anhören und neu aufnehmen.
// Ablauf einer Aufnahme: Mikro läuft dauernd mit (Pegel, kurzer Vorlauf im Speicher) -> Start per Schwelle oder Einzählen
// -> Aufnahme etwas länger als das Original -> Einsatz finden, auf Originallänge schneiden, Ein-/Ausblenden, Pegel angleichen
// -> sofort in IndexedDB (und als WAV in den verbundenen Ordner). Die neueste Aufnahme ist die gewählte.
const $=id=>document.getElementById(id);
let K=MUND_KATALOG;const A=Mund.ablage;
const OPT_KEY='saltmoor.studio.v1';
let ST={modus:'effekte',biom:'hafen',vorlage:true,klick:true,mitspielen:true,selM:0,sel:0,geraet:'',kanal:'0',ausloeser:'stimme',schwelle:-36,laenge:'wie',vorher:true,angleich:true,weiter:false};
try{Object.assign(ST,JSON.parse(localStorage.getItem(OPT_KEY)||'{}'));}catch(e){}
const merke=()=>{try{localStorage.setItem(OPT_KEY,JSON.stringify(ST));}catch(e){}};
const de=(n,d=2)=>n.toLocaleString('de-DE',{minimumFractionDigits:d,maximumFractionDigits:d});
const dbV=v=>v>0?20*Math.log10(v):-120;
const status=(t,warn)=>{const s=$('status');s.textContent=t||'';s.classList.toggle('warn',!!warn);};

// ---------- Originale offline rendern (für Länge, Lautstärke und Wellenbild) ----------
// sfx.js arbeitet mit den globalen AC/NB/SFXB/SAT. Für einen Moment zeigen sie auf einen OfflineAudioContext.
const ORIG={}; // key -> {pcm, sr, dauer, spitze}
async function rendere(e){
 const sr=48000,len=sr*5,oc=new OfflineAudioContext(1,len,sr);
 const alt=[AC,NB,SFXB,SAT];
 try{AC=oc;NB=oc.createBuffer(1,sr,sr);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  SFXB=oc.createGain();SFXB.gain.value=.72;SFXB.connect(oc.destination);SAT=null;
  (Mund.original&&Mund.original[e.sfx]||sfx[e.sfx])(e.arg);}
 finally{[AC,NB,SFXB,SAT]=alt;}
 const pcm=(await oc.startRendering()).getChannelData(0);
 let sp=0;for(let i=0;i<pcm.length;i++){const a=Math.abs(pcm[i]);if(a>sp)sp=a;}
 let ende=0;const sw=sp*.003;for(let i=pcm.length-1;i>=0;i--)if(Math.abs(pcm[i])>sw){ende=i;break;}
 const dauer=Math.max(.05,Math.ceil((ende/sr+.04)*20)/20);
 ORIG[e.key]={pcm:pcm.slice(0,Math.ceil(dauer*sr)),sr,dauer,spitze:sp};}

// ---------- Mikro ----------
// Eigener AudioContext fürs Mikro, mit der Abtastrate des Eingangs (kein Umrechnen zwischen Apollo und Wiedergabe).
// Dazu eine Messung, wie viele Samples pro Sekunde wirklich ankommen: weicht das ab, gilt die gemessene Rate.
let mik=null; // {strom, quelle, knoten, cap}
let CAP=null,capRate=0; // Aufnahme-Kontext und die Rate, mit der gespeichert wird
const VORLAUF=.6;  // Sekunden vor dem Einsatz, die beim Start per Schwelle mitgeschnitten werden (Luft zum Schieben)
const NACHLAUF=1.0; // Sekunden nach der Originallänge, die zusätzlich mitlaufen
let vorl=[],vorlN=0; // letzte Blöcke (Mono, nach Kanalwahl)
let aufn=null; // laufende Aufnahme: {key, bloecke, n, ziel, phase:'wartet'|'zaehlt'|'nimmt', ...}
let pegelSpitze=0,clip=false;
let mess={t0:0,n:0,rate:0};
let capFrames=0,capOff=Infinity; // Frames seit Mikro-Start und kleinste (Ankunft − Frame-Zeit) in ms: Frame ↔ performance.now()
const WORKLET=`class Abgriff extends AudioWorkletProcessor{process(i){const x=i[0];if(x&&x.length)this.port.postMessage(x.map(c=>c.slice(0)));return true;}}registerProcessor('abgriff',Abgriff);`;
async function mikroAus(){if(!mik)return;mik.strom.getTracks().forEach(t=>t.stop());try{mik.quelle.disconnect();mik.knoten.disconnect();}catch(e){}
 try{await mik.cap.close();}catch(e){}mik=null;CAP=null;}
async function mikroAn(){
 au();if(AC&&AC.state==='suspended')await AC.resume(); // Wiedergabe-Kontext (sfx.js) im selben Klick wecken
 await mikroAus();
 const c={echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:{ideal:2}};
 if(ST.geraet)c.deviceId={exact:ST.geraet};
 let strom;
 try{strom=await navigator.mediaDevices.getUserMedia({audio:c});}
 catch(e){if(ST.geraet){ST.geraet='';merke();return mikroAn();}status('Mikro nicht freigegeben: '+e.message,true);return;}
 await geraeteListe(strom);
 const tr=strom.getAudioTracks()[0],s=tr.getSettings?tr.getSettings():{};
 let cap;try{cap=s.sampleRate?new AudioContext({sampleRate:s.sampleRate,latencyHint:'interactive'}):new AudioContext({latencyHint:'interactive'});}
 catch(e){cap=new AudioContext({latencyHint:'interactive'});}
 if(cap.state==='suspended')await cap.resume();
 await cap.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET],{type:'application/javascript'})));
 const quelle=cap.createMediaStreamSource(strom),knoten=new AudioWorkletNode(cap,'abgriff',{numberOfInputs:1,numberOfOutputs:1,channelCountMode:'explicit',channelCount:2});
 const stumm=cap.createGain();stumm.gain.value=0;quelle.connect(knoten).connect(stumm).connect(cap.destination);
 knoten.port.onmessage=ev=>block(ev.data);
 CAP=cap;capRate=cap.sampleRate;mess={t0:0,n:0,rate:0};capFrames=0;capOff=Infinity;vorl=[];vorlN=0;
 mik={strom,quelle,knoten,cap};$('mikAn').textContent='Mikro neu verbinden';
 mik.info=`${tr.label||'Eingang'} · ${s.channelCount||'?'} Kanal · Eingang ${s.sampleRate||'?'} Hz · Aufnahme ${cap.sampleRate} Hz · Wiedergabe ${AC?AC.sampleRate:'?'} Hz`;
 status('Mikro an: '+mik.info);$('technik').textContent=mik.info;}
async function geraeteListe(strom){
 const l=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audioinput');
 const akt=strom&&strom.getAudioTracks()[0].getSettings().deviceId;
 const sel=$('geraet');sel.disabled=false;
 sel.innerHTML=l.map(d=>`<option value="${d.deviceId}"${d.deviceId===(ST.geraet||akt)?' selected':''}>${(d.label||'Eingang').replace(/</g,'&lt;')}</option>`).join('');}
function mono(kanaele){const k=ST.kanal;if(kanaele.length<2||k==='0')return kanaele[0];if(k==='1')return kanaele[1];
 const a=kanaele[0],b=kanaele[1],o=new Float32Array(a.length);for(let i=0;i<a.length;i++)o[i]=(a[i]+b[i])*.5;return o;}
// Wie viele Samples pro Sekunde kommen wirklich an? (nach 1 s Einschwingen, gemittelt über die Zeit)
function messe(n){const jetzt=performance.now();if(!mess.t0){mess.t0=jetzt;mess.start=jetzt;return;}
 if(jetzt-mess.start<1000){mess.t0=jetzt;mess.n=0;return;}mess.n+=n;const dt=(jetzt-mess.t0)/1000;
 if(dt>2){mess.rate=mess.n/dt;const ab=Math.abs(mess.rate/capRate-1);
  $('technik').textContent=(mik?mik.info:'')+` · gemessen ${Math.round(mess.rate)} Hz`+(ab>.03?' · ABWEICHUNG, nehme gemessene Rate':'');
  $('technik').classList.toggle('warn',ab>.03);}}
function rateFuerTake(){if(mess.rate&&Math.abs(mess.rate/capRate-1)>.03){const std=[8000,11025,16000,22050,24000,32000,44100,48000,88200,96000,176400,192000];
  return std.reduce((a,b)=>Math.abs(b-mess.rate)<Math.abs(a-mess.rate)?b:a);}return capRate;}
function block(kanaele){
 const x=mono(kanaele);let sp=0;for(let i=0;i<x.length;i++){const a=Math.abs(x[i]);if(a>sp)sp=a;}
 messe(x.length);capFrames+=x.length;{const o=performance.now()-capFrames/capRate*1000;if(o<capOff)capOff=o;}
 if(sp>pegelSpitze)pegelSpitze=sp;if(sp>=.99)clip=true;
 const sr=capRate;
 vorl.push(x);vorlN+=x.length;const max=sr*VORLAUF+x.length;while(vorlN-vorl[0].length>max){vorlN-=vorl.shift().length;}
 if(!aufn)return;
 if(aufn.phase==='wartet'&&dbV(sp)>=ST.schwelle){aufn.phase='nimmt';aufn.bloecke=vorl.slice();aufn.n=vorlN;aufn.los=vorlN;aufn.clip=false;status('● Aufnahme läuft …');knopf();return;}
 if(aufn.phase!=='nimmt'&&aufn.phase!=='zaehlt')return;
 aufn.bloecke.push(x);aufn.n+=x.length;if(sp>=.99)aufn.clip=true;
 if(aufn.musik){if(aufn.ende&&aufn.n>=aufn.ende)musikAufnahmeEnde();return;}
 if(aufn.phase==='zaehlt')return;
 if(dbV(sp)>ST.schwelle-12)aufn.zuletztLaut=aufn.n;
 const ab=aufn.n-(aufn.los||0);
 const fertig=ST.laenge==='wie'?ab>=aufn.ziel*sr:(ab>=8*sr||(aufn.zuletztLaut&&aufn.n-aufn.zuletztLaut>.8*sr));
 if(fertig)aufnahmeEnde();}
// Pegelanzeige (fällt langsam ab)
let pegelAnz=0;
(function zeige(){const v=dbV(pegelSpitze);pegelSpitze=0;pegelAnz=Math.max(v,pegelAnz-1.2);
 const p=Math.max(0,Math.min(1,(pegelAnz+60)/60));$('pegel').style.width=(p*100)+'%';$('pegelDb').textContent=mik?(clip?'ÜBERSTEUERT':pegelAnz<=-60?'–∞ dB':de(pegelAnz,0)+' dB'):'– dB';
 $('pegelDb').classList.toggle('warn',clip);
 requestAnimationFrame(zeige);})();
setInterval(()=>{clip=false;},2500);
function schwelleStrich(){$('schwelleStrich').style.left=((ST.schwelle+60)/60*100)+'%';$('schwelleWert').textContent=ST.schwelle+' dB';}

// ---------- Aufnahme ----------
// Es wird immer mehr aufgenommen als nötig: davor (Vorlauf bzw. das ganze Einzählen) und danach (Nachlauf).
// Gespeichert wird alles; „start“ sagt, wo der benutzte Ausschnitt beginnt, „laenge“, wie lang er ist. Verschieben ändert nur „start“.
const warte=ms=>new Promise(r=>setTimeout(r,ms));
async function aufnahme(){
 if(aufn){aufn.phase==='nimmt'&&!aufn.musik?aufnahmeEnde():abbruch();return;}
 if(!mik){await mikroAn();if(!mik)return;}
 const e=K[ST.sel],o=ORIG[e.key];if(!o)return;
 if(e.musik)return musikAufnahme(e);
 const zug={key:e.key,phase:'vorher',bloecke:[],n:0,ziel:o.dauer+NACHLAUF,zuletztLaut:0,clip:false};aufn=zug;knopf();
 if(ST.vorher){status('▶ Original …');spieleOrig();await warte(o.dauer*1000+350);if(aufn!==zug)return;}
 if(ST.ausloeser==='zaehlen'){zug.phase='zaehlt';zug.bloecke=[];zug.n=0;knopf(); // Einzählen läuft schon mit (Luft davor)
  for(const z of ['3','2','1']){if(aufn!==zug)return;status(z+' …');tn(z==='1'?1320:880,.05,'square',.05,0,0,{lp:3000});await warte(600);}
  if(aufn!==zug)return;zug.los=zug.n;zug.phase='nimmt';status('● Aufnahme läuft …');}
 else{zug.phase='wartet';status('● bereit: mach den Sound (Leertaste bricht ab)');}
 knopf();}
function abbruch(){if(aufn&&aufn.musik)musikStopp();aufn=null;knopf();status('abgebrochen');}
async function aufnahmeEnde(){
 const z=aufn;aufn=null;knopf();if(!z||!z.n)return;
 const sr=rateFuerTake(),roh=new Float32Array(z.n);let p=0;z.bloecke.forEach(b=>{roh.set(b,p);p+=b.length;});
 const o=ORIG[z.key],r=bearbeite(roh,sr,o);
 if(!r){status('Nichts gehört. Gain am Apollo höher oder Schwelle tiefer.',true);return;}
 const t={key:z.key,sr,pcm:r.pcm,start:r.start,laenge:r.laenge,dauer:r.laenge,zeit:Date.now(),pegel:0};
 t.id=await A.neuerTake(t);
 await aufDiePlatte(t,true);
 status(`✓ gespeichert (${de(t.laenge)} s)${ordner?' · '+dateiName(t)+' im Ordner':''}${z.clip?' · ACHTUNG: übersteuert, Gain am Apollo runter':''}`,z.clip);
 await lade();zeichne();
 if(ST.weiter&&ST.sel<K.length-1){waehle(ST.sel+1);}else{Mund.spiele(t);}}
// Gleichanteil weg, Einsatz suchen (= Vorschlag für „start“), Länge festlegen, Pegel angleichen. Geschnitten wird erst beim Abspielen/Speichern.
function bearbeite(x,sr,o){
 let m=0;for(let i=0;i<x.length;i++)m+=x[i];m/=x.length||1;for(let i=0;i<x.length;i++)x[i]-=m;
 let sp=0;for(let i=0;i<x.length;i++){const a=Math.abs(x[i]);if(a>sp)sp=a;}
 if(sp<1e-4)return null;
 const ein=einsatz(x,sp),a=Math.max(0,ein-Math.round(.008*sr));
 let laenge;
 if(ST.laenge==='wie')laenge=o.dauer;
 else{let e=a;for(let i=x.length-1;i>a;i--)if(Math.abs(x[i])>sp*.02){e=Math.min(x.length,i+Math.round(.06*sr));break;}laenge=Math.max(.05,(e-a)/sr);}
 // Angleichen an der Spitze im benutzten Ausschnitt
 let s2=0;const b=Math.min(x.length,a+Math.round(laenge*sr));for(let i=a;i<b;i++){const v=Math.abs(x[i]);if(v>s2)s2=v;}
 const ziel=ST.angleich?Math.min(.95,Math.max(.2,o.spitze)):.89;const g=Math.min(100,ziel/(s2||sp));
 for(let i=0;i<x.length;i++)x[i]*=g;
 return {pcm:x,start:a/sr,laenge};}
function einsatz(x,sp){for(let i=0;i<x.length;i++)if(Math.abs(x[i])>sp*.08)return i;return 0;}

// ---------- Abspielen ----------
let TAKES={},WAHL={}; // key -> [takes], key -> take-id
function gewaehlt(key){const id=WAHL[key];return (TAKES[key]||[]).find(t=>t.id===id)||null;}
function spieleOrig(){if(K[ST.sel].musik)return vorlage();au();if(AC&&AC.state==='suspended')AC.resume();const e=K[ST.sel];(Mund.original&&Mund.original[e.sfx]||sfx[e.sfx])(e.arg);}
function spieleTake(){const t=gewaehlt(K[ST.sel].key);if(!t){status('Noch keine Aufnahme.');return;}if(t.key.startsWith('musik:'))return musikDeine(t);Mund.spiele(t);}
function zusammen(){if(K[ST.sel].musik)return musikZusammen();spieleOrig();spieleTake();}
async function ab(){if(K[ST.sel].musik)return musikZusammen();spieleOrig();await warte(ORIG[K[ST.sel].key].dauer*1000+300);spieleTake();}


// ---------- Musik ----------
// Pro Biom die Loops aus data/audio.json (Layer 0–4 mit Varianten), je 8 Takte bei 80 BPM.
// Aufnehmen: die prozedurale Musik spielt den Layer als Vorlage (Music.solo), dazu Klick und deine schon
// aufgenommenen Spuren. Ein Takt wird eingezählt, dann laufen 8 Takte plus Luft. Takt 1 wird über die Uhrzeit
// von Wiedergabe und Mikro gefunden; was danach noch nicht sitzt, schiebst du in der Welle aufs Raster.
let AUDIO=null,vorlageAn=false,deineAn=false,musikLoops=[],SO=null;
const TAKT_S=4*60/Mund.MUSIK_BPM;
function studioOut(){au();if(!SO){SO=AC.createGain();SO.gain.value=.9;SO.connect(OUT);}return SO;}
function musikKatalog(biom){const b=(AUDIO.biome||[]).find(x=>x.id===biom)||{n:biom},L=[];
 AUDIO.proBiom.filter(t=>t.art==='Loop'&&t.probe&&t.probe.layer!=null).forEach(t=>t.var.forEach(v=>{
  const key=Mund.musikKey(biom,t.id,v);ORIG[key]={pcm:null,dauer:Mund.MUSIK_TAKTE*TAKT_S,spitze:.5};
  L.push({key,musik:true,n:t.n+(t.var.length>1?' · '+v:''),wo:(t.vv&&t.vv[v])||t.vibe,gruppe:`Musik · ${b.n}${b.key?' · '+b.key:''}`,layer:t.probe.layer,loop:t.id,var:v});}));
 return L;}
const soloFuer=e=>({layer:e.layer,biome:ST.biom,dark:e.var==='gekippt',drive:e.var==='treibend'||e.var==='dicht'});
const kontextFuer=e=>({dark:e.var==='gekippt',drive:e.var==='treibend',wucht:e.var==='dicht'?1:0});
function naechsterTakt(pred){return new Promise(res=>{const ab=Music.mund.takt(z=>{if(pred&&!pred(z))return;ab();res(z);});});}
function vorlageStart(e,solo){au();if(AC.state==='suspended')AC.resume();Music.mund.tempo(Mund.MUSIK_BPM);Music.start();Music.solo(solo||soloFuer(e));vorlageAn=true;}
function musikStopp(){const n=AC?AC.currentTime:0;musikLoops.forEach(l=>Mund.loopStoppen(l,n));musikLoops=[];
 if(vorlageAn&&typeof Music!=='undefined'){Music.solo(null);Music.stop();}vorlageAn=false;deineAn=false;if($('bOrig'))knopf();}
function vorlage(){const e=K[ST.sel];if(vorlageAn){musikStopp();return;}musikStopp();vorlageStart(e);status('▶ Vorlage: '+e.n+' (Wechsel auf der nächsten Taktgrenze)');knopf();}
// Eigene Spuren eines Bioms passend zu einem Kontext (gekippt, treibend …), ohne den Layer „ohne“
function eigeneSpuren(kontext,ohne){const out=[];Mund.LAYER.forEach(L=>{if(L.k===ohne)return;
 for(const v of L.wahl(kontext)){const t=gewaehlt(Mund.musikKey(ST.biom,L.id,v));if(t){out.push(t);break;}}});return out;}
function musikDeine(t){if(deineAn){musikStopp();return;}musikStopp();const n=AC?AC.currentTime:0;au();
 musikLoops.push(Mund.loopStarten(t,AC.currentTime+.05,t.phase||0,TAKT_S,studioOut()));deineAn=true;knopf();status('▶ deine Spur (Schleife)');}
async function musikZusammen(){const e=K[ST.sel],t=gewaehlt(e.key);if(!t){status('Noch keine Aufnahme.');return;}
 if(vorlageAn||deineAn){musikStopp();return;}vorlageStart(e);deineAn=true;knopf();status('▶ Vorlage und deine Spur, ab dem nächsten Takt');
 const z=await naechsterTakt(z=>z.biome===ST.biom);if(!deineAn)return;musikLoops.push(Mund.loopStarten(t,z.t,z.bar,z.barLen,studioOut()));}
function mix(){if(deineAn||vorlageAn){musikStopp();return;}const sp=eigeneSpuren({dark:false,drive:false,wucht:0},-1);
 if(!sp.length){status('Für dieses Biom ist noch nichts aufgenommen.');return;}au();const t0=AC.currentTime+.1;
 sp.forEach(t=>musikLoops.push(Mund.loopStarten(t,t0,0,TAKT_S,studioOut())));deineAn=true;knopf();status(`▶ deine Musik: ${sp.length} Spuren (normal/ruhig)`);}
async function musikAufnahme(e){
 musikStopp();const zug={musik:true,key:e.key,phase:'zaehlt',bloecke:[],n:0,clip:false,f0:capFrames};aufn=zug;knopf();
 vorlageStart(e,ST.vorlage?soloFuer(e):{layer:'keins',biome:ST.biom});status('warte auf den nächsten Takt …');
 const z=await naechsterTakt(z=>z.biome===ST.biom);if(aufn!==zug)return;
 const beat=z.barLen/4,t0=z.t+z.barLen,bar0=z.bar+1,jetzt=AC.currentTime;
 // Einzählen (4 Schläge) und auf Wunsch Klick durch die ganze Aufnahme
 const schlaege=4+(ST.klick?Mund.MUSIK_TAKTE*4:0);
 for(let i=0;i<schlaege;i++){const tt=z.t+i*beat;if(tt<jetzt)continue;tn(i%4===0?1320:880,.04,'square',i<4?.06:.035,0,tt-jetzt,{lp:3000});}
 if(ST.mitspielen)eigeneSpuren(kontextFuer(e),e.layer).forEach(t=>musikLoops.push(Mund.loopStarten(t,t0,bar0,z.barLen,studioOut())));
 // Takt 1 (AC-Zeit t0) → Frame im Mikro-Strom, über performance.now()
 const ts=AC.getOutputTimestamp?AC.getOutputTimestamp():null;
 const perf0=ts&&ts.performanceTime?ts.performanceTime+(t0-ts.contextTime)*1000:performance.now()+(t0-AC.currentTime+(AC.outputLatency||AC.baseLatency||0))*1000;
 zug.idx0=Math.round((perf0-capOff)*capRate/1000)-zug.f0;zug.laenge=Mund.MUSIK_TAKTE*z.barLen;zug.takt=bar0%Mund.MUSIK_TAKTE;
 zug.ende=zug.idx0+Math.round((zug.laenge+NACHLAUF)*capRate);zug.phase='nimmt';knopf();
 const tick=()=>{if(aufn!==zug)return;const d=AC.currentTime-t0;status(d<0?`Einzählen … ${Math.min(4,Math.floor((d+z.barLen)/beat)+1)}`:`● Takt ${Math.min(Mund.MUSIK_TAKTE,Math.floor(d/z.barLen)+1)} von ${Mund.MUSIK_TAKTE}`);setTimeout(tick,100);};tick();}
async function musikAufnahmeEnde(){
 const z=aufn;aufn=null;musikStopp();knopf();if(!z||!z.n)return;
 const sr=capRate,roh=new Float32Array(z.n);let p=0;z.bloecke.forEach(b=>{roh.set(b,p);p+=b.length;});
 let m=0;for(let i=0;i<roh.length;i++)m+=roh[i];m/=roh.length||1;let sp=0;for(let i=0;i<roh.length;i++){roh[i]-=m;const a=Math.abs(roh[i]);if(a>sp)sp=a;}
 if(sp<1e-4){status('Nichts gehört. Gain am Apollo höher.',true);return;}
 if(ST.angleich){const g=Math.min(100,.5/sp);for(let i=0;i<roh.length;i++)roh[i]*=g;} // Luft für fünf Spuren übereinander
 const t={key:z.key,sr,pcm:roh,start:Math.max(0,z.idx0)/sr,laenge:z.laenge,dauer:z.laenge,phase:z.takt,zeit:Date.now(),pegel:0};
 t.id=await A.neuerTake(t);await aufDiePlatte(t,true);await lade();zeichne();
 status(`✓ gespeichert (${Mund.MUSIK_TAKTE} Takte)${z.clip?' · ACHTUNG: übersteuert':''} · mit „Zusammen“ prüfen, ob es auf dem Takt sitzt`,z.clip);}
function setzeModus(m){if(aufn)abbruch();musikStopp();ST.modus=m;
 if(m==='musik'){K=musikKatalog(ST.biom);ST.sel=Math.min(ST.selM||0,K.length-1);}else{K=effKatalog();ST.sel=Math.min(ST.selE||0,K.length-1);}
 merke();zeichne();}

// ---------- Ordner und Dateien ----------
let ordner=null;
const datei=k=>k.replace(/[:/]/g,'_'); // Doppelpunkte und Schrägstriche (Profile p2/…) gehen nicht in Dateinamen
const dateiName=t=>`${datei(t.key)}.wav`;
function wav(pcm,sr){const n=pcm.length,b=new ArrayBuffer(44+n*2),v=new DataView(b);let o=0;
 const s=t=>{for(let i=0;i<t.length;i++)v.setUint8(o++,t.charCodeAt(i));},u32=x=>{v.setUint32(o,x,true);o+=4;},u16=x=>{v.setUint16(o,x,true);o+=2;};
 s('RIFF');u32(36+n*2);s('WAVE');s('fmt ');u32(16);u16(1);u16(1);u32(sr);u32(sr*2);u16(2);u16(16);s('data');u32(n*2);
 for(let i=0;i<n;i++){const x=Math.max(-1,Math.min(1,pcm[i]));v.setInt16(o,x<0?x*32768:x*32767,true);o+=2;}return new Uint8Array(b);}
async function schreibe(dir,name,bytes){const f=await dir.getFileHandle(name,{create:true}),w=await f.createWritable();await w.write(bytes);await w.close();}
// Gewählte Aufnahme als <key>.wav, jede Aufnahme zusätzlich unter takes/<key>_<id>.wav
async function aufDiePlatte(t,neu){if(!ordner)return;
 try{const tk=await ordner.getDirectoryHandle('takes',{create:true});const bytes=wav(t.pcm,t.sr);
  if(neu)await schreibe(tk,`${datei(t.key)}_${t.id}.wav`,bytes);await schreibe(ordner,dateiName(t),applyPegel(t));}
 catch(e){status('Ordner: '+e.message,true);}}
function applyPegel(t){return wav(Mund.ausschnitt(t),t.sr);} // benutzter Ausschnitt mit Pegel (takes\ enthält die ganze Aufnahme mit Luft)
async function ordnerVerbinden(){
 if(!window.showDirectoryPicker){status('Dieser Browser kann keine Ordner. Chrome oder Edge nehmen, sonst ZIP.',true);return;}
 try{const alt=await A.meta('ordner');
  if(alt&&(await alt.requestPermission({mode:'readwrite'}))==='granted'&&!ordnerVerbinden.neu){ordner=alt;}
  else{ordner=await showDirectoryPicker({id:'saltmoor-mund',mode:'readwrite',startIn:'music'});await A.setMeta('ordner',ordner);}
  ordnerVerbinden.neu=true;ordnerAnz();
  for(const k in WAHL){const t=gewaehlt(k);if(t)await schreibe(ordner,dateiName(t),applyPegel(t));}
  status('Ordner verbunden, gewählte Aufnahmen geschrieben.');}
 catch(e){if(e.name!=='AbortError')status('Ordner: '+e.message,true);}}
async function ordnerPruefen(){try{const h=await A.meta('ordner');if(!h)return;
  if((await h.queryPermission({mode:'readwrite'}))==='granted'){ordner=h;ordnerVerbinden.neu=true;}
  else{$('ordner').textContent='Ordner „'+h.name+'“ wieder verbinden';}}catch(e){}ordnerAnz();}
function ordnerAnz(){if(ordner){$('ordner').textContent='anderen Ordner wählen';$('ordnerName').textContent='Speichert auch in: '+ordner.name+'\\ (gewählte als <name>.wav, alle unter takes\\)';}}
// ZIP ohne Bibliothek (nur speichern, nicht packen)
function zip(dateien){const crcT=zip.t||(zip.t=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;return c>>>0;}));
 const crc=b=>{let c=~0;for(let i=0;i<b.length;i++)c=crcT[(c^b[i])&255]^(c>>>8);return ~c>>>0;};
 const teile=[],zentral=[];let off=0;const enc=new TextEncoder();
 dateien.forEach(({name,bytes})=>{const nb=enc.encode(name),c=crc(bytes),h=new DataView(new ArrayBuffer(30));
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint32(14,c,true);h.setUint32(18,bytes.length,true);h.setUint32(22,bytes.length,true);h.setUint16(26,nb.length,true);
  teile.push(new Uint8Array(h.buffer),nb,bytes);
  const z=new DataView(new ArrayBuffer(46));z.setUint32(0,0x02014b50,true);z.setUint16(4,20,true);z.setUint16(6,20,true);z.setUint32(16,c,true);z.setUint32(20,bytes.length,true);z.setUint32(24,bytes.length,true);z.setUint16(28,nb.length,true);z.setUint32(42,off,true);
  zentral.push(new Uint8Array(z.buffer),nb);off+=30+nb.length+bytes.length;});
 const zl=zentral.reduce((s,b)=>s+b.length,0),e=new DataView(new ArrayBuffer(22));
 e.setUint32(0,0x06054b50,true);e.setUint16(8,dateien.length,true);e.setUint16(10,dateien.length,true);e.setUint32(12,zl,true);e.setUint32(16,off,true);
 return new Blob([...teile,...zentral,new Uint8Array(e.buffer)],{type:'application/zip'});}
function zipLaden(){const d=[];K.forEach(e=>{const t=gewaehlt(e.key);if(t)d.push({name:dateiName(t),bytes:applyPegel(t)});});
 if(!d.length){status('Noch nichts aufgenommen.');return;}
 const a=document.createElement('a');a.href=URL.createObjectURL(zip(d));a.download='saltmoor-mund-sounds.zip';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000);}

// ---------- Anzeige ----------
async function lade(){const alle=await A.alleTakes();TAKES={};alle.forEach(t=>(TAKES[t.key]=TAKES[t.key]||[]).push(t));
 for(const k in TAKES)TAKES[k].sort((a,b)=>b.zeit-a.zeit);WAHL=await A.wahl();}
// Wellenbild. lagen: [{pcm, sr, ab (Sekunde in pcm, die bei 0 liegt), farbe, fenster (Länge des benutzten Teils, sonst alles hell)}]
// Zeitachse von -vor bis bis (Sekunden). Strich = Ende des Originals.
function welle(cv,lagen,bis,strich,vor=0,raster=0){const x=cv.getContext('2d'),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
 const span=bis+vor,px2s=p=>p/W*span-vor,s2px=s=>(s+vor)/span*W;
 x.fillStyle='#1a2120';x.fillRect(0,H/2,W,1);
 if(vor){x.fillStyle='#2a3330';x.fillRect(s2px(0),0,1,H);}
 lagen=lagen.filter(l=>l&&l.pcm);let top=1e-4;lagen.forEach(({pcm,sr,ab=0,fenster})=>{const a=Math.max(0,Math.round(ab*sr)),b=fenster?Math.min(pcm.length,a+Math.round(fenster*sr)):pcm.length;
  for(let i=a;i<b;i++){const v=Math.abs(pcm[i]);if(v>top)top=v;}}); // auf die lauteste Stelle der benutzten Teile skaliert
 lagen.forEach(({pcm,sr,ab=0,farbe,dunkel,fenster})=>{if(!pcm)return;const n=pcm.length;
  for(let px=0;px<W;px++){const t0=px2s(px)+ab,t1=px2s(px+1)+ab;let a=Math.floor(t0*sr),b=Math.floor(t1*sr);if(b<=0||a>=n)continue;a=Math.max(0,a);b=Math.min(n,Math.max(a+1,b));
   let mx=0;for(let i=a;i<b;i++){const v=Math.abs(pcm[i]);if(v>mx)mx=v;}const h=Math.max(1,Math.min(1,mx/top)*H*.46);
   const drin=!fenster||(px2s(px)>=0&&px2s(px)<=fenster);x.fillStyle=drin?farbe:(dunkel||farbe);x.fillRect(px,H/2-h,1,h*2);}});
 if(raster){x.fillStyle='rgba(216,196,147,.16)';for(let b=0;b*raster<=bis;b++){const X=s2px(b*raster);x.fillRect(X,0,b%4?1:2,b%4?H*.12:H);}}
 if(strich){x.fillStyle='#e8c547';x.fillRect(Math.min(W-2,s2px(strich)),0,2,H);}}
function liste(){let h='',gr='';
 K.forEach((e,i)=>{if(e.gruppe!==gr){gr=e.gruppe;h+=`<div class="gr">${gr}</div>`;}const n=(TAKES[e.key]||[]).length;
  h+=`<div class="zeile${i===ST.sel?' sel':''}" data-i="${i}"><span class="${n?'ok':'nein'}">${n?'✓':'○'}</span><div>${e.n}<small>${e.wo}</small></div><canvas width="240" height="52" data-w="${i}"></canvas><span class="len">${ORIG[e.key]?de(ORIG[e.key].dauer)+' s':''}</span></div>`;});
 $('liste').innerHTML=h;
 K.forEach((e,i)=>{const cv=document.querySelector(`canvas[data-w="${i}"]`),o=ORIG[e.key],t=gewaehlt(e.key);if(!o||!cv)return;
  const f=t&&Mund.fenster(t),d=Math.max(o.dauer,f?f.len:0);welle(cv,[{pcm:o.pcm,sr:o.sr,farbe:'rgba(232,197,71,.55)'},t&&{pcm:t.pcm,sr:t.sr,ab:f.st,fenster:f.len,farbe:'rgba(122,255,200,.65)',dunkel:'rgba(0,0,0,0)'}].filter(Boolean),d);});
 const fertig=K.filter(e=>(TAKES[e.key]||[]).length).length;$('fort').textContent=`${fertig} von ${K.length} aufgenommen`;}
function detail(){const e=K[ST.sel],o=ORIG[e.key],t=gewaehlt(e.key);
 $('dName').textContent=e.n;$('dWo').textContent=e.wo+(e.musik?` · ${Mund.MUSIK_TAKTE} Takte, ${Mund.MUSIK_BPM} BPM, ${de(o.dauer,0)} s`:(o?` · Original ${de(o.dauer)} s`:''));
 grossWelle();
 $('tPegel').disabled=!t;$('tPegel').value=t?t.pegel||0:0;$('tPegelWert').textContent=(t?t.pegel||0:0)+' dB';
 const l=TAKES[e.key]||[];
 $('takes').innerHTML=l.length?l.map((x,i)=>`<div class="take${x.id===WAHL[e.key]?' aktiv':''}"><span>${x.id===WAHL[e.key]?'★':'·'}</span><span>Aufnahme ${l.length-i} · ${de(Mund.fenster(x).len)} s · ${new Date(x.zeit).toLocaleTimeString('de-DE')}</span>
   <button class="sm" data-play="${x.id}">▶</button><button class="sm" data-wahl="${x.id}"${x.id===WAHL[e.key]?' disabled':''}>wählen</button><button class="sm" data-weg="${x.id}">löschen</button></div>`).join('')
  :'<div class="hinweis">Noch keine. <kbd>Leertaste</kbd> drücken.</div>';
 knopf();}
// Große Welle: 0,5 s Luft links und rechts, damit man die Aufnahme sieht, die außerhalb des benutzten Teils liegt
const LUFT=.5;
function grossWelle(){const e=K[ST.sel],o=ORIG[e.key],t=gewaehlt(e.key);if(!o)return;const f=t&&Mund.fenster(t);
 if(e.musik){welle($('welle'),[t&&{pcm:t.pcm,sr:t.sr,ab:f.st,fenster:f.len,farbe:'rgba(122,255,200,.75)',dunkel:'rgba(122,255,200,.18)'}],o.dauer+LUFT,o.dauer,LUFT,60/Mund.MUSIK_BPM);
  $('versatz').textContent=t?`Takt 1 bei ${de(f.st,3)} s der Aufnahme`:'';return;}
 welle($('welle'),[{pcm:o.pcm,sr:o.sr,farbe:'rgba(232,197,71,.5)'},t&&{pcm:t.pcm,sr:t.sr,ab:f.st,fenster:f.len,farbe:'rgba(122,255,200,.75)',dunkel:'rgba(122,255,200,.18)'}].filter(Boolean),Math.max(o.dauer,f?f.len:0)+LUFT,o.dauer,LUFT);
 $('versatz').textContent=t?`Einsatz bei ${de(f.st,3)} s der Aufnahme`:'';}
// Verschieben: ändert nur, wo der benutzte Ausschnitt in der Aufnahme beginnt (größer = deine Spur kommt früher, wandert nach links)
let schiebZeit=null;
function schiebe(ds,absolut){const t=gewaehlt(K[ST.sel].key);if(!t)return;const n=t.pcm.length/t.sr;
 t.start=Math.max(0,Math.min(n-.02,absolut!=null?absolut:(t.start||0)+ds));grossWelle();liste();
 clearTimeout(schiebZeit);schiebZeit=setTimeout(async()=>{await A.aendere(t);await aufDiePlatte(t,false);},350);}
function autoEinsatz(){const t=gewaehlt(K[ST.sel].key);if(!t)return;let sp=0;for(const v of t.pcm){const a=Math.abs(v);if(a>sp)sp=a;}
 schiebe(0,Math.max(0,einsatz(t.pcm,sp)/t.sr-.008));}
function knopf(){const mu=!!K[ST.sel].musik;$('bOrig').textContent=mu?(vorlageAn?'■ Vorlage':'▶ Vorlage'):'▶ Original';$('bTake').textContent=mu&&deineAn?'■ Deine':'▶ Deine';
 document.querySelectorAll('.nurMusik').forEach(x=>x.hidden=ST.modus!=='musik');document.querySelectorAll('.nurEffekte').forEach(x=>x.hidden=ST.modus==='musik');
 $('mEff').classList.toggle('on',ST.modus!=='musik');$('mMus').classList.toggle('on',ST.modus==='musik');
 const b=$('bRec');b.classList.toggle('an',!!aufn);
 b.textContent=!aufn?'● Aufnehmen':aufn.phase==='nimmt'?'■ Stopp':'✕ Abbrechen';$('bTake').disabled=!gewaehlt(K[ST.sel].key);}
function zeichne(){liste();detail();}
function waehle(i){if(aufn)abbruch();musikStopp();ST.sel=Math.max(0,Math.min(K.length-1,i));if(ST.modus==='musik')ST.selM=ST.sel;else ST.selE=ST.sel;merke();zeichne();
 const z=document.querySelector('.zeile.sel');if(z)z.scrollIntoView({block:'nearest'});}

// ---------- Bedienung ----------
$('liste').addEventListener('click',ev=>{const z=ev.target.closest('.zeile');if(z)waehle(+z.dataset.i);});
$('takes').addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;const key=K[ST.sel].key,l=TAKES[key]||[];
 if(b.dataset.play){const t=l.find(t=>t.id===+b.dataset.play);if(key.startsWith('musik:'))musikDeine(t);else Mund.spiele(t);}
 if(b.dataset.wahl){await A.waehle(key,+b.dataset.wahl);await lade();await aufDiePlatte(gewaehlt(key),false);zeichne();}
 if(b.dataset.weg){if(!confirm('Diese Aufnahme löschen?'))return;const id=+b.dataset.weg;await A.loesche(id);
  if(ordner){try{(await ordner.getDirectoryHandle('takes')).removeEntry(`${datei(key)}_${id}.wav`);}catch(e){}}
  await lade();const t=gewaehlt(key);if(ordner){try{t?await aufDiePlatte(t,false):await ordner.removeEntry(`${datei(key)}.wav`);}catch(e){}}zeichne();}});
$('bOrig').onclick=spieleOrig;$('bRec').onclick=aufnahme;$('bTake').onclick=spieleTake;$('bAB').onclick=ab;$('bZus').onclick=zusammen;$('bAuto').onclick=autoEinsatz;
document.querySelectorAll('[data-schieb]').forEach(b=>b.onclick=()=>schiebe(-(+b.dataset.schieb)));
// In der großen Welle ziehen: nach rechts ziehen = Spur später
{const cv=$('welle');let zug=null;
 cv.addEventListener('pointerdown',ev=>{const t=gewaehlt(K[ST.sel].key),o=ORIG[K[ST.sel].key];if(!t||!o)return;cv.setPointerCapture(ev.pointerId);
  const span=Math.max(o.dauer,Mund.fenster(t).len)+2*LUFT;cv.dataset.span=span;zug={x:ev.clientX,st:t.start||0,sproPx:span/cv.clientWidth};});
 cv.addEventListener('pointermove',ev=>{if(!zug)return;schiebe(0,zug.st-(ev.clientX-zug.x)*zug.sproPx);});
 cv.addEventListener('pointerup',()=>{if(zug){zug=null;if(!K[ST.sel].musik)zusammen();}});}
$('mikAn').onclick=mikroAn;
$('mEff').onclick=()=>setzeModus('effekte');$('mMus').onclick=()=>setzeModus('musik');
$('biom').onchange=e=>{ST.biom=e.target.value;ST.selM=0;setzeModus('musik');};
['vorlage','klick','mitspielen'].forEach(k=>$(k).onchange=e=>{ST[k]=e.target.checked;merke();});
$('mix').onclick=mix;
$('geraet').onchange=e=>{ST.geraet=e.target.value;merke();mikroAn();};
$('kanal').onchange=e=>{ST.kanal=e.target.value;merke();};
$('ausloeser').onchange=e=>{ST.ausloeser=e.target.value;merke();};
$('schwelle').oninput=e=>{ST.schwelle=+e.target.value;merke();schwelleStrich();};
$('laenge').onchange=e=>{ST.laenge=e.target.value;merke();};
['vorher','angleich','weiter'].forEach(k=>$(k).onchange=e=>{ST[k]=e.target.checked;merke();});
let pegelZeit=null;
$('tPegel').oninput=e=>{const t=gewaehlt(K[ST.sel].key);if(!t)return;t.pegel=+e.target.value;$('tPegelWert').textContent=t.pegel+' dB';
 clearTimeout(pegelZeit);pegelZeit=setTimeout(async()=>{await A.aendere(t);await aufDiePlatte(t,false);},300);};
$('tPegel').onchange=()=>spieleTake();
$('ordner').onclick=ordnerVerbinden;$('zip').onclick=zipLaden;
const MO=Mund.optionen();
$('mundAn').checked=MO.aktiv;$('fehlt').value=MO.fehlt;$('musikAus').checked=MO.musikAus;$('streuung').value=String(MO.streuung);
if(!$('streuung').value)$('streuung').value='0.03';
$('mundAn').onchange=e=>Mund.setze('aktiv',e.target.checked);
$('fehlt').onchange=e=>Mund.setze('fehlt',e.target.value);
$('musikAus').onchange=e=>Mund.setze('musikAus',e.target.checked);
$('streuung').onchange=e=>Mund.setze('streuung',+e.target.value);
$('spiel').onclick=()=>{Mund.setze('aktiv',true);$('mundAn').checked=true;window.open('index.html?mund=1','_blank');};
document.addEventListener('keyup',ev=>{if(ev.key===' '&&ev.target.closest('button'))ev.preventDefault();});
document.addEventListener('keydown',ev=>{const k=ev.key;
 if(ev.target.matches('input[type=text]'))return; // Profilname tippen
 if(ev.target.closest('select'))return;if(ev.target.matches('input[type=range]')&&k.startsWith('Arrow'))return;
 if(k===' '&&ev.target.closest('button,input'))ev.target.blur(); // sonst „klickt“ die Leertaste zusätzlich den fokussierten Knopf
 if(k===' '){ev.preventDefault();aufnahme();}
 else if(k==='o'||k==='O')spieleOrig();
 else if(k==='p'||k==='P')spieleTake();
 else if(k==='a'||k==='A')ab();
 else if(k==='z'||k==='Z')zusammen();
 else if(k===','||k===';')schiebe(ev.shiftKey?.05:.01);
 else if(k==='.'||k===':')schiebe(ev.shiftKey?-.05:-.01);
 else if(k==='ArrowDown'){ev.preventDefault();waehle(ST.sel+1);}
 else if(k==='ArrowUp'){ev.preventDefault();waehle(ST.sel-1);}});
if(navigator.mediaDevices)navigator.mediaDevices.addEventListener('devicechange',()=>{if(mik)geraeteListe(mik.strom);});

// ---------- Start ----------
(async()=>{
 $('kanal').value=ST.kanal;$('ausloeser').value=ST.ausloeser;$('schwelle').value=ST.schwelle;$('laenge').value=ST.laenge;
 ['vorher','angleich','weiter'].forEach(k=>$(k).checked=ST[k]);schwelleStrich();
 if(!window.isSecureContext)status('Mikro geht nur über http://localhost:8000 (start.bat), nicht als Datei.',true);
 ['vorlage','klick','mitspielen'].forEach(k=>$(k).checked=ST[k]);
 for(const e of MUND_KATALOG){try{await rendere(e);}catch(x){console.warn('Original nicht gerendert',e.key,x);}}
 try{AUDIO=await (await fetch('data/audio.json',{cache:'no-store'})).json();
  $('biom').innerHTML=AUDIO.biome.filter(b=>Music.BIOME[b.id]).map(b=>`<option value="${b.id}">${b.n} (${b.key})</option>`).join('');$('biom').value=ST.biom;
  if(!$('biom').value){ST.biom=$('biom').options[0].value;$('biom').value=ST.biom;}}
 catch(x){AUDIO=null;$('mMus').disabled=true;console.warn('data/audio.json fehlt',x);}
 for(const k of Object.keys(ORIG))for(let p=2;p<=Mund.PROFILE;p++)ORIG[Mund.profilKey(k,p)]=ORIG[k];
 if(ST.modus==='musik'&&AUDIO)K=musikKatalog(ST.biom);else{ST.modus='effekte';K=effKatalog();}profileZeigen();ST.sel=Math.min(ST.sel,K.length-1);
 await lade();await ordnerPruefen();zeichne();
})();

// ---------- Profile (2026-11-14) ----------
// Drei Mund-Profile. Profil 1 = die bisherigen Schlüssel („hit“), Profil 2/3 = „p2/hit“ … (Mund.profilKey). Gilt für die Effekte;
// Musik-Loops sind für alle Profile dieselben. Das Spiel spielt das hier gewählte Profil.
function effKatalog(){const p=Mund.optionen().profil||1;return p>1?MUND_KATALOG.map(e=>Object.assign({},e,{key:Mund.profilKey(e.key,p),basis:e.key})):MUND_KATALOG;}
function profileZeigen(){const z=$('profile');if(!z)return;const p=Mund.optionen().profil||1;let h='<span class="hinweis">Profil</span>';
 for(let i=1;i<=Mund.PROFILE;i++)h+=`<button class="sm${i===p?' on':''}" data-profil="${i}">${Mund.profilName(i).replace(/[<&]/g,c=>c==='<'?'&lt;':'&amp;')}</button>`;
 h+=`<label>Name <input type="text" id="profilName" maxlength="24" value="${Mund.profilName(p).replace(/[<&"]/g,c=>({'<':'&lt;','&':'&amp;','"':'&quot;'})[c])}"></label>`;
 z.innerHTML=h;
 z.querySelectorAll('[data-profil]').forEach(b=>b.onclick=async()=>{if(aufn)abbruch();await Mund.profilWaehlen(b.dataset.profil);$('mundAn').checked=true;
  if(ST.modus!=='musik'){K=effKatalog();}profileZeigen();zeichne();status('Profil „'+Mund.profilName(+b.dataset.profil)+'“');});
 $('profilName').onchange=e=>{Mund.profilBenennen(p,e.target.value);profileZeigen();};}
// Eingebettet im Spiel (Menü → Wachswalze): Zurück-Knopf, Esc schließt, kein „Spiel öffnen“
if(new URLSearchParams(location.search).get('eingebettet')){document.documentElement.classList.add('eingebettet');
 const zurueck=()=>{try{if(aufn)abbruch();musikStopp();mikroAus();}catch(e){}try{parent.MundAufnahme.zu();}catch(e){}};
 $('zurueck').onclick=zurueck;
 document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&!ev.target.closest('input[type=text]')){ev.preventDefault();zurueck();}},true);}
