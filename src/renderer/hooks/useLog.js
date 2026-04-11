/**
 * useLog – manages the small activity log panel below the progress bar.
 * Keeps a rolling window of MAX_ENTRIES entries with timestamps.
 */
function useLog() {
  const MAX_ENTRIES = 7;
  const entries = [];

  const icons = {
    info: '<span class="text-blue-400">›</span>',
    success: '<span class="text-emerald-500">✓</span>',
    error: '<span class="text-red-400">✗</span>',
    loader: '<span class="text-indigo-400 animate-pulsing">◉</span>',
  };

  function getEl() {
    return document.getElementById('audit-log');
  }

  function _render() {
    const el = getEl();
    if (!el) return;
    el.innerHTML = entries
      .map(
        (e) =>
          `<div class="log-entry flex items-start gap-2 py-0.5 animate-fade-in">
             <span class="flex-shrink-0 w-4 text-center leading-none mt-px">${icons[e.type]}</span>
             <span class="text-slate-400 tabular-nums whitespace-nowrap">${e.time}</span>
             <span class="text-slate-300 leading-snug">${e.message}</span>
           </div>`,
      )
      .join('');
    el.scrollTop = el.scrollHeight;
  }

  function add(message, type = 'info') {
    if (!message) return;
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    entries.push({ message, type, time });
    if (entries.length > MAX_ENTRIES) entries.shift();
    _render();
  }

  function clear() {
    entries.length = 0;
    const el = getEl();
    if (el) el.innerHTML = '';
  }

  function show() {
    getEl()?.classList.remove('hidden');
  }

  function hide() {
    getEl()?.classList.add('hidden');
  }

  return { add, clear, show, hide };
}

module.exports = { useLog };
