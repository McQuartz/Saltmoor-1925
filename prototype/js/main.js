// Startpunkt: Daten laden, Bühne und Oberfläche aufbauen, Zeichenschleife starten.
// Testhilfen über die Adresse:
//   ?seed=N        fester Seed für den nächsten Run
//   ?job=fischer   direkt mit dieser Figur starten (überspringt Titel und Figurwahl)
//   ?dev=1         Dev-Modus an (Taste D schaltet um)
//   ?bot=50&seed=1 Autospieler: 50 Runs ab Seed 1, schnell, Tabelle am Ende
//   ?springe=fight|waechter|finale|kraemer|ereignis|rast|werkstatt|wandbild&akt=2  (mit ?job=) direkt zu einem Knoten
// Ganzzahlige Grundskalierung (--u, Pixel scharf), danach füllt #spiel das Fenster per transform (BU.s), ohne Scrollen.
// Die Höhe wird gemessen: ohne Leiste (Titel, Figurwahl) ist #spiel nur die Szene hoch und füllt das Fenster trotzdem.
function skala(){const W=innerWidth,H=innerHeight;const k=Math.max(1,Math.min(Math.floor(W/480),Math.floor(H/(270+92))))||1;BU.k=Math.max(2,k);document.documentElement.style.setProperty('--u',BU.k+'px');
 const sp=document.getElementById('spiel'),w=480*BU.k,h=sp.offsetHeight||362*BU.k;const s=Math.min(W/w,H/h);BU.s=s;sp.style.transform=`translate(${Math.round((W-w*s)/2)}px,${Math.round((H-h*s)/2)}px) scale(${s})`;}
(async()=>{
 try{await loadData();}catch(err){document.body.insertAdjacentHTML('afterbegin',`<div style="padding:20px;color:#ff8a7a;font:16px monospace">Daten konnten nicht geladen werden (${err.message}).<br>Bitte über einen lokalen Server öffnen: cd prototype && python3 -m http.server 8000</div>`);return;}
 skala();addEventListener('resize',()=>{skala();render();});new ResizeObserver(()=>skala()).observe(document.getElementById('spiel'));buehneInit();
 const q=new URLSearchParams(location.search);
 if(typeof Dev!=='undefined')Dev.init(q);
 if(q.get('bot')){Dev.botLauf(+q.get('bot'),+(q.get('seed')||1));}
 else if(q.get('job')){newRun(q.get('job'),q.get('seed')!=null?+q.get('seed'):neuerSeed(),{dev:!!q.get('springe')});if(q.get('springe'))Dev.springe(q.get('springe'),q.get('akt')!=null?+q.get('akt'):null);}
 render();requestAnimationFrame(frame);
})();
