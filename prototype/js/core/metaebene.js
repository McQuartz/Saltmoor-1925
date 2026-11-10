// Auftrag 3 M10: Metaebene über Runs (docs/auftrag-3/07-begegnungen-meta-wuerze.md Abschnitt 3). Schalter auftrag3.meta, Fehlzeit und Pause zusätzlich auftrag3.fehlzeit / auftrag3.pause.
// Zähler und Gedächtnis liegen in Meta (meta.js, Version 2), die Texte in data/meta.json (META). Alles hier ist leise: Text und Bild, keine Zahl.
const Metaebene={
 an(){return a3('meta');},
 T(){return (typeof META!=='undefined'&&META)||{};},
 // --- Das Spiel zählt mit: Stufe des Strands nach der Zahl der Abstiege (ab dem 2. eine Spur, ab dem 5. mehrere, ab dem 15. viele, ab dem 40. ein Pfad) ---
 strandStufe(){if(!this.an())return 0;const n=Meta.get().runs||0;return n>=39?4:n>=14?3:n>=4?2:n>=1?1:0;},
 // --- Die Ausrede bröckelt: Stufe 0 = ausrede aus jobs.json, 1 ab dem 3., 2 ab dem 8., 3 ab dem 15. Run mit der Figur ---
 ausredeStufe(job){if(!this.an())return 0;const n=((Meta.get().runsJob||{})[job])||0;return n>=14?3:n>=7?2:n>=2?1:0;},
 ausrede(j){if(!j)return'';const s=this.ausredeStufe(j.id);if(!s)return j.ausrede;if(s===3)return(this.T().ausrede_ende||{}).t||j.ausrede;
  const l=(this.T().ausrede||{})[j.id];return(l&&l[s-1]&&l[s-1].t)||j.ausrede;},
 // --- Bleiben ist der Sog: nach dem ersten Umkehren überhaupt einmal eine eigene Ankunftszeile ---
 ankunftZeile(){if(!this.an()||!Meta.get().ankunftOffen)return null;const a=this.T().ankunft_nach_umkehren;return a&&a.t||null;},
 // --- Die Pause wird bemerkt: Sitzung beginnt (main.js). Mehr als 14 Tage seit der letzten, höchstens einmal in 30 Tagen ---
 TAG:86400000,pauseText:null,
 sitzung(jetzt){const M=Meta.get();jetzt=jetzt||Date.now();this.pauseText=null;
  if(this.an()&&a3('pause')&&M.runs>0&&M.zuletzt&&jetzt-M.zuletzt>14*this.TAG&&jetzt-(M.pauseGezeigt||0)>30*this.TAG){
   const z=(this.T().pause||{})[M.letzterOrt];if(z&&z.t){this.pauseText=z.t;M.pauseGezeigt=jetzt;if(typeof Bus!=='undefined')Bus.emit('meta',{art:'pause',why:`Letzte Sitzung vor ${Math.floor((jetzt-M.zuletzt)/this.TAG)} Tagen, zuletzt in ${M.letzterOrt}: Pausen-Zeile`});}}
  M.zuletzt=jetzt;Meta.save();return this.pauseText;},
 // --- Runstart (aus newRun, vor enterAct). true = newRun ruft enterAct nicht selbst (Erbe-Angebot oder Fehlzeit haben es übernommen) ---
 runStart(opt){S.loseHg=S.loseHg||[];S.notizen=null;S.notizenPlan=null;S.fehlzeit=null;S.erbeAngebot=null;
  if(!this.an()||opt.metaAus)return false;const M=Meta.get();
  if(M.ankunftOffen){M.ankunftOffen=false;Meta.save();}
  let selbst=false;const vor=M.letzter;
  if(M.fehlzeitNaechster&&a3('fehlzeit')){this.fehlzeitLaufen(opt);selbst=true;}
  // Tagebuch des Vorgängers: nach einem verlorenen Run mit 1/3 an der ersten Rast (nach der Fehlzeit, damit der Autospieler sie nicht findet)
  if(vor&&vor.verloren&&R('meta:notizen').chance(1/3))S.notizenPlan={...vor};
  // Das Erbe: der meistgespielte Handgriff des letzten Runs, mit seinen Stoffen von damals
  const e=M.erbe;if(e&&HANDGRIFFE[e.hg]){S.erbeAngebot={...e};S.nachErbe=selbst?S.phase:null;S.phase='erbe';Bus.emit('meta',{art:'erbe',why:`Erbe: ${HANDGRIFFE[e.hg].n} (${e.n}× gespielt im letzten Run)`});return true;}
  return selbst;},
 erbeWahl(nehmen){if(S.phase!=='erbe'||!S.erbeAngebot)return;const e=S.erbeAngebot;S.erbeAngebot=null;
  if(nehmen){S.loseHg.push({hg:e.hg,st:[...e.st],src:e.src,art:'erbe'});log(`Erbe: ${HANDGRIFFE[e.hg].n}`);Bus.emit('meta',{art:'erbe_genommen',why:`${HANDGRIFFE[e.hg].n} liegt lose im Deck, Stoffe ${e.st.join('')}`});}
  const zurueck=S.nachErbe;S.nachErbe=null;if(zurueck){S.phase=zurueck;Bus.emit('changed');}else enterAct();},
 // Lose Handgriffe (Erbe, fremder Handgriff nach Fehlzeit) als Karten fürs Deck
 loseKarten(){return(S.loseHg||[]).map((x,i)=>{const H=HANDGRIFFE[x.hg];if(!H)return null;
  const c={...H,st:[...x.st],src:x.src||'Erbe',img:(typeof hgBild==='function'&&hgBild(x.hg))||'',hg:x.hg,cid:'losehg:'+i,lose:true,erbe:x.art==='erbe'};
  return x.art==='fremd'&&typeof fremdeFassung==='function'?fremdeFassung(c):c;}).filter(Boolean);},
 // --- Runende (aus Meta.runEnde, nur echte Runs) ---
 runEnde(res,M){M.runsJob=M.runsJob||{};M.runsJob[S.job]=(M.runsJob[S.job]||0)+1;M.letzterOrt=res.biom;M.zuletzt=Date.now();
  if(res.sieg&&res.ende==='umkehren'&&!M.umkehrenGewaehlt){M.umkehrenGewaehlt=true;M.ankunftOffen=true;}
  M.letzter={verloren:!res.sieg,job:S.job,tiefe:res.tiefe,biome:(S.route||[]).slice(0,(res.akt||0)+1).filter(b=>BIOMES[b]),waechter:[...new Set((S.stats&&S.stats.waechter)||[])]};
  // Erbe: meistgespielter Handgriff (S.kartenZahl zählt je Item und Kerbe), Stoffe des Items von damals
  let best=null;const z=S.kartenZahl||{};for(const id in z){const[uid,key]=id.split(':');if(!key||key[0]!=='h')continue;const it=allActive().find(x=>String(x.uid)===uid);if(!it)continue;
   const hg=hgVon(it)[+key.slice(1)];if(!hg||!HANDGRIFFE[hg])continue;if(!best||z[id]>best.n)best={hg,st:[...def(it).st],src:def(it).n,n:z[id]};}
  M.erbe=best;
  M.fehlzeitAngebot=!!(this.an()&&a3('fehlzeit')&&res.akt===4);},
 fehlzeitWahl(ja){const M=Meta.get();if(!M.fehlzeitAngebot)return;M.fehlzeitAngebot=false;M.fehlzeitNaechster=!!ja;Meta.save();
  Bus.emit('meta',{art:'fehlzeit',why:ja?'Fehlzeit angenommen: der nächste Run beginnt in Akt II':'Fehlzeit abgelehnt'});Bus.emit('changed');},
 // --- Fehlzeit: der Autospieler geht Akt I mit deiner Figur und deinem Seed, still im Hintergrund ---
 fehlzeitLaufen(opt){const M=Meta.get();M.fehlzeitNaechster=false;Meta.save();
  const job=S.job,seed=S.seed,dv=S.dev,kf=FAST,mu=Bus.muted;FAST=true;Bus.muted=true;S.dev=true;let n=0;
  try{enterAct();while(S.akt<1&&!['strand','ende'].includes(S.phase)&&n++<3000){if(!Bot.schritt())break;}}catch(e){console.warn('Fehlzeit',e);}
  const tot=S.akt<1;const b1=S.route[0];const waechter=[...new Set((S.stats&&S.stats.waechter)||[])];
  // Handgriffe, die er bekommen hat (nicht die der Figur)
  const startHg=new Set(Object.values(JOBS.find(j=>j.id===job).hg||{}).flat());
  const seine=[];allActive().forEach(it=>hgVon(it).forEach(h=>{if(!startHg.has(h)&&HANDGRIFFE[h])seine.push({hg:h,st:[...def(it).st],src:def(it).n});}));
  FAST=kf;Bus.muted=mu;
  if(tot){newRun(job,seed,{...opt,metaAus:true,dev:dv});S.route[0]=b1;S.akt=1;S.depth=RUN.akte[0].ebenen.length;
   const f=seine.length?R('meta:fehlzeit:hg').pick(seine):(()=>{const ids=Object.keys(HANDGRIFFE).filter(h=>!HANDGRIFFE[h].unspielbar&&HANDGRIFFE[h].rar!=='selten');const h=R('meta:fehlzeit:hg').pick(ids);return{hg:h,st:[],src:'Fremd'};})();
   S.loseHg.push({...f,art:'fremd'});}
  else{S.dev=dv;S.kartenZahl={};S.startT=Date.now();S.log=[];
   besitz().forEach(({it})=>{const l=hgVon(it);if(!l.length)return;it.fremd=it.fremd||{};l.forEach((_,k)=>{it.fremd['h'+k]=true;});});
   (S.loseHg||[]).forEach(x=>{x.art='fremd';});}
  // Tagebucheinträge, die du nicht geschrieben hast: was er tatsächlich erlebt hat, mit den wahren Sätzen
  const N=this.T().notizen||{};const zeilen=[];
  if(b1&&N.biome&&N.biome[b1])zeilen.push(N.biome[b1].wahr);waechter.forEach(w=>{if(N.waechter&&N.waechter[w])zeilen.push(N.waechter[w].wahr);});
  S.fehlzeit={tot,biom:b1,zeilen:zeilen.filter(Boolean)};this.seiteMerken('fehlzeit',S.fehlzeit.zeilen);
  // Er beginnt bei der Kapelle, wenn Akt II sie hat (Steckbrief: »beginnt erst bei der Kapelle«); sonst die Biomwahl von Akt II
  if(RUN.akte[1].biome.includes('kapelle')&&BIOMES.kapelle){S.route[1]='kapelle';S.routeWhy.push('Fehlzeit: Kapelle');enterAct();}else if(tot)enterAct();
  Bus.emit('meta',{art:'fehlzeit_lauf',why:`Fehlzeit: der Autospieler ${tot?'stirbt in Akt I, du beginnst mit dem Startdeck und einem fremden Handgriff':'kommt durch Akt I, du bekommst sein Deck in fremder Fassung'}`});},
 übergangSatz(){const F=this.T().fehlzeit||{};if(!S.fehlzeit||S.akt!==1)return null;return S.fehlzeit.tot?F.tot:F.start;},
 // --- Tagebuch des Vorgängers: an der ersten Rast ein bis drei Notizen, falsche Anteil = Tiefe/40, höchstens 60 % ---
 notizenAnRast(){if(!S.notizenPlan||S.notizen)return null;const q=S.notizenPlan;const r=R('meta:notizen:zeilen');const N=this.T().notizen||{};
  const themen=[...(q.waechter||[]).filter(w=>N.waechter&&N.waechter[w]).map(id=>['waechter',id]),...(q.biome||[]).filter(b=>N.biome&&N.biome[b]).map(id=>['biome',id])];
  if(!themen.length){S.notizen=[];return S.notizen;}
  const p=Math.min(.6,(q.tiefe||0)/40);const n=Math.min(themen.length,r.int(1,3));
  S.notizen=r.sample(themen,n).map(([art,id])=>{const wahr=!r.chance(p);return{art,id,wahr,t:(()=>{const e=N[art][id];const v=r.pick([e,...(e.mehr||[])]);return v[wahr?'wahr':'falsch'];})()}; /* Zugabe: weitere Fassungen je Thema in mehr[] */});
  this.seiteMerken('vorgaenger',S.notizen.map(x=>x.t));
  Bus.emit('meta',{art:'notizen',why:`Notizen des Vorgängers (Tiefe ${q.tiefe}): ${S.notizen.length} Sätze, ${S.notizen.filter(x=>!x.wahr).length} falsch (Anteil ${Math.round(p*100)} %)`});return S.notizen;},
 seiteMerken(art,zeilen){if(!zeilen||!zeilen.length||S.dev)return;const M=Meta.get();M.seiten=M.seiten||[];M.seiten.push({art,run:(M.runs||0)+1,job:S.job,zeilen});if(M.seiten.length>12)M.seiten.shift();Meta.save();}
};
