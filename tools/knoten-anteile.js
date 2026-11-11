// Anteile der Knotenarten auf der Peilkarte (Akt I–IV, alle Knoten aller Ebenen) und auf dem gegangenen Weg der Bots. node tools/knoten-anteile.js [seeds=200] [botRuns=20]
const {ladeKern}=require('./kern');
const N=+(process.argv[2]||200),B=+(process.argv[3]||20);
(async()=>{const K=ladeKern();await K.init();const run=c=>K.run(c);
 const r=JSON.parse(run(`(()=>{const z={};let n=0;
  for(let s=1;s<=${N};s++)for(let a=0;a<4;a++)RUN.akte[a].ebenen.forEach((key,e)=>netzArten(key,new Rng(s*1000+a*10+e)).forEach(art=>{z[art]=(z[art]||0)+1;n++;}));
  const g={};let gn=0;const kf=BAL.start_hp;BAL.start_hp=900;const eo=enterNode;enterNode=function(o){if(S.akt<4){g[o.art]=(g[o.art]||0)+1;gn++;}return eo.apply(this,arguments);};for(let s=1;s<=${B};s++)Bot.spiele(JOBS[s%6].id,s,{});enterNode=eo;BAL.start_hp=kf;
  return JSON.stringify({z,n,g,gn})})()`));
 const zeig=(z,n,t)=>{const k=(z.kampf||0)+(z.kampf_schwer||0);console.log(`${t}: ${n} Knoten, Kampf+schwer ${(100*k/n).toFixed(1)} %, mit Wächter ${(100*(k+(z.waechter||0))/n).toFixed(1)} %`);
  console.log('  '+Object.entries(z).sort((a,b)=>b[1]-a[1]).map(([a,v])=>`${a} ${(100*v/n).toFixed(1)} %`).join(', '));};
 zeig(r.z,r.n,'Karte');if(r.gn)zeig(r.g,r.gn,'Bot-Wege');else console.log('Bot-Wege: keine Knotenliste in S.stats');
})();
