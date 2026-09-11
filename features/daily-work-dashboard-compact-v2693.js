(() => {
  'use strict';

  const DEFAULT_TARGET = 50;
  const TARGET_KEY_PREFIX = 'wap_daily_target_';
  const WORK_START = 9 * 60;
  const WORK_END = 17 * 60;
  const BREAKS = [[600,615],[720,750],[840,855]];
  const CARD_ID = 'wap-daily-dashboard';

  function dateKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function targetKey() { return TARGET_KEY_PREFIX + dateKey(); }

  function getTarget() {
    const current = Number(localStorage.getItem(targetKey()));
    if (Number.isFinite(current) && current > 0) return Math.round(current);

    // Migrate previous target values where possible.
    try {
      const legacy = JSON.parse(localStorage.getItem('watch_auth_daily_target_v269') || 'null');
      const migrated = Number(legacy?.target);
      if (Number.isFinite(migrated) && migrated > 0) {
        localStorage.setItem(targetKey(), String(Math.round(migrated)));
        return Math.round(migrated);
      }
    } catch (_) {}
    return DEFAULT_TARGET;
  }

  function setTarget(value) {
    const target = Math.max(1, Math.min(250, Math.round(Number(value) || DEFAULT_TARGET)));
    localStorage.setItem(targetKey(), String(target));
    return target;
  }

  function readHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem('watch_history') || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (_) { return []; }
  }

  function completedToday() {
    const today = dateKey();
    return readHistory().filter(record => {
      if (!record) return false;
      if (record.id) {
        const d = new Date(Number(record.id));
        if (Number.isFinite(d.getTime()) && dateKey(d) === today) return true;
      }
      // Older history records may only have the locale timestamp string.
      if (record.timestamp) {
        const d = new Date(record.timestamp);
        if (Number.isFinite(d.getTime()) && dateKey(d) === today) return true;
      }
      return false;
    }).length;
  }

  function workingMinutesBetween(start, end) {
    if (end <= start) return 0;
    let total = end - start;
    BREAKS.forEach(([bStart,bEnd]) => {
      total -= Math.max(0, Math.min(end,bEnd) - Math.max(start,bStart));
    });
    return Math.max(0,total);
  }

  const TOTAL_WORK_MINUTES = workingMinutesBetween(WORK_START, WORK_END);

  function workedMinutes(now = new Date()) {
    const minute = now.getHours()*60 + now.getMinutes() + now.getSeconds()/60;
    if (minute <= WORK_START) return 0;
    return workingMinutesBetween(WORK_START, Math.min(minute, WORK_END));
  }

  function clockFromWorkingMinutes(minutes) {
    if (!Number.isFinite(minutes)) return null;
    let remaining = Math.max(0, minutes);
    const windows = [[540,600],[615,720],[750,840],[855,1020]];
    for (const [start,end] of windows) {
      const length = end-start;
      if (remaining <= length) return start + remaining;
      remaining -= length;
    }
    return WORK_END + remaining;
  }

  function formatClock(minute) {
    if (!Number.isFinite(minute)) return '—';
    const rounded = Math.round(minute);
    const h = Math.floor(rounded/60);
    const m = rounded%60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }

  function removeLegacyDashboards() {
    ['daily-work-dashboard','daily-target-card','simple-daily-target-card'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.id !== CARD_ID) el.remove();
    });
    document.querySelectorAll('.daily-work-dashboard,.daily-target-card,.simple-daily-target-card').forEach(el => {
      if (el.id !== CARD_ID) el.remove();
    });
  }

  function styles() {
    if (document.getElementById('wap-daily-dashboard-styles')) return;
    const style = document.createElement('style');
    style.id = 'wap-daily-dashboard-styles';
    style.textContent = `
      #${CARD_ID}{display:flex;align-items:center;gap:12px;min-width:510px;padding:9px 12px;border:1px solid rgba(71,85,105,.6);border-radius:14px;background:rgba(2,6,12,.64)}
      #${CARD_ID} .wap-dd-target{display:flex;align-items:center;gap:6px;padding-right:10px;border-right:1px solid rgba(71,85,105,.45)}
      #${CARD_ID} .wap-dd-label{display:block;font-size:8px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:#64748b;margin-bottom:2px}
      #${CARD_ID} .wap-dd-value{font-size:14px;font-weight:900;line-height:1.15;color:#f8fafc;white-space:nowrap}
      #${CARD_ID} .wap-dd-target input{width:48px;height:30px;padding:0 5px;border:1px solid #334155;border-radius:8px;background:#070b12;color:#fff;text-align:center;font-size:14px;font-weight:900;outline:none}
      #${CARD_ID} .wap-dd-target input:focus{border-color:#3b82f6}
      #${CARD_ID} .wap-dd-stat{min-width:72px}
      #${CARD_ID} .wap-dd-stat.status{min-width:98px}
      #${CARD_ID} .wap-dd-status.ahead{color:#6ee7b7}
      #${CARD_ID} .wap-dd-status.behind{color:#fca5a5}
      #${CARD_ID} .wap-dd-status.even{color:#93c5fd}
      #${CARD_ID} .wap-dd-progress{width:74px;height:4px;background:#1f2937;border-radius:999px;overflow:hidden;margin-top:5px}
      #${CARD_ID} .wap-dd-progress span{display:block;height:100%;background:#3b82f6;border-radius:999px}
      @media(max-width:1100px){#${CARD_ID}{min-width:0;flex-wrap:wrap;gap:9px}#${CARD_ID} .wap-dd-target{border-right:0;padding-right:0}#${CARD_ID} .wap-dd-stat{min-width:64px}}
      @media(max-width:760px){.topbar-inner{align-items:flex-start}#${CARD_ID}{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));margin-top:8px}#${CARD_ID} .wap-dd-target{grid-column:1/-1}#${CARD_ID} .wap-dd-progress{width:100%}}
    `;
    document.head.appendChild(style);
  }

  function build() {
    let card = document.getElementById(CARD_ID);
    if (card) return card;
    const cluster = document.querySelector('.status-cluster');
    if (!cluster) return null;

    card = document.createElement('div');
    card.id = CARD_ID;
    card.setAttribute('aria-label','Daily work dashboard');
    card.innerHTML = `
      <div class="wap-dd-target">
        <div><span class="wap-dd-label">Target</span><input id="wap-dd-target" type="number" min="1" max="250" step="1" aria-label="Daily watch target"></div>
        <div><span class="wap-dd-label">Progress</span><div class="wap-dd-value" id="wap-dd-progress-copy">0 / 50</div><div class="wap-dd-progress"><span id="wap-dd-progress-bar"></span></div></div>
      </div>
      <div class="wap-dd-stat"><span class="wap-dd-label">Completed</span><div class="wap-dd-value" id="wap-dd-completed">0</div></div>
      <div class="wap-dd-stat status"><span class="wap-dd-label">Against target</span><div class="wap-dd-value wap-dd-status even" id="wap-dd-status">Ready</div></div>
      <div class="wap-dd-stat"><span class="wap-dd-label">Pace</span><div class="wap-dd-value" id="wap-dd-pace">— /hr</div></div>
      <div class="wap-dd-stat"><span class="wap-dd-label">Finish</span><div class="wap-dd-value" id="wap-dd-finish">09:00 start</div></div>`;

    const confidence = cluster.querySelector('.confidence-block');
    if (confidence) cluster.insertBefore(card, confidence);
    else cluster.appendChild(card);

    const input = card.querySelector('#wap-dd-target');
    input.addEventListener('change', () => { input.value = setTarget(input.value); refresh(); });
    input.addEventListener('keydown', event => { if (event.key === 'Enter') input.blur(); });
    return card;
  }

  function refresh() {
    removeLegacyDashboards();
    const card = build();
    if (!card) return;
    const target = getTarget();
    const completed = completedToday();
    const now = new Date();
    const worked = workedMinutes(now);
    const expected = target * Math.min(1, worked/TOTAL_WORK_MINUTES);
    const delta = Math.round(completed-expected);
    const pace = worked > 0 ? completed/(worked/60) : 0;
    const percent = target > 0 ? Math.min(100,(completed/target)*100) : 0;

    const input = card.querySelector('#wap-dd-target');
    if (input && document.activeElement !== input) input.value = target;
    card.querySelector('#wap-dd-completed').textContent = completed;
    card.querySelector('#wap-dd-progress-copy').textContent = `${completed} / ${target}`;
    card.querySelector('#wap-dd-progress-bar').style.width = `${percent}%`;

    const status = card.querySelector('#wap-dd-status');
    status.className = 'wap-dd-value wap-dd-status';
    if (completed >= target) { status.textContent = 'Target hit'; status.classList.add('ahead'); }
    else if (worked <= 0) { status.textContent = 'Ready'; status.classList.add('even'); }
    else if (delta > 0) { status.textContent = `+${delta} ahead`; status.classList.add('ahead'); }
    else if (delta < 0) { status.textContent = `${Math.abs(delta)} behind`; status.classList.add('behind'); }
    else { status.textContent = 'On target'; status.classList.add('even'); }

    card.querySelector('#wap-dd-pace').textContent = pace > 0 ? `${pace.toFixed(1)} /hr` : '— /hr';
    const finish = card.querySelector('#wap-dd-finish');
    if (completed >= target) finish.textContent = 'Target hit';
    else if (pace <= 0) finish.textContent = now.getHours() < 9 ? '09:00 start' : '—';
    else {
      const minute = clockFromWorkingMinutes((target/pace)*60);
      finish.textContent = `${formatClock(minute)}${minute > WORK_END ? ' late' : ''}`;
      finish.style.color = minute > WORK_END ? '#fca5a5' : '';
    }
  }

  function init() {
    styles();
    removeLegacyDashboards();
    build();
    refresh();
    window.addEventListener('storage', refresh);
    setInterval(refresh, 5000);

    // Prevent delayed legacy scripts from leaving duplicate dashboards behind.
    const observer = new MutationObserver(() => removeLegacyDashboards());
    observer.observe(document.body, {childList:true, subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
