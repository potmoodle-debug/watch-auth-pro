/* Watch Auth Pro v2.79.0 — verified production-date research batch 1
   Added 22 September 2026.
   Scope: production periods only for five references with sufficiently strong evidence.
   Deliberately excludes unresolved/contested entries from the same research batch.
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

  function apply(target, reference, production, source, evidence) {
    if (!Array.isArray(target)) return 0;
    let updated = 0;
    target.forEach(rule => {
      if (!matches(rule, reference)) return;
      rule.production = production;
      rule.productionVerified = true;
      rule.productionSource = source;
      rule.productionEvidence = evidence;
      updated += 1;
    });
    if (updated !== 1 && typeof console !== 'undefined' && console.warn) {
      console.warn('[Watch Auth Pro v2.79] Production-date patch expected 1 match for', reference, 'but updated', updated);
    }
    return updated;
  }

  apply(
    BREITLING_REFERENCE_RULES,
    'A10370',
    '2020–present',
    'Breitling official product records; specialist Superocean Heritage model-history cross-check',
    'Superocean Heritage 57 42 mm A10370 family documented from 2020 and remains represented in Breitling product records.'
  );

  apply(
    BREITLING_REFERENCE_RULES,
    'A13320',
    '2008–2017',
    'Breitling specialist reference records; Superocean Heritage model-history cross-check',
    'A13320 Superocean Heritage Chronograph 46 documented from the first-generation Heritage period, 2008–2017.'
  );

  apply(
    OMEGA_REFERENCE_RULES,
    '145.022-69',
    '1969–1971',
    'Omega archive-backed auction records; Speedmaster specialist reference cross-check',
    'Reference 145.022-69 is documented across watches produced approximately 1969–1971; the -69 caseback suffix is not an exact production-year guarantee.'
  );

  apply(
    OTHER_REFERENCE_RULES,
    'CAZ101AD.FT8024',
    '2020 limited edition (1,500 pieces)',
    'TAG Heuer official collector guide and official product record',
    'TAG Heuer identifies CAZ101AD.FT8024 as the 2020 Indy 500 Formula 1 special edition, limited to 1,500 pieces.'
  );

  apply(
    TUDOR_REFERENCE_RULES,
    '79090',
    '1989–1995',
    'Phillips reference history; Tudor Submariner specialist serial/reference cross-check',
    'Tudor Prince Oysterdate Submariner ref. 79090 documented as introduced in 1989 and remaining in production until 1995.'
  );
})();