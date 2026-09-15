/* Watch Auth Pro researched missing-reference merge
   Version 2.71.0 — 15 September 2026
   Source batch: watch-auth-pro-missing-references-v2.65.0 (2).csv

   Policy:
   - Add only verified mappings not already covered by v2.70.
   - Prefer official/manufacturer references where available.
   - Family-level text entries remain deliberately narrow.
*/

(function () {
  function addExact(target, rule) {
    if (Array.isArray(target)) target.unshift(rule);
  }

  DATABASE_META.version = '2.71.0';
  DATABASE_META.updated = '15 September 2026';
  DATABASE_META.scope = '22 additional researched reference mappings from the v2.65 (2) export';

  /* OMEGA */
  [
    {pattern:/^3539[.]?50[.]?00$/i,baseReference:'3539.50.00',family:'Speedmaster Reduced',calibre:['3220','CAL3220'],technology:'Automatic chronograph',notes:'39 mm; 100 m; approximately 40 h power reserve.',source:'OMEGA archived product specifications',confidence:'Official / high confidence'},
    {pattern:/^2910[.]?51[.]?82$/i,baseReference:'2910.51.82',family:'Seamaster Planet Ocean 600M Co-Axial Chronograph',calibre:['3313','CAL3313'],technology:'Automatic Co-Axial chronograph',notes:'45.5 mm; 600 m; approximately 52 h power reserve.',source:'OMEGA archived product specifications',confidence:'Official / high confidence'},
    {pattern:/^310[.]?30[.]?40[.]?50[.]?06[.]?001$/i,baseReference:'310.30.40.50.06.001',family:'Speedmaster First Omega in Space',calibre:['3861','CAL3861'],technology:'Manual-wind Co-Axial Master Chronometer chronograph',notes:'39.7 mm; 50 m; approximately 50 h power reserve.',source:'OMEGA official product documentation',confidence:'Official / high confidence'},
    {pattern:/^304[.]?30[.]?44[.]?52[.]?01[.]?001$/i,baseReference:'304.30.44.52.01.001',family:'Speedmaster Moonphase Co-Axial Master Chronometer',calibre:['9904','CAL9904'],technology:'Automatic Co-Axial Master Chronometer chronograph',notes:'44.25 mm; 100 m; approximately 60 h power reserve; moonphase/date.',source:'OMEGA official product specifications',confidence:'Official / high confidence'},
    {pattern:/^3529[.]?50[.]?00$/i,baseReference:'3529.50.00',family:'Speedmaster Day-Date / Schumacher limited edition',calibre:['1151','CAL1151'],technology:'Automatic chronograph',notes:'39 mm; 50 m; approximately 44 h power reserve; day-date.',source:'OMEGA archived product specifications',confidence:'Official / high confidence'},
    {pattern:/^210[.]?30[.]?42[.]?20[.]?06[.]?001$/i,baseReference:'210.30.42.20.06.001',family:'Seamaster Diver 300M',calibre:['8800','CAL8800'],technology:'Automatic Co-Axial Master Chronometer',notes:'42 mm; 300 m; approximately 55 h power reserve; grey dial.',source:'OMEGA official product specifications',confidence:'Official / high confidence'},
    {pattern:/^233[.]?90[.]?41[.]?21[.]?03[.]?001$/i,baseReference:'233.90.41.21.03.001',family:'Seamaster 300 Master Co-Axial',calibre:['8400','CAL8400'],technology:'Automatic Co-Axial Master Chronometer',notes:'41 mm titanium; approximately 60 h power reserve.',source:'OMEGA archived product specifications',confidence:'Official / high confidence'},
    {pattern:/^210[.]?32[.]?42[.]?20[.]?10[.]?001$/i,baseReference:'210.32.42.20.10.001',family:'Seamaster Diver 300M',calibre:['8800','CAL8800'],technology:'Automatic Co-Axial Master Chronometer',notes:'42 mm; 300 m; approximately 55 h power reserve; green dial/rubber strap.',source:'OMEGA official product specifications',confidence:'Official / high confidence'}
  ].forEach(r=>addExact(OMEGA_REFERENCE_RULES,r));

  /* CARTIER */
  [
    {pattern:/^WSSA0037$/i,baseReference:'WSSA0037',family:'Santos de Cartier Large',calibre:['1847 MC','1847MC'],technology:'Automatic mechanical movement',notes:'Large model; steel/ADLC case; 100 m water resistance.',source:'Cartier official product specifications',confidence:'Official / high confidence'},
    {pattern:/^WSSA0018$/i,baseReference:'WSSA0018',family:'Santos de Cartier Large',calibre:['1847 MC','1847MC'],technology:'Automatic mechanical movement',notes:'Large steel model; 100 m water resistance; bracelet plus leather strap configuration.',source:'Cartier/reference records',confidence:'High confidence'}
  ].forEach(r=>addExact(CARTIER_REFERENCE_RULES,r));

  /* TUDOR */
  addExact(TUDOR_REFERENCE_RULES,{pattern:/^79090$/i,baseReference:'79090',family:'Prince Oysterdate Submariner',size:'40 mm',calibre:['2824-2','ETA2824-2','ETA 2824-2'],technology:'Automatic',notes:'Vintage Tudor Submariner reference; acrylic crystal; date; approximately 200 m rated when new.',source:'Tudor Submariner reference records',confidence:'High confidence'});

  /* ALL OTHER BRANDS */
  [
    {brand:'Seiko',pattern:/^SPB511(?:J1)?$/i,baseReference:'SPB511J1',family:'Prospex 1965 Heritage Diver’s 60th Anniversary Limited Edition',calibre:['6R55'],technology:'Automatic with manual winding',notes:'40.0 mm; 300 m; approximately 72 h power reserve; limited edition of 6,000.',source:'Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'Panerai',pattern:/^PAM0?0915$/i,baseReference:'PAM00915',family:'Luminor 8 Giorni',calibre:['P.5000','P5000'],technology:'Hand-wound mechanical',notes:'44 mm steel; 300 m; 8-day power reserve; small seconds.',source:'Panerai official product specifications',confidence:'Official / high confidence'},
    {brand:'TAG Heuer',pattern:/^CAZ2010(?:[.][A-Z0-9]+)?$/i,baseReference:'CAZ2010',family:'Formula 1 Chronograph 44 mm',calibre:['16','CAL16','CALIBRE16'],technology:'Automatic chronograph',notes:'44 mm; 200 m; approximately 48 h power reserve; date.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'Grand Seiko',pattern:/^SBGP017G?$/i,baseReference:'SBGP017',family:'Heritage Collection 44GS 55th Anniversary Limited Edition',calibre:['9F85'],technology:'Quartz',notes:'40 mm; 100 m; approximately ±5 seconds/year; limited edition of 2,000.',source:'Grand Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'TAG Heuer',pattern:/^WBP5111(?:[.][A-Z0-9]+)?$/i,baseReference:'WBP5111',family:'Aquaracer Professional 300 Date 42 mm',calibre:['TH31-00','TH31-00 COSC','TH3100'],technology:'Automatic COSC',notes:'42 mm; 300 m; approximately 80 h power reserve; date.',source:'TAG Heuer official product specifications',confidence:'Official / high confidence'},
    {brand:'Grand Seiko',pattern:/^SBGX261G?$/i,baseReference:'SBGX261G',family:'Heritage Collection SBGX261',calibre:['9F62'],technology:'Quartz',notes:'37 mm; 100 m; approximately ±10 seconds/year.',source:'Grand Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'Breitling',pattern:/^A17360[A-Z0-9]*$/i,baseReference:'A17360',family:'Superocean 42',calibre:['17','CAL17','BREITLING17'],technology:'Automatic',notes:'42 mm; 1500 m; approximately 42 h power reserve; date.',source:'Breitling/reference records',confidence:'High confidence'},
    {brand:'Longines',pattern:/^L3[.]?674[.]?4(?:[.][A-Z0-9]+)*$/i,baseReference:'L3.674.4',family:'Legend Diver',calibre:['L633','L633.5','L6335'],technology:'Automatic',notes:'42 mm family; 300 m; internal rotating dive bezel; date. Preserve full suffix when available.',source:'Longines/reference records',confidence:'High confidence'},
    {brand:'Christopher Ward',pattern:/^C60\s+TRIDENT\s+LUMI(?:E|È)RE$/i,baseReference:'C60 Trident Lumière',family:'C60 Trident Lumière',calibre:['SW300-1','SELLITA SW300-1','SW300-1 COSC'],technology:'Automatic COSC',notes:'41 mm titanium; 300 m; approximately 56 h power reserve.',source:'Christopher Ward official product specifications',confidence:'Official / high confidence'},
    {brand:'Grand Seiko',pattern:/^SBGA375G?$/i,baseReference:'SBGA375',family:'Heritage Collection Spring Drive',calibre:['9R65'],technology:'Spring Drive automatic',notes:'40 mm; 100 m; date; power-reserve indicator.',source:'Grand Seiko official product specifications',confidence:'Official / high confidence'},
    {brand:'Christopher Ward',pattern:/^C60\s+TRIDENT\s+PRO\s+300$/i,baseReference:'C60 Trident Pro 300',family:'C60 Trident Pro 300',calibre:['SW200-1','SELLITA SW200-1'],technology:'Automatic',notes:'38/40/42 mm variants; 300 m; approximately 38 h power reserve. Descriptive family entry; capture exact SKU when available.',source:'Christopher Ward official product specifications',confidence:'Official / high confidence'}
  ].forEach(r=>addExact(OTHER_REFERENCE_RULES,r));
})();
