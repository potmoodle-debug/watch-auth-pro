/* Watch Auth Pro — research queue recognition fix
   Prevents already-researched exact references being incorrectly sent to the research queue
   because generic guidance elsewhere on screen contains phrases such as "requires confirmation".
*/
(function () {
  'use strict';

  function selectedBrand() {
    try {
      if (typeof getSelectedBrand === 'function') return getSelectedBrand();
    } catch (_) {}
    return document.querySelector('.brand-checkbox:checked')?.value || 'Generic';
  }

  function value(id) {
    return String(document.getElementById(id)?.value || '').trim();
  }

  function visibleTextNeedsResearch() {
    const ids = ['caseResult', 'drawer-live-decoding', 'context-guidance', 'movementMatchResult'];
    const text = ids.map(id => {
      const el = document.getElementById(id);
      if (!el || el.classList.contains('hidden')) return '';
      return el.textContent || '';
    }).join(' ').replace(/\s+/g, ' ').trim();

    return /requires (?:manual review|research)|reference (?:manual review|requires research)|no exact (?:embedded )?(?:model\/calibre )?mapping|no database (?:search|match)|no exact match|no match|not recognised|not recognized|incomplete reference|manual confirmation|manual review required|exact model unresolved|exact reference required|collection-level|family guidance only|not safely assignable/i.test(text);
  }

  function ruleNeedsResearch(rule) {
    if (!rule) return true;
    if (rule.manualReview || rule.collectionOnly || rule.familyOnly) return true;
    return /manual review|manual confirmation|incomplete|unresolved|collection-level|family guidance only|exact reference required|not safely assignable/i.test(
      [rule.confidence, rule.notes, rule.production, rule.family].filter(Boolean).join(' ')
    );
  }

  function resolveRule(brand, ref) {
    if (!ref) return null;
    try {
      if (window.WAPReferenceLookup?.resolve) return window.WAPReferenceLookup.resolve(brand, ref)?.rule || null;
      if (brand === 'Omega' && typeof lookupOmegaReference === 'function') return lookupOmegaReference(ref)?.rule || null;
      if (brand === 'Breitling' && typeof lookupBreitlingReference === 'function') return lookupBreitlingReference(ref)?.rule || null;
      if (brand === 'Cartier' && typeof lookupCartierReference === 'function') return lookupCartierReference(ref)?.rule || null;
      if (brand === 'Tudor' && typeof lookupTudorReference === 'function') return lookupTudorReference(ref)?.rule || null;
      if (typeof lookupOtherReference === 'function') return lookupOtherReference(brand, ref) || null;
    } catch (_) {}
    return null;
  }

  function isRecognised(brand, ref) {
    if (!ref) return false;
    try {
      if (window.WAPReferenceLookup?.isRecognised) return !!window.WAPReferenceLookup.isRecognised(brand, ref);
      if (typeof referenceIsRecognisedForBrand === 'function') return !!referenceIsRecognisedForBrand(brand, ref);
    } catch (_) {}
    const rule = resolveRule(brand, ref);
    return !!(rule && !ruleNeedsResearch(rule));
  }

  function update() {
    const actions = document.getElementById('manual-review-queue-actions');
    if (!actions) return false;

    const brand = selectedBrand();
    const caseRef = value('caseRef');
    const fullRef = value('fullRef');
    const refs = [fullRef, caseRef].filter(Boolean);

    if (!refs.length) {
      actions.classList.add('hidden');
      actions.dataset.manualReview = 'false';
      return false;
    }

    // Rolex retains its dedicated legacy logic.
    if (brand === 'Rolex' && typeof window.__wapOriginalManualReviewActions === 'function') {
      let unresolved = false;
      try { unresolved = !!window.__wapOriginalManualReviewActions(); } catch (_) {}
      actions.classList.toggle('hidden', !unresolved);
      actions.dataset.manualReview = unresolved ? 'true' : 'false';
      return unresolved;
    }

    // Most important rule: if any entered reference is already an exact researched
    // database match, generic explanatory wording elsewhere must NOT reopen research.
    if (refs.some(ref => isRecognised(brand, ref))) {
      actions.classList.add('hidden');
      actions.dataset.manualReview = 'false';
      return false;
    }

    const rules = refs.map(ref => resolveRule(brand, ref)).filter(Boolean);
    const unresolved = rules.length
      ? rules.some(ruleNeedsResearch)
      : visibleTextNeedsResearch() || refs.length > 0;

    actions.classList.toggle('hidden', !unresolved);
    actions.dataset.manualReview = unresolved ? 'true' : 'false';
    return unresolved;
  }

  function install() {
    updateManualReviewQueueActions = update;
    window.WAPResearchQueueRefresh = update;

    ['caseRef', 'fullRef', 'movementCalibre'].forEach(id =>
      document.getElementById(id)?.addEventListener('input', () => queueMicrotask(update))
    );
    document.querySelectorAll('.brand-checkbox').forEach(el =>
      el.addEventListener('change', () => queueMicrotask(update))
    );

    const watched = ['caseResult', 'drawer-live-decoding', 'context-guidance', 'movementMatchResult']
      .map(id => document.getElementById(id)).filter(Boolean);

    if (watched.length && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver(() => queueMicrotask(update));
      watched.forEach(node => observer.observe(node, {
        childList: true, subtree: true, characterData: true,
        attributes: true, attributeFilter: ['class']
      }));
      window.__wapResearchQueueRecognitionObserver = observer;
    }

    queueMicrotask(update);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();