/* Watch Auth Pro — RMA inspection wording refinement
   Version 2.60.2 — 18 August 2026
   RMA notes record workshop findings, not customer-reported symptoms.
*/
if (typeof DATABASE_META !== 'undefined') {
  DATABASE_META.version = '2.60.2';
  DATABASE_META.updated = '18 August 2026';
  DATABASE_META.scope = 'RMA quick-add wording changed from customer-reported symptoms to inspection findings.';
}

(() => {
  const FINDINGS = new Map([
    ['Watch stopped', 'Watch stopped during inspection.'],
    ['Intermittent stopping', 'Intermittent stopping observed during inspection.'],
    ['Running slow', 'Watch found to be running slow during inspection.'],
    ['Running fast', 'Watch found to be running fast during inspection.'],
    ['Low power reserve', 'Reduced power reserve confirmed during inspection.'],
    ['Winding issue', 'Winding fault identified during inspection.'],
    ['Crown issue', 'Crown / setting fault identified during inspection.'],
    ['Date / day issue', 'Date / day change fault identified during inspection.'],
    ['Chronograph issue', 'Chronograph function / reset fault identified during inspection.'],
    ['Quartz stopped', 'Quartz watch found stopped during inspection.'],
    ['Bezel issue', 'Bezel fault identified during inspection.'],
    ['Bracelet / clasp', 'Bracelet / clasp fault identified during inspection.'],
    ['Water ingress', 'Evidence of water ingress found during inspection.'],
    ['Condensation', 'Condensation observed under the crystal during inspection.'],
    ['Cosmetic damage', 'Cosmetic damage noted during inspection.'],
    ['Same fault returned', 'Previous fault confirmed again during return inspection.'],
    ['New fault after repair', 'New fault identified during return inspection following previous repair / service.'],
    ['No fault found', 'No fault found during inspection.'],
    ['Further inspection', 'Further inspection / diagnosis required.']
  ]);

  function updateButtons() {
    const panel = document.getElementById('tab-rma-content');
    if (!panel) return false;
    panel.querySelectorAll('.rma-quick').forEach(btn => {
      const finding = FINDINGS.get((btn.textContent || '').trim());
      if (finding) btn.dataset.bullet = finding;
    });
    const note = document.getElementById('rma-note');
    if (note) note.placeholder = 'Quick-add inspection findings will appear here. Edit the wording freely.';
    const desc = panel.querySelector('.panel-description');
    if (desc) desc.textContent = 'Build a concise note from what is found during the return inspection. Job and watch details are already held on the return record.';
    return true;
  }

  function initialise() {
    if (updateButtons()) return;
    const observer = new MutationObserver(() => {
      if (updateButtons()) observer.disconnect();
    });
    observer.observe(document.body, {childList:true, subtree:true});
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialise, {once:true});
  else initialise();
})();
