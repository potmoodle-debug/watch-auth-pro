/* Watch Auth Pro — compact watch information panel
   Version 2.64.0 — 19 August 2026
   Replaces scattered reference-result boxes with one click-to-open panel.
*/
if (typeof DATABASE_META !== 'undefined') {
  DATABASE_META.version = '2.64.0';
  DATABASE_META.updated = '19 August 2026';
  DATABASE_META.scope = 'Reference, serial, calibre, dating, catalogue and clasp results consolidated into one concise click-to-open watch information panel.';
}

(() => {
  const PANEL_ID = 'compact-watch-information';
  const SOURCE_DEFINITIONS = [
    ['caseResult', 'Reference and model', true],
    ['serialResult', 'Serial information', true],
    ['movementMatchResult', 'Movement and calibre', true],
    ['dateEstimateResult', 'Approximate dating', true],
    ['ageClassificationResult', 'Age classification', true],
    ['claspResult', 'Bracelet and clasp', true],
    ['replica-risk-banner', 'Authentication warning', false],
    ['counterfeit-match-alert', 'Counterfeit-register warning', false],
    ['drawer-live-decoding', 'Additional live decoding', false]
  ];
  const WATCH_INPUT_IDS = new Set(['caseRef', 'fullRef', 'serialInput', 'movementCalibre', 'claspCode', 'omegaSerialSeries']);

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function injectStyles() {
    if (document.getElementById('compact-watch-information-styles')) return;
    const style = document.createElement('style');
    style.id = 'compact-watch-information-styles';
    style.textContent = `
      #caseResult,#serialResult,#movementMatchResult,#dateEstimateResult,#ageClassificationResult,#claspResult{display:none!important}
      #live-summary-card{display:none!important}
      .watch-info-panel{margin-top:16px;border:1px solid rgba(59,130,246,.32);border-radius:15px;background:linear-gradient(145deg,rgba(10,18,30,.98),rgba(5,10,18,.98));box-shadow:0 14px 34px rgba(0,0,0,.22);overflow:hidden}
      .watch-info-panel[open]{border-color:rgba(59,130,246,.48);box-shadow:0 18px 44px rgba(0,0,0,.3)}
      .watch-info-panel.watch-info-attention{border-color:rgba(239,68,68,.6)}
      .watch-info-panel.watch-info-review{border-color:rgba(245,158,11,.5)}
      .watch-info-summary{display:flex;align-items:center;gap:13px;min-height:76px;padding:14px 16px;cursor:pointer;list-style:none;user-select:none}
      .watch-info-summary::-webkit-details-marker{display:none}
      .watch-info-icon{display:grid;place-items:center;flex:0 0 40px;height:40px;border:1px solid rgba(59,130,246,.35);border-radius:12px;background:rgba(37,99,235,.12);color:#93c5fd;font-size:19px}
      .watch-info-summary-main{min-width:0;flex:1}
      .watch-info-kicker{color:#60a5fa;font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase}
      .watch-info-primary{margin-top:3px;color:#f3f4f6;font-size:14px;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .watch-info-secondary{margin-top:3px;color:#8b98aa;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .watch-info-status{flex:0 0 auto;border:1px solid rgba(16,185,129,.35);border-radius:999px;padding:5px 8px;background:rgba(16,185,129,.1);color:#6ee7b7;font-size:9px;font-weight:900;letter-spacing:.06em;text-transform:uppercase}
      .watch-info-status.review{border-color:rgba(245,158,11,.45);background:rgba(245,158,11,.1);color:#fcd34d}
      .watch-info-status.attention{border-color:rgba(239,68,68,.5);background:rgba(239,68,68,.12);color:#fca5a5}
      .watch-info-chevron{flex:0 0 auto;color:#64748b;font-size:15px;transition:transform .18s ease}
      .watch-info-panel[open] .watch-info-chevron{transform:rotate(180deg)}
      .watch-info-body{border-top:1px solid rgba(71,85,105,.32);padding:15px}
      .watch-info-overview{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}
      .watch-info-chip{border:1px solid rgba(71,85,105,.5);border-radius:9px;background:rgba(15,23,42,.72);padding:7px 9px;color:#cbd5e1;font-size:10px}
      .watch-info-chip strong{color:#f8fafc}
      .watch-info-sections{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .watch-info-section{min-width:0;border:1px solid rgba(71,85,105,.42);border-radius:12px;background:rgba(2,6,12,.46);padding:12px}
      .watch-info-section.danger{border-color:rgba(239,68,68,.48);background:rgba(69,10,10,.2)}
      .watch-info-section.warning{border-color:rgba(245,158,11,.42);background:rgba(69,39,5,.18)}
      .watch-info-section.success{border-color:rgba(16,185,129,.35);background:rgba(2,44,34,.16)}
      .watch-info-section-label{margin-bottom:8px;color:#94a3b8;font-size:9px;font-weight:900;letter-spacing:.1em;text-transform:uppercase}
      .watch-info-section-content{color:#dbe4ef;font-size:11px;line-height:1.6;overflow-wrap:anywhere}
      .watch-info-section-content>div:first-child{color:#f8fafc}
      .watch-info-section-content .guidance-bullets{margin-top:6px}
      .watch-info-empty{color:#64748b;font-size:11px}
      @media(max-width:760px){.watch-info-sections{grid-template-columns:1fr}.watch-info-status{display:none}.watch-info-summary{padding:13px}.watch-info-primary{font-size:13px}}
    `;
    document.head.appendChild(style);
  }

  function selectedBrand() {
    try {
      const custom = String(localStorage.getItem('watch_auth_pro_custom_brand') || '').trim();
      if (custom) return custom;
      if (typeof getSelectedBrand === 'function') return getSelectedBrand() || '';
    } catch (_) {}
    return document.querySelector('.brand-checkbox:checked')?.value || '';
  }

  function value(id) {
    return String(document.getElementById(id)?.value || '').trim();
  }

  function sourceIsVisible(source) {
    if (!source || !String(source.innerHTML || '').trim()) return false;
    if (source.id === 'drawer-live-decoding') {
      return !/enter a case reference or serial number/i.test(source.textContent || '');
    }
    return !source.classList.contains('hidden');
  }

  function sourceTone(source) {
    const className = String(source.className || '');
    const text = String(source.textContent || '');
    if (/red-|danger/i.test(className) || /critical|counterfeit|replica|mismatch|incorrect factory configuration/i.test(text)) return 'danger';
    if (/amber-|warning/i.test(className) || /manual review|requires review|exact reference required|no exact|not available/i.test(text)) return 'warning';
    if (/emerald-|success/i.test(className) || /matches reference|is consistent/i.test(text)) return 'success';
    return 'info';
  }

  function compactText(value, maximum = 120) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    return text.length > maximum ? `${text.slice(0, maximum - 1).trim()}…` : text;
  }

  function modelSummary(caseSource, brand, reference) {
    const firstStrong = caseSource?.querySelector('strong')?.textContent?.trim();
    if (firstStrong && firstStrong.length <= 90 && !/^source:|^confidence:/i.test(firstStrong)) return firstStrong;
    if (brand && reference) return `${brand} · ${reference}`;
    return brand || reference || 'Watch information available';
  }

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return document.getElementById(PANEL_ID);
    const identifierGrid = document.querySelector('.identifier-grid');
    if (!identifierGrid) return null;

    const panel = document.createElement('details');
    panel.id = PANEL_ID;
    panel.className = 'watch-info-panel';
    panel.hidden = true;
    panel.innerHTML = `
      <summary class="watch-info-summary">
        <span class="watch-info-icon" aria-hidden="true">◉</span>
        <span class="watch-info-summary-main">
          <span class="watch-info-kicker">Watch information</span>
          <span class="watch-info-primary" id="watch-info-primary">Information available</span>
          <span class="watch-info-secondary" id="watch-info-secondary">Click to view all reference information</span>
        </span>
        <span class="watch-info-status" id="watch-info-status">Information ready</span>
        <span class="watch-info-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="watch-info-body">
        <div class="watch-info-overview" id="watch-info-overview"></div>
        <div class="watch-info-sections" id="watch-info-sections"></div>
      </div>`;
    identifierGrid.insertAdjacentElement('afterend', panel);
    return panel;
  }

  function synchronise() {
    const panel = createPanel();
    if (!panel) return;

    const brand = selectedBrand();
    const reference = value('fullRef') || value('caseRef');
    const serial = value('serialInput');
    const calibre = value('movementCalibre');
    const clasp = value('claspCode');
    const populatedSources = SOURCE_DEFINITIONS
      .map(([id, label, hideOriginal]) => ({ source: document.getElementById(id), label, hideOriginal }))
      .filter(item => sourceIsVisible(item.source));
    const hasWatch = Boolean(reference || serial || calibre || clasp || populatedSources.length);
    panel.hidden = !hasWatch;
    if (!hasWatch) {
      panel.open = false;
      return;
    }

    const caseSource = document.getElementById('caseResult');
    const visibleCaseSource = sourceIsVisible(caseSource) ? caseSource : null;
    const tones = populatedSources.map(item => sourceTone(item.source));
    const overallTone = tones.includes('danger') ? 'danger' : tones.includes('warning') ? 'warning' : 'info';
    const primary = modelSummary(visibleCaseSource, brand, reference);
    const secondaryParts = [];
    if (brand && !primary.toLowerCase().includes(brand.toLowerCase())) secondaryParts.push(brand);
    if (reference && !primary.toLowerCase().includes(reference.toLowerCase())) secondaryParts.push(`Ref. ${reference}`);
    if (calibre) secondaryParts.push(calibre);
    if (!secondaryParts.length) secondaryParts.push('Click to view all available information');

    document.getElementById('watch-info-primary').textContent = compactText(primary, 92);
    document.getElementById('watch-info-secondary').textContent = compactText(secondaryParts.join(' · '), 120);

    const status = document.getElementById('watch-info-status');
    status.className = `watch-info-status${overallTone === 'danger' ? ' attention' : overallTone === 'warning' ? ' review' : ''}`;
    status.textContent = overallTone === 'danger' ? 'Attention required' : overallTone === 'warning' ? 'Review advised' : 'Information ready';
    panel.classList.toggle('watch-info-attention', overallTone === 'danger');
    panel.classList.toggle('watch-info-review', overallTone === 'warning');

    const chips = [
      brand ? ['Brand', brand] : null,
      reference ? ['Reference', reference] : null,
      serial ? ['Serial', serial] : null,
      calibre ? ['Observed calibre', calibre] : null,
      clasp ? ['Clasp / bracelet', clasp] : null
    ].filter(Boolean);
    document.getElementById('watch-info-overview').innerHTML = chips
      .map(([label, text]) => `<span class="watch-info-chip"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(text)}</span>`)
      .join('');

    const sections = document.getElementById('watch-info-sections');
    sections.innerHTML = populatedSources.map(({ source, label }) => {
      const tone = sourceTone(source);
      return `<section class="watch-info-section ${tone}"><div class="watch-info-section-label">${escapeHtml(label)}</div><div class="watch-info-section-content">${source.innerHTML}</div></section>`;
    }).join('') || '<div class="watch-info-empty">Enter a complete reference to display the available watch information.</div>';
  }

  function observeSources() {
    const observer = new MutationObserver(() => queueMicrotask(synchronise));
    SOURCE_DEFINITIONS.forEach(([id]) => {
      const source = document.getElementById(id);
      if (source) observer.observe(source, { attributes: true, childList: true, subtree: true, characterData: true });
    });
  }

  function initialise() {
    injectStyles();
    if (!createPanel()) return;
    observeSources();
    document.addEventListener('input', event => {
      if (WATCH_INPUT_IDS.has(event.target?.id)) queueMicrotask(synchronise);
    });
    document.addEventListener('change', event => {
      if (WATCH_INPUT_IDS.has(event.target?.id) || event.target?.classList?.contains('brand-checkbox')) queueMicrotask(synchronise);
    });
    synchronise();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
