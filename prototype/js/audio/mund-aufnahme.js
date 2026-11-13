// ===================== MUND-SOUNDS IM SPIEL AUFNEHMEN (2026-11-13) =====================
// Überlagerung „Mund-Sounds“ (Menü → Mund-Sounds, oder Einstellungen): alle Effekte aus MUND_KATALOG in drei Profilen
// anhören und direkt im Spiel neu aufnehmen. Gespeichert wird in derselben Ablage wie im Studio (IndexedDB „saltmoor-mund“),
// Profil 1 teilt sich die Aufnahmen mit dem Studio, Profil 2 und 3 haben eigene (Mund.profilKey).
// Ablauf einer Aufnahme wie im Studio, nur ohne Feinschnitt: Original anhören -> Start, sobald die Stimme über der Schwelle ist
// (kurzer Vorlauf läuft mit) -> Originallänge plus Luft -> Einsatz finden, auf Originallänge schneiden, Pegel ans Original angleichen.
// Mikrofon und Kanal übernimmt die Aufnahme aus dem Studio (gleiche Adresse, localStorage „saltmoor.studio.v1“), sonst Standard-Eingang.
const MundAufnahme=(()=>{
 const OPT_KEY='saltmoor.mundauf.v1';
 let O={schwelle:-40,vorher:true};
 try{Object.assign(O,JSON.parse(localStorage.getItem(OPT_KEY)||'{}'));}catch(e){}
 const merke=()=>{try{localStorage.setItem(OPT_KEY,JSON.stringify(O));}catch(e){}};
 const studio=()=>{try{return JSON.parse(localStorage.getItem('saltmoor.studio.v1')||'{}');}catch(e){return {};}};
 const dbV=v=>v>0?20*Math.log10(v):-120;
 const warte=ms=>new Promise(r=>setTimeout(r,ms));
 const de=n=>n.toLocaleString('de-DE',{minimumFractionDigits:2,maximumFractionDigits:2});
 const h=s=>String(s).replace(/[<&"]/g,c=>({'<':'&lt;','&':'&amp;','"':'&quot;'})[c]);
 let offen=false,meldung='',warn=false,musikVorher=null;

 // ---------- Originale offline rendern (Länge und Spitze als Maß für die Aufnahme) ----------
 const ORIG={};
 async function original(e){if(ORIG[e.key])return ORIG[e.key];
  const sr=48000,oc=new OfflineAudioContext(1,sr*5,sr),alt=[AC,NB,SFXB,SAT];
  try{AC=oc;NB=oc.createBuffer(1,sr,sr);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
   SFXB=oc.createGain();SFXB.gain.value=.72;SFXB.connect(oc.destination);SAT=null;
   (Mund.original&&Mund.original[e.sfx]||sfx[e.sfx])(e.arg);}
  finally{[AC,NB,SFXB,SAT]=alt;}
  const pcm=(await oc.startRendering()).getChannelData(0);let sp=0;for(let i=0;i<pcm.length;i++){const a=Math.abs(pcm[i]);if(a>sp)sp=a;}
  let ende=0;const sw=sp*.003;for(let i=pcm.length-1;i>=0;i--)if(Math.abs(pcm[i])>sw){ende=i;break;}
  return ORIG[e.key]={dauer:Math.max(.05,Math.ceil((ende/sr+.04)*20)/20),spitze:sp};}

 // ---------- Mikro: eigener Kontext in der Abtastrate des Eingangs, Abgriff per AudioWorklet ----------
 let mik=null,rate=0,vorl=[],vorlN=0,aufn=null,spitze=0,clip=false;
 const VORLAUF=.35,NACHLAUF=.6;
 const WORKLET=`class MundAbgriff extends AudioWorkletProcessor{process(i){const x=i[0];if(x&&x.length)this.port.postMessage(x.map(c=>c.slice(0)));return true;}}registerProcessor('mund-abgriff',MundAbgriff);`;
 async function mikroAus(){if(!mik)return;const m=mik;mik=null;m.strom.getTracks().forEach(t=>t.stop());try{m.quelle.disconnect();m.knoten.disconnect();}catch(e){}try{await m.cap.close();}catch(e){}}
 async function mikroAn(){
  au();if(AC&&AC.state==='suspended')await AC.resume();
  if(mik)return true;
  const st=studio(),c={echoCancellation:false,noiseSuppression:false,autoGainControl:false,channelCount:{ideal:2}};
  if(st.geraet)c.deviceId={ideal:st.geraet};
  let strom;try{strom=await navigator.mediaDevices.getUserMedia({audio:c});}
  catch(e){zeige('Mikro nicht freigegeben: '+e.message,true);return false;}
  const tr=strom.getAudioTracks()[0],s=tr.getSettings?tr.getSettings():{};
  let cap;try{cap=s.sampleRate?new AudioContext({sampleRate:s.sampleRate,latencyHint:'interactive'}):new AudioContext({latencyHint:'interactive'});}
  catch(e){cap=new AudioContext({latencyHint:'interactive'});}
  if(cap.state==='suspended')await cap.resume();
  await cap.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET],{type:'application/javascript'})));
  const quelle=cap.createMediaStreamSource(strom),knoten=new AudioWorkletNode(cap,'mund-abgriff',{numberOfInputs:1,numberOfOutputs:1,channelCountMode:'explicit',channelCount:2});
  const stumm=cap.createGain();stumm.gain.value=0;quelle.connect(knoten).connect(stumm).connect(cap.destination);
  knoten.port.onmessage=ev=>block(ev.data);
  rate=cap.sampleRate;vorl=[];vorlN=0;
  mik={strom,quelle,knoten,cap,info:`${tr.label||'Eingang'} · ${rate} Hz`};return true;}
 function mono(k){const w=studio().kanal||'0';if(k.length<2||w==='0')return k[0];if(w==='1')return k[1];
  const a=k[0],b=k[1],o=new Float32Array(a.length);for(let i=0;i<a.length;i++)o[i]=(a[i]+b[i])*.5;return o;}
 function block(kanaele){
  const x=mono(kanaele);let sp=0;for(let i=0;i<x.length;i++){const a=Math.abs(x[i]);if(a>sp)sp=a;}
  if(sp>spitze)spitze=sp;if(sp>=.99)clip=true;
  vorl.push(x);vorlN+=x.length;const max=rate*VORLAUF+x.length;while(vorlN-vorl[0].length>max)vorlN-=vorl.shift().length;
  if(!aufn)return;
  if(aufn.phase==='wartet'){if(dbV(sp)>=O.schwelle){aufn.phase='nimmt';aufn.bloecke=vorl.slice();aufn.n=vorlN;aufn.los=vorlN;aufn.clip=sp>=.99;zeige('● Aufnahme läuft …');liste();}return;}
  if(aufn.phase!=='nimmt')return;
  aufn.bloecke.push(x);aufn.n+=x.length;if(sp>=.99)aufn.clip=true;
  if(aufn.n-aufn.los>=(aufn.dauer+NACHLAUF)*rate)fertig();}

 // ---------- Aufnahme ----------
 async function aufnehmen(key){
  if(aufn){const war=aufn.key;abbrechen();if(war===key)return;}
  const e=MUND_KATALOG.find(x=>x.key===key);if(!e)return;
  if(!await mikroAn())return;
  const o=await original(e),zug={key,phase:'vorher',dauer:o.dauer,spitze:o.spitze,bloecke:[],n:0};aufn=zug;liste();
  if(O.vorher){zeige('▶ Original: '+e.n);spieleOriginal(key);await warte(o.dauer*1000+350);if(aufn!==zug)return;}
  zug.phase='wartet';zeige(`● bereit: mach „${e.n}“ (nochmal klicken bricht ab)`);liste();}
 function abbrechen(){if(!aufn)return;aufn=null;zeige('abgebrochen');liste();}
 async function fertig(){
  const z=aufn;aufn=null;if(!z||!z.n){liste();return;}
  const roh=new Float32Array(z.n);let p=0;z.bloecke.forEach(b=>{roh.set(b,p);p+=b.length;});
  const r=bearbeite(roh,rate,z);
  if(!r){zeige('Nichts gehört. Lauter rein oder Schwelle tiefer.',true);liste();return;}
  const prof=Mund.optionen().profil||1;
  const t={key:Mund.profilKey(z.key,prof),profil:prof,sr:rate,pcm:r.pcm,start:r.start,laenge:r.laenge,dauer:r.laenge,zeit:Date.now(),pegel:0};
  try{t.id=await Mund.ablage.neuerTake(t);}catch(e){zeige('Speichern ging nicht: '+e.message,true);return;}
  await Mund.ladeGewaehlte();
  zeige(`✓ gespeichert in „${Mund.profilName(prof)}“ (${de(r.laenge)} s)${z.clip?' · ACHTUNG: übersteuert, leiser rein':''}`,!!z.clip);
  liste();Mund.spiele(t);}
 // Gleichanteil weg, Einsatz suchen, auf Originallänge, Spitze ans Original angleichen (wie im Studio)
 function bearbeite(x,sr,z){
  let m=0;for(let i=0;i<x.length;i++)m+=x[i];m/=x.length||1;for(let i=0;i<x.length;i++)x[i]-=m;
  let sp=0;for(let i=0;i<x.length;i++){const a=Math.abs(x[i]);if(a>sp)sp=a;}
  if(sp<1e-4)return null;
  let ein=0;for(let i=0;i<x.length;i++)if(Math.abs(x[i])>sp*.08){ein=i;break;}
  const a=Math.max(0,ein-Math.round(.008*sr)),laenge=z.dauer;
  let s2=0;const b=Math.min(x.length,a+Math.round(laenge*sr));for(let i=a;i<b;i++){const v=Math.abs(x[i]);if(v>s2)s2=v;}
  const g=Math.min(100,Math.min(.95,Math.max(.2,z.spitze))/(s2||sp));for(let i=0;i<x.length;i++)x[i]*=g;
  return {pcm:x,start:a/sr,laenge};}

 // ---------- Abspielen und Löschen ----------
 function spieleOriginal(key){const e=MUND_KATALOG.find(x=>x.key===key);if(!e)return;au();if(AC&&AC.state==='suspended')AC.resume();(Mund.original&&Mund.original[e.sfx]||sfx[e.sfx])(e.arg);}
 function spieleAktuell(key){const e=MUND_KATALOG.find(x=>x.key===key);if(!e)return;au();if(AC&&AC.state==='suspended')AC.resume();
  const an=Mund.optionen().aktiv;Mund.setze('aktiv',true);try{sfx[e.sfx](e.arg);}finally{Mund.setze('aktiv',an);}}
 async function loeschen(key){const w=await Mund.ablage.wahl(),id=w[Mund.profilKey(key)];if(id==null)return;
  // alle Aufnahmen dieses Sounds im Profil weg, damit nicht die vorletzte nachrückt
  const alle=(await Mund.ablage.alleTakes()).filter(t=>t.key===Mund.profilKey(key));for(const t of alle)await Mund.ablage.loesche(t.id);
  await Mund.ladeGewaehlte();zeige('Aufnahme gelöscht, es spielt wieder '+(Mund.quelle(key)==='datei'?'die eingebaute Aufnahme':'der generierte Klang')+'.');liste();}

 // ---------- Oberfläche ----------
 const QN={eigen:'eigene Aufnahme',datei:'eingebaut',null:'generiert'};
 function zeileHtml(e){const q=Mund.quelle(e.key),nimmt=aufn&&aufn.key===e.key;
  return `<div class="mzeile${nimmt?' nimmt':''}" data-mkey="${e.key}"><div class="mname"><b>${h(e.n)}</b><small>${h(e.wo)}</small></div>
  <span class="mq ${q||'gen'}">${QN[q]}</span>
  <button class="deco klein" data-mauf="orig" data-k="${e.key}" title="Original (generiert)">▶ ORIGINAL</button>
  <button class="deco klein" data-mauf="hoer" data-k="${e.key}" title="So klingt es im Profil">▶ PROFIL</button>
  <button class="deco klein rec${nimmt?' an':''}" data-mauf="rec" data-k="${e.key}">${nimmt?'■ STOPP':'● AUFNEHMEN'}</button>
  <button class="deco klein" data-mauf="del" data-k="${e.key}"${q==='eigen'?'':' disabled'} title="Eigene Aufnahme löschen">✕</button></div>`;}
 function listeHtml(){let g='',out='';MUND_KATALOG.forEach(e=>{if(e.gruppe!==g){g=e.gruppe;out+=`<h3>${h(g)}</h3>`;}out+=zeileHtml(e);});return out;}
 function html(){const o=Mund.optionen(),p=o.profil||1;let tabs='';for(let i=1;i<=Mund.PROFILE;i++)tabs+=`<button class="deco klein${i===p?' an':''}" data-mauf="profil" data-p="${i}">${h(Mund.profilName(i))}</button>`;
  const n=MUND_KATALOG.filter(e=>Mund.quelle(e.key)==='eigen').length;
  return box('mundauf',`<h2>MUND-SOUNDS</h2>
  <div class="mprofile">${tabs}</div>
  <div class="mkopf"><label>Name <input type="text" maxlength="24" value="${h(Mund.profilName(p))}" data-mname></label><span id="mzahl">${n} von ${MUND_KATALOG.length} selbst aufgenommen</span>
   <label><input type="checkbox" ${o.aktiv?'checked':''} data-mauf="aktiv"> Im Spiel benutzen</label></div>
  <div class="mkopf"><label><input type="checkbox" ${O.vorher?'checked':''} data-mauf="vorher"> Original vorher anhören</label>
   <label>Schwelle <input type="range" min="-60" max="-10" step="1" value="${O.schwelle}" data-mauf="schwelle"> <span id="mschwelle">${O.schwelle} dB</span></label>
   <span class="mpegel"><i id="mpegel"></i><em id="mstrich"></em></span></div>
  <p class="hint" id="mmeldung">${h(meldung||'Fehlt im Profil ein Sound, spielt die eingebaute Aufnahme, sonst der generierte Klang.')}</p>
  <div class="mliste" id="mliste">${listeHtml()}</div>
  <button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
 function liste(){const l=document.getElementById('mliste');if(!l)return;const top=l.scrollTop;l.innerHTML=listeHtml();l.scrollTop=top;
  const z=document.getElementById('mzahl');if(z)z.textContent=`${MUND_KATALOG.filter(e=>Mund.quelle(e.key)==='eigen').length} von ${MUND_KATALOG.length} selbst aufgenommen`;}
 function zeige(t,w){meldung=t;warn=!!w;const m=document.getElementById('mmeldung');if(m){m.textContent=t;m.classList.toggle('warn',warn);}}
 function auf(){if(typeof zeigeOverlay!=='function')return;offen=true;meldung='';
  // Musik aus, solange aufgenommen wird (sonst landet sie im Mikro)
  if(typeof Music!=='undefined'&&Music.volume&&musikVorher==null){musikVorher=typeof Einst!=='undefined'?Einst.get('musik'):.5;Music.volume(0);}
  zeigeOverlay(html());}
 function zu(){offen=false;abbrechen();mikroAus();
  if(musikVorher!=null&&typeof Music!=='undefined'&&Music.volume)Music.volume(musikVorher);musikVorher=null;}
 // Pegel und Schließen erkennen (Esc, Schließen-Knopf, Menü)
 let anz=-120;(function lauf(){if(offen){const ov=document.getElementById('overlay');
   if(!ov||!ov.classList.contains('an')||!ov.querySelector('.mundauf'))zu();
   else{const v=dbV(spitze);spitze=0;anz=Math.max(v,anz-1.2);const pg=document.getElementById('mpegel');
    if(pg){pg.style.width=(Math.max(0,Math.min(1,(anz+60)/60))*100)+'%';pg.classList.toggle('clip',clip);}
    const st=document.getElementById('mstrich');if(st)st.style.left=((O.schwelle+60)/60*100)+'%';}}
  requestAnimationFrame(lauf);})();
 setInterval(()=>{clip=false;},2500);

 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-mauf]');if(!b||b.disabled)return;const k=b.dataset.k;
  switch(b.dataset.mauf){
   case'auf':auf();break;
   case'profil':abbrechen();Mund.profilWaehlen(b.dataset.p).then(()=>{if(offen)zeigeOverlay(html());});break;
   case'orig':spieleOriginal(k);break;case'hoer':spieleAktuell(k);break;
   case'rec':aufnehmen(k);break;case'del':loeschen(k);break;
   case'aktiv':Mund.setze('aktiv',b.checked);break;case'vorher':O.vorher=b.checked;merke();break;}});
 document.addEventListener('input',e=>{const t=e.target;if(t.matches&&t.matches('[data-mauf="schwelle"]')){O.schwelle=+t.value;merke();const s=document.getElementById('mschwelle');if(s)s.textContent=O.schwelle+' dB';}});
 document.addEventListener('change',e=>{const t=e.target;if(t.matches&&t.matches('[data-mname]')){const p=Mund.optionen().profil||1;Mund.profilBenennen(p,t.value);zeigeOverlay(html());}});
 return {auf,zu,html,get offen(){return offen;},get laeuft(){return !!aufn;}};
})();
