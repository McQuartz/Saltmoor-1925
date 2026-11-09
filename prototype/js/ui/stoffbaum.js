// Stoff-Baum: Pfad der in diesem Zug gespielten Stoffe, Äste zu allen Stoffen, mit denen die nächste Karte reagieren würde.
// Ersetzt das Stoffrad. Die Reaktionslogik kommt ausschließlich aus reactionsFor (rules.js), hier steht keine zweite Kopie.
let sbPfadLaenge=-1; // Pfadlänge des letzten stoffBaumHtml-Aufrufs, für die Mitrück-Bewegung
// M5: Funkspruch lässt das letzte Glied kurz-kurz-lang blinken (eine Sekunde ab der Reaktion)
let sbFunkBis=0;if(typeof Bus!=='undefined')Bus.on('reaction',p=>{if(p&&p.r&&p.r.biegung==='funkspruch')sbFunkBis=Date.now()+1000;});

function sbImKampf(){return typeof S!=='undefined'&&!!S&&S.phase==='fight'&&Array.isArray(S.enemies)&&Array.isArray(S.hand);}
function sbSpielbar(c){return !c.unspielbar&&!c.frost&&cardCost(c)<=S.energy;}

// Daten für Anzeige und Tests
function baumDaten(){
 const last=(S.last||[]).slice();
 const pfad=(S.chainLog||[]).filter(l=>l.turn===S.turnNo).map(l=>[...l.st]);
 const aeste=[];let sackgasse=false;
 if(last.length){
  const spielbar=S.hand.filter(sbSpielbar);
  const hellFuer=rx=>spielbar.some(c=>{const rr=reactionsFor(last,c.st);return rx.some(r=>rr.includes(r));});
  const baue=(stoff,rx)=>({stoff,rx,n:rx.map(r=>r.n).join(' · '),hell:hellFuer(rx),gold:rx.some(r=>!!r.s&&!(S.hochUsed||new Set()).has(r.n))});
  const bekannt=new Set();
  for(const k of Object.keys(ST)){const rx=reactionsFor(last,[k]);if(rx.length){aeste.push(baue([k],rx));rx.forEach(r=>bekannt.add(r));}}
  // Mehrstoff-Karten auf der Hand: Reaktionen, die kein Einzelstoff-Ast schon zeigt (z. B. Hochreaktion aus drei Stoffen)
  for(const c of S.hand){
   if(!c.st||c.st.length<2)continue;
   const rest=reactionsFor(last,c.st).filter(r=>!bekannt.has(r));
   if(!rest.length)continue;
   const key=c.st.join('');const alt=aeste.find(a=>a.stoff.length>1&&a.stoff.join('')===key);
   if(alt){const rx=[...alt.rx,...rest.filter(r=>!alt.rx.includes(r))];Object.assign(alt,baue(alt.stoff,rx));}
   else aeste.push(baue([...c.st],rest));
   rest.forEach(r=>bekannt.add(r));
  }
  sackgasse=!aeste.some(a=>a.hell);
 }
 // Auftrag 3 M5: Regelbiegung im Baum. quelle = Glieder, von denen die Äste ausgehen (Falsche Winkel: das vorletzte, Der Schlag: alle davor);
 // eck = Über Eck (Bogen vom ersten zum letzten Glied, ab drei Karten, mit den Reaktionen, die beim Zugende kommen)
 let quelle=null,eck=null;const B=typeof Bieg!=='undefined'?Bieg.aktiv():null;const n=pfad.length;
 if(B&&B.id==='falsche_winkel')quelle=n>=2?[n-2]:[];
 if(B&&B.id==='schlag'&&n===2)quelle=[0,1];
 if(B&&B.id==='ueber_eck'&&n>=2){const rx=n>=3?Bieg.ueberEckRx():[];eck={rx:rx.map(r=>r.n),t:rx.map(r=>r.t),zu:n>=3,leuchtet:!!(S.ueberEck&&S.ueberEck.turn===S.turnNo)};}
 // Glieder, die von Karten des Farbe-Items stammen (zugKarten läuft parallel zur Kette dieses Zuges)
 const zk=S.zugKarten||[];const farbe=typeof Farbe!=='undefined'&&zk.length===pfad.length?zk.map(c=>Farbe.karte(c)):[];
 return{pfad,farbe,letzter:last,aeste,sackgasse,quelle,eck};}

// ---------- HTML ----------
const SB_H=48,SB_PX=46,SB_AX=77; // Maße in u: Höhe, Anfang der Bögen, Anfang der Astzeichen (Breite 150)
function sbEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function sbZeichen(k){
 const col=ST[k]?ST[k].c:'#fff';
 const src=typeof glyph==='function'?glyph(k):'';
 return `<img class="sb-z" data-st="${k}" src="${src}" alt="" style="--c:${col}">`;}

function stoffBaumHtml(){
 if(!sbImKampf()){sbPfadLaenge=-1;return '';}
 const d=baumDaten();
 let pfad=d.pfad;if(!pfad.length&&d.letzter.length)pfad=[d.letzter];
 const len=d.pfad.length;
 const rueck=sbPfadLaenge>=0&&len===sbPfadLaenge+1;
 sbPfadLaenge=len;
 // Pfad: Kette von Gliedern, das letzte mit Rahmen in Stofffarbe
 const kette=!pfad.length?'<i class="sb-punkt"></i>':pfad.map((g,i)=>{const letzt=d.quelle&&d.pfad.length?d.quelle.includes(i):i===pfad.length-1;
  return (i?'<i class="sb-ver"></i>':'')+`<span class="sb-glied${letzt?' letzt':''}${len&&d.farbe[i]?' farbe':''}" style="--c:${ST[g[0]]?ST[g[0]].c:'#fff'}">${g.map(sbZeichen).join('')}</span>`;}).join('');
 // Äste
 const mitte=SB_H/2,n=d.aeste.length;
 let bogen='',aeste='',sack='';
 if(d.sackgasse)sack='<div class="sb-sack">Sackgasse</div>';
 else{
  const zeile=Math.min(10,(SB_H-2)/Math.max(1,n));
  d.aeste.forEach((a,i)=>{
   const y=n===1?mitte:mitte+(i-(n-1)/2)*zeile;
   const col=a.gold?'#e8c547':(ST[a.stoff[0]]?ST[a.stoff[0]].c:'#fff');
   const dx=SB_AX-2-SB_PX;
   bogen+=`<path d="M${SB_PX} ${mitte} C${SB_PX+dx*.55} ${mitte} ${SB_PX+dx*.45} ${y.toFixed(2)} ${SB_AX-2} ${y.toFixed(2)}" fill="none" stroke="${col}" stroke-width=".8"${a.hell?'':' stroke-dasharray="1.6 1.4"'} stroke-linecap="round" opacity="${a.hell?1:.4}"/>`;
   aeste+=`<div class="sb-ast${a.hell?'':' dunkel'}${a.gold?' gold':''}" style="top:calc(var(--u)*${y.toFixed(2)});--c:${col};font-size:calc(var(--u)*${n>6?3.4:4})" data-ast="${a.stoff.join('')}" data-rx="${sbEsc(a.rx.map(r=>r.n).join('|'))}" data-hell="${a.hell?1:0}" title="${sbEsc(a.rx.map(r=>r.t).join('\n'))}">${a.stoff.map(sbZeichen).join('')}<span class="sb-name">${sbEsc(a.n)}</span></div>`;});
 }
 const eck=d.eck?`<div class="sb-eck${d.eck.rx.length?' an':''}${d.eck.leuchtet?' leuchtet':''}" title="${sbEsc(d.eck.rx.length?'Über Eck beim Zugende: '+d.eck.t.join(' '):'Über Eck: ab drei Karten reagieren die erste und die letzte beim Zugende')}">${d.eck.rx.length?`<span>${sbEsc(d.eck.rx.join(' · '))}</span>`:''}</div>`:'';
 return `<div class="sb${d.eck?' mit-eck':''}${Date.now()<sbFunkBis?' funk':''}"><div class="sb-pfad"><div class="sb-kette${rueck?' rueck':''}">${eck}${kette}</div></div><svg class="sb-bogen" viewBox="0 0 150 ${SB_H}" aria-hidden="true">${bogen}</svg>${aeste}${sack}</div>`;}
