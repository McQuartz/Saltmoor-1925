// Überlagerungen (aus oberflaeche.js geteilt, Auftrag 3 M2): Buch der Reaktionen, Tagebuch, Einstellungen, Rucksackmodus, Hover-Vorschau.
// ---------- Überlagerungen: Buch der Reaktionen, Tagebuch, Einstellungen ----------
function buchHtml(){const disc=S.disc||new Set();const all=allRx();
 return box('buch',`<h2>BUCH DER REAKTIONEN</h2><p class="hint">${[...disc].length} von ${all.length} entdeckt.</p><div class="stoffe">${Object.keys(ST).map(k=>`${gi(k,KZ())} ${ST[k].n}`).join(' · ')}</div>
 <div class="rliste">${all.filter(r=>disc.has(r.n)).map(r=>{const keys=r.k?[...r.k]:r.s?[...r.s]:null;return disc.has(r.n)?`<div><b>${r.n}</b> ${keys?keys.map(k=>gi(k,KZ())).join('+'):'(gleicher Stoff zweimal)'}: ${esc(r.t)}</div>`:`<div class="u">${r.s?'Hochreaktion: drei Stoffe':'? ? ?'}</div>`;}).join('')}</div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function tagebuchHtml(){const M=Meta.get();const st=M.biome;
 return box('tagebuch zettel',`<h2>TAGEBUCH</h2><div class="liste"><div>Abstiege: ${M.runs} · Angekommen: ${M.siege} (Bleiben ${M.enden.bleiben||0}, Umkehren ${M.enden.umkehren||0})</div><div>Größte Tiefe: ${M.besteTiefe?romanN(M.besteTiefe):'–'}</div>
 <div>Erreichte Orte: ${Object.keys(BIOMES).map(b=>st.includes(b)?esc(BIOMES[b].kurz):'…').join(' · ')}</div></div>
 <h3>Fragmente ${M.fragmente.length}/${FRAGS.length}</h3><div class="frags">${Object.keys(BIOMES).map(b=>`<div class="fb"><b>${esc(BIOMES[b].kurz)}</b>${FRAGS.filter(f=>f.biom===b).map(f=>M.fragmente.includes(f.id)?`<p><i>${esc(f.titel)}.</i> ${esc(f.text)}</p>`:'<p class="u">…</p>').join('')}</div>`).join('')}</div>
 <button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function einstHtml(){const E=Einst.all();const sl=(k,n)=>`<label>${n}<input type="range" min="0" max="1" step="0.05" value="${E[k]}" data-einst="${k}"></label>`;const cb=(k,n)=>`<label><input type="checkbox" ${E[k]?'checked':''} data-einst="${k}"> ${n}</label>`;
 return box('einst',`<h2>EINSTELLUNGEN</h2><div class="formular">${sl('musik','Musik')}${sl('effekte','Effekte')}${cb('stummfilm','Stummfilm-Rauschen bei besonderen Anlässen')}${cb('jumpscare','Jumpscare (höchstens einmal pro Abstieg)')}${cb('wackeln','Bildschirmwackeln')}
 <label>Textgeschwindigkeit<select data-einst="text"><option value="0.6" ${E.text==.6?'selected':''}>langsam</option><option value="1" ${E.text==1?'selected':''}>normal</option><option value="1.6" ${E.text==1.6?'selected':''}>schnell</option></select></label>
 <label><input type="checkbox" ${typeof Dev!=='undefined'&&Dev.an?'checked':''} data-act="devToggle"> Dev-Modus</label></div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function zeigeOverlay(html){if(typeof hideTip==='function')hideTip();const o=$('overlay');o.innerHTML=html;o.classList.add('an');}
function closeOv(){$('overlay').classList.remove('an');}
// Wandbild-Relief zeichnen (prozedural; im Stil der Hintergründe, sobald World.relief da ist)
function reliefMalen(){const c=$('relief');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 if(typeof World!=='undefined'&&World.relief){try{const fr=FRAGS.find(f=>f.id===S.frag);const r=World.relief(biomId(),hashStr(S.frag||'x'),fr&&fr.motiv);x.drawImage(r,0,0,160,100);return;}catch(e){}}
 const B=biom();const r=new Rng(hashStr(S.frag||'leer'));x.fillStyle=B.koerper[2];x.fillRect(0,0,160,100);
 for(let i=0;i<9;i++){const cx=14+i*16+r.int(-3,3),cy=50+r.int(-6,6),h=r.int(18,34);x.fillStyle=B.koerper[0];x.fillRect(cx,cy-h/2,2,h);x.fillRect(cx-4,cy-h/2+4,10,2);x.fillStyle=B.rand[0];x.fillRect(cx+2,cy-h/2,1,h);}
 x.fillStyle=B.rand[1];x.fillRect(78,12,4,4);}

// ---------- Rucksackmodus (07-ui-und-gefuehl.md Abschnitt 2): Entwurf ändern, Deck-Änderung grün/rot, erst „Übernehmen“ macht es fest ----------
let RS=null;
function rucksackAuf(){if(!S.route||!canEquip())return;RS={areas:Object.fromEntries(AREAS.map(a=>[a,[...S.areas[a]]])),bag:[...S.bag],sel:null};zeigeRucksack();}
function rsAktiv(){return AREAS.flatMap(a=>RS.areas[a].slice(0,S.slots[a]).filter(Boolean));}
function rsGet(loc){const[k,i]=loc.split(':');return k==='bag'?RS.bag[+i]:RS.areas[k][+i];}
function rsSet(loc,v){const[k,i]=loc.split(':');if(k==='bag')RS.bag[+i]=v;else RS.areas[k][+i]=v;}
function rsKlick(loc){if(!RS.sel){if(rsGet(loc))RS.sel=loc;zeigeRucksack();return;}const a=rsGet(RS.sel),b=rsGet(loc);const[k]=loc.split(':'),[k0]=RS.sel.split(':');
 const passt=(it,l)=>{if(!it)return true;const[kk,ii]=l.split(':');return kk==='bag'||(def(it).a===kk&&+ii<S.slots[kk]);};
 if(RS.sel!==loc&&passt(a,loc)&&passt(b,RS.sel)){rsSet(loc,a);rsSet(RS.sel,b);}else if(RS.sel!==loc)Bus.emit('bad',{a:'PASST NICHT',b:a?'Gehört zu '+AREA_N[def(a).a]:''});RS.sel=null;zeigeRucksack();}
function rucksackHtml(){const alt=allActive(),neu=rsAktiv();const altD=deckListe(alt),neuD=deckListe(neu);
 const slot=(loc,locked)=>{const it=locked?null:rsGet(loc);const D=it&&def(it);return `<div class="slot ${locked?'zu':''} ${RS.sel===loc?'sel':''} ${D&&rarOf(D)!=='gewoehnlich'?'selten':''}" ${locked?'':`data-rs="${loc}"`}>${D?`<img src="${itemBild(it.id)}"><span class="kb">${[...Array(kerbenVon(it))].map((_,k)=>`<i class="${hgVon(it)[k]?'voll':''}"></i>`).join('')}</span>`:''}</div>`;};
 const gruppen=[...new Set([...alt,...neu])].map(it=>{const st=neu.includes(it)&&alt.includes(it)?'bleibt':neu.includes(it)?'neu':'raus';const D=def(it);
  return `<div class="dg ${st}"><b>${esc(D.n)}</b> ${D.st.map(k=>gi(k,KZ())).join('')}<span class="hint"> ${st==='neu'?'kommt rein':st==='raus'?'geht raus':''}</span><div>${kartenVon(it).map(c=>`<span class="dc">${c.hg?'✋ ':''}${esc(c.n)} (${cardCost(c)})</span>`).join('')}</div></div>`;}).join('');
 return box('rucksack',`<h2>RUCKSACK</h2><p class="lead">Klick ein Item, dann den Platz, an den es soll. Rechts siehst du, was das mit deinem Deck macht.</p>
 <div class="rs3"><div class="rsl">${AREAS.map(a=>`<h4>${AREA_N[a]}</h4><div class="slots">${[...Array(BAL.max_slots).keys()].map(i=>slot(a+':'+i,i>=S.slots[a])).join('')}</div>`).join('')}<h4>RUCKSACK</h4><div class="slots">${RS.bag.map((_,i)=>slot('bag:'+i)).join('')}</div>
 ${RS.sel&&rsGet(RS.sel)?`<div class="rsinfo"><b>${esc(def(rsGet(RS.sel)).n)}</b>${def(rsGet(RS.sel)).eigen?`<br><i>${esc(eigenText(def(rsGet(RS.sel)).eigen))}</i>`:''}<br><span class="hint">${esc(def(rsGet(RS.sel)).flavor||'')}</span><br>Kerben: ${hgVon(rsGet(RS.sel)).map(id=>HANDGRIFFE[id]?esc(HANDGRIFFE[id].n):id).join(', ')||'leer'}${S.phase==='kraemer'?`<br><button class="deco klein" data-act="rsVerkaufen">VERKAUFEN FÜR ${Math.floor(preisVon(def(rsGet(RS.sel)))*.4)} GOLD</button>`:''}</div>`:''}</div>
 <div class="rsr"><h4>DECK: ${altD.length} → <span class="${neuD.length>altD.length?'gr':neuD.length<altD.length?'rt':''}">${neuD.length}</span> KARTEN</h4>${gruppen}</div></div>
 <p><button class="deco" data-act="rsUebernehmen">ÜBERNEHMEN</button> <button class="deco klein" data-act="rsZu">VERWERFEN</button></p>`);}
function zeigeRucksack(){zeigeOverlay(rucksackHtml());}
function rucksackUebernehmen(){if(!RS)return;AREAS.forEach(a=>{S.areas[a]=RS.areas[a];});S.bag=RS.bag;RS=null;closeOv();Bus.emit('pick');after();}
// ---------- Hover-Vorschau am Cursor: welche Karten ins Deck kämen, welche Reaktionen dadurch möglich würden ----------
function vorschauKarten(karten,titel){const deckSt=new Set(allActive().flatMap(it=>def(it).st));const st=new Set(karten.flatMap(c=>c.st));const rx=[];
 REACT.forEach(r=>{const[a,b]=[...r.k];if((st.has(a)&&deckSt.has(b))||(st.has(b)&&deckSt.has(a)))rx.push(r.n);});
 const einm=[];const seen=new Set();karten.forEach(c=>{const k=c.n+c.hg;if(!seen.has(k)){seen.add(k);einm.push({...c,anz:karten.filter(x=>x.n===c.n&&x.hg===c.hg).length});}});
 return `<div class="tn">${titel}</div><div class="vkr">${einm.map(c=>`<div class="vk"><div class="vkc">${c.x?'X':c.opfer?'♥'+c.opfer:c.c}</div><b>${esc(c.n)}${c.anz>1?' ×'+c.anz:''}</b><div>${c.st.map(k=>gi(k,9)).join('')||'<span class="hint">Stoff des Items</span>'}</div><div class="vkt">${esc(cardText(c))}</div></div>`).join('')}</div>${rx.length?`<div class="hint">Reagiert mit deinem Deck: ${[...new Set(rx)].join(', ')}</div>`:''}`;}
function hoverVorschau(el){const tk=el.closest('[data-take],[data-buy],[data-hg],[data-buyhg]');if(!tk)return null;
 if(tk.dataset.hg||tk.dataset.buyhg!=null){const id=tk.dataset.hg||(S.shop&&S.shop.hg[+tk.dataset.buyhg]||{}).id;const H=HANDGRIFFE[id];if(!H)return null;return vorschauKarten([{...H,st:[]}],'Kommt als 1 Karte ins Deck, mit dem Stoff des Items, in das du ihn ritzt');}
 const id=tk.dataset.take||(tk.dataset.buy!=null&&S.shop&&S.shop.items[+tk.dataset.buy]&&S.shop.items[+tk.dataset.buy].id);if(!id||!ITEMS[id])return null;
 const tmp={uid:-1,id};return vorschauKarten(kartenVon(tmp),'Angelegt kommen ins Deck:');}
