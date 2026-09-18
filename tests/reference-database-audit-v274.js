/* Watch Auth Pro v2.74.0 — duplicate/reference integrity tests
   Runs only with ?selftest=1 or localStorage WAP_SELFTEST=1.
*/
(function(){
  'use strict';
  function enabled(){
    try{return new URLSearchParams(location.search).get('selftest')==='1'||localStorage.getItem('WAP_SELFTEST')==='1';}
    catch(e){return false;}
  }
  if(!enabled()) return;

  const cases = [
    ['Cartier','W20072X7','Santos 100','049'],
    ['Cartier','WB701851','Tank Américaine','157'],
    ['Cartier','W20073X8','Santos 100','049'],
    ['Grand Seiko','SBGA429','Soko Special Edition','9R65'],
    ['Maurice Lacroix','AI6007','AIKON','ML115'],
    ['Hublot','511.NX.1170.RX','Classic Fusion','HUB1112'],
    ['TAG Heuer','WAY201B','Aquaracer','Calibre 5'],
    ['Breitling','A17376','Superocean Automatic 44','Breitling 17'],
    ['Breitling','A59028','Jupiter Pilot','Breitling 59'],
    ['Panerai','PAM01305','Submersible','P.9010'],
    ['TAG Heuer','WBD1420','Aquaracer Date','Quartz'],
    ['Breitling','A44364','Bentley','44B'],
    ['TAG Heuer','WBP2110','Aquaracer Professional 200 Date','Calibre 5'],
    ['Seiko','SLA079J1','Marinemaster','8L35']
  ];

  function countMatching(brand, ref) {
    let count = 0;
    const b = String(brand).toUpperCase();
    const test = (r) => {
      if(!r) return false;
      const rb = String(r.brand||'').toUpperCase();
      if(rb && rb !== b) return false;
      const base = String(r.baseReference||'').toUpperCase();
      if(base === String(ref).toUpperCase()) return true;
      if(r.pattern instanceof RegExp){ r.pattern.lastIndex=0; return r.pattern.test(ref); }
      if(Array.isArray(r.refs)) return r.refs.some(x=>String(x).replace(/[^A-Z0-9]/gi,'').toUpperCase()===String(ref).replace(/[^A-Z0-9]/gi,'').toUpperCase());
      return false;
    };
    const groups = [
      typeof OMEGA_REFERENCE_RULES!=='undefined'?OMEGA_REFERENCE_RULES:[],
      typeof TUDOR_REFERENCE_RULES!=='undefined'?TUDOR_REFERENCE_RULES:[],
      typeof BREITLING_REFERENCE_RULES!=='undefined'?BREITLING_REFERENCE_RULES:[],
      typeof CARTIER_REFERENCE_RULES!=='undefined'?CARTIER_REFERENCE_RULES:[],
      typeof OTHER_REFERENCE_RULES!=='undefined'?OTHER_REFERENCE_RULES:[]
    ];
    groups.forEach(g=>g.forEach(r=>{ if(test(r)) count++; }));
    return count;
  }

  queueMicrotask(function(){
    const api = window.WAPReferenceLookup;
    const results = cases.map(([brand,ref,model,cal])=>{
      const hit = api?.resolve(brand,ref);
      const family = String(hit?.rule?.family||'');
      const calibre = String(hit?.rule?.calibreDisplay||'');
      const duplicateCount = countMatching(brand,ref);
      return {
        brand, ref, family, calibre, duplicateCount,
        pass: !!hit?.rule && family.toUpperCase().includes(model.toUpperCase()) &&
              calibre.toUpperCase().includes(cal.toUpperCase()) && duplicateCount===1
      };
    });
    const passed=results.filter(x=>x.pass).length;
    window.WAP_V274_AUDIT_RESULTS={passed,failed:results.length-passed,total:results.length,results};
    console.group('[Watch Auth Pro v2.74 audit] '+passed+'/'+results.length+' passed');
    console.table(results);
    if(passed!==results.length) console.error('v2.74 reference audit has failures.');
    else console.info('All consolidated reference mappings resolve once with expected model/calibre.');
    console.groupEnd();
  });
})();