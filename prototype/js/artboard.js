// Artboard: der ganze Spielinhalt auf einer Seite. Liest dieselben Daten und Zeichner wie das Spiel und schreibt nichts.
// Neue Inhalte in data/*.json erscheinen hier automatisch. Ideen, die noch nicht im Spiel sind: data/ideas.json.
// Nutzt die Bausteine des Spiels: gi()/glyph() (zeichen.js), cardText/passivText/absicht (oberflaeche.js), ladeSprite/dglowA (buehne.js), World.build (scenes/world).
(()=>{
'use strict';
BU.k=2; // Pixelzeichen ganzzahlig wie im Spiel bei 1280 × 720
const anims=[];// {c, f(t)} – nur sichtbare Bilder werden neu gezeichnet

// ---------- kleine Helfer ----------
const icon=(id,px=48,cls='bild')=>{const d=ITEMS[id];return d?`<img class="${cls}" src="${itemBild(id)}" style="image-rendering:pixelated" width="${px}" height="${px}" alt="" title="${esc(d.n)}">`:`<span class="et rot">${esc(id)}?</span>`;};
const glyphs=(st,s=18)=>(st||[]).map(k=>gi(k,s)).join('');
const stoffe=st=>st&&st.length?glyphs(st):'<span class="et">kein Stoff</span>';
const et=(t,cls='')=>`<span class="et ${cls}">${t}</span>`;
const plural=(n,a,b)=>`${n} ${n===1?a:b}`;
const iname=id=>ITEMS[id]?ITEMS[id].n:id;
const fname=id=>FOES[id]?FOES[id].n:id;
const bname=id=>BIOMES[id]?BIOMES[id].n:(id==='alle'?'Überall':id);
let BIOM_IDS=[];// nach loadData gesetzt
// Pixelraster (12 Zeilen aus PAL-Buchstaben) als Bild, für Ideen ohne fertiges Sprite
function rasterBild(rows){const c=document.createElement('canvas');c.width=rows[0].length;c.height=rows.length;const x=c.getContext('2d');rows.forEach((r,y)=>[...r].forEach((ch,i)=>{if(PAL[ch]){x.fillStyle=PAL[ch];x.fillRect(i,y,1,1);}}));return c.toDataURL();}

// Kartenzeile mit echten Kosten (Doppel-Stoff kostet mehr); Text aus cardText() des Spiels
function kartenZeile(c,st){const extra=st.length>1?BAL.forge.double_cost_extra:0;const kb=st[0]?ST[st[0]].c:'#6a5a3a';
 return `<div class="kzeile" style="--kb:${kb}"><span class="ko">${c.c+extra}</span><b>${esc(c.n)}</b> ${esc(cardText(c))}</div>`;}

// Effekte (reactions.json / events.json / run.json) als Klartext
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
  case'give_random':return 'ein zufälliges Item aus dem Fundpool';
  case'give_rare':return 'ein zufälliges seltenes Item';
  case'give_item':return `Item: ${iname(f.item)}`;
  case'add_slot':return `+1 Slot ${AN(f.area)}`;
  case'max_hp':return `${f.v>0?'+':'−'}${Math.abs(f.v)} max. Leben`;
  case'lose_hp':return `−${f.v} Leben`;
  case'full_heal':return 'volles Leben';
  case'gold':return f.v>=0?`+${f.v} Gold`:`kostet ${-f.v} Gold`;
  case'strike':return 'eine Karte streichen (das Item bleibt angelegt)';
  case'transform':return 'ein angelegtes Item verwandelt sich in ein anderes desselben Bereichs';
  case'fight':return f.foes&&f.foes.length?`danach Kampf gegen ${f.foes.map(fname).join(', ')}`:'danach Kampf gegen Gegner des Bioms';
  case'discover':return 'eine unentdeckte Reaktion wird entdeckt';
  default:return f.op;}}
const fxListe=l=>(l||[]).map(fxText).join(' · ');
function bedText(c){if(!c)return'';const o=[];if(c.slot_below_max)o.push(`nur wenn ${AREA_N[c.slot_below_max]} noch Platz hat`);if(c.gold_min)o.push(`nur mit mindestens ${c.gold_min} Gold`);if(c.hp_min)o.push(`nur mit mindestens ${c.hp_min} Leben`);return o.join(', ');}
function preText(p){if(!p)return'';const o=[];if(p.mult)o.push(`Karte ×${p.mult}`);if(p.repeat)o.push(`Karte ${p.repeat}× ausgeführt`);if(p.self_damage)o.push(`−${p.self_damage} eigenes Leben`);return o.join(', ');}
function bonusText(b){if(!b)return'';switch(b.type){
 case'after_victory_item':return `Nach jedem Sieg: ${iname(b.item)}`;
 case'stoff_flat':return `${ST[b.stoff].n}-Karten +${b.amount} Schaden/Block`;
 case'stoff_block':return `${ST[b.stoff].n}-Karten +${b.amount} Block`;
 case'hand_size':return `${b.amount} Handkarten`;
 case'stoff_free':return `${ST[b.stoff].n}-Karten kosten 0`;
 case'every_nth_mult':return `jede ${b.n}. Karte ×${b.mult}`;
 default:return b.type;}}
// Absichten eines Musters mit dem Baustein absicht() des Spiels
const musterHtml=pat=>`<div class="abs-reihe">${pat.map((p,i)=>`<div class="feind"><div class="abs">${absicht({pat,pi:i,str:0,weak2:0}).html}</div></div>`).join('<span class="pfeil">›</span>')}</div>`;
function besondersText(F){const b=F.besonders;if(!b)return'';
 if(b.art==='ruft')return `Ruft alle ${b.alle||3} Züge ${fname(b.gegner)} (höchstens vier Gegner).`;
 if(b.art==='schwach_wechsel')return `Wechselt die Schwachstelle jeden Zug: ${glyphs(b.stoffe)} ${b.stoffe.map(k=>ST[k].n).join(' → ')}.`;
 if(b.art==='phasen'){const R2=b.ruft?(typeof b.ruft==='string'?{gegner:b.ruft,alle:3,anzahl:1}:b.ruft):null;
  return `Phasen bei ${b.bei.map(x=>Math.round(x*100)+' %').join(' und ')} Leben, jede mit eigenem Muster, Sprite und Schwachstelle (${(b.schwach||[]).map(k=>gi(k,18)+' '+ST[k].n).join(', ')}).${R2?` Ab Phase 2 ruft es alle ${R2.alle||3} Züge ${R2.anzahl||1}× ${fname(R2.gegner)}.`:''}`;}
 return esc(JSON.stringify(b));}

// Tiefe je Akt (Akte I–IV = Tiefe 1–16, Vorraum 17, Finale 18)
function aktTiefen(){let d=1;return RUN.akte.map(a=>{const von=d;d+=a.ebenen.length;return[von,d-1];});}
function aktVonBiom(b){return RUN.akte.findIndex(a=>a.biome.includes(b));}
const hpBei=(F,d)=>Math.round(F.hp*(1+BAL.enemy_scaling.hp_per_depth*(d-1)));

// ---------- Sprite-Sheets abspielen (Format: docs/auftrag/sprites.md, Lader: ladeSprite in buehne.js) ----------
function sheetCanvas(name,k,biom,anim='idle'){const sp=ladeSprite(name);const c=document.createElement('canvas');c.className='figur';
 const B=BIOMES[biom]||BIOMES.hafen;const ph=Math.random()*10;let last=-1,groesse=false;
 c.width=96;c.height=120;c.style.width=96*k+'px';c.style.height=120*k+'px';
 anims.push({c,f:t=>{if(!sp||!sp.ok||!sp.meta)return;const m=sp.meta;
  if(!groesse){c.width=m.w;c.height=m.h;c.style.width=m.w*k+'px';c.style.height=m.h*k+'px';groesse=true;last=-1;}
  const an=m.anim[anim]||m.anim.idle;const n=Math.floor((t+ph)*an.fps);const fr=an.loop?n%an.n:Math.min(n%(an.n+an.fps),an.n-1);
  const step=Math.floor((t+ph)*8);if(step===last)return true;last=step;
  const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle=B.nebel[0];x.fillRect(0,0,m.w,m.h);x.fillStyle=B.koerper[1];x.fillRect(0,m.fuss[1]+1,m.w,m.h);
  x.drawImage(sp.img,fr*m.w,an.zeile*m.h,m.w,m.h,0,0,m.w,m.h);
  if(m.augen&&anim!=='tod')m.augen.forEach(([ax,ay])=>dglowA(x,ax,ay,6,m.augenfarbe||B.augen,.35+Math.sin((t+ph)*2)*.05));return true;}});
 return c;}

// ---------- Querverweise: wo kommt ein Item überall vor? ----------
function itemRefs(){const R={};const add=(id,s)=>{(R[id]=R[id]||[]).push(s);};
 ROLES.forEach(r=>r.i.forEach(id=>add(id,`Set <i>${esc(r.n)}</i>`)));
 ROLES.forEach(r=>{if(r.bonus&&r.bonus.item)add(r.bonus.item,`Bonus von <i>${esc(r.n)}</i>`);});
 JOBS.forEach(j=>{['w','k','t'].forEach(k=>(j[k]||[]).forEach(id=>add(id,`Start <i>${esc(j.n)}</i>`)));(j.bag||[]).forEach(id=>add(id,`Rucksack <i>${esc(j.n)}</i>`));});
 EVENTS.forEach(e=>e.o.forEach(o=>(o.fx||[]).forEach(f=>{if(f.op==='give_item')add(f.item,`Ereignis <i>${esc(e.t)}</i>`);})));
 Object.entries(FOES).forEach(([id,F])=>{if(F.beute)add(F.beute,`Beute von <i>${esc(F.n)}</i>`);});
 for(const k in R)R[k]=[...new Set(R[k])];
 return R;}
function fundpools(id){return BIOM_IDS.filter(b=>(BIOMES[b].fundpool||[]).includes(id));}
function fragmentFuer(id){return FRAGS.find(f=>f.schaltet&&f.schaltet.art==='item'&&f.schaltet.id===id);}

const rxOf=k=>REACT.filter(r=>r.k.includes(k));

// ---------- Abschnitte ----------
function bauZahlen(){const items=Object.values(ITEMS).filter(d=>!d.bases);const n=[
  [Object.keys(ST).length,'Stoffe','#stoffe'],[REACT.length+1,'Reaktionen','#reaktionen'],[HOCH.length,'Hochreaktionen','#reaktionen'],
  [items.length,'Items','#items'],[items.reduce((s,d)=>s+d.cards.length,0),'Karten','#items'],[ROLES.length,'Sets','#sets'],
  [JOBS.length,'Figuren','#figuren'],[Object.values(FOES).filter(f=>f.rang==='normal').length,'Gegner','#gegner'],[Object.values(FOES).filter(f=>f.rang!=='normal').length,'Wächter + Boss','#gegner'],
  [BIOM_IDS.length,'Biome','#biome'],[EVENTS.length,'Ereignisse','#ereignisse'],[FRAGS.length,'Fragmente','#fragmente'],[RUN.akte.length,'Akte','#ablauf']];
 $('zahlen').innerHTML=n.map(([v,l,h])=>`<a class="kachel" href="${h}" style="text-decoration:none"><span class="kn" style="font-size:26px">${v}</span><span class="mt">${l}</span></a>`).join('');}

function bauStoffe(){
 $('stoffRaster').innerHTML=Object.entries(ST).map(([k,s])=>{
  const its=Object.values(ITEMS).filter(d=>d.st.includes(k)&&!d.bases);const foes=Object.values(FOES).filter(f=>f.weak===k||(f.besonders&&((f.besonders.stoffe||[]).includes(k)||(f.besonders.schwach||[]).includes(k))));
  const rx=rxOf(k);const hoch=HOCH.filter(h=>h.s.includes(k));
  return `<div class="kachel" style="border-left:4px solid ${s.c}"><div class="kopf">${gi(k,36)}<div><div class="kn">${esc(s.n).toUpperCase()}</div><div class="id">${k} · ${s.s}</div></div></div>
   <div class="mt">Verschmolzen: „… ${esc(SUFFIX[k])}“</div>
   <div>${its.map(d=>`<img class="bild k" src="${spr(d.spr)}" width="24" height="24" title="${esc(d.n)}" alt="">`).join('')||'<span class="ref">noch kein Item</span>'}</div>
   <div class="ref">${plural(its.length,'Item','Items')} · reagiert mit ${rx.map(r=>gi([...r.k].find(x=>x!==k),18)).join('')||'nichts'}${hoch.length?` · Hoch: <i>${hoch.map(h=>esc(h.n)).join(', ')}</i>`:''}</div>
   <div class="ref">Schwachstelle von: <i>${foes.map(f=>esc(f.n)).join(', ')||'niemandem'}</i></div></div>`;}).join('');}

function bauReaktionen(){
 const K=Object.keys(ST);
 let h=`<tr><th></th>${K.map(k=>`<th>${gi(k,18)}</th>`).join('')}</tr>`;
 K.forEach(a=>{h+=`<tr><th>${gi(a,18)}</th>`;K.forEach(b=>{
  if(a===b)h+=`<td class="gleich" title="${esc(VERST.n+': '+VERST.t)}">${esc(VERST.n)}</td>`;
  else{const r=REACT.find(r=>r.k===pairKey(a,b));h+=r?`<td class="an" data-k="${r.k}" title="${esc(r.n+': '+r.t)}">${esc(r.n)}</td>`:'<td>·</td>';}});h+='</tr>';});
 $('mx').innerHTML=h;
 const kachel=(r,keys,hoch)=>{const used=!keys.length?[]:Object.values(ITEMS).filter(d=>d.st.length>1&&keys.every(x=>d.st.includes(x)));
  const fx=[fxListe(r.fx),preText(r.pre)].filter(Boolean).join(' · ');
  return `<div class="kachel ${hoch?'selten':''}" data-k="${r.k||''}"><div class="kopf"><div>${keys.length?keys.map(k=>gi(k,18)).join(' + '):et('X + X')}</div><div class="kn" style="color:${hoch?'var(--gold)':'#efe4c8'}">${esc(r.n)}</div></div>
   <div class="tx">${esc(r.t)}</div><div class="ref">${esc(fx)}</div>${used.length?`<div class="ref">steckt in: <i>${used.map(d=>esc(d.n)).join(', ')}</i></div>`:''}</div>`;};
 $('rxRaster').innerHTML=kachel(VERST,[],false)+REACT.map(r=>kachel(r,[...r.k],false)).join('');
 $('hochRaster').innerHTML=HOCH.map(r=>kachel(r,[...r.s],true)).join('');
 $('mx').addEventListener('click',e=>{const td=e.target.closest('td.an');if(!td)return;const t=document.querySelector(`#rxRaster .kachel[data-k="${td.dataset.k}"]`);if(t){t.scrollIntoView({behavior:'smooth',block:'center'});t.style.outline='1px solid var(--messing2)';setTimeout(()=>t.style.outline='',1400);}});}

function itemKachel(id,d,refs){
 const verbraucht=d.cards.some(c=>c.verbraucht),eroeff=d.cards.some(c=>c.eroeffnung);const fr=d.meta?fragmentFuer(id):null;const pools=fundpools(id);
 const tags=[d.rare?et('selten','gold'):'',d.nodrop?et('kein Fund','rot'):'',d.hp?et(`+${d.hp} max. Leben`,'gruen'):'',
  verbraucht?et('verbraucht','rot'):'',eroeff?et('Eröffnung','blau'):'',d.passiv?et('passiv','violett'):'',d.meta?et('erst nach Fragment','gold'):'',
  d.rar?et({gewoehnlich:'gewöhnlich',selten:'selten',reliquie:'Reliquie'}[d.rar]||d.rar,d.rar==='reliquie'?'violett':d.rar==='selten'?'gold':''):'',et(`${typeof kerbenVon==='function'?kerbenVon({id,uid:-1}):(d.kerben||1)} Kerbe(n)`),d.preis?et(`${d.preis} Gold`):''].join('');
 return `<div class="kachel ${d.rare?'selten':''}"><div class="kopf">${icon(id,48)}<div><div class="kn">${esc(d.n)}</div><div>${stoffe(d.st)}</div><div class="id">${id} · spr "${esc(d.spr)}"</div></div></div>
  ${d.cards.map(c=>kartenZeile(c,d.st)).join('')}${d.passiv?`<div class="kzeile" style="--kb:var(--violett)"><b>Passiv</b> ${esc(passivText(d.passiv))}</div>`:''}${d.eigen?`<div class="kzeile" style="--kb:var(--gold)"><b>Eigenschaft</b> ${esc(d.eigen.typ)}${d.eigen.v!=null?' '+d.eigen.v:''}${d.eigen.preis&&typeof d.eigen.preis==='string'?' (Preis: '+esc(d.eigen.preis)+')':''}${d.eigen.t?': '+esc(d.eigen.t):''}</div>`:''}${d.flavor?`<div class="tx"><i>${esc(d.flavor)}</i></div>`:''}
  ${tags?`<div class="etiketten">${tags}</div>`:''}
  ${fr?`<div class="ref">Freigeschaltet durch Fragment <i>„${esc(fr.titel)}“</i> (${esc(BIOMES[fr.biom]?.kurz||fr.biom)})</div>`:''}
  <div class="ref">${pools.length?`Fundpool: <i>${pools.map(b=>esc(BIOMES[b].kurz)).join(', ')}</i>`:(d.rare?'Seltener Fund (überall ab Tiefe '+BAL.rewards.rare_from_depth+')':'in keinem Fundpool')}</div>
  ${refs&&refs.length?`<div class="ref">${refs.join(' · ')}</div>`:''}</div>`;}
function bauItems(){const refs=itemRefs();
 $('itemEinl').innerHTML=`Jedes angelegte Item gibt seine Karten ins Deck (jede Karte ${BAL.card_copies||1}×). Gold umrandet = selten mit zwei Stoffen (Karten kosten +${BAL.forge.double_cost_extra} Energie, Fund ab Tiefe ${BAL.rewards.rare_from_depth}). <b>Eröffnung</b>: Bonus, wenn die Karte als erste im Zug kommt. <b>Verbraucht</b>: nach dem Ausspielen für den Rest des Kampfes weg. <b>Passiv</b>: Talisman ohne Karte. <b>Erst nach Fragment</b>: kommt erst in den Fundpool, wenn das passende Wandbild gelesen ist.`;
 $('itemBox').innerHTML=AREAS.map(a=>{const list=Object.entries(ITEMS).filter(([,d])=>d.a===a&&!d.bases).sort((x,y)=>(x[1].rare?1:0)-(y[1].rare?1:0)||(x[1].meta?1:0)-(y[1].meta?1:0));
  return `<h3 class="unter">${esc(AREA_N[a]).toUpperCase()} <small>${list.length} Items</small></h3><div class="raster">${list.map(([id,d])=>itemKachel(id,d,refs[id])).join('')}</div>`;}).join('');}

function bauHandgriffe(){const box=$('hgBox');if(!box)return;const L=Object.entries(HANDGRIFFE).filter(([id])=>!id.startsWith('_t_'));
 $('hgEinl').innerHTML=`${L.length} Handgriffe. Ein Handgriff wird in eine Kerbe eines Items geritzt und nimmt dessen Stoffe an; jede Karte 1× im Deck. Gewöhnlich nach normalen Kämpfen, selten nach schweren Kämpfen und Wächtern, im Krämer und in Ereignissen.`;
 const gruppen={};L.forEach(([id,H])=>{const k=H.build||H.familie||'allgemein';(gruppen[k]=gruppen[k]||[]).push([id,H]);});
 box.innerHTML=Object.entries(gruppen).map(([k,l])=>`<h3 class="unter">${esc(String(k)).toUpperCase()} <small>${l.length}</small></h3><div class="raster">${l.map(([id,H])=>`<div class="kachel ${H.rar==='selten'?'selten':''}"><div class="kopf">${hgBild(id)?`<img class="bild" src="${hgBild(id)}" width="48" height="48" style="image-rendering:pixelated">`:''}<div><div class="kn">${esc(H.n)}</div><div class="id">${id} · ${H.rar==='selten'?'selten':'gewöhnlich'}</div></div></div><div class="kzeile">${H.opfer?'Opfer '+H.opfer:H.c} · ${esc(typeof cardText==='function'?cardText(H):'')}</div>${H.t||H.flavor?`<div class="tx"><i>${esc(H.t||H.flavor)}</i></div>`:''}</div>`).join('')}</div>`).join('');}
function bauSets(){
 $('setRaster').innerHTML=ROLES.map(r=>{const wer=JOBS.filter(j=>j.set===r.n).map(j=>j.n);
  return `<div class="kachel"><div class="kn">${esc(r.n)}</div>
  <div class="kopf" style="gap:14px;align-items:flex-start">${r.i.map(id=>`<div style="text-align:center;width:84px">${icon(id,40)}<div class="ref" style="overflow-wrap:anywhere">${esc(iname(id))}</div></div>`).join('')}</div>
  <div class="tx">${esc(r.t)}</div><div class="ref">Bonus: <i>${esc(bonusText(r.bonus))}</i>${wer.length?` · Set der Figur <i>${wer.map(esc).join(', ')}</i>`:''}</div></div>`;}).join('');}

function bauFiguren(){
 $('figEinl').innerHTML=`Wählbar am Strand. Freischaltung über die Zahl gelesener Wandbild-Fragmente (<code>frei_ab</code>, von ${FRAGS.length}). Die <b>Vorliebe</b> entscheidet mit ${Math.round((RUN.akte[0].vorliebe||.7)*100)} %, ob Akt I im Hafen oder im Moorwald liegt. Karten im Startdeck: jede Karte ${BAL.card_copies||1}×.`;
 const zeile=(lbl,ids)=>ids&&ids.length?`<div class="ref">${lbl}: ${ids.map(id=>`${icon(id,24,'bild k')} <i>${esc(iname(id))}</i>`).join(' ')}</div>`:'';
 $('figRaster').innerHTML=JOBS.map(j=>{const all=[...j.w,...j.k,...j.t];const deck=deckGroesse(all);const hp=BAL.start_hp+all.reduce((s,id)=>s+((ITEMS[id]&&ITEMS[id].hp)||0),0);
  const set=ROLES.find(r=>r.n===j.set);
  return `<div class="kachel"><div class="kopf"><div class="kn">${esc(j.n)}</div>${j.frei_ab?et(`ab ${j.frei_ab} Fragmenten`,'gold'):et('von Anfang an','gruen')}${j.faehigkeit?et('Zusatzfigur','violett'):''}</div>
  <div class="tx">${esc(j.d)}</div>
  <div class="ref">Ausrede: <span class="zitat">„${esc(j.ausrede)}“</span></div>
  <div class="ref">Wahrheit (bei der Ankunft): <span class="zitat">„${esc(j.wahrheit)}“</span></div>
  <div class="ref">Vorliebe: <i>${esc(BIOMES[j.vorliebe]?.n||j.vorliebe)}</i> · Instrument: <i>${esc(j.instrument)}</i> · Musik: <code>${esc(j.musik)}</code></div>
  ${j.faehigkeit?`<div class="kzeile" style="--kb:var(--violett)"><b>Fähigkeit</b> ${esc(j.faehigkeit_t||j.faehigkeit)}</div>`:''}
  ${zeile(AREA_N.waffe||'Waffen',j.w)}${zeile(AREA_N.kleidung||'Kleidung',j.k)}${zeile(AREA_N.talisman||'Talisman',j.t)}${zeile('Rucksack',j.bag)}
  <div class="ref">Set: ${set?`<i>${esc(set.n)}</i> (${set.i.map(id=>all.includes(id)?`<span style="color:var(--gold)">${esc(iname(id))}</span>`:esc(iname(id))).join(', ')})`:'keins'}</div>
  <div class="etiketten">${et(hp+' Leben','gruen')}${et(deck+' Karten')}</div><a href="index.html?job=${j.id}&seed=1" style="font-size:15px">Als ${esc(j.n)} starten (Seed 1) ›</a></div>`;}).join('');}

function gegnerKachel(id,F){const t=document.createElement('div');t.className='kachel'+(F.rang!=='normal'?' selten':'');if(F.rang==='boss')t.style.gridColumn='span 2';
 const k=2;
 const fig=document.createElement('div');fig.style.cssText='display:flex;justify-content:center;background:#000;padding:4px 0';fig.appendChild(sheetCanvas(F.sprite,k,F.biom));t.appendChild(fig);
 const ai=aktVonBiom(F.biom),tf=aktTiefen()[ai]||[1,1];
 const hpTxt=F.rang==='normal'?`${F.hp} Leben auf Tiefe 1 · im eigenen Akt (Tiefe ${tf[0]}–${tf[1]}): ${hpBei(F,tf[0])}–${hpBei(F,tf[1])}`:`${F.hp} Leben (skaliert nicht mit der Tiefe)`;
 const rang={normal:et('normal'),waechter:et('Wächter','rot'),boss:et('Boss','violett')}[F.rang]||et(F.rang);
 const sheets=[...new Set([...(F.varianten||[F.sprite]),...((F.besonders&&F.besonders.sprites)||[])])];
 t.insertAdjacentHTML('beforeend',`<div class="kopf"><div><div class="kn">${esc(F.n)}</div><div class="id">id "${id}" · Stimme "${esc(F.stimme||id)}"</div></div></div>
  <div class="etiketten">${rang}${et(esc(BIOMES[F.biom]?.kurz||F.biom))}${et(plural(sheets.length,'Sheet','Sheets'))}</div>
  <div class="mt">${hpTxt}</div>
  <div class="mt">Schwachstelle: ${gi(F.weak,18)} ${esc(ST[F.weak].n)}</div>
  ${musterHtml(F.pat)}
  ${F.besonders&&F.besonders.art==='phasen'?F.besonders.muster.map((m,i)=>`<div class="ref">Phase ${i+2}${F.besonders.schwach&&F.besonders.schwach[i]?` · schwach ${gi(F.besonders.schwach[i],18)}`:''}</div>${musterHtml(m)}`).join(''):''}
  ${F.besonders?`<div class="kzeile" style="--kb:#ff6a5a">${besondersText(F)}</div>`:''}
  ${[F.kniff,...(F.kniffe||[])].filter(Boolean).map(k=>`<div class="kzeile" style="--kb:#e8c070"><b>Kniff</b> ${esc(typeof KNIFF_TEXT!=='undefined'&&KNIFF_TEXT[k.art]?KNIFF_TEXT[k.art](k):k.art)}${k.why?` <i>${esc(k.why)}</i>`:''}</div>`).join('')}${F.beute_satz?`<div class="ref">Beute-Satz: <i>${esc(F.beute_satz)}</i></div>`:''}
  <div class="tx"><i>${esc(F.konzept||'')}</i></div>
  <div class="ref">Beute: ${F.beute?`${icon(F.beute,24,'bild k')} <i>${esc(iname(F.beute))}</i>`:'keine'} · Sheets: <i>${sheets.map(esc).join(', ')}</i></div>`);
 return t;}
function bauGegner(){const sc=BAL.enemy_scaling;
 $('gegnerEinl').innerHTML=`Normale Gegner skalieren mit der Tiefe: +${Math.round(sc.hp_per_depth*100)} % Leben je Tiefe, alle ${sc.atk_every_n_depths} Tiefen +1 Angriff. Wächter und Boss sind je Akt ausgelegt und skalieren nur mit der Schwierigkeitsstufe. Die Züge laufen der Reihe nach im Kreis (normale Gegner beginnen an zufälliger Stelle). Sprite: Idle-Animation aus dem Sheet; alle Animationen in der <a href="gallery.html#gegner">Galerie</a>. Konzepte: <code>docs/auftrag/gegner.md</code>.`;
 const box=$('gegnerBox');
 BIOM_IDS.forEach(b=>{const list=Object.entries(FOES).filter(([,F])=>F.biom===b).sort((x,y)=>({normal:0,waechter:1,boss:2}[x[1].rang]||0)-({normal:0,waechter:1,boss:2}[y[1].rang]||0));if(!list.length)return;
  box.insertAdjacentHTML('beforeend',`<h3 class="unter">${esc(BIOMES[b].n).toUpperCase()} <small>${list.length} Typen</small></h3>`);const g=document.createElement('div');g.className='raster';list.forEach(([id,F])=>g.appendChild(gegnerKachel(id,F)));box.appendChild(g);});
 const ohne=Object.entries(FOES).filter(([,F])=>!BIOMES[F.biom]);if(ohne.length){box.insertAdjacentHTML('beforeend','<h3 class="unter">OHNE BIOM</h3>');const g=document.createElement('div');g.className='raster';ohne.forEach(([id,F])=>g.appendChild(gegnerKachel(id,F)));box.appendChild(g);}}

const warte=[];// teure Bilder (World.build) nacheinander bauen, damit die Seite nicht hängt
function szenenBild(b,opt,c){warte.push(()=>{const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 try{if(typeof World==='undefined'||!World._biome||!World._biome[b])throw new Error('fehlt');const sz=World.build(b,opt);const kam={x:0,y:0};
  if(sz.zeichne)sz.zeichne(x,0,kam);else(sz.ebenen||[]).forEach(L=>x.drawImage(L.canvas,L.x||0,L.y||0));}
 catch(e){const p=c.parentNode;c.remove();p.insertAdjacentHTML('afterbegin',`<div class="leer" style="width:480px;height:270px;box-sizing:border-box">Hintergrund für „${esc(BIOMES[b].n)}“ ist in <code>js/scenes/world/${b}.js</code> noch nicht gebaut${e.message!=='fehlt'?` (Fehler: ${esc(e.message)})`:''}. Im Spiel steht solange ein Ersatz in der Biom-Palette.</div>`);}});}
function farbfelder(B){const f=(l,cols)=>`<span>${l}</span>${cols.map(c=>`<i style="background:${c}" title="${c}"></i>`).join('')}`;
 return `<div class="farben">${f('Körper',B.koerper)}${f('Rand',B.rand)}${f('Augen',[B.augen])}${f('Nebel',B.nebel)}</div>`;}
function bauBiome(){const box=$('biomBox');const tf=aktTiefen();
 BIOM_IDS.forEach(b=>{const B=BIOMES[b];const ai=aktVonBiom(b);const A=RUN.akte[ai];const evs=EVENTS.filter(e=>e.biom===b);const frs=FRAGS.filter(f=>f.biom===b);
  const t=document.createElement('div');t.className='kachel';t.style.cssText='flex-direction:row;gap:16px;align-items:flex-start;margin-bottom:12px';
  const fig=document.createElement('div');fig.style.flex='none';const c=document.createElement('canvas');c.width=480;c.height=270;c.className='szene';fig.appendChild(c);t.appendChild(fig);
  szenenBild(b,{variante:0,seed:7,fremdheit:0,art:'kampf'},c);
  const kr=B.kraemer||{};
  t.insertAdjacentHTML('beforeend',`<div style="display:flex;flex-direction:column;gap:6px;min-width:0;flex:1">
   <div class="kopf"><div><div class="kn" style="font-size:22px">${esc(B.n)}</div><div class="id">"${b}" · Musik "${esc(B.musik)}" · alte Zone "${esc(B.szene_alt||'–')}"</div></div></div>
   <div class="etiketten">${A?et(`${A.n} · ${A.titel}`,'gold')+et(`Tiefe ${tf[ai][0]}–${tf[ai][1]}`):''}${A&&A.biome.length>1?et(A.wahl==='figur'?`Wahl über die Vorliebe der Figur`:'Wahl per Seed 50/50','blau'):''}</div>
   <div class="tx">Zeitschicht: <i>${esc(B.zeit)}</i></div>
   ${farbfelder(B)}
   <div class="ref">Gegner: <i>${(B.gegner||[]).map(fname).map(esc).join(', ')||'–'}</i> · Wächter: <i style="color:#ff8a7a">${esc(fname(B.waechter))}</i></div>
   <div class="ref">Fundpool (${(B.fundpool||[]).length}): ${(B.fundpool||[]).map(id=>icon(id,24,'bild k')).join('')||'leer'}${(()=>{const extra=frs.filter(f=>f.schaltet&&f.schaltet.art==='item');return extra.length?` · nach Fragmenten dazu: ${extra.map(f=>icon(f.schaltet.id,24,'bild k')).join('')}`:'';})()}</div>
   ${kr.n&&kr.n!=='Niemand'?`<div class="kzeile" style="--kb:var(--gold)"><b>Krämer: ${esc(kr.n)}</b>, ${esc(kr.ort)}. <span class="zitat">${esc(kr.zeile)}</span></div>`:'<div class="ref">Kein Krämer.</div>'}
   ${B.uebergang?`<div class="ref">Übergang nach unten: <span class="zitat">„${esc(B.uebergang)}“</span></div>`:''}
   <div class="ref">${plural(evs.length,'Ereignis','Ereignisse')} (+ ${EVENTS.filter(e=>e.biom==='alle').length} überall) · ${plural(frs.length,'Fragment','Fragmente')} · Weg-Hinweise für ${Object.keys(B.weg_hinweise||{}).map(k=>RUN.knoten[k]?gi(RUN.knoten[k].zeichen,18):esc(k)).join('')}</div>
  </div>`);
  box.appendChild(t);});}

function eventKachel(e){return `<div class="kachel">${e.stummfilm?`<div class="etiketten">${et('Stummfilm','violett')}</div>`:''}<div class="kn">${esc(e.t)}</div><div class="id">${esc(e.id)}</div>
  <div class="tx">${esc(e.d)}</div>${e.bild?`<div class="ref">Bild: <i>${esc(e.bild)}</i></div>`:''}
  ${e.o.map(o=>`<div class="kzeile" style="--kb:var(--messing2)">› ${esc(o.l)}<div class="ref">${esc(fxListe(o.fx))||'nichts'}${o.if?` · <span style="color:#c8a070">${esc(bedText(o.if))}</span>`:''}</div></div>`).join('')}</div>`;}
function bauEreignisse(){const box=$('eventBox');[...BIOM_IDS,'alle'].forEach(b=>{const list=EVENTS.filter(e=>e.biom===b);if(!list.length)return;
  box.insertAdjacentHTML('beforeend',`<h3 class="unter">${esc(bname(b)).toUpperCase()} <small>${plural(list.length,'Ereignis','Ereignisse')}</small></h3><div class="raster breit">${list.map(eventKachel).join('')}</div>`);});
 const rest=EVENTS.filter(e=>e.biom!=='alle'&&!BIOMES[e.biom]);if(rest.length)box.insertAdjacentHTML('beforeend',`<h3 class="unter">UNBEKANNTES BIOM</h3><div class="raster breit">${rest.map(eventKachel).join('')}</div>`);}

function schaltetText(s){if(!s)return'';if(s.art==='item')return `${icon(s.id,24,'bild k')} Item <i>${esc(iname(s.id))}</i> kommt in den Fundpool`;
 if(s.art==='figur'){const j=JOBS.find(x=>x.id===s.id);return `Hinweis auf die Figur <i>${esc(j?j.n:s.id)}</i>${j&&j.frei_ab?` (frei ab ${j.frei_ab} Fragmenten)`:''}`;}
 if(s.art==='satz')return 'nur ein Satz im Tagebuch';return esc(JSON.stringify(s));}
function bauFragmente(){
 $('fragEinl').innerHTML=`${FRAGS.length} Wandbild-Fragmente, drei je Biom. Gelesen werden sie im Wandbild-Knoten; jedes gelesene Fragment zählt für die Figuren-Freischaltung. Lesefassung: <code>docs/auftrag/fragmente.md</code>.`;
 const box=$('fragBox');BIOM_IDS.forEach(b=>{const list=FRAGS.filter(f=>f.biom===b);if(!list.length)return;
  box.insertAdjacentHTML('beforeend',`<h3 class="unter">${esc(BIOMES[b].n).toUpperCase()}</h3><div class="raster breit">${list.map(f=>`<div class="kachel"><div class="kn">${esc(f.titel)}</div><div class="id">${esc(f.id)}</div>
   <div class="tx"><i>${esc(f.text)}</i></div><div class="ref">Relief: ${esc(f.relief||'–')}</div><div class="kzeile" style="--kb:var(--gold)">${schaltetText(f.schaltet)}</div></div>`).join('')}</div>`);});}

function regelText(E){if(!E)return'–';const o=[];
 if(E.fest)o.push(`fest: ${gi(RUN.knoten[E.fest]?.zeichen||E.fest,18)} ${esc(RUN.knoten[E.fest]?.n||E.fest)}`);
 if(E.fest_wahl)o.push(`genau diese Wege: ${E.fest_wahl.map(a=>`${gi(RUN.knoten[a]?.zeichen||a,18)} ${esc(RUN.knoten[a]?.n||a)}`).join(' · ')}`);
 if(E.pool){const z={};E.pool.forEach(a=>z[a]=(z[a]||0)+1);o.push(`zieht aus: ${Object.entries(z).map(([a,n])=>`<span class="knz">${gi(RUN.knoten[a]?.zeichen||a,18)}${esc(RUN.knoten[a]?.n||a)}${n>1?` (${n}×)`:''}</span>`).join('')}`);}
 if(E.wege)o.push(`${E.wege[0]}–${E.wege[1]} Wege`);
 if(E.mindestens)o.push('mindestens '+Object.entries(E.mindestens).map(([a,n])=>`${n}× ${esc(RUN.knoten[a]?.n||a)}`).join(', '));
 if(E.verschiedene)o.push(`mindestens ${E.verschiedene} verschiedene Arten`);
 if(E.einer_von)o.push(`mindestens einer von: ${E.einer_von.map(a=>esc(RUN.knoten[a]?.n||a)).join(', ')}`);
 return o.join(' · ');}
function bauAblauf(){const tf=aktTiefen();const Z=RUN.kaempfe.zahl;
 $('akte').innerHTML=RUN.akte.map((a,i)=>`<div class="kachel ${i===RUN.akte.length-1?'selten':''}"><div class="kn k">${esc(a.n).toUpperCase()}</div><div class="kn">${esc(a.titel)}</div>
  <div class="mt">Tiefe ${tf[i][0]}–${tf[i][1]}</div>
  <div class="ref">${a.biome.map(b=>`<i>${esc(BIOMES[b]?.kurz||b)}</i>`).join(' oder ')}${a.biome.length>1?(a.wahl==='figur'?` · Vorliebe der Figur mit ${Math.round((a.vorliebe||.7)*100)} %`:' · per Seed 50/50'):''}</div>
  ${a.ebenen.map((k,j)=>{const E=RUN.ebenen[k];const n=Z[i]&&k.startsWith('e')?Z[i][Math.min(j,Z[i].length-1)]:null;
   return `<div class="ebene"><div class="en">EBENE ${j+1} · ${esc(k)}${n?` · ${n} Gegner`:''}</div><div class="ref">${regelText(E)}</div></div>`;}).join('')}
  <div class="ref">Wächter: <i style="color:#ff8a7a">${a.biome.map(b=>esc(fname(BIOMES[b]?.waechter))).join(' / ')}</i></div></div>`).join('');
 $('ebenenTab').innerHTML=`<table class="tab"><tr><th>Ebene</th><th>Regel</th><th>in Akten</th></tr>${Object.entries(RUN.ebenen).filter(([k])=>!k.startsWith('_')).map(([k,E])=>`<tr><td><code>${esc(k)}</code></td><td>${regelText(E)}</td><td>${RUN.akte.filter(a=>a.ebenen.includes(k)).map(a=>esc(a.n)).join(', ')}</td></tr>`).join('')}</table>`;
 const maxE=Math.max(...Z.map(r=>r.length));
 $('kampfTab').innerHTML=`<table class="tab"><tr><th>Akt</th>${[...Array(maxE).keys()].map(j=>`<th>Ebene ${j+1}</th>`).join('')}<th>Schwerer Kampf</th></tr>${Z.map((r,i)=>`<tr><td>${esc(RUN.akte[i]?.n||i)}</td>${r.map(v=>`<td class="z">${v}</td>`).join('')}<td class="z">+${RUN.kaempfe.schwer_extra}</td></tr>`).join('')}</table><p class="einl">${esc(RUN.kaempfe._doc||'')} Höchstens vier Gegner gleichzeitig.</p>`;
 $('knotenRaster').innerHTML=Object.entries(RUN.knoten).filter(([k])=>!k.startsWith('_')).map(([k,kn])=>{const hw=BIOM_IDS.reduce((s,b)=>s+((BIOMES[b].weg_hinweise||{})[k]||[]).length,0);
  return `<div class="kachel" style="align-items:center;text-align:center">${gi(kn.zeichen,36)}<div class="kn">${esc(kn.n)}</div><div class="id">${k} · Zeichen "${esc(kn.zeichen)}"</div><div class="ref">${plural(hw,'Weg-Hinweis','Weg-Hinweise')} in den Biomen</div></div>`;}).join('');
 const SV=RUN.startvarianten||[],SU=RUN.stufen||{};
 $('metaRaster').innerHTML=SV.map(v=>`<div class="kachel"><div class="kopf"><div class="kn">${esc(v.n)}</div>${et(v.ab_akt?`frei ab ${RUN.akte[v.ab_akt]?.n||'Akt '+v.ab_akt}`:'ab Akt I','gold')}</div><div class="tx">${esc(v.t)}</div><div class="ref">${esc(fxListe(v.fx))}</div></div>`).join('')
  +`<div class="kachel"><div class="kn">Schwierigkeitsstufen</div><div class="tx">Nach dem ersten Sieg wählbar, bis Stufe ${romanN((SU.max||0)+1)}. Je Stufe +${Math.round((SU.hp_je_stufe||0)*100)} % Gegnerleben, ab Stufe 2 alle ${SU.atk_alle_n_stufen} Stufen +1 Angriff.</div></div>`
  +`<div class="kachel"><div class="kn">Rast und Fundstelle</div><div class="tx">Rast: schlafen (+${Math.round(RUN.rast.heil_anteil*100)} % vom max. Leben) oder ein Item verbessern (+${BAL.forge.bump}). Fundstelle: ein Item oder ${RUN.fundstelle.gold.join('–')} Gold, mit ${Math.round(RUN.fundstelle.haken_chance*100)} % ein Haken (−${RUN.fundstelle.haken_schaden} Leben).</div></div>`
  +`<div class="kachel"><div class="kn">${esc(RUN.strand.titel)}</div><div class="tx"><i>${esc(RUN.strand.text)}</i></div><div class="ref">Nach einer Niederlage.</div></div>`
  +`<div class="kachel"><div class="kn">Ankunft</div><div class="tx"><i>${esc(RUN.ankunft.bild)}</i></div><div class="ref">${esc(RUN.ankunft.bleiben.knopf)}: <i>${esc(RUN.ankunft.bleiben.text)}</i> · ${esc(RUN.ankunft.umkehren.knopf)}: <i>${esc(RUN.ankunft.umkehren.text)}</i></div></div>`;
 const SH=BAL.shop,G=BAL.gold_per_victory,WB=BAL.waechter_belohnung||{};
 $('balLegende').innerHTML=`Start: ${BAL.start_hp} Leben, ${BAL.energy_per_turn} Energie pro Zug, ${BAL.hand_size} Handkarten, ${BAL.start_slots} von ${BAL.max_slots} Slots je Bereich, Rucksack ${BAL.bag_size}. Nach jedem Sieg +${Math.round(BAL.victory_heal_pct*100)} % Leben, Gold ${G.min}–${G.max} +${G.per_enemy} je Gegner${WB.gold?`, Wächter ${WB.gold.join('–')} Gold${WB.selten?' und ein seltenes Item in der Auswahl':''}`:''}, Wahl aus ${BAL.rewards.choices} Funden (selten ab Tiefe ${BAL.rewards.rare_from_depth} mit ${Math.round(BAL.rewards.rare_chance*100)} %). Krämer: ${SH.normal_items} Items für ${SH.normal_price.join('–')} Gold, ${SH.rare_items} seltenes für ${SH.rare_price}, Laudanum +${SH.heal.v} Leben für ${SH.heal.price}, Karte streichen für ${SH.streichen_preis}. Werkstatt: zwei Items verschmelzen, Werte +${BAL.forge.bump}, höchstens ${BAL.forge.max_stoffe} Stoffe${BAL.forge.double_needs_reaction?', zwei Stoffe nur, wenn sie reagieren':''}.`;}

function bauZustaende(){
 const cardsWith=q=>Object.values(ITEMS).filter(d=>d.cards.some(c=>c[q])).map(d=>d.n);
 const rxWith=pred=>[...REACT,...HOCH].filter(r=>(r.fx||[]).some(pred)).map(r=>r.n);
 const L=[
  {k:'burn',n:'Brand',t:'Gegner nimmt zu Beginn seines Zugs so viel Schaden, dann sinkt Brand um 1.',src:[...cardsWith('burn'),...rxWith(f=>f.status==='burn')]},
  {k:'poison',n:'Gift',t:'Wie Brand: Schaden zu Beginn des Gegnerzugs, dann −1. Manche Reaktionen machen daraus viel mehr.',src:[...cardsWith('poison'),...rxWith(f=>f.status==='poison'||f.op.startsWith('poison'))]},
  {k:'weak',n:'Geschwächt',t:'Der nächste Angriff des Gegners macht nur halben Schaden (Absicht durchgestrichen).',src:[...cardsWith('weak'),...rxWith(f=>f.status==='weak')]},
  {k:'blk',n:'Block',t:'Fängt Schaden ab. Spieler-Block gilt bis zum nächsten eigenen Zug, Gegner-Block bis zu seinem nächsten Zug. Im Balken schraffiert.',src:[...cardsWith('blk'),...cardsWith('strip').map(n=>n+' (Block weg)'),...rxWith(f=>f.op==='block')]},
  {k:'blk',n:'Schutz im nächsten Zug',t:'Block, der erst zu Beginn deines nächsten Zugs ankommt.',src:rxWith(f=>f.op==='ward')},
  {k:'buff',n:'Stärke',t:'Gegner-Angriffe machen dauerhaft mehr Schaden.',src:Object.values(FOES).filter(f=>f.pat.some(p=>p.t==='buff')).map(f=>f.n)},
  {k:'gold',n:'Schwachstelle',t:'Karten mit dem Stoff, gegen den ein Gegner schwach ist, machen 1,5-fachen Schaden.',src:Object.values(FOES).map(f=>`${f.n} (${ST[f.weak].n})`)},
  {k:'heal',n:'Eigenes Leben',t:'Manche Karten und Reaktionen kosten Leben. Du fällst dadurch nie unter 1.',src:[...cardsWith('self'),...REACT.filter(r=>r.pre&&r.pre.self_damage).map(r=>r.n)]}];
 $('statusRaster').innerHTML=L.map(s=>`<div class="kachel"><div class="kopf">${gi(s.k,27)}<div class="kn k">${s.n.toUpperCase()}</div></div><div class="tx">${s.t}</div><div class="ref">Quellen: <i>${esc([...new Set(s.src)].join(', ')||'–')}</i></div></div>`).join('')
  +`<div class="kachel"><div class="kn k">ABSICHTEN DER GEGNER</div>${musterHtml([{t:'atk',v:7},{t:'atk',v:4,h:3},{t:'blk',v:8},{t:'buff',v:2}])}<div class="abs-reihe"><div class="feind"><div class="abs">${absicht({pat:[{t:'atk',v:9}],pi:0,str:0,weak2:1}).html}</div></div><span class="ref">geschwächt</span></div><div class="tx">Über jedem Gegner steht, was er im nächsten Zug tut: Zeichen und Zahl, ohne Wort.</div></div>`;}

// Ideen aus data/ideas.json, übernommene und gestrichene sichtbar markiert
async function bauIdeen(){let L=[];try{const r=await fetch('data/ideas.json',{cache:'no-store'});if(r.ok)L=await r.json();}catch(e){}
 const box=$('ideenBox');if(!L.length){box.innerHTML='<div class="leer">Noch keine Ideen eingetragen. Neue Einträge in <code>data/ideas.json</code> erscheinen hier.</div>';return;}
 const inSpiel=i=>{const n=(i.n||'').replace(/^Rolle:\s*/,'');return Object.values(ITEMS).some(d=>d.n===n)||JOBS.some(j=>j.n===n);};
 const art=i=>{const s=(i.status||'').toLowerCase();if(s.startsWith('übernommen'))return'uebernommen';if(s.startsWith('gestrichen'))return'gestrichen';return inSpiel(i)?'imspiel':'offen';};
 const gruppen=[['offen','NOCH OFFEN'],['imspiel','OFFEN, ABER GLEICHNAMIG IM SPIEL'],['uebernommen','ÜBERNOMMEN'],['gestrichen','GESTRICHEN']];
 box.innerHTML=gruppen.map(([g,titel])=>{const list=L.filter(i=>art(i)===g);if(!list.length)return'';
  return `<h3 class="unter">${titel} <small>${list.length}</small></h3><div class="raster">${list.map(i=>{const st=i.st||[];const src=i.px?rasterBild(i.px):i.spr?spr(i.spr):null;
   const statusEt=g==='uebernommen'?et(esc(i.status),'gruen'):g==='gestrichen'?et(esc(i.status),'rot'):g==='imspiel'?et('Name im Spiel, status fehlt','gold'):et('offen');
   return `<div class="kachel idee ${g==='uebernommen'?'uebernommen':g==='gestrichen'?'gestrichen':''}"><div class="kopf">${src?`<img class="bild" src="${src}" width="48" height="48" alt="">`:''}<div><div class="kn">${esc(i.n)}</div><div>${st.length?glyphs(st):''} ${i.a?`<span class="ref">${esc(AREA_N[i.a]||i.a)}</span>`:''}</div></div></div>
    <div class="etiketten">${et(esc(i.kind||'idee'),'blau')}${statusEt}</div><div class="tx">${esc(i.d)}</div>${(i.cards||[]).map(c=>kartenZeile(c,st)).join('')}
    ${i.notes?`<div class="ref">${esc(i.notes)}</div>`:''}</div>`;}).join('')}</div>`;}).join('');}

// Suche: blendet Kacheln aus, die den Text nicht enthalten
function sucheEinrichten(){$('q').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();
 document.querySelectorAll('#seite section .kachel').forEach(t=>t.classList.toggle('versteckt',!!q&&!t.textContent.toLowerCase().includes(q)));
 document.querySelectorAll('#seite section h3.unter').forEach(h=>{const n=h.nextElementSibling;if(!n)return;const ts=n.querySelectorAll('.kachel');h.classList.toggle('versteckt',!!q&&ts.length>0&&[...ts].every(t=>t.classList.contains('versteckt')));});
 document.querySelectorAll('#seite section').forEach(s=>{const ts=s.querySelectorAll('.kachel');s.classList.toggle('versteckt',!!q&&ts.length>0&&[...ts].every(t=>t.classList.contains('versteckt')));});});}

(async()=>{
 try{await loadData();}catch(err){document.body.insertAdjacentHTML('afterbegin',`<div style="padding:20px;color:#ff8a7a;font:16px monospace">Daten konnten nicht geladen werden (${esc(err.message)}).<br>Bitte über einen lokalen Server öffnen (start.command / start.bat oder: python3 -m http.server im Ordner prototype).</div>`);return;}
 // Hintergründe der Biom-Pakete nachladen (im Spiel macht das main.js)
 for(const p of (typeof PAKETE!=='undefined'?PAKETE:[]))for(const src of p.skripte||[])await new Promise(res=>{const sc=document.createElement('script');sc.src=src;sc.onload=res;sc.onerror=res;document.head.appendChild(sc);});
 const reihe=RUN.akte.flatMap(a=>a.biome);BIOM_IDS=Object.keys(BIOMES).filter(k=>!k.startsWith('_')).sort((x,y)=>((BIOMES[x].akt??9)-(BIOMES[y].akt??9))||((reihe.indexOf(x)+99)%99-(reihe.indexOf(y)+99)%99));
 const schritte=[bauZahlen,bauStoffe,bauReaktionen,bauItems,bauHandgriffe,bauSets,bauFiguren,bauGegner,bauBiome,bauEreignisse,bauFragmente,bauAblauf,bauZustaende];
 for(const f of schritte){try{f();}catch(e){console.warn('Artboard:',f.name,e);}}
 try{await bauIdeen();}catch(e){console.warn('Artboard: Ideen',e);}
 sucheEinrichten();
 // Hintergründe nacheinander bauen
 const naechste=()=>{const f=warte.shift();if(!f)return;f();setTimeout(naechste,30);};setTimeout(naechste,50);
 // Sprites: alle einmal, danach nur sichtbare
 const sicht=new WeakSet();const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?sicht.add(e.target):sicht.delete(e.target)));anims.forEach(a=>io.observe(a.c));
 const t0=performance.now();
 const loop=now=>{const t=(now-t0)/1000;anims.forEach(a=>{if(a.fertig&&!sicht.has(a.c))return;if(a.f(t))a.fertig=true;});requestAnimationFrame(loop);};requestAnimationFrame(loop);
})();
})();
