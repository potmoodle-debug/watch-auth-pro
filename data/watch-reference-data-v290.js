/* Watch Auth Pro v2.90.0 — missing-reference export research, 6 October 2026
   Source: watch-auth-pro-missing-references-v2.88.0.csv
   Policy:
   - exact/base-reference matches are installed;
   - incomplete/model-name values are guidance-only;
   - conflicting observations are flagged for re-check;
   - unresolved Generic B5 / ST 1-11 is deliberately excluded.
*/
(function(){
'use strict';

const rows = [
['Longines','L3.835','Conquest Chronograph family (incomplete reference)','L898.5,L898','Automatic chronograph','42 mm steel / ceramic bezel','59 hours','2023–present family','Family guidance only','Longines official Conquest Chronograph records','INCOMPLETE REFERENCE: L3.835 is a family/base stem. Full references such as L3.835.4.72.6 / L3.835.4.98.6 identify the exact dial/bracelet. Observed L898.5 is consistent with this family. 100 m water resistance.',true],
['Panerai','PAM01271','Luminor Marina Quaranta','P.900,P900','Automatic','40 mm steel','3 days','2021–2022 generation','High','Panerai/reference records','White dial Luminor Marina Quaranta; 100 m water resistance. PAM01371 succeeded PAM01271.'],
['TAG Heuer','WW2110-0','Monaco Calibre 6','CALIBRE6,CAL6,2895-2,ETA2895-2','Automatic','37 mm steel','reference-specific','c. 2010s','High','Phillips / TAG Heuer specialist records','Monaco Calibre 6; black dial; date; approximately 50 m water resistance. Movement architecture documented as ETA 2895-2 / TAG Heuer Calibre 6.'],
['Omega','42410402003001','De Ville Prestige Co-Axial Chronometer','2500,CAL2500','Automatic Co-Axial chronometer','39.5 mm steel','48 hours','2010s–2020s','Official / high confidence','OMEGA official product page','Normalised form of 424.10.40.20.03.001. Blue dial, steel bracelet, date, chronometer, 30 m water resistance.'],
['Omega','SEAMASTER','Vintage Seamaster family — calibre 565 observation','565,CAL565','Automatic with date','reference-specific','approximately 38 hours','1960s–1970s','Family guidance only','Omega vintage calibre/reference records','MODEL NAME ONLY: calibre 565 is valid in numerous vintage Seamaster references, but "Seamaster" alone is not enough to identify the case. Use the inside-caseback reference before exact mapping.',true],
['Generic','79220','Tudor Heritage Black Bay / Black Bay ETA generation','2824-2,ETA2824-2','Automatic','41 mm steel','approximately 38 hours','2012–2016 standard family; special examples later','Brand correction / high confidence','Sotheby’s Tudor reference records','Correct brand is TUDOR. Ref. 79220 is the ETA-based Black Bay generation; full suffix (e.g. R/B/N) normally identifies bezel colour. Calibre 2824 automatic, 200 m family.',true],
['IWC','IW388113','Pilot’s Watch Chronograph 41','69385,IWC69385','Automatic manufacture chronograph','41 mm steel','46 hours','2022–present','Official / high confidence','IWC official product/press records','Black dial on 5-link steel bracelet; column-wheel chronograph; day/date; 100 m water resistance.'],
['Breitling','UB0121','Navitimer 1 B01 Chronograph 43 two-tone family','B01,BREITLING01','Automatic manufacture chronograph','43 mm steel / red-gold details','70 hours','late 2010s–early 2020s','High','Breitling/reference records','Two-tone Navitimer B01 43 family. Full suffix identifies exact dial/strap/bracelet configuration.'],
['Panerai','PAM00287','Radiomir Black Seal Automatic','OPIII,OP III','Automatic','45 mm steel','reference-specific','2007–2011','High','Panerai specialist/reference records','Black dial; 100 m water resistance; Radiomir Black Seal Automatic.'],
['Omega','SEAMASTER PRO DIVER','Seamaster / Omegamatic observation conflict','1400,CAL1400','Autoquartz / Omegamatic','reference-specific','reference-specific','late 1990s–early 2000s','Data conflict / manual review','Omega calibre records / auction reference records','RE-CHECK REQUIRED: Omega calibre 1400 is an Autoquartz/Omegamatic movement (ETA 205.111 family), not a conventional Seamaster Professional meca-quartz calibre. The model text "Seamaster Pro Diver" and observed technology should not be learned as an exact mapping without the case reference.',true],
['Tudor','25407','Pelagos 39 family (incomplete reference)','MT5400','Automatic manufacture calibre','39 mm grade 2 titanium','70 hours','2022–present','Family guidance only','TUDOR official Pelagos 39 technical records','INCOMPLETE REFERENCE: official base is 25407N / full execution M25407N-0001. MT5400 COSC, 200 m, titanium case/bracelet.',true],
['Tudor','25707','Pelagos FXD family (incomplete reference)','MT5602','Automatic manufacture calibre','42 mm titanium / carbon-composite variant dependent','70 hours','2021–present family','Family guidance only','TUDOR official Pelagos FXD records','INCOMPLETE REFERENCE: 25707 identifies Pelagos FXD family stems; suffix is required for the exact execution. MT5602, 200 m, fixed-strap-bar architecture.',true]
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
  DATABASE_META.version='2.90.0';
  DATABASE_META.updated='6 October 2026';
  DATABASE_META.scope='Missing-reference export research: Longines L3.835, Panerai PAM01271/PAM00287, TAG Heuer WW2110-0, Omega 42410402003001 and family guidance, IWC IW388113, Breitling UB0121, Tudor 25407/25707, and Generic 79220 brand correction.';
}
})();