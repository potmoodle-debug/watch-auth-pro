/* Watch Auth Pro — daily target correction controls
   Version 2.69.1 — 10 September 2026
   Adds safe -1 and Reset today controls without deleting inspection logs.
*/
(function () {
  const STORAGE_KEY = 'watch_auth_daily_target_v269';

  function readState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); }
    catch (_) { return null; }
  }

  function writeState(state) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (_) {}
  }

  function currentInspectionCount() {
    const stored = Number.parseInt(localStorage.getItem('inspection_count') || '0', 10);
    return Number.isFinite(stored) && stored >= 0 ? stored : 0;
  }

  function todayKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function refresh() {
    window.location.reload();
  }

  function decrementOne() {
    const state = readState();
    const count = currentInspectionCount();
    if (!state || state.date !== todayKey()) return;
    if ((state.completed || 0) <= 0 && count <= 0) return;

    state.completed = Math.max(0, Number(state.completed || 0) - 1);
    const nextCount = Math.max(0, count - 1);
    state.lastCount = nextCount;
    writeState(state);
    try { localStorage.setItem('inspection_count', String(nextCount)); } catch (_) {}
    refresh();
  }

  function resetToday() {
    const state = readState();
    if (!state || state.date !== todayKey()) return;
    state.completed = 0;
    state.lastCount = currentInspectionCount();
    writeState(state);
    refresh();
  }

  function injectStyles() {
    if (document.getElementById('daily-target-correction-v2691-styles')) return;
    const style = document.createElement('style');
    style.id = 'daily-target-correction-v2691-styles';
    style.textContent = `
      .daily-target-corrections{display:flex;gap:6px;margin-top:7px}
      .daily-target-correct-btn{border:1px solid rgba(71,85,105,.7);border-radius:7px;background:#0b111c;color:#cbd5e1;padding:5px 8px;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;cursor:pointer}
      .daily-target-correct-btn:hover{background:#111827;color:#fff}
      .daily-target-reset-btn{color:#fbbf24;border-color:rgba(245,158,11,.35)}
    `;
    document.head.appendChild(style);
  }

  function install() {
    const card = document.getElementById('daily-target-card');
    if (!card || document.getElementById('daily-target-corrections')) return false;
    injectStyles();

    const controls = document.createElement('div');
    controls.id = 'daily-target-corrections';
    controls.className = 'daily-target-corrections';
    controls.innerHTML = `
      <button type="button" class="daily-target-correct-btn" id="daily-target-minus-one" title="Correct one accidentally completed watch. Inspection logs are not deleted.">−1</button>
      <button type="button" class="daily-target-correct-btn daily-target-reset-btn" id="daily-target-reset-today" title="Reset today's target progress only. Inspection logs are not deleted.">Reset today</button>`;
    card.appendChild(controls);

    document.getElementById('daily-target-minus-one').addEventListener('click', decrementOne);
    document.getElementById('daily-target-reset-today').addEventListener('click', function () {
      if (window.confirm('Reset today’s target progress to 0? Inspection logs will be kept.')) resetToday();
    });
    return true;
  }

  let attempts = 0;
  const timer = setInterval(function () {
    attempts += 1;
    if (install() || attempts > 40) clearInterval(timer);
  }, 250);
  window.addEventListener('load', install, { once: true });
})();
