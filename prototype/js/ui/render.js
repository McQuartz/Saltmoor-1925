// Setzt die Bildschirme aus den Bausteinen in components.js zusammen: Kampf-HUD, Hand, Rast, Krämer, Ereignis, Ausrüstung.
let dealAnim=false;
function enEl(e){return document.querySelector(`.enemy[data-ei="${S.enemies.indexOf(e)}"]`);}
function upd(e){const el=enEl(e);if(!el)return;const b=el.querySelector('.hpbar>i'),s=el.querySelector('.hpbar>span');if(b)b.style.width=(e.hp/e.max*100)+'%';if(s)s.textContent=`${e.hp}/${e.max}`;const t=el.querySelector('.tags');if(t)t.innerHTML=tagsHtml(e);}

function render(){
 if(S.phase==='start')return renderStart();
 const f=S.phase==='fight';
 $('where').innerHTML=`TIEFE ${S.depth}<small>${place(S.depth)} · ${S.job}</small>`;
 $('chainbox').innerHTML=f?chainHtml(S.chainLog||[],S.turnNo):'';
 $('log').innerHTML=S.log.slice(0,3).map((l,i)=>`<div style="opacity:${1-i*.22}">${l}</div>`).join('');
 $('title').className=S.phase==='over'?'dead':'';$('title').innerHTML=S.phase==='over'?'<b>DIE TIEFE</b><b>BEHÄLT DICH</b>':'';
 renderFoes(f);renderHud(f);renderHand(f);renderPanel();renderGear(f);
}
function renderFoes(f){
 if(!(f||S.phase==='over')){$('foes').innerHTML='';return;}
 if(f)tgt();const n=S.enemies.length;
 $('foes').innerHTML=S.enemies.map((e,i)=>{const p=enemyPos(i,n,e);
  return `<div class="enemy ${e.hp<=0?'dead':''}" data-ei="${i}" style="left:${(p.x-p.w/2)/W*100}%;top:${(p.y-p.h)/H*100}%;width:${p.w/W*100}%;height:${p.h/H*100}%">${enemyInfoHtml(e,e.hp>0&&f)}</div>`;}).join('');}
function renderHud(f){const m=maxHp();
 $('hud').innerHTML=`<div class="me">
   ${f?`${energyHtml(S.energy)}<div class="chain">Kette: ${S.last.length?S.last.map(chip).join(''):'–'}</div>`:''}
   <div class="gold">${S.gold?'● '+S.gold+' GOLD':''}</div>${blockBadgeHtml(f?S.block:0)}
   ${playerHpHtml(S.hp,m)}</div>
  ${f?`<button id="endBtn" data-act="end" ${busy?'disabled':''}>ZUG BEENDEN</button>`:'<span></span>'}`;}
function renderHand(f){const hand=$('hand');
 if(f&&S.hand.length){hand.classList.remove('empty');const n=S.hand.length;
  hand.innerHTML=S.hand.map((c,i)=>{const cost=cardCost(c);return cardHtml(c,{i,cost,rx:reactionsFor(S.last,c.st),disc:S.disc,off:S.energy<cost,fan:i-(n-1)/2,delay:dealAnim?i*60:null});}).join('');}
 else{hand.classList.toggle('empty',!f);hand.innerHTML='';}
 dealAnim=false;}
function renderPanel(){const P=$('panel');
 if(S.phase==='reward')P.innerHTML=restHtml();
 else if(S.phase==='event'){const ev=S.event;P.innerHTML=`<h2>${ev.t.toUpperCase()}</h2><p>${ev.d}</p>${ev.o.map((o,i)=>`<button class="opt" data-ev="${i}" ${condOk(o.if)?'':'disabled'}>› ${o.l}</button>`).join('')}`;}
 else if(S.phase==='over')P.innerHTML=`<p>Du bist auf Tiefe ${S.depth} gestorben. ${S.disc.size} von ${REACT.length+HOCH.length+1} Reaktionen entdeckt.</p><button data-act="restart">NEUER RUN</button>`;
 else P.innerHTML='';}
function restHtml(){
 return `<h2>${S.workshop?'VERLASSENE WERKSTATT':S.shop?'LAGERFEUER MIT KRÄMER':'LAGERFEUER'}</h2>${S.workshop?'<p style="color:var(--eld)">Zwischen verrosteten Schraubstöcken steht eine Werkbank, die noch funktioniert. Hier kannst du einmal verschmelzen.</p>':''}<p class="hint">Hier darfst du umrüsten. Deine Karten im nächsten Kampf kommen nur aus dem, was du anlegst.</p><div class="cols">
  <div class="col"><h2>FUND</h2>${S.picked?'<p class="hint">Eingesteckt.</p>':`<div class="picks">${S.reward.map(id=>pickHtml(id,`data-take="${id}"`)).join('')}</div><p><button data-take="">Nichts nehmen</button></p>`}</div>
  <div class="col"><h2>ALS NÄCHSTES</h2><p class="hint">Weiter unten im Nebel wartet:</p><div class="next">${(S.nextIds||[]).map(id=>{const F=FOES[id];const fake={str:0,weak2:0};return `<div class="foe"><div class="n">${F.n}</div>Schwachstelle ${chip(F.weak)}<br><span class="hint">Muster: ${F.pat.map(pt=>intentOf(fake,pt).l).join(' · ')}</span></div>`;}).join('')}</div></div></div>
  ${S.shop?shopHtml():''}
  ${S.workshop?benchHtml():`<p class="hint" style="margin-top:16px">Keine Werkbank hier. Die nächste verlassene Werkstatt liegt auf Tiefe ${nextShop()}.</p>`}
  <p><button data-act="go">WEITER IN DIE TIEFE ›</button></p>`;}
function benchHtml(){const p=forgePreview();const F=BAL.forge;
 return `<h2 style="margin-top:16px">WERKBANK</h2><p class="hint">${S.forged?'Für diese Rast hast du schon verschmolzen.':'Zieh zwei Items auf die Werkbank. Einmal pro Rast.'}</p>
  <div class="bench">${slotHtml('bench:0')}<span class="plus">+</span>${slotHtml('bench:1')}<div class="preview">${S.forged?'<b>Fertig.</b> Zieh das neue Item in deine Ausrüstung.':p?(p.err?`<span style="color:#ff8a7a">${p.err}</span>`:`<b>${p.n}</b><br>${p.st.map(chip).join('')||'<span class="hint">kein Stoff</span>'}<br>${p.same?`<b style="color:#ffb35a">STUFE:</b> gleicher Stoff, ${p.cards.length} Karten, je +${F.bump} Wert`:`<b style="color:#ffd23f">DOPPEL-ITEM:</b> zwei Stoffe, ${p.cards.length} Karten, je +${F.bump} Wert, aber jede Karte kostet ${F.double_cost_extra} Energie mehr`}${p.rx.length?'<br>Reagiert in sich: '+rxLabel(p.rx,S.disc):''}`):`<span class="hint">Gleicher Stoff + gleicher Stoff = stärkere Stufe.<br>Stoffe, die reagieren = Doppel-Item (Premium, Karten +${F.double_cost_extra} Energie).<br>Das erste Item gibt Name und Bereich vor.</span>`}</div>
  <button data-act="forge" ${!p||p.err||S.forged?'disabled':''}>VERSCHMELZEN</button></div>`;}
function shopHtml(){const H=BAL.shop.heal;
 return `<div class="col" style="margin-top:16px;border-color:#5a4a20"><h2>KRÄMER</h2><p class="hint">Ein alter Mann mit einem Karren voller Dinge, die er nicht verkaufen sollte. Du hast <b style="color:var(--gold)">${S.gold} Gold</b>.</p><div class="picks">${S.shopItems.map((o,i)=>pickHtml(o.id,`data-buy="${i}"`,`<div class="price">${o.sold?'VERKAUFT':o.price+' GOLD'}</div>`).replace('class="pick ',`class="pick ${o.sold?'sold ':''}`)).join('')}
 <div class="pick ${S.shopHeal?'sold':''}" data-buy="heal"><div class="n" style="margin-top:14px">Laudanum</div><div class="s">+${H.v} Leben</div><div class="price">${S.shopHeal?'VERKAUFT':H.price+' GOLD'}</div></div></div></div>`;}
// Ausrüstung (drei Bereiche), Rucksack mit Müll, Rollen
function renderGear(f){const rs=roleState().filter(x=>x.have.length);const M=BAL.max_slots;
 $('gear').innerHTML=AREAS.map(a=>`<div class="area"><h3>${AREA_N[a]} <em>${S.slots[a]}/${M}</em></h3><div class="slots">${[...Array(M).keys()].map(i=>slotHtml(a+':'+i,i>=S.slots[a])).join('')}</div></div>`).join('')
  +`<div class="area" id="bagrow"><h3>RUCKSACK <em>${f?'Im Kampf ist die Ausrüstung fest.':'Ziehen oder anklicken zum Tauschen.'}</em></h3><div class="slots">${S.bag.map((_,i)=>slotHtml('bag:'+i)).join('')}<div class="slot trash" data-loc="trash">Müll</div></div></div>
  <div class="area"><h3>ROLLEN</h3><div id="roles">${rs.map(x=>`<div class="${x.on?'on':''}"><b>${x.r.n} ${x.have.length}/${x.r.i.length}</b> ${x.on?x.r.t:'· fehlt: '+x.r.i.filter(i=>!x.have.includes(i)).map(i=>ITEMS[i].n).join(', ')}</div>`).join('')||'<span class="hint">Trag passende Teile, um eine Rolle zu bilden.</span>'}</div></div>`;}
function renderStart(){
 ['where','chainbox','log','foes','hud','hand','gear'].forEach(id=>$(id).innerHTML='');$('hand').classList.add('empty');
 $('title').className='';$('title').innerHTML='<b>SALTMOOR</b><span>NEUENGLAND · 1925</span>';
 $('panel').innerHTML=`<p>Etwas unter der Stadt ruft. Du bist niemand Besonderes. Du hast nur, was du tragen kannst.</p>
 <p class="hint">Jedes Item bringt Karten mit. Normale Items tragen einen Stoff, seltene Premium-Items zwei. Stoffe sind zum Beispiel ${chip('E')} ${chip('F')} ${chip('S')} ${chip('G')}. Zieh Karten auf die Gegner. Spielst du zwei direkt nacheinander, reagieren ihre Stoffe. Welche Reaktionen es gibt, findest du selbst heraus.</p>
 <div class="picks">${JOBS.map((j,i)=>`<div class="pick" data-job="${i}" style="width:210px"><div>${[...j.w,...j.k,...j.t].map(id=>`<img src="${spr(ITEMS[id].spr)}" style="width:30px;height:30px">`).join('')}</div><div class="n">${j.n}</div><div class="s">${j.d}</div></div>`).join('')}</div>`;}
// Tooltips
const tip=$('tip');
function showTip(h,x,y){tip.innerHTML=h;tip.style.display='block';const w=tip.offsetWidth,hh=tip.offsetHeight;tip.style.left=Math.max(8,Math.min(innerWidth-w-8,x+16))+'px';tip.style.top=(y+hh+24>innerHeight?y-hh-12:y+18)+'px';}
function hideTip(){tip.style.display='none';}
function itemTip(loc){const it=getAt(loc);if(!it)return '';const d=def(it);const[k]=loc.split(':');
 let h=`<div class="n">${d.n}</div><div>${d.st.map(chip).join('')||'<span class="hint">kein Stoff</span>'}</div><div class="hint">${AREA_N[d.a]}${d.hp?' · +'+d.hp+' max. Leben':''}</div>`;
 h+=d.cards.map(c=>`<div>Karte <span style="color:var(--parch)">${c.n}</span> (${c.c}): ${cardText(c)}</div>`).join('');
 const rs=ROLES.filter(r=>(d.bases||[it.id]).some(b=>r.i.includes(b)));if(rs.length)h+=`<div class="hint">Teil von: ${rs.map(r=>r.n).join(', ')}</div>`;
 if(k==='bag'||k==='bench')h+='<div class="hint">Nicht angelegt: bringt keine Karten.</div>';return h;}
function cardTip(i){const c=S.hand[i];if(!c)return '';const rx=reactionsFor(S.last,c.st);if(!rx.length)return '';return rx.map(r=>S.disc.has(r.n)?`<div style="color:var(--eld)">${r.n}: ${r.t}</div>`:'<div style="color:var(--eld)">??? Etwas wird passieren.</div>').join('');}
function bookHtml(){const disc=S.disc||new Set();const all=[VERST,...REACT,...HOCH];
 return `<div class="box"><h2>BUCH DER REAKTIONEN</h2><p class="hint">${[...disc].length} von ${all.length} entdeckt. Stoffe: ${Object.keys(ST).map(k=>chip(k)+' '+ST[k].n).join(' · ')}</p><div class="book">${all.map(r=>{const keys=r.k?[...r.k]:r.s?[...r.s]:null;
  return disc.has(r.n)?`<div><span style="color:var(--eld)">${r.n}</span> ${keys?keys.map(chip).join(' + '):'(gleicher Stoff zweimal)'}: ${r.t}</div>`:`<div class="u">${r.s?'Hochreaktion: drei Stoffe':'???'}</div>`;}).join('')}</div><br><button data-act="closebook">SCHLIESSEN</button></div>`;}
