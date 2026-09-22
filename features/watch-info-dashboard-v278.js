/* Watch Auth Pro v2.78.0 — bold glance-first Watch Information dashboard
   Replaces the long expanded Watch Information stack with:
   1) strong status + key facts,
   2) short deduplicated authentication findings,
   3) deeper evidence in collapsed sections.
*/
(function(){
  'use strict';

  const PANEL_ID='compact-watch-information';
  const SOURCE_DEFS=[
    ['caseResult','Reference details','Reference'],
    ['movementMatchResult','Movement detail','Movement'],
    ['serialResult','Serial information','Serial'],
    ['dateEstimateResult','Dating detail','Dating'],
    ['ageClassificationResult','Age classification','Dating'],
    ['claspResult','Bracelet / clasp','Clasp'],
    ['replica-risk-banner','Authentication warning','Warning'],
    ['counterfeit-match-alert','Counterfeit-register warning','Warning'],
    ['drawer-live-decoding','Additional decoding','Reference']
  ];
  let scheduled=false,building=false,observer=null;

  const clean=v=>String(v==null?'':v).replace(/\s+/g,' ').trim();
  const esc=v=>clean(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key=v=>clean(v).toLowerCase().replace(/[^a-z0-9]+/g,' ');
  const compact=(v,n=150)=>{const s=clean(v);return s.length>n?s.slice(0,n-1).trim()+'…':s;};

  function brand(){
    try{ if(typeof getSelectedBrand==='function') return getSelectedBrand()||''; }catch(_){}
    return document.querySelector('.brand-checkbox:checked')?.value||'';
  }
  function val(id){return clean(document.getElementById(id)?.value);}
  function ref(){return val('fullRef')||val('caseRef');}

  function visibleSource(el){
    if(!el||!clean(el.textContent)) return false;
    if(el.id==='drawer-live-decoding'&&/enter a case reference or serial number/i.test(el.textContent||'')) return false;
    return !el.classList.contains('hidden');
  }
  function tone(el){
    const c=String(el?.className||''),t=clean(el?.textContent);
    if(/red-|danger/i.test(c)||/critical|counterfeit|replica|mismatch|incorrect factory configuration|known fake/i.test(t)) return 'danger';
    if(/amber-|warning/i.test(c)||/manual review|requires review|review advised|exact reference required|no exact|not available|uncertain/i.test(t)) return 'warning';
    if(/emerald-|success/i.test(c)||/matches reference|is consistent|consistent with|identified/i.test(t)) return 'success';
    return 'info';
  }

  function resolveRule(b,r){
    if(!b||!r) return null;
    try{
      if(window.WAPReferenceLookup?.resolve) return window.WAPReferenceLookup.resolve(b,r)?.rule||null;
      if(b==='Omega'&&typeof lookupOmegaReference==='function') return lookupOmegaReference(r)?.rule||null;
      if(b==='Tudor'&&typeof lookupTudorReference==='function') return lookupTudorReference(r)?.rule||null;
      if(b==='Breitling'&&typeof lookupBreitlingReference==='function') return lookupBreitlingReference(r)?.rule||null;
      if(b==='Cartier'&&typeof lookupCartierReference==='function') return lookupCartierReference(r)?.rule||null;
      if(typeof lookupOtherReference==='function') return lookupOtherReference(b,r)||null;
    }catch(_){}
    return null;
  }

  function first(){
    for(const x of arguments){if(clean(x)) return clean(x);}
    return '';
  }
  function expectedCal(rule){
    return first(rule?.calibreDisplay,Array.isArray(rule?.calibre)?rule.calibre[0]:rule?.calibre);
  }
  function water(rule){
    const s=[rule?.waterResistance,rule?.water,rule?.caseDetails,rule?.notes].filter(Boolean).join(' ');
    const m=s.match(/(\d{2,4})\s*m\b/i); return m?m[1]+' m':'';
  }
  function production(rule){
    return first(rule?.production,rule?.era);
  }

  function meaningfulChunks(el){
    if(!el) return [];
    const clone=el.cloneNode(true);
    clone.querySelectorAll('.provenance-line,script,style,button').forEach(n=>n.remove());
    let chunks=[...clone.querySelectorAll('li,p')].map(n=>clean(n.textContent)).filter(Boolean);
    if(!chunks.length){
      chunks=clean(clone.textContent).split(/(?<=[.!?])\s+|\s*[•·]\s*/).map(clean).filter(Boolean);
    }
    return chunks.filter(t=>
      t.length>=12 &&
      t.length<=260 &&
      !/^source\s*:/i.test(t) &&
      !/^confidence\s*:/i.test(t) &&
      !/^reference and model$/i.test(t)
    );
  }

  function collectFindings(sources,rule,observed){
    const findings=[];
    const seen=new Set();
    const push=(text,t='info')=>{
      text=compact(text,175); if(!text) return;
      const k=key(text); if(!k||seen.has(k)) return;
      if([...seen].some(x=>x.length>24&&(x.includes(k)||k.includes(x)))) return;
      seen.add(k); findings.push({text,tone:t});
    };

    const exp=expectedCal(rule);
    if(observed&&exp){
      const a=key(observed).replace(/calibre|cal/g,''), aliases=(Array.isArray(rule?.calibre)?rule.calibre:[exp]).map(x=>key(x).replace(/calibre|cal/g,''));
      if(aliases.some(x=>x&&(a.includes(x)||x.includes(a)))) push('Observed movement is consistent with the expected '+exp+' calibre.','success');
    }

    sources.sort((a,b)=>({danger:0,warning:1,success:2,info:3}[a.tone]-({danger:0,warning:1,success:2,info:3}[b.tone]));
    for(const item of sources){
      for(const c of meaningfulChunks(item.el)){
        if(/source|confidence|database source/i.test(c)) continue;
        if(rule?.family&&key(c)===key(rule.family)) continue;
        push(c,item.tone);
        if(findings.length>=6) return findings;
      }
    }
    return findings.slice(0,6);
  }

  function strippedHtml(el){
    const clone=el.cloneNode(true);
    clone.querySelectorAll('.provenance-line,script,style,button').forEach(n=>n.remove());
    return clean(clone.innerHTML);
  }

  function sourceMetadata(el){
    const out=[];
    el?.querySelectorAll('.provenance-line').forEach(n=>{const t=clean(n.textContent);if(t)out.push(t);});
    const txt=clean(el?.textContent);
    const m=txt.match(/Source:\s*([^\n]+?)(?:Confidence:|$)/i); if(m?.[1]) out.push('Source: '+clean(m[1]));
    const c=txt.match(/Confidence:\s*([^\n]+)$/i); if(c?.[1]) out.push('Confidence: '+clean(c[1]));
    return out;
  }

  function build(){
    if(building) return;
    building=true;
    try{
      const panel=document.getElementById(PANEL_ID);
      if(!panel||panel.hidden) return;

      const b=brand(),r=ref(),serial=val('serialInput'),observed=val('movementCalibre'),clasp=val('claspCode');
      const rule=resolveRule(b,r);
      const model=first(rule?.family,rule?.model,b&&r?b+' '+r:b||r||'Watch information');
      const exp=expectedCal(rule);

      const sources=SOURCE_DEFS.map(([id,label,group])=>{
        const el=document.getElementById(id); return {id,label,group,el,tone:tone(el)};
      }).filter(x=>visibleSource(x.el));

      const tones=sources.map(x=>x.tone);
      const overall=tones.includes('danger')?'danger':tones.includes('warning')?'warning':'success';
      const statusText=overall==='danger'?'ATTENTION':overall==='warning'?'REVIEW':'CONSISTENT';

      panel.classList.toggle('watch-info-attention',overall==='danger');
      panel.classList.toggle('watch-info-review',overall==='warning');
      panel.classList.add('wi-bold-dashboard');

      const primary=document.getElementById('watch-info-primary');
      const secondary=document.getElementById('watch-info-secondary');
      const status=document.getElementById('watch-info-status');
      if(primary) primary.textContent=model;
      if(secondary) secondary.textContent=[b,r?'Ref. '+r:''].filter(Boolean).join(' · ')||'Click to view watch information';
      if(status){status.className='watch-info-status '+overall;status.textContent=statusText;}

      const overview=document.getElementById('watch-info-overview');
      if(overview) overview.innerHTML='';

      const sections=document.getElementById('watch-info-sections');
      if(!sections) return;

      const facts=[
        ['EXPECTED CALIBRE',exp,'featured'],
        ['OBSERVED CALIBRE',observed,observed&&exp?'observed':''],
        ['SIZE',first(rule?.size),''],
        ['PRODUCTION',production(rule),''],
        ['POWER RESERVE',first(rule?.reserve),''],
        ['WATER RESISTANCE',water(rule),'']
      ].filter(x=>clean(x[1]));

      const findings=collectFindings(sources,rule,observed);

      const groups=[];
      const seenDetail=new Set();
      const sourceNotes=[];
      for(const s of sources){
        const html=strippedHtml(s.el),txt=key(s.el.textContent);
        sourceMetadata(s.el).forEach(x=>sourceNotes.push(x));
        if(!html||!txt) continue;
        if([...seenDetail].some(x=>x===txt||(x.length>60&&(x.includes(txt)||txt.includes(x))))) continue;
        seenDetail.add(txt);
        groups.push({label:s.label,group:s.group,html,tone:s.tone});
      }

      const uniqueSources=[...new Set(sourceNotes.map(clean).filter(Boolean))];

      sections.innerHTML=
        '<div class="wi-dashboard">'+
          '<div class="wi-dashboard-hero">'+
            '<div><div class="wi-dashboard-kicker">'+esc(b||'WATCH')+' · QUICK AUTHENTICATION VIEW</div>'+
            '<div class="wi-dashboard-title">'+esc(model)+'</div>'+
            (r?'<div class="wi-dashboard-ref">REF <strong>'+esc(r)+'</strong></div>':'')+'</div>'+
            '<div class="wi-dashboard-status '+overall+'"><span></span>'+statusText+'</div>'+
          '</div>'+
          (facts.length?'<div class="wi-dashboard-facts">'+facts.map(([l,v,c])=>'<div class="wi-fact '+c+'"><span>'+esc(l)+'</span><strong>'+esc(v)+'</strong></div>').join('')+'</div>':'')+
          '<section class="wi-findings">'+
            '<div class="wi-block-title">WHAT MATTERS</div>'+
            (findings.length?'<div class="wi-findings-list">'+findings.map(f=>'<div class="wi-finding '+f.tone+'"><span class="wi-finding-mark">'+(f.tone==='danger'?'!':f.tone==='warning'?'!':'✓')+'</span><strong>'+esc(f.text)+'</strong></div>').join('')+'</div>':'<div class="wi-no-findings">No additional authentication warnings are currently being raised.</div>')+
          '</section>'+
          '<section class="wi-details-block">'+
            '<div class="wi-block-title">DEEPER DETAIL</div>'+
            '<div class="wi-accordion">'+groups.map(g=>'<details class="wi-detail '+g.tone+'"><summary><span>'+esc(g.label)+'</span><b>+</b></summary><div class="wi-detail-body">'+g.html+'</div></details>').join('')+
            (uniqueSources.length?'<details class="wi-detail info"><summary><span>Sources & confidence</span><b>+</b></summary><div class="wi-source-list">'+uniqueSources.map(s=>'<div>'+esc(s)+'</div>').join('')+'</div></details>':'')+
            '</div>'+
          '</section>'+
        '</div>';

      sections.querySelectorAll('.wi-detail').forEach(d=>d.addEventListener('toggle',()=>{const b=d.querySelector('summary b');if(b)b.textContent=d.open?'−':'+';}));
    }finally{building=false;}
  }

  function schedule(){
    if(scheduled) return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;build();});
  }

  function styles(){
    if(document.getElementById('wi-bold-dashboard-styles')) return;
    const s=document.createElement('style'); s.id='wi-bold-dashboard-styles';
    s.textContent=`
      #compact-watch-information.wi-bold-dashboard{border:2px solid rgba(59,130,246,.45);border-radius:20px;background:linear-gradient(150deg,#08111e 0%,#050a11 72%);box-shadow:0 20px 50px rgba(0,0,0,.34)}
      #compact-watch-information.wi-bold-dashboard.watch-info-attention{border-color:rgba(239,68,68,.72)}
      #compact-watch-information.wi-bold-dashboard.watch-info-review{border-color:rgba(245,158,11,.64)}
      #compact-watch-information .watch-info-summary{min-height:96px;padding:20px 22px;gap:18px}
      #compact-watch-information .watch-info-icon{width:50px;flex-basis:50px;height:50px;border-radius:14px;font-size:24px;border-width:2px}
      #compact-watch-information .watch-info-kicker{font-size:11px;letter-spacing:.16em;color:#67a8ff}
      #compact-watch-information .watch-info-primary{font-size:20px;line-height:1.15;font-weight:950;letter-spacing:-.025em;color:#fff}
      #compact-watch-information .watch-info-secondary{font-size:12px;margin-top:7px;color:#94a3b8;font-weight:700}
      #compact-watch-information .watch-info-status{font-size:10px;font-weight:950;padding:8px 12px;border-width:1px}
      #compact-watch-information .watch-info-status.success{color:#6ee7b7;background:rgba(16,185,129,.12);border-color:rgba(16,185,129,.42)}
      #compact-watch-information .watch-info-status.warning{color:#fcd34d;background:rgba(245,158,11,.12);border-color:rgba(245,158,11,.46)}
      #compact-watch-information .watch-info-status.danger{color:#fca5a5;background:rgba(239,68,68,.14);border-color:rgba(239,68,68,.52)}
      #compact-watch-information .watch-info-body{padding:0;border-top:1px solid rgba(148,163,184,.15)}
      #compact-watch-information .watch-info-overview{display:none!important}
      #compact-watch-information .watch-info-sections{display:block!important}
      .wi-dashboard{width:100%}
      .wi-dashboard-hero{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding:22px 22px 18px;background:linear-gradient(90deg,rgba(37,99,235,.13),transparent 58%);border-bottom:1px solid rgba(148,163,184,.13)}
      .wi-dashboard-kicker{font-size:9px;font-weight:950;letter-spacing:.18em;color:#6ea8ff;margin-bottom:7px}
      .wi-dashboard-title{font-size:26px;line-height:1.08;font-weight:950;color:#fff;letter-spacing:-.035em}
      .wi-dashboard-ref{margin-top:10px;font-size:9px;font-weight:900;letter-spacing:.13em;color:#64748b}
      .wi-dashboard-ref strong{margin-left:6px;padding:5px 8px;border:1px solid #26364d;border-radius:7px;background:#07101b;color:#dbeafe;font:900 12px/1 ui-monospace,SFMono-Regular,Consolas,monospace}
      .wi-dashboard-status{display:flex;align-items:center;gap:8px;flex:none;border:1px solid;border-radius:10px;padding:10px 12px;font-size:10px;font-weight:950;letter-spacing:.12em}
      .wi-dashboard-status span{width:8px;height:8px;border-radius:50%;background:currentColor;box-shadow:0 0 12px currentColor}
      .wi-dashboard-status.success{color:#6ee7b7;background:rgba(16,185,129,.1);border-color:rgba(16,185,129,.38)}
      .wi-dashboard-status.warning{color:#fcd34d;background:rgba(245,158,11,.1);border-color:rgba(245,158,11,.42)}
      .wi-dashboard-status.danger{color:#fca5a5;background:rgba(239,68,68,.12);border-color:rgba(239,68,68,.48)}
      .wi-dashboard-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:9px;padding:16px 22px 20px;border-bottom:1px solid rgba(148,163,184,.11)}
      .wi-fact{min-height:72px;padding:12px 13px;border:1px solid #202d3e;border-radius:11px;background:#08111b}
      .wi-fact span{display:block;font-size:8px;font-weight:950;letter-spacing:.14em;color:#64748b;margin-bottom:7px}
      .wi-fact strong{display:block;color:#e6edf7;font-size:14px;line-height:1.2;font-weight:900;overflow-wrap:anywhere}
      .wi-fact.featured{border-color:rgba(59,130,246,.52);background:linear-gradient(145deg,rgba(37,99,235,.18),rgba(8,17,27,.96))}
      .wi-fact.featured strong{font-size:18px;color:#fff}
      .wi-fact.observed{border-color:rgba(16,185,129,.34)}
      .wi-findings,.wi-details-block{padding:19px 22px;border-bottom:1px solid rgba(148,163,184,.11)}
      .wi-details-block{border-bottom:0}
      .wi-block-title{font-size:10px;font-weight:950;letter-spacing:.17em;color:#8ca0b8;margin-bottom:11px}
      .wi-findings-list{display:grid;gap:8px}
      .wi-finding{display:flex;align-items:flex-start;gap:10px;border:1px solid #243043;border-radius:10px;padding:11px 12px;background:#09111b}
      .wi-finding-mark{display:grid;place-items:center;flex:0 0 22px;height:22px;border-radius:50%;font-size:11px;font-weight:950}
      .wi-finding strong{padding-top:2px;font-size:12px;line-height:1.45;color:#d7e0eb;font-weight:780}
      .wi-finding.success{border-color:rgba(16,185,129,.26)} .wi-finding.success .wi-finding-mark{background:rgba(16,185,129,.14);color:#6ee7b7}
      .wi-finding.warning{border-color:rgba(245,158,11,.35)} .wi-finding.warning .wi-finding-mark{background:rgba(245,158,11,.14);color:#fcd34d}
      .wi-finding.danger{border-color:rgba(239,68,68,.42);background:rgba(69,10,10,.16)} .wi-finding.danger .wi-finding-mark{background:rgba(239,68,68,.18);color:#fca5a5}
      .wi-no-findings{padding:12px;border:1px dashed #273548;border-radius:10px;color:#7f8fa4;font-size:11px}
      .wi-accordion{display:grid;gap:7px}
      .wi-detail{border:1px solid #202c3c;border-radius:10px;background:#081019;overflow:hidden}
      .wi-detail summary{list-style:none;display:flex;justify-content:space-between;align-items:center;padding:12px 13px;cursor:pointer;color:#cbd5e1;font-size:11px;font-weight:900}
      .wi-detail summary::-webkit-details-marker{display:none}
      .wi-detail summary b{font-size:18px;line-height:1;color:#6b7f99}
      .wi-detail.warning{border-color:rgba(245,158,11,.3)} .wi-detail.danger{border-color:rgba(239,68,68,.36)}
      .wi-detail-body{padding:0 13px 13px;color:#aeb9c8;font-size:10px;line-height:1.55}
      .wi-detail-body .provenance-line{display:none!important}
      .wi-source-list{padding:0 13px 13px;display:grid;gap:7px;color:#8594a8;font-size:10px;line-height:1.45}
      @media(max-width:760px){
        #compact-watch-information .watch-info-summary{padding:16px}
        #compact-watch-information .watch-info-primary{font-size:17px}
        .wi-dashboard-hero{padding:18px 16px;flex-direction:column}
        .wi-dashboard-title{font-size:22px}
        .wi-dashboard-facts{padding:14px 16px 17px;grid-template-columns:repeat(2,minmax(0,1fr))}
        .wi-findings,.wi-details-block{padding:16px}
      }
    `; document.head.appendChild(s);
  }

  function install(){
    styles();
    const panel=document.getElementById(PANEL_ID);
    if(!panel) return;
    const body=panel.querySelector('.watch-info-body');
    if(body&&typeof MutationObserver!=='undefined'){
      observer=new MutationObserver(ms=>{
        const external=ms.some(m=>!m.target?.closest?.('.wi-dashboard'));
        if(external) schedule();
      });
      observer.observe(body,{childList:true,subtree:true,characterData:true,attributes:true});
      window.__wapWatchInfoDashboardObserver=observer;
    }
    ['caseRef','fullRef','serialInput','movementCalibre','claspCode','omegaSerialSeries'].forEach(id=>document.getElementById(id)?.addEventListener('input',schedule));
    document.querySelectorAll('.brand-checkbox').forEach(el=>el.addEventListener('change',schedule));
    panel.addEventListener('toggle',()=>{if(panel.open)schedule();});
    schedule();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true}); else install();
})();