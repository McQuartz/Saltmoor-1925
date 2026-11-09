// Dev-Modus: zeigt, was gerade passiert und WARUM. Hört nur am Bus zu und liest den Zustand, rechnet nichts selbst nach
// (Ausnahme: Vorschau über previewCard, dieselbe Rechnung wie beim Spielen). Ein- und ausschalten: Knopf DEV, Taste D, ?dev=1.
// Cheats markieren den Run als Dev-Run (zählt nicht fürs Tagebuch).
const Dev={an:false,tab:'jetzt',log:[],treffer:[],warum:'',warumT:0,filter:'',cheat:false,musikLog:[],
 init(q){try{this.an=q.get('dev')==='1'||localStorage.getItem('saltmoor.dev')==='1';}catch(e){}if(q.get('dev')==='0')this.an=false;
  document.getElementById('devBtn').onclick=()=>this.toggle();
  const el=document.createElement('div');el.id='dev';document.body.appendChild(el);this.el=el;
  el.addEventListener('click',e=>{const t=e.target.closest('[data-dtab]');if(t){this.tab=t.dataset.dtab;this.render();return;}const c=e.target.closest('[data-cheat]');if(c){this.cheatAus(c.dataset.cheat,c.dataset.arg);}});
  el.addEventListener('input',e=>{if(e.target.id==='devFilter'){this.filter=e.target.value;this.render();}});
  Bus.on('*',(n,p)=>this.hoer(n,p));
  if(typeof Music!=='undefined'&&Music.onEvent)Music.onEvent(ev=>{this.musikLog.unshift({t:Date.now(),...ev});this.musikLog.length=Math.min(this.musikLog.length,40);this.hoer('musik',{why:ev.why||ev.was,was:ev.was});});
  this.stil();this.show();},
 toggle(){this.an=!this.an;try{localStorage.setItem('saltmoor.dev',this.an?'1':'0');}catch(e){}this.show();render();},
 show(){this.el.style.display=this.an?'block':'none';document.body.classList.toggle('dev',this.an);document.getElementById('devBtn').style.color=this.an?'#7affc8':'';if(this.an)this.render();},
 kat(n){return /reaction|discover/.test(n)?'reaktion':/musik|einst/.test(n)?'musik':/run|weg|act|node|event|reward|kraemer|fragment|load|ende|finale|strand|game_over/.test(n)?'run':/unlock|meta/.test(n)?'meta':/stummfilm|jumpscare/.test(n)?'effekte':'kampf';},
 hoer(n,p){if(['changed','deal','click','pick','attack'].includes(n))return;const why=p&&p.why;const e={t:new Date().toLocaleTimeString(),n,why:why||'',kat:this.kat(n),d:this.kurz(p)};this.log.unshift(e);if(this.log.length>400)this.log.length=400;
  if(n==='damage_calc'||n==='player_hurt'||n==='player_blocked')this.treffer.unshift({n,why,...(p.parts?{parts:p.parts}:{})}),this.treffer.length=Math.min(this.treffer.length,10);
  if(why){this.warum=why;this.warumT=performance.now();}
  if(this.an&&!FAST)this.renderBald();},
 kurz(p){if(!p)return'';const o={};for(const k in p){if(k==='why')continue;const v=p[k];if(v&&typeof v==='object'){if(v.n)o[k]=v.n;else if(Array.isArray(v))o[k]=v.length>6?v.length+' Einträge':v.map(x=>x&&x.n||x).join(',');}else o[k]=v;}return JSON.stringify(o).slice(0,140);},
 _t:0,renderBald(){if(this._t)return;this._t=setTimeout(()=>{this._t=0;this.render();},120);},
 render(){if(!this.an||!this.el)return;const tabs=['jetzt','kampf','deck','run','tiefe','musik','log','cheats'];
  this.el.innerHTML=`<div class="dt">${tabs.map(t=>`<button data-dtab="${t}" class="${this.tab===t?'an':''}">${t.toUpperCase()}</button>`).join('')}</div><div class="db">${this['t_'+this.tab]()}</div>`;},
 // ----- Reiter Jetzt -----
 t_jetzt(){let h='';const f=S.phase==='fight';
  h+=`<h5>Letztes Warum</h5><div class="why">${esc(this.warum)||'–'}</div>`;
  if(f){h+=`<h5>Kette (Zug ${S.turnNo})</h5><div>${(S.chainLog||[]).filter(c=>c.turn===S.turnNo).map(c=>c.st.map(k=>gi(k,14)).join('')+' '+esc(c.n)).join(' → ')||'–'}</div>`;
   const hoch=HOCH.map(x=>`${x.n} ${(S.hochUsed||new Set()).has(x.n)?'benutzt':'frei'}`).join(' · ');h+=`<div class="dim">Hochreaktionen: ${hoch}</div>`;
   h+=`<h5>Offene Kombos auf der Hand</h5><table>${S.hand.map((c,i)=>{const rx=reactionsFor(S.last,c.st);const p=busy?null:previewCard(i,needsTarget(c)?S.target:null);
    const dm=p?p.foes.map((x,k)=>x.d||x.ab?`${S.enemies[k].n.split(' ').pop()} −${x.d}${x.ab?' (Block −'+x.ab+')':''}`:'').filter(Boolean).join(', '):'';
    return `<tr><td>${i+1}</td><td>${c.st.map(k=>gi(k,12)).join('')} ${esc(c.n)} (${cardCost(c)})</td><td>${rx.length?rx.map(r=>`<b class="${S.disc.has(r.n)?'':'un'}">${r.n}${S.disc.has(r.n)?'':' (unentdeckt)'}</b>`).join(', '):'<span class="dim">keine Reaktion</span>'}</td><td>${dm}${p&&p.block?` Block +${p.block}`:''}${p&&p.hp?` Leben ${p.hp>0?'+':''}${p.hp}`:''}</td></tr>`;}).join('')}</table>`;}
  h+=`<h5>Letzte Ereignisse</h5>${this.log.filter(e=>e.why).slice(0,8).map(e=>`<div class="le"><span class="dim">${e.t}</span> ${esc(e.why)}</div>`).join('')}`;return h;},
 // ----- Reiter Kampf -----
 t_kampf(){if(!S.enemies||!S.enemies.length)return'<div class="dim">Kein Kampf.</div>';let h='';
  h+=S.enemies.map(e=>`<div class="ge"><b>${esc(e.n)}</b> <span class="dim">${e.id}${e.sprite?' · '+e.sprite:''} · ${e.rang} · Reihe ${['hinten','mitte','vorne'][e.reihe]}</span><br>Leben ${e.hp}/${e.max} (Tiefe ${S.depth}: ×${(1+BAL.enemy_scaling.hp_per_depth*(S.depth-1)).toFixed(2)}, Angriff +${e.as}) · Block ${e.block} · Stärke ${e.str} · Brand ${e.burn} · Gift ${e.poison}${e.weak2?' · geschwächt':''}<br>Schwachstelle ${e.weak?gi(e.weak,12)+ST[e.weak].n:'–'}${e.besonders?` · Besonders: ${esc(JSON.stringify(e.besonders).slice(0,80))}`:''}<br>Muster: ${e.pat.map((p,k)=>`<span class="${k===e.pi%e.pat.length?'next':''}">${p.t} ${p.v}${p.h?'×'+p.h:''}</span>`).join(' → ')}</div>`).join('');
  h+=`<h5>Schadensrechnung (letzte 10)</h5>${this.treffer.map(t=>`<div class="le">${esc(t.why)}</div>`).join('')||'–'}`;
  h+=`<h5>Sets</h5>${roleState().filter(x=>x.have.length).map(x=>`<div>${x.r.n} ${x.have.length}/3 ${x.on?'<b>aktiv</b>':'fehlt: '+x.r.i.filter(i=>!x.have.includes(i)).map(i=>ITEMS[i].n).join(', ')}</div>`).join('')||'–'}`;
  if(S.phase==='fight')h+=`<h5>Stapel ${S.draw.length} · Hand ${S.hand.length} · Ablage ${S.discard.length} · verbraucht ${S.exhaust.length}</h5><div class="dim">Stapel: ${S.draw.map(c=>c.n).join(', ')}</div><div class="dim">Ablage: ${S.discard.map(c=>c.n).join(', ')}</div>`;return h;},
 // ----- Reiter Deck (Auftrag 2): Items, Kerben, Handgriffe, Stoffe, Kostenkurve -----
 t_deck(){if(!S.route)return'<div class="dim">Kein Run.</div>';const deck=deckListe();const kurve={};deck.forEach(c=>{const k=c.x?'X':c.opfer?'Opfer':Math.min(3,c.c);kurve[k]=(kurve[k]||0)+1;});
  const b=buildArchetyp();let h=`<div>${deck.length} Karten · Build: <b class="next">${b.n}</b> <span class="dim">${Object.entries(b.werte).map(([k,v])=>k+' '+v.toFixed(1)).join(' · ')}</span></div>
  <div>Kosten: ${['0','1','2','3','X','Opfer'].map(k=>`${k}: ${kurve[k]||0}`).join(' · ')}</div>`;
  h+=besitz().map(({it,an})=>{const D=def(it);return `<div class="ge"><b>${esc(D.n)}</b> <span class="dim">${it.id} · ${rarOf(D)} · ${an?'angelegt':'Rucksack'} · Kerben ${hgVon(it).length}/${kerbenVon(it)}</span> ${D.st.map(k=>gi(k,12)).join('')}${D.eigen?`<br><span class="un">Eigenschaft ${esc(JSON.stringify(D.eigen))}</span>`:''}<br>${kartenVon(it).map(c=>`${c.hg?'✋':''}${esc(c.n)}(${c.c}${c.schliff?'◇':''})`).join(', ')}</div>`;}).join('');
  return h;},
 // ----- Reiter Run -----
 t_run(){if(!S.route)return'<div class="dim">Kein Run.</div>';const M=Meta.get();let h=`<div>Seed <b class="sel">${S.seed}</b> <button data-cheat="seedcopy">kopieren</button>${S.dev?' <b class="un">Dev-Run</b>':''}</div>
  <div>Figur ${esc(S.jobN)} · ${RUN.akte[S.akt]?.n||''} · ${esc(biom().n)} · Ebene ${S.ebene+1} · Tiefe ${S.depth} · Gold ${S.gold} · Stufe ${S.stufe||0}</div>
  <h5>Weg und Biom-Wahl</h5><div>${RUN.akte.map((a,i)=>S.route[i]?`<span class="${i===S.akt?'next':''}">${BIOMES[S.route[i]].kurz}</span>`:`<span class="dim">${(S.angebote[i]||a.biome.filter(b=>BIOMES[b])).map(b=>BIOMES[b].kurz).join(' / ')}</span>`).join(' → ')}</div><div class="dim">${(S.routeWhy||[]).map(esc).join('<br>')}</div>`;
  h+=`<h5>Nächste Weg-Wahlen (Vorschau per Seed)</h5>`;const kS=S;try{const sim=structuredClone(S);S=sim;Bus.muted=true;for(let k=0;k<3;k++){if(S.ebene+k>=RUN.akte[S.akt].ebenen.length)break;const save0=S.ebene;S.ebene=save0+k;genWeg();h+=`<div>Ebene ${S.ebene+1}: ${S.weg.map(o=>RUN.knoten[o.art].n+(o.foes?' ['+o.foes.join(',')+']':'')).join(' | ')}</div>`;S.ebene=save0;}}catch(e){h+='<div class="dim">–</div>';}finally{S=kS;Bus.muted=false;}
  h+=`<h5>Fundpool ${biom().kurz}</h5><div class="dim">${dropPool().map(id=>ITEMS[id].n).join(', ')}</div><div class="dim">Selten: ${rarePool().map(id=>ITEMS[id].n).join(', ')}</div><div class="dim">Gegner-Beute 20 % aus: ${biom().gegner.map(id=>FOES[id]&&FOES[id].beute).filter(Boolean).join(', ')||'–'}</div>`;
  h+=`<h5>Meta</h5><div>Fragmente ${M.fragmente.length}/${FRAGS.length} · Runs ${M.runs} · Siege ${M.siege} · beste Tiefe ${M.besteTiefe} · Stufe max ${M.maxStufe}</div><div class="dim">Freie Figuren: ${JOBS.filter(Meta.figurFrei).map(j=>j.n).join(', ')}</div><div class="dim">Freie Items: ${M.items.map(id=>ITEMS[id]?ITEMS[id].n:id).join(', ')||'–'}</div>`;return h;},
 // ----- Reiter Musik -----
 t_musik(){if(typeof Music==='undefined')return'–';const m=Music.state();let h=`<div>Szene ${m.scene} · Biom ${m.biome} · ${Math.round(m.bpm)} BPM · Akkord ${m.chord} ${m.dark?'<b class="un">gekippt</b>':''} · Takt ${m.bar??'–'} Schlag ${m.beat??'–'}</div>
  <div>Wucht ${(m.wucht||0).toFixed(2)} · Gefahr ${(m.gefahr||0).toFixed(2)} · Momentum ${(m.momentum||0).toFixed(2)}</div><div>Layer ${m.gate.map((g,i)=>`<span class="${g?'next':'dim'}">${i}${m.layerLevels?':'+(+m.layerLevels[i]).toFixed(1):''}</span>`).join(' ')}${m.drive?' · Drive':''}</div>
  <div>Stimmen ${m.foes.join(', ')||'–'} · Platz ${m.slot??'–'} · ${m.duel?'<b>Duell</b>':''} ${m.abgesang?'· Abgesang '+m.abgesang:''}</div><div>Stoff-Färbung ${m.stoff||'–'} · Spitze ${m.peak!=null?m.peak.toFixed(1)+' dBFS':'–'}</div>`;
  h+=`<canvas id="devKurve" width="320" height="60"></canvas>`;
  h+=`<div><button data-cheat="musikStumm">${Music.running?'Musik aus':'Musik an'}</button> ${Object.keys(Music.BIOME).map(b=>`<button data-cheat="musikBiom" data-arg="${b}">${b}</button>`).join(' ')}</div>`;
  h+=`<h5>Entscheidungen</h5>${this.musikLog.slice(0,12).map(e=>`<div class="le">${esc(e.was||'')} ${esc(e.why||'')}</div>`).join('')||'<div class="dim">noch nichts</div>'}`;
  setTimeout(()=>this.kurve(),0);return h;},
 kurve(){const c=document.getElementById('devKurve');if(!c||typeof Music==='undefined')return;this.mk=this.mk||[];const m=Music.state();this.mk.push([m.wucht||0,m.gefahr||0]);if(this.mk.length>320)this.mk.shift();const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,320,60);
  [['#7affc8',0],['#ff6a5a',1]].forEach(([col,k])=>{x.fillStyle=col;this.mk.forEach((v,i)=>x.fillRect(i,58-v[k]*56,1,1));});},
 // ----- Reiter Tiefe (Auftrag 3): Schalter der neuen Systeme, Erzwingen. Wächst mit jedem Meilenstein. -----
 t_tiefe(){const A=BAL.auftrag3||{};const N={regelbiegung:'Regelbiegung',hoeren:'Hören statt sehen',blick:'Sehen und gesehen werden',farbe:'Die Farbe',begegnungen:'Begegnungen',meta:'Metaebene',fehlzeit:'Fehlzeit',pause:'Pause',wuerze:'Würze'};
  let h=`<h5>Systeme (balance.json → auftrag3)</h5><div>${Object.keys(N).map(k=>`<button data-cheat="a3" data-arg="${k}" class="${A[k]?'an':''}">${N[k]} ${A[k]?'an':'aus'}</button>`).join(' ')}</div><div class="dim">Aus heißt: das Spiel läuft genau wie ohne das System. Gilt bis zum Neuladen; dauerhaft über ?a3aus=farbe,blick</div>`;
  (this.tiefeTeile||[]).forEach(f=>{h+=f();});return h;},
 // Meilensteine hängen hier ihre Abschnitte an (Funktion, die HTML liefert)
 tiefeTeil(f){(this.tiefeTeile=this.tiefeTeile||[]).push(f);},
 // ----- Reiter Log -----
 t_log(){const f=this.filter;return `<div><input id="devFilter" placeholder="Filter (kampf, reaktion, musik, run, meta, effekte oder Text)" value="${esc(f)}"> <button data-cheat="logExport">Export</button></div>
  ${this.log.filter(e=>!f||e.kat===f||(e.n+e.why+e.d).toLowerCase().includes(f.toLowerCase())).slice(0,120).map(e=>`<div class="le"><span class="dim">${e.t}</span> <b>${e.n}</b> <span class="dim">[${e.kat}]</span> ${esc(e.why)} <span class="dim">${esc(e.d)}</span></div>`).join('')}`;},
 // ----- Reiter Cheats -----
 t_cheats(){const knoten=['kampf','kampf_schwer','waechter','finale','rast','werkstatt','kraemer','ereignis','wandbild','fundstelle'];
  return `<h5>Springen</h5><div>${RUN.akte.map((a,i)=>`<button data-cheat="akt" data-arg="${i}">${a.n}</button>`).join(' ')}</div>
  <div>Biom erzwingen: ${Object.keys(BIOMES).map(b=>`<button data-cheat="gabel" data-arg="${b}">${BIOMES[b].kurz}</button>`).join(' ')}</div>
  <div>Knoten: ${knoten.map(k=>`<button data-cheat="knoten" data-arg="${k}">${RUN.knoten[k].n}</button>`).join(' ')}</div>
  <h5>Kampf</h5><div>Gegner: ${Object.keys(FOES).map(id=>`<button data-cheat="spawn" data-arg="${id}">${id}</button>`).join(' ')}</div>
  <div><button data-cheat="heal">Leben voll</button> <button data-cheat="energie">Energie +1</button> <button data-cheat="gold">+100 Gold</button> <button data-cheat="sieg">Kampf gewinnen</button> <button data-cheat="tod">Sterben</button></div>
  <div>Item: <select id="devItem">${Object.keys(ITEMS).filter(k=>!k.startsWith('m')).map(k=>`<option value="${k}">${ITEMS[k].n}</option>`).join('')}</select> <button data-cheat="item">geben</button> <button data-cheat="karte">Karte auf die Hand</button></div>
  <h5>Meta</h5><div><button data-cheat="alleRx">Alle Reaktionen entdecken</button> <button data-cheat="metaReset">Meta zurücksetzen</button> <button data-cheat="alles">Alles freischalten</button> <button data-cheat="runReset">Gespeicherten Run löschen</button></div>
  <h5>Effekte</h5><div><button data-cheat="stumm">Stummfilm auslösen</button> <button data-cheat="scare">Jumpscare auslösen</button></div>
  <h5>Autospieler</h5><div><button data-cheat="botZug">Einen Schritt</button> <button data-cheat="botSichtbar">Sichtbar spielen</button> <button data-cheat="botStop">Stopp</button> Tempo <input type="range" min="50" max="1200" value="${this.tempo||400}" oninput="Dev.tempo=+this.value"></div>
  <div><button data-cheat="bot" data-arg="20">20 Runs schnell</button> <button data-cheat="bot" data-arg="50">50 Runs schnell</button></div><div id="botErg">${this.botErg||''}</div>`;},
 markDev(){if(S.route&&!S.dev){S.dev=true;Bus.emit('dev_run',{why:'Cheat benutzt: dieser Run zählt nicht fürs Tagebuch'});}},
 cheatAus(k,a){const sel=document.getElementById('devItem');
  switch(k){
   case'a3':{BAL.auftrag3=BAL.auftrag3||{};BAL.auftrag3[a]=!BAL.auftrag3[a];this.markDev();Bus.emit('a3_schalter',{k:a,an:BAL.auftrag3[a],why:`Auftrag-3-System ${a} ${BAL.auftrag3[a]?'an':'aus'}`});render();break;}
   // M5: Regelbiegung. biegNur: nur diese Biegung gilt (wie kern-vergleich.js), biegBeide: Falsche Winkel mit letzter und vorletzter Karte, biegFeld: Biom der Biegung im aktuellen Akt erzwingen
   case'biegNur':{BAL.auftrag3.biegung_nur=BAL.auftrag3.biegung_nur===a?null:a;this.markDev();Bus.emit('a3_schalter',{k:'biegung_nur',an:!!BAL.auftrag3.biegung_nur,why:BAL.auftrag3.biegung_nur?`Nur die Biegung ${a} gilt`:'Alle Biegungen gelten'});render();break;}
   // M9: Run-Zettel ändern (Begegnung an/aus, höchstens zwei), Zeichen geben, Asche geben, Spuren-Stufe setzen
   case'zettel':{const z=S.zettel=S.zettel||{begegnungen:[],wuerze:[]};const l=z.begegnungen;const i=l.indexOf(a);if(i>=0)l.splice(i,1);else{l.push(a);if(l.length>2)l.shift();}this.markDev();render();break;}
   case'zeichenGeben':{if(!(S.lose||[]).includes('zeichen')){(S.lose=S.lose||[]).push('zeichen');S.zeichenGegeben=true;}this.markDev();render();break;}
   case'ascheGeben':{const id=Object.keys(FOES).find(k=>FOES[k].asche&&(biom().gegner||[]).includes(k))||Object.keys(FOES).find(k=>FOES[k].asche);if(id&&(S.asche||[]).length<3)(S.asche=S.asche||[]).push({id,n:FOES[id].n,akt:S.akt});this.markDev();render();break;}
   case'spurenStufe':{const v=typeof Spuren!=='undefined'&&Spuren.knoten();if(v)v.spuren=+a;this.markDev();render();break;}
   case'biegBeide':{BAL.auftrag3.falsche_winkel_beide=!BAL.auftrag3.falsche_winkel_beide;this.markDev();render();break;}
   case'seedcopy':navigator.clipboard&&navigator.clipboard.writeText(String(S.seed));break;
   case'akt':this.springe('weg',+a);break;
   case'gabel':{const b=a;if(!S.route)return;this.markDev();const i=BIOMES[b].akt;S.route[i]=b;S.routeWhy=[...(S.routeWhy||[]),`Gabelung erzwungen: ${b}`];if(S.akt===i){BU.key='';genWeg();}render();break;}
   case'knoten':this.springe(a);break;
   case'spawn':if(S.phase==='fight'){this.markDev();const e=mkEnemy(a);e.x=.5+(Math.random()-.5)*.6;e.reihe=1;S.enemies.push(e);ladeSprite(e.sprite);render();}else{this.springe('kampf');S.enemies=[mkEnemy(a)];aufstellen(S.enemies);render();}break;
   case'heal':this.markDev();S.hp=maxHp();render();break;case'energie':this.markDev();S.energy++;render();break;case'gold':this.markDev();S.gold+=100;render();break;
   case'sieg':this.markDev();S.enemies.forEach(e=>{e.hp=0;});checkVictory(100);break;case'tod':this.markDev();S.hp=0;runLost();break;
   case'item':this.markDev();giveItem(sel.value,'Cheat');render();break;
   case'karte':if(S.phase==='fight'){this.markDev();const D=ITEMS[sel.value];D.cards.forEach(c=>S.hand.push({...c,st:[...D.st],src:D.n,spr:D.spr,uid:0}));render();}break;
   case'alleRx':this.markDev();[VERST,...REACT,...HOCH].forEach(r=>S.disc&&S.disc.add(r.n));render();break;
   case'metaReset':Meta.reset();render();break;case'alles':Meta.allesFrei();render();break;case'runReset':clearSave();render();break;
   case'stumm':BU.lastStumm=-1e9;BU.stummKampf=null;stummfilm('Dev: zum Ansehen');break;case'scare':if(typeof jumpscare==='function')jumpscare();break;
   case'musikStumm':if(typeof Music!=='undefined'){if(Music.running)Music.stop();else{startAudio();Music.start();}}break;
   case'musikBiom':startAudio();Music.biome(a);break;
   case'logExport':{const t=this.log.map(e=>`${e.t}\t${e.n}\t${e.kat}\t${e.why}\t${e.d}`).join('\n');const b=new Blob([t],{type:'text/plain'});const u=URL.createObjectURL(b);const l=document.createElement('a');l.href=u;l.download='saltmoor-log.txt';l.click();break;}
   case'botZug':this.markDev();Bot.schritt();render();break;
   case'botSichtbar':this.markDev();this.botLaeuft=true;const go=()=>{if(!this.botLaeuft)return;if(!busy){if(!S.route){starteRun(JOBS[0].id);}else if(['strand','ende'].includes(S.phase)){this.botLaeuft=false;return;}else Bot.schritt();render();}setTimeout(go,this.tempo||400);};go();break;
   case'botStop':this.botLaeuft=false;break;
   case'bot':{const n=+a;const r=this.botLauf(n,(S.seed||1),true);break;}}
  this.render();},
 // Direkt zu einem Knoten (Dev-Run)
 springe(art,akt){if(!S.route)newRun(JOBS[0].id,neuerSeed(),{dev:true});S.dev=true;if(akt!=null){S.akt=akt;S.ebene=0;S.depth=akt*7;}
  for(let i=0;i<=S.akt;i++)if(!S.route[i])S.route[i]=(S.angebote[i]&&S.angebote[i][0])||RUN.akte[i].biome.find(b=>BIOMES[b]);
  if(art==='weg'){BU.key='';genWeg();return;}if(art==='fight')art='kampf';
  const b=biom();if(art==='waechter'||art==='finale'){if(art==='finale'){S.akt=4;S.ebene=RUN.akte[4].ebenen.length-1;S.depth=31;for(let i=0;i<=4;i++)if(!S.route[i])S.route[i]=RUN.akte[i].biome.find(b=>BIOMES[b]);}else S.ebene=RUN.akte[S.akt].ebenen.length-1;}
  const o={art,hint:'Dev',i:0};if(art.startsWith('kampf'))o.foes=rollFoes(art,R('dev'+Date.now()));if(art==='waechter')o.foes=[S.devWaechter||waechterWahl(BIOMES[S.route[S.akt]])];if(art==='finale')o.foes=[BIOMES[S.route[S.akt]].waechter];
  S.cur=o;if(S.depth<1)S.depth=1;BU.key='';enterNode(o);render();},
 // Autospieler, schnell. Tabelle als Ergebnis (auch für Playwright: window.BOT_ERGEBNIS)
 botLauf(n,s0,imPanel){const jobs=JOBS.map(j=>j.id);const out=[];const t0=performance.now();const keep=S;
  for(let i=0;i<n;i++){const r=Bot.spiele(jobs[i%jobs.length],s0+i,{});out.push(r);}
  S=keep;const siege=out.filter(r=>r.sieg).length;const tode={};out.filter(r=>!r.sieg).forEach(r=>{tode[r.biom]=(tode[r.biom]||0)+1;});
  const sum={runs:n,siege,rate:siege/n,tiefe:out.reduce((s,r)=>s+r.tiefe,0)/n,tode,fehler:out.filter(r=>r.fehler).length,ms:Math.round(performance.now()-t0)};window.BOT_ERGEBNIS={sum,out};
  const html=`<table class="bt"><tr><th>Seed</th><th>Figur</th><th>Ergebnis</th><th>Tiefe</th><th>Biom</th><th>Weg</th></tr>${out.map(r=>`<tr><td>${r.seed}</td><td>${r.job}</td><td>${r.sieg?'Sieg ('+r.ende+')':'Strand'}</td><td>${r.tiefe}</td><td>${r.biom}</td><td>${r.route}</td></tr>`).join('')}</table>
   <div>Gewinnrate ${Math.round(sum.rate*100)} % · Ø Tiefe ${sum.tiefe.toFixed(1)} · Niederlagen ${JSON.stringify(tode)} · Fehler ${sum.fehler} · ${sum.ms} ms</div>`;
  this.botErg=html;if(!imPanel){S={phase:'titel'};document.body.insertAdjacentHTML('beforeend',`<div id="botTab" style="position:fixed;inset:20px;overflow:auto;background:#000;border:1px solid #444;padding:10px;font:12px monospace;z-index:90;color:#cfc">${html}</div>`);}
  return sum;},
 // Einblendungen in der Szene (nur Dev)
 szene(g,t){if(!S.enemies||S.phase!=='fight')return;g.save();g.font='5px monospace';S.enemies.forEach(e=>{if(e.hp<=0)return;const b=enemyBox(e);const it=e.pat[e.pi%e.pat.length];g.fillStyle='rgba(0,0,0,.6)';g.fillRect(b.x-24,b.y+3,48,7);g.fillStyle='#7affc8';g.fillText(`${e.id} ${it.t}${it.v} ${['h','m','v'][e.reihe]}`,b.x-23,b.y+8);});
  if(this.warum&&performance.now()-this.warumT<4000){g.fillStyle='rgba(0,0,0,.7)';g.fillRect(100,0,280,8);g.fillStyle='#7affc8';g.fillText(this.warum.slice(0,90),102,6);}g.restore();},
 stil(){const s=document.createElement('style');s.textContent=`#dev{position:fixed;right:0;top:0;bottom:0;width:360px;background:#050807ee;border-left:1px solid #1e3a30;color:#b8d8c8;font:11px/1.35 ui-monospace,monospace;z-index:80;overflow:auto;display:none}
  #dev .dt{display:flex;flex-wrap:wrap;position:sticky;top:0;background:#050807}#dev .dt button{flex:1;background:#0a1210;border:1px solid #1e3a30;color:#7a9a8a;font:10px monospace;padding:5px 2px;cursor:pointer}#dev .dt button.an{color:#7affc8;border-color:#7affc8}
  #dev .db{padding:8px}#dev h5{margin:10px 0 3px;color:#7affc8;font-size:11px}#dev .why{color:#fff}#dev .dim{color:#5a7a6a}#dev .un{color:#c8a0ff}#dev .next{color:#ffd23f;font-weight:bold}#dev .sel{user-select:all}
  #dev table{border-collapse:collapse;width:100%}#dev td,#dev th{border-bottom:1px solid #12201a;padding:2px;vertical-align:top}#dev .le{border-bottom:1px solid #0e1814;padding:2px 0}
  #dev button{background:#0a1210;border:1px solid #2a4a3a;color:#b8d8c8;font:10px monospace;margin:1px;cursor:pointer}#dev input,#dev select{background:#000;color:#cfc;border:1px solid #2a4a3a;font:10px monospace}#dev .ge{border:1px solid #12201a;padding:4px;margin:3px 0}
  #dev .bt td{font-size:10px}body.dev .karte:after{content:attr(data-dev);}`;document.head.appendChild(s);}
};
// M5: Abschnitt Regelbiegung im Reiter TIEFE
Dev.tiefeTeil(()=>{if(typeof Bieg==='undefined')return'';const A=BAL.auftrag3||{};const k=S&&S.route?Bieg.kopf():null;
 return `<h5>Regelbiegung</h5><div>Jetzt: ${k?esc((k.jetzt||k.b).n)+(k.naechste?' · nächster Zug '+esc(k.naechste.n):'')+(k.zusatz?' · '+k.zusatz:''):'<span class="dim">keine (Akt I/II, Schalter aus oder anderes Biom)</span>'}</div>
 <div>Nur eine Biegung: ${BIEGUNGEN.map(b=>`<button data-cheat="biegNur" data-arg="${b.id}" class="${A.biegung_nur===b.id?'an':''}" title="${esc(b.t)}">${esc(b.n)} (${BIOMES[b.biom]?esc(BIOMES[b.biom].kurz):b.biom})</button>`).join(' ')}</div>
 <div><button data-cheat="biegBeide" class="${A.falsche_winkel_beide?'an':''}">Falsche Winkel: letzte und vorletzte ${A.falsche_winkel_beide?'an':'aus'}</button> <span class="dim">Biom erzwingen im Reiter Cheats → Biom erzwingen</span></div>`;});
// M9: Run-Zettel (im Spiel unsichtbar, hier sichtbar und änderbar) und Zustand der Begegnungen
Dev.tiefeTeil(()=>{if(typeof Zettel==='undefined'||!S||!S.route)return'';const z=S.zettel||{begegnungen:[],wuerze:[]};const N={diener:'Die Diener erheben sich',asche:'Asche',spuren:'Spuren',tiefe:'Die Tiefe erkennt dich'};
 const sv=typeof Spuren!=='undefined'?Spuren.knoten():null;const d=typeof Diener!=='undefined'?Diener.kandidat():null;
 return `<h5>Run-Zettel</h5><div>Begegnungen (höchstens zwei): ${BEGEGNUNGEN.map(k=>`<button data-cheat="zettel" data-arg="${k}" class="${z.begegnungen.includes(k)?'an':''}">${N[k]}</button>`).join(' ')}</div>
 <div>Würze: ${(z.wuerze||[]).length?z.wuerze.map(esc).join(', '):'<span class="dim">keine</span>'}</div>
 <div class="dim">Diener: ${d?esc(d.c.n)+' '+d.n+'-mal':'noch keine Karte mit 8 Einsätzen'}${S.dienerGenutzt?' · schon genutzt':''} · Spuren: ${sv?'Stufe '+(sv.spuren+1)+' von 4'+(sv.besucht?' (betreten)':''):'kein Knoten'} ${sv?[0,1,2,3].map(s=>`<button data-cheat="spurenStufe" data-arg="${s}">${s+1}</button>`).join(''):''}</div>
 <div class="dim">Asche: ${(S.asche||[]).map(a=>esc(a.n)).join(', ')||'keine'}${S.verbuendeter?' · Verbündeter '+esc(S.verbuendeter.n):''}${(S.ascheRueck||[]).length?' · kommt wieder: '+S.ascheRueck.map(x=>esc(FOES[x.id].n)+' in Akt '+(x.akt+1)).join(', '):''} <button data-cheat="ascheGeben">Asche geben</button></div>
 <div class="dim">Tiefe: ${S.tiefeZahl||0}-mal nachgegeben${(S.lose||[]).includes('zeichen')?' · Zeichen im Deck':''}${S.tiefeSeite?' · Seite gewechselt':''} <button data-cheat="zeichenGeben">Zeichen geben</button></div>`;});
