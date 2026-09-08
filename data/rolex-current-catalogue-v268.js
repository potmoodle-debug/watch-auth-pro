/* Watch Auth Pro v2.68.0 — additive official Rolex catalogue refresh
   Checked 8 September 2026 against Rolex UK current-model pages.
*/
(function () {
  const existing = Array.isArray(window.ROLEX_CURRENT_CATALOGUE) ? window.ROLEX_CURRENT_CATALOGUE : [];
  const additions = [
    ["126680","m126680-0001","Yacht-Master II","Yacht-Master II","Oyster, 44 mm, Oystersteel",44,"Oystersteel","Bidirectional rotatable bezel; blue Cerachrom insert","Programmable countdown; chronograph; no date","Oyster","white","Light dial","Index","https://www.rolex.com/en-gb/watches/yacht-master-ii/m126680-0001"],
    ["126688","m126688-0001","Yacht-Master II","Yacht-Master II","Oyster, 44 mm, 18 ct yellow gold",44,"Yellow gold","Bidirectional rotatable bezel; blue Cerachrom insert","Programmable countdown; chronograph; no date","Oyster","white","Light dial","Index","https://www.rolex.com/en-gb/watches/yacht-master-ii/m126688-0001"]
  ];
  const seen = new Set(existing.map(row => String(row && row[1] || '').toUpperCase()));
  window.ROLEX_CURRENT_CATALOGUE = Object.freeze(existing.concat(additions.filter(row => !seen.has(String(row[1]).toUpperCase()))));
  window.ROLEX_CURRENT_CATALOGUE_META = Object.freeze({
    checked:'2026-09-08',
    source:'https://www.rolex.com/en-gb/watches/new-watches/all-models',
    baseSnapshot:'v2.61.0 checked 2026-08-18',
    scope:'Additive verified 2026 refresh; includes new-generation Yacht-Master II refs 126680 and 126688'
  });
})();
