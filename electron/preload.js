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
  // 获取当前页面的资源路径（用于iframe中的base标签设置）
  getResourcePath: async (relativePath) => {
    try {
      return await ipcRenderer.invoke('get-resource-path', relativePath);
    } catch (error) {
      console.error('获取资源路径失败:', error);
      return null;
    }
  },
});
