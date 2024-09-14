const { contextBridge } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('electron', {
    getStylesPath: () => path.join(__dirname, 'src/assets/styles'),
});
