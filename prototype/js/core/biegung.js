// Auftrag 3 M5: Die Tiefe biegt die Regeln (docs/auftrag-3/06-lovecraft-kern.md Abschnitte 2 und 3).
// Ein Modul mit festen Einhakpunkten, die Kampf, Vorschau, Stoff-Baum und Bots gemeinsam benutzen. Keine Biegung hat eine eigene Kopie der Reaktionsregeln:
// alles läuft über reactionsFor (rules.js), das hier nur zusätzliche Paare (extraReaktionen) und eine andere „Karte davor“ (S.last, quelleReaktion) bekommt.
// Daten: data/biegungen.json, Schalter: balance.json → auftrag3.regelbiegung (aus = alle Biome wie vorher).
// Nur für Vergleichsläufe: balance.json → auftrag3.biegung_nur = id (nur diese Biegung gilt, alle anderen Biome spielen sich normal).
let BIEGUNGEN=[];
const Bieg={
 // Biegung nach id
 def(id){return BIEGUNGEN.find(b=>b.id===id)||null;},
 // Biegung des aktuellen Bioms (ohne Wechsel der Pforte), auch außerhalb des Kampfes, für die Anzeige
 vomBiom(bid){if(!a3('regelbiegung'))return null;const B=BIOMES[bid||biomId()];const id=B&&B.biegung;if(!id)return null;
  const nur=BAL.auftrag3&&BAL.auftrag3.biegung_nur;if(nur&&nur!==id)return null;return this.def(id);},
 // Biegung, die gerade im Kampf gilt (Pforte: die dieses Zuges), sonst null
 aktiv(){if(!S||S.phase!=='fight'&&S.phase!=='reward'||!S.route)return null;const b=this.vomBiom();if(!b)return null;
  if(b.art==='wechsel')return this.def(this.wechselZug(S.turnNo||1));return b;},
 ist(id){const b=this.aktiv();return !!b&&b.id===id;},
 // ---------- Außerhalb der Zeit (Pforte): je Zug die Biegung eines anderen Bioms, per Seed, nie zweimal hintereinander ----------
 wechselListe(){return BIEGUNGEN.filter(b=>b.art!=='wechsel').map(b=>b.id);},
 wechselZug(t){if(!S.biegFolge)S.biegFolge=[];const L=this.wechselListe();if(!L.length)return null;
  while(S.biegFolge.length<t){const r=rs('biegung');const vor=S.biegFolge[S.biegFolge.length-1];const k=L.filter(x=>x!==vor);S.biegFolge.push(r.pick(k));}
  return S.biegFolge[t-1];},
 // ---------- extraReaktionen: Paare und Sonderreaktionen, die nur hier gelten ----------
 extraReaktionen(){const b=this.aktiv();return b&&b.reaktionen?b.reaktionen:[];},
 // Funkspruch: drei Karten mit gleichen Kosten direkt nacheinander, die dritte ist verstärkt (einmal je Zug). Gibt die Reaktion zurück oder null.
 funkspruch(cost){const b=this.aktiv();if(!b||b.id!=='funkspruch'||S.funkZug)return null;const k=S.zugKosten||[];
  if(k.length>=2&&k[k.length-1]===cost&&k[k.length-2]===cost)return{...b.reaktion,biegung:b.id};return null;},
 // ---------- quelleReaktion: welche Stoffe für die nächste Karte als „Karte davor“ gelten ----------
 // zug: Stoffe der in diesem Zug gespielten Karten, in Reihenfolge (die gerade gespielte zuletzt)
 quelleReaktion(zug){const b=this.aktiv();const n=zug.length;const letzte=n?[...zug[n-1]]:[];if(!b)return letzte;
  if(b.id==='falsche_winkel'){const vl=n>=2?[...zug[n-2]]:[];return BAL.auftrag3&&BAL.auftrag3.falsche_winkel_beide?[...new Set([...letzte,...vl])]:vl;}
  if(b.id==='schlag'&&n===2)return [...new Set([...zug[0],...zug[1]])];
  return letzte;},
 // Zugbeginn: Stoffe, mit denen die erste Karte reagiert (Ringofen: die letzte Karte des Vorzugs)
 quelleZugbeginn(){return this.ist('ringofen')&&S.turnNo>1&&S.vorzugLetzt?[...S.vorzugLetzt]:[];},
 // ---------- ablage: wohin eine gespielte oder abgeworfene Karte geht ----------
 ablegen(c){if(this.ist('wellen_oben')){S.draw.unshift(c);return;}S.discard.push(c);},
 abwerfen(list){if(this.ist('wellen_oben')){list.forEach(c=>S.draw.unshift(c));return;}S.discard.push(...list);},
 // Keiner fährt ab: Karte mit Reaktion oben auf den Stapel statt auf die Ablage, höchstens zwei je Zug
 nachReaktion(c,rx){if(!rx.length||!this.ist('keiner_faehrt')||(S.stationZug||0)>=2||c.verbraucht)return;
  const i=S.discard.lastIndexOf(c);if(i<0)return;S.discard.splice(i,1);S.draw.push(c);c.zurueck=true;S.stationZug=(S.stationZug||0)+1;
  Bus.emit('biegung',{id:'keiner_faehrt',why:`Keiner fährt ab: „${c.n}“ hat reagiert und liegt wieder oben auf dem Stapel (${S.stationZug} von 2 in diesem Zug)`});},
 // Mischen beim leeren Stapel: Die Wellen kommen von oben mischt nie
 mischen(list){return this.ist('wellen_oben')?[...list]:rs('kampf').shuffle(list);},
 // ---------- ziehen: Zugbeginn ----------
 ziehen(){const hs=handSize();
  if(this.ist('rueckwaerts')&&S.turnNo>1&&S.zuletztGespielt){const i=S.discard.lastIndexOf(S.zuletztGespielt);
   if(i>=0){const c=S.discard.splice(i,1)[0];S.hand.push(c);Bus.emit('biegung',{id:'rueckwaerts',why:`Rückwärts gewachsen: „${c.n}“ kommt aus der Ablage zurück auf die Hand`});drawCards(Math.max(0,hs-1));return;}}
  if(S.flutHand){const n=S.flutHand;S.flutHand=0;Bus.emit('biegung',{id:'gezeiten',why:`Ebbe und Flut: die Hand blieb liegen (${n} Karten), du ziehst bis ${hs} auf`});drawCards(Math.max(0,hs-n));return;}
  drawCards(hs);},
 // ---------- zugEnde: was beim Drücken von „Zug beenden“ geschieht, vor dem Abwerfen ----------
 zugEnde(){const b=this.aktiv();S.flutHand=0;if(!b)return;
  if(b.id==='ueber_eck')this.ueberEck();
  if(b.id==='aufgewogen'&&S.energy>0){const v=3*S.energy;addBlock(v,`Aufgewogen: ${S.energy} übrige Energie liegen als ${v} Block in der Schale`);Bus.emit('biegung',{id:'aufgewogen',why:`Aufgewogen: ${S.energy} Energie → ${v} Block`});}},
 // Ebbe und Flut: gerade Züge sind Flut (die Hand bleibt am Zugende, man zieht nur bis zur Handgröße auf)
 flut(t){return t%2===0;},
 flutJetzt(){return this.ist('gezeiten')&&this.flut(S.turnNo||1);},
 handBleibt(){return this.flutJetzt();},
 // Über Eck: erste und letzte Karte des Zuges reagieren, ab drei Karten. Nur die Paare zwischen den beiden Karten (was die letzte in sich trägt, hat schon reagiert).
 ueberEckRx(){const z=S.zugSt||[];if(z.length<3)return[];const a=z[0],b=z[z.length-1];const innen=reactionsFor([],b);return reactionsFor(a,b).filter(r=>!innen.includes(r));},
 ueberEck(){const rx=this.ueberEckRx();if(!rx.length)return;const z=S.zugSt,a=z[0],b=z[z.length-1];const c=(S.zugKarten||[])[S.zugKarten.length-1];
  const ctx={tg:tgt(),card:c};S.ueberEck={turn:S.turnNo,rx:rx.map(r=>r.n)};
  Bus.emit('biegung',{id:'ueber_eck',why:`Über Eck: die erste Karte (${a.map(k=>ST[k].n).join(' + ')||'ohne Stoff'}) und die letzte (${b.map(k=>ST[k].n).join(' + ')||'ohne Stoff'}) schließen den Kreis: ${rx.map(r=>r.n).join(', ')}`});
  let k=0;for(const r of rx){k++;const w=whyRx(r,a,b);const why=`Über Eck, ${r.n}: ${w?w.src:''}`;
   if(r.s){S.hochZahl=(S.hochZahl||0)+1;if(!passive('hoch_zweimal').length||S.hochZahl>=2)S.hochUsed.add(r.n);}
   if(r.fx)runFx(r.fx,{tg:ctx.tg&&ctx.tg.hp>0?ctx.tg:alive()[0],why});
   // Vorab-Reaktionen (Verstärkt, Opfer) wirken auf die letzte Karte: sie wirkt um den Mehranteil nach
   if(r.pre&&c&&alive().length){if(r.pre.mult)applyMain(c,ctx,r.pre.mult-1,0,[`Über Eck: ${r.n}`]);
    if(r.pre.repeat){if(r.pre.self_damage)zahleLeben(r.pre.self_damage,`Über Eck, ${r.n}: du zahlst ${r.pre.self_damage} Leben`);for(let j=1;j<r.pre.repeat;j++)applyMain(c,ctx,1,0,[`Über Eck: ${r.n}`]);}}
   const isNew=!S.disc.has(r.n);S.disc.add(r.n);S.rxZug=(S.rxZug||0)+1;if(!DRY&&S.stats)S.stats.reaktionen=(S.stats.reaktionen||0)+1;
   Bus.emit('reaction',{r,k,isNew,keys:w?w.keys:b,live:ctx.tg,hoch:!!r.s,why});}
  checkVictory();},
 // ---------- Zugbuchhaltung (vom Kampf gerufen) ----------
 zugStart(){S.zugSt=[];S.zugKarten=[];S.zugKosten=[];S.stationZug=0;S.funkZug=false;S.spiegelZug=false;S.ueberEck=null;S.last=this.quelleZugbeginn();},
 nachKarte(c,cost){S.zugSt=S.zugSt||[];S.zugSt.push([...c.st]);(S.zugKarten=S.zugKarten||[]).push(c);(S.zugKosten=S.zugKosten||[]).push(cost);S.zuletztGespielt=c;S.last=this.quelleReaktion(S.zugSt);},
 zugAus(){const z=S.zugSt||[];S.vorzugLetzt=z.length?[...z[z.length-1]]:null;if(this.handBleibt())S.flutHand=S.hand.filter(c=>!c.unspielbar).length;},
 // ---------- absichtenSichtbar: wie viele Absichten ein Gegner zeigt ----------
 absichtenSichtbar(e){return this.ist('rueckseite')?2:1;},
 // ---------- Das Spiegelbild ist voraus: oberste Karte offen, einmal je Zug gegen eine Handkarte tauschen ----------
 spiegelOffen(){return this.ist('spiegelbild')&&S.draw.length?S.draw[S.draw.length-1]:null;},
 spiegelKann(){return this.ist('spiegelbild')&&!S.spiegelZug&&S.draw.length>0&&S.phase==='fight'&&!busy;},
 spiegelTausch(i){if(!this.spiegelKann())return false;const h=S.hand[i];if(!h)return false;const top=S.draw.pop();S.hand.splice(i,1,top);S.draw.push(h);S.spiegelZug=true;
  Bus.emit('biegung',{id:'spiegelbild',why:`Das Spiegelbild ist voraus: „${h.n}“ gegen „${top.n}“ vom Stapel getauscht`});Bus.emit('changed');return true;},
 // Kurztext für die Kopfleiste (Pforte: diese und nächste; Gezeiten: Ebbe oder Flut)
 kopf(){const b=this.vomBiom();if(!b)return null;const out={b,jetzt:b,naechste:null,zusatz:''};
  if(S.phase==='fight'){if(b.art==='wechsel'){out.jetzt=this.def(this.wechselZug(S.turnNo||1));out.naechste=this.def(this.wechselZug((S.turnNo||1)+1));}
   const j=out.jetzt;if(j&&j.id==='gezeiten'){const f=this.flut(S.turnNo||1);out.zusatz=f?'Flut':'Ebbe';out.zusatzT=f?'Dieser Zug ist Flut: die Hand bleibt am Zugende. Nächster Zug Ebbe.':'Dieser Zug ist Ebbe. Nächster Zug Flut: die Hand bleibt am Zugende.';}}
  return out;}
};
