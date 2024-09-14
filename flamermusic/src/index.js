const { app, BrowserWindow } = require('electron');
const path = require('path');
const { config } = require('process');
const url = require('url');
const iconPath = path.join(__dirname, '/assets/images/icons/settings-icon.png');

if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1080,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    icon: iconPath,
    webPreferences: {
      preload: path.join(__dirname + '/preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
      enableRemoteModule: false
    },
  });

  mainWindow.loadFile(path.resolve(__dirname, 'index.html'));

  mainWindow.webContents.openDevTools();

  ipcMain.on(`display-app-menu`, function(e, args) {
    if (isWindows && mainWindow) {
      menu.popup({
        window: mainWindow,
        x: args.x,
        y: args.y
      });
    }
  });
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
