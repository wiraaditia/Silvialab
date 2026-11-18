'use strict';
/* =====================================================================
   Silvialab — antarmuka. Bergantung pada chem-core.js (data unsur,
   database lokal, parser, mesin layout 3D) dan lib/3Dmol-min.js.
   ===================================================================== */
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const cssv=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const spinner=t=>`<span class="spin"></span>${t||''}`;

/* ---------- tema ---------- */
let themeCache=null;
function themeColors(){if(!themeCache)themeCache={bond:cssv('--bond'),muted:cssv('--muted'),canvas:cssv('--canvas')};return themeCache}
function setTheme(t){
  document.documentElement.dataset.theme=t;try{localStorage.setItem('kl-theme',t)}catch(e){}
  document.querySelectorAll('[data-theme-btn]').forEach(b=>b.classList.toggle('on',b.dataset.themeBtn===t));
  themeCache=null;
  if(typeof bioV!=='undefined'&&bioV){bioV.setBackgroundColor(cssv('--canvas'));bioV.render()}
  if(typeof renderEditor==='function'&&EREADY)renderEditor(true);
}
document.querySelectorAll('[data-theme-btn]').forEach(b=>b.onclick=()=>setTheme(b.dataset.themeBtn));

/* ---------- tab ---------- */
function showTab(name){
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('on',t.dataset.tab===name));
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+name));
  const mb=$('mbar');if(mb)mb.classList.toggle('hide',name!=='perakit'||!sizeOf(inv));
  if(name==='bio')ensureBio();
  if(name==='editor'){fitSvg();renderEditor(true)}
}
document.querySelectorAll('.tab').forEach(t=>t.onclick=()=>showTab(t.dataset.tab));

/* =====================================================================
   VIEWER 3D (canvas) — dipakai Perakit, Jelajah, Editor
   ===================================================================== */
function shade(hex,t){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const m=t>0?255:0,a=Math.abs(t);
  r=Math.round(r+(m-r)*a);g=Math.round(g+(m-g)*a);b=Math.round(b+(m-b)*a);return`rgb(${r},${g},${b})`}
function lum(hex){const n=parseInt(hex.slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255}
class Viewer{
  constructor(cv){
    this.cv=cv;this.ctx=cv.getContext('2d');this.scene=null;this.drag=null;this.raf=0;
    this.o={yaw:.6,pitch:.35,spin:true,labels:true,style:'ball',lp:false,zoom:1};
    cv.addEventListener('pointerdown',e=>{this.drag={x:e.clientX,y:e.clientY};cv.setPointerCapture(e.pointerId)});
    cv.addEventListener('pointermove',e=>{if(!this.drag)return;this.o.yaw+=(e.clientX-this.drag.x)*.01;this.o.pitch=Math.max(-1.5,Math.min(1.5,this.o.pitch+(e.clientY-this.drag.y)*.01));this.drag={x:e.clientX,y:e.clientY}});
    cv.addEventListener('pointerup',()=>this.drag=null);
    cv.addEventListener('wheel',e=>{e.preventDefault();this.o.zoom=Math.max(.4,Math.min(4,this.o.zoom*(e.deltaY<0?1.1:.9)))},{passive:false});
    cv.addEventListener('dblclick',()=>{this.o.zoom=1;this.o.yaw=.6;this.o.pitch=.35});
    const f=()=>{this.draw();this.raf=requestAnimationFrame(f)};this.raf=requestAnimationFrame(f);
  }
  set(scene){this.scene=scene;this.o.zoom=1}
  bind(root){
    root.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{
      const k=b.dataset.v;
      if(k==='style'){this.o.style=this.o.style==='ball'?'space':'ball';b.textContent=this.o.style==='ball'?'Bola-tongkat':'Ruang-isi';return}
      const key={spin:'spin',label:'labels',lp:'lp'}[k];this.o[key]=!this.o[key];b.classList.toggle('on',this.o[key]);
    });
  }
  draw(){
    const cv=this.cv,ctx=this.ctx;if(!cv.offsetParent)return;
    const dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;
    if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    const sc=this.scene,o=this.o;if(!sc)return;
    const T=themeColors();
    if(o.spin&&!this.drag)o.yaw+=.007;
    const cy=Math.cos(o.yaw),sy=Math.sin(o.yaw),cp=Math.cos(o.pitch),sp=Math.sin(o.pitch);
    const space=o.style==='space';
    const S=Math.min(W,H)/2*.95/(sc.R*(space?1.5:1))*o.zoom;
    const P=sc.nodes.map(nd=>{const p=nd.p;const x=p[0]*cy+p[2]*sy,z=-p[0]*sy+p[2]*cy,y=p[1];const y2=y*cp-z*sp,z2=y*sp+z*cp;const pr=1/(1-z2*.04/Math.max(1,sc.R/3));return{x:W/2+x*S*pr,y:H/2+y2*S*pr,z:z2,s:S*pr}});
    const items=[];
    sc.atoms.forEach((a,i)=>items.push({t:'a',z:P[i].z,i}));
    if(!space)sc.bonds.forEach(b=>items.push({t:'b',z:(P[b.a].z+P[b.b].z)/2,b}));
    if(o.lp)(sc.lpNodes||[]).forEach(i=>items.push({t:'l',z:P[i].z,i}));
    items.sort((a,b)=>a.z-b.z);
    ctx.save();ctx.setLineDash([4,5]);ctx.strokeStyle=T.muted;ctx.globalAlpha=.6;ctx.lineWidth=1.2;
    (sc.dashes||[]).forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(P[a].x,P[a].y);ctx.lineTo(P[b].x,P[b].y);ctx.stroke()});ctx.restore();
    const na=sc.atoms.length,big=na>80,fac=na>40?.2:na>12?.25:.3;
    for(const it of items){
      if(it.t==='b'){
        const a=P[it.b.a],b=P[it.b.b];const dx=b.x-a.x,dy=b.y-a.y;const L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L;
        const off=[[0],[-.5,.5],[-1,0,1]][Math.min(3,it.b.o||1)-1];
        ctx.lineCap='round';ctx.strokeStyle=T.bond;ctx.lineWidth=Math.max(1.4,(it.b.o===1?.12:.075)*a.s);
        off.forEach(q=>{const k=q*.17*a.s;ctx.beginPath();ctx.moveTo(a.x+nx*k,a.y+ny*k);ctx.lineTo(b.x+nx*k,b.y+ny*k);ctx.stroke()});
      }else if(it.t==='a'){
        const a=sc.atoms[it.i],p=P[it.i],r=Math.max(3,vdw(a.el)*(space?.95:fac)*p.s),col=cpk(a.el);
        const g=ctx.createRadialGradient(p.x-r*.35,p.y-r*.38,r*.1,p.x,p.y,r);g.addColorStop(0,shade(col,.4));g.addColorStop(.6,col);g.addColorStop(1,shade(col,-.32));
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();
        ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=.8;ctx.stroke();
        if(o.labels&&r>8){ctx.fillStyle=lum(col)>.6?'#111':'#fff';ctx.font=`600 ${Math.round(Math.min(r*.95,22))}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(a.el,p.x,p.y+1)}
        if(a.charge){const t=(Math.abs(a.charge)>1?Math.abs(a.charge):'')+(a.charge>0?'+':'−');ctx.font=`700 ${Math.max(11,Math.round(r*.6))}px system-ui`;ctx.textAlign='left';ctx.textBaseline='alphabetic';
          ctx.lineWidth=3;ctx.strokeStyle=cssv('--canvas');ctx.strokeText(t,p.x+r*.7,p.y-r*.6);ctx.fillStyle=cssv('--text');ctx.fillText(t,p.x+r*.7,p.y-r*.6)}
      }else{
        const p=P[it.i],r=Math.max(5,.32*p.s);ctx.fillStyle='rgba(80,160,255,.28)';ctx.strokeStyle='rgba(80,160,255,.7)';ctx.lineWidth=1;
        ctx.beginPath();ctx.ellipse(p.x,p.y,r,r*.75,0,0,7);ctx.fill();ctx.stroke();
      }
    }
  }
}
const V1=new Viewer($('cv1')),V3=new Viewer($('cv3'));
V1.bind(document.querySelector('[data-for="1"]'));V3.bind(document.querySelector('[data-for="3"]'));

/* ---------- scene dari SDF (PubChem) ---------- */
function parseSDF(txt){
  const L=txt.split('\n');const na=parseInt(L[3].substr(0,3)),nb=parseInt(L[3].substr(3,3));
  const atoms=[],bonds=[];
  for(let i=0;i<na;i++){const l=L[4+i];atoms.push({i,x:+l.substr(0,10),y:+l.substr(10,10),z:+l.substr(20,10),el:l.substr(31,3).trim(),charge:0})}
  for(let j=0;j<nb;j++){const l=L[4+na+j];let o=parseInt(l.substr(6,3));if(!(o>=1&&o<=3))o=1;bonds.push({a:parseInt(l.substr(0,3))-1,b:parseInt(l.substr(3,3))-1,o})}
  for(const l of L){if(l.startsWith('M  CHG')){const t=l.trim().split(/\s+/).slice(3);for(let k=0;k+1<t.length;k+=2)atoms[+t[k]-1].charge=+t[k+1]}}
  return{atoms,bonds};
}
function sceneFromSDF(txt){
  const m=parseSDF(txt);const n=m.atoms.length;
  const nb=m.atoms.map(()=>[]);m.bonds.forEach(b=>{nb[b.a].push(b.b);nb[b.b].push(b.a)});
  const comp=new Array(n).fill(-1);let nc=0;
  for(let k=0;k<n;k++)if(comp[k]<0){const q=[k];comp[k]=nc;while(q.length){const u=q.pop();nb[u].forEach(v=>{if(comp[v]<0){comp[v]=nc;q.push(v)}})}nc++}
  m.atoms.forEach((a,k)=>{a.comp=comp[k];a.nbrs=nb[k]});
  const c=[0,0,0];m.atoms.forEach(a=>{c[0]+=a.x/n;c[1]+=a.y/n;c[2]+=a.z/n});
  const nodes=m.atoms.map(a=>({p:[a.x-c[0],a.y-c[1],a.z-c[2]]}));
  const cov=[[0,0,0],[0,0,0],[0,0,0]];nodes.forEach(nd=>{for(let a=0;a<3;a++)for(let b=0;b<3;b++)cov[a][b]+=nd.p[a]*nd.p[b]});
  const Vm=jacobi3(cov);nodes.forEach(nd=>{const p=nd.p;nd.p=[0,1,2].map(k=>p[0]*Vm[0][k]+p[1]*Vm[1][k]+p[2]*Vm[2][k])});
  let R=0;nodes.forEach((nd,i)=>R=Math.max(R,Math.hypot(...nd.p)+vdw(m.atoms[i].el)*.3));
  return{nodes,atoms:m.atoms,bonds:m.bonds,lpNodes:[],dashes:[],R:R||1};
}

/* =====================================================================
   TAB 1 — PERAKIT
   ===================================================================== */
let inv={},sel=0,list=[],lastKey='',pcTok=0;
function buildTable(){
  let h='';
  EL.forEach(e=>{h+=`<div class="el" data-s="${e.sym}" style="grid-row:${e.r};grid-column:${e.c};--c:${CATS[e.cat].c}"><div class="n">${e.z}</div><div class="s">${e.sym}</div><div class="m">${e.name}</div></div>`});
  h+=`<div class="gap" style="grid-row:8"></div><div class="lab" style="grid-row:9">Lantanida</div><div class="lab" style="grid-row:10">Aktinida</div>`;
  const pt=$('pt');pt.innerHTML=h;
  pt.addEventListener('click',ev=>{const el=ev.target.closest('.el');if(el)change(el.dataset.s,ev.shiftKey?-1:1)});
  pt.addEventListener('contextmenu',ev=>{const el=ev.target.closest('.el');if(!el)return;ev.preventDefault();change(el.dataset.s,-1)});
  pt.addEventListener('mouseover',ev=>{const el=ev.target.closest('.el');if(!el)return;const e=BY[el.dataset.s];
    $('elinfo').innerHTML=`<b>${e.z} · ${e.name} (${e.sym})</b> — massa atom ${e.mass} u · ${CATS[e.cat].n}${e.en?` · keelektronegatifan ${e.en}`:''}${e.ve!==null?` · elektron valensi ${e.ve}`:''}`});
  $('legend').innerHTML=Object.values(CATS).map(c=>`<span><i style="--c:${c.c}"></i>${c.n}</span>`).join('');
}
function change(sym,d){inv[sym]=(inv[sym]||0)+d;if(inv[sym]<=0)delete inv[sym];syncText();update(true)}
const textOf=()=>Object.keys(inv).map(s=>s+(inv[s]>1?inv[s]:'')).join(' + ');
function syncText(){$('formula').value=textOf();$('err').textContent=''}
function setInv(o){inv={};for(const k in o)inv[k]=o[k];syncText();update(true)}
function hillOf(o){const ks=Object.keys(o);let ord;if(o.C)ord=['C',...(o.H?['H']:[]),...ks.filter(k=>k!=='C'&&k!=='H').sort()];else ord=ks.sort();return ord.map(k=>k+(o[k]>1?o[k]:'')).join('')}

function updateBar(cur){
  const b=$('mbar');if(!b)return;
  $('mbF').innerHTML=cur?sub(cur.c.f):textOf();$('mbN').textContent=cur?cur.c.id:'belum ada di database lokal';
  b.classList.toggle('hide',!sizeOf(inv)||!document.getElementById('v-perakit').classList.contains('on'));
}
$('mbGo').onclick=()=>$('result').scrollIntoView({behavior:'smooth',block:'start'});
function update(resetSel){
  if(resetSel)sel=0;
  document.querySelectorAll('.el').forEach(el=>{const n=inv[el.dataset.s];el.classList.toggle('on',!!n);let b=el.querySelector('.cnt');if(n){if(!b){b=document.createElement('div');b.className='cnt';el.appendChild(b)}b.textContent=n}else if(b)b.remove()});
  $('chips').innerHTML=Object.keys(inv).map(s=>`<span class="chip">${s}<sub>${inv[s]}</sub><button data-m="${s}" title="kurangi">−</button><button data-p="${s}" title="tambah">+</button><button data-x="${s}" title="hapus">×</button></span>`).join('');
  const total=sizeOf(inv);
  $('empty').style.display=total?'none':'';$('resbody').style.display=total?'':'none';
  if(!total){lastKey='';updateBar(null);return}
  const A=analyze(inv);
  list=A.exact.length?A.exact.map(x=>({...x,kind:'exact'})):A.partial.map(x=>({...x,kind:'partial'}));
  if(sel>=list.length)sel=0;
  renderResult(A);
}
function leftoverText(x){const l={};for(const s in inv){const d=inv[s]-x.k*(x.c.cnt[s]||0);if(d>0)l[s]=d}return Object.keys(l).map(s=>s+(l[s]>1?SUBN(l[s]):'')).join(' ')}
function compBar(c){const parts=Object.keys(c.cnt).map(s=>({s,p:BY[s].mass*c.cnt[s]/c.mass*100}));
  return parts.map(x=>`${x.s} ${x.p.toFixed(2)}%`).join(' · ')+`<div class="bar">${parts.map(x=>`<i style="width:${x.p}%;background:${cpk(x.s)}"></i>`).join('')}</div>`}
function ionList(c){
  const comps={};c.mol.atoms.forEach(a=>{(comps[a.comp]=comps[a.comp]||[]).push(a)});const m={};
  Object.values(comps).forEach(g=>{const ch=g.reduce((s,a)=>s+a.charge,0);const cnt={};g.forEach(a=>cnt[a.el]=(cnt[a.el]||0)+1);
    const f=Object.keys(cnt).sort((a,b)=>a==='H'?1:b==='H'?-1:0).map(s=>s+(cnt[s]>1?SUBN(cnt[s]):'')).join('');
    const sg=ch===0?'':(Math.abs(ch)>1?Math.abs(ch):'')+(ch>0?'+':'−');const k=f+(sg?'<sup>'+sg+'</sup>':'');m[k]=(m[k]||0)+1});
  return Object.keys(m).map(k=>(m[k]>1?m[k]+' × ':'')+k).join(' + ');
}
function renderResult(A){
  const total=sizeOf(inv),syms=Object.keys(inv),cur=list[sel];let mol,key,head='',facts='',eq='';
  $('rtabs').innerHTML=list.length>1?list.map((x,i)=>`<button class="btn ${i===sel?'on':''}" data-t="${i}">${sub(x.c.f)} · ${esc(x.c.id.split(' (')[0])}</button>`).join(''):'';
  if(cur){
    const c=cur.c;mol=c.mol;key=c.smiles;
    const badge=cur.kind==='exact'?(cur.k>1?`× ${cur.k} molekul`:'1 molekul'):`${cur.k} × ${c.f.replace(/\d+/g,d=>SUBN(d))}${cur.left?` + sisa ${leftoverText(cur)}`:''}`;
    head=`<div class="bigf">${sub(c.f)}</div><div class="rname">${esc(c.id)}<small>${esc(c.en)}</small></div><span class="tag">${badge}</span>`;
    const geo=geometryText(c.mol);
    facts=`<dt>Nama</dt><dd><b>${esc(c.id)}</b></dd><dt>Nama IUPAC / Inggris</dt><dd>${esc(c.en)}</dd>
      <dt>Rumus</dt><dd>${sub(c.f)} <span class="muted small">(${Object.keys(c.cnt).map(s=>s+' ×'+c.cnt[s]).join(', ')})</span></dd>
      <dt>Massa molar</dt><dd>${c.mass.toFixed(3)} g/mol</dd><dt>Wujud (suhu ruang)</dt><dd>${STATE[c.state]}</dd>
      <dt>Jenis ikatan</dt><dd>${bondType(c)}</dd>${geo?`<dt>Bentuk molekul</dt><dd>${geo}</dd>`:''}
      ${c.ionic?`<dt>Ion penyusun</dt><dd>${ionList(c)}</dd>`:''}<dt>Komposisi massa</dt><dd>${compBar(c)}</dd><dt>Kegunaan</dt><dd>${esc(c.use)}</dd>`;
    const e=formationEq(c);eq=e?`<small>Persamaan pembentukan dari unsur-unsurnya (stoikiometri)</small>${e}`:'';
    $('vnote').textContent=c.ionic?'unit rumus ionik':(c.mol.atoms.length+' atom');
  }else{
    mol=freeAtomsMol(inv);key='free'+textOf();const e=syms.length===1?BY[syms[0]]:null;
    head=`<div class="bigf">${syms.map(s=>s+(inv[s]>1?SUBN(inv[s]):'')).join('')}</div><div class="rname">${e?e.name:'Belum ada di database lokal'}<small>${e?CATS[e.cat].n+' · atom bebas':'Cari rumus ini di PubChem di bawah'}</small></div><span class="tag">${total} atom</span>`;
    if(e){facts=`<dt>Nomor atom</dt><dd>${e.z}</dd><dt>Massa atom</dt><dd>${e.mass} u</dd><dt>Golongan</dt><dd>${CATS[e.cat].n}</dd>${e.en?`<dt>Keelektronegatifan</dt><dd>${e.en} (Pauling)</dd>`:''}${e.ve!==null?`<dt>Elektron valensi</dt><dd>${e.ve}</dd>`:''}<dt>Massa total</dt><dd>${(e.mass*inv[e.sym]).toFixed(3)} g/mol</dd>`;
      if(/logam/i.test(CATS[e.cat].n)||e.cat==='trans')facts+=`<dt>Ikatan</dt><dd>Ikatan logam</dd>`}
    else{let m=0;for(const s in inv)m+=BY[s].mass*inv[s];facts=`<dt>Massa total</dt><dd>${m.toFixed(3)} g/mol</dd>`}
    $('vnote').textContent='atom bebas'+(total>60?' (60 pertama)':'');
  }
  $('rhead').innerHTML=head;$('facts').innerHTML=facts;$('eq').style.display=eq?'':'none';$('eq').innerHTML=eq;
  $('sugg').innerHTML=A.sugg.length?`<h3>Tambah atom lagi untuk membentuk</h3><div class="chips">`+A.sugg.map((s,i)=>`<button class="btn" data-g="${i}">${Object.keys(s.diff).map(k=>'+'+(s.diff[k]>1?s.diff[k]+' ':'')+k).join(' ')} → ${sub(s.c.f)} <span class="muted">${esc(s.c.id.split(' (')[0])}</span></button>`).join('')+`</div>`:'';
  $('sugg')._s=A.sugg;
  if(key!==lastKey){lastKey=key;V1.set(layout(mol,key))}
  pcFormulaBlock(!cur);
  updateBar(cur);
}
/* rumus -> PubChem */
function pcFormulaBlock(auto){
  const box=$('pcform'),f=hillOf(inv),tok=++pcTok;
  box.innerHTML=`<h3>PubChem · rumus ${sub(f)}</h3><div id="pcfres"><button class="btn" id="pcfgo">Cari senyawa dengan rumus ini</button></div>`;
  const run=async()=>{
    $('pcfres').innerHTML=spinner('Mencari di PubChem…');
    try{
      const j=await jget(`${PUG}/compound/fastformula/${encodeURIComponent(f)}/cids/JSON?MaxRecords=12`);
      const c=cidsOf(await pcPoll(j));if(tok!==pcTok)return;
      if(!c.length)throw Object.assign(new Error('Tidak ada senyawa dengan rumus ini di PubChem.'),{status:404});
      const ps=await pcProps(c);if(tok!==pcTok)return;
      $('pcfres').innerHTML=`<div class="rlist">${ps.map(p=>`<button class="ritem" data-open="${p.CID}"><b>${esc(p.Title||p.IUPACName||'CID '+p.CID)}</b><span>${sub(p.MolecularFormula)} · ${(+p.MolecularWeight).toFixed(2)} g/mol · CID ${p.CID}</span></button>`).join('')}</div>`;
    }catch(e){if(tok===pcTok)$('pcfres').innerHTML=`<span class="muted small">${esc(e.message)}</span>`}
  };
  $('pcfgo').onclick=run;if(auto)setTimeout(()=>{if(tok===pcTok)run()},700);
}

document.addEventListener('click',ev=>{
  const t=ev.target.closest('button');if(!t)return;
  if(t.dataset.m)change(t.dataset.m,-1);
  else if(t.dataset.p)change(t.dataset.p,1);
  else if(t.dataset.x){delete inv[t.dataset.x];syncText();update(true)}
  else if(t.dataset.t!==undefined){sel=+t.dataset.t;update(false)}
  else if(t.dataset.g!==undefined){setInv($('sugg')._s[+t.dataset.g].c.cnt)}
  else if(t.dataset.ex){try{setInv(parseInput(t.dataset.ex));$('formula').value=t.dataset.ex}catch(e){}}
  else if(t.dataset.open)openInJelajah(t.dataset.open);
});
$('clear').onclick=()=>{inv={};syncText();$('search').value='';update(true)};
$('formula').addEventListener('input',e=>{const v=e.target.value;if(!v.trim()){inv={};$('err').textContent='';update(true);return}
  try{inv=parseInput(v);$('err').textContent='';update(true)}catch(er){$('err').textContent=er.message}});
$('search').addEventListener('change',e=>{
  const q=e.target.value.trim().toLowerCase();if(!q)return;
  const c=DB.find(c=>c.id.toLowerCase()===q||c.en.toLowerCase()===q||c.f.toLowerCase()===q)||DB.find(c=>c.id.toLowerCase().includes(q)||c.en.toLowerCase().includes(q));
  if(c){inv={};for(const k in c.cnt)inv[k]=c.cnt[k];syncText();update(true);const i=list.findIndex(x=>x.c===c);if(i>0){sel=i;update(false)}}
  else $('err').textContent='"'+e.target.value+'" belum ada di database lokal. Coba tab Jelajah senyawa.';
});

/* =====================================================================
   PUBCHEM
   ===================================================================== */
const PUG='https://pubchem.ncbi.nlm.nih.gov/rest/pug';
async function jget(url){const r=await fetch(url);if(!r.ok){const e=new Error(r.status===404?'Tidak ditemukan di PubChem.':'PubChem mengembalikan galat '+r.status+'.');e.status=r.status;throw e}return r.json()}
async function jpost(url,params){const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(params)});
  if(!r.ok){const e=new Error(r.status===404?'Tidak ditemukan di PubChem.':'PubChem mengembalikan galat '+r.status+'.');e.status=r.status;throw e}return r.json()}
async function pcPoll(j){for(let i=0;i<10&&j&&j.Waiting;i++){await sleep(1200);j=await jget(`${PUG}/compound/listkey/${j.Waiting.ListKey}/cids/JSON`)}return j}
const cidsOf=j=>((j&&j.IdentifierList&&j.IdentifierList.CID)||[]).filter(x=>x>0);
const PROPS='Title,IUPACName,MolecularFormula,MolecularWeight,ExactMass,SMILES,XLogP,TPSA,HBondDonorCount,HBondAcceptorCount,RotatableBondCount,Charge';
async function pcProps(cids){const j=await jget(`${PUG}/compound/cid/${cids.join(',')}/property/${PROPS}/JSON`);const ps=j.PropertyTable.Properties;ps.sort((a,b)=>cids.indexOf(a.CID)-cids.indexOf(b.CID));return ps}
async function pcSDF(cid){
  let r=await fetch(`${PUG}/compound/cid/${cid}/SDF?record_type=3d`);
  if(r.ok)return{text:await r.text(),is3d:true};
  r=await fetch(`${PUG}/compound/cid/${cid}/SDF`);if(!r.ok)throw new Error('Struktur tidak tersedia.');
  return{text:await r.text(),is3d:false};
}
async function pcSearch(q){
  q=q.trim();
  if(/^\d+$/.test(q))return{cids:[+q]};
  if(/[=#()\[\]@\\\/]/.test(q)&&!/\s/.test(q)){
    try{const c=cidsOf(await pcPoll(await jpost(PUG+'/compound/smiles/cids/JSON',{smiles:q})));if(c.length)return{cids:c,how:'SMILES'}}catch(e){if(e.status!==404&&e.status!==400)throw e}
  }
  let qn=q;const lq=q.toLowerCase();
  const loc=DB.find(c=>c.id.toLowerCase()===lq)||(lq.length>=4?DB.find(c=>c.id.toLowerCase().includes(lq)):null);
  if(loc)qn=loc.en.split(' (')[0];
  try{const c=cidsOf(await jget(`${PUG}/compound/name/${encodeURIComponent(qn)}/cids/JSON`));if(c.length)return{cids:c.slice(0,12)}}catch(e){if(e.status!==404&&e.status!==400)throw e}
  try{const f=parseFormula(q);const c=cidsOf(await pcPoll(await jget(`${PUG}/compound/fastformula/${encodeURIComponent(hillOf(f))}/cids/JSON?MaxRecords=12`)));if(c.length)return{cids:c,how:'rumus'}}catch(e){if(e.status&&e.status!==404&&e.status!==400)throw e}
  try{const c=cidsOf(await jget(`${PUG}/compound/name/${encodeURIComponent(qn)}/cids/JSON?name_type=word&MaxRecords=12`));if(c.length)return{cids:c.slice(0,12),how:'kata'}}catch(e){if(e.status!==404&&e.status!==400)throw e}
  throw new Error('Tidak ditemukan. Coba nama Inggris/IUPAC, rumus molekul, atau SMILES.');
}

/* =====================================================================
   TAB 2 — JELAJAH
   ===================================================================== */
$('jdetail').innerHTML=`
<div id="jempty" class="empty">Cari sebuah senyawa untuk melihat struktur 3D dan sifat-sifatnya.<br>Data diambil langsung dari PubChem sehingga butuh koneksi internet.</div>
<div id="jbody" style="display:none">
  <div class="rhead" id="jhead"></div>
  <div class="viewer"><canvas class="v3" id="cv2" style="height:400px"></canvas><div class="vnote" id="jnote"></div>
    <div class="vtools" data-for="2"><button class="btn on" data-v="spin">Putar</button><button class="btn on" data-v="label">Label</button><button class="btn" data-v="style">Bola-tongkat</button></div></div>
  <dl class="facts" id="jfacts"></dl>
  <div class="sec" id="jdrug"></div>
  <div class="sec" id="jdesc"></div>
</div>`;
const V2=new Viewer($('cv2'));V2.bind(document.querySelector('[data-for="2"]'));
let jProps=[],jSel=null,jTok=0;
['aspirin','caffeine','paracetamol','penicillin G','ritonavir','zidovudine','tenofovir','oseltamivir','dopamine','cholesterol','paclitaxel','capsaicin','morphine'].forEach(n=>{
  const b=document.createElement('button');b.className='btn';b.textContent=n;b.onclick=()=>{$('jq').value=n;jRun(n)};$('jex').appendChild(b)});
$('jform').onsubmit=e=>{e.preventDefault();jRun($('jq').value)};
function openInJelajah(q){showTab('jelajah');$('jq').value=q;jRun(String(q))}
async function jRun(q){
  if(!q.trim())return;const tok=++jTok;
  $('jresCard').style.display='';$('jresTitle').textContent='Hasil';$('jlist').innerHTML=`<div class="ritem">${spinner('Mencari…')}</div>`;
  try{
    const r=await pcSearch(q);if(tok!==jTok)return;
    jProps=await pcProps(r.cids);if(tok!==jTok)return;
    $('jresTitle').textContent=jProps.length+' hasil'+(r.how?' · pencarian '+r.how:'');
    $('jlist').innerHTML=jProps.map((p,i)=>`<button class="ritem" data-j="${i}"><b>${esc(p.Title||p.IUPACName||'CID '+p.CID)}</b><span>${sub(p.MolecularFormula)} · ${(+p.MolecularWeight).toFixed(2)} g/mol · CID ${p.CID}</span></button>`).join('');
    jPick(0);
  }catch(e){if(tok===jTok)$('jlist').innerHTML=`<div class="ritem"><span class="warn">${esc(e.message)}</span></div>`}
}
$('jlist').addEventListener('click',e=>{const b=e.target.closest('[data-j]');if(b)jPick(+b.dataset.j)});
const yn=(ok,t)=>`<span style="color:var(--${ok?'ok':'danger'})">${ok?'✓':'✗'}</span> ${t}`;
async function jPick(i){
  const p=jProps[i];if(!p)return;jSel=p.CID;const tok=++jTok;
  document.querySelectorAll('#jlist .ritem').forEach((b,k)=>b.classList.toggle('on',k===i));
  $('jempty').style.display='none';$('jbody').style.display='';
  const title=p.Title||p.IUPACName||('CID '+p.CID);
  const loc=DB.find(c=>c.en.split(' (')[0].toLowerCase()===String(title).toLowerCase()||(c.smiles&&c.f.replace(/[()]/g,'')===p.MolecularFormula&&c.en.toLowerCase().includes(String(title).toLowerCase())));
  $('jhead').innerHTML=`<div class="bigf">${sub(p.MolecularFormula)}</div><div class="rname">${esc(loc?loc.id:title)}<small>${esc(loc?title:(p.IUPACName||''))}</small></div><span class="tag">CID ${p.CID}</span>`;
  $('jnote').textContent='memuat struktur…';$('jdesc').innerHTML='';
  const mw=+p.MolecularWeight,row=(k,v)=>v===undefined||v===null||v===''?'':`<dt>${k}</dt><dd>${v}</dd>`;
  $('jfacts').innerHTML=row('Nama',esc(title))+row('Nama IUPAC',esc(p.IUPACName))+row('Rumus molekul',sub(p.MolecularFormula))+row('Massa molekul',mw.toFixed(3)+' g/mol')+row('Massa eksak',p.ExactMass&&(+p.ExactMass).toFixed(4))
    +row('XLogP',p.XLogP)+row('TPSA',p.TPSA!==undefined?p.TPSA+' Å²':'')+row('Donor ikatan H',p.HBondDonorCount)+row('Akseptor ikatan H',p.HBondAcceptorCount)+row('Ikatan rotasi',p.RotatableBondCount)+row('Muatan',p.Charge)
    +row('SMILES',`<code style="word-break:break-all">${esc(p.SMILES)}</code> <button class="btn" style="padding:1px 7px;font-size:12px" data-copy="${esc(p.SMILES)}">Salin</button>`)
    +row('Sumber',`<a href="https://pubchem.ncbi.nlm.nih.gov/compound/${p.CID}" target="_blank" rel="noopener">PubChem CID ${p.CID}</a> · <a href="#" data-editor="${p.CID}">Ubah di Editor</a>`);
  const hasAll=p.XLogP!==undefined&&p.HBondDonorCount!==undefined;
  $('jdrug').innerHTML=hasAll?`<h3>Aturan lima Lipinski <span class="muted">(perkiraan kemiripan obat oral)</span></h3><table class="t"><tr><td>Massa molekul ≤ 500</td><td>${yn(mw<=500,mw.toFixed(1))}</td></tr><tr><td>XLogP ≤ 5</td><td>${yn(+p.XLogP<=5,p.XLogP)}</td></tr><tr><td>Donor H ≤ 5</td><td>${yn(p.HBondDonorCount<=5,p.HBondDonorCount)}</td></tr><tr><td>Akseptor H ≤ 10</td><td>${yn(p.HBondAcceptorCount<=10,p.HBondAcceptorCount)}</td></tr></table>`:'';
  try{
    const s=await pcSDF(p.CID);if(tok!==jTok)return;
    V2.set(sceneFromSDF(s.text));$('jnote').textContent=(s.is3d?'konformer 3D PubChem':'struktur 2D (3D tidak tersedia)')+' · '+V2.scene.atoms.length+' atom';
  }catch(e){if(tok===jTok){V2.set(null);$('jnote').textContent=e.message}}
  try{
    const d=await jget(`${PUG}/compound/cid/${p.CID}/description/JSON`);if(tok!==jTok)return;
    const inf=(d.InformationList.Information||[]).filter(x=>x.Description).slice(0,2);
    if(inf.length)$('jdesc').innerHTML=`<h3>Deskripsi <span class="muted">(bahasa Inggris, dari sumber data PubChem)</span></h3>`+inf.map(x=>`<p style="margin:0 0 8px">${esc(x.Description)} <span class="muted small">— ${esc(x.DescriptionSourceName||'')}</span></p>`).join('');
  }catch(e){}
}
document.addEventListener('click',e=>{
  const c=e.target.closest('[data-copy]');if(c){navigator.clipboard&&navigator.clipboard.writeText(c.dataset.copy);const o=c.textContent;c.textContent='Tersalin';setTimeout(()=>c.textContent=o,1200)}
  const ed=e.target.closest('[data-editor]');if(ed){e.preventDefault();importToEditor(ed.dataset.editor)}
});

/* =====================================================================
   TAB 3 — BIOMOLEKUL & VIRUS (3Dmol.js + RCSB PDB)
   ===================================================================== */
const BIO=[
 {g:'HIV-1',items:[
  ['5FYL','Spike Env (trimer gp120/gp41)','Glikoprotein permukaan yang menempel pada sel T CD4.'],
  ['1GC1','gp120 + reseptor CD4 + antibodi','Inti gp120 saat mengikat reseptor CD4.'],
  ['1ENV','gp41 (protein fusi)','Bagian yang memfusikan membran virus dengan sel.'],
  ['1HIW','Protein matriks p17 (trimer)','Lapisan di bawah selubung lipid.'],
  ['3H47','Kapsid p24 (heksamer CA)','Unit penyusun kapsid berbentuk kerucut.'],
  ['1A1T','Nukleokapsid NCp7 + RNA','Pengemas genom RNA virus.'],
  ['1RTD','Reverse transkriptase','Menyalin RNA virus menjadi DNA. Target obat zidovudin, tenofovir.'],
  ['1BIS','Integrase (domain inti)','Menyisipkan DNA virus ke genom inang.'],
  ['1HVR','Protease + inhibitor','Memotong poliprotein virus. Target ritonavir dan sejenisnya.']]},
 {g:'Virus lain',items:[
  ['6VXX','Spike SARS-CoV-2 (tertutup)','Protein spike virus corona.'],
  ['6LU7','Protease utama SARS-CoV-2 + inhibitor N3','Enzim Mpro, target obat antivirus.'],
  ['6M71','RNA polimerase SARS-CoV-2','Kompleks nsp12/7/8, target remdesivir.'],
  ['1HGF','Hemaglutinin influenza','Protein permukaan virus flu yang mengikat asam sialat.'],
  ['2TMV','Virus mosaik tembakau','Heliks protein pembungkus RNA.'],
  ['1HXS','Poliovirus','Unit asimetris kapsid ikosahedral.']]},
 {g:'Racun bisa ular',items:[
  ['1IDI','α-bungarotoksin (ular belang/krait)','Neurotoksin yang memblokir reseptor asetilkolin nikotinik.'],
  ['1CTX','α-kobratoksin (kobra)','Neurotoksin tiga-jari dari bisa kobra.'],
  ['1CRE','Kardiotoksin II (kobra Taiwan)','Merusak membran sel jantung dan otot.'],
  ['1DTX','α-dendrotoksin (mamba hijau)','Penghambat kanal kalium.'],
  ['1FSC','Fasciculin-2 (mamba hijau)','Penghambat asetilkolinesterase.'],
  ['1PSJ','Fosfolipase A2 (Agkistrodon)','Enzim bisa yang merusak fosfolipid membran.'],
  ['1KXI','Sitotoksin','Toksin pembentuk pori pada membran sel.']]},
 {g:'Protein dan asam nukleat',items:[
  ['4HHB','Hemoglobin manusia','Pengangkut oksigen dalam darah.'],
  ['3I40','Insulin manusia','Hormon pengatur gula darah.'],
  ['1BNA','DNA B (dodekamer)','Heliks ganda DNA.'],
  ['1TUP','p53 + DNA','Pelindung genom, sering bermutasi pada kanker.'],
  ['1AOI','Nukleosom','DNA yang melilit histon.'],
  ['1IGT','Antibodi (IgG)','Imunoglobulin utuh.'],
  ['1EMA','Green fluorescent protein','Protein pendar dari ubur-ubur.'],
  ['4OO8','Cas9 + RNA pemandu + DNA target','Mesin penyuntingan gen CRISPR.'],
  ['2RH1','Reseptor β2-adrenergik','Reseptor GPCR, target banyak obat.']]}
];
$('bcat').innerHTML=BIO.map(g=>`<h3>${g.g}</h3>`+g.items.map(i=>`<button data-pdb="${i[0]}" data-label="${esc(i[1])}"><b>${esc(i[1])}</b><code>${i[0]}</code><span>${esc(i[2])}</span></button>`).join('')).join('');
const VIRUS={
 hiv:{parts:[['5FYL','Spike Env (gp120/gp41)'],['1GC1','gp120 + CD4'],['1ENV','gp41'],['1HIW','Matriks p17'],['3H47','Kapsid p24'],['1A1T','Nukleokapsid + RNA'],['1RTD','Reverse transkriptase'],['1BIS','Integrase'],['1HVR','Protease']],
  svg:()=>{let sp='';for(let a=0;a<360;a+=30){if(a===90||a===270)continue;const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
    sp+=`<line x1="${150+c*108}" y1="${150+s*108}" x2="${150+c*130}" y2="${150+s*130}" stroke="var(--bond)" stroke-width="3"/><circle cx="${150+c*136}" cy="${150+s*136}" r="7" style="fill:color-mix(in srgb,var(--accent) 30%,var(--surface));stroke:var(--bond)" stroke-width="1.5"/>`}
    return `<svg viewBox="0 0 300 300" role="img" aria-label="Skema virion HIV-1">
    <g class="part" data-pdb="5FYL" data-label="Spike Env (gp120/gp41)">${sp}</g>
    <circle cx="150" cy="150" r="108" style="fill:var(--surface2)" stroke="var(--bond)" stroke-width="6"/>
    <g class="part" data-pdb="1HIW" data-label="Matriks p17"><circle cx="150" cy="150" r="96" fill="none" stroke="var(--muted)" stroke-width="5" stroke-dasharray="3 4"/></g>
    <g class="part" data-pdb="3H47" data-label="Kapsid p24"><path d="M100 98 L200 98 Q214 150 172 212 L150 238 L128 212 Q86 150 100 98Z" style="fill:color-mix(in srgb,var(--accent) 12%,var(--surface))" stroke="var(--accent)" stroke-width="2"/></g>
    <g class="part" data-pdb="1A1T" data-label="Nukleokapsid + RNA"><path d="M118 125 q8 -10 16 0 t16 0 t16 0 M114 148 q8 -10 16 0 t16 0 t16 0 t16 0 M120 171 q8 -10 16 0 t16 0 t16 0" fill="none" stroke="var(--muted)" stroke-width="3" stroke-linecap="round"/></g>
    <g class="part" data-pdb="1RTD" data-label="Reverse transkriptase"><ellipse cx="132" cy="192" rx="9" ry="6" style="fill:var(--surface)" stroke="var(--bond)" stroke-width="2"/></g>
    <g class="part" data-pdb="1BIS" data-label="Integrase"><ellipse cx="168" cy="188" rx="7" ry="7" style="fill:var(--surface)" stroke="var(--bond)" stroke-width="2"/></g>
    <g class="part" data-pdb="1HVR" data-label="Protease"><circle cx="150" cy="208" r="5" style="fill:var(--surface)" stroke="var(--bond)" stroke-width="2"/></g></svg>`}},
 cov:{parts:[['6VXX','Spike (S)'],['7K3G','Selubung (E)'],['6M3M','Nukleokapsid (N)'],['6M71','RNA polimerase (nsp12)'],['6LU7','Protease utama (Mpro)']],
  svg:()=>{let sp='',ev='';for(let a=0;a<360;a+=20){const r=a*Math.PI/180,c=Math.cos(r),s=Math.sin(r);
    sp+=`<line x1="${150+c*98}" y1="${150+s*98}" x2="${150+c*124}" y2="${150+s*124}" stroke="var(--bond)" stroke-width="3"/><circle cx="${150+c*131}" cy="${150+s*131}" r="9" style="fill:color-mix(in srgb,var(--accent) 30%,var(--surface));stroke:var(--bond)" stroke-width="1.5"/>`;
    if(a%60===10)ev+=`<circle cx="${150+c*98}" cy="${150+s*98}" r="5" style="fill:var(--surface)" stroke="var(--muted)" stroke-width="2"/>`}
    return `<svg viewBox="0 0 300 300" role="img" aria-label="Skema virion SARS-CoV-2">
    <g class="part" data-pdb="6VXX" data-label="Spike (S)">${sp}</g>
    <circle cx="150" cy="150" r="98" style="fill:var(--surface2)" stroke="var(--bond)" stroke-width="6"/>
    <g class="part" data-pdb="7K3G" data-label="Selubung (E)">${ev}</g>
    <g class="part" data-pdb="6M3M" data-label="Nukleokapsid (N) + RNA"><path d="M95 150 q12 -34 24 0 t24 0 t24 0 t24 0 M100 128 q12 -30 22 0 t22 0 t22 0 t22 0 M100 172 q12 -30 22 0 t22 0 t22 0 t22 0" fill="none" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/></g>
    <g class="part" data-pdb="6M71" data-label="RNA polimerase (nsp12)"><ellipse cx="150" cy="112" rx="14" ry="7" style="fill:var(--surface)" stroke="var(--bond)" stroke-width="2"/></g></svg>`}}
};
function drawVirus(k){
  const v=VIRUS[k];$('anatSvg').innerHTML=v.svg();
  $('anatList').innerHTML=v.parts.map(p=>`<button data-pdb="${p[0]}" data-label="${esc(p[1])}">${esc(p[1])} <span class="muted small">${p[0]}</span></button>`).join('');
}
document.querySelectorAll('[data-virus]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-virus]').forEach(x=>x.classList.toggle('on',x===b));drawVirus(b.dataset.virus)});
drawVirus('hiv');
let bioV=null,bioModel=null,bioId=null;
function ensureBio(){
  if(bioV){bioV.resize();return}
  if(typeof $3Dmol==='undefined'){$('b3d').innerHTML='<div class="empty">Pustaka 3Dmol.js tidak termuat (lib/3Dmol-min.js).</div>';return}
  bioV=$3Dmol.createViewer($('b3d'),{backgroundColor:cssv('--canvas')});
}
window.addEventListener('resize',()=>{if(bioV)bioV.resize();fitSvg()});
async function fetchText(u){const r=await fetch(u);if(!r.ok)throw new Error('HTTP '+r.status);return r.text()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pdb]');if(b)loadPDB(b.dataset.pdb,b.dataset.label)});
async function loadPDB(id,label){
  ensureBio();if(!bioV)return;id=id.toUpperCase();bioId=id;
  document.querySelectorAll('[data-pdb]').forEach(x=>x.classList.toggle('on',x.dataset.pdb===id&&!x.closest('#bres')));
  $('btitle').firstChild.textContent=(label||id)+' ';$('bsub').textContent='memuat '+id+'…';$('binfo').innerHTML='';
  const asm=$('basm').checked;let txt,fmt='pdb';
  try{
    try{txt=await fetchText(`https://files.rcsb.org/download/${id}.${asm?'pdb1':'pdb'}`)}
    catch(e){txt=await fetchText(`https://files.rcsb.org/download/${id}${asm?'-assembly1':''}.cif`);fmt='cif'}
  }catch(e){$('bsub').textContent='Gagal memuat '+id+' ('+e.message+')';return}
  if(bioId!==id)return;
  bioV.clear();bioModel=bioV.addModel(txt,fmt);applyBio();bioV.zoomTo();bioV.render();
  const n=bioModel.selectedAtoms({}).length;
  $('bsub').textContent=`PDB ${id} · ${n.toLocaleString('id-ID')} atom${asm?' · unit biologis':''}`;
  bioInfo(id);
}
function applyBio(){
  if(!bioV||!bioModel)return;
  const n=bioModel.selectedAtoms({}).length;let st=$('bstyle').value;const col=$('bcolor').value;
  bioV.removeAllSurfaces();bioV.setStyle({},{});
  const co=col==='spectrum'?{color:'spectrum'}:{colorscheme:col};
  const heavy=n>60000;
  if(st==='cartoon'&&heavy)st='line';
  if(st==='cartoon')bioV.setStyle({hetflag:false},{cartoon:co});
  else if(st==='surface')bioV.setStyle({hetflag:false},{cartoon:co});
  else if(st==='stick')bioV.setStyle({hetflag:false},{stick:{radius:.14,...co}});
  else if(st==='sphere')bioV.setStyle({hetflag:false},{sphere:{scale:.9,...co}});
  else bioV.setStyle({hetflag:false},{line:co});
  bioV.setStyle({hetflag:true},{stick:{radius:.2,colorscheme:'Jmol'}});
  bioV.setStyle({resn:'HOH'},{});
  if(st==='surface'){if(n<=14000)bioV.addSurface($3Dmol.SurfaceType.VDW,{opacity:.65,...(col==='spectrum'?{color:'white'}:{colorscheme:col})},{hetflag:false});else $('bhelp').textContent='Permukaan dinonaktifkan: struktur terlalu besar.'}
  else $('bhelp').textContent=heavy?'Struktur sangat besar, ditampilkan sebagai garis agar tetap lancar.':'Seret untuk memutar, scroll untuk zoom, klik kanan + seret untuk menggeser.';
  bioV.render();
}
['bstyle','bcolor'].forEach(i=>$(i).onchange=applyBio);
$('bspin').onchange=e=>{if(bioV)bioV.spin(e.target.checked?'y':false,.6)};
$('basm').onchange=()=>{if(bioId)loadPDB(bioId,$('btitle').firstChild.textContent.trim())};
async function bioInfo(id){
  try{
    const q=`{entry(entry_id:"${id}"){struct{title} exptl{method} rcsb_entry_info{resolution_combined polymer_entity_count deposited_atom_count} rcsb_accession_info{initial_release_date} polymer_entities{rcsb_polymer_entity{pdbx_description} rcsb_entity_source_organism{ncbi_scientific_name}}}}`;
    const r=await fetch('https://data.rcsb.org/graphql',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:q})});
    const d=(await r.json()).data.entry;if(bioId!==id)return;
    const ents=(d.polymer_entities||[]).map(e=>e.rcsb_polymer_entity.pdbx_description).filter(Boolean);
    const orgs=[...new Set((d.polymer_entities||[]).flatMap(e=>(e.rcsb_entity_source_organism||[]).map(o=>o.ncbi_scientific_name)).filter(Boolean))];
    const ri=d.rcsb_entry_info||{};
    $('binfo').innerHTML=`<dt>Judul</dt><dd>${esc(d.struct.title)}</dd><dt>ID PDB</dt><dd><a href="https://www.rcsb.org/structure/${id}" target="_blank" rel="noopener">${id}</a></dd>
      <dt>Molekul</dt><dd>${ents.map(esc).join('; ')}</dd>${orgs.length?`<dt>Organisme</dt><dd><i>${orgs.map(esc).join('</i>, <i>')}</i></dd>`:''}
      <dt>Metode</dt><dd>${esc((d.exptl||[]).map(x=>x.method).join(', '))}${ri.resolution_combined&&ri.resolution_combined[0]?' · resolusi '+ri.resolution_combined[0]+' Å':''}</dd>
      <dt>Dirilis</dt><dd>${esc((d.rcsb_accession_info.initial_release_date||'').slice(0,10))}</dd><dt>Atom (unit asimetris)</dt><dd>${(ri.deposited_atom_count||0).toLocaleString('id-ID')} · ${ri.polymer_entity_count||'?'} jenis polimer</dd>`;
  }catch(e){}
}
$('bform').onsubmit=async e=>{
  e.preventDefault();const q=$('bq').value.trim();if(!q)return;
  if(/^[0-9][A-Za-z0-9]{3}$/.test(q)){loadPDB(q,q.toUpperCase());return}
  $('bstatus').innerHTML=spinner('Mencari…');
  try{
    const r=await fetch('https://search.rcsb.org/rcsbsearch/v2/query',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:{type:'terminal',service:'full_text',parameters:{value:q}},return_type:'entry',request_options:{paginate:{start:0,rows:12},sort:[{sort_by:'score',direction:'desc'}]}})});
    if(r.status===204){$('bstatus').textContent='Tidak ada hasil.';$('bres').style.display='none';return}
    const j=await r.json();const ids=j.result_set.map(x=>x.identifier);
    const g=await fetch('https://data.rcsb.org/graphql',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({query:`{entries(entry_ids:${JSON.stringify(ids)}){rcsb_id struct{title} rcsb_entry_info{deposited_atom_count}}}`})});
    const es=(await g.json()).data.entries;
    $('bstatus').textContent=`${j.total_count.toLocaleString('id-ID')} entri ditemukan, menampilkan ${es.length} teratas.`;
    $('bres').style.display='';$('bres').innerHTML=es.map(x=>`<button class="ritem" data-pdb="${x.rcsb_id}" data-label="${esc(x.struct.title.slice(0,70))}"><b>${esc(x.struct.title)}</b><span>${x.rcsb_id} · ${(x.rcsb_entry_info.deposited_atom_count||0).toLocaleString('id-ID')} atom</span></button>`).join('');
  }catch(er){$('bstatus').textContent='Pencarian gagal: '+er.message}
};

/* =====================================================================
   TAB 4 — EDITOR MOLEKUL
   ===================================================================== */
const EDEF={H:[1],B:[3],C:[4],N:[3],O:[2],F:[1],Si:[4],P:[3,5],S:[2,4,6],Cl:[1,3,5,7],Br:[1,3,5,7],I:[1,3,5,7],Se:[2,4,6],As:[3,5]};
const EORG=new Set(['B','C','N','O','P','S','F','Cl','Br','I']);
const ECOL={N:'#3b63d6',O:'#d23c3c',S:'#a97800',P:'#d6700f',F:'#2f9b50',Cl:'#2f9b50',Br:'#8f3a2b',I:'#7a2a8f'};
let E={atoms:[],bonds:[],nid:1,tool:'draw',el:'C'},EH=[],EREADY=false,EW=640,EHt=440,eDrag=null,eMove=null;
const svg=$('esvg');
function fitSvg(){const r=svg.getBoundingClientRect();if(r.width<10)return;EW=r.width;EHt=r.height;svg.setAttribute('viewBox',`0 0 ${EW} ${EHt}`)}
function vlist(el,ch){
  const b=EDEF[el];if(!b)return null;if(!ch)return b;
  if(el==='C')return[4-Math.abs(ch)];
  if(el==='B')return b.map(v=>v-ch).filter(v=>v>=0);
  const g=BY[el].ve;if(g>=5&&g<=7)return b.map(v=>v+ch).filter(v=>v>=0);
  return b;
}
function eAnalyze(){
  const bs={};E.atoms.forEach(a=>bs[a.id]=0);E.bonds.forEach(b=>{bs[b.a]+=b.o;bs[b.b]+=b.o});
  return E.atoms.map(a=>{const l=vlist(a.el,a.ch||0);const s=bs[a.id];
    if(!l)return{a,h:0,ok:true,bs:s,metal:true};
    const t=l.find(v=>v>=s);return{a,h:t===undefined?0:t-s,ok:t!==undefined,bs:s}});
}
function eSmiles(info){
  const A=E.atoms,B=E.bonds;if(!A.length)return'';
  const idx={};A.forEach((a,i)=>idx[a.id]=i);const adj=A.map(()=>[]);
  B.forEach((b,bi)=>{adj[idx[b.a]].push({to:idx[b.b],o:b.o,bi});adj[idx[b.b]].push({to:idx[b.a],o:b.o,bi})});
  const vis=new Array(A.length).fill(false),usedB=new Set(),kids=A.map(()=>[]),rings=[];
  const dfs=(u,pb)=>{vis[u]=true;for(const e of adj[u]){if(e.bi===pb||usedB.has(e.bi))continue;usedB.add(e.bi);
    if(!vis[e.to]){kids[u].push(e);dfs(e.to,e.bi)}else rings.push({open:e.to,close:u,o:e.o,d:0})}};
  // dfs rekursif; "open" = leluhur (yang lebih dulu dipancarkan)
  const comps=[];
  for(let s=0;s<A.length;s++)if(!vis[s]){comps.push(s);dfs(s,-1)}
  const atomStr=i=>{const x=info[i],a=x.a;const plain=EORG.has(a.el)&&!(a.ch)&&x.ok&&(()=>{const v=ORGDEF[a.el];const t=v.find(q=>q>=x.bs);return t!==undefined&&t-x.bs===x.h})();
    if(plain)return a.el;const ch=a.ch?(a.ch>0?'+':'-')+(Math.abs(a.ch)>1?Math.abs(a.ch):''):'';return'['+a.el+(x.h?'H'+(x.h>1?x.h:''):'')+ch+']'};
  const ORGDEF=ORG;let free=[];const dg=()=>{let d=1;while(free.includes(d))d++;free.push(d);return d};
  const dstr=d=>d>9?'%'+d:''+d,oSym=o=>o===2?'=':o===3?'#':'';
  const emit=u=>{
    let s=atomStr(u);
    rings.forEach(r=>{if(r.close===u&&r.d)s+=oSym(r.o)+dstr(r.d)});
    rings.forEach(r=>{if(r.close===u&&r.d){free=free.filter(x=>x!==r.d)}});
    rings.forEach(r=>{if(r.open===u){r.d=dg();s+=dstr(r.d)}});
    const ks=kids[u];ks.forEach((e,k)=>{const sub=oSym(e.o)+emit(e.to);s+=(k<ks.length-1)?'('+sub+')':sub});
    return s;
  };
  return comps.map(emit).join('.');
}
function eHill(info){
  const c={};let ch=0;info.forEach(x=>{c[x.a.el]=(c[x.a.el]||0)+1;if(x.h)c.H=(c.H||0)+x.h;ch+=x.a.ch||0});
  return{c,ch,f:hillOf(c)};
}
function eSnap(){EH.push(JSON.stringify({atoms:E.atoms,bonds:E.bonds,nid:E.nid}));if(EH.length>60)EH.shift()}
function eRestore(s){const o=JSON.parse(s);E.atoms=o.atoms;E.bonds=o.bonds;E.nid=o.nid}
function eAdd(el,x,y){const a={id:E.nid++,el,x,y,ch:0};E.atoms.push(a);return a}
function eBond(a,b){if(a===b)return;const f=E.bonds.find(q=>(q.a===a&&q.b===b)||(q.a===b&&q.b===a));if(f)f.o=f.o%3+1;else E.bonds.push({a,b,o:1})}
const eAt=id=>E.atoms.find(a=>a.id===id);
function eHitAtom(p){let best=null,bd=15;E.atoms.forEach(a=>{const d=Math.hypot(a.x-p.x,a.y-p.y);if(d<bd){bd=d;best=a}});return best}
function eHitBond(p){let best=null,bd=7;E.bonds.forEach(b=>{const A=eAt(b.a),B=eAt(b.b);const dx=B.x-A.x,dy=B.y-A.y,L2=dx*dx+dy*dy||1;let t=((p.x-A.x)*dx+(p.y-A.y)*dy)/L2;t=Math.max(0,Math.min(1,t));const d=Math.hypot(p.x-(A.x+t*dx),p.y-(A.y+t*dy));if(d<bd){bd=d;best=b}});return best}
function ePt(ev){const r=svg.getBoundingClientRect();return{x:ev.clientX-r.left,y:ev.clientY-r.top}}
function eErase(p){const a=eHitAtom(p);if(a){eSnap();E.bonds=E.bonds.filter(b=>b.a!==a.id&&b.b!==a.id);E.atoms=E.atoms.filter(x=>x!==a);return true}
  const b=eHitBond(p);if(b){eSnap();E.bonds=E.bonds.filter(x=>x!==b);return true}return false}
svg.addEventListener('contextmenu',e=>{e.preventDefault();if(eErase(ePt(e)))renderEditor()});
svg.addEventListener('pointerdown',e=>{
  if(e.button===2)return;const p=ePt(e);svg.setPointerCapture(e.pointerId);const t=E.tool;
  if(t==='erase'){if(eErase(p))renderEditor();return}
  const a=eHitAtom(p);
  if(t==='charge'){if(a){eSnap();a.ch=a.ch===0?1:a.ch===1?-1:0;renderEditor()}return}
  if(t==='move'){if(a){eSnap();eMove={a,dx:a.x-p.x,dy:a.y-p.y}}return}
  if(a){eDrag={from:a,p,moved:false}}
  else{const b=eHitBond(p);if(b){eSnap();b.o=b.o%3+1;renderEditor()}else{eSnap();eAdd(E.el,p.x,p.y);renderEditor()}}
});
svg.addEventListener('pointermove',e=>{
  const p=ePt(e);
  if(eMove){eMove.a.x=p.x+eMove.dx;eMove.a.y=p.y+eMove.dy;renderEditor(false,true);return}
  if(eDrag){eDrag.p=p;if(Math.hypot(p.x-eDrag.from.x,p.y-eDrag.from.y)>8)eDrag.moved=true;renderEditor(false,true)}
});
svg.addEventListener('pointerup',e=>{
  const p=ePt(e);
  if(eMove){eMove=null;renderEditor();return}
  if(!eDrag)return;const d=eDrag;eDrag=null;
  if(!d.moved){if(d.from.el!==E.el){eSnap();d.from.el=E.el}renderEditor();return}
  const tgt=eHitAtom(p);eSnap();
  if(tgt&&tgt!==d.from)eBond(d.from.id,tgt.id);
  else if(!tgt){let ang=Math.atan2(p.y-d.from.y,p.x-d.from.x);ang=Math.round(ang/(Math.PI/6))*(Math.PI/6);const n=eAdd(E.el,d.from.x+42*Math.cos(ang),d.from.y+42*Math.sin(ang));eBond(d.from.id,n.id)}
  renderEditor();
});
function renderEditor(force,light){
  if(!EREADY)return;
  const info=eAnalyze();
  const col=el=>ECOL[el]||(el==='C'||el==='H'?cssv('--text'):cssv('--muted'));
  let s='';
  E.bonds.forEach(b=>{const A=eAt(b.a),B=eAt(b.b);const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,nx=-uy,ny=ux;
    const sh=Math.min(10,L/3);const x1=A.x+ux*sh,y1=A.y+uy*sh,x2=B.x-ux*sh,y2=B.y-uy*sh;
    (b.o===1?[0]:b.o===2?[-2.6,2.6]:[-4.5,0,4.5]).forEach(o=>{s+=`<line x1="${x1+nx*o}" y1="${y1+ny*o}" x2="${x2+nx*o}" y2="${y2+ny*o}" stroke="${cssv('--bond')}" stroke-width="2" stroke-linecap="round"/>`})});
  if(eDrag&&eDrag.moved)s+=`<line x1="${eDrag.from.x}" y1="${eDrag.from.y}" x2="${eDrag.p.x}" y2="${eDrag.p.y}" stroke="${cssv('--accent')}" stroke-width="2" stroke-dasharray="4 4"/>`;
  info.forEach(x=>{const a=x.a;const lab=a.el+(x.h>0?'H'+(x.h>1?SUBN(x.h):''):'');
    const chs=a.ch?(Math.abs(a.ch)>1?Math.abs(a.ch):'')+(a.ch>0?'+':'−'):'';
    s+=`<g><circle cx="${a.x}" cy="${a.y}" r="12" fill="${cssv('--canvas')}" stroke="${x.ok?'none':cssv('--danger')}" stroke-width="1.5"/><text x="${a.x}" y="${a.y+5}" text-anchor="middle" font-size="14" font-weight="600" fill="${x.ok?col(a.el):cssv('--danger')}" style="pointer-events:none">${lab}</text>${chs?`<text x="${a.x+11}" y="${a.y-7}" font-size="11" font-weight="700" fill="${cssv('--text')}" style="pointer-events:none">${chs}</text>`:''}</g>`});
  svg.innerHTML=s;
  if(light)return;
  eReport(info);
  clearTimeout(eTimer);eTimer=setTimeout(e3d,350);
}
let eTimer=0,eKey='';
function eReport(info){
  const box=$('eanal');
  if(!info.length){box.innerHTML=`<h2>Analisis</h2><div class="empty">Kanvas kosong. Klik di kanvas untuk menempatkan atom, atau pakai cetakan.</div>`+eColl();return}
  const h=eHill(info),smi=eSmiles(info);let mass=0;for(const k in h.c)mass+=BY[k].mass*h.c[k];
  const bad=info.filter(x=>!x.ok);
  const hbd=info.filter(x=>['N','O','S'].includes(x.a.el)&&x.h>0).length,hba=info.filter(x=>['N','O'].includes(x.a.el)).length;
  const chs=h.ch?`<sup>${Math.abs(h.ch)>1?Math.abs(h.ch):''}${h.ch>0?'+':'−'}</sup>`:'';
  box.innerHTML=`<h2>Analisis</h2><div class="rhead"><div class="bigf">${sub(h.f)}${chs}</div><span class="tag">${info.length} atom berat${h.c.H?' + '+h.c.H+' H':''}</span></div>
  <dl class="facts"><dt>Massa molar</dt><dd>${mass.toFixed(3)} g/mol</dd><dt>SMILES</dt><dd><code style="word-break:break-all">${esc(smi)}</code> <button class="btn" style="padding:1px 7px;font-size:12px" data-copy="${esc(smi)}">Salin</button></dd>
  <dt>Donor / akseptor H</dt><dd>${hbd} / ${hba} <span class="muted small">(perkiraan dari jumlah N, O, S)</span></dd>
  <dt>Valensi</dt><dd>${bad.length?`<span style="color:var(--danger)">${bad.length} atom melebihi valensi normal (ditandai merah)</span>`:'<span style="color:var(--ok)">semua atom valid</span>'}</dd>
  <dt>Aturan Lipinski</dt><dd>${yn(mass<=500,'massa ≤ 500')} · ${yn(hbd<=5,'donor ≤ 5')} · ${yn(hba<=10,'akseptor ≤ 10')}</dd></dl>
  <div class="row mt"><button class="btn primary" id="epcgo">Periksa di PubChem</button><button class="btn" id="esave">Simpan ke koleksi</button></div>`+eColl();
  $('epcgo').onclick=ePC;$('esave').onclick=eSave;
}
function eColl(){
  let c=[];try{c=JSON.parse(localStorage.getItem('kl-coll')||'[]')}catch(e){}
  return`<div class="sec"><h3>Koleksi eksperimen <span class="muted">(tersimpan di browser ini)</span></h3>${c.length?`<table class="t">${c.map((x,i)=>`<tr><td><b>${esc(x.name)}</b><br><span class="muted small">${sub(x.f)}</span></td><td style="text-align:right;white-space:nowrap"><button class="btn" data-eload="${i}">Muat</button> <button class="btn" data-edel="${i}">Hapus</button></td></tr>`).join('')}</table>`:'<span class="muted small">Belum ada.</span>'}</div>`;
}
function eSave(){
  const name=prompt('Nama eksperimen / senyawa:','Senyawa baru '+new Date().toLocaleTimeString('id-ID'));if(!name)return;
  let c=[];try{c=JSON.parse(localStorage.getItem('kl-coll')||'[]')}catch(e){}
  c.push({name,f:eHill(eAnalyze()).f,g:{atoms:E.atoms,bonds:E.bonds,nid:E.nid}});
  try{localStorage.setItem('kl-coll',JSON.stringify(c))}catch(e){}renderEditor();
}
document.addEventListener('click',e=>{
  const l=e.target.closest('[data-eload]'),d=e.target.closest('[data-edel]');
  if(!l&&!d)return;let c=[];try{c=JSON.parse(localStorage.getItem('kl-coll')||'[]')}catch(x){}
  if(l){eSnap();const g=c[+l.dataset.eload].g;E.atoms=g.atoms;E.bonds=g.bonds;E.nid=g.nid;renderEditor()}
  if(d){c.splice(+d.dataset.edel,1);try{localStorage.setItem('kl-coll',JSON.stringify(c))}catch(x){}renderEditor()}
});
function e3d(){
  const info=eAnalyze();if(!info.length||info.some(x=>!x.ok)){return}
  const smi=eSmiles(info);if(smi===eKey)return;eKey=smi;
  try{const mol=parseSmiles(smi);if(mol.atoms.length>140){return}V3.set(layout(mol,smi))}catch(e){}
}
async function ePC(){
  const smi=eSmiles(eAnalyze()),box=$('epc');box.innerHTML=`<h2>PubChem</h2>${spinner('Memeriksa apakah senyawa ini sudah dikenal…')}`;
  let cids=[];
  try{cids=cidsOf(await pcPoll(await jpost(PUG+'/compound/smiles/cids/JSON',{smiles:smi})))}
  catch(e){if(e.status===400){box.innerHTML=`<h2>PubChem</h2><span class="warn">SMILES tidak dapat dibaca PubChem. Periksa valensi atom.</span>`;return}if(e.status!==404){box.innerHTML=`<h2>PubChem</h2><span class="warn">${esc(e.message)}</span>`;return}}
  try{
    if(cids.length){
      const ps=await pcProps(cids.slice(0,3));
      box.innerHTML=`<h2>PubChem</h2><div class="note" style="margin-top:0;border-color:var(--ok)"><b>Senyawa ini sudah dikenal.</b></div><div class="rlist mt">${ps.map(p=>`<button class="ritem" data-open="${p.CID}"><b>${esc(p.Title||p.IUPACName)}</b><span>${esc(p.IUPACName||'')} · CID ${p.CID}</span></button>`).join('')}</div>`;
    }else{
      box.innerHTML=`<h2>PubChem</h2><div class="note" style="margin-top:0;border-color:var(--warn)"><b>Tidak ditemukan di PubChem</b>: kemungkinan ini senyawa baru atau belum pernah dilaporkan. Nama sistematis belum bisa dibuat otomatis; beri nama sendiri lalu simpan ke koleksi.</div><div class="mt small muted">${spinner('Mencari senyawa paling mirip…')}</div>`;
      let sc=[];try{sc=cidsOf(await pcPoll(await jpost(PUG+'/compound/fastsimilarity_2d/smiles/cids/JSON?Threshold=75&MaxRecords=6',{smiles:smi})))}catch(e){}
      if(sc.length){const ps=await pcProps(sc);box.innerHTML=box.innerHTML.replace(/<div class="mt small muted">.*<\/div>$/s,'')+`<h3 class="mt" style="font-size:12.5px;color:var(--muted)">Senyawa paling mirip yang sudah diketahui</h3><div class="rlist">${ps.map(p=>`<button class="ritem" data-open="${p.CID}"><b>${esc(p.Title||p.IUPACName)}</b><span>${sub(p.MolecularFormula)} · CID ${p.CID}</span></button>`).join('')}</div>`}
      else box.innerHTML=box.innerHTML.replace(/<div class="mt small muted">.*<\/div>$/s,'');
    }
  }catch(e){box.innerHTML+=`<div class="warn small">${esc(e.message)}</div>`}
}
async function importToEditor(q){
  showTab('editor');$('eerr').textContent='Mengimpor…';
  try{
    let url=/^\d+$/.test(q)?`${PUG}/compound/cid/${q}/SDF`:`${PUG}/compound/name/${encodeURIComponent(q)}/SDF`;
    const r=await fetch(url);if(!r.ok)throw new Error('Tidak ditemukan di PubChem.');const m=parseSDF(await r.text());
    // buang H terminal
    const keep=m.atoms.filter(a=>!(a.el==='H'&&m.bonds.filter(b=>b.a===a.i||b.b===a.i).length===1));
    const ids=new Map();keep.forEach((a,k)=>ids.set(a.i,k));
    const bonds=m.bonds.filter(b=>ids.has(b.a)&&ids.has(b.b));
    let bl=0;bonds.forEach(b=>bl+=Math.hypot(m.atoms[b.a].x-m.atoms[b.b].x,m.atoms[b.a].y-m.atoms[b.b].y));bl=bl/(bonds.length||1)||1;
    const sc=42/bl;let cx=0,cy=0;keep.forEach(a=>{cx+=a.x/keep.length;cy+=a.y/keep.length});
    eSnap();E.atoms=[];E.bonds=[];E.nid=1;
    keep.forEach(a=>E.atoms.push({id:E.nid++,el:a.el,x:EW/2+(a.x-cx)*sc,y:EHt/2-(a.y-cy)*sc,ch:a.charge||0}));
    bonds.forEach(b=>E.bonds.push({a:ids.get(b.a)+1,b:ids.get(b.b)+1,o:b.o}));
    $('eerr').textContent='';renderEditor();
  }catch(e){$('eerr').textContent=e.message}
}
$('eimpgo').onclick=()=>{if($('eimp').value.trim())importToEditor($('eimp').value.trim())};
$('eimp').addEventListener('keydown',e=>{if(e.key==='Enter')$('eimpgo').click()});
document.querySelectorAll('#etools [data-tool]').forEach(b=>b.onclick=()=>{E.tool=b.dataset.tool;document.querySelectorAll('#etools [data-tool]').forEach(x=>x.classList.toggle('on',x===b))});
const PAL=['C','H','N','O','S','P','F','Cl','Br','I','Na','K'];
$('epal').innerHTML=PAL.map(e=>`<button class="btn ${e==='C'?'on':''}" data-pal="${e}">${e}</button>`).join('');
document.addEventListener('click',e=>{const b=e.target.closest('[data-pal]');if(!b)return;E.el=b.dataset.pal;document.querySelectorAll('[data-pal]').forEach(x=>x.classList.toggle('on',x===b));$('eother').value=''});
$('eother').addEventListener('input',e=>{const v=e.target.value.trim();const s=v?v[0].toUpperCase()+v.slice(1).toLowerCase():'';if(BY[s]){E.el=s;document.querySelectorAll('[data-pal]').forEach(x=>x.classList.remove('on'));$('eerr').textContent=''}else if(v)$('eerr').textContent='Simbol unsur tidak dikenal.'});
$('eundo').onclick=()=>{if(EH.length){eRestore(EH.pop());renderEditor()}};
$('eclear').onclick=()=>{if(E.atoms.length){eSnap();E.atoms=[];E.bonds=[];renderEditor()}};
document.querySelectorAll('[data-tpl]').forEach(b=>b.onclick=()=>{
  eSnap();const t=b.dataset.tpl,cx=EW/2,cy=EHt/2,R=42;
  if(t==='chain'){const ids=[];for(let i=0;i<4;i++){const y=cy+(i%2?9:-9);ids.push(eAdd('C',cx-63+i*42,cy+(i%2?-12:12)).id)}for(let i=0;i<3;i++)eBond(ids[i],ids[i+1])}
  else{const ids=[];for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/2;ids.push(eAdd('C',cx+R*Math.cos(a),cy+R*Math.sin(a)).id)}
    for(let i=0;i<6;i++){eBond(ids[i],ids[(i+1)%6]);if(t==='benzene'&&i%2===0)E.bonds[E.bonds.length-1].o=2}}
  renderEditor();
});
EREADY=true;

/* ---------- init ---------- */
buildTable();
$('cmpds').innerHTML=DB.map(c=>`<option value="${esc(c.id)}">${esc(c.f)}</option>`).join('');
$('examples').innerHTML=['H2 + O','Na + Cl','C + O2','N + H3','C2H5OH','C9H8O4','Ca + O + H2'].map(x=>`<button class="btn" data-ex="${x}">${x}</button>`).join('');
setTheme(document.documentElement.dataset.theme||'light');
update(true);
window.addEventListener('resize',fitSvg);
