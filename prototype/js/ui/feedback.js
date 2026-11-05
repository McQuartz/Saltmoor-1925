// Spielgefühl: hört auf Ereignisse der Spielregeln und spielt Effekte, Sounds, Musik und schwebende Zahlen ab.
const hudEl=sel=>document.querySelector(S.phase==='fight'?'#spieler .sbar':'#kopf '+sel);
const FLOAT_COL={dmg:'#e8d8c0',big:'#ffd23f',heal:'#9ae08a',block:'#9cc3ff',hurt:'#e8584a'};
function floatAt(el,txt,col,k=0){if(!el||FAST)return;const r=el.getBoundingClientRect();const f=document.createElement('div');f.className='float';f.textContent=txt;f.style.color=col;
 f.style.left=(r.left+r.width/2+(Math.random()-.5)*30)+'px';f.style.top=(r.top+r.height*.3)+'px';f.style.fontSize=(BU.k*5+Math.min(12,k))+'px';document.body.appendChild(f);setTimeout(()=>f.remove(),1000);}
function floatScene(e,txt,col,k){const b=enemyBox(e);const r=BU.cv.getBoundingClientRect();const fake={getBoundingClientRect:()=>({left:r.left+b.x/SW*r.width-10,top:r.top+(b.y-b.h*.6)/SH*r.height,width:20,height:20})};floatAt(fake,txt,col,k);}
// Meldungszeile (07-ui-und-gefuehl.md): höchstens 2 gleichzeitig, nebeneinander, mindestens 4 s (wichtige 6 s),
// Warteschlange, gleiche Meldungen werden zusammengefasst (×n), Klick zeigt die letzten 20.
const MELD={zeigt:[],queue:[],verlauf:[],sig:''};
function toast(a,b,hoch){if(FAST)return;const M=BAL.meldungen||{max:2,dauer_s:4,wichtig_s:6,verlauf:20};const tf=Einst.get('text')||1;const now=performance.now()/1000;
 MELD.verlauf.unshift({a,b,t:new Date().toLocaleTimeString()});MELD.verlauf.length=Math.min(MELD.verlauf.length,M.verlauf);
 const dauer=((hoch||/NEU|FREIGESCHALTET/.test(a))?M.wichtig_s:M.dauer_s)/tf;
 const da=MELD.zeigt.find(m=>m.a===a);if(da){da.n++;da.b=b;da.bis=now+dauer;meldZeichnen(true);return;}
 const wq=MELD.queue.find(m=>m.a===a);if(wq){wq.n++;wq.b=b;return;}
 MELD.queue.push({a,b,hoch,n:1,dauer});meldTick();}
function meldTick(){const M=BAL&&BAL.meldungen||{max:2};const now=performance.now()/1000;const vor=MELD.zeigt.length;MELD.zeigt=MELD.zeigt.filter(m=>m.bis>now);
 while(MELD.zeigt.length<M.max&&MELD.queue.length){const m=MELD.queue.shift();m.bis=now+m.dauer;MELD.zeigt.push(m);}meldZeichnen();}
function meldZeichnen(force){const sig=MELD.zeigt.map(m=>m.a+m.n+m.b).join('|');if(sig===MELD.sig&&!force)return;MELD.sig=sig;const t=$('toast');if(!t)return;
 t.innerHTML=MELD.zeigt.map(m=>`<div class="tst${m.hoch?' hoch':''}">${m.a}${m.n>1?`<span class="n">×${m.n}</span>`:''}<small>${m.b||''}</small></div>`).join('');}
setInterval(meldTick,250);
function meldVerlauf(){zeigeOverlay(box('buch',`<h2>MELDUNGEN</h2><div class="rliste" style="columns:1">${MELD.verlauf.map(m=>`<div><span class="hint">${m.t}</span> <b>${m.a}</b> ${m.b||''}</div>`).join('')||'<div class="u">noch nichts</div>'}</div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`));}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#toast'))meldVerlauf();});
// Zwischentitel (nur Hochreaktionen, 0,6 s, Art déco)
function zwischentitel(txt){if(FAST)return;const z=$('zwt');z.innerHTML=`<div><span>${txt}</span></div>`;z.classList.remove('an');void z.offsetWidth;z.classList.add('an');setTimeout(()=>z.classList.remove('an'),650);}
function vig(){const v=$('vig');if(!v)return;v.classList.remove('an');void v.offsetWidth;v.classList.add('an');}
let audioOn=false;function startAudio(){au();if(AC&&AC.state==='suspended')AC.resume();if(!audioOn&&typeof Music!=='undefined'){audioOn=true;try{Music.volume(Einst.get('musik'));Music.start();musikSzene();}catch(e){console.warn(e);}}}
function musikSzene(){if(typeof Music==='undefined'||!audioOn)return;const ph=S.phase;
 try{if(S.route)Music.biome(BIOMES[biomId()].musik);if(Music.akt)Music.akt(S.akt||0);
  if(ph==='fight')Music.scene(S.kampfArt==='finale'?'boss':S.kampfArt==='waechter'?'waechter':'kampf');
  else if(['titel','figur','strand','ende'].includes(ph))Music.scene('menu');else Music.scene('karte');
  if(S.route){Music.hp(S.hp,maxHp());const j=JOBS.find(x=>x.id===S.job);if(j)Music.role(j.musik);Music.stoff(dominanterStoff());}}catch(e){}}
function dominanterStoff(){const c={};allActive().forEach(it=>def(it).st.forEach(k=>c[k]=(c[k]||0)+1));let b='keiner',n=0;for(const k in c)if(c[k]>n){n=c[k];b=k;}return b;}
const musFoe=id=>{const f=FOES[id];return f&&f.stimme?f.stimme:{cultist:'kultist',fishman:'tiefling',drowned:'ertrunkener',shade:'schatten',boss:'ruft'}[id]||id;};
let lastPhase=null;
Bus.on('changed',()=>{render();if(typeof hideTip==='function'&&!document.querySelector('[data-hg]:hover,[data-take]:hover,[data-buy]:hover,[data-buyhg]:hover'))hideTip();if(S.phase!==lastPhase){if(lastPhase==='fight'||lastPhase==='reward'){MELD.zeigt=[];MELD.queue=[];meldZeichnen(true);}lastPhase=S.phase;musikSzene();if(S.phase==='wandbild')setTimeout(reliefMalen,0);if(S.phase==='strand'||S.phase==='ende')setTimeout(wegbilderMalen,0);if(S.phase==='strand')setTimeout(()=>sfx.die&&0,0);}if(typeof Music!=='undefined'&&audioOn&&S.route){try{Music.hp(S.hp,maxHp());if(S.phase==='fight'&&incoming()>S.block)Music.telegraph();}catch(e){}}});
Bus.on('deal',()=>{dealAnim=true;});
Bus.on('card_played',()=>sfx.card());
Bus.on('no_energy',()=>{sfx.bad();});
Bus.on('toast',p=>toast(p.a,p.b,p.hoch));
Bus.on('bad',p=>{sfx.bad();if(p.a)toast(p.a,p.b);});
Bus.on('pick',()=>sfx.pick());
Bus.on('click',()=>sfx.click());
Bus.on('fight_start',p=>{BU.vis.clear();(S.enemies||[]).forEach(e=>{if(e.sprite)ladeSprite(e.sprite);});
 if(typeof Music!=='undefined'&&audioOn){try{musikSzene();S.enemies.forEach(e=>Music.foeSpawn(musFoe(e.id)));}catch(e){}}
 if(p.art==='waechter'||p.art==='finale')setTimeout(()=>stummfilm(p.art==='finale'?'Der Finale-Boss erscheint':'Ein Wächter erscheint'),250);});
Bus.on('event',p=>{if(p.ev.stummfilm)setTimeout(()=>stummfilm(`Besonderes Ereignis „${p.ev.t}“`),300);});
const pfx=(n,o)=>{if(FAST||typeof PFX==='undefined')return null;try{return PFX.spiel(n,o);}catch(x){return null;}};
Bus.on('enemy_hit',({e,d,col})=>{if(FAST)return;FX.hit(e,d,stc(col),'eigen');if(d>0){const b=enemyBox(e);pfx(d>=12?'treffer_gross':'treffer',{x:b.x,y:b.y-Math.round(b.h*.55),palette:col||'asche',seed:e.uid+d,richtung:Math.random()<.5?1:-1});}floatScene(e,d>0?'−'+d:'BLOCK',d>0?(d>=12?FLOAT_COL.big:FLOAT_COL.dmg):FLOAT_COL.block,Math.min(12,d)*(BAL.wucht?BAL.wucht.eigen:1));});
Bus.on('enemy_die',({e})=>{if(FAST)return;sfx.die();FX.die(e);if(typeof Music!=='undefined'&&audioOn)try{Music.foeDie(musFoe(e.id));}catch(x){}});
Bus.on('enemy_spawn',({e})=>{ladeSprite(e.sprite);if(typeof Music!=='undefined'&&audioOn)try{Music.foeSpawn(musFoe(e.id));}catch(x){}});
Bus.on('slash',({e,col})=>{if(!FAST)FX.slash(e,col||'#c8483a');});
Bus.on('weakspot',({e})=>{if(!FAST)floatScene(e,'SCHWACHSTELLE',FLOAT_COL.big,2);});
Bus.on('attack',({k})=>{sfx.hit(k);if(typeof Music!=='undefined'&&audioOn)try{Music.strike();}catch(x){}});
Bus.on('enemy_status',({e,status})=>{if(FAST)return;const p=enemyBox(e);const m={burn:'brand',poison:'gift',weak:'geschwaecht',block_weg:'block_splitter'}[status];if(m){pfx(m,{x:p.x,y:p.y,groesse:Math.round(p.h*.8),palette:status==='burn'?'F':status==='poison'?'V':biomId(),seed:e.uid});return;}if(status==='poison')burst(p.x,p.y-p.h*.5,'#86c062',12,1.1,.4);else if(status==='burn')burst(p.x,p.y-p.h*.4,'#e8873a',14,1.1,.7);else burst(p.x,p.y-p.h*.5,'#c9b8e8',8,1);});
Bus.on('player_heal',({v})=>{sfx.heal();if(v)floatAt(hudEl('.bar'),'+'+v,FLOAT_COL.heal);});
Bus.on('player_block',({v})=>{sfx.block();floatAt(document.querySelector('#spieler .schild')||hudEl('.bar'),'+'+v+' BLOCK',FLOAT_COL.block);if(typeof Music!=='undefined'&&audioOn)try{Music.block();}catch(x){}});
Bus.on('self_damage',({v})=>floatAt(hudEl('.bar'),'−'+v,FLOAT_COL.hurt));
Bus.on('player_hurt',({v,letzter,von})=>{sfx.hurt();const W=BAL.wucht||{},k=(W.gegner||1)*(letzter&&von>1?(W.letzter_treffer_extra||1):1);FX.shake((W.ruck||3)*k+Math.min(5,v/3));if(!FAST)BU.freeze=performance.now()+(v>=(W.gross_ab||12)?W.hitstop_gross_ms:W.hitstop_ms)*k;vig();floatAt(document.querySelector('#spieler .sbar'),'−'+v,FLOAT_COL.hurt,Math.min(10,v)*k);if(typeof Music!=='undefined'&&audioOn)try{Music.hit(v);}catch(x){}});
Bus.on('player_blocked',()=>{sfx.block();FX.shake(2);floatAt(document.querySelector('#spieler .schild'),'GEBLOCKT',FLOAT_COL.block);});
Bus.on('enemy_lunge',({e})=>{if(!FAST)FX.lunge(e);});
Bus.on('enemy_block',({e})=>{sfx.block();if(FAST)return;const p=enemyBox(e);pfx('block_auf',{x:p.x,y:p.y,groesse:Math.round(p.h*.8),palette:biomId(),seed:e.uid});burst(p.x,p.y-p.h*.5,'#9cc3ff',10,1.2);});
Bus.on('enemy_buff',({e})=>{sfx.react(0);if(FAST)return;const p=enemyBox(e);burst(p.x,p.y-p.h*.6,'#c86a4a',12,1,.6);});
Bus.on('reaction',({r,k,isNew,keys,live,hoch})=>{if(FAST)return;
 const lp=live&&live.hp!==undefined?enemyBox(live):{x:240,y:180,h:0};
 if(hoch)pfx('hochreaktion',{x:240,y:150,palette:keys[0],seed:k});else if(!pfx('reaktion',{x:lp.x,y:lp.y-Math.round(lp.h*.5),palette:keys[0],seed:k})){FX.ring(keys[0],live);if(keys[1])setTimeout(()=>FX.ring(keys[1],live),90);}
 if(keys[1]&&!hoch)setTimeout(()=>pfx('reaktion',{x:lp.x,y:lp.y-Math.round(lp.h*.5),palette:keys[1],seed:k+7}),120);
 if(hoch){FX.flash(ST[keys[0]].c,.35);FX.shake(8);sfx.hoch();zwischentitel(r.n.toUpperCase()+'!');}else sfx.react(k);
 toast((hoch?'HOCHREAKTION · ':'')+r.n.toUpperCase()+(isNew?' · NEU':''),keys.map(k2=>gi(k2,16)).join(' + ')+' '+esc(r.t),hoch);
 if(isNew)setTimeout(sfx.disc,150);if(typeof Music!=='undefined'&&audioOn)try{Music.reaction(hoch);}catch(x){}});
Bus.on('boss_phase',({e})=>{FX.flash('#ff6ad8',.3);FX.shake(10);toast(String(e.n||'').toUpperCase(),'verändert sich',true);});
Bus.on('victory',()=>{sfx.win();if(typeof Music!=='undefined'&&audioOn)try{Music.victory();}catch(x){}});
Bus.on('forged',({name})=>{sfx.forge();toast('VERBESSERT',name);});
Bus.on('game_over',()=>{sfx.die();if(typeof Music!=='undefined'&&audioOn)try{Music.niederlage?Music.niederlage():Music.scene('menu');}catch(x){}});
Bus.on('act_start',()=>{if(S.akt>0)pfx('uebergang',{palette:biomId(),seed:S.akt});if(typeof Music!=='undefined'&&audioOn)try{Music.uebergang&&Music.uebergang();}catch(x){}});
Bus.on('ende',({art})=>{if(typeof Music!=='undefined'&&audioOn)try{Music.ende&&Music.ende(art);}catch(x){}});
Bus.on('unlock',({neu})=>toast('FREIGESCHALTET',neu.map(x=>esc(x.n)).join(', ')));
Bus.on('einst',({k,v})=>{if(k==='musik'&&typeof Music!=='undefined'&&Music.volume)Music.volume(v);if(k==='effekte'&&typeof SFXB!=='undefined'&&SFXB)SFXB.gain.value=.72*v/.8;});
// Jumpscare: höchstens einmal pro Run, nicht in den ersten 5 Minuten, abschaltbar
setInterval(()=>{if(!S.route||S.scares||document.hidden||!Einst.get('jumpscare')||S.phase!=='fight')return;if(Date.now()-S.startT>Math.max(S.scareAt,BAL.jumpscare.nicht_vor_min*60000)){S.scares=1;if(typeof jumpscare==='function')jumpscare();Bus.emit('jumpscare',{why:'Einmal pro Abstieg, nach '+Math.round((Date.now()-S.startT)/60000)+' Minuten'});}},1000);
// Belohnung aufdecken: kurzer Ton je Karte, tiefer Glockenschlag bei Reliquien (Wächter)
Bus.on('reward',({items,hg})=>{if(FAST)return;const n=(hg||[]).length+(items||[]).length;for(let i=0;i<n;i++)setTimeout(()=>sfx.card(),180*i+80);
 if((items||[]).some(id=>ITEMS[id]&&rarOf(ITEMS[id])==='reliquie')&&typeof Music!=='undefined'&&audioOn)setTimeout(()=>{try{Music.uebergang();}catch(e){}},600);});
// Herzschlag (Kniff „takt“, Walkathedrale): doppelter tiefer Schlag, kurzes Pulsieren, der Gegner bekommt Block
Bus.on('herzschlag',({e})=>{if(FAST)return;if(typeof thump==='function'){thump(70,34,.35,.5,0,true);thump(64,30,.3,.38,.24,true);}FX.shake(3);FX.flash('#5a0a0a',.18);setTimeout(()=>FX.shake(2),240);});
