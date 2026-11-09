// Auftrag 3 M11: Würze, seltene Einzelstücke (docs/auftrag-3/07-begegnungen-meta-wuerze.md Abschnitt 4). Schalter auftrag3.wuerze.
// Ein Vorrat, kein System: Jedes Stück steht in data/wuerze.json (id, ort, chance, an) und kommt nur, wenn es auf dem Run-Zettel steht.
// Höchstens drei je Run, kein Stück in zwei aufeinanderfolgenden Runs (Meta.wuerzeZuletzt).
// Stücke: zeitung (Zeitungsausschnitte im Übergang), brief (Der falsche Brief), trennung (Barmherzige Trennung), zann (Zanns Takt).
const Wuerze={
 an(){return a3('wuerze');},
 D(){return(typeof WUERZE!=='undefined'&&WUERZE)||{};},
 T(){return this.D().texte||{};},
 stuecke(){return(this.D().stuecke||[]).filter(s=>s.an!==false&&(!s.probe||a3(s.probe)));}, // Zugabe: Proben (Krämer mit tausend Masken) mit eigenem Schalter
 hat(id){return this.an()&&!!(S.zettel&&(S.zettel.wuerze||[]).includes(id));},
 // Beim Start (aus Zettel.wuerfeln): jedes Stück mit seiner Chance, ohne die des letzten Runs, höchstens drei
 wuerfeln(){if(!this.an())return[];const M=typeof Meta!=='undefined'?Meta.get():{};const zuletzt=M.wuerzeZuletzt||[];const r=R('wuerze');
  const l=r.shuffle(this.stuecke().filter(s=>!zuletzt.includes(s.id)&&r.chance(s.chance))).slice(0,3).map(s=>s.id);
  if(typeof Meta!=='undefined'&&!S.dev&&!DRY){M.wuerzeZuletzt=l;Meta.save();}
  if(l.length)Bus.emit('wuerze',{art:'zettel',why:`Würze auf dem Zettel: ${l.join(', ')}${zuletzt.length?' (nicht wieder: '+zuletzt.join(', ')+')':''}`});return l;},

 // ---------- Zeitungsausschnitte: zwischen zwei Akten, nicht in jedem Übergang ----------
 uebergang(){if(!this.hat('zeitung')||S.akt<1)return;const Z=this.T().zeitung||{};const r=R(`zeitung:${S.akt}`);if(!r.chance(this.D().zeitung_chance??.5))return;
  const M=Meta.get();const job=S.job;
  if((M.runs||0)>=9&&!S.vermisstGezeigt&&Z.vermisst&&Z.vermisst[job]&&r.chance(.3)){S.vermisstGezeigt=true;S.zeitung={akt:S.akt,kopf:((Z.vermisst_kopf||{}).t||''),t:Z.vermisst[job].t,vermisst:true};}
  else{const gesehen=S.zeitungGesehen||[];const frei=(Z.ausschnitte||[]).filter(a=>!gesehen.includes(a.id));if(!frei.length)return;const a=r.pick(frei);S.zeitungGesehen=[...gesehen,a.id];S.zeitung={akt:S.akt,kopf:a.kopf,t:a.t};}
  Bus.emit('wuerze',{art:'zeitung',why:`Zeitungsausschnitt im Übergang zu Akt ${S.akt+1}${S.zeitung.vermisst?': deine Vermisstenanzeige':''}`});},
 zeitungJetzt(){return S.zeitung&&S.zeitung.akt===S.akt&&S.phase==='uebergang'?S.zeitung:null;},

 // ---------- Der falsche Brief: Ereignis in Akt I oder II, Knoten im versprochenen Biom ----------
 briefHier(){if(!this.hat('brief')||S.akt>1||S.brief)return false;const r=R(`brief:${S.akt}`);
  const T=(this.T().brief||{}).briefe||{};const ziele=[];for(let a=S.akt+1;a<=3;a++)RUN.akte[a].biome.forEach(b=>{if(BIOMES[b]&&T[b])ziele.push([a,b]);});if(!ziele.length)return false;
  const[akt,ziel]=r.pick(ziele);S.brief={akt,ziel,angenommen:false};return true;},
 ereignis(id){if(id!=='falscher_brief'||!S.brief)return null;const B=this.T().brief||{};const E=B.ereignis||{};const t=(B.briefe||{})[S.brief.ziel];
  return{id:'falscher_brief',biom:'wuerze',t:E.t,d:`${E.d} ${t?'„'+t.t+'“':''}`,bild:E.bild,img:this.D().brief_bild||'',o:[{l:E.ja,fx:[]},{l:E.nein,fx:[]}]};},
 wahl(i,ev){if(!ev||ev.id!=='falscher_brief'||!S.brief)return;if(i===0){S.brief.angenommen=true;Bus.emit('wuerze',{art:'brief',why:`Brief eingesteckt: Hilfe versprochen in ${BIOMES[S.brief.ziel].n} (Akt ${S.brief.akt+1})`});}},
 // Biomwahl: das versprochene Biom steht sicher im Angebot seines Akts
 angebot(an){const b=S.brief;if(!b||!b.angenommen||b.akt!==S.akt||an.biome.includes(b.ziel)||!BIOMES[b.ziel])return an;an.biome[an.biome.length-1]=b.ziel;an.why+=` · der Brief nennt ${BIOMES[b.ziel].kurz}`;return an;},
 // Peilkarte: ein Knoten mit einem Brief (kein Kampf, nicht die letzte Ebene)
 markieren(N,r){const b=S.brief;if(!b||!b.angenommen||N.akt!==b.akt||biomId()!==b.ziel)return;const L=N.ebenen.length;const k=[];
  N.ebenen.forEach((l,e)=>{if(e>=1&&e<L-1)l.forEach(v=>{if(!/kampf|waechter|finale/.test(v.art||''))k.push(v);});});
  if(!k.length)N.ebenen.forEach((l,e)=>{if(e<L-1)l.forEach(v=>{if(!/waechter|finale/.test(v.art||''))k.push(v);});});
  if(!k.length)return;r.pick(k).brief=true;N.folgen.push('brief');},
 briefKnoten(o){const N=S.netz;if(!N||!o||!o.ziel)return false;const v=N.ebenen[o.ziel[0]][o.ziel[1]];if(!v||!v.brief||v.besucht)return false;v.besucht=true;
  const vg=Meta.get().vorgaenger;const items=vg&&!S.dev?(vg.items||[]).filter(id=>ITEMS[id]):[];
  S.briefAngebot={item:items.length?R(`brief:item:${S.depth}`).pick(items):null,job:vg&&vg.job};S.phase='brief';
  if(!S.briefAngebot.item){const t=((this.T().brief||{}).tagebuch||{}).t;if(t&&typeof Metaebene!=='undefined')Metaebene.seiteMerken('brief',[t]);}
  Bus.emit('wuerze',{art:'brief_knoten',why:S.briefAngebot.item?`Der Absender: der Vorgänger aus dem letzten verlorenen Run, er bietet ${ITEMS[S.briefAngebot.item].n}`:'Niemand da: kein verlorener Run vorher, der Brief bleibt im Tagebuch'});Bus.emit('changed');return true;},
 briefNehmen(ja){if(S.phase!=='brief')return;const a=S.briefAngebot;S.briefAngebot=null;
  if(ja&&a&&a.item){if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});S.briefAngebot=a;return;}giveItem(a.item,'Der falsche Brief');}
  S.phase='knoten';finishNode();},

 // ---------- Barmherzige Trennung: drei Teile an Fundstellen und Wandbildern, zwei nacheinander gespielt ----------
 TEILE:['relief','ausschnitt','aussage'],
 teilFinden(){if(!this.hat('trennung'))return null;const n=S.trennungTeile||0;if(n>=3)return null;const id=this.TEILE[n];S.trennungTeile=n+1;(S.lose=S.lose||[]).push('tr_'+id);
  const c=this.karte('tr_'+id);Bus.emit('wuerze',{art:'trennung_teil',why:`Barmherzige Trennung: Teil ${n+1} von 3 (${c?c.n:id}) liegt lose im Deck`});Bus.emit('toast',{a:c?c.n.toUpperCase():'',b:((this.T().trennung||{}).fund||{}).t||''});return id;},
 karte(id){if(!id||!id.startsWith('tr_'))return null;const k=id.slice(3);const K=(this.D().karten||{})[k];const T=(this.T().trennung||{})[k]||{};if(!K)return null;
  return{...K,n:T.n||k,t:T.t||'',src:T.n||k,cid:'lose:'+id,lose:id,trennung:k};},
 gespielt(c){if(!c)return;const vor=S.trVorher;S.trVorher=c.trennung||null;
  if(!c.trennung||!vor||vor===c.trennung||S.trennungFertig||!this.hat('trennung'))return;
  S.trennungFertig=true;S.trennungOffen=true;const Z=(this.T().trennung||{}).zusammenhang||{};
  Bus.emit('wuerze',{art:'trennung',why:`Zwei Teile nacheinander gespielt (${vor} → ${c.trennung}): nach dem Kampf verwandelt sich ein Handgriff deiner Wahl in die fremde Fassung`});Bus.emit('toast',{a:(Z.titel||'').toUpperCase(),b:''});},
 nachSieg(){if(!S.trennungOffen||!this.handgriffe().length){S.trennungOffen=false;return;}wahlStart('trennung','reward');},
 handgriffe(){const l=[];besitz().filter(b=>b.an).forEach(({it})=>hgVon(it).forEach((h,k)=>{if(HANDGRIFFE[h]&&!(it.fremd&&it.fremd['h'+k]))l.push({it,k,hg:h});}));return l;},
 trennen(uid,k){if(!S.wahl||S.wahl.art!=='trennung')return;const it=allActive().find(x=>x.uid===uid);if(!it||!hgVon(it)[k])return;it.fremd=it.fremd||{};it.fremd['h'+k]=true;S.trennungOffen=false;
  Bus.emit('wuerze',{art:'trennung_fremd',why:`${HANDGRIFFE[hgVon(it)[k]].n} auf ${def(it).n} ist jetzt die fremde Fassung (dauerhaft, Wirkung ×1,5)`});wahlFertig();},

 // ---------- Zanns Takt: Zanns Geige gegen die Ungetaufte (Glockengießerei) ----------
 GEIGE:'zanns_geige',
 fundpool(){return this.hat('zann')&&biomId()===(this.D().zann_biom||'glockengiesserei')?[this.GEIGE]:[];},
 imPool(id){return!(ITEMS[id]&&ITEMS[id].wuerze)||this.fundpool().includes(id);},
 aktEintritt(){if(this.hat('zann')&&biomId()===(this.D().zann_biom||'glockengiesserei')&&!besitz().some(b=>b.it.id===this.GEIGE))S.sicheresBeute=this.GEIGE;},
 zannAktiv(){if(!this.hat('zann')||S.kampfArt!=='waechter')return null;const w=alive().find(e=>e.id===(this.D().zann_waechter||'ungetaufte'));if(!w)return null;
  const g=besitz().find(b=>b.an&&b.it.id===this.GEIGE);return g?{w,g:g.it}:null;},
 musik(an,why){if(typeof Music!=='undefined'&&Music.geige)try{Music.geige(an,why);}catch(e){}},
 kampfStart(){S.trVorher=null;S.zannZug=false;S.zannOffen=false;const z=this.zannAktiv();if(z){S.zannKampf=true;this.musik(true,'Zanns Geige gegen die Ungetaufte');Bus.emit('wuerze',{art:'zann',why:'Zanns Takt: spiel jeden Zug eine Karte der Geige, sonst geht das Fenster auf'});}else S.zannKampf=false;},
 karteGespielt(c){if(S.zannKampf&&c&&c.uid!=null){const z=this.zannAktiv();if(z&&c.uid===z.g.uid){S.zannZug=true;if(S.zannAus){S.zannAus=false;this.musik(true,'weitergespielt');Bus.emit('toast',{a:'',b:((this.T().zann||{}).zu||{}).t||''});}}}},
 zugEnde(){if(!S.zannKampf)return;const z=this.zannAktiv();if(!z){S.zannKampf=false;this.musik(false,'Kampf vorbei');return;}
  if(!S.zannZug){S.zannOffen=true;S.zannAus=true;this.musik(false,'ausgesetzt');Bus.emit('wuerze',{art:'zann_offen',why:`Kein Geigenspiel in diesem Zug: das Fenster geht auf, ${z.w.n} bekommt im nächsten Zug den stärksten Schritt`});Bus.emit('toast',{a:'',b:((this.T().zann||{}).offen||{}).t||''});}
  S.zannZug=false;},
 // nach dem Gegnerzug: die nächste Absicht des Wächters ist sein stärkster Angriff
 nachGegnerzug(){if(!S.zannOffen)return;S.zannOffen=false;const z=this.zannAktiv();if(!z)return;const w=z.w;let bi=-1,bv=-1;
  w.pat.forEach((x,i)=>{if(x.t==='atk'){const v=(x.v||0)*(x.h||1);if(v>bv){bv=v;bi=i;}}});if(bi>=0)w.pi=bi;},
 kampfEnde(){if(S.zannKampf){S.zannKampf=false;this.musik(false,'Kampf vorbei');}},

 // ---------- Zugabe, Probe: Der Krämer mit tausend Masken (Schalter auftrag3.masken) ----------
 // Der erste Krämer in Akt II bis IV hat ein anderes Gesicht und denselben Ring. Er schreibt ein Item an (einmal je Run).
 // Am Anfang des nächsten Akts kassiert er: einen Handgriff deiner Wahl. Hast du keinen, nimmt er das Item zurück.
 maskenHier(){return this.hat('masken')&&!S.masken&&S.akt>=1&&S.akt<=3&&S.shop&&!S.shop.zu&&S.shop.art!=='tausch';},
 maskenKraemer(){if(!this.maskenHier())return;S.shop.masken=true;S.masken={akt:S.akt,schuld:null,bezahlt:false};
  Bus.emit('wuerze',{art:'masken',why:'Der Krämer mit tausend Masken: ein Item auf Kredit, bezahlt wird am Anfang des nächsten Akts mit einem Handgriff'});},
 anschreiben(i){const sh=S.shop,M=S.masken;if(!sh||!sh.masken||!M||M.schuld)return;const o=sh.items[+i];if(!o||o.sold||o.tausch)return;
  if(!S.bag.includes(null)){Bus.emit('bad',{a:'RUCKSACK VOLL',b:'Wirf vorher etwas in den Müll.'});return;}
  o.sold=true;o.kredit=true;giveItem(o.id,'Angeschrieben');const it=besitz().map(b=>b.it).filter(x=>x.id===o.id).pop();M.schuld={id:o.id,uid:it?it.uid:null,akt:S.akt};
  netzTat('kaufen');Bus.emit('pick');Bus.emit('toast',{a:'ANGESCHRIEBEN',b:ITEMS[o.id].n});
  Bus.emit('wuerze',{art:'masken_kredit',why:`${ITEMS[o.id].n} angeschrieben: am Anfang von Akt ${S.akt+2} kassiert er einen Handgriff`});Bus.emit('changed');},
 maskenHandgriffe(){const l=[];besitz().forEach(({it})=>hgVon(it).forEach((h,k)=>{if(HANDGRIFFE[h]&&!(def(it).fest_hg||[]).includes(h))l.push({it,k,hg:h});}));return l;},
 // aus enterAct, nach dem Übergang gesetzt: die Schuld ist fällig
 kassieren(){const M=S.masken;if(!M||!M.schuld||M.bezahlt||S.akt<=M.schuld.akt||S.phase!=='uebergang')return;
  if(this.maskenHandgriffe().length){wahlStart('masken','uebergang');return;}
  M.bezahlt=true;const b=besitz().find(x=>x.it.uid===M.schuld.uid);const T=(this.T().masken||{});if(b)setAt(b.loc,null);
  Bus.emit('toast',{a:'',b:(T.ohne||{}).t||''});Bus.emit('wuerze',{art:'masken_bezahlt',why:'Kein Handgriff zum Bezahlen: er nimmt das Item zurück'});},
 bezahlen(uid,k){if(!S.wahl||S.wahl.art!=='masken')return;const it=itemByUid(uid);if(!it||!hgVon(it)[k]||(def(it).fest_hg||[]).includes(hgVon(it)[k]))return;
  const id=hgVon(it).splice(k,1)[0];S.masken.bezahlt=true;Bus.emit('toast',{a:'BEZAHLT',b:HANDGRIFFE[id].n});
  Bus.emit('wuerze',{art:'masken_bezahlt',why:`Der Ring nimmt ${HANDGRIFFE[id].n} von ${def(it).n} mit`});wahlFertig();}
};
