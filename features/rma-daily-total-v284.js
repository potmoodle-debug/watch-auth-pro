/* Watch Auth Pro — RMA daily-total integration
   Version 2.84.0 — 23 September 2026
   Adds an explicit RMA completion action that counts toward the daily watch target.
*/
(() => {
  const BUTTON_ID = 'rma-complete-daily';
  let completing = false;

  function show(message) {
    if (typeof showToast === 'function') showToast(message);
  }

  function completeRma() {
    if (completing) return;
    const api = window.WatchAuthDailyTarget;
    if (!api || typeof api.completeRma !== 'function') {
      show('DAILY TARGET NOT READY');
      return;
    }

    completing = true;
    const button = document.getElementById(BUTTON_ID);
    if (button) button.disabled = true;

    try {
      const result = api.completeRma();

      // Use the existing RMA clear action so draft storage and selected quick points
      // are reset by the same workflow already used by the RMA workspace.
      const clearButton = document.getElementById('rma-clear');
      if (clearButton) clearButton.click();
      else {
        const note = document.getElementById('rma-note');
        if (note) {
          note.value = '';
          note.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }

      show(`RMA COMPLETE · ${result.completed}/${result.target}`);
    } finally {
      window.setTimeout(() => {
        completing = false;
        const current = document.getElementById(BUTTON_ID);
        if (current) current.disabled = false;
      }, 600);
    }
  }

  function install() {
    const actions = document.querySelector('#tab-rma-content .rma-actions');
    if (!actions || document.getElementById(BUTTON_ID)) return false;

    const button = document.createElement('button');
    button.type = 'button';
    button.id = BUTTON_ID;
    button.className = 'save-action';
    button.textContent = 'Complete RMA & start next';
    button.title = 'Count this RMA toward today’s completed total, then clear the RMA note for the next job.';
    button.addEventListener('click', completeRma);

    const clear = document.getElementById('rma-clear');
    if (clear) actions.insertBefore(button, clear);
    else actions.appendChild(button);
    return true;
  }

  function initialise() {
    if (install()) return;
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
