/*
 Watch Auth Pro researched queue update
 Version 2.62.0 — 18 August 2026
 Source batch: watch-auth-pro-missing-references-v2.61.0.csv
*/

DATABASE_META.version = '2.62.0';
DATABASE_META.updated = '18 August 2026';
DATABASE_META.scope = '18 August 2026 missing-reference queue: exact Omega, Cartier and Tudor mappings; shortened-reference aliases; and repaired Christopher Ward and collection-name lookup paths';

// Dedicated Omega mode only reads OMEGA_REFERENCE_RULES. Some earlier records
// existed in OTHER_REFERENCE_RULES and were therefore invisible in Omega mode.
OMEGA_REFERENCE_RULES.unshift(
    {
        refs: ['2909.50.91', '29095091'],
        family: 'Seamaster Planet Ocean 600M Co-Axial', size: '42 mm', calibre: ['2500'],
        technology: 'Automatic Co-Axial chronometer with date', reserve: 'approximately 48 hours',
        certification: 'COSC chronometer; generation predates METAS Master Chronometer certification',
        notes: 'Steel 42 mm first-generation Planet Ocean with black dial, orange diving bezel, helium escape valve and rubber strap configuration. Water resistance is 600 m. Confirm the complete caseback reference and Calibre 2500 execution.',
        source: 'OMEGA Planet Ocean generation records and WatchBase exact-reference specifications', confidence: 'High-confidence exact-reference cross-check'
    },
    {
        refs: ['231.20.42.21.06.001', '23120422106001'],
        family: 'Seamaster Aqua Terra 150M Co-Axial', size: '41.5 mm', calibre: ['8500'],
        technology: 'Automatic Co-Axial movement with date and independently adjustable hour hand', reserve: 'approximately 60 hours',
        certification: 'COSC chronometer; pre-METAS Aqua Terra generation',
        notes: 'Steel and 18K red-gold two-tone Aqua Terra with grey teak-pattern dial and matching two-tone bracelet. Water resistance is 150 m. Confirm dial, bracelet and metal configuration against the complete PIC reference.',
        source: 'OMEGA Aqua Terra reference specifications and exact-reference records', confidence: 'High-confidence exact-reference cross-check'
    },
    {
        refs: ['220.22.41.21.02.001', '22022412102001'],
        family: 'Seamaster Aqua Terra 150M Master Chronometer', size: '41 mm', calibre: ['8900'],
        technology: 'Automatic Co-Axial Master Chronometer with date and independently adjustable hour hand', reserve: 'approximately 60 hours',
        certification: 'METAS Master Chronometer; resistant to magnetic fields to 15,000 gauss',
        notes: 'Steel and Sedna Gold case, silver horizontal teak-pattern dial and rubber-strap configuration. Water resistance is 150 m. Confirm the full PIC reference and exterior configuration.',
        source: 'OMEGA Aqua Terra product specifications and authorised-retailer exact-reference records', confidence: 'Official/high-confidence exact-reference cross-check'
    },
    {
        refs: ['3573.50', '3573.50.00', '35735000'],
        family: 'Speedmaster Professional Moonwatch “Sapphire Sandwich”', size: '42 mm', calibre: ['1863'],
        technology: 'Manual-winding chronograph with display-caseback movement finishing', reserve: 'approximately 48 hours',
        certification: 'Not a Master Chronometer; period Moonwatch chronograph generation',
        notes: 'Sapphire front crystal and sapphire display caseback distinguish this reference from the Hesalite-front 3570.50. Verify the black dial, tachymeter bezel and Calibre 1863 finishing.',
        source: 'OMEGA Speedmaster technical records and WatchBase exact-reference specifications', confidence: 'High-confidence exact-reference cross-check'
    },
    {
        refs: ['3820.53.26', '38205326'],
        family: 'Speedmaster Day-Date Mk40', size: 'approximately 39 mm', calibre: ['1151'],
        technology: 'Automatic chronograph with day, date, month and 24-hour display', reserve: 'approximately 42 hours',
        certification: 'Period automatic chronograph; not METAS certified',
        notes: 'Grey/anthracite Mk40 multi-scale dial, tachymeter bezel and leather-strap configuration. Calibre 1151 is based on the ETA-Valjoux 7751 architecture. Confirm calendar operation and exact dial/caseback execution.',
        source: 'OMEGA Speedmaster Mk40 reference records and specialist technical coverage', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        refs: ['3570.50', '3570.50.00', '35705000'],
        family: 'Speedmaster Professional Moonwatch', size: '42 mm', calibre: ['1861'],
        technology: 'Manual-winding chronograph', reserve: 'approximately 48 hours',
        certification: 'Not a Master Chronometer; period Moonwatch chronograph generation',
        notes: 'Hesalite-front Moonwatch with solid caseback in the standard configuration. Confirm the full reference, black dial, tachymeter bezel and Calibre 1861.',
        source: 'OMEGA Speedmaster technical records and WatchBase exact-reference specifications', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        refs: ['145.022-69', '14502269'],
        family: 'Vintage Speedmaster Professional 145.022-69', size: 'approximately 42 mm', calibre: ['861'],
        technology: 'Manual-winding cam-switched chronograph', reserve: 'approximately 48 hours',
        certification: 'Vintage pre-METAS chronograph generation',
        notes: 'The “-69” is a case-reference revision, not a guaranteed assembly year. Dial, bezel, caseback and bracelet details vary within the production run; compare the 30.5 million movement serial with period-specific Speedmaster records rather than the generic Omega sequence.',
        source: 'OMEGA vintage Speedmaster records, Speedmaster101 and specialist 145.022-69 documentation', confidence: 'High-confidence vintage reference/calibre match'
    },
    {
        pattern: /^(?:OMEGA\s*)?PLANET\s*OCEAN$/i,
        family: 'Seamaster Planet Ocean — collection-level entry', size: 'model-dependent',
        calibre: ['2500','8500','8501','8900','8901','9900','9901'], reserve: 'reference-dependent',
        technology: 'Collection spans automatic time/date and automatic chronograph executions',
        certification: 'Generation-dependent: COSC on earlier models; METAS Master Chronometer on many later models',
        notes: '“Planet Ocean” is a collection name, not a complete reference. Calibre 9900 is plausible for modern Planet Ocean chronographs, while earlier and time/date models use different calibres. Record the full PIC/case reference before assigning exact specifications.',
        source: 'OMEGA Planet Ocean product and calibre specifications', confidence: 'Collection/calibre guidance only; exact reference required', manualReview: true, collectionOnly: true
    },
    {
        pattern: /^(?:OMEGA\s*)?RAILMASTER$/i,
        family: 'Seamaster Railmaster — collection-level entry', size: 'generation-dependent; commonly 38–40 mm',
        calibre: ['8806','8804','8912'], reserve: 'approximately 55–60 hours depending on exact calibre',
        technology: 'Automatic Co-Axial Master Chronometer, generally no date',
        certification: 'METAS Master Chronometer on modern executions; anti-magnetic to 15,000 gauss',
        notes: '“Railmaster” is a collection name rather than a complete reference. Calibre 8806 is consistent with central-seconds modern Railmaster models, but the exact generation, size, dial and strap or bracelet require the full PIC reference.',
        source: 'OMEGA Railmaster product specifications and authorised-retailer technical records', confidence: 'Collection/calibre guidance only; exact reference required', manualReview: true, collectionOnly: true
    },
    {
        pattern: /^(?:OMEGA\s*)?AQUA\s*TERRA$/i,
        family: 'Seamaster Aqua Terra — collection-level entry', size: 'model-dependent',
        calibre: ['1538','8500','8501','8800','8801','8900','8901'], reserve: 'battery powered or approximately 55–60 hours depending on exact calibre',
        technology: 'Collection spans quartz and automatic Co-Axial watches',
        certification: 'Reference-dependent; many modern automatic executions are METAS Master Chronometers',
        notes: '“Aqua Terra” is not a complete reference. Calibre 1538 is plausible for earlier quartz Aqua Terra executions, while modern automatic models use 8xxx families. Record the complete PIC/case reference before assigning exact specifications.',
        source: 'OMEGA Aqua Terra collection and calibre specifications', confidence: 'Collection/calibre guidance only; exact reference required', manualReview: true, collectionOnly: true
    }
);

CARTIER_REFERENCE_RULES.unshift(
    {
        pattern: /^W20056D6$/i, baseReference: 'W20056D6', family: 'Santos Galbée Small — steel', size: 'approximately 34.8 × 26.2 mm',
        calibre: ['157','QUARTZ'], calibreDisplay: 'Cartier quartz Calibre 157', technology: 'Two-hand analogue quartz',
        caseDetails: 'Stainless-steel Santos Galbée case and integrated bracelet; sapphire crystal; approximately 30 m water resistance',
        dialDetails: 'Silver/white Roman-numeral dial with blued sword hands',
        notes: 'Calibre 157 is consistent. Confirm case dimensions, bezel screws, crown/cabochon and movement marking physically.',
        source: 'Cartier specialist exact-reference records and Cartier Calibre 157 movement documentation', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        pattern: /^W20058C4$/i, baseReference: 'W20058C4', family: 'Santos Galbée Large — steel and yellow gold', size: 'approximately 29 × 41 mm',
        calibre: ['120','CAL120'], calibreDisplay: 'Cartier automatic Calibre 120', technology: 'Automatic mechanical movement with date',
        caseDetails: 'Steel case/bracelet with 18K yellow-gold bezel and bracelet details; approximately 30 m water resistance',
        dialDetails: 'Silver guilloché Roman-numeral dial with date at 3',
        notes: 'Calibre 120 is consistent. Verify the movement signature, two-tone component construction and complete caseback markings.',
        source: 'Cartier Santos Galbée exact-reference and movement records', confidence: 'High-confidence exact-reference/calibre match'
    },
    {
        pattern: /^183957$/i, baseReference: '183957', family: 'Panthère de Cartier Jumbo / Large — steel and yellow gold', size: 'approximately 29 mm square case',
        calibre: ['685','687','QUARTZ'], calibreDisplay: 'Cartier quartz Calibre 685/687 family; verify the physical marking', technology: 'Analogue quartz with date',
        caseDetails: 'Steel Panthère case and integrated bracelet with 18K yellow-gold bezel/details; configuration may vary by bracelet-row execution',
        dialDetails: 'Roman-numeral dial with central seconds and date',
        notes: 'Reference 183957 is consistently documented as a quartz Panthère. Period and service records use closely related 685/687 designations, so the submitted Calibre 685 is plausible and should be checked against the actual movement rather than treated as a mismatch.',
        source: 'Cartier Panthère exact-reference records, auction data and Cartier quartz calibre cross-checks', confidence: 'High-confidence model/movement-type match; numbered calibre requires physical confirmation'
    },
    {
        pattern: /^PANTH(?:E)?RE$/i, baseReference: 'Panthère de Cartier (collection-level entry)', family: 'Panthère de Cartier', size: 'reference-dependent',
        calibre: ['83','685','687','QUARTZ'], calibreDisplay: 'Cartier quartz movement; numbered calibre depends on reference and generation', technology: 'Primarily analogue quartz across the relevant vintage and current collection',
        caseDetails: 'Square integrated-bracelet construction in multiple sizes and metals', dialDetails: 'Roman-numeral Panthère layout; reference required for exact dial and date/no-date execution',
        notes: '“Cartier Panthère” is a collection name, not a unique reference. Calibre 83 is plausible on selected vintage Panthère executions, but the caseback/model reference is required before assigning an exact size, movement or metal.',
        source: 'Cartier Panthère collection specifications and vintage movement records', confidence: 'Collection/calibre guidance only; exact reference required', manualReview: true, familyOnly: true
    },
    {
        pattern: /^MUST21$/i, baseReference: 'Must de Cartier 21 (collection-level entry)', family: 'Must de Cartier 21', size: 'reference-dependent; commonly approximately 28–31 mm',
        calibre: ['690','QUARTZ'], calibreDisplay: 'Cartier quartz Calibre 690 on applicable vintage executions', technology: 'Analogue quartz',
        caseDetails: 'Round integrated-bezel design in steel and two-tone executions', dialDetails: 'Reference and size required for exact dial, bezel numerals and date/no-date layout',
        notes: '“Cartier Must 21” is a collection name, not a complete reference. Calibre 690 is consistent with many vintage Must 21 examples, but record the numeric or W-reference before assigning the exact execution.',
        source: 'Cartier Must 21 reference records and Calibre 690 movement documentation', confidence: 'Collection/calibre guidance only; exact reference required', manualReview: true, familyOnly: true
    }
);

// Accept physically recorded short case references while preserving the official
// suffix in the on-screen notes.
TUDOR_REFERENCE_RULES.unshift(
    {
        pattern: /^M?762138?$/i, family: 'Prince Date+Day — steel and yellow gold', size: '36mm',
        calibre: ['2834-2','ETA2834-2'], reserve: 'approximately 38–42 hours', production: 'approximately 1990s–2010s depending on market', era: 'ETA-based Prince Date+Day generation',
        notes: 'Reference 76213-8 normalises to 762138; the trailing -8 is a configuration code. ETA 2834-2 is consistent. Confirm day/date operation, dial, bezel, bracelet/end links and complete caseback reference.',
        source: 'TUDOR Prince Date+Day reference records and documented 76213 movement inspections', confidence: 'High-confidence reference/calibre match'
    },
    {
        pattern: /^M?79310N?$/i, family: 'Black Bay Chrono 39', size: '39mm', calibre: ['MT5813'], reserve: 'approximately 70 hours', production: '2026–present', era: 'compact manufacture chronograph generation',
        notes: 'Official reference is M79310N-0001. A physically recorded short 79310 is accepted as the same case family, but confirm the final N and full configuration suffix. Yellow dial, fixed tachymeter bezel, 200 m case and COSC MT5813 are expected.',
        source: 'TUDOR official M79310N-0001 product specifications', confidence: 'Official model/calibre mapping; shortened transcription supported'
    },
    {
        pattern: /^M?25717N?$/i, family: 'Pelagos FXD — black dial / forest-green strap', size: '42mm', calibre: ['MT5602'], reserve: 'approximately 70 hours', production: '2026–present', era: 'fixed-bar titanium dive generation',
        notes: 'Official reference is M25717N-0001. A physically recorded short 25717 is accepted as the same case family, but confirm the final N and full configuration suffix. Titanium fixed-bar case, black dial, unidirectional ceramic bezel and COSC MT5602 are expected.',
        source: 'TUDOR official M25717N-0001 product specifications', confidence: 'Official model/calibre mapping; shortened transcription supported'
    }
);

// The Bel Canto rule previously sat under Generic, so selecting Christopher Ward
// could never find it. Keep the movement identity explicit: FS01 is the chiming
// calibre/module, built above an SW200-1 base.
OTHER_REFERENCE_RULES.unshift({
    brand: 'Christopher Ward', pattern: /^C1BELCANTO$/i,
    family: 'Christopher Ward C1 Bel Canto', size: '41 mm',
    calibre: ['FS01','SW200-1','SW2001'], calibreDisplay: 'Christopher Ward FS01 chiming calibre/module over a Sellita SW200-1 base',
    reserve: 'approximately 38–41 hours depending on execution', technology: 'Automatic sonnerie au passage hourly-chime watch', production: 'approximately 2022–present',
    notes: 'An SW200-1 marking is base-movement consistent, but the complete watch should be identified as FS01 because the visible dial-side chiming module adds more than 60 components. Verify the hammer, gong, chime on/off control at 4, Grade 5 titanium case and reference-specific dial execution.',
    source: 'Christopher Ward official C1 Bel Canto product and FS01 technical material', confidence: 'Official/high confidence'
});
