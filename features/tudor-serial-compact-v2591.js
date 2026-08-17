/* Watch Auth Pro — compact Tudor serial guidance
   Version 2.59.1 — 17 August 2026
   Replaces the verbose Tudor serial result card with a short, useful summary.
*/

(() => {
    const RESULT_ID = 'serialResult';

    function selectedBrand() {
        const checked = document.querySelector('.brand-checkbox:checked, input[name="brand"]:checked');
        return checked ? checked.value : '';
    }

    function serialValue() {
        return String(document.getElementById('serialInput')?.value || '').trim();
    }

    function esc(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function compactTudorSerial() {
        if (selectedBrand() !== 'Tudor') return;
        const box = document.getElementById(RESULT_ID);
        const serial = serialValue();
        if (!box || !serial || typeof estimateTudorSerial !== 'function') return;

        let assessment = null;
        try { assessment = estimateTudorSerial(serial); } catch (_) { return; }
        if (!assessment) return;

        const signature = `${serial}|${assessment.estimate || ''}|${assessment.format || ''}|${assessment.note || ''}`;
        if (box.dataset.tudorCompactSignature === signature) return;

        const bullets = [];
        if (assessment.estimate) bullets.push(`<li><strong>Approx. date:</strong> ${esc(assessment.estimate)}</li>`);
        if (assessment.format) bullets.push(`<li><strong>Serial type:</strong> ${esc(assessment.format)}</li>`);

        if (assessment.unmapped) {
            bullets.push('<li><strong>Result:</strong> No dependable date from the embedded Tudor serial table.</li>');
        } else if (assessment.ambiguous) {
            bullets.push('<li><strong>Caution:</strong> Serial falls in an overlapping/reset range; confirm against reference and movement.</li>');
        } else if (assessment.malformed) {
            bullets.push('<li><strong>Caution:</strong> Serial format needs manual verification.</li>');
        } else {
            bullets.push('<li><strong>Use as:</strong> Approximate dating support only; confirm against case reference and calibre.</li>');
        }

        box.className = 'mt-3 p-3.5 rounded-lg border text-xs leading-relaxed bg-blue-950/35 border-blue-500/40 text-blue-200';
        box.innerHTML = `
            <div class="font-bold mb-1 text-[11px] uppercase tracking-wider">Tudor serial</div>
            <ul class="guidance-bullets">${bullets.join('')}</ul>
            <div class="guidance-provenance">Tudor does not publish a complete official serial chronology; dates are approximate benchmarks.</div>`;
        box.dataset.tudorCompactSignature = signature;
    }

    function initialise() {
        const box = document.getElementById(RESULT_ID);
        if (!box) return;

        let pending = false;
        const observer = new MutationObserver(() => {
            if (pending) return;
            pending = true;
            queueMicrotask(() => {
                pending = false;
                compactTudorSerial();
            });
        });
        observer.observe(box, { childList: true, subtree: true, characterData: true });

        document.getElementById('serialInput')?.addEventListener('input', () => setTimeout(compactTudorSerial, 0));
        document.getElementById('brandGrid')?.addEventListener('change', () => setTimeout(compactTudorSerial, 0));
        compactTudorSerial();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
    else initialise();
})();
