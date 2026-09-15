/* Watch Auth Pro v2.73.0 — data-driven reference lookup engine */
(function(){
  'use strict';
  const t=v=>String(v==null?'':v).trim();
  const bk=v=>t(v).toUpperCase();
  const raw=v=>t(v).toUpperCase();
  const compact=v=>raw(v).replace(/\s+/g,'');
  const test=(re,v)=>{if(!(re instanceof RegExp))return false;re.lastIndex=0;return re.test(v);};
  const firstCal=r=>r?.calibreDisplay||((Array.isArray(r?.calibre)&&r.calibre.length)?r.calibre[0]:r?.calibre)||'Not specified';

  function normaliseRule(r){
    if(!r)return null;
    r.family=t(r.family)||t(r.model)||'Reference identified';
    r.size=t(r.size)||'Reference-specific';
    r.reserve=t(r.reserve)||'Not specified';
    r.calibreDisplay=t(r.calibreDisplay)||t(firstCal(r));
    r.technology=t(r.technology)||'Movement type not specified';
    r.notes=t(r.notes)||'Exact researched reference mapping.';
    r.source=t(r.source)||'Watch Auth Pro researched reference records';
    r.confidence=t(r.confidence)||'Researched mapping';
    return r;
  }

  function normaliseAll(){
    [
      typeof OMEGA_REFERENCE_RULES!=='undefined'?OMEGA_REFERENCE_RULES:null,
      typeof TUDOR_REFERENCE_RULES!=='undefined'?TUDOR_REFERENCE_RULES:null,
      typeof BREITLING_REFERENCE_RULES!=='undefined'?BREITLING_REFERENCE_RULES:null,
      typeof CARTIER_REFERENCE_RULES!=='undefined'?CARTIER_REFERENCE_RULES:null,
      typeof OTHER_REFERENCE_RULES!=='undefined'?OTHER_REFERENCE_RULES:null
    ].filter(Array.isArray).forEach(a=>a.forEach(normaliseRule));
  }

  function findOtherRule(brand,value){
    if(typeof OTHER_REFERENCE_RULES==='undefined')return null;
    const b=bk(brand), rv=raw(value), cv=compact(value);
    if(!b||!rv)return null;
    const hit=OTHER_REFERENCE_RULES.find(r=>bk(r.brand)===b&&(test(r.pattern,rv)||test(r.pattern,cv)));
    return normaliseRule(hit||null);
  }

  function resolve(brand,value){
    const b=bk(brand), v=t(value);
    if(!b||!v)return {brand:t(brand),value:v,rule:null,source:'empty'};
    try{
      if(b==='OMEGA'&&typeof lookupOmegaReference==='function'){const h=lookupOmegaReference(v);return {brand:t(brand),value:v,rule:normaliseRule(h&&h.rule),source:'omega'};}
      if(b==='TUDOR'&&typeof lookupTudorReference==='function'){const h=lookupTudorReference(v);return {brand:t(brand),value:v,rule:normaliseRule(h&&h.rule),source:'tudor'};}
      if(b==='BREITLING'&&typeof lookupBreitlingReference==='function'){const h=lookupBreitlingReference(v);return {brand:t(brand),value:v,rule:normaliseRule(h&&h.rule),source:'breitling'};}
      if(b==='CARTIER'&&typeof lookupCartierReference==='function'){const h=lookupCartierReference(v);return {brand:t(brand),value:v,rule:normaliseRule(h&&h.rule),source:'cartier'};}
      return {brand:t(brand),value:v,rule:findOtherRule(brand,v),source:'other'};
    }catch(error){return {brand:t(brand),value:v,rule:null,source:'error',error};}
  }

  const recognised=(brand,value)=>{const h=resolve(brand,value);return !!(h.rule&&!h.rule.manualReview);};
  const supportedBrands=()=>typeof OTHER_REFERENCE_RULES==='undefined'?[]:[...new Set(OTHER_REFERENCE_RULES.map(r=>t(r.brand)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));

  function bestRef(brand){
    const c=t(document.getElementById('caseRef')?.value), f=t(document.getElementById('fullRef')?.value);
    if(f&&recognised(brand,f))return f;
    if(c&&recognised(brand,c))return c;
    return f||c;
  }

  function renderFallback(){
    if(typeof getSelectedBrand!=='function'||typeof renderInformationBox!=='function')return;
    const brand=getSelectedBrand(), b=bk(brand);
    if(['ROLEX','OMEGA','TUDOR','BREITLING','CARTIER'].includes(b))return;
    const value=bestRef(brand), h=value?resolve(brand,value):null, r=h&&h.rule, box=document.getElementById('caseResult');
    if(!r||!box)return;
    renderInformationBox(box,r.manualReview?'neutral':'info',r.manualReview?`${brand} reference requires manual review`:`${brand} reference identified`,
      `<strong>${r.family}</strong> · ${r.size}<div class="mt-1"><strong>Expected movement:</strong> ${r.calibreDisplay}</div><div class="mt-1"><strong>Power reserve:</strong> ${r.reserve}</div><div class="mt-2">${r.notes}</div><div class="provenance-line"><strong>Source:</strong> ${r.source}<br><strong>Confidence:</strong> ${r.confidence}</div>`);
  }

  function refreshSuggestions(){
    if(typeof getSelectedBrand!=='function'||typeof OTHER_REFERENCE_RULES==='undefined')return;
    const brand=getSelectedBrand();
    const list=document.getElementById('movement-calibre-suggestions')||document.querySelector('datalist[id*="calibre"]');
    if(!list)return;
    const vals=OTHER_REFERENCE_RULES.filter(r=>bk(r.brand)===bk(brand)).flatMap(r=>Array.isArray(r.calibre)?r.calibre:(r.calibre?[r.calibre]:[])).map(t).filter(Boolean);
    if(vals.length)list.innerHTML=[...new Set(vals)].map(v=>`<option value="Cal. ${v}"></option>`).join('');
  }

  function install(){
    normaliseAll();
    if(typeof lookupOtherReference==='function')lookupOtherReference=(brand,value)=>findOtherRule(brand,value);
    if(typeof referenceIsRecognisedForBrand==='function'){
      const legacy=referenceIsRecognisedForBrand;
      referenceIsRecognisedForBrand=function(brand,value){
        if(bk(brand)==='ROLEX'){try{return !!legacy(brand,value);}catch(e){return false;}}
        return recognised(brand,value);
      };
    }
    window.WAPReferenceLookup={version:'2.73.0',resolve,isRecognised:recognised,supportedBrands,normaliseRule,findOtherRule};
    ['caseRef','fullRef','movementCalibre'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>queueMicrotask(renderFallback)));
    document.querySelectorAll('.brand-checkbox').forEach(el=>el.addEventListener('change',()=>queueMicrotask(()=>{renderFallback();refreshSuggestions();})));
    queueMicrotask(()=>{renderFallback();refreshSuggestions();});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();