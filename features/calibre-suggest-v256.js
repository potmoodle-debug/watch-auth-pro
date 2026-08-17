/* Watch Auth Pro — reference-based calibre suggestion
   Version 2.56.0 — 17 August 2026
   Adds a helper button beside the observed calibre field.
   It never guesses when the reference maps to multiple plausible calibres.
*/

if (typeof DATABASE_META !== 'undefined') {
    DATABASE_META.version = '2.56.0';
    DATABASE_META.updated = '17 August 2026';
    DATABASE_META.scope = 'Reference-based calibre suggestion helper added to the inspection workflow; existing v2.55.0 researched reference data retained.';
}

(() => {
    const BUTTON_ID = 'suggest-calibre-from-reference';
    const MENU_ID = 'suggest-calibre-menu';

    function currentBrand() {
        try {
            if (typeof getSelectedBrand === 'function') return getSelectedBrand() || '';
        } catch (_) {}
        const checked = document.querySelector('.brand-checkbox:checked, input[name="brand"]:checked');
        return checked ? checked.value : '';
    }

    function currentReference() {
        const input = document.getElementById('caseRef') || document.querySelector('input[name="caseRef"]');
        return input ? String(input.value || '').trim() : '';
    }

    function calibreInput() {
        return document.getElementById('movementCalibre') ||
            document.querySelector('input[name="movementCalibre"]') ||
            document.querySelector('input[placeholder*="calibre" i]');
    }

    function normaliseRef(value) {
        return String(value || '').toUpperCase().trim();
    }

    function resetRegex(regex) {
        if (regex instanceof RegExp) regex.lastIndex = 0;
        return regex;
    }

    function ruleMatches(rule, ref) {
        const raw = normaliseRef(ref);
        const compact = raw.replace(/[^A-Z0-9]/g, '');

        if (Array.isArray(rule.refs)) {
            return rule.refs.some(candidate => normaliseRef(candidate).replace(/[^A-Z0-9]/g, '') === compact);
        }
        if (rule.pattern instanceof RegExp) {
            const pattern = resetRegex(rule.pattern);
            return pattern.test(raw) || (resetRegex(pattern), pattern.test(compact));
        }
        if (rule.baseReference) {
            return normaliseRef(rule.baseReference).replace(/[^A-Z0-9]/g, '') === compact;
        }
        return false;
    }

    function findReferenceRule(brand, ref) {
        if (!brand || !ref) return null;
        const sets = [];
        try {
            if (brand === 'Rolex' && typeof ROLEX_MOVEMENT_RULES !== 'undefined') sets.push(ROLEX_MOVEMENT_RULES);
            if (brand === 'Tudor' && typeof TUDOR_REFERENCE_RULES !== 'undefined') sets.push(TUDOR_REFERENCE_RULES);
            if (brand === 'Omega' && typeof OMEGA_REFERENCE_RULES !== 'undefined') sets.push(OMEGA_REFERENCE_RULES);
            if (brand === 'Breitling' && typeof BREITLING_REFERENCE_RULES !== 'undefined') sets.push(BREITLING_REFERENCE_RULES);
            if (brand === 'Cartier' && typeof CARTIER_REFERENCE_RULES !== 'undefined') sets.push(CARTIER_REFERENCE_RULES);
            if (typeof OTHER_REFERENCE_RULES !== 'undefined') sets.push(OTHER_REFERENCE_RULES.filter(rule => rule.brand === brand));
        } catch (_) {}

        for (const set of sets) {
            const rule = set.find(candidate => ruleMatches(candidate, ref));
            if (rule) return rule;
        }
        return null;
    }

    function canonicalCalibre(value) {
        return String(value || '')
            .toUpperCase()
            .replace(/^CAL(?:IBRE)?\.?\s*/i, '')
            .replace(/^C\.?\s*/i, '')
            .replace(/\s+/g, '')
            .trim();
    }

    function distinctCalibres(rule) {
        if (!rule) return [];
        const raw = Array.isArray(rule.calibre) ? rule.calibre : (rule.calibre ? [rule.calibre] : []);
        const seen = new Set();
        const choices = [];
        for (const item of raw) {
            const canonical = canonicalCalibre(item);
            if (!canonical || seen.has(canonical)) continue;
            seen.add(canonical);
            choices.push({ value: canonical, original: String(item) });
        }
        return choices;
    }

    function notify(message) {
        try {
            if (typeof showToast === 'function') {
                showToast(message.toUpperCase());
                return;
            }
        } catch (_) {}
        const button = document.getElementById(BUTTON_ID);
        if (!button) return;
        const previous = button.textContent;
        button.textContent = message;
        setTimeout(() => { button.textContent = previous; }, 1800);
    }

    function closeMenu() {
        document.getElementById(MENU_ID)?.remove();
    }

    function applyCalibre(value) {
        const input = calibreInput();
        if (!input) return;
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.focus();
        closeMenu();
        notify(`Calibre ${value} selected`);
    }

    function showChoices(button, rule, choices) {
        closeMenu();
        const menu = document.createElement('div');
        menu.id = MENU_ID;
        menu.style.cssText = [
            'margin-top:8px','padding:10px','border:1px solid rgba(79,140,255,.35)',
            'border-radius:10px','background:#0b111a','box-shadow:0 16px 40px rgba(0,0,0,.38)',
            'font-size:11px','line-height:1.45','color:#cbd5e1'
        ].join(';');

        const title = document.createElement('div');
        title.style.cssText = 'font-weight:800;color:#fff;margin-bottom:7px';
        title.textContent = rule?.model || rule?.family || rule?.section || 'Reference calibre options';
        menu.appendChild(title);

        if (rule?.manualReview) {
            const warning = document.createElement('div');
            warning.style.cssText = 'color:#f5c76b;margin-bottom:8px';
            warning.textContent = 'Manual-review reference: choose only after confirming the movement physically.';
            menu.appendChild(warning);
        }

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px';
        choices.forEach(choice => {
            const option = document.createElement('button');
            option.type = 'button';
            option.textContent = choice.value;
            option.style.cssText = 'padding:7px 10px;border:1px solid #3b82f6;border-radius:8px;background:#10213c;color:#dbeafe;font-weight:800;cursor:pointer';
            option.addEventListener('click', () => applyCalibre(choice.value));
            row.appendChild(option);
        });
        menu.appendChild(row);
        button.parentElement?.appendChild(menu);
    }

    function suggestCalibre() {
        const brand = currentBrand();
        const ref = currentReference();
        if (!brand) return notify('Select a brand first');
        if (!ref) return notify('Enter case reference first');

        const rule = findReferenceRule(brand, ref);
        if (!rule) return notify('No calibre mapping for this reference');

        const choices = distinctCalibres(rule);
        if (!choices.length) return notify('No calibre recorded for this reference');

        if (choices.length === 1 && !rule.manualReview) {
            applyCalibre(choices[0].value);
            return;
        }
        showChoices(document.getElementById(BUTTON_ID), rule, choices);
    }

    function installButton() {
        if (document.getElementById(BUTTON_ID)) return;
        const input = calibreInput();
        if (!input) return;

        const button = document.createElement('button');
        button.id = BUTTON_ID;
        button.type = 'button';
        button.textContent = 'Suggest calibre from reference';
        button.title = 'Use the entered case reference to suggest the expected movement calibre';
        button.style.cssText = [
            'margin-top:8px','width:100%','padding:9px 11px','border:1px solid rgba(79,140,255,.45)',
            'border-radius:9px','background:rgba(30,64,175,.18)','color:#bfdbfe','font-size:10px',
            'font-weight:900','letter-spacing:.045em','text-transform:uppercase','cursor:pointer'
        ].join(';');
        button.addEventListener('click', suggestCalibre);

        const host = input.closest('.field-group, .input-group, .form-field, .movement-field') || input.parentElement;
        (host || input.parentElement)?.appendChild(button);
    }

    function initialise() {
        installButton();
        const observer = new MutationObserver(() => installButton());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
})();
