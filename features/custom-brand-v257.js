/* Watch Auth Pro — custom / obscure brand entry
   Version 2.57.0 — 17 August 2026
   Adds a free-text brand field while retaining the existing Other / Generic option.
*/

if (typeof DATABASE_META !== 'undefined') {
    DATABASE_META.version = '2.57.0';
    DATABASE_META.updated = '17 August 2026';
    DATABASE_META.scope = 'Custom brand entry added to the main brand selector; existing v2.56.0 calibre suggestion and v2.55.0 researched reference data retained.';
}

(() => {
    const FIELD_ID = 'customBrandInput';
    const WRAP_ID = 'custom-brand-wrap';
    const STORAGE_KEY = 'watchAuthProCustomBrand';
    let originalGetSelectedBrand = null;

    function genericCheckbox() {
        return Array.from(document.querySelectorAll('.brand-checkbox')).find(input => input.dataset.baseBrand === 'Generic' || input.value === 'Generic');
    }

    function customValue() {
        return String(document.getElementById(FIELD_ID)?.value || '').trim();
    }

    function ensureGenericAliases(name) {
        if (!name) return;
        try {
            if (typeof BRAND_PROFILES !== 'undefined' && BRAND_PROFILES.Generic && !BRAND_PROFILES[name]) {
                BRAND_PROFILES[name] = { ...BRAND_PROFILES.Generic,
                    drawerTitle: `${name} Reference`,
                    drawerSubtitle: 'Custom brand — general watch guidance',
                    summary: `${name} is being recorded as a custom brand. General inspection guidance is available, but no dedicated brand database is embedded yet.`
                };
            }
            if (typeof brandFlags !== 'undefined' && brandFlags.Generic && !brandFlags[name]) {
                brandFlags[name] = { ...brandFlags.Generic };
            }
        } catch (_) {}
    }

    function restoreGenericValue() {
        const generic = genericCheckbox();
        if (!generic) return;
        generic.value = 'Generic';
        generic.dataset.baseBrand = 'Generic';
        const label = generic.closest('.brand-card')?.querySelector('span');
        if (label) label.textContent = 'Other';
    }

    function chooseCustomBrand() {
        const name = customValue();
        const generic = genericCheckbox();
        if (!generic) return;

        if (!name) {
            restoreGenericValue();
            try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
            return;
        }

        ensureGenericAliases(name);
        generic.dataset.baseBrand = 'Generic';
        generic.value = name;

        document.querySelectorAll('.brand-checkbox').forEach(input => {
            input.checked = input === generic;
        });

        const label = generic.closest('.brand-card')?.querySelector('span');
        if (label) label.textContent = `Other · ${name}`;

        try { localStorage.setItem(STORAGE_KEY, name); } catch (_) {}

        try {
            if (typeof selectBrand === 'function') selectBrand(generic);
        } catch (_) {
            generic.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    function installGetSelectedBrandPatch() {
        if (typeof window.getSelectedBrand !== 'function' || window.getSelectedBrand.__customBrandPatched) return;
        originalGetSelectedBrand = window.getSelectedBrand;
        const patched = function() {
            const name = customValue();
            if (name) return name;
            return originalGetSelectedBrand.apply(this, arguments);
        };
        patched.__customBrandPatched = true;
        window.getSelectedBrand = patched;
    }

    function clearCustomWhenKnownBrandSelected(event) {
        const input = event.target;
        if (!input?.classList?.contains('brand-checkbox') || !input.checked) return;
        if (input.dataset.baseBrand === 'Generic' || input.value === 'Generic' || input === genericCheckbox()) return;
        const field = document.getElementById(FIELD_ID);
        if (field?.value) field.value = '';
        try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
        restoreGenericValue();
    }

    function installField() {
        if (document.getElementById(WRAP_ID)) return;
        const grid = document.getElementById('brandGrid');
        if (!grid) return;

        const generic = genericCheckbox();
        if (generic && !generic.dataset.baseBrand) generic.dataset.baseBrand = 'Generic';

        const wrap = document.createElement('div');
        wrap.id = WRAP_ID;
        wrap.style.cssText = [
            'margin-top:12px','padding:12px','border:1px solid rgba(79,140,255,.22)',
            'border-radius:12px','background:rgba(15,23,42,.42)'
        ].join(';');

        const label = document.createElement('label');
        label.htmlFor = FIELD_ID;
        label.style.cssText = 'display:block;color:#d7e3f4;font-size:10px;font-weight:900;letter-spacing:.055em;text-transform:uppercase;margin-bottom:5px';
        label.textContent = 'Brand not listed?';

        const hint = document.createElement('div');
        hint.style.cssText = 'color:#7f8da1;font-size:9px;line-height:1.4;margin-bottom:8px';
        hint.textContent = 'Type an obscure manufacturer here instead of using Other. It will be saved with this inspection and can be researched for a future database update.';

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:8px;align-items:stretch';

        const field = document.createElement('input');
        field.id = FIELD_ID;
        field.type = 'text';
        field.placeholder = 'e.g. Alain Silberstein, Yema, Nivada Grenchen';
        field.autocomplete = 'off';
        field.setAttribute('aria-label', 'Custom or obscure watch brand');
        field.style.cssText = [
            'flex:1','min-width:0','padding:10px 11px','border:1px solid #334155','border-radius:9px',
            'background:#080d14','color:#e7edf5','font-size:12px','outline:none'
        ].join(';');

        const useButton = document.createElement('button');
        useButton.type = 'button';
        useButton.textContent = 'Use brand';
        useButton.style.cssText = [
            'padding:9px 12px','border:1px solid rgba(79,140,255,.45)','border-radius:9px',
            'background:rgba(30,64,175,.18)','color:#bfdbfe','font-size:10px','font-weight:900',
            'letter-spacing:.045em','text-transform:uppercase','cursor:pointer','white-space:nowrap'
        ].join(';');
        useButton.addEventListener('click', chooseCustomBrand);

        field.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                chooseCustomBrand();
            }
        });
        field.addEventListener('input', () => {
            const status = document.getElementById('custom-brand-status');
            if (status) status.textContent = field.value.trim() ? 'Press Use brand or Enter to select.' : 'Other remains selected when this field is blank.';
        });

        const status = document.createElement('div');
        status.id = 'custom-brand-status';
        status.style.cssText = 'margin-top:7px;color:#718096;font-size:9px;line-height:1.35';
        status.textContent = 'Other remains selected when this field is blank.';

        row.append(field, useButton);
        wrap.append(label, hint, row, status);
        grid.insertAdjacentElement('afterend', wrap);

        let stored = '';
        try { stored = localStorage.getItem(STORAGE_KEY) || ''; } catch (_) {}
        if (stored) field.value = stored;
    }

    function initialise() {
        installField();
        installGetSelectedBrandPatch();
        document.addEventListener('change', clearCustomWhenKnownBrandSelected);

        const observer = new MutationObserver(() => {
            installField();
            installGetSelectedBrandPatch();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
})();
