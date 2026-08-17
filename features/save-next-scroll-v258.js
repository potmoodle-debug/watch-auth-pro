/* Watch Auth Pro — Save & Start Next scroll reset
   Version 2.58.0 — 17 August 2026
   Returns the workspace to the top after a completed reset.
*/

if (typeof DATABASE_META !== 'undefined') {
    DATABASE_META.version = '2.58.0';
    DATABASE_META.updated = '17 August 2026';
    DATABASE_META.scope = 'Save & Start Next now returns the workspace to the top after resetting the completed inspection; v2.57.0 custom-brand and v2.56.0 calibre-suggestion features retained.';
}

(() => {
    function installSaveNextScrollReset() {
        if (typeof window.resetAll !== 'function') return false;
        if (window.resetAll.__watchAuthScrollWrapped) return true;

        const originalResetAll = window.resetAll;

        function wrappedResetAll(...args) {
            const result = originalResetAll.apply(this, args);

            // Allow the existing reset/render work to finish before moving the viewport.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    try {
                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                    } catch (_) {
                        window.scrollTo(0, 0);
                    }
                });
            });

            return result;
        }

        wrappedResetAll.__watchAuthScrollWrapped = true;
        wrappedResetAll.__watchAuthOriginal = originalResetAll;
        window.resetAll = wrappedResetAll;
        return true;
    }

    function initialise() {
        if (installSaveNextScrollReset()) return;

        // Defensive retry in case app.js initialisation is still completing.
        let attempts = 0;
        const timer = setInterval(() => {
            attempts += 1;
            if (installSaveNextScrollReset() || attempts >= 20) clearInterval(timer);
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise, { once: true });
    } else {
        initialise();
    }
})();
