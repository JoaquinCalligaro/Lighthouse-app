const { ipcMain, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

function registerPdfHandler() {
  ipcMain.handle('save-pdf', async (event, payload) => {
    // Acepta tanto el string heredado como el nuevo objeto { html, filename }
    const html = typeof payload === 'string' ? payload : payload.html;
    const filename =
      typeof payload === 'object' && payload.filename
        ? payload.filename
        : 'lighthouse-report.pdf';

    // Se codifica en base64 para evitar límites de longitud en data-URLs con HTML complejo
    const dataUrl =
      'data:text/html;charset=utf-8;base64,' +
      Buffer.from(html, 'utf-8').toString('base64');

    // Ventana oculta fuera de pantalla para renderizar el informe
    const win = new BrowserWindow({
      show: false,
      width: 900,
      height: 1200,
      webPreferences: { nodeIntegration: false, contextIsolation: true },
    });

    await win.loadURL(dataUrl);

    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      marginsType: 1, // márgenes por defecto
    });

    win.close();

    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Save Lighthouse Report',
      defaultPath: filename,
      filters: [{ name: 'PDF Document', extensions: ['pdf'] }],
    });

    if (canceled || !filePath) return { success: false };

    fs.writeFileSync(filePath, pdfBuffer);
    return { success: true, filePath };
  });
}

module.exports = { registerPdfHandler };
