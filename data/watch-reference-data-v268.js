/* Watch Auth Pro official-current reference refresh
   Version 2.68.0 — 8 September 2026

   Policy:
   - Add only manufacturer-confirmed current references/specifications.
   - Preserve historical, workshop and replica evidence in their existing layers.
   - Resolve previously manual-review entries only where official evidence now exists.
*/

DATABASE_META.version = '2.68.0';
DATABASE_META.updated = '8 September 2026';
DATABASE_META.scope = 'Official 2026 current-model refresh: TUDOR Monarch, Northflag and Black Bay Chrono 39; Rolex Yacht-Master II current catalogue additions; Rolex clasp-code copy reminder';

if (Array.isArray(TUDOR_REFERENCE_RULES)) {
  TUDOR_REFERENCE_RULES.unshift(
    {
      pattern:/^M?2639W1A0U(?:-0001)?$/i,
      family:'TUDOR Monarch', size:'39 mm',
      calibre:['MT5662-2U','MT56622U','MT5662'], reserve:'65 hours', production:'2026-present',
      technology:'Self-winding Manufacture Calibre; COSC and METAS Master Chronometer',
      notes:'Official 2026 TUDOR Monarch reference M2639W1A0U-0001. This resolves the earlier unresolved 2639W1A0 transcription family: verify the full case reference where visible.',
      source:'TUDOR official product page M2639W1A0U-0001, checked 8 September 2026', confidence:'Official / high confidence'
    },
    {
      pattern:/^M?9140G1A0U(?:-0001)?$/i,
      family:'TUDOR Northflag', size:'40 mm',
      calibre:['MT5652-U','MT5652U','MT5652'], reserve:'65 hours', production:'2026-present',
      technology:'Self-winding GMT Manufacture Calibre; COSC and METAS Master Chronometer',
      notes:'Second-generation Northflag with GMT function, 24-hour rehaut, integrated T-fit bracelet and sapphire display back.',
      source:'TUDOR official Northflag product page M9140G1A0U-0001, checked 8 September 2026', confidence:'Official / high confidence'
    },
    {
      pattern:/^M?79310N(?:-0001)?$/i,
      family:'Black Bay Chrono 39', size:'39 mm',
      calibre:['MT5813'], reserve:'approximately 70 hours', production:'2026-present',
      technology:'Self-winding Manufacture chronograph; COSC',
      notes:'Official 2026 Black Bay Chrono 39 reference M79310N-0001, yellow dial with black sub-counters, fixed tachymeter bezel and T-fit bracelet.',
      source:'TUDOR official product page M79310N-0001, checked 8 September 2026', confidence:'Official / high confidence'
    }
  );
}
