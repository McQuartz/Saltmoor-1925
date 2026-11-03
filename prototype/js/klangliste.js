// Klangliste: zeigt aus data/audio.json, welche Audiodateien wir selbst aufnehmen müssen.
// Pro Datei: Name, Länge, Tonart, Tempo, Vibe, Zuordnung. "Anhören" spielt die prozedurale Fassung aus music.js / sfx.js.
// Erledigt-Haken liegen nur im Browser (localStorage).
const $=id=>document.getElementById(id);
const BPM=80,BAR=4*60/BPM; // Sekunden pro Takt
const NOTE_NAMES=['C','Es','Fis','A'];
const STORE='saltmoor.klangliste.v1';
let DATA=null,done={},F={gruppe:'alle',biom:'alle',offen:false,prio:0};
try{done=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(e){done={};}
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(done));}catch(e){}};
const de=n=>n.toLocaleString('de-DE',{minimumFractionDigits:n%1?1:0,maximumFractionDigits:2});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

// Sampler-Noten: jede kleine Terz zwischen zwei Noten, z. B. "C4 bis C6"
function noteList(range){const m=range.match(/([A-Za-z]+)(\d)\s*bis\s*([A-Za-z]+)(\d)/);if(!m)return [];
 const idx=n=>NOTE_NAMES.indexOf(n),a=idx(m[1])+4*+m[2],b=idx(m[3])+4*+m[4],out=[];
 for(let i=a;i<=b;i++)out.push(NOTE_NAMES[i%4]+Math.floor(i/4));return out;}

// Alle Dateien als flache Liste mit Gruppe, Datei-Namen und Länge
function files(){
 const L=[];
 DATA.biome.forEach(b=>DATA.proBiom.forEach(t=>{
  const len=t.takte?t.takte*BAR:t.sek;
  t.var.forEach(v=>L.push({key:`${b.id}_${t.id}_${v}`,gruppe:'musik',biom:b.id,b,t,v,
   datei:`${b.id}_${t.id}${t.var.length>1?'_'+v:''}.wav`,n:t.n+(t.var.length>1?' · '+v:''),art:t.art,
   laenge:t.takte?`${t.takte} Takte · ${de(len)} s`:`${de(len)} s`,ton:`${b.key} · ${v==='gekippt'?b.dark:b.chords}`,hint:t.tonal,
   vibe:(t.vv&&t.vv[v])||t.vibe,prio:t.prio,probe:t.probe&&b.labor?Object.assign({},t.probe,{biome:b.id,dark:v==='gekippt',drive:v==='dicht'||v==='treibend'}):null,anz:1}));
 }));
 DATA.assets.forEach(a=>{
  if(a.art==='Sampler'){const ns=noteList(a.noten);
   L.push({key:a.id,gruppe:a.gruppe,a,datei:`${a.id}_<note>.wav`,n:a.n,art:'Sampler',fuer:a.fuer,
    laenge:`${ns.length} Noten à ${de(a.sek)} s`,ton:`${a.noten}: ${ns.join(', ')}`,hint:'Einzelnoten, passt in jede Tonart',vibe:a.vibe,prio:a.prio,probe:a.probe,anz:ns.length,noten:ns});}
  else L.push({key:a.id,gruppe:a.gruppe,a,datei:`${a.id}${a.anz>1?'_1 … _'+a.anz:''}.wav`,n:a.n,art:a.art,fuer:a.fuer,
    laenge:`${de(a.sek)} s${a.anz>1?' · '+a.anz+' Varianten':''}`,ton:'untonal',hint:'',vibe:a.vibe,prio:a.prio,probe:a.probe,anz:a.anz||1});
 });
 return L;
}
const GRUPPEN={alle:'Alle',musik:'Musik pro Biom',rolle:'Rollen-Instrumente',gegner:'Gegnerstimmen',instrument:'Weitere Instrumente',sfx:'Effekte'};

function pass(f){if(F.gruppe!=='alle'&&f.gruppe!==F.gruppe)return false;if(F.biom!=='alle'&&f.gruppe==='musik'&&f.biom!==F.biom)return false;
 if(F.offen&&done[f.key])return false;if(F.prio&&f.prio>F.prio)return false;return true;}

function row(f){
 const pr=f.probe?`<button class="sm probe${playing===f.key?' on':''}" data-k="${esc(f.key)}">▶ ANHÖREN</button>`:`<span class="nop">keine Probe</span>`;
 return `<div class="row${done[f.key]?' done':''}" data-k="${esc(f.key)}">
  <label class="chk"><input type="checkbox" data-k="${esc(f.key)}" ${done[f.key]?'checked':''} aria-label="erledigt"></label>
  <div class="main"><div class="nm">${esc(f.n)} <span class="prio p${f.prio}">PRIO ${f.prio}</span> <span class="art">${esc(f.art)}</span></div>
   <code>${esc(f.datei)}</code>
   <div class="meta"><span>${esc(f.laenge)}</span>${f.gruppe==='musik'?`<span>${BPM} BPM</span>`:''}<span>${esc(f.ton)}</span></div>
   ${f.hint?`<div class="hint2">${esc(f.hint)}</div>`:''}
   <div class="vibe">${esc(f.vibe)}</div></div>
  <div class="act">${pr}</div></div>`;
}
function render(){
 const all=files(),vis=all.filter(pass);
 const nFiles=all.reduce((s,f)=>s+f.anz,0),nDone=all.filter(f=>done[f.key]).reduce((s,f)=>s+f.anz,0),nP1=all.filter(f=>f.prio===1).reduce((s,f)=>s+f.anz,0);
 $('sum').innerHTML=`<b>${nFiles}</b> Dateien insgesamt · <b>${nP1}</b> davon Prio 1 · <b>${nDone}</b> erledigt`;
 $('bar').style.width=(nFiles?nDone/nFiles*100:0)+'%';
 let h='';
 const groups=[...new Set(vis.map(f=>f.gruppe==='musik'?'musik:'+f.biom:f.gruppe))];
 groups.forEach(g=>{
  const L=vis.filter(f=>(f.gruppe==='musik'?'musik:'+f.biom:f.gruppe)===g);
  if(g.startsWith('musik:')){const b=L[0].b;
   h+=`<section class="grp"><h2>MUSIK · ${esc(b.n.toUpperCase())}${b.labor?'':' <small>noch nicht im Labor</small>'}</h2>
    <div class="bhead"><span>${esc(b.key)}</span><span>${BPM} BPM, 4/4</span><span>Akkorde: ${esc(b.chords)}</span><span>Gekippt: ${esc(b.dark)}</span></div>
    <p class="bvibe">${esc(b.vibe)}</p>`;}
  else h+=`<section class="grp"><h2>${esc(GRUPPEN[g].toUpperCase())}</h2>`;
  // Rollen/Gegner: nach "für" beschriften
  L.forEach(f=>{if(f.fuer)h+=`<div class="fuer">${esc(f.fuer)}</div>`;h+=row(f);});
  h+='</section>';
 });
 $('list').innerHTML=h||'<p class="hint">Nichts passt zum Filter.</p>';
}

// Anhören
let playing=null;
function stopProbe(){if(typeof Music!=='undefined'&&Music.running){Music.solo(null);Music.stop();}playing=null;$('bStop').hidden=true;
 document.querySelectorAll('.probe.on').forEach(b=>b.classList.remove('on'));}
function probe(f,btn){
 const p=f.probe;au();if(AC&&AC.state==='suspended')AC.resume();
 if(p.sfx){sfx[p.sfx](p.arg);return;}
 if(playing===f.key){stopProbe();return;}
 document.querySelectorAll('.probe.on').forEach(b=>b.classList.remove('on'));
 Music.start();Music.solo(p);playing=f.key;btn.classList.add('on');$('bStop').hidden=false;
 $('now').textContent='Läuft: '+f.n+(f.b?' ('+f.b.n+')':'')+'. Wechsel kommt auf der nächsten Taktgrenze.';
}

// Text zum Weitergeben
function asText(){
 const out=['SALTMOOR 1925 · KLANGLISTE','',...DATA.regeln.map(r=>'- '+r),''];
 files().forEach(f=>{out.push(`[${done[f.key]?'x':' '}] ${f.datei} · ${f.n}${f.fuer?' ('+f.fuer+')':''} · ${f.laenge}${f.gruppe==='musik'?' · '+BPM+' BPM':''} · ${f.ton} · Prio ${f.prio}`);out.push('    '+f.vibe);});
 return out.join('\n');
}

async function init(){
 try{const r=await fetch('data/audio.json',{cache:'no-store'});DATA=await r.json();}catch(e){$('list').innerHTML='<p class="hint">data/audio.json konnte nicht geladen werden. Seite über einen lokalen Server öffnen (start.command / start.bat).</p>';return;}
 $('regeln').innerHTML=DATA.regeln.map(r=>`<li>${esc(r)}</li>`).join('');
 Object.entries(GRUPPEN).forEach(([k,n])=>$('fG').add(new Option(n,k)));
 $('fB').add(new Option('Alle Biome','alle'));DATA.biome.forEach(b=>$('fB').add(new Option(b.n,b.id)));
 $('fG').onchange=e=>{F.gruppe=e.target.value;render();};$('fB').onchange=e=>{F.biom=e.target.value;render();};
 $('fO').onchange=e=>{F.offen=e.target.checked;render();};$('fP').onchange=e=>{F.prio=+e.target.value;render();};
 $('list').addEventListener('change',e=>{const k=e.target.dataset.k;if(!k)return;if(e.target.checked)done[k]=1;else delete done[k];save();render();});
 $('list').addEventListener('click',e=>{const b=e.target.closest('.probe');if(!b)return;const f=files().find(x=>x.key===b.dataset.k);if(f)probe(f,b);});
 $('bStop').onclick=()=>{stopProbe();$('now').textContent='';};
 $('bCopy').onclick=()=>{const t=asText();const ok=()=>{$('bCopy').textContent='KOPIERT';setTimeout(()=>$('bCopy').textContent='ALS TEXT KOPIEREN',1500);};
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,()=>{$('txt').hidden=false;$('txt').value=t;$('txt').select();});else{$('txt').hidden=false;$('txt').value=t;$('txt').select();}};
 render();
}
init();
