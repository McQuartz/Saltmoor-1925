// Überlagerungen (aus oberflaeche.js geteilt, Auftrag 3 M2): Buch der Reaktionen, Tagebuch, Einstellungen, Rucksackmodus, Hover-Vorschau.
// ---------- Überlagerungen: Buch der Reaktionen, Tagebuch, Einstellungen ----------
function buchHtml(){const disc=S.disc||new Set();const all=allRx();
 return box('buch',`<h2>BUCH DER REAKTIONEN</h2><p class="hint">${[...disc].length} von ${all.length} entdeckt.</p><div class="stoffe">${Object.keys(ST).map(k=>`${gi(k,KZ())} ${ST[k].n}`).join(' · ')}</div>
 <div class="rliste">${all.filter(r=>disc.has(r.n)).map(r=>{const keys=r.k?[...r.k]:r.s?[...r.s]:null;return disc.has(r.n)?`<div><b>${r.n}</b> ${keys?keys.map(k=>gi(k,KZ())).join('+'):'(gleicher Stoff zweimal)'}: ${esc(r.t)}</div>`:`<div class="u">${r.s?'Hochreaktion: drei Stoffe':'? ? ?'}</div>`;}).join('')}</div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function tagebuchHtml(){const M=Meta.get();const st=M.biome;
 return box('tagebuch zettel',`<h2>TAGEBUCH</h2><div class="liste"><div>Abstiege: ${M.runs} · Angekommen: ${M.siege} (Bleiben ${M.enden.bleiben||0}, Umkehren ${M.enden.umkehren||0})</div><div>Größte Tiefe: ${M.besteTiefe?romanN(M.besteTiefe):'–'}</div>
 <div>Erreichte Orte: ${Object.keys(BIOMES).map(b=>st.includes(b)?esc(BIOMES[b].kurz):'…').join(' · ')}</div></div>
 <h3>Fragmente ${M.fragmente.length}/${FRAGS.length}</h3><div class="frags">${Object.keys(BIOMES).map(b=>`<div class="fb"><b>${esc(BIOMES[b].kurz)}</b>${FRAGS.filter(f=>f.biom===b).map(f=>M.fragmente.includes(f.id)?`<p><i>${esc(f.titel)}.</i> ${esc(f.text)}</p>`:'<p class="u">…</p>').join('')}</div>`).join('')}</div>
 ${tagebuchSeitenHtml(M)}<button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
// Auftrag 3 M10: Seiten, die nicht von dir sind (Notizen des Vorgängers, Einträge aus der Fehlzeit), neueste zuerst
function tagebuchSeitenHtml(M){const l=(M.seiten||[]).slice().reverse();if(!l.length||typeof Metaebene==='undefined'||!Metaebene.an())return'';const U=META.ui||{};
 return `<h3>${esc(U.notizen_titel||'')}</h3><div class="seiten">${l.map(s=>`<div class="seite ${s.art}"><b>${esc(s.art==='fehlzeit'?U.seite_fehlzeit:U.seite_vorgaenger)}</b>${s.zeilen.map(z=>`<p class="hand">${esc(z)}</p>`).join('')}</div>`).join('')}</div>`;}
function einstHtml(){const E=Einst.all();const sl=(k,n)=>`<label>${n}<input type="range" min="0" max="1" step="0.05" value="${E[k]}" data-einst="${k}"></label>`;const cb=(k,n)=>`<label><input type="checkbox" ${E[k]?'checked':''} data-einst="${k}"> ${n}</label>`;
 return box('einst',`<h2>EINSTELLUNGEN</h2><div class="formular">${sl('musik','Musik')}${sl('effekte','Effekte')}${cb('stummfilm','Stummfilm-Rauschen bei besonderen Anlässen')}${cb('jumpscare','Jumpscare (höchstens einmal pro Abstieg)')}${cb('wackeln','Bildschirmwackeln')}${cb('fahrtkurz','Übergänge kürzer')}${cb('klangzeichen','Klänge als Zeichen')}${typeof Mund!=='undefined'?Mund.einstHtml():''}
 <label>Textgeschwindigkeit<select data-einst="text"><option value="0.6" ${E.text==.6?'selected':''}>langsam</option><option value="1" ${E.text==1?'selected':''}>normal</option><option value="1.6" ${E.text==1.6?'selected':''}>schnell</option></select></label>
 <label><input type="checkbox" ${typeof Dev!=='undefined'&&Dev.an?'checked':''} data-act="devToggle"> Dev-Modus</label></div><button class="deco klein" data-act="zu">SCHLIESSEN</button>`);}
function zeigeOverlay(html){if(typeof hideTip==='function')hideTip();const o=$('overlay');o.innerHTML=html;o.classList.add('an');}
function closeOv(){$('overlay').classList.remove('an');}
// Wandbild-Relief zeichnen (prozedural; im Stil der Hintergründe, sobald World.relief da ist)
function reliefMalen(){const c=$('relief');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
 if(typeof World!=='undefined'&&World.relief){try{const fr=FRAGS.find(f=>f.id===S.frag);const r=World.relief(biomId(),hashStr(S.frag||'x'),fr&&fr.motiv);x.drawImage(r,0,0,160,100);return;}catch(e){}}
 const B=biom();const r=new Rng(hashStr(S.frag||'leer'));x.fillStyle=B.koerper[2];x.fillRect(0,0,160,100);
 for(let i=0;i<9;i++){const cx=14+i*16+r.int(-3,3),cy=50+r.int(-6,6),h=r.int(18,34);x.fillStyle=B.koerper[0];x.fillRect(cx,cy-h/2,2,h);x.fillRect(cx-4,cy-h/2+4,10,2);x.fillStyle=B.rand[0];x.fillRect(cx+2,cy-h/2,1,h);}
 x.fillStyle=B.rand[1];x.fillRect(78,12,4,4);}

// Rucksackmodus aus Auftrag 2 entfernt (Auftrag 3 M4): der Rucksack „Am Körper“ steht in js/ui/rucksack.js.
// ---------- Hover-Vorschau am Cursor: die Karten, die ins Deck kämen ----------
// Spieltest 2026-11-09: Beim Hovern über Fund, Reliquie oder Handgriff stehen die echten Karten, so wie sie auf der Hand aussehen.
function vorschauKarte(c){const k=c.x?'X':c.opfer?'♥'+c.opfer:c.c;const img=c.img||(typeof spr==='function'&&c.spr?spr(c.spr):'');
 return `<div class="karte vorschau${c.st.length>1?' duo':''}"><div class="kost"><span>${k}</span></div><div class="kst">${c.st.map(s=>gi(s,KZ())).join('')}</div>
 <div class="kn">${esc(c.n).toUpperCase()}</div><div class="bogen">${img?`<img src="${img}" alt="">`:''}</div><div class="kt">${esc(cardText(c))}</div></div>`;}
function vorschauKartenReihe(karten,zusatz=''){const einm=[];const seen=new Map();karten.forEach(c=>{const k=c.n+'|'+(c.hg||'');if(seen.has(k))seen.get(k).anz++;else{const o={c,anz:1};seen.set(k,o);einm.push(o);}});
 return `<div class="tipkarten" style="zoom:${(BU.s||1).toFixed(3)}">${einm.map(o=>`<div class="tkw">${vorschauKarte(o.c)}${o.anz>1?`<span class="anz">×${o.anz}</span>`:''}</div>`).join('')}</div>${zusatz}`;}
function hoverVorschau(el){const tk=el.closest('[data-take],[data-buy],[data-hg],[data-buyhg]');if(!tk)return null;
 if(tk.dataset.hg||tk.dataset.buyhg!=null){const id=tk.dataset.hg||(S.shop&&S.shop.hg[+tk.dataset.buyhg]||{}).id;const H=HANDGRIFFE[id];if(!H)return null;return vorschauKartenReihe([{...H,st:[],img:hgBild(id)||''}]);}
 const id=tk.dataset.take||(tk.dataset.buy!=null&&S.shop&&S.shop.items[+tk.dataset.buy]&&S.shop.items[+tk.dataset.buy].id);if(!id||!ITEMS[id])return null;
 const tmp={uid:-1,id};const D=ITEMS[id];
 const z=[D.hp?`+${D.hp} Leben`:'',D.passiv?passivText(D.passiv):'',D.eigen?eigenText(D.eigen):''].filter(Boolean);
 return vorschauKartenReihe(kartenVon(tmp),z.length?`<div class="tipzusatz">${z.map(esc).join(' · ')}</div>`:'');}
