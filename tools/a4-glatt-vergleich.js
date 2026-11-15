// Auftrag 4 Phase 0: Ausschnitt bei 1080p, Szene nur scharf (BU.glatt=false) gegen scharf + einmal verkleinert (Standard). node tools/a4-glatt-vergleich.js
const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for(const gl of [false,true]){const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('http://localhost:8000/index.html?dev=0&job=fischer&seed=3&springe=kampf&akt=1');await p.waitForTimeout(1200);
await p.evaluate(g=>{audioOn=false;S.route[S.akt]='kapelle';BU.key='';Dev.springe('kampf',1);BU.glatt=g;},gl);await p.waitForTimeout(1500);
await p.screenshot({path:`docs/auftrag-4/bilder/p0/glatt-${gl?'an':'aus'}-ausschnitt.png`,clip:{x:820,y:380,width:360,height:240}});await p.close();}
await b.close();})();
