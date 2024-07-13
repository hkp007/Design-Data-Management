
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  searchDataByDesign: async (designNo) => {
    return await ipcRenderer.invoke('searchDataByDesign', designNo);
  },
  searchByDate: (dateRange) => ipcRenderer.invoke('search-by-date', dateRange),
  exportToPDF: () => ipcRenderer.invoke('export-to-pdf'),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

// Expose ipcRenderer to the renderer process
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  invoke: async (channel, data) => {
    return await ipcRenderer.invoke(channel, data);
  },
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },
  off: (channel, listener) => {
    ipcRenderer.off(channel, listener);
  }
});