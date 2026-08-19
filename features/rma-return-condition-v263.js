/* Watch Auth Pro — RMA returned-condition statement
   Version 2.63.0 — 19 August 2026
*/
if (typeof DATABASE_META !== 'undefined') {
  DATABASE_META.version = '2.63.0';
  DATABASE_META.updated = '19 August 2026';
  DATABASE_META.scope = 'RMA quick-add statement added for watches returned in the same condition as originally shipped to the buyer.';
}

(() => {
  const BUTTON_ID = 'rma-same-condition-shipped';
  const STATEMENT = 'Watch returned in same condition as shipped to buyer.';

  function syncButton(button, note) {
    const target = `• ${STATEMENT}`;
    const selected = String(note?.value || '')
      .split(/\r?\n/)
      .some(line => line.trim() === target);
    button.classList.toggle('selected', selected);
  }

  function toggleStatement(button, note) {
    const target = `• ${STATEMENT}`;
    const lines = String(note.value || '').split(/\r?\n/);
    const existing = lines.findIndex(line => line.trim() === target);

    if (existing >= 0) lines.splice(existing, 1);
    else {
      while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
      lines.push(target);
    }

    note.value = lines.join('\n').replace(/^\n+/, '');
    note.dispatchEvent(new Event('input', { bubbles: true }));
    syncButton(button, note);
    note.focus();
  }

  function install() {
    const grid = document.querySelector('#tab-rma-content .rma-quick-grid');
    const note = document.getElementById('rma-note');
    if (!grid || !note) return false;

    let button = document.getElementById(BUTTON_ID);
    if (!button) {
      button = document.createElement('button');
      button.id = BUTTON_ID;
      button.type = 'button';
      button.className = 'rma-quick';
      button.dataset.bullet = STATEMENT;
      button.textContent = 'Watch returned in same condition as shipped to buyer';
      button.addEventListener('click', () => toggleStatement(button, note));
      grid.appendChild(button);
      note.addEventListener('input', () => syncButton(button, note));
    }

    syncButton(button, note);
    return true;
  }

  function initialise() {
    if (install()) return;
    const observer = new MutationObserver(() => {
      if (install()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
