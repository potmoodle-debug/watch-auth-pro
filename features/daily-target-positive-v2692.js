/* Watch Auth Pro — neutral daily target projection
   Version 2.69.3 — 9 September 2026
   Presents pace as a factual projection rather than praise or criticism.
*/
(() => {
  const WORK_WINDOWS = [
    [9 * 60, 10 * 60],
    [10 * 60 + 15, 12 * 60],
    [12 * 60 + 30, 14 * 60],
    [14 * 60 + 15, 17 * 60]
  ];
  const TOTAL_WORK_MINUTES = WORK_WINDOWS.reduce((sum, [start, end]) => sum + (end - start), 0);

  function elapsedWorkMinutes(date = new Date()) {
    const minuteOfDay = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60;
    return WORK_WINDOWS.reduce((sum, [start, end]) => {
      if (minuteOfDay <= start) return sum;
      return sum + Math.max(0, Math.min(minuteOfDay, end) - start);
    }, 0);
  }

  function refreshMain() {
    const pace = document.getElementById('daily-target-pace');
    const remaining = document.getElementById('daily-target-remaining');
    if (!pace || !remaining) return;

    const completed = Number.parseInt(document.getElementById('daily-target-completed')?.textContent || '0', 10) || 0;
    const target = Number.parseInt((document.getElementById('daily-target-of')?.textContent || '').replace(/\D/g, ''), 10) || 50;
    const percentage = target > 0 ? Math.round((completed / target) * 100) : 0;
    const now = new Date();
    const minuteOfDay = now.getHours() * 60 + now.getMinutes();
    const elapsed = elapsedWorkMinutes(now);

    remaining.textContent = `${percentage}% complete`;

    if (completed >= target) {
      pace.textContent = `Completed: ${completed} / ${target}`;
      pace.className = 'daily-target-pace ahead';
      return;
    }

    if (minuteOfDay < WORK_WINDOWS[0][0] || elapsed < 30) {
      pace.textContent = `Target: ${target}`;
      pace.className = 'daily-target-pace neutral';
      return;
    }

    if (minuteOfDay >= WORK_WINDOWS[WORK_WINDOWS.length - 1][1]) {
      pace.textContent = `Finished: ${completed} / ${target}`;
      pace.className = 'daily-target-pace neutral';
      return;
    }

    const fraction = elapsed / TOTAL_WORK_MINUTES;
    const projected = Math.max(completed, Math.round(completed / fraction));
    pace.textContent = `Projected: ${projected} / ${target}`;
    pace.className = 'daily-target-pace neutral';
  }

  function syncSimple() {
    const mainRemaining = document.getElementById('daily-target-remaining');
    const mainPace = document.getElementById('daily-target-pace');
    const simpleRemaining = document.getElementById('simple-daily-target-remaining');
    const simplePace = document.getElementById('simple-daily-target-pace');
    if (mainRemaining && simpleRemaining) simpleRemaining.textContent = mainRemaining.textContent;
    if (mainPace && simplePace) {
      simplePace.textContent = mainPace.textContent;
      simplePace.className = 'simple-daily-target-pace neutral';
    }
  }

  function refresh() {
    refreshMain();
    syncSimple();
  }

  function initialise() {
    refresh();
    const observer = new MutationObserver(refresh);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    setInterval(refresh, 30000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, { once: true });
  else initialise();
})();
