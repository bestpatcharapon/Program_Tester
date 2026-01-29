const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  // Window controls
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),

  // Test operations
  runTests: (config) => ipcRenderer.invoke('run-tests', config),
  getEvidence: () => ipcRenderer.invoke('get-evidence'),

  // Platform info
  platform: process.platform
})
