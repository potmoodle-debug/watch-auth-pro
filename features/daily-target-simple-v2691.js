/* Watch Auth Pro — Simple-mode daily target mirror
   Version 2.69.5 — 9 September 2026
   Lightweight standalone Simple-mode card with no self-triggering DOM observer.
*/
(() => {
  const CARD_ID = 'simple-daily-target-card';

  function injectStyles() {
    if (document.getElementById('simple-daily-target-v2691-styles')) return;
    const style = document.createElement('style');
    style.id = 'simple-daily-target-v2691-styles';
    style.textContent = `
      .simple-daily-target-card{margin:12px 0 16px;padding:12px 14px;border:1px solid rgba(59,130,246,.28);border-radius:12px;background:rgba(15,23,42,.66)}
      .simple-daily-target-card[hidden]{display:none!important}
      .simple-daily-target-head{display:flex;align-items:center;justify-content:space-between;gap:12px}
      .simple-daily-target-title{font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#93c5fd}
      .simple-daily-target-edit{display:flex;align-items:center;gap:5px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8}
      .simple-daily-target-input{width:50px;height:25px;padding:0 5px;border:1px solid rgba(71,85,105,.7);border-radius:7px;background:#070b12;color:#f8fafc;font-size:11px;font-weight:900;text-align:center;outline:none}
      .simple-daily-target-main{display:flex;align-items:baseline;gap:6px;margin-top:7px}
      .simple-daily-target-count{font-size:20px;font-weight:950;line-height:1;color:#f8fafc}
      .simple-daily-target-of{font-size:11px;font-weight:800;color:#64748b}
      .simple-daily-target-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:5px;font-size:10px;font-weight:800;color:#94a3b8}
      .simple-daily-target-pace{color:#94a3b8}
      .simple-daily-target-track{height:4px;margin-top:7px;overflow:hidden;border-radius:999px;background:rgba(51,65,85,.72)}
      .simple-daily-target-fill{height:100%;width:0;border-radius:inherit;background:#3b82f6;transition:width .25s ease}
      @media(max-width:700px){.simple-daily-target-meta{align-items:flex-start;flex-direction:column;gap:2px}}
    `;
    document.head.appendChild(style);
  }

  function simpleBanner() {
    return document.querySelector('.simple-mode-banner');
  }

  function simpleModeIsVisible() {
    const banner = simpleBanner();
    if (!banner) return false;
    const style = window.getComputedStyle(banner);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }

  function createCard() {
    if (document.getElementById(CARD_ID)) return document.getElementById(CARD_ID);
    const banner = simpleBanner();
    if (!banner) return null;

    const card = document.createElement('div');
    card.id = CARD_ID;
    card.className = 'simple-daily-target-card';
    card.hidden = true;
    card.innerHTML = `
      <div class="simple-daily-target-head">
        <span class="simple-daily-target-title">Today's watch target</span>
        <label class="simple-daily-target-edit">Target
          <input id="simple-daily-target-input" class="simple-daily-target-input" type="number" min="1" max="250" step="1" inputmode="numeric" aria-label="Daily watch target in Simple mode">
        </label>
      </div>
      <div class="simple-daily-target-main">
        <strong id="simple-daily-target-count" class="simple-daily-target-count">0</strong>
        <span id="simple-daily-target-of" class="simple-daily-target-of">/ 50</span>
      </div>
      <div class="simple-daily-target-meta">
        <span id="simple-daily-target-remaining">0% complete</span>
        <span id="simple-daily-target-pace" class="simple-daily-target-pace">Target: 50</span>
      </div>
      <div class="simple-daily-target-track" aria-hidden="true"><div id="simple-daily-target-fill" class="simple-daily-target-fill"></div></div>`;

    banner.insertAdjacentElement('afterend', card);

    document.getElementById('simple-daily-target-input')?.addEventListener('change', event => {
      const mainInput = document.getElementById('daily-target-input');
      if (!mainInput) return;
      mainInput.value = event.target.value;
      mainInput.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(syncFromMain, 0);
    });
    return card;
  }

  function setTextIfChanged(id, value) {
    const element = document.getElementById(id);
    if (element && element.textContent !== value) element.textContent = value;
  }

  function syncFromMain() {
    const simpleCard = createCard();
    if (!simpleCard) return;

    const shouldShow = simpleModeIsVisible();
    if (simpleCard.hidden === shouldShow) simpleCard.hidden = !shouldShow;
    if (!shouldShow) return;

    const completed = document.getElementById('daily-target-completed')?.textContent || '0';
    const ofText = document.getElementById('daily-target-of')?.textContent || '/ 50';
    const remaining = document.getElementById('daily-target-remaining')?.textContent || '';
    const pace = document.getElementById('daily-target-pace')?.textContent || '';
    const mainInput = document.getElementById('daily-target-input');
    const fill = document.getElementById('daily-target-fill');

    setTextIfChanged('simple-daily-target-count', completed);
    setTextIfChanged('simple-daily-target-of', ofText);
    setTextIfChanged('simple-daily-target-remaining', remaining);
    setTextIfChanged('simple-daily-target-pace', pace);

    const simpleInput = document.getElementById('simple-daily-target-input');
    const nextInputValue = mainInput?.value || '50';
    if (simpleInput && simpleInput.value !== nextInputValue) simpleInput.value = nextInputValue;

    const simpleFill = document.getElementById('simple-daily-target-fill');
    const nextWidth = fill?.style?.width || '0%';
    if (simpleFill && simpleFill.style.width !== nextWidth) simpleFill.style.width = nextWidth;
  }

  function initialise() {
    injectStyles();
    createCard();
    syncFromMain();

    document.getElementById('simple-mode-btn')?.addEventListener('click', () => setTimeout(syncFromMain, 0));
    document.getElementById('advanced-mode-btn')?.addEventListener('click', () => setTimeout(syncFromMain, 0));
    document.getElementById('daily-target-input')?.addEventListener('change', () => setTimeout(syncFromMain, 0));
    setInterval(syncFromMain, 5000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
