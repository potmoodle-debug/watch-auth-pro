const categories = [
            "CLASP", "BRACELET / STRAP", "CASE", "CROWN", "PUSHERS", 
            "CRYSTAL", "DIAL", "HANDS", "MOVEMENT"
        ];

        // v2.52.1 consolidated build: restores Tudor 79210C family routing; no intentional removals.

        /* DATABASE_META moved to data/watch-reference-data.js */

        const categorySymbols = {
            "CLASP": "⛓",
            "BRACELET / STRAP": "⌁",
            "CASE": "▣",
            "CROWN": "♛",
            "PUSHERS": "●",
            "CRYSTAL": "◇",
            "DIAL": "◉",
            "HANDS": "↟",
            "MOVEMENT": "⚙"
        };
        
        function safeStorageGet(key, fallback = null) {
            try {
                const value = window.localStorage.getItem(key);
                return value === null ? fallback : value;
            } catch (error) {
                return fallback;
            }
        }

        function safeStorageSet(key, value) {
            try {
                window.localStorage.setItem(key, String(value));
                return true;
            } catch (error) {
                return false;
            }
        }

        function readStoredHistory() {
            try {
                const parsed = JSON.parse(safeStorageGet('watch_history', '[]'));
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }

        function readMissingReferenceQueue() {
            try {
                const parsed = JSON.parse(safeStorageGet('missing_reference_queue', '[]'));
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }

        function readCounterfeitRegister() {
            try {
                const parsed = JSON.parse(safeStorageGet('counterfeit_register', '[]'));
                return Array.isArray(parsed) ? parsed : [];
            } catch (error) {
                return [];
            }
        }

        let states = {};
        let reasons = {};
        let inspections = parseInt(safeStorageGet('inspection_count', '0'), 10) || 0;
        let isChecklistCollapsed = false;
        let pendingConfirmAction = null;
        let isDrawerOpen = false;
        
        // Load watch history array; gracefully falls back when storage is unavailable.
        let watchHistory = readStoredHistory();
        let missingReferenceQueue = readMissingReferenceQueue();
        let counterfeitRegister = readCounterfeitRegister();

        const brandFlags = {
            "Generic": {
                "CLASP": "RED: Sharp edges, 'tinny' sound, incorrect stamping.",
                "MOVEMENT": "RED: Low beat rate, rough finishing, unbranded rotor.",
                "DIAL": "RED: Fuzzy printing, uneven lume."
            },
            "Rolex": {
                "CLASP": "GREEN: Raised coronet sharpness. RED: 'ST9' codes, sandblasted finish on polished areas.",
                "CRYSTAL": "GREEN: Hidden LEC at 6. RED: Blue AR hue, date magnification not 2.5x.",
                "MOVEMENT": "GREEN: Parachrom Blue hairspring. RED: Presence of regulator arms.",
                "DIAL": "GREEN: Perfect coronet alignment. RED: 'Fat' fonts, crooked markers."
            },
            "Tudor": {
                "CLASP": "GREEN: Ceramic ball bearings in clasp, T-Fit system. RED: Friction-only fits.",
                "MOVEMENT": "GREEN: MT Calibres have Silicon balance springs. RED: Standard hairspring on MT marked models.",
                "DIAL": "GREEN: Sharp Shield/Rose logo. RED: Poorly defined 'smile' text."
            },
            "Omega": {
                "MOVEMENT": "GREEN: Co-Axial escapement, Si14 engraving. RED: Standard lever escapement.",
                "CASE": "GREEN: Sharp Lyre lugs. RED: Missing serial on underside of 7 o'clock lug.",
                "CRYSTAL": "GREEN: Tiny Ω etched in center (Hesalite)."
            },
            "Breitling": {
                "DIAL": "GREEN: High-definition 'B' or Wings. RED: Non-functioning sub-dials.",
                "CASE": "GREEN: Serial engraved between lugs at 6. RED: Laser-etched shallow serials.",
                "MOVEMENT": "GREEN: B01 Column wheel visible. RED: Cam/Lever chrono on 'B01' models."
            },
            "Patek Philippe": {
                "MOVEMENT": "GREEN: Calatrava Cross seal, Gyromax balance, gold hallmarks. RED: Standard steel regulator arms.",
                "DIAL": "GREEN: Perfect hand-applied indexes. RED: Misaligned date windows."
            },
            "Audemars Piguet": {
                "CASE": "GREEN: White gold bezel screws. RED: Protruding screw threads.",
                "DIAL": "GREEN: Meticulous 'Tapisserie' patterns. RED: Flat printed pattern blocks."
            },
            "Cartier": {
                "DIAL": "GREEN: 'CARTIER' hidden in VII or X numeral. RED: Missing hidden signature.",
                "CROWN": "GREEN: Genuine spinel/sapphire. RED: Glued-on plastic cabochon."
            },
            "Vacheron Constantin": {
                "MOVEMENT": "GREEN: Hallmark of Geneva engraving, hand-beveled edges. RED: Rough mechanical finishing.",
                "DIAL": "GREEN: Highly detailed Maltese Cross motif. RED: Off-center cross alignment."
            },
            "Jaeger-LeCoultre": {
                "CASE": "GREEN: Flawless reversible slide-lock tracks (Reverso). RED: Gritty, loose rotation.",
                "MOVEMENT": "GREEN: Master Control 1000 Hours seal. RED: Standard unstamped rotors."
            },
            "Richard Mille": {
                "CASE": "GREEN: Symmetrical splatted star torque screws. RED: Standard phillips or flat screws.",
                "MOVEMENT": "GREEN: Grade 5 titanium skeletonized baseplates. RED: Heavy brass/steel replica plates."
            },
            "IWC": {
                "CROWN": "GREEN: Probus Scafusia crest engraving. RED: Shallow generic stamping.",
                "CASE": "GREEN: Clean satin and mirror titanium brushwork. RED: Low-density painted pot metals."
            },
            "Panerai": {
                "CASE": "GREEN: Robust crown protector guard with REG. T.M. markings. RED: Flimsy guard arm levers.",
                "DIAL": "GREEN: Deeply cut dual-layer sandwich dials. RED: Shallow painted stencil layers."
            },
            "Hublot": {
                "CASE": "GREEN: Symmetrical H-shaped bezel screws. RED: Incorrectly aligned or generic screws.",
                "MOVEMENT": "GREEN: Unico dual-coupling flyback mechanics. RED: Standard decorated ETA replicas."
            },
            "TAG Heuer": {
                "DIAL": "GREEN: Pin-point precision sub-dial markers. RED: Sticky, misaligned chronograph hands.",
                "CASE": "GREEN: Serial laser-etched on caseback cleanly. RED: Muddy, fuzzy acid-etched sequences."
            },
            "Rado": {
                "CASE": "GREEN: Case material, finish and reference structure are internally consistent. RED: Incorrect ceramic/steel construction or weak engraving.",
                "MOVEMENT": "GREEN: Calibre and movement architecture match the reference family. RED: Incorrect calibre family or poorly finished substitute movement.",
                "DIAL": "GREEN: Applied details, printing and anchor/logo execution are precise. RED: Soft printing, incorrect logo proportions or inconsistent finishing."
            },
            "Vertex": {
                "CASE": "GREEN: Case markings and dive-standard text are clean and consistent. RED: Weak, uneven or incorrectly placed engraving.",
                "MOVEMENT": "GREEN: Observed movement and architecture are consistent with the inspected Vertex watch. RED: Incorrect movement family or poor substitute finishing.",
                "DIAL": "GREEN: Printing, lume and military-inspired details are sharply executed. RED: Soft printing or inconsistent lume application."
            },
            "Grand Seiko": {
                "DIAL": "GREEN: Razor-sharp Zaratsu polished hands/markers. RED: Blurred micro-texture prints.",
                "MOVEMENT": "GREEN: Gliding glide-wheel Spring Drive sweeps. RED: Standard ticking movement sweeps."
            }
        };

        /* BRAND_PROFILES moved to data/watch-reference-data.js */


        /* ROLEX_METALS moved to data/watch-reference-data.js */


        /* ROLEX_BEZELS moved to data/watch-reference-data.js */


        /* ROLEX_PREFIX_YEARS moved to data/watch-reference-data.js */



        // Independent collector/dealer serial-date benchmarks.
        // These are approximate production milestones, not an official Rolex archive.

        /* ROLEX_NUMERIC_SERIAL_MILESTONES moved to data/watch-reference-data.js */


        function estimateRolexNumericSerial(serialRaw) {
            const clean = String(serialRaw || '').replace(/\D/g, '');
            if (!clean || clean.length < 4 || clean.length > 8) return null;
            const value = Number(clean);
            if (!Number.isFinite(value)) return null;

            for (const [threshold, period] of ROLEX_NUMERIC_SERIAL_MILESTONES) {
                if (value >= threshold) {
                    return {
                        period,
                        basis: 'Rolex numeric serial benchmark',
                        broad: true,
                        note: 'Approximate independent benchmark; confirm against the reference, movement and component generation.'
                    };
                }
            }

            if (value >= 23000 && value < 1008889) {
                return {
                    period: 'approximately 1954–1963, or an earlier pre-1954 sequence',
                    basis: 'Rolex numeric serial benchmark',
                    broad: true,
                    note: 'Rolex restarted its numeric sequence in the 1950s, so lower numbers can overlap earlier production. The model and movement are essential.'
                };
            }

            if (value < 23000) {
                return {
                    period: 'approximately 1920s–1950s',
                    basis: 'early Rolex numeric serial benchmark',
                    broad: true,
                    note: 'Very early numeric sequences are not safely dateable from the serial alone.'
                };
            }
            return null;
        }

        /* ROLEX_CLASP_YEARS moved to data/watch-reference-data.js */


        // Ultimate Replica Database based on r/RepTime u/Jeka_n3xt & u/MajorWilliams

        // Unofficial Omega serial-date estimates. Standard Omega and Speedmaster sequences are deliberately kept separate.
        // Dating limitations and reference-system guidance cross-checked against the Watches.co.uk Omega serial/reference guide (July 2026).

        /* OMEGA_SERIAL_RANGES moved to data/watch-reference-data.js */


        function estimateOmegaSerialYear(serial, series) {
            if (!/^\d{7,8}$/.test(serial)) return null;
            const value = Number(serial);
            const ranges = OMEGA_SERIAL_RANGES[series] || OMEGA_SERIAL_RANGES.standard;
            const match = ranges.find(([minimum, maximum]) => value >= minimum && value <= maximum);
            return match ? match[2] : null;
        }

        // Starter Omega reference-to-calibre lookup. These exact PIC references are live guidance only.
        // Omega PIC punctuation is ignored during matching, but the complete reference should still be verified.

        /* OMEGA_REFERENCE_RULES moved to data/watch-reference-data.js */


        function normaliseOmegaReference(value) {
            return String(value || '').toUpperCase().replace(/^OMEGA/, '').replace(/[^0-9]/g, '');
        }

        function lookupOmegaReference(value) {
            const key = normaliseOmegaReference(value);
            const cleanDisplay = String(value || '').trim().toUpperCase().replace(/^OMEGA\s*/i, '');
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

        function decodeOmegaReferenceFormat(value) {
            const raw = String(value || '').trim().toUpperCase().replace(/^OMEGA\s*/i, '');
            const compact = raw.replace(/\s+/g, '');
            const digits = compact.replace(/[^0-9]/g, '');

            if (/^(?:[A-Z]{2}\s*)?\d{4,5}(?:-\d+)?$/i.test(raw)) {
                const materialMatch = raw.match(/^([A-Z]{2})/i);
                const materialCodes = {
                    CK: 'stainless steel', MI: 'stainless steel', OT: 'solid gold', OJ: 'solid gold',
                    KO: 'gold-cap', PK: 'gold-filled'
                };
                const material = materialMatch ? materialCodes[materialMatch[1].toUpperCase()] : null;
                return {
                    system: 'Early numeric reference (generally pre-1962)',
                    detail: `${material ? `Prefix indicates <strong>${material}</strong>. ` : ''}This is principally a case-design reference; it does not reliably encode the movement, dial or bracelet. A suffix such as -1 or -3 normally indicates an iteration of the base case reference.`,
                    confidence: 'Format guidance only'
                };
            }

            if (/^\d{2}\.?\d{3}\.?\d{2,3}$/.test(compact)) {
                const parts = digits.length === 7 ? [digits.slice(0,2), digits.slice(2,5), digits.slice(5)] : [digits.slice(0,2), digits.slice(2,5), digits.slice(5)];
                const first = Number(parts[0]);
                let material = 'material/construction code requires period-specific confirmation';
                if (first >= 11 && first <= 14) material = 'stainless-steel family';
                else if (first >= 15 && first <= 19) material = 'gold-cap or gold-filled steel family';
                else if (first >= 20 && first <= 29) material = 'solid-gold family';
                else if (first >= 30 && first <= 39) material = 'steel combined with another metal';
                else if (first >= 50 && first <= 59) material = 'gold combined with another material';
                else if (first >= 60 && first <= 69) material = 'precious-metal family';
                else if (first >= 90 && first <= 99) material = 'other-material family, including some later titanium or ceramic references';
                return {
                    system: 'MAPICS reference (approximately 1962–2007)',
                    detail: `The first block <strong>${parts[0]}</strong> points to a ${material}. The middle and final blocks relate loosely to movement/function, case construction and variant, but Omega did not publish a complete public decoding key and meanings can be model-specific or reused.`,
                    confidence: 'Partial format decoding only'
                };
            }

            if (/^\d{4}\.?\d{2}\.?\d{2}$/.test(compact) || /^\d{8}$/.test(digits)) {
                const d = digits.padStart(8, '0');
                const familyMap = {'1':'Constellation','2':'Seamaster','3':'Speedmaster','4':'De Ville','5':'Louis Brandt','7':'special De Ville series'};
                const materialMap = {'1':'gold case and bracelet','2':'steel-and-gold case and bracelet','3':'steel-and-gold case with partial steel-and-gold bracelet','4':'steel-and-gold case with steel bracelet','5':'steel case and bracelet','6':'gold case on strap','7':'steel-and-gold case on strap','8':'steel case on strap','9':'other material'};
                return {
                    system: 'Short PIC reference (approximately 1988–2007)',
                    detail: `Family code <strong>${d[0]}</strong>: ${familyMap[d[0]] || 'unlisted family'}. Material code <strong>${d[1]}</strong>: ${materialMap[d[1]] || 'unlisted material combination'}. The remaining digits cover the model variation, dial/markers and strap or bracelet, but those values are model-specific.`,
                    confidence: 'Structured format decoding; exact model still requires a catalogue match'
                };
            }

            const pic14 = compact.match(/^(\d{3})\.?(\d{2})\.?(\d{2})\.?(\d{2})\.?(\d{2})\.?(\d{3})$/);
            if (pic14) {
                const familyCode = pic14[1];
                const top = familyCode[0];
                const broad = top === '1' ? 'Constellation' : top === '2' ? 'Seamaster' : top === '3' ? 'Speedmaster' : top === '4' ? 'De Ville' : 'another Omega family';
                const knownFamilies = {
                    '121':'Constellation Double Eagle','123':'Constellation','127':'Constellation ladies','128':'Constellation Petite Seconde / ladies automatic','129':'Constellation quartz','130':'Constellation Globemaster','131':'Constellation Manhattan','132':'Constellation Manhattan quartz',
                    '210':'Seamaster Diver 300M','212':'Seamaster Diver 300M classic','213':'Seamaster Diver 300M chronograph','215':'Seamaster Planet Ocean 600M','220':'Seamaster Aqua Terra','221':'Seamaster Aqua Terra chronograph','222':'Seamaster Aqua Terra annual calendar','223':'Seamaster Aqua Terra ladies','224':'Seamaster Aqua Terra GMT / Worldtimer','225':'Seamaster Aqua Terra small seconds','228':'Seamaster Aqua Terra Ultra Light','229':'Seamaster Aqua Terra Shades'
                };
                return {
                    system: 'PIC14 reference (2007–present)',
                    detail: `<strong>${familyCode}</strong> identifies ${knownFamilies[familyCode] || broad}. The remaining blocks represent case/bracelet material, case size, movement/complication, dial, and a three-digit sequence. The final sequence distinguishes configurations or revisions; it is not a production year or quantity.`,
                    confidence: 'Structured format decoding; exact specifications require the full reference database'
                };
            }

            return null;
        }

        function renderOmegaReferenceAssessment(value, box, observedCalibre = '', movementBox = null) {
            const result = lookupOmegaReference(value);
            if (!result || !result.key) return null;
            if (result.rule) {
                const expected = result.rule.calibre.map(cal => `Cal. ${cal}`).join(' or ');
                renderInformationBox(box, result.rule.collectionOnly ? 'warning' : 'info', result.rule.collectionOnly ? 'Omega collection identified — exact reference required' : 'Omega reference identified',
                    `<strong>${result.rule.family}</strong> · ${result.rule.size}<br>` +
                    `Expected movement: <strong>${expected}</strong> · ${result.rule.reserve}<br>` +
                    `Movement: <strong>${result.rule.technology}</strong><br>` +
                    `Certification: <strong>${result.rule.certification}</strong>` +
                    `<div class="mt-2">${result.rule.notes}</div>` + provenanceHtml(result.rule, 'Omega')
                );
                if (movementBox) {
                    const observed = normaliseCalibreLoose(observedCalibre);
                    if (observed) {
                        const matches = result.rule.calibre.some(cal => normaliseCalibreLoose(cal) === observed);
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
                    }
                }
                return { ...result, recognised: !result.rule.manualReview };
            }
            const format = decodeOmegaReferenceFormat(value);
            const formatHtml = format
                ? `<div class="mt-2"><strong>${format.system}</strong><br>${format.detail}</div><div class="provenance-line"><strong>Source:</strong> Watches.co.uk Omega Serial & Reference Numbers guide<br><strong>Confidence:</strong> ${format.confidence} · DB v${DATABASE_META.version}</div>`
                : '';
            renderInformationBox(box, 'warning', 'Omega reference requires manual review',
                `No exact Omega model/calibre mapping is embedded for <strong>${escapeHtml(value)}</strong>. ${format ? 'The number format can still be interpreted provisionally below, but this is not an exact model identification.' : 'Confirm the complete reference against model-specific technical records.'}` +
                formatHtml + missingReferenceButtonHtml()
            );
            return { ...result, recognised: false };
        }

        // Breitling reference lookup. Exact entries provide screen-only inspection guidance and are not written into the final note.
        // A73380 may appear as the short case/reference family or at the beginning of a longer configuration reference.

        /* BREITLING_REFERENCE_RULES moved to data/watch-reference-data.js */


        function normaliseBreitlingReference(value) {
            return String(value || '').toUpperCase().replace(/^BREITLING/, '').replace(/[^A-Z0-9]/g, '');
        }

        function normaliseBreitlingCalibre(value) {
            let key = String(value || '').toUpperCase()
                .replace(/CAL(?:IBRE)?\.?/g, '')
                .replace(/BREITLING/g, '')
                .replace(/[^A-Z0-9]/g, '');
            const shortMatch = key.match(/^B?(\d{2})$/);
            return shortMatch ? shortMatch[1] : key;
        }

        function lookupBreitlingReference(value) {
            const key = normaliseBreitlingReference(value);
            if (!key) return null;

            let rule = BREITLING_REFERENCE_RULES.find(entry => entry.pattern.test(key));

            // Some later source-backed Breitling mappings were added to the shared
            // reference table. Include them in Breitling mode and adapt their fields
            // to the dedicated Breitling renderer.
            if (!rule && typeof OTHER_REFERENCE_RULES !== 'undefined') {
                const sharedRule = OTHER_REFERENCE_RULES.find(entry =>
                    entry.brand === 'Breitling' && entry.pattern.test(key)
                );
                if (sharedRule) {
                    rule = {
                        ...sharedRule,
                        baseReference: sharedRule.baseReference || key.slice(0, 6),
                        technology: sharedRule.technology || 'Movement technology requires confirmation',
                        functions: sharedRule.functions || sharedRule.technology || 'Functions depend on the exact model configuration',
                        caseDetails: sharedRule.caseDetails || sharedRule.notes || 'Confirm the full reference.',
                        calibre: Array.isArray(sharedRule.calibre) ? sharedRule.calibre : [],
                        calibreDisplay: sharedRule.calibreDisplay || 'Movement requires confirmation',
                        production: sharedRule.production || 'Production period requires confirmation',
                        size: sharedRule.size || 'Size requires confirmation'
                    };
                }
            }

            return { key, rule };
        }

        function renderBreitlingReferenceAssessment(value, box, observedCalibre = '', movementBox = null) {
            const result = lookupBreitlingReference(value);
            if (!result || !result.key) return null;
            if (!result.rule) {
                renderInformationBox(box, 'warning', 'Breitling reference requires manual review',
                    `No exact Breitling model/calibre mapping is embedded for <strong>${escapeHtml(value)}</strong>. Confirm the complete reference against model-specific technical records.` + missingReferenceButtonHtml()
                );
                return { ...result, recognised: false };
            }

            const rule = result.rule;
            renderInformationBox(box, 'info', 'Breitling reference identified',
                `<strong>${rule.family}</strong> · ${rule.size}<br>` +
                `Reference family: <strong>${rule.baseReference}</strong> · ${rule.production}<br>` +
                `Expected movement: <strong>${rule.calibreDisplay}</strong><br>` +
                `Movement type: <strong>${rule.technology}</strong><br>` +
                `Functions: ${rule.functions}<br>` +
                `Case specification: ${rule.caseDetails}` +
                `<div class="mt-2">${rule.notes}</div>` + provenanceHtml(rule, 'Breitling')
            );

            if (movementBox) {
                const observed = normaliseBreitlingCalibre(observedCalibre);
                const expected = new Set(rule.calibre.map(normaliseBreitlingCalibre));
                if (!observed) {
                    renderInformationBox(movementBox, 'info', 'Breitling movement expected',
                        `${rule.familyOnly ? 'This vintage model-family entry is consistent with' : 'Reference <strong>' + rule.baseReference + '</strong> should contain'} <strong>${rule.calibreDisplay}</strong>. Enter the observed calibre to compare it.`
                    );
                } else if (expected.has(observed)) {
                    renderInformationBox(movementBox, 'success', 'Breitling calibre matches reference',
                        `The observed calibre <strong>${escapeHtml(observedCalibre)}</strong> is consistent with ${rule.familyOnly ? 'this Breitling movement family' : 'reference <strong>' + rule.baseReference + '</strong>'}. This is live inspection guidance only.`
                    );
                } else {
                    renderInformationBox(movementBox, 'danger', 'Breitling calibre mismatch',
                        `Reference <strong>${rule.baseReference}</strong> is mapped to <strong>${rule.calibreDisplay}</strong>, but the observed calibre was entered as <strong>${escapeHtml(observedCalibre)}</strong>. Recheck the movement marking, reference and case configuration before judging the watch.`
                    );
                }
            }
            queueMicrotask(updateManualReviewQueueActions);
                return { ...result, recognised: true };
        }



        // Cartier reference lookup. Exact entries provide screen-only inspection guidance and are not written into the final note.

        /* CARTIER_REFERENCE_RULES moved to data/watch-reference-data.js */


        function normaliseCartierReference(value) {
            return String(value || '').toUpperCase().replace(/^CARTIER/, '').replace(/[^A-Z0-9]/g, '');
        }

        function normaliseCartierCalibre(value) {
            return String(value || '').toUpperCase()
                .replace(/CAL(?:IBRE)?\.?/g, '')
                .replace(/CARTIER/g, '')
                .replace(/[^A-Z0-9]/g, '');
        }

        function lookupCartierReference(value) {
            const key = normaliseCartierReference(value);
            if (!key) return null;
            const rule = CARTIER_REFERENCE_RULES.find(entry => entry.pattern.test(key));
            return { key, rule };
        }

        function renderCartierReferenceAssessment(value, box, observedCalibre = '', movementBox = null) {
            const result = lookupCartierReference(value);
            if (!result || !result.key) return null;
            if (!result.rule) {
                renderInformationBox(box, 'warning', 'Cartier reference requires manual review',
                    `No exact Cartier model/calibre mapping is embedded for <strong>${escapeHtml(value)}</strong>. Confirm the complete reference against Cartier Care and model-specific technical records.` + missingReferenceButtonHtml()
                );
                return { ...result, recognised: false };
            }

            const rule = result.rule;
            renderInformationBox(box, rule.familyOnly ? 'warning' : 'info', rule.familyOnly ? 'Cartier model family identified' : 'Cartier reference identified',
                `<strong>${rule.family}</strong> · ${rule.size}<br>` +
                `${rule.familyOnly ? 'Lookup level' : 'Reference'}: <strong>${rule.baseReference}</strong><br>` +
                `Expected movement: <strong>${rule.calibreDisplay}</strong><br>` +
                `Movement type: <strong>${rule.technology}</strong><br>` +
                `Case specification: ${rule.caseDetails}<br>` +
                `Dial specification: ${rule.dialDetails}` +
                `<div class="mt-2">${rule.notes}</div>` + provenanceHtml(rule, 'Cartier')
            );

            if (movementBox) {
                const observed = normaliseCartierCalibre(observedCalibre);
                const expected = new Set(rule.calibre.map(normaliseCartierCalibre));
                if (!observed) {
                    renderInformationBox(movementBox, 'info', 'Cartier movement expected',
                        `${rule.familyOnly ? 'This vintage model-family entry is consistent with' : 'Reference <strong>' + rule.baseReference + '</strong> should contain'} <strong>${rule.calibreDisplay}</strong>. Enter the observed calibre to compare it.`
                    );
                } else if (expected.has(observed)) {
                    renderInformationBox(movementBox, 'success', 'Cartier calibre matches reference',
                        `The observed calibre <strong>${escapeHtml(observedCalibre)}</strong> is consistent with ${rule.familyOnly ? 'this Breitling movement family' : 'reference <strong>' + rule.baseReference + '</strong>'}. This is live inspection guidance only.`
                    );
                } else {
                    renderInformationBox(movementBox, 'danger', 'Cartier calibre mismatch',
                        `${rule.familyOnly ? 'This vintage Must de Cartier Tank entry is associated with' : 'Reference <strong>' + rule.baseReference + '</strong> is mapped to'} <strong>${rule.calibreDisplay}</strong>, but the observed calibre was entered as <strong>${escapeHtml(observedCalibre)}</strong>. Recheck the movement marking and complete case reference before judging the watch.`
                    );
                }
            }
            return { ...result, recognised: true };
        }

        // Tudor reference lookup. Exact entries provide screen-only inspection guidance and are not written into the final note.
        // Full modern references often add a -0001 / -0002 etc. configuration suffix; the lookup compares the base reference.

        /* TUDOR_REFERENCE_RULES moved to data/watch-reference-data.js */


        /* TUDOR_COLOUR_CODES moved to data/watch-reference-data.js */


        function normaliseTudorReference(value) {
            const raw = String(value || '').toUpperCase().replace(/\s+/g, '').replace(/^TUDOR/, '');
            const configuration = (raw.match(/-(\d{4})$/) || [])[1] || '';
            const withoutConfiguration = raw.replace(/-\d{4}$/, '');
            const base = withoutConfiguration.replace(/[._-]/g, '');
            const full = raw;
            return { full, base, configuration };
        }

        function getTudorColourHint(base) {
            const ordered = Object.keys(TUDOR_COLOUR_CODES).sort((a, b) => b.length - a.length);
            const code = ordered.find(key => base.endsWith(key));
            return code ? { code, label: TUDOR_COLOUR_CODES[code] } : null;
        }

        function lookupTudorReference(value) {
            const parsed = normaliseTudorReference(value);
            if (!parsed.base) return null;
            const rule = TUDOR_REFERENCE_RULES.find(entry => entry.pattern.test(parsed.base));
            const colour = getTudorColourHint(parsed.base);
            return { ...parsed, rule, colour };
        }

        function normaliseTudorCalibre(value) {
            return String(value || '').toUpperCase()
                .replace(/CAL(?:IBRE)?\.?/g, '')
                .replace(/TUDOR/g, '')
                .replace(/[^A-Z0-9]/g, '');
        }

        function renderTudorCalibreAssessment(rule, referenceBase, observedCalibre, movementBox) {
            if (!movementBox || !rule) return;
            const observed = normaliseTudorCalibre(observedCalibre);
            const expected = new Set((rule.calibre || []).map(normaliseTudorCalibre));
            const expectedDisplay = (rule.calibre || []).map(cal => `Cal. ${cal}`).join(' or ');
            if (!observed) {
                renderInformationBox(movementBox, 'info', 'Tudor movement expected',
                    `Reference <strong>${escapeHtml(referenceBase)}</strong> is mapped to <strong>${expectedDisplay}</strong>. Enter the observed calibre to compare it.`
                );
            } else if (expected.has(observed)) {
                const aliasNote = observed === '2429'
                    ? ' The 2429 designation appears in secondary-market and auction records; TUDOR’s published designation for this model is T601, so verify the physical movement markings.'
                    : '';
                renderInformationBox(movementBox, 'success', 'Tudor calibre consistent with reference',
                    `The observed calibre <strong>${escapeHtml(observedCalibre)}</strong> is consistent with reference <strong>${escapeHtml(referenceBase)}</strong>.${aliasNote} This is live inspection guidance only.`
                );
            } else {
                renderInformationBox(movementBox, 'danger', 'Tudor calibre mismatch',
                    `Reference <strong>${escapeHtml(referenceBase)}</strong> is mapped to <strong>${expectedDisplay}</strong>, but the observed calibre was entered as <strong>${escapeHtml(observedCalibre)}</strong>. Recheck the movement marking, production period and complete reference before judging the watch.`
                );
            }
        }

        function renderTudorReferenceAssessment(value, box, observedCalibre = '', movementBox = null) {
            const result = lookupTudorReference(value);
            if (!result || !result.base) return null;
            const configLine = result.configuration
                ? `<div class="mt-2"><strong>Configuration suffix:</strong> -${result.configuration}. This normally distinguishes bracelet, strap, dial or market configuration; it does not by itself change the base case/movement identity.</div>`
                : '';
            const colourLine = result.colour
                ? `<div class="mt-2"><strong>Colour/configuration code:</strong> ${result.colour.code} — ${result.colour.label}.</div>`
                : '';

            if (result.rule) {
                const expected = result.rule.calibre.map(cal => `Cal. ${cal}`).join(' or ');
                renderInformationBox(box, result.rule.manualReview ? 'neutral' : 'info', result.rule.manualReview ? 'Tudor reference requires manual review' : 'Tudor reference identified',
                    `<strong>${result.rule.family}</strong> · ${result.rule.size}<br>` +
                    `Expected movement: <strong>${expected}</strong> · ${result.rule.reserve}<br>` +
                    `Approximate production: <strong>${result.rule.production || result.rule.era}</strong>` +
                    colourLine + configLine +
                    `<div class="mt-2">${result.rule.notes}</div>` +
                    provenanceHtml(result.rule, 'Tudor') +
                    `<div class="mt-2.5 pt-2 border-t border-blue-900/30 text-[10px] text-gray-400 leading-normal"><strong>Inspection use:</strong> This is live guidance only. Confirm the complete suffix, case construction, dial, movement and production period before reaching an authentication decision.</div>`
                );
                renderTudorCalibreAssessment(result.rule, result.base, observedCalibre, movementBox);
                return { ...result, recognised: true };
            }

            const modern = /^M[A-Z0-9]+$/.test(result.base);
            const formatText = modern
                ? 'The value follows a modern Tudor catalogue-reference format.'
                : /^\d{4,6}[A-Z]*$/.test(result.base)
                    ? 'The value follows a common vintage or transitional Tudor reference format.'
                    : 'The reference format is not recognised by the embedded rules.';
            renderInformationBox(box, 'warning', 'Tudor reference requires manual review',
                `${formatText}${colourLine}${configLine}` +
                `<div class="mt-2">No exact model/calibre mapping is embedded for <strong>${result.base}</strong>. Do not infer the movement from the number alone; verify it against Tudor or period-specific technical records.</div>` + missingReferenceButtonHtml()
            );
            queueMicrotask(updateManualReviewQueueActions);
            return { ...result, recognised: false };
        }

        // Tudor serial benchmarks compiled from the cited Bob's Watches guide.
        // These are observed dating benchmarks, not an official Tudor production database.

        /* TUDOR_NUMERIC_SERIAL_BENCHMARKS moved to data/watch-reference-data.js */


        /* TUDOR_RESET_SERIAL_BENCHMARKS moved to data/watch-reference-data.js */


        /* TUDOR_ALPHANUMERIC_SERIAL_BENCHMARKS moved to data/watch-reference-data.js */


        function nearestTudorBenchmark(value, benchmarks) {
            if (!Number.isFinite(value) || !benchmarks || !benchmarks.length) return null;
            return benchmarks.reduce((best, current) => {
                const distance = Math.abs(value - current[0]);
                return !best || distance < best.distance ? { serial: current[0], year: current[1], distance } : best;
            }, null);
        }

        function estimateTudorSerial(serial) {
            const clean = String(serial || '').trim().toUpperCase().replace(/[\s-]+/g, '');
            if (!clean) return null;

            if (/^\d{5,7}$/.test(clean)) {
                const value = Number(clean);
                const early = nearestTudorBenchmark(value, TUDOR_NUMERIC_SERIAL_BENCHMARKS);
                const reset = nearestTudorBenchmark(value, TUDOR_RESET_SERIAL_BENCHMARKS);
                const inResetBand = value >= 140000 && value <= 260000;
                const overlapsEarlyTable = value >= 240000 && value <= 260000;

                if (inResetBand) {
                    const alternatives = [];
                    if (reset) alternatives.push(`${reset.year} (nearest reset-era benchmark ${reset.serial})`);
                    if (overlapsEarlyTable && early) alternatives.push(`${early.year} (nearest early sequential benchmark ${early.serial})`);
                    return {
                        format: 'numeric',
                        estimate: alternatives.join(' or '),
                        ambiguous: true,
                        note: 'Tudor restarted its numeric sequence in the mid-1980s, so this range can overlap earlier serials. The case reference, dial, movement and construction must determine the correct era.'
                    };
                }

                if (early && value >= 240000 && value <= 999999) {
                    return {
                        format: 'numeric',
                        estimate: `${early.year} (nearest published benchmark ${early.serial})`,
                        ambiguous: false,
                        note: 'This is an estimated period from a published serial benchmark rather than an official Tudor archive result.'
                    };
                }

                return {
                    format: 'numeric',
                    estimate: null,
                    ambiguous: false,
                    note: 'The numeric value falls outside the embedded 1956–1989 benchmark table. Verify it against the exact reference and period-specific records.'
                };
            }

            const alphaMatch = clean.match(/^([A-Z])(\d{5,7})$/);
            if (alphaMatch) {
                const prefix = alphaMatch[1];
                const value = Number(alphaMatch[2]);
                const benchmarks = TUDOR_ALPHANUMERIC_SERIAL_BENCHMARKS[prefix];
                if (benchmarks) {
                    const nearest = nearestTudorBenchmark(value, benchmarks);
                    return {
                        format: 'alphanumeric',
                        estimate: nearest ? `${nearest.year} (nearest ${prefix}-series benchmark ${prefix}${nearest.serial})` : null,
                        ambiguous: false,
                        note: 'B- and H-prefix dates are collector-compiled estimates. Tudor does not publish a complete official modern serial chronology.'
                    };
                }
                return {
                    format: 'alphanumeric',
                    estimate: null,
                    ambiguous: false,
                    note: `The ${prefix}-prefix is not covered by the embedded 1990–2002 B/H benchmark table. Treat the format as modern or transitional guidance only.`
                };
            }

            if (/^[A-Z0-9]{5,12}$/.test(clean)) {
                return {
                    format: 'modern/unmapped',
                    estimate: null,
                    ambiguous: false,
                    unmapped: true,
                    note: 'The serial is a plausible Tudor alphanumeric structure, but it is not covered by the limited historical benchmark table. Record it exactly and assess it alongside the case reference, calibre, engraving and apparent age.'
                };
            }

            return {
                format: 'requires recheck',
                estimate: null,
                ambiguous: false,
                malformed: true,
                note: 'The entry contains an unexpected length or character. Recheck the engraving and confirm that the serial—not the model reference, bracelet code or another case marking—has been entered.'
            };
        }

        /* OTHER_REFERENCE_RULES moved to data/watch-reference-data.js */


        function normaliseOtherReference(value) { return String(value || '').trim().toUpperCase().replace(/\s+/g,''); }
        function lookupOtherReference(brand, value) {
            const key = normaliseOtherReference(value);
            return OTHER_REFERENCE_RULES.find(rule => rule.brand === brand && rule.pattern.test(key)) || null;
        }
        function normaliseCalibreLoose(value) { return String(value || '').toUpperCase().replace(/CALIBRE|CAL\.?|OMEGA|IWC|TAGHEUER|LONGINES|CARTIER|TUDOR|BREITLING|RADO|VERTEX|SEIKO|STUDIOUNDERD0G|GRANDSEIKO|LEMANIA|CWC|CHANEL|ETA|[^A-Z0-9]/g,''); }
        function renderOtherReferenceAssessment(brand, value, box, observedCalibre, movementBox) {
            const rule = lookupOtherReference(brand, value);
            if (!rule) { renderInformationBox(box,'neutral',`${brand} reference requires research`,`No exact embedded model/calibre mapping was found for <strong>${value}</strong>.${missingReferenceButtonHtml()}`); return {recognised:false}; }
            renderInformationBox(box,rule.manualReview?'neutral':'info',rule.manualReview?`${brand} reference requires manual review`:`${brand} reference identified`,`<strong>${rule.family}</strong> · ${rule.size}<div class="mt-1"><strong>Expected movement:</strong> ${rule.calibreDisplay}</div><div class="mt-1"><strong>Power reserve:</strong> ${rule.reserve}</div><div class="mt-2">${rule.notes}</div><div class="provenance-line"><strong>Source:</strong> ${rule.source}<br><strong>Confidence:</strong> ${rule.confidence}</div>${rule.manualReview?missingReferenceButtonHtml():''}`);
            const obs=normaliseCalibreLoose(observedCalibre);
            if (obs && movementBox) {
                const ok=rule.calibre.some(c=>{const n=normaliseCalibreLoose(c); return obs===n || obs.includes(n) || n.includes(obs)});
                renderInformationBox(movementBox,ok?'success':'danger',ok?'Observed calibre is consistent':'Observed calibre mismatch',ok?`The observed calibre <strong>${observedCalibre}</strong> is consistent with ${rule.calibreDisplay}.`:`The observed calibre <strong>${observedCalibre}</strong> does not match the embedded expectation of ${rule.calibreDisplay}. Verify markings and reference before judging the watch.`);
            }
            return {recognised:!rule.manualReview,rule};
        }

        /* REP_DATABASE moved to data/watch-reference-data.js */


        function updateCounterDisplay() {
            const countEl = document.getElementById('inspection-count');
            if (countEl) countEl.innerText = inspections;
            
            const badge = document.getElementById('history-badge');
            if (badge) {
                if (watchHistory && watchHistory.length > 0) {
                    badge.innerText = watchHistory.length;
                    badge.classList.remove('hidden');
                } else {
                    badge.classList.add('hidden');
                }
            }

            const missingBadge = document.getElementById('missing-badge');
            if (missingBadge) {
                if (missingReferenceQueue && missingReferenceQueue.length > 0) {
                    missingBadge.innerText = missingReferenceQueue.length;
                    missingBadge.classList.remove('hidden');
                } else {
                    missingBadge.classList.add('hidden');
                }
            }

            const counterfeitBadge = document.getElementById('counterfeit-badge');
            if (counterfeitBadge) {
                const total = (counterfeitRegister || []).reduce((sum,item) => sum + (Number(item.timesSeen) || 1), 0);
                if (total > 0) { counterfeitBadge.innerText = total; counterfeitBadge.classList.remove('hidden'); }
                else counterfeitBadge.classList.add('hidden');
            }
        }

        /* --- Managing Sliding Drawer Panel UI --- */
        function toggleDrawer() {
            const drawer = document.getElementById('rolex-drawer');
            isDrawerOpen = !isDrawerOpen;
            if (isDrawerOpen) {
                drawer.classList.remove('translate-x-full');
            } else {
                drawer.classList.add('translate-x-full');
            }
                    queueMicrotask(updateManualReviewQueueActions);
}

        /* --- Managing Tab Switching Logic --- */
        const DASHBOARD_MODE_STORAGE_KEY = 'watchAuthProDashboardMode';

        function setDashboardMode(mode, persist = true) {
            const selectedMode = mode === 'advanced' ? 'advanced' : 'simple';
            const simpleMode = selectedMode === 'simple';

            document.body.classList.toggle('simple-mode', simpleMode);
            document.body.classList.toggle('advanced-mode', !simpleMode);

            const simpleButton = document.getElementById('simple-mode-btn');
            const advancedButton = document.getElementById('advanced-mode-btn');
            simpleButton?.classList.toggle('active', simpleMode);
            advancedButton?.classList.toggle('active', !simpleMode);
            simpleButton?.setAttribute('aria-pressed', simpleMode ? 'true' : 'false');
            advancedButton?.setAttribute('aria-pressed', simpleMode ? 'false' : 'true');

            const help = document.getElementById('workspace-mode-help');
            if (help) {
                help.textContent = simpleMode
                    ? 'Simple shows the essential inspection workflow.'
                    : 'Advanced shows research, logs, checklists and specialist tools.';
            }

            if (simpleMode) {
                switchTab('details');
                const drawer = document.getElementById('rolex-drawer');
                if (drawer) drawer.classList.add('translate-x-full');
                if (typeof isDrawerOpen !== 'undefined') isDrawerOpen = false;
            }

            if (persist) {
                try { localStorage.setItem(DASHBOARD_MODE_STORAGE_KEY, selectedMode); } catch (_) {}
            }
        }

        function initialiseDashboardMode() {
            let savedMode = 'simple';
            try { savedMode = localStorage.getItem(DASHBOARD_MODE_STORAGE_KEY) || 'simple'; } catch (_) {}
            setDashboardMode(savedMode, false);
        }

        function switchTab(tab) {
            if (document.body.classList.contains('simple-mode') && tab !== 'details') tab = 'details';
            const detailsBtn = document.getElementById('tab-details-btn');
            const checklistBtn = document.getElementById('tab-checklist-btn');
            const historyBtn = document.getElementById('tab-history-btn');
            const missingBtn = document.getElementById('tab-missing-btn');
            const counterfeitBtn = document.getElementById('tab-counterfeit-btn');

            const detailsContent = document.getElementById('tab-details-content');
            const checklistContent = document.getElementById('tab-checklist-content');
            const historyContent = document.getElementById('tab-history-content');
            const missingContent = document.getElementById('tab-missing-content');
            const counterfeitContent = document.getElementById('tab-counterfeit-content');
            
            const previewSection = document.getElementById('preview-section');
            const footerActions = document.getElementById('footer-actions');

            detailsContent.classList.add('hidden');
            checklistContent.classList.add('hidden');
            historyContent.classList.add('hidden');
            missingContent.classList.add('hidden');
            counterfeitContent.classList.add('hidden');

            [detailsBtn, checklistBtn, historyBtn, missingBtn, counterfeitBtn].forEach(btn => {
                btn.className = "text-sm font-bold pb-2 border-b-2 border-transparent text-gray-400 hover:text-white uppercase tracking-wider transition-all duration-200 flex items-center gap-2";
            });

            if (tab === 'details') {
                detailsBtn.className = "text-sm font-bold pb-2 border-b-2 border-blue-500 text-blue-500 uppercase tracking-wider transition-all duration-200";
                detailsContent.classList.remove('hidden');
                previewSection.classList.remove('hidden');
                footerActions.classList.remove('hidden');
            } else if (tab === 'checklist') {
                checklistBtn.className = "text-sm font-bold pb-2 border-b-2 border-blue-500 text-blue-500 uppercase tracking-wider transition-all duration-200";
                checklistContent.classList.remove('hidden');
                previewSection.classList.remove('hidden');
                footerActions.classList.remove('hidden');
            } else if (tab === 'history') {
                historyBtn.className = "text-sm font-bold pb-2 border-b-2 border-blue-500 text-blue-500 uppercase tracking-wider transition-all duration-200 flex items-center gap-2";
                historyContent.classList.remove('hidden');
                previewSection.classList.add('hidden');
                footerActions.classList.add('hidden');
                renderHistoryTable();
            } else if (tab === 'missing') {
                missingBtn.className = "text-sm font-bold pb-2 border-b-2 border-amber-500 text-amber-400 uppercase tracking-wider transition-all duration-200 flex items-center gap-2";
                missingContent.classList.remove('hidden');
                previewSection.classList.add('hidden');
                footerActions.classList.add('hidden');
                renderMissingQueue();
            } else if (tab === 'counterfeit') {
                counterfeitBtn.className = "text-sm font-bold pb-2 border-b-2 border-red-500 text-red-400 uppercase tracking-wider transition-all duration-200 flex items-center gap-2";
                counterfeitContent.classList.remove('hidden');
                previewSection.classList.add('hidden');
                footerActions.classList.add('hidden');
                renderCounterfeitRegister();
            }
        }

        function toggleChecklist() {
            const wrapper = document.getElementById('checklist-wrapper');
            const arrow = document.getElementById('checklist-arrow');
            isChecklistCollapsed = !isChecklistCollapsed;
            
            if (isChecklistCollapsed) {
                wrapper.classList.add('collapsed');
                arrow.classList.add('-rotate-90');
            } else {
                wrapper.classList.remove('collapsed');
                arrow.classList.remove('-rotate-90');
            }
        }

        /* --- Managing Serial Validation Logic --- */
        function matchPattern(serial, pattern) {
            if (!serial || !pattern) return false;
            let s = serial.trim().toUpperCase().replace(/[\s\u200B\u00A0]+/g, '');
            let p = pattern.trim().toUpperCase().replace(/[\s\u200B\u00A0]+/g, '');
            
            s = s.replace(/O/g, '0');
            p = p.replace(/O/g, '0');

            if (p === "NOTENOUGHINFO") return false;

            let escaped = p.replace(/[-\/\\^$*+?.()|[\]{}]/g, function(match) {
                if (match === '*') return '.';
                return '\\' + match;
            });
            
            let rx = new RegExp('^' + escaped + '$');
            return rx.test(s);
        }


        function normalizeClaspText(value) {
            return (value || '')
                .toUpperCase()
                .normalize('NFKC')
                .replace(/[\u200B\u00A0]/g, ' ')
                .trim();
        }

        function canonicalClaspCode(value) {
            // O and 0 can be difficult to distinguish on shallow or worn stamps.
            return normalizeClaspText(value)
                .replace(/[^A-Z0-9]/g, '')
                .replace(/O/g, '0');
        }

        function getKnownReplicaClaspCodes() {
            return [...new Set(REP_DATABASE.flatMap(record => record.clasps || []))];
        }

        function findReplicaClaspMatches(inputValue) {
            const displayInput = normalizeClaspText(inputValue);
            const compactInput = displayInput.replace(/[^A-Z0-9]/g, '');
            const canonicalInput = canonicalClaspCode(displayInput);
            const tokens = displayInput.split(/[^A-Z0-9]+/).filter(Boolean);
            const canonicalTokens = tokens.map(canonicalClaspCode);
            const knownCodes = getKnownReplicaClaspCodes();

            const matchedCodes = knownCodes.filter(code => {
                const rawCode = normalizeClaspText(code).replace(/[^A-Z0-9]/g, '');
                const canonicalCode = canonicalClaspCode(code);

                if (!canonicalCode) return false;
                if (canonicalInput === canonicalCode) return true;
                if (canonicalTokens.includes(canonicalCode)) return true;

                // Accept a known code at either end of a fuller clasp stamp, such as
                // "STEELINOX 7GJ" or "F80-B002", without matching arbitrary middle text.
                if (compactInput.length > rawCode.length) {
                    const canonicalCompact = canonicalClaspCode(compactInput);
                    if (canonicalCompact.startsWith(canonicalCode) || canonicalCompact.endsWith(canonicalCode)) {
                        return true;
                    }
                }
                return false;
            });

            const matches = [];
            matchedCodes.forEach(code => {
                REP_DATABASE.forEach(record => {
                    if ((record.clasps || []).some(c => canonicalClaspCode(c) === canonicalClaspCode(code))) {
                        matches.push({ code, record });
                    }
                });
            });

            return {
                input: displayInput,
                compactInput,
                matchedCodes,
                matches
            };
        }

        function autoDetectBrand(cleanSerial) {
            if (!cleanSerial) return null;
            
            for (let record of REP_DATABASE) {
                if (record.patterns.some(p => matchPattern(cleanSerial, p))) {
                    return "Rolex";
                }
            }

            if (/^\d{8}$/.test(cleanSerial)) return "Omega";
            if (/^[A-K]\d{5}$/.test(cleanSerial)) return "Audemars Piguet";
            if (/^\d[1-9OND]\d{4}$/.test(cleanSerial)) return "Grand Seiko";
            if (/^\d{7}$/.test(cleanSerial)) return "Breitling";
            if (/^[RLNXTWUPKYFDKZMVG]\d{6}$/.test(cleanSerial)) return "Rolex";
            if (/^OP\d{4}$/.test(cleanSerial) || /^BB\d{6,7}$/.test(cleanSerial)) return "Panerai";

            return null;
        }

        function checkRolexClasp() {
            runRolexForensicAnalysis();
        }

        function checkRolexSerial() {
            runRolexForensicAnalysis();
        }

        /* --- Rolex master reference-to-movement cross-check --- */

        /* ROLEX_MOVEMENT_RULES moved to data/watch-reference-data.js */


        let currentRolexMovementAssessment = null;
            updateCounterfeitMatchAlert();

        function normalizeRolexReferenceForMovement(ref) {
            const compact = String(ref || '').toUpperCase().replace(/[\s\-_.\/]/g, '');
            const match = compact.match(/^(\d{4,6}M?)/);
            return match ? match[1] : compact;
        }

        function normalizeCalibre(value) {
            const compact = String(value || '').toUpperCase().replace(/CAL(?:IBRE)?\.?/g, '').replace(/[^A-Z0-9]/g, '');
            const numeric = compact.match(/\d{4}/);
            return numeric ? numeric[0] : compact;
        }

        function escapeHtml(value) {
            return String(value ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function provenanceHtml(rule, brand) {
            const source = rule && rule.source ? rule.source : `${brand} embedded reference database`;
            const confidence = rule && rule.confidence ? rule.confidence : 'Compiled reference / verify production period';
            return `<div class="provenance-line"><strong>Database source:</strong> ${escapeHtml(source)}<br><strong>Confidence:</strong> ${escapeHtml(confidence)} · DB v${DATABASE_META.version}</div>`;
        }

        function missingReferenceButtonHtml() {
            return `<div class="flex flex-wrap gap-2 mt-2"><button type="button" class="missing-reference-button" onclick="addCurrentMissingReferenceToQueue()"><span aria-hidden="true">＋</span> Add to missing queue</button><button type="button" class="missing-reference-button" onclick="copyMissingReferenceReport()"><span aria-hidden="true">⧉</span> Copy report</button></div>`;
        }

        function copyTextWithFallback(text) {
            if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
            const area = document.createElement('textarea');
            area.value = text;
            area.style.position = 'fixed';
            area.style.opacity = '0';
            document.body.appendChild(area);
            area.focus();
            area.select();
            try { document.execCommand('copy'); } finally { area.remove(); }
            return Promise.resolve();
        }

        function copyMissingReferenceReport() {
            const brand = getSelectedBrand();
            const caseReference = (document.getElementById('caseRef')?.value || '').trim() || 'Not entered';
            const observedCalibre = (document.getElementById('movementCalibre')?.value || '').trim() || 'Not entered';
            const report = [
                'WATCH AUTH PRO — MISSING REFERENCE REPORT',
                `Database: v${DATABASE_META.version} (${DATABASE_META.updated})`,
                `Brand: ${brand}`,
                `Reference from case: ${caseReference}`,
                `Observed calibre: ${observedCalibre}`,
                'Current result: No exact embedded model/calibre mapping',
                'Requested action: Research and add source-backed live guidance; do not add diagnostics to the final authentication note.'
            ].join('\n');
            copyTextWithFallback(report)
                .then(() => showToast('MISSING REFERENCE REPORT COPIED'))
                .catch(() => showToast('COPY FAILED — SELECT REPORT MANUALLY'));
        }



        const WATCH_RESEARCH_DRAFT_KEY = 'watch_auth_pro_current_research_note';

        function watchResearchIdentity() {
            const brand = getSelectedBrand() || 'Not selected';
            const reference = (document.getElementById('caseRef')?.value || '').trim() || 'Not entered';
            const serial = (document.getElementById('serialInput')?.value || '').trim() || 'Not entered';
            const calibre = (document.getElementById('movementCalibre')?.value || '').trim() || 'Not entered';
            return { brand, reference, serial, calibre };
        }

        function renderWatchResearchNoteSnapshot() {
            const container = document.getElementById('watch-research-note-snapshot');
            if (!container) return;
            const identity = watchResearchIdentity();
            container.innerHTML = [
                ['Brand', identity.brand],
                ['Reference', identity.reference],
                ['Serial', identity.serial],
                ['Calibre', identity.calibre]
            ].map(([label, value]) =>
                `<span class="watch-research-note-chip"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</span>`
            ).join('');
        }

        function currentWatchResearchDraft() {
            const identity = watchResearchIdentity();
            const textValue = (document.getElementById('watch-research-note-text')?.value || '').trim();
            return { ...identity, text: textValue, updatedAt: new Date().toISOString() };
        }

        function persistWatchResearchDraft() {
            const field = document.getElementById('watch-research-note-text');
            if (!field) return;
            const draft = currentWatchResearchDraft();
            if (!draft.text) {
                try { localStorage.removeItem(WATCH_RESEARCH_DRAFT_KEY); } catch (_) {}
                return;
            }
            try { localStorage.setItem(WATCH_RESEARCH_DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
            const status = document.getElementById('watch-research-note-status');
            if (status) status.textContent = 'Draft retained in this browser.';
        }

        function restoreWatchResearchDraft() {
            let draft = null;
            try { draft = JSON.parse(localStorage.getItem(WATCH_RESEARCH_DRAFT_KEY) || 'null'); } catch (_) {}
            if (!draft?.text) return;
            const field = document.getElementById('watch-research-note-text');
            if (!field || field.value.trim()) return;
            field.value = draft.text;
            const status = document.getElementById('watch-research-note-status');
            if (status) status.textContent = 'Unsaved draft restored.';
        }

        function handleWatchResearchNotesToggle() {
            const details = document.getElementById('watch-research-notes');
            if (!details?.open) return;
            renderWatchResearchNoteSnapshot();
            restoreWatchResearchDraft();
        }

        function saveWatchResearchNote() {
            const note = (document.getElementById('watch-research-note-text')?.value || '').trim();
            if (!note) {
                showToast('WRITE A RESEARCH NOTE FIRST');
                document.getElementById('watch-research-note-text')?.focus();
                return;
            }

            const snapshot = currentResearchSnapshot();
            const record = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                addedAt: new Date().toISOString(),
                brand: snapshot.brand,
                reference: snapshot.reference,
                serial: snapshot.serial,
                movementType: snapshot.movementType,
                observedCalibre: snapshot.observedCalibre,
                inspectionId: snapshot.inspectionId,
                requestType: 'Authenticator watch note',
                details: note,
                evidence: '',
                currentResult: snapshot.currentResult,
                source: 'Main-screen watch note'
            };

            missingReferenceQueue.unshift(record);
            safeStorageSet('missing_reference_queue', JSON.stringify(missingReferenceQueue));
            renderMissingQueue();
            updateCounterDisplay();

            try { localStorage.removeItem(WATCH_RESEARCH_DRAFT_KEY); } catch (_) {}
            const status = document.getElementById('watch-research-note-status');
            if (status) status.textContent = 'Saved to Research Queue for a future database update.';
            showToast('WATCH NOTE SAVED FOR RESEARCH');
        }

        function clearWatchResearchNote() {
            const field = document.getElementById('watch-research-note-text');
            if (field) field.value = '';
            try { localStorage.removeItem(WATCH_RESEARCH_DRAFT_KEY); } catch (_) {}
            const status = document.getElementById('watch-research-note-status');
            if (status) status.textContent = 'Cleared.';
        }

        function initialiseWatchResearchNotes() {
            const field = document.getElementById('watch-research-note-text');
            if (field) {
                field.addEventListener('input', () => {
                    clearTimeout(field._researchDraftTimer);
                    field._researchDraftTimer = setTimeout(persistWatchResearchDraft, 450);
                });
            }
            ['caseRef','serialInput','movementCalibre'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', renderWatchResearchNoteSnapshot);
                    element.addEventListener('change', renderWatchResearchNoteSnapshot);
                }
            });
            document.querySelectorAll('.brand-checkbox').forEach(input =>
                input.addEventListener('change', renderWatchResearchNoteSnapshot)
            );
            renderWatchResearchNoteSnapshot();
        }

        function researchReportText(id, maxLength = 900) {
            const element = document.getElementById(id);
            if (!element || element.classList.contains('hidden')) return '';
            const value = element.textContent.replace(/\s+/g, ' ').trim();
            if (!value) return '';
            return value.length > maxLength ? value.slice(0, maxLength - 1).trim() + '…' : value;
        }

        function currentResearchSnapshot() {
            const brand = getSelectedBrand() || 'Not selected';
            const reference = (document.getElementById('caseRef')?.value || '').trim() || 'Not entered';
            const serial = (document.getElementById('serialInput')?.value || '').trim() || 'Not entered';
            const movementType = document.getElementById('movementType')?.value || 'Not entered';
            const observedCalibre = (document.getElementById('movementCalibre')?.value || '').trim() || 'Not entered';
            const inspectionId = (document.getElementById('inspectionId')?.value || document.getElementById('caseNumber')?.value || '').trim() || '';
            const comments = (document.getElementById('comments')?.value || '').trim();
            const outputs = [
                researchReportText('caseResult'),
                researchReportText('serialResult'),
                researchReportText('dateEstimateResult'),
                researchReportText('ageClassificationResult'),
                researchReportText('movementMatchResult'),
                researchReportText('counterfeit-match-alert')
            ].filter(Boolean);

            return {
                brand, reference, serial, movementType, observedCalibre,
                inspectionId, comments,
                currentResult: outputs.join('\n') || 'No watch-specific live guidance was produced.'
            };
        }

        function renderResearchReportSnapshot(snapshot) {
            const container = document.getElementById('research-report-snapshot');
            if (!container) return;
            const facts = [
                ['Brand', snapshot.brand],
                ['Reference', snapshot.reference],
                ['Serial', snapshot.serial],
                ['Observed calibre', snapshot.observedCalibre],
                ['Movement', snapshot.movementType],
                ['Inspection ID', snapshot.inspectionId || 'Not entered']
            ];
            container.innerHTML = facts.map(([label, value]) =>
                `<div class="research-report-fact"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`
            ).join('');
        }

        function openMissingInformationReport() {
            const overlay = document.getElementById('research-report-overlay');
            if (!overlay) return;
            const snapshot = currentResearchSnapshot();
            renderResearchReportSnapshot(snapshot);
            const current = document.getElementById('research-report-current');
            if (current) current.textContent = snapshot.currentResult;
            const details = document.getElementById('research-report-details');
            const evidence = document.getElementById('research-report-evidence');
            if (details) details.value = '';
            if (evidence) evidence.value = snapshot.comments || '';
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
            setTimeout(() => details?.focus(), 40);
        }

        function closeMissingInformationReport() {
            const overlay = document.getElementById('research-report-overlay');
            if (!overlay) return;
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        }

        function closeMissingInformationReportFromBackdrop(event) {
            if (event.target?.id === 'research-report-overlay') closeMissingInformationReport();
        }

        function saveMissingInformationReport(copyAfterSave = false) {
            const details = (document.getElementById('research-report-details')?.value || '').trim();
            if (!details) {
                showToast('DESCRIBE WHAT IS MISSING OR WRONG');
                document.getElementById('research-report-details')?.focus();
                return;
            }

            const snapshot = currentResearchSnapshot();
            const requestType = document.getElementById('research-report-type')?.value || 'Other missing information';
            const evidence = (document.getElementById('research-report-evidence')?.value || '').trim();

            const record = {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                addedAt: new Date().toISOString(),
                brand: snapshot.brand,
                reference: snapshot.reference,
                serial: snapshot.serial,
                movementType: snapshot.movementType,
                observedCalibre: snapshot.observedCalibre,
                inspectionId: snapshot.inspectionId,
                requestType,
                details,
                evidence,
                currentResult: snapshot.currentResult,
                source: 'Authenticator report'
            };

            missingReferenceQueue.unshift(record);
            safeStorageSet('missing_reference_queue', JSON.stringify(missingReferenceQueue));
            renderMissingQueue();
            updateCounterDisplay();
            closeMissingInformationReport();

            if (copyAfterSave) {
                copyTextWithFallback(missingQueueReport(record))
                    .then(() => showToast('RESEARCH REPORT SAVED AND COPIED'))
                    .catch(() => showToast('REPORT SAVED — COPY FAILED'));
            } else {
                showToast('RESEARCH REPORT SAVED');
            }
        }

        function currentMissingReferenceRecord() {
            return {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                addedAt: new Date().toISOString(),
                brand: getSelectedBrand() || 'Not selected',
                reference: (document.getElementById('caseRef')?.value || '').trim() || 'Not entered',
                serial: (document.getElementById('serialInput')?.value || '').trim() || 'Not entered',
                movementType: document.getElementById('movementType')?.value || 'Not entered',
                observedCalibre: (document.getElementById('movementCalibre')?.value || '').trim() || 'Not entered',
                inspectionId: (document.getElementById('inspectionId')?.value || document.getElementById('caseNumber')?.value || '').trim() || '',
                requestType: 'Missing reference mapping',
                details: 'No exact embedded model/calibre mapping',
                evidence: '',
                currentResult: researchReportText('caseResult') || researchReportText('movementMatchResult') || 'No exact embedded model/calibre mapping',
                source: 'Automatic missing-reference queue'
            };
        }

        function addCurrentMissingReferenceToQueue() {
            const record = currentMissingReferenceRecord();
            const existingIndex = missingReferenceQueue.findIndex(item =>
                String(item.brand).toUpperCase() === String(record.brand).toUpperCase() &&
                String(item.reference).toUpperCase() === String(record.reference).toUpperCase()
            );
            if (existingIndex >= 0) {
                const existing = missingReferenceQueue[existingIndex];
                const newHasCalibre = record.observedCalibre && record.observedCalibre !== 'Not entered';
                const oldHasCalibre = existing.observedCalibre && existing.observedCalibre !== 'Not entered';
                if (newHasCalibre && (!oldHasCalibre || String(existing.observedCalibre).toUpperCase() !== String(record.observedCalibre).toUpperCase())) {
                    missingReferenceQueue[existingIndex] = {...existing, observedCalibre: record.observedCalibre, addedAt: record.addedAt, inspectionId: record.inspectionId || existing.inspectionId};
                    safeStorageSet('missing_reference_queue', JSON.stringify(missingReferenceQueue));
                    renderMissingQueue(); updateCounterDisplay(); showToast('MISSING QUEUE ENTRY UPDATED'); return;
                }
                showToast('ALREADY IN MISSING QUEUE'); return;
            }
            missingReferenceQueue.unshift(record);
            safeStorageSet('missing_reference_queue', JSON.stringify(missingReferenceQueue));
            updateCounterDisplay();
            showToast('ADDED TO MISSING REFERENCE QUEUE');
        }

        function missingQueueReport(record) {
            const isManual = ['Authenticator report','Main-screen watch note'].includes(record.source) || record.details;
            return [
                isManual ? 'WATCH AUTH PRO — MISSING INFORMATION REPORT' : 'WATCH AUTH PRO — MISSING REFERENCE REPORT',
                `Database: v${DATABASE_META.version} (${DATABASE_META.updated})`,
                `Brand: ${record.brand || 'Not selected'}`,
                `Reference: ${record.reference || 'Not entered'}`,
                record.serial ? `Serial: ${record.serial}` : null,
                record.movementType ? `Movement technology: ${record.movementType}` : null,
                `Observed calibre: ${record.observedCalibre || 'Not entered'}`,
                record.inspectionId ? `Inspection ID: ${record.inspectionId}` : null,
                record.requestType ? `Request type: ${record.requestType}` : null,
                record.details ? `Missing or incorrect information: ${record.details}` : null,
                record.evidence ? `Evidence or observation: ${record.evidence}` : null,
                `Current result: ${record.currentResult || 'No exact embedded model/calibre mapping'}`,
                'Requested action: Research using reliable sources and add appropriate live guidance in the subsequent database update; do not add diagnostics to the final authentication note.'
            ].filter(Boolean).join('\n');
        }

        function renderMissingQueue() {
            const body = document.getElementById('missing-queue-body');
            const empty = document.getElementById('missing-queue-empty');
            if (!body || !empty) return;
            body.innerHTML = '';
            if (!missingReferenceQueue.length) { empty.classList.remove('hidden'); return; }
            empty.classList.add('hidden');
            missingReferenceQueue.forEach(record => {
                const tr = document.createElement('tr');
                const requestSummary = record.details || record.requestType || 'Missing reference mapping';
                tr.innerHTML = `<td class="p-4 text-gray-400">${escapeHtml(new Date(record.addedAt).toLocaleString())}</td><td class="p-4 font-bold text-white">${escapeHtml(record.brand)}</td><td class="p-4 font-mono text-blue-300">${escapeHtml(record.reference)}</td><td class="p-4 font-mono text-gray-300">${escapeHtml(record.observedCalibre)}</td><td class="p-4 text-gray-300 max-w-[300px]">${escapeHtml(requestSummary)}</td><td class="p-4 text-gray-400">${escapeHtml(record.inspectionId || '—')}</td><td class="p-4 text-right whitespace-nowrap"><button class="action-secondary mr-2" onclick="copyMissingQueueItem('${record.id}')">Copy</button><button class="action-danger" onclick="removeMissingQueueItem('${record.id}')">Remove</button></td>`;
                body.appendChild(tr);
            });
        }

        function copyMissingQueueItem(id) {
            const record = missingReferenceQueue.find(item => item.id === id);
            if (!record) return;
            copyTextWithFallback(missingQueueReport(record)).then(() => showToast('MISSING REFERENCE REPORT COPIED'));
        }

        function removeMissingQueueItem(id) {
            missingReferenceQueue = missingReferenceQueue.filter(item => item.id !== id);
            safeStorageSet('missing_reference_queue', JSON.stringify(missingReferenceQueue));
            updateCounterDisplay();
            renderMissingQueue();
        }

        function clearMissingQueue() {
            if (!missingReferenceQueue.length) return;
            missingReferenceQueue = [];
            safeStorageSet('missing_reference_queue', '[]');
            updateCounterDisplay();
            renderMissingQueue();
            showToast('MISSING REFERENCE QUEUE CLEARED');
        }

        function copyMissingQueue() {
            if (!missingReferenceQueue.length) { showToast('MISSING QUEUE IS EMPTY'); return; }
            const text = missingReferenceQueue.map(missingQueueReport).join('\n\n---\n\n');
            copyTextWithFallback(text).then(() => showToast('MISSING REFERENCE QUEUE COPIED'));
        }

        function csvCell(value) {
            return `"${String(value ?? '').replace(/"/g, '""')}"`;
        }

        function exportMissingQueueCSV() {
            if (!missingReferenceQueue.length) { showToast('MISSING QUEUE IS EMPTY'); return; }
            const rows = [['Added','Brand','Reference','Serial','Movement Technology','Observed Calibre','Request Type','Missing or Incorrect Information','Evidence or Observation','Current Result','Inspection ID','Database Version']];
            missingReferenceQueue.forEach(item => rows.push([
                item.addedAt,
                item.brand,
                item.reference,
                item.serial || '',
                item.movementType || '',
                item.observedCalibre,
                item.requestType || 'Missing reference mapping',
                item.details || '',
                item.evidence || '',
                item.currentResult || 'No exact embedded model/calibre mapping',
                item.inspectionId || '',
                DATABASE_META.version
            ]));
            const csv = rows.map(row => row.map(csvCell).join(',')).join('\r\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `watch-auth-pro-missing-references-v${DATABASE_META.version}.csv`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        }

        /* KNOWN_FAKE_SERIAL_INTELLIGENCE moved to data/watch-reference-data.js */


        /* KNOWN_FAKE_SERIAL_SOURCE moved to data/watch-reference-data.js */


        function counterfeitKeyPart(value) { return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g,''); }

        function getCurrentCounterfeitMatches() {
            const brand = getSelectedBrand() || 'Generic';
            const reference = counterfeitKeyPart(document.getElementById('caseRef')?.value);
            const serial = counterfeitKeyPart(document.getElementById('serialInput')?.value);
            const exactSerial = serial ? counterfeitRegister.filter(x => counterfeitKeyPart(x.serial) === serial) : [];
            const exactReference = reference ? counterfeitRegister.filter(x => counterfeitKeyPart(x.reference) === reference && String(x.brand).toUpperCase() === String(brand).toUpperCase()) : [];
            const historicalSerialCount = serial ? Number(KNOWN_FAKE_SERIAL_INTELLIGENCE[serial] || 0) : 0;
            return { exactSerial, exactReference, historicalSerialCount, serial };
        }

        function updateCounterfeitMatchAlert() {
            const box = document.getElementById('counterfeit-match-alert');
            if (!box) return;
            const { exactSerial, exactReference, historicalSerialCount, serial } = getCurrentCounterfeitMatches();
            if (!exactSerial.length && !exactReference.length && !historicalSerialCount) {
                box.classList.add('hidden');
                box.classList.remove('known-fake-intelligence-alert');
                box.classList.add('counterfeit-alert');
                box.innerHTML='';
                return;
            }

            const localLines=[];
            if (exactSerial.length) {
                const total=exactSerial.reduce((n,x)=>n+(Number(x.timesSeen)||1),0);
                const refs=[...new Set(exactSerial.map(x=>x.reference).filter(Boolean))].join(', ');
                localLines.push(`<strong>Previously recorded by your team</strong><p>This serial has been recorded on ${total} locally confirmed counterfeit inspection${total===1?'':'s'}${refs?` (reference${refs.includes(',')?'s':''}: ${escapeHtml(refs)})`:''}. Stop and compare the current watch with the earlier record.</p>`);
            }
            if (exactReference.length) {
                const total=exactReference.reduce((n,x)=>n+(Number(x.timesSeen)||1),0);
                localLines.push(`<strong>Local counterfeit reference history</strong><p>${escapeHtml(getSelectedBrand())} ${escapeHtml(document.getElementById('caseRef')?.value || '')} appears in ${total} locally confirmed counterfeit record${total===1?'':'s'}. The reference alone is not evidence of a fake; compare serials and repeated component patterns.</p>`);
            }

            const historicalLine = historicalSerialCount
                ? `<strong>Known-fake intelligence match</strong><p>Serial <span class="font-mono">${escapeHtml(serial)}</span> appears ${historicalSerialCount} time${historicalSerialCount===1?'':'s'} in the imported historical known-fake list. Treat this as a strong warning requiring comparison and escalation, not automatic proof by itself.</p>`
                : '';

            if (localLines.length) {
                box.classList.remove('known-fake-intelligence-alert');
                box.classList.add('counterfeit-alert');
                const divider = historicalLine ? '<div class="mt-3 pt-3 border-t border-red-300/20"></div>' : '';
                box.innerHTML = localLines.join('<div class="mt-3 pt-3 border-t border-red-300/20"></div>') + divider + historicalLine;
            } else {
                box.classList.remove('counterfeit-alert');
                box.classList.add('known-fake-intelligence-alert');
                box.innerHTML = historicalLine;
            }
            box.classList.remove('hidden');
        }

        function recordCurrentCounterfeit() {
            const brand=getSelectedBrand() || 'Generic';
            const reference=(document.getElementById('caseRef')?.value || '').trim();
            const serial=(document.getElementById('serialInput')?.value || '').trim();
            if (!reference && !serial) { showToast('ENTER A REFERENCE OR SERIAL FIRST'); return; }
            const now=new Date().toISOString();
            const calibre=(document.getElementById('movementCalibre')?.value || '').trim();
            const notes=(document.getElementById('comments')?.value || '').trim();
            const serialKey=counterfeitKeyPart(serial), refKey=counterfeitKeyPart(reference);
            let index=-1;
            if (serialKey) index=counterfeitRegister.findIndex(x=>counterfeitKeyPart(x.serial)===serialKey);
            if (index<0 && refKey && !serialKey) index=counterfeitRegister.findIndex(x=>String(x.brand).toUpperCase()===brand.toUpperCase() && counterfeitKeyPart(x.reference)===refKey && !counterfeitKeyPart(x.serial));
            if (index>=0) {
                const old=counterfeitRegister[index];
                counterfeitRegister[index]={...old,lastSeen:now,timesSeen:(Number(old.timesSeen)||1)+1,brand,reference:reference||old.reference,serial:serial||old.serial,calibre:calibre||old.calibre,notes:notes||old.notes};
            } else {
                counterfeitRegister.unshift({id:`CF-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,firstSeen:now,lastSeen:now,timesSeen:1,brand,reference:reference||'',serial:serial||'',calibre:calibre||'',notes:notes||''});
            }
            safeStorageSet('counterfeit_register',JSON.stringify(counterfeitRegister));
            updateCounterfeitMatchAlert(); updateCounterDisplaySafe(); renderCounterfeitRegister();
            showToast(index>=0?'COUNTERFEIT SIGHTING COUNT UPDATED':'COUNTERFEIT RECORDED');
        }

        function updateCounterDisplaySafe(){ updateCounterDisplay(); }

        function renderCounterfeitRegister() {
            const body=document.getElementById('counterfeit-table-body'), empty=document.getElementById('counterfeit-empty');
            if(!body||!empty)return; body.innerHTML='';
            if(!counterfeitRegister.length){empty.classList.remove('hidden');return;} empty.classList.add('hidden');
            counterfeitRegister.forEach(item=>{const tr=document.createElement('tr');tr.innerHTML=`<td class="p-4 text-gray-400">${escapeHtml(new Date(item.firstSeen).toLocaleString())}</td><td class="p-4 text-gray-400">${escapeHtml(new Date(item.lastSeen).toLocaleString())}</td><td class="p-4 font-black text-red-300">${escapeHtml(item.timesSeen||1)}</td><td class="p-4 font-bold text-white">${escapeHtml(item.brand)}</td><td class="p-4 font-mono text-blue-300">${escapeHtml(item.reference||'—')}</td><td class="p-4 font-mono text-red-300">${escapeHtml(item.serial||'—')}</td><td class="p-4 font-mono text-gray-300">${escapeHtml(item.calibre||'—')}</td><td class="p-4 text-gray-400 max-w-[280px]">${escapeHtml(item.notes||'—')}</td><td class="p-4 text-right"><button class="action-danger" onclick="removeCounterfeitRecord('${item.id}')">Remove</button></td>`;body.appendChild(tr);});
        }

        function removeCounterfeitRecord(id){counterfeitRegister=counterfeitRegister.filter(x=>x.id!==id);safeStorageSet('counterfeit_register',JSON.stringify(counterfeitRegister));renderCounterfeitRegister();updateCounterfeitMatchAlert();updateCounterDisplay();}
        function clearCounterfeitRegister(){if(!counterfeitRegister.length)return;counterfeitRegister=[];safeStorageSet('counterfeit_register','[]');renderCounterfeitRegister();updateCounterfeitMatchAlert();updateCounterDisplay();showToast('COUNTERFEIT REGISTER CLEARED');}
        function exportCounterfeitCSV(){if(!counterfeitRegister.length){showToast('COUNTERFEIT REGISTER IS EMPTY');return;}const rows=[['First Seen','Last Seen','Times Seen','Brand','Reference','Serial','Calibre','Notes','Database Version']];counterfeitRegister.forEach(x=>rows.push([x.firstSeen,x.lastSeen,x.timesSeen||1,x.brand,x.reference,x.serial,x.calibre,x.notes,DATABASE_META.version]));const csv=rows.map(r=>r.map(csvCell).join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`watch-auth-pro-counterfeit-register-v${DATABASE_META.version}.csv`;document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);}

        function updateDatabaseStatus() {
            const status = document.getElementById('database-status');
            if (!status) return;
            const rolexRefs = new Set(ROLEX_MOVEMENT_RULES.flatMap(rule => rule.refs || [])).size;
            const tudorRules = TUDOR_REFERENCE_RULES.length;
            const omegaRefs = new Set(OMEGA_REFERENCE_RULES.flatMap(rule => rule.refs || [])).size;
            const breitlingRules = BREITLING_REFERENCE_RULES.length;
            const cartierRules = CARTIER_REFERENCE_RULES.length;
            const otherRules = OTHER_REFERENCE_RULES.length;
            status.textContent = `DB v${DATABASE_META.version} · Updated ${DATABASE_META.updated} · ${rolexRefs} Rolex refs · ${tudorRules} Tudor rules · ${omegaRefs} Omega refs · ${breitlingRules} Breitling rules · ${cartierRules} Cartier rule`;
        }

        function renderRolexMovementMasterTable(query = '') {
            const container = document.getElementById('rolex-movement-master-table');
            if (!container) return;
            const term = String(query || '').trim().toUpperCase();
            const filtered = ROLEX_MOVEMENT_RULES.filter(rule => {
                if (!term) return true;
                const haystack = [rule.section, rule.model, rule.refs.join(' '), rule.calibre.join(' '), rule.feature || ''].join(' ').toUpperCase();
                return haystack.includes(term);
            });

            if (!filtered.length) {
                container.innerHTML = `<div class="p-4 text-gray-500 italic">No embedded Rolex movement mapping matches “${escapeHtml(query)}”.</div>`;
                return;
            }

            const grouped = filtered.reduce((acc, rule) => {
                (acc[rule.section] ||= []).push(rule);
                return acc;
            }, {});

            container.innerHTML = Object.entries(grouped).map(([section, rules]) => `
                <div class="border-b border-gray-800 last:border-b-0">
                    <div class="bg-gray-950 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-blue-400">${escapeHtml(section)}</div>
                    <div class="divide-y divide-gray-850 max-h-72 overflow-y-auto">
                        ${rules.map(rule => {
                            const expected = rule.calibreLabel || rule.calibre.map(cal => `Cal. ${cal}`).join(' / ');
                            const caution = rule.periodNote ? `<div class="mt-1 text-[10px] text-amber-300">Period-dependent</div>` : '';
                            return `<button type="button" onclick="applyRolexMovementReference('${escapeHtml(rule.refs[0])}')" class="w-full text-left p-3 hover:bg-gray-800/40 transition">
                                <div class="flex items-start justify-between gap-3">
                                    <div><div class="font-mono font-bold text-white">${escapeHtml(rule.refs.join(', '))}</div><div class="mt-1 text-gray-400">${escapeHtml(rule.model)}</div>${caution}</div>
                                    <div class="text-right font-bold text-emerald-300 shrink-0">${escapeHtml(expected)}</div>
                                </div>
                            </button>`;
                        }).join('')}
                    </div>
                </div>
            `).join('');
        }

        function applyRolexMovementReference(reference) {
            const input = document.getElementById('caseRef');
            if (!input) return;
            input.value = reference;
            runRolexForensicAnalysis();
            input.focus();
            showToast(`ROLEX REF ${reference} LOADED`);
        }

        function decodeRolexMovement(reference) {
            const core = normalizeRolexReferenceForMovement(reference);
            if (!core) return null;
            const exact = ROLEX_MOVEMENT_RULES.find(rule => rule.refs.includes(core));
            if (exact) return { ...exact, core, exact: true };

            let eraHint = null;
            if (/^(116|114|166)/.test(core)) {
                eraHint = "Older six-digit movement era. Many families use a 31xx movement with roughly 48 hours of reserve, but Daytona and other exceptions require a family-specific lookup.";
            } else if (/^(126|124|128|136|218|224|226|228)/.test(core)) {
                eraHint = "Current-generation reference era. Many families use a 32xx movement with roughly 70 hours of reserve, but exact family mapping overrides the broad prefix rule.";
            }
            return { core, exact: false, eraHint };
        }

        function assessRolexMovement(reference, observedCalibre) {
            const decoded = decodeRolexMovement(reference);
            if (!decoded) return null;
            const observed = normalizeCalibre(observedCalibre);
            if (!decoded.exact) return { ...decoded, observed, status: 'hint' };
            if (!observed) return { ...decoded, observed, status: 'expected' };
            const matches = decoded.calibre.includes(observed);
            return { ...decoded, observed, status: matches ? 'match' : 'mismatch' };
        }

        function renderRolexMovementAssessment(reference, observedCalibre, box) {
            const assessment = assessRolexMovement(reference, observedCalibre);
            currentRolexMovementAssessment = assessment;
            if (!assessment) return null;

            if (!assessment.exact) {
                renderInformationBox(box, 'info', 'Rolex movement-era clue', `${assessment.eraHint || 'No reliable broad movement-era clue is available for this reference.'}<div class="mt-2">An exact family rule is not embedded for <strong>${assessment.core}</strong>; verify the full reference before judging the movement.</div>${missingReferenceButtonHtml()}`);
                return assessment;
            }

            const expectedText = assessment.calibreLabel || assessment.calibre.map(cal => `Cal. ${cal}`).join(' or ');
            const reserveLine = assessment.reserve ? `<div class="mt-1"><strong>Factory reserve:</strong> ${assessment.reserve}.</div>` : '';
            const featureLine = assessment.feature ? `<div class="mt-1"><strong>Key movement feature:</strong> ${assessment.feature}.</div>` : '';
            const cautionLine = assessment.periodNote ? `<div class="mt-2 rounded-lg border border-amber-900/40 bg-amber-950/20 p-2 text-amber-200"><strong>Production-period caution:</strong> ${assessment.periodNote}</div>` : '';
            const common = `<div class="mt-2"><strong>Model family:</strong> ${assessment.model}.</div>${featureLine}${reserveLine}${cautionLine}${provenanceHtml(assessment, 'Rolex')}`;
            if (assessment.status === 'mismatch') {
                renderInformationBox(box, 'danger', 'Rolex movement mismatch', `Reference <strong>${assessment.core}</strong> should contain <strong>${expectedText}</strong>, but the observed entry is <strong>Cal. ${assessment.observed}</strong>. This is not a listed original factory configuration.${common}`);
            } else if (assessment.status === 'match') {
                renderInformationBox(box, 'success', 'Rolex movement matches reference', `Reference <strong>${assessment.core}</strong> is mapped to <strong>${expectedText}</strong>, and the observed calibre entry matches the master cross-reference.${common}`);
            } else {
                renderInformationBox(box, 'info', 'Expected Rolex movement', `Reference <strong>${assessment.core}</strong> should contain <strong>${expectedText}</strong>. Enter the observed calibre to perform a direct mismatch check.${common}`);
            }
            return assessment;
        }

        /* --- Decode Rolex reference structures (Digits Breakdown) --- */
        function getModelFromPrefix(prefix) {
            const prefixMap = {
                "162": "Datejust 36",
                "1162": "Datejust 36",
                "1262": "Datejust 36",
                "1263": "Datejust 41",
                "1163": "Datejust II",
                "166": "Submariner Date / Sea-Dweller / Yacht-Master",
                "1166": "Submariner Date / Yacht-Master / Sea-Dweller",
                "1266": "Submariner Date / Sea-Dweller / Yacht-Master",
                "140": "Submariner (No Date) / Air-King",
                "1140": "Submariner (No Date)",
                "1240": "Submariner (No Date)",
                "1165": "Daytona",
                "1265": "Daytona",
                "165": "Explorer II / Daytona (Zenith Era)",
                "2165": "Explorer II",
                "2265": "Explorer II",
                "142": "Explorer",
                "1142": "Explorer / Air-King",
                "2142": "Explorer",
                "1242": "Explorer",
                "2242": "Explorer",
                "180": "Day-Date 36",
                "182": "Day-Date 36",
                "1182": "Day-Date 36",
                "1282": "Day-Date 36",
                "2282": "Day-Date 40",
                "2182": "Day-Date II",
                "167": "GMT-Master / GMT-Master II",
                "1167": "GMT-Master II",
                "1267": "GMT-Master II",
                "1164": "Milgauss",
                "101": "Milgauss / Explorer"
            };
            return prefixMap[prefix] || `Model Series (${prefix}-Prefix)`;
        }

        /* ROLEX_SUFFIX_CODES moved to data/watch-reference-data.js */


        function splitRolexReference(ref) {
            const compact = String(ref || '').toUpperCase().replace(/[\s\-_.\/]/g, '');
            const match = compact.match(/^(\d{4,6}M?)([A-Z0-9]*)$/);
            const core = match ? match[1] : compact;
            return { full: compact, core, numeric: core.replace(/M$/, ''), suffix: match ? match[2] : '' };
        }

        function decodeRolexReference(ref) {
            if (!ref) return null;
            const parsed = splitRolexReference(ref);
            const numericRef = parsed.numeric;
            const lastDigit = numericRef.slice(-1);
            const metal = ROLEX_METALS[lastDigit] || 'Unknown material / family-specific code';
            let bezel = 'Unknown bezel / family-specific code';
            let model = 'Unknown model family';

            const exactMovementRule = decodeRolexMovement(parsed.core);
            if (exactMovementRule && exactMovementRule.exact) model = exactMovementRule.model;

            if (/^14010M?$/.test(parsed.core)) {
                model = 'Air-King 34 mm';
                bezel = 'Fixed engine-turned steel bezel';
                const suffixLabel = parsed.suffix ? (ROLEX_SUFFIX_CODES[parsed.suffix] || 'configuration suffix requiring model-specific verification') : '';
                return { ...parsed, model, bezel, metal, suffixLabel };
            }

            if (numericRef.length >= 5) {
                const penDigit = numericRef.slice(-2, -1);
                bezel = ROLEX_BEZELS[penDigit] || 'Family-specific bezel code';
                if (model === 'Unknown model family') {
                    const modelPrefix = numericRef.slice(0, -2);
                    model = getModelFromPrefix(modelPrefix);
                }
            } else if (numericRef.length === 4) {
                const modelPrefix = numericRef.slice(0, -1);
                if (model === 'Unknown model family') model = getModelFromPrefix(modelPrefix) + ' (Vintage 4-Digit Era)';
                bezel = 'Refer to vintage family-specific specifications';
            }

            const suffixLabel = parsed.suffix ? (ROLEX_SUFFIX_CODES[parsed.suffix] || 'configuration suffix requiring model-specific verification') : '';
            return { ...parsed, model, bezel, metal, suffixLabel };
        }

        function referenceIsRecognisedForBrand(brand, value) {
            if (!value || !value.trim()) return false;
            const clean = value.trim();
            try {
                if (brand === 'Tudor') { const hit = lookupTudorReference(clean); return Boolean(hit && hit.rule && !hit.rule.manualReview); }
                if (brand === 'Omega') return Boolean(lookupOmegaReference(clean));
                if (brand === 'Breitling') return Boolean(lookupBreitlingReference(clean));
                if (brand === 'Cartier') return Boolean(lookupCartierReference(clean));
                if (['Generic','Longines','IWC','TAG Heuer','Rado','Vertex','Seiko','Studio Underd0g','Grand Seiko','Lemania','CWC','Chanel','Sinn','Bremont','Ebel','Fears','Raymond Weil','Blancpain','Christopher Ward','Oris','Panerai'].includes(brand)) { const hit = lookupOtherReference(brand, clean); return Boolean(hit && !hit.manualReview); }
                if (brand === 'Rolex') {
                    const core = normalizeRolexReferenceForMovement(clean);
                    return Boolean(core && ROLEX_MOVEMENT_RULES.some(rule => (rule.refs || []).includes(core)));
                }
            } catch (error) {
                return false;
            }
            return false;
        }

        function getReferenceInputs() {
            const caseStamped = (document.getElementById('caseRef')?.value || '').trim();
            let fullReference = (document.getElementById('fullRef')?.value || '').trim();
            const brand = getSelectedBrand();
            if (brand === 'Tudor') fullReference = '';

            const caseRecognised = referenceIsRecognisedForBrand(brand, caseStamped);
            const fullRecognised = referenceIsRecognisedForBrand(brand, fullReference);

            // Do not replace a confirmed case-reference result with an incomplete full reference
            // while the authenticator is still typing. Switch to the full reference only when it
            // resolves to a known rule, or when there is no usable case-stamped reference.
            let lookupReference = '';
            let lookupSource = '';
            if (fullReference && (fullRecognised || !caseStamped || !caseRecognised)) {
                lookupReference = fullReference;
                lookupSource = 'full model reference';
            } else if (caseStamped) {
                lookupReference = caseStamped;
                lookupSource = 'case-stamped reference';
            } else if (fullReference) {
                lookupReference = fullReference;
                lookupSource = 'full model reference';
            }

            return {
                caseStamped,
                fullReference,
                lookupReference,
                lookupSource,
                caseRecognised,
                fullRecognised,
                fullReferencePending: Boolean(fullReference && caseRecognised && !fullRecognised)
            };
        }

        function referenceRelationshipHtml(brand, caseStamped, fullReference) {
            if (!caseStamped && !fullReference) return '';
            const lines = [];
            if (caseStamped) lines.push(`<strong>Reference from case:</strong> ${escapeHtml(caseStamped)}`);
            if (fullReference) lines.push(`<strong>Full model reference:</strong> ${escapeHtml(fullReference)}`);
            const brandNow = getSelectedBrand();
            const caseRecognisedNow = referenceIsRecognisedForBrand(brandNow, caseStamped);
            const fullRecognisedNow = referenceIsRecognisedForBrand(brandNow, fullReference);
            let note = fullReference
                ? (caseRecognisedNow && !fullRecognisedNow
                    ? 'The full model reference is still being entered or is not yet recognised. The confirmed case-stamped reference remains active until the full reference resolves.'
                    : 'The full model reference is used for model, calibre and configuration lookup. The case-stamped reference remains available for physical case-consistency checks.')
                : 'The lookup is using the reference entered from the watch case.';

            if (brand === 'Rolex' && caseStamped && fullReference) {
                const caseCore = normalizeRolexReferenceForMovement(caseStamped);
                const fullCore = normalizeRolexReferenceForMovement(fullReference);
                if (caseCore && fullCore && caseCore !== fullCore) {
                    note += ' The two reference cores differ. This is not automatically a failure because some cases are shared across commercial variants, but the relationship should be verified.';
                }
            }
            return `<div class="reference-level-note">${lines.map(line => `<div>${line}</div>`).join('')}<div class="mt-2 text-[10px] text-gray-400">${note}</div></div>`;
        }

        function resetBrandAnalysisPanels() {
            const caseResultBox = document.getElementById('caseResult');
            const serialResultBox = document.getElementById('serialResult');
            const claspResultBox = document.getElementById('claspResult');
            const drawerLiveBox = document.getElementById('drawer-live-decoding');
            const movementResultBox = document.getElementById('movementMatchResult');
            const dateEstimateResult = document.getElementById('dateEstimateResult');
            currentRolexMovementAssessment = null;
            if (caseResultBox) {
                caseResultBox.innerHTML = '';
                caseResultBox.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';
            }
            if (serialResultBox) {
                serialResultBox.innerHTML = '';
                serialResultBox.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';
            }
            if (claspResultBox) {
                claspResultBox.innerHTML = '';
                claspResultBox.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';
            }
            if (movementResultBox) {
                movementResultBox.innerHTML = '';
                movementResultBox.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';
            }
            if (dateEstimateResult) {
                dateEstimateResult.innerHTML = '';
                dateEstimateResult.className = 'hidden mt-4 p-3.5 rounded-lg border text-xs leading-relaxed';
            }
            const ageClassificationResult = document.getElementById('ageClassificationResult');
            if (ageClassificationResult) {
                ageClassificationResult.innerHTML = '';
                ageClassificationResult.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';
            }
            if (drawerLiveBox) drawerLiveBox.innerHTML = '<p class="text-gray-500 italic">Enter identifiers for the selected brand to begin.</p>';
        }

        function bulletiseInformationBody(body) {
            const raw = String(body || '').trim();
            if (!raw) return '<ul class="guidance-bullets"><li>No additional information.</li></ul>';
            if (/<ul\b|<ol\b/i.test(raw)) return raw;

            const template = document.createElement('template');
            template.innerHTML = raw;

            const provenanceParts = [];
            template.content.querySelectorAll('.provenance-line').forEach(node => {
                provenanceParts.push(node.textContent.replace(/\s+/g, ' ').trim());
                node.remove();
            });

            template.content.querySelectorAll('br').forEach(node => node.replaceWith('\n'));
            template.content.querySelectorAll('div,p').forEach(node => {
                node.insertAdjacentText('beforebegin', '\n');
                node.insertAdjacentText('afterend', '\n');
            });

            const plain = template.content.textContent
                .replace(/[•●▪◦]/g, '\n')
                .replace(/\s*\|\s*/g, '\n')
                .replace(/\n\s*\n+/g, '\n')
                .trim();

            let items = plain
                .split(/\n+|(?<=[.!?])\s+(?=[A-Z0-9])/)
                .map(item => item.replace(/\s+/g, ' ').trim())
                .filter(Boolean);

            if (!items.length) items = [raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()];
            items = items.filter((item, index) => items.indexOf(item) === index);

            const bullets = `<ul class="guidance-bullets">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
            const provenance = provenanceParts.length
                ? `<div class="guidance-provenance">${provenanceParts.map(escapeHtml).join('<br>')}</div>`
                : '';

            return bullets + provenance;
        }

        function renderInformationBox(box, tone, heading, body) {
            const tones = {
                danger: 'bg-red-950/40 border-red-500/50 text-red-300',
                warning: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
                success: 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300',
                info: 'bg-blue-950/35 border-blue-500/40 text-blue-200',
                neutral: 'bg-gray-950/60 border-gray-700 text-gray-300'
            };
            box.className = `mt-3 p-3.5 rounded-lg border text-xs leading-relaxed ${tones[tone] || tones.neutral}`;
            box.innerHTML = `<div class="font-bold mb-1 text-[11px] uppercase tracking-wider">${heading}</div><div class="opacity-90">${bulletiseInformationBody(body)}</div>`;
        }

        /* ROLEX_REFERENCE_DATE_HINTS moved to data/watch-reference-data.js */


        function getReferenceDateHint(activeBrand, cleanCase) {
            if (!cleanCase) return null;
            if (activeBrand === 'Rolex') {
                const core = normalizeRolexReferenceForMovement(cleanCase);
                return ROLEX_REFERENCE_DATE_HINTS[core] || null;
            }
            let rule = null;
            if (activeBrand === 'Omega') rule = lookupOmegaReference(cleanCase);
            else if (activeBrand === 'Breitling') rule = lookupBreitlingReference(cleanCase);
            else if (activeBrand === 'Cartier') rule = lookupCartierReference(cleanCase);
            else if (activeBrand === 'Tudor') {
                const parsed = normaliseTudorReference(cleanCase);
                rule = parsed ? TUDOR_REFERENCE_RULES.find(entry => entry.pattern.test(parsed.base)) : null;
            } else if (['Generic','Longines','IWC','TAG Heuer','Rado','Vertex','Seiko','Studio Underd0g','Grand Seiko','Lemania','CWC','Chanel','Sinn','Bremont','Ebel','Fears','Raymond Weil','Blancpain','Christopher Ward','Oris','Panerai'].includes(activeBrand)) {
                rule = lookupOtherReference(activeBrand, cleanCase);
            }
            if (!rule) return null;
            const period = rule.production || rule.approxDate || rule.era || '';
            if (!period || /full suffix required|model\/configuration dependent|manual review|current generation|modern .*generation|reference-dependent/i.test(period)) {
                return period ? { period, basis:'reference/model generation', broad:true } : null;
            }
            return { period, basis:'exact embedded reference', broad:false };
        }


        function periodYearBounds(periodText) {
            const years = String(periodText || '').match(/\b(?:18|19|20)\d{2}\b/g);
            if (!years || !years.length) return null;
            const numeric = years.map(Number);
            return { earliest: Math.min(...numeric), latest: Math.max(...numeric) };
        }

        function getOmegaQuartzEvidence(cleanCase) {
            const movementType = document.getElementById('movementType')?.value || '';
            const observedCalibre = normaliseCalibreLoose(document.getElementById('movementCalibre')?.value || '');
            const rule = cleanCase ? lookupOmegaReference(cleanCase) : null;
            const ruleText = rule ? `${rule.family || ''} ${rule.technology || ''} ${rule.reserve || ''} ${(rule.calibre || []).join(' ')}` : '';

            const knownQuartzCalibres = new Set([
                '1342','1424','1430','1438','1441','1455',
                '1530','1532','1538','1665','1670',
                '4061','4561','5701'
            ]);

            return {
                isQuartz:
                    /^Quartz\b/i.test(movementType) ||
                    /quartz|battery powered|battery-powered/i.test(ruleText) ||
                    knownQuartzCalibres.has(observedCalibre),
                movementType,
                observedCalibre,
                rule
            };
        }

        function assessOmegaSerialDate(period, cleanCase) {
            if (!period) return { valid:false, reason:'No serial-chart date was returned.' };

            const serialBounds = periodYearBounds(period);
            const referenceHint = getReferenceDateHint('Omega', cleanCase);
            const referenceBounds = referenceHint ? periodYearBounds(referenceHint.period) : null;
            const quartzEvidence = getOmegaQuartzEvidence(cleanCase);

            if (quartzEvidence.isQuartz && serialBounds && serialBounds.latest < 1969) {
                return {
                    valid:false,
                    conflict:true,
                    reason:`The serial chart suggests ${period}, but the watch is recorded as quartz. That date is incompatible with the movement technology.`,
                    preferred:referenceHint || null
                };
            }

            if (referenceBounds && serialBounds &&
                (serialBounds.latest < referenceBounds.earliest || serialBounds.earliest > referenceBounds.latest)) {
                return {
                    valid:false,
                    conflict:true,
                    reason:`The serial chart suggests ${period}, while the embedded reference generation suggests ${referenceHint.period}.`,
                    preferred:referenceHint
                };
            }

            return { valid:true, period, preferred:referenceHint || null };
        }


        function decodeBreitlingProductionCode(value) {
            const clean = String(value || '').replace(/\D/g, '');
            if (!/^\d{4}$/.test(clean)) return null;
            const week = Number(clean.slice(0,2));
            const yy = Number(clean.slice(2));
            if (week < 1 || week > 53) return null;
            const currentTwo = new Date().getFullYear() % 100;
            const year = yy <= currentTwo ? 2000 + yy : 1900 + yy;
            if (year < 1990 || year > new Date().getFullYear()) return null;
            return { week, year, period:`week ${week} of ${year}` };
        }

        function getSerialDateHint(activeBrand, serialRaw, cleanCase = '') {
            const serial = (serialRaw || '').trim().toUpperCase().replace(/\s+/g,'').replace(/O/g,'0');
            if (!serial) return null;
            if (activeBrand === 'Breitling') {
                const code = decodeBreitlingProductionCode(serial);
                if (code) return {
                    period: code.period,
                    basis: 'Breitling four-digit production code',
                    broad: false,
                    note: 'This interpretation applies only if the entered four digits are the separate lower-lug week/year production code, not the unique serial number.'
                };
            }
            if (activeBrand === 'Omega') {
                const seriesSelect = document.getElementById('omegaSerialSeries');
                const series = seriesSelect ? seriesSelect.value : 'standard';
                const estimate = estimateOmegaSerialYear(serial, series);
                if (!estimate) return null;
                const assessment = assessOmegaSerialDate(estimate, cleanCase);
                if (!assessment.valid) return null;
                return { period:estimate, basis:series === 'speedmaster' ? 'Speedmaster movement serial chart' : 'Omega movement serial chart', broad:false };
            }
            if (activeBrand === 'Tudor') {
                const assessment = estimateTudorSerial(serial);
                return assessment && assessment.estimate ? { period:assessment.estimate, basis:'Tudor serial benchmark', broad:!!assessment.ambiguous } : null;
            }
            if (activeBrand === 'Rolex') {
                if (/^\d+$/.test(serial)) {
                    const numericEstimate = estimateRolexNumericSerial(serial);
                    if (numericEstimate) return numericEstimate;
                }
                if (serial.length === 8 && /[A-Z]/.test(serial) && /\d/.test(serial)) {
                    return {
                        period:'approximately 2011–present',
                        basis:'randomised Rolex serial format',
                        broad:true,
                        note:'Randomised serials cannot provide an exact public production year.'
                    };
                }
                if (serial.length === 7) {
                    const estimate = ROLEX_PREFIX_YEARS[serial.charAt(0)];
                    if (estimate) return {
                        period:estimate,
                        basis:'Rolex serial-prefix benchmark',
                        broad:false,
                        note:'Approximate independent chronology; confirm against the model and component generation.'
                    };
                }
            }
            return null;
        }

        function renderApproximateDate(activeBrand, cleanCase, serialRaw) {
            const box = document.getElementById('dateEstimateResult');
            if (!box) return;
            const serialHint = getSerialDateHint(activeBrand, serialRaw, cleanCase);
            const referenceHint = getReferenceDateHint(activeBrand, cleanCase);
            const strongest = (referenceHint && !referenceHint.broad)
                ? referenceHint
                : (serialHint || referenceHint);
            if (!strongest) {
                if (cleanCase || (serialRaw || '').trim()) {
                    renderInformationBox(box, 'neutral', 'Approximate date not available', `The current embedded ${activeBrand} data cannot safely estimate a production period from this reference or serial. The watch has not been assigned a guessed date. Add the entry to manual review if dating would be useful.`);
                    box.className = box.className.replace('mt-3','mt-4');
                }
                return;
            }
            let comparison = '';
            if (activeBrand === 'Omega' && (serialRaw || '').trim()) {
                const series = document.getElementById('omegaSerialSeries')?.value || 'standard';
                const rawSerialEstimate = estimateOmegaSerialYear(
                    String(serialRaw).trim().toUpperCase().replace(/\s+/g,'').replace(/O/g,'0'),
                    series
                );
                const assessment = rawSerialEstimate ? assessOmegaSerialDate(rawSerialEstimate, cleanCase) : null;
                if (assessment && !assessment.valid && assessment.conflict) {
                    comparison = `<div class="mt-2 p-2 rounded-lg border border-amber-500/30 bg-amber-950/20 text-[10px] text-amber-200"><strong>Date conflict:</strong> ${assessment.reason} The serial has not been used as the watch date. Verify whether the entered number is the correct movement/watch serial.</div>`;
                } else if (serialHint && referenceHint && serialHint.period !== referenceHint.period) {
                    comparison = `<div class="mt-2 text-[10px] text-gray-400"><strong>Serial clue:</strong> ${serialHint.period}. <strong>Reference clue:</strong> ${referenceHint.period}. Compare both with the calibre, dial and component generation.</div>`;
                }
            } else if (serialHint && referenceHint && serialHint.period !== referenceHint.period) {
                comparison = `<div class="mt-2 text-[10px] text-gray-400"><strong>Reference clue:</strong> ${referenceHint.period}. Compare both clues with the calibre, dial and component generation.</div>`;
            }
            const caution = strongest.broad ? 'This is a broad generation estimate.' : 'This is an approximate production-period estimate.';
            renderInformationBox(box, 'info', 'Approximate date', `<strong>${strongest.period}</strong><div class="mt-1">Based on: ${strongest.basis}.</div>${comparison}<div class="mt-2 text-[10px] text-gray-400">${caution} It is not an exact manufacture or sale date and must agree with the reference, calibre and physical ageing.</div>`);
            box.className = box.className.replace('mt-3','mt-4');
            renderAgeClassification(referenceHint, serialHint);
        }


        function extractYearsFromPeriod(periodText) {
            const matches = String(periodText || '').match(/\b(?:18|19|20)\d{2}\b/g);
            return matches ? matches.map(Number) : [];
        }

        function renderAgeClassification(referenceHint, serialHint) {
            const box = document.getElementById('ageClassificationResult');
            if (!box) return;
            box.innerHTML = '';
            box.className = 'hidden mt-3 p-3.5 rounded-lg border text-xs leading-relaxed';

            const hint = serialHint || referenceHint;
            if (!hint || !hint.period) return;

            const currentYear = new Date().getFullYear();
            const thresholdYear = currentYear - 20;
            const years = extractYearsFromPeriod(hint.period);
            let classification = '';
            let tone = 'neutral';
            let explanation = '';

            if (years.length) {
                const earliest = Math.min(...years);
                const latest = Math.max(...years);
                if (latest < thresholdYear) {
                    classification = 'VINTAGE';
                    tone = 'warning';
                    explanation = `The estimated production period ends before ${thresholdYear}. Under the 20-year rule, this watch is classed as vintage.`;
                } else if (earliest >= thresholdYear) {
                    classification = 'MODERN';
                    tone = 'success';
                    explanation = `The estimated production period begins in or after ${thresholdYear}. Under the 20-year rule, this watch is classed as modern.`;
                } else {
                    classification = 'CHECK DATE';
                    tone = 'info';
                    explanation = `The estimated production range crosses the 20-year boundary (${thresholdYear}). Use the serial, calibre and component generation to decide Modern or Vintage.`;
                }
            } else if (/present|current|modern/i.test(hint.period)) {
                classification = 'MODERN';
                tone = 'success';
                explanation = 'The embedded reference information identifies this as a current or modern-generation watch.';
            } else {
                return;
            }

            renderInformationBox(box, tone, `Age class: ${classification}`, `${explanation}<div class="mt-2 text-[10px] opacity-75">Rule used: Vintage means more than 20 years old. The classification follows the best available approximate date and may require review where a production range crosses the boundary.</div>`);
        }

        function renderNonRolexAnalysis(activeBrand, cleanCase, rawSerial, rawClasp, caseStamped = '', fullReference = '', observedCalibre = '') {
            const caseResultBox = document.getElementById('caseResult');
            const serialResultBox = document.getElementById('serialResult');
            const claspResultBox = document.getElementById('claspResult');
            const drawerLiveBox = document.getElementById('drawer-live-decoding');
            const movementResultBox = document.getElementById('movementMatchResult');
            const profile = BRAND_PROFILES[activeBrand] || BRAND_PROFILES.Generic;
            const serial = rawSerial.trim().toUpperCase().replace(/\s+/g, '');
            const clasp = rawClasp.trim().toUpperCase();
            const article = /^[AEIOU]/i.test(activeBrand) ? 'an' : 'a';
            const live = [];

            if (cleanCase) {
                if (activeBrand === 'Tudor' && caseResultBox) {
                    const tudorReference = renderTudorReferenceAssessment(cleanCase, caseResultBox, observedCalibre, movementResultBox);
                    if (tudorReference && tudorReference.recognised) {
                        const rule = tudorReference.rule;
                        live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Tudor reference identified</span><span class="text-gray-300 block"><strong>${rule.family}</strong> · ${rule.size}</span><span class="text-gray-500 block mt-1">Expected ${rule.calibre.map(cal => `Cal. ${cal}`).join(' or ')} · ${rule.reserve}</span></div>`);
                    } else {
                        live.push(`<div><span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wide">Tudor reference manual review</span><span class="text-gray-300 block"><strong>${cleanCase}</strong></span><span class="text-gray-500 block mt-1">No exact embedded model/calibre mapping.</span></div>`);
                    }
                } else if (activeBrand === 'Omega' && caseResultBox) {
                    const omegaReference = renderOmegaReferenceAssessment(cleanCase, caseResultBox, observedCalibre, movementResultBox);
                    if (omegaReference && omegaReference.recognised) {
                        const rule = omegaReference.rule;
                        live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Omega reference identified</span><span class="text-gray-300 block"><strong>${rule.family}</strong> · ${rule.size}</span><span class="text-gray-500 block mt-1">Expected ${rule.calibre.map(cal => `Cal. ${cal}`).join(' or ')} · ${rule.reserve}</span></div>`);
                    } else {
                        live.push(`<div><span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wide">Omega reference manual review</span><span class="text-gray-300 block"><strong>${cleanCase}</strong></span><span class="text-gray-500 block mt-1">No exact embedded model/calibre mapping.</span></div>`);
                    }
                } else if (activeBrand === 'Breitling' && caseResultBox) {
                    const breitlingReference = renderBreitlingReferenceAssessment(cleanCase, caseResultBox, observedCalibre, movementResultBox);
                    if (breitlingReference && breitlingReference.recognised) {
                        const rule = breitlingReference.rule;
                        live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Breitling reference identified</span><span class="text-gray-300 block"><strong>${rule.family}</strong> · ${rule.size}</span><span class="text-gray-500 block mt-1">Expected ${rule.calibreDisplay} · ${rule.production}</span></div>`);
                    } else {
                        live.push(`<div><span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wide">Breitling reference manual review</span><span class="text-gray-300 block"><strong>${cleanCase}</strong></span><span class="text-gray-500 block mt-1">No exact embedded model/calibre mapping.</span></div>`);
                    }
                } else if (activeBrand === 'Cartier' && caseResultBox) {
                    const cartierReference = renderCartierReferenceAssessment(cleanCase, caseResultBox, observedCalibre, movementResultBox);
                    if (cartierReference && cartierReference.recognised) {
                        const rule = cartierReference.rule;
                        live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Cartier reference identified</span><span class="text-gray-300 block"><strong>${rule.family}</strong> · ${rule.size}</span><span class="text-gray-500 block mt-1">Expected ${rule.calibreDisplay}</span></div>`);
                    } else {
                        live.push(`<div><span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wide">Cartier reference manual review</span><span class="text-gray-300 block"><strong>${cleanCase}</strong></span><span class="text-gray-500 block mt-1">No exact embedded model/calibre mapping.</span></div>`);
                    }
                } else if (['Generic','Longines','IWC','TAG Heuer','Rado','Vertex','Seiko','Studio Underd0g','Grand Seiko','Lemania','CWC','Chanel','Sinn','Bremont','Ebel','Fears','Raymond Weil','Blancpain','Christopher Ward','Oris','Panerai'].includes(activeBrand) && caseResultBox) {
                    const otherReference = renderOtherReferenceAssessment(activeBrand, cleanCase, caseResultBox, observedCalibre, movementResultBox);
                    if (otherReference && otherReference.recognised) {
                        const rule = otherReference.rule;
                        live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">${activeBrand} reference identified</span><span class="text-gray-300 block"><strong>${rule.family}</strong> · ${rule.size}</span><span class="text-gray-500 block mt-1">Expected ${rule.calibreDisplay} · ${rule.reserve}</span></div>`);
                    } else {
                        live.push(`<div><span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wide">${activeBrand} reference manual review</span><span class="text-gray-300 block"><strong>${cleanCase}</strong></span><span class="text-gray-500 block mt-1">No exact embedded model/calibre mapping.</span></div>`);
                    }
                } else {
                    if (caseResultBox) renderInformationBox(caseResultBox, 'neutral', `${activeBrand} reference recorded`, `${profile.caseHelp}<div class="mt-2">No exact ${activeBrand} model/calibre database is embedded yet.</div>${missingReferenceButtonHtml()}`);
                    live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">${activeBrand} reference</span><span class="text-gray-300 block"><strong>${cleanCase}</strong></span><span class="text-gray-500 block mt-1">${profile.caseHelp}</span></div>`);
                }
            }

            if (cleanCase && caseResultBox) {
                caseResultBox.innerHTML += referenceRelationshipHtml(activeBrand, caseStamped, fullReference);
            }

            if (serial) {
                if (activeBrand === 'Omega') {
                    const seriesSelect = document.getElementById('omegaSerialSeries');
                    const series = seriesSelect ? seriesSelect.value : 'standard';
                    const seriesLabel = series === 'speedmaster' ? 'Omega Speedmaster' : 'Omega excluding Speedmaster';
                    const numeric = /^\d+$/.test(serial);
                    const estimatedYear = estimateOmegaSerialYear(serial, series);
                    const serialAssessment = estimatedYear ? assessOmegaSerialDate(estimatedYear, cleanCase) : null;
                    const caution = `<div class="mt-2.5 pt-2 border-t border-blue-900/30 text-[10px] text-gray-400 leading-normal"><strong>Dating caution:</strong> Omega has not published a complete official year-by-year serial chronology. Collector charts normally narrow the movement-production period rather than the exact case-assembly or sale date, and stock rotation can create overlaps or outliers. Movement parts may predate final assembly; some ETA-based or non-COSC models may lack a movement serial while carrying an external watch serial. Use the estimate as supporting context only.</div><div class="provenance-line"><strong>Dating limitations:</strong> Watches.co.uk Omega Serial & Reference Numbers guide<br><strong>Confidence:</strong> Approximate dating guidance · DB v${DATABASE_META.version}</div>`;
                    if (numeric && serial.length >= 7 && serial.length <= 8) {
                        if (estimatedYear && serialAssessment && !serialAssessment.valid) {
                            const preferredDate = serialAssessment.preferred?.period
                                ? `<div class="mt-2"><strong>Use instead:</strong> ${serialAssessment.preferred.period}, based on the embedded reference generation.</div>`
                                : '';
                            renderInformationBox(
                                serialResultBox,
                                'warning',
                                'Omega serial date conflict',
                                `The selected chart would return <strong>${estimatedYear}</strong>, but this conflicts with the recorded reference or movement technology. The chart result has been suppressed.${preferredDate}<div class="mt-2">Confirm that the entered number is the correct Omega movement/watch serial and not a case, battery, service or unrelated component number.</div>${caution}`
                            );
                            live.push(`<div><span class="text-amber-400 font-bold block uppercase text-[10px] tracking-wide">Omega serial conflict</span><span class="text-gray-300 block">Chart result <strong>${estimatedYear}</strong> suppressed because it conflicts with the watch evidence.</span></div>`);
                        } else {
                            const dateLine = estimatedYear
                                ? `The selected <strong>${seriesLabel}</strong> chart gives an estimated production period of <strong>${estimatedYear}</strong>.`
                                : `No date range was found for this value in the selected <strong>${seriesLabel}</strong> chart.`;
                            const tone = estimatedYear ? 'info' : 'warning';
                            renderInformationBox(serialResultBox, tone, 'Omega serial lookup', `The value is a ${serial.length}-digit numeric Omega serial. ${dateLine}${caution}`);
                            live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Omega serial estimate</span><span class="text-gray-300 block">${seriesLabel}: <strong>${estimatedYear || 'range not found'}</strong></span></div>`);
                        }
                    } else {
                        renderInformationBox(serialResultBox, 'warning', 'Omega serial requires manual review', `The entered value does not follow the common seven- or eight-digit numeric Omega structure. Verify the exact model, reference and calibre rather than treating format alone as decisive.${caution}`);
                    }
                } else if (activeBrand === 'Tudor') {
                    const assessment = estimateTudorSerial(serial);
                    const sourceCaution = `<div class="mt-2.5 pt-2 border-t border-blue-900/30 text-[10px] text-gray-400 leading-normal"><strong>Dating limitation:</strong> Tudor has not published a complete official serial chronology. These dates are estimates based on observed benchmarks. A plausible serial does not establish authenticity by itself.</div>`;
                    const tone = assessment && (assessment.ambiguous || assessment.malformed) ? 'warning' : 'info';
                    const estimateLine = assessment && assessment.estimate
                        ? `Estimated production period: <strong>${assessment.estimate}</strong>.`
                        : assessment && assessment.unmapped
                            ? 'No reliable production date is assigned because this structure is outside the limited historical benchmark table.'
                            : 'No production period could be assigned from the embedded benchmark table.';
                    const formatLine = assessment ? `Detected structure: <strong>${assessment.format}</strong>.` : '';
                    const routineCheck = assessment && assessment.unmapped
                        ? ''
                        : '<div class="mt-2">Inspect the engraving quality and compare the serial with the case reference, movement and apparent age.</div>';
                    renderInformationBox(serialResultBox, tone, 'Tudor serial lookup', `${formatLine} ${estimateLine}<div class="mt-2">${assessment ? assessment.note : ''}</div>${routineCheck}${sourceCaution}`);
                    live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Tudor serial estimate</span><span class="text-gray-300 block"><strong>${assessment && assessment.estimate ? assessment.estimate : 'range not found'}</strong></span></div>`);
                } else if (activeBrand === 'Generic') {
                    renderInformationBox(serialResultBox, 'neutral', 'No brand-specific serial check active', 'Choose the manufacturer to receive brand-relative guidance. The serial has been recorded but has not been compared with any replica-code database.');
                } else {
                    renderInformationBox(serialResultBox, 'info', `${activeBrand} serial recorded`, `Only ${activeBrand}-specific guidance is active. No ${activeBrand} replica-serial blacklist is embedded in this version, so the value is not being compared with Rolex patterns. Confirm format, reference and calibre using the selected brand's records.`);
                }
                if (activeBrand !== 'Omega' && activeBrand !== 'Tudor') {
                    live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">${activeBrand} serial</span><span class="text-gray-300 block"><strong>${serial}</strong></span><span class="text-gray-500 block mt-1">No Rolex serial matching is performed in ${activeBrand} mode.</span></div>`);
                }
            }

            if (clasp) {
                if (activeBrand === 'Generic') {
                    renderInformationBox(claspResultBox, 'neutral', 'Clasp reference recorded', 'No brand-specific clasp database is active. Select a brand before interpreting the reference.');
                } else {
                    renderInformationBox(claspResultBox, 'info', `${activeBrand} clasp reference recorded`, `The value is being treated only as ${article} ${activeBrand} bracelet or clasp reference. Rolex replica clasp-code warnings are disabled while ${activeBrand} is selected.`);
                }
                live.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">${activeBrand} clasp / bracelet</span><span class="text-gray-300 block"><strong>${clasp}</strong></span></div>`);
            }

            if (drawerLiveBox && live.length) drawerLiveBox.innerHTML = `<div class="space-y-4 divide-y divide-gray-800">${live.join('')}</div>`;
        }

        /* --- Selected-brand forensic analysis --- */
        function runRolexForensicAnalysis() {
            updateCounterfeitMatchAlert();
            const serialInput = document.getElementById('serialInput');
            const claspInput = document.getElementById('claspCode');
            const caseInput = document.getElementById('caseRef');
            const fullReferenceInput = document.getElementById('fullRef');
            const caseResultBox = document.getElementById('caseResult');
            const serialResultBox = document.getElementById('serialResult');
            const claspResultBox = document.getElementById('claspResult');
            const movementInput = document.getElementById('movementCalibre');
            const movementResultBox = document.getElementById('movementMatchResult');
            const drawerLiveBox = document.getElementById('drawer-live-decoding');
            const replicaRiskBanner = document.getElementById('replica-risk-banner');
            const replicaRiskTitle = document.getElementById('replica-risk-title');
            const replicaRiskCopy = document.getElementById('replica-risk-copy');
            if (!serialInput || !claspInput || !caseInput || !fullReferenceInput || !caseResultBox || !serialResultBox || !claspResultBox || !movementInput || !movementResultBox || !drawerLiveBox) return;

            if (replicaRiskBanner) { replicaRiskBanner.classList.add('hidden'); replicaRiskBanner.classList.remove('danger'); }
            resetBrandAnalysisPanels();
            const activeBrand = getSelectedBrand();
            const rawSerial = serialInput.value;
            const rawClasp = claspInput.value;
            const observedCalibre = movementInput.value;
            const referenceInputs = getReferenceInputs();
            const caseStamped = referenceInputs.caseStamped;
            const fullReference = referenceInputs.fullReference;
            const lookupReference = referenceInputs.lookupReference;
            const cleanCase = lookupReference.replace(/\s+/g, '').toUpperCase();

            renderApproximateDate(activeBrand, cleanCase, rawSerial);

            // Standards and likely-brand hints never auto-switch the authenticator's selected brand.
            if (/^ISO(?:\s|-)?6425$/i.test(caseStamped.trim())) {
                if (activeBrand === 'Vertex') {
                    renderNonRolexAnalysis(activeBrand, cleanCase, rawSerial, rawClasp, caseStamped, fullReference, observedCalibre);
                } else {
                    renderInformationBox(caseResultBox, 'info', 'ISO 6425 case marking recorded', '<strong>ISO 6425</strong> is a legitimate dive-watch standard marking and was recorded from a Vertex watch. It is not necessarily the model reference. Select Vertex for the stored Vertex/SW300-1 inspection guidance, and record a separate model reference when one is available.');
                    const observed = normaliseCalibreLoose(observedCalibre);
                    if (observed && movementResultBox) {
                        const consistent = observed === 'SW3001' || observed.includes('SW3001');
                        renderInformationBox(movementResultBox, consistent ? 'success' : 'warning', consistent ? 'Observed Vertex movement recorded' : 'Vertex movement requires review', consistent ? 'The observed <strong>SW300-1</strong> is consistent with the saved Vertex inspection entry. Select Vertex to use the embedded marking/movement record.' : 'The saved Vertex inspection entry was observed with <strong>SW300-1</strong>. Recheck the movement marking and select Vertex before treating this as a mismatch.');
                    }
                }
                autoGenerate();
                return;
            }
            if (activeBrand === 'Generic' && /^126334$/i.test(cleanCase)) {
                renderInformationBox(caseResultBox, 'warning', 'Likely Rolex reference', '<strong>126334</strong> is a Rolex Datejust 41 White Rolesor reference associated with Calibre 3235. Rolex has not been selected, so the program has not applied Rolex-specific forensic checks. Confirm the brand and select Rolex if appropriate.');
                const observed = normaliseCalibreLoose(observedCalibre);
                if (observed) {
                    const consistent = observed === '3235' || observed.includes('3235');
                    renderInformationBox(movementResultBox, consistent ? 'success' : 'warning', consistent ? 'Calibre is consistent with likely Rolex reference' : 'Calibre needs review', consistent ? 'The observed calibre is consistent with the Rolex 126334 / Calibre 3235 mapping. Select Rolex to enable the full reference and replica-warning checks.' : 'Rolex reference 126334 is expected to use Calibre 3235. Recheck the selected brand, movement marking and case reference.');
                }
                autoGenerate();
                return;
            }

            // The authenticator's selected brand is authoritative. Never auto-switch brands from an identifier pattern.
            if (activeBrand !== 'Rolex') {
                renderNonRolexAnalysis(activeBrand, cleanCase, rawSerial, rawClasp, caseStamped, fullReference, observedCalibre);
                autoGenerate();
                return;
            }

            const cleanSerial = rawSerial.replace(/\s+/g, '').toUpperCase().replace(/O/g, '0');
            const claspAnalysis = findReplicaClaspMatches(rawClasp);
            const cleanClasp = claspAnalysis.compactInput;

            if (!cleanSerial && !cleanClasp && !cleanCase && !caseStamped && !fullReference && !observedCalibre.trim()) {
                autoGenerate();
                return;
            }

        /* BACKUP_RED_FLAGS moved to data/watch-reference-data.js */

            const disclaimerHtml = `<div class="mt-2.5 pt-2 border-t border-red-900/20 text-[10px] text-gray-400 italic font-sans leading-normal"><strong>Forensic disclaimer:</strong> A listed replica serial or clasp code is a serious warning, but it is not conclusive by itself. Confirm movement, engraving, construction and component consistency.</div>`;

            let liveHtmlArr = [];
            let caseYearEst = 'Unknown';
            let claspYearEst = 'Unknown';

            if (cleanCase) {
                const decodedCase = decodeRolexReference(cleanCase);
                if (decodedCase) {
                    const suffixLine = decodedCase.suffix ? `<div class="mt-1"><strong>Suffix:</strong> ${decodedCase.suffix} — ${decodedCase.suffixLabel}.</div>` : '';
                    renderInformationBox(caseResultBox, 'info', 'Rolex reference decoded', `<strong>${decodedCase.model}</strong><div class="mt-1"><strong>Lookup source:</strong> ${referenceInputs.lookupSource}</div><div class="mt-1"><strong>Core reference:</strong> ${decodedCase.core}</div><div class="mt-1"><strong>Bezel code:</strong> ${decodedCase.bezel}</div><div class="mt-1"><strong>Material code:</strong> ${decodedCase.metal}</div>${suffixLine}<div class="mt-2 text-[10px] text-gray-400">Family-specific exact movement guidance appears in the movement panel. Suffix letters no longer interfere with numeric case decoding. Letter and serial chronologies are independent collector/dealer guidance because Rolex does not publish a complete public decoding archive.</div>${referenceRelationshipHtml('Rolex', caseStamped, fullReference)}`);
                    liveHtmlArr.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Rolex ${referenceInputs.lookupSource} (${cleanCase})</span><span class="text-gray-300 block">• Model family: <strong>${decodedCase.model}</strong></span><span class="text-gray-300 block">• Bezel style: <strong>${decodedCase.bezel}</strong></span><span class="text-gray-300 block">• Material: <strong>${decodedCase.metal}</strong></span>${decodedCase.suffix ? `<span class="text-gray-300 block">• Suffix: <strong>${decodedCase.suffix}</strong> — ${decodedCase.suffixLabel}</span>` : ''}</div>`);
                }
                const movementAssessment = renderRolexMovementAssessment(cleanCase, observedCalibre, movementResultBox);
                if (movementAssessment && movementAssessment.exact) {
                    const expectedText = movementAssessment.calibre.map(cal => `Cal. ${cal}`).join(' or ');
                    const observedText = movementAssessment.observed ? `Observed: Cal. ${movementAssessment.observed}.` : 'Observed calibre not yet entered.';
                    liveHtmlArr.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Rolex movement cross-check</span><span class="text-gray-300 block">Expected: <strong>${expectedText}</strong></span><span class="text-gray-500 block mt-1">${observedText} Reserve: ${movementAssessment.reserve}.</span></div>`);
                } else if (movementAssessment && movementAssessment.eraHint) {
                    liveHtmlArr.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Rolex movement-era clue</span><span class="text-gray-300 block">${movementAssessment.eraHint}</span></div>`);
                }
            } else if (observedCalibre.trim()) {
                renderInformationBox(movementResultBox, 'neutral', 'Rolex reference required', 'Enter either the case-stamped reference or, preferably, the full model reference to determine whether the observed calibre belongs in the watch.');
            }

            let combinedMatch = null;
            let combinedClaspCode = null;
            let serialReplicaRisk = null;
            let serialReplicaFragment = null;
            if (cleanSerial && claspAnalysis.matches.length) {
                for (const match of claspAnalysis.matches) {
                    if (match.record.patterns.some(pattern => matchPattern(cleanSerial, pattern))) {
                        combinedMatch = match.record;
                        combinedClaspCode = match.code;
                        break;
                    }
                }
            }

            if (cleanSerial) {
                if (combinedMatch) {
                    serialReplicaRisk = combinedMatch;
                    renderInformationBox(serialResultBox, 'danger', 'Critical combined Rolex match', `The serial pattern and clasp code <strong>${combinedClaspCode}</strong> both correspond to <strong>${combinedMatch.factory}</strong> production for ${combinedMatch.model} (Ref: ${combinedMatch.ref}).${disclaimerHtml}`);
                } else {
                    const serialMatchRecord = REP_DATABASE.find(record => record.patterns.some(pattern => matchPattern(cleanSerial, pattern)));
                    if (serialMatchRecord) {
                        serialReplicaRisk = serialMatchRecord;
                        renderInformationBox(serialResultBox, 'danger', 'Rolex replica serial pattern detected', `The entered serial pattern appears in the embedded replica guide for <strong>${serialMatchRecord.factory}</strong>, ${serialMatchRecord.model} (Ref: ${serialMatchRecord.ref}).${disclaimerHtml}`);
                    } else {
                        const matchedPrefix = BACKUP_RED_FLAGS.prefixes.find(prefix => cleanSerial.startsWith(prefix));
                        const matchedSuffix = BACKUP_RED_FLAGS.suffixes.find(suffix => cleanSerial.endsWith(suffix));
                        if (matchedPrefix || matchedSuffix) {
                            const fragment = matchedPrefix || matchedSuffix;
                            serialReplicaFragment = fragment;
                            renderInformationBox(serialResultBox, 'danger', 'Rolex duplicated serial warning', `The serial contains the heavily duplicated Rolex clone sequence <strong>${fragment}</strong>. Perform full forensic verification.${disclaimerHtml}`);
                        } else if (/^\d+$/.test(cleanSerial)) {
                            const numericEstimate = estimateRolexNumericSerial(cleanSerial);
                            if (numericEstimate) {
                                renderInformationBox(
                                    serialResultBox,
                                    'info',
                                    'Approximate Rolex numeric serial date',
                                    `Serial <strong>${cleanSerial}</strong> corresponds to <strong>${numericEstimate.period}</strong> in the embedded independent benchmark.<div class="mt-2 text-[10px] text-gray-400">${numericEstimate.note}</div>`
                                );
                                caseYearEst = numericEstimate.period;
                            } else {
                                renderInformationBox(serialResultBox, 'warning', 'Rolex numeric serial requires review', 'The numeric serial could not be safely placed in the embedded chronology. Confirm the engraving, reference, calibre and case generation.');
                            }
                        } else if (cleanSerial.length === 8) {
                            renderInformationBox(serialResultBox, 'success', 'Rolex randomised serial structure', 'An eight-character mixed serial is consistent with the randomised format used from approximately 2011 onward. Randomised serials cannot provide an exact public production year and are not proof of authenticity.');
                            caseYearEst = 'approximately 2011–present (randomised; exact year unavailable)';
                        } else if (cleanSerial.length === 7) {
                            const prefixYear = ROLEX_PREFIX_YEARS[cleanSerial.charAt(0)];
                            if (prefixYear) {
                                renderInformationBox(serialResultBox, 'success', 'Rolex prefix serial structure', `Prefix <strong>${cleanSerial.charAt(0)}</strong> maps to an estimated production period of <strong>${prefixYear}</strong> in the independent chronology. Confirm against the exact model, movement and component generation.`);
                                caseYearEst = prefixYear;
                            } else {
                                renderInformationBox(serialResultBox, 'info', 'Rolex seven-character serial recorded', 'The structure may correspond to an earlier numeric or transitional Rolex serial. Confirm against the reference-specific production period.');
                                caseYearEst = 'Pre-1987 / transitional';
                            }
                        } else {
                            renderInformationBox(serialResultBox, 'warning', 'Unusual Rolex serial length', `The entered serial contains ${cleanSerial.length} characters. Modern Rolex serials are commonly seven or eight characters; verify the engraving and model era carefully.`);
                        }
                    }
                }
            }

            if (cleanClasp) {
                if (claspAnalysis.matches.length) {
                    const uniqueCodes = [...new Set(claspAnalysis.matches.map(item => item.code))];
                    const uniqueSignatures = [];
                    const seen = new Set();
                    claspAnalysis.matches.forEach(({record}) => {
                        const key = `${record.factory}|${record.model}|${record.ref}`;
                        if (!seen.has(key)) { seen.add(key); uniqueSignatures.push(record); }
                    });
                    const rows = uniqueSignatures.slice(0, 6).map(record => `<li><strong>${record.factory}</strong> — ${record.model} (Ref: ${record.ref})</li>`).join('');
                    const remaining = Math.max(0, uniqueSignatures.length - 6);
                    const heading = combinedMatch ? 'Critical Rolex clasp and serial match' : 'Potential fake Rolex clasp code';
                    const tone = combinedMatch ? 'danger' : 'warning';
                    renderInformationBox(claspResultBox, tone, heading, `The clasp stamp contains <strong>${uniqueCodes.join(', ')}</strong>, listed in the Rolex replica-code guide.<ul class="mt-2 ml-4 list-disc space-y-1">${rows}</ul>${remaining ? `<div class="mt-2">Plus ${remaining} additional indexed combination${remaining === 1 ? '' : 's'}.</div>` : ''}${disclaimerHtml}`);
                } else {
                    const twoLetterCode = cleanClasp.slice(0, 2);
                    const oneLetterCode = cleanClasp.slice(0, 1);
                    const matchedYear = ROLEX_CLASP_YEARS[twoLetterCode] || ROLEX_CLASP_YEARS[oneLetterCode];
                    if (matchedYear) {
                        renderInformationBox(claspResultBox, 'success', 'Rolex clasp date code', `The clasp code maps to an estimated bracelet manufacture year of <strong>${matchedYear}</strong>.`);
                        claspYearEst = matchedYear;
                    } else {
                        renderInformationBox(claspResultBox, 'neutral', 'No indexed Rolex replica clasp match', 'The value does not match a clasp code in the embedded Rolex replica guide. This is not evidence of authenticity.');
                    }
                }
            }

            const hasSerialReplicaRisk = Boolean(combinedMatch || serialReplicaRisk || serialReplicaFragment);
            const hasClaspReplicaRisk = claspAnalysis.matches.length > 0;
            if (replicaRiskBanner && replicaRiskTitle && replicaRiskCopy && (hasSerialReplicaRisk || hasClaspReplicaRisk)) {
                replicaRiskBanner.classList.remove('hidden');
                if (hasSerialReplicaRisk && hasClaspReplicaRisk) {
                    replicaRiskBanner.classList.add('danger');
                    replicaRiskTitle.textContent = 'Critical: replica-guide serial/case code and clasp code both matched';
                    replicaRiskCopy.innerHTML = `Both entered identifiers appear in the embedded third-party Rolex replica-code guide${combinedMatch ? ` and correspond to the same indexed ${combinedMatch.factory} / ${combinedMatch.model} combination` : ''}. This is a substantially stronger risk signal than either code alone, but it is not standalone proof of inauthenticity.`;
                } else if (hasSerialReplicaRisk) {
                    replicaRiskTitle.textContent = 'Serious risk flag: replica-guide serial / case code match';
                    replicaRiskCopy.innerHTML = `The entered serial or case identifier matches a pattern documented in the embedded third-party Rolex replica guide${serialReplicaFragment ? ` (${serialReplicaFragment})` : ''}. Do not clear the watch on appearance alone.`;
                } else {
                    replicaRiskTitle.textContent = 'Serious risk flag: replica-guide clasp code match';
                    replicaRiskCopy.innerHTML = `The entered clasp code matches one or more combinations documented in the embedded third-party Rolex replica guide. Continue the full physical authentication and require enhanced review before clearance.`;
                }
            }

            if (cleanSerial) liveHtmlArr.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Rolex serial era</span><span class="text-gray-300 block">Estimated era: <strong>${caseYearEst}</strong></span></div>`);
            if (cleanClasp) liveHtmlArr.push(`<div><span class="text-blue-400 font-bold block uppercase text-[10px] tracking-wide">Rolex clasp date</span><span class="text-gray-300 block">Estimated year: <strong>${claspYearEst}</strong></span></div>`);
            if (liveHtmlArr.length) drawerLiveBox.innerHTML = `<div class="space-y-4 divide-y divide-gray-800">${liveHtmlArr.join('')}</div>`;
            updateManualReviewQueueActions();
            autoGenerate();
        }

        /* --- STREAMING_CHUNK: Confirmation Dialog Overlay Modals --- */
        function showConfirm(title, message, onConfirm) {
            document.getElementById('modal-title').innerText = title;
            document.getElementById('modal-message').innerText = message;
            const modal = document.getElementById('confirm-modal');
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('opacity-100'), 10);
            pendingConfirmAction = onConfirm;
        }

        function closeConfirm() {
            const modal = document.getElementById('confirm-modal');
            modal.classList.remove('opacity-100');
            setTimeout(() => modal.classList.add('hidden'), 300);
            pendingConfirmAction = null;
        }

        document.getElementById('modal-cancel-btn').addEventListener('click', closeConfirm);
        document.getElementById('modal-confirm-btn').addEventListener('click', () => {
            if (pendingConfirmAction) pendingConfirmAction();
            closeConfirm();
        });

        function triggerClearCounter() {
            showConfirm(
                "Reset Counter & Database?", 
                "This action will reset your session inspection count back to 0 and completely empty all historical watch verification logs. This cannot be undone.",
                function() {
                    inspections = 0;
                    safeStorageSet('inspection_count', 0);
                    watchHistory = [];
                    safeStorageSet('watch_history', JSON.stringify([]));
                    renderHistoryTable();
                    updateCounterDisplay();
                    showToast("COUNTER & RECORDS WIPED");
                }
            );
        }

        function triggerClearHistory() {
            if (watchHistory.length === 0) return;
            showConfirm(
                "Wipe All Local Logs?", 
                "Are you sure you want to permanently clear out all historical inspection logs?",
                function() {
                    watchHistory = [];
                    safeStorageSet('watch_history', JSON.stringify(watchHistory));
                    renderHistoryTable();
                    updateCounterDisplay();
                    showToast("ALL LOGS CLEARED");
                }
            );
        }

        /* --- STREAMING_CHUNK: Running Checklist Building --- */
        function init() {
            const container = document.getElementById('checklist-container');
            if (!container) return;
            container.innerHTML = "";
            categories.forEach((cat, idx) => {
                const card = document.createElement('div');
                card.className = 'bg-gray-900 rounded-xl p-5 border border-gray-800 shadow-md transition-all duration-300';
                card.id = `card-${idx}`;
                states[idx] = 0;
                reasons[idx] = "";
                
                card.innerHTML = `
                    <div class="flex items-center justify-between gap-4">
                        <div class="checklist-title-wrap"><span class="checklist-symbol" aria-hidden="true">${categorySymbols[cat] || "•"}</span><h2 class="text-gray-400 font-bold text-[11px] tracking-widest uppercase">${cat}</h2></div>
                        <div class="flex gap-1.5">
                            <button onclick="toggle('${idx}', 1)" id="btn-${idx}-1" class="w-12 h-9 flex items-center justify-center rounded-lg text-[10px] font-black border border-gray-700 bg-gray-800 text-gray-500">PASS</button>
                            <button onclick="toggle('${idx}', 2)" id="btn-${idx}-2" class="w-12 h-9 flex items-center justify-center rounded-lg text-[10px] font-black border border-gray-700 bg-gray-800 text-gray-500">REVIEW</button>
                            <button onclick="toggle('${idx}', 3)" id="btn-${idx}-3" class="w-12 h-9 flex items-center justify-center rounded-lg text-[10px] font-black border border-gray-700 bg-gray-800 text-gray-500">FAIL</button>
                        </div>
                    </div>
                    <div id="action-box-${idx}" class="action-box">
                        <div id="maybe-ui-${idx}" class="hidden mt-4">
                            <button onclick="googleSearch('${idx}')" class="w-full bg-blue-900/30 hover:bg-blue-900/50 border border-blue-800/50 text-blue-300 text-[10px] font-bold py-2 rounded transition flex items-center justify-center gap-2 uppercase tracking-tighter">
                                🔍 SEARCH REFERENCE MATERIAL
                            </button>
                        </div>
                        <div id="no-ui-${idx}" class="hidden mt-4">
                            <label class="block text-[9px] font-bold text-red-500 mb-1 uppercase tracking-tighter">State the rejection evidence:</label>
                            <input type="text" id="input-${idx}" oninput="updateReason('${idx}', this.value)" placeholder="e.g. Laser etched serial, rounded lug edges..." class="w-full bg-black border border-red-900/30 rounded-lg px-3 py-2 text-xs text-red-200 outline-none">
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            updateBrandCardStyles();
            updateBrandContext();
            updateCounterDisplay();
        }

        /* --- STREAMING_CHUNK: Managing Brand Checkboxes Selection --- */
        function getSelectedBrand() {
            const checked = document.querySelector('.brand-checkbox:checked');
            return checked ? checked.value : "Generic";
        }

        function selectBrand(checkbox) {
            if (checkbox.checked) {
                document.querySelectorAll('.brand-checkbox').forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            } else {
                // Default back to Generic if they uncheck their selection
                const genericCb = document.querySelector('.brand-checkbox[value="Generic"]');
                if (genericCb) genericCb.checked = true;
            }
            updateBrandCardStyles();
            updateBrandContext();
            initialiseContextGuidance();
            initialiseManualReviewQueueObserver();
            updateCounterfeitMatchAlert();
            updateBrandDisplayLimit();
        }

        function updateBrandCardStyles() {
            document.querySelectorAll('.brand-checkbox').forEach(cb => {
                const card = cb.closest('.brand-card');
                if (cb.checked) {
                    card.className = "brand-card flex items-center gap-3 p-3 rounded-lg bg-blue-950/30 border border-blue-500/50 cursor-pointer hover:bg-gray-800 transition-all select-none ring-1 ring-blue-500/30";
                    card.querySelector('span').className = "text-xs font-bold text-blue-100";
                } else {
                    card.className = "brand-card flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-800/50 cursor-pointer hover:bg-gray-800 transition-all select-none";
                    card.querySelector('span').className = "text-xs font-semibold text-gray-400";
                }
            });
        }

        function googleSearch(idx) {
            const brand = getSelectedBrand();
            const caseStamped = document.getElementById('caseRef').value.trim();
            const fullReference = document.getElementById('fullRef').value.trim();
            const reference = fullReference || caseStamped;
            const component = categories[idx];
            let query = `${brand} ${reference} ${component} authentication genuine vs replica technical guide`;
            window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }

        function refreshMovementCalibreSuggestions() {
            const datalist = document.getElementById('movementCalibreOptions');
            if (!datalist) return;

            const brand = getSelectedBrand();
            let suggestions = [];

            if (brand === 'Rolex' && typeof ROLEX_MOVEMENT_RULES !== 'undefined') {
                suggestions = ROLEX_MOVEMENT_RULES.flatMap(rule => rule.calibre || []);
            } else if (brand === 'Tudor' && typeof TUDOR_REFERENCE_RULES !== 'undefined') {
                suggestions = TUDOR_REFERENCE_RULES.flatMap(rule => rule.calibre || []);
            } else if (brand === 'Omega' && typeof OMEGA_REFERENCE_RULES !== 'undefined') {
                suggestions = OMEGA_REFERENCE_RULES.flatMap(rule => rule.calibre || []);
            } else if (brand === 'Breitling' && typeof BREITLING_REFERENCE_RULES !== 'undefined') {
                suggestions = BREITLING_REFERENCE_RULES.flatMap(rule => rule.calibre || []);
            } else if (brand === 'Cartier' && typeof CARTIER_REFERENCE_RULES !== 'undefined') {
                suggestions = CARTIER_REFERENCE_RULES.flatMap(rule => rule.calibre || []);
            } else if (['Generic','Longines','IWC','TAG Heuer','Rado','Vertex','Seiko','Studio Underd0g','Grand Seiko','Lemania','CWC','Chanel','Sinn','Bremont','Ebel','Fears','Raymond Weil','Blancpain','Christopher Ward','Oris','Panerai'].includes(brand) && typeof OTHER_REFERENCE_RULES !== 'undefined') {
                suggestions = OTHER_REFERENCE_RULES.filter(rule => rule.brand === brand).flatMap(rule => rule.calibre || []);
            }
            suggestions = [...new Set(suggestions.map(value => String(value).trim()).filter(Boolean))]
                .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

            datalist.innerHTML = suggestions
                .map(calibre => `<option value="Cal. ${calibre}"></option>`)
                .join('');
        }

        function updateBrandContext() {
            const brand = getSelectedBrand();
            const generic = brandFlags["Generic"] || {};
            const specific = brandFlags[brand] || {};
            const profile = BRAND_PROFILES[brand] || BRAND_PROFILES.Generic;

            const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
            const setPlaceholder = (id, value) => { const el = document.getElementById(id); if (el) el.placeholder = value; };
            const referenceProfiles = {
                Rolex: { caseLabel: 'Case-stamped Rolex reference', caseHelp: 'Digits physically stamped or engraved on the case', casePlaceholder: 'e.g. 126710', fullLabel: 'Full Rolex model reference', fullHelp: 'Include suffixes such as BLRO, BLNR, LN, LV or GV', fullPlaceholder: 'e.g. 126710BLRO' },
                Tudor: { caseLabel: 'Tudor reference', caseHelp: 'Enter the case or model reference shown on the watch', casePlaceholder: 'e.g. 28503 or M79030N-0001', fullLabel: 'Full Tudor catalogue reference', fullHelp: 'Not used in Tudor mode', fullPlaceholder: '' },
                Omega: { caseLabel: 'Case / calibre-case reference', caseHelp: 'Reference physically present on the watch or case', casePlaceholder: 'Enter the case-marked reference', fullLabel: 'Full Omega PIC reference', fullHelp: 'Complete dot-separated product reference when available', fullPlaceholder: 'e.g. 210.30.42.20.01.001' }
            };
            const refProfile = referenceProfiles[brand] || {
                caseLabel: `${brand === 'Generic' ? 'Case-stamped' : brand + ' case-stamped'} reference`,
                caseHelp: 'What is physically stamped or engraved on the case',
                casePlaceholder: 'Enter the case-stamped reference',
                fullLabel: `${brand === 'Generic' ? 'Full model' : brand + ' full model'} reference`,
                fullHelp: 'Complete catalogue or configuration reference',
                fullPlaceholder: 'Enter the complete model reference'
            };
            setText('case-label-text', refProfile.caseLabel);
            setText('case-help-text', refProfile.caseHelp);
            setPlaceholder('caseRef', refProfile.casePlaceholder);
            setText('full-ref-label-text', refProfile.fullLabel);
            setText('full-ref-help-text', refProfile.fullHelp);
            setPlaceholder('fullRef', refProfile.fullPlaceholder);
            setText('serial-label-text', profile.serialLabel);
            setText('serial-help-text', profile.serialHelp);
            setPlaceholder('serialInput', profile.serialPlaceholder);
            setText('clasp-label-text', profile.claspLabel);
            setText('clasp-help-text', profile.claspHelp);
            setPlaceholder('claspCode', profile.claspPlaceholder);
            setText('movement-calibre-label-text', brand === 'Rolex' ? 'Observed Rolex calibre' : 'Observed calibre / reference');
            setText('movement-calibre-help-text', brand === 'Rolex' ? 'Compared with the full reference when entered, otherwise the case stamp' : 'Observed movement');
            setPlaceholder('movementCalibre', brand === 'Rolex' ? 'e.g. Cal. 3135 or 3235' : 'e.g. Cal. 3135');
            refreshMovementCalibreSuggestions();
            setText('drawer-brand-title', profile.drawerTitle);
            setText('drawer-brand-subtitle', profile.drawerSubtitle);
            setText('drawer-live-title', `${brand} live output`);

            const guideButton = document.getElementById('reference-guide-btn');
            if (guideButton) guideButton.innerHTML = `${brand === 'Generic' ? 'General' : brand} reference <span aria-hidden="true">→</span>`;

            const omegaOptions = document.getElementById('omega-serial-options');
            if (omegaOptions) omegaOptions.classList.toggle('hidden', brand !== 'Omega');

            // Tudor uses one reference field. Its case/model references and complete M-prefixed
            // variants are resolved through the same lookup, so a second catalogue field adds
            // unnecessary duplication.
            const fullRefInput = document.getElementById('fullRef');
            if (fullRefInput && fullRefInput.value) fullRefInput.value = '';

            const officialBrandTools = {
                'Cartier': document.getElementById('cartier-official-tools'),
                'Jaeger-LeCoultre': document.getElementById('jlc-official-tools'),
                'Panerai': document.getElementById('panerai-official-tools')
            };
            Object.entries(officialBrandTools).forEach(([toolBrand, element]) => {
                if (element) element.classList.toggle('hidden', brand !== toolBrand);
            });

            const rolexSections = document.getElementById('rolex-reference-sections');
            const brandSections = document.getElementById('brand-reference-sections');
            if (rolexSections) rolexSections.classList.toggle('hidden', brand !== 'Rolex');
            if (brandSections) brandSections.classList.toggle('hidden', brand === 'Rolex');
            setText('brand-reference-heading', `${brand} inspection focus`);
            setText('brand-reference-summary', profile.summary);

            const flagsContainer = document.getElementById('brand-reference-flags');
            if (flagsContainer) {
                const entries = Object.entries(specific);
                let cards = entries.length
                    ? entries.map(([component, guidance]) => `<div class="bg-gray-950/60 border border-gray-800 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">${component}</div><div class="text-xs text-gray-300 leading-relaxed">${guidance}</div></div>`).join('')
                    : `<div class="bg-gray-950/60 border border-gray-800 rounded-xl p-4 text-xs text-gray-400">No embedded ${brand} specimen rules are available. Record identifiers and use manufacturer-specific reference material.</div>`;
                if (brand === 'Rolex') {
                    cards += `<div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">Reference-to-movement cross-check</div><div class="text-xs text-gray-300 leading-relaxed">Enter the case-stamped reference and, when available, the full model reference plus observed calibre. The full reference is used for configuration lookup. Exact rules cover key Submariner, GMT-Master II, Explorer II, Daytona and Datejust generations. A mismatch is flagged as an incorrect factory configuration.</div></div>`;
                    cards += `<div class="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">Prefix-rule limitation</div><div class="text-xs text-gray-300 leading-relaxed">The 116/114/166 and 126/124/226 prefixes are useful era clues, not universal calibre answers. Daytona and other family-specific exceptions must use the exact reference mapping.</div></div>`;
                }
                if (brand === 'Breitling') {
                    cards += `<div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">Reference-code structure</div><div class="text-xs text-gray-300 leading-relaxed">On many modern 12-character Breitling references, the first character indicates case/bezel material; positions 2–3 identify the movement family; position 4 commonly indicates COSC status; positions 5–6 identify the model family; positions 7–8 identify finish; position 9 indicates dial colour; the last three characters identify the dial design. Use this as supporting guidance because exceptions and older formats exist.</div></div>`;
                    cards += `<div class="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">Four-digit production code</div><div class="text-xs text-gray-300 leading-relaxed">Many Breitling watches carry a separate four-digit production code between the lower lugs at 6 o’clock, often hidden by the bracelet. The first two digits indicate the production week and the last two indicate the year. This is not the watch’s unique serial number. Example: <strong>2319</strong> means week 23 of 2019.</div><a class="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300" href="https://www.bqwatches.com/how-to-check-a-breitling-serial-number" target="_blank" rel="noopener noreferrer">Open Breitling number guide →</a></div>`;
                    cards += `<div class="bg-red-950/20 border border-red-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2">Use with caution</div><div class="text-xs text-gray-300 leading-relaxed">Reference decoding and a plausible production code support identification but do not prove authenticity. Confirm engraving quality, full reference, unique serial, movement, dial and case generation together.</div></div>`;
                }
                if (brand === 'Omega') {
                    cards += `<div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">Finding the serial</div><div class="text-xs text-gray-300 leading-relaxed">Inspect the movement bridge, interior caseback, exterior caseback, and back of the lugs. Exterior placement became more common from the early 1990s. Older examples may require caseback removal.</div></div>`;
                    cards += `<div class="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">Interpretation limits</div><div class="text-xs text-gray-300 leading-relaxed">Use the date as an estimate only. Movement manufacture can precede final assembly, and Speedmaster serials require the separate Speedmaster chart.</div><a class="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300" href="https://www.watchesbytimepiece.com/knowledge-base/omega-serial-numbers/" target="_blank" rel="noopener noreferrer">Open serial reference source →</a></div>`;
                }
                if (brand === 'Tudor') {
                    cards += `<div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">Reference lookup</div><div class="text-xs text-gray-300 leading-relaxed">Enter the Tudor reference in the single reference field. It accepts short case references and complete M-prefixed catalogue references. Recognised references display the model family, size, expected movement, reserve and configuration clues. A -0001-style suffix is treated as a configuration variant rather than a different base calibre.</div></div>`;
                    cards += `<div class="bg-blue-950/20 border border-blue-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2">Serial guidance</div><div class="text-xs text-gray-300 leading-relaxed">The separate serial field provides estimated dating guidance. It does not affect the reference-to-model lookup.</div></div>`;
                    cards += `<div class="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">Dating limitations</div><div class="text-xs text-gray-300 leading-relaxed">Purely numeric serials generally indicate vintage production, while later examples commonly combine letters and numbers. The embedded 1956–2002 dates are collector-compiled estimates, not an official Tudor archive.</div><a class="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-400 hover:text-blue-300" href="https://www.bobswatches.com/tudor/tudor-serial-number-check" target="_blank" rel="noopener noreferrer">Open serial reference source →</a></div>`;
                    cards += `<div class="bg-red-950/20 border border-red-900/40 rounded-xl p-4"><div class="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-2">Authentication use</div><div class="text-xs text-gray-300 leading-relaxed">Compare the engraving quality, case reference, movement and apparent age. A matching format or estimated year is supporting evidence only; duplicated serials and altered cases remain possible.</div></div>`;
                }
                flagsContainer.innerHTML = cards;
            }

            categories.forEach((cat, idx) => {
                const btn = document.getElementById(`btn-${idx}-2`);
                if (btn) btn.title = specific[cat] || generic[cat] || `Inspect the ${cat.toLowerCase()} using ${brand}-specific construction and finishing references.`;
            });

            // Re-render existing values under the newly selected brand. Old-brand popups disappear immediately.
            runRolexForensicAnalysis();
            initialiseContextGuidance();
        }

        function toggle(idx, state) {
            if (states[idx] === state) states[idx] = 0;
            else states[idx] = state;
            
            [1, 2, 3].forEach(s => {
                const btn = document.getElementById(`btn-${idx}-${s}`);
                btn.className = "w-12 h-9 flex items-center justify-center rounded-lg text-[10px] font-black border transition";
                if (states[idx] === s) {
                    if (s === 1) btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-400');
                    if (s === 2) btn.classList.add('bg-amber-600', 'text-white', 'border-amber-400');
                    if (s === 3) btn.classList.add('bg-red-600', 'text-white', 'border-red-400');
                } else btn.className = "w-12 h-9 flex items-center justify-center rounded-lg text-[10px] font-black border border-gray-700 bg-gray-800 text-gray-500";
            });

            const actionBox = document.getElementById(`action-box-${idx}`);
            const maybeUi = document.getElementById(`maybe-ui-${idx}`);
            const noUi = document.getElementById(`no-ui-${idx}`);

            if (states[idx] === 2) {
                actionBox.classList.add('active');
                maybeUi.classList.remove('hidden');
                noUi.classList.add('hidden');
            } else if (states[idx] === 3) {
                actionBox.classList.add('active');
                maybeUi.classList.add('hidden');
                noUi.classList.remove('hidden');
            } else {
                actionBox.classList.remove('active');
            }

            updateScore();
            autoGenerate();
        }

        function updateReason(idx, val) { reasons[idx] = val; autoGenerate(); }

        function updateScore() {
            const noCount = Object.values(states).filter(s => s === 3).length;
            const okCount = Object.values(states).filter(s => s === 1).length;
            const maybeCount = Object.values(states).filter(s => s === 2).length;
            const meter = document.getElementById('confidence-meter');
            const bar = document.getElementById('progress-bar');

            if (noCount > 0) {
                meter.innerText = `REJECTED`;
                meter.className = "text-xs font-bold mb-2 text-red-500 uppercase tracking-widest";
                bar.style.width = "100%";
                bar.className = "h-full bg-red-600";
            } else {
                let perc = Math.round(((okCount + (maybeCount * 0.5)) / categories.length) * 100);
                meter.innerText = perc === 0 ? "READY" : `CONFIDENCE: ${perc}%`;
                meter.className = "text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest";
                bar.style.width = `${perc}%`;
                bar.className = perc > 80 ? "h-full bg-emerald-500" : "h-full bg-blue-600";
            }
        }

        function handleMovementTypeChange() {
            const select = document.getElementById('movementType');
            const batterySection = document.getElementById('battery-changed-section');
            const isQuartz = !!select && /^Quartz\b/i.test(select.value);
            if (batterySection) batterySection.classList.toggle('hidden', !isQuartz);
            if (!isQuartz) {
                document.querySelectorAll('input[name="batteryChanged"]').forEach(input => input.checked = false);
            }
            autoGenerate();
        }

        /* --- STREAMING_CHUNK: Running Authentication Note Assembly --- */

        function compactResultText(id, maxLength = 180) {
            const element = document.getElementById(id);
            if (!element || element.classList.contains('hidden')) return '';
            const value = element.textContent.replace(/\s+/g, ' ').trim();
            if (!value) return '';
            return value.length > maxLength ? value.slice(0, maxLength - 1).trim() + '…' : value;
        }

        function extractSummaryValue(text, labels) {
            const clean = String(text || '').replace(/\s+/g, ' ').trim();
            for (const label of labels) {
                const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const match = clean.match(new RegExp(`${escaped}\\s*:?\\s*([^|•]+?)(?=\\s+(?:Expected|Observed|Approximate|Production|Model|Family|Calibre|Movement|Size|Reserve|Generation|Source|Confidence|Notes|Age class)\\s*:|$)`, 'i'));
                if (match && match[1].trim()) return match[1].trim();
            }
            return '';
        }


        const LIVE_SUMMARY_MINIMISED_KEY = 'watchAuthProLiveSummaryMinimised';

        function toggleLiveSummary() {
            const card = document.getElementById('live-summary-card');
            if (!card) return;
            const minimised = card.classList.toggle('minimised');
            const button = card.querySelector('.live-summary-control');
            if (button) button.textContent = minimised ? '+' : '−';
            try { localStorage.setItem(LIVE_SUMMARY_MINIMISED_KEY, minimised ? 'true' : 'false'); } catch (_) {}
        }

        function initialiseLiveSummaryState() {
            const card = document.getElementById('live-summary-card');
            if (!card) return;
            let minimised = false;
            try { minimised = localStorage.getItem(LIVE_SUMMARY_MINIMISED_KEY) === 'true'; } catch (_) {}
            card.classList.toggle('minimised', minimised);
            const button = card.querySelector('.live-summary-control');
            if (button) button.textContent = minimised ? '+' : '−';
        }

        function updateLiveWatchSummary() {
            const box = document.getElementById('live-watch-summary');
            const state = document.getElementById('live-summary-state');
            if (!box) return;

            const brand = getSelectedBrand();
            const reference = document.getElementById('caseRef')?.value.trim() || '';
            const fullReference = document.getElementById('fullRef')?.value.trim() || '';
            const serial = document.getElementById('serialInput')?.value.trim().toUpperCase() || '';
            const observedCalibre = document.getElementById('movementCalibre')?.value.trim() || '';
            const movementType = document.getElementById('movementType')?.value || '';

            const caseText = compactResultText('caseResult', 420);
            const movementText = compactResultText('movementMatchResult', 360);
            const dateText = compactResultText('dateEstimateResult', 240);
            const ageText = compactResultText('ageClassificationResult', 180);
            const counterfeitText = compactResultText('counterfeit-match-alert', 260);

            const model = extractSummaryValue(caseText, ['Model', 'Family', 'Watch']);
            const expectedCalibre =
                extractSummaryValue(movementText, ['Expected calibre', 'Expected Calibre', 'Expected movement']) ||
                extractSummaryValue(caseText, ['Expected calibre', 'Calibre']);
            const approximateDate =
                extractSummaryValue(dateText, ['Approximate date']) ||
                extractSummaryValue(caseText, ['Approximate production', 'Production']);
            const ageClass =
                extractSummaryValue(ageText, ['Age class']) ||
                (/VINTAGE/i.test(ageText) ? 'Vintage' : /MODERN/i.test(ageText) ? 'Modern' : /CHECK DATE/i.test(ageText) ? 'Check date' : '');

            const rows = [];
            if (brand && brand !== 'Generic') rows.push(['Brand', brand]);
            if (reference) rows.push(['Reference', reference]);
            if (fullReference && fullReference !== reference) rows.push(['Full ref.', fullReference]);
            if (model) rows.push(['Model', model]);
            if (serial) rows.push(['Serial', serial]);
            if (approximateDate) rows.push(['Approx. date', approximateDate]);
            if (ageClass) rows.push(['Age class', ageClass]);
            if (expectedCalibre) rows.push(['Expected', expectedCalibre]);
            if (observedCalibre) rows.push(['Observed', observedCalibre]);
            if (movementType) rows.push(['Technology', movementType]);

            let warning = '';
            let danger = false;
            if (counterfeitText) {
                warning = counterfeitText;
                danger = /previously recorded by your team|counterfeit/i.test(counterfeitText);
            } else if (/mismatch|manual review|no exact|not recognised|incomplete|no database match/i.test(`${caseText} ${movementText}`)) {
                const rawWarning = compactResultText('movementMatchResult', 200) || compactResultText('caseResult', 200);
                if (/no exact|no database match|not recognised/i.test(rawWarning)) {
                    warning = 'No exact database match.';
                } else if (/incomplete/i.test(rawWarning)) {
                    warning = 'Incomplete reference. Manual review required.';
                } else {
                    warning = rawWarning;
                }
                danger = /mismatch/i.test(warning);
            }

            if (!rows.length && !warning) {
                box.innerHTML = '<div class="live-summary-empty">Enter a brand or reference.</div>';
                if (state) state.textContent = 'Waiting';
                return;
            }

            box.innerHTML = rows.map(([label, value]) =>
                `<div class="live-summary-row"><div class="live-summary-label">${escapeHtml(label)}</div><div class="live-summary-value">${escapeHtml(value)}</div></div>`
            ).join('') + (warning
                ? `<div class="live-summary-warning${danger ? ' danger' : ''}">${escapeHtml(warning)}</div>`
                : '');

            if (state) {
                if (danger) state.textContent = 'Warning';
                else if (warning) state.textContent = 'Review';
                else if (reference || serial) state.textContent = 'Live';
                else state.textContent = 'Started';
            }
        }

        function initialiseLiveWatchSummary() {
            return; // v2.47.0: the existing preview is the single inspection summary.
            const watchedIds = [
                'caseResult', 'serialResult', 'movementMatchResult',
                'dateEstimateResult', 'ageClassificationResult',
                'counterfeit-match-alert', 'claspResult'
            ];
            const observer = new MutationObserver(() => updateLiveWatchSummary());
            watchedIds.forEach(id => {
                const element = document.getElementById(id);
                if (element) observer.observe(element, {
                    childList:true, subtree:true, characterData:true,
                    attributes:true, attributeFilter:['class']
                });
            });
            updateLiveWatchSummary();
        }

        function autoGenerate() {
            updateCounterfeitMatchAlert();
            let parts = [];
            const mTypeSelect = document.getElementById('movementType');
            const mType = mTypeSelect ? mTypeSelect.value : "";
            const mComplicationsInput = document.getElementById('movementComplications');
            const mComplications = mComplicationsInput ? mComplicationsInput.value.trim() : "";
            
            const mCalibreInput = document.getElementById('movementCalibre');
            const mCalibre = mCalibreInput ? mCalibreInput.value.trim() : "";
            
            const clasp = document.getElementById('claspCode').value.trim();
            const comms = document.getElementById('comments').value.trim();

            const serialInput = document.getElementById('serialInput');
            const serialVal = serialInput ? serialInput.value.trim().toUpperCase() : "";

            // Core Specs
            if (mType) parts.push(`Movement Technology: ${mType}`);
            if (mCalibre) parts.push(`Observed Calibre/Ref: ${mCalibre}`);
            if (mComplications) parts.push(`Movement Notes: ${mComplications}`);
            if (/^Quartz\b/i.test(mType)) {
                const batteryChanged = document.querySelector('input[name="batteryChanged"]:checked');
                if (batteryChanged) parts.push(batteryChanged.value === 'Yes' ? 'BATT Y' : 'BATT N');
            }
            if (clasp) parts.push(`Clasp Code/Ref: ${clasp}`);
            if (serialVal) parts.push(`Serial/Rehaut: ${serialVal}`);

            // Condition Codes (Only show if checked)
            let codes = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                const code = cb.getAttribute('data-code');
                if (code) codes.push(code);
            });
            if (codes.length > 0) parts.push(`Condition Codes: ${codes.join(', ')}`);

            // Comments
            if (comms) parts.push(`Comments: ${comms}`);

            const finalString = parts.join('\n');
            document.getElementById("output").textContent = finalString || "No inspection details entered.";
            updateLiveWatchSummary();
            return finalString;
        }

        function copyNote() {
            const txt = autoGenerate();
            const el = document.createElement('textarea');
            el.value = txt; document.body.appendChild(el); el.select();
            document.execCommand('copy'); document.body.removeChild(el);
            showToast("COPIED TO CLIPBOARD");
        }

        function copyCaseRef() {
            const val = document.getElementById('caseRef').value.trim();
            if (!val) return;
            const el = document.createElement('textarea');
            el.value = val; document.body.appendChild(el); el.select();
            document.execCommand('copy'); document.body.removeChild(el);
            showToast("CASE REF COPIED");
        }

        function copyFullRef() {
            const val = document.getElementById('fullRef').value.trim();
            if (!val) return;
            const el = document.createElement('textarea');
            el.value = val; document.body.appendChild(el); el.select();
            document.execCommand('copy'); document.body.removeChild(el);
            showToast('FULL REF COPIED');
        }

        function copySerialRef() {
            const val = document.getElementById('serialInput').value.trim().toUpperCase();
            if (!val) return;
            const el = document.createElement('textarea');
            el.value = val; document.body.appendChild(el); el.select();
            document.execCommand('copy'); document.body.removeChild(el);
            showToast("SERIAL COPIED");
        }

        function showToast(message) {
            const t = document.getElementById('toast');
            t.innerText = message;
            t.style.opacity = '1';
            setTimeout(() => t.style.opacity = '0', 1500);
        }

        /* --- STREAMING_CHUNK: Managing Persistent Local History --- */
        function saveInspectionToHistory() {
            const brand = getSelectedBrand();
            const caseRef = document.getElementById('caseRef').value.trim();
            const fullRef = document.getElementById('fullRef').value.trim();
            const serialInput = document.getElementById('serialInput');
            const serialVal = serialInput ? serialInput.value.trim().toUpperCase() : "";
            const claspCode = document.getElementById('claspCode').value.trim();
            const mTypeSelect = document.getElementById('movementType');
            const mType = mTypeSelect ? mTypeSelect.value : "";
            const mComplications = document.getElementById('movementComplications').value.trim();
            const mCalibre = document.getElementById('movementCalibre').value.trim();
            const comments = document.getElementById('comments').value.trim();
            const batteryChangedInput = document.querySelector('input[name="batteryChanged"]:checked');
            const batteryChanged = batteryChangedInput ? batteryChangedInput.value : "";

            if (!caseRef && !fullRef && !claspCode && !mType && !mComplications && !mCalibre && !comments && !serialVal && !batteryChanged) {
                return; 
            }

            let codes = [];
            document.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                const code = cb.getAttribute('data-code');
                if (code) codes.push(code);
            });

            const noCount = Object.values(states).filter(s => s === 3).length;
            const status = noCount > 0 ? "REJECTED" : "PASSED";

            const now = new Date();
            const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            const record = {
                id: Date.now(),
                timestamp: timestamp,
                brand: brand,
                caseRef: caseRef || "N/A",
                fullRef: fullRef || "N/A",
                serial: serialVal || "N/A",
                claspCode: claspCode || "N/A",
                mType: mType || "N/A",
                mComplications: mComplications || "N/A",
                mCalibre: mCalibre || "N/A",
                batteryChanged: batteryChanged || "N/A",
                conditions: codes.join(', ') || "N/A",
                status: status,
                comments: comments || "N/A",
                note: autoGenerate()
            };

            watchHistory.unshift(record);
            safeStorageSet('watch_history', JSON.stringify(watchHistory));
        }

        function renderHistoryTable() {
            const tbody = document.getElementById('history-table-body');
            tbody.innerHTML = "";

            if (watchHistory.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="9" class="text-center p-8 text-gray-500">
                            No inspections saved yet. Complete an inspection and choose “Save & start next”.
                        </td>
                    </tr>
                `;
                return;
            }

            watchHistory.forEach(record => {
                const tr = document.createElement('tr');
                tr.className = "hover:bg-gray-900/40 transition-colors";
                
                const statusColor = record.status === "PASSED" ? "text-emerald-500 bg-emerald-950/30 border border-emerald-900/50" : "text-red-500 bg-red-950/30 border border-red-900/50";

                tr.innerHTML = `
                    <td class="p-4 text-xs text-gray-400 whitespace-nowrap">${record.timestamp}</td>
                    <td class="p-4 font-bold text-white text-xs">${record.brand}</td>
                    <td class="p-4 font-mono text-xs text-gray-300"><span class="block">${record.caseRef}</span>${record.fullRef && record.fullRef !== 'N/A' ? `<span class="block mt-1 text-[10px] text-blue-300">Full: ${record.fullRef}</span>` : ''}</td>
                    <td class="p-4 font-mono text-xs text-gray-300">${record.serial || 'N/A'}</td>
                    <td class="p-4 text-xs text-gray-300">
                        <span class="text-[10px] text-gray-500 block uppercase font-bold">${record.mType}</span>
                        <span class="block mt-1">${record.mCalibre}</span>
                        ${record.mComplications && record.mComplications !== 'N/A' ? `<span class="block text-[10px] text-gray-500 mt-1">${record.mComplications}</span>` : ''}
                    </td>
                    <td class="p-4 text-xs font-mono text-gray-300">${record.claspCode}</td>
                    <td class="p-4 text-xs text-amber-500 font-bold">${record.conditions}</td>
                    <td class="p-4 text-center">
                        <span class="text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full ${statusColor}">${record.status}</span>
                    </td>
                    <td class="p-4 text-right whitespace-nowrap">
                        <div class="flex items-center justify-end gap-2">
                            <button onclick="copyHistoricalNote(${record.id})" title="Copy Authentication Note" class="px-2.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-lg transition uppercase tracking-tighter">
                                Note
                            </button>
                            <button onclick="deleteHistoryItem(${record.id})" title="Delete Log" class="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-900/30 text-red-400 text-xs font-bold rounded-lg transition">
                                ✕
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        function copyHistoricalNote(id) {
            const item = watchHistory.find(r => r.id === id);
            if (!item) return;

            const el = document.createElement('textarea');
            el.value = item.note;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            showToast("HISTORICAL NOTE COPIED");
        }

        function deleteHistoryItem(id) {
            watchHistory = watchHistory.filter(r => r.id !== id);
            safeStorageSet('watch_history', JSON.stringify(watchHistory));
            renderHistoryTable();
            updateCounterDisplay();
            showToast("LOG DELETED");
        }

        function exportHistoryCSV() {
            if (watchHistory.length === 0) {
                showToast("NO LOGS TO EXPORT");
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "Timestamp,Brand,Case-Stamped Ref,Full Model Ref,Serial,Clasp Code,Movement Technology,Calibre,Additional Movement Notes,Conditions,Status,Comments\n";

            watchHistory.forEach(r => {
                const _serial = r.serial || "N/A";
                const escapedComments = `"${r.comments.replace(/"/g, '""')}"`;
                const row = [
                    r.timestamp,
                    r.brand,
                    r.caseRef,
                    r.fullRef || 'N/A',
                    _serial,
                    r.claspCode,
                    r.mType,
                    r.mCalibre,
                    r.mComplications || "N/A",
                    r.conditions,
                    r.status,
                    escapedComments
                ].join(",");
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Watch_Auth_Pro_Logs_${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast("CSV EXPORTED");
        }


        function updateManualReviewQueueActions() {
            const actions = document.getElementById('manual-review-queue-actions');
            const caseReference = (document.getElementById('caseRef')?.value || '').trim();
            const resultBox = document.getElementById('caseResult');
            const drawerBox = document.getElementById('drawer-live-decoding');
            const contextBox = document.getElementById('context-guidance');
            if (!actions) return false;

            const visibleResultText = resultBox && !resultBox.classList.contains('hidden')
                ? resultBox.textContent.replace(/\s+/g, ' ').trim()
                : '';
            const drawerText = drawerBox
                ? drawerBox.textContent.replace(/\s+/g, ' ').trim()
                : '';
            const contextText = contextBox && contextBox.classList.contains('visible')
                ? contextBox.textContent.replace(/\s+/g, ' ').trim()
                : '';
            const combinedText = `${visibleResultText} ${drawerText} ${contextText}`.trim();

            const unresolved = Boolean(caseReference) && (
                /requires manual review|reference manual review|no exact (?:embedded )?(?:model\/calibre )?mapping|no database (?:search|match)|no match|not recognised|incomplete reference|manual confirmation/i.test(combinedText) ||
                Boolean(resultBox?.querySelector('button[onclick="addCurrentMissingReferenceToQueue()"]'))
            );

            actions.classList.toggle('hidden', !unresolved);
            actions.dataset.manualReview = unresolved ? 'true' : 'false';
            return unresolved;
        }

        function referenceCurrentlyRequiresManualReview() {
            return updateManualReviewQueueActions();
        }

        function resetAll() {
            const completedBrand = getSelectedBrand();
            // Automatically preserve unresolved references before the form is cleared.
            const queuedForManualReview = referenceCurrentlyRequiresManualReview();
            if (queuedForManualReview) addCurrentMissingReferenceToQueue();

            // Save data locally
            saveInspectionToHistory();

            // Increment workloads count and adaptive brand usage
            recordCompletedBrand(completedBrand);
            inspections++;
            safeStorageSet('inspection_count', inspections);
            updateCounterDisplay();

            // Clear specifications UI
            document.getElementById('caseRef').value = "";
            document.getElementById('fullRef').value = "";
            document.getElementById('serialInput').value = "";
            document.getElementById('claspCode').value = "";
            document.getElementById('movementType').selectedIndex = 0;
            document.getElementById('movementCalibre').value = "";
            document.getElementById('movementComplications').value = "";
            document.querySelectorAll('input[name="batteryChanged"]').forEach(input => input.checked = false);
            const batterySection = document.getElementById('battery-changed-section');
            if (batterySection) batterySection.classList.add('hidden');
            const omegaSeries = document.getElementById('omegaSerialSeries');
            if (omegaSeries) omegaSeries.value = 'standard';
            document.getElementById('comments').value = "";
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            
            // Re-select Generic brand checkbox as default
            document.querySelectorAll('.brand-checkbox').forEach(cb => {
                cb.checked = (cb.value === "Generic");
            });

            sortBrandCards();
            init();
            initialiseContextGuidance();
            updateScore();
            
            // Collapse result boxes if any
            const resultBox = document.getElementById('serialResult');
            if (resultBox) {
                resultBox.innerHTML = '';
                resultBox.classList.add('hidden');
            }
            const claspResultBox = document.getElementById('claspResult');
            if (claspResultBox) {
                claspResultBox.innerHTML = '';
                claspResultBox.classList.add('hidden');
            }
            const movementResultBox = document.getElementById('movementMatchResult');
            if (movementResultBox) {
                movementResultBox.innerHTML = '';
                movementResultBox.classList.add('hidden');
            }
            const manualReviewActions = document.getElementById('manual-review-queue-actions');
            if (manualReviewActions) {
                manualReviewActions.classList.add('hidden');
                manualReviewActions.dataset.manualReview = 'false';
            }
            currentRolexMovementAssessment = null;
            
            showToast(queuedForManualReview ? "INSPECTION SAVED — MANUAL REVIEW ADDED TO QUEUE" : "INSPECTION SAVED — READY FOR NEXT");
        }



        function normaliseBrandSearch(value) {
            return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
        }

        const BRAND_USAGE_KEY = 'watch_auth_brand_usage';

        function getBrandUsage() {
            try { return JSON.parse(localStorage.getItem(BRAND_USAGE_KEY) || '{}') || {}; } catch (_) { return {}; }
        }

        function recordCompletedBrand(brand) {
            if (!brand || brand === 'Generic') return;
            const usage = getBrandUsage();
            usage[brand] = (Number(usage[brand]) || 0) + 1;
            safeStorageSet(BRAND_USAGE_KEY, JSON.stringify(usage));
        }

        function resetBrandUsageOrder() {
            safeStorageSet(BRAND_USAGE_KEY, '{}');
            sortBrandCards();
            filterBrandCards();
            showToast('BRAND ORDER RESET');
        }

        function updateBrandUsageBadges() {
            // Completed-inspection counts are used only for adaptive sorting.
            // Never display them on the brand-selection buttons.
            document.querySelectorAll('#brandGrid .brand-usage-badge').forEach(badge => badge.remove());
        }

        function textFromBox(id) {
            const box = document.getElementById(id);
            return box && !box.classList.contains('hidden') ? box.textContent.replace(/\s+/g,' ').trim() : '';
        }

        function getWatchSpecificContext() {
            const caseBox = document.getElementById('caseResult');
            const dateBox = document.getElementById('dateEstimateResult');
            const movementBox = document.getElementById('movementMatchResult');
            const caseText = textFromBox('caseResult');
            const dateText = textFromBox('dateEstimateResult');
            const movementText = textFromBox('movementMatchResult');
            const strongValues = caseBox ? Array.from(caseBox.querySelectorAll('strong')).map(el => el.textContent.trim()).filter(Boolean) : [];
            const ignored = /^(source|confidence|inspection use|expected movement|power reserve|reference|format|system)$/i;
            const model = strongValues.find(value => !ignored.test(value) && !/^v?\d+(?:\.\d+)+$/i.test(value)) || '';
            const expected = (caseText.match(/Expected movement:\s*([^·\n]+)/i) || caseText.match(/Expected calibre:\s*([^·\n]+)/i) || [])[1]?.trim() || '';
            const reserve = (caseText.match(/Power reserve:\s*([^\n]+)/i) || [])[1]?.trim() || '';
            const size = (caseText.match(/(?:Size|Case size):\s*([^·\n]+)/i) || [])[1]?.trim() || '';
            const status = /manual review|missing reference|no exact|incomplete|confirm/i.test(caseText) ? 'Manual review' : (caseText ? 'Embedded match' : 'No match');
            const mismatch = /mismatch|incorrect|not consistent|does not align|manual review/i.test(movementText);
            return { caseText, dateText, movementText, model, expected, reserve, size, status, mismatch, caseBox, dateBox, movementBox };
        }

        function watchSpecificSummary(data, options = {}) {
            const rows = [];
            if (data.model) rows.push(`<div><strong>Watch:</strong> ${escapeHtml(data.model)}</div>`);
            if (data.expected) rows.push(`<div><strong>Expected calibre:</strong> ${escapeHtml(data.expected)}</div>`);
            if (data.reserve) rows.push(`<div><strong>Power reserve:</strong> ${escapeHtml(data.reserve)}</div>`);
            if (data.size) rows.push(`<div><strong>Case size:</strong> ${escapeHtml(data.size)}</div>`);
            if (data.dateText) rows.push(`<div><strong>Approximate date:</strong> ${escapeHtml(data.dateText.slice(0, 300))}</div>`);
            if (options.includeStatus) rows.push(`<div><strong>Database status:</strong> ${escapeHtml(data.status)}</div>`);
            return rows.length ? `<div class="space-y-1.5">${rows.join('')}</div>` : '';
        }

        function getContextGuidance(target) {
            const brand = getSelectedBrand();
            const ref = (document.getElementById('caseRef')?.value || '').trim();
            const serial = (document.getElementById('serialInput')?.value || '').trim();
            const calibre = (document.getElementById('movementCalibre')?.value || '').trim();
            const caseText = textFromBox('caseResult');
            const serialText = textFromBox('serialResult');
            const movementText = textFromBox('movementMatchResult');
            const dateText = textFromBox('dateEstimateResult');
            const watch = getWatchSpecificContext();
            const id = target.id || target.closest('[id]')?.id || '';
            const field = target.closest('.field, .brand-card, .condition-card, #caseResult, #serialResult, #movementMatchResult, #dateEstimateResult, #ageClassificationResult');
            const fieldId = field?.querySelector('input,select,textarea')?.id || field?.id || id;
            let title = '', copy = '', alert = '', danger = false;

            if (target.closest('.brand-card')) {
                const hoveredBrand = target.closest('.brand-card').querySelector('.brand-checkbox')?.value || brand;
                title = `${hoveredBrand} inspection focus`;
                const profile = BRAND_PROFILES[hoveredBrand];
                copy = profile?.summary || `Selecting ${hoveredBrand} applies only the embedded checks available for that brand.`;
                if (hoveredBrand === brand && ref && watch.caseText) copy += `<div class="mt-3 pt-3 border-t border-white/10">${watchSpecificSummary(watch, {includeStatus:true})}</div>`;
                alert = hoveredBrand === 'Generic' ? 'Other mode records evidence but cannot safely apply brand-specific reference, serial or calibre rules.' : 'Coverage varies by brand. Exact embedded mappings are stronger than general brand guidance.';
            } else if (fieldId === 'caseRef' || id === 'caseResult') {
                title = ref ? `${brand} reference ${ref}` : 'Reference from case';
                if (!ref) copy = `Enter the complete ${brand === 'Generic' ? 'manufacturer' : brand} case reference exactly as marked, including letters, punctuation and suffixes.`;
                else if (watch.status === 'Manual review') {
                    copy = `${watchSpecificSummary(watch, {includeStatus:true})}<div class="mt-3">This reference is not fully resolved. Recheck every character, suffix and case marking before relying on the result.</div>`;
                    alert = 'Do not treat format recognition as model confirmation. Save & Start Next will add this reference to the research queue.';
                } else {
                    copy = watchSpecificSummary(watch, {includeStatus:true}) || caseText || `Use the ${brand} reference together with the observed calibre, case construction, dial layout and approximate date.`;
                    if (watch.expected) alert = `When the case is opened, the movement should be consistent with ${watch.expected}. Check the actual architecture and markings—not only the calibre text.`;
                }
            } else if (fieldId === 'serialInput' || id === 'serialResult') {
                title = serial ? `${brand} serial guidance` : 'Serial number';
                copy = serialText || (serial ? `No reliable embedded serial-date table is available for ${brand}. Check placement, engraving quality and consistency with the model generation.` : `Record the ${brand} serial exactly as marked and note where it appears.`);
                if (watch.model || watch.expected) copy += `<div class="mt-3 pt-3 border-t border-white/10">${watchSpecificSummary(watch)}</div>`;
                alert = dateText ? `Use the date estimate as a consistency check against the expected model generation and movement.` : 'Serial dates are consistency checks, not proof of authenticity or an exact sale date.';
            } else if (fieldId === 'movementType') {
                title = ref ? `Movement type for ${brand} ${ref}` : 'Movement technology';
                const specific = watchSpecificSummary(watch);
                copy = specific || `Select what is physically observed. Do not infer automatic, manual or quartz solely from the model name.`;
                if (watch.expected) alert = `Expected calibre: ${watch.expected}. Confirm whether its architecture is automatic, manual-wind, quartz or hybrid before selecting the technology.`;
                else if (ref && caseText) alert = 'Use the reference result as a cross-check only; the opened movement remains the primary observation.';
            } else if (fieldId === 'movementCalibre' || id === 'movementMatchResult') {
                title = calibre ? `Observed calibre ${calibre}` : (watch.expected ? `Expected calibre ${watch.expected}` : 'Observed calibre');
                const specific = watchSpecificSummary(watch);
                if (!calibre) copy = `${specific}${specific ? '<div class="mt-3">' : ''}Record the calibre from the movement itself. Check bridge layout, rotor, regulator, finishing and complications—not only the printed number.${specific ? '</div>' : ''}`;
                else if (watch.mismatch) {
                    copy = `${specific}${specific ? '<div class="mt-3">' : ''}${movementText || 'The observed calibre does not align cleanly with the current reference result.'}${specific ? '</div>' : ''}`;
                    alert = `Expected: ${watch.expected || 'not resolved'}. Observed: ${calibre}. Recheck the reference and calibre reading; consider a replacement movement, altered bridge, mixed components or an incomplete reference.`;
                    danger = true;
                } else {
                    copy = `${specific}${specific ? '<div class="mt-3">' : ''}${movementText || `Confirm that ${calibre} architecture and finishing are appropriate for ${brand}${ref ? ` ${ref}` : ''}.`}${specific ? '</div>' : ''}`;
                    if (watch.expected) alert = `Expected calibre for this watch: ${watch.expected}. Compare the actual movement construction and finishing with that calibre family.`;
                }
            } else if (fieldId === 'movementComplications') {
                title = watch.model ? `${watch.model} movement checks` : 'Movement-specific observations';
                copy = `${watchSpecificSummary(watch)}<div class="mt-3">Record details that distinguish this movement: module construction, column wheel or cam, escapement, rotor style, bridge shape, jewel layout and unusual markings.</div>`;
            } else if (target.closest('.condition-card')) {
                title = watch.model ? `${watch.model} movement condition` : 'Movement condition';
                copy = `${watchSpecificSummary(watch)}<div class="mt-3">Select condition only after the case has been opened and the movement viewed. Condition describes physical state, not authenticity.</div>`;
                if (!calibre) alert = watch.expected ? `Expected calibre is ${watch.expected}, but no observed calibre has been entered yet.` : 'No observed calibre has been entered yet. Confirm the movement identity before relying on condition observations.';
            } else if (fieldId === 'claspCode' || id === 'claspResult') {
                title = watch.model ? `${watch.model} bracelet and clasp` : `${brand} bracelet and clasp`;
                copy = `${watchSpecificSummary(watch)}<div class="mt-3">Check that the clasp or bracelet style, reference, material, finishing and date characteristics are plausible for ${ref || 'the selected watch'}.</div>`;
                alert = brand === 'Rolex' ? 'Rolex clasp codes and known replica patterns may have embedded guidance; most other brands currently record the reference without a full clasp database.' : 'For this brand, a recorded clasp reference may not yet have a complete embedded comparison database.';
            } else if (fieldId === 'comments') {
                title = watch.model ? `Record findings for ${watch.model}` : 'Detailed observations';
                copy = `${watchSpecificSummary(watch)}<div class="mt-3">Record the physical evidence behind the decision: inconsistencies, wear, replacement parts, finishing, limitations and checks that still require review.</div>`;
            } else if (id === 'dateEstimateResult') {
                title = watch.model ? `Approximate date for ${watch.model}` : 'Approximate date';
                copy = watchSpecificSummary(watch) || dateText || 'No reliable date estimate is currently available.';
                alert = 'Treat this as a consistency range. Movement production, case assembly and retail sale can occur at different times.';
            } else return null;
            return { title, copy, alert, danger, field };
        }

        let activeGuidanceTarget = null;
        let guidanceShowTimer = null;
        const GUIDANCE_HOVER_DELAY_MS = 1500;
        const GUIDANCE_FOCUS_DELAY_MS = 600;
        function positionContextGuidance(target) {
            const box = document.getElementById('context-guidance');
            if (!box || !target) return;
            const rect = target.getBoundingClientRect();
            const margin = 10;
            const width = Math.min(390, window.innerWidth - 24);
            box.style.width = `${width}px`;
            box.style.left = `${Math.max(12, Math.min(window.innerWidth - width - 12, rect.left))}px`;
            const boxHeight = Math.min(box.scrollHeight || 230, window.innerHeight * .7);
            let top = rect.bottom + margin;
            if (top + boxHeight > window.innerHeight - 12) top = Math.max(12, rect.top - boxHeight - margin);
            box.style.top = `${top}px`;
        }

        function showContextGuidance(target) {
            const data = getContextGuidance(target);
            if (!data) return;
            const box = document.getElementById('context-guidance');
            const title = document.getElementById('context-guidance-title');
            const copy = document.getElementById('context-guidance-copy');
            const alert = document.getElementById('context-guidance-alert');
            if (!box || !title || !copy || !alert) return;
            if (activeGuidanceTarget && activeGuidanceTarget !== data.field) activeGuidanceTarget.classList.remove('guidance-active');
            activeGuidanceTarget = data.field || target;
            activeGuidanceTarget?.classList.add('guidance-active');
            title.textContent = data.title;
            copy.innerHTML = data.copy;
            alert.textContent = data.alert || '';
            alert.classList.toggle('hidden', !data.alert);
            box.classList.toggle('danger', !!data.danger);
            box.setAttribute('aria-hidden','false');
            box.classList.add('visible');
            requestAnimationFrame(() => positionContextGuidance(activeGuidanceTarget || target));
        }

        function hideContextGuidance() {
            clearTimeout(guidanceShowTimer); guidanceShowTimer = null;
            const box = document.getElementById('context-guidance');
            box?.classList.remove('visible','danger');
            box?.setAttribute('aria-hidden','true');
            activeGuidanceTarget?.classList.remove('guidance-active');
            activeGuidanceTarget = null;
        }


        function initialiseManualReviewQueueObserver() {
            const watched = [
                document.getElementById('caseResult'),
                document.getElementById('drawer-live-decoding'),
                document.getElementById('context-guidance')
            ].filter(Boolean);

            if (!watched.length || window.__manualReviewQueueObserver) return;

            const observer = new MutationObserver(() => updateManualReviewQueueActions());
            watched.forEach(node => observer.observe(node, {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ['class']
            }));
            window.__manualReviewQueueObserver = observer;

            document.getElementById('caseRef')?.addEventListener('input', () => {
                queueMicrotask(updateManualReviewQueueActions);
            });
        }

        function initialiseContextGuidance() {
            return; // v2.47.0: routine hover/focus guidance removed to prevent duplicate information.
            const selector = '.brand-card, .field, .condition-card, #caseResult, #serialResult, #movementMatchResult, #dateEstimateResult, #ageClassificationResult, #claspResult';
            document.addEventListener('mouseover', e => { const target=e.target.closest(selector); if(target) { clearTimeout(guidanceShowTimer); guidanceShowTimer=setTimeout(()=>showContextGuidance(target),GUIDANCE_HOVER_DELAY_MS); } });
            document.addEventListener('focusin', e => { const target=e.target.closest(selector); if(target) { clearTimeout(guidanceShowTimer); guidanceShowTimer=setTimeout(()=>showContextGuidance(target),GUIDANCE_FOCUS_DELAY_MS); } });
            document.addEventListener('mouseout', e => {
                const from=e.target.closest(selector); const to=e.relatedTarget?.closest?.(selector);
                if(from && from!==to && !from.contains(e.relatedTarget)) hideContextGuidance();
            });
            document.addEventListener('focusout', e => { if(!e.relatedTarget?.closest?.(selector)) hideContextGuidance(); });
            window.addEventListener('scroll', hideContextGuidance, { passive:true });
            window.addEventListener('resize', hideContextGuidance);
        }


        let showAllBrands = false;
        const DEFAULT_VISIBLE_BRAND_COUNT = 10;

        function updateBrandDisplayLimit() {
            const grid = document.getElementById('brandGrid');
            const search = document.getElementById('brandSearch');
            const count = document.getElementById('brandCount');
            const toggle = document.getElementById('brandToggleButton');
            if (!grid) return;

            const query = normaliseBrandSearch(search?.value || '');
            const cards = Array.from(grid.querySelectorAll('.brand-card'));
            const selectedCard = grid.querySelector('.brand-checkbox:checked')?.closest('.brand-card');

            cards.forEach((card, index) => {
                const searchFiltered = card.classList.contains('filtered-out');
                const keepSelectedVisible = card === selectedCard;
                const hideForTopLimit = !query && !showAllBrands &&
                    index >= DEFAULT_VISIBLE_BRAND_COUNT &&
                    !keepSelectedVisible;
                card.dataset.topHidden = hideForTopLimit ? 'true' : 'false';

                // Search filtering remains authoritative while a query is active.
                if (query && !searchFiltered) card.dataset.topHidden = 'false';
            });

            if (toggle) {
                toggle.textContent = showAllBrands ? 'Show top 10' : 'Show all brands';
                toggle.setAttribute('aria-expanded', showAllBrands ? 'true' : 'false');
                toggle.classList.toggle('hidden', Boolean(query));
            }

            if (count) {
                if (query) {
                    const matching = cards.filter(card => !card.classList.contains('filtered-out')).length;
                    count.textContent = `${matching} found`;
                } else if (showAllBrands) {
                    count.textContent = `${cards.length} brands`;
                } else {
                    count.textContent = `Top ${Math.min(DEFAULT_VISIBLE_BRAND_COUNT, cards.length)} of ${cards.length}`;
                }
            }
        }

        function toggleAllBrands() {
            showAllBrands = !showAllBrands;
            updateBrandDisplayLimit();
        }

        function sortBrandCards() {
            const grid = document.getElementById('brandGrid');
            if (!grid) return;
            const cards = Array.from(grid.querySelectorAll('.brand-card'));
            const usage = getBrandUsage();
            cards.sort((a, b) => {
                const av = a.querySelector('.brand-checkbox')?.value || '';
                const bv = b.querySelector('.brand-checkbox')?.value || '';
                if (av === 'Generic') return 1;
                if (bv === 'Generic') return -1;
                const diff = (Number(usage[bv]) || 0) - (Number(usage[av]) || 0);
                return diff || av.localeCompare(bv, undefined, { sensitivity: 'base' });
            });
            cards.forEach(card => grid.appendChild(card));
            updateBrandUsageBadges();
            updateBrandDisplayLimit();
        }

        function filterBrandCards() {
            const input = document.getElementById('brandSearch');
            const count = document.getElementById('brandCount');
            const query = normaliseBrandSearch(input ? input.value : '');
            let visible = 0;
            const cards = Array.from(document.querySelectorAll('#brandGrid .brand-card'));
            cards.forEach(card => {
                const checkbox = card.querySelector('.brand-checkbox');
                const label = card.textContent || '';
                const haystack = normaliseBrandSearch(`${checkbox?.value || ''} ${label}`);
                const matches = !query || haystack.includes(query);
                card.classList.toggle('filtered-out', !matches);
                if (matches) visible += 1;
            });
            updateBrandDisplayLimit();
        }

        function clearBrandSearch() {
            const input = document.getElementById('brandSearch');
            if (input) {
                input.value = '';
                input.focus();
            }
            filterBrandCards();
        }

        function initialiseApplication() {
            sortBrandCards();
            filterBrandCards();
            init();
            renderRolexMovementMasterTable();
            refreshMovementCalibreSuggestions();
            updateDatabaseStatus();
            updateCounterDisplay();
            initialiseDashboardMode();
            switchTab('details');
            initialiseContextGuidance();
            document.addEventListener('keydown', event => {
                if (event.key === 'Escape' && document.getElementById('research-report-overlay')?.classList.contains('open')) {
                    closeMissingInformationReport();
                }
            });
            initialiseWatchResearchNotes();
            initialiseLiveSummaryState();
            initialiseLiveWatchSummary();
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialiseApplication, { once: true });
        } else {
            initialiseApplication();
        }

        document.addEventListener('input', (e) => {
            if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) { autoGenerate(); if (activeGuidanceTarget) setTimeout(() => showContextGuidance(activeGuidanceTarget), 0); }
        });
    

/* WATCH_AUTH_PRO_TUDOR_GUIDANCE_V234 */
(() => {
 const SERIAL_PHASES=[
  {label:'Sequential numeric',period:'approximately 1956–1984',detail:'Use the collector benchmark table as an estimate. Reference, calibre, dial and case details must agree.'},
  {label:'Numeric reset',period:'approximately 1984–1989',detail:'TUDOR restarted parts of the numeric sequence. Values around 140000–260000 can overlap older ranges and require the reference generation.'},
  {label:'B prefix',period:'approximately 1990–1998',detail:'B330000 to B990000 benchmarks provide approximate year clues.'},
  {label:'H prefix',period:'approximately 1999–2002',detail:'H130000 to H300000 benchmarks cover the early-2000s transition.'},
  {label:'Randomised modern format',period:'approximately 2002–present',detail:'Later alphanumeric serials generally do not provide a dependable public production year. Date primarily from the exact reference and movement generation.'}
 ];
 const MOVEMENT_GUIDE=[
  ['ETA/Sellita era','Many pre-2015 and entry/dress references use ETA or Sellita-derived movements. Examples include ETA 2824-2, 2892 and 7750 families. Do not reject one simply because modern TUDOR uses MT calibres.'],
  ['MT56xx family','Generally larger manufacture movements: MT5601 Black Bay Bronze; MT5602 time-only Black Bay; MT5612 Pelagos date; MT5652 GMT. Most provide about 70 hours, but the exact reference controls.'],
  ['MT54xx family','Compact manufacture family used across many 36–39 mm watches. MT5400, MT5402 and related variants are not interchangeable assumptions: check the exact reference, size and certification.'],
  ['MT5813 chronograph','Column-wheel, vertical-clutch manufacture chronograph used in Black Bay Chrono families; approximately 70 hours.'],
  ['T-series calibres','T600/T601/T201 and related calibres appear in Royal, 1926, Clair de Rose and other collections. Published TUDOR calibre naming should take priority over unverified base-movement descriptions.'],
  ['“-U” designation','A -U calibre denotes a METAS Master Chronometer-certified execution. Expect reference-specific METAS specification and 0/+5 seconds per day on the assembled watch; do not assume every similar-looking model is METAS-certified.']
 ];
 const REFERENCE_POINTS=[
  ['M prefix','Modern catalogue references often begin with M. The physical case-family code may be recorded without the M; this alone is not a discrepancy.'],
  ['Base reference','The base code identifies the model/case family and is the safest level for movement lookup.'],
  ['Letters','N, B and R commonly indicate black, blue and red/burgundy configurations, but letters are not a universal decoder. Use the exact embedded rule.'],
  ['-0001 suffix','The final four-digit catalogue suffix normally distinguishes bracelet, strap, dial or market configuration. It usually does not change the underlying case/movement family.']
 ];
 function esc(v){return typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 function currentTudorSnapshot(){
  const ref=(document.getElementById('caseRef')?.value||'').trim();
  const serial=(document.getElementById('serialInput')?.value||'').trim();
  const observed=(document.getElementById('movementCalibre')?.value||'').trim();
  let rows=[];
  if(ref){
   try{const hit=typeof lookupTudorReference==='function'?lookupTudorReference(ref):null;if(hit?.rule){const r=hit.rule;rows.push('<strong>Reference match:</strong> '+esc(r.family)+' · '+esc(r.size||'size not embedded'));rows.push('<strong>Expected calibre:</strong> '+esc((r.calibre||[]).join(' or ')||'not embedded'));rows.push('<strong>Power reserve:</strong> '+esc(r.reserve||'reference-specific'));rows.push('<strong>Generation/date:</strong> '+esc(r.production||r.era||'use exact reference history'));if(r.manualReview)rows.push('<strong>Review:</strong> The entered reference remains incomplete or production-dependent.');}else rows.push('<strong>Reference:</strong> No exact embedded match; add it to the research queue.');}catch(e){rows.push('<strong>Reference:</strong> Entered, but exact lookup could not be completed.');}
  }
  if(serial){try{const d=typeof estimateTudorSerial==='function'?estimateTudorSerial(serial):null;if(d?.estimate)rows.push('<strong>Serial estimate:</strong> '+esc(d.estimate)+(d.ambiguous?' — ambiguous/reset range':'') );else rows.push('<strong>Serial:</strong> No dependable public date returned; modern randomised serials must be dated from the reference.');}catch(e){}}
  if(observed){rows.push('<strong>Observed calibre:</strong> '+esc(observed)+' — compare architecture, bridge/rotor markings and certification with the exact reference.');}
  return rows.length?rows.join('<br>'):'Enter a Tudor reference, serial or observed calibre to create a watch-specific snapshot.';
 }
 function guideHtml(){
  return '<div class="tudor-guide-panel" id="tudor-enhanced-guide"><h4>Tudor model and serial guidance</h4><p>Use the case reference first, then confirm the movement generation and use the serial only as an approximate dating clue. No single identifier proves authenticity.</p><div class="tudor-watch-snapshot" id="tudor-watch-snapshot">'+currentTudorSnapshot()+'</div><h5>How to read the reference</h5><div class="tudor-guide-grid">'+REFERENCE_POINTS.map(x=>'<div class="tudor-guide-chip"><strong>'+x[0]+'</strong>'+x[1]+'</div>').join('')+'</div><h5>Movement-generation checks</h5><ul>'+MOVEMENT_GUIDE.map(x=>'<li><strong>'+x[0]+':</strong> '+x[1]+'</li>').join('')+'</ul><h5>Serial dating phases</h5><ul>'+SERIAL_PHASES.map(x=>'<li><strong>'+x.label+' — '+x.period+':</strong> '+x.detail+'</li>').join('')+'</ul><h5>Important authentication checks</h5><ul><li><strong>Reference versus calibre:</strong> the exact model rule overrides a broad MT-family assumption.</li><li><strong>Certification:</strong> distinguish ordinary manufacture, COSC and METAS -U executions; check the dial/caseback wording and movement marking.</li><li><strong>Vintage watches:</strong> Rolex-signed crowns, cases or casebacks can be period-correct on older TUDOR watches. Judge them against the reference and era rather than treating Rolex branding alone as a failure.</li><li><strong>Service parts:</strong> replacement hands, dials, bezels, crowns and bracelets can be genuine but later than the case. Record mixed generations rather than automatically calling the watch counterfeit.</li><li><strong>Engraving:</strong> serial/reference quality and placement must be coherent, but a plausible number is not proof; repeated counterfeit serial intelligence remains relevant.</li></ul><div class="tudor-source-links"><a target="_blank" rel="noopener" href="https://www.tudorwatch.com/en/inside-tudor/watchmaking/tudor-manufacture-movement">Official calibre guide</a><a target="_blank" rel="noopener" href="https://www.tudorwatch.com/en/inside-tudor/watchmaking/metas-certification">Official METAS guide</a><a target="_blank" rel="noopener" href="https://www.bobswatches.com/tudor/tudor-serial-number-check">Serial benchmark guide</a><a target="_blank" rel="noopener" href="https://www.tudorwatch.com/en/inside-tudor">Official history</a></div><div class="provenance-line"><strong>Source hierarchy:</strong> exact model and calibre specifications from TUDOR official material; serial dates from collector/dealer benchmark tables because TUDOR does not publish a complete year-by-year serial chronology.<br><strong>Dating confidence:</strong> approximate; cross-check with reference, calibre and component generation.</div></div>';
 }
 function ensureGuide(){
  const sections=document.getElementById('brand-reference-sections');if(!sections)return;
  let panel=document.getElementById('tudor-enhanced-guide');
  if(!panel){const wrap=document.createElement('div');wrap.innerHTML=guideHtml();panel=wrap.firstElementChild;sections.appendChild(panel);}
  const isTudor=(typeof getSelectedBrand==='function'?getSelectedBrand():'')==='Tudor';panel.classList.toggle('hidden',!isTudor);
  if(isTudor){const snap=document.getElementById('tudor-watch-snapshot');if(snap)snap.innerHTML=currentTudorSnapshot();}
 }
 if(typeof BRAND_PROFILES!=='undefined'&&BRAND_PROFILES.Tudor){Object.assign(BRAND_PROFILES.Tudor,{caseLabel:'Tudor case reference',caseHelp:'Case-family reference used for model, movement and approximate-date guidance',casePlaceholder:'e.g. 79030, 28503 or 7939G1A0',serialLabel:'Tudor serial number',serialHelp:'Approximate dating through supported vintage/B/H ranges; modern random serials are not publicly date-decodable',serialPlaceholder:'Enter exactly as observed',drawerTitle:'Tudor Reference',drawerSubtitle:'Tudor model and serial guidance',summary:'Tudor mode combines exact case-reference mappings, expected calibre and power reserve, movement-generation checks, approximate serial dating through 2002, and watch-specific manual-review warnings. Modern randomised serials cannot be safely assigned a year from public charts.'});}
 const originalUpdate=typeof updateBrandContext==='function'?updateBrandContext:null;if(originalUpdate){updateBrandContext=function(){const result=originalUpdate.apply(this,arguments);queueMicrotask(ensureGuide);return result;};}
 ['caseRef','serialInput','movementCalibre'].forEach(id=>document.getElementById(id)?.addEventListener('input',()=>queueMicrotask(ensureGuide)));
 document.querySelectorAll('.brand-checkbox').forEach(x=>x.addEventListener('change',()=>queueMicrotask(ensureGuide)));
 const host=document.getElementById('drawer-live-decoding');if(host)new MutationObserver(()=>ensureGuide()).observe(host,{childList:true,subtree:true,characterData:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureGuide,{once:true});else ensureGuide();
})();



/* WATCH_AUTH_PRO_OMEGA_GUIDANCE_V235 */
(() => {
 const REFERENCE_SYSTEMS=[
  ['Early numeric references','Generally four or five digits, sometimes with material prefixes such as CK. These mainly identify the case design; a dash suffix often marks a case iteration, not a separate movement.'],
  ['MAPICS','Usually grouped like 145.022 or 196.1522. The blocks partly describe material, movement/function and case variation, but Omega never published a complete public decoder. Use an exact database match whenever possible.'],
  ['Short PIC','Eight-digit references such as 3510.50.00. The opening digits broadly indicate collection/material; later digits distinguish model, dial and bracelet or strap.'],
  ['PIC14','Modern six-block references such as 210.30.42.20.01.001. The blocks cover family, material/bracelet, size, movement/function, dial and configuration sequence. The final three digits are not a production year.']
 ];
 const MOVEMENT_GUIDE=[
  ['Vintage mechanical','Calibres such as 30T2, 5xx, 6xx, 7xx and early 10xx/11xx must match the exact reference and era. Service movements and replacement bridges can complicate serial dating.'],
  ['1120/2500 era','Calibre 1120 is an ETA 2892-A2-derived automatic used before Co-Axial became widespread. Calibre 2500 is Omega’s early Co-Axial family and exists in several lettered revisions; reference and production period matter.'],
  ['Quartz families','Calibres such as 1538 and related quartz movements can include end-of-life indication and model-specific functions. Battery condition and calibre marking must agree with the reference.'],
  ['8800/8806','Compact modern Co-Axial Master Chronometer family. 8800 usually includes date; 8806 is commonly no-date. Typical reserve is about 55 hours.'],
  ['8900/8906','Larger twin-barrel Master Chronometer family, usually around 60 hours. 8900 is date; 8906 commonly adds GMT without date. Exact variants and precious-metal suffixes require model lookup.'],
  ['Speedmaster families','1861/1863 belong to the pre-Master-Chronometer Moonwatch generation; 3861 is the modern Co-Axial Master Chronometer evolution. 321, 861, 1861 and 3861 are not interchangeable simply because the watch is a Speedmaster.'],
  ['Master Chronometer','Introduced by Omega in 2015. The complete watch is tested for precision, magnetic resistance, power reserve and water resistance under METAS-certified procedures. Do not infer METAS from Co-Axial wording alone.']
 ];
 const SERIAL_PHASES=[
  {label:'Vintage movement serials',period:'19th century–late 1980s',detail:'Collector charts can provide an approximate movement-production year. The movement may predate final case assembly, and replacement movements or bridges break the link.'},
  {label:'Seven/eight-digit transition',period:'approximately 1990s onward',detail:'Serials increasingly appear externally on lugs or casebacks as well as movements. Location varies by model and is not itself proof of authenticity.'},
  {label:'Speedmaster sequence',period:'model-specific',detail:'Speedmaster serial ranges can differ from general Omega charts. Use the Speedmaster series selector and the exact reference/calibre generation.'},
  {label:'Modern production',period:'approximately late 2000s–present',detail:'Public serial charts become unreliable for exact dating. Use the full PIC reference, calibre generation, warranty/extract evidence and component design rather than assigning a precise year.'}
 ];
 const CERTIFICATION_POINTS=[
  ['Chronometer / COSC','A movement-level chronometer claim must agree with the model, dial wording and calibre. Not every automatic Omega is COSC-certified.'],
  ['Master Co-Axial','Usually indicates an anti-magnetic Co-Axial generation, but wording varies. Confirm the exact reference rather than assuming METAS.'],
  ['Master Chronometer','From 2015 onward on supported models. Expect METAS certification and modern anti-magnetic architecture; many current movements resist fields up to 15,000 gauss.'],
  ['Quartz accuracy','Do not apply mechanical certification expectations. Check correct calibre, battery system, end-of-life behaviour and circuit/coil execution.']
 ];
 function esc(v){return typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 function currentOmegaSnapshot(){
  const ref=(document.getElementById('caseRef')?.value||'').trim();
  const serial=(document.getElementById('serialInput')?.value||'').trim();
  const observed=(document.getElementById('movementCalibre')?.value||'').trim();
  let rows=[];
  if(ref){
   try{
    const hit=typeof lookupOmegaReference==='function'?lookupOmegaReference(ref):null;
    if(hit?.rule){const r=hit.rule;rows.push('<strong>Reference match:</strong> '+esc(r.family)+' · '+esc(r.size||'size not embedded'));rows.push('<strong>Expected calibre:</strong> '+esc((r.calibre||[]).join(' or ')||r.calibreDisplay||'not embedded'));rows.push('<strong>Power reserve:</strong> '+esc(r.reserve||'reference-specific'));rows.push('<strong>Generation/date:</strong> '+esc(r.production||r.era||'use exact reference history'));if(r.manualReview)rows.push('<strong>Review:</strong> The movement or configuration remains production-dependent.');}
    else {const f=typeof decodeOmegaReferenceFormat==='function'?decodeOmegaReferenceFormat(ref):null;if(f)rows.push('<strong>Reference format:</strong> '+esc(f.system)+' — format decoded, but no exact model match is embedded.');else rows.push('<strong>Reference:</strong> No exact embedded match; add it to the research queue.');}
   }catch(e){rows.push('<strong>Reference:</strong> Entered, but exact lookup could not be completed.');}
  }
  if(serial){
   try{const series=document.getElementById('omegaSerialSeries')?.value||'standard';const d=typeof estimateOmegaSerialYear==='function'?estimateOmegaSerialYear(serial,series):null;if(d)rows.push('<strong>Serial estimate:</strong> '+esc(d)+' — '+(series==='speedmaster'?'Speedmaster sequence':'general Omega sequence'));else rows.push('<strong>Serial:</strong> No dependable year returned; use the full reference and calibre generation.');}catch(e){}
  }
  if(observed)rows.push('<strong>Observed calibre:</strong> '+esc(observed)+' — compare movement architecture, serial placement, bridge/rotor engraving and certification with the exact reference.');
  return rows.length?rows.join('<br>'):'Enter an Omega reference, serial or observed calibre to create a watch-specific snapshot.';
 }
 function guideHtml(){
  return '<div class="omega-guide-panel" id="omega-enhanced-guide"><h4>Omega model and serial guidance</h4><p>Use the exact reference first, then confirm the calibre and certification generation. Serial dating is supporting evidence only and becomes less dependable on modern watches.</p><div class="omega-watch-snapshot" id="omega-watch-snapshot">'+currentOmegaSnapshot()+'</div><h5>How to read Omega references</h5><div class="omega-guide-grid">'+REFERENCE_SYSTEMS.map(x=>'<div class="omega-guide-chip"><strong>'+x[0]+'</strong>'+x[1]+'</div>').join('')+'</div><h5>Movement-generation checks</h5><ul>'+MOVEMENT_GUIDE.map(x=>'<li><strong>'+x[0]+':</strong> '+x[1]+'</li>').join('')+'</ul><h5>Serial dating phases</h5><ul>'+SERIAL_PHASES.map(x=>'<li><strong>'+x.label+' — '+x.period+':</strong> '+x.detail+'</li>').join('')+'</ul><h5>Certification and wording</h5><div class="omega-guide-grid">'+CERTIFICATION_POINTS.map(x=>'<div class="omega-guide-chip"><strong>'+x[0]+'</strong>'+x[1]+'</div>').join('')+'</div><h5>Important authentication checks</h5><ul><li><strong>Reference versus calibre:</strong> an exact PIC/reference mapping overrides broad family assumptions. A plausible Omega calibre in the wrong reference is still a major review point.</li><li><strong>Case and movement serials:</strong> some watches repeat the movement serial externally, while others do not. Compare format and consistency, but do not reject solely because a serial is absent from one expected location.</li><li><strong>Speedmaster:</strong> use the separate Speedmaster serial sequence and confirm caseback, dial, bracelet and movement generation together.</li><li><strong>Service components:</strong> genuine later dials, bezels, hands, crowns, bracelets, movements or bridges can alter the apparent date. Record mixed generations rather than automatically treating them as counterfeit.</li><li><strong>Co-Axial and METAS:</strong> check escapement architecture, balance system, rotor/bridge engraving and anti-magnetic generation. Marketing wording alone is not proof.</li><li><strong>Reference suffixes:</strong> shortened references may identify the family but not the exact dial, bracelet or market configuration.</li></ul><div class="omega-source-links"><a target="_blank" rel="noopener" href="https://www.watches.co.uk/omega-serial-numbers-and-reference-numbers">Serial/reference guide</a><a target="_blank" rel="noopener" href="https://press.omegawatches.com/omega-celebrates-10-years-of-master-chronometer-certification/">Master Chronometer history</a><a target="_blank" rel="noopener" href="https://press.omegawatches.com/a-classic-in-three-sizes-introducing-the-seamaster-aqua-terra-black-dial/">8800 / 8900 example</a><a target="_blank" rel="noopener" href="https://press.omegawatches.com/?p=33716">3861 Moonwatch example</a></div><div class="provenance-line"><strong>Source hierarchy:</strong> exact model/calibre and certification information from Omega official press/product material; reference-format and serial limitations from specialist reference guides because Omega does not publish a complete public year-by-year serial decoder.<br><strong>Dating confidence:</strong> approximate; cross-check with exact reference, calibre, certification, caseback and component generation.</div></div>';
 }
 function ensureGuide(){
  const sections=document.getElementById('brand-reference-sections');if(!sections)return;
  let panel=document.getElementById('omega-enhanced-guide');
  if(!panel){const wrap=document.createElement('div');wrap.innerHTML=guideHtml();panel=wrap.firstElementChild;sections.appendChild(panel);}
  const isOmega=(typeof getSelectedBrand==='function'?getSelectedBrand():'')==='Omega';panel.classList.toggle('hidden',!isOmega);
  if(isOmega){const snap=document.getElementById('omega-watch-snapshot');if(snap)snap.innerHTML=currentOmegaSnapshot();}
 }
 if(typeof BRAND_PROFILES!=='undefined'&&BRAND_PROFILES.Omega){Object.assign(BRAND_PROFILES.Omega,{caseLabel:'Omega case / PIC reference',caseHelp:'Exact reference used for model, calibre, reference-format and approximate-date guidance',casePlaceholder:'e.g. 2561.80, 3510.50.00 or 210.30.42.20.01.001',serialLabel:'Omega serial number',serialHelp:'Approximate movement-serial dating; select Speedmaster sequence where applicable; modern serials are not exact public year codes',serialPlaceholder:'Enter exactly as observed',drawerTitle:'Omega Reference',drawerSubtitle:'Omega model and serial guidance',summary:'Omega mode combines exact reference mappings, expected calibre and power reserve, early/MAPICS/PIC reference-format guidance, separate general and Speedmaster serial estimates, movement-generation checks and COSC/METAS authentication cautions.'});}
 const originalUpdate=typeof updateBrandContext==='function'?updateBrandContext:null;if(originalUpdate){updateBrandContext=function(){const result=originalUpdate.apply(this,arguments);queueMicrotask(ensureGuide);return result;};}
 ['caseRef','serialInput','movementCalibre','omegaSerialSeries'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',()=>queueMicrotask(ensureGuide));el.addEventListener('change',()=>queueMicrotask(ensureGuide));}});
 document.querySelectorAll('.brand-checkbox').forEach(x=>x.addEventListener('change',()=>queueMicrotask(ensureGuide)));
 const host=document.getElementById('drawer-live-decoding');if(host)new MutationObserver(()=>ensureGuide()).observe(host,{childList:true,subtree:true,characterData:true});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureGuide,{once:true});else ensureGuide();
})();


/* WATCH_AUTH_PRO_BREMONT_GUIDANCE_V241 */
(() => {
 const REFERENCE_POINTS=[
  ['Legacy names','Older watches often use model names such as MBII, S500 and Broadsword rather than a compact modern catalogue code. Record all suffixes and colour details.'],
  ['Modern codes','Current references commonly encode collection, size/function, material, dial colour and strap or bracelet, for example ALT39-DT-SS-BK-L-S.'],
  ['Case generation','Do not assume every Bremont uses the same Trip-Tick construction. New Terra Nova models use a two-piece cushion case, while Altitude and many legacy aviation models use Trip-Tick architecture.'],
  ['Full suffix','The final letters can distinguish case material, dial, barrel colour, bracelet, leather, rubber or NATO. A shortened family name cannot establish the exact configuration.']
 ];
 const MOVEMENT_GUIDE=[
  ['BE-36AE / BE-36AL','Legacy and current modified automatic movements. BE-36AE commonly supports date or day/date; BE-36AL is used in no-date executions such as Terra Nova 38.'],
  ['BE-95-2AV','Chronometer movement with small seconds and date used in Broadsword models; approximately 38-hour reserve.'],
  ['BE-93-2AV','GMT automatic movement used in models such as Supermarine Descent II; approximately 42-hour reserve.'],
  ['BE-50AV','Current Terra Nova chronograph movement with approximately 56-hour reserve.'],
  ['BB14','Current Altitude automatic movement with approximately 68-hour reserve. Confirm open-back finishing, anti-shock mounting and reference generation.'],
  ['BB64AH','Current 43 mm Supermarine 500M movement with approximately 56-hour reserve. Do not confuse it with earlier S500 BE-36AE watches.'],
  ['ENG300 series','Proprietary movement family launched in 2021. Official material identifies a 65-hour reserve, silicon escapement, free-sprung balance, full balance bridge and tungsten rotor. Exact calibres include ENG365 and ENG376.']
 ];
 const CHECKS=[
  ['Rotor and bridges','Compare the observed movement with the expected generation. Bremont-modified base movements should have coherent rotor, bridge and calibre markings; a plain donor movement needs explanation.'],
  ['Shock and magnetic systems','MB and Altitude references should agree with the expected flexible anti-shock mount, soft-iron magnetic protection and inner-bezel architecture.'],
  ['Case construction','Check Trip-Tick barrel, crown layout, helium valve, two-piece Terra Nova case or bronze/titanium execution against the exact model.'],
  ['Certification','Many legacy core mechanical watches were ISO 3159 chronometer-rated. ENG300 watches use Bremont’s H1 timing standard. Certification claims must match the reference generation.'],
  ['British-made wording','ENG300-series movements may carry Made in England wording. Do not expect that wording on older externally sourced BE-series movements.'],
  ['Service and mixed parts','Genuine service dials, crowns, bezels and movements can create mixed generations. Record the mismatch rather than treating every later part as counterfeit.']
 ];
 function esc(v){return typeof escapeHtml==='function'?escapeHtml(String(v||'')):String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
 function currentBremontSnapshot(){
  const ref=(document.getElementById('caseRef')?.value||'').trim();
  const observed=(document.getElementById('movementCalibre')?.value||'').trim();
  let rows=[];
  if(ref){
   try{
    const hit=typeof lookupOtherReference==='function'?lookupOtherReference('Bremont',ref):null;
    if(hit){rows.push('<strong>Reference match:</strong> '+esc(hit.family)+' · '+esc(hit.size||'size not embedded'));rows.push('<strong>Expected calibre:</strong> '+esc((hit.calibre||[]).join(' or ')||hit.calibreDisplay||'not embedded'));rows.push('<strong>Power reserve:</strong> '+esc(hit.reserve||'reference-specific'));rows.push('<strong>Generation/date:</strong> '+esc(hit.production||'use exact reference history'));if(hit.manualReview)rows.push('<strong>Review:</strong> Full model/reference required for exact assignment.');}
    else rows.push('<strong>Reference:</strong> No exact match. Add to research queue.');
   }catch(e){rows.push('<strong>Reference:</strong> Lookup could not be completed.');}
  }
  if(observed)rows.push('<strong>Observed calibre:</strong> '+esc(observed)+' — compare rotor, bridge, certification and case generation with the exact model.');
  return rows.length?rows.join('<br>'):'Enter a Bremont reference or model and observed calibre.';
 }
 function guideHtml(){
  return '<div class="bremont-guide-panel" id="bremont-enhanced-guide"><h4>Bremont model and movement guidance</h4><p>Use the complete model/reference first, then confirm the case generation and movement family. Bremont has used modified external base movements, proprietary ENG300 calibres and newer BB-series movements.</p><div class="bremont-watch-snapshot" id="bremont-watch-snapshot">'+currentBremontSnapshot()+'</div><h5>How to read the reference</h5><div class="bremont-guide-grid">'+REFERENCE_POINTS.map(x=>'<div class="bremont-guide-chip"><strong>'+x[0]+'</strong>'+x[1]+'</div>').join('')+'</div><h5>Movement-generation checks</h5><ul>'+MOVEMENT_GUIDE.map(x=>'<li><strong>'+x[0]+':</strong> '+x[1]+'</li>').join('')+'</ul><h5>Important authentication checks</h5><ul>'+CHECKS.map(x=>'<li><strong>'+x[0]+':</strong> '+x[1]+'</li>').join('')+'</ul><div class="bremont-source-links"><a target="_blank" rel="noopener" href="https://www.bremont.com/pages/technology">Official movement technology</a><a target="_blank" rel="noopener" href="https://www.bremont.com/pages/altitude">Official Altitude guide</a><a target="_blank" rel="noopener" href="https://www.bremont.com/pages/terra-nova">Official Terra Nova guide</a><a target="_blank" rel="noopener" href="https://www.bremont.com/pages/supermarine-500m-904l-steel">Official Supermarine guide</a></div><div class="provenance-line"><strong>Source hierarchy:</strong> Bremont official product and technology specifications.<br><strong>Dating confidence:</strong> model-generation estimates; exact launch and discontinuation dates can vary by suffix and market.</div></div>';
 }
 function ensureGuide(){
  const sections=document.getElementById('brand-reference-sections');if(!sections)return;
  let panel=document.getElementById('bremont-enhanced-guide');
  if(!panel){const wrap=document.createElement('div');wrap.innerHTML=guideHtml();panel=wrap.firstElementChild;sections.appendChild(panel);}
  const active=(typeof getSelectedBrand==='function'?getSelectedBrand():'')==='Bremont';
  panel.classList.toggle('hidden',!active);
  if(active){const snap=document.getElementById('bremont-watch-snapshot');if(snap)snap.innerHTML=currentBremontSnapshot();}
 }
 if(typeof BRAND_PROFILES!=='undefined'){
  BRAND_PROFILES.Bremont=Object.assign(BRAND_PROFILES.Bremont||{},{
   caseLabel:'Bremont model / reference',
   caseHelp:'Enter the full model name or modern catalogue code for movement and case-generation guidance',
   casePlaceholder:'e.g. MBII, S500, ALT39-DT-SS-BK-L-S',
   serialLabel:'Bremont serial number',
   serialHelp:'Record exactly as observed; no complete public year-by-year Bremont serial chronology is embedded',
   serialPlaceholder:'Enter exactly as observed',
   drawerTitle:'Bremont Reference',
   drawerSubtitle:'Bremont model, case and movement guidance',
   summary:'Bremont mode covers legacy MBII, Supermarine and Broadsword families, current Altitude, Terra Nova and Supermarine codes, BE-series modified movements, BB14/BB64 movements and the ENG300 proprietary movement family.'
  });
 }
 const originalUpdate=typeof updateBrandContext==='function'?updateBrandContext:null;
 if(originalUpdate){updateBrandContext=function(){const result=originalUpdate.apply(this,arguments);queueMicrotask(ensureGuide);return result;};}
 ['caseRef','movementCalibre'].forEach(id=>{const el=document.getElementById(id);if(el){el.addEventListener('input',()=>queueMicrotask(ensureGuide));el.addEventListener('change',()=>queueMicrotask(ensureGuide));}});
 document.querySelectorAll('.brand-checkbox').forEach(x=>x.addEventListener('change',()=>queueMicrotask(ensureGuide)));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureGuide,{once:true});else ensureGuide();
})();
