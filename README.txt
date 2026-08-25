WATCH AUTH PRO v2.67.0 — DEPLOYMENT-READY PACKAGE

CURRENT UPDATE — 25 AUGUST 2026
- v2.67.0 is a researched and cleaned missing-reference update built on top of v2.66.1.
- Source batch: watch-auth-pro-missing-references-v2.65.0.csv.
- Exact/reference-family mappings added or repaired across Omega, Cartier, Tudor, Breitling, TAG Heuer, Longines, Jaeger-LeCoultre, Grand Seiko, Seiko, IWC, Bremont, Oris, Montblanc, Hamilton, Christopher Ward, Schofield, Nivada and Swatch.
- Collection-name-only inputs are retained as manual-review guidance instead of being treated as exact references.
- Obvious input errors were cleaned, including Jaeger-LeCoultre 250.8.86 being mis-entered under Generic.
- Breitling B12019 was cleaned from partial calibre text to the documented B12 / Lemania 1873 movement family.
- Tudor 25827K is NOT silently accepted as an exact reference; it is flagged as a likely transcription error against official 25807KN Pelagos FXD Chrono / MT5813 data.
- Tudor 2639W1A0 remains unresolved and requires manual re-checking of the engraving rather than an invented mapping.
- TAG Heuer WAY2013 / serial WTQ5427 is retained as an authenticator replica-observation note and must be treated as a high-risk warning, not as a universal serial-only counterfeit verdict.
- TAG Heuer WBD1423 is correctly treated as quartz; submitted “775” is not promoted to a calibre.
- Swatch × Audemars Piguet Royal Pop is identified as a hand-wound SISTEM51 pocket-watch collaboration; submitted V8EF29 is not treated as the calibre.
- Rolex 178240 now recognises calibre 2235 rather than returning unknown.

CORRECT FILE STRUCTURE

index.html
styles.css
app.js
.nojekyll
data/
  watch-reference-data.js
  watch-reference-data-v267.js
  watch-reference-data-v265.js
  watch-reference-data-v262.js
  rolex-current-catalogue-v261.js
features/
  rolex-current-catalogue-v261.js
  rma-return-condition-v263.js
  compact-watch-information-v264.js

IMPORTANT
1. GitHub Pages should deploy from main, /(root).
2. data/watch-reference-data.js is the loader and now identifies v2.67.0.
3. Do not remove the older data layers; v2.67.0 is additive and intentionally sits on top of v2.66.1 and earlier reference layers.

VERIFIED EXISTING FEATURES RETAINED
- Official current Rolex catalogue data remains separate from vintage, movement and replica-reference evidence.
- RMA quick-add includes “Watch returned in same condition as shipped to buyer.”
- Reference, serial, calibre, dating, catalogue and clasp results remain consolidated into the concise click-to-open Watch information panel.
- The closed panel retains visible Attention or Review status while detailed output remains available on click.
