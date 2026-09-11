/* Watch Auth Pro researched missing-reference merge
   Version 2.70.0 — 11 September 2026
   Source batch: watch-auth-pro-missing-references-v2.65.0 (1).csv

   Policy:
   - Merge only researched high/medium-confidence exact or safely normalized mappings.
   - Do not auto-import descriptive family-only, malformed, or unresolved entries.
   - Catalogue calibre takes precedence over an inconsistent observed-calibre note.
*/

(function () {
  function addExact(target, rule) {
    if (Array.isArray(target)) target.unshift(rule);
  }

  DATABASE_META.version = '2.70.0';
  DATABASE_META.updated = '11 September 2026';
  DATABASE_META.scope = '39 researched missing-reference mappings from the v2.65 export, including corrected Omega, Breitling, TAG Heuer, Cartier, Grand Seiko, IWC, Panerai, Seiko, Oris, Hublot, Maurice Lacroix, Raymond Weil and Heuer data';

  /* OMEGA */
  [
    {pattern:/^3506[.]?31[.]?00$/i,family:'Speedmaster Legend',calibre:['3301','CAL3301'],technology:'Automatic chronograph',notes:'Exact reference mapping.',source:'OMEGA archived product record',confidence:'Official / high confidence'},
    {pattern:/^2265[.]?80[.]?00$/i,family:'Seamaster Diver 300M — blue quartz',calibre:['1538','CAL1538'],technology:'Quartz analogue',notes:'Exact reference mapping; submitted calibre 1538 is consistent.',source:'OMEGA reference records',confidence:'High confidence'},
    {pattern:/^215[.]?30[.]?44[.]?21[.]?01[.]?001$/i,family:'Seamaster Planet Ocean 600M 43.5 mm',calibre:['8900','CAL8900'],technology:'Automatic Co-Axial Master Chronometer',notes:'Exact reference mapping.',source:'OMEGA reference records',confidence:'High confidence'},
    {pattern:/^311[.]?92[.]?44[.]?30[.]?01[.]?001$/i,family:'Speedmaster Dark Side of the Moon Apollo 8',calibre:['1869','CAL1869'],technology:'Manual-wind chronograph',notes:'Exact reference mapping.',source:'OMEGA reference records',confidence:'High confidence'},
    {pattern:/^2254[.]?50(?:[.]?00)?$/i,family:'Seamaster Diver 300M Professional — black',calibre:['1120','CAL1120'],technology:'Automatic chronometer',notes:'Correct catalogue calibre is 1120; do not map this reference to calibre 2500.',source:'OMEGA reference records',confidence:'High confidence'},
    {pattern:/^2201[.]?50[.]?00$/i,family:'Seamaster Planet Ocean 600M 42 mm',calibre:['2500','CAL2500'],technology:'Automatic Co-Axial chronometer',notes:'Exact reference mapping; submitted calibre 2500 is consistent.',source:'OMEGA reference records',confidence:'High confidence'},
    {pattern:/^(?:210[.]?904[.]?220[.]?010[.]?01|210[.]?90[.]?42[.]?20[.]?01[.]?001)$/i,baseReference:'210.90.42.20.01.001',family:'Seamaster Diver 300M 007 Edition / No Time To Die',calibre:['8806','CAL8806'],technology:'Automatic Co-Axial Master Chronometer',notes:'Normalizes malformed workshop entry 210.904.220.010.01 to official reference 210.90.42.20.01.001.',source:'OMEGA official product sheet',confidence:'Official / high confidence'},
    {pattern:/^SPEEDMASTER\s*['’]?SNOOPY['’]?$/i,baseReference:'310.32.42.50.02.001',family:'Speedmaster Silver Snoopy Award 50th Anniversary',calibre:['3861','CAL3861'],technology:'Manual-wind Co-Axial Master Chronometer chronograph',notes:'Safe normalization for the submitted Snoopy entry when paired with calibre 3861; retain full official reference for future inspections.',source:'OMEGA Silver Snoopy Award 50th Anniversary specifications',confidence:'Official / high confidence'}
  ].forEach(r=>addExact(OMEGA_REFERENCE_RULES,r));

  /* CARTIER */
  [
    {pattern:/^W20072X7$/i,baseReference:'W20072X7',family:'Santos 100',calibre:['049','CAL049'],technology:'Automatic mechanical movement',notes:'Submitted calibre 049 is consistent.',source:'Cartier/reference records',confidence:'High confidence'},
    {pattern:/^WB701851$/i,baseReference:'WB701851',family:'Tank Américaine',calibre:['157','CAL157'],technology:'Quartz analogue',notes:'Reference/model confirmed; retain calibre 157 as workshop-supported movement information.',source:'Cartier/reference records',confidence:'Medium-high confidence'},
    {pattern:/^2603$/i,baseReference:'2603',family:'Tank Divan XL',calibre:['120','CAL120'],technology:'Automatic mechanical movement',notes:'Reference/model confirmed; retain submitted calibre 120 as inspection-supported movement detail.',source:'Cartier/reference records',confidence:'Medium confidence'},
    {pattern:/^W20073X8$/i,baseReference:'W20073X8',family:'Santos 100',calibre:['049','CAL049'],technology:'Automatic mechanical movement',notes:'Submitted calibre 049 is consistent.',source:'Cartier/reference records',confidence:'High confidence'}
  ].forEach(r=>addExact(CARTIER_REFERENCE_RULES,r));

  /* TUDOR */
  addExact(TUDOR_REFERENCE_RULES,{pattern:/^M?25610T(?:NL|N)?(?:-\d{4})?$/i,family:'Pelagos LHD',size:'42 mm',calibre:['MT5612-LHD','MT5612LHD'],technology:'Self-winding Manufacture Calibre',reserve:'approximately 70 hours',notes:'Use MT5612-LHD rather than generic MT5612 for the left-hand-drive Pelagos.',source:'TUDOR Pelagos LHD reference/calibre records',confidence:'High confidence'});

  /* ALL OTHER BRANDS */
  [
    {brand:'Heuer',pattern:/^(?:HEUER\s*)?7721(?:\s*NT)?$/i,baseReference:'7721',family:'Heuer 7721 / 7721 NT chronograph',calibre:['7730','VALJOUX7730'],technology:'Manual-wind chronograph',notes:'Late-1960s 7721 family; submitted Valjoux 7730 is consistent.',source:'OnTheDash reference 7721 NT archive',confidence:'High confidence'},
    {brand:'TAG Heuer',pattern:/^WBP2010(?:[.][A-Z0-9]+)?$/i,baseReference:'WBP2010',family:'Aquaracer Professional 300 GMT 43 mm',calibre:['7','CAL7','CALIBRE7'],technology:'Automatic GMT',notes:'Base reference mapping; bracelet/strap suffix may vary.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'TAG Heuer',pattern:/^CBE2110(?:[.][A-Z0-9]+)?$/i,baseReference:'CBE2110',family:'Autavia / Heuer Heritage 42 mm',calibre:['HEUER02','HEUER 02','CALIBRE HEUER 02'],technology:'Automatic chronograph',notes:'Base reference mapping.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'Grand Seiko',pattern:/^SBGA429G?$/i,baseReference:'SBGA429',family:'Heritage Collection Soko Special Edition',calibre:['9R65'],technology:'Spring Drive automatic',notes:'Exact family mapping.',source:'Grand Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'TAG Heuer',pattern:/^WBP2111(?:[.][A-Z0-9]+)?$/i,baseReference:'WBP2111',family:'Aquaracer Professional 200 Date 40 mm',calibre:['5','CAL5','CALIBRE5'],technology:'Automatic',notes:'Base reference mapping.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'Maurice Lacroix',pattern:/^AI6007(?:[-.][A-Z0-9-]+)?$/i,baseReference:'AI6007',family:'AIKON Automatic Date 39 mm',calibre:['ML115'],technology:'Automatic',notes:'Base reference mapping.',source:'Maurice Lacroix official product specifications',confidence:'Official / high confidence'},
    {brand:'Hublot',pattern:/^511[.]NX[.]1170[.]RX$/i,baseReference:'511.NX.1170.RX',family:'Classic Fusion 45 mm',calibre:['HUB1112'],technology:'Automatic',notes:'Display Hublot calibre HUB1112 rather than the raw SW300 base observation.',source:'Hublot/reference records',confidence:'High confidence'},
    {brand:'TAG Heuer',pattern:/^WAY201B(?:[.][A-Z0-9]+)?$/i,baseReference:'WAY201B',family:'Aquaracer 300M 43 mm',calibre:['5','CAL5','CALIBRE5'],technology:'Automatic',notes:'Base reference mapping.',source:'TAG Heuer reference records',confidence:'High confidence'},
    {brand:'Raymond Weil',pattern:/^2785(?:[-.][A-Z0-9-]+)?$/i,baseReference:'2785',family:'Freelancer Skeleton / RW1212 family',calibre:['RW1212'],technology:'Automatic',notes:'2785 is a model-family stem; preserve the complete suffix when available.',source:'Raymond Weil/reference records',confidence:'Medium confidence'},
    {brand:'Breitling',pattern:/^AB2030[A-Z0-9]*$/i,baseReference:'AB2030',family:'Superocean Heritage B20 Automatic 44',calibre:['B20','CALB20','BREITLING20'],technology:'Automatic',notes:'Base reference mapping.',source:'Breitling/reference records',confidence:'High confidence'},
    {brand:'Breitling',pattern:/^A17376[A-Z0-9]*$/i,baseReference:'A17376',family:'Superocean Automatic 44',calibre:['17','CAL17','BREITLING17'],technology:'Automatic',notes:'Use branded Breitling calibre 17; Sellita base observations remain valid workshop evidence.',source:'Breitling/reference records',confidence:'High confidence'},
    {brand:'Breitling',pattern:/^A59028[A-Z0-9]*$/i,baseReference:'A59028',family:'Navitimer Jupiter Pilot',calibre:['59','CAL59','BREITLING59'],technology:'Quartz',notes:'Correct catalogue movement is Breitling calibre 59; do not map this reference to B233.',source:'Breitling reference/calibre records',confidence:'High confidence'},
    {brand:'Panerai',pattern:/^PAM0?1305$/i,baseReference:'PAM01305',family:'Luminor Submersible 47 Automatic Titanium',calibre:['P.9010','P9010'],technology:'Automatic',notes:'Exact reference mapping.',source:'Panerai reference records',confidence:'High confidence'},
    {brand:'TAG Heuer',pattern:/^WBD1420(?:[.][A-Z0-9]+)?$/i,baseReference:'WBD1420',family:'Aquaracer Date 27 mm',calibre:['QUARTZ'],technology:'Quartz analogue',notes:'Base reference mapping.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'Breitling',pattern:/^A44364[A-Z0-9]*$/i,baseReference:'A44364',family:'Bentley 6.75',calibre:['44B','CAL44B','BREITLING44B'],technology:'Automatic chronograph',notes:'Use branded Breitling calibre 44B rather than raw ETA 2892A2-base observation.',source:'Breitling/reference records',confidence:'High confidence'},
    {brand:'TAG Heuer',pattern:/^WBP2110(?:[.][A-Z0-9]+)?$/i,baseReference:'WBP2110',family:'Aquaracer Professional 200 Date 40 mm',calibre:['5','CAL5','CALIBRE5'],technology:'Automatic',notes:'Base reference mapping.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'TAG Heuer',pattern:/^WBN2113(?:[.][A-Z0-9]+)?$/i,baseReference:'WBN2113',family:'Carrera Date 39 mm',calibre:['5','CAL5','CALIBRE5'],technology:'Automatic',notes:'Base reference mapping.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'Seiko',pattern:/^SLA079(?:J1)?$/i,baseReference:'SLA079J1',family:'Prospex Marinemaster 1968 Heritage Diver',calibre:['8L35'],technology:'Automatic',notes:'Official Seiko reference/calibre mapping.',source:'Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'IWC',pattern:/^IW371609$/i,baseReference:'IW371609',family:'Portugieser Chronograph',calibre:['69355','IWC69355'],technology:'Automatic chronograph',notes:'Exact reference mapping.',source:'IWC official product specifications',confidence:'Official / high confidence'},
    {brand:'Seiko',pattern:/^SLA077(?:J1)?$/i,baseReference:'SLA077J1',family:'Prospex Marinemaster 1968 Heritage Diver',calibre:['8L35'],technology:'Automatic',notes:'Accepts SLA077 shorthand and normalizes to SLA077J1.',source:'Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'Grand Seiko',pattern:/^SBGH353G?$/i,baseReference:'SBGH353G',family:'Heritage Collection Shūbun / 62GS reinterpretation',calibre:['9S85','9S85A'],technology:'Automatic Hi-Beat',notes:'Catalogue calibre is 9S85; 9S85A is accepted as a workshop movement marking.',source:'Grand Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'Panerai',pattern:/^PAM0?1316$/i,baseReference:'PAM01316',family:'Luminor Marina Specchio Blu 44 mm',calibre:['P.9010','P9010'],technology:'Automatic',notes:'Exact reference mapping.',source:'Panerai reference records',confidence:'High confidence'},
    {brand:'IWC',pattern:/^IW371602$/i,baseReference:'IW371602',family:'Portugieser Chronograph Edition “150 Years”',calibre:['69355','IWC69355'],technology:'Automatic chronograph',notes:'Exact reference mapping.',source:'IWC official archive',confidence:'Official / high confidence'},
    {brand:'TAG Heuer',pattern:/^WBP1110(?:-2|[.][A-Z0-9]+)?$/i,baseReference:'WBP1110',family:'Aquaracer Professional 200 40 mm',calibre:['QUARTZ'],technology:'Quartz analogue',notes:'Normalizes submitted WBP1110-2 to base catalogue reference WBP1110.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'IWC',pattern:/^IW327004$/i,baseReference:'IW327004',family:'Pilot’s Watch Mark XVIII Edition “Le Petit Prince”',calibre:['30110','IWC30110'],technology:'Automatic',notes:'Exact reference mapping.',source:'IWC/reference records',confidence:'High confidence'},
    {brand:'Oris',pattern:/^(?:01\s*)?473\s*7786(?:\s*4065.*|[- ]?40)?$/i,baseReference:'01 473 7786 4065',family:'Big Crown Calibre 473',calibre:['473','ORIS473','473-2'],technology:'Manual wind',notes:'Normalizes workshop shorthand 7786 40 to the 473/7786 reference family; retain full configuration suffix when available.',source:'Oris official product specifications',confidence:'Official / high confidence'}
  ].forEach(r=>addExact(OTHER_REFERENCE_RULES,r));
})();
