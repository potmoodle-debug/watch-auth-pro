/* Watch Auth Pro v2.76.0 — Watch Information reference-card overhaul
   Rebuilds the "Reference and model" section inside the compact Watch Information panel
   into a quick-glance diagnostic card while keeping deeper evidence available on demand.
*/
(function(){
  'use strict';
  let enhancing=false;
  let scheduled=false;
  let panelObserver=null;

  function clean(v){ return String(v == null ? '' : v).trim(); }
  function esc(v){ return clean(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function selectedBrand(){
    try { if(typeof getSelectedBrand==='function') return getSelectedBrand() || ''; } catch(_){}
    return document.querySelector('.brand-checkbox:checked')?.value || '';
  }

  function referenceValue(){
    return clean(document.getElementById('fullRef')?.value) || clean(document.getElementById('caseRef')?.value);
  }

  function resolveRule(brand, ref){
    if(!brand || !ref) return null;
    try {
      if(window.WAPReferenceLookup?.resolve){
        const hit = window.WAPReferenceLookup.resolve(brand, ref);
        if(hit?.rule) return hit.rule;
      }
      if(brand==='Omega' && typeof lookupOmegaReference==='function') return lookupOmegaReference(ref)?.rule || null;
      if(brand==='Tudor' && typeof lookupTudorReference==='function') return lookupTudorReference(ref)?.rule || null;
      if(brand==='Breitling' && typeof lookupBreitlingReference==='function') return lookupBreitlingReference(ref)?.rule || null;
      if(brand==='Cartier' && typeof lookupCartierReference==='function') return lookupCartierReference(ref)?.rule || null;
      if(typeof lookupOtherReference==='function') return lookupOtherReference(brand, ref) || null;
    } catch(_){}
    return null;
  }

  function first(){
    for(const v of arguments){ if(clean(v)) return clean(v); }
    return '';
  }

  function calibre(rule){
    return first(rule?.calibreDisplay, Array.isArray(rule?.calibre) ? rule.calibre[0] : rule?.calibre);
  }

  function water(rule){
    const hay=[rule?.waterResistance,rule?.water,rule?.caseDetails,rule?.notes].filter(Boolean).join(' ');
    const m=hay.match(/(\d{2,4})\s*m\b/i);
    return m ? m[1]+' m' : '';
  }

  function status(rule){
    if(rule?.manualReview) return ['Needs review','review'];
    if(rule?.collectionOnly || rule?.familyOnly) return ['Family match','family'];
    return ['Identified','identified'];
  }

  function stat(label,value,featured){
    if(!clean(value)) return '';
    return '<div class="wi-ref-stat'+(featured?' featured':'')+'"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>';
  }

  function build(section, rule, brand, ref){
    const model=first(rule.family,rule.model,'Reference identified');
    const exactRef=first(rule.baseReference,ref);
    const cal=calibre(rule);
    const size=first(rule.size);
    const reserve=first(rule.reserve);
    const production=first(rule.production,rule.era);
    const wr=water(rule);
    const [statusLabel,statusKind]=status(rule);

    const detailRows = [
      rule.technology ? ['Movement type',rule.technology] : null,
      rule.functions ? ['Functions',rule.functions] : null,
      rule.certification ? ['Certification',rule.certification] : null,
      rule.caseDetails ? ['Case',rule.caseDetails] : null,
      rule.dialDetails ? ['Dial',rule.dialDetails] : null,
      rule.notes ? ['Inspection note',rule.notes] : null,
      rule.source ? ['Database source',rule.source] : null,
      rule.confidence ? ['Confidence',rule.confidence] : null
    ].filter(Boolean);

    const detailHtml = detailRows.map(([label,value]) =>
      '<div class="wi-ref-detail-row"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>'
    ).join('');

    section.className='watch-info-section wi-reference-overhaul';
    section.innerHTML =
      '<div class="wi-ref-head">'+
        '<div class="wi-ref-title-group">'+
          '<div class="wi-ref-eyebrow">'+esc(brand)+' · REFERENCE FROM CASE</div>'+
          '<div class="wi-ref-model">'+esc(model)+'</div>'+
          '<div class="wi-ref-code"><span>REF</span><code>'+esc(exactRef)+'</code></div>'+
        '</div>'+
        '<div class="wi-ref-status '+statusKind+'"><i></i>'+esc(statusLabel)+'</div>'+
      '</div>'+
      '<div class="wi-ref-stat-grid">'+
        stat('Calibre',cal,true)+
        stat('Size',size,false)+
        stat('Production',production,false)+
        stat('Reserve',reserve,false)+
        stat('Water',wr,false)+
      '</div>'+
      (detailHtml
        ? '<details class="wi-ref-more"><summary>More details <span>⌄</span></summary><div class="wi-ref-detail-grid">'+detailHtml+'</div></details>'
        : '');

    section.dataset.wiRefKey=[brand,ref,model,cal,size,production,reserve,wr,statusLabel].join('|');
  }

  function enhance(){
    if(enhancing) return;
    enhancing=true;
    try {
      const panel=document.getElementById('compact-watch-information');
      if(!panel || panel.hidden) return;

    const sections=[...panel.querySelectorAll('.watch-info-section')];
    const section=sections.find(s => /reference and model/i.test(s.querySelector('.watch-info-section-label')?.textContent || ''))
      || panel.querySelector('.wi-reference-overhaul');
    if(!section) return;

    const brand=selectedBrand();
    const ref=referenceValue();
    const rule=resolveRule(brand,ref);
    if(!brand || !ref || !rule) return;

    const model=first(rule.family,rule.model,'Reference identified');
    const key=[brand,ref,model,calibre(rule),rule.size,rule.production,rule.era,rule.reserve,water(rule),status(rule)[0]].join('|');
      if(section.dataset.wiRefKey===key && section.classList.contains('wi-reference-overhaul')) return;
      build(section,rule,brand,ref);
    } finally {
      enhancing=false;
    }
  }

  function scheduleEnhance(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(function(){
      scheduled=false;
      enhance();
    });
  }

  function install(){
    if(!document.getElementById('watch-info-reference-overhaul-styles')){
      const style=document.createElement('style');
      style.id='watch-info-reference-overhaul-styles';
      style.textContent=`
        #compact-watch-information .watch-info-sections{align-items:start}
        #compact-watch-information .wi-reference-overhaul{
          grid-column:1/-1;padding:0!important;overflow:hidden;
          border:1px solid rgba(79,140,255,.32)!important;
          background:linear-gradient(160deg,rgba(15,24,38,.98),rgba(7,12,19,.98))!important;
          box-shadow:inset 3px 0 0 rgba(79,140,255,.72);
        }
        .wi-ref-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:16px 17px 13px;border-bottom:1px solid rgba(255,255,255,.06)}
        .wi-ref-title-group{min-width:0}
        .wi-ref-eyebrow{font-size:8px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#6e8fbe;margin-bottom:5px}
        .wi-ref-model{font-size:17px;line-height:1.2;font-weight:880;color:#f6f9fd;letter-spacing:-.012em}
        .wi-ref-code{display:flex;align-items:center;gap:7px;margin-top:8px}
        .wi-ref-code span{font-size:8px;font-weight:900;letter-spacing:.12em;color:#69778a}
        .wi-ref-code code{font:800 11px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;color:#cfe0ff;background:#0b111a;border:1px solid #26354a;border-radius:6px;padding:4px 7px}
        .wi-ref-status{display:inline-flex;align-items:center;gap:6px;flex:none;border-radius:999px;padding:6px 9px;font-size:8px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;border:1px solid}
        .wi-ref-status i{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 9px currentColor}
        .wi-ref-status.identified{color:#78dfb8;background:rgba(49,196,141,.08);border-color:rgba(49,196,141,.32)}
        .wi-ref-status.family{color:#f4ca70;background:rgba(244,185,66,.08);border-color:rgba(244,185,66,.34)}
        .wi-ref-status.review{color:#ef8a92;background:rgba(240,93,103,.08);border-color:rgba(240,93,103,.34)}
        .wi-ref-stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;padding:11px 16px 13px}
        .wi-ref-stat{padding:9px 10px;border:1px solid #222c39;border-radius:9px;background:#0b1118;min-width:0}
        .wi-ref-stat span{display:block;font-size:7px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#68768a;margin-bottom:4px}
        .wi-ref-stat strong{display:block;font-size:11px;line-height:1.25;color:#dbe4ef;font-weight:800;overflow-wrap:anywhere}
        .wi-ref-stat.featured{border-color:rgba(79,140,255,.4);background:rgba(79,140,255,.09)}
        .wi-ref-stat.featured strong{font-size:14px;color:#e2ecff}
        .wi-ref-more{border-top:1px solid rgba(255,255,255,.055)}
        .wi-ref-more summary{list-style:none;display:flex;align-items:center;justify-content:space-between;padding:10px 16px;color:#8291a5;font-size:8px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;cursor:pointer}
        .wi-ref-more summary::-webkit-details-marker{display:none}
        .wi-ref-more summary:hover{color:#c9d7e9;background:rgba(255,255,255,.025)}
        .wi-ref-more[open] summary span{transform:rotate(180deg)}
        .wi-ref-more summary span{transition:.18s ease}
        .wi-ref-detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#202936;border-top:1px solid #202936}
        .wi-ref-detail-row{padding:10px 12px;background:#0c1219;min-width:0}
        .wi-ref-detail-row span{display:block;font-size:7px;font-weight:900;letter-spacing:.11em;text-transform:uppercase;color:#637085;margin-bottom:3px}
        .wi-ref-detail-row strong{display:block;color:#b8c3d1;font-size:9px;line-height:1.45;font-weight:650;overflow-wrap:anywhere}
        @media(max-width:760px){
          .wi-ref-head{flex-direction:column;gap:10px}
          .wi-ref-stat-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
          .wi-ref-detail-grid{grid-template-columns:1fr}
        }
      `;
      document.head.appendChild(style);
    }

    const panel=document.getElementById('compact-watch-information');
    const sections=panel?.querySelector('.watch-info-sections');
    if(sections && typeof MutationObserver!=='undefined'){
      panelObserver=new MutationObserver(function(mutations){
        // Ignore mutations created inside the already-built quick card itself.
        const externalChange=mutations.some(m=>{
          const target=m.target?.nodeType===1 ? m.target : m.target?.parentElement;
          return !target?.closest?.('.wi-reference-overhaul');
        });
        if(externalChange) scheduleEnhance();
      });
      panelObserver.observe(sections,{childList:true,subtree:true});
      window.__wapWatchInfoReferenceObserver=panelObserver;
    }
    ['caseRef','fullRef','movementCalibre','serialInput'].forEach(id=>document.getElementById(id)?.addEventListener('input',scheduleEnhance));
    document.querySelectorAll('.brand-checkbox').forEach(el=>el.addEventListener('change',scheduleEnhance));
    scheduleEnhance();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();