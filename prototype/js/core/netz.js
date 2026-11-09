// Auftrag 3, M3: Peilkarte. Beim Betreten eines Akts entsteht aus dem Seed der ganze Akt als Netz (05-oberflaeche.md Abschnitt 7).
// Je Ebene aus run.json 2 bis 4 Knoten nach denselben Regeln wie früher genWeg (pool, wege, mindestens, verschiedene, einer_von, fest, fest_wahl),
// Pfade nur zur nächsten Ebene (Ausnahme: Abkürzung), jeder Knoten hat einen Ausgang, Pfade kreuzen sich nicht, alle führen zum Wächter.
// Das Netz liegt in S.netz (Speicherstand). S.weg bleibt die Liste der jetzt erreichbaren Knoten (für Bot, Tests und Eingabe).
//
// S.netz = { akt, biom, ebenen: [[knoten…]…], kanten: [{a:[e,i], b:[e,j], bruch?, weg?, kurz?}], pos: [e,i] | null, gegangen: [[e,i]…],
//            klar: bool (Wandbild gelesen: Nebel bis zum Wächter weg), folgen: [art…] }
// Knoten = { art, hint, foes?, i, dunkel? }

// Knotenarten einer Ebene (dieselbe Regel wie früher genWeg)
function netzArten(key,r){const E=RUN.ebenen[key];let arten;
 if(E.fest)return[E.fest];
 if(E.fest_wahl)return[...E.fest_wahl];
 const n=r.int(E.wege[0],E.wege[1]);
 for(let tries=0;tries<60;tries++){arten=E.verschiedene?r.sample([...new Set(E.pool)],Math.min(n,new Set(E.pool).size)):r.sample(E.pool,Math.min(n,E.pool.length));
  if(E.verschiedene&&arten.length<n)arten=[...arten,...r.sample(E.pool,n-arten.length)];
  if(E.mindestens&&Object.entries(E.mindestens).some(([k,v])=>arten.filter(a=>a===k).length<v))continue;
  if(E.verschiedene&&new Set(arten).size<E.verschiedene)continue;
  if(E.einer_von&&!arten.some(a=>E.einer_von.includes(a)))continue;break;}
 return arten;}

// Knoten einer Ebene mit Hinweis und Gegnern (rollFoes braucht S.ebene der Ebene)
function netzKnoten(e,r){const key=aktDef().ebenen[e];const b=biom();let arten=netzArten(key,r);
 if(key==='vorraum'&&b.vorraum_elite&&FOES[b.vorraum_elite])arten=['kampf_schwer'];
 const used={};const alt=S.ebene;S.ebene=e;
 const l=arten.map((art,i)=>{const hs=(b.weg_hinweise&&b.weg_hinweise[art==='kampf_schwer'?'kampf':art])||[RUN.knoten[art].n];used[art]=(used[art]||0);const hint=hs[(r.int(0,hs.length-1)+used[art]++)%hs.length];
  const o={art,hint,i};if(art==='kampf'||art==='kampf_schwer')o.foes=key==='vorraum'&&b.vorraum_elite?[b.vorraum_elite]:rollFoes(art,r);if(key==='vorraum'&&b.vorraum_elite&&b.weg_hinweise&&b.weg_hinweise.vorraum)o.hint=b.weg_hinweise.vorraum[0];if(art==='waechter')o.foes=[waechterWahl(b)];if(art==='finale')o.foes=[b.waechter];return o;});
 S.ebene=alt;return l;}

// Kreuzen sich zwei Kanten zwischen denselben Ebenen? (Knoten sind von oben nach unten nach i geordnet)
const netzKreuzt=(k,l)=>k.a[0]===l.a[0]&&k.b[0]===l.b[0]&&((k.a[1]<l.a[1]&&k.b[1]>l.b[1])||(k.a[1]>l.a[1]&&k.b[1]<l.b[1]));

// Kanten zwischen Ebene e (n Knoten) und e+1 (m Knoten): jeder Knoten links hat einen Ausgang, jeder rechts einen Eingang, keine Kreuzung
function netzVerbinden(e,n,m,r){const K=[];const passt=k=>!K.some(l=>netzKreuzt(k,l)||(l.a[1]===k.a[1]&&l.b[1]===k.b[1]));const add=(i,j)=>{const k={a:[e,i],b:[e+1,j]};if(passt(k)){K.push(k);return true;}return false;};
 const auf=(i,n,m)=>n<=1?Math.round((m-1)/2):Math.round(i*(m-1)/(n-1));
 for(let i=0;i<n;i++){add(i,auf(i,n,m));const j2=auf(i,n,m)+(r.chance(.5)?1:-1);if(j2>=0&&j2<m&&r.chance(.55))add(i,j2);}
 for(let j=0;j<m;j++)if(!K.some(k=>k.b[1]===j)){const i=auf(j,m,n);if(!add(i,j)){for(let d=1;d<n&&!K.some(k=>k.b[1]===j);d++){add(i-d,j)||add(i+d,j);}}}
 return K;}

// Ganzes Netz für den aktuellen Akt
function netzBauen(){const r=R(`netz:${S.akt}:${biomId()}`);const eb=aktDef().ebenen;
 const ebenen=eb.map((_,e)=>netzKnoten(e,R(`weg:${S.akt}:${e}`)));
 let kanten=[];for(let e=0;e+1<ebenen.length;e++)kanten.push(...netzVerbinden(e,ebenen[e].length,ebenen[e+1].length,r));
 const N={akt:S.akt,biom:biomId(),ebenen,kanten,pos:null,gegangen:[],klar:false,folgen:[]};
 netzFolgen(N,r);return N;}

// Folgen auf der Karte, je Akt höchstens zwei verschiedene über den Seed: Brüchiger Gang, Abkürzung, Dunkler Stollen
function netzFolgen(N,r){if(N.ebenen.length<5)return;const F=(BAL.karte&&BAL.karte.folgen)||{bruch:.6,kurz:.35,dunkel:.45};
 const moegl=r.shuffle(['bruch','kurz','dunkel']).filter(f=>r.chance(F[f]??.4)).slice(0,2);
 for(const f of moegl){
  if(f==='bruch'){// ein Pfad von einer Werkstatt, einem Krämer oder einer Rast, der einstürzt, wenn man dort etwas tut; der Knoten behält einen Ausgang
   const tat={werkstatt:'schmieden',kraemer:'kaufen',rast:'rasten'};
   const kand=N.kanten.filter(k=>{const v=N.ebenen[k.a[0]][k.a[1]];return tat[v.art]&&N.kanten.filter(l=>l.a[0]===k.a[0]&&l.a[1]===k.a[1]).length>1&&N.kanten.filter(l=>l.b[0]===k.b[0]&&l.b[1]===k.b[1]).length>1;});
   if(kand.length){const k=r.pick(kand);k.bruch={tat:tat[N.ebenen[k.a[0]][k.a[1]].art],weg:false};N.folgen.push('bruch');}}
  if(f==='kurz'){// Abkürzung: ein Pfad überspringt eine Ebene und führt direkt in einen schweren Kampf
   const kand=[];for(let e=0;e+2<N.ebenen.length-1;e++)N.ebenen[e].forEach((v,i)=>N.ebenen[e+2].forEach((w,j)=>{if(w.art==='kampf_schwer')kand.push({a:[e,i],b:[e+2,j],kurz:true});}));
   // nur am oberen oder unteren Rand, damit die Abkürzung keinen Pfad der übersprungenen Ebene kreuzt
   const frei=kand.filter(k=>(k.a[1]===0&&k.b[1]===0)||(k.a[1]===N.ebenen[k.a[0]].length-1&&k.b[1]===N.ebenen[k.b[0]].length-1));
   if(frei.length){N.kanten.push(r.pick(frei));N.folgen.push('kurz');}}
  if(f==='dunkel'){// Dunkler Stollen: ein Knoten zeigt sein Zeichen erst, wenn man direkt davor steht oder nach dem Wandbild
   const kand=[];N.ebenen.forEach((l,e)=>{if(e>=2&&e<N.ebenen.length-1)l.forEach((v,i)=>{if(v.art!=='waechter')kand.push(v);});});
   if(kand.length){r.pick(kand).dunkel=true;N.folgen.push('dunkel');}}}}

// Ausgänge eines Knotens (pos null = Aktanfang: alle Knoten der ersten Ebene)
function netzAusgaenge(N,pos){if(!pos)return N.ebenen[0].map((_,i)=>({b:[0,i]}));return N.kanten.filter(k=>k.a[0]===pos[0]&&k.a[1]===pos[1]&&!(k.bruch&&k.bruch.weg));}

// Wie weit sieht man? Zwei Ebenen voraus; nach dem Wandbild bis zum Wächter
function netzSicht(N){const e=N.pos?N.pos[0]:-1;return N.klar?N.ebenen.length-1:e+2;}
// Zeigt ein Knoten sein Zeichen? (Dunkler Stollen erst direkt davor oder nach dem Wandbild)
function netzZeigt(N,e,i){const v=N.ebenen[e][i];if(e>netzSicht(N))return false;if(!v.dunkel||N.klar)return true;return netzAusgaenge(N,N.pos).some(k=>k.b[0]===e&&k.b[1]===i)||(N.pos&&N.pos[0]===e&&N.pos[1]===i)||N.gegangen.some(p=>p[0]===e&&p[1]===i);}

// Ersetzt genWeg: S.weg = erreichbare Knoten von der aktuellen Stelle
function genWeg(){if(!S.netz||S.netz.akt!==S.akt||S.netz.biom!==biomId()){S.netz=netzBauen();Bus.emit('netz',{akt:S.akt,why:`${aktDef().n}: Netz aus ${S.netz.ebenen.map(l=>l.length).join('-')} Knoten${S.netz.folgen.length?', Folgen: '+S.netz.folgen.join(', '):''}`});}
 const N=S.netz;const aus=netzAusgaenge(N,N.pos);
 S.weg=aus.map(k=>{const v=N.ebenen[k.b[0]][k.b[1]];return{...v,ziel:k.b,kurz:!!k.kurz};});
 S.phase='weg';
 Bus.emit('weg',{optionen:S.weg.map(o=>o.art),why:`Ebene ${(N.pos?N.pos[0]:-1)+2} von ${N.ebenen.length}: ${S.weg.map(o=>RUN.knoten[o.art].n).join(', ')} (Netz)`});
 save();Bus.emit('changed');}

// Nach der Wahl: Position im Netz setzen (chooseWeg ruft das), S.ebene folgt dem Netz (Abkürzung springt eine Ebene)
function netzGehe(o){const N=S.netz;if(!N||!o.ziel)return;N.pos=o.ziel;N.gegangen.push(o.ziel);S.ebene=o.ziel[0];
 // verlorene Wege: alle Knoten der verlassenen Ebenen, die nicht gegangen wurden, verblassen in der Ansicht (über gegangen ablesbar)
 if(o.kurz)Bus.emit('abkuerzung',{why:'Abkürzung: eine Ebene übersprungen, direkt in einen schweren Kampf'});}

// Etwas an einem Knoten tun (schmieden, kaufen, rasten): ein brüchiger Gang von hier stürzt ein, man hört es nur
function netzTat(tat){const N=S.netz;if(!N||!N.pos)return;for(const k of N.kanten)if(k.bruch&&!k.bruch.weg&&k.bruch.tat===tat&&k.a[0]===N.pos[0]&&k.a[1]===N.pos[1]){k.bruch.weg=true;Bus.emit('rumpeln',{why:`Ein Gang hinter dem Nebel stürzt ein (${tat})`});}}

// Wandbild gelesen: Nebel bis zum Wächter weg
function netzKlar(){if(S.netz&&!S.netz.klar){S.netz.klar=true;Bus.emit('nebel_weg',{why:'Wandbild gelesen: die Karte ist bis zum Wächter klar'});}}
