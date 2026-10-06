/* Watch Auth Pro v2.87.3 — special-case DO NOT OPEN safety rules */
(function () {
  'use strict';

  var ALERT_ID = 'wap-do-not-open-alert';
  var STYLE_ID = 'wap-do-not-open-styles';

  var rules = [
    {
      brand: 'Sinn',
      ref: /^(?:403)(?:[.\-\s].*)?$/i,
      names: /\b(?:UX|UX S|UX GSG 9|EZM 2B|403 HYDRO)\b/i,
      medium: 'HYDRO oil / clear filling fluid',
      reason: 'Sinn HYDRO case. Movement, dial and hands are held in filling fluid. Opening requires the specialist HYDRO service/refill procedure.',
      action: 'DO NOT OPEN. External authentication only; escalate to Sinn or an approved specialist.'
    },
    {
      brand: 'Sinn',
      names: /\b(?:U50\s*HYDRO|EZM\s*2\b|403\s*HYDRO)\b/i,
      medium: 'HYDRO oil / clear filling fluid',
      reason: 'Sinn HYDRO watch. Oil-filled construction requires specialist draining, cleaning and refilling.',
      action: 'DO NOT OPEN. External authentication only; escalate to Sinn or an approved specialist.'
    },
    {
      brand: 'Sinn',
      refs: ['1020.020'],
      names: /(?:Ar[- ]?Dehumidifying|Ar[- ]?Trockenhaltetechnik|protective gas|drying capsule|\bU2(?:\s|$)|103\s+Ti\s+TESTAF|756\s+DIAPAL)/i,
      medium: 'Protective-gas / dry-atmosphere system',
      reason: 'Sinn Ar-Dehumidifying Technology uses a protective-gas filling with a drying capsule and EDR seals. Routine opening destroys the controlled dry atmosphere.',
      action: 'DO NOT OPEN FOR ROUTINE AUTHENTICATION. External checks only unless the correct Sinn procedure is available to restore the protective atmosphere.'
    },
    {
      brand: 'Bell & Ross',
      names: /\b(?:Hydromax|Hydro\s*Challenger|Hydrochallenger|Hydro\s*8000M|Hydro\s*11[, ]?100M)\b/i,
      medium: 'Hydroil® liquid silicone',
      reason: 'Hydromax/Hydrochallenger cases use a liquid-silicone filling and a dedicated manufacturer handling/refilling procedure.',
      action: 'DO NOT OPEN. External authentication only; manufacturer/specialist handling required.'
    },
    {
      brand: 'Ressence',
      names: /\bType\s*(?:3|5|7)\b/i,
      medium: 'Oil-filled sealed upper chamber',
      reason: 'The ROCS/display chamber is sealed and oil-filled. Opening the display system disturbs the oil-filled module.',
      action: 'DO NOT OPEN THE OIL-FILLED DISPLAY MODULE. Escalate to Ressence/specialist service.'
    },
    {
      brand: 'U-BOAT',
      refs: ['8463/D','8464/D','8697/B','8700/E','8702/E','8704/D','9018/B','9019/B','9020/C','9503/A','9545','9526/B'],
      names: /\b(?:Capsoil|Darkmoon|Dark Moon)\b/i,
      medium: 'Special oil / oil bath',
      reason: 'Oil-immersed case/movement family. The visible dial bubble can be intentional and compensates for temperature/volume changes.',
      action: 'DO NOT OPEN AS A NORMAL WATCH. Treat as a specialist oil-filled case; use external authentication and escalate when internal access is required.'
    }
  ];

  function clean(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }
  function norm(v) { return clean(v).toUpperCase().replace(/[^A-Z0-9]+/g,''); }
  function esc(v) {
    return clean(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function value(id) { var el=document.getElementById(id); return clean(el && el.value); }
  function selectedBrand() {
    try { if (typeof getSelectedBrand === 'function') return clean(getSelectedBrand()); } catch(e) {}
    var el=document.querySelector('.brand-checkbox:checked');
    return clean(el && el.value);
  }
  function reference() { return value('fullRef') || value('caseRef'); }
  function resolveRule(brand, ref) {
    if (!brand || !ref) return null;
    try {
      if (window.WAPReferenceLookup && window.WAPReferenceLookup.resolve) {
        var hit=window.WAPReferenceLookup.resolve(brand,ref);
        return hit && hit.rule ? hit.rule : null;
      }
      if (brand==='Omega' && typeof lookupOmegaReference==='function') return (lookupOmegaReference(ref)||{}).rule || null;
      if (brand==='Tudor' && typeof lookupTudorReference==='function') return (lookupTudorReference(ref)||{}).rule || null;
      if (brand==='Breitling' && typeof lookupBreitlingReference==='function') return (lookupBreitlingReference(ref)||{}).rule || null;
      if (brand==='Cartier' && typeof lookupCartierReference==='function') return (lookupCartierReference(ref)||{}).rule || null;
      if (typeof lookupOtherReference==='function') return lookupOtherReference(brand,ref) || null;
    } catch(e) {}
    return null;
  }
  function modelText(rule) {
    if (!rule) return '';
    return [rule.family,rule.model,rule.name,rule.collection,rule.notes].filter(Boolean).join(' ');
  }
  function brandMatches(ruleBrand, actual) {
    return norm(actual)===norm(ruleBrand);
  }
  function match() {
    var brand=selectedBrand(), ref=reference(), resolved=resolveRule(brand,ref), name=modelText(resolved);
    var entered=clean(ref);
    for (var i=0;i<rules.length;i++) {
      var r=rules[i];
      var explicitBrand=brand && brand!=='Generic' && brand!=='Other';
      var brandToken=norm(r.brand);
      var entryToken=norm(entered);
      var brandInEntry=entryToken.indexOf(brandToken)>=0;
      if (explicitBrand && !brandMatches(r.brand,brand)) continue;
      if (!explicitBrand && !brandInEntry && !(r.names && r.names.test(entered))) continue;
      if (r.refs && r.refs.some(function(x){return norm(x)===norm(ref) || entryToken.indexOf(norm(x))>=0;})) return {rule:r,brand:r.brand,ref:ref,name:name};
      if (r.ref && r.ref.test(clean(ref))) return {rule:r,brand:r.brand,ref:ref,name:name};
      if (r.names && r.names.test(name)) return {rule:r,brand:r.brand,ref:ref,name:name};
      if (r.names && r.names.test(entered)) return {rule:r,brand:r.brand,ref:ref,name:name};
    }
    return null;
  }

  function ensureStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=[
      '#'+ALERT_ID+'{margin:0 0 18px;padding:16px 18px;border:2px solid #ef4444;border-radius:14px;background:linear-gradient(135deg,rgba(127,29,29,.36),rgba(30,5,8,.96));box-shadow:0 12px 34px rgba(127,29,29,.24);color:#fee2e2}',
      '#'+ALERT_ID+' .dno-kicker{font-size:10px;font-weight:950;letter-spacing:.18em;color:#fca5a5;margin-bottom:6px}',
      '#'+ALERT_ID+' .dno-title{font-size:22px;line-height:1.1;font-weight:1000;color:#fff;margin-bottom:8px}',
      '#'+ALERT_ID+' .dno-copy{font-size:13px;line-height:1.45;font-weight:750;color:#fecaca}',
      '#'+ALERT_ID+' .dno-meta{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px}',
      '#'+ALERT_ID+' .dno-meta span{border:1px solid rgba(248,113,113,.35);border-radius:8px;background:rgba(0,0,0,.2);padding:6px 8px;font:800 10px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace;color:#fee2e2}',
      '#'+ALERT_ID+' .dno-action{margin-top:11px;padding:10px 12px;border-radius:9px;background:#7f1d1d;color:white;font-size:12px;font-weight:950;letter-spacing:.02em}',
      '#compact-watch-information.wap-do-not-open{border-color:#ef4444!important;box-shadow:0 0 0 2px rgba(239,68,68,.1),0 20px 50px rgba(0,0,0,.34)!important}',
      '.wap-do-not-open-tech-note{color:#fca5a5!important;font-weight:900!important}'
    ].join('');
    document.head.appendChild(s);
  }

  function render() {
    ensureStyles();
    var hit=match();
    var existing=document.getElementById(ALERT_ID);
    var panel=document.getElementById('compact-watch-information');
    if (panel) panel.classList.toggle('wap-do-not-open',!!hit);
    if (!hit) {
      if (existing) existing.remove();
      var clearTechnical=document.querySelector('.panel-technical');
      var clearDesc=clearTechnical && clearTechnical.querySelector('.panel-description');
      if (clearDesc && clearDesc.dataset.wapOriginalDescription) {
        clearDesc.textContent=clearDesc.dataset.wapOriginalDescription;
        delete clearDesc.dataset.wapOriginalDescription;
        clearDesc.classList.remove('wap-do-not-open-tech-note');
      }
      return;
    }

    var technical=document.querySelector('.panel-technical');
    var host=(panel && panel.parentNode) ? panel.parentNode : (technical && technical.parentNode);
    if (!host) return;
    if (!existing) {
      existing=document.createElement('div');
      existing.id=ALERT_ID;
      existing.setAttribute('role','alert');
      existing.setAttribute('aria-live','assertive');
      if (technical && technical.parentNode===host) host.insertBefore(existing,technical);
      else host.insertBefore(existing,host.firstChild);
    }

    var r=hit.rule;
    var warningHtml=
      '<div class="dno-kicker">SPECIAL CASE · BENCH SAFETY</div>'+
      '<div class="dno-title">⛔ DO NOT OPEN</div>'+
      '<div class="dno-copy">'+esc(r.reason)+'</div>'+
      '<div class="dno-meta"><span>'+esc(hit.brand)+'</span>'+
      (hit.ref?'<span>REF '+esc(hit.ref)+'</span>':'')+
      '<span>'+esc(r.medium)+'</span></div>'+
      '<div class="dno-action">'+esc(r.action)+'</div>';
    if (existing.innerHTML!==warningHtml) existing.innerHTML=warningHtml;

    if (technical) {
      var desc=technical.querySelector('.panel-description');
      var stopText='SPECIAL CASE IDENTIFIED — do not open this watch. Complete external authentication only and follow the escalation instruction above.';
      if (desc) {
        if (!desc.dataset.wapOriginalDescription) desc.dataset.wapOriginalDescription=desc.textContent;
        desc.classList.add('wap-do-not-open-tech-note');
        if (desc.textContent!==stopText) desc.textContent=stopText;
      }
    }
  }

  var scheduled=false;
  function schedule() {
    if (scheduled) return;
    scheduled=true;
    requestAnimationFrame(function(){scheduled=false;render();});
  }

  document.addEventListener('input',schedule,true);
  document.addEventListener('change',schedule,true);
  window.addEventListener('load',function(){setTimeout(render,150);setTimeout(render,700);});
  var observer=new MutationObserver(function(mutations){
    for(var i=0;i<mutations.length;i++){
      var t=mutations[i].target;
      if (t && t.id===ALERT_ID) continue;
      schedule(); break;
    }
  });
  if (document.documentElement) observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});

  window.WAPDoNotOpenSafety={rules:rules,check:match,render:render};
})();
