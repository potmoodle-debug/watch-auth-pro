/* Watch Auth Pro v2.81.0 — verified Omega production-date research batch 3
   Added 22 September 2026.
   Scope: production periods for four Omega references with strong, cross-checked evidence.
   Ambiguous 2531.80 and 3539.50.00 end dates are intentionally excluded.
*/
(function () {
  'use strict';

  function matches(rule, reference) {
    if (!rule) return false;
    const raw = String(reference || '').trim();
    const compact = raw.toUpperCase().replace(/\s+/g, '');
    const base = String(rule.baseReference || '').trim().toUpperCase();
    if (base && base === compact) return true;
    if (Array.isArray(rule.refs) && rule.refs.some(x => String(x || '').trim().toUpperCase() === compact)) return true;
    if (rule.pattern instanceof RegExp) {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(raw)) return true;
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(compact)) return true;
    }
    return false;
  }

  function apply(reference, production, source, evidence) {
    if (!Array.isArray(OMEGA_REFERENCE_RULES)) return 0;
    let updated = 0;
    OMEGA_REFERENCE_RULES.forEach(rule => {
      if (!matches(rule, reference)) return;
      rule.production = production;
      rule.productionVerified = true;
      rule.productionSource = source;
      rule.productionEvidence = evidence;
      updated += 1;
    });
    if (updated < 1 && typeof console !== 'undefined' && console.warn) {
      console.warn('[Watch Auth Pro v2.81] No Omega rule matched', reference);
    }
    return updated;
  }

  apply(
    '2254.50',
    '2000–2008',
    'Fratello Seamaster 300M historical reference guide',
    'Fratello documents the black sword-hands Seamaster Diver 300M ref. 2254.50 as produced from 2000 to 2008.'
  );

  apply(
    '3510.50',
    '1988–2010',
    'Fratello Speedmaster Reduced historical reference guides',
    'Recent Fratello reference histories consistently place the original Speedmaster Reduced ref. 3510.50 in production from 1988 to around 2010.'
  );

  apply(
    '3570.50',
    '1997–2014',
    'Fratello Speedmaster historical reference guides',
    'Multiple Speedmaster reference guides independently document ref. 3570.50 from 1997 until its 2014 replacement.'
  );

  apply(
    '311.30.42.30.01.005',
    '2014–January 2021',
    'Fratello Speedmaster historical reference guides',
    'Ref. 311.30.42.30.01.005 replaced 3570.50 in 2014 and was discontinued in January 2021 when the calibre 3861 Moonwatch generation arrived.'
  );
})();