const { ipcRenderer } = require('electron');
const { useProgress } = require('./hooks/useProgress');
const { useBrowsers } = require('./hooks/useBrowsers');
const { useAudit } = require('./hooks/useAudit');
const { useLog } = require('./hooks/useLog');
const { usePdfReport } = require('./hooks/usePdfReport');
const { useDarkMode } = require('./hooks/useDarkMode');

// Initialize hooks
const darkMode = useDarkMode();
const progress = useProgress();
const browsers = useBrowsers();
const log = useLog();
const pdfReport = usePdfReport();
const audit = useAudit(progress, log, pdfReport);

// Forward real-time progress updates from the main process to the bar + log
ipcRenderer.on('audit-progress', (event, data) => {
  progress.update(data);
  if (data.message && data.message !== 'Browser launched')
    log.add(data.message, 'loader');
  if (data.percent === 100) log.add('Auditoría completada', 'success');
});

// Exposed globally so the button's onclick can reach it
window.startAudit = async function () {
  let url = document.getElementById('url').value.trim();
  const chromePath = document.getElementById('browsers').value;

  if (!url) {
    alert('Por favor ingresá una URL');
    return;
  }
  if (!chromePath) {
    alert(
      'No se encontró ningún navegador. Usá "Usar otro navegador" para indicar la ruta manualmente.',
    );
    return;
  }

  // Normalize: prepend https:// if the user omitted the scheme
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  await audit.run(url, chromePath);
};

// PDF download exposed globally
window.downloadPdf = () => audit.downloadPdf();

// Dark mode toggle exposed globally
window.toggleTheme = () => darkMode.toggle();

// Init: hide progress bar, hide log, populate browser list, sync theme button
async function init() {
  darkMode.init();
  progress.hide();
  log.hide();
  await browsers.load();
}

init();
