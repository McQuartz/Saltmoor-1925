// UI-Bausteine. Jede Funktion bekommt Daten und gibt HTML zurück, ohne den Spielzustand zu ändern.
// gallery.html zeigt jeden Baustein einzeln. In Godot wird jeder Baustein eine eigene Szene (.tscn).
const $=id=>document.getElementById(id);

// --- Absicht-Icons (9x9 Pixel) ---
const ICON={
 atk:['.......ww','......wGw','.....wGw.','.k..wGw..','.kkwGw...','..kbw....','..bkk....','.bb.kk...','bb.......'],
 blk:['.bbbbbbb.','bGGGGGGGb','bGgGGGgGb','bGgggggGb','bGGGgGGGb','.bGGgGGb.','.bGGGGGb.','..bGGGb..','...bbb...'],
 buff:['....r....','...rRr...','..rRRRr..','.rRRRRRr.','....R....','....R....','....R....','....R....','.........']
};
const icoCache={};
function ico(n){if(icoCache[n])return icoCache[n];const gr=ICON[n];const[c,x]=cnv(gr[0].length,gr.length);gr.forEach((row,y)=>[...row].forEach((ch,i)=>{if(PAL[ch]){x.fillStyle=PAL[ch];x.fillRect(i,y,1,1);}}));return icoCache[n]=c.toDataURL();}

// --- Lebensbalken (Gegner und Spieler) ---
function hpBarHtml(hp,max){return `<div class="hpbar"><i style="width:${hp/max*100}%"></i><span>${hp}/${max}</span></div>`;}
// --- Block-Anzeige des Spielers ---
function blockBadgeHtml(v){return `<div class="blockbadge">${v?'◆ '+v+' BLOCK':''}</div>`;}
// --- Statuswerte eines Gegners (Block, Stärke, Brand, Gift, Geschwächt) ---
function tagsHtml(e){let s='';if(e.block)s+=`<span style="color:#9cc3ff">Block ${e.block}</span>`;if(e.str)s+=`<span style="color:#ff9a8a">Stärke +${e.str}</span>`;if(e.burn)s+=`<span style="color:#ffb35a">Brand ${e.burn}</span>`;if(e.poison)s+=`<span style="color:#9be07a">Gift ${e.poison}</span>`;if(e.weak2)s+=`<span style="color:#c9b8e8">Geschwächt</span>`;return s;}
// --- Absicht des Gegners für den nächsten Zug ---
function intentOf(e,it){it=it||e.pat[e.pi%e.pat.length];if(it.t==='atk'){let v=it.v+e.str;if(e.weak2)v=Math.floor(v/2);return{k:'atk',t:`${v}${it.h?'×'+it.h:''}`,l:`Angriff ${v}${it.h?'×'+it.h:''}`};}if(it.t==='blk')return{k:'blk',t:`${it.v}`,l:`Block ${it.v}`};return{k:'buff',t:`+${it.v}`,l:`Kraft +${it.v}`};}
function intentHtml(it){return `<div class="intent ${it.k}"><img src="${ico(it.k)}" alt="">${it.t}</div>`;}
// --- Gegner-Info über dem Sprite: Absicht, Name, Schwachstelle, Leben, Status ---
function enemyInfoHtml(e,showIntent){return `<div class="info">${showIntent?intentHtml(intentOf(e)):''}<div class="nm">${e.n} <span title="Schwachstelle">${chip(e.weak)}</span></div>${hpBarHtml(e.hp,e.max)}<div class="tags">${tagsHtml(e)}</div></div>`;}
// --- Energie als Kerzen ---
function energyHtml(n){return `<div class="energy">${[...Array(Math.max(3,n))].map((_,i)=>`<div class="candle ${i<n?'':'off'}"></div>`).join('')}<span>${n}</span></div>`;}
function playerHpHtml(hp,max){return `<div class="hp"><span class="heart">♥</span><div class="hpbar"><i style="width:${hp/max*100}%"></i><span>${hp} / ${max}</span></div></div>`;}

// --- Karte ---
function cardText(c){const p=[];if(c.atk)p.push(`${c.atk}${c.h?'×'+c.h:''} Schaden${c.all?' an allen':''}`);if(c.blk)p.push(`${c.blk} Block`);if(c.heal)p.push(`+${c.heal} Leben`);if(c.poison)p.push(`Gift ${c.poison}`);if(c.burn)p.push(`Brand ${c.burn}`);if(c.draw)p.push(`Ziehe ${c.draw}`);if(c.en)p.push(`+${c.en} Energie`);if(c.self)p.push(`Kostet ${c.self} Leben`);return p.join(', ')+'.';}
function rxLabel(rx,disc){return rx.map(r=>disc.has(r.n)?r.n:'???').join(' + ');}
// o: {i, cost, rx (Reaktionen mit der Karte davor), disc (entdeckte Reaktionen), off (zu teuer), fan (Position im Fächer), delay (ms für die Austeil-Animation, null = keine)}
function cardHtml(c,o={}){const rx=o.rx||[],fan=o.fan||0;const cb=c.st[0]?ST[c.st[0]].c:'#6a5a3a';
 return `<div class="card ${o.off?'no':''} ${rx.length?'react':''}" ${o.i!=null?`data-card="${o.i}"`:''} style="--r:${fan*4.5}deg;--y:${fan*fan*4}px;--cb:${cb};${o.delay!=null?`animation-delay:${o.delay}ms`:'animation:none'}"><div class="cost">${o.cost??c.c}</div><div class="cn">${c.n}</div>
 <div class="art"><img src="${spr(c.spr)}" alt=""><div class="sts">${c.st.map(chip).join('')}</div></div><div class="ct">${cardText(c)}</div>${rx.length?`<div class="rx">⚡ ${rxLabel(rx,o.disc||new Set())}</div>`:''}<div class="src">${c.src||''}</div></div>`;}

// --- Item und Slot (Ausrüstung, Rucksack, Werkbank) ---
function itemDefHtml(d,uid){return `<div class="item ${d.bases?'merged':''} ${d.st.length>1?'duo':''}" ${uid!=null?`data-uid="${uid}"`:''}><img src="${spr(d.spr)}" alt=""><div class="sts">${d.st.map(chip).join('')}</div>${d.lvl?`<span class="lv">${'+'.repeat(Math.min(3,d.lvl))}</span>`:''}</div>`;}
function itemHtml(it){return itemDefHtml(def(it),it.uid);}
// d = Item-Daten oder null, loc = Ort wie "bag:2" (leer lassen für Vorschau), locked = Slot noch nicht freigeschaltet
function slotViewHtml(d,loc,{locked=false,sel=false}={}){let cls='slot';if(locked)cls+=' locked';if(sel)cls+=' sel';return `<div class="${cls}" ${locked||!loc?'':`data-loc="${loc}"`}>${d&&!locked?itemDefHtml(d):''}</div>`;}
function slotHtml(loc,locked){const it=locked?null:getAt(loc);return slotViewHtml(it?def(it):null,loc,{locked,sel:S.sel===loc});}
// --- Fund / Kaufangebot ---
function pickHtml(id,attr,extra=''){const d=ITEMS[id];const extraCost=d.st.length>1?BAL.forge.double_cost_extra:0;
 return `<div class="pick ${d.rare?'rare':''}" ${attr}>${d.rare?`<div class="rl">SELTEN · 2 STOFFE<br>KARTEN +${extraCost} ENERGIE</div>`:''}<img src="${spr(d.spr)}"><div class="n">${d.n}</div><div>${d.st.map(chip).join('')||'<span class="hint">kein Stoff</span>'}</div><div class="s">${AREA_N[d.a]}<br>${d.cards.map(c=>c.n+' ('+(c.c+extraCost)+'): '+cardText(c)).join(' ')}</div>${extra}</div>`;}

// --- Schwebende Zahlen (Schaden, Heilung, Block) ---
const FLOAT_COL={dmg:'#ff6a5a',big:'#ffd23f',heal:'#7dff8a',block:'#9cc3ff',hurt:'#ff5a4a'};
function floatAt(el,txt,col,k=0){if(!el)return;const r=el.getBoundingClientRect();const f=document.createElement('div');f.className='float';f.textContent=txt;f.style.color=col;
 f.style.left=(r.left+r.width/2+(Math.random()-.5)*40)+'px';f.style.top=(r.top+r.height*.35+(Math.random()-.5)*16)+'px';f.style.fontSize=(14+Math.min(18,k))+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1000);}
function shakeEl(el){if(!el)return;el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');}
// --- Meldung oben in der Szene (Reaktionen, Beute) ---
function toast(a,b,hoch){const t=$('toast');if(!t)return;const d=document.createElement('div');d.className='tst'+(hoch?' hoch':'');d.innerHTML=`${a}<small>${b||''}</small>`;t.appendChild(d);setTimeout(()=>d.remove(),2600);while(t.children.length>3)t.firstChild.remove();}
function vig(){const v=$('vig');if(!v)return;v.classList.remove('on');void v.offsetWidth;v.classList.add('on');}

// --- Ketten-Anzeige: was hat womit reagiert und warum ---
function chainHtml(L,turnNo){let h='<h5>KETTE · WAS REAGIERT MIT WAS</h5>';
 if(!L.length)return h+'<div class="ce"><span class="none">Noch keine Karte gespielt. Zwei Karten direkt nacheinander reagieren über ihre Stoffe.</span></div>';
 let lastTurn=null;const cnt={};L.forEach(e=>{cnt[e.turn]=(cnt[e.turn]||0)+1;e.no=cnt[e.turn];});
 [...L].reverse().forEach((e,j)=>{if(e.turn!==lastTurn){h+=`<div class="tn">ZUG ${e.turn}${e.turn===turnNo?' · JETZT':''}</div>`;lastTurn=e.turn;}
  h+=`<div class="ce ${j?'old':''} ${e.turn!==turnNo?'prev':''}"><div class="cn2">${e.no}. ${e.n} ${e.st.map(chip).join('')||'<i>kein Stoff</i>'}</div>${e.rx.length?e.rx.map(r=>`<div class="rr ${r.kind}">${r.keys.map(chip).join(' + ')} → ${r.n}<small>${r.src}. ${r.t}</small></div>`).join(''):`<div class="none">${e.no===1?'erste Karte im Zug, nichts davor':e.st.length&&e.prev.length?'keine Reaktion: '+e.prev.map(chip).join('')+' und '+e.st.map(chip).join('')+' passen nicht':'keine Reaktion: eine der Karten hat keinen Stoff'}</div>`}</div>`;});
 return h;}
