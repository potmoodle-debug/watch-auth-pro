/* Watch Auth Pro — definitive version banner sync
   Reads the live DATABASE_META value. Do not hard-code a database version here.
*/
(function () {
  function apply() {
    var el = document.getElementById('database-status');
    if (!el) return;

    var meta = (typeof DATABASE_META !== 'undefined' && DATABASE_META) ? DATABASE_META : {};
    var version = meta.version || 'loading';
    var updated = meta.updated || '';
    var desired = 'DB v' + version + (updated ? ' • UPDATED ' + String(updated).toUpperCase() : '');

    if (el.textContent !== desired) el.textContent = desired;
  }

  function start() {
    apply();
    var el = document.getElementById('database-status');
    if (!el || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(apply);
    observer.observe(el, { childList: true, characterData: true, subtree: true });
    setTimeout(apply, 0);
    setTimeout(apply, 250);
    setTimeout(apply, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
  window.addEventListener('load', apply);
})();