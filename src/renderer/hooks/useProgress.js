/**
 * useProgress – manages the visual progress bar and label.
 * DOM elements are looked up lazily so timing of initialization doesn't matter.
 */
function useProgress() {
  const STAGES = [
    'Iniciando navegador...',
    'Browser launched',
    'Conectando a la página...',
    'Cargando página...',
    'Recopilando datos...',
    'Ejecutando auditorías de rendimiento...',
    'Ejecutando auditorías de accesibilidad y SEO...',
    'Generando informe...',
  ];

  function getEls() {
    return {
      wrapper: document.getElementById('progress'),
      bar: document.getElementById('bar'),
      label: document.getElementById('progress-label'),
      pct: document.getElementById('progress-pct'),
      dotsEl: document.getElementById('stage-dots'),
    };
  }

  // Build the 8 stage dots once
  function buildDots() {
    const { dotsEl } = getEls();
    if (!dotsEl || dotsEl.children.length) return;
    STAGES.forEach(() => {
      const d = document.createElement('div');
      d.className = 'stage-dot';
      dotsEl.appendChild(d);
    });
  }

  function updateDots(message) {
    const { dotsEl } = getEls();
    if (!dotsEl) return;
    const idx = STAGES.indexOf(message);
    Array.from(dotsEl.children).forEach((dot, i) => {
      dot.className = 'stage-dot';
      if (i < idx) dot.classList.add('done');
      else if (i === idx) dot.classList.add('active');
    });
  }

  function show() {
    buildDots();
    getEls().wrapper.classList.remove('hidden');
  }

  function hide() {
    getEls().wrapper.classList.add('hidden');
  }

  function update({ percent, message }) {
    const { bar, label, pct } = getEls();
    bar.style.width = percent + '%';
    if (label) label.textContent = message || '';
    if (pct) pct.textContent = percent + '%';
    if (message) updateDots(message);
  }

  function reset() {
    const { bar, label, pct, dotsEl } = getEls();
    bar.style.width = '0%';
    if (label) label.textContent = 'Preparando...';
    if (pct) pct.textContent = '0%';
    if (dotsEl) {
      Array.from(dotsEl.children).forEach((d) => {
        d.className = 'stage-dot';
      });
    }
  }

  return { show, hide, update, reset };
}

module.exports = { useProgress };
