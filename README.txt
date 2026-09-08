WATCH AUTH PRO v2.68.0 — 2026 REFERENCE REFRESH

CURRENT UPDATE — 8 SEPTEMBER 2026
- Adds manufacturer-confirmed 2026 reference intelligence without replacing older historical, workshop or replica evidence.
- TUDOR Monarch M2639W1A0U-0001 is now officially resolved to Manufacture Calibre MT5662-2U; the earlier unresolved 2639W1A0 observation is no longer left as an unknown when the full/current reference is entered.
- Adds TUDOR Northflag M9140G1A0U-0001 / MT5652-U and Black Bay Chrono 39 M79310N-0001 / MT5813.
- Adds current Rolex Yacht-Master II references 126680 and 126688 to the official-current catalogue layer; both use Rolex calibre 4162.
- Adds a Rolex-only clasp-code reminder when Copy authentication note is pressed with the clasp-code field blank. The authenticator can return to enter the code or deliberately choose Copy anyway.
- v2.67.1 and all earlier evidence layers are retained underneath this release.

DATA POLICY
- Official-current manufacturer evidence stays separate from historical, workshop and replica-reference evidence.
- Suspected transcription errors are not silently promoted to exact references.
- Authentication warnings remain evidence prompts, not automatic authenticity verdicts.

CORE FILE STRUCTURE

index.html
styles.css
app.js
.nojekyll
README.md
README.txt
DEPLOYMENT_CHECKLIST.txt
data/
  watch-reference-data.js
  watch-reference-data-base-v253.js
  watch-reference-data-v254.js
  watch-reference-data-v255.js
  watch-reference-data-v262.js
  watch-reference-data-v265.js
  watch-reference-data-v267.js
  watch-reference-data-v268.js
  rolex-current-catalogue-v261.js
  rolex-current-catalogue-v268.js
features/
  calibre-suggest-v256.js
  custom-brand-v257.js
  save-next-scroll-v258.js
  iwc-tools-brand-order-v259.js
  tudor-serial-compact-v2591.js
  rma-returns-v260.js
  rma-note-only-v2601.js
  rma-inspection-wording-v2602.js
  rma-no-timekeeping-v2603.js
  omega-speedmaster-dating-v2604.js
  missing-reference-all-brands-v2605.js
  rolex-current-catalogue-v261.js
  rma-return-condition-v263.js
  compact-watch-information-v264.js
  version-banner-v2671.js
  tag-calibre-11-reminder-v2651.js
  ginza-temporary-v2641.js
  rolex-clasp-copy-reminder-v268.js

DEPLOYMENT
1. GitHub Pages deploys from main, /(root).
2. data/watch-reference-data.js is the additive loader and identifies v2.68.0.
3. Do not remove older data layers; later releases intentionally sit on top of earlier evidence.
4. Current Rolex catalogue refreshes must remain in separate rolex-current-catalogue layers.
5. Before merging, verify the loader references every required file and test Rolex note copying both with and without a clasp code.
