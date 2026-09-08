/* Watch Auth Pro v2.68.0 — Rolex clasp-code copy reminder
   If a Rolex authentication note is copied without a clasp code, pause and remind the authenticator.
*/
(function () {
  function selectedBrand() {
    if (typeof window.getSelectedBrand === 'function') return window.getSelectedBrand();
    const checked = document.querySelector('.brand-checkbox:checked');
    return checked ? checked.value : '';
  }

  function claspCode() {
    const input = document.getElementById('claspCode');
    return input ? String(input.value || '').trim() : '';
  }

  function ensureModal() {
    let modal = document.getElementById('rolex-clasp-copy-reminder');
    if (modal) return modal;
    modal = document.createElement('div');
    modal.id = 'rolex-clasp-copy-reminder';
    modal.className = 'fixed inset-0 z-[260] hidden items-center justify-center bg-black/80 backdrop-blur-sm';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'rolex-clasp-copy-reminder-title');
    modal.innerHTML = `
      <div class="w-full max-w-md mx-4 rounded-2xl border border-amber-700/60 bg-gray-900 p-6 shadow-2xl">
        <div class="text-[10px] font-black uppercase tracking-[.18em] text-amber-400">Rolex check</div>
        <h3 id="rolex-clasp-copy-reminder-title" class="mt-2 text-base font-bold text-white">No clasp code entered</h3>
        <p class="mt-2 text-xs leading-relaxed text-gray-300">This is a Rolex inspection and the clasp-code field is blank. Add the clasp code before copying the authentication note if it is available on the watch.</p>
        <div class="mt-5 flex flex-wrap justify-end gap-3">
          <button type="button" id="rolex-clasp-copy-anyway" class="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-bold uppercase tracking-wider text-gray-300">Copy anyway</button>
          <button type="button" id="rolex-clasp-go-back" class="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-xs font-bold uppercase tracking-wider text-white">Enter clasp code</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    return modal;
  }

  function install() {
    if (typeof window.copyNote !== 'function' || window.copyNote.__rolexClaspReminderWrapped) return;
    const originalCopyNote = window.copyNote;

    function wrappedCopyNote() {
      if (selectedBrand() !== 'Rolex' || claspCode()) {
        return originalCopyNote.apply(this, arguments);
      }

      const args = arguments;
      const context = this;
      const modal = ensureModal();
      const enterButton = modal.querySelector('#rolex-clasp-go-back');
      const copyButton = modal.querySelector('#rolex-clasp-copy-anyway');

      modal.classList.remove('hidden');
      modal.classList.add('flex');

      const close = function () {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      };

      enterButton.onclick = function () {
        close();
        const input = document.getElementById('claspCode');
        if (input) {
          input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(function () { input.focus(); }, 250);
        }
      };

      copyButton.onclick = function () {
        close();
        originalCopyNote.apply(context, args);
      };
      return undefined;
    }

    wrappedCopyNote.__rolexClaspReminderWrapped = true;
    window.copyNote = wrappedCopyNote;
  }

  window.addEventListener('load', install, { once: true });
})();
