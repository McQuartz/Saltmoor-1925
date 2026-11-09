// Auftrag 3, Fix 7: Verlängert der Panzer den Wächterkampf um höchstens einen Zug?
// Spielt jeden Wächter (Spieler mit 9999 Leben, damit jeder Kampf bis zum Sieg läuft und nur die Züge bis zum Sieg zählen) mit unverw-Schritt allein gegen den Autospieler (je Figur mehrere Seeds), einmal mit Panzer (balance.json), einmal ohne Schutz (anteil 0).
// node tools/panzer-messen.js [seeds je Figur]
const { ladeKern } = require('./kern');
(async () => {
  const K = ladeKern(); await K.init(); const n = +(process.argv[2] || 6);
  const r = JSON.parse(K.run(`(()=>{const boss=Object.keys(FOES).filter(id=>JSON.stringify(FOES[id].pat||[]).includes('unverw')||JSON.stringify(FOES[id]).includes('"unverw"'));const out={};const anteil0=BAL.panzer.anteil;
   for(const id of boss){out[id]={};for(const a of [anteil0,0]){BAL.panzer.anteil=a;let z=0,s=0,k=0,pz=0;for(const j of JOBS.map(x=>x.id))for(let i=0;i<${n};i++){FAST=true;newRun(j,900+i,{dev:true});S.route=RUN.akte.map(x=>x.biome[0]);S.route[2]=FOES[id].biom;S.akt=2;S.depth=15;
      S.hp=9999;startFight([id],'waechter');let p=0;const off=Bus.on?null:null;let m=0;while(S.phase==='fight'&&m++<400){if(S.enemies.some(e=>e.panzer>0))p=1;Bot.schritt();}k++;z+=S.turnNo;if(S.phase!=='fight'&&S.hp>0)s++;pz+=p;}
     out[id][a?'panzer':'ohne']={zuege:+(z/k).toFixed(2),siege:s,von:k,mitPanzer:pz};}}BAL.panzer.anteil=anteil0;return JSON.stringify(out);})()`));
  for (const [id, v] of Object.entries(r)) console.log(`${id.padEnd(20)} mit Panzer Ø ${v.panzer.zuege} Züge (${v.panzer.siege}/${v.panzer.von} gewonnen, Panzer in ${v.panzer.mitPanzer} Kämpfen) · ohne Schutz Ø ${v.ohne.zuege} Züge · Unterschied ${(v.panzer.zuege - v.ohne.zuege).toFixed(2)}`);
})();
