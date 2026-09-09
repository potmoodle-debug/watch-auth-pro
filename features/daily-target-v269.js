/* Watch Auth Pro — daily watch target and pace tracker
   Version 2.69.0 — 9 September 2026
*/
if (typeof DATABASE_META !== 'undefined') {
  DATABASE_META.version = '2.69.0';
  DATABASE_META.updated = '9 September 2026';
  DATABASE_META.scope = 'Editable daily watch target with automatic completed count, remaining watches, percentage progress and workday pace status.';
}

(() => {
  const STORAGE_KEY = 'watch_auth_daily_target_v269';
  const DEFAULT_TARGET = 50;
  const WORK_WINDOWS = [
    [9 * 60, 10 * 60],
    [10 * 60 + 15, 12 * 60],
    [12 * 60 + 30, 14 * 60],
    [14 * 60 + 15, 17 * 60]
  ];
  const TOTAL_WORK_MINUTES = WORK_WINDOWS.reduce((sum, [start, end]) => sum + (end - start), 0);
  let state = null;
  let originalUpdateCounterDisplay = null;

  function todayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function readInspectionCount() {
    const direct = Number.parseInt(localStorage.getItem('inspection_count') || '0', 10);
    if (Number.isFinite(direct) && direct >= 0) return direct;
    const displayed = Number.parseInt(document.getElementById('inspection-count')?.textContent || '0', 10);
    return Number.isFinite(displayed) && displayed >= 0 ? displayed : 0;
  }

  function loadState() {
    const currentCount = readInspectionCount();
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    } catch (_) {}

    const target = Math.max(1, Number.parseInt(saved?.target || DEFAULT_TARGET, 10) || DEFAULT_TARGET);
    if (!saved || saved.date !== todayKey()) {
      state = {
        date: todayKey(),
        target,
        completed: saved ? 0 : currentCount,
        lastCount: currentCount
      };
      saveState();
      return;
    }

    state = {
      date: saved.date,
      target,
      completed: Math.max(0, Number.parseInt(saved.completed || '0', 10) || 0),
      lastCount: Math.max(0, Number.parseInt(saved.lastCount ?? currentCount, 10) || 0)
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function syncCompletedCount() {
    if (!state || state.date !== todayKey()) loadState();
    const currentCount = readInspectionCount();
    const delta = currentCount - state.lastCount;
    if (delta > 0) state.completed += delta;
    state.lastCount = currentCount;
    saveState();
  }

  function elapsedWorkMinutes(date = new Date()) {
    const minuteOfDay = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
    return WORK_WINDOWS.reduce((sum, [start, end]) => {
      if (minuteOfDay <= start) return sum;
      return sum + Math.max(0, Math.min(minuteOfDay, end) - start);
    }, 0);
  }

  function paceStatus() {
    const now = new Date();
    const minuteOfDay = now.getHours() * 60 + now.getMinutes();
    const completed = state.completed;
    const target = state.target;

    if (completed >= target) return { text: `Target reached · +${completed - target}`, tone: 'ahead' };
    if (minuteOfDay < WORK_WINDOWS[0][0]) return { text: 'Workday starts 09:00', tone: 'neutral' };
    if (minuteOfDay >= WORK_WINDOWS[WORK_WINDOWS.length - 1][1]) {
      const short = target - completed;
      return { text: `${short} short of target`, tone: 'behind' };
    }

    const expected = target * (elapsedWorkMinutes(now) / TOTAL_WORK_MINUTES);
    const difference = completed - expected;
    if (difference >= 1) return { text: `+${Math.floor(difference)} ahead`, tone: 'ahead' };
    if (difference <= -1) return { text: `${Math.ceil(Math.abs(difference))} behind`, tone: 'behind' };
    return { text: 'On pace', tone: 'on' };
  }

  function injectStyles() {
    if (document.getElementById('daily-target-v269-styles')) return;
    const style = document.createElement('style');
    style.id = 'daily-target-v269-styles';
    style.textContent = `
      .daily-target-card{min-width:210px;padding:9px 12px;border:1px solid rgba(71,85,105,.55);border-radius:12px;background:rgba(2,6,12,.54)}
      .daily-target-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
      .daily-target-label{font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;color:#64748b}
      .daily-target-edit{display:flex;align-items:center;gap:4px;color:#94a3b8;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.06em}
      .daily-target-input{width:48px;height:24px;padding:0 5px;border:1px solid rgba(71,85,105,.7);border-radius:7px;background:#070b12;color:#f8fafc;font-size:11px;font-weight:900;text-align:center;outline:none}
      .daily-target-input:focus{border-color:#3b82f6;box-shadow:0 0 0 2px rgba(59,130,246,.12)}
      .daily-target-main{display:flex;align-items:baseline;gap:5px;margin-top:4px;color:#f8fafc}
      .daily-target-completed{font-size:19px;font-weight:950;line-height:1}
      .daily-target-of{font-size:11px;font-weight:800;color:#64748b}
      .daily-target-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:5px;font-size:9px;font-weight:800;color:#94a3b8}
      .daily-target-pace{white-space:nowrap}
      .daily-target-pace.ahead{color:#6ee7b7}.daily-target-pace.on{color:#93c5fd}.daily-target-pace.behind{color:#fbbf24}.daily-target-pace.neutral{color:#94a3b8}
      .daily-target-track{height:4px;margin-top:7px;overflow:hidden;border-radius:999px;background:rgba(51,65,85,.72)}
      .daily-target-fill{height:100%;width:0;border-radius:inherit;background:#3b82f6;transition:width .25s ease}
      .daily-target-card.complete .daily-target-fill{background:#10b981}
      @media(max-width:900px){.daily-target-card{min-width:180px}.daily-target-meta{align-items:flex-start;flex-direction:column;gap:2px}}
    `;
    document.head.appendChild(style);
  }

  function createCard() {
    if (document.getElementById('daily-target-card')) return;
    const cluster = document.querySelector('.status-cluster');
    const completedStat = cluster?.querySelector('.inspection-stat');
    if (!cluster || !completedStat) return;

    const card = document.createElement('div');
    card.id = 'daily-target-card';
    card.className = 'daily-target-card';
    card.innerHTML = `
      <div class="daily-target-top">
        <span class="daily-target-label">Daily target</span>
        <label class="daily-target-edit">Target
          <input id="daily-target-input" class="daily-target-input" type="number" min="1" max="250" step="1" inputmode="numeric" aria-label="Daily watch target">
        </label>
      </div>
      <div class="daily-target-main">
        <strong id="daily-target-completed" class="daily-target-completed">0</strong>
        <span id="daily-target-of" class="daily-target-of">/ 50</span>
      </div>
      <div class="daily-target-meta">
        <span id="daily-target-remaining">50 remaining · 0%</span>
        <span id="daily-target-pace" class="daily-target-pace neutral">On pace</span>
      </div>
      <div class="daily-target-track" aria-hidden="true"><div id="daily-target-fill" class="daily-target-fill"></div></div>`;
    completedStat.insertAdjacentElement('afterend', card);

    const input = document.getElementById('daily-target-input');
    input.value = state.target;
    input.addEventListener('change', () => {
      const nextTarget = Math.max(1, Math.min(250, Number.parseInt(input.value || DEFAULT_TARGET, 10) || DEFAULT_TARGET));
      state.target = nextTarget;
      input.value = nextTarget;
      saveState();
      render();
    });
  }

  function render() {
    if (!state) return;
    createCard();
    const card = document.getElementById('daily-target-card');
    if (!card) return;

    const completed = state.completed;
    const target = state.target;
    const remaining = Math.max(0, target - completed);
    const percentage = target > 0 ? Math.round((completed / target) * 100) : 0;
    const pace = paceStatus();

    document.getElementById('daily-target-completed').textContent = completed;
    document.getElementById('daily-target-of').textContent = `/ ${target}`;
    document.getElementById('daily-target-remaining').textContent = completed >= target
      ? `${percentage}% complete`
      : `${remaining} remaining · ${percentage}%`;
    const paceEl = document.getElementById('daily-target-pace');
    paceEl.textContent = pace.text;
    paceEl.className = `daily-target-pace ${pace.tone}`;
    document.getElementById('daily-target-fill').style.width = `${Math.min(100, percentage)}%`;
    document.getElementById('daily-target-input').value = target;
    card.classList.toggle('complete', completed >= target);
  }

  function syncAndRender() {
    syncCompletedCount();
    render();
  }

  function wrapCounterUpdate() {
    if (typeof updateCounterDisplay !== 'function' || updateCounterDisplay.__dailyTargetWrapped) return;
    originalUpdateCounterDisplay = updateCounterDisplay;
    const wrapped = function (...args) {
      const result = originalUpdateCounterDisplay.apply(this, args);
      queueMicrotask(syncAndRender);
      return result;
    };
    wrapped.__dailyTargetWrapped = true;
    updateCounterDisplay = wrapped;
  }

  function initialise() {
    injectStyles();
    loadState();
    createCard();
    wrapCounterUpdate();
    syncAndRender();
    setInterval(() => {
      if (state.date !== todayKey()) loadState();
      wrapCounterUpdate();
      syncAndRender();
    }, 60000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
