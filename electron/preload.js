const { contextBridge } = require('electron');

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 标识 Electron 环境
  isElectron: true,
  // 可以在这里添加需要暴露给渲染进程的 API
  // 例如：
  // getVersion: () => process.versions.electron,
  // platform: process.platform,
});
