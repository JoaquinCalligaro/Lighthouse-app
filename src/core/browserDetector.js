const fs = require('fs');
const os = require('os');

const home = os.homedir();

/**
 * Cada entrada de navegador lista rutas candidatas por plataforma.
 * Gana la primera ruta que exista.
 */
const BROWSER_DEFINITIONS = [
  {
    name: 'Chrome',
    icon: 'chrome',
    paths: {
      win32: [
        `${home}\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe`,
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      ],
      darwin: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
      linux: [
        '/usr/bin/google-chrome',
        '/usr/bin/google-chrome-stable',
        '/usr/bin/chromium-browser',
      ],
    },
  },
  {
    name: 'Brave',
    icon: 'brave',
    paths: {
      win32: [
        `${home}\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe`,
        'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
      ],
      darwin: ['/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'],
      linux: ['/usr/bin/brave-browser', '/usr/bin/brave'],
    },
  },
  {
    name: 'Edge',
    icon: 'edge',
    paths: {
      win32: [
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        `${home}\\AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe`,
      ],
      darwin: [
        '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      ],
      linux: ['/usr/bin/microsoft-edge', '/usr/bin/microsoft-edge-stable'],
    },
  },
  {
    name: 'Opera',
    icon: 'opera',
    paths: {
      win32: [
        `${home}\\AppData\\Local\\Programs\\Opera\\launcher.exe`,
        'C:\\Program Files\\Opera\\launcher.exe',
        'C:\\Program Files (x86)\\Opera\\launcher.exe',
      ],
      darwin: ['/Applications/Opera.app/Contents/MacOS/Opera'],
      linux: ['/usr/bin/opera'],
    },
  },
];

/**
 * Devuelve la lista de navegadores detectados en la plataforma actual.
 * Cada entrada: { name, path, icon }
 */
function detectBrowsers() {
  const platform = process.platform;
  const found = [];

  for (const browser of BROWSER_DEFINITIONS) {
    const candidates = browser.paths[platform] || [];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        found.push({ name: browser.name, path: candidate, icon: browser.icon });
        break; // el primer match gana para este navegador
      }
    }
  }

  return found;
}

module.exports = { detectBrowsers };
