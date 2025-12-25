const { contextBridge, ipcRenderer } = require('electron');

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 标识 Electron 环境
  isElectron: true,
  // 打开外部应用
  openExternalApp: async (appPath) => {
    try {
      return await ipcRenderer.invoke('open-external-app', appPath);
    } catch (error) {
      console.error('调用打开外部应用失败:', error);
      return { success: false, error: error.message };
    }
  },
  // 可以在这里添加需要暴露给渲染进程的 API
  // 例如：
  // getVersion: () => process.versions.electron,
  // platform: process.platform,
});
