/* Watch Auth Pro v2.67.1 — header/version display fix
   Ensures the visible database banner reflects DATABASE_META after older UI code renders.
*/
(function () {
    function normaliseDate(value) {
        return String(value || '').toUpperCase();
    }

    function applyVersionBanner() {
        var status = document.getElementById('database-status');
        if (!status) return;

        var meta = (typeof DATABASE_META !== 'undefined' && DATABASE_META) ? DATABASE_META : {};
        var version = meta.version || '2.67.1';
        var updated = normaliseDate(meta.updated || '25 August 2026');
        var current = String(status.textContent || '').trim();
        var parts = current.split('•').map(function (part) { return part.trim(); }).filter(Boolean);
        var suffix = '';

        if (parts.length >= 3 && /^DB\s+v/i.test(parts[0]) && /^UPDATED\s+/i.test(parts[1])) {
            suffix = parts.slice(2).join(' • ');
        }

        var expectedPrefix = 'DB v' + version + ' • UPDATED ' + updated;
        var nextText = expectedPrefix + (suffix ? ' • ' + suffix : '');
        if (status.textContent !== nextText) status.textContent = nextText;
    }

    window.addEventListener('load', function () {
        applyVersionBanner();
        var status = document.getElementById('database-status');
        if (!status || typeof MutationObserver === 'undefined') return;
        var observer = new MutationObserver(function () { applyVersionBanner(); });
        observer.observe(status, { childList: true, characterData: true, subtree: true });
    });
})();
