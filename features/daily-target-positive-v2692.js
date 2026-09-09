/* Watch Auth Pro — positive daily target language
   Version 2.69.2 — 9 September 2026
   Keeps the target useful while avoiding punitive performance language.
*/
(() => {
  function soften() {
    const pace = document.getElementById('daily-target-pace');
    const remaining = document.getElementById('daily-target-remaining');
    if (!pace || !remaining) return;

    const completed = Number.parseInt(document.getElementById('daily-target-completed')?.textContent || '0', 10) || 0;
    const target = Number.parseInt((document.getElementById('daily-target-of')?.textContent || '').replace(/\D/g, ''), 10) || 50;
    const percentage = target > 0 ? Math.round((completed / target) * 100) : 0;
    const raw = String(pace.textContent || '').trim();

    remaining.textContent = `${percentage}% complete`;

    if (/target reached/i.test(raw)) {
      pace.textContent = 'Target complete';
      pace.className = 'daily-target-pace ahead';
    } else if (/ahead/i.test(raw)) {
      pace.textContent = 'Great pace';
      pace.className = 'daily-target-pace ahead';
    } else if (/on pace/i.test(raw)) {
      pace.textContent = 'Right on track';
      pace.className = 'daily-target-pace on';
    } else if (/behind|short of target/i.test(raw)) {
      pace.textContent = 'Keep building';
      pace.className = 'daily-target-pace on';
    } else if (/workday starts/i.test(raw)) {
      pace.textContent = 'Ready for today';
      pace.className = 'daily-target-pace neutral';
    }
  }

  function syncSimple() {
    const mainRemaining = document.getElementById('daily-target-remaining');
    const mainPace = document.getElementById('daily-target-pace');
    const simpleRemaining = document.getElementById('simple-daily-target-remaining');
    const simplePace = document.getElementById('simple-daily-target-pace');
    if (mainRemaining && simpleRemaining) simpleRemaining.textContent = mainRemaining.textContent;
    if (mainPace && simplePace) {
      simplePace.textContent = mainPace.textContent;
      const tone = mainPace.className.split(' ').find(c => ['ahead','on','neutral'].includes(c)) || 'neutral';
      simplePace.className = `simple-daily-target-pace ${tone}`;
    }
  }

  function refresh() {
    soften();
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
