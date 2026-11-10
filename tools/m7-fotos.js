// Auftrag 3 M7: Bildschirmfotos für die Abnahme (Sehen und gesehen werden).
// node tools/m7-fotos.js [ziel=docs/auftrag-3/bilder/M7]   (Server auf Port 8000 im Ordner prototype/)
const {chromium}=require('playwright');
(async()=>{const out=process.argv[2]||'docs/auftrag-3/bilder/M7';require('fs').mkdirSync(out,{recursive:true});
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});const f=[];
 p.on('pageerror',e=>f.push(String(e)));p.on('console',m=>{if(m.type()==='error'&&!/404/.test(m.text()))f.push(m.text());});
 // Kampf im Biom b (Akt a) mit Blick-Item it und Gegnern ids aufbauen
 const kampf=async(a,biom,it,ids,art='kampf')=>{await p.goto(`http://localhost:8000/index.html?dev=0&job=fischer&seed=8&springe=kampf&akt=${a}`);await p.waitForTimeout(700);
  await p.evaluate(([a,biom,it,ids,art])=>{S.akt=a;S.route[a]=biom;S.depth=3+a*6;if(it){const ar=ITEMS[it].a;S.slots[ar]=Math.max(1,S.slots[ar]);S.areas[ar][0]=mk(it);}
   S.hp=maxHp();startFight(ids,art);BU.key='';render();},[a,biom,it,ids,art]);await p.waitForTimeout(900);};
 const foto=async(n,warte=500)=>{await p.waitForTimeout(warte);await p.screenshot({path:`${out}/${n}.png`});};
 // 1 Wahl, 2 Hinsehen (stummer Astronom lesbar, Gesehener vom Grund), 3 Nicht hinsehen zum Vergleich
 await kampf(3,'mond','grablampe',['astronom','kraterbewohner']);await foto('01-wahl');
 await p.click('[data-act="hinsehen"]');await foto('02-hinsehen-akt4',1200);
 await kampf(3,'mond','grablampe',['astronom','kraterbewohner']);await p.click('[data-act="wegsehen"]');await foto('03-nicht-hinsehen-akt4',900);
 // 4 Gesehener aus der Tiefe (Akt II), 5 der Letzte (Akt V)
 await kampf(1,'kloster','linse',[(await p.evaluate(()=>BIOMES.kloster.gegner[0]))]);await p.click('[data-act="hinsehen"]');await foto('04-gesehener-akt2',1200);
 await kampf(2,'salz','resonator',[(await p.evaluate(()=>BIOMES.salz.gegner[0])),(await p.evaluate(()=>BIOMES.salz.gegner[1]))],'schwer');await p.click('[data-act="hinsehen"]');await foto('05-gesehener-akt3-schwer',1200);
 await kampf(4,'ufer','grablampe',['vorgaenger']);await p.click('[data-act="hinsehen"]');await foto('06-gesehener-akt5',1200);
 // 7 Wächter mit Zusatzschritt: nach dem Hinsehen steht der neue Schritt als nächste Absicht an (pi weiter), Tooltip offen
 await kampf(1,'kloster','linse',[(await p.evaluate(()=>BIOMES.kloster.waechter))],'waechter');await p.click('[data-act="hinsehen"]');
 await p.evaluate(()=>{const e=S.enemies[0];e.pi=e.pi+1;render();});await foto('07-waechter-zusatz',900);
 // 8 Beute nach Hinsehen: 1 aus 4 und ein Item-Angebot
 await kampf(1,'kloster','linse',[(await p.evaluate(()=>BIOMES.kloster.gegner[0]))]);await p.click('[data-act="hinsehen"]');
 await p.evaluate(()=>{S.enemies.forEach(e=>e.hp=0);fightWon();render();});await foto('08-beute-1-aus-4',900);
 // 9 Schatten ohne Hinsehen (mitten im Flackern)
 await kampf(1,'kloster','linse',[(await p.evaluate(()=>BIOMES.kloster.gegner[0]))]);await p.click('[data-act="wegsehen"]');
 await p.evaluate(()=>{Bus.emit('blick_schatten',{gegner:Blick.gesehenerId()});});await foto('09-schatten',230);
 console.log(f.length?f.join('\n'):'Keine Konsolenfehler.');await b.close();})();
