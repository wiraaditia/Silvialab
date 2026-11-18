'use strict';
/* =====================================================================
   Genetika & sel — simulasi edukatif.
   A. Urutan DNA/RNA: heliks, transkripsi, translasi, klasifikasi mutasi
   B. Edit gen CRISPR-Cas9 (animasi konseptual)
   C. Sel & obat: model mainan permeabilitas + pengikatan target
   BUKAN prediksi klinis.
   ===================================================================== */
(function(){
/* ---------- suntik UI ---------- */
const nav=$('tabs');const tb=document.createElement('button');tb.className='tab';tb.dataset.tab='gen';tb.textContent='Genetika & sel';tb.onclick=()=>showTab('gen');nav.appendChild(tb);
const st=document.createElement('style');st.textContent=`
.gpane{display:none}.gpane.on{display:block}
textarea.seq{width:100%;min-height:74px;background:var(--surface);border:1px solid var(--line);border-radius:6px;padding:8px 10px;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--text);resize:vertical;outline:none;letter-spacing:.06em}
textarea.seq:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 22%,transparent)}
.mono{font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;word-break:break-all;letter-spacing:.05em}
.nA{color:#2f9b50}.nT,.nU{color:#d23c3c}.nG{color:#b07a00}.nC{color:#3b63d6}
.cod{display:inline-block;margin-right:.5em}
.aa-stop{color:var(--danger);font-weight:700}
canvas.g{display:block;width:100%;background:var(--canvas);border:1px solid var(--line);border-radius:6px}
.sl{display:grid;grid-template-columns:150px 1fr 64px;gap:8px;align-items:center;margin:6px 0;font-size:13px}
.sl input[type=range]{width:100%}
.verdict{border:1px solid var(--line);border-left-width:4px;border-radius:6px;padding:10px 12px;margin-top:12px}
.verdict.ok{border-left-color:var(--ok)}.verdict.bad{border-left-color:var(--danger)}.verdict.mid{border-left-color:var(--warn)}
.meter{height:8px;border-radius:2px;background:var(--line2);overflow:hidden;margin-top:3px}.meter i{display:block;height:100%;background:var(--accent)}
.steps{display:flex;gap:0;margin-top:8px;font-size:12px}
.steps div{flex:1;padding:6px 8px;border:1px solid var(--line);margin-left:-1px;color:var(--muted);background:var(--surface2)}
.steps div.on{background:var(--accent-soft);color:var(--accent);border-color:var(--accent);font-weight:600;position:relative;z-index:1}
`;document.head.appendChild(st);
const v=document.createElement('main');v.className='view';v.id='v-gen';
v.innerHTML=`
<div class="row" style="margin-bottom:12px"><div class="seg" id="gseg"><button class="on" data-gp="seq">Urutan DNA / RNA</button><button data-gp="crispr">Edit gen (CRISPR)</button><button data-gp="cell">Sel dan obat</button></div>
<span class="muted small">Simulasi edukatif bergaya film. Bukan prediksi klinis dan bukan panduan eksperimen.</span></div>

<div class="gpane on" id="g-seq"><div class="grid-e">
 <section class="card">
  <h2>Urutan<span>tulis A, T, G, C (atau U untuk RNA); tab lain memakai urutan ini</span></h2>
  <textarea class="seq" id="gs" spellcheck="false"></textarea>
  <div class="row mt"><button class="btn" id="gEx1">Contoh gen pendek</button><button class="btn" id="gRand">Acak 60 nt</button><button class="btn" id="gRef">Tetapkan sebagai referensi</button><span class="err" id="gErr" style="margin:0"></span></div>
  <div class="row mt"><span class="muted small">Heliks mulai dari basa ke</span><input type="range" id="gStart" min="1" max="1" value="1" style="width:160px"><span id="gStartV" class="small">1</span><label class="chk"><input type="checkbox" id="gSpin" checked> Putar</label></div>
  <canvas class="g" id="gHelix" style="height:290px;margin-top:10px"></canvas>
  <div class="note">Heliks ganda: 10 pasang basa per putaran. Adenin–Timin (A–T) dan Guanin–Sitosin (G–C) berpasangan lewat ikatan hidrogen. Struktur atom nyata: tab Biomolekul, PDB 1BNA.</div>
 </section>
 <aside class="stack">
  <div class="card" id="gOut"></div>
  <div class="card" id="gMut"></div>
 </aside></div></div>

<div class="gpane" id="g-crispr"><div class="grid-e">
 <section class="card">
  <h2>Animasi CRISPR-Cas9<span>konseptual</span></h2>
  <canvas class="g" id="gCr" style="height:330px"></canvas>
  <div class="row mt"><button class="btn primary" id="cPlay">Putar animasi</button><span id="cStage" class="muted small"></span></div>
 </section>
 <aside class="stack">
  <div class="card">
   <h2>Pengaturan</h2>
   <div class="small muted">Situs target dicari pada urutan di tab pertama (butuh motif PAM <b>NGG</b> dengan 20 nt di hulunya).</div>
   <div class="mt"><select id="cSite"></select></div>
   <div class="mt"><select id="cRepair"><option value="del">Perbaikan NHEJ: delesi 1 nt (kemungkinan frameshift)</option><option value="ins">Perbaikan NHEJ: insersi 1 nt (kemungkinan frameshift)</option><option value="hdr">Perbaikan HDR: sisipkan templat di bawah</option></select></div>
   <input type="text" id="cTpl" class="mt" value="GCTGCTGCT" spellcheck="false" placeholder="Templat HDR (ATGC)">
   <div class="row mt"><button class="btn" id="cFiksi">Skenario fiksi: gen sutra laba-laba</button><button class="btn" id="cApply">Terapkan hasil ke urutan</button></div>
   <div class="note">Skenario fiksi hanya menyisipkan motif berulang bergaya sutra laba-laba (spidroin) sebagai contoh bagaimana templat HDR bekerja. Di dunia nyata, penyuntingan gen pada manusia sangat dibatasi regulasi etik dan hukum.</div>
  </div>
  <div class="card" id="cOut"></div>
 </aside></div></div>

<div class="gpane" id="g-cell"><div class="grid-e">
 <section class="card">
  <h2>Sel yang diberi obat<span>model mainan</span></h2>
  <canvas class="g" id="gCell" style="height:380px"></canvas>
  <div class="row mt"><button class="btn primary" id="sRun">Jalankan simulasi</button><button class="btn" id="sRec">Rekam video</button><span id="sStat" class="muted small"></span><a id="sDl" class="btn" style="display:none;text-decoration:none" download="simulasi-sel.webm">Unduh video</a></div>
  <div class="verdict" id="sVerdict" style="display:none"></div>
  <div class="sec"><h3>Jalur nyata pengembangan obat <span class="muted">(simulasi ini hanya mewakili tahap pertama)</span></h3>
   <div class="steps"><div class="on">Simulasi komputer</div><div>Uji sel (in vitro)</div><div>Uji hewan</div><div>Uji klinis fase I</div><div>Fase II–III</div><div>Izin edar</div></div></div>
 </section>
 <aside class="stack">
  <div class="card">
   <h2>Obat</h2>
   <div class="row"><button class="btn" id="sJ">Ambil dari Jelajah</button><button class="btn" id="sE">Ambil dari Editor</button></div>
   <div class="small muted mt" id="sSrc">Sumber: nilai manual</div>
   <div class="sl"><span>Massa molekul</span><input type="range" id="pMW" min="50" max="900" step="1" value="180"><b id="pMWv"></b></div>
   <div class="sl"><span>LogP (lipofilisitas)</span><input type="range" id="pLP" min="-4" max="8" step=".1" value="1.2"><b id="pLPv"></b></div>
   <div class="sl"><span>TPSA (Å²)</span><input type="range" id="pTP" min="0" max="220" step="1" value="63"><b id="pTPv"></b></div>
   <div class="sl"><span>Donor ikatan H</span><input type="range" id="pHD" min="0" max="12" step="1" value="1"><b id="pHDv"></b></div>
   <div class="sl"><span>Akseptor ikatan H</span><input type="range" id="pHA" min="0" max="20" step="1" value="4"><b id="pHAv"></b></div>
  </div>
  <div class="card">
   <h2>Target dan dosis</h2>
   <select id="pType"><option value="rec">Target: reseptor di permukaan dalam membran</option><option value="enz">Target: enzim di sitoplasma</option><option value="vir">Target: protease virus dalam sel terinfeksi</option></select>
   <div class="sl mt"><span>Afinitas (pKd)</span><input type="range" id="pKd" min="4" max="10" step=".1" value="7.5"><b id="pKdv"></b></div>
   <div class="sl"><span>Selektivitas (kali)</span><input type="range" id="pSel" min="1" max="1000" step="1" value="200"><b id="pSelv"></b></div>
   <div class="sl"><span>Dosis (µM)</span><input type="range" id="pDo" min=".01" max="100" step=".01" value="1"><b id="pDov"></b></div>
   <div class="note">pKd tinggi berarti pengikatan kuat. Selektivitas rendah berarti obat ikut menempel pada protein lain, sehingga berisiko toksik.</div>
  </div>
 </aside></div></div>`;
document.querySelector('footer').before(v);

/* ---------- util ---------- */
function fit(cv){const dpr=window.devicePixelRatio||1,W=cv.clientWidth,H=cv.clientHeight;if(!W)return null;
  if(cv.width!==Math.round(W*dpr)||cv.height!==Math.round(H*dpr)){cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr)}
  const c=cv.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);return{c,W,H}}
const NCOL={A:'#2f9b50',T:'#d23c3c',U:'#d23c3c',G:'#d9a000',C:'#3b63d6'};
const AAS='FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG',ORD='TCAG';
const AA3={A:'Ala',R:'Arg',N:'Asn',D:'Asp',C:'Cys',Q:'Gln',E:'Glu',G:'Gly',H:'His',I:'Ile',L:'Leu',K:'Lys',M:'Met',F:'Phe',P:'Pro',S:'Ser',T:'Thr',W:'Trp',Y:'Tyr',V:'Val','*':'Stop'};
const codon=c=>AAS[16*ORD.indexOf(c[0])+4*ORD.indexOf(c[1])+ORD.indexOf(c[2])];
const comp=s=>s.split('').map(b=>({A:'T',T:'A',G:'C',C:'G'}[b])).join('');
const rev=s=>s.split('').reverse().join('');
function clean(raw){const s=raw.toUpperCase().replace(/\s+/g,'').replace(/U/g,'T');const bad=s.match(/[^ATGC]/);return{s:bad?null:s,err:bad?`Karakter "${bad[0]}" tidak valid. Gunakan A, T, G, C (atau U).`:''}}
function translate(s){const i=s.indexOf('ATG');if(i<0)return{p:'',i:-1,stop:false};let p='',stop=false;
  for(let k=i;k+3<=s.length;k+=3){const a=codon(s.slice(k,k+3));if(a==='*'){stop=true;break}p+=a}return{p,i,stop}}
function colorSeq(s){return s.split('').map(b=>`<span class="n${b}">${b}</span>`).join('')}
let SEQ='',REF='',START=0,spin=true,helixT=0;
const EX='ATGGCCCTGTGGATGCGCCTCCTGCCCCTGCTGGCGCTGCTGGCCCTCTGGGGACCTGACCCAGCCGCAGCCTAA';

/* ---------- A. urutan ---------- */
function readSeq(){const r=clean($('gs').value);$('gErr').textContent=r.err;if(r.s===null)return false;SEQ=r.s;return true}
function onSeq(){
  if(!readSeq())return;
  const n=SEQ.length;$('gStart').max=Math.max(1,n-1);if(START>n-1)START=0;$('gStart').value=START+1;$('gStartV').textContent=START+1;
  const gc=n?((SEQ.match(/[GC]/g)||[]).length/n*100):0;const tr=translate(SEQ);
  const cod=[];if(tr.i>=0)for(let k=tr.i;k+3<=n;k+=3){const c=SEQ.slice(k,k+3);cod.push(`<span class="cod">${colorSeq(c)}<br><span class="${codon(c)==='*'?'aa-stop':''}">${AA3[codon(c)]}</span></span>`);if(codon(c)==='*')break}
  $('gOut').innerHTML=`<h2>Hasil</h2><dl class="facts" style="grid-template-columns:110px 1fr;margin:0">
   <dt>Panjang</dt><dd>${n} nt · GC ${gc.toFixed(1)}%</dd>
   <dt>Untai sense (5′→3′)</dt><dd class="mono">${colorSeq(SEQ)}</dd>
   <dt>Komplemen (3′→5′)</dt><dd class="mono">${colorSeq(comp(SEQ))}</dd>
   <dt>mRNA (transkripsi)</dt><dd class="mono">${colorSeq(SEQ.replace(/T/g,'U'))}</dd>
   <dt>Protein (translasi)</dt><dd>${tr.i<0?'<span class="muted">tidak ada kodon start ATG</span>':`<span class="mono">${tr.p}${tr.stop?'<span class="aa-stop">■</span>':''}</span> <span class="muted small">${tr.p.length} asam amino${tr.stop?'':' (tanpa stop)'}</span>`}</dd>
   ${cod.length?`<dt>Kodon</dt><dd class="mono" style="line-height:1.35">${cod.join('')}</dd>`:''}</dl>`;
  mutReport();crisprSites();
}
function compareProt(ref,now){
  if(ref===now)return{t:'Tidak ada perubahan',d:'Urutan sama dengan referensi.',c:'ok'};
  const a=translate(ref),b=translate(now);
  if(a.i<0||b.i<0)return{t:'Kodon start berubah',d:'Urutan tidak lagi menghasilkan protein dari ATG yang sama.',c:'bad'};
  if(a.p===b.p&&a.stop===b.stop)return{t:'Mutasi diam (silent)',d:'Urutan DNA berubah tetapi protein sama, karena kode genetik berlebih (degenerate).',c:'ok'};
  if((now.length-ref.length)%3!==0)return{t:'Frameshift',d:`Panjang berubah ${now.length-ref.length>0?'+':''}${now.length-ref.length} nt sehingga kerangka baca bergeser. Protein hilir biasanya rusak (${a.p.length} → ${b.p.length} asam amino).`,c:'bad'};
  if(b.p.length<a.p.length&&b.stop)return{t:'Nonsense',d:`Kodon stop muncul lebih awal. Protein terpotong dari ${a.p.length} menjadi ${b.p.length} asam amino.`,c:'bad'};
  if(a.p.length!==b.p.length)return{t:'Indel dalam kerangka',d:`Satu atau lebih asam amino bertambah/berkurang (${a.p.length} → ${b.p.length}).`,c:'mid'};
  const ch=[];for(let k=0;k<a.p.length;k++)if(a.p[k]!==b.p[k])ch.push(a.p[k]+(k+1)+b.p[k]);
  return{t:'Missense',d:`Asam amino berubah: ${ch.slice(0,6).join(', ')}${ch.length>6?'…':''}. Dampaknya bergantung pada peran posisi tersebut.`,c:'mid'};
}
function mutReport(){
  if(!REF){$('gMut').innerHTML=`<h2>Mutasi</h2><div class="muted small">Tekan "Tetapkan sebagai referensi", lalu ubah urutan untuk melihat jenis mutasinya (silent, missense, nonsense, frameshift).</div>`;return}
  const r=compareProt(REF,SEQ);
  $('gMut').innerHTML=`<h2>Mutasi terhadap referensi</h2><div class="verdict ${r.c}" style="margin-top:0"><b>${r.t}</b><div class="small">${r.d}</div></div><div class="small muted mt">Referensi: <span class="mono">${esc(REF.slice(0,60))}${REF.length>60?'…':''}</span></div>`;
}
$('gs').addEventListener('input',onSeq);
$('gEx1').onclick=()=>{$('gs').value=EX;REF='';onSeq()};
$('gRand').onclick=()=>{let s='ATG';for(let i=0;i<54;i++)s+='ACGT'[Math.floor(Math.random()*4)];$('gs').value=s+'TAA';REF='';onSeq()};
$('gRef').onclick=()=>{if(readSeq()){REF=SEQ;mutReport()}};
$('gStart').oninput=e=>{START=+e.target.value-1;$('gStartV').textContent=START+1};
$('gSpin').onchange=e=>spin=e.target.checked;
document.querySelectorAll('#gseg [data-gp]').forEach(b=>b.onclick=()=>{document.querySelectorAll('#gseg [data-gp]').forEach(x=>x.classList.toggle('on',x===b));document.querySelectorAll('.gpane').forEach(p=>p.classList.toggle('on',p.id==='g-'+b.dataset.gp));if(b.dataset.gp==='crispr')cDrawStatic()});

function drawHelix(){
  const f=fit($('gHelix'));if(!f||!SEQ)return;const{c,W,H}=f;
  if(spin)helixT+=.02;
  const n=Math.min(SEQ.length-START,Math.max(10,Math.floor(W/26)));const step=(W-40)/Math.max(1,n);const R=H*.27,cy=H/2;
  const items=[];
  for(let i=0;i<n;i++){
    const th=i*Math.PI/5+helixT,x=24+i*step+step/2,y1=cy+R*Math.cos(th),z1=Math.sin(th),y2=cy-R*Math.cos(th),z2=-z1;
    const b=SEQ[START+i];items.push({t:'r',x,y1,y2,z:0,b,cb:comp(b),i,z1});
    items.push({t:'s',x,y:y1,z:z1,i,k:1});items.push({t:'s',x,y:y2,z:z2,i,k:2});
    if(i>0){const pth=(i-1)*Math.PI/5+helixT,px=24+(i-1)*step+step/2;
      items.push({t:'b',x1:px,y1:cy+R*Math.cos(pth),x2:x,y2:y1,z:(Math.sin(pth)+z1)/2});
      items.push({t:'b',x1:px,y1:cy-R*Math.cos(pth),x2:x,y2:y2,z:-(Math.sin(pth)+z1)/2})}
  }
  items.sort((a,b)=>a.z-b.z);
  const T=themeColors();
  for(const it of items){
    if(it.t==='b'){c.strokeStyle=T.bond;c.lineWidth=3;c.globalAlpha=.55+.35*it.z;c.beginPath();c.moveTo(it.x1,it.y1);c.lineTo(it.x2,it.y2);c.stroke();c.globalAlpha=1}
    else if(it.t==='s'){c.fillStyle=T.bond;c.beginPath();c.arc(it.x,it.y,4.5+it.z*1.2,0,7);c.fill()}
    else{
      const mx=it.x,my=(it.y1+it.y2)/2;c.lineCap='round';c.lineWidth=Math.max(4,step*.3);
      c.strokeStyle=NCOL[it.b];c.beginPath();c.moveTo(mx,it.y1);c.lineTo(mx,my);c.stroke();
      c.strokeStyle=NCOL[it.cb];c.beginPath();c.moveTo(mx,my);c.lineTo(mx,it.y2);c.stroke();
      if(step>14){c.font='600 11px system-ui';c.textAlign='center';c.textBaseline='middle';c.fillStyle=cssv('--text');
        c.fillText(it.b,mx,it.y1+(it.y1<cy?-11:11));c.fillText(it.cb,mx,it.y2+(it.y2<cy?-11:11))}
    }
  }
  c.fillStyle=T.muted;c.font='11px system-ui';c.textAlign='left';c.fillText(`5′ → 3′  (basa ${START+1}–${START+n} dari ${SEQ.length})`,10,14);
}

/* ---------- B. CRISPR ---------- */
let sites=[],CR={t0:0,playing:false,res:null};
function crisprSites(){
  sites=[];for(let i=20;i+2<SEQ.length;i++)if(SEQ[i+1]==='G'&&SEQ[i+2]==='G')sites.push(i);
  const old=$('cSite').value;
  $('cSite').innerHTML=sites.length?sites.map(i=>`<option value="${i}">Situs PAM ${SEQ.slice(i,i+3)} · posisi ${i+1} · pemandu ${SEQ.slice(i-20,i)}</option>`).join(''):'<option value="">Tidak ada situs NGG yang cocok</option>';
  if(old&&sites.includes(+old))$('cSite').value=old;
  crisprCalc();
}
function crisprCalc(){
  const i=+$('cSite').value;if(!sites.length||isNaN(i)){CR.res=null;$('cOut').innerHTML='<h2>Hasil edit</h2><div class="muted small">Butuh urutan ≥ 24 nt yang memiliki motif NGG di tab pertama.</div>';cDrawStatic();return}
  CR.done=false;CR.playing=false;const cut=i-3,mode=$('cRepair').value;let out,desc;
  if(mode==='del'){out=SEQ.slice(0,cut-1)+SEQ.slice(cut);desc='Delesi 1 nt di sekitar situs potong.'}
  else if(mode==='ins'){out=SEQ.slice(0,cut)+'A'+SEQ.slice(cut);desc='Insersi 1 nt (A) di situs potong.'}
  else{const t=clean($('cTpl').value);if(t.s===null||!t.s){$('cOut').innerHTML=`<h2>Hasil edit</h2><span class="warn">Templat HDR tidak valid.</span>`;CR.res=null;return}out=SEQ.slice(0,cut)+t.s+SEQ.slice(cut);desc=`Templat ${t.s.length} nt disisipkan lewat perbaikan terarah homologi (HDR).`}
  const r=compareProt(SEQ,out);CR.res={i,cut,out,mode,tpl:mode==='hdr'?clean($('cTpl').value).s:''};
  $('cOut').innerHTML=`<h2>Hasil edit</h2><div class="small"><b>Pemandu RNA (20 nt):</b> <span class="mono">${colorSeq(SEQ.slice(i-20,i).replace(/T/g,'U'))}</span><br><b>PAM:</b> <span class="mono">${SEQ.slice(i,i+3)}</span> · <b>potong:</b> 3 nt di hulu PAM (antara basa ${cut} dan ${cut+1})<br>${desc}</div>
   <div class="verdict ${r.c}"><b>Dampak pada protein: ${r.t}</b><div class="small">${r.d}</div></div>
   <div class="note">Dalam praktik, efisiensi bervariasi dan bisa terjadi potongan di tempat lain (off-target). NHEJ bersifat acak sehingga hasilnya tidak bisa diprediksi pasti; HDR jauh lebih jarang terjadi.</div>`;
  cDrawStatic();
}
$('cSite').onchange=crisprCalc;$('cRepair').onchange=crisprCalc;$('cTpl').oninput=crisprCalc;
$('cFiksi').onclick=()=>{$('cRepair').value='hdr';$('cTpl').value='GGAGCAGGAGCAGGTGGAGCAGGAGCA';crisprCalc()};
$('cApply').onclick=()=>{if(!CR.res)return;$('gs').value=CR.res.out;onSeq();document.querySelector('#gseg [data-gp="seq"]').click()};
$('cPlay').onclick=()=>{if(!CR.res)return;CR.t0=performance.now();CR.playing=true;CR.done=false};
function cDrawStatic(){if(!CR.playing)cFrame(0,true)}
function cFrame(t,idle){
  const f=fit($('gCr'));if(!f)return;const{c,W,H}=f;
  if(!CR.res||!SEQ){c.fillStyle=themeColors().muted;c.font='13px system-ui';c.fillText('Belum ada situs target.',20,30);return}
  const{i,cut,out,mode,tpl}=CR.res;const T=themeColors();
  const win=Math.min(40,Math.floor((W-40)/18)),s0=Math.max(0,Math.min(SEQ.length-win,cut-Math.floor(win/2)));
  const cw=(W-40)/win,x0=20,yS=H*.58,yC=yS+30,tx=k=>x0+(k-s0)*cw+cw/2;
  const stage=idle?-1:t<1.6?0:t<3.2?1:t<4.4?2:t<7?3:4;
  $('cStage').textContent=['','Cas9 + RNA pemandu mencari situs','Cas9 membuka heliks dan mencocokkan pemandu','Cas9 memotong kedua untai (DSB)','Sel memperbaiki potongan','Selesai'][stage+1]||'';
  const unw=stage>=1&&stage<4?10:0;
  // pemandu & Cas9
  const gx0=tx(i-20)-cw/2,gx1=tx(i+2)+cw/2;let cx=(gx0+gx1)/2;
  if(stage===0)cx=-160+(cx+160)*Math.min(1,t/1.6);
  if(stage>=0&&stage<4){
    c.fillStyle='color-mix(in srgb,'+cssv('--accent')+' 16%,'+cssv('--canvas')+')';c.strokeStyle=cssv('--accent');c.lineWidth=2;
    const bw=Math.max(140,gx1-gx0),bh=84;c.beginPath();c.roundRect(cx-bw/2,yS-34-bh-unw,bw,bh,22);c.fill();c.stroke();
    c.fillStyle=cssv('--accent');c.font='600 15px system-ui';c.textAlign='center';c.fillText('Cas9',cx,yS-34-bh/2-unw+5);
  }
  // untai
  const gap=stage===2?18:stage===3?Math.max(0,18-(t-4.4)*10):0;
  const cur=stage>=3&&t>5.2?out:SEQ;const sShift=stage>=3&&t>5.2?(mode==='del'?-1:mode==='ins'?1:tpl.length):0;
  for(let k=0;k<win;k++){
    const idx=s0+k;const inUnw=stage>=1&&stage<4&&idx>=i-20&&idx<i+3;const ox=idx>=cut?gap/2:-gap/2,dy=inUnw?unw*.6:0;
    const b=SEQ[idx];let x=tx(idx)+(stage<=2?ox:0);
    c.font='600 13px ui-monospace,Menlo,Consolas,monospace';c.textAlign='center';
    const show=(stage>=3&&t>5.2)?null:b;
    if(show){c.fillStyle=NCOL[b];c.fillText(b,x,yS-dy);c.fillStyle=NCOL[comp(b)];c.fillText(comp(b),x,yC+dy);
      c.strokeStyle=T.muted;c.globalAlpha=.4;c.lineWidth=1;c.beginPath();c.moveTo(x,yS+4-dy);c.lineTo(x,yC-12+dy);c.stroke();c.globalAlpha=1}
  }
  if(stage>=3&&t>5.2){ // tampilkan hasil
    const o=out,os=s0,newWin=Math.min(o.length-os,win+Math.max(0,sShift));const w2=(W-40)/Math.max(win,newWin);
    const hdrFrom=cut,hdrTo=cut+(mode==='hdr'?tpl.length:0);
    for(let k=0;k<newWin;k++){const idx=os+k;const b=o[idx];const x=20+k*w2+w2/2;const isNew=(mode==='hdr'&&idx>=hdrFrom&&idx<hdrTo)||(mode==='ins'&&idx===cut);
      c.font='600 13px ui-monospace,Menlo,Consolas,monospace';c.textAlign='center';
      if(isNew){c.fillStyle='color-mix(in srgb,'+cssv('--ok')+' 22%,transparent)';c.fillRect(x-w2/2,yS-16,w2,yC-yS+26)}
      c.fillStyle=NCOL[b];c.fillText(b,x,yS);c.fillStyle=NCOL[comp(b)];c.fillText(comp(b),x,yC)}
    c.fillStyle=cssv('--ok');c.font='600 13px system-ui';c.textAlign='left';
    c.fillText(mode==='hdr'?'Templat tersisip (hijau)':mode==='ins'?'Basa tersisip (hijau)':'1 basa hilang di situs potong',20,H-18);
  }
  // PAM & pemandu label
  if(stage<3||t<=5.2){c.fillStyle=T.muted;c.font='11px system-ui';c.textAlign='center';c.fillText('PAM',tx(i+1),yC+36);c.fillText('situs target 20 nt',(tx(i-20)+tx(i-1))/2,yC+36)}
  // RNA pemandu (oranye) menempel di untai bawah
  if(stage>=1&&stage<4){c.font='600 11px ui-monospace,Menlo,Consolas,monospace';c.fillStyle='#d9731a';c.textAlign='center';
    for(let k=0;k<20;k++){const idx=i-20+k;if(idx<s0||idx>=s0+win)continue;c.fillText(SEQ[idx].replace('T','U'),tx(idx),yC+14+unw*.6)}}
  // gunting / potongan
  if(stage===2){const x=tx(cut-1)+cw/2;const a=.5+.5*Math.sin(t*14);c.strokeStyle=`rgba(220,50,50,${.5+a*.5})`;c.lineWidth=3;c.setLineDash([5,4]);c.beginPath();c.moveTo(x,yS-22);c.lineTo(x,yC+14);c.stroke();c.setLineDash([]);
    c.fillStyle='#d23c3c';c.font='600 12px system-ui';c.textAlign='center';c.fillText('potong',x,yS-28)}
}
/* ---------- C. Sel & obat ---------- */
let SIM=null,rec=null,recChunks=[];
const P={mw:180,lp:1.2,tp:63,hd:1,ha:4};
const sl=(id,key,fmt)=>{$(id).oninput=()=>{if(key)P[key]=+$(id).value;$(id+'v').textContent=fmt?fmt(+$(id).value):$(id).value;simClear()}};
sl('pMW','mw');sl('pLP','lp');sl('pTP','tp');sl('pHD','hd');sl('pHA','ha');sl('pKd',null,x=>x.toFixed(1));sl('pSel',null,x=>x+'×');sl('pDo',null,x=>x+' µM');
['pMW','pLP','pTP','pHD','pHA','pKd','pSel','pDo'].forEach(id=>$(id).dispatchEvent(new Event('input')));
$('pType').onchange=simClear;
function setP(o,src){
  const m={pMW:o.mw,pLP:o.lp,pTP:o.tp,pHD:o.hd,pHA:o.ha};
  for(const id in m){if(m[id]!==undefined&&!isNaN(m[id])){$(id).value=m[id];$(id).dispatchEvent(new Event('input'))}}
  $('sSrc').textContent='Sumber: '+src;
}
$('sJ').onclick=()=>{const p=(typeof jProps!=='undefined'&&jProps||[]).find(x=>x.CID===jSel);
  if(!p){$('sSrc').textContent='Belum ada senyawa di tab Jelajah. Cari dulu satu senyawa.';return}
  setP({mw:+p.MolecularWeight,lp:p.XLogP!==undefined?+p.XLogP:1,tp:p.TPSA!==undefined?+p.TPSA:60,hd:p.HBondDonorCount,ha:p.HBondAcceptorCount},`${p.Title||('CID '+p.CID)} (PubChem)`+(p.XLogP===undefined?' · XLogP tidak tersedia, diisi 1':''))};
$('sE').onclick=()=>{
  const info=eAnalyze();if(!info.length){$('sSrc').textContent='Editor masih kosong. Rakit molekul dulu.';return}
  const h=eHill(info);let mw=0;for(const k in h.c)mw+=BY[k].mass*h.c[k];
  const nC=h.c.C||0,hal=(h.c.F||0)+(h.c.Cl||0)+(h.c.Br||0)+(h.c.I||0);
  let tp=0,pol=0,hd=0,ha=0;info.forEach(x=>{if(x.a.el==='O'){tp+=x.h?20.2:17.1;ha++;if(x.h)hd++;pol++}if(x.a.el==='N'){tp+=x.h?26:12.9;ha++;if(x.h)hd++;pol++}});
  const lp=Math.max(-4,Math.min(8,.5*nC+.35*hal-.9*pol-.3*(h.ch?Math.abs(h.ch):0)));
  setP({mw:Math.round(mw),lp:Math.round(lp*10)/10,tp:Math.round(tp),hd,ha},'rancangan di Editor · logP dan TPSA perkiraan kasar')};
function permeability(){
  const w=[];let s=.92;
  if(P.mw>500){s*=Math.pow(.5,(P.mw-500)/150);w.push(`massa molekul ${P.mw} > 500`)}
  if(P.lp<0){s*=Math.pow(.5,-P.lp);w.push(`logP ${P.lp} terlalu hidrofil`)}
  if(P.lp>5){s*=Math.pow(.6,P.lp-5);w.push(`logP ${P.lp} terlalu lipofil`)}
  if(P.tp>140){s*=Math.pow(.5,(P.tp-140)/40);w.push(`TPSA ${P.tp} > 140`)}
  if(P.hd>5){s*=Math.pow(.5,P.hd-5);w.push(`donor H ${P.hd} > 5`)}
  if(P.ha>10){s*=Math.pow(.6,P.ha-10);w.push(`akseptor H ${P.ha} > 10`)}
  return{p:Math.max(.01,Math.min(.95,s)),why:w};
}
function simClear(){SIM=null;$('sVerdict').style.display='none';$('sStat').textContent='';cellFrame(0,true)}
function simStart(){
  const pm=permeability(),dose=+$('pDo').value,kd=Math.pow(10,6-(+$('pKd').value)),sel=+$('pSel').value,type=$('pType').value;
  const rng=mulberry(Math.round(P.mw*7+P.lp*13+P.tp*3+dose*100+(+$('pKd').value)*50));
  const N=Math.round(Math.max(30,Math.min(150,30+Math.log10(dose*100+1)*40)));
  const sites=14;
  SIM={t0:performance.now(),pm,dose,kd,sel,type,rng,N,sites,parts:[],entered:0,done:false,res:null};
  for(let k=0;k<N;k++)SIM.parts.push({x:-20-rng()*160,y:.15+rng()*.7,vx:.5+rng()*.8,ph:rng()*6,enter:rng()<pm.p,st:0,tgt:Math.floor(rng()*sites),off:false});
  // setelah masuk: konsentrasi intrasel ~ dosis * fraksi masuk
  const cin=dose*pm.p,occ=cin/(cin+kd),offOcc=cin/(cin+kd*sel);
  let nb=Math.round(occ*sites);const offN=Math.round(offOcc*6);
  let k2=0;SIM.parts.forEach(p=>{if(p.enter){if(k2<nb){p.st=1;p.tgt=k2++}else if(k2-nb<offN&&SIM.parts.filter(q=>q.off).length<offN){p.off=true}}});
  SIM.occ=occ;SIM.offOcc=offOcc;SIM.cin=cin;SIM.nb=nb;SIM.offN=offN;
  const viab=Math.max(0,1-Math.max(0,offOcc-.15)*1.6-(dose>50?.3:0));
  let kind,title,msg;
  if(pm.p<.12){kind='bad';title='Gagal: obat hampir tidak masuk ke sel';msg='Permeabilitas membran rendah. '+(pm.why.join('; ')||'')+'. Obat perlu dirancang ulang (lebih kecil, kurang polar) atau diberikan lewat pembawa khusus.'}
  else if(offOcc>.4||viab<.5){kind='bad';title='Gagal: toksik, banyak sel mati';msg=`Obat ikut menempel pada protein lain (okupansi off-target ${(offOcc*100).toFixed(0)}%). Selektivitas perlu ditingkatkan atau dosis diturunkan.`}
  else if(occ<.5){kind='mid';title='Gagal: target kurang terikat';msg=`Hanya ${(occ*100).toFixed(0)}% target terikat. Naikkan afinitas (pKd) atau dosis, atau perbaiki masuknya obat ke sel.`}
  else{kind='ok';title='Berhasil (pada model mainan ini)';msg={rec:'Reseptor terhambat, sinyal ke dalam sel menurun.',enz:'Aktivitas enzim target turun, produk metabolit menurun.',vir:'Protease virus terhambat, perakitan virus baru dalam sel terganggu.'}[type]+` Okupansi target ${(occ*100).toFixed(0)}%, sel yang bertahan ${(viab*100).toFixed(0)}%.`}
  SIM.res={kind,title,msg,viab};
}
$('sRun').onclick=()=>{simStart()};
$('sRec').onclick=()=>{
  if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){$('sStat').textContent='Browser ini belum mendukung perekaman video. Coba Chrome/Edge, atau gunakan rekam layar bawaan HP.';return}
  const cv=$('gCell');simStart();recChunks=[];
  try{const stream=cv.captureStream(30);
    const types=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4;codecs=avc1','video/mp4'];
    const mt=types.find(t=>MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported(t))||'';
    const ext=mt.indexOf('mp4')>=0?'mp4':'webm';
    rec=mt?new MediaRecorder(stream,{mimeType:mt}):new MediaRecorder(stream);
    rec.ondataavailable=e=>{if(e.data.size)recChunks.push(e.data)};
    rec.onstop=()=>{const url=URL.createObjectURL(new Blob(recChunks,{type:ext==='mp4'?'video/mp4':'video/webm'}));const a=$('sDl');a.href=url;a.download='simulasi-silvialab.'+ext;a.style.display='';$('sStat').textContent='Video siap diunduh.'};
    rec.start();$('sStat').textContent='Merekam…';$('sDl').style.display='none'}catch(e){$('sStat').textContent='Gagal merekam: '+e.message}
};
function cellFrame(t,idle){
  const f=fit($('gCell'));if(!f)return;const{c,W,H}=f;const T=themeColors();
  const cx=W*.62,cy=H/2,R=Math.min(H*.36,W*.22);
  const res=SIM&&SIM.res,end=SIM&&t>9;
  const dead=res&&end&&(res.kind==='bad'&&res.viab<.5);
  c.fillStyle=cssv('--canvas');c.fillRect(0,0,W,H);
  // cairan luar
  c.fillStyle=T.muted;c.globalAlpha=.06;for(let k=0;k<60;k++){c.beginPath();c.arc((k*97)%W,(k*53)%H,10+(k%5)*4,0,7);c.fill()}c.globalAlpha=1;
  // sel
  const shrink=dead?Math.min(.18,(t-9)*.1):0,rr=R*(1-shrink);
  const body=dead?'#c9867a':'#8cc9a1';
  c.fillStyle=`color-mix(in srgb,${body} 28%,${cssv('--canvas')})`;c.strokeStyle=dead?'#b4443a':'#3f8f5e';c.lineWidth=7;
  c.beginPath();
  if(dead){for(let a=0;a<=Math.PI*2+.01;a+=.12){const r=rr*(1+.05*Math.sin(a*9+t*3));const x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);a===0?c.moveTo(x,y):c.lineTo(x,y)}c.closePath()}else c.arc(cx,cy,rr,0,7);
  c.fill();c.stroke();
  // inti & organel
  c.fillStyle=`color-mix(in srgb,#6b7fd6 35%,${cssv('--canvas')})`;c.strokeStyle='#4a5db8';c.lineWidth=2;c.beginPath();c.arc(cx+rr*.05,cy,rr*.32,0,7);c.fill();c.stroke();
  c.fillStyle='#4a5db8';c.font='11px system-ui';c.textAlign='center';c.fillText('inti',cx+rr*.05,cy+4);
  const mito=[[.55,-.4],[-.5,.5],[.1,.68]];c.strokeStyle='#c98a1a';c.fillStyle='color-mix(in srgb,#e6a93a 30%,'+cssv('--canvas')+')';c.lineWidth=1.5;
  mito.forEach(m=>{c.beginPath();c.ellipse(cx+m[0]*rr,cy+m[1]*rr,rr*.13,rr*.07,.5,0,7);c.fill();c.stroke()});
  // reseptor di membran
  const S=SIM?SIM.sites:14;
  for(let k=0;k<S;k++){const a=Math.PI*.5+k*(Math.PI*2/S)+.2;const bx=cx+(rr+3)*Math.cos(a),by=cy+(rr+3)*Math.sin(a);
    const bound=SIM&&SIM.type==='rec'&&k<SIM.nb&&t>5.5;
    c.strokeStyle=bound?'#d23c3c':'#3f6fd6';c.lineWidth=3;c.beginPath();c.moveTo(bx,by);c.lineTo(cx+(rr+15)*Math.cos(a),cy+(rr+15)*Math.sin(a));c.stroke();
    c.fillStyle=c.strokeStyle;c.beginPath();c.arc(cx+(rr+17)*Math.cos(a),cy+(rr+17)*Math.sin(a),4,0,7);c.fill()}
  if(!SIM){c.fillStyle=T.muted;c.font='13px system-ui';c.textAlign='left';c.fillText('Atur sifat obat lalu tekan "Jalankan simulasi".',16,26);
    c.font='12px system-ui';c.fillText('Titik biru di tepi sel: reseptor target. Partikel oranye: molekul obat.',16,46);return}
  // partikel
  const ph=Math.min(t,9);let enteredNow=0,boundNow=0,offNow=0;
  SIM.parts.forEach(p=>{
    const px0=(p.x+t*p.vx*70);let x=px0,y=p.y*H+Math.sin(t*2+p.ph)*8;
    const edge=cx-rr-8;
    if(!p.enter){x=Math.min(x,edge-(p.ph%5)*9);y=p.y*H+Math.sin(t*2+p.ph)*8}
    else{
      if(x>edge){ // dalam sel: tuju sasaran
        const prog=Math.min(1,(x-edge)/180);let tx2,ty2;
        if(p.st===1){const a=Math.PI*.5+p.tgt*(Math.PI*2/S)+.2;
          if(SIM.type==='rec'){tx2=cx+(rr-10)*Math.cos(a);ty2=cy+(rr-10)*Math.sin(a)}
          else{tx2=cx+rr*.05+rr*.42*Math.cos(a);ty2=cy+rr*.42*Math.sin(a)}}
        else if(p.off){tx2=cx+mito[p.tgt%3][0]*rr;ty2=cy+mito[p.tgt%3][1]*rr}
        else{tx2=cx+Math.cos(p.ph*3+t)*rr*.5;ty2=cy+Math.sin(p.ph*2+t*.8)*rr*.55}
        const sx=edge,sy=p.y*H;x=sx+(tx2-sx)*prog;y=sy+(ty2-sy)*prog+(prog<1?0:Math.sin(t*6+p.ph)*(p.st===1||p.off?1:6));
        enteredNow++;if(p.st===1&&prog>=1)boundNow++;if(p.off&&prog>=1)offNow++;
      }
    }
    c.fillStyle=p.off&&x>edge?'#c0392b':'#f08a24';c.beginPath();c.arc(x,y,4.5,0,7);c.fill();
    if(p.st===1&&x>edge&&Math.min(1,(x-edge)/180)>=1){c.strokeStyle='#d23c3c';c.lineWidth=1.5;c.beginPath();c.arc(x,y,8,0,7);c.stroke()}
  });
  // keterangan
  c.fillStyle=cssv('--text');c.font='600 12px system-ui';c.textAlign='left';
  const st=t<5?'Obat mendekati dan mencoba menembus membran':t<8?'Obat mencari dan mengikat target':'Hasil';
  c.fillText(st,16,24);
  c.fillStyle=T.muted;c.font='12px system-ui';c.fillText(`masuk sel: ${enteredNow}/${SIM.N} · terikat target: ${boundNow} · menempel di protein lain: ${offNow}`,16,44);
  if(t>9&&!SIM.done){SIM.done=true;const r=SIM.res;const col={ok:'ok',bad:'bad',mid:'mid'}[r.kind];
    $('sVerdict').className='verdict '+col;$('sVerdict').style.display='';
    $('sVerdict').innerHTML=`<b>${r.title}</b><div class="small">${esc(r.msg)}</div>
      <div class="row mt" style="gap:18px;align-items:flex-start"><div style="flex:1;min-width:120px"><span class="small muted">Masuk sel</span> <b>${(SIM.entered=SIM.parts.filter(p=>p.enter).length/SIM.N*100).toFixed(0)}%</b><div class="meter"><i style="width:${SIM.entered}%"></i></div></div>
      <div style="flex:1;min-width:120px"><span class="small muted">Target terikat</span> <b>${(SIM.occ*100).toFixed(0)}%</b><div class="meter"><i style="width:${SIM.occ*100}%"></i></div></div>
      <div style="flex:1;min-width:120px"><span class="small muted">Off-target</span> <b>${(SIM.offOcc*100).toFixed(0)}%</b><div class="meter"><i style="width:${SIM.offOcc*100}%;background:var(--danger)"></i></div></div>
      <div style="flex:1;min-width:120px"><span class="small muted">Sel bertahan</span> <b>${(r.viab*100).toFixed(0)}%</b><div class="meter"><i style="width:${r.viab*100}%;background:var(--ok)"></i></div></div></div>
      <div class="note">Model mainan: hanya memakai aturan sederhana (ukuran, polaritas, afinitas, dosis). Tidak memperhitungkan metabolisme, distribusi dalam tubuh, interaksi obat, atau respons imun, dan tidak dapat dipakai untuk memutuskan penggunaan pada manusia atau hewan.</div>`;
    if(rec&&rec.state==='recording'){setTimeout(()=>{try{rec.stop()}catch(e){}},700)}}
  if(res&&t>9.2){c.fillStyle=res.kind==='ok'?cssv('--ok'):cssv('--danger');c.font='700 15px system-ui';c.textAlign='center';c.fillText(res.title,W/2,H-16)}
}
/* ---------- loop ---------- */
function loop(){
  const act=document.querySelector('.view.on');
  if(act&&act.id==='v-gen'){
    const pane=document.querySelector('.gpane.on').id;
    if(pane==='g-seq')drawHelix();
    else if(pane==='g-crispr'){if(CR.playing){const t=(performance.now()-CR.t0)/1000;cFrame(Math.min(t,7.5));if(t>7.5){CR.playing=false;CR.done=true}}else if(CR.done)cFrame(7.5);else cFrame(0,true)}
    else if(pane==='g-cell'){SIM?cellFrame(Math.min(12,(performance.now()-SIM.t0)/1000)):cellFrame(0,true)}
  }
  requestAnimationFrame(loop);
}
$('gs').value=EX;onSeq();requestAnimationFrame(loop);
})();
