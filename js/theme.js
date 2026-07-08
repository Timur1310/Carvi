/* Carvi — single light (cream editorial) theme. Dark theme removed 2026-07-08. */
document.documentElement.setAttribute('data-theme', 'light');
try { localStorage.removeItem('cbTheme'); } catch (e) {}
function cbCycleTheme() {} /* kept as a no-op for any cached pages */
