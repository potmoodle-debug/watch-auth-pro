/* Watch Auth Pro v2.73.0 — generic reference lookup engine
   Goal: make lookup data-driven rather than brand-whitelist-driven.
   Dedicated Rolex/Omega/Tudor/Breitling/Cartier decoders remain intact.
*/
(function(){
  'use strict';

  function text(v){ return String(v == null ? '' : v).trim(); }
  function brandKey(v){ return text(v).toUpperCase(); }
  function cleanOther(v){ return text(v).toUpperCase().replace(/\s+/g,''); }
  function safeTest(pattern,value){
    if(!(pattern instanceof RegExp)) return false;
    pattern.lastIndex = 0;
    return pattern.test(value);
  }
  function firstCalibre(rule){
    if(rule && rule.calibreDisplay) return text(rule.calibreDisplay);
    if(rule && Array.isArray(rule.calibre) && rule.calibre.length) return text(rule.calibre[0]);
    if(rule && rule.calibre) return text(rule.calibre);
    return 'Not specified';
  }

  function normaliseRule(rule){
    if(!rule) return null;
    if(!text(rule.family)) rule.family = text(rule.model) || 'Reference identified';
    if(!text(rule.size)) rule.size = 'Reference-specific';
    if(!text(rule.reserve)) rule.reserve = 'Not specified';
    if(!text(rule.calibreDisplay)) rule.calibreDisplay = firstCalibre(rule);
    if(!text(rule.technology)) rule.technology = 'Movement type not specified';
    if(!text(rule.notes)) rule.notes = 'Exact researched reference mapping.';
    if(!text(rule.source)) rule.source = 'Watch Auth Pro researched reference records';
    if(!text(rule.confidence)) rule.confidence = 'Researched mapping';
    return rule;
  }

  function normaliseAllRules(){
    [
      typeof OMEGA_REFERENCE_RULES !== 'undefined' ? OMEGA_REFERENCE_RULES : null,
      typeof TUDOR_REFERENCE_RULES !== 'undefined' ? TUDOR_REFERENCE_RULES : null,
      typeof BREITLING_REFERENCE_RULES !== 'undefined' ? BREITLING_REFERENCE_RULES : null,
      typeof CARTIER_REFERENCE_RULES !== 'undefined' ? CARTIER_REFERENCE_RULES : null,
      typeof OTHER_REFERENCE_RULES !== 'undefined' ? OTHER_REFERENCE_RULES : null
    ].filter(Array.isArray).forEach(list => list.forEach(normaliseRule));
  }

  function findOtherRule(brand,value){
    if(typeof OTHER_REFERENCE_RULES === 'undefined') return null;
    const b = brandKey(brand);
    const key = cleanOther(value);
    if(!b || !key) return null;
    return normaliseRule(OTHER_REFERENCE_RULES.find(rule => brandKey(rule.brand) === b && safeTest(rule.pattern,key)) || null);
  }

  function resolve(brand,value){
    const b = brandKey(brand);
    const v = text(value);
    if(!b || !v) return {brand:text(brand), value:v, rule:null, source:'empty'};
    try {
      if(b === 'OMEGA' && typeof lookupOmegaReference === 'function'){
        const hit = lookupOmegaReference(v); return {brand:text(brand),value:v,rule:normaliseRule(hit && hit.rule),source:'omega'};
      }
      if(b === 'TUDOR' && typeof lookupTudorReference === 'function'){
        const hit = lookupTudorReference(v); return {brand:text(brand),value:v,rule:normaliseRule(hit && hit.rule),source:'tudor'};
      }
      if(b === 'BREITLING' && typeof lookupBreitlingReference === 'function'){
        const hit = lookupBreitlingReference(v); return {brand:text(brand),value:v,rule:normaliseRule(hit && hit.rule),source:'breitling'};
      }
      if(b === 'CARTIER' && typeof lookupCartierReference === 'function'){
        const hit = lookupCartierReference(v); return {brand:text(brand),value:v,rule:normaliseRule(hit && hit.rule),source:'cartier'};
      }
      const other = findOtherRule(brand,v);
      return {brand:text(brand),value:v,rule:other,source:'other'};
    } catch(error){
      return {brand:text(brand),value:v,rule:null,source:'error',error};
    }
  }

  function isRecognised(brand,value){
    const hit = resolve(brand,value);
    return Boolean(hit.rule && !hit.rule.manualReview);
  }

  function supportedBrands(){
    if(typeof OTHER_REFERENCE_RULES === 'undefined') return [];
    return [...new Set(OTHER_REFERENCE_RULES.map(r => text(r.brand)).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
  }

  function displayModel(rule){ return rule ? text(rule.family) : ''; }
  function displayCalibre(rule){ return rule ? firstCalibre(rule) : ''; }

  // Make the legacy helper data-driven. No fixed brand whitelist.
  if(typeof lookupOtherReference === 'function'){
    lookupOtherReference = function(brand,value){ return findOtherRule(brand,value); };
  }

  // Preserve Rolex's dedicated recognition path, then use the common resolver for everything else.
  if(typeof referenceIsRecognisedForBrand === 'function'){
    const legacyRecognised = referenceIsRecognisedForBrand;
    referenceIsRecognisedForBrand = function(brand,value){
      if(brandKey(brand) === 'ROLEX'){
        try { return Boolean(legacyRecognised(brand,value)); } catch(error){ return false; }
      }
      return isRecognised(brand,value);
    };
  }

  function bestReferenceForBrand(brand){
    const caseRef = text(document.getElementById('caseRef')?.value);
    const fullRef = text(document.getElementById('fullRef')?.value);
    if(fullRef && isRecognised(brand,fullRef)) return fullRef;
    if(caseRef && isRecognised(brand,caseRef)) return caseRef;
    return fullRef || caseRef;
  }

  function renderDataDrivenFallback(){
    if(typeof getSelectedBrand !== 'function' || typeof renderInformationBox !== 'function') return;
    const brand = getSelectedBrand();
    const b = brandKey(brand);
    // Dedicated renderers continue to own these brands.
    if(['ROLEX','OMEGA','TUDOR','BREITLING','CARTIER'].includes(b)) return;
    const value = bestReferenceForBrand(brand);
    if(!value) return;
    const hit = resolve(brand,value);
    if(!hit.rule) return;
    const rule = hit.rule;
    const box = document.getElementById('caseResult');
    if(!box) return;
    const title = rule.manualReview ? `${brand} reference requires manual review` : `${brand} reference identified`;
    const kind = rule.manualReview ? 'neutral' : 'info';
    renderInformationBox(box,kind,title,
      `<strong>${displayModel(rule)}</strong> · ${rule.size}`+
      `<div class="mt-1"><strong>Expected movement:</strong> ${displayCalibre(rule)}</div>`+
      `<div class="mt-1"><strong>Power reserve:</strong> ${rule.reserve}</div>`+
      `<div class="mt-2">${rule.notes}</div>`+
      `<div class="provenance-line"><strong>Source:</strong> ${rule.source}<br><strong>Confidence:</strong> ${rule.confidence}</div>`
    );
  }

  function refreshCalibreSuggestions(){
    if(typeof getSelectedBrand !== 'function') return;
    const brand = getSelectedBrand();
    const list = document.getElementById('movement-calibre-suggestions') || document.querySelector('datalist[id*="calibre"]');
    if(!list || typeof OTHER_REFERENCE_RULES === 'undefined') return;
    const values = OTHER_REFERENCE_RULES
      .filter(r => brandKey(r.brand) === brandKey(brand))
      .flatMap(r => Array.isArray(r.calibre) ? r.calibre : (r.calibre ? [r.calibre] : []))
      .map(text).filter(Boolean);
    if(!values.length) return;
    const unique = [...new Set(values)];
    list.innerHTML = unique.map(v => `<option value="Cal. ${v}"></option>`).join('');
  }

  function install(){
    normaliseAllRules();
    window.WAPReferenceLookup = {
      version:'2.73.0', resolve, isRecognised, supportedBrands,
      normaliseRule, displayModel, displayCalibre, findOtherRule
    };
    ['caseRef','fullRef','movementCalibre'].forEach(id => document.getElementById(id)?.addEventListener('input',()=>queueMicrotask(renderDataDrivenFallback)));
    document.querySelectorAll('.brand-checkbox').forEach(el => el.addEventListener('change',()=>queueMicrotask(()=>{renderDataDrivenFallback();refreshCalibreSuggestions();})));
    queueMicrotask(()=>{renderDataDrivenFallback();refreshCalibreSuggestions();});
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();