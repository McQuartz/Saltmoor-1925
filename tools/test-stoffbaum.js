// Stoff-Baum (prototype/js/ui/stoffbaum.js): Daten und HTML gegen reactionsFor prüfen. node tools/test-stoffbaum.js
const {ladeKern}=require('./kern');
let fehler=0,n=0;
const ok=(b,t)=>{n++;if(!b){fehler++;console.log('FEHLER: '+t);}else console.log('ok: '+t);};
(async()=>{
 const K=ladeKern(['js/ui/stoffbaum.js']);await K.init();
 const J=c=>JSON.parse(K.run(`JSON.stringify((()=>{${c}})())`));
 const neu=()=>K.run(`newRun('fischer',5,{dev:true});startFight([Object.keys(FOES)[0]]);S.hand=[];S.energy=3;S.hochUsed=new Set();0`);
 const karte=(st,c=1)=>`{n:'T${st}',st:${JSON.stringify([...st])},c:${c},id:'t'}`;
 const spiele=(st,c=0)=>`S.hand.push(${karte(st,c)});playCard(S.hand.length-1);`;

 // 0. kein Kampf: leerer String, kein Fehler
 K.run(`newRun('fischer',5,{dev:true});S.phase='karte';0`);
 ok(K.run('stoffBaumHtml()')==='','kein Kampf: leerer String');

 // 1. Zugbeginn
 neu();
 let d=J('return baumDaten()');
 ok(d.pfad.length===0&&d.letzter.length===0&&d.aeste.length===0&&d.sackgasse===false,'Zugbeginn: leer, keine Äste, keine Sackgasse');
 let h=K.run('stoffBaumHtml()');
 ok(!/data-ast/.test(h)&&/sb-punkt/.test(h)&&!/Sackgasse/.test(h),'Zugbeginn HTML: Platzhalter-Punkt, keine Äste');

 // 2. nach einer Karte: Äste = Stoffe mit nicht-leerem reactionsFor
 neu();K.run(`S.energy=9;${spiele('F')}0`);
 d=J(`const e=Object.keys(ST).filter(k=>reactionsFor(S.last,[k]).length);return {d:baumDaten(),e,last:S.last}`);
 ok(JSON.stringify(d.d.letzter)==='["F"]','letzter = S.last');
 const einzel=d.d.aeste.filter(a=>a.stoff.length===1).map(a=>a.stoff[0]);
 ok(JSON.stringify(einzel)===JSON.stringify(d.e)&&einzel.length>=3,'Äste = Stoffe mit reactionsFor(S.last,[k]) ('+einzel.join('')+')');
 ok(d.d.aeste.every(a=>a.rx.length&&a.n===a.rx.map(r=>r.n).join(' · ')),'jeder Ast hat Reaktionen und zusammengesetzten Namen');
 ok(J('return baumDaten().pfad')[0][0]==='F'&&J('return baumDaten().pfad').length===1,'Pfad: 1 Glied F');

 // 3. hell/gedimmt: Hand mit nur Wasser (billig) -> nur Ast W hell; zu teuer -> alle dunkel
 neu();K.run(`S.energy=9;${spiele('F')}S.energy=3;S.hand=[${karte('W',1)}];0`);
 d=J('return baumDaten()');
 const hell=d.aeste.filter(a=>a.hell).map(a=>a.stoff.join(''));
 ok(JSON.stringify(hell)==='["W"]'&&d.aeste.length>1&&!d.sackgasse,'Hand W (bezahlbar): nur Ast W hell, übrige gedimmt, keine Sackgasse');
 h=K.run('stoffBaumHtml()');
 ok(/data-ast="W"[^>]*data-hell="1"/.test(h)&&/data-ast="E"[^>]*data-hell="0"/.test(h),'HTML: data-hell 1 für W, 0 für E');
 K.run(`S.energy=0;S.hand=[${karte('W',2)}];0`);
 d=J('return baumDaten()');
 ok(d.aeste.length>1&&d.aeste.every(a=>!a.hell)&&d.sackgasse===true,'Hand zu teuer: alle Äste gedimmt, Sackgasse');
 K.run(`S.energy=3;S.hand=[{...${karte('W',1)},frost:true}];0`);
 ok(J('return baumDaten().sackgasse')===true,'eingefrorene Karte löst keinen Ast aus');
 K.run(`S.energy=3;S.hand=[{...${karte('W',1)},unspielbar:true}];0`);
 ok(J('return baumDaten().sackgasse')===true,'unspielbare Karte löst keinen Ast aus');

 // 4. Sackgasse: Hand ohne passenden Stoff
 neu();K.run(`S.energy=9;${spiele('F')}S.energy=3;S.hand=[];0`);
 d=J('return baumDaten()');h=K.run('stoffBaumHtml()');
 ok(d.sackgasse===true&&/Sackgasse/.test(h)&&!/class="sb-ast/.test(h),'leere Hand: Sackgasse im HTML, statt der Äste');
 ok(J('return reactionsFor(["F"],["B"]).length')===0,'Vorbedingung: F->B reagiert nicht');
 K.run(`S.hand=[${karte('B',1)}];0`);
 ok(J('return baumDaten().sackgasse')===true,'Handkarte ohne Reaktion (B nach F): Sackgasse');
 h=K.run('stoffBaumHtml()');
 ok(/sb-sack/.test(h),'Sackgasse-Element im HTML');

 // 5. Hochreaktion gold, nach Gebrauch nicht mehr
 neu();K.run(`S.energy=9;${spiele('FG')}S.energy=3;S.hand=[${karte('S',1)}];0`);
 d=J('return baumDaten()');
 const s=d.aeste.find(a=>a.stoff.join('')==='S');
 ok(s&&s.gold===true&&s.hell===true&&s.rx.some(r=>r.s),'FG dann S: Ast S enthält Hochreaktion, gold und hell');
 h=K.run('stoffBaumHtml()');
 ok(/sb-ast[^"]*gold/.test(h),'HTML: Ast mit Klasse gold');
 K.run(`S.hand=[${karte('S',1)}];playCard(0);S.hand=[${karte('S',1)}];0`);
 ok(J('return [...S.hochUsed]').length===1,'Hochreaktion verbraucht (hochUsed)');
 d=J('return baumDaten()');
 ok(d.aeste.every(a=>!a.gold)&&d.aeste.every(a=>a.rx.every(r=>!r.s)),'nach Gebrauch: kein Ast mehr gold');
 ok(d.pfad.length===2&&d.pfad.map(g=>g.join('')).join()==='FG,S','Pfad nach zwei Karten: FG,S');

 // 5b. Mehrstoff-Karte mit Hochreaktion ohne Einzelast
 neu();K.run(`S.energy=9;${spiele('F')}S.energy=3;S.hand=[${karte('GS',1)}];0`);
 d=J('return baumDaten()');
 const m=d.aeste.find(a=>a.stoff.join('')==='GS');
 ok(m&&m.rx.some(r=>r.s)&&m.gold&&m.hell,'Karte GS nach F: eigener Ast GS mit Hochreaktion, gold, hell');
 ok(!d.aeste.some(a=>a.stoff.length===1&&a.rx.some(r=>r.s)),'... und kein Einzelstoff-Ast hat sie');
 ok(/data-ast="GS"/.test(K.run('stoffBaumHtml()')),'HTML: data-ast="GS"');

 // 6. Pfad = Karten dieses Zugs (neuer Zug leert ihn)
 neu();K.run(`S.energy=9;${spiele('F')}${spiele('W')}0`);
 ok(J('return baumDaten().pfad').length===2,'Pfad: zwei Karten dieses Zugs');
 K.run('startTurn();0');
 const zug=J('return {t:S.turnNo,p:baumDaten(),ph:S.phase}');
 ok(zug.t===2&&zug.p.pfad.length===0&&zug.p.letzter.length===0&&zug.p.aeste.length===0&&!zug.p.sackgasse,'neuer Zug (startTurn): Pfad, Äste und Sackgasse leer');
 neu();K.run(`S.energy=9;${spiele('F')}S.turnNo+=1;S.last=[];0`);
 ok(J('return baumDaten().pfad').length===0,'Einträge anderer Züge zählen nicht zum Pfad');

 // 7. Mitrücken
 neu();K.run('stoffBaumHtml();0');
 K.run(`S.energy=9;${spiele('F')}0`);
 ok(/sb-kette rueck/.test(K.run('stoffBaumHtml()')),'Pfad +1: Klasse rueck');
 ok(!/sb-kette rueck/.test(K.run('stoffBaumHtml()')),'gleiche Länge: keine Klasse');

 // 8. kein „?“, keine Verbotswörter, Titel unverändert
 const alle=[];
 for(const st of ['E','F','W','S','B','G','L','V']){neu();K.run(`S.energy=9;${spiele(st)}S.hand=[${karte('F',1)},${karte('W',1)},${karte('GS',1)}];0`);alle.push(K.run('stoffBaumHtml()'));}
 ok(alle.every(x=>!/\?|unbekannt|verborgen/i.test(x.replace(/<[^>]*>/g,t=>t.replace(/title="[^"]*"/,'')))),'kein „?“, kein „unbekannt“ im sichtbaren HTML (alle 8 Startstoffe)');
 neu();K.run(`S.energy=9;${spiele('F')}S.hand=[${karte('E',1)}];0`);
 h=K.run('stoffBaumHtml()');
 const ts=J(`return reactionsFor(['F'],['E']).map(r=>r.t)`);
 ok(ts.every(t=>h.includes('title="'+t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')+'"')),'title = Reaktionstext t unverändert');
 ok(/data-rx="Glühend"/.test(h),'data-rx trägt den Namen');
 // nicht entdeckte Reaktionen werden trotzdem mit Namen gezeigt
 K.run('S.disc=new Set();0');
 ok(/Glühend/.test(K.run('stoffBaumHtml()')),'Reaktion mit Namen auch ohne S.disc-Eintrag');

 console.log(fehler?`${fehler} von ${n} FEHLER`:`Alles gut (${n} Prüfungen).`);process.exit(fehler?1:0);
})();
