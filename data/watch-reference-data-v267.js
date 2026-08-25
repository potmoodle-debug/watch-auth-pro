/*
 Watch Auth Pro researched queue update
 Version 2.67.0 — 25 August 2026
 Source batch: watch-auth-pro-missing-references-v2.65.0.csv

 Cleaning policy:
 - Exact references are mapped only where the reference/model relationship is supportable.
 - Collection/model-name-only entries remain manual-review guidance.
 - Obvious brand misclassification is corrected (e.g. JLC 250.8.86).
 - Suspected transcription errors are NOT silently promoted to exact references.
*/

DATABASE_META.version = '2.67.0';
DATABASE_META.updated = '25 August 2026';
DATABASE_META.scope = '25 August 2026 researched/cleaned v2.65.0 queue: exact and family mappings added across Omega, Cartier, Tudor, Breitling, TAG Heuer, Longines, Jaeger-LeCoultre, Grand Seiko, Seiko, IWC, Bremont, Oris, Montblanc, Hamilton, Christopher Ward, Schofield, Nivada and Swatch; malformed and collection-only inputs retained as review guidance rather than false exact matches';

OMEGA_REFERENCE_RULES.unshift(
  {
    refs:['311.30.42.30.01.005','31130423001005'],
    family:'Speedmaster Moonwatch Professional — Hesalite', size:'42 mm',
    calibre:['1861','CAL1861'], technology:'Manual-winding chronograph', reserve:'48 hours',
    certification:'Pre-METAS Moonwatch generation',
    notes:'Hesalite-front Moonwatch Professional. Calibre 1861 is the expected movement.',
    source:'OMEGA product sheet 311.30.42.30.01.005', confidence:'Official / high confidence'
  },
  {
    refs:['310.30.42.50.01.002','31030425001002'],
    family:'Speedmaster Moonwatch Professional — Sapphire', size:'42 mm',
    calibre:['3861','CAL3861'], technology:'Manual-winding Co-Axial Master Chronometer chronograph', reserve:'50 hours',
    certification:'METAS Master Chronometer',
    notes:'Sapphire-front and display-back Moonwatch Professional. Calibre 3861 is expected.',
    source:'OMEGA official product sheet', confidence:'Official / high confidence'
  },
  {
    refs:['210.30.42.20.10.001','21030422010001'],
    family:'Seamaster Diver 300M — green', size:'42 mm',
    calibre:['8800','CAL8800'], technology:'Automatic Co-Axial Master Chronometer with date', reserve:'55 hours',
    certification:'METAS Master Chronometer',
    notes:'Green-dial/green-bezel Diver 300M generation; calibre 8800 is expected.',
    source:'OMEGA Diver 300M reference records', confidence:'High confidence'
  },
  {
    refs:['210.32.42.20.03.001','21032422003001'],
    family:'Seamaster Diver 300M — blue on rubber', size:'42 mm',
    calibre:['8800','CAL8800'], technology:'Automatic Co-Axial Master Chronometer with date', reserve:'55 hours',
    certification:'METAS Master Chronometer',
    notes:'Blue Diver 300M on rubber strap. Calibre 8800 is expected.',
    source:'OMEGA official product page', confidence:'Official / high confidence'
  },
  {
    refs:['424.13.40.20.02.002','42413402002002'],
    family:'De Ville Prestige Co-Axial Chronometer', size:'39.5 mm',
    calibre:['2500','CAL2500'], technology:'Automatic Co-Axial chronometer with date', reserve:'48 hours',
    certification:'COSC chronometer',
    notes:'Silver-dial steel De Ville Prestige on leather; calibre 2500 is expected.',
    source:'OMEGA official product page', confidence:'Official / high confidence'
  },
  {
    refs:['2201.51','2201.51.00','22015100'],
    family:'Seamaster Planet Ocean 600M', size:'42 mm',
    calibre:['2500','CAL2500'], technology:'Automatic Co-Axial chronometer with date', reserve:'approximately 48 hours',
    certification:'COSC chronometer',
    notes:'First-generation Planet Ocean reference family; calibre 2500 is consistent.',
    source:'OMEGA archived Planet Ocean reference records', confidence:'High confidence'
  },
  {
    refs:['434.23.42.22.02.001','43423422202001'],
    family:'De Ville Prestige Power Reserve / pointer-date generation', size:'41 mm class',
    calibre:['8936','CAL8936'], technology:'Automatic Co-Axial Master Chronometer', reserve:'reference-specific',
    certification:'METAS Master Chronometer',
    notes:'Observed calibre 8936 is retained for this exact submitted reference; verify dial complication layout against the physical watch.',
    source:'OMEGA reference records + workshop observation', confidence:'High-confidence reference/calibre compatibility'
  },
  {
    refs:['176.002','ST176.002','176002'],
    family:'Speedmaster Mark III', size:'41 mm',
    calibre:['1040','CAL1040'], technology:'Automatic chronograph with date and 24-hour indication', reserve:'period specification',
    certification:'Not METAS',
    notes:'Introduced in 1971 as OMEGA’s first self-winding Speedmaster chronograph. Calibre 1040 is expected. Rare period dial variants exist; confirm dial originality separately.',
    source:'OMEGA historical Mark III record', confidence:'Official / high confidence'
  },
  {
    pattern:/^(?:AQUA\s*TERRA|OMEGA\s*AQUA\s*TERRA)$/i,
    family:'Seamaster Aqua Terra — collection-level entry', size:'reference-dependent',
    calibre:['8900','CAL8900'], technology:'Automatic Co-Axial Master Chronometer on compatible modern references',
    notes:'“Aqua Terra” is not a complete reference. Calibre 8900 is plausible for many modern 41 mm Aqua Terra models, but exact case/dial/configuration must not be inferred without the full PIC reference.',
    source:'OMEGA Aqua Terra calibre/reference records', confidence:'Collection guidance only', manualReview:true, collectionOnly:true
  },
  {
    pattern:/^(?:OMEGA\s*)?SEAMASTER$/i,
    family:'Seamaster — collection-level entry', size:'reference-dependent',
    calibre:['8800','CAL8800'], technology:'Reference-dependent',
    notes:'“OMEGA SEAMASTER” is a collection name only. Calibre 8800 is plausible for modern Diver 300M and related models, but the full reference is required.',
    source:'OMEGA collection/calibre records', confidence:'Collection guidance only', manualReview:true, collectionOnly:true
  },
  {
    pattern:/^SEAMASTER\s*DIVER$/i,
    family:'Seamaster Diver — incomplete model-family entry', size:'reference-dependent',
    calibre:['9900','CAL9900'], technology:'Reference-dependent; calibre 9900 normally indicates an automatic Master Chronometer chronograph',
    notes:'The submitted text is not a unique reference. If calibre 9900 is physically observed, verify that the watch is a compatible Seamaster chronograph and record the complete PIC reference before exact mapping.',
    source:'OMEGA calibre 9900 and Seamaster chronograph records', confidence:'Manual review required', manualReview:true, collectionOnly:true
  }
);

CARTIER_REFERENCE_RULES.unshift(
  {
    pattern:/^W20018D6$/i, baseReference:'W20018D6',
    family:'Santos Galbée', size:'reference-generation dependent',
    calibre:['87','CAL87','087'], calibreDisplay:'Cartier calibre 87',
    technology:'Mechanical movement; verify winding type from physical movement',
    notes:'Exact Santos Galbée reference. Submitted calibre 87 is retained as workshop-supported; verify movement signature before final authentication.',
    source:'Cartier Santos Galbée reference records + workshop observation', confidence:'High-confidence model mapping; movement requires physical confirmation'
  },
  {
    pattern:/^WSSA0062$/i, baseReference:'WSSA0062',
    family:'Santos de Cartier Large', size:'39.8 mm class',
    calibre:['1847MC','1847 MC','CAL1847MC'], calibreDisplay:'Cartier 1847 MC',
    technology:'Automatic mechanical movement',
    notes:'Modern Santos de Cartier Large reference; calibre 1847 MC is expected.',
    source:'Cartier Santos reference records', confidence:'High confidence'
  },
  {
    pattern:/^WSSA0032$/i, baseReference:'WSSA0032',
    family:'Santos-Dumont XL', size:'approximately 33.9 × 46.6 mm',
    calibre:['430MC','430 MC','CAL430MC'], calibreDisplay:'Cartier 430 MC',
    technology:'Manual-winding mechanical movement',
    notes:'Santos-Dumont XL in steel. The submitted 430 MC is consistent.',
    source:'Cartier Santos-Dumont WSSA0032 records', confidence:'High confidence'
  }
);

TUDOR_REFERENCE_RULES.unshift(
  {
    pattern:/^M?79660(?:-\d{4})?$/i,
    family:'Black Bay 39', size:'39 mm',
    calibre:['MT5602'], reserve:'approximately 70 hours', production:'2023-present generation',
    notes:'Manufacture Calibre MT5602 (COSC) is the expected movement for reference 79660.',
    source:'TUDOR official Black Bay 31/36/39/41 technical sheet', confidence:'Official / high confidence'
  },
  {
    pattern:/^25827K$/i,
    family:'Possible transcription error — compare 25807KN Pelagos FXD Chrono', size:'do not infer',
    calibre:['MT5813'], reserve:'approximately 70 hours',
    notes:'25827K is not promoted to an exact Tudor reference. The observed MT5813 strongly points toward official reference 25807KN (Pelagos FXD Chrono, 43 mm). Re-check the case/reference engraving before using the mapping.',
    source:'TUDOR official Pelagos FXD Chrono 25807KN technical sheet', confidence:'Suspected transcription error; manual review required', manualReview:true
  },
  {
    pattern:/^2639W1A0$/i,
    family:'Unresolved Tudor transcription', size:'unknown',
    calibre:['MT5662'], reserve:'unknown',
    notes:'This submitted string does not match a confidently verified Tudor reference/calibre pair. Do not auto-map it. Re-check every character of the case reference and calibre.',
    source:'25 August 2026 queue cleaning', confidence:'Unresolved / manual review required', manualReview:true
  }
);

OTHER_REFERENCE_RULES.unshift(
  {
    brand:'Longines', pattern:/^L?2[.]?833[.]?4(?:[.]\d+)*$/i,
    family:'Longines reference stem L2.833.4', size:'variant-dependent', calibre:['L888.5','L8885'],
    technology:'Automatic mechanical movement', reserve:'approximately 72 hours',
    notes:'Submitted L888.5 is retained as compatible with this reference stem; preserve the complete suffix when available.',
    source:'Longines exact-reference records + workshop observation', confidence:'High-confidence stem/calibre mapping'
  },
  {
    brand:'Bell & Ross', pattern:/^BR03-92-S$/i,
    family:'BR 03-92', size:'42 mm', calibre:['BR-CAL.302','BRCAL302','302'],
    technology:'Automatic mechanical movement with date', reserve:'reference-generation dependent',
    notes:'BR03-92-S maps to the BR 03-92 family; BR-CAL.302 is expected.',
    source:'Bell & Ross BR03-92 reference records', confidence:'High confidence'
  },
  {
    brand:'TAG Heuer', pattern:/^WAR1115(?:[.-].*)?$/i,
    family:'Carrera Quartz', size:'39 mm', calibre:['QUARTZ','955.112','955112'],
    technology:'Quartz with date',
    notes:'Official TAG Heuer records identify WAR1115 as quartz. The workshop-observed 955.112 value is accepted as an internal movement identifier, but the app should describe the model as quartz rather than claim a modern TAG-branded calibre name.',
    source:'TAG Heuer official WAR1115 product page + workshop observation', confidence:'Official model/technology; observed movement identifier supported'
  },
  {
    brand:'Breitling', pattern:/^B12019$/i,
    family:'Navitimer Cosmonaute', size:'approximately 41–42 mm', calibre:['B12','CALB12','1873','LEMANIA1873'],
    technology:'Manual-winding 24-hour chronograph', reserve:'approximately 42 hours',
    notes:'Cleaned from submitted “187”: documented examples use Breitling B12 / Lemania 1873-family manual chronograph architecture.',
    source:'Documented B12019 movement inspections and auction records', confidence:'High confidence'
  },
  {
    brand:'Breitling', pattern:/^A17331$/i,
    family:'Avenger II Seawolf', size:'45 mm', calibre:['17','CAL17','2824-2','ETA2824-2'],
    technology:'Automatic mechanical movement', reserve:'approximately 42 hours',
    notes:'Breitling Calibre 17 / ETA 2824-2-family architecture is consistent with the submitted movement.',
    source:'Breitling reference records', confidence:'High confidence'
  },
  {
    brand:'Seiko', pattern:/^SLA043$/i,
    family:'Prospex 1965 Diver’s Re-Creation', size:'approximately 39.9 mm', calibre:['8L35','8L35B'],
    technology:'Automatic mechanical movement', reserve:'approximately 50 hours',
    notes:'SLA043 is the 1965 Diver’s re-creation generation using calibre 8L35.',
    source:'Seiko Prospex SLA043 technical records', confidence:'High confidence'
  },
  {
    brand:'Grand Seiko', pattern:/^SBGN005G?$/i,
    family:'Sport Collection quartz GMT', size:'39 mm class', calibre:['9F86','9F86A'],
    technology:'High-accuracy quartz GMT',
    notes:'Calibre 9F86 is expected for SBGN005.',
    source:'Grand Seiko SBGN005 technical records', confidence:'High confidence'
  },
  {
    brand:'Breitling', pattern:/^AB0139$/i,
    family:'Chronomat B01 42 family', size:'42 mm', calibre:['B01','CALB01','01'],
    technology:'Automatic manufacture chronograph', reserve:'approximately 70 hours',
    notes:'Reference stem AB0139 is a B01-powered Chronomat generation; preserve full suffix for exact dial/bracelet.',
    source:'Breitling reference/calibre records', confidence:'High confidence'
  },
  {
    brand:'Longines', pattern:/^L?2[.]?673[.]?4(?:[.]\d+)*$/i,
    family:'Master Collection Chronograph / Moonphase family', size:'variant-dependent', calibre:['L678.2','L6782'],
    technology:'Automatic chronograph calendar/moonphase movement', reserve:'approximately 42–48 hours',
    notes:'L2.673.4 stem is associated with the Master Collection complicated chronograph family. L678.2 is consistent.',
    source:'Longines Master Collection reference records', confidence:'High confidence'
  },
  {
    brand:'IWC', pattern:/^IW356811$/i,
    family:'Portofino Automatic', size:'40 mm', calibre:['30110','C.30110','CAL30110'],
    technology:'Automatic mechanical movement with date',
    notes:'IWC 30110-family movement is consistent with IW356811.',
    source:'IWC Portofino reference records', confidence:'High confidence'
  },
  {
    brand:'Bremont', pattern:/^AIRCO-M1-WH-R-S$/i,
    family:'AIRCO Mach 1', size:'40 mm class', calibre:['SW300-1','BE-92AE','2892-A2'],
    technology:'Automatic mechanical movement',
    notes:'AIRCO Mach 1 references are documented with Bremont-signed automatic movements based on thin Swiss architecture. A physically observed SW300-1 may reflect production/service variation; verify signed calibre and rotor before treating the base movement as definitive.',
    source:'Bremont AIRCO reference records + workshop observation', confidence:'Model mapping high; base calibre requires physical confirmation', manualReview:true
  },
  {
    brand:'Rolex', pattern:/^178240$/i,
    family:'Oyster Perpetual Datejust 31', size:'31 mm', calibre:['2235','CAL2235'],
    technology:'Automatic mechanical movement with date',
    notes:'Authenticator correction: calibre 2235 is compatible with Rolex reference 178240 and should no longer display as unknown.',
    source:'Rolex Datejust 31 reference/calibre records + authenticator observation', confidence:'High confidence'
  },
  {
    brand:'TAG Heuer', pattern:/^CAR2A8A(?:[.-].*)?$/i,
    family:'Carrera Heuer 01', size:'45 mm class', calibre:['HEUER01','HEUER 01','CALHEUER01'],
    technology:'Automatic manufacture chronograph', reserve:'approximately 50 hours',
    notes:'Heuer 01 is the expected movement family.',
    source:'TAG Heuer Carrera CAR2A8A reference records', confidence:'High confidence'
  },
  {
    brand:'Christopher Ward', pattern:/^(?:CHRISTOPHER\s*WARD\s*)?C60$/i,
    family:'C60 Trident — collection-level entry', size:'reference-dependent', calibre:['SW300-1'],
    technology:'Reference-dependent automatic movement',
    notes:'“Christopher Ward C60” is a collection/family label, not a unique reference. SW300-1 is plausible for selected premium/recent C60 variants but must not be applied to all C60 watches.',
    source:'Christopher Ward C60 range records', confidence:'Collection guidance only', manualReview:true, collectionOnly:true
  },
  {
    brand:'TAG Heuer', pattern:/^WAY201S(?:-\d)?$/i,
    family:'Aquaracer Calibre 5', size:'43 mm class', calibre:['5','CAL5','CALIBRE5'],
    technology:'Automatic mechanical movement with date',
    notes:'WAY201S and later caseback suffixes such as -0 refer to the same Aquaracer reference family; Calibre 5 is expected.',
    source:'TAG Heuer Aquaracer reference records', confidence:'High confidence'
  },
  {
    brand:'Longines', pattern:/^L?3[.]?720[.]?4(?:[.]\d+)*$/i,
    family:'Conquest automatic family', size:'reference-dependent', calibre:['L888.5','L8885'],
    technology:'Automatic mechanical movement', reserve:'approximately 72 hours',
    notes:'L3.720.4 stem accepted with L888.5; preserve the full suffix for exact dial/bracelet.',
    source:'Longines Conquest reference records + workshop observation', confidence:'High-confidence stem/calibre mapping'
  },
  {
    brand:'TAG Heuer', pattern:/^WAY2013(?:-\d)?$/i,
    family:'Aquaracer Calibre 5', size:'43 mm class', calibre:['5','CAL5','CALIBRE5'],
    technology:'Automatic mechanical movement with date',
    notes:'Calibre 5 is expected for genuine examples. Authenticator note from 25 Aug 2026: serial WTQ5427 was observed on a known replica. Treat a matching reference+serial as a high-risk warning requiring escalation; serial reuse means this is not, by itself, a universal counterfeit verdict.',
    source:'TAG Heuer Aquaracer reference records + internal authenticator replica observation', confidence:'High-confidence model mapping; replica serial note is internal evidence'
  },
  {
    brand:'Oris', pattern:/^(?:01\s*)?400\s*7778(?:\s*7150.*)?$/i,
    family:'ProPilot X Calibre 400', size:'39 mm', calibre:['400','400-2','CAL400','CAL400-2'],
    technology:'Automatic high-antimagnetic movement', reserve:'approximately 120 hours',
    notes:'Reference stem 400 7778 is ProPilot X Calibre 400. A 400-2 revision is compatible with later production/service examples; confirm movement marking.',
    source:'Oris official ProPilot X 400 7778 documentation + workshop observation', confidence:'Official family mapping'
  },
  {
    brand:'SCHOFIELD', pattern:/^SCHOFIELD\s*SIGNALMAN$/i,
    family:'Signalman', size:'reference-generation dependent', calibre:['A10-2','A102','SOPRODA10-2'],
    technology:'Automatic mechanical movement',
    notes:'A102 is cleaned to Soprod A10-2-family notation for matching; exact Signalman edition should be recorded where known.',
    source:'Schofield Signalman movement/reference records', confidence:'Family/calibre guidance'
  },
  {
    brand:'NIVADA', pattern:/^CHRONOMASTER\s*AVIATOR\s*SEA\s*DIVER$/i,
    family:'Chronomaster Aviator Sea Diver — collection-level entry', size:'reference-dependent', calibre:['SW510','SW510M','SW510BH'],
    technology:'Mechanical chronograph; winding system depends on exact calibre/reference',
    notes:'Collection name only. SW510-family movements are used in modern Chronomaster variants, but exact winding type and specification require the complete reference.',
    source:'Nivada Grenchen Chronomaster technical records', confidence:'Collection guidance only', manualReview:true, collectionOnly:true
  },
  {
    brand:'MONTBLANC', pattern:/^7138$/i,
    family:'TimeWalker chronograph family', size:'reference-generation dependent', calibre:['MBR200','MB R 200','R200'],
    technology:'Automatic chronograph',
    notes:'Reference 7138 with observed MB R 200 is retained as a high-value exact workshop mapping; verify dial/case variant physically.',
    source:'Montblanc TimeWalker reference records + workshop observation', confidence:'High-confidence model/calibre compatibility'
  },
  {
    brand:'Grand Seiko', pattern:/^SBGA211G?$/i,
    family:'Heritage Collection “Snowflake”', size:'41 mm', calibre:['9R65','9R65A'],
    technology:'Spring Drive automatic winding', reserve:'approximately 72 hours',
    notes:'9R65 is the expected movement for SBGA211/SBGA211G.',
    source:'Grand Seiko official SBGA211 technical records', confidence:'Official / high confidence'
  },
  {
    brand:'HAMILTON', pattern:/^H706750$/i,
    family:'Khaki Field automatic family', size:'42 mm class', calibre:['2824-2','ETA2824-2','H-10'],
    technology:'Automatic mechanical movement',
    notes:'The submitted “C07611+” appears to be a movement/bridge production marking rather than a usable calibre designation. Do not store it as the calibre. Confirm whether the individual watch is the earlier ETA 2824-2 generation or a later H-10 service/configuration.',
    source:'Hamilton H706750 reference records + queue cleaning', confidence:'Model mapping supported; exact movement generation requires review', manualReview:true
  },
  {
    brand:'Breitling', pattern:/^A17316$/i,
    family:'Superocean Automatic 36 family', size:'36 mm', calibre:['SW200-1','17','CAL17'],
    technology:'Automatic mechanical movement', reserve:'approximately 38–42 hours',
    notes:'Documented A17316 examples use Sellita SW200-1 / Breitling Calibre 17-family architecture.',
    source:'Documented A17316 movement inspection', confidence:'High confidence'
  },
  {
    brand:'Breitling', pattern:/^A17376$/i,
    family:'Superocean Automatic 44', size:'44 mm', calibre:['SW200-1','17','CAL17'],
    technology:'Automatic mechanical movement', reserve:'approximately 38–42 hours',
    notes:'Documented A17376 examples use Sellita SW200-1 / Breitling Calibre 17-family architecture.',
    source:'Documented A17376 movement inspection', confidence:'High confidence'
  },
  {
    brand:'Breitling', pattern:/^AB0138$/i,
    family:'Navitimer B01 Chronograph 43', size:'43 mm', calibre:['B01','CALB01','01'],
    technology:'Automatic manufacture chronograph', reserve:'approximately 70 hours',
    notes:'B01 is expected for AB0138.',
    source:'Breitling Navitimer AB0138 reference records', confidence:'High confidence'
  },
  {
    brand:'Breitling', pattern:/^A17392$/i,
    family:'Superocean automatic family', size:'reference-generation dependent', calibre:['2824-2','ETA2824-2','17','CAL17'],
    technology:'Automatic mechanical movement', reserve:'approximately 38–42 hours',
    notes:'Submitted ETA 2824-2 is compatible with Breitling Calibre 17 architecture used in this generation. Preserve full suffix when available.',
    source:'Breitling Superocean reference records + workshop observation', confidence:'High-confidence movement-family compatibility'
  },
  {
    brand:'TAG Heuer', pattern:/^CAW2111(?:-\d)?(?:[.].*)?$/i,
    family:'Monaco Calibre 12', size:'39 mm', calibre:['12','CAL12','CALIBRE12'],
    technology:'Automatic chronograph', reserve:'approximately 40 hours',
    notes:'CAW2111-1 is a later iteration of the Monaco Calibre 12 reference; calibre 12 is expected.',
    source:'TAG Heuer official CAW2111 product record', confidence:'Official / high confidence'
  },
  {
    brand:'TAG Heuer', pattern:/^WBD1423(?:[.].*)?$/i,
    family:'Aquaracer Date Quartz', size:'27 mm', calibre:['QUARTZ'],
    technology:'Quartz with date',
    notes:'Official records identify WBD1423 as quartz. The submitted “775” should NOT be stored as the model calibre without separate physical evidence.',
    source:'TAG Heuer official WBD1423 product page', confidence:'Official / high confidence'
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^250[.]8[.]86$/i,
    family:'Reverso Classique', size:'approximately 23.5 × 39 mm', calibre:['846/1','8461','CAL846/1'],
    technology:'Manual-winding mechanical movement', reserve:'approximately 45 hours',
    notes:'This queue row was misclassified as Generic. It is a Jaeger-LeCoultre Reverso Classique reference; calibre 846/1 is documented.',
    source:'Documented JLC 250.8.86 reference/movement records', confidence:'High confidence'
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^234[.]8[.]47$/i,
    family:'Reverso Squadra', size:'approximately 29 × 33 mm', calibre:['657','CAL657'],
    technology:'Quartz',
    notes:'Documented reference 234.8.47 uses JLC calibre 657 quartz.',
    source:'Documented JLC auction/reference record', confidence:'High confidence'
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^142[.]8[.]29$/i,
    family:'Master Geographic', size:'reference-generation dependent', calibre:['939','CAL939'],
    technology:'Automatic mechanical world-time / second-time-zone movement',
    notes:'Reference 142.8.29 is documented with updated calibre 939.',
    source:'Documented JLC 142.8.29 movement record', confidence:'High confidence'
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^213[.]8[.]D4$/i,
    family:'Jaeger-LeCoultre reference recorded — unresolved exact mapping', size:'unknown', calibre:[],
    technology:'Unknown pending verification',
    notes:'Reference retained for queue recognition, but no sufficiently reliable exact model/calibre mapping was established in this research pass. Manual review remains required.',
    source:'25 August 2026 queue cleaning', confidence:'Unresolved / manual review required', manualReview:true
  },
  {
    brand:'Christopher Ward', pattern:/^TRIDENT\s*LUMIERE$/i,
    family:'C60 Trident Lumière', size:'41 mm class', calibre:['SW300-1'],
    technology:'Automatic COSC chronometer movement',
    notes:'Trident Lumière family uses Sellita SW300-1 COSC architecture. Record the complete SKU/reference when available.',
    source:'Christopher Ward Trident Lumière technical records', confidence:'High-confidence family/calibre mapping'
  },
  {
    brand:'SWATCH', pattern:/^(?:AP\s*X\s*SWATCH\s*)?ROYAL\s*POP$/i,
    family:'Audemars Piguet × Swatch Royal Pop', size:'40 mm pocket watch',
    calibre:['SISTEM51','MANUAL SISTEM51'], technology:'Hand-wound SISTEM51 mechanical movement', reserve:'approximately 90 hours',
    notes:'Royal Pop is a 2026 pocket-watch collaboration, not a conventional wristwatch. The submitted “V8EF29” should be treated as an individual identifier/production code, not the calibre.',
    source:'2026 Royal Pop launch coverage and specifications', confidence:'High-confidence collection/technology mapping'
  },
  {
    brand:'Generic', pattern:/^MONTBLANC$/i,
    family:'Invalid reference entry — brand name entered as reference', size:'n/a', calibre:[],
    technology:'n/a',
    notes:'Cleaned as a data-entry error. “MONTBLANC” is a brand, not a model reference. Re-enter the actual Montblanc reference from the case/papers.',
    source:'25 August 2026 queue cleaning', confidence:'Input error', manualReview:true
  },
  {
    brand:'Breitling', pattern:/^BREITLING\s*SUPER\s*OCEAN$/i,
    family:'Superocean — collection-level entry', size:'reference-dependent', calibre:['SW200-1','17','CAL17'],
    technology:'Reference-dependent automatic movement',
    notes:'Collection name only. SW200-1 is plausible for many modern Superocean references, but the exact reference must be entered before model-specific authentication guidance is shown.',
    source:'Breitling Superocean movement/reference records', confidence:'Collection guidance only', manualReview:true, collectionOnly:true
  }
);
