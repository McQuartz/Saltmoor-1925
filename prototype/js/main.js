// Startpunkt: Daten laden, dann Bildschirm aufbauen und die Zeichenschleife starten.
// Testhilfen über die Adresse, z. B. index.html?boss=maw&depth=12&job=0
//   boss=eye|maw|king  welcher Boss-Entwurf im Spiel kommt
//   depth=N            direkt auf Tiefe N starten (mit job=Index aus data/jobs.json, Standard 0)
(async()=>{
 try{await loadData();}catch(err){document.body.insertAdjacentHTML('afterbegin',`<div style="padding:20px;color:#ff8a7a;font:16px monospace">Daten konnten nicht geladen werden (${err.message}).<br>Bitte über einen lokalen Server öffnen, siehe README.md (start.command / start.bat oder: python3 -m http.server).</div>`);return;}
 const q=new URLSearchParams(location.search);
 if(q.get('boss')&&BOSS_VARIANTS[q.get('boss')])FOES.boss.variant=q.get('boss');
 render();requestAnimationFrame(frame);
 if(q.get('depth')){newGame(JOBS[+(q.get('job')||0)]);const d=+q.get('depth');if(d>1){S.depth=d;S.nextIds=null;S.enemies=[];startFight();}}
})();
