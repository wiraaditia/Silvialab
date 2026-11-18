/* ================= DATA UNSUR ================= */
const RAW=`H|Hidrogen|1.008|2.20
He|Helium|4.0026|0
Li|Litium|6.94|0.98
Be|Berilium|9.0122|1.57
B|Boron|10.81|2.04
C|Karbon|12.011|2.55
N|Nitrogen|14.007|3.04
O|Oksigen|15.999|3.44
F|Fluor|18.998|3.98
Ne|Neon|20.180|0
Na|Natrium|22.990|0.93
Mg|Magnesium|24.305|1.31
Al|Aluminium|26.982|1.61
Si|Silikon|28.085|1.90
P|Fosfor|30.974|2.19
S|Belerang|32.06|2.58
Cl|Klor|35.45|3.16
Ar|Argon|39.948|0
K|Kalium|39.098|0.82
Ca|Kalsium|40.078|1.00
Sc|Skandium|44.956|1.36
Ti|Titanium|47.867|1.54
V|Vanadium|50.942|1.63
Cr|Kromium|51.996|1.66
Mn|Mangan|54.938|1.55
Fe|Besi|55.845|1.83
Co|Kobalt|58.933|1.88
Ni|Nikel|58.693|1.91
Cu|Tembaga|63.546|1.90
Zn|Seng|65.38|1.65
Ga|Galium|69.723|1.81
Ge|Germanium|72.630|2.01
As|Arsen|74.922|2.18
Se|Selenium|78.971|2.55
Br|Brom|79.904|2.96
Kr|Kripton|83.798|3.00
Rb|Rubidium|85.468|0.82
Sr|Stronsium|87.62|0.95
Y|Itrium|88.906|1.22
Zr|Zirkonium|91.224|1.33
Nb|Niobium|92.906|1.6
Mo|Molibdenum|95.95|2.16
Tc|Teknesium|98|1.9
Ru|Rutenium|101.07|2.2
Rh|Rodium|102.91|2.28
Pd|Paladium|106.42|2.20
Ag|Perak|107.87|1.93
Cd|Kadmium|112.41|1.69
In|Indium|114.82|1.78
Sn|Timah|118.71|1.96
Sb|Antimon|121.76|2.05
Te|Telurium|127.60|2.1
I|Iodin|126.90|2.66
Xe|Xenon|131.29|2.6
Cs|Sesium|132.91|0.79
Ba|Barium|137.33|0.89
La|Lantanum|138.91|1.10
Ce|Serium|140.12|1.12
Pr|Praseodimium|140.91|1.13
Nd|Neodimium|144.24|1.14
Pm|Prometium|145|1.13
Sm|Samarium|150.36|1.17
Eu|Europium|151.96|1.2
Gd|Gadolinium|157.25|1.2
Tb|Terbium|158.93|1.1
Dy|Disprosium|162.50|1.22
Ho|Holmium|164.93|1.23
Er|Erbium|167.26|1.24
Tm|Tulium|168.93|1.25
Yb|Iterbium|173.05|1.1
Lu|Lutesium|174.97|1.27
Hf|Hafnium|178.49|1.3
Ta|Tantalum|180.95|1.5
W|Wolfram|183.84|2.36
Re|Renium|186.21|1.9
Os|Osmium|190.23|2.2
Ir|Iridium|192.22|2.20
Pt|Platina|195.08|2.28
Au|Emas|196.97|2.54
Hg|Raksa|200.59|2.00
Tl|Talium|204.38|1.62
Pb|Timbal|207.2|2.33
Bi|Bismut|208.98|2.02
Po|Polonium|209|2.0
At|Astatin|210|2.2
Rn|Radon|222|0
Fr|Fransium|223|0.7
Ra|Radium|226|0.9
Ac|Aktinium|227|1.1
Th|Torium|232.04|1.3
Pa|Protaktinium|231.04|1.5
U|Uranium|238.03|1.38
Np|Neptunium|237|1.36
Pu|Plutonium|244|1.28
Am|Amerisium|243|1.3
Cm|Kurium|247|1.3
Bk|Berkelium|247|1.3
Cf|Kalifornium|251|1.3
Es|Einsteinium|252|1.3
Fm|Fermium|257|1.3
Md|Mendelevium|258|1.3
No|Nobelium|259|1.3
Lr|Lawrensium|266|1.3
Rf|Rutherfordium|267|0
Db|Dubnium|268|0
Sg|Seaborgium|269|0
Bh|Bohrium|270|0
Hs|Hasium|277|0
Mt|Meitnerium|278|0
Ds|Darmstadtium|281|0
Rg|Roentgenium|282|0
Cn|Kopernisium|285|0
Nh|Nihonium|286|0
Fl|Flerovium|289|0
Mc|Moskovium|290|0
Lv|Livermorium|293|0
Ts|Tenesin|294|0
Og|Oganeson|294|0`;
const CATS={
  alkali:{n:'Logam alkali',c:'#ff7b72',z:[3,11,19,37,55,87]},
  alkaline:{n:'Alkali tanah',c:'#ffa657',z:[4,12,20,38,56,88]},
  halogen:{n:'Halogen',c:'#56d4dd',z:[9,17,35,53,85,117]},
  noble:{n:'Gas mulia',c:'#a78bfa',z:[2,10,18,36,54,86,118]},
  metalloid:{n:'Metaloid',c:'#e3d26f',z:[5,14,32,33,51,52,84]},
  post:{n:'Logam pasca-transisi',c:'#9fb0c8',z:[13,31,49,50,81,82,83,113,114,115,116]},
  nonmetal:{n:'Nonlogam',c:'#7ee787',z:[1,6,7,8,15,16,34]},
  lanth:{n:'Lantanida',c:'#f78fb3',z:[...Array(15).keys()].map(i=>57+i)},
  actin:{n:'Aktinida',c:'#d6a4ff',z:[...Array(15).keys()].map(i=>89+i)},
  trans:{n:'Logam transisi',c:'#79c0ff',z:[]}
};
function catOf(z){for(const k in CATS){if(CATS[k].z.includes(z))return k}return 'trans'}
function place(z){
  if(z===1)return{r:1,c:1};if(z===2)return{r:1,c:18};
  if(z<=10)return{r:2,c:z<=4?z-2:z+8};
  if(z<=18)return{r:3,c:z<=12?z-10:z};
  if(z<=36)return{r:4,c:z-18};
  if(z<=54)return{r:5,c:z-36};
  if(z<=56)return{r:6,c:z-54};
  if(z===57)return{r:6,c:3};
  if(z<=71)return{r:9,c:z-58+3};
  if(z<=86)return{r:6,c:z-72+4};
  if(z<=88)return{r:7,c:z-86};
  if(z===89)return{r:7,c:3};
  if(z<=103)return{r:10,c:z-90+3};
  return{r:7,c:z-104+4};
}
const EL=RAW.split('\n').map((l,i)=>{const p=l.split('|');const z=i+1;const pos=place(z);
  let ve=null;if(z===2)ve=2;else if(pos.r<=7&&pos.c!==3||z===1){ if(pos.c===1)ve=1;else if(pos.c===2)ve=2;else if(pos.c>=13)ve=pos.c-10;}
  return{z,sym:p[0],name:p[1],mass:parseFloat(p[2]),en:parseFloat(p[3]),cat:catOf(z),r:pos.r,c:pos.c,ve}});
const BY={};EL.forEach(e=>BY[e.sym]=e);
const COV={H:.31,B:.84,C:.76,N:.71,O:.66,F:.57,Si:1.11,P:1.07,S:1.05,Cl:1.02,Br:1.2,I:1.39,Li:1.28,Na:1.66,K:2.03,Mg:1.41,Ca:1.76,Al:1.21,Fe:1.32,Cu:1.32,Zn:1.22,Ag:1.45,Au:1.36,Ba:2.15,Pb:1.46,Mn:1.39,Cr:1.39,Ti:1.6,Hg:1.32,Sn:1.39,Ni:1.24,Co:1.26,As:1.19,Se:1.2,He:.28,Ne:.58,Ar:1.06};
const VDW={H:1.2,C:1.7,N:1.55,O:1.52,F:1.47,Cl:1.75,Br:1.85,I:1.98,S:1.8,P:1.8,B:1.9,Si:2.1,Na:2.27,K:2.75,Li:1.82,Mg:1.73,Ca:2.31,Al:1.84,Fe:2.0,Cu:1.4,Zn:1.39,Ag:1.72,Au:1.66,Ba:2.68,Pb:2.02,Mn:2.0,Cr:2.0,Ti:2.1,Hg:1.55,He:1.4,Ne:1.54,Ar:1.88};
const CPK={H:'#ffffff',C:'#8a8f98',N:'#3050f8',O:'#ff2d2d',F:'#90e050',Cl:'#1ff01f',Br:'#a62929',I:'#940094',S:'#e8d630',P:'#ff8000',B:'#ffb5b5',Si:'#f0c8a0',Na:'#ab5cf2',K:'#8f40d4',Ca:'#3dff00',Mg:'#8aff00',Fe:'#e06633',Cu:'#c88033',Zn:'#7d80b0',Al:'#bfa6a6',Li:'#cc80ff',Ag:'#c0c0c0',Au:'#ffd123',Hg:'#b8b8d0',Pb:'#575961',Ba:'#00c900',Mn:'#9c7ac7',Cr:'#8a99c7',Ti:'#bfc2c7',He:'#d9ffff',Ne:'#b3e3f5',Ar:'#80d1e3'};
const cpk=s=>CPK[s]||CATS[BY[s].cat].c;
const rcov=s=>COV[s]||1.4, vdw=s=>VDW[s]||2.0;

/* ================= DATABASE SENYAWA =================
   [rumus tampilan, nama Indonesia, nama IUPAC/Inggris, SMILES, wujud (g/l/s), kegunaan] */
const DBRAW=[
// unsur molekuler
["H2","Gas hidrogen","Dihydrogen","[H][H]","g","Bahan bakar roket & sel bahan bakar, sintesis amonia."],
["O2","Gas oksigen","Dioxygen","O=O","g","Pernapasan, pembakaran, terapi oksigen medis."],
["N2","Gas nitrogen","Dinitrogen","N#N","g","±78% udara; bahan pupuk, pengawet makanan, nitrogen cair."],
["F2","Gas fluor","Difluorine","FF","g","Oksidator paling reaktif; industri fluorokarbon."],
["Cl2","Gas klor","Dichlorine","ClCl","g","Disinfeksi air, pemutih, industri PVC."],
["Br2","Brom","Dibromine","BrBr","l","Cairan cokelat-merah; sintesis senyawa brom."],
["I2","Iodin","Diiodine","II","s","Antiseptik (tingtur iodin, povidon-iodin)."],
["O3","Ozon","Trioxygen (ozone)","[O-][O+]=O","g","Lapisan ozon menyerap UV; pengolahan air."],
["P4","Fosfor putih","Tetraphosphorus","P12P3P1P23","s","Bentuk fosfor yang sangat reaktif; bahan pupuk & fosfat."],
["S8","Belerang (S₈)","Octasulfur (cyclo-S8)","S1SSSSSSS1","s","Vulkanisasi karet, asam sulfat, obat kulit."],
// anorganik kovalen
["H2O","Air","Water (oxidane)","O","l","Pelarut universal, kebutuhan semua makhluk hidup."],
["H2O2","Hidrogen peroksida","Hydrogen peroxide","OO","l","Antiseptik luka, pemutih, oksidator."],
["NH3","Amonia","Ammonia (azane)","N","g","Pupuk, pembersih rumah tangga, bahan baku nitrat."],
["N2H4","Hidrazina","Hydrazine","NN","l","Bahan bakar roket."],
["HCl","Asam klorida","Hydrogen chloride","Cl","g","Asam lambung (encer), pembersih logam, industri."],
["HF","Asam fluorida","Hydrogen fluoride","F","g","Etsa kaca, pembuatan fluorokarbon. Sangat korosif."],
["HBr","Asam bromida","Hydrogen bromide","Br","g","Sintesis senyawa brom."],
["HI","Asam iodida","Hydrogen iodide","I","g","Reduktor dalam sintesis."],
["H2S","Hidrogen sulfida","Hydrogen sulfide (sulfane)","S","g","Berbau telur busuk; beracun."],
["H2SO4","Asam sulfat","Sulfuric acid","OS(=O)(=O)O","l","Aki mobil, pupuk, bahan kimia industri terbesar."],
["H2SO3","Asam sulfit","Sulfurous acid","OS(O)=O","l","Pengawet (sulfit), pemutih kertas."],
["HNO3","Asam nitrat","Nitric acid","O[N+](=O)[O-]","l","Pupuk, bahan peledak, etsa logam."],
["HNO2","Asam nitrit","Nitrous acid","ON=O","l","Zat antara; garam nitrit untuk pengawet daging."],
["H3PO4","Asam fosfat","Phosphoric acid","OP(=O)(O)O","s","Minuman bersoda, pupuk, penghilang karat."],
["H2CO3","Asam karbonat","Carbonic acid","OC(O)=O","l","Pada minuman berkarbonasi; penyangga pH darah."],
["HClO","Asam hipoklorit","Hypochlorous acid","OCl","l","Disinfektan, antiseptik."],
["HClO4","Asam perklorat","Perchloric acid","OCl(=O)(=O)=O","l","Asam kuat; propelan roket (garam perklorat)."],
["HCN","Hidrogen sianida","Hydrogen cyanide","C#N","g","Sangat beracun; sintesis industri."],
["H3BO3","Asam borat","Boric acid","OB(O)O","s","Antiseptik ringan, pencuci mata encer, insektisida."],
["CO","Karbon monoksida","Carbon monoxide","[C-]#[O+]","g","Gas beracun dari pembakaran tidak sempurna."],
["CO2","Karbon dioksida","Carbon dioxide","O=C=O","g","Fotosintesis, soda, es kering, pemadam api; gas rumah kaca."],
["SO2","Belerang dioksida","Sulfur dioxide","O=S=O","g","Pengawet, bahan asam sulfat; penyebab hujan asam."],
["SO3","Belerang trioksida","Sulfur trioxide","O=S(=O)=O","l","Antara pembuatan asam sulfat."],
["NO","Nitrogen monoksida","Nitric oxide","[N]=O","g","Molekul pensinyalan biologis; polutan udara."],
["NO2","Nitrogen dioksida","Nitrogen dioxide","[O-][N+]=O","g","Gas cokelat kemerahan; polutan udara."],
["N2O","Dinitrogen monoksida","Nitrous oxide","[N-]=[N+]=O","g","Gas tertawa; anestesi ringan."],
["N2O4","Dinitrogen tetroksida","Dinitrogen tetroxide","O=[N+]([O-])[N+](=O)[O-]","l","Oksidator bahan bakar roket."],
["SiH4","Silana","Silane","[SiH4]","g","Industri semikonduktor."],
["SiO2","Silikon dioksida (silika)","Silicon dioxide","O=[Si]=O","s","Pasir, kaca, kuarsa (di alam berupa jaringan kovalen raksasa)."],
["PH3","Fosfina","Phosphane (phosphine)","P","g","Fumigan; sangat beracun."],
["PCl3","Fosfor triklorida","Phosphorus trichloride","ClP(Cl)Cl","l","Bahan sintesis organofosfat."],
["PCl5","Fosfor pentaklorida","Phosphorus pentachloride","ClP(Cl)(Cl)(Cl)Cl","s","Pereaksi klorinasi."],
["SF6","Belerang heksafluorida","Sulfur hexafluoride","FS(F)(F)(F)(F)F","g","Isolator listrik tegangan tinggi."],
["CS2","Karbon disulfida","Carbon disulfide","S=C=S","l","Pelarut, industri serat rayon."],
["COCl2","Fosgen","Carbonyl dichloride (phosgene)","ClC(Cl)=O","g","Sintesis plastik polikarbonat; sangat beracun."],
["BF3","Boron trifluorida","Boron trifluoride","FB(F)F","g","Katalis di industri organik."],
["Cl2O","Diklorin monoksida","Dichlorine monoxide","ClOCl","g","Pengoksidasi, disinfeksi."],
["OF2","Oksigen difluorida","Oxygen difluoride","FOF","g","Oksidator kuat."],
["NF3","Nitrogen trifluorida","Nitrogen trifluoride","FN(F)F","g","Pembersih di industri semikonduktor."],
["NCl3","Nitrogen triklorida","Nitrogen trichloride","ClN(Cl)Cl","l","Tidak stabil, mudah meledak."],
// organik
["CH4","Metana","Methane","C","g","Komponen utama gas alam; bahan bakar."],
["C2H6","Etana","Ethane","CC","g","Komponen gas alam; bahan baku etena."],
["C3H8","Propana","Propane","CCC","g","Komponen LPG."],
["C4H10","Butana","Butane","CCCC","g","LPG, korek api gas."],
["C4H10","Isobutana","2-Methylpropane (isobutane)","CC(C)C","g","Refrigeran, propelan aerosol."],
["C5H12","Pentana","Pentane","CCCCC","l","Pelarut, komponen bensin."],
["C6H14","Heksana","Hexane","CCCCCC","l","Pelarut ekstraksi minyak."],
["C8H18","Oktana","Octane","CCCCCCCC","l","Acuan nilai oktan bensin."],
["C2H4","Etena (etilena)","Ethene (ethylene)","C=C","g","Bahan plastik polietilena; hormon pematang buah."],
["C3H6","Propena","Propene","CC=C","g","Bahan plastik polipropilena."],
["C2H2","Etuna (asetilena)","Ethyne (acetylene)","C#C","g","Las karbit, bahan sintesis."],
["C6H6","Benzena","Benzene","C1=CC=CC=C1","l","Pelarut & bahan baku industri (karsinogenik)."],
["C6H12","Sikloheksana","Cyclohexane","C1CCCCC1","l","Bahan baku nilon."],
["C7H8","Toluena","Toluene (methylbenzene)","CC1=CC=CC=C1","l","Pelarut cat, bahan baku TNT."],
["C6H5OH","Fenol","Phenol","OC1=CC=CC=C1","s","Antiseptik (dulu), bahan resin & obat."],
["C6H5NH2","Anilina","Aniline","NC1=CC=CC=C1","l","Bahan zat warna & obat."],
["CH3OH","Metanol","Methanol","CO","l","Pelarut, bahan bakar; beracun jika diminum."],
["C2H5OH","Etanol","Ethanol","CCO","l","Antiseptik, pelarut obat, bahan bakar, minuman beralkohol."],
["CH3OCH3","Dimetil eter","Methoxymethane (dimethyl ether)","COC","g","Propelan aerosol, bahan bakar."],
["C3H7OH","1-Propanol","Propan-1-ol","CCCO","l","Pelarut."],
["C3H7OH","Isopropanol","Propan-2-ol (isopropyl alcohol)","CC(O)C","l","Alkohol pembersih/antiseptik 70%."],
["C3H5(OH)3","Gliserol (gliserin)","Propane-1,2,3-triol (glycerol)","OCC(O)CO","l","Pelembap, bahan sediaan farmasi, sabun."],
["C2H4(OH)2","Etilen glikol","Ethane-1,2-diol","OCCO","l","Antibeku radiator; beracun."],
["CH2O","Formaldehida","Methanal (formaldehyde)","C=O","g","Pengawet spesimen, bahan resin."],
["CH3CHO","Asetaldehida","Ethanal (acetaldehyde)","CC=O","l","Zat antara pembuatan asam asetat."],
["CH3COCH3","Aseton","Propan-2-one (acetone)","CC(=O)C","l","Penghapus kuteks, pelarut."],
["HCOOH","Asam format (semut)","Methanoic acid (formic acid)","C(=O)O","l","Penggumpal lateks, pengawet."],
["CH3COOH","Asam asetat (cuka)","Ethanoic acid (acetic acid)","CC(=O)O","l","Cuka makanan, bahan kimia industri."],
["CH3COOC2H5","Etil asetat","Ethyl ethanoate (ethyl acetate)","CC(=O)OCC","l","Pelarut, aroma buah."],
["C2H5OC2H5","Dietil eter","Ethoxyethane (diethyl ether)","CCOCC","l","Pelarut; anestesi umum (dulu)."],
["CHCl3","Kloroform","Trichloromethane (chloroform)","ClC(Cl)Cl","l","Pelarut; anestesi (dulu)."],
["CH2Cl2","Diklorometana","Dichloromethane","ClCCl","l","Pelarut, pelepas cat."],
["CCl4","Karbon tetraklorida","Tetrachloromethane","ClC(Cl)(Cl)Cl","l","Pelarut (dulu), kini dibatasi."],
["CH3Cl","Klorometana","Chloromethane (methyl chloride)","CCl","g","Bahan silikon."],
["CO(NH2)2","Urea","Urea (carbamide)","NC(N)=O","s","Pupuk nitrogen, krim kulit, sintesis."],
["C2H5NO2","Glisina","Aminoacetic acid (glycine)","NCC(=O)O","s","Asam amino paling sederhana."],
["C3H7NO2","Alanina","2-Aminopropanoic acid (alanine)","CC(N)C(=O)O","s","Asam amino penyusun protein."],
["C3H6O3","Asam laktat","2-Hydroxypropanoic acid (lactic acid)","CC(O)C(=O)O","l","Yogurt, kosmetik, sediaan farmasi."],
["C6H8O7","Asam sitrat","Citric acid","OC(=O)CC(O)(CC(=O)O)C(=O)O","s","Pengasam makanan, pengawet, tablet effervescent."],
["C2H2O4","Asam oksalat","Ethanedioic acid (oxalic acid)","OC(=O)C(=O)O","s","Pembersih karat, pemutih."],
["C6H12O6","Glukosa","Glucose (pyranose form)","OCC1OC(O)C(O)C(O)C1O","s","Sumber energi utama sel; infus dekstrosa."],
["C6H12O6","Fruktosa","Fructose (pyranose form)","OCC1(O)OCC(O)C(O)C1O","s","Gula buah, pemanis."],
["C12H22O11","Sukrosa (gula pasir)","Sucrose","OCC1OC(OC2(CO)OC(CO)C(O)C2O)C(O)C(O)C1O","s","Gula meja, pemanis, pengawet sirup."],
["C6H8O6","Vitamin C (asam askorbat)","Ascorbic acid","OCC(O)C1OC(=O)C(O)=C1O","s","Antioksidan dan suplemen vitamin C."],
["C9H8O4","Aspirin (asam asetilsalisilat)","2-Acetoxybenzoic acid (acetylsalicylic acid)","CC(=O)OC1=CC=CC=C1C(=O)O","s","Pereda nyeri, penurun demam, antiplatelet."],
["C7H6O3","Asam salisilat","2-Hydroxybenzoic acid (salicylic acid)","OC1=CC=CC=C1C(=O)O","s","Obat jerawat/kutil, bahan baku aspirin."],
["C8H9NO2","Parasetamol","N-(4-hydroxyphenyl)acetamide (paracetamol)","CC(=O)NC1=CC=C(O)C=C1","s","Pereda nyeri & penurun demam."],
["C13H18O2","Ibuprofen","2-(4-isobutylphenyl)propanoic acid (ibuprofen)","CC(C)CC1=CC=C(C=C1)C(C)C(=O)O","s","Antiinflamasi nonsteroid (OAINS), pereda nyeri."],
["C8H10N4O2","Kafein","1,3,7-Trimethylxanthine (caffeine)","CN1C=NC2=C1C(=O)N(C)C(=O)N2C","s","Stimulan pada kopi/teh; obat apnea bayi prematur."],
["C4H11N5","Metformin","N,N-Dimethylimidodicarbonimidic diamide (metformin)","CN(C)C(=N)NC(=N)N","s","Obat diabetes tipe 2."],
// ionik
["NaCl","Natrium klorida (garam dapur)","Sodium chloride","[Na+].[Cl-]","s","Garam dapur, pengawet; infus NaCl 0,9%."],
["KCl","Kalium klorida","Potassium chloride","[K+].[Cl-]","s","Pupuk, suplemen kalium, pengganti garam."],
["LiCl","Litium klorida","Lithium chloride","[Li+].[Cl-]","s","Pengering gas, logam litium."],
["NaF","Natrium fluorida","Sodium fluoride","[Na+].[F-]","s","Fluoridasi pasta gigi."],
["NaBr","Natrium bromida","Sodium bromide","[Na+].[Br-]","s","Sedatif (dulu), fotografi."],
["KBr","Kalium bromida","Potassium bromide","[K+].[Br-]","s","Antikejang veteriner, optik."],
["NaI","Natrium iodida","Sodium iodide","[Na+].[I-]","s","Suplemen iodin, radiofarmaka."],
["KI","Kalium iodida","Potassium iodide","[K+].[I-]","s","Garam beriodium, proteksi tiroid saat radiasi."],
["CaCl2","Kalsium klorida","Calcium chloride","[Ca+2].[Cl-].[Cl-]","s","Pengering, pencair es jalan, injeksi kalsium."],
["MgCl2","Magnesium klorida","Magnesium chloride","[Mg+2].[Cl-].[Cl-]","s","Suplemen magnesium, pembuatan tahu (nigari)."],
["BaCl2","Barium klorida","Barium chloride","[Ba+2].[Cl-].[Cl-]","s","Reagen laboratorium (uji sulfat); beracun."],
["ZnCl2","Seng klorida","Zinc chloride","[Zn+2].[Cl-].[Cl-]","s","Fluks solder, pengawet kayu."],
["AlCl3","Aluminium klorida","Aluminium chloride","[Al+3].[Cl-].[Cl-].[Cl-]","s","Katalis; antiperspiran."],
["FeCl3","Besi(III) klorida","Iron(III) chloride","[Fe+3].[Cl-].[Cl-].[Cl-]","s","Etsa PCB, penjernih air."],
["FeCl2","Besi(II) klorida","Iron(II) chloride","[Fe+2].[Cl-].[Cl-]","s","Pengolahan air limbah."],
["CuCl2","Tembaga(II) klorida","Copper(II) chloride","[Cu+2].[Cl-].[Cl-]","s","Katalis, pewarna."],
["AgCl","Perak klorida","Silver chloride","[Ag+].[Cl-]","s","Fotografi, elektroda referensi."],
["AgNO3","Perak nitrat","Silver nitrate","[Ag+].[O-][N+]([O-])=O","s","Antiseptik/kauterisasi, reagen uji halida."],
["CaF2","Kalsium fluorida (fluorit)","Calcium fluoride","[Ca+2].[F-].[F-]","s","Optik, sumber fluor."],
["NH4Cl","Amonium klorida","Ammonium chloride","[NH4+].[Cl-]","s","Baterai kering, ekspektoran, fluks."],
["NH4NO3","Amonium nitrat","Ammonium nitrate","[NH4+].[O-][N+]([O-])=O","s","Pupuk; bahan peledak tambang."],
["(NH4)2SO4","Amonium sulfat (ZA)","Ammonium sulfate","[NH4+].[NH4+].[O-]S([O-])(=O)=O","s","Pupuk, pengendap protein."],
["NaOH","Natrium hidroksida (soda api)","Sodium hydroxide","[Na+].[OH-]","s","Pembuatan sabun, pembersih pipa; sangat korosif."],
["KOH","Kalium hidroksida","Potassium hydroxide","[K+].[OH-]","s","Sabun cair, elektrolit baterai alkali."],
["LiOH","Litium hidroksida","Lithium hydroxide","[Li+].[OH-]","s","Baterai litium, penyerap CO2."],
["Ca(OH)2","Kalsium hidroksida (kapur tohor/padam)","Calcium hydroxide","[Ca+2].[OH-].[OH-]","s","Bahan bangunan, penetral tanah asam."],
["Mg(OH)2","Magnesium hidroksida","Magnesium hydroxide","[Mg+2].[OH-].[OH-]","s","Antasida & pencahar (susu magnesia)."],
["Al(OH)3","Aluminium hidroksida","Aluminium hydroxide","[Al+3].[OH-].[OH-].[OH-]","s","Antasida penetral asam lambung."],
["Ba(OH)2","Barium hidroksida","Barium hydroxide","[Ba+2].[OH-].[OH-]","s","Titrasi, sintesis."],
["Li2O","Litium oksida","Lithium oxide","[Li+].[Li+].[O-2]","s","Kaca & keramik."],
["Na2O","Natrium oksida","Sodium oxide","[Na+].[Na+].[O-2]","s","Industri kaca."],
["K2O","Kalium oksida","Potassium oxide","[K+].[K+].[O-2]","s","Komponen pupuk (K₂O)."],
["MgO","Magnesium oksida","Magnesium oxide","[Mg+2].[O-2]","s","Antasida, bahan tahan api."],
["CaO","Kalsium oksida (kapur tohor)","Calcium oxide","[Ca+2].[O-2]","s","Semen, penetral asam, pemanas."],
["Al2O3","Aluminium oksida (alumina)","Aluminium oxide","[Al+3].[Al+3].[O-2].[O-2].[O-2]","s","Bahan baku aluminium, amplas, safir."],
["Fe2O3","Besi(III) oksida (karat)","Iron(III) oxide","[Fe+3].[Fe+3].[O-2].[O-2].[O-2]","s","Karat, pigmen merah, bijih besi."],
["FeO","Besi(II) oksida","Iron(II) oxide","[Fe+2].[O-2]","s","Pigmen, baja."],
["CuO","Tembaga(II) oksida","Copper(II) oxide","[Cu+2].[O-2]","s","Pigmen, katalis."],
["Cu2O","Tembaga(I) oksida","Copper(I) oxide","[Cu+].[Cu+].[O-2]","s","Pigmen, antifouling kapal."],
["ZnO","Seng oksida","Zinc oxide","[Zn+2].[O-2]","s","Tabir surya, salep, bedak bayi."],
["HgO","Raksa(II) oksida","Mercury(II) oxide","[Hg+2].[O-2]","s","Baterai raksa (dulu); beracun."],
["TiO2","Titanium dioksida","Titanium dioxide","[Ti+4].[O-2].[O-2]","s","Pigmen putih, tabir surya."],
["MnO2","Mangan dioksida","Manganese dioxide","[Mn+4].[O-2].[O-2]","s","Baterai, katalis."],
["PbO","Timbal(II) oksida","Lead(II) oxide","[Pb+2].[O-2]","s","Kaca kristal, aki (beracun)."],
["Na2O2","Natrium peroksida","Sodium peroxide","[Na+].[Na+].[O-][O-]","s","Pemutih, penghasil oksigen."],
["Na2S","Natrium sulfida","Sodium sulfide","[Na+].[Na+].[S-2]","s","Industri kertas & penyamakan."],
["FeS","Besi(II) sulfida","Iron(II) sulfide","[Fe+2].[S-2]","s","Pembuatan H₂S di laboratorium."],
["ZnS","Seng sulfida","Zinc sulfide","[Zn+2].[S-2]","s","Pigmen, layar fosfor."],
["NaH","Natrium hidrida","Sodium hydride","[Na+].[H-]","s","Basa kuat di sintesis organik."],
["LiH","Litium hidrida","Lithium hydride","[Li+].[H-]","s","Penyimpan hidrogen."],
["Na2CO3","Natrium karbonat (soda abu)","Sodium carbonate","[Na+].[Na+].[O-]C([O-])=O","s","Pembuatan kaca, pelunak air, deterjen."],
["NaHCO3","Natrium bikarbonat (soda kue)","Sodium hydrogencarbonate","[Na+].[O-]C(O)=O","s","Pengembang kue, antasida."],
["K2CO3","Kalium karbonat","Potassium carbonate","[K+].[K+].[O-]C([O-])=O","s","Kaca, sabun."],
["CaCO3","Kalsium karbonat","Calcium carbonate","[Ca+2].[O-]C([O-])=O","s","Kapur, marmer, antasida, suplemen kalsium."],
["MgCO3","Magnesium karbonat","Magnesium carbonate","[Mg+2].[O-]C([O-])=O","s","Antasida, serbuk pemanjat tebing."],
["Na2SO4","Natrium sulfat","Sodium sulfate","[Na+].[Na+].[O-]S([O-])(=O)=O","s","Deterjen, pencahar salin, pengering."],
["K2SO4","Kalium sulfat","Potassium sulfate","[K+].[K+].[O-]S([O-])(=O)=O","s","Pupuk bebas klorida."],
["MgSO4","Magnesium sulfat (garam Epsom)","Magnesium sulfate","[Mg+2].[O-]S([O-])(=O)=O","s","Pencahar, rendam kaki, injeksi preeklampsia."],
["CaSO4","Kalsium sulfat (gipsum)","Calcium sulfate","[Ca+2].[O-]S([O-])(=O)=O","s","Gips ortopedi, bahan bangunan."],
["CuSO4","Tembaga(II) sulfat (terusi)","Copper(II) sulfate","[Cu+2].[O-]S([O-])(=O)=O","s","Fungisida, uji air, elektroplating."],
["FeSO4","Besi(II) sulfat","Iron(II) sulfate","[Fe+2].[O-]S([O-])(=O)=O","s","Suplemen zat besi (obat anemia)."],
["ZnSO4","Seng sulfat","Zinc sulfate","[Zn+2].[O-]S([O-])(=O)=O","s","Suplemen seng, obat tetes mata."],
["BaSO4","Barium sulfat","Barium sulfate","[Ba+2].[O-]S([O-])(=O)=O","s","Kontras rontgen saluran cerna."],
["Al2(SO4)3","Aluminium sulfat (tawas)","Aluminium sulfate","[Al+3].[Al+3].[O-]S([O-])(=O)=O.[O-]S([O-])(=O)=O.[O-]S([O-])(=O)=O","s","Penjernih air, astringen."],
["NaNO3","Natrium nitrat","Sodium nitrate","[Na+].[O-][N+]([O-])=O","s","Pupuk, pengawet."],
["KNO3","Kalium nitrat (sendawa)","Potassium nitrate","[K+].[O-][N+]([O-])=O","s","Pupuk, mesiu, pasta gigi sensitif."],
["Ca(NO3)2","Kalsium nitrat","Calcium nitrate","[Ca+2].[O-][N+]([O-])=O.[O-][N+]([O-])=O","s","Pupuk."],
["Pb(NO3)2","Timbal(II) nitrat","Lead(II) nitrate","[Pb+2].[O-][N+]([O-])=O.[O-][N+]([O-])=O","s","Reagen laboratorium (beracun)."],
["Na3PO4","Natrium fosfat","Sodium phosphate","[Na+].[Na+].[Na+].[O-]P([O-])([O-])=O","s","Pembersih, pelunak air."],
["K3PO4","Kalium fosfat","Potassium phosphate","[K+].[K+].[K+].[O-]P([O-])([O-])=O","s","Pupuk, suplemen fosfat."],
["Ca3(PO4)2","Kalsium fosfat","Calcium phosphate","[Ca+2].[Ca+2].[Ca+2].[O-]P([O-])([O-])=O.[O-]P([O-])([O-])=O","s","Komponen tulang & gigi, suplemen kalsium."],
["KMnO4","Kalium permanganat","Potassium permanganate","[K+].[O-][Mn](=O)(=O)=O","s","Antiseptik encer, oksidator titrasi."],
["K2Cr2O7","Kalium dikromat","Potassium dichromate","[K+].[K+].[O-][Cr](=O)(=O)O[Cr](=O)(=O)[O-]","s","Oksidator laboratorium (karsinogenik)."],
["NaClO","Natrium hipoklorit","Sodium hypochlorite","[Na+].[O-]Cl","s","Pemutih (bayclin), disinfektan."],
["KClO3","Kalium klorat","Potassium chlorate","[K+].[O-]Cl(=O)=O","s","Korek api, kembang api."],
["CH3COONa","Natrium asetat","Sodium acetate","[Na+].CC([O-])=O","s","Penyangga pH, penghangat tangan."]
];

/* ================= PARSER SMILES (mini) ================= */
const ORG={B:[3],C:[4],N:[3,5],O:[2],P:[3,5],S:[2,4,6],F:[1],Cl:[1,3,5,7],Br:[1,3,5,7],I:[1,3,5,7]};
function parseSmiles(s){
  const atoms=[],bonds=[];let prev=null,order=1;const stack=[],rings={};let i=0;
  const add=(el,ch,h,br)=>{const a={i:atoms.length,el,charge:ch,hExp:h,bracket:br};atoms.push(a);if(prev!==null)bonds.push({a:prev,b:a.i,o:order});prev=a.i;order=1;};
  while(i<s.length){
    const c=s[i];
    if(c==='['){
      const j=s.indexOf(']',i),body=s.slice(i+1,j);i=j+1;
      const m=body.match(/^([A-Z][a-z]?)(?:H(\d*))?(?:([+-])(\d+|[+-]*))?$/);
      if(!m)throw new Error('SMILES bracket: '+body);
      let ch=0;if(m[3]){let mag=1;if(m[4])mag=/^\d+$/.test(m[4])?parseInt(m[4]):1+m[4].length;ch=(m[3]==='+'?1:-1)*mag;}
      add(m[1],ch,m[2]===undefined?0:(m[2]===''?1:parseInt(m[2])),true);
    }else if(/[A-Z]/.test(c)){
      let el=c;if((c==='C'&&s[i+1]==='l')||(c==='B'&&s[i+1]==='r')){el=c+s[i+1];i++;}
      i++;add(el,0,0,false);
    }else if(c==='('){stack.push(prev);i++}
    else if(c===')'){prev=stack.pop();i++}
    else if(c==='='){order=2;i++}
    else if(c==='#'){order=3;i++}
    else if(c==='.'){prev=null;i++}
    else if(/\d/.test(c)){
      if(rings[c]!==undefined){bonds.push({a:rings[c],b:prev,o:order});delete rings[c];order=1}else rings[c]=prev;
      i++;
    }else throw new Error('SMILES karakter: '+c);
  }
  const n0=atoms.length,bsum=new Array(n0).fill(0);
  bonds.forEach(b=>{bsum[b.a]+=b.o;bsum[b.b]+=b.o});
  for(let k=0;k<n0;k++){
    const a=atoms[k];let h=0;
    if(a.bracket)h=a.hExp;else{const v=ORG[a.el];if(v){const t=v.find(x=>x>=bsum[k]);h=t===undefined?0:t-bsum[k];}}
    for(let q=0;q<h;q++){const hi=atoms.length;atoms.push({i:hi,el:'H',charge:0,hExp:0,bracket:false});bonds.push({a:k,b:hi,o:1});}
  }
  // komponen
  const nb=atoms.map(()=>[]);bonds.forEach(b=>{nb[b.a].push(b.b);nb[b.b].push(b.a)});
  const comp=new Array(atoms.length).fill(-1);let nc=0;
  for(let k=0;k<atoms.length;k++)if(comp[k]<0){const q=[k];comp[k]=nc;while(q.length){const u=q.pop();nb[u].forEach(v=>{if(comp[v]<0){comp[v]=nc;q.push(v)}})}nc++;}
  atoms.forEach((a,k)=>{a.comp=comp[k];a.nbrs=nb[k];});
  const cnt={};atoms.forEach(a=>cnt[a.el]=(cnt[a.el]||0)+1);
  return{atoms,bonds,ncomp:nc,cnt};
}
/* ================= PARSER RUMUS TEKS ================= */
function parseFormula(str){
  let i=0;
  const num=()=>{let s='';while(i<str.length&&/\d/.test(str[i]))s+=str[i++];return s?parseInt(s):1};
  function group(close){
    const out={};
    while(i<str.length){
      const ch=str[i];
      if(ch==='('||ch==='['){i++;const inner=group(ch==='('?')':']');const n=num();for(const k in inner)out[k]=(out[k]||0)+inner[k]*n;}
      else if(ch===')'||ch===']'){if(close&&ch===close){i++;return out}throw new Error('Tanda kurung tidak cocok')}
      else if(/[A-Z]/.test(ch)){let sym=ch;i++;if(i<str.length&&/[a-z]/.test(str[i])&&BY[sym+str[i]]){sym+=str[i];i++}
        if(!BY[sym])throw new Error('Simbol tidak dikenal: '+sym);const n=num();out[sym]=(out[sym]||0)+n;}
      else throw new Error('Karakter tidak dikenal: "'+ch+'" (pakai huruf kapital: Na, bukan na)');
    }
    if(close)throw new Error('Kurung belum ditutup');return out;
  }
  return group(null);
}
function parseInput(text){
  const inv={};
  text.split(/[+,]/).map(t=>t.replace(/\s+/g,'')).filter(Boolean).forEach(tok=>{
    const m=tok.match(/^(\d+)?(.*)$/);const coef=m[1]?parseInt(m[1]):1;if(!m[2])throw new Error('Rumus kosong setelah angka');
    const f=parseFormula(m[2]);for(const k in f)inv[k]=(inv[k]||0)+f[k]*coef;
  });
  return inv;
}

/* ================= DB TERPROSES ================= */
const DB=DBRAW.map((r,idx)=>{
  const mol=parseSmiles(r[3]);const size=mol.atoms.length;
  let mass=0;for(const k in mol.cnt)mass+=BY[k].mass*mol.cnt[k];
  const pos=new Set(),neg=new Set();mol.atoms.forEach(a=>{if(a.charge>0)pos.add(a.comp);if(a.charge<0)neg.add(a.comp)});
  let ionic=false;mol.atoms.forEach(a=>{if(a.charge!==0)mol.atoms.forEach(b=>{if(b.charge*a.charge<0&&b.comp!==a.comp)ionic=true})});
  return{idx,f:r[0],id:r[1],en:r[2],smiles:r[3],state:r[4],use:r[5],mol,cnt:mol.cnt,size,mass,ionic};
});
const STATE={g:'Gas',l:'Cair',s:'Padat'};

/* ================= LAYOUT 3D (VSEPR perkiraan) ================= */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function ringBond(mol,a,b){ // apakah ikatan a-b ada dalam cincin
  const seen=new Set([a]);const q=[a];
  while(q.length){const u=q.pop();for(const v of mol.atoms[u].nbrs){if(u===a&&v===b)continue;if(u===b&&v===a)continue;if(v===b)return true;if(!seen.has(v)){seen.add(v);q.push(v)}}}
  return false;
}
function idealAngle(sn){return sn===2?Math.PI:sn===3?2*Math.PI/3:Math.acos(-1/3)}
function dihedralDist(a,b,c,th,phi){
  const p1=[a*Math.cos(th),a*Math.sin(th),0],p4=[b-c*Math.cos(th),c*Math.sin(th)*Math.cos(phi),c*Math.sin(th)*Math.sin(phi)];
  return Math.hypot(p4[0]-p1[0],p4[1]-p1[1],p4[2]-p1[2]);
}
function layout(mol,key){
  const rnd=mulberry(hashStr(key));
  const atoms=mol.atoms,n=atoms.length;
  // pasangan elektron bebas
  atoms.forEach(a=>{
    const ve=BY[a.el].ve;let bs=0;a.nbrs.forEach(()=>{});
    mol.bonds.forEach(b=>{if(b.a===a.i||b.b===a.i)bs+=b.o});
    a.bsum=bs;let lp=0;if(ve!==null){const e=ve-a.charge-bs;lp=e>0?Math.ceil(e/2):0}
    a.lp=a.nbrs.length>=2?lp:0;a.sn=a.nbrs.length+a.lp;
  });
  const nodes=[];
  for(let i=0;i<n;i++)nodes.push({p:[(rnd()-.5)*3,(rnd()-.5)*3,(rnd()-.5)*3],v:[0,0,0],atom:i,lp:false});
  const springs=[],boost=new Map();
  const bk=(i,j)=>i<j?i*10000+j:j*10000+i;
  const bondRest=new Map();
  mol.bonds.forEach(b=>{
    const f=b.o===2?.92:b.o===3?.87:1;const r=(rcov(atoms[b.a].el)+rcov(atoms[b.b].el))*f;
    bondRest.set(bk(b.a,b.b),r);springs.push([b.a,b.b,r,8]);
  });
  const lpNodes=[];
  atoms.forEach(a=>{
    const L=a.nbrs.slice();
    for(let t=0;t<a.lp;t++){const id=nodes.length;nodes.push({p:[nodes[a.i].p[0]+rnd()-.5,nodes[a.i].p[1]+rnd()-.5,nodes[a.i].p[2]+rnd()-.5],v:[0,0,0],atom:a.i,lp:true});
      springs.push([a.i,id,.65,5]);bondRest.set(bk(a.i,id),.65);L.push(id);lpNodes.push(id)}
    if(a.sn>=2&&a.sn<=4){
      const th=idealAngle(a.sn);
      for(let x=0;x<L.length;x++)for(let y=x+1;y<L.length;y++){
        const d1=bondRest.get(bk(a.i,L[x])),d2=bondRest.get(bk(a.i,L[y]));
        springs.push([L[x],L[y],Math.sqrt(d1*d1+d2*d2-2*d1*d2*Math.cos(th)),3]);
      }
    }else if(a.sn>=5){
      for(let x=0;x<L.length;x++)for(let y=x+1;y<L.length;y++)boost.set(bk(L[x],L[y]),1.6);
    }
  });
  // torsi ikatan rangkap asiklik
  mol.bonds.forEach(b=>{
    if(b.o!==2)return;const A=atoms[b.a],B=atoms[b.b];
    if(A.sn!==3||B.sn!==3||ringBond(mol,b.a,b.b))return;
    const xs=A.nbrs.filter(v=>v!==b.b),ys=B.nbrs.filter(v=>v!==b.a);
    const th=2*Math.PI/3,bb=bondRest.get(bk(b.a,b.b));
    xs.forEach((x,i)=>ys.forEach((y,j)=>{
      const phi=(i===j)?Math.PI:0;
      springs.push([x,y,dihedralDist(bondRest.get(bk(x,b.a)),bb,bondRest.get(bk(b.b,y)),th,phi),1.5]);
    }));
  });
  // ionik: tarik-menarik antar komponen
  const ionPairs=[];
  atoms.forEach(a=>{if(!a.charge)return;atoms.forEach(b=>{if(b.i<=a.i||!b.charge||b.comp===a.comp)return;
    if(a.charge*b.charge<0){springs.push([a.i,b.i,(rcov(a.el)+rcov(b.el))*1.9,.6]);}
    else boost.set(bk(a.i,b.i),3);});});
  const N=nodes.length;
  // simulasi
  for(let it=0;it<1100;it++){
    const F=nodes.map(()=>[0,0,0]);
    for(const [i,j,r,k] of springs){
      const pi=nodes[i].p,pj=nodes[j].p;let dx=pj[0]-pi[0],dy=pj[1]-pi[1],dz=pj[2]-pi[2];
      const d=Math.hypot(dx,dy,dz)||1e-6;const f=k*(d-r)/d;
      F[i][0]+=f*dx;F[i][1]+=f*dy;F[i][2]+=f*dz;F[j][0]-=f*dx;F[j][1]-=f*dy;F[j][2]-=f*dz;
    }
    for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){
      const pi=nodes[i].p,pj=nodes[j].p;let dx=pj[0]-pi[0],dy=pj[1]-pi[1],dz=pj[2]-pi[2];
      const d2=dx*dx+dy*dy+dz*dz+.04,d=Math.sqrt(d2);
      let c=(nodes[i].lp||nodes[j].lp)?.25:.5;const bo=boost.get(bk(i,j));if(bo)c*=bo*2;
      const f=-c/(d2*d);
      F[i][0]+=f*dx;F[i][1]+=f*dy;F[i][2]+=f*dz;F[j][0]-=f*dx;F[j][1]-=f*dy;F[j][2]-=f*dz;
    }
    const noise=it<350?(1-it/350)*.25:0;
    for(let i=0;i<N;i++){
      const nd=nodes[i];
      for(let k=0;k<3;k++){
        const f=F[i][k]-.03*nd.p[k]+(noise?(rnd()-.5)*noise:0);
        nd.v[k]=(nd.v[k]+f*.04)*.82;
        nd.p[k]+=Math.max(-.3,Math.min(.3,nd.v[k]));
      }
    }
  }
  // pusatkan & orientasi (PCA)
  let c=[0,0,0];for(let i=0;i<n;i++)for(let k=0;k<3;k++)c[k]+=nodes[i].p[k]/n;
  nodes.forEach(nd=>{for(let k=0;k<3;k++)nd.p[k]-=c[k]});
  const cov=[[0,0,0],[0,0,0],[0,0,0]];
  for(let i=0;i<n;i++)for(let a=0;a<3;a++)for(let b=0;b<3;b++)cov[a][b]+=nodes[i].p[a]*nodes[i].p[b];
  const V=jacobi3(cov); // kolom = vektor eigen, urut menurun
  nodes.forEach(nd=>{const p=nd.p;nd.p=[0,1,2].map(k=>p[0]*V[0][k]+p[1]*V[1][k]+p[2]*V[2][k])});
  // dashed ion
  const dashes=[];
  atoms.forEach(a=>{if(!a.charge)return;let best=null,bd=1e9;atoms.forEach(b=>{if(b.charge*a.charge<0&&b.comp!==a.comp){const d=dist(nodes[a.i].p,nodes[b.i].p);if(d<bd){bd=d;best=b.i}}});if(best!==null&&a.i<best)dashes.push([a.i,best]);
    else if(best!==null&&!atoms[best].charge)dashes.push([a.i,best])});
  let R=0;for(let i=0;i<n;i++)R=Math.max(R,Math.hypot(...nodes[i].p)+vdw(atoms[i].el)*.3);
  return{nodes,atoms,bonds:mol.bonds,lpNodes,dashes,R:R||1};
}
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
function jacobi3(A){
  A=A.map(r=>r.slice());let V=[[1,0,0],[0,1,0],[0,0,1]];
  for(let sweep=0;sweep<30;sweep++){
    for(let p=0;p<2;p++)for(let q=p+1;q<3;q++){
      if(Math.abs(A[p][q])<1e-12)continue;
      const th=(A[q][q]-A[p][p])/(2*A[p][q]);const t=Math.sign(th||1)/(Math.abs(th)+Math.sqrt(th*th+1));
      const c=1/Math.sqrt(t*t+1),s=t*c;
      for(let k=0;k<3;k++){const akp=A[k][p],akq=A[k][q];A[k][p]=c*akp-s*akq;A[k][q]=s*akp+c*akq}
      for(let k=0;k<3;k++){const apk=A[p][k],aqk=A[q][k];A[p][k]=c*apk-s*aqk;A[q][k]=s*apk+c*aqk}
      for(let k=0;k<3;k++){const vkp=V[k][p],vkq=V[k][q];V[k][p]=c*vkp-s*vkq;V[k][q]=s*vkp+c*vkq}
    }
  }
  const ev=[A[0][0],A[1][1],A[2][2]],ord=[0,1,2].sort((a,b)=>ev[b]-ev[a]);
  return[0,1,2].map(r=>ord.map(k=>V[r][k]));
}
function freeAtomsMol(inv){
  const atoms=[],cnt={};let total=0;
  for(const s in inv){for(let q=0;q<inv[s]&&total<60;q++){atoms.push({i:atoms.length,el:s,charge:0,comp:atoms.length,nbrs:[],bracket:true});total++}cnt[s]=inv[s]}
  return{atoms,bonds:[],ncomp:atoms.length,cnt};
}

/* ================= ANALISIS KOMBINASI ================= */
function sizeOf(inv){let t=0;for(const k in inv)t+=inv[k];return t}
function analyze(inv){
  const syms=Object.keys(inv),total=sizeOf(inv);
  const exact=[],partial=[],sugg=[];
  DB.forEach(c=>{
    const cs=Object.keys(c.cnt);
    if(cs.length===syms.length&&cs.every(s=>inv[s])){
      const k=inv[cs[0]]/c.cnt[cs[0]];
      if(Number.isInteger(k)&&cs.every(s=>inv[s]===k*c.cnt[s])){exact.push({c,k});return}
    }
    if(cs.every(s=>(inv[s]||0)>=c.cnt[s])){
      const k=Math.min(...cs.map(s=>Math.floor(inv[s]/c.cnt[s])));
      partial.push({c,k,left:total-k*c.size});
    }
    if(c.size>total&&syms.every(s=>(c.cnt[s]||0)>=inv[s])){
      const diff={};for(const s in c.cnt){const d=c.cnt[s]-(inv[s]||0);if(d>0)diff[s]=d}
      sugg.push({c,extra:c.size-total,diff});
    }
  });
  exact.sort((a,b)=>a.k-b.k||a.c.idx-b.c.idx);
  partial.sort((a,b)=>a.left-b.left||b.c.size-a.c.size);
  sugg.sort((a,b)=>a.extra-b.extra||a.c.idx-b.c.idx);
  return{exact,partial:partial.slice(0,6),sugg:sugg.slice(0,10)};
}
function formationEq(c){
  if(Object.keys(c.cnt).length<2)return null;
  const dia=new Set(['H','N','O','F','Cl','Br','I']);
  const gcd=(a,b)=>b?gcd(b,a%b):a;const lcm=(a,b)=>a*b/gcd(a,b);
  const fr=[];let m=1;
  for(const s in c.cnt){const a=dia.has(s)?2:1;const g=gcd(c.cnt[s],a);const num=c.cnt[s]/g,den=a/g;fr.push([s,num,den]);m=lcm(m,den)}
  const parts=fr.map(([s,num,den])=>{const co=num*m/den;const form=dia.has(s)?s+'₂':s;return(co>1?co+' ':'')+form});
  return parts.join(' + ')+' → '+(m>1?m+' ':'')+c.f.replace(/\d+/g,d=>[...d].map(x=>'₀₁₂₃₄₅₆₇₈₉'[x]).join(''));
}
const sub=f=>f.replace(/(\d+)/g,'<sub>$1</sub>');
const SUBN=d=>[...String(d)].map(x=>'₀₁₂₃₄₅₆₇₈₉'[x]).join('');
function shapeName(sn,lp){
  const T={'2,0':'linear','3,0':'segitiga planar','3,1':'bengkok (huruf V)','4,0':'tetrahedral','4,1':'piramida trigonal','4,2':'bengkok','5,0':'bipiramida trigonal','5,1':'jungkat-jungkit','5,2':'bentuk T','5,3':'linear','6,0':'oktahedral','6,1':'piramida segiempat','6,2':'segiempat planar'};
  return T[sn+','+lp]||null;
}
function geometryText(mol){
  const seen=new Set(),out=[];
  mol.atoms.forEach(a=>{
    if(a.el==='H'||a.nbrs.length<2||!a.sn)return;
    const nm=shapeName(a.sn,a.lp);if(!nm)return;
    const key=a.el+nm;if(seen.has(key))return;seen.add(key);
    out.push(`<b>${a.el}</b>: ${nm}${a.lp?` (${a.lp} PEB)`:''}`);
  });
  return out.slice(0,4).join(' · ');
}
function bondType(c){
  if(c.ionic)return'Ionik (tarik-menarik kation–anion)'+(c.mol.bonds.length?' + kovalen pada ion poliatom':'');
  if(!c.mol.bonds.length)return'—';
  let max=0,dbl=false,tri=false;
  c.mol.bonds.forEach(b=>{const a=BY[c.mol.atoms[b.a].el],d=BY[c.mol.atoms[b.b].el];if(a.en&&d.en)max=Math.max(max,Math.abs(a.en-d.en));if(b.o===2)dbl=true;if(b.o===3)tri=true});
  const t=max<.4?'Kovalen nonpolar':max<1.7?'Kovalen polar':'Kovalen sangat polar';
  return t+(tri?' (ada ikatan rangkap tiga)':dbl?' (ada ikatan rangkap dua)':'');
}
