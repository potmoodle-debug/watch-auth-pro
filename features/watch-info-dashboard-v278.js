/* Watch Auth Pro v2.78.0 — bold glance-first Watch Information dashboard */
(function () {
  'use strict';

  var PANEL_ID = 'compact-watch-information';
  var SOURCES = [
    ['caseResult','Reference details'],
    ['movementMatchResult','Movement detail'],
    ['serialResult','Serial information'],
    ['dateEstimateResult','Dating detail'],
    ['ageClassificationResult','Age classification'],
    ['claspResult','Bracelet / clasp'],
    ['replica-risk-banner','Authentication warning'],
    ['counterfeit-match-alert','Counterfeit-register warning'],
    ['drawer-live-decoding','Additional decoding']
  ];
  var scheduled = false;
  var building = false;

  function clean(v) { return String(v == null ? '' : v).replace(/\s+/g, ' ').trim(); }
  function esc(v) {
    return clean(v).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function key(v) { return clean(v).toLowerCase().replace(/[^a-z0-9]+/g, ' '); }
  function value(id) { var el=document.getElementById(id); return clean(el && el.value); }
  function reference() { return value('fullRef') || value('caseRef'); }
  function selectedBrand() {
    try { if (typeof getSelectedBrand === 'function') return getSelectedBrand() || ''; } catch (e) {}
    var el=document.querySelector('.brand-checkbox:checked');
    return el ? el.value : '';
  }
  function first() {
    for (var i=0;i<arguments.length;i++) if (clean(arguments[i])) return clean(arguments[i]);
    return '';
  }
  function compact(v,n) {
    var s=clean(v), max=n||170;
    return s.length>max ? s.slice(0,max-1).trim()+'…' : s;
  }

  function visibleSource(el) {
    if (!el || !clean(el.textContent)) return false;
    if (el.id === 'drawer-live-decoding' && /enter a case reference or serial number/i.test(el.textContent || '')) return false;
    return !el.classList.contains('hidden');
  }
  function sourceTone(el) {
    var cls=String(el && el.className || ''), txt=clean(el && el.textContent);
    if (/red-|danger/i.test(cls) || /critical|counterfeit|replica|mismatch|incorrect factory configuration|known fake/i.test(txt)) return 'danger';
    if (/amber-|warning/i.test(cls) || /manual review|requires review|review advised|exact reference required|no exact|not available|uncertain/i.test(txt)) return 'warning';
    if (/emerald-|success/i.test(cls) || /matches reference|is consistent|consistent with|identified/i.test(txt)) return 'success';
    return 'info';
  }

  function resolveRule(brand, ref) {
    if (!brand || !ref) return null;
    try {
      if (window.WAPReferenceLookup && window.WAPReferenceLookup.resolve) {
        var hit=window.WAPReferenceLookup.resolve(brand, ref);
        if (hit && hit.rule) return hit.rule;
      }
      if (brand==='Omega' && typeof lookupOmegaReference==='function') return (lookupOmegaReference(ref)||{}).rule || null;
      if (brand==='Tudor' && typeof lookupTudorReference==='function') return (lookupTudorReference(ref)||{}).rule || null;
      if (brand==='Breitling' && typeof lookupBreitlingReference==='function') return (lookupBreitlingReference(ref)||{}).rule || null;
      if (brand==='Cartier' && typeof lookupCartierReference==='function') return (lookupCartierReference(ref)||{}).rule || null;
      if (typeof lookupOtherReference==='function') return lookupOtherReference(brand, ref) || null;
    } catch (e) {}
    return null;
  }

  function expectedCalibre(rule) {
    if (!rule) return '';
    if (clean(rule.calibreDisplay)) return clean(rule.calibreDisplay);
    if (Array.isArray(rule.calibre) && rule.calibre.length) return clean(rule.calibre[0]);
    return clean(rule.calibre);
  }
  function water(rule) {
    if (!rule) return '';
    var txt=[rule.waterResistance,rule.water,rule.caseDetails,rule.notes].filter(Boolean).join(' ');
    var m=txt.match(/(\d{2,4})\s*m\b/i);
    return m ? m[1]+' m' : '';
  }
  function production(rule) { return first(rule && rule.production, rule && rule.era); }

  function cleanSourceHtml(el) {
    if (!el) return '';
    var clone=el.cloneNode(true);
    var remove=clone.querySelectorAll('.provenance-line,script,style,button');
    for (var i=0;i<remove.length;i++) remove[i].remove();
    return clone.innerHTML.trim();
  }

  function chunks(el) {
    if (!el) return [];
    var clone=el.cloneNode(true);
    var remove=clone.querySelectorAll('.provenance-line,script,style,button');
    for (var i=0;i<remove.length;i++) remove[i].remove();
    var nodes=clone.querySelectorAll('li,p');
    var out=[];
    for (var j=0;j<nodes.length;j++) {
      var t=clean(nodes[j].textContent);
      if (t) out.push(t);
    }
    if (!out.length) {
      out=clean(clone.textContent).split(/[.!?]\s+|\s*[•·]\s*/).map(clean).filter(Boolean);
    }
    return out.filter(function(t){
      return t.length>=12 && t.length<=260 && !/^source\s*:/i.test(t) && !/^confidence\s*:/i.test(t);
    });
  }

  function findings(sources, rule, observed) {
    var result=[], seen={};
    function add(text,tone) {
      text=compact(text,175);
      var k=key(text);
      if (!k || seen[k]) return;
      seen[k]=true;
      result.push({text:text,tone:tone||'info'});
    }

    var exp=expectedCalibre(rule);
    if (observed && exp) {
      var obs=key(observed).replace(/calibre|cal/g,'');
      var aliases=Array.isArray(rule && rule.calibre) ? rule.calibre : [exp];
      for (var a=0;a<aliases.length;a++) {
        var al=key(aliases[a]).replace(/calibre|cal/g,'');
        if (al && (obs.indexOf(al)>=0 || al.indexOf(obs)>=0)) {
          add('Observed movement is consistent with the expected '+exp+' calibre.','success');
          break;
        }
      }
    }

    var rank={danger:0,warning:1,success:2,info:3};
    sources.sort(function(a,b){ return (rank[a.tone]||9)-(rank[b.tone]||9); });
    for (var i=0;i<sources.length && result.length<6;i++) {
      var parts=chunks(sources[i].el);
      for (var j=0;j<parts.length && result.length<6;j++) {
        if (/source|confidence|database source/i.test(parts[j])) continue;
        if (rule && rule.family && key(parts[j])===key(rule.family)) continue;
        add(parts[j],sources[i].tone);
      }
    }
    return result;
  }

  function schedule() {
    if (scheduled) return;
    scheduled=true;
    requestAnimationFrame(function(){ scheduled=false; build(); });
  }

  function build() {
    if (building) return;
    building=true;
    try {
      var panel=document.getElementById(PANEL_ID);
      if (!panel || panel.hidden) return;

      var brand=selectedBrand();
      var ref=reference();
      var observed=value('movementCalibre');
      var rule=resolveRule(brand,ref);
      var model=first(rule && rule.family,rule && rule.model,(brand&&ref)?brand+' '+ref:(brand||ref||'Watch information'));
      var exp=expectedCalibre(rule);

      var sources=[];
      for (var i=0;i<SOURCES.length;i++) {
        var el=document.getElementById(SOURCES[i][0]);
        if (visibleSource(el)) sources.push({el:el,label:SOURCES[i][1],tone:sourceTone(el)});
      }

      var overall='success';
      for (var t=0;t<sources.length;t++) if (sources[t].tone==='warning') overall='warning';
      for (var d=0;d<sources.length;d++) if (sources[d].tone==='danger') overall='danger';
      var statusText=overall==='danger'?'ATTENTION':overall==='warning'?'REVIEW':'CONSISTENT';

      panel.classList.add('wi-bold-dashboard');
      panel.classList.toggle('watch-info-attention',overall==='danger');
      panel.classList.toggle('watch-info-review',overall==='warning');

      var primary=document.getElementById('watch-info-primary');
      var secondary=document.getElementById('watch-info-secondary');
      var status=document.getElementById('watch-info-status');
      if (primary) primary.textContent=model;
      if (secondary) secondary.textContent=[brand,ref?'Ref. '+ref:''].filter(Boolean).join(' · ');
      if (status) { status.className='watch-info-status '+overall; status.textContent=statusText; }

      var overview=document.getElementById('watch-info-overview');
      if (overview) overview.innerHTML='';

      var facts=[
        ['EXPECTED CALIBRE',exp,'featured'],
        ['OBSERVED CALIBRE',observed,observed&&exp?'observed':''],
        ['SIZE',first(rule&&rule.size),''],
        ['PRODUCTION',production(rule),''],
        ['POWER RESERVE',first(rule&&rule.reserve),''],
        ['WATER RESISTANCE',water(rule),'']
      ].filter(function(x){return clean(x[1]);});

      var found=findings(sources,rule,observed);
      var groups=[], seenText={};
      for (var g=0;g<sources.length;g++) {
        var html=cleanSourceHtml(sources[g].el);
        var txt=key(sources[g].el.textContent);
        if (!html || !txt || seenText[txt]) continue;
        seenText[txt]=true;
        groups.push({label:sources[g].label,tone:sources[g].tone,html:html});
      }

      var sections=document.getElementById('watch-info-sections');
      if (!sections) return;

      var htmlOut='<div class="wi-dashboard">';
      htmlOut+='<div class="wi-dashboard-hero"><div><div class="wi-dashboard-kicker">'+esc(brand||'WATCH')+' · QUICK AUTHENTICATION VIEW</div>';
      htmlOut+='<div class="wi-dashboard-title">'+esc(model)+'</div>';
      if (ref) htmlOut+='<div class="wi-dashboard-ref">REF <strong>'+esc(ref)+'</strong></div>';
      htmlOut+='</div><div class="wi-dashboard-status '+overall+'"><span></span>'+statusText+'</div></div>';

      if (facts.length) {
        htmlOut+='<div class="wi-dashboard-facts">';
        for (var f=0;f<facts.length;f++) htmlOut+='<div class="wi-fact '+facts[f][2]+'"><span>'+esc(facts[f][0])+'</span><strong>'+esc(facts[f][1])+'</strong></div>';
        htmlOut+='</div>';
      }

      htmlOut+='<section class="wi-findings"><div class="wi-block-title">WHAT MATTERS</div>';
      if (found.length) {
        htmlOut+='<div class="wi-findings-list">';
        for (var q=0;q<found.length;q++) {
          var mark=found[q].tone==='danger'||found[q].tone==='warning'?'!':'✓';
          htmlOut+='<div class="wi-finding '+found[q].tone+'"><span class="wi-finding-mark">'+mark+'</span><strong>'+esc(found[q].text)+'</strong></div>';
        }
        htmlOut+='</div>';
      } else {
        htmlOut+='<div class="wi-no-findings">No additional authentication warnings are currently being raised.</div>';
      }
      htmlOut+='</section>';

      htmlOut+='<section class="wi-details-block"><div class="wi-block-title">DEEPER DETAIL</div><div class="wi-accordion">';
      for (var x=0;x<groups.length;x++) {
        htmlOut+='<details class="wi-detail '+groups[x].tone+'"><summary><span>'+esc(groups[x].label)+'</span><b>+</b></summary><div class="wi-detail-body">'+groups[x].html+'</div></details>';
      }
      htmlOut+='</div></section></div>';
      sections.innerHTML=htmlOut;

      var details=sections.querySelectorAll('.wi-detail');
      for (var z=0;z<details.length;z++) {
        details[z].addEventListener('toggle',function(){
          var b=this.querySelector('summary b');
          if (b) b.textContent=this.open?'−':'+';
        });
      }
    } finally {
      building=false;
    }
  }

  function addStyles() {
    if (document.getElementById('wi-bold-dashboard-styles')) return;
    var s=document.createElement('style');
    s.id='wi-bold-dashboard-styles';
    s.textContent=[
      '#compact-watch-information.wi-bold-dashboard{border:2px solid rgba(59,130,246,.48);border-radius:20px;background:linear-gradient(150deg,#08111e,#050a11 72%);box-shadow:0 20px 50px rgba(0,0,0,.34)}',
      '#compact-watch-information.wi-bold-dashboard.watch-info-attention{border-color:rgba(239,68,68,.72)}',
      '#compact-watch-information.wi-bold-dashboard.watch-info-review{border-color:rgba(245,158,11,.64)}',
      '#compact-watch-information .watch-info-summary{min-height:96px;padding:20px 22px;gap:18px}',
      '#compact-watch-information .watch-info-icon{width:50px;flex-basis:50px;height:50px;border-radius:14px;font-size:24px;border-width:2px}',
      '#compact-watch-information .watch-info-kicker{font-size:11px;letter-spacing:.16em;color:#67a8ff}',
      '#compact-watch-information .watch-info-primary{font-size:20px;line-height:1.15;font-weight:950;letter-spacing:-.025em;color:#fff}',
      '#compact-watch-information .watch-info-secondary{font-size:12px;margin-top:7px;color:#94a3b8;font-weight:700}',
      '#compact-watch-information .watch-info-status{font-size:10px;font-weight:950;padding:8px 12px;border-width:1px}',
      '#compact-watch-information .watch-info-status.success{color:#6ee7b7;background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.42)}',
      '#compact-watch-information .watch-info-status.warning{color:#fcd34d;background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.46)}',
      '#compact-watch-information .watch-info-status.danger{color:#fca5a5;background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.52)}',
      '#compact-watch-information .watch-info-body{padding:0;border-top:1px solid rgba(148,163,184,.15)}',
      '#compact-watch-information .watch-info-overview{display:none!important}',
      '#compact-watch-information .watch-info-sections{display:block!important}',
      '.wi-dashboard{width:100%}',
      '.wi-dashboard-hero{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:22px;background:linear-gradient(90deg,rgba(37,99,235,.14),transparent 60%);border-bottom:1px solid rgba(148,163,184,.13)}',
      '.wi-dashboard-kicker{font-size:9px;font-weight:950;letter-spacing:.18em;color:#6ea8ff;margin-bottom:7px}',
      '.wi-dashboard-title{font-size:26px;line-height:1.08;font-weight:950;color:#fff;letter-spacing:-.035em}',
      '.wi-dashboard-ref{margin-top:10px;font-size:9px;font-weight:900;letter-spacing:.13em;color:#64748b}',
      '.wi-dashboard-ref strong{margin-left:6px;padding:5px 8px;border:1px solid #26364d;border-radius:7px;background:#07101b;color:#dbeafe;font:900 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}',
      '.wi-dashboard-status{display:flex;align-items:center;gap:8px;flex:none;border:1px solid;border-radius:10px;padding:10px 12px;font-size:10px;font-weight:950;letter-spacing:.12em}',
      '.wi-dashboard-status span{width:8px;height:8px;border-radius:50%;background:currentColor;box-shadow:0 0 12px currentColor}',
      '.wi-dashboard-status.success{color:#6ee7b7;background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.38)}',
      '.wi-dashboard-status.warning{color:#fcd34d;background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.42)}',
      '.wi-dashboard-status.danger{color:#fca5a5;background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.48)}',
      '.wi-dashboard-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px;padding:16px 22px 20px;border-bottom:1px solid rgba(148,163,184,.11)}',
      '.wi-fact{min-height:72px;padding:12px 13px;border:1px solid #202d3e;border-radius:11px;background:#08111b}',
      '.wi-fact span{display:block;font-size:8px;font-weight:950;letter-spacing:.14em;color:#64748b;margin-bottom:7px}',
      '.wi-fact strong{display:block;color:#e6edf7;font-size:14px;line-height:1.2;font-weight:900;overflow-wrap:anywhere}',
      '.wi-fact.featured{border-color:rgba(59,130,246,.55);background:linear-gradient(145deg,rgba(37,99,235,.2),rgba(8,17,27,.96))}',
      '.wi-fact.featured strong{font-size:18px;color:#fff}',
      '.wi-fact.observed{border-color:rgba(16,185,129,.36)}',
      '.wi-findings,.wi-details-block{padding:19px 22px;border-bottom:1px solid rgba(148,163,184,.11)}',
      '.wi-details-block{border-bottom:0}',
      '.wi-block-title{font-size:10px;font-weight:950;letter-spacing:.17em;color:#8ca0b8;margin-bottom:11px}',
      '.wi-findings-list{display:grid;gap:8px}',
      '.wi-finding{display:flex;align-items:flex-start;gap:10px;border:1px solid #243043;border-radius:10px;padding:11px 12px;background:#09111b}',
      '.wi-finding-mark{display:grid;place-items:center;flex:0 0 22px;height:22px;border-radius:50%;font-size:11px;font-weight:950}',
      '.wi-finding strong{padding-top:2px;font-size:12px;line-height:1.45;color:#d7e0eb;font-weight:800}',
      '.wi-finding.success{border-color:rgba(16,185,129,.27)}',
      '.wi-finding.success .wi-finding-mark{background:rgba(16,185,129,.14);color:#6ee7b7}',
      '.wi-finding.warning{border-color:rgba(245,158,11,.35)}',
      '.wi-finding.warning .wi-finding-mark{background:rgba(245,158,11,.14);color:#fcd34d}',
      '.wi-finding.danger{border-color:rgba(239,68,68,.42);background:rgba(69,10,10,.16)}',
      '.wi-finding.danger .wi-finding-mark{background:rgba(239,68,68,.18);color:#fca5a5}',
      '.wi-no-findings{padding:12px;border:1px dashed #273548;border-radius:10px;color:#7f8fa4;font-size:11px}',
      '.wi-accordion{display:grid;gap:7px}',
      '.wi-detail{border:1px solid #202c3c;border-radius:10px;background:#081019;overflow:hidden}',
      '.wi-detail summary{list-style:none;display:flex;justify-content:space-between;align-items:center;padding:12px 13px;cursor:pointer;color:#cbd5e1;font-size:11px;font-weight:900}',
      '.wi-detail summary::-webkit-details-marker{display:none}',
      '.wi-detail summary b{font-size:18px;line-height:1;color:#6b7f99}',
      '.wi-detail.warning{border-color:rgba(245,158,11,.3)}',
      '.wi-detail.danger{border-color:rgba(239,68,68,.36)}',
      '.wi-detail-body{padding:0 13px 13px;color:#aeb9c8;font-size:10px;line-height:1.55}',
      '.wi-detail-body .provenance-line{display:none!important}',
      '@media(max-width:760px){#compact-watch-information .watch-info-summary{padding:16px}.wi-dashboard-hero{padding:18px 16px;flex-direction:column}.wi-dashboard-title{font-size:22px}.wi-dashboard-facts{padding:14px 16px 17px;grid-template-columns:repeat(2,minmax(0,1fr))}.wi-findings,.wi-details-block{padding:16px}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function install() {
    addStyles();
    var panel=document.getElementById(PANEL_ID);
    if (!panel) return;

    var body=panel.querySelector('.watch-info-body');
    if (body && typeof MutationObserver!=='undefined') {
      var observer=new MutationObserver(function(mutations){
        for (var i=0;i<mutations.length;i++) {
          var target=mutations[i].target;
          var node=target && target.nodeType===1 ? target : target && target.parentElement;
          if (!node || !node.closest || !node.closest('.wi-dashboard')) { schedule(); break; }
        }
      });
      observer.observe(body,{childList:true,subtree:true,characterData:true,attributes:true});
      window.__wapWatchInfoDashboardObserver=observer;
    }

    ['caseRef','fullRef','serialInput','movementCalibre','claspCode','omegaSerialSeries'].forEach(function(id){
      var el=document.getElementById(id);
      if (el) el.addEventListener('input',schedule);
    });
    var brands=document.querySelectorAll('.brand-checkbox');
    for (var j=0;j<brands.length;j++) brands[j].addEventListener('change',schedule);
    panel.addEventListener('toggle',function(){ if (panel.open) schedule(); });
    schedule();
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();