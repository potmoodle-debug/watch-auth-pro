/* Watch Auth Pro v2.60.4 — Omega Speedmaster dating/reference repair */
(function () {
  const SPEEDMASTER_3570_RULE = {
    refs: ['3570.50', '3570.50.00', '357050', '35705000'],
    family: 'Speedmaster Professional Moonwatch',
    size: '42 mm',
    calibre: ['1861', 'CAL1861', 'CAL.1861'],
    calibreDisplay: 'Omega Calibre 1861',
    reserve: 'approximately 48 hours',
    technology: 'Manual-winding chronograph',
    production: 'approximately 1996–2014',
    notes: 'Hesalite-front Moonwatch generation with solid caseback. Movement serial dating is supporting evidence only and must agree with the reference, calibre and physical configuration.',
    source: 'Omega Speedmaster technical records; WatchBase 3570.50.00; specialist Speedmaster serial-range records',
    confidence: 'High-confidence exact-reference/calibre match'
  };

  function parsePeriod(periodText) {
    const text = String(periodText || '');
    const years = (text.match(/\b(?:18|19|20)\d{2}\b/g) || []).map(Number);
    if (!years.length) return null;
    const currentYear = new Date().getFullYear();
    const openEnded = /\b(?:present|current|onward|ongoing)\b/i.test(text);
    return {
      min: Math.min.apply(null, years),
      max: openEnded ? currentYear : Math.max.apply(null, years),
      openEnded
    };
  }

  function intersectPeriods(hints) {
    const parsed = hints.map(h => h && parsePeriod(h.period)).filter(Boolean);
    if (!parsed.length) return null;
    const min = Math.max.apply(null, parsed.map(p => p.min));
    const max = Math.min.apply(null, parsed.map(p => p.max));
    if (min > max) return { conflict: true, min, max };
    return { conflict: false, min, max };
  }

  function applyPatch() {
    try {
      if (typeof DATABASE_META === 'object' && DATABASE_META) {
        DATABASE_META.version = '2.60.4';
        DATABASE_META.updated = '18 August 2026';
        DATABASE_META.scope = 'Omega Speedmaster reference-aware dating repair: 3570.50 routing, safer modern Speedmaster serial guidance and vintage-boundary handling';
      }

      if (Array.isArray(OMEGA_REFERENCE_RULES)) {
        const exists = OMEGA_REFERENCE_RULES.some(entry => Array.isArray(entry.refs) && entry.refs.some(ref => normaliseOmegaReference(ref) === normaliseOmegaReference('3570.50')));
        if (!exists) OMEGA_REFERENCE_RULES.unshift(SPEEDMASTER_3570_RULE);
      }

      if (OMEGA_SERIAL_RANGES && Array.isArray(OMEGA_SERIAL_RANGES.speedmaster)) {
        const ranges = OMEGA_SERIAL_RANGES.speedmaster;
        const modernCatchAll = ranges.find(row => row[0] === 77000000 && row[1] === Infinity);
        if (modernCatchAll) modernCatchAll[2] = 'modern Speedmaster sequence — exact year requires reference/calibre';

        const has3570Range = ranges.some(row => row[0] === 48356000 && row[1] === 77098000);
        if (!has3570Range) {
          ranges.unshift(
            [48339000, 48385000, 'approximately 1996–1997 (early 3570.50 / tritium overlap; confirm reference and calibre)'],
            [48356000, 77098000, 'approximately 1997–2015 for documented 3570.50 sequence; reference/calibre required']
          );
        }
      }

      if (typeof estimateOmegaSerialYear === 'function') {
        const originalEstimateOmegaSerialYear = estimateOmegaSerialYear;
        estimateOmegaSerialYear = function (serial, series) {
          if (series !== 'speedmaster') return originalEstimateOmegaSerialYear(serial, series);
          if (!/^\d{7,8}$/.test(String(serial || ''))) return null;
          const value = Number(serial);
          if (value >= 48339000 && value <= 48385000) {
            return 'approximately 1996–1997 (early 3570.50 / tritium overlap; confirm reference and calibre)';
          }
          if (value >= 48356000 && value <= 77098000) {
            return 'approximately 1997–2015 for documented 3570.50 sequence; reference/calibre required';
          }
          if (value > 77098000) {
            return 'modern Speedmaster sequence — exact year requires reference/calibre';
          }
          return originalEstimateOmegaSerialYear(serial, series);
        };
      }

      if (typeof renderAgeClassification === 'function') {
        renderAgeClassification = function (referenceHint, serialHint) {
          const box = document.getElementById('ageClassificationResult');
          if (!box) return;
          box.innerHTML = '';
          box.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';

          const hints = [referenceHint, serialHint].filter(Boolean);
          const intersection = intersectPeriods(hints);
          const cutoffDate = new Date();
          cutoffDate.setFullYear(cutoffDate.getFullYear() - 20);
          const cutoffYear = cutoffDate.getFullYear();

          if (!intersection) {
            renderInformationBox(box, 'info', 'Age class: CHECK DATE', 'The available dating evidence does not provide a bounded production year. Vintage status cannot be assigned from the serial alone.<div class="mt-2 text-[10px] opacity-75">Rule used: Vintage means more than 20 years old. Reference, calibre and physical dating evidence take priority over an open-ended serial chart.</div>');
            return;
          }

          if (intersection.conflict) {
            renderInformationBox(box, 'warn', 'Age class: CHECK DATE', 'The reference and serial dating clues do not overlap. Review the reference, movement serial and calibre before assigning an age class.<div class="mt-2 text-[10px] opacity-75">Rule used: Vintage means more than 20 years old. Conflicting chronology is never auto-classified.</div>');
            return;
          }

          let classification;
          let tone;
          let explanation;
          if (intersection.max < cutoffYear) {
            classification = 'VINTAGE';
            tone = 'info';
            explanation = `The best available production window (${intersection.min}–${intersection.max}) falls entirely before the current 20-year boundary.`;
          } else if (intersection.min > cutoffYear) {
            classification = 'MODERN';
            tone = 'info';
            explanation = `The best available production window (${intersection.min}–${intersection.max}) falls entirely after the current 20-year boundary.`;
          } else {
            classification = 'CHECK DATE';
            tone = 'warn';
            explanation = `The best available production window (${intersection.min}–${intersection.max}) reaches or crosses the current 20-year boundary. A year-only estimate at the cutoff cannot establish whether the watch is already more than 20 years old.`;
          }

          renderInformationBox(box, tone, `Age class: ${classification}`, `${explanation}<div class="mt-2 text-[10px] opacity-75">Rule used: Vintage means more than 20 years old. Where a range reaches or crosses the boundary, the app leaves the status unresolved rather than guessing.</div>`);
        };
      }
    } catch (error) {
      console.error('Omega Speedmaster v2.60.4 patch failed', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPatch, { once: true });
  } else {
    applyPatch();
  }
})();
