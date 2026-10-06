/* Watch Auth Pro v2.88.0 — 6 October 2026 researched reference batch
   Source: watch-auth-pro-missing-references-v2.86.0.csv plus deep verification pass.
   Policy:
   - exact/base-reference rows are installed as normal lookup rules;
   - collection/model-name rows are installed as manual-review guidance only;
   - unresolved rows are deliberately NOT added;
   - safety/service warnings are preserved in notes/caseDetails.
*/
(function(){
'use strict';

const rows = [
/* brand | ref | family | calibre aliases | technology | size | reserve | production | confidence | source | notes | manualReview */
['Omega','220.12.41.21.03.002','Seamaster Aqua Terra 150M','8900,CAL8900','Automatic Co-Axial Master Chronometer','41 mm','60 hours','2010s–present','High','Omega/reference records','150 m water resistance.'],
['Omega','2221.80.00','Seamaster 300M','1538,CAL1538','Quartz analogue','41 mm','battery powered','2000s','High','Omega official product sheet','300 m water resistance.'],
['Omega','2210.50.00','Seamaster Planet Ocean 600M Co-Axial Chronograph','3313,CAL3313','Automatic Co-Axial chronograph','45.5 mm','52 hours','c. 2007–2016','High','Omega official/reference records','600 m water resistance.'],
['Omega','145.012-67','Speedmaster Professional Moonwatch','321,CAL321','Manual-wind chronograph','42 mm','reference-specific','1967–1968','High','Omega historical/reference specialist records','Vintage Speedmaster Professional case reference.'],
['Omega','2209.50.00','Seamaster Planet Ocean 600M','2500,CAL2500','Automatic Co-Axial chronometer','42 mm','48 hours','2000s–2010s','High','Omega official/reference records','600 m water resistance.'],
['Omega','210.32.42.20.04.001','Seamaster Diver 300M','8800,CAL8800','Automatic Co-Axial Master Chronometer','42 mm','55 hours','2010s–present','High','Omega official product records','300 m water resistance.'],
['Omega','231.10.42.21.03.003','Seamaster Aqua Terra 150M','8500,CAL8500','Automatic Co-Axial','41.5 mm','60 hours','2010s','High','Omega/reference records','150 m water resistance.'],
['Omega','176.007','Seamaster Chronograph','1040,CAL1040','Automatic chronograph','reference-specific','reference-specific','1972–1976','High','Omega historical/reference records','Vintage automatic chronograph family.'],
['Omega','25518000','Seamaster Professional 300M Mid-Size','1120,CAL1120','Automatic chronometer','approximately 36 mm','44 hours','1990s–2000s','Medium-high','Omega specialist/reference records','300 m water resistance.'],
['Omega','2255.80','Seamaster 300M Chronometer','1120,CAL1120','Automatic chronometer','reference-specific','44 hours','1990s–2000s','Medium-high','Omega specialist/reference records','300 m family.'],
['Omega','215.30.44.21.01.002','Seamaster Planet Ocean 600M','8900,CAL8900','Automatic Co-Axial Master Chronometer','43.5 mm','60 hours','2010s–present','High','Omega official product sheet','600 m water resistance.'],
['Omega','232.92.38.20.03.001','Seamaster Planet Ocean 600M','8520,CAL8520','Automatic Co-Axial','37.5 mm','50 hours','2010s','High','Omega/reference records','Titanium case; 600 m family.'],
['Omega','220.10.41.21.02.001','Seamaster Aqua Terra 150M','8900,CAL8900','Automatic Co-Axial Master Chronometer','41 mm','60 hours','2010s–present','High','Omega/reference records','150 m water resistance.'],
['Omega','3578.51','Speedmaster Professional Moonwatch special/limited reference','1861,CAL1861','Manual-wind chronograph','42 mm','48 hours','2000s','High','Omega specialist/reference records','Special/limited reference; verify exact dial/execution against watch.'],

['TAG Heuer','WBN2410','Carrera Date','CALIBRE9,CAL9','Automatic','29 mm','reference-specific','2020s','High','TAG Heuer official product records','100 m water resistance.'],
['TAG Heuer','CBS2210','Carrera Chronograph Glassbox','TH20-00,TH2000','Automatic manufacture chronograph','39 mm','80 hours','2020s','High','TAG Heuer official product records','100 m water resistance.'],
['TAG Heuer','CBS2210-0','Carrera Chronograph Glassbox','TH20-00,TH2000','Automatic manufacture chronograph','39 mm','80 hours','2020s','High','TAG Heuer official product records','Base/reference revision marking; strap/bracelet suffix may vary.'],
['TAG Heuer','WBD2120','Aquaracer Date','CALIBRE5,CAL5','Automatic','41 mm','reference-specific','2010s','High','TAG Heuer official product records','300 m water resistance.'],
['TAG Heuer','WAY2015','Aquaracer','CALIBRE5,CAL5','Automatic','43 mm','reference-specific','discontinued','High','TAG Heuer official/reference records','300 m water resistance.'],
['TAG Heuer','WBP5110','Aquaracer Professional 300 Date','TH31-00,TH3100','Automatic COSC','42 mm','80 hours','2020s','High','TAG Heuer official product records','300 m water resistance.'],
['TAG Heuer','WBN2012','Carrera Day-Date','CALIBRE5,CAL5','Automatic','41 mm','reference-specific','discontinued','High','TAG Heuer official/reference records','100 m water resistance.'],
['TAG Heuer','WAY201C','Aquaracer 300M Calibre 5','CALIBRE5,CAL5','Automatic','43 mm','reference-specific','2010s','High','TAG Heuer/reference records','300 m water resistance.'],
['TAG Heuer','CAR2A10-1','Carrera Calibre 1887 Chronograph','CALIBRE1887,CAL1887','Automatic chronograph','reference-specific','50 hours','2010s','High','TAG Heuer/reference records','-1 suffix is a case/reference revision marking; bracelet/strap suffix may still vary.'],
['TAG Heuer','CV2015','Carrera Calibre 16 Chronograph','CALIBRE16,CAL16','Automatic chronograph','41 mm','42–48 hours','2000s–2010s','High','TAG Heuer/reference records','50 m water resistance.'],
['TAG Heuer','WAY201A','Aquaracer 300M Calibre 5','CALIBRE5,CAL5','Automatic','43 mm','approximately 38 hours','2010s','High','TAG Heuer/reference records','300 m water resistance.'],
['TAG Heuer','CAW211P','Monaco Calibre 11 Steve McQueen','CALIBRE11,CAL11','Automatic chronograph','39 mm','reference-specific','2010s–2020s','High','TAG Heuer/reference records','100 m water resistance.'],

['Panerai','PAM00609','Radiomir Black Seal 8 Days Acciaio','P.5000,P5000','Manual wind','45 mm','8 days','2015','High','Panerai/reference records','100 m water resistance.'],
['Panerai','PAM01024','Luminor Submersible Automatic Acciaio','OPXXX','Automatic','44 mm','reference-specific','2017–2018','High','Panerai/reference records','300 m water resistance.'],
['Panerai','PAM00574','Radiomir 1940 3 Days Acciaio','P.1000,P1000','Manual wind','42 mm','3 days','2015–2018','High','Panerai/reference records','100 m water resistance.'],
['Panerai','PAM01572','Radiomir Quaranta','P.900,P900','Automatic','40 mm','3 days','2023–present','High','Panerai official product records','50 m water resistance.'],
['Panerai','PAM01005','Luminor Marina Logo','OPII,OP II','Manual wind','44 mm','reference-specific','2010s','High','Panerai/reference records','100 m water resistance.'],

['Breitling','V17310','Avenger Blackbird','BREITLING17,B17,SW200-1','Automatic','48 mm','approximately 38 hours','2015–','Medium-high','Breitling specialist reference records','Black titanium; 300 m water resistance.'],
['Breitling','A73310','SuperOcean Chronograph M2000','BREITLING73,B73','Quartz chronograph','46 mm','battery powered','2010s','High','Breitling specialist reference records','2000 m water resistance.'],
['Breitling','SB0147','Avenger B01 Chronograph 44 Night Mission','BREITLING01,B01','Automatic manufacture chronograph','44 mm','70 hours','2020s','High','Breitling/reference records','Ceramic Night Mission execution; 300 m water resistance.'],

['Cartier','W20045C4','Santos Galbée','077,CAL077','Automatic','approximately 24 x 35 mm','reference-specific','2000s','High','Cartier specialist/reference records','Steel/gold execution.'],
['Cartier','WSSA0048','Santos de Cartier Large','1847MC,1847 MC','Automatic','39.8 mm','approximately 42 hours','2020s','High','Cartier/reference records','100 m water resistance.'],
['Cartier','W1013754','Tank Vermeil / Tank Must','QUARTZ','Quartz analogue','approximately 25 mm','battery powered','vintage/discontinued','High','Cartier specialist/reference records','IMPORTANT DATA CONFLICT: observed calibre 687 in the export is inconsistent with reliable W1013754 quartz records. Do not auto-accept calibre 687 for this reference.'],

['Grand Seiko','SBGA443','Heritage Collection Shunbun / 62GS','9R65,9R65A','Spring Drive automatic','40 mm','72 hours','2020s','High','Grand Seiko official product records','High-intensity titanium; 100 m water resistance.'],
['Grand Seiko','SBGA299','Heritage Collection Spring Drive','9R65,9R65A','Spring Drive automatic','40.5 mm','72 hours','2010s','High','Grand Seiko/reference records','100 m water resistance.'],

['Hublot','510.CM.1170.CM','Classic Fusion Automatic','HUB1112,SW300-1','Automatic','45 mm','reference-specific','discontinued','Medium-high','Hublot specialist/reference records','Black ceramic; 50 m water resistance.'],
['Hublot','561.ZP.1180.RX','Classic Fusion Quartz Zirconium','QUARTZ','Quartz analogue','38 mm','battery powered','discontinued','High','Hublot specialist/reference records','Zirconium case; 100 m water resistance.'],

['IWC','IW376806','Aquatimer Chronograph','79320,IWC79320','Automatic chronograph','44 mm','44 hours','2010s','High','IWC official/reference records','300 m water resistance.'],
['IWC','IW371417','Portuguese / Portugieser Chronograph','79350,IWC79350','Automatic chronograph','41 mm','44 hours','c. 2006–2011','Medium-high','IWC specialist/reference records','30 m water resistance.'],

['Jaeger-LeCoultre','140.8.80.S','Master Control Perpetual Calendar','889/440/2,8894402','Automatic','37 mm','reference-specific','c. 2000–2005','Medium-high','JLC specialist/reference records','50 m family.'],
['Seiko','SPB253J1','Prospex 1965 Mechanical Diver Modern Re-interpretation Black Series LE','6R35,6R35A','Automatic with manual winding','reference-specific','70 hours','2020s limited edition','High','Seiko official product records','200 m water resistance; limited edition of 5,500.'],
['Seiko','SBEN011','Prospex Marinemaster 1965 Heritage','6L37','Automatic','39.5 mm','45 hours','2020s','High','Seiko official product records','200 m water resistance.'],

['Sinn','Sinn 206 Arktis II','206 Arktis II','7750,VALJOUX7750','Automatic chronograph','43 mm','reference-specific','2019–present','High','Sinn official technical records','SERVICE CAUTION: Ar-Dehumidifying Technology / inert-gas system. Treat as specialist case; do not casually open. 300 m water resistance.'],
['Sinn','358','358 Fliegerchronograph','7750,VALJOUX7750','Automatic chronograph','42 mm','reference-specific','2011–present','Medium-high','Sinn/reference records','Exact suffix determines execution.'],
['Sinn','Sinn U50 Hydro','U50 HYDRO','RONDA715LI,715LI','Quartz analogue','41 mm','battery powered','2025–present','High','Sinn official technical records','DO NOT OPEN AT NORMAL BENCH: HYDRO oil-filled case. Specialist Sinn service handling required. Pressure certified to 5,000 m.'],

['Oris','7730','Aquis Date family','ORIS733,733,SW200-1','Automatic','43.5 mm common','approximately 38 hours','2010s–2020s','Medium-high','Oris official/reference records','7730 is a family/base reference; suffix identifies exact configuration.'],
['Vertex','Vertex M36','M36 family','SW260-1,SELLITASW260-1','Automatic','36 mm','reference-specific','modern production','Medium-high','Vertex/reference records','Exact execution should be checked against dial/limited-edition details.'],

['Blancpain','5010-12B30-98S','Fifty Fathoms Automatique','1315,CAL1315','Automatic','42.3 mm','120 hours','2020s','High','Blancpain/reference records','Titanium; 300 m water resistance.'],
['Longines','L2.537.4','L2.537.4 reference family','L836.6,L8366','Automatic','reference-specific','reference-specific','2020s','Medium','Longines/reference records','SHORTENED REFERENCE: full dial/strap suffix required before exact-variant acceptance.',true],
['Tudor','70150','Black Bay P01','MT5612','Automatic manufacture calibre','42 mm','70 hours','2019–','High','Tudor official product records','200 m water resistance.'],
['Tudor','74000N','Prince Date','2824-2,ETA2824-2','Automatic','34 mm','approximately 38 hours','1990s–2000s','High','Tudor/reference records','100 m family.'],
['Bremont','SOLO-43','SOLO 43','BE-36AE,SW220-1','Automatic chronometer','43 mm','approximately 38 hours','discontinued','High','Bremont official/reference records','100 m water resistance.'],

/* Brand corrections from Generic queue */
['Zenith','03.2119.400','Captain Chronograph / Blue Primero family','ELPRIMERO400B,400B','Automatic chronograph','42 mm','reference-specific','2010s','High','Zenith/reference records','Correct brand is Zenith. Full suffix determines exact variant.'],
['Ulysse Nardin','263-10','Marine Diver / Diver Chronometer','UN-26,UN26','Automatic','44 mm','reference-specific','2000s–2010s','High','Ulysse Nardin/reference records','Correct brand is Ulysse Nardin; 300 m family.'],
['Zenith','03.2170.4650','El Primero Espada','4650B','Automatic','40 mm','reference-specific','2010s','High','Zenith/reference records','Correct brand is Zenith; full suffix determines dial/bracelet.'],
['Rolex','126720','GMT-Master II 126720 VTNR','3285,CAL3285','Automatic GMT','40 mm','70 hours','2022–present','High','Rolex official records','Left-side crown/date configuration; 100 m water resistance.'],
['Chopard','27/8895-23/11','Ladies watch ref. 27/8895-23/11','980.106,980106','Quartz analogue','reference-specific','battery powered','vintage/discontinued','Medium','Chopard specialist/reference records','Correct brand is Chopard; white-gold/gem-set examples reported.'],

/* Family/model-only guidance — intentionally manual review */
['Omega','Speedmaster Professional','Speedmaster Professional Moonwatch family','3861,CAL3861','Manual-wind chronograph','42 mm','50 hours','2020s','Family guidance only','Omega official collection records','Model name only. Calibre 3861 narrows this to the modern Moonwatch family, but exact bracelet/crystal/dial reference is still required.',true],
['Omega','Speedmaster MKIV','Speedmaster Mark IV / Mark 4.5 family','1040,CAL1040','Automatic chronograph','reference-specific','reference-specific','1970s','Family guidance only','Omega historical records','Model text plus calibre does not safely provide an exact case reference.',true],
['Omega','Seamaster Planet Ocean','Seamaster Planet Ocean 600M family','8900,CAL8900','Automatic Co-Axial Master Chronometer','reference-specific','60 hours','modern','Family guidance only','Omega collection records','Multiple Planet Ocean 8900 references exist; exact reference required.',true],
['Omega','SEAMASTER','Seamaster family','2500,CAL2500','Automatic Co-Axial','reference-specific','48 hours','multiple generations','Family guidance only','Omega collection records','Too broad for exact mapping.',true],
['Omega','Seamaster Diver','Seamaster Diver 300M family','8800,CAL8800','Automatic Co-Axial Master Chronometer','42 mm common','55 hours','modern','Family guidance only','Omega collection records','Multiple Diver 300M refs use calibre 8800.',true],
['Omega','Seamaster Aqua Terra','Aqua Terra / conflicting observation','3313,CAL3313','Reference conflict','reference-specific','reference-specific','multiple generations','Data conflict','Omega/reference records','Observed calibre 3313 is an automatic chronograph calibre while export movement technology says quartz. Re-check watch/reference.',true],
['Omega','OMEGA Seamaster','Seamaster chronograph family','1164,CAL1164','Automatic chronograph','reference-specific','reference-specific','multiple generations','Family guidance only','Omega collection records','Exact case reference required.',true],
['Omega','Planet Ocean','Seamaster Planet Ocean family','2500,CAL2500','Automatic Co-Axial','reference-specific','48 hours','2000s–2010s','Family guidance only','Omega collection records','Exact reference required.',true],
['Omega','Speedmaster Chronoscope','Speedmaster Chronoscope family','9908,CAL9908','Manual-wind Master Chronometer chronograph','43 mm','60 hours','2020s','Family guidance only','Omega official collection records','Calibre confirms family; exact dial/strap reference still required.',true],
['Cartier','Panthere','Panthère de Cartier family','685,CAL685','Quartz / reference-specific','reference-specific','battery powered','multiple generations','Family guidance only','Cartier collection records','Panthère is a collection name, not a unique reference.',true],
['Sinn','Sinn 140 / 42','140 / 142 chronograph family','','Automatic chronograph','reference-specific','reference-specific','vintage/discontinued','Family guidance only','Sinn/reference records','Input appears to combine model/family notation; exact case reference required.',true],
['Bremont','Bremont Kingsman','Kingsman limited-edition family','','Automatic chronograph','reference-specific','reference-specific','limited edition','Family guidance only','Bremont/reference records','220/500 appears to be limited-edition number, not watch reference.',true],
['Chanel','CHANEL J12','J12 chronograph family','2894-2,ETA2894-2','Automatic chronograph','reference-specific','reference-specific','multiple generations','Family guidance only','Chanel/reference records','J12 is a collection; exact ceramic/case reference required.',true],
['Bell & Ross','BR03','BR 03 family','BR-CAL.302,SW300-1','Automatic','42 mm common','reference-specific','multiple generations','Family guidance only','Bell & Ross official/reference records','BR03 is too broad for an exact mapping.',true],
['Omega','OMEGA SEAMASTER','Seamaster Professional 300M quartz family','1538,CAL1538','Quartz analogue','reference-specific','battery powered','1990s–2000s','Brand corrected / family guidance','Omega/reference records','Correct brand is Omega; exact case reference required.',true],
['Omega','Omega Constellation','Constellation vintage family','561,CAL561','Automatic','reference-specific','reference-specific','vintage','Brand corrected / family guidance','Omega historical records','Correct brand is Omega. Calibre 561 helps date/type but does not give exact case reference.',true],
['Tudor','MT5402','Tudor manufacture calibre MT5402','MT5402','Automatic manufacture calibre','N/A','70 hours','modern','Not a watch reference','Tudor official technical records','MT5402 is a MOVEMENT CALIBRE, not a watch reference. Capture the actual case/watch reference instead.',true],
['Swatch x Omega','Swatch OMEGA Moonwatch','Bioceramic MoonSwatch Mission to Mars','QUARTZ','Quartz chronograph','42 mm','battery powered','2020s','Model identified / manual review','Swatch official collection records','Input is a product description, not a manufacturer reference number. Record under Swatch x Omega and capture the actual model/reference if available.',true]
];

const q=s=>String(s||'').trim().toUpperCase();
const esc=s=>String(s).replace(/[.*+?^$(){}|[\]\\]/g,'\\$&');
function exactPattern(ref){
  const s=esc(ref).replace(/\\\./g,'[.]?').replace(/\\-/g,'[-]?').replace(/\s+/g,'\\s*');
  return new RegExp('^'+s+'$','i');
}
function targetFor(brand){
  if(brand==='Omega') return OMEGA_REFERENCE_RULES;
  if(brand==='Cartier') return CARTIER_REFERENCE_RULES;
  if(brand==='Tudor') return TUDOR_REFERENCE_RULES;
  if(brand==='Breitling') return BREITLING_REFERENCE_RULES;
  return OTHER_REFERENCE_RULES;
}
function add(row){
  const [brand,ref,family,cals,technology,size,reserve,production,confidence,source,notes,manualFlag]=row;
  const target=targetFor(brand);
  if(!Array.isArray(target)) return;
  const pattern=exactPattern(ref);
  for(let i=target.length-1;i>=0;i--){
    const x=target[i];
    const brandOK=target!==OTHER_REFERENCE_RULES || q(x.brand)===q(brand);
    if(brandOK && q(x.baseReference)===q(ref)) target.splice(i,1);
  }
  const calibre=String(cals||'').split(',').map(x=>x.trim()).filter(Boolean);
  const manual=manualFlag===true || /Family guidance|Data conflict|Not a watch reference|manual review|Brand corrected/i.test(confidence);
  target.unshift({
    ...(target===OTHER_REFERENCE_RULES?{brand}:{}),
    pattern,
    baseReference:ref,
    family,
    size:size||'Reference-specific',
    calibre,
    calibreDisplay:calibre[0]||'Not specified',
    technology:technology||'Reference-specific',
    reserve:reserve||'Not specified',
    production:production||'Not specified',
    notes:notes||'Researched from Watch Auth Pro v2.86.0 missing-reference queue.',
    source,
    confidence,
    ...(manual?{manualReview:true}:{})
  });
}
rows.forEach(add);

if(typeof DATABASE_META!=='undefined'&&DATABASE_META){
  DATABASE_META.version='2.88.0';
  DATABASE_META.updated='6 October 2026';
  DATABASE_META.scope='Missing-reference research merge: verified exact/base references, brand corrections, family-only manual guidance, and Sinn specialist service warnings. Unresolved references remain excluded pending research.';
}
})();