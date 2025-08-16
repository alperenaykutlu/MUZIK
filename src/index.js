const { app, BrowserWindow ,ipcMain, dialog} = require('electron');
const path = require('node:path');

if (require('electron-squirrel-startup')) {
  app.quit();
}

ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['add-btn'],
    filters: [
      { name: 'Audio Files', extensions: ['mp3', 'wav', 'flac'] }
    ]
  });
  return result.filePaths;
});

const createWindow = () => {

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });


  mainWindow.loadFile(path.join(__dirname, 'index.html'));



};


app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

