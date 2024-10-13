// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const path = require('path');
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getAssetPath: (fileName) => path.join(__dirname, 'assets', 'icons', fileName)
});
