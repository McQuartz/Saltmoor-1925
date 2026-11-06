// Auftrag 2, M8: Jedes Ereignis, jede Wahl einmal durchspielen (auch die mit Bedingung, die Bedingung wird dafür erfüllt).
// Meldet Fehler, hängende Folgen und Ereignisse ohne Bild/Text. node tools/test-ereignisse.js
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();
 const r=JSON.parse(K.run(`(()=>{const out=[];const zahl={};let n=0;
  for(const ev of EVENTS){zahl[ev.biom]=(zahl[ev.biom]||0)+1;
   if(!ev.t||!ev.d||!ev.bild||!ev.o||!ev.o.length)out.push(ev.id+': Titel, Text, Bild oder Wahlen fehlen');
   ev.o.forEach((o,i)=>{const kf=FAST;FAST=true;n++;
    try{const biom=ev.biom==='alle'?'hafen':ev.biom;const akt=BIOMES[biom]?BIOMES[biom].akt:0;
     const route=RUN.akte.map((x,k)=>k===akt?biom:x.biome.find(b=>BIOMES[b]));
     const c={...(ev.if||{}),...(o.if||{})};const job=c.job||'fischer';
     newRun(job,100+n,{dev:true,route});S.akt=akt;S.depth=akt*7+2;S.gold=200;S.hp=maxHp();
     if(c.item&&!besitz().some(b=>b.it.id===c.item))giveItem(c.item,'Test');
     if(c.event_gesehen)S.stats.events=[c.event_gesehen];
     S.node={art:'ereignis'};S.event=ev.id;S.phase='event';
     if(!condOk(o.if)){out.push(ev.id+' Wahl '+i+': Bedingung nicht herstellbar '+JSON.stringify(o.if));FAST=kf;return;}
     chooseEvent(i);let g=0;while(['event','event_hg','wahl','streichen','fight','reward','ritzen'].includes(S.phase)&&g++<400){if(!Bot.schritt())throw new Error('Bot hängt in '+S.phase);}
     if(g>=400)out.push(ev.id+' Wahl '+i+': hängt in '+S.phase);
    }catch(e){out.push(ev.id+' Wahl '+i+': '+String(e&&e.stack||e).split('\\n').slice(0,2).join(' | '));}finally{FAST=kf;}});}
  return JSON.stringify({fehler:out,zahl,n});})()`));
 console.log('Ereignisse je Biom:',JSON.stringify(r.zahl));console.log('Wahlen gespielt:',r.n);
 r.fehler.forEach(f=>console.log('FEHLER: '+f));console.log(r.fehler.length?r.fehler.length+' FEHLER':'Alles gut.');process.exit(r.fehler.length?1:0);})();
