/*
 Watch Auth Pro researched queue update
 Version 2.55.0 — 17 August 2026
 Source batch: watch-auth-pro-missing-references-v2.54.0.csv
*/

DATABASE_META.version = '2.55.0';
DATABASE_META.updated = '17 August 2026';
DATABASE_META.scope = '13 August 2026 missing-reference queue research: Omega, Tudor, Cartier and Rolex exact corrections plus collection-level movement guidance';

// OMEGA — exact mappings and corrections from the v2.54.0 research queue.
OMEGA_REFERENCE_RULES.unshift(
    { refs:['431.63.41.21.13.001','43163412113001'], family:'De Ville Hour Vision Co-Axial — 18K red gold / brown dial', size:'41 mm', calibre:['8501','CAL8501'], reserve:'approximately 60 hours', technology:'Automatic Co-Axial chronometer with date', production:'approximately 2007–2017', notes:'18K red-gold case on leather strap, brown dial, sapphire side apertures and display back. Calibre 8501 is the precious-metal version of the 8500 family and uses a gold rotor.', source:'WatchBase Omega reference archive cross-checked against multiple specialist listings', confidence:'High-confidence exact-reference mapping' },
    { pattern:/^STZ005923$/i, family:'Speedmaster Professional Moonwatch — internal caseback/component marking', size:'42 mm Moonwatch family', calibre:['1861','CAL1861'], reserve:'approximately 48 hours', technology:'Manual-winding chronograph', production:'commonly encountered on 2010s Calibre 1861 Moonwatch executions', notes:'STZ005923 is documented as an internal caseback/component marking rather than the public retail PIC. It has been observed on Speedmaster Professional Moonwatch ref. 311.30.42.30.01.005 with Calibre 1861. Record the full public reference separately when available.', source:'Auction inspection records cross-checked against Speedmaster reference documentation', confidence:'High-confidence internal-marking guidance; exact retail reference still required', manualReview:true },
    { refs:['2561.80','2561.80.00','25618000'], family:'Seamaster Professional Diver 300M Quartz — midsize blue “Bond” generation', size:'36.25 mm', calibre:['1538','CAL1538'], reserve:'battery powered; approximately 42-month battery life', technology:'Quartz chronometer with date and end-of-life indicator', production:'approximately late 1990s–2000s', notes:'Blue wave dial, blue unidirectional bezel, helium escape valve, sapphire crystal and 300 m water resistance. This is a quartz reference; Calibre 1120 is incorrect for 2561.80.00.', source:'OMEGA official archived product page and WatchBase', confidence:'Official / high confidence' },
    { pattern:/^(?:OMEGA)?SPEEDMASTER$/i, family:'Speedmaster — collection-level entry', size:'model-dependent', calibre:['3330','3861','1861','1863','9900','9906','9908','9909','9300','1152','3220','3606'], reserve:'reference-dependent', technology:'Speedmaster collection includes manual-wind and automatic chronographs', notes:'“Speedmaster” alone is not a complete reference. Calibre 9906 is a 60-hour manual-winding Master Chronometer chronograph used in Speedmaster ’57 40.5 mm references. Calibre 9908/9909 belongs to the 43 mm Chronoscope family. Record the full PIC/case reference before assigning an exact model.', source:'OMEGA official Speedmaster product pages and Swatch Group launch material', confidence:'Collection/calibre guidance only; exact reference required', manualReview:true, collectionOnly:true },
    { pattern:/^(?:OMEGA)?SEAMASTER$/i, family:'Seamaster — collection-level entry', size:'model-dependent', calibre:['8800','8806','8900','8912','8500','2500','1120','1538'], reserve:'reference-dependent', technology:'Collection spans automatic, manual and quartz watches', notes:'“Seamaster” alone is not a complete reference. Calibre 8800 is fully plausible across several modern Seamaster lines, including Diver 300M and Aqua Terra variants. Record the full PIC/case reference before assigning the exact model.', source:'OMEGA Seamaster product specifications', confidence:'Collection/calibre guidance only; exact reference required', manualReview:true, collectionOnly:true }
);

// TUDOR — researched queue mappings.
TUDOR_REFERENCE_RULES.unshift(
    { pattern:/^M?79833(?:MN)?(?:-\d{4})?$/i, family:'Black Bay GMT S&G', size:'41mm', calibre:['MT5652'], reserve:'approximately 70 hours', production:'approximately 2022–present', era:'steel-and-yellow-gold Black Bay GMT generation', notes:'Published base reference is M79833MN. A shortened case entry of 79833 is accepted only when the steel/yellow-gold GMT construction and MT5652 are present. Confirm MN and the full configuration suffix where possible.', source:'TUDOR official M79833MN specifications', confidence:'Official / high confidence' },
    { pattern:/^M?74033(?:-\d{4})?$/i, family:'Prince Date / Prince Oysterdate — steel and yellow gold', size:'34mm', calibre:['2824-2','ETA2824-2'], reserve:'approximately 38 hours', production:'approximately 1990s–2000s', era:'ETA-based Prince Date generation', notes:'Two-tone 34 mm date model. ETA 2824-2 is consistent. Confirm dial execution, bezel, bracelet/end links and full suffix because multiple configurations exist.', source:'TUDOR specialist reference records and multiple market examples', confidence:'High-confidence family/calibre mapping' },
    { pattern:/^M?70330N?(?:-\d{4})?$/i, family:'Heritage Chrono', size:'42mm', calibre:['2892A2','2892-A2','ETA2892-A2'], reserve:'approximately 42 hours', production:'approximately 2010–2020s', era:'Heritage Chrono / Montecarlo revival generation', notes:'Automatic modular chronograph based on ETA 2892-A2 architecture, with 45-minute counter, small seconds and date. Published retail reference is commonly 70330N; confirm the N suffix and exact dial/strap execution.', source:'Christie’s documented 70330 example and period TUDOR technical coverage', confidence:'High-confidence reference/calibre mapping' }
);

// CARTIER — researched queue mappings and one transcription caution.
CARTIER_REFERENCE_RULES.unshift(
    { pattern:/^W20012C4$/i, baseReference:'W20012C4', family:'Santos Galbée Small — steel and yellow gold', size:'approximately 24 × 35 mm', calibre:['157','CAL157'], calibreDisplay:'Cartier Calibre 157', technology:'Quartz hours/minutes movement', caseDetails:'Steel case and bracelet with 18K yellow-gold bezel and bracelet details; sapphire crystal', dialDetails:'Silver/white Roman-numeral dial with blued sword hands', notes:'Calibre 157 is expected. This compact two-tone Santos Galbée is commonly documented from the 1990s into the 2000s.', source:'Multiple Cartier specialist listings and movement records', confidence:'High-confidence exact-reference mapping' },
    { pattern:/^W200114A$/i, baseReference:'W200114A', family:'Santos Galbée-style entry — reference transcription requires verification', size:'likely 29 mm family if the intended reference is W20011C4 / ref. 1566', calibre:['687','CAL687'], calibreDisplay:'Cartier Calibre 687', technology:'Quartz movement with date', caseDetails:'Do not assign exact metal or dimensions until the reference is re-read', dialDetails:'Calibre 687 is consistent with larger Santos Galbée quartz references', notes:'No reliable public Cartier reference record was found for W200114A. Calibre 687 is strongly associated with 29 mm Santos Galbée references such as W20011C4 / ref. 1566. Re-check whether the case marking was transcribed incorrectly before accepting an exact model.', source:'Cartier Santos Galbée calibre/reference records', confidence:'Movement-family guidance only; reference transcription unresolved', manualReview:true },
    { pattern:/^(?:6\s*)?81006$/i, baseReference:'681006', family:'Must de Cartier Tank LM / Large Model — vermeil', size:'approximately 23 × 30 mm', calibre:['859','CAL859','81','CAL81'], calibreDisplay:'Cartier quartz Calibre 859 or period Calibre 81 depending on service/generation', technology:'Quartz two-hand movement', caseDetails:'Gold-plated sterling-silver (vermeil) Tank case, mineral crystal, leather strap', dialDetails:'Numerous period dial variants exist, including Roman, sector, burgundy and champagne executions', notes:'Reference is commonly stamped 6 81006 / 681006. Calibre 859 is documented on Cartier-serviced examples; period records also show Calibre 81. Service replacement movements are plausible, so record the movement marking exactly.', source:'Cartier-serviced dealer examples and specialist reference records', confidence:'High-confidence reference mapping; movement may vary by service history' }
);

// ROLEX 3546 — exact family rule and correction to the generic final-digit metal decoder.
ROLEX_MOVEMENT_RULES.unshift({
    section:'Vintage Ladies Dress / Cocktail', refs:['3546'], model:'Ladies Cocktail / bracelet dress watch — 14K yellow gold',
    calibre:['1400'], reserve:'approximately 42 hours', feature:'Manual-winding two-hand dress movement',
    periodNote:'Documented examples are 14K yellow gold, approximately 15 mm, and commonly date to the 1980s. Calibre 1400 is consistent. The generic Rolex final-digit material decoder must not be used for this vintage reference.'
});

// Patch the generic material result after app.js has loaded. Vintage ref. 3546 is a family-specific exception.
setTimeout(() => {
    try {
        if (typeof decodeRolexReference !== 'function') return;
        const originalDecodeRolexReference = decodeRolexReference;
        decodeRolexReference = function(ref) {
            const result = originalDecodeRolexReference(ref);
            if (result && String(result.core || result.numeric || '').replace(/\D/g,'') === '3546') {
                result.metal = '14K yellow gold — family-specific vintage reference; do not use generic final-digit code';
                result.model = 'Ladies Cocktail / bracelet dress watch — 14K yellow gold';
                result.bezel = 'Integrated vintage dress-watch case; family-specific construction';
            }
            return result;
        };
    } catch (error) {
        console.warn('Rolex 3546 material override could not be installed', error);
    }
}, 0);
