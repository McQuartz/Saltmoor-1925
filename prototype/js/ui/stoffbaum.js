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
 // M9 Asche: liegt Asche im Rucksack, zeigt der Baum einen eigenen Ast. Die Prüfung ist Asche.nachKarte (eigene Stoffe, Reihenfolge zählt), hier nur die Anzeige.
 if(typeof Asche!=='undefined'&&Zettel.hat('asche')&&S.asche&&S.asche.length){const zk=S.zugKarten||[];const vor=zk[zk.length-1];const eig=vor?Asche.eigene(vor):[];const n=S.asche[S.asche.length-1].n;
  const hat=k=>S.hand.filter(sbSpielbar).some(c=>Asche.eigene(c).includes(k));
  if(eig.includes('S')&&!S.verbuendeter){aeste.push({stoff:['F'],rx:[{n:'Asche rufen',t:`Salz, dann Feuer: ${n} kämpft diesen Kampf an deiner Seite. Zwei Biome später kommt er als Gegner wieder.`}],n:'Asche rufen',hell:hat('F'),gold:false,asche:true});sackgasse=false;}
  if(eig.includes('F')){aeste.push({stoff:['S'],rx:[{n:'Asche zerfällt',t:`Feuer, dann Salz: die Asche von ${n} zerfällt. Nichts kommt zurück.`}],n:'Asche zerfällt',hell:hat('S'),gold:false,asche:true});sackgasse=false;}}
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
// Auftrag 4: Baum „Klar“ (Look-Runde 7, baumKlar): links die Kette, ein senkrechter Stamm, waagrechte Äste, keine Schrägen.
// Der spielbare Weg ist hell, Namen in Jersey 10. Gold (Hochreaktion), Sackgasse, Mitrücken, Asche und die Regelbiegungen bleiben wie in Auftrag 3.
const SB_W=88,SB_H=36;
function sbEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function sbZeichen(k){return `<img src="${typeof glyph==='function'?glyph(k):''}" alt="" data-st="${k}">`;}
const sbP=(x,y)=>`left:calc(var(--u)*${x});top:calc(var(--u)*${y})`;
function stoffBaumHtml(){
 if(!sbImKampf()){sbPfadLaenge=-1;return '';}
 const d=baumDaten();
 let pfad=d.pfad;if(!pfad.length&&d.letzter.length)pfad=[d.letzter];
 const len=d.pfad.length;
 const rueck=sbPfadLaenge>=0&&len===sbPfadLaenge+1;
 sbPfadLaenge=len;
 // höchstens zwei Glieder sichtbar (das vorletzte und das letzte), davor ein Punkt je weiteres Glied
 const zeig=pfad.slice(-2),vorn=pfad.length-zeig.length,off=Math.min(3,vorn)*3;
 const glied=(g,i)=>{const gi_=vorn+i;const letzt=d.quelle&&d.pfad.length?d.quelle.includes(gi_):gi_===pfad.length-1;
  return {letzt,html:`<div class="glied px9${letzt?' letzt':''}${len&&d.farbe[gi_]?' farbe':''}" style="${sbP(off+2+i*14,'Y')}">${g.length>1?sbZeichen(g[0]):sbZeichen(g[0])}</div>`};};
 const n=d.aeste.length,my=Math.round(SB_H/2);
 const cEnd=pfad.length?off+2+zeig.length*11+(zeig.length-1)*3:7,tx=cEnd+4,bx=tx+5;
 const zeile=n?Math.min(9.5,(SB_H-4)/n):0;const rows=d.aeste.map((a,i)=>Math.round(my+(i-(n-1)/2)*zeile));
 const col=a=>a.gold?'#e8c547':(ST[a.stoff[0]]?ST[a.stoff[0]].c:'#fff');
 const bg=typeof pxc==='function'?pxc(SB_W,SB_H,(cx,p)=>{
  if(!pfad.length)return;
  for(let i=0;i<Math.min(3,vorn);i++)p(1+i*3,my,2,1,'#5a4c34');
  for(let i=1;i<zeig.length;i++)p(off+2+i*14-3,my,3,1,'#5a4c34');
  if(d.sackgasse||!n){p(cEnd,my,4,1,'#3a3328');return;}
  p(cEnd,my,tx-cEnd,1,'#8a7a58');p(tx,rows[0],1,rows[n-1]-rows[0]+1,'#3a3328');
  d.aeste.forEach((a,i)=>{if(a.hell)p(tx,Math.min(my,rows[i]),1,Math.abs(rows[i]-my)+1,'#f1ede2');});
  d.aeste.forEach((a,i)=>p(tx+1,rows[i],bx-tx-1,1,a.hell?col(a):'#3a3328'));}):'';
 const glieder=zeig.map((g,i)=>glied(g,i).html.replace("top:calc(var(--u)*Y)",`top:calc(var(--u)*${(my-5.5).toFixed(1)})`)).join('');
 const af=n>4?Math.max(6,Math.round(zeile+1.5)):10;
 const aeste=d.sackgasse?`<div class="sackgasse sb-sack" style="${sbP(bx,my-4)}">Sackgasse</div>`:d.aeste.map((a,i)=>`<div class="sb-ast ast${a.hell?' hell':' dunkel'}${a.gold?' gold':''}${a.asche?' asche':''}" style="${sbP(bx+1,(rows[i]-af*.4).toFixed(1))};--c:${col(a)};--af:${af}" data-ast="${a.stoff.join('')}" data-rx="${sbEsc(a.rx.map(r=>r.n).join('|'))}" data-hell="${a.hell?1:0}" title="${sbEsc(a.rx.map(r=>r.t).join('\n'))}">${a.stoff.map(sbZeichen).join('')}<span class="sb-name">${sbEsc(a.n)}</span></div>`).join('');
 const eck=d.eck?`<div class="eck${d.eck.rx.length?' an':''}${d.eck.leuchtet?' leuchtet':''}" title="${sbEsc(d.eck.rx.length?'Über Eck beim Zugende: '+d.eck.t.join(' '):'Über Eck: ab drei Karten reagieren die erste und die letzte beim Zugende')}">ÜBER ECK${d.eck.rx.length?': '+sbEsc(d.eck.rx.join(' · ')):''}</div>`:'';
 const punkt=pfad.length?'':`<i class="sb-punkt" style="${sbP(3,my-1)}"></i>`;
 return `<div class="bk${Date.now()<sbFunkBis?' funk':''}">${bg?`<img class="bg" src="${bg}" alt="">`:''}${eck}<div class="sb-kette${rueck?' rueck':''}">${punkt}${glieder}</div>${aeste}</div>`;}
