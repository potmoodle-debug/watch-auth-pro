from pathlib import Path
import re

DATA = Path('data/watch-reference-data.js')
APP = Path('app.js')
data = DATA.read_text(encoding='utf-8')
app = APP.read_text(encoding='utf-8')

# Metadata
data = re.sub(r"version: '2\.52\.0'", "version: '2.53.0'", data, count=1)
data = re.sub(r"updated: '5 August 2026'", "updated: '10 August 2026'", data, count=1)
data = re.sub(
    r"scope: 'Reference database expanded from the 56-row inspection log and 21-row missing-reference queue, with exact mappings and collection-level cautions'",
    "scope: 'Reference database expanded with the 10 August 2026 missing-reference research queue: exact mappings, movement-designation compatibility and collection-level cautions'",
    data,
    count=1,
)

marker = '// v2.53.0 — researched from the 10 August 2026 missing-reference queue.'
if marker not in data:
    rules = {
        'const ROLEX_MOVEMENT_RULES = [': r'''            // v2.53.0 — researched from the 10 August 2026 missing-reference queue.
            { section: "Datejust 36 & 41", refs: ["1603"], model: "Datejust 36 (Pie-Pan)", calibre: ["1565", "1570", "1575"], feature: "Non-quickset date; later examples may carry a 1570-marked bridge while using the date-equipped 1575-family architecture", periodNote: "Calibre depends on production period. Treat a physically observed Cal. 1570 on ref. 1603 as period-consistent rather than an automatic mismatch; confirm serial era and movement construction." },
''',
        'const TUDOR_REFERENCE_RULES = [': r'''            // v2.53.0 — researched queue repairs and shortened-reference support.
            { pattern: /^M?25407N?(?:-\d{4})?$/i, family: 'Pelagos 39', size: '39mm', calibre: ['MT5400'], reserve: 'approximately 70 hours', production: 'approximately 2022–present', era: 'compact titanium manufacture Pelagos generation', notes: 'Official base reference is M25407N. A shortened 25407 entry is accepted as the same case family when the watch, titanium construction and MT5400 are consistent; confirm the final N and full configuration suffix from the caseback/card when available.', source: 'TUDOR official Pelagos 39 specifications', confidence: 'Official model/calibre mapping; shortened transcription accepted with suffix confirmation' },
            { pattern: /^M?28600(?:-\d{4})?$/i, family: 'TUDOR Royal Day-Date', size: '41mm', calibre: ['T603','3429','2834-2'], reserve: 'approximately 38 hours', production: 'approximately 2020–present', era: 'Royal integrated-bracelet generation', notes: 'TUDOR publishes the movement as Calibre T603. Signed ref. 28600 auction examples are also documented with the underlying 3429 designation. An observed 3429 is compatible and should not be treated as an automatic movement mismatch.', source: 'TUDOR official Royal specifications; signed ref. 28600 auction records documenting calibre 3429', confidence: 'Official model/T603 mapping with high-confidence physical 3429 cross-check' },
            { pattern: /^M?2543C1A7(?:NU)?(?:-\d{4})?$/i, family: 'Pelagos Ultra', size: '43mm', calibre: ['MT5612-U','MT5612U','MT5612'], reserve: 'approximately 65 hours', production: 'approximately 2025–present', era: 'METAS 1,000 m Pelagos generation', notes: 'Official full reference is M2543C1A7NU-0001. The shortened case-family reference 2543C1A7 is accepted. Official movement designation is MT5612-U; a visible MT5612 family marking is compatible but the -U/METAS execution should be confirmed from the complete movement and watch configuration.', source: 'TUDOR official Pelagos Ultra specifications', confidence: 'Official reference and MT5612-U mapping; shortened case-family input supported' },
''',
        'const OMEGA_REFERENCE_RULES = [': r'''            // v2.53.0 — researched queue repairs.
            { refs:['2518.30.00','25183000'], family:'Seamaster Aqua Terra 150M Quartz', size:'approximately 36 mm', calibre:['1538','CAL1538','CAL.1538'], reserve:'battery powered; approximately 42-month battery life for Calibre 1538', technology:'Quartz analogue with date', certification:'Reference-dependent', notes:'Silver/grey-dial steel Aqua Terra generation. Calibre 1538 is quartz; verify the complete inner-caseback or warranty-card reference and exterior configuration.', source:'OMEGA Calibre 1538 technical specifications cross-checked with specialist reference records for 2518.30.00', confidence:'High-confidence secondary exact-reference cross-check' },
            { refs:['310.30.42.50.04.001'], family:'Speedmaster Moonwatch Professional — white lacquer dial', size:'42 mm', calibre:['3861','CAL3861','CAL.3861'], reserve:'approximately 50 hours', technology:'Manual-winding Co-Axial Master Chronometer chronograph', certification:'METAS Master Chronometer', notes:'White lacquer dial, sapphire crystal and transparent caseback. The movement is manual-winding; do not classify this reference as automatic.', source:'OMEGA official product and press specifications', confidence:'Official / high confidence' },
            { pattern:/^AQUA\s*TERRA$/i, family:'Seamaster Aqua Terra — collection-level entry', size:'model-dependent; Calibre 8900 is strongly associated with 41 mm automatic Aqua Terra executions', calibre:['8900','8901','8800','8801'], reserve:'approximately 55–60 hours depending on exact calibre', technology:'Automatic Co-Axial Master Chronometer family', certification:'Reference-dependent; many modern executions are METAS Master Chronometer', notes:'“Aqua Terra” is a collection name, not a complete reference. Calibre 8900 is fully plausible for 41 mm Aqua Terra 150M models, but the exact dial, metal and bracelet/strap configuration requires the full PIC reference.', source:'OMEGA official Aqua Terra product specifications', confidence:'Official collection/calibre guidance; exact model unresolved', manualReview:true, collectionOnly:true },
            { pattern:/^SPEEDMASTER$/i, family:'Speedmaster — collection-level entry', size:'model-dependent', calibre:['1152','CAL1152','CAL.1152'], reserve:'approximately 44 hours for Calibre 1152', technology:'Speedmaster family includes manual and automatic chronographs; Calibre 1152 is automatic with date', certification:'Reference-dependent', notes:'“Speedmaster” alone is not a complete reference. Calibre 1152 is documented in automatic Speedmaster Date/Automatic executions, so this combination is plausible; record the full caseback or catalogue reference before assigning an exact model.', source:'OMEGA Speedmaster archive, auction records and specialist reference records', confidence:'High-confidence calibre/family guidance; exact reference unresolved', manualReview:true, collectionOnly:true },
            { pattern:/^SEAMASTER$/i, family:'Seamaster — collection-level entry', size:'model-dependent', calibre:['1538','CAL1538','CAL.1538'], reserve:'battery powered; approximately 42-month battery life for Calibre 1538', technology:'Collection spans mechanical and quartz watches; Calibre 1538 specifically is quartz', certification:'Reference-dependent', notes:'“Seamaster” alone is not a complete reference. Calibre 1538 is documented in Seamaster Diver 300M quartz references. If the inspection form says “Mechanical — Automatic (full rotor)” while the movement is Calibre 1538, correct the movement-technology selection to quartz and record the complete watch reference.', source:'OMEGA official archived Seamaster Calibre 1538 specifications', confidence:'Official calibre/family guidance; exact reference unresolved', manualReview:true, collectionOnly:true },
''',
        'const CARTIER_REFERENCE_RULES = [': r'''            // v2.53.0 — researched queue repairs.
            { pattern:/^187906$/i, baseReference:'187906', family:'Cartier Cougar / Panthère Cougar quartz', size:'approximately 26 mm', calibre:['687','087','87'], calibreDisplay:'Cartier quartz Calibre 687 / earlier 087-family documentation', technology:'Quartz analogue with date', caseDetails:'Compact round Cougar case; steel and two-tone executions exist', dialDetails:'Configuration varies; confirm dial, bezel and bracelet against the physical watch', notes:'Ref. 187906 is documented as a Cartier Cougar quartz model. Period records connect the earlier Cartier 087/Ebel 187-1 family with later Calibre 687 replacement/service use. A physically observed Cal. 687 is compatible; verify movement markings and service history.', source:'Auction/reference records for Cartier 187906 and Cartier calibre-history cross-check', confidence:'High-confidence reference/family match; calibre-generation nuance retained' },
            { pattern:/^W20090X8$/i, baseReference:'W20090X8', family:'Santos 100 XL Chronograph', size:'approximately 41 mm wide / XL case', calibre:['8630','8630MC','8630 MC'], calibreDisplay:'Cartier Calibre 8630 MC', technology:'Automatic chronograph with date', caseDetails:'Large square Santos 100 case with exposed bezel screws', dialDetails:'Chronograph dial; verify exact dial/strap execution', notes:'W20090X8 is a Santos 100 XL Chronograph reference. Calibre 8630/8630 MC is the documented automatic chronograph movement and should be treated as compatible.', source:'Sotheby’s and specialist Cartier reference records', confidence:'High-confidence exact-reference/calibre match' },
''',
    }
    for anchor, addition in rules.items():
        if anchor not in data:
            raise RuntimeError(f'Missing data anchor: {anchor}')
        data = data.replace(anchor, anchor + '\n' + addition, 1)

old_lookup = """        function lookupOmegaReference(value) {
            const key = normaliseOmegaReference(value);
            if (!key) return null;
            const cleanDisplay = String(value || '').trim().toUpperCase().replace(/^OMEGA\\s*/i, '');
            const rule = OMEGA_REFERENCE_RULES.find(entry => {
                if (Array.isArray(entry.refs)) {
                    return entry.refs.some(ref => normaliseOmegaReference(ref) === key);
                }
                if (entry.pattern instanceof RegExp) {
                    entry.pattern.lastIndex = 0;
                    return entry.pattern.test(cleanDisplay);
                }
                return false;
            });
            return { key, rule };
        }
"""
new_lookup = """        function lookupOmegaReference(value) {
            const key = normaliseOmegaReference(value);
            const cleanDisplay = String(value || '').trim().toUpperCase().replace(/^OMEGA\\s*/i, '');
            if (!key && !cleanDisplay) return null;
            const rule = OMEGA_REFERENCE_RULES.find(entry => {
                if (Array.isArray(entry.refs)) {
                    return entry.refs.some(ref => normaliseOmegaReference(ref) === key);
                }
                if (entry.pattern instanceof RegExp) {
                    entry.pattern.lastIndex = 0;
                    return entry.pattern.test(cleanDisplay);
                }
                return false;
            });
            return { key: key || cleanDisplay, rule };
        }
"""
if old_lookup in app:
    app = app.replace(old_lookup, new_lookup, 1)
elif 'return { key: key || cleanDisplay, rule };' not in app:
    raise RuntimeError('Omega lookup function not found')

old_box = "renderInformationBox(box, 'info', 'Omega reference identified',"
new_box = "renderInformationBox(box, result.rule.collectionOnly ? 'warning' : 'info', result.rule.collectionOnly ? 'Omega collection identified — exact reference required' : 'Omega reference identified',"
if old_box in app:
    app = app.replace(old_box, new_box, 1)

old_move = """                        const matches = result.rule.calibre.some(cal => normaliseCalibreLoose(cal) === observed);
                        renderInformationBox(movementBox, matches ? 'success' : 'danger', matches ? 'Omega calibre matches reference' : 'Omega calibre mismatch',
                            matches
                                ? `Observed <strong>${escapeHtml(observedCalibre)}</strong> is consistent with the expected ${expected}.`
                                : `Observed <strong>${escapeHtml(observedCalibre)}</strong> does not match the expected ${expected}. Recheck the full reference and movement marking before reaching a conclusion.`
                        );
"""
new_move = """                        const matches = result.rule.calibre.some(cal => normaliseCalibreLoose(cal) === observed);
                        const collectionOnly = Boolean(result.rule.collectionOnly);
                        const level = matches ? 'success' : (collectionOnly ? 'warning' : 'danger');
                        const title = matches
                            ? (collectionOnly ? 'Omega family/calibre combination plausible' : 'Omega calibre matches reference')
                            : (collectionOnly ? 'Exact Omega reference still required' : 'Omega calibre mismatch');
                        const message = matches
                            ? (collectionOnly
                                ? `Observed <strong>${escapeHtml(observedCalibre)}</strong> is documented within this Omega collection, but the collection name alone does not identify the exact watch reference.`
                                : `Observed <strong>${escapeHtml(observedCalibre)}</strong> is consistent with the expected ${expected}.`)
                            : (collectionOnly
                                ? `Observed <strong>${escapeHtml(observedCalibre)}</strong> is not one of the embedded examples for this broad collection entry. Do not treat that as a mismatch from the collection name alone; record the complete case/PIC reference.`
                                : `Observed <strong>${escapeHtml(observedCalibre)}</strong> does not match the expected ${expected}. Recheck the full reference and movement marking before reaching a conclusion.`);
                        renderInformationBox(movementBox, level, title, message);
"""
if old_move in app:
    app = app.replace(old_move, new_move, 1)
elif 'Omega family/calibre combination plausible' not in app:
    raise RuntimeError('Omega movement assessment block not found')

DATA.write_text(data, encoding='utf-8')
APP.write_text(app, encoding='utf-8')
print('Applied Watch Auth Pro v2.53.0 research update')
