(() => {
  'use strict';

  const featureFiles = [
    'features/movement-technology-reminder-core-v2651.js',
    'features/daily-work-dashboard-compact-v2693.js'
  ];

  featureFiles.forEach(src => {
    if ([...document.scripts].some(script => script.src && script.src.endsWith(src))) return;
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
  });
})();
