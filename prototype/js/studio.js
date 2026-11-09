// Aufnahme-Studio (studio.html): alle Soundeffekte aus MUND_KATALOG (js/audio/mund.js) anhören und neu aufnehmen.
// Ablauf einer Aufnahme: Mikro läuft dauernd mit (Pegel, kurzer Vorlauf im Speicher) -> Start per Schwelle oder Einzählen
// -> Aufnahme etwas länger als das Original -> Einsatz finden, auf Originallänge schneiden, Ein-/Ausblenden, Pegel angleichen
// -> sofort in IndexedDB (und als WAV in den verbundenen Ordner). Die neueste Aufnahme ist die gewählte.
const $=id=>document.getElementById(id);
const K=MUND_KATALOG,A=Mund.ablage;
const OPT_KEY='saltmoor.studio.v1';
let ST={sel:0,geraet:'',kanal:'0',ausloeser:'stimme',schwelle:-36,laenge:'wie',vorher:true,angleich:true,weiter:false};
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
let mik=null; // {strom, quelle, knoten}
const VORLAUF=.25; // Sekunden vor dem Einsatz, die mitgeschnitten werden
let vorl=[],vorlN=0; // letzte Blöcke (Mono, nach Kanalwahl)
let aufn=null; // laufende Aufnahme: {key, bloecke, n, ziel, phase:'wartet'|'zaehlt'|'nimmt', ...}
let pegelSpitze=0;
const WORKLET=`class Abgriff extends AudioWorkletProcessor{process(i){const x=i[0];if(x&&x.length)this.port.postMessage(x.map(c=>c.slice(0)));return true;}}registerProcessor('abgriff',Abgriff);`;
async function mikroAn(){
 au();if(!AC){status('Kein Audio im Browser.',true);return;}if(AC.state==='suspended')await AC.resume();
 if(mik){mik.strom.getTracks().forEach(t=>t.stop());try{mik.quelle.disconnect();mik.knoten.disconnect();}catch(e){}mik=null;}
 const c={echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:{ideal:2}};
 if(ST.geraet)c.deviceId={exact:ST.geraet};
 let strom;
 try{strom=await navigator.mediaDevices.getUserMedia({audio:c});}
 catch(e){if(ST.geraet){ST.geraet='';merke();return mikroAn();}status('Mikro nicht freigegeben: '+e.message,true);return;}
 await geraeteListe(strom);
 if(!mikroAn.geladen){await AC.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET],{type:'application/javascript'})));mikroAn.geladen=true;}
 const quelle=AC.createMediaStreamSource(strom),knoten=new AudioWorkletNode(AC,'abgriff',{numberOfInputs:1,numberOfOutputs:1,channelCountMode:'explicit',channelCount:2});
 const stumm=AC.createGain();stumm.gain.value=0;quelle.connect(knoten).connect(stumm).connect(AC.destination);
 knoten.port.onmessage=ev=>block(ev.data);
 mik={strom,quelle,knoten};$('mikAn').textContent='Mikro neu verbinden';
 const tr=strom.getAudioTracks()[0],s=tr.getSettings?tr.getSettings():{};
 status(`Mikro an: ${tr.label||'Eingang'} · ${s.channelCount||'?'} Kanal · ${AC.sampleRate} Hz`);}
async function geraeteListe(strom){
 const l=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audioinput');
 const akt=strom&&strom.getAudioTracks()[0].getSettings().deviceId;
 const sel=$('geraet');sel.disabled=false;
 sel.innerHTML=l.map(d=>`<option value="${d.deviceId}"${d.deviceId===(ST.geraet||akt)?' selected':''}>${(d.label||'Eingang').replace(/</g,'&lt;')}</option>`).join('');}
function mono(kanaele){const k=ST.kanal;if(kanaele.length<2||k==='0')return kanaele[0];if(k==='1')return kanaele[1];
 const a=kanaele[0],b=kanaele[1],o=new Float32Array(a.length);for(let i=0;i<a.length;i++)o[i]=(a[i]+b[i])*.5;return o;}
function block(kanaele){
 const x=mono(kanaele);let sp=0;for(let i=0;i<x.length;i++){const a=Math.abs(x[i]);if(a>sp)sp=a;}
 if(sp>pegelSpitze)pegelSpitze=sp;
 vorl.push(x);vorlN+=x.length;const max=AC.sampleRate*VORLAUF+x.length;while(vorlN-vorl[0].length>max){vorlN-=vorl.shift().length;}
 if(!aufn)return;
 if(aufn.phase==='wartet'&&dbV(sp)>=ST.schwelle){aufn.phase='nimmt';aufn.bloecke=vorl.slice();aufn.n=vorlN;status('● Aufnahme läuft …');return;}
 if(aufn.phase!=='nimmt')return;
 aufn.bloecke.push(x);aufn.n+=x.length;const sr=AC.sampleRate;
 if(dbV(sp)>ST.schwelle-12)aufn.zuletztLaut=aufn.n;
 const fertig=ST.laenge==='wie'?aufn.n>=aufn.ziel*sr:(aufn.n>=8*sr||(aufn.zuletztLaut&&aufn.n-aufn.zuletztLaut>.6*sr));
 if(fertig)aufnahmeEnde();}
// Pegelanzeige (fällt langsam ab)
let pegelAnz=0;
(function zeige(){const v=dbV(pegelSpitze);pegelSpitze=0;pegelAnz=Math.max(v,pegelAnz-1.2);
 const p=Math.max(0,Math.min(1,(pegelAnz+60)/60));$('pegel').style.width=(p*100)+'%';$('pegelDb').textContent=mik?(pegelAnz<=-60?'–∞ dB':de(pegelAnz,0)+' dB'):'– dB';
 requestAnimationFrame(zeige);})();
function schwelleStrich(){$('schwelleStrich').style.left=((ST.schwelle+60)/60*100)+'%';$('schwelleWert').textContent=ST.schwelle+' dB';}

// ---------- Aufnahme ----------
const warte=ms=>new Promise(r=>setTimeout(r,ms));
async function aufnahme(){
 if(aufn){aufn.phase==='nimmt'?aufnahmeEnde():abbruch();return;}
 if(!mik){await mikroAn();if(!mik)return;}
 const e=K[ST.sel],o=ORIG[e.key];if(!o)return;
 const zug={key:e.key,phase:'vorher',bloecke:[],n:0,ziel:o.dauer+(ST.ausloeser==='stimme'?VORLAUF+.1:1.2),zuletztLaut:0};aufn=zug;knopf();
 if(ST.vorher){status('▶ Original …');spieleOrig();await warte(o.dauer*1000+350);if(aufn!==zug)return;}
 if(ST.ausloeser==='zaehlen'){zug.phase='zaehlt';
  for(const z of ['3','2','1']){if(aufn!==zug)return;status(z+' …');tn(z==='1'?1320:880,.05,'square',.05,0,0,{lp:3000});await warte(600);}
  if(aufn!==zug)return;zug.phase='nimmt';zug.n=0;zug.bloecke=[];status('● Aufnahme läuft …');}
 else{zug.phase='wartet';status('● bereit: mach den Sound (Leertaste bricht ab)');}
 knopf();}
function abbruch(){aufn=null;knopf();status('abgebrochen');}
async function aufnahmeEnde(){
 const z=aufn;aufn=null;knopf();if(!z||!z.n)return;
 const sr=AC.sampleRate,roh=new Float32Array(z.n);let p=0;z.bloecke.forEach(b=>{roh.set(b,p);p+=b.length;});
 const o=ORIG[z.key],pcm=bearbeite(roh,sr,o);
 if(!pcm){status('Nichts gehört. Gain am Apollo höher oder Schwelle tiefer.',true);return;}
 const t={key:z.key,sr,pcm,dauer:pcm.length/sr,zeit:Date.now(),pegel:0};
 t.id=await A.neuerTake(t);
 await aufDiePlatte(t,true);
 status(`✓ gespeichert (${de(t.dauer)} s)${ordner?' · '+dateiName(t)+' im Ordner':''}`);
 await lade();zeichne();
 if(ST.weiter&&ST.sel<K.length-1){waehle(ST.sel+1);}else{Mund.spiele(t);}}
// Einsatz suchen, schneiden, Gleichanteil weg, ein-/ausblenden, angleichen
function bearbeite(x,sr,o){
 let m=0;for(let i=0;i<x.length;i++)m+=x[i];m/=x.length||1;for(let i=0;i<x.length;i++)x[i]-=m;
 let sp=0;for(let i=0;i<x.length;i++){const a=Math.abs(x[i]);if(a>sp)sp=a;}
 if(sp<1e-4)return null;
 let ein=0;for(let i=0;i<x.length;i++)if(Math.abs(x[i])>sp*.08){ein=i;break;}
 const a=Math.max(0,ein-Math.round(.008*sr));
 let e;
 if(ST.laenge==='wie')e=Math.min(x.length,a+Math.round(o.dauer*sr));
 else{e=a;for(let i=x.length-1;i>a;i--)if(Math.abs(x[i])>sp*.02){e=Math.min(x.length,i+Math.round(.06*sr));break;}}
 const y=x.slice(a,e);if(!y.length)return null;
 const fi=Math.min(y.length,Math.round(.003*sr)),fo=Math.min(y.length,Math.round(.03*sr));
 for(let i=0;i<fi;i++)y[i]*=i/fi;for(let i=0;i<fo;i++)y[y.length-1-i]*=i/fo;
 let s2=0;for(let i=0;i<y.length;i++){const v=Math.abs(y[i]);if(v>s2)s2=v;}
 const ziel=ST.angleich?Math.min(.95,Math.max(.2,o.spitze)):.89;const g=Math.min(100,ziel/(s2||1));
 for(let i=0;i<y.length;i++)y[i]*=g;
 return y;}

// ---------- Abspielen ----------
let TAKES={},WAHL={}; // key -> [takes], key -> take-id
function gewaehlt(key){const id=WAHL[key];return (TAKES[key]||[]).find(t=>t.id===id)||null;}
function spieleOrig(){au();if(AC&&AC.state==='suspended')AC.resume();const e=K[ST.sel];(Mund.original&&Mund.original[e.sfx]||sfx[e.sfx])(e.arg);}
function spieleTake(){const t=gewaehlt(K[ST.sel].key);if(!t){status('Noch keine Aufnahme.');return;}Mund.spiele(t);}
async function ab(){spieleOrig();await warte(ORIG[K[ST.sel].key].dauer*1000+300);spieleTake();}

// ---------- Ordner und Dateien ----------
let ordner=null;
const dateiName=t=>`${t.key}.wav`;
function wav(pcm,sr){const n=pcm.length,b=new ArrayBuffer(44+n*2),v=new DataView(b);let o=0;
 const s=t=>{for(let i=0;i<t.length;i++)v.setUint8(o++,t.charCodeAt(i));},u32=x=>{v.setUint32(o,x,true);o+=4;},u16=x=>{v.setUint16(o,x,true);o+=2;};
 s('RIFF');u32(36+n*2);s('WAVE');s('fmt ');u32(16);u16(1);u16(1);u32(sr);u32(sr*2);u16(2);u16(16);s('data');u32(n*2);
 for(let i=0;i<n;i++){const x=Math.max(-1,Math.min(1,pcm[i]));v.setInt16(o,x<0?x*32768:x*32767,true);o+=2;}return new Uint8Array(b);}
async function schreibe(dir,name,bytes){const f=await dir.getFileHandle(name,{create:true}),w=await f.createWritable();await w.write(bytes);await w.close();}
// Gewählte Aufnahme als <key>.wav, jede Aufnahme zusätzlich unter takes/<key>_<id>.wav
async function aufDiePlatte(t,neu){if(!ordner)return;
 try{const tk=await ordner.getDirectoryHandle('takes',{create:true});const bytes=wav(t.pcm,t.sr);
  if(neu)await schreibe(tk,`${t.key}_${t.id}.wav`,bytes);await schreibe(ordner,dateiName(t),applyPegel(t));}
 catch(e){status('Ordner: '+e.message,true);}}
function applyPegel(t){if(!t.pegel)return wav(t.pcm,t.sr);const g=Math.pow(10,t.pegel/20),y=t.pcm.map(v=>v*g);return wav(y,t.sr);}
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
function welle(cv,lagen,dauer,strich){const x=cv.getContext('2d'),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);
 x.fillStyle='#1a2120';x.fillRect(0,H/2,W,1);
 let top=1e-4;lagen.forEach(({pcm})=>{for(let i=0;i<pcm.length;i++){const v=Math.abs(pcm[i]);if(v>top)top=v;}}); // jede Welle auf die lauteste der beiden skaliert
 lagen.forEach(({pcm,sr,farbe})=>{if(!pcm)return;x.fillStyle=farbe;const n=pcm.length,proPx=dauer*sr/W;
  for(let px=0;px<W;px++){const a=Math.floor(px*proPx),b=Math.min(n,Math.floor((px+1)*proPx));if(a>=n)break;let mx=0;
   for(let i=a;i<b;i++){const v=Math.abs(pcm[i]);if(v>mx)mx=v;}const h=Math.max(1,mx/top*H*.46);x.fillRect(px,H/2-h,1,h*2);}});
 if(strich){x.fillStyle='#e8c547';x.fillRect(Math.min(W-2,strich/dauer*W),0,2,H);}}
function liste(){let h='',gr='';
 K.forEach((e,i)=>{if(e.gruppe!==gr){gr=e.gruppe;h+=`<div class="gr">${gr}</div>`;}const n=(TAKES[e.key]||[]).length;
  h+=`<div class="zeile${i===ST.sel?' sel':''}" data-i="${i}"><span class="${n?'ok':'nein'}">${n?'✓':'○'}</span><div>${e.n}<small>${e.wo}</small></div><canvas width="240" height="52" data-w="${i}"></canvas><span class="len">${ORIG[e.key]?de(ORIG[e.key].dauer)+' s':''}</span></div>`;});
 $('liste').innerHTML=h;
 K.forEach((e,i)=>{const cv=document.querySelector(`canvas[data-w="${i}"]`),o=ORIG[e.key],t=gewaehlt(e.key);if(!o)return;
  const d=Math.max(o.dauer,t?t.dauer:0);welle(cv,[{pcm:o.pcm,sr:o.sr,farbe:'rgba(232,197,71,.55)'},t&&{pcm:t.pcm,sr:t.sr,farbe:'rgba(122,255,200,.65)'}].filter(Boolean),d);});
 const fertig=K.filter(e=>(TAKES[e.key]||[]).length).length;$('fort').textContent=`${fertig} von ${K.length} aufgenommen`;}
function detail(){const e=K[ST.sel],o=ORIG[e.key],t=gewaehlt(e.key);
 $('dName').textContent=e.n;$('dWo').textContent=e.wo+(o?` · Original ${de(o.dauer)} s`:'');
 if(o){const d=Math.max(o.dauer,t?t.dauer:0)*1.05;welle($('welle'),[{pcm:o.pcm,sr:o.sr,farbe:'rgba(232,197,71,.5)'},t&&{pcm:t.pcm,sr:t.sr,farbe:'rgba(122,255,200,.7)'}].filter(Boolean),d,o.dauer);}
 $('tPegel').disabled=!t;$('tPegel').value=t?t.pegel||0:0;$('tPegelWert').textContent=(t?t.pegel||0:0)+' dB';
 const l=TAKES[e.key]||[];
 $('takes').innerHTML=l.length?l.map((x,i)=>`<div class="take${x.id===WAHL[e.key]?' aktiv':''}"><span>${x.id===WAHL[e.key]?'★':'·'}</span><span>Aufnahme ${l.length-i} · ${de(x.dauer)} s · ${new Date(x.zeit).toLocaleTimeString('de-DE')}</span>
   <button class="sm" data-play="${x.id}">▶</button><button class="sm" data-wahl="${x.id}"${x.id===WAHL[e.key]?' disabled':''}>wählen</button><button class="sm" data-weg="${x.id}">löschen</button></div>`).join('')
  :'<div class="hinweis">Noch keine. <kbd>Leertaste</kbd> drücken.</div>';
 knopf();}
function knopf(){const b=$('bRec');b.classList.toggle('an',!!aufn);
 b.textContent=!aufn?'● Aufnehmen':aufn.phase==='nimmt'?'■ Stopp':'✕ Abbrechen';$('bTake').disabled=!gewaehlt(K[ST.sel].key);}
function zeichne(){liste();detail();}
function waehle(i){if(aufn)abbruch();ST.sel=Math.max(0,Math.min(K.length-1,i));merke();zeichne();
 const z=document.querySelector('.zeile.sel');if(z)z.scrollIntoView({block:'nearest'});}

// ---------- Bedienung ----------
$('liste').addEventListener('click',ev=>{const z=ev.target.closest('.zeile');if(z)waehle(+z.dataset.i);});
$('takes').addEventListener('click',async ev=>{const b=ev.target.closest('button');if(!b)return;const key=K[ST.sel].key,l=TAKES[key]||[];
 if(b.dataset.play){Mund.spiele(l.find(t=>t.id===+b.dataset.play));}
 if(b.dataset.wahl){await A.waehle(key,+b.dataset.wahl);await lade();await aufDiePlatte(gewaehlt(key),false);zeichne();}
 if(b.dataset.weg){if(!confirm('Diese Aufnahme löschen?'))return;const id=+b.dataset.weg;await A.loesche(id);
  if(ordner){try{(await ordner.getDirectoryHandle('takes')).removeEntry(`${key}_${id}.wav`);}catch(e){}}
  await lade();const t=gewaehlt(key);if(ordner){try{t?await aufDiePlatte(t,false):await ordner.removeEntry(`${key}.wav`);}catch(e){}}zeichne();}});
$('bOrig').onclick=spieleOrig;$('bRec').onclick=aufnahme;$('bTake').onclick=spieleTake;$('bAB').onclick=ab;
$('mikAn').onclick=mikroAn;
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
 if(ev.target.closest('select'))return;if(ev.target.matches('input[type=range]')&&k.startsWith('Arrow'))return;
 if(k===' '&&ev.target.closest('button,input'))ev.target.blur(); // sonst „klickt“ die Leertaste zusätzlich den fokussierten Knopf
 if(k===' '){ev.preventDefault();aufnahme();}
 else if(k==='o'||k==='O')spieleOrig();
 else if(k==='p'||k==='P')spieleTake();
 else if(k==='a'||k==='A')ab();
 else if(k==='ArrowDown'){ev.preventDefault();waehle(ST.sel+1);}
 else if(k==='ArrowUp'){ev.preventDefault();waehle(ST.sel-1);}});
if(navigator.mediaDevices)navigator.mediaDevices.addEventListener('devicechange',()=>{if(mik)geraeteListe(mik.strom);});

// ---------- Start ----------
(async()=>{
 $('kanal').value=ST.kanal;$('ausloeser').value=ST.ausloeser;$('schwelle').value=ST.schwelle;$('laenge').value=ST.laenge;
 ['vorher','angleich','weiter'].forEach(k=>$(k).checked=ST[k]);schwelleStrich();
 if(!window.isSecureContext)status('Mikro geht nur über http://localhost:8000 (start.bat), nicht als Datei.',true);
 for(const e of K){try{await rendere(e);}catch(x){console.warn('Original nicht gerendert',e.key,x);}}
 await lade();await ordnerPruefen();zeichne();
})();
