(() => {
  'use strict';

  const TARGET_PREFIX = 'daily_watch_target_';
  const DEFAULT_TARGET = 50;
  const WORK_START = 9 * 60;
  const WORK_END = 17 * 60;
  const BREAKS = [
    [10 * 60, 10 * 60 + 15],
    [12 * 60, 12 * 60 + 30],
    [14 * 60, 14 * 60 + 15]
  ];

  function localDateKey(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function readJSON(key, fallback) {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function getTarget() {
    const raw = Number(localStorage.getItem(TARGET_PREFIX + localDateKey()));
    return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : DEFAULT_TARGET;
  }

  function setTarget(value) {
    const target = Math.min(200, Math.max(1, Math.round(Number(value) || DEFAULT_TARGET)));
    localStorage.setItem(TARGET_PREFIX + localDateKey(), String(target));
    return target;
  }

  function isSameLocalDay(timestamp, now = new Date()) {
    const date = new Date(Number(timestamp));
    return Number.isFinite(date.getTime()) &&
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  }

  function completedToday() {
    const history = readJSON('watch_history', []);
    if (!Array.isArray(history)) return 0;
    return history.filter(record => record && isSameLocalDay(record.id)).length;
  }

  function workingMinutesBetween(startMinute, endMinute) {
    if (endMinute <= startMinute) return 0;
    let total = endMinute - startMinute;
    for (const [breakStart, breakEnd] of BREAKS) {
      const overlapStart = Math.max(startMinute, breakStart);
      const overlapEnd = Math.min(endMinute, breakEnd);
      if (overlapEnd > overlapStart) total -= overlapEnd - overlapStart;
    }
    return Math.max(0, total);
  }

  const TOTAL_WORK_MINUTES = workingMinutesBetween(WORK_START, WORK_END);

  function workedMinutesNow(now = new Date()) {
    const current = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    if (current <= WORK_START) return 0;
    return workingMinutesBetween(WORK_START, Math.min(current, WORK_END));
  }

  function clockFromWorkMinutes(workMinutes) {
    if (!Number.isFinite(workMinutes) || workMinutes < 0) return null;
    let remaining = workMinutes;
    const windows = [
      [WORK_START, BREAKS[0][0]],
      [BREAKS[0][1], BREAKS[1][0]],
      [BREAKS[1][1], BREAKS[2][0]],
      [BREAKS[2][1], WORK_END]
    ];

    for (const [start, end] of windows) {
      const windowMinutes = end - start;
      if (remaining <= windowMinutes) return start + remaining;
      remaining -= windowMinutes;
    }
    return WORK_END + remaining;
  }

  function formatClock(totalMinutes) {
    if (!Number.isFinite(totalMinutes)) return '—';
    const mins = Math.max(0, Math.round(totalMinutes));
    const hours = Math.floor(mins / 60) % 24;
    const minutes = mins % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  function injectStyles() {
    if (document.getElementById('daily-work-dashboard-styles')) return;
    const style = document.createElement('style');
    style.id = 'daily-work-dashboard-styles';
    style.textContent = `
      .daily-work-dashboard{margin:14px 0 12px;padding:12px 14px;border:1px solid #253044;border-radius:14px;background:linear-gradient(180deg,rgba(17,24,39,.92),rgba(9,14,24,.96));box-shadow:0 12px 32px rgba(0,0,0,.18)}
      .daily-work-row{display:grid;grid-template-columns:minmax(150px,1.15fr) repeat(4,minmax(100px,.78fr));gap:10px;align-items:stretch}
      .daily-work-block{min-width:0;padding:8px 10px;border-left:1px solid rgba(75,85,99,.35)}
      .daily-work-block:first-child{border-left:0;padding-left:2px}
      .daily-work-label{display:block;color:#7f8da3;font-size:9px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;margin-bottom:4px}
      .daily-work-value{display:flex;align-items:baseline;gap:5px;color:#f8fafc;font-size:19px;line-height:1;font-weight:900;white-space:nowrap}
      .daily-work-value small{font-size:10px;color:#7f8da3;font-weight:700}
      .daily-work-target{width:54px;background:#0b1220;border:1px solid #334155;color:#fff;border-radius:7px;padding:4px 6px;font-size:17px;font-weight:900;outline:none}
      .daily-work-target:focus{border-color:#3b82f6}
      .daily-work-status.ahead{color:#6ee7b7}.daily-work-status.behind{color:#fca5a5}.daily-work-status.even{color:#cbd5e1}
      .daily-work-progress{height:5px;background:#172033;border-radius:999px;overflow:hidden;margin-top:9px}
      .daily-work-progress>span{display:block;height:100%;background:#3b82f6;border-radius:999px;transition:width .25s ease}
      .daily-work-foot{display:flex;justify-content:space-between;gap:12px;margin-top:6px;color:#64748b;font-size:9px;font-weight:700;letter-spacing:.04em}
      @media(max-width:900px){.daily-work-row{grid-template-columns:repeat(2,minmax(0,1fr))}.daily-work-block{border-left:0;border-top:1px solid rgba(75,85,99,.3)}.daily-work-block:first-child{grid-column:1/-1;border-top:0}.daily-work-block:nth-child(2){border-top:0}.daily-work-block:nth-child(3){border-top:0}}
    `;
    document.head.appendChild(style);
  }

  function buildDashboard() {
    if (document.getElementById('daily-work-dashboard')) return document.getElementById('daily-work-dashboard');
    const nav = document.querySelector('.workflow-nav');
    if (!nav?.parentNode) return null;

    const dash = document.createElement('section');
    dash.id = 'daily-work-dashboard';
    dash.className = 'daily-work-dashboard';
    dash.setAttribute('aria-label', 'Daily work dashboard');
    dash.innerHTML = `
      <div class="daily-work-row">
        <div class="daily-work-block">
          <span class="daily-work-label">Today's target</span>
          <div class="daily-work-value"><input id="daily-target-input" class="daily-work-target" type="number" min="1" max="200" step="1" aria-label="Daily watch target"><small>watches</small></div>
          <div class="daily-work-progress"><span id="daily-target-progress"></span></div>
          <div class="daily-work-foot"><span id="daily-progress-copy">0% complete</span><span>09:00–17:00 · breaks excluded</span></div>
        </div>
        <div class="daily-work-block"><span class="daily-work-label">Completed</span><div class="daily-work-value" id="daily-completed">0</div></div>
        <div class="daily-work-block"><span class="daily-work-label">Against target</span><div class="daily-work-value daily-work-status even" id="daily-ahead-behind">On target</div></div>
        <div class="daily-work-block"><span class="daily-work-label">Current pace</span><div class="daily-work-value" id="daily-pace">—<small>/hr</small></div></div>
        <div class="daily-work-block"><span class="daily-work-label">Projected finish</span><div class="daily-work-value" id="daily-projected-finish">—</div></div>
      </div>`;
    nav.parentNode.insertBefore(dash, nav);
    return dash;
  }

  function refresh() {
    const dash = buildDashboard();
    if (!dash) return;

    const now = new Date();
    const target = getTarget();
    const completed = completedToday();
    const worked = workedMinutesNow(now);
    const dayProgress = TOTAL_WORK_MINUTES ? Math.min(1, worked / TOTAL_WORK_MINUTES) : 0;
    const expected = target * dayProgress;
    const deltaRounded = Math.round(completed - expected);
    const pace = worked > 0 ? completed / (worked / 60) : 0;
    const completionPercent = target > 0 ? Math.min(100, (completed / target) * 100) : 0;

    const targetInput = document.getElementById('daily-target-input');
    if (targetInput && document.activeElement !== targetInput) targetInput.value = String(target);
    document.getElementById('daily-completed').textContent = String(completed);
    document.getElementById('daily-target-progress').style.width = `${completionPercent}%`;
    document.getElementById('daily-progress-copy').textContent = `${Math.round(completionPercent)}% complete`;

    const status = document.getElementById('daily-ahead-behind');
    status.classList.remove('ahead', 'behind', 'even');
    if (completed >= target) {
      status.textContent = 'Target hit';
      status.classList.add('ahead');
    } else if (worked <= 0) {
      status.textContent = 'Ready';
      status.classList.add('even');
    } else if (deltaRounded > 0) {
      status.textContent = `+${deltaRounded} ahead`;
      status.classList.add('ahead');
    } else if (deltaRounded < 0) {
      status.textContent = `${Math.abs(deltaRounded)} behind`;
      status.classList.add('behind');
    } else {
      status.textContent = 'On target';
      status.classList.add('even');
    }

    const paceEl = document.getElementById('daily-pace');
    paceEl.innerHTML = pace > 0 ? `${pace.toFixed(1)}<small>/hr</small>` : `—<small>/hr</small>`;

    const finishEl = document.getElementById('daily-projected-finish');
    if (completed >= target) {
      finishEl.textContent = 'Target hit';
    } else if (pace <= 0) {
      finishEl.textContent = now.getHours() < 9 ? 'Starts 09:00' : '—';
    } else {
      const requiredWorkMinutes = (target / pace) * 60;
      const finishMinute = clockFromWorkMinutes(requiredWorkMinutes);
      finishEl.textContent = `${formatClock(finishMinute)}${finishMinute > WORK_END ? ' late' : ''}`;
      if (finishMinute > WORK_END) finishEl.style.color = '#fca5a5';
      else finishEl.style.color = '';
    }
  }

  function patchSaveAction() {
    if (typeof window.resetAll !== 'function' || window.resetAll.__dailyDashboardPatched) return;
    const original = window.resetAll;
    const wrapped = function(...args) {
      const result = original.apply(this, args);
      setTimeout(refresh, 0);
      return result;
    };
    wrapped.__dailyDashboardPatched = true;
    window.resetAll = wrapped;
  }

  function init() {
    injectStyles();
    buildDashboard();
    const targetInput = document.getElementById('daily-target-input');
    targetInput?.addEventListener('change', () => {
      setTarget(targetInput.value);
      refresh();
    });
    targetInput?.addEventListener('keydown', event => {
      if (event.key === 'Enter') targetInput.blur();
    });
    patchSaveAction();
    refresh();
    window.addEventListener('storage', refresh);
    setInterval(refresh, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
