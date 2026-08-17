/* Watch Auth Pro — RMA note-only refinement
   Version 2.60.1 — 17 August 2026
*/
if (typeof DATABASE_META !== 'undefined') {
  DATABASE_META.version = '2.60.1';
  DATABASE_META.updated = '17 August 2026';
  DATABASE_META.scope = 'RMA / Returns simplified to quick-add return-note builder only; duplicate job/customer/watch fields removed.';
}
(() => {
  function applyRmaNoteOnly() {
    const panel = document.getElementById('tab-rma-content');
    if (!panel) return false;

    panel.querySelector('.rma-grid')?.remove();
    document.getElementById('rma-use-current')?.remove();

    const description = panel.querySelector('.panel-description');
    if (description) description.textContent = 'Build the return note only. Job and watch details are already held on the existing return record.';

    const note = document.getElementById('rma-note');
    if (note) note.placeholder = 'Quick-add points will appear here. Edit the wording freely.';

    const copy = document.getElementById('rma-copy');
    if (copy && !copy.dataset.noteOnly) {
      const replacement = copy.cloneNode(true);
      replacement.dataset.noteOnly = '1';
      copy.replaceWith(replacement);
      replacement.addEventListener('click', async () => {
        const text = String(document.getElementById('rma-note')?.value || '').trim();
        if (!text) return;
        try {
          await navigator.clipboard.writeText(text);
          if (typeof showToast === 'function') showToast('RMA NOTE COPIED');
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch (_) {}
          ta.remove();
        }
      });
    }

    const clear = document.getElementById('rma-clear');
    if (clear) clear.textContent = 'Clear note';
    return true;
  }

  function initialise() {
    if (applyRmaNoteOnly()) return;
    const observer = new MutationObserver(() => {
      if (applyRmaNoteOnly()) observer.disconnect();
    });
    observer.observe(document.body, {childList:true, subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
})();
