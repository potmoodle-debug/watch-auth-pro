/* Watch Auth Pro v2.84.0 — researched missing-reference merge
   Source: watch-auth-pro-missing-references-v2.83.0.csv — 24 September 2026
   Exact/safely-normalised mappings are installed. Broad collection labels remain manual-review.
   The non-reference value "RMA" is deliberately not added to the watch-reference database.
*/
(function(){
'use strict';

const rows = [
['Omega','3513.53.00','Speedmaster Mark 40 / Automatic Date','1152,CAL1152','Automatic chronograph','39 mm','approximately 44 hours','1990s–early 2000s','High confidence','Omega/reference specialist records',''],
['Seiko','SRPL91K1','Seiko 5 Sports SKX Series Heritage Design Re-creation Limited Edition','4R36,4R36A','Automatic with manual winding','38.2 mm','approximately 41 hours','2020s','Official / high confidence','Seiko official product page','Limited edition of 9,999 pieces.'],
['Omega','2200.50.00','Seamaster Planet Ocean 600M','2500,CAL2500','Automatic Co-Axial chronometer','45.5 mm','approximately 48 hours','2000s–2010s','High confidence','Omega/reference specialist records',''],
['Omega','SPEEDMASTER MKII','Speedmaster Mark II family','861,CAL861','Manual-wind chronograph','approximately 41.7 mm','approximately 48 hours','1969–1970s','Family guidance only','Omega historical/reference records','Exact case reference is still required because Speedmaster Mark II exists in multiple executions.'],
['Sinn','Sinn U1 SDR','U1 SDR','SW200-1,SELLITASW200-1','Automatic','44 mm','approximately 38 hours','current/recent production','High confidence','Sinn official specifications / authorised retailer','German Submarine Steel case; 1,000 m water resistance.'],
['Omega','324.23.38.50.02.002','Speedmaster 38 Co-Axial Chronograph','3330,CAL3330','Automatic Co-Axial chronograph','38 mm','approximately 52 hours','2020s','High confidence','Omega/reference records','Two-tone steel/Sedna-gold configuration on strap.'],
['Omega','COSMIC 2000','Seamaster Cosmic 2000 family','1012,1022,1010','Automatic','Reference-specific','Reference-specific','1970s','Family guidance only','Omega historical/reference records','Cosmic 2000 is a collection/family label; movement and exact case reference must be confirmed from the watch.'],
['Cartier','Cartier Vendome','Vendôme / Trinity-era family','81,CAL81','Quartz','Reference-specific','battery powered','1980s','Family guidance only','Cartier vintage auction/reference records','Calibre 81 is documented in Vendôme ref. 8100, but the model name alone is not an exact reference.'],
['TAG Heuer','WAW131B','Aquaracer Lady family','QUARTZ','Quartz analogue','approximately 32 mm','battery powered','2010s','Medium confidence','TAG Heuer/reference records','Preserve the full suffix when present to identify the exact dial/bracelet configuration.'],
['Omega','OMEGA Seamaster','Seamaster collection','REFERENCE REQUIRED','Reference-dependent','Reference-specific','Reference-specific','multiple generations','Family guidance only','Omega collection records','Collection name only. Exact reference is required before assigning a calibre or production period.'],
['Breitling','VB5510','Exospace B55','Breitling 55,B55','Rechargeable SuperQuartz ana-digi','46 mm','rechargeable battery','2015–2020s','High confidence','Breitling specialist reference records','Black titanium connected chronograph.'],
['Bremont','Bremont ALT1-P2','ALT1-P2 Pilot Chronograph','BE-53AE','Automatic chronometer chronograph','43 mm','42 hours','discontinued','Official / high confidence','Bremont official product page','Observed base calibre 7750 may describe architecture, but Bremont specifies the finished movement as BE-53AE.'],
['Fears','BS23800B','Brunswick 38 Midas II','ETA7001,7001','Manual wind','38 mm','40 hours','2020s','High confidence','Fears launch/reference records','22K gold-plated steel case; individually numbered.'],
['Tudor','12510','Style 38','2824,2824-2,ETA2824-2','Automatic','38 mm','approximately 38 hours','2010s–2020s','High confidence','Tudor/reference market records','Tudor Style 38 family.'],
['Generic','FC-303WGH5B4','Frederique Constant Classics Index Automatic family','FC-303,SW200-1','Automatic','Reference-specific','approximately 38 hours','2010s–2020s','High confidence','Frederique Constant/reference records','Reference identifies Frederique Constant; use that brand when available.'],
['Generic','Parmigiani TONDA','Parmigiani Fleurier Tonda PF Micro-Rotor family','PF703','Automatic micro-rotor','40 mm','48 hours','2020s','Family guidance only','Parmigiani Fleurier official movement records','TONDA alone is not a complete reference; PF703 is correct for Tonda PF Micro-Rotor variants.'],
['IWC','IW370601','Porsche Design by IWC chronograph family','7922,IWC7922','Automatic chronograph','Reference-specific','Reference-specific','1980s–1990s','Medium-high confidence','IWC/reference specialist records','Exact execution should be confirmed against case/dial configuration.'],
['Breitling','A17325','Navitimer Automatic 38','Breitling 17,SW200-1','Automatic','38 mm','approximately 38 hours','late 2010s–2020s','High confidence','Breitling/reference records',''],
['Generic','49.9000.670','Zenith DEFY Classic ceramic family','Elite 670 SK,670SK,670','Automatic','41 mm','minimum 48 hours','late 2010s–2020s','Official / high confidence','Zenith press technical data','Reference stem belongs to Zenith DEFY Classic ceramic executions.'],
['Omega','212.30.36.20.01.002','Seamaster Diver 300M','2500,CAL2500','Automatic Co-Axial chronometer','36.25 mm','48 hours','2010s','Official / high confidence','Omega official product sheet','Steel bracelet, black dial, 300 m water resistance.'],
['Seiko','7S36-5000','Seiko automatic 7S36-5000 family','7S36,7S36A','Automatic','Reference-specific','approximately 40 hours','2000s','High confidence','Seiko parts/reference records','Case code 7S36-5000; exact dial suffix determines configuration.'],
['Generic','Nomos Glashutte Tangente','NOMOS Glashütte Tangente family','ALPHA,DUW4101,DUW3001','Manual or automatic depending exact reference','33–41 mm','Reference-specific','1990s–present','Family guidance only','NOMOS official Tangente collection','Collection name only; exact NOMOS reference is required before assigning calibre.'],
['Omega','232.32.46.21.01.001','Seamaster Planet Ocean 600M','8500,CAL8500','Automatic Co-Axial chronometer','45.5 mm','60 hours','2010s','High confidence','Omega/reference records',''],
['Generic','95.9000.670','Zenith DEFY Classic titanium family','Elite 670 SK,670SK,670','Automatic','41 mm','minimum 48 hours','2018–2020s','Official / high confidence','Zenith press technical data','Reference stem used for titanium DEFY Classic executions.'],
['TAG Heuer','WBE5114','Autavia Calibre 5 COSC','Calibre 5,CAL5','Automatic','42 mm','Reference-specific','late 2010s–2020s','Official / high confidence','TAG Heuer official product page','Discontinued Autavia 42 mm family; suffix identifies strap/bracelet.'],
['Cartier','WSCA0006','Calibre de Cartier Diver Carbon','1904-PS MC,1904PSMC','Automatic','42 mm','approximately 48 hours','2010s','High confidence','Cartier authorised retailer specifications','300 m diver; ADLC-coated steel case.'],
['TAG Heuer','CAU2011','Formula 1 Calibre 16 Chronograph','Calibre 16,CAL16','Automatic chronograph','44 mm','approximately 42–48 hours','2010s','High confidence','TAG Heuer/reference records',''],
['Omega','2305.15','Seamaster quartz family','1438,CAL1438','Quartz analogue','Reference-specific','battery powered','1990s','Medium-high confidence','Omega/reference records','Exact punctuation/suffix should be retained when available.'],
['Cartier','W25075Z5','Santos Demoiselle Small','157,CAL157','Quartz','20 x 28 mm','battery powered','2000s','High confidence','Cartier specialist/reference records','Pink mother-of-pearl examples are documented; calibre 157.'],
['IWC','IW328908','Ingenieur Automatic 40 F1 edition','32111,IWC32111','Automatic','40 mm','120 hours','2025','High confidence','IWC/reference records','Green dial special F1-associated execution.'],
['Cartier','W1014154','Tank / Trinity-era rectangular Cartier','QUARTZ','Quartz','approximately 26 mm','battery powered','vintage/discontinued','Medium confidence','Cartier/reference market records','Reference is consistently documented as quartz; exact Cartier calibre should be confirmed before hard assignment.'],
['Omega','Seamaster','Seamaster collection','REFERENCE REQUIRED','Reference-dependent','Reference-specific','Reference-specific','multiple generations','Family guidance only','Omega collection records','Collection name only; exact reference required.'],
['Omega','329.30.44.51.04.001','Speedmaster Racing Co-Axial Master Chronometer','9900,CAL9900','Automatic Co-Axial Master Chronometer chronograph','44.25 mm','60 hours','late 2010s–2020s','High confidence','Omega/reference records',''],
['Grand Seiko','SBGE253G','Sport Collection GMT Spring Drive','9R66,9R66A','Spring Drive automatic GMT','40.5 mm','72 hours','2020s','High confidence','Grand Seiko/reference records',''],
['Generic','30 0040 680','Glashütte Original Senator / vintage-reference family','680','Automatic','Reference-specific','Reference-specific','vintage/discontinued','Medium confidence','Glashütte Original/reference records','Reference format identifies Glashütte Original; exact model configuration requires confirmation.'],
['Generic','CLASSICO DUAL TIME','Ulysse Nardin Classico Dual Time family','UN-324,UN324','Automatic dual time','Reference-specific','approximately 48 hours','2010s','Family guidance only','Ulysse Nardin/reference records','Collection/model label only; exact Ulysse Nardin reference still required.'],
['Cartier','Panthere','Panthère de Cartier collection','REFERENCE REQUIRED','Quartz in many modern/vintage variants','Reference-specific','battery powered','multiple generations','Family guidance only','Cartier collection records','Model name only; exact reference required.'],
['Cartier','WSSA0022','Santos-Dumont Large','High-autonomy quartz','Quartz','43.5 x 31.4 mm','approximately 6-year battery','2020s','High confidence','Cartier authorised retailer specifications','Observed calibre 157 should not be used for this reference.'],
['Tudor','79350','Black Bay Chronograph','MT5813','Automatic chronograph','41 mm','70 hours','2017–2021','High confidence','Tudor/reference records','First-generation Black Bay Chronograph.'],
['Breitling','A17330','Superocean automatic family','2824-2,ETA2824-2,Breitling 17','Automatic','Reference-specific','approximately 38–42 hours','2000s','Medium-high confidence','Breitling specialist reference records',''],
['Tudor','79640','Black Bay 36','MT5400','Automatic manufacture calibre','36 mm','70 hours','2023–present','Official / high confidence','TUDOR official press/product data',''],
['Omega','Speedmaster','Speedmaster collection','REFERENCE REQUIRED','Reference-dependent','Reference-specific','Reference-specific','multiple generations','Family guidance only','Omega collection records','Model name alone is insufficient; do not infer calibre 3861 without the exact reference.'],
['Tudor','2542G257','Pelagos FXD GMT family','MT5652','Automatic GMT manufacture calibre','42 mm','approximately 65 hours','2020s','Medium confidence','Tudor/reference records','Full reference formatting should be confirmed; observed MT5652 is consistent with modern Pelagos GMT architecture.'],
['Patek Philippe','4910/1200','Twenty~4','E15,E-15','Quartz','25 x 30 mm','battery powered','2020s','High confidence','Patek Philippe auction/reference records','Steel Twenty~4 quartz family.'],
['TAG Heuer','WAZ2114','Formula 1 Calibre 5','Calibre 5,CAL5','Automatic','41 mm','38 hours','2010s','Official / high confidence','TAG Heuer official product page','White-dial steel reference family.'],
['Bremont','Bremont Solo','Solo family','BE-36AE,SW220-1','Automatic','43 mm','approximately 38 hours','discontinued','Family guidance only','Bremont/reference records','Solo model name alone spans more than one execution; exact reference suffix required.'],
['Omega','PLANET OCEAN DEEP BLACK','Seamaster Planet Ocean 600M Deep Black family','8906,CAL8906','Automatic Co-Axial Master Chronometer GMT','45.5 mm','60 hours','2016–present generation','Family guidance only','Omega official Deep Black records','Model name identifies the family but colour/reference suffix is required for exact configuration.'],
['Generic','02 0500 420','Glashütte Original vintage/reference family','420 Z,420Z','Manual wind','Reference-specific','Reference-specific','vintage/discontinued','Medium confidence','Glashütte Original/reference records','Reference identifies Glashütte Original; exact model requires confirmation.'],
['Generic','292X4P4/5/6','Raymond Weil / quartz reference family','5030.D,RONDA5030.D','Quartz chronograph','Reference-specific','battery powered','Reference-specific','Low-medium confidence','Specialist movement/reference cross-check','Reference text needs brand confirmation before being promoted to a brand-specific exact mapping.'],
['Cartier','W31015M7','Pasha C','049,CAL049','Automatic','35 mm','approximately 42 hours','1990s–2000s','High confidence','Cartier certified pre-owned/reference records','Automatic Pasha C with date.'],
['Breitling','UB3111','Superocean Heritage / modern Breitling family','B31,Breitling B31','Automatic','Reference-specific','approximately 78 hours','2020s','Medium confidence','Breitling/reference records','Full suffix is required to confirm exact material/dial execution.'],
['Generic','BR03-92-DIV-C','Bell & Ross BR 03-92 Diver','BR-CAL.302,2892A2','Automatic','42 mm','approximately 38–54 hours','2010s–2020s','High confidence','Bell & Ross/reference records','Reference identifies Bell & Ross; use that brand when available.'],
['Breitling','A17375','Superocean Automatic 42','Breitling 17,SW200-1','Automatic','42 mm','approximately 38 hours','2022–present','High confidence','Breitling/reference records','300 m diver.'],
['Omega','Aqua Terra Worldtimer','Seamaster Aqua Terra Worldtimer family','8938,CAL8938','Automatic Co-Axial Master Chronometer worldtimer','43 mm','60 hours','2017–present family','Family guidance only','Omega official Worldtimer records','Model name only; exact reference determines steel/titanium/strap configuration.'],
['TAG Heuer','WV211B-3','Carrera Calibre 5 family','Calibre 5,CAL5','Automatic','approximately 39 mm','approximately 38 hours','2000s–2010s','High confidence','TAG Heuer/reference records',''],
['IWC','IW329301','Big Pilot’s Watch 43','82100,IWC82100','Automatic','43 mm','60 hours','2020s','Official / high confidence','IWC official product page','Pellaton automatic winding.'],
['Longines','L3.764.4','HydroConquest family','L888.6,L888','Automatic','Reference-specific','approximately 72 hours','2020s','High confidence','Longines/reference records','Full suffix identifies exact dial/bracelet execution.'],
['Grand Seiko','SBGR319','Heritage Collection Limited Edition','9S68,9S68A','Automatic with manual winding','42 mm','72 hours','limited edition','Official / high confidence','Grand Seiko official product page','Limited edition of 350 pieces.'],
['Sinn','Sinn 104','104 St Sa family','SW220-1,SELLITASW220-1','Automatic','41 mm','approximately 38 hours','current/recent production','High confidence','Sinn/reference records','Model label still benefits from exact suffix for dial/bracelet configuration.'],
['Omega','25173000','Seamaster Professional quartz','1538,CAL1538','Quartz analogue','41 mm','approximately 42-month battery','1990s–2000s','High confidence','Omega/reference records',''],
['Omega','220.10.41.21.10.001','Seamaster Aqua Terra 150M','8900,CAL8900','Automatic Co-Axial Master Chronometer','41 mm','60 hours','2020s–present','Official / high confidence','Omega official product sheet','Green dial, steel bracelet.'],
['Tudor','79330','Heritage Chrono family','2892A2,ETA2892A2','Automatic chronograph','42 mm','approximately 42 hours','2010s','Medium-high confidence','Tudor/reference records','Exact suffix/variant required for dial and strap configuration.'],
['Vertex','M100B','M100B','7001,ETA7001','Manual wind','40 mm','approximately 42 hours','modern production','High confidence','Vertex/reference records','Modern military-inspired hand-wound model.'],
['TAG Heuer','CAZ201G','Formula 1 Calibre 16 Chronograph','Calibre 16,CAL16','Automatic chronograph','44 mm','approximately 42–48 hours','2010s–2020s','High confidence','TAG Heuer/reference records',''],
['TAG Heuer','WAY201A','Aquaracer 300M Calibre 5','Calibre 5,CAL5','Automatic','43 mm','approximately 38 hours','2010s','High confidence','TAG Heuer/reference records','Black-dial 300 m family.'],
['Panerai','PAM00091','Luminor Marina Automatic Titanium','OP III,OPIII,7750-P1','Automatic','44 mm','approximately 42 hours','2001–2004 era','High confidence','Panerai/reference records','Titanium case; date and small seconds.'],
['TAG Heuer','AF2010','Aquaracer / 2000-series family','Calibre 16,CAL16','Automatic chronograph','Reference-specific','Reference-specific','2000s','Medium confidence','TAG Heuer/reference specialist records','Reference should be checked for complete prefix/suffix before final exact-model naming.'],
['Tudor','74000','Prince Oysterdate','2824-2,ETA2824-2','Automatic','34 mm','approximately 38 hours','1980s–2000s','High confidence','Tudor/reference records',''],
['Omega','Seamaster Professional','Seamaster Professional collection','REFERENCE REQUIRED','Reference-dependent','Reference-specific','Reference-specific','multiple generations','Family guidance only','Omega collection records','Model-family text only; exact reference required.'],
['TAG Heuer','CBG2A10','Carrera Heuer 02 Skeleton Chronograph','HEUER02,Calibre HEUER02','Automatic manufacture chronograph','45 mm','80 hours','late 2010s–2020s','Official / high confidence','TAG Heuer official product page','Steel/ceramic Carrera family; suffix identifies strap/bracelet.']
];

const q=s=>String(s||'').trim().toUpperCase();
const esc=s=>String(s).replace(/[.*+?^$(){}|[]\\]/g,'\\$&');
function exactPattern(ref){
  if (/^[A-Z0-9 .\/-]+$/i.test(ref)) {
    let s=esc(ref).replace(/\\\./g,'[.]?').replace(/\\-/g,'[-]?').replace(/\s+/g,'\\s*');
    return new RegExp('^'+s+'$','i');
  }
  return new RegExp('^'+esc(ref)+'$','i');
}
function targetFor(brand){
  if(brand==='Omega') return OMEGA_REFERENCE_RULES;
  if(brand==='Cartier') return CARTIER_REFERENCE_RULES;
  if(brand==='Tudor') return TUDOR_REFERENCE_RULES;
  if(brand==='Breitling') return BREITLING_REFERENCE_RULES;
  return OTHER_REFERENCE_RULES;
}
function add(row){
  const [brand,ref,family,cals,technology,size,reserve,production,confidence,source,notes]=row;
  const target=targetFor(brand);
  if(!Array.isArray(target)) return;
  const pattern=exactPattern(ref);
  for(let i=target.length-1;i>=0;i--){
    const x=target[i];
    const brandOK=target!==OTHER_REFERENCE_RULES || q(x.brand)===q(brand);
    if(brandOK && (q(x.baseReference)===q(ref) || (x.pattern instanceof RegExp && (x.pattern.test(ref) || (x.pattern.lastIndex=0,false))))) target.splice(i,1);
  }
  const manual=/Family guidance only|Low-medium confidence/i.test(confidence);
  const calibre=cals?cals.split(','):[];
  target.unshift({
    ...(target===OTHER_REFERENCE_RULES?{brand}:{}),
    pattern,
    baseReference:ref,
    family,
    size:size||'Reference-specific',
    calibre,
    calibreDisplay:calibre[0]||'Not specified',
    technology:technology||'Movement type not specified',
    reserve:reserve||'Not specified',
    production:production||'Not specified',
    notes:notes||'Researched mapping from the v2.83.0 missing-reference export.',
    source,
    confidence,
    ...(manual?{manualReview:true}:{})
  });
}
rows.forEach(add);

if(typeof DATABASE_META!=='undefined'&&DATABASE_META){
  DATABASE_META.version='2.84.0';
  DATABASE_META.updated='24 September 2026';
  DATABASE_META.scope='v2.83 missing-reference research merge: exact mappings added, broad labels retained as manual-review, and RMA queue noise excluded from reference data.';
}
})();