// Spielgefühl: hört auf Ereignisse der Spielregeln und spielt Effekte, Sounds und schwebende Zahlen ab.
// Hier stellt man ein, wie Schaden, Block, Heilung und Reaktionen aussehen und klingen.
const hudEl=sel=>document.querySelector('#hud '+sel);
const stCol=k=>k&&ST[k]?ST[k].c:null;

Bus.on('changed',()=>render());
Bus.on('deal',()=>{dealAnim=true;});
Bus.on('card_played',()=>sfx.card());
Bus.on('no_energy',()=>{sfx.bad();shakeEl(hudEl('.energy'));});
Bus.on('toast',p=>toast(p.a,p.b,p.hoch));
Bus.on('bad',p=>{sfx.bad();if(p.a)toast(p.a,p.b);});
Bus.on('pick',()=>sfx.pick());
Bus.on('click',()=>sfx.click());

// Schaden am Gegner
Bus.on('enemy_hit',({e,d,col})=>{FX.hit(e,d,stCol(col));const el=enEl(e);
 if(el)floatAt(el,d>0?'-'+d:'BLOCK',d>0?(d>=12?FLOAT_COL.big:FLOAT_COL.dmg):FLOAT_COL.block,Math.min(16,d));upd(e);});
Bus.on('enemy_die',({e})=>{sfx.die();FX.die(e);const el=enEl(e);if(el)el.classList.add('dead');});
Bus.on('slash',({e,col})=>FX.slash(e,col||'#ff5a4a'));
Bus.on('weakspot',({e})=>floatAt(enEl(e),'SCHWACHSTELLE',FLOAT_COL.big,4));
Bus.on('attack',({k})=>sfx.hit(k));
Bus.on('enemy_status',({e,status})=>{upd(e);const p=FX.pos(e);
 if(status==='poison')burst(p.x,p.y-p.h*.5,'#86c062',14,1.2,.5);
 else if(status==='burn')burst(p.x,p.y-p.h*.4,'#e8873a',16,1.2,.8);
 else burst(p.x,p.y-p.h*.5,'#c9b8e8',10,1);});

// Spieler
Bus.on('player_heal',({v})=>{sfx.heal();floatAt(hudEl('.hp'),'+'+v,FLOAT_COL.heal);});
Bus.on('player_block',({v})=>{sfx.block();FX.flash('#4f86cf',.15);floatAt(hudEl('.blockbadge'),'+'+v+' BLOCK',FLOAT_COL.block);});
Bus.on('self_damage',({v})=>floatAt(hudEl('.hp'),'-'+v,FLOAT_COL.hurt));
Bus.on('player_hurt',({v})=>{sfx.hurt();FX.shake(8+Math.min(8,v/2));vig();floatAt(hudEl('.hp'),'-'+v,FLOAT_COL.hurt,Math.min(14,v));});
Bus.on('player_blocked',()=>{sfx.block();FX.shake(3);floatAt(hudEl('.blockbadge'),'GEBLOCKT',FLOAT_COL.block);});

// Gegnerzug
Bus.on('enemy_lunge',({e})=>FX.lunge(e));
Bus.on('enemy_block',({e})=>{sfx.block();const p=FX.pos(e);burst(p.x,p.y-p.h*.5,'#9cc3ff',14,1.4);});
Bus.on('enemy_buff',({e})=>{sfx.react(0);const p=FX.pos(e);burst(p.x,p.y-p.h*.6,'#ff7a3a',18,1,.8);});

// Reaktionen: Ringe in den Stoff-Farben, Hochreaktion mit Blitz und Beben
Bus.on('reaction',({r,k,isNew,keys,live,hoch})=>{
 FX.ring(keys[0],hoch?null:live);if(keys[1])setTimeout(()=>FX.ring(keys[1],hoch?null:live),90);
 if(hoch){FX.flash(ST[keys[0]].c,.6);FX.shake(12);sfx.hoch();}else sfx.react(k);
 toast((hoch?'HOCHREAKTION: ':'')+r.n.toUpperCase()+(isNew?' · NEU!':''),keys.map(chip).join(' + ')+' &nbsp;'+r.t,hoch);
 if(isNew)setTimeout(sfx.disc,150);});

Bus.on('victory',()=>sfx.win());
Bus.on('forged',({name})=>{sfx.forge();toast('VERSCHMOLZEN',name);});
Bus.on('game_over',()=>sfx.die());
