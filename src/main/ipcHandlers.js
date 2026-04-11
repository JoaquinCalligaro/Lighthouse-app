const { ipcMain, dialog } = require('electron');
const { detectBrowsers } = require('../core/browserDetector');
const { runLighthouse } = require('../core/lighthouseRunner');
const { registerPdfHandler } = require('./pdfExporter');

function registerIpcHandlers(getMainWindow) {
  registerPdfHandler();

  ipcMain.handle('get-browsers', async () => {
    return detectBrowsers();
  });

  /**
   * Abre el selector de archivos nativo del SO para que el usuario localice
   * cualquier ejecutable de navegador manualmente (.exe, acceso directo .lnk,
   * o .app en macOS).
   * Devuelve la ruta elegida, o null si se canceló el diálogo.
   */
  ipcMain.handle('select-browser-path', async () => {
    const win = getMainWindow();
    const extensions =
      process.platform === 'win32'
        ? ['exe', 'lnk']
        : process.platform === 'darwin'
          ? ['app']
          : ['*'];

    const result = await dialog.showOpenDialog(win, {
      title: 'Seleccionar ejecutable del navegador',
      buttonLabel: 'Usar este navegador',
      properties: ['openFile'],
      filters: [{ name: 'Navegador', extensions }],
    });

    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
  });

  ipcMain.handle('run-audit', async (event, { url, chromePath }) => {
    const win = getMainWindow();
    return runLighthouse(url, chromePath, (progress) => {
      if (win && !win.isDestroyed()) {
        win.webContents.send('audit-progress', progress);
      }
    });
  });
}

module.exports = { registerIpcHandlers };
