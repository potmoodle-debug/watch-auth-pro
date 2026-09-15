/* Watch Auth Pro v2.72.0 — reference lookup integrity bridge
   Ensures researched OTHER_REFERENCE_RULES can be found for every brand,
   including brands outside the older hard-coded renderer list.
*/
(function(){
  const CORE_OTHER_BRANDS = new Set(['Generic','Longines','IWC','TAG Heuer','Rado','Vertex','Seiko','Studio Underd0g','Grand Seiko','Lemania','CWC','Chanel','Sinn','Bremont','Ebel','Fears','Raymond Weil','Blancpain','Christopher Ward','Oris','Panerai']);

  function cleanOther(value){ return String(value || '').trim().toUpperCase().replace(/\s+/g,''); }
  function brandEqual(a,b){ return String(a || '').trim().toUpperCase() === String(b || '').trim().toUpperCase(); }
  function safeTest(pattern,value){ if(!(pattern instanceof RegExp)) return false; pattern.lastIndex=0; return pattern.test(value); }

  function install(){
    if(typeof OTHER_REFERENCE_RULES === 'undefined') return;

    // Replace the strict brand equality lookup with a case-insensitive version and
    // always reset RegExp state before testing.
    if(typeof lookupOtherReference === 'function'){
      lookupOtherReference = function(brand,value){
        const key = cleanOther(value);
        if(!key) return null;
        return OTHER_REFERENCE_RULES.find(rule => brandEqual(rule.brand,brand) && safeTest(rule.pattern,key)) || null;
      };
    }

    // Let the case/full-reference selector recognise researched brands that were
    // not present in the original fixed routing list.
    if(typeof referenceIsRecognisedForBrand === 'function'){
      const previousRecognised = referenceIsRecognisedForBrand;
      referenceIsRecognisedForBrand = function(brand,value){
        try {
          if(previousRecognised(brand,value)) return true;
        } catch(error) {}
        const hit = typeof lookupOtherReference === 'function' ? lookupOtherReference(brand,value) : null;
        return Boolean(hit && !hit.manualReview);
      };
    }

    function renderFallback(){
      if(typeof getSelectedBrand !== 'function' || typeof renderInformationBox !== 'function' || typeof lookupOtherReference !== 'function') return;
      const brand = getSelectedBrand();
      if(!brand || brand === 'Omega' || brand === 'Tudor' || brand === 'Cartier' || brand === 'Breitling' || CORE_OTHER_BRANDS.has(brand)) return;

      const caseRef = (document.getElementById('caseRef')?.value || '').trim();
      const fullRef = (document.getElementById('fullRef')?.value || '').trim();
      let value = fullRef || caseRef;
      let rule = value ? lookupOtherReference(brand,value) : null;
      if(!rule && fullRef && caseRef){ value = caseRef; rule = lookupOtherReference(brand,value); }
      if(!rule) return;

      const box = document.getElementById('caseResult');
      if(!box) return;
      const calibre = rule.calibreDisplay || (Array.isArray(rule.calibre) ? rule.calibre[0] : 'verify movement');
      const size = rule.size || 'reference-specific';
      const reserve = rule.reserve || 'reference-specific';
      renderInformationBox(box,'info',`${brand} reference identified`,`<strong>${rule.family}</strong> · ${size}<div class="mt-1"><strong>Expected movement:</strong> ${calibre}</div><div class="mt-1"><strong>Power reserve:</strong> ${reserve}</div><div class="mt-2">${rule.notes || ''}</div><div class="provenance-line"><strong>Source:</strong> ${rule.source || 'researched reference records'}<br><strong>Confidence:</strong> ${rule.confidence || 'researched mapping'}</div>`);
    }

    ['caseRef','fullRef','movementCalibre'].forEach(id => document.getElementById(id)?.addEventListener('input',()=>queueMicrotask(renderFallback)));
    document.querySelectorAll('.brand-checkbox').forEach(el => el.addEventListener('change',()=>queueMicrotask(renderFallback)));
    queueMicrotask(renderFallback);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();