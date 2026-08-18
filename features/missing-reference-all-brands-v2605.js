/* Watch Auth Pro v2.60.5 — missing-reference research actions across all brands */
(function () {
  function selectedBrand() {
    try {
      if (typeof getSelectedBrand === 'function') return getSelectedBrand();
    } catch (_) {}
    return document.querySelector('.brand-checkbox:checked')?.value || 'Generic';
  }

  function safeRuleFromLookup(brand, reference) {
    try {
      if (brand === 'Omega' && typeof lookupOmegaReference === 'function') return lookupOmegaReference(reference)?.rule || null;
      if (brand === 'Breitling' && typeof lookupBreitlingReference === 'function') return lookupBreitlingReference(reference)?.rule || null;
      if (brand === 'Cartier' && typeof lookupCartierReference === 'function') return lookupCartierReference(reference)?.rule || null;
      if (brand === 'Tudor' && typeof lookupTudorReference === 'function') return lookupTudorReference(reference)?.rule || null;
      if (typeof lookupOtherReference === 'function') return lookupOtherReference(brand, reference) || null;
    } catch (_) {}
    return null;
  }

  function ruleNeedsResearch(rule) {
    if (!rule) return true;
    return Boolean(
      rule.manualReview ||
      rule.collectionOnly ||
      /manual review|manual confirmation|requires confirmation|incomplete|unresolved|collection-level|family guidance only|exact reference required|reference-dependent|not safely assignable/i.test(
        [rule.confidence, rule.notes, rule.production, rule.family].filter(Boolean).join(' ')
      )
    );
  }

  function visibleTextNeedsResearch() {
    const ids = ['caseResult', 'drawer-live-decoding', 'context-guidance', 'movementMatchResult'];
    const text = ids.map(id => {
      const el = document.getElementById(id);
      if (!el || el.classList.contains('hidden')) return '';
      return el.textContent || '';
    }).join(' ').replace(/\s+/g, ' ').trim();
    return /requires (?:manual review|research)|reference (?:manual review|requires research)|no exact (?:embedded )?(?:model\/calibre )?mapping|no database (?:search|match)|no exact match|no match|not recognised|not recognized|incomplete reference|manual confirmation|manual review required|exact model unresolved|exact reference required|collection-level|family guidance only|not safely assignable|requires confirmation/i.test(text);
  }

  function ensureResearchActions() {
    const actions = document.getElementById('manual-review-queue-actions');
    const reference = (document.getElementById('caseRef')?.value || '').trim();
    if (!actions) return false;

    let unresolved = false;
    if (reference) {
      const brand = selectedBrand();
      const rule = safeRuleFromLookup(brand, reference);
      unresolved = visibleTextNeedsResearch() || ruleNeedsResearch(rule);

      // Rolex has separate model/serial decoding. Do not force every Rolex reference into
      // research if the existing Rolex logic has already resolved it.
      if (brand === 'Rolex' && typeof window.__wapOriginalManualReviewActions === 'function') {
        try {
          unresolved = window.__wapOriginalManualReviewActions() || visibleTextNeedsResearch();
        } catch (_) {}
      }
    }

    actions.classList.toggle('hidden', !unresolved);
    actions.dataset.manualReview = unresolved ? 'true' : 'false';
    return unresolved;
  }

  function install() {
    if (typeof DATABASE_META === 'object' && DATABASE_META) {
      DATABASE_META.version = '2.60.5';
      DATABASE_META.updated = '18 August 2026';
      DATABASE_META.scope = 'Missing-reference/further-research actions made consistent across all brands';
    }

    if (typeof updateManualReviewQueueActions === 'function') {
      if (!window.__wapOriginalManualReviewActions) window.__wapOriginalManualReviewActions = updateManualReviewQueueActions;
      updateManualReviewQueueActions = ensureResearchActions;
    }

    const watched = [
      document.getElementById('caseResult'),
      document.getElementById('drawer-live-decoding'),
      document.getElementById('context-guidance'),
      document.getElementById('movementMatchResult')
    ].filter(Boolean);

    if (!window.__wapMissingResearchObserver && watched.length) {
      const observer = new MutationObserver(() => queueMicrotask(ensureResearchActions));
      watched.forEach(node => observer.observe(node, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class'] }));
      window.__wapMissingResearchObserver = observer;
    }

    document.getElementById('caseRef')?.addEventListener('input', () => queueMicrotask(ensureResearchActions));
    document.querySelectorAll('.brand-checkbox').forEach(input => input.addEventListener('change', () => queueMicrotask(ensureResearchActions)));
    queueMicrotask(ensureResearchActions);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
