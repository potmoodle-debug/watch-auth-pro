/* Watch Auth Pro — RMA / Returns workspace
   Version 2.60.0 — 17 August 2026
   Completely separate note builder for RMA / return jobs.
*/

if (typeof DATABASE_META !== 'undefined') {
    DATABASE_META.version = '2.60.0';
    DATABASE_META.updated = '17 August 2026';
    DATABASE_META.scope = 'Separate RMA / Returns workspace with quick-add bullet note builder; existing authentication workflow remains independent.';
}

(() => {
    const DRAFT_KEY = 'watch_auth_pro_rma_draft_v260';
    const TAB_ID = 'tab-rma-btn';
    const PANEL_ID = 'tab-rma-content';

    const QUICK_BULLETS = [
        ['Watch stopped', 'Customer reports watch has stopped.'],
        ['Intermittent stopping', 'Customer reports intermittent stopping.'],
        ['Running slow', 'Customer reports watch is losing time.'],
        ['Running fast', 'Customer reports watch is gaining time.'],
        ['Low power reserve', 'Customer reports reduced power reserve.'],
        ['Winding issue', 'Customer reports winding issue.'],
        ['Crown issue', 'Customer reports crown / setting issue.'],
        ['Date / day issue', 'Customer reports date / day change issue.'],
        ['Chronograph issue', 'Customer reports chronograph function / reset issue.'],
        ['Quartz stopped', 'Quartz watch has stopped / battery-related fault reported.'],
        ['Bezel issue', 'Customer reports bezel issue.'],
        ['Bracelet / clasp', 'Customer reports bracelet / clasp issue.'],
        ['Water ingress', 'Customer reports moisture / water ingress.'],
        ['Condensation', 'Customer reports condensation under the crystal.'],
        ['Cosmetic damage', 'Customer reports cosmetic damage.'],
        ['Same fault returned', 'Watch has returned with the same reported fault after previous work.'],
        ['New fault after repair', 'Customer reports a new fault following previous repair / service.'],
        ['No fault found', 'No fault found during initial inspection.'],
        ['Further inspection', 'Further inspection / diagnosis required.']
    ];

    function esc(value) {
        return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function injectStyles() {
        if (document.getElementById('rma-v260-styles')) return;
        const style = document.createElement('style');
        style.id = 'rma-v260-styles';
        style.textContent = `
            #${TAB_ID}{border-color:rgba(245,158,11,.22)}
            #${TAB_ID}.rma-active{color:#fbbf24;background:rgba(245,158,11,.08)}
            .rma-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
            .rma-field label{display:block;margin-bottom:6px;color:#9ca3af;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.1em}
            .rma-field input,.rma-field textarea{width:100%;border:1px solid #263244;background:#080d14;color:#f3f4f6;border-radius:10px;padding:11px 12px;outline:none;font-size:13px}
            .rma-field input:focus,.rma-field textarea:focus{border-color:#d97706;box-shadow:0 0 0 2px rgba(217,119,6,.12)}
            .rma-quick-grid{display:flex;flex-wrap:wrap;gap:7px;margin-top:10px}
            .rma-quick{border:1px solid #374151;background:#0b111a;color:#cbd5e1;border-radius:999px;padding:7px 10px;font-size:10px;font-weight:800;cursor:pointer;transition:.15s ease}
            .rma-quick:hover{border-color:#b45309;color:#fde68a}
            .rma-quick.selected{border-color:#d97706;background:rgba(217,119,6,.18);color:#fde68a}
            .rma-custom-row{display:flex;gap:8px;margin-top:10px}
            .rma-custom-row input{flex:1}
            .rma-custom-row button{white-space:nowrap}
            .rma-note{min-height:260px;line-height:1.65;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
            .rma-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
            .rma-separate-badge{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(245,158,11,.28);background:rgba(245,158,11,.07);color:#fbbf24;border-radius:999px;padding:5px 9px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}
            @media(max-width:720px){.rma-grid{grid-template-columns:1fr}.rma-custom-row{flex-direction:column}}
        `;
        document.head.appendChild(style);
    }

    function field(id) { return document.getElementById(id); }

    function readDraft() {
        try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {}; }
        catch (_) { return {}; }
    }

    function saveDraft() {
        const draft = {
            job: field('rma-job')?.value || '',
            brand: field('rma-brand')?.value || '',
            reference: field('rma-reference')?.value || '',
            serial: field('rma-serial')?.value || '',
            customer: field('rma-customer')?.value || '',
            previousJob: field('rma-previous-job')?.value || '',
            note: field('rma-note')?.value || ''
        };
        try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
    }

    function restoreDraft() {
        const d = readDraft();
        [['rma-job','job'],['rma-brand','brand'],['rma-reference','reference'],['rma-serial','serial'],['rma-customer','customer'],['rma-previous-job','previousJob'],['rma-note','note']].forEach(([id,key]) => {
            const el = field(id); if (el && d[key]) el.value = d[key];
        });
        syncQuickButtons();
    }

    function noteLines() {
        return String(field('rma-note')?.value || '').split(/\r?\n/);
    }

    function hasBullet(text) {
        const target = `• ${text}`.trim();
        return noteLines().some(line => line.trim() === target);
    }

    function syncQuickButtons() {
        document.querySelectorAll('.rma-quick').forEach(btn => {
            btn.classList.toggle('selected', hasBullet(btn.dataset.bullet || ''));
        });
    }

    function toggleBullet(text) {
        const note = field('rma-note');
        if (!note) return;
        const target = `• ${text}`;
        let lines = noteLines();
        const idx = lines.findIndex(line => line.trim() === target);
        if (idx >= 0) lines.splice(idx, 1);
        else {
            while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
            lines.push(target);
        }
        note.value = lines.join('\n').replace(/^\n+/, '');
        saveDraft();
        syncQuickButtons();
        note.focus();
    }

    function addCustomBullet() {
        const input = field('rma-custom-bullet');
        const text = String(input?.value || '').trim();
        if (!text) return;
        toggleBullet(text.replace(/^[-•]\s*/, ''));
        input.value = '';
        input.focus();
    }

    function buildCopyText() {
        const job = field('rma-job')?.value.trim();
        const brand = field('rma-brand')?.value.trim();
        const ref = field('rma-reference')?.value.trim();
        const serial = field('rma-serial')?.value.trim();
        const customer = field('rma-customer')?.value.trim();
        const previous = field('rma-previous-job')?.value.trim();
        const note = field('rma-note')?.value.trim();
        const header = ['RMA / RETURN JOB'];
        if (job) header.push(`Job: ${job}`);
        if (customer) header.push(`Customer / account: ${customer}`);
        if (brand) header.push(`Brand: ${brand}`);
        if (ref) header.push(`Reference: ${ref}`);
        if (serial) header.push(`Serial: ${serial}`);
        if (previous) header.push(`Previous job: ${previous}`);
        if (note) header.push('', note);
        return header.join('\n');
    }

    async function copyRmaNote() {
        const text = buildCopyText();
        try {
            await navigator.clipboard.writeText(text);
            if (typeof showToast === 'function') showToast('RMA NOTE COPIED');
        } catch (_) {
            const ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); } catch (_) {}
            ta.remove();
        }
    }

    function clearRma() {
        ['rma-job','rma-brand','rma-reference','rma-serial','rma-customer','rma-previous-job','rma-note','rma-custom-bullet'].forEach(id => { const el = field(id); if (el) el.value = ''; });
        try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
        syncQuickButtons();
        field('rma-job')?.focus();
    }

    function seedCurrentWatch() {
        const brand = (() => { try { return typeof getSelectedBrand === 'function' ? getSelectedBrand() : ''; } catch (_) { return ''; } })();
        const custom = String(localStorage.getItem('watch_auth_pro_custom_brand') || '').trim();
        const currentBrand = custom || (brand && brand !== 'Generic' ? brand : '');
        const ref = document.getElementById('caseRef')?.value || '';
        const serial = document.getElementById('serialInput')?.value || '';
        if (currentBrand) field('rma-brand').value = currentBrand;
        if (ref) field('rma-reference').value = ref;
        if (serial) field('rma-serial').value = serial;
        saveDraft();
    }

    function hideRma() {
        const panel = field(PANEL_ID); if (panel) panel.classList.add('hidden');
        field(TAB_ID)?.classList.remove('rma-active');
    }

    function openRma() {
        document.querySelectorAll('[id^="tab-"][id$="-content"]').forEach(el => el.classList.add('hidden'));
        field(PANEL_ID)?.classList.remove('hidden');
        document.querySelectorAll('#workflow-tabs > button').forEach(btn => btn.classList.remove('text-blue-500'));
        field(TAB_ID)?.classList.add('rma-active');
        document.getElementById('footer-actions')?.classList.add('hidden');
        document.getElementById('live-summary-card')?.classList.add('hidden');
        window.scrollTo({top:0, behavior:'smooth'});
    }

    function restoreNormalChrome() {
        document.getElementById('footer-actions')?.classList.remove('hidden');
        document.getElementById('live-summary-card')?.classList.remove('hidden');
    }

    function installTab() {
        const tabs = document.getElementById('workflow-tabs');
        if (!tabs || field(TAB_ID)) return;
        const btn = document.createElement('button');
        btn.id = TAB_ID;
        btn.type = 'button';
        btn.innerHTML = '<span class="step-number">R</span><span class="tab-symbol" aria-hidden="true">↩</span>RMA / Returns';
        btn.addEventListener('click', openRma);
        tabs.appendChild(btn);

        tabs.querySelectorAll('button:not(#'+TAB_ID+')').forEach(existing => {
            existing.addEventListener('click', () => { hideRma(); restoreNormalChrome(); });
        });
    }

    function installPanel() {
        if (field(PANEL_ID)) return;
        const primary = document.querySelector('.primary-column');
        if (!primary) return;
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.className = 'hidden';
        panel.innerHTML = `
          <section class="panel">
            <div class="panel-header">
              <div>
                <div class="panel-kicker">Separate return-job workspace</div>
                <div class="panel-title-line"><span class="panel-title-symbol" aria-hidden="true">↩</span><h1 class="panel-title">RMA / Returns</h1></div>
                <p class="panel-description">Build a concise return-job note without changing the normal authentication inspection.</p>
                <div style="margin-top:10px"><span class="rma-separate-badge">Independent from authentication record</span></div>
              </div>
            </div>
            <div class="panel-body">
              <div class="rma-grid">
                <div class="rma-field"><label for="rma-job">RMA / job number</label><input id="rma-job" placeholder="Enter RMA or job number"></div>
                <div class="rma-field"><label for="rma-customer">Customer / account</label><input id="rma-customer" placeholder="Optional"></div>
                <div class="rma-field"><label for="rma-brand">Brand</label><input id="rma-brand" placeholder="Brand"></div>
                <div class="rma-field"><label for="rma-reference">Reference</label><input id="rma-reference" placeholder="Case / model reference"></div>
                <div class="rma-field"><label for="rma-serial">Serial</label><input id="rma-serial" placeholder="Serial number"></div>
                <div class="rma-field"><label for="rma-previous-job">Previous job</label><input id="rma-previous-job" placeholder="If this is a return from previous work"></div>
              </div>

              <div class="section-divider strong-divider" style="margin:22px 0"></div>
              <div class="subsection-title section-title-blue"><span class="section-symbol" aria-hidden="true">•</span><span>Quick-add return points</span></div>
              <p class="brand-order-note">Press a point to add it to the RMA note. Press it again to remove it.</p>
              <div class="rma-quick-grid">
                ${QUICK_BULLETS.map(([label,bullet]) => `<button type="button" class="rma-quick" data-bullet="${esc(bullet)}">${esc(label)}</button>`).join('')}
              </div>
              <div class="rma-custom-row rma-field">
                <input id="rma-custom-bullet" placeholder="Add your own bullet point">
                <button type="button" class="action-secondary" id="rma-add-custom">Add bullet</button>
              </div>

              <div class="section-divider strong-divider" style="margin:22px 0"></div>
              <div class="rma-field">
                <label for="rma-note">RMA note</label>
                <textarea id="rma-note" class="rma-note" placeholder="Quick-add points will appear here. You can edit the wording freely."></textarea>
              </div>
              <div class="rma-actions">
                <button type="button" class="primary-action" id="rma-copy">Copy RMA note</button>
                <button type="button" class="action-secondary" id="rma-use-current">Use current watch details</button>
                <button type="button" class="action-danger" id="rma-clear">Clear RMA</button>
              </div>
            </div>
          </section>`;
        primary.appendChild(panel);

        panel.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', () => { saveDraft(); if (el.id === 'rma-note') syncQuickButtons(); }));
        panel.querySelectorAll('.rma-quick').forEach(btn => btn.addEventListener('click', () => toggleBullet(btn.dataset.bullet || '')));
        field('rma-add-custom').addEventListener('click', addCustomBullet);
        field('rma-custom-bullet').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addCustomBullet(); } });
        field('rma-copy').addEventListener('click', copyRmaNote);
        field('rma-use-current').addEventListener('click', seedCurrentWatch);
        field('rma-clear').addEventListener('click', clearRma);
        restoreDraft();
    }

    function initialise() {
        injectStyles(); installTab(); installPanel();
        const observer = new MutationObserver(() => { installTab(); installPanel(); });
        observer.observe(document.body, {childList:true, subtree:true});
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
    else initialise();
})();
