// ===================== MUND-MODUS =====================
// Eigene Aufnahmen statt der prozeduralen Soundeffekte. Das Aufnahme-Studio (studio.html) nimmt die Clips auf und legt
// sie im Browser ab (IndexedDB, Datenbank „saltmoor-mund“, gleiche Adresse wie das Spiel, also http://localhost:8000).
// Im Spiel (index.html) hängt sich diese Datei vor jede Funktion in sfx: Ist der Mund-Modus an und gibt es für den Sound
// eine Aufnahme, spielt die Aufnahme (über denselben SFX-Bus mit Hall und Limiter), sonst das Original (oder Stille).
// Eingebaut: audio/mund/<key>.wav (exportiert aus dem Studio). Standard ist an; aus: index.html?mund=0 oder Schalter „Im Spiel benutzen“ im Studio.
// Die Liste MUND_KATALOG ist die eine Stelle, an der steht, welche Sounds es gibt. Neue sfx-Funktion = neuer Eintrag hier.
const MUND_KATALOG=[
 // Kampf
 {key:'hit',sfx:'hit',arg:0,n:'Treffer',gruppe:'Kampf',wo:'Du schlägst zu (normaler Treffer)'},
 {key:'hit_schwer',sfx:'hit',arg:4,n:'Treffer, schwer',gruppe:'Kampf',wo:'Du schlägst zu, ab Wucht 3 (fällt sonst auf „Treffer“ zurück)'},
 {key:'block',sfx:'block',n:'Block',gruppe:'Kampf',wo:'Du oder ein Gegner blockt'},
 {key:'hurt',sfx:'hurt',n:'Getroffen',gruppe:'Kampf',wo:'Ein Gegner trifft dich'},
 {key:'heal',sfx:'heal',n:'Heilen',gruppe:'Kampf',wo:'Du heilst dich'},
 {key:'die',sfx:'die',n:'Tod',gruppe:'Kampf',wo:'Ein Gegner stirbt, auch bei deiner Niederlage'},
 {key:'win',sfx:'win',n:'Sieg',gruppe:'Kampf',wo:'Kampf gewonnen'},
 // Reaktionen
 {key:'react',sfx:'react',arg:0,n:'Reaktion',gruppe:'Reaktionen',wo:'Stoff-Reaktion, auch wenn ein Gegner sich stärkt'},
 {key:'react_gross',sfx:'react',arg:3,n:'Reaktion, groß',gruppe:'Reaktionen',wo:'Reaktion ab Kette 2 (fällt sonst auf „Reaktion“ zurück)'},
 {key:'disc',sfx:'disc',n:'Neue Reaktion entdeckt',gruppe:'Reaktionen',wo:'Kurz nach einer Reaktion, die du zum ersten Mal auslöst'},
 {key:'hoch',sfx:'hoch',n:'Hochreaktion',gruppe:'Reaktionen',wo:'Hochreaktion mit Zwischentitel'},
 // Bedienung
 {key:'card',sfx:'card',n:'Karte',gruppe:'Bedienung',wo:'Karte gespielt, gezogen, Belohnung aufgedeckt'},
 {key:'click',sfx:'click',n:'Klick',gruppe:'Bedienung',wo:'Auswählen, Ziel wählen, Rucksack'},
 {key:'pick',sfx:'pick',n:'Aufnehmen',gruppe:'Bedienung',wo:'Etwas genommen'},
 {key:'bad',sfx:'bad',n:'Geht nicht',gruppe:'Bedienung',wo:'Keine Energie, Fehler'},
 {key:'forge',sfx:'forge',n:'Werkstatt',gruppe:'Bedienung',wo:'Item in der Werkstatt verbessert'},
 // Welt
 {key:'glocke',sfx:'glocke',n:'Glockenschlag',gruppe:'Welt',wo:'Kniff „takt“ mit Glocke (Glockengießerei)'},
 {key:'herz',sfx:'herz',n:'Herzschlag',gruppe:'Welt',wo:'Kniff „takt“ (Walkathedrale)'},
 {key:'rumpeln',sfx:'rumpeln',n:'Einsturz hinter dem Nebel',gruppe:'Welt',wo:'Peilkarte: ein Gang stürzt ein, nur zu hören'},
 {key:'nebel',sfx:'nebel',n:'Nebel hebt sich',gruppe:'Welt',wo:'Peilkarte: das Wandbild hebt den Nebel'},
 {key:'schreck',sfx:'schreck',n:'Jumpscare',gruppe:'Welt',wo:'Der Schreck zwischendurch'}
];
// Welche Aufnahme gehört zu welchem Aufruf (Name + Argument)? Varianten fallen auf die Grundfassung zurück.
function mundSchluessel(name,arg){
 if(name==='hit')return (arg||0)>=3?['hit_schwer','hit']:['hit'];
 if(name==='react')return (arg||0)>=2?['react_gross','react']:['react'];
 return [name];}

const Mund=(()=>{
 const DB='saltmoor-mund',VER=1,OPT_KEY='saltmoor.mund.v1';
 const STD={aktiv:true,fehlt:'original',musikAus:false,streuung:.03};
 let opt=null;
 function optionen(){if(opt)return opt;try{opt=Object.assign({},STD,JSON.parse(localStorage.getItem(OPT_KEY)||'{}'));}catch(e){opt=Object.assign({},STD);}return opt;}
 function setze(k,v){optionen()[k]=v;try{localStorage.setItem(OPT_KEY,JSON.stringify(opt));}catch(e){}}

 // --- Ablage (IndexedDB): takes = {id, key, sr, pcm (Float32Array), dauer, zeit, pegel (dB)}; wahl = {key, id} ---
 let dbP=null;
 function db(){if(dbP)return dbP;dbP=new Promise((ok,fail)=>{const r=indexedDB.open(DB,VER);
  r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('takes')){const s=d.createObjectStore('takes',{keyPath:'id',autoIncrement:true});s.createIndex('key','key');}
   if(!d.objectStoreNames.contains('wahl'))d.createObjectStore('wahl',{keyPath:'key'});
   if(!d.objectStoreNames.contains('meta'))d.createObjectStore('meta',{keyPath:'k'});};
  r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error);});return dbP;}
 const req=r=>new Promise((ok,fail)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>fail(r.error);});
 async function store(name,mode='readonly'){return (await db()).transaction(name,mode).objectStore(name);}
 const ablage={
  async alleTakes(){return req((await store('takes')).getAll());},
  async take(id){return req((await store('takes')).get(id));},
  async neuerTake(t){const id=await req((await store('takes','readwrite')).add(t));await ablage.waehle(t.key,id);return id;},
  async aendere(t){return req((await store('takes','readwrite')).put(t));},
  async loesche(id){const t=await ablage.take(id);await req((await store('takes','readwrite')).delete(id));
   if(t){const w=await ablage.wahl();if(w[t.key]===id){const rest=(await ablage.alleTakes()).filter(x=>x.key===t.key).sort((a,b)=>b.zeit-a.zeit);
    if(rest[0])await ablage.waehle(t.key,rest[0].id);else await req((await store('wahl','readwrite')).delete(t.key));}}},
  async wahl(){const l=await req((await store('wahl')).getAll());const m={};l.forEach(w=>m[w.key]=w.id);return m;},
  async waehle(key,id){return req((await store('wahl','readwrite')).put({key,id}));},
  async meta(k){const r=await req((await store('meta')).get(k));return r?r.v:undefined;},
  async setMeta(k,v){return req((await store('meta','readwrite')).put({k,v}));}
 };

 // --- Abspielen über den SFX-Bus aus sfx.js (gleicher Hall, gleicher Limiter, Effekt-Lautstärke aus den Einstellungen) ---
 const bufCache=new Map(); // take-id -> AudioBuffer
 function puffer(t){if(!AC)return null;let b=bufCache.get(t.id);if(b&&b.sampleRate===t.sr)return b;
  b=AC.createBuffer(1,t.pcm.length,t.sr);b.copyToChannel(t.pcm instanceof Float32Array?t.pcm:new Float32Array(t.pcm),0);bufCache.set(t.id,b);return b;}
 // Eine Aufnahme enthält Luft davor und danach. Benutzt wird der Ausschnitt start … start+laenge (Sekunden),
 // mit kurzem Ein- und Ausblenden. Alte Aufnahmen ohne start/laenge: alles.
 const FADE_EIN=.004,FADE_AUS=.03;
 function fenster(t){const n=t.pcm.length/t.sr,st=Math.max(0,Math.min(n,t.start||0));return {st,len:Math.max(.01,Math.min(n-st,t.laenge||n-st))};}
 function spiele(t,o={}){au();if(!AC||!t)return null;if(AC.state==='suspended')AC.resume();
  const s=AC.createBufferSource();s.buffer=puffer(t);const st=o.streuung??0;if(st)s.playbackRate.value=1+(Math.random()*2-1)*st;
  const {st:a,len}=fenster(t),g=AC.createGain(),n=AC.currentTime+(o.wann||0),v=Math.pow(10,(t.pegel||0)/20),dur=len/s.playbackRate.value;
  g.gain.setValueAtTime(0,n);g.gain.linearRampToValueAtTime(v,n+FADE_EIN);g.gain.setValueAtTime(v,n+Math.max(FADE_EIN,dur-FADE_AUS));g.gain.linearRampToValueAtTime(0,n+dur);
  s.connect(g).connect(SFXB);s.start(n,a,len+.01);return s;}
 // Der benutzte Ausschnitt als eigene Samples (für WAV-Dateien), Pegel eingerechnet
 function ausschnitt(t){const {st,len}=fenster(t),a=Math.round(st*t.sr),n=Math.round(len*t.sr),y=new Float32Array(n),v=Math.pow(10,(t.pegel||0)/20);
  const fi=Math.round(FADE_EIN*t.sr),fo=Math.round(FADE_AUS*t.sr);
  for(let i=0;i<n;i++){let g=v;if(i<fi)g*=i/fi;if(i>n-fo)g*=(n-i)/fo;y[i]=(t.pcm[a+i]||0)*g;}return y;}

 // --- Im Spiel: sfx-Funktionen umhüllen ---
 let geladen={},original=null; // key -> take
 // Eingebaute Aufnahmen: audio/mund/<key>.wav (aus dem Studio exportiert, liegen im Repo). Aufnahmen im Browser (IndexedDB) gehen vor.
 const DATEIEN='audio/mund/';
 function leseWav(buf){const v=new DataView(buf);if(v.getUint32(0,false)!==0x52494646)return null;
  let o=12,sr=44100,ch=1,bits=16,fmt=1,data=null;
  while(o+8<=v.byteLength){const id=String.fromCharCode(v.getUint8(o),v.getUint8(o+1),v.getUint8(o+2),v.getUint8(o+3)),n=v.getUint32(o+4,true);
   if(id==='fmt '){fmt=v.getUint16(o+8,true);ch=v.getUint16(o+10,true);sr=v.getUint32(o+12,true);bits=v.getUint16(o+22,true);}
   if(id==='data'){data={a:o+8,n:Math.min(n,v.byteLength-o-8)};break;}o+=8+n+(n&1);}
  if(!data)return null;const bps=bits/8,fr=Math.floor(data.n/(bps*ch)),pcm=new Float32Array(fr);
  for(let i=0;i<fr;i++){let s=0;for(let c=0;c<ch;c++){const p=data.a+(i*ch+c)*bps;
    s+=fmt===3&&bits===32?v.getFloat32(p,true):bits===16?v.getInt16(p,true)/32768:bits===24?((v.getUint8(p)|v.getUint8(p+1)<<8|v.getInt8(p+2)<<16)/8388608):bits===32?v.getInt32(p,true)/2147483648:(v.getUint8(p)-128)/128;}
   pcm[i]=s/ch;}
  return {sr,pcm};}
 async function ladeDateien(){const m={};
  await Promise.all(MUND_KATALOG.map(async e=>{try{const r=await fetch(DATEIEN+e.key+'.wav');if(!r.ok)return;const w=leseWav(await r.arrayBuffer());
   if(w)m[e.key]={id:'datei:'+e.key,key:e.key,sr:w.sr,pcm:w.pcm,dauer:w.pcm.length/w.sr,pegel:0,datei:true};}catch(x){}}));
  return m;}
 async function ladeGewaehlte(){const m=await ladeDateien();
  try{const w=await ablage.wahl();for(const k in w){const t=await ablage.take(w[k]);if(t)m[k]=t;}}catch(e){console.warn('Mund-Modus: Browser-Aufnahmen nicht gelesen',e);}
  geladen=m;return m;}
 function installiere(){
  if(typeof sfx==='undefined')return;
  const orig={};
  Object.keys(sfx).forEach(name=>{if(typeof sfx[name]!=='function')return;orig[name]=sfx[name];
   sfx[name]=function(arg){const o=optionen();
    if(o.aktiv){for(const k of mundSchluessel(name,arg)){const t=geladen[k];if(t){spiele(t,{streuung:o.streuung});return;}}
     if(o.fehlt==='stumm')return;}
    return orig[name].apply(this,arguments);};});
  original=orig;
  if(optionen().aktiv){ladeGewaehlte().then(m=>zeigeMarke(Object.keys(m).length)).catch(e=>console.warn('Mund-Modus: Aufnahmen nicht geladen',e));
   if(optionen().musikAus&&typeof Music!=='undefined'&&Music.volume){const v=Music.volume;Music.volume=()=>v.call(Music,0);v.call(Music,0);}}
 }
 // Kleine Marke unten rechts, damit man sieht, dass der Mund-Modus läuft
 function zeigeMarke(n){const go=()=>{const d=document.createElement('div');d.id='mundMarke';
   d.textContent=`MUND-MODUS · ${n}/${MUND_KATALOG.length}`;d.title='Eigene Aufnahmen statt der Soundeffekte (Studio: studio.html, aus: ?mund=0)';
   d.style.cssText='position:fixed;right:8px;bottom:6px;z-index:9999;font:11px/1.2 monospace;letter-spacing:.08em;color:#e8c070;background:rgba(10,8,6,.72);border:1px solid #6a5020;padding:3px 7px;pointer-events:none;opacity:.8';
   document.body.appendChild(d);};document.body?go():addEventListener('DOMContentLoaded',go);}

 // Spiel-Seite: ?mund=1 / ?mund=0 setzt den Schalter, dann umhüllen. Das Studio setzt window.MUND_STUDIO und umhüllt nicht.
 if(!window.MUND_STUDIO){try{const q=new URLSearchParams(location.search).get('mund');if(q==='1')setze('aktiv',true);if(q==='0')setze('aktiv',false);}catch(e){}
  installiere();}

 return {optionen,setze,ablage,spiele,ausschnitt,fenster,ladeGewaehlte,installiere,KATALOG:MUND_KATALOG,get original(){return original;}};
})();
