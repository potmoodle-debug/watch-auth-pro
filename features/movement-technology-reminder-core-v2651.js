(() => {
  'use strict';

  const REMINDER_ID = 'movement-technology-reminder';

  const RULES = [
    {
      brands: ['TAG Heuer', 'Heuer', 'Breitling', 'Hamilton'],
      aliases: [/^(?:CAL(?:IBRE)?\s*)?11$/i, /^(?:CAL(?:IBRE)?\s*)?12$/i, /^(?:CAL(?:IBRE)?\s*)?14$/i, /^(?:CAL(?:IBRE)?\s*)?15$/i],
      expected: 'automatic',
      label: 'Chronomatic Calibre 11/12/14/15',
      note: 'This family is AUTOMATIC, not manual-wind. Calibre 11 uses a micro-rotor automatic base movement.',
      confirm: true
    },
    {
      brands: ['Zenith'],
      aliases: [/^3019\s*PHC$/i, /^EL\s*PRIMERO$/i, /^ELPRIMERO$/i],
      expected: 'automatic',
      label: 'Zenith El Primero / 3019 PHC',
      note: 'The original El Primero is an AUTOMATIC integrated chronograph movement.',
      confirm: true
    },
    {
      brands: ['Seiko'],
      aliases: [/^6138(?:[-\s].*)?$/i, /^6139(?:[-\s].*)?$/i],
      expected: 'automatic',
      label: 'Seiko 6138 / 6139',
      note: 'These vintage Seiko chronograph calibres are AUTOMATIC, not manual-wind.',
      confirm: true
    },
    {
      brands: null,
      aliases: [/^(?:VALJOUX\s*)?7750$/i, /^(?:VALJOUX\s*)?7751$/i],
      expected: 'automatic',
      label: 'Valjoux 7750 / 7751',
      note: 'Valjoux 7750-family chronographs are AUTOMATIC.',
      confirm: false
    },
    {
      brands: null,
      aliases: [/^(?:LEMANIA\s*)?5100$/i],
      expected: 'automatic',
      label: 'Lemania 5100',
      note: 'Lemania 5100 is an AUTOMATIC chronograph calibre.',
      confirm: true
    },
    {
      brands: ['Omega'],
      aliases: [/^(?:CAL(?:IBRE)?\s*)?1040$/i, /^(?:CAL(?:IBRE)?\s*)?1041$/i, /^(?:CAL(?:IBRE)?\s*)?1045$/i],
      expected: 'automatic',
      label: 'Omega 1040 / 1041 / 1045',
      note: 'These Omega chronograph calibres are AUTOMATIC.',
      confirm: true
    },
    {
      brands: ['Omega'],
      aliases: [/^(?:CAL(?:IBRE)?\s*)?321$/i, /^(?:CAL(?:IBRE)?\s*)?861$/i, /^(?:CAL(?:IBRE)?\s*)?1861$/i, /^(?:CAL(?:IBRE)?\s*)?1863$/i, /^(?:CAL(?:IBRE)?\s*)?3861$/i],
      expected: 'manual',
      label: 'Omega 321 / 861 / 1861 / 1863 / 3861',
      note: 'These Speedmaster-family calibres are MANUAL-WIND, not automatic.',
      confirm: true
    },
    {
      brands: null,
      aliases: [/^(?:VALJOUX\s*)?72$/i, /^(?:VALJOUX\s*)?7730$/i, /^(?:VALJOUX\s*)?7733$/i, /^(?:VALJOUX\s*)?7734$/i, /^(?:VALJOUX\s*)?7736$/i],
      expected: 'manual',
      label: 'Valjoux 72 / 7730 / 7733 / 7734 / 7736',
      note: 'These classic Valjoux chronograph calibres are MANUAL-WIND.',
      confirm: true
    },
    {
      brands: null,
      aliases: [/^(?:LEMANIA\s*)?2310$/i, /^(?:LEMANIA\s*)?1873$/i],
      expected: 'manual',
      label: 'Lemania 2310 / 1873',
      note: 'These Lemania chronograph calibres are MANUAL-WIND.',
      confirm: true
    },
    {
      brands: null,
      aliases: [/^(?:VENUS\s*)?175$/i, /^(?:VENUS\s*)?178$/i],
      expected: 'manual',
      label: 'Venus 175 / 178',
      note: 'These vintage Venus chronograph calibres are MANUAL-WIND.',
      confirm: true
    }
  ];

  function selectedBrand() {
    return document.querySelector('.brand-checkbox:checked')?.value || '';
  }

  function normaliseCalibre(value) {
    return String(value || '')
      .trim()
      .toUpperCase()
      .replace(/\bCALIBRE\b|\bCAL\.?\b/g, 'CAL ')
      .replace(/[^A-Z0-9-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function movementTypeText() {
    const select = document.getElementById('movementType');
    if (!select) return '';
    const option = select.options?.[select.selectedIndex];
    return `${select.value || ''} ${option?.textContent || ''}`.trim().toLowerCase();
  }

  function currentType() {
    const text = movementTypeText();
    if (/manual|hand[-\s]?wind/.test(text)) return 'manual';
    if (/automatic|auto|self[-\s]?wind/.test(text)) return 'automatic';
    if (/quartz|battery/.test(text)) return 'quartz';
    return '';
  }

  function findRule(value, brand) {
    const calibre = normaliseCalibre(value);
    if (!calibre) return null;
    return RULES.find(rule => {
      if (rule.brands && !rule.brands.some(b => b.toLowerCase() === brand.toLowerCase())) return false;
      return rule.aliases.some(rx => rx.test(calibre));
    }) || null;
  }

  function ensureReminder() {
    const calibre = document.getElementById('movementCalibre');
    if (!calibre) return null;
    let box = document.getElementById(REMINDER_ID);
    if (box) return box;
    box = document.createElement('div');
    box.id = REMINDER_ID;
    box.setAttribute('role', 'alert');
    box.style.cssText = [
      'display:none','margin-top:10px','padding:12px 14px','border-radius:12px',
      'border:1px solid rgba(245,158,11,.45)','background:rgba(120,53,15,.18)',
      'color:#fde68a','font-size:12px','line-height:1.5','font-weight:700'
    ].join(';');
    const parent = calibre.closest('.field, .data-zone, .identifier-field, .input-wrap') || calibre.parentElement;
    parent?.appendChild(box);
    return box;
  }

  function refreshReminder() {
    const calibre = document.getElementById('movementCalibre');
    const box = ensureReminder();
    if (!calibre || !box) return;

    const rule = findRule(calibre.value, selectedBrand());
    if (!rule) {
      box.style.display = 'none';
      box.textContent = '';
      return;
    }

    const selected = currentType();
    const expectedLabel = rule.expected === 'manual' ? 'MANUAL-WIND' : rule.expected.toUpperCase();

    if (selected && selected !== rule.expected) {
      box.style.borderColor = 'rgba(239,68,68,.65)';
      box.style.background = 'rgba(127,29,29,.24)';
      box.style.color = '#fecaca';
      box.textContent = `${rule.label}: ${expectedLabel}, not ${selected.toUpperCase()}. ${rule.note} Change Movement Technology to ${rule.expected === 'manual' ? 'Manual' : 'Automatic'}.`;
      box.style.display = 'block';
      return;
    }

    if (!selected) {
      box.style.borderColor = 'rgba(245,158,11,.48)';
      box.style.background = 'rgba(120,53,15,.18)';
      box.style.color = '#fde68a';
      box.textContent = `${rule.label} reminder: ${rule.note} Set Movement Technology to ${rule.expected === 'manual' ? 'Manual' : 'Automatic'}.`;
      box.style.display = 'block';
      return;
    }

    if (rule.confirm) {
      box.style.borderColor = 'rgba(34,197,94,.45)';
      box.style.background = 'rgba(20,83,45,.18)';
      box.style.color = '#bbf7d0';
      box.textContent = `${rule.label} check: correct — ${expectedLabel}.`;
      box.style.display = 'block';
    } else {
      box.style.display = 'none';
      box.textContent = '';
    }
  }

  function init() {
    const calibre = document.getElementById('movementCalibre');
    const type = document.getElementById('movementType');
    if (!calibre) return;
    calibre.addEventListener('input', refreshReminder);
    calibre.addEventListener('change', refreshReminder);
    type?.addEventListener('input', refreshReminder);
    type?.addEventListener('change', refreshReminder);
    document.querySelectorAll('.brand-checkbox').forEach(input => input.addEventListener('change', refreshReminder));
    refreshReminder();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
