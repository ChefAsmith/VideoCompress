const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  compressFile: (filePath) => ipcRenderer.invoke('compressFile', filePath)
});
