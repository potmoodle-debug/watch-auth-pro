/* Watch Auth Pro v2.73.0 — reference lookup regression tests
   Runs only when the URL contains ?selftest=1 or localStorage WAP_SELFTEST=1.
*/
(function(){
  'use strict';
  function enabled(){
    try{return new URLSearchParams(location.search).get('selftest')==='1'||localStorage.getItem('WAP_SELFTEST')==='1';}catch(e){return false;}
  }
  if(!enabled())return;

  const cases=[
    {brand:'Omega',ref:'215.90.44.21.99.001',model:'Planet Ocean',cal:'8900'},
    {brand:'Omega',ref:'2254.50',model:'Seamaster',cal:'1120'},
    {brand:'Tudor',ref:'79012',model:'Black Bay',cal:'MT5400'},
    {brand:'Cartier',ref:'W20011C4',model:'Santos',cal:'687'},
    {brand:'Breitling',ref:'A17316',model:'Superocean',cal:'17'},
    {brand:'IWC',ref:'IW370703',model:'GST Chronograph',cal:'7922'},
    {brand:'TAG Heuer',ref:'CV2010-1',model:'Carrera',cal:'16'},
    {brand:'Grand Seiko',ref:'SBGA429',model:'Soko',cal:'9R65'},
    {brand:'Seiko',ref:'SSJ039J1',model:'Astron',cal:'3X62'},
    {brand:'Hublot',ref:'511.NX.1170.RX',model:'Classic Fusion',cal:'HUB1112'},
    {brand:'Maurice Lacroix',ref:'AI6007',model:'AIKON',cal:'ML115'},
    {brand:'DAMASKO',ref:'DC66',model:'DC66',cal:'7750'},
    {brand:'AWAKE',ref:'Jurassic Watch RAPTORS',model:'RAPTORS',cal:'G101'},
    {brand:'M.A.D',ref:'M.A.D. 2',model:'M.A.D.2',cal:'G101'},
    {brand:'Bremont',ref:'Supermarine S300',model:'Supermarine S300',cal:'BE-92AE'},
    {brand:'Christopher Ward',ref:'C60 Trident Lumière',model:'C60 Trident Lumière',cal:'SW300'},
    {brand:'Longines',ref:'L3.410.4',model:'Spirit',cal:'L888.4'},
    {brand:'Panerai',ref:'PAM01305',model:'Submersible',cal:'P.9010'}
  ];
  const unknown=[
    {brand:'Omega',ref:'THIS-IS-NOT-A-REFERENCE'},
    {brand:'TAG Heuer',ref:'ZZZ999'},
    {brand:'IWC',ref:'IW000000'},
    {brand:'DAMASKO',ref:'NOTDC66'}
  ];

  function run(){
    const api=window.WAPReferenceLookup;
    if(!api){console.error('[Watch Auth Pro self-test] lookup API missing');window.WAP_REFERENCE_TEST_RESULTS={passed:0,failed:1,error:'lookup API missing'};return;}
    const results=[];
    cases.forEach(c=>{
      const hit=api.resolve(c.brand,c.ref), r=hit&&hit.rule;
      const model=String(r?.family||''), cal=String(r?.calibreDisplay||'');
      const noUndefined=![r?.family,r?.size,r?.calibreDisplay,r?.reserve,r?.notes,r?.source,r?.confidence].some(v=>String(v).includes('undefined'));
      const pass=!!r&&model.toUpperCase().includes(c.model.toUpperCase())&&cal.toUpperCase().includes(c.cal.toUpperCase())&&noUndefined;
      results.push({pass,kind:'known',brand:c.brand,reference:c.ref,model,calibre:cal,source:hit?.source||''});
    });
    unknown.forEach(c=>{
      const hit=api.resolve(c.brand,c.ref), pass=!hit?.rule;
      results.push({pass,kind:'unknown',brand:c.brand,reference:c.ref,model:hit?.rule?.family||'',calibre:hit?.rule?.calibreDisplay||'',source:hit?.source||''});
    });
    const passed=results.filter(x=>x.pass).length, failed=results.length-passed;
    window.WAP_REFERENCE_TEST_RESULTS={version:api.version,passed,failed,total:results.length,results};
    console.group(`[Watch Auth Pro self-test] ${passed}/${results.length} passed`);
    console.table(results);
    if(failed)console.error(`${failed} reference lookup regression test(s) failed.`);else console.info('All reference lookup regression tests passed.');
    console.groupEnd();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>queueMicrotask(run),{once:true});else queueMicrotask(run);
})();