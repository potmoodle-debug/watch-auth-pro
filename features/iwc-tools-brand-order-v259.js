/* Watch Auth Pro — IWC official tool + safer brand-order reset
   Version 2.59.0 — 17 August 2026
*/

if (typeof DATABASE_META !== 'undefined') {
    DATABASE_META.version = '2.59.0';
    DATABASE_META.updated = '17 August 2026';
    DATABASE_META.scope = 'Adds My IWC registration access and moves Reset order into a collapsed brand-order settings control to prevent accidental presses.';
}

(() => {
    const IWC_TOOLS_ID = 'iwc-official-tools';
    const SETTINGS_ID = 'brand-order-settings-v259';

    function selectedBrand() {
        try {
            if (typeof getSelectedBrand === 'function') return getSelectedBrand() || '';
        } catch (_) {}
        const checked = document.querySelector('.brand-checkbox:checked, input[name="brand"]:checked');
        return checked ? String(checked.value || '') : '';
    }

    function installIwcTools() {
        if (document.getElementById(IWC_TOOLS_ID)) return;

        const panerai = document.getElementById('panerai-official-tools');
        const jlc = document.getElementById('jlc-official-tools');
        const cartier = document.getElementById('cartier-official-tools');
        const anchor = panerai || jlc || cartier;
        if (!anchor || !anchor.parentElement) return;

        const panel = document.createElement('div');
        panel.id = IWC_TOOLS_ID;
        panel.className = 'official-brand-tools hidden';
        panel.innerHTML = `
            <div class="official-brand-tools-copy">
                <strong>IWC watch registration</strong>
                <span>Open My IWC to register or check a watch using the case reference and serial details.</span>
            </div>
            <a class="official-link-button" href="https://myiwc.iwc.com/en/register/manual" target="_blank" rel="noopener noreferrer">Open My IWC <span aria-hidden="true">↗</span></a>
        `;
        anchor.insertAdjacentElement('afterend', panel);
    }

    function updateIwcVisibility() {
        const panel = document.getElementById(IWC_TOOLS_ID);
        if (!panel) return;
        const isIwc = selectedBrand().trim().toUpperCase() === 'IWC';
        panel.classList.toggle('hidden', !isIwc);
    }

    function moveResetOrderButton() {
        if (document.getElementById(SETTINGS_ID)) return;

        const button = document.querySelector('button[onclick="resetBrandUsageOrder()"]');
        if (!button) return;

        const toolbar = button.closest('.brand-selector-toolbar');
        const note = document.querySelector('.brand-order-note');
        const host = note?.parentElement || toolbar?.parentElement;
        if (!host) return;

        const details = document.createElement('details');
        details.id = SETTINGS_ID;
        details.className = 'advanced-only';
        details.style.cssText = 'margin-top:10px;border:1px solid rgba(75,85,99,.45);border-radius:10px;background:rgba(3,7,18,.24);';

        const summary = document.createElement('summary');
        summary.textContent = 'Brand order settings';
        summary.style.cssText = 'cursor:pointer;padding:9px 11px;color:#6b7280;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;user-select:none;';

        const body = document.createElement('div');
        body.style.cssText = 'padding:0 11px 11px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;';

        const copy = document.createElement('span');
        copy.textContent = 'Resetting removes the learned most-used brand order.';
        copy.style.cssText = 'font-size:10px;color:#6b7280;line-height:1.4;';

        button.classList.remove('brand-search-clear');
        button.classList.add('action-danger');
        button.textContent = 'Reset learned brand order';
        button.title = 'Reset the learned most-used brand ordering';

        body.append(copy, button);
        details.append(summary, body);

        if (note) note.insertAdjacentElement('afterend', details);
        else host.appendChild(details);
    }

    function refresh() {
        installIwcTools();
        moveResetOrderButton();
        updateIwcVisibility();
    }

    function initialise() {
        refresh();

        document.addEventListener('change', event => {
            if (event.target?.matches?.('.brand-checkbox, input[name="brand"]')) {
                setTimeout(updateIwcVisibility, 0);
            }
        });
        document.addEventListener('click', event => {
            if (event.target?.closest?.('.brand-card')) {
                setTimeout(updateIwcVisibility, 0);
            }
        });

        const observer = new MutationObserver(refresh);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
})();
