/*
 Watch Auth Pro researched queue update
 Version 2.66.0 — 20 August 2026
 Source batch: watch-auth-pro-missing-references-v2.61.0 (2).csv
*/

DATABASE_META.version = '2.66.0';
DATABASE_META.updated = '20 August 2026';
DATABASE_META.scope = '21-entry research batch: exact and family mappings for Omega, Tudor, Breitling, TAG Heuer, Jaeger-LeCoultre, Grand Seiko, Christopher Ward, Montblanc, Hamilton, Schofield, Nivada and Swatch, with explicit mismatch cautions where the submitted calibre is not supported.';

OMEGA_REFERENCE_RULES.unshift(
  {
    refs:['434.23.42.22.02.001','43423422202001'],
    family:'De Ville Prestige Co-Axial Master Chronometer Date Hand / Pointer Date 42 — steel and Sedna Gold',
    size:'42 mm', calibre:['8936','CAL8936'], reserve:'approximately 60 hours',
    technology:'Automatic Co-Axial Master Chronometer with date hand and independently adjustable hour hand',
    certification:'METAS Master Chronometer',
    notes:'Steel and 18K Sedna Gold 42 mm De Ville Prestige with silver dial, alligator strap and 30 m water resistance. Calibre 8936 is the official movement for this reference.',
    source:'OMEGA official technical specifications for 434.23.42.22.02.001', confidence:'Official / high confidence'
  },
  {
    refs:['176.002','176002'],
    family:'Speedmaster Mark III / automatic pilot-case chronograph family', size:'approximately 41 × 51 mm',
    calibre:['1040','CAL1040'], reserve:'approximately 42 hours',
    technology:'Automatic chronograph with central 60-minute counter, 12-hour counter, date and 24-hour indication',
    certification:'Vintage pre-COSC/METAS chronograph generation',
    notes:'Reference 176.002 is documented with Omega Calibre 1040 and is associated with the early-1970s Speedmaster Mark III / closely related pilot-case execution. Dial and bracelet variants exist; confirm the caseback, dial and movement serial physically.',
    source:'Bonhams, HVMC and specialist Omega reference documentation', confidence:'High-confidence vintage reference/calibre match'
  },
  {
    pattern:/^(?:OMEGA\s*)?SEAMASTER\s*DIVER$/i,
    family:'Seamaster Diver — collection-level entry', size:'reference-dependent',
    calibre:['8800','8806','9900','9901'], reserve:'reference-dependent',
    technology:'Modern Seamaster Diver family includes automatic time/date and automatic chronograph executions',
    certification:'Many modern executions are METAS Master Chronometers',
    notes:'“Seamaster Diver” is not a complete Omega PIC reference. Calibre 9900 is plausible for modern Seamaster Diver 300M chronograph executions, but the exact model, case, dial, bezel and bracelet cannot be assigned without the full PIC reference.',
    source:'OMEGA Seamaster Diver and Calibre 9900 product specifications', confidence:'Collection/calibre guidance only; exact reference required', manualReview:true, collectionOnly:true
  }
);

TUDOR_REFERENCE_RULES.unshift({
  pattern:/^M?25827K?N?(?:-\d{4})?$/i,
  family:'Pelagos FXD Chrono “Cycling Edition”', size:'43mm', calibre:['MT5813'], reserve:'approximately 70 hours',
  production:'2024–present', era:'carbon-composite fixed-bar cycling chronograph generation',
  notes:'Official reference is 25827KN / M25827KN-0001. A workshop transcription of 25827K is accepted as a shortened form, but confirm the final N and full suffix. Black carbon-composite case, titanium crown/pushers, fixed 60-minute bezel, black/red dial, 100 m water resistance and COSC Manufacture Calibre MT5813 are expected.',
  source:'TUDOR official Pelagos FXD Chrono Cycling Edition technical sheet', confidence:'Official model/calibre mapping; shortened transcription supported'
});

OTHER_REFERENCE_RULES.unshift(
  {
    brand:'SCHOFIELD', pattern:/^SCHOFIELDSIGNALMAN$/i,
    family:'Signalman GMT PR — original polished steel limited edition', size:'44 mm', calibre:['SOPROD9335','9335'],
    technology:'Automatic GMT with power-reserve display', reserve:'minimum approximately 42 hours',
    notes:'Schofield documents the original polished Signalman GMT PR as limited to 300 pieces and powered by a Swiss Soprod 9335. Serial 194/300 is consistent with that edition. The submitted “A102” is not supported as the expected movement calibre and should be re-read or identified by location before acceptance.',
    source:'Schofield Watch Company official Signalman 2011 press release and timeline', confidence:'Official model/edition/movement evidence; submitted calibre requires manual verification', manualReview:true
  },
  {
    brand:'NIVADA', pattern:/^CHRONOMASTERAVIATORSEADIVER$/i,
    family:'Chronomaster Aviator Sea Diver — modern reissue family', size:'approximately 38 mm', calibre:['SW510','SW510BHB','SW510MB'],
    technology:'Two-register mechanical chronograph; automatic and manual-wind SW510 executions exist', reserve:'approximately 48–58 hours depending on execution',
    notes:'The modern Chronomaster Aviator Sea Diver is offered in both automatic and manual-wind Sellita SW510 variants. “SW510” is therefore compatible but is not enough to distinguish the exact execution; record whether the movement has a rotor and, where visible, the complete Sellita suffix.',
    source:'Nivada Grenchen product/reissue documentation and contemporary technical reviews', confidence:'High-confidence family/movement mapping; execution requires physical confirmation', manualReview:true, familyOnly:true
  },
  {
    brand:'MONTBLANC', pattern:/^7138$/i,
    family:'Nicolas Rieussec Chronograph GMT', size:'43 mm', calibre:['MBR200','MB R200','R200'],
    technology:'In-house automatic monopusher-style chronograph display with twin rotating discs, date and second time zone', reserve:'approximately 72 hours',
    notes:'Reference 7138 is consistently documented as the Montblanc Nicolas Rieussec Chronograph GMT with in-house Calibre MB R200. The submitted calibre is correct. Confirm the off-centre time dial, twin rotating chronograph discs, date, second-time-zone display and exhibition back.',
    source:'Montblanc service guide plus auction and specialist exact-reference records', confidence:'High-confidence exact-reference/calibre match'
  },
  {
    brand:'Generic', pattern:/^MONTBLANC$/i,
    family:'Montblanc — manufacturer name entered as the reference', size:'model-dependent', calibre:[],
    technology:'Brand entry, not a model reference',
    notes:'“MONTBLANC” is the manufacturer name, not a case/model reference. Use MONTBLANC as the custom brand and enter the actual watch reference separately (for example 7138 for the Nicolas Rieussec in this research batch).',
    source:'Watch Auth Pro input correction', confidence:'Input-routing guidance only', manualReview:true, familyOnly:true
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^213\.8\.D4$/i,
    family:'Reverso Duoface / Reverso Tribute Duoface Travel Time', size:'approximately 42–43 × 25.5 mm', calibre:['854A/2','854A2','854'],
    technology:'Manual-winding Duoface with second time zone and day/night indication', reserve:'approximately 42 hours',
    notes:'Reference 213.8.D4 is documented across later Reverso Duoface/Tribute Duoface executions. Calibre 854A/2 is expected on modern examples; earlier examples should still be checked physically because the reference spans a long production period.',
    source:'Bonhams and specialist JLC exact-reference records', confidence:'High-confidence reference/family mapping; movement generation should be physically confirmed'
  },
  {
    brand:'Grand Seiko', pattern:/^SBGA211G?$/i,
    family:'Heritage Collection “Snowflake” SBGA211', size:'41 mm', calibre:['9R65','9R65A'],
    technology:'Spring Drive automatic with power-reserve indicator and date', reserve:'approximately 72 hours',
    notes:'High-Intensity Titanium Snowflake with textured white dial, blue tempered seconds hand, 10 bar water resistance and Spring Drive Calibre 9R65. The submitted 9R65A movement marking is compatible with the 9R65 family.',
    source:'Grand Seiko official SBGA211 technical specifications', confidence:'Official / high confidence'
  },
  {
    brand:'HAMILTON', pattern:/^H706750$/i,
    family:'Khaki Field Auto The Odyssey Limited Edition — incomplete/truncated reference entry', size:'42 mm', calibre:['H-10','H10'],
    technology:'Automatic three-hand field watch', reserve:'approximately 80 hours',
    notes:'Hamilton’s official retail reference is H70675530, limited to 2,112 pieces, with bronze/titanium case and Calibre H-10. The entered H706750 appears to be an incomplete reference stem. The submitted “C07611+” is not the expected movement calibre and should be treated as another component/production marking unless proven otherwise.',
    source:'Hamilton official H70675530 product specifications', confidence:'Official model/calibre mapping; submitted short reference and calibre require correction', manualReview:true
  },
  {
    brand:'Breitling', pattern:/^A17316$/i,
    family:'Superocean Automatic 36', size:'36 mm', calibre:['17','CAL17','BREITLING17','SW200-1'],
    technology:'Automatic COSC chronometer with date', reserve:'approximately 38–42 hours',
    notes:'A17316 is the 36 mm Superocean Automatic generation. Breitling Calibre 17 is expected; documented later executions use Sellita SW200-1 architecture, so the submitted SW200-1 is compatible. Exact dial/strap/bracelet requires the complete reference suffix.',
    source:'Breitling reference records and documented A17316 technical specifications', confidence:'High-confidence reference/calibre compatibility'
  },
  {
    brand:'Breitling', pattern:/^A17376$/i,
    family:'Superocean Automatic 44', size:'44 mm', calibre:['17','CAL17','BREITLING17','SW200-1'],
    technology:'Automatic COSC chronometer with date', reserve:'approximately 38–42 hours',
    notes:'A17376 is the redesigned 44 mm Superocean Automatic family, 300 m water resistant with ceramic bezel on many variants. Breitling Calibre 17 is expected and the submitted SW200-1 is compatible with documented movement architecture. Preserve the full suffix for colour and bracelet configuration.',
    source:'Breitling Superocean A17376 reference specifications and documented examples', confidence:'High-confidence model/calibre compatibility'
  },
  {
    brand:'Breitling', pattern:/^AB0138$/i,
    family:'Navitimer B01 Chronograph 43', size:'43 mm', calibre:['B01','CALB01','01'],
    technology:'Automatic manufacture column-wheel chronograph with date', reserve:'approximately 70 hours',
    notes:'AB0138 is the Navitimer B01 Chronograph 43 model stem. Breitling Manufacture Calibre B01 is expected. Exact dial, strap/bracelet and case-metal configuration depends on the full reference.',
    source:'Breitling Navitimer B01 reference records and auction technical documentation', confidence:'High-confidence exact model-stem/calibre match'
  },
  {
    brand:'Breitling', pattern:/^A17392$/i,
    family:'Superocean II 44', size:'44 mm', calibre:['17','CAL17','BREITLING17','2824-2','ETA2824-2'],
    technology:'Automatic COSC chronometer with date', reserve:'approximately 42 hours',
    notes:'A17392 is the Superocean II 44, commonly documented at 1,000 m water resistance with helium valve. Breitling Calibre 17 is expected and is based on ETA 2824-2 architecture in this generation, so the submitted 2824-2 is compatible.',
    source:'Breitling Superocean II A17392 technical/reference records', confidence:'High-confidence reference/calibre compatibility'
  },
  {
    brand:'TAG Heuer', pattern:/^CAW2111(?:-1|\.FC(?:6255|6356))?$/i,
    family:'Monaco Calibre 12 — blue dial', size:'39 mm', calibre:['12','CAL12','CALIBRE12'],
    technology:'Automatic chronograph', reserve:'approximately 40 hours',
    notes:'CAW2111 is the blue Monaco Calibre 12 family; official strap references include CAW2111.FC6255 and CAW2111.FC6356. A workshop “CAW2111-1” transcription is accepted as the same model stem when case/dial details agree. Calibre 12 is expected.',
    source:'TAG Heuer official discontinued Monaco CAW2111 product specifications', confidence:'Official model/calibre mapping; workshop suffix normalised'
  },
  {
    brand:'TAG Heuer', pattern:/^WBD1423(?:\.BB0321)?$/i,
    family:'Aquaracer Date 27 — steel/gold-plated, diamond-set', size:'27 mm', calibre:['QUARTZ'],
    technology:'Quartz hours/minutes/seconds/date', reserve:'battery powered',
    notes:'Official reference WBD1423.BB0321 is a 27 mm quartz Aquaracer Date with 300 m water resistance, white mother-of-pearl diamond dial and gold-plated details. The submitted “775” is not the expected calibre and should be treated as a misread or non-movement marking unless independently identified.',
    source:'TAG Heuer official WBD1423.BB0321 technical specifications', confidence:'Official exact-reference movement-type match; submitted calibre conflicts', manualReview:true
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^234\.8\.47$/i,
    family:'Reverso Squadra Lady', size:'approximately 29 × 42 mm', calibre:['657','CAL657'],
    technology:'Quartz', reserve:'battery powered',
    notes:'Steel Reverso Squadra Lady reference 234.8.47 is documented with JLC quartz Calibre 657. Diamond-bezel and dial/strap variants exist. The submitted calibre is correct.',
    source:'Bruun Rasmussen, Artcurial and specialist exact-reference records', confidence:'High-confidence exact-reference/calibre match'
  },
  {
    brand:'SWATCH', pattern:/^(?:APXSWATCH)?ROYALPOP$/i,
    family:'Audemars Piguet × Swatch Royal Pop — collection-level entry', size:'model-dependent', calibre:['SISTEM51','HAND-WOUND SISTEM51'],
    technology:'Hand-wound mechanical SISTEM51 variant', reserve:'model-specific',
    notes:'Royal Pop is an official 2026 Audemars Piguet × Swatch collaboration comprising eight Bioceramic pocket-watch models. “AP x Swatch Royal Pop” is the collection, not the exact reference. The submitted V8EF29 is a serial/production identifier, not the expected calibre. Record the exact SSX03… reference printed for the colourway.',
    source:'Swatch official Royal Pop collection pages and Swatch Group 2026 archive', confidence:'Official collection/movement evidence; exact model reference required', manualReview:true, collectionOnly:true
  },
  {
    brand:'Christopher Ward', pattern:/^TRIDENTLUMIERE$/i,
    family:'C60 Trident Lumière', size:'41 mm', calibre:['SW300-1','SW3001'],
    technology:'Automatic COSC chronometer', reserve:'up to approximately 56 hours',
    notes:'Grade 2 titanium 41 mm C60 Trident Lumière with 300 m water resistance, helium-release valve and Sellita SW300-1 COSC movement. The submitted SW300-1 is correct. Exact limited-edition/reference suffix should still be recorded where visible.',
    source:'Christopher Ward official C60 Trident Lumière technical manual', confidence:'Official / high confidence'
  },
  {
    brand:'Jaeger-LeCoultre', pattern:/^142\.8\.29$/i,
    family:'Master Geographic / Master Control Geographic', size:'38 mm', calibre:['939','CAL939','829/3','8293'],
    technology:'Automatic world-time/second-time-zone watch with date, day/night and power-reserve indication', reserve:'approximately 40 hours',
    notes:'Reference 142.8.29 spans a transitional Master Geographic period. Sotheby’s documents Calibre 939 examples, while other period auction records document Calibre 829/3. The submitted Calibre 939 is therefore valid for documented examples, but the movement must be checked physically rather than forcing one calibre across the entire reference run.',
    source:'Sotheby’s exact-reference lot plus period auction documentation', confidence:'High-confidence reference mapping; documented calibre variation exists'
  }
);
