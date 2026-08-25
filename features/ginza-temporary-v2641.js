(() => {
  'use strict';

  const COMPONENTS = [
    ['Case', 'Case'],
    ['Crown', 'Crown'],
    ['Bracelet/Strap', 'Bracelet/Strap'],
    ['Clasp/Buckle', 'Clasp/Buckle'],
    ['Bezel', 'Bezel'],
    ['Dial', 'Dial'],
    ['Hand', 'Hand'],
    ['Crystal', 'Crystal'],
    ['End Links', 'End Links'],
    ['Movement', 'Movement']
  ];
  const OPTIONS = ['Original', 'Replica', 'Generic', 'Customized'];
  const state = Object.fromEntries(COMPONENTS.map(([key]) => [key, 'Original']));
  let outputObserver = null;

  function addStyles() {
    if (document.getElementById('ginza-temp-styles')) return;
    const style = document.createElement('style');
    style.id = 'ginza-temp-styles';
    style.textContent = `
      #tab-ginza-btn { position: relative; }
      #tab-ginza-btn::after { content: 'TEMP'; margin-left: 6px; font-size: 8px; line-height: 1; padding: 3px 5px; border-radius: 999px; background: rgba(245,158,11,.16); color: #fbbf24; border: 1px solid rgba(245,158,11,.3); }
      body.simple-mode #workflow-tabs #tab-ginza-btn { display:flex !important; }
      .ginza-temp-panel { border-color: rgba(245,158,11,.28) !important; }
      .ginza-temp-toolbar { display:flex; gap:8px; flex-wrap:wrap; align-items:center; justify-content:space-between; margin-bottom:16px; }
      .ginza-temp-note { font-size:12px; color:#9ca3af; line-height:1.55; max-width:820px; }
      .ginza-temp-grid { border:1px solid rgba(75,85,99,.55); border-radius:14px; overflow:hidden; background:rgba(3,7,18,.35); }
      .ginza-temp-row { display:grid; grid-template-columns:minmax(150px, 1.1fr) repeat(4,minmax(112px,1fr)); align-items:center; gap:8px; padding:12px 14px; border-bottom:1px solid rgba(75,85,99,.45); }
      .ginza-temp-row:last-child { border-bottom:0; }
      .ginza-temp-component { font-weight:800; color:#e5e7eb; }
      .ginza-temp-choice { display:flex; align-items:center; gap:7px; font-size:13px; color:#cbd5e1; cursor:pointer; min-width:0; }
      .ginza-temp-choice input { accent-color:#2563eb; width:17px; height:17px; flex:0 0 auto; }
      .ginza-temp-summary { margin-top:16px; padding:14px 16px; border-radius:12px; border:1px solid rgba(59,130,246,.25); background:rgba(37,99,235,.07); }
      .ginza-temp-summary-title { font-size:10px; text-transform:uppercase; letter-spacing:.14em; font-weight:900; color:#60a5fa; margin-bottom:6px; }
      .ginza-temp-summary-text { font-size:13px; line-height:1.55; color:#d1d5db; }
      [data-ginza-note='true'] { display:block; margin-top:.65em; }
      @media (max-width: 900px) {
        .ginza-temp-row { grid-template-columns:1fr 1fr; }
        .ginza-temp-component { grid-column:1 / -1; margin-bottom:2px; }
      }
    `;
    document.head.appendChild(style);
  }

  function buildRows() {
    return COMPONENTS.map(([key, label]) => {
      const safe = key.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      const choices = OPTIONS.map(option => `
        <label class="ginza-temp-choice">
          <input type="radio" name="ginza-${safe}" value="${option}" ${option === 'Original' ? 'checked' : ''}>
          <span>${option}</span>
        </label>`).join('');
      return `<div class="ginza-temp-row" data-ginza-component="${key}"><div class="ginza-temp-component">${label}</div>${choices}</div>`;
    }).join('');
  }

  function buildChangeText() {
    const changes = COMPONENTS
      .map(([key, label]) => state[key] !== 'Original' ? `${label}: ${state[key]}` : null)
      .filter(Boolean);
    return changes.length ? `Component changes: ${changes.join('; ')}.` : '';
  }

  function updateSummary() {
    const el = document.getElementById('ginza-temp-summary-text');
    if (!el) return;
    const text = buildChangeText();
    el.textContent = text || 'No Ginza component changes recorded. All components are set to Original.';
  }

  function applyToAuthenticationNote() {
    const output = document.getElementById('output');
    if (!output) return;

    if (outputObserver) outputObserver.disconnect();
    output.querySelectorAll('[data-ginza-note="true"]').forEach(node => node.remove());

    const text = buildChangeText();
    if (text) {
      const node = document.createElement('span');
      node.dataset.ginzaNote = 'true';
      node.textContent = text;
      output.appendChild(node);
    }

    if (outputObserver) {
      outputObserver.observe(output, { childList: true, subtree: true, characterData: true });
    }
  }

  function setAllOriginal() {
    COMPONENTS.forEach(([key]) => { state[key] = 'Original'; });
    document.querySelectorAll('#tab-ginza-content input[type="radio"][value="Original"]').forEach(input => { input.checked = true; });
    updateSummary();
    applyToAuthenticationNote();
  }

  function copyCurrentChanges() {
    const text = buildChangeText() || 'No Ginza component changes recorded.';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        if (typeof window.showToast === 'function') window.showToast('GINZA CHANGES COPIED');
      }).catch(() => {});
    }
  }

  function createTab() {
    const tabs = document.getElementById('workflow-tabs');
    const primary = document.querySelector('.primary-column');
    if (!tabs || !primary || document.getElementById('tab-ginza-btn')) return;

    const button = document.createElement('button');
    button.id = 'tab-ginza-btn';
    button.type = 'button';
    button.innerHTML = '<span class="step-number">T</span><span class="tab-symbol" aria-hidden="true">◎</span>Ginza check';
    button.addEventListener('click', () => window.switchTab('ginza'));

    const checklistBtn = document.getElementById('tab-checklist-btn');
    if (checklistBtn && checklistBtn.nextSibling) tabs.insertBefore(button, checklistBtn.nextSibling);
    else tabs.appendChild(button);

    const content = document.createElement('div');
    content.id = 'tab-ginza-content';
    content.className = 'hidden';
    content.innerHTML = `
      <section class="panel ginza-temp-panel">
        <div class="panel-header">
          <div>
            <div class="panel-kicker">Temporary Ginza safeguard</div>
            <div class="panel-title-line"><span class="panel-title-symbol" aria-hidden="true">◎</span><h2 class="panel-title">Ginza component changes</h2></div>
            <p class="panel-description">Record only the component settings that differ from Original. Any non-Original selection is automatically added to the Authentication Note.</p>
          </div>
        </div>
        <div class="panel-body">
          <div class="ginza-temp-toolbar">
            <div class="ginza-temp-note">This is an independent record of what you intended to select in Ginza. It does not alter the Watch Auth Pro authentication logic or database.</div>
            <div class="flex gap-2 flex-wrap">
              <button type="button" id="ginza-copy-changes" class="action-secondary">Copy changes</button>
              <button type="button" id="ginza-reset-original" class="action-secondary">Set all Original</button>
            </div>
          </div>
          <div class="ginza-temp-grid">${buildRows()}</div>
          <div class="ginza-temp-summary">
            <div class="ginza-temp-summary-title">Authentication note addition</div>
            <div id="ginza-temp-summary-text" class="ginza-temp-summary-text">No Ginza component changes recorded. All components are set to Original.</div>
          </div>
        </div>
      </section>`;

    const checklistContent = document.getElementById('tab-checklist-content');
    if (checklistContent && checklistContent.nextSibling) primary.insertBefore(content, checklistContent.nextSibling);
    else primary.appendChild(content);

    content.addEventListener('change', event => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'radio') return;
      const row = input.closest('[data-ginza-component]');
      if (!row) return;
      state[row.dataset.ginzaComponent] = input.value;
      updateSummary();
      applyToAuthenticationNote();
    });

    document.getElementById('ginza-reset-original')?.addEventListener('click', setAllOriginal);
    document.getElementById('ginza-copy-changes')?.addEventListener('click', copyCurrentChanges);
  }

  function installTabSwitchHook() {
    if (window.__ginzaSwitchHookInstalled) return;
    const original = window.switchTab;
    if (typeof original !== 'function') return;

    window.switchTab = function(tab) {
      const ginzaContent = document.getElementById('tab-ginza-content');
      const ginzaBtn = document.getElementById('tab-ginza-btn');

      if (tab !== 'ginza') {
        ginzaContent?.classList.add('hidden');
        if (ginzaBtn) ginzaBtn.className = '';
        return original.apply(this, arguments);
      }

      ['tab-details-content','tab-checklist-content','tab-history-content','tab-missing-content','tab-counterfeit-content']
        .forEach(id => document.getElementById(id)?.classList.add('hidden'));

      ['tab-details-btn','tab-checklist-btn','tab-history-btn','tab-missing-btn','tab-counterfeit-btn']
        .forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.className = 'text-sm font-bold pb-2 border-b-2 border-transparent text-gray-400 hover:text-white uppercase tracking-wider transition-all duration-200 flex items-center gap-2';
        });

      if (ginzaBtn) ginzaBtn.className = 'text-sm font-bold pb-2 border-b-2 border-amber-500 text-amber-400 uppercase tracking-wider transition-all duration-200 flex items-center gap-2';
      ginzaContent?.classList.remove('hidden');
      document.getElementById('preview-section')?.classList.remove('hidden');
      document.getElementById('footer-actions')?.classList.remove('hidden');
      applyToAuthenticationNote();
    };

    window.__ginzaSwitchHookInstalled = true;
  }

  function installResetHook() {
    if (window.__ginzaResetHookInstalled || typeof window.resetAll !== 'function') return;
    const originalReset = window.resetAll;
    window.resetAll = function() {
      const result = originalReset.apply(this, arguments);
      setAllOriginal();
      return result;
    };
    window.__ginzaResetHookInstalled = true;
  }

  function observeAuthenticationNote() {
    const output = document.getElementById('output');
    if (!output || outputObserver) return;
    outputObserver = new MutationObserver(() => applyToAuthenticationNote());
    outputObserver.observe(output, { childList: true, subtree: true, characterData: true });
    applyToAuthenticationNote();
  }

  function init() {
    addStyles();
    createTab();
    installTabSwitchHook();
    installResetHook();
    observeAuthenticationNote();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
