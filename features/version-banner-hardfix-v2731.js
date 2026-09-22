/* Watch Auth Pro — definitive version banner fix */
(function () {
  function apply() {
    try {
      if (typeof DATABASE_META !== 'undefined' && DATABASE_META) {
        DATABASE_META.version = '2.78.0';
        DATABASE_META.updated = '22 September 2026';
      }
    } catch (e) {}

    var el = document.getElementById('database-status');
    if (!el) return;

    var version = (typeof DATABASE_META !== 'undefined' && DATABASE_META && DATABASE_META.version) || '2.78.0';
    var updated = (typeof DATABASE_META !== 'undefined' && DATABASE_META && DATABASE_META.updated) || '22 September 2026';
    var desired = 'DB v' + version + ' • UPDATED ' + String(updated).toUpperCase();

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