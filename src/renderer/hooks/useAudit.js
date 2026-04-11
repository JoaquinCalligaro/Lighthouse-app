const { ipcRenderer } = require('electron');

// ── Funciones auxiliares de puntuación ──────────────────────────────────────────
function scoreTheme(score) {
  if (score >= 90)
    return {
      stroke: '#10b981',
      ring: 'ring-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700',
      label: 'Bueno',
    };
  if (score >= 50)
    return {
      stroke: '#f59e0b',
      ring: 'ring-amber-200',
      badge: 'bg-amber-50 text-amber-700',
      label: 'Necesita mejora',
    };
  return {
    stroke: '#ef4444',
    ring: 'ring-red-200',
    badge: 'bg-red-50 text-red-700',
    label: 'Deficiente',
  };
}

function buildScoreCard(title, score) {
  const theme = scoreTheme(score);
  const filled = score;
  const empty = 100 - score;

  const card = document.createElement('div');
  card.className =
    `score-card bg-white rounded-2xl shadow-sm border border-slate-100 p-5 ` +
    `flex flex-col items-center gap-3 ring-2 transition-colors duration-300 ${theme.ring}`;

  card.innerHTML = `
    <div class="relative w-20 h-20">
      <svg class="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
        <circle
          class="gauge-ring"
          cx="18" cy="18" r="15.9"
          fill="none"
          stroke="${theme.stroke}"
          stroke-width="2.5"
          stroke-dasharray="0 100"
          stroke-linecap="round"
          data-filled="${filled}"
          data-empty="${empty}"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-slate-800">
        ${score}
      </div>
    </div>
    <p class="text-slate-700 font-semibold text-sm text-center leading-tight">${title}</p>
    <span class="px-3 py-1 rounded-full text-xs font-semibold ${theme.badge}">${theme.label}</span>
  `;

  return card;
}

function animateGauges() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.gauge-ring').forEach((circle) => {
      circle.setAttribute(
        'stroke-dasharray',
        `${circle.dataset.filled} ${circle.dataset.empty}`,
      );
    });
  });
}

// ── Títulos de auditoría traducidos al español ───────────────────────────
const AUDIT_TITLES_ES = {
  'render-blocking-resources':   'Eliminar recursos que bloquean el renderizado',
  'unused-css-rules':            'Reducir CSS sin usar',
  'unused-javascript':           'Reducir JavaScript sin usar',
  'uses-optimized-images':       'Optimizar imágenes',
  'uses-webp-images':            'Usar formatos de imagen modernos (WebP/AVIF)',
  'uses-responsive-images':      'Imágenes con tamaño adecuado',
  'offscreen-images':            'Diferir la carga de imágenes fuera de pantalla',
  'efficient-animated-content':  'Usar formatos de video en lugar de GIFs animados',
  'uses-text-compression':       'Comprimir texto (gzip/brotli)',
  'uses-rel-preconnect':         'Preconectar a orígenes requeridos',
  'server-response-time':        'Reducir el tiempo de respuesta inicial del servidor',
  'redirects':                   'Evitar redirecciones múltiples',
  'uses-http2':                  'Servir recursos vía HTTP/2',
  'total-byte-weight':           'Reducir el peso total de la página',
  'dom-size':                    'Reducir el tamaño del DOM',
  'bootup-time':                 'Reducir el tiempo de ejecución de JavaScript',
  'mainthread-work-breakdown':   'Minimizar el trabajo en el hilo principal',
  'third-party-summary':         'Reducir el impacto de código de terceros',
  'duplicated-javascript':       'Eliminar módulos JavaScript duplicados',
  'legacy-javascript':           'Evitar servir JavaScript obsoleto a navegadores modernos',
};

function buildImprovementsPanel(lhr) {
  const panel = document.getElementById('improvements-panel');
  const list  = document.getElementById('improvements-list');
  if (!panel || !list) return;

  const audits = lhr.audits || {};

  const items = Object.values(audits)
    .filter(
      (a) =>
        a.details?.type === 'opportunity' &&
        a.score !== null &&
        a.score < 1 &&
        (a.details?.overallSavingsMs || 0) > 50,
    )
    .sort(
      (a, b) =>
        (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0),
    )
    .slice(0, 6);

  if (items.length === 0) {
    list.innerHTML = `
      <li class="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
        </svg>
        ¡Sin oportunidades críticas detectadas!
      </li>`;
    panel.classList.remove('hidden');
    return;
  }

  list.innerHTML = items
    .map((a) => {
      const title   = AUDIT_TITLES_ES[a.id] || a.title;
      const savings = a.details?.overallSavingsMs
        ? `~${(a.details.overallSavingsMs / 1000).toFixed(1)} s`
        : null;
      const dot =
        a.score >= 0.5
          ? 'bg-amber-400'
          : 'bg-red-400';
      return `
        <li class="flex items-center gap-3 px-5 py-3">
          <span class="w-2 h-2 rounded-full flex-shrink-0 ${dot}"></span>
          <span class="text-sm text-slate-700 dark:text-slate-200 flex-1 leading-snug">${title}</span>
          ${savings ? `<span class="text-xs font-semibold text-indigo-500 dark:text-indigo-400 whitespace-nowrap">${savings}</span>` : ''}
        </li>`;
    })
    .join('');

  panel.classList.remove('hidden');
}

// ── Hook useAudit ─────────────────────────────────────────────────────────
function useAudit(progressHook, logHook, pdfHook) {
  let _lastLhr = null;

  async function run(url, chromePath) {
    const grid = document.getElementById('scores-grid');
    const resultUrl = document.getElementById('result-url');
    const wrapper = document.getElementById('result-wrapper');
    const errorDiv = document.getElementById('error');
    const errorText = document.getElementById('error-text');
    const btn = document.getElementById('run-btn');
    const btnText = document.getElementById('run-btn-text');
    const runIcon = document.getElementById('run-icon');
    const spinner = document.getElementById('run-spinner');

    // Reiniciar UI
    _lastLhr = null;
    grid.innerHTML = '';
    wrapper.classList.add('hidden');
    errorDiv.classList.add('hidden');
    errorDiv.classList.remove('flex');
    // Reiniciar panel de mejoras
    const prevPanel = document.getElementById('improvements-panel');
    if (prevPanel) prevPanel.classList.add('hidden');
    btn.disabled = true;
    btnText.textContent = 'Auditando…';
    runIcon.classList.add('hidden');
    spinner.classList.remove('hidden');

    logHook?.clear();
    logHook?.show();
    logHook?.add(`Conectando a ${url}`, 'loader');

    progressHook.reset();
    progressHook.show();

    try {
      const lhr = await ipcRenderer.invoke('run-audit', { url, chromePath });
      _lastLhr = lhr;

      logHook?.add('Procesando resultados…', 'loader');

      Object.values(lhr.categories).forEach((cat) => {
        grid.appendChild(
          buildScoreCard(cat.title, Math.round((cat.score || 0) * 100)),
        );
      });

      resultUrl.textContent = lhr.finalDisplayedUrl || url;
      wrapper.classList.remove('hidden');
      wrapper.classList.add('animate-blurred-fade-in');
      animateGauges();
      buildImprovementsPanel(lhr);

      logHook?.add(
        `Resultados listos para ${lhr.finalDisplayedUrl || url}`,
        'success',
      );
    } catch (err) {
      errorText.textContent = err.message || String(err);
      errorDiv.classList.remove('hidden');
      errorDiv.classList.add('flex');
      progressHook.update({ percent: 0, message: 'Auditoría fallida' });
      logHook?.add('Auditoría fallida: ' + (err.message || ''), 'error');
    } finally {
      btn.disabled = false;
      btnText.textContent = 'Iniciar Auditoría';
      runIcon.classList.remove('hidden');
      spinner.classList.add('hidden');
    }
  }

  async function downloadPdf() {
    if (!_lastLhr || !pdfHook) return;
    const pdfBtn = document.getElementById('pdf-btn');
    if (pdfBtn) {
      pdfBtn.disabled = true;
      pdfBtn.textContent = 'Generando PDF…';
    }
    try {
      logHook?.add('Generando informe PDF…', 'loader');
      const result = await pdfHook.download(_lastLhr);
      if (result?.success) {
        logHook?.add('PDF guardado ✓', 'success');
      }
    } catch (e) {
      logHook?.add('Error al exportar PDF: ' + e.message, 'error');
    } finally {
      if (pdfBtn) {
        pdfBtn.disabled = false;
        pdfBtn.textContent = 'Descargar Informe PDF';
      }
    }
  }

  return { run, downloadPdf };
}

module.exports = { useAudit };
