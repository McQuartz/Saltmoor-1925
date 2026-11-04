// Prüft, ob die Schadens-Vorschau (previewCard) mit dem echten Ergebnis übereinstimmt, und zählt Stummfilm-Anlässe.
// node tools/test-vorschau.js [karten=300]
const {ladeKern}=require('./kern');
(async()=>{const K=ladeKern();await K.init();const want=+(process.argv[2]||300);
 const r=K.run(`(()=>{FAST=true;let n=0,bad=[],seed=100;const jobs=JOBS.map(j=>j.id);
  // jede gespielte Karte: Vorschau vorher, echtes Ergebnis nachher
  const orig=playCard;
  playCard=function(i,ei){if(DRY)return orig(i,ei);const c=S.hand[i];const p=previewCard(i,ei);const before=S.enemies.map(e=>({hp:e.hp,b:e.block}));const pb=S.block,ph=S.hp;
   const ok=orig(i,ei);if(ok&&p){n++;const d=S.enemies.map((e,k)=>before[k]?before[k].hp-e.hp:0);const exp=p.foes.map(f=>f.d);
    if(JSON.stringify(d.slice(0,exp.length))!==JSON.stringify(exp)||S.block-pb!==p.block)bad.push({karte:c.n,erwartet:exp,echt:d,block:[p.block,S.block-pb]});}
   return ok;};
  while(n<${want}&&seed<400){Bot.spiele(jobs[seed%6],seed++,{});}
  playCard=orig;return{n,bad:bad.slice(0,5),fehler:bad.length};})()`);
 console.log(`Gespielte Karten mit Vorschau: ${r.n}, Abweichungen: ${r.fehler}`);if(r.fehler)console.log(JSON.stringify(r.bad,null,1));
 process.exit(r.fehler?1:0);})();
