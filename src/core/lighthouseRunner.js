// lighthouse v12 se distribuye como ESM compilado a CJS – el runner está en .default
const { default: lighthouse } = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

// Etapas de progreso que se corresponden con las fases reales de Lighthouse
const PROGRESS_STAGES = [
  { percent: 25, message: 'Connecting to page...' },
  { percent: 40, message: 'Loading page...' },
  { percent: 55, message: 'Gathering data...' },
  { percent: 70, message: 'Running performance audits...' },
  { percent: 82, message: 'Running accessibility & SEO audits...' },
  { percent: 90, message: 'Generating report...' },
];

// Intervalo entre avances de etapa (ms). Lighthouse suele tardar 15-30 s;
// con 6 etapas de 3000 ms se cubren ~18 s antes de finalizar.
const STAGE_INTERVAL_MS = 3000;

/**
 * Cierra la instancia de Chrome de forma segura.
 * En Windows, chrome-launcher puede lanzar EPERM al limpiar el directorio
 * temporal porque Lighthouse aún mantiene un handle abierto en ese momento.
 * Se suprime ese error específico — el proceso termina de todas formas.
 */
async function safeKill(chrome) {
  try {
    await chrome.kill();
  } catch (err) {
    if (err.code !== 'EPERM') throw err;
    // EPERM al limpiar el directorio temporal es inofensivo; se ignora.
  }
}

async function runLighthouse(url, chromePath, onProgress) {
  onProgress({ percent: 5, message: 'Launching browser...' });

  const chrome = await chromeLauncher.launch({
    chromePath,
    // --no-sandbox required inside Electron's renderer-spawned processes on Windows
    // --no-sandbox es requerido dentro de los procesos spawneados por Electron en Windows
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  onProgress({ percent: 15, message: 'Browser launched' });

  let stageIndex = 0;
  let finished = false;

  const stageTimer = setInterval(() => {
    if (finished || stageIndex >= PROGRESS_STAGES.length) {
      clearInterval(stageTimer);
      return;
    }
    onProgress(PROGRESS_STAGES[stageIndex++]);
  }, STAGE_INTERVAL_MS);

  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
    });

    clearInterval(stageTimer);
    finished = true;
    onProgress({ percent: 100, message: 'Completado!' });

    await safeKill(chrome);
    return result.lhr;
  } catch (err) {
    clearInterval(stageTimer);
    finished = true;
    await safeKill(chrome);
    throw err;
  }
}

module.exports = { runLighthouse };
