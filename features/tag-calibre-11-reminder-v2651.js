(() => {
  'use strict';

  const REMINDER_ID = 'tag-calibre-11-reminder';

  function selectedBrand() {
    return document.querySelector('.brand-checkbox:checked')?.value || '';
  }

  function isCalibre11(value) {
    return /(?:^|\b)(?:cal(?:ibre)?\.?\s*)?11(?:\b|$)/i.test(String(value || '').trim());
  }

  function movementTypeText() {
    const select = document.getElementById('movementType');
    if (!select) return '';
    const option = select.options?.[select.selectedIndex];
    return `${select.value || ''} ${option?.textContent || ''}`.trim().toLowerCase();
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
      'display:none',
      'margin-top:10px',
      'padding:12px 14px',
      'border-radius:12px',
      'border:1px solid rgba(245,158,11,.45)',
      'background:rgba(120,53,15,.18)',
      'color:#fde68a',
      'font-size:12px',
      'line-height:1.5',
      'font-weight:700'
    ].join(';');

    const parent = calibre.closest('.field, .data-zone, .identifier-field, .input-wrap') || calibre.parentElement;
    parent?.appendChild(box);
    return box;
  }

  function refreshReminder() {
    const calibre = document.getElementById('movementCalibre');
    const box = ensureReminder();
    if (!calibre || !box) return;

    const match = selectedBrand() === 'TAG Heuer' && isCalibre11(calibre.value);
    if (!match) {
      box.style.display = 'none';
      box.textContent = '';
      return;
    }

    const type = movementTypeText();
    const manualSelected = /manual|hand[-\s]?wind/.test(type);
    const automaticSelected = /automatic|auto|self[-\s]?wind/.test(type);

    if (manualSelected) {
      box.style.borderColor = 'rgba(239,68,68,.60)';
      box.style.background = 'rgba(127,29,29,.22)';
      box.style.color = '#fecaca';
      box.textContent = 'TAG Heuer / Heuer Calibre 11 is AUTOMATIC, not manual-wind. Vintage Calibre 11 was introduced in 1969 as an automatic chronograph using a micro-rotor base movement. Change Movement Technology to Automatic.';
    } else {
      box.style.borderColor = 'rgba(245,158,11,.45)';
      box.style.background = 'rgba(120,53,15,.18)';
      box.style.color = '#fde68a';
      box.textContent = automaticSelected
        ? 'Calibre 11 check: correct — this is an AUTOMATIC chronograph calibre.'
        : 'Calibre 11 reminder: this is an AUTOMATIC chronograph calibre, not manual-wind. Vintage Calibre 11 was introduced in 1969 and uses a micro-rotor automatic winding system.';
    }

    box.style.display = 'block';
  }

  function init() {
    const calibre = document.getElementById('movementCalibre');
    const type = document.getElementById('movementType');
    if (!calibre) return;

    calibre.addEventListener('input', refreshReminder);
    calibre.addEventListener('change', refreshReminder);
    type?.addEventListener('input', refreshReminder);
    type?.addEventListener('change', refreshReminder);

    document.querySelectorAll('.brand-checkbox').forEach(input => {
      input.addEventListener('change', refreshReminder);
    });

    refreshReminder();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
