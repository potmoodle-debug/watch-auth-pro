/* Watch Auth Pro v2.89.0 — focused missing-information batch, 6 October 2026
   Sources: Tudor official product/movement pages; Omega official product page;
   Cartier specialist/retailer/archive cross-checks; Bremont official/reference records.
*/
(function(){
'use strict';

const rows = [
['Tudor','25600T','Pelagos 42 family (incomplete base reference)','MT5612','Automatic manufacture calibre','42 mm titanium/steel','70 hours','2015–present family','Family guidance only','TUDOR official Pelagos records','INCOMPLETE REFERENCE: full executions include 25600TN (black) and 25600TB (blue). MT5612, date, helium escape valve, 500 m water resistance. Do not infer dial colour until final suffix is confirmed.',true],
['Cartier','W31010M7','Pasha C','049,CAL049','Automatic','35 mm steel','approximately 42 hours','late 1990s–2010s','High','Cartier specialist/reference records','Pasha C steel automatic; Calibre 049; date; approximately 100 m water resistance.'],
['Cartier','VENDOME','Must de Cartier Vendôme family','81,CAL81','Quartz analogue','approximately 24 mm common','battery powered','1980s–1990s family','Family guidance only','Cartier auction/reference records','MODEL NAME ONLY: Vendôme spans multiple references and case materials. Calibre 81 is strongly documented across Must de Cartier Vendôme examples, but the actual case/reference number must be recorded before exact mapping.',true],
['Tudor','7943A1A0','Black Bay 68 base reference','MT5601-U,MT5601U','Automatic manufacture calibre','43 mm steel','70 hours','2025–present','High','TUDOR official Black Bay 68 product page','Base reference for Black Bay 68. Full execution includes suffix such as M7943A1A0NU-0001. Correct movement is MT5601-U (COSC and METAS), not plain MT5601.'],
['Bremont','SUPERMARINE','Supermarine collection','SW300-1,BE-92AV,BE-36AE','Automatic / reference-dependent','40–43 mm common','reference-dependent','multiple generations','Family guidance only','Bremont official collection and specialist movement records','MODEL NAME ONLY: Supermarine spans S300/S301, S500/S501 and later 300M/500M generations. SW300-1 can appear in later BE-92AV/BB64-family executions, while older steel models commonly use BE-36AE. Exact case reference is required before assigning calibre or water resistance.',true],
['Omega','232.30.46.51.01.001','Seamaster Planet Ocean 600M Co-Axial Chronograph','9300,CAL9300','Automatic Co-Axial chronograph','45.5 mm steel','60 hours','2011 generation','Official / high confidence','OMEGA official product page','Black dial and ceramic unidirectional bezel; steel bracelet; 600 m water resistance; helium escape valve; display caseback.'],
['Cartier','W6920085','Ballon Bleu de Cartier','076,CAL076','Automatic','33 mm steel','reference-specific','2010s','High','Cartier retailer/reference records','Ballon Bleu 33 mm, silver dial, leather strap, automatic Calibre 076, approximately 30 m water resistance.']
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
  target.unshift({
    ...(target===OTHER_REFERENCE_RULES?{brand}:{}),
    pattern,
    baseReference:ref,
    family,
    size,
    calibre,
    calibreDisplay:calibre[0]||'Not specified',
    technology,
    reserve,
    production,
    notes,
    source,
    confidence,
    ...(manualFlag?{manualReview:true}:{})
  });
}
rows.forEach(add);

if(typeof DATABASE_META!=='undefined'&&DATABASE_META){
  DATABASE_META.version='2.89.0';
  DATABASE_META.updated='6 October 2026';
  DATABASE_META.scope='Focused missing-information batch: Tudor 25600T and 7943A1A0, Cartier W31010M7/Vendome/W6920085, Bremont Supermarine family guidance, and Omega 232.30.46.51.01.001.';
}
})();