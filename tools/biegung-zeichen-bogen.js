// Zeichenbogen der 14 Regelbiegungen (Auftrag 3 M5): node tools/biegung-zeichen-bogen.js
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright');
const root=path.join(__dirname,'..');
const rd=f=>fs.readFileSync(path.join(root,'prototype/js/ui',f),'utf8');
(async()=>{
 const html=`<!DOCTYPE html><meta charset="utf-8"><body style="margin:0;background:#000;color:#d8c890;font:13px sans-serif">
<div id="r" style="display:grid;grid-template-columns:repeat(5,220px);gap:18px;padding:18px"></div>
<script>var ST={};</script><script>${rd('zeichen.js')}</script><script>${rd('zeichen-biegung.js')}</script>
<script>
const ks=Object.keys(GLY).filter(k=>k.startsWith('bg_'));
document.getElementById('r').innerHTML=ks.map(k=>'<div style="text-align:center"><div style="background:#000;border:1px solid #333;padding:6px"><img src="'+glyph(k)+'" width="72" height="72" style="image-rendering:pixelated"></div>'
+'<div style="margin:8px 0;image-rendering:pixelated"><img src="'+glyph(k)+'" width="9" height="9" style="image-rendering:pixelated"> <img src="'+glyph(k)+'" width="18" height="18" style="image-rendering:pixelated"></div><div>'+STN[k]+'</div></div>').join('');
</script>`;
 const b=await chromium.launch();
 const p=await b.newPage({viewport:{width:1200,height:700},deviceScaleFactor:1});
 await p.setContent(html);
 const out=path.join(root,'docs/auftrag-3/bilder/M5/zeichen-bogen.png');
 fs.mkdirSync(path.dirname(out),{recursive:true});
 await p.screenshot({path:out,fullPage:true});
 await b.close();console.log(out);
})();
