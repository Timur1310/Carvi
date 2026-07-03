/* CarBattle — theme switcher (light <-> racing), persisted in localStorage.
   Loaded synchronously in <head> so data-theme is set before first paint. */
(function () {
  try {
    var t = localStorage.getItem('cbTheme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

function cbThemeIcon(t) { return t === 'racing' ? '🏁' : '☀️'; }

function cbSetTheme(t) {
  try { localStorage.setItem('cbTheme', t); } catch (e) {}
  document.documentElement.setAttribute('data-theme', t);
  var b = document.getElementById('themeBtn');
  if (b) b.textContent = cbThemeIcon(t);
}

function cbCycleTheme() {
  var cur = document.documentElement.getAttribute('data-theme') || 'light';
  cbSetTheme(cur === 'racing' ? 'light' : 'racing');
}

document.addEventListener('DOMContentLoaded', function () {
  var b = document.getElementById('themeBtn');
  if (b) b.textContent = cbThemeIcon(document.documentElement.getAttribute('data-theme') || 'light');
});
