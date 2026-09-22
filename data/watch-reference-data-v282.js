/* Watch Auth Pro v2.82.0 — verified Tudor production-date research batch 4
   Added 22 September 2026.
   Scope: current exact references with official TUDOR launch/current-catalogue evidence.
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
    if (!Array.isArray(TUDOR_REFERENCE_RULES)) return 0;
    let updated = 0;
    TUDOR_REFERENCE_RULES.forEach(rule => {
      if (!matches(rule, reference)) return;
      rule.production = production;
      rule.productionVerified = true;
      rule.productionSource = source;
      rule.productionEvidence = evidence;
      updated += 1;
    });
    if (updated < 1 && typeof console !== 'undefined' && console.warn) {
      console.warn('[Watch Auth Pro v2.82] No Tudor production-date match for', reference);
    }
    return updated;
  }

  apply('79000N','2023–present','TUDOR official Black Bay 54 2023 press kit and current product page','TUDOR introduced the Black Bay 54 ref. M79000N in 2023; the reference remains in the current catalogue.');
  apply('25407N','2022–present','TUDOR official Pelagos 39 2022 press kit and current product page','TUDOR introduced the Pelagos 39 ref. M25407N in 2022; the reference remains in the current catalogue.');
  apply('79470','2022–present','TUDOR official Black Bay Pro 2022 press kit and current product page','TUDOR introduced the Black Bay Pro ref. M79470 in 2022; the reference remains in the current catalogue.');
  apply('79950','2022–present','TUDOR official Ranger history/current product pages','TUDOR introduced the modern Ranger ref. M79950 in 2022; the reference remains in the current catalogue.');
  apply('79830RB','2018–present','TUDOR official Black Bay GMT 2018 press kit and current product page','TUDOR introduced the Black Bay GMT ref. M79830RB in 2018; the reference remains in the current catalogue.');
})();