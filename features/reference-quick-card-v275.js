/* Watch Auth Pro v2.75.0 — quick-glance reference information card */
(function(){
  'use strict';

  function esc(v){
    return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function text(v){ return String(v == null ? '' : v).trim(); }
  function brand(){
    try { if (typeof getSelectedBrand === 'function') return getSelectedBrand(); } catch(_) {}
    return document.querySelector('.brand-checkbox:checked')?.value || 'Generic';
  }
  function refValue(){
    const full=text(document.getElementById('fullRef')?.value);
    const caseRef=text(document.getElementById('caseRef')?.value);
    return full || caseRef;
  }
  function resolveRule(b,r){
    try{
      if(window.WAPReferenceLookup?.resolve){
        const hit=window.WAPReferenceLookup.resolve(b,r);
        if(hit?.rule) return hit.rule;
      }
      if(b==='Omega' && typeof lookupOmegaReference==='function') return lookupOmegaReference(r)?.rule||null;
      if(b==='Tudor' && typeof lookupTudorReference==='function') return lookupTudorReference(r)?.rule||null;
      if(b==='Breitling' && typeof lookupBreitlingReference==='function') return lookupBreitlingReference(r)?.rule||null;
      if(b==='Cartier' && typeof lookupCartierReference==='function') return lookupCartierReference(r)?.rule||null;
      if(typeof lookupOtherReference==='function') return lookupOtherReference(b,r)||null;
    }catch(_){}
    return null;
  }
  function first(...vals){
    for(const v of vals){ if(text(v)) return text(v); }
    return '';
  }
  function calibre(rule){
    return first(rule.calibreDisplay, Array.isArray(rule.calibre)?rule.calibre[0]:rule.calibre);
  }
  function water(rule){
    const hay=[rule.waterResistance,rule.water,rule.caseDetails,rule.notes].filter(Boolean).join(' ');
    const m=hay.match(/(?:water resistance\s*[:\-]?\s*)?(\d{2,4})\s*m\b/i);
    return m ? m[1]+' m' : '';
  }
  function production(rule){
    return first(rule.production,rule.era);
  }
  function status(rule){
    if(rule.manualReview) return {label:'Needs review',kind:'review'};
    if(rule.collectionOnly || rule.familyOnly) return {label:'Family match',kind:'family'};
    return {label:'Reference identified',kind:'identified'};
  }
  function stat(label,value,featured){
    if(!text(value)) return '';
    return '<div class="wap-ref-stat'+(featured?' wap-ref-stat-featured':'')+'"><span>'+esc(label)+'</span><strong>'+esc(value)+'</strong></div>';
  }

  function enhance(){
    const box=document.getElementById('caseResult');
    if(!box || box.classList.contains('hidden')) return;

    const b=brand(), r=refValue(), rule=resolveRule(b,r);
    if(!r || !rule) {
      if(box.dataset.wapQuickCard==='1'){
        const original=box.querySelector('.wap-ref-original');
        if(original) box.innerHTML=original.innerHTML;
        delete box.dataset.wapQuickCard;
        delete box.dataset.wapQuickKey;
      }
      return;
    }

    const key=[b,r,rule.family,calibre(rule),rule.size,rule.reserve,rule.notes].join('|');
    if(box.dataset.wapQuickKey===key) return;

    const original = box.dataset.wapQuickCard==='1'
      ? (box.querySelector('.wap-ref-original')?.innerHTML || '')
      : box.innerHTML;

    const s=status(rule);
    const model=first(rule.family,rule.model,'Reference identified');
    const exactRef=first(rule.baseReference,r);
    const movement=calibre(rule);
    const size=first(rule.size);
    const reserve=first(rule.reserve);
    const wr=water(rule);
    const prod=production(rule);

    const details = [
      rule.technology ? '<div><span>Movement type</span><strong>'+esc(rule.technology)+'</strong></div>' : '',
      rule.certification ? '<div><span>Certification</span><strong>'+esc(rule.certification)+'</strong></div>' : '',
      prod ? '<div><span>Production</span><strong>'+esc(prod)+'</strong></div>' : '',
      rule.caseDetails ? '<div><span>Case</span><strong>'+esc(rule.caseDetails)+'</strong></div>' : '',
      rule.dialDetails ? '<div><span>Dial</span><strong>'+esc(rule.dialDetails)+'</strong></div>' : '',
      rule.notes ? '<div class="wap-ref-detail-wide"><span>Notes</span><strong>'+esc(rule.notes)+'</strong></div>' : '',
      rule.source ? '<div class="wap-ref-detail-wide"><span>Source</span><strong>'+esc(rule.source)+'</strong></div>' : '',
      rule.confidence ? '<div><span>Confidence</span><strong>'+esc(rule.confidence)+'</strong></div>' : ''
    ].filter(Boolean).join('');

    box.className='wap-reference-card';
    box.innerHTML =
      '<div class="wap-ref-top">'+
        '<div class="wap-ref-identity">'+
          '<div class="wap-ref-kicker">'+esc(b)+' · WATCH INFORMATION</div>'+
          '<div class="wap-ref-model">'+esc(model)+'</div>'+
          '<div class="wap-ref-reference"><span>CASE REF</span><code>'+esc(exactRef)+'</code></div>'+
        '</div>'+
        '<div class="wap-ref-status wap-ref-status-'+s.kind+'"><span class="wap-ref-status-dot"></span>'+esc(s.label)+'</div>'+
      '</div>'+
      '<div class="wap-ref-stats">'+
        stat('Calibre',movement,true)+
        stat('Size',size,false)+
        stat('Reserve',reserve,false)+
        stat('Water',wr,false)+
        stat('Production',prod,false)+
      '</div>'+
      '<details class="wap-ref-details">'+
        '<summary>Full reference details <span>⌄</span></summary>'+
        '<div class="wap-ref-details-grid">'+details+'</div>'+
        '<div class="wap-ref-original" hidden>'+original+'</div>'+
      '</details>';

    box.dataset.wapQuickCard='1';
    box.dataset.wapQuickKey=key;
  }

  function install(){
    const style=document.createElement('style');
    style.textContent=`
      #caseResult.wap-reference-card{
        display:block!important;margin-top:16px!important;padding:0!important;overflow:hidden;
        border:1px solid #2b3442!important;border-radius:16px!important;
        background:linear-gradient(180deg,#121821 0%,#0b1017 100%)!important;
        box-shadow:0 14px 34px rgba(0,0,0,.22)!important;color:#eef3f9!important;
      }
      .wap-ref-top{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:18px 18px 15px;border-bottom:1px solid rgba(255,255,255,.065)}
      .wap-ref-identity{min-width:0}
      .wap-ref-kicker{font-size:9px;font-weight:900;letter-spacing:.16em;color:#7f8da1;text-transform:uppercase;margin-bottom:6px}
      .wap-ref-model{font-size:18px;font-weight:850;line-height:1.2;letter-spacing:-.01em;color:#f7f9fc}
      .wap-ref-reference{display:flex;align-items:center;gap:8px;margin-top:8px}
      .wap-ref-reference span{font-size:9px;font-weight:900;letter-spacing:.12em;color:#657287}
      .wap-ref-reference code{font:800 12px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;color:#bdd1f7;background:#0b111a;border:1px solid #263348;border-radius:7px;padding:4px 7px}
      .wap-ref-status{flex:none;display:inline-flex;align-items:center;gap:7px;border-radius:999px;padding:7px 10px;font-size:9px;font-weight:900;letter-spacing:.09em;text-transform:uppercase;border:1px solid}
      .wap-ref-status-dot{width:6px;height:6px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor}
      .wap-ref-status-identified{color:#78dfb8;border-color:rgba(49,196,141,.34);background:rgba(49,196,141,.08)}
      .wap-ref-status-family{color:#f3c969;border-color:rgba(244,185,66,.35);background:rgba(244,185,66,.08)}
      .wap-ref-status-review{color:#f08a91;border-color:rgba(240,93,103,.35);background:rgba(240,93,103,.08)}
      .wap-ref-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:8px;padding:12px 18px 14px}
      .wap-ref-stat{min-width:0;padding:10px 11px;border:1px solid #202936;border-radius:10px;background:#0c121a}
      .wap-ref-stat span{display:block;font-size:8px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#68768a;margin-bottom:4px}
      .wap-ref-stat strong{display:block;color:#dfe7f2;font-size:12px;line-height:1.25;white-space:normal;overflow-wrap:anywhere}
      .wap-ref-stat-featured{border-color:rgba(79,140,255,.35);background:rgba(79,140,255,.08)}
      .wap-ref-stat-featured strong{font-size:15px;color:#d9e7ff}
      .wap-ref-details{border-top:1px solid rgba(255,255,255,.055)}
      .wap-ref-details summary{list-style:none;display:flex;align-items:center;justify-content:space-between;padding:11px 18px;color:#91a0b4;font-size:10px;font-weight:850;text-transform:uppercase;letter-spacing:.09em;cursor:pointer;background:rgba(255,255,255,.015)}
      .wap-ref-details summary::-webkit-details-marker{display:none}
      .wap-ref-details summary:hover{color:#d8e4f5;background:rgba(255,255,255,.03)}
      .wap-ref-details[open] summary span{transform:rotate(180deg)}
      .wap-ref-details summary span{transition:.18s ease}
      .wap-ref-details-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:#202936;border-top:1px solid #202936}
      .wap-ref-details-grid>div{padding:11px 14px;background:#0d131b}
      .wap-ref-details-grid span{display:block;font-size:8px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#637085;margin-bottom:4px}
      .wap-ref-details-grid strong{display:block;font-size:10px;line-height:1.5;color:#b9c4d2;font-weight:650}
      .wap-ref-detail-wide{grid-column:1/-1}
      @media(max-width:680px){
        .wap-ref-top{flex-direction:column}
        .wap-ref-status{align-self:flex-start}
        .wap-ref-stats{grid-template-columns:repeat(2,minmax(0,1fr))}
        .wap-ref-details-grid{grid-template-columns:1fr}
        .wap-ref-detail-wide{grid-column:auto}
      }
    `;
    document.head.appendChild(style);

    const box=document.getElementById('caseResult');
    if(box && typeof MutationObserver!=='undefined'){
      const observer=new MutationObserver(()=>queueMicrotask(enhance));
      observer.observe(box,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
      window.__wapReferenceCardObserver=observer;
    }
    ['caseRef','fullRef'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>queueMicrotask(enhance)));
    document.querySelectorAll('.brand-checkbox').forEach(el=>el.addEventListener('change',()=>queueMicrotask(enhance)));
    queueMicrotask(enhance);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();