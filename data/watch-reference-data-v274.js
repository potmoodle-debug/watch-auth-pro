/* Watch Auth Pro v2.74.0 — researched-reference consolidation
   Removes conflicting duplicate rules from earlier research batches and installs one
   canonical rule for each duplicated reference audited on 18 September 2026.
*/
(function () {
  'use strict';

  function safeTest(pattern, value) {
    if (!(pattern instanceof RegExp)) return false;
    pattern.lastIndex = 0;
    return pattern.test(value);
  }

  function removeMatching(target, brand, reference) {
    if (!Array.isArray(target)) return;
    for (let i = target.length - 1; i >= 0; i--) {
      const rule = target[i];
      const sameBrand = !brand || String(rule?.brand || '').trim().toUpperCase() === String(brand).trim().toUpperCase();
      const base = String(rule?.baseReference || '').trim().toUpperCase();
      const ref = String(reference).trim().toUpperCase();
      const patternMatch = safeTest(rule?.pattern, reference) || safeTest(rule?.pattern, ref.replace(/\s+/g, ''));
      if (sameBrand && (base === ref || patternMatch)) target.splice(i, 1);
    }
  }

  function add(target, rule) {
    if (Array.isArray(target)) target.unshift(rule);
  }

  // CARTIER — consolidate duplicate exact rules.
  [
    {
      ref: 'W20072X7',
      rule: {
        pattern: /^W20072X7$/i, baseReference: 'W20072X7',
        family: 'Santos 100', size: '38 × 51 mm',
        calibre: ['049', 'CAL049'], calibreDisplay: '049',
        technology: 'Automatic mechanical', reserve: 'approximately 42 hours',
        caseDetails: 'Steel/yellow-gold Santos 100; approximately 100 m water resistance.',
        dialDetails: 'Configuration varies by full watch/strap execution.',
        notes: 'Audited duplicate consolidation. Reference W20072X7 is associated with Cartier calibre 049.',
        source: 'Cartier reference records; Watches.co.uk / Chrono24 cross-reference',
        confidence: 'High confidence'
      }
    },
    {
      ref: 'WB701851',
      rule: {
        pattern: /^WB701851$/i, baseReference: 'WB701851',
        family: 'Tank Américaine', size: 'approximately 19 mm wide',
        calibre: ['157', 'CAL157'], calibreDisplay: '157',
        technology: 'Quartz', reserve: 'battery powered',
        caseDetails: 'White-gold Tank Américaine reference; diamond-set examples are documented.',
        dialDetails: 'Silver/white dial configurations documented.',
        notes: 'Audited duplicate consolidation. Quartz reference mapping retained; calibre 157 remains the embedded workshop/reference mapping.',
        source: 'Cartier market/reference records',
        confidence: 'Medium-high confidence'
      }
    },
    {
      ref: 'W20073X8',
      rule: {
        pattern: /^W20073X8$/i, baseReference: 'W20073X8',
        family: 'Santos 100', size: '41.3 mm',
        calibre: ['049', 'CAL049'], calibreDisplay: '049',
        technology: 'Automatic mechanical', reserve: 'approximately 42 hours',
        caseDetails: 'Stainless-steel Santos 100; approximately 100 m water resistance.',
        dialDetails: 'Silver/white Roman-numeral configurations documented.',
        notes: 'Audited duplicate consolidation. Reference W20073X8 is associated with Cartier calibre 049.',
        source: 'Cartier reference records; Watches.co.uk cross-reference',
        confidence: 'High confidence'
      }
    }
  ].forEach(({ref, rule}) => {
    removeMatching(CARTIER_REFERENCE_RULES, null, ref);
    add(CARTIER_REFERENCE_RULES, rule);
  });

  // SHARED / OTHER BRANDS — consolidate duplicate rules.
  const canonicalOther = [
    {
      brand: 'Grand Seiko', ref: 'SBGA429',
      rule: {
        brand: 'Grand Seiko', pattern: /^SBGA429G?$/i, baseReference: 'SBGA429',
        family: 'Heritage Collection Soko Special Edition', size: '39 mm',
        calibre: ['9R65'], calibreDisplay: '9R65',
        technology: 'Spring Drive automatic', reserve: '72 hours',
        notes: 'Soko Special Edition with shadow-grey dial and green accents.',
        source: 'Grand Seiko official product page', confidence: 'Official / high confidence'
      }
    },
    {
      brand: 'Maurice Lacroix', ref: 'AI6007',
      rule: {
        brand: 'Maurice Lacroix', pattern: /^AI6007(?:[-.][A-Z0-9-]+)?$/i, baseReference: 'AI6007',
        family: 'AIKON Automatic / Skeleton 39 mm family', size: '39 mm',
        calibre: ['ML115'], calibreDisplay: 'ML115',
        technology: 'Automatic', reserve: 'reference/configuration-specific',
        notes: 'AI6007 is a family stem; preserve the complete suffix when available because it determines the exact configuration.',
        source: 'Maurice Lacroix / reference records', confidence: 'High confidence'
      }
    },
    {
      brand: 'Hublot', ref: '511.NX.1170.RX',
      rule: {
        brand: 'Hublot', pattern: /^511[.]NX[.]1170[.]RX$/i, baseReference: '511.NX.1170.RX',
        family: 'Classic Fusion 45 mm', size: '45 mm',
        calibre: ['HUB1112'], calibreDisplay: 'HUB1112',
        technology: 'Automatic', reserve: 'reference-specific',
        notes: 'Titanium Classic Fusion on rubber strap; branded calibre HUB1112.',
        source: 'Hublot/reference records', confidence: 'High confidence'
      }
    },
    {
      brand: 'TAG Heuer', ref: 'WAY201B',
      rule: {
        brand: 'TAG Heuer', pattern: /^WAY201B(?:[.][A-Z0-9]+)?$/i, baseReference: 'WAY201B',
        family: 'Aquaracer 300M Calibre 5', size: '43 mm',
        calibre: ['Calibre 5', '5', 'CAL5'], calibreDisplay: 'Calibre 5',
        technology: 'Automatic', reserve: 'reference-specific',
        notes: 'Aquaracer 300M family stem; preserve the complete suffix when available.',
        source: 'TAG Heuer/reference records', confidence: 'High confidence'
      }
    },
    {
      brand: 'Breitling', ref: 'A17376',
      rule: {
        brand: 'Breitling', pattern: /^A17376[A-Z0-9]*$/i, baseReference: 'A17376',
        family: 'Superocean Automatic 44', size: '44 mm',
        calibre: ['17', 'CAL17', 'BREITLING17', 'Breitling 17'], calibreDisplay: 'Breitling 17',
        technology: 'Self-winding mechanical', reserve: 'approximately 38 hours',
        production: 'modern Superocean generation',
        functions: 'Hours, minutes, seconds, date',
        caseDetails: '44 mm stainless steel; 300 m water resistance on current A17376 executions.',
        notes: 'Audited against Breitling official A17376 product specifications.',
        source: 'Breitling official product page', confidence: 'Official / high confidence'
      }
    },
    {
      brand: 'Breitling', ref: 'A59028',
      rule: {
        brand: 'Breitling', pattern: /^A59028[A-Z0-9]*$/i, baseReference: 'A59028',
        family: 'Jupiter Pilot', size: '41.5 mm',
        calibre: ['59', 'CAL59', 'BREITLING59', 'Breitling 59'], calibreDisplay: 'Breitling 59',
        technology: 'Quartz chronograph', reserve: 'battery powered',
        production: 'approximately 1995–1998',
        functions: 'Chronograph, date, time',
        caseDetails: 'Steel; approximately 100 m water resistance; mineral crystal.',
        notes: 'Consolidated to Breitling calibre 59; older conflicting raw workshop mapping removed.',
        source: 'Breitling specialist reference records', confidence: 'High confidence'
      }
    },
    {
      brand: 'Panerai', ref: 'PAM01305',
      rule: {
        brand: 'Panerai', pattern: /^PAM0?1305$/i, baseReference: 'PAM01305',
        family: 'Luminor Submersible 47 Automatic Titanium', size: '47 mm',
        calibre: ['P.9010', 'P9010'], calibreDisplay: 'P.9010',
        technology: 'Automatic mechanical', reserve: '72 hours',
        notes: 'Titanium case; 300 m water resistance; date and small seconds.',
        source: 'Panerai reference records', confidence: 'High confidence'
      }
    },
    {
      brand: 'TAG Heuer', ref: 'WBD1420',
      rule: {
        brand: 'TAG Heuer', pattern: /^WBD1420(?:[.][A-Z0-9]+)?$/i, baseReference: 'WBD1420',
        family: 'Aquaracer Date 27 mm', size: '27 mm',
        calibre: ['Quartz'], calibreDisplay: 'Quartz',
        technology: 'Quartz', reserve: 'battery powered',
        notes: '27 mm Aquaracer Date; 300 m water resistance. Full suffix determines bracelet/material configuration.',
        source: 'TAG Heuer official product page', confidence: 'Official / high confidence'
      }
    },
    {
      brand: 'Breitling', ref: 'A44364',
      rule: {
        brand: 'Breitling', pattern: /^A44364[A-Z0-9]*$/i, baseReference: 'A44364',
        family: 'Breitling for Bentley 6.75 / 6.75 Speed', size: '48.7 mm',
        calibre: ['44B', 'CAL44B', 'BREITLING44B', 'Breitling 44B'], calibreDisplay: 'Breitling 44B',
        technology: 'Automatic chronograph', reserve: 'approximately 42 hours',
        production: 'A44364 spans the 6.75 Speed / later 6.75 naming period',
        functions: 'Chronograph, big date',
        caseDetails: 'Approximately 100 m water resistance; sapphire crystal.',
        notes: 'Model naming changed during the reference run; calibre 44B is consistent.',
        source: 'Breitling specialist reference records', confidence: 'High confidence'
      }
    },
    {
      brand: 'TAG Heuer', ref: 'WBP2110',
      rule: {
        brand: 'TAG Heuer', pattern: /^WBP2110(?:[.][A-Z0-9]+)?$/i, baseReference: 'WBP2110',
        family: 'Aquaracer Professional 200 Date', size: '40 mm',
        calibre: ['Calibre 5', '5', 'CAL5'], calibreDisplay: 'Calibre 5',
        technology: 'Automatic', reserve: '38 hours',
        notes: '40 mm steel Aquaracer Professional 200 Date; 200 m water resistance. Full suffix identifies the exact bracelet/market configuration.',
        source: 'TAG Heuer official product page', confidence: 'Official / high confidence'
      }
    },
    {
      brand: 'Seiko', ref: 'SLA079J1',
      rule: {
        brand: 'Seiko', pattern: /^SLA079(?:J1)?$/i, baseReference: 'SLA079J1',
        family: 'Prospex Marinemaster 1968 Heritage Diver', size: '42.6 mm',
        calibre: ['8L35'], calibreDisplay: '8L35',
        technology: 'Automatic with manual winding', reserve: 'approximately 50 hours',
        notes: '42.6 mm stainless steel; 300 m diver; date.',
        source: 'Seiko official product page', confidence: 'Official / high confidence'
      }
    }
  ];

  canonicalOther.forEach(({brand, ref, rule}) => {
    removeMatching(OTHER_REFERENCE_RULES, brand, ref);
    add(OTHER_REFERENCE_RULES, rule);
  });

  if (typeof DATABASE_META !== 'undefined' && DATABASE_META) {
    DATABASE_META.version = '2.74.0';
    DATABASE_META.updated = '18 September 2026';
    DATABASE_META.scope = 'Reference database duplicate consolidation and research-queue integrity audit.';
  }
})();