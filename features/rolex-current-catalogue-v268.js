/* Watch Auth Pro v2.68.0 — Rolex current-catalogue freshness display */
(function () {
  function refreshLabels() {
    document.querySelectorAll('#rolex-current-catalogue-match span').forEach(function (node) {
      if (/Rolex UK\s*·\s*checked 18 Aug 2026/i.test(node.textContent || '')) {
        node.textContent = 'Rolex UK · refreshed 8 Sep 2026';
      }
    });

    var status = document.getElementById('database-status');
    if (status) {
      var text = String(status.textContent || '');
      text = text.replace(/157 current official Rolex refs(?:\s*·\s*refreshed 8 Sep 2026)?/i, '159 current official Rolex refs · refreshed 8 Sep 2026');
      if (status.textContent !== text) status.textContent = text;
    }
  }

  window.addEventListener('load', function () {
    refreshLabels();
    if (typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(refreshLabels);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }, { once: true });
})();
