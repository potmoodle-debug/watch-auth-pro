/* Watch Auth Pro — RMA workflow correction
   Version 2.60.3 — 18 August 2026
   RMA inspection does not assess timekeeping accuracy: ticking = OK.
*/
if (typeof DATABASE_META !== 'undefined') {
  DATABASE_META.version = '2.60.3';
  DATABASE_META.updated = '18 August 2026';
  DATABASE_META.scope = 'RMA return-note workflow corrected: no timekeeping assessment; ticking is treated as OK.';
}
(() => {
  function apply() {
    const panel = document.getElementById('tab-rma-content');
    if (!panel) return false;

    const removals = [
      'Running slow',
      'Running fast',
      'Low power reserve'
    ];

    panel.querySelectorAll('.rma-quick').forEach(btn => {
      const label = String(btn.textContent || '').trim();
      if (removals.includes(label)) btn.remove();
    });

    const description = panel.querySelector('.panel-description');
    if (description) description.textContent = 'Record what is found during the return inspection. Movement function is pass/fail only: if the watch is ticking, it is classed as OK.';

    const note = document.getElementById('rma-note');
    if (note) {
      note.value = String(note.value || '')
        .split(/\r?\n/)
        .filter(line => !/running slow|running fast|losing time|gaining time|timekeeping|power reserve/i.test(line))
        .join('\n');
      note.dispatchEvent(new Event('input', { bubbles: true }));
    }

    return true;
  }

  function init() {
    if (apply()) return;
    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
