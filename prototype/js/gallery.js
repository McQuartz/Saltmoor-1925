// Galerie: zeigt alle Bausteine einzeln an. Nutzt dieselben Zeichner und Bausteine wie das Spiel.
const anims=[];// {c,x,draw(t)}
let mouse={x:0,y:0};document.addEventListener('pointermove',e=>{mouse={x:e.clientX,y:e.clientY};});

function foeTile(id,F,variant,info){const big=id==='boss';const v=mkVis(id,variant);v.c.className='spr';v.lx=0;v.ly=0;
 const t=document.createElement('div');t.className='tile';t.appendChild(v.c);
 const pat=F.pat.map(p=>intentOf({str:0,weak2:0},p).l).join(' · ');
 t.insertAdjacentHTML('beforeend',info
  ?`<div class="n">${info.n}</div><div class="meta">${info.d}</div><div class="id">variant: "${variant}"</div><a href="index.html?boss=${variant}&depth=${BAL.encounters.boss_depth}">Im Kampf testen ›</a>`
  :`<div class="n">${F.n}</div><div class="meta">${F.hp} Leben · Schwachstelle ${chip(F.weak)}<br>Muster: ${pat}</div><div class="id">id: "${id}" · ab Tiefe ${BAL.encounters.pool_from_depth[id]??'-'}</div>`);
 const ph=Math.random()*10;
 anims.push(t2=>{if(big){const r=v.c.getBoundingClientRect();const tx=Math.max(-1,Math.min(1,(mouse.x-(r.left+r.width/2))/(r.width/2))),ty=Math.max(-1,Math.min(1,(mouse.y-(r.top+r.height*.57))/(r.height/2)));v.lx+=(tx-v.lx)*.1;v.ly+=(ty-v.ly)*.1;}
  v.lunge=Math.max(0,v.lunge-.016);v.x.clearRect(0,0,v.c.width,v.c.height);const gl=FOE_DRAW[F.spr](v.x,t2+ph,v)||[];finish(v.c,v.x,OUTLINE[F.spr]||'#000',v.hit>0);v.hit=Math.max(0,v.hit-.016);
  gl.forEach(q=>dglow(v.x,q[0],q[1],q[3]*.6,q[2],.5));});
 v.c.title='Klicken: Treffer-Blitz';v.c.style.cursor='pointer';v.c.addEventListener('click',()=>{v.hit=.12;v.lunge=.38;});
 return t;}

function build(){
 // Bosse
 const bg=$('bossGrid');Object.keys(BOSS_VARIANTS).forEach(k=>bg.appendChild(foeTile('boss',FOES.boss,k,BOSS_INFO[k]||{n:k,d:''})));
 // Gegner
 const fg=$('foeGrid');Object.entries(FOES).filter(([id])=>id!=='boss').forEach(([id,F])=>fg.appendChild(foeTile(id,F)));
 // Items
 $('itemGrid').innerHTML=Object.entries(ITEMS).map(([id,d])=>`<div class="tile" style="${d.rare?'border-color:#8a6a1a':''}" title="${d.cards.map(c=>c.n+': '+cardText(c)).join(' | ')}"><img src="${spr(d.spr)}" alt=""><div><div class="n">${d.n}</div><div class="meta">${d.st.map(chip).join('')} ${AREA_N[d.a]}</div><div class="id">${id}</div></div></div>`).join('');
 // UI-Bausteine
 const e1={n:'Kultist',weak:'G',hp:13,max:18,block:4,str:2,burn:3,poison:0,weak2:0,pat:FOES.cultist.pat,pi:0};
 const e2={n:'Fischmensch',weak:'F',hp:30,max:30,block:0,str:0,burn:0,poison:5,weak2:1,pat:[{t:'blk',v:8}],pi:0};
 const spec=(lbl,html,w)=>`<div class="spec" ${w?`style="width:${w}"`:''}><span class="lbl">${lbl}</span>${html}</div>`;
 const D=id=>ITEMS[id];const duo=Object.values(ITEMS).find(d=>d.st.length>1);
 const merged={...D('knife'),n:'Fischmesser +1',bases:['knife','knife'],lvl:1};
 $('uiBox').innerHTML=`<div class="row">
  ${spec('Gegner-Info: enemyInfoHtml()',`<div class="enemy" style="position:relative;width:220px">${enemyInfoHtml(e1,true)}</div>`)}
  ${spec('mit Schutz-Absicht',`<div class="enemy" style="position:relative;width:220px">${enemyInfoHtml(e2,true)}</div>`)}
  ${spec('Absichten: intentHtml()',['atk','blk','buff'].map(k=>intentHtml({k,t:k==='atk'?'7×2':k==='blk'?'8':'+2'})).join(''))}
 </div><div class="row" style="margin-top:22px">
  ${spec('Energie: energyHtml(2)',energyHtml(2))}
  ${spec('Block: blockBadgeHtml(9)',blockBadgeHtml(9))}
  ${spec('Leben: playerHpHtml(27, 44)',`<div style="width:260px">${playerHpHtml(27,44)}</div>`)}
  ${spec('Gegner-Leben: hpBarHtml(5, 18)',`<div style="width:160px">${hpBarHtml(5,18)}</div>`)}
 </div><div class="row" style="margin-top:22px">
  ${spec('Slot leer',slotViewHtml(null,'x'))}${spec('gesperrt',slotViewHtml(null,'x',{locked:true}))}
  ${spec('belegt',slotViewHtml(D('knife'),'x'))}${spec('ausgewählt',slotViewHtml(D('torch'),'x',{sel:true}))}
  ${spec('2 Stoffe',slotViewHtml(duo,'x'))}${spec('verschmolzen +1',slotViewHtml(merged,'x'))}
  ${spec('Müll','<div class="slot trash">Müll</div>')}
 </div><div class="row" style="margin-top:22px">
  ${spec('Fund: pickHtml()',`<div class="picks" style="justify-content:flex-start">${pickHtml('knife','')}${pickHtml(Object.keys(ITEMS).find(k=>ITEMS[k].rare),'')}${pickHtml('torch','','<div class="price">28 GOLD</div>')}</div>`)}
 </div>`;
 // Karten
 const card=(id,i=0)=>{const d=ITEMS[id];return{...d.cards[i],st:[...d.st],src:d.n,spr:d.spr};};
 const disc=new Set([REACT[0].n]);const c1=card('torch'),c2=card('knife'),c3=card(Object.keys(ITEMS).find(k=>ITEMS[k].rare));
 const rx=[REACT[0]];
 $('cardRow').innerHTML=[spec('normal',cardHtml(c2,{cost:c2.c})),spec('reagiert (entdeckt)',cardHtml(c1,{cost:c1.c,rx,disc})),spec('reagiert (unbekannt)',cardHtml(c1,{cost:c1.c,rx,disc:new Set()})),spec('zu teuer',cardHtml(c2,{cost:3,off:true})),spec('2 Stoffe (+1 Energie)',cardHtml(c3,{cost:c3.c+BAL.forge.double_cost_extra}))].join('');
 // Schaden und Meldungen
 const btn=(l,f)=>{const b=document.createElement('button');b.className='sm';b.textContent=l;b.onclick=f;return b;};
 const fb=$('fbRow');const target=document.createElement('div');target.style.cssText='width:160px;height:90px;border:2px dashed #2e3a35;display:flex;align-items:center;justify-content:center;color:#5a6a64';target.textContent='Ziel';fb.appendChild(target);
 [['Treffer 5',()=>floatAt(target,'-5',FLOAT_COL.dmg,5)],['Großer Treffer 14',()=>floatAt(target,'-14',FLOAT_COL.big,14)],['Geblockt',()=>floatAt(target,'BLOCK',FLOAT_COL.block)],['+6 Block',()=>floatAt(target,'+6 BLOCK',FLOAT_COL.block)],['Heilung',()=>floatAt(target,'+8',FLOAT_COL.heal)],['Schwachstelle',()=>floatAt(target,'SCHWACHSTELLE',FLOAT_COL.big,4)],['Spieler getroffen (Rand)',()=>vig()],
  ['Meldung Reaktion',()=>toast(REACT[1].n.toUpperCase()+' · NEU!',[...REACT[1].k].map(chip).join(' + ')+' &nbsp;'+REACT[1].t)],['Meldung Hochreaktion',()=>toast('HOCHREAKTION: '+HOCH[0].n.toUpperCase(),[...HOCH[0].s].map(chip).join(' + ')+' &nbsp;'+HOCH[0].t,true)]].forEach(([l,f])=>fb.appendChild(btn(l,f)));
 const r0=REACT[0];const[a,b]=[...r0.k];
 $('chainbox').innerHTML=chainHtml([{turn:1,n:'Hieb',st:[a],prev:[],rx:[]},{turn:1,n:'Zweite Karte',st:[b],prev:[a],rx:[{n:r0.n,t:r0.t,keys:[a,b],src:`${ST[a].n} von der Karte davor trifft ${ST[b].n}`,kind:''}]},{turn:2,n:'Neue Runde',st:[a],prev:[],rx:[]}],2);
 // Szenen
 const sg=$('sceneGrid');BAL.zones.forEach(z=>{const[c,x]=cnv(W,H);const t=document.createElement('div');t.className='tile';t.appendChild(c);t.insertAdjacentHTML('beforeend',`<div class="n">${z.name}</div><div class="id">zone "${z.id}" · bis Tiefe ${z.until}</div>`);sg.appendChild(t);
  const sc=scene(z.id);anims.push(tt=>{x.drawImage(sc.bg,0,0);sc.back&&sc.back(x,tt);if(sc.midc)x.drawImage(sc.midc,0,0);sc.mid&&sc.mid(x,tt);x.drawImage(sc.fg,0,0);sc.front&&sc.front(x,tt);x.drawImage(VIG,0,0);});});
 // Stoffe
 $('stoffBox').innerHTML=`<p>${Object.keys(ST).map(k=>chip(k)+' '+ST[k].n).join(' &nbsp; ')}</p><div class="book">${[VERST,...REACT,...HOCH].map(r=>`<div><span style="color:${r.s?'#ffd23f':'var(--eld)'}">${r.n}</span> ${r.k?[...r.k].map(chip).join(' + '):r.s?[...r.s].map(chip).join(' + '):'(gleicher Stoff zweimal)'}: ${r.t}</div>`).join('')}</div>`;
}
(async()=>{await loadData();build();let t0=performance.now();let i=0;
 // Szenen-Animationen sind teuer: nur jedes dritte Bild neu zeichnen
 const loop=now=>{const t=(now-t0)/1000;i++;anims.forEach((f,k)=>{if(f.length&&(k<Object.keys(FOES).length+Object.keys(BOSS_VARIANTS).length||i%3===0))f(t);});requestAnimationFrame(loop);};requestAnimationFrame(loop);})();
