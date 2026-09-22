/* Watch Auth Pro v2.83.0 — verified Cartier production-date research batch 5
   Added 22 September 2026.
   Scope: four exact Cartier references with strong source-backed production periods.
*/
(function () {
  'use strict';

  function matches(rule, reference) {
    if (!rule) return false;
    const ref = String(reference || '').trim().toUpperCase();
    const base = String(rule.baseReference || '').trim().toUpperCase();
    if (base && base === ref) return true;
    if (Array.isArray(rule.refs) && rule.refs.some(x => String(x || '').trim().toUpperCase() === ref)) return true;
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(reference)) return true;
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(ref.replace(/\s+/g, ''))) return true;
    }
    return false;
  }

  function apply(reference, production, source, evidence) {
    if (!Array.isArray(CARTIER_REFERENCE_RULES)) return 0;
    let updated = 0;
    CARTIER_REFERENCE_RULES.forEach(rule => {
      if (!matches(rule, reference)) return;
      rule.production = production;
      rule.productionVerified = true;
      rule.productionSource = source;
      rule.productionEvidence = evidence;
      updated += 1;
    });
    if (updated < 1 && typeof console !== 'undefined' && console.warn) {
      console.warn('[Watch Auth Pro v2.83] No Cartier production-date match for', reference);
    }
    return updated;
  }

  apply(
    'WSSA0018',
    '2018–present',
    'Cartier official product page; Watches of Switzerland year/reference cross-check',
    'The modern steel Santos de Cartier Large generation launched in 2018; Cartier continues to list WSSA0018 as the current 39.8 mm steel large model.'
  );

  apply(
    'WSSA0037',
    '2020–present',
    'Cartier official product page; Watches by SJX 2020 launch coverage',
    'Cartier lists WSSA0037 and contemporary launch coverage documents the steel/ADLC Santos introduction in 2020 with boutique availability from September.'
  );

  apply(
    'WSSA0061',
    '2023–present',
    'Cartier official product page; Monochrome 2023 launch coverage',
    'Cartier currently lists WSSA0061; independent launch coverage documents the green medium Santos as a permanent-collection model available from June 2023.'
  );

  apply(
    'WSTA0051',
    '2021–present',
    'Cartier official Tank Must product page; Watches of Switzerland certified pre-owned year cross-check',
    'Cartier currently documents WSTA0051 as the small steel-bracelet Tank Must; authenticated 2021 examples align with the 2021 Tank Must launch generation.'
  );
})();