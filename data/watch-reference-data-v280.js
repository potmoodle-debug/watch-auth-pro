/* Watch Auth Pro v2.80.0 — verified production-date research batch 2
   Added 22 September 2026.
   Scope: four Breitling exact/base-reference production periods.
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
    if (!Array.isArray(BREITLING_REFERENCE_RULES)) return 0;
    let updated = 0;
    BREITLING_REFERENCE_RULES.forEach(rule => {
      if (!matches(rule, reference)) return;
      rule.production = production;
      rule.productionVerified = true;
      rule.productionSource = source;
      rule.productionEvidence = evidence;
      updated += 1;
    });
    if (updated !== 1 && typeof console !== 'undefined' && console.warn) {
      console.warn('[Watch Auth Pro v2.80] Production-date patch expected 1 match for', reference, 'but updated', updated);
    }
    return updated;
  }

  apply(
    'AB0118',
    '2018–present',
    'Breitling official product records; Hodinkee 2018 Premier launch coverage',
    'The modern Premier B01 Chronograph 42 family was launched in October 2018 and remains represented in Breitling product records.'
  );

  apply(
    'AB2010',
    '2017–2025',
    'Breitling official product records; Superocean Heritage model-history cross-check',
    'The Superocean Heritage II B20 Automatic 42 generation launched in 2017 and was replaced by the B31 generation in the 2025 relaunch.'
  );

  apply(
    'AB2030',
    '2018–2025',
    'Breitling official product records; Superocean Heritage model-history cross-check',
    'The 44 mm B20 Heritage II generation is documented from 2018 and was superseded in the 2025 Superocean Heritage relaunch.'
  );

  apply(
    'X83310',
    '2024–present',
    'Breitling official product records and official 2024 launch material',
    'Breitling launched the 38 mm Endurance Pro in July 2024; the X83310 family remains in the current catalogue.'
  );
})();