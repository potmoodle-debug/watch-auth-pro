/*
 Watch Auth Pro researched queue update
 Version 2.65.0 — 20 August 2026
 Source batch: watch-auth-pro-missing-references-v2.61.0 (1).csv
*/

DATABASE_META.version = '2.65.0';
DATABASE_META.updated = '20 August 2026';
DATABASE_META.scope = '20 August 2026 missing-reference queue: 24 researched mappings covering Omega, Cartier, Tudor, Longines, Breitling, TAG Heuer and additional brands, with collection-level cautions retained where exact references are absent';

OMEGA_REFERENCE_RULES.unshift(
    {
        pattern: /^(?:OMEGA\s*)?SEAMASTER\s*300$/i,
        family: 'Seamaster 300 — collection-level entry', size: 'reference-dependent',
        calibre: ['2500','8400','8912'], reserve: 'reference-dependent',
        technology: 'Automatic Co-Axial movement; exact generation depends on the full PIC/case reference',
        certification: 'Generation-dependent: earlier Calibre 2500 models are COSC; later references may be Master Co-Axial / Master Chronometer',
        notes: '“Omega Seamaster 300” is a model-family entry rather than a complete PIC reference. The submitted Calibre 2500 is plausible for an earlier Co-Axial Seamaster 300-family watch, but do not assign exact case size, dial, bezel or production period without the full reference.',
        source: 'OMEGA Seamaster 300 product/calibre records', confidence: 'Collection/calibre guidance only; exact reference required', manualReview: true, collectionOnly: true
    },
    {
        refs: ['2253.80.00','2253.80','22538000'],
        family: 'Seamaster Professional Diver 300M Midsize — blue', size: '36.25 mm', calibre: ['1120','CAL1120'],
        technology: 'Automatic COSC chronometer with date', reserve: 'approximately 44 hours',
        certification: 'COSC chronometer; pre-METAS generation',
        notes: 'Steel midsize Diver 300M with blue dial/bezel, helium escape valve, sapphire crystal and 300 m water resistance. Calibre 1120 is consistent.',
        source: 'OMEGA archived product specification for 2253.80.00', confidence: 'Official / high confidence'
    },
    {
        refs: ['210.30.42.20.03.003','21030422003003'],
        family: 'Seamaster Diver 300M 75th Anniversary “Summer Blue”', size: '42 mm', calibre: ['8800','CAL8800'],
        technology: 'Automatic Co-Axial Master Chronometer with date', reserve: 'approximately 55 hours',
        certification: 'METAS Master Chronometer; anti-magnetic to 15,000 gauss',
        notes: 'Steel 42 mm Summer Blue anniversary execution with gradient blue dial, blue ceramic bezel, helium escape valve and 300 m water resistance. Calibre 8800 is expected.',
        source: 'OMEGA 75th Anniversary Diver 300M specifications', confidence: 'Official / high confidence'
    },
    {
        refs: ['210.20.42.20.01.001','21020422001001'],
        family: 'Seamaster Diver 300M — steel and Sedna Gold / black dial', size: '42 mm', calibre: ['8800','CAL8800'],
        technology: 'Automatic Co-Axial Master Chronometer with date', reserve: 'approximately 55 hours',
        certification: 'METAS Master Chronometer; anti-magnetic to 15,000 gauss',
        notes: 'Two-tone steel and 18K Sedna Gold Diver 300M with black dial/bezel, helium escape valve and 300 m water resistance. Calibre 8800 is consistent. Confirm the full PIC because bracelet/strap variants are suffix-specific.',
        source: 'OMEGA Diver 300M reference specifications', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        refs: ['3513.50.00','3513.50','35135000'],
        family: 'Speedmaster Date — black dial', size: 'approximately 39 mm', calibre: ['1152','CAL1152'],
        technology: 'Automatic chronograph with date', reserve: 'approximately 44 hours',
        certification: 'Period automatic chronograph; not METAS certified',
        notes: 'Steel Speedmaster Date with black dial, three-register chronograph and tachymeter bezel. Calibre 1152 is consistent.',
        source: 'OMEGA archived product specification for 3513.50.00', confidence: 'Official / high confidence'
    }
);

CARTIER_REFERENCE_RULES.unshift(
    {
        pattern: /^W2020008$/i, baseReference: 'W2020008', family: 'Santos 100 Medium / MM — steel', size: 'approximately 32 × 44 mm',
        calibre: ['076','CAL076','2671','ETA2671'], calibreDisplay: 'Cartier Calibre 076 (ETA 2671 base)', technology: 'Automatic mechanical movement',
        caseDetails: 'Stainless-steel Santos 100 case; sapphire crystal; approximately 100 m water resistance',
        dialDetails: 'Black dial with Roman-numeral Santos layout',
        notes: 'Calibre 076 is consistent with this reference. Confirm movement signature, crown/cabochon, bezel screws and caseback markings physically.',
        source: 'Cartier/Santos 100 exact-reference records and Cartier 076 movement documentation', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        pattern: /^WSTA0018$/i, baseReference: 'WSTA0018', family: 'Tank Américaine Large / GM — steel', size: 'approximately 45.1 × 26.6 mm',
        calibre: ['076','CAL076','2671','ETA2671'], calibreDisplay: 'Cartier Calibre 076 / ETA 2671 base', technology: 'Automatic mechanical movement',
        caseDetails: 'Elongated stainless-steel Tank Américaine case, curved sapphire crystal, leather strap; approximately 30 m water resistance',
        dialDetails: 'Silver/white Roman-numeral dial with blued sword hands',
        notes: 'The submitted Calibre 076 is compatible with documented WSTA0018 examples using the ETA 2671 architecture. Confirm the physical movement marking because service history can affect the exact signed calibre.',
        source: 'Cartier Tank Américaine exact-reference records and documented movement inspections', confidence: 'High-confidence model/calibre compatibility'
    },
    {
        pattern: /^WSBB0031$/i, baseReference: 'WSBB0031', family: 'Ballon Bleu de Cartier 33 mm — pink dial', size: '33 mm',
        calibre: ['076','CAL076','2671','ETA2671'], calibreDisplay: 'Cartier Calibre 076 (ETA 2671 base)', technology: 'Automatic mechanical movement',
        caseDetails: 'Stainless-steel round Ballon Bleu case with integrated crown guard and sapphire crystal; approximately 30 m water resistance',
        dialDetails: 'Pink dial with Roman numerals and blued sword hands',
        notes: 'Calibre 076 is consistent with this 33 mm automatic generation. Confirm movement signature and caseback reference physically.',
        source: 'Cartier Ballon Bleu exact-reference records and Cartier 076 movement documentation', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        pattern: /^WSSA0061$/i, baseReference: 'WSSA0061', family: 'Santos de Cartier Medium — green dial', size: '35.1 mm case width',
        calibre: ['1847MC','1847 MC','CAL1847MC'], calibreDisplay: 'Cartier 1847 MC', technology: 'Automatic mechanical movement',
        caseDetails: 'Stainless-steel Santos case and bracelet with QuickSwitch/SmartLink systems; approximately 100 m water resistance',
        dialDetails: 'Graduated green dial with Roman numerals and sword hands',
        notes: 'Calibre 1847 MC is expected. Confirm the full WSSA0061 reference, green dial and bracelet/strap configuration.',
        source: 'Cartier official WSSA0061 product specifications', confidence: 'Official / high confidence'
    }
);

TUDOR_REFERENCE_RULES.unshift(
    {
        pattern: /^M?25500T(?:N)?(?:-\d{4})?$/i, family: 'Pelagos — first-generation ETA-based', size: '42mm',
        calibre: ['2824-2','ETA2824-2'], reserve: 'approximately 38–42 hours', production: 'approximately 2012–2015', era: 'first-generation Pelagos before MT5612 manufacture calibre',
        notes: 'Titanium 500 m Pelagos with helium escape valve and date. Reference 25500T is the earlier ETA-based generation; do not confuse it with later 25600TN manufacture-calibre watches.',
        source: 'TUDOR Pelagos reference history and documented 25500T movement inspections', confidence: 'High-confidence reference/calibre match'
    },
    {
        pattern: /^M?25707K?N?(?:-\d{4})?$/i, family: 'Pelagos FXD Alinghi Red Bull Racing Edition', size: '42mm',
        calibre: ['MT5602'], reserve: 'approximately 70 hours', production: '2023–present', era: 'carbon-composite fixed-bar Pelagos FXD generation',
        notes: 'Official reference is M25707KN-0001. A workshop entry of 25707K is accepted as a shortened transcription, but confirm the final N and full configuration suffix. Matte black carbon-composite case, titanium bezel, blue dial, fixed bars, 200 m water resistance and COSC MT5602 are expected.',
        source: 'TUDOR official Pelagos FXD Alinghi Red Bull Racing technical specifications', confidence: 'Official model/calibre mapping; shortened transcription supported'
    },
    {
        pattern: /^M?35200(?:-\d{4})?$/i, family: 'Clair de Rose 26', size: '26mm',
        calibre: ['2671','ETA2671'], reserve: 'approximately 38–44 hours', production: 'reference-generation dependent', era: 'ETA-based Clair de Rose generation',
        notes: 'Steel 26 mm Clair de Rose with date and 100 m water resistance. Multiple dial/bracelet suffixes exist, so use 35200 as the model stem and preserve the full configuration suffix when available.',
        source: 'TUDOR Clair de Rose reference records and ETA 2671 movement documentation', confidence: 'High-confidence model-stem/calibre mapping'
    }
);

OTHER_REFERENCE_RULES.unshift(
    {
        brand: 'Jaeger-LeCoultre', pattern: /^(?:JUMBO\s*)?MEMOVOX$/i,
        family: 'Memovox Date “Jumbo” — likely E855/855 family', size: 'approximately 37 mm', calibre: ['K825','825'],
        technology: 'Bumper automatic mechanical alarm with date', reserve: 'period movement; verify physical condition',
        notes: '“Jumbo Memovox” is a collector/family description rather than a unique case reference. Calibre K825 strongly supports the 1960s Memovox Date E855/855 family, but verify the inner caseback reference before assigning an exact execution.',
        source: 'Jaeger-LeCoultre Memovox reference/calibre documentation', confidence: 'Family/calibre guidance; exact case reference required', manualReview: true, familyOnly: true
    },
    {
        brand: 'Oris', pattern: /^7741-31$/i,
        family: 'Big Crown Pointer Date 80th Anniversary Edition', size: '40 mm', calibre: ['754','ORIS754','SW200-1'],
        technology: 'Automatic mechanical movement with pointer date', reserve: 'approximately 38–41 hours',
        notes: 'Bronze 40 mm anniversary Big Crown Pointer Date with green dial. Oris Calibre 754 is based on the Sellita SW200-1 architecture and is consistent with the submitted movement.',
        source: 'Oris Big Crown Pointer Date 80th Anniversary specifications', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        brand: 'Audemars Piguet', pattern: /^(?:AUDEMARS\s*PIGUET\s*)?PROMESSE$/i,
        family: 'Promesse — collection-level entry', size: 'reference-dependent', calibre: ['QUARTZ'],
        technology: 'Collection includes multiple predominantly quartz dress-watch executions',
        notes: '“Audemars Piguet Promesse” is a collection name, not a unique reference. The submitted case/serial E44893 is not sufficient to assign an exact Promesse reference, metal, dimensions or calibre. Record the complete case/model reference before exact mapping.',
        source: 'Audemars Piguet Promesse auction and catalogue records', confidence: 'Collection guidance only; exact reference required', manualReview: true, familyOnly: true
    },
    {
        brand: 'Breitling', pattern: /^A16362$/i,
        family: 'Bentley Flying B / Flying B No. 3 family', size: 'approximately 36 × 51 mm', calibre: ['2892','2892-A2','ETA2892-A2'],
        technology: 'Automatic mechanical big-date watch based on ETA 2892-family architecture', reserve: 'approximately 42 hours',
        notes: 'Reference A16362 maps to the rectangular/tonneau Bentley Flying B family. Confirm the exact dial and Breitling-signed movement/calibre designation because variants exist within the reference family.',
        source: 'Breitling Bentley Flying B exact-reference records', confidence: 'High-confidence model mapping; signed calibre requires physical confirmation'
    },
    {
        brand: 'Longines', pattern: /^L?2[. ]?838[. ]?4(?:[. ]?\d{2}[. ]?\d)?$/i,
        family: 'Pilot Majetek', size: '43 mm', calibre: ['L893.6','L8936'],
        technology: 'Automatic COSC chronometer with small seconds and rotating starting-time indicator', reserve: 'approximately 72 hours',
        notes: 'L2.838.4 is the Pilot Majetek model stem. Full variants include references such as L2.838.4.53.0/.2/.8/.9. Calibre L893.6, silicon balance spring, 100 m water resistance and COSC certification are expected.',
        source: 'Longines Pilot Majetek technical specifications and exact-reference records', confidence: 'High-confidence model-stem/calibre mapping'
    },
    {
        brand: 'Citizen', pattern: /^A060-A1CT403$/i,
        family: 'The CITIZEN — Iconic Nature Collection “Wind”', size: 'reference-specific', calibre: ['A060','A060H'],
        technology: 'Eco-Drive high-accuracy quartz', reserve: 'solar powered; model-specific reserve',
        notes: 'A060-family high-accuracy Eco-Drive movement; annual accuracy is approximately ±5 seconds under specified conditions. Confirm the exact case/dial execution against the case code.',
        source: 'Citizen A060 technical documentation and The CITIZEN reference records', confidence: 'High-confidence exact case/reference mapping'
    },
    {
        brand: 'Breitling', pattern: /^AB0110$/i,
        family: 'Chronomat 01 / Chronomat 44', size: 'approximately 43.5–44 mm', calibre: ['B01','CALB01','01'],
        technology: 'Automatic manufacture column-wheel chronograph with date', reserve: 'approximately 70 hours',
        notes: 'AB0110 is an early Chronomat 01 / later Chronomat 44 reference stem using Breitling Manufacture Calibre B01. Exact dial, bezel and bracelet configuration depends on the full suffix.',
        source: 'Breitling Chronomat 01 reference and B01 calibre documentation', confidence: 'High-confidence reference/calibre match'
    },
    {
        brand: 'Chopard', pattern: /^8331$/i,
        family: 'Mille Miglia chronograph', size: 'approximately 39 mm', calibre: ['2894-2','ETA2894-2'],
        technology: 'Automatic modular chronograph with date', reserve: 'approximately 42 hours',
        notes: 'Reference 8331 belongs to the Mille Miglia automatic chronograph family. Multiple dial and limited-edition variants exist, so do not infer a specific edition from the four-digit reference alone.',
        source: 'Chopard Mille Miglia 8331 auction/reference records', confidence: 'High-confidence family/reference match'
    },
    {
        brand: 'TAG Heuer', pattern: /^CR2080(?:\.FC6375)?$/i,
        family: 'Heritage Monza 40th Anniversary', size: '42 mm', calibre: ['17','CAL17','CALIBRE17'],
        technology: 'Automatic chronograph with date', reserve: 'approximately 42 hours',
        notes: 'CR2080 is the model stem; the full 2016 heritage reference is CR2080.FC6375. Black PVD-coated titanium case, black dial and Calibre 17 are expected.',
        source: 'TAG Heuer official CR2080.FC6375 specifications', confidence: 'Official / high confidence'
    },
    {
        brand: 'Bremont', pattern: /^(?:BREMONT\s*)?S300$/i,
        family: 'Supermarine S300 — collection/model family', size: 'generation-dependent', calibre: ['SW300-1','SELLITASW300-1'],
        technology: 'Automatic dive watch', reserve: 'generation-dependent',
        notes: '“Bremont S300” identifies the Supermarine S300 family but not the exact dial/strap suffix. Earlier S300 executions are documented with a modified Sellita SW300-1 base. Record the complete reference/variant before assigning exact exterior specifications.',
        source: 'Bremont Supermarine S300 product history and movement specifications', confidence: 'Family-level movement guidance; exact variant required', manualReview: true, familyOnly: true
    },
    {
        brand: 'TAG Heuer', pattern: /^CAR2C11(?:-0|\.FC6327)?$/i,
        family: 'Carrera Calibre 1887 Jack Heuer 50th Anniversary “Bullhead”', size: '45 mm', calibre: ['1887','CAL1887','CALIBRE1887'],
        technology: 'Automatic chronograph with date', reserve: 'approximately 50 hours',
        notes: 'CAR2C11-0 is a case/model marking for the Jack Heuer 50th Anniversary bullhead Carrera; the full strap reference is commonly CAR2C11.FC6327. Calibre 1887 is expected.',
        source: 'TAG Heuer Carrera Jack Heuer 50th Anniversary reference records', confidence: 'High-confidence exact model/calibre match'
    },
    {
        brand: 'TAG Heuer', pattern: /^CV2A10(?:\.[A-Z0-9]+)?$/i,
        family: 'Carrera Calibre 16 Day-Date 43', size: '43 mm', calibre: ['16','CAL16','CALIBRE16','7750','ETA7750'],
        technology: 'Automatic chronograph with day/date', reserve: 'approximately 42 hours',
        notes: 'CV2A10 is the model stem; bracelet/strap suffixes such as BA0796 or FC6235 identify the exterior configuration. Black dial, tachymeter bezel and Calibre 16 day-date architecture are expected.',
        source: 'TAG Heuer Carrera CV2A10 reference records', confidence: 'High-confidence model-stem/calibre match'
    }
);

// Support historical workshop brand labels that may be typed as HEUER rather than TAG Heuer.
OTHER_REFERENCE_RULES.unshift({
    brand: 'HEUER', pattern: /^CR2080(?:\.FC6375)?$/i,
    family: 'TAG Heuer Heritage Monza 40th Anniversary', size: '42 mm', calibre: ['17','CAL17','CALIBRE17'],
    technology: 'Automatic chronograph with date', reserve: 'approximately 42 hours',
    notes: 'CR2080 is the model stem; full reference CR2080.FC6375. This alias exists so a workshop brand entry of HEUER resolves to the same researched model.',
    source: 'TAG Heuer official CR2080.FC6375 specifications', confidence: 'Official / high confidence'
});
