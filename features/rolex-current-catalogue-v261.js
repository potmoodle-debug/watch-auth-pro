/* Watch Auth Pro v2.61.0 — current official Rolex catalogue integration */
(function () {
  const FIELDS = Object.freeze({
    reference: 0,
    configuration: 1,
    collection: 2,
    model: 3,
    caseDescription: 4,
    diameter: 5,
    material: 6,
    bezel: 7,
    functions: 8,
    bracelet: 9,
    dial: 10,
    dialCategory: 11,
    hourMarkers: 12,
    officialUrl: 13
  });

  let catalogueIndex = null;

  function normaliseIdentifier(value) {
    return String(value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  function normaliseBaseReference(value) {
    let compact = String(value || '').trim().toUpperCase().replace(/\s+/g, '');
    compact = compact.replace(/^M(?=\d)/, '');
    compact = compact.replace(/-\d{4}$/, '');
    return compact.replace(/[^A-Z0-9]/g, '');
  }

  function numericReferenceCore(value) {
    const match = normaliseBaseReference(value).match(/^(\d{4,6}M?)/);
    return match ? match[1] : '';
  }

  function ensureIndex() {
    if (catalogueIndex) return catalogueIndex;
    const records = Array.isArray(window.ROLEX_CURRENT_CATALOGUE) ? window.ROLEX_CURRENT_CATALOGUE : [];
    const byConfiguration = new Map();
    const byReference = new Map();
    const byNumericCore = new Map();

    records.forEach(row => {
      const referenceKey = normaliseBaseReference(row[FIELDS.reference]);
      const configurationKey = normaliseIdentifier(row[FIELDS.configuration]);
      const numericKey = numericReferenceCore(referenceKey);
      byConfiguration.set(configurationKey, row);
      byConfiguration.set(configurationKey.replace(/^M(?=\d)/, ''), row);
      if (!byReference.has(referenceKey)) byReference.set(referenceKey, []);
      byReference.get(referenceKey).push(row);
      if (!byNumericCore.has(numericKey)) byNumericCore.set(numericKey, []);
      byNumericCore.get(numericKey).push(row);
    });

    catalogueIndex = { records, byConfiguration, byReference, byNumericCore };
    return catalogueIndex;
  }

  function lookupRolexCurrentCatalogue(value) {
    const index = ensureIndex();
    const identifierKey = normaliseIdentifier(value);
    const baseKey = normaliseBaseReference(value);
    const exactConfiguration = index.byConfiguration.get(identifierKey) || null;
    if (exactConfiguration) {
      return {
        rows: [exactConfiguration],
        exactConfiguration: true,
        exactBaseReference: true,
        numericFamilyMatch: false,
        reference: exactConfiguration[FIELDS.reference],
        configuration: exactConfiguration[FIELDS.configuration]
      };
    }

    const exactBaseRows = index.byReference.get(baseKey);
    if (exactBaseRows && exactBaseRows.length) {
      return {
        rows: exactBaseRows,
        exactConfiguration: false,
        exactBaseReference: true,
        numericFamilyMatch: false,
        reference: exactBaseRows[0][FIELDS.reference],
        configuration: ''
      };
    }

    const numericKey = numericReferenceCore(baseKey);
    const numericRows = index.byNumericCore.get(numericKey);
    if (numericRows && numericRows.length && baseKey === numericKey) {
      return {
        rows: numericRows,
        exactConfiguration: false,
        exactBaseReference: false,
        numericFamilyMatch: true,
        reference: numericKey,
        configuration: ''
      };
    }
    return null;
  }

  function uniqueValues(rows, field) {
    return [...new Set(rows.map(row => String(row[field] || '').trim()).filter(Boolean))];
  }

  function displayValues(rows, field, limit) {
    const values = uniqueValues(rows, field);
    if (!values.length) return 'Not stated in the current catalogue data';
    if (values.length <= limit) return values.join('; ');
    return `${values.slice(0, limit).join('; ')}; plus ${values.length - limit} more`;
  }

  function safeHtml(value) {
    if (typeof escapeHtml === 'function') return escapeHtml(value);
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function cataloguePanelHtml(hit) {
    const rows = hit.rows;
    const references = uniqueValues(rows, FIELDS.reference);
    const configurations = uniqueValues(rows, FIELDS.configuration);
    const title = hit.exactConfiguration ? 'Official current Rolex configuration' : 'Official current Rolex catalogue match';
    const configurationLine = hit.exactConfiguration
      ? `<li><strong>Configuration:</strong> ${safeHtml(configurations[0])}</li>`
      : `<li><strong>Current configurations:</strong> ${configurations.length}</li>`;
    const refinementLine = hit.numericFamilyMatch && references.length > 1
      ? `<li class="text-amber-200"><strong>Refine if visible:</strong> the numeric case reference covers ${references.length} current suffix-bearing references: ${safeHtml(references.join(', '))}.</li>`
      : '';
    const link = rows[0][FIELDS.officialUrl];

    return `<div id="rolex-current-catalogue-match" class="mt-3 rounded-lg border border-emerald-800/50 bg-emerald-950/20 p-3 text-xs leading-relaxed">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <strong class="text-emerald-300">${title}</strong>
        <span class="rounded-full border border-emerald-800/60 bg-emerald-950/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-200">Rolex UK · checked 18 Aug 2026</span>
      </div>
      <ul class="mt-2 ml-4 list-disc space-y-1 text-gray-300">
        <li><strong>Model:</strong> ${safeHtml(displayValues(rows, FIELDS.model, 4))}</li>
        <li><strong>Official reference:</strong> ${safeHtml(references.join(', '))}</li>
        ${configurationLine}
        ${refinementLine}
        <li><strong>Case:</strong> ${safeHtml(displayValues(rows, FIELDS.caseDescription, 3))}</li>
        <li><strong>Material:</strong> ${safeHtml(displayValues(rows, FIELDS.material, 4))}</li>
        <li><strong>Bezel:</strong> ${safeHtml(displayValues(rows, FIELDS.bezel, 4))}</li>
        <li><strong>Functions:</strong> ${safeHtml(displayValues(rows, FIELDS.functions, 4))}</li>
        <li><strong>Bracelet:</strong> ${safeHtml(displayValues(rows, FIELDS.bracelet, 4))}</li>
        <li><strong>Dial:</strong> ${safeHtml(displayValues(rows, FIELDS.dial, hit.exactConfiguration ? 2 : 5))}</li>
      </ul>
      ${link ? `<a class="mt-2 inline-block font-bold text-blue-300 underline decoration-blue-700 underline-offset-2" href="${safeHtml(link)}" target="_blank" rel="noopener noreferrer">Open this configuration on Rolex</a>` : ''}
      <div class="mt-2 border-t border-emerald-900/50 pt-2 text-[10px] text-gray-400">Current official catalogue evidence only. A match supports identification but is not proof of authenticity. Discontinued, vintage, regional and transitional references remain in the separate Watch Auth Pro research data.</div>
    </div>`;
  }

  function renderCurrentCatalogueMatch(reference) {
    const caseResult = document.getElementById('caseResult');
    const liveBox = document.getElementById('drawer-live-decoding');
    document.getElementById('rolex-current-catalogue-match')?.remove();
    document.getElementById('rolex-current-catalogue-live')?.remove();
    if (!caseResult || !reference) return null;

    const hit = lookupRolexCurrentCatalogue(reference);
    if (!hit) return null;
    caseResult.insertAdjacentHTML('beforeend', cataloguePanelHtml(hit));

    if (liveBox) {
      const references = uniqueValues(hit.rows, FIELDS.reference).join(', ');
      const models = displayValues(hit.rows, FIELDS.model, 3);
      const exact = hit.exactConfiguration ? ` · ${hit.configuration}` : ` · ${hit.rows.length} current configuration${hit.rows.length === 1 ? '' : 's'}`;
      liveBox.insertAdjacentHTML('beforeend', `<div id="rolex-current-catalogue-live" class="pt-4"><span class="block text-[10px] font-bold uppercase tracking-wide text-emerald-400">Official current Rolex catalogue</span><span class="block text-gray-300">• ${safeHtml(models)}</span><span class="block text-gray-300">• Ref. <strong>${safeHtml(references)}</strong>${safeHtml(exact)}</span></div>`);
    }
    return hit;
  }

  function install() {
    if (!Array.isArray(window.ROLEX_CURRENT_CATALOGUE)) return;

    if (typeof DATABASE_META === 'object' && DATABASE_META) {
      DATABASE_META.version = '2.61.0';
      DATABASE_META.updated = '18 August 2026';
      DATABASE_META.scope = 'Official current Rolex catalogue: 1,465 configurations across 157 base references, retained separately from historical and movement evidence';
    }

    window.lookupRolexCurrentCatalogue = lookupRolexCurrentCatalogue;

    if (typeof normalizeRolexReferenceForMovement === 'function') {
      const originalNormaliseMovementReference = normalizeRolexReferenceForMovement;
      normalizeRolexReferenceForMovement = function (reference) {
        const compact = normaliseBaseReference(reference);
        const match = compact.match(/^(\d{4,6}M?)/);
        return match ? match[1] : originalNormaliseMovementReference(reference);
      };
    }

    if (typeof referenceIsRecognisedForBrand === 'function') {
      const originalReferenceRecognition = referenceIsRecognisedForBrand;
      referenceIsRecognisedForBrand = function (brand, value) {
        if (brand === 'Rolex' && lookupRolexCurrentCatalogue(value)) return true;
        return originalReferenceRecognition(brand, value);
      };
    }

    if (typeof decodeRolexReference === 'function') {
      const originalDecodeRolexReference = decodeRolexReference;
      decodeRolexReference = function (reference) {
        const hit = lookupRolexCurrentCatalogue(reference);
        if (!hit) return originalDecodeRolexReference(reference);
        const row = hit.rows[0];
        const base = originalDecodeRolexReference(row[FIELDS.reference]) || {};
        const suffix = normaliseBaseReference(row[FIELDS.reference]).replace(/^(\d{4,6}M?)/, '');
        return {
          ...base,
          core: numericReferenceCore(row[FIELDS.reference]),
          full: normaliseIdentifier(reference),
          model: displayValues(hit.rows, FIELDS.model, 4),
          bezel: displayValues(hit.rows, FIELDS.bezel, 4),
          metal: displayValues(hit.rows, FIELDS.material, 4),
          suffix,
          suffixLabel: suffix ? `official current Rolex suffix; exact listed references: ${uniqueValues(hit.rows, FIELDS.reference).join(', ')}` : '',
          currentCatalogueHit: hit
        };
      };
    }

    if (typeof runRolexForensicAnalysis === 'function') {
      const originalRunRolexForensicAnalysis = runRolexForensicAnalysis;
      runRolexForensicAnalysis = function () {
        const result = originalRunRolexForensicAnalysis.apply(this, arguments);
        if (typeof getSelectedBrand === 'function' && getSelectedBrand() === 'Rolex') {
          const inputs = typeof getReferenceInputs === 'function' ? getReferenceInputs() : null;
          const reference = inputs?.lookupReference || document.getElementById('caseRef')?.value || '';
          renderCurrentCatalogueMatch(reference);
        }
        return result;
      };
    }

    if (typeof updateDatabaseStatus === 'function') {
      const originalUpdateDatabaseStatus = updateDatabaseStatus;
      updateDatabaseStatus = function () {
        originalUpdateDatabaseStatus();
        const status = document.getElementById('database-status');
        if (status && !/current official Rolex/i.test(status.textContent || '')) {
          status.textContent = `${status.textContent} · 157 current official Rolex refs`;
        }
      };
    }

    queueMicrotask(() => {
      try {
        if (typeof updateDatabaseStatus === 'function') updateDatabaseStatus();
        if (typeof getSelectedBrand === 'function' && getSelectedBrand() === 'Rolex') {
          const reference = document.getElementById('caseRef')?.value || '';
          if (reference) renderCurrentCatalogueMatch(reference);
        }
      } catch (error) {
        console.error('Rolex current catalogue v2.61.0 initial render failed', error);
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, { once: true });
  else install();
})();
