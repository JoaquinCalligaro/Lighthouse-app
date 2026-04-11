const { ipcRenderer } = require('electron');

// ── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score >= 90)
    return {
      bg: '#d1fae5',
      border: '#6ee7b7',
      text: '#059669',
      ring: '#10b981',
    };
  if (score >= 50)
    return {
      bg: '#fef3c7',
      border: '#fcd34d',
      text: '#d97706',
      ring: '#f59e0b',
    };
  return { bg: '#fee2e2', border: '#fca5a5', text: '#dc2626', ring: '#ef4444' };
}

function scoreLabel(score) {
  if (score >= 90) return 'Bueno';
  if (score >= 50) return 'Necesita mejora';
  return 'Deficiente';
}

function metricRow(label, audit, highlight) {
  if (!audit) return '';
  const val = audit.displayValue || '–';
  const s = audit.score;
  const color =
    s === null
      ? '#64748b'
      : s >= 0.9
        ? '#059669'
        : s >= 0.5
          ? '#d97706'
          : '#dc2626';
  return `
    <tr style="border-bottom:1px solid #e2e8f0;${highlight ? 'background:#f8fafc;' : ''}">
      <td style="padding:8px 12px;font-size:13px;color:#334155;">${label}</td>
      <td style="padding:8px 12px;font-size:13px;font-weight:600;color:${color};text-align:right;">${val}</td>
    </tr>`;
}

function gaugeCircle(score, color) {
  const r = 36,
    cx = 44,
    cy = 44;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  return `
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e2e8f0" stroke-width="6"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color.ring}"
        stroke-width="6" stroke-linecap="round"
        stroke-dasharray="${filled} ${circ}"
        transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy}" dominant-baseline="middle" text-anchor="middle"
        font-size="18" font-weight="800" fill="#1e293b">${score}</text>
    </svg>`;
}

// ── Main builder ─────────────────────────────────────────────────────────────

function buildReportHtml(lhr) {
  const url = lhr.finalDisplayedUrl || '–';
  const date = new Date(lhr.fetchTime).toLocaleString('es-AR');
  const cats = lhr.categories || {};
  const audits = lhr.audits || {};

  // Score cards
  const categoryCards = Object.values(cats)
    .map((cat) => {
      const score = Math.round((cat.score || 0) * 100);
      const c = scoreColor(score);
      return `
      <div style="flex:1;min-width:120px;border-radius:16px;border:2px solid ${c.border};
                  background:${c.bg};padding:20px 12px;display:flex;flex-direction:column;
                  align-items:center;gap:8px;">
        ${gaugeCircle(score, c)}
        <p style="margin:0;font-size:12px;font-weight:700;color:#334155;text-align:center;line-height:1.3;">${cat.title}</p>
        <span style="background:#fff;border:1px solid ${c.border};color:${c.text};
                     font-size:10px;font-weight:600;padding:2px 8px;border-radius:99px;">${scoreLabel(score)}</span>
      </div>`;
    })
    .join('');

  // Performance metrics
  const metrics = [
    ['Primera Pintura con Contenido (FCP)', audits['first-contentful-paint'], false],
    ['Pintura del Contenido Más Grande (LCP)', audits['largest-contentful-paint'], true],
    ['Tiempo Total de Bloqueo (TBT)', audits['total-blocking-time'], false],
    ['Desplazamiento Acumulativo del Diseño (CLS)', audits['cumulative-layout-shift'], true],
    ['Índice de Velocidad', audits['speed-index'], false],
    ['Tiempo hasta Interactivo (TTI)', audits['interactive'], true],
  ]
    .map(([l, a, h]) => metricRow(l, a, h))
    .join('');

  // Top opportunities
  const opportunities = Object.values(audits)
    .filter(
      (a) =>
        a.details?.type === 'opportunity' &&
        a.score !== null &&
        a.score < 1 &&
        a.details?.overallSavingsMs > 100,
    )
    .sort(
      (a, b) =>
        (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0),
    )
    .slice(0, 5)
    .map((a) => {
      const savings = a.details?.overallSavingsMs
        ? `~${(a.details.overallSavingsMs / 1000).toFixed(1)}s ahorrados`
        : '';
      return `<li style="margin:6px 0;font-size:13px;color:#334155;">
        <strong style="color:#1e293b;">${a.title}</strong>
        ${savings ? `<span style="color:#6366f1;font-size:11px;margin-left:6px;">${savings}</span>` : ''}
        ${a.description ? `<div style="color:#64748b;font-size:11px;margin-top:2px;">${a.description.split('.')[0]}.</div>` : ''}
      </li>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Informe Lighthouse – ${url}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
           background: #f8fafc; color: #1e293b; padding: 0; }
    .page { max-width: 800px; margin: 0 auto; padding: 32px 24px; }
    .header { background: linear-gradient(135deg,#1e40af 0%,#4f46e5 100%);
              border-radius: 16px; padding: 28px 32px; color: #fff; margin-bottom: 28px;
              display: flex; align-items: center; gap: 20px; }
    .header-text h1 { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .header-text p  { font-size: 13px; opacity: 0.8; margin-top: 4px; }
    .header-meta    { margin-top: 12px; display:flex; gap: 20px; flex-wrap:wrap; }
    .header-meta span { font-size: 12px; background: rgba(255,255,255,0.15);
                        padding: 4px 10px; border-radius: 8px; }
    .section        { background: #fff; border-radius: 14px; border: 1px solid #e2e8f0;
                      padding: 22px 24px; margin-bottom: 20px; }
    .section-title  { font-size: 14px; font-weight: 700; color: #475569;
                      text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; }
    .scores-flex    { display: flex; gap: 12px; flex-wrap: wrap; }
    table           { width: 100%; border-collapse: collapse; }
    th              { background: #f1f5f9; padding: 8px 12px; font-size: 12px;
                      font-weight: 600; color: #64748b; text-align: left; }
    th:last-child   { text-align: right; }
    footer          { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 24px; }
    footer a        { color: #6366f1; text-decoration: none; }
    @media print    { body { background: #fff; } .page { padding: 16px; } }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div class="header">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0">
      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>
    <div class="header-text" style="flex:1">
      <h1>Informe de Auditoría Lighthouse</h1>
      <p>Análisis automatizado de rendimiento y calidad</p>
      <div class="header-meta">
        <span>🌐 ${url}</span>
        <span>📅 ${date}</span>
      </div>
    </div>
  </div>

  <!-- Scores -->
  <div class="section">
    <p class="section-title">Puntuaciones por Categoría</p>
    <div class="scores-flex">${categoryCards}</div>
  </div>

  ${
    metrics
      ? `
  <!-- Performance Metrics -->
  <div class="section">
    <p class="section-title">Métricas Principales de Rendimiento</p>
    <table>
      <thead><tr><th>Métrica</th><th>Valor</th></tr></thead>
      <tbody>${metrics}</tbody>
    </table>
  </div>`
      : ''
  }

  ${
    opportunities
      ? `
  <!-- Opportunities -->
  <div class="section">
    <p class="section-title">Principales Oportunidades de Mejora</p>
    <ul style="padding-left:18px;list-style:disc;">${opportunities}</ul>
  </div>`
      : ''
  }

  <footer>
    Generado por <strong>Herramienta de Auditoría Lighthouse</strong> · Desarrollado con
    <a href="https://github.com/GoogleChrome/lighthouse">Google Lighthouse</a> ·
    <a href="https://github.com/midudev/tailwind-animations">tailwind-animations</a>
  </footer>
</div>
</body>
</html>`;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

function usePdfReport() {
  async function download(lhr) {
    const html = buildReportHtml(lhr);

    // Build filename: YYYY-MM-DD-hostname-report.pdf
    const dateStr = new Date(lhr.fetchTime).toISOString().slice(0, 10);
    let pageSlug = 'page';
    try {
      pageSlug = new URL(lhr.finalDisplayedUrl).hostname.replace(/\./g, '-');
    } catch (_) {
      /* fallback */
    }
    const filename = `${dateStr}-${pageSlug}-report.pdf`;

    const result = await ipcRenderer.invoke('save-pdf', { html, filename });
    return result;
  }

  return { download };
}

module.exports = { usePdfReport };
