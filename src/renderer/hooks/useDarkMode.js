// ── useDarkMode hook ─────────────────────────────────────────────────────────
// Toggles the `dark` class on <html> so Tailwind's dark: variants activate.
// Persists the user's choice in localStorage and respects system preference
// on first load.  The smooth transition is handled by `transition-colors
// duration-300` classes added to the layout elements in ui.html.

function useDarkMode() {
  const KEY = 'lh-theme';
  const html = document.documentElement;

  // ── Restore preference ────────────────────────────────────────────────────
  const saved = localStorage.getItem(KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = saved ? saved === 'dark' : prefersDark;
  if (startDark) html.classList.add('dark');

  // ── Internal: sync button icons ───────────────────────────────────────────
  function _syncButton() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    const isDark = html.classList.contains('dark');
    const moon = btn.querySelector('.icon-moon');
    const sun = btn.querySelector('.icon-sun');
    moon?.classList.toggle('hidden', isDark);
    sun?.classList.toggle('hidden', !isDark);
  }

  // ── Public API ────────────────────────────────────────────────────────────
  function toggle() {
    const isDark = html.classList.toggle('dark');
    localStorage.setItem(KEY, isDark ? 'dark' : 'light');
    _syncButton();
  }

  /** Call after the DOM is ready so the button icons reflect the initial state */
  function init() {
    _syncButton();
  }

  return { toggle, init };
}

module.exports = { useDarkMode };
