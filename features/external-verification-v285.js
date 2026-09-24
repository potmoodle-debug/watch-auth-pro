/* Watch Auth Pro v2.85.0 — External Verification Hub */
(function(){
  'use strict';

  var STYLE_ID='external-verification-v285-styles';
  var MODAL_ID='external-verification-modal';
  var BUTTON_ID='external-verification-button';

  function clean(v){ return String(v==null?'':v).replace(/\s+/g,' ').trim(); }
  function value(id){ var el=document.getElementById(id); return clean(el&&el.value); }
  function selectedBrand(){
    try { if(typeof getSelectedBrand==='function') return clean(getSelectedBrand()); } catch(e){}
    var el=document.querySelector('.brand-checkbox:checked');
    return clean(el&&el.value);
  }
  function currentReference(){ return value('fullRef') || value('caseRef'); }
  function currentSerial(){ return value('serialInput') || value('omegaSerialSeries'); }
  function enc(v){ return encodeURIComponent(clean(v)); }
  function esc(v){
    return clean(v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function makeQuery(kind, brand, ref, serial, domain){
    var parts=[];
    if(brand) parts.push('"'+brand+'"');
    if(kind==='serial'){
      if(serial) parts.push('"'+serial+'"');
      if(ref) parts.push('"'+ref+'"');
    } else {
      if(ref) parts.push('"'+ref+'"');
    }
    if(domain) parts.push('site:'+domain);
    return parts.join(' ');
  }

  function sources(kind, brand, ref, serial){
    var base=[
      {name:'Google',desc:'Broad web search',domain:'',icon:'G'},
      {name:'WatchBase',desc:'Reference and calibre records',domain:'watchbase.com',icon:'W'},
      {name:'Chrono24',desc:'Comparable listings and reference usage',domain:'chrono24.co.uk',icon:'C'},
      {name:'EveryWatch',desc:'Auction and market reference evidence',domain:'everywatch.com',icon:'E'},
      {name:'WatchCharts',desc:'Model and market reference evidence',domain:'watchcharts.com',icon:'W'}
    ];
    if(kind==='serial'){
      base=[
        {name:'Google',desc:'Exact serial + reference search',domain:'',icon:'G'},
        {name:'Watch forums',desc:'Indexed forum discussions',domain:'watchuseek.com',icon:'F'},
        {name:'Rolex Forums',desc:'Indexed serial/reference discussions',domain:'rolexforums.com',icon:'R'},
        {name:'Chrono24',desc:'Listings that expose the same identifiers',domain:'chrono24.co.uk',icon:'C'}
      ];
    }
    return base.map(function(s){
      var q=makeQuery(kind,brand,ref,serial,s.domain);
      return {
        name:s.name,desc:s.desc,icon:s.icon,
        url:'https://www.google.com/search?q='+enc(q)
      };
    });
  }

  function imageUrl(brand,ref){
    var q=[brand,ref].filter(Boolean).map(function(x){return '"'+x+'"';}).join(' ');
    return 'https://www.google.com/search?tbm=isch&q='+enc(q);
  }

  function addStyles(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=[
      '#'+BUTTON_ID+'{display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:10px 14px;border:1px solid rgba(59,130,246,.55);border-radius:10px;background:linear-gradient(145deg,rgba(37,99,235,.22),rgba(8,17,27,.96));color:#dbeafe;font-size:10px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}',
      '#'+BUTTON_ID+':hover{border-color:#60a5fa;background:linear-gradient(145deg,rgba(37,99,235,.33),rgba(8,17,27,.96));color:#fff}',
      '#'+BUTTON_ID+' .ev-dot{width:8px;height:8px;border-radius:50%;background:#60a5fa;box-shadow:0 0 12px rgba(96,165,250,.95)}',
      '#'+MODAL_ID+'{position:fixed;inset:0;z-index:10000;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.82);backdrop-filter:blur(8px)}',
      '#'+MODAL_ID+'.open{display:flex}',
      '.ev-panel{width:min(980px,96vw);max-height:92vh;overflow:auto;border:1px solid #24364f;border-radius:20px;background:linear-gradient(160deg,#08111e,#04070c 72%);box-shadow:0 30px 80px rgba(0,0,0,.55)}',
      '.ev-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;padding:22px;border-bottom:1px solid #1b2737}',
      '.ev-kicker{font-size:9px;font-weight:950;letter-spacing:.18em;color:#60a5fa;margin-bottom:6px}',
      '.ev-title{font-size:24px;line-height:1.1;font-weight:950;color:#fff;letter-spacing:-.03em}',
      '.ev-sub{margin-top:8px;color:#8fa1b7;font-size:11px;line-height:1.5}',
      '.ev-close{border:1px solid #28374a;background:#0b1420;color:#94a3b8;border-radius:10px;width:38px;height:38px;font-size:20px;cursor:pointer}',
      '.ev-close:hover{color:#fff;border-color:#475569}',
      '.ev-body{padding:20px 22px 24px}',
      '.ev-fields{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px}',
      '.ev-field{border:1px solid #1e2c3d;border-radius:10px;background:#07101a;padding:10px 11px}',
      '.ev-field span{display:block;font-size:8px;font-weight:950;letter-spacing:.12em;color:#64748b;margin-bottom:6px}',
      '.ev-field input{width:100%;border:0;outline:0;background:transparent;color:#e5eef9;font:800 13px/1.2 ui-monospace,SFMono-Regular,Consolas,monospace}',
      '.ev-tabs{display:flex;gap:8px;margin:2px 0 14px}',
      '.ev-tab{border:1px solid #25354a;background:#08111a;color:#7f93ad;border-radius:9px;padding:8px 11px;font-size:9px;font-weight:950;letter-spacing:.09em;text-transform:uppercase;cursor:pointer}',
      '.ev-tab.active{background:rgba(37,99,235,.18);border-color:#3b82f6;color:#bfdbfe}',
      '.ev-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}',
      '.ev-source{display:flex;align-items:center;gap:12px;border:1px solid #1f2d3d;background:#08111a;border-radius:12px;padding:12px 13px;text-decoration:none}',
      '.ev-source:hover{border-color:#3b82f6;background:#0a1522}',
      '.ev-icon{display:grid;place-items:center;flex:0 0 34px;height:34px;border-radius:9px;background:#111d2b;color:#93c5fd;font-size:12px;font-weight:950;border:1px solid #26384d}',
      '.ev-source strong{display:block;color:#e8eef7;font-size:12px;font-weight:900;margin-bottom:3px}',
      '.ev-source small{display:block;color:#71839a;font-size:9px;line-height:1.35}',
      '.ev-open{margin-left:auto;color:#60a5fa;font-size:15px;font-weight:900}',
      '.ev-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:14px;padding-top:14px;border-top:1px solid #172334}',
      '.ev-primary,.ev-secondary{border-radius:10px;padding:10px 13px;font-size:9px;font-weight:950;letter-spacing:.08em;text-transform:uppercase;cursor:pointer}',
      '.ev-primary{border:1px solid #2563eb;background:#1d4ed8;color:#fff}',
      '.ev-secondary{border:1px solid #2a394b;background:#0a131e;color:#aebed0}',
      '.ev-note{margin-top:14px;border:1px solid rgba(245,158,11,.28);background:rgba(120,53,15,.09);border-radius:10px;padding:10px 12px;color:#c7a66b;font-size:9px;line-height:1.5}',
      '@media(max-width:760px){.ev-fields{grid-template-columns:1fr}.ev-grid{grid-template-columns:1fr}.ev-head{padding:18px}.ev-body{padding:16px}}'
    ].join('\n');
    document.head.appendChild(s);
  }

  function ensureModal(){
    var existing=document.getElementById(MODAL_ID);
    if(existing) return existing;

    var modal=document.createElement('div');
    modal.id=MODAL_ID;
    modal.innerHTML=
      '<div class="ev-panel" role="dialog" aria-modal="true" aria-label="External verification">'+
        '<div class="ev-head">'+
          '<div><div class="ev-kicker">WATCH AUTH PRO · RESEARCH TOOL</div><div class="ev-title">External Verification</div>'+
          '<div class="ev-sub">Search the current brand, reference and serial across external sources without changing the case record.</div></div>'+
          '<button type="button" class="ev-close" aria-label="Close">×</button>'+
        '</div>'+
        '<div class="ev-body">'+
          '<div class="ev-fields">'+
            '<label class="ev-field"><span>BRAND</span><input id="ev-brand" type="text"></label>'+
            '<label class="ev-field"><span>REFERENCE</span><input id="ev-reference" type="text"></label>'+
            '<label class="ev-field"><span>SERIAL</span><input id="ev-serial" type="text"></label>'+
          '</div>'+
          '<div class="ev-tabs">'+
            '<button type="button" class="ev-tab active" data-mode="reference">Reference search</button>'+
            '<button type="button" class="ev-tab" data-mode="serial">Serial search</button>'+
          '</div>'+
          '<div id="ev-results" class="ev-grid"></div>'+
          '<div class="ev-actions">'+
            '<button type="button" id="ev-open-all" class="ev-primary">Open all sources</button>'+
            '<button type="button" id="ev-images" class="ev-secondary">Image comparison</button>'+
            '<button type="button" id="ev-refresh" class="ev-secondary">Refresh searches</button>'+
          '</div>'+
          '<div class="ev-note">External results are evidence, not an authentication decision. Serial-number searches are deliberately treated as supporting evidence because serial data can be incomplete, duplicated, altered or non-dateable.</div>'+
        '</div>'+
      '</div>';
    document.body.appendChild(modal);

    modal.querySelector('.ev-close').addEventListener('click',closeModal);
    modal.addEventListener('click',function(e){ if(e.target===modal) closeModal(); });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&modal.classList.contains('open')) closeModal(); });
    modal.querySelectorAll('.ev-tab').forEach(function(tab){
      tab.addEventListener('click',function(){
        modal.querySelectorAll('.ev-tab').forEach(function(t){t.classList.remove('active');});
        tab.classList.add('active');
        modal.setAttribute('data-mode',tab.getAttribute('data-mode'));
        renderSources();
      });
    });
    ['ev-brand','ev-reference','ev-serial'].forEach(function(id){
      modal.querySelector('#'+id).addEventListener('input',renderSources);
    });
    modal.querySelector('#ev-refresh').addEventListener('click',renderSources);
    modal.querySelector('#ev-images').addEventListener('click',function(){
      var brand=value('ev-brand'),ref=value('ev-reference');
      if(!brand&&!ref) return;
      window.open(imageUrl(brand,ref),'_blank','noopener');
    });
    modal.querySelector('#ev-open-all').addEventListener('click',function(){
      var links=modal.querySelectorAll('#ev-results a.ev-source');
      for(var i=0;i<links.length;i++) window.open(links[i].href,'_blank','noopener');
    });
    return modal;
  }

  function renderSources(){
    var modal=ensureModal();
    var mode=modal.getAttribute('data-mode') || 'reference';
    var brand=value('ev-brand'),ref=value('ev-reference'),serial=value('ev-serial');
    var list=sources(mode,brand,ref,serial);
    var root=modal.querySelector('#ev-results');
    root.innerHTML=list.map(function(s){
      return '<a class="ev-source" href="'+esc(s.url)+'" target="_blank" rel="noopener">'+
        '<span class="ev-icon">'+esc(s.icon)+'</span>'+
        '<span><strong>'+esc(s.name)+'</strong><small>'+esc(s.desc)+'</small></span>'+
        '<span class="ev-open">↗</span>'+
      '</a>';
    }).join('');
  }

  function openModal(){
    var modal=ensureModal();
    modal.querySelector('#ev-brand').value=selectedBrand();
    modal.querySelector('#ev-reference').value=currentReference();
    modal.querySelector('#ev-serial').value=currentSerial();
    modal.setAttribute('data-mode','reference');
    modal.querySelectorAll('.ev-tab').forEach(function(t){t.classList.toggle('active',t.getAttribute('data-mode')==='reference');});
    renderSources();
    modal.classList.add('open');
  }
  function closeModal(){ var m=document.getElementById(MODAL_ID); if(m) m.classList.remove('open'); }

  function installButton(){
    if(document.getElementById(BUTTON_ID)) return true;
    var target=document.querySelector('#compact-watch-information .watch-info-summary') || document.querySelector('.wi-dashboard-hero');
    if(!target) return false;
    var btn=document.createElement('button');
    btn.type='button';
    btn.id=BUTTON_ID;
    btn.innerHTML='<span class="ev-dot"></span>Search external sources';
    btn.addEventListener('click',openModal);
    var left=target.querySelector('div') || target;
    left.appendChild(btn);
    return true;
  }

  function install(){
    addStyles();
    ensureModal();
    if(installButton()) return;
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(installButton()||tries>30) clearInterval(timer);
    },250);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();