// Artboard: der ganze Spielinhalt auf einer Seite. Liest dieselben Daten und Zeichner wie das Spiel,
// schreibt selbst nichts. Neue Inhalte in data/*.json erscheinen hier automatisch.
// Ideen, die noch nicht im Spiel sind, kommen in data/ideas.json (Format in data/README.md).
const anims=[];// Zeichenfunktionen pro Bild: f(t)

// --- kleine Helfer ---
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const icon=(name,px=48,cls='ico')=>`<img class="${cls}" src="${spr(name)}" width="${px}" height="${px}" alt="">`;
const chips=list=>[...list].map(chip).join('')||'<span class="tag">kein Stoff</span>';
const tag=(t,cls='')=>`<span class="tag ${cls}">${t}</span>`;
const plural=(n,a,b)=>`${n} ${n===1?a:b}`;
// Pixelraster (12 Zeilen aus PAL-Buchstaben) als Bild, für Ideen ohne fertiges Sprite
function gridImg(rows){const[c,x]=cnv(rows[0].length,rows.length);rows.forEach((r,y)=>[...r].forEach((ch,i)=>{if(PAL[ch]){x.fillStyle=PAL[ch];x.fillRect(i,y,1,1);}}));return c.toDataURL();}

// Kartenzeile mit echten Kosten (Doppel-Stoff-Items kosten mehr)
function cardLine(c,st){const extra=st.length>1?BAL.forge.double_cost_extra:0;const cb=st[0]?ST[st[0]].c:'#6a5a3a';
 return `<div class="cardl" style="--cb:${cb}"><span class="cost">${c.c+extra}</span><b>${esc(c.n)}</b> ${esc(cardText(c))}</div>`;}

// Effekte (reactions.json / events.json) als Text
function fxText(f){const to=f.to==='all'?' an allen Gegnern':f.to==='target'?' am Ziel':'';const AN=a=>AREA_N[a]||a;
 switch(f.op){
  case'damage':return `${f.v} Schaden${to}`;
  case'status':return f.status==='weak'?`Geschwächt${to}`:`${f.status==='burn'?'Brand':'Gift'} ${f.v}${to}`;
  case'block':return `+${f.v} Block`;
  case'ward':return `+${f.v} Block im nächsten Zug`;
  case'heal':return `+${f.v} Leben`;
  case'energy':return `+${f.v} Energie`;
  case'break_block':return `Block zerbricht${to}`;
  case'poison_burst':return `Gift wird ${f.mult}× Schaden${to}`;
  case'poison_mult':return `Gift ×${f.mult}${to}`;
  case'give_random':return 'zufälliges Item';
  case'give_item':return `Item: ${ITEMS[f.item]?ITEMS[f.item].n:f.item}`;
  case'add_slot':return `+1 Slot ${AN(f.area)}`;
  case'max_hp':return `${f.v>0?'+':''}${f.v} max. Leben`;
  case'lose_hp':return `−${f.v} Leben`;
  case'full_heal':return 'volles Leben';
  default:return f.op;}}
function preText(p){if(!p)return'';const o=[];if(p.mult)o.push(`Karte ×${p.mult}`);if(p.repeat)o.push(`Karte ${p.repeat}× ausgeführt`);if(p.self_damage)o.push(`−${p.self_damage} eigenes Leben`);return o.join(', ');}
function bonusText(b){switch(b.type){
 case'after_victory_item':return `Nach jedem Sieg: ${ITEMS[b.item]?ITEMS[b.item].n:b.item}`;
 case'stoff_flat':return `${ST[b.stoff].n}-Karten +${b.amount} Schaden/Block`;
 case'stoff_block':return `${ST[b.stoff].n}-Karten +${b.amount} Block`;
 case'hand_size':return `${b.amount} Handkarten`;
 case'stoff_free':return `${ST[b.stoff].n}-Karten kosten 0`;
 case'every_nth_mult':return `jede ${b.n}. Karte ×${b.mult}`;
 default:return b.type;}}

// --- Querverweise: wo kommt ein Item überall vor? ---
function itemRefs(){const R={};const add=(id,s)=>{(R[id]=R[id]||[]).push(s);};
 ROLES.forEach(r=>r.i.forEach(id=>add(id,`Set <i>${esc(r.n)}</i>`)));
 ROLES.forEach(r=>{if(r.bonus&&r.bonus.item)add(r.bonus.item,`Bonus von <i>${esc(r.n)}</i>`);});
 JOBS.forEach(j=>{['w','k','t'].forEach(k=>(j[k]||[]).forEach(id=>add(id,`Start <i>${esc(j.n)}</i>`)));(j.bag||[]).forEach(id=>add(id,`Rucksack <i>${esc(j.n)}</i>`));});
 EVENTS.forEach(e=>e.o.forEach(o=>(o.fx||[]).forEach(f=>{if(f.op==='give_item')add(f.item,`Ereignis <i>${esc(e.t)}</i>`);})));
 return R;}

// Wer kann mit wem reagieren? (für Stoff-Kacheln)
const rxOf=k=>REACT.filter(r=>r.k.includes(k));

function buildStats(){const n=[
  [Object.keys(ST).length,'Stoffe','#stoffe'],[REACT.length+1,'Reaktionen','#reaktionen'],[HOCH.length,'Hochreaktionen','#reaktionen'],
  [Object.keys(ITEMS).length,'Items','#items'],[Object.values(ITEMS).reduce((s,d)=>s+d.cards.length,0),'Karten','#items'],
  [ROLES.length,'Sets','#sets'],[JOBS.length,'Startfiguren','#figuren'],[Object.keys(FOES).length-1,'Gegner','#gegner'],
  [Object.keys(BOSS_VARIANTS).length,'Boss-Entwürfe','#boss'],[EVENTS.length,'Ereignisse','#ereignisse'],[BAL.zones.length,'Orte','#orte']];
 $('stats').innerHTML=n.map(([v,l,h])=>`<a href="${h}"><b>${v}</b><span>${l}</span></a>`).join('');}

function buildStoffe(){
 $('stoffGrid').innerHTML=Object.entries(ST).map(([k,s])=>{
  const its=Object.entries(ITEMS).filter(([,d])=>d.st.includes(k));const foes=Object.values(FOES).filter(f=>f.weak===k);const rx=rxOf(k);const hoch=HOCH.filter(h=>h.s.includes(k));
  return `<div class="tile" style="border-left:6px solid ${s.c}"><div class="hd">${chip(k)}<div class="n">${s.n.toUpperCase()}</div></div>
   <div class="meta">Verschmolzen: „… ${esc(SUFFIX[k])}“</div>
   <div>${its.map(([,d])=>`<img class="ico s" src="${spr(d.spr)}" width="24" height="24" title="${esc(d.n)}" alt="">`).join('')||'<span class="xref">noch kein Item</span>'}</div>
   <div class="xref">${plural(its.length,'Item','Items')} · reagiert mit ${rx.map(r=>chip([...r.k].find(x=>x!==k))).join('')||'nichts'}${hoch.length?` · Hoch: <i>${hoch.map(h=>h.n).join(', ')}</i>`:''}</div>
   <div class="xref">Schwachstelle von: <i>${foes.map(f=>f.n).join(', ')||'niemandem'}</i></div></div>`;}).join('');}

function buildReactions(){
 const K=Object.keys(ST);
 let h=`<tr><th></th>${K.map(k=>`<th>${chip(k)}</th>`).join('')}</tr>`;
 K.forEach(a=>{h+=`<tr><th>${chip(a)}</th>`;K.forEach(b=>{
  if(a===b)h+=`<td class="same" title="${esc(VERST.n+': '+VERST.t)}">${VERST.n}</td>`;
  else{const r=REACT.find(r=>r.k===pairKey(a,b));h+=r?`<td class="on" data-k="${r.k}" title="${esc(r.n+': '+r.t)}">${r.n}</td>`:'<td>·</td>';}});h+='</tr>';});
 $('mx').innerHTML=h;
 const rxTile=(r,keys,hoch)=>{const used=!keys.length?[]:Object.values(ITEMS).filter(d=>d.st.length>1&&keys.every(x=>d.st.includes(x)));
  const fx=[...(r.fx||[]).map(fxText),preText(r.pre)].filter(Boolean).join(' · ');
  return `<div class="tile" data-k="${r.k||''}" ${hoch?'style="border-color:#8a6a1a"':''}><div class="hd"><div>${keys.map(chip).join(' + ')}</div><div class="n" style="color:${hoch?'#ffd23f':'var(--eld)'}">${esc(r.n)}</div></div>
   <div class="tx">${esc(r.t)}</div><div class="xref">${esc(fx)}</div>${used.length?`<div class="xref">steckt schon in: <i>${used.map(d=>d.n).join(', ')}</i></div>`:''}</div>`;};
 $('rxGrid').innerHTML=rxTile(VERST,[],false).replace('<div></div>','<div>'+tag('X + X')+'</div>')+REACT.map(r=>rxTile(r,[...r.k],false)).join('');
 $('hochGrid').innerHTML=HOCH.map(r=>rxTile(r,[...r.s],true)).join('');
 // Matrix-Feld anklicken: passende Kachel hervorheben
 $('mx').addEventListener('click',e=>{const td=e.target.closest('td.on');if(!td)return;const t=document.querySelector(`#rxGrid .tile[data-k="${td.dataset.k}"]`);if(t){t.scrollIntoView({behavior:'smooth',block:'center'});t.style.outline='2px solid var(--parch)';setTimeout(()=>t.style.outline='',1400);}});}

function itemTile(id,d,refs){
 const flags=[d.rare?tag('SELTEN','gold'):'',d.nodrop?tag('KEIN FUND','red'):'',d.hp?tag(`+${d.hp} MAX. LEBEN`,'eld'):''].join('');
 return `<div class="tile ${d.rare?'rare':''}"><div class="hd">${icon(d.spr,48)}<div><div class="n">${esc(d.n)}</div><div>${chips(d.st)}</div><div class="id">${id}</div></div></div>
  ${d.cards.map(c=>cardLine(c,d.st)).join('')}
  ${flags?`<div class="tags">${flags}</div>`:''}
  ${refs&&refs.length?`<div class="xref">${refs.join(' · ')}</div>`:''}</div>`;}
function buildItems(){const refs=itemRefs();
 $('dblCost').textContent=BAL.forge.double_cost_extra;$('rareFrom').textContent=BAL.rewards.rare_from_depth;
 $('itemBox').innerHTML=AREAS.map(a=>{const list=Object.entries(ITEMS).filter(([,d])=>d.a===a&&!d.bases).sort((x,y)=>(x[1].rare||0)-(y[1].rare||0));
  return `<h3>${AREA_N[a]} · ${list.length}</h3><div class="grid">${list.map(([id,d])=>itemTile(id,d,refs[id])).join('')}</div>`;}).join('');}

function buildSets(){
 $('setGrid').innerHTML=ROLES.map(r=>`<div class="tile"><div class="n">${esc(r.n).toUpperCase()}</div>
  <div class="hd" style="gap:12px;align-items:flex-start">${r.i.map(id=>`<div style="text-align:center;width:76px">${icon(ITEMS[id].spr,40)}<div class="xref" style="overflow-wrap:anywhere">${esc(ITEMS[id].n)}</div></div>`).join('')}</div>
  <div class="tx">${esc(r.t)}</div><div class="xref">${esc(bonusText(r.bonus))}</div></div>`).join('');}

function buildJobs(){
 const row=(lbl,ids)=>ids&&ids.length?`<div class="xref">${lbl}: ${ids.map(id=>`<img class="ico s" src="${spr(ITEMS[id].spr)}" width="24" height="24" title="${esc(ITEMS[id].n)}" alt=""> <i>${esc(ITEMS[id].n)}</i>`).join(' ')}</div>`:'';
 $('jobGrid').innerHTML=JOBS.map((j,i)=>{const all=[...j.w,...j.k,...j.t];const deck=all.reduce((s,id)=>s+ITEMS[id].cards.length,0);const hp=BAL.start_hp+all.reduce((s,id)=>s+(ITEMS[id].hp||0),0);
  return `<div class="tile"><div class="n">${esc(j.n).toUpperCase()}</div><div class="tx">${esc(j.d)}</div>
  ${row('Waffen',j.w)}${row('Kleidung',j.k)}${row('Talisman',j.t)}${row('Rucksack',j.bag)}
  <div class="tags">${tag(hp+' LEBEN','eld')}${tag(deck+' KARTEN')}</div><a href="index.html?job=${i}&depth=1" style="font-size:16px">Als ${esc(j.n)} starten ›</a></div>`;}).join('');}

function foeCanvas(id,F,variant){const v=mkVis(id,variant);v.c.className='spr';v.lx=0;v.ly=0;const ph=Math.random()*10;
 anims.push({big:id==='boss',f:t=>{v.x.clearRect(0,0,v.c.width,v.c.height);const gl=FOE_DRAW[F.spr](v.x,t+ph,v)||[];finish(v.c,v.x,OUTLINE[F.spr]||'#000',false);gl.forEach(q=>dglow(v.x,q[0],q[1],q[3]*.6,q[2],.5));}});
 return v.c;}
const patHtml=F=>`<div class="intents">${F.pat.map(p=>intentHtml(intentOf({str:0,weak2:0},p))).join('')}</div>`;
function buildFoes(){const E=BAL.encounters,sc=BAL.enemy_scaling;
 $('hpPer').textContent=Math.round(sc.hp_per_depth*100);$('atkEvery').textContent=sc.atk_every_n_depths;
 const g=$('foeGrid');Object.entries(FOES).filter(([id])=>id!=='boss').forEach(([id,F])=>{const t=document.createElement('div');t.className='tile';t.appendChild(foeCanvas(id,F));
  const deep=Math.round(F.hp*(1+sc.hp_per_depth*(E.boss_depth-2)));
  t.insertAdjacentHTML('beforeend',`<div class="n">${esc(F.n).toUpperCase()}</div><div class="meta">${F.hp} Leben (Tiefe ${E.boss_depth-1}: ${deep}) · Schwach gegen ${chip(F.weak)} ${ST[F.weak].n}</div>${patHtml(F)}<div class="id">id: "${id}" · ab Tiefe ${E.pool_from_depth[id]??'–'}</div>`);g.appendChild(t);});}

function buildBoss(){const F=FOES.boss;$('bossDepth').textContent=BAL.encounters.boss_depth;
 $('bossLead').innerHTML=`${esc(F.n)}: ${F.hp} Leben, schwach gegen ${chip(F.weak)} ${ST[F.weak].n}. Gezeichnet wird der Entwurf aus <code>foes.json → boss.variant</code>. Züge: `+patHtml(F).replace('class="intents"','class="intents" style="display:inline-flex"');
 const g=$('bossGrid');Object.keys(BOSS_VARIANTS).forEach(k=>{const info=BOSS_INFO[k]||{n:k,d:''};const t=document.createElement('div');t.className='tile'+(k===F.variant?' rare':'');t.appendChild(foeCanvas('boss',F,k));
  t.insertAdjacentHTML('beforeend',`<div class="hd"><div class="n">${esc(info.n).toUpperCase()}</div>${k===F.variant?tag('IM SPIEL','gold'):tag('ENTWURF')}</div><div class="tx">${esc(info.d)}</div><a href="index.html?boss=${k}&depth=${BAL.encounters.boss_depth}" style="font-size:16px">Im Kampf testen ›</a>`);g.appendChild(t);});}

function buildStatus(){
 const cardsWith=q=>Object.values(ITEMS).filter(d=>d.cards.some(c=>c[q])).map(d=>d.n);
 const rxWith=pred=>[...REACT,...HOCH].filter(r=>(r.fx||[]).some(pred)).map(r=>r.n);
 const S_=[
  {n:'Brand',col:'#ffb35a',t:'Gegner nimmt zu Beginn seines Zugs so viel Schaden, dann sinkt Brand um 1.',src:[...cardsWith('burn'),...rxWith(f=>f.status==='burn')]},
  {n:'Gift',col:'#9be07a',t:'Wie Brand: Schaden zu Beginn des Gegnerzugs, dann −1. Läuterung und Ertrinken machen daraus viel mehr.',src:[...cardsWith('poison'),...rxWith(f=>f.status==='poison'||f.op.startsWith('poison'))]},
  {n:'Geschwächt',col:'#c9b8e8',t:'Der nächste Angriff des Gegners macht nur halben Schaden.',src:rxWith(f=>f.status==='weak')},
  {n:'Block',col:'#9cc3ff',t:'Fängt Schaden ab. Spieler-Block gilt bis zum nächsten eigenen Zug, Gegner-Block bis zu seinem nächsten Zug.',src:[...cardsWith('blk'),...rxWith(f=>f.op==='block')]},
  {n:'Schutz im nächsten Zug',col:'#9cc3ff',t:'Block, der erst zu Beginn deines nächsten Zugs ankommt.',src:rxWith(f=>f.op==='ward')},
  {n:'Stärke',col:'#ff9a8a',t:'Gegner-Angriffe machen dauerhaft mehr Schaden (Absicht „Kraft“).',src:Object.values(FOES).filter(f=>f.pat.some(p=>p.t==='buff')).map(f=>f.n)},
  {n:'Schwachstelle',col:'#ffd23f',t:'Karten mit dem Stoff, gegen den ein Gegner schwach ist, machen 1,5-fachen Schaden.',src:Object.values(FOES).map(f=>`${f.n} (${ST[f.weak].n})`)},
  {n:'Energie',col:'#e8c547',t:`${BAL.energy_per_turn} pro Zug. Karten kosten Energie, manche geben welche zurück.`,src:[...cardsWith('en'),...rxWith(f=>f.op==='energy')]},
  {n:'Eigenes Leben',col:'#d0453e',t:'Manche Karten und Reaktionen kosten Leben. Du fällst dadurch nie unter 1.',src:[...cardsWith('self'),...[...REACT].filter(r=>r.pre&&r.pre.self_damage).map(r=>r.n)]}];
 const intents=['atk','blk','buff'].map(k=>({k,n:{atk:'Angriff',blk:'Schutz',buff:'Kraft'}[k]}));
 $('statusGrid').innerHTML=S_.map(s=>`<div class="tile" style="border-left:6px solid ${s.col}"><div class="n" style="color:${s.col}">${s.n.toUpperCase()}</div><div class="tx">${s.t}</div><div class="xref">Quellen: <i>${esc([...new Set(s.src)].join(', ')||'–')}</i></div></div>`).join('')
  +`<div class="tile"><div class="n">ABSICHTEN DER GEGNER</div><div class="intents">${intents.map(i=>intentHtml({k:i.k,t:i.n})).join('')}</div><div class="tx">Über jedem Gegner steht, was er im nächsten Zug tut.</div></div>`;}

function buildEvents(){const E=BAL.event;
 $('eventLead').textContent=`Kommen vor dem Kampf auf Tiefe d, wenn d mod ${E.every} = ${E.offset%E.every} (nicht auf Tiefe 1 und nicht beim Boss). Welches, ist Zufall.`;
 $('eventGrid').innerHTML=EVENTS.map(e=>`<div class="tile"><div class="n">${esc(e.t).toUpperCase()}</div><div class="tx" style="color:#b9c9bf"><i>${esc(e.d)}</i></div>
  ${e.o.map(o=>`<div class="cardl" style="--cb:#7affc8">${esc(o.l)}<div class="xref">${(o.fx||[]).map(fxText).join(' · ')}${o.if&&o.if.slot_below_max?` · nur wenn ${AREA_N[o.if.slot_below_max]} noch Platz hat`:''}</div></div>`).join('')}</div>`).join('');}

function buildFlow(){const E=BAL.encounters;
 $('healPct').textContent=Math.round(BAL.victory_heal_pct*100);$('choices').textContent=BAL.rewards.choices;
 let h='';for(let d=1;d<=E.boss_depth;d++){const z=zoneOfDepth(d);const boss=d===E.boss_depth;const c=E.count[String(d)]??E.count.default;
  const pool=Object.keys(E.pool_from_depth).filter(id=>d>=E.pool_from_depth[id]);
  const tags=[];if(every(d,BAL.event)&&!boss&&d>1)tags.push(tag('EREIGNIS','eld'));
  if(boss)tags.push(tag('BOSS','red'));
  if(!boss&&every(d,BAL.shop))tags.push(tag('KRÄMER','gold'));if(!boss&&every(d,BAL.workshop))tags.push(tag('WERKBANK','gold'));
  if(d>=BAL.rewards.rare_from_depth&&!boss)tags.push(tag('SELTENE FUNDE'));
  h+=`<div class="tile ${boss?'boss':''}"><div class="d">${d}</div><div class="xref">${esc(z.name)}</div>
   <div class="meta">${boss?esc(FOES.boss.n):`${Array.isArray(c)?c.join('–'):c} Gegner`}</div>
   ${boss?'':`<div>${pool.map(id=>`<span class="tag" title="${esc(FOES[id].n)}">${esc(FOES[id].n)}</span>`).join(' ')}</div>`}
   <div class="tags">${tags.join('')}</div></div>`;}
 $('flow').innerHTML=h;const SH=BAL.shop,G=BAL.gold_per_victory;
 $('balLegend').innerHTML=`Ereignis kommt vor dem Kampf, Krämer und Werkbank nach dem Sieg. Gold pro Sieg ${G.min}–${G.max} +${G.per_enemy} je Gegner (Boss ${G.boss}). Krämer: ${SH.normal_items} normale Items für ${SH.normal_price.join('–')}, ${SH.rare_items} seltenes für ${SH.rare_price}, Heilung +${SH.heal.v} für ${SH.heal.price}. Werkbank: zwei Items verschmelzen, Werte +${BAL.forge.bump}, höchstens ${BAL.forge.max_stoffe} Stoffe. Start: ${BAL.start_hp} Leben, ${BAL.hand_size} Handkarten, ${BAL.start_slots} von ${BAL.max_slots} Slots je Bereich, Rucksack ${BAL.bag_size}.`;}

function buildZones(){let from=1;const g=$('zoneGrid');
 BAL.zones.forEach(z=>{const[c,x]=cnv(W,H);c.className='scn';const t=document.createElement('div');t.className='tile';t.appendChild(c);
  const to=Math.min(z.until,BAL.encounters.boss_depth);t.insertAdjacentHTML('beforeend',`<div class="n">${esc(z.name).toUpperCase()}</div><div class="id">zone "${z.id}" · Tiefe ${from}${to>from?'–'+to:''}</div>`);from=z.until+1;g.appendChild(t);
  const sc=scene(z.id);anims.push({big:false,scene:true,f:tt=>{x.drawImage(sc.bg,0,0);sc.back&&sc.back(x,tt);if(sc.midc)x.drawImage(sc.midc,0,0);sc.mid&&sc.mid(x,tt);x.drawImage(sc.fg,0,0);sc.front&&sc.front(x,tt);x.drawImage(VIG,0,0);}});});}

// Ideen aus data/ideas.json. Fehlt die Datei oder ist sie leer, steht hier ein Hinweis.
async function buildIdeas(){let L=[];try{const r=await fetch('data/ideas.json',{cache:'no-store'});if(r.ok)L=await r.json();}catch(e){}
 const g=$('ideaGrid');if(!L.length){g.outerHTML='<div class="empty">Noch keine Ideen eingetragen. Neue Einträge in <code>data/ideas.json</code> erscheinen hier.</div>';return;}
 g.innerHTML=L.map(i=>{const st=i.st||[];const src=i.px?gridImg(i.px):i.spr?spr(i.spr):null;
  return `<div class="tile idea"><div class="hd">${src?`<img class="ico" src="${src}" width="48" height="48" alt="">`:''}<div><div class="n">${esc(i.n)}</div><div>${st.length?chips(st):''} ${i.a?`<span class="xref">${esc(AREA_N[i.a]||i.a)}</span>`:''}</div></div></div>
   <div class="tags">${tag(esc((i.kind||'idee').toUpperCase()),'eld')}</div><div class="tx">${esc(i.d)}</div>${(i.cards||[]).map(c=>cardLine(c,st)).join('')}
   ${i.notes?`<div class="xref">${esc(i.notes)}</div>`:''}</div>`;}).join('');}

// Suche: blendet Kacheln aus, die den Text nicht enthalten
function setupSearch(){$('q').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();
 document.querySelectorAll('#ab section .tile').forEach(t=>t.classList.toggle('hidden',!!q&&!t.textContent.toLowerCase().includes(q)));
 document.querySelectorAll('#ab section').forEach(s=>{const ts=s.querySelectorAll('.tile');s.classList.toggle('hidden',!!q&&ts.length>0&&[...ts].every(t=>t.classList.contains('hidden')));});});}

(async()=>{
 try{await loadData();}catch(err){document.body.insertAdjacentHTML('afterbegin',`<div style="padding:20px;color:#ff8a7a;font:16px monospace">Daten konnten nicht geladen werden (${err.message}).<br>Bitte über einen lokalen Server öffnen (start.command / start.bat oder: python3 -m http.server).</div>`);return;}
 buildStats();buildStoffe();buildReactions();buildItems();buildSets();buildJobs();buildFoes();buildBoss();buildStatus();buildEvents();buildFlow();buildZones();await buildIdeas();setupSearch();
 // Gegner jedes Bild, Szenen nur jedes dritte (teuer). Nur zeichnen, was sichtbar ist.
 const seen=new WeakSet();const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target)));
 document.querySelectorAll('canvas.spr,canvas.scn').forEach(c=>io.observe(c));
 const canv=document.querySelectorAll('canvas.spr,canvas.scn');const t0=performance.now();let i=0;
 const loop=now=>{const t=(now-t0)/1000;i++;anims.forEach((a,k)=>{const c=canv[k];if(i>2&&!seen.has(c))return;if(a.scene&&i%3!==0&&i>2)return;a.f(t);});requestAnimationFrame(loop);};requestAnimationFrame(loop);
})();
