// Auftrag 3 M7: Sehen und gesehen werden (docs/auftrag-3/06-lovecraft-kern.md Abschnitt 5).
// Wer ein Blick-Item trägt (Eigenschaft eigen.typ = "blick": Linse, Resonator, Lampe aus dem Grab), wählt zu Kampfbeginn: Hinsehen oder Nicht hinsehen.
// Hinsehen: alle Absichten sichtbar (auch stumme und verborgene), dafür kommt ein Gesehener dazu (Wächter: ein stärkerer Musterschritt), und die Beute ist besser.
// Nicht hinsehen: höchstens einmal je Akt flackert ein Schatten in der Szene (Bus „blick_schatten“, kein Text).
// Schalter: balance.json → auftrag3.blick.
const Blick={
 an(){return a3('blick');},
 // Trägt der Spieler ein Blick-Item (aktiv am Körper)?
 traegt(){return this.an()&&passive('blick').length>0;},
 // Sieht der Spieler in diesem Kampf hin?
 aktiv(){return this.an()&&!!S.hinsehen&&(S.phase==='fight'||S.phase==='reward');},
 // Einhakpunkt für Hoeren.istStumm und die Anzeige: mit Hinsehen ist jede Absicht lesbar
 siehtAbsicht(e){return this.aktiv();},
 // Welcher Gesehene gehört in diesen Akt? Akt I bis III: aus der Tiefe, Akt IV: vom Grund, Akt V: der Letzte
 gesehenerId(){const a=S.akt||0;const id=a>=4?'gesehener_letzt':a>=3?'gesehener_grund':'gesehener_tief';return FOES[id]?id:null;},
 // Zu Kampfbeginn (startFight, nach der ersten Hand): Wahl auslegen, wenn ein Blick-Item getragen wird. Finale: keine Wahl (keine Beute danach).
 kampfStart(art){S.hinsehen=false;S.blickWahl=false;S.blickZusatz=null;
  if(!this.traegt()||art==='finale')return;S.blickWahl=true;
  Bus.emit('blick_wahl',{art,why:`Blick-Item am Körper (${allActive().filter(it=>{const d=def(it);return d.eigen&&d.eigen.typ==='blick';}).map(it=>def(it).n).join(', ')}): Hinsehen oder nicht`});},
 // Die Wahl: true = Hinsehen. Gilt für den ganzen Kampf.
 waehlen(ja){if(!S.blickWahl)return false;S.blickWahl=false;S.hinsehen=!!ja;
  if(ja){if(S.kampfArt==='waechter')this.waechterZusatz();else this.gesehenerDazu();
   Bus.emit('blick',{ja:true,why:'Hinsehen: alle Absichten offen, die Dinge sehen dich auch'});}
  else{Bus.emit('blick',{ja:false,why:'Nicht hinsehen'});this.schatten();}
  Bus.emit('changed');return true;},
 // Normaler und schwerer Kampf: ein Gesehener kommt dazu (höchstens vier Gegner)
 gesehenerDazu(){const id=this.gesehenerId();if(!id||alive().length>=4)return null;const e=mkEnemy(id);e.gesehener=true;e.stumm=false;
  const abst=x=>Math.min(1,...alive().map(o=>Math.abs(o.x-x)));e.x=[.5,.2,.8,.35,.65].reduce((a,b)=>abst(b)>abst(a)?b:a);e.reihe=0;e.platzWunsch=null;e.platz=null;S.enemies.push(e);S.blickZusatz={gegner:id};
  Bus.emit('enemy_spawn',{e,why:`Hinsehen: ${e.n} war schon die ganze Zeit da`});return e;},
 // Wächter: ein stärkerer Zug kommt in sein Muster, direkt nach dem aktuellen Schritt. Aus den Daten (foes → gesehen), sonst sein stärkster Schritt ein zweites Mal.
 waechterZusatz(){const w=alive().find(e=>e.rang==='waechter');if(!w)return null;const f=FOES[w.id]||{};
  let st=f.gesehen?{...f.gesehen}:null;let quelle='gesehen';
  if(st&&st.t==='atk')st.v=Math.max(1,Math.round(st.v*(BAL.enemy_scaling.atk_faktor||1)))+(w.as||0);
  if(!st){quelle='stärkster';const wert=p=>p.t==='atk'?(p.v||0)*(p.h||1):(p.v||0)*.8;st={...w.pat.reduce((a,b)=>wert(b)>wert(a)?b:a)};}
  st.gesehen=true;w.pat.splice(w.pi%w.pat.length+1,0,st);S.blickZusatz={waechter:w.id,quelle};
  Bus.emit('kniff',{e:w,why:`Hinsehen: ${w.n} sieht zurück, ein stärkerer Zug kommt in sein Muster${st.why?' ('+st.why+')':''}`});return st;},
 // Ohne Hinsehen: höchstens einmal je Akt ein Schatten, nur in normalen und schweren Kämpfen, per Seed
 schatten(){if(!['kampf','schwer'].includes(S.kampfArt))return false;if((S.blickSchatten||[]).includes(S.akt))return false;
  if(!R(`blick-schatten:${S.akt}:${S.depth}`).chance(.5))return false;S.blickSchatten=[...(S.blickSchatten||[]),S.akt];
  Bus.emit('blick_schatten',{gegner:this.gesehenerId(),why:'Etwas war kurz in der Szene'});return true;},
 // Beute nach dem Sieg: mit Hinsehen 1 aus 4 Handgriffen und sicher ein Item-Angebot
 handgriffe(n){return this.aktiv()?n+1:n;},
 itemSicher(){return this.aktiv();},
 // Bot-Regel: hinsehen, wenn das Leben über 60 % liegt
 botWahl(){return S.hp>maxHp()*.6;}
};
